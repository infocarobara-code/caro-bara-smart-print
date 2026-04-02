"use client";

import type { CSSProperties, FormEvent } from "react";
import { useMemo, useState } from "react";
import type { Service, ServiceField } from "@/types/service";
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

type FieldGroupKey = "dimensions" | "project" | "specifications" | "notes";

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
    ar: "ابدأ بإدخال المقاسات والكميات الأساسية لأنها أهم نقطة لفهم الطلب بشكل صحيح.",
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

  const getLocalizedLabel = (field: ServiceField) => {
    return (
      field.label?.[lang] ||
      field.label?.en ||
      field.label?.de ||
      field.label?.ar ||
      field.id
    );
  };

  const getLocalizedPlaceholder = (field: ServiceField) => {
    const localized =
      field.placeholder?.[lang] ||
      field.placeholder?.en ||
      field.placeholder?.de ||
      field.placeholder?.ar ||
      "";

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
      fieldId === "fullName" ||
      fieldId === "customername" ||
      fieldId === "customerName" ||
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

  const classifyField = (field: ServiceField): FieldGroupKey => {
    const fieldId = field.id.toLowerCase();

    if (
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
      fieldId.includes("note") ||
      fieldId.includes("details") ||
      fieldId.includes("message") ||
      fieldId.includes("comment") ||
      field.type === "textarea"
    ) {
      return "notes";
    }

    if (
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

  const groupedFields = useMemo(() => {
    const visibleFields = service.fields
      .filter((field) => !shouldHideField(field))
      .sort((a, b) => getFieldPriority(a) - getFieldPriority(b));

    return {
      dimensions: visibleFields.filter((field) => classifyField(field) === "dimensions"),
      project: visibleFields.filter((field) => classifyField(field) === "project"),
      specifications: visibleFields.filter(
        (field) => classifyField(field) === "specifications"
      ),
      notes: visibleFields.filter((field) => classifyField(field) === "notes"),
    };
  }, [service.fields, formState]);

  const groupOrder: FieldGroupKey[] = ["dimensions", "project", "specifications", "notes"];

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
      const file = fileInput?.files?.[0];
      return file ? file.name : "";
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

    service.fields.forEach((field) => {
      if (shouldHideField(field)) return;

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

  const getSectionText = (group: FieldGroupKey) => {
    switch (group) {
      case "dimensions":
        return {
          title: formText.dimensionsSectionTitle[lang],
          description: formText.dimensionsSectionDescription[lang],
        };
      case "project":
        return {
          title: formText.projectSectionTitle[lang],
          description: formText.projectSectionDescription[lang],
        };
      case "specifications":
        return {
          title: formText.specificationsSectionTitle[lang],
          description: formText.specificationsSectionDescription[lang],
        };
      case "notes":
        return {
          title: formText.notesSectionTitle[lang],
          description: formText.notesSectionDescription[lang],
        };
      default:
        return {
          title: "",
          description: "",
        };
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
      marginTop: "30px",
      padding: "28px",
      border: "1px solid #e4d6c6",
      borderRadius: "28px",
      background: "rgba(255,255,255,0.88)",
      boxShadow: "0 18px 45px rgba(89, 68, 41, 0.08)",
      backdropFilter: "blur(6px)",
    } satisfies CSSProperties,

    topBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "16px",
      flexWrap: "wrap",
      marginBottom: "24px",
      paddingBottom: "20px",
      borderBottom: "1px solid #eee0d1",
    } satisfies CSSProperties,

    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 14px",
      borderRadius: "999px",
      border: "1px solid #dcc8b0",
      background: "#f5eadb",
      color: "#6c5238",
      fontSize: "12px",
      fontWeight: 700,
      marginBottom: "12px",
    } satisfies CSSProperties,

    title: {
      margin: 0,
      fontSize: "clamp(26px, 3.4vw, 34px)",
      lineHeight: 1.25,
      color: "#2f2419",
      fontWeight: 800,
    } satisfies CSSProperties,

    description: {
      margin: "10px 0 0",
      maxWidth: "720px",
      fontSize: "15px",
      lineHeight: 1.9,
      color: "#675341",
    } satisfies CSSProperties,

    helperBox: {
      minWidth: "220px",
      flex: "1 1 240px",
      maxWidth: "320px",
      padding: "16px 18px",
      borderRadius: "18px",
      background: "#fffaf4",
      border: "1px solid #eadbc9",
    } satisfies CSSProperties,

    helperLabel: {
      fontSize: "12px",
      fontWeight: 700,
      color: "#8b7156",
      marginBottom: "6px",
    } satisfies CSSProperties,

    helperValue: {
      fontSize: "16px",
      lineHeight: 1.6,
      fontWeight: 700,
      color: "#2f2419",
    } satisfies CSSProperties,

    statusBox: {
      marginBottom: "20px",
      padding: "14px 16px",
      borderRadius: "16px",
      fontSize: "14px",
      lineHeight: 1.8,
      fontWeight: 600,
    } satisfies CSSProperties,

    section: {
      marginTop: "22px",
      padding: "22px",
      borderRadius: "22px",
      border: "1px solid #eadccf",
      background: "#fffdfa",
    } satisfies CSSProperties,

    sectionHeader: {
      marginBottom: "18px",
    } satisfies CSSProperties,

    sectionTitle: {
      margin: 0,
      fontSize: "20px",
      lineHeight: 1.4,
      fontWeight: 800,
      color: "#33271d",
    } satisfies CSSProperties,

    sectionDescription: {
      margin: "8px 0 0",
      fontSize: "14px",
      lineHeight: 1.8,
      color: "#6e5947",
    } satisfies CSSProperties,

    fieldsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: "18px",
    } satisfies CSSProperties,

    fieldWrapper: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    } satisfies CSSProperties,

    label: {
      fontSize: "14px",
      lineHeight: 1.5,
      fontWeight: 700,
      color: "#34281e",
    } satisfies CSSProperties,

    input: {
      width: "100%",
      minHeight: "48px",
      padding: "12px 14px",
      border: "1px solid #dbc9b5",
      borderRadius: "14px",
      fontSize: "14px",
      color: "#2f2419",
      background: "#fffdfa",
      outline: "none",
      boxSizing: "border-box",
    } satisfies CSSProperties,

    textarea: {
      width: "100%",
      minHeight: "136px",
      padding: "14px",
      border: "1px solid #dbc9b5",
      borderRadius: "16px",
      fontSize: "14px",
      color: "#2f2419",
      background: "#fffdfa",
      outline: "none",
      resize: "vertical",
      boxSizing: "border-box",
      lineHeight: 1.8,
    } satisfies CSSProperties,

    optionList: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "10px",
    } satisfies CSSProperties,

    optionCard: {
      display: "flex",
      alignItems: "flex-start",
      gap: "10px",
      padding: "12px 14px",
      border: "1px solid #e4d5c4",
      borderRadius: "14px",
      background: "#fffdfa",
      cursor: "pointer",
      lineHeight: 1.7,
      color: "#3b2f24",
      fontSize: "14px",
    } satisfies CSSProperties,

    fileInputWrap: {
      padding: "14px",
      borderRadius: "16px",
      border: "1px dashed #d8c2a8",
      background: "#fff9f2",
    } satisfies CSSProperties,

    fileHint: {
      fontSize: "12px",
      lineHeight: 1.6,
      color: "#8b7156",
      marginBottom: "8px",
    } satisfies CSSProperties,

    submitRow: {
      marginTop: "28px",
      display: "flex",
      justifyContent: isArabic ? "flex-start" : "flex-end",
    } satisfies CSSProperties,

    submitButton: {
      minWidth: "220px",
      minHeight: "54px",
      padding: "14px 24px",
      borderRadius: "18px",
      border: "1px solid #241a12",
      background: "#1f1711",
      color: "#ffffff",
      cursor: "pointer",
      fontSize: "15px",
      fontWeight: 800,
      boxShadow: "0 14px 28px rgba(34, 23, 16, 0.18)",
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
                  {opt.label?.[lang] ||
                    opt.label?.en ||
                    opt.label?.de ||
                    opt.label?.ar ||
                    opt.value}
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
                      marginTop: "3px",
                      flexShrink: 0,
                    }}
                  />
                  <span>
                    {opt.label?.[lang] ||
                      opt.label?.en ||
                      opt.label?.de ||
                      opt.label?.ar ||
                      opt.value}
                  </span>
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
                      marginTop: "3px",
                      flexShrink: 0,
                    }}
                  />
                  <span>
                    {opt.label?.[lang] ||
                      opt.label?.en ||
                      opt.label?.de ||
                      opt.label?.ar ||
                      opt.value}
                  </span>
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
                }}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} dir={isArabic ? "rtl" : "ltr"} style={styles.form}>
      <div style={styles.topBar}>
        <div style={{ flex: "1 1 620px" }}>
          <div style={styles.badge}>{formText.serviceDetails[lang]}</div>

          <h2 style={styles.title}>
            {service.title?.[lang] ||
              service.title?.en ||
              service.title?.de ||
              service.title?.ar ||
              service.id}
          </h2>

          <p style={styles.description}>{formText.formIntro[lang]}</p>
        </div>

        <div style={styles.helperBox}>
          <div style={styles.helperLabel}>{formText.currentService[lang]}</div>
          <div style={styles.helperValue}>
            {service.title?.[lang] ||
              service.title?.en ||
              service.title?.de ||
              service.title?.ar ||
              service.id}
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

      {groupOrder.map((group) => {
        const fields = groupedFields[group];

        if (!fields.length) return null;

        const sectionText = getSectionText(group);

        return (
          <section key={group} style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>{sectionText.title}</h3>
              <p style={styles.sectionDescription}>{sectionText.description}</p>
            </div>

            <div style={styles.fieldsGrid}>
              {fields.map((field) => renderField(field))}
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