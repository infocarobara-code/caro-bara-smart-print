"use client";

import Link from "next/link";
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
  return (
    <section
      style={{
        background: "#f5f1eb",
        padding: "96px 20px 88px",
      }}
    >
      <div
        style={{
          maxWidth: "980px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 14px",
            marginBottom: "18px",
            borderRadius: "999px",
            border: "1px solid #e3d7c8",
            background: "rgba(255,255,255,0.52)",
            color: "#6a5642",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.02em",
            lineHeight: 1.2,
          }}
        >
          {heroText.eyebrow[lang]}
        </div>

        <h1
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 0 18px",
            fontSize: "clamp(40px, 6vw, 70px)",
            color: "#33261c",
            letterSpacing: "-0.035em",
            fontWeight: 600,
            lineHeight: 1.04,
            textAlign: "center",
          }}
        >
          {heroText.title[lang]}
        </h1>

        <p
          style={{
            width: "100%",
            maxWidth: "720px",
            margin: "0 auto 34px",
            fontSize: "clamp(15px, 1.9vw, 18px)",
            lineHeight: 1.9,
            color: "#5f4d3d",
            textAlign: "center",
          }}
        >
          {heroText.description[lang]}
        </p>

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link
            href="/request"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "164px",
              padding: "15px 28px",
              background: "#1e1813",
              color: "#ffffff",
              borderRadius: "14px",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 10px 24px rgba(44, 31, 20, 0.10)",
              fontWeight: 700,
              fontSize: "15px",
              textDecoration: "none",
              textAlign: "center",
              transition: "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 14px 28px rgba(44, 31, 20, 0.14)";
              e.currentTarget.style.background = "#16120e";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 24px rgba(44, 31, 20, 0.10)";
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