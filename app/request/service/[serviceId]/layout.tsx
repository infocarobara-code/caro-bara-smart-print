import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getServiceById } from "@/data/services/index";
import { getGuideById } from "@/data/guides";

type SupportedLanguage = "ar" | "de" | "en";

type Props = {
  children: ReactNode;
  params: Promise<{
    serviceId: string;
  }>;
};

type LocalizedValue =
  | string
  | {
      ar?: string;
      de?: string;
      en?: string;
    }
  | null
  | undefined;

type ServiceSeoData = {
  title: string;
  description: string;
  keywords: string[];
};

type GuideLike = {
  seoTitle?: LocalizedValue;
  seoDescription?: LocalizedValue;
  title?: LocalizedValue;
  description?: LocalizedValue;
  keywords?: string[] | Record<string, string[]> | null;
  voiceQueries?: string[] | Record<string, string[]> | null;
  faq?: Array<{
    question?: LocalizedValue;
    answer?: LocalizedValue;
  }>;
  cityModifiers?: string[] | Record<string, string[]> | null;
  businessTypes?: string[] | Record<string, string[]> | null;
  synonyms?: string[] | Record<string, string[]> | null;
  relatedServices?: string[] | null;
  relatedCategories?: string[] | null;
};

const siteName = "Caro Bara Smart Print";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.carobara.de";
const defaultOgImage = `${siteUrl}/og-image.jpg`;

const cityModifiers = {
  de: [
    "deutschland",
    "in deutschland",
    "für unternehmen in deutschland",
    "nahe bei mir",
    "in meiner nähe",
    "lokaler print service",
    "lokale werbetechnik",
    "berlin",
    "in berlin",
    "berlin print service",
    "berlin werbetechnik",
  ],
  en: [
    "germany",
    "in germany",
    "near me",
    "local print service",
    "local signage service",
    "print service in germany",
    "sign maker in germany",
    "berlin",
    "in berlin",
    "berlin print service",
    "berlin signage service",
  ],
  ar: [
    "ألمانيا",
    "في ألمانيا",
    "بالقرب مني",
    "قريب مني",
    "خدمات طباعة في ألمانيا",
    "خدمات لوحات في ألمانيا",
    "برلين",
    "في برلين",
    "طباعة في برلين",
    "لوحات في برلين",
  ],
};

const globalKeywords = {
  de: [
    "caro bara smart print",
    "druckanfrage",
    "print anfrage",
    "werbeanfrage",
    "werbetechnik",
    "druckservice",
    "individuelle anfrage",
    "geschäftsdruck",
    "maßgeschneiderte produktion",
    "visuelle werbung",
    "druck und werbung",
    "anfrageformular",
    "projekt anfrage",
  ],
  en: [
    "caro bara smart print",
    "print request",
    "custom print request",
    "signage request",
    "advertising production",
    "printing services",
    "signage services",
    "commercial printing",
    "custom production service",
    "business printing",
    "visual branding production",
    "request form",
    "project request",
  ],
  ar: [
    "caro bara smart print",
    "طلب طباعة",
    "طلب لوحات",
    "خدمات طباعة",
    "خدمات إعلانية",
    "طباعة تجارية",
    "حلول تنفيذ",
    "طباعة وإعلان",
    "نموذج طلب",
    "خدمة مخصصة",
    "تصنيع إعلاني",
    "تجهيز بصري",
    "طلب مشروع",
  ],
};

const voiceQueries = {
  signage: {
    de: [
      "wie bestelle ich ein ladenschild",
      "was kostet lichtwerbung",
      "wer macht firmenschilder in meiner nähe",
      "ich brauche ein schild für mein geschäft",
      "profilbuchstaben für laden anfragen",
      "schild für fassade erstellen lassen",
    ],
    en: [
      "how do i order a shop sign",
      "how much does illuminated signage cost",
      "who makes business signs near me",
      "i need a sign for my shop",
      "request raised letters for storefront",
      "custom facade sign service",
    ],
    ar: [
      "كيف أطلب لوحة محل",
      "كم سعر اللوحات المضيئة",
      "أريد لوحة لواجهة محل",
      "من ينفذ حروف بارزة",
      "أريد طلب لوحة شركة",
      "خدمة تنفيذ لوحات قريبة مني",
    ],
  },
  "commercial-printing": {
    de: [
      "wie bestelle ich flyer und visitenkarten",
      "was kostet papierdruck",
      "ich brauche drucksachen für mein unternehmen",
      "geschäftsdruck in meiner nähe",
      "broschüren und karten drucken lassen",
      "druckservice für firma anfragen",
    ],
    en: [
      "how do i order flyers and business cards",
      "how much does paper printing cost",
      "i need printing for my business",
      "commercial printing near me",
      "print brochures and menus",
      "request business printing service",
    ],
    ar: [
      "كيف أطلب طباعة فلايرات",
      "كم سعر الطباعة الورقية",
      "أريد بطاقات أعمال وفلايرات",
      "خدمة طباعة تجارية قريبة مني",
      "طباعة منيوهات وبروشورات",
      "طلب طباعة لشركة",
    ],
  },
  "open-request": {
    de: [
      "ich weiß noch nicht genau was ich brauche",
      "offene druckanfrage senden",
      "hilfe bei werbeanfrage",
      "anfrage senden auch ohne alle details",
      "ich brauche beratung für mein projekt",
      "unklare anfrage strukturiert senden",
    ],
    en: [
      "i am not sure what i need yet",
      "send an open print request",
      "help with advertising request",
      "submit request without all details",
      "i need guidance for my project",
      "structured open request service",
    ],
    ar: [
      "لا أعرف بالضبط ماذا أحتاج",
      "أريد إرسال طلب مفتوح",
      "أحتاج مساعدة في تحديد الخدمة",
      "إرسال طلب حتى لو كانت التفاصيل ناقصة",
      "أحتاج استشارة لمشروعي",
      "طلب ذكي مفتوح",
    ],
  },
};

function toSafeString(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

function cleanText(value: unknown): string {
  return toSafeString(value).replace(/\s+/g, " ").trim();
}

function truncateText(value: unknown, max = 165): string {
  const text = cleanText(value);
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

function dedupeKeywords(items: unknown[]): string[] {
  const seen = new Set<string>();

  return items
    .map((item) => cleanText(item))
    .filter((item) => {
      const normalized = item.toLowerCase();
      if (!normalized || seen.has(normalized)) {
        return false;
      }
      seen.add(normalized);
      return true;
    });
}

function getLocalizedText(
  value: LocalizedValue,
  language: SupportedLanguage
): string {
  if (!value) return "";
  if (typeof value === "string") return cleanText(value);

  return (
    cleanText(value[language]) ||
    cleanText(value.de) ||
    cleanText(value.en) ||
    cleanText(value.ar)
  );
}

function sanitizeStringArray(values: unknown[]): string[] {
  return values.map((item) => cleanText(item)).filter(Boolean);
}

function getLocalizedArray(
  value: string[] | Record<string, string[]> | null | undefined,
  language: SupportedLanguage
): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return sanitizeStringArray(value);
  }

  const localized =
    value[language] || value.de || value.en || value.ar || [];

  return Array.isArray(localized) ? sanitizeStringArray(localized) : [];
}

function buildGenericVoiceQueries(
  serviceTitle: string,
  language: SupportedLanguage
): string[] {
  const safeTitle = cleanText(serviceTitle);

  if (!safeTitle) return [];

  if (language === "de") {
    const lower = safeTitle.toLowerCase();
    return [
      `wie bestelle ich ${lower}`,
      `was kostet ${lower}`,
      `${lower} in meiner nähe`,
      `ich brauche ${lower} für mein unternehmen`,
      `${lower} anfragen`,
    ];
  }

  if (language === "en") {
    const lower = safeTitle.toLowerCase();
    return [
      `how do i order ${lower}`,
      `how much does ${lower} cost`,
      `${lower} near me`,
      `i need ${lower} for my business`,
      `request ${lower} service`,
    ];
  }

  return [
    `كيف أطلب ${safeTitle}`,
    `كم سعر ${safeTitle}`,
    `${safeTitle} بالقرب مني`,
    `أريد ${safeTitle} لمشروعي`,
    `طلب ${safeTitle}`,
  ];
}

function buildBaseDescription(
  language: SupportedLanguage,
  fallbackDescription?: string
): string {
  if (cleanText(fallbackDescription)) {
    return truncateText(fallbackDescription);
  }

  if (language === "de") {
    return truncateText(
      "Professionelle Anfrage für Druck, Werbetechnik und individuelle Produktionslösungen mit klarer Struktur, passender Weiterleitung und flexibler Projektaufnahme."
    );
  }

  if (language === "en") {
    return truncateText(
      "Professional request flow for print, signage, and custom production services with clear structure, smart routing, and flexible project intake."
    );
  }

  return truncateText(
    "نظام طلب احترافي لخدمات الطباعة والإعلان والتنفيذ، مع تنظيم واضح للطلب، وفهم أفضل للاحتياج، وتوجيه مناسب إلى جهة التنفيذ."
  );
}

function getServiceGuide(serviceId: string): GuideLike {
  return (getGuideById(serviceId) || {}) as GuideLike;
}

function buildServiceSeo(
  serviceId: string,
  language: SupportedLanguage
): ServiceSeoData {
  const guide = getServiceGuide(serviceId);

  if (serviceId === "signage") {
    if (language === "de") {
      return {
        title: "Ladenschilder & Lichtwerbung | Caro Bara Smart Print",
        description: truncateText(
          "Professionelle Ladenschilder, Profilbuchstaben und Lichtwerbung für Geschäfte, Unternehmen und gewerbliche Fassaden. Sende deine Anfrage auch dann, wenn noch nicht alle technischen Details feststehen."
        ),
        keywords: dedupeKeywords([
          "ladenschilder",
          "werbeschilder",
          "lichtwerbung",
          "firmenschild",
          "ladenschild",
          "leuchtreklame",
          "beschilderung",
          "außenwerbung",
          "reklametafel",
          "werbeschild erstellen lassen",
          "fassadenschild",
          "profilbuchstaben",
          "geschäftsschild",
          "schild für laden",
          "schild für firma",
          ...voiceQueries.signage.de,
          ...getLocalizedArray(guide.keywords, "de"),
          ...getLocalizedArray(guide.voiceQueries, "de"),
          ...getLocalizedArray(guide.synonyms, "de"),
          ...getLocalizedArray(guide.businessTypes, "de"),
          ...getLocalizedArray(guide.cityModifiers, "de"),
          ...globalKeywords.de,
          ...cityModifiers.de,
        ]),
      };
    }

    if (language === "en") {
      return {
        title: "Shop Signs & Light Advertising | Caro Bara Smart Print",
        description: truncateText(
          "Professional shop signs, raised letters, and light advertising for shops, companies, and commercial facades. Send your request even if some technical details are still unclear."
        ),
        keywords: dedupeKeywords([
          "shop signs",
          "business signs",
          "light advertising",
          "storefront signs",
          "custom signs",
          "illuminated signs",
          "raised letters",
          "sign maker",
          "commercial signage",
          "signage services",
          "facade sign",
          "lightbox sign",
          "business facade signs",
          "sign service near me",
          ...voiceQueries.signage.en,
          ...getLocalizedArray(guide.keywords, "en"),
          ...getLocalizedArray(guide.voiceQueries, "en"),
          ...getLocalizedArray(guide.synonyms, "en"),
          ...getLocalizedArray(guide.businessTypes, "en"),
          ...getLocalizedArray(guide.cityModifiers, "en"),
          ...globalKeywords.en,
          ...cityModifiers.en,
        ]),
      };
    }

    return {
      title: "لوحات المحلات والإضاءات | Caro Bara Smart Print",
      description: truncateText(
        "حلول احترافية للوحات المحلات، الحروف البارزة، والإضاءات التجارية للمحال والشركات والواجهات التجارية. أرسل طلبك حتى لو لم تكن كل التفاصيل الفنية واضحة بعد."
      ),
      keywords: dedupeKeywords([
        "لوحات محلات",
        "لوحات مضيئة",
        "إعلانات ضوئية",
        "لوحات واجهات",
        "تصميم لوحات",
        "تنفيذ لوحات",
        "حروف بارزة",
        "لوحات تجارية",
        "لوحة محل",
        "لوحات وإضاءات",
        "لوحات شركات",
        "لوحات واجهات تجارية",
        "خدمة لوحات",
        ...voiceQueries.signage.ar,
        ...getLocalizedArray(guide.keywords, "ar"),
        ...getLocalizedArray(guide.voiceQueries, "ar"),
        ...getLocalizedArray(guide.synonyms, "ar"),
        ...getLocalizedArray(guide.businessTypes, "ar"),
        ...getLocalizedArray(guide.cityModifiers, "ar"),
        ...globalKeywords.ar,
        ...cityModifiers.ar,
      ]),
    };
  }

  if (serviceId === "commercial-printing") {
    if (language === "de") {
      return {
        title: "Papierdruck & Geschäftsdruck | Caro Bara Smart Print",
        description: truncateText(
          "Professionelle Lösungen für Visitenkarten, Flyer, Broschüren, Speisekarten, Poster und weitere Geschäftsdrucksachen. Sende deine Anfrage strukturiert und auch dann, wenn noch nicht alle Druckdetails feststehen."
        ),
        keywords: dedupeKeywords([
          "papierdruck",
          "geschäftsdruck",
          "visitenkarten drucken",
          "flyer drucken",
          "broschüren drucken",
          "speisekarten drucken",
          "poster drucken",
          "drucksachen",
          "druckerei service",
          "druckanfrage",
          ...voiceQueries["commercial-printing"].de,
          ...getLocalizedArray(guide.keywords, "de"),
          ...getLocalizedArray(guide.voiceQueries, "de"),
          ...getLocalizedArray(guide.synonyms, "de"),
          ...getLocalizedArray(guide.businessTypes, "de"),
          ...getLocalizedArray(guide.cityModifiers, "de"),
          ...globalKeywords.de,
          ...cityModifiers.de,
        ]),
      };
    }

    if (language === "en") {
      return {
        title: "Paper & Commercial Printing | Caro Bara Smart Print",
        description: truncateText(
          "Professional solutions for business cards, flyers, brochures, menus, posters, and other commercial print products. Send a structured request even if some print details are still undecided."
        ),
        keywords: dedupeKeywords([
          "paper printing",
          "commercial printing",
          "business card printing",
          "flyer printing",
          "brochure printing",
          "menu printing",
          "poster printing",
          "print shop service",
          "business printing",
          "print request",
          ...voiceQueries["commercial-printing"].en,
          ...getLocalizedArray(guide.keywords, "en"),
          ...getLocalizedArray(guide.voiceQueries, "en"),
          ...getLocalizedArray(guide.synonyms, "en"),
          ...getLocalizedArray(guide.businessTypes, "en"),
          ...getLocalizedArray(guide.cityModifiers, "en"),
          ...globalKeywords.en,
          ...cityModifiers.en,
        ]),
      };
    }

    return {
      title: "الطباعة الورقية والتجارية | Caro Bara Smart Print",
      description: truncateText(
        "حلول احترافية لبطاقات الأعمال، الفلايرات، البروشورات، المنيوهات، البوسترات، وغيرها من المطبوعات التجارية. أرسل طلبك بشكل منظم حتى لو لم تكن كل تفاصيل الطباعة محسومة بعد."
      ),
      keywords: dedupeKeywords([
        "طباعة ورقية",
        "طباعة تجارية",
        "طباعة بطاقات أعمال",
        "طباعة فلايرات",
        "طباعة بروشورات",
        "طباعة منيوهات",
        "طباعة بوسترات",
        "مطبوعات تجارية",
        "خدمة طباعة",
        "طلب طباعة",
        ...voiceQueries["commercial-printing"].ar,
        ...getLocalizedArray(guide.keywords, "ar"),
        ...getLocalizedArray(guide.voiceQueries, "ar"),
        ...getLocalizedArray(guide.synonyms, "ar"),
        ...getLocalizedArray(guide.businessTypes, "ar"),
        ...getLocalizedArray(guide.cityModifiers, "ar"),
        ...globalKeywords.ar,
        ...cityModifiers.ar,
      ]),
    };
  }

  if (serviceId === "open-request") {
    if (language === "de") {
      return {
        title: "Offene intelligente Anfrage | Caro Bara Smart Print",
        description: truncateText(
          "Der richtige Einstieg, wenn dein Bedarf noch nicht vollständig klar ist. Sende eine strukturierte offene Anfrage für Druck, Werbung, Werbetechnik oder individuelle Produktionslösungen."
        ),
        keywords: dedupeKeywords([
          "offene anfrage",
          "intelligente anfrage",
          "druckberatung",
          "werbeanfrage",
          "projektanfrage",
          "individuelle anfrage",
          "unklare anfrage senden",
          "hilfe bei druckanfrage",
          ...voiceQueries["open-request"].de,
          ...getLocalizedArray(guide.keywords, "de"),
          ...getLocalizedArray(guide.voiceQueries, "de"),
          ...getLocalizedArray(guide.synonyms, "de"),
          ...getLocalizedArray(guide.businessTypes, "de"),
          ...getLocalizedArray(guide.cityModifiers, "de"),
          ...globalKeywords.de,
          ...cityModifiers.de,
        ]),
      };
    }

    if (language === "en") {
      return {
        title: "Smart Open Request | Caro Bara Smart Print",
        description: truncateText(
          "The right starting point when your need is not fully clear yet. Send a structured open request for print, advertising, signage, or custom production services."
        ),
        keywords: dedupeKeywords([
          "smart open request",
          "open request",
          "printing consultation",
          "advertising request",
          "project request",
          "custom production request",
          "structured inquiry",
          "help choosing service",
          ...voiceQueries["open-request"].en,
          ...getLocalizedArray(guide.keywords, "en"),
          ...getLocalizedArray(guide.voiceQueries, "en"),
          ...getLocalizedArray(guide.synonyms, "en"),
          ...getLocalizedArray(guide.businessTypes, "en"),
          ...getLocalizedArray(guide.cityModifiers, "en"),
          ...globalKeywords.en,
          ...cityModifiers.en,
        ]),
      };
    }

    return {
      title: "الطلب الذكي المفتوح | Caro Bara Smart Print",
      description: truncateText(
        "نقطة البداية الصحيحة عندما لا تكون حاجتك واضحة بالكامل بعد. أرسل طلبًا مفتوحًا ومنظمًا لخدمات الطباعة أو الإعلان أو اللوحات أو الحلول التنفيذية المخصصة."
      ),
      keywords: dedupeKeywords([
        "الطلب الذكي المفتوح",
        "طلب مفتوح",
        "استشارة طباعة",
        "استشارة إعلانية",
        "طلب مشروع",
        "خدمة مخصصة",
        "إرسال طلب ناقص التفاصيل",
        "المساعدة في اختيار الخدمة",
        ...voiceQueries["open-request"].ar,
        ...getLocalizedArray(guide.keywords, "ar"),
        ...getLocalizedArray(guide.voiceQueries, "ar"),
        ...getLocalizedArray(guide.synonyms, "ar"),
        ...getLocalizedArray(guide.businessTypes, "ar"),
        ...getLocalizedArray(guide.cityModifiers, "ar"),
        ...globalKeywords.ar,
        ...cityModifiers.ar,
      ]),
    };
  }

  const service = getServiceById(serviceId);

  const serviceTitle =
    cleanText(service?.title?.[language]) ||
    cleanText(service?.title?.de) ||
    cleanText(service?.title?.en) ||
    cleanText(service?.title?.ar) ||
    "Service";

  const serviceDescription =
    cleanText(service?.description?.[language]) ||
    cleanText(service?.description?.de) ||
    cleanText(service?.description?.en) ||
    cleanText(service?.description?.ar) ||
    "";

  const guideTitle =
    getLocalizedText(guide.seoTitle, language) ||
    getLocalizedText(guide.title, language);

  const guideDescription =
    getLocalizedText(guide.seoDescription, language) ||
    getLocalizedText(guide.description, language);

  const genericVoiceQueries = buildGenericVoiceQueries(serviceTitle, language);

  if (language === "de") {
    return {
      title: cleanText(`${guideTitle || serviceTitle} | ${siteName}`),
      description: buildBaseDescription(
        language,
        guideDescription || serviceDescription
      ),
      keywords: dedupeKeywords([
        serviceTitle.toLowerCase(),
        "druck",
        "werbung",
        "print service",
        "individuelle anfrage",
        "werbetechnik",
        "geschäftsdruck",
        "produktion",
        ...genericVoiceQueries,
        ...getLocalizedArray(guide.keywords, "de"),
        ...getLocalizedArray(guide.voiceQueries, "de"),
        ...getLocalizedArray(guide.synonyms, "de"),
        ...getLocalizedArray(guide.businessTypes, "de"),
        ...getLocalizedArray(guide.cityModifiers, "de"),
        ...globalKeywords.de,
        ...cityModifiers.de,
      ]),
    };
  }

  if (language === "en") {
    return {
      title: cleanText(`${guideTitle || serviceTitle} | ${siteName}`),
      description: buildBaseDescription(
        language,
        guideDescription || serviceDescription
      ),
      keywords: dedupeKeywords([
        serviceTitle.toLowerCase(),
        "printing",
        "signage",
        "advertising",
        "custom print request",
        "production service",
        "commercial print",
        "visual production",
        ...genericVoiceQueries,
        ...getLocalizedArray(guide.keywords, "en"),
        ...getLocalizedArray(guide.voiceQueries, "en"),
        ...getLocalizedArray(guide.synonyms, "en"),
        ...getLocalizedArray(guide.businessTypes, "en"),
        ...getLocalizedArray(guide.cityModifiers, "en"),
        ...globalKeywords.en,
        ...cityModifiers.en,
      ]),
    };
  }

  return {
    title: cleanText(`${guideTitle || serviceTitle} | ${siteName}`),
    description: buildBaseDescription(
      language,
      guideDescription || serviceDescription
    ),
    keywords: dedupeKeywords([
      serviceTitle,
      "طباعة",
      "إعلان",
      "لوحات",
      "طلب طباعة",
      "تنفيذ",
      "طباعة تجارية",
      "خدمة مخصصة",
      ...genericVoiceQueries,
      ...getLocalizedArray(guide.keywords, "ar"),
      ...getLocalizedArray(guide.voiceQueries, "ar"),
      ...getLocalizedArray(guide.synonyms, "ar"),
      ...getLocalizedArray(guide.businessTypes, "ar"),
      ...getLocalizedArray(guide.cityModifiers, "ar"),
      ...globalKeywords.ar,
      ...cityModifiers.ar,
    ]),
  };
}

function buildOgImageUrl(serviceId: string): string {
  return `${siteUrl}/services/${encodeURIComponent(serviceId)}.jpg`;
}

function getCanonicalUrl(serviceId: string): string {
  return `${siteUrl}/request/service/${encodeURIComponent(serviceId)}`;
}

function buildServiceSchema(serviceId: string) {
  const service = getServiceById(serviceId);
  const guide = getServiceGuide(serviceId);

  const deSeo = buildServiceSeo(serviceId, "de");
  const enSeo = buildServiceSeo(serviceId, "en");
  const arSeo = buildServiceSeo(serviceId, "ar");

  const serviceName =
    cleanText(service?.title?.de) ||
    cleanText(service?.title?.en) ||
    cleanText(service?.title?.ar) ||
    cleanText(serviceId);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    alternateName: dedupeKeywords([
      service?.title?.en,
      service?.title?.ar,
      service?.title?.de,
    ]),
    description: deSeo.description,
    url: getCanonicalUrl(serviceId),
    serviceType: dedupeKeywords([
      serviceName,
      ...getLocalizedArray(guide.synonyms, "de"),
      ...getLocalizedArray(guide.synonyms, "en"),
      ...getLocalizedArray(guide.synonyms, "ar"),
    ]),
    areaServed: dedupeKeywords(["Deutschland", "Germany", "Berlin"]),
    availableLanguage: ["de", "en", "ar"],
    provider: {
      "@type": "Organization",
      name: "Caro Bara",
      url: siteUrl,
    },
    audience: {
      "@type": "BusinessAudience",
      audienceType: dedupeKeywords([
        ...getLocalizedArray(guide.businessTypes, "de"),
        ...getLocalizedArray(guide.businessTypes, "en"),
        ...getLocalizedArray(guide.businessTypes, "ar"),
        "Unternehmen",
        "Businesses",
        "شركات",
      ]),
    },
    keywords: dedupeKeywords([
      ...deSeo.keywords,
      ...enSeo.keywords,
      ...arSeo.keywords,
    ]).join(", "),
  };
}

function buildFaqJsonLd(serviceId: string) {
  const guide = getServiceGuide(serviceId);

  const faqItems =
    guide.faq
      ?.map((item) => {
        const question =
          getLocalizedText(item.question, "de") ||
          getLocalizedText(item.question, "en") ||
          getLocalizedText(item.question, "ar");

        const answer =
          getLocalizedText(item.answer, "de") ||
          getLocalizedText(item.answer, "en") ||
          getLocalizedText(item.answer, "ar");

        if (!question || !answer) return null;

        return {
          "@type": "Question",
          name: question,
          acceptedAnswer: {
            "@type": "Answer",
            text: answer,
          },
        };
      })
      .filter(Boolean) || [];

  if (!faqItems.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceId } = await params;

  const service = getServiceById(serviceId);

  const deSeo = buildServiceSeo(serviceId, "de");
  const enSeo = buildServiceSeo(serviceId, "en");
  const arSeo = buildServiceSeo(serviceId, "ar");

  const canonicalUrl = getCanonicalUrl(serviceId);
  const ogImage = buildOgImageUrl(serviceId);

  const serviceNameForAlt =
    cleanText(service?.title?.de) ||
    cleanText(service?.title?.en) ||
    cleanText(service?.title?.ar) ||
    cleanText(serviceId);

  return {
    metadataBase: new URL(siteUrl),
    title: deSeo.title,
    description: deSeo.description,
    keywords: dedupeKeywords([
      ...deSeo.keywords,
      ...enSeo.keywords,
      ...arSeo.keywords,
    ]),
    applicationName: siteName,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "de-DE": canonicalUrl,
        "en-US": canonicalUrl,
        "ar-DE": canonicalUrl,
        "x-default": canonicalUrl,
      },
    },
    openGraph: {
      title: deSeo.title,
      description: deSeo.description,
      url: canonicalUrl,
      siteName,
      type: "website",
      locale: "de_DE",
      images: [
        {
          url: ogImage || defaultOgImage,
          width: 1200,
          height: 630,
          alt: serviceNameForAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: deSeo.title,
      description: deSeo.description,
      images: [ogImage || defaultOgImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    category: "printing",
    other: {
      "content-language": "de, en, ar",
      "service:seo:de:title": deSeo.title,
      "service:seo:en:title": enSeo.title,
      "service:seo:ar:title": arSeo.title,
      "service:seo:de:description": deSeo.description,
      "service:seo:en:description": enSeo.description,
      "service:seo:ar:description": arSeo.description,
      "service:voice:de": deSeo.keywords.slice(0, 12).join(" | "),
      "service:voice:en": enSeo.keywords.slice(0, 12).join(" | "),
      "service:voice:ar": arSeo.keywords.slice(0, 12).join(" | "),
      "service:id": serviceId,
      "local-seo-layer": "Berlin, Deutschland",
    },
  };
}

export default async function ServiceLayout({
  children,
  params,
}: Props) {
  const { serviceId } = await params;

  const serviceSchema = buildServiceSchema(serviceId);
  const faqJsonLd = buildFaqJsonLd(serviceId);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd),
          }}
        />
      ) : null}
      {children}
    </>
  );
}