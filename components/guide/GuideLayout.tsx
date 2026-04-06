"use client";

import Link from "next/link";
import type { ReactNode, CSSProperties } from "react";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";

type Props = {
  title: string;
  description: string;
  children?: ReactNode;
  language?: "ar" | "de" | "en";
};

export default function GuideLayout({
  title,
  description,
  children,
  language = "ar",
}: Props) {
  const isArabic = language === "ar";
  const backIcon = isArabic ? <ArrowRight size={16} /> : <ArrowLeft size={16} />;

  const pageStyle: CSSProperties = {
    minHeight: "100vh",
    background: "#f5f1eb",
    padding: "26px 20px 42px",
  };

  const shellStyle: CSSProperties = {
    maxWidth: "1240px",
    margin: "0 auto",
  };

  const topBarStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: isArabic ? "flex-start" : "flex-start",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "18px",
  };

  const pillStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    minHeight: "42px",
    padding: "0 16px",
    borderRadius: "999px",
    textDecoration: "none",
    border: "1px solid #d9cab8",
    background: "rgba(255,255,255,0.82)",
    color: "#2f2419",
    fontSize: "13px",
    fontWeight: 700,
    boxShadow: "0 4px 14px rgba(70, 49, 29, 0.04)",
    transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
  };

  const heroCardStyle: CSSProperties = {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.84) 0%, rgba(250,246,241,0.97) 100%)",
    border: "1px solid #e6dbcf",
    borderRadius: "30px",
    padding: "28px",
    boxShadow: "0 10px 28px rgba(70, 49, 29, 0.04)",
    marginBottom: "18px",
    textAlign: isArabic ? "right" : "left",
  };

  const eyebrowStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "34px",
    padding: "0 14px",
    borderRadius: "999px",
    border: "1px solid #e1d4c4",
    background: "rgba(255,255,255,0.82)",
    color: "#7c6855",
    fontSize: "11px",
    fontWeight: 800,
    marginBottom: "14px",
  };

  const titleStyle: CSSProperties = {
    margin: "0 0 10px",
    fontSize: "clamp(24px, 3.8vw, 40px)",
    lineHeight: 1.15,
    color: "#2f2419",
    fontWeight: 800,
    letterSpacing: "-0.03em",
  };

  const descriptionStyle: CSSProperties = {
    margin: 0,
    maxWidth: "760px",
    fontSize: "15px",
    lineHeight: 1.9,
    color: "#6a5848",
  };

  const contentWrapStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.18fr) minmax(0, 0.82fr)",
    gap: "18px",
    alignItems: "stretch",
  };

  const galleryCardStyle: CSSProperties = {
    background: "#fffaf5",
    border: "1px solid #e6dbcf",
    borderRadius: "28px",
    padding: "16px",
    boxShadow: "0 8px 24px rgba(70, 49, 29, 0.03)",
  };

  const galleryHeaderStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "14px",
    flexWrap: "wrap",
  };

  const galleryTitleStyle: CSSProperties = {
    margin: 0,
    fontSize: "16px",
    fontWeight: 800,
    color: "#2f2419",
  };

  const galleryHintStyle: CSSProperties = {
    fontSize: "12px",
    color: "#8a735c",
    fontWeight: 700,
  };

  const galleryGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "12px",
  };

  const imagePlaceholderStyle: CSSProperties = {
    height: "170px",
    borderRadius: "18px",
    border: "1px dashed #d7c3ab",
    background: "linear-gradient(135deg, #f3eadf 0%, #ece2d4 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "14px",
    color: "#8a735c",
    fontSize: "13px",
    fontWeight: 700,
  };

  const infoCardStyle: CSSProperties = {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.84) 0%, rgba(250,246,241,0.97) 100%)",
    border: "1px solid #e6dbcf",
    borderRadius: "28px",
    padding: "22px",
    boxShadow: "0 8px 24px rgba(70, 49, 29, 0.03)",
    textAlign: isArabic ? "right" : "left",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const infoTitleStyle: CSSProperties = {
    margin: "0 0 12px",
    fontSize: "18px",
    fontWeight: 800,
    color: "#2f2419",
  };

  const infoTextStyle: CSSProperties = {
    margin: 0,
    fontSize: "14px",
    lineHeight: 1.9,
    color: "#6a5848",
  };

  const noteBoxStyle: CSSProperties = {
    marginTop: "16px",
    borderRadius: "18px",
    border: "1px solid #e5d8c9",
    background: "#fffaf5",
    padding: "14px",
    fontSize: "13px",
    lineHeight: 1.8,
    color: "#7a6856",
  };

  const sectionLabel =
    language === "ar"
      ? "دليل بصري"
      : language === "de"
      ? "Visueller Leitfaden"
      : "Visual Guide";

  const galleryTitle =
    language === "ar"
      ? "ألبوم هذه المرحلة"
      : language === "de"
      ? "Galerie dieses Schritts"
      : "Step Gallery";

  const galleryHint =
    language === "ar"
      ? "6 مساحات قابلة للتبديل لاحقًا بصور حقيقية"
      : language === "de"
      ? "6 Bereiche für spätere echte Bilder"
      : "6 areas for later real images";

  const infoTitle =
    language === "ar"
      ? "ماذا سيظهر هنا؟"
      : language === "de"
      ? "Was wird hier gezeigt?"
      : "What appears here?";

  const fallbackBody =
    language === "ar"
      ? "هذه الصفحة مخصصة لعرض شرح بصري منظم لهذه المرحلة، ويمكن لاحقًا إضافة صور أعمال حقيقية، لقطات من النماذج، أمثلة تنفيذ، أو توضيحات تساعد العميل على فهم المسار بشكل أعمق."
      : language === "de"
      ? "Diese Seite ist für eine strukturierte visuelle Erklärung dieses Schritts gedacht. Später können hier echte Arbeitsbeispiele, Formularansichten, Umsetzungsbeispiele oder visuelle Erklärungen ergänzt werden."
      : "This page is intended to present a structured visual explanation of this step. Later, it can include real work samples, form screenshots, execution examples, or visual explanations that help the customer understand the path more clearly.";

  const noteText =
    language === "ar"
      ? "يمكن لاحقًا تحويل هذه الخانات إلى صور فعلية مع عناوين قصيرة ووصف مختصر لكل لقطة."
      : language === "de"
      ? "Diese Felder können später in echte Bilder mit kurzen Titeln und kleinen Beschreibungen umgewandelt werden."
      : "These areas can later become real images with short titles and small descriptions.";

  return (
    <main dir={isArabic ? "rtl" : "ltr"} style={pageStyle}>
      <div style={shellStyle}>
        <div style={topBarStyle}>
          <Link
            href="/"
            style={pillStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 8px 18px rgba(70, 49, 29, 0.08)";
              e.currentTarget.style.borderColor = "#cbb59b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(70, 49, 29, 0.04)";
              e.currentTarget.style.borderColor = "#d9cab8";
            }}
          >
            <Home size={16} />
            <span>
              {language === "ar"
                ? "الصفحة الرئيسية"
                : language === "de"
                ? "Startseite"
                : "Home"}
            </span>
          </Link>

          <Link
            href="/#page-guide"
            style={pillStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 8px 18px rgba(70, 49, 29, 0.08)";
              e.currentTarget.style.borderColor = "#cbb59b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(70, 49, 29, 0.04)";
              e.currentTarget.style.borderColor = "#d9cab8";
            }}
          >
            {backIcon}
            <span>
              {language === "ar"
                ? "العودة إلى دليل الصفحة"
                : language === "de"
                ? "Zurück zum Seitenleitfaden"
                : "Back to Page Guide"}
            </span>
          </Link>
        </div>

        <section style={heroCardStyle}>
          <div style={eyebrowStyle}>{sectionLabel}</div>
          <h1 style={titleStyle}>{title}</h1>
          <p style={descriptionStyle}>{description}</p>
        </section>

        <section style={contentWrapStyle}>
          <div style={galleryCardStyle}>
            <div style={galleryHeaderStyle}>
              <h2 style={galleryTitleStyle}>{galleryTitle}</h2>
              <span style={galleryHintStyle}>{galleryHint}</span>
            </div>

            <div style={galleryGridStyle}>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} style={imagePlaceholderStyle}>
                  {language === "ar"
                    ? `مساحة صورة ${index + 1}`
                    : language === "de"
                    ? `Bildbereich ${index + 1}`
                    : `Image Area ${index + 1}`}
                </div>
              ))}
            </div>
          </div>

          <div style={infoCardStyle}>
            <div>
              <h2 style={infoTitleStyle}>{infoTitle}</h2>
              <p style={infoTextStyle}>{children || fallbackBody}</p>
            </div>

            <div style={noteBoxStyle}>{noteText}</div>
          </div>
        </section>
      </div>
    </main>
  );
}