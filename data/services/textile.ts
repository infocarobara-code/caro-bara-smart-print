import { Service } from "@/types/service";

const emailField = {
  id: "email",
  type: "email" as const,
  label: {
    ar: "البريد الإلكتروني",
    de: "E-Mail-Adresse",
    en: "Email Address",
  },
  placeholder: {
    ar: "example@email.com",
    de: "beispiel@email.com",
    en: "example@email.com",
  },
};

export const textileServices: Service[] = [
  {
    id: "textile-printing",
    category: "textile",
    title: {
      ar: "طباعة الملابس والهدايا",
      de: "Textildruck & Werbegeschenke",
      en: "Textile Printing & Gifts",
    },
    description: {
      ar: "تيشيرتات، هوديز، قبعات، أكواب، وهدايا دعائية أو مخصصة.",
      de: "T-Shirts, Hoodies, Caps, Tassen und personalisierte Werbegeschenke.",
      en: "T-shirts, hoodies, caps, mugs, and customized promotional gifts.",
    },
    fields: [
      {
        id: "customerName",
        type: "text",
        label: { ar: "اسم العميل", de: "Kundenname", en: "Customer Name" },
        placeholder: { ar: "اكتب اسمك", de: "Gib deinen Namen ein", en: "Enter your name" },
      },
      {
        id: "phone",
        type: "text",
        label: { ar: "رقم الهاتف", de: "Telefonnummer", en: "Phone Number" },
        placeholder: { ar: "اكتب رقم الهاتف", de: "Telefonnummer eingeben", en: "Enter phone number" },
      },
      emailField,
      {
        id: "productType",
        type: "select",
        label: { ar: "نوع القطعة", de: "Produktart", en: "Product Type" },
        options: [
          { value: "tshirt", label: { ar: "تيشيرت", de: "T-Shirt", en: "T-Shirt" } },
          { value: "hoodie", label: { ar: "هودي", de: "Hoodie", en: "Hoodie" } },
          { value: "cap", label: { ar: "قبعة", de: "Cap", en: "Cap" } },
          { value: "workwear", label: { ar: "زي عمل", de: "Arbeitskleidung", en: "Workwear" } },
          { value: "bag", label: { ar: "حقيبة قماش", de: "Stofftasche", en: "Fabric Bag" } },
          { value: "mug", label: { ar: "كوب", de: "Tasse", en: "Mug" } },
          { value: "gift-item", label: { ar: "هدية دعائية", de: "Werbegeschenk", en: "Promotional Gift" } },
        ],
      },
      {
        id: "quantity",
        type: "number",
        label: { ar: "الكمية", de: "Menge", en: "Quantity" },
        placeholder: { ar: "مثال: 50", de: "Beispiel: 50", en: "Example: 50" },
      },
      {
        id: "sizes",
        type: "text",
        label: { ar: "المقاسات", de: "Größen", en: "Sizes" },
        placeholder: { ar: "مثال: S, M, L, XL", de: "Beispiel: S, M, L, XL", en: "Example: S, M, L, XL" },
      },
      {
        id: "genderTarget",
        type: "select",
        label: { ar: "الفئة", de: "Zielgruppe", en: "Target Group" },
        options: [
          { value: "men", label: { ar: "رجالي", de: "Herren", en: "Men" } },
          { value: "women", label: { ar: "نسائي", de: "Damen", en: "Women" } },
          { value: "kids", label: { ar: "أطفال", de: "Kinder", en: "Kids" } },
          { value: "unisex", label: { ar: "مشترك", de: "Unisex", en: "Unisex" } },
        ],
      },
      {
        id: "color",
        type: "text",
        label: { ar: "لون القطعة", de: "Farbe des Produkts", en: "Product Color" },
        placeholder: { ar: "مثال: أسود، أبيض، أحمر", de: "Beispiel: Schwarz, Weiß, Rot", en: "Example: Black, White, Red" },
      },
      {
        id: "fabricType",
        type: "text",
        label: { ar: "نوع القماش أو الخامة", de: "Stoffart oder Material", en: "Fabric or Material Type" },
        placeholder: {
          ar: "مثال: قطن 100% أو بوليستر",
          de: "Beispiel: 100% Baumwolle oder Polyester",
          en: "Example: 100% cotton or polyester",
        },
      },
      {
        id: "printSides",
        type: "radio",
        label: { ar: "جهات الطباعة", de: "Druckseiten", en: "Print Sides" },
        options: [
          { value: "front", label: { ar: "أمام فقط", de: "Nur vorne", en: "Front Only" } },
          { value: "back", label: { ar: "خلف فقط", de: "Nur hinten", en: "Back Only" } },
          { value: "both", label: { ar: "أمام وخلف", de: "Vorne und hinten", en: "Front and Back" } },
        ],
      },
      {
        id: "printPositions",
        type: "checkbox",
        label: { ar: "أماكن الطباعة", de: "Druckpositionen", en: "Print Positions" },
        options: [
          { value: "chest", label: { ar: "صدر", de: "Brust", en: "Chest" } },
          { value: "back", label: { ar: "ظهر", de: "Rücken", en: "Back" } },
          { value: "sleeve", label: { ar: "كم", de: "Ärmel", en: "Sleeve" } },
          { value: "neck", label: { ar: "رقبة", de: "Nacken", en: "Neck" } },
        ],
      },
      {
        id: "printMethod",
        type: "select",
        label: { ar: "نوع الطباعة", de: "Druckart", en: "Print Method" },
        options: [
          { value: "dtf", label: { ar: "DTF", de: "DTF", en: "DTF" } },
          { value: "screen", label: { ar: "سيلك سكرين", de: "Siebdruck", en: "Screen Printing" } },
          { value: "vinyl", label: { ar: "فينيل حراري", de: "Flex/Flock", en: "Heat Vinyl" } },
          { value: "sublimation", label: { ar: "سبلميشن", de: "Sublimation", en: "Sublimation" } },
          { value: "not-sure", label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" } },
        ],
      },
      {
        id: "colorCount",
        type: "text",
        label: { ar: "عدد ألوان الطباعة", de: "Anzahl der Druckfarben", en: "Number of Print Colors" },
        placeholder: {
          ar: "مثال: لون واحد أو 4 ألوان",
          de: "Beispiel: 1 Farbe oder 4 Farben",
          en: "Example: 1 color or 4 colors",
        },
      },
      {
        id: "packagingNeeded",
        type: "radio",
        label: { ar: "هل تحتاج تغليفًا؟", de: "Verpackung benötigt?", en: "Need Packaging?" },
        options: [
          { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
          { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
        ],
      },
      {
        id: "deliveryType",
        type: "radio",
        label: { ar: "طريقة التسليم", de: "Lieferart", en: "Delivery Type" },
        options: [
          { value: "pickup", label: { ar: "استلام", de: "Abholung", en: "Pickup" } },
          { value: "shipping", label: { ar: "شحن", de: "Versand", en: "Shipping" } },
        ],
      },
      {
        id: "designReady",
        type: "radio",
        label: { ar: "هل لديك تصميم جاهز؟", de: "Design vorhanden?", en: "Ready Design?" },
        options: [
          { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
          { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
        ],
      },
      {
        id: "notes",
        type: "textarea",
        label: { ar: "تفاصيل إضافية", de: "Zusätzliche Details", en: "Additional Details" },
        placeholder: {
          ar: "اكتب نوع الطباعة المفضل، أماكن الطباعة، الألوان، التغليف، أو أي متطلبات إضافية",
          de: "Beschreibe bevorzugte Druckart, Positionen, Farben, Verpackung oder weitere Anforderungen",
          en: "Describe preferred print type, positions, colors, packaging, or any additional requirements",
        },
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
      ar: "طلبات الطباعة والتخصيص على الهدايا والمواد الدعائية مثل الأكواب والأقلام والميداليات وغيرها.",
      de: "Anfragen für Druck und Personalisierung auf Werbeartikeln wie Tassen, Kugelschreibern, Schlüsselanhängern und mehr.",
      en: "Requests for printing and personalization on promotional items such as mugs, pens, keychains, and more.",
    },
    fields: [
      {
        id: "customerName",
        type: "text",
        label: { ar: "اسم العميل", de: "Kundenname", en: "Customer Name" },
        placeholder: { ar: "اكتب اسم العميل", de: "Kundennamen eingeben", en: "Enter customer name" },
      },
      {
        id: "phone",
        type: "text",
        label: { ar: "رقم الهاتف", de: "Telefonnummer", en: "Phone Number" },
        placeholder: { ar: "اكتب رقم الهاتف", de: "Telefonnummer eingeben", en: "Enter phone number" },
      },
      emailField,
      {
        id: "productType",
        type: "text",
        label: { ar: "نوع المنتج", de: "Produktart", en: "Product Type" },
        placeholder: {
          ar: "كوب، قلم، ميدالية، دفتر، هدية...",
          de: "Tasse, Kugelschreiber, Schlüsselanhänger, Notizbuch, Giveaway...",
          en: "mug, pen, keychain, notebook, giveaway...",
        },
      },
      {
        id: "size",
        type: "text",
        label: { ar: "المقاس / الحجم", de: "Größe", en: "Size" },
        placeholder: {
          ar: "اكتب المقاس أو السعة أو الأبعاد",
          de: "Größe, Volumen oder Maße eingeben",
          en: "Enter size, capacity, or dimensions",
        },
      },
      {
        id: "material",
        type: "text",
        label: { ar: "المادة", de: "Material", en: "Material" },
        placeholder: {
          ar: "بلاستيك، معدن، سيراميك، خشب...",
          de: "Kunststoff, Metall, Keramik, Holz...",
          en: "plastic, metal, ceramic, wood...",
        },
      },
      {
        id: "printType",
        type: "text",
        label: { ar: "نوع الطباعة", de: "Druckart", en: "Print Type" },
        placeholder: {
          ar: "UV، ليزر، سلك سكرين، DTF...",
          de: "UV, Laser, Siebdruck, DTF...",
          en: "UV, laser, screen print, DTF...",
        },
      },
      {
        id: "finishing",
        type: "text",
        label: { ar: "التشطيب", de: "Veredelung", en: "Finishing" },
        placeholder: {
          ar: "تغليف، حفر، قص، صندوق...",
          de: "Verpackung, Gravur, Zuschnitt, Box...",
          en: "packaging, engraving, cutting, box...",
        },
      },
      {
        id: "designReady",
        type: "radio",
        label: { ar: "هل التصميم جاهز؟", de: "Design vorhanden?", en: "Design Ready?" },
        options: [
          { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
          { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
        ],
      },
      {
        id: "quantity",
        type: "number",
        label: { ar: "الكمية", de: "Menge", en: "Quantity" },
        placeholder: { ar: "مثال: 100", de: "z. B. 100", en: "e.g. 100" },
      },
      {
        id: "deliveryDate",
        type: "text",
        label: { ar: "موعد التسليم", de: "Liefertermin", en: "Delivery Date" },
        placeholder: { ar: "اكتب الموعد المطلوب", de: "Wunschtermin eingeben", en: "Enter requested deadline" },
      },
      {
        id: "notes",
        type: "textarea",
        label: { ar: "ملاحظات", de: "Zusätzliche Details", en: "Additional Details" },
        placeholder: {
          ar: "اذكر لون المنتج، الطباعة على أي جهة، وهل التغليف مطلوب",
          de: "Produktfarbe, Druckposition und Verpackungswunsch angeben",
          en: "Mention product color, print position, and whether packaging is needed",
        },
      },
    ],
  },
];