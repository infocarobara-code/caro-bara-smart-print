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
  aiHint: "Optional email for follow-up and quotation delivery.",
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
  aiHint: "Main phone number for quick contact.",
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

export const signageServices: Service[] = [
  {
    id: "signage",
    category: "signage",
    title: {
      ar: "اللوحات والواجهات والإضاءات",
      de: "Schilder, Fassaden & Lichtwerbung",
      en: "Signage, Facades & Light Advertising",
    },
    description: {
      ar: "حلول اللوحات الخارجية والداخلية، الحروف البارزة، الإضاءات، والواجهات التجارية.",
      de: "Lösungen für Außen- und Innenschilder, Profilbuchstaben, Lichtwerbung und Geschäftsfassaden.",
      en: "Solutions for indoor and outdoor signs, raised letters, lighting, and business facades.",
    },
    intro: {
      ar: "هذا النموذج مخصص لطلبات اللوحات التجارية، الحروف البارزة، صناديق الإضاءة، والواجهات. كلما كانت المعلومات أوضح كان التقدير أدق والتنفيذ أسرع.",
      de: "Dieses Formular ist für Schilder, Profilbuchstaben, Leuchtkästen und Fassaden gedacht. Je klarer die Angaben, desto präziser das Angebot und desto schneller die Umsetzung.",
      en: "This form is for signage, raised letters, light boxes, and business facades. The clearer your information, the more accurate the quote and the faster the execution.",
    },
    requestGuidance: [
      {
        ar: "إذا كانت لديك صور للموقع أو الواجهة فمن الأفضل رفعها لاحقًا عند تفعيل الرفع.",
        de: "Wenn du Fotos vom Standort oder der Fassade hast, solltest du sie später nach Möglichkeit hochladen.",
        en: "If you have photos of the site or facade, it is better to upload them later when uploads are enabled.",
      },
      {
        ar: "إذا لم تكن متأكدًا من المادة أو نوع الإضاءة يمكنك تركها فارغة وسنقترح الأنسب.",
        de: "Wenn du dir bei Material oder Beleuchtung nicht sicher bist, kannst du die Felder offen lassen und wir schlagen das Passende vor.",
        en: "If you are unsure about material or lighting, you can leave those fields open and we will suggest the best option.",
      },
    ],
    seo: {
      slug: "signage-facades-light-advertising",
      categorySlug: "signage",
      metaTitle: {
        ar: "طلب لوحات وواجهات وإضاءات",
        de: "Anfrage für Schilder, Fassaden & Lichtwerbung",
        en: "Request Signage, Facades & Light Advertising",
      },
      metaDescription: {
        ar: "نموذج طلب احترافي للوحات الواجهات والحروف البارزة والإضاءات التجارية.",
        de: "Professionelles Anfrageformular für Fassadenschilder, Profilbuchstaben und Lichtwerbung.",
        en: "Professional request form for facade signs, raised letters, and illuminated advertising.",
      },
    },
    aiSummaryHint:
      "Summarize the signage request with type, size, material, lighting, installation needs, site conditions, and missing technical details.",
    sections: [
      createContactSection(),
      {
        id: "project-basics",
        title: {
          ar: "أساسيات المشروع",
          de: "Projektgrundlagen",
          en: "Project Basics",
        },
        description: {
          ar: "حدد طبيعة المشروع ونوع اللوحة أو العنصر المطلوب.",
          de: "Definiere die Art des Projekts und das gewünschte Schild bzw. Element.",
          en: "Define the project status and the type of sign or requested element.",
        },
        fields: [
          {
            id: "projectStage",
            type: "radio",
            label: {
              ar: "حالة المشروع",
              de: "Projektstatus",
              en: "Project Status",
            },
            options: [
              { value: "new", label: { ar: "افتتاح جديد", de: "Neueröffnung", en: "New Opening" } },
              { value: "renewal", label: { ar: "تجديد", de: "Relaunch", en: "Renewal" } },
              { value: "existing", label: { ar: "قائم", de: "Bestehend", en: "Existing" } },
            ],
            semanticGroup: "project",
            allowsUnknown: true,
            aiHint: "Helps understand whether the request is for a new opening, relaunch, or existing business.",
          },
          {
            id: "signType",
            type: "select",
            label: {
              ar: "نوع اللوحة أو العنصر",
              de: "Art des Schildes oder Elements",
              en: "Type of Sign or Element",
            },
            required: false,
            options: [
              { value: "standard-sign", label: { ar: "لوحة عادية", de: "Normales Schild", en: "Standard Sign" } },
              { value: "lightbox", label: { ar: "صندوق ضوئي", de: "Lichtkasten", en: "Light Box" } },
              { value: "3d-letters", label: { ar: "حروف بارزة", de: "3D-Buchstaben", en: "3D Letters" } },
              { value: "illuminated-letters", label: { ar: "حروف مضيئة", de: "Leuchtbuchstaben", en: "Illuminated Letters" } },
              { value: "window-sign", label: { ar: "واجهة زجاجية", de: "Schaufenstergrafik", en: "Window Sign" } },
              { value: "indoor-sign", label: { ar: "لوحة داخلية", de: "Innenschild", en: "Indoor Sign" } },
              { value: "banner", label: { ar: "بنر", de: "Banner", en: "Banner" } },
            ],
            semanticGroup: "project",
            allowsUnknown: true,
            aiHint: "Primary signage category for routing and quotation.",
          },
          {
            id: "usagePlace",
            type: "radio",
            label: {
              ar: "مكان الاستخدام",
              de: "Einsatzort",
              en: "Usage Location",
            },
            required: false,
            options: [
              { value: "indoor", label: { ar: "داخلي", de: "Innenbereich", en: "Indoor" } },
              { value: "outdoor", label: { ar: "خارجي", de: "Außenbereich", en: "Outdoor" } },
            ],
            semanticGroup: "project",
            allowsUnknown: true,
            aiHint: "Determines exposure, durability, and material recommendations.",
          },
        ],
      },
      {
        id: "dimensions",
        title: {
          ar: "المقاسات والأبعاد",
          de: "Maße und Abmessungen",
          en: "Sizes and Dimensions",
        },
        description: {
          ar: "أدخل المقاسات الأساسية المطلوبة، ويمكنك ترك ما لا تعرفه.",
          de: "Gib die wichtigsten Maße ein. Unbekannte Angaben können offen bleiben.",
          en: "Enter the main dimensions. You can leave unknown values empty.",
        },
        fields: [
          {
            id: "width",
            type: "number",
            label: {
              ar: "العرض (سم)",
              de: "Breite (cm)",
              en: "Width (cm)",
            },
            placeholder: {
              ar: "مثال: 200",
              de: "Beispiel: 200",
              en: "Example: 200",
            },
            required: false,
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Primary sign width in centimeters.",
          },
          {
            id: "height",
            type: "number",
            label: {
              ar: "الارتفاع (سم)",
              de: "Höhe (cm)",
              en: "Height (cm)",
            },
            placeholder: {
              ar: "مثال: 80",
              de: "Beispiel: 80",
              en: "Example: 80",
            },
            required: false,
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Primary sign height in centimeters.",
          },
          {
            id: "depth",
            type: "text",
            label: {
              ar: "العمق أو البروز",
              de: "Tiefe oder Aufbau",
              en: "Depth or Projection",
            },
            placeholder: {
              ar: "مثال: 5 سم",
              de: "Beispiel: 5 cm",
              en: "Example: 5 cm",
            },
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Depth, stand-off, or projection from wall.",
          },
          {
            id: "thickness",
            type: "text",
            label: {
              ar: "السماكة",
              de: "Stärke",
              en: "Thickness",
            },
            placeholder: {
              ar: "مثال: 3 مم أو 10 مم",
              de: "Beispiel: 3 mm oder 10 mm",
              en: "Example: 3 mm or 10 mm",
            },
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Material thickness if known.",
          },
        ],
      },
      {
        id: "materials-lighting",
        title: {
          ar: "المواد والإضاءة",
          de: "Materialien und Beleuchtung",
          en: "Materials and Lighting",
        },
        description: {
          ar: "اختر المادة والتشطيب والإضاءة إذا كانت لديك فكرة واضحة.",
          de: "Wähle Material, Oberfläche und Beleuchtung, wenn du bereits eine Vorstellung hast.",
          en: "Choose material, finish, and lighting if you already have a clear idea.",
        },
        fields: [
          {
            id: "material",
            type: "select",
            label: {
              ar: "نوع المادة",
              de: "Materialart",
              en: "Material Type",
            },
            options: [
              { value: "dibond", label: { ar: "ديبوند", de: "Dibond", en: "Dibond" } },
              { value: "acrylic", label: { ar: "أكريليك", de: "Acryl", en: "Acrylic" } },
              { value: "pvc", label: { ar: "PVC", de: "PVC", en: "PVC" } },
              { value: "banner", label: { ar: "بنر", de: "Banner", en: "Banner" } },
              { value: "metal", label: { ar: "معدن", de: "Metall", en: "Metal" } },
              { value: "wood", label: { ar: "خشب", de: "Holz", en: "Wood" } },
              { value: "not-sure", label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" } },
            ],
            semanticGroup: "materials",
            allowsUnknown: true,
            aiHint: "Requested or preferred material.",
          },
          {
            id: "surfaceFinish",
            type: "select",
            label: {
              ar: "تشطيب السطح",
              de: "Oberflächenfinish",
              en: "Surface Finish",
            },
            options: [
              { value: "matte", label: { ar: "مطفي", de: "Matt", en: "Matte" } },
              { value: "glossy", label: { ar: "لامع", de: "Glänzend", en: "Glossy" } },
              { value: "brushed", label: { ar: "معدني فرش", de: "Gebürstet", en: "Brushed" } },
              { value: "not-sure", label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" } },
            ],
            semanticGroup: "materials",
            allowsUnknown: true,
            aiHint: "Preferred visual finish.",
          },
          {
            id: "lighting",
            type: "radio",
            label: {
              ar: "هل تحتاج إضاءة؟",
              de: "Beleuchtung benötigt?",
              en: "Need Lighting?",
            },
            required: false,
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
            ],
            semanticGroup: "production",
            allowsUnknown: true,
            aiHint: "Whether illuminated production is needed.",
          },
          {
            id: "lightType",
            type: "select",
            label: {
              ar: "نوع الإضاءة",
              de: "Art der Beleuchtung",
              en: "Light Type",
            },
            options: [
              { value: "front-lit", label: { ar: "إضاءة أمامية", de: "Frontbeleuchtet", en: "Front Lit" } },
              { value: "back-lit", label: { ar: "إضاءة خلفية", de: "Rückleuchtend", en: "Back Lit" } },
              { value: "edge-lit", label: { ar: "إضاءة جانبية", de: "Kantenbeleuchtung", en: "Edge Lit" } },
              { value: "not-sure", label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" } },
            ],
            semanticGroup: "production",
            allowsUnknown: true,
            aiHint: "Type of illumination if lighting is required.",
          },
          {
            id: "lightColor",
            type: "select",
            label: {
              ar: "لون الإضاءة",
              de: "Lichtfarbe",
              en: "Light Color",
            },
            options: [
              { value: "warm-white", label: { ar: "أبيض دافئ", de: "Warmweiß", en: "Warm White" } },
              { value: "cool-white", label: { ar: "أبيض بارد", de: "Kaltweiß", en: "Cool White" } },
              { value: "neutral-white", label: { ar: "أبيض طبيعي", de: "Neutralweiß", en: "Neutral White" } },
              { value: "rgb", label: { ar: "ملون RGB", de: "RGB", en: "RGB" } },
              { value: "not-sure", label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" } },
            ],
            semanticGroup: "production",
            allowsUnknown: true,
            aiHint: "Lighting color preference.",
          },
          {
            id: "powerAccess",
            type: "radio",
            label: {
              ar: "هل يوجد مصدر كهرباء قريب؟",
              de: "Gibt es einen Stromanschluss in der Nähe?",
              en: "Is there nearby power access?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
              { value: "not-sure", label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" } },
            ],
            semanticGroup: "installation",
            allowsUnknown: true,
            aiHint: "Important for installation and electrical scope.",
          },
          {
            id: "protection",
            type: "checkbox",
            label: {
              ar: "الحماية المطلوبة",
              de: "Benötigter Schutz",
              en: "Required Protection",
            },
            options: [
              { value: "uv", label: { ar: "حماية UV", de: "UV-Schutz", en: "UV Protection" } },
              { value: "weather", label: { ar: "مقاومة طقس", de: "Wetterbeständig", en: "Weather Resistant" } },
              { value: "scratch", label: { ar: "مقاومة خدش", de: "Kratzschutz", en: "Scratch Protection" } },
              { value: "none", label: { ar: "لا شيء", de: "Keine", en: "None" } },
            ],
            semanticGroup: "materials",
            allowsUnknown: true,
            aiHint: "Protection requirements for durability.",
          },
        ],
      },
      {
        id: "execution-logistics",
        title: {
          ar: "التنفيذ واللوجستيات",
          de: "Umsetzung und Logistik",
          en: "Execution and Logistics",
        },
        description: {
          ar: "معلومات تساعدنا على فهم ما إذا كان الطلب يحتاج تركيبًا أو شحنًا أو زيارة موقع.",
          de: "Diese Angaben helfen zu verstehen, ob Montage, Versand oder ein Vor-Ort-Termin nötig sind.",
          en: "These details help us understand whether installation, shipping, or a site visit is needed.",
        },
        fields: [
          {
            id: "installation",
            type: "radio",
            label: {
              ar: "هل تحتاج تركيب؟",
              de: "Montage benötigt?",
              en: "Need Installation?",
            },
            required: false,
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
            ],
            semanticGroup: "installation",
            allowsUnknown: true,
            aiHint: "Whether on-site installation is required.",
          },
          {
            id: "shipping",
            type: "radio",
            label: {
              ar: "هل تحتاج شحن؟",
              de: "Versand benötigt?",
              en: "Need Shipping?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
            ],
            semanticGroup: "delivery",
            allowsUnknown: true,
            aiHint: "Whether delivery or shipment is required.",
          },
          {
            id: "siteVisit",
            type: "radio",
            label: {
              ar: "هل تحتاج قياسًا موقعيًا؟",
              de: "Vor-Ort-Aufmaß benötigt?",
              en: "Need Site Measurement?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
            ],
            semanticGroup: "installation",
            allowsUnknown: true,
            aiHint: "Whether a site survey or measurement appointment is required.",
          },
          {
            id: "photosAvailable",
            type: "radio",
            label: {
              ar: "هل لديك صور للموقع أو الواجهة؟",
              de: "Hast du Fotos vom Standort oder der Fassade?",
              en: "Do you have site or facade photos?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
            ],
            semanticGroup: "attachments",
            allowsUnknown: true,
            aiHint: "Indicates whether visual references may be available.",
          },
          {
            id: "designReady",
            type: "radio",
            label: {
              ar: "هل لديك تصميم جاهز؟",
              de: "Design bereits vorhanden?",
              en: "Do You Have a Ready Design?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
            ],
            semanticGroup: "design",
            allowsUnknown: true,
            aiHint: "Whether the customer already has ready artwork.",
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
        description: {
          ar: "اكتب أي تفاصيل بصرية أو فنية أو تنفيذية تراها مهمة.",
          de: "Beschreibe alle visuellen, technischen oder produktionstechnischen Hinweise, die wichtig sind.",
          en: "Write any visual, technical, or execution details that may be important.",
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
              ar: "اكتب الألوان، شكل اللوحة، صور الموقع، طريقة التثبيت، أي ملاحظات هندسية أو تنفيذية",
              de: "Beschreibe Farben, Form, Standortfotos, Befestigung und weitere technische Hinweise",
              en: "Describe colors, sign shape, site photos, installation method, and any technical notes",
            },
            semanticGroup: "notes",
            aiHint: "Freeform notes with custom requirements and edge cases.",
          },
        ],
      },
    ],
    attachments: [
      {
        id: "site-photos",
        kind: "site-photos",
        title: {
          ar: "صور الموقع أو الواجهة",
          de: "Standort- oder Fassadenfotos",
          en: "Site or Facade Photos",
        },
        description: {
          ar: "صور للمكان تساعد على فهم المساحة والتركيب.",
          de: "Fotos des Standorts helfen bei Einschätzung von Fläche und Montage.",
          en: "Site photos help us understand the space and installation conditions.",
        },
        required: false,
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
        description: {
          ar: "إذا كان لديك ملف جاهز مثل PDF أو AI أو SVG يمكن إرفاقه لاحقًا.",
          de: "Falls vorhanden, können fertige Dateien wie PDF, AI oder SVG später hochgeladen werden.",
          en: "If available, ready design files such as PDF, AI, or SVG can be uploaded later.",
        },
        required: false,
        multiple: true,
      },
    ],
  },

  {
    id: "window-graphics",
    category: "signage",
    title: {
      ar: "طباعة وتغليف الواجهات الزجاجية",
      de: "Schaufenster & Glasfolierung",
      en: "Window Graphics",
    },
    description: {
      ar: "طلبات طباعة وتغليف الواجهات الزجاجية للمحلات والشركات.",
      de: "Anfragen für Schaufensterbeschriftung und Glasfolierung.",
      en: "Requests for window graphics and glass branding.",
    },
    intro: {
      ar: "هذا النموذج مناسب لتغليف الواجهات الزجاجية، القص اللاصق، الفينيل الشفاف، ومواد مثل One Way Vision.",
      de: "Dieses Formular eignet sich für Schaufensterfolierung, geplottete Folien, transparente Vinyls und Materialien wie One Way Vision.",
      en: "This form is suitable for window wrapping, cut vinyl, transparent vinyl, and materials such as one-way vision.",
    },
    requestGuidance: [
      {
        ar: "يفضل ذكر عدد الواجهات أو الأجزاء الزجاجية بشكل تقريبي.",
        de: "Bitte gib die Anzahl der Glasflächen möglichst ungefähr an.",
        en: "It is helpful to mention the approximate number of glass surfaces.",
      },
      {
        ar: "إذا كان لديك صور للواجهة أو مقاسات أولية فهذا يساعد كثيرًا في التسعير.",
        de: "Wenn du Fotos oder grobe Maße hast, hilft das deutlich bei der Kalkulation.",
        en: "If you have facade photos or approximate measurements, that helps a lot with pricing.",
      },
    ],
    seo: {
      slug: "window-graphics-glass-branding",
      categorySlug: "signage",
      metaTitle: {
        ar: "طلب تغليف واجهات زجاجية",
        de: "Anfrage für Schaufensterfolierung",
        en: "Request Window Graphics",
      },
      metaDescription: {
        ar: "نموذج طلب لتغليف الزجاج والواجهات الشفافة والقص اللاصق.",
        de: "Anfrageformular für Glasfolierung, Schaufensterdesign und Plotterfolien.",
        en: "Request form for window wrapping, glass branding, and cut vinyl graphics.",
      },
    },
    aiSummaryHint:
      "Summarize the window graphics request with surface count, dimensions, material, print type, design readiness, and installation needs.",
    sections: [
      createContactSection(),
      {
        id: "project-basics",
        title: {
          ar: "معلومات العمل",
          de: "Auftragsgrundlagen",
          en: "Work Basics",
        },
        description: {
          ar: "حدد نوع العمل وعدد الأجزاء أو الواجهات إن أمكن.",
          de: "Definiere die Arbeitsart und wenn möglich die Anzahl der Flächen.",
          en: "Define the work type and, if possible, the number of surfaces.",
        },
        fields: [
          {
            id: "productType",
            type: "text",
            label: { ar: "نوع العمل", de: "Art der Arbeit", en: "Work Type" },
            placeholder: {
              ar: "فينيل شفاف، ون واي فيجن، قص حروف...",
              de: "Klare Folie, One Way Vision, Plotter...",
              en: "clear vinyl, one way vision, cut letters...",
            },
            required: false,
            semanticGroup: "project",
            allowsUnknown: true,
            aiHint: "Main window graphics type.",
          },
          {
            id: "quantity",
            type: "number",
            label: { ar: "عدد الواجهات", de: "Anzahl der Flächen", en: "Number of Areas" },
            placeholder: { ar: "مثال: 2", de: "z. B. 2", en: "e.g. 2" },
            required: false,
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Approximate number of window surfaces.",
          },
          {
            id: "deliveryDate",
            type: "text",
            label: { ar: "موعد التنفيذ", de: "Termin", en: "Execution Date" },
            placeholder: {
              ar: "اكتب الموعد المطلوب",
              de: "Wunschtermin eingeben",
              en: "Enter requested date",
            },
            semanticGroup: "delivery",
            allowsUnknown: true,
            aiHint: "Requested execution timing.",
          },
        ],
      },
      {
        id: "dimensions-materials",
        title: {
          ar: "المقاسات والمواد",
          de: "Maße und Materialien",
          en: "Dimensions and Materials",
        },
        description: {
          ar: "أدخل المقاسات ونوع المادة والطباعة إذا كانت معروفة.",
          de: "Gib Maße sowie Material und Druckart an, falls bekannt.",
          en: "Enter dimensions, material, and print type if known.",
        },
        fields: [
          {
            id: "size",
            type: "text",
            label: { ar: "المقاسات", de: "Maße", en: "Dimensions" },
            placeholder: {
              ar: "عرض × ارتفاع لكل واجهة",
              de: "Breite × Höhe pro Fläche",
              en: "width × height per area",
            },
            required: false,
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Dimensions per window or surface.",
          },
          {
            id: "material",
            type: "text",
            label: { ar: "المواد", de: "Material", en: "Material" },
            placeholder: {
              ar: "فينيل، ون واي، حماية، شفاف...",
              de: "Vinyl, One Way Vision, Schutzfolie...",
              en: "vinyl, one way, protective film...",
            },
            semanticGroup: "materials",
            allowsUnknown: true,
            aiHint: "Window film material or preference.",
          },
          {
            id: "printType",
            type: "text",
            label: { ar: "نوع الطباعة", de: "Druckart", en: "Print Type" },
            placeholder: {
              ar: "داخلي، خارجي، إضاءة خلفية...",
              de: "Innen, Außen, Backlight...",
              en: "indoor, outdoor, backlight...",
            },
            semanticGroup: "production",
            allowsUnknown: true,
            aiHint: "Print direction or production style.",
          },
          {
            id: "finishing",
            type: "text",
            label: { ar: "التشطيب", de: "Veredelung", en: "Finishing" },
            placeholder: {
              ar: "قص، تركيب، حماية...",
              de: "Zuschnitt, Montage, Schutz...",
              en: "cutting, installation, protection...",
            },
            semanticGroup: "production",
            allowsUnknown: true,
            aiHint: "Post-processing or finishing requirements.",
          },
        ],
      },
      {
        id: "design-installation",
        title: {
          ar: "التصميم والتركيب",
          de: "Design und Montage",
          en: "Design and Installation",
        },
        description: {
          ar: "حدد ما إذا كان التصميم جاهزًا وهل هناك حاجة للتركيب.",
          de: "Gib an, ob ein Design vorhanden ist und ob Montage benötigt wird.",
          en: "Specify whether the design is ready and whether installation is needed.",
        },
        fields: [
          {
            id: "designReady",
            type: "radio",
            label: { ar: "هل التصميم جاهز؟", de: "Design vorhanden?", en: "Design Ready?" },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
            ],
            required: false,
            semanticGroup: "design",
            allowsUnknown: true,
            aiHint: "Whether the customer already has artwork.",
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
            label: { ar: "ملاحظات", de: "Zusätzliche Details", en: "Additional Details" },
            placeholder: {
              ar: "اذكر مكان الموقع، عدد الواجهات، وهل يوجد تركيب",
              de: "Standort, Anzahl der Flächen und Montage angeben",
              en: "mention location, number of windows, and installation details",
            },
            semanticGroup: "notes",
            aiHint: "Location and additional practical notes.",
          },
        ],
      },
    ],
    attachments: [
      {
        id: "window-photos",
        kind: "site-photos",
        title: {
          ar: "صور الواجهة الزجاجية",
          de: "Fotos der Glasfassade",
          en: "Window Front Photos",
        },
        description: {
          ar: "صور للزجاج أو الواجهة تساعد في تقدير العمل.",
          de: "Fotos der Glasflächen helfen bei der Einschätzung des Aufwands.",
          en: "Photos of the glass facade help estimate the work accurately.",
        },
        required: false,
        multiple: true,
      },
      {
        id: "measurements",
        kind: "measurements",
        title: {
          ar: "مخطط أو قياسات",
          de: "Skizze oder Maße",
          en: "Sketch or Measurements",
        },
        required: false,
        multiple: true,
      },
    ],
  },

  {
    id: "sign-installation-maintenance",
    category: "signage",
    title: {
      ar: "تركيب وصيانة اللوحات",
      de: "Schildermontage & Wartung",
      en: "Sign Installation & Maintenance",
    },
    description: {
      ar: "طلبات تركيب اللوحات الإعلانية وصيانتها وفكها واستبدالها.",
      de: "Anfragen für Montage, Wartung, Demontage und Austausch von Werbeschildern.",
      en: "Requests for sign installation, maintenance, removal, and replacement.",
    },
    intro: {
      ar: "هذا النموذج مخصص لخدمات التركيب والصيانة والفك والاستبدال، سواء للوحات قائمة أو أعمال جديدة تحتاج دعمًا موقعيًا.",
      de: "Dieses Formular ist für Montage, Wartung, Demontage und Austausch gedacht – sowohl bei bestehenden als auch neuen Schildern.",
      en: "This form is intended for installation, maintenance, removal, and replacement services for both existing and new signage.",
    },
    requestGuidance: [
      {
        ar: "اذكر الارتفاع التقريبي وحالة اللوحة إن أمكن.",
        de: "Bitte gib möglichst die ungefähre Höhe und den Zustand des Schildes an.",
        en: "Please mention the approximate height and sign condition if possible.",
      },
      {
        ar: "إذا كان هناك حاجة لرافعة أو كهربائي أو فك لوحة قديمة فاذكر ذلك.",
        de: "Falls Hebebühne, Elektriker oder Demontage eines alten Schildes nötig sind, bitte angeben.",
        en: "If a lift, electrician, or removal of an old sign is needed, please mention it.",
      },
    ],
    seo: {
      slug: "sign-installation-maintenance",
      categorySlug: "signage",
    },
    aiSummaryHint:
      "Summarize the installation or maintenance request with service type, site conditions, height, material, required tools, and urgency.",
    sections: [
      createContactSection(),
      {
        id: "service-basics",
        title: {
          ar: "نوع الخدمة",
          de: "Serviceart",
          en: "Service Type",
        },
        description: {
          ar: "حدد نوع العمل المطلوب والعدد والموعد إذا كان معروفًا.",
          de: "Definiere die gewünschte Leistung, Anzahl und den Termin, falls bekannt.",
          en: "Define the requested work type, quantity, and timing if known.",
        },
        fields: [
          {
            id: "productType",
            type: "text",
            label: { ar: "نوع الخدمة", de: "Serviceart", en: "Service Type" },
            placeholder: {
              ar: "تركيب، صيانة، فك، استبدال...",
              de: "Montage, Wartung, Demontage, Austausch...",
              en: "installation, maintenance, removal, replacement...",
            },
            required: false,
            semanticGroup: "project",
            allowsUnknown: true,
            aiHint: "Main service request type.",
          },
          {
            id: "quantity",
            type: "number",
            label: { ar: "العدد", de: "Anzahl", en: "Quantity" },
            placeholder: { ar: "مثال: 1", de: "z. B. 1", en: "e.g. 1" },
            required: false,
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Number of items or locations involved.",
          },
          {
            id: "deliveryDate",
            type: "text",
            label: { ar: "موعد التنفيذ", de: "Ausführungstermin", en: "Execution Date" },
            placeholder: {
              ar: "اكتب الموعد المطلوب",
              de: "Wunschtermin eingeben",
              en: "Enter requested date",
            },
            semanticGroup: "delivery",
            allowsUnknown: true,
            aiHint: "Requested service timing.",
          },
        ],
      },
      {
        id: "site-technical",
        title: {
          ar: "بيانات الموقع والحالة الفنية",
          de: "Standort und technische Angaben",
          en: "Site and Technical Details",
        },
        description: {
          ar: "اكتب المقاسات أو المواد أو ظروف التركيب إن كانت معروفة.",
          de: "Gib Maße, Material oder Montagebedingungen an, sofern bekannt.",
          en: "Provide dimensions, materials, or installation conditions if known.",
        },
        fields: [
          {
            id: "size",
            type: "text",
            label: { ar: "المقاسات", de: "Maße", en: "Dimensions" },
            placeholder: {
              ar: "اكتب مقاس اللوحة أو مكان التركيب",
              de: "Maße des Schildes oder Montagebereichs eingeben",
              en: "Enter sign size or installation area dimensions",
            },
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Dimensions of sign or mounting area.",
          },
          {
            id: "material",
            type: "text",
            label: { ar: "المواد", de: "Material", en: "Material" },
            placeholder: {
              ar: "ديبوند، أكريليك، ألمنيوم، LED...",
              de: "Dibond, Acryl, Aluminium, LED...",
              en: "dibond, acrylic, aluminum, LED...",
            },
            semanticGroup: "materials",
            allowsUnknown: true,
            aiHint: "Existing or target sign materials.",
          },
          {
            id: "printType",
            type: "text",
            label: { ar: "نوع العمل", de: "Art der Ausführung", en: "Work Type" },
            placeholder: {
              ar: "خارجي، داخلي، مرتفع، يحتاج رافعة...",
              de: "Außen, Innen, hoch gelegen, Hebebühne nötig...",
              en: "outdoor, indoor, high position, lift required...",
            },
            required: false,
            semanticGroup: "installation",
            allowsUnknown: true,
            aiHint: "Execution context such as indoor/outdoor, height, lift requirement.",
          },
          {
            id: "finishing",
            type: "text",
            label: {
              ar: "التشطيب أو المطلوب",
              de: "Veredelung / Anforderung",
              en: "Finishing / Requirement",
            },
            placeholder: {
              ar: "تنظيف، إصلاح، تمديد كهرباء، حماية...",
              de: "Reinigung, Reparatur, Elektroanschluss, Schutz...",
              en: "cleaning, repair, electrical work, protection...",
            },
            semanticGroup: "production",
            allowsUnknown: true,
            aiHint: "Specific maintenance or finishing requirement.",
          },
          {
            id: "designReady",
            type: "radio",
            label: {
              ar: "هل يوجد ملف أو صور جاهزة؟",
              de: "Datei oder Fotos vorhanden?",
              en: "Files or Photos Ready?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
            ],
            required: false,
            semanticGroup: "attachments",
            allowsUnknown: true,
            aiHint: "Whether files or reference photos are available.",
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
              ar: "اذكر الموقع، الارتفاع، حالة اللوحة، وهل يوجد كهرباء أو فك قديم",
              de: "Standort, Höhe, Zustand des Schildes und Strom/Fremdmontage angeben",
              en: "Mention location, height, sign condition, and any electrical or removal details",
            },
            semanticGroup: "notes",
            aiHint: "Important practical notes for maintenance and on-site work.",
          },
        ],
      },
    ],
    attachments: [
      {
        id: "installation-photos",
        kind: "site-photos",
        title: {
          ar: "صور اللوحة أو مكان التركيب",
          de: "Fotos des Schildes oder Montageorts",
          en: "Sign or Installation Site Photos",
        },
        required: false,
        multiple: true,
      },
      {
        id: "service-documents",
        kind: "documents",
        title: {
          ar: "مستندات أو رسومات مساعدة",
          de: "Hilfsdokumente oder Zeichnungen",
          en: "Supporting Documents or Drawings",
        },
        required: false,
        multiple: true,
      },
    ],
  },

    {
    id: "banners-rollups-flags",
    category: "signage",
    title: {
      ar: "البنرات والرول أب والأعلام",
      de: "Banner, Roll-Ups & Fahnen",
      en: "Banners, Roll-Ups & Flags",
    },
    description: {
      ar: "بنرات دعائية، رول أب، أعلام، ولافتات للفعاليات والمعارض والواجهات.",
      de: "Werbebanner, Roll-Ups, Fahnen und Displays für Events, Messen und Fassaden.",
      en: "Advertising banners, roll-ups, flags, and displays for events, exhibitions, and facades.",
    },
    intro: {
      ar: "هذا النموذج مخصص للبنرات والرول أب والأعلام ومواد العرض المرنة المستخدمة في الافتتاحات والفعاليات والواجهات.",
      de: "Dieses Formular ist für Banner, Roll-Ups, Fahnen und flexible Werbedisplays für Eröffnungen, Events und Fassaden gedacht.",
      en: "This form is intended for banners, roll-ups, flags, and flexible display materials used for openings, events, and facades.",
    },
    requestGuidance: [
      {
        ar: "حدد مكان الاستخدام لأن ذلك يؤثر على المادة والتشطيب.",
        de: "Bitte gib den Einsatzort an, da dieser Material und Verarbeitung beeinflusst.",
        en: "Please specify the usage location because it affects the material and finishing.",
      },
      {
        ar: "إذا كنت تحتاج قاعدة أو عيون تعليق أو حاشية فاذكر ذلك بوضوح.",
        de: "Wenn du Ösen, Saum oder einen Standfuß brauchst, gib das bitte klar an.",
        en: "If you need eyelets, hemming, or a stand base, please specify it clearly.",
      },
    ],
    seo: {
      slug: "banners-rollups-flags",
      categorySlug: "signage",
      metaTitle: {
        ar: "طلب بنرات ورول أب وأعلام",
        de: "Anfrage für Banner, Roll-Ups und Fahnen",
        en: "Request Banners, Roll-Ups and Flags",
      },
      metaDescription: {
        ar: "نموذج طلب للبنرات والرول أب والأعلام ومواد العرض المرنة.",
        de: "Anfrageformular für Banner, Roll-Ups, Fahnen und flexible Werbedisplays.",
        en: "Request form for banners, roll-ups, flags, and flexible display products.",
      },
    },
    aiSummaryHint:
      "Summarize the banner or roll-up request with product type, dimensions, material, finishing, usage location, quantity, and design readiness.",
    sections: [
      createContactSection(),
      {
        id: "product-basics",
        title: {
          ar: "نوع المنتج",
          de: "Produkttyp",
          en: "Product Type",
        },
        description: {
          ar: "اختر نوع العنصر المطلوب والكمية الأساسية.",
          de: "Wähle die Art des Produkts und die Grundmenge.",
          en: "Choose the type of item and the basic quantity.",
        },
        fields: [
          {
            id: "itemType",
            type: "select",
            label: { ar: "نوع العنصر", de: "Art des Produkts", en: "Item Type" },
            required: false,
            options: [
              { value: "banner", label: { ar: "بنر", de: "Banner", en: "Banner" } },
              { value: "rollup", label: { ar: "رول أب", de: "Roll-Up", en: "Roll-Up" } },
              { value: "flag", label: { ar: "علم", de: "Fahne", en: "Flag" } },
              { value: "mesh-banner", label: { ar: "بنر شبكي", de: "Mesh-Banner", en: "Mesh Banner" } },
            ],
            semanticGroup: "project",
            allowsUnknown: true,
            aiHint: "Main banner/display type.",
          },
          {
            id: "quantity",
            type: "number",
            label: { ar: "الكمية", de: "Menge", en: "Quantity" },
            placeholder: { ar: "مثال: 2", de: "Beispiel: 2", en: "Example: 2" },
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Requested quantity.",
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
            aiHint: "Whether customer already has artwork.",
          },
        ],
      },
      {
        id: "sizes-materials",
        title: {
          ar: "المقاسات والخامات",
          de: "Maße und Materialien",
          en: "Sizes and Materials",
        },
        description: {
          ar: "أدخل المقاس المناسب واختر الخامة والتشطيب إذا كانت معروفة.",
          de: "Gib Maße ein und wähle Material sowie Verarbeitung, falls bekannt.",
          en: "Enter dimensions and choose material and finishing if known.",
        },
        fields: [
          {
            id: "width",
            type: "number",
            label: { ar: "العرض (سم)", de: "Breite (cm)", en: "Width (cm)" },
            placeholder: { ar: "مثال: 85", de: "Beispiel: 85", en: "Example: 85" },
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Width in centimeters.",
          },
          {
            id: "height",
            type: "number",
            label: { ar: "الارتفاع (سم)", de: "Höhe (cm)", en: "Height (cm)" },
            placeholder: { ar: "مثال: 200", de: "Beispiel: 200", en: "Example: 200" },
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Height in centimeters.",
          },
          {
            id: "material",
            type: "select",
            label: { ar: "الخامة", de: "Material", en: "Material" },
            options: [
              { value: "pvc-banner", label: { ar: "PVC بنر", de: "PVC-Banner", en: "PVC Banner" } },
              { value: "mesh", label: { ar: "مش", de: "Mesh", en: "Mesh" } },
              { value: "fabric", label: { ar: "قماش", de: "Stoff", en: "Fabric" } },
              { value: "flag-fabric", label: { ar: "قماش أعلام", de: "Fahnenstoff", en: "Flag Fabric" } },
            ],
            semanticGroup: "materials",
            allowsUnknown: true,
            aiHint: "Material type for banner, flag, or roll-up.",
          },
          {
            id: "finishing",
            type: "checkbox",
            label: { ar: "التشطيب", de: "Verarbeitung", en: "Finishing" },
            options: [
              { value: "hem", label: { ar: "حاشية", de: "Saum", en: "Hem" } },
              { value: "eyelets", label: { ar: "عيون تعليق", de: "Ösen", en: "Eyelets" } },
              { value: "pole-pocket", label: { ar: "جيب عصا", de: "Hohlsaum", en: "Pole Pocket" } },
              { value: "stand", label: { ar: "قاعدة", de: "Standfuß", en: "Stand" } },
            ],
            semanticGroup: "production",
            allowsUnknown: true,
            aiHint: "Required finishing and hardware.",
          },
          {
            id: "usagePlace",
            type: "radio",
            label: { ar: "مكان الاستخدام", de: "Einsatzort", en: "Usage Location" },
            options: [
              { value: "indoor", label: { ar: "داخلي", de: "Innenbereich", en: "Indoor" } },
              { value: "outdoor", label: { ar: "خارجي", de: "Außenbereich", en: "Outdoor" } },
            ],
            semanticGroup: "project",
            allowsUnknown: true,
            aiHint: "Indoor or outdoor usage affects media selection.",
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
            label: { ar: "تفاصيل إضافية", de: "Zusätzliche Details", en: "Additional Details" },
            placeholder: {
              ar: "اكتب مكان الاستخدام، طريقة التثبيت، أو أي متطلبات إضافية",
              de: "Beschreibe Einsatzort, Befestigung oder weitere Anforderungen",
              en: "Describe usage location, installation method, or any additional requirements",
            },
            semanticGroup: "notes",
            aiHint: "Freeform notes for special banner/display requirements.",
          },
        ],
      },
    ],
    attachments: [
      {
        id: "banner-design-files",
        kind: "design-files",
        title: {
          ar: "ملفات التصميم",
          de: "Designdateien",
          en: "Design Files",
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
];