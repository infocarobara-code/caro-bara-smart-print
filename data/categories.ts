import type { LocalizedText } from "@/types/service";

export type Category = {
  id: string;
  title: LocalizedText;
  image: string;
  description: LocalizedText;
};

export const categories: Category[] = [
  {
    id: "smart",
    title: {
      ar: "الطلب الذكي",
      de: "Intelligente Anfrage",
      en: "Smart Request",
    },
    image: "/categories/smart-request.webp",
    description: {
      ar: "إذا لم تكن متأكدًا مما تحتاجه، ابدأ من هنا. هذا المسار يساعدك على تحويل الفكرة غير الواضحة إلى طلب منظم وواضح وقابل للتنفيذ.",
      de: "Wenn du noch nicht genau weißt, was du brauchst, beginne hier. Dieser Weg hilft dir dabei, aus einer noch unklaren Idee eine strukturierte und umsetzbare Anfrage zu machen.",
      en: "If you are not sure what you need yet, start here. This path helps turn an unclear idea into a structured and execution-ready request.",
    },
  },
  {
    id: "signage",
    title: {
      ar: "اللوحات والواجهات والإضاءات",
      de: "Schilder, Fassaden & Lichtwerbung",
      en: "Signs, Facades & Light Advertising",
    },
    image: "/categories/signage.webp",
    description: {
      ar: "لوحات خارجية وداخلية، حروف بارزة، حروف مضيئة، صناديق ضوئية، وواجهات تجارية للمحال والمشاريع.",
      de: "Außen- und Innenschilder, Profilbuchstaben, Leuchtbuchstaben, Lichtkästen und Fassadenlösungen für Geschäfte und Unternehmen.",
      en: "Indoor and outdoor signs, raised letters, illuminated letters, light boxes, and facade solutions for shops and businesses.",
    },
  },
  {
    id: "surfaces",
    title: {
      ar: "الزجاج والأسطح اللاصقة",
      de: "Fenster & Folienflächen",
      en: "Window & Surface Graphics",
    },
    image: "/categories/window-graphics.webp",
    description: {
      ar: "تغليف زجاج، One Way Vision، Frosted، قص حروف، وملصقات لواجهات وأسطح مختلفة.",
      de: "Glasfolierung, One Way Vision, Milchglasfolie, Plottschrift und Klebegrafiken für Fenster und verschiedene Oberflächen.",
      en: "Glass wrapping, one-way vision, frosted film, cut lettering, and adhesive graphics for windows and different surfaces.",
    },
  },
  {
    id: "vehicle",
    title: {
      ar: "المركبات",
      de: "Fahrzeugbeschriftung & Folierung",
      en: "Vehicle Branding",
    },
    image: "/categories/vehicle-branding.webp",
    description: {
      ar: "تغليف سيارات كامل أو جزئي، كتابة على المركبات، وتجهيز سيارات وفانات الشركات بهوية بصرية واضحة.",
      de: "Voll- oder Teilfolierung, Fahrzeugbeschriftung und Branding für Autos, Vans und Firmenfahrzeuge mit klarer Markenwirkung.",
      en: "Full or partial vehicle wraps, vehicle lettering, and branding for cars, vans, and company fleets.",
    },
  },
  {
    id: "printing",
    title: {
      ar: "المطبوعات الورقية",
      de: "Papierdrucksachen",
      en: "Paper Printing",
    },
    image: "/categories/paper-printing.webp",
    description: {
      ar: "كروت أعمال، فلايرات، بروشورات، منيوهات، بوسترات، أوراق رسمية، ومطبوعات مكتبية وتجارية.",
      de: "Visitenkarten, Flyer, Broschüren, Speisekarten, Poster, Briefpapier und weitere geschäftliche Drucksachen.",
      en: "Business cards, flyers, brochures, menus, posters, letterheads, and other business print materials.",
    },
  },
  {
    id: "packaging",
    title: {
      ar: "التغليف والملصقات",
      de: "Verpackung & Etiketten",
      en: "Packaging & Labels",
    },
    image: "/categories/packaging-print.webp",
    description: {
      ar: "ملصقات منتجات، ستيكرات، علب، أكياس، وتغليف عملي أو فاخر للمشاريع والمتاجر والعلامات التجارية.",
      de: "Produktetiketten, Sticker, Boxen, Taschen und praktische oder hochwertige Verpackungslösungen für Marken und Geschäfte.",
      en: "Product labels, stickers, boxes, bags, and practical or premium packaging solutions for brands and shops.",
    },
  },
  {
    id: "display",
    title: {
      ar: "العرض والفعاليات",
      de: "Displays & Events",
      en: "Display & Events",
    },
    image: "/categories/exhibition-display.webp",
    description: {
      ar: "رول أب، بنرات، أعلام، ستاندات عرض، وخلفيات وتجهيزات خاصة بالمعارض والافتتاحات والفعاليات.",
      de: "Roll-Ups, Banner, Fahnen, Displaystände und Eventlösungen für Messen, Eröffnungen und Veranstaltungen.",
      en: "Roll-ups, banners, flags, display stands, and event solutions for exhibitions, openings, and special events.",
    },
  },
  {
    id: "textile",
    title: {
      ar: "الملابس والهدايا الدعائية",
      de: "Textil & Werbeartikel",
      en: "Textile & Promotional",
    },
    image: "/categories/apparel-printing.webp",
    description: {
      ar: "طباعة ملابس، تيشيرتات، هوديز، قبعات، وأكواب وهدايا دعائية مخصصة للشركات والفعاليات.",
      de: "Textildruck, T-Shirts, Hoodies, Caps sowie Tassen und individualisierte Werbeartikel für Marken und Events.",
      en: "Textile printing, T-shirts, hoodies, caps, mugs, and customized promotional items for brands and events.",
    },
  },
  {
    id: "fabrication",
    title: {
      ar: "التصنيع والتجهيز الخاص",
      de: "Sonderfertigung & Umsetzung",
      en: "Custom Fabrication",
    },
    image: "/categories/custom-fabrication.webp",
    description: {
      ar: "قص CNC أو ليزر، تصنيع عناصر خاصة، وتجهيز محلات ومشاريع بعناصر تنفيذية حسب الطلب.",
      de: "CNC- oder Laserschnitt, Sonderanfertigungen und projektbezogene Umsetzungslösungen nach Maß.",
      en: "CNC or laser cutting, custom production, and made-to-order execution solutions for shops and projects.",
    },
  },
  {
    id: "branding",
    title: {
      ar: "الهوية والتصميم",
      de: "Branding & Design",
      en: "Branding & Design",
    },
    image: "/categories/branding-design.webp",
    description: {
      ar: "تصميم شعار، هوية بصرية كاملة، ألوان، تطبيقات أساسية، واتجاه بصري متكامل للمشروع.",
      de: "Logoentwicklung, Corporate Design, Farben, Anwendungen und ein vollständiger visueller Markenauftritt.",
      en: "Logo design, full visual identity, colors, core applications, and a complete visual direction for the project.",
    },
  },
  {
    id: "marketing",
    title: {
      ar: "التسويق والحلول المتكاملة",
      de: "Marketing & Komplettlösungen",
      en: "Marketing & Complete Solutions",
    },
    image: "/categories/marketing-solutions.webp",
    description: {
      ar: "حلول متكاملة تساعد المشروع على الظهور، وتجمع بين المواد المطبوعة والحضور البصري والتجهيز والتنظيم.",
      de: "Ganzheitliche Lösungen für Sichtbarkeit, die Drucksachen, visuelle Präsenz und Projektvorbereitung miteinander verbinden.",
      en: "Complete solutions that support project visibility by combining print, visual presence, and structured preparation.",
    },
  },
];