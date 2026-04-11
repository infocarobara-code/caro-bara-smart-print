import { NextResponse } from "next/server";
import { Resend } from "resend";

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
  return `<p style="margin: 0 0 8px;"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`;
}

function stringifySafe(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value ?? "");
  }
}

function getLocalizedCustomerSubject(lang: RequestLanguage): string {
  if (lang === "ar") return "تم استلام طلبك - Caro Bara";
  if (lang === "de") return "Ihre Anfrage wurde erhalten - Caro Bara";
  return "Your request has been received - Caro Bara";
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

function getLocalizedCustomerHtml(
  lang: RequestLanguage,
  fullName: string,
  requestId: string
): string {
  const safeName = escapeHtml(fullName);
  const safeRequestId = escapeHtml(requestId);

  if (lang === "ar") {
    return `
      <div style="font-family: Arial, Helvetica, sans-serif; direction: rtl; text-align: right; color: #1f1711;">
        <h2 style="margin-bottom: 12px;">شكراً لك ${safeName || "عميلنا الكريم"}</h2>
        <p style="margin: 0 0 10px;">تم استلام طلبك الداخلي بنجاح.</p>
        <p style="margin: 0 0 10px;">سيتم مراجعته والتواصل معك قريباً عبر البريد الإلكتروني أو الهاتف إذا قمت بإدخاله.</p>
        <p style="margin: 0; color: #6b5a49;">رقم الطلب المرجعي: <strong>${safeRequestId}</strong></p>
      </div>
    `;
  }

  if (lang === "de") {
    return `
      <div style="font-family: Arial, Helvetica, sans-serif; color: #1f1711;">
        <h2 style="margin-bottom: 12px;">Vielen Dank ${safeName || "für Ihre Anfrage"}</h2>
        <p style="margin: 0 0 10px;">Ihre interne Anfrage wurde erfolgreich erhalten.</p>
        <p style="margin: 0 0 10px;">Wir prüfen sie und melden uns bald per E-Mail oder telefonisch, falls eine Nummer angegeben wurde.</p>
        <p style="margin: 0; color: #6b5a49;">Referenznummer: <strong>${safeRequestId}</strong></p>
      </div>
    `;
  }

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #1f1711;">
      <h2 style="margin-bottom: 12px;">Thank you ${safeName || ""}</h2>
      <p style="margin: 0 0 10px;">Your internal request has been received successfully.</p>
      <p style="margin: 0 0 10px;">We will review it and contact you shortly by email or phone if provided.</p>
      <p style="margin: 0; color: #6b5a49;">Reference ID: <strong>${safeRequestId}</strong></p>
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
  items: unknown[];
  formData?: Record<string, unknown>;
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
    items,
    formData,
  } = params;

  const itemsHtml = items.length
    ? `<pre style="white-space: pre-wrap; word-break: break-word; background: #f8f1e8; padding: 12px; border-radius: 12px; border: 1px solid #e3d4c2; font-family: Consolas, monospace; font-size: 12px; line-height: 1.6;">${escapeHtml(
        stringifySafe(items)
      )}</pre>`
    : `<p style="margin: 0;">—</p>`;

  const formDataHtml =
    formData && Object.keys(formData).length > 0
      ? `<pre style="white-space: pre-wrap; word-break: break-word; background: #f8f1e8; padding: 12px; border-radius: 12px; border: 1px solid #e3d4c2; font-family: Consolas, monospace; font-size: 12px; line-height: 1.6;">${escapeHtml(
          stringifySafe(formData)
        )}</pre>`
      : `<p style="margin: 0;">—</p>`;

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

      <div style="margin-bottom: 18px;">
        <h3 style="margin: 0 0 10px;">Items</h3>
        ${itemsHtml}
      </div>

      <div>
        <h3 style="margin: 0 0 10px;">Form Data</h3>
        ${formDataHtml}
      </div>
    </div>
  `;
}

export async function POST(req: Request) {
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

    const apiKey = normalizeString(process.env.RESEND_API_KEY);
    const ownerEmail = normalizeString(
      process.env.REQUEST_RECEIVER_EMAIL ||
        process.env.CONTACT_RECEIVER_EMAIL ||
        process.env.FALLBACK_RECEIVER_EMAIL ||
        "info@carobara.com"
    );

    const fromEmail = "info@carobara.com";

    if (!apiKey) {
      console.error("RESEND_API_KEY is missing.");

      return NextResponse.json(
        {
          success: false,
          error: "Email service is not configured",
        },
        { status: 500 }
      );
    }

    if (!ownerEmail || !isValidEmail(ownerEmail)) {
      console.error("Owner receiver email is missing or invalid.", ownerEmail);

      return NextResponse.json(
        {
          success: false,
          error: "Receiver email is not configured correctly",
        },
        { status: 500 }
      );
    }

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
      items,
      formData,
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
      console.error("Owner email sending failed:", ownerSendResult.error);

      return NextResponse.json(
        {
          success: false,
          error:
            ownerSendResult.error.message ||
            "Failed to send owner notification email",
        },
        { status: 500 }
      );
    }

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
    }

    return NextResponse.json({
      success: true,
      requestId,
      receivedAt,
      requestLanguage: lang,
      deliveredTo: ownerEmail,
    });
  } catch (error) {
    console.error("submit-request POST error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Internal request sending failed";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}