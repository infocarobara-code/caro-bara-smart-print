import { NextResponse } from "next/server";
import { Resend } from "resend";
import { randomInt } from "crypto";

type AppointmentType = "consultation" | "design" | "visit" | "installation";
type AppointmentMode = "at_store" | "we_come_free" | "phone_call";
type AppointmentStatus =
  | "new"
  | "confirmed"
  | "in_progress"
  | "done"
  | "cancelled"
  | "rejected";

type BookingLanguage = "ar" | "de" | "en";
type CustomerSalutation = "mr" | "ms" | "";
type BookingSlotStatus = "available" | "booked" | "blocked";

type BookingRequestBody = {
  requestType?: "booking" | string;
  source?: string;
  language?: BookingLanguage | string;
  salutation?: CustomerSalutation | string;
  fullName?: string;
  email?: string;
  phone?: string;
  selectedDate?: string;
  selectedDays?: string[];
  selectedSlotId?: string;
  selectedTime?: string;
  selectedTimeRange?: string;
  startTime?: string;
  endTime?: string;
  appointmentWindow?: string;
  type?: AppointmentType | string;
  mode?: AppointmentMode | string;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  notes?: string;
  privacyAccepted?: boolean;
  marketingAccepted?: boolean;
};

type AppointmentInsertRow = {
  customer_id: string;
  customer_code: string;
  full_name: string;
  email: string;
  phone: string;
  language: BookingLanguage;
  date: string;
  time: string | null;
  type: AppointmentType;
  mode: AppointmentMode;
  street: string | null;
  house_number: string | null;
  postal_code: string | null;
  city: string | null;
  notes: string | null;
  status: AppointmentStatus;
};

type AppointmentSelectRow = AppointmentInsertRow & {
  id: string;
  created_at?: string;
};

type AvailableDayRow = {
  id?: string;
  date?: string;
};

type BookingSlotRow = {
  id?: string;
  booking_date?: string;
  start_time?: string;
  end_time?: string;
  status?: BookingSlotStatus | string;
  note?: string | null;
};

type CustomerRow = {
  id: string;
  customer_code?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  street?: string | null;
  house_number?: string | null;
  postal_code?: string | null;
  city?: string | null;
  language?: BookingLanguage | null;
  created_at?: string | null;
};

type CustomerInsertRow = {
  customer_code: string;
  full_name: string;
  email: string;
  phone: string;
  street: string | null;
  house_number: string | null;
  postal_code: string | null;
  city: string | null;
  language: BookingLanguage;
};

const APPOINTMENT_TYPES: AppointmentType[] = [
  "consultation",
  "design",
  "visit",
  "installation",
];

const APPOINTMENT_MODES: AppointmentMode[] = [
  "at_store",
  "we_come_free",
  "phone_call",
];

const BOOKING_SLOT_STATUSES: BookingSlotStatus[] = [
  "available",
  "booked",
  "blocked",
];

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidAppointmentType(value: string): value is AppointmentType {
  return APPOINTMENT_TYPES.includes(value as AppointmentType);
}

function isValidAppointmentMode(value: string): value is AppointmentMode {
  return APPOINTMENT_MODES.includes(value as AppointmentMode);
}

function isValidLanguage(value: string): value is BookingLanguage {
  return value === "ar" || value === "de" || value === "en";
}

function isValidSalutation(value: string): value is CustomerSalutation {
  return value === "mr" || value === "ms" || value === "";
}

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(value);
}

function normalizeTimeValue(value: string): string {
  const normalized = normalizeText(value);

  if (!normalized) {
    return "";
  }

  if (/^\d{2}:\d{2}$/.test(normalized)) {
    return `${normalized}:00`;
  }

  return normalized;
}

function isValidBookingSlotStatus(value: string): value is BookingSlotStatus {
  return BOOKING_SLOT_STATUSES.includes(value as BookingSlotStatus);
}

function getSafeSelectedDate(body: BookingRequestBody): string {
  const selectedDate = normalizeText(body.selectedDate);

  if (selectedDate && isValidDate(selectedDate)) {
    return selectedDate;
  }

  if (Array.isArray(body.selectedDays) && body.selectedDays.length > 0) {
    const first = normalizeText(body.selectedDays[0]);

    if (first && isValidDate(first)) {
      return first;
    }
  }

  return "";
}

function getDash(): string {
  return "—";
}

function getTwoDigitNumber(value: number): string {
  return String(value).padStart(2, "0");
}

function generateEightDigitRandom(): string {
  return String(randomInt(0, 100_000_000)).padStart(8, "0");
}

function generateRequestId(dateInput?: string): string {
  const date = dateInput ? new Date(`${dateInput}T12:00:00`) : new Date();
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;

  const day = getTwoDigitNumber(safeDate.getDate());
  const month = getTwoDigitNumber(safeDate.getMonth() + 1);
  const year = String(safeDate.getFullYear());
  const randomPart = generateEightDigitRandom();

  return `RRMF88-${day}-${month}-${year}-${randomPart}`;
}

function generateCustomerCode(): string {
  return `CB-CUS-${String(randomInt(0, 100_000_000)).padStart(8, "0")}`;
}

function buildAddressLine(
  body: BookingRequestBody,
  _language: BookingLanguage
): string {
  const parts = [
    normalizeText(body.street),
    normalizeText(body.houseNumber),
    normalizeText(body.postalCode),
    normalizeText(body.city),
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : getDash();
}

function getTypeLabel(type: AppointmentType, language: BookingLanguage): string {
  const labels = {
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
  } as const;

  return labels[type][language];
}

function getModeLabel(mode: AppointmentMode, language: BookingLanguage): string {
  const labels = {
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
  } as const;

  return labels[mode][language];
}

function getSalutationLabel(
  salutation: CustomerSalutation,
  language: BookingLanguage
): string {
  const labels = {
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
    "": {
      ar: "—",
      de: "—",
      en: "—",
    },
  } as const;

  return labels[salutation][language];
}

function getCompanyProfile() {
  return {
    companyName: "Caro Bara Smart Print",
    website: "www.carobara.de",
    websiteUrl: "https://www.carobara.de",
    phonePrimary: "+49 176 21105086",
    phoneSecondary: "+49 30 68965559",
    emailPrimary: "info@carobara.com",
    emailSecondary: "info@carobara.de",
    address: "Fanninger Straße 20, 10365 Berlin",
  };
}

function getLocalizedText(language: BookingLanguage) {
  if (language === "ar") {
    return {
      dir: "rtl" as const,
      align: "right" as const,
      internalSubjectPrefix: "طلب موعد جديد",
      internalHeading: "طلب موعد جديد",
      customerSubjectPrefix: "تم استلام طلب موعدكم",
      customerHeading: "شكرًا لكم",
      customerGreetingFallback: "عميلنا الكريم",
      customerIntro:
        "تم استلام طلب موعدكم بنجاح وإضافته إلى نظامنا الداخلي للمراجعة والتنظيم.",
      customerFollowup:
        "سيقوم فريق Caro Bara بمراجعة طلبكم ثم التواصل معكم لتأكيد الموعد أو إرسال أي ملاحظات إضافية عند الحاجة.",
      legalTitle: "معلومة قانونية وتنظيمية",
      legalBody:
        "يتم استخدام بياناتكم فقط لمعالجة طلب الموعد والتواصل المرتبط به، ضمن الإطار القانوني والتنظيمي المعمول به.",
      contactTitle: "بيانات التواصل معنا",
      closing: "مع خالص التحية",
      teamName: "فريق Caro Bara",
      greetingSuffix: "،",
      labels: {
        appointmentId: "رقم الطلب",
        customerCode: "رقم الزبون",
        databaseId: "المعرف الداخلي",
        slotId: "رقم الفترة",
        source: "المصدر",
        requestType: "نوع الطلب",
        status: "الحالة",
        salutation: "الصفة",
        fullName: "الاسم الكامل",
        email: "البريد الإلكتروني",
        phone: "الهاتف",
        selectedDate: "اليوم المختار",
        appointmentWindow: "نافذة الموعد",
        appointmentType: "نوع الموعد",
        appointmentMode: "طريقة الموعد",
        address: "العنوان",
        notes: "الملاحظات",
        privacyAccepted: "موافقة الخصوصية",
        marketingAccepted: "الموافقة التسويقية",
        requestLanguage: "لغة الطلب",
        companyName: "الاسم",
        website: "الموقع",
        companyPhone: "الهاتف",
        companyEmail: "الإيميل",
        companyAddress: "العنوان",
      },
      values: {
        yes: "نعم",
        no: "لا",
        statusNew: "جديد",
      },
    };
  }

  if (language === "de") {
    return {
      dir: "ltr" as const,
      align: "left" as const,
      internalSubjectPrefix: "Neue Terminanfrage",
      internalHeading: "Neue Terminanfrage",
      customerSubjectPrefix: "Ihre Terminanfrage ist eingegangen",
      customerHeading: "Vielen Dank",
      customerGreetingFallback: "Guten Tag",
      customerIntro:
        "Ihre Terminanfrage wurde erfolgreich empfangen und in unser internes System übernommen.",
      customerFollowup:
        "Das Caro Bara Team prüft Ihre Anfrage und meldet sich bei Ihnen zur Bestätigung oder mit zusätzlichen Hinweisen, falls nötig.",
      legalTitle: "Rechtliche und organisatorische Information",
      legalBody:
        "Ihre Daten werden ausschließlich zur Bearbeitung Ihrer Terminanfrage und zur dazugehörigen Kommunikation im geltenden rechtlichen und organisatorischen Rahmen verwendet.",
      contactTitle: "Unsere Kontaktdaten",
      closing: "Mit freundlichen Grüßen",
      teamName: "Caro Bara Team",
      greetingSuffix: ",",
      labels: {
        appointmentId: "Anfragenummer",
        customerCode: "Kundennummer",
        databaseId: "Interne Datenbank-ID",
        slotId: "Slot-ID",
        source: "Quelle",
        requestType: "Anfragetyp",
        status: "Status",
        salutation: "Anrede",
        fullName: "Vollständiger Name",
        email: "E-Mail",
        phone: "Telefon",
        selectedDate: "Gewählter Tag",
        appointmentWindow: "Terminfenster",
        appointmentType: "Terminart",
        appointmentMode: "Terminmodus",
        address: "Adresse",
        notes: "Notizen",
        privacyAccepted: "Datenschutz akzeptiert",
        marketingAccepted: "Marketing akzeptiert",
        requestLanguage: "Sprache der Anfrage",
        companyName: "Name",
        website: "Website",
        companyPhone: "Telefon",
        companyEmail: "E-Mail",
        companyAddress: "Adresse",
      },
      values: {
        yes: "Ja",
        no: "Nein",
        statusNew: "Neu",
      },
    };
  }

  return {
    dir: "ltr" as const,
    align: "left" as const,
    internalSubjectPrefix: "New Booking Request",
    internalHeading: "New Booking Request",
    customerSubjectPrefix: "We received your booking request",
    customerHeading: "Thank you",
    customerGreetingFallback: "Hello",
    customerIntro:
      "Your booking request has been received successfully and added to our internal system.",
    customerFollowup:
      "The Caro Bara team will review your request and contact you to confirm the appointment or send any additional notes if needed.",
    legalTitle: "Legal and organizational information",
    legalBody:
      "Your data is used only for processing your appointment request and the related communication within the applicable legal and organizational framework.",
    contactTitle: "Our contact information",
    closing: "Kind regards",
    teamName: "Caro Bara Team",
    greetingSuffix: ",",
    labels: {
      appointmentId: "Request ID",
      customerCode: "Customer Number",
      databaseId: "Internal Database ID",
      slotId: "Slot ID",
      source: "Source",
      requestType: "Request Type",
      status: "Status",
      salutation: "Salutation",
      fullName: "Full Name",
      email: "Email",
      phone: "Phone",
      selectedDate: "Selected Day",
      appointmentWindow: "Appointment Window",
      appointmentType: "Appointment Type",
      appointmentMode: "Appointment Mode",
      address: "Address",
      notes: "Notes",
      privacyAccepted: "Privacy Accepted",
      marketingAccepted: "Marketing Accepted",
      requestLanguage: "Request Language",
      companyName: "Name",
      website: "Website",
      companyPhone: "Phone",
      companyEmail: "Email",
      companyAddress: "Address",
    },
    values: {
      yes: "Yes",
      no: "No",
      statusNew: "New",
    },
  };
}

function getInternalSubject(params: {
  requestId: string;
  fullName: string;
  selectedDate: string;
  appointmentWindow: string;
  language: BookingLanguage;
}): string {
  const text = getLocalizedText(params.language);
  return `${text.internalSubjectPrefix} | ${params.requestId} | ${params.fullName} | ${params.selectedDate} | ${params.appointmentWindow}`;
}

function getCustomerSubject(params: {
  requestId: string;
  language: BookingLanguage;
}): string {
  const text = getLocalizedText(params.language);
  return `${text.customerSubjectPrefix} - ${params.requestId}`;
}

function buildFieldRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:12px 14px;border-bottom:1px solid #eee7dc;font-weight:800;color:#2a2119;vertical-align:top;width:220px;">
        ${escapeHtml(label)}
      </td>
      <td style="padding:12px 14px;border-bottom:1px solid #eee7dc;color:#4b3a2a;vertical-align:top;">
        ${escapeHtml(value || getDash())}
      </td>
    </tr>
  `;
}

function buildInternalEmailHtml(params: {
  requestId: string;
  customerCode: string;
  databaseId: string;
  slotId: string;
  source: string;
  requestType: string;
  language: BookingLanguage;
  salutation: CustomerSalutation;
  fullName: string;
  email: string;
  phone: string;
  selectedDate: string;
  appointmentWindow: string;
  type: AppointmentType;
  mode: AppointmentMode;
  addressLine: string;
  notes: string;
  privacyAccepted: boolean;
  marketingAccepted: boolean;
}) {
  const text = getLocalizedText(params.language);
  const notesValue = params.notes || getDash();

  return `
    <div style="margin:0;padding:28px 16px;background:#f7f2ec;font-family:Arial,Helvetica,sans-serif;color:#1f1711;direction:${text.dir};text-align:${text.align};">
      <div style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #e5d7c8;border-radius:18px;overflow:hidden;box-shadow:0 12px 28px rgba(44,30,18,0.08);">
        <div style="padding:22px 24px;background:linear-gradient(135deg,#f8efe3 0%,#fffaf4 100%);border-bottom:1px solid #eadbca;">
          <div style="font-size:12px;font-weight:700;letter-spacing:0.4px;color:#8a6a47;margin-bottom:8px;">
            CARO BARA SMART PRINT • BERLIN
          </div>
          <h1 style="margin:0;font-size:28px;line-height:1.3;color:#1f1711;">
            ${escapeHtml(text.internalHeading)}
          </h1>
        </div>

        <div style="padding:24px;">
          <table style="width:100%;border-collapse:collapse;background:#fffaf4;border:1px solid #eadbca;border-radius:14px;overflow:hidden;">
            ${buildFieldRow(text.labels.appointmentId, params.requestId)}
            ${buildFieldRow(text.labels.customerCode, params.customerCode)}
            ${buildFieldRow(text.labels.databaseId, params.databaseId)}
            ${buildFieldRow(text.labels.slotId, params.slotId)}
            ${buildFieldRow(text.labels.source, params.source)}
            ${buildFieldRow(text.labels.requestType, params.requestType)}
            ${buildFieldRow(text.labels.status, text.values.statusNew)}
            ${buildFieldRow(
              text.labels.salutation,
              getSalutationLabel(params.salutation, params.language)
            )}
            ${buildFieldRow(text.labels.fullName, params.fullName)}
            ${buildFieldRow(text.labels.email, params.email)}
            ${buildFieldRow(text.labels.phone, params.phone)}
            ${buildFieldRow(text.labels.selectedDate, params.selectedDate)}
            ${buildFieldRow(text.labels.appointmentWindow, params.appointmentWindow)}
            ${buildFieldRow(
              text.labels.appointmentType,
              getTypeLabel(params.type, params.language)
            )}
            ${buildFieldRow(
              text.labels.appointmentMode,
              getModeLabel(params.mode, params.language)
            )}
            ${buildFieldRow(text.labels.address, params.addressLine)}
            ${buildFieldRow(text.labels.notes, notesValue)}
            ${buildFieldRow(
              text.labels.privacyAccepted,
              params.privacyAccepted ? text.values.yes : text.values.no
            )}
            ${buildFieldRow(
              text.labels.marketingAccepted,
              params.marketingAccepted ? text.values.yes : text.values.no
            )}
            ${buildFieldRow(text.labels.requestLanguage, params.language)}
          </table>
        </div>
      </div>
    </div>
  `;
}

function buildCustomerEmailHtml(params: {
  requestId: string;
  customerCode: string;
  language: BookingLanguage;
  salutation: CustomerSalutation;
  fullName: string;
  selectedDate: string;
  appointmentWindow: string;
  type: AppointmentType;
  mode: AppointmentMode;
  addressLine: string;
  notes: string;
}) {
  const text = getLocalizedText(params.language);
  const company = getCompanyProfile();
  const notesValue = params.notes || getDash();
  const safeName = normalizeText(params.fullName) || text.customerGreetingFallback;

  return `
    <div style="margin:0;padding:28px 16px;background:#f7f2ec;font-family:Arial,Helvetica,sans-serif;color:#1f1711;direction:${text.dir};text-align:${text.align};">
      <div style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #e5d7c8;border-radius:18px;overflow:hidden;box-shadow:0 12px 28px rgba(44,30,18,0.08);">
        <div style="padding:22px 24px;background:linear-gradient(135deg,#f8efe3 0%,#fffaf4 100%);border-bottom:1px solid #eadbca;">
          <div style="font-size:12px;font-weight:700;letter-spacing:0.4px;color:#8a6a47;margin-bottom:8px;">
            CARO BARA SMART PRINT • BERLIN
          </div>
          <h1 style="margin:0;font-size:28px;line-height:1.3;color:#1f1711;">
            ${escapeHtml(text.customerHeading)}
          </h1>
        </div>

        <div style="padding:24px;">
          <p style="margin:0 0 14px;font-size:16px;line-height:1.9;">
            ${escapeHtml(safeName)}${text.greetingSuffix}
          </p>

          <p style="margin:0 0 18px;font-size:15px;line-height:1.9;color:#4b3a2a;">
            ${escapeHtml(text.customerIntro)}
          </p>

          <table style="width:100%;border-collapse:collapse;background:#fffaf4;border:1px solid #eadbca;border-radius:14px;overflow:hidden;">
            ${buildFieldRow(text.labels.appointmentId, params.requestId)}
            ${buildFieldRow(text.labels.customerCode, params.customerCode)}
            ${buildFieldRow(text.labels.selectedDate, params.selectedDate)}
            ${buildFieldRow(text.labels.appointmentWindow, params.appointmentWindow)}
            ${buildFieldRow(
              text.labels.appointmentType,
              getTypeLabel(params.type, params.language)
            )}
            ${buildFieldRow(
              text.labels.appointmentMode,
              getModeLabel(params.mode, params.language)
            )}
            ${buildFieldRow(text.labels.address, params.addressLine)}
            ${buildFieldRow(text.labels.notes, notesValue)}
          </table>

          <p style="margin:18px 0 0;font-size:15px;line-height:1.9;color:#4b3a2a;">
            ${escapeHtml(text.customerFollowup)}
          </p>

          <div style="margin-top:20px;padding:16px 18px;background:#fffaf4;border:1px solid #eadbca;border-radius:14px;">
            <div style="font-size:15px;font-weight:800;color:#1f1711;margin-bottom:8px;">
              ${escapeHtml(text.contactTitle)}
            </div>
            <div style="font-size:14px;line-height:1.9;color:#4b3a2a;">
              <div><strong>${escapeHtml(text.labels.companyName)}:</strong> ${escapeHtml(company.companyName)}</div>
              <div><strong>${escapeHtml(text.labels.website)}:</strong> <a href="${escapeHtml(
                company.websiteUrl
              )}" style="color:#6b4b2f;text-decoration:none;">${escapeHtml(company.website)}</a></div>
              <div><strong>${escapeHtml(text.labels.companyPhone)}:</strong> ${escapeHtml(company.phonePrimary)} / ${escapeHtml(company.phoneSecondary)}</div>
              <div><strong>${escapeHtml(text.labels.companyEmail)}:</strong> ${escapeHtml(company.emailPrimary)} / ${escapeHtml(company.emailSecondary)}</div>
              <div><strong>${escapeHtml(text.labels.companyAddress)}:</strong> ${escapeHtml(company.address)}</div>
            </div>
          </div>

          <div style="margin-top:18px;padding:16px 18px;background:#f8f1e8;border:1px solid #e8dacb;border-radius:14px;">
            <div style="font-size:14px;line-height:1.9;color:#3f3125;">
              <strong>${escapeHtml(text.legalTitle)}:</strong><br />
              ${escapeHtml(text.legalBody)}
            </div>
          </div>

          <p style="margin:22px 0 0;font-size:14px;line-height:1.9;color:#6b5a49;">
            ${escapeHtml(text.closing)}<br />
            <strong>${escapeHtml(text.teamName)}</strong>
          </p>
        </div>
      </div>
    </div>
  `;
}

async function supabaseRestFetch<T>(params: {
  url: string;
  serviceRoleKey: string;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  prefer?: string;
}) {
  const response = await fetch(params.url, {
    method: params.method || "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: params.serviceRoleKey,
      Authorization: `Bearer ${params.serviceRoleKey}`,
      ...(params.prefer ? { Prefer: params.prefer } : {}),
    },
    body: params.body ? JSON.stringify(params.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Supabase request failed: ${response.status} ${errorText || "Unknown error"}`
    );
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

async function findExistingCustomer(params: {
  supabaseUrl: string;
  serviceRoleKey: string;
  email: string;
  phone: string;
}) {
  const byEmailUrl =
    `${params.supabaseUrl}/rest/v1/customers` +
    `?select=id,customer_code,full_name,email,phone,street,house_number,postal_code,city,language,created_at` +
    `&email=eq.${encodeURIComponent(params.email)}` +
    `&limit=1`;

  const byEmailRows = await supabaseRestFetch<CustomerRow[]>({
    url: byEmailUrl,
    serviceRoleKey: params.serviceRoleKey,
  });

  if (byEmailRows?.[0]?.id) {
    return byEmailRows[0];
  }

  if (params.phone) {
    const byPhoneUrl =
      `${params.supabaseUrl}/rest/v1/customers` +
      `?select=id,customer_code,full_name,email,phone,street,house_number,postal_code,city,language,created_at` +
      `&phone=eq.${encodeURIComponent(params.phone)}` +
      `&limit=1`;

    const byPhoneRows = await supabaseRestFetch<CustomerRow[]>({
      url: byPhoneUrl,
      serviceRoleKey: params.serviceRoleKey,
    });

    if (byPhoneRows?.[0]?.id) {
      return byPhoneRows[0];
    }
  }

  return null;
}

async function createCustomer(params: {
  supabaseUrl: string;
  serviceRoleKey: string;
  fullName: string;
  email: string;
  phone: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  language: BookingLanguage;
}) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const customerCode = generateCustomerCode();

    try {
      const insertUrl = `${params.supabaseUrl}/rest/v1/customers`;

      const row: CustomerInsertRow = {
        customer_code: customerCode,
        full_name: params.fullName,
        email: params.email,
        phone: params.phone,
        street: params.street || null,
        house_number: params.houseNumber || null,
        postal_code: params.postalCode || null,
        city: params.city || null,
        language: params.language,
      };

      const insertedRows = await supabaseRestFetch<CustomerRow[]>({
        url: insertUrl,
        serviceRoleKey: params.serviceRoleKey,
        method: "POST",
        body: [row],
        prefer: "return=representation",
      });

      const inserted = insertedRows?.[0];

      if (inserted?.id && inserted.customer_code) {
        return inserted;
      }

      if (inserted?.id && !inserted.customer_code) {
        return {
          ...inserted,
          customer_code: customerCode,
        } as CustomerRow;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown customer insert error";

      if (attempt === 4) {
        throw new Error(
          `Customer creation failed. Please make sure the customers table exists and customer_code is unique. ${errorMessage}`
        );
      }
    }
  }

  throw new Error("Customer creation failed after multiple attempts.");
}

async function getOrCreateCustomer(params: {
  supabaseUrl: string;
  serviceRoleKey: string;
  fullName: string;
  email: string;
  phone: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  language: BookingLanguage;
}) {
  const existingCustomer = await findExistingCustomer({
    supabaseUrl: params.supabaseUrl,
    serviceRoleKey: params.serviceRoleKey,
    email: params.email,
    phone: params.phone,
  });

  if (existingCustomer?.id) {
    const existingCode = normalizeText(existingCustomer.customer_code);

    if (!existingCode) {
      throw new Error(
        "Existing customer found but customer_code is missing in customers table."
      );
    }

    return {
      id: existingCustomer.id,
      customerCode: existingCode,
      isNewCustomer: false,
    };
  }

  const createdCustomer = await createCustomer({
    supabaseUrl: params.supabaseUrl,
    serviceRoleKey: params.serviceRoleKey,
    fullName: params.fullName,
    email: params.email,
    phone: params.phone,
    street: params.street,
    houseNumber: params.houseNumber,
    postalCode: params.postalCode,
    city: params.city,
    language: params.language,
  });

  return {
    id: createdCustomer.id,
    customerCode: normalizeText(createdCustomer.customer_code),
    isNewCustomer: true,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BookingRequestBody;

    const requestType = normalizeText(body.requestType) || "booking";
    const source = normalizeText(body.source) || "booking_page";

    const languageRaw = normalizeText(body.language);
    const language: BookingLanguage = isValidLanguage(languageRaw)
      ? languageRaw
      : "en";

    const salutationRaw = normalizeText(body.salutation);
    const salutation: CustomerSalutation = isValidSalutation(salutationRaw)
      ? salutationRaw
      : "";

    const fullName = normalizeText(body.fullName);
    const email = normalizeText(body.email).toLowerCase();
    const phone = normalizeText(body.phone);
    const selectedDate = getSafeSelectedDate(body);
    const requestId = generateRequestId(selectedDate || undefined);
    const selectedSlotId = normalizeText(body.selectedSlotId);
    const selectedTime = normalizeText(body.selectedTime);
    const selectedTimeRange = normalizeText(body.selectedTimeRange);
    const startTime = normalizeTimeValue(body.startTime || "");
    const endTime = normalizeTimeValue(body.endTime || "");
    const appointmentWindow =
      selectedTimeRange ||
      normalizeText(body.appointmentWindow) ||
      "to_be_defined_by_admin";

    const typeRaw = normalizeText(body.type);
    const modeRaw = normalizeText(body.mode);
    const street = normalizeText(body.street);
    const houseNumber = normalizeText(body.houseNumber);
    const postalCode = normalizeText(body.postalCode);
    const city = normalizeText(body.city);
    const notes = normalizeText(body.notes);
    const privacyAccepted = body.privacyAccepted === true;
    const marketingAccepted = body.marketingAccepted === true;

    if (
      !fullName ||
      !email ||
      !phone ||
      !selectedDate ||
      !typeRaw ||
      !modeRaw ||
      !privacyAccepted
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required booking fields or privacy consent not accepted.",
        },
        { status: 400 }
      );
    }

    if (!salutation) {
      return NextResponse.json(
        {
          success: false,
          error: "Salutation is required.",
        },
        { status: 400 }
      );
    }

    if (!isValidAppointmentType(typeRaw)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid appointment type.",
        },
        { status: 400 }
      );
    }

    if (!isValidAppointmentMode(modeRaw)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid appointment mode.",
        },
        { status: 400 }
      );
    }

    if (!isValidDate(selectedDate)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid appointment date format.",
        },
        { status: 400 }
      );
    }

    if (!selectedSlotId) {
      return NextResponse.json(
        {
          success: false,
          error: "Selected slot is required.",
        },
        { status: 400 }
      );
    }

    if (
      !startTime ||
      !endTime ||
      !isValidTime(startTime) ||
      !isValidTime(endTime)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid slot start and end times are required.",
        },
        { status: 400 }
      );
    }

    if (!street || !houseNumber || !postalCode || !city) {
      return NextResponse.json(
        {
          success: false,
          error: "Address is required.",
        },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;
    const requestReceiverEmail =
      process.env.REQUEST_RECEIVER_EMAIL || "info@carobara.com";
    const resendFromEmail =
      process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase environment variables are missing.",
        },
        { status: 500 }
      );
    }

    if (!resendApiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "RESEND_API_KEY is missing.",
        },
        { status: 500 }
      );
    }

    const customerRecord = await getOrCreateCustomer({
      supabaseUrl,
      serviceRoleKey: supabaseServiceRoleKey,
      fullName,
      email,
      phone,
      street,
      houseNumber,
      postalCode,
      city,
      language,
    });

    const customerCode = customerRecord.customerCode;
    const customerId = customerRecord.id;

    if (!customerCode || !customerId) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer code or customer id could not be generated or retrieved.",
        },
        { status: 500 }
      );
    }

    const activeDayRows = await supabaseRestFetch<AvailableDayRow[]>({
      url:
        `${supabaseUrl}/rest/v1/booking_available_days` +
        `?select=id,date` +
        `&date=eq.${encodeURIComponent(selectedDate)}` +
        `&limit=1`,
      serviceRoleKey: supabaseServiceRoleKey,
    });

    if (!activeDayRows || activeDayRows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "The selected day is no longer available.",
        },
        { status: 409 }
      );
    }

    const matchingSlotRows = await supabaseRestFetch<BookingSlotRow[]>({
      url:
        `${supabaseUrl}/rest/v1/booking_slots` +
        `?select=id,booking_date,start_time,end_time,status,note` +
        `&id=eq.${encodeURIComponent(selectedSlotId)}` +
        `&limit=1`,
      serviceRoleKey: supabaseServiceRoleKey,
    });

    const matchingSlot = matchingSlotRows?.[0];

    if (!matchingSlot?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "The selected time slot no longer exists.",
        },
        { status: 409 }
      );
    }

    const slotDate = normalizeText(matchingSlot.booking_date);
    const slotStartTime = normalizeTimeValue(matchingSlot.start_time || "");
    const slotEndTime = normalizeTimeValue(matchingSlot.end_time || "");
    const rawSlotStatus = normalizeText(matchingSlot.status);
    const slotStatus: BookingSlotStatus = isValidBookingSlotStatus(rawSlotStatus)
      ? rawSlotStatus
      : "available";

    if (slotDate !== selectedDate) {
      return NextResponse.json(
        {
          success: false,
          error: "The selected slot does not belong to the selected day.",
        },
        { status: 409 }
      );
    }

    if (slotStartTime !== startTime || slotEndTime !== endTime) {
      return NextResponse.json(
        {
          success: false,
          error: "The selected slot time no longer matches the latest availability.",
        },
        { status: 409 }
      );
    }

    if (slotStatus !== "available") {
      return NextResponse.json(
        {
          success: false,
          error: "This time slot has just been taken or is no longer available.",
        },
        { status: 409 }
      );
    }

    const updateSlotUrl =
      `${supabaseUrl}/rest/v1/booking_slots` +
      `?id=eq.${encodeURIComponent(selectedSlotId)}` +
      `&status=eq.available`;

    const updatedSlotRows = await supabaseRestFetch<BookingSlotRow[]>({
      url: updateSlotUrl,
      serviceRoleKey: supabaseServiceRoleKey,
      method: "PATCH",
      body: {
        status: "booked",
      },
      prefer: "return=representation",
    });

    const updatedSlot = updatedSlotRows?.[0];

    if (!updatedSlot?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "This time slot was booked a moment ago. Please choose another time.",
        },
        { status: 409 }
      );
    }

    const resend = new Resend(resendApiKey);

    let inserted: AppointmentSelectRow | null = null;

    try {
      const appointmentRow: AppointmentInsertRow = {
        customer_id: customerId,
        customer_code: customerCode,
        full_name: fullName,
        email,
        phone,
        language,
        date: selectedDate,
        time: selectedTime || startTime || null,
        type: typeRaw,
        mode: modeRaw,
        street: street || null,
        house_number: houseNumber || null,
        postal_code: postalCode || null,
        city: city || null,
        notes: notes || null,
        status: "new",
      };

      const insertUrl = `${supabaseUrl}/rest/v1/appointments`;

      const insertedAppointment = await supabaseRestFetch<AppointmentSelectRow[]>({
        url: insertUrl,
        serviceRoleKey: supabaseServiceRoleKey,
        method: "POST",
        body: [appointmentRow],
        prefer: "return=representation",
      });

      inserted = insertedAppointment?.[0] || null;

      if (!inserted) {
        throw new Error("Failed to save appointment.");
      }

      const addressLine = buildAddressLine(body, language);
      const internalSubject = getInternalSubject({
        requestId,
        fullName,
        selectedDate,
        appointmentWindow,
        language,
      });

      const internalHtml = buildInternalEmailHtml({
        requestId,
        customerCode,
        databaseId: inserted.id,
        slotId: selectedSlotId,
        source,
        requestType,
        language,
        salutation,
        fullName,
        email,
        phone,
        selectedDate,
        appointmentWindow,
        type: typeRaw,
        mode: modeRaw,
        addressLine,
        notes,
        privacyAccepted,
        marketingAccepted,
      });

      const customerHtml = buildCustomerEmailHtml({
        requestId,
        customerCode,
        language,
        salutation,
        fullName,
        selectedDate,
        appointmentWindow,
        type: typeRaw,
        mode: modeRaw,
        addressLine,
        notes,
      });

      const internalEmailResult = await resend.emails.send({
        from: `Caro Bara <${resendFromEmail}>`,
        to: [requestReceiverEmail],
        replyTo: email,
        subject: internalSubject,
        html: internalHtml,
      });

      if ((internalEmailResult as { error?: { message?: string } }).error) {
        throw new Error(
          (internalEmailResult as { error?: { message?: string } }).error
            ?.message || "Appointment saved but internal email sending failed."
        );
      }

      const customerEmailResult = await resend.emails.send({
        from: `Caro Bara <${resendFromEmail}>`,
        to: [email],
        subject: getCustomerSubject({ requestId, language }),
        html: customerHtml,
      });

      if ((customerEmailResult as { error?: { message?: string } }).error) {
        throw new Error(
          (customerEmailResult as { error?: { message?: string } }).error
            ?.message || "Appointment saved but customer email sending failed."
        );
      }

      return NextResponse.json(
        {
          success: true,
          requestId,
          customerCode,
          customerId,
          appointment: inserted,
          appointmentId: inserted.id,
          slotId: selectedSlotId,
          message: "Booking request submitted successfully.",
        },
        { status: 200 }
      );
    } catch (innerError) {
      try {
        await supabaseRestFetch<BookingSlotRow[]>({
          url:
            `${supabaseUrl}/rest/v1/booking_slots` +
            `?id=eq.${encodeURIComponent(selectedSlotId)}`,
          serviceRoleKey: supabaseServiceRoleKey,
          method: "PATCH",
          body: {
            status: "available",
          },
          prefer: "return=representation",
        });
      } catch {
        // rollback best-effort only
      }

      return NextResponse.json(
        {
          success: false,
          requestId,
          customerCode,
          customerId,
          error:
            innerError instanceof Error
              ? innerError.message
              : "Unexpected booking processing error.",
          appointmentId: inserted?.id,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}