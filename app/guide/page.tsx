"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/languageContext";

const guideText = {
  eyebrow: {
    ar: "دليل الصفحة",
    de: "Seitenstruktur",
    en: "Page Structure",
  },
  title: {
    ar: "كيف يعمل الموقع",
    de: "Wie die Plattform funktioniert",
    en: "How the platform works",
  },
  description: {
    ar: "كل خطوة تمثل جزءاً من كيفية التنقل في الموقع، مع صورة توضح كل خطوة.",
    de: "Jeder Schritt stellt einen Teil des Navigationsprozesses dar, mit einem Bild, das jeden Schritt verdeutlicht.",
    en: "Each step represents part of the navigation process, with an image illustrating each step.",
  },
  steps: {
    ar: [
      "ابدأ من الفكرة أو الخدمة",
      "اختيار المسار المناسب",
      "تعبئة الطلب بشكل منظم",
      "مراجعة الطلب داخل السلة",
      "إرسال الطلب للتنفيذ",
      "متابعة أو التواصل عند الحاجة",
    ],
    de: [
      "Idee oder Leistung wählen",
      "Passenden Weg auswählen",
      "Anfrage strukturiert ausfüllen",
      "Im Warenkorb prüfen",
      "Zur Umsetzung senden",
      "Bei Bedarf Kontakt aufnehmen",
    ],
    en: [
      "Start with idea or service",
      "Choose the right path",
      "Fill structured request",
      "Review in cart",
      "Submit for execution",
      "Contact if needed",
    ],
  },
} as const;

const guideImages = [
  "/guide/start.jpg",
  "/guide/path.jpg",
  "/guide/form.jpg",
  "/guide/cart.jpg",
  "/guide/submit.jpg",
  "/guide/contact.jpg",
] as const;

export default function GuidePage() {
  const { language } = useLanguage();

  const currentLanguage =
    language === "ar" || language === "de" || language === "en"
      ? language
      : "ar";

  const currentSteps = guideText.steps[currentLanguage];
  const isArabic = currentLanguage === "ar";

  return (
    <main
      style={{
        backgroundColor: "#f5f1eb",
        padding: "clamp(14px, 4vw, 20px)",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        overflowX: "clip",
      }}
    >
      <section
        style={{
          textAlign: "center",
          marginBottom: "40px",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#8a735c",
            marginBottom: "8px",
          }}
        >
          {guideText.eyebrow[currentLanguage]}
        </div>

        <h1
          style={{
            fontSize: "26px",
            fontWeight: 700,
            color: "#2f2419",
            margin: "0 0 12px",
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {guideText.title[currentLanguage]}
        </h1>

        <p
          style={{
            fontSize: "16px",
            lineHeight: 1.5,
            color: "#4a3a2b",
            margin: 0,
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {guideText.description[currentLanguage]}
        </p>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
          gap: "20px",
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
        }}
      >
        {currentSteps.map((step, index) => (
          <Link
            key={index}
            href={`/guide/step-${index + 1}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              background: "#fffaf5",
              border: "1px solid #ebe1d6",
              borderRadius: "18px",
              boxShadow: "0 4px 14px rgba(70, 49, 29, 0.025)",
              textAlign: "center",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              transition: "transform 0.2s, box-shadow 0.2s",
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,
              boxSizing: "border-box",
              overflow: "hidden",
              direction: isArabic ? "rtl" : "ltr",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 10px 22px rgba(70, 49, 29, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 4px 14px rgba(70, 49, 29, 0.025)";
            }}
          >
            <img
              src={guideImages[index]}
              alt={`Step ${index + 1}`}
              style={{
                width: "100%",
                maxWidth: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "12px",
                marginBottom: "10px",
                display: "block",
              }}
            />

            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#2f2419",
                margin: 0,
                width: "100%",
                maxWidth: "100%",
                overflowWrap: "anywhere",
                wordBreak: "break-word",
                lineHeight: 1.5,
              }}
            >
              {step}
            </h3>
          </Link>
        ))}
      </div>
    </main>
  );
}