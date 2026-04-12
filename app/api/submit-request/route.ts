import { NextResponse } from "next/server";
import { Resend } from "resend";

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
  categoryId?: string;
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
  categoryId: string;
  items: unknown[];
  formData: Record<string, unknown>;
  ownerEmailDeliveredTo: string;
  customerEmailSent: boolean;
  ownerEmailSent: boolean;
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

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
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

function getLocalizedCustomerSubject(lang: RequestLanguage): string {
  if (lang === "ar") return "تم استلام طلبك بنجاح - Caro Bara Smart Print";
  if (lang === "de") {
    return "Ihre Anfrage wurde erfolgreich erhalten - Caro Bara Smart Print";
  }
  return "Your request was received successfully - Caro Bara Smart Print";
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
  );

  if (!ownerEmail || !isValidEmail(ownerEmail)) {
    throw new Error("Owner receiver email is missing or invalid");
  }

  return ownerEmail;
}

function getResendFromEmail(): string {
  const candidates = [
    normalizeString(process.env.RESEND_FROM_EMAIL),
    normalizeString(process.env.CONTACT_FROM_EMAIL),
    normalizeString(process.env.REQUEST_FROM_EMAIL),
    "onboarding@resend.dev",
  ];

  for (const value of candidates) {
    if (value && isValidEmail(value)) {
      return value;
    }
  }

  throw new Error("No valid sender email configured for Resend");
}

function getCompanyFooterHtml(lang: RequestLanguage): string {
  const companyName = "Caro Bara Smart Print";
  const teamName = "Caro Bara Team";
  const primaryEmail = "info@carobara.com";
  const secondaryEmail = "info@carobara.de";
  const primaryPhone = "+49 176 21105086";
  const secondaryPhone = "+94 3068965559";
  const address = "Fanninger Straße 20, 10365 Berlin";
  const workingHours = getWorkingHoursHtml(lang);

  if (lang === "ar") {
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

  if (lang === "de") {
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
}function getLocalizedCustomerHtml(
  lang: RequestLanguage,
  fullName: string,
  requestId: string
): string {
  const safeName = escapeHtml(fullName || "");
  const safeRequestId = escapeHtml(requestId);
  const companyFooter = getCompanyFooterHtml(lang);

  if (lang === "ar") {
    return `
      <div style="margin:0; padding:32px 16px; background:#f7f2ec; font-family:Arial, Helvetica, sans-serif; direction:rtl; text-align:right; color:#1f1711;">
        <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5d7c8; border-radius:20px; overflow:hidden; box-shadow:0 12px 30px rgba(44,30,18,0.08);">
          <div style="padding:24px 28px; background:linear-gradient(135deg, #f8efe3 0%, #fffaf4 100%); border-bottom:1px solid #eadbca;">
            <div style="font-size:12px; font-weight:700; letter-spacing:0.4px; color:#8a6a47; margin-bottom:10px;">
              CARO BARA SMART PRINT • BERLIN
            </div>
            <h1 style="margin:0; font-size:28px; line-height:1.3; color:#1f1711;">
              شكرًا لك، تم استلام طلبك بنجاح
            </h1>
          </div>

          <div style="padding:28px;">
            <p style="margin:0 0 14px; font-size:16px; line-height:1.9;">
              ${safeName || "عميلنا الكريم"}،
              نشكرك على ثقتك بـ <strong>Caro Bara Smart Print</strong>. لقد وصل طلبك إلى فريقنا بنجاح، وسنقوم بمراجعته بعناية واهتمام.
            </p>

            <p style="margin:0 0 14px; font-size:15px; line-height:1.9; color:#4b3a2a;">
              هدفنا أن نقدم لك معالجة واضحة واحترافية للطلب، مع متابعة دقيقة للتفاصيل قبل التواصل معك بالعرض أو الخطوة التالية.
            </p>

            <div style="margin:18px 0; padding:16px 18px; background:#f8f1e8; border:1px solid #e8dacb; border-radius:14px;">
              <div style="font-size:13px; color:#7a624c; margin-bottom:6px;">رقم الطلب المرجعي</div>
              <div style="font-size:18px; font-weight:800; color:#1f1711;">${safeRequestId}</div>
            </div>

            <div style="margin:18px 0; padding:16px 18px; background:#fffaf4; border:1px solid #eadbca; border-radius:14px;">
              <div style="font-size:14px; line-height:1.9; color:#3f3125;">
                <strong>ماذا بعد؟</strong><br />
                سيقوم فريقنا بمراجعة الطلب والتواصل معك قريبًا عبر البريد الإلكتروني أو الهاتف إذا قمت بإدخاله.
              </div>
            </div>

            <div style="margin-top:18px; font-size:13px; line-height:1.9; color:#7a624c;">
              هذه رسالة تأكيد استلام فقط. سيتم مراجعة الطلب والتواصل معك لاحقًا.
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

            <div style="margin-top:18px; font-size:13px; line-height:1.9; color:#7a624c;">
              Dies ist eine Empfangsbestätigung. Ihre Anfrage wird geprüft und wir melden uns zeitnah.
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

          <div style="margin-top:18px; font-size:13px; line-height:1.9; color:#7a624c;">
            This is a confirmation of receipt. Your request will be reviewed and we will contact you shortly.
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
  categoryId: string;
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
    categoryId,
  } = params;

  const title =
    lang === "ar"
      ? "تم استلام طلب داخلي جديد"
      : lang === "de"
        ? "Neue interne Anfrage eingegangen"
        : "New internal request received";

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
        ${formatOptionalLine("Category ID", categoryId)}
        ${formatOptionalLine("Subject", subject)}
      </div>

      <div style="margin-bottom: 18px;">
        <h3 style="margin: 0 0 10px;">Message</h3>
        <pre style="white-space: pre-wrap; word-break: break-word; background: #f8f1e8; padding: 12px; border-radius: 12px; border: 1px solid #e3d4c2; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.8;">${escapeHtml(
          message || "—"
        )}</pre>
      </div>
    </div>
  `;
}

async function saveRequestToSupabase(params: {
  customerPayload: RequestCustomerPayload;
}) {
  const supabaseUrl = getValidatedEnv("SUPABASE_URL");
  const supabaseServiceRoleKey = getValidatedEnv("SUPABASE_SERVICE_ROLE_KEY");

  const customer = params.customerPayload;

  const payload = {
    status: "new",
    channel: "website",
    request_id: customer.requestId,
    request_language: customer.requestLanguage,
    full_name: customer.fullName,
    email: customer.email,
    phone: customer.phone,
    street: customer.street,
    house_number: customer.houseNumber,
    postal_code: customer.postalCode,
    city: customer.city,
    subject: customer.subject,
    message: customer.message,
    source_path: customer.sourcePath,
    service_id: customer.serviceId,
    service_name: customer.serviceName,
    category_id: customer.categoryId,
    items: customer.items,
    form_data: customer.formData,
    owner_email_delivered_to: customer.ownerEmailDeliveredTo,
    customer_email_sent: customer.customerEmailSent,
    owner_email_sent: customer.ownerEmailSent,
    received_at: customer.receivedAt,
  };

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

  const insertedRows = (await response.json()) as Array<{ id: string }>;
  const insertedRow = insertedRows?.[0];

  if (!insertedRow?.id) {
    throw new Error("Supabase insert succeeded but no row id was returned");
  }

  return insertedRow.id;
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

  const customer = params.customerPayload;

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
      body: JSON.stringify({
        request_id: customer.requestId,
        request_language: customer.requestLanguage,
        full_name: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        street: customer.street,
        house_number: customer.houseNumber,
        postal_code: customer.postalCode,
        city: customer.city,
        subject: customer.subject,
        message: customer.message,
        source_path: customer.sourcePath,
        service_id: customer.serviceId,
        service_name: customer.serviceName,
        category_id: customer.categoryId,
        items: customer.items,
        form_data: customer.formData,
        owner_email_delivered_to: customer.ownerEmailDeliveredTo,
        customer_email_sent: customer.customerEmailSent,
        owner_email_sent: customer.ownerEmailSent,
        received_at: customer.receivedAt,
      }),
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
}export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SubmitRequestBody;

    const lang = normalizeLanguage(body?.language || body?.lang);
    const customerData = body?.customerData ?? {};

    const fullName = normalizeString(body?.fullName || customerData.fullName);
    const email = normalizeString(body?.email || customerData.email);
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
    const categoryId = normalizeString(body?.categoryId);
    const items = Array.isArray(body?.items) ? body.items : [];
    const formData =
      body?.formData && typeof body.formData === "object" ? body.formData : {};

    const requestId = generateRequestId();
    const receivedAt = new Date().toISOString();

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

    const apiKey = getValidatedEnv("RESEND_API_KEY");
    const ownerEmail = getOwnerReceiverEmail();
    const fromEmail = getResendFromEmail();

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
      categoryId,
      items,
      formData,
      ownerEmailDeliveredTo: ownerEmail,
      customerEmailSent: false,
      ownerEmailSent: false,
    };

    const supabaseRowId = await saveRequestToSupabase({
      customerPayload,
    });

    const customerSubject = getLocalizedCustomerSubject(lang);
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
      categoryId,
    });

    const resend = new Resend(apiKey);

    const ownerSendResult = await resend.emails.send({
      from: `Caro Bara <${fromEmail}>`,
      to: ownerEmail,
      replyTo: email,
      subject: ownerSubject,
      html: ownerHtml,
    });

    if (ownerSendResult.error) {
      throw new Error(
        ownerSendResult.error.message ||
          "Failed to send owner notification email"
      );
    }

    let customerEmailSent = false;

    const customerSendResult = await resend.emails.send({
      from: `Caro Bara <${fromEmail}>`,
      to: email,
      subject: customerSubject,
      html: customerHtml,
    });

    if (customerSendResult.error) {
      console.warn(
        "Customer confirmation email failed, but owner email succeeded:",
        customerSendResult.error
      );
    } else {
      customerEmailSent = true;
    }

    const updatedCustomerPayload: RequestCustomerPayload = {
      ...customerPayload,
      ownerEmailSent: true,
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