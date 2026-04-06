import { NextResponse } from "next/server";
import { Resend } from "resend";

type RequestLanguage = "ar" | "de" | "en";

type CustomerData = {
  fullName?: string;
  email?: string;
};

type SubmitRequestBody = {
  customerData?: CustomerData;
  lang?: string;
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

function getLocalizedSubject(lang: RequestLanguage): string {
  if (lang === "ar") return "تم استلام طلبك - Caro Bara";
  if (lang === "de") return "Ihre Anfrage wurde erhalten - Caro Bara";
  return "Your request has been received - Caro Bara";
}

function getLocalizedHtml(
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
        <p style="margin: 0 0 10px;">تم استلام طلبك بنجاح.</p>
        <p style="margin: 0 0 10px;">سيتم مراجعته والتواصل معك قريباً.</p>
        <p style="margin: 0; color: #6b5a49;">رقم الطلب المرجعي: <strong>${safeRequestId}</strong></p>
      </div>
    `;
  }

  if (lang === "de") {
    return `
      <div style="font-family: Arial, Helvetica, sans-serif; color: #1f1711;">
        <h2 style="margin-bottom: 12px;">Vielen Dank ${safeName || "für Ihre Anfrage"}</h2>
        <p style="margin: 0 0 10px;">Ihre Anfrage wurde erfolgreich erhalten.</p>
        <p style="margin: 0 0 10px;">Wir werden sie prüfen und uns bald bei Ihnen melden.</p>
        <p style="margin: 0; color: #6b5a49;">Referenznummer: <strong>${safeRequestId}</strong></p>
      </div>
    `;
  }

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #1f1711;">
      <h2 style="margin-bottom: 12px;">Thank you ${safeName || ""}</h2>
      <p style="margin: 0 0 10px;">Your request has been received successfully.</p>
      <p style="margin: 0 0 10px;">We will review it and contact you shortly.</p>
      <p style="margin: 0; color: #6b5a49;">Reference ID: <strong>${safeRequestId}</strong></p>
    </div>
  `;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SubmitRequestBody;

    const lang = normalizeLanguage(body?.lang);
    const customerData = body?.customerData ?? {};
    const fullName = normalizeString(customerData.fullName);
    const email = normalizeString(customerData.email);
    const requestId = generateRequestId();
    const receivedAt = new Date().toISOString();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "No email provided",
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

    const subject = getLocalizedSubject(lang);
    const html = getLocalizedHtml(lang, fullName, requestId);

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn("RESEND_API_KEY is missing. Skipping email sending for now.");

      return NextResponse.json({
        success: true,
        skippedEmail: true,
        requestId,
        receivedAt,
        requestLanguage: lang,
      });
    }

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "Caro Bara <onboarding@resend.dev>",
      to: email,
      subject,
      html,
    });

    return NextResponse.json({
      success: true,
      requestId,
      receivedAt,
      requestLanguage: lang,
    });
  } catch (error) {
    console.error("submit-request POST error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Email sending failed",
      },
      { status: 500 }
    );
  }
}