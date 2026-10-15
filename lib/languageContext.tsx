"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import {
  getDirection,
  isValidLanguage,
  LANGUAGE_COOKIE_KEY,
  LANGUAGE_STORAGE_KEY,
  type Language,
} from "@/lib/i18n";

type LanguageContextType = {
  language: Language;
  dir: "rtl" | "ltr";
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const FALLBACK_LANGUAGE: Language = "de";

function syncDocumentLanguage(lang: Language) {
  if (typeof document === "undefined") return;

  const dir = getDirection(lang);

  document.documentElement.lang = lang;
  document.documentElement.dir = dir;

  if (document.body) {
    document.body.dataset.lang = lang;
    document.body.dataset.dir = dir;
    document.body.style.overflowX = "clip";
    document.body.style.maxWidth = "100%";
    document.body.style.width = "100%";
    document.body.style.boxSizing = "border-box";
  }
}

function persistLanguage(lang: Language) {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    // تجاهل الخطأ
  }

  document.cookie = `${LANGUAGE_COOKIE_KEY}=${lang}; path=/; max-age=31536000; samesite=lax`;
}

function emitLanguageChanged(lang: Language) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("language-changed", {
      detail: {
        language: lang,
        dir: getDirection(lang),
      },
    })
  );
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(FALLBACK_LANGUAGE);

  const applyLanguage = useCallback((lang: Language) => {
    if (!isValidLanguage(lang)) return;

    setLanguageState(lang);
    syncDocumentLanguage(lang);
    persistLanguage(lang);
    emitLanguageChanged(lang);
  }, []);

  const setLanguage = useCallback(
    (lang: Language) => {
      applyLanguage(lang);
    },
    [applyLanguage]
  );

  useEffect(() => {
    // Every fresh page load starts in German, regardless of browser language
    // or a language saved during an earlier visit. Explicit switches stay
    // active while navigating within this mounted application.
    syncDocumentLanguage(FALLBACK_LANGUAGE);
    persistLanguage(FALLBACK_LANGUAGE);
    emitLanguageChanged(FALLBACK_LANGUAGE);
  }, []);

  const value = useMemo(
    () => ({
      language,
      dir: getDirection(language),
      setLanguage,
    }),
    [language, setLanguage]
  );

  const providerShellStyle: CSSProperties = {
    minHeight: "100vh",
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    overflowX: "clip",
    overflowY: "visible",
    boxSizing: "border-box",
  };

  return (
    <LanguageContext.Provider value={value}>
      <div style={providerShellStyle}>{children}</div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
