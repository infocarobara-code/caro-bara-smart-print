"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { Language } from "@/lib/i18n";

type Props = {
  lang: Language;
};

type VisualCardProps = {
  src: string;
  alt: string;
  label: string;
  large?: boolean;
  compact?: boolean;
  minHeight?: string;
  isMobile?: boolean;
};

const heroText = {
  supportLine: {
    ar: "تنظيم ذكي لطلبات الطباعة والإعلانات والتجهيزات التجارية بلغات متعددة وبمسار واضح قابل للتنفيذ.",
    de: "Strukturierte, mehrsprachige Anfragen für Druck, Werbung und Geschäftsausstattung – klar aufgebaut und direkt umsetzbar.",
    en: "Structured multilingual requests for print, signage, and business branding with a clear execution-ready flow.",
  },
  brandTitle: {
    ar: "Caro Bara Smart Print",
    de: "Caro Bara Smart Print",
    en: "Caro Bara Smart Print",
  },
  primaryAction: {
    ar: "ابدأ الطلب",
    de: "Anfrage starten",
    en: "Start Request",
  },
  cardOne: {
    ar: "طباعة احترافية",
    de: "Professioneller Druck",
    en: "Professional Printing",
  },
  cardTwo: {
    ar: "ألوان وخامات",
    de: "Farbgenauigkeit",
    en: "Color Accuracy",
  },
  cardThree: {
    ar: "بطاقات ومطبوعات",
    de: "Karten & Drucksachen",
    en: "Cards & Printed Work",
  },
  placeholderCardOne: {
    ar: "صورة رئيسية للطباعة أو الإنتاج",
    de: "Hauptbild für Druck oder Produktion",
    en: "Main print or production visual",
  },
  placeholderCardTwo: {
    ar: "صورة للألوان والخامات",
    de: "Bild für Farben und Materialien",
    en: "Visual for colors and materials",
  },
  placeholderCardThree: {
    ar: "صورة للبطاقات والمطبوعات",
    de: "Bild für Karten und Drucksachen",
    en: "Visual for cards and printed work",
  },
  seoSupport: {
    ar: "خدمات طباعة ولوحات وإعلانات وتجهيزات بصرية وطلبات ذكية متعددة اللغات.",
    de: "Druck, Beschilderung, Werbetechnik und strukturierte mehrsprachige Anfragen.",
    en: "Print, signage, advertising production, and structured multilingual requests.",
  },
} as const;

function getViewportWidth() {
  if (typeof window === "undefined") return 0;

  const widths = [
    window.innerWidth || 0,
    window.document?.documentElement?.clientWidth || 0,
    window.visualViewport?.width || 0,
  ].filter((value) => value > 0);

  if (widths.length === 0) return 0;
  return Math.min(...widths);
}

function VisualCard({
  src,
  alt,
  label,
  large = false,
  compact = false,
  minHeight,
  isMobile = false,
}: VisualCardProps) {
  const resolvedMinHeight =
    minHeight || (large ? "320px" : compact ? "150px" : "180px");

  const wrapperStyle: CSSProperties = {
    position: "relative",
    overflowX: "clip",
    overflowY: "hidden",
    borderRadius: large ? (isMobile ? "20px" : "26px") : isMobile ? "18px" : "22px",
    border: "1px solid #e7dccf",
    background: "#f4ede3",
    minHeight: resolvedMinHeight,
    height: "100%",
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    boxShadow: "0 12px 26px rgba(55, 38, 20, 0.06)",
    boxSizing: "border-box",
  };

  const imageStyle: CSSProperties = {
    width: "100%",
    maxWidth: "100%",
    height: "100%",
    minHeight: resolvedMinHeight,
    objectFit: "cover",
    display: "block",
  };

  const fallbackStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    minHeight: resolvedMinHeight,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    boxSizing: "border-box",
    background: "linear-gradient(135deg, #f2eadf 0%, #ece2d5 100%)",
  };

  const fallbackInnerStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    borderRadius: large ? (isMobile ? "14px" : "18px") : isMobile ? "14px" : "16px",
    border: "1px dashed #d8c4ac",
    background: "rgba(255,250,244,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "16px",
    color: "#8a735c",
    fontSize: large ? "14px" : "12px",
    fontWeight: 600,
    lineHeight: 1.6,
    boxSizing: "border-box",
  };

  const imageShadeStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(10,10,10,0.04) 0%, rgba(10,10,10,0.12) 48%, rgba(10,10,10,0.42) 100%)",
    pointerEvents: "none",
  };

  const overlayLabelStyle: CSSProperties = {
    position: "absolute",
    left: "14px",
    right: "14px",
    bottom: "14px",
    zIndex: 2,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: isMobile ? "32px" : "34px",
    padding: isMobile ? "0 10px" : "0 12px",
    borderRadius: "999px",
    background: "rgba(255,250,244,0.94)",
    border: "1px solid #e3d5c3",
    color: "#4a3a2b",
    fontSize: compact ? "11px" : isMobile ? "11px" : "12px",
    fontWeight: 800,
    boxShadow: "0 4px 14px rgba(40, 25, 10, 0.08)",
    maxWidth: "calc(100% - 28px)",
    whiteSpace: "normal",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "center",
    lineHeight: 1.35,
    overflowWrap: "anywhere",
    wordBreak: "break-word",
    boxSizing: "border-box",
  };

  return (
    <div style={wrapperStyle}>
      <img
        src={src}
        alt={alt}
        style={imageStyle}
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = "none";
          const fallback = target.nextElementSibling as HTMLDivElement | null;
          if (fallback) fallback.style.display = "flex";
        }}
      />

      <div style={{ ...fallbackStyle, display: "none" }}>
        <div style={fallbackInnerStyle}>{label}</div>
      </div>

      <div style={imageShadeStyle} />
      <span style={overlayLabelStyle}>{label}</span>
    </div>
  );
}

export default function Hero({ lang }: Props) {
  const isArabic = lang === "ar";
  const contentDirection = isArabic ? "rtl" : "ltr";
  const textAlign = isArabic ? "right" : "left";

  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    const updateViewport = () => {
      setViewportWidth(getViewportWidth());
    };

    updateViewport();

    window.addEventListener("resize", updateViewport);
    window.addEventListener("orientationchange", updateViewport);
    window.visualViewport?.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
      window.visualViewport?.removeEventListener("resize", updateViewport);
    };
  }, []);

  const isMobile = viewportWidth > 0 ? viewportWidth <= 940 : true;

  const sectionStyle: CSSProperties = {
    background:
      "linear-gradient(180deg, #f6f1ea 0%, #f4eee6 42%, #f5f1eb 100%)",
    padding: isMobile
      ? "10px 14px 22px"
      : "clamp(10px, 2vw, 24px) clamp(12px, 2vw, 20px) clamp(22px, 3vw, 36px)",
    position: "relative",
    overflowX: "clip",
    overflowY: "visible",
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
  };

  const sectionInnerStyle: CSSProperties = {
    maxWidth: "1240px",
    margin: "0 auto",
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    overflowX: "clip",
    overflowY: "visible",
  };

  const shellStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile
      ? "minmax(0, 1fr)"
      : "repeat(2, minmax(0, 1fr))",
    gap: isMobile ? "16px" : "18px",
    alignItems: "stretch",
    width: "100%",
    minWidth: 0,
    maxWidth: "100%",
    direction: "ltr",
  };

  const cardBaseStyle: CSSProperties = {
    border: "1px solid rgba(230,219,207,0.8)",
    borderRadius: isMobile ? "22px" : "clamp(24px, 3vw, 34px)",
    boxShadow: "0 22px 60px rgba(60, 40, 20, 0.07)",
    boxSizing: "border-box",
    overflowX: "clip",
    overflowY: "hidden",
    width: "100%",
    minWidth: 0,
    maxWidth: "100%",
  };

  const contentCardStyle: CSSProperties = {
    ...cardBaseStyle,
    position: "relative",
    padding: isMobile
      ? "24px 18px"
      : "clamp(24px, 4vw, 36px) clamp(18px, 4vw, 34px)",
    minHeight: isMobile ? "unset" : "clamp(320px, 46vw, 560px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background: "linear-gradient(180deg, #fbf7f2 0%, #f7f1e9 100%)",
    direction: contentDirection,
  };

  const contentCardInnerStyle: CSSProperties = {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "100%",
    display: "grid",
    gap: isMobile ? "12px" : "clamp(14px, 2vw, 18px)",
    justifyItems: isMobile ? "center" : isArabic ? "end" : "start",
    textAlign: isMobile ? "center" : textAlign,
    minWidth: 0,
    boxSizing: "border-box",
  };

  const brandTitleStyle: CSSProperties = {
    margin: 0,
    fontSize: isMobile ? "32px" : "clamp(34px, 7vw, 58px)",
    color: "#221905",
    fontWeight: 500,
    letterSpacing: "-0.04em",
    lineHeight: isMobile ? 1.05 : 0.96,
    textAlign: isMobile ? "center" : textAlign,
    direction: contentDirection,
    maxWidth: "760px",
    width: "100%",
    minWidth: 0,
    overflowWrap: "anywhere",
    wordBreak: "break-word",
    boxSizing: "border-box",
  };

  const supportLineStyle: CSSProperties = {
    margin: 0,
    fontSize: isMobile ? "14px" : "clamp(13px, 2vw, 15px)",
    lineHeight: 1.8,
    color: "#4e3f31",
    fontWeight: 800,
    textAlign: isMobile ? "center" : textAlign,
    direction: contentDirection,
    maxWidth: "760px",
    width: "100%",
    minWidth: 0,
    overflowWrap: "anywhere",
    wordBreak: "break-word",
    boxSizing: "border-box",
  };

  const buttonRowStyle: CSSProperties = {
    width: "100%",
    maxWidth: "100%",
    display: "flex",
    justifyContent: isMobile
      ? "center"
      : isArabic
        ? "flex-end"
        : "flex-start",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    paddingTop: "2px",
    direction: contentDirection,
    minWidth: 0,
  };

  const primaryButtonStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: isMobile ? "160px" : "clamp(172px, 30vw, 204px)",
    minHeight: isMobile ? "50px" : "clamp(50px, 6vw, 56px)",
    padding: "0 24px",
    background: "#1f1710",
    color: "#fff",
    borderRadius: "999px",
    border: "1px solid #1f1710",
    boxShadow: "0 14px 30px rgba(20, 16, 11, 0.18)",
    fontWeight: 900,
    fontSize: isMobile ? "15px" : "clamp(15px, 2vw, 16px)",
    textDecoration: "none",
    textAlign: "center",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    boxSizing: "border-box",
    maxWidth: "100%",
  };

  const visualCardStyle: CSSProperties = {
    ...cardBaseStyle,
    background: "linear-gradient(180deg, #fffaf5 0%, #f6ede2 100%)",
    padding: isMobile ? "10px" : "clamp(10px, 2vw, 16px)",
    minHeight: isMobile ? "unset" : "clamp(320px, 46vw, 560px)",
  };

  const visualGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile
      ? "minmax(0, 1fr)"
      : "minmax(0, 1.25fr) minmax(220px, 0.75fr)",
    gap: "12px",
    height: "100%",
    alignItems: "stretch",
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    direction: "ltr",
  };

  const mainImageWrapStyle: CSSProperties = {
    minHeight: isMobile ? "240px" : "clamp(280px, 40vw, 528px)",
    height: "100%",
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
  };

  const sideStackStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile
      ? "repeat(2, minmax(0, 1fr))"
      : "minmax(0, 1fr)",
    gap: "12px",
    height: "100%",
    alignItems: "stretch",
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    direction: "ltr",
  };

  const srOnlyTextStyle: CSSProperties = {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
  };

  const primaryHref = useMemo(() => {
    return "/request";
  }, []);

  return (
    <section aria-labelledby="home-hero-title" style={sectionStyle}>
      <div style={sectionInnerStyle}>
        <div style={shellStyle}>
          <div style={contentCardStyle}>
            <div style={contentCardInnerStyle}>
              <h1 id="home-hero-title" style={brandTitleStyle}>
                {heroText.brandTitle[lang]}
              </h1>

              <p style={supportLineStyle}>{heroText.supportLine[lang]}</p>

              <div style={buttonRowStyle}>
                <Link
                  href={primaryHref}
                  style={primaryButtonStyle}
                  onMouseEnter={(e) => {
                    if (isMobile) return;
                    e.currentTarget.style.transform =
                      "translateY(-2px) scale(1.02)";
                    e.currentTarget.style.boxShadow =
                      "0 18px 40px rgba(0,0,0,0.25)";
                    e.currentTarget.style.background = "#140f0a";
                    e.currentTarget.style.borderColor = "#140f0a";
                  }}
                  onMouseLeave={(e) => {
                    if (isMobile) return;
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 14px 30px rgba(20, 16, 11, 0.18)";
                    e.currentTarget.style.background = "#1f1710";
                    e.currentTarget.style.borderColor = "#1f1710";
                  }}
                >
                  {heroText.primaryAction[lang]}
                </Link>
              </div>

              <p style={srOnlyTextStyle}>{heroText.seoSupport[lang]}</p>
            </div>
          </div>

          <div style={visualCardStyle}>
            <div style={visualGridStyle}>
              <div style={mainImageWrapStyle}>
                <VisualCard
                  src="/hero/hero-main.jpg"
                  alt="Large-format printing and production workflow"
                  label={
                    heroText.cardOne[lang] || heroText.placeholderCardOne[lang]
                  }
                  large
                  minHeight={isMobile ? "240px" : "clamp(280px, 40vw, 528px)"}
                  isMobile={isMobile}
                />
              </div>

              <div style={sideStackStyle}>
                <VisualCard
                  src="/hero/hero-side-1.jpg"
                  alt="Printing colors, surfaces, and material selection"
                  label={
                    heroText.cardTwo[lang] || heroText.placeholderCardTwo[lang]
                  }
                  compact
                  minHeight={isMobile ? "150px" : "clamp(150px, 22vw, 258px)"}
                  isMobile={isMobile}
                />

                <VisualCard
                  src="/hero/hero-side-2.jpg"
                  alt="Business cards and printed stationery samples"
                  label={
                    heroText.cardThree[lang] ||
                    heroText.placeholderCardThree[lang]
                  }
                  compact
                  minHeight={isMobile ? "150px" : "clamp(150px, 22vw, 258px)"}
                  isMobile={isMobile}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}