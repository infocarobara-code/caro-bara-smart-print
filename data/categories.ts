import type { LocalizedText } from "@/types/service";

export type Category = {
  id: string;
  title: LocalizedText;
  image: string;
  description: LocalizedText;
};

export const categories: Category[] = [
  {
    id: "signage",
    title: {
      ar: "اللوحات والعرض",
      de: "Schilder & Displays",
      en: "Signage & Display",
    },
    image: "/categories/signage.jpg",
    description: {
      ar: "لوحات مضيئة، حروف بارزة، واجهات محلات احترافية.",
      de: "Leuchtschilder, 3D-Buchstaben und Fassadenlösungen.",
      en: "Light signs, 3D letters, and shop facades.",
    },
  },
  {
    id: "printing",
    title: {
      ar: "الطباعة والمواد المكتبية",
      de: "Druck & Geschäftsmaterialien",
      en: "Printing & Office Materials",
    },
    image: "/categories/printing.jpg",
    description: {
      ar: "بطاقات، بروشورات، منيوهات وكل ما تحتاجه للطباعة.",
      de: "Visitenkarten, Flyer und Drucklösungen.",
      en: "Business cards, flyers and printing solutions.",
    },
  },
  {
    id: "packaging-labeling",
    title: {
      ar: "التغليف والملصقات",
      de: "Verpackung & Etiketten",
      en: "Packaging & Labels",
    },
    image: "/categories/packaging.jpg",
    description: {
      ar: "تصميم وطباعة ملصقات وتغليف احترافي.",
      de: "Etiketten und Verpackungsdesign.",
      en: "Labels and packaging solutions.",
    },
  },
  {
    id: "textile-promotional",
    title: {
      ar: "الملابس والمواد الدعائية",
      de: "Textil & Werbeartikel",
      en: "Textile & Promotional",
    },
    image: "/categories/textile.jpg",
    description: {
      ar: "طباعة تيشيرتات ومواد دعائية مخصصة.",
      de: "Textildruck und Werbeartikel.",
      en: "T-shirt printing and promotional items.",
    },
  },
  {
    id: "branding-design",
    title: {
      ar: "الهوية والتصميم",
      de: "Branding & Design",
      en: "Branding & Design",
    },
    image: "/categories/branding.jpg",
    description: {
      ar: "تصميم شعارات وهوية بصرية احترافية.",
      de: "Logo- und Corporate Design.",
      en: "Brand identity and logo design.",
    },
  },
  {
    id: "fabrication-decor",
    title: {
      ar: "التصنيع والديكور",
      de: "Fertigung & Dekor",
      en: "Fabrication & Decor",
    },
    image: "/categories/fabrication.jpg",
    description: {
      ar: "تنفيذ مشاريع خاصة وديكور احترافي.",
      de: "Sonderanfertigungen und Dekor.",
      en: "Custom fabrication and decor.",
    },
  },
];