import type { Service } from "@/types/service";

import { smartServices } from "./smart";
import { signageServices } from "./signage";
import { printingServices } from "./printing";
import { packagingServices } from "./packaging";
import { textileServices } from "./textile";
import { brandingServices } from "./branding";
import { fabricationServices } from "./fabrication";

/**
 * Central Services Registry
 * ----------------------------------
 * This file aggregates all services across categories.
 * Future-ready for:
 * - SEO routing
 * - AI processing
 * - Dynamic filtering
 * - Analytics tracking
 * - Voice/search intent matching
 * - Internal linking
 *
 * Important:
 * Some categories are intentionally fed by service files that contain
 * multiple related service groups. For example:
 * - signageServices may include signage + surfaces + display
 * This is acceptable as long as category normalization remains clean.
 */

type ServiceWithSearchMeta = Service & {
  searchAliases?: string[];
};

export type CategoryMeta = {
  id: string;
  label: {
    ar: string;
    de: string;
    en: string;
  };
  seoTitle: {
    ar: string;
    de: string;
    en: string;
  };
  seoDescription: {
    ar: string;
    de: string;
    en: string;
  };
};

const categoryOverrides: Record<string, string> = {
  "open-request": "smart",

  signage: "signage",
  "sign-installation-maintenance": "signage",

  "window-graphics": "surfaces",

  "vehicle-branding": "vehicle",

  "commercial-printing": "printing",
  "business-printing": "printing",
  "menu-printing": "printing",
  "poster-printing": "printing",
  "letterhead-envelopes": "printing",
  stamps: "printing",

  "stickers-labels": "packaging",
  packaging: "packaging",

  "banners-rollups-flags": "display",
  "event-printing": "display",

  "textile-printing": "textile",
  "promotional-items": "textile",

  "custom-fabrication": "fabrication",
  "shop-setup-decor": "fabrication",

  "branding-design": "branding",
  "logo-design-only": "branding",

  "marketing-solutions": "marketing",
};

const serviceSearchAliases: Record<string, string[]> = {
  "open-request": [
    "smart request",
    "general request",
    "open project request",
    "طلب ذكي",
    "طلب عام",
    "anfrage starten",
  ],
  signage: [
    "signage",
    "shop sign",
    "business sign",
    "illuminated sign",
    "3d letters",
    "werbeschild",
    "lichtwerbung",
    "لوحات",
    "واجهة",
    "حروف مضيئة",
  ],
  "sign-installation-maintenance": [
    "sign installation",
    "sign maintenance",
    "montage",
    "wartung",
    "تركيب لوحات",
    "صيانة لوحات",
  ],
  "window-graphics": [
    "window graphics",
    "shop window stickers",
    "window vinyl",
    "glasbeklebung",
    "folienbeschriftung",
    "ستيكر زجاج",
    "طباعة زجاج",
  ],
  "vehicle-branding": [
    "vehicle branding",
    "car wrap",
    "vehicle wrap",
    "autobeschriftung",
    "fahrzeugbeklebung",
    "تجليد سيارات",
    "طباعة سيارات",
  ],
  "commercial-printing": [
    "business cards",
    "visitenkarten",
    "كروت أعمال",
    "بطاقات عمل",
  ],
  "business-printing": [
    "flyers",
    "brochures",
    "falzflyer",
    "broschüren",
    "فلايرات",
    "بروشورات",
    "مطويات",
  ],
  "menu-printing": [
    "menu printing",
    "restaurant menu",
    "speisekarte",
    "menu cards",
    "منيو",
    "طباعة منيو",
    "قائمة مطعم",
  ],
  "poster-printing": [
    "poster printing",
    "poster",
    "plakat",
    "papierplakat",
    "بوستر",
    "بوسترات",
  ],
  "letterhead-envelopes": [
    "letterhead",
    "envelopes",
    "briefpapier",
    "umschläge",
    "ورق رسمي",
    "مغلفات",
  ],
  stamps: [
    "stamps",
    "rubber stamp",
    "firmenstempel",
    "stempel",
    "أختام",
    "ختم",
  ],
  "stickers-labels": [
    "stickers",
    "labels",
    "etiketten",
    "aufkleber",
    "ملصقات",
    "ستيكرات",
  ],
  packaging: [
    "packaging",
    "product packaging",
    "verpackung",
    "علب",
    "تغليف",
  ],
  "textile-printing": [
    "textile printing",
    "t-shirt printing",
    "textildruck",
    "shirt druck",
    "طباعة ملابس",
    "طباعة تيشيرتات",
  ],
  "promotional-items": [
    "promotional items",
    "giveaways",
    "werbeartikel",
    "هدايا دعائية",
  ],
  "custom-fabrication": [
    "custom fabrication",
    "custom build",
    "sonderanfertigung",
    "تصنيع خاص",
  ],
  "shop-setup-decor": [
    "shop setup",
    "store setup",
    "ladenausstattung",
    "shop decor",
    "تجهيز محل",
    "ديكور محل",
  ],
  "branding-design": [
    "branding",
    "brand design",
    "markendesign",
    "هوية بصرية",
    "براندنج",
  ],
  "logo-design-only": [
    "logo design",
    "logo",
    "logodesign",
    "تصميم شعار",
    "شعار",
  ],
  "marketing-solutions": [
    "marketing",
    "marketing solutions",
    "marketing service",
    "marketinglösungen",
    "حلول تسويقية",
  ],
};

export const categoryMeta: CategoryMeta[] = [
  {
    id: "smart",
    label: {
      ar: "الطلب الذكي",
      de: "Intelligente Anfrage",
      en: "Smart Request",
    },
    seoTitle: {
      ar: "الطلب الذكي لخدمات الطباعة والإعلان",
      de: "Intelligente Anfrage für Druck- und Werbeservices",
      en: "Smart Request for Print and Advertising Services",
    },
    seoDescription: {
      ar: "ابدأ بطلب ذكي يساعدك على تنظيم فكرتك وتحويلها إلى طلب قابل للتنفيذ.",
      de: "Starte mit einer intelligenten Anfrage, die deine Idee strukturiert und umsetzbar macht.",
      en: "Start with a smart request that helps structure your idea into an executable order.",
    },
  },
  {
    id: "signage",
    label: {
      ar: "اللوحات والإضاءات",
      de: "Schilder & Lichtwerbung",
      en: "Signs & Illuminated Branding",
    },
    seoTitle: {
      ar: "لوحات وإضاءات احترافية للمحلات والشركات",
      de: "Professionelle Schilder und Lichtwerbung für Geschäfte und Unternehmen",
      en: "Professional Signs and Illuminated Branding for Shops and Businesses",
    },
    seoDescription: {
      ar: "حلول متقدمة للوحات الواجهات والحروف المضيئة والتركيب والصيانة.",
      de: "Fortschrittliche Lösungen für Fassadenschilder, Leuchtbuchstaben, Montage und Wartung.",
      en: "Advanced solutions for storefront signage, illuminated letters, installation, and maintenance.",
    },
  },
  {
    id: "surfaces",
    label: {
      ar: "الزجاج والسطوح",
      de: "Glas & Oberflächen",
      en: "Glass & Surface Graphics",
    },
    seoTitle: {
      ar: "ستيكرات الزجاج وتجهيز السطوح التجارية",
      de: "Glasbeklebung und Oberflächengestaltung für Gewerbeflächen",
      en: "Glass Stickers and Surface Graphics for Commercial Spaces",
    },
    seoDescription: {
      ar: "حلول للطباعة على الزجاج والواجهات والسطوح الإعلانية.",
      de: "Lösungen für Glasflächen, Schaufenster und visuelle Oberflächengestaltung.",
      en: "Solutions for shop windows, glass graphics, and branded surface applications.",
    },
  },
  {
    id: "vehicle",
    label: {
      ar: "المركبات",
      de: "Fahrzeuge",
      en: "Vehicles",
    },
    seoTitle: {
      ar: "تجهيز وطباعة المركبات والهوية البصرية المتحركة",
      de: "Fahrzeugbeschriftung und mobile Markenpräsenz",
      en: "Vehicle Branding and Mobile Visual Identity",
    },
    seoDescription: {
      ar: "حلول لتجليد السيارات وكتابة المركبات وتحويلها إلى مساحة إعلانية.",
      de: "Lösungen für Car Wrapping und Fahrzeugbeschriftung als mobile Werbefläche.",
      en: "Solutions for vehicle wraps and mobile branding as advertising surfaces.",
    },
  },
  {
    id: "printing",
    label: {
      ar: "المطبوعات",
      de: "Druckprodukte",
      en: "Printing",
    },
    seoTitle: {
      ar: "مطبوعات احترافية للشركات والمطاعم والفعاليات",
      de: "Professionelle Druckprodukte für Unternehmen, Gastronomie und Events",
      en: "Professional Printing for Businesses, Restaurants, and Events",
    },
    seoDescription: {
      ar: "كروت أعمال، بروشورات، منيوهات، بوسترات، أوراق رسمية، وأختام.",
      de: "Visitenkarten, Flyer, Speisekarten, Poster, Geschäftspapiere und Stempel.",
      en: "Business cards, brochures, menus, posters, official stationery, and stamps.",
    },
  },
  {
    id: "packaging",
    label: {
      ar: "التغليف والملصقات",
      de: "Verpackung & Etiketten",
      en: "Packaging & Labels",
    },
    seoTitle: {
      ar: "التغليف والملصقات للمنتجات والعلامات التجارية",
      de: "Verpackung und Etiketten für Produkte und Marken",
      en: "Packaging and Labels for Products and Brands",
    },
    seoDescription: {
      ar: "حلول للملصقات والتغليف وواجهة المنتج البصرية.",
      de: "Lösungen für Etiketten, Verpackung und visuelle Produktpräsentation.",
      en: "Solutions for labels, packaging, and visual product presentation.",
    },
  },
  {
    id: "display",
    label: {
      ar: "العرض والفعاليات",
      de: "Displays & Events",
      en: "Displays & Events",
    },
    seoTitle: {
      ar: "مطبوعات العرض والفعاليات واللافتات المؤقتة",
      de: "Displays, Eventdruck und temporäre Werbelösungen",
      en: "Displays, Event Printing, and Temporary Visual Solutions",
    },
    seoDescription: {
      ar: "رول أب، بانرات، أعلام، ومطبوعات خاصة بالعرض والفعاليات.",
      de: "Roll-Ups, Banner, Fahnen und Druckprodukte für Events und Präsentationen.",
      en: "Roll-ups, banners, flags, and printed materials for events and presentations.",
    },
  },
  {
    id: "textile",
    label: {
      ar: "المنسوجات والهدايا",
      de: "Textil & Werbeartikel",
      en: "Textiles & Promotional Items",
    },
    seoTitle: {
      ar: "طباعة الملابس والهدايا الدعائية",
      de: "Textildruck und Werbeartikel",
      en: "Textile Printing and Promotional Items",
    },
    seoDescription: {
      ar: "طباعة تيشيرتات وملابس وهدايا دعائية للشركات والفعاليات.",
      de: "Bedruckte Textilien und Werbeartikel für Unternehmen und Veranstaltungen.",
      en: "Printed garments and promotional items for businesses and events.",
    },
  },
  {
    id: "fabrication",
    label: {
      ar: "التصنيع والتجهيز",
      de: "Fertigung & Ausstattung",
      en: "Fabrication & Setup",
    },
    seoTitle: {
      ar: "التصنيع الخاص وتجهيز المحلات والمساحات التجارية",
      de: "Sonderanfertigung und Ausstattung von Geschäften und Gewerbeflächen",
      en: "Custom Fabrication and Store Setup for Commercial Spaces",
    },
    seoDescription: {
      ar: "حلول تصنيع خاص وتجهيزات عملية وجمالية للمحلات والمشاريع.",
      de: "Individuelle Fertigung und Ausstattungslösungen für Geschäfte und Projekte.",
      en: "Custom fabrication and practical visual setups for shops and projects.",
    },
  },
  {
    id: "branding",
    label: {
      ar: "الهوية البصرية",
      de: "Markenauftritt",
      en: "Branding",
    },
    seoTitle: {
      ar: "الهوية البصرية وتصميم الشعارات",
      de: "Markenauftritt und Logo-Design",
      en: "Brand Identity and Logo Design",
    },
    seoDescription: {
      ar: "خدمات الهوية البصرية وتصميم الشعارات وبناء صورة احترافية للنشاط.",
      de: "Leistungen für Corporate Design, Logoentwicklung und professionellen Markenauftritt.",
      en: "Services for brand identity, logo design, and professional business presentation.",
    },
  },
  {
    id: "marketing",
    label: {
      ar: "الحلول التسويقية",
      de: "Marketinglösungen",
      en: "Marketing Solutions",
    },
    seoTitle: {
      ar: "حلول تسويقية تربط الإعلان بالطباعة والتنفيذ",
      de: "Marketinglösungen zwischen Werbung, Druck und Umsetzung",
      en: "Marketing Solutions Connecting Promotion, Print, and Execution",
    },
    seoDescription: {
      ar: "حلول تساعد على تحويل النشاط التجاري إلى حضور بصري وتسويقي أقوى.",
      de: "Lösungen zur Stärkung des visuellen und werblichen Auftritts eines Unternehmens.",
      en: "Solutions that help turn a business into a stronger visual and marketing presence.",
    },
  },
];

const normalizeServiceCategory = (service: Service): ServiceWithSearchMeta => {
  const overriddenCategory = categoryOverrides[service.id];

  return {
    ...service,
    category: overriddenCategory || service.category,
    searchAliases: serviceSearchAliases[service.id] || [],
  };
};

const assertUniqueServiceIds = (items: Service[]) => {
  const seen = new Set<string>();

  items.forEach((service) => {
    if (seen.has(service.id)) {
      throw new Error(`Duplicate service id detected: ${service.id}`);
    }

    seen.add(service.id);
  });
};

const rawServices: Service[] = [
  ...smartServices,
  ...signageServices,
  ...printingServices,
  ...packagingServices,
  ...textileServices,
  ...brandingServices,
  ...fabricationServices,
];

export const services: Service[] = rawServices.map(normalizeServiceCategory);

assertUniqueServiceIds(services);

/**
 * Helper: Get service by ID
 */
export const getServiceById = (id: string): Service | undefined => {
  return services.find((service) => service.id === id);
};

/**
 * Helper: Get services by category
 */
export const getServicesByCategory = (categoryId: string): Service[] => {
  return services.filter((service) => service.category === categoryId);
};

/**
 * Helper: Does this category actually contain services?
 */
export const hasCategoryServices = (categoryId: string): boolean => {
  return services.some((service) => service.category === categoryId);
};

/**
 * Helper: Get category meta by ID
 */
export const getCategoryMetaById = (
  categoryId: string
): CategoryMeta | undefined => {
  return categoryMeta.find((category) => category.id === categoryId);
};

/**
 * Helper: Get all categories that actually have services
 * Use this in /request instead of the raw categories list if you want
 * the UI to show only categories backed by real services.
 */
export const getActiveCategories = (): CategoryMeta[] => {
  const activeCategoryIds = new Set(services.map((service) => service.category));
  return categoryMeta.filter((category) => activeCategoryIds.has(category.id));
};

/**
 * Helper: Get only active category ids
 */
export const getActiveCategoryIds = (): string[] => {
  return Array.from(new Set(services.map((service) => service.category)));
};

/**
 * Helper: Search services by title, id, description, aliases
 * Useful later for:
 * - internal search
 * - smart request routing
 * - voice-search matching
 * - SEO landing assistance
 */
export const searchServices = (query: string): Service[] => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return [];

  return services.filter((service) => {
    const localizedTitle = Object.values(service.title || {})
      .join(" ")
      .toLowerCase();

    const localizedDescription = Object.values(service.description || {})
      .join(" ")
      .toLowerCase();

    const aliases = ((service as ServiceWithSearchMeta).searchAliases || [])
      .join(" ")
      .toLowerCase();

    return (
      service.id.toLowerCase().includes(normalizedQuery) ||
      localizedTitle.includes(normalizedQuery) ||
      localizedDescription.includes(normalizedQuery) ||
      aliases.includes(normalizedQuery)
    );
  });
};

/**
 * Helper: Get related services from same category
 * Useful later for:
 * - internal linking blocks
 * - "related services" sections
 * - stronger SEO structure between service pages
 */
export const getRelatedServices = (
  serviceId: string,
  limit = 4
): Service[] => {
  const currentService = getServiceById(serviceId);
  if (!currentService) return [];

  return services
    .filter(
      (service) =>
        service.id !== currentService.id &&
        service.category === currentService.category
    )
    .slice(0, limit);
};