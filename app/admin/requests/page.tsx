import AdminNav from "../AdminNav";
import adminStyles from "../admin.module.css";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import type { CSSProperties } from "react";
import {
  isAdminAuthenticated,
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
    ret…11780 tokens truncated…ial, sans-serif",
        color: "#173142",
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
        <AdminNav lang={lang} active={activeMainOffice === "data" ? "customers" : activeMainOffice === "appointments" ? "appointments" : "requests"} office={activeOffice} search={searchTerm} />
        <section className={adminStyles.panel}>
          <h1>{activeMainOffice === "data" ? adminText.sectionDataTitle[lang] : activeMainOffice === "appointments" ? adminText.sectionAppointmentsTitle[lang] : adminText.sectionRequestsTitle[lang]}</h1>
          <nav className={adminStyles.links}>
            {officeDefinitions.filter(o => getMainOfficeBySubOffice(o.id) === activeMainOffice && o.id !== "request_actions" && o.id !== "schedule_settings").map(o => <Link key={o.id} className={o.id === activeOffice ? adminStyles.button : adminStyles.secondary} href={`/admin/requests?lang=${lang}&office=${o.id}${typedSearchParams.legacy === "1" ? "&legacy=1" : ""}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""}`}>{o.label[lang]}</Link>)}
          </nav>
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
                color: "#173142",
                marginBottom: "6px",
              }}
            >
              {adminText.searchTitle[lang]}
            </div>
            <div
              style={{
                fontSize: "13px",
                lineHeight: 1.7,
                color: "#526a78",
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
              aria-label={adminText.searchTitle[lang]}
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
              <div style={{ fontSize: "14px", color: "#526a78", lineHeight: 1.8 }}>
                {adminText.sectionRequestsSubtitle[lang]}
              </div>
            </div>

            {Object.entries({
              new: adminText.requestsNew[lang],
              inProgress: adminText.requestsInProgress[lang],
              done: adminText.requestsDone[lang],
            }).filter(([key]) => key === (activeOffice === "requests_in_progress" ? "inProgress" : activeOffice === "requests_done" ? "done" : "new")).map(([key, label]) => {
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
                                    color: "#526a78",
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
              <div style={{ fontSize: "14px", color: "#526a78", lineHeight: 1.8 }}>
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
                      <div style={{ borderStyle: "dashed", color: "#526a78" }}>
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
                                      color: "#526a78",
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

            {!weeklyEnabled && <>
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
            </>}
          </section>
        ) : null}

        {activeMainOffice === "data" ? (
          <section style={{ display: "grid", gap: "16px" }}>
            <div style={{ ...getOfficeShellStyle(), padding: "18px" }}>
              <div style={{ fontSize: "22px", fontWeight: 900, marginBottom: "6px" }}>
                {adminText.sectionDataTitle[lang]}
              </div>
              <div style={{ fontSize: "14px", color: "#526a78", lineHeight: 1.8 }}>
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
