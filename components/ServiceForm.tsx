"use client";

import { Service, ServiceField, Language } from "@/types/service";

type Props = {
  service: Service;
  lang: Language;
};

export default function ServiceForm({ service, lang }: Props) {
  const renderField = (field: ServiceField) => {
    const label = field.label[lang];
    const placeholder = field.placeholder?.[lang] || "";

    switch (field.type) {
      case "text":
      case "number":
        return (
          <div key={field.id} style={{ marginTop: "15px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>{label}</label>
            <input
              name={field.id}
              type={field.type}
              placeholder={placeholder}
              required={field.required}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid black",
                borderRadius: "6px",
              }}
            />
          </div>
        );

      case "textarea":
        return (
          <div key={field.id} style={{ marginTop: "15px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>{label}</label>
            <textarea
              name={field.id}
              placeholder={placeholder}
              required={field.required}
              style={{
                width: "100%",
                minHeight: "120px",
                padding: "10px",
                border: "1px solid black",
                borderRadius: "6px",
              }}
            />
          </div>
        );

      case "select":
        return (
          <div key={field.id} style={{ marginTop: "15px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>{label}</label>
            <select
              name={field.id}
              required={field.required}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid black",
                borderRadius: "6px",
              }}
              defaultValue=""
            >
              <option value="">
                {lang === "ar"
                  ? "اختر"
                  : lang === "de"
                  ? "Wählen"
                  : "Select"}
              </option>

              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label[lang]}
                </option>
              ))}
            </select>
          </div>
        );

      case "radio":
        return (
          <div key={field.id} style={{ marginTop: "15px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>{label}</label>

            {field.options?.map((opt) => (
              <label
                key={opt.value}
                style={{ display: "block", marginBottom: "8px", cursor: "pointer" }}
              >
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  required={field.required}
                  style={{ marginRight: "8px" }}
                />
                {opt.label[lang]}
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div key={field.id} style={{ marginTop: "15px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>{label}</label>

            {field.options?.map((opt) => (
              <label
                key={opt.value}
                style={{ display: "block", marginBottom: "8px", cursor: "pointer" }}
              >
                <input
                  type="checkbox"
                  name={field.id}
                  value={opt.value}
                  style={{ marginRight: "8px" }}
                />
                {opt.label[lang]}
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    let message =
      lang === "de"
        ? `Neue Anfrage\n\nService: ${service.title[lang]}\n\n`
        : lang === "en"
        ? `New Request\n\nService: ${service.title[lang]}\n\n`
        : `طلب جديد\n\nالخدمة: ${service.title[lang]}\n\n`;

    service.fields.forEach((field) => {
      let value = "";

      if (field.type === "checkbox") {
        const checked = form.querySelectorAll(
          `input[name="${field.id}"]:checked`
        ) as NodeListOf<HTMLInputElement>;

        value = Array.from(checked)
          .map((item) => {
            const option = field.options?.find((opt) => opt.value === item.value);
            return option ? option.label[lang] : item.value;
          })
          .join(", ");
      } else if (field.type === "radio") {
        const selectedRadio = form.querySelector(
          `input[name="${field.id}"]:checked`
        ) as HTMLInputElement | null;

        if (selectedRadio) {
          const option = field.options?.find((opt) => opt.value === selectedRadio.value);
          value = option ? option.label[lang] : selectedRadio.value;
        }
      } else if (field.type === "select") {
        const select = form.elements.namedItem(field.id) as HTMLSelectElement | null;
        if (select && select.value) {
          const option = field.options?.find((opt) => opt.value === select.value);
          value = option ? option.label[lang] : select.value;
        }
      } else {
        const input = form.elements.namedItem(field.id) as
          | HTMLInputElement
          | HTMLTextAreaElement
          | null;

        if (input) {
          value = input.value.trim();
        }
      }

      if (value) {
        message += `${field.label[lang]}: ${value}\n`;
      }
    });

    const url = `https://wa.me/4917621105086?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: "30px",
        padding: "20px",
        border: "1px solid black",
        borderRadius: "10px",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>{service.title[lang]}</h2>

      {service.fields.map((field) => renderField(field))}

      <button
        type="submit"
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "6px",
        }}
      >
        {lang === "ar"
          ? "إرسال الطلب"
          : lang === "de"
          ? "Anfrage senden"
          : "Send Request"}
      </button>
    </form>
  );
}