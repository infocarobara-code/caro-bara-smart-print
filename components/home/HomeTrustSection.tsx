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
        background: "#f7f2ec",
        display: "flex",
        justifyContent: "center",
        overflowX: "clip",
        overflowY: "visible",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          width: "100%",
          minWidth: 0,
          maxWidth: "100%",
          textAlign: "center",
          display: "grid",
          gap: "14px",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "clamp(18px, 4vw, 26px)",
            fontWeight: 800,
            color: "#2f2419",
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
            color: "#5a4a3a",
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