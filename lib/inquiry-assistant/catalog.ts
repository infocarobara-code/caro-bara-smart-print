import { services } from '../../data/services';
import type { Service, ServiceField } from '../../types/service';

/** Public catalogue only. Never attach customer records, internal prices or credentials. */
export function serviceFields(service: Service): ServiceField[] {
  return service.sections?.length ? service.sections.flatMap(section => section.fields) : service.fields ?? [];
}
export function contactField(field: ServiceField): boolean {
  const id = field.id.toLowerCase();
  return field.semanticGroup === 'contact' || ['name', 'fullname', 'customername', 'phone', 'email', 'address', 'company'].includes(id)
    || ['contact', 'customer', 'whatsapp'].some(part => id.includes(part));
}
export function editableFields(service: Service): ServiceField[] {
  return serviceFields(service).filter(field => !contactField(field) && field.type !== 'file');
}
export function getCatalogService(id: string): Service {
  const service = services.find(entry => entry.id === id);
  if (!service) throw new Error('Unknown service');
  return service;
}
export function serviceIndex() {
  return services.map(service => ({ id: service.id, category: service.category, title: service.title,
    description: service.description, aliases: service.searchAliases ?? [], searchProfile: service.searchProfile ?? {} }));
}
export function serviceSchema(id: string) {
  const service = getCatalogService(id);
  const fields = editableFields(service);
  if (new Set(fields.map(field => field.id)).size !== fields.length) throw new Error('Ambiguous catalogue field IDs');
  return { id: service.id, title: service.title, path: `/request/service/${encodeURIComponent(service.id)}/form`,
    fields: fields.map(field => ({ id: field.id, type: field.type, label: field.label, required: field.required === true,
      helpText: field.helpText, options: field.options?.map(option => ({ value: option.value, label: option.label })) })),
    attachments: (service.attachments ?? []).map(file => ({id:file.id,title:file.title,required:file.required === true})) };
}
export function fieldVisible(field: ServiceField, values: Record<string, string | string[]>): boolean {
  return !(field.id === 'designDetails' && values.designReady === 'yes');
}
export function germanValue(field: ServiceField, value: string | string[]): string {
  const translate = (entry: string) => field.options?.find(option => option.value === entry)?.label.de ?? entry;
  return Array.isArray(value) ? value.map(translate).join(', ') : translate(value);
}
