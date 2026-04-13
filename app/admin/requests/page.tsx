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
type AppointmentStatus = "new" | "confirmed" | "done" | "cancelled";
type AdminEntryStatus = RequestStatus | AppointmentStatus;
type AppointmentType = "consultation" | "design" | "visit" | "installation";
type AppointmentMode = "at_store" | "we_come_free" | "phone_call";
type AdminEntrySource = "request" | "appointment";

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
  email?: string | null;
  phone?: string | null;
  street?: string | null;
  houseNumber?: string | null;
  postalCode?: string | null;
  city?: string | null;
  subject?: string | null;
  message?: string | null;
  requestId?: string | null;
  requestLanguage?: string | null;
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
  email?: string | null;
  phone?: string | null;
  street?: string | null;
  houseNumber?: string | null;
  postalCode?: string | null;
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
    ar: "عرض مباشر لجميع الطلبات والمواعيد القادمة من الموقع مع بيانات العميل، الرسالة، وقت الوصول، وإمكانية تحديث الحالة مباشرة من داخل اللوحة.",
    de: "Direkte Übersicht aller Website-Anfragen und Termine mit Kundendaten, Nachricht, Eingangszeit und der Möglichkeit, den Status direkt in der Übersicht zu aktualisieren.",
    en: "Live overview of all incoming website requests and appointments with customer details, message, received time, and the ability to update the status directly from the dashboard.",
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
    ar: "مثال: تم استلام طلبك وبدأنا المراجعة. إذا كان لديك ملف نهائي أرسله بالرد على هذا البريد.",
    de: "Beispiel: Ihre Anfrage wurde erhalten und wird nun geprüft. Falls Sie eine finale Datei haben, antworten Sie bitte auf diese E-Mail.",
    en: "Example: Your request has been received and is now under review. If you have a final file, please reply to this email.",
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
    value === "done" ||
    value === "cancelled"
  ) {
    return value;
  }
  return "new";
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

function buildNormalizedCustomer(raw: RawRequestRow): RequestCustomer {
  const nestedCustomer = raw.customer || raw.customerData || {};

  const requestLanguage = normalizeLanguage(
    getSafeTrimmedString(nestedCustomer.requestLanguage) ||
      getSafeTrimmedString(raw.requestLanguage) ||
      "ar"
  );

  return {
    requestId:
      getSafeTrimmedString(nestedCustomer.requestId) ||
      getSafeTrimmedString(raw.requestId) ||
      getSafeTrimmedString(raw.id),
    requestLanguage,
    fullName:
      getSafeTrimmedString(nestedCustomer.fullName) ||
      getSafeTrimmedString(raw.fullName),
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
      getSafeTrimmedString(raw.houseNumber),
    postalCode:
      getSafeTrimmedString(nestedCustomer.postalCode) ||
      getSafeTrimmedString(raw.postalCode),
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
      requestLanguage: normalizeLanguage(getSafeTrimmedString(raw.language) || "ar"),
      fullName: getSafeTrimmedString(raw.fullName),
      email: getSafeTrimmedString(raw.email),
      phone: getSafeTrimmedString(raw.phone),
      street: getSafeTrimmedString(raw.street),
      houseNumber: getSafeTrimmedString(raw.houseNumber),
      postalCode: getSafeTrimmedString(raw.postalCode),
      city: getSafeTrimmedString(raw.city),
      subject: "Booking Appointment",
      message: getSafeTrimmedString(raw.notes),
    },
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

async function getRequests(): Promise<RequestRow[]> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase environment variables are missing");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/requests?select=*&order=created_at.desc`,
    {
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch requests: ${response.status} ${errorText || "Unknown error"}`
    );
  }

  const rows = (await response.json()) as RawRequestRow[];
  return rows.map(normalizeRequestRow).filter((row) => row.id);
}

async function getAppointments(): Promise<AppointmentRow[]> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase environment variables are missing");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/appointments?select=*&order=created_at.desc`,
    {
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch appointments: ${response.status} ${errorText || "Unknown error"}`
    );
  }

  const rows = (await response.json()) as RawAppointmentRow[];
  return rows.map(normalizeAppointmentRow).filter((row) => row.id);
}

async function getAdminEntries(): Promise<AdminEntry[]> {
  const [requests, appointments] = await Promise.all([
    getRequests(),
    getAppointments(),
  ]);

  return [
    ...requests.map(mapRequestToAdminEntry),
    ...appointments.map(mapAppointmentToAdminEntry),
  ].sort((a, b) => {
    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
    return bTime - aTime;
  });
}

async function getRequestById(requestId: string): Promise<RequestRow | null> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase environment variables are missing");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/requests?id=eq.${encodeURIComponent(
      requestId
    )}&select=*`,
    {
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch request: ${response.status} ${errorText || "Unknown error"}`
    );
  }

  const rows = (await response.json()) as RawRequestRow[];
  const normalizedRows = rows.map(normalizeRequestRow).filter((row) => row.id);
  return normalizedRows[0] || null;
}

async function getAppointmentById(
  appointmentId: string
): Promise<AppointmentRow | null> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase environment variables are missing");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/appointments?id=eq.${encodeURIComponent(
      appointmentId
    )}&select=*`,
    {
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch appointment: ${response.status} ${
        errorText || "Unknown error"
      }`
    );
  }

  const rows = (await response.json()) as RawAppointmentRow[];
  const normalizedRows = rows.map(normalizeAppointmentRow).filter((row) => row.id);
  return normalizedRows[0] || null;
}

function formatDate(value: string | undefined, lang: RequestLanguage) {
  if (!value) return adminText.dash[lang];

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const locale =
    lang === "ar" ? "ar-EG" : lang === "de" ? "de-DE" : "en-GB";

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

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const locale =
    lang === "ar" ? "ar-EG" : lang === "de" ? "de-DE" : "en-GB";

  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
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
    },
    de: {
      new: "Neu",
      in_progress: "In Bearbeitung",
      confirmed: "Bestätigt",
      done: "Abgeschlossen",
      cancelled: "Storniert",
    },
    en: {
      new: "New",
      in_progress: "In Progress",
      confirmed: "Confirmed",
      done: "Completed",
      cancelled: "Cancelled",
    },
  };

  if (!status) return adminText.dash[lang];
  return map[lang][status] || status;
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

  if (status === "cancelled") {
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
      at_store: "زيارة مقر Caro Bara",
      we_come_free: "زيارة ميدانية مجانية",
      phone_call: "اتصال هاتفي",
    },
    de: {
      at_store: "Besuch bei Caro Bara",
      we_come_free: "Kostenlose Vor-Ort-Besichtigung",
      phone_call: "Telefonanruf",
    },
    en: {
      at_store: "Visit Caro Bara",
      we_come_free: "Free on-site visit",
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
      if (status === "done") return "تم إكمال موعدك - Caro Bara Smart Print";
      if (status === "cancelled") return "تم إلغاء موعدك - Caro Bara Smart Print";
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
      if (status === "done") return "Ihr Termin wurde abgeschlossen - Caro Bara Smart Print";
      if (status === "cancelled") return "Ihr Termin wurde storniert - Caro Bara Smart Print";
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
    if (status === "confirmed") return "Your appointment has been confirmed - Caro Bara Smart Print";
    if (status === "done") return "Your appointment has been completed - Caro Bara Smart Print";
    if (status === "cancelled") return "Your appointment has been cancelled - Caro Bara Smart Print";
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
        <a href="tel:+943068965559" style="color:#6b5a49; text-decoration:none;">+94 3068965559</a>
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
          : status === "done"
            ? "يسعدنا إبلاغك أن موعدك تم إكماله بنجاح."
            : status === "cancelled"
              ? "نود إبلاغك أن موعدك تم إلغاؤه. يمكنك التواصل معنا لترتيب موعد جديد."
              : "تم تحديث موعدك."
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
          : status === "done"
            ? "Wir freuen uns, Ihnen mitzuteilen, dass Ihr Termin abgeschlossen wurde."
            : status === "cancelled"
              ? "Wir möchten Sie informieren, dass Ihr Termin storniert wurde. Kontaktieren Sie uns gerne für einen neuen Termin."
              : "Ihr Termin wurde aktualisiert."
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
        : status === "done"
          ? "We are pleased to inform you that your appointment has been completed."
          : status === "cancelled"
            ? "We would like to inform you that your appointment has been cancelled. Please contact us to arrange a new one."
            : "Your appointment has been updated."
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
    from: "Caro Bara <info@carobara.com>",
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

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase environment variables are missing");
  }

  const tableName = source === "appointment" ? "appointments" : "requests";
  const rawStatus = String(formData.get("status") || "").trim();
  const nextStatus = normalizeAdminEntryStatus(rawStatus, source);

  const entry =
    source === "appointment"
      ? await getAppointmentById(entryId)
      : await getRequestById(entryId);

  if (!entry) {
    throw new Error(source === "appointment" ? "Appointment not found" : "Request not found");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/${tableName}?id=eq.${encodeURIComponent(entryId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        status: nextStatus,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to update ${source} status: ${response.status} ${errorText || "Unknown error"}`
    );
  }

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

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase environment variables are missing");
  }

  const tableName = source === "appointment" ? "appointments" : "requests";

  const response = await fetch(
    `${supabaseUrl}/rest/v1/${tableName}?id=eq.${encodeURIComponent(entryId)}`,
    {
      method: "DELETE",
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        Prefer: "return=minimal",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to delete ${source}: ${response.status} ${errorText || "Unknown error"}`
    );
  }

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

  const entries: AdminEntry[] = await getAdminEntries();

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
              maxWidth: "780px",
            }}
          >
            {adminText.subtitle[lang]}
          </p>
        </div>

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
                  style                  style={{
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
                        {adminText.itemType[lang]}: {getItemTypeLabel(entry.source, lang)}
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
                        {adminText.receivedAt[lang]}: {formatDate(entry.created_at, lang)}
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
                        {adminText.currentStatus[lang]}: {getStatusLabel(entry.status, lang)}
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
                            justifyContent: lang === "ar" ? "flex-end" : "flex-start",
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
                                <option value="new">{getStatusLabel("new", lang)}</option>
                                <option value="confirmed">
                                  {getStatusLabel("confirmed", lang)}
                                </option>
                                <option value="done">{getStatusLabel("done", lang)}</option>
                                <option value="cancelled">
                                  {getStatusLabel("cancelled", lang)}
                                </option>
                              </>
                            ) : (
                              <>
                                <option value="new">{getStatusLabel("new", lang)}</option>
                                <option value="in_progress">
                                  {getStatusLabel("in_progress", lang)}
                                </option>
                                <option value="done">{getStatusLabel("done", lang)}</option>
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
                          {adminText.houseNumber[lang]}: {getSafeText(customer.houseNumber, lang)}
                        </div>
                        <div>
                          {adminText.postalCode[lang]}: {getSafeText(customer.postalCode, lang)}
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