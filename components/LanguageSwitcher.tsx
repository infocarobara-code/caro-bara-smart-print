"use client";

import { useLanguage } from "@/lib/languageContext";
import { LANGUAGE_LABELS, type Language } from "@/lib/i18n";

const languages: Language[] = ["ar", "de", "en"];

type Props = {
  justify?: "center" | "flex-start" | "flex-end" | "space-between";
};

export default function LanguageSwitcher({
  justify = "center",
}: Props) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        justifyContent: justify,
      }}
    >
      {languages.map((item) => {
        const isActive = language === item;

        return (
          <button
            key={item}
            type="button"
            onClick={() => setLanguage(item)}
            style={{
              padding: "10px 18px",
              border: "1px solid #b89f84",
              background: isActive ? "#3d3126" : "#fffaf4",
              color: isActive ? "#ffffff" : "#3d3126",
              borderRadius: "999px",
              fontWeight: 700,
              cursor: "pointer",
              minWidth: "92px",
            }}
          >
            {LANGUAGE_LABELS[item]}
          </button>
        );
      })}
    </div>
  );
}