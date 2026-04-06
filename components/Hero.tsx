"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import type { Language } from "@/lib/i18n";

type Props = {
  lang: Language;
};

type VisualCardProps = {
  src: string;
  alt: string;
  label: string;
  large?: boolean;
};

const heroText = {
  eyebrow: {
    ar: "منصة تنظيم وتنفيذ الطلبات الإعلانية والطباعة",
    de: "Plattform für strukturierte Druck- und Werbeanfragen",
    en: "Platform for structured print and advertising requests",
  },
  microLine: {
    ar: "نظام ذكي لتنظيم الطلبات الإعلانية",
    de: "Intelligentes System für strukturierte Werbeanfragen",
    en: "Smart system for structured print & advertising requests",
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
    ar: "دقة الألوان",
    de: "Farbgenauigkeit",
    en: "Color Accuracy",
  },
  cardThree: {
    ar: "بطاقات وأعمال مطبوعة",
    de: "Karten & Drucksachen",
    en: "Cards & Printed Work",
  },
  placeholderCardOne: {
    ar: "صورة رئيسية لأعمال الطباعة أو الإنتاج",
    de: "Hauptbild für Druck oder Produktion",
    en: "Main print or production visual",
  },
  placeholderCardTwo: {
    ar: "صورة تعبر عن دقة الألوان والخامات",
    de: "Bild für Farbgenauigkeit und Materialien",
    en: "Visual for color accuracy and materials",
  },
  placeholderCardThree: {
    ar: "صورة لبطاقات الأعمال أو المطبوعات",
    de: "Bild für Visitenkarten oder Drucksachen",
    en: "Visual for business cards or printed work",
  },
} as const;

function VisualCard({ src, alt, label, large = false }: VisualCardProps) {
  const [loaded, setLoaded] = useState(true);

  const wrapperStyle: CSSProperties = {
    position: "relative",
    overflow: "hidden",
    borderRadius: large ? "22px" : "20px",
    border: "1px solid #e7dccf",
    background: "#f4ede3",
    minHeight: large ? "100%" : "152px",
    height: "100%",
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
    minHeight: large ? "320px" : "152px",
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
    lineHeight: 1.7,
  };

  const overlayLabelStyle: CSSProperties = {
    position: "absolute",
    left: "10px",
    bottom: "10px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "28px",
    padding: "0 10px",
    borderRadius: "999px",
    background: "rgba(255,250,244,0.9)",
    border: "1px solid #e3d5c3",
    color: "#4a3a2b",
    fontSize: "10px",
    fontWeight: 700,
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

      <span style={overlayLabelStyle}>{label}</span>
    </div>
  );
}

export default function Hero({ lang }: Props) {
  const sectionStyle: CSSProperties = {
    background: "#f5f1eb",
    padding: "92px 20px 140px",
    position: "relative",
    overflow: "hidden",
  };

  const blurShapeStyle: CSSProperties = {
    position: "absolute",
    top: "-120px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "min(900px, 94vw)",
    height: "300px",
    background: "rgba(218, 201, 180, 0.16)",
    filter: "blur(84px)",
    borderRadius: "999px",
    pointerEvents: "none",
  };

  const topMicroLineWrapStyle: CSSProperties = {
    position: "relative",
    zIndex: 1,
    maxWidth: "1220px",
    margin: "0 auto 40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    paddingInline: "20px",
  };

  const topMicroLineStyle: CSSProperties = {
    fontSize: "clamp(16px, 1.8vw, 22px)",
    color: "#6c5947",
    fontWeight: 700,
    letterSpacing: "-0.01em",
    opacity: 0.96,
    lineHeight: 1.55,
    maxWidth: "760px",
    textAlign: "center",
    textWrap: "balance",
  };

  const shellStyle: CSSProperties = {
    position: "relative",
    zIndex: 1,
    maxWidth: "1220px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "18px",
    alignItems: "stretch",
  };

  const contentCardStyle: CSSProperties = {
    position: "relative",
    border: "1px solid rgba(230,219,207,0.6)",
    borderRadius: "32px",
    padding: "34px",
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(60, 40, 20, 0.06)",
    backgroundImage: "url('/hero/hero-bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const contentCardOverlayStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(248,244,238,0.30) 0%, rgba(248,244,238,0.18) 38%, rgba(34,25,5,0.18) 100%)",
    backdropFilter: "blur(0.6px)",
    WebkitBackdropFilter: "blur(0.6px)",
    pointerEvents: "none",
  };

  const contentCardInnerStyle: CSSProperties = {
    position: "relative",
    zIndex: 1,
    width: "100%",
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  };

  const visualCardStyle: CSSProperties = {
    background: "linear-gradient(180deg, #fffaf5 0%, #f6ede2 100%)",
    border: "1px solid rgba(230,219,207,0.6)",
    borderRadius: "32px",
    padding: "16px",
    boxShadow: "0 20px 60px rgba(60, 40, 20, 0.06)",
    minHeight: "100%",
    boxSizing: "border-box",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const eyebrowStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 14px",
    marginBottom: "22px",
    borderRadius: "999px",
    border: "1px solid #e4d8c8",
    background: "rgba(255,255,255,0.82)",
    color: "#6a5642",
    fontSize: "11px",
    fontWeight: 700,
    lineHeight: 1.3,
    maxWidth: "100%",
    alignSelf: "center",
    boxShadow: "0 4px 14px rgba(80, 60, 35, 0.04)",
  };

  const brandTitleStyle: CSSProperties = {
    margin: "0 0 24px",
    fontSize: "clamp(28px, 3.8vw, 35px)",
    color: "#221905",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    lineHeight: 1.15,
    textAlign: "center",
    textShadow: "0 2px 10px rgba(255,255,255,0.22)",
  };

  const buttonRowStyle: CSSProperties = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  };

  const primaryButtonStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "190px",
    minHeight: "55px",
    padding: "0 26px",
    background: "#000",
    color: "#fff",
    borderRadius: "999px",
    border: "none",
    boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
    fontWeight: 800,
    fontSize: "17px",
    textDecoration: "none",
    textAlign: "center",
    transition: "all 0.25s ease",
  };

  const visualGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1.12fr 0.88fr",
    gap: "12px",
    minHeight: "320px",
    height: "100%",
  };

  const mainImageWrapStyle: CSSProperties = {
    height: "100%",
  };

  const sideStackStyle: CSSProperties = {
    display: "grid",
    gridTemplateRows: "1fr 1fr",
    gap: "12px",
    height: "100%",
  };

  return (
    <section style={sectionStyle}>
      <div style={blurShapeStyle} />

      <div style={topMicroLineWrapStyle}>
        <span style={topMicroLineStyle}>{heroText.microLine[lang]}</span>
      </div>

      <div style={shellStyle}>
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
              "0 20px 60px rgba(60, 40, 20, 0.06)";
          }}
        >
          <div style={contentCardOverlayStyle} />

          <div style={contentCardInnerStyle}>
            <div style={eyebrowStyle}>{heroText.eyebrow[lang]}</div>

            <div style={brandTitleStyle}>{heroText.brandTitle[lang]}</div>

            <div style={buttonRowStyle}>
              <Link
                href="/request"
                style={primaryButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 18px 40px rgba(0,0,0,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 30px rgba(0,0,0,0.18)";
                }}
              >
                {heroText.primaryAction[lang]}
              </Link>
            </div>
          </div>
        </div>

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
              "0 20px 60px rgba(60, 40, 20, 0.06)";
          }}
        >
          <div style={visualGridStyle}>
            <div style={mainImageWrapStyle}>
              <VisualCard
                src="/hero/hero-main.jpg"
                alt="Large-format printing process"
                label={heroText.cardOne[lang] || heroText.placeholderCardOne[lang]}
                large
              />
            </div>

            <div style={sideStackStyle}>
              <VisualCard
                src="/hero/hero-side-1.jpg"
                alt="Printing color consultation"
                label={heroText.cardTwo[lang] || heroText.placeholderCardTwo[lang]}
              />

              <VisualCard
                src="/hero/hero-side-2.jpg"
                alt="Printed business cards"
                label={heroText.cardThree[lang] || heroText.placeholderCardThree[lang]}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}