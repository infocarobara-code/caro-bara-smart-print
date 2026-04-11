import { Resend } from "resend";

type Lang = "ar" | "de" | "en";

function getLang(body: any): Lang {
  const lang = body?.lang || body?.language;
  if (lang === "ar" || lang === "en" || lang === "de") return lang;
  return "de";
}

function getTexts(lang: Lang) {
  const texts = {
    de: {
      subject: (name: string) => `Neue Anfrage von ${name}`,
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
      subject: (name: string) => `New request from ${name}`,
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
      subject: (name: string) => `طلب جديد من ${name}`,
      title: "طلب جديد",
      greeting: (name: string) => `مرحبًا ${name}،`,
      intro:
        "شكرًا لطلبك، لقد تم استلام بياناتك بنجاح.",
      closing:
        "سنقوم بالرد عليك في أقرب وقت ممكن بشكل واضح ومنظم.",
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
  };

  return texts[lang];
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return Response.json(
        { success: false, error: "RESEND_API_KEY is missing" },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const body = await req.json();

    // اللغة
    const lang = getLang(body);
    const t = getTexts(lang);

    // البيانات
    const fullName =
      body?.customerData?.fullName || body?.fullName || "Unknown";

    const email =
      body?.customerData?.email || body?.email || "no-email";

    const message =
      body?.message ||
      JSON.stringify(body?.formData || body?.items || {}, null, 2);

    // 📩 إيميل داخلي (كما هو تقريبًا)
    await resend.emails.send({
      from: "Caro Bara <onboarding@resend.dev>",
      to: ["info@carobara.com"],
      replyTo: email,
      subject: t.subject(fullName),
      html: `
        <h2>${t.title}</h2>
        <p><strong>${t.labels.name}:</strong> ${fullName}</p>
        <p><strong>${t.labels.email}:</strong> ${email}</p>
        <pre>${message}</pre>
      `,
    });

    // 📩 إيميل للزبون (احترافي + متعدد اللغات)
    await resend.emails.send({
      from: "Caro Bara <onboarding@resend.dev>",
      to: [email],
      subject: t.subject(fullName),
      html: `
        <p>${t.greeting(fullName)}</p>

        <p>${t.intro}</p>

        <pre style="background:#f7f2ec;padding:12px;border-radius:8px;">${message}</pre>

        <p>${t.closing}</p>

        ${t.signature}
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("SEND ERROR:", error);

    return Response.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}