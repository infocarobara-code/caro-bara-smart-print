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

type RequestRow = {
  id: string;
  status: string;
  channel: string;
  created_at?: string;
  customer?: RequestCustomer;
};

type RequestStatus = "new" | "in_progress" | "done";

const adminText = {
  badge: {
    ar: "لوحة التحكم",
    de: "Admin-Bereich",
    en: "Admin Panel",
  },
  title: {
    ar: "إدارة الطلبات",
    de: "Anfragen verwalten",
    en: "Manage Requests",
  },
  subtitle: {
    ar: "عرض مباشر لجميع الطلبات القادمة من الموقع مع بيانات العميل، الرسالة، وقت الوصول، وإمكانية تحديث الحالة مباشرة من داخل اللوحة.",
    de: "Direkte Übersicht aller Website-Anfragen mit Kundendaten, Nachricht, Eingangszeit und der Möglichkeit, den Status direkt in der Übersicht zu aktualisieren.",
    en: "Live overview of all incoming website requests with customer details, message, received time, and the ability to update the status directly from the dashboard.",
  },
  totalCount: {
    ar: "عدد الطلبات",
    de: "Anzahl der Anfragen",
    en: "Number of requests",
  },
  empty: {
    ar: "لا توجد طلبات محفوظة حاليًا.",
    de: "Aktuell sind keine gespeicherten Anfragen vorhanden.",
    en: "There are currently no saved requests.",
  },
  requestNumber: {
    ar: "رقم الطلب",
    de: "Anfragenummer",
    en: "Request ID",
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
    ar: "حذف الطلب",
    de: "Anfrage löschen",
    en: "Delete request",
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
};

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

  return (await response.json()) as RequestRow[];
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

  const rows = (await response.json()) as RequestRow[];
  return rows[0] || null;
}

function normalizeLanguage(value?: string): RequestLanguage {
  if (value === "ar" || value === "de" || value === "en") {
    return value;
  }
  return "ar";
}

function getDir(lang: RequestLanguage): "rtl" | "ltr" {
  return lang === "ar" ? "rtl" : "ltr";
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

function getStatusLabel(status: string | undefined, lang: RequestLanguage) {
  const map = {
    ar: {
      new: "جديد",
      in_progress: "قيد المعالجة",
      done: "مكتمل",
    },
    de: {
      new: "Neu",
      in_progress: "In Bearbeitung",
      done: "Abgeschlossen",
    },
    en: {
      new: "New",
      in_progress: "In Progress",
      done: "Completed",
    },
  };

  if (!status) return adminText.dash[lang];
  return map[lang][status as RequestStatus] || status;
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

  if (status === "done") {
    return {
      background: "#edf7ef",
      border: "1px solid #cfe4d3",
      color: "#2f6b3e",
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

function getLocalizedStatusText(status: RequestStatus, lang: RequestLanguage) {
  return getStatusLabel(status, lang);
}

function getStatusEmailSubject(status: RequestStatus, lang: RequestLanguage) {
  if (lang === "ar") {
    if (status === "new") return "تم تسجيل طلبك - Caro Bara Smart Print";
    if (status === "in_progress") {
      return "طلبك قيد المعالجة الآن - Caro Bara Smart Print";
    }
    return "تم إكمال طلبك - Caro Bara Smart Print";
  }

  if (lang === "de") {
    if (status === "new") {
      return "Ihre Anfrage wurde registriert - Caro Bara Smart Print";
    }
    if (status === "in_progress") {
      return "Ihre Anfrage wird jetzt bearbeitet - Caro Bara Smart Print";
    }
    return "Ihre Anfrage wurde abgeschlossen - Caro Bara Smart Print";
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
  status: RequestStatus;
  adminComment?: string;
}) {
  const { lang, fullName, requestId, status, adminComment } = params;
  const safeName = escapeHtml(fullName || "");
  const safeRequestId = escapeHtml(requestId || "");
  const localizedStatus = getLocalizedStatusText(status, lang);
  const companyFooter = getCompanyFooterHtml(lang);
  const safeComment = escapeHtml((adminComment || "").trim());

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
    const bodyText =
      status === "new"
        ? "تم تسجيل طلبك لدينا بنجاح وهو الآن ضمن قائمة المتابعة."
        : status === "in_progress"
          ? "نود إبلاغك أن طلبك أصبح الآن قيد المعالجة من قبل فريقنا."
          : "يسعدنا إبلاغك أن طلبك تم إكماله. سنكون سعداء بخدمتك مجددًا.";

    return `
      <div style="margin:0; padding:32px 16px; background:#f7f2ec; font-family:Arial, Helvetica, sans-serif; direction:rtl; text-align:right; color:#1f1711;">
        <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5d7c8; border-radius:20px; overflow:hidden; box-shadow:0 12px 30px rgba(44,30,18,0.08);">
          <div style="padding:24px 28px; background:linear-gradient(135deg, #f8efe3 0%, #fffaf4 100%); border-bottom:1px solid #eadbca;">
            <div style="font-size:12px; font-weight:700; letter-spacing:0.4px; color:#8a6a47; margin-bottom:10px;">
              CARO BARA SMART PRINT • BERLIN
            </div>
            <h1 style="margin:0; font-size:28px; line-height:1.3; color:#1f1711;">
              تحديث حالة طلبك
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
              <div style="font-size:13px; color:#7a624c; margin-bottom:6px;">رقم الطلب</div>
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
    const bodyText =
      status === "new"
        ? "Ihre Anfrage wurde erfolgreich registriert und befindet sich jetzt in unserer Bearbeitungsliste."
        : status === "in_progress"
          ? "Wir möchten Sie darüber informieren, dass Ihre Anfrage nun von unserem Team bearbeitet wird."
          : "Wir freuen uns, Ihnen mitzuteilen, dass Ihre Anfrage abgeschlossen wurde. Vielen Dank für Ihr Vertrauen.";

    return `
      <div style="margin:0; padding:32px 16px; background:#f7f2ec; font-family:Arial, Helvetica, sans-serif; color:#1f1711;">
        <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5d7c8; border-radius:20px; overflow:hidden; box-shadow:0 12px 30px rgba(44,30,18,0.08);">
          <div style="padding:24px 28px; background:linear-gradient(135deg, #f8efe3 0%, #fffaf4 100%); border-bottom:1px solid #eadbca;">
            <div style="font-size:12px; font-weight:700; letter-spacing:0.4px; color:#8a6a47; margin-bottom:10px;">
              CARO BARA SMART PRINT • BERLIN
            </div>
            <h1 style="margin:0; font-size:28px; line-height:1.3; color:#1f1711;">
              Status Ihrer Anfrage wurde aktualisiert
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
              <div style="font-size:13px; color:#7a624c; margin-bottom:6px;">Anfragenummer</div>
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

  const bodyText =
    status === "new"
      ? "Your request has been successfully registered and is now in our workflow."
      : status === "in_progress"
        ? "We would like to let you know that your request is now being processed by our team."
        : "We are pleased to inform you that your request has been completed. Thank you for your trust.";

  return `
    <div style="margin:0; padding:32px 16px; background:#f7f2ec; font-family:Arial, Helvetica, sans-serif; color:#1f1711;">
      <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5d7c8; border-radius:20px; overflow:hidden; box-shadow:0 12px 30px rgba(44,30,18,0.08);">
        <div style="padding:24px 28px; background:linear-gradient(135deg, #f8efe3 0%, #fffaf4 100%); border-bottom:1px solid #eadbca;">
          <div style="font-size:12px; font-weight:700; letter-spacing:0.4px; color:#8a6a47; margin-bottom:10px;">
            CARO BARA SMART PRINT • BERLIN
          </div>
          <h1 style="margin:0; font-size:28px; line-height:1.3; color:#1f1711;">
            Your request status has been updated
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
            <div style="font-size:13px; color:#7a624c; margin-bottom:6px;">Request ID</div>
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
  status: RequestStatus;
  lang: RequestLanguage;
  adminComment?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing");
  }

  const resend = new Resend(apiKey);
  const subject = getStatusEmailSubject(params.status, params.lang);
  const html = getStatusEmailHtml({
    lang: params.lang,
    fullName: params.fullName,
    requestId: params.requestId,
    status: params.status,
    adminComment: params.adminComment,
  });

  const result = await resend.emails.send({
    from: "Caro Bara <info@carobara.com>",
    to: params.email,
    subject,
    html,
  });

  if (result.error) {
    throw new Error(result.error.message || "Failed to send status update email");
  }
}

async function updateRequestStatus(formData: FormData) {
  "use server";

  const requestId = String(formData.get("requestId") || "").trim();
  const nextStatus = String(formData.get("status") || "").trim() as RequestStatus;
  const adminComment = String(formData.get("adminComment") || "").trim();

  if (!requestId) {
    throw new Error("Request id is missing");
  }

  if (!["new", "in_progress", "done"].includes(nextStatus)) {
    throw new Error("Invalid request status");
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase environment variables are missing");
  }

  const request = await getRequestById(requestId);

  if (!request) {
    throw new Error("Request not found");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/requests?id=eq.${encodeURIComponent(requestId)}`,
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
      `Failed to update request status: ${response.status} ${errorText || "Unknown error"}`
    );
  }

  const customer = request.customer || {};
  const customerEmail = String(customer.email || "").trim();

  if (customerEmail) {
    await sendStatusUpdateEmail({
      email: customerEmail,
      fullName: String(customer.fullName || ""),
      requestId: String(customer.requestId || ""),
      status: nextStatus,
      lang: normalizeLanguage(customer.requestLanguage),
      adminComment,
    });
  }

  revalidatePath("/admin/requests");
}

async function deleteRequest(formData: FormData) {
  "use server";

  const requestId = String(formData.get("requestId") || "").trim();

  if (!requestId) {
    throw new Error("Request id is missing");
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase environment variables are missing");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/requests?id=eq.${encodeURIComponent(requestId)}`,
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
      `Failed to delete request: ${response.status} ${errorText || "Unknown error"}`
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
  const requests = await getRequests();

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
          {adminText.totalCount[lang]}: {requests.length}
        </div>

        {requests.length === 0 ? (
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
            {requests.map((request) => {
              const customer = request.customer || {};
              const statusStyles = getStatusStyles(request.status);

              return (
                <div
                  key={request.id}
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
                          fontSize: "18px",
                          color: "#8a6c4d",
                          fontWeight: 700,
                          marginBottom: "6px",
                        }}
                      >
                        {adminText.requestNumber[lang]}:{" "}
                        {getSafeText(customer.requestId, lang)}
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
                        {formatDate(request.created_at, lang)}
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
                        {getStatusLabel(request.status, lang)}
                      </div>

                      <form
                        action={updateRequestStatus}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          width: "100%",
                        }}
                      >
                        <input type="hidden" name="requestId" value={request.id} />

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
                            defaultValue={request.status || "new"}
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
                            <option value="new">
                              {getStatusLabel("new", lang)}
                            </option>
                            <option value="in_progress">
                              {getStatusLabel("in_progress", lang)}
                            </option>
                            <option value="done">
                              {getStatusLabel("done", lang)}
                            </option>
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
                        action={deleteRequest}
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          alignItems: lang === "ar" ? "flex-end" : "flex-start",
                        }}
                      >
                        <input type="hidden" name="requestId" value={request.id} />

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
                          {adminText.email[lang]}:{" "}
                          {getSafeText(customer.email, lang)}
                        </div>
                        <div>
                          {adminText.phone[lang]}:{" "}
                          {getSafeText(customer.phone, lang)}
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
                          {adminText.street[lang]}:{" "}
                          {getSafeText(customer.street, lang)}
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
                          {adminText.city[lang]}:{" "}
                          {getSafeText(customer.city, lang)}
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
                          {adminText.channel[lang]}:{" "}
                          {getSafeText(request.channel, lang)}
                        </div>
                        <div>
                          {adminText.subject[lang]}:{" "}
                          {getSafeText(customer.subject, lang)}
                        </div>
                        <div>
                          {adminText.date[lang]}:{" "}
                          {formatDate(request.created_at, lang)}
                        </div>
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