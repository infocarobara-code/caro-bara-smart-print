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

const quantityOptions = [
  { value: "50", label: { ar: "50", de: "50", en: "50" } },
  { value: "100", label: { ar: "100", de: "100", en: "100" } },
  { value: "250", label: { ar: "250", de: "250", en: "250" } },
  { value: "500", label: { ar: "500", de: "500", en: "500" } },
  { value: "1000", label: { ar: "1000", de: "1000", en: "1000" } },
  { value: "2000", label: { ar: "2000", de: "2000", en: "2000" } },
  { value: "2500", label: { ar: "2500", de: "2500", en: "2500" } },
  { value: "3000", label: { ar: "3000", de: "3000", en: "3000" } },
  { value: "4000", label: { ar: "4000", de: "4000", en: "4000" } },
  { value: "5000", label: { ar: "5000", de: "5000", en: "5000" } },
  { value: "6000", label: { ar: "6000", de: "6000", en: "6000" } },
  { value: "7000", label: { ar: "7000", de: "7000", en: "7000" } },
  { value: "8000", label: { ar: "8000", de: "8000", en: "8000" } },
  { value: "9000", label: { ar: "9000", de: "9000", en: "9000" } },
  { value: "10000", label: { ar: "10000", de: "10000", en: "10000" } },
  { value: "20000", label: { ar: "20000", de: "20000", en: "20000" } },
  { value: "30000", label: { ar: "30000", de: "30000", en: "30000" } },
  { value: "40000", label: { ar: "40000", de: "40000", en: "40000" } },
  { value: "50000", label: { ar: "50000", de: "50000", en: "50000" } },
  {
    value: "custom",
    label: {
      ar: "كمية مخصصة",
      de: "Individuelle Menge",
      en: "Custom Quantity",
    },
  },
];

const paperWeightOptions = [
  { value: "80gsm", label: { ar: "80 gsm", de: "80 g/m²", en: "80 gsm" } },
  { value: "90gsm", label: { ar: "90 gsm", de: "90 g/m²", en: "90 gsm" } },
  { value: "100gsm", label: { ar: "100 gsm", de: "100 g/m²", en: "100 gsm" } },
  { value: "120gsm", label: { ar: "120 gsm", de: "120 g/m²", en: "120 gsm" } },
  { value: "130gsm", label: { ar: "130 gsm", de: "130 g/m²", en: "130 gsm" } },
  { value: "135gsm", label: { ar: "135 gsm", de: "135 g/m²", en: "135 gsm" } },
  { value: "150gsm", label: { ar: "150 gsm", de: "150 g/m²", en: "150 gsm" } },
  { value: "170gsm", label: { ar: "170 gsm", de: "170 g/m²", en: "170 gsm" } },
  { value: "200gsm", label: { ar: "200 gsm", de: "200 g/m²", en: "200 gsm" } },
  { value: "250gsm", label: { ar: "250 gsm", de: "250 g/m²", en: "250 gsm" } },
  { value: "300gsm", label: { ar: "300 gsm", de: "300 g/m²", en: "300 gsm" } },
  { value: "350gsm", label: { ar: "350 gsm", de: "350 g/m²", en: "350 gsm" } },
  { value: "400gsm", label: { ar: "400 gsm", de: "400 g/m²", en: "400 gsm" } },
  {
    value: "not-sure",
    label: {
      ar: "غير متأكد",
      de: "Nicht sicher",
      en: "Not sure",
    },
  },
  {
    value: "custom",
    label: {
      ar: "غراماج خاص",
      de: "Individuelle Grammatur",
      en: "Custom GSM",
    },
  },
];

const commonPaperTypeOptions = [
  { value: "matte", label: { ar: "مطفي", de: "Matt", en: "Matte" } },
  { value: "glossy", label: { ar: "لامع", de: "Glänzend", en: "Glossy" } },
  { value: "silk", label: { ar: "حريري", de: "Seidenmatt", en: "Silk" } },
  { value: "offset", label: { ar: "أوفست", de: "Offset", en: "Offset" } },
  { value: "premium", label: { ar: "فاخر", de: "Premium", en: "Premium" } },
  { value: "kraft", label: { ar: "كرافت", de: "Kraftpapier", en: "Kraft" } },
  { value: "recycled", label: { ar: "معاد تدويره", de: "Recyclingpapier", en: "Recycled" } },
  {
    value: "not-sure",
    label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" },
  },
  {
    value: "custom",
    label: { ar: "نوع خاص", de: "Sonderpapier", en: "Custom Paper" },
  },
];

const businessCardSizeOptions = [
  { value: "85x55mm", label: { ar: "85×55 مم", de: "85×55 mm", en: "85×55 mm" } },
  { value: "90x50mm", label: { ar: "90×50 مم", de: "90×50 mm", en: "90×50 mm" } },
  { value: "90x55mm", label: { ar: "90×55 مم", de: "90×55 mm", en: "90×55 mm" } },
  {
    value: "square-65x65mm",
    label: { ar: "مربع 65×65 مم", de: "Quadratisch 65×65 mm", en: "Square 65×65 mm" },
  },
  {
    value: "custom",
    label: { ar: "مقاس خاص", de: "Sonderformat", en: "Custom Size" },
  },
];

const flyerSizeOptions = [
  { value: "a6", label: { ar: "A6", de: "A6", en: "A6" } },
  { value: "a5", label: { ar: "A5", de: "A5", en: "A5" } },
  { value: "a4", label: { ar: "A4", de: "A4", en: "A4" } },
  { value: "a3", label: { ar: "A3", de: "A3", en: "A3" } },
  { value: "dl-10x21cm", label: { ar: "DL 10×21 سم", de: "DL 10×21 cm", en: "DL 10×21 cm" } },
  {
    value: "square-148x148mm",
    label: { ar: "مربع 148×148 مم", de: "Quadratisch 148×148 mm", en: "Square 148×148 mm" },
  },
  {
    value: "custom",
    label: { ar: "مقاس خاص", de: "Sonderformat", en: "Custom Size" },
  },
];

const menuSizeOptions = [
  { value: "a5", label: { ar: "A5", de: "A5", en: "A5" } },
  { value: "a4", label: { ar: "A4", de: "A4", en: "A4" } },
  { value: "a3", label: { ar: "A3", de: "A3", en: "A3" } },
  { value: "dl-10x21cm", label: { ar: "DL 10×21 سم", de: "DL 10×21 cm", en: "DL 10×21 cm" } },
  {
    value: "square-210x210mm",
    label: { ar: "مربع 210×210 مم", de: "Quadratisch 210×210 mm", en: "Square 210×210 mm" },
  },
  {
    value: "custom",
    label: { ar: "مقاس خاص", de: "Sonderformat", en: "Custom Size" },
  },
];

const brochureSizeOptions = [
  { value: "a5", label: { ar: "A5", de: "A5", en: "A5" } },
  { value: "a4", label: { ar: "A4", de: "A4", en: "A4" } },
  { value: "a3-folded", label: { ar: "A3 مطوي", de: "A3 gefalzt", en: "A3 Folded" } },
  {
    value: "square-210x210mm",
    label: { ar: "مربع 210×210 مم", de: "Quadratisch 210×210 mm", en: "Square 210×210 mm" },
  },
  {
    value: "custom",
    label: { ar: "مقاس خاص", de: "Sonderformat", en: "Custom Size" },
  },
];

const posterSizeOptions = [
  { value: "a3", label: { ar: "A3", de: "A3", en: "A3" } },
  { value: "a2", label: { ar: "A2", de: "A2", en: "A2" } },
  { value: "a1", label: { ar: "A1", de: "A1", en: "A1" } },
  { value: "a0", label: { ar: "A0", de: "A0", en: "A0" } },
  { value: "50x70cm", label: { ar: "50×70 سم", de: "50×70 cm", en: "50×70 cm" } },
  { value: "70x100cm", label: { ar: "70×100 سم", de: "70×100 cm", en: "70×100 cm" } },
  {
    value: "custom",
    label: { ar: "مقاس خاص", de: "Sonderformat", en: "Custom Size" },
  },
];

const catalogSizeOptions = [
  { value: "a5", label: { ar: "A5", de: "A5", en: "A5" } },
  { value: "a4", label: { ar: "A4", de: "A4", en: "A4" } },
  {
    value: "square-210x210mm",
    label: { ar: "مربع 210×210 مم", de: "Quadratisch 210×210 mm", en: "Square 210×210 mm" },
  },
  {
    value: "custom",
    label: { ar: "مقاس خاص", de: "Sonderformat", en: "Custom Size" },
  },
];

const folderSizeOptions = [
  { value: "a4", label: { ar: "A4", de: "A4", en: "A4" } },
  { value: "a5", label: { ar: "A5", de: "A5", en: "A5" } },
  {
    value: "custom",
    label: { ar: "مقاس خاص", de: "Sonderformat", en: "Custom Size" },
  },
];

const pageCountOptions = [
  { value: "2-sides", label: { ar: "وجهان", de: "2 Seiten", en: "2 sides" } },
  { value: "4-pages", label: { ar: "4 صفحات", de: "4 Seiten", en: "4 pages" } },
  { value: "6-pages", label: { ar: "6 صفحات", de: "6 Seiten", en: "6 pages" } },
  { value: "8-pages", label: { ar: "8 صفحات", de: "8 Seiten", en: "8 pages" } },
  { value: "12-pages", label: { ar: "12 صفحة", de: "12 Seiten", en: "12 pages" } },
  { value: "16-pages", label: { ar: "16 صفحة", de: "16 Seiten", en: "16 pages" } },
  { value: "20-pages", label: { ar: "20 صفحة", de: "20 Seiten", en: "20 pages" } },
  { value: "24-pages", label: { ar: "24 صفحة", de: "24 Seiten", en: "24 pages" } },
  { value: "32-pages", label: { ar: "32 صفحة", de: "32 Seiten", en: "32 pages" } },
  { value: "40-pages", label: { ar: "40 صفحة", de: "40 Seiten", en: "40 pages" } },
  {
    value: "custom",
    label: { ar: "عدد خاص", de: "Individuelle Seitenzahl", en: "Custom Count" },
  },
];

const menuPageOptions = [
  { value: "2-sides", label: { ar: "وجهان", de: "2 Seiten", en: "2 sides" } },
  { value: "4-pages", label: { ar: "4 صفحات", de: "4 Seiten", en: "4 pages" } },
  { value: "6-pages", label: { ar: "6 صفحات", de: "6 Seiten", en: "6 pages" } },
  { value: "8-pages", label: { ar: "8 صفحات", de: "8 Seiten", en: "8 pages" } },
  { value: "12-pages", label: { ar: "12 صفحة", de: "12 Seiten", en: "12 pages" } },
  {
    value: "custom",
    label: { ar: "عدد خاص", de: "Individuelle Seitenzahl", en: "Custom Count" },
  },
];

const businessCardFinishingOptions = [
  {
    value: "lamination-matte",
    label: { ar: "تغليف مطفي", de: "Matt laminiert", en: "Matte Lamination" },
  },
  {
    value: "lamination-glossy",
    label: { ar: "تغليف لامع", de: "Glänzend laminiert", en: "Glossy Lamination" },
  },
  { value: "soft-touch", label: { ar: "سوفت تاتش", de: "Soft-Touch", en: "Soft Touch" } },
  { value: "spot-uv", label: { ar: "سبوت UV", de: "Spot-UV", en: "Spot UV" } },
  {
    value: "round-corners",
    label: { ar: "زوايا دائرية", de: "Runde Ecken", en: "Rounded Corners" },
  },
  { value: "none", label: { ar: "بدون", de: "Keine", en: "None" } },
];

const flyerFinishingOptions = [
  {
    value: "lamination-matte",
    label: { ar: "تغليف مطفي", de: "Matt laminiert", en: "Matte Lamination" },
  },
  {
    value: "lamination-glossy",
    label: { ar: "تغليف لامع", de: "Glänzend laminiert", en: "Glossy Lamination" },
  },
  { value: "uv-varnish", label: { ar: "UV", de: "UV-Lack", en: "UV Varnish" } },
  { value: "folding", label: { ar: "طي", de: "Falzung", en: "Folding" } },
  { value: "none", label: { ar: "بدون", de: "Keine", en: "None" } },
];

const menuFinishingOptions = [
  {
    value: "lamination-matte",
    label: { ar: "تغليف مطفي", de: "Matt laminiert", en: "Matte Lamination" },
  },
  {
    value: "lamination-glossy",
    label: { ar: "تغليف لامع", de: "Glänzend laminiert", en: "Glossy Lamination" },
  },
  { value: "folding", label: { ar: "طي", de: "Falzung", en: "Folding" } },
  { value: "creasing", label: { ar: "تكسير", de: "Rillen", en: "Creasing" } },
  { value: "none", label: { ar: "بدون", de: "Keine", en: "None" } },
];

const brochureFinishingOptions = [
  {
    value: "lamination-matte",
    label: { ar: "تغليف مطفي", de: "Matt laminiert", en: "Matte Lamination" },
  },
  {
    value: "lamination-glossy",
    label: { ar: "تغليف لامع", de: "Glänzend laminiert", en: "Glossy Lamination" },
  },
  { value: "folding", label: { ar: "طي", de: "Falzung", en: "Folding" } },
  { value: "creasing", label: { ar: "تكسير", de: "Rillen", en: "Creasing" } },
  { value: "stapled", label: { ar: "تدبيس", de: "Geheftet", en: "Stapled" } },
  { value: "none", label: { ar: "بدون", de: "Keine", en: "None" } },
];

const posterFinishingOptions = [
  { value: "uv-varnish", label: { ar: "UV", de: "UV-Lack", en: "UV Varnish" } },
  {
    value: "lamination-matte",
    label: { ar: "تغليف مطفي", de: "Matt laminiert", en: "Matte Lamination" },
  },
  {
    value: "lamination-glossy",
    label: { ar: "تغليف لامع", de: "Glänzend laminiert", en: "Glossy Lamination" },
  },
  { value: "none", label: { ar: "بدون", de: "Keine", en: "None" } },
];

const catalogFinishingOptions = [
  {
    value: "lamination-matte",
    label: { ar: "تغليف مطفي", de: "Matt laminiert", en: "Matte Lamination" },
  },
  {
    value: "lamination-glossy",
    label: { ar: "تغليف لامع", de: "Glänzend laminiert", en: "Glossy Lamination" },
  },
  { value: "stapled", label: { ar: "تدبيس", de: "Geheftet", en: "Stapled" } },
  { value: "wire-o", label: { ar: "تجليد سلك", de: "Wire-O", en: "Wire-O" } },
  {
    value: "perfect-binding",
    label: { ar: "تجليد لاصق", de: "Klebebindung", en: "Perfect Binding" },
  },
  { value: "none", label: { ar: "بدون", de: "Keine", en: "None" } },
];

const folderFinishingOptions = [
  {
    value: "lamination-matte",
    label: { ar: "تغليف مطفي", de: "Matt laminiert", en: "Matte Lamination" },
  },
  {
    value: "lamination-glossy",
    label: { ar: "تغليف لامع", de: "Glänzend laminiert", en: "Glossy Lamination" },
  },
  { value: "spot-uv", label: { ar: "سبوت UV", de: "Spot-UV", en: "Spot UV" } },
  { value: "none", label: { ar: "بدون", de: "Keine", en: "None" } },
];

const createDesignAttachments = (prefix: string) => [
  {
    id: `${prefix}-design-files`,
    kind: "design-files" as const,
    title: {
      ar: "ملفات التصميم",
      de: "Designdateien",
      en: "Design Files",
    },
    description: {
      ar: "يمكن رفع ملفات مثل PDF أو AI أو EPS لاحقًا.",
      de: "Dateien wie PDF, AI oder EPS können später hochgeladen werden.",
      en: "Files such as PDF, AI, or EPS can be uploaded later.",
    },
    required: false,
    multiple: true,
  },
  {
    id: `${prefix}-reference-images`,
    kind: "reference-images" as const,
    title: {
      ar: "صور مرجعية",
      de: "Referenzbilder",
      en: "Reference Images",
    },
    required: false,
    multiple: true,
  },
];

const createStandardPrintService = (config: {
  id: string;
  title: Service["title"];
  description: Service["description"];
  intro: Service["intro"];
  requestGuidance: Service["requestGuidance"];
  seo: Service["seo"];
  aiSummaryHint: string;
  sizeOptions: Array<{ value: string; label: { ar: string; de: string; en: string } }>;
  pageOptions?: Array<{ value: string; label: { ar: string; de: string; en: string } }>;
  finishingOptions: Array<{ value: string; label: { ar: string; de: string; en: string } }>;
  notesPlaceholder: { ar: string; de: string; en: string };
}): Service => ({
  id: config.id,
  category: "printing",
  title: config.title,
  description: config.description,
  intro: config.intro,
  requestGuidance: config.requestGuidance,
  seo: config.seo,
  aiSummaryHint: config.aiSummaryHint,
  sections: [
    createContactSection(),
    {
      id: "product-basics",
      title: {
        ar: "الطلب الأساسي",
        de: "Grunddaten der Anfrage",
        en: "Core Request Details",
      },
      description: {
        ar: "حدد الكمية وموعد التنفيذ المطلوب.",
        de: "Gib Menge und gewünschten Termin an.",
        en: "Define quantity and requested deadline.",
      },
      fields: [
        {
          id: "quantity",
          type: "select",
          label: {
            ar: "الكمية",
            de: "Menge",
            en: "Quantity",
          },
          options: quantityOptions,
          semanticGroup: "dimensions",
          allowsUnknown: true,
          aiHint: "Requested quantity.",
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
          aiHint: "Requested deadline.",
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
        ar: "اختر المقاس ونوع الورق والغراماج.",
        de: "Wähle Format, Papierart und Grammatur.",
        en: "Choose size, paper type, and GSM.",
      },
      fields: [
        {
          id: "size",
          type: "select",
          label: {
            ar: "المقاس",
            de: "Format",
            en: "Size",
          },
          options: config.sizeOptions,
          semanticGroup: "dimensions",
          allowsUnknown: true,
          aiHint: "Requested print size.",
        },
        ...(config.pageOptions
          ? [
              {
                id: "pageCount",
                type: "select",
                label: {
                  ar: "عدد الصفحات أو الأوجه",
                  de: "Seitenzahl oder Druckseiten",
                  en: "Page Count or Print Sides",
                },
                options: config.pageOptions,
                semanticGroup: "dimensions",
                allowsUnknown: true,
                aiHint: "Page count or side count.",
              } as ServiceField,
            ]
          : []),
        {
          id: "paperType",
          type: "select",
          label: {
            ar: "نوع الورق",
            de: "Papiersorte",
            en: "Paper Type",
          },
          options: commonPaperTypeOptions,
          semanticGroup: "materials",
          allowsUnknown: true,
          aiHint: "Paper type preference.",
        },
        {
          id: "paperWeight",
          type: "select",
          label: {
            ar: "غراماج الورق",
            de: "Papiergewicht",
            en: "Paper Weight",
          },
          options: paperWeightOptions,
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
        ar: "حدد ألوان الطباعة والتشطيب وحالة التصميم.",
        de: "Lege Druckfarben, Veredelung und Designstatus fest.",
        en: "Define print colors, finishing, and design status.",
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
            {
              value: "bw",
              label: { ar: "أبيض وأسود", de: "Schwarzweiß", en: "Black & White" },
            },
            {
              value: "full-color",
              label: { ar: "ألوان كاملة", de: "Vollfarbe", en: "Full Color" },
            },
          ],
          semanticGroup: "production",
          allowsUnknown: true,
          aiHint: "Print color mode.",
        },
        {
          id: "finishing",
          type: "checkbox",
          label: {
            ar: "التشطيب",
            de: "Veredelung",
            en: "Finishing",
          },
          options: config.finishingOptions,
          semanticGroup: "production",
          allowsUnknown: true,
          aiHint: "Required finishing.",
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
          aiHint: "Whether design is ready.",
        },
        {
          id: "notes",
          type: "textarea",
          label: {
            ar: "ملاحظات إضافية",
            de: "Zusätzliche Details",
            en: "Additional Details",
          },
          placeholder: config.notesPlaceholder,
          semanticGroup: "notes",
          aiHint: "Additional notes for the request.",
        },
      ],
    },
  ],
  attachments: createDesignAttachments(config.id),
});

export const printingServices: Service[] = [
  {
    id: "open-printing-request",
    category: "printing",
    title: {
      ar: "طلب طباعة مفتوح",
      de: "Offene Druckanfrage",
      en: "Open Printing Request",
    },
    description: {
      ar: "ابدأ من هنا إذا لم تكن متأكدًا تمامًا من نوع المطبوع الذي تحتاجه. صف الفكرة وسنحوّلها إلى طلب واضح وقابل للتنفيذ.",
      de: "Starte hier, wenn du noch nicht genau weißt, welches Druckprodukt du brauchst. Beschreibe deine Idee und wir verwandeln sie in eine klare und umsetzbare Anfrage.",
      en: "Start here if you are not yet sure which print product you need. Describe your idea and we will turn it into a clear, actionable request.",
    },
    intro: {
      ar: "هذا النموذج مناسب عندما تكون لديك حاجة للطباعة لكنك لا تعرف بالضبط من أين تبدأ أو ما المنتج الأنسب لك. يمكنك وصف المشروع أو الفكرة أو الاستخدام المطلوب، وسنساعدك على تنظيم الطلب وتحديد المواصفات المناسبة.",
      de: "Dieses Formular ist passend, wenn du einen Druckbedarf hast, aber noch nicht genau weißt, wo du anfangen sollst oder welches Produkt am besten passt. Beschreibe einfach dein Projekt, deine Idee oder den Verwendungszweck, und wir helfen dir bei der Strukturierung.",
      en: "This form is suitable when you need something printed but are not yet sure where to start or which product fits best. Describe the project, idea, or intended use, and we will help structure the request.",
    },
    requestGuidance: [
      {
        ar: "إذا لم تكن تعرف اسم المنتج المناسب، صف فقط ما تريد الوصول إليه أو كيف سيتم استخدام المطبوع.",
        de: "Wenn du den genauen Produktnamen nicht kennst, beschreibe einfach das gewünschte Ergebnis oder den geplanten Einsatz.",
        en: "If you do not know the exact product name, simply describe the result you want or how the printed item will be used.",
      },
      {
        ar: "إذا كانت لديك صور أو أمثلة أو تصميمات مرجعية، فذلك يساعدنا على فهم طلبك بشكل أسرع.",
        de: "Wenn du Bilder, Beispiele oder Referenzen hast, hilft uns das, deine Anfrage schneller zu verstehen.",
        en: "If you have photos, examples, or reference designs, that helps us understand your request faster.",
      },
    ],
    seo: {
      slug: "open-printing-request",
      categorySlug: "printing",
      metaTitle: {
        ar: "طلب طباعة مفتوح | ابدأ بأي فكرة طباعة",
        de: "Offene Druckanfrage | Starte mit jeder Druckidee",
        en: "Open Printing Request | Start with Any Print Idea",
      },
      metaDescription: {
        ar: "نموذج ذكي لبدء أي طلب طباعة حتى لو لم تكن متأكدًا من المنتج المناسب. صف فكرتك وسنساعدك على تنظيمها.",
        de: "Intelligentes Formular für Druckanfragen, auch wenn das passende Produkt noch nicht klar ist. Beschreibe deine Idee und wir strukturieren sie.",
        en: "Smart form for any print request, even if the right product is not yet clear. Describe your idea and we will help structure it.",
      },
    },
    aiSummaryHint:
      "Summarize the open printing request with intended use, likely print product, quantity, size, material preferences, design status, deadline, and missing details to clarify.",
    sections: [
      createContactSection(),
      {
        id: "project-basics",
        title: {
          ar: "فكرة الطلب",
          de: "Anfrageidee",
          en: "Request Idea",
        },
        description: {
          ar: "صف نوع المشروع أو المطبوع الذي تفكر فيه.",
          de: "Beschreibe die Art des Projekts oder Druckprodukts, das du im Kopf hast.",
          en: "Describe the type of project or print product you have in mind.",
        },
        fields: [
          {
            id: "productIdea",
            type: "text",
            label: {
              ar: "ما الذي تريد طباعته؟",
              de: "Was möchtest du drucken?",
              en: "What Do You Want to Print?",
            },
            placeholder: {
              ar: "مثال: شيء للافتتاح، منيو، بطاقة، كتيب، ملف تعريفي...",
              de: "Beispiel: etwas für eine Eröffnung, Menü, Karte, Broschüre, Präsentationsmappe...",
              en: "Example: something for an opening, menu, card, booklet, presentation folder...",
            },
            semanticGroup: "project",
            allowsUnknown: true,
            aiHint: "General idea of the requested print product.",
          },
          {
            id: "intendedUse",
            type: "textarea",
            label: {
              ar: "كيف سيتم استخدامه؟",
              de: "Wie wird es verwendet?",
              en: "How Will It Be Used?",
            },
            placeholder: {
              ar: "صف أين سيستخدم هذا المطبوع ولماذا",
              de: "Beschreibe, wo und wofür das Druckprodukt verwendet wird",
              en: "Describe where and why this printed item will be used",
            },
            semanticGroup: "project",
            aiHint: "Usage context of the print product.",
          },
          {
            id: "quantity",
            type: "select",
            label: {
              ar: "الكمية التقريبية",
              de: "Ungefähre Menge",
              en: "Approximate Quantity",
            },
            options: quantityOptions,
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Approximate requested quantity.",
          },
          {
            id: "deadline",
            type: "text",
            label: {
              ar: "موعد التنفيذ المطلوب",
              de: "Gewünschter Termin",
              en: "Requested Deadline",
            },
            placeholder: {
              ar: "مثال: خلال أسبوع",
              de: "Beispiel: innerhalb einer Woche",
              en: "Example: within one week",
            },
            semanticGroup: "delivery",
            allowsUnknown: true,
            aiHint: "Requested deadline or urgency.",
          },
        ],
      },
      {
        id: "details",
        title: {
          ar: "التفاصيل المتوفرة",
          de: "Vorhandene Details",
          en: "Available Details",
        },
        description: {
          ar: "أدخل أي معلومات تعرفها عن المقاس أو الورق أو التصميم.",
          de: "Gib alle Informationen an, die du bereits zu Format, Papier oder Design kennst.",
          en: "Enter any information you already know about size, paper, or design.",
        },
        fields: [
          {
            id: "size",
            type: "select",
            label: {
              ar: "المقاس إن وجد",
              de: "Format, falls bekannt",
              en: "Size, If Known",
            },
            options: [
              { value: "a6", label: { ar: "A6", de: "A6", en: "A6" } },
              { value: "a5", label: { ar: "A5", de: "A5", en: "A5" } },
              { value: "a4", label: { ar: "A4", de: "A4", en: "A4" } },
              { value: "a3", label: { ar: "A3", de: "A3", en: "A3" } },
              { value: "a2", label: { ar: "A2", de: "A2", en: "A2" } },
              { value: "a1", label: { ar: "A1", de: "A1", en: "A1" } },
              { value: "a0", label: { ar: "A0", de: "A0", en: "A0" } },
              { value: "85x55mm", label: { ar: "85×55 مم", de: "85×55 mm", en: "85×55 mm" } },
              { value: "dl-10x21cm", label: { ar: "DL 10×21 سم", de: "DL 10×21 cm", en: "DL 10×21 cm" } },
              {
                value: "custom",
                label: { ar: "مقاس خاص", de: "Sonderformat", en: "Custom Size" },
              },
            ],
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Requested or approximate size.",
          },
          {
            id: "paperType",
            type: "select",
            label: {
              ar: "نوع الورق أو المادة",
              de: "Papiersorte oder Material",
              en: "Paper Type or Material",
            },
            options: commonPaperTypeOptions,
            semanticGroup: "materials",
            allowsUnknown: true,
            aiHint: "Paper type or material preference.",
          },
          {
            id: "paperWeight",
            type: "select",
            label: {
              ar: "غراماج الورق",
              de: "Papiergewicht",
              en: "Paper Weight",
            },
            options: paperWeightOptions,
            semanticGroup: "materials",
            allowsUnknown: true,
            aiHint: "Paper weight or GSM.",
          },
          {
            id: "designReady",
            type: "radio",
            label: {
              ar: "هل لديك تصميم جاهز؟",
              de: "Design vorhanden?",
              en: "Do You Have a Ready Design?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
            ],
            semanticGroup: "design",
            allowsUnknown: true,
            aiHint: "Whether artwork is ready.",
          },
          {
            id: "notes",
            type: "textarea",
            label: {
              ar: "تفاصيل إضافية",
              de: "Zusätzliche Details",
              en: "Additional Details",
            },
            placeholder: {
              ar: "اكتب أي معلومات تساعد على فهم الطلب بشكل أفضل",
              de: "Gib alle weiteren Informationen an, die beim Verständnis helfen",
              en: "Write any information that helps explain the request better",
            },
            semanticGroup: "notes",
            aiHint: "Additional request notes and clarification.",
          },
        ],
      },
    ],
    attachments: [
      {
        id: "open-printing-design-files",
        kind: "design-files",
        title: {
          ar: "ملفات تصميم",
          de: "Designdateien",
          en: "Design Files",
        },
        description: {
          ar: "يمكنك رفع ملفات مثل PDF أو AI أو EPS لاحقًا.",
          de: "Du kannst später Dateien wie PDF, AI oder EPS hochladen.",
          en: "You can upload files such as PDF, AI, or EPS later.",
        },
        required: false,
        multiple: true,
      },
      {
        id: "open-printing-reference-images",
        kind: "reference-images",
        title: {
          ar: "صور أو أمثلة مرجعية",
          de: "Referenzbilder oder Beispiele",
          en: "Reference Images or Examples",
        },
        required: false,
        multiple: true,
      },
    ],
  },

  {
    id: "business-cards",
    category: "printing",
    title: {
      ar: "بطاقات الأعمال",
      de: "Visitenkarten",
      en: "Business Cards",
    },
    description: {
      ar: "طلبات بطاقات الأعمال بمقاسات وخامات وتشطيبات مختلفة للشركات والأفراد.",
      de: "Anfragen für Visitenkarten in verschiedenen Formaten, Materialien und Veredelungen für Unternehmen und Einzelpersonen.",
      en: "Requests for business cards in different sizes, materials, and finishes for businesses and individuals.",
    },
    intro: {
      ar: "هذا النموذج مخصص لبطاقات الأعمال. يمكنك تحديد المقاس القياسي، نوع الورق، الغراماج، عدد الأوجه، التشطيب، والكمية، سواء كان لديك تصميم جاهز أو تحتاج إلى تنظيم الفكرة أولًا.",
      de: "Dieses Formular ist für Visitenkarten gedacht. Du kannst Standardformat, Papier, Grammatur, Druckseiten, Veredelung und Menge angeben – egal, ob bereits ein Design vorhanden ist oder die Idee erst noch strukturiert werden soll.",
      en: "This form is for business cards. You can specify standard size, paper type, GSM, sides, finishing, and quantity, whether you already have a design or still need help structuring the idea.",
    },
    requestGuidance: [
      {
        ar: "إذا لم تكن تعرف المقاس أو الغراماج أو نوع التشطيب، يمكنك اختيار الخيار الأقرب أو تركه غير محدد وسنقترح المناسب.",
        de: "Wenn du Format, Grammatur oder Veredelung nicht genau kennst, kannst du die nächstliegende Option wählen oder es offen lassen – wir schlagen dir etwas Passendes vor.",
        en: "If you are not sure about the size, GSM, or finishing, choose the closest option or leave it open and we will suggest a suitable one.",
      },
      {
        ar: "إذا كان لديك شعار أو ملف تصميم جاهز فهذا يساعد على تسريع العمل والتسعير.",
        de: "Ein vorhandenes Logo oder Design beschleunigt Bearbeitung und Kalkulation.",
        en: "Having a logo or ready design helps speed up the process and quotation.",
      },
    ],
    seo: {
      slug: "business-cards",
      categorySlug: "printing",
      metaTitle: {
        ar: "بطاقات الأعمال في برلين | طلب طباعة بطاقات احترافية",
        de: "Visitenkarten in Berlin | Professionelle Karten drucken lassen",
        en: "Business Cards in Berlin | Professional Card Printing",
      },
      metaDescription: {
        ar: "نموذج طلب بطاقات أعمال احترافية في برلين بمقاسات وخامات وتشطيبات مختلفة.",
        de: "Professionelles Anfrageformular für Visitenkarten in Berlin mit verschiedenen Formaten, Papieren und Veredelungen.",
        en: "Professional request form for business cards in Berlin with different sizes, papers, and finishes.",
      },
    },
    aiSummaryHint:
      "Summarize the business card request with standard size, quantity, paper stock, color mode, sides, finishing, design status, and delivery preference.",
    sections: [
      createContactSection(),
      {
        id: "product-basics",
        title: {
          ar: "تفاصيل البطاقة",
          de: "Kartendetails",
          en: "Card Details",
        },
        description: {
          ar: "حدد المقاس القياسي والكمية والاتجاه الأساسي.",
          de: "Gib Standardformat, Menge und grundlegende Ausrichtung an.",
          en: "Define the standard size, quantity, and basic orientation.",
        },
        fields: [
          {
            id: "size",
            type: "select",
            label: {
              ar: "مقاس البطاقة",
              de: "Kartenformat",
              en: "Card Size",
            },
            options: businessCardSizeOptions,
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Business card standard size.",
          },
          {
            id: "orientation",
            type: "radio",
            label: {
              ar: "اتجاه البطاقة",
              de: "Ausrichtung",
              en: "Orientation",
            },
            options: [
              { value: "landscape", label: { ar: "أفقي", de: "Querformat", en: "Landscape" } },
              { value: "portrait", label: { ar: "عمودي", de: "Hochformat", en: "Portrait" } },
            ],
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Card orientation.",
          },
          {
            id: "quantity",
            type: "select",
            label: {
              ar: "الكمية",
              de: "Menge",
              en: "Quantity",
            },
            options: quantityOptions,
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Requested quantity.",
          },
        ],
      },
      {
        id: "paper-finishing",
        title: {
          ar: "الورق والتشطيب",
          de: "Papier und Veredelung",
          en: "Paper and Finishing",
        },
        description: {
          ar: "اختر نوع الورق والغراماج والطباعة والتشطيب المناسب.",
          de: "Wähle Papier, Grammatur, Druckart und passende Veredelung.",
          en: "Choose the paper, GSM, print type, and finishing.",
        },
        fields: [
          {
            id: "paperType",
            type: "select",
            label: {
              ar: "نوع الورق",
              de: "Papiersorte",
              en: "Paper Type",
            },
            options: commonPaperTypeOptions,
            semanticGroup: "materials",
            allowsUnknown: true,
            aiHint: "Paper type preference.",
          },
          {
            id: "paperWeight",
            type: "select",
            label: {
              ar: "غراماج الورق",
              de: "Papiergewicht",
              en: "Paper Weight",
            },
            options: paperWeightOptions,
            semanticGroup: "materials",
            allowsUnknown: true,
            aiHint: "Paper weight or GSM.",
          },
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
            aiHint: "Print color mode.",
          },
          {
            id: "printSides",
            type: "radio",
            label: {
              ar: "عدد الأوجه المطبوعة",
              de: "Druckseiten",
              en: "Print Sides",
            },
            options: [
              { value: "single", label: { ar: "وجه واحد", de: "Einseitig", en: "Single-sided" } },
              { value: "double", label: { ar: "وجهان", de: "Doppelseitig", en: "Double-sided" } },
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
            options: businessCardFinishingOptions,
            semanticGroup: "production",
            allowsUnknown: true,
            aiHint: "Business card finishing requirements.",
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
            aiHint: "Whether business card artwork is ready.",
          },
        ],
      },
      {
        id: "delivery",
        title: {
          ar: "التسليم والملاحظات",
          de: "Lieferung und Hinweise",
          en: "Delivery and Notes",
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
            allowsUnknown: true,
            aiHint: "Delivery or pickup preference.",
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
              ar: "مثال: خلال 3 أيام",
              de: "Beispiel: in 3 Tagen",
              en: "Example: within 3 days",
            },
            semanticGroup: "delivery",
            allowsUnknown: true,
            aiHint: "Requested delivery timing.",
          },
          {
            id: "notes",
            type: "textarea",
            label: {
              ar: "ملاحظات إضافية",
              de: "Zusätzliche Details",
              en: "Additional Details",
            },
            placeholder: {
              ar: "أي ملاحظات مهمة عن البطاقة أو الطباعة",
              de: "Weitere wichtige Hinweise zur Karte oder zum Druck",
              en: "Any important notes about the card or printing",
            },
            semanticGroup: "notes",
            aiHint: "Additional notes for business card order.",
          },
        ],
      },
    ],
    attachments: [
      {
        id: "business-card-design-files",
        kind: "design-files",
        title: {
          ar: "ملفات التصميم",
          de: "Designdateien",
          en: "Design Files",
        },
        description: {
          ar: "يمكن رفع ملفات مثل PDF أو AI أو EPS لاحقًا.",
          de: "Dateien wie PDF, AI oder EPS können später hochgeladen werden.",
          en: "Files such as PDF, AI, or EPS can be uploaded later.",
        },
        required: false,
        multiple: true,
      },
      {
        id: "business-card-reference-images",
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

  createStandardPrintService({
    id: "flyers",
    title: {
      ar: "فلايرات",
      de: "Flyer",
      en: "Flyers",
    },
    description: {
      ar: "طلبات طباعة فلايرات دعائية وإعلانية بمقاسات وخيارات ورق مختلفة.",
      de: "Anfragen für Werbe- und Promotion-Flyer in verschiedenen Formaten und Papieroptionen.",
      en: "Requests for promotional and advertising flyers in different sizes and paper options.",
    },
    intro: {
      ar: "هذه الخدمة مخصصة لطباعة الفلايرات الإعلانية، منشورات الافتتاح، العروض، الحملات المحلية، والتوزيع المباشر. يمكنك تحديد المقاس والكمية ونوع الورق والتشطيب حتى لو لم تكن متأكدًا من جميع التفاصيل.",
      de: "Dieser Service ist für Werbeflyer, Eröffnungsflyer, Angebotsflyer, lokale Kampagnen und Direktverteilung gedacht. Du kannst Format, Menge, Papier und Veredelung angeben, auch wenn noch nicht alle Details feststehen.",
      en: "This service is for advertising flyers, opening flyers, promotional handouts, local campaigns, and direct distribution. You can define size, quantity, paper, and finishing even if you are not yet sure about every detail.",
    },
    requestGuidance: [
      {
        ar: "الفلايرات عادة تحتاج مقاس واضح وكمية دقيقة لأن ذلك يؤثر مباشرة على السعر.",
        de: "Bei Flyern beeinflussen Format und Menge den Preis direkt.",
        en: "For flyers, size and quantity directly affect pricing.",
      },
      {
        ar: "إذا كان الهدف توزيعًا محليًا أو حملة عروض، اذكر ذلك في الملاحظات لنقترح الأنسب.",
        de: "Wenn es um lokale Verteilung oder Angebotsaktionen geht, erwähne das bitte in den Notizen.",
        en: "If the purpose is local distribution or a promotional campaign, mention that in the notes so we can suggest the best option.",
      },
    ],
    seo: {
      slug: "flyers",
      categorySlug: "printing",
      metaTitle: {
        ar: "طباعة فلايرات في برلين | طلب فلاير احترافي",
        de: "Flyer drucken in Berlin | Professionelle Flyer anfragen",
        en: "Flyer Printing in Berlin | Professional Flyer Request",
      },
      metaDescription: {
        ar: "اطلب طباعة فلايرات احترافية في برلين بمقاسات وخيارات ورق وتشطيبات متعددة.",
        de: "Professionelle Flyer in Berlin drucken lassen – mit verschiedenen Formaten, Papieren und Veredelungen.",
        en: "Order professional flyer printing in Berlin with multiple size, paper, and finishing options.",
      },
    },
    aiSummaryHint:
      "Summarize the flyer request with quantity, size, paper type, GSM, print colors, finishing, design status, deadline, and intended campaign use.",
    sizeOptions: flyerSizeOptions,
    finishingOptions: flyerFinishingOptions,
    notesPlaceholder: {
      ar: "اكتب أي تفاصيل إضافية عن الحملة أو الاستخدام أو نوع التوزيع",
      de: "Gib zusätzliche Details zur Kampagne, Nutzung oder Verteilung an",
      en: "Write any extra details about the campaign, usage, or distribution type",
    },
  }),

  createStandardPrintService({
    id: "menus",
    title: {
      ar: "منيوهات",
      de: "Speisekarten",
      en: "Menus",
    },
    description: {
      ar: "طلبات طباعة المنيوهات للمطاعم والمقاهي مع خيارات ورق وتشطيب مناسبة للاستخدام اليومي.",
      de: "Anfragen für Speisekarten für Restaurants und Cafés mit passenden Papier- und Veredelungsoptionen für den täglichen Einsatz.",
      en: "Requests for menu printing for restaurants and cafés with suitable paper and finishing options for everyday use.",
    },
    intro: {
      ar: "هذه الخدمة مخصصة لطباعة المنيوهات الورقية أو القابلة للطي أو المنيوهات المؤقتة والعروض الموسمية. إذا كان لديك منيو مطعم أو مقهى أو قائمة مشروبات، يمكنك البدء من هنا.",
      de: "Dieser Service ist für gedruckte Speisekarten, faltbare Menüs, temporäre Menüs und saisonale Angebotskarten gedacht. Wenn du ein Restaurant-, Café- oder Getränkemenü brauchst, kannst du hier starten.",
      en: "This service is for printed menus, foldable menus, temporary menus, and seasonal promotional menus. If you need a restaurant, café, or drinks menu, you can start here.",
    },
    requestGuidance: [
      {
        ar: "إذا كانت المنيوهات للاستخدام المتكرر، اختر تشطيبًا مناسبًا مثل التغليف أو الورق الأقوى.",
        de: "Wenn das Menü regelmäßig genutzt wird, ist eine stärkere Veredelung oder robusteres Papier sinnvoll.",
        en: "If the menu will be used repeatedly, choose a stronger paper or finishing like lamination.",
      },
      {
        ar: "اذكر إن كانت القائمة ثابتة أو موسمية أو مؤقتة لأن ذلك يؤثر على نوع التنفيذ المناسب.",
        de: "Bitte gib an, ob die Karte dauerhaft, saisonal oder temporär ist, da dies die passende Produktion beeinflusst.",
        en: "Mention whether the menu is permanent, seasonal, or temporary, because that affects the best production approach.",
      },
    ],
    seo: {
      slug: "menus",
      categorySlug: "printing",
      metaTitle: {
        ar: "طباعة منيوهات في برلين | منيوهات للمطاعم والمقاهي",
        de: "Speisekarten drucken in Berlin | Menüs für Restaurants und Cafés",
        en: "Menu Printing in Berlin | Menus for Restaurants and Cafés",
      },
      metaDescription: {
        ar: "اطلب طباعة منيوهات احترافية في برلين للمطاعم والمقاهي مع خيارات ورق وتشطيب متعددة.",
        de: "Professionelle Speisekarten in Berlin drucken lassen – für Restaurants, Cafés und Bars mit verschiedenen Papier- und Veredelungsoptionen.",
        en: "Order professional menu printing in Berlin for restaurants, cafés, and bars with various paper and finishing options.",
      },
    },
    aiSummaryHint:
      "Summarize the menu request with quantity, size, page count, paper type, GSM, print colors, finishing, design status, deadline, and menu usage type.",
    sizeOptions: menuSizeOptions,
    pageOptions: menuPageOptions,
    finishingOptions: menuFinishingOptions,
    notesPlaceholder: {
      ar: "اذكر إن كان المنيو دائمًا أو موسميًا أو للاستخدام اليومي المكثف",
      de: "Bitte gib an, ob das Menü dauerhaft, saisonal oder für intensive tägliche Nutzung gedacht ist",
      en: "Mention whether the menu is permanent, seasonal, or intended for heavy daily use",
    },
  }),

  createStandardPrintService({
    id: "brochures",
    title: {
      ar: "بروشورات",
      de: "Broschüren",
      en: "Brochures",
    },
    description: {
      ar: "طلبات طباعة البروشورات التعريفية والإعلانية للشركات والخدمات والمنتجات.",
      de: "Anfragen für Image-, Produkt- und Werbebroschüren für Unternehmen, Dienstleistungen und Produkte.",
      en: "Requests for company, product, and promotional brochures.",
    },
    intro: {
      ar: "هذه الخدمة مخصصة للبروشورات التعريفية والتسويقية، سواء للتعريف بالشركة أو بالخدمات أو بالمنتجات. يمكنك تحديد عدد الصفحات والمقاس ونوع الورق والتشطيب المطلوب.",
      de: "Dieser Service ist für Image- und Werbebroschüren gedacht – zur Vorstellung eines Unternehmens, von Dienstleistungen oder Produkten. Du kannst Seitenzahl, Format, Papier und Veredelung angeben.",
      en: "This service is for informational and promotional brochures used to present a company, services, or products. You can specify page count, size, paper, and finishing.",
    },
    requestGuidance: [
      {
        ar: "كلما كان عدد الصفحات واضحًا من البداية، كان تسعير البروشور أدق وأسهل.",
        de: "Je klarer die Seitenzahl von Anfang an ist, desto präziser wird die Kalkulation.",
        en: "The clearer the page count is from the start, the more accurate the quotation will be.",
      },
      {
        ar: "إذا كان لديك محتوى كثير أو صور كثيرة، اذكر ذلك في الملاحظات لأن ذلك يساعد على اختيار المقاس والتجليد المناسب.",
        de: "Wenn du viel Inhalt oder viele Bilder hast, erwähne das bitte in den Notizen – das hilft bei Format- und Bindungsempfehlungen.",
        en: "If you have a lot of content or many images, mention that in the notes because it helps determine the right size and binding.",
      },
    ],
    seo: {
      slug: "brochures",
      categorySlug: "printing",
      metaTitle: {
        ar: "طباعة بروشورات في برلين | بروشورات تعريفية وإعلانية",
        de: "Broschüren drucken in Berlin | Image- und Werbebroschüren",
        en: "Brochure Printing in Berlin | Promotional & Company Brochures",
      },
      metaDescription: {
        ar: "اطلب طباعة بروشورات احترافية في برلين للشركات والخدمات والمنتجات مع خيارات مقاس وورق وتشطيب متعددة.",
        de: "Professionelle Broschüren in Berlin drucken lassen – für Unternehmen, Produkte und Dienstleistungen mit vielen Papier- und Veredelungsoptionen.",
        en: "Order professional brochure printing in Berlin for companies, products, and services with multiple size, paper, and finishing options.",
      },
    },
    aiSummaryHint:
      "Summarize the brochure request with quantity, size, page count, paper type, GSM, print colors, finishing, design status, deadline, and brochure purpose.",
    sizeOptions: brochureSizeOptions,
    pageOptions: pageCountOptions,
    finishingOptions: brochureFinishingOptions,
    notesPlaceholder: {
      ar: "اذكر إن كان البروشور تعريفيًا أو بيعيًا وما إذا كان يحتوي على محتوى أو صور كثيرة",
      de: "Bitte gib an, ob die Broschüre informativ oder verkaufsorientiert ist und ob sie viel Inhalt oder viele Bilder enthält",
      en: "Mention whether the brochure is informational or sales-oriented and whether it includes a lot of content or many images",
    },
  }),

  createStandardPrintService({
    id: "posters",
    title: {
      ar: "بوسترات",
      de: "Poster",
      en: "Posters",
    },
    description: {
      ar: "طلبات طباعة البوسترات الدعائية والإعلانية والمعلوماتية بمقاسات متنوعة.",
      de: "Anfragen für Werbe-, Informations- und Aktionsposter in verschiedenen Formaten.",
      en: "Requests for promotional, advertising, and informational posters in various sizes.",
    },
    intro: {
      ar: "هذه الخدمة مخصصة لطباعة البوسترات الخاصة بالإعلانات، الفعاليات، العروض، الحملات، والإعلانات الداخلية والخارجية الخفيفة. يمكنك اختيار المقاس ونوع الورق والكمية وذكر مكان الاستخدام.",
      de: "Dieser Service ist für Poster zu Werbung, Events, Angeboten, Kampagnen sowie für den Innenbereich und leichte Außennutzung gedacht. Du kannst Format, Papier, Menge und Einsatzort angeben.",
      en: "This service is for posters used in advertising, events, promotions, campaigns, and light indoor or outdoor display. You can choose size, paper, quantity, and intended placement.",
    },
    requestGuidance: [
      {
        ar: "اذكر إن كان البوستر سيستخدم داخل المكان أو في الواجهة لأن ذلك يساعد في اختيار الورق والتشطيب المناسب.",
        de: "Bitte gib an, ob das Poster innen oder im Schaufenster eingesetzt wird – das beeinflusst Papier und Veredelung.",
        en: "Mention whether the poster will be used indoors or in a shopfront, because that affects the right paper and finishing.",
      },
      {
        ar: "إذا كنت تحتاج حملة متعددة المقاسات أو نسخًا مختلفة، اكتب ذلك في الملاحظات.",
        de: "Wenn du mehrere Größen oder unterschiedliche Versionen brauchst, vermerke das bitte in den Notizen.",
        en: "If you need multiple sizes or different versions, mention that in the notes.",
      },
    ],
    seo: {
      slug: "posters",
      categorySlug: "printing",
      metaTitle: {
        ar: "طباعة بوسترات في برلين | بوسترات إعلانية واحترافية",
        de: "Poster drucken in Berlin | Werbe- und Aktionsposter",
        en: "Poster Printing in Berlin | Advertising & Promotional Posters",
      },
      metaDescription: {
        ar: "اطلب طباعة بوسترات احترافية في برلين بمقاسات وخيارات ورق مختلفة للإعلانات والعروض والفعاليات.",
        de: "Professionelle Poster in Berlin drucken lassen – für Werbung, Aktionen und Veranstaltungen in verschiedenen Formaten und Papierarten.",
        en: "Order professional poster printing in Berlin with multiple size and paper options for promotions, events, and advertising.",
      },
    },
    aiSummaryHint:
      "Summarize the poster request with quantity, size, paper type, GSM, print colors, finishing, design status, deadline, and poster placement.",
    sizeOptions: posterSizeOptions,
    finishingOptions: posterFinishingOptions,
    notesPlaceholder: {
      ar: "اذكر مكان استخدام البوستر وهل تحتاج أكثر من مقاس أو نسخة",
      de: "Bitte gib an, wo das Poster eingesetzt wird und ob du mehrere Größen oder Versionen brauchst",
      en: "Mention where the poster will be used and whether you need more than one size or version",
    },
  }),

  createStandardPrintService({
    id: "catalogs-booklets",
    title: {
      ar: "كتالوجات وكتيبات",
      de: "Kataloge & Booklets",
      en: "Catalogs & Booklets",
    },
    description: {
      ar: "طلبات طباعة الكتالوجات والكتيبات التعريفية أو البيعية بعدد صفحات وخيارات تنفيذ مختلفة.",
      de: "Anfragen für Kataloge und Booklets mit unterschiedlichen Seitenzahlen und Produktionsoptionen.",
      en: "Requests for catalogs and booklets with different page counts and production options.",
    },
    intro: {
      ar: "هذه الخدمة مخصصة للكتالوجات والكتيبات متعددة الصفحات، سواء للتعريف بالمنتجات أو الخدمات أو لعرض تشكيلات كاملة. يمكنك تحديد عدد الصفحات والمقاس والتجليد ونوع الورق والتشطيب.",
      de: "Dieser Service ist für mehrseitige Kataloge und Booklets gedacht – zur Produktpräsentation, Serviceübersicht oder für komplette Kollektionen. Du kannst Seitenzahl, Format, Bindung, Papier und Veredelung angeben.",
      en: "This service is for multi-page catalogs and booklets used to present products, services, or complete collections. You can specify page count, size, binding, paper, and finishing.",
    },
    requestGuidance: [
      {
        ar: "في الكتالوجات والكتيبات، عدد الصفحات ونوع التجليد عنصران أساسيان جدًا في التسعير والتنفيذ.",
        de: "Bei Katalogen und Booklets sind Seitenzahl und Bindung entscheidend für Preis und Produktion.",
        en: "For catalogs and booklets, page count and binding are key factors for pricing and production.",
      },
      {
        ar: "إذا كنت تريد شكلاً فاخرًا أو كتالوج مبيعات، اذكر ذلك لنقترح نوع الورق والتشطيب الأنسب.",
        de: "Wenn du eine hochwertige Präsentation oder einen Verkaufskatalog möchtest, erwähne das bitte, damit wir Papier und Veredelung passend empfehlen können.",
        en: "If you want a premium look or a sales catalog, mention it so we can suggest the best paper and finishing.",
      },
    ],
    seo: {
      slug: "catalogs-booklets",
      categorySlug: "printing",
      metaTitle: {
        ar: "طباعة كتالوجات وكتيبات في برلين | كتالوج احترافي متعدد الصفحات",
        de: "Kataloge und Booklets drucken in Berlin | Mehrseitige Drucksachen",
        en: "Catalog & Booklet Printing in Berlin | Multi-Page Print Products",
      },
      metaDescription: {
        ar: "اطلب طباعة كتالوجات وكتيبات احترافية في برلين بعدد صفحات وخيارات ورق وتجليد وتشطيب متعددة.",
        de: "Professionelle Kataloge und Booklets in Berlin drucken lassen – mit vielen Optionen für Seitenzahl, Papier, Bindung und Veredelung.",
        en: "Order professional catalog and booklet printing in Berlin with multiple options for page count, paper, binding, and finishing.",
      },
    },
    aiSummaryHint:
      "Summarize the catalog or booklet request with quantity, size, page count, paper type, GSM, print colors, finishing, binding style, design status, and deadline.",
    sizeOptions: catalogSizeOptions,
    pageOptions: pageCountOptions,
    finishingOptions: catalogFinishingOptions,
    notesPlaceholder: {
      ar: "اذكر نوع المحتوى وعدد الصفحات التقريبي وهل تحتاج مظهرًا فاخرًا أو كتالوج بيع",
      de: "Bitte gib die Art des Inhalts, die ungefähre Seitenzahl und an, ob du eine hochwertige Präsentation oder einen Verkaufskatalog brauchst",
      en: "Mention the content type, approximate page count, and whether you need a premium presentation or sales catalog",
    },
  }),

  {
    id: "folders-presentation-materials",
    category: "printing",
    title: {
      ar: "ملفات الشركات والمطبوعات التعريفية",
      de: "Präsentationsmappen & Unternehmensdrucksachen",
      en: "Presentation Folders & Company Print Materials",
    },
    description: {
      ar: "طلبات ملفات الشركات والمطبوعات التعريفية المستخدمة في الاجتماعات والعروض والتقديمات الرسمية.",
      de: "Anfragen für Präsentationsmappen und Unternehmensdrucksachen für Meetings, Angebote und offizielle Präsentationen.",
      en: "Requests for presentation folders and company print materials used in meetings, offers, and official presentations.",
    },
    intro: {
      ar: "هذه الخدمة مخصصة لملفات الشركات، المجلدات التعريفية، المطبوعات الخاصة بالعروض الرسمية، وأي مواد مطبوعة تستخدم لتقديم الشركة أو الملفات التجارية بشكل منظم واحترافي.",
      de: "Dieser Service ist für Präsentationsmappen, Unternehmensmappen, Angebotsunterlagen und andere Drucksachen gedacht, die zur professionellen Darstellung eines Unternehmens oder Angebots eingesetzt werden.",
      en: "This service is for presentation folders, company folders, proposal materials, and other print products used to present a business or offer in a professional way.",
    },
    requestGuidance: [
      {
        ar: "إذا كنت تحتاج جيب داخلي أو مكانًا لبطاقة أعمال أو أوراق إدخال، اذكر ذلك في الملاحظات.",
        de: "Wenn du eine Innentasche, einen Visitenkartenschlitz oder Einlegeblätter brauchst, erwähne das bitte in den Notizen.",
        en: "If you need an inner pocket, a business card slot, or inserts, mention that in the notes.",
      },
      {
        ar: "هذا النوع من المطبوعات يرتبط غالبًا بالهوية البصرية، لذلك وجود الشعار أو الألوان المرجعية مهم جدًا.",
        de: "Diese Art von Drucksachen ist oft eng mit der Markenidentität verbunden, daher sind Logo und Farbvorgaben besonders wichtig.",
        en: "This type of print material is often closely tied to brand identity, so having the logo or brand colors is very important.",
      },
    ],
    seo: {
      slug: "folders-presentation-materials",
      categorySlug: "printing",
      metaTitle: {
        ar: "ملفات شركات ومطبوعات تعريفية في برلين | طباعة احترافية للشركات",
        de: "Präsentationsmappen drucken in Berlin | Unternehmensdrucksachen professionell",
        en: "Presentation Folder Printing in Berlin | Professional Company Print Materials",
      },
      metaDescription: {
        ar: "اطلب طباعة ملفات شركات ومطبوعات تعريفية احترافية في برلين للعروض والاجتماعات والمواد التجارية.",
        de: "Professionelle Präsentationsmappen und Unternehmensdrucksachen in Berlin drucken lassen – für Meetings, Angebote und Firmenunterlagen.",
        en: "Order professional presentation folders and company print materials in Berlin for meetings, proposals, and business presentations.",
      },
    },
    aiSummaryHint:
      "Summarize the presentation folder or company print material request with quantity, size, pocket requirement, card slot requirement, paper type, GSM, print colors, finishing, design status, and deadline.",
    sections: [
      createContactSection(),
      {
        id: "product-basics",
        title: {
          ar: "الطلب الأساسي",
          de: "Grunddaten der Anfrage",
          en: "Core Request Details",
        },
        description: {
          ar: "حدد الكمية والمقاس وموعد التنفيذ المطلوب.",
          de: "Gib Menge, Format und gewünschten Termin an.",
          en: "Define quantity, size, and requested deadline.",
        },
        fields: [
          {
            id: "quantity",
            type: "select",
            label: {
              ar: "الكمية",
              de: "Menge",
              en: "Quantity",
            },
            options: quantityOptions,
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Requested quantity.",
          },
          {
            id: "size",
            type: "select",
            label: {
              ar: "المقاس",
              de: "Format",
              en: "Size",
            },
            options: folderSizeOptions,
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Folder size.",
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
            aiHint: "Requested deadline.",
          },
        ],
      },
      {
        id: "structure-paper",
        title: {
          ar: "البنية والورق",
          de: "Aufbau und Papier",
          en: "Structure and Paper",
        },
        description: {
          ar: "حدد تفاصيل الجيب الداخلي، مكان بطاقة الأعمال، ونوع الورق.",
          de: "Lege Innentasche, Visitenkartenschlitz und Papierdetails fest.",
          en: "Define inner pocket, business card slot, and paper details.",
        },
        fields: [
          {
            id: "innerPocket",
            type: "radio",
            label: {
              ar: "هل تحتاج جيبًا داخليًا؟",
              de: "Wird eine Innentasche benötigt?",
              en: "Do You Need an Inner Pocket?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
            ],
            semanticGroup: "production",
            allowsUnknown: true,
            aiHint: "Whether an inner pocket is required.",
          },
          {
            id: "businessCardSlot",
            type: "radio",
            label: {
              ar: "هل تحتاج مكانًا لبطاقة أعمال؟",
              de: "Wird ein Visitenkartenschlitz benötigt?",
              en: "Do You Need a Business Card Slot?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
            ],
            semanticGroup: "production",
            allowsUnknown: true,
            aiHint: "Whether a business card slot is required.",
          },
          {
            id: "paperType",
            type: "select",
            label: {
              ar: "نوع الورق",
              de: "Papiersorte",
              en: "Paper Type",
            },
            options: commonPaperTypeOptions,
            semanticGroup: "materials",
            allowsUnknown: true,
            aiHint: "Paper type preference.",
          },
          {
            id: "paperWeight",
            type: "select",
            label: {
              ar: "غراماج الورق",
              de: "Papiergewicht",
              en: "Paper Weight",
            },
            options: paperWeightOptions,
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
          ar: "حدد ألوان الطباعة والتشطيب وحالة التصميم.",
          de: "Lege Druckfarben, Veredelung und Designstatus fest.",
          en: "Define print colors, finishing, and design status.",
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
            aiHint: "Print color mode.",
          },
          {
            id: "finishing",
            type: "checkbox",
            label: {
              ar: "التشطيب",
              de: "Veredelung",
              en: "Finishing",
            },
            options: folderFinishingOptions,
            semanticGroup: "production",
            allowsUnknown: true,
            aiHint: "Required finishing.",
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
            aiHint: "Whether design is ready.",
          },
          {
            id: "notes",
            type: "textarea",
            label: {
              ar: "ملاحظات إضافية",
              de: "Zusätzliche Details",
              en: "Additional Details",
            },
            placeholder: {
              ar: "اذكر إن كنت تحتاج جيوبًا خاصة أو أوراق إدخال أو متطلبات مرتبطة بهوية الشركة",
              de: "Bitte gib an, ob du spezielle Taschen, Einleger oder Anforderungen zur Markenidentität brauchst",
              en: "Mention if you need special pockets, inserts, or brand-related requirements",
            },
            semanticGroup: "notes",
            aiHint: "Additional notes for folder or company print material order.",
          },
        ],
      },
    ],
    attachments: createDesignAttachments("folders-presentation-materials"),
  },
];