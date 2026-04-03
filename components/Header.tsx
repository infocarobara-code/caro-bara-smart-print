"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/languageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

type LocalizedLabel = {
  ar: string;
  de: string;
  en: string;
};

type Props = {
  showBackHome?: boolean;
  showBackButton?: boolean;
  homeHref?: string;
  backHref?: string;
  homeLabel?: LocalizedLabel;
  backLabel?: LocalizedLabel;
};

export default function Header({
  showBackHome = false,
  showBackButton = false,
  homeHref = "/",
  backHref,
  homeLabel = {
    ar: "الرئيسية",
    de: "Startseite",
    en: "Home",
  },
  backLabel = {
    ar: "رجوع",
    de: "Zurück",
    en: "Back",
  },
}: Props) {
  const router = useRouter();
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
      return;
    }

    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  return (
    <header
      dir={dir}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        width: "100%",
        background: "rgba(245, 241, 235, 0.92)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        padding: "10px 12px 0",
        borderBottom: "1px solid rgba(231, 217, 200, 0.65)",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid #e7d9c8",
            borderRadius: "20px",
            padding: "10px 12px",
            boxShadow: "0 6px 20px rgba(90, 70, 40, 0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
              minWidth: 0,
            }}
          >
            <Link
              href="/platform-guide"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              aria-label="Caro Bara Logo"
            >
              <img
                src="/logo.png"
                alt="Caro Bara Logo"
                style={{
                  width: "44px",
                  height: "44px",
                  objectFit: "contain",
                  display: "block",
                  filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.12))",
                  cursor: "pointer",
                }}
              />
            </Link>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              {showBackButton && (
                <button
                  type="button"
                  onClick={handleBack}
                  style={{
                    border: "1px solid #c8b197",
                    background: "#fffaf4",
                    color: "#3d3126",
                    borderRadius: "999px",
                    padding: "9px 14px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    minHeight: "38px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  ← {backLabel[language]}
                </button>
              )}

              {showBackHome && (
                <Link
                  href={homeHref}
                  style={{
                    textDecoration: "none",
                    color: "#3d3126",
                    fontWeight: 700,
                    border: "1px solid #b89f84",
                    background: "#fffaf4",
                    borderRadius: "999px",
                    padding: "9px 14px",
                    fontSize: "13px",
                    minHeight: "38px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {homeLabel[language]}
                </Link>
              )}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: isArabic ? "flex-start" : "flex-end",
              flex: "1 1 auto",
              minWidth: 0,
            }}
          >
            <LanguageSwitcher justify="center" />
          </div>
        </div>
      </div>
    </header>
  );
}