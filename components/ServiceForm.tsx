"use client";

import type { CSSProperties, FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import type { Service, ServiceField, ServiceSection } from "@/types/service";
import type { Language } from "@/lib/i18n";
import { addToCart, type CartFieldItem } from "@/lib/cart";
import { analyzeRequest } from "@/lib/analyzeRequest";
import formText from "@/components/service-form/serviceForm.text";
import { createServiceFormStyles } from "@/components/service-form/serviceForm.styles";
import {
  type LocalizedOption,
  type FormStatus,
  type LegacyFieldGroupKey,
  normalizeSpaces,
  normalizeComparisonText,
  normalizeQuantity,
  inferQuantityFromValue,
  inferQuantityFromData,
  splitSelectedValues,
  isQuantityLikeKey,
  dedupeCartFieldItems,
  smartSizeOptions,
  smartQuantityOptions,
  smartPaperOptions,
  smartFinishingOptions,
} from "@/components/service-form/serviceForm.helpers";

type Props = {
  service: Service;
  lang: Language;
  onAddedToCart?: () => void;
};

type HelpTextPayload = {
  purpose: string;
  requirement: string;
  action: string;
};

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
  const [helperOpen, setHelperOpen] = useState(false);
  const [activeHelpId, setActiveHelpId] = useState<string | null>(null);

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

  const getLocalizedTextStrict = (
    value?: Partial<Record<Language, string>>,
    fallback = ""
  ) => {
    if (!value) return normalizeSpaces(fallback);
    return normalizeSpaces(
      value[lang] || value.en || value.de || value.ar || fallback
    );
  };

  const getStableTextFallback = (fallback = "") => normalizeSpaces(fallback);

  const getLocalizedText = (
    value?: Partial<Record<Language, string>>,
    fallback = ""
  ) => {
    return getLocalizedTextStrict(value, getStableTextFallback(fallback));
  };

  const localizedServiceTitleForCart =
    getLocalizedText(service.title, service.id) || service.id;

  const helperText = {
    progressTitle:
      lang === "ar"
        ? "نظرة سريعة على الطلب"
        : lang === "de"
          ? "Kurzer Überblick zur Anfrage"
          : "Quick Request Overview",
    progressText:
      lang === "ar"
        ? "أكمل ما تعرفه الآن فقط. الحقول الأوضح تعطي طلبًا أنظف وأسهل للمراجعة."
        : lang === "de"
          ? "Trage einfach das ein, was du jetzt weißt. Je klarer die Angaben, desto sauberer wird die Anfrage."
          : "Enter only what you know now. Clearer details create a cleaner and easier request.",
    sectionLabel:
      lang === "ar" ? "القسم" : lang === "de" ? "Abschnitt" : "Section",
    requiredDone:
      lang === "ar"
        ? "الحقول المطلوبة المكتملة"
        : lang === "de"
          ? "Ausgefüllte Pflichtfelder"
          : "Completed required fields",
    readyHint:
      lang === "ar"
        ? "يمكنك إضافة الطلب إلى السلة بعد مراجعة المعلومات الأساسية."
        : lang === "de"
          ? "Du kannst die Anfrage nach Prüfung der wichtigsten Angaben in den Warenkorb legen."
          : "You can add the request to the cart after reviewing the key details.",
    submitHint:
      lang === "ar"
        ? "بعد الإضافة إلى السلة يمكنك متابعة مراجعة جميع الطلبات وإرسالها معًا."
        : lang === "de"
          ? "Nach dem Hinzufügen zum Warenkorb kannst du alle Anfragen gemeinsam prüfen und versenden."
          : "After adding to the cart, you can review all requests together and send them at once.",
    helperTitle:
      lang === "ar"
        ? "معلومات مساعدة"
        : lang === "de"
          ? "Hilfreiche Informationen"
          : "Helpful Information",
    helperOpen:
      lang === "ar"
        ? "إظهار معلومات مساعدة"
        : lang === "de"
          ? "Hilfreiche Informationen öffnen"
          : "Open Helpful Information",
    helperClose:
      lang === "ar"
        ? "إخفاء معلومات مساعدة"
        : lang === "de"
          ? "Hilfreiche Informationen ausblenden"
          : "Hide Helpful Information",
    quickReview:
      lang === "ar"
        ? "طلب أوضح"
        : lang === "de"
          ? "Klarere Anfrage"
          : "Clearer Request",
    backButton:
      lang === "ar"
        ? "رجوع للأعلى"
        : lang === "de"
          ? "Zurück nach oben"
          : "Back to top",
    helpButton:
      lang === "ar"
        ? "توضيح مهم"
        : lang === "de"
          ? "Wichtige Erklärung"
          : "Important note",
    optionHelp:
      lang === "ar"
        ? "شرح الخيار"
        : lang === "de"
          ? "Option erklären"
          : "Explain option",
    purpose:
      lang === "ar" ? "المعنى" : lang === "de" ? "Bedeutung" : "Meaning",
    requirement:
      lang === "ar" ? "الحالة" : lang === "de" ? "Status" : "Status",
    action:
      lang === "ar" ? "ماذا تفعل" : lang === "de" ? "Was tun" : "What to do",
    required:
      lang === "ar" ? "إلزامي" : lang === "de" ? "Pflichtfeld" : "Required",
    optional:
      lang === "ar" ? "اختياري" : lang === "de" ? "Optional" : "Optional",
  };

  const getLocalizedLabel = (field: ServiceField) => {
    return getLocalizedText(field.label, field.id) || field.id;
  };

  const getLocalizedLabelForCart = (field: ServiceField) => {
    return getLocalizedText(field.label, field.id) || field.id;
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

  const normalizeId = (value: string) =>
    value.toLowerCase().replace(/[\s_-]+/g, "");

  const normalizeHelpText = (value: string) =>
    value
      .toLowerCase()
      .replace(/[ä]/g, "a")
      .replace(/[ö]/g, "o")
      .replace(/[ü]/g, "u")
      .replace(/[ß]/g, "ss")
      .replace(/[\s_-]+/g, "");

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

  const getOptionListForField = (field: ServiceField) => {
    if (field.type === "select") {
      return getEnhancedOptions(field);
    }

    return field.options || [];
  };

  const getLocalizedOptionTextForCart = (
    field: ServiceField,
    optionValue: string
  ) => {
    const option = getOptionListForField(field).find(
      (item) => item.value === optionValue
    );

    if (!option) return optionValue;

    return getLocalizedText(option.label, optionValue) || optionValue;
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

    const customValue = normalizeSpaces(formState[getCustomFieldId(field)] || "");

    if (!customValue) {
      return "";
    }

    return customValue;
  };

  const serializeFieldValueForCart = (field: ServiceField, value: string) => {
    const cleanValue = normalizeSpaces(value);
    if (!cleanValue) return "";

    if (field.type === "select" || field.type === "radio") {
      if (cleanValue === "custom" || cleanValue === "custom-quantity") {
        return "";
      }

      return normalizeSpaces(getLocalizedOptionTextForCart(field, cleanValue));
    }

    if (field.type === "checkbox") {
      const selectedValues = splitSelectedValues(cleanValue);

      if (selectedValues.length === 0) {
        return "";
      }

      return selectedValues
        .map((optionValue) =>
          normalizeSpaces(getLocalizedOptionTextForCart(field, optionValue))
        )
        .filter(Boolean)
        .join(", ");
    }

    return cleanValue;
  };

  const shouldHideField = (field: ServiceField) => {
    if (isContactField(field)) {
      return true;
    }

    if (field.type === "file") {
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
      notes: legacyFields.filter(
        (field) => classifyLegacyField(field) === "notes"
      ),
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

  const analysis = useMemo(() => {
    return analyzeRequest(service.id, formState, lang);
  }, [service.id, formState, lang]);

  const sectionProgress = useMemo(() => {
    const requiredFields = allVisibleFields.filter((field) => field.required);
    const completedRequiredFields = requiredFields.filter((field) => {
      const rawValue = normalizeSpaces(formState[field.id] || "");
      const resolvedValue = normalizeSpaces(getResolvedFieldValue(field, rawValue));

      if (field.type === "checkbox") {
        return splitSelectedValues(resolvedValue).length > 0;
      }

      return Boolean(resolvedValue);
    });

    return {
      requiredCount: requiredFields.length,
      completedRequiredCount: completedRequiredFields.length,
    };
  }, [allVisibleFields, formState]);

  const styles = useMemo(() => {
    return createServiceFormStyles({
      isArabic,
      isDesktop,
      isMobile,
      score: analysis.score,
    });
  }, [isArabic, isDesktop, isMobile, analysis.score]);

  const layoutShellStyle: CSSProperties = {
    width: "100%",
    maxWidth: "1180px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
  };

  const contentColumnStyle: CSSProperties = {
    width: "100%",
    maxWidth: isDesktop ? "920px" : "100%",
    minWidth: 0,
    display: "grid",
    gap: "16px",
  };

  const topSummaryHeaderStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    flexWrap: "wrap",
  };

  const topSummaryTitleStyle: CSSProperties = {
    margin: 0,
    fontSize: "15px",
    lineHeight: 1.4,
    color: "#111b21",
    fontWeight: 800,
    textAlign: isArabic ? "right" : "left",
  };

  const topSummaryTextStyle: CSSProperties = {
    margin: 0,
    fontSize: "13px",
    lineHeight: 1.75,
    color: "#667781",
    textAlign: isArabic ? "right" : "left",
  };

  const topSummaryMetaWrapStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    justifyContent: isArabic ? "flex-end" : "flex-start",
  };

  const topSummaryMetaStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "32px",
    padding: "0 11px",
    borderRadius: "999px",
    border: "1px solid #d1d7db",
    background: "#ffffff",
    color: "#54656f",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  };

  const sectionIndexStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "28px",
    height: "28px",
    borderRadius: "999px",
    background: "#d9fdd3",
    color: "#00a884",
    fontSize: "12px",
    fontWeight: 800,
    flexShrink: 0,
  };

  const submitHintStyle: CSSProperties = {
    margin: 0,
    fontSize: "12px",
    lineHeight: 1.7,
    color: "#667781",
    textAlign: isArabic ? "right" : "left",
  };

  const submitBlockStyle: CSSProperties = {
    display: "grid",
    gap: "10px",
    marginTop: "2px",
    marginBottom: "2px",
  };

  const submitButtonWrapStyle: CSSProperties = {
    display: "flex",
    justifyContent: isArabic ? "flex-start" : "flex-end",
    alignItems: "center",
  };

  const helperOuterStyle: CSSProperties = {
    border: "1px solid #d1d7db",
    background: "#f0f2f5",
    borderRadius: "22px",
    padding: isMobile ? "14px" : "18px",
    boxShadow: "0 4px 16px rgba(17, 27, 33, 0.04)",
    display: "grid",
    gap: "14px",
  };

  const helperToggleRowStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  };

  const helperContentWrapStyle: CSSProperties = {
    display: "grid",
    gap: "14px",
  };

  const helperButtonStyle: CSSProperties = {
    border: "1px solid #d1d7db",
    background: "#ffffff",
    color: "#111b21",
    borderRadius: "999px",
    minHeight: "38px",
    padding: "8px 14px",
    fontSize: "12px",
    fontWeight: 800,
    cursor: "pointer",
  };

  const helperTitleStyle: CSSProperties = {
    margin: 0,
    fontSize: "16px",
    lineHeight: 1.4,
    color: "#111b21",
    fontWeight: 800,
    textAlign: isArabic ? "right" : "left",
  };

  const helperCardsStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: isDesktop ? "repeat(3, minmax(0, 1fr))" : "1fr",
    gap: "12px",
  };

  const helperCardStyle: CSSProperties = {
    border: "1px solid #d1d7db",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "14px",
    display: "grid",
    gap: "8px",
    minWidth: 0,
  };

  const helperCardTitleStyle: CSSProperties = {
    margin: 0,
    fontSize: "13px",
    lineHeight: 1.4,
    color: "#111b21",
    fontWeight: 800,
    textAlign: isArabic ? "right" : "left",
  };

  const helperCardTextStyle: CSSProperties = {
    margin: 0,
    fontSize: "12px",
    lineHeight: 1.8,
    color: "#667781",
    textAlign: isArabic ? "right" : "left",
  };

  const helperFooterStyle: CSSProperties = {
    display: "flex",
    justifyContent: isArabic ? "flex-start" : "flex-end",
  };

  const helperBackButtonStyle: CSSProperties = {
    border: "1px solid #d1d7db",
    background: "#ffffff",
    color: "#111b21",
    borderRadius: "999px",
    minHeight: "36px",
    padding: "7px 14px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
  };

  const fieldLabelRowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    justifyContent: isArabic ? "flex-end" : "flex-start",
    flexWrap: "wrap",
  };

  const inlineHelpButtonStyle: CSSProperties = {
    width: "20px",
    height: "20px",
    borderRadius: "999px",
    border: "1px solid rgba(24,119,242,0.22)",
    background: "rgba(231,243,255,0.82)",
    color: "#1877f2",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    lineHeight: 1,
    fontWeight: 900,
    cursor: "pointer",
    flexShrink: 0,
  };

  const helpPanelStyle: CSSProperties = {
    marginTop: "8px",
    padding: isMobile ? "10px 11px" : "11px 12px",
    borderRadius: "14px",
    border: "1px solid rgba(24,119,242,0.14)",
    background:
      "linear-gradient(135deg, rgba(231,243,255,0.72), rgba(255,255,255,0.96))",
    color: "#4b5563",
    fontSize: isMobile ? "12px" : "13px",
    lineHeight: 1.8,
    textAlign: isArabic ? "right" : "left",
  };

  const helpLineStyle: CSSProperties = {
    margin: "0 0 3px",
  };

  const optionHelpTextStyle: CSSProperties = {
    marginTop: "6px",
    paddingTop: "6px",
    borderTop: "1px solid rgba(24,119,242,0.10)",
    color: "#667781",
    fontSize: "12px",
    lineHeight: 1.7,
    textAlign: isArabic ? "right" : "left",
  };

  const resetStatusIfNeeded = () => {
    if (status.type !== "idle") {
      setStatus({
        type: "idle",
        message: "",
      });
    }
  };

  const handleFieldStateChange = (fieldId: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    resetStatusIfNeeded();
  };

  const handleCheckboxChange = (
    fieldId: string,
    optionValue: string,
    checked: boolean
  ) => {
    setFormState((prev) => {
      const current = prev[fieldId] ? splitSelectedValues(prev[fieldId]) : [];

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

    resetStatusIfNeeded();
  };

  const toggleHelp = (id: string) => {
    setActiveHelpId((prev) => (prev === id ? null : id));
  };

  const getRequirementText = (field: ServiceField) => {
    return field.required === true ? helperText.required : helperText.optional;
  };

  const textIncludesAny = (text: string, words: string[]) => {
    const normalized = normalizeHelpText(text);
    return words.some((word) => normalized.includes(normalizeHelpText(word)));
  };

  const getFieldHelpPayload = (
    field: ServiceField,
    label: string
  ): HelpTextPayload | null => {
    const fieldId = normalizeId(field.id);
    const labelId = normalizeId(label);
    const combined = `${field.id} ${label} ${field.semanticGroup || ""}`;
    const requirement = getRequirementText(field);

    if (
      field.semanticGroup === "dimensions" ||
      fieldId.includes("size") ||
      fieldId.includes("width") ||
      fieldId.includes("height") ||
      fieldId.includes("length") ||
      fieldId.includes("dimension") ||
      fieldId.includes("measure") ||
      labelId.includes("maß") ||
      labelId.includes("masse") ||
      labelId.includes("مقاس")
    ) {
      return {
        purpose:
          lang === "ar"
            ? "هذا ليس مجرد رقم؛ هو أساس القص، الطباعة، التسعير، ومعرفة هل يحتاج الملف إلى تقسيم أو تكبير."
            : lang === "de"
              ? "Das ist nicht nur eine Zahl; es steuert Zuschnitt, Druck, Preis und ob die Datei skaliert oder geteilt werden muss."
              : "This is not just a number; it controls cutting, printing, pricing, and whether the file must be scaled or split.",
        requirement,
        action:
          lang === "ar"
            ? "اكتب المقاس النهائي المطلوب بعد التنفيذ، مثل 120 × 80 سم. إذا القياس تقريبي اكتب كلمة: تقريبًا."
            : lang === "de"
              ? "Das fertige Endmaß eintragen, z. B. 120 × 80 cm. Wenn es geschätzt ist, „ca.“ dazuschreiben."
              : "Enter the final finished size, e.g. 120 × 80 cm. If estimated, write “approx.”",
      };
    }

    if (
      field.semanticGroup === "materials" ||
      textIncludesAny(combined, [
        "material",
        "paper",
        "stock",
        "folie",
        "vinyl",
        "dibond",
        "acryl",
        "acrylic",
        "pvc",
        "forex",
        "canvas",
        "mesh",
        "banner",
        "one way",
        "frosted",
        "milchglas",
        "ورق",
        "خامة",
        "مادة",
        "فروستد",
      ])
    ) {
      return {
        purpose:
          lang === "ar"
            ? "الخامة تغيّر شكل المنتج وقوته وسعره ومناسبته للداخل أو الخارج."
            : lang === "de"
              ? "Das Material beeinflusst Optik, Stabilität, Preis und ob es für innen oder außen geeignet ist."
              : "The material affects appearance, durability, price, and indoor/outdoor suitability.",
        requirement,
        action:
          lang === "ar"
            ? "اختر الخامة إن كنت تعرفها. إذا لا تعرف، اكتب مكان الاستخدام بدلًا من اسم الخامة: زجاج، واجهة خارجية، سيارة، داخل محل."
            : lang === "de"
              ? "Material wählen, wenn bekannt. Wenn nicht, den Einsatzort nennen: Glas, Außenfassade, Fahrzeug, Innenbereich."
              : "Choose the material if known. If not, describe the use: glass, outdoor facade, vehicle, indoor area.",
      };
    }

    if (
      field.semanticGroup === "production" ||
      textIncludesAny(combined, [
        "print",
        "druck",
        "uv",
        "digital",
        "plot",
        "cut",
        "laser",
        "cnc",
        "contour",
        "kisscut",
        "transfer",
        "dtf",
        "sublimation",
        "engraving",
        "طباعة",
        "قص",
        "ليزر",
        "تفريغ",
        "حفر",
      ])
    ) {
      return {
        purpose:
          lang === "ar"
            ? "هذا يحدد طريقة التنفيذ نفسها: طباعة، قص، ليزر، تفريغ، أو تجهيز خاص."
            : lang === "de"
              ? "Das legt die Umsetzungsart fest: Druck, Schnitt, Laser, Konturschnitt oder Sonderverarbeitung."
              : "This defines the production method: printing, cutting, laser, contour cutting, or special processing.",
        requirement,
        action:
          lang === "ar"
            ? "اختر الطريقة إذا كانت واضحة لديك. إذا لا تعرف، اكتب النتيجة التي تريدها وليس اسم التقنية."
            : lang === "de"
              ? "Wähle die Methode, wenn sie klar ist. Wenn nicht, beschreibe das gewünschte Ergebnis statt der Technik."
              : "Choose the method if you know it. If not, describe the result you want instead of the technique name.",
      };
    }

    if (
      field.semanticGroup === "design" ||
      textIncludesAny(combined, [
        "design",
        "logo",
        "artwork",
        "layout",
        "corporate",
        "brand",
        "gestaltung",
        "datei",
        "file",
        "upload",
        "تصميم",
        "شعار",
        "هوية",
        "ملف",
      ])
    ) {
      return {
        purpose:
          lang === "ar"
            ? "هذا يوضح هل سنعمل على ملف جاهز أم يجب تجهيز التصميم قبل الإنتاج."
            : lang === "de"
              ? "Das klärt, ob mit fertiger Datei gearbeitet wird oder ob Gestaltung nötig ist."
              : "This clarifies whether production uses a ready file or design work is needed first.",
        requirement,
        action:
          lang === "ar"
            ? "اذكر هل لديك ملف PDF / AI / SVG / PNG عالي الجودة، أو اكتب أنك تحتاج تصميمًا من البداية."
            : lang === "de"
              ? "Angeben, ob PDF / AI / SVG / hochauflösendes PNG vorhanden ist oder Gestaltung benötigt wird."
              : "Mention whether you have PDF / AI / SVG / high-resolution PNG, or if design is needed.",
      };
    }

    if (
      field.semanticGroup === "installation" ||
      textIncludesAny(combined, [
        "install",
        "mount",
        "montage",
        "befestigung",
        "wall",
        "fassade",
        "glass",
        "window",
        "تركيب",
        "تثبيت",
        "واجهة",
        "زجاج",
      ])
    ) {
      return {
        purpose:
          lang === "ar"
            ? "التركيب يغيّر الأدوات، الوقت، طريقة التثبيت، وأحيانًا يحتاج زيارة أو صور للمكان."
            : lang === "de"
              ? "Montage beeinflusst Werkzeug, Zeit, Befestigung und ob Fotos oder ein Vor-Ort-Termin nötig sind."
              : "Installation affects tools, timing, fixing method, and whether photos or a site visit are needed.",
        requirement,
        action:
          lang === "ar"
            ? "اكتب مكان التركيب بدقة: زجاج، جدار، واجهة، سيارة، ارتفاع تقريبي، وهل السطح جاهز."
            : lang === "de"
              ? "Montageort genau angeben: Glas, Wand, Fassade, Fahrzeug, ungefähre Höhe und ob die Fläche vorbereitet ist."
              : "Describe the installation place: glass, wall, facade, vehicle, approximate height, and surface condition.",
      };
    }

    if (
      field.semanticGroup === "delivery" ||
      textIncludesAny(combined, [
        "delivery",
        "shipping",
        "pickup",
        "abholung",
        "lieferung",
        "deadline",
        "termin",
        "موعد",
        "تسليم",
        "شحن",
        "استلام",
      ])
    ) {
      return {
        purpose:
          lang === "ar"
            ? "هذا يساعدنا على ترتيب التسليم أو الاستلام دون وعد غير واقعي."
            : lang === "de"
              ? "Das hilft, Lieferung oder Abholung realistisch zu planen."
              : "This helps us plan delivery or pickup realistically.",
        requirement,
        action:
          lang === "ar"
            ? "اكتب الموعد المطلوب أو طريقة الاستلام. إذا الموعد مرن اكتب: مرن."
            : lang === "de"
              ? "Wunschtermin oder Abholart eintragen. Wenn flexibel, „flexibel“ schreiben."
              : "Enter the desired date or pickup method. If flexible, write “flexible.”",
      };
    }

    if (
      field.semanticGroup === "notes" ||
      field.type === "textarea" ||
      textIncludesAny(combined, [
        "details",
        "message",
        "note",
        "comment",
        "beschreibung",
        "hinweis",
        "ملاحظات",
        "تفاصيل",
        "رسالة",
      ])
    ) {
      return {
        purpose:
          lang === "ar"
            ? "هنا تضع المعلومات التي لا تظهر في الخيارات، وهي غالبًا أهم جزء لفهم الطلب."
            : lang === "de"
              ? "Hier stehen Informationen, die in den Auswahlfeldern nicht vorkommen und oft entscheidend sind."
              : "This is for information not covered by the options and is often the most important part.",
        requirement,
        action:
          lang === "ar"
            ? "اكتب النتيجة التي تريدها، مكان الاستخدام، المشكلة الحالية، وأي شيء لا تريد أن نخطئ فيه."
            : lang === "de"
              ? "Gewünschtes Ergebnis, Einsatzort, aktuelle Situation und alles eintragen, was nicht falsch verstanden werden darf."
              : "Enter the desired result, usage place, current situation, and anything that must not be misunderstood.",
      };
    }

    return null;
  };

  const getOptionHelpPayload = (
    field: ServiceField,
    option: LocalizedOption,
    optionText: string
  ): HelpTextPayload | null => {
    const optionCombined = `${option.value} ${optionText}`;
    const fieldCombined = `${field.id} ${getLocalizedLabel(field)} ${
      field.semanticGroup || ""
    }`;

    if (
      textIncludesAny(optionCombined, [
        "dibond",
        "aludibond",
        "alu dibond",
        "acryl",
        "acrylic",
        "plexi",
        "pvc",
        "forex",
        "hartschaum",
        "mesh",
        "canvas",
        "vinyl",
        "folie",
        "one way",
        "oneway",
        "frosted",
        "milchglas",
        "backlit",
        "blockout",
        "frontlit",
      ])
    ) {
      return {
        purpose:
          lang === "ar"
            ? `"${optionText}" خيار خامة/سطح يؤثر على المتانة، الشكل، والسعر.`
            : lang === "de"
              ? `„${optionText}“ ist eine Material-/Flächenwahl und beeinflusst Stabilität, Optik und Preis.`
              : `“${optionText}” is a material/surface choice affecting durability, appearance, and price.`,
        requirement:
          lang === "ar"
            ? "اختره فقط إذا يناسب مكان الاستخدام"
            : lang === "de"
              ? "Nur wählen, wenn es zum Einsatzort passt"
              : "Choose only if it fits the usage place",
        action:
          lang === "ar"
            ? "إذا لم تكن متأكدًا من الخامة، لا تخترها عشوائيًا؛ اشرح أين سيُستخدم المنتج."
            : lang === "de"
              ? "Wenn du unsicher bist, nicht zufällig wählen; beschreibe lieber den Einsatzort."
              : "If unsure, do not choose randomly; describe where the product will be used.",
      };
    }

    if (
      textIncludesAny(optionCombined, [
        "uv",
        "dtf",
        "sublimation",
        "laser",
        "cnc",
        "plot",
        "contour",
        "kisscut",
        "cut",
        "engraving",
        "lamination",
        "kaschierung",
        "matt",
        "gloss",
        "glanz",
        "schutz",
        "veredelung",
        "transfer",
      ])
    ) {
      return {
        purpose:
          lang === "ar"
            ? `"${optionText}" ليس وصفًا شكليًا فقط؛ هو طريقة تنفيذ أو تشطيب تؤثر على النتيجة النهائية.`
            : lang === "de"
              ? `„${optionText}“ ist nicht nur Optik, sondern eine Produktions- oder Veredelungsart.`
              : `“${optionText}” is not only visual; it is a production or finishing method.`,
        requirement:
          lang === "ar"
            ? "اختياره يعتمد على النتيجة المطلوبة"
            : lang === "de"
              ? "Hängt vom gewünschten Ergebnis ab"
              : "Depends on the desired result",
        action:
          lang === "ar"
            ? "اختره إذا كنت تعرفه. إذا لا تعرف التقنية، صف النتيجة المطلوبة في الملاحظات."
            : lang === "de"
              ? "Wählen, wenn bekannt. Wenn nicht, das gewünschte Ergebnis in den Notizen beschreiben."
              : "Choose it if you know it. If not, describe the desired result in the notes.",
      };
    }

    if (
      textIncludesAny(optionCombined, [
        "outdoor",
        "indoor",
        "außen",
        "innen",
        "weather",
        "wasserfest",
        "uvbeständig",
        "temporary",
        "permanent",
        "removable",
        "خارجي",
        "داخلي",
        "مؤقت",
        "دائم",
      ])
    ) {
      return {
        purpose:
          lang === "ar"
            ? `"${optionText}" يحدد ظروف الاستخدام، وهذا يؤثر على اختيار الخامة واللاصق والحماية.`
            : lang === "de"
              ? `„${optionText}“ beschreibt die Einsatzbedingungen und beeinflusst Material, Kleber und Schutz.`
              : `“${optionText}” defines usage conditions and affects material, adhesive, and protection.`,
        requirement:
          lang === "ar"
            ? "مهم إذا كان المنتج سيتعرض للشمس أو المطر أو الاحتكاك"
            : lang === "de"
              ? "Wichtig bei Sonne, Regen oder starker Beanspruchung"
              : "Important if exposed to sun, rain, or wear",
        action:
          lang === "ar"
            ? "اختره حسب مكان الاستخدام الحقيقي، وليس حسب الشكل فقط."
            : lang === "de"
              ? "Nach echtem Einsatzort wählen, nicht nur nach Optik."
              : "Choose based on real usage place, not only appearance.",
      };
    }

    if (
      textIncludesAny(fieldCombined, [
        "installation",
        "install",
        "mount",
        "montage",
        "تركيب",
        "تثبيت",
      ]) &&
      textIncludesAny(optionCombined, [
        "yes",
        "no",
        "ja",
        "nein",
        "with",
        "without",
        "mit",
        "ohne",
        "نعم",
        "لا",
      ])
    ) {
      return {
        purpose:
          lang === "ar"
            ? `"${optionText}" يحدد هل السعر والعمل يشملان التركيب أم الإنتاج فقط.`
            : lang === "de"
              ? `„${optionText}“ klärt, ob Montage enthalten ist oder nur Produktion.`
              : `“${optionText}” clarifies whether installation is included or production only.`,
        requirement:
          lang === "ar"
            ? "مهم لتحديد العمل بدقة"
            : lang === "de"
              ? "Wichtig für genaue Kalkulation"
              : "Important for accurate calculation",
        action:
          lang === "ar"
            ? "اختره حسب حاجتك الفعلية. إذا تحتاج تركيبًا، اذكر مكان التركيب في الملاحظات."
            : lang === "de"
              ? "Nach echtem Bedarf wählen. Bei Montage den Ort in den Notizen angeben."
              : "Choose based on real need. If installation is needed, mention the location in notes.",
      };
    }

    return null;
  };

  const renderStructuredHelp = (payload: HelpTextPayload) => (
    <div style={helpPanelStyle}>
      <p style={helpLineStyle}>
        <strong>{helperText.purpose}:</strong> {payload.purpose}
      </p>
      <p style={helpLineStyle}>
        <strong>{helperText.requirement}:</strong> {payload.requirement}
      </p>
      <p style={{ ...helpLineStyle, marginBottom: 0 }}>
        <strong>{helperText.action}:</strong> {payload.action}
      </p>
    </div>
  );

  const renderInlineStructuredHelp = (payload: HelpTextPayload) => (
    <span style={optionHelpTextStyle}>
      <strong>{helperText.purpose}:</strong> {payload.purpose}
      <br />
      <strong>{helperText.requirement}:</strong> {payload.requirement}
      <br />
      <strong>{helperText.action}:</strong> {payload.action}
    </span>
  );

  const renderHelpButton = (helpId: string, ariaLabel: string) => (
    <button
      type="button"
      aria-label={ariaLabel}
      title={ariaLabel}
      style={inlineHelpButtonStyle}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleHelp(helpId);
      }}
    >
      !
    </button>
  );

  const renderFieldLabel = (field: ServiceField, label: string) => {
    const helpId = `field-help-${field.id}`;
    const helpPayload = getFieldHelpPayload(field, label);

    return (
      <>
        <div style={fieldLabelRowStyle}>
          <label htmlFor={field.id} style={styles.label}>
            {label}
          </label>
          {helpPayload ? renderHelpButton(helpId, helperText.helpButton) : null}
        </div>

        {helpPayload && activeHelpId === helpId
          ? renderStructuredHelp(helpPayload)
          : null}
      </>
    );
  };

  const renderFieldGroupLabel = (field: ServiceField, label: string) => {
    const helpId = `field-help-${field.id}`;
    const helpPayload = getFieldHelpPayload(field, label);

    return (
      <>
        <div style={fieldLabelRowStyle}>
          <span style={styles.label}>{label}</span>
          {helpPayload ? renderHelpButton(helpId, helperText.helpButton) : null}
        </div>

        {helpPayload && activeHelpId === helpId
          ? renderStructuredHelp(helpPayload)
          : null}
      </>
    );
  };

  const buildCartPayloadFromState = () => {
    const dataMap = new Map<string, string>();
    const fieldMap = new Map<string, CartFieldItem>();
    let detectedQuantity: number | null = null;

    const pushEntry = (fieldId: string, label: string, value: string) => {
      const cleanId = normalizeSpaces(fieldId);
      const cleanLabel = normalizeSpaces(label);
      const cleanValue = normalizeSpaces(value);

      if (!cleanId || !cleanLabel || !cleanValue) return;

      const normalizedId = normalizeComparisonText(cleanId);
      const normalizedValue = normalizeComparisonText(cleanValue);

      if (!normalizedId || !normalizedValue) return;

      if (!dataMap.has(cleanId)) {
        dataMap.set(cleanId, cleanValue);
      }

      const quantityCandidate =
        isQuantityLikeKey(cleanId) || isQuantityLikeKey(cleanLabel)
          ? inferQuantityFromValue(cleanValue)
          : null;

      if (quantityCandidate !== null && detectedQuantity === null) {
        detectedQuantity = quantityCandidate;
      }

      if (!isQuantityLikeKey(cleanId) && !isQuantityLikeKey(cleanLabel)) {
        const existing = fieldMap.get(normalizedId);

        if (!existing) {
          fieldMap.set(normalizedId, {
            id: cleanId,
            label: cleanLabel,
            value: cleanValue,
          });
          return;
        }

        const existingScore = existing.label.length + existing.value.length;
        const nextScore = cleanLabel.length + cleanValue.length;

        if (nextScore > existingScore) {
          fieldMap.set(normalizedId, {
            id: cleanId,
            label: cleanLabel,
            value: cleanValue,
          });
        }
      }
    };

    allVisibleFields.forEach((field) => {
      const rawValue = normalizeSpaces(formState[field.id] || "");
      const resolvedValue = getResolvedFieldValue(field, rawValue);
      const localizedValue = serializeFieldValueForCart(field, resolvedValue);
      const localizedLabel = getLocalizedLabelForCart(field);

      if (localizedValue) {
        pushEntry(field.id, localizedLabel, localizedValue);
      }
    });

    const data = Object.fromEntries(dataMap.entries());
    const dedupedFields = dedupeCartFieldItems(Array.from(fieldMap.values()));
    const quantity = normalizeQuantity(
      detectedQuantity ?? inferQuantityFromData(data)
    );

    return { data, fields: dedupedFields, quantity };
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    const { data, fields, quantity } = buildCartPayloadFromState();

    try {
      addToCart({
        serviceId: service.id,
        serviceTitle: localizedServiceTitleForCart,
        requestLanguage: lang,
        quantity,
        data,
        fields,
      });

      onAddedToCart?.();

      setStatus({
        type: "success",
        message: formText.addedToCart[lang],
      });

      e.currentTarget.reset();
      setFormState({});
      setHelperOpen(false);
      setActiveHelpId(null);
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
      field.type === "checkbox" ||
      field.type === "radio";

    return {
      gridColumn: isWideField ? "1 / -1" : "span 1",
    };
  };

  const getOptionCardStyle = (selected: boolean): CSSProperties => ({
    ...styles.optionCard,
    border: selected ? "1px solid #00a884" : "1px solid #d1d7db",
    background: selected ? "rgba(217, 253, 211, 0.34)" : "#ffffff",
    boxShadow: selected ? "0 6px 14px rgba(0, 168, 132, 0.10)" : "none",
  });

  const renderAnalysisContent = () => (
    <div style={styles.analysisBox}>
      <h3 style={styles.analysisTitle}>{formText.analysisTitle[lang]}</h3>
      <p style={styles.analysisHelper}>{formText.analysisHelper[lang]}</p>

      <div>
        <h4 style={styles.analysisRowTitle}>{formText.summaryTitle[lang]}</h4>
        <p style={styles.analysisText}>{analysis.summary}</p>
      </div>

      <div style={styles.analysisSection}>
        <h4 style={styles.analysisRowTitle}>{formText.missingTitle[lang]}</h4>
        {analysis.missing.length > 0 ? (
          <ul style={{ ...styles.analysisList, color: "#b42318" }}>
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
          <ul style={{ ...styles.analysisList, color: "#667781" }}>
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
    </div>
  );

  const renderServiceIntro = () => {
    const intro = getLocalizedText(service.intro, "");
    const guidance = (service.requestGuidance || [])
      .map((item) => getLocalizedText(item, ""))
      .filter(Boolean);

    if (!intro && guidance.length === 0) return null;

    return (
      <div style={helperCardStyle}>
        {intro ? (
          <>
            <h4 style={helperCardTitleStyle}>{formText.introTitle[lang]}</h4>
            <p style={helperCardTextStyle}>{intro}</p>
          </>
        ) : null}

        {guidance.length > 0 ? (
          <div style={styles.guidanceWrap}>
            <h4 style={helperCardTitleStyle}>{formText.guidanceTitle[lang]}</h4>
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

  const renderTopSummary = () => (
    <div style={helperCardStyle}>
      <div style={topSummaryHeaderStyle}>
        <h3 style={topSummaryTitleStyle}>{helperText.progressTitle}</h3>
        <div style={topSummaryMetaWrapStyle}>
          <span style={topSummaryMetaStyle}>
            {helperText.requiredDone}: {sectionProgress.completedRequiredCount}/
            {sectionProgress.requiredCount}
          </span>
          <span style={topSummaryMetaStyle}>{analysis.score}%</span>
        </div>
      </div>

      <p style={topSummaryTextStyle}>{helperText.progressText}</p>
      <p style={{ ...topSummaryTextStyle, marginTop: "-2px" }}>
        {helperText.readyHint}
      </p>
    </div>
  );

  const renderQuickHintCard = () => (
    <div style={helperCardStyle}>
      <h4 style={helperCardTitleStyle}>{helperText.quickReview}</h4>
      <p style={helperCardTextStyle}>{helperText.submitHint}</p>
    </div>
  );

  const renderHelperAccordion = () => (
    <section style={helperOuterStyle}>
      <div style={helperToggleRowStyle}>
        <button
          type="button"
          onClick={() => setHelperOpen((prev) => !prev)}
          aria-expanded={helperOpen}
          style={helperButtonStyle}
        >
          {helperOpen ? helperText.helperClose : helperText.helperOpen}
        </button>

        <h3 style={helperTitleStyle}>{helperText.helperTitle}</h3>
      </div>

      {helperOpen ? (
        <div style={helperContentWrapStyle}>
          <div style={helperCardsStyle}>
            {renderTopSummary()}
            {renderServiceIntro()}
            {renderQuickHintCard()}
          </div>

          {renderAnalysisContent()}

          <div style={helperFooterStyle}>
            <button
              type="button"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              style={helperBackButtonStyle}
            >
              {helperText.backButton}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );

  const renderCustomSelectHelper = (field: ServiceField) => {
    if (!shouldShowCustomField(field)) return null;

    const helperId = getCustomFieldId(field);
    const isQuantityField = formState[field.id] === "custom-quantity";

    const customHelpPayload: HelpTextPayload = {
      purpose: isQuantityField
        ? lang === "ar"
          ? "هذا يظهر فقط عندما لا تكفي الكميات الجاهزة."
          : lang === "de"
            ? "Erscheint nur, wenn die fertigen Mengen nicht passen."
            : "Appears only when preset quantities do not fit."
        : lang === "ar"
          ? "هذا يظهر فقط عندما لا يوجد مقاس مناسب في القائمة."
          : lang === "de"
            ? "Erscheint nur, wenn kein passendes Maß in der Liste steht."
            : "Appears only when no listed size fits.",
      requirement: getRequirementText(field),
      action: isQuantityField
        ? lang === "ar"
          ? "اكتب رقمًا فقط، مثل 75 أو 120."
          : lang === "de"
            ? "Nur eine Zahl eintragen, z. B. 75 oder 120."
            : "Enter a number only, e.g. 75 or 120."
        : lang === "ar"
          ? "اكتب المقاس النهائي بوضوح، مثل 120 × 80 سم."
          : lang === "de"
            ? "Endmaß klar eintragen, z. B. 120 × 80 cm."
            : "Enter the final size clearly, e.g. 120 × 80 cm.",
    };

    return (
      <div style={styles.helperInputWrap}>
        <div style={fieldLabelRowStyle}>
          <label htmlFor={helperId} style={styles.label}>
            {isQuantityField
              ? formText.customQuantityLabel[lang]
              : formText.customSizeLabel[lang]}
          </label>
          {renderHelpButton(`${helperId}-help`, helperText.helpButton)}
        </div>

        {activeHelpId === `${helperId}-help`
          ? renderStructuredHelp(customHelpPayload)
          : null}

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
          <div
            key={field.id}
            style={{ ...styles.fieldWrapper, ...getFieldSpanStyle(field) }}
          >
            {renderFieldLabel(field, label)}
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
          <div
            key={field.id}
            style={{ ...styles.fieldWrapper, ...getFieldSpanStyle(field) }}
          >
            {renderFieldLabel(field, label)}
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
          <div
            key={field.id}
            style={{ ...styles.fieldWrapper, ...getFieldSpanStyle(field) }}
          >
            {renderFieldLabel(field, label)}
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
                  {getLocalizedText(opt.label, opt.value) || opt.value}
                </option>
              ))}
            </select>

            {renderCustomSelectHelper(field)}
          </div>
        );

      case "radio":
        return (
          <div
            key={field.id}
            style={{ ...styles.fieldWrapper, ...getFieldSpanStyle(field) }}
          >
            {renderFieldGroupLabel(field, label)}
            <div style={styles.optionList}>
              {getOptionListForField(field).map((opt) => {
                const selected = formState[field.id] === opt.value;
                const optionLabel = getLocalizedText(opt.label, opt.value) || opt.value;
                const optionHelpId = `option-help-${field.id}-${opt.value}`;
                const optionHelpPayload = getOptionHelpPayload(
                  field,
                  opt,
                  optionLabel
                );

                return (
                  <label key={opt.value} style={getOptionCardStyle(selected)}>
                    <input
                      type="radio"
                      name={field.id}
                      value={opt.value}
                      required={field.required === true}
                      checked={selected}
                      onChange={(e) =>
                        handleFieldStateChange(field.id, e.target.value)
                      }
                      style={{ marginTop: "2px", flexShrink: 0 }}
                    />

                    <span style={styles.optionTextWrap}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                          justifyContent: isArabic ? "space-between" : "flex-start",
                        }}
                      >
                        <span>{optionLabel}</span>
                        {optionHelpPayload
                          ? renderHelpButton(optionHelpId, helperText.optionHelp)
                          : null}
                      </span>

                      {selected ? (
                        <span style={styles.optionSelectedHint}>
                          {formText.selectedOption[lang]}
                        </span>
                      ) : null}

                      {optionHelpPayload && activeHelpId === optionHelpId
                        ? renderInlineStructuredHelp(optionHelpPayload)
                        : null}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        );

      case "checkbox":
        return (
          <div
            key={field.id}
            style={{ ...styles.fieldWrapper, ...getFieldSpanStyle(field) }}
          >
            {renderFieldGroupLabel(field, label)}
            <div style={styles.optionList}>
              {getOptionListForField(field).map((opt) => {
                const checkedValues = formState[field.id]
                  ? splitSelectedValues(formState[field.id])
                  : [];

                const selected = checkedValues.includes(opt.value);
                const optionLabel = getLocalizedText(opt.label, opt.value) || opt.value;
                const optionHelpId = `option-help-${field.id}-${opt.value}`;
                const optionHelpPayload = getOptionHelpPayload(
                  field,
                  opt,
                  optionLabel
                );

                return (
                  <label key={opt.value} style={getOptionCardStyle(selected)}>
                    <input
                      type="checkbox"
                      name={field.id}
                      value={opt.value}
                      checked={selected}
                      onChange={(e) =>
                        handleCheckboxChange(
                          field.id,
                          e.target.value,
                          e.target.checked
                        )
                      }
                      style={{ marginTop: "2px", flexShrink: 0 }}
                    />

                    <span style={styles.optionTextWrap}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                          justifyContent: isArabic ? "space-between" : "flex-start",
                        }}
                      >
                        <span>{optionLabel}</span>
                        {optionHelpPayload
                          ? renderHelpButton(optionHelpId, helperText.optionHelp)
                          : null}
                      </span>

                      {selected ? (
                        <span style={styles.optionSelectedHint}>
                          {formText.selectedOption[lang]}
                        </span>
                      ) : null}

                      {optionHelpPayload && activeHelpId === optionHelpId
                        ? renderInlineStructuredHelp(optionHelpPayload)
                        : null}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        );

      case "file":
        return null;

      default:
        return null;
    }
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

      {resolvedSections.map((section, index) => {
        const sectionTitle = getLocalizedText(section.title, section.id) || section.id;
        const sectionDescription = getLocalizedText(section.description, "");

        return (
          <section key={section.id} style={styles.section}>
            <div style={styles.sectionHeader}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                  justifyContent: isArabic ? "flex-end" : "flex-start",
                }}
              >
                <span style={sectionIndexStyle}>{index + 1}</span>
                <h3 style={styles.sectionTitle}>
                  {helperText.sectionLabel} — {sectionTitle}
                </h3>
              </div>

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

      <div style={submitBlockStyle}>
        <div style={styles.submitRow}>
          <div style={submitButtonWrapStyle}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...styles.submitButton,
                opacity: isSubmitting ? 0.75 : 1,
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting
                ? formText.addingToCart[lang]
                : formText.addToCart[lang]}
            </button>
          </div>
        </div>

        <p style={submitHintStyle}>{helperText.submitHint}</p>
      </div>

      {renderHelperAccordion()}
    </form>
  );

  return (
    <div style={layoutShellStyle}>
      <div style={contentColumnStyle}>{formContent}</div>
    </div>
  );
}