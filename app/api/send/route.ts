import { Resend } from "resend";

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

    // 🔥 استخراج البيانات بشكل صحيح من الفورم
    const fullName =
      body?.customerData?.fullName || body?.fullName || "Unknown";

    const email =
      body?.customerData?.email || body?.email || "no-email";

    const message =
      body?.message ||
      JSON.stringify(body?.formData || body?.items || {}, null, 2);

    await resend.emails.send({
      from: "Caro Bara <onboarding@resend.dev>", // مؤقت
      to: ["info@carobara.com"],
      replyTo: email,
      subject: `New Request from ${fullName}`,
      html: `
        <h2>New Request</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <pre>${message}</pre>
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