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

  useEffect(() => {
    const updateViewport = () => {
      setIsDesktop(window.innerWidth >= 1100);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

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
      const value = getFieldValue(form, field);

      if (value) {
        data[field.id] = value;
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
      gap: "16px",
      alignItems: "start",
    } satisfies CSSProperties,

    form: {
      marginTop: 0,
      padding: "14px",
      border: "1px solid #e7dacb",
      borderRadius: "18px",
      background: "rgba(255,255,255,0.95)",
      boxShadow: "0 8px 22px rgba(89, 68, 41, 0.05)",
      backdropFilter: "blur(4px)",
      minWidth: 0,
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
      padding: "16px",
      borderRadius: "18px",
      border: "1px solid #e7dacb",
      background: "#fffaf4",
      boxShadow: "0 6px 18px rgba(89, 68, 41, 0.04)",
    } satisfies CSSProperties,

    analysisTitle: {
      margin: "0 0 6px",
      fontSize: "16px",
      fontWeight: 800,
      color: "#2f2419",
    } satisfies CSSProperties,

    analysisHelper: {
      margin: "0 0 14px",
      fontSize: "12px",
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
      fontSize: "13px",
      fontWeight: 800,
      color: "#3a2d22",
    } satisfies CSSProperties,

    analysisText: {
      margin: 0,
      fontSize: "13px",
      lineHeight: 1.8,
      color: "#5f4d3d",
      wordBreak: "break-word",
    } satisfies CSSProperties,

    analysisList: {
      margin: 0,
      paddingInlineStart: "18px",
      fontSize: "13px",
      lineHeight: 1.8,
    } satisfies CSSProperties,

    scoreWrap: {
      marginTop: "12px",
      paddingTop: "12px",
      borderTop: "1px solid #eee2d3",
    } satisfies CSSProperties,

    scoreValue: {
      fontSize: "22px",
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
      padding: "12px",
      borderRadius: "15px",
      border: "1px solid #eadfd3",
      background: "#fffdfa",
    } satisfies CSSProperties,

    sectionHeader: {
      marginBottom: "10px",
    } satisfies CSSProperties,

    sectionTitle: {
      margin: 0,
      fontSize: "14px",
      lineHeight: 1.35,
      fontWeight: 800,
      color: "#33271d",
    } satisfies CSSProperties,

    sectionDescription: {
      margin: "5px 0 0",
      fontSize: "12px",
      lineHeight: 1.65,
      color: "#6e5947",
    } satisfies CSSProperties,

    fieldsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "10px",
    } satisfies CSSProperties,

    fieldWrapper: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      minWidth: 0,
    } satisfies CSSProperties,

    label: {
      fontSize: "12px",
      lineHeight: 1.45,
      fontWeight: 700,
      color: "#34281e",
    } satisfies CSSProperties,

    input: {
      width: "100%",
      minHeight: "42px",
      padding: "10px 11px",
      border: "1px solid #dbc9b5",
      borderRadius: "11px",
      fontSize: "14px",
      color: "#2f2419",
      background: "#fffdfa",
      outline: "none",
      boxSizing: "border-box",
    } satisfies CSSProperties,

    textarea: {
      width: "100%",
      minHeight: "96px",
      padding: "11px",
      border: "1px solid #dbc9b5",
      borderRadius: "12px",
      fontSize: "14px",
      color: "#2f2419",
      background: "#fffdfa",
      outline: "none",
      resize: "vertical",
      boxSizing: "border-box",
      lineHeight: 1.7,
    } satisfies CSSProperties,

    optionList: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "7px",
    } satisfies CSSProperties,

    optionCard: {
      display: "flex",
      alignItems: "flex-start",
      gap: "9px",
      padding: "9px 10px",
      border: "1px solid #e6d9ca",
      borderRadius: "11px",
      background: "#fffdfa",
      cursor: "pointer",
      lineHeight: 1.6,
      color: "#3b2f24",
      fontSize: "13px",
    } satisfies CSSProperties,

    fileInputWrap: {
      padding: "10px",
      borderRadius: "12px",
      border: "1px dashed #d8c2a8",
      background: "#fff9f2",
    } satisfies CSSProperties,

    fileHint: {
      fontSize: "12px",
      lineHeight: 1.5,
      color: "#8b7156",
      marginBottom: "7px",
    } satisfies CSSProperties,

    submitRow: {
      marginTop: "14px",
      display: "flex",
      justifyContent: isArabic ? "flex-start" : "flex-end",
    } satisfies CSSProperties,

    submitButton: {
      width: "100%",
      maxWidth: "260px",
      minHeight: "46px",
      padding: "11px 18px",
      borderRadius: "14px",
      border: "1px solid #241a12",
      background: "#1f1711",
      color: "#ffffff",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: 800,
      boxShadow: "0 8px 18px rgba(34, 23, 16, 0.12)",
    } satisfies CSSProperties,
  };

  const renderAnalysis = () => (
    <div style={styles.analysisColumn}>
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
    </div>
  );

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
              defaultValue=""
              onChange={(e) => handleFieldStateChange(field.id, e.target.value)}
            >
              <option value="">{getLocalizedSelectPlaceholder(field)}</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {getLocalizedText(opt.label, opt.value)}
                </option>
              ))}
            </select>
          </div>
        );
      case "radio":
        return (
          <div key={field.id} style={{ ...styles.fieldWrapper, ...getFieldSpanStyle(field) }}>
            <span style={styles.label}>{label}</span>
            <div style={styles.optionList}>
              {field.options?.map((opt) => (
                <label key={opt.value} style={styles.optionCard}>
                  <input
                    type="radio"
                    name={field.id}
                    value={opt.value}
                    required={field.required === true}
                    onChange={(e) => handleFieldStateChange(field.id, e.target.value)}
                    style={{ marginTop: "2px", flexShrink: 0 }}
                  />
                  <span>{getLocalizedText(opt.label, opt.value)}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case "checkbox":
        return (
          <div key={field.id} style={{ ...styles.fieldWrapper, ...getFieldSpanStyle(field) }}>
            <span style={styles.label}>{label}</span>
            <div style={styles.optionList}>
              {field.options?.map((opt) => (
                <label key={opt.value} style={styles.optionCard}>
                  <input
                    type="checkbox"
                    name={field.id}
                    value={opt.value}
                    onChange={(e) =>
                      handleCheckboxChange(field.id, e.target.value, e.target.checked)
                    }
                    style={{ marginTop: "2px", flexShrink: 0 }}
                  />
                  <span>{getLocalizedText(opt.label, opt.value)}</span>
                </label>
              ))}
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

      {!isDesktop && renderAnalysis()}

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
          {isArabic ? renderAnalysis() : formContent}
          {isArabic ? formContent : renderAnalysis()}
        </>
      ) : (
        formContent
      )}
    </div>
  );
}