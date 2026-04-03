import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { customerData, lang } = body;

    if (!customerData?.email) {
      return NextResponse.json(
        { error: "No email provided" },
        { status: 400 }
      );
    }

    const subject =
      lang === "ar"
        ? "تم استلام طلبك - Caro Bara"
        : lang === "de"
        ? "Ihre Anfrage wurde erhalten - Caro Bara"
        : "Your request has been received - Caro Bara";

    const html =
      lang === "ar"
        ? `
        <div style="font-family: Arial; direction: rtl">
          <h2>شكراً لك ${customerData.fullName ?? ""}</h2>
          <p>تم استلام طلبك بنجاح.</p>
          <p>سيتم مراجعته والتواصل معك قريباً.</p>
        </div>
      `
        : lang === "de"
        ? `
        <div style="font-family: Arial">
          <h2>Vielen Dank ${customerData.fullName ?? ""}</h2>
          <p>Ihre Anfrage wurde erfolgreich erhalten.</p>
          <p>Wir werden sie prüfen und uns bald bei Ihnen melden.</p>
        </div>
      `
        : `
        <div style="font-family: Arial">
          <h2>Thank you ${customerData.fullName ?? ""}</h2>
          <p>Your request has been received successfully.</p>
          <p>We will review it and contact you shortly.</p>
        </div>
      `;

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn("RESEND_API_KEY is missing. Skipping email sending for now.");
      return NextResponse.json({
        success: true,
        skippedEmail: true,
      });
    }

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "Demo <onboarding@resend.dev>",
      to: customerData.email,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Email sending failed" },
      { status: 500 }
    );
  }
}