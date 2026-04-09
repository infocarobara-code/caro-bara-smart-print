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
    ar: "يمكنك ترك معلومات التواصل إذا رغبت أن نعود إليك بسرعة بعرض سعر أو استفسار.",
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
      ar: "لوحات المحلات والإضاءات",
      de: "Schilder & Lichtwerbung",
      en: "Signs & Light Advertising",
    },
    description: {
      ar: "حلول احترافية للوحات المحلات، الحروف البارزة، والواجهات والإضاءات التجارية بمسار واضح يساعدك على بدء الطلب بطريقة منظمة.",
      de: "Professionelle Lösungen für Geschäftsschilder, Profilbuchstaben, Fassaden und Lichtwerbung mit einem klaren Ablauf für einen strukturierten Projektstart.",
      en: "Professional solutions for shop signs, raised letters, facades, and light advertising with a clear flow that helps you start in a structured way.",
    },
    intro: {
      ar: "هذا النموذج مخصص لطلبات لوحات المحلات والإضاءات والحروف البارزة والواجهات. لا تحتاج لمعرفة كل التفاصيل الفنية من البداية. اختر ما تعرفه واترك ما لا تعرفه، وسنحوّل الطلب إلى صيغة واضحة وقابلة للتنفيذ.",
      de: "Dieses Formular ist für Geschäftsschilder, Lichtwerbung, Profilbuchstaben und Fassadenlösungen gedacht. Du musst nicht alle technischen Details von Anfang an kennen. Wähle einfach aus, was du weißt, und wir strukturieren die Anfrage klar und umsetzbar.",
      en: "This form is for shop signs, light advertising, raised letters, and facade solutions. You do not need to know every technical detail from the start. Choose what you know and we will structure the request into a clear, actionable format.",
    },
    requestGuidance: [
      {
        ar: "إذا كانت لديك صور للمحل أو الواجهة أو المكان المراد تركيب اللوحة فيه، فهذا يساعد كثيرًا على فهم الطلب بدقة أكبر.",
        de: "Wenn du Fotos vom Geschäft, der Fassade oder dem Montagebereich hast, hilft das sehr dabei, die Anfrage präziser zu verstehen.",
        en: "If you have photos of the shop, facade, or installation area, that helps us understand the request much more accurately.",
      },
      {
        ar: "إذا لم تكن متأكدًا من المادة أو نوع الإضاءة أو طريقة التثبيت، لا مشكلة. اختر الخيار الأقرب أو اتركه غير محدد وسنقترح الأنسب.",
        de: "Wenn du dir bei Material, Beleuchtung oder Montageart nicht sicher bist, ist das kein Problem. Wähle die passendste Option oder lasse den Punkt offen – wir schlagen dann die beste Lösung vor.",
        en: "If you are unsure about material, lighting, or installation method, that is completely fine. Choose the closest option or leave it open and we will suggest the best solution.",
      },
    ],
    seo: {
      slug: "signage-facades-light-advertising",
      categorySlug: "signage",
      metaTitle: {
        ar: "لوحات محلات وواجهات وإضاءات في برلين | Caro Bara Smart Print",
        de: "Schilder, Fassaden & Lichtwerbung in Berlin | Caro Bara Smart Print",
        en: "Signs, Facades & Light Advertising in Berlin | Caro Bara Smart Print",
      },
      metaDescription: {
        ar: "اطلب لوحات المحلات والواجهات والحروف البارزة والإضاءات التجارية في برلين عبر نموذج ذكي ينظم الطلب ويكشف النواقص قبل التنفيذ.",
        de: "Geschäftsschilder, Fassaden, Profilbuchstaben und Lichtwerbung in Berlin über ein smartes Formular anfragen – klar strukturiert, auch wenn noch nicht alle Details feststehen.",
        en: "Request shop signs, facades, raised letters, and light advertising in Berlin through a smart form that organizes the request and identifies missing details before production.",
      },
    },
    aiSummaryHint:
      "Summarize the signage request with business type, sign type, intended goal, dimensions, material, lighting, facade conditions, installation requirements, missing details, and next recommended clarification steps.",
    sections: [
      createContactSection(),
      {
        id: "project-basics",
        title: {
          ar: "أساسيات الطلب",
          de: "Projektgrundlagen",
          en: "Project Basics",
        },
        description: {
          ar: "ابدأ بتحديد نوع الطلب وما الذي تريد الوصول إليه بصريًا أو عمليًا.",
          de: "Starte mit der Art der Anfrage und dem visuellen oder praktischen Ziel des Projekts.",
          en: "Start by defining the type of request and the visual or practical goal of the project.",
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
              {
                value: "new",
                label: {
                  ar: "افتتاح جديد",
                  de: "Neueröffnung",
                  en: "New Opening",
                },
              },
              {
                value: "renewal",
                label: {
                  ar: "تجديد أو تغيير هوية",
                  de: "Relaunch / Erneuerung",
                  en: "Renewal / Relaunch",
                },
              },
              {
                value: "existing",
                label: {
                  ar: "محل قائم",
                  de: "Bestehendes Geschäft",
                  en: "Existing Business",
                },
              },
            ],
            semanticGroup: "project",
            allowsUnknown: true,
            aiHint:
              "Helps understand whether the request is for a new opening, renewal, or existing business.",
          },
          {
            id: "businessType",
            type: "select",
            label: {
              ar: "نوع النشاط",
              de: "Art des Geschäfts",
              en: "Business Type",
            },
            required: false,
            options: [
              {
                value: "restaurant",
                label: { ar: "مطعم", de: "Restaurant", en: "Restaurant" },
              },
              { value: "cafe", label: { ar: "كافيه", de: "Café", en: "Cafe" } },
              {
                value: "bakery",
                label: { ar: "مخبز", de: "Bäckerei", en: "Bakery" },
              },
              {
                value: "barbershop",
                label: { ar: "حلاقة", de: "Barbershop", en: "Barbershop" },
              },
              {
                value: "beauty-salon",
                label: {
                  ar: "صالون تجميل",
                  de: "Kosmetikstudio",
                  en: "Beauty Salon",
                },
              },
              {
                value: "retail",
                label: { ar: "متجر", de: "Ladengeschäft", en: "Retail Store" },
              },
              {
                value: "office",
                label: { ar: "مكتب أو شركة", de: "Büro / Firma", en: "Office / Company" },
              },
              {
                value: "clinic",
                label: { ar: "عيادة", de: "Praxis / Klinik", en: "Clinic" },
              },
              {
                value: "other",
                label: { ar: "نشاط آخر", de: "Anderes", en: "Other" },
              },
            ],
            semanticGroup: "project",
            allowsUnknown: true,
            aiHint:
              "Business type helps recommend the appropriate signage style and tone.",
          },
          {
            id: "signType",
            type: "select",
            label: {
              ar: "ما الذي تحتاجه تحديدًا؟",
              de: "Was wird genau benötigt?",
              en: "What Exactly Do You Need?",
            },
            required: false,
            options: [
              {
                value: "shop-front-sign",
                label: {
                  ar: "لوحة واجهة محل",
                  de: "Geschäftsfrontschild",
                  en: "Shop Front Sign",
                },
              },
              {
                value: "lightbox",
                label: { ar: "صندوق ضوئي", de: "Lichtkasten", en: "Light Box" },
              },
              {
                value: "3d-letters",
                label: {
                  ar: "حروف بارزة",
                  de: "3D-Buchstaben",
                  en: "3D Letters",
                },
              },
              {
                value: "illuminated-letters",
                label: {
                  ar: "حروف مضيئة",
                  de: "Leuchtbuchstaben",
                  en: "Illuminated Letters",
                },
              },
              {
                value: "logo-sign",
                label: { ar: "لوغو أو شعار مجسم", de: "Logo / Emblem", en: "Logo Sign" },
              },
              {
                value: "indoor-sign",
                label: { ar: "لوحة داخلية", de: "Innenschild", en: "Indoor Sign" },
              },
              {
                value: "wayfinding",
                label: {
                  ar: "لوحات توجيهية",
                  de: "Leitsystem / Wegweiser",
                  en: "Wayfinding Signs",
                },
              },
              {
                value: "wall-sign",
                label: { ar: "لوحة جدارية", de: "Wandschild", en: "Wall Sign" },
              },
              {
                value: "banner-sign",
                label: { ar: "بنر أو لوحة مرنة", de: "Banner / Flexschild", en: "Banner Sign" },
              },
              {
                value: "not-sure",
                label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" },
              },
            ],
            semanticGroup: "project",
            allowsUnknown: true,
            aiHint:
              "Primary signage category for routing, quotation, and internal SEO intent.",
          },
          {
            id: "goal",
            type: "checkbox",
            label: {
              ar: "ما الهدف من اللوحة؟",
              de: "Welches Ziel soll das Schild erfüllen?",
              en: "What Is the Main Goal of the Sign?",
            },
            options: [
              {
                value: "visibility",
                label: {
                  ar: "جذب الانتباه من بعيد",
                  de: "Aus der Entfernung sichtbar sein",
                  en: "Be Visible from a Distance",
                },
              },
              {
                value: "branding",
                label: {
                  ar: "إبراز الهوية والشعار",
                  de: "Marke und Logo hervorheben",
                  en: "Highlight Branding and Logo",
                },
              },
              {
                value: "night-visibility",
                label: { ar: "وضوح ليلي", de: "Nachts gut sichtbar", en: "Night Visibility" },
              },
              {
                value: "premium-look",
                label: { ar: "مظهر فاخر", de: "Hochwertiger Eindruck", en: "Premium Look" },
              },
              {
                value: "clear-information",
                label: {
                  ar: "عرض اسم ومعلومات واضحة",
                  de: "Klare Informationen anzeigen",
                  en: "Display Clear Information",
                },
              },
            ],
            semanticGroup: "project",
            allowsUnknown: true,
            aiHint:
              "Clarifies customer intent for sign design and recommendation logic.",
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
              {
                value: "indoor",
                label: { ar: "داخلي", de: "Innenbereich", en: "Indoor" },
              },
              {
                value: "outdoor",
                label: { ar: "خارجي", de: "Außenbereich", en: "Outdoor" },
              },
            ],
            semanticGroup: "project",
            allowsUnknown: true,
            aiHint: "Determines exposure, durability, and suitable materials.",
          },
        ],
      },
      {
        id: "site-context",
        title: {
          ar: "المكان والواجهة",
          de: "Standort und Fassade",
          en: "Site and Facade Context",
        },
        description: {
          ar: "هذه البيانات تساعدنا على فهم الواجهة وطريقة التثبيت والمعاينة المطلوبة.",
          de: "Diese Angaben helfen uns, die Fassade, Montageart und den möglichen Vor-Ort-Bedarf besser zu verstehen.",
          en: "These details help us understand the facade, mounting situation, and whether a site inspection may be needed.",
        },
        fields: [
          {
            id: "facadeType",
            type: "select",
            label: {
              ar: "نوع الواجهة أو مكان التركيب",
              de: "Art der Fassade / Montagefläche",
              en: "Facade or Mounting Surface Type",
            },
            options: [
              {
                value: "shop-front",
                label: { ar: "واجهة محل", de: "Geschäftsfront", en: "Shop Front" },
              },
              {
                value: "glass-front",
                label: { ar: "واجهة زجاجية", de: "Glasfassade", en: "Glass Front" },
              },
              { value: "wall", label: { ar: "جدار", de: "Wand", en: "Wall" } },
              {
                value: "composite-panel",
                label: {
                  ar: "كلادينغ أو ألواح واجهة",
                  de: "Verbundplatte / Fassade",
                  en: "Composite Facade Panel",
                },
              },
              {
                value: "indoor-wall",
                label: { ar: "جدار داخلي", de: "Innenwand", en: "Indoor Wall" },
              },
              {
                value: "ceiling",
                label: { ar: "سقف أو تعليق علوي", de: "Decke / Hängung", en: "Ceiling / Hanging" },
              },
              {
                value: "not-sure",
                label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" },
              },
            ],
            semanticGroup: "installation",
            allowsUnknown: true,
            aiHint: "Describes where the sign will be mounted.",
          },
          {
            id: "existingSign",
            type: "radio",
            label: {
              ar: "هل توجد لوحة قديمة في المكان؟",
              de: "Gibt es bereits ein altes Schild vor Ort?",
              en: "Is There an Existing Sign on Site?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
              {
                value: "not-sure",
                label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" },
              },
            ],
            semanticGroup: "installation",
            allowsUnknown: true,
            aiHint:
              "Important to understand if removal or replacement may be required.",
          },
          {
            id: "installationHeight",
            type: "select",
            label: {
              ar: "ارتفاع التركيب التقريبي",
              de: "Ungefähre Montagehöhe",
              en: "Approximate Installation Height",
            },
            options: [
              {
                value: "eye-level",
                label: { ar: "على مستوى النظر", de: "Auf Augenhöhe", en: "Eye Level" },
              },
              {
                value: "above-entrance",
                label: { ar: "فوق المدخل", de: "Über dem Eingang", en: "Above Entrance" },
              },
              {
                value: "upper-facade",
                label: {
                  ar: "على واجهة مرتفعة",
                  de: "Höher an der Fassade",
                  en: "Upper Facade",
                },
              },
              {
                value: "high-position",
                label: {
                  ar: "مرتفع ويحتاج تجهيز خاص",
                  de: "Hoch gelegen / Spezialzugang",
                  en: "High Position / Special Access",
                },
              },
              {
                value: "not-sure",
                label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" },
              },
            ],
            semanticGroup: "installation",
            allowsUnknown: true,
            aiHint:
              "Helps estimate installation complexity and access requirements.",
          },
          {
            id: "siteCondition",
            type: "checkbox",
            label: {
              ar: "ما الذي ينطبق على الموقع؟",
              de: "Was trifft auf den Standort zu?",
              en: "Which Site Conditions Apply?",
            },
            options: [
              {
                value: "easy-access",
                label: { ar: "الوصول سهل", de: "Leichter Zugang", en: "Easy Access" },
              },
              {
                value: "busy-street",
                label: {
                  ar: "المكان على شارع حيوي",
                  de: "An einer belebten Straße",
                  en: "Busy Street",
                },
              },
              {
                value: "needs-ladder",
                label: {
                  ar: "قد يحتاج سلم",
                  de: "Möglicherweise Leiter nötig",
                  en: "May Need Ladder",
                },
              },
              {
                value: "needs-lift",
                label: {
                  ar: "قد يحتاج رافعة",
                  de: "Möglicherweise Hebebühne nötig",
                  en: "May Need Lift",
                },
              },
              {
                value: "electrical-work",
                label: {
                  ar: "قد يحتاج تمديد كهرباء",
                  de: "Möglicherweise Elektroarbeit nötig",
                  en: "May Need Electrical Work",
                },
              },
            ],
            semanticGroup: "installation",
            allowsUnknown: true,
            aiHint:
              "Site conditions affecting installation planning and quotation.",
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
          ar: "أدخل المقاسات إذا كانت معروفة. وإذا لم تكن تعرفها، يكفي تحديد ما إذا كنت تحتاج قياسًا أو معاينة.",
          de: "Gib Maße an, wenn sie bekannt sind. Falls nicht, reicht es aus anzugeben, ob ein Aufmaß oder Vor-Ort-Termin benötigt wird.",
          en: "Enter dimensions if known. If not, it is enough to indicate whether you need a site measurement or inspection.",
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
          {
            id: "measurementStatus",
            type: "radio",
            label: {
              ar: "هل المقاسات دقيقة أم تقريبية؟",
              de: "Sind die Maße genau oder grob?",
              en: "Are the Measurements Exact or Approximate?",
            },
            options: [
              {
                value: "exact",
                label: { ar: "دقيقة", de: "Genau", en: "Exact" },
              },
              {
                value: "approximate",
                label: { ar: "تقريبية", de: "Ungefähr", en: "Approximate" },
              },
              {
                value: "unknown",
                label: { ar: "لا أعرف", de: "Unbekannt", en: "I do not know" },
              },
            ],
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint:
              "Clarifies whether the provided measurements can be used directly for planning or quotation.",
          },
        ],
      },
      {
        id: "materials-lighting",
        title: {
          ar: "المواد والإضاءة والشكل العام",
          de: "Materialien, Beleuchtung und Erscheinungsbild",
          en: "Materials, Lighting, and Visual Style",
        },
        description: {
          ar: "اختر المادة ونوع الإضاءة والشكل المطلوب إذا كانت لديك فكرة مبدئية.",
          de: "Wähle Material, Beleuchtung und Stil, wenn du bereits eine grobe Vorstellung hast.",
          en: "Choose the material, lighting, and visual style if you already have a rough idea.",
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
              {
                value: "dibond",
                label: { ar: "ديبوند", de: "Dibond", en: "Dibond" },
              },
              {
                value: "acrylic",
                label: { ar: "أكريليك", de: "Acryl", en: "Acrylic" },
              },
              { value: "pvc", label: { ar: "PVC", de: "PVC", en: "PVC" } },
              {
                value: "banner",
                label: { ar: "بنر", de: "Banner", en: "Banner" },
              },
              {
                value: "metal",
                label: { ar: "معدن", de: "Metall", en: "Metal" },
              },
              { value: "wood", label: { ar: "خشب", de: "Holz", en: "Wood" } },
              {
                value: "mixed",
                label: {
                  ar: "مواد مركبة",
                  de: "Kombinierte Materialien",
                  en: "Mixed Materials",
                },
              },
              {
                value: "not-sure",
                label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" },
              },
            ],
            semanticGroup: "materials",
            allowsUnknown: true,
            aiHint: "Requested or preferred main sign material.",
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
              {
                value: "matte",
                label: { ar: "مطفي", de: "Matt", en: "Matte" },
              },
              {
                value: "glossy",
                label: { ar: "لامع", de: "Glänzend", en: "Glossy" },
              },
              {
                value: "brushed",
                label: { ar: "معدني فرش", de: "Gebürstet", en: "Brushed" },
              },
              {
                value: "painted",
                label: { ar: "مطلي", de: "Lackiert", en: "Painted" },
              },
              {
                value: "vinyl-covered",
                label: {
                  ar: "مغطى بفينيل",
                  de: "Mit Folie beklebt",
                  en: "Vinyl Covered",
                },
              },
              {
                value: "not-sure",
                label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" },
              },
            ],
            semanticGroup: "materials",
            allowsUnknown: true,
            aiHint: "Preferred visual or production finish.",
          },
          {
            id: "visualStyle",
            type: "checkbox",
            label: {
              ar: "الشكل المطلوب",
              de: "Gewünschter Eindruck / Stil",
              en: "Desired Visual Style",
            },
            options: [
              {
                value: "simple-clean",
                label: {
                  ar: "بسيط وواضح",
                  de: "Klar und schlicht",
                  en: "Simple and Clean",
                },
              },
              {
                value: "premium",
                label: { ar: "فاخر", de: "Hochwertig", en: "Premium" },
              },
              {
                value: "modern",
                label: { ar: "حديث", de: "Modern", en: "Modern" },
              },
              {
                value: "strong-branding",
                label: {
                  ar: "تركيز قوي على الشعار",
                  de: "Starker Markenfokus",
                  en: "Strong Branding Focus",
                },
              },
              {
                value: "high-visibility",
                label: {
                  ar: "ظاهر جدًا",
                  de: "Sehr auffällig",
                  en: "Highly Visible",
                },
              },
            ],
            semanticGroup: "design",
            allowsUnknown: true,
            aiHint: "The intended visual style or impression of the sign.",
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
              {
                value: "not-sure",
                label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" },
              },
            ],
            semanticGroup: "production",
            allowsUnknown: true,
            aiHint: "Whether illuminated production is required.",
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
              {
                value: "front-lit",
                label: { ar: "إضاءة أمامية", de: "Frontbeleuchtet", en: "Front Lit" },
              },
              {
                value: "back-lit",
                label: { ar: "إضاءة خلفية", de: "Rückleuchtend", en: "Back Lit" },
              },
              {
                value: "edge-lit",
                label: { ar: "إضاءة جانبية", de: "Kantenbeleuchtung", en: "Edge Lit" },
              },
              {
                value: "halo",
                label: { ar: "هالو خلفي", de: "Halo-Effekt", en: "Halo Back Glow" },
              },
              {
                value: "lightbox",
                label: {
                  ar: "إضاءة داخل صندوق",
                  de: "Leuchtkasten-Beleuchtung",
                  en: "Light Box Illumination",
                },
              },
              {
                value: "not-sure",
                label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" },
              },
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
              {
                value: "warm-white",
                label: { ar: "أبيض دافئ", de: "Warmweiß", en: "Warm White" },
              },
              {
                value: "cool-white",
                label: { ar: "أبيض بارد", de: "Kaltweiß", en: "Cool White" },
              },
              {
                value: "neutral-white",
                label: { ar: "أبيض طبيعي", de: "Neutralweiß", en: "Neutral White" },
              },
              { value: "rgb", label: { ar: "ملون RGB", de: "RGB", en: "RGB" } },
              {
                value: "not-sure",
                label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" },
              },
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
              en: "Is There Nearby Power Access?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
              {
                value: "not-sure",
                label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" },
              },
            ],
            semanticGroup: "installation",
            allowsUnknown: true,
            aiHint: "Important for installation and electrical scope.",
          },
          {
            id: "protection",
            type: "checkbox",
            label: {
              ar: "الحماية أو المتطلبات الخاصة",
              de: "Schutz oder besondere Anforderungen",
              en: "Protection or Special Requirements",
            },
            options: [
              {
                value: "uv",
                label: { ar: "حماية UV", de: "UV-Schutz", en: "UV Protection" },
              },
              {
                value: "weather",
                label: {
                  ar: "مقاومة طقس",
                  de: "Wetterbeständig",
                  en: "Weather Resistant",
                },
              },
              {
                value: "scratch",
                label: {
                  ar: "مقاومة خدش",
                  de: "Kratzschutz",
                  en: "Scratch Protection",
                },
              },
              {
                value: "easy-clean",
                label: {
                  ar: "سهل التنظيف",
                  de: "Leicht zu reinigen",
                  en: "Easy to Clean",
                },
              },
              {
                value: "none",
                label: {
                  ar: "لا شيء محدد",
                  de: "Nichts Bestimmtes",
                  en: "Nothing Specific",
                },
              },
            ],
            semanticGroup: "materials",
            allowsUnknown: true,
            aiHint:
              "Protection requirements for durability and long-term use.",
          },
        ],
      },
      {
        id: "execution-logistics",
        title: {
          ar: "التنفيذ والتركيب واللوجستيات",
          de: "Umsetzung, Montage und Logistik",
          en: "Execution, Installation, and Logistics",
        },
        description: {
          ar: "معلومات تساعدنا على فهم هل الطلب يحتاج تصميمًا أو تركيبًا أو شحنًا أو زيارة موقع.",
          de: "Diese Angaben helfen uns zu verstehen, ob Design, Montage, Versand oder ein Vor-Ort-Termin nötig sind.",
          en: "These details help us understand whether the request requires design support, installation, shipping, or a site visit.",
        },
        fields: [
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
              {
                value: "partial",
                label: {
                  ar: "جزئي أو مبدئي",
                  de: "Teilweise / Entwurf",
                  en: "Partial / Draft",
                },
              },
            ],
            semanticGroup: "design",
            allowsUnknown: true,
            aiHint:
              "Whether the customer already has ready artwork or just a draft.",
          },
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
              {
                value: "no",
                label: {
                  ar: "لا، فقط تصنيع",
                  de: "Nein, nur Produktion",
                  en: "No, Production Only",
                },
              },
              {
                value: "not-sure",
                label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" },
              },
            ],
            semanticGroup: "installation",
            allowsUnknown: true,
            aiHint:
              "Whether on-site installation is required or production only.",
          },
          {
            id: "shipping",
            type: "radio",
            label: {
              ar: "هل تحتاج شحن أو توصيل؟",
              de: "Versand oder Lieferung benötigt?",
              en: "Need Shipping or Delivery?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              {
                value: "pickup",
                label: { ar: "استلام من المكان", de: "Abholung", en: "Pickup" },
              },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
            ],
            semanticGroup: "delivery",
            allowsUnknown: true,
            aiHint: "Whether delivery, shipping, or pickup is preferred.",
          },
          {
            id: "siteVisit",
            type: "radio",
            label: {
              ar: "هل تحتاج قياسًا أو معاينة ميدانية؟",
              de: "Vor-Ort-Aufmaß oder Besichtigung benötigt?",
              en: "Need Site Measurement or Visit?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
              {
                value: "not-sure",
                label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" },
              },
            ],
            semanticGroup: "installation",
            allowsUnknown: true,
            aiHint:
              "Whether a site survey or measurement appointment is required.",
          },
          {
            id: "photosAvailable",
            type: "radio",
            label: {
              ar: "هل لديك صور للموقع أو الواجهة؟",
              de: "Hast du Fotos vom Standort oder der Fassade?",
              en: "Do You Have Site or Facade Photos?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
            ],
            semanticGroup: "attachments",
            allowsUnknown: true,
            aiHint:
              "Indicates whether useful visual references are available.",
          },
          {
            id: "timeline",
            type: "select",
            label: {
              ar: "متى تحتاج التنفيذ؟",
              de: "Wann wird die Umsetzung benötigt?",
              en: "When Do You Need the Project?",
            },
            options: [
              {
                value: "urgent",
                label: { ar: "عاجل جدًا", de: "Sehr dringend", en: "Very Urgent" },
              },
              {
                value: "1-week",
                label: {
                  ar: "خلال أسبوع",
                  de: "Innerhalb einer Woche",
                  en: "Within 1 Week",
                },
              },
              {
                value: "2-weeks",
                label: {
                  ar: "خلال أسبوعين",
                  de: "Innerhalb von 2 Wochen",
                  en: "Within 2 Weeks",
                },
              },
              {
                value: "flexible",
                label: { ar: "مرن", de: "Flexibel", en: "Flexible" },
              },
              {
                value: "not-sure",
                label: {
                  ar: "لم أحدد بعد",
                  de: "Noch offen",
                  en: "Not Decided Yet",
                },
              },
            ],
            semanticGroup: "delivery",
            allowsUnknown: true,
            aiHint:
              "Requested urgency and timing for quotation prioritization.",
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
          ar: "اكتب أي تفاصيل بصرية أو فنية أو تنفيذية ترى أنها مهمة.",
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
              ar: "اكتب الألوان، النص المطلوب، شكل اللوحة، شعارك، صور الموقع، أو أي ملاحظات هندسية أو تنفيذية",
              de: "Beschreibe Farben, gewünschten Text, Form des Schildes, Logo, Standortfotos oder weitere technische Hinweise",
              en: "Describe colors, desired wording, sign shape, logo, site photos, or any technical and execution-related notes",
            },
            semanticGroup: "notes",
            aiHint:
              "Freeform notes with custom visual, technical, or execution-related requirements.",
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
          ar: "صور للمكان تساعد على فهم المساحة وطريقة التركيب.",
          de: "Fotos des Standorts helfen bei der Einschätzung von Fläche, Zugang und Montage.",
          en: "Site photos help us understand the area, access, and installation conditions.",
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
          ar: "إذا كان لديك ملف جاهز مثل PDF أو AI أو SVG يمكنك إرفاقه لاحقًا.",
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
    category: "surfaces",
    title: {
      ar: "تغليف الزجاج والواجهات الزجاجية",
      de: "Schaufensterfolierung & Glasbeschriftung",
      en: "Window Graphics & Glass Vinyl",
    },
    description: {
      ar: "طلبات تغليف الواجهات الزجاجية، الفينيل الشفاف، One Way Vision، القص اللاصق، والهوية البصرية على الزجاج للمحلات والشركات.",
      de: "Anfragen für Schaufensterfolierung, transparente Folien, One Way Vision, geplottete Folien und Branding auf Glasflächen für Geschäfte und Unternehmen.",
      en: "Requests for window wrapping, transparent vinyl, one-way vision, cut vinyl, and branded glass graphics for shops and businesses.",
    },
    intro: {
      ar: "هذا النموذج مناسب لتغليف الواجهات الزجاجية، القص اللاصق، الفينيل الشفاف، الحماية أو الخصوصية، ومواد مثل One Way Vision. لا تحتاج لمعرفة كل أنواع الخامات مسبقًا، فقط اختر ما تعرفه.",
      de: "Dieses Formular eignet sich für Schaufensterfolierung, geplottete Folien, transparente Vinyls, Sichtschutz und Materialien wie One Way Vision. Du musst nicht alle Materialarten im Voraus kennen – wähle einfach aus, was du weißt.",
      en: "This form is suitable for window wrapping, cut vinyl, transparent vinyl, privacy films, and materials such as one-way vision. You do not need to know all material types in advance—just choose what you know.",
    },
    requestGuidance: [
      {
        ar: "يفضل ذكر عدد الواجهات أو الأجزاء الزجاجية ولو بشكل تقريبي.",
        de: "Bitte gib die Anzahl der Glasflächen möglichst ungefähr an.",
        en: "It is helpful to mention the approximate number of glass surfaces.",
      },
      {
        ar: "إذا كان لديك صور للواجهة أو مقاسات أولية فهذا يساعد كثيرًا في التسعير واقتراح الخامة المناسبة.",
        de: "Wenn du Fotos oder grobe Maße hast, hilft das deutlich bei der Kalkulation und Materialempfehlung.",
        en: "If you have facade photos or rough measurements, that helps a lot with pricing and material recommendation.",
      },
    ],
    seo: {
      slug: "window-graphics-glass-branding",
      categorySlug: "surfaces",
      metaTitle: {
        ar: "تغليف واجهات زجاجية وفينيل على الزجاج في برلين | Caro Bara Smart Print",
        de: "Schaufensterfolierung in Berlin | Caro Bara Smart Print",
        en: "Window Graphics in Berlin | Caro Bara Smart Print",
      },
      metaDescription: {
        ar: "اطلب تغليف الزجاج والواجهات الشفافة والقص اللاصق ومواد One Way Vision في برلين عبر نموذج ذكي ومنظم.",
        de: "Anfrageformular für Glasfolierung, Schaufensterdesign, One Way Vision und Plotterfolien in Berlin – klar und strukturiert.",
        en: "Request window wrapping, glass branding, one-way vision, and cut vinyl graphics in Berlin through a smart and structured form.",
      },
    },
    aiSummaryHint:
      "Summarize the window graphics request with glass surface count, dimensions, vinyl type, print type, privacy need, design readiness, installation details, and missing clarification points.",
    sections: [
      createContactSection(),
      {
        id: "project-basics",
        title: {
          ar: "أساسيات العمل",
          de: "Auftragsgrundlagen",
          en: "Project Basics",
        },
        description: {
          ar: "حدد نوع العمل المطلوب وعدد الواجهات أو المساحات الزجاجية إن أمكن.",
          de: "Definiere die Art der Arbeit und – wenn möglich – die Anzahl der Glasflächen.",
          en: "Define the type of work and, if possible, the number of window or glass surfaces.",
        },
        fields: [
          {
            id: "productType",
            type: "select",
            label: { ar: "نوع العمل", de: "Art der Arbeit", en: "Work Type" },
            options: [
              {
                value: "full-wrap",
                label: {
                  ar: "تغليف كامل للواجهة",
                  de: "Vollflächige Folierung",
                  en: "Full Window Wrap",
                },
              },
              {
                value: "cut-vinyl",
                label: {
                  ar: "قص حروف أو شعارات",
                  de: "Plotterfolie / Folienbuchstaben",
                  en: "Cut Vinyl Letters / Logos",
                },
              },
              {
                value: "one-way-vision",
                label: {
                  ar: "One Way Vision",
                  de: "One Way Vision",
                  en: "One Way Vision",
                },
              },
              {
                value: "transparent-vinyl",
                label: {
                  ar: "فينيل شفاف",
                  de: "Transparente Folie",
                  en: "Transparent Vinyl",
                },
              },
              {
                value: "frosted",
                label: {
                  ar: "زجاج رملي أو مطفي",
                  de: "Milchglasfolie / Frosted",
                  en: "Frosted Film",
                },
              },
              {
                value: "privacy",
                label: {
                  ar: "خصوصية أو تغطية",
                  de: "Sichtschutz",
                  en: "Privacy Film",
                },
              },
              {
                value: "promotion",
                label: {
                  ar: "إعلان أو عرض ترويجي",
                  de: "Werbeaktion / Promotion",
                  en: "Promotional Graphics",
                },
              },
              {
                value: "not-sure",
                label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" },
              },
            ],
            required: false,
            semanticGroup: "project",
            allowsUnknown: true,
            aiHint: "Main window graphics type.",
          },
          {
            id: "quantity",
            type: "number",
            label: {
              ar: "عدد الواجهات أو الأجزاء",
              de: "Anzahl der Flächen",
              en: "Number of Areas",
            },
            placeholder: { ar: "مثال: 2", de: "z. B. 2", en: "e.g. 2" },
            required: false,
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Approximate number of glass surfaces or sections.",
          },
          {
            id: "goal",
            type: "checkbox",
            label: {
              ar: "ما الهدف من العمل؟",
              de: "Welches Ziel hat die Folierung?",
              en: "What Is the Goal?",
            },
            options: [
              {
                value: "branding",
                label: { ar: "هوية وشعار", de: "Markenauftritt", en: "Branding" },
              },
              {
                value: "privacy",
                label: { ar: "خصوصية", de: "Sichtschutz", en: "Privacy" },
              },
              {
                value: "promotion",
                label: { ar: "إعلان وعروض", de: "Werbung / Aktionen", en: "Promotion" },
              },
              {
                value: "decoration",
                label: {
                  ar: "مظهر جمالي",
                  de: "Optische Gestaltung",
                  en: "Decorative Look",
                },
              },
              {
                value: "sun-control",
                label: {
                  ar: "تقليل رؤية أو ضوء",
                  de: "Sicht- / Lichtkontrolle",
                  en: "Light / Visibility Control",
                },
              },
            ],
            semanticGroup: "project",
            allowsUnknown: true,
            aiHint: "Main purpose of the window graphics project.",
          },
          {
            id: "deliveryDate",
            type: "text",
            label: {
              ar: "موعد التنفيذ المطلوب",
              de: "Wunschtermin",
              en: "Requested Date",
            },
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
          ar: "المقاسات والخامات",
          de: "Maße und Materialien",
          en: "Dimensions and Materials",
        },
        description: {
          ar: "أدخل المقاسات إن كانت معروفة واختر الخامة أو نوع الفينيل الأقرب لما تحتاجه.",
          de: "Gib Maße an, falls bekannt, und wähle das Material oder die Folienart, die am ehesten passt.",
          en: "Enter dimensions if known and choose the material or vinyl type that best matches your needs.",
        },
        fields: [
          {
            id: "size",
            type: "text",
            label: { ar: "المقاسات", de: "Maße", en: "Dimensions" },
            placeholder: {
              ar: "مثال: عرض × ارتفاع لكل واجهة أو لكل جزء زجاجي",
              de: "Beispiel: Breite × Höhe pro Fläche",
              en: "Example: width × height per glass section",
            },
            required: false,
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Dimensions per window or glass area.",
          },
          {
            id: "material",
            type: "select",
            label: {
              ar: "الخامة أو نوع الفينيل",
              de: "Material / Folientyp",
              en: "Material / Vinyl Type",
            },
            options: [
              {
                value: "transparent-vinyl",
                label: {
                  ar: "فينيل شفاف",
                  de: "Transparente Folie",
                  en: "Transparent Vinyl",
                },
              },
              {
                value: "opaque-vinyl",
                label: {
                  ar: "فينيل معتم",
                  de: "Opake Folie",
                  en: "Opaque Vinyl",
                },
              },
              {
                value: "one-way-vision",
                label: {
                  ar: "One Way Vision",
                  de: "One Way Vision",
                  en: "One Way Vision",
                },
              },
              {
                value: "frosted-film",
                label: {
                  ar: "فيلم مطفي / رملي",
                  de: "Milchglasfolie / Frosted",
                  en: "Frosted Film",
                },
              },
              {
                value: "plotter-film",
                label: {
                  ar: "فيلم قص حروف",
                  de: "Plotterfolie",
                  en: "Cut Vinyl Film",
                },
              },
              {
                value: "privacy-film",
                label: {
                  ar: "فيلم خصوصية",
                  de: "Sichtschutzfolie",
                  en: "Privacy Film",
                },
              },
              {
                value: "protective-film",
                label: {
                  ar: "فيلم حماية",
                  de: "Schutzfolie",
                  en: "Protective Film",
                },
              },
              {
                value: "not-sure",
                label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" },
              },
            ],
            semanticGroup: "materials",
            allowsUnknown: true,
            aiHint: "Window film material or preferred media type.",
          },
          {
            id: "printType",
            type: "select",
            label: {
              ar: "طريقة الطباعة أو الرؤية",
              de: "Druck- / Sichtart",
              en: "Print / Visibility Type",
            },
            options: [
              {
                value: "full-color",
                label: {
                  ar: "طباعة ملونة كاملة",
                  de: "Vollfarbdruck",
                  en: "Full Color Print",
                },
              },
              {
                value: "inside-glass",
                label: {
                  ar: "من داخل الزجاج",
                  de: "Von innen montiert",
                  en: "Inside Glass Application",
                },
              },
              {
                value: "outside-glass",
                label: {
                  ar: "من خارج الزجاج",
                  de: "Außen montiert",
                  en: "Outside Glass Application",
                },
              },
              {
                value: "double-sided-look",
                label: {
                  ar: "مظهر من الجهتين",
                  de: "Beidseitige Wirkung",
                  en: "Double-Sided Look",
                },
              },
              {
                value: "cut-only",
                label: {
                  ar: "قص فقط دون طباعة",
                  de: "Nur geplottet",
                  en: "Cut Only",
                },
              },
              {
                value: "not-sure",
                label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" },
              },
            ],
            semanticGroup: "production",
            allowsUnknown: true,
            aiHint: "Print direction, application side, or production style.",
          },
          {
            id: "finishing",
            type: "checkbox",
            label: {
              ar: "تفاصيل إضافية مطلوبة",
              de: "Zusätzliche Anforderungen",
              en: "Additional Requirements",
            },
            options: [
              {
                value: "lamination",
                label: {
                  ar: "لامينيشن أو حماية",
                  de: "Laminat / Schutz",
                  en: "Lamination / Protection",
                },
              },
              {
                value: "partial-cover",
                label: {
                  ar: "تغطية جزئية",
                  de: "Teilabdeckung",
                  en: "Partial Coverage",
                },
              },
              {
                value: "full-cover",
                label: {
                  ar: "تغطية كاملة",
                  de: "Vollabdeckung",
                  en: "Full Coverage",
                },
              },
              {
                value: "privacy-cut",
                label: {
                  ar: "خصوصية مع قص أو تصميم",
                  de: "Sichtschutz mit Design",
                  en: "Privacy with Design",
                },
              },
              {
                value: "easy-removal",
                label: {
                  ar: "سهل الإزالة لاحقًا",
                  de: "Später leicht entfernbar",
                  en: "Easy to Remove Later",
                },
              },
            ],
            semanticGroup: "production",
            allowsUnknown: true,
            aiHint:
              "Post-processing and functional requirements for the film.",
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
          ar: "حدد ما إذا كان التصميم جاهزًا وهل هناك حاجة للتركيب أو المعاينة.",
          de: "Gib an, ob ein Design vorhanden ist und ob Montage oder Vor-Ort-Besichtigung benötigt wird.",
          en: "Specify whether the design is ready and whether installation or a site visit is needed.",
        },
        fields: [
          {
            id: "designReady",
            type: "radio",
            label: {
              ar: "هل التصميم جاهز؟",
              de: "Design vorhanden?",
              en: "Design Ready?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
              {
                value: "partial",
                label: {
                  ar: "جزئي أو فكرة فقط",
                  de: "Teilweise / nur Idee",
                  en: "Partial / Only an Idea",
                },
              },
            ],
            required: false,
            semanticGroup: "design",
            allowsUnknown: true,
            aiHint:
              "Whether the customer already has final artwork, draft artwork, or only an idea.",
          },
          {
            id: "installation",
            type: "radio",
            label: {
              ar: "هل تحتاج تركيب؟",
              de: "Montage benötigt?",
              en: "Need Installation?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
              {
                value: "not-sure",
                label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" },
              },
            ],
            semanticGroup: "installation",
            allowsUnknown: true,
            aiHint: "Whether installation service is required.",
          },
          {
            id: "siteVisit",
            type: "radio",
            label: {
              ar: "هل تحتاج معاينة أو قياس؟",
              de: "Besichtigung oder Aufmaß nötig?",
              en: "Need Site Visit or Measurement?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
              {
                value: "not-sure",
                label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" },
              },
            ],
            semanticGroup: "installation",
            allowsUnknown: true,
            aiHint:
              "Whether a site survey or measurement is needed before production.",
          },
          {
            id: "photosAvailable",
            type: "radio",
            label: {
              ar: "هل لديك صور للواجهة الزجاجية؟",
              de: "Fotos der Glasfassade vorhanden?",
              en: "Do You Have Window Front Photos?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
            ],
            semanticGroup: "attachments",
            allowsUnknown: true,
            aiHint:
              "Whether reference photos are available for estimation.",
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
              ar: "ملاحظات",
              de: "Zusätzliche Details",
              en: "Additional Details",
            },
            placeholder: {
              ar: "اذكر مكان الموقع، عدد الواجهات، نوع الخصوصية أو التغطية المطلوبة، وهل يوجد تركيب",
              de: "Standort, Anzahl der Glasflächen, gewünschte Sichtschutzart und Montagebedarf angeben",
              en: "Mention location, number of glass surfaces, desired privacy or coverage type, and whether installation is needed",
            },
            semanticGroup: "notes",
            aiHint: "Location and additional practical notes for window graphics work.",
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
          ar: "صور للزجاج أو الواجهة تساعد في تقدير العمل بدقة أكبر.",
          de: "Fotos der Glasflächen helfen bei der genaueren Einschätzung des Aufwands.",
          en: "Photos of the glass facade help estimate the work more accurately.",
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
      ar: "تركيب وصيانة وفك واستبدال اللوحات",
      de: "Schildermontage, Wartung & Austausch",
      en: "Sign Installation, Maintenance & Replacement",
    },
    description: {
      ar: "طلبات تركيب اللوحات الإعلانية وصيانتها وفكها واستبدالها، سواء للوحات قائمة أو تجهيزات جديدة تحتاج دعماً موقعيًا.",
      de: "Anfragen für Montage, Wartung, Demontage und Austausch von Werbeschildern – für bestehende Anlagen oder neue Projekte mit Vor-Ort-Bedarf.",
      en: "Requests for sign installation, maintenance, removal, and replacement for both existing signage and new projects requiring on-site support.",
    },
    intro: {
      ar: "هذا النموذج مخصص لخدمات التركيب والصيانة والفك والاستبدال. إذا كانت لديك لوحة قائمة تحتاج إصلاحًا أو تغييرًا، أو لوحة جديدة تحتاج تركيبًا فقط، يمكنك تحديد ذلك بسهولة هنا.",
      de: "Dieses Formular ist für Montage, Wartung, Demontage und Austausch gedacht. Wenn du ein bestehendes Schild reparieren, ersetzen oder nur ein neues Schild montieren lassen möchtest, kannst du das hier einfach angeben.",
      en: "This form is intended for installation, maintenance, removal, and replacement services. If you have an existing sign that needs repair or replacement, or a new sign that only needs installation, you can specify that here easily.",
    },
    requestGuidance: [
      {
        ar: "اذكر الارتفاع التقريبي وحالة اللوحة إن أمكن، لأن ذلك يؤثر على التكلفة وطريقة التنفيذ.",
        de: "Bitte gib möglichst die ungefähre Höhe und den Zustand des Schildes an, da dies Aufwand und Kosten beeinflusst.",
        en: "Please mention the approximate height and sign condition if possible, as this affects cost and execution planning.",
      },
      {
        ar: "إذا كان هناك حاجة لرافعة أو كهربائي أو فك لوحة قديمة فاذكر ذلك بوضوح.",
        de: "Falls Hebebühne, Elektriker oder die Demontage eines alten Schildes nötig sind, bitte klar angeben.",
        en: "If a lift, electrician, or removal of an old sign is needed, please mention it clearly.",
      },
    ],
    seo: {
      slug: "sign-installation-maintenance",
      categorySlug: "signage",
      metaTitle: {
        ar: "تركيب وصيانة لوحات محلات في برلين | Caro Bara Smart Print",
        de: "Schildermontage & Wartung in Berlin | Caro Bara Smart Print",
        en: "Sign Installation & Maintenance in Berlin | Caro Bara Smart Print",
      },
      metaDescription: {
        ar: "اطلب تركيب أو صيانة أو فك أو استبدال اللوحات الإعلانية في برلين عبر نموذج منظم يوضح حالة الموقع ومتطلبات التنفيذ.",
        de: "Montage, Wartung, Demontage oder Austausch von Werbeschildern in Berlin über ein strukturiertes Anfrageformular anfragen.",
        en: "Request sign installation, maintenance, removal, or replacement in Berlin through a structured form that captures site and execution needs.",
      },
    },
    aiSummaryHint:
      "Summarize the installation or maintenance request with service type, sign condition, site conditions, height, material, required tools, electrical needs, urgency, and missing technical details.",
    sections: [
      createContactSection(),
      {
        id: "service-basics",
        title: {
          ar: "نوع الخدمة المطلوبة",
          de: "Gewünschte Serviceart",
          en: "Requested Service Type",
        },
        description: {
          ar: "حدد نوع العمل المطلوب وعدد العناصر أو المواقع والموعد إذا كان معروفًا.",
          de: "Definiere die gewünschte Leistung, die Anzahl der Elemente oder Standorte und den Termin, falls bekannt.",
          en: "Define the requested work type, the number of items or locations, and the timeline if known.",
        },
        fields: [
          {
            id: "productType",
            type: "select",
            label: { ar: "نوع الخدمة", de: "Serviceart", en: "Service Type" },
            options: [
              {
                value: "installation",
                label: {
                  ar: "تركيب لوحة جديدة",
                  de: "Montage eines neuen Schildes",
                  en: "Install a New Sign",
                },
              },
              {
                value: "maintenance",
                label: {
                  ar: "صيانة لوحة قائمة",
                  de: "Wartung eines bestehenden Schildes",
                  en: "Maintain an Existing Sign",
                },
              },
              {
                value: "repair",
                label: {
                  ar: "إصلاح عطل أو ضرر",
                  de: "Reparatur eines Schadens / Defekts",
                  en: "Repair Damage or Fault",
                },
              },
              {
                value: "replacement",
                label: {
                  ar: "استبدال لوحة أو جزء منها",
                  de: "Austausch eines Schildes oder Teils",
                  en: "Replace a Sign or Part",
                },
              },
              {
                value: "removal",
                label: {
                  ar: "فك أو إزالة لوحة",
                  de: "Demontage / Entfernung",
                  en: "Remove a Sign",
                },
              },
              {
                value: "relocation",
                label: {
                  ar: "نقل لوحة من مكان لآخر",
                  de: "Umsetzung / Versetzen",
                  en: "Relocate a Sign",
                },
              },
              {
                value: "electrical-fix",
                label: {
                  ar: "مشكلة كهرباء أو إضاءة",
                  de: "Elektrik- / Beleuchtungsproblem",
                  en: "Electrical or Lighting Issue",
                },
              },
              {
                value: "not-sure",
                label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" },
              },
            ],
            required: false,
            semanticGroup: "project",
            allowsUnknown: true,
            aiHint:
              "Main service request type for installation, maintenance, removal, repair, or replacement.",
          },
          {
            id: "quantity",
            type: "number",
            label: { ar: "العدد", de: "Anzahl", en: "Quantity" },
            placeholder: { ar: "مثال: 1", de: "z. B. 1", en: "e.g. 1" },
            required: false,
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Number of signs, parts, or locations involved.",
          },
          {
            id: "deliveryDate",
            type: "text",
            label: {
              ar: "موعد التنفيذ المطلوب",
              de: "Wunschtermin",
              en: "Requested Date",
            },
            placeholder: {
              ar: "اكتب الموعد المطلوب",
              de: "Wunschtermin eingeben",
              en: "Enter requested date",
            },
            semanticGroup: "delivery",
            allowsUnknown: true,
            aiHint: "Requested service timing.",
          },
          {
            id: "urgency",
            type: "select",
            label: {
              ar: "درجة الاستعجال",
              de: "Dringlichkeit",
              en: "Urgency",
            },
            options: [
              {
                value: "emergency",
                label: {
                  ar: "عاجل جدًا / عطل فوري",
                  de: "Sehr dringend / Notfall",
                  en: "Emergency / Very Urgent",
                },
              },
              {
                value: "soon",
                label: { ar: "قريبًا", de: "Bald", en: "Soon" },
              },
              {
                value: "planned",
                label: { ar: "مجدول", de: "Geplant", en: "Planned" },
              },
              {
                value: "flexible",
                label: { ar: "مرن", de: "Flexibel", en: "Flexible" },
              },
            ],
            semanticGroup: "delivery",
            allowsUnknown: true,
            aiHint:
              "The urgency level of the installation or maintenance request.",
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
          ar: "أدخل المقاسات أو المواد أو ظروف التركيب إن كانت معروفة، وحدد ما الذي يحدث في الموقع حاليًا.",
          de: "Gib Maße, Material oder Montagebedingungen an, sofern bekannt, und beschreibe, was aktuell vor Ort vorhanden ist.",
          en: "Provide dimensions, materials, or installation conditions if known, and describe the current on-site situation.",
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
            aiHint: "Dimensions of the sign or mounting area.",
          },
          {
            id: "material",
            type: "select",
            label: {
              ar: "مادة اللوحة أو العنصر",
              de: "Material des Schildes",
              en: "Sign Material",
            },
            options: [
              {
                value: "dibond",
                label: { ar: "ديبوند", de: "Dibond", en: "Dibond" },
              },
              {
                value: "acrylic",
                label: { ar: "أكريليك", de: "Acryl", en: "Acrylic" },
              },
              {
                value: "aluminum",
                label: { ar: "ألمنيوم", de: "Aluminium", en: "Aluminum" },
              },
              { value: "pvc", label: { ar: "PVC", de: "PVC", en: "PVC" } },
              {
                value: "metal",
                label: { ar: "معدن", de: "Metall", en: "Metal" },
              },
              {
                value: "illuminated",
                label: {
                  ar: "لوحة مضيئة",
                  de: "Beleuchtetes Schild",
                  en: "Illuminated Sign",
                },
              },
              {
                value: "letters",
                label: {
                  ar: "حروف منفصلة",
                  de: "Einzelbuchstaben",
                  en: "Individual Letters",
                },
              },
              {
                value: "not-sure",
                label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" },
              },
            ],
            semanticGroup: "materials",
            allowsUnknown: true,
            aiHint: "Existing or target sign materials.",
          },
          {
            id: "printType",
            type: "select",
            label: {
              ar: "وضعية العمل في الموقع",
              de: "Situation vor Ort",
              en: "On-Site Work Situation",
            },
            options: [
              {
                value: "indoor",
                label: { ar: "داخلية", de: "Innenbereich", en: "Indoor" },
              },
              {
                value: "outdoor",
                label: { ar: "خارجية", de: "Außenbereich", en: "Outdoor" },
              },
              {
                value: "high-position",
                label: { ar: "مكان مرتفع", de: "Hoch gelegen", en: "High Position" },
              },
              {
                value: "needs-lift",
                label: { ar: "قد يحتاج رافعة", de: "Hebebühne nötig", en: "Lift Required" },
              },
              {
                value: "electrical-access",
                label: {
                  ar: "يوجد عمل كهرباء",
                  de: "Elektroarbeit nötig",
                  en: "Electrical Work Needed",
                },
              },
              {
                value: "old-sign-removal",
                label: {
                  ar: "يوجد فك لوحة قديمة",
                  de: "Altes Schild muss entfernt werden",
                  en: "Old Sign Must Be Removed",
                },
              },
              {
                value: "not-sure",
                label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" },
              },
            ],
            required: false,
            semanticGroup: "installation",
            allowsUnknown: true,
            aiHint:
              "Execution context such as indoor/outdoor, height, lift requirement, and removal status.",
          },
          {
            id: "finishing",
            type: "checkbox",
            label: {
              ar: "ما المطلوب في العمل؟",
              de: "Was wird bei der Ausführung benötigt?",
              en: "What Is Needed in the Job?",
            },
            options: [
              {
                value: "cleaning",
                label: { ar: "تنظيف", de: "Reinigung", en: "Cleaning" },
              },
              {
                value: "repair",
                label: { ar: "إصلاح", de: "Reparatur", en: "Repair" },
              },
              {
                value: "electrical-extension",
                label: {
                  ar: "تمديد أو فحص كهرباء",
                  de: "Elektroanschluss / Prüfung",
                  en: "Electrical Extension / Check",
                },
              },
              {
                value: "replace-face",
                label: {
                  ar: "تبديل الواجهة أو الطبعة",
                  de: "Front / Grafik austauschen",
                  en: "Replace Face / Print",
                },
              },
              {
                value: "replace-led",
                label: {
                  ar: "تبديل LED أو إضاءة",
                  de: "LED / Beleuchtung tauschen",
                  en: "Replace LED / Lighting",
                },
              },
              {
                value: "full-removal",
                label: { ar: "فك كامل", de: "Komplette Demontage", en: "Full Removal" },
              },
              {
                value: "reinstall",
                label: { ar: "إعادة تركيب", de: "Wieder-Montage", en: "Reinstallation" },
              },
            ],
            semanticGroup: "production",
            allowsUnknown: true,
            aiHint:
              "Specific maintenance, replacement, removal, or finishing requirements.",
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
            aiHint:
              "Whether files, drawings, or reference photos are available.",
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
            label: {
              ar: "ملاحظات",
              de: "Zusätzliche Details",
              en: "Additional Details",
            },
            placeholder: {
              ar: "اذكر الموقع، الارتفاع، حالة اللوحة، هل يوجد كهرباء، هل هناك لوحة قديمة، وأي ملاحظات مهمة للتنفيذ",
              de: "Standort, Höhe, Zustand des Schildes, Stromsituation, altes Schild und weitere wichtige Hinweise angeben",
              en: "Mention location, height, sign condition, electricity situation, old sign status, and any other important execution notes",
            },
            semanticGroup: "notes",
            aiHint:
              "Important practical notes for maintenance and on-site work.",
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
    category: "display",
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
      categorySlug: "display",
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
            label: {
              ar: "نوع العنصر",
              de: "Art des Produkts",
              en: "Item Type",
            },
            required: false,
            options: [
              {
                value: "banner",
                label: { ar: "بنر", de: "Banner", en: "Banner" },
              },
              {
                value: "rollup",
                label: { ar: "رول أب", de: "Roll-Up", en: "Roll-Up" },
              },
              { value: "flag", label: { ar: "علم", de: "Fahne", en: "Flag" } },
              {
                value: "mesh-banner",
                label: { ar: "بنر شبكي", de: "Mesh-Banner", en: "Mesh Banner" },
              },
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
            label: {
              ar: "العرض (سم)",
              de: "Breite (cm)",
              en: "Width (cm)",
            },
            placeholder: {
              ar: "مثال: 85",
              de: "Beispiel: 85",
              en: "Example: 85",
            },
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Width in centimeters.",
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
              ar: "مثال: 200",
              de: "Beispiel: 200",
              en: "Example: 200",
            },
            semanticGroup: "dimensions",
            allowsUnknown: true,
            aiHint: "Height in centimeters.",
          },
          {
            id: "material",
            type: "select",
            label: {
              ar: "الخامة",
              de: "Material",
              en: "Material",
            },
            options: [
              {
                value: "pvc-banner",
                label: { ar: "PVC بنر", de: "PVC-Banner", en: "PVC Banner" },
              },
              { value: "mesh", label: { ar: "مش", de: "Mesh", en: "Mesh" } },
              {
                value: "fabric",
                label: { ar: "قماش", de: "Stoff", en: "Fabric" },
              },
              {
                value: "flag-fabric",
                label: { ar: "قماش أعلام", de: "Fahnenstoff", en: "Flag Fabric" },
              },
            ],
            semanticGroup: "materials",
            allowsUnknown: true,
            aiHint: "Material type for banner, flag, or roll-up.",
          },
          {
            id: "finishing",
            type: "checkbox",
            label: {
              ar: "التشطيب",
              de: "Verarbeitung",
              en: "Finishing",
            },
            options: [
              { value: "hem", label: { ar: "حاشية", de: "Saum", en: "Hem" } },
              {
                value: "eyelets",
                label: { ar: "عيون تعليق", de: "Ösen", en: "Eyelets" },
              },
              {
                value: "pole-pocket",
                label: { ar: "جيب عصا", de: "Hohlsaum", en: "Pole Pocket" },
              },
              {
                value: "stand",
                label: { ar: "قاعدة", de: "Standfuß", en: "Stand" },
              },
            ],
            semanticGroup: "production",
            allowsUnknown: true,
            aiHint: "Required finishing and hardware.",
          },
          {
            id: "usagePlace",
            type: "radio",
            label: {
              ar: "مكان الاستخدام",
              de: "Einsatzort",
              en: "Usage Location",
            },
            options: [
              {
                value: "indoor",
                label: { ar: "داخلي", de: "Innenbereich", en: "Indoor" },
              },
              {
                value: "outdoor",
                label: { ar: "خارجي", de: "Außenbereich", en: "Outdoor" },
              },
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
            label: {
              ar: "تفاصيل إضافية",
              de: "Zusätzliche Details",
              en: "Additional Details",
            },
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