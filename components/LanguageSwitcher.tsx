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
    gap: mobileCompact ? "4px" : isMobile ? "6px" : "8px",
    flexWrap: "nowrap",
    justifyContent: isMobile ? "center" : justify,
    alignItems: "center",
    width: isMobile ? "auto" : "max-content",
    maxWidth: "100%",
    minWidth: 0,
    direction: "ltr",
    overflow: "hidden",
    boxSizing: "border-box",
    padding: mobileCompact ? "2px" : isMobile ? "3px" : "4px",
    borderRadius: "999px",
    background: "rgba(255, 255, 255, 0.56)",
    border: "1px solid rgba(209, 215, 219, 0.85)",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.55)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
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
                  ? "0 11px"
                  : "0 16px",
              height: mobileCompact ? "32px" : isMobile ? "36px" : "40px",
              border: isActive
                ? "1px solid rgba(37, 211, 102, 0.22)"
                : "1px solid transparent",
              background: isActive ? "#ffffff" : "transparent",
              color: isActive ? "#017561" : "#667781",
              borderRadius: "999px",
              fontWeight: 700,
              cursor: "pointer",
              minWidth: mobileCompact ? "48px" : isMobile ? "54px" : "78px",
              flex: "0 1 auto",
              whiteSpace: "nowrap",
              textAlign: "center",
              fontSize: mobileCompact ? "10px" : isMobile ? "11px" : "13px",
              lineHeight: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              boxSizing: "border-box",
              maxWidth: isMobile ? "72px" : "unset",
              boxShadow: isActive
                ? "0 3px 10px rgba(37, 211, 102, 0.14)"
                : "none",
              transition:
                "background 0.18s ease, color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
            }}
            onMouseEnter={(e) => {
              if (isMobile) return;
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.background = isActive
                ? "#ffffff"
                : "rgba(255, 255, 255, 0.72)";
              e.currentTarget.style.borderColor = isActive
                ? "rgba(37, 211, 102, 0.22)"
                : "rgba(209, 215, 219, 0.72)";
              e.currentTarget.style.boxShadow = isActive
                ? "0 6px 16px rgba(37, 211, 102, 0.16)"
                : "0 4px 12px rgba(17, 27, 33, 0.06)";
            }}
            onMouseLeave={(e) => {
              if (isMobile) return;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.background = isActive
                ? "#ffffff"
                : "transparent";
              e.currentTarget.style.borderColor = isActive
                ? "rgba(37, 211, 102, 0.22)"
                : "transparent";
              e.currentTarget.style.boxShadow = isActive
                ? "0 3px 10px rgba(37, 211, 102, 0.14)"
                : "none";
            }}
          >
            {LANGUAGE_LABELS[item]}
          </button>
        );
      })}
    </div>
  );
}