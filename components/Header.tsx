"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/languageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { services } from "@/data/services";
import { getCart } from "@/lib/cart";
import type {
  Service,
  ServiceField,
  SearchAliasSet,
  LanguageCode,
} from "@/types/service";
import {
  UserRound,
  LayoutGrid,
  BadgePercent,
  MessageCircleMore,
  ClipboardList,
  Menu,
  X,
  Search,
  House,
  ShoppingCart,
} from "lucide-react";

type LocalizedLabel = {
  ar: string;
  de: string;
  en: string;
};

type Props = {
  showBackButton?: boolean;
  showBackHome?: boolean;
  backHref?: string;
  homeHref?: string;
  backLabel?: LocalizedLabel;
  homeLabel?: LocalizedLabel;
};

type SearchResultItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  score: number;
  matchedBy: string[];
};

type SearchableTokenBag = {
  primary: string[];
  secondary: string[];
  tertiary: string[];
};

const OPEN_REQUEST_HREF = "/request/service/open-request";

const navCards = [
  {
    id: "about",
    title: {
      ar: "من نحن",
      de: "Über uns",
      en: "About Us",
    },
    description: {
      ar: "الرؤية وطريقة العمل",
      de: "Vision & Arbeitsweise",
      en: "Vision & Workflow",
    },
    href: "/about",
    icon: UserRound,
  },
  {
    id: "services",
    title: {
      ar: "الفئات",
      de: "Kategorien",
      en: "Categories",
    },
    description: {
      ar: "تصفح المسارات والخدمات",
      de: "Leistungen und Wege ansehen",
      en: "Browse paths and services",
    },
    href: "/request",
    icon: LayoutGrid,
  },
  {
    id: "offers",
    title: {
      ar: "العروض",
      de: "Angebote",
      en: "Offers",
    },
    description: {
      ar: "باقات وحلول مقترحة",
      de: "Pakete und Lösungen",
      en: "Packages and solutions",
    },
    href: "/offers",
    icon: BadgePercent,
  },
  {
    id: "contact",
    title: {
      ar: "تواصل",
      de: "Kontakt",
      en: "Contact",
    },
    description: {
      ar: "استفسار ومساعدة",
      de: "Fragen und Hilfe",
      en: "Questions and help",
    },
    href: "/#contact",
    icon: MessageCircleMore,
  },
  {
    id: "request",
    title: {
      ar: "ابدأ الطلب",
      de: "Anfrage starten",
      en: "Start Request",
    },
    description: {
      ar: "ابدأ مباشرة",
      de: "Direkt starten",
      en: "Start directly",
    },
    href: OPEN_REQUEST_HREF,
    icon: ClipboardList,
  },
] as const;

const uiText = {
  menu: {
    ar: "القائمة",
    de: "Menü",
    en: "Menu",
  },
  searchPlaceholder: {
    ar: "ابحث بسرعة...",
    de: "Schnell suchen...",
    en: "Quick search...",
  },
  searchEmpty: {
    ar: "لا توجد نتيجة مناسبة. جرّب: لوحة، منيو، بزنس كارد، ستيكر، تيشيرت",
    de: "Keine passende Leistung gefunden. Versuche: Schild, Speisekarte, Visitenkarte, Sticker, T-Shirt",
    en: "No suitable result found. Try: sign, menu, business card, sticker, t-shirt",
  },
  searchTitle: {
    ar: "أقرب النتائج",
    de: "Passende Ergebnisse",
    en: "Matching Results",
  },
  smartSuggestion: {
    ar: "مطابقة ذكية",
    de: "Smart Match",
    en: "Smart Match",
  },
  back: {
    ar: "رجوع",
    de: "Zurück",
    en: "Back",
  },
  home: {
    ar: "الرئيسية",
    de: "Startseite",
    en: "Home",
  },
  cart: {
    ar: "السلة",
    de: "Warenkorb",
    en: "Cart",
  },
  cartAria: {
    ar: "فتح السلة",
    de: "Warenkorb öffnen",
    en: "Open cart",
  },
  searchAria: {
    ar: "فتح البحث",
    de: "Suche öffnen",
    en: "Open search",
  },
};

const legacyAliases: Record<string, string[]> = {
  "open-request": [
    "مش متأكد",
    "غير متأكد",
    "لا أعرف",
    "ما بعرف",
    "ابحث عن فكرة",
    "بدي شيء",
    "اريد شي",
    "general help",
    "not sure",
    "i dont know",
    "open request",
    "offene anfrage",
  ],
  signage: [
    "لوحة",
    "لوحات",
    "حروف",
    "حروف مضيئة",
    "واجهة",
    "يفطة",
    "صندوق ضوئي",
    "lightbox",
    "sign",
    "signage",
    "illuminated letters",
    "letters",
    "fassade",
    "schild",
    "lichtwerbung",
    "profilbuchstaben",
  ],
  "window-graphics": [
    "ستيكر واجهة",
    "زجاج",
    "ون واي",
    "فروستد",
    "لصق زجاج",
    "one way vision",
    "window sticker",
    "window graphics",
    "folie",
    "fensterfolie",
    "milchglas",
    "plotter",
  ],
  "vehicle-branding": [
    "سيارة",
    "سيارات",
    "فان",
    "مركبة",
    "تغليف سيارة",
    "كتابة سيارة",
    "car wrap",
    "vehicle",
    "van",
    "fahrzeug",
    "fahrzeugbeschriftung",
    "autobeklebung",
  ],
  "commercial-printing": [
    "بزنس كارد",
    "كرت",
    "كرت عمل",
    "بطاقة عمل",
    "فيزيت",
    "visitenkarte",
    "business card",
    "cards",
  ],
  "business-printing": [
    "فلاير",
    "بروشور",
    "مطوية",
    "منشور",
    "flyer",
    "brochure",
    "folded flyer",
    "falzflyer",
  ],
  "menu-printing": [
    "منيو",
    "قائمة طعام",
    "مينيو",
    "menu",
    "speisekarte",
    "drink card",
    "table card",
  ],
  "poster-printing": [
    "بوستر",
    "بوسترات",
    "ملصق",
    "poster",
    "plakat",
    "papierplakat",
  ],
  "letterhead-envelopes": [
    "ورق رسمي",
    "أوراق رسمية",
    "مغلفات",
    "مغلف",
    "letterhead",
    "envelope",
    "briefpapier",
    "umschlag",
  ],
  stamps: ["ختم", "اختام", "أختام", "stempel", "stamp", "date stamp"],
  "stickers-labels": [
    "ستيكر",
    "ستيكرات",
    "ملصقات",
    "استيكر",
    "labels",
    "label",
    "sticker",
    "stickers",
    "etiketten",
    "aufkleber",
  ],
  packaging: [
    "تغليف",
    "علب",
    "علبة",
    "أكياس",
    "كيس",
    "packaging",
    "box",
    "boxes",
    "bag",
    "bags",
    "verpackung",
  ],
  "textile-printing": [
    "تيشيرت",
    "تيشرت",
    "ملابس",
    "هودي",
    "قبعة",
    "طباعة ملابس",
    "textile",
    "textildruck",
    "tshirt",
    "t-shirt",
    "hoodie",
    "cap",
  ],
  "promotional-items": [
    "كوب",
    "اكواب",
    "قلم",
    "ميدالية",
    "دفتر",
    "هدايا",
    "هدايا دعائية",
    "mug",
    "pen",
    "keychain",
    "notebook",
    "giveaway",
    "werbeartikel",
  ],
  "event-printing": [
    "ستاند",
    "رول اب",
    "رول أب",
    "خلفية تصوير",
    "معرض",
    "فعالية",
    "event",
    "rollup",
    "roll-up",
    "display",
    "messe",
    "backdrop",
  ],
  "branding-design": [
    "هوية بصرية",
    "براندنج",
    "براند",
    "تصميم هوية",
    "branding",
    "identity",
    "corporate identity",
    "markendesign",
  ],
  "logo-design-only": ["شعار", "لوجو", "لوغو", "تصميم شعار", "logo", "logodesign"],
  "custom-fabrication": [
    "سي ان سي",
    "cnc",
    "ليزر",
    "قص ليزر",
    "قص cnc",
    "تصنيع خاص",
    "sonderanfertigung",
    "fabrication",
    "laser cut",
  ],
  "shop-setup-decor": [
    "تجهيز محل",
    "تجهيز متجر",
    "ديكور محل",
    "افتتاح محل",
    "shop setup",
    "store setup",
    "ladenbau",
    "store preparation",
  ],
  "marketing-solutions": [
    "تسويق",
    "حلول متكاملة",
    "حملة",
    "campaign",
    "marketing",
    "marketing solution",
    "komplettlösung",
  ],
  "sign-installation-maintenance": [
    "تركيب لوحة",
    "صيانة لوحة",
    "فك لوحة",
    "تركيب",
    "صيانة",
    "installation",
    "maintenance",
    "montage",
    "wartung",
  ],
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeText(value: string): string[] {
  return normalizeText(value)
    .split(" ")
    .map((token) => token.trim())
    .filter(Boolean);
}

function getLocalizedValue(
  value: Partial<Record<LanguageCode, string>> | undefined,
  language: LanguageCode,
  fallback = ""
) {
  if (!value) return fallback;
  return value[language] || value.en || value.de || value.ar || fallback;
}

function getLocalizedArrayFromAliasSet(
  value: SearchAliasSet | undefined,
  language: LanguageCode
): string[] {
  if (!value) return [];

  return [
    ...(value[language] || []),
    ...(value.universal || []),
    ...(value.ar || []),
    ...(value.de || []),
    ...(value.en || []),
  ].filter(Boolean);
}

function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  values.forEach((value) => {
    const clean = value.trim();
    if (!clean) return;

    const normalized = normalizeText(clean);
    if (!normalized || seen.has(normalized)) return;

    seen.add(normalized);
    result.push(clean);
  });

  return result;
}

function getAllServiceFields(serviceId: string): ServiceField[] {
  const service = services.find((entry) => entry.id === serviceId);
  if (!service) return [];

  const rootFields = service.fields || [];
  const sectionFields =
    service.sections?.flatMap((section) => section.fields || []) || [];
  const map = new Map<string, ServiceField>();

  [...rootFields, ...sectionFields].forEach((field) => {
    if (!field?.id) return;
    if (!map.has(field.id)) {
      map.set(field.id, field);
    }
  });

  return Array.from(map.values());
}

function getCartCount(): number {
  try {
    const cart = getCart();
    if (!Array.isArray(cart) || cart.length === 0) return 0;
    return cart.length;
  } catch {
    return 0;
  }
}

function scoreTokenBagMatch(query: string, bag: SearchableTokenBag) {
  if (!query) return { score: 0, matchedBy: [] as string[] };

  const normalizedQuery = normalizeText(query);
  const queryTokens = tokenizeText(query);
  let score = 0;
  const matchedBy: string[] = [];

  const scoreAgainstList = (
    list: string[],
    exactPoints: number,
    includesPoints: number,
    tokenPoints: number,
    label: string
  ) => {
    list.forEach((item) => {
      const normalizedItem = normalizeText(item);
      if (!normalizedItem) return;

      if (normalizedItem === normalizedQuery) {
        score += exactPoints;
        matchedBy.push(label);
        return;
      }

      if (
        normalizedItem.includes(normalizedQuery) ||
        normalizedQuery.includes(normalizedItem)
      ) {
        score += includesPoints;
        matchedBy.push(label);
        return;
      }

      const itemTokens = tokenizeText(item);
      const overlap = queryTokens.filter((token) =>
        itemTokens.includes(token)
      ).length;

      if (overlap > 0) {
        score += overlap * tokenPoints;
        matchedBy.push(label);
      }
    });
  };

  scoreAgainstList(bag.primary, 120, 70, 18, "primary");
  scoreAgainstList(bag.secondary, 60, 28, 8, "secondary");
  scoreAgainstList(bag.tertiary, 28, 12, 4, "tertiary");

  return {
    score,
    matchedBy: uniqueStrings(matchedBy),
  };
}

function buildServiceTokenBag(
  service: Service,
  language: LanguageCode
): SearchableTokenBag {
  const fields = getAllServiceFields(service.id);

  const primary = uniqueStrings([
    getLocalizedValue(service.title, language, ""),
    getLocalizedValue(service.title, "ar", ""),
    getLocalizedValue(service.title, "de", ""),
    getLocalizedValue(service.title, "en", ""),
    ...(service.searchProfile?.aliases
      ? getLocalizedArrayFromAliasSet(service.searchProfile.aliases, language)
      : []),
    ...(legacyAliases[service.id] || []),
  ]);

  const secondary = uniqueStrings([
    getLocalizedValue(service.description, language, ""),
    getLocalizedValue(service.description, "ar", ""),
    getLocalizedValue(service.description, "de", ""),
    getLocalizedValue(service.description, "en", ""),
    getLocalizedValue(service.intro, language, ""),
    getLocalizedValue(service.intro, "ar", ""),
    getLocalizedValue(service.intro, "de", ""),
    getLocalizedValue(service.intro, "en", ""),
    ...(service.requestGuidance || []).flatMap((item) => [
      getLocalizedValue(item, language, ""),
      getLocalizedValue(item, "ar", ""),
      getLocalizedValue(item, "de", ""),
      getLocalizedValue(item, "en", ""),
    ]),
    ...(service.searchProfile?.seoKeywords
      ? getLocalizedArrayFromAliasSet(service.searchProfile.seoKeywords, language)
      : []),
    ...(service.searchProfile?.voicePhrases
      ? getLocalizedArrayFromAliasSet(service.searchProfile.voicePhrases, language)
      : []),
    ...(service.searchProfile?.naturalQueries || []).flatMap((item) => [
      getLocalizedValue(item, language, ""),
      getLocalizedValue(item, "ar", ""),
      getLocalizedValue(item, "de", ""),
      getLocalizedValue(item, "en", ""),
    ]),
    service.category,
    service.intent || "",
    ...(service.useCases || []),
  ]);

  const tertiary = uniqueStrings([
    ...fields.flatMap((field) => [
      field.id,
      getLocalizedValue(field.label, language, ""),
      getLocalizedValue(field.label, "ar", ""),
      getLocalizedValue(field.label, "de", ""),
      getLocalizedValue(field.label, "en", ""),
      getLocalizedValue(field.placeholder, language, ""),
      getLocalizedValue(field.placeholder, "ar", ""),
      getLocalizedValue(field.placeholder, "de", ""),
      getLocalizedValue(field.placeholder, "en", ""),
      getLocalizedValue(field.helpText, language, ""),
      getLocalizedValue(field.helpText, "ar", ""),
      getLocalizedValue(field.helpText, "de", ""),
      getLocalizedValue(field.helpText, "en", ""),
      ...(field.aliases
        ? getLocalizedArrayFromAliasSet(field.aliases, language)
        : []),
      ...(field.seoKeywords
        ? getLocalizedArrayFromAliasSet(field.seoKeywords, language)
        : []),
      ...(field.voicePhrases
        ? getLocalizedArrayFromAliasSet(field.voicePhrases, language)
        : []),
      ...(field.examplePhrases || []).flatMap((item) => [
        getLocalizedValue(item, language, ""),
        getLocalizedValue(item, "ar", ""),
        getLocalizedValue(item, "de", ""),
        getLocalizedValue(item, "en", ""),
      ]),
      field.semanticGroup || "",
      field.intentRole || "",
    ]),
    ...fields.flatMap((field) =>
      (field.options || []).flatMap((option) => [
        option.value,
        getLocalizedValue(option.label, language, ""),
        getLocalizedValue(option.label, "ar", ""),
        getLocalizedValue(option.label, "de", ""),
        getLocalizedValue(option.label, "en", ""),
        ...(option.aliases
          ? getLocalizedArrayFromAliasSet(option.aliases, language)
          : []),
        ...(option.seoKeywords
          ? getLocalizedArrayFromAliasSet(option.seoKeywords, language)
          : []),
        ...(option.voicePhrases
          ? getLocalizedArrayFromAliasSet(option.voicePhrases, language)
          : []),
        ...((option.intentTags as string[] | undefined) || []),
      ])
    ),
    ...(service.sections || []).flatMap((section) => [
      section.id,
      getLocalizedValue(section.title, language, ""),
      getLocalizedValue(section.title, "ar", ""),
      getLocalizedValue(section.title, "de", ""),
      getLocalizedValue(section.title, "en", ""),
      getLocalizedValue(section.description, language, ""),
      getLocalizedValue(section.description, "ar", ""),
      getLocalizedValue(section.description, "de", ""),
      getLocalizedValue(section.description, "en", ""),
      ...(section.aliases
        ? getLocalizedArrayFromAliasSet(section.aliases, language)
        : []),
      ...(section.seoKeywords
        ? getLocalizedArrayFromAliasSet(section.seoKeywords, language)
        : []),
      ...(section.voicePhrases
        ? getLocalizedArrayFromAliasSet(section.voicePhrases, language)
        : []),
    ]),
    ...(service.attachments || []).flatMap((attachment) => [
      attachment.id,
      attachment.kind,
      getLocalizedValue(attachment.title, language, ""),
      getLocalizedValue(attachment.title, "ar", ""),
      getLocalizedValue(attachment.title, "de", ""),
      getLocalizedValue(attachment.title, "en", ""),
      getLocalizedValue(attachment.description, language, ""),
      getLocalizedValue(attachment.description, "ar", ""),
      getLocalizedValue(attachment.description, "de", ""),
      getLocalizedValue(attachment.description, "en", ""),
      ...(attachment.aliases
        ? getLocalizedArrayFromAliasSet(attachment.aliases, language)
        : []),
      ...(attachment.seoKeywords
        ? getLocalizedArrayFromAliasSet(attachment.seoKeywords, language)
        : []),
      ...(attachment.voicePhrases
        ? getLocalizedArrayFromAliasSet(attachment.voicePhrases, language)
        : []),
    ]),
    ...(service.seo?.keywords
      ? getLocalizedArrayFromAliasSet(service.seo.keywords, language)
      : []),
    ...(service.seo?.internalLinkTerms
      ? getLocalizedArrayFromAliasSet(service.seo.internalLinkTerms, language)
      : []),
    service.seo?.slug || "",
    service.seo?.categorySlug || "",
    getLocalizedValue(service.seo?.metaTitle, language, ""),
    getLocalizedValue(service.seo?.metaDescription, language, ""),
  ]);

  return {
    primary,
    secondary,
    tertiary,
  };
}

function dedupeSearchResults(items: SearchResultItem[]): SearchResultItem[] {
  const seen = new Set<string>();
  const result: SearchResultItem[] = [];

  items.forEach((item) => {
    if (!item.id || seen.has(item.id)) return;
    seen.add(item.id);
    result.push(item);
  });

  return result;
}

function getTopSearchResults(
  query: string,
  language: LanguageCode
): SearchResultItem[] {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) return [];

  const results = services
    .map((service) => {
      const localizedTitle = getLocalizedValue(service.title, language, service.id);
      const localizedDescription = getLocalizedValue(
        service.description,
        language,
        ""
      );
      const tokenBag = buildServiceTokenBag(service, language);
      const tokenMatch = scoreTokenBagMatch(normalizedQuery, tokenBag);

      let score = tokenMatch.score;

      const localizedSlug = service.seo?.slug || "";
      const localizedCategorySlug = service.seo?.categorySlug || "";

      if (normalizeText(localizedTitle) === normalizedQuery) {
        score += 150;
      } else if (normalizeText(localizedTitle).includes(normalizedQuery)) {
        score += 85;
      }

      if (normalizeText(localizedDescription).includes(normalizedQuery)) {
        score += 24;
      }

      if (normalizeText(service.id).includes(normalizedQuery)) {
        score += 24;
      }

      if (normalizeText(service.category).includes(normalizedQuery)) {
        score += 16;
      }

      if (localizedSlug && normalizeText(localizedSlug).includes(normalizedQuery)) {
        score += 18;
      }

      if (
        localizedCategorySlug &&
        normalizeText(localizedCategorySlug).includes(normalizedQuery)
      ) {
        score += 10;
      }

      if (service.searchProfile?.searchableTextBoost) {
        score += Number(service.searchProfile.searchableTextBoost) || 0;
      }

      return {
        id: service.id,
        title: localizedTitle,
        description: localizedDescription,
        href: `/request/service/${service.id}`,
        score,
        matchedBy: tokenMatch.matchedBy,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  return dedupeSearchResults(results).slice(0, 6);
}

export default function Header({
  showBackButton = false,
  showBackHome = false,
  backHref,
  homeHref = "/",
  backLabel = {
    ar: "رجوع",
    de: "Zurück",
    en: "Back",
  },
  homeLabel = {
    ar: "الرئيسية",
    de: "Startseite",
    en: "Home",
  },
}: Props) {
  const router = useRouter();
  const { language, dir } = useLanguage();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const effectiveIsMobile = hasMounted ? isMobile : false;
  const effectiveCartCount = hasMounted ? cartCount : 0;
  const headerHeight = effectiveIsMobile ? 58 : 84;

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
      return;
    }

    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    }

    function handleResize() {
      setIsMobile(window.innerWidth <= 940);
    }

    handleResize();

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [language]);

  useEffect(() => {
    const syncCartCount = () => {
      setCartCount(getCartCount());
    };

    syncCartCount();

    const handleCartUpdated = () => {
      syncCartCount();
    };

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key.toLowerCase().includes("cart")) {
        syncCartCount();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncCartCount();
      }
    };

    window.addEventListener("cart-updated", handleCartUpdated as EventListener);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleCartUpdated);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener(
        "cart-updated",
        handleCartUpdated as EventListener
      );
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleCartUpdated);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const searchResults = useMemo(() => {
    return getTopSearchResults(searchValue, language);
  }, [language, searchValue]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (searchResults.length > 0) {
      router.push(searchResults[0].href);
    } else {
      router.push(OPEN_REQUEST_HREF);
    }

    setSearchOpen(false);
    setSearchValue("");
  };

  const pillBaseStyle: CSSProperties = {
    border: "1px solid #ccb59a",
    background: "rgba(255, 250, 244, 0.82)",
    color: "#3d3126",
    borderRadius: "999px",
    padding: effectiveIsMobile ? "0 12px" : "0 16px",
    height: effectiveIsMobile ? "40px" : "46px",
    fontSize: effectiveIsMobile ? "12px" : "13px",
    fontWeight: 700,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    textDecoration: "none",
    transition:
      "transform 0.18s ease, background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
    boxShadow: "0 2px 8px rgba(90, 70, 40, 0.02)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    flexShrink: 0,
  };

  const getInteractivePillEvents = () => ({
    onMouseEnter: (e: ReactMouseEvent<HTMLElement>) => {
      e.currentTarget.style.transform = "translateY(-1px)";
      e.currentTarget.style.background = "rgba(247, 239, 229, 0.94)";
      e.currentTarget.style.borderColor = "#b89f84";
      e.currentTarget.style.boxShadow = "0 8px 18px rgba(90, 70, 40, 0.08)";
    },
    onMouseLeave: (e: ReactMouseEvent<HTMLElement>) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.background = "rgba(255, 250, 244, 0.82)";
      e.currentTarget.style.borderColor = "#ccb59a";
      e.currentTarget.style.boxShadow = "0 2px 8px rgba(90, 70, 40, 0.02)";
    },
  });

  return (
    <>
      <div style={{ height: headerHeight }} aria-hidden="true" />

      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          width: "100%",
          background: "rgba(245, 241, 235, 0.94)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(221, 205, 187, 0.72)",
        }}
      >
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            padding: effectiveIsMobile ? "8px 10px" : "12px 18px",
            display: "flex",
            alignItems: "center",
            gap: effectiveIsMobile ? "8px" : "14px",
            justifyContent: "space-between",
            direction: "ltr",
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: effectiveIsMobile ? "42px" : "58px",
              height: effectiveIsMobile ? "42px" : "58px",
              borderRadius: effectiveIsMobile ? "12px" : "18px",
              transition: "transform 0.18s ease, filter 0.18s ease",
              flexShrink: 0,
            }}
            aria-label="Caro Bara Logo"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.filter =
                "drop-shadow(0 8px 14px rgba(0,0,0,0.10))";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.filter = "none";
            }}
          >
            <img
              src="/logo.png"
              alt="Caro Bara Logo"
              style={{
                width: effectiveIsMobile ? "32px" : "48px",
                height: effectiveIsMobile ? "32px" : "48px",
                objectFit: "contain",
                display: "block",
              }}
            />
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: effectiveIsMobile ? "6px" : "10px",
              flex: "1 1 auto",
              minWidth: 0,
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                direction: dir,
                minWidth: 0,
                overflowX: "auto",
                overflowY: "hidden",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                flex: effectiveIsMobile ? "1 1 auto" : "0 1 auto",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  minWidth: "max-content",
                  transform: effectiveIsMobile ? "scale(0.86)" : "none",
                  transformOrigin:
                    dir === "rtl" ? "right center" : "left center",
                }}
              >
                <LanguageSwitcher justify="center" />
              </div>
            </div>

            {showBackButton && (
              <button
                type="button"
                onClick={handleBack}
                style={{
                  ...pillBaseStyle,
                  width: effectiveIsMobile ? "40px" : undefined,
                  padding: effectiveIsMobile ? 0 : pillBaseStyle.padding,
                }}
                {...getInteractivePillEvents()}
                aria-label={backLabel[language] || uiText.back[language]}
              >
                {effectiveIsMobile
                  ? "←"
                  : `← ${backLabel[language] || uiText.back[language]}`}
              </button>
            )}

            {showBackHome && (
              <Link
                href={homeHref}
                style={{
                  ...pillBaseStyle,
                  width: effectiveIsMobile ? "40px" : undefined,
                  padding: effectiveIsMobile ? 0 : pillBaseStyle.padding,
                }}
                {...getInteractivePillEvents()}
                aria-label={homeLabel[language] || uiText.home[language]}
              >
                {effectiveIsMobile ? (
                  <House size={15} />
                ) : (
                  homeLabel[language] || uiText.home[language]
                )}
              </Link>
            )}

            <Link
              href="/cart"
              style={{
                ...pillBaseStyle,
                position: "relative",
                width: effectiveIsMobile ? "40px" : undefined,
                minWidth: effectiveIsMobile ? "40px" : "46px",
                padding: effectiveIsMobile ? 0 : "0 16px",
                gap: effectiveIsMobile ? "0" : "8px",
              }}
              {...getInteractivePillEvents()}
              aria-label={uiText.cartAria[language]}
            >
              <ShoppingCart size={effectiveIsMobile ? 16 : 18} />
              {!effectiveIsMobile && <span>{uiText.cart[language]}</span>}

              {effectiveCartCount > 0 && (
                <span
                  aria-label={`${effectiveCartCount}`}
                  style={{
                    position: "absolute",
                    top: effectiveIsMobile ? "-4px" : "-6px",
                    right: effectiveIsMobile ? "-4px" : "-6px",
                    minWidth: effectiveIsMobile ? "18px" : "20px",
                    height: effectiveIsMobile ? "18px" : "20px",
                    padding: "0 5px",
                    borderRadius: "999px",
                    background: "#b3261e",
                    color: "#ffffff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: effectiveIsMobile ? "9px" : "11px",
                    fontWeight: 800,
                    lineHeight: 1,
                    boxShadow: "0 6px 14px rgba(179, 38, 30, 0.28)",
                    border: "2px solid rgba(255, 250, 244, 0.98)",
                  }}
                >
                  {effectiveCartCount > 99 ? "99+" : effectiveCartCount}
                </span>
              )}
            </Link>

            <div ref={searchRef} style={{ position: "relative", flexShrink: 0 }}>
              <form onSubmit={handleSearchSubmit}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    height: effectiveIsMobile ? "40px" : "46px",
                    minWidth: searchOpen
                      ? effectiveIsMobile
                        ? "min(180px, calc(100vw - 150px))"
                        : "min(300px, calc(100vw - 160px))"
                      : effectiveIsMobile
                        ? "40px"
                        : "46px",
                    padding: searchOpen
                      ? effectiveIsMobile
                        ? "0 10px"
                        : "0 14px"
                      : effectiveIsMobile
                        ? "0"
                        : "0 13px",
                    borderRadius: "999px",
                    border: "1px solid #ccb59a",
                    background: "rgba(255, 250, 244, 0.82)",
                    boxShadow: "0 2px 8px rgba(90, 70, 40, 0.02)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    transition:
                      "min-width 0.22s ease, padding 0.22s ease, background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
                    justifyContent:
                      effectiveIsMobile && !searchOpen ? "center" : "flex-start",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.background = "rgba(247, 239, 229, 0.94)";
                    e.currentTarget.style.borderColor = "#b89f84";
                    e.currentTarget.style.boxShadow =
                      "0 8px 18px rgba(90, 70, 40, 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.background = "rgba(255, 250, 244, 0.82)";
                    e.currentTarget.style.borderColor = "#ccb59a";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(90, 70, 40, 0.02)";
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setSearchOpen((prev) => !prev)}
                    style={{
                      border: "none",
                      background: "transparent",
                      padding: 0,
                      margin: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#3d3126",
                      cursor: "pointer",
                      flexShrink: 0,
                      width: effectiveIsMobile ? "40px" : "auto",
                      height: effectiveIsMobile ? "40px" : "auto",
                    }}
                    aria-label={uiText.searchAria[language]}
                  >
                    <Search size={effectiveIsMobile ? 16 : 18} />
                  </button>

                  {searchOpen && (
                    <input
                      ref={inputRef}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder={uiText.searchPlaceholder[language]}
                      style={{
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        width: "100%",
                        minWidth: 0,
                        fontSize: effectiveIsMobile ? "11px" : "13px",
                        color: "#3d3126",
                      }}
                    />
                  )}
                </div>
              </form>

              {searchOpen && searchValue.trim() && (
                <div
                  style={{
                    position: "absolute",
                    top: effectiveIsMobile ? "48px" : "58px",
                    right: 0,
                    width: effectiveIsMobile
                      ? "min(320px, calc(100vw - 16px))"
                      : "min(400px, calc(100vw - 24px))",
                    background: "rgba(255,255,255,0.97)",
                    border: "1px solid #e1d4c4",
                    borderRadius: "24px",
                    boxShadow: "0 22px 50px rgba(55, 40, 24, 0.12)",
                    padding: "12px",
                    zIndex: 60,
                    backdropFilter: "blur(10px)",
                    direction: dir,
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#7a6856",
                      marginBottom: "10px",
                      paddingInline: "6px",
                    }}
                  >
                    {uiText.searchTitle[language]}
                  </div>

                  {searchResults.length > 0 ? (
                    <div style={{ display: "grid", gap: "10px" }}>
                      {searchResults.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchValue("");
                          }}
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                            display: "grid",
                            gap: "6px",
                            padding: effectiveIsMobile ? "12px" : "14px",
                            borderRadius: "18px",
                            border: "1px solid #ede2d5",
                            background:
                              "linear-gradient(180deg, #fdfbf8 0%, #faf6f1 100%)",
                            boxShadow: "0 6px 18px rgba(74, 54, 34, 0.04)",
                            transition:
                              "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
                          }}
                        >
                          <div
                            style={{
                              fontSize: effectiveIsMobile ? "15px" : "16px",
                              fontWeight: 700,
                              lineHeight: 1.35,
                              color: "#2f2419",
                            }}
                          >
                            {item.title}
                          </div>

                          <div
                            style={{
                              fontSize: effectiveIsMobile ? "12px" : "13px",
                              lineHeight: 1.6,
                              color: "#6c5948",
                            }}
                          >
                            {item.description}
                          </div>

                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "6px",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                color: "#8b745e",
                              }}
                            >
                              {uiText.smartSuggestion[language]}
                            </div>

                            {item.matchedBy.length > 0 && (
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "6px",
                                }}
                              >
                                {item.matchedBy.slice(0, 2).map((match) => (
                                  <span
                                    key={`${item.id}-${match}`}
                                    style={{
                                      fontSize: "10px",
                                      fontWeight: 700,
                                      color: "#6e5a47",
                                      background: "#efe4d7",
                                      border: "1px solid #e1d0be",
                                      borderRadius: "999px",
                                      padding: "3px 7px",
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    {match}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "14px",
                        borderRadius: "18px",
                        border: "1px solid #ede2d5",
                        background:
                          "linear-gradient(180deg, #fdfbf8 0%, #faf6f1 100%)",
                        color: "#6c5948",
                        fontSize: effectiveIsMobile ? "12px" : "13px",
                        lineHeight: 1.65,
                      }}
                    >
                      {uiText.searchEmpty[language]}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div ref={menuRef} style={{ position: "relative", flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
                aria-label={uiText.menu[language]}
                style={{
                  ...pillBaseStyle,
                  width: effectiveIsMobile ? "40px" : undefined,
                  padding: effectiveIsMobile ? 0 : pillBaseStyle.padding,
                  gap: effectiveIsMobile ? "0" : "8px",
                }}
                {...getInteractivePillEvents()}
              >
                {menuOpen ? (
                  <X size={effectiveIsMobile ? 16 : 18} />
                ) : (
                  <Menu size={effectiveIsMobile ? 16 : 18} />
                )}
                {!effectiveIsMobile && <span>{uiText.menu[language]}</span>}
              </button>

              {menuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: effectiveIsMobile ? "48px" : "58px",
                    right: 0,
                    width: effectiveIsMobile
                      ? "min(320px, calc(100vw - 16px))"
                      : "min(330px, calc(100vw - 24px))",
                    background: "rgba(255,255,255,0.96)",
                    border: "1px solid #e1d4c4",
                    borderRadius: "24px",
                    boxShadow: "0 22px 50px rgba(55, 40, 24, 0.12)",
                    padding: "12px",
                    zIndex: 50,
                    backdropFilter: "blur(10px)",
                    direction: dir,
                  }}
                >
                  <div style={{ display: "grid", gap: "10px" }}>
                    {navCards.map((item) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                            display: "grid",
                            gridTemplateColumns: effectiveIsMobile
                              ? "1fr 44px"
                              : "1fr 48px",
                            alignItems: "center",
                            gap: "12px",
                            padding: effectiveIsMobile ? "12px" : "13px",
                            borderRadius: "18px",
                            border: "1px solid #ede2d5",
                            background:
                              "linear-gradient(180deg, #fdfbf8 0%, #faf6f1 100%)",
                            boxShadow: "0 6px 18px rgba(74, 54, 34, 0.04)",
                          }}
                        >
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: effectiveIsMobile ? "15px" : "16px",
                                fontWeight: 700,
                                lineHeight: 1.3,
                                color: "#2f2419",
                                marginBottom: "4px",
                              }}
                            >
                              {item.title[language]}
                            </div>

                            <div
                              style={{
                                fontSize: effectiveIsMobile ? "11px" : "12px",
                                lineHeight: 1.45,
                                color: "#6c5948",
                                opacity: 0.88,
                              }}
                            >
                              {item.description[language]}
                            </div>
                          </div>

                          <div
                            style={{
                              width: effectiveIsMobile ? "44px" : "48px",
                              height: effectiveIsMobile ? "44px" : "48px",
                              borderRadius: "15px",
                              background: "#eadfce",
                              border: "1px solid #dcc8b0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              alignSelf: "center",
                            }}
                          >
                            <Icon
                              size={effectiveIsMobile ? 18 : 20}
                              strokeWidth={1.9}
                              color="#3d3126"
                            />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}