export type PortfolioGroup = "signage" | "textile" | "design" | "workshop";
export type PortfolioPhoto = { image: string; original?: string; presentation?: boolean; aiEnhanced?: boolean; aiGenerated?: boolean; maxDisplayWidth?: number };
export type PortfolioItem = PortfolioPhoto & { id: string; title: Record<"de" | "ar" | "en", string>; group: PortfolioGroup; category: string; description: Record<"de" | "ar" | "en", string>; photos?: PortfolioPhoto[] };
export const portfolio: PortfolioItem[] = [
  {
    "id": "sultan",
    "title": {
      "de": "Sultan",
      "ar": "سلطان",
      "en": "Sultan"
    },
    "group": "signage",
    "category": "signage",
    "image": "/portfolio/sultan.webp",
    "original": "/portfolio/sultan-original.webp",
    "description": {
      "de": "Fassadenbeschriftung und großformatige Warenmotive.",
      "ar": "حروف للواجهة ورسومات كبيرة لأقسام المنتجات.",
      "en": "Facade lettering and large product graphics."
    }
  },
  {
    "id": "cravez",
    "title": {
      "de": "CRAVÉZ",
      "ar": "CRAVÉZ",
      "en": "CRAVÉZ"
    },
    "group": "signage",
    "category": "signage",
    "image": "/portfolio/cravez.webp",
    "original": "/portfolio/cravez-original.webp",
    "description": {
      "de": "Leuchtlogo, Thekenbeschriftung und Wandgrafiken.",
      "ar": "شعار مضيء وحروف للكاونتر ورسومات جدارية.",
      "en": "Illuminated logo, counter lettering and wall graphics."
    }
  },
  {
    "id": "idlib",
    "title": {
      "de": "Idlib Sweets",
      "ar": "حلويات إدلب",
      "en": "Idlib Sweets"
    },
    "group": "signage",
    "category": "signage",
    "image": "/portfolio/idlib.webp",
    "original": "/portfolio/idlib-original.webp",
    "description": {
      "de": "Fassadenschild und bedruckte Schaufensterflächen.",
      "ar": "لوحة للواجهة وطباعة على مساحات العرض الزجاجية.",
      "en": "Facade sign and printed shop window panels."
    }
  },
  {
    "id": "ella",
    "title": {
      "de": "ELLa CanTa",
      "ar": "ELLa CanTa",
      "en": "ELLa CanTa"
    },
    "group": "signage",
    "category": "signage",
    "image": "/portfolio/ella.webp",
    "original": "/portfolio/ella-original.webp",
    "description": {
      "de": "Fassadenauftritt mit Leuchtwerbung und bedruckten Flächen.",
      "ar": "هوية للواجهة مع لوحات مضيئة وطباعة على الأسطح.",
      "en": "Facade identity with illuminated signs and printed panels."
    },
    "photos": [
      {
        "image": "/portfolio/archive-29.webp",
        "presentation": false
      }
    ]
  },
  {
    "id": "omer",
    "title": {
      "de": "Friseur Salon by Ömer",
      "ar": "صالون Ömer",
      "en": "Friseur Salon by Ömer"
    },
    "group": "signage",
    "category": "signage",
    "image": "/portfolio/omer.webp",
    "original": "/portfolio/omer-original.webp",
    "description": {
      "de": "Profilbuchstaben und runde Logotafel.",
      "ar": "حروف بارزة ولوحة شعار دائرية.",
      "en": "Dimensional lettering and circular logo sign."
    }
  },
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
    },
    "photos": [
      {
        "image": "/portfolio/choco-neon.webp",
        "original": "/portfolio/choco-neon-original.webp"
      },
      {
        "image": "/portfolio/batch-choco-night.webp",
        "maxDisplayWidth": 715,
        "presentation": true
      },
      {
        "image": "/portfolio/batch-choco-neon.webp",
        "maxDisplayWidth": 731,
        "presentation": true
      },
      {
        "image": "/portfolio/batch-choco-polo.webp",
        "maxDisplayWidth": 723,
        "presentation": true
      },
      {
        "image": "/portfolio/batch-choco-day.webp",
        "maxDisplayWidth": 726,
        "presentation": true
      },
      {
        "image": "/portfolio/archive-03.webp",
        "presentation": false
      }
    ]
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
    },
    "photos": [
      {
        "image": "/portfolio/batch-latakia-hoodie.webp",
        "maxDisplayWidth": 733,
        "presentation": true
      },
      {
        "image": "/portfolio/batch-latakia-cap-large.webp",
        "maxDisplayWidth": 718,
        "presentation": true
      },
      {
        "image": "/portfolio/batch-latakia-interior.webp",
        "presentation": true
      },
      {
        "image": "/portfolio/batch-latakia-counter.webp",
        "presentation": true
      },
      {
        "image": "/portfolio/batch-latakia-night.webp",
        "presentation": true
      },
      {
        "image": "/portfolio/archive-27.webp",
        "presentation": false
      },
      {
        "image": "/portfolio/archive-30.webp",
        "presentation": false
      },
      {
        "image": "/portfolio/archive-34.webp",
        "presentation": false
      },
      {
        "image": "/portfolio/archive-22.webp",
        "presentation": false
      }
    ]
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
    },
    "photos": [
      {
        "image": "/portfolio/batch-own-front.webp",
        "maxDisplayWidth": 729,
        "presentation": true
      },
      {
        "image": "/portfolio/batch-own-angle.webp",
        "maxDisplayWidth": 728,
        "presentation": true
      },
      {
        "image": "/portfolio/batch-own-logo.webp",
        "maxDisplayWidth": 527,
        "presentation": true
      },
      {
        "image": "/portfolio/archive-11.webp",
        "presentation": false
      },
      {
        "image": "/portfolio/archive-15.webp",
        "presentation": false
      }
    ]
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
    },
    "photos": [
      {
        "image": "/portfolio/batch-afrin-angle.webp",
        "presentation": true
      },
      {
        "image": "/portfolio/archive-07.webp",
        "presentation": false
      }
    ]
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
    },
    "photos": [
      {
        "image": "/portfolio/archive-20.webp",
        "presentation": false
      }
    ]
  },
  {
    "id": "shahba",
    "title": {
      "de": "Shahba",
      "ar": "شهبا",
      "en": "Shahba"
    },
    "group": "design",
    "category": "printing",
    "image": "/portfolio/batch-shahba-facade.webp",
    "presentation": true,
    "description": {
      "de": "Markenpräsentation: Fassade, Textil und Werbemittel.",
      "ar": "عرض الهوية: واجهة وملابس ومواد دعائية.",
      "en": "Brand presentation: facade, apparel and promotional products."
    },
    "photos": [
      {
        "image": "/portfolio/batch-shahba-cap.webp",
        "maxDisplayWidth": 715,
        "presentation": true
      },
      {
        "image": "/portfolio/batch-shahba-laptop.webp",
        "maxDisplayWidth": 723,
        "presentation": true
      },
      {
        "image": "/portfolio/batch-shahba-screen.webp",
        "maxDisplayWidth": 717,
        "presentation": true
      },
      {
        "image": "/portfolio/batch-shahba-paper-cup.webp",
        "maxDisplayWidth": 715,
        "presentation": true
      },
      {
        "image": "/portfolio/batch-shahba-mug.webp",
        "maxDisplayWidth": 723,
        "presentation": true
      },
      {
        "image": "/portfolio/batch-shahba-sweatshirt.webp",
        "maxDisplayWidth": 725,
        "presentation": true
      },
      {
        "image": "/portfolio/batch-shahba-card.webp",
        "maxDisplayWidth": 715,
        "presentation": true
      },
      {
        "image": "/portfolio/batch-shahba-plate.webp",
        "maxDisplayWidth": 725,
        "presentation": true
      },
      {
        "image": "/portfolio/batch-shahba-print-detail.webp",
        "presentation": true
      },
      {
        "image": "/portfolio/archive-35.webp",
        "presentation": false
      }
    ]
  },
  {
    "id": "mir",
    "title": {
      "de": "MIR Café",
      "ar": "MIR كافيه",
      "en": "MIR Café"
    },
    "group": "signage",
    "category": "signage",
    "image": "/portfolio/batch-mir-front.webp",
    "presentation": true,
    "description": {
      "de": "Fassadenauftritt und Markenanwendungen.",
      "ar": "هوية واجهة وتطبيقات العلامة.",
      "en": "Facade identity and brand applications."
    },
    "photos": [
      {
        "image": "/portfolio/batch-mir-angle.webp",
        "maxDisplayWidth": 715,
        "presentation": true
      },
      {
        "image": "/portfolio/batch-mir-sweatshirt.webp",
        "maxDisplayWidth": 916,
        "presentation": true
      },
      {
        "image": "/portfolio/batch-mir-cap.webp",
        "maxDisplayWidth": 952,
        "presentation": true
      },
      {
        "image": "/portfolio/batch-mir-cup.webp",
        "maxDisplayWidth": 1094,
        "presentation": true
      }
    ]
  },
  {
    "id": "malakeh",
    "title": {
      "de": "Malakeh",
      "ar": "ملكة",
      "en": "Malakeh"
    },
    "group": "signage",
    "category": "signage",
    "image": "/portfolio/batch-malakeh-wood-facade.webp",
    "presentation": true,
    "description": {
      "de": "Fassadengestaltung und Außenauftritt.",
      "ar": "تصميم الواجهة والحضور الخارجي.",
      "en": "Facade design and exterior identity."
    },
    "photos": [
      {
        "image": "/portfolio/batch-malakeh-terrace.webp",
        "presentation": true
      }
    ]
  },
  {
    "id": "atjs",
    "title": {
      "de": "At J’s · Coffee & Kitchen",
      "ar": "At J’s · Coffee & Kitchen",
      "en": "At J’s · Coffee & Kitchen"
    },
    "group": "design",
    "category": "printing",
    "image": "/portfolio/batch-atjs-front.webp",
    "presentation": true,
    "description": {
      "de": "Fassadengestaltung und Textilanwendungen.",
      "ar": "تصميم واجهة وتطبيقات على الملابس.",
      "en": "Facade design and apparel applications."
    },
    "photos": [
      {
        "image": "/portfolio/batch-atjs-back.webp",
        "presentation": true
      },
      {
        "image": "/portfolio/batch-atjs-facade.webp",
        "presentation": true
      }
    ]
  },
  {
    "id": "carobara-facade",
    "title": {
      "de": "Caro Bara · Fassade",
      "ar": "واجهة كارو بارا",
      "en": "Caro Bara · Fassade"
    },
    "group": "signage",
    "category": "signage",
    "image": "/portfolio/carobara-facade.webp",
    "original": "/portfolio/carobara-facade-original.webp",
    "description": {
      "de": "Profilbuchstaben und abgestimmte Fenstergestaltung.",
      "ar": "حروف بارزة وتصميم متناسق للواجهات الزجاجية.",
      "en": "Dimensional lettering and coordinated window graphics."
    },
    "photos": [
      {
        "image": "/portfolio/round-sign.webp",
        "original": "/portfolio/round-sign-original.webp"
      },
      {
        "image": "/portfolio/archive-01.webp",
        "presentation": false
      },
      {
        "image": "/portfolio/archive-06.webp",
        "presentation": false
      },
      {
        "image": "/portfolio/archive-19.webp",
        "presentation": false
      },
      {
        "image": "/portfolio/archive-23.webp",
        "presentation": false
      },
      {
        "image": "/portfolio/archive-24.webp",
        "presentation": false
      },
      {
        "image": "/portfolio/archive-26.webp",
        "presentation": false
      },
      {
        "image": "/portfolio/archive-36.webp",
        "presentation": true
      }
    ]
  },
  {
    "id": "gift-mugs",
    "title": {
      "de": "Tassen & Geschenkideen",
      "ar": "أكواب وهدايا مطبوعة",
      "en": "Tassen & Geschenkideen"
    },
    "group": "design",
    "category": "printing",
    "image": "/portfolio/fairouz-cartoon-enhanced.webp",
    "original": "/portfolio/batch-gift-mugs-fairouz-cartoon.webp",
    "aiEnhanced": true,
    "presentation": true,
    "description": {
      "de": "Porträt- und Grafikmotive auf Tassen und Gläsern.",
      "ar": "رسوم وصور فنية على أكواب وكؤوس.",
      "en": "Portrait and graphic artwork on mugs and glasses."
    },
    "photos": [
      {
        "image": "/portfolio/concept-mug-portrait.webp",
        "presentation": true,
        "original": "/portfolio/batch-gift-mugs-fairouz-art.webp",
        "aiGenerated": true
      },
      {
        "image": "/portfolio/concept-mugs.webp",
        "presentation": true,
        "original": "/portfolio/batch-gift-mugs-oum-kalthoum.webp",
        "aiGenerated": true
      },
      {
        "image": "/portfolio/concept-mug-home.webp",
        "presentation": true,
        "original": "/portfolio/batch-gift-mugs-watan-mug.webp",
        "aiGenerated": true
      },
      {
        "image": "/portfolio/concept-mug-village.webp",
        "presentation": true,
        "original": "/portfolio/batch-gift-mugs-village-mug.webp",
        "aiGenerated": true
      },
      {
        "image": "/portfolio/concept-glass-olive.webp",
        "presentation": true,
        "original": "/portfolio/batch-gift-mugs-watan-glass.webp",
        "aiGenerated": true
      }
    ]
  },
  {
    "id": "streetwear",
    "title": {
      "de": "Textildesign · Kollektion",
      "ar": "مجموعة تصاميم الملابس",
      "en": "Textildesign · Kollektion"
    },
    "group": "textile",
    "category": "textile",
    "image": "/portfolio/concept-shirt-germany.webp",
    "presentation": true,
    "description": {
      "de": "Verschiedene Motive für Shirts und Sweatshirts.",
      "ar": "رسوم متنوعة للقمصان والكنزات.",
      "en": "Various designs for shirts and sweatshirts."
    },
    "photos": [
      {
        "image": "/portfolio/concept-textiles.webp",
        "presentation": true,
        "original": "/portfolio/batch-streetwear-jordan-shirt.webp",
        "aiGenerated": true
      },
      {
        "image": "/portfolio/concept-cap-jordan.webp",
        "presentation": true,
        "original": "/portfolio/batch-streetwear-jordan-cap.webp",
        "aiGenerated": true
      },
      {
        "image": "/portfolio/concept-shirt-playful.webp",
        "presentation": true,
        "original": "/portfolio/batch-streetwear-faqs.webp",
        "aiGenerated": true
      },
      {
        "image": "/portfolio/concept-shirt-eagle.webp",
        "presentation": true,
        "original": "/portfolio/batch-streetwear-village-eagle.webp",
        "aiGenerated": true
      },
      {
        "image": "/portfolio/concept-shirt-couple.webp",
        "presentation": true,
        "original": "/portfolio/batch-streetwear-couple.webp",
        "aiGenerated": true
      },
      {
        "image": "/portfolio/concept-sweatshirt-bear.webp",
        "presentation": true,
        "original": "/portfolio/batch-streetwear-bear.webp",
        "aiGenerated": true
      },
      {
        "image": "/portfolio/concept-sweatshirt-bloom.webp",
        "presentation": true,
        "original": "/portfolio/batch-streetwear-relax-bloom.webp",
        "aiGenerated": true
      },
      {
        "image": "/portfolio/concept-sweatshirt-cream.webp",
        "presentation": true,
        "original": "/portfolio/batch-streetwear-two-tones-cream.webp",
        "aiGenerated": true
      },
      {
        "image": "/portfolio/concept-sweatshirt-lilac.webp",
        "presentation": true,
        "original": "/portfolio/batch-streetwear-two-tones-lilac.webp",
        "aiGenerated": true
      }
    ],
    "original": "/portfolio/batch-streetwear-germany.webp",
    "aiGenerated": true
  },
  {
    "id": "art-caps",
    "title": {
      "de": "Illustration · Caps & Textil",
      "ar": "رسوم على القبعات والملابس",
      "en": "Illustration · Caps & Textil"
    },
    "group": "textile",
    "category": "textile",
    "image": "/portfolio/concept-caps.webp",
    "presentation": true,
    "description": {
      "de": "Illustrationsmotive auf Caps und Sweatshirts.",
      "ar": "رسوم فنية على قبعات وكنزات.",
      "en": "Illustration artwork on caps and sweatshirts."
    },
    "photos": [
      {
        "image": "/portfolio/concept-cap-turquoise.webp",
        "presentation": true,
        "original": "/portfolio/batch-art-caps-turquoise.webp",
        "aiGenerated": true
      },
      {
        "image": "/portfolio/concept-cap-navy.webp",
        "presentation": true,
        "original": "/portfolio/batch-art-caps-navy.webp",
        "aiGenerated": true
      },
      {
        "image": "/portfolio/concept-cactus-white.webp",
        "presentation": true,
        "original": "/portfolio/batch-art-caps-sweatshirt-white.webp",
        "aiGenerated": true
      },
      {
        "image": "/portfolio/concept-cactus-beige.webp",
        "presentation": true,
        "original": "/portfolio/batch-art-caps-sweatshirt-beige.webp",
        "aiGenerated": true
      }
    ],
    "original": "/portfolio/batch-art-caps-beige.webp",
    "aiGenerated": true
  },
  {
    "id": "april",
    "title": {
      "de": "Illustration · Farben & Gesichter",
      "ar": "رسوم · ألوان ووجوه",
      "en": "Illustration · Colors & faces"
    },
    "group": "design",
    "category": "printing",
    "image": "/portfolio/concept-poster.webp",
    "presentation": true,
    "description": {
      "de": "Illustrative Designbeispiele auf Postern und Textilien.",
      "ar": "نماذج تصميم توضيحية على البوسترات والملابس.",
      "en": "Illustrative design examples on posters and clothing."
    },
    "photos": [
      {
        "image": "/portfolio/concept-faces-frame.webp",
        "presentation": true,
        "original": "/portfolio/batch-april-poster-frame.webp",
        "aiGenerated": true
      },
      {
        "image": "/portfolio/concept-faces-shirt.webp",
        "presentation": true,
        "original": "/portfolio/batch-april-tshirt.webp",
        "aiGenerated": true
      },
      {
        "image": "/portfolio/concept-faces-navy.webp",
        "presentation": true,
        "original": "/portfolio/batch-april-navy-sweatshirt.webp",
        "aiGenerated": true
      },
      {
        "image": "/portfolio/concept-faces-cream.webp",
        "presentation": true,
        "original": "/portfolio/batch-april-cream-sweatshirt.webp",
        "aiGenerated": true
      }
    ],
    "original": "/portfolio/batch-april-poster-room.webp",
    "aiGenerated": true
  },
  {
    "id": "diamantschnitt",
    "title": {
      "de": "Diamantschnitt Barbershop",
      "ar": "Diamantschnitt Barbershop",
      "en": "Diamantschnitt Barbershop"
    },
    "group": "signage",
    "category": "signage",
    "image": "/portfolio/diamantschnitt.webp",
    "original": "/portfolio/diamantschnitt-original.webp",
    "description": {
      "de": "Detailreiche Logo-Beschriftung auf Glas.",
      "ar": "شعار بتفاصيل دقيقة منفذ على الزجاج.",
      "en": "Detailed logo lettering on glass."
    }
  },
  {
    "id": "ur-barber",
    "title": {
      "de": "UR Barber Club",
      "ar": "UR Barber Club",
      "en": "UR Barber Club"
    },
    "group": "signage",
    "category": "signage",
    "image": "/portfolio/ur-barber.webp",
    "original": "/portfolio/ur-barber-original.webp",
    "description": {
      "de": "Leuchtbuchstaben, Glasdekor und Fensterbeschriftung.",
      "ar": "حروف مضيئة وفوليا للزجاج وكتابة للواجهة.",
      "en": "Illuminated letters, glass film and window lettering."
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
    },
    "photos": [
      {
        "image": "/portfolio/archive-25.webp",
        "presentation": true
      },
      {
        "image": "/portfolio/archive-28.webp",
        "presentation": true
      }
    ]
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
    },
    "photos": [
      {
        "image": "/portfolio/archive-18.webp",
        "presentation": false
      }
    ]
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
    },
    "photos": [
      {
        "image": "/portfolio/batch-oregano-flyer.webp",
        "presentation": true
      },
      {
        "image": "/portfolio/batch-oregano-menu.webp",
        "presentation": true
      },
      {
        "image": "/portfolio/batch-oregano-poster.webp",
        "presentation": true
      },
      {
        "image": "/portfolio/archive-04.webp",
        "presentation": true
      },
      {
        "image": "/portfolio/archive-08.webp",
        "presentation": true
      },
      {
        "image": "/portfolio/archive-12.webp",
        "presentation": true
      },
      {
        "image": "/portfolio/archive-16.webp",
        "presentation": true
      },
      {
        "image": "/portfolio/archive-21.webp",
        "presentation": true
      }
    ]
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
    },
    "photos": [
      {
        "image": "/portfolio/archive-09.webp",
        "presentation": true
      },
      {
        "image": "/portfolio/archive-13.webp",
        "presentation": true
      },
      {
        "image": "/portfolio/archive-17.webp",
        "presentation": true
      }
    ]
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
    },
    "photos": [
      {
        "image": "/portfolio/archive-31.webp",
        "presentation": false
      }
    ]
  },
  {
    "id": "technical-signage",
    "title": {
      "de": "Profilbuchstaben · Innenraum",
      "ar": "حروف بارزة داخلية",
      "en": "Dimensional interior lettering"
    },
    "group": "signage",
    "category": "signage",
    "image": "/portfolio/archive-05.webp",
    "description": {
      "de": "Weitere Einblicke in Beschriftung und Gestaltung.",
      "ar": "لقطات إضافية من أعمال الحروف والتصميم.",
      "en": "Further views of lettering and design work."
    },
    "photos": [
      {
        "image": "/portfolio/archive-10.webp",
        "presentation": false
      },
      {
        "image": "/portfolio/archive-14.webp",
        "presentation": false
      }
    ],
    "presentation": false
  },
  {
    "id": "delux",
    "title": {
      "de": "Delux Haar",
      "ar": "Delux Haar",
      "en": "Delux Haar"
    },
    "group": "signage",
    "category": "signage",
    "image": "/portfolio/archive-02.webp",
    "description": {
      "de": "Weitere Einblicke in Beschriftung und Gestaltung.",
      "ar": "لقطات إضافية من أعمال الحروف والتصميم.",
      "en": "Further views of lettering and design work."
    },
    "photos": [],
    "presentation": false
  },
  {
    "id": "legend",
    "title": {
      "de": "Legend Cut",
      "ar": "Legend Cut",
      "en": "Legend Cut"
    },
    "group": "design",
    "category": "printing",
    "image": "/portfolio/archive-33.webp",
    "description": {
      "de": "Postergestaltung für einen Friseursalon.",
      "ar": "تصميم بوستر لصالون حلاقة وتصفيف الشعر.",
      "en": "Poster design for a hair salon."
    },
    "photos": [],
    "presentation": true
  },
  {
    "id": "derbeck",
    "title": {
      "de": "Dr. foody",
      "ar": "Dr. foody",
      "en": "Dr. foody"
    },
    "group": "signage",
    "category": "signage",
    "image": "/portfolio/archive-37.webp",
    "description": {
      "de": "Eckfassade mit Speisetafeln und bedruckten Fensterflächen.",
      "ar": "واجهة زاوية مع لوحات أصناف وطباعة على الزجاج.",
      "en": "Corner facade with food boards and printed window panels."
    },
    "photos": [],
    "presentation": false
  },
  {
    "id": "tazzo",
    "title": {
      "de": "Tazzo · Neon",
      "ar": "Tazzo · نيون",
      "en": "Tazzo · Neon"
    },
    "group": "signage",
    "category": "signage",
    "image": "/portfolio/archive-38.webp",
    "description": {
      "de": "Weitere Einblicke in Beschriftung und Gestaltung.",
      "ar": "لقطات إضافية من أعمال الحروف والتصميم.",
      "en": "Further views of lettering and design work."
    },
    "photos": [],
    "presentation": false
  },
  {
    "id": "lataria",
    "title": {
      "de": "LATARIA",
      "ar": "LATARIA",
      "en": "LATARIA"
    },
    "group": "textile",
    "category": "textile",
    "image": "/portfolio/batch-latakia-illustrated-large.webp",
    "maxDisplayWidth": 715,
    "description": {
      "de": "Illustrationsmotiv mit LATARIA-Schriftzug auf einem Sweatshirt.",
      "ar": "تصميم رسومي بكتابة LATARIA على سويت شيرت.",
      "en": "Illustrated LATARIA lettering on a sweatshirt."
    },
    "photos": [],
    "presentation": true
  },
  {
    "id": "transport-trailer",
    "title": {
      "de": "Anhänger · Beschriftung",
      "ar": "حروف وطباعة للمقطورات",
      "en": "Trailer graphics"
    },
    "group": "signage",
    "category": "signage",
    "image": "/portfolio/archive-32.webp",
    "description": {
      "de": "Weitere Einblicke in Beschriftung und Gestaltung.",
      "ar": "لقطات إضافية من أعمال الحروف والتصميم.",
      "en": "Further views of lettering and design work."
    },
    "photos": [],
    "presentation": true
  }
];
