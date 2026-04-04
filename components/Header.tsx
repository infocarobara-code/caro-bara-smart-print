"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/languageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { services } from "@/data/services";
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

const navCards = [
  {
    id: "about",
    title: {
      ar: "من نحن",
      de: "Über uns",
      en: "About Us",
    },
    description: {
      ar: "تعرّف على رؤية Caro Bara ودورها كجهة تفهم الطلب وتراجعه وتشرف على توجيهه للتنفيذ.",
      de: "Lerne die Vision von Caro Bara kennen und wie Anfragen verstanden, geprüft und zur Umsetzung begleitet werden.",
      en: "Discover Caro Bara’s vision and how requests are understood, reviewed, and guided to execution.",
    },
    href: "/about",
    icon: UserRound,
  },
  {
    id: "services",
    title: {
      ar: "خدماتنا",
      de: "Unsere Leistungen",
      en: "Our Services",
    },
    description: {
      ar: "استعرض الفئات والخدمات الأساسية بطريقة واضحة تساعد العميل على الوصول السريع لما يناسبه.",
      de: "Entdecke die wichtigsten Kategorien und Leistungen in einer klaren Struktur für eine schnelle Auswahl.",
      en: "Explore the main categories and services in a clear structure for faster selection.",
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
      ar: "اطّلع على العروض والباقات المقترحة للأفراد والشركات وفق صياغة احترافية منظمة.",
      de: "Sieh dir empfohlene Angebote und Pakete für Privatkunden und Unternehmen in professioneller Form an.",
      en: "Browse curated offers and packages for individuals and businesses in a professional format.",
    },
    href: "/offers",
    icon: BadgePercent,
  },
  {
    id: "contact",
    title: {
      ar: "تواصل معنا",
      de: "Kontakt",
      en: "Contact Us",
    },
    description: {
      ar: "كل وسائل التواصل والاستفسار وطلب المساعدة أو التوضيح قبل تنفيذ المشروع.",
      de: "Alle Kontaktwege für Rückfragen, Unterstützung und Klärung vor der Umsetzung.",
      en: "All contact options for inquiries, support, and clarification before execution.",
    },
    href: "/#contact",
    icon: MessageCircleMore,
  },
  {
    id: "request",
    title: {
      ar: "اطلب الآن",
      de: "Jetzt anfragen",
      en: "Request Now",
    },
    description: {
      ar: "ابدأ الطلب مباشرة عبر نموذج منظم يساعدنا على فهم مشروعك بسرعة ودقة ووضوح.",
      de: "Starte deine Anfrage direkt über ein strukturiertes Formular, das uns hilft, dein Projekt schnell und präzise zu verstehen.",
      en: "Start your request directly through a structured form that helps us understand your project quickly and accurately.",
    },
    href: "/request/service/open-request",
    icon: ClipboardList,
  },
];

const uiText = {
  menu: {
    ar: "القائمة",
    de: "Menü",
    en: "Menu",
  },
  searchPlaceholder: {
    ar: "ابحث عن خدمة أو اكتب ما تحتاجه...",
    de: "Suche nach einer Leistung oder beschreibe deinen Bedarf...",
    en: "Search for a service or describe what you need...",
  },
  searchEmpty: {
    ar: "لا توجد نتيجة مناسبة. جرّب كلمات مثل: لوحة، منيو، بزنس كارد، ستيكر، تيشيرت",
    de: "Keine passende Leistung gefunden. Versuche Begriffe wie: Schild, Speisekarte, Visitenkarte, Sticker, T-Shirt",
    en: "No suitable result found. Try words like: sign, menu, business card, sticker, t-shirt",
  },
  searchTitle: {
    ar: "أقرب الخدمات المناسبة",
    de: "Passende Leistungen",
    en: "Matching Services",
  },
  smartSuggestion: {
    ar: "اقتراح ذكي",
    de: "Intelligente Zuordnung",
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
};

const smartAliases: Record<string, string[]> = {
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

  const menuRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

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
      setIsMobile(window.innerWidth <= 768);
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

  const searchResults = useMemo(() => {
    const query = normalizeText(searchValue);

    if (!query) return [];

    return services
      .map((service) => {
        const titleScore =
          normalizeText(service.title.ar).includes(query) ||
          normalizeText(service.title.de).includes(query) ||
          normalizeText(service.title.en).includes(query)
            ? 50
            : 0;

        const descriptionScore =
          normalizeText(service.description.ar).includes(query) ||
          normalizeText(service.description.de).includes(query) ||
          normalizeText(service.description.en).includes(query)
            ? 20
            : 0;

        const categoryScore = normalizeText(service.category).includes(query) ? 10 : 0;

        const aliasScore = (smartAliases[service.id] || []).some((alias) =>
          normalizeText(alias).includes(query) || query.includes(normalizeText(alias))
        )
          ? 80
          : 0;

        const fieldLabelScore = (service.fields ?? []).some((field) => {
          if (!field.label) return false;
          return (
            normalizeText(field.label.ar || "").includes(query) ||
            normalizeText(field.label.de || "").includes(query) ||
            normalizeText(field.label.en || "").includes(query)
          );
        })
          ? 8
          : 0;

        const totalScore =
          titleScore + descriptionScore + categoryScore + aliasScore + fieldLabelScore;

        return {
          id: service.id,
          title: service.title[language],
          description: service.description[language],
          href: `/request/service/${service.id}`,
          score: totalScore,
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [language, searchValue]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (searchResults.length > 0) {
      router.push(searchResults[0].href);
    } else {
      router.push("/request/service/open-request");
    }

    setSearchOpen(false);
    setSearchValue("");
  };

  const pillBaseStyle: React.CSSProperties = {
    border: "1px solid #c8b197",
    background: "rgba(255, 250, 244, 0.74)",
    color: "#3d3126",
    borderRadius: "999px",
    padding: isMobile ? "0 12px" : "0 16px",
    height: isMobile ? "42px" : "46px",
    fontSize: isMobile ? "12px" : "13px",
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

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        width: "100%",
        background: "rgba(245, 241, 235, 0.92)",
        backdropFilter: "blur(10px)",
        padding: isMobile ? "8px 10px" : "12px 14px 0",
        borderBottom: "1px solid rgba(231, 217, 200, 0.55)",
      }}
    >
      <div
        style={{
          maxWidth: "1220px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: isMobile ? "8px" : "14px",
          direction: "ltr",
          flexWrap: "nowrap",
          minWidth: 0,
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: isMobile ? "42px" : "56px",
            height: isMobile ? "42px" : "56px",
            borderRadius: isMobile ? "14px" : "18px",
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
              width: isMobile ? "34px" : "48px",
              height: isMobile ? "34px" : "48px",
              objectFit: "contain",
              display: "block",
            }}
          />
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "6px" : "10px",
            minWidth: 0,
            flex: "1 1 auto",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              direction: dir,
              minWidth: 0,
              flex: "1 1 auto",
              overflowX: "auto",
              overflowY: "hidden",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                minWidth: "max-content",
                transform: isMobile ? "scale(0.88)" : "none",
                transformOrigin: "center",
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
                width: isMobile ? "42px" : undefined,
                padding: isMobile ? 0 : pillBaseStyle.padding,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.background = "rgba(247, 239, 229, 0.92)";
                e.currentTarget.style.borderColor = "#b89f84";
                e.currentTarget.style.boxShadow =
                  "0 8px 18px rgba(90, 70, 40, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "rgba(255, 250, 244, 0.74)";
                e.currentTarget.style.borderColor = "#c8b197";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(90, 70, 40, 0.02)";
              }}
              aria-label={backLabel[language] || uiText.back[language]}
            >
              {isMobile ? "←" : `← ${backLabel[language] || uiText.back[language]}`}
            </button>
          )}

          {showBackHome && (
            <Link
              href={homeHref}
              style={{
                ...pillBaseStyle,
                width: isMobile ? "42px" : undefined,
                padding: isMobile ? 0 : pillBaseStyle.padding,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.background = "rgba(247, 239, 229, 0.92)";
                e.currentTarget.style.borderColor = "#b89f84";
                e.currentTarget.style.boxShadow =
                  "0 8px 18px rgba(90, 70, 40, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "rgba(255, 250, 244, 0.74)";
                e.currentTarget.style.borderColor = "#c8b197";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(90, 70, 40, 0.02)";
              }}
              aria-label={homeLabel[language] || uiText.home[language]}
            >
              {isMobile ? <House size={16} /> : homeLabel[language] || uiText.home[language]}
            </Link>
          )}

          <div ref={searchRef} style={{ position: "relative", flexShrink: 0 }}>
            <form onSubmit={handleSearchSubmit}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  height: isMobile ? "42px" : "46px",
                  minWidth: searchOpen
                    ? isMobile
                      ? "min(170px, calc(100vw - 200px))"
                      : "min(340px, calc(100vw - 120px))"
                    : isMobile
                      ? "42px"
                      : "46px",
                  padding: searchOpen
                    ? isMobile
                      ? "0 10px"
                      : "0 14px"
                    : isMobile
                      ? "0"
                      : "0 13px",
                  borderRadius: "999px",
                  border: "1px solid #c8b197",
                  background: "rgba(255, 250, 244, 0.74)",
                  boxShadow: "0 2px 8px rgba(90, 70, 40, 0.02)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  transition:
                    "min-width 0.22s ease, padding 0.22s ease, background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
                  justifyContent: isMobile && !searchOpen ? "center" : "flex-start",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.background = "rgba(247, 239, 229, 0.92)";
                  e.currentTarget.style.borderColor = "#b89f84";
                  e.currentTarget.style.boxShadow =
                    "0 8px 18px rgba(90, 70, 40, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.background = "rgba(255, 250, 244, 0.74)";
                  e.currentTarget.style.borderColor = "#c8b197";
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
                    width: isMobile ? "42px" : "auto",
                    height: isMobile ? "42px" : "auto",
                  }}
                  aria-label="Search"
                >
                  <Search size={18} />
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
                      fontSize: isMobile ? "12px" : "13px",
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
                  top: isMobile ? "50px" : "58px",
                  right: 0,
                  width: isMobile
                    ? "min(320px, calc(100vw - 20px))"
                    : "min(420px, calc(100vw - 24px))",
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
                          padding: isMobile ? "12px" : "14px",
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
                            fontSize: isMobile ? "15px" : "17px",
                            fontWeight: 700,
                            lineHeight: 1.35,
                            color: "#2f2419",
                          }}
                        >
                          {item.title}
                        </div>

                        <div
                          style={{
                            fontSize: isMobile ? "12px" : "13px",
                            lineHeight: 1.7,
                            color: "#6c5948",
                          }}
                        >
                          {item.description}
                        </div>

                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#8b745e",
                          }}
                        >
                          {uiText.smartSuggestion[language]}
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
                      background: "linear-gradient(180deg, #fdfbf8 0%, #faf6f1 100%)",
                      color: "#6c5948",
                      fontSize: isMobile ? "12px" : "13px",
                      lineHeight: 1.75,
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
                width: isMobile ? "42px" : undefined,
                padding: isMobile ? 0 : pillBaseStyle.padding,
                gap: isMobile ? "0" : "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.background = "rgba(247, 239, 229, 0.92)";
                e.currentTarget.style.borderColor = "#b89f84";
                e.currentTarget.style.boxShadow =
                  "0 8px 18px rgba(90, 70, 40, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "rgba(255, 250, 244, 0.74)";
                e.currentTarget.style.borderColor = "#c8b197";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(90, 70, 40, 0.02)";
              }}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
              {!isMobile && <span>{uiText.menu[language]}</span>}
            </button>

            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: isMobile ? "50px" : "58px",
                  right: 0,
                  width: isMobile
                    ? "min(320px, calc(100vw - 20px))"
                    : "min(360px, calc(100vw - 24px))",
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
                          gridTemplateColumns: isMobile ? "1fr 48px" : "1fr 56px",
                          alignItems: "center",
                          gap: "14px",
                          padding: isMobile ? "13px" : "16px",
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
                              fontSize: isMobile ? "16px" : "18px",
                              fontWeight: 700,
                              lineHeight: 1.35,
                              color: "#2f2419",
                              marginBottom: "6px",
                            }}
                          >
                            {item.title[language]}
                          </div>

                          <div
                            style={{
                              fontSize: isMobile ? "12px" : "13px",
                              lineHeight: 1.75,
                              color: "#6c5948",
                            }}
                          >
                            {item.description[language]}
                          </div>
                        </div>

                        <div
                          style={{
                            width: isMobile ? "48px" : "56px",
                            height: isMobile ? "48px" : "56px",
                            borderRadius: "16px",
                            background: "#eadfce",
                            border: "1px solid #dcc8b0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            alignSelf: "start",
                          }}
                        >
                          <Icon size={isMobile ? 20 : 22} strokeWidth={1.9} color="#3d3126" />
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
  );
}