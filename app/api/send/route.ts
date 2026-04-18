import { Resend } from "resend";

type Lang = "ar" | "de" | "en";

type RequestBody = {
  lang?: unknown;
  language?: unknown;
  customerData?: {
    fullName?: unknown;
    email?: unknown;
  };
  fullName?: unknown;
  email?: unknown;
  message?: unknown;
  formData?: unknown;
  items?: unknown;
};

function getSafeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
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

function getTexts(lang: Lang) {
  const texts = {
    de: {
      internalSubject: (name: string) => `Neue Anfrage von ${name}`,
      customerSubject: "Ihre Anfrage wurde erfolgreich empfangen",
      title: "Neue Anfrage",
      greeting: (name: string) => `Hallo ${name},`,
      intro:
        "vielen Dank für Ihre Anfrage. Wir haben Ihre Daten erfolgreich erhalten.",
      closing:
        "Wir melden uns so schnell wie möglich mit einer klaren und strukturierten Antwort.",
      signature: `
        <br/><br/>
        <strong>Caro Bara Werbeagentur</strong><br/>
        Design • Print • Signage<br/>
        Klare Systeme. Präzise Umsetzung.<br/>
        🌐 www.carobara.de<br/>
        📧 info@carobara.de
      `,
      labels: {
        name: "Name",
        email: "E-Mail",
      },
    },
    en: {
      internalSubject: (name: string) => `New request from ${name}`,
      customerSubject: "Your request has been received successfully",
      title: "New Request",
      greeting: (name: string) => `Hello ${name},`,
      intro:
        "thank you for your request. We have successfully received your information.",
      closing:
        "We will get back to you as soon as possible with a clear and structured response.",
      signature: `
        <br/><br/>
        <strong>Caro Bara Werbeagentur</strong><br/>
        Design • Print • Signage<br/>
        We build brands with precision.<br/>
        🌐 www.carobara.de<br/>
        📧 info@carobara.de
      `,
      labels: {
        name: "Name",
        email: "Email",
      },
    },
    ar: {
      internalSubject: (name: string) => `طلب جديد من ${name}`,
      customerSubject: "تم استلام طلبك بنجاح",
      title: "طلب جديد",
      greeting: (name: string) => `مرحبًا ${name}،`,
      intro: "شكرًا لطلبك، لقد تم استلام بياناتك بنجاح.",
      closing: "سنقوم بالرد عليك في أقرب وقت ممكن بشكل واضح ومنظم.",
      signature: `
        <br/><br/>
        <strong>Caro Bara Werbeagentur</strong><br/>
        Design • Print • Signage<br/>
        نحن لا نطبع فقط… نحن نبني حضورك التجاري.<br/>
        🌐 www.carobara.de<br/>
        📧 info@carobara.de
      `,
      labels: {
        name: "الاسم",
        email: "البريد الإلكتروني",
      },
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

    const fullName =
      getSafeString(body?.customerData?.fullName) ||
      getSafeString(body?.fullName) ||
      "Unknown";

    const email =
      getSafeString(body?.customerData?.email) ||
      getSafeString(body?.email) ||
      "";

    const messageRaw =
      getSafeString(body?.message) ||
      JSON.stringify(body?.formData || body?.items || {}, null, 2);

    const safeFullName = escapeHtml(fullName);
    const safeEmail = escapeHtml(email || "no-email");
    const safeMessage = escapeHtml(messageRaw);

    await resend.emails.send({
      from: `Caro Bara <${fromEmail}>`,
      to: [receiverEmail],
      replyTo: email || undefined,
      subject: t.internalSubject(fullName),
      html: `
        <h2>${t.title}</h2>
        <p><strong>${t.labels.name}:</strong> ${safeFullName}</p>
        <p><strong>${t.labels.email}:</strong> ${safeEmail}</p>
        <pre>${safeMessage}</pre>
      `,
    });

    if (email) {
      await resend.emails.send({
        from: `Caro Bara <${fromEmail}>`,
        to: [email],
        subject: t.customerSubject,
        html: `
          <p>${t.greeting(safeFullName)}</p>

          <p>${t.intro}</p>

          <pre style="background:#f7f2ec;padding:12px;border-radius:8px;">${safeMessage}</pre>

          <p>${t.closing}</p>

          ${t.signature}
        `,
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("SEND ERROR:", error);

    return Response.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}