"use client";

import type { CSSProperties, FormEvent } from "react";
import { useMemo, useState } from "react";
import type { Service, ServiceField, ServiceSection } from "@/types/service";
import type { Language } from "@/lib/i18n";
import { addToCart } from "@/lib/cart";

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
    ar: "إضافة إلى السلة",
    de: "In den Warenkorb",
    en: "Add to Cart",
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
  formIntro: {
    ar: "أدخل تفاصيل الخدمة بدقة، وسنستخدمها لتنظيم الطلب وتحويله إلى أفضل مسار تنفيذ.",
    de: "Gib die Servicedetails präzise ein. Wir nutzen sie, um die Anfrage sauber zu organisieren und optimal weiterzuleiten.",
    en: "Enter the service details clearly. We use them to organize the request and route it to the best execution path.",
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
  serviceDetails: {
    ar: "تفاصيل الخدمة",
    de: "Servicedetails",
    en: "Service Details",
  },
  currentService: {
    ar: "الخدمة الحالية",
    de: "Aktueller Service",
    en: "Current Service",
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
};

export default function ServiceForm({ service, lang, onAddedToCart }: Props) {
  const isArabic = lang === "ar";
  const [formState, setFormState] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>({
    type: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const styles = {
    form: {
      marginTop: "20px",
      padding: "18px",
      border: "1px solid #e7dacb",
      borderRadius: "24px",
      background: "rgba(255,255,255,0.92)",
      boxShadow: "0 14px 34px rgba(89, 68, 41, 0.07)",
      backdropFilter: "blur(4px)",
    } satisfies CSSProperties,

    topBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "14px",
      flexWrap: "wrap",
      marginBottom: "18px",
      paddingBottom: "16px",
      borderBottom: "1px solid #efe2d3",
    } satisfies CSSProperties,

    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "7px 12px",
      borderRadius: "999px",
      border: "1px solid #e0cdb6",
      background: "#f8efe3",
      color: "#6c5238",
      fontSize: "11px",
      fontWeight: 700,
      marginBottom: "10px",
    } satisfies CSSProperties,

    title: {
      margin: 0,
      fontSize: "clamp(22px, 3.2vw, 30px)",
      lineHeight: 1.22,
      color: "#2f2419",
      fontWeight: 800,
    } satisfies CSSProperties,

    description: {
      margin: "8px 0 0",
      maxWidth: "720px",
      fontSize: "14px",
      lineHeight: 1.8,
      color: "#675341",
    } satisfies CSSProperties,

    helperBox: {
      minWidth: "200px",
      flex: "1 1 220px",
      maxWidth: "300px",
      padding: "14px 15px",
      borderRadius: "16px",
      background: "#fffaf4",
      border: "1px solid #eadbc9",
    } satisfies CSSProperties,

    helperLabel: {
      fontSize: "11px",
      fontWeight: 700,
      color: "#8b7156",
      marginBottom: "5px",
    } satisfies CSSProperties,

    helperValue: {
      fontSize: "15px",
      lineHeight: 1.55,
      fontWeight: 700,
      color: "#2f2419",
    } satisfies CSSProperties,

    statusBox: {
      marginBottom: "16px",
      padding: "12px 14px",
      borderRadius: "14px",
      fontSize: "13px",
      lineHeight: 1.7,
      fontWeight: 600,
    } satisfies CSSProperties,

    introBox: {
      marginBottom: "14px",
      padding: "14px 15px",
      borderRadius: "16px",
      border: "1px solid #ebe0d3",
      background: "#fffdf9",
    } satisfies CSSProperties,

    introText: {
      margin: 0,
      fontSize: "13px",
      lineHeight: 1.75,
      color: "#645240",
    } satisfies CSSProperties,

    guidanceList: {
      margin: "10px 0 0",
      paddingInlineStart: "18px",
      color: "#6b5846",
      fontSize: "13px",
      lineHeight: 1.75,
    } satisfies CSSProperties,

    section: {
      marginTop: "16px",
      padding: "16px",
      borderRadius: "18px",
      border: "1px solid #eadfd3",
      background: "#fffdfa",
    } satisfies CSSProperties,

    sectionHeader: {
      marginBottom: "14px",
    } satisfies CSSProperties,

    sectionTitle: {
      margin: 0,
      fontSize: "17px",
      lineHeight: 1.35,
      fontWeight: 800,
      color: "#33271d",
    } satisfies CSSProperties,

    sectionDescription: {
      margin: "6px 0 0",
      fontSize: "13px",
      lineHeight: 1.7,
      color: "#6e5947",
    } satisfies CSSProperties,

    fieldsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "14px",
    } satisfies CSSProperties,

    fieldWrapper: {
      display: "flex",
      flexDirection: "column",
      gap: "7px",
    } satisfies CSSProperties,

    label: {
      fontSize: "13px",
      lineHeight: 1.45,
      fontWeight: 700,
      color: "#34281e",
    } satisfies CSSProperties,

    input: {
      width: "100%",
      minHeight: "44px",
      padding: "11px 12px",
      border: "1px solid #dbc9b5",
      borderRadius: "12px",
      fontSize: "14px",
      color: "#2f2419",
      background: "#fffdfa",
      outline: "none",
      boxSizing: "border-box",
    } satisfies CSSProperties,

    textarea: {
      width: "100%",
      minHeight: "112px",
      padding: "12px",
      border: "1px solid #dbc9b5",
      borderRadius: "14px",
      fontSize: "14px",
      color: "#2f2419",
      background: "#fffdfa",
      outline: "none",
      resize: "vertical",
      boxSizing: "border-box",
      lineHeight: 1.75,
    } satisfies CSSProperties,

    optionList: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "8px",
    } satisfies CSSProperties,

    optionCard: {
      display: "flex",
      alignItems: "flex-start",
      gap: "10px",
      padding: "10px 12px",
      border: "1px solid #e6d9ca",
      borderRadius: "12px",
      background: "#fffdfa",
      cursor: "pointer",
      lineHeight: 1.65,
      color: "#3b2f24",
      fontSize: "13px",
    } satisfies CSSProperties,

    fileInputWrap: {
      padding: "12px",
      borderRadius: "14px",
      border: "1px dashed #d8c2a8",
      background: "#fff9f2",
    } satisfies CSSProperties,

    fileHint: {
      fontSize: "12px",
      lineHeight: 1.55,
      color: "#8b7156",
      marginBottom: "8px",
    } satisfies CSSProperties,

    submitRow: {
      marginTop: "20px",
      display: "flex",
      justifyContent: isArabic ? "flex-start" : "flex-end",
    } satisfies CSSProperties,

    submitButton: {
      minWidth: "190px",
      minHeight: "48px",
      padding: "12px 20px",
      borderRadius: "16px",
      border: "1px solid #241a12",
      background: "#1f1711",
      color: "#ffffff",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: 800,
      boxShadow: "0 10px 22px rgba(34, 23, 16, 0.14)",
    } satisfies CSSProperties,
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
                    style={{
                      marginTop: "2px",
                      flexShrink: 0,
                    }}
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
                    style={{
                      marginTop: "2px",
                      flexShrink: 0,
                    }}
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
                  padding: "9px 10px",
                }}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const localizedIntro =
    getLocalizedText(service.intro, "") || formText.formIntro[lang];

  const localizedGuidance =
    service.requestGuidance
      ?.map((item) => getLocalizedText(item, ""))
      .filter(Boolean) || [];

  return (
    <form onSubmit={handleSubmit} dir={isArabic ? "rtl" : "ltr"} style={styles.form}>
      <div style={styles.topBar}>
        <div style={{ flex: "1 1 520px" }}>
          <div style={styles.badge}>{formText.serviceDetails[lang]}</div>

          <h2 style={styles.title}>
            {getLocalizedText(service.title, service.id)}
          </h2>

          <p style={styles.description}>{localizedIntro}</p>
        </div>

        <div style={styles.helperBox}>
          <div style={styles.helperLabel}>{formText.currentService[lang]}</div>
          <div style={styles.helperValue}>
            {getLocalizedText(service.title, service.id)}
          </div>
        </div>
      </div>

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

      {localizedGuidance.length > 0 && (
        <div style={styles.introBox}>
          <p style={styles.introText}>{localizedIntro}</p>
          <ul style={styles.guidanceList}>
            {localizedGuidance.map((item, index) => (
              <li key={`${service.id}-guidance-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      )}

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
}