"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
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

function VisualCard({
  src,
  alt,
  label,
  large = false,
  compact = false,
}: VisualCardProps) {
  const [loaded, setLoaded] = useState(true);

  const wrapperStyle: CSSProperties = {
    position: "relative",
    overflow: "hidden",
    borderRadius: large ? "26px" : "22px",
    border: "1px solid #e7dccf",
    background: "#f4ede3",
    height: "100%",
    minHeight: 0,
    boxShadow: "0 12px 26px rgba(55, 38, 20, 0.06)",
  };

  const imageStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.5s ease",
  };

  const fallbackStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    minHeight: large ? "340px" : compact ? "150px" : "170px",
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
    borderRadius: large ? "18px" : "16px",
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
    minHeight: "34px",
    padding: "0 12px",
    borderRadius: "999px",
    background: "rgba(255,250,244,0.94)",
    border: "1px solid #e3d5c3",
    color: "#4a3a2b",
    fontSize: compact ? "11px" : "12px",
    fontWeight: 800,
    boxShadow: "0 4px 14px rgba(40, 25, 10, 0.08)",
    maxWidth: "calc(100% - 28px)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  return (
    <div style={wrapperStyle}>
      {loaded ? (
        <img
          src={src}
          alt={alt}
          style={imageStyle}
          onError={() => setLoaded(false)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        />
      ) : (
        <div style={fallbackStyle}>
          <div style={fallbackInnerStyle}>{label}</div>
        </div>
      )}

      <div style={imageShadeStyle} />
      <span style={overlayLabelStyle}>{label}</span>
    </div>
  );
}

export default function Hero({ lang }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth <= 920);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const heroHeight = isMobile ? "auto" : "560px";

  const sectionStyle: CSSProperties = {
    background:
      "linear-gradient(180deg, #f6f1ea 0%, #f4eee6 42%, #f5f1eb 100%)",
    padding: isMobile ? "16px 14px 26px" : "24px 20px 36px",
    position: "relative",
    overflow: "hidden",
  };

  const sectionInnerStyle: CSSProperties = {
    maxWidth: "1240px",
    margin: "0 auto",
  };

  const shellStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: isMobile ? "14px" : "18px",
    alignItems: "stretch",
  };

  const visualCardStyle: CSSProperties = {
    background: "linear-gradient(180deg, #fffaf5 0%, #f6ede2 100%)",
    border: "1px solid rgba(230,219,207,0.8)",
    borderRadius: isMobile ? "26px" : "34px",
    padding: isMobile ? "12px" : "16px",
    boxShadow: "0 22px 60px rgba(60, 40, 20, 0.07)",
    minHeight: isMobile ? "auto" : heroHeight,
    height: isMobile ? "auto" : heroHeight,
    boxSizing: "border-box",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    order: isMobile ? 1 : 1,
    overflow: "hidden",
  };

  const visualGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr 1fr" : "0.88fr 1.12fr",
    gap: "12px",
    height: "100%",
    minHeight: 0,
  };

  const sideStackStyle: CSSProperties = {
    display: "grid",
    gridTemplateRows: isMobile ? "repeat(2, 160px)" : "repeat(2, minmax(0, 1fr))",
    gap: "12px",
    height: "100%",
    minHeight: 0,
  };

  const mainImageWrapStyle: CSSProperties = {
    height: "100%",
    minHeight: isMobile ? "332px" : 0,
  };

  const contentCardStyle: CSSProperties = {
    position: "relative",
    border: "1px solid rgba(230,219,207,0.8)",
    borderRadius: isMobile ? "26px" : "34px",
    padding: isMobile ? "26px 18px" : "36px 34px",
    minHeight: isMobile ? "auto" : heroHeight,
    height: isMobile ? "auto" : heroHeight,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    overflow: "hidden",
    boxShadow: "0 22px 60px rgba(60, 40, 20, 0.07)",
    background: "linear-gradient(180deg, #fbf7f2 0%, #f7f1e9 100%)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    order: isMobile ? 2 : 2,
    boxSizing: "border-box",
  };

  const contentCardInnerStyle: CSSProperties = {
    position: "relative",
    zIndex: 1,
    width: "100%",
    display: "grid",
    gap: isMobile ? "14px" : "18px",
    justifyItems: "center",
    textAlign: "center",
  };

  const brandTitleStyle: CSSProperties = {
    margin: 0,
    fontSize: isMobile ? "30px" : "clamp(20px, 4.2vw, 50px)",
    color: "#221905",
    fontWeight: 500,
    letterSpacing: "-0.04em",
    lineHeight: 0.9,
    textAlign: "center",
    maxWidth: "760px",
  };

  const supportLineStyle: CSSProperties = {
    margin: 0,
    fontSize: "14px",
    lineHeight: 1.8,
    color: "#4e3f31",
    fontWeight: 800,
    textAlign: "center",
    maxWidth: "760px",
  };

  const buttonRowStyle: CSSProperties = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    paddingTop: "2px",
  };

  const primaryButtonStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: isMobile ? "176px" : "204px",
    minHeight: isMobile ? "50px" : "56px",
    padding: "0 24px",
    background: "#1f1710",
    color: "#fff",
    borderRadius: "999px",
    border: "1px solid #1f1710",
    boxShadow: "0 14px 30px rgba(20, 16, 11, 0.18)",
    fontWeight: 900,
    fontSize: isMobile ? "15px" : "16px",
    textDecoration: "none",
    textAlign: "center",
    transition: "all 0.25s ease",
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

  return (
    <section aria-labelledby="home-hero-title" style={sectionStyle}>
      <div style={sectionInnerStyle}>
        <div style={shellStyle}>
          <div
            style={visualCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow =
                "0 30px 80px rgba(60, 40, 20, 0.10)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 22px 60px rgba(60, 40, 20, 0.07)";
            }}
          >
            <div style={visualGridStyle}>
              <div style={sideStackStyle}>
                <VisualCard
                  src="/hero/hero-side-1.jpg"
                  alt="Printing colors, surfaces, and material selection"
                  label={
                    heroText.cardTwo[lang] || heroText.placeholderCardTwo[lang]
                  }
                  compact={isMobile}
                />

                <VisualCard
                  src="/hero/hero-side-2.jpg"
                  alt="Business cards and printed stationery samples"
                  label={
                    heroText.cardThree[lang] ||
                    heroText.placeholderCardThree[lang]
                  }
                  compact={isMobile}
                />
              </div>

              <div style={mainImageWrapStyle}>
                <VisualCard
                  src="/hero/hero-main.jpg"
                  alt="Large-format printing and production workflow"
                  label={
                    heroText.cardOne[lang] || heroText.placeholderCardOne[lang]
                  }
                  large
                />
              </div>
            </div>
          </div>

          <div
            style={contentCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow =
                "0 30px 80px rgba(60, 40, 20, 0.10)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 22px 60px rgba(60, 40, 20, 0.07)";
            }}
          >
            <div style={contentCardInnerStyle}>
              <h1 id="home-hero-title" style={brandTitleStyle}>
                {heroText.brandTitle[lang]}
              </h1>

              <p style={supportLineStyle}>{heroText.supportLine[lang]}</p>

              <div style={buttonRowStyle}>
                <Link
                  href="/request"
                  style={primaryButtonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-2px) scale(1.02)";
                    e.currentTarget.style.boxShadow =
                      "0 18px 40px rgba(0,0,0,0.25)";
                    e.currentTarget.style.background = "#140f0a";
                    e.currentTarget.style.borderColor = "#140f0a";
                  }}
                  onMouseLeave={(e) => {
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
        </div>
      </div>
    </section>
  );
}