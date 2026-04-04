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
  semanticGroup: "contact",
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
  semanticGroup: "contact",
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
  semanticGroup: "contact",
};

const contactSection = (): ServiceSection => ({
  id: "contact",
  title: {
    ar: "معلومات التواصل",
    de: "Kontaktdaten",
    en: "Contact Details",
  },
  fields: [customerNameField, phoneField, emailField],
});

export const packagingServices: Service[] = [
  {
    id: "stickers-labels",
    category: "packaging",
    title: {
      ar: "الملصقات والستيكر والتغليف اللاصق",
      de: "Sticker, Etiketten & Folierung",
      en: "Stickers, Labels & Adhesive Wrapping",
    },
    description: {
      ar: "ملصقات منتجات، ستيكرات، قص خاص، تغليف واجهات وسيارات وزجاج.",
      de: "Produktetiketten, Sticker, Konturschnitt, Schaufenster-, Fahrzeug- und Glasfolierung.",
      en: "Product labels, stickers, contour cut, storefront, vehicle, and glass wrapping.",
    },

    intro: {
      ar: "يمكنك من خلال هذا النموذج طلب أي نوع من الملصقات أو التغليف اللاصق سواء للمنتجات أو الواجهات أو السيارات.",
      de: "Mit diesem Formular kannst du Sticker, Etiketten oder Folierungen für Produkte, Fenster oder Fahrzeuge anfragen.",
      en: "Use this form to request stickers, labels, or wrapping for products, windows, or vehicles.",
    },

    requestGuidance: [
      {
        ar: "إذا كان لديك قياسات دقيقة أو ملف تصميم، سيجعل ذلك العرض أدق.",
        de: "Genaue Maße oder Design-Dateien helfen uns, ein präziseres Angebot zu erstellen.",
        en: "Accurate dimensions or design files help us provide a more precise quote.",
      },
    ],

    seo: {
      slug: "stickers-labels",
      categorySlug: "packaging",
    },

    aiSummaryHint:
      "Summarize sticker or label request with type, quantity, size, shape, lamination, installation, and surface details.",

    sections: [
      contactSection(),

      {
        id: "basic",
        title: {
          ar: "نوع الطلب",
          de: "Anfrageart",
          en: "Request Type",
        },
        fields: [
          {
            id: "stickerType",
            type: "select",
            label: {
              ar: "نوع الطلب",
              de: "Art der Anfrage",
              en: "Request Type",
            },
            options: [
              { value: "product-label", label: { ar: "ملصق منتج", de: "Produktetikett", en: "Product Label" } },
              { value: "logo-sticker", label: { ar: "ستيكر شعار", de: "Logo-Sticker", en: "Logo Sticker" } },
              { value: "window-wrap", label: { ar: "تغليف زجاج", de: "Fensterfolierung", en: "Window Wrap" } },
              { value: "car-wrap", label: { ar: "تغليف سيارة", de: "Fahrzeugfolierung", en: "Car Wrap" } },
              { value: "wall-graphic", label: { ar: "ملصق جداري", de: "Wandgrafik", en: "Wall Graphic" } },
            ],
            semanticGroup: "project",
            allowsUnknown: true,
          },
        ],
      },

      {
        id: "dimensions",
        title: {
          ar: "المقاسات والكميات",
          de: "Maße & Mengen",
          en: "Dimensions & Quantity",
        },
        fields: [
          {
            id: "quantity",
            type: "number",
            label: { ar: "الكمية", de: "Menge", en: "Quantity" },
            semanticGroup: "dimensions",
            allowsUnknown: true,
          },
          {
            id: "size",
            type: "text",
            label: { ar: "المقاس", de: "Format", en: "Size" },
            semanticGroup: "dimensions",
            allowsUnknown: true,
          },
          {
            id: "shape",
            type: "select",
            label: { ar: "الشكل", de: "Form", en: "Shape" },
            options: [
              { value: "square", label: { ar: "مربع", de: "Quadratisch", en: "Square" } },
              { value: "round", label: { ar: "دائري", de: "Rund", en: "Round" } },
              { value: "custom", label: { ar: "قص خاص", de: "Freiform", en: "Custom Cut" } },
            ],
            semanticGroup: "dimensions",
          },
        ],
      },

      {
        id: "technical",
        title: {
          ar: "المواصفات",
          de: "Technische Details",
          en: "Specifications",
        },
        fields: [
          {
            id: "lamination",
            type: "radio",
            label: {
              ar: "هل تحتاج حماية؟",
              de: "Schutzlaminat?",
              en: "Need Protection?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
            ],
            semanticGroup: "production",
          },
          {
            id: "installation",
            type: "radio",
            label: {
              ar: "هل تحتاج تركيبًا؟",
              de: "Montage benötigt?",
              en: "Need Installation?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
            ],
            semanticGroup: "installation",
          },
        ],
      },

      {
        id: "notes",
        title: {
          ar: "ملاحظات إضافية",
          de: "Zusätzliche Details",
          en: "Additional Details",
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
            semanticGroup: "notes",
          },
        ],
      },
    ],

    attachments: [
      {
        id: "reference-images",
        kind: "reference-images",
        title: {
          ar: "صور مرجعية",
          de: "Referenzbilder",
          en: "Reference Images",
        },
        multiple: true,
      },
      {
        id: "design-files",
        kind: "design-files",
        title: {
          ar: "ملفات التصميم",
          de: "Designdateien",
          en: "Design Files",
        },
        multiple: true,
      },
    ],
  },

  {
    id: "packaging",
    category: "packaging",
    title: {
      ar: "التغليف والعلب والأكياس",
      de: "Verpackung, Boxen & Taschen",
      en: "Packaging, Boxes & Bags",
    },
    description: {
      ar: "علب منتجات، أكياس، تغليف هدايا، وصناديق عرض.",
      de: "Produktboxen, Taschen und Geschenkverpackungen.",
      en: "Product boxes, bags, and packaging solutions.",
    },

    intro: {
      ar: "هذا النموذج مخصص لتصميم وتنفيذ التغليف حسب المنتج الخاص بك.",
      de: "Dieses Formular dient zur individuellen Verpackungsanfrage.",
      en: "This form is for custom packaging requests.",
    },

    aiSummaryHint:
      "Summarize packaging request with type, product, quantity, dimensions, material, printing, and delivery.",

    sections: [
      contactSection(),

      {
        id: "type",
        title: {
          ar: "نوع التغليف",
          de: "Verpackungsart",
          en: "Packaging Type",
        },
        fields: [
          {
            id: "packageType",
            type: "select",
            label: {
              ar: "نوع التغليف",
              de: "Verpackungsart",
              en: "Packaging Type",
            },
            options: [
              { value: "box", label: { ar: "علبة", de: "Box", en: "Box" } },
              { value: "paper-bag", label: { ar: "كيس ورقي", de: "Papiertasche", en: "Paper Bag" } },
              { value: "plastic-bag", label: { ar: "كيس", de: "Tasche", en: "Bag" } },
              { value: "gift-packaging", label: { ar: "هدايا", de: "Geschenk", en: "Gift Packaging" } },
            ],
            semanticGroup: "project",
          },
        ],
      },

      {
        id: "product",
        title: {
          ar: "تفاصيل المنتج",
          de: "Produktdetails",
          en: "Product Details",
        },
        fields: [
          {
            id: "productType",
            type: "text",
            label: {
              ar: "نوع المنتج",
              de: "Produkt",
              en: "Product Type",
            },
            semanticGroup: "project",
          },
          {
            id: "quantity",
            type: "number",
            label: {
              ar: "الكمية",
              de: "Menge",
              en: "Quantity",
            },
            semanticGroup: "dimensions",
          },
          {
            id: "dimensions",
            type: "text",
            label: {
              ar: "الأبعاد",
              de: "Abmessungen",
              en: "Dimensions",
            },
            semanticGroup: "dimensions",
          },
        ],
      },

      {
        id: "materials",
        title: {
          ar: "المواد والطباعة",
          de: "Material & Druck",
          en: "Material & Printing",
        },
        fields: [
          {
            id: "material",
            type: "select",
            label: {
              ar: "المادة",
              de: "Material",
              en: "Material",
            },
            options: [
              { value: "paper", label: { ar: "ورق", de: "Papier", en: "Paper" } },
              { value: "cardboard", label: { ar: "كرتون", de: "Karton", en: "Cardboard" } },
              { value: "plastic", label: { ar: "بلاستيك", de: "Kunststoff", en: "Plastic" } },
              { value: "kraft", label: { ar: "كرافت", de: "Kraft", en: "Kraft" } },
            ],
            semanticGroup: "materials",
          },
          {
            id: "printingNeeded",
            type: "radio",
            label: {
              ar: "هل تحتاج طباعة؟",
              de: "Druck benötigt?",
              en: "Need Printing?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
            ],
            semanticGroup: "production",
          },
        ],
      },

      {
        id: "delivery",
        title: {
          ar: "التسليم",
          de: "Lieferung",
          en: "Delivery",
        },
        fields: [
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
          },
        ],
      },

      {
        id: "notes",
        title: {
          ar: "ملاحظات",
          de: "Notizen",
          en: "Notes",
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
            semanticGroup: "notes",
          },
        ],
      },
    ],

    attachments: [
      {
        id: "packaging-design",
        kind: "design-files",
        title: {
          ar: "ملفات التصميم",
          de: "Design-Dateien",
          en: "Design Files",
        },
        multiple: true,
      },
    ],
  },
];