import type { Service, ServiceField, ServiceSection } from "@/types/service";

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
  semanticGroup: "contact",
  aiHint: "Optional email for quotation delivery and follow-up.",
};

const customerNameField: ServiceField = {
  id: "customerName",
  type: "text",
  label: {
    ar: "اسم العميل",
    de: "Kundenname",
    en: "Customer Name",
  },
  placeholder: {
    ar: "اكتب اسمك",
    de: "Gib deinen Namen ein",
    en: "Enter your name",
  },
  required: false,
  semanticGroup: "contact",
  aiHint: "Customer name for identification.",
};

const phoneField: ServiceField = {
  id: "phone",
  type: "text",
  label: {
    ar: "رقم الهاتف",
    de: "Telefonnummer",
    en: "Phone Number",
  },
  placeholder: {
    ar: "اكتب رقم الهاتف",
    de: "Telefonnummer eingeben",
    en: "Enter phone number",
  },
  required: false,
  semanticGroup: "contact",
  aiHint: "Phone number for direct contact.",
};

const createContactSection = (): ServiceSection => ({
  id: "contact",
  title: {
    ar: "معلومات التواصل",
    de: "Kontaktdaten",
    en: "Contact Details",
  },
  description: {
    ar: "يمكنك ترك معلومات التواصل إذا رغبت أن نعود إليك بسرعة بعرض أو استفسار.",
    de: "Du kannst Kontaktdaten angeben, damit wir dich bei Rückfragen oder Angeboten schneller erreichen.",
    en: "You can leave contact details so we can reach you quickly for questions or quotations.",
  },
  fields: [customerNameField, phoneField, emailField],
});

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
    intro: {
      ar: "هذا النموذج مخصص للمطبوعات التجارية مثل البطاقات والفلايرات والبروشورات والمنيوهات والبوسترات. كلما كانت التفاصيل أوضح، كانت التسعيرة أدق.",
      de: "Dieses Formular ist für Geschäftsdrucksachen wie Visitenkarten, Flyer, Broschüren, Menüs und Poster gedacht. Je klarer die Angaben, desto präziser das Angebot.",
      en: "This form is for commercial print products such as business cards, flyers, brochures, menus, and posters. The clearer the details, the more accurate the quote.",
    },
    requestGuidance: [
      {
        ar: "إذا كنت تعرف المقاس أو الغراماج أو نوع الورق فاذكره، وإذا لم تكن متأكدًا يمكنك تركه فارغًا.",
        de: "Wenn du Format, Grammatur oder Papierart kennst, gib sie an. Wenn nicht, kannst du die Felder offen lassen.",
        en: "If you know the size, paper weight, or paper type, mention it. If not, you can leave the fields open.",
      },
      {
        ar: "إذا كان لديك تصميم جاهز فسيُسرّع ذلك إعداد الطلب والتسعير.",
        de: "Ein fertiges Design beschleunigt die Bearbeitung und Kalkulation.",
        en: "Having a ready design helps speed up the request and quotation.",
      },
    ],
    seo: {
      slug: "commercial-printing",
      categorySlug: "printing",
      metaTitle: {
        ar: "طلب طباعة تجارية ومطبوعات",
        de: "Anfrage für Geschäftsdruck und Printprodukte",
        en: "Request Commercial Printing",
      },
      metaDescription: {
        ar: "نموذج طلب احترافي للمطبوعات التجارية مثل البطاقات والفلايرات والبروشورات والمنيوهات.",
        de: "Professionelles Anfrageformular für Geschäftsdrucksachen wie Visitenkarten, Flyer, Broschüren und Menüs.",
        en: "Professional request form for commercial printing such as business cards, flyers, brochures, and menus.",
      },
    },
    aiSummaryHint:
      "Summarize the commercial printing request with product type, quantity, size, paper, colors, sides, finishing, delivery, and design readiness.",
    sections: [
      createContactSection(),
      {
        id: "product-basics",
        title: {
          ar: "نوع المنتج والكميات",
          de: "Produktart und Mengen",
          en: "Product Type and Quantities",
        },
        description: {
          ar: "اختر نوع المنتج واذكر الكمية الأساسية المطلوبة.",
          de: "Wähle die Produktart und gib die gewünschte Menge an.",
          en: "Choose the product type and enter the requested quantity.",
        },
        fields: [
          {
            id: "printProductType",
            type: "select",
            label: {
              ar: "نوع المنتج المطبوع",
              de: "Art des Druckprodukts",
              en: "Type of Printed Product",
            },
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
            semanticGroup: "project",
            allowsUnknown: true,
            aiHint: "Main print product category.",
          },
          {
            id: "quantity",
            type: "number",
            label: {
              ar: "الكمية",
              de: "Menge",
              en: "Quantity",
            },
            placeholder: {
              ar: "مثال: 500",
              de: "Beispiel: 500",
              en: "Example: 500",
            },
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Requested print quantity.",
          },
          {
            id: "deadline",
            type: "text",
            label: {
              ar: "موعد التسليم المطلوب",
              de: "Gewünschter Liefertermin",
              en: "Requested Delivery Date",
            },
            placeholder: {
              ar: "مثال: خلال 5 أيام",
              de: "Beispiel: in 5 Tagen",
              en: "Example: within 5 days",
            },
            semanticGroup: "delivery",
            allowsUnknown: true,
            aiHint: "Requested deadline or urgency.",
          },
        ],
      },
      {
        id: "format-paper",
        title: {
          ar: "المقاس والورق",
          de: "Format und Papier",
          en: "Format and Paper",
        },
        description: {
          ar: "أدخل المقاس ونوع الورق والغراماج إن كانت معروفة.",
          de: "Gib Format, Papierart und Grammatur an, falls bekannt.",
          en: "Enter the size, paper type, and paper weight if known.",
        },
        fields: [
          {
            id: "size",
            type: "text",
            label: {
              ar: "المقاس",
              de: "Format",
              en: "Size",
            },
            placeholder: {
              ar: "مثال: A4 أو 9x5 سم",
              de: "Beispiel: A4 oder 9x5 cm",
              en: "Example: A4 or 9x5 cm",
            },
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Finished size or format.",
          },
          {
            id: "orientation",
            type: "radio",
            label: {
              ar: "الاتجاه",
              de: "Ausrichtung",
              en: "Orientation",
            },
            options: [
              { value: "portrait", label: { ar: "عمودي", de: "Hochformat", en: "Portrait" } },
              { value: "landscape", label: { ar: "أفقي", de: "Querformat", en: "Landscape" } },
            ],
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Page orientation.",
          },
          {
            id: "paperType",
            type: "select",
            label: {
              ar: "نوع الورق",
              de: "Papiersorte",
              en: "Paper Type",
            },
            options: [
              { value: "matte", label: { ar: "مطفي", de: "Matt", en: "Matte" } },
              { value: "glossy", label: { ar: "لامع", de: "Glänzend", en: "Glossy" } },
              { value: "premium", label: { ar: "فاخر", de: "Premium", en: "Premium" } },
              { value: "kraft", label: { ar: "كرافت", de: "Kraftpapier", en: "Kraft" } },
              { value: "not-sure", label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" } },
            ],
            semanticGroup: "materials",
            allowsUnknown: true,
            aiHint: "Paper stock preference.",
          },
          {
            id: "paperWeight",
            type: "text",
            label: {
              ar: "وزن الورق",
              de: "Papiergewicht",
              en: "Paper Weight",
            },
            placeholder: {
              ar: "مثال: 170g أو 350g",
              de: "Beispiel: 170g oder 350g",
              en: "Example: 170g or 350g",
            },
            semanticGroup: "materials",
            allowsUnknown: true,
            aiHint: "Paper weight or GSM.",
          },
        ],
      },
      {
        id: "printing-finishing",
        title: {
          ar: "الطباعة والتشطيب",
          de: "Druck und Veredelung",
          en: "Printing and Finishing",
        },
        description: {
          ar: "حدد ألوان الطباعة، عدد الأوجه، والتشطيب المطلوب.",
          de: "Lege Druckfarben, Seitenzahl und gewünschte Veredelung fest.",
          en: "Define print colors, number of sides, and required finishing.",
        },
        fields: [
          {
            id: "printColors",
            type: "radio",
            label: {
              ar: "ألوان الطباعة",
              de: "Druckfarben",
              en: "Print Colors",
            },
            options: [
              { value: "bw", label: { ar: "أبيض وأسود", de: "Schwarzweiß", en: "Black & White" } },
              { value: "full-color", label: { ar: "ألوان كاملة", de: "Vollfarbe", en: "Full Color" } },
            ],
            semanticGroup: "production",
            allowsUnknown: true,
            aiHint: "Color mode of print job.",
          },
          {
            id: "printSides",
            type: "radio",
            label: {
              ar: "الطباعة",
              de: "Druckseiten",
              en: "Print Sides",
            },
            options: [
              { value: "single", label: { ar: "وجه واحد", de: "Einseitig", en: "Single-sided" } },
              { value: "double", label: { ar: "وجهين", de: "Doppelseitig", en: "Double-sided" } },
            ],
            semanticGroup: "production",
            allowsUnknown: true,
            aiHint: "Single or double sided printing.",
          },
          {
            id: "finishing",
            type: "checkbox",
            label: {
              ar: "التشطيب المطلوب",
              de: "Gewünschte Veredelung",
              en: "Required Finishing",
            },
            options: [
              { value: "lamination-matte", label: { ar: "تغليف مطفي", de: "Matt laminiert", en: "Matte Lamination" } },
              { value: "lamination-glossy", label: { ar: "تغليف لامع", de: "Glänzend laminiert", en: "Glossy Lamination" } },
              { value: "folding", label: { ar: "طي", de: "Falzung", en: "Folding" } },
              { value: "creasing", label: { ar: "تكسير", de: "Rillen", en: "Creasing" } },
              { value: "round-corners", label: { ar: "زوايا دائرية", de: "Runde Ecken", en: "Rounded Corners" } },
              { value: "none", label: { ar: "لا شيء", de: "Keine", en: "None" } },
            ],
            semanticGroup: "production",
            allowsUnknown: true,
            aiHint: "Post-print finishing requirements.",
          },
          {
            id: "designReady",
            type: "radio",
            label: {
              ar: "هل لديك تصميم جاهز؟",
              de: "Design vorhanden?",
              en: "Ready Design?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
            ],
            semanticGroup: "design",
            allowsUnknown: true,
            aiHint: "Whether artwork is already available.",
          },
          {
            id: "deliveryType",
            type: "radio",
            label: {
              ar: "طريقة التسليم",
              de: "Lieferart",
              en: "Delivery Type",
            },
            options: [
              { value: "pickup", label: { ar: "استلام", de: "Abholung", en: "Pickup" } },
              { value: "shipping", label: { ar: "شحن", de: "Versand", en: "Shipping" } },
            ],
            semanticGroup: "delivery",
            allowsUnknown: true,
            aiHint: "Delivery or pickup preference.",
          },
        ],
      },
      {
        id: "notes",
        title: {
          ar: "تفاصيل إضافية",
          de: "Zusätzliche Hinweise",
          en: "Additional Notes",
        },
        fields: [
          {
            id: "notes",
            type: "textarea",
            label: {
              ar: "تفاصيل إضافية",
              de: "Zusätzliche Details",
              en: "Additional Details",
            },
            placeholder: {
              ar: "اكتب معلومات عن الألوان، الطي، التشطيب، الاستعمال، أو أي ملاحظات أخرى",
              de: "Beschreibe Farben, Falzung, Veredelung, Verwendung oder weitere Hinweise",
              en: "Write details about colors, folding, finishing, usage, or any other notes",
            },
            semanticGroup: "notes",
            aiHint: "Freeform notes with important print instructions.",
          },
        ],
      },
    ],
    attachments: [
      {
        id: "design-files",
        kind: "design-files",
        title: {
          ar: "ملفات التصميم",
          de: "Designdateien",
          en: "Design Files",
        },
        description: {
          ar: "يمكن رفع ملفات التصميم لاحقًا مثل PDF أو AI أو EPS.",
          de: "Designdateien wie PDF, AI oder EPS können später hochgeladen werden.",
          en: "Design files such as PDF, AI, or EPS can be uploaded later.",
        },
        required: false,
        multiple: true,
      },
      {
        id: "reference-images",
        kind: "reference-images",
        title: {
          ar: "صور مرجعية",
          de: "Referenzbilder",
          en: "Reference Images",
        },
        required: false,
        multiple: true,
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
    intro: {
      ar: "هذا النموذج مناسب عندما تريد وصف منتج مطبوع بشكل حر حتى لو لم يكن ضمن قائمة ثابتة.",
      de: "Dieses Formular eignet sich, wenn du ein Druckprodukt frei beschreiben möchtest, auch wenn es nicht in einer festen Liste steht.",
      en: "This form is suitable when you want to describe a print product freely, even if it is not in a fixed list.",
    },
    requestGuidance: [
      {
        ar: "إذا لم تكن تعرف النوع الدقيق للورق أو التشطيب، فقط صف ما تتخيله.",
        de: "Wenn du Papier oder Veredelung nicht genau kennst, beschreibe einfach deine Vorstellung.",
        en: "If you are unsure about paper or finishing, simply describe what you have in mind.",
      },
    ],
    seo: {
      slug: "business-printing",
      categorySlug: "printing",
    },
    aiSummaryHint:
      "Summarize the business printing request with product type, size, material, colors, sides, quantity, design status, and delivery timing.",
    sections: [
      createContactSection(),
      {
        id: "product-basics",
        title: {
          ar: "تفاصيل المنتج",
          de: "Produktdetails",
          en: "Product Details",
        },
        description: {
          ar: "صف نوع المنتج والمقاس والكمية المطلوبة.",
          de: "Beschreibe Produktart, Format und gewünschte Menge.",
          en: "Describe the product type, size, and requested quantity.",
        },
        fields: [
          {
            id: "productType",
            type: "text",
            label: { ar: "نوع المنتج", de: "Produktart", en: "Product Type" },
            placeholder: {
              ar: "بطاقة، بروشور، منيو، بوستر...",
              de: "Visitenkarte, Broschüre, Menü, Poster...",
              en: "Business card, brochure, menu, poster...",
            },
            semanticGroup: "project",
            allowsUnknown: true,
            aiHint: "Freeform printed product type.",
          },
          {
            id: "size",
            type: "text",
            label: { ar: "المقاس", de: "Format / Größe", en: "Size" },
            placeholder: {
              ar: "مثال: A4 أو 9x5 cm",
              de: "z. B. A4 oder 9x5 cm",
              en: "e.g. A4 or 9x5 cm",
            },
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Requested print dimensions.",
          },
          {
            id: "quantity",
            type: "number",
            label: { ar: "الكمية", de: "Menge", en: "Quantity" },
            placeholder: {
              ar: "مثال: 1000",
              de: "z. B. 1000",
              en: "e.g. 1000",
            },
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Requested quantity.",
          },
          {
            id: "deliveryDate",
            type: "text",
            label: { ar: "موعد التسليم", de: "Liefertermin", en: "Delivery Date" },
            placeholder: {
              ar: "اكتب الموعد المطلوب",
              de: "Wunschtermin eingeben",
              en: "Enter requested deadline",
            },
            semanticGroup: "delivery",
            allowsUnknown: true,
            aiHint: "Requested timing.",
          },
        ],
      },
      {
        id: "materials-printing",
        title: {
          ar: "المواد والطباعة",
          de: "Material und Druck",
          en: "Material and Printing",
        },
        description: {
          ar: "اذكر نوع الورق أو السماكة أو ألوان الطباعة إن كانت معروفة.",
          de: "Gib Papierart, Stärke oder Druckfarben an, falls bekannt.",
          en: "Mention paper type, thickness, or print colors if known.",
        },
        fields: [
          {
            id: "paperType",
            type: "text",
            label: { ar: "نوع الورق", de: "Papierart", en: "Paper Type" },
            placeholder: {
              ar: "مثال: Matt, Glossy, Offset",
              de: "z. B. Matt, Glänzend, Offset",
              en: "e.g. Matt, Glossy, Offset",
            },
            semanticGroup: "materials",
            allowsUnknown: true,
            aiHint: "Freeform paper type.",
          },
          {
            id: "thickness",
            type: "text",
            label: {
              ar: "السماكة / الغراماج",
              de: "Stärke / Grammatur",
              en: "Thickness / GSM",
            },
            placeholder: {
              ar: "مثال: 300gsm",
              de: "z. B. 300 g/m²",
              en: "e.g. 300gsm",
            },
            semanticGroup: "materials",
            allowsUnknown: true,
            aiHint: "Paper thickness or GSM.",
          },
          {
            id: "printColors",
            type: "text",
            label: { ar: "ألوان الطباعة", de: "Druckfarben", en: "Print Colors" },
            placeholder: {
              ar: "ألوان كاملة أو أسود فقط",
              de: "Vollfarbe oder nur Schwarz",
              en: "Full color or black only",
            },
            semanticGroup: "production",
            allowsUnknown: true,
            aiHint: "Freeform print color description.",
          },
          {
            id: "printingSides",
            type: "radio",
            label: {
              ar: "وجه واحد أو وجهين",
              de: "Ein- oder beidseitig",
              en: "Single or Double Sided",
            },
            options: [
              { value: "single", label: { ar: "وجه واحد", de: "Einseitig", en: "Single-sided" } },
              { value: "double", label: { ar: "وجهان", de: "Beidseitig", en: "Double-sided" } },
            ],
            semanticGroup: "production",
            allowsUnknown: true,
            aiHint: "Single or double sided print.",
          },
          {
            id: "finishing",
            type: "text",
            label: { ar: "التشطيب", de: "Veredelung", en: "Finishing" },
            placeholder: {
              ar: "Lamination, Folding, Cutting...",
              de: "Laminierung, Faltung, Zuschnitt...",
              en: "Lamination, folding, cutting...",
            },
            semanticGroup: "production",
            allowsUnknown: true,
            aiHint: "Freeform finishing description.",
          },
          {
            id: "designReady",
            type: "radio",
            label: { ar: "هل التصميم جاهز؟", de: "Design vorhanden?", en: "Design Ready?" },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
            ],
            semanticGroup: "design",
            allowsUnknown: true,
            aiHint: "Whether artwork is ready.",
          },
        ],
      },
      {
        id: "notes",
        title: {
          ar: "ملاحظات إضافية",
          de: "Zusätzliche Hinweise",
          en: "Additional Notes",
        },
        fields: [
          {
            id: "notes",
            type: "textarea",
            label: { ar: "ملاحظات", de: "Zusätzliche Details", en: "Additional Details" },
            placeholder: {
              ar: "اكتب أي تفاصيل إضافية مهمة",
              de: "Weitere wichtige Details eingeben",
              en: "Write any important extra details",
            },
            semanticGroup: "notes",
            aiHint: "Important freeform notes for the print order.",
          },
        ],
      },
    ],
    attachments: [
      {
        id: "business-printing-files",
        kind: "design-files",
        title: {
          ar: "ملفات التصميم",
          de: "Designdateien",
          en: "Design Files",
        },
        required: false,
        multiple: true,
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
    intro: {
      ar: "هذا النموذج مخصص لطلبات الأختام بمختلف أنواعها، مع إمكانية تحديد الشكل والمقاس ولون الحبر والنص المطلوب.",
      de: "Dieses Formular ist für Stempelanfragen in verschiedenen Ausführungen gedacht, inklusive Form, Größe, Tintenfarbe und gewünschtem Text.",
      en: "This form is for stamp orders of different types, including shape, size, ink color, and the required text.",
    },
    requestGuidance: [
      {
        ar: "إذا كان لديك نص جاهز للختم فاكتبه كما تريد ظهوره بالضبط.",
        de: "Wenn du bereits einen Stempeltext hast, gib ihn bitte genau so ein, wie er erscheinen soll.",
        en: "If you already have the stamp text, write it exactly as you want it to appear.",
      },
      {
        ar: "إذا كنت غير متأكد من المقاس، يمكنك وصف الاستخدام وسنقترح المقاس المناسب.",
        de: "Wenn du dir bei der Größe nicht sicher bist, beschreibe den Einsatzzweck und wir schlagen ein passendes Format vor.",
        en: "If you are unsure about the size, describe the intended use and we will suggest a suitable format.",
      },
    ],
    seo: {
      slug: "stamps",
      categorySlug: "printing",
      metaTitle: {
        ar: "طلب أختام",
        de: "Anfrage für Stempel",
        en: "Request Stamps",
      },
      metaDescription: {
        ar: "نموذج طلب للأختام بمختلف الأنواع والأشكال والأحجام.",
        de: "Anfrageformular für Stempel in verschiedenen Typen, Formen und Größen.",
        en: "Request form for stamps in various types, shapes, and sizes.",
      },
    },
    aiSummaryHint:
      "Summarize the stamp request with stamp type, shape, size, ink color, text content, design readiness, and any special notes.",
    sections: [
      createContactSection(),
      {
        id: "stamp-basics",
        title: {
          ar: "نوع الختم وشكله",
          de: "Stempeltyp und Form",
          en: "Stamp Type and Shape",
        },
        description: {
          ar: "اختر نوع الختم والشكل المناسبين.",
          de: "Wähle den passenden Stempeltyp und die gewünschte Form.",
          en: "Choose the suitable stamp type and shape.",
        },
        fields: [
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
            semanticGroup: "project",
            allowsUnknown: true,
            aiHint: "Main stamp product type.",
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
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Stamp shape preference.",
          },
          {
            id: "stampSize",
            type: "text",
            label: { ar: "مقاس الختم", de: "Stempelgröße", en: "Stamp Size" },
            placeholder: {
              ar: "مثال: 38×14 مم",
              de: "Beispiel: 38×14 mm",
              en: "Example: 38×14 mm",
            },
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Requested or estimated stamp size.",
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
            semanticGroup: "materials",
            allowsUnknown: true,
            aiHint: "Stamp ink color.",
          },
        ],
      },
      {
        id: "content-design",
        title: {
          ar: "النص والتصميم",
          de: "Text und Design",
          en: "Text and Design",
        },
        description: {
          ar: "اكتب نص الختم وحدد إن كان لديك تصميم أو ملف جاهز.",
          de: "Gib den Stempeltext ein und teile mit, ob bereits ein Design vorhanden ist.",
          en: "Enter the stamp text and specify whether you already have a ready design.",
        },
        fields: [
          {
            id: "textContent",
            type: "textarea",
            label: { ar: "نص الختم", de: "Stempeltext", en: "Stamp Text" },
            placeholder: {
              ar: "اكتب النص المطلوب على الختم",
              de: "Gib den gewünschten Stempeltext ein",
              en: "Write the text required on the stamp",
            },
            semanticGroup: "design",
            aiHint: "Exact text content of the stamp.",
          },
          {
            id: "designReady",
            type: "radio",
            label: { ar: "هل لديك تصميم جاهز؟", de: "Design vorhanden?", en: "Ready Design?" },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
            ],
            semanticGroup: "design",
            allowsUnknown: true,
            aiHint: "Whether the user has a ready artwork/layout.",
          },
        ],
      },
      {
        id: "notes",
        title: {
          ar: "ملاحظات إضافية",
          de: "Zusätzliche Hinweise",
          en: "Additional Notes",
        },
        fields: [
          {
            id: "notes",
            type: "textarea",
            label: { ar: "تفاصيل إضافية", de: "Zusätzliche Details", en: "Additional Details" },
            placeholder: {
              ar: "أي تفاصيل أخرى بخصوص الختم",
              de: "Weitere Informationen zum Stempel",
              en: "Any additional details about the stamp",
            },
            semanticGroup: "notes",
            aiHint: "Extra notes about stamp usage or layout.",
          },
        ],
      },
    ],
    attachments: [
      {
        id: "stamp-reference",
        kind: "reference-images",
        title: {
          ar: "صور أو نماذج مرجعية",
          de: "Referenzbilder oder Muster",
          en: "Reference Images or Samples",
        },
        required: false,
        multiple: true,
      },
      {
        id: "stamp-design-files",
        kind: "design-files",
        title: {
          ar: "ملفات التصميم",
          de: "Designdateien",
          en: "Design Files",
        },
        required: false,
        multiple: true,
      },
    ],
  },
];