import { editableFields, getCatalogService } from './catalog';
import type { DraftAction, InquiryItem } from './draft';
import { splitSelectedValues } from '../../components/service-form/serviceForm.helpers';

/** ServiceForm's string representation is only a view; catalogue types remain authoritative. */
export function serviceFormValues(item:InquiryItem):Record<string,string> {
  return Object.fromEntries(Object.entries(item.values).map(([key,value])=>[key,Array.isArray(value)?value.join(', '):value]));
}
export function serviceFormAction(item:InquiryItem,fieldId:string,value:string):DraftAction {
  const field=editableFields(getCatalogService(item.serviceId)).find(field=>field.id===fieldId);
  if(!field)throw new Error('Unknown field');
  return {type:'set',itemId:item.id,fieldId,value:field.type==='checkbox'?splitSelectedValues(value):value};
}
