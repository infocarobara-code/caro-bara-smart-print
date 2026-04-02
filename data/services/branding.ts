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

export const brandingServices: Service[] = [
  {
    id: "branding-design",
    category: "branding-design",
    title: {
      ar: "الهوية البصرية والتصميم",
      de: "Branding & Design",
      en: "Branding & Design",
    },
    description: {
      ar: "شعارات، ألوان، بطاقات، منيوهات، واجهات، وحضور بصري كامل للمشروع.",
      de: "Logos, Farben, Karten, Menüs, Fassaden und ein vollständiger visueller Auftritt.",
      en: "Logos, colors, cards, menus, facades, and a complete visual identity for the business.",
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
        id: "businessType",
        type: "text",
        label: { ar: "نوع المشروع أو النشاط", de: "Art des Geschäfts", en: "Type of Business" },
        placeholder: {
          ar: "مثال: مطعم، متجر ملابس، شركة تنظيف",
          de: "Beispiel: Restaurant, Bekleidungsgeschäft, Reinigungsfirma",
          en: "Example: restaurant, clothing store, cleaning company",
        },
      },
      {
        id: "projectStage",
        type: "radio",
        label: { ar: "هل هو مشروع جديد أم تجديد؟", de: "Neues Projekt oder Relaunch?", en: "New Project or Redesign?" },
        options: [
          { value: "new", label: { ar: "جديد", de: "Neu", en: "New" } },
          { value: "renewal", label: { ar: "تجديد", de: "Relaunch", en: "Redesign" } },
          { value: "existing", label: { ar: "قائم", de: "Bestehend", en: "Existing" } },
        ],
      },
      {
        id: "targetAudience",
        type: "text",
        label: { ar: "الفئة المستهدفة", de: "Zielgruppe", en: "Target Audience" },
        placeholder: {
          ar: "مثال: عائلات، شباب، شركات، أطفال",
          de: "Beispiel: Familien, Jugendliche, Firmen, Kinder",
          en: "Example: families, youth, companies, children",
        },
      },
      {
        id: "brandStyle",
        type: "checkbox",
        label: { ar: "الطابع المطلوب", de: "Gewünschter Stil", en: "Preferred Style" },
        options: [
          { value: "luxury", label: { ar: "فاخر", de: "Luxuriös", en: "Luxury" } },
          { value: "modern", label: { ar: "عصري", de: "Modern", en: "Modern" } },
          { value: "classic", label: { ar: "كلاسيكي", de: "Klassisch", en: "Classic" } },
          { value: "minimal", label: { ar: "بسيط", de: "Minimal", en: "Minimal" } },
          { value: "bold", label: { ar: "جريء", de: "Markant", en: "Bold" } },
        ],
      },
      {
        id: "neededItems",
        type: "checkbox",
        label: { ar: "ما الذي تحتاجه؟", de: "Was wird benötigt?", en: "What Do You Need?" },
        options: [
          { value: "logo", label: { ar: "شعار", de: "Logo", en: "Logo" } },
          { value: "business-cards", label: { ar: "بطاقات", de: "Visitenkarten", en: "Business Cards" } },
          { value: "menu", label: { ar: "منيو", de: "Menü", en: "Menu" } },
          { value: "facade", label: { ar: "واجهة", de: "Fassade", en: "Facade" } },
          { value: "social-media", label: { ar: "تصاميم سوشال", de: "Social Media Designs", en: "Social Media Designs" } },
          { value: "packaging", label: { ar: "تغليف", de: "Verpackung", en: "Packaging" } },
          { value: "full-identity", label: { ar: "هوية كاملة", de: "Komplette Identität", en: "Full Identity" } },
        ],
      },
      {
        id: "favoriteColors",
        type: "text",
        label: { ar: "الألوان المفضلة", de: "Bevorzugte Farben", en: "Preferred Colors" },
        placeholder: { ar: "مثال: أسود وذهبي", de: "Beispiel: Schwarz und Gold", en: "Example: Black and Gold" },
      },
      {
        id: "avoidColors",
        type: "text",
        label: { ar: "ألوان لا تريدها", de: "Farben, die vermieden werden sollen", en: "Colors to Avoid" },
        placeholder: {
          ar: "اكتب الألوان التي لا ترغب بها",
          de: "Gib Farben an, die du nicht möchtest",
          en: "Write colors you do not want",
        },
      },
      {
        id: "hasReference",
        type: "radio",
        label: { ar: "هل لديك أمثلة مرجعية؟", de: "Hast du Referenzbeispiele?", en: "Do You Have References?" },
        options: [
          { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
          { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
        ],
      },
      {
        id: "notes",
        type: "textarea",
        label: { ar: "صف رؤيتك", de: "Beschreibe deine Vision", en: "Describe Your Vision" },
        placeholder: {
          ar: "اكتب ما الذي تتخيله لمشروعك من ألوان، أسلوب، فئة، رسالة، وانطباع بصري",
          de: "Beschreibe Farben, Stil, Zielgruppe, Markenbotschaft und visuellen Eindruck",
          en: "Describe colors, style, target audience, brand message, and visual impression",
        },
      },
    ],
  },

  {
    id: "logo-design-only",
    category: "branding-design",
    title: {
      ar: "تصميم شعار فقط",
      de: "Logo Design",
      en: "Logo Design Only",
    },
    description: {
      ar: "طلب تصميم شعار احترافي فقط بدون باكج كامل.",
      de: "Anfrage für ein professionelles Logo ohne komplettes Branding-Paket.",
      en: "Request for a professional logo design without full branding package.",
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
        label: { ar: "اسم المشروع أو النشاط", de: "Projektname / Branche", en: "Project Name / Business Type" },
        placeholder: {
          ar: "مثال: مطعم، شركة طباعة، متجر...",
          de: "z. B. Restaurant, Druckerei, Shop...",
          en: "e.g. restaurant, printing company, shop...",
        },
      },
      {
        id: "style",
        type: "text",
        label: { ar: "نوع التصميم المطلوب", de: "Designstil", en: "Design Style" },
        placeholder: {
          ar: "حديث، كلاسيك، فاخر، بسيط...",
          de: "modern, klassisch, elegant, minimal...",
          en: "modern, classic, luxury, minimal...",
        },
      },
      {
        id: "colors",
        type: "text",
        label: { ar: "الألوان المطلوبة", de: "Farben", en: "Colors" },
        placeholder: {
          ar: "اذكر الألوان أو اترك للمصمم",
          de: "Farben angeben oder offen lassen",
          en: "specify colors or leave to designer",
        },
      },
      {
        id: "usage",
        type: "text",
        label: { ar: "استخدام الشعار", de: "Verwendung", en: "Usage" },
        placeholder: {
          ar: "لوحات، سوشيال ميديا، طباعة...",
          de: "Schilder, Social Media, Druck...",
          en: "signage, social media, printing...",
        },
      },
      {
        id: "designReady",
        type: "radio",
        label: { ar: "هل لديك فكرة أو مثال؟", de: "Haben Sie Beispiele?", en: "Do you have examples?" },
        options: [
          { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
          { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
        ],
      },
      {
        id: "quantity",
        type: "number",
        label: { ar: "عدد النماذج المطلوبة", de: "Anzahl der Vorschläge", en: "Number of Concepts" },
        placeholder: { ar: "مثال: 3", de: "z. B. 3", en: "e.g. 3" },
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
          ar: "اذكر أي أفكار، أمثلة، أو ملاحظات مهمة",
          de: "Ideen, Beispiele oder wichtige Hinweise angeben",
          en: "write any ideas, examples, or important notes",
        },
      },
    ],
  },

  {
    id: "marketing-solutions",
    category: "branding-design",
    title: {
      ar: "التسويق والحلول المتكاملة",
      de: "Marketing & Komplettlösungen",
      en: "Marketing & Complete Solutions",
    },
    description: {
      ar: "حلول متكاملة للمشروع من الفكرة إلى الظهور، وتشمل المواد الإعلانية والحضور البصري.",
      de: "Ganzheitliche Lösungen vom Konzept bis zur Sichtbarkeit, inklusive Werbematerialien und visueller Präsenz.",
      en: "Complete solutions from concept to visibility, including promotional materials and visual presence.",
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
        id: "businessType",
        type: "text",
        label: { ar: "نوع النشاط", de: "Art des Geschäfts", en: "Business Type" },
        placeholder: {
          ar: "مثال: مطعم، متجر، شركة خدمات",
          de: "Beispiel: Restaurant, Laden, Dienstleistungsfirma",
          en: "Example: restaurant, store, service company",
        },
      },
      {
        id: "projectStage",
        type: "radio",
        label: { ar: "مرحلة المشروع", de: "Projektphase", en: "Project Stage" },
        options: [
          { value: "idea", label: { ar: "فكرة", de: "Idee", en: "Idea" } },
          { value: "launch", label: { ar: "افتتاح", de: "Eröffnung", en: "Launch" } },
          { value: "existing", label: { ar: "قائم", de: "Bestehend", en: "Existing" } },
        ],
      },
      {
        id: "marketingNeeds",
        type: "checkbox",
        label: { ar: "ما الذي تحتاجه؟", de: "Was wird benötigt?", en: "What Do You Need?" },
        options: [
          { value: "launch-materials", label: { ar: "مواد افتتاح", de: "Eröffnungsmaterialien", en: "Launch Materials" } },
          { value: "visual-identity", label: { ar: "هوية بصرية", de: "Visuelle Identität", en: "Visual Identity" } },
          { value: "print-campaign", label: { ar: "مواد دعائية مطبوعة", de: "Gedruckte Werbemittel", en: "Printed Campaign Materials" } },
          { value: "social-media", label: { ar: "محتوى سوشال", de: "Social Media Inhalte", en: "Social Media Content" } },
          { value: "store-presence", label: { ar: "حضور بصري للمحل", de: "Visuelle Ladenpräsenz", en: "Store Visual Presence" } },
          { value: "offers", label: { ar: "عروض ومواد مبيعات", de: "Angebote & Verkaufsunterlagen", en: "Offers & Sales Materials" } },
        ],
      },
      {
        id: "targetAudience",
        type: "text",
        label: { ar: "الفئة المستهدفة", de: "Zielgruppe", en: "Target Audience" },
        placeholder: {
          ar: "مثال: عائلات، طلاب، شركات",
          de: "Beispiel: Familien, Studenten, Firmen",
          en: "Example: families, students, companies",
        },
      },
      {
        id: "notes",
        type: "textarea",
        label: { ar: "تفاصيل المشروع", de: "Projektbeschreibung", en: "Project Details" },
        placeholder: {
          ar: "اكتب أين وصل مشروعك الآن، ما الذي ينقصه، وما الذي تتوقعه منا",
          de: "Beschreibe den aktuellen Stand deines Projekts, was fehlt und was du von uns erwartest",
          en: "Describe where your project stands now, what is missing, and what you expect from us",
        },
      },
    ],
  },
];