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
  href: string;
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
  bookingAction: {
    ar: "حجز موعد",
    de: "Termin buchen",
    en: "Book Appointment",
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
  href,
  large = false,
  compact = false,
  minHeight,
  isMobile = false,
}: VisualCardProps) {
  const resolvedMinHeight =
    minHeight || (large ? "320px" : compact ? "150px" : "180px");

  const [imageFailed, setImageFailed] = useState(false);

  const wrapperStyle: CSSProperties = {
    position: "relative",
    overflow: "hidden",
    borderRadius: large ? (isMobile ? "20px" : "24px") : isMobile ? "18px" : "20px",
    border: "1px solid var(--wa-border)",
    background: "#ffffff",
    minHeight: resolvedMinHeight,
    height: "100%",
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    boxShadow: "var(--wa-shadow-soft)",
    boxSizing: "border-box",
    display: "block",
    textDecoration: "none",
    transition:
      "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
  };

  const imageStyle: CSSProperties = {
    width: "100%",
    maxWidth: "100%",
    height: "100%",
    minHeight: resolvedMinHeight,
    objectFit: "cover",
    display: imageFailed ? "none" : "block",
  };

  const fallbackStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    minHeight: resolvedMinHeight,
    display: imageFailed ? "flex" : "none",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    boxSizing: "border-box",
    background: "#ffffff",
    color: "var(--wa-text-primary)",
    fontSize: large ? "14px" : "12px",
    fontWeight: 700,
    textAlign: "center",
    lineHeight: 1.6,
  };

  return (
    <Link
      href={href}
      style={wrapperStyle}
      aria-label={alt}
      onMouseEnter={(e) => {
        if (isMobile) return;
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 10px 24px rgba(24, 119, 242, 0.12)";
        e.currentTarget.style.borderColor = "var(--wa-green-primary)";
      }}
      onMouseLeave={(e) => {
        if (isMobile) return;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--wa-shadow-soft)";
        e.currentTarget.style.borderColor = "var(--wa-border)";
      }}
    >
      <img
        src={src}
        alt={alt}
        style={imageStyle}
        onError={() => setImageFailed(true)}
      />

      <div style={fallbackStyle}>{alt}</div>
    </Link>
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
    background: "transparent",
    padding: isMobile
      ? "10px 14px 22px"
      : "clamp(10px, 2vw, 24px) clamp(12px, 2vw, 20px) clamp(22px, 3vw, 36px)",
    position: "relative",
    overflowX: "hidden",
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
    overflowX: "hidden",
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
    border: "1px solid var(--wa-border)",
    borderRadius: isMobile ? "22px" : "clamp(24px, 3vw, 30px)",
    boxShadow: "var(--wa-shadow-soft)",
    boxSizing: "border-box",
    overflowX: "hidden",
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
      : "clamp(24px, 4vw, 34px) clamp(18px, 4vw, 32px)",
    minHeight: isMobile ? "unset" : "clamp(320px, 46vw, 560px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background: "#ffffff",
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
    color: "var(--wa-text-primary)",
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
    color: "var(--wa-text-primary)",
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
    background: "var(--wa-green-primary)",
    color: "#ffffff",
    borderRadius: "999px",
    border: "1px solid var(--wa-green-primary)",
    boxShadow: "0 8px 22px rgba(24, 119, 242, 0.22)",
    fontWeight: 900,
    fontSize: isMobile ? "15px" : "clamp(15px, 2vw, 16px)",
    textDecoration: "none",
    textAlign: "center",
    transition:
      "transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, border-color 0.25s ease",
    boxSizing: "border-box",
    maxWidth: "100%",
  };

  const visualCardStyle: CSSProperties = {
    ...cardBaseStyle,
    background: "#ffffff",
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

  const primaryHref = useMemo(() => "/request", []);
  const bookingHref = useMemo(() => "/booking", []);

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
                      "0 12px 28px rgba(24, 119, 242, 0.28)";
                    e.currentTarget.style.background = "var(--wa-green-primary-hover)";
                    e.currentTarget.style.borderColor = "var(--wa-green-primary-hover)";
                  }}
                  onMouseLeave={(e) => {
                    if (isMobile) return;
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 22px rgba(24, 119, 242, 0.22)";
                    e.currentTarget.style.background = "var(--wa-green-primary)";
                    e.currentTarget.style.borderColor = "var(--wa-green-primary)";
                  }}
                >
                  {heroText.primaryAction[lang]}
                </Link>

                <Link
                  href={bookingHref}
                  style={primaryButtonStyle}
                  onMouseEnter={(e) => {
                    if (isMobile) return;
                    e.currentTarget.style.transform =
                      "translateY(-2px) scale(1.02)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 28px rgba(24, 119, 242, 0.28)";
                    e.currentTarget.style.background = "var(--wa-green-primary-hover)";
                    e.currentTarget.style.borderColor = "var(--wa-green-primary-hover)";
                  }}
                  onMouseLeave={(e) => {
                    if (isMobile) return;
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 22px rgba(24, 119, 242, 0.22)";
                    e.currentTarget.style.background = "var(--wa-green-primary)";
                    e.currentTarget.style.borderColor = "var(--wa-green-primary)";
                  }}
                >
                  {heroText.bookingAction[lang]}
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
                  href="/request"
                  large
                  minHeight={isMobile ? "240px" : "clamp(280px, 40vw, 528px)"}
                  isMobile={isMobile}
                />
              </div>

              <div style={sideStackStyle}>
                <VisualCard
                  src="/hero/hero-side-1.jpg"
                  alt="Printing colors, surfaces, and material selection"
                  href="/guide"
                  compact
                  minHeight={isMobile ? "150px" : "clamp(150px, 22vw, 258px)"}
                  isMobile={isMobile}
                />

                <VisualCard
                  src="/hero/hero-side-2.jpg"
                  alt="Business cards and printed stationery samples"
                  href="/offers"
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