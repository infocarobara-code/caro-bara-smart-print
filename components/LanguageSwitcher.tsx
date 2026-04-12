"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useLanguage } from "@/lib/languageContext";
import { LANGUAGE_LABELS, type Language } from "@/lib/i18n";

const languages: Language[] = ["ar", "de", "en"];

type Props = {
  justify?: "center" | "flex-start" | "flex-end" | "space-between";
  compact?: boolean;
};

export default function LanguageSwitcher({
  justify = "center",
  compact = false,
}: Props) {
  const { language, setLanguage } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth <= 940);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const mobileCompact = isMobile && compact;

  const wrapperStyle: CSSProperties = {
    display: "flex",
    gap: mobileCompact ? "4px" : isMobile ? "6px" : "10px",
    flexWrap: "nowrap",
    justifyContent: isMobile ? "center" : justify,
    alignItems: "center",
    width: isMobile ? "auto" : "max-content",
    maxWidth: "100%",
    minWidth: 0,
    direction: "ltr",
    overflow: "hidden",
    boxSizing: "border-box",
  };

  return (
    <div style={wrapperStyle}>
      {languages.map((item) => {
        const isActive = language === item;

        return (
          <button
            key={item}
            type="button"
            onClick={() => setLanguage(item)}
            aria-pressed={isActive}
            style={{
              padding: mobileCompact
                ? "0 8px"
                : isMobile
                  ? "0 10px"
                  : "10px 18px",
              height: mobileCompact ? "36px" : isMobile ? "38px" : "46px",
              border: "1px solid #d1d7db",
              background: isActive ? "#d9fdd3" : "#ffffff",
              color: isActive ? "#00a884" : "#54656f",
              borderRadius: "999px",
              fontWeight: 700,
              cursor: "pointer",
              minWidth: mobileCompact ? "52px" : isMobile ? "58px" : "92px",
              flex: "0 1 auto",
              whiteSpace: "nowrap",
              textAlign: "center",
              fontSize: mobileCompact ? "10px" : isMobile ? "11px" : "15px",
              lineHeight: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              boxSizing: "border-box",
              maxWidth: isMobile ? "72px" : "unset",
              boxShadow: isActive
                ? "0 1px 3px rgba(0, 168, 132, 0.18)"
                : "0 1px 2px rgba(11, 20, 26, 0.05)",
              transition:
                "background 0.18s ease, color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
            }}
            onMouseEnter={(e) => {
              if (isMobile) return;
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.background = isActive ? "#c8f7c5" : "#f7f8fa";
              e.currentTarget.style.borderColor = "#d1d7db";
              e.currentTarget.style.boxShadow = isActive
                ? "0 2px 8px rgba(0, 168, 132, 0.20)"
                : "0 2px 6px rgba(11, 20, 26, 0.08)";
            }}
            onMouseLeave={(e) => {
              if (isMobile) return;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.background = isActive ? "#d9fdd3" : "#ffffff";
              e.currentTarget.style.borderColor = "#d1d7db";
              e.currentTarget.style.boxShadow = isActive
                ? "0 1px 3px rgba(0, 168, 132, 0.18)"
                : "0 1px 2px rgba(11, 20, 26, 0.05)";
            }}
          >
            {LANGUAGE_LABELS[item]}
          </button>
        );
      })}
    </div>
  );
}