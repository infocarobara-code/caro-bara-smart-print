"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import type { Language } from "@/lib/i18n";

type Props = {
  lang: Language;
};

const heroText = {
  eyebrow: {
    ar: "منصة تنظيم وتنفيذ الطلبات الإعلانية والطباعة",
    de: "Plattform für strukturierte Druck- und Werbeanfragen",
    en: "Platform for structured print and advertising requests",
  },
  title: {
    ar: "Caro Bara Smart Print",
    de: "Caro Bara Smart Print",
    en: "Caro Bara Smart Print",
  },
  description: {
    ar: "نستقبل طلبك، ننظمه، نفهم متطلباته، ونوجّهه إلى جهة التنفيذ الأنسب باحترافية ووضوح.",
    de: "Wir nehmen deine Anfrage auf, strukturieren sie, verstehen die Anforderungen und leiten sie professionell an den passenden Ausführungspartner weiter.",
    en: "We receive your request, structure it, understand its requirements, and direct it professionally to the most suitable execution partner.",
  },
  startRequest: {
    ar: "ابدأ الطلب",
    de: "Anfrage starten",
    en: "Start Request",
  },
};

export default function Hero({ lang }: Props) {
  const sectionStyle: CSSProperties = {
    background: "#f5f1eb",
    padding: "clamp(76px, 11vw, 112px) 20px clamp(62px, 9vw, 96px)",
    position: "relative",
    overflow: "hidden",
  };

  const blurShapeStyle: CSSProperties = {
    position: "absolute",
    top: "-120px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "min(760px, 88vw)",
    height: "clamp(220px, 36vw, 320px)",
    background: "rgba(218, 201, 180, 0.22)",
    filter: "blur(80px)",
    borderRadius: "999px",
    pointerEvents: "none",
  };

  const contentWrapStyle: CSSProperties = {
    position: "relative",
    zIndex: 1,
    maxWidth: "980px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  };

  const eyebrowStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "clamp(7px, 1.6vw, 9px) clamp(12px, 2.6vw, 16px)",
    marginBottom: "clamp(16px, 3vw, 22px)",
    borderRadius: "999px",
    border: "1px solid #e3d7c8",
    background: "rgba(255,255,255,0.58)",
    color: "#6a5642",
    fontSize: "clamp(10px, 1.9vw, 12px)",
    fontWeight: 600,
    letterSpacing: "0.02em",
    lineHeight: 1.25,
    boxShadow: "0 8px 20px rgba(72, 52, 32, 0.04)",
    maxWidth: "100%",
  };

  const titleStyle: CSSProperties = {
    width: "100%",
    maxWidth: "940px",
    margin: "0 0 clamp(14px, 3vw, 22px)",
    fontSize: "clamp(30px, 7vw, 78px)",
    color: "#33261c",
    letterSpacing: "-0.04em",
    fontWeight: 700,
    lineHeight: 1.04,
    textAlign: "center",
    textWrap: "balance",
  };

  const descriptionStyle: CSSProperties = {
    width: "100%",
    maxWidth: "760px",
    margin: "0 auto clamp(28px, 5vw, 38px)",
    fontSize: "clamp(13px, 2.6vw, 18px)",
    lineHeight: 1.85,
    color: "#5f4d3d",
    textAlign: "center",
  };

  const buttonRowStyle: CSSProperties = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const buttonStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "clamp(148px, 42vw, 172px)",
    padding: "clamp(13px, 2.7vw, 16px) clamp(22px, 5vw, 30px)",
    background: "#1e1813",
    color: "#ffffff",
    borderRadius: "15px",
    border: "1px solid rgba(0,0,0,0.06)",
    boxShadow: "0 12px 28px rgba(44, 31, 20, 0.12)",
    fontWeight: 700,
    fontSize: "clamp(13px, 2.4vw, 15px)",
    textDecoration: "none",
    textAlign: "center",
    transition:
      "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
  };

  return (
    <section style={sectionStyle}>
      <div style={blurShapeStyle} />

      <div style={contentWrapStyle}>
        <div style={eyebrowStyle}>{heroText.eyebrow[lang]}</div>

        <h1 style={titleStyle}>{heroText.title[lang]}</h1>

        <p style={descriptionStyle}>{heroText.description[lang]}</p>

        <div style={buttonRowStyle}>
          <Link
            href="/request"
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 16px 32px rgba(44, 31, 20, 0.16)";
              e.currentTarget.style.background = "#16120e";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 12px 28px rgba(44, 31, 20, 0.12)";
              e.currentTarget.style.background = "#1e1813";
            }}
          >
            {heroText.startRequest[lang]}
          </Link>
        </div>
      </div>
    </section>
  );
}