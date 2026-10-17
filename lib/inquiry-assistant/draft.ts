import { editableFields, fieldVisible, germanValue, getCatalogService } from './catalog';
import type { ServiceField } from '../../types/service';

export type FieldValue = string | string[];
export type InquiryItem = { id: string; serviceId: string; values: Record<string, FieldValue> };
export type Contact = { fullName: string; email: string; phone: string; street: string; houseNumber: string; postalCode: string; city: string };
export type InquiryDraft = { version: 1; revision: number; items: InquiryItem[]; contact: Contact; reviewedRevision: number | null };
export type DraftAction =
  | { type: 'add'; itemId: string; serviceId: string }
  | { type: 'set'; itemId: string; fieldId: string; value: FieldValue }
  | { type: 'remove'; itemId: string }
  | { type: 'contact'; fieldId: keyof Contact; value: string };
const contactKeys = ['fullName','email','phone','street','houseNumber','postalCode','city'] as const;
const identifier = /^[a-zA-Z0-9_-]{1,80}$/;
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
function exactKeys(value: Record<string, unknown>, keys: string[]) {
  if (Object.keys(value).some(key => !keys.includes(key)) || keys.some(key => !Object.hasOwn(value,key))) throw new Error('Invalid action shape');
}
export function emptyDraft(): InquiryDraft {
  return {version:1,revision:0,items:[],contact:{fullName:'',email:'',phone:'',street:'',houseNumber:'',postalCode:'',city:''},reviewedRevision:null};
}
function fieldValue(field: ServiceField, value: unknown): FieldValue {
  if (field.type === 'checkbox') {
    if (!Array.isArray(value) || value.length > 50 || new Set(value).size !== value.length || value.some(v => typeof v !== 'string' || !field.options?.some(option => option.value === v))) throw new Error('Invalid selection');
    return [...value];
  }
  if (typeof value !== 'string' || value.length > 4000 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) throw new Error('Invalid field value');
  if (value && (field.type === 'select' || field.type === 'radio') && !field.options?.some(option => option.value === value)) throw new Error('Unknown option');
  if (value && field.type === 'number' && (!/^\d+(?:[.,]\d+)?$/.test(value) || !Number.isFinite(Number(value.replace(',','.'))))) throw new Error('Invalid number');
  if (value && field.type === 'date' && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value)) || new Date(value).toISOString().slice(0,10) !== value)) throw new Error('Invalid date');
  for (const bound of ['min','max'] as const) if (value && field.type === 'number' && typeof field[bound] === 'number') {
    const n = Number(value.replace(',','.'));
    if ((bound === 'min' && n < (field.min as number)) || (bound === 'max' && n > (field.max as number))) throw new Error('Outside catalogue range');
  }
  return value;
}
/** Atomic, revision-checked, side-effect-free. No action can submit, upload or approve. */
export function applyActions(base: InquiryDraft, expectedRevision: number, input: unknown): InquiryDraft {
  if (expectedRevision !== base.revision) throw new Error('Stale draft');
  if (!Array.isArray(input) || input.length === 0 || input.length > 50) throw new Error('Invalid actions');
  const next: InquiryDraft = structuredClone(base);
  for (const raw of input) {
    if (!record(raw) || typeof raw.type !== 'string') throw new Error('Invalid action');
    if (raw.type === 'contact') {
      exactKeys(raw,['type','fieldId','value']);
      if (!contactKeys.includes(raw.fieldId as keyof Contact) || typeof raw.value !== 'string' || raw.value.length > 300 || /[\r\n\u0000]/.test(raw.value)) throw new Error('Invalid contact');
      next.contact[raw.fieldId as keyof Contact] = raw.value;
      continue;
    }
    if (typeof raw.itemId !== 'string' || !identifier.test(raw.itemId)) throw new Error('Invalid item');
    if (raw.type === 'add') {
      exactKeys(raw,['type','itemId','serviceId']);
      if (typeof raw.serviceId !== 'string' || next.items.length >= 20 || next.items.some(item => item.id === raw.itemId)) throw new Error('Invalid new item');
      getCatalogService(raw.serviceId);
      next.items.push({id:raw.itemId,serviceId:raw.serviceId,values:{}});
    } else {
      const item = next.items.find(entry => entry.id === raw.itemId);
      if (!item) throw new Error('Missing item');
      if (raw.type === 'remove') {
        exactKeys(raw,['type','itemId']);
        next.items = next.items.filter(entry => entry.id !== raw.itemId);
      } else if (raw.type === 'set') {
        exactKeys(raw,['type','itemId','fieldId','value']);
        const field = editableFields(getCatalogService(item.serviceId)).find(entry => entry.id === raw.fieldId);
        if (!field || !fieldVisible(field,item.values)) throw new Error('Unknown or inactive field');
        if (typeof field.inquiryParent === 'string' && (field.inquiryQuantity || item.values[field.inquiryParent] === 'custom-quantity') && raw.value !== '' && (typeof raw.value !== 'string' || !/^[1-9]\d*$/.test(raw.value))) throw new Error('Invalid custom quantity');
        item.values[field.id] = fieldValue(field,raw.value);
      } else throw new Error('Unsupported action');
    }
  }
  // Remove dependent answers made inactive by a change, never forward stale hidden values.
  for (const item of next.items) for (const field of editableFields(getCatalogService(item.serviceId))) {
    if (!fieldVisible(field,item.values)) delete item.values[field.id];
  }
  next.revision++;
  next.reviewedRevision = null;
  return next;
}
export function missingFields(draft: InquiryDraft) {
  return draft.items.flatMap(item => editableFields(getCatalogService(item.serviceId))
    .filter(field => field.required && fieldVisible(field,item.values) && (!item.values[field.id] || (typeof item.values[field.id] === 'string' ? !(item.values[field.id] as string).trim() : item.values[field.id].length === 0)))
    .map(field => ({itemId:item.id,fieldId:field.id,label:field.label})));
}
/** Labels/options in German; free text must be translated upstream while preserving artwork wording. */
export function germanSummary(draft: InquiryDraft) {
  return draft.items.map((item,index) => {
    const service = getCatalogService(item.serviceId);
    return {itemId:item.id,title:`${index+1}. ${service.title.de}`,fields:editableFields(service)
      .filter(field => !field.inquiryParent && fieldVisible(field,item.values) && item.values[field.id]?.length)
      .map(field => ({id:field.id,label:field.label.de,value:['custom','custom-quantity'].includes(String(item.values[field.id]))
        ? String(item.values[`${field.id}__custom`] || 'Eigene Angabe noch offen')
        : germanValue(field,item.values[field.id])}))};
  });
}
/** UI review marker only. Future server intake must separately bind consent to its stored draft revision. */
export function markReviewed(draft: InquiryDraft): InquiryDraft {
  if (!draft.items.length || missingFields(draft).length || !draft.contact.fullName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.contact.email)) throw new Error('Review incomplete');
  return {...structuredClone(draft),reviewedRevision:draft.revision};
}
/** Rebuild untrusted browser drafts through the same catalogue validator; never trust review markers. */
export function parseDraft(raw: unknown): InquiryDraft {
  if (!record(raw) || raw.version !== 1 || !Number.isSafeInteger(raw.revision) || (raw.revision as number) < 0 || !Array.isArray(raw.items) || raw.items.length > 20 || !record(raw.contact)) throw new Error('Invalid draft');
  let next = emptyDraft();
  for (const item of raw.items) {
    if (!record(item) || !record(item.values)) throw new Error('Invalid item');
    next = applyActions(next,next.revision,[{type:'add',itemId:item.id,serviceId:item.serviceId}]);
    // Set designReady first so visibility is evaluated against its actual state.
    const rank=(id:string)=>id==='designReady'?0:id.endsWith('__custom')?2:1;
    const fields = Object.entries(item.values).sort(([a],[b]) => rank(a)-rank(b));
    if (fields.length > 100) throw new Error('Too many fields');
    for (const [fieldId,value] of fields) next = applyActions(next,next.revision,[{type:'set',itemId:item.id,fieldId,value}]);
  }
  for (const fieldId of contactKeys) {
    const value = raw.contact[fieldId];
    if (value !== undefined) next = applyActions(next,next.revision,[{type:'contact',fieldId,value}]);
  }
  next.revision = raw.revision as number;
  return next;
}
