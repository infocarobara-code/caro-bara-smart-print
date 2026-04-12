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

  const topText = {
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
      lang === "ar"
        ? "القسم"
        : lang === "de"
          ? "Abschnitt"
          : "Section",
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
        ? "إظهار المساعدة"
        : lang === "de"
          ? "Hilfe anzeigen"
          : "Show Help",
    helperClose:
      lang === "ar"
        ? "إخفاء المساعدة"
        : lang === "de"
          ? "Hilfe ausblenden"
          : "Hide Help",
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

  const topSummaryCardStyle: CSSProperties = {
    background: "#fffaf4",
    border: "1px solid #e6d6c3",
    borderRadius: "18px",
    padding: isMobile ? "14px" : "16px",
    display: "grid",
    gap: "10px",
    boxShadow: "0 6px 18px rgba(90, 70, 40, 0.05)",
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
    color: "#2f2419",
    fontWeight: 800,
    textAlign: isArabic ? "right" : "left",
  };

  const topSummaryTextStyle: CSSProperties = {
    margin: 0,
    fontSize: "13px",
    lineHeight: 1.75,
    color: "#6a5642",
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
    border: "1px solid #e1cfbb",
    background: "#ffffff",
    color: "#5e4836",
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
    background: "#f0e1cf",
    color: "#6a5036",
    fontSize: "12px",
    fontWeight: 800,
    flexShrink: 0,
  };

  const submitHintStyle: CSSProperties = {
    marginTop: "8px",
    fontSize: "12px",
    lineHeight: 1.7,
    color: "#735f4b",
    textAlign: isArabic ? "right" : "left",
  };

  const helperBoxStyle: CSSProperties = {
    border: "1px solid #e6d7c5",
    background: "#fffaf5",
    borderRadius: "22px",
    padding: isMobile ? "14px" : "18px",
    boxShadow: "0 6px 18px rgba(90, 70, 40, 0.04)",
    display: "grid",
    gap: "14px",
  };

  const helperHeaderStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    flexWrap: "wrap",
  };

  const helperTitleStyle: CSSProperties = {
    margin: 0,
    fontSize: "16px",
    lineHeight: 1.4,
    color: "#2f2419",
    fontWeight: 800,
    textAlign: isArabic ? "right" : "left",
  };

  const helperButtonStyle: CSSProperties = {
    border: "1px solid #decab4",
    background: "#ffffff",
    color: "#5d4734",
    borderRadius: "999px",
    minHeight: "38px",
    padding: "8px 14px",
    fontSize: "12px",
    fontWeight: 800,
    cursor: "pointer",
  };

  const helperCardsStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: isDesktop ? "repeat(3, minmax(0, 1fr))" : "1fr",
    gap: "12px",
  };

  const helperCardStyle: CSSProperties = {
    border: "1px solid #eadbca",
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
    color: "#6b5038",
    fontWeight: 800,
    textAlign: isArabic ? "right" : "left",
  };

  const helperCardTextStyle: CSSProperties = {
    margin: 0,
    fontSize: "12px",
    lineHeight: 1.8,
    color: "#6e5a47",
    textAlign: isArabic ? "right" : "left",
  };

  const helperFooterStyle: CSSProperties = {
    display: "flex",
    justifyContent: isArabic ? "flex-start" : "flex-end",
  };

  const helperBackButtonStyle: CSSProperties = {
    border: "1px solid #e0cdb8",
    background: "#fff",
    color: "#604934",
    borderRadius: "999px",
    minHeight: "36px",
    padding: "7px 14px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
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
    border: selected ? "1px solid #b89267" : "1px solid #e6d9ca",
    background: selected ? "#fff6ec" : "#fffdfa",
    boxShadow: selected ? "0 6px 14px rgba(184, 146, 103, 0.12)" : "none",
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
        <h3 style={topSummaryTitleStyle}>{topText.progressTitle}</h3>
        <div style={topSummaryMetaWrapStyle}>
          <span style={topSummaryMetaStyle}>
            {topText.requiredDone}: {sectionProgress.completedRequiredCount}/
            {sectionProgress.requiredCount}
          </span>
          <span style={topSummaryMetaStyle}>{analysis.score}%</span>
        </div>
      </div>

      <p style={topSummaryTextStyle}>{topText.progressText}</p>
      <p style={{ ...topSummaryTextStyle, marginTop: "-2px" }}>
        {topText.readyHint}
      </p>
    </div>
  );

  const renderQuickHintCard = () => (
    <div style={helperCardStyle}>
      <h4 style={helperCardTitleStyle}>{topText.quickReview}</h4>
      <p style={helperCardTextStyle}>{topText.submitHint}</p>
    </div>
  );

  const renderBottomHelper = () => (
    <section style={helperBoxStyle}>
      <div style={helperHeaderStyle}>
        <h3 style={helperTitleStyle}>{topText.helperTitle}</h3>

        <button
          type="button"
          onClick={() => setHelperOpen((prev) => !prev)}
          aria-expanded={helperOpen}
          style={helperButtonStyle}
        >
          {helperOpen ? topText.helperClose : topText.helperOpen}
        </button>
      </div>

      <div style={helperCardsStyle}>
        {renderTopSummary()}
        {renderServiceIntro()}
        {renderQuickHintCard()}
      </div>

      {helperOpen ? renderAnalysisContent() : null}

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
          {topText.backButton}
        </button>
      </div>
    </section>
  );

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
          <div
            key={field.id}
            style={{ ...styles.fieldWrapper, ...getFieldSpanStyle(field) }}
          >
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
          <div
            key={field.id}
            style={{ ...styles.fieldWrapper, ...getFieldSpanStyle(field) }}
          >
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
          <div
            key={field.id}
            style={{ ...styles.fieldWrapper, ...getFieldSpanStyle(field) }}
          >
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
            <span style={styles.label}>{label}</span>
            <div style={styles.optionList}>
              {getOptionListForField(field).map((opt) => {
                const selected = formState[field.id] === opt.value;

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
                      <span>{getLocalizedText(opt.label, opt.value) || opt.value}</span>
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
          <div
            key={field.id}
            style={{ ...styles.fieldWrapper, ...getFieldSpanStyle(field) }}
          >
            <span style={styles.label}>{label}</span>
            <div style={styles.optionList}>
              {getOptionListForField(field).map((opt) => {
                const checkedValues = formState[field.id]
                  ? splitSelectedValues(formState[field.id])
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
                        handleCheckboxChange(
                          field.id,
                          e.target.value,
                          e.target.checked
                        )
                      }
                      style={{ marginTop: "2px", flexShrink: 0 }}
                    />
                    <span style={styles.optionTextWrap}>
                      <span>{getLocalizedText(opt.label, opt.value) || opt.value}</span>
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
                  {topText.sectionLabel} — {sectionTitle}
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

        <p style={submitHintStyle}>{topText.submitHint}</p>
      </div>

      {renderBottomHelper()}
    </form>
  );

  return (
    <div style={layoutShellStyle}>
      <div style={contentColumnStyle}>{formContent}</div>
    </div>
  );
}