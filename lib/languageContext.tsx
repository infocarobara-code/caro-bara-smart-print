"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
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

function detectBrowserLanguage(): Language {
  if (typeof window === "undefined") return FALLBACK_LANGUAGE;

  const browserLanguages = [
    window.navigator.language,
    ...(window.navigator.languages || []),
  ];

  for (const value of browserLanguages) {
    if (!value) continue;

    const normalized = value.toLowerCase().trim();

    if (normalized.startsWith("ar")) return "ar";
    if (normalized.startsWith("de")) return "de";
    if (normalized.startsWith("en")) return "en";

    const shortCode = normalized.split("-")[0];
    if (isValidLanguage(shortCode)) return shortCode;
  }

  return FALLBACK_LANGUAGE;
}

function readInitialLanguage(): Language {
  if (typeof window === "undefined") return FALLBACK_LANGUAGE;

  const fromStorage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (isValidLanguage(fromStorage)) return fromStorage;

  const match = document.cookie.match(
    new RegExp(`(^| )${LANGUAGE_COOKIE_KEY}=([^;]+)`)
  );
  const fromCookie = match?.[2];
  if (isValidLanguage(fromCookie)) return fromCookie;

  const htmlLang = document.documentElement.lang;
  if (isValidLanguage(htmlLang)) return htmlLang;

  return detectBrowserLanguage();
}

function syncDocumentLanguage(lang: Language) {
  const dir = getDirection(lang);

  document.documentElement.lang = lang;
  document.documentElement.dir = dir;

  document.body.setAttribute("dir", dir);
  document.body.dataset.lang = lang;
}

function persistLanguage(lang: Language) {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  document.cookie = `${LANGUAGE_COOKIE_KEY}=${lang}; path=/; max-age=31536000; samesite=lax`;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(FALLBACK_LANGUAGE);

  useEffect(() => {
    const initial = readInitialLanguage();
    setLanguageState(initial);
    syncDocumentLanguage(initial);
    persistLanguage(initial);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    syncDocumentLanguage(lang);
    persistLanguage(lang);
  };

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === LANGUAGE_STORAGE_KEY && isValidLanguage(event.newValue)) {
        setLanguageState(event.newValue);
        syncDocumentLanguage(event.newValue);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(
    () => ({
      language,
      dir: getDirection(language),
      setLanguage,
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      <div dir={getDirection(language)} style={{ minHeight: "100%" }}>
        {children}
      </div>
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