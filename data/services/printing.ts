import type { Service, ServiceField } from "@/types/service";

const emailField: ServiceField = {
  id: "email",
  type: "email",
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
  required: false,
};

export const printingServices: Service[] = [
  {
    id: "commercial-printing",
    category: "printing",
    title: {
      ar: "الطباعة التجارية والمطبوعات",
      de: "Geschäftsdruck & Printprodukte",
      en: "Commercial Printing & Print Products",
    },
    description: {
      ar: "بطاقات، فلايرات، بروشورات، منيوهات، بوسترات، ومواد مطبوعة للشركات.",
      de: "Visitenkarten, Flyer, Broschüren, Menüs, Poster und gedruckte Materialien für Unternehmen.",
      en: "Business cards, flyers, brochures, menus, posters, and printed business materials.",
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
        id: "printProductType",
        type: "select",
        label: { ar: "نوع المنتج المطبوع", de: "Art des Druckprodukts", en: "Type of Printed Product" },
        options: [
          { value: "business-card", label: { ar: "بطاقة أعمال", de: "Visitenkarte", en: "Business Card" } },
          { value: "flyer", label: { ar: "فلاير", de: "Flyer", en: "Flyer" } },
          { value: "brochure", label: { ar: "بروشور", de: "Broschüre", en: "Brochure" } },
          { value: "menu", label: { ar: "منيو", de: "Menü", en: "Menu" } },
          { value: "poster", label: { ar: "بوستر", de: "Poster", en: "Poster" } },
          { value: "letterhead", label: { ar: "ورق رسمي", de: "Briefpapier", en: "Letterhead" } },
          { value: "folder", label: { ar: "ملف شركة", de: "Mappe", en: "Folder" } },
          { value: "sticker-sheet", label: { ar: "ورقة ملصقات", de: "Stickerbogen", en: "Sticker Sheet" } },
        ],
      },
      {
        id: "quantity",
        type: "number",
        label: { ar: "الكمية", de: "Menge", en: "Quantity" },
        placeholder: { ar: "مثال: 500", de: "Beispiel: 500", en: "Example: 500" },
      },
      {
        id: "size",
        type: "text",
        label: { ar: "المقاس", de: "Format", en: "Size" },
        placeholder: { ar: "مثال: A4 أو 9x5 سم", de: "Beispiel: A4 oder 9x5 cm", en: "Example: A4 or 9x5 cm" },
      },
      {
        id: "orientation",
        type: "radio",
        label: { ar: "الاتجاه", de: "Ausrichtung", en: "Orientation" },
        options: [
          { value: "portrait", label: { ar: "عمودي", de: "Hochformat", en: "Portrait" } },
          { value: "landscape", label: { ar: "أفقي", de: "Querformat", en: "Landscape" } },
        ],
      },
      {
        id: "paperType",
        type: "select",
        label: { ar: "نوع الورق", de: "Papiersorte", en: "Paper Type" },
        options: [
          { value: "matte", label: { ar: "مطفي", de: "Matt", en: "Matte" } },
          { value: "glossy", label: { ar: "لامع", de: "Glänzend", en: "Glossy" } },
          { value: "premium", label: { ar: "فاخر", de: "Premium", en: "Premium" } },
          { value: "kraft", label: { ar: "كرافت", de: "Kraftpapier", en: "Kraft" } },
          { value: "not-sure", label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" } },
        ],
      },
      {
        id: "paperWeight",
        type: "text",
        label: { ar: "وزن الورق", de: "Papiergewicht", en: "Paper Weight" },
        placeholder: { ar: "مثال: 170g أو 350g", de: "Beispiel: 170g oder 350g", en: "Example: 170g or 350g" },
      },
      {
        id: "printColors",
        type: "radio",
        label: { ar: "ألوان الطباعة", de: "Druckfarben", en: "Print Colors" },
        options: [
          { value: "bw", label: { ar: "أبيض وأسود", de: "Schwarzweiß", en: "Black & White" } },
          { value: "full-color", label: { ar: "ألوان كاملة", de: "Vollfarbe", en: "Full Color" } },
        ],
      },
      {
        id: "printSides",
        type: "radio",
        label: { ar: "الطباعة", de: "Druckseiten", en: "Print Sides" },
        options: [
          { value: "single", label: { ar: "وجه واحد", de: "Einseitig", en: "Single-sided" } },
          { value: "double", label: { ar: "وجهين", de: "Doppelseitig", en: "Double-sided" } },
        ],
      },
      {
        id: "finishing",
        type: "checkbox",
        label: { ar: "التشطيب المطلوب", de: "Gewünschte Veredelung", en: "Required Finishing" },
        options: [
          { value: "lamination-matte", label: { ar: "تغليف مطفي", de: "Matt laminiert", en: "Matte Lamination" } },
          { value: "lamination-glossy", label: { ar: "تغليف لامع", de: "Glänzend laminiert", en: "Glossy Lamination" } },
          { value: "folding", label: { ar: "طي", de: "Falzung", en: "Folding" } },
          { value: "creasing", label: { ar: "تكسير", de: "Rillen", en: "Creasing" } },
          { value: "round-corners", label: { ar: "زوايا دائرية", de: "Runde Ecken", en: "Rounded Corners" } },
          { value: "none", label: { ar: "لا شيء", de: "Keine", en: "None" } },
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
        id: "deliveryType",
        type: "radio",
        label: { ar: "طريقة التسليم", de: "Lieferart", en: "Delivery Type" },
        options: [
          { value: "pickup", label: { ar: "استلام", de: "Abholung", en: "Pickup" } },
          { value: "shipping", label: { ar: "شحن", de: "Versand", en: "Shipping" } },
        ],
      },
      {
        id: "deadline",
        type: "text",
        label: { ar: "موعد التسليم المطلوب", de: "Gewünschter Liefertermin", en: "Requested Delivery Date" },
        placeholder: { ar: "مثال: خلال 5 أيام", de: "Beispiel: in 5 Tagen", en: "Example: within 5 days" },
      },
      {
        id: "notes",
        type: "textarea",
        label: { ar: "تفاصيل إضافية", de: "Zusätzliche Details", en: "Additional Details" },
        placeholder: {
          ar: "اكتب معلومات عن الألوان، الطي، التشطيب، الاستعمال، أو أي ملاحظات أخرى",
          de: "Beschreibe Farben, Falzung, Veredelung, Verwendung oder weitere Hinweise",
          en: "Write details about colors, folding, finishing, usage, or any other notes",
        },
      },
    ],
  },
  {
    id: "business-printing",
    category: "printing",
    title: {
      ar: "المطبوعات التجارية",
      de: "Geschäftsdrucksachen",
      en: "Business Printing",
    },
    description: {
      ar: "طلبات البطاقات والبروشورات والمنيوهات والبوسترات وغيرها من المطبوعات التجارية.",
      de: "Anfragen für Visitenkarten, Broschüren, Speisekarten, Poster und weitere Geschäftsdrucksachen.",
      en: "Requests for business cards, brochures, menus, posters, and other business printing products.",
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
          ar: "بطاقة، بروشور، منيو، بوستر...",
          de: "Visitenkarte, Broschüre, Menü, Poster...",
          en: "Business card, brochure, menu, poster...",
        },
      },
      {
        id: "size",
        type: "text",
        label: { ar: "المقاس", de: "Format / Größe", en: "Size" },
        placeholder: { ar: "مثال: A4 أو 9x5 cm", de: "z. B. A4 oder 9x5 cm", en: "e.g. A4 or 9x5 cm" },
      },
      {
        id: "paperType",
        type: "text",
        label: { ar: "نوع الورق", de: "Papierart", en: "Paper Type" },
        placeholder: { ar: "مثال: Matt, Glossy, Offset", de: "z. B. Matt, Glänzend, Offset", en: "e.g. Matt, Glossy, Offset" },
      },
      {
        id: "thickness",
        type: "text",
        label: { ar: "السماكة / الغراماج", de: "Stärke / Grammatur", en: "Thickness / GSM" },
        placeholder: { ar: "مثال: 300gsm", de: "z. B. 300 g/m²", en: "e.g. 300gsm" },
      },
      {
        id: "printColors",
        type: "text",
        label: { ar: "ألوان الطباعة", de: "Druckfarben", en: "Print Colors" },
        placeholder: { ar: "ألوان كاملة أو أسود فقط", de: "Vollfarbe oder nur Schwarz", en: "Full color or black only" },
      },
      {
        id: "printingSides",
        type: "radio",
        label: { ar: "وجه واحد أو وجهين", de: "Ein- oder beidseitig", en: "Single or Double Sided" },
        options: [
          { value: "single", label: { ar: "وجه واحد", de: "Einseitig", en: "Single-sided" } },
          { value: "double", label: { ar: "وجهان", de: "Beidseitig", en: "Double-sided" } },
        ],
      },
      {
        id: "finishing",
        type: "text",
        label: { ar: "التشطيب", de: "Veredelung", en: "Finishing" },
        placeholder: { ar: "Lamination, Folding, Cutting...", de: "Laminierung, Faltung, Zuschnitt...", en: "Lamination, folding, cutting..." },
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
        placeholder: { ar: "مثال: 1000", de: "z. B. 1000", en: "e.g. 1000" },
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
          ar: "اكتب أي تفاصيل إضافية مهمة",
          de: "Weitere wichtige Details eingeben",
          en: "Write any important extra details",
        },
      },
    ],
  },
  {
    id: "stamps",
    category: "printing",
    title: {
      ar: "الأختام",
      de: "Stempel",
      en: "Stamps",
    },
    description: {
      ar: "أختام للشركات والمكاتب والأنشطة التجارية بأحجام وأشكال مختلفة.",
      de: "Stempel für Firmen, Büros und Gewerbe in verschiedenen Größen und Formen.",
      en: "Stamps for companies, offices, and businesses in different sizes and formats.",
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
        id: "stampType",
        type: "select",
        label: { ar: "نوع الختم", de: "Stempelart", en: "Stamp Type" },
        options: [
          { value: "self-inking", label: { ar: "ختم أوتوماتيكي", de: "Selbstfärber", en: "Self-Inking" } },
          { value: "wooden", label: { ar: "ختم خشبي", de: "Holzstempel", en: "Wooden Stamp" } },
          { value: "pocket", label: { ar: "ختم جيب", de: "Taschenstempel", en: "Pocket Stamp" } },
          { value: "date", label: { ar: "ختم تاريخ", de: "Datumsstempel", en: "Date Stamp" } },
        ],
      },
      {
        id: "stampShape",
        type: "select",
        label: { ar: "شكل الختم", de: "Form des Stempels", en: "Stamp Shape" },
        options: [
          { value: "rect", label: { ar: "مستطيل", de: "Rechteckig", en: "Rectangle" } },
          { value: "square", label: { ar: "مربع", de: "Quadratisch", en: "Square" } },
          { value: "round", label: { ar: "دائري", de: "Rund", en: "Round" } },
          { value: "custom", label: { ar: "شكل خاص", de: "Sonderform", en: "Custom Shape" } },
        ],
      },
      {
        id: "stampSize",
        type: "text",
        label: { ar: "مقاس الختم", de: "Stempelgröße", en: "Stamp Size" },
        placeholder: { ar: "مثال: 38×14 مم", de: "Beispiel: 38×14 mm", en: "Example: 38×14 mm" },
      },
      {
        id: "inkColor",
        type: "select",
        label: { ar: "لون الحبر", de: "Farbe der Tinte", en: "Ink Color" },
        options: [
          { value: "black", label: { ar: "أسود", de: "Schwarz", en: "Black" } },
          { value: "blue", label: { ar: "أزرق", de: "Blau", en: "Blue" } },
          { value: "red", label: { ar: "أحمر", de: "Rot", en: "Red" } },
          { value: "green", label: { ar: "أخضر", de: "Grün", en: "Green" } },
        ],
      },
      {
        id: "textContent",
        type: "textarea",
        label: { ar: "نص الختم", de: "Stempeltext", en: "Stamp Text" },
        placeholder: { ar: "اكتب النص المطلوب على الختم", de: "Gib den gewünschten Stempeltext ein", en: "Write the text required on the stamp" },
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
        placeholder: { ar: "أي تفاصيل أخرى بخصوص الختم", de: "Weitere Informationen zum Stempel", en: "Any additional details about the stamp" },
      },
    ],
  },
];