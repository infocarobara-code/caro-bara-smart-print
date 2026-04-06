import type { Service } from "@/types/service";
import { emailField, referenceFileField } from "./shared";

export const extraServices: Service[] = [
  {
    id: "stickers-labels",
    category: "packaging",
    title: {
      ar: "الملصقات والستيكر",
      de: "Sticker & Etiketten",
      en: "Stickers & Labels",
    },
    description: {
      ar: "ملصقات منتجات، ستيكرات شعار، قص خاص، وملصقات للتغليف أو الاستخدام الداخلي والخارجي.",
      de: "Produktetiketten, Logo-Sticker, Konturschnitt und Aufkleber für Verpackung sowie Innen- und Außeneinsatz.",
      en: "Product labels, logo stickers, contour-cut stickers, and adhesive labels for packaging and indoor/outdoor use.",
    },
    intro: {
      ar: "هذا القسم مناسب لملصقات المنتجات والستيكرات الدعائية وملصقات التغليف والقص الخاص.",
      de: "Dieser Bereich ist für Produktetiketten, Werbesticker, Verpackungslabels und Konturschnitt geeignet.",
      en: "This section is suitable for product labels, promotional stickers, packaging labels, and contour-cut sticker requests.",
    },
    requestGuidance: [
      {
        ar: "حدد نوع الملصق أولًا: منتج، شعار، شيت، رول، أو ملصق جداري.",
        de: "Gib zuerst an, ob es sich um Produktetiketten, Logo-Sticker, Stickerbogen, Rollenetiketten oder Wandsticker handelt.",
        en: "First specify whether you need product labels, logo stickers, sticker sheets, roll labels, or wall stickers.",
      },
      {
        ar: "المقاس والشكل والكمية من أهم العناصر لتحديد السعر وطريقة الإنتاج.",
        de: "Format, Form und Menge sind die wichtigsten Faktoren für Preis und Produktionsart.",
        en: "Size, shape, and quantity are the most important factors for pricing and production method.",
      },
      {
        ar: "إذا كان الملصق للاستخدام الخارجي أو يحتاج حماية، اذكر ذلك بوضوح.",
        de: "Wenn der Sticker für außen gedacht ist oder Schutzlaminat braucht, gib das klar an.",
        en: "If the sticker is for outdoor use or needs protection, mention that clearly.",
      },
    ],
    fields: [
      {
        id: "customerName",
        type: "text",
        label: { ar: "اسم العميل", de: "Kundenname", en: "Customer Name" },
        placeholder: { ar: "اكتب اسمك", de: "Gib deinen Namen ein", en: "Enter your name" },
        required: true,
        semanticGroup: "contact",
      },
      {
        id: "phone",
        type: "text",
        label: { ar: "رقم الهاتف", de: "Telefonnummer", en: "Phone Number" },
        placeholder: { ar: "اكتب رقم الهاتف", de: "Telefonnummer eingeben", en: "Enter phone number" },
        required: true,
        semanticGroup: "contact",
      },
      emailField,
      {
        id: "stickerType",
        type: "select",
        label: { ar: "نوع الطلب", de: "Art der Anfrage", en: "Request Type" },
        required: true,
        semanticGroup: "project",
        options: [
          { value: "product-label", label: { ar: "ملصق منتج", de: "Produktetikett", en: "Product Label" } },
          { value: "logo-sticker", label: { ar: "ستيكر شعار", de: "Logo-Sticker", en: "Logo Sticker" } },
          { value: "sheet-sticker", label: { ar: "ستيكر شيت", de: "Stickerbogen", en: "Sticker Sheet" } },
          { value: "roll-label", label: { ar: "ملصق رول", de: "Rollenetikett", en: "Roll Label" } },
          { value: "wall-sticker", label: { ar: "ملصق جداري", de: "Wandsticker", en: "Wall Sticker" } },
        ],
      },
      {
        id: "quantity",
        type: "number",
        label: { ar: "الكمية", de: "Menge", en: "Quantity" },
        placeholder: { ar: "مثال: 1000", de: "Beispiel: 1000", en: "Example: 1000" },
        semanticGroup: "dimensions",
      },
      {
        id: "size",
        type: "text",
        label: { ar: "المقاس", de: "Format", en: "Size" },
        placeholder: { ar: "مثال: 5x5 سم", de: "Beispiel: 5x5 cm", en: "Example: 5x5 cm" },
        semanticGroup: "dimensions",
      },
      {
        id: "shape",
        type: "select",
        label: { ar: "الشكل", de: "Form", en: "Shape" },
        semanticGroup: "dimensions",
        options: [
          { value: "square", label: { ar: "مربع", de: "Quadratisch", en: "Square" } },
          { value: "round", label: { ar: "دائري", de: "Rund", en: "Round" } },
          { value: "rect", label: { ar: "مستطيل", de: "Rechteckig", en: "Rectangle" } },
          { value: "custom", label: { ar: "قص خاص", de: "Freiform", en: "Custom Cut" } },
        ],
      },
      {
        id: "lamination",
        type: "radio",
        label: { ar: "هل تحتاج حماية؟", de: "Schutzlaminat?", en: "Need Protection?" },
        semanticGroup: "production",
        options: [
          { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
          { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
        ],
      },
      referenceFileField,
      {
        id: "notes",
        type: "textarea",
        label: { ar: "تفاصيل إضافية", de: "Zusätzliche Details", en: "Additional Details" },
        placeholder: {
          ar: "اكتب نوع المنتج أو السطح، وهل الملصق للتعبئة أو الشحن أو العلامة التجارية أو الاستخدام المؤقت",
          de: "Beschreibe Produkt- oder Oberflächenart und ob das Etikett für Verpackung, Versand, Branding oder temporäre Nutzung gedacht ist",
          en: "Describe the product or surface type and whether the sticker is for packaging, shipping, branding, or temporary use",
        },
        semanticGroup: "notes",
      },
    ],
  },

  {
    id: "textile-printing",
    category: "textile",
    title: {
      ar: "طباعة الملابس",
      de: "Textildruck",
      en: "Textile Printing",
    },
    description: {
      ar: "طباعة على التيشيرتات والهودي والقبعات والملابس باستخدام تقنيات مختلفة حسب الطلب.",
      de: "Druck auf T-Shirts, Hoodies, Caps und Kleidung mit verschiedenen Verfahren je nach Bedarf.",
      en: "Printing on T-shirts, hoodies, caps, and garments using different techniques based on your needs.",
    },
    intro: {
      ar: "هذا القسم مخصص لطباعة الملابس للأفراد والشركات والفعاليات والعلامات التجارية.",
      de: "Dieser Bereich ist für Textildruck für Einzelpersonen, Firmen, Events und Marken gedacht.",
      en: "This section is for textile printing for individuals, companies, events, and brands.",
    },
    requestGuidance: [
      {
        ar: "حدد نوع القطعة أولًا (تيشيرت، هودي، قبعة...).",
        de: "Gib zuerst das Kleidungsstück an (T-Shirt, Hoodie, Cap...).",
        en: "Start by specifying the garment type (T-shirt, hoodie, cap...).",
      },
      {
        ar: "اذكر الكمية والمقاسات والألوان المطلوبة.",
        de: "Gib Menge, Größen und Farben an.",
        en: "Specify quantity, sizes, and colors.",
      },
      {
        ar: "إذا كان لديك تصميم جاهز، أرفقه لتسريع التنفيذ.",
        de: "Wenn du ein fertiges Design hast, füge es hinzu, um die Produktion zu beschleunigen.",
        en: "If you have a ready design, attach it to speed up production.",
      },
    ],
    fields: [
      {
        id: "customerName",
        type: "text",
        label: { ar: "اسم العميل", de: "Kundenname", en: "Customer Name" },
        placeholder: { ar: "اكتب اسمك", de: "Gib deinen Namen ein", en: "Enter your name" },
        required: true,
        semanticGroup: "contact",
      },
      {
        id: "phone",
        type: "text",
        label: { ar: "رقم الهاتف", de: "Telefonnummer", en: "Phone Number" },
        placeholder: { ar: "اكتب رقم الهاتف", de: "Telefonnummer eingeben", en: "Enter phone number" },
        required: true,
        semanticGroup: "contact",
      },
      emailField,
      {
        id: "garmentType",
        type: "select",
        label: { ar: "نوع القطعة", de: "Kleidungsstück", en: "Garment Type" },
        required: true,
        semanticGroup: "project",
        options: [
          { value: "tshirt", label: { ar: "تيشيرت", de: "T-Shirt", en: "T-Shirt" } },
          { value: "hoodie", label: { ar: "هودي", de: "Hoodie", en: "Hoodie" } },
          { value: "cap", label: { ar: "قبعة", de: "Cap", en: "Cap" } },
          { value: "workwear", label: { ar: "ملابس عمل", de: "Arbeitskleidung", en: "Workwear" } },
          { value: "other", label: { ar: "أخرى", de: "Andere", en: "Other" } },
        ],
      },
      {
        id: "printMethod",
        type: "select",
        label: { ar: "طريقة الطباعة", de: "Druckverfahren", en: "Print Method" },
        semanticGroup: "production",
        options: [
          { value: "dtf", label: { ar: "DTF", de: "DTF", en: "DTF" } },
          { value: "screen", label: { ar: "سيلك سكرين", de: "Siebdruck", en: "Screen Printing" } },
          { value: "vinyl", label: { ar: "فلكس / فلوك", de: "Flex / Flock", en: "Vinyl (Flex/Flock)" } },
          { value: "sublimation", label: { ar: "سوبليميشن", de: "Sublimation", en: "Sublimation" } },
        ],
      },
      {
        id: "quantity",
        type: "number",
        label: { ar: "الكمية", de: "Menge", en: "Quantity" },
        placeholder: { ar: "مثال: 50", de: "Beispiel: 50", en: "Example: 50" },
        required: true,
        semanticGroup: "dimensions",
      },
      {
        id: "sizes",
        type: "text",
        label: { ar: "المقاسات", de: "Größen", en: "Sizes" },
        placeholder: { ar: "S, M, L, XL...", de: "S, M, L, XL...", en: "S, M, L, XL..." },
        semanticGroup: "dimensions",
      },
      {
        id: "colors",
        type: "text",
        label: { ar: "ألوان القطع", de: "Farben", en: "Colors" },
        placeholder: { ar: "أسود، أبيض...", de: "Schwarz, Weiß...", en: "Black, White..." },
        semanticGroup: "materials",
      },
      referenceFileField,
      {
        id: "notes",
        type: "textarea",
        label: { ar: "تفاصيل إضافية", de: "Zusätzliche Details", en: "Additional Details" },
        placeholder: {
          ar: "اذكر مكان الطباعة (صدر، ظهر...) وحجم التصميم وأي تفاصيل إضافية",
          de: "Gib Druckposition (Brust, Rücken...) und Größe des Designs an",
          en: "Mention print position (front, back...) and design size",
        },
        semanticGroup: "notes",
      },
    ],
  },

  {
    id: "banners-flags",
    category: "signage",
    title: {
      ar: "البنرات والأعلام",
      de: "Banner & Fahnen",
      en: "Banners & Flags",
    },
    description: {
      ar: "بنرات إعلانية، رول أب، أعلام، ولافتات للفعاليات والمعارض.",
      de: "Werbebanner, Roll-Ups, Fahnen und Displays für Events und Messen.",
      en: "Advertising banners, roll-ups, flags, and displays for events and exhibitions.",
    },
    intro: {
      ar: "هذا القسم مناسب للفعاليات والمعارض والحملات الإعلانية المؤقتة.",
      de: "Dieser Bereich ist ideal für Events, Messen und temporäre Werbekampagnen.",
      en: "This section is suitable for events, exhibitions, and temporary campaigns.",
    },
    requestGuidance: [
      {
        ar: "حدد نوع المنتج أولًا (بنر، رول أب، علم...).",
        de: "Gib zuerst das Produkt an (Banner, Roll-Up, Fahne...).",
        en: "Specify the product type first (banner, roll-up, flag...).",
      },
      {
        ar: "اذكر المقاس ومكان الاستخدام (داخلي أو خارجي).",
        de: "Gib Größe und Einsatzort (innen oder außen) an.",
        en: "Mention size and usage (indoor or outdoor).",
      },
      {
        ar: "أرفق التصميم إن وجد.",
        de: "Design hochladen, falls vorhanden.",
        en: "Attach design if available.",
      },
    ],
    fields: [
      {
        id: "customerName",
        type: "text",
        label: { ar: "اسم العميل", de: "Kundenname", en: "Customer Name" },
        required: true,
        semanticGroup: "contact",
      },
      {
        id: "phone",
        type: "text",
        label: { ar: "رقم الهاتف", de: "Telefonnummer", en: "Phone Number" },
        required: true,
        semanticGroup: "contact",
      },
      emailField,
      {
        id: "productType",
        type: "select",
        label: { ar: "نوع المنتج", de: "Produkttyp", en: "Product Type" },
        semanticGroup: "project",
        options: [
          { value: "banner", label: { ar: "بنر", de: "Banner", en: "Banner" } },
          { value: "rollup", label: { ar: "رول أب", de: "Roll-Up", en: "Roll-Up" } },
          { value: "flag", label: { ar: "علم", de: "Fahne", en: "Flag" } },
        ],
      },
      {
        id: "size",
        type: "text",
        label: { ar: "المقاس", de: "Größe", en: "Size" },
        semanticGroup: "dimensions",
      },
      {
        id: "usage",
        type: "radio",
        label: { ar: "مكان الاستخدام", de: "Einsatzort", en: "Usage" },
        semanticGroup: "production",
        options: [
          { value: "indoor", label: { ar: "داخلي", de: "Innen", en: "Indoor" } },
          { value: "outdoor", label: { ar: "خارجي", de: "Außen", en: "Outdoor" } },
        ],
      },
      referenceFileField,
      {
        id: "notes",
        type: "textarea",
        label: { ar: "تفاصيل إضافية", de: "Zusätzliche Details", en: "Additional Details" },
        semanticGroup: "notes",
      },
    ],
  },

  {
    id: "promotional-items",
    category: "textile",
    title: {
      ar: "الهدايا والمواد الدعائية",
      de: "Werbeartikel & Giveaways",
      en: "Promotional Items",
    },
    description: {
      ar: "أكواب، أقلام، ميداليات، دفاتر، وهدايا دعائية مخصصة للشركات والمناسبات.",
      de: "Tassen, Kugelschreiber, Schlüsselanhänger, Notizbücher und individualisierte Giveaways.",
      en: "Mugs, pens, keychains, notebooks, and customized promotional items.",
    },
    intro: {
      ar: "هذا القسم مناسب للهدايا التسويقية التي تحمل هوية المشروع.",
      de: "Dieser Bereich ist ideal für personalisierte Werbeartikel.",
      en: "This section is for customized promotional products.",
    },
    requestGuidance: [
      {
        ar: "اذكر نوع المنتج أولاً.",
        de: "Gib zuerst den Produkttyp an.",
        en: "Start with the product type.",
      },
      {
        ar: "حدد الكمية وطريقة الطباعة.",
        de: "Menge und Druckart angeben.",
        en: "Specify quantity and print method.",
      },
    ],
    fields: [
      {
        id: "customerName",
        type: "text",
        label: { ar: "اسم العميل", de: "Kundenname", en: "Customer Name" },
        required: true,
        semanticGroup: "contact",
      },
      {
        id: "phone",
        type: "text",
        label: { ar: "رقم الهاتف", de: "Telefonnummer", en: "Phone Number" },
        required: true,
        semanticGroup: "contact",
      },
      emailField,
      {
        id: "productType",
        type: "text",
        label: { ar: "نوع المنتج", de: "Produkt", en: "Product Type" },
        required: true,
        semanticGroup: "project",
      },
      {
        id: "printMethod",
        type: "text",
        label: { ar: "نوع الطباعة", de: "Druckart", en: "Print Method" },
        semanticGroup: "production",
      },
      {
        id: "quantity",
        type: "number",
        label: { ar: "الكمية", de: "Menge", en: "Quantity" },
        required: true,
        semanticGroup: "dimensions",
      },
      referenceFileField,
      {
        id: "notes",
        type: "textarea",
        label: { ar: "ملاحظات", de: "Details", en: "Notes" },
        semanticGroup: "notes",
      },
    ],
  },

  {
    id: "event-printing",
    category: "display",
    title: {
      ar: "العرض والفعاليات",
      de: "Display & Messe",
      en: "Display & Exhibition",
    },
    description: {
      ar: "ستاندات، خلفيات، تجهيز معارض وفعاليات.",
      de: "Displays, Fotowände und Messeausstattung.",
      en: "Displays, backdrops, and exhibition setups.",
    },
    intro: {
      ar: "مناسب للفعاليات والمعارض.",
      de: "Ideal für Events.",
      en: "Ideal for events.",
    },
    requestGuidance: [
      {
        ar: "حدد نوع العنصر والمقاسات.",
        de: "Element und Maße angeben.",
        en: "Specify type and size.",
      },
    ],
    fields: [
      {
        id: "customerName",
        type: "text",
        label: { ar: "اسم العميل", de: "Kundenname", en: "Customer Name" },
        required: true,
        semanticGroup: "contact",
      },
      {
        id: "phone",
        type: "text",
        label: { ar: "رقم الهاتف", de: "Telefonnummer", en: "Phone Number" },
        required: true,
        semanticGroup: "contact",
      },
      emailField,
      {
        id: "productType",
        type: "text",
        label: { ar: "نوع العنصر", de: "Element", en: "Item Type" },
        required: true,
        semanticGroup: "project",
      },
      {
        id: "size",
        type: "text",
        label: { ar: "المقاس", de: "Größe", en: "Size" },
        required: true,
        semanticGroup: "dimensions",
      },
      {
        id: "eventDate",
        type: "text",
        label: { ar: "تاريخ الفعالية", de: "Datum", en: "Event Date" },
        semanticGroup: "delivery",
      },
      referenceFileField,
      {
        id: "notes",
        type: "textarea",
        label: { ar: "تفاصيل إضافية", de: "Details", en: "Details" },
        semanticGroup: "notes",
      },
    ],
  },

  {
    id: "branding-design",
    category: "branding",
    title: {
      ar: "الهوية البصرية والتصميم",
      de: "Branding & Design",
      en: "Branding & Design",
    },
    description: {
      ar: "تصميم هوية كاملة تشمل الشعار والألوان والتطبيقات.",
      de: "Komplettes Branding inklusive Logo und Farben.",
      en: "Full branding including logo and identity.",
    },
    intro: {
      ar: "مناسب لبناء مشروع من الصفر.",
      de: "Ideal für neue Projekte.",
      en: "Ideal for new businesses.",
    },
    requestGuidance: [
      {
        ar: "اذكر نوع المشروع والفئة المستهدفة.",
        de: "Projekt und Zielgruppe beschreiben.",
        en: "Describe business and audience.",
      },
    ],
    fields: [
      {
        id: "customerName",
        type: "text",
        label: { ar: "اسم العميل", de: "Kundenname", en: "Customer Name" },
        required: true,
        semanticGroup: "contact",
      },
      {
        id: "phone",
        type: "text",
        label: { ar: "رقم الهاتف", de: "Telefonnummer", en: "Phone Number" },
        required: true,
        semanticGroup: "contact",
      },
      emailField,
      {
        id: "businessType",
        type: "text",
        label: { ar: "نوع المشروع", de: "Business", en: "Business Type" },
        required: true,
        semanticGroup: "project",
      },
      {
        id: "targetAudience",
        type: "text",
        label: { ar: "الفئة المستهدفة", de: "Zielgruppe", en: "Target Audience" },
        semanticGroup: "project",
      },
      {
        id: "style",
        type: "text",
        label: { ar: "الأسلوب", de: "Stil", en: "Style" },
        semanticGroup: "design",
      },
      referenceFileField,
      {
        id: "notes",
        type: "textarea",
        label: { ar: "الرؤية", de: "Vision", en: "Vision" },
        semanticGroup: "notes",
      },
    ],
  },

  {
    id: "logo-design-only",
    category: "branding",
    title: {
      ar: "تصميم شعار فقط",
      de: "Logo Design",
      en: "Logo Design Only",
    },
    description: {
      ar: "تصميم شعار احترافي فقط.",
      de: "Professionelles Logo.",
      en: "Professional logo design.",
    },
    intro: {
      ar: "مناسب لمن يريد شعار فقط.",
      de: "Nur Logo.",
      en: "Logo only.",
    },
    requestGuidance: [
      {
        ar: "اذكر اسم المشروع.",
        de: "Name angeben.",
        en: "Provide name.",
      },
    ],
    fields: [
      {
        id: "customerName",
        type: "text",
        label: { ar: "اسم العميل", de: "Kundenname", en: "Customer Name" },
        required: true,
        semanticGroup: "contact",
      },
      {
        id: "phone",
        type: "text",
        label: { ar: "رقم الهاتف", de: "Telefonnummer", en: "Phone Number" },
        required: true,
        semanticGroup: "contact",
      },
      emailField,
      {
        id: "projectName",
        type: "text",
        label: { ar: "اسم المشروع", de: "Projektname", en: "Project Name" },
        required: true,
        semanticGroup: "project",
      },
      {
        id: "style",
        type: "text",
        label: { ar: "الأسلوب المطلوب", de: "Stil", en: "Style" },
        semanticGroup: "design",
      },
      referenceFileField,
      {
        id: "notes",
        type: "textarea",
        label: { ar: "تفاصيل إضافية", de: "Details", en: "Details" },
        semanticGroup: "notes",
      },
    ],
  },
];