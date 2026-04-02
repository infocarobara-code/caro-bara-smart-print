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

export const fabricationServices: Service[] = [
  {
    id: "custom-fabrication",
    category: "fabrication-decor",
    title: {
      ar: "التصنيع والتجهيز الخاص",
      de: "Sonderanfertigung",
      en: "Custom Fabrication",
    },
    description: {
      ar: "طلبات القص والتجهيز والتصنيع الخاص للديبوند، الأكريليك، الخشب، والمواد الأخرى.",
      de: "Anfragen für individuelle Fertigung, Zuschnitt und Sonderlösungen aus Dibond, Acryl, Holz und anderen Materialien.",
      en: "Requests for custom fabrication, cutting, and special production using dibond, acrylic, wood, and other materials.",
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
        label: { ar: "نوع الطلب", de: "Art des Auftrags", en: "Request Type" },
        placeholder: {
          ar: "مثال: حروف، صندوق، قاعدة، لوحة، ستاند",
          de: "z. B. Buchstaben, Box, Platte, Stand",
          en: "e.g. letters, box, panel, stand",
        },
      },
      {
        id: "size",
        type: "text",
        label: { ar: "المقاسات", de: "Maße", en: "Dimensions" },
        placeholder: {
          ar: "اكتب الطول × العرض × العمق إن وجد",
          de: "Länge × Breite × Tiefe eingeben",
          en: "Enter length × width × depth if available",
        },
      },
      {
        id: "material",
        type: "text",
        label: { ar: "المواد", de: "Material", en: "Material" },
        placeholder: {
          ar: "ديبوند، أكريليك، PVC، خشب، معدن...",
          de: "Dibond, Acryl, PVC, Holz, Metall...",
          en: "dibond, acrylic, PVC, wood, metal...",
        },
      },
      {
        id: "printType",
        type: "text",
        label: { ar: "الطباعة أو المعالجة", de: "Druck / Bearbeitung", en: "Printing / Processing" },
        placeholder: {
          ar: "طباعة، قص CNC، ليزر، حفر، ثني...",
          de: "Druck, CNC, Laser, Gravur, Biegung...",
          en: "printing, CNC cutting, laser, engraving, bending...",
        },
      },
      {
        id: "finishing",
        type: "text",
        label: { ar: "التشطيب", de: "Veredelung", en: "Finishing" },
        placeholder: {
          ar: "لصق، تركيب، دهان، حماية، إضاءة...",
          de: "Kleben, Montage, Lack, Schutz, Beleuchtung...",
          en: "gluing, installation, painting, protection, lighting...",
        },
      },
      {
        id: "designReady",
        type: "radio",
        label: { ar: "هل يوجد ملف أو رسم جاهز؟", de: "Datei oder Zeichnung vorhanden?", en: "Ready File or Drawing?" },
        options: [
          { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
          { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
        ],
      },
      {
        id: "quantity",
        type: "number",
        label: { ar: "الكمية", de: "Menge", en: "Quantity" },
        placeholder: { ar: "مثال: 1", de: "z. B. 1", en: "e.g. 1" },
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
          ar: "اذكر طريقة التنفيذ، أماكن الفتحات، الطيات، السماكات، أو أي تفاصيل مهمة",
          de: "Produktionsdetails, Bohrungen, Faltungen, Stärken oder weitere wichtige Hinweise angeben",
          en: "Mention production method, holes, folds, thicknesses, or any important details",
        },
      },
    ],
  },

  {
    id: "shop-setup-decor",
    category: "fabrication-decor",
    title: {
      ar: "تجهيز المتاجر والديكور والتنفيذ",
      de: "Ladenausbau, Dekor & Umsetzung",
      en: "Shop Setup, Decor & Execution",
    },
    description: {
      ar: "أفكار وتجهيزات للمحال، تنسيق واجهات، ديكور بصري، وعناصر تنفيذ للمشروع.",
      de: "Konzepte und Ausstattung für Geschäfte, Fassadengestaltung, visuelles Dekor und Umsetzungselemente.",
      en: "Store setup ideas, facade coordination, visual decor, and execution elements for the business.",
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
        id: "projectType",
        type: "text",
        label: { ar: "نوع المشروع", de: "Art des Projekts", en: "Project Type" },
        placeholder: { ar: "مثال: كافيه، محل، مكتب، صالون", de: "Beispiel: Café, Laden, Büro, Salon", en: "Example: cafe, shop, office, salon" },
      },
      {
        id: "projectStage",
        type: "radio",
        label: { ar: "حالة المشروع", de: "Projektstatus", en: "Project Status" },
        options: [
          { value: "new", label: { ar: "افتتاح جديد", de: "Neueröffnung", en: "New Opening" } },
          { value: "renewal", label: { ar: "تجديد", de: "Relaunch", en: "Renewal" } },
          { value: "existing", label: { ar: "قائم", de: "Bestehend", en: "Existing" } },
        ],
      },
      {
        id: "needSiteVisit",
        type: "radio",
        label: { ar: "هل تحتاج زيارة موقع؟", de: "Vor-Ort-Besuch nötig?", en: "Need Site Visit?" },
        options: [
          { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
          { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
        ],
      },
      {
        id: "needMeasurements",
        type: "radio",
        label: { ar: "هل تحتاج أخذ قياسات؟", de: "Aufmaß benötigt?", en: "Need Measurements?" },
        options: [
          { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
          { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
        ],
      },
      {
        id: "needVisualConcept",
        type: "radio",
        label: { ar: "هل تحتاج تصورًا بصريًا؟", de: "Visuelles Konzept benötigt?", en: "Need Visual Concept?" },
        options: [
          { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
          { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
        ],
      },
      {
        id: "executionItems",
        type: "checkbox",
        label: { ar: "ما الذي تفكر به؟", de: "Woran denkst du?", en: "What Are You Thinking About?" },
        options: [
          { value: "facade", label: { ar: "واجهة", de: "Fassade", en: "Facade" } },
          { value: "indoor-signs", label: { ar: "لوحات داخلية", de: "Innenschilder", en: "Indoor Signs" } },
          { value: "decor", label: { ar: "ديكور بصري", de: "Dekor", en: "Visual Decor" } },
          { value: "display", label: { ar: "عناصر عرض", de: "Displays", en: "Display Elements" } },
          { value: "branding", label: { ar: "هوية بصرية للمكان", de: "Branding vor Ort", en: "On-site Branding" } },
          { value: "guidance", label: { ar: "إشراف وتوجيه", de: "Beratung", en: "Guidance" } },
          { value: "execution", label: { ar: "تنفيذ", de: "Umsetzung", en: "Execution" } },
        ],
      },
      {
        id: "contractorStatus",
        type: "radio",
        label: { ar: "هل لديك فنيون أو منفذون؟", de: "Hast du bereits Techniker oder Ausführende?", en: "Do you already have technicians or executors?" },
        options: [
          { value: "yes", label: { ar: "نعم", de: "Ja", en: "Yes" } },
          { value: "no", label: { ar: "لا", de: "Nein", en: "No" } },
          { value: "partially", label: { ar: "جزئيًا", de: "Teilweise", en: "Partially" } },
        ],
      },
      {
        id: "notes",
        type: "textarea",
        label: { ar: "تفاصيل إضافية", de: "Zusätzliche Details", en: "Additional Details" },
        placeholder: {
          ar: "اكتب ما الذي تتخيله للمكان، وهل المشروع جديد أو قائم، وما الذي تريد تطويره",
          de: "Beschreibe deine Vorstellung vom Ort, ob das Projekt neu oder bestehend ist und was du entwickeln möchtest",
          en: "Describe your vision for the place, whether it is new or existing, and what you want to improve",
        },
      },
    ],
  },

  {
    id: "vehicle-branding",
    category: "fabrication-decor",
    title: {
      ar: "تجهيز وطباعة المركبات",
      de: "Fahrzeugbeschriftung",
      en: "Vehicle Branding",
    },
    description: {
      ar: "طلبات طباعة وتغليف السيارات والفانات والمركبات التجارية.",
      de: "Anfragen für Fahrzeugbeschriftung, Folierung und Werbedesign auf Autos und Transportern.",
      en: "Requests for vehicle branding, wrapping, and advertising design for cars and vans.",
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
        id: "vehicleType",
        type: "text",
        label: { ar: "نوع المركبة", de: "Fahrzeugtyp", en: "Vehicle Type" },
        placeholder: { ar: "مثال: سيارة، فان، شاحنة", de: "z. B. Auto, Van, LKW", en: "e.g. car, van, truck" },
      },
      {
        id: "vehicleSize",
        type: "text",
        label: { ar: "المقاس / الحجم", de: "Größe / Maße", en: "Size / Dimensions" },
        placeholder: { ar: "اكتب المقاسات إن وجدت", de: "Maße eingeben, falls vorhanden", en: "Enter dimensions if available" },
      },
      {
        id: "material",
        type: "text",
        label: { ar: "المواد", de: "Material", en: "Material" },
        placeholder: { ar: "مثال: فينيل، فينيل مثقب، حماية", de: "z. B. Vinyl, Lochfolie, Schutzlaminat", en: "e.g. vinyl, perforated vinyl, protective laminate" },
      },
      {
        id: "printType",
        type: "text",
        label: { ar: "نوع الطباعة", de: "Druckart", en: "Print Type" },
        placeholder: { ar: "مثال: جزئي أو كامل", de: "z. B. Teilfolierung oder Vollfolierung", en: "e.g. partial or full wrap" },
      },
      {
        id: "finishing",
        type: "text",
        label: { ar: "التشطيب", de: "Veredelung", en: "Finishing" },
        placeholder: { ar: "قص، تغليف، حماية", de: "Zuschnitt, Laminierung, Schutz", en: "cutting, lamination, protection" },
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
        placeholder: { ar: "مثال: 1", de: "z. B. 1", en: "e.g. 1" },
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
          ar: "اذكر نوع المركبة، عدد الجهات، وهل يوجد فك وتركيب",
          de: "Fahrzeugtyp, Seitenanzahl und Montagehinweise angeben",
          en: "Mention vehicle type, number of sides, and installation details",
        },
      },
    ],
  },

  {
    id: "event-printing",
    category: "fabrication-decor",
    title: {
      ar: "طباعة وتجهيز الفعاليات",
      de: "Eventdruck & Eventausstattung",
      en: "Event Printing",
    },
    description: {
      ar: "طلبات طباعة وتجهيز المعارض والافتتاحات والمناسبات والفعاليات التجارية.",
      de: "Anfragen für Druck und Ausstattung von Messen, Eröffnungen und Veranstaltungen.",
      en: "Requests for printing and setup for exhibitions, openings, and business events.",
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
        label: { ar: "نوع الطلب", de: "Art des Auftrags", en: "Request Type" },
        placeholder: {
          ar: "رول أب، ستاند، لوحة، طاولة، خلفية تصوير...",
          de: "Roll-up, Stand, Schild, Tisch, Fotohintergrund...",
          en: "roll-up, stand, sign, table, photo backdrop...",
        },
      },
      {
        id: "size",
        type: "text",
        label: { ar: "المقاسات", de: "Maße", en: "Dimensions" },
        placeholder: {
          ar: "اكتب المقاسات المطلوبة",
          de: "Benötigte Maße eingeben",
          en: "Enter required dimensions",
        },
      },
      {
        id: "material",
        type: "text",
        label: { ar: "المواد", de: "Material", en: "Material" },
        placeholder: {
          ar: "PVC، قماش، أكريليك، ديبوند...",
          de: "PVC, Stoff, Acryl, Dibond...",
          en: "PVC, fabric, acrylic, dibond...",
        },
      },
      {
        id: "printType",
        type: "text",
        label: { ar: "نوع الطباعة", de: "Druckart", en: "Print Type" },
        placeholder: {
          ar: "طباعة داخلية، خارجية، UV، قماش...",
          de: "Indoor, Outdoor, UV, Stoffdruck...",
          en: "indoor, outdoor, UV, fabric print...",
        },
      },
      {
        id: "finishing",
        type: "text",
        label: { ar: "التشطيب", de: "Veredelung", en: "Finishing" },
        placeholder: {
          ar: "تركيب، قص، طي، قواعد، تغليف...",
          de: "Montage, Zuschnitt, Faltung, Halterungen, Verpackung...",
          en: "installation, cutting, folding, bases, packaging...",
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
        placeholder: { ar: "مثال: 5", de: "z. B. 5", en: "e.g. 5" },
      },
      {
        id: "deliveryDate",
        type: "text",
        label: { ar: "موعد التنفيذ", de: "Ausführungstermin", en: "Execution Date" },
        placeholder: { ar: "اكتب الموعد المطلوب", de: "Wunschtermin eingeben", en: "Enter requested date" },
      },
      {
        id: "notes",
        type: "textarea",
        label: { ar: "ملاحظات", de: "Zusätzliche Details", en: "Additional Details" },
        placeholder: {
          ar: "اذكر نوع الفعالية، مكانها، وموعدها، وهل التركيب مطلوب",
          de: "Art der Veranstaltung, Ort, Termin und Montagebedarf angeben",
          en: "Mention event type, location, date, and whether installation is needed",
        },
      },
    ],
  },

  {
    id: "open-request",
    category: "fabrication-decor",
    title: {
      ar: "طلب مفتوح: صف مشروعك بحرية",
      de: "Offene Anfrage: Beschreibe dein Projekt frei",
      en: "Open Request: Describe Your Project Freely",
    },
    description: {
      ar: "إذا لم تكن تعرف بالضبط ما الذي تحتاجه، صف مشروعك أو متجرك أو فكرتك وسنقترح عليك الحلول.",
      de: "Wenn du nicht genau weißt, was du brauchst, beschreibe dein Projekt oder Geschäft und wir schlagen passende Lösungen vor.",
      en: "If you are not sure what exactly you need, describe your project or shop and we will suggest suitable solutions.",
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
        id: "projectType",
        type: "text",
        label: { ar: "نوع المشروع أو النشاط", de: "Art des Projekts oder Geschäfts", en: "Project or Business Type" },
        placeholder: {
          ar: "مثال: مطعم، مكتب، متجر، مشروع جديد",
          de: "Beispiel: Restaurant, Büro, Laden, neues Projekt",
          en: "Example: restaurant, office, store, new project",
        },
      },
      {
        id: "projectStage",
        type: "radio",
        label: { ar: "مرحلة المشروع", de: "Projektphase", en: "Project Stage" },
        options: [
          { value: "idea", label: { ar: "فكرة", de: "Idee", en: "Idea" } },
          { value: "new", label: { ar: "افتتاح جديد", de: "Neueröffnung", en: "New Opening" } },
          { value: "existing", label: { ar: "قائم ويحتاج تطوير", de: "Bestehend und braucht Entwicklung", en: "Existing and Needs Development" } },
        ],
      },
      {
        id: "needs",
        type: "checkbox",
        label: { ar: "ما الذي تعتقد أنك تحتاجه؟", de: "Was glaubst du zu brauchen?", en: "What Do You Think You Need?" },
        options: [
          { value: "printing", label: { ar: "طباعة", de: "Druck", en: "Printing" } },
          { value: "signage", label: { ar: "لوحات", de: "Schilder", en: "Signs" } },
          { value: "branding", label: { ar: "هوية بصرية", de: "Branding", en: "Branding" } },
          { value: "decor", label: { ar: "ديكور", de: "Dekor", en: "Decor" } },
          { value: "marketing", label: { ar: "تسويق", de: "Marketing", en: "Marketing" } },
          { value: "not-sure", label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not Sure" } },
        ],
      },
      {
        id: "vision",
        type: "textarea",
        label: { ar: "صف فكرتك أو تصورك", de: "Beschreibe deine Idee oder Vision", en: "Describe Your Idea or Vision" },
        placeholder: {
          ar: "اكتب بحرية ماذا تريد، ماذا تتخيل، ما نوع النشاط، ما الذي ينقصك، وما الذي تريد أن نساعدك فيه",
          de: "Beschreibe frei, was du möchtest, was du dir vorstellst, welche Art von Geschäft es ist und wobei wir helfen sollen",
          en: "Write freely what you want, what you imagine, what type of business it is, what is missing, and how you want us to help",
        },
      },
    ],
  },
];