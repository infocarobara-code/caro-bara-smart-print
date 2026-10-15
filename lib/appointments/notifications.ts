import { Resend, type CreateEmailOptions } from "resend";
import {
  appointmentDetails,
  appointmentPdf,
  bookingHtml,
  calendarFile,
} from "./documents";
import { database, type Appointment } from "./store";
type Outbox = {
  id: string;
  appointment_id: string;
  snapshot: Appointment;
  event: string;
  recipient: "owner" | "customer";
  lease_token: string;
  prepared_payload: CreateEmailOptions | null;
};
export function publicBaseUrl() {
  // Fixed trusted canonical origin: never derive email links from caller-controlled Host.
  return "https://caro-bara-smart-print.vercel.app";
}
export async function dispatchNotifications(appointmentId?: string) {
  const apiKey = process.env.RESEND_API_KEY,
    from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return { sent: 0, pending: true };
  const rows = await database<Outbox[]>("rpc/cb_booking_claim", "POST", {
    p_id: appointmentId ?? null,
  });
  const resend = new Resend(apiKey);
  let sent = 0,
    pending = false;
  for (const row of rows) {
    const filter = `id=eq.${row.id}&lease_token=eq.${row.lease_token}`;
    let stage = "PDF";
    try {
      let payload = row.prepared_payload;
      if (!payload) {
        const a = row.snapshot,
          base = publicBaseUrl(),
          details = appointmentDetails(a, row.event);
        const pdf = await appointmentPdf(a, row.event, base);
        const attachments: NonNullable<CreateEmailOptions["attachments"]> = [
          { filename: `${a.reference}.pdf`, content: pdf.toString("base64") },
        ];
        if (["confirmed", "cancelled"].includes(row.event))
          attachments.push({
            filename: `${a.reference}.ics`,
            content: Buffer.from(calendarFile(a, base)).toString("base64"),
            contentType: "text/calendar; charset=utf-8",
          });
        payload = {
          from: `Caro Bara <${from}>`,
          to:
            row.recipient === "owner"
              ? process.env.REQUEST_RECEIVER_EMAIL || "info@carobara.com"
              : a.email,
          replyTo: row.recipient === "owner" ? a.email : "info@carobara.com",
          subject: `${row.recipient === "owner" ? "Caro Bara: " : ""}${details.title} | ${a.reference}`,
          html: bookingHtml(a, row.event, base),
          attachments,
        };
        stage = "PREPARE_SAVE";
        await database(`cb_booking_outbox?${filter}`, "PATCH", {
          prepared_payload: payload,
        });
      }
      stage = "PROVIDER";
      const result = await resend.emails.send(payload, {
        idempotencyKey: `booking/${row.id}`,
      });
      if (result.error || !result.data?.id)
        throw new Error("EMAIL_NOT_ACCEPTED");
      stage = "RECEIPT_SAVE";
      await database(`cb_booking_outbox?${filter}`, "PATCH", {
        sent_at: new Date().toISOString(),
        last_error: null,
        prepared_payload: null,
        leased_until: null,
      });
      sent++;
    } catch (error) {
      pending = true;
      const code = error && typeof error === "object" && "code" in error
        && typeof error.code === "string" && /^[A-Z0-9_]{1,40}$/.test(error.code)
        ? error.code : "FAILED";
      const failure = `${stage}_${code}`;
      // Do not log payloads, email addresses, provider messages or secrets.
      console.error("booking_notification_failed", { id: row.id, failure });
      // Keep ambiguous sends in the durable queue; replay the exact prepared payload.
      await database(`cb_booking_outbox?${filter}`, "PATCH", {
        last_error: failure,
        leased_until: new Date(Date.now() + 60000).toISOString(),
      }).catch(() => {});
    }
  }
  return { sent, pending };
}
