import { Resend } from "resend";
import { randomInt } from "crypto";
import { buildEmailAssets } from "@/lib/documents/email-assets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Lang = "ar" | "de" | "en";

type RequestBody = {
  lang?: unknown;
  language?: unknown;
  customerData?: {
    fullName?: unknown;
    email?: unknown;
    phone?: unknown;
    street?: unknown;
    houseNumber?: unknown;
    postalCode?: unknown;
    city?: unknown;
  };
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  street?: unknown;
  houseNumber?: unknown;
  postalCode?: unknown;
  city?: unknown;
  subject?: unknown;
  serviceId?: unknown;
  serviceName?: unknown;
  sourcePath?: unknown;
  message?: unknown;
  formData?: unknown;
  items?: unknown;
};

function getSafeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getSafeRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function getSafeArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function stringifyForExtra(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "";
  }
}

function getLang(body: RequestBody): Lang {
  const lang = body?.lang || body?.language;
  if (lang === "ar" || lang === "en" || lang === "de") return lang;
  return "de";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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

function getBase64ContentFromDataUrl(dataUrl: string): string {
  const value = getSafeString(dataUrl);

  if (!value.startsWith("data:")) {
    return value;
  }

  const commaIndex = value.indexOf(",");

  if (commaIndex === -1) {
    throw new Error("Invalid data URL content");
  }

  return value.slice(commaIndex + 1);
}

function buildFallbackMessage(body: RequestBody) {
  const formData = getSafeRecord(body?.formData);
  const items = getSafeArray(body?.items);

  if (body?.message && getSafeString(body.message)) {
    return getSafeString(body.message);
  }

  const payload: Record<string, unknown> = {};

  if (Object.keys(formData).length > 0) {
    payload.formData = formData;
  }

  if (items.length > 0) {
    payload.items = items;
  }

  if (Object.keys(payload).length === 0) {
    return "";
  }

  try {
    return JSON.stringify(payload, null, 2);
  } catch {
    return "";
  }
}

function getTexts(lang: Lang) {
  const texts = {
    de: {
      internalSubject: (name: string) => `Neue Anfrage von ${name}`,
      customerSubject: (requestId: string) =>
        `Ihre Anfrage wurde erfolgreich empfangen - ${requestId}`,
      title: "Neue Anfrage",
      greeting: (name: string) => `Hallo ${name},`,
      intro:
        "vielen Dank für Ihre Anfrage. Wir haben Ihre Daten erfolgreich erhalten.",
      closing:
        "Wir melden uns so schnell wie möglich mit einer klaren und strukturierten Antwort.",
      pdfHint:
        "Zusätzlich erhalten Sie ein PDF mit den Anfragedetails und dem Referenzcode.",
      labels: {
        name: "Name",
        email: "E-Mail",
        phone: "Telefon",
        requestId: "Referenz",
        subject: "Betreff",
      },
      signature: `
        <br/><br/>
        <strong>Caro Bara Werbeagentur</strong><br/>
        Design • Print • Signage<br/>
        Klare Systeme. Präzise Umsetzung.<br/>
        🌐 www.carobara.de<br/>
        📧 info@carobara.de
      `,
    },
    en: {
      internalSubject: (name: string) => `New request from ${name}`,
      customerSubject: (requestId: string) =>
        `Your request has been received successfully - ${requestId}`,
      title: "New Request",
      greeting: (name: string) => `Hello ${name},`,
      intro:
        "thank you for your request. We have successfully received your information.",
      closing:
        "We will get back to you as soon as possible with a clear and structured response.",
      pdfHint:
        "A PDF with the request details and reference code is also attached.",
      labels: {
        name: "Name",
        email: "Email",
        phone: "Phone",
        requestId: "Reference",
        subject: "Subject",
      },
      signature: `
        <br/><br/>
        <strong>Caro Bara Werbeagentur</strong><br/>
        Design • Print • Signage<br/>
        We build brands with precision.<br/>
        🌐 www.carobara.de<br/>
        📧 info@carobara.de
      `,
    },
    ar: {
      internalSubject: (name: string) => `طلب جديد من ${name}`,
      customerSubject: (requestId: string) =>
        `تم استلام طلبك بنجاح - ${requestId}`,
      title: "طلب جديد",
      greeting: (name: string) => `مرحبًا ${name}،`,
      intro: "شكرًا لطلبك، لقد تم استلام بياناتك بنجاح.",
      closing: "سنقوم بالرد عليك في أقرب وقت ممكن بشكل واضح ومنظم.",
      pdfHint: "تم أيضًا إرفاق ملف PDF يتضمن تفاصيل الطلب والمرجع التنظيمي.",
      labels: {
        name: "الاسم",
        email: "البريد الإلكتروني",
        phone: "الهاتف",
        requestId: "المرجع",
        subject: "الموضوع",
      },
      signature: `
        <br/><br/>
        <strong>Caro Bara Werbeagentur</strong><br/>
        Design • Print • Signage<br/>
        نحن لا نطبع فقط… نحن نبني حضورك التجاري.<br/>
        🌐 www.carobara.de<br/>
        📧 info@carobara.de
      `,
    },
  } as const;

  return texts[lang];
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "info@carobara.com";
    const receiverEmail =
      process.env.REQUEST_RECEIVER_EMAIL || "info@carobara.com";

    if (!apiKey) {
      return Response.json(
        { success: false, error: "RESEND_API_KEY is missing" },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const body = (await req.json()) as RequestBody;
    const lang = getLang(body);
    const t = getTexts(lang);

    const customerData = getSafeRecord(body?.customerData);

    const fullName =
      getSafeString(customerData.fullName) ||
      getSafeString(body?.fullName) ||
      "Unknown";

    const email =
      getSafeString(customerData.email) ||
      getSafeString(body?.email) ||
      "";

    const phone =
      getSafeString(customerData.phone) ||
      getSafeString(body?.phone) ||
      "";

    const street =
      getSafeString(customerData.street) ||
      getSafeString(body?.street) ||
      "";

    const houseNumber =
      getSafeString(customerData.houseNumber) ||
      getSafeString(body?.houseNumber) ||
      "";

    const postalCode =
      getSafeString(customerData.postalCode) ||
      getSafeString(body?.postalCode) ||
      "";

    const city =
      getSafeString(customerData.city) ||
      getSafeString(body?.city) ||
      "";

    const subject = getSafeString(body?.subject);
    const serviceId = getSafeString(body?.serviceId);
    const serviceName = getSafeString(body?.serviceName);
    const sourcePath = getSafeString(body?.sourcePath);
    const items = getSafeArray(body?.items);
    const formData = getSafeRecord(body?.formData);

    const messageRaw = buildFallbackMessage(body);
    const receivedAt = new Date().toISOString();
    const requestId = generateRequestId(receivedAt.slice(0, 10));

    const safeFullName = escapeHtml(fullName);
    const safeEmail = escapeHtml(email || "no-email");
    const safePhone = escapeHtml(phone || "—");
    const safeRequestId = escapeHtml(requestId);
    const safeSubject = escapeHtml(subject || "—");
    const safeMessage = escapeHtml(messageRaw || "—");

    const emailAssets = await buildEmailAssets({
      identityInput: {
        kind: "request",
        language: lang,
        requestId,
        referenceNumber: requestId,
        status: "new",
        serviceType: serviceName || serviceId || subject || "General Request",
        subject,
        message: messageRaw,
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
          formData: stringifyForExtra(formData),
          items: stringifyForExtra(items),
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
    ];

    await resend.emails.send({
      from: `Caro Bara <${fromEmail}>`,
      to: [receiverEmail],
      replyTo: email || undefined,
      subject: t.internalSubject(fullName),
      attachments: commonAttachments,
      html: `
        <h2>${t.title}</h2>
        <p><strong>${t.labels.requestId}:</strong> ${safeRequestId}</p>
        <p><strong>${t.labels.name}:</strong> ${safeFullName}</p>
        <p><strong>${t.labels.email}:</strong> ${safeEmail}</p>
        <p><strong>${t.labels.phone}:</strong> ${safePhone}</p>
        <p><strong>${t.labels.subject}:</strong> ${safeSubject}</p>
        <pre>${safeMessage}</pre>
      `,
    });

    if (email) {
      await resend.emails.send({
        from: `Caro Bara <${fromEmail}>`,
        to: [email],
        subject: t.customerSubject(requestId),
        attachments: commonAttachments,
        html: `
          <p>${t.greeting(safeFullName)}</p>

          <p>${t.intro}</p>

          <p><strong>${t.labels.requestId}:</strong> ${safeRequestId}</p>

          <pre style="background:#f7f2ec;padding:12px;border-radius:8px;">${safeMessage}</pre>

          <p>${t.closing}</p>
          <p>${t.pdfHint}</p>

          ${t.signature}
        `,
      });
    }

    return Response.json({
      success: true,
      requestId,
    });
  } catch (error) {
    console.error("SEND ERROR:", error);

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}