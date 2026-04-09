"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Info,
  Link2,
  MessageCircleQuestion,
} from "lucide-react";
import Header from "@/components/Header";
import CartPopup from "@/components/CartPopup";
import { categories } from "@/data/categories";
import {
  getGuideById,
  getGuideSmartInternalLinks,
  getGuideRelatedCategoryIds,
  getLocalizedGuideText,
  type GuideFaqItem,
} from "@/data/guides";
import { getServicesByCategory } from "@/data/services";
import { useLanguage } from "@/lib/languageContext";

type LocalizedBlock = {
  ar: string;
  de: string;
  en: string;
};

type CategorySupport = {
  helperTitle: LocalizedBlock;
  helperText: LocalizedBlock;
  voiceHint: LocalizedBlock;
};

const categorySupportMap: Record<string, CategorySupport> = {
  smart: {
    helperTitle: {
      ar: "ابدأ حتى لو لم تكن متأكدًا",
      de: "Starte auch dann, wenn du noch unsicher bist",
      en: "Start even if you are not fully sure",
    },
    helperText: {
      ar: "هذه الفئة مناسبة إذا كنت تعرف ما تريد بشكل عام، لكنك لا تعرف اسم الخدمة الدقيقة بعد.",
      de: "Diese Kategorie ist passend, wenn du grundsätzlich weißt, was du brauchst, aber die genaue Leistung noch nicht kennst.",
      en: "This category is suitable if you generally know what you need, but do not yet know the exact service name.",
    },
    voiceHint: {
      ar: "مثال: أريد شيئًا لمشروع جديد لكنني لست متأكدًا من الاسم الصحيح",
      de: "Beispiel: Ich brauche etwas für ein neues Projekt, bin aber beim genauen Namen nicht sicher",
      en: "Example: I need something for a new project, but I am not sure about the exact service name",
    },
  },
  signage: {
    helperTitle: {
      ar: "فئة اللوحات والواجهات",
      de: "Kategorie für Schilder und Fassaden",
      en: "Category for signs and facades",
    },
    helperText: {
      ar: "هذه الفئة مخصصة للوحات، الواجهات، الحروف البارزة، والإضاءات التجارية.",
      de: "Diese Kategorie ist für Schilder, Fassaden, Profilbuchstaben und Lichtwerbung.",
      en: "This category is for signs, facades, raised letters, and illuminated solutions.",
    },
    voiceHint: {
      ar: "مثال: أريد لوحة مضيئة أو واجهة محل",
      de: "Beispiel: Ich brauche ein beleuchtetes Schild oder eine Ladenfassade",
      en: "Example: I need an illuminated sign or a shop facade",
    },
  },
  surfaces: {
    helperTitle: {
      ar: "فئة الزجاج واللصق",
      de: "Kategorie für Glas und Folierung",
      en: "Category for glass and surface graphics",
    },
    helperText: {
      ar: "هذه الفئة مناسبة للزجاج، الفروستد، ون واي فيجن، والستيكرات على الأسطح.",
      de: "Diese Kategorie passt zu Glas, Milchglasfolie, One-Way-Vision und Folierungen auf Flächen.",
      en: "This category fits glass, frosted films, one-way vision, and adhesive graphics on surfaces.",
    },
    voiceHint: {
      ar: "مثال: أريد فروستد أو ستيكر على الزجاج",
      de: "Beispiel: Ich brauche Milchglasfolie oder Sticker auf Glas",
      en: "Example: I need frosted film or sticker on glass",
    },
  },
  vehicle: {
    helperTitle: {
      ar: "فئة المركبات",
      de: "Kategorie für Fahrzeuge",
      en: "Category for vehicles",
    },
    helperText: {
      ar: "هذه الفئة مناسبة لتغليف المركبات، كتابة الشعارات، وتجهيز سيارات الشركات.",
      de: "Diese Kategorie passt für Fahrzeugfolierung, Logos und Branding auf Firmenfahrzeugen.",
      en: "This category is suitable for vehicle wraps, logos, and company vehicle branding.",
    },
    voiceHint: {
      ar: "مثال: أريد كتابة شعار على فان الشركة",
      de: "Beispiel: Ich möchte mein Firmenlogo auf einen Firmenvan kleben",
      en: "Example: I want to place my company logo on a company van",
    },
  },
  printing: {
    helperTitle: {
      ar: "فئة المطبوعات",
      de: "Kategorie für Drucksachen",
      en: "Category for printed products",
    },
    helperText: {
      ar: "هذه الفئة للمطبوعات الورقية مثل البطاقات، الفلايرات، المنيوهات، والبروشورات.",
      de: "Diese Kategorie ist für Papierdrucksachen wie Karten, Flyer, Speisekarten und Broschüren.",
      en: "This category is for printed paper products such as cards, flyers, menus, and brochures.",
    },
    voiceHint: {
      ar: "مثال: أريد بزنس كارد أو فلاير أو منيو",
      de: "Beispiel: Ich brauche Visitenkarten oder Flyer oder eine Speisekarte",
      en: "Example: I need business cards or flyers or a menu",
    },
  },
  packaging: {
    helperTitle: {
      ar: "فئة التغليف والملصقات",
      de: "Kategorie für Verpackung und Etiketten",
      en: "Category for packaging and labels",
    },
    helperText: {
      ar: "هذه الفئة مناسبة للتغليف، العلب، الأكياس، وملصقات المنتجات.",
      de: "Diese Kategorie passt zu Verpackung, Boxen, Taschen und Produktetiketten.",
      en: "This category is suitable for packaging, boxes, bags, and product labels.",
    },
    voiceHint: {
      ar: "مثال: أريد علبة أو ملصق لمنتج",
      de: "Beispiel: Ich brauche eine Box oder ein Etikett für ein Produkt",
      en: "Example: I need a box or label for a product",
    },
  },
  textile: {
    helperTitle: {
      ar: "فئة الملابس والهدايا",
      de: "Kategorie für Textil und Werbeartikel",
      en: "Category for textile and promotional items",
    },
    helperText: {
      ar: "هذه الفئة مناسبة لطباعة الملابس والهدايا الدعائية مثل الأكواب والقبعات.",
      de: "Diese Kategorie passt für Textildruck und Werbeartikel wie Tassen und Caps.",
      en: "This category is suitable for textile printing and promotional items such as mugs and caps.",
    },
    voiceHint: {
      ar: "مثال: أريد تيشيرتات أو هدايا دعائية للشركة",
      de: "Beispiel: Ich brauche T-Shirts oder Werbeartikel für meine Firma",
      en: "Example: I need t-shirts or promotional items for my company",
    },
  },
  display: {
    helperTitle: {
      ar: "فئة العرض والفعاليات",
      de: "Kategorie für Display und Events",
      en: "Category for display and events",
    },
    helperText: {
      ar: "هذه الفئة مناسبة للرول أب، الستاندات، وخلفيات التصوير والفعاليات.",
      de: "Diese Kategorie passt für Roll-ups, Displays, Fotowände und Eventmaterial.",
      en: "This category is suitable for roll-ups, stands, backdrops, and event material.",
    },
    voiceHint: {
      ar: "مثال: أريد رول أب أو ستاند لمعرض",
      de: "Beispiel: Ich brauche ein Roll-up oder Display für eine Messe",
      en: "Example: I need a roll-up or stand for an exhibition",
    },
  },
  branding: {
    helperTitle: {
      ar: "فئة الهوية والتصميم",
      de: "Kategorie für Branding und Design",
      en: "Category for branding and design",
    },
    helperText: {
      ar: "هذه الفئة مناسبة للشعار، الهوية البصرية، وبناء الشكل العام للمشروع.",
      de: "Diese Kategorie passt für Logo, visuelle Identität und das Gesamtbild des Projekts.",
      en: "This category is suitable for logo design, visual identity, and the overall look of the project.",
    },
    voiceHint: {
      ar: "مثال: أريد شعارًا وهوية بصرية لمشروعي",
      de: "Beispiel: Ich brauche ein Logo und Branding für mein Projekt",
      en: "Example: I need a logo and branding for my project",
    },
  },
  fabrication: {
    helperTitle: {
      ar: "فئة التصنيع الخاص",
      de: "Kategorie für Sonderanfertigung",
      en: "Category for custom fabrication",
    },
    helperText: {
      ar: "هذه الفئة مناسبة للتصنيع الخاص، القص CNC أو الليزر، والعناصر غير الجاهزة.",
      de: "Diese Kategorie passt für Sonderanfertigung, CNC- oder Laserschnitt und individuelle Teile.",
      en: "This category is suitable for custom fabrication, CNC or laser cutting, and non-standard parts.",
    },
    voiceHint: {
      ar: "مثال: أريد تصنيع قطعة خاصة أو قص CNC",
      de: "Beispiel: Ich brauche ein Sonderteil oder CNC-Schnitt",
      en: "Example: I need a custom piece or CNC cutting",
    },
  },
  marketing: {
    helperTitle: {
      ar: "فئة الحلول المتكاملة",
      de: "Kategorie für integrierte Lösungen",
      en: "Category for complete solutions",
    },
    helperText: {
      ar: "هذه الفئة مناسبة إذا كنت تريد مسارًا متكاملًا من الفكرة حتى الظهور.",
      de: "Diese Kategorie ist passend, wenn du einen integrierten Weg vom Konzept bis zur Sichtbarkeit brauchst.",
      en: "This category is suitable if you need an integrated path from concept to visibility.",
    },
    voiceHint: {
      ar: "مثال: أريد حلًا متكاملًا لمشروعي",
      de: "Beispiel: Ich brauche eine komplette Lösung für mein Projekt",
      en: "Example: I need a complete solution for my project",
    },
  },
};

function getLocalizedValue(
  value: { ar?: string; de?: string; en?: string } | undefined,
  language: "ar" | "de" | "en",
  fallback = ""
) {
  if (!value) return fallback;
  return value[language] || value.en || value.de || value.ar || fallback;
}

function getCategoryHref(id: string) {
  return `/request/category/${id}`;
}

function getServicePreviewSources(serviceId: string) {
  return [`/services/${serviceId}.webp`, `/services/${serviceId}.jpg`];
}

function ServicePreview({
  serviceId,
  title,
}: {
  serviceId: string;
  title: string;
}) {
  const sources = getServicePreviewSources(serviceId);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSourceIndex(0);
    setFailed(false);
  }, [serviceId]);

  if (failed) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, #f1e4d3 0%, #e7d6c2 50%, #dcc6ae 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "18px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#6f5a46",
            fontSize: "13px",
            fontWeight: 700,
            lineHeight: 1.6,
          }}
        >
          {title}
        </div>
      </div>
    );
  }

  return (
    <img
      src={sources[sourceIndex]}
      alt={title}
      onError={() => {
        if (sourceIndex < sources.length - 1) {
          setSourceIndex((prev) => prev + 1);
          return;
        }
        setFailed(true);
      }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
      }}
    />
  );
}

export default function CategoryPage() {
  const params = useParams();
  const categoryId = String(params?.id || params?.categoryId || "");

  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  const [isMobile, setIsMobile] = useState(false);
  const [showGuidePanel, setShowGuidePanel] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth <= 820);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const category = categories.find((item) => item.id === categoryId) || null;
  const categoryServices = category ? getServicesByCategory(category.id) : [];
  const hasServices = categoryServices.length > 0;
  const guide = getGuideById(categoryId);

  const text = {
    fallbackTitle:
      language === "ar"
        ? "الفئة غير موجودة"
        : language === "de"
          ? "Kategorie nicht gefunden"
          : "Category not found",

    fallbackDescription:
      language === "ar"
        ? "تعذر العثور على هذه الفئة. يمكنك الرجوع واختيار فئة أخرى."
        : language === "de"
          ? "Diese Kategorie wurde nicht gefunden. Bitte gehe zurück und wähle eine andere Kategorie."
          : "This category could not be found. Please go back and choose another category.",

    backToCategories:
      language === "ar"
        ? "العودة إلى الفئات"
        : language === "de"
          ? "Zurück zu den Kategorien"
          : "Back to categories",

    emptyServices:
      language === "ar"
        ? "لا توجد خدمات مباشرة بعد"
        : language === "de"
          ? "Noch keine direkten Leistungen"
          : "No direct services yet",

    emptyServicesHelper:
      language === "ar"
        ? "ابدأ من الطلب الذكي إذا لم تكن الخدمة المناسبة ظاهرة هنا بعد."
        : language === "de"
          ? "Starte mit der smarten Anfrage, wenn die passende Leistung hier noch nicht sichtbar ist."
          : "Start with the smart request if the right service is not visible here yet.",

    startSmartRequest:
      language === "ar"
        ? "ابدأ الطلب الذكي"
        : language === "de"
          ? "Smarte Anfrage starten"
          : "Start smart request",

    openService:
      language === "ar"
        ? "دخول"
        : language === "de"
          ? "Öffnen"
          : "Open",

    categoryGuide:
      language === "ar"
        ? "تفاصيل إضافية"
        : language === "de"
          ? "Zusätzliche Details"
          : "Additional details",

    voiceSearchTitle:
      language === "ar"
        ? "أمثلة بحث"
        : language === "de"
          ? "Suchbeispiele"
          : "Search examples",

    faqTitle:
      language === "ar"
        ? "أسئلة شائعة"
        : language === "de"
          ? "Häufige Fragen"
          : "Frequently Asked Questions",

    relatedCategoriesTitle:
      language === "ar"
        ? "فئات مرتبطة"
        : language === "de"
          ? "Verwandte Kategorien"
          : "Related Categories",

    quickLinksTitle:
      language === "ar"
        ? "روابط مفيدة"
        : language === "de"
          ? "Hilfreiche Links"
          : "Useful Links",

    noGuideLinks:
      language === "ar"
        ? "لا توجد روابط إضافية حاليًا."
        : language === "de"
          ? "Derzeit keine zusätzlichen Links."
          : "No additional links available at the moment.",

    browseCategories:
      language === "ar"
        ? "كل الفئات"
        : language === "de"
          ? "Alle Kategorien"
          : "All categories",
  };

  const localizedCategoryTitle = getLocalizedValue(
    category?.title,
    language,
    categoryId
  );

  const categorySupport = category ? categorySupportMap[category.id] : null;

  const helperTitle =
    getLocalizedGuideText(guide?.title, language, "") ||
    (categorySupport ? categorySupport.helperTitle[language] : localizedCategoryTitle);

  const helperSummary =
    getLocalizedGuideText(guide?.summary, language, "") ||
    (categorySupport ? categorySupport.helperText[language] : "");

  const helperExpanded =
    getLocalizedGuideText(guide?.expandedGuide, language, "") || helperSummary;

  const voiceQueries =
    guide?.voiceQueries
      ?.map((item) => getLocalizedGuideText(item, language))
      .filter(Boolean) ||
    (categorySupport ? [categorySupport.voiceHint[language]] : []);

  const faqItems: GuideFaqItem[] = guide?.faq || [];

  const relatedCategoryItems = useMemo(() => {
    const ids = guide ? getGuideRelatedCategoryIds(categoryId) : [];
    return ids
      .map((id) => categories.find((item) => item.id === id))
      .filter(Boolean);
  }, [guide, categoryId]);

  const smartGuideLinks = useMemo(
    () =>
      guide
        ? getGuideSmartInternalLinks(categoryId, {
            limit: 8,
            prioritizeGuides: true,
          })
        : [],
    [guide, categoryId]
  );

  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f7f1e8 0%, #f2e9de 100%)",
      padding: "0 12px 72px",
      fontFamily: "Arial, sans-serif",
    },

    container: {
      maxWidth: "1180px",
      margin: "14px auto 0",
      display: "grid",
      gap: "16px",
    },

    hero: {
      padding: "8px 4px 0",
      display: "grid",
      gap: "6px",
      textAlign: isArabic ? "right" : "left",
    },

    title: {
      margin: 0,
      fontSize: "clamp(24px, 5vw, 38px)",
      lineHeight: 1.08,
      color: "#2f2419",
      fontWeight: 800,
      letterSpacing: "-0.02em",
      textWrap: "balance",
    },

    section: {
      display: "grid",
      gap: "14px",
    },

    emptyBox: {
      border: "1px dashed #d9c4ab",
      borderRadius: "20px",
      padding: "18px",
      color: "#6f5b48",
      background: "#fffaf4",
      fontSize: "13px",
      lineHeight: 1.7,
      textAlign: isArabic ? "right" : "left",
      display: "grid",
      gap: "12px",
    },

    emptyTitle: {
      margin: 0,
      fontSize: "15px",
      lineHeight: 1.5,
      fontWeight: 800,
      color: "#3b2d21",
    },

    emptyText: {
      margin: 0,
      color: "#6a5642",
      lineHeight: 1.8,
      fontSize: "13px",
    },

    emptyActions: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "flex-start",
    },

    smartButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      minHeight: "44px",
      padding: "0 18px",
      borderRadius: "999px",
      border: "1px solid #2f2419",
      background: "#2f2419",
      color: "#ffffff",
      fontSize: "13px",
      fontWeight: 800,
      textDecoration: "none",
    },

    ghostButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      minHeight: "44px",
      padding: "0 18px",
      borderRadius: "999px",
      border: "1px solid #d7c3ad",
      background: "#fffaf5",
      color: "#3c2f24",
      fontSize: "13px",
      fontWeight: 800,
      textDecoration: "none",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "14px",
    },

    card: {
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
      borderRadius: "24px",
      border: "1px solid #ddcbb7",
      background: "#fffaf5",
      textDecoration: "none",
      color: "#2f2419",
      boxShadow: "0 8px 20px rgba(90, 70, 40, 0.05)",
      overflow: "hidden",
      transition:
        "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
    },

    imageWrap: {
      position: "relative",
      height: "220px",
      overflow: "hidden",
      backgroundColor: "#efe5d8",
    },

    imageOverlay: {
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.52) 100%)",
      zIndex: 1,
    },

    imageTitleWrap: {
      position: "absolute",
      left: "16px",
      right: "16px",
      bottom: "16px",
      zIndex: 2,
      display: "grid",
      gap: "6px",
    },

    imageTitle: {
      margin: 0,
      fontSize: "20px",
      lineHeight: 1.2,
      fontWeight: 800,
      color: "#ffffff",
      textAlign: isArabic ? "right" : "left",
      textShadow: "0 3px 10px rgba(0,0,0,0.28)",
      textWrap: "balance",
    },

    content: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      minWidth: 0,
      padding: "14px 16px",
    },

    footerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "10px",
      flexWrap: "wrap",
    },

    openPill: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      minHeight: "36px",
      padding: "0 14px",
      borderRadius: "999px",
      border: "1px solid #d7c2aa",
      background: "#f7ede1",
      color: "#4b3a2b",
      fontSize: "12px",
      fontWeight: 800,
      textDecoration: "none",
    },

    softPanel: {
      marginTop: "6px",
      background: "rgba(255,255,255,0.82)",
      border: "1px solid #e7d9c8",
      borderRadius: "22px",
      padding: "18px 16px",
      boxShadow: "0 6px 20px rgba(90, 70, 40, 0.05)",
      display: "grid",
      gap: "14px",
    },

    quietRow: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      alignItems: "center",
    },

    softButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      minHeight: "40px",
      padding: "0 16px",
      borderRadius: "999px",
      border: "1px solid #d7c3ad",
      background: "#fffaf5",
      color: "#3c2f24",
      textDecoration: "none",
      fontSize: "13px",
      fontWeight: 800,
      cursor: "pointer",
      transition:
        "background 0.18s ease, border-color 0.18s ease, transform 0.18s ease",
    },

    helperPanel: {
      background: "#fffaf5",
      border: "1px solid #e5d6c5",
      borderRadius: "18px",
      padding: "14px",
      display: "grid",
      gap: "14px",
    },

    helperTitle: {
      margin: 0,
      fontSize: "17px",
      lineHeight: 1.3,
      color: "#35281d",
      fontWeight: 800,
      textAlign: isArabic ? "right" : "left",
    },

    helperText: {
      margin: 0,
      color: "#665240",
      lineHeight: 1.8,
      fontSize: "13px",
      textAlign: isArabic ? "right" : "left",
      maxWidth: "860px",
    },

    voiceHint: {
      padding: "12px 14px",
      borderRadius: "14px",
      border: "1px solid #e1d0be",
      background: "#f7ede1",
      color: "#735f4b",
      fontSize: "12px",
      lineHeight: 1.75,
      textAlign: isArabic ? "right" : "left",
    },

    voiceList: {
      margin: "8px 0 0",
      paddingInlineStart: "18px",
      display: "grid",
      gap: "6px",
    },

    voiceListItem: {
      color: "#5b4b3c",
    },

    guideGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
      gap: "12px",
    },

    guideCard: {
      borderRadius: "16px",
      border: "1px solid #e2d3c0",
      background: "#fff",
      padding: "14px",
      display: "grid",
      gap: "10px",
    },

    smallTitle: {
      margin: 0,
      fontSize: "14px",
      fontWeight: 800,
      color: "#35281d",
      textAlign: isArabic ? "right" : "left",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },

    pillsWrap: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
    },

    helperPillLink: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "34px",
      padding: "0 12px",
      borderRadius: "999px",
      border: "1px solid #d9c6b2",
      background: "#fff",
      color: "#3f3125",
      textDecoration: "none",
      fontSize: "12px",
      fontWeight: 700,
    },

    faqWrap: {
      display: "grid",
      gap: "10px",
    },

    faqItem: {
      border: "1px solid #e3d4c2",
      borderRadius: "16px",
      background: "#fff",
      overflow: "hidden",
    },

    faqButton: {
      width: "100%",
      border: "none",
      background: "transparent",
      padding: "14px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "10px",
      color: "#2f2419",
      fontWeight: 800,
      fontSize: "13px",
      textAlign: isArabic ? "right" : "left",
    },

    faqAnswer: {
      padding: "0 14px 14px",
      color: "#665240",
      fontSize: "13px",
      lineHeight: 1.8,
      textAlign: isArabic ? "right" : "left",
    },

    fallbackActionRow: {
      marginTop: "14px",
      display: "flex",
      justifyContent: isArabic ? "flex-start" : "flex-end",
    },

    fallbackButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "42px",
      padding: "0 16px",
      borderRadius: "14px",
      border: "1px solid #2f2419",
      background: "#2f2419",
      color: "#ffffff",
      textDecoration: "none",
      fontSize: "13px",
      fontWeight: 800,
    },
  };

  if (!category) {
    return (
      <div dir={dir} style={styles.page}>
        <Header showBackButton showBackHome backHref="/request" />

        <div style={styles.container}>
          <section style={styles.hero}>
            <h1 style={styles.title}>{text.fallbackTitle}</h1>
            <div style={styles.fallbackActionRow}>
              <Link href="/request" style={styles.fallbackButton}>
                {text.backToCategories}
              </Link>
            </div>
          </section>

          <CartPopup lang={language} />
        </div>
      </div>
    );
  }

  return (
    <div dir={dir} style={styles.page}>
      <Header showBackButton showBackHome backHref="/request" />

      <div style={styles.container}>
        <section style={styles.hero}>
          <h1 style={styles.title}>{localizedCategoryTitle}</h1>
        </section>

        <section style={styles.section}>
          {!hasServices ? (
            <div style={styles.emptyBox}>
              <h3 style={styles.emptyTitle}>{text.emptyServices}</h3>
              <p style={styles.emptyText}>{text.emptyServicesHelper}</p>

              <div style={styles.emptyActions}>
                <Link href="/request/category/smart" style={styles.smartButton}>
                  {text.startSmartRequest}
                  <ArrowUpRight size={15} />
                </Link>

                <Link href="/request" style={styles.ghostButton}>
                  {text.browseCategories}
                </Link>
              </div>
            </div>
          ) : (
            <div style={styles.grid}>
              {categoryServices.map((service) => {
                const localizedServiceTitle = getLocalizedValue(
                  service.title,
                  language,
                  service.id
                );

                return (
                  <Link
                    key={`${service.category}-${service.id}`}
                    href={`/request/service/${service.id}`}
                    style={styles.card}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow =
                        "0 16px 30px rgba(90, 70, 40, 0.12)";
                      e.currentTarget.style.borderColor = "#cfb79a";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 20px rgba(90, 70, 40, 0.05)";
                      e.currentTarget.style.borderColor = "#ddcbb7";
                    }}
                  >
                    <div style={styles.imageWrap}>
                      <ServicePreview
                        serviceId={service.id}
                        title={localizedServiceTitle}
                      />
                      <div style={styles.imageOverlay} />

                      <div style={styles.imageTitleWrap}>
                        <h2 style={styles.imageTitle}>{localizedServiceTitle}</h2>
                      </div>
                    </div>

                    <div style={styles.content}>
                      <div style={styles.footerRow}>
                        <span style={styles.openPill}>
                          {text.openService}
                          <ArrowUpRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section style={styles.softPanel}>
          <div style={styles.quietRow}>
            <button
              type="button"
              style={styles.softButton}
              onClick={() => setShowGuidePanel((prev) => !prev)}
              aria-expanded={showGuidePanel}
            >
              <Info size={16} />
              <span>{text.categoryGuide}</span>
              <ChevronDown
                size={16}
                style={{
                  transform: showGuidePanel ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.18s ease",
                }}
              />
            </button>

            <Link href="/request" style={styles.softButton}>
              <span>{text.browseCategories}</span>
            </Link>
          </div>

          {showGuidePanel ? (
            <section style={styles.helperPanel}>
              <div>
                <h2 style={styles.helperTitle}>{helperTitle}</h2>
                {helperSummary ? (
                  <p style={styles.helperText}>{helperSummary}</p>
                ) : null}
              </div>

              {(helperExpanded || voiceQueries.length > 0) ? (
                <div style={styles.voiceHint}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      fontWeight: 800,
                      marginBottom: "6px",
                    }}
                  >
                    <Info size={14} />
                    <span>{text.voiceSearchTitle}</span>
                  </div>

                  {helperExpanded ? <p style={{ margin: 0 }}>{helperExpanded}</p> : null}

                  {voiceQueries.length > 0 ? (
                    <ul style={styles.voiceList}>
                      {voiceQueries.map((query, index) => (
                        <li key={`${query}-${index}`} style={styles.voiceListItem}>
                          {query}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}

              <div style={styles.guideGrid}>
                <div style={styles.guideCard}>
                  <h3 style={styles.smallTitle}>
                    <Link2 size={15} />
                    <span>{text.quickLinksTitle}</span>
                  </h3>

                  {smartGuideLinks.length > 0 ? (
                    <div style={styles.pillsWrap}>
                      {smartGuideLinks.map((item, index) => (
                        <Link
                          key={`${item.href}-${index}`}
                          href={item.href}
                          style={styles.helperPillLink}
                        >
                          {getLocalizedGuideText(item.label, language, item.href)}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p style={styles.helperText}>{text.noGuideLinks}</p>
                  )}
                </div>

                {relatedCategoryItems.length > 0 ? (
                  <div style={styles.guideCard}>
                    <h3 style={styles.smallTitle}>
                      <Link2 size={15} />
                      <span>{text.relatedCategoriesTitle}</span>
                    </h3>

                    <div style={styles.pillsWrap}>
                      {relatedCategoryItems.map((item) => (
                        <Link
                          key={item!.id}
                          href={getCategoryHref(item!.id)}
                          style={styles.helperPillLink}
                        >
                          {getLocalizedValue(item!.title, language, item!.id)}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {faqItems.length > 0 ? (
                <div style={styles.faqWrap}>
                  <h3 style={styles.smallTitle}>
                    <MessageCircleQuestion size={15} />
                    <span>{text.faqTitle}</span>
                  </h3>

                  {faqItems.map((item, index) => {
                    const isOpen = openFaqIndex === index;
                    return (
                      <div key={index} style={styles.faqItem}>
                        <button
                          type="button"
                          style={styles.faqButton}
                          onClick={() =>
                            setOpenFaqIndex((prev) => (prev === index ? null : index))
                          }
                          aria-expanded={isOpen}
                        >
                          <span>
                            {getLocalizedGuideText(item.question, language, "")}
                          </span>
                          <ChevronDown
                            size={16}
                            style={{
                              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                              transition: "transform 0.18s ease",
                              flexShrink: 0,
                            }}
                          />
                        </button>

                        {isOpen ? (
                          <div style={styles.faqAnswer}>
                            {getLocalizedGuideText(item.answer, language, "")}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </section>
          ) : null}
        </section>

        <CartPopup lang={language} />
      </div>
    </div>
  );
}