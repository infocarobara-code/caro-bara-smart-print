import { categories } from "@/data/categories";

export type LanguageCode = "ar" | "de" | "en";

export type LocalizedText = {
  ar: string;
  de: string;
  en: string;
};

export type GuideFaqItem = {
  question: LocalizedText;
  answer: LocalizedText;
};

export type GuideUseCase = {
  title: LocalizedText;
  description: LocalizedText;
};

export type GuideLinkItem = {
  label: LocalizedText;
  href: string;
};

export type GuideSection = {
  title: LocalizedText;
  summary: LocalizedText;
  seoTitle: LocalizedText;
  seoDescription: LocalizedText;
  intro: LocalizedText;
  expandedGuide: LocalizedText;
  voiceQueries: LocalizedText[];
  keywords: LocalizedText[];
  faq: GuideFaqItem[];
  useCases: GuideUseCase[];
  relatedCategories: string[];
  relatedServices: string[];
  internalLinks: GuideLinkItem[];
  businessTypes: LocalizedText[];
  cityModifiers: LocalizedText[];
  synonyms: LocalizedText[];
};

export type GuidesMap = Record<string, GuideSection>;

function makeLocalized(ar: string, de: string, en: string): LocalizedText {
  return { ar, de, en };
}

function makeGuideLink(ar: string, de: string, en: string, href: string): GuideLinkItem {
  return {
    label: makeLocalized(ar, de, en),
    href,
  };
}

function dedupeStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function dedupeLocalizedTextItems(values: LocalizedText[]) {
  const seen = new Set<string>();

  return values.filter((item) => {
    const key = `${item.ar}__${item.de}__${item.en}`.trim();
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function dedupeGuideLinks(values: GuideLinkItem[]) {
  const seen = new Set<string>();

  return values.filter((item) => {
    const key = `${item.href}__${item.label.ar}__${item.label.de}__${item.label.en}`.trim();
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

const categoryIdSet = new Set(categories.map((category) => category.id));

function buildCategoryRequestHref(categoryId: string) {
  return `/request/category/${categoryId}`;
}

function buildCategoryGuideHref(categoryId: string) {
  return `/guide/category/${categoryId}`;
}

function isRealCategory(categoryId: string) {
  return categoryIdSet.has(categoryId);
}

function createDefaultCategoryRequestLink(categoryId: string): GuideLinkItem {
  const guide = rawGuides[categoryId];
  const localizedTitle = guide?.title || makeLocalized(categoryId, categoryId, categoryId);

  return {
    label: makeLocalized(
      `استعراض فئة ${localizedTitle.ar}`,
      `Kategorie ${localizedTitle.de} ansehen`,
      `Explore ${localizedTitle.en}`
    ),
    href: buildCategoryRequestHref(categoryId),
  };
}

function createDefaultCategoryGuideLink(categoryId: string): GuideLinkItem {
  const guide = rawGuides[categoryId];
  const localizedTitle = guide?.title || makeLocalized(categoryId, categoryId, categoryId);

  return {
    label: makeLocalized(
      `دليل ${localizedTitle.ar}`,
      `Leitfaden für ${localizedTitle.de}`,
      `${localizedTitle.en} Guide`
    ),
    href: buildCategoryGuideHref(categoryId),
  };
}

function enrichGuideInternalLinks(guideId: string, guide: GuideSection): GuideLinkItem[] {
  const smartBaseLinks: GuideLinkItem[] = [
    makeGuideLink(
      "العودة إلى الفئات",
      "Zu den Kategorien",
      "Back to Categories",
      "/request"
    ),
    makeGuideLink(
      "دليل المنصة",
      "Plattform-Leitfaden",
      "Platform Guide",
      "/platform-guide"
    ),
  ];

  const selfLinks: GuideLinkItem[] = isRealCategory(guideId)
    ? [
        createDefaultCategoryGuideLink(guideId),
        createDefaultCategoryRequestLink(guideId),
      ]
    : [];

  const relatedCategoryLinks = guide.relatedCategories.flatMap((relatedId) => {
    if (!isRealCategory(relatedId)) {
      return [];
    }

    return [
      createDefaultCategoryGuideLink(relatedId),
      createDefaultCategoryRequestLink(relatedId),
    ];
  });

  return dedupeGuideLinks([
    ...guide.internalLinks,
    ...smartBaseLinks,
    ...selfLinks,
    ...relatedCategoryLinks,
  ]);
}

function enrichGuideKeywords(guide: GuideSection): LocalizedText[] {
  const builtFromSynonyms = guide.synonyms;
  const builtFromBusinessTypes = guide.businessTypes.map((item) =>
    makeLocalized(
      `${guide.title.ar} ${item.ar}`,
      `${guide.title.de} ${item.de}`,
      `${guide.title.en} ${item.en}`
    )
  );
  const builtFromCityModifiers = guide.cityModifiers.map((item) =>
    makeLocalized(
      `${guide.title.ar} ${item.ar}`,
      `${guide.title.de} ${item.de}`,
      `${guide.title.en} ${item.en}`
    )
  );

  return dedupeLocalizedTextItems([
    ...guide.keywords,
    ...builtFromSynonyms,
    ...builtFromBusinessTypes,
    ...builtFromCityModifiers,
  ]);
}

function enrichGuideVoiceQueries(guide: GuideSection): LocalizedText[] {
  const derivedVoiceQueries = [
    makeLocalized(
      `كيف أطلب ${guide.title.ar}`,
      `Wie bestelle ich ${guide.title.de}`,
      `How do I order ${guide.title.en}`
    ),
    makeLocalized(
      `كم سعر ${guide.title.ar}`,
      `Was kostet ${guide.title.de}`,
      `How much does ${guide.title.en} cost`
    ),
    makeLocalized(
      `${guide.title.ar} بالقرب مني`,
      `${guide.title.de} in meiner Nähe`,
      `${guide.title.en} near me`
    ),
    makeLocalized(
      `أحتاج ${guide.title.ar} لمشروعي`,
      `Ich brauche ${guide.title.de} für mein Projekt`,
      `I need ${guide.title.en} for my project`
    ),
  ];

  return dedupeLocalizedTextItems([...guide.voiceQueries, ...derivedVoiceQueries]);
}

function enrichGuides(source: GuidesMap): GuidesMap {
  return Object.fromEntries(
    Object.entries(source).map(([guideId, guide]) => [
      guideId,
      {
        ...guide,
        relatedCategories: dedupeStrings(guide.relatedCategories),
        relatedServices: dedupeStrings(guide.relatedServices),
        keywords: enrichGuideKeywords(guide),
        voiceQueries: enrichGuideVoiceQueries(guide),
        internalLinks: enrichGuideInternalLinks(guideId, guide),
      },
    ])
  );
}

export function getLocalizedGuideText(
  value: LocalizedText | undefined,
  language: LanguageCode,
  fallback = ""
) {
  if (!value) return fallback;
  return value[language] || value.en || value.de || value.ar || fallback;
}

export function getGuideById(id: string) {
  return guides[id] || null;
}

export function getGuideVoiceQueries(id: string, language: LanguageCode) {
  const guide = getGuideById(id);
  if (!guide) return [];
  return guide.voiceQueries.map((item) => getLocalizedGuideText(item, language));
}

export function getGuideKeywords(id: string, language: LanguageCode) {
  const guide = getGuideById(id);
  if (!guide) return [];
  return guide.keywords.map((item) => getLocalizedGuideText(item, language));
}

export function getGuideFaq(id: string) {
  const guide = getGuideById(id);
  return guide?.faq || [];
}

export function getGuideInternalLinks(id: string) {
  const guide = getGuideById(id);
  return guide?.internalLinks || [];
}

export function getGuideSmartInternalLinks(
  id: string,
  options?: {
    limit?: number;
    prioritizeGuides?: boolean;
  }
) {
  const guide = getGuideById(id);
  if (!guide) return [];

  const { limit, prioritizeGuides = true } = options || {};

  const links = [...guide.internalLinks].sort((a, b) => {
    if (!prioritizeGuides) return 0;

    const aGuide = a.href.startsWith("/guide/");
    const bGuide = b.href.startsWith("/guide/");

    if (aGuide === bGuide) return 0;
    return aGuide ? -1 : 1;
  });

  if (!limit || limit <= 0) {
    return links;
  }

  return links.slice(0, limit);
}

export function getGuideRelatedCategoryIds(id: string) {
  const guide = getGuideById(id);
  if (!guide) return [];
  return guide.relatedCategories.filter((categoryId) => isRealCategory(categoryId));
}

export function getGuideRelatedRequestLinks(id: string): GuideLinkItem[] {
  const guide = getGuideById(id);
  if (!guide) return [];

  return guide.relatedCategories
    .filter((categoryId) => isRealCategory(categoryId))
    .map((categoryId) => createDefaultCategoryRequestLink(categoryId));
}

export function getGuideRelatedGuideLinks(id: string): GuideLinkItem[] {
  const guide = getGuideById(id);
  if (!guide) return [];

  return guide.relatedCategories
    .filter((categoryId) => isRealCategory(categoryId))
    .map((categoryId) => createDefaultCategoryGuideLink(categoryId));
}

export function hasGuide(id: string) {
  return Boolean(guides[id]);
}

const rawGuides: GuidesMap = {
  smart: {
    title: makeLocalized(
      "الطلب الذكي",
      "Intelligente Anfrage",
      "Smart Request"
    ),
    summary: makeLocalized(
      "هذا المسار مناسب لمن لديه فكرة عامة لكنه لا يعرف اسم الخدمة الدقيقة بعد.",
      "Dieser Bereich ist ideal für Menschen, die ihr Ziel kennen, aber noch nicht genau wissen, welche Leistung sie brauchen.",
      "This path is ideal for people who know their goal but are not yet sure which exact service they need."
    ),
    seoTitle: makeLocalized(
      "الطلب الذكي لخدمات الطباعة والإعلانات",
      "Intelligente Anfrage für Druck- und Werbelösungen",
      "Smart Request for Print and Advertising Solutions"
    ),
    seoDescription: makeLocalized(
      "ابدأ بطلب ذكي إذا لم تكن تعرف اسم الخدمة الدقيقة. هذا المسار يساعدك على تحويل الفكرة إلى طلب منظم وقابل للتنفيذ.",
      "Starte mit einer intelligenten Anfrage, wenn du den genauen Servicenamen noch nicht kennst. Dieser Bereich hilft dir, eine Idee in eine strukturierte und umsetzbare Anfrage zu verwandeln.",
      "Start with a smart request if you do not yet know the exact service name. This path helps turn an idea into a clear and production-ready request."
    ),
    intro: makeLocalized(
      "هذا القسم مخصص للعملاء الذين يعرفون الهدف لكنهم يحتاجون إلى مساعدة في تحديد المسار الصحيح.",
      "Dieser Bereich ist für Kunden gedacht, die ihr Ziel kennen, aber Unterstützung bei der Wahl des richtigen Weges brauchen.",
      "This section is for customers who know their objective but need help choosing the right path."
    ),
    expandedGuide: makeLocalized(
      "إذا كنت تريد تجهيز مشروع جديد، أو تطوير محل، أو طباعة مواد دعائية لكنك غير متأكد من اسم الخدمة، فإن الطلب الذكي هو البداية الصحيحة. بدلًا من الضياع بين عشرات الخيارات، يساعدك هذا المسار على ترتيب الفكرة، كشف النواقص، وتوجيه الطلب إلى الخدمة الأقرب لما تحتاجه فعليًا.",
      "Wenn du ein neues Projekt vorbereitest, ein Geschäft aufbauen möchtest oder Werbematerial brauchst, aber den genauen Servicenamen nicht kennst, ist die intelligente Anfrage der richtige Start. Statt zwischen vielen Optionen verloren zu gehen, hilft dir dieser Bereich dabei, die Idee zu ordnen, Lücken zu erkennen und die passende Leistung zu finden.",
      "If you are preparing a new project, improving a shop, or ordering promotional materials but do not know the exact service name, the smart request is the right starting point. Instead of getting lost among many options, this path helps organize the idea, identify missing details, and direct the request to the most suitable service."
    ),
    voiceQueries: [
      makeLocalized(
        "أريد شيئًا لمشروعي لكنني لا أعرف اسم الخدمة",
        "Ich brauche etwas für mein Projekt, kenne aber den genauen Service nicht",
        "I need something for my project but I do not know the exact service"
      ),
      makeLocalized(
        "كيف أبدأ طلب إعلان أو طباعة لمحل جديد",
        "Wie starte ich eine Werbe- oder Druckanfrage für ein neues Geschäft",
        "How do I start a print or advertising request for a new business"
      ),
      makeLocalized(
        "أحتاج مساعدة لاختيار الخدمة المناسبة",
        "Ich brauche Hilfe bei der Auswahl der richtigen Leistung",
        "I need help choosing the right service"
      ),
    ],
    keywords: [
      makeLocalized("طلب ذكي", "intelligente Anfrage", "smart request"),
      makeLocalized("اختيار الخدمة", "Leistung auswählen", "choose service"),
      makeLocalized("فهم الطلب", "Anfrage verstehen", "understand request"),
      makeLocalized("تنظيم الطلب", "Anfrage strukturieren", "structure request"),
    ],
    faq: [
      {
        question: makeLocalized(
          "متى أستخدم الطلب الذكي؟",
          "Wann sollte ich die intelligente Anfrage nutzen?",
          "When should I use the smart request?"
        ),
        answer: makeLocalized(
          "استخدمه عندما تكون لديك فكرة أو هدف لكنك لا تعرف الخدمة الأدق التي تناسبه.",
          "Nutze ihn, wenn du eine Idee oder ein Ziel hast, aber noch nicht weißt, welche Leistung am besten passt.",
          "Use it when you have an idea or objective but do not yet know which exact service fits best."
        ),
      },
      {
        question: makeLocalized(
          "هل أحتاج كل التفاصيل من البداية؟",
          "Muss ich von Anfang an alle Details kennen?",
          "Do I need all details from the beginning?"
        ),
        answer: makeLocalized(
          "لا، يكفي أن تشرح الفكرة الأساسية، وبعد ذلك يمكن ترتيبها وتحويلها إلى طلب أوضح.",
          "Nein. Es reicht, die Grundidee zu erklären. Danach kann sie in eine klarere Anfrage umgewandelt werden.",
          "No. It is enough to explain the basic idea first, then it can be shaped into a clearer request."
        ),
      },
    ],
    useCases: [
      {
        title: makeLocalized(
          "مشروع جديد",
          "Neues Projekt",
          "New Project"
        ),
        description: makeLocalized(
          "مناسب لمن يريد تجهيز مشروع من الصفر ولا يعرف كل الخدمات التي سيحتاجها.",
          "Ideal für Menschen, die ein Projekt von Grund auf vorbereiten und noch nicht alle benötigten Leistungen kennen.",
          "Ideal for someone starting a project from scratch and not yet knowing all required services."
        ),
      },
      {
        title: makeLocalized(
          "تطوير محل قائم",
          "Bestehendes Geschäft verbessern",
          "Upgrade an Existing Shop"
        ),
        description: makeLocalized(
          "يفيد أصحاب المحلات الذين يريدون تحسين المظهر أو الطباعة أو الواجهة دون معرفة التسمية الدقيقة لكل خدمة.",
          "Hilfreich für Ladenbesitzer, die Erscheinungsbild, Druck oder Fassade verbessern möchten, ohne jede Leistung genau benennen zu können.",
          "Helpful for shop owners who want to improve appearance, print, or signage without knowing the exact name of each service."
        ),
      },
    ],
    relatedCategories: ["signage", "printing", "branding", "marketing"],
    relatedServices: [],
    internalLinks: [
      {
        label: makeLocalized(
          "الذهاب إلى الفئات",
          "Zu den Kategorien",
          "Go to Categories"
        ),
        href: "/request",
      },
      {
        label: makeLocalized(
          "دليل المنصة",
          "Plattform-Leitfaden",
          "Platform Guide"
        ),
        href: "/platform-guide",
      },
    ],
    businessTypes: [
      makeLocalized("محل جديد", "neues Geschäft", "new shop"),
      makeLocalized("مطعم", "Restaurant", "restaurant"),
      makeLocalized("شركة ناشئة", "Start-up", "startup"),
    ],
    cityModifiers: [
      makeLocalized("في مدينتك", "in deiner Stadt", "in your city"),
      makeLocalized("في ألمانيا", "in Deutschland", "in Germany"),
      makeLocalized("بالقرب مني", "in meiner Nähe", "near me"),
      makeLocalized("محليًا", "lokal", "locally"),
    ],
    synonyms: [
      makeLocalized("طلب مخصص", "individuelle Anfrage", "custom request"),
      makeLocalized("مسار ذكي", "smarter Weg", "smart path"),
      makeLocalized("اختيار الخدمة", "Servicewahl", "service selection"),
    ],
  },

  signage: {
    title: makeLocalized(
      "لوحات المحلات والإضاءات",
      "Ladenschilder und Beleuchtung",
      "Shop Signs and Illumination"
    ),
    summary: makeLocalized(
      "هذه الفئة مخصصة للوحات الخارجية والداخلية، الحروف البارزة، اللوحات المضيئة، وتجهيز واجهات المحلات.",
      "Diese Kategorie ist für Außen- und Innenschilder, Profilbuchstaben, Leuchtschilder und Ladenfassaden gedacht.",
      "This category is for indoor and outdoor signs, raised letters, illuminated signage, and storefront facades."
    ),
    seoTitle: makeLocalized(
      "لوحات المحلات والواجهات والإضاءات التجارية",
      "Ladenschilder, Fassaden und Lichtwerbung",
      "Shop Signs, Facades, and Commercial Illumination"
    ),
    seoDescription: makeLocalized(
      "حلول احترافية للوحات المحلات، الحروف البارزة، الصناديق الضوئية، والواجهات التجارية للمشاريع التي تحتاج إلى ظهور واضح وثقة بصرية قوية.",
      "Professionelle Lösungen für Ladenschilder, Profilbuchstaben, Leuchtkästen und Geschäftsfassaden für Projekte, die klare Sichtbarkeit und starke visuelle Wirkung brauchen.",
      "Professional solutions for shop signs, raised letters, light boxes, and commercial facades for businesses that need strong visibility and visual trust."
    ),
    intro: makeLocalized(
      "إذا كان هدفك هو إبراز المحل أو الشركة من الخارج أو الداخل، فهذه الفئة هي نقطة البداية الصحيحة.",
      "Wenn dein Ziel darin besteht, ein Geschäft oder Unternehmen außen oder innen sichtbar zu machen, ist diese Kategorie der richtige Startpunkt.",
      "If your goal is to make a shop or business stand out inside or outside, this category is the right starting point."
    ),
    expandedGuide: makeLocalized(
      "تشمل هذه الفئة اللوحات المضيئة وغير المضيئة، الحروف البارزة، صناديق الإضاءة، الواجهات التجارية، اللوحات التعريفية، ولوحات الممرات أو المكاتب. وهي مناسبة للمحلات، المطاعم، العيادات، الشركات، وصالات العرض التي تحتاج إلى ظهور واضح وثقة بصرية قوية.",
      "Diese Kategorie umfasst beleuchtete und unbeleuchtete Schilder, Profilbuchstaben, Leuchtkästen, Geschäftsfassaden, Orientierungsschilder und Beschilderung für Büros oder Wege. Sie eignet sich für Geschäfte, Restaurants, Praxen, Unternehmen und Showrooms, die klare Sichtbarkeit und starke visuelle Wirkung brauchen.",
      "This category includes illuminated and non-illuminated signs, raised letters, light boxes, storefront facades, directional signs, and office signage. It is suitable for shops, restaurants, clinics, companies, and showrooms that need strong visibility and trust."
    ),
    voiceQueries: [
      makeLocalized(
        "أريد لوحة مضيئة لمحل",
        "Ich brauche ein beleuchtetes Schild für ein Geschäft",
        "I need an illuminated sign for a shop"
      ),
      makeLocalized(
        "كم سعر لوحة واجهة محل",
        "Was kostet ein Ladenschild",
        "How much does a storefront sign cost"
      ),
      makeLocalized(
        "أحتاج حروف بارزة لمتجري",
        "Ich brauche Profilbuchstaben für mein Geschäft",
        "I need raised letters for my shop"
      ),
      makeLocalized(
        "أريد لوحة محل قريبة مني",
        "Ich brauche ein Ladenschild in meiner Nähe",
        "I need a shop sign near me"
      ),
    ],
    keywords: [
      makeLocalized("لوحات محلات", "Ladenschilder", "shop signs"),
      makeLocalized("لوحة مضيئة", "Leuchtschild", "illuminated sign"),
      makeLocalized("حروف بارزة", "Profilbuchstaben", "raised letters"),
      makeLocalized("واجهة محل", "Ladenfassade", "storefront facade"),
      makeLocalized("صندوق ضوئي", "Leuchtkasten", "light box"),
    ],
    faq: [
      {
        question: makeLocalized(
          "ما الفرق بين اللوحة المضيئة وغير المضيئة؟",
          "Was ist der Unterschied zwischen beleuchteten und unbeleuchteten Schildern?",
          "What is the difference between illuminated and non-illuminated signs?"
        ),
        answer: makeLocalized(
          "اللوحة المضيئة تعطي ظهورًا أقوى ليلًا وفي الواجهات التجارية، بينما غير المضيئة قد تكون مناسبة عند الحاجة إلى حل أبسط أو أقل تكلفة.",
          "Beleuchtete Schilder bieten besonders abends und an Geschäftsfronten mehr Sichtbarkeit. Unbeleuchtete Varianten eignen sich eher für einfachere oder günstigere Lösungen.",
          "Illuminated signs provide stronger visibility, especially at night and on commercial facades, while non-illuminated signs can suit simpler or lower-cost solutions."
        ),
      },
      {
        question: makeLocalized(
          "هل هذه الفئة مناسبة للمطاعم والمحلات؟",
          "Ist diese Kategorie für Restaurants und Geschäfte geeignet?",
          "Is this category suitable for restaurants and shops?"
        ),
        answer: makeLocalized(
          "نعم، وهي من أكثر الفئات ارتباطًا بالمطاعم والمحلات والعيادات وصالات العرض.",
          "Ja, sie gehört zu den wichtigsten Kategorien für Restaurants, Geschäfte, Praxen und Showrooms.",
          "Yes, it is one of the most relevant categories for restaurants, shops, clinics, and showrooms."
        ),
      },
    ],
    useCases: [
      {
        title: makeLocalized(
          "واجهة محل جديد",
          "Neue Ladenfassade",
          "New Storefront"
        ),
        description: makeLocalized(
          "عند افتتاح محل جديد تحتاج إلى لوحة واضحة تبني الانطباع الأول وتُظهر الاسم بشكل احترافي.",
          "Beim Start eines neuen Geschäfts brauchst du ein klares Schild, das den ersten Eindruck stärkt und den Namen professionell zeigt.",
          "When opening a new shop, you need a clear sign that builds a strong first impression and presents the brand professionally."
        ),
      },
      {
        title: makeLocalized(
          "تجديد علامة قديمة",
          "Altes Schild erneuern",
          "Replace an Old Sign"
        ),
        description: makeLocalized(
          "مناسب عندما تكون لديك لوحة قديمة وتريد تجديدها بهوية أقوى ومظهر أحدث.",
          "Geeignet, wenn du ein altes Schild ersetzen und mit stärkerer Identität und modernerem Eindruck neu aufbauen willst.",
          "Suitable when you already have an old sign and want a stronger identity and more modern appearance."
        ),
      },
    ],
    relatedCategories: ["surfaces", "branding", "fabrication", "marketing"],
    relatedServices: [],
    internalLinks: [
      {
        label: makeLocalized(
          "العودة إلى الفئات",
          "Zurück zu den Kategorien",
          "Back to Categories"
        ),
        href: "/request",
      },
      {
        label: makeLocalized(
          "دليل الفئة",
          "Kategorie-Leitfaden",
          "Category Guide"
        ),
        href: "/guide/category/signage",
      },
    ],
    businessTypes: [
      makeLocalized("مطعم", "Restaurant", "restaurant"),
      makeLocalized("صالون", "Salon", "salon"),
      makeLocalized("عيادة", "Praxis", "clinic"),
      makeLocalized("شركة", "Unternehmen", "company"),
    ],
    cityModifiers: [
      makeLocalized("في مدينتك", "in deiner Stadt", "in your city"),
      makeLocalized("للمحلات", "für Geschäfte", "for shops"),
      makeLocalized("بالقرب مني", "in meiner Nähe", "near me"),
      makeLocalized("في ألمانيا", "in Deutschland", "in Germany"),
    ],
    synonyms: [
      makeLocalized("لوحات إعلانية", "Werbeschilder", "advertising signs"),
      makeLocalized("لوحات واجهات", "Fassadenschilder", "facade signs"),
      makeLocalized("لوحات تجارية", "Geschäftsschilder", "commercial signs"),
    ],
  },

  surfaces: {
    title: makeLocalized(
      "الزجاج واللصق والأسطح",
      "Glas, Folierung und Flächen",
      "Glass, Films, and Surface Graphics"
    ),
    summary: makeLocalized(
      "هذه الفئة مناسبة لفروستد الزجاج، ون واي فيجن، وستيكرات الأسطح والمساحات الزجاجية.",
      "Diese Kategorie eignet sich für Milchglasfolie, One-Way-Vision und Folien auf Glas- oder anderen Flächen.",
      "This category is suitable for frosted films, one-way vision, and adhesive graphics on glass or other surfaces."
    ),
    seoTitle: makeLocalized(
      "ستيكرات الزجاج والفروستد وتغليف الأسطح",
      "Glasfolien, Milchglasfolie und Flächengrafiken",
      "Glass Stickers, Frosted Film, and Surface Graphics"
    ),
    seoDescription: makeLocalized(
      "حلول للزجاج التجاري، الفروستد، ون واي فيجن، وتغليف الأسطح بشكل احترافي للمكاتب والمحلات والواجهات.",
      "Lösungen für Geschäftsfenster, Milchglasfolie, One-Way-Vision und professionelle Folierung für Büros, Geschäfte und Fassaden.",
      "Solutions for commercial glass, frosted film, one-way vision, and professional surface graphics for offices, shops, and facades."
    ),
    intro: makeLocalized(
      "إذا كنت تريد الخصوصية أو الديكور أو الاستفادة من الزجاج كمساحة بصرية، فهذه الفئة مناسبة لك.",
      "Wenn du Privatsphäre, Dekoration oder die Nutzung von Glas als visuelle Fläche suchst, ist diese Kategorie passend.",
      "If you want privacy, decoration, or better use of glass as a visual surface, this category is a good fit."
    ),
    expandedGuide: makeLocalized(
      "تشمل هذه الفئة ملصقات الزجاج، فروستد للأبواب والنوافذ، ون واي فيجن للواجهات، وستيكرات تعريفية أو زخرفية على الزجاج والأسطح. وهي مناسبة للمكاتب، المطاعم، العيادات، المحلات، وصالات العرض.",
      "Diese Kategorie umfasst Glassticker, Milchglasfolie für Türen und Fenster, One-Way-Vision für Fassaden sowie dekorative oder informative Folien auf Glas und anderen Flächen. Sie eignet sich für Büros, Restaurants, Praxen, Geschäfte und Showrooms.",
      "This category includes glass stickers, frosted films for doors and windows, one-way vision for facades, and decorative or informative graphics on glass and surfaces. It suits offices, restaurants, clinics, shops, and showrooms."
    ),
    voiceQueries: [
      makeLocalized(
        "أريد فروستد على زجاج المحل",
        "Ich brauche Milchglasfolie auf meinem Schaufenster",
        "I need frosted film on my shop glass"
      ),
      makeLocalized(
        "أحتاج ستيكر على الواجهة الزجاجية",
        "Ich brauche Sticker auf einer Glasfassade",
        "I need stickers on a glass facade"
      ),
      makeLocalized(
        "أريد تغليف زجاج قريب مني",
        "Ich brauche Glasfolierung in meiner Nähe",
        "I need glass graphics near me"
      ),
    ],
    keywords: [
      makeLocalized("فروستد", "Milchglasfolie", "frosted film"),
      makeLocalized("ستيكر زجاج", "Glassticker", "glass sticker"),
      makeLocalized("ون واي فيجن", "One-Way-Vision", "one-way vision"),
      makeLocalized("تغليف زجاج", "Glasfolierung", "glass graphics"),
    ],
    faq: [],
    useCases: [],
    relatedCategories: ["signage", "branding", "vehicle"],
    relatedServices: [],
    internalLinks: [
      {
        label: makeLocalized(
          "دليل فئة الزجاج",
          "Leitfaden für Glas und Folierung",
          "Glass and Film Guide"
        ),
        href: "/guide/category/surfaces",
      },
    ],
    businessTypes: [
      makeLocalized("مكتب", "Büro", "office"),
      makeLocalized("مطعم", "Restaurant", "restaurant"),
      makeLocalized("عيادة", "Praxis", "clinic"),
    ],
    cityModifiers: [
      makeLocalized("في مدينتك", "in deiner Stadt", "in your city"),
      makeLocalized("للواجهات", "für Fassaden", "for facades"),
      makeLocalized("للمكاتب", "für Büros", "for offices"),
      makeLocalized("بالقرب مني", "in meiner Nähe", "near me"),
    ],
    synonyms: [
      makeLocalized("لصق زجاج", "Fensterfolien", "window film"),
      makeLocalized("ستيكر واجهة", "Fassadenfolie", "facade graphics"),
      makeLocalized("ديكور زجاج", "Glasdekor", "glass decor"),
    ],
  },

  vehicle: {
    title: makeLocalized(
      "المركبات",
      "Fahrzeuge",
      "Vehicles"
    ),
    summary: makeLocalized(
      "فئة مخصصة لتغليف المركبات، كتابة الشعارات، وتجهيز سيارات الشركات.",
      "Kategorie für Fahrzeugfolierung, Logos und Branding auf Firmenfahrzeugen.",
      "Category for vehicle wraps, logos, and company vehicle branding."
    ),
    seoTitle: makeLocalized(
      "تغليف المركبات وكتابة الشعارات",
      "Fahrzeugfolierung und Fahrzeugbeschriftung",
      "Vehicle Wraps and Branding"
    ),
    seoDescription: makeLocalized(
      "حلول لتغليف السيارات وكتابة الشعارات والإعلانات على مركبات الشركات والفرق والخدمات المتنقلة.",
      "Lösungen für Fahrzeugfolierung, Fahrzeugbeschriftung und Werbung auf Firmenfahrzeugen, Teams und mobilen Diensten.",
      "Solutions for vehicle wraps, vehicle branding, and advertising graphics on company vehicles, teams, and mobile services."
    ),
    intro: makeLocalized(
      "إذا أردت تحويل المركبة إلى مساحة دعائية متحركة، فهذه الفئة هي نقطة البداية.",
      "Wenn du ein Fahrzeug in eine mobile Werbefläche verwandeln möchtest, ist diese Kategorie der richtige Startpunkt.",
      "If you want to turn a vehicle into a moving advertising surface, this category is the right place to start."
    ),
    expandedGuide: makeLocalized(
      "تشمل هذه الفئة كتابة الشعارات على السيارات، تغليف المركبات جزئيًا أو كليًا، تجهيز الفانات التجارية، وترتيب الهوية البصرية على أسطول الشركات.",
      "Diese Kategorie umfasst Logos auf Autos, Teil- oder Vollfolierung, Gestaltung von Firmenvans und die visuelle Organisation ganzer Fahrzeugflotten.",
      "This category includes logo application on cars, partial or full wraps, commercial van branding, and visual identity across company fleets."
    ),
    voiceQueries: [
      makeLocalized(
        "أريد كتابة شعار على سيارة الشركة",
        "Ich möchte mein Firmenlogo auf ein Fahrzeug setzen",
        "I want to place my company logo on a company vehicle"
      ),
      makeLocalized(
        "كم تكلفة تغليف فان",
        "Was kostet die Folierung eines Vans",
        "How much does it cost to wrap a van"
      ),
      makeLocalized(
        "أريد تغليف سيارة قريب مني",
        "Ich brauche Fahrzeugfolierung in meiner Nähe",
        "I need vehicle wrapping near me"
      ),
    ],
    keywords: [
      makeLocalized("تغليف سيارات", "Fahrzeugfolierung", "vehicle wrap"),
      makeLocalized("كتابة على سيارة", "Fahrzeugbeschriftung", "vehicle lettering"),
      makeLocalized("فان شركة", "Firmenvan", "company van"),
    ],
    faq: [],
    useCases: [],
    relatedCategories: ["branding", "signage", "marketing"],
    relatedServices: [],
    internalLinks: [
      {
        label: makeLocalized(
          "دليل فئة المركبات",
          "Leitfaden für Fahrzeuge",
          "Vehicle Guide"
        ),
        href: "/guide/category/vehicle",
      },
    ],
    businessTypes: [
      makeLocalized("شركة خدمات", "Dienstleistungsfirma", "service company"),
      makeLocalized("شركة توصيل", "Lieferdienst", "delivery business"),
      makeLocalized("شركة صيانة", "Wartungsfirma", "maintenance company"),
    ],
    cityModifiers: [
      makeLocalized("في مدينتك", "in deiner Stadt", "in your city"),
      makeLocalized("لمركبات الشركات", "für Firmenfahrzeuge", "for company vehicles"),
      makeLocalized("للأسطول", "für Flotten", "for fleets"),
      makeLocalized("بالقرب مني", "in meiner Nähe", "near me"),
    ],
    synonyms: [
      makeLocalized("براندنغ سيارات", "Auto Branding", "vehicle branding"),
      makeLocalized("تجهيز مركبات", "Fahrzeugdesign", "vehicle graphics"),
      makeLocalized("إعلانات على سيارات", "Werbung auf Fahrzeugen", "advertising on vehicles"),
    ],
  },

  printing: {
    title: makeLocalized(
      "المطبوعات",
      "Drucksachen",
      "Printed Products"
    ),
    summary: makeLocalized(
      "هذه الفئة للمطبوعات الورقية مثل البطاقات، الفلايرات، المنيوهات، والبروشورات.",
      "Diese Kategorie ist für Papierdrucksachen wie Karten, Flyer, Speisekarten und Broschüren.",
      "This category is for printed paper products such as cards, flyers, menus, and brochures."
    ),
    seoTitle: makeLocalized(
      "طباعة البزنس كارد والفلايرات والمنيوهات",
      "Visitenkarten, Flyer und Speisekarten drucken",
      "Business Cards, Flyers, and Menu Printing"
    ),
    seoDescription: makeLocalized(
      "طباعة احترافية للبطاقات، الفلايرات، المنيوهات، البروشورات، والمواد الورقية التجارية للمطاعم والشركات والفعاليات.",
      "Professioneller Druck von Visitenkarten, Flyern, Speisekarten, Broschüren und Geschäftsdrucksachen für Restaurants, Unternehmen und Events.",
      "Professional printing for business cards, flyers, menus, brochures, and commercial print materials for restaurants, companies, and events."
    ),
    intro: makeLocalized(
      "هذه الفئة مناسبة لكل من يحتاج مواد ورقية تعريفية أو دعائية أو تشغيلية.",
      "Diese Kategorie eignet sich für alle, die informative, werbliche oder betriebliche Drucksachen benötigen.",
      "This category is suitable for anyone who needs informative, promotional, or operational printed materials."
    ),
    expandedGuide: makeLocalized(
      "تشمل هذه الفئة البزنس كارد، الفلايرات، المنيوهات، البروشورات، الأوراق الرسمية، البوسترات الصغيرة، والمواد الورقية المستخدمة في التسويق أو التشغيل اليومي.",
      "Diese Kategorie umfasst Visitenkarten, Flyer, Speisekarten, Broschüren, Geschäftspapiere, kleinere Poster und Drucksachen für Marketing oder den täglichen Betrieb.",
      "This category includes business cards, flyers, menus, brochures, official stationery, small posters, and paper materials used for marketing or daily operations."
    ),
    voiceQueries: [
      makeLocalized(
        "أريد بزنس كارد",
        "Ich brauche Visitenkarten",
        "I need business cards"
      ),
      makeLocalized(
        "أحتاج طباعة منيو لمطعم",
        "Ich brauche Speisekarten für ein Restaurant",
        "I need menu printing for a restaurant"
      ),
      makeLocalized(
        "كم سعر طباعة فلايرات",
        "Was kostet Flyer-Druck",
        "How much does flyer printing cost"
      ),
      makeLocalized(
        "أريد مطبعة قريبة مني",
        "Ich brauche eine Druckerei in meiner Nähe",
        "I need a printer near me"
      ),
    ],
    keywords: [
      makeLocalized("بزنس كارد", "Visitenkarten", "business cards"),
      makeLocalized("فلايرات", "Flyer", "flyers"),
      makeLocalized("منيو", "Speisekarte", "menu"),
      makeLocalized("بروشور", "Broschüre", "brochure"),
      makeLocalized("مطبوعات", "Drucksachen", "print products"),
    ],
    faq: [],
    useCases: [],
    relatedCategories: ["packaging", "branding", "marketing"],
    relatedServices: [],
    internalLinks: [
      {
        label: makeLocalized(
          "دليل فئة المطبوعات",
          "Leitfaden für Drucksachen",
          "Printing Guide"
        ),
        href: "/guide/category/printing",
      },
    ],
    businessTypes: [
      makeLocalized("مطعم", "Restaurant", "restaurant"),
      makeLocalized("شركة", "Unternehmen", "company"),
      makeLocalized("فعالية", "Event", "event"),
    ],
    cityModifiers: [
      makeLocalized("في مدينتك", "in deiner Stadt", "in your city"),
      makeLocalized("للمطاعم", "für Restaurants", "for restaurants"),
      makeLocalized("للشركات", "für Unternehmen", "for companies"),
      makeLocalized("بالقرب مني", "in meiner Nähe", "near me"),
    ],
    synonyms: [
      makeLocalized("طباعة ورقية", "Papierdrucken", "paper printing"),
      makeLocalized("مواد دعائية", "Werbematerial", "promotional print"),
      makeLocalized("مطبوعات تجارية", "Geschäftsdrucksachen", "commercial printing"),
    ],
  },

  packaging: {
    title: makeLocalized(
      "التغليف والملصقات",
      "Verpackung und Etiketten",
      "Packaging and Labels"
    ),
    summary: makeLocalized(
      "هذه الفئة مناسبة للتغليف، العلب، الأكياس، وملصقات المنتجات.",
      "Diese Kategorie eignet sich für Verpackungen, Boxen, Taschen und Produktetiketten.",
      "This category is suitable for packaging, boxes, bags, and product labels."
    ),
    seoTitle: makeLocalized(
      "تغليف المنتجات والملصقات",
      "Produktverpackung und Etiketten",
      "Product Packaging and Labels"
    ),
    seoDescription: makeLocalized(
      "حلول للتغليف التجاري، العلب، الأكياس، وملصقات المنتجات بشكل احترافي للمنتجات والعلامات التجارية.",
      "Lösungen für geschäftliche Verpackung, Boxen, Taschen und Produktetiketten für Produkte und Marken.",
      "Solutions for product packaging, boxes, bags, and labels for products and brands."
    ),
    intro: makeLocalized(
      "إذا كنت تبيع منتجًا وتحتاج إلى شكل احترافي للتغليف أو اللصاقة، فهذه الفئة مناسبة لك.",
      "Wenn du ein Produkt verkaufst und eine professionelle Verpackung oder Etikettierung brauchst, ist diese Kategorie passend.",
      "If you sell a product and need professional packaging or labels, this category is for you."
    ),
    expandedGuide: makeLocalized(
      "تشمل هذه الفئة العلب المطبوعة، الأكياس، ملصقات المنتجات، بطاقات التعبئة، والمواد التي تجعل المنتج جاهزًا للعرض أو البيع بشكل أقوى.",
      "Diese Kategorie umfasst bedruckte Boxen, Taschen, Produktetiketten, Verpackungskarten und Materialien, die ein Produkt für Verkauf oder Präsentation professioneller machen.",
      "This category includes printed boxes, bags, product labels, packaging cards, and materials that make a product more ready for retail or presentation."
    ),
    voiceQueries: [
      makeLocalized(
        "أريد ملصقات لمنتجي",
        "Ich brauche Etiketten für mein Produkt",
        "I need labels for my product"
      ),
      makeLocalized(
        "أحتاج علبة مطبوعة لمنتج",
        "Ich brauche eine bedruckte Box für ein Produkt",
        "I need a printed box for a product"
      ),
      makeLocalized(
        "أبحث عن تغليف منتجات قريب مني",
        "Ich suche Produktverpackung in meiner Nähe",
        "I am looking for packaging near me"
      ),
    ],
    keywords: [
      makeLocalized("ملصقات منتجات", "Produktetiketten", "product labels"),
      makeLocalized("تغليف", "Verpackung", "packaging"),
      makeLocalized("علب مطبوعة", "bedruckte Boxen", "printed boxes"),
    ],
    faq: [],
    useCases: [],
    relatedCategories: ["printing", "branding", "marketing"],
    relatedServices: [],
    internalLinks: [
      {
        label: makeLocalized(
          "دليل فئة التغليف",
          "Leitfaden für Verpackung",
          "Packaging Guide"
        ),
        href: "/guide/category/packaging",
      },
    ],
    businessTypes: [
      makeLocalized("منتجات تجميل", "Kosmetik", "cosmetics"),
      makeLocalized("حلويات", "Süßwaren", "sweets"),
      makeLocalized("منتجات يدوية", "Handmade-Produkte", "handmade products"),
    ],
    cityModifiers: [
      makeLocalized("في مدينتك", "in deiner Stadt", "in your city"),
      makeLocalized("للمنتجات", "für Produkte", "for products"),
      makeLocalized("للعلامات التجارية", "für Marken", "for brands"),
      makeLocalized("بالقرب مني", "in meiner Nähe", "near me"),
    ],
    synonyms: [
      makeLocalized("تعبئة", "Produktverpackung", "product packaging"),
      makeLocalized("ستيكر منتج", "Produktsticker", "product sticker"),
      makeLocalized("لابل", "Label", "label"),
    ],
  },

  textile: {
    title: makeLocalized(
      "الملابس والهدايا الدعائية",
      "Textil und Werbeartikel",
      "Textile and Promotional Items"
    ),
    summary: makeLocalized(
      "هذه الفئة مناسبة لطباعة الملابس والهدايا الدعائية مثل الأكواب والقبعات.",
      "Diese Kategorie ist für Textildruck und Werbeartikel wie Tassen und Caps geeignet.",
      "This category is suitable for textile printing and promotional items such as mugs and caps."
    ),
    seoTitle: makeLocalized(
      "طباعة الملابس والهدايا الدعائية",
      "Textildruck und Werbeartikel",
      "Textile Printing and Promotional Items"
    ),
    seoDescription: makeLocalized(
      "حلول لطباعة التيشيرتات والملابس والهدايا الدعائية للشركات والمشاريع والفعاليات.",
      "Lösungen für T-Shirt-Druck, Textildruck und Werbeartikel für Firmen, Projekte und Events.",
      "Solutions for t-shirt printing, textile branding, and promotional products for companies, projects, and events."
    ),
    intro: makeLocalized(
      "إذا كنت تريد تيشيرتات، قبعات، أكواب، أو هدايا دعائية تحمل هوية مشروعك، فهذه الفئة مناسبة.",
      "Wenn du T-Shirts, Caps, Tassen oder Werbeartikel mit deiner Markenidentität brauchst, passt diese Kategorie.",
      "If you need t-shirts, caps, mugs, or promotional items carrying your brand identity, this category fits."
    ),
    expandedGuide: makeLocalized(
      "تشمل هذه الفئة طباعة الملابس، تجهيز الزي الموحد، الأكواب، القبعات، والهدايا الدعائية التي تستخدم للترويج أو لتقوية هوية الشركة في الفعاليات والعمل اليومي.",
      "Diese Kategorie umfasst Textildruck, Teamkleidung, Tassen, Caps und Werbeartikel, die für Marketing oder zur Stärkung der Unternehmensidentität im Alltag und bei Events genutzt werden.",
      "This category includes textile printing, team uniforms, mugs, caps, and promotional items used for marketing or for strengthening company identity in everyday operations and events."
    ),
    voiceQueries: [
      makeLocalized(
        "أريد تيشيرتات مطبوعة للشركة",
        "Ich brauche bedruckte T-Shirts für meine Firma",
        "I need printed t-shirts for my company"
      ),
      makeLocalized(
        "أحتاج أكواب دعائية",
        "Ich brauche Werbetassen",
        "I need promotional mugs"
      ),
      makeLocalized(
        "أبحث عن هدايا دعائية قريبة مني",
        "Ich suche Werbeartikel in meiner Nähe",
        "I am looking for promotional items near me"
      ),
    ],
    keywords: [
      makeLocalized("طباعة تيشيرتات", "T-Shirt-Druck", "t-shirt printing"),
      makeLocalized("هدايا دعائية", "Werbeartikel", "promotional items"),
      makeLocalized("أكواب مطبوعة", "bedruckte Tassen", "printed mugs"),
    ],
    faq: [],
    useCases: [],
    relatedCategories: ["branding", "marketing", "printing"],
    relatedServices: [],
    internalLinks: [
      {
        label: makeLocalized(
          "دليل فئة الملابس والهدايا",
          "Leitfaden für Textil und Werbeartikel",
          "Textile and Promotional Guide"
        ),
        href: "/guide/category/textile",
      },
    ],
    businessTypes: [
      makeLocalized("شركة", "Unternehmen", "company"),
      makeLocalized("فعالية", "Event", "event"),
      makeLocalized("مطعم", "Restaurant", "restaurant"),
    ],
    cityModifiers: [
      makeLocalized("في مدينتك", "in deiner Stadt", "in your city"),
      makeLocalized("للشركات", "für Unternehmen", "for companies"),
      makeLocalized("للفعاليات", "für Events", "for events"),
      makeLocalized("بالقرب مني", "in meiner Nähe", "near me"),
    ],
    synonyms: [
      makeLocalized("ملابس مطبوعة", "bedruckte Kleidung", "printed apparel"),
      makeLocalized("برومو آيتيمز", "Promo-Artikel", "promo items"),
      makeLocalized("هدايا شركات", "Firmengeschenke", "corporate gifts"),
    ],
  },

  display: {
    title: makeLocalized(
      "العرض والفعاليات",
      "Display und Events",
      "Display and Events"
    ),
    summary: makeLocalized(
      "هذه الفئة مناسبة للرول أب، الستاندات، وخلفيات التصوير والفعاليات.",
      "Diese Kategorie ist für Roll-ups, Displays, Fotowände und Eventmaterial geeignet.",
      "This category is suitable for roll-ups, stands, backdrops, and event materials."
    ),
    seoTitle: makeLocalized(
      "رول أب وستاندات ومواد فعاليات",
      "Roll-ups, Displays und Eventmaterial",
      "Roll-Ups, Displays, and Event Materials"
    ),
    seoDescription: makeLocalized(
      "حلول للرول أب، الستاندات، خلفيات التصوير، وتجهيزات العرض والفعاليات للمعارض والمناسبات والنقاط الترويجية.",
      "Lösungen für Roll-ups, Displays, Fotowände und Eventausstattung für Messen, Veranstaltungen und Promotion-Flächen.",
      "Solutions for roll-ups, display stands, backdrops, and event presentation materials for exhibitions, events, and promotional spaces."
    ),
    intro: makeLocalized(
      "إذا كنت تستعد لمعرض أو فعالية أو نقطة عرض، فهذه الفئة هي البداية المناسبة.",
      "Wenn du dich auf eine Messe, ein Event oder eine Präsentationsfläche vorbereitest, ist diese Kategorie der richtige Start.",
      "If you are preparing for an exhibition, event, or presentation area, this category is a strong starting point."
    ),
    expandedGuide: makeLocalized(
      "تشمل هذه الفئة الرول أب، الستاندات، خلفيات التصوير، لوحات العرض، وتجهيزات الفعاليات التي تساعد المشروع على الظهور بشكل منظم واحترافي في المعارض واللقاءات والمناسبات.",
      "Diese Kategorie umfasst Roll-ups, Displays, Fotowände, Präsentationswände und Eventmaterial, das Marken bei Messen, Treffen und Veranstaltungen professionell erscheinen lässt.",
      "This category includes roll-ups, stands, backdrops, display boards, and event materials that help a business appear organized and professional during exhibitions, meetings, and events."
    ),
    voiceQueries: [
      makeLocalized(
        "أريد رول أب لمعرض",
        "Ich brauche ein Roll-up für eine Messe",
        "I need a roll-up for an exhibition"
      ),
      makeLocalized(
        "أحتاج ستاند دعائي",
        "Ich brauche ein Werbedisplay",
        "I need a promotional stand"
      ),
      makeLocalized(
        "أبحث عن تجهيزات فعالية قريبة مني",
        "Ich suche Eventmaterial in meiner Nähe",
        "I am looking for event materials near me"
      ),
    ],
    keywords: [
      makeLocalized("رول أب", "Roll-up", "roll-up"),
      makeLocalized("ستاند", "Display", "display stand"),
      makeLocalized("خلفية تصوير", "Fotowand", "backdrop"),
    ],
    faq: [],
    useCases: [],
    relatedCategories: ["printing", "branding", "marketing"],
    relatedServices: [],
    internalLinks: [
      {
        label: makeLocalized(
          "دليل العرض والفعاليات",
          "Leitfaden für Display und Events",
          "Display and Events Guide"
        ),
        href: "/guide/category/display",
      },
    ],
    businessTypes: [
      makeLocalized("معرض", "Messe", "exhibition"),
      makeLocalized("شركة", "Unternehmen", "company"),
      makeLocalized("فعالية", "Event", "event"),
    ],
    cityModifiers: [
      makeLocalized("في مدينتك", "in deiner Stadt", "in your city"),
      makeLocalized("للمعارض", "für Messen", "for exhibitions"),
      makeLocalized("للفعاليات", "für Events", "for events"),
      makeLocalized("بالقرب مني", "in meiner Nähe", "near me"),
    ],
    synonyms: [
      makeLocalized("مواد عرض", "Präsentationsmaterial", "display materials"),
      makeLocalized("تجهيز فعالية", "Eventausstattung", "event setup"),
      makeLocalized("ستاند دعائي", "Werbedisplay", "promotional stand"),
    ],
  },

  branding: {
    title: makeLocalized(
      "الهوية والتصميم",
      "Branding und Design",
      "Branding and Design"
    ),
    summary: makeLocalized(
      "هذه الفئة مناسبة للشعار، الهوية البصرية، وبناء الشكل العام للمشروع.",
      "Diese Kategorie eignet sich für Logo, visuelle Identität und den Gesamtauftritt eines Projekts.",
      "This category is suitable for logo design, visual identity, and the overall visual direction of a project."
    ),
    seoTitle: makeLocalized(
      "تصميم الشعار والهوية البصرية",
      "Logo- und Branding-Design",
      "Logo and Branding Design"
    ),
    seoDescription: makeLocalized(
      "حلول للشعار، الهوية البصرية، والاتجاه التصميمي للمشاريع والشركات والعلامات التجارية.",
      "Lösungen für Logo, Branding und visuelle Identität von Projekten, Unternehmen und Marken.",
      "Solutions for logos, branding, and visual identity for businesses, projects, and brands."
    ),
    intro: makeLocalized(
      "إذا كنت تريد أساسًا بصريًا واضحًا ومقنعًا لعلامتك، فهذه الفئة مناسبة لك.",
      "Wenn du eine klare und überzeugende visuelle Grundlage für deine Marke brauchst, passt diese Kategorie.",
      "If you need a clear and convincing visual foundation for your brand, this category is right for you."
    ),
    expandedGuide: makeLocalized(
      "تشمل هذه الفئة تصميم الشعار، بناء الهوية البصرية، اختيار الأسلوب العام، وتحويل المشروع من فكرة مبعثرة إلى شكل متماسك يمكن استخدامه على اللوحات والمطبوعات والمركبات والويب.",
      "Diese Kategorie umfasst Logodesign, Entwicklung der visuellen Identität, Wahl eines visuellen Stils und die Umwandlung eines Projekts in ein stimmiges Erscheinungsbild, das auf Schildern, Drucksachen, Fahrzeugen und im Web eingesetzt werden kann.",
      "This category includes logo design, visual identity building, style direction, and turning a scattered idea into a consistent brand system that can be used across signage, print, vehicles, and the web."
    ),
    voiceQueries: [
      makeLocalized(
        "أريد شعارًا وهوية بصرية",
        "Ich brauche ein Logo und Branding",
        "I need a logo and branding"
      ),
      makeLocalized(
        "أحتاج تصميم هوية لمشروعي",
        "Ich brauche eine visuelle Identität für mein Projekt",
        "I need visual identity design for my project"
      ),
      makeLocalized(
        "أبحث عن مصمم هوية قريب مني",
        "Ich suche Branding-Design in meiner Nähe",
        "I am looking for branding design near me"
      ),
    ],
    keywords: [
      makeLocalized("شعار", "Logo", "logo"),
      makeLocalized("هوية بصرية", "visuelle Identität", "visual identity"),
      makeLocalized("براندنغ", "Branding", "branding"),
    ],
    faq: [],
    useCases: [],
    relatedCategories: ["signage", "printing", "textile", "marketing"],
    relatedServices: [],
    internalLinks: [
      {
        label: makeLocalized(
          "دليل الهوية والتصميم",
          "Leitfaden für Branding und Design",
          "Branding and Design Guide"
        ),
        href: "/guide/category/branding",
      },
    ],
    businessTypes: [
      makeLocalized("شركة ناشئة", "Start-up", "startup"),
      makeLocalized("مطعم", "Restaurant", "restaurant"),
      makeLocalized("متجر", "Geschäft", "shop"),
    ],
    cityModifiers: [
      makeLocalized("في مدينتك", "in deiner Stadt", "in your city"),
      makeLocalized("للمشاريع الجديدة", "für neue Projekte", "for new businesses"),
      makeLocalized("للشركات", "für Unternehmen", "for companies"),
      makeLocalized("بالقرب مني", "in meiner Nähe", "near me"),
    ],
    synonyms: [
      makeLocalized("تصميم علامة", "Markendesign", "brand design"),
      makeLocalized("بناء هوية", "Markenaufbau", "brand identity"),
      makeLocalized("شعار وهوية", "Logo und Branding", "logo and branding"),
    ],
  },

  fabrication: {
    title: makeLocalized(
      "التصنيع الخاص",
      "Sonderanfertigung",
      "Custom Fabrication"
    ),
    summary: makeLocalized(
      "هذه الفئة مناسبة للتصنيع الخاص، القص CNC أو الليزر، والعناصر غير الجاهزة.",
      "Diese Kategorie eignet sich für Sonderanfertigung, CNC- oder Laserschnitt und individuelle Teile.",
      "This category is suitable for custom fabrication, CNC or laser cutting, and non-standard parts."
    ),
    seoTitle: makeLocalized(
      "تصنيع خاص وقص CNC وليزر",
      "Sonderanfertigung, CNC- und Laserschnitt",
      "Custom Fabrication, CNC, and Laser Cutting"
    ),
    seoDescription: makeLocalized(
      "حلول للتصنيع الخاص، CNC، والقص بالليزر للعناصر الدعائية أو المعمارية أو الخاصة من مواد متنوعة.",
      "Lösungen für Sonderanfertigung, CNC und Laserschnitt für Werbe-, Gestaltungs- oder Spezialteile aus verschiedenen Materialien.",
      "Solutions for custom fabrication, CNC, and laser cutting for advertising, architectural, or special pieces in a range of materials."
    ),
    intro: makeLocalized(
      "إذا كان لديك تصميم أو قطعة خاصة لا تندرج ضمن المنتجات الجاهزة، فهذه الفئة مناسبة لك.",
      "Wenn du ein Design oder Teil hast, das nicht zu Standardprodukten gehört, ist diese Kategorie passend.",
      "If you have a custom design or part that does not fit standard products, this category is suitable."
    ),
    expandedGuide: makeLocalized(
      "تشمل هذه الفئة التصنيع الخاص، قص CNC، القص بالليزر، الأجزاء المركبة، والعناصر التي تحتاج تنفيذًا خاصًا من مواد مثل الديبوند أو الأكريليك أو غيرها.",
      "Diese Kategorie umfasst Sonderanfertigung, CNC-Schnitt, Laserschnitt, zusammengesetzte Teile und Elemente, die aus Materialien wie Dibond, Acryl oder anderen Werkstoffen individuell gefertigt werden.",
      "This category includes custom fabrication, CNC cutting, laser cutting, composite parts, and elements that require special production using materials such as Dibond, acrylic, or others."
    ),
    voiceQueries: [
      makeLocalized(
        "أريد قص CNC لقطعة خاصة",
        "Ich brauche CNC-Schnitt für ein Sonderteil",
        "I need CNC cutting for a custom piece"
      ),
      makeLocalized(
        "أحتاج تصنيع عنصر خاص لمشروعي",
        "Ich brauche eine Sonderanfertigung für mein Projekt",
        "I need custom fabrication for my project"
      ),
      makeLocalized(
        "أبحث عن قص ليزر قريب مني",
        "Ich suche Laserschnitt in meiner Nähe",
        "I am looking for laser cutting near me"
      ),
    ],
    keywords: [
      makeLocalized("قص CNC", "CNC-Schnitt", "CNC cutting"),
      makeLocalized("قص ليزر", "Laserschnitt", "laser cutting"),
      makeLocalized("تصنيع خاص", "Sonderanfertigung", "custom fabrication"),
    ],
    faq: [],
    useCases: [],
    relatedCategories: ["signage", "surfaces", "branding"],
    relatedServices: [],
    internalLinks: [
      {
        label: makeLocalized(
          "دليل التصنيع الخاص",
          "Leitfaden für Sonderanfertigung",
          "Custom Fabrication Guide"
        ),
        href: "/guide/category/fabrication",
      },
    ],
    businessTypes: [
      makeLocalized("وكالة", "Agentur", "agency"),
      makeLocalized("شركة", "Unternehmen", "company"),
      makeLocalized("مصمم", "Designer", "designer"),
    ],
    cityModifiers: [
      makeLocalized("في مدينتك", "in deiner Stadt", "in your city"),
      makeLocalized("للعناصر الخاصة", "für Sonderteile", "for custom parts"),
      makeLocalized("للتنفيذ الخاص", "für Spezialanfertigungen", "for custom production"),
      makeLocalized("بالقرب مني", "in meiner Nähe", "near me"),
    ],
    synonyms: [
      makeLocalized("تصنيع مخصص", "individuelle Fertigung", "custom manufacturing"),
      makeLocalized("تنفيذ خاص", "Spezialanfertigung", "special fabrication"),
      makeLocalized("قطعة خاصة", "Sonderteil", "custom part"),
    ],
  },

  marketing: {
    title: makeLocalized(
      "الحلول المتكاملة",
      "Komplettlösungen",
      "Complete Solutions"
    ),
    summary: makeLocalized(
      "هذه الفئة مناسبة إذا كنت تريد مسارًا متكاملًا من الفكرة حتى الظهور.",
      "Diese Kategorie ist für Menschen geeignet, die einen integrierten Weg von der Idee bis zur Sichtbarkeit suchen.",
      "This category is suitable if you want an integrated path from concept to visibility."
    ),
    seoTitle: makeLocalized(
      "حلول متكاملة للإعلان والطباعة والظهور التجاري",
      "Komplettlösungen für Werbung, Druck und Sichtbarkeit",
      "Complete Advertising, Print, and Visibility Solutions"
    ),
    seoDescription: makeLocalized(
      "إذا كنت تريد أكثر من خدمة في وقت واحد، فهذه الفئة تجمع المسار من الهوية إلى اللوحات والمطبوعات والمواد الدعائية.",
      "Wenn du mehrere Leistungen gleichzeitig brauchst, verbindet diese Kategorie den Weg von Branding über Schilder bis zu Drucksachen und Werbematerial.",
      "If you need more than one service at the same time, this category connects branding, signage, print, and promotional materials."
    ),
    intro: makeLocalized(
      "هذه الفئة مناسبة لمن يريد رؤية شاملة بدل طلب منفصل لكل جزء.",
      "Diese Kategorie ist ideal für Menschen, die einen Gesamtblick statt einzelner Anfragen für jeden Teil suchen.",
      "This category is ideal for people who want a full view instead of separate requests for every piece."
    ),
    expandedGuide: makeLocalized(
      "تشمل هذه الفئة المسارات التي تجمع بين أكثر من خدمة، مثل الهوية البصرية مع اللوحات والمطبوعات والهدايا الدعائية وتجهيز المشروع للانطلاق بصورة متماسكة وقوية.",
      "Diese Kategorie umfasst Wege, die mehrere Leistungen verbinden, etwa visuelle Identität mit Schildern, Drucksachen und Werbeartikeln, um ein Projekt konsistent und stark zu starten.",
      "This category includes paths that combine multiple services, such as branding with signage, printed materials, and promotional items to launch a project in a cohesive and powerful way."
    ),
    voiceQueries: [
      makeLocalized(
        "أريد حلًا كاملًا لمشروعي",
        "Ich brauche eine komplette Lösung für mein Projekt",
        "I need a complete solution for my project"
      ),
      makeLocalized(
        "أحتاج كل شيء من الشعار حتى اللوحة",
        "Ich brauche alles vom Logo bis zum Schild",
        "I need everything from the logo to the sign"
      ),
      makeLocalized(
        "أبحث عن تجهيز كامل لمشروع جديد",
        "Ich suche eine komplette Lösung für ein neues Projekt",
        "I am looking for a full setup for a new project"
      ),
    ],
    keywords: [
      makeLocalized("حل متكامل", "Komplettlösung", "complete solution"),
      makeLocalized("تجهيز مشروع", "Projektaufbau", "project setup"),
      makeLocalized("خدمات متعددة", "mehrere Leistungen", "multiple services"),
    ],
    faq: [],
    useCases: [],
    relatedCategories: [
      "smart",
      "branding",
      "signage",
      "printing",
      "textile",
      "display",
    ],
    relatedServices: [],
    internalLinks: [
      {
        label: makeLocalized(
          "دليل الحلول المتكاملة",
          "Leitfaden für Komplettlösungen",
          "Complete Solutions Guide"
        ),
        href: "/guide/category/marketing",
      },
    ],
    businessTypes: [
      makeLocalized("مشروع جديد", "neues Projekt", "new project"),
      makeLocalized("مطعم", "Restaurant", "restaurant"),
      makeLocalized("شركة", "Unternehmen", "company"),
    ],
    cityModifiers: [
      makeLocalized("في مدينتك", "in deiner Stadt", "in your city"),
      makeLocalized("من البداية", "von Anfang an", "from scratch"),
      makeLocalized("كمسار كامل", "als kompletter Weg", "as a complete path"),
      makeLocalized("في ألمانيا", "in Deutschland", "in Germany"),
    ],
    synonyms: [
      makeLocalized("حل كامل", "vollständige Lösung", "full solution"),
      makeLocalized("تجهيز شامل", "komplette Ausstattung", "complete setup"),
      makeLocalized("خدمة متكاملة", "integrierte Lösung", "integrated solution"),
    ],
  },
};

export const guides: GuidesMap = enrichGuides(rawGuides);

export const guideCategoryIds = categories
  .map((category) => category.id)
  .filter((id) => Boolean(guides[id]));

export const guideIds = Object.keys(guides);