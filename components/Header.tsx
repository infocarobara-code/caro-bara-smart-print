"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/languageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

type Props = {
  showBackHome?: boolean;
  homeLabel?: {
    ar: string;
    de: string;
    en: string;
  };
};

export default function Header({
  showBackHome = false,
  homeLabel = {
    ar: "العودة إلى الرئيسية",
    de: "Zurück zur Startseite",
    en: "Back to Home",
  },
}: Props) {
  const { language, dir } = useLanguage();

  return (
    <header
      dir={dir}
      style={{
        width: "100%",
        background: "#f5f1eb",
        padding: "20px 16px 0",
      }}
    >
      <div
        style={{
          maxWidth: "1220px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(8px)",
            border: "1px solid #e7d9c8",
            borderRadius: "24px",
            padding: "16px 18px",
            boxShadow: "0 10px 35px rgba(90, 70, 40, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/platform-guide"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Caro Bara Logo"
            >
              <img
                src="/logo.png"
                alt="Caro Bara Logo"
                style={{
                  width: "54px",
                  height: "54px",
                  objectFit: "contain",
                  display: "block",
                  filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.14))",
                  cursor: "pointer",
                }}
              />
            </Link>

            {showBackHome && (
              <Link
                href="/"
                style={{
                  textDecoration: "none",
                  color: "#3d3126",
                  fontWeight: 700,
                  border: "1px solid #b89f84",
                  background: "#fffaf4",
                  borderRadius: "999px",
                  padding: "10px 18px",
                  fontSize: "14px",
                }}
              >
                {homeLabel[language]}
              </Link>
            )}
          </div>

          <LanguageSwitcher justify="center" />
        </div>
      </div>
    </header>
  );
}