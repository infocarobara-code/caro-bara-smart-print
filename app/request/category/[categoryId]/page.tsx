"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { CSSProperties } from "react";
import {
  Wrench,
  Flag,
  ScanLine,
  Store,
  Package,
  Shirt,
  Palette,
  Printer,
  LayoutGrid,
  Hammer,
  PenTool,
  FileText,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import Header from "@/components/Header";
import CartPopup from "@/components/CartPopup";
import { categories } from "@/data/categories";
import { getServicesByCategory } from "@/data/services/index";
import { useLanguage } from "@/lib/languageContext";

type SimpleService = {
  id: string;
  category?: string;
  title?: { ar?: string; de?: string; en?: string };
  description?: { ar?: string; de?: string; en?: string };
  intro?: { ar?: string; de?: string; en?: string };
  requestGuidance?: Array<{ ar?: string; de?: string; en?: string }>;
};

type IconComponent = typeof Store;

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
      ar: "هذه الفئة مناسبة إذا كنت تعرف ما تريد بشكل عام، لكنك لا تعرف اسم الخدمة الدقيقة بعد. هنا يبدأ المسار الذكي.",
      de: "Diese Kategorie ist passend, wenn du grundsätzlich weißt, was du brauchst, aber die genaue Leistung noch nicht kennst. Hier beginnt der smarte Weg.",
      en: "This category is suitable if you generally know what you need, but do not yet know the exact service name. This is where the smart path begins.",
    },
    voiceHint: {
      ar: "مثال بحث طبيعي: أريد شيئًا لمشروع جديد لكنني لست متأكدًا من الاسم الصحيح",
      de: "Natürliches Suchbeispiel: Ich brauche etwas für ein neues Projekt, bin aber beim genauen Namen nicht sicher",
      en: "Natural search example: I need something for a new project, but I am not sure about the exact service name",
    },
  },
  signage: {
    helperTitle: {
      ar: "فئة اللوحات والواجهات",
      de: "Kategorie für Schilder und Fassaden",
      en: "Category for signs and facades",
    },
    helperText: {
      ar: "اختر هذه الفئة إذا كان طلبك متعلقًا بلوحة، واجهة، حروف بارزة، إضاءة، أو عنصر بصري ثابت للمحل أو المشروع.",
      de: "Wähle diese Kategorie, wenn deine Anfrage ein Schild, eine Fassade, Profilbuchstaben, Beleuchtung oder ein festes visuelles Element für dein Geschäft betrifft.",
      en: "Choose this category if your request is related to a sign, facade, raised letters, lighting, or a fixed visual element for your shop or business.",
    },
    voiceHint: {
      ar: "مثال بحث طبيعي: أريد لوحة مضيئة أو واجهة محل",
      de: "Natürliches Suchbeispiel: Ich brauche ein beleuchtetes Schild oder eine Ladenfassade",
      en: "Natural search example: I need an illuminated sign or a shop facade",
    },
  },
  surfaces: {
    helperTitle: {
      ar: "فئة الزجاج واللصق",
      de: "Kategorie für Glas und Folierung",
      en: "Category for glass and surface graphics",
    },
    helperText: {
      ar: "اختر هذه الفئة إذا كان طلبك متعلقًا بزجاج، ستيكر، فروستد، ون واي فيجن، أو تغطية سطح داخلي أو خارجي.",
      de: "Wähle diese Kategorie, wenn deine Anfrage Glas, Sticker, Milchglasfolie, One-Way-Vision oder die Beklebung einer Innen- oder Außenfläche betrifft.",
      en: "Choose this category if your request concerns glass, stickers, frosted film, one-way vision, or covering an indoor or outdoor surface.",
    },
    voiceHint: {
      ar: "مثال بحث طبيعي: أريد فروستد أو ستيكر على الزجاج",
      de: "Natürliches Suchbeispiel: Ich brauche Milchglasfolie oder Sticker auf Glas",
      en: "Natural search example: I need frosted film or sticker on glass",
    },
  },
  vehicle: {
    helperTitle: {
      ar: "فئة المركبات",
      de: "Kategorie für Fahrzeuge",
      en: "Category for vehicles",
    },
    helperText: {
      ar: "اختر هذه الفئة إذا كنت تريد تغليف مركبة، كتابة شعار عليها، أو تجهيز أسطول شركات بطريقة بصرية احترافية.",
      de: "Wähle diese Kategorie, wenn du ein Fahrzeug folieren, mit einem Logo beschriften oder eine professionelle visuelle Lösung für eine Firmenflotte brauchst.",
      en: "Choose this category if you want to wrap a vehicle, add branding to it, or prepare a company fleet with a professional visual solution.",
    },
    voiceHint: {
      ar: "مثال بحث طبيعي: أريد كتابة شعار على فان الشركة",
      de: "Natürliches Suchbeispiel: Ich möchte mein Firmenlogo auf einen Firmenvan kleben",
      en: "Natural search example: I want to place my company logo on a company van",
    },
  },
  printing: {
    helperTitle: {
      ar: "فئة المطبوعات",
      de: "Kategorie für Drucksachen",
      en: "Category for printed products",
    },
    helperText: {
      ar: "اختر هذه الفئة إذا كان طلبك متعلقًا بمطبوعات ورقية مثل البطاقات، الفلايرات، المنيوهات، البروشورات أو الأوراق الرسمية.",
      de: "Wähle diese Kategorie, wenn deine Anfrage Papierdrucksachen wie Karten, Flyer, Speisekarten, Broschüren oder Geschäftsdrucksachen betrifft.",
      en: "Choose this category if your request is related to printed paper products such as cards, flyers, menus, brochures, or formal office stationery.",
    },
    voiceHint: {
      ar: "مثال بحث طبيعي: أريد بزنس كارد أو فلاير أو منيو",
      de: "Natürliches Suchbeispiel: Ich brauche Visitenkarten oder Flyer oder eine Speisekarte",
      en: "Natural search example: I need business cards or flyers or a menu",
    },
  },
  packaging: {
    helperTitle: {
      ar: "فئة التغليف والملصقات",
      de: "Kategorie für Verpackung und Etiketten",
      en: "Category for packaging and labels",
    },
    helperText: {
      ar: "اختر هذه الفئة إذا كان طلبك يتعلق بالتغليف، العلب، الأكياس، أو ملصقات المنتجات والعلامة التجارية.",
      de: "Wähle diese Kategorie, wenn deine Anfrage Verpackung, Boxen, Taschen oder Produktetiketten und Branding betrifft.",
      en: "Choose this category if your request concerns packaging, boxes, bags, or product labels and brand presentation.",
    },
    voiceHint: {
      ar: "مثال بحث طبيعي: أريد علبة أو ملصق لمنتج",
      de: "Natürliches Suchbeispiel: Ich brauche eine Box oder ein Etikett für ein Produkt",
      en: "Natural search example: I need a box or label for a product",
    },
  },
  textile: {
    helperTitle: {
      ar: "فئة الملابس والهدايا",
      de: "Kategorie für Textil und Werbeartikel",
      en: "Category for textile and promotional items",
    },
    helperText: {
      ar: "اختر هذه الفئة إذا كان طلبك متعلقًا بطباعة الملابس أو المنتجات الدعائية مثل الأكواب والقبعات والهدايا.",
      de: "Wähle diese Kategorie, wenn deine Anfrage Textildruck oder Werbeartikel wie Tassen, Caps oder Giveaways betrifft.",
      en: "Choose this category if your request is related to textile printing or promotional items such as mugs, caps, and giveaways.",
    },
    voiceHint: {
      ar: "مثال بحث طبيعي: أريد تيشيرتات أو هدايا دعائية للشركة",
      de: "Natürliches Suchbeispiel: Ich brauche T-Shirts oder Werbeartikel für meine Firma",
      en: "Natural search example: I need t-shirts or promotional items for my company",
    },
  },
  display: {
    helperTitle: {
      ar: "فئة العرض والفعاليات",
      de: "Kategorie für Display und Events",
      en: "Category for display and events",
    },
    helperText: {
      ar: "اختر هذه الفئة إذا كنت تحتاج رول أب، ستاندات، خلفيات تصوير، أو عناصر عرض لمعرض أو فعالية أو افتتاح.",
      de: "Wähle diese Kategorie, wenn du Roll-ups, Displays, Fotowände oder Präsentationselemente für eine Messe, ein Event oder eine Eröffnung brauchst.",
      en: "Choose this category if you need roll-ups, stands, photo backdrops, or presentation elements for an exhibition, event, or opening.",
    },
    voiceHint: {
      ar: "مثال بحث طبيعي: أريد رول أب أو ستاند لمعرض",
      de: "Natürliches Suchbeispiel: Ich brauche ein Roll-up oder Display für eine Messe",
      en: "Natural search example: I need a roll-up or stand for an exhibition",
    },
  },
  branding: {
    helperTitle: {
      ar: "فئة الهوية والتصميم",
      de: "Kategorie für Branding und Design",
      en: "Category for branding and design",
    },
    helperText: {
      ar: "اختر هذه الفئة إذا كنت تبحث عن شعار، هوية بصرية، أو تصميم يبني صورة المشروع بشكل متكامل.",
      de: "Wähle diese Kategorie, wenn du ein Logo, eine visuelle Identität oder ein Design suchst, das das Gesamtbild deines Projekts aufbaut.",
      en: "Choose this category if you are looking for a logo, visual identity, or design that builds the complete image of your project.",
    },
    voiceHint: {
      ar: "مثال بحث طبيعي: أريد شعارًا وهوية بصرية لمشروعي",
      de: "Natürliches Suchbeispiel: Ich brauche ein Logo und Branding für mein Projekt",
      en: "Natural search example: I need a logo and branding for my project",
    },
  },
  fabrication: {
    helperTitle: {
      ar: "فئة التصنيع الخاص",
      de: "Kategorie für Sonderanfertigung",
      en: "Category for custom fabrication",
    },
    helperText: {
      ar: "اختر هذه الفئة إذا كان طلبك يحتاج تصنيعًا خاصًا، قص CNC أو ليزر، أو تنفيذ عنصر غير جاهز مسبقًا.",
      de: "Wähle diese Kategorie, wenn deine Anfrage eine Sonderanfertigung, CNC- oder Laserschnitt oder ein nicht standardisiertes Bauteil erfordert.",
      en: "Choose this category if your request needs custom fabrication, CNC or laser cutting, or a non-standard made-to-order element.",
    },
    voiceHint: {
      ar: "مثال بحث طبيعي: أريد تصنيع قطعة خاصة أو قص CNC",
      de: "Natürliches Suchbeispiel: Ich brauche ein Sonderteil oder CNC-Schnitt",
      en: "Natural search example: I need a custom piece or CNC cutting",
    },
  },
  marketing: {
    helperTitle: {
      ar: "فئة الحلول المتكاملة",
      de: "Kategorie für integrierte Lösungen",
      en: "Category for complete solutions",
    },
    helperText: {
      ar: "اختر هذه الفئة إذا كنت لا تريد خدمة منفردة فقط، بل تريد مسارًا متكاملًا للمشروع من الفكرة إلى الظهور.",
      de: "Wähle diese Kategorie, wenn du nicht nur eine einzelne Leistung, sondern einen integrierten Weg vom Konzept bis zur Sichtbarkeit möchtest.",
      en: "Choose this category if you do not want just one isolated service, but an integrated project path from concept to visibility.",
    },
    voiceHint: {
      ar: "مثال بحث طبيعي: أريد حلًا متكاملًا لمشروعي",
      de: "Natürliches Suchbeispiel: Ich brauche eine komplette Lösung für mein Projekt",
      en: "Natural search example: I need a complete solution for my project",
    },
  },
};

function getLocalizedValue(
  value:
    | { ar?: string; de?: string; en?: string }
    | undefined,
  language: "ar" | "de" | "en",
  fallback = ""
) {
  if (!value) return fallback;
  return value[language] || value.en || value.de || value.ar || fallback;
}

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[&/,_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsAny(source: string, keywords: string[]) {
  return keywords.some((keyword) => source.includes(keyword));
}

function getServiceSearchText(service: SimpleService) {
  return normalizeSearchText(
    [
      service.id,
      service.category || "",
      service.title?.ar || "",
      service.title?.de || "",
      service.title?.en || "",
      service.description?.ar || "",
      service.description?.de || "",
      service.description?.en || "",
      service.intro?.ar || "",
      service.intro?.de || "",
      service.intro?.en || "",
      ...(service.requestGuidance || []).flatMap((item) => [
        item.ar || "",
        item.de || "",
        item.en || "",
      ]),
    ].join(" ")
  );
}

function hashString(value: string) {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

function getSignageIcon(source: string, serviceId: string): IconComponent {
  if (
    containsAny(source, [
      "banner",
      "roll up",
      "rollup",
      "flag",
      "flags",
      "fahne",
      "fahnen",
      "messe",
      "event",
      "events",
      "فعاليات",
      "معارض",
      "bannerwerbung",
    ])
  ) {
    return Flag;
  }

  if (
    containsAny(source, [
      "window",
      "glass",
      "glazing",
      "folie",
      "folierung",
      "schaufenster",
      "glas",
      "زجاج",
      "واجهه زجاجيه",
      "نافذه",
    ])
  ) {
    return ScanLine;
  }

  if (
    containsAny(source, [
      "mount",
      "installation",
      "wartung",
      "maintenance",
      "repair",
      "demontage",
      "montage",
      "تركيب",
      "صيانه",
      "فك",
    ])
  ) {
    return Wrench;
  }

  if (
    containsAny(source, [
      "shop",
      "store",
      "shopfront",
      "fassade",
      "fassaden",
      "sign",
      "signage",
      "schild",
      "schilder",
      "licht",
      "light",
      "واجهه",
      "لوحه",
      "لوحات",
      "اضاءه",
      "متاجر",
      "letters",
      "buchstaben",
    ])
  ) {
    return Store;
  }

  const pool = [Store, Flag, ScanLine, Wrench];
  return pool[hashString(serviceId) % pool.length];
}

function getPrintingIcon(source: string, serviceId: string): IconComponent {
  if (
    containsAny(source, [
      "business card",
      "visitenkarte",
      "cards",
      "karte",
      "بطاقه",
      "بطاقات",
      "flyer",
      "poster",
      "brochure",
      "booklet",
      "druck",
      "print",
      "طباعه",
      "منشور",
      "بروشور",
      "ملف مطبوع",
    ])
  ) {
    return Printer;
  }

  if (
    containsAny(source, [
      "menu",
      "menü",
      "booklet",
      "catalog",
      "katalog",
      "magazine",
      "folder",
      "منيو",
      "كتالوج",
      "مجله",
      "speisekarte",
    ])
  ) {
    return FileText;
  }

  if (
    containsAny(source, [
      "layout",
      "template",
      "preparation",
      "aufbau",
      "satz",
      "gestalten",
      "تصميم",
      "تجهيز ملف",
      "تنسيق",
    ])
  ) {
    return PenTool;
  }

  const pool = [Printer, FileText, PenTool, LayoutGrid];
  return pool[hashString(serviceId) % pool.length];
}

function getPackagingIcon(source: string, serviceId: string): IconComponent {
  if (
    containsAny(source, [
      "packaging",
      "box",
      "carton",
      "verpackung",
      "عبوه",
      "تغليف",
      "علبه",
      "display box",
    ])
  ) {
    return Package;
  }

  if (
    containsAny(source, [
      "label",
      "labels",
      "etikett",
      "etiketten",
      "sticker",
      "aufkleber",
      "ملصق",
      "ملصقات",
    ])
  ) {
    return Printer;
  }

  if (
    containsAny(source, [
      "design",
      "layout",
      "konzept",
      "brand look",
      "تصميم",
      "تنسيق",
    ])
  ) {
    return PenTool;
  }

  const pool = [Package, Printer, PenTool, LayoutGrid];
  return pool[hashString(serviceId) % pool.length];
}

function getTextileIcon(source: string, serviceId: string): IconComponent {
  if (
    containsAny(source, [
      "shirt",
      "textil",
      "textile",
      "hoodie",
      "cap",
      "wear",
      "merch",
      "t shirt",
      "t-shirt",
      "تيشيرت",
      "ملابس",
      "نسيج",
      "قبعه",
      "hoodie",
    ])
  ) {
    return Shirt;
  }

  if (
    containsAny(source, [
      "event",
      "promotion",
      "promo",
      "werbeartikel",
      "giveaway",
      "فعاليات",
      "دعائي",
      "هدايا",
      "mug",
      "pen",
    ])
  ) {
    return Flag;
  }

  if (
    containsAny(source, [
      "print",
      "druck",
      "branding",
      "طباعه",
      "طباعة ملابس",
    ])
  ) {
    return Printer;
  }

  const pool = [Shirt, Printer, Flag, PenTool];
  return pool[hashString(serviceId) % pool.length];
}

function getBrandingIcon(source: string, serviceId: string): IconComponent {
  if (
    containsAny(source, [
      "logo",
      "branding",
      "brand",
      "corporate design",
      "identity",
      "identity system",
      "هويه",
      "شعار",
      "brand guide",
      "visual identity",
    ])
  ) {
    return Palette;
  }

  if (
    containsAny(source, [
      "concept",
      "creative",
      "layout",
      "design",
      "konzept",
      "design system",
      "تصميم",
      "تخطيط",
      "رسم",
    ])
  ) {
    return PenTool;
  }

  if (
    containsAny(source, [
      "brief",
      "strategy",
      "profile",
      "naming",
      "guideline",
      "ملف",
      "تعريف",
      "دليل",
    ])
  ) {
    return FileText;
  }

  const pool = [Palette, PenTool, FileText, LayoutGrid];
  return pool[hashString(serviceId) % pool.length];
}

function getFabricationIcon(source: string, serviceId: string): IconComponent {
  if (
    containsAny(source, [
      "fabrication",
      "custom",
      "special",
      "sonder",
      "dekor",
      "decor",
      "wood",
      "acryl",
      "acrylic",
      "dibond",
      "cnc",
      "تصنيع",
      "ديكور",
      "اكريليك",
      "ديبوند",
      "قص",
      "تجهيز خاص",
      "laser",
    ])
  ) {
    return Hammer;
  }

  if (
    containsAny(source, [
      "mount",
      "installation",
      "repair",
      "maintenance",
      "تركيب",
      "صيانه",
    ])
  ) {
    return Wrench;
  }

  if (
    containsAny(source, [
      "structure",
      "display",
      "stand",
      "frame",
      "booth",
      "ستاند",
      "هيكل",
      "حامل",
    ])
  ) {
    return LayoutGrid;
  }

  const pool = [Hammer, Wrench, LayoutGrid, Store];
  return pool[hashString(serviceId) % pool.length];
}

function getServiceIcon(service: SimpleService, currentCategoryId: string) {
  const source = getServiceSearchText(service);
  const normalizedCategoryId = normalizeSearchText(currentCategoryId);

  if (
    normalizedCategoryId.includes("signage") ||
    normalizedCategoryId.includes("schild") ||
    normalizedCategoryId.includes("fassade")
  ) {
    return getSignageIcon(source, service.id);
  }

  if (
    normalizedCategoryId.includes("printing") ||
    normalizedCategoryId.includes("druck") ||
    normalizedCategoryId.includes("paper")
  ) {
    return getPrintingIcon(source, service.id);
  }

  if (
    normalizedCategoryId.includes("packaging") ||
    normalizedCategoryId.includes("label") ||
    normalizedCategoryId.includes("etikett")
  ) {
    return getPackagingIcon(source, service.id);
  }

  if (
    normalizedCategoryId.includes("textile") ||
    normalizedCategoryId.includes("promo") ||
    normalizedCategoryId.includes("werbeartikel")
  ) {
    return getTextileIcon(source, service.id);
  }

  if (
    normalizedCategoryId.includes("branding") ||
    normalizedCategoryId.includes("design") ||
    normalizedCategoryId.includes("identity")
  ) {
    return getBrandingIcon(source, service.id);
  }

  if (
    normalizedCategoryId.includes("fabrication") ||
    normalizedCategoryId.includes("custom") ||
    normalizedCategoryId.includes("decor")
  ) {
    return getFabricationIcon(source, service.id);
  }

  if (containsAny(source, ["logo", "branding", "identity", "شعار", "هويه"])) {
    return getBrandingIcon(source, service.id);
  }

  if (
    containsAny(source, ["cnc", "laser", "fabrication", "تصنيع", "قص", "sonder"])
  ) {
    return getFabricationIcon(source, service.id);
  }

  if (containsAny(source, ["t shirt", "hoodie", "textil", "تيشيرت", "ملابس"])) {
    return getTextileIcon(source, service.id);
  }

  if (containsAny(source, ["box", "packaging", "label", "تغليف", "ملصق"])) {
    return getPackagingIcon(source, service.id);
  }

  if (
    containsAny(source, ["poster", "flyer", "business card", "druck", "طباعه"])
  ) {
    return getPrintingIcon(source, service.id);
  }

  if (containsAny(source, ["sign", "fassade", "schild", "لوحه", "واجهه"])) {
    return getSignageIcon(source, service.id);
  }

  return LayoutGrid;
}

export default function CategoryPage() {
  const params = useParams();
  const categoryId = String(params?.categoryId || "");

  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  const category = categories.find((item) => item.id === categoryId) || null;
  const categoryServices = category ? getServicesByCategory(category.id) : [];

  const text = {
    badge:
      language === "ar"
        ? "صفحة الفئة"
        : language === "de"
          ? "Kategorieseite"
          : "Category Page",

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

    servicesTitle:
      language === "ar"
        ? "الخدمات ضمن هذه الفئة"
        : language === "de"
          ? "Services in dieser Kategorie"
          : "Services in this category",

    emptyServices:
      language === "ar"
        ? "لا توجد خدمات متاحة ضمن هذه الفئة حاليًا."
        : language === "de"
          ? "Aktuell sind in dieser Kategorie keine Services verfügbar."
          : "There are currently no services available in this category.",

    openService:
      language === "ar"
        ? "فتح الخدمة"
        : language === "de"
          ? "Service öffnen"
          : "Open Service",

    helperTitle:
      language === "ar"
        ? "كيف تختار الخدمة الصحيحة؟"
        : language === "de"
          ? "Wie wählst du den richtigen Service?"
          : "How do you choose the right service?",

    helperFallback:
      language === "ar"
        ? "اختر الخدمة الأقرب لما تريد تنفيذه فعليًا. لا يشترط أن تعرف الاسم التقني الدقيق من البداية."
        : language === "de"
          ? "Wähle die Leistung, die dem tatsächlichen Ziel deiner Anfrage am nächsten kommt. Du musst den genauen technischen Namen nicht von Anfang an kennen."
          : "Choose the service that is closest to what you actually want to get done. You do not need to know the exact technical name from the beginning.",

    platformEyebrow:
      language === "ar"
        ? "نظرة سريعة على تجربة المنصة"
        : language === "de"
          ? "Ein kurzer Blick auf die Plattform"
          : "Quick look at the platform",

    platformTitle:
      language === "ar"
        ? "بداية واضحة، منظمة، ومفهومة من أول خطوة"
        : language === "de"
          ? "Klarer, strukturierter Start von Anfang an"
          : "Clear, structured start from the first step",

    platformDescription:
      language === "ar"
        ? "تحوّل هذه الصفحة الفئة المناسبة إلى نقطة انطلاق أكثر وضوحًا، بحيث يصل العميل إلى الخدمة الصحيحة بسرعة وبفهم أفضل."
        : language === "de"
          ? "Diese Kategorieseite macht den Einstieg klarer, damit der Kunde schneller und gezielter zum passenden Service gelangt."
          : "This category page makes the starting point clearer, helping the customer reach the right service faster and with better understanding.",

    blockOneTitle:
      language === "ar"
        ? "اختيار أوضح"
        : language === "de"
          ? "Klarere Auswahl"
          : "Clearer Choice",

    blockOneText:
      language === "ar"
        ? "تساعدك الفئة على تضييق الطريق بدل التنقل العشوائي بين الخدمات."
        : language === "de"
          ? "Die Kategorie hilft dir, den richtigen Weg einzugrenzen statt zufällig zwischen Services zu wechseln."
          : "The category helps narrow the path instead of jumping randomly between services.",

    blockTwoTitle:
      language === "ar"
        ? "فهم أسرع"
        : language === "de"
          ? "Schnelleres Verständnis"
          : "Faster Understanding",

    blockTwoText:
      language === "ar"
        ? "الأمثلة والنصوص هنا تجعل الوصول إلى الخدمة الأقرب أسهل."
        : language === "de"
          ? "Die Beispiele und Hinweise hier machen den passenden Service schneller auffindbar."
          : "The examples and hints here make it easier to find the closest service.",

    blockThreeTitle:
      language === "ar"
        ? "انتقال أنظف"
        : language === "de"
          ? "Sauberer Übergang"
          : "Cleaner Transition",

    blockThreeText:
      language === "ar"
        ? "بعد اختيار الخدمة تنتقل مباشرة إلى طلب أكثر تنظيمًا ووضوحًا."
        : language === "de"
          ? "Nach der Servicewahl wechselst du direkt zu einer klareren und besser strukturierten Anfrage."
          : "After choosing the service, you move directly to a clearer and more structured request.",
  };

  const localizedCategoryTitle = getLocalizedValue(
    category?.title,
    language,
    categoryId
  );

  const localizedCategoryDescription = getLocalizedValue(
    category?.description,
    language,
    ""
  );

  const categorySupport = category ? categorySupportMap[category.id] : null;

  const cardStyle: CSSProperties = {
    borderRadius: "16px",
    border: "1px solid #e0d1be",
    background: "#fffaf5",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "12px",
    color: "#4a3a2b",
  };

  const cardTitleStyle: CSSProperties = {
    fontWeight: 800,
    fontSize: "13px",
  };

  const cardDescStyle: CSSProperties = {
    fontSize: "11px",
    color: "#7a6653",
    lineHeight: 1.5,
  };

    const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f7f1e8 0%, #f2e9de 100%)",
      padding: "0 12px 72px",
      fontFamily: "Arial, sans-serif",
    },

    container: {
      maxWidth: "1080px",
      margin: "14px auto 0",
    },

    hero: {
      background: "linear-gradient(135deg, #fffaf4 0%, #f8efe3 100%)",
      border: "1px solid #e3d4c2",
      borderRadius: "22px",
      padding: "22px 16px 18px",
      boxShadow: "0 10px 28px rgba(96, 73, 46, 0.08)",
      marginBottom: "14px",
      textAlign: isArabic ? "right" : "left",
    },

    badge: {
      display: "inline-block",
      marginBottom: "10px",
      padding: "6px 12px",
      borderRadius: "999px",
      background: "#efe1cf",
      color: "#6d5338",
      fontSize: "12px",
      fontWeight: 700,
      border: "1px solid #ddc8af",
      letterSpacing: "0.2px",
    },

    title: {
      margin: "0 0 8px",
      fontSize: "clamp(24px, 6vw, 36px)",
      lineHeight: 1.2,
      color: "#2f2419",
      fontWeight: 800,
    },

    description: {
      margin: 0,
      color: "#5b4b3c",
      lineHeight: 1.75,
      fontSize: "14px",
      maxWidth: "760px",
    },

    helperPanel: {
      background: "rgba(255,255,255,0.84)",
      border: "1px solid #e7d9c8",
      borderRadius: "20px",
      padding: "16px 14px",
      boxShadow: "0 6px 20px rgba(90, 70, 40, 0.06)",
      marginBottom: "14px",
    },

    helperTitle: {
      margin: "0 0 8px",
      fontSize: "18px",
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
    },

    voiceHint: {
      marginTop: "10px",
      padding: "10px 12px",
      borderRadius: "14px",
      border: "1px solid #e1d0be",
      background: "#f7ede1",
      color: "#735f4b",
      fontSize: "12px",
      lineHeight: 1.75,
      textAlign: isArabic ? "right" : "left",
    },

    section: {
      background: "rgba(255,255,255,0.84)",
      border: "1px solid #e7d9c8",
      borderRadius: "20px",
      padding: "16px 14px",
      boxShadow: "0 6px 20px rgba(90, 70, 40, 0.06)",
    },

    sectionTitle: {
      margin: "0 0 12px",
      fontSize: "18px",
      lineHeight: 1.3,
      color: "#35281d",
      fontWeight: 800,
      textAlign: isArabic ? "right" : "left",
    },

    emptyBox: {
      border: "1px dashed #d9c4ab",
      borderRadius: "14px",
      padding: "14px",
      color: "#6f5b48",
      background: "#fffaf4",
      fontSize: "13px",
      lineHeight: 1.7,
      textAlign: isArabic ? "right" : "left",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "12px",
    },

    card: {
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
      borderRadius: "18px",
      border: "1px solid #decdb8",
      background: "#fffaf5",
      textDecoration: "none",
      color: "#2f2419",
      boxShadow: "0 5px 16px rgba(90, 70, 40, 0.05)",
      overflow: "hidden",
      padding: "14px",
      minHeight: "236px",
      transition:
        "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
    },

    iconRow: {
      display: "flex",
      justifyContent: isArabic ? "flex-end" : "flex-start",
      marginBottom: "10px",
    },

    iconWrap: {
      width: "58px",
      height: "58px",
      borderRadius: "18px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 10px rgba(90, 70, 40, 0.05)",
      flexShrink: 0,
      background: "linear-gradient(135deg, #f6ede2 0%, #efe1cf 100%)",
      border: "1px solid #dcc6ae",
    },

    content: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      minWidth: 0,
      flex: 1,
    },

    cardTitle: {
      margin: 0,
      fontSize: "16px",
      lineHeight: 1.35,
      fontWeight: 800,
      color: "#2f2419",
      textAlign: isArabic ? "right" : "left",
      minHeight: "44px",
    },

    cardDescription: {
      margin: 0,
      fontSize: "13px",
      lineHeight: 1.7,
      color: "#6a5642",
      textAlign: isArabic ? "right" : "left",
      minHeight: "52px",
    },

    introText: {
      margin: 0,
      fontSize: "12px",
      lineHeight: 1.7,
      color: "#5f4d3d",
      textAlign: isArabic ? "right" : "left",
      flex: 1,
    },

    footerRow: {
      display: "flex",
      justifyContent: isArabic ? "flex-start" : "flex-end",
      marginTop: "6px",
    },

    openPill: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "34px",
      padding: "0 14px",
      borderRadius: "999px",
      border: "1px solid #cdb79f",
      background: "#f3e3cf",
      color: "#3b2f24",
      fontSize: "12px",
      fontWeight: 800,
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
      minHeight: "40px",
      padding: "0 16px",
      borderRadius: "999px",
      border: "1px solid #2f2419",
      background: "#2f2419",
      color: "#ffffff",
      textDecoration: "none",
      fontSize: "13px",
      fontWeight: 800,
    },

    platformBlock: {
      marginTop: "16px",
      borderRadius: "22px",
      border: "1px solid #e3d4c2",
      background: "linear-gradient(135deg, #fffaf4 0%, #f5e9dc 100%)",
      padding: "18px 14px",
      boxShadow: "0 10px 26px rgba(90,70,40,0.06)",
    },

    platformEyebrow: {
      fontSize: "12px",
      fontWeight: 700,
      color: "#7a624a",
      marginBottom: "6px",
      textAlign: isArabic ? "right" : "left",
    },

    platformTitle: {
      fontSize: "clamp(18px, 4.8vw, 24px)",
      fontWeight: 800,
      margin: "0 0 6px",
      color: "#2f2419",
      lineHeight: 1.3,
      textAlign: isArabic ? "right" : "left",
    },

    platformDescription: {
      fontSize: "13px",
      color: "#5b4b3c",
      lineHeight: 1.7,
      margin: 0,
      textAlign: isArabic ? "right" : "left",
    },

    platformCards: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gap: "10px",
      marginTop: "14px",
    },
  };

  if (!category) {
    return (
      <div dir={dir} style={styles.page}>
        <Header showBackButton showBackHome backHref="/request" />

        <div style={styles.container}>
          <section style={styles.hero}>
            <div style={styles.badge}>{text.badge}</div>
            <h1 style={styles.title}>{text.fallbackTitle}</h1>
            <p style={styles.description}>{text.fallbackDescription}</p>

            <div style={styles.fallbackActionRow}>
              <Link href="/request" style={styles.fallbackButton}>
                {language === "ar"
                  ? "العودة إلى الفئات"
                  : language === "de"
                    ? "Zurück zu den Kategorien"
                    : "Back to categories"}
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
          <div style={styles.badge}>{text.badge}</div>
          <h1 style={styles.title}>{localizedCategoryTitle}</h1>
          <p style={styles.description}>{localizedCategoryDescription}</p>
        </section>

        <section style={styles.helperPanel}>
          <h2 style={styles.helperTitle}>
            {categorySupport
              ? categorySupport.helperTitle[language]
              : text.helperTitle}
          </h2>

          <p style={styles.helperText}>
            {categorySupport
              ? categorySupport.helperText[language]
              : text.helperFallback}
          </p>

          {categorySupport ? (
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
                <Sparkles size={14} />
                <span>
                  {language === "ar"
                    ? "مثال بحث طبيعي أو صوتي"
                    : language === "de"
                      ? "Beispiel für natürliche oder sprachnahe Suche"
                      : "Example of natural or voice-like search"}
                </span>
              </div>

              <div>{categorySupport.voiceHint[language]}</div>
            </div>
          ) : null}
        </section>

                <section style={styles.section}>
          <h2 style={styles.sectionTitle}>{text.servicesTitle}</h2>

          {categoryServices.length === 0 ? (
            <div style={styles.emptyBox}>{text.emptyServices}</div>
          ) : (
            <div style={styles.grid}>
              {categoryServices.map((service) => {
                const localizedServiceTitle = getLocalizedValue(
                  service.title,
                  language,
                  service.id
                );

                const localizedServiceDescription = getLocalizedValue(
                  service.description,
                  language,
                  ""
                );

                const localizedServiceIntro = getLocalizedValue(
                  service.intro,
                  language,
                  localizedServiceDescription
                );

                const ServiceIcon = getServiceIcon(service, category.id);

                return (
                  <Link
                    key={`${service.category}-${service.id}`}
                    href={`/request/service/${service.id}`}
                    style={styles.card}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 26px rgba(90, 70, 40, 0.10)";
                      e.currentTarget.style.borderColor = "#cfb79a";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 5px 16px rgba(90, 70, 40, 0.05)";
                      e.currentTarget.style.borderColor = "#decdb8";
                    }}
                  >
                    <div style={styles.iconRow}>
                      <div style={styles.iconWrap}>
                        <ServiceIcon
                          size={26}
                          strokeWidth={2.1}
                          color="#4b3a2b"
                        />
                      </div>
                    </div>

                    <div style={styles.content}>
                      <h3 style={styles.cardTitle}>{localizedServiceTitle}</h3>

                      <p style={styles.cardDescription}>
                        {localizedServiceDescription}
                      </p>

                      <p style={styles.introText}>{localizedServiceIntro}</p>

                      <div style={styles.footerRow}>
                        <span style={styles.openPill}>{text.openService}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section style={styles.platformBlock}>
          <div style={styles.platformEyebrow}>{text.platformEyebrow}</div>

          <h2 style={styles.platformTitle}>{text.platformTitle}</h2>

          <p style={styles.platformDescription}>{text.platformDescription}</p>

          <div style={styles.platformCards}>
            <div style={cardStyle}>
              <LayoutGrid size={18} />
              <span style={cardTitleStyle}>{text.blockOneTitle}</span>
              <span style={cardDescStyle}>{text.blockOneText}</span>
            </div>

            <div style={cardStyle}>
              <Sparkles size={18} />
              <span style={cardTitleStyle}>{text.blockTwoTitle}</span>
              <span style={cardDescStyle}>{text.blockTwoText}</span>
            </div>

            <div style={cardStyle}>
              <ArrowUpRight size={18} />
              <span style={cardTitleStyle}>{text.blockThreeTitle}</span>
              <span style={cardDescStyle}>{text.blockThreeText}</span>
            </div>
          </div>
        </section>

        <CartPopup lang={language} />
      </div>
    </div>
  );
}