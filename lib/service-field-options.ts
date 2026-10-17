import type { ServiceField, LanguageCode } from '@/types/service';
import { smartSizeOptions, smartQuantityOptions, smartPaperOptions, smartFinishingOptions, type LocalizedOption } from '@/components/service-form/serviceForm.helpers';

/** Shared with the existing service form. Existing explicit options always win. */
export function serviceFieldOptions(field: ServiceField, lang: LanguageCode = 'de') {
  const normalizeId = (value: string) => value.toLowerCase().replace(/[\s_-]+/g, '');
  const isSmartSizeField = (field: ServiceField) => {
    const fieldId = normalizeId(field.id);
    const label = normalizeId((field.label[lang] || field.label.en || field.label.de || field.label.ar || field.id));
    return (
      field.type === "select" &&
      (field.semanticGroup === "dimensions" ||
        fieldId.includes("size") ||
        fieldId.includes("format") ||
        fieldId.includes("dimension") ||
        fieldId.includes("measure") ||
        label.includes("size") ||
        label.includes("format") ||
        label.includes("maß") ||
        label.includes("masse") ||
        label.includes("مقاس"))
    );
  };

  const isSmartQuantityField = (field: ServiceField) => {
    const fieldId = normalizeId(field.id);
    const label = normalizeId((field.label[lang] || field.label.en || field.label.de || field.label.ar || field.id));
    return (
      field.type === "select" &&
      (fieldId.includes("quantity") ||
        fieldId.includes("qty") ||
        fieldId.includes("amount") ||
        label.includes("quantity") ||
        label.includes("menge") ||
        label.includes("كمية"))
    );
  };

  const isSmartPaperField = (field: ServiceField) => {
    const fieldId = normalizeId(field.id);
    const label = normalizeId((field.label[lang] || field.label.en || field.label.de || field.label.ar || field.id));
    return (
      field.type === "select" &&
      (field.semanticGroup === "materials" ||
        fieldId.includes("paper") ||
        fieldId.includes("stock") ||
        label.includes("paper") ||
        label.includes("papier") ||
        label.includes("ورق"))
    );
  };

  const isSmartFinishingField = (field: ServiceField) => {
    const fieldId = normalizeId(field.id);
    const label = normalizeId((field.label[lang] || field.label.en || field.label.de || field.label.ar || field.id));
    return (
      field.type === "select" &&
      (fieldId.includes("finish") ||
        fieldId.includes("finishing") ||
        fieldId.includes("lamination") ||
        fieldId.includes("postpress") ||
        label.includes("finish") ||
        label.includes("veredel") ||
        label.includes("تشطيب"))
    );
  };

  const mergeSmartOptions = (
    fieldOptions: ServiceField["options"],
    smartOptions: LocalizedOption[]
  ) => {
    const existing = fieldOptions || [];
    const seen = new Set<string>();
    const result: Array<{
      value: string;
      label: Partial<Record<LanguageCode, string>>;
    }> = [];

    [...existing, ...smartOptions].forEach((option) => {
      if (!option?.value || seen.has(option.value)) return;
      seen.add(option.value);
      result.push({
        value: option.value,
        label: option.label,
      });
    });

    return result;
  };

  const getEnhancedOptions = (field: ServiceField) => {
    const existingOptions = field.options || [];

    if (existingOptions.length > 0) {
      return existingOptions;
    }

    if (isSmartSizeField(field)) {
      return mergeSmartOptions(existingOptions, smartSizeOptions);
    }

    if (isSmartQuantityField(field)) {
      return mergeSmartOptions(existingOptions, smartQuantityOptions);
    }

    if (isSmartPaperField(field)) {
      return mergeSmartOptions(existingOptions, smartPaperOptions);
    }

    if (isSmartFinishingField(field)) {
      return mergeSmartOptions(existingOptions, smartFinishingOptions);
    }

    return existingOptions;
  };

  const getOptionListForField = (field: ServiceField) => {
    if (field.type === "select") {
      return getEnhancedOptions(field);
    }

    return field.options || [];
  };

  return getOptionListForField(field);
}

/** Custom quantities must remain quantities, even where the catalogue option is named "custom". */
export function isCustomQuantity(field:ServiceField,value:string):boolean {
  return value === 'custom-quantity' || (value === 'custom' &&
    (field.semanticGroup === 'quantity' || /quantity|qty|amount/i.test(field.id)));
}
