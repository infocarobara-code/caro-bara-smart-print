"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
} from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { useLanguage } from "@/lib/languageContext";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Info,
  MapPinned,
  PhoneCall,
  Send,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react";

type BookingLanguage = "ar" | "de" | "en";
type AppointmentType = "consultation" | "design" | "visit" | "installation";
type AppointmentMode = "at_store" | "we_come_free" | "phone_call";
type CustomerSalutation = "mr" | "ms" | "";
type BookingSlotStatus = "available" | "booked" | "blocked";

type BookingFormData = {
  salutation: CustomerSalutation;
  fullName: string;
  email: string;
  phone: string;
  type: AppointmentType;
  mode: AppointmentMode;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  notes: string;
  privacyAccepted: boolean;
  marketingAccepted: boolean;
};

type AvailableDayRow = {
  id?: string;
  date?: string;
  date_date?: string;
  is_active?: boolean;
  note?: string | null;
};

type AvailableDay = {
  id: string;
  date: string;
  note?: string;
};

type AvailableDaysApiResponse = {
  success?: boolean;
  days?: Array<{
    id?: string;
    date?: string;
    note?: string;
  }>;
  error?: string;
};

type BookingSlotRow = {
  id?: string;
  booking_date?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
  note?: string | null;
};

type BookingSlot = {
  id: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: BookingSlotStatus;
  note?: string;
};

type BookingSlotsApiResponse = {
  success?: boolean;
  slots?: BookingSlotRow[];
  data?: BookingSlotRow[];
  error?: string;
};

const bookingText = {
  badge: {
    ar: "حجز موعد",
    de: "Terminbuchung",
    en: "Book an Appointment",
  },
  foldedTitle: {
    ar: "اختر طريقة الموعد",
    de: "Wähle den Terminmodus",
    en: "Choose the appointment mode",
  },
  foldedSubtitle: {
    ar: "ابدأ من هنا، ثم أكمل تفاصيل الموعد بهدوء ووضوح.",
    de: "Beginne hier und vervollständige dann den Termin ruhig und übersichtlich.",
    en: "Start here, then complete the appointment details in a clear way.",
  },
  detailsTitle: {
    ar: "تفاصيل الموعد",
    de: "Termindetails",
    en: "Appointment Details",
  },
  availableDaysTitle: {
    ar: "الأيام المتاحة",
    de: "Verfügbare Tage",
    en: "Available Days",
  },
  availableDaysSubtitle: {
    ar: "اختر يومًا مناسبًا من الأيام المفتوحة فقط.",
    de: "Wähle nur einen passenden Tag aus den offenen Tagen.",
    en: "Choose one suitable day from the open days only.",
  },
  availableDayHint: {
    ar: "اليوم الذي تختاره هنا سيصل إلى الإدارة لمراجعته وتأكيده.",
    de: "Der hier ausgewählte Tag wird an den Admin gesendet, geprüft und bestätigt.",
    en: "The day you choose here will be sent to admin for review and confirmation.",
  },
  selectedDayTitle: {
    ar: "اليوم المختار",
    de: "Gewählter Tag",
    en: "Selected Day",
  },
  noAvailableDays: {
    ar: "لا توجد أيام متاحة حاليًا. يرجى المحاولة لاحقًا أو التواصل معنا مباشرة.",
    de: "Aktuell sind keine Tage verfügbar. Bitte versuche es später erneut oder kontaktiere uns direkt.",
    en: "There are currently no available days. Please try again later or contact us directly.",
  },
  loadingDays: {
    ar: "جارٍ تحميل الأيام المتاحة...",
    de: "Verfügbare Tage werden geladen...",
    en: "Loading available days...",
  },
  loadDaysError: {
    ar: "تعذر تحميل الأيام المتاحة الآن.",
    de: "Die verfügbaren Tage konnten aktuell nicht geladen werden.",
    en: "Available days could not be loaded right now.",
  },
  availableTimesTitle: {
    ar: "الأوقات المتاحة",
    de: "Verfügbare Zeiten",
    en: "Available Times",
  },
  availableTimesSubtitle: {
    ar: "بعد اختيار اليوم، اختر وقتًا واحدًا مناسبًا.",
    de: "Wähle nach dem Tag genau eine passende Uhrzeit aus.",
    en: "After selecting the day, choose one suitable time slot.",
  },
  availableTimesHint: {
    ar: "يمكنك اختيار وقت واحد فقط. الأوقات المحجوزة أو المغلقة لا يمكن تحديدها.",
    de: "Es kann nur ein Zeitfenster gewählt werden. Gebuchte oder gesperrte Zeiten sind nicht auswählbar.",
    en: "You can select only one slot. Booked or blocked times cannot be selected.",
  },
  selectDayFirst: {
    ar: "اختر يومًا أولًا لعرض الأوقات المتاحة له.",
    de: "Wähle zuerst einen Tag aus, um die verfügbaren Zeiten zu sehen.",
    en: "Select a day first to see its available time slots.",
  },
  loadingSlots: {
    ar: "جارٍ تحميل الأوقات المتاحة...",
    de: "Verfügbare Zeiten werden geladen...",
    en: "Loading available time slots...",
  },
  loadSlotsError: {
    ar: "تعذر تحميل الأوقات المتاحة لهذا اليوم.",
    de: "Die verfügbaren Zeiten für diesen Tag konnten nicht geladen werden.",
    en: "Available time slots for this day could not be loaded.",
  },
  noAvailableSlots: {
    ar: "لا توجد أوقات متاحة لهذا اليوم حاليًا.",
    de: "Für diesen Tag sind aktuell keine Zeiten verfügbar.",
    en: "There are currently no available time slots for this day.",
  },
  selectedTimeTitle: {
    ar: "الوقت المختار",
    de: "Gewählte Uhrzeit",
    en: "Selected Time",
  },
  slotStatus: {
    available: {
      ar: "متاح",
      de: "Verfügbar",
      en: "Available",
    },
    booked: {
      ar: "محجوز",
      de: "Gebucht",
      en: "Booked",
    },
    blocked: {
      ar: "مغلق",
      de: "Gesperrt",
      en: "Blocked",
    },
  },
  summaryTime: {
    ar: "الوقت المختار",
    de: "Gewählte Uhrzeit",
    en: "Selected Time",
  },
  detailsTitleSelected: {
    ar: "تفاصيل الموعد المختارة",
    de: "Gewählte Termindetails",
    en: "Selected Appointment Details",
  },
  customerTitle: {
    ar: "بيانات العميل",
    de: "Kundendaten",
    en: "Customer Details",
  },
  consentTitle: {
    ar: "الموافقات القانونية",
    de: "Rechtliche Einwilligungen",
    en: "Legal Consents",
  },
  summaryTitle: {
    ar: "ملخص الموعد",
    de: "Terminübersicht",
    en: "Appointment Summary",
  },
  summarySubtitle: {
    ar: "مراجعة أخيرة قبل الإرسال",
    de: "Letzte Prüfung vor dem Senden",
    en: "Final review before sending",
  },
  appointmentWindow: {
    ar: "الوقت النهائي يُحدد لاحقًا من الإدارة",
    de: "Die finale Uhrzeit wird später vom Admin festgelegt",
    en: "The final time will be set later by admin",
  },
  type: {
    ar: "نوع الموعد",
    de: "Terminart",
    en: "Appointment Type",
  },
  salutation: {
    ar: "الصفة",
    de: "Anrede",
    en: "Salutation",
  },
  salutationOptions: {
    empty: {
      ar: "اختر",
      de: "Bitte wählen",
      en: "Please choose",
    },
    mr: {
      ar: "السيد",
      de: "Herr",
      en: "Mr",
    },
    ms: {
      ar: "السيدة",
      de: "Frau",
      en: "Ms",
    },
  },
  fullName: {
    ar: "الاسم والكنية",
    de: "Vor- und Nachname",
    en: "Full Name",
  },
  email: {
    ar: "البريد الإلكتروني",
    de: "E-Mail",
    en: "Email",
  },
  phone: {
    ar: "رقم الهاتف",
    de: "Telefonnummer",
    en: "Phone Number",
  },
  street: {
    ar: "الشارع",
    de: "Straße",
    en: "Street",
  },
  houseNumber: {
    ar: "رقم البناء",
    de: "Hausnummer",
    en: "House Number",
  },
  postalCode: {
    ar: "الرمز البريدي",
    de: "Postleitzahl",
    en: "Postal Code",
  },
  city: {
    ar: "المدينة",
    de: "Stadt",
    en: "City",
  },
  notes: {
    ar: "تفاصيل إضافية",
    de: "Zusätzliche Details",
    en: "Additional Details",
  },
  notesPlaceholderDefault: {
    ar: "اكتب ما يفيدنا قبل الموعد...",
    de: "Schreibe, was uns vor dem Termin hilft...",
    en: "Write anything that helps us before the appointment...",
  },
  notesPlaceholderVisit: {
    ar: "اكتب ما يفيدنا قبل أن نأتي إلى موقعك...",
    de: "Schreibe, was uns hilft, bevor wir zu deinem Standort kommen...",
    en: "Write what helps us before we come to your location...",
  },
  notesPlaceholderCall: {
    ar: "اكتب موضوع الاتصال أو الخدمة المطلوبة...",
    de: "Beschreibe kurz das Thema des Anrufs oder die gewünschte Leistung...",
    en: "Briefly describe the call topic or requested service...",
  },
  privacyAccepted: {
    ar: "أوافق على استخدام بياناتي لمعالجة طلب الموعد والتواصل المرتبط به وفقًا للمتطلبات القانونية.",
    de: "Ich stimme der Verwendung meiner Daten zur Bearbeitung der Terminanfrage und der dazugehörigen Kommunikation gemäß den rechtlichen Anforderungen zu.",
    en: "I agree to the use of my data for processing the appointment request and related communication in accordance with legal requirements.",
  },
  marketingAccepted: {
    ar: "أرغب اختياريًا في تلقي منشوراتنا الترويجية والعروض الجديدة.",
    de: "Ich möchte optional Werbeinformationen und neue Angebote von uns erhalten.",
    en: "I would optionally like to receive our promotional updates and new offers.",
  },
  agb: {
    ar: "بإرسال هذا النموذج، تُستخدم بياناتك فقط لتنظيم الموعد والتواصل المتعلق به ضمن الإطار القانوني.",
    de: "Mit dem Absenden dieses Formulars werden deine Daten ausschließlich zur Terminorganisation und der dazugehörigen Kommunikation im rechtlichen Rahmen verwendet.",
    en: "By submitting this form, your data is used only for appointment organization and related communication within the legal framework.",
  },
  requiredHint: {
    ar: "الحقول المطلوبة",
    de: "Pflichtfelder",
    en: "Required fields",
  },
  chosenLabel: {
    ar: "محدد",
    de: "Gewählt",
    en: "Selected",
  },
  availableLabel: {
    ar: "متاح",
    de: "Verfügbar",
    en: "Available",
  },
  modeOptions: {
    at_store: {
      ar: "أنت تأتي",
      de: "Du kommst",
      en: "You come",
    },
    we_come_free: {
      ar: "نحن نأتي",
      de: "Wir kommen",
      en: "We come",
    },
    phone_call: {
      ar: "اتصال هاتفي",
      de: "Telefonanruf",
      en: "Phone call",
    },
  },
  modeDescriptions: {
    at_store: {
      ar: "تأتي إلى مقرنا لمراجعة التفاصيل بشكل مباشر.",
      de: "Du kommst zu uns und besprichst die Details direkt vor Ort.",
      en: "You come to our location and review the details directly.",
    },
    we_come_free: {
      ar: "نأتي إلى موقعك لمعاينة الطلب أو المكان حسب الحاجة.",
      de: "Wir kommen zu deinem Standort, um den Auftrag oder den Ort bei Bedarf zu prüfen.",
      en: "We come to your location to review the request or place when needed.",
    },
    phone_call: {
      ar: "مناسب للتنسيق الأولي أو الاستفسارات السريعة.",
      de: "Geeignet für eine erste Abstimmung oder kurze Rückfragen.",
      en: "Suitable for initial coordination or quick questions.",
    },
  },
  addressHint: {
    ar: "يرجى كتابة العنوان كاملًا بدقة إذا كان الموعد يتطلب زيارة ميدانية.",
    de: "Bitte gib die vollständige Adresse genau an, wenn der Termin einen Vor-Ort-Besuch erfordert.",
    en: "Please provide the full address accurately if the appointment requires an on-site visit.",
  },
  phoneHint: {
    ar: "سنستخدم رقم الهاتف للتأكيد أو للتنسيق النهائي.",
    de: "Wir nutzen deine Telefonnummer zur Bestätigung oder finalen Abstimmung.",
    en: "We will use your phone number for confirmation or final coordination.",
  },
  storeHint: {
    ar: "بعد الإرسال، سننسق معك تفاصيل الحضور إلى مقر Caro Bara.",
    de: "Nach dem Absenden stimmen wir mit dir die Details deines Besuchs bei Caro Bara ab.",
    en: "After submission, we will coordinate the details of your visit to Caro Bara.",
  },
  reviewName: {
    ar: "الاسم",
    de: "Name",
    en: "Name",
  },
  reviewDay: {
    ar: "اليوم المختار",
    de: "Gewählter Tag",
    en: "Selected Day",
  },
  reviewType: {
    ar: "نوع الموعد",
    de: "Terminart",
    en: "Appointment Type",
  },
  reviewMode: {
    ar: "طريقة الموعد",
    de: "Terminmodus",
    en: "Appointment Mode",
  },
  reviewAddress: {
    ar: "العنوان",
    de: "Adresse",
    en: "Address",
  },
  reviewContact: {
    ar: "التواصل",
    de: "Kontakt",
    en: "Contact",
  },
  submit: {
    ar: "إرسال طلب الموعد",
    de: "Terminanfrage senden",
    en: "Send Appointment Request",
  },
  submitHint: {
    ar: "سيصل طلبك إلى النظام الداخلي، ثم تتم مراجعته من الإدارة.",
    de: "Deine Anfrage geht in das interne System ein und wird anschließend vom Admin geprüft.",
    en: "Your request will be sent to the internal system and then reviewed by admin.",
  },
  successTitle: {
    ar: "شكرًا لك، تم إرسال طلب الموعد بنجاح",
    de: "Vielen Dank, deine Terminanfrage wurde erfolgreich gesendet",
    en: "Thank you, your appointment request has been sent successfully",
  },
  successText: {
    ar: "استلمنا طلبك داخل النظام. سيقوم فريق Caro Bara بمراجعته ثم التواصل معك لتأكيد الموعد أو إرسال ملاحظات إضافية عند الحاجة.",
    de: "Deine Anfrage ist in unserem System eingegangen. Das Caro Bara Team prüft sie und meldet sich zur Bestätigung oder mit zusätzlichen Hinweisen bei Bedarf.",
    en: "Your request has been received in our system. The Caro Bara team will review it and contact you to confirm the appointment or send additional notes if needed.",
  },
  backHome: {
    ar: "العودة للرئيسية",
    de: "Zur Startseite",
    en: "Back to Home",
  },
  requiredError: {
    ar: "يرجى تعبئة جميع الحقول المطلوبة والموافقة القانونية قبل الإرسال.",
    de: "Bitte fülle alle Pflichtfelder aus und bestätige die rechtliche Einwilligung vor dem Absenden.",
    en: "Please complete all required fields and accept the legal consent before sending.",
  },
  salutationRequiredError: {
    ar: "يرجى اختيار الصفة: السيد أو السيدة.",
    de: "Bitte wähle eine Anrede: Herr oder Frau.",
    en: "Please choose a salutation: Mr or Ms.",
  },
  addressRequiredError: {
    ar: "يرجى تعبئة بيانات العنوان كاملة.",
    de: "Bitte fülle die Adressdaten vollständig aus.",
    en: "Please complete the full address details.",
  },
  selectedDayRequiredError: {
    ar: "يرجى اختيار يوم متاح.",
    de: "Bitte wähle einen verfügbaren Tag aus.",
    en: "Please choose one available day.",
  },
  selectedTimeRequiredError: {
    ar: "يرجى اختيار وقت متاح.",
    de: "Bitte wähle eine verfügbare Uhrzeit aus.",
    en: "Please choose one available time slot.",
  },
  genericError: {
    ar: "حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.",
    de: "Beim Senden ist ein Fehler aufgetreten. Bitte versuche es erneut.",
    en: "Something went wrong while sending the request. Please try again.",
  },
  fieldDescriptions: {
    type: {
      ar: "حدد نوع الخدمة أو الغرض من الموعد.",
      de: "Wähle die gewünschte Leistung oder den Zweck des Termins.",
      en: "Select the service type or purpose of the appointment.",
    },
    customer: {
      ar: "هذه البيانات تساعدنا على إدخال الموعد بشكل صحيح والتواصل معك بسرعة.",
      de: "Diese Angaben helfen uns, den Termin korrekt zu erfassen und dich schnell zu kontaktieren.",
      en: "These details help us register the appointment correctly and contact you quickly.",
    },
  },
  seoTitle: {
    ar: "معلومات إضافية عن حجز المواعيد",
    de: "Zusätzliche Informationen zur Terminbuchung",
    en: "Additional appointment booking information",
  },
  seoBody: {
    ar: "تتيح صفحة حجز المواعيد في Caro Bara Smart Print إرسال طلبات منظمة ومباشرة إلى النظام الداخلي، مع عرض الأيام المتاحة التي تحددها الإدارة فقط، وبشكل بصري هادئ وواضح.",
    de: "Die Terminseite von Caro Bara Smart Print ermöglicht strukturierte und direkte Anfragen an das interne System mit Anzeige nur der vom Admin festgelegten verfügbaren Tage in ruhiger und klarer Darstellung.",
    en: "The appointment page in Caro Bara Smart Print allows structured and direct requests to the internal system, showing only the available days defined by admin in a calm and clear visual way.",
  },
  typeOptions: {
    consultation: {
      ar: "استشارة",
      de: "Beratung",
      en: "Consultation",
    },
    design: {
      ar: "تصميم",
      de: "Design",
      en: "Design",
    },
    visit: {
      ar: "معاينة",
      de: "Besichtigung",
      en: "Site Visit",
    },
    installation: {
      ar: "تركيب",
      de: "Montage",
      en: "Installation",
    },
  },
} as const;

const pageBackground = "#f2eee7";
const cardBackground = "#fbf8f3";
const cardBorder = "rgba(32, 35, 40, 0.14)";
const inputBackground = "#fdfbf7";
const primaryText = "#111827";
const secondaryText = "#676f7a";
const mutedText = "#9aa1ab";
const accentDark = "#171717";
const accentDarkSoft = "rgba(23, 23, 23, 0.06)";
const accentDarkBorder = "rgba(23, 23, 23, 0.22)";
const accentDarkShadow = "rgba(23, 23, 23, 0.12)";
const subtlePanel = "rgba(17, 24, 39, 0.035)";
const dangerSoft = "rgba(190, 55, 55, 0.08)";
const dangerText = "#8e2b2b";

const initialFormData: BookingFormData = {
  salutation: "",
  fullName: "",
  email: "",
  phone: "",
  type: "consultation",
  mode: "we_come_free",
  street: "",
  houseNumber: "",
  postalCode: "",
  city: "",
  notes: "",
  privacyAccepted: false,
  marketingAccepted: false,
};

function getDirection(language: BookingLanguage): "rtl" | "ltr" {
  return language === "ar" ? "rtl" : "ltr";
}

function formatDisplayDate(dateString: string, language: BookingLanguage) {
  const date = new Date(`${dateString}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  const locale =
    language === "ar" ? "ar-EG" : language === "de" ? "de-DE" : "en-GB";

  return date.toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDisplayTime(timeString: string, language: BookingLanguage) {
  const normalized = String(timeString || "").trim();

  if (!normalized) {
    return "—";
  }

  const [hoursRaw, minutesRaw] = normalized.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return normalized.slice(0, 5);
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  const locale =
    language === "ar" ? "ar-EG" : language === "de" ? "de-DE" : "en-GB";

  return date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTimeRange(
  startTime: string,
  endTime: string,
  language: BookingLanguage
) {
  return `${formatDisplayTime(startTime, language)} – ${formatDisplayTime(
    endTime,
    language
  )}`;
}

function isFutureOrToday(dateString: string) {
  const date = new Date(`${dateString}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const today = new Date();
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return date >= current;
}

function normalizeAvailableDay(raw: AvailableDayRow): AvailableDay | null {
  const date = String(raw.date || raw.date_date || "").trim();
  const id = String(raw.id || date).trim();
  const isActive = raw.is_active !== false;

  if (!id || !date || !isActive || !isFutureOrToday(date)) {
    return null;
  }

  return {
    id,
    date,
    note:
      typeof raw.note === "string" && raw.note.trim()
        ? raw.note.trim()
        : undefined,
  };
}

function sortAvailableDays(days: AvailableDay[]) {
  return [...days].sort((a, b) => a.date.localeCompare(b.date));
}

function normalizeSlotStatus(status?: string): BookingSlotStatus {
  if (status === "booked" || status === "blocked") {
    return status;
  }

  return "available";
}

function normalizeBookingSlot(raw: BookingSlotRow): BookingSlot | null {
  const id = String(raw.id || "").trim();
  const bookingDate = String(raw.booking_date || raw.date || "").trim();
  const startTime = String(raw.start_time || "").trim();
  const endTime = String(raw.end_time || "").trim();
  const status = normalizeSlotStatus(raw.status);

  if (!id || !bookingDate || !startTime || !endTime) {
    return null;
  }

  return {
    id,
    bookingDate,
    startTime,
    endTime,
    status,
    note:
      typeof raw.note === "string" && raw.note.trim()
        ? raw.note.trim()
        : undefined,
  };
}

function sortBookingSlots(slots: BookingSlot[]) {
  return [...slots].sort((a, b) => {
    if (a.startTime === b.startTime) {
      return a.endTime.localeCompare(b.endTime);
    }

    return a.startTime.localeCompare(b.startTime);
  });
}

async function fetchAvailableDaysFromApi(): Promise<AvailableDay[]> {
  const response = await fetch("/api/available-days", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load booking days");
  }

  const data = (await response.json()) as AvailableDaysApiResponse;

  if (!data?.success || !Array.isArray(data.days)) {
    return [];
  }

  return sortAvailableDays(
    data.days
      .map((item) =>
        normalizeAvailableDay({
          id: item.id,
          date: item.date,
          is_active: true,
          note: item.note,
        })
      )
      .filter((item): item is AvailableDay => Boolean(item))
  );
}

async function fetchBookingSlotsFromApi(
  bookingDate: string
): Promise<BookingSlot[]> {
  const query = new URLSearchParams({
    booking_date: bookingDate,
  });

  const response = await fetch(`/api/booking-slots?${query.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load booking slots");
  }

  const data = (await response.json()) as BookingSlotsApiResponse;
  const rawSlots = Array.isArray(data?.slots)
    ? data.slots
    : Array.isArray(data?.data)
      ? data.data
      : [];

  return sortBookingSlots(
    rawSlots
      .map((item) => normalizeBookingSlot(item))
      .filter((item): item is BookingSlot => Boolean(item))
  );
}

export default function BookingPage() {
  const { language } = useLanguage();

  const currentLanguage: BookingLanguage =
    language === "ar" || language === "de" || language === "en"
      ? language
      : "en";

  const isArabic = currentLanguage === "ar";
  const direction = getDirection(currentLanguage);

  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availableDays, setAvailableDays] = useState<AvailableDay[]>([]);
  const [daysLoading, setDaysLoading] = useState(true);
  const [daysError, setDaysError] = useState("");
  const [availableSlots, setAvailableSlots] = useState<BookingSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showPreparedMessage, setShowPreparedMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpened, setIsFormOpened] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);

  const isVisitMode = formData.mode === "we_come_free";
  const isPhoneMode = formData.mode === "phone_call";
  const isStoreMode = formData.mode === "at_store";

  useEffect(() => {
    setIsFormOpened(Boolean(formData.mode));
  }, [formData.mode]);

  useEffect(() => {
    let isMounted = true;

    async function loadDays() {
      try {
        setDaysLoading(true);
        setDaysError("");

        const days = await fetchAvailableDaysFromApi();

        if (!isMounted) {
          return;
        }

        setAvailableDays(days);
      } catch {
        if (!isMounted) {
          return;
        }

        setAvailableDays([]);
        setDaysError(bookingText.loadDaysError[currentLanguage]);
      } finally {
        if (isMounted) {
          setDaysLoading(false);
        }
      }
    }

    loadDays();

    return () => {
      isMounted = false;
    };
  }, [currentLanguage]);

  useEffect(() => {
    let isMounted = true;

    async function loadSlots() {
      if (!selectedDate) {
        setAvailableSlots([]);
        setSlotsError("");
        setSlotsLoading(false);
        setSelectedSlotId(null);
        return;
      }

      try {
        setSlotsLoading(true);
        setSlotsError("");
        setAvailableSlots([]);
        setSelectedSlotId(null);

        const slots = await fetchBookingSlotsFromApi(selectedDate);

        if (!isMounted) {
          return;
        }

        setAvailableSlots(slots);
      } catch {
        if (!isMounted) {
          return;
        }

        setAvailableSlots([]);
        setSlotsError(bookingText.loadSlotsError[currentLanguage]);
      } finally {
        if (isMounted) {
          setSlotsLoading(false);
        }
      }
    }

    loadSlots();

    return () => {
      isMounted = false;
    };
  }, [currentLanguage, selectedDate]);

  const appointmentTypeLabel =
    bookingText.typeOptions[formData.type][currentLanguage];

  const appointmentModeLabel =
    bookingText.modeOptions[formData.mode][currentLanguage];

  const salutationLabel =
    formData.salutation === "mr"
      ? bookingText.salutationOptions.mr[currentLanguage]
      : formData.salutation === "ms"
        ? bookingText.salutationOptions.ms[currentLanguage]
        : "—";

  const notesPlaceholder = isVisitMode
    ? bookingText.notesPlaceholderVisit[currentLanguage]
    : isPhoneMode
      ? bookingText.notesPlaceholderCall[currentLanguage]
      : bookingText.notesPlaceholderDefault[currentLanguage];

  const reviewAddress = useMemo(() => {
    const parts = [
      formData.street.trim(),
      formData.houseNumber.trim(),
      formData.postalCode.trim(),
      formData.city.trim(),
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(" • ") : "—";
  }, [formData.city, formData.houseNumber, formData.postalCode, formData.street]);

  const selectedDateFormatted = useMemo(() => {
    if (!selectedDate) {
      return "";
    }

    return formatDisplayDate(selectedDate, currentLanguage);
  }, [currentLanguage, selectedDate]);

  const selectedSlot = useMemo(() => {
    if (!selectedSlotId) {
      return null;
    }

    return availableSlots.find((slot) => slot.id === selectedSlotId) || null;
  }, [availableSlots, selectedSlotId]);

  const selectedTime = useMemo(() => {
    if (!selectedSlot) {
      return "";
    }

    return formatDisplayTime(selectedSlot.startTime, currentLanguage);
  }, [currentLanguage, selectedSlot]);

  const selectedTimeRange = useMemo(() => {
    if (!selectedSlot) {
      return "";
    }

    return formatTimeRange(
      selectedSlot.startTime,
      selectedSlot.endTime,
      currentLanguage
    );
  }, [currentLanguage, selectedSlot]);

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const target = event.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "mode") {
      setIsFormOpened(true);
      setShowPreparedMessage(false);
    }

    if (error) {
      setError("");
    }
  }

  function handleModeSelection(mode: AppointmentMode) {
    setFormData((previous) => ({
      ...previous,
      mode,
    }));
    setIsFormOpened(true);
    setShowPreparedMessage(false);

    if (error) {
      setError("");
    }
  }

  function handleAvailableDaySelection(date: string) {
    setSelectedDate((previous) => (previous === date ? null : date));

    if (error) {
      setError("");
    }
  }

  function handleSlotSelection(slot: BookingSlot) {
    if (slot.status !== "available") {
      return;
    }

    setSelectedSlotId((previous) => (previous === slot.id ? null : slot.id));

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.salutation) {
      setShowPreparedMessage(false);
      setError(bookingText.salutationRequiredError[currentLanguage]);
      return;
    }

    const requiredFieldsFilled =
      formData.fullName.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.street.trim() &&
      formData.houseNumber.trim() &&
      formData.postalCode.trim() &&
      formData.city.trim() &&
      formData.privacyAccepted;

    if (!requiredFieldsFilled) {
      setShowPreparedMessage(false);
      setError(bookingText.requiredError[currentLanguage]);
      return;
    }

    if (
      !formData.street.trim() ||
      !formData.houseNumber.trim() ||
      !formData.postalCode.trim() ||
      !formData.city.trim()
    ) {
      setShowPreparedMessage(false);
      setError(bookingText.addressRequiredError[currentLanguage]);
      return;
    }

    if (!selectedDate) {
      setShowPreparedMessage(false);
      setError(bookingText.selectedDayRequiredError[currentLanguage]);
      return;
    }

    if (!selectedSlot) {
      setShowPreparedMessage(false);
      setError(bookingText.selectedTimeRequiredError[currentLanguage]);
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setShowPreparedMessage(false);

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          requestType: "booking",
          selectedDate,
          selectedDays: [selectedDate],
          selectedSlotId: selectedSlot.id,
          selectedTime,
          selectedTimeRange,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          appointmentWindow: selectedTimeRange,
          language: currentLanguage,
          source: "booking_page",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || bookingText.genericError[currentLanguage]);
      }

      setShowPreparedMessage(true);
      setFormData(initialFormData);
      setSelectedDate(null);
      setAvailableSlots([]);
      setSelectedSlotId(null);
      setIsFormOpened(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setShowPreparedMessage(false);
      setError(
        err instanceof Error
          ? err.message
          : bookingText.genericError[currentLanguage]
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const styles = useMemo(() => {
    const sectionCard: CSSProperties = {
      background: cardBackground,
      border: `1px solid ${cardBorder}`,
      borderRadius: 18,
      padding: "18px",
      boxShadow: "0 6px 18px rgba(17, 24, 39, 0.03)",
    };

    const fieldLabel: CSSProperties = {
      display: "block",
      fontSize: 13,
      fontWeight: 800,
      color: primaryText,
      marginBottom: 8,
      letterSpacing: "-0.01em",
    };

    const inputBase: CSSProperties = {
      width: "100%",
      minHeight: 52,
      borderRadius: 14,
      border: "1px solid rgba(17, 24, 39, 0.14)",
      background: inputBackground,
      color: primaryText,
      fontSize: 15,
      outline: "none",
      padding: "0 14px",
      boxSizing: "border-box",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    };

    return {
      page: {
        minHeight: "100vh",
        background: pageBackground,
      } satisfies CSSProperties,
      wrapper: {
        width: "100%",
        maxWidth: 780,
        margin: "0 auto",
        padding: "18px 10px 56px",
      } satisfies CSSProperties,
      simpleHeader: {
        background: "#f7f4ef",
        border: `1px solid ${cardBorder}`,
        borderRadius: 20,
        padding: "18px 20px",
        marginBottom: 14,
      } satisfies CSSProperties,
      topBadgeRow: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        marginBottom: 8,
      } satisfies CSSProperties,
      badge: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 12px",
        borderRadius: 999,
        background: accentDarkSoft,
        color: primaryText,
        fontSize: 12,
        fontWeight: 800,
      } satisfies CSSProperties,
      pageTitle: {
        margin: 0,
        fontSize: "clamp(22px, 2.8vw, 29px)",
        lineHeight: 1.15,
        fontWeight: 900,
        color: primaryText,
        letterSpacing: "-0.03em",
      } satisfies CSSProperties,
      pageText: {
        margin: "8px 0 0",
        fontSize: 13,
        lineHeight: 1.8,
        color: secondaryText,
      } satisfies CSSProperties,
      formWrap: {
        display: "grid",
        gap: 12,
      } satisfies CSSProperties,
      sectionCard,
      sectionHeader: {
        display: "grid",
        gap: 6,
        marginBottom: 14,
      } satisfies CSSProperties,
      sectionTopLine: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      } satisfies CSSProperties,
      sectionNumber: {
        width: 28,
        height: 28,
        borderRadius: 999,
        border: "1px solid rgba(17,24,39,0.18)",
        background: "#ffffff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 900,
        color: primaryText,
        flexShrink: 0,
      } satisfies CSSProperties,
      sectionTitle: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        margin: 0,
        fontSize: 18,
        lineHeight: 1.2,
        color: primaryText,
        fontWeight: 900,
        letterSpacing: "-0.02em",
      } satisfies CSSProperties,
      sectionDescription: {
        margin: 0,
        color: secondaryText,
        fontSize: 12,
        lineHeight: 1.8,
      } satisfies CSSProperties,
      modeSelectorGrid: {
        display: "grid",
        gap: 10,
      } satisfies CSSProperties,
      modeSelectorCard: {
        position: "relative",
        padding: "14px 16px",
        borderRadius: 14,
        border: "1px solid rgba(17, 24, 39, 0.14)",
        background: "#fffdf9",
        display: "grid",
        gap: 7,
        cursor: "pointer",
        textAlign: isArabic ? "right" : "left",
        transition:
          "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
      } satisfies CSSProperties,
      modeSelectorCardActive: {
        border: `1px solid ${accentDarkBorder}`,
        background: "#ffffff",
        boxShadow: `0 8px 20px ${accentDarkShadow}`,
        transform: "translateY(-1px)",
      } satisfies CSSProperties,
      modeSelectorTop: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      } satisfies CSSProperties,
      modeSelectorIconWrap: {
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
      } satisfies CSSProperties,
      modeSelectorIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(17,24,39,0.06)",
        color: primaryText,
        flexShrink: 0,
      } satisfies CSSProperties,
      activeCircle: {
        width: 18,
        height: 18,
        borderRadius: 999,
        border: "2px solid #111827",
        background: "#111827",
        boxShadow: "inset 0 0 0 4px #fff",
        flexShrink: 0,
      } satisfies CSSProperties,
      inactiveCircle: {
        width: 18,
        height: 18,
        borderRadius: 999,
        border: "2px solid rgba(17,24,39,0.24)",
        background: "#fff",
        flexShrink: 0,
      } satisfies CSSProperties,
      modeSelectorTitle: {
        margin: 0,
        fontSize: 15,
        fontWeight: 900,
        color: primaryText,
      } satisfies CSSProperties,
      modeSelectorDescription: {
        margin: 0,
        fontSize: 12,
        lineHeight: 1.75,
        color: secondaryText,
      } satisfies CSSProperties,
      revealWrap: {
        display: "grid",
        gridTemplateRows: isFormOpened ? "1fr" : "0fr",
        transition: "grid-template-rows 0.35s ease",
      } satisfies CSSProperties,
      revealInner: {
        overflow: "hidden",
      } satisfies CSSProperties,
      revealContent: {
        paddingTop: 12,
        display: "grid",
        gap: 12,
      } satisfies CSSProperties,
      fieldGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 12,
      } satisfies CSSProperties,
      fieldFull: {
        gridColumn: "1 / -1",
      } satisfies CSSProperties,
      fieldLabel,
      inputBase,
      inputReadOnly: {
        ...inputBase,
        display: "flex",
        alignItems: "center",
        color: secondaryText,
        fontWeight: 800,
        background: "#faf8f4",
      } satisfies CSSProperties,
      textarea: {
        ...inputBase,
        minHeight: 118,
        resize: "vertical",
        padding: 14,
      } satisfies CSSProperties,
      topInfoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 12,
      } satisfies CSSProperties,
      availabilityShell: {
        border: "1px solid rgba(17, 24, 39, 0.10)",
        borderRadius: 16,
        background: "#fdfbf7",
        padding: 12,
        display: "grid",
        gap: 12,
      } satisfies CSSProperties,
      availabilityInfo: {
        borderRadius: 12,
        padding: "11px 12px",
        background: subtlePanel,
        border: "1px solid rgba(17, 24, 39, 0.08)",
        color: secondaryText,
        fontSize: 12,
        lineHeight: 1.75,
      } satisfies CSSProperties,
      availabilityGrid: {
        display: "grid",
        gap: 10,
      } satisfies CSSProperties,
      dayChip: {
        minHeight: 76,
        borderRadius: 14,
        border: "1px solid rgba(17, 24, 39, 0.14)",
        background: "#ffffff",
        color: primaryText,
        padding: "12px 14px",
        cursor: "pointer",
        display: "grid",
        gap: 6,
        textAlign: isArabic ? "right" : "left",
        transition:
          "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease, background 0.2s ease",
      } satisfies CSSProperties,
      dayChipSelected: {
        border: `1px solid ${accentDarkBorder}`,
        boxShadow: `0 8px 18px ${accentDarkShadow}`,
        background: "#ffffff",
        transform: "translateY(-1px)",
      } satisfies CSSProperties,
      dayChipTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
      } satisfies CSSProperties,
      dayChipBadge: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        minHeight: 24,
        padding: "0 9px",
        borderRadius: 999,
        background: "rgba(17,24,39,0.06)",
        color: primaryText,
        fontSize: 11,
        fontWeight: 800,
      } satisfies CSSProperties,
      dayChipDate: {
        fontSize: 14,
        lineHeight: 1.65,
        fontWeight: 900,
        color: primaryText,
      } satisfies CSSProperties,
      dayChipNote: {
        fontSize: 12,
        lineHeight: 1.7,
        color: secondaryText,
      } satisfies CSSProperties,
      selectionBox: {
        background: "#ffffff",
        border: "1px solid rgba(17, 24, 39, 0.14)",
        borderRadius: 14,
        padding: "12px 14px",
        display: "grid",
        gap: 6,
      } satisfies CSSProperties,
      selectionIndex: {
        fontSize: 11,
        fontWeight: 900,
        color: secondaryText,
      } satisfies CSSProperties,
      selectedDayText: {
        fontSize: 14,
        fontWeight: 900,
        color: primaryText,
        lineHeight: 1.55,
      } satisfies CSSProperties,
      selectedDayPlaceholder: {
        fontSize: 14,
        fontWeight: 800,
        color: mutedText,
      } satisfies CSSProperties,
      slotsGrid: {
        display: "grid",
        gap: 10,
      } satisfies CSSProperties,
      slotCard: {
        minHeight: 84,
        borderRadius: 14,
        border: "1px solid rgba(17, 24, 39, 0.14)",
        background: "#ffffff",
        color: primaryText,
        padding: "12px 14px",
        cursor: "pointer",
        display: "grid",
        gap: 8,
        textAlign: isArabic ? "right" : "left",
        transition:
          "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease, opacity 0.2s ease, background 0.2s ease",
      } satisfies CSSProperties,
      slotCardSelected: {
        border: `1px solid ${accentDarkBorder}`,
        boxShadow: `0 8px 18px ${accentDarkShadow}`,
        transform: "translateY(-1px)",
        background: "#ffffff",
      } satisfies CSSProperties,
      slotCardDisabled: {
        opacity: 0.56,
        cursor: "not-allowed",
        background: "rgba(17, 24, 39, 0.025)",
      } satisfies CSSProperties,
      slotCardTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
      } satisfies CSSProperties,
      slotStatusBadge: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "fit-content",
        minHeight: 24,
        padding: "0 9px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 800,
      } satisfies CSSProperties,
      slotStatusAvailable: {
        background: "rgba(17,24,39,0.06)",
        color: primaryText,
      } satisfies CSSProperties,
      slotStatusBooked: {
        background: dangerSoft,
        color: dangerText,
      } satisfies CSSProperties,
      slotStatusBlocked: {
        background: "rgba(17,24,39,0.08)",
        color: secondaryText,
      } satisfies CSSProperties,
      slotTime: {
        fontSize: 15,
        lineHeight: 1.45,
        fontWeight: 900,
        color: primaryText,
      } satisfies CSSProperties,
      slotNote: {
        fontSize: 12,
        lineHeight: 1.7,
        color: secondaryText,
      } satisfies CSSProperties,
      modeInlinePill: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        width: "fit-content",
        padding: "7px 11px",
        borderRadius: 999,
        background: accentDarkSoft,
        color: primaryText,
        fontSize: 12,
        fontWeight: 800,
        marginBottom: 2,
      } satisfies CSSProperties,
      conditionalHintBox: {
        marginTop: 12,
        borderRadius: 14,
        padding: 12,
        background: "#f7f4ef",
        border: "1px dashed rgba(17, 24, 39, 0.16)",
        color: secondaryText,
        fontSize: 13,
        lineHeight: 1.75,
      } satisfies CSSProperties,
      checkboxWrap: {
        display: "flex",
        gap: 12,
        padding: "14px 0",
        borderTop: "1px solid rgba(17,24,39,0.10)",
      } satisfies CSSProperties,
      checkbox: {
        width: 18,
        height: 18,
        accentColor: "#111827",
        marginTop: 2,
        flexShrink: 0,
      } satisfies CSSProperties,
      checkboxLabel: {
        fontSize: 14,
        color: primaryText,
        lineHeight: 1.75,
      } satisfies CSSProperties,
      miniLegal: {
        marginTop: 8,
        fontSize: 11,
        lineHeight: 1.8,
        color: secondaryText,
      } satisfies CSSProperties,
      summarySection: {
        ...sectionCard,
      } satisfies CSSProperties,
      summaryList: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 10,
      } satisfies CSSProperties,
      summaryRow: {
        padding: 12,
        borderRadius: 14,
        background: "#ffffff",
        border: "1px solid rgba(17, 24, 39, 0.14)",
      } satisfies CSSProperties,
      summaryLabel: {
        fontSize: 12,
        color: secondaryText,
        display: "block",
        marginBottom: 4,
      } satisfies CSSProperties,
      summaryValue: {
        fontSize: 14,
        fontWeight: 900,
        color: primaryText,
        lineHeight: 1.6,
      } satisfies CSSProperties,
      actions: {
        display: "grid",
        gap: 10,
        marginTop: 18,
      } satisfies CSSProperties,
      primaryButton: {
        minHeight: 54,
        borderRadius: 14,
        background: accentDark,
        color: "#fff",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        cursor: "pointer",
        fontWeight: 800,
        padding: "0 20px",
        transition:
          "background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
        boxShadow: `0 12px 24px ${accentDarkShadow}`,
      } satisfies CSSProperties,
      helperText: {
        fontSize: 12,
        color: secondaryText,
        lineHeight: 1.75,
      } satisfies CSSProperties,
      errorBox: {
        marginTop: 12,
        padding: 13,
        borderRadius: 14,
        background: dangerSoft,
        border: "1px solid rgba(190, 55, 55, 0.10)",
        color: dangerText,
        fontSize: 13,
        lineHeight: 1.7,
      } satisfies CSSProperties,
      successBox: {
        marginTop: 12,
        padding: 14,
        borderRadius: 14,
        background: "rgba(17,24,39,0.05)",
        border: "1px solid rgba(17,24,39,0.10)",
        color: primaryText,
      } satisfies CSSProperties,
      successTitle: {
        fontWeight: 900,
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 6,
      } satisfies CSSProperties,
      successText: {
        fontSize: 13,
        lineHeight: 1.75,
      } satisfies CSSProperties,
      footerLinks: {
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
      } satisfies CSSProperties,
      footerLink: {
        fontSize: 13,
        fontWeight: 800,
        textDecoration: "none",
        color: primaryText,
      } satisfies CSSProperties,
      requiredMark: {
        color: primaryText,
      } satisfies CSSProperties,
      seoWrap: {
        marginTop: 14,
        borderRadius: 18,
        border: "1px solid rgba(17,24,39,0.12)",
        background: "rgba(255,255,255,0.5)",
        overflow: "hidden",
      } satisfies CSSProperties,
      seoButton: {
        width: "100%",
        minHeight: 52,
        padding: "12px 16px",
        border: "none",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
        cursor: "pointer",
        color: primaryText,
        fontWeight: 800,
        fontSize: 14,
      } satisfies CSSProperties,
      seoContent: {
        padding: seoOpen ? "0 16px 16px" : "0 16px 0",
        maxHeight: seoOpen ? 240 : 0,
        opacity: seoOpen ? 1 : 0,
        transition: "all 0.25s ease",
        overflow: "hidden",
      } satisfies CSSProperties,
      seoText: {
        margin: 0,
        fontSize: 13,
        lineHeight: 1.8,
        color: secondaryText,
      } satisfies CSSProperties,
    };
  }, [isArabic, isFormOpened, seoOpen]);

  const arrowIcon = isArabic ? <ArrowLeft size={18} /> : <ArrowRight size={18} />;

  const appointmentModes = [
    { value: "we_come_free" as AppointmentMode, icon: <MapPinned size={18} /> },
    { value: "at_store" as AppointmentMode, icon: <Store size={18} /> },
    { value: "phone_call" as AppointmentMode, icon: <PhoneCall size={18} /> },
  ];

  return (
    <div style={styles.page} dir={direction}>
      <Header />

      <main style={styles.wrapper}>
        <section style={styles.simpleHeader}>
          <div style={styles.topBadgeRow}>
            <span style={styles.badge}>
              <CalendarDays size={15} />
              {bookingText.badge[currentLanguage]}
            </span>
          </div>

          <h1 style={styles.pageTitle}>{bookingText.foldedTitle[currentLanguage]}</h1>
          <p style={styles.pageText}>{bookingText.foldedSubtitle[currentLanguage]}</p>
        </section>

        <div style={styles.formWrap}>
          <section style={styles.sectionCard}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionTopLine}>
                <h2 style={styles.sectionTitle}>
                  <MapPinned size={18} />
                  {bookingText.foldedTitle[currentLanguage]}
                </h2>
                <span style={styles.sectionNumber}>1</span>
              </div>
            </div>

            <div style={styles.modeSelectorGrid}>
              {appointmentModes.map((modeItem) => {
                const isActive = formData.mode === modeItem.value;

                return (
                  <button
                    key={modeItem.value}
                    type="button"
                    onClick={() => handleModeSelection(modeItem.value)}
                    style={{
                      ...styles.modeSelectorCard,
                      ...(isActive ? styles.modeSelectorCardActive : {}),
                    }}
                    aria-pressed={isActive}
                  >
                    <div style={styles.modeSelectorTop}>
                      <span style={styles.modeSelectorIconWrap}>
                        <span style={styles.modeSelectorIcon}>{modeItem.icon}</span>
                        <span style={styles.modeSelectorTitle}>
                          {bookingText.modeOptions[modeItem.value][currentLanguage]}
                        </span>
                      </span>
                      <span
                        style={isActive ? styles.activeCircle : styles.inactiveCircle}
                      />
                    </div>

                    <p style={styles.modeSelectorDescription}>
                      {bookingText.modeDescriptions[modeItem.value][currentLanguage]}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <div style={styles.revealWrap}>
            <div style={styles.revealInner}>
              <div style={styles.revealContent}>
                <form onSubmit={handleSubmit} noValidate>
                  <section style={styles.sectionCard}>
                    <div style={styles.sectionHeader}>
                      <div style={styles.sectionTopLine}>
                        <h2 style={styles.sectionTitle}>
                          <BriefcaseBusiness size={18} />
                          {bookingText.detailsTitle[currentLanguage]}
                        </h2>
                        <span style={styles.sectionNumber}>2</span>
                      </div>
                      <p style={styles.sectionDescription}>
                        {bookingText.fieldDescriptions.type[currentLanguage]}
                      </p>
                    </div>

                    <div style={styles.topInfoGrid}>
                      <div>
                        <label htmlFor="type" style={styles.fieldLabel}>
                          {bookingText.type[currentLanguage]}{" "}
                          <span style={styles.requiredMark}>*</span>
                        </label>
                        <select
                          id="type"
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          style={styles.inputBase}
                        >
                          <option value="consultation">
                            {bookingText.typeOptions.consultation[currentLanguage]}
                          </option>
                          <option value="design">
                            {bookingText.typeOptions.design[currentLanguage]}
                          </option>
                          <option value="visit">
                            {bookingText.typeOptions.visit[currentLanguage]}
                          </option>
                          <option value="installation">
                            {bookingText.typeOptions.installation[currentLanguage]}
                          </option>
                        </select>
                      </div>

                      <div>
                        <label style={styles.fieldLabel}>
                          {bookingText.selectedTimeTitle[currentLanguage]}
                        </label>
                        <div style={styles.inputReadOnly}>
                          <Clock3 size={17} style={{ marginInlineEnd: 8 }} />
                          {selectedTimeRange || "—"}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section style={{ ...styles.sectionCard, marginTop: 12 }}>
                    <div style={styles.sectionHeader}>
                      <div style={styles.sectionTopLine}>
                        <h2 style={styles.sectionTitle}>
                          <CalendarDays size={18} />
                          {bookingText.availableDaysTitle[currentLanguage]}
                        </h2>
                        <span style={styles.sectionNumber}>3</span>
                      </div>
                      <p style={styles.sectionDescription}>
                        {bookingText.availableDaysSubtitle[currentLanguage]}
                      </p>
                    </div>

                    <div style={styles.availabilityShell}>
                      {daysLoading ? (
                        <div style={styles.availabilityInfo}>
                          {bookingText.loadingDays[currentLanguage]}
                        </div>
                      ) : daysError ? (
                        <div style={styles.errorBox}>{daysError}</div>
                      ) : availableDays.length === 0 ? (
                        <div style={styles.availabilityInfo}>
                          {bookingText.noAvailableDays[currentLanguage]}
                        </div>
                      ) : (
                        <>
                          <div style={styles.availabilityInfo}>
                            {bookingText.availableDayHint[currentLanguage]}
                          </div>

                          <div style={styles.availabilityGrid}>
                            {availableDays.map((day) => {
                              const isSelected = selectedDate === day.date;

                              return (
                                <button
                                  key={day.id}
                                  type="button"
                                  onClick={() => handleAvailableDaySelection(day.date)}
                                  style={{
                                    ...styles.dayChip,
                                    ...(isSelected ? styles.dayChipSelected : {}),
                                  }}
                                  aria-pressed={isSelected}
                                >
                                  <div style={styles.dayChipTop}>
                                    <span style={styles.dayChipBadge}>
                                      {isSelected
                                        ? bookingText.chosenLabel[currentLanguage]
                                        : bookingText.availableLabel[currentLanguage]}
                                    </span>
                                    <span
                                      style={
                                        isSelected
                                          ? styles.activeCircle
                                          : styles.inactiveCircle
                                      }
                                    />
                                  </div>

                                  <div style={styles.dayChipDate}>
                                    {formatDisplayDate(day.date, currentLanguage)}
                                  </div>

                                  {day.note ? (
                                    <div style={styles.dayChipNote}>{day.note}</div>
                                  ) : null}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}

                      <div>
                        <div style={{ ...styles.fieldLabel, marginBottom: 10 }}>
                          {bookingText.selectedDayTitle[currentLanguage]}{" "}
                          <span style={styles.requiredMark}>*</span>
                        </div>

                        <div style={styles.selectionBox}>
                          <span style={styles.selectionIndex}>01</span>
                          <span
                            style={
                              selectedDateFormatted
                                ? styles.selectedDayText
                                : styles.selectedDayPlaceholder
                            }
                          >
                            {selectedDateFormatted || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section style={{ ...styles.sectionCard, marginTop: 12 }}>
                    <div style={styles.sectionHeader}>
                      <div style={styles.sectionTopLine}>
                        <h2 style={styles.sectionTitle}>
                          <Clock3 size={18} />
                          {bookingText.availableTimesTitle[currentLanguage]}
                        </h2>
                        <span style={styles.sectionNumber}>4</span>
                      </div>
                      <p style={styles.sectionDescription}>
                        {bookingText.availableTimesSubtitle[currentLanguage]}
                      </p>
                    </div>

                    <div style={styles.availabilityShell}>
                      {!selectedDate ? (
                        <div style={styles.availabilityInfo}>
                          {bookingText.selectDayFirst[currentLanguage]}
                        </div>
                      ) : slotsLoading ? (
                        <div style={styles.availabilityInfo}>
                          {bookingText.loadingSlots[currentLanguage]}
                        </div>
                      ) : slotsError ? (
                        <div style={styles.errorBox}>{slotsError}</div>
                      ) : availableSlots.length === 0 ? (
                        <div style={styles.availabilityInfo}>
                          {bookingText.noAvailableSlots[currentLanguage]}
                        </div>
                      ) : (
                        <>
                          <div style={styles.availabilityInfo}>
                            {bookingText.availableTimesHint[currentLanguage]}
                          </div>

                          <div style={styles.slotsGrid}>
                            {availableSlots.map((slot) => {
                              const isSelected = selectedSlotId === slot.id;
                              const isDisabled = slot.status !== "available";

                              const statusBadgeStyle =
                                slot.status === "available"
                                  ? styles.slotStatusAvailable
                                  : slot.status === "booked"
                                    ? styles.slotStatusBooked
                                    : styles.slotStatusBlocked;

                              return (
                                <button
                                  key={slot.id}
                                  type="button"
                                  onClick={() => handleSlotSelection(slot)}
                                  style={{
                                    ...styles.slotCard,
                                    ...(isSelected ? styles.slotCardSelected : {}),
                                    ...(isDisabled ? styles.slotCardDisabled : {}),
                                  }}
                                  aria-pressed={isSelected}
                                  disabled={isDisabled}
                                >
                                  <div style={styles.slotCardTop}>
                                    <span
                                      style={{
                                        ...styles.slotStatusBadge,
                                        ...statusBadgeStyle,
                                      }}
                                    >
                                      {
                                        bookingText.slotStatus[slot.status][
                                          currentLanguage
                                        ]
                                      }
                                    </span>

                                    <span
                                      style={
                                        isSelected
                                          ? styles.activeCircle
                                          : styles.inactiveCircle
                                      }
                                    />
                                  </div>

                                  <div style={styles.slotTime}>
                                    {formatTimeRange(
                                      slot.startTime,
                                      slot.endTime,
                                      currentLanguage
                                    )}
                                  </div>

                                  {slot.note ? (
                                    <div style={styles.slotNote}>{slot.note}</div>
                                  ) : null}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}

                      <div>
                        <div style={{ ...styles.fieldLabel, marginBottom: 10 }}>
                          {bookingText.selectedTimeTitle[currentLanguage]}{" "}
                          <span style={styles.requiredMark}>*</span>
                        </div>

                        <div style={styles.selectionBox}>
                          <span style={styles.selectionIndex}>02</span>
                          <span
                            style={
                              selectedTimeRange
                                ? styles.selectedDayText
                                : styles.selectedDayPlaceholder
                            }
                          >
                            {selectedTimeRange || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section style={{ ...styles.sectionCard, marginTop: 12 }}>
                    <div style={styles.sectionHeader}>
                      <div style={styles.sectionTopLine}>
                        <h2 style={styles.sectionTitle}>
                          <UserRound size={18} />
                          {bookingText.customerTitle[currentLanguage]}
                        </h2>
                        <span style={styles.sectionNumber}>5</span>
                      </div>
                      <p style={styles.sectionDescription}>
                        {bookingText.fieldDescriptions.customer[currentLanguage]}
                      </p>
                    </div>

                    <div style={styles.modeInlinePill}>{appointmentModeLabel}</div>

                    <div style={{ ...styles.fieldGrid, marginTop: 14 }}>
                      <div>
                        <label htmlFor="salutation" style={styles.fieldLabel}>
                          {bookingText.salutation[currentLanguage]}{" "}
                          <span style={styles.requiredMark}>*</span>
                        </label>
                        <select
                          id="salutation"
                          name="salutation"
                          value={formData.salutation}
                          onChange={handleInputChange}
                          style={styles.inputBase}
                          required
                        >
                          <option value="">
                            {bookingText.salutationOptions.empty[currentLanguage]}
                          </option>
                          <option value="mr">
                            {bookingText.salutationOptions.mr[currentLanguage]}
                          </option>
                          <option value="ms">
                            {bookingText.salutationOptions.ms[currentLanguage]}
                          </option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="fullName" style={styles.fieldLabel}>
                          {bookingText.fullName[currentLanguage]}{" "}
                          <span style={styles.requiredMark}>*</span>
                        </label>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          style={styles.inputBase}
                          autoComplete="name"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="email" style={styles.fieldLabel}>
                          {bookingText.email[currentLanguage]}{" "}
                          <span style={styles.requiredMark}>*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          style={styles.inputBase}
                          autoComplete="email"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" style={styles.fieldLabel}>
                          {bookingText.phone[currentLanguage]}{" "}
                          <span style={styles.requiredMark}>*</span>
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          style={styles.inputBase}
                          autoComplete="tel"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="street" style={styles.fieldLabel}>
                          {bookingText.street[currentLanguage]}{" "}
                          <span style={styles.requiredMark}>*</span>
                        </label>
                        <input
                          id="street"
                          name="street"
                          type="text"
                          value={formData.street}
                          onChange={handleInputChange}
                          style={styles.inputBase}
                          autoComplete="address-line1"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="houseNumber" style={styles.fieldLabel}>
                          {bookingText.houseNumber[currentLanguage]}{" "}
                          <span style={styles.requiredMark}>*</span>
                        </label>
                        <input
                          id="houseNumber"
                          name="houseNumber"
                          type="text"
                          value={formData.houseNumber}
                          onChange={handleInputChange}
                          style={styles.inputBase}
                          autoComplete="address-line2"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="postalCode" style={styles.fieldLabel}>
                          {bookingText.postalCode[currentLanguage]}{" "}
                          <span style={styles.requiredMark}>*</span>
                        </label>
                        <input
                          id="postalCode"
                          name="postalCode"
                          type="text"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          style={styles.inputBase}
                          autoComplete="postal-code"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="city" style={styles.fieldLabel}>
                          {bookingText.city[currentLanguage]}{" "}
                          <span style={styles.requiredMark}>*</span>
                        </label>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          value={formData.city}
                          onChange={handleInputChange}
                          style={styles.inputBase}
                          autoComplete="address-level2"
                          required
                        />
                      </div>

                      <div style={styles.fieldFull}>
                        <label htmlFor="notes" style={styles.fieldLabel}>
                          {bookingText.notes[currentLanguage]}
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder={notesPlaceholder}
                          style={styles.textarea}
                        />
                      </div>
                    </div>

                    {isVisitMode ? (
                      <div style={styles.conditionalHintBox}>
                        {bookingText.addressHint[currentLanguage]}
                      </div>
                    ) : null}

                    {isPhoneMode ? (
                      <div style={styles.conditionalHintBox}>
                        {bookingText.phoneHint[currentLanguage]}
                      </div>
                    ) : null}

                    {isStoreMode ? (
                      <div style={styles.conditionalHintBox}>
                        {bookingText.storeHint[currentLanguage]}
                      </div>
                    ) : null}
                  </section>

                  <section style={{ ...styles.sectionCard, marginTop: 12 }}>
                    <div style={styles.sectionHeader}>
                      <div style={styles.sectionTopLine}>
                        <h2 style={styles.sectionTitle}>
                          <ShieldCheck size={18} />
                          {bookingText.consentTitle[currentLanguage]}
                        </h2>
                        <span style={styles.sectionNumber}>6</span>
                      </div>
                    </div>

                    <label style={styles.checkboxWrap}>
                      <input
                        type="checkbox"
                        name="privacyAccepted"
                        checked={formData.privacyAccepted}
                        onChange={handleInputChange}
                        style={styles.checkbox}
                        required
                      />
                      <span style={styles.checkboxLabel}>
                        {bookingText.privacyAccepted[currentLanguage]}
                      </span>
                    </label>

                    <label style={styles.checkboxWrap}>
                      <input
                        type="checkbox"
                        name="marketingAccepted"
                        checked={formData.marketingAccepted}
                        onChange={handleInputChange}
                        style={styles.checkbox}
                      />
                      <span style={styles.checkboxLabel}>
                        {bookingText.marketingAccepted[currentLanguage]}
                      </span>
                    </label>

                    <div style={styles.miniLegal}>
                      {bookingText.agb[currentLanguage]}
                    </div>

                    {error ? <div style={styles.errorBox}>{error}</div> : null}

                    {showPreparedMessage ? (
                      <div style={styles.successBox}>
                        <div style={styles.successTitle}>
                          <CheckCircle2 size={16} />
                          {bookingText.successTitle[currentLanguage]}
                        </div>
                        <div style={styles.successText}>
                          {bookingText.successText[currentLanguage]}
                        </div>
                      </div>
                    ) : null}
                  </section>

                  <section style={{ ...styles.summarySection, marginTop: 12 }}>
                    <div style={styles.sectionHeader}>
                      <div style={styles.sectionTopLine}>
                        <h2 style={styles.sectionTitle}>
                          <BriefcaseBusiness size={18} />
                          {bookingText.summaryTitle[currentLanguage]}
                        </h2>
                        <span style={styles.sectionNumber}>7</span>
                      </div>
                      <p style={styles.sectionDescription}>
                        {bookingText.summarySubtitle[currentLanguage]}
                      </p>
                    </div>

                    <div style={styles.summaryList}>
                      <div style={styles.summaryRow}>
                        <span style={styles.summaryLabel}>
                          {bookingText.salutation[currentLanguage]}
                        </span>
                        <div style={styles.summaryValue}>{salutationLabel}</div>
                      </div>

                      <div style={styles.summaryRow}>
                        <span style={styles.summaryLabel}>
                          {bookingText.reviewName[currentLanguage]}
                        </span>
                        <div style={styles.summaryValue}>
                          {formData.fullName.trim() || "—"}
                        </div>
                      </div>

                      <div style={styles.summaryRow}>
                        <span style={styles.summaryLabel}>
                          {bookingText.reviewDay[currentLanguage]}
                        </span>
                        <div style={styles.summaryValue}>
                          {selectedDateFormatted || "—"}
                        </div>
                      </div>

                      <div style={styles.summaryRow}>
                        <span style={styles.summaryLabel}>
                          {bookingText.summaryTime[currentLanguage]}
                        </span>
                        <div style={styles.summaryValue}>
                          {selectedTimeRange || "—"}
                        </div>
                      </div>

                      <div style={styles.summaryRow}>
                        <span style={styles.summaryLabel}>
                          {bookingText.reviewType[currentLanguage]}
                        </span>
                        <div style={styles.summaryValue}>{appointmentTypeLabel}</div>
                      </div>

                      <div style={styles.summaryRow}>
                        <span style={styles.summaryLabel}>
                          {bookingText.reviewMode[currentLanguage]}
                        </span>
                        <div style={styles.summaryValue}>{appointmentModeLabel}</div>
                      </div>

                      <div style={styles.summaryRow}>
                        <span style={styles.summaryLabel}>
                          {bookingText.reviewAddress[currentLanguage]}
                        </span>
                        <div style={styles.summaryValue}>{reviewAddress}</div>
                      </div>

                      <div style={styles.summaryRow}>
                        <span style={styles.summaryLabel}>
                          {bookingText.reviewContact[currentLanguage]}
                        </span>
                        <div style={styles.summaryValue}>
                          {formData.email.trim() || formData.phone.trim()
                            ? [formData.email.trim(), formData.phone.trim()]
                                .filter(Boolean)
                                .join(" • ")
                            : "—"}
                        </div>
                      </div>

                      <div style={{ ...styles.summaryRow, gridColumn: "1 / -1" }}>
                        <span style={styles.summaryLabel}>
                          {bookingText.appointmentWindow[currentLanguage]}
                        </span>
                        <div style={styles.summaryValue}>
                          {selectedTimeRange || "—"}
                        </div>
                      </div>
                    </div>

                    <div style={styles.actions}>
                      <button
                        type="submit"
                        style={{
                          ...styles.primaryButton,
                          opacity: isSubmitting ? 0.82 : 1,
                          background: isSubmitting ? "#4b5563" : accentDark,
                        }}
                        disabled={isSubmitting}
                        onMouseEnter={(event) => {
                          if (!isSubmitting) {
                            event.currentTarget.style.background = "#000000";
                            event.currentTarget.style.transform = "translateY(-1px)";
                          }
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.background = isSubmitting
                            ? "#4b5563"
                            : accentDark;
                          event.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        <Send size={18} />
                        {bookingText.submit[currentLanguage]}
                        {arrowIcon}
                      </button>
                    </div>

                    <div style={styles.helperText}>
                      {bookingText.submitHint[currentLanguage]}
                    </div>

                    <div style={styles.footerLinks}>
                      <Link href="/" style={styles.footerLink}>
                        {bookingText.backHome[currentLanguage]}
                      </Link>
                    </div>
                  </section>
                </form>
              </div>
            </div>
          </div>

          <section style={styles.seoWrap}>
            <button
              type="button"
              onClick={() => setSeoOpen((previous) => !previous)}
              style={styles.seoButton}
              aria-expanded={seoOpen}
            >
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: 10 }}
              >
                <Info size={16} />
                {bookingText.seoTitle[currentLanguage]}
              </span>
              <ChevronDown
                size={18}
                style={{
                  transform: seoOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.25s ease",
                }}
              />
            </button>

            <div style={styles.seoContent}>
              <p style={styles.seoText}>{bookingText.seoBody[currentLanguage]}</p>
            </div>
          </section>
        </div>

        <style jsx>{`
          @media (max-width: 820px) {
            div[dir] select,
            div[dir] input,
            div[dir] textarea {
              font-size: 16px !important;
            }

            div[dir] [style*="grid-template-columns: repeat(2, minmax(0, 1fr))"] {
              grid-template-columns: minmax(0, 1fr) !important;
            }
          }
        `}</style>
      </main>
    </div>
  );
}