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

export const smartServices: Service[] = [
  {
    id: "open-request",
    category: "smart",
    title: {
      ar: "طلب ذكي مفتوح",
      de: "Offene intelligente Anfrage",
      en: "Smart Open Request",
    },
    description: {
      ar: "إذا لم تكن متأكدًا مما تحتاجه، صف مشروعك بحرية وسنساعدك على تنظيمه وتحويله إلى طلب واضح قابل للتنفيذ.",
      de: "Wenn du noch nicht genau weißt, was du brauchst, beschreibe dein Projekt frei und wir helfen dir, es in eine klare und umsetzbare Anfrage zu verwandeln.",
      en: "If you are not sure what you need, describe your project freely and we will help turn it into a clear, actionable request.",
    },
    intro: {
      ar: "هذا النموذج مناسب عندما تكون لديك فكرة أو مشروع أو حاجة غير مرتبة بعد. اكتب ما تعرفه، وأرفق ما لديك من صور أو ملفات أو أمثلة، وسنساعدك على بناء طلب احترافي واضح.",
      de: "Dieses Formular ist geeignet, wenn du eine Idee, ein Projekt oder einen Bedarf hast, der noch nicht vollständig strukturiert ist. Beschreibe, was du weißt, und füge Bilder, Dateien oder Beispiele hinzu.",
      en: "This form is suitable when you have an idea, a project, or a need that is not yet fully structured. Write what you know and attach any photos, files, or references you have.",
    },
    requestGuidance: [
      {
        ar: "إذا لم تكن تعرف نوع الخدمة المناسب، لا مشكلة. صف النشاط أو المشروع أو المكان وما الذي تريد الوصول إليه.",
        de: "Wenn du nicht weißt, welche Leistung die richtige ist, ist das kein Problem. Beschreibe einfach dein Geschäft, Projekt oder den Ort und was du erreichen möchtest.",
        en: "If you do not know which service is the right one, that is fine. Just describe your business, project, or place and what you want to achieve.",
      },
      {
        ar: "كل صورة أو ملف أو مثال مرجعي يساعدنا على فهم الطلب بشكل أسرع وأدق.",
        de: "Jedes Bild, jede Datei oder jedes Referenzbeispiel hilft uns, die Anfrage schneller und genauer zu verstehen.",
        en: "Any photo, file, or reference example helps us understand the request faster and more accurately.",
      },
    ],
    seo: {
      slug: "open-request",
      categorySlug: "smart",
      metaTitle: {
        ar: "طلب ذكي مفتوح",
        de: "Offene intelligente Anfrage",
        en: "Smart Open Request",
      },
      metaDescription: {
        ar: "ابدأ بطلب مفتوح إذا لم تكن متأكدًا من الخدمة المناسبة، وسنساعدك على تنظيم المشروع بشكل صحيح.",
        de: "Starte mit einer offenen Anfrage, wenn du dir über die passende Leistung nicht sicher bist, und wir helfen dir bei der richtigen Strukturierung.",
        en: "Start with an open request if you are not sure which service fits, and we will help structure your project correctly.",
      },
    },
    aiSummaryHint:
      "Summarize the open request with project type, stage, needs, available references, location context, and the user's main goal.",
    sections: [
      createContactSection(),
      {
        id: "project-basics",
        title: {
          ar: "فكرة المشروع",
          de: "Projektidee",
          en: "Project Idea",
        },
        description: {
          ar: "اكتب نوع المشروع أو النشاط والمرحلة التي وصل إليها حاليًا.",
          de: "Beschreibe die Art des Projekts oder Geschäfts und den aktuellen Stand.",
          en: "Write the type of project or business and its current stage.",
        },
        fields: [
          {
            id: "projectType",
            type: "text",
            label: {
              ar: "نوع المشروع أو النشاط",
              de: "Art des Projekts oder Geschäfts",
              en: "Project or Business Type",
            },
            placeholder: {
              ar: "مثال: مطعم، متجر، كافيه، مكتب، مشروع جديد...",
              de: "Beispiel: Restaurant, Laden, Café, Büro, neues Projekt...",
              en: "Example: restaurant, shop, café, office, new project...",
            },
            semanticGroup: "project",
            allowsUnknown: true,
            aiHint: "General business or project type.",
          },
          {
            id: "projectStage",
            type: "radio",
            label: {
              ar: "مرحلة المشروع",
              de: "Projektphase",
              en: "Project Stage",
            },
            options: [
              { value: "idea", label: { ar: "فكرة", de: "Idee", en: "Idea" } },
              { value: "new", label: { ar: "افتتاح جديد", de: "Neueröffnung", en: "New Opening" } },
              {
                value: "existing",
                label: {
                  ar: "قائم ويحتاج تطوير",
                  de: "Bestehend und braucht Entwicklung",
                  en: "Existing and Needs Development",
                },
              },
            ],
            semanticGroup: "project",
            allowsUnknown: true,
            aiHint: "Current stage of the project.",
          },
          {
            id: "locationContext",
            type: "text",
            label: {
              ar: "معلومات عن المكان أو الموقع",
              de: "Informationen zum Ort oder Standort",
              en: "Place or Location Context",
            },
            placeholder: {
              ar: "مثال: محل على شارع رئيسي، كافيه صغير، مكتب داخلي...",
              de: "Beispiel: Laden an Hauptstraße, kleines Café, Innenbüro...",
              en: "Example: shop on a main street, small café, interior office...",
            },
            semanticGroup: "project",
            allowsUnknown: true,
            aiHint: "Context about the place or physical environment.",
          },
        ],
      },
      {
        id: "needs",
        title: {
          ar: "ما الذي تحتاجه تقريبًا؟",
          de: "Was wird ungefähr benötigt?",
          en: "What Do You Roughly Need?",
        },
        description: {
          ar: "اختر ما تعتقد أنه قريب من طلبك حتى لو لم تكن متأكدًا تمامًا.",
          de: "Wähle aus, was deiner Anfrage ungefähr entspricht, auch wenn du dir nicht ganz sicher bist.",
          en: "Choose what seems closest to your request, even if you are not fully sure.",
        },
        fields: [
          {
            id: "needs",
            type: "checkbox",
            label: {
              ar: "الاحتياجات المتوقعة",
              de: "Vermutete Anforderungen",
              en: "Expected Needs",
            },
            options: [
              { value: "printing", label: { ar: "مطبوعات", de: "Druck", en: "Printing" } },
              { value: "signage", label: { ar: "لوحات", de: "Schilder", en: "Signs" } },
              { value: "branding", label: { ar: "هوية بصرية", de: "Branding", en: "Branding" } },
              { value: "packaging", label: { ar: "تغليف", de: "Verpackung", en: "Packaging" } },
              { value: "vehicle", label: { ar: "مركبات", de: "Fahrzeuge", en: "Vehicle" } },
              { value: "decor", label: { ar: "تجهيز أو ديكور", de: "Ausbau oder Dekor", en: "Setup or Decor" } },
              { value: "marketing", label: { ar: "تسويق", de: "Marketing", en: "Marketing" } },
              { value: "not-sure", label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not Sure" } },
            ],
            semanticGroup: "project",
            allowsUnknown: true,
            aiHint: "Broad need categories selected by the user.",
          },
          {
            id: "mainGoal",
            type: "textarea",
            label: {
              ar: "ما الهدف الذي تريد الوصول إليه؟",
              de: "Welches Ziel möchtest du erreichen?",
              en: "What Goal Do You Want to Reach?",
            },
            placeholder: {
              ar: "اكتب النتيجة التي تريدها: جذب العملاء، تجهيز محل، طباعة افتتاح، إعادة تنظيم الهوية...",
              de: "Beschreibe das gewünschte Ergebnis: Kunden gewinnen, Laden vorbereiten, Eröffnungsdrucksachen, Markenauftritt verbessern...",
              en: "Describe the result you want: attract customers, prepare a shop, launch print materials, improve brand appearance...",
            },
            semanticGroup: "notes",
            aiHint: "The desired end result or project goal.",
          },
        ],
      },
      {
        id: "references",
        title: {
          ar: "الصور والملفات المرجعية",
          de: "Referenzen und Dateien",
          en: "References and Files",
        },
        description: {
          ar: "حدد إن كانت لديك صور أو ملفات أو أمثلة مرجعية تساعد في فهم الطلب.",
          de: "Gib an, ob du Bilder, Dateien oder Referenzen hast, die beim Verständnis helfen.",
          en: "Indicate whether you have photos, files, or references that help explain the request.",
        },
        fields: [
          {
            id: "hasSitePhotos",
            type: "radio",
            label: {
              ar: "هل لديك صور للموقع أو المكان؟",
              de: "Hast du Fotos vom Ort oder Standort?",
              en: "Do You Have Site or Location Photos?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
            ],
            semanticGroup: "attachments",
            allowsUnknown: true,
            aiHint: "Whether site or location photos are available.",
          },
          {
            id: "hasDesignFiles",
            type: "radio",
            label: {
              ar: "هل لديك ملفات تصميم أو شعارات أو مقاسات؟",
              de: "Hast du Designdateien, Logos oder Maße?",
              en: "Do You Have Design Files, Logos, or Measurements?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
            ],
            semanticGroup: "attachments",
            allowsUnknown: true,
            aiHint: "Whether design files, logos, or measurements are available.",
          },
          {
            id: "hasReferenceExamples",
            type: "radio",
            label: {
              ar: "هل لديك أمثلة مرجعية تعجبك؟",
              de: "Hast du Referenzbeispiele, die dir gefallen?",
              en: "Do You Have Reference Examples You Like?",
            },
            options: [
              { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
              { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
            ],
            semanticGroup: "attachments",
            allowsUnknown: true,
            aiHint: "Whether reference inspirations are available.",
          },
        ],
      },
      {
        id: "notes",
        title: {
          ar: "وصف حر",
          de: "Freie Beschreibung",
          en: "Free Description",
        },
        fields: [
          {
            id: "vision",
            type: "textarea",
            label: {
              ar: "صف فكرتك أو تصورك",
              de: "Beschreibe deine Idee oder Vorstellung",
              en: "Describe Your Idea or Vision",
            },
            placeholder: {
              ar: "اكتب بحرية ماذا تريد، ما الذي ينقص المشروع، وما الذي تريد أن نساعدك فيه",
              de: "Beschreibe frei, was du möchtest, was dem Projekt fehlt und wobei wir dir helfen sollen",
              en: "Write freely what you want, what the project is missing, and how you want us to help",
            },
            semanticGroup: "notes",
            aiHint: "Main freeform project description.",
          },
        ],
      },
    ],
    attachments: [
      {
        id: "site-photos",
        kind: "site-photos",
        title: {
          ar: "صور الموقع أو المكان",
          de: "Fotos vom Standort oder Ort",
          en: "Site or Location Photos",
        },
        description: {
          ar: "صور الواجهة أو الداخل أو أي مكان متعلق بالمشروع.",
          de: "Fotos von Fassade, Innenraum oder jedem relevanten Ort des Projekts.",
          en: "Photos of the facade, interior, or any place related to the project.",
        },
        required: false,
        multiple: true,
      },
      {
        id: "design-files",
        kind: "design-files",
        title: {
          ar: "ملفات التصميم أو الشعارات",
          de: "Designdateien oder Logos",
          en: "Design Files or Logos",
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