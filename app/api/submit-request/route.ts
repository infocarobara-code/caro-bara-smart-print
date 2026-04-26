import { NextResponse } from "next/server";
import { Resend } from "resend";
import { randomInt } from "crypto";
import { buildEmailAssets } from "@/lib/documents/email-assets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RequestLanguage = "ar" | "de" | "en";

type CustomerData = {
  fullName?: string;
  email?: string;
  phone?: string;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
};

type SubmitRequestBody = {
  customerData?: CustomerData;
  fullName?: string;
  email?: string;
  phone?: string;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  subject?: string;
  message?: string;
  items?: unknown[];
  formData?: Record<string, unknown>;
  lang?: string;
  language?: string;
  sourcePath?: string;
  serviceId?: string;
  serviceName?: string;
};

type RequestCustomerPayload = {
  requestId: string;
  receivedAt: string;
  requestLanguage: RequestLanguage;
  fullName: string;
  email: string;
  phone: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  subject: string;
  message: string;
  sourcePath: string;
  serviceId: string;
  serviceName: string;
  items: unknown[];
  formData: Record<string, unknown>;
  ownerEmailDeliveredTo: string;
  customerEmailSent: boolean;
  ownerEmailSent: boolean;
};

type SupabaseInsertedRow = {
  id: string;
};

function normalizeString(value: unknown): string {
  return String(value ?? "").trim();
}

function normalizeLanguage(value: unknown): RequestLanguage {
  return value === "ar" || value === "de" || value === "en" ? value : "en";
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatOptionalLine(label: string, value: string): string {
  if (!value) return "";
  return `<p style="margin: 0 0 8px;"><strong>${escapeHtml(
    label
  )}:</strong> ${escapeHtml(value)}</p>`;
}

function getLocalizedCustomerSubject(
  lang: RequestLanguage,
  requestId: string
): string {
  if (lang === "ar") {
    return `تم استلام طلبكم بنجاح - ${requestId} - Caro Bara Smart Print`;
  }

  if (lang === "de") {
    return `Ihre Anfrage wurde erfolgreich erhalten - ${requestId} - Caro Bara Smart Print`;
  }

  return `Your request was received successfully - ${requestId} - Caro Bara Smart Print`;
}

function getOwnerSubject(
  lang: RequestLanguage,
  requestId: string,
  fullName: string
): string {
  const safeName = fullName || "Unknown Customer";

  if (lang === "ar") {
    return `طلب داخلي جديد - ${safeName} - ${requestId}`;
  }

  if (lang === "de") {
    return `Neue interne Anfrage - ${safeName} - ${requestId}`;
  }

  return `New Internal Request - ${safeName} - ${requestId}`;
}

function getWorkingHoursHtml(lang: RequestLanguage): string {
  if (lang === "ar") {
    return "أوقات العمل: الإثنين–الجمعة 09:00–18:00 | السبت 09:00–15:00 | الأحد عطلة";
  }

  if (lang === "de") {
    return "Öffnungszeiten: Mo–Fr 09:00–18:00 | Sa 09:00–15:00 | So geschlossen";
  }

  return "Working hours: Mon–Fri 09:00–18:00 | Sat 09:00–15:00 | Sun closed";
}

function getValidatedEnv(name: string): string {
  const value = normalizeString(process.env[name]);

  if (!value) {
    throw new Error(`${name} is missing`);
  }

  return value;
}

function getOwnerReceiverEmail(): string {
  const ownerEmail = normalizeString(
    process.env.REQUEST_RECEIVER_EMAIL ||
      process.env.CONTACT_RECEIVER_EMAIL ||
      process.env.FALLBACK_RECEIVER_EMAIL ||
      "info@carobara.com"
  ).toLowerCase();

  if (!ownerEmail || !isValidEmail(ownerEmail)) {
    throw new Error("Owner receiver email is missing or invalid");
  }

  return ownerEmail;
}

function getResendFromEmail(): string {
  const fromEmail = normalizeString(process.env.RESEND_FROM_EMAIL).toLowerCase();

  if (!fromEmail) {
    throw new Error("RESEND_FROM_EMAIL is missing");
  }

  if (!isValidEmail(fromEmail)) {
    throw new Error("RESEND_FROM_EMAIL is invalid");
  }

  return fromEmail;
}

function buildRequestCustomerPayload(
  customerPayload: RequestCustomerPayload
): Record<string, unknown> {
  return {
    requestId: customerPayload.requestId,
    receivedAt: customerPayload.receivedAt,
    requestLanguage: customerPayload.requestLanguage,
    fullName: customerPayload.fullName,
    email: customerPayload.email,
    phone: customerPayload.phone,
    street: customerPayload.street,
    houseNumber: customerPayload.houseNumber,
    postalCode: customerPayload.postalCode,
    city: customerPayload.city,
    subject: customerPayload.subject,
    message: customerPayload.message,
  };
}

function buildServicePayload(customerPayload: RequestCustomerPayload) {
  return {
    serviceId: customerPayload.serviceId,
    serviceName: customerPayload.serviceName,
    sourcePath: customerPayload.sourcePath,
  };
}

function buildMetaPayload(customerPayload: RequestCustomerPayload) {
  return {
    requestId: customerPayload.requestId,
    receivedAt: customerPayload.receivedAt,
    requestLanguage: customerPayload.requestLanguage,
    sourcePath: customerPayload.sourcePath,
    ownerEmailDeliveredTo: customerPayload.ownerEmailDeliveredTo,
    ownerEmailSent: customerPayload.ownerEmailSent,
    customerEmailSent: customerPayload.customerEmailSent,
  };
}

function getSupabaseRequestPayload(customerPayload: RequestCustomerPayload) {
  return {
    status: "new",
    channel: "website",
    customer: buildRequestCustomerPayload(customerPayload),
    service: buildServicePayload(customerPayload),
    subject: customerPayload.subject,
    message: customerPayload.message,
    items: customerPayload.items,
    form_data: customerPayload.formData,
    notes: "",
    meta: buildMetaPayload(customerPayload),
  };
}

function getCompanyFooterHtml(lang: RequestLanguage): string {
  const companyName = "Caro Bara Smart Print";
  const teamName = "Caro Bara Team";
  const primaryEmail = "info@carobara.com";
  const secondaryEmail = "info@carobara.de";
  const primaryPhone = "+49 176 21105086";
  const secondaryPhone = "+49 30 68965559";
  const address = "Fanninger Straße 20, 10365 Berlin";
  const workingHours = getWorkingHoursHtml(lang);

  return `
    <div style="margin-top:22px; padding-top:18px; border-top:1px solid #eadbca; font-size:13px; line-height:1.9; color:#6b5a49;">
      <div style="font-weight:800; color:#1f1711; margin-bottom:6px;">${escapeHtml(
        companyName
      )}</div>
      <div>${escapeHtml(teamName)}</div>
      <div>${escapeHtml(address)}</div>
      <div>${escapeHtml(workingHours)}</div>
      <div>
        <a href="mailto:${escapeHtml(
          primaryEmail
        )}" style="color:#6b5a49; text-decoration:none;">${escapeHtml(
    primaryEmail
  )}</a>
        &nbsp;|&nbsp;
        <a href="mailto:${escapeHtml(
          secondaryEmail
        )}" style="color:#6b5a49; text-decoration:none;">${escapeHtml(
    secondaryEmail
  )}</a>
      </div>
      <div>
        <a href="tel:${escapeHtml(
          primaryPhone.replace(/\s+/g, "")
        )}" style="color:#6b5a49; text-decoration:none;">${escapeHtml(
    primaryPhone
  )}</a>
        &nbsp;|&nbsp;
        <a href="tel:${escapeHtml(
          secondaryPhone.replace(/\s+/g, "")
        )}" style="color:#6b5a49; text-decoration:none;">${escapeHtml(
    secondaryPhone
  )}</a>
      </div>
    </div>
  `;
}

function getQrCardHtml(lang: RequestLanguage, requestId: string): string {
  const safeRequestId = escapeHtml(requestId);

  if (lang === "ar") {
    return `
      <div style="margin:20px 0 0; padding:18px; border:1px solid #e8dacb; border-radius:16px; background:#ffffff;">
        <div style="font-size:14px; font-weight:800; color:#1f1711; margin-bottom:8px;">
          رمز QR المرجعي
        </div>
        <div style="font-size:13px; line-height:1.8; color:#6b5a49; margin-bottom:12px;">
          هذا الرمز مرتبط بهذا الطلب ويمكن استخدامه للمراجعة والأرشفة والتنظيم الداخلي.
        </div>
        <div style="display:block; text-align:center; margin-bottom:10px;">
          <img
            src="cid:operation-qr-code"
            alt="QR Code"
            width="148"
            height="148"
            style="display:inline-block; width:148px; height:148px; border:1px solid #eadbca; border-radius:12px; background:#ffffff; padding:8px;"
          />
        </div>
        <div style="font-size:12px; color:#7a624c; text-align:center;">
          ${safeRequestId}
        </div>
      </div>
    `;
  }

  if (lang === "de") {
    return `
      <div style="margin:20px 0 0; padding:18px; border:1px solid #e8dacb; border-radius:16px; background:#ffffff;">
        <div style="font-size:14px; font-weight:800; color:#1f1711; margin-bottom:8px;">
          QR-Referenzcode
        </div>
        <div style="font-size:13px; line-height:1.8; color:#6b5a49; margin-bottom:12px;">
          Dieser Code ist mit dieser Anfrage verknüpft und kann für Prüfung, Archivierung und interne Organisation verwendet werden.
        </div>
        <div style="display:block; text-align:center; margin-bottom:10px;">
          <img
            src="cid:operation-qr-code"
            alt="QR Code"
            width="148"
            height="148"
            style="display:inline-block; width:148px; height:148px; border:1px solid #eadbca; border-radius:12px; background:#ffffff; padding:8px;"
          />
        </div>
        <div style="font-size:12px; color:#7a624c; text-align:center;">
          ${safeRequestId}
        </div>
      </div>
    `;
  }

  return `
    <div style="margin:20px 0 0; padding:18px; border:1px solid #e8dacb; border-radius:16px; background:#ffffff;">
      <div style="font-size:14px; font-weight:800; color:#1f1711; margin-bottom:8px;">
        QR Reference
      </div>
      <div style="font-size:13px; line-height:1.8; color:#6b5a49; margin-bottom:12px;">
        This code is linked to this request and can be used for review, archiving, and internal organization.
      </div>
      <div style="display:block; text-align:center; margin-bottom:10px;">
        <img
          src="cid:operation-qr-code"
          alt="QR Code"
          width="148"
          height="148"
          style="display:inline-block; width:148px; height:148px; border:1px solid #eadbca; border-radius:12px; background:#ffffff; padding:8px;"
        />
      </div>
      <div style="font-size:12px; color:#7a624c; text-align:center;">
        ${safeRequestId}
      </div>
    </div>
  `;
}

function getLocalizedCustomerHtml(
  lang: RequestLanguage,
  fullName: string,
  requestId: string
): string {
  const safeName = escapeHtml(fullName || "");
  const safeRequestId = escapeHtml(requestId);
  const companyFooter = getCompanyFooterHtml(lang);
  const qrCard = getQrCardHtml(lang, requestId);

  if (lang === "ar") {
    return `
      <div style="margin:0; padding:32px 16px; background:#f7f2ec; font-family:Arial, Helvetica, sans-serif; direction:rtl; text-align:right; color:#1f1711;">
        <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5d7c8; border-radius:20px; overflow:hidden; box-shadow:0 12px 30px rgba(44,30,18,0.08);">
          <div style="padding:24px 28px; background:linear-gradient(135deg, #f8efe3 0%, #fffaf4 100%); border-bottom:1px solid #eadbca;">
            <div style="font-size:12px; font-weight:700; letter-spacing:0.4px; color:#8a6a47; margin-bottom:10px;">
              CARO BARA SMART PRINT • BERLIN
            </div>
            <h1 style="margin:0; font-size:28px; line-height:1.3; color:#1f1711;">
              شكرًا لكم، تم استلام طلبكم بنجاح
            </h1>
          </div>

          <div style="padding:28px;">
            <p style="margin:0 0 14px; font-size:16px; line-height:1.9;">
              ${safeName || "عميلنا الكريم"}،
              نشكركم على ثقتكم بـ <strong>Caro Bara Smart Print</strong>. لقد وصل طلبكم إلى فريقنا بنجاح، وسنقوم بمراجعته بعناية واهتمام.
            </p>

            <p style="margin:0 0 14px; font-size:15px; line-height:1.9; color:#4b3a2a;">
              هدفنا أن نقدم لكم معالجة واضحة واحترافية للطلب، مع متابعة دقيقة للتفاصيل قبل التواصل معكم بالعرض أو الخطوة التالية.
            </p>

            <div style="margin:18px 0; padding:16px 18px; background:#f8f1e8; border:1px solid #e8dacb; border-radius:14px;">
              <div style="font-size:13px; color:#7a624c; margin-bottom:6px;">رقم الطلب المرجعي</div>
              <div style="font-size:18px; font-weight:800; color:#1f1711;">${safeRequestId}</div>
            </div>

            <div style="margin:18px 0; padding:16px 18px; background:#fffaf4; border:1px solid #eadbca; border-radius:14px;">
              <div style="font-size:14px; line-height:1.9; color:#3f3125;">
                <strong>ماذا بعد؟</strong><br />
                سيقوم فريقنا بمراجعة الطلب والتواصل معكم قريبًا عبر البريد الإلكتروني أو الهاتف إذا قمتم بإدخاله.
              </div>
            </div>

            ${qrCard}

            <div style="margin-top:18px; font-size:13px; line-height:1.9; color:#7a624c;">
              هذه رسالة تأكيد استلام فقط. تم أيضًا إرفاق ملف PDF احترافي يحتوي على تفاصيل الطلب ومرجعه التنظيمي، بالإضافة إلى ملف الشروط والأحكام.
            </div>

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
    return `
      <div style="margin:0; padding:32px 16px; background:#f7f2ec; font-family:Arial, Helvetica, sans-serif; color:#1f1711;">
        <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5d7c8; border-radius:20px; overflow:hidden; box-shadow:0 12px 30px rgba(44,30,18,0.08);">
          <div style="padding:24px 28px; background:linear-gradient(135deg, #f8efe3 0%, #fffaf4 100%); border-bottom:1px solid #eadbca;">
            <div style="font-size:12px; font-weight:700; letter-spacing:0.4px; color:#8a6a47; margin-bottom:10px;">
              CARO BARA SMART PRINT • BERLIN
            </div>
            <h1 style="margin:0; font-size:28px; line-height:1.3; color:#1f1711;">
              Vielen Dank – Ihre Anfrage ist eingegangen
            </h1>
          </div>

          <div style="padding:28px;">
            <p style="margin:0 0 14px; font-size:16px; line-height:1.9;">
              ${safeName || "Vielen Dank"},
              wir schätzen Ihr Vertrauen in <strong>Caro Bara Smart Print</strong>. Ihre Anfrage wurde erfolgreich an unser Team übermittelt und wird nun sorgfältig geprüft.
            </p>

            <p style="margin:0 0 14px; font-size:15px; line-height:1.9; color:#4b3a2a;">
              Unser Ziel ist eine klare, professionelle Bearbeitung Ihrer Anfrage mit genauer Prüfung der Details, bevor wir uns mit dem nächsten passenden Schritt bei Ihnen melden.
            </p>

            <div style="margin:18px 0; padding:16px 18px; background:#f8f1e8; border:1px solid #e8dacb; border-radius:14px;">
              <div style="font-size:13px; color:#7a624c; margin-bottom:6px;">Referenznummer</div>
              <div style="font-size:18px; font-weight:800; color:#1f1711;">${safeRequestId}</div>
            </div>

            <div style="margin:18px 0; padding:16px 18px; background:#fffaf4; border:1px solid #eadbca; border-radius:14px;">
              <div style="font-size:14px; line-height:1.9; color:#3f3125;">
                <strong>Wie geht es weiter?</strong><br />
                Unser Team prüft Ihre Anfrage und meldet sich in Kürze per E-Mail oder telefonisch, falls eine Nummer angegeben wurde.
              </div>
            </div>

            ${qrCard}

            <div style="margin-top:18px; font-size:13px; line-height:1.9; color:#7a624c;">
              Dies ist eine Empfangsbestätigung. Zusätzlich erhalten Sie ein professionelles PDF mit den wichtigsten Referenzdaten sowie unsere AGB als PDF-Anhang.
            </div>

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

  return `
    <div style="margin:0; padding:32px 16px; background:#f7f2ec; font-family:Arial, Helvetica, sans-serif; color:#1f1711;">
      <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5d7c8; border-radius:20px; overflow:hidden; box-shadow:0 12px 30px rgba(44,30,18,0.08);">
        <div style="padding:24px 28px; background:linear-gradient(135deg, #f8efe3 0%, #fffaf4 100%); border-bottom:1px solid #eadbca;">
          <div style="font-size:12px; font-weight:700; letter-spacing:0.4px; color:#8a6a47; margin-bottom:10px;">
            CARO BARA SMART PRINT • BERLIN
          </div>
          <h1 style="margin:0; font-size:28px; line-height:1.3; color:#1f1711;">
            Thank you – your request has been received
          </h1>
        </div>

        <div style="padding:28px;">
          <p style="margin:0 0 14px; font-size:16px; line-height:1.9;">
            ${safeName || "Thank you"},
            we truly appreciate your trust in <strong>Caro Bara Smart Print</strong>. Your request has been successfully received and forwarded to our team for review.
          </p>

          <p style="margin:0 0 14px; font-size:15px; line-height:1.9; color:#4b3a2a;">
            Our goal is to handle your request with clarity, care, and professional attention before reaching out with the next suitable step.
          </p>

          <div style="margin:18px 0; padding:16px 18px; background:#f8f1e8; border:1px solid #e8dacb; border-radius:14px;">
            <div style="font-size:13px; color:#7a624c; margin-bottom:6px;">Reference ID</div>
            <div style="font-size:18px; font-weight:800; color:#1f1711;">${safeRequestId}</div>
          </div>

          <div style="margin:18px 0; padding:16px 18px; background:#fffaf4; border:1px solid #eadbca; border-radius:14px;">
            <div style="font-size:14px; line-height:1.9; color:#3f3125;">
              <strong>What happens next?</strong><br />
              Our team will review your request and contact you shortly by email or phone if a number was provided.
            </div>
          </div>

          ${qrCard}

          <div style="margin-top:18px; font-size:13px; line-height:1.9; color:#7a624c;">
            This is a confirmation of receipt. A professional PDF with the key reference data and our terms and conditions are also attached.
          </div>

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

function getOwnerHtml(params: {
  lang: RequestLanguage;
  requestId: string;
  receivedAt: string;
  fullName: string;
  email: string;
  phone: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  subject: string;
  message: string;
  sourcePath: string;
  serviceId: string;
  serviceName: string;
}): string {
  const {
    lang,
    requestId,
    receivedAt,
    fullName,
    email,
    phone,
    street,
    houseNumber,
    postalCode,
    city,
    subject,
    message,
    sourcePath,
    serviceId,
    serviceName,
  } = params;

  const title =
    lang === "ar"
      ? "تم استلام طلب داخلي جديد"
      : lang === "de"
        ? "Neue interne Anfrage eingegangen"
        : "New internal request received";

  const qrCard = getQrCardHtml(lang, requestId);

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #1f1711; max-width: 820px;">
      <h2 style="margin: 0 0 18px;">${escapeHtml(title)}</h2>

      <div style="margin-bottom: 18px; padding: 16px; border: 1px solid #e3d4c2; border-radius: 16px; background: #fffaf4;">
        ${formatOptionalLine("Request ID", requestId)}
        ${formatOptionalLine("Received At", receivedAt)}
        ${formatOptionalLine("Full Name", fullName)}
        ${formatOptionalLine("Email", email)}
        ${formatOptionalLine("Phone", phone)}
        ${formatOptionalLine("Street", street)}
        ${formatOptionalLine("House Number", houseNumber)}
        ${formatOptionalLine("Postal Code", postalCode)}
        ${formatOptionalLine("City", city)}
        ${formatOptionalLine("Source Path", sourcePath)}
        ${formatOptionalLine("Service ID", serviceId)}
        ${formatOptionalLine("Service Name", serviceName)}
        ${formatOptionalLine("Subject", subject)}
      </div>

      <div style="margin-bottom: 18px;">
        <h3 style="margin: 0 0 10px;">Message</h3>
        <pre style="white-space: pre-wrap; word-break: break-word; background: #f8f1e8; padding: 12px; border-radius: 12px; border: 1px solid #e3d4c2; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.8;">${escapeHtml(
          message || "—"
        )}</pre>
      </div>

      ${qrCard}
    </div>
  `;
}

function getBase64ContentFromDataUrl(dataUrl: string): string {
  const value = normalizeString(dataUrl);

  if (!value.startsWith("data:")) {
    return value;
  }

  const commaIndex = value.indexOf(",");

  if (commaIndex === -1) {
    throw new Error("Invalid data URL content");
  }

  return value.slice(commaIndex + 1);
}

async function saveRequestToSupabase(params: {
  customerPayload: RequestCustomerPayload;
}) {
  const supabaseUrl = getValidatedEnv("SUPABASE_URL");
  const supabaseServiceRoleKey = getValidatedEnv("SUPABASE_SERVICE_ROLE_KEY");

  const payload = getSupabaseRequestPayload(params.customerPayload);

  const response = await fetch(`${supabaseUrl}/rest/v1/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Supabase insert failed: ${response.status} ${errorText || "Unknown error"}`
    );
  }

  const data = (await response.json()) as unknown;

  if (!Array.isArray(data) || data.length === 0) {
    console.error("Supabase raw response:", data);
    throw new Error("Supabase did not return a valid inserted row");
  }

  const insertedRow = data[0] as unknown;

  if (
    !insertedRow ||
    typeof insertedRow !== "object" ||
    !("id" in insertedRow) ||
    typeof (insertedRow as { id?: unknown }).id !== "string" ||
    !(insertedRow as { id?: string }).id?.trim()
  ) {
    console.error("Invalid inserted row:", insertedRow);
    throw new Error("Inserted row does not contain id");
  }

  return (insertedRow as SupabaseInsertedRow).id;
}

async function updateSupabaseRequestByRowId(params: {
  rowId: string;
  customerPayload: RequestCustomerPayload;
}) {
  const supabaseUrl = normalizeString(process.env.SUPABASE_URL);
  const supabaseServiceRoleKey = normalizeString(
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return;
  }

  const payload = getSupabaseRequestPayload(params.customerPayload);

  const response = await fetch(
    `${supabaseUrl}/rest/v1/requests?id=eq.${encodeURIComponent(params.rowId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.warn(
      "Supabase request update failed:",
      response.status,
      errorText || "Unknown error"
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SubmitRequestBody;

    const lang = normalizeLanguage(body?.language || body?.lang);
    const customerData = body?.customerData ?? {};

    const fullName = normalizeString(body?.fullName || customerData.fullName);
    const email = normalizeString(
      body?.email || customerData.email
    ).toLowerCase();
    const phone = normalizeString(body?.phone || customerData.phone);
    const street = normalizeString(body?.street || customerData.street);
    const houseNumber = normalizeString(
      body?.houseNumber || customerData.houseNumber
    );
    const postalCode = normalizeString(
      body?.postalCode || customerData.postalCode
    );
    const city = normalizeString(body?.city || customerData.city);

    const subject = normalizeString(body?.subject);
    const message = normalizeString(body?.message);
    const sourcePath = normalizeString(body?.sourcePath);
    const serviceId = normalizeString(body?.serviceId);
    const serviceName = normalizeString(body?.serviceName);
    const items = Array.isArray(body?.items) ? body.items : [];
    const formData =
      body?.formData && typeof body.formData === "object" ? body.formData : {};

    const receivedAt = new Date().toISOString();
    const requestId = generateRequestId(receivedAt.slice(0, 10));

    if (!fullName || !email || !street || !houseNumber || !postalCode || !city) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required customer fields",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email address",
        },
        { status: 400 }
      );
    }

    const ownerEmail = getOwnerReceiverEmail();

    const customerPayload: RequestCustomerPayload = {
      requestId,
      receivedAt,
      requestLanguage: lang,
      fullName,
      email,
      phone,
      street,
      houseNumber,
      postalCode,
      city,
      subject,
      message,
      sourcePath,
      serviceId,
      serviceName,
      items,
      formData,
      ownerEmailDeliveredTo: ownerEmail,
      customerEmailSent: false,
      ownerEmailSent: false,
    };

    const supabaseRowId = await saveRequestToSupabase({
      customerPayload,
    });

    let ownerEmailSent = false;
    let customerEmailSent = false;
    const emailWarnings: string[] = [];

    try {
      const apiKey = getValidatedEnv("RESEND_API_KEY");
      const fromEmail = getResendFromEmail();

      const emailAssets = await buildEmailAssets({
        identityInput: {
          kind: "request",
          language: lang,
          requestId,
          referenceNumber: requestId,
          status: "new",
          serviceType: serviceName || serviceId,
          subject,
          message,
          createdAt: receivedAt,
          updatedAt: receivedAt,
          customer: {
            fullName,
            email,
            phone,
            address: {
              street,
              houseNumber,
              postalCode,
              city,
            },
          },
          appointmentWindow: {},
          extra: {
            sourcePath,
            serviceId,
            serviceName,
            itemsCount: items.length,
          },
        },
      });

      const qrBase64 = getBase64ContentFromDataUrl(emailAssets.qrDataUrl);

      const commonAttachments = [
        {
          content: qrBase64,
          filename: `${requestId}-qr.png`,
          contentId: "operation-qr-code",
        },
        {
          content: emailAssets.pdfBuffer,
          filename: emailAssets.pdfFileName,
        },
        {
          content: emailAssets.agbPdfBuffer,
          filename: emailAssets.agbPdfFileName,
        },
      ];

      const customerSubject = getLocalizedCustomerSubject(lang, requestId);
      const customerHtml = getLocalizedCustomerHtml(lang, fullName, requestId);
      const ownerSubject = getOwnerSubject(lang, requestId, fullName);
      const ownerHtml = getOwnerHtml({
        lang,
        requestId,
        receivedAt,
        fullName,
        email,
        phone,
        street,
        houseNumber,
        postalCode,
        city,
        subject,
        message,
        sourcePath,
        serviceId,
        serviceName,
      });

      const resend = new Resend(apiKey);

      const ownerSendResult = await resend.emails.send({
        from: `Caro Bara <${fromEmail}>`,
        to: ownerEmail,
        replyTo: email,
        subject: ownerSubject,
        html: ownerHtml,
        attachments: commonAttachments,
      });

      if (ownerSendResult.error) {
        const ownerErrorMessage =
          ownerSendResult.error.message || "Owner notification email failed";
        emailWarnings.push(`OWNER_EMAIL_FAILED: ${ownerErrorMessage}`);
      } else {
        ownerEmailSent = true;
      }

      const customerSendResult = await resend.emails.send({
        from: `Caro Bara <${fromEmail}>`,
        to: email,
        replyTo: ownerEmail,
        subject: customerSubject,
        html: customerHtml,
        attachments: commonAttachments,
      });

      if (customerSendResult.error) {
        const customerErrorMessage =
          customerSendResult.error.message ||
          "Customer confirmation email failed";
        emailWarnings.push(`CUSTOMER_EMAIL_FAILED: ${customerErrorMessage}`);
      } else {
        customerEmailSent = true;
      }

      if (!ownerEmailSent || !customerEmailSent) {
        throw new Error(
          [
            "EMAIL_DELIVERY_FAILED",
            `from=${fromEmail}`,
            `ownerTo=${ownerEmail}`,
            `customerTo=${email}`,
            ...emailWarnings,
          ].join(" | ")
        );
      }
    } catch (emailError) {
      const finalEmailError =
        emailError instanceof Error
          ? emailError.message
          : "Email sending failed";

      emailWarnings.push(finalEmailError);

      const updatedCustomerPayload: RequestCustomerPayload = {
        ...customerPayload,
        ownerEmailSent,
        customerEmailSent,
      };

      await updateSupabaseRequestByRowId({
        rowId: supabaseRowId,
        customerPayload: updatedCustomerPayload,
      });

      return NextResponse.json(
        {
          success: false,
          error: finalEmailError,
          requestId,
          receivedAt,
          requestLanguage: lang,
          deliveredTo: ownerEmail,
          savedToDatabase: true,
          supabaseRowId,
          ownerEmailSent,
          customerEmailSent,
          emailWarnings,
        },
        { status: 500 }
      );
    }

    const updatedCustomerPayload: RequestCustomerPayload = {
      ...customerPayload,
      ownerEmailSent,
      customerEmailSent,
    };

    await updateSupabaseRequestByRowId({
      rowId: supabaseRowId,
      customerPayload: updatedCustomerPayload,
    });

    return NextResponse.json({
      success: true,
      requestId,
      receivedAt,
      requestLanguage: lang,
      deliveredTo: ownerEmail,
      savedToDatabase: true,
      supabaseRowId,
      ownerEmailSent,
      customerEmailSent,
      emailWarnings,
    });
  } catch (error) {
    console.error("🔥 FULL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "UNKNOWN ERROR",
      },
      { status: 500 }
    );
  }
}