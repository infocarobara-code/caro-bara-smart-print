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
    width: isMobile ? "100%" : "max-content",
    minWidth: isMobile ? 0 : "max-content",
    direction: "ltr",
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
                  ? "0 8px"
                  : "10px 18px",
              height: mobileCompact ? "36px" : isMobile ? "38px" : "46px",
              border: "1px solid #b89f84",
              background: isActive ? "#3d3126" : "#fffaf4",
              color: isActive ? "#ffffff" : "#3d3126",
              borderRadius: "999px",
              fontWeight: 700,
              cursor: "pointer",
              minWidth: mobileCompact ? "64px" : isMobile ? "82px" : "92px",
              flex: isMobile ? "1 1 0" : "0 0 auto",
              whiteSpace: "nowrap",
              textAlign: "center",
              fontSize: mobileCompact ? "10px" : isMobile ? "11px" : "15px",
              lineHeight: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              boxSizing: "border-box",
            }}
          >
            {LANGUAGE_LABELS[item]}
          </button>
        );
      })}
    </div>
  );
}