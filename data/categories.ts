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
    image: "/categories/smart.jpg",
    description: {
      ar: "إذا لم تكن متأكدًا مما تحتاجه، ابدأ من هنا ودعنا نرتب لك الطلب بشكل صحيح.",
      de: "Wenn du noch nicht genau weißt, was du brauchst, beginne hier und wir strukturieren deine Anfrage richtig.",
      en: "If you are not sure what you need, start here and let us structure your request properly.",
    },
  },
  {
    id: "signage",
    title: {
      ar: "اللوحات والواجهات",
      de: "Schilder & Fassaden",
      en: "Signage & Facades",
    },
    image: "/categories/signage.jpg",
    description: {
      ar: "لوحات خارجية وداخلية، حروف بارزة، حروف مضيئة، وصناديق ضوئية للمحال والمشاريع.",
      de: "Außen- und Innenschilder, Profilbuchstaben, Leuchtbuchstaben und Lichtkästen für Geschäfte und Unternehmen.",
      en: "Indoor and outdoor signs, raised letters, illuminated letters, and light boxes for shops and businesses.",
    },
  },
  {
    id: "surfaces",
    title: {
      ar: "الزجاج والأسطح اللاصقة",
      de: "Fenster & Folienflächen",
      en: "Window & Surface Graphics",
    },
    image: "/categories/surfaces.jpg",
    description: {
      ar: "تغليف زجاج، One Way Vision، Frosted، وقص حروف وملصقات للأسطح المختلفة.",
      de: "Glasfolierung, One Way Vision, Milchglasfolie, Plottschrift und Folien für verschiedene Oberflächen.",
      en: "Glass wrapping, one-way vision, frosted film, cut letters, and adhesive graphics for different surfaces.",
    },
  },
  {
    id: "vehicle",
    title: {
      ar: "المركبات",
      de: "Fahrzeuge",
      en: "Vehicle Branding",
    },
    image: "/categories/vehicle.jpg",
    description: {
      ar: "تغليف سيارات كامل أو جزئي، كتابة على المركبات، وتجهيز سيارات وفانات الشركات.",
      de: "Voll- oder Teilfolierung, Fahrzeugbeschriftung und Branding für Autos, Vans und Firmenfahrzeuge.",
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
    image: "/categories/printing.jpg",
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
    image: "/categories/packaging.jpg",
    description: {
      ar: "ملصقات منتجات، ستيكرات، علب، أكياس، وتغليف عملي أو فاخر للمشاريع والمتاجر.",
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
    image: "/categories/display.jpg",
    description: {
      ar: "رول أب، بنرات، أعلام، ستاندات عرض، وخلفيات وتصاميم خاصة بالمعارض والافتتاحات والفعاليات.",
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
    image: "/categories/textile.jpg",
    description: {
      ar: "طباعة ملابس، تيشيرتات، هوديز، قبعات، وأكواب وهدايا دعائية مخصصة.",
      de: "Textildruck, T-Shirts, Hoodies, Caps sowie Tassen und individualisierte Werbeartikel.",
      en: "Textile printing, T-shirts, hoodies, caps, mugs, and customized promotional items.",
    },
  },
  {
    id: "fabrication",
    title: {
      ar: "التصنيع والتجهيز الخاص",
      de: "Sonderfertigung & Umsetzung",
      en: "Custom Fabrication",
    },
    image: "/categories/fabrication.jpg",
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
    image: "/categories/branding.jpg",
    description: {
      ar: "تصميم شعار، هوية بصرية كاملة، ألوان، تطبيقات أساسية، ورؤية بصرية متكاملة للمشروع.",
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
    image: "/categories/marketing.jpg",
    description: {
      ar: "حلول متكاملة تساعد المشروع على الظهور، وتجمع بين المواد المطبوعة والحضور البصري والتجهيز.",
      de: "Ganzheitliche Lösungen für Sichtbarkeit, die Drucksachen, visuelle Präsenz und Projektvorbereitung verbinden.",
      en: "Complete solutions that support project visibility by combining print, visual presence, and preparation.",
    },
  },
];