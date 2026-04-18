import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import type { CSSProperties } from "react";
import {
  isAdminAuthenticated,
  clearAdminSession,
} from "@/lib/admin-auth";

import type {
  RequestLanguage,
  SearchParams,
  RequestCustomer,
  AdminEntryStatus,
  AppointmentType,
  AppointmentMode,
  AdminEntrySource,
  BookingSlotStatus,
  AdminOfficeId,
  MainOfficeId,
  RequestRow,
  RawRequestRow,
  AppointmentRow,
  RawAppointmentRow,
  AdminEntry,
  AvailableBookingDay,
  RawAvailableBookingDay,
  BookingSlot,
  RawBookingSlot,
  CustomerRow,
  RawCustomerRow,
  CustomerDataRow,
  OfficeDefinition,
  MainOfficeDefinition,
} from "./_utils/admin-types";
import {
  normalizeLanguage,
  normalizeRequestStatus,
  normalizeAppointmentStatus,
  normalizeBookingSlotStatus,
  normalizeAdminEntryStatus,
  normalizeAppointmentType,
  normalizeAppointmentMode,
  normalizeOffice,
  getSafeTrimmedString,
  normalizeTimeInput,
} from "./_utils/admin-helpers";

const AVAILABLE_DAYS_TABLE = "booking_available_days";
const BOOKING_SLOTS_TABLE = "booking_slots";
const CUSTOMERS_TABLE = "customers";

type AdminNoticeTone = "success" | "error" | "info";

type AdminNoticeKey =
  | "day_added"
  | "day_removed"
  | "slot_added"
  | "slot_updated"
  | "slot_removed"
  | "duplicate_day"
  | "duplicate_slot"
  | "invalid_day"
  | "invalid_slot"
  | "missing_day"
  | "missing_slot"
  | "selection_required"
  | "status_updated"
  | "entry_deleted"
  | "customers_deleted"
  | "invalid_entry";

type ScheduleDayRow = {
  id: string;
  date: string;
  note?: string;
  slotCount: number;
  availableSlotCount: number;
};

type ScheduleSlotRow = {
  id: string;
  date: string;
  day: string;
  month: string;
  year: string;
  weekday: string;
  from: string;
  to: string;
  status: BookingSlotStatus;
  note?: string;
};

const adminText = {
  pageTitle: {
    ar: "لوحة الإدارة",
    de: "Admin-Dashboard",
    en: "Admin Dashboard",
  },
  pageSubtitle: {
    ar: "إدارة مرتبة وواضحة للبحث والطلبات والمواعيد والداتا.",
    de: "Eine klare und aufgeräumte Verwaltung für Suche, Anfragen, Termine und Daten.",
    en: "A clean and clear admin area for search, requests, appointments, and data.",
  },
  searchOffice: {
    ar: "منطقة البحث",
    de: "Suchbereich",
    en: "Search area",
  },
  requestsOffice: {
    ar: "مكتب الطلبات",
    de: "Anfragen",
    en: "Requests office",
  },
  appointmentsOffice: {
    ar: "مكتب المواعيد",
    de: "Termine",
    en: "Appointments office",
  },
  dataOffice: {
    ar: "الداتا",
    de: "Daten",
    en: "Data",
  },
  searchOfficeDescription: {
    ar: "ابحث عن أي شيء داخل الإدارة كلها.",
    de: "Suche nach allem innerhalb der gesamten Verwaltung.",
    en: "Search for anything across the whole admin area.",
  },
  requestsOfficeDescription: {
    ar: "كل ما يتعلق بالطلبات في مكان واحد.",
    de: "Alles rund um Anfragen an einem Ort.",
    en: "Everything related to requests in one place.",
  },
  appointmentsOfficeDescription: {
    ar: "كل ما يتعلق بالمواعيد والأيام والساعات في مكان واحد.",
    de: "Alles rund um Termine, Tage und Zeiten an einem Ort.",
    en: "Everything related to appointments, days, and slots in one place.",
  },
  dataOfficeDescription: {
    ar: "جدول داتا العملاء بشكل واضح ومريح.",
    de: "Klare und übersichtliche Kundendaten-Tabelle.",
    en: "A clear and comfortable customer data table.",
  },
  searchTitle: {
    ar: "بحث شامل",
    de: "Globale Suche",
    en: "Global search",
  },
  searchPlaceholder: {
    ar: "ابحث بأي كلمة أو حرف أو رقم",
    de: "Suche mit Wort, Buchstabe oder Nummer",
    en: "Search by any word, letter, or number",
  },
  searchHint: {
    ar: "يبحث داخل الطلبات والمواعيد وداتا العملاء والأيام والفترات.",
    de: "Sucht in Anfragen, Terminen, Kundendaten, Tagen und Zeitfenstern.",
    en: "Searches requests, appointments, customer data, days, and slots.",
  },
  searchButton: {
    ar: "بحث",
    de: "Suchen",
    en: "Search",
  },
  resetButton: {
    ar: "مسح",
    de: "Zurücksetzen",
    en: "Reset",
  },
  sectionRequestsTitle: {
    ar: "الطلبات",
    de: "Anfragen",
    en: "Requests",
  },
  sectionAppointmentsTitle: {
    ar: "المواعيد",
    de: "Termine",
    en: "Appointments",
  },
  sectionDataTitle: {
    ar: "داتا العملاء",
    de: "Kundendaten",
    en: "Customer data",
  },
  sectionRequestsSubtitle: {
    ar: "الطلبات الجديدة وقيد المعالجة والمكتملة مع التحكم بالحالة.",
    de: "Neue, laufende und abgeschlossene Anfragen mit Statusverwaltung.",
    en: "New, in-progress, and completed requests with status control.",
  },
  sectionAppointmentsSubtitle: {
    ar: "الأيام والفترات المحفوظة مع عرض جدولي واضح وإدارة نظيفة.",
    de: "Gespeicherte Tage und Zeitfenster mit klarer Tabellenansicht und sauberer Verwaltung.",
    en: "Saved days and slots with a clear table view and clean management.",
  },
  sectionDataSubtitle: {
    ar: "جدول العملاء مع تحديد وحذف منظم.",
    de: "Kundentabelle mit strukturierter Auswahl und Löschung.",
    en: "Customer table with structured selection and deletion.",
  },
  empty: {
    ar: "لا توجد عناصر في هذا القسم حاليًا.",
    de: "In diesem Bereich sind aktuell keine Einträge vorhanden.",
    en: "There are currently no entries in this section.",
  },
  requestsNew: {
    ar: "طلبات جديدة",
    de: "Neue Anfragen",
    en: "New requests",
  },
  requestsInProgress: {
    ar: "طلبات قيد المعالجة",
    de: "Anfragen in Bearbeitung",
    en: "Requests in progress",
  },
  requestsDone: {
    ar: "طلبات مكتملة",
    de: "Abgeschlossene Anfragen",
    en: "Completed requests",
  },
  appointmentsNew: {
    ar: "مواعيد جديدة",
    de: "Neue Termine",
    en: "New appointments",
  },
  appointmentsInProgress: {
    ar: "مواعيد قيد المعالجة",
    de: "Termine in Bearbeitung",
    en: "Appointments in progress",
  },
  appointmentsDone: {
    ar: "مواعيد مكتملة",
    de: "Abgeschlossene Termine",
    en: "Completed appointments",
  },
  appointmentsCancelled: {
    ar: "مواعيد ملغية",
    de: "Stornierte Termine",
    en: "Cancelled appointments",
  },
  appointmentsRejected: {
    ar: "مواعيد مرفوضة",
    de: "Abgelehnte Termine",
    en: "Rejected appointments",
  },
  scheduleDaysTitle: {
    ar: "الأيام المتاحة",
    de: "Verfügbare Tage",
    en: "Available days",
  },
  scheduleSlotsTitle: {
    ar: "الفترات الزمنية",
    de: "Zeitfenster",
    en: "Time slots",
  },
  addDay: {
    ar: "إضافة يوم",
    de: "Tag hinzufügen",
    en: "Add day",
  },
  removeDay: {
    ar: "حذف اليوم",
    de: "Tag löschen",
    en: "Remove day",
  },
  addSlot: {
    ar: "إضافة فترة",
    de: "Zeitfenster hinzufügen",
    en: "Add slot",
  },
  saveSlot: {
    ar: "حفظ",
    de: "Speichern",
    en: "Save",
  },
  removeSlot: {
    ar: "حذف",
    de: "Löschen",
    en: "Delete",
  },
  selectSavedDay: {
    ar: "اختر يومًا محفوظًا",
    de: "Gespeicherten Tag wählen",
    en: "Choose a saved day",
  },
  internalNote: {
    ar: "ملاحظة داخلية",
    de: "Interne Notiz",
    en: "Internal note",
  },
  slotNote: {
    ar: "ملاحظة الفترة",
    de: "Notiz zum Zeitfenster",
    en: "Slot note",
  },
  customerNumber: {
    ar: "رقم العميل",
    de: "Kundennummer",
    en: "Customer number",
  },
  select: {
    ar: "تحديد",
    de: "Auswahl",
    en: "Select",
  },
  index: {
    ar: "م",
    de: "Nr.",
    en: "#",
  },
  firstName: {
    ar: "الاسم",
    de: "Vorname",
    en: "First name",
  },
  lastName: {
    ar: "العائلة",
    de: "Nachname",
    en: "Surname",
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
  type: {
    ar: "النوع",
    de: "Typ",
    en: "Type",
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
  status: {
    ar: "الحالة",
    de: "Status",
    en: "Status",
  },
  receivedAt: {
    ar: "وقت الوصول",
    de: "Eingegangen am",
    en: "Received at",
  },
  message: {
    ar: "الرسالة",
    de: "Nachricht",
    en: "Message",
  },
  contactData: {
    ar: "بيانات التواصل",
    de: "Kontaktdaten",
    en: "Contact details",
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
  adminCommentPlaceholder: {
    ar: "تعليق داخلي أو رسالة للعميل",
    de: "Interner Kommentar oder Nachricht an den Kunden",
    en: "Internal comment or message to the customer",
  },
  sendCommentHint: {
    ar: "إذا كان البريد الإلكتروني متوفرًا فسيتم إرسال التعليق مع تحديث الحالة.",
    de: "Wenn eine E-Mail vorhanden ist, wird der Kommentar mit dem Status-Update gesendet.",
    en: "If an email is available, the comment will be sent with the status update.",
  },
  updateStatus: {
    ar: "تحديث",
    de: "Aktualisieren",
    en: "Update",
  },
  deleteEntry: {
    ar: "حذف",
    de: "Löschen",
    en: "Delete",
  },
  deleteSelected: {
    ar: "حذف المحدد",
    de: "Auswahl löschen",
    en: "Delete selected",
  },
  deleteWarning: {
    ar: "الحذف نهائي من قاعدة البيانات.",
    de: "Das Löschen ist endgültig aus der Datenbank.",
    en: "Deletion is permanent from the database.",
  },
  dateDay: {
    ar: "اليوم",
    de: "Tag",
    en: "Day",
  },
  dateMonth: {
    ar: "الشهر",
    de: "Monat",
    en: "Month",
  },
  dateYear: {
    ar: "السنة",
    de: "Jahr",
    en: "Year",
  },
  dateWeekday: {
    ar: "اسم اليوم",
    de: "Wochentag",
    en: "Weekday",
  },
  from: {
    ar: "من",
    de: "Von",
    en: "From",
  },
  to: {
    ar: "إلى",
    de: "Bis",
    en: "To",
  },
  note: {
    ar: "ملاحظة",
    de: "Notiz",
    en: "Note",
  },
  actions: {
    ar: "الإجراءات",
    de: "Aktionen",
    en: "Actions",
  },
  rowTypeDay: {
    ar: "يوم",
    de: "Tag",
    en: "Day",
  },
  rowTypeSlot: {
    ar: "فترة",
    de: "Zeitfenster",
    en: "Slot",
  },
  rowTypeRequest: {
    ar: "طلب",
    de: "Anfrage",
    en: "Request",
  },
  rowTypeAppointment: {
    ar: "موعد",
    de: "Termin",
    en: "Appointment",
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
  dash: {
    ar: "—",
    de: "—",
    en: "—",
  },
  unnamed: {
    ar: "بدون اسم",
    de: "Ohne Namen",
    en: "No name",
  },
  appointmentsUnavailable: {
    ar: "جدول المواعيد غير موجود حاليًا في قاعدة البيانات.",
    de: "Die Termintabelle ist derzeit nicht in der Datenbank vorhanden.",
    en: "The appointments table is currently missing in the database.",
  },
  availableDaysUnavailable: {
    ar: "تعذر تحميل الأيام المتاحة.",
    de: "Verfügbare Tage konnten nicht geladen werden.",
    en: "Available days could not be loaded.",
  },
  slotsUnavailable: {
    ar: "تعذر تحميل الفترات الزمنية.",
    de: "Zeitfenster konnten nicht geladen werden.",
    en: "Time slots could not be loaded.",
  },
  slotSavedDayMissing: {
    ar: "أضف يومًا متاحًا أولًا قبل إضافة الفترات.",
    de: "Füge zuerst einen verfügbaren Tag hinzu, bevor du Zeitfenster anlegst.",
    en: "Add an available day first before adding slots.",
  },
  noticeDayAdded: {
    ar: "تمت إضافة اليوم بنجاح.",
    de: "Der Tag wurde erfolgreich hinzugefügt.",
    en: "The day was added successfully.",
  },
  noticeDayRemoved: {
    ar: "تم حذف اليوم بنجاح.",
    de: "Der Tag wurde erfolgreich gelöscht.",
    en: "The day was removed successfully.",
  },
  noticeSlotAdded: {
    ar: "تمت إضافة الفترة بنجاح.",
    de: "Das Zeitfenster wurde erfolgreich hinzugefügt.",
    en: "The slot was added successfully.",
  },
  noticeSlotUpdated: {
    ar: "تم تحديث الفترة بنجاح.",
    de: "Das Zeitfenster wurde erfolgreich aktualisiert.",
    en: "The slot was updated successfully.",
  },
  noticeSlotRemoved: {
    ar: "تم حذف الفترة بنجاح.",
    de: "Das Zeitfenster wurde erfolgreich gelöscht.",
    en: "The slot was removed successfully.",
  },
  noticeDuplicateDay: {
    ar: "هذا اليوم موجود بالفعل، اختر يومًا آخر.",
    de: "Dieser Tag existiert bereits. Bitte wähle einen anderen Tag.",
    en: "This day already exists. Please choose another day.",
  },
  noticeDuplicateSlot: {
    ar: "هذه الفترة موجودة بالفعل أو تتعارض مع فترة أخرى، اختر وقتًا مختلفًا.",
    de: "Dieses Zeitfenster existiert bereits oder überschneidet sich mit einem anderen. Bitte wähle eine andere Zeit.",
    en: "This slot already exists or overlaps with another slot. Please choose a different time.",
  },
  noticeInvalidDay: {
    ar: "التاريخ غير صحيح.",
    de: "Das Datum ist ungültig.",
    en: "The date is invalid.",
  },
  noticeInvalidSlot: {
    ar: "بيانات الفترة غير صحيحة.",
    de: "Die Zeitfensterdaten sind ungültig.",
    en: "The slot data is invalid.",
  },
  noticeMissingDay: {
    ar: "اليوم المطلوب غير موجود.",
    de: "Der angeforderte Tag wurde nicht gefunden.",
    en: "The requested day was not found.",
  },
  noticeMissingSlot: {
    ar: "الفترة المطلوبة غير موجودة.",
    de: "Das angeforderte Zeitfenster wurde nicht gefunden.",
    en: "The requested slot was not found.",
  },
  noticeSelectionRequired: {
    ar: "حدد عنصرًا واحدًا على الأقل.",
    de: "Bitte wähle mindestens einen Eintrag aus.",
    en: "Please select at least one item.",
  },
  noticeStatusUpdated: {
    ar: "تم تحديث الحالة بنجاح.",
    de: "Der Status wurde erfolgreich aktualisiert.",
    en: "The status was updated successfully.",
  },
  noticeEntryDeleted: {
    ar: "تم حذف العنصر بنجاح.",
    de: "Der Eintrag wurde erfolgreich gelöscht.",
    en: "The entry was deleted successfully.",
  },
  noticeCustomersDeleted: {
    ar: "تم حذف العملاء المحددين بنجاح.",
    de: "Die ausgewählten Kunden wurden erfolgreich gelöscht.",
    en: "The selected customers were deleted successfully.",
  },
  noticeInvalidEntry: {
    ar: "العنصر المطلوب غير صالح.",
    de: "Der angeforderte Eintrag ist ungültig.",
    en: "The requested entry is invalid.",
  },
} as const;

function getDir(lang: RequestLanguage): "rtl" | "ltr" {
  return lang === "ar" ? "rtl" : "ltr";
}

function getMainOfficeBySubOffice(officeId: AdminOfficeId): MainOfficeId {
  if (
    officeId === "appointments_new" ||
    officeId === "appointments_in_progress" ||
    officeId === "appointments_done" ||
    officeId === "appointments_cancelled" ||
    officeId === "appointments_rejected" ||
    officeId === "schedule_settings"
  ) {
    return "appointments";
  }

  if (officeId === "customer_data") {
    return "data";
  }

  return "requests";
}

function getMainOfficeDefinitions(): MainOfficeDefinition[] {
  return [
    {
      id: "requests",
      label: adminText.requestsOffice,
      description: adminText.requestsOfficeDescription,
    },
    {
      id: "appointments",
      label: adminText.appointmentsOffice,
      description: adminText.appointmentsOfficeDescription,
    },
    {
      id: "data",
      label: adminText.dataOffice,
      description: adminText.dataOfficeDescription,
    },
  ];
}

function getOfficeDefinitions(
  appointmentsTableReady: boolean
): OfficeDefinition[] {
  const offices: OfficeDefinition[] = [
    { id: "requests_new", label: adminText.requestsNew },
    { id: "requests_in_progress", label: adminText.requestsInProgress },
    { id: "requests_done", label: adminText.requestsDone },
    { id: "appointments_new", label: adminText.appointmentsNew },
    { id: "appointments_in_progress", label: adminText.appointmentsInProgress },
    { id: "appointments_done", label: adminText.appointmentsDone },
    { id: "appointments_cancelled", label: adminText.appointmentsCancelled },
    { id: "appointments_rejected", label: adminText.appointmentsRejected },
    { id: "schedule_settings", label: adminText.sectionAppointmentsTitle },
    { id: "request_actions", label: adminText.sectionRequestsTitle },
    { id: "customer_data", label: adminText.sectionDataTitle },
  ];

  return offices.filter((office) => {
    if (
      !appointmentsTableReady &&
      (office.id === "appointments_new" ||
        office.id === "appointments_in_progress" ||
        office.id === "appointments_done" ||
        office.id === "appointments_cancelled" ||
        office.id === "appointments_rejected")
    ) {
      return false;
    }

    return true;
  });
}

function getMainOfficeTarget(
  mainOfficeId: MainOfficeId,
  appointmentsTableReady: boolean
): AdminOfficeId {
  if (mainOfficeId === "appointments") {
    return appointmentsTableReady ? "appointments_new" : "schedule_settings";
  }

  if (mainOfficeId === "data") {
    return "customer_data";
  }

  return "requests_new";
}

function formatTimeOnly(value: string | undefined) {
  if (!value) return "—";

  const normalized = value.trim();

  if (/^\d{2}:\d{2}:\d{2}$/.test(normalized)) {
    return normalized.slice(0, 5);
  }

  if (/^\d{2}:\d{2}$/.test(normalized)) {
    return normalized;
  }

  return normalized;
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

function getDateParts(value: string | undefined, lang: RequestLanguage) {
  if (!value) {
    return {
      day: adminText.dash[lang],
      month: adminText.dash[lang],
      year: adminText.dash[lang],
      weekday: adminText.dash[lang],
    };
  }

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return {
      day: adminText.dash[lang],
      month: adminText.dash[lang],
      year: adminText.dash[lang],
      weekday: adminText.dash[lang],
    };
  }

  const locale = lang === "ar" ? "ar-EG" : lang === "de" ? "de-DE" : "en-GB";

  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: String(date.getMonth() + 1).padStart(2, "0"),
    year: String(date.getFullYear()),
    weekday: date.toLocaleDateString(locale, { weekday: "long" }),
  };
}

function getSafeText(value: string | undefined, lang: RequestLanguage) {
  return value && value.trim() ? value : adminText.dash[lang];
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
  if (status === "booked") return adminText.slotStatusBooked[lang];
  if (status === "blocked") return adminText.slotStatusBlocked[lang];
  return adminText.slotStatusAvailable[lang];
}

function getSlotStatusStyles(status?: BookingSlotStatus): CSSProperties {
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
    background: "#f7f2ea",
    border: "1px solid #d7c6b2",
    color: "#3d2d1f",
  };
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
      requestId: id,
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
      subject: undefined,
      message: getSafeTrimmedString(raw.notes),
    },
  };
}

function normalizeAvailableBookingDay(
  raw: RawAvailableBookingDay
): AvailableBookingDay | null {
  const id = getSafeTrimmedString(raw.id);
  const date = getSafeTrimmedString(raw.date);

  if (!id || !date) return null;

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

function normalizeCustomerRow(raw: RawCustomerRow): CustomerRow | null {
  const id = getSafeTrimmedString(raw.id);
  if (!id) return null;

  return {
    id,
    customer_id:
      getSafeTrimmedString(raw.customer_id) ||
      getSafeTrimmedString(raw.customerId) ||
      undefined,
    customer_code:
      getSafeTrimmedString(raw.customer_code) ||
      getSafeTrimmedString(raw.customerCode) ||
      undefined,
    first_name:
      getSafeTrimmedString(raw.first_name) ||
      getSafeTrimmedString(raw.firstName) ||
      undefined,
    last_name:
      getSafeTrimmedString(raw.last_name) ||
      getSafeTrimmedString(raw.lastName) ||
      undefined,
    full_name:
      getSafeTrimmedString(raw.full_name) ||
      getSafeTrimmedString(raw.fullName) ||
      undefined,
    email: getSafeTrimmedString(raw.email) || undefined,
    phone: getSafeTrimmedString(raw.phone) || undefined,
    street: getSafeTrimmedString(raw.street) || undefined,
    house_number:
      getSafeTrimmedString(raw.house_number) ||
      getSafeTrimmedString(raw.houseNumber) ||
      undefined,
    postal_code:
      getSafeTrimmedString(raw.postal_code) ||
      getSafeTrimmedString(raw.postalCode) ||
      undefined,
    city: getSafeTrimmedString(raw.city) || undefined,
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

function mapAppointmentToAdminEntry(
  appointment: AppointmentRow
): AdminEntry {
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
      subject: undefined,
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

function splitFullName(fullName?: string) {
  const safeName = getSafeTrimmedString(fullName);

  if (!safeName) {
    return { firstName: "", lastName: "" };
  }

  const parts = safeName.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }

  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts[parts.length - 1],
  };
}

function buildCustomerRowAddress(customer: CustomerRow) {
  const parts = [
    getSafeTrimmedString(customer.street),
    getSafeTrimmedString(customer.house_number),
    getSafeTrimmedString(customer.postal_code),
    getSafeTrimmedString(customer.city),
  ].filter(Boolean);

  return parts.join(", ");
}

function buildCustomerDataRowsFromCustomers(
  customers: CustomerRow[]
): CustomerDataRow[] {
  return customers
    .slice()
    .sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    })
    .map((customer, index) => {
      const derivedName =
        getSafeTrimmedString(customer.full_name) ||
        `${getSafeTrimmedString(customer.first_name)} ${getSafeTrimmedString(
          customer.last_name
        )}`.trim();

      const { firstName, lastName } = derivedName
        ? splitFullName(derivedName)
        : {
            firstName: getSafeTrimmedString(customer.first_name),
            lastName: getSafeTrimmedString(customer.last_name),
          };

      return {
        index: index + 1,
        id: customer.id,
        customerNumber:
          getSafeTrimmedString(customer.customer_code) ||
          getSafeTrimmedString(customer.customer_id) ||
          getSafeTrimmedString(customer.id),
        firstName,
        lastName,
        email: customer.email,
        phone: customer.phone,
        address: buildCustomerRowAddress(customer),
      };
    });
}

function matchesSearchValue(value: string, searchTerm: string) {
  if (!searchTerm) return true;
  return value.toLowerCase().includes(searchTerm.toLowerCase());
}

function entryMatchesSearch(entry: AdminEntry, searchTerm: string) {
  if (!searchTerm) return true;

  const customer = entry.customer || {};

  const haystack = [
    entry.id,
    entry.source,
    entry.status,
    entry.channel,
    entry.created_at,
    customer.requestId,
    customer.fullName,
    customer.email,
    customer.phone,
    customer.street,
    customer.houseNumber,
    customer.postalCode,
    customer.city,
    customer.subject,
    customer.message,
    entry.appointment?.date,
    entry.appointment?.time,
    entry.appointment?.type,
    entry.appointment?.mode,
  ]
    .map((item) => getSafeTrimmedString(item))
    .join(" ")
    .toLowerCase();

  return haystack.includes(searchTerm.toLowerCase());
}

function customerRowMatchesSearch(
  row: CustomerDataRow,
  searchTerm: string
) {
  if (!searchTerm) return true;

  const haystack = [
    row.customerNumber,
    row.firstName,
    row.lastName,
    row.email,
    row.phone,
    row.address,
  ]
    .map((item) => getSafeTrimmedString(item))
    .join(" ")
    .toLowerCase();

  return haystack.includes(searchTerm.toLowerCase());
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

  const contentType = response.headers.get("content-type") || "";
  const rawText = await response.text();

  if (!rawText.trim()) {
    return null as T;
  }

  if (!contentType.toLowerCase().includes("application/json")) {
    return rawText as T;
  }

  return JSON.parse(rawText) as T;
}

function isMissingTableError(error: unknown, tableName: string) {
  if (!(error instanceof Error)) return false;

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

async function getCustomers(): Promise<{
  customers: CustomerRow[];
  tableReady: boolean;
}> {
  try {
    const rows = await supabaseTableFetch<RawCustomerRow[]>({
      path: `${CUSTOMERS_TABLE}?select=*&order=created_at.desc`,
    });

    return {
      customers: rows
        .map(normalizeCustomerRow)
        .filter((row): row is CustomerRow => Boolean(row)),
      tableReady: true,
    };
  } catch (error) {
    if (isMissingTableError(error, CUSTOMERS_TABLE)) {
      return {
        customers: [],
        tableReady: false,
      };
    }

    return {
      customers: [],
      tableReady: false,
    };
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

async function getAvailableBookingDayByDate(
  date: string
): Promise<AvailableBookingDay | null> {
  const rows = await supabaseTableFetch<RawAvailableBookingDay[]>({
    path: `${AVAILABLE_DAYS_TABLE}?select=*&date=eq.${encodeURIComponent(
      date
    )}&limit=1`,
  });

  const normalizedRows = rows
    .map(normalizeAvailableBookingDay)
    .filter((row): row is AvailableBookingDay => Boolean(row));

  return normalizedRows[0] || null;
}

function getStatusStyles(status?: string): CSSProperties {
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
      background: "#f3efff",
      border: "1px solid #d7cdf8",
      color: "#5b46a8",
    };
  }

  if (status === "done") {
    return {
      background: "#f4f1ec",
      border: "1px solid #d6cec2",
      color: "#4c4339",
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

function getNoticeMessage(
  notice: string | undefined,
  lang: RequestLanguage
) {
  if (!notice) return "";

  const map: Record<AdminNoticeKey, string> = {
    day_added: adminText.noticeDayAdded[lang],
    day_removed: adminText.noticeDayRemoved[lang],
    slot_added: adminText.noticeSlotAdded[lang],
    slot_updated: adminText.noticeSlotUpdated[lang],
    slot_removed: adminText.noticeSlotRemoved[lang],
    duplicate_day: adminText.noticeDuplicateDay[lang],
    duplicate_slot: adminText.noticeDuplicateSlot[lang],
    invalid_day: adminText.noticeInvalidDay[lang],
    invalid_slot: adminText.noticeInvalidSlot[lang],
    missing_day: adminText.noticeMissingDay[lang],
    missing_slot: adminText.noticeMissingSlot[lang],
    selection_required: adminText.noticeSelectionRequired[lang],
    status_updated: adminText.noticeStatusUpdated[lang],
    entry_deleted: adminText.noticeEntryDeleted[lang],
    customers_deleted: adminText.noticeCustomersDeleted[lang],
    invalid_entry: adminText.noticeInvalidEntry[lang],
  };

  return map[notice as AdminNoticeKey] || "";
}

function getNoticeStyles(tone: string | undefined): CSSProperties {
  if (tone === "success") {
    return {
      background: "#f2faf2",
      border: "1px solid #cfe6cf",
      color: "#2d6a38",
    };
  }

  if (tone === "error") {
    return {
      background: "#fff4f3",
      border: "1px solid #efc9c5",
      color: "#9f3e35",
    };
  }

  return {
    background: "#f7f2ea",
    border: "1px solid #e2d3bf",
    color: "#5f472e",
  };
}

function buildAdminPath(params: {
  lang: RequestLanguage;
  office: AdminOfficeId;
  search: string;
  notice?: AdminNoticeKey;
  tone?: AdminNoticeTone;
}) {
  const searchParams = new URLSearchParams();
  searchParams.set("lang", params.lang);
  searchParams.set("office", params.office);

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.notice) {
    searchParams.set("notice", params.notice);
  }

  if (params.tone) {
    searchParams.set("tone", params.tone);
  }

  return `/admin/requests?${searchParams.toString()}`;
}

function getFormContext(formData: FormData): {
  lang: RequestLanguage;
  office: AdminOfficeId;
  search: string;
} {
  return {
    lang: normalizeLanguage(String(formData.get("lang") || "").trim()),
    office: normalizeOffice(String(formData.get("office") || "").trim()),
    search: String(formData.get("search") || "").trim(),
  };
}

function buildScheduleDayRows(
  days: AvailableBookingDay[],
  slots: BookingSlot[]
): ScheduleDayRow[] {
  return days.map((day) => {
    const relatedSlots = slots.filter((slot) => slot.booking_date === day.date);
    const availableSlotCount = relatedSlots.filter(
      (slot) => slot.status === "available"
    ).length;

    return {
      id: day.id,
      date: day.date,
      note: day.note,
      slotCount: relatedSlots.length,
      availableSlotCount,
    };
  });
}

function buildScheduleSlotRows(
  slots: BookingSlot[],
  lang: RequestLanguage
): ScheduleSlotRow[] {
  return slots.map((slot) => {
    const parts = getDateParts(slot.booking_date, lang);

    return {
      id: slot.id,
      date: slot.booking_date,
      day: parts.day,
      month: parts.month,
      year: parts.year,
      weekday: parts.weekday,
      from: formatTimeOnly(slot.start_time),
      to: formatTimeOnly(slot.end_time),
      status: slot.status,
      note: slot.note,
    };
  });
}

async function updateEntryStatus(formData: FormData) {
  "use server";

  const context = getFormContext(formData);

  const entryId = String(formData.get("entryId") || "").trim();
  const source = String(formData.get("source") || "").trim() as AdminEntrySource;
  const rawStatus = String(formData.get("status") || "").trim();
  const adminComment = String(formData.get("adminComment") || "").trim();

  if (!entryId || (source !== "request" && source !== "appointment")) {
    redirect(
      buildAdminPath({
        ...context,
        notice: "invalid_entry",
        tone: "error",
      })
    );
  }

  const tableName = source === "appointment" ? "appointments" : "requests";
  const nextStatus = normalizeAdminEntryStatus(rawStatus, source);

  await supabaseTableFetch<null>({
    path: `${tableName}?id=eq.${encodeURIComponent(entryId)}`,
    method: "PATCH",
    body: { status: nextStatus },
    prefer: "return=minimal",
  });

  const entry =
    source === "appointment"
      ? await getAppointmentById(entryId)
      : await getRequestById(entryId);

  const customer =
    source === "appointment"
      ? (entry as AppointmentRow | null)?.customer
      : (entry as RequestRow | null)?.customer;

  if (customer?.email) {
    await sendStatusUpdateEmail({
      email: customer.email,
      fullName: customer.fullName || "",
      requestId:
        source === "appointment" ? entryId : customer.requestId || entryId,
      status: nextStatus,
      lang: normalizeLanguage(customer.requestLanguage),
      source,
      adminComment,
    });
  }

  revalidatePath("/admin/requests");

  redirect(
    buildAdminPath({
      ...context,
      notice: "status_updated",
      tone: "success",
    })
  );
}

async function deleteEntry(formData: FormData) {
  "use server";

  const context = getFormContext(formData);

  const entryId = String(formData.get("entryId") || "").trim();
  const source = String(formData.get("source") || "").trim() as AdminEntrySource;

  if (!entryId || (source !== "request" && source !== "appointment")) {
    redirect(
      buildAdminPath({
        ...context,
        notice: "invalid_entry",
        tone: "error",
      })
    );
  }

  const tableName = source === "appointment" ? "appointments" : "requests";

  await supabaseTableFetch<null>({
    path: `${tableName}?id=eq.${encodeURIComponent(entryId)}`,
    method: "DELETE",
    prefer: "return=minimal",
  });

  revalidatePath("/admin/requests");

  redirect(
    buildAdminPath({
      ...context,
      notice: "entry_deleted",
      tone: "success",
    })
  );
}

async function deleteSelectedCustomers(formData: FormData) {
  "use server";

  const context = getFormContext(formData);

  const ids = formData
    .getAll("customerIds")
    .map((v) => String(v || "").trim())
    .filter(Boolean);

  if (ids.length === 0) {
    redirect(
      buildAdminPath({
        ...context,
        notice: "selection_required",
        tone: "error",
      })
    );
  }

  for (const id of ids) {
    await supabaseTableFetch<null>({
      path: `${CUSTOMERS_TABLE}?id=eq.${encodeURIComponent(id)}`,
      method: "DELETE",
      prefer: "return=minimal",
    });
  }

  revalidatePath("/admin/requests");

  redirect(
    buildAdminPath({
      ...context,
      notice: "customers_deleted",
      tone: "success",
    })
  );
}

async function addAvailableDay(formData: FormData) {
  "use server";

  const context = getFormContext(formData);

  let rawDate = String(formData.get("date") || "").trim();
  const note = String(formData.get("note") || "").trim();

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(rawDate)) {
    const [d, m, y] = rawDate.split("/");
    rawDate = `${y}-${m}-${d}`;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    redirect(
      buildAdminPath({
        ...context,
        notice: "invalid_day",
        tone: "error",
      })
    );
  }

  const existing = await getAvailableBookingDayByDate(rawDate);

  if (existing) {
    redirect(
      buildAdminPath({
        ...context,
        notice: "duplicate_day",
        tone: "error",
      })
    );
  }

  await supabaseTableFetch({
    path: AVAILABLE_DAYS_TABLE,
    method: "POST",
    body: [{ date: rawDate, note: note || null }],
    prefer: "return=minimal",
  });

  revalidatePath("/admin/requests");

  redirect(
    buildAdminPath({
      ...context,
      notice: "day_added",
      tone: "success",
    })
  );
}

async function removeAvailableDay(formData: FormData) {
  "use server";

  const context = getFormContext(formData);
  const dayId = String(formData.get("dayId") || "").trim();

  if (!dayId) {
    redirect(
      buildAdminPath({
        ...context,
        notice: "missing_day",
        tone: "error",
      })
    );
  }

  await supabaseTableFetch({
    path: `${AVAILABLE_DAYS_TABLE}?id=eq.${encodeURIComponent(dayId)}`,
    method: "DELETE",
    prefer: "return=minimal",
  });

  revalidatePath("/admin/requests");

  redirect(
    buildAdminPath({
      ...context,
      notice: "day_removed",
      tone: "success",
    })
  );
}

async function addBookingSlot(formData: FormData) {
  "use server";

  const context = getFormContext(formData);

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

  if (!bookingDate || !startTime || !endTime || startTime >= endTime) {
    redirect(
      buildAdminPath({
        ...context,
        notice: "invalid_slot",
        tone: "error",
      })
    );
  }

  const existingDay = await getAvailableBookingDayByDate(bookingDate);

  if (!existingDay) {
    redirect(
      buildAdminPath({
        ...context,
        notice: "missing_day",
        tone: "error",
      })
    );
  }

  const overlapping = await supabaseTableFetch<RawBookingSlot[]>({
    path:
      `${BOOKING_SLOTS_TABLE}?booking_date=eq.${bookingDate}` +
      `&start_time=lt.${endTime}&end_time=gt.${startTime}`,
  });

  if ((overlapping || []).length > 0) {
    redirect(
      buildAdminPath({
        ...context,
        notice: "duplicate_slot",
        tone: "error",
      })
    );
  }

  await supabaseTableFetch({
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
    prefer: "return=minimal",
  });

  revalidatePath("/admin/requests");

  redirect(
    buildAdminPath({
      ...context,
      notice: "slot_added",
      tone: "success",
    })
  );
}

async function updateBookingSlot(formData: FormData) {
  "use server";

  const context = getFormContext(formData);

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

  if (!slotId || !bookingDate || !startTime || !endTime || startTime >= endTime) {
    redirect(
      buildAdminPath({
        ...context,
        notice: "invalid_slot",
        tone: "error",
      })
    );
  }

  const overlapping = await supabaseTableFetch<RawBookingSlot[]>({
    path:
      `${BOOKING_SLOTS_TABLE}?booking_date=eq.${bookingDate}` +
      `&start_time=lt.${endTime}&end_time=gt.${startTime}` +
      `&id=neq.${slotId}`,
  });

  if ((overlapping || []).length > 0) {
    redirect(
      buildAdminPath({
        ...context,
        notice: "duplicate_slot",
        tone: "error",
      })
    );
  }

  await supabaseTableFetch({
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

  redirect(
    buildAdminPath({
      ...context,
      notice: "slot_updated",
      tone: "success",
    })
  );
}

async function removeBookingSlot(formData: FormData) {
  "use server";

  const context = getFormContext(formData);
  const slotId = String(formData.get("slotId") || "").trim();

  if (!slotId) {
    redirect(
      buildAdminPath({
        ...context,
        notice: "missing_slot",
        tone: "error",
      })
    );
  }

  await supabaseTableFetch({
    path: `${BOOKING_SLOTS_TABLE}?id=eq.${encodeURIComponent(slotId)}`,
    method: "DELETE",
    prefer: "return=minimal",
  });

  revalidatePath("/admin/requests");

  redirect(
    buildAdminPath({
      ...context,
      notice: "slot_removed",
      tone: "success",
    })
  );
}

async function logoutAction() {
  "use server";
  await clearAdminSession();
  redirect("/admin/login");
}

function getOfficeShellStyle(): CSSProperties {
  return {
    background: "#ffffff",
    border: "1px solid #e6dbcf",
    borderRadius: "24px",
    boxShadow: "0 14px 34px rgba(45, 28, 14, 0.05)",
  };
}

function getOfficePanelStyle(): CSSProperties {
  return {
    background: "#fcfaf7",
    border: "1px solid #eee2d3",
    borderRadius: "18px",
    padding: "16px",
  };
}

function getInfoCardStyle(): CSSProperties {
  return {
    background: "#fffaf4",
    border: "1px solid #e8dacb",
    borderRadius: "18px",
    padding: "16px",
  };
}

function getTopButtonStyle(isActive: boolean): CSSProperties {
  return {
    textDecoration: "none",
    display: "grid",
    gap: "8px",
    padding: "18px",
    minHeight: "110px",
    borderRadius: "20px",
    border: isActive ? "1px solid #2a1d13" : "1px solid #e3d5c5",
    background: isActive ? "#2a1d13" : "#fffaf4",
    color: isActive ? "#ffffff" : "#1f1711",
    boxSizing: "border-box",
  };
}

function getFieldStyle(): CSSProperties {
  return {
    minHeight: "44px",
    width: "100%",
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid #d9c7b4",
    background: "#fffdfa",
    color: "#2d2117",
    fontSize: "14px",
    boxSizing: "border-box",
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
      if (status === "in_progress") return "موعدك قيد المعالجة - Caro Bara Smart Print";
      if (status === "done") return "تم إكمال موعدك - Caro Bara Smart Print";
      if (status === "cancelled") return "تم إلغاء موعدك - Caro Bara Smart Print";
      if (status === "rejected") return "تعذر قبول موعدك - Caro Bara Smart Print";
      return "تم تحديث موعدك - Caro Bara Smart Print";
    }

    if (status === "new") return "تم تسجيل طلبك - Caro Bara Smart Print";
    if (status === "in_progress") return "طلبك قيد المعالجة الآن - Caro Bara Smart Print";
    return "تم إكمال طلبك - Caro Bara Smart Print";
  }

  if (lang === "de") {
    if (isAppointment) {
      if (status === "new") return "Ihr Termin wurde registriert - Caro Bara Smart Print";
      if (status === "confirmed") return "Ihr Termin wurde bestätigt - Caro Bara Smart Print";
      if (status === "in_progress") return "Ihr Termin ist in Bearbeitung - Caro Bara Smart Print";
      if (status === "done") return "Ihr Termin wurde abgeschlossen - Caro Bara Smart Print";
      if (status === "cancelled") return "Ihr Termin wurde storniert - Caro Bara Smart Print";
      if (status === "rejected") return "Ihr Termin konnte nicht angenommen werden - Caro Bara Smart Print";
      return "Ihr Termin wurde aktualisiert - Caro Bara Smart Print";
    }

    if (status === "new") return "Ihre Anfrage wurde registriert - Caro Bara Smart Print";
    if (status === "in_progress") return "Ihre Anfrage wird jetzt bearbeitet - Caro Bara Smart Print";
    return "Ihre Anfrage wurde abgeschlossen - Caro Bara Smart Print";
  }

  if (isAppointment) {
    if (status === "new") return "Your appointment has been registered - Caro Bara Smart Print";
    if (status === "confirmed") return "Your appointment has been confirmed - Caro Bara Smart Print";
    if (status === "in_progress") return "Your appointment is in progress - Caro Bara Smart Print";
    if (status === "done") return "Your appointment has been completed - Caro Bara Smart Print";
    if (status === "cancelled") return "Your appointment has been cancelled - Caro Bara Smart Print";
    if (status === "rejected") return "Your appointment could not be accepted - Caro Bara Smart Print";
    return "Your appointment has been updated - Caro Bara Smart Print";
  }

  if (status === "new") return "Your request has been registered - Caro Bara Smart Print";
  if (status === "in_progress") return "Your request is now in progress - Caro Bara Smart Print";
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

function getLocalizedStatusText(
  status: AdminEntryStatus,
  lang: RequestLanguage
) {
  return getStatusLabel(status, lang);
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
      ? `
        <div style="margin:18px 0; padding:16px 18px; background:#fffaf4; border:1px solid #eadbca; border-radius:14px;">
          <div style="font-size:14px; line-height:1.9; color:#3f3125;">
            <strong>${
              lang === "ar"
                ? "تعليق من فريقنا:"
                : lang === "de"
                  ? "Kommentar von unserem Team:"
                  : "Comment from our team:"
            }</strong><br />
            ${safeComment.replace(/\n/g, "<br />")}
          </div>
        </div>
      `
      : "";

  const heading =
    lang === "ar"
      ? isAppointment
        ? "تحديث حالة موعدك"
        : "تحديث حالة طلبك"
      : lang === "de"
        ? isAppointment
          ? "Status Ihres Termins wurde aktualisiert"
          : "Status Ihrer Anfrage wurde aktualisiert"
        : isAppointment
          ? "Your appointment status has been updated"
          : "Your request status has been updated";

  const currentStatusLabel =
    lang === "ar"
      ? "الحالة الحالية:"
      : lang === "de"
        ? "Aktueller Status:"
        : "Current status:";

  return `
    <div style="margin:0; padding:32px 16px; background:#f7f2ec; font-family:Arial, Helvetica, sans-serif; ${
      lang === "ar" ? "direction:rtl; text-align:right;" : ""
    } color:#1f1711;">
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
            ${safeName || (lang === "ar" ? "عميلنا الكريم" : lang === "de" ? "Guten Tag" : "Hello")},
          </p>

          <div style="margin:18px 0; padding:16px 18px; background:#f8f1e8; border:1px solid #e8dacb; border-radius:14px;">
            <div style="font-size:13px; color:#7a624c; margin-bottom:6px;">${
              isAppointment
                ? lang === "ar"
                  ? "رقم الموعد"
                  : lang === "de"
                    ? "Terminnummer"
                    : "Appointment ID"
                : lang === "ar"
                  ? "رقم الطلب"
                  : lang === "de"
                    ? "Anfragenummer"
                    : "Request ID"
            }</div>
            <div style="font-size:18px; font-weight:800; color:#1f1711;">${safeRequestId}</div>
          </div>

          <div style="margin:18px 0; padding:16px 18px; background:#fffaf4; border:1px solid #eadbca; border-radius:14px;">
            <div style="font-size:14px; line-height:1.9; color:#3f3125;">
              <strong>${currentStatusLabel}</strong><br />
              ${escapeHtml(localizedStatus)}
            </div>
          </div>

          ${commentSection}

          <p style="margin:18px 0 0; font-size:14px; line-height:1.9; color:#6b5a49;">
            ${
              lang === "ar"
                ? "مع خالص التحية،"
                : lang === "de"
                  ? "Mit freundlichen Grüßen"
                  : "Kind regards,"
            }<br />
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

  const result = await resend.emails.send({
    from: `Caro Bara <${resendFromEmail}>`,
    to: params.email,
    replyTo: "info@carobara.com",
    subject: getStatusEmailSubject({
      status: params.status,
      lang: params.lang,
      source: params.source,
    }),
    html: getStatusEmailHtml({
      lang: params.lang,
      fullName: params.fullName,
      requestId: params.requestId,
      status: params.status,
      source: params.source,
      adminComment: params.adminComment,
    }),
  });

  if (result.error) {
    throw new Error(result.error.message || "Failed to send status update email");
  }
}

function LanguageSwitch(props: {
  currentLang: RequestLanguage;
  currentOffice: AdminOfficeId;
  currentSearch: string;
}) {
  const { currentLang, currentOffice, currentSearch } = props;

  const links: Array<{ lang: RequestLanguage; label: string }> = [
    { lang: "ar", label: adminText.languageAr[currentLang] },
    { lang: "de", label: adminText.languageDe[currentLang] },
    { lang: "en", label: adminText.languageEn[currentLang] },
  ];

  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {links.map((item) => {
        const isActive = item.lang === currentLang;
        const href = `/admin/requests?lang=${item.lang}&office=${currentOffice}${
          currentSearch ? `&search=${encodeURIComponent(currentSearch)}` : ""
        }`;

        return (
          <Link
            key={item.lang}
            href={href}
            style={{
              padding: "8px 12px",
              borderRadius: "999px",
              border: isActive ? "1px solid #2a1d13" : "1px solid #d9c7b4",
              background: isActive ? "#2a1d13" : "#fffaf4",
              color: isActive ? "#ffffff" : "#2d2117",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

const tableHeadCellStyle: CSSProperties = {
  textAlign: "start",
  padding: "14px 12px",
  borderBottom: "1px solid #e8dacb",
  fontSize: "13px",
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const tableBodyCellStyle: CSSProperties = {
  textAlign: "start",
  padding: "14px 12px",
  borderBottom: "1px solid #efe4d6",
  fontSize: "14px",
  lineHeight: 1.7,
  color: "#3d2d1f",
  verticalAlign: "top",
  wordBreak: "break-word",
  maxWidth: "260px",
};

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

  const typedSearchParams = resolvedSearchParams as Record<
    string,
    string | string[] | undefined
  >;

  const langValue = Array.isArray(typedSearchParams.lang)
    ? typedSearchParams.lang[0]
    : typedSearchParams.lang;

  const officeValue = Array.isArray(typedSearchParams.office)
    ? typedSearchParams.office[0]
    : typedSearchParams.office;

  const searchValue = Array.isArray(typedSearchParams.search)
    ? typedSearchParams.search[0]
    : typedSearchParams.search;

  const noticeValue = Array.isArray(typedSearchParams.notice)
    ? typedSearchParams.notice[0]
    : typedSearchParams.notice;

  const toneValue = Array.isArray(typedSearchParams.tone)
    ? typedSearchParams.tone[0]
    : typedSearchParams.tone;

  const lang = normalizeLanguage(langValue);
  const dir = getDir(lang);
  const searchTerm = getSafeTrimmedString(searchValue);
  const noticeMessage = getNoticeMessage(noticeValue, lang);

  const [entriesState, availableDaysState, bookingSlotsState, customersState] =
    await Promise.all([
      getAdminEntries(),
      getAvailableBookingDays(),
      getBookingSlots(),
      getCustomers(),
    ]);

  const entries = entriesState.entries;
  const appointmentsTableReady = entriesState.appointmentsTableReady;
  const availableDays = availableDaysState.days;
  const availableDaysTableReady = availableDaysState.tableReady;
  const bookingSlots = bookingSlotsState.slots;
  const bookingSlotsTableReady = bookingSlotsState.tableReady;
  const customers = customersState.customers;

  const customerDataRows = buildCustomerDataRowsFromCustomers(customers);
  const filteredCustomerDataRows = customerDataRows.filter((row) =>
    customerRowMatchesSearch(row, searchTerm)
  );

  const officeDefinitions = getOfficeDefinitions(appointmentsTableReady);
  const fallbackOffice = officeDefinitions[0]?.id || "requests_new";
  const requestedOffice = normalizeOffice(officeValue);

  const activeOffice = officeDefinitions.some(
    (office) => office.id === requestedOffice
  )
    ? requestedOffice
    : fallbackOffice;

  const activeMainOffice = getMainOfficeBySubOffice(activeOffice);

  const filteredEntries = entries.filter((entry) =>
    entryMatchesSearch(entry, searchTerm)
  );

  const filteredAvailableDays = availableDays.filter((day) =>
    matchesSearchValue(`${day.date} ${day.note || ""} ${day.id}`, searchTerm)
  );

  const filteredBookingSlots = bookingSlots.filter((slot) =>
    matchesSearchValue(
      `${slot.id} ${slot.booking_date} ${slot.start_time} ${slot.end_time} ${slot.status} ${slot.note || ""}`,
      searchTerm
    )
  );

  const requestEntries = filteredEntries.filter(
    (entry) => entry.source === "request"
  );
  const appointmentEntries = filteredEntries.filter(
    (entry) => entry.source === "appointment"
  );

  const requestGroups = {
    new: requestEntries.filter((entry) => entry.status === "new"),
    inProgress: requestEntries.filter((entry) => entry.status === "in_progress"),
    done: requestEntries.filter((entry) => entry.status === "done"),
  };

  const scheduleDayRows = buildScheduleDayRows(
    filteredAvailableDays,
    filteredBookingSlots
  );

  const scheduleSlotRows = buildScheduleSlotRows(filteredBookingSlots, lang);

  const appointmentGroups = {
    new: appointmentEntries.filter((entry) => entry.status === "new"),
    inProgress: appointmentEntries.filter(
      (entry) => entry.status === "confirmed" || entry.status === "in_progress"
    ),
    done: appointmentEntries.filter((entry) => entry.status === "done"),
    cancelled: appointmentEntries.filter((entry) => entry.status === "cancelled"),
    rejected: appointmentEntries.filter((entry) => entry.status === "rejected"),
  };

  return (
    <div
      dir={dir}
      style={{
        minHeight: "100vh",
        background: "#f4efe9",
        padding: "16px 12px 34px",
        fontFamily: "Arial, sans-serif",
        color: "#1f1711",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          display: "grid",
          gap: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            direction: "ltr",
          }}
        >
          <LanguageSwitch
            currentLang={lang}
            currentOffice={activeOffice}
            currentSearch={searchTerm}
          />

          <form action={logoutAction}>
            <button
              type="submit"
              style={{
                minHeight: "40px",
                padding: "8px 14px",
                borderRadius: "999px",
                border: "1px solid #b53b32",
                background: "#fff4f3",
                color: "#b53b32",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {adminText.logout[lang]}
            </button>
          </form>
        </div>

        <section
          style={{
            ...getOfficeShellStyle(),
            padding: "18px",
          }}
        >
          <div
            style={{
              fontSize: "clamp(24px, 3vw, 34px)",
              fontWeight: 900,
              lineHeight: 1.2,
              color: "#251b13",
              marginBottom: "8px",
            }}
          >
            {adminText.pageTitle[lang]}
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#6b5a49",
              lineHeight: 1.8,
              marginBottom: "16px",
            }}
          >
            {adminText.pageSubtitle[lang]}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "12px",
            }}
          >
            <Link
              href={`/admin/requests?lang=${lang}&office=${activeOffice}${
                searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""
              }`}
              style={getTopButtonStyle(true)}
            >
              <div style={{ fontSize: "18px", fontWeight: 900 }}>
                {adminText.searchOffice[lang]}
              </div>
              <div style={{ fontSize: "13px", lineHeight: 1.7, opacity: 0.9 }}>
                {adminText.searchOfficeDescription[lang]}
              </div>
            </Link>

            {getMainOfficeDefinitions().map((office) => {
              const targetOffice = getMainOfficeTarget(
                office.id,
                appointmentsTableReady
              );

              return (
                <Link
                  key={office.id}
                  href={`/admin/requests?lang=${lang}&office=${targetOffice}${
                    searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""
                  }`}
                  style={getTopButtonStyle(activeMainOffice === office.id)}
                >
                  <div style={{ fontSize: "18px", fontWeight: 900 }}>
                    {office.label[lang]}
                  </div>
                  <div style={{ fontSize: "13px", lineHeight: 1.7, opacity: 0.9 }}>
                    {office.description[lang]}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section
          style={{
            ...getInfoCardStyle(),
            display: "grid",
            gap: "12px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#251b13",
                marginBottom: "6px",
              }}
            >
              {adminText.searchTitle[lang]}
            </div>
            <div
              style={{
                fontSize: "13px",
                lineHeight: 1.7,
                color: "#6b5a49",
              }}
            >
              {adminText.searchHint[lang]}
            </div>
          </div>

          <form
            method="GET"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) auto auto",
              gap: "10px",
            }}
          >
            <input type="hidden" name="lang" value={lang} />
            <input type="hidden" name="office" value={activeOffice} />

            <input
              type="text"
              name="search"
              placeholder={adminText.searchPlaceholder[lang]}
              defaultValue={searchTerm}
              style={getFieldStyle()}
            />

            <button
              type="submit"
              style={{
                minHeight: "44px",
                padding: "10px 16px",
                borderRadius: "12px",
                border: "1px solid #2a1d13",
                background: "#2a1d13",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {adminText.searchButton[lang]}
            </button>

            <Link
              href={`/admin/requests?lang=${lang}&office=${activeOffice}`}
              style={{
                minHeight: "44px",
                padding: "10px 16px",
                borderRadius: "12px",
                border: "1px solid #d9c7b4",
                background: "#fffdfa",
                color: "#2d2117",
                fontSize: "14px",
                fontWeight: 700,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {adminText.resetButton[lang]}
            </Link>
          </form>
        </section>

        {noticeMessage ? (
          <div
            style={{
              ...getNoticeStyles(toneValue),
              borderRadius: "16px",
              padding: "14px 16px",
              fontSize: "14px",
              fontWeight: 700,
              lineHeight: 1.7,
            }}
          >
            {noticeMessage}
          </div>
        ) : null}

        {activeMainOffice === "requests" ? (
          <section style={{ display: "grid", gap: "16px" }}>
            <div style={{ ...getOfficeShellStyle(), padding: "18px" }}>
              <div style={{ fontSize: "22px", fontWeight: 900, marginBottom: "6px" }}>
                {adminText.sectionRequestsTitle[lang]}
              </div>
              <div style={{ fontSize: "14px", color: "#6b5a49", lineHeight: 1.8 }}>
                {adminText.sectionRequestsSubtitle[lang]}
              </div>
            </div>

            {Object.entries({
              new: adminText.requestsNew[lang],
              inProgress: adminText.requestsInProgress[lang],
              done: adminText.requestsDone[lang],
            }).map(([key, label]) => {
              const rows =
                key === "new"
                  ? requestGroups.new
                  : key === "inProgress"
                    ? requestGroups.inProgress
                    : requestGroups.done;

              return (
                <div key={key} style={{ ...getOfficeShellStyle(), padding: "18px" }}>
                  <div style={{ fontSize: "18px", fontWeight: 800, marginBottom: "14px" }}>
                    {label}
                  </div>

                  {rows.length === 0 ? (
                    <div style={{ ...getOfficePanelStyle(), borderStyle: "dashed" }}>
                      {adminText.empty[lang]}
                    </div>
                  ) : (
                    <div style={{ display: "grid", gap: "14px" }}>
                      {rows.map((entry) => {
                        const customer = entry.customer || {};
                        return (
                          <div
                            key={entry.id}
                            style={{ ...getOfficePanelStyle(), display: "grid", gap: "12px" }}
                          >
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "minmax(0, 1fr) auto",
                                gap: "10px",
                                alignItems: "start",
                              }}
                            >
                              <div>
                                <div
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: 900,
                                    marginBottom: "4px",
                                  }}
                                >
                                  {customer.fullName || adminText.unnamed[lang]}
                                </div>
                                <div
                                  style={{
                                    fontSize: "13px",
                                    color: "#6b5a49",
                                    lineHeight: 1.8,
                                  }}
                                >
                                  {adminText.requestNumber[lang]}:{" "}
                                  {customer.requestId || entry.id}
                                </div>
                              </div>

                              <div
                                style={{
                                  padding: "8px 12px",
                                  borderRadius: "999px",
                                  fontSize: "12px",
                                  fontWeight: 700,
                                  ...getStatusStyles(entry.status),
                                }}
                              >
                                {getStatusLabel(entry.status, lang)}
                              </div>
                            </div>

                            <div
                              style={{
                                fontSize: "14px",
                                lineHeight: 1.8,
                                color: "#4a3929",
                              }}
                            >
                              <div>
                                {adminText.email[lang]}: {getSafeText(customer.email, lang)}
                              </div>
                              <div>
                                {adminText.phone[lang]}: {getSafeText(customer.phone, lang)}
                              </div>
                              <div>
                                {adminText.receivedAt[lang]}:{" "}
                                {formatDate(entry.created_at, lang)}
                              </div>
                              <div>
                                {adminText.message[lang]}:{" "}
                                {getSafeText(customer.message, lang)}
                              </div>
                            </div>

                            <div style={{ display: "grid", gap: "10px" }}>
                              <form action={updateEntryStatus} style={{ display: "grid", gap: "10px" }}>
                                <input type="hidden" name="lang" value={lang} />
                                <input type="hidden" name="office" value={activeOffice} />
                                <input type="hidden" name="search" value={searchTerm} />
                                <input type="hidden" name="entryId" value={entry.id} />
                                <input type="hidden" name="source" value={entry.source} />

                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "minmax(0, 1fr) auto",
                                    gap: "10px",
                                  }}
                                >
                                  <select
                                    name="status"
                                    defaultValue={entry.status || "new"}
                                    style={getFieldStyle()}
                                  >
                                    <option value="new">{getStatusLabel("new", lang)}</option>
                                    <option value="in_progress">
                                      {getStatusLabel("in_progress", lang)}
                                    </option>
                                    <option value="done">{getStatusLabel("done", lang)}</option>
                                  </select>

                                  <button
                                    type="submit"
                                    style={{
                                      minHeight: "44px",
                                      padding: "10px 16px",
                                      borderRadius: "12px",
                                      border: "1px solid #2a1d13",
                                      background: "#2a1d13",
                                      color: "#fff",
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
                                    minHeight: "86px",
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
                                    color: "#7a6754",
                                    lineHeight: 1.7,
                                  }}
                                >
                                  {adminText.sendCommentHint[lang]}
                                </div>
                              </form>

                              <form action={deleteEntry}>
                                <input type="hidden" name="lang" value={lang} />
                                <input type="hidden" name="office" value={activeOffice} />
                                <input type="hidden" name="search" value={searchTerm} />
                                <input type="hidden" name="entryId" value={entry.id} />
                                <input type="hidden" name="source" value={entry.source} />

                                <button
                                  type="submit"
                                  style={{
                                    minHeight: "40px",
                                    padding: "8px 14px",
                                    borderRadius: "10px",
                                    border: "1px solid #b53b32",
                                    background: "#fff4f3",
                                    color: "#b53b32",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                  }}
                                >
                                  {adminText.deleteEntry[lang]}
                                </button>
                              </form>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        ) : null}

        {activeMainOffice === "appointments" ? (
          <section style={{ display: "grid", gap: "16px" }}>
            <div style={{ ...getOfficeShellStyle(), padding: "18px" }}>
              <div style={{ fontSize: "22px", fontWeight: 900, marginBottom: "6px" }}>
                {adminText.sectionAppointmentsTitle[lang]}
              </div>
              <div style={{ fontSize: "14px", color: "#6b5a49", lineHeight: 1.8 }}>
                {adminText.sectionAppointmentsSubtitle[lang]}
              </div>
            </div>

            {!appointmentsTableReady ? (
              <div style={{ ...getOfficePanelStyle(), color: "#9f3e35" }}>
                {adminText.appointmentsUnavailable[lang]}
              </div>
            ) : null}

            <div style={{ ...getOfficeShellStyle(), padding: "18px" }}>
              <div style={{ fontSize: "18px", fontWeight: 800, marginBottom: "14px" }}>
                {adminText.sectionAppointmentsTitle[lang]}
              </div>

              {Object.entries({
                new: adminText.appointmentsNew[lang],
                inProgress: adminText.appointmentsInProgress[lang],
                done: adminText.appointmentsDone[lang],
                cancelled: adminText.appointmentsCancelled[lang],
                rejected: adminText.appointmentsRejected[lang],
              }).map(([key, label]) => {
                const rows =
                  key === "new"
                    ? appointmentGroups.new
                    : key === "inProgress"
                      ? appointmentGroups.inProgress
                      : key === "done"
                        ? appointmentGroups.done
                        : key === "cancelled"
                          ? appointmentGroups.cancelled
                          : appointmentGroups.rejected;

                return (
                  <div
                    key={key}
                    style={{
                      ...getOfficePanelStyle(),
                      marginBottom: "14px",
                    }}
                  >
                    <div style={{ fontSize: "16px", fontWeight: 800, marginBottom: "12px" }}>
                      {label}
                    </div>

                    {rows.length === 0 ? (
                      <div style={{ borderStyle: "dashed", color: "#6b5a49" }}>
                        {adminText.empty[lang]}
                      </div>
                    ) : (
                      <div style={{ display: "grid", gap: "12px" }}>
                        {rows.map((entry) => {
                          const customer = entry.customer || {};
                          return (
                            <div
                              key={entry.id}
                              style={{
                                background: "#fff",
                                border: "1px solid #eadfce",
                                borderRadius: "16px",
                                padding: "14px",
                                display: "grid",
                                gap: "10px",
                              }}
                            >
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "minmax(0, 1fr) auto",
                                  gap: "10px",
                                }}
                              >
                                <div>
                                  <div
                                    style={{
                                      fontSize: "17px",
                                      fontWeight: 900,
                                      marginBottom: "4px",
                                    }}
                                  >
                                    {customer.fullName || adminText.unnamed[lang]}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "13px",
                                      color: "#6b5a49",
                                      lineHeight: 1.8,
                                    }}
                                  >
                                    {adminText.appointmentNumber[lang]}:{" "}
                                    {customer.requestId || entry.id}
                                  </div>
                                </div>

                                <div
                                  style={{
                                    padding: "8px 12px",
                                    borderRadius: "999px",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    ...getStatusStyles(entry.status),
                                  }}
                                >
                                  {getStatusLabel(entry.status, lang)}
                                </div>
                              </div>

                              <div
                                style={{
                                  fontSize: "14px",
                                  lineHeight: 1.8,
                                  color: "#4a3929",
                                }}
                              >
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
                                <div>
                                  {adminText.email[lang]}: {getSafeText(customer.email, lang)}
                                </div>
                                <div>
                                  {adminText.phone[lang]}: {getSafeText(customer.phone, lang)}
                                </div>
                                <div>
                                  {adminText.message[lang]}:{" "}
                                  {getSafeText(customer.message, lang)}
                                </div>
                              </div>

                              <div style={{ display: "grid", gap: "10px" }}>
                                <form action={updateEntryStatus} style={{ display: "grid", gap: "10px" }}>
                                  <input type="hidden" name="lang" value={lang} />
                                  <input type="hidden" name="office" value={activeOffice} />
                                  <input type="hidden" name="search" value={searchTerm} />
                                  <input type="hidden" name="entryId" value={entry.id} />
                                  <input type="hidden" name="source" value={entry.source} />

                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: "minmax(0, 1fr) auto",
                                      gap: "10px",
                                    }}
                                  >
                                    <select
                                      name="status"
                                      defaultValue={entry.status || "new"}
                                      style={getFieldStyle()}
                                    >
                                      <option value="new">{getStatusLabel("new", lang)}</option>
                                      <option value="confirmed">
                                        {getStatusLabel("confirmed", lang)}
                                      </option>
                                      <option value="in_progress">
                                        {getStatusLabel("in_progress", lang)}
                                      </option>
                                      <option value="done">{getStatusLabel("done", lang)}</option>
                                      <option value="cancelled">
                                        {getStatusLabel("cancelled", lang)}
                                      </option>
                                      <option value="rejected">
                                        {getStatusLabel("rejected", lang)}
                                      </option>
                                    </select>

                                    <button
                                      type="submit"
                                      style={{
                                        minHeight: "44px",
                                        padding: "10px 16px",
                                        borderRadius: "12px",
                                        border: "1px solid #2a1d13",
                                        background: "#2a1d13",
                                        color: "#fff",
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
                                      minHeight: "86px",
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
                                </form>

                                <form action={deleteEntry}>
                                  <input type="hidden" name="lang" value={lang} />
                                  <input type="hidden" name="office" value={activeOffice} />
                                  <input type="hidden" name="search" value={searchTerm} />
                                  <input type="hidden" name="entryId" value={entry.id} />
                                  <input type="hidden" name="source" value={entry.source} />

                                  <button
                                    type="submit"
                                    style={{
                                      minHeight: "40px",
                                      padding: "8px 14px",
                                      borderRadius: "10px",
                                      border: "1px solid #b53b32",
                                      background: "#fff4f3",
                                      color: "#b53b32",
                                      fontWeight: 700,
                                      cursor: "pointer",
                                    }}
                                  >
                                    {adminText.deleteEntry[lang]}
                                  </button>
                                </form>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ ...getOfficeShellStyle(), padding: "18px" }}>
              <div style={{ fontSize: "18px", fontWeight: 800, marginBottom: "14px" }}>
                {adminText.scheduleDaysTitle[lang]}
              </div>

              {availableDaysTableReady ? (
                <>
                  <form
                    action={addAvailableDay}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                      gap: "10px",
                      marginBottom: "14px",
                    }}
                  >
                    <input type="hidden" name="lang" value={lang} />
                    <input type="hidden" name="office" value={activeOffice} />
                    <input type="hidden" name="search" value={searchTerm} />

                    <input type="date" name="date" required style={getFieldStyle()} />
                    <input
                      type="text"
                      name="note"
                      placeholder={adminText.internalNote[lang]}
                      style={getFieldStyle()}
                    />
                    <button
                      type="submit"
                      style={{
                        minHeight: "44px",
                        padding: "10px 16px",
                        borderRadius: "12px",
                        border: "1px solid #2a1d13",
                        background: "#2a1d13",
                        color: "#fff",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {adminText.addDay[lang]}
                    </button>
                  </form>

                  {scheduleDayRows.length === 0 ? (
                    <div style={{ ...getOfficePanelStyle(), borderStyle: "dashed" }}>
                      {adminText.empty[lang]}
                    </div>
                  ) : (
                    <div style={{ ...getOfficeShellStyle(), overflow: "hidden" }}>
                      <div style={{ width: "100%", overflowX: "auto" }}>
                        <table
                          style={{
                            width: "100%",
                            minWidth: "980px",
                            borderCollapse: "collapse",
                            background: "#fff",
                          }}
                        >
                          <thead>
                            <tr style={{ background: "#f7f2ea", color: "#2a1d13" }}>
                              <th style={tableHeadCellStyle}>{adminText.type[lang]}</th>
                              <th style={tableHeadCellStyle}>
                                {adminText.dateWeekday[lang]}
                              </th>
                              <th style={tableHeadCellStyle}>{adminText.dateDay[lang]}</th>
                              <th style={tableHeadCellStyle}>{adminText.dateMonth[lang]}</th>
                              <th style={tableHeadCellStyle}>{adminText.dateYear[lang]}</th>
                              <th style={tableHeadCellStyle}>{adminText.note[lang]}</th>
                              <th style={tableHeadCellStyle}>{adminText.status[lang]}</th>
                              <th style={tableHeadCellStyle}>{adminText.actions[lang]}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scheduleDayRows.map((row) => {
                              const parts = getDateParts(row.date, lang);
                              return (
                                <tr key={row.id}>
                                  <td style={tableBodyCellStyle}>
                                    {adminText.rowTypeDay[lang]}
                                  </td>
                                  <td style={tableBodyCellStyle}>{parts.weekday}</td>
                                  <td style={tableBodyCellStyle}>{parts.day}</td>
                                  <td style={tableBodyCellStyle}>{parts.month}</td>
                                  <td style={tableBodyCellStyle}>{parts.year}</td>
                                  <td style={tableBodyCellStyle}>
                                    {row.note || adminText.dash[lang]}
                                  </td>
                                  <td style={tableBodyCellStyle}>
                                    {lang === "ar"
                                      ? `${row.availableSlotCount} متاح / ${row.slotCount} إجمالي`
                                      : lang === "de"
                                        ? `${row.availableSlotCount} verfügbar / ${row.slotCount} gesamt`
                                        : `${row.availableSlotCount} available / ${row.slotCount} total`}
                                  </td>
                                  <td style={tableBodyCellStyle}>
                                    <form action={removeAvailableDay}>
                                      <input type="hidden" name="lang" value={lang} />
                                      <input type="hidden" name="office" value={activeOffice} />
                                      <input type="hidden" name="search" value={searchTerm} />
                                      <input type="hidden" name="dayId" value={row.id} />
                                      <button
                                        type="submit"
                                        style={{
                                          minHeight: "38px",
                                          padding: "8px 12px",
                                          borderRadius: "10px",
                                          border: "1px solid #b53b32",
                                          background: "#fff4f3",
                                          color: "#b53b32",
                                          fontWeight: 700,
                                          cursor: "pointer",
                                        }}
                                      >
                                        {adminText.removeDay[lang]}
                                      </button>
                                    </form>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ ...getOfficePanelStyle(), color: "#9f3e35" }}>
                  {adminText.availableDaysUnavailable[lang]}
                </div>
              )}
            </div>

            <div style={{ ...getOfficeShellStyle(), padding: "18px" }}>
              <div style={{ fontSize: "18px", fontWeight: 800, marginBottom: "14px" }}>
                {adminText.scheduleSlotsTitle[lang]}
              </div>

              {bookingSlotsTableReady ? (
                <>
                  {availableDays.length === 0 ? (
                    <div
                      style={{
                        ...getOfficePanelStyle(),
                        color: "#9f3e35",
                        marginBottom: "14px",
                      }}
                    >
                      {adminText.slotSavedDayMissing[lang]}
                    </div>
                  ) : (
                    <form
                      action={addBookingSlot}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                        gap: "10px",
                        marginBottom: "14px",
                      }}
                    >
                      <input type="hidden" name="lang" value={lang} />
                      <input type="hidden" name="office" value={activeOffice} />
                      <input type="hidden" name="search" value={searchTerm} />

                      <select
                        name="bookingDate"
                        required
                        defaultValue=""
                        style={getFieldStyle()}
                      >
                        <option value="">{adminText.selectSavedDay[lang]}</option>
                        {availableDays.map((day) => (
                          <option key={day.id} value={day.date}>
                            {formatDateOnly(day.date, lang)}
                          </option>
                        ))}
                      </select>

                      <input type="time" name="startTime" required style={getFieldStyle()} />
                      <input type="time" name="endTime" required style={getFieldStyle()} />

                      <select name="status" defaultValue="available" style={getFieldStyle()}>
                        <option value="available">
                          {adminText.slotStatusAvailable[lang]}
                        </option>
                        <option value="booked">{adminText.slotStatusBooked[lang]}</option>
                        <option value="blocked">{adminText.slotStatusBlocked[lang]}</option>
                      </select>

                      <input
                        type="text"
                        name="note"
                        placeholder={adminText.slotNote[lang]}
                        style={getFieldStyle()}
                      />

                      <button
                        type="submit"
                        style={{
                          minHeight: "44px",
                          padding: "10px 16px",
                          borderRadius: "12px",
                          border: "1px solid #2a1d13",
                          background: "#2a1d13",
                          color: "#fff",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {adminText.addSlot[lang]}
                      </button>
                    </form>
                  )}

                  {scheduleSlotRows.length === 0 ? (
                    <div style={{ ...getOfficePanelStyle(), borderStyle: "dashed" }}>
                      {adminText.empty[lang]}
                    </div>
                  ) : (
                    <div style={{ ...getOfficeShellStyle(), overflow: "hidden" }}>
                      <div style={{ width: "100%", overflowX: "auto" }}>
                        <table
                          style={{
                            width: "100%",
                            minWidth: "1260px",
                            borderCollapse: "collapse",
                            background: "#fff",
                          }}
                        >
                          <thead>
                            <tr style={{ background: "#f7f2ea", color: "#2a1d13" }}>
                              <th style={tableHeadCellStyle}>{adminText.type[lang]}</th>
                              <th style={tableHeadCellStyle}>
                                {adminText.dateWeekday[lang]}
                              </th>
                              <th style={tableHeadCellStyle}>{adminText.dateDay[lang]}</th>
                              <th style={tableHeadCellStyle}>{adminText.dateMonth[lang]}</th>
                              <th style={tableHeadCellStyle}>{adminText.dateYear[lang]}</th>
                              <th style={tableHeadCellStyle}>{adminText.from[lang]}</th>
                              <th style={tableHeadCellStyle}>{adminText.to[lang]}</th>
                              <th style={tableHeadCellStyle}>{adminText.status[lang]}</th>
                              <th style={tableHeadCellStyle}>{adminText.note[lang]}</th>
                              <th style={tableHeadCellStyle}>{adminText.actions[lang]}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scheduleSlotRows.map((row) => (
                              <tr key={row.id}>
                                <td style={tableBodyCellStyle}>
                                  {adminText.rowTypeSlot[lang]}
                                </td>
                                <td style={tableBodyCellStyle}>{row.weekday}</td>
                                <td style={tableBodyCellStyle}>{row.day}</td>
                                <td style={tableBodyCellStyle}>{row.month}</td>
                                <td style={tableBodyCellStyle}>{row.year}</td>
                                <td style={tableBodyCellStyle}>{row.from}</td>
                                <td style={tableBodyCellStyle}>{row.to}</td>
                                <td style={tableBodyCellStyle}>
                                  <span
                                    style={{
                                      padding: "6px 10px",
                                      borderRadius: "999px",
                                      fontSize: "12px",
                                      fontWeight: 700,
                                      display: "inline-block",
                                      ...getSlotStatusStyles(row.status),
                                    }}
                                  >
                                    {getSlotStatusLabel(row.status, lang)}
                                  </span>
                                </td>
                                <td style={tableBodyCellStyle}>
                                  {row.note || adminText.dash[lang]}
                                </td>
                                <td style={tableBodyCellStyle}>
                                  <form
                                    action={updateBookingSlot}
                                    style={{ display: "grid", gap: "8px", minWidth: "250px" }}
                                  >
                                    <input type="hidden" name="lang" value={lang} />
                                    <input type="hidden" name="office" value={activeOffice} />
                                    <input type="hidden" name="search" value={searchTerm} />
                                    <input type="hidden" name="slotId" value={row.id} />
                                    <input type="hidden" name="bookingDate" value={row.date} />

                                    <div
                                      style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: "8px",
                                      }}
                                    >
                                      <input
                                        type="time"
                                        name="startTime"
                                        defaultValue={row.from}
                                        required
                                        style={getFieldStyle()}
                                      />
                                      <input
                                        type="time"
                                        name="endTime"
                                        defaultValue={row.to}
                                        required
                                        style={getFieldStyle()}
                                      />
                                    </div>

                                    <select
                                      name="status"
                                      defaultValue={row.status}
                                      style={getFieldStyle()}
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
                                      defaultValue={row.note || ""}
                                      placeholder={adminText.slotNote[lang]}
                                      style={getFieldStyle()}
                                    />

                                    <div
                                      style={{
                                        display: "flex",
                                        gap: "8px",
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      <button
                                        type="submit"
                                        style={{
                                          minHeight: "38px",
                                          padding: "8px 12px",
                                          borderRadius: "10px",
                                          border: "1px solid #2a1d13",
                                          background: "#2a1d13",
                                          color: "#fff",
                                          fontWeight: 700,
                                          cursor: "pointer",
                                        }}
                                      >
                                        {adminText.saveSlot[lang]}
                                      </button>

                                      <button
                                        type="submit"
                                        formAction={removeBookingSlot}
                                        style={{
                                          minHeight: "38px",
                                          padding: "8px 12px",
                                          borderRadius: "10px",
                                          border: "1px solid #b53b32",
                                          background: "#fff4f3",
                                          color: "#b53b32",
                                          fontWeight: 700,
                                          cursor: "pointer",
                                        }}
                                      >
                                        {adminText.removeSlot[lang]}
                                      </button>
                                    </div>
                                  </form>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ ...getOfficePanelStyle(), color: "#9f3e35" }}>
                  {adminText.slotsUnavailable[lang]}
                </div>
              )}
            </div>
          </section>
        ) : null}

        {activeMainOffice === "data" ? (
          <section style={{ display: "grid", gap: "16px" }}>
            <div style={{ ...getOfficeShellStyle(), padding: "18px" }}>
              <div style={{ fontSize: "22px", fontWeight: 900, marginBottom: "6px" }}>
                {adminText.sectionDataTitle[lang]}
              </div>
              <div style={{ fontSize: "14px", color: "#6b5a49", lineHeight: 1.8 }}>
                {adminText.sectionDataSubtitle[lang]}
              </div>
            </div>

            {filteredCustomerDataRows.length === 0 ? (
              <div style={{ ...getOfficePanelStyle(), borderStyle: "dashed" }}>
                {adminText.empty[lang]}
              </div>
            ) : (
              <form action={deleteSelectedCustomers} style={{ display: "grid", gap: "12px" }}>
                <input type="hidden" name="lang" value={lang} />
                <input type="hidden" name="office" value={activeOffice} />
                <input type="hidden" name="search" value={searchTerm} />

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
                    {adminText.deleteSelected[lang]}
                  </button>
                </div>

                <div style={{ ...getOfficeShellStyle(), overflow: "hidden" }}>
                  <div style={{ width: "100%", overflowX: "auto" }}>
                    <table
                      style={{
                        width: "100%",
                        minWidth: "980px",
                        borderCollapse: "collapse",
                        background: "#fff",
                      }}
                    >
                      <thead>
                        <tr style={{ background: "#f7f2ea", color: "#2a1d13" }}>
                          <th style={tableHeadCellStyle}>{adminText.select[lang]}</th>
                          <th style={tableHeadCellStyle}>{adminText.index[lang]}</th>
                          <th style={tableHeadCellStyle}>
                            {adminText.customerNumber[lang]}
                          </th>
                          <th style={tableHeadCellStyle}>{adminText.lastName[lang]}</th>
                          <th style={tableHeadCellStyle}>{adminText.firstName[lang]}</th>
                          <th style={tableHeadCellStyle}>{adminText.email[lang]}</th>
                          <th style={tableHeadCellStyle}>{adminText.phone[lang]}</th>
                          <th style={tableHeadCellStyle}>{adminText.address[lang]}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCustomerDataRows.map((row) => (
                          <tr key={row.id}>
                            <td style={tableBodyCellStyle}>
                              <input type="checkbox" name="customerIds" value={row.id} />
                            </td>
                            <td style={tableBodyCellStyle}>{row.index}</td>
                            <td style={tableBodyCellStyle}>
                              {row.customerNumber || adminText.dash[lang]}
                            </td>
                            <td style={tableBodyCellStyle}>
                              {row.lastName || adminText.dash[lang]}
                            </td>
                            <td style={tableBodyCellStyle}>
                              {row.firstName || adminText.dash[lang]}
                            </td>
                            <td style={tableBodyCellStyle}>
                              {row.email || adminText.dash[lang]}
                            </td>
                            <td style={tableBodyCellStyle}>
                              {row.phone || adminText.dash[lang]}
                            </td>
                            <td style={tableBodyCellStyle}>
                              {row.address || adminText.dash[lang]}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </form>
            )}
          </section>
        ) : null}
      </div>
    </div>
  );
}