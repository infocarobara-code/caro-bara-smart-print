"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  language: "ar" | "de" | "en";
};

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

const guideRoutes = [
  "/guide/start",
  "/guide/path",
  "/guide/form",
  "/guide/cart",
  "/guide/submit",
  "/guide/contact",
] as const;

export default function HomeStatsSection({ language }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  return (
    <section
      style={{
        padding: isMobile ? "10px 16px 12px" : "0px 20px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* TITLE */}
        <div
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "18px" : "26px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#8a735c",
              marginBottom: "6px",
              letterSpacing: "0.08em",
            }}
          >
            {guideText.eyebrow[language]}
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: isMobile ? "26px" : "22px",
              fontWeight: 700,
              color: "#2f2419",
              lineHeight: 1.3,
            }}
          >
            {guideText.title[language]}
          </h2>
        </div>

        {/* STEPS */}
        <div
          style={{
            position: "relative",
            padding: isMobile ? "0" : "16px 10px",
          }}
        >
          {!isMobile && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                right: 0,
                height: "1px",
                background: "#e6dbcd",
                transform: "translateY(-50%)",
              }}
            />
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(2, 1fr)"
                : "repeat(auto-fit, minmax(140px, 1fr))",
              gap: isMobile ? "12px" : "18px",
            }}
          >
            {guideText.steps[language].map((step, index) => (
              <Link
                key={index}
                href={guideRoutes[index]}
                style={{
                  textAlign: "center",
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  background: isMobile ? "#f8f3ec" : "transparent",
                  border: isMobile ? "1px solid #eadfce" : "none",
                  borderRadius: isMobile ? "16px" : "0",
                  padding: isMobile ? "14px 10px" : "0",
                  minHeight: isMobile ? "110px" : "auto",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* DOT */}
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#2f2419",
                    marginBottom: "8px",
                    boxShadow: `0 0 0 5px ${
                      isMobile ? "#f8f3ec" : "#f5f1eb"
                    }`,
                  }}
                />

                {/* NUMBER */}
                <div
                  style={{
                    fontSize: "10px",
                    color: "#8a735c",
                    marginBottom: "4px",
                    fontWeight: 700,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* TEXT */}
                <div
                  style={{
                    fontSize: isMobile ? "12px" : "13px",
                    lineHeight: 1.5,
                    color: "#4a3a2b",
                    maxWidth: "130px",
                  }}
                >
                  {step}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}