"use client";

import type { CSSProperties, FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import type { Service, ServiceField, ServiceSection } from "@/types/service";
import type { Language } from "@/lib/i18n";
import { addToCart } from "@/lib/cart";
import { analyzeRequest } from "@/lib/analyzeRequest";

type Props = {
  service: Service;
  lang: Language;
  onAddedToCart?: () => void;
};

type FormStatus = {
  type: "idle" | "error" | "success";
  message: string;
};

type LegacyFieldGroupKey = "dimensions" | "project" | "specifications" | "notes";

type LocalizedOption = {
  value: string;
  label: Partial<Record<Language, string>>;
};

type ServiceAttachment = NonNullable<Service["attachments"]>[number];

const formText = {
  selectPlaceholder: {
    ar: "اختر",
    de: "Wählen",
    en: "Select",
  },
  addToCart: {
    ar: "إضافة الطلب إلى السلة",
    de: "Anfrage zum Warenkorb hinzufügen",
    en: "Add Request to Cart",
  },
  addingToCart: {
    ar: "جارٍ الإضافة...",
    de: "Wird hinzugefügt...",
    en: "Adding...",
  },
  addedToCart: {
    ar: "تمت إضافة الطلب إلى السلة بنجاح.",
    de: "Die Anfrage wurde erfolgreich zum Warenkorb hinzugefügt.",
    en: "The request has been added to the cart successfully.",
  },
  dimensionsSectionTitle: {
    ar: "المقاسات والكميات الأساسية",
    de: "Maße & Grundmengen",
    en: "Dimensions & Core Quantities",
  },
  dimensionsSectionDescription: {
    ar: "ابدأ بالمقاسات والكميات الأساسية لأنها أهم نقطة لفهم الطلب بشكل صحيح.",
    de: "Beginne mit Maßen und Grundmengen, da sie der wichtigste Ausgangspunkt für das korrekte Verständnis der Anfrage sind.",
    en: "Start with dimensions and quantities, as they are the most important basis for understanding the request correctly.",
  },
  projectSectionTitle: {
    ar: "معلومات الطلب الأساسية",
    de: "Grundinformationen zur Anfrage",
    en: "Core Request Details",
  },
  projectSectionDescription: {
    ar: "حدد نوع الطلب والأساسيات المرتبطة به حتى يتم فهمه بالشكل الصحيح.",
    de: "Definiere den Typ der Anfrage und die wichtigsten Grundlagen für ein klares Verständnis.",
    en: "Define the type of request and its main foundations so it can be understood correctly.",
  },
  specificationsSectionTitle: {
    ar: "المواصفات والخيارات",
    de: "Spezifikationen & Optionen",
    en: "Specifications & Options",
  },
  specificationsSectionDescription: {
    ar: "أضف المواد والتفضيلات والخيارات الفنية المرتبطة بهذه الخدمة.",
    de: "Ergänze Materialien, Präferenzen und technische Optionen für diesen Service.",
    en: "Add materials, preferences, and technical options related to this service.",
  },
  notesSectionTitle: {
    ar: "ملاحظات وتفاصيل إضافية",
    de: "Zusätzliche Hinweise & Details",
    en: "Additional Notes & Details",
  },
  notesSectionDescription: {
    ar: "أي معلومات إضافية تساعدنا على فهم الطلب وتنفيذه بشكل أدق.",
    de: "Weitere Informationen, die uns helfen, die Anfrage genauer zu verstehen und umzusetzen.",
    en: "Any extra details that help us understand and handle the request more accurately.",
  },
  optionalInline: {
    ar: "اختياري",
    de: "Optional",
    en: "Optional",
  },
  fileOptionalHint: {
    ar: "إرفاق ملف مرجعي — اختياري",
    de: "Referenzdatei hochladen — optional",
    en: "Upload reference file — optional",
  },
  analysisTitle: {
    ar: "تحليل الطلب الذكي",
    de: "Intelligente Anfragenanalyse",
    en: "Smart Request Analysis",
  },
  summaryTitle: {
    ar: "ملخص سريع",
    de: "Kurze Zusammenfassung",
    en: "Quick Summary",
  },
  missingTitle: {
    ar: "أشياء ناقصة",
    de: "Fehlende Angaben",
    en: "Missing Details",
  },
  suggestionsTitle: {
    ar: "اقتراحات ذكية",
    de: "Intelligente Vorschläge",
    en: "Smart Suggestions",
  },
  completionTitle: {
    ar: "اكتمال الطلب",
    de: "Vollständigkeit der Anfrage",
    en: "Request Completion",
  },
  analysisHelper: {
    ar: "يبقى هذا التحليل أمام العميل أثناء التعبئة ويتحدث تلقائيًا حسب المعلومات المدخلة.",
    de: "Diese Analyse bleibt während des Ausfüllens sichtbar und aktualisiert sich automatisch anhand der Eingaben.",
    en: "This analysis stays visible while filling the form and updates automatically based on the entered information.",
  },
  noMissing: {
    ar: "لا توجد نواقص أساسية حتى الآن.",
    de: "Aktuell fehlen keine grundlegenden Angaben.",
    en: "No essential details are missing at the moment.",
  },
  noSuggestions: {
    ar: "لا توجد اقتراحات إضافية حاليًا.",
    de: "Aktuell gibt es keine zusätzlichen Vorschläge.",
    en: "There are no additional suggestions at the moment.",
  },
  mobileAnalysisCollapsed: {
    ar: "تحليل الطلب",
    de: "Analyse",
    en: "Analysis",
  },
  openAnalysis: {
    ar: "فتح",
    de: "Öffnen",
    en: "Open",
  },
  closeAnalysis: {
    ar: "إغلاق",
    de: "Schließen",
    en: "Close",
  },
  customSizeLabel: {
    ar: "مقاس مخصص",
    de: "Individuelles Maß",
    en: "Custom Size",
  },
  customSizePlaceholder: {
    ar: "مثال: 120×200 سم أو 85×55 مم",
    de: "z. B. 120×200 cm oder 85×55 mm",
    en: "e.g. 120×200 cm or 85×55 mm",
  },
  customQuantityLabel: {
    ar: "كمية مخصصة",
    de: "Individuelle Menge",
    en: "Custom Quantity",
  },
  customQuantityPlaceholder: {
    ar: "اكتب الكمية المطلوبة",
    de: "Gewünschte Menge eingeben",
    en: "Enter required quantity",
  },
  introTitle: {
    ar: "قبل أن تبدأ",
    de: "Bevor du beginnst",
    en: "Before You Start",
  },
  guidanceTitle: {
    ar: "إرشادات مفيدة",
    de: "Hilfreiche Hinweise",
    en: "Helpful Guidance",
  },
  attachmentsSectionTitle: {
    ar: "الملفات والمرفقات",
    de: "Dateien & Anhänge",
    en: "Files & Attachments",
  },
  attachmentsSectionDescription: {
    ar: "يمكنك إرفاق صور الموقع أو ملفات التصميم أو أي ملفات مرجعية تساعدنا على فهم الطلب بشكل أدق.",
    de: "Du kannst Standortfotos, Designdateien oder andere Referenzen hochladen, damit wir die Anfrage besser verstehen.",
    en: "You can upload site photos, design files, or any reference material that helps us understand the request more accurately.",
  },
  selectedOption: {
    ar: "محدد",
    de: "Ausgewählt",
    en: "Selected",
  },
};

const smartSizeOptions: LocalizedOption[] = [
  { value: "a6", label: { ar: "A6", de: "A6", en: "A6" } },
  { value: "a5", label: { ar: "A5", de: "A5", en: "A5" } },
  { value: "a4", label: { ar: "A4", de: "A4", en: "A4" } },
  { value: "a3", label: { ar: "A3", de: "A3", en: "A3" } },
  { value: "85x55mm", label: { ar: "85×55 مم", de: "85×55 mm", en: "85×55 mm" } },
  { value: "dl", label: { ar: "DL", de: "DL", en: "DL" } },
  { value: "custom", label: { ar: "مقاس مخصص", de: "Individuelles Maß", en: "Custom" } },
];

const smartQuantityOptions: LocalizedOption[] = [
  { value: "50", label: { ar: "50", de: "50", en: "50" } },
  { value: "100", label: { ar: "100", de: "100", en: "100" } },
  { value: "250", label: { ar: "250", de: "250", en: "250" } },
  { value: "500", label: { ar: "500", de: "500", en: "500" } },
  { value: "1000", label: { ar: "1000", de: "1000", en: "1000" } },
  { value: "2000", label: { ar: "2000", de: "2000", en: "2000" } },
  { value: "2500", label: { ar: "2500", de: "2500", en: "2500" } },
  { value: "3000", label: { ar: "3000", de: "3000", en: "3000" } },
  { value: "4000", label: { ar: "4000", de: "4000", en: "4000" } },
  { value: "5000", label: { ar: "5000", de: "5000", en: "5000" } },
  { value: "6000", label: { ar: "6000", de: "6000", en: "6000" } },
  { value: "7000", label: { ar: "7000", de: "7000", en: "7000" } },
  { value: "8000", label: { ar: "8000", de: "8000", en: "8000" } },
  { value: "9000", label: { ar: "9000", de: "9000", en: "9000" } },
  { value: "10000", label: { ar: "10000", de: "10000", en: "10000" } },
  { value: "20000", label: { ar: "20000", de: "20000", en: "20000" } },
  { value: "30000", label: { ar: "30000", de: "30000", en: "30000" } },
  { value: "40000", label: { ar: "40000", de: "40000", en: "40000" } },
  { value: "50000", label: { ar: "50000", de: "50000", en: "50000" } },
  {
    value: "custom-quantity",
    label: {
      ar: "كمية مخصصة",
      de: "Individuelle Menge",
      en: "Custom Quantity",
    },
  },
];

const smartPaperOptions: LocalizedOption[] = [
  { value: "matte", label: { ar: "مطفي", de: "Matt", en: "Matte" } },
  { value: "glossy", label: { ar: "لامع", de: "Glänzend", en: "Glossy" } },
  { value: "premium", label: { ar: "فاخر", de: "Premium", en: "Premium" } },
  { value: "kraft", label: { ar: "كرافت", de: "Kraft", en: "Kraft" } },
  { value: "offset", label: { ar: "أوفست", de: "Offset", en: "Offset" } },
  { value: "not-sure-paper", label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" } },
];

const smartFinishingOptions: LocalizedOption[] = [
  {
    value: "matte-lamination",
    label: {
      ar: "تغليف مطفي",
      de: "Mattlaminierung",
      en: "Matte Lamination",
    },
  },
  {
    value: "glossy-lamination",
    label: {
      ar: "تغليف لامع",
      de: "Glanzlaminierung",
      en: "Glossy Lamination",
    },
  },
  { value: "uv", label: { ar: "UV", de: "UV", en: "UV" } },
  { value: "folding", label: { ar: "طي", de: "Falzen", en: "Folding" } },
  { value: "cutting", label: { ar: "قص", de: "Schneiden", en: "Cutting" } },
  {
    value: "rounded-corners",
    label: {
      ar: "زوايا دائرية",
      de: "Abgerundete Ecken",
      en: "Rounded Corners",
    },
  },
  { value: "none", label: { ar: "بدون", de: "Keine", en: "None" } },
  {
    value: "not-sure-finishing",
    label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" },
  },
];

export default function ServiceForm({ service, lang, onAddedToCart }: Props) {
  const isArabic = lang === "ar";

  const [formState, setFormState] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>({
    type: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileAnalysisOpen, setMobileAnalysisOpen] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      setIsDesktop(width >= 1100);
      setIsMobile(width <= 768);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setMobileAnalysisOpen(false);
    }
  }, [isMobile]);

  const getLocalizedText = (
    value?: Partial<Record<Language, string>>,
    fallback = ""
  ) => {
    if (!value) return fallback;
    return value[lang] || value.en || value.de || value.ar || fallback;
  };

  const getLocalizedLabel = (field: ServiceField) => {
    return getLocalizedText(field.label, field.id);
  };

  const getLocalizedPlaceholder = (field: ServiceField) => {
    const localized = getLocalizedText(field.placeholder, "");

    if (field.required) {
      return localized || getLocalizedLabel(field);
    }

    if (localized) {
      return `${localized} — ${formText.optionalInline[lang]}`;
    }

    return `${getLocalizedLabel(field)} — ${formText.optionalInline[lang]}`;
  };

  const getLocalizedSelectPlaceholder = (field: ServiceField) => {
    if (field.required) {
      return formText.selectPlaceholder[lang];
    }

    return `${formText.selectPlaceholder[lang]} — ${formText.optionalInline[lang]}`;
  };

  const normalizeId = (value: string) => value.toLowerCase().replace(/[\s_-]+/g, "");

  const isContactField = (field: ServiceField) => {
    const fieldId = field.id.toLowerCase();

    return (
      fieldId === "name" ||
      fieldId === "fullname" ||
      fieldId === "customername" ||
      fieldId === "phone" ||
      fieldId === "email" ||
      fieldId === "address" ||
      fieldId === "company" ||
      fieldId.includes("contact") ||
      fieldId.includes("customer") ||
      fieldId.includes("whatsapp")
    );
  };

  const isSmartSizeField = (field: ServiceField) => {
    const fieldId = normalizeId(field.id);
    const label = normalizeId(getLocalizedLabel(field));
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
    const label = normalizeId(getLocalizedLabel(field));
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
    const label = normalizeId(getLocalizedLabel(field));
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
    const label = normalizeId(getLocalizedLabel(field));
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
      label: Partial<Record<Language, string>>;
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

  const getCustomFieldId = (field: ServiceField) => `${field.id}__custom`;

  const shouldShowCustomField = (field: ServiceField) => {
    const selectedValue = formState[field.id] || "";
    return selectedValue === "custom" || selectedValue === "custom-quantity";
  };

  const getResolvedFieldValue = (field: ServiceField, rawValue: string) => {
    if (!shouldShowCustomField(field)) {
      return rawValue;
    }

    const customValue = (formState[getCustomFieldId(field)] || "").trim();

    if (!customValue) {
      return rawValue;
    }

    return customValue;
  };

  const shouldHideField = (field: ServiceField) => {
    if (isContactField(field)) {
      return true;
    }

    if (field.id === "designDetails" && formState.designReady === "yes") {
      return true;
    }

    if (field.id === "fileUpload" && formState.designReady === "yes") {
      return true;
    }

    return false;
  };

  const classifyLegacyField = (field: ServiceField): LegacyFieldGroupKey => {
    const fieldId = field.id.toLowerCase();

    if (
      field.semanticGroup === "dimensions" ||
      fieldId.includes("width") ||
      fieldId.includes("height") ||
      fieldId.includes("length") ||
      fieldId.includes("size") ||
      fieldId.includes("dimension") ||
      fieldId.includes("measure") ||
      fieldId.includes("quantity") ||
      fieldId.includes("qty")
    ) {
      return "dimensions";
    }

    if (
      field.semanticGroup === "notes" ||
      fieldId.includes("note") ||
      fieldId.includes("details") ||
      fieldId.includes("message") ||
      fieldId.includes("comment") ||
      field.type === "textarea"
    ) {
      return "notes";
    }

    if (
      field.semanticGroup === "materials" ||
      field.semanticGroup === "production" ||
      field.semanticGroup === "design" ||
      field.semanticGroup === "installation" ||
      field.semanticGroup === "delivery" ||
      field.semanticGroup === "attachments" ||
      fieldId.includes("material") ||
      fieldId.includes("color") ||
      fieldId.includes("finish") ||
      fieldId.includes("mount") ||
      fieldId.includes("print") ||
      fieldId.includes("design") ||
      fieldId.includes("file") ||
      fieldId.includes("upload") ||
      field.type === "checkbox" ||
      field.type === "radio" ||
      field.type === "select"
    ) {
      return "specifications";
    }

    return "project";
  };

  const getFieldPriority = (field: ServiceField) => {
    const fieldId = field.id.toLowerCase();

    if (fieldId.includes("width")) return 1;
    if (fieldId.includes("height")) return 2;
    if (fieldId.includes("length")) return 3;
    if (fieldId.includes("size")) return 4;
    if (fieldId.includes("quantity") || fieldId.includes("qty")) return 5;

    if (field.type === "select") return 20;
    if (field.type === "radio") return 21;
    if (field.type === "checkbox") return 22;
    if (field.type === "file") return 23;
    if (field.type === "textarea") return 30;

    return 10;
  };

  function getLegacySectionText(group: LegacyFieldGroupKey) {
    switch (group) {
      case "dimensions":
        return {
          title: formText.dimensionsSectionTitle,
          description: formText.dimensionsSectionDescription,
        };
      case "project":
        return {
          title: formText.projectSectionTitle,
          description: formText.projectSectionDescription,
        };
      case "specifications":
        return {
          title: formText.specificationsSectionTitle,
          description: formText.specificationsSectionDescription,
        };
      case "notes":
        return {
          title: formText.notesSectionTitle,
          description: formText.notesSectionDescription,
        };
      default:
        return {
          title: { ar: "", de: "", en: "" },
          description: { ar: "", de: "", en: "" },
        };
    }
  }

  const resolvedSections = useMemo(() => {
    if (service.sections?.length) {
      return service.sections
        .map((section) => ({
          ...section,
          fields: section.fields.filter((field) => !shouldHideField(field)),
        }))
        .filter((section) => section.fields.length > 0);
    }

    const legacyFields = (service.fields || [])
      .filter((field) => !shouldHideField(field))
      .sort((a, b) => getFieldPriority(a) - getFieldPriority(b));

    const grouped = {
      dimensions: legacyFields.filter(
        (field) => classifyLegacyField(field) === "dimensions"
      ),
      project: legacyFields.filter(
        (field) => classifyLegacyField(field) === "project"
      ),
      specifications: legacyFields.filter(
        (field) => classifyLegacyField(field) === "specifications"
      ),
      notes: legacyFields.filter((field) => classifyLegacyField(field) === "notes"),
    };

    const legacySectionOrder: LegacyFieldGroupKey[] = [
      "dimensions",
      "project",
      "specifications",
      "notes",
    ];

    return legacySectionOrder
      .map<ServiceSection>((group) => {
        const sectionText = getLegacySectionText(group);

        return {
          id: group,
          title: {
            ar: sectionText.title.ar,
            de: sectionText.title.de,
            en: sectionText.title.en,
          },
          description: {
            ar: sectionText.description.ar,
            de: sectionText.description.de,
            en: sectionText.description.en,
          },
          fields: grouped[group],
        };
      })
      .filter((section) => section.fields.length > 0);
  }, [service.sections, service.fields, formState]);

  const allVisibleFields = useMemo(() => {
    return resolvedSections.flatMap((section) => section.fields);
  }, [resolvedSections]);

  const visibleAttachments = useMemo(() => {
    return (service.attachments || []).filter(Boolean);
  }, [service.attachments]);

  const analysis = useMemo(() => {
    return analyzeRequest(service.id, formState, lang);
  }, [service.id, formState, lang]);

  const getFieldValue = (form: HTMLFormElement, field: ServiceField): string => {
    if (field.type === "checkbox") {
      const checked = form.querySelectorAll(
        `input[name="${field.id}"]:checked`
      ) as NodeListOf<HTMLInputElement>;

      return Array.from(checked)
        .map((item) => item.value)
        .join(", ");
    }

    if (field.type === "radio") {
      const selectedRadio = form.querySelector(
        `input[name="${field.id}"]:checked`
      ) as HTMLInputElement | null;

      return selectedRadio?.value || "";
    }

    if (field.type === "select") {
      const select = form.elements.namedItem(field.id) as HTMLSelectElement | null;
      return select?.value || "";
    }

    if (field.type === "file") {
      const fileInput = form.elements.namedItem(field.id) as HTMLInputElement | null;
      const files = fileInput?.files;

      if (!files || files.length === 0) return "";

      return Array.from(files)
        .map((file) => file.name)
        .join(", ");
    }

    const input = form.elements.namedItem(field.id) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;

    return input?.value?.trim() || "";
  };

  const getAttachmentValue = (form: HTMLFormElement, attachmentId: string) => {
    const input = form.elements.namedItem(attachmentId) as HTMLInputElement | null;
    const files = input?.files;

    if (!files || files.length === 0) return "";

    return Array.from(files)
      .map((file) => file.name)
      .join(", ");
  };

  const handleFieldStateChange = (fieldId: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    if (status.type !== "idle") {
      setStatus({
        type: "idle",
        message: "",
      });
    }
  };

  const handleCheckboxChange = (
    fieldId: string,
    optionValue: string,
    checked: boolean
  ) => {
    setFormState((prev) => {
      const current = prev[fieldId]
        ? prev[fieldId]
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [];

      let next = current;

      if (checked) {
        if (!current.includes(optionValue)) {
          next = [...current, optionValue];
        }
      } else {
        next = current.filter((item) => item !== optionValue);
      }

      return {
        ...prev,
        [fieldId]: next.join(", "),
      };
    });

    if (status.type !== "idle") {
      setStatus({
        type: "idle",
        message: "",
      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    setIsSubmitting(true);

    const data: Record<string, string> = {};

    allVisibleFields.forEach((field) => {
      const rawValue = getFieldValue(form, field);
      const value = getResolvedFieldValue(field, rawValue);

      if (value) {
        data[field.id] = value;
      }
    });

    visibleAttachments.forEach((attachment) => {
      const value = getAttachmentValue(form, attachment.id);
      if (value) {
        data[attachment.id] = value;
      }
    });

    try {
      addToCart({
        serviceId: service.id,
        data,
      });

      window.dispatchEvent(new Event("cart-updated"));
      onAddedToCart?.();

      setStatus({
        type: "success",
        message: formText.addedToCart[lang],
      });

      form.reset();
      setFormState({});
      setMobileAnalysisOpen(false);
    } catch {
      setStatus({
        type: "error",
        message:
          lang === "ar"
            ? "حدث خطأ أثناء إضافة الطلب إلى السلة. يرجى المحاولة مرة أخرى."
            : lang === "de"
              ? "Beim Hinzufügen zum Warenkorb ist ein Fehler aufgetreten. Bitte versuche es erneut."
              : "An error occurred while adding the request to the cart. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldSpanStyle = (field: ServiceField): CSSProperties => {
    const isWideField =
      field.type === "textarea" ||
      field.type === "file" ||
      field.type === "checkbox" ||
      field.type === "radio";

    return {
      gridColumn: isWideField ? "1 / -1" : "span 1",
    };
  };

  const getOptionCardStyle = (selected: boolean): CSSProperties => ({
    ...styles.optionCard,
    border: selected ? "1px solid #b89267" : "1px solid #e6d9ca",
    background: selected ? "#fff6ec" : "#fffdfa",
    boxShadow: selected ? "0 6px 14px rgba(184, 146, 103, 0.12)" : "none",
  });

  const scoreColor =
    analysis.score >= 80 ? "#2f6b3d" : analysis.score >= 50 ? "#8a673b" : "#8b2f25";

  const styles = {
    shell: {
      display: isDesktop ? "grid" : "block",
      gridTemplateColumns: isDesktop
        ? isArabic
          ? "340px minmax(0, 1fr)"
          : "minmax(0, 1fr) 340px"
        : undefined,
      gap: isMobile ? "12px" : "16px",
      alignItems: "start",
      paddingBottom: 0,
    } satisfies CSSProperties,

    form: {
      marginTop: 0,
      padding: isMobile ? "12px" : "14px",
      border: "1px solid #e7dacb",
      borderRadius: isMobile ? "16px" : "18px",
      background: "rgba(255,255,255,0.95)",
      boxShadow: "0 8px 22px rgba(89, 68, 41, 0.05)",
      backdropFilter: "blur(4px)",
      minWidth: 0,
    } satisfies CSSProperties,

    introBox: {
      marginBottom: "12px",
      padding: isMobile ? "12px" : "14px",
      borderRadius: isMobile ? "14px" : "16px",
      border: "1px solid #eadccc",
      background: "linear-gradient(180deg, #fffaf4 0%, #fffdf9 100%)",
      boxShadow: "0 4px 14px rgba(89, 68, 41, 0.04)",
    } satisfies CSSProperties,

    introTitle: {
      margin: 0,
      fontSize: isMobile ? "13px" : "14px",
      fontWeight: 800,
      color: "#33271d",
    } satisfies CSSProperties,

    introText: {
      margin: "8px 0 0",
      fontSize: isMobile ? "12px" : "13px",
      lineHeight: 1.8,
      color: "#5f4d3d",
    } satisfies CSSProperties,

    guidanceWrap: {
      marginTop: "12px",
      paddingTop: "12px",
      borderTop: "1px solid #efe3d6",
    } satisfies CSSProperties,

    guidanceTitle: {
      margin: 0,
      fontSize: isMobile ? "12px" : "13px",
      fontWeight: 800,
      color: "#3a2d22",
    } satisfies CSSProperties,

    guidanceList: {
      margin: "8px 0 0",
      paddingInlineStart: "18px",
      color: "#6d5846",
      fontSize: isMobile ? "12px" : "13px",
      lineHeight: 1.8,
    } satisfies CSSProperties,

    statusBox: {
      marginBottom: "12px",
      padding: "11px 13px",
      borderRadius: "12px",
      fontSize: "13px",
      lineHeight: 1.65,
      fontWeight: 600,
    } satisfies CSSProperties,

    analysisColumn: {
      position: isDesktop ? "sticky" : "static",
      top: isDesktop ? "92px" : undefined,
      alignSelf: "start",
    } satisfies CSSProperties,

    analysisBox: {
      marginBottom: isDesktop ? 0 : "12px",
      padding: isMobile ? "14px" : "16px",
      borderRadius: isMobile ? "16px" : "18px",
      border: "1px solid #e7dacb",
      background: "#fffaf4",
      boxShadow: "0 6px 18px rgba(89, 68, 41, 0.04)",
    } satisfies CSSProperties,

    analysisTitle: {
      margin: "0 0 6px",
      fontSize: isMobile ? "15px" : "16px",
      fontWeight: 800,
      color: "#2f2419",
    } satisfies CSSProperties,

    analysisHelper: {
      margin: "0 0 12px",
      fontSize: isMobile ? "11px" : "12px",
      lineHeight: 1.7,
      color: "#7b6551",
    } satisfies CSSProperties,

    analysisSection: {
      paddingTop: "12px",
      marginTop: "12px",
      borderTop: "1px solid #eee2d3",
    } satisfies CSSProperties,

    analysisRowTitle: {
      margin: "0 0 6px",
      fontSize: isMobile ? "12px" : "13px",
      fontWeight: 800,
      color: "#3a2d22",
    } satisfies CSSProperties,

    analysisText: {
      margin: 0,
      fontSize: isMobile ? "12px" : "13px",
      lineHeight: 1.75,
      color: "#5f4d3d",
      wordBreak: "break-word",
    } satisfies CSSProperties,

    analysisList: {
      margin: 0,
      paddingInlineStart: "18px",
      fontSize: isMobile ? "12px" : "13px",
      lineHeight: 1.75,
    } satisfies CSSProperties,

    scoreWrap: {
      marginTop: "12px",
      paddingTop: "12px",
      borderTop: "1px solid #eee2d3",
    } satisfies CSSProperties,

    scoreValue: {
      fontSize: isMobile ? "20px" : "22px",
      fontWeight: 800,
      color: scoreColor,
      lineHeight: 1.1,
      margin: "4px 0 8px",
    } satisfies CSSProperties,

    scoreBarTrack: {
      width: "100%",
      height: "10px",
      borderRadius: "999px",
      background: "#eadfd3",
      overflow: "hidden",
      marginTop: "4px",
    } satisfies CSSProperties,

    scoreBarFill: {
      height: "100%",
      borderRadius: "999px",
      background:
        analysis.score >= 80
          ? "linear-gradient(90deg, #3d7b4f 0%, #245a30 100%)"
          : analysis.score >= 50
            ? "linear-gradient(90deg, #a07a49 0%, #7f5d35 100%)"
            : "linear-gradient(90deg, #b34c40 0%, #8b2f25 100%)",
      transition: "width 0.2s ease",
    } satisfies CSSProperties,

    section: {
      marginTop: "10px",
      padding: isMobile ? "11px" : "12px",
      borderRadius: isMobile ? "14px" : "15px",
      border: "1px solid #eadfd3",
      background: "#fffdfa",
    } satisfies CSSProperties,

    sectionHeader: {
      marginBottom: "10px",
    } satisfies CSSProperties,

    sectionTitle: {
      margin: 0,
      fontSize: isMobile ? "13px" : "14px",
      lineHeight: 1.35,
      fontWeight: 800,
      color: "#33271d",
    } satisfies CSSProperties,

    sectionDescription: {
      margin: "5px 0 0",
      fontSize: isMobile ? "11px" : "12px",
      lineHeight: 1.65,
      color: "#6e5947",
    } satisfies CSSProperties,

    fieldsGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(220px, 1fr))",
      gap: isMobile ? "9px" : "10px",
    } satisfies CSSProperties,

    fieldWrapper: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      minWidth: 0,
    } satisfies CSSProperties,

    label: {
      fontSize: isMobile ? "11px" : "12px",
      lineHeight: 1.45,
      fontWeight: 700,
      color: "#34281e",
    } satisfies CSSProperties,

    input: {
      width: "100%",
      minHeight: isMobile ? "40px" : "42px",
      padding: isMobile ? "9px 10px" : "10px 11px",
      border: "1px solid #dbc9b5",
      borderRadius: "11px",
      fontSize: isMobile ? "13px" : "14px",
      color: "#2f2419",
      background: "#fffdfa",
      outline: "none",
      boxSizing: "border-box",
    } satisfies CSSProperties,

    textarea: {
      width: "100%",
      minHeight: isMobile ? "90px" : "96px",
      padding: isMobile ? "10px" : "11px",
      border: "1px solid #dbc9b5",
      borderRadius: "12px",
      fontSize: isMobile ? "13px" : "14px",
      color: "#2f2419",
      background: "#fffdfa",
      outline: "none",
      resize: "vertical",
      boxSizing: "border-box",
      lineHeight: 1.7,
    } satisfies CSSProperties,

    optionList: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
      gap: "7px",
    } satisfies CSSProperties,

    optionCard: {
      display: "flex",
      alignItems: "flex-start",
      gap: "9px",
      padding: isMobile ? "8px 9px" : "9px 10px",
      borderRadius: "11px",
      background: "#fffdfa",
      cursor: "pointer",
      lineHeight: 1.6,
      color: "#3b2f24",
      fontSize: isMobile ? "12px" : "13px",
      transition: "all 0.18s ease",
      minWidth: 0,
    } satisfies CSSProperties,

    optionTextWrap: {
      display: "flex",
      flexDirection: "column",
      gap: "2px",
      minWidth: 0,
      flex: 1,
    } satisfies CSSProperties,

    optionSelectedHint: {
      fontSize: "11px",
      lineHeight: 1.4,
      color: "#9b6d3d",
      fontWeight: 700,
    } satisfies CSSProperties,

    fileInputWrap: {
      padding: "10px",
      borderRadius: "12px",
      border: "1px dashed #d8c2a8",
      background: "#fff9f2",
    } satisfies CSSProperties,

    fileHint: {
      fontSize: isMobile ? "11px" : "12px",
      lineHeight: 1.5,
      color: "#8b7156",
      marginBottom: "7px",
    } satisfies CSSProperties,

    attachmentDescription: {
      margin: "0 0 8px",
      fontSize: isMobile ? "11px" : "12px",
      lineHeight: 1.6,
      color: "#7a6350",
    } satisfies CSSProperties,

    submitRow: {
      marginTop: "14px",
      display: "flex",
      justifyContent: isMobile ? "stretch" : isArabic ? "flex-start" : "flex-end",
    } satisfies CSSProperties,

    submitButton: {
      width: "100%",
      maxWidth: isMobile ? "100%" : "260px",
      minHeight: isMobile ? "44px" : "46px",
      padding: isMobile ? "10px 16px" : "11px 18px",
      borderRadius: "14px",
      border: "1px solid #241a12",
      background: "#1f1711",
      color: "#ffffff",
      cursor: "pointer",
      fontSize: isMobile ? "13px" : "14px",
      fontWeight: 800,
      boxShadow: "0 8px 18px rgba(34, 23, 16, 0.12)",
    } satisfies CSSProperties,

    mobileAnalysisToggle: {
      width: "100%",
      minHeight: "44px",
      padding: "10px 12px",
      borderRadius: "14px",
      border: "1px solid #ddcfbe",
      background: "#fffaf4",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "10px",
      cursor: "pointer",
      color: "#2f2419",
      fontSize: "12px",
      fontWeight: 800,
      boxShadow: "0 4px 12px rgba(55, 40, 24, 0.05)",
    } satisfies CSSProperties,

    mobileAnalysisToggleLeft: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      minWidth: 0,
      flex: 1,
    } satisfies CSSProperties,

    mobileAnalysisDot: {
      width: "8px",
      height: "8px",
      borderRadius: "999px",
      background: scoreColor,
      flexShrink: 0,
    } satisfies CSSProperties,

    mobileAnalysisToggleText: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    } satisfies CSSProperties,

    mobileAnalysisScore: {
      color: scoreColor,
      fontSize: "13px",
      fontWeight: 900,
      flexShrink: 0,
    } satisfies CSSProperties,

    helperInputWrap: {
      marginTop: "8px",
    } satisfies CSSProperties,
  };

  const renderAnalysisContent = () => (
    <>
      <h3 style={styles.analysisTitle}>{formText.analysisTitle[lang]}</h3>
      <p style={styles.analysisHelper}>{formText.analysisHelper[lang]}</p>

      <div>
        <h4 style={styles.analysisRowTitle}>{formText.summaryTitle[lang]}</h4>
        <p style={styles.analysisText}>{analysis.summary}</p>
      </div>

      <div style={styles.analysisSection}>
        <h4 style={styles.analysisRowTitle}>{formText.missingTitle[lang]}</h4>
        {analysis.missing.length > 0 ? (
          <ul style={{ ...styles.analysisList, color: "#8b2f25" }}>
            {analysis.missing.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p style={styles.analysisText}>{formText.noMissing[lang]}</p>
        )}
      </div>

      <div style={styles.analysisSection}>
        <h4 style={styles.analysisRowTitle}>{formText.suggestionsTitle[lang]}</h4>
        {analysis.suggestions.length > 0 ? (
          <ul style={{ ...styles.analysisList, color: "#6d543d" }}>
            {analysis.suggestions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p style={styles.analysisText}>{formText.noSuggestions[lang]}</p>
        )}
      </div>

      <div style={styles.scoreWrap}>
        <h4 style={styles.analysisRowTitle}>{formText.completionTitle[lang]}</h4>
        <div style={styles.scoreValue}>{analysis.score}%</div>
        <div style={styles.scoreBarTrack}>
          <div
            style={{
              ...styles.scoreBarFill,
              width: `${analysis.score}%`,
            }}
          />
        </div>
      </div>
    </>
  );

  const renderDesktopAnalysis = () => (
    <div style={styles.analysisColumn}>
      <div style={styles.analysisBox}>{renderAnalysisContent()}</div>
    </div>
  );

  const renderMobileInlineAnalysis = () => {
    if (!isMobile) return null;

    return (
      <div style={styles.analysisBox}>
        <button
          type="button"
          onClick={() => setMobileAnalysisOpen((prev) => !prev)}
          aria-expanded={mobileAnalysisOpen}
          style={styles.mobileAnalysisToggle}
        >
          <div style={styles.mobileAnalysisToggleLeft}>
            <span style={styles.mobileAnalysisDot} />
            <span style={styles.mobileAnalysisToggleText}>
              {formText.mobileAnalysisCollapsed[lang]}
            </span>
          </div>

          <span style={styles.mobileAnalysisScore}>{analysis.score}%</span>
        </button>

        {mobileAnalysisOpen && (
          <div style={{ marginTop: "12px" }}>
            {renderAnalysisContent()}
          </div>
        )}
      </div>
    );
  };

  const renderServiceIntro = () => {
    const intro = getLocalizedText(service.intro, "");
    const guidance = (service.requestGuidance || [])
      .map((item) => getLocalizedText(item, ""))
      .filter(Boolean);

    if (!intro && guidance.length === 0) return null;

    return (
      <div style={styles.introBox}>
        {intro ? (
          <>
            <h3 style={styles.introTitle}>{formText.introTitle[lang]}</h3>
            <p style={styles.introText}>{intro}</p>
          </>
        ) : null}

        {guidance.length > 0 ? (
          <div style={styles.guidanceWrap}>
            <h4 style={styles.guidanceTitle}>{formText.guidanceTitle[lang]}</h4>
            <ul style={styles.guidanceList}>
              {guidance.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    );
  };

  const renderCustomSelectHelper = (field: ServiceField) => {
    if (!shouldShowCustomField(field)) return null;

    const helperId = getCustomFieldId(field);
    const isQuantityField = formState[field.id] === "custom-quantity";

    return (
      <div style={styles.helperInputWrap}>
        <label htmlFor={helperId} style={styles.label}>
          {isQuantityField
            ? formText.customQuantityLabel[lang]
            : formText.customSizeLabel[lang]}
        </label>
        <input
          id={helperId}
          name={helperId}
          type={isQuantityField ? "number" : "text"}
          inputMode={isQuantityField ? "numeric" : "text"}
          min={isQuantityField ? 1 : undefined}
          placeholder={
            isQuantityField
              ? formText.customQuantityPlaceholder[lang]
              : formText.customSizePlaceholder[lang]
          }
          required={field.required === true}
          value={formState[helperId] || ""}
          style={styles.input}
          onChange={(e) => handleFieldStateChange(helperId, e.target.value)}
        />
      </div>
    );
  };

  const renderField = (field: ServiceField) => {
    const label = getLocalizedLabel(field);
    const placeholder = getLocalizedPlaceholder(field);

    switch (field.type) {
      case "text":
      case "email":
      case "number":
      case "tel":
      case "date":
        return (
          <div key={field.id} style={{ ...styles.fieldWrapper, ...getFieldSpanStyle(field) }}>
            <label htmlFor={field.id} style={styles.label}>
              {label}
            </label>
            <input
              id={field.id}
              name={field.id}
              type={field.type}
              placeholder={placeholder}
              required={field.required === true}
              style={styles.input}
              value={formState[field.id] || ""}
              onChange={(e) => handleFieldStateChange(field.id, e.target.value)}
            />
          </div>
        );
      case "textarea":
        return (
          <div key={field.id} style={{ ...styles.fieldWrapper, ...getFieldSpanStyle(field) }}>
            <label htmlFor={field.id} style={styles.label}>
              {label}
            </label>
            <textarea
              id={field.id}
              name={field.id}
              placeholder={placeholder}
              required={field.required === true}
              style={styles.textarea}
              value={formState[field.id] || ""}
              onChange={(e) => handleFieldStateChange(field.id, e.target.value)}
            />
          </div>
        );
      case "select":
        return (
          <div key={field.id} style={{ ...styles.fieldWrapper, ...getFieldSpanStyle(field) }}>
            <label htmlFor={field.id} style={styles.label}>
              {label}
            </label>
            <select
              id={field.id}
              name={field.id}
              required={field.required === true}
              style={styles.input}
              value={formState[field.id] || ""}
              onChange={(e) => {
                const nextValue = e.target.value;
                handleFieldStateChange(field.id, nextValue);

                if (nextValue !== "custom" && nextValue !== "custom-quantity") {
                  handleFieldStateChange(getCustomFieldId(field), "");
                }
              }}
            >
              <option value="">{getLocalizedSelectPlaceholder(field)}</option>
              {getEnhancedOptions(field).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {getLocalizedText(opt.label, opt.value)}
                </option>
              ))}
            </select>

            {renderCustomSelectHelper(field)}
          </div>
        );
      case "radio":
        return (
          <div key={field.id} style={{ ...styles.fieldWrapper, ...getFieldSpanStyle(field) }}>
            <span style={styles.label}>{label}</span>
            <div style={styles.optionList}>
              {field.options?.map((opt) => {
                const selected = formState[field.id] === opt.value;

                return (
                  <label key={opt.value} style={getOptionCardStyle(selected)}>
                    <input
                      type="radio"
                      name={field.id}
                      value={opt.value}
                      required={field.required === true}
                      checked={selected}
                      onChange={(e) => handleFieldStateChange(field.id, e.target.value)}
                      style={{ marginTop: "2px", flexShrink: 0 }}
                    />
                    <span style={styles.optionTextWrap}>
                      <span>{getLocalizedText(opt.label, opt.value)}</span>
                      {selected ? (
                        <span style={styles.optionSelectedHint}>
                          {formText.selectedOption[lang]}
                        </span>
                      ) : null}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      case "checkbox":
        return (
          <div key={field.id} style={{ ...styles.fieldWrapper, ...getFieldSpanStyle(field) }}>
            <span style={styles.label}>{label}</span>
            <div style={styles.optionList}>
              {field.options?.map((opt) => {
                const checkedValues = formState[field.id]
                  ? formState[field.id]
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean)
                  : [];

                const selected = checkedValues.includes(opt.value);

                return (
                  <label key={opt.value} style={getOptionCardStyle(selected)}>
                    <input
                      type="checkbox"
                      name={field.id}
                      value={opt.value}
                      checked={selected}
                      onChange={(e) =>
                        handleCheckboxChange(field.id, e.target.value, e.target.checked)
                      }
                      style={{ marginTop: "2px", flexShrink: 0 }}
                    />
                    <span style={styles.optionTextWrap}>
                      <span>{getLocalizedText(opt.label, opt.value)}</span>
                      {selected ? (
                        <span style={styles.optionSelectedHint}>
                          {formText.selectedOption[lang]}
                        </span>
                      ) : null}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      case "file":
        return (
          <div key={field.id} style={{ ...styles.fieldWrapper, ...getFieldSpanStyle(field) }}>
            <label htmlFor={field.id} style={styles.label}>
              {label}
            </label>
            <div style={styles.fileInputWrap}>
              {!field.required && (
                <div style={styles.fileHint}>{formText.fileOptionalHint[lang]}</div>
              )}
              <input
                id={field.id}
                name={field.id}
                type="file"
                required={field.required === true}
                style={{
                  ...styles.input,
                  background: "#ffffff",
                  padding: "8px 9px",
                }}
                onChange={(e) => {
                  const fileNames = e.target.files
                    ? Array.from(e.target.files)
                        .map((file) => file.name)
                        .join(", ")
                    : "";
                  handleFieldStateChange(field.id, fileNames);
                }}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderAttachmentField = (attachment: ServiceAttachment) => {
    const title = getLocalizedText(attachment.title, attachment.id);
    const description = getLocalizedText(attachment.description, "");

    return (
      <div
        key={attachment.id}
        style={{
          ...styles.fieldWrapper,
          gridColumn: "1 / -1",
        }}
      >
        <label htmlFor={attachment.id} style={styles.label}>
          {title}
        </label>

        <div style={styles.fileInputWrap}>
          {description ? (
            <p style={styles.attachmentDescription}>{description}</p>
          ) : null}

          {!attachment.required && (
            <div style={styles.fileHint}>{formText.fileOptionalHint[lang]}</div>
          )}

          <input
            id={attachment.id}
            name={attachment.id}
            type="file"
            required={attachment.required === true}
            multiple={attachment.multiple === true}
            style={{
              ...styles.input,
              background: "#ffffff",
              padding: "8px 9px",
            }}
            onChange={(e) => {
              const fileNames = e.target.files
                ? Array.from(e.target.files)
                    .map((file) => file.name)
                    .join(", ")
                : "";
              handleFieldStateChange(attachment.id, fileNames);
            }}
          />
        </div>
      </div>
    );
  };

  const formContent = (
    <form
      id="service-form-element"
      onSubmit={handleSubmit}
      dir={isArabic ? "rtl" : "ltr"}
      style={styles.form}
    >
      {status.type !== "idle" && (
        <div
          style={{
            ...styles.statusBox,
            background: status.type === "success" ? "#edf8f0" : "#fff2f1",
            border:
              status.type === "success"
                ? "1px solid #b9dcc1"
                : "1px solid #efc4bf",
            color: status.type === "success" ? "#245a30" : "#8b2f25",
          }}
        >
          {status.message}
        </div>
      )}

      {renderMobileInlineAnalysis()}
      {renderServiceIntro()}

      {resolvedSections.map((section) => {
        const sectionTitle = getLocalizedText(section.title, section.id);
        const sectionDescription = getLocalizedText(section.description, "");

        return (
          <section key={section.id} style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>{sectionTitle}</h3>
              {sectionDescription ? (
                <p style={styles.sectionDescription}>{sectionDescription}</p>
              ) : null}
            </div>

            <div style={styles.fieldsGrid}>
              {section.fields.map((field) => renderField(field))}
            </div>
          </section>
        );
      })}

      {visibleAttachments.length > 0 ? (
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>
              {formText.attachmentsSectionTitle[lang]}
            </h3>
            <p style={styles.sectionDescription}>
              {formText.attachmentsSectionDescription[lang]}
            </p>
          </div>

          <div style={styles.fieldsGrid}>
            {visibleAttachments.map((attachment) => renderAttachmentField(attachment))}
          </div>
        </section>
      ) : null}

      <div style={styles.submitRow}>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            ...styles.submitButton,
            opacity: isSubmitting ? 0.75 : 1,
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? formText.addingToCart[lang] : formText.addToCart[lang]}
        </button>
      </div>
    </form>
  );

  return (
    <div style={styles.shell}>
      {isDesktop ? (
        <>
          {isArabic ? renderDesktopAnalysis() : formContent}
          {isArabic ? formContent : renderDesktopAnalysis()}
        </>
      ) : (
        formContent
      )}
    </div>
  );
}