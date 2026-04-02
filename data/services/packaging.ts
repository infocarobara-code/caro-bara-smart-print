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

export const packagingServices: Service[] = [
  {
    id: "stickers-labels",
    category: "packaging-labeling",
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
        id: "stickerType",
        type: "select",
        label: { ar: "نوع الطلب", de: "Art der Anfrage", en: "Request Type" },
        options: [
          { value: "product-label", label: { ar: "ملصق منتج", de: "Produktetikett", en: "Product Label" } },
          { value: "logo-sticker", label: { ar: "ستيكر شعار", de: "Logo-Sticker", en: "Logo Sticker" } },
          { value: "window-wrap", label: { ar: "تغليف زجاج", de: "Fensterfolierung", en: "Window Wrap" } },
          { value: "car-wrap", label: { ar: "تغليف سيارة", de: "Fahrzeugfolierung", en: "Car Wrap" } },
          { value: "wall-graphic", label: { ar: "ملصق جداري", de: "Wandgrafik", en: "Wall Graphic" } },
        ],
      },
      {
        id: "quantity",
        type: "number",
        label: { ar: "الكمية", de: "Menge", en: "Quantity" },
        placeholder: { ar: "مثال: 1000", de: "Beispiel: 1000", en: "Example: 1000" },
      },
      {
        id: "size",
        type: "text",
        label: { ar: "المقاس", de: "Format", en: "Size" },
        placeholder: { ar: "مثال: 5x5 سم", de: "Beispiel: 5x5 cm", en: "Example: 5x5 cm" },
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
      },
      {
        id: "lamination",
        type: "radio",
        label: { ar: "هل تحتاج حماية؟", de: "Schutzlaminat?", en: "Need Protection?" },
        options: [
          { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
          { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
        ],
      },
      {
        id: "installation",
        type: "radio",
        label: { ar: "هل تحتاج تركيبًا؟", de: "Montage benötigt?", en: "Need Installation?" },
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
          ar: "اكتب نوع السطح، اللون، الاستخدام، أو أي ملاحظات إضافية",
          de: "Beschreibe Oberfläche, Farbe, Einsatz und weitere Hinweise",
          en: "Describe surface, color, usage, or any additional notes",
        },
      },
    ],
  },
  {
    id: "packaging",
    category: "packaging-labeling",
    title: {
      ar: "التغليف والعلب والأكياس",
      de: "Verpackung, Boxen & Taschen",
      en: "Packaging, Boxes & Bags",
    },
    description: {
      ar: "علب منتجات، أكياس ورقية وعادية، تغليف هدايا، وصناديق عرض.",
      de: "Produktboxen, Papier- und Tragetaschen, Geschenkverpackungen und Display-Boxen.",
      en: "Product boxes, paper and standard bags, gift packaging, and display boxes.",
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
        id: "packageType",
        type: "select",
        label: { ar: "نوع التغليف", de: "Verpackungsart", en: "Packaging Type" },
        options: [
          { value: "box", label: { ar: "علبة", de: "Box", en: "Box" } },
          { value: "paper-bag", label: { ar: "كيس ورقي", de: "Papiertasche", en: "Paper Bag" } },
          { value: "plastic-bag", label: { ar: "كيس عادي", de: "Tragetasche", en: "Standard Bag" } },
          { value: "gift-packaging", label: { ar: "تغليف هدايا", de: "Geschenkverpackung", en: "Gift Packaging" } },
          { value: "display-box", label: { ar: "صندوق عرض", de: "Display-Box", en: "Display Box" } },
        ],
      },
      {
        id: "productType",
        type: "text",
        label: { ar: "نوع المنتج داخل التغليف", de: "Produktart in der Verpackung", en: "Product Type Inside Packaging" },
        placeholder: {
          ar: "مثال: عطر، حلويات، ملابس، أكسسوار",
          de: "Beispiel: Parfüm, Süßwaren, Kleidung, Accessoires",
          en: "Example: perfume, sweets, clothing, accessories",
        },
      },
      {
        id: "quantity",
        type: "number",
        label: { ar: "الكمية", de: "Menge", en: "Quantity" },
        placeholder: { ar: "مثال: 500", de: "Beispiel: 500", en: "Example: 500" },
      },
      {
        id: "dimensions",
        type: "text",
        label: { ar: "الأبعاد", de: "Abmessungen", en: "Dimensions" },
        placeholder: { ar: "مثال: 20×10×30 سم", de: "Beispiel: 20×10×30 cm", en: "Example: 20×10×30 cm" },
      },
      {
        id: "material",
        type: "select",
        label: { ar: "المادة", de: "Material", en: "Material" },
        options: [
          { value: "paper", label: { ar: "ورق", de: "Papier", en: "Paper" } },
          { value: "cardboard", label: { ar: "كرتون", de: "Karton", en: "Cardboard" } },
          { value: "plastic", label: { ar: "بلاستيك", de: "Kunststoff", en: "Plastic" } },
          { value: "kraft", label: { ar: "كرافت", de: "Kraftpapier", en: "Kraft" } },
          { value: "premium", label: { ar: "فاخر", de: "Premium", en: "Premium" } },
          { value: "not-sure", label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" } },
        ],
      },
      {
        id: "thickness",
        type: "text",
        label: { ar: "السماكة", de: "Stärke", en: "Thickness" },
        placeholder: { ar: "مثال: 300g أو 400g", de: "Beispiel: 300g oder 400g", en: "Example: 300g or 400g" },
      },
      {
        id: "printingNeeded",
        type: "radio",
        label: { ar: "هل تحتاج طباعة؟", de: "Bedruckung benötigt?", en: "Need Printing?" },
        options: [
          { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
          { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
        ],
      },
      {
        id: "printSides",
        type: "radio",
        label: { ar: "مكان الطباعة", de: "Druckposition", en: "Print Location" },
        options: [
          { value: "outside", label: { ar: "خارجي فقط", de: "Nur außen", en: "Outside Only" } },
          { value: "inside-outside", label: { ar: "داخلي وخارجي", de: "Innen und außen", en: "Inside and Outside" } },
        ],
      },
      {
        id: "handleType",
        type: "select",
        label: { ar: "نوع المقبض", de: "Art des Griffs", en: "Handle Type" },
        options: [
          { value: "none", label: { ar: "بدون", de: "Ohne", en: "None" } },
          { value: "rope", label: { ar: "حبل", de: "Seil", en: "Rope" } },
          { value: "die-cut", label: { ar: "قص بالمادة", de: "Gestanzt", en: "Die Cut" } },
          { value: "flat", label: { ar: "مسطح", de: "Flachgriff", en: "Flat Handle" } },
        ],
      },
      {
        id: "sampleNeeded",
        type: "radio",
        label: { ar: "هل تحتاج نموذجًا أوليًا؟", de: "Muster benötigt?", en: "Need Sample?" },
        options: [
          { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
          { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
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
        id: "notes",
        type: "textarea",
        label: { ar: "تفاصيل إضافية", de: "Zusätzliche Details", en: "Additional Details" },
        placeholder: {
          ar: "اكتب نوع المنتج، الألوان، الشعار، فخامة التغليف، أو أي تفاصيل أخرى",
          de: "Beschreibe Produktart, Farben, Logo, Verpackungsstil oder weitere Informationen",
          en: "Describe product type, colors, logo, packaging style, or any other details",
        },
      },
    ],
  },
];