import { Resend } from "resend";

function escapeHtml(value: string) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const message = String(body?.message ?? "").trim();

    if (!name || !email || !message) {
      return Response.json(
        {
          success: false,
          error: "Missing required fields: name, email, message",
        },
        { status: 400 }
      );
    }

    const result = await resend.emails.send({
      from: "Caro Bara <info@carobara.com>",
      to: ["info@carobara.com"],
      replyTo: email,
      subject: `New Request from ${name}`,
      html: `
        <h2>New Message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <div style="white-space: pre-wrap;">${escapeHtml(message)}</div>
      `,
    });

    if (result.error) {
      return Response.json(
        { success: false, error: result.error.message },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return Response.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}