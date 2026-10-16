export type PortfolioGroup = "signage" | "textile" | "design" | "workshop";
export type PortfolioItem = { id: string; title: Record<"de" | "ar" | "en", string>; group: PortfolioGroup; category: string; image: string; original?: string; description: Record<"de" | "ar" | "en", string> };
export const portfolio: PortfolioItem[] = [
  {
    "id": "choco",
    "title": {
      "de": "CHOCO ’n DIP",
      "ar": "CHOCO ’n DIP",
      "en": "CHOCO ’n DIP"
    },
    "group": "signage",
    "category": "signage",
    "image": "/portfolio/choco.webp",
    "original": "/portfolio/choco-original.webp",
    "description": {
      "de": "Leuchtbuchstaben und Fassadenauftritt.",
      "ar": "حروف مضيئة وهوية للواجهة.",
      "en": "Illuminated letters and facade identity."
    }
  },
  {
    "id": "latakia",
    "title": {
      "de": "LATAKIA SNACKS",
      "ar": "LATAKIA SNACKS",
      "en": "LATAKIA SNACKS"
    },
    "group": "signage",
    "category": "signage",
    "image": "/portfolio/latakia.webp",
    "original": "/portfolio/latakia-original.webp",
    "description": {
      "de": "Eckfassade mit Beschriftung und Fenstergrafiken.",
      "ar": "واجهة زاوية بحروف إعلانية ورسومات للزجاج.",
      "en": "Corner facade with lettering and window graphics."
    }
  },
  {
    "id": "bros",
    "title": {
      "de": "BRO’S BARBERSHOP",
      "ar": "BRO’S BARBERSHOP",
      "en": "BRO’S BARBERSHOP"
    },
    "group": "signage",
    "category": "signage",
    "image": "/portfolio/bros.webp",
    "original": "/portfolio/bros-original.webp",
    "description": {
      "de": "Schwarz-goldene Beschilderung und Glasbeschriftung.",
      "ar": "لوحات بالأسود والذهبي وكتابة على الزجاج.",
      "en": "Black and gold signage and window lettering."
    }
  },
  {
    "id": "own",
    "title": {
      "de": "OWN BARBER",
      "ar": "OWN BARBER",
      "en": "OWN BARBER"
    },
    "group": "signage",
    "category": "signage",
    "image": "/portfolio/own.webp",
    "original": "/portfolio/own-original.webp",
    "description": {
      "de": "Profilbuchstaben, Wandgrafiken und Schaufenster.",
      "ar": "حروف بارزة ورسومات جدارية وواجهات زجاجية.",
      "en": "Dimensional lettering, wall graphics and shop windows."
    }
  },
  {
    "id": "afrin",
    "title": {
      "de": "AFRIN",
      "ar": "AFRIN",
      "en": "AFRIN"
    },
    "group": "signage",
    "category": "signage",
    "image": "/portfolio/afrin.webp",
    "original": "/portfolio/afrin-original.webp",
    "description": {
      "de": "Fassadenbeschriftung und bedruckte Fensterflächen.",
      "ar": "حروف للواجهة وطباعة على الزجاج.",
      "en": "Facade lettering and printed window graphics."
    }
  },
  {
    "id": "sahiten",
    "title": {
      "de": "Sahiten Berlin",
      "ar": "Sahiten Berlin",
      "en": "Sahiten Berlin"
    },
    "group": "signage",
    "category": "vehicle",
    "image": "/portfolio/sahiten.webp",
    "description": {
      "de": "Gestaltung einer mobilen Gastronomiefläche.",
      "ar": "تصميم واجهة مقطورة للطعام.",
      "en": "Graphics for a mobile food trailer."
    }
  },
  {
    "id": "baker",
    "title": {
      "de": "BAKER",
      "ar": "BAKER",
      "en": "BAKER"
    },
    "group": "textile",
    "category": "textile",
    "image": "/portfolio/baker.webp",
    "original": "/portfolio/baker-original.webp",
    "description": {
      "de": "Logodruck auf schwarzem Textil.",
      "ar": "طباعة شعار على قماش أسود.",
      "en": "Logo print on black fabric."
    }
  },
  {
    "id": "oregano",
    "title": {
      "de": "OREGANO",
      "ar": "OREGANO",
      "en": "OREGANO"
    },
    "group": "design",
    "category": "display",
    "image": "/portfolio/oregano.webp",
    "original": "/portfolio/oregano-original.webp",
    "description": {
      "de": "Gestaltungsbeispiel für einen Kundenstopper.",
      "ar": "نموذج تصميم لوحة إعلانية أرضية.",
      "en": "Pavement sign design presentation."
    }
  },
  {
    "id": "sammont",
    "title": {
      "de": "Sammont · Speisekarte",
      "ar": "Sammont · قائمة الطعام",
      "en": "Sammont · Menu"
    },
    "group": "design",
    "category": "printing",
    "image": "/portfolio/sammont.webp",
    "description": {
      "de": "Layout und Präsentation einer mehrseitigen Speisekarte.",
      "ar": "تصميم وعرض قائمة طعام متعددة الصفحات.",
      "en": "Multi-page restaurant menu layout and presentation."
    }
  },
  {
    "id": "letters",
    "title": {
      "de": "3D · Werkstatt",
      "ar": "حروف بارزة · من الورشة",
      "en": "3D lettering · Workshop"
    },
    "group": "workshop",
    "category": "signage",
    "image": "/portfolio/letters.webp",
    "description": {
      "de": "Einblick in die Vorbereitung von Profilbuchstaben.",
      "ar": "من تجهيز الحروف البارزة داخل الورشة.",
      "en": "A look at dimensional lettering preparation."
    }
  },
  {
    "id": "packaging",
    "title": {
      "de": "Material & Verpackung",
      "ar": "الخامات والتغليف",
      "en": "Materials & packaging"
    },
    "group": "workshop",
    "category": "packaging",
    "image": "/portfolio/packaging.webp",
    "description": {
      "de": "Materialmuster, Folien und Verpackungsbeispiele.",
      "ar": "عينات خامات وفوليا ونماذج تغليف.",
      "en": "Material samples, films and packaging examples."
    }
  },
  {
    "id": "embroidery",
    "title": {
      "de": "Stickerei · Detail",
      "ar": "تفاصيل التطريز",
      "en": "Embroidery · Detail"
    },
    "group": "textile",
    "category": "textile",
    "image": "/portfolio/embroidery.webp",
    "description": {
      "de": "Nahaufnahme aus der Stickproduktion.",
      "ar": "لقطة مقرّبة من عملية التطريز.",
      "en": "A close-up of embroidery in production."
    }
  }
];
