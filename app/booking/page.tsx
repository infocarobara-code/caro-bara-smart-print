"use client";

import Link from "next/link";
import {
  useMemo,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
} from "react";
import Header from "@/components/Header";
import { useLanguage } from "@/lib/languageContext";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPinned,
  PhoneCall,
  Send,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Store,
  UserRound,
} from "lucide-react";

type BookingLanguage = "ar" | "de" | "en";
type AppointmentType = "consultation" | "design" | "visit" | "installation";
type AppointmentMode = "at_store" | "we_come_free" | "phone_call";

type BookingFormData = {
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

type CalendarDay = {
  key: string;
  date: Date;
  iso: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isClosed: boolean;
  isPast: boolean;
  isSelected: boolean;
};

const bookingText = {
  badge: {
    ar: "حجز موعد",
    de: "Terminbuchung",
    en: "Book an Appointment",
  },
  title: {
    ar: "احجز موعدك بوضوح وسرعة",
    de: "Buche deinen Termin klar und schnell",
    en: "Book your appointment clearly and quickly",
  },
  subtitle: {
    ar: "اختر 3 أيام مناسبة لك فقط من الإثنين إلى الخميس. بعد الإرسال نراجع الخيارات ونؤكد لك الموعد النهائي ضمن الفترة المتاحة بين 11:00 و15:00.",
    de: "Wähle genau 3 passende Tage von Montag bis Donnerstag. Nach dem Absenden prüfen wir deine Auswahl und bestätigen dir den finalen Termin im verfügbaren Zeitfenster zwischen 11:00 und 15:00.",
    en: "Choose exactly 3 suitable days from Monday to Thursday. After submission, we review your selection and confirm the final appointment within the available window between 11:00 and 15:00.",
  },
  detailsTitle: {
    ar: "تفاصيل الموعد",
    de: "Termindetails",
    en: "Appointment Details",
  },
  calendarTitle: {
    ar: "اختيار 3 أيام",
    de: "3 Tage auswählen",
    en: "Select 3 Days",
  },
  calendarSubtitle: {
    ar: "يجب اختيار 3 أيام مختلفة. الجمعة والسبت والأحد مغلقة وغير قابلة للحجز.",
    de: "Es müssen 3 unterschiedliche Tage gewählt werden. Freitag, Samstag und Sonntag sind geschlossen und nicht buchbar.",
    en: "You must choose 3 different days. Friday, Saturday, and Sunday are closed and not bookable.",
  },
  calendarHint: {
    ar: "اختر 3 أيام، ونحن نؤكد الموعد النهائي.",
    de: "Wähle 3 Tage, wir bestätigen den finalen Termin.",
    en: "Choose 3 days, and we confirm the final appointment.",
  },
  selectedDaysTitle: {
    ar: "الأيام المختارة",
    de: "Gewählte Tage",
    en: "Selected Days",
  },
  modeTitle: {
    ar: "طريقة الموعد",
    de: "Terminart der Durchführung",
    en: "Appointment Mode",
  },
  customerTitle: {
    ar: "بيانات العميل والعنوان",
    de: "Kundendaten und Adresse",
    en: "Customer Details and Address",
  },
  consentTitle: {
    ar: "الموافقات",
    de: "Einwilligungen",
    en: "Consents",
  },
  summaryTitle: {
    ar: "ملخص سريع",
    de: "Kurzübersicht",
    en: "Quick Summary",
  },
  summarySubtitle: {
    ar: "راجع البيانات قبل الإرسال",
    de: "Prüfe die Angaben vor dem Senden",
    en: "Review the details before sending",
  },
  appointmentWindow: {
    ar: "سيتم تحديد الوقت النهائي لاحقًا ضمن 11:00 – 15:00",
    de: "Die finale Uhrzeit wird später zwischen 11:00 – 15:00 festgelegt",
    en: "The final time will be set later within 11:00 – 15:00",
  },
  type: {
    ar: "نوع الموعد",
    de: "Terminart",
    en: "Appointment Type",
  },
  mode: {
    ar: "طريقة الموعد",
    de: "Terminweg",
    en: "Appointment Mode",
  },
  fullName: {
    ar: "الاسم الكامل",
    de: "Vollständiger Name",
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
    ar: "ملاحظات",
    de: "Notizen",
    en: "Notes",
  },
  notesPlaceholderDefault: {
    ar: "اكتب باختصار هدف الموعد أو تفاصيل الطلب...",
    de: "Beschreibe kurz dein Anliegen oder Ziel des Termins...",
    en: "Briefly describe your request or the goal of the appointment...",
  },
  notesPlaceholderVisit: {
    ar: "اكتب تفاصيل تساعدنا قبل زيارة موقعك...",
    de: "Schreibe Hinweise, die uns vor dem Termin bei dir helfen...",
    en: "Add details that help us before coming to your location...",
  },
  notesPlaceholderCall: {
    ar: "اكتب موضوع المكالمة أو الخدمة المطلوبة...",
    de: "Schreibe kurz das Thema des Anrufs oder die gewünschte Leistung...",
    en: "Briefly describe the call topic or requested service...",
  },
  privacyAccepted: {
    ar: "أوافق على حفظ ومعالجة بياناتي من أجل تنظيم الموعد والتواصل المرتبط به.",
    de: "Ich stimme der Speicherung und Verarbeitung meiner Daten zur Terminorganisation und zur dazugehörigen Kontaktaufnahme zu.",
    en: "I agree to the storage and processing of my data for appointment organization and related communication.",
  },
  marketingAccepted: {
    ar: "أوافق اختياريًا على تلقي العروض والتحديثات من Caro Bara.",
    de: "Ich stimme optional dem Erhalt von Angeboten und Updates von Caro Bara zu.",
    en: "I optionally agree to receive offers and updates from Caro Bara.",
  },
  agb: {
    ar: "AGB / Datenschutz: بإرسال هذا النموذج، يتم استخدام بياناتك فقط لمعالجة طلب الموعد والتواصل المرتبط به ضمن الإطار القانوني المعمول به.",
    de: "AGB / Datenschutz: Mit dem Absenden dieses Formulars werden deine Daten ausschließlich zur Bearbeitung deiner Terminanfrage und der dazugehörigen Kommunikation im gesetzlichen Rahmen verwendet.",
    en: "AGB / Privacy: By submitting this form, your data is used only for processing your appointment request and related communication within the applicable legal framework.",
  },
  requiredHint: {
    ar: "الحقول الإلزامية",
    de: "Pflichtfelder",
    en: "Required fields",
  },
  closedLabel: {
    ar: "مغلق",
    de: "Geschlossen",
    en: "Closed",
  },
  selectedLabel: {
    ar: "تم الاختيار",
    de: "Ausgewählt",
    en: "Selected",
  },
  openLabel: {
    ar: "متاح",
    de: "Verfügbar",
    en: "Open",
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
  modeOptions: {
    at_store: {
      ar: "أزوركم في مقر Caro Bara",
      de: "Ich komme zu Caro Bara",
      en: "I visit Caro Bara",
    },
    we_come_free: {
      ar: "تأتون أنتم إلى موقعي",
      de: "Ihr kommt zu meinem Standort",
      en: "You come to my location",
    },
    phone_call: {
      ar: "موعد عبر اتصال هاتفي",
      de: "Termin per Telefonanruf",
      en: "Appointment by phone call",
    },
  },
  modeDescriptions: {
    at_store: {
      ar: "مناسب إذا كنت تريد زيارة مقرنا ومراجعة التفاصيل مباشرة.",
      de: "Ideal, wenn du uns besuchen und Details direkt besprechen möchtest.",
      en: "Great if you want to visit us and review the details in person.",
    },
    we_come_free: {
      ar: "نراجع الطلب أو الموقع عندك ثم نؤكد الترتيب المناسب.",
      de: "Wir sehen uns deinen Auftrag oder Standort vor Ort an und bestätigen danach die passende Planung.",
      en: "We review the request or location on-site and then confirm the suitable arrangement.",
    },
    phone_call: {
      ar: "حل سريع ومرن للمراجعة الأولية أو التنسيق السريع.",
      de: "Eine schnelle und flexible Lösung für erste Abstimmung oder kurze Beratung.",
      en: "A fast and flexible option for initial coordination or quick consultation.",
    },
  },
  benefitTitle: {
    ar: "حجز واضح بدون تعقيد",
    de: "Klare Buchung ohne Komplexität",
    en: "Clear booking without complexity",
  },
  benefitSubtitle: {
    ar: "أنت تختار 3 أيام مناسبة، ونحن نؤكد أفضل موعد نهائي حسب التوفر والتنظيم.",
    de: "Du wählst 3 passende Tage, wir bestätigen den besten finalen Termin nach Verfügbarkeit und Planung.",
    en: "You choose 3 suitable days, and we confirm the best final appointment based on availability and scheduling.",
  },
  addressHint: {
    ar: "العنوان كامل إلزامي ضمن بيانات العميل.",
    de: "Die vollständige Adresse ist ein Pflichtbestandteil der Kundendaten.",
    en: "The full address is a required part of the customer details.",
  },
  phoneHint: {
    ar: "سنستخدم رقم الهاتف للتأكيد والتنسيق النهائي.",
    de: "Wir verwenden deine Telefonnummer für Bestätigung und finale Abstimmung.",
    en: "We will use your phone number for confirmation and final coordination.",
  },
  storeHint: {
    ar: "بعد الإرسال سننسق معك تفاصيل الزيارة إلى مقر Caro Bara.",
    de: "Nach dem Absenden stimmen wir die Details deines Besuchs bei Caro Bara mit dir ab.",
    en: "After submission, we will coordinate the details of your visit to Caro Bara.",
  },
  reviewName: {
    ar: "الاسم",
    de: "Name",
    en: "Name",
  },
  reviewDays: {
    ar: "الأيام المختارة",
    de: "Gewählte Tage",
    en: "Selected Days",
  },
  reviewType: {
    ar: "نوع الموعد",
    de: "Terminart",
    en: "Appointment Type",
  },
  reviewMode: {
    ar: "طريقة الموعد",
    de: "Terminweg",
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
  toCart: {
    ar: "الانتقال إلى السلة",
    de: "Zum Warenkorb",
    en: "Go to Cart",
  },
  submitHint: {
    ar: "اختر 3 أيام واضحة ومختلفة، ثم أرسل الطلب لنؤكد الموعد النهائي.",
    de: "Wähle 3 klare und unterschiedliche Tage und sende dann die Anfrage ab, damit wir den finalen Termin bestätigen können.",
    en: "Choose 3 clear and different days, then send the request so we can confirm the final appointment.",
  },
  successTitle: {
    ar: "تم إرسال طلب الموعد بنجاح",
    de: "Terminanfrage erfolgreich gesendet",
    en: "Appointment request sent successfully",
  },
  successText: {
    ar: "تم حفظ طلب الموعد بنجاح. سنراجع الأيام الثلاثة ونتواصل معك لتأكيد الموعد النهائي.",
    de: "Die Terminanfrage wurde erfolgreich gespeichert. Wir prüfen deine drei Tage und kontaktieren dich zur finalen Bestätigung.",
    en: "Your appointment request was saved successfully. We will review your three selected days and contact you to confirm the final appointment.",
  },
  backHome: {
    ar: "العودة للرئيسية",
    de: "Zur Startseite",
    en: "Back to Home",
  },
  requiredError: {
    ar: "يرجى تعبئة الحقول الإلزامية والموافقة على حفظ البيانات.",
    de: "Bitte fülle die Pflichtfelder aus und stimme der Datenspeicherung zu.",
    en: "Please complete the required fields and accept data storage.",
  },
  addressRequiredError: {
    ar: "يرجى تعبئة بيانات العنوان كاملة لأنها إلزامية.",
    de: "Bitte fülle die Adressdaten vollständig aus, da sie verpflichtend sind.",
    en: "Please complete the full address because it is required.",
  },
  selectedDaysRequiredError: {
    ar: "يرجى اختيار 3 أيام مختلفة من الإثنين إلى الخميس.",
    de: "Bitte wähle 3 unterschiedliche Tage von Montag bis Donnerstag.",
    en: "Please choose 3 different days from Monday to Thursday.",
  },  genericError: {
    ar: "حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.",
    de: "Beim Senden ist ein Fehler aufgetreten. Bitte versuche es erneut.",
    en: "Something went wrong while sending the request. Please try again.",
  },
  fieldDescriptions: {
    type: {
      ar: "حدد نوع الموعد المطلوب بوضوح.",
      de: "Wähle klar die gewünschte Terminart.",
      en: "Select the required appointment type clearly.",
    },
    mode: {
      ar: "اختر كيف تريد أن يتم الموعد.",
      de: "Wähle, wie der Termin stattfinden soll.",
      en: "Choose how the appointment should happen.",
    },
    customer: {
      ar: "هذه البيانات تساعدنا على تأكيد الموعد والتواصل معك بسرعة.",
      de: "Diese Angaben helfen uns, deinen Termin schnell zu bestätigen und dich zu kontaktieren.",
      en: "These details help us confirm your appointment and contact you quickly.",
    },
  },
  weekdaysShort: {
    ar: ["الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"],
    de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  monthNames: {
    ar: [
      "يناير","فبراير","مارس","أبريل","مايو","يونيو",
      "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
    ],
    de: [
      "Januar","Februar","März","April","Mai","Juni",
      "Juli","August","September","Oktober","November","Dezember",
    ],
    en: [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December",
    ],
  },
} as const;

/* ================== CONFIG ================== */

const pageBackground = "#ece8e1";
const cardBackground = "#f8f5ef";
const cardBorder = "rgba(21, 31, 41, 0.10)";
const inputBackground = "#fffdf9";
const primaryText = "#101923";
const secondaryText = "#516173";
const accentGreen = "#29cc5f";
const accentGreenHover = "#22b653";
const closedRed = "#d74c4c";
const closedRedSoft = "rgba(215, 76, 76, 0.10)";

/* ================== STATE ================== */

const initialFormData: BookingFormData = {
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

/* ================== HELPERS ================== */

function getDirection(language: BookingLanguage): "rtl" | "ltr" {
  return language === "ar" ? "rtl" : "ltr";
}

function padNumber(value: number) {
  return String(value).padStart(2, "0");
}

function toIsoDate(date: Date) {
  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isClosedDay(date: Date) {
  const d = date.getDay();
  return d === 5 || d === 6 || d === 0;
}

function isAllowedBusinessDay(date: Date) {
  const d = date.getDay();
  return d >= 1 && d <= 4;
}

function isPastDay(date: Date) {
  const today = new Date();
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const c = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return c < t;
}

function formatDisplayDate(date: Date, language: BookingLanguage) {
  const index = (date.getDay() + 6) % 7;
  const weekday = bookingText.weekdaysShort[language][index];
  const month = bookingText.monthNames[language][date.getMonth()];
  return `${weekday} • ${date.getDate()} ${month} ${date.getFullYear()}`;
}

/* ================== CALENDAR ================== */

function buildCalendarDays(
  monthDate: Date,
  selectedDays: string[]
): CalendarDay[] {
  const firstDay = startOfMonth(monthDate);
  const year = firstDay.getFullYear();
  const month = firstDay.getMonth();

  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - firstWeekday);

  const days: CalendarDay[] = [];

  for (let i = 0; i < 42; i++) {
    const current = new Date(gridStart);
    current.setDate(gridStart.getDate() + i);

    const iso = toIsoDate(current);
    const past = isPastDay(current);
    const closed = isClosedDay(current) || past;

    days.push({
      key: `${iso}-${i}`,
      date: current,
      iso,
      dayNumber: current.getDate(),
      isCurrentMonth: current.getMonth() === month,
      isClosed: closed,
      isPast: past,
      isSelected: selectedDays.includes(iso),
    });
  }

  return days;
}export default function BookingPage() {
  const { language } = useLanguage();

  const currentLanguage: BookingLanguage =
    language === "ar" || language === "de" || language === "en"
      ? language
      : "en";

  const isArabic = currentLanguage === "ar";
  const direction = getDirection(currentLanguage);

  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));
  const [error, setError] = useState("");
  const [showPreparedMessage, setShowPreparedMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isVisitMode = formData.mode === "we_come_free";
  const isPhoneMode = formData.mode === "phone_call";
  const isStoreMode = formData.mode === "at_store";

  const appointmentTypeLabel =
    bookingText.typeOptions[formData.type][currentLanguage];

  const appointmentModeLabel =
    bookingText.modeOptions[formData.mode][currentLanguage];

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
  }, [
    formData.city,
    formData.houseNumber,
    formData.postalCode,
    formData.street,
  ]);

  const selectedDaysFormatted = useMemo(
    () =>
      selectedDays
        .map((iso) => new Date(iso))
        .sort((a, b) => a.getTime() - b.getTime())
        .map((date) => formatDisplayDate(date, currentLanguage)),
    [currentLanguage, selectedDays]
  );

  const calendarDays = useMemo(
    () => buildCalendarDays(visibleMonth, selectedDays),
    [selectedDays, visibleMonth]
  );

  const monthLabel = `${bookingText.monthNames[currentLanguage][visibleMonth.getMonth()]} ${visibleMonth.getFullYear()}`;

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type, checked } = event.target as HTMLInputElement;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) {
      setError("");
    }
  }

  function handleDaySelection(day: CalendarDay) {
    if (day.isClosed || !day.isCurrentMonth || !isAllowedBusinessDay(day.date)) {
      return;
    }

    setSelectedDays((previous) => {
      const exists = previous.includes(day.iso);

      if (exists) {
        return previous.filter((item) => item !== day.iso);
      }

      if (previous.length >= 3) {
        return previous;
      }

      return [...previous, day.iso];
    });

    if (error) {
      setError("");
    }
  }

  function goToPreviousMonth() {
    setVisibleMonth(
      (previous) => new Date(previous.getFullYear(), previous.getMonth() - 1, 1)
    );
  }

  function goToNextMonth() {
    setVisibleMonth(
      (previous) => new Date(previous.getFullYear(), previous.getMonth() + 1, 1)
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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

    if (selectedDays.length !== 3) {
      setShowPreparedMessage(false);
      setError(bookingText.selectedDaysRequiredError[currentLanguage]);
      return;
    }

    const validSelectedDays = selectedDays.every((iso) => {
      const date = new Date(iso);
      return (
        !Number.isNaN(date.getTime()) &&
        isAllowedBusinessDay(date) &&
        !isPastDay(date)
      );
    });

    if (!validSelectedDays) {
      setShowPreparedMessage(false);
      setError(bookingText.selectedDaysRequiredError[currentLanguage]);
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
          selectedDays,
          appointmentWindow: "11:00-15:00",
          language: currentLanguage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || bookingText.genericError[currentLanguage]);
      }

      setShowPreparedMessage(true);
      setFormData(initialFormData);
      setSelectedDays([]);
      setVisibleMonth(startOfMonth(new Date()));
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
      borderRadius: 28,
      padding: "22px",
      boxShadow: "0 10px 28px rgba(16, 25, 35, 0.06)",
    };

    const fieldLabel: CSSProperties = {
      display: "block",
      fontSize: 14,
      fontWeight: 700,
      color: primaryText,
      marginBottom: 8,
      letterSpacing: "-0.01em",
    };

    const fieldHint: CSSProperties = {
      fontSize: 12,
      lineHeight: 1.65,
      color: secondaryText,
      marginTop: 8,
    };

    const inputBase: CSSProperties = {
      width: "100%",
      minHeight: 54,
      borderRadius: 18,
      border: `1px solid rgba(16, 25, 35, 0.12)`,
      background: inputBackground,
      color: primaryText,
      fontSize: 15,
      outline: "none",
      padding: "0 16px",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
      boxSizing: "border-box",
    };

    return {
      page: {
        minHeight: "100vh",
        background: pageBackground,
      } satisfies CSSProperties,
      wrapper: {
        width: "100%",
        maxWidth: 1320,
        margin: "0 auto",
        padding: "22px 16px 48px",
      } satisfies CSSProperties,
      intro: {
        ...sectionCard,
        display: "grid",
        gap: 18,
        marginBottom: 18,
      } satisfies CSSProperties,
      badge: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        width: "fit-content",
        padding: "8px 14px",
        borderRadius: 999,
        background: "rgba(41, 204, 95, 0.10)",
        color: "#11853c",
        fontSize: 13,
        fontWeight: 800,
      } satisfies CSSProperties,
      title: {
        margin: 0,
        color: primaryText,
        fontSize: "clamp(30px, 4.2vw, 52px)",
        lineHeight: 1.05,
        letterSpacing: "-0.04em",
        fontWeight: 800,
      } satisfies CSSProperties,
      subtitle: {
        margin: 0,
        color: secondaryText,
        fontSize: "clamp(14px, 1.7vw, 18px)",
        lineHeight: 1.9,
        maxWidth: 980,
      } satisfies CSSProperties,
      layout: {
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.45fr) minmax(320px, 0.85fr)",
        gap: 18,
        alignItems: "start",
      } satisfies CSSProperties,
      leftColumn: {
        display: "grid",
        gap: 18,
      } satisfies CSSProperties,
      sectionCard,
      sectionHeader: {
        display: "grid",
        gap: 4,
        marginBottom: 16,
      } satisfies CSSProperties,
      sectionTitle: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: 0,
        fontSize: 20,
        lineHeight: 1.2,
        color: primaryText,
        fontWeight: 800,
        letterSpacing: "-0.03em",
      } satisfies CSSProperties,
      sectionDescription: {
        margin: 0,
        color: secondaryText,
        fontSize: 13,
        lineHeight: 1.7,
      } satisfies CSSProperties,
      fieldGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 14,
      } satisfies CSSProperties,
      fieldFull: {
        gridColumn: "1 / -1",
      } satisfies CSSProperties,
      fieldLabel,
      fieldHint,
      inputBase,
      textarea: {
        ...inputBase,
        minHeight: 140,
        resize: "vertical",
        padding: 16,
      } satisfies CSSProperties,
      topInfoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 14,
      } satisfies CSSProperties,
      calendarShell: {
        border: "1px solid rgba(16, 25, 35, 0.08)",
        borderRadius: 24,
        background: "#fffdf8",
        padding: 16,
        display: "grid",
        gap: 16,
      } satisfies CSSProperties,
      calendarHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      } satisfies CSSProperties,
      calendarNavButton: {
        width: 42,
        height: 42,
        borderRadius: 14,
        border: "1px solid rgba(16, 25, 35, 0.10)",
        background: "#ffffff",
        color: primaryText,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
      } satisfies CSSProperties,
      calendarMonthLabel: {
        fontSize: 18,
        fontWeight: 800,
        color: primaryText,
        textAlign: "center",
        flex: 1,
      } satisfies CSSProperties,      weekdaysRow: {
        display: "grid",
        gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
        gap: 8,
      } satisfies CSSProperties,
      weekdayCell: {
        textAlign: "center",
        fontSize: 12,
        fontWeight: 800,
        color: secondaryText,
        padding: "4px 0",
      } satisfies CSSProperties,
      daysGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
        gap: 8,
      } satisfies CSSProperties,
      dayButton: {
        minHeight: 88,
        borderRadius: 18,
        border: "1px solid rgba(16, 25, 35, 0.08)",
        background: "#ffffff",
        color: primaryText,
        padding: "10px 8px",
        cursor: "pointer",
        display: "grid",
        alignContent: "space-between",
        justifyItems: "center",
        gap: 8,
        transition: "all 0.2s ease",
      } satisfies CSSProperties,
      dayButtonMuted: {
        opacity: 0.42,
      } satisfies CSSProperties,
      dayButtonClosed: {
        background: closedRedSoft,
        border: "1px solid rgba(215, 76, 76, 0.22)",
        color: closedRed,
        cursor: "not-allowed",
      } satisfies CSSProperties,
      dayButtonSelected: {
        background: "rgba(41, 204, 95, 0.11)",
        border: "1px solid rgba(41, 204, 95, 0.35)",
        color: "#11853c",
        boxShadow: "0 10px 24px rgba(41, 204, 95, 0.10)",
      } satisfies CSSProperties,
      dayNumber: {
        fontSize: 18,
        fontWeight: 800,
        lineHeight: 1,
      } satisfies CSSProperties,
      dayMeta: {
        fontSize: 11,
        fontWeight: 700,
        lineHeight: 1.2,
        textAlign: "center",
      } satisfies CSSProperties,
      calendarFooter: {
        display: "grid",
        gap: 12,
      } satisfies CSSProperties,
      calendarHintBox: {
        borderRadius: 18,
        padding: "12px 14px",
        background: "rgba(41, 204, 95, 0.07)",
        border: "1px solid rgba(41, 204, 95, 0.16)",
        color: secondaryText,
        fontSize: 13,
        lineHeight: 1.8,
      } satisfies CSSProperties,
      selectedDaysList: {
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 10,
      } satisfies CSSProperties,
      selectedDayCard: {
        background: "#fffdf8",
        border: "1px solid rgba(16, 25, 35, 0.08)",
        borderRadius: 18,
        padding: "12px",
        display: "grid",
        gap: 6,
      } satisfies CSSProperties,
      selectedDayIndex: {
        fontSize: 11,
        fontWeight: 800,
        color: secondaryText,
      } satisfies CSSProperties,
      selectedDayText: {
        fontSize: 14,
        fontWeight: 700,
        color: primaryText,
        lineHeight: 1.6,
      } satisfies CSSProperties,
      selectedDayPlaceholder: {
        fontSize: 14,
        fontWeight: 700,
        color: "#9aa6b2",
      } satisfies CSSProperties,
      modesGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 12,
        marginTop: 6,
      } satisfies CSSProperties,
      modeCard: {
        position: "relative",
        display: "grid",
        gap: 10,
        padding: "16px",
        borderRadius: 22,
        border: "1px solid rgba(16, 25, 35, 0.10)",
        background: "#fffdf8",
        cursor: "pointer",
      } satisfies CSSProperties,
      modeCardActive: {
        border: "1px solid rgba(41, 204, 95, 0.36)",
        background: "rgba(41, 204, 95, 0.08)",
      } satisfies CSSProperties,
      modeInput: {
        position: "absolute",
        opacity: 0,
      } satisfies CSSProperties,
      modeIconWrap: {
        width: 46,
        height: 46,
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(41, 204, 95, 0.12)",
        color: "#11853c",
      } satisfies CSSProperties,
      modeTitleText: {
        fontSize: 15,
        fontWeight: 800,
        color: primaryText,
      } satisfies CSSProperties,
      modeDescription: {
        fontSize: 12,
        color: secondaryText,
      } satisfies CSSProperties,
      highlightBox: {
        marginTop: 14,
        borderRadius: 20,
        padding: 14,
        border: "1px solid rgba(41, 204, 95, 0.18)",
        background:
          "linear-gradient(180deg, rgba(41, 204, 95, 0.08), rgba(41, 204, 95, 0.03))",
      } satisfies CSSProperties,
      highlightTitle: {
        fontSize: 14,
        fontWeight: 800,
        color: primaryText,
      } satisfies CSSProperties,
      highlightText: {
        fontSize: 13,
        color: secondaryText,
      } satisfies CSSProperties,
      conditionalHintBox: {
        marginTop: 14,
        borderRadius: 18,
        padding: 12,
        background: "#fffdf8",
        border: "1px dashed rgba(16, 25, 35, 0.12)",
        color: secondaryText,
        fontSize: 13,
      } satisfies CSSProperties,
      checkboxWrap: {
        display: "flex",
        gap: 12,
        padding: "14px 0",
        borderTop: "1px dashed rgba(16, 25, 35, 0.10)",
      } satisfies CSSProperties,
      checkbox: {
        width: 18,
        height: 18,
        accentColor: accentGreen,
      } satisfies CSSProperties,
      checkboxLabel: {
        fontSize: 14,
        color: primaryText,
      } satisfies CSSProperties,
      miniLegal: {
        marginTop: 8,
        fontSize: 11,
        color: secondaryText,
      } satisfies CSSProperties,
      sidebar: {
        ...sectionCard,
        position: "sticky",
        top: 18,
        display: "grid",
        gap: 16,
      } satisfies CSSProperties,
      summaryList: {
        display: "grid",
        gap: 12,
      } satisfies CSSProperties,
      summaryRow: {
        padding: 12,
        borderRadius: 18,
        background: "#fffdf8",
        border: "1px solid rgba(16, 25, 35, 0.08)",
      } satisfies CSSProperties,
      summaryLabel: {
        fontSize: 12,
        color: secondaryText,
      } satisfies CSSProperties,
      summaryValue: {
        fontSize: 15,
        fontWeight: 700,
        color: primaryText,
      } satisfies CSSProperties,
      summaryBulletList: {
        display: "grid",
        gap: 10,
      } satisfies CSSProperties,
      summaryBullet: {
        display: "flex",
        gap: 10,
        fontSize: 14,
        color: primaryText,
      } satisfies CSSProperties,
      actions: {
        display: "grid",
        gap: 10,
      } satisfies CSSProperties,
      primaryButton: {
        minHeight: 54,
        borderRadius: 999,
        background: accentGreen,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        cursor: "pointer",
      } satisfies CSSProperties,
      secondaryButton: {
        minHeight: 54,
        borderRadius: 999,
        border: "1px solid rgba(16, 25, 35, 0.10)",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      } satisfies CSSProperties,
      helperText: {
        fontSize: 12,
        color: secondaryText,
      } satisfies CSSProperties,
      errorBox: {
        marginTop: 12,
        padding: 12,
        borderRadius: 18,
        background: "rgba(190,55,55,0.06)",
        color: "#8e2b2b",
      } satisfies CSSProperties,
      successBox: {
        marginTop: 12,
        padding: 14,
        borderRadius: 20,
        background: "rgba(41,204,95,0.08)",
        color: "#146d34",
      } satisfies CSSProperties,
      successTitle: {
        fontWeight: 800,
      } satisfies CSSProperties,
      successText: {
        fontSize: 13,
      } satisfies CSSProperties,
      footerLinks: {
        display: "flex",
        gap: 10,
      } satisfies CSSProperties,
      footerLink: {
        fontSize: 13,
        fontWeight: 700,
        textDecoration: "none",
        color: primaryText,
      } satisfies CSSProperties,
      requiredMark: {
        color: "#1fa64f",
      } satisfies CSSProperties,
    };
  }, []);

  const arrowIcon = isArabic ? <ArrowLeft size={18} /> : <ArrowRight size={18} />;

  const appointmentModes = [
    { value: "at_store", icon: <Store size={20} /> },
    { value: "we_come_free", icon: <MapPinned size={20} /> },
    { value: "phone_call", icon: <PhoneCall size={20} /> },
  ];  return (
    <div style={styles.page} dir={direction}>
      <Header />

      <main style={styles.wrapper}>
        <section style={styles.intro}>
          <span style={styles.badge}>
            <CalendarDays size={16} />
            {bookingText.badge[currentLanguage]}
          </span>

          <h1 style={styles.title}>{bookingText.title[currentLanguage]}</h1>
          <p style={styles.subtitle}>{bookingText.subtitle[currentLanguage]}</p>
        </section>

        <div style={styles.layout}>
          <div style={styles.leftColumn}>
            <form onSubmit={handleSubmit} noValidate>
              <section style={styles.sectionCard}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>
                    <BriefcaseBusiness size={20} />
                    {bookingText.detailsTitle[currentLanguage]}
                  </h2>
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
                      {bookingText.appointmentWindow[currentLanguage]}
                    </label>
                    <div
                      style={{
                        ...styles.inputBase,
                        display: "flex",
                        alignItems: "center",
                        color: secondaryText,
                        fontWeight: 700,
                      }}
                    >
                      <Clock3 size={18} style={{ marginInlineEnd: 8 }} />
                      11:00 – 15:00
                    </div>
                  </div>
                </div>
              </section>

              <section style={{ ...styles.sectionCard, marginTop: 18 }}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>
                    <CalendarDays size={20} />
                    {bookingText.calendarTitle[currentLanguage]}
                  </h2>
                  <p style={styles.sectionDescription}>
                    {bookingText.calendarSubtitle[currentLanguage]}
                  </p>
                </div>

                <div style={styles.calendarShell}>
                  <div style={styles.calendarHeader}>
                    <button
                      type="button"
                      onClick={goToPreviousMonth}
                      style={styles.calendarNavButton}
                    >
                      {isArabic ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>

                    <div style={styles.calendarMonthLabel}>{monthLabel}</div>

                    <button
                      type="button"
                      onClick={goToNextMonth}
                      style={styles.calendarNavButton}
                    >
                      {isArabic ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                    </button>
                  </div>

                  <div style={styles.weekdaysRow}>
                    {bookingText.weekdaysShort[currentLanguage].map((label) => (
                      <div key={label} style={styles.weekdayCell}>
                        {label}
                      </div>
                    ))}
                  </div>

                  <div style={styles.daysGrid}>
                    {calendarDays.map((day) => {
                      const isOpenBusinessDay =
                        day.isCurrentMonth &&
                        !day.isClosed &&
                        isAllowedBusinessDay(day.date);

                      return (
                        <button
                          key={day.key}
                          type="button"
                          onClick={() => handleDaySelection(day)}
                          style={{
                            ...styles.dayButton,
                            ...(!day.isCurrentMonth ? styles.dayButtonMuted : {}),
                            ...(day.isClosed ? styles.dayButtonClosed : {}),
                            ...(day.isSelected ? styles.dayButtonSelected : {}),
                          }}
                          disabled={day.isClosed || !day.isCurrentMonth}
                          aria-pressed={day.isSelected}
                        >
                          <span style={styles.dayNumber}>{day.dayNumber}</span>

                          <span style={styles.dayMeta}>
                            {day.isSelected ? (
                              <>
                                <Check size={13} style={{ marginBottom: 2 }} />
                                <br />
                                {bookingText.selectedLabel[currentLanguage]}
                              </>
                            ) : day.isClosed ? (
                              bookingText.closedLabel[currentLanguage]
                            ) : isOpenBusinessDay ? (
                              bookingText.openLabel[currentLanguage]
                            ) : (
                              "—"
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div style={styles.calendarFooter}>
                    <div style={styles.calendarHintBox}>
                      {bookingText.calendarHint[currentLanguage]}
                    </div>

                    <div>
                      <div style={{ ...styles.fieldLabel, marginBottom: 10 }}>
                        {bookingText.selectedDaysTitle[currentLanguage]}{" "}
                        <span style={styles.requiredMark}>*</span>
                      </div>

                      <div style={styles.selectedDaysList}>
                        {[0, 1, 2].map((index) => {
                          const value = selectedDaysFormatted[index];

                          return (
                            <div key={index} style={styles.selectedDayCard}>
                              <span style={styles.selectedDayIndex}>{index + 1}</span>
                              <span
                                style={
                                  value
                                    ? styles.selectedDayText
                                    : styles.selectedDayPlaceholder
                                }
                              >
                                {value || "—"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section style={{ ...styles.sectionCard, marginTop: 18 }}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>
                    <Clock3 size={20} />
                    {bookingText.modeTitle[currentLanguage]}
                  </h2>
                  <p style={styles.sectionDescription}>
                    {bookingText.fieldDescriptions.mode[currentLanguage]}
                  </p>
                </div>

                <div style={styles.modesGrid}>
                  {appointmentModes.map((modeItem) => {
                    const isActive = formData.mode === modeItem.value;

                    return (
                      <label
                        key={modeItem.value}
                        style={{
                          ...styles.modeCard,
                          ...(isActive ? styles.modeCardActive : {}),
                        }}
                      >
                        <input
                          type="radio"
                          name="mode"
                          value={modeItem.value}
                          checked={formData.mode === modeItem.value}
                          onChange={handleInputChange}
                          style={styles.modeInput}
                        />

                        <span style={styles.modeIconWrap}>{modeItem.icon}</span>

                        <span style={styles.modeTitleText}>
                          {
                            bookingText.modeOptions[
                              modeItem.value as AppointmentMode
                            ][currentLanguage]
                          }
                        </span>

                        <span style={styles.modeDescription}>
                          {
                            bookingText.modeDescriptions[
                              modeItem.value as AppointmentMode
                            ][currentLanguage]
                          }
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div style={styles.highlightBox}>
                  <div style={styles.highlightTitle}>
                    <Sparkles size={16} style={{ marginInlineEnd: 8 }} />
                    {bookingText.benefitTitle[currentLanguage]}
                  </div>
                  <div style={styles.highlightText}>
                    {bookingText.benefitSubtitle[currentLanguage]}
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

              <section style={{ ...styles.sectionCard, marginTop: 18 }}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>
                    <UserRound size={20} />
                    {bookingText.customerTitle[currentLanguage]}
                  </h2>
                  <p style={styles.sectionDescription}>
                    {bookingText.fieldDescriptions.customer[currentLanguage]}
                  </p>
                </div>

                <div style={styles.fieldGrid}>
                  <div style={styles.fieldFull}>
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

                <div style={styles.conditionalHintBox}>
                  {bookingText.addressHint[currentLanguage]}
                </div>
              </section>

              <section style={{ ...styles.sectionCard, marginTop: 18 }}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>
                    <ShieldCheck size={20} />
                    {bookingText.consentTitle[currentLanguage]}
                  </h2>
                  <p style={styles.sectionDescription}>
                    {bookingText.requiredHint[currentLanguage]}
                  </p>
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
                      <CheckCircle2 size={16} style={{ marginInlineEnd: 8 }} />
                      {bookingText.successTitle[currentLanguage]}
                    </div>
                    <div style={styles.successText}>
                      {bookingText.successText[currentLanguage]}
                    </div>
                  </div>
                ) : null}
              </section>
            </form>
          </div>

          <aside style={styles.sidebar}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                <BriefcaseBusiness size={20} />
                {bookingText.summaryTitle[currentLanguage]}
              </h2>
              <p style={styles.sectionDescription}>
                {bookingText.summarySubtitle[currentLanguage]}
              </p>
            </div>

            <div style={styles.summaryList}>
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
                  {bookingText.reviewDays[currentLanguage]}
                </span>
                <div style={styles.summaryValue}>
                  {selectedDaysFormatted.length > 0
                    ? selectedDaysFormatted.join(" / ")
                    : "—"}
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

              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>
                  {bookingText.appointmentWindow[currentLanguage]}
                </span>
                <div style={styles.summaryValue}>11:00 – 15:00</div>
              </div>
            </div>

            <div style={styles.summaryBulletList}>
              <div style={styles.summaryBullet}>
                <CheckCircle2 size={16} style={{ marginTop: 4, flexShrink: 0 }} />
                <span>{bookingText.benefitSubtitle[currentLanguage]}</span>
              </div>
              <div style={styles.summaryBullet}>
                <CheckCircle2 size={16} style={{ marginTop: 4, flexShrink: 0 }} />
                <span>{bookingText.submitHint[currentLanguage]}</span>
              </div>
            </div>

            <div style={styles.actions}>
              <button
                type="button"
                onClick={() =>
                  handleSubmit({
                    preventDefault: () => undefined,
                  } as FormEvent<HTMLFormElement>)
                }
                style={{
                  ...styles.primaryButton,
                  opacity: isSubmitting ? 0.8 : 1,
                  background: isSubmitting ? "#7dcf96" : accentGreen,
                }}
                disabled={isSubmitting}
                onMouseEnter={(event) => {
                  if (!isSubmitting) {
                    event.currentTarget.style.background = accentGreenHover;
                    event.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.background = isSubmitting
                    ? "#7dcf96"
                    : accentGreen;
                  event.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Send size={18} />
                {bookingText.submit[currentLanguage]}
                {arrowIcon}
              </button>

              <Link href="/cart" style={styles.secondaryButton}>
                <ShoppingCart size={18} />
                {bookingText.toCart[currentLanguage]}
              </Link>
            </div>

            <div style={styles.helperText}>
              {bookingText.submitHint[currentLanguage]}
            </div>

            <div style={styles.footerLinks}>
              <Link href="/" style={styles.footerLink}>
                {bookingText.backHome[currentLanguage]}
              </Link>
              <span style={styles.helperText}>•</span>
              <Link href="/cart" style={styles.footerLink}>
                {bookingText.toCart[currentLanguage]}
              </Link>
            </div>
          </aside>
        </div>

        <style jsx>{`
          @media (max-width: 1100px) {
            main {
              width: 100%;
            }
          }

          @media (max-width: 980px) {
            div[dir] main > div {
              grid-template-columns: minmax(0, 1fr) !important;
            }

            div[dir] aside {
              position: static !important;
            }
          }

          @media (max-width: 820px) {
            div[dir] select,
            div[dir] input,
            div[dir] textarea {
              font-size: 16px !important;
            }
          }

          @media (max-width: 760px) {
            div[dir] main section,
            div[dir] aside {
              border-radius: 22px !important;
            }

            div[dir] main > div > div,
            div[dir] main > div > aside {
              width: 100%;
              min-width: 0;
            }

            div[dir] [style*="grid-template-columns: repeat(3, minmax(0, 1fr))"] {
              grid-template-columns: minmax(0, 1fr) !important;
            }
          }

          @media (max-width: 680px) {
            div[dir] [style*="grid-template-columns: repeat(2, minmax(0, 1fr))"] {
              grid-template-columns: minmax(0, 1fr) !important;
            }

            div[dir] [style*="grid-template-columns: repeat(7, minmax(0, 1fr))"] {
              gap: 6px !important;
            }

            div[dir] button[aria-pressed] {
              min-height: 74px !important;
              border-radius: 16px !important;
              padding: 8px 6px !important;
            }
          }

          @media (max-width: 520px) {
            div[dir] [style*="grid-template-columns: repeat(7, minmax(0, 1fr))"] {
              gap: 4px !important;
            }

            div[dir] button[aria-pressed] {
              min-height: 68px !important;
              padding: 7px 4px !important;
            }
          }
        `}</style>
      </main>
    </div>
  );
}