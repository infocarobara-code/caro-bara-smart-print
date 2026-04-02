export type Language = "ar" | "de" | "en";

export const DEFAULT_LANGUAGE: Language = "ar";

export const LANGUAGE_COOKIE_KEY = "caro_bara_lang";
export const LANGUAGE_STORAGE_KEY = "caro_bara_lang";

export const LANGUAGE_LABELS: Record<Language, string> = {
  ar: "عربي",
  de: "Deutsch",
  en: "English",
};

export const LANGUAGE_DIRECTIONS: Record<Language, "rtl" | "ltr"> = {
  ar: "rtl",
  de: "ltr",
  en: "ltr",
};

export function isValidLanguage(value: string | null | undefined): value is Language {
  return value === "ar" || value === "de" || value === "en";
}

export function getDirection(lang: Language): "rtl" | "ltr" {
  return LANGUAGE_DIRECTIONS[lang];
}