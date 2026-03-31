"use client";

import { useState } from "react";
import { services } from "@/data/services";
import ServiceForm from "@/components/ServiceForm";
import { Language } from "@/types/service";

export default function RequestPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>("ar");

  const selectedService = services.find((item) => item.id === selected);
  const isArabic = lang === "ar";

  const text = {
    title:
      lang === "ar"
        ? "اختر نوع الخدمة"
        : lang === "de"
        ? "Dienst auswählen"
        : "Choose Service",

    subtitle:
      lang === "ar"
        ? "اختر القسم الأقرب إلى طلبك، ثم املأ التفاصيل وسنحوّلها إلى حل عملي وتنفيذي."
        : lang === "de"
        ? "Wähle den Bereich, der deiner Anfrage am nächsten kommt, und fülle dann die Details aus."
        : "Choose the category closest to your request, then fill in the details.",

    selectedTitle:
      lang === "ar"
        ? "الخدمة المختارة"
        : lang === "de"
        ? "Ausgewählter Service"
        : "Selected Service",
  };

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      style={{
        padding: "40px",
        maxWidth: "1100px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => setLang("ar")}
          style={{
            padding: "10px 16px",
            border: "1px solid black",
            background: lang === "ar" ? "black" : "white",
            color: lang === "ar" ? "white" : "black",
            cursor: "pointer",
            borderRadius: "8px",
          }}
        >
          عربي
        </button>

        <button
          type="button"
          onClick={() => setLang("de")}
          style={{
            padding: "10px 16px",
            border: "1px solid black",
            background: lang === "de" ? "black" : "white",
            color: lang === "de" ? "white" : "black",
            cursor: "pointer",
            borderRadius: "8px",
          }}
        >
          Deutsch
        </button>

        <button
          type="button"
          onClick={() => setLang("en")}
          style={{
            padding: "10px 16px",
            border: "1px solid black",
            background: lang === "en" ? "black" : "white",
            color: lang === "en" ? "white" : "black",
            cursor: "pointer",
            borderRadius: "8px",
          }}
        >
          English
        </button>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ marginBottom: "10px", fontSize: "30px" }}>
          {text.title}
        </h1>
        <p style={{ color: "#444", lineHeight: "1.7" }}>{text.subtitle}</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "14px",
          marginBottom: "30px",
        }}
      >
        {services.map((service) => {
          const isSelected = selected === service.id;

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => setSelected(service.id)}
              style={{
                padding: "18px",
                border: isSelected ? "2px solid black" : "1px solid #bbb",
                background: isSelected ? "black" : "white",
                color: isSelected ? "white" : "black",
                cursor: "pointer",
                borderRadius: "14px",
                textAlign: isArabic ? "right" : "left",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  marginBottom: "8px",
                }}
              >
                {service.title[lang]}
              </div>

              <div
                style={{
                  fontSize: "14px",
                  lineHeight: "1.7",
                  color: isSelected ? "#f1f1f1" : "#555",
                }}
              >
                {service.description[lang]}
              </div>
            </button>
          );
        })}
      </div>

      {selectedService && (
        <div
          style={{
            marginBottom: "20px",
            padding: "18px",
            border: "1px solid #ccc",
            borderRadius: "12px",
            background: "#fafafa",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: "#666",
              marginBottom: "8px",
            }}
          >
            {text.selectedTitle}
          </div>

          <div
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            {selectedService.title[lang]}
          </div>

          <div
            style={{
              color: "#444",
              lineHeight: "1.7",
            }}
          >
            {selectedService.description[lang]}
          </div>
        </div>
      )}

      {selectedService && <ServiceForm service={selectedService} lang={lang} />}
    </div>
  );
}