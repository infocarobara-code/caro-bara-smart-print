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

function readLanguageFromCookie(): Language | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${LANGUAGE_COOKIE_KEY}=([^;]+)`)
  );

  const fromCookie = match?.[1];
  return isValidLanguage(fromCookie) ? fromCookie : null;
}

function readPreferredLanguage(): Language {
  if (typeof window === "undefined") return FALLBACK_LANGUAGE;

  try {
    const fromStorage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isValidLanguage(fromStorage)) return fromStorage;
  } catch {
    // تجاهل الخطأ
  }

  const fromCookie = readLanguageFromCookie();
  if (fromCookie) return fromCookie;

  const htmlLang = document.documentElement.lang;
  if (isValidLanguage(htmlLang)) return htmlLang;

  return detectBrowserLanguage();
}

function syncDocumentLanguage(lang: Language) {
  if (typeof document === "undefined") return;

  const dir = getDirection(lang);

  document.documentElement.lang = lang;

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
  const [isReady, setIsReady] = useState(false);

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
      setIsReady(true);
    },
    [applyLanguage]
  );

  useEffect(() => {
    const preferred = readPreferredLanguage();
    applyLanguage(preferred);
    setIsReady(true);
  }, [applyLanguage]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== LANGUAGE_STORAGE_KEY) return;
      if (!isValidLanguage(event.newValue)) return;

      applyLanguage(event.newValue);
      setIsReady(true);
    };

    const onFocus = () => {
      const latest = readPreferredLanguage();
      applyLanguage(latest);
      setIsReady(true);
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, [applyLanguage]);

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
    visibility: isReady ? "visible" : "hidden",
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