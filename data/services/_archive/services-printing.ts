import type { Service } from "@/types/service";
import { emailField, referenceFileField } from "./shared";

export const printingServices: Service[] = [
  {
    id: "business-cards",
    title: {
      ar: "بطاقات العمل",
      de: "Visitenkarten",
      en: "Business Cards",
    },
    description: {
      ar: "طباعة بطاقات عمل احترافية بجودة عالية وخيارات متعددة من الورق والتشطيب.",
      de: "Professioneller Visitenkartendruck mit hochwertigen Materialien und verschiedenen Veredelungsoptionen.",
      en: "Professional business card printing with high-quality materials and multiple finishing options.",
    },
    fields: [
      {
        id: "cardFormat",
        type: "select",
        label: {
          ar: "المقاس",
          de: "Format",
          en: "Format",
        },
        options: [
          { value: "85x55mm", label: { ar: "85×55 مم", de: "85×55 mm", en: "85×55 mm" } },
          { value: "90x50mm", label: { ar: "90×50 مم", de: "90×50 mm", en: "90×50 mm" } },
          { value: "custom", label: { ar: "مقاس مخصص", de: "Individuell", en: "Custom" } },
        ],
        required: true,
      },
      {
        id: "quantity",
        type: "select",
        label: {
          ar: "الكمية",
          de: "Menge",
          en: "Quantity",
        },
        options: [
          { value: "100", label: { ar: "100", de: "100", en: "100" } },
          { value: "250", label: { ar: "250", de: "250", en: "250" } },
          { value: "500", label: { ar: "500", de: "500", en: "500" } },
          { value: "1000", label: { ar: "1000", de: "1000", en: "1000" } },
        ],
        required: true,
      },
      {
        id: "paperType",
        type: "select",
        label: {
          ar: "نوع الورق",
          de: "Papiersorte",
          en: "Paper Type",
        },
        options: [
          { value: "matte", label: { ar: "مطفي", de: "Matt", en: "Matte" } },
          { value: "glossy", label: { ar: "لامع", de: "Glänzend", en: "Glossy" } },
          { value: "premium", label: { ar: "فاخر", de: "Premium", en: "Premium" } },
        ],
      },
      {
        id: "notes",
        type: "textarea",
        label: {
          ar: "ملاحظات إضافية",
          de: "Zusätzliche Hinweise",
          en: "Additional Notes",
        },
      },
      referenceFileField,
      emailField,
    ],
  },
];