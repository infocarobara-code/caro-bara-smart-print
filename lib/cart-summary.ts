import type { CartItem } from "@/lib/cart";
import type { Language } from "@/lib/i18n";
import type { Service, ServiceField } from "@/types/service";
import { translateCartOption } from "@/lib/cart-presentation";
import { smartSizeOptions, smartQuantityOptions, smartPaperOptions, smartFinishingOptions } from "@/components/service-form/serviceForm.helpers";

const text = (value: unknown) => String(value ?? "").trim();
const localized = (value: Partial<Record<Language, string>> | undefined, language: Language, fallback: string) => value?.[language] || fallback;

function fieldOptions(field: ServiceField) {
  if (field.options?.length) return field.options;
  if (field.type !== "select") return [];
  const id = field.id.toLowerCase();
  if (field.semanticGroup === "dimensions" || /size|format|dimension|measure/.test(id)) return smartSizeOptions;
  if (/quantity|qty|amount/.test(id)) return smartQuantityOptions;
  if (field.semanticGroup === "materials" || /paper|stock/.test(id)) return smartPaperOptions;
  if (/finish|lamination|postpress/.test(id)) return smartFinishingOptions;
  return [];
}

export function summarizeCartItem(item: CartItem, service: Service | undefined, language: Language) {
  const definitions = new Map([...service?.fields || [], ...service?.sections?.flatMap(section => section.fields) || []].map(field => [field.id, field]));
  const entries = new Map((item.fields || []).map(field => [field.id, { label: field.label, value: field.value }]));
  Object.entries(item.data || {}).forEach(([id, value]) => {
    if (!id.startsWith("_") && !entries.has(id)) entries.set(id, { label: id, value });
  });
  const fields = [...entries].filter(([id]) => !id.startsWith("_") && !/^(quantity|qty|amount|count)$/i.test(id)).map(([id, entry]) => {
    const definition = definitions.get(id);
    const attachment = service?.attachments?.find(attachment => attachment.id === id);
    const value = item.canonicalData?.[id] ?? entry.value;
    return {
      id,
      label: localized(definition?.label || attachment?.title, language, entry.label),
      value: definition && ["select", "radio", "checkbox"].includes(definition.type) && !item.customFieldIds?.includes(id)
        ? translateCartOption(fieldOptions(definition), value, language, definition.type === "checkbox") : value,
    };
  }).filter(field => text(field.value));
  return {
    id: item.id,
    title: localized(service?.title, language, item.serviceTitle || item.serviceId),
    quantity: Math.max(1, Number(item.quantity) || 1),
    fields,
  };
}

export function buildCartMessage(items: CartItem[], services: Service[], language: Language) {
  const quantityLabel = { ar: "الكمية", de: "Menge", en: "Quantity" }[language];
  const heading = { ar: "استفسار غير ملزم - Caro Bara", de: "Unverbindliche Anfrage - Caro Bara", en: "Non-binding inquiry - Caro Bara" }[language];
  return heading + "\n\n" + items.map((item, index) => {
    const summary = summarizeCartItem(item, services.find(service => service.id === item.serviceId), language);
    return `${index + 1}. ${summary.title}\n${quantityLabel}: ${summary.quantity}\n` + summary.fields.map(field => `${field.label}: ${field.value}`).join("\n");
  }).join("\n\n");
}
