import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import {
  isAdminAuthenticated,
  clearAdminSession,
} from "@/lib/admin-auth";

type RequestLanguage = "ar" | "de" | "en";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type RequestCustomer = {
  requestId?: string;
  requestLanguage?: RequestLanguage;
  fullName?: string;
  email?: string;
  phone?: string;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  subject?: string;
  message?: string;
};

type LegacyRequestCustomer = {
  requestId?: string;
  requestLanguage?: RequestLanguage | string;
  fullName?: string;
  email?: string;
  phone?: string;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  subject?: string;
  message?: string;
};

type RequestStatus = "new" | "in_progress" | "done";
type AppointmentStatus =
  | "new"
  | "confirmed"
  | "in_progress"
  | "done"
  | "cancelled"
  | "rejected";
type AdminEntryStatus = RequestStatus | AppointmentStatus;
type AppointmentType = "consultation" | "design" | "visit" | "installation";
type AppointmentMode = "at_store" | "we_come_free" | "phone_call";
type AdminEntrySource = "request" | "appointment";
type BookingSlotStatus = "available" | "booked" | "blocked";

type RequestRow = {
  id: string;
  status: RequestStatus;
  channel: string;
  created_at?: string;
  customer?: RequestCustomer;
};

type RawRequestRow = {
  id?: string;
  status?: string;
  channel?: string;
  created_at?: string;
  customer?: LegacyRequestCustomer | null;
  customerData?: LegacyRequestCustomer | null;
  fullName?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  street?: string | null;
  houseNumber?: string | null;
  house_number?: string | null;
  postalCode?: string | null;
  postal_code?: string | null;
  city?: string | null;
  subject?: string | null;
  message?: string | null;
  requestId?: string | null;
  request_id?: string | null;
  requestLanguage?: string | null;
  request_language?: string | null;
};

type AppointmentCustomer = {
  requestLanguage?: RequestLanguage;
  fullName?: string;
  email?: string;
  phone?: string;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  subject?: string;
  message?: string;
};

type AppointmentRow = {
  id: string;
  status: AppointmentStatus;
  channel: string;
  created_at?: string;
  date?: string;
  time?: string;
  type?: AppointmentType;
  mode?: AppointmentMode;
  customer?: AppointmentCustomer;
};

type RawAppointmentRow = {
  id?: string;
  status?: string;
  created_at?: string;
  date?: string | null;
  time?: string | null;
  type?: string | null;
  mode?: string | null;
  fullName?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  street?: string | null;
  houseNumber?: string | null;
  house_number?: string | null;
  postalCode?: string | null;
  postal_code?: string | null;
  city?: string | null;
  notes?: string | null;
  language?: string | null;
};

type AdminEntry = {
  id: string;
  source: AdminEntrySource;
  status: AdminEntryStatus;
  channel: string;
  created_at?: string;
  customer: RequestCustomer;
  appointment?: {
    date?: string;
    time?: string;
    type?: AppointmentType;
    mode?: AppointmentMode;
  };
};

type AvailableBookingDay = {
  id: string;
  date: string;
  note?: string;
  created_at?: string;
};

type RawAvailableBookingDay = {
  id?: string;
  date?: string | null;
  note?: string | null;
  created_at?: string | null;
};

type BookingSlot = {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: BookingSlotStatus;
  note?: string;
  created_at?: string;
};

type RawBookingSlot = {
  id?: string;
  booking_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  status?: string | null;
  note?: string | null;
  created_at?: string | null;
};

const AVAILABLE_DAYS_TABLE = "booking_available_days";
const BOOKING_SLOTS_TABLE = "booking_slots";

const adminText = {
  badge: {
    ar: "لوحة التحكم",
    de: "Admin-Bereich",
    en: "Admin Panel",
  },
  title: {
    ar: "إدارة الطلبات والمواعيد",
    de: "Anfragen und Termine verwalten",
    en: "Manage Requests and Appointments",
  },
  subtitle: {
    ar: "إدارة كاملة للطلبات والمواعيد القادمة من الموقع، مع التحكم بحالة كل عنصر وإرسال تعليق للعميل، وإدارة الأيام المتاحة للحجز من نفس اللوحة.",
    de: "Vollständige Verwaltung eingehender Website-Anfragen und Termine mit Statussteuerung, Kundenkommentar und Verwaltung verfügbarer Buchungstage aus derselben Übersicht.",
    en: "Complete management of incoming website requests and appointments, including status control, customer comments, and managing available booking days from the same dashboard.",
  },
  totalCount: {
    ar: "عدد العناصر",
    de: "Anzahl der Einträge",
    en: "Number of entries",
  },
  empty: {
    ar: "لا توجد طلبات أو مواعيد محفوظة حاليًا.",
    de: "Aktuell sind keine gespeicherten Anfragen oder Termine vorhanden.",
    en: "There are currently no saved requests or appointments.",
  },
  itemType: {
    ar: "النوع",
    de: "Typ",
    en: "Type",
  },
  requestTypeLabel: {
    ar: "طلب",
    de: "Anfrage",
    en: "Request",
  },
  appointmentTypeLabel: {
    ar: "موعد",
    de: "Termin",
    en: "Appointment",
  },
  requestNumber: {
    ar: "رقم الطلب",
    de: "Anfragenummer",
    en: "Request ID",
  },
  appointmentNumber: {
    ar: "رقم الموعد",
    de: "Terminnummer",
    en: "Appointment ID",
  },
  receivedAt: {
    ar: "وقت الوصول",
    de: "Eingegangen am",
    en: "Received at",
  },
  currentStatus: {
    ar: "الحالة الحالية",
    de: "Aktueller Status",
    en: "Current status",
  },
  contactData: {
    ar: "بيانات التواصل",
    de: "Kontaktdaten",
    en: "Contact details",
  },
  email: {
    ar: "الإيميل",
    de: "E-Mail",
    en: "Email",
  },
  phone: {
    ar: "الهاتف",
    de: "Telefon",
    en: "Phone",
  },
  address: {
    ar: "العنوان",
    de: "Adresse",
    en: "Address",
  },
  street: {
    ar: "الشارع",
    de: "Straße",
    en: "Street",
  },
  houseNumber: {
    ar: "رقم المنزل / الشقة",
    de: "Hausnummer / Wohnung",
    en: "House number / apartment",
  },
  postalCode: {
    ar: "الرمز البريدي",
    de: "Postleitzahl",
    en: "Postal code",
  },
  city: {
    ar: "المدينة",
    de: "Stadt",
    en: "City",
  },
  additionalInfo: {
    ar: "معلومات إضافية",
    de: "Weitere Informationen",
    en: "Additional information",
  },
  channel: {
    ar: "القناة",
    de: "Kanal",
    en: "Channel",
  },
  subject: {
    ar: "الموضوع",
    de: "Betreff",
    en: "Subject",
  },
  date: {
    ar: "التاريخ",
    de: "Datum",
    en: "Date",
  },
  appointmentDate: {
    ar: "تاريخ الموعد",
    de: "Termindatum",
    en: "Appointment date",
  },
  appointmentTime: {
    ar: "وقت الموعد",
    de: "Terminzeit",
    en: "Appointment time",
  },
  appointmentService: {
    ar: "خدمة الموعد",
    de: "Terminservice",
    en: "Appointment service",
  },
  appointmentMode: {
    ar: "طريقة الموعد",
    de: "Terminweg",
    en: "Appointment mode",
  },
  message: {
    ar: "الرسالة",
    de: "Nachricht",
    en: "Message",
  },
  updateStatus: {
    ar: "تحديث الحالة",
    de: "Status aktualisieren",
    en: "Update status",
  },
  adminComment: {
    ar: "تعليق للإرسال للزبون",
    de: "Kommentar für den Kunden",
    en: "Comment for the customer",
  },
  adminCommentPlaceholder: {
    ar: "مثال: تم تأكيد الموعد مبدئيًا، وسنرسل لك الوقت النهائي قريبًا.",
    de: "Beispiel: Der Termin wurde vorläufig bestätigt, die genaue Uhrzeit senden wir Ihnen bald.",
    en: "Example: The appointment has been preliminarily confirmed, and we will send you the final time soon.",
  },
  sendCommentHint: {
    ar: "سيتم إرسال هذا التعليق إلى الزبون ضمن رسالة تحديث الحالة إذا كان البريد الإلكتروني متوفرًا.",
    de: "Dieser Kommentar wird zusammen mit der Statusaktualisierung an den Kunden gesendet, sofern eine E-Mail-Adresse vorhanden ist.",
    en: "This comment will be sent to the customer with the status update if an email address is available.",
  },
  deleteRequest: {
    ar: "حذف العنصر",
    de: "Eintrag löschen",
    en: "Delete entry",
  },
  deleteWarning: {
    ar: "تنبيه: الحذف هنا نهائي من قاعدة البيانات.",
    de: "Hinweis: Das Löschen ist hier endgültig aus der Datenbank.",
    en: "Warning: Deletion here is permanent from the database.",
  },
  unnamed: {
    ar: "بدون اسم",
    de: "Ohne Namen",
    en: "No name",
  },
  dash: {
    ar: "—",
    de: "—",
    en: "—",
  },
  languageAr: {
    ar: "العربية",
    de: "Arabisch",
    en: "Arabic",
  },
  languageDe: {
    ar: "Deutsch",
    de: "Deutsch",
    en: "German",
  },
  languageEn: {
    ar: "English",
    de: "English",
    en: "English",
  },
  logout: {
    ar: "تسجيل الخروج",
    de: "Abmelden",
    en: "Logout",
  },
  availableDaysTitle: {
    ar: "إدارة الأيام المتاحة للحجز",
    de: "Verfügbare Buchungstage verwalten",
    en: "Manage available booking days",
  },
  availableDaysSubtitle: {
    ar: "الأيام الموجودة هنا هي فقط التي ستظهر للعميل في صفحة الحجز. أضف يومًا جديدًا أو احذف يومًا غير متاح.",
    de: "Nur die hier vorhandenen Tage erscheinen für den Kunden auf der Buchungsseite. Füge einen neuen Tag hinzu oder entferne einen nicht mehr verfügbaren Tag.",
    en: "Only the days listed here will appear to the customer on the booking page. Add a new day or remove an unavailable one.",
  },
  availableDaysCount: {
    ar: "عدد الأيام المتاحة",
    de: "Anzahl verfügbarer Tage",
    en: "Available days count",
  },
  availableDaysEmpty: {
    ar: "لا توجد أيام متاحة محفوظة حاليًا.",
    de: "Derzeit sind keine verfügbaren Tage gespeichert.",
    en: "There are currently no saved available days.",
  },
  availableDay: {
    ar: "اليوم المتاح",
    de: "Verfügbarer Tag",
    en: "Available day",
  },
  availableDayNote: {
    ar: "ملاحظة داخلية",
    de: "Interne Notiz",
    en: "Internal note",
  },
  addAvailableDay: {
    ar: "إضافة يوم متاح",
    de: "Verfügbaren Tag hinzufügen",
    en: "Add available day",
  },
  removeAvailableDay: {
    ar: "حذف اليوم",
    de: "Tag löschen",
    en: "Remove day",
  },
  availableDayPlaceholder: {
    ar: "مثال: صباحي / مناسب للزيارات الخارجية",
    de: "Beispiel: Vormittag / geeignet für Außentermine",
    en: "Example: Morning / suitable for on-site visits",
  },
  availableDaysSchemaHint: {
    ar: "هذه اللوحة تعتمد على جدول قاعدة البيانات booking_available_days بالأعمدة: id, date, note, created_at.",
    de: "Dieser Bereich verwendet die Datenbanktabelle booking_available_days mit den Spalten: id, date, note, created_at.",
    en: "This section uses the database table booking_available_days with the columns: id, date, note, created_at.",
  },
  availableDaysUnavailable: {
    ar: "تعذر تحميل قسم الأيام المتاحة. تحقق من وجود الجدول booking_available_days في قاعدة البيانات.",
    de: "Der Bereich für verfügbare Tage konnte nicht geladen werden. Prüfe, ob die Tabelle booking_available_days in der Datenbank vorhanden ist.",
    en: "The available days section could not be loaded. Check that the table booking_available_days exists in the database.",
  },
  appointmentsUnavailable: {
    ar: "جدول appointments غير موجود حاليًا في قاعدة البيانات، لذلك تم إخفاء قسم المواعيد مؤقتًا مع بقاء قسم الطلبات والأيام المتاحة يعملان.",
    de: "Die Tabelle appointments ist derzeit nicht in der Datenbank vorhanden. Daher wird der Terminbereich vorübergehend ausgeblendet, während Anfragen und verfügbare Tage weiterhin funktionieren.",
    en: "The appointments table is currently missing in the database, so the appointments section is temporarily hidden while requests and available days continue to work.",
  },
  slotsTitle: {
    ar: "إدارة الأوقات المتاحة للحجز",
    de: "Verfügbare Buchungszeiten verwalten",
    en: "Manage available booking slots",
  },
  slotsSubtitle: {
    ar: "أضف الفترات الزمنية لكل يوم متاح، وحدد حالتها: متاح أو محجوز أو مغلق. هذه الفترات هي التي يراها العميل عند اختيار اليوم.",
    de: "Füge Zeitfenster für jeden verfügbaren Tag hinzu und lege ihren Status fest: verfügbar, gebucht oder gesperrt. Diese Zeitfenster sieht der Kunde nach Auswahl des Tages.",
    en: "Add time slots for each available day and define their status: available, booked, or blocked. These are the slots customers will see after selecting a day.",
  },
  slotsCount: {
    ar: "عدد الفترات",
    de: "Anzahl der Zeitfenster",
    en: "Slots count",
  },
  slotsForDate: {
    ar: "اليوم المحدد للفترات",
    de: "Gewählter Tag für Zeitfenster",
    en: "Selected day for slots",
  },
  selectDayForSlots: {
    ar: "اختر يومًا محفوظًا أولًا",
    de: "Wähle zuerst einen gespeicherten Tag",
    en: "Choose a saved day first",
  },
  slotStartTime: {
    ar: "من",
    de: "Von",
    en: "From",
  },
  slotEndTime: {
    ar: "إلى",
    de: "Bis",
    en: "To",
  },
  slotStatus: {
    ar: "الحالة",
    de: "Status",
    en: "Status",
  },
  slotNote: {
    ar: "ملاحظة الفترة",
    de: "Notiz zum Zeitfenster",
    en: "Slot note",
  },
  slotNotePlaceholder: {
    ar: "مثال: مناسب للاستشارة السريعة",
    de: "Beispiel: Geeignet für kurze Beratung",
    en: "Example: Suitable for quick consultation",
  },
  addSlot: {
    ar: "إضافة فترة",
    de: "Zeitfenster hinzufügen",
    en: "Add slot",
  },
  slotsEmpty: {
    ar: "لا توجد فترات زمنية لهذا اليوم حاليًا.",
    de: "Für diesen Tag sind derzeit keine Zeitfenster vorhanden.",
    en: "There are currently no time slots for this day.",
  },
  slotsUnavailable: {
    ar: "تعذر تحميل قسم الأوقات. تحقق من وجود الجدول booking_slots في قاعدة البيانات.",
    de: "Der Bereich für Zeitfenster konnte nicht geladen werden. Prüfe, ob die Tabelle booking_slots in der Datenbank vorhanden ist.",
    en: "The slots section could not be loaded. Check that the table booking_slots exists in the database.",
  },
  slotsSchemaHint: {
    ar: "هذا القسم يعتمد على جدول booking_slots بالأعمدة: id, booking_date, start_time, end_time, status, note, created_at.",
    de: "Dieser Bereich verwendet die Tabelle booking_slots mit den Spalten: id, booking_date, start_time, end_time, status, note, created_at.",
    en: "This section uses the booking_slots table with the columns: id, booking_date, start_time, end_time, status, note, created_at.",
  },
  slotRemove: {
    ar: "حذف الفترة",
    de: "Zeitfenster löschen",
    en: "Remove slot",
  },
  slotUpdate: {
    ar: "تحديث الفترة",
    de: "Zeitfenster aktualisieren",
    en: "Update slot",
  },
  slotSavedDayMissing: {
    ar: "لا يمكنك إضافة فترات قبل إضافة يوم متاح.",
    de: "Du kannst keine Zeitfenster hinzufügen, bevor ein verfügbarer Tag vorhanden ist.",
    en: "You cannot add slots before adding an available day.",
  },
  slotStatusAvailable: {
    ar: "متاح",
    de: "Verfügbar",
    en: "Available",
  },
  slotStatusBooked: {
    ar: "محجوز",
    de: "Gebucht",
    en: "Booked",
  },
  slotStatusBlocked: {
    ar: "مغلق",
    de: "Gesperrt",
    en: "Blocked",
  },
} as const;

function normalizeLanguage(value?: string): RequestLanguage {
  if (value === "ar" || value === "de" || value === "en") {
    return value;
  }
  return "ar";
}

function normalizeRequestStatus(value?: string): RequestStatus {
  if (value === "new" || value === "in_progress" || value === "done") {
    return value;
  }
  return "new";
}

function normalizeAppointmentStatus(value?: string): AppointmentStatus {
  if (
    value === "new" ||
    value === "confirmed" ||
    value === "in_progress" ||
    value === "done" ||
    value === "cancelled" ||
    value === "rejected"
  ) {
    return value;
  }
  return "new";
}

function normalizeBookingSlotStatus(value?: string): BookingSlotStatus {
  if (value === "available" || value === "booked" || value === "blocked") {
    return value;
  }
  return "available";
}

function normalizeAdminEntryStatus(
  value: string | undefined,
  source: AdminEntrySource
): AdminEntryStatus {
  return source === "appointment"
    ? normalizeAppointmentStatus(value)
    : normalizeRequestStatus(value);
}

function normalizeAppointmentType(value?: string): AppointmentType | undefined {
  if (
    value === "consultation" ||
    value === "design" ||
    value === "visit" ||
    value === "installation"
  ) {
    return value;
  }
  return undefined;
}

function normalizeAppointmentMode(value?: string): AppointmentMode | undefined {
  if (
    value === "at_store" ||
    value === "we_come_free" ||
    value === "phone_call"
  ) {
    return value;
  }
  return undefined;
}

function getDir(lang: RequestLanguage): "rtl" | "ltr" {
  return lang === "ar" ? "rtl" : "ltr";
}

function getSafeTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeTimeInput(value: string) {
  const normalized = getSafeTrimmedString(value);

  if (!normalized) {
    return "";
  }

  if (/^\d{2}:\d{2}$/.test(normalized)) {
    return `${normalized}:00`;
  }

  return normalized;
}

function formatTimeOnly(value: string | undefined) {
  if (!value) {
    return "—";
  }

  const normalized = value.trim();

  if (/^\d{2}:\d{2}:\d{2}$/.test(normalized)) {
    return normalized.slice(0, 5);
  }

  if (/^\d{2}:\d{2}$/.test(normalized)) {
    return normalized;
  }

  return normalized;
}

function buildNormalizedCustomer(raw: RawRequestRow): RequestCustomer {
  const nestedCustomer = raw.customer || raw.customerData || {};

  const requestLanguage = normalizeLanguage(
    getSafeTrimmedString(nestedCustomer.requestLanguage) ||
      getSafeTrimmedString(raw.requestLanguage) ||
      getSafeTrimmedString(raw.request_language) ||
      "ar"
  );

  return {
    requestId:
      getSafeTrimmedString(nestedCustomer.requestId) ||
      getSafeTrimmedString(raw.requestId) ||
      getSafeTrimmedString(raw.request_id) ||
      getSafeTrimmedString(raw.id),
    requestLanguage,
    fullName:
      getSafeTrimmedString(nestedCustomer.fullName) ||
      getSafeTrimmedString(raw.fullName) ||
      getSafeTrimmedString(raw.full_name),
    email:
      getSafeTrimmedString(nestedCustomer.email) ||
      getSafeTrimmedString(raw.email),
    phone:
      getSafeTrimmedString(nestedCustomer.phone) ||
      getSafeTrimmedString(raw.phone),
    street:
      getSafeTrimmedString(nestedCustomer.street) ||
      getSafeTrimmedString(raw.street),
    houseNumber:
      getSafeTrimmedString(nestedCustomer.houseNumber) ||
      getSafeTrimmedString(raw.houseNumber) ||
      getSafeTrimmedString(raw.house_number),
    postalCode:
      getSafeTrimmedString(nestedCustomer.postalCode) ||
      getSafeTrimmedString(raw.postalCode) ||
      getSafeTrimmedString(raw.postal_code),
    city:
      getSafeTrimmedString(nestedCustomer.city) ||
      getSafeTrimmedString(raw.city),
    subject:
      getSafeTrimmedString(nestedCustomer.subject) ||
      getSafeTrimmedString(raw.subject),
    message:
      getSafeTrimmedString(nestedCustomer.message) ||
      getSafeTrimmedString(raw.message),
  };
}

function normalizeRequestRow(raw: RawRequestRow): RequestRow {
  return {
    id: getSafeTrimmedString(raw.id),
    status: normalizeRequestStatus(getSafeTrimmedString(raw.status)),
    channel: getSafeTrimmedString(raw.channel) || "website",
    created_at: getSafeTrimmedString(raw.created_at) || undefined,
    customer: buildNormalizedCustomer(raw),
  };
}

function normalizeAppointmentRow(raw: RawAppointmentRow): AppointmentRow {
  const id = getSafeTrimmedString(raw.id);

  return {
    id,
    status: normalizeAppointmentStatus(getSafeTrimmedString(raw.status)),
    channel: "booking",
    created_at: getSafeTrimmedString(raw.created_at) || undefined,
    date: getSafeTrimmedString(raw.date) || undefined,
    time: getSafeTrimmedString(raw.time) || undefined,
    type: normalizeAppointmentType(getSafeTrimmedString(raw.type)),
    mode: normalizeAppointmentMode(getSafeTrimmedString(raw.mode)),
    customer: {
      requestLanguage: normalizeLanguage(
        getSafeTrimmedString(raw.language) || "ar"
      ),
      fullName:
        getSafeTrimmedString(raw.full_name) ||
        getSafeTrimmedString(raw.fullName),
      email: getSafeTrimmedString(raw.email),
      phone: getSafeTrimmedString(raw.phone),
      street: getSafeTrimmedString(raw.street),
      houseNumber:
        getSafeTrimmedString(raw.house_number) ||
        getSafeTrimmedString(raw.houseNumber),
      postalCode:
        getSafeTrimmedString(raw.postal_code) ||
        getSafeTrimmedString(raw.postalCode),
      city: getSafeTrimmedString(raw.city),
      subject: "Booking Appointment",
      message: getSafeTrimmedString(raw.notes),
    },
  };
}

function normalizeAvailableBookingDay(
  raw: RawAvailableBookingDay
): AvailableBookingDay | null {
  const id = getSafeTrimmedString(raw.id);
  const date = getSafeTrimmedString(raw.date);

  if (!id || !date) {
    return null;
  }

  return {
    id,
    date,
    note: getSafeTrimmedString(raw.note) || undefined,
    created_at: getSafeTrimmedString(raw.created_at) || undefined,
  };
}

function normalizeBookingSlot(raw: RawBookingSlot): BookingSlot | null {
  const id = getSafeTrimmedString(raw.id);
  const bookingDate = getSafeTrimmedString(raw.booking_date);
  const startTime = normalizeTimeInput(getSafeTrimmedString(raw.start_time));
  const endTime = normalizeTimeInput(getSafeTrimmedString(raw.end_time));

  if (!id || !bookingDate || !startTime || !endTime) {
    return null;
  }

  return {
    id,
    booking_date: bookingDate,
    start_time: startTime,
    end_time: endTime,
    status: normalizeBookingSlotStatus(getSafeTrimmedString(raw.status)),
    note: getSafeTrimmedString(raw.note) || undefined,
    created_at: getSafeTrimmedString(raw.created_at) || undefined,
  };
}

function mapRequestToAdminEntry(request: RequestRow): AdminEntry {
  return {
    id: request.id,
    source: "request",
    status: request.status,
    channel: request.channel || "website",
    created_at: request.created_at,
    customer: request.customer || {},
  };
}

function mapAppointmentToAdminEntry(appointment: AppointmentRow): AdminEntry {
  return {
    id: appointment.id,
    source: "appointment",
    status: appointment.status,
    channel: appointment.channel,
    created_at: appointment.created_at,
    customer: {
      requestId: appointment.id,
      requestLanguage: appointment.customer?.requestLanguage || "ar",
      fullName: appointment.customer?.fullName,
      email: appointment.customer?.email,
      phone: appointment.customer?.phone,
      street: appointment.customer?.street,
      houseNumber: appointment.customer?.houseNumber,
      postalCode: appointment.customer?.postalCode,
      city: appointment.customer?.city,
      subject: "Booking Appointment",
      message: appointment.customer?.message,
    },
    appointment: {
      date: appointment.date,
      time: appointment.time,
      type: appointment.type,
      mode: appointment.mode,
    },
  };
}

async function supabaseTableFetch<T>(params: {
  path: string;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  prefer?: string;
}) {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase environment variables are missing");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${params.path}`, {
    method: params.method || "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      ...(params.prefer ? { Prefer: params.prefer } : {}),
    },
    body: params.body ? JSON.stringify(params.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Supabase request failed: ${response.status} ${
        errorText || "Unknown error"
      }`
    );
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

function isMissingTableError(error: unknown, tableName: string) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes("could not find the table") &&
    message.includes(tableName.toLowerCase())
  );
}

async function getRequests(): Promise<RequestRow[]> {
  const rows = await supabaseTableFetch<RawRequestRow[]>({
    path: "requests?select=*&order=created_at.desc",
  });

  return rows.map(normalizeRequestRow).filter((row) => row.id);
}

async function getAppointments(): Promise<{
  appointments: AppointmentRow[];
  tableReady: boolean;
}> {
  try {
    const rows = await supabaseTableFetch<RawAppointmentRow[]>({
      path: "appointments?select=*&order=created_at.desc",
    });

    return {
      appointments: rows.map(normalizeAppointmentRow).filter((row) => row.id),
      tableReady: true,
    };
  } catch (error) {
    if (isMissingTableError(error, "appointments")) {
      return {
        appointments: [],
        tableReady: false,
      };
    }

    throw error;
  }
}

async function getAdminEntries(): Promise<{
  entries: AdminEntry[];
  appointmentsTableReady: boolean;
}> {
  const [requests, appointmentsState] = await Promise.all([
    getRequests(),
    getAppointments(),
  ]);

  const entries = [
    ...requests.map(mapRequestToAdminEntry),
    ...appointmentsState.appointments.map(mapAppointmentToAdminEntry),
  ].sort((a, b) => {
    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
    return bTime - aTime;
  });

  return {
    entries,
    appointmentsTableReady: appointmentsState.tableReady,
  };
}

async function getRequestById(requestId: string): Promise<RequestRow | null> {
  const rows = await supabaseTableFetch<RawRequestRow[]>({
    path: `requests?id=eq.${encodeURIComponent(requestId)}&select=*`,
  });

  const normalizedRows = rows.map(normalizeRequestRow).filter((row) => row.id);
  return normalizedRows[0] || null;
}

async function getAppointmentById(
  appointmentId: string
): Promise<AppointmentRow | null> {
  try {
    const rows = await supabaseTableFetch<RawAppointmentRow[]>({
      path: `appointments?id=eq.${encodeURIComponent(appointmentId)}&select=*`,
    });

    const normalizedRows = rows
      .map(normalizeAppointmentRow)
      .filter((row) => row.id);

    return normalizedRows[0] || null;
  } catch (error) {
    if (isMissingTableError(error, "appointments")) {
      return null;
    }

    throw error;
  }
}

async function getAvailableBookingDays(): Promise<{
  days: AvailableBookingDay[];
  tableReady: boolean;
}> {
  try {
    const rows = await supabaseTableFetch<RawAvailableBookingDay[]>({
      path: `${AVAILABLE_DAYS_TABLE}?select=*&order=date.asc`,
    });

    return {
      days: rows
        .map(normalizeAvailableBookingDay)
        .filter((item): item is AvailableBookingDay => Boolean(item)),
      tableReady: true,
    };
  } catch {
    return {
      days: [],
      tableReady: false,
    };
  }
}

async function getBookingSlots(): Promise<{
  slots: BookingSlot[];
  tableReady: boolean;
}> {
  try {
    const rows = await supabaseTableFetch<RawBookingSlot[]>({
      path: `${BOOKING_SLOTS_TABLE}?select=*&order=booking_date.asc&order=start_time.asc`,
    });

    return {
      slots: rows
        .map(normalizeBookingSlot)
        .filter((item): item is BookingSlot => Boolean(item)),
      tableReady: true,
    };
  } catch (error) {
    if (isMissingTableError(error, BOOKING_SLOTS_TABLE)) {
      return {
        slots: [],
        tableReady: false,
      };
    }

    return {
      slots: [],
      tableReady: false,
    };
  }
}

function formatDate(value: string | undefined, lang: RequestLanguage) {
  if (!value) return adminText.dash[lang];

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const locale = lang === "ar" ? "ar-EG" : lang === "de" ? "de-DE" : "en-GB";

  return date.toLocaleString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateOnly(value: string | undefined, lang: RequestLanguage) {
  if (!value) return adminText.dash[lang];

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const locale = lang === "ar" ? "ar-EG" : lang === "de" ? "de-DE" : "en-GB";

  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
  });
}

function getStatusLabel(
  status: AdminEntryStatus | undefined,
  lang: RequestLanguage
) {
  const map = {
    ar: {
      new: "جديد",
      in_progress: "قيد المعالجة",
      confirmed: "مؤكد",
      done: "مكتمل",
      cancelled: "ملغي",
      rejected: "مرفوض",
    },
    de: {
      new: "Neu",
      in_progress: "In Bearbeitung",
      confirmed: "Bestätigt",
      done: "Abgeschlossen",
      cancelled: "Storniert",
      rejected: "Abgelehnt",
    },
    en: {
      new: "New",
      in_progress: "In Progress",
      confirmed: "Confirmed",
      done: "Completed",
      cancelled: "Cancelled",
      rejected: "Rejected",
    },
  };

  if (!status) return adminText.dash[lang];
  return map[lang][status] || status;
}

function getSlotStatusLabel(
  status: BookingSlotStatus | undefined,
  lang: RequestLanguage
) {
  if (status === "booked") {
    return adminText.slotStatusBooked[lang];
  }

  if (status === "blocked") {
    return adminText.slotStatusBlocked[lang];
  }

  return adminText.slotStatusAvailable[lang];
}

function getSlotStatusStyles(status?: BookingSlotStatus) {
  if (status === "booked") {
    return {
      background: "#fff1f0",
      border: "1px solid #efc9c5",
      color: "#9f3e35",
    };
  }

  if (status === "blocked") {
    return {
      background: "#f2f2f2",
      border: "1px solid #dddddd",
      color: "#5b5b5b",
    };
  }

  return {
    background: "#edf7ef",
    border: "1px solid #cfe4d3",
    color: "#2f6b3e",
  };
}

function getStatusStyles(status?: string) {
  if (status === "new") {
    return {
      background: "#f3eadf",
      border: "1px solid #e2d3bf",
      color: "#5f472e",
    };
  }

  if (status === "in_progress") {
    return {
      background: "#eef3fb",
      border: "1px solid #cfdcf3",
      color: "#30527a",
    };
  }

  if (status === "confirmed") {
    return {
      background: "#eef7f0",
      border: "1px solid #cfe4d3",
      color: "#2f6b3e",
    };
  }

  if (status === "done") {
    return {
      background: "#edf7ef",
      border: "1px solid #cfe4d3",
      color: "#2f6b3e",
    };
  }

  if (status === "cancelled" || status === "rejected") {
    return {
      background: "#fff1f0",
      border: "1px solid #efc9c5",
      color: "#9f3e35",
    };
  }

  return {
    background: "#f5f5f5",
    border: "1px solid #dedede",
    color: "#555",
  };
}

function getSafeText(value: string | undefined, lang: RequestLanguage) {
  return value && value.trim() ? value : adminText.dash[lang];
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getLocalizedStatusText(
  status: AdminEntryStatus,
  lang: RequestLanguage
) {
  return getStatusLabel(status, lang);
}

function getAppointmentTypeLabel(
  value: AppointmentType | undefined,
  lang: RequestLanguage
) {
  if (!value) return adminText.dash[lang];

  const map = {
    ar: {
      consultation: "استشارة",
      design: "تصميم",
      visit: "معاينة",
      installation: "تركيب",
    },
    de: {
      consultation: "Beratung",
      design: "Design",
      visit: "Besichtigung",
      installation: "Montage",
    },
    en: {
      consultation: "Consultation",
      design: "Design",
      visit: "Site Visit",
      installation: "Installation",
    },
  };

  return map[lang][value] || value;
}

function getAppointmentModeLabel(
  value: AppointmentMode | undefined,
  lang: RequestLanguage
) {
  if (!value) return adminText.dash[lang];

  const map = {
    ar: {
      at_store: "أنت تأتي",
      we_come_free: "نحن نأتي",
      phone_call: "اتصال هاتفي",
    },
    de: {
      at_store: "Du kommst",
      we_come_free: "Wir kommen",
      phone_call: "Telefonanruf",
    },
    en: {
      at_store: "You come",
      we_come_free: "We come",
      phone_call: "Phone call",
    },
  };

  return map[lang][value] || value;
}

function getItemTypeLabel(source: AdminEntrySource, lang: RequestLanguage) {
  return source === "appointment"
    ? adminText.appointmentTypeLabel[lang]
    : adminText.requestTypeLabel[lang];
}

function getStatusEmailSubject(params: {
  status: AdminEntryStatus;
  lang: RequestLanguage;
  source: AdminEntrySource;
}) {
  const { status, lang, source } = params;
  const isAppointment = source === "appointment";

  if (lang === "ar") {
    if (isAppointment) {
      if (status === "new") return "تم تسجيل موعدك - Caro Bara Smart Print";
      if (status === "confirmed") return "تم تأكيد موعدك - Caro Bara Smart Print";
      if (status === "in_progress") {
        return "موعدك قيد المعالجة - Caro Bara Smart Print";
      }
      if (status === "done") return "تم إكمال موعدك - Caro Bara Smart Print";
      if (status === "cancelled") return "تم إلغاء موعدك - Caro Bara Smart Print";
      if (status === "rejected") return "تعذر قبول موعدك - Caro Bara Smart Print";
      return "تم تحديث موعدك - Caro Bara Smart Print";
    }

    if (status === "new") return "تم تسجيل طلبك - Caro Bara Smart Print";
    if (status === "in_progress") {
      return "طلبك قيد المعالجة الآن - Caro Bara Smart Print";
    }
    return "تم إكمال طلبك - Caro Bara Smart Print";
  }

  if (lang === "de") {
    if (isAppointment) {
      if (status === "new") return "Ihr Termin wurde registriert - Caro Bara Smart Print";
      if (status === "confirmed") return "Ihr Termin wurde bestätigt - Caro Bara Smart Print";
      if (status === "in_progress") {
        return "Ihr Termin ist in Bearbeitung - Caro Bara Smart Print";
      }
      if (status === "done") return "Ihr Termin wurde abgeschlossen - Caro Bara Smart Print";
      if (status === "cancelled") return "Ihr Termin wurde storniert - Caro Bara Smart Print";
      if (status === "rejected") {
        return "Ihr Termin konnte nicht angenommen werden - Caro Bara Smart Print";
      }
      return "Ihr Termin wurde aktualisiert - Caro Bara Smart Print";
    }

    if (status === "new") {
      return "Ihre Anfrage wurde registriert - Caro Bara Smart Print";
    }
    if (status === "in_progress") {
      return "Ihre Anfrage wird jetzt bearbeitet - Caro Bara Smart Print";
    }
    return "Ihre Anfrage wurde abgeschlossen - Caro Bara Smart Print";
  }

  if (isAppointment) {
    if (status === "new") return "Your appointment has been registered - Caro Bara Smart Print";
    if (status === "confirmed") {
      return "Your appointment has been confirmed - Caro Bara Smart Print";
    }
    if (status === "in_progress") {
      return "Your appointment is in progress - Caro Bara Smart Print";
    }
    if (status === "done") return "Your appointment has been completed - Caro Bara Smart Print";
    if (status === "cancelled") {
      return "Your appointment has been cancelled - Caro Bara Smart Print";
    }
    if (status === "rejected") {
      return "Your appointment could not be accepted - Caro Bara Smart Print";
    }
    return "Your appointment has been updated - Caro Bara Smart Print";
  }

  if (status === "new") {
    return "Your request has been registered - Caro Bara Smart Print";
  }
  if (status === "in_progress") {
    return "Your request is now in progress - Caro Bara Smart Print";
  }
  return "Your request has been completed - Caro Bara Smart Print";
}

function getCompanyFooterHtml(lang: RequestLanguage) {
  const workingHours =
    lang === "ar"
      ? "أوقات العمل: الإثنين–الجمعة 09:00–18:00 | السبت 09:00–15:00 | الأحد عطلة"
      : lang === "de"
        ? "Öffnungszeiten: Mo–Fr 09:00–18:00 | Sa 09:00–15:00 | So geschlossen"
        : "Working hours: Mon–Fri 09:00–18:00 | Sat 09:00–15:00 | Sun closed";

  return `
    <div style="margin-top:22px; padding-top:18px; border-top:1px solid #eadbca; font-size:13px; line-height:1.9; color:#6b5a49;">
      <div style="font-weight:800; color:#1f1711; margin-bottom:6px;">Caro Bara Smart Print</div>
      <div>Caro Bara Team</div>
      <div>Fanninger Straße 20, 10365 Berlin</div>
      <div>${escapeHtml(workingHours)}</div>
      <div>
        <a href="mailto:info@carobara.com" style="color:#6b5a49; text-decoration:none;">info@carobara.com</a>
        &nbsp;|&nbsp;
        <a href="mailto:info@carobara.de" style="color:#6b5a49; text-decoration:none;">info@carobara.de</a>
      </div>
      <div>
        <a href="tel:+4917621105086" style="color:#6b5a49; text-decoration:none;">+49 176 21105086</a>
        &nbsp;|&nbsp;
        <a href="tel:+493068965559" style="color:#6b5a49; text-decoration:none;">+49 30 68965559</a>
      </div>
      <div>
        <a href="https://www.carobara.de" style="color:#6b5a49; text-decoration:none;">www.carobara.de</a>
      </div>
    </div>
  `;
}

function getStatusEmailHtml(params: {
  lang: RequestLanguage;
  fullName: string;
  requestId: string;
  status: AdminEntryStatus;
  source: AdminEntrySource;
  adminComment?: string;
}) {
  const { lang, fullName, requestId, status, source, adminComment } = params;
  const safeName = escapeHtml(fullName || "");
  const safeRequestId = escapeHtml(requestId || "");
  const localizedStatus = getLocalizedStatusText(status, lang);
  const companyFooter = getCompanyFooterHtml(lang);
  const safeComment = escapeHtml((adminComment || "").trim());
  const isAppointment = source === "appointment";

  const commentSection =
    safeComment.length > 0
      ? lang === "ar"
        ? `
          <div style="margin:18px 0; padding:16px 18px; background:#fffaf4; border:1px solid #eadbca; border-radius:14px;">
            <div style="font-size:14px; line-height:1.9; color:#3f3125;">
              <strong>تعليق من فريقنا:</strong><br />
              ${safeComment.replace(/\n/g, "<br />")}
            </div>
          </div>
        `
        : lang === "de"
          ? `
          <div style="margin:18px 0; padding:16px 18px; background:#fffaf4; border:1px solid #eadbca; border-radius:14px;">
            <div style="font-size:14px; line-height:1.9; color:#3f3125;">
              <strong>Kommentar von unserem Team:</strong><br />
              ${safeComment.replace(/\n/g, "<br />")}
            </div>
          </div>
        `
          : `
          <div style="margin:18px 0; padding:16px 18px; background:#fffaf4; border:1px solid #eadbca; border-radius:14px;">
            <div style="font-size:14px; line-height:1.9; color:#3f3125;">
              <strong>Comment from our team:</strong><br />
              ${safeComment.replace(/\n/g, "<br />")}
            </div>
          </div>
        `
      : "";

  if (lang === "ar") {
    const bodyText = isAppointment
      ? status === "new"
        ? "تم تسجيل موعدك لدينا بنجاح وهو الآن ضمن قائمة المتابعة."
        : status === "confirmed"
          ? "نود إبلاغك أن موعدك تم تأكيده من قبل فريقنا."
          : status === "in_progress"
            ? "نود إبلاغك أن موعدك أصبح الآن قيد المتابعة والمعالجة."
            : status === "done"
              ? "يسعدنا إبلاغك أن موعدك تم إكماله بنجاح."
              : status === "cancelled"
                ? "نود إبلاغك أن موعدك تم إلغاؤه. يمكنك التواصل معنا لترتيب موعد جديد."
                : "نعتذر، تعذر قبول الموعد بصيغته الحالية. يمكنك التواصل معنا لترتيب موعد بديل."
      : status === "new"
        ? "تم تسجيل طلبك لدينا بنجاح وهو الآن ضمن قائمة المتابعة."
        : status === "in_progress"
          ? "نود إبلاغك أن طلبك أصبح الآن قيد المعالجة من قبل فريقنا."
          : "يسعدنا إبلاغك أن طلبك تم إكماله. سنكون سعداء بخدمتك مجددًا.";

    const heading = isAppointment ? "تحديث حالة موعدك" : "تحديث حالة طلبك";

    return `
      <div style="margin:0; padding:32px 16px; background:#f7f2ec; font-family:Arial, Helvetica, sans-serif; direction:rtl; text-align:right; color:#1f1711;">
        <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5d7c8; border-radius:20px; overflow:hidden; box-shadow:0 12px 30px rgba(44,30,18,0.08);">
          <div style="padding:24px 28px; background:linear-gradient(135deg, #f8efe3 0%, #fffaf4 100%); border-bottom:1px solid #eadbca;">
            <div style="font-size:12px; font-weight:700; letter-spacing:0.4px; color:#8a6a47; margin-bottom:10px;">
              CARO BARA SMART PRINT • BERLIN
            </div>
            <h1 style="margin:0; font-size:28px; line-height:1.3; color:#1f1711;">
              ${heading}
            </h1>
          </div>

          <div style="padding:28px;">
            <p style="margin:0 0 14px; font-size:16px; line-height:1.9;">
              ${safeName || "عميلنا الكريم"}،
            </p>

            <p style="margin:0 0 14px; font-size:15px; line-height:1.9; color:#4b3a2a;">
              ${bodyText}
            </p>

            <div style="margin:18px 0; padding:16px 18px; background:#f8f1e8; border:1px solid #e8dacb; border-radius:14px;">
              <div style="font-size:13px; color:#7a624c; margin-bottom:6px;">${
                isAppointment ? "رقم الموعد" : "رقم الطلب"
              }</div>
              <div style="font-size:18px; font-weight:800; color:#1f1711;">${safeRequestId}</div>
            </div>

            <div style="margin:18px 0; padding:16px 18px; background:#fffaf4; border:1px solid #eadbca; border-radius:14px;">
              <div style="font-size:14px; line-height:1.9; color:#3f3125;">
                <strong>الحالة الحالية:</strong><br />
                ${escapeHtml(localizedStatus)}
              </div>
            </div>

            ${commentSection}

            <p style="margin:18px 0 0; font-size:14px; line-height:1.9; color:#6b5a49;">
              مع خالص التحية،<br />
              <strong>Caro Bara Team</strong>
            </p>

            ${companyFooter}
          </div>
        </div>
      </div>
    `;
  }

  if (lang === "de") {
    const bodyText = isAppointment
      ? status === "new"
        ? "Ihr Termin wurde erfolgreich registriert und befindet sich jetzt in unserer Bearbeitungsliste."
        : status === "confirmed"
          ? "Wir möchten Sie darüber informieren, dass Ihr Termin von unserem Team bestätigt wurde."
          : status === "in_progress"
            ? "Wir möchten Sie darüber informieren, dass Ihr Termin nun in Bearbeitung ist."
            : status === "done"
              ? "Wir freuen uns, Ihnen mitzuteilen, dass Ihr Termin abgeschlossen wurde."
              : status === "cancelled"
                ? "Wir möchten Sie informieren, dass Ihr Termin storniert wurde. Kontaktieren Sie uns gerne für einen neuen Termin."
                : "Wir konnten den Termin in der aktuellen Form leider nicht annehmen. Kontaktieren Sie uns gerne für eine alternative Abstimmung."
      : status === "new"
        ? "Ihre Anfrage wurde erfolgreich registriert und befindet sich jetzt in unserer Bearbeitungsliste."
        : status === "in_progress"
          ? "Wir möchten Sie darüber informieren, dass Ihre Anfrage nun von unserem Team bearbeitet wird."
          : "Wir freuen uns, Ihnen mitzuteilen, dass Ihre Anfrage abgeschlossen wurde. Vielen Dank für Ihr Vertrauen.";

    const heading = isAppointment
      ? "Status Ihres Termins wurde aktualisiert"
      : "Status Ihrer Anfrage wurde aktualisiert";

    return `
      <div style="margin:0; padding:32px 16px; background:#f7f2ec; font-family:Arial, Helvetica, sans-serif; color:#1f1711;">
        <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5d7c8; border-radius:20px; overflow:hidden; box-shadow:0 12px 30px rgba(44,30,18,0.08);">
          <div style="padding:24px 28px; background:linear-gradient(135deg, #f8efe3 0%, #fffaf4 100%); border-bottom:1px solid #eadbca;">
            <div style="font-size:12px; font-weight:700; letter-spacing:0.4px; color:#8a6a47; margin-bottom:10px;">
              CARO BARA SMART PRINT • BERLIN
            </div>
            <h1 style="margin:0; font-size:28px; line-height:1.3; color:#1f1711;">
              ${heading}
            </h1>
          </div>

          <div style="padding:28px;">
            <p style="margin:0 0 14px; font-size:16px; line-height:1.9;">
              ${safeName || "Guten Tag"},
            </p>

            <p style="margin:0 0 14px; font-size:15px; line-height:1.9; color:#4b3a2a;">
              ${bodyText}
            </p>

            <div style="margin:18px 0; padding:16px 18px; background:#f8f1e8; border:1px solid #e8dacb; border-radius:14px;">
              <div style="font-size:13px; color:#7a624c; margin-bottom:6px;">${
                isAppointment ? "Terminnummer" : "Anfragenummer"
              }</div>
              <div style="font-size:18px; font-weight:800; color:#1f1711;">${safeRequestId}</div>
            </div>

            <div style="margin:18px 0; padding:16px 18px; background:#fffaf4; border:1px solid #eadbca; border-radius:14px;">
              <div style="font-size:14px; line-height:1.9; color:#3f3125;">
                <strong>Aktueller Status:</strong><br />
                ${escapeHtml(localizedStatus)}
              </div>
            </div>

            ${commentSection}

            <p style="margin:18px 0 0; font-size:14px; line-height:1.9; color:#6b5a49;">
              Mit freundlichen Grüßen<br />
              <strong>Caro Bara Team</strong>
            </p>

            ${companyFooter}
          </div>
        </div>
      </div>
    `;
  }

    const bodyText = isAppointment
    ? status === "new"
      ? "Your appointment has been successfully registered and is now in our workflow."
      : status === "confirmed"
        ? "We would like to let you know that your appointment has been confirmed by our team."
        : status === "in_progress"
          ? "We would like to let you know that your appointment is now being processed by our team."
          : status === "done"
            ? "We are pleased to inform you that your appointment has been completed."
            : status === "cancelled"
              ? "We would like to inform you that your appointment has been cancelled. Please contact us to arrange a new one."
              : "We are sorry, but your appointment could not be accepted in its current form. Please contact us to arrange an alternative."
    : status === "new"
      ? "Your request has been successfully registered and is now in our workflow."
      : status === "in_progress"
        ? "We would like to let you know that your request is now being processed by our team."
        : "We are pleased to inform you that your request has been completed. Thank you for your trust.";

  const heading = isAppointment
    ? "Your appointment status has been updated"
    : "Your request status has been updated";

  return `
    <div style="margin:0; padding:32px 16px; background:#f7f2ec; font-family:Arial, Helvetica, sans-serif; color:#1f1711;">
      <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5d7c8; border-radius:20px; overflow:hidden; box-shadow:0 12px 30px rgba(44,30,18,0.08);">
        <div style="padding:24px 28px; background:linear-gradient(135deg, #f8efe3 0%, #fffaf4 100%); border-bottom:1px solid #eadbca;">
          <div style="font-size:12px; font-weight:700; letter-spacing:0.4px; color:#8a6a47; margin-bottom:10px;">
            CARO BARA SMART PRINT • BERLIN
          </div>
          <h1 style="margin:0; font-size:28px; line-height:1.3; color:#1f1711;">
            ${heading}
          </h1>
        </div>

        <div style="padding:28px;">
          <p style="margin:0 0 14px; font-size:16px; line-height:1.9;">
            ${safeName || "Hello"},
          </p>

          <p style="margin:0 0 14px; font-size:15px; line-height:1.9; color:#4b3a2a;">
            ${bodyText}
          </p>

          <div style="margin:18px 0; padding:16px 18px; background:#f8f1e8; border:1px solid #e8dacb; border-radius:14px;">
            <div style="font-size:13px; color:#7a624c; margin-bottom:6px;">${
              isAppointment ? "Appointment ID" : "Request ID"
            }</div>
            <div style="font-size:18px; font-weight:800; color:#1f1711;">${safeRequestId}</div>
          </div>

          <div style="margin:18px 0; padding:16px 18px; background:#fffaf4; border:1px solid #eadbca; border-radius:14px;">
            <div style="font-size:14px; line-height:1.9; color:#3f3125;">
              <strong>Current status:</strong><br />
              ${escapeHtml(localizedStatus)}
            </div>
          </div>

          ${commentSection}

          <p style="margin:18px 0 0; font-size:14px; line-height:1.9; color:#6b5a49;">
            Kind regards,<br />
            <strong>Caro Bara Team</strong>
          </p>

          ${companyFooter}
        </div>
      </div>
    </div>
  `;
}

async function sendStatusUpdateEmail(params: {
  email: string;
  fullName: string;
  requestId: string;
  status: AdminEntryStatus;
  lang: RequestLanguage;
  source: AdminEntrySource;
  adminComment?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const resendFromEmail =
    process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing");
  }

  const resend = new Resend(apiKey);
  const subject = getStatusEmailSubject({
    status: params.status,
    lang: params.lang,
    source: params.source,
  });
  const html = getStatusEmailHtml({
    lang: params.lang,
    fullName: params.fullName,
    requestId: params.requestId,
    status: params.status,
    source: params.source,
    adminComment: params.adminComment,
  });

  const result = await resend.emails.send({
    from: `Caro Bara <${resendFromEmail}>`,
    to: params.email,
    replyTo: "info@carobara.com",
    subject,
    html,
  });

  if (result.error) {
    throw new Error(result.error.message || "Failed to send status update email");
  }
}

async function updateEntryStatus(formData: FormData) {
  "use server";

  const entryId = String(formData.get("entryId") || "").trim();
  const source = String(formData.get("source") || "").trim() as AdminEntrySource;
  const adminComment = String(formData.get("adminComment") || "").trim();

  if (!entryId) {
    throw new Error("Entry id is missing");
  }

  if (source !== "request" && source !== "appointment") {
    throw new Error("Invalid entry source");
  }

  const tableName = source === "appointment" ? "appointments" : "requests";
  const rawStatus = String(formData.get("status") || "").trim();
  const nextStatus = normalizeAdminEntryStatus(rawStatus, source);

  const entry =
    source === "appointment"
      ? await getAppointmentById(entryId)
      : await getRequestById(entryId);

  if (!entry) {
    throw new Error(
      source === "appointment" ? "Appointment not found" : "Request not found"
    );
  }

  await supabaseTableFetch<null>({
    path: `${tableName}?id=eq.${encodeURIComponent(entryId)}`,
    method: "PATCH",
    body: {
      status: nextStatus,
    },
    prefer: "return=minimal",
  });

  const customer: RequestCustomer =
    source === "appointment"
      ? {
          requestId: (entry as AppointmentRow).id,
          requestLanguage:
            (entry as AppointmentRow).customer?.requestLanguage || "ar",
          fullName: (entry as AppointmentRow).customer?.fullName,
          email: (entry as AppointmentRow).customer?.email,
          phone: (entry as AppointmentRow).customer?.phone,
          street: (entry as AppointmentRow).customer?.street,
          houseNumber: (entry as AppointmentRow).customer?.houseNumber,
          postalCode: (entry as AppointmentRow).customer?.postalCode,
          city: (entry as AppointmentRow).customer?.city,
          subject: (entry as AppointmentRow).customer?.subject,
          message: (entry as AppointmentRow).customer?.message,
        }
      : (entry as RequestRow).customer || {};

  const customerEmail = String(customer.email || "").trim();

  if (customerEmail) {
    await sendStatusUpdateEmail({
      email: customerEmail,
      fullName: String(customer.fullName || ""),
      requestId:
        source === "appointment"
          ? String((entry as AppointmentRow).id || "")
          : String(customer.requestId || (entry as RequestRow).id || ""),
      status: nextStatus,
      lang: normalizeLanguage(customer.requestLanguage),
      source,
      adminComment,
    });
  }

  revalidatePath("/admin/requests");
}

async function deleteEntry(formData: FormData) {
  "use server";

  const entryId = String(formData.get("entryId") || "").trim();
  const source = String(formData.get("source") || "").trim() as AdminEntrySource;

  if (!entryId) {
    throw new Error("Entry id is missing");
  }

  if (source !== "request" && source !== "appointment") {
    throw new Error("Invalid entry source");
  }

  const tableName = source === "appointment" ? "appointments" : "requests";

  await supabaseTableFetch<null>({
    path: `${tableName}?id=eq.${encodeURIComponent(entryId)}`,
    method: "DELETE",
    prefer: "return=minimal",
  });

  revalidatePath("/admin/requests");
}

async function addAvailableDay(formData: FormData) {
  "use server";

  const rawDate = String(formData.get("date") || "").trim();
  const note = String(formData.get("note") || "").trim();

  let normalizedDate = rawDate;

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(rawDate)) {
    const [day, month, year] = rawDate.split("/");
    normalizedDate = `${year}-${month}-${day}`;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
    throw new Error("Invalid date");
  }

  const parsedDate = new Date(`${normalizedDate}T12:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date");
  }

  const existing = await supabaseTableFetch<RawAvailableBookingDay[]>({
    path: `${AVAILABLE_DAYS_TABLE}?select=id,date&date=eq.${encodeURIComponent(
      normalizedDate
    )}&limit=1`,
  });

  if ((existing || []).length > 0) {
    revalidatePath("/admin/requests");
    return;
  }

  await supabaseTableFetch<RawAvailableBookingDay[]>({
    path: AVAILABLE_DAYS_TABLE,
    method: "POST",
    body: [
      {
        date: normalizedDate,
        note: note || null,
      },
    ],
    prefer: "return=representation",
  });

  revalidatePath("/admin/requests");
}

async function removeAvailableDay(formData: FormData) {
  "use server";

  const dayId = String(formData.get("dayId") || "").trim();

  if (!dayId) {
    throw new Error("Available day id is missing");
  }

  await supabaseTableFetch<null>({
    path: `${AVAILABLE_DAYS_TABLE}?id=eq.${encodeURIComponent(dayId)}`,
    method: "DELETE",
    prefer: "return=minimal",
  });

  revalidatePath("/admin/requests");
}

async function addBookingSlot(formData: FormData) {
  "use server";

  const bookingDate = String(formData.get("bookingDate") || "").trim();
  const startTime = normalizeTimeInput(
    String(formData.get("startTime") || "").trim()
  );
  const endTime = normalizeTimeInput(
    String(formData.get("endTime") || "").trim()
  );
  const status = normalizeBookingSlotStatus(
    String(formData.get("status") || "").trim()
  );
  const note = String(formData.get("note") || "").trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(bookingDate)) {
    throw new Error("Invalid booking date");
  }

  if (
    !/^\d{2}:\d{2}:\d{2}$/.test(startTime) ||
    !/^\d{2}:\d{2}:\d{2}$/.test(endTime)
  ) {
    throw new Error("Invalid start or end time");
  }

  if (startTime >= endTime) {
    throw new Error("End time must be later than start time");
  }

  const existingDay = await supabaseTableFetch<RawAvailableBookingDay[]>({
    path: `${AVAILABLE_DAYS_TABLE}?select=id,date&date=eq.${encodeURIComponent(
      bookingDate
    )}&limit=1`,
  });

  if (!existingDay || existingDay.length === 0) {
    throw new Error("Selected booking day does not exist");
  }

  const overlappingSlots = await supabaseTableFetch<RawBookingSlot[]>({
    path:
      `${BOOKING_SLOTS_TABLE}?select=id,booking_date,start_time,end_time,status` +
      `&booking_date=eq.${encodeURIComponent(bookingDate)}` +
      `&start_time=lt.${encodeURIComponent(endTime)}` +
      `&end_time=gt.${encodeURIComponent(startTime)}`,
  });

  if ((overlappingSlots || []).length > 0) {
    throw new Error("A conflicting slot already exists for this time range");
  }

  await supabaseTableFetch<RawBookingSlot[]>({
    path: BOOKING_SLOTS_TABLE,
    method: "POST",
    body: [
      {
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
        status,
        note: note || null,
      },
    ],
    prefer: "return=representation",
  });

  revalidatePath("/admin/requests");
}

async function updateBookingSlot(formData: FormData) {
  "use server";

  const slotId = String(formData.get("slotId") || "").trim();
  const bookingDate = String(formData.get("bookingDate") || "").trim();
  const startTime = normalizeTimeInput(
    String(formData.get("startTime") || "").trim()
  );
  const endTime = normalizeTimeInput(
    String(formData.get("endTime") || "").trim()
  );
  const status = normalizeBookingSlotStatus(
    String(formData.get("status") || "").trim()
  );
  const note = String(formData.get("note") || "").trim();

  if (!slotId) {
    throw new Error("Slot id is missing");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(bookingDate)) {
    throw new Error("Invalid booking date");
  }

  if (
    !/^\d{2}:\d{2}:\d{2}$/.test(startTime) ||
    !/^\d{2}:\d{2}:\d{2}$/.test(endTime)
  ) {
    throw new Error("Invalid start or end time");
  }

  if (startTime >= endTime) {
    throw new Error("End time must be later than start time");
  }

    const overlappingSlots = await supabaseTableFetch<RawBookingSlot[]>({
    path:
      `${BOOKING_SLOTS_TABLE}?select=id,booking_date,start_time,end_time,status` +
      `&booking_date=eq.${encodeURIComponent(bookingDate)}` +
      `&start_time=lt.${encodeURIComponent(endTime)}` +
      `&end_time=gt.${encodeURIComponent(startTime)}` +
      `&id=neq.${encodeURIComponent(slotId)}`,
  });

  if ((overlappingSlots || []).length > 0) {
    throw new Error("A conflicting slot already exists for this time range");
  }

  await supabaseTableFetch<null>({
    path: `${BOOKING_SLOTS_TABLE}?id=eq.${encodeURIComponent(slotId)}`,
    method: "PATCH",
    body: {
      booking_date: bookingDate,
      start_time: startTime,
      end_time: endTime,
      status,
      note: note || null,
    },
    prefer: "return=minimal",
  });

  revalidatePath("/admin/requests");
}

async function removeBookingSlot(formData: FormData) {
  "use server";

  const slotId = String(formData.get("slotId") || "").trim();

  if (!slotId) {
    throw new Error("Slot id is missing");
  }

  await supabaseTableFetch<null>({
    path: `${BOOKING_SLOTS_TABLE}?id=eq.${encodeURIComponent(slotId)}`,
    method: "DELETE",
    prefer: "return=minimal",
  });

  revalidatePath("/admin/requests");
}

async function logoutAction() {
  "use server";

  await clearAdminSession();
  redirect("/admin/login");
}

function LanguageSwitch(props: { currentLang: RequestLanguage }) {
  const { currentLang } = props;

  const links: Array<{
    lang: RequestLanguage;
    label: string;
  }> = [
    { lang: "ar", label: adminText.languageAr[currentLang] },
    { lang: "de", label: adminText.languageDe[currentLang] },
    { lang: "en", label: adminText.languageEn[currentLang] },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
      }}
    >
      {links.map((item) => {
        const isActive = item.lang === currentLang;

        return (
          <Link
            key={item.lang}
            href={`/admin/requests?lang=${item.lang}`}
            style={{
              padding: "10px 14px",
              borderRadius: "12px",
              border: isActive ? "1px solid #2a1d13" : "1px solid #d9c7b4",
              background: isActive ? "#2a1d13" : "#fffaf4",
              color: isActive ? "#ffffff" : "#2d2117",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

export default async function RequestsPage(props: {
  searchParams?: SearchParams;
}) {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const resolvedSearchParams = props.searchParams
    ? await props.searchParams
    : {};

  const langValue = Array.isArray(resolvedSearchParams.lang)
    ? resolvedSearchParams.lang[0]
    : resolvedSearchParams.lang;

  const lang = normalizeLanguage(langValue);
  const dir = getDir(lang);

  const [entriesState, availableDaysState, bookingSlotsState] = await Promise.all([
    getAdminEntries(),
    getAvailableBookingDays(),
    getBookingSlots(),
  ]);

  const entries = entriesState.entries;
  const appointmentsTableReady = entriesState.appointmentsTableReady;
  const availableDays = availableDaysState.days;
  const availableDaysTableReady = availableDaysState.tableReady;
  const bookingSlots = bookingSlotsState.slots;
  const bookingSlotsTableReady = bookingSlotsState.tableReady;

  const slotsByDay = availableDays.map((day) => ({
    day,
    slots: bookingSlots.filter((slot) => slot.booking_date === day.date),
  }));

  return (
    <div
      dir={dir}
      style={{
        minHeight: "100vh",
        background: "#f6f1ea",
        padding: "32px 20px 48px",
        fontFamily: "Arial, sans-serif",
        color: "#1f1711",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "18px",
          }}
        >
          <LanguageSwitch currentLang={lang} />

          <form action={logoutAction}>
            <button
              type="submit"
              style={{
                padding: "10px 16px",
                borderRadius: "12px",
                border: "1px solid #b53b32",
                background: "#fff4f3",
                color: "#b53b32",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {adminText.logout[lang]}
            </button>
          </form>
        </div>

        <div
          style={{
            background: "#fffaf4",
            border: "1px solid #e5d8c8",
            borderRadius: "22px",
            padding: "26px 24px",
            marginBottom: "22px",
            boxShadow: "0 10px 28px rgba(45, 28, 14, 0.04)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: "999px",
              background: "#efe3d4",
              color: "#6a5034",
              fontSize: "12px",
              fontWeight: 700,
              marginBottom: "14px",
            }}
          >
            {adminText.badge[lang]}
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "36px",
              lineHeight: 1.2,
              color: "#251b13",
            }}
          >
            {adminText.title[lang]}
          </h1>

          <p
            style={{
              margin: 0,
              color: "#6b5a49",
              fontSize: "15px",
              lineHeight: 1.8,
              maxWidth: "860px",
            }}
          >
            {adminText.subtitle[lang]}
          </p>
        </div>

        <section
          style={{
            background: "#fffaf4",
            border: "1px solid #e5d8c8",
            borderRadius: "20px",
            padding: "22px",
            marginBottom: "22px",
            boxShadow: "0 8px 24px rgba(45, 28, 14, 0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "16px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  lineHeight: 1.2,
                  color: "#251b13",
                  marginBottom: "8px",
                }}
              >
                {adminText.availableDaysTitle[lang]}
              </div>

              <div
                style={{
                  fontSize: "14px",
                  lineHeight: 1.8,
                  color: "#6b5a49",
                  maxWidth: "860px",
                }}
              >
                {adminText.availableDaysSubtitle[lang]}
              </div>
            </div>

            <div
              style={{
                padding: "10px 14px",
                borderRadius: "14px",
                background: "#f8f1e8",
                border: "1px solid #e8dacb",
                fontSize: "13px",
                fontWeight: 700,
                color: "#5f472e",
              }}
            >
              {adminText.availableDaysCount[lang]}: {availableDays.length}
            </div>
          </div>

          {availableDaysTableReady ? (
            <>
              <form
                action={addAvailableDay}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(220px, 260px) minmax(0, 1fr) auto",
                  gap: "10px",
                  alignItems: "start",
                  marginBottom: "16px",
                }}
              >
                <input
                  type="date"
                  name="date"
                  required
                  style={{
                    minHeight: "46px",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid #d9c7b4",
                    background: "#fffdfa",
                    color: "#2d2117",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />

                <input
                  type="text"
                  name="note"
                  placeholder={adminText.availableDayPlaceholder[lang]}
                  style={{
                    minHeight: "46px",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid #d9c7b4",
                    background: "#fffdfa",
                    color: "#2d2117",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />

                <button
                  type="submit"
                  style={{
                    minHeight: "46px",
                    padding: "10px 16px",
                    borderRadius: "12px",
                    border: "1px solid #2a1d13",
                    background: "#2a1d13",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {adminText.addAvailableDay[lang]}
                </button>
              </form>

              <div
                style={{
                  fontSize: "12px",
                  lineHeight: 1.8,
                  color: "#7a6754",
                  marginBottom: "16px",
                }}
              >
                {adminText.availableDaysSchemaHint[lang]}
              </div>

              {availableDays.length === 0 ? (
                <div
                  style={{
                    background: "#fff",
                    border: "1px dashed #d9c7b4",
                    borderRadius: "16px",
                    padding: "18px",
                    color: "#6b5a49",
                    fontSize: "14px",
                  }}
                >
                  {adminText.availableDaysEmpty[lang]}
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: "10px",
                  }}
                >
                  {availableDays.map((day) => (
                    <div
                      key={day.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "minmax(0, 1fr) auto",
                        gap: "12px",
                        alignItems: "center",
                        background: "#fcfaf7",
                        border: "1px solid #eee2d3",
                        borderRadius: "16px",
                        padding: "14px",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gap: "6px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "15px",
                            fontWeight: 800,
                            color: "#2f2419",
                          }}
                        >
                          {adminText.availableDay[lang]}:{" "}
                          {formatDateOnly(day.date, lang)}
                        </div>

                        <div
                          style={{
                            fontSize: "13px",
                            lineHeight: 1.7,
                            color: "#6b5a49",
                          }}
                        >
                          {adminText.availableDayNote[lang]}:{" "}
                          {getSafeText(day.note, lang)}
                        </div>
                      </div>

                      <form action={removeAvailableDay}>
                        <input type="hidden" name="dayId" value={day.id} />
                        <button
                          type="submit"
                          style={{
                            minHeight: "40px",
                            padding: "8px 14px",
                            borderRadius: "12px",
                            border: "1px solid #b53b32",
                            background: "#fff4f3",
                            color: "#b53b32",
                            fontSize: "14px",
                            fontWeight: 700,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {adminText.removeAvailableDay[lang]}
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div
              style={{
                background: "#fff4f3",
                border: "1px solid #efc9c5",
                borderRadius: "16px",
                padding: "16px",
                color: "#9f3e35",
                fontSize: "14px",
                lineHeight: 1.8,
              }}
            >
              {adminText.availableDaysUnavailable[lang]}
            </div>
          )}
        </section>

        <section
          style={{
            background: "#fffaf4",
            border: "1px solid #e5d8c8",
            borderRadius: "20px",
            padding: "22px",
            marginBottom: "22px",
            boxShadow: "0 8px 24px rgba(45, 28, 14, 0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "16px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  lineHeight: 1.2,
                  color: "#251b13",
                  marginBottom: "8px",
                }}
              >
                {adminText.slotsTitle[lang]}
              </div>

              <div
                style={{
                  fontSize: "14px",
                  lineHeight: 1.8,
                  color: "#6b5a49",
                  maxWidth: "860px",
                }}
              >
                {adminText.slotsSubtitle[lang]}
              </div>
            </div>

            <div
              style={{
                padding: "10px 14px",
                borderRadius: "14px",
                background: "#f8f1e8",
                border: "1px solid #e8dacb",
                fontSize: "13px",
                fontWeight: 700,
                color: "#5f472e",
              }}
            >
              {adminText.slotsCount[lang]}: {bookingSlots.length}
            </div>
          </div>

          {bookingSlotsTableReady ? (
            <>
              {availableDays.length === 0 ? (
                <div
                  style={{
                    background: "#fff4f3",
                    border: "1px solid #efc9c5",
                    borderRadius: "16px",
                    padding: "16px",
                    color: "#9f3e35",
                    fontSize: "14px",
                    lineHeight: 1.8,
                    marginBottom: "16px",
                  }}
                >
                  {adminText.slotSavedDayMissing[lang]}
                </div>
              ) : (
                <form
                  action={addBookingSlot}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "minmax(220px, 260px) minmax(150px, 170px) minmax(150px, 170px) minmax(160px, 180px) minmax(0, 1fr) auto",
                    gap: "10px",
                    alignItems: "start",
                    marginBottom: "16px",
                  }}
                >
                  <select
                    name="bookingDate"
                    required
                    defaultValue=""
                    style={{
                      minHeight: "46px",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      border: "1px solid #d9c7b4",
                      background: "#fffdfa",
                      color: "#2d2117",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="">{adminText.selectDayForSlots[lang]}</option>
                    {availableDays.map((day) => (
                      <option key={day.id} value={day.date}>
                        {formatDateOnly(day.date, lang)}
                      </option>
                    ))}
                  </select>

                  <input
                    type="time"
                    name="startTime"
                    required
                    style={{
                      minHeight: "46px",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      border: "1px solid #d9c7b4",
                      background: "#fffdfa",
                      color: "#2d2117",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />

                  <input
                    type="time"
                    name="endTime"
                    required
                    style={{
                      minHeight: "46px",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      border: "1px solid #d9c7b4",
                      background: "#fffdfa",
                      color: "#2d2117",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />

                  <select
                    name="status"
                    defaultValue="available"
                    style={{
                      minHeight: "46px",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      border: "1px solid #d9c7b4",
                      background: "#fffdfa",
                      color: "#2d2117",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="available">
                      {adminText.slotStatusAvailable[lang]}
                    </option>
                    <option value="booked">
                      {adminText.slotStatusBooked[lang]}
                    </option>
                    <option value="blocked">
                      {adminText.slotStatusBlocked[lang]}
                    </option>
                  </select>

                  <input
                    type="text"
                    name="note"
                    placeholder={adminText.slotNotePlaceholder[lang]}
                    style={{
                      minHeight: "46px",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      border: "1px solid #d9c7b4",
                      background: "#fffdfa",
                      color: "#2d2117",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />

                  <button
                    type="submit"
                    style={{
                      minHeight: "46px",
                      padding: "10px 16px",
                      borderRadius: "12px",
                      border: "1px solid #2a1d13",
                      background: "#2a1d13",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: 700,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {adminText.addSlot[lang]}
                  </button>
                </form>
              )}

              <div
                style={{
                  fontSize: "12px",
                  lineHeight: 1.8,
                  color: "#7a6754",
                  marginBottom: "16px",
                }}
              >
                {adminText.slotsSchemaHint[lang]}
              </div>

              {availableDays.length === 0 ? null : (
                <div
                  style={{
                    display: "grid",
                    gap: "14px",
                  }}
                >
                  {slotsByDay.map(({ day, slots }) => (
                    <div
                      key={day.id}
                      style={{
                        background: "#fcfaf7",
                        border: "1px solid #eee2d3",
                        borderRadius: "16px",
                        padding: "14px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: 800,
                          color: "#2f2419",
                          marginBottom: "10px",
                        }}
                      >
                        {adminText.slotsForDate[lang]}: {formatDateOnly(day.date, lang)}
                      </div>

                      {slots.length === 0 ? (
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#6b5a49",
                            lineHeight: 1.8,
                          }}
                        >
                          {adminText.slotsEmpty[lang]}
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "grid",
                            gap: "10px",
                          }}
                        >
                          {slots.map((slot) => {
                            const slotStatusStyles = getSlotStatusStyles(slot.status);

                            return (
                              <form
                                key={slot.id}
                                action={updateBookingSlot}
                                style={{
                                  background: "#fff",
                                  border: "1px solid #eadfce",
                                  borderRadius: "14px",
                                  padding: "12px",
                                  display: "grid",
                                  gap: "10px",
                                }}
                              >
                                <input type="hidden" name="slotId" value={slot.id} />
                                <input
                                  type="hidden"
                                  name="bookingDate"
                                  value={slot.booking_date}
                                />

                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "10px",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: 800,
                                      color: "#2f2419",
                                    }}
                                  >
                                    {formatTimeOnly(slot.start_time)} –{" "}
                                    {formatTimeOnly(slot.end_time)}
                                  </div>

                                  <div
                                    style={{
                                      padding: "6px 10px",
                                      borderRadius: "999px",
                                      fontSize: "12px",
                                      fontWeight: 700,
                                      ...slotStatusStyles,
                                    }}
                                  >
                                    {getSlotStatusLabel(slot.status, lang)}
                                  </div>
                                </div>

                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                      "minmax(150px, 170px) minmax(150px, 170px) minmax(160px, 180px) minmax(0, 1fr)",
                                    gap: "10px",
                                  }}
                                >
                                  <input
                                    type="time"
                                    name="startTime"
                                    defaultValue={formatTimeOnly(slot.start_time)}
                                    required
                                    style={{
                                      minHeight: "42px",
                                      padding: "8px 10px",
                                      borderRadius: "12px",
                                      border: "1px solid #d9c7b4",
                                      background: "#fffdfa",
                                      color: "#2d2117",
                                      fontSize: "14px",
                                      boxSizing: "border-box",
                                    }}
                                  />

                                  <input
                                    type="time"
                                    name="endTime"
                                    defaultValue={formatTimeOnly(slot.end_time)}
                                    required
                                    style={{
                                      minHeight: "42px",
                                      padding: "8px 10px",
                                      borderRadius: "12px",
                                      border: "1px solid #d9c7b4",
                                      background: "#fffdfa",
                                      color: "#2d2117",
                                      fontSize: "14px",
                                      boxSizing: "border-box",
                                    }}
                                  />

                                  <select
                                    name="status"
                                    defaultValue={slot.status}
                                    style={{
                                      minHeight: "42px",
                                      padding: "8px 10px",
                                      borderRadius: "12px",
                                      border: "1px solid #d9c7b4",
                                      background: "#fffdfa",
                                      color: "#2d2117",
                                      fontSize: "14px",
                                      boxSizing: "border-box",
                                    }}
                                  >
                                    <option value="available">
                                      {adminText.slotStatusAvailable[lang]}
                                    </option>
                                    <option value="booked">
                                      {adminText.slotStatusBooked[lang]}
                                    </option>
                                    <option value="blocked">
                                      {adminText.slotStatusBlocked[lang]}
                                    </option>
                                  </select>

                                  <input
                                    type="text"
                                    name="note"
                                    defaultValue={slot.note || ""}
                                    placeholder={adminText.slotNotePlaceholder[lang]}
                                    style={{
                                      minHeight: "42px",
                                      padding: "8px 10px",
                                      borderRadius: "12px",
                                      border: "1px solid #d9c7b4",
                                      background: "#fffdfa",
                                      color: "#2d2117",
                                      fontSize: "14px",
                                      boxSizing: "border-box",
                                    }}
                                  />
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    gap: "8px",
                                    flexWrap: "wrap",
                                    justifyContent:
                                      lang === "ar" ? "flex-end" : "flex-start",
                                  }}
                                >
                                  <button
                                    type="submit"
                                    style={{
                                      minHeight: "40px",
                                      padding: "8px 14px",
                                      borderRadius: "12px",
                                      border: "1px solid #2a1d13",
                                      background: "#2a1d13",
                                      color: "#fff",
                                      fontSize: "14px",
                                      fontWeight: 700,
                                      cursor: "pointer",
                                    }}
                                  >
                                    {adminText.slotUpdate[lang]}
                                  </button>

                                  <button
                                    type="submit"
                                    formAction={removeBookingSlot}
                                    style={{
                                      minHeight: "40px",
                                      padding: "8px 14px",
                                      borderRadius: "12px",
                                      border: "1px solid #b53b32",
                                      background: "#fff4f3",
                                      color: "#b53b32",
                                      fontSize: "14px",
                                      fontWeight: 700,
                                      cursor: "pointer",
                                    }}
                                  >
                                    {adminText.slotRemove[lang]}
                                  </button>
                                </div>
                              </form>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div
              style={{
                background: "#fff4f3",
                border: "1px solid #efc9c5",
                borderRadius: "16px",
                padding: "16px",
                color: "#9f3e35",
                fontSize: "14px",
                lineHeight: 1.8,
              }}
            >
              {adminText.slotsUnavailable[lang]}
            </div>
          )}
        </section>

        {!appointmentsTableReady ? (
          <div
            style={{
              background: "#fff4f3",
              border: "1px solid #efc9c5",
              borderRadius: "18px",
              padding: "16px 18px",
              color: "#9f3e35",
              fontSize: "14px",
              lineHeight: 1.8,
              marginBottom: "22px",
            }}
          >
            {adminText.appointmentsUnavailable[lang]}
          </div>
        ) : null}

        <div
          style={{
            marginBottom: "18px",
            fontSize: "15px",
            fontWeight: 700,
            color: "#4b3a2a",
          }}
        >
          {adminText.totalCount[lang]}: {entries.length}
        </div>

        {entries.length === 0 ? (
          <div
            style={{
              background: "#fff",
              border: "1px dashed #d9c7b4",
              borderRadius: "18px",
              padding: "24px",
              color: "#6b5a49",
            }}
          >
            {adminText.empty[lang]}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            {entries.map((entry) => {
              const customer = entry.customer || {};
              const statusStyles = getStatusStyles(entry.status);
              const isAppointment = entry.source === "appointment";

              return (
                <div
                  key={`${entry.source}-${entry.id}`}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e3d5c5",
                    borderRadius: "20px",
                    padding: "22px",
                    boxShadow: "0 8px 24px rgba(45, 28, 14, 0.04)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "16px",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      marginBottom: "18px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#8a6c4d",
                          fontWeight: 700,
                          marginBottom: "8px",
                        }}
                      >
                        {adminText.itemType[lang]}:{" "}
                        {getItemTypeLabel(entry.source, lang)}
                      </div>

                      <div
                        style={{
                          fontSize: "18px",
                          color: "#8a6c4d",
                          fontWeight: 700,
                          marginBottom: "6px",
                        }}
                      >
                        {isAppointment
                          ? adminText.appointmentNumber[lang]
                          : adminText.requestNumber[lang]}
                        : {getSafeText(customer.requestId || entry.id, lang)}
                      </div>

                      <div
                        style={{
                          fontSize: "30px",
                          fontWeight: 800,
                          lineHeight: 1.2,
                          color: "#1f1711",
                          marginBottom: "8px",
                        }}
                      >
                        {customer.fullName?.trim()
                          ? customer.fullName
                          : adminText.unnamed[lang]}
                      </div>

                      <div
                        style={{
                          fontSize: "13px",
                          color: "#7a6754",
                          lineHeight: 1.7,
                        }}
                      >
                        {adminText.receivedAt[lang]}:{" "}
                        {formatDate(entry.created_at, lang)}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: lang === "ar" ? "flex-end" : "flex-start",
                        gap: "10px",
                        minWidth: "320px",
                        width: "100%",
                        maxWidth: "520px",
                      }}
                    >
                      <div
                        style={{
                          padding: "8px 12px",
                          borderRadius: "999px",
                          fontSize: "13px",
                          fontWeight: 700,
                          ...statusStyles,
                        }}
                      >
                        {adminText.currentStatus[lang]}:{" "}
                        {getStatusLabel(entry.status, lang)}
                      </div>

                      <form
                        action={updateEntryStatus}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          width: "100%",
                        }}
                      >
                        <input type="hidden" name="entryId" value={entry.id} />
                        <input type="hidden" name="source" value={entry.source} />

                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                            justifyContent:
                              lang === "ar" ? "flex-end" : "flex-start",
                          }}
                        >
                          <select
                            name="status"
                            defaultValue={entry.status || "new"}
                            style={{
                              minHeight: "40px",
                              padding: "8px 12px",
                              borderRadius: "12px",
                              border: "1px solid #d9c7b4",
                              background: "#fffdfa",
                              color: "#2d2117",
                              fontSize: "14px",
                              minWidth: "150px",
                            }}
                          >
                            {isAppointment ? (
                              <>
                                <option value="new">
                                  {getStatusLabel("new", lang)}
                                </option>
                                <option value="confirmed">
                                  {getStatusLabel("confirmed", lang)}
                                </option>
                                <option value="in_progress">
                                  {getStatusLabel("in_progress", lang)}
                                </option>
                                <option value="done">
                                  {getStatusLabel("done", lang)}
                                </option>
                                <option value="cancelled">
                                  {getStatusLabel("cancelled", lang)}
                                </option>
                                <option value="rejected">
                                  {getStatusLabel("rejected", lang)}
                                </option>
                              </>
                            ) : (
                              <>
                                <option value="new">
                                  {getStatusLabel("new", lang)}
                                </option>
                                <option value="in_progress">
                                  {getStatusLabel("in_progress", lang)}
                                </option>
                                <option value="done">
                                  {getStatusLabel("done", lang)}
                                </option>
                              </>
                            )}
                          </select>

                          <button
                            type="submit"
                            style={{
                              minHeight: "40px",
                              padding: "8px 14px",
                              borderRadius: "12px",
                              border: "1px solid #2a1d13",
                              background: "#2a1d13",
                              color: "#fff",
                              fontSize: "14px",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            {adminText.updateStatus[lang]}
                          </button>
                        </div>

                        <textarea
                          name="adminComment"
                          placeholder={adminText.adminCommentPlaceholder[lang]}
                          defaultValue=""
                          style={{
                            width: "100%",
                            minHeight: "92px",
                            padding: "12px 14px",
                            borderRadius: "14px",
                            border: "1px solid #d9c7b4",
                            background: "#fffdfa",
                            color: "#2d2117",
                            fontSize: "14px",
                            lineHeight: 1.8,
                            resize: "vertical",
                            boxSizing: "border-box",
                          }}
                        />

                        <div
                          style={{
                            fontSize: "12px",
                            lineHeight: 1.7,
                            color: "#7a6754",
                          }}
                        >
                          {adminText.sendCommentHint[lang]}
                        </div>
                      </form>

                      <form
                        action={deleteEntry}
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          alignItems: lang === "ar" ? "flex-end" : "flex-start",
                        }}
                      >
                        <input type="hidden" name="entryId" value={entry.id} />
                        <input type="hidden" name="source" value={entry.source} />

                        <button
                          type="submit"
                          style={{
                            minHeight: "40px",
                            padding: "8px 14px",
                            borderRadius: "12px",
                            border: "1px solid #b53b32",
                            background: "#fff4f3",
                            color: "#b53b32",
                            fontSize: "14px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {adminText.deleteRequest[lang]}
                        </button>

                        <div
                          style={{
                            fontSize: "12px",
                            lineHeight: 1.7,
                            color: "#8a625e",
                          }}
                        >
                          {adminText.deleteWarning[lang]}
                        </div>
                      </form>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                      gap: "12px",
                      marginBottom: "14px",
                    }}
                  >
                    <div
                      style={{
                        background: "#fcfaf7",
                        border: "1px solid #eee2d3",
                        borderRadius: "14px",
                        padding: "14px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 800,
                          marginBottom: "8px",
                          color: "#2f2419",
                        }}
                      >
                        {adminText.contactData[lang]}
                      </div>

                      <div
                        style={{
                          lineHeight: 1.9,
                          fontSize: "14px",
                          color: "#4a3929",
                        }}
                      >
                        <div>
                          {adminText.email[lang]}: {getSafeText(customer.email, lang)}
                        </div>
                        <div>
                          {adminText.phone[lang]}: {getSafeText(customer.phone, lang)}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        background: "#fcfaf7",
                        border: "1px solid #eee2d3",
                        borderRadius: "14px",
                        padding: "14px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 800,
                          marginBottom: "8px",
                          color: "#2f2419",
                        }}
                      >
                        {adminText.address[lang]}
                      </div>

                      <div
                        style={{
                          lineHeight: 1.9,
                          fontSize: "14px",
                          color: "#4a3929",
                        }}
                      >
                        <div>
                          {adminText.street[lang]}: {getSafeText(customer.street, lang)}
                        </div>
                        <div>
                          {adminText.houseNumber[lang]}:{" "}
                          {getSafeText(customer.houseNumber, lang)}
                        </div>
                        <div>
                          {adminText.postalCode[lang]}:{" "}
                          {getSafeText(customer.postalCode, lang)}
                        </div>
                        <div>
                          {adminText.city[lang]}: {getSafeText(customer.city, lang)}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        background: "#fcfaf7",
                        border: "1px solid #eee2d3",
                        borderRadius: "14px",
                        padding: "14px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 800,
                          marginBottom: "8px",
                          color: "#2f2419",
                        }}
                      >
                        {adminText.additionalInfo[lang]}
                      </div>

                      <div
                        style={{
                          lineHeight: 1.9,
                          fontSize: "14px",
                          color: "#4a3929",
                        }}
                      >
                        <div>
                          {adminText.channel[lang]}: {getSafeText(entry.channel, lang)}
                        </div>
                        <div>
                          {adminText.subject[lang]}: {getSafeText(customer.subject, lang)}
                        </div>
                        <div>
                          {adminText.date[lang]}: {formatDate(entry.created_at, lang)}
                        </div>

                        {isAppointment ? (
                          <>
                            <div>
                              {adminText.appointmentDate[lang]}:{" "}
                              {formatDateOnly(entry.appointment?.date, lang)}
                            </div>
                            <div>
                              {adminText.appointmentTime[lang]}:{" "}
                              {getSafeText(entry.appointment?.time, lang)}
                            </div>
                            <div>
                              {adminText.appointmentService[lang]}:{" "}
                              {getAppointmentTypeLabel(entry.appointment?.type, lang)}
                            </div>
                            <div>
                              {adminText.appointmentMode[lang]}:{" "}
                              {getAppointmentModeLabel(entry.appointment?.mode, lang)}
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#fcfaf7",
                      border: "1px solid #eee2d3",
                      borderRadius: "14px",
                      padding: "14px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 800,
                        marginBottom: "8px",
                        color: "#2f2419",
                      }}
                    >
                      {adminText.message[lang]}
                    </div>

                    <div
                      style={{
                        fontSize: "14px",
                        lineHeight: 1.95,
                        color: "#4a3929",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {getSafeText(customer.message, lang)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}