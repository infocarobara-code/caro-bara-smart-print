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
  CheckCircle2,
  ChevronDown,
  Clock3,
  Info,
  MapPinned,
  PhoneCall,
  Send,
  Store,
  CalendarDays,
  X,
  Hash,
  BadgeCheck,
} from "lucide-react";

type BookingLanguage = "ar" | "de" | "en";
type AppointmentType = "consultation" | "design" | "visit" | "installation";
type AppointmentMode = "at_store" | "we_come_free" | "phone_call";
type CustomerSalutation = "mr" | "ms" | "";
type BookingSlotStatus = "available" | "booked" | "blocked";
type BookingAccordionSection = "mode" | "schedule" | "customer";

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

type BookingSubmitApiResponse = {
  success?: boolean;
  requestId?: string;
  customerCode?: string;
  appointment?: unknown;
  appointmentId?: string;
  slotId?: string;
  message?: string;
  error?: string;
};

type SectionTheme = {
  solid: string;
  soft: string;
  border: string;
  shadow: string;
  text: string;
  panel: string;
};

const bookingText = {
  pageTitle: {
    ar: "احجزوا موعدكم بسهولة",
    de: "Buchen Sie Ihren Termin einfach",
    en: "Book your appointment easily",
  },
  pageSubtitle: {
    ar: "اختاروا طريقة الموعد، ثم اليوم والساعة المناسبة، ثم أدخلوا بياناتكم وأرسلوا الطلب.",
    de: "Wählen Sie den Terminmodus, dann den passenden Tag und die Uhrzeit, und geben Sie anschließend Ihre Daten ein.",
    en: "Choose the appointment mode, then the day and time, then enter your details and send the request.",
  },
  modeSectionTitle: {
    ar: "اختاروا طريقة الموعد",
    de: "Wählen Sie den Terminmodus",
    en: "Choose the appointment mode",
  },
  modeSectionText: {
    ar: "ابدؤوا من هنا أولًا.",
    de: "Beginnen Sie bitte zuerst hier.",
    en: "Please start here first.",
  },
  scheduleSectionTitle: {
    ar: "اختاروا اليوم والوقت",
    de: "Wählen Sie Tag und Uhrzeit",
    en: "Choose day and time",
  },
  scheduleSectionText: {
    ar: "اضغطوا على اليوم لعرض الساعات المتاحة فقط.",
    de: "Klicken Sie auf einen Tag, um nur die verfügbaren Zeiten anzuzeigen.",
    en: "Click a day to show only the available time slots.",
  },
  customerSectionTitle: {
    ar: "أدخلوا بياناتكم",
    de: "Geben Sie Ihre Daten ein",
    en: "Enter your details",
  },
  customerSectionText: {
    ar: "بعد اختيار الموعد، أكملوا بياناتكم هنا.",
    de: "Nachdem Sie den Termin gewählt haben, vervollständigen Sie hier Ihre Daten.",
    en: "After choosing the appointment, complete your details here.",
  },
  loadingDays: {
    ar: "جارٍ تحميل الأيام المتاحة...",
    de: "Verfügbare Tage werden geladen...",
    en: "Loading available days...",
  },
  noAvailableDays: {
    ar: "لا توجد أيام متاحة حاليًا. يرجى المحاولة لاحقًا أو التواصل معنا مباشرة.",
    de: "Aktuell sind keine Tage verfügbar. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.",
    en: "There are currently no available days. Please try again later or contact us directly.",
  },
  loadDaysError: {
    ar: "تعذر تحميل الأيام المتاحة الآن.",
    de: "Die verfügbaren Tage konnten aktuell nicht geladen werden.",
    en: "Available days could not be loaded right now.",
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
  openTimes: {
    ar: "عرض الساعات",
    de: "Zeiten anzeigen",
    en: "Show times",
  },
  hideTimes: {
    ar: "إخفاء الساعات",
    de: "Zeiten ausblenden",
    en: "Hide times",
  },
  selectedDay: {
    ar: "اليوم المحدد",
    de: "Gewählter Tag",
    en: "Selected Day",
  },
  selectedTime: {
    ar: "الوقت المحدد",
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
      ar: "اختاروا",
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
    ar: "اكتبوا ما يفيدنا قبل الموعد...",
    de: "Schreiben Sie, was uns vor dem Termin hilft...",
    en: "Write anything that helps us before the appointment...",
  },
  notesPlaceholderVisit: {
    ar: "اكتبوا ما يفيدنا قبل أن نأتي إلى موقعكم...",
    de: "Schreiben Sie, was uns hilft, bevor wir zu Ihrem Standort kommen...",
    en: "Write what helps us before we come to your location...",
  },
  notesPlaceholderCall: {
    ar: "اكتبوا موضوع الاتصال أو الخدمة المطلوبة...",
    de: "Beschreiben Sie kurz das Thema des Anrufs oder die gewünschte Leistung...",
    en: "Briefly describe the call topic or requested service...",
  },
  privacyAccepted: {
    ar: "أوافق على استخدام بياناتي لمعالجة طلب الموعد والتواصل المرتبط به وفقًا للمتطلبات القانونية.",
    de: "Ich stimme der Verwendung meiner Daten zur Bearbeitung der Terminanfrage und der dazugehörigen Kommunikation gemäß den rechtlichen Anforderungen zu.",
    en: "I agree to the use of my data for processing the appointment request and related communication in accordance with legal requirements.",
  },
  marketingAccepted: {
    ar: "أرغب اختياريًا في تلقي منشوراتنا الترويجية والعروض الجديدة.",
    de: "Ich möchte optional Werbeinformationen und neue Angebote von Ihnen erhalten.",
    en: "I would optionally like to receive your promotional updates and new offers.",
  },
  agb: {
    ar: "بإرسال هذا النموذج، تُستخدم بياناتكم فقط لتنظيم الموعد والتواصل المتعلق به ضمن الإطار القانوني.",
    de: "Mit dem Absenden dieses Formulars werden Ihre Daten ausschließlich zur Terminorganisation und der dazugehörigen Kommunikation im rechtlichen Rahmen verwendet.",
    en: "By submitting this form, your data is used only for appointment organization and related communication within the legal framework.",
  },
  modeOptions: {
    at_store: {
      ar: "حضوركم إلى مقرنا",
      de: "Sie kommen zu uns",
      en: "You visit our location",
    },
    we_come_free: {
      ar: "نحن نأتي إليكم",
      de: "Wir kommen zu Ihnen",
      en: "We come to your location",
    },
    phone_call: {
      ar: "اتصال هاتفي",
      de: "Telefonischer Kontakt",
      en: "Phone call",
    },
  },
  modeDescriptions: {
    at_store: {
      ar: "تحضرون إلى مقرنا لمراجعة التفاصيل بشكل مباشر.",
      de: "Sie kommen zu uns und besprechen die Details direkt vor Ort.",
      en: "You visit our location and review the details directly.",
    },
    we_come_free: {
      ar: "نأتي إلى موقعكم لمعاينة الطلب أو المكان حسب الحاجة.",
      de: "Wir kommen zu Ihrem Standort, um den Auftrag oder den Ort bei Bedarf zu prüfen.",
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
    de: "Bitte geben Sie die vollständige Adresse genau an, wenn der Termin einen Vor-Ort-Besuch erfordert.",
    en: "Please provide the full address accurately if the appointment requires an on-site visit.",
  },
  phoneHint: {
    ar: "سنستخدم رقم الهاتف للتأكيد أو للتنسيق النهائي.",
    de: "Wir nutzen Ihre Telefonnummer zur Bestätigung oder finalen Abstimmung.",
    en: "We will use your phone number for confirmation or final coordination.",
  },
  storeHint: {
    ar: "بعد الإرسال، سننسق معكم تفاصيل الحضور إلى مقر Caro Bara.",
    de: "Nach dem Absenden stimmen wir mit Ihnen die Details Ihres Besuchs bei Caro Bara ab.",
    en: "After submission, we will coordinate the details of your visit to Caro Bara.",
  },
  submit: {
    ar: "إرسال طلب الموعد",
    de: "Terminanfrage senden",
    en: "Send Appointment Request",
  },
  submitHint: {
    ar: "سيصل طلبكم إلى النظام الداخلي، ثم تتم مراجعته من الإدارة.",
    de: "Ihre Anfrage geht in das interne System ein und wird anschließend vom Admin geprüft.",
    en: "Your request will be sent to the internal system and then reviewed by admin.",
  },
  successTitle: {
    ar: "شكرًا لكم، تم إرسال طلب الموعد بنجاح",
    de: "Vielen Dank, Ihre Terminanfrage wurde erfolgreich gesendet",
    en: "Thank you, your appointment request has been sent successfully",
  },
  successText: {
    ar: "استلمنا طلبكم داخل النظام. سيقوم فريق Caro Bara بمراجعته ثم التواصل معكم لتأكيد الموعد أو إرسال ملاحظات إضافية عند الحاجة.",
    de: "Ihre Anfrage ist in unserem System eingegangen. Das Caro Bara Team prüft sie und meldet sich zur Bestätigung oder mit zusätzlichen Hinweisen bei Bedarf.",
    en: "Your request has been received in our system. The Caro Bara team will review it and contact you to confirm the appointment or send additional notes if needed.",
  },
  successRequestId: {
    ar: "رقم الطلب المرجعي",
    de: "Ihre Referenznummer",
    en: "Your reference number",
  },
  successCustomerCode: {
    ar: "رقم الزبون",
    de: "Ihre Kundennummer",
    en: "Your customer number",
  },
  successReferenceHint: {
    ar: "يرجى الاحتفاظ بهذين الرقمين للرجوع إليهما عند التواصل معنا.",
    de: "Bitte bewahren Sie beide Nummern für spätere Rückfragen auf.",
    en: "Please keep both numbers for future communication with us.",
  },
  backHome: {
    ar: "العودة للرئيسية",
    de: "Zur Startseite",
    en: "Back to Home",
  },
  requiredError: {
    ar: "يرجى تعبئة جميع الحقول المطلوبة والموافقة القانونية قبل الإرسال.",
    de: "Bitte füllen Sie alle Pflichtfelder aus und bestätigen Sie die rechtliche Einwilligung vor dem Absenden.",
    en: "Please complete all required fields and accept the legal consent before sending.",
  },
  salutationRequiredError: {
    ar: "يرجى اختيار الصفة: السيد أو السيدة.",
    de: "Bitte wählen Sie eine Anrede: Herr oder Frau.",
    en: "Please choose a salutation: Mr or Ms.",
  },
  addressRequiredError: {
    ar: "يرجى تعبئة بيانات العنوان كاملة.",
    de: "Bitte füllen Sie die Adressdaten vollständig aus.",
    en: "Please complete the full address details.",
  },
  selectedDayRequiredError: {
    ar: "يرجى اختيار يوم متاح.",
    de: "Bitte wählen Sie einen verfügbaren Tag aus.",
    en: "Please choose one available day.",
  },
  selectedTimeRequiredError: {
    ar: "يرجى اختيار وقت متاح.",
    de: "Bitte wählen Sie eine verfügbare Uhrzeit aus.",
    en: "Please choose one available time slot.",
  },
  genericError: {
    ar: "حدث خطأ أثناء إرسال الطلب. حاولوا مرة أخرى.",
    de: "Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
    en: "Something went wrong while sending the request. Please try again.",
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
  summaryEmpty: {
    ar: "لم يتم الاختيار بعد",
    de: "Noch nichts gewählt",
    en: "Nothing selected yet",
  },
  confirmTitle: {
    ar: "تأكيد تفاصيل الموعد",
    de: "Termindetails bestätigen",
    en: "Confirm appointment details",
  },
  confirmText: {
    ar: "تفاصيل موعدكم جاهزة. إذا كنتم موافقين اضغطوا إرسال، وسوف يصلكم بريد إلكتروني لتأكيد موعدكم.",
    de: "Ihre Termindetails sind bereit. Wenn alles stimmt, klicken Sie bitte auf Senden. Sie erhalten anschließend eine E-Mail zur Bestätigung Ihres Termins.",
    en: "Your appointment details are ready. If everything looks correct, please click send. You will then receive an email confirming your appointment.",
  },
  confirmCancel: {
    ar: "إلغاء",
    de: "Abbrechen",
    en: "Cancel",
  },
  confirmSend: {
    ar: "إرسال",
    de: "Senden",
    en: "Send",
  },
  confirmMode: {
    ar: "طريقة الموعد",
    de: "Terminmodus",
    en: "Appointment Mode",
  },
  confirmType: {
    ar: "نوع الموعد",
    de: "Terminart",
    en: "Appointment Type",
  },
  confirmName: {
    ar: "الاسم",
    de: "Name",
    en: "Name",
  },
  confirmAddress: {
    ar: "العنوان",
    de: "Adresse",
    en: "Address",
  },
  confirmContact: {
    ar: "التواصل",
    de: "Kontakt",
    en: "Contact",
  },
} as const;

const pageBackground = "#ffffff";
const cardBackground = "#ffffff";
const cardBorder = "rgba(24, 119, 242, 0.14)";
const inputBackground = "#ffffff";
const primaryText = "#111827";
const secondaryText = "#5b6472";
const accentBlue = "#1877f2";
const accentBlueHover = "#166fe0";
const accentBlueShadow = "rgba(24, 119, 242, 0.16)";
const dangerSoft = "rgba(190, 55, 55, 0.08)";
const dangerText = "#8e2b2b";

const sectionThemes: Record<BookingAccordionSection, SectionTheme> = {
  mode: {
    solid: "#1877f2",
    soft: "rgba(24, 119, 242, 0.08)",
    border: "rgba(24, 119, 242, 0.22)",
    shadow: "rgba(24, 119, 242, 0.14)",
    text: "#1457b8",
    panel: "rgba(24, 119, 242, 0.04)",
  },
  schedule: {
    solid: "#f28c18",
    soft: "rgba(242, 140, 24, 0.10)",
    border: "rgba(242, 140, 24, 0.24)",
    shadow: "rgba(242, 140, 24, 0.16)",
    text: "#c96b00",
    panel: "rgba(242, 140, 24, 0.05)",
  },
  customer: {
    solid: "#0f9d7a",
    soft: "rgba(15, 157, 122, 0.10)",
    border: "rgba(15, 157, 122, 0.24)",
    shadow: "rgba(15, 157, 122, 0.16)",
    text: "#0b7e62",
    panel: "rgba(15, 157, 122, 0.05)",
  },
};

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
  const [seoOpen, setSeoOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [requestReference, setRequestReference] = useState("");
  const [customerCode, setCustomerCode] = useState("");
  const [openSection, setOpenSection] =
    useState<BookingAccordionSection>("mode");

  const isVisitMode = formData.mode === "we_come_free";
  const isPhoneMode = formData.mode === "phone_call";
  const isStoreMode = formData.mode === "at_store";

  useEffect(() => {
    let isMounted = true;

    async function loadDays() {
      try {
        setDaysLoading(true);
        setDaysError("");

        const days = await fetchAvailableDaysFromApi();

        if (!isMounted) return;
        setAvailableDays(days);
      } catch {
        if (!isMounted) return;
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

        if (!isMounted) return;
        setAvailableSlots(slots);
      } catch {
        if (!isMounted) return;
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

  useEffect(() => {
    if (!showConfirmModal) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showConfirmModal]);

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
    if (!selectedDate) return "";
    return formatDisplayDate(selectedDate, currentLanguage);
  }, [currentLanguage, selectedDate]);

  const selectedSlot = useMemo(() => {
    if (!selectedSlotId) return null;
    return availableSlots.find((slot) => slot.id === selectedSlotId) || null;
  }, [availableSlots, selectedSlotId]);

  const selectedTime = useMemo(() => {
    if (!selectedSlot) return "";
    return formatDisplayTime(selectedSlot.startTime, currentLanguage);
  }, [currentLanguage, selectedSlot]);

  const selectedTimeRange = useMemo(() => {
    if (!selectedSlot) return "";
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

    if (error) {
      setError("");
    }
  }

  function handleModeSelection(mode: AppointmentMode) {
    setFormData((previous) => ({
      ...previous,
      mode,
    }));
    setOpenSection("schedule");
    setShowPreparedMessage(false);

    if (error) {
      setError("");
    }
  }

  function handleAvailableDaySelection(date: string) {
    setSelectedDate((previous) => (previous === date ? null : date));
    setSelectedSlotId(null);

    if (error) {
      setError("");
    }
  }

  function handleSlotSelection(slot: BookingSlot) {
    if (slot.status !== "available") {
      return;
    }

    setSelectedSlotId(slot.id);
    setOpenSection("customer");

    if (error) {
      setError("");
    }
  }

  function validateBeforeSubmit() {
    if (!formData.salutation) {
      setShowPreparedMessage(false);
      setError(bookingText.salutationRequiredError[currentLanguage]);
      setOpenSection("customer");
      return false;
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
      setOpenSection("customer");
      return false;
    }

    if (
      !formData.street.trim() ||
      !formData.houseNumber.trim() ||
      !formData.postalCode.trim() ||
      !formData.city.trim()
    ) {
      setShowPreparedMessage(false);
      setError(bookingText.addressRequiredError[currentLanguage]);
      setOpenSection("customer");
      return false;
    }

    if (!selectedDate) {
      setShowPreparedMessage(false);
      setError(bookingText.selectedDayRequiredError[currentLanguage]);
      setOpenSection("schedule");
      return false;
    }

    if (!selectedSlot) {
      setShowPreparedMessage(false);
      setError(bookingText.selectedTimeRequiredError[currentLanguage]);
      setOpenSection("schedule");
      return false;
    }

    setError("");
    return true;
  }

  async function submitBookingRequest() {
    if (!selectedDate || !selectedSlot) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setShowPreparedMessage(false);
      setRequestReference("");
      setCustomerCode("");

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

      const data = (await response.json().catch(() => null)) as
        | BookingSubmitApiResponse
        | null;

      if (!response.ok) {
        throw new Error(data?.error || bookingText.genericError[currentLanguage]);
      }

      setRequestReference(typeof data?.requestId === "string" ? data.requestId : "");
      setCustomerCode(typeof data?.customerCode === "string" ? data.customerCode : "");
      setShowConfirmModal(false);
      setShowPreparedMessage(true);
      setFormData(initialFormData);
      setSelectedDate(null);
      setAvailableSlots([]);
      setSelectedSlotId(null);
      setOpenSection("mode");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setShowConfirmModal(false);
      setShowPreparedMessage(false);
      setRequestReference("");
      setCustomerCode("");
      setError(
        err instanceof Error
          ? err.message
          : bookingText.genericError[currentLanguage]
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const isValid = validateBeforeSubmit();
    if (!isValid) {
      return;
    }

    setShowConfirmModal(true);
  }

  const styles = useMemo(() => {
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
      border: "1px solid rgba(24, 119, 242, 0.16)",
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
        maxWidth: 860,
        margin: "0 auto",
        padding: "18px 12px 56px",
      } satisfies CSSProperties,
      pageIntro: {
        background: "#ffffff",
        border: `1px solid ${cardBorder}`,
        borderRadius: 24,
        padding: "20px 22px",
        marginBottom: 14,
        boxShadow: "0 8px 20px rgba(24, 119, 242, 0.05)",
        display: "grid",
        gap: 10,
      } satisfies CSSProperties,
      badge: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        width: "fit-content",
        padding: "7px 12px",
        borderRadius: 999,
        background: accentBlue,
        color: "#ffffff",
        fontSize: 12,
        fontWeight: 800,
      } satisfies CSSProperties,
      pageTitle: {
        margin: 0,
        fontSize: "clamp(22px, 3vw, 32px)",
        lineHeight: 1.15,
        fontWeight: 900,
        color: primaryText,
        letterSpacing: "-0.03em",
      } satisfies CSSProperties,
      pageText: {
        margin: 0,
        fontSize: 13,
        lineHeight: 1.8,
        color: secondaryText,
        maxWidth: 720,
      } satisfies CSSProperties,
      formWrap: {
        display: "grid",
        gap: 14,
      } satisfies CSSProperties,
      accordionCard: {
        background: "#ffffff",
        borderRadius: 24,
        overflow: "hidden",
      } satisfies CSSProperties,
      accordionButton: {
        width: "100%",
        border: "none",
        background: "#ffffff",
        padding: "18px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
        cursor: "pointer",
        textAlign: isArabic ? "right" : "left",
      } satisfies CSSProperties,
      accordionButtonLeft: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        minWidth: 0,
        flex: "1 1 auto",
      } satisfies CSSProperties,
      accordionNumber: {
        width: 34,
        height: 34,
        borderRadius: 999,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 900,
        color: "#ffffff",
        flexShrink: 0,
      } satisfies CSSProperties,
      accordionTitleWrap: {
        display: "grid",
        gap: 4,
        minWidth: 0,
      } satisfies CSSProperties,
      accordionTitle: {
        margin: 0,
        fontSize: 18,
        fontWeight: 900,
        color: primaryText,
        lineHeight: 1.2,
      } satisfies CSSProperties,
      accordionText: {
        margin: 0,
        fontSize: 12,
        lineHeight: 1.7,
        color: secondaryText,
      } satisfies CSSProperties,
      accordionMeta: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        minHeight: 34,
        padding: "0 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 800,
        flexShrink: 0,
        maxWidth: "46%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      } satisfies CSSProperties,
      accordionContent: {
        padding: "0 18px 18px",
        display: "grid",
        gap: 14,
      } satisfies CSSProperties,
      modeSelectorGrid: {
        display: "grid",
        gap: 10,
        paddingTop: 16,
      } satisfies CSSProperties,
      modeSelectorCard: {
        position: "relative",
        padding: "14px 16px",
        borderRadius: 16,
        background: "#ffffff",
        display: "grid",
        gap: 7,
        cursor: "pointer",
        textAlign: isArabic ? "right" : "left",
        transition:
          "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
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
        width: 38,
        height: 38,
        borderRadius: 12,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        flexShrink: 0,
      } satisfies CSSProperties,
      activeCircle: {
        width: 18,
        height: 18,
        borderRadius: 999,
        boxShadow: "inset 0 0 0 4px #fff",
        flexShrink: 0,
      } satisfies CSSProperties,
      inactiveCircle: {
        width: 18,
        height: 18,
        borderRadius: 999,
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
      typeModeRow: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 12,
      } satisfies CSSProperties,
      fieldLabel,
      inputBase,
      fieldGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 12,
      } satisfies CSSProperties,
      fieldFull: {
        gridColumn: "1 / -1",
      } satisfies CSSProperties,
      textarea: {
        ...inputBase,
        minHeight: 118,
        resize: "vertical",
        padding: 14,
      } satisfies CSSProperties,
      dayList: {
        display: "grid",
        gap: 10,
        paddingTop: 16,
      } satisfies CSSProperties,
      dayCard: {
        borderRadius: 18,
        background: "#ffffff",
        overflow: "hidden",
      } satisfies CSSProperties,
      dayButton: {
        width: "100%",
        border: "none",
        background: "#ffffff",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        cursor: "pointer",
        textAlign: isArabic ? "right" : "left",
      } satisfies CSSProperties,
      dayMain: {
        display: "grid",
        gap: 6,
        minWidth: 0,
      } satisfies CSSProperties,
      dayTitle: {
        fontSize: 15,
        fontWeight: 900,
        color: primaryText,
        lineHeight: 1.5,
      } satisfies CSSProperties,
      dayNote: {
        fontSize: 12,
        color: secondaryText,
        lineHeight: 1.7,
      } satisfies CSSProperties,
      dayBadge: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        minHeight: 28,
        padding: "0 10px",
        borderRadius: 999,
        color: "#ffffff",
        fontSize: 11,
        fontWeight: 800,
        flexShrink: 0,
      } satisfies CSSProperties,
      slotsWrap: {
        padding: "12px 16px 16px",
        display: "grid",
        gap: 10,
      } satisfies CSSProperties,
      availabilityInfo: {
        borderRadius: 12,
        padding: "11px 12px",
        color: secondaryText,
        fontSize: 12,
        lineHeight: 1.75,
      } satisfies CSSProperties,
      slotsGrid: {
        display: "grid",
        gap: 10,
      } satisfies CSSProperties,
      slotCard: {
        minHeight: 74,
        borderRadius: 16,
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
      summaryStrip: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 10,
        paddingTop: 4,
      } satisfies CSSProperties,
      summaryBox: {
        borderRadius: 16,
        padding: "12px 14px",
        display: "grid",
        gap: 4,
      } satisfies CSSProperties,
      summaryLabel: {
        fontSize: 11,
        fontWeight: 800,
        color: secondaryText,
      } satisfies CSSProperties,
      summaryValue: {
        fontSize: 14,
        fontWeight: 900,
        color: primaryText,
        lineHeight: 1.5,
        wordBreak: "break-word",
      } satisfies CSSProperties,
      conditionalHintBox: {
        marginTop: 4,
        borderRadius: 14,
        padding: 12,
        color: secondaryText,
        fontSize: 13,
        lineHeight: 1.75,
      } satisfies CSSProperties,
      checkboxWrap: {
        display: "flex",
        gap: 12,
        padding: "14px 0",
      } satisfies CSSProperties,
      checkbox: {
        width: 18,
        height: 18,
        accentColor: accentBlue,
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
      actions: {
        display: "grid",
        gap: 10,
        marginTop: 18,
      } satisfies CSSProperties,
      primaryButton: {
        minHeight: 54,
        borderRadius: 16,
        background: accentBlue,
        color: "#ffffff",
        border: "1px solid var(--wa-green-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        cursor: "pointer",
        fontWeight: 800,
        padding: "0 20px",
        transition:
          "background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
        boxShadow: `0 12px 24px ${accentBlueShadow}`,
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
        padding: 16,
        borderRadius: 18,
        background: "rgba(24, 119, 242, 0.06)",
        border: "1px solid rgba(24, 119, 242, 0.12)",
        color: primaryText,
        display: "grid",
        gap: 12,
      } satisfies CSSProperties,
      successTitle: {
        fontWeight: 900,
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 2,
      } satisfies CSSProperties,
      successText: {
        fontSize: 13,
        lineHeight: 1.75,
      } satisfies CSSProperties,
      successCodesGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 10,
      } satisfies CSSProperties,
      successCodeBox: {
        borderRadius: 16,
        border: "1px solid rgba(24, 119, 242, 0.14)",
        background: "#ffffff",
        padding: "14px 14px",
        display: "grid",
        gap: 6,
      } satisfies CSSProperties,
      successCodeLabel: {
        fontSize: 12,
        fontWeight: 800,
        color: secondaryText,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      } satisfies CSSProperties,
      successCodeValue: {
        fontSize: 15,
        fontWeight: 900,
        color: primaryText,
        lineHeight: 1.6,
        wordBreak: "break-word",
      } satisfies CSSProperties,
      successHint: {
        fontSize: 12,
        lineHeight: 1.75,
        color: secondaryText,
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
        color: accentBlue,
      } satisfies CSSProperties,
      requiredMark: {
        color: accentBlue,
      } satisfies CSSProperties,
      seoWrap: {
        marginTop: 14,
        borderRadius: 18,
        border: "1px solid rgba(24, 119, 242, 0.14)",
        background: "#ffffff",
        overflow: "hidden",
        boxShadow: "0 8px 20px rgba(24, 119, 242, 0.05)",
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
      modalOverlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(17, 24, 39, 0.42)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        zIndex: 9999,
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      } satisfies CSSProperties,
      modalCard: {
        width: "100%",
        maxWidth: 720,
        maxHeight: "calc(100vh - 40px)",
        overflowY: "auto",
        background: "#ffffff",
        borderRadius: 24,
        border: "1px solid rgba(24, 119, 242, 0.16)",
        boxShadow: "0 24px 60px rgba(17, 24, 39, 0.20)",
        padding: "20px",
        display: "grid",
        gap: 16,
      } satisfies CSSProperties,
      modalTop: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
      } satisfies CSSProperties,
      modalTitleWrap: {
        display: "grid",
        gap: 8,
      } satisfies CSSProperties,
      modalTitle: {
        margin: 0,
        fontSize: "clamp(22px, 3vw, 28px)",
        lineHeight: 1.15,
        fontWeight: 900,
        color: primaryText,
      } satisfies CSSProperties,
      modalText: {
        margin: 0,
        fontSize: 14,
        lineHeight: 1.85,
        color: secondaryText,
      } satisfies CSSProperties,
      modalClose: {
        width: 42,
        height: 42,
        borderRadius: 999,
        border: "1px solid rgba(24, 119, 242, 0.16)",
        background: "#ffffff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: primaryText,
        flexShrink: 0,
      } satisfies CSSProperties,
      modalGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 12,
      } satisfies CSSProperties,
      modalBox: {
        borderRadius: 18,
        border: "1px solid rgba(24, 119, 242, 0.14)",
        background: "rgba(24, 119, 242, 0.04)",
        padding: "14px 16px",
        display: "grid",
        gap: 6,
      } satisfies CSSProperties,
      modalLabel: {
        fontSize: 12,
        fontWeight: 800,
        color: secondaryText,
      } satisfies CSSProperties,
      modalValue: {
        fontSize: 15,
        fontWeight: 900,
        color: primaryText,
        lineHeight: 1.6,
        wordBreak: "break-word",
      } satisfies CSSProperties,
      modalActions: {
        display: "flex",
        gap: 10,
        justifyContent: isArabic ? "flex-start" : "flex-end",
        flexWrap: "wrap",
        paddingTop: 4,
      } satisfies CSSProperties,
      modalCancel: {
        minHeight: 48,
        padding: "0 18px",
        borderRadius: 14,
        border: "1px solid rgba(24, 119, 242, 0.16)",
        background: "#ffffff",
        color: primaryText,
        fontWeight: 800,
        cursor: "pointer",
      } satisfies CSSProperties,
      modalSubmit: {
        minHeight: 48,
        padding: "0 18px",
        borderRadius: 14,
        border: "1px solid rgba(24, 119, 242, 0.16)",
        background: accentBlue,
        color: "#ffffff",
        fontWeight: 800,
        cursor: "pointer",
        boxShadow: `0 12px 24px ${accentBlueShadow}`,
      } satisfies CSSProperties,
    };
  }, [isArabic, seoOpen]);

  const arrowIcon = isArabic ? <ArrowLeft size={18} /> : <ArrowRight size={18} />;

  const appointmentModes = [
    { value: "we_come_free" as AppointmentMode, icon: <MapPinned size={18} /> },
    { value: "at_store" as AppointmentMode, icon: <Store size={18} /> },
    { value: "phone_call" as AppointmentMode, icon: <PhoneCall size={18} /> },
  ];

  const modeTheme = sectionThemes.mode;
  const scheduleTheme = sectionThemes.schedule;
  const customerTheme = sectionThemes.customer;

  return (
    <div style={styles.page} dir={direction}>
      <Header />

      <main style={styles.wrapper}>
        <section style={styles.pageIntro}>
          <span style={styles.badge}>
            <CalendarDays size={15} />
            {bookingText.pageTitle[currentLanguage]}
          </span>

          <h1 style={styles.pageTitle}>{bookingText.pageTitle[currentLanguage]}</h1>
          <p style={styles.pageText}>{bookingText.pageSubtitle[currentLanguage]}</p>
        </section>

        <form onSubmit={handleSubmit} noValidate style={styles.formWrap}>
          <section
            style={{
              ...styles.accordionCard,
              border: `1px solid ${modeTheme.border}`,
              boxShadow: `0 10px 24px ${modeTheme.shadow}`,
            }}
          >
            <button
              type="button"
              style={{
                ...styles.accordionButton,
                background: openSection === "mode" ? modeTheme.panel : "#ffffff",
              }}
              onClick={() => setOpenSection("mode")}
              aria-expanded={openSection === "mode"}
            >
              <div style={styles.accordionButtonLeft}>
                <span
                  style={{
                    ...styles.accordionNumber,
                    background: modeTheme.solid,
                  }}
                >
                  1
                </span>
                <div style={styles.accordionTitleWrap}>
                  <h2 style={styles.accordionTitle}>
                    {bookingText.modeSectionTitle[currentLanguage]}
                  </h2>
                  <p style={styles.accordionText}>
                    {bookingText.modeSectionText[currentLanguage]}
                  </p>
                </div>
              </div>

              <span
                style={{
                  ...styles.accordionMeta,
                  background: modeTheme.soft,
                  color: modeTheme.text,
                }}
              >
                {appointmentModeLabel}
              </span>
            </button>

            {openSection === "mode" ? (
              <div
                style={{
                  ...styles.accordionContent,
                  borderTop: `1px solid ${modeTheme.border}`,
                  background: "rgba(24, 119, 242, 0.02)",
                }}
              >
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
                          border: `1px solid ${
                            isActive
                              ? modeTheme.border
                              : "rgba(24, 119, 242, 0.16)"
                          }`,
                          boxShadow: isActive
                            ? `0 10px 22px ${modeTheme.shadow}`
                            : "none",
                          transform: isActive ? "translateY(-1px)" : "translateY(0)",
                        }}
                        aria-pressed={isActive}
                      >
                        <div style={styles.modeSelectorTop}>
                          <span style={styles.modeSelectorIconWrap}>
                            <span
                              style={{
                                ...styles.modeSelectorIcon,
                                background: modeTheme.solid,
                              }}
                            >
                              {modeItem.icon}
                            </span>
                            <span style={styles.modeSelectorTitle}>
                              {
                                bookingText.modeOptions[modeItem.value][
                                  currentLanguage
                                ]
                              }
                            </span>
                          </span>
                          <span
                            style={
                              isActive
                                ? {
                                    ...styles.activeCircle,
                                    background: modeTheme.solid,
                                    border: `2px solid ${modeTheme.solid}`,
                                  }
                                : {
                                    ...styles.inactiveCircle,
                                    border: `2px solid ${modeTheme.border}`,
                                  }
                            }
                          />
                        </div>

                        <p style={styles.modeSelectorDescription}>
                          {
                            bookingText.modeDescriptions[modeItem.value][
                              currentLanguage
                            ]
                          }
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </section>

          <section
            style={{
              ...styles.accordionCard,
              border: `1px solid ${scheduleTheme.border}`,
              boxShadow: `0 10px 24px ${scheduleTheme.shadow}`,
            }}
          >
            <button
              type="button"
              style={{
                ...styles.accordionButton,
                background:
                  openSection === "schedule" ? scheduleTheme.panel : "#ffffff",
              }}
              onClick={() => setOpenSection("schedule")}
              aria-expanded={openSection === "schedule"}
            >
              <div style={styles.accordionButtonLeft}>
                <span
                  style={{
                    ...styles.accordionNumber,
                    background: scheduleTheme.solid,
                  }}
                >
                  2
                </span>
                <div style={styles.accordionTitleWrap}>
                  <h2 style={styles.accordionTitle}>
                    {bookingText.scheduleSectionTitle[currentLanguage]}
                  </h2>
                  <p style={styles.accordionText}>
                    {bookingText.scheduleSectionText[currentLanguage]}
                  </p>
                </div>
              </div>

              <span
                style={{
                  ...styles.accordionMeta,
                  background: scheduleTheme.soft,
                  color: scheduleTheme.text,
                }}
              >
                {selectedDateFormatted && selectedTimeRange
                  ? `${selectedDateFormatted} • ${selectedTimeRange}`
                  : bookingText.summaryEmpty[currentLanguage]}
              </span>
            </button>

            {openSection === "schedule" ? (
              <div
                style={{
                  ...styles.accordionContent,
                  borderTop: `1px solid ${scheduleTheme.border}`,
                  background: "rgba(242, 140, 24, 0.02)",
                }}
              >
                <div style={styles.dayList}>
                  {daysLoading ? (
                    <div
                      style={{
                        ...styles.availabilityInfo,
                        background: scheduleTheme.soft,
                        border: `1px solid ${scheduleTheme.border}`,
                      }}
                    >
                      {bookingText.loadingDays[currentLanguage]}
                    </div>
                  ) : daysError ? (
                    <div style={styles.errorBox}>{daysError}</div>
                  ) : availableDays.length === 0 ? (
                    <div
                      style={{
                        ...styles.availabilityInfo,
                        background: scheduleTheme.soft,
                        border: `1px solid ${scheduleTheme.border}`,
                      }}
                    >
                      {bookingText.noAvailableDays[currentLanguage]}
                    </div>
                  ) : (
                    availableDays.map((day) => {
                      const isOpen = selectedDate === day.date;

                      return (
                        <div
                          key={day.id}
                          style={{
                            ...styles.dayCard,
                            border: `1px solid ${
                              isOpen
                                ? scheduleTheme.border
                                : "rgba(242, 140, 24, 0.16)"
                            }`,
                            boxShadow: isOpen
                              ? `0 8px 20px ${scheduleTheme.shadow}`
                              : "none",
                          }}
                        >
                          <button
                            type="button"
                            style={{
                              ...styles.dayButton,
                              background: isOpen ? scheduleTheme.panel : "#ffffff",
                            }}
                            onClick={() => handleAvailableDaySelection(day.date)}
                            aria-expanded={isOpen}
                          >
                            <div style={styles.dayMain}>
                              <div style={styles.dayTitle}>
                                {formatDisplayDate(day.date, currentLanguage)}
                              </div>
                              {day.note ? (
                                <div style={styles.dayNote}>{day.note}</div>
                              ) : null}
                            </div>

                            <span
                              style={{
                                ...styles.dayBadge,
                                background: scheduleTheme.solid,
                              }}
                            >
                              {isOpen
                                ? bookingText.hideTimes[currentLanguage]
                                : bookingText.openTimes[currentLanguage]}
                            </span>
                          </button>

                          {isOpen ? (
                            <div
                              style={{
                                ...styles.slotsWrap,
                                borderTop: `1px solid ${scheduleTheme.border}`,
                              }}
                            >
                              {slotsLoading ? (
                                <div
                                  style={{
                                    ...styles.availabilityInfo,
                                    background: scheduleTheme.soft,
                                    border: `1px solid ${scheduleTheme.border}`,
                                  }}
                                >
                                  {bookingText.loadingSlots[currentLanguage]}
                                </div>
                              ) : slotsError ? (
                                <div style={styles.errorBox}>{slotsError}</div>
                              ) : availableSlots.filter(
                                  (slot) => slot.status === "available"
                                ).length === 0 ? (
                                <div
                                  style={{
                                    ...styles.availabilityInfo,
                                    background: scheduleTheme.soft,
                                    border: `1px solid ${scheduleTheme.border}`,
                                  }}
                                >
                                  {bookingText.noAvailableSlots[currentLanguage]}
                                </div>
                              ) : (
                                <div style={styles.slotsGrid}>
                                  {availableSlots
                                    .filter((slot) => slot.status === "available")
                                    .map((slot) => {
                                      const isSelected = selectedSlotId === slot.id;

                                      return (
                                        <button
                                          key={slot.id}
                                          type="button"
                                          onClick={() => handleSlotSelection(slot)}
                                          style={{
                                            ...styles.slotCard,
                                            border: `1px solid ${
                                              isSelected
                                                ? scheduleTheme.border
                                                : "rgba(242, 140, 24, 0.18)"
                                            }`,
                                            boxShadow: isSelected
                                              ? `0 10px 22px ${scheduleTheme.shadow}`
                                              : "none",
                                            transform: isSelected
                                              ? "translateY(-1px)"
                                              : "translateY(0)",
                                          }}
                                          aria-pressed={isSelected}
                                        >
                                          <div style={styles.slotCardTop}>
                                            <span
                                              style={{
                                                ...styles.slotStatusBadge,
                                                background: scheduleTheme.solid,
                                                color: "#ffffff",
                                              }}
                                            >
                                              {
                                                bookingText.slotStatus.available[
                                                  currentLanguage
                                                ]
                                              }
                                            </span>

                                            <span
                                              style={
                                                isSelected
                                                  ? {
                                                      ...styles.activeCircle,
                                                      background:
                                                        scheduleTheme.solid,
                                                      border: `2px solid ${scheduleTheme.solid}`,
                                                    }
                                                  : {
                                                      ...styles.inactiveCircle,
                                                      border: `2px solid ${scheduleTheme.border}`,
                                                    }
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
                                            <div style={styles.slotNote}>
                                              {slot.note}
                                            </div>
                                          ) : null}
                                        </button>
                                      );
                                    })}
                                </div>
                              )}
                            </div>
                          ) : null}
                        </div>
                      );
                    })
                  )}
                </div>

                <div style={styles.summaryStrip}>
                  <div
                    style={{
                      ...styles.summaryBox,
                      background: scheduleTheme.soft,
                      border: `1px solid ${scheduleTheme.border}`,
                    }}
                  >
                    <span style={styles.summaryLabel}>
                      {bookingText.selectedDay[currentLanguage]}
                    </span>
                    <span style={styles.summaryValue}>
                      {selectedDateFormatted ||
                        bookingText.summaryEmpty[currentLanguage]}
                    </span>
                  </div>

                  <div
                    style={{
                      ...styles.summaryBox,
                      background: scheduleTheme.soft,
                      border: `1px solid ${scheduleTheme.border}`,
                    }}
                  >
                    <span style={styles.summaryLabel}>
                      {bookingText.selectedTime[currentLanguage]}
                    </span>
                    <span style={styles.summaryValue}>
                      {selectedTimeRange ||
                        bookingText.summaryEmpty[currentLanguage]}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          <section
            style={{
              ...styles.accordionCard,
              border: `1px solid ${customerTheme.border}`,
              boxShadow: `0 10px 24px ${customerTheme.shadow}`,
            }}
          >
            <button
              type="button"
              style={{
                ...styles.accordionButton,
                background:
                  openSection === "customer" ? customerTheme.panel : "#ffffff",
              }}
              onClick={() => setOpenSection("customer")}
              aria-expanded={openSection === "customer"}
            >
              <div style={styles.accordionButtonLeft}>
                <span
                  style={{
                    ...styles.accordionNumber,
                    background: customerTheme.solid,
                  }}
                >
                  3
                </span>
                <div style={styles.accordionTitleWrap}>
                  <h2 style={styles.accordionTitle}>
                    {bookingText.customerSectionTitle[currentLanguage]}
                  </h2>
                  <p style={styles.accordionText}>
                    {bookingText.customerSectionText[currentLanguage]}
                  </p>
                </div>
              </div>

              <span
                style={{
                  ...styles.accordionMeta,
                  background: customerTheme.soft,
                  color: customerTheme.text,
                }}
              >
                {formData.fullName.trim() ||
                  bookingText.summaryEmpty[currentLanguage]}
              </span>
            </button>

            {openSection === "customer" ? (
              <div
                style={{
                  ...styles.accordionContent,
                  borderTop: `1px solid ${customerTheme.border}`,
                  background: "rgba(15, 157, 122, 0.02)",
                }}
              >
                <div style={styles.typeModeRow}>
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
                      style={{
                        ...styles.inputBase,
                        border: `1px solid ${customerTheme.border}`,
                      }}
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

                  <div
                    style={{
                      ...styles.summaryBox,
                      background: customerTheme.soft,
                      border: `1px solid ${customerTheme.border}`,
                    }}
                  >
                    <span style={styles.summaryLabel}>
                      {bookingText.selectedTime[currentLanguage]}
                    </span>
                    <span style={styles.summaryValue}>
                      {selectedTimeRange ||
                        bookingText.summaryEmpty[currentLanguage]}
                    </span>
                  </div>
                </div>

                <div style={styles.fieldGrid}>
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
                      style={{
                        ...styles.inputBase,
                        border: `1px solid ${customerTheme.border}`,
                      }}
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
                      style={{
                        ...styles.inputBase,
                        border: `1px solid ${customerTheme.border}`,
                      }}
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
                      style={{
                        ...styles.inputBase,
                        border: `1px solid ${customerTheme.border}`,
                      }}
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
                      style={{
                        ...styles.inputBase,
                        border: `1px solid ${customerTheme.border}`,
                      }}
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
                      style={{
                        ...styles.inputBase,
                        border: `1px solid ${customerTheme.border}`,
                      }}
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
                      style={{
                        ...styles.inputBase,
                        border: `1px solid ${customerTheme.border}`,
                      }}
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
                      style={{
                        ...styles.inputBase,
                        border: `1px solid ${customerTheme.border}`,
                      }}
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
                      style={{
                        ...styles.inputBase,
                        border: `1px solid ${customerTheme.border}`,
                      }}
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
                      style={{
                        ...styles.textarea,
                        border: `1px solid ${customerTheme.border}`,
                      }}
                    />
                  </div>
                </div>

                {isVisitMode ? (
                  <div
                    style={{
                      ...styles.conditionalHintBox,
                      background: customerTheme.soft,
                      border: `1px solid ${customerTheme.border}`,
                    }}
                  >
                    {bookingText.addressHint[currentLanguage]}
                  </div>
                ) : null}

                {isPhoneMode ? (
                  <div
                    style={{
                      ...styles.conditionalHintBox,
                      background: customerTheme.soft,
                      border: `1px solid ${customerTheme.border}`,
                    }}
                  >
                    {bookingText.phoneHint[currentLanguage]}
                  </div>
                ) : null}

                {isStoreMode ? (
                  <div
                    style={{
                      ...styles.conditionalHintBox,
                      background: customerTheme.soft,
                      border: `1px solid ${customerTheme.border}`,
                    }}
                  >
                    {bookingText.storeHint[currentLanguage]}
                  </div>
                ) : null}

                <div>
                  <h3
                    style={{
                      margin: "2px 0 8px",
                      fontSize: 16,
                      fontWeight: 900,
                      color: primaryText,
                    }}
                  >
                    {bookingText.consentTitle[currentLanguage]}
                  </h3>

                  <label
                    style={{
                      ...styles.checkboxWrap,
                      borderTop: `1px solid ${customerTheme.border}`,
                    }}
                  >
                    <input
                      type="checkbox"
                      name="privacyAccepted"
                      checked={formData.privacyAccepted}
                      onChange={handleInputChange}
                      style={{
                        ...styles.checkbox,
                        accentColor: customerTheme.solid,
                      }}
                      required
                    />
                    <span style={styles.checkboxLabel}>
                      {bookingText.privacyAccepted[currentLanguage]}
                    </span>
                  </label>

                  <label
                    style={{
                      ...styles.checkboxWrap,
                      borderTop: `1px solid ${customerTheme.border}`,
                    }}
                  >
                    <input
                      type="checkbox"
                      name="marketingAccepted"
                      checked={formData.marketingAccepted}
                      onChange={handleInputChange}
                      style={{
                        ...styles.checkbox,
                        accentColor: customerTheme.solid,
                      }}
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

                      {(requestReference || customerCode) ? (
                        <>
                          <div style={styles.successCodesGrid}>
                            <div style={styles.successCodeBox}>
                              <span style={styles.successCodeLabel}>
                                <Hash size={14} />
                                {bookingText.successRequestId[currentLanguage]}
                              </span>
                              <span style={styles.successCodeValue}>
                                {requestReference || "—"}
                              </span>
                            </div>

                            <div style={styles.successCodeBox}>
                              <span style={styles.successCodeLabel}>
                                <BadgeCheck size={14} />
                                {bookingText.successCustomerCode[currentLanguage]}
                              </span>
                              <span style={styles.successCodeValue}>
                                {customerCode || "—"}
                              </span>
                            </div>
                          </div>

                          <div style={styles.successHint}>
                            {bookingText.successReferenceHint[currentLanguage]}
                          </div>
                        </>
                      ) : null}
                    </div>
                  ) : null}

                  <div style={styles.actions}>
                    <button
                      type="submit"
                      style={{
                        ...styles.primaryButton,
                        opacity: isSubmitting ? 0.82 : 1,
                        background: isSubmitting ? "#7aaef6" : accentBlue,
                      }}
                      disabled={isSubmitting}
                      onMouseEnter={(event) => {
                        if (!isSubmitting) {
                          event.currentTarget.style.background = accentBlueHover;
                          event.currentTarget.style.transform = "translateY(-1px)";
                        }
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.background = isSubmitting
                          ? "#7aaef6"
                          : accentBlue;
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
                </div>
              </div>
            ) : null}
          </section>
        </form>

        <section style={styles.seoWrap}>
          <button
            type="button"
            onClick={() => setSeoOpen((previous) => !previous)}
            style={styles.seoButton}
            aria-expanded={seoOpen}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
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

        {showConfirmModal ? (
          <div
            style={styles.modalOverlay}
            onClick={() => {
              if (isSubmitting) return;
              setShowConfirmModal(false);
            }}
          >
            <div
              style={styles.modalCard}
              onClick={(event) => event.stopPropagation()}
            >
              <div style={styles.modalTop}>
                <div style={styles.modalTitleWrap}>
                  <h2 style={styles.modalTitle}>
                    {bookingText.confirmTitle[currentLanguage]}
                  </h2>
                  <p style={styles.modalText}>
                    {bookingText.confirmText[currentLanguage]}
                  </p>
                </div>

                <button
                  type="button"
                  style={styles.modalClose}
                  onClick={() => {
                    if (isSubmitting) return;
                    setShowConfirmModal(false);
                  }}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div style={styles.modalGrid}>
                <div style={styles.modalBox}>
                  <span style={styles.modalLabel}>
                    {bookingText.confirmMode[currentLanguage]}
                  </span>
                  <span style={styles.modalValue}>{appointmentModeLabel}</span>
                </div>

                <div style={styles.modalBox}>
                  <span style={styles.modalLabel}>
                    {bookingText.confirmType[currentLanguage]}
                  </span>
                  <span style={styles.modalValue}>{appointmentTypeLabel}</span>
                </div>

                <div style={styles.modalBox}>
                  <span style={styles.modalLabel}>
                    {bookingText.selectedDay[currentLanguage]}
                  </span>
                  <span style={styles.modalValue}>
                    {selectedDateFormatted || "—"}
                  </span>
                </div>

                <div style={styles.modalBox}>
                  <span style={styles.modalLabel}>
                    {bookingText.selectedTime[currentLanguage]}
                  </span>
                  <span style={styles.modalValue}>
                    {selectedTimeRange || "—"}
                  </span>
                </div>

                <div style={styles.modalBox}>
                  <span style={styles.modalLabel}>
                    {bookingText.confirmName[currentLanguage]}
                  </span>
                  <span style={styles.modalValue}>
                    {salutationLabel !== "—"
                      ? `${salutationLabel} ${formData.fullName.trim() || ""}`.trim()
                      : formData.fullName.trim() || "—"}
                  </span>
                </div>

                <div style={styles.modalBox}>
                  <span style={styles.modalLabel}>
                    {bookingText.confirmContact[currentLanguage]}
                  </span>
                  <span style={styles.modalValue}>
                    {[formData.email.trim(), formData.phone.trim()]
                      .filter(Boolean)
                      .join(" • ") || "—"}
                  </span>
                </div>

                <div style={{ ...styles.modalBox, gridColumn: "1 / -1" }}>
                  <span style={styles.modalLabel}>
                    {bookingText.confirmAddress[currentLanguage]}
                  </span>
                  <span style={styles.modalValue}>{reviewAddress}</span>
                </div>
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  style={styles.modalCancel}
                  onClick={() => {
                    if (isSubmitting) return;
                    setShowConfirmModal(false);
                  }}
                  disabled={isSubmitting}
                >
                  {bookingText.confirmCancel[currentLanguage]}
                </button>

                <button
                  type="button"
                  style={{
                    ...styles.modalSubmit,
                    opacity: isSubmitting ? 0.82 : 1,
                    background: isSubmitting ? "#7aaef6" : accentBlue,
                  }}
                  onClick={() => {
                    if (isSubmitting) return;
                    void submitBookingRequest();
                  }}
                  disabled={isSubmitting}
                >
                  <Send size={17} />
                  {bookingText.confirmSend[currentLanguage]}
                </button>
              </div>
            </div>
          </div>
        ) : null}

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