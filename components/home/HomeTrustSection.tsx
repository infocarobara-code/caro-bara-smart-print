"use client";

type Props = {
  language: "ar" | "de" | "en";
};

const trustText = {
  title: {
    ar: "جودة يمكنك الوثوق بها",
    de: "Qualität, der du vertrauen kannst",
    en: "Quality you can trust",
  },
  description: {
    ar: "نقدم خدمات طباعة وتنفيذ دقيقة، مع اهتمام بالتفاصيل وجودة في كل مرحلة من مراحل العمل.",
    de: "Wir liefern präzise Druck- und Produktionslösungen mit Fokus auf Details und Qualität.",
    en: "We deliver precise print and production solutions with attention to detail and quality.",
  },
};

export default function HomeTrustSection({ language }: Props) {
  return (
    <section
      aria-label={trustText.title[language]}
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        padding: "40px 16px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "center",
        overflowX: "clip",
        overflowY: "visible",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "980px",
          width: "100%",
          minWidth: 0,
          textAlign: "center",
          display: "grid",
          gap: "14px",
          boxSizing: "border-box",
          padding: "clamp(22px, 4vw, 30px)",
          borderRadius: "28px",
          background: "#ffffff",
          border: "1px solid var(--wa-border)",
          boxShadow: "0 8px 20px rgba(24, 119, 242, 0.08)",
          position: "relative",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "clamp(18px, 4vw, 26px)",
            fontWeight: 800,
            color: "var(--wa-text-primary)",
            lineHeight: 1.35,
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            boxSizing: "border-box",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {trustText.title[language]}
        </h2>

        <p
          style={{
            margin: 0,
            fontSize: "14px",
            lineHeight: 1.8,
            color: "var(--wa-text-secondary)",
            width: "100%",
            maxWidth: "700px",
            marginInline: "auto",
            boxSizing: "border-box",
            minWidth: 0,
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {trustText.description[language]}
        </p>
      </div>
    </section>
  );
}