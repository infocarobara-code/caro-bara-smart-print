import { LEGAL_COMPANY } from "@/lib/legal/company";
import { berlinParts } from "./policy";
import type { Appointment } from "./store";
export const MODE_DE = {
  we_come_free: "Besichtigung vor Ort",
  at_store: "Termin bei Caro Bara",
  phone_call: "Telefontermin",
};
const STATUS_DE: Record<string, string> = {
  pending: "Terminanfrage - noch nicht bestätigt",
  confirmed: "Terminbestätigung",
  cancelled: "Termin abgesagt",
  rejected: "Terminanfrage abgelehnt",
  late_cancellation: "Kurzfristige Absage - Prüfung ausstehend",
};
export function escape(value: string) {
  return value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
}
export function appointmentDetails(a: Appointment, event = a.status as string) {
  const start = berlinParts(new Date(a.start_at)),
    end = berlinParts(new Date(a.end_at));
  const date = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(a.start_at));
  return {
    title: STATUS_DE[event] || STATUS_DE.pending,
    when: `${date}, ${start.time}-${end.time} Uhr (Europe/Berlin)`,
    location:
      a.mode === "we_come_free"
        ? a.address
        : a.mode === "at_store"
          ? LEGAL_COMPANY.address
          : `Telefon: ${a.phone}`,
    fee: a.urgent
      ? "Express-Zuschlag: 20,00 EUR Gesamtpreis. Zahlung nach Vereinbarung; diese Nachricht ist kein Zahlungsnachweis."
      : "Kein Express-Zuschlag.",
  };
}
export function bookingHtml(
  a: Appointment,
  event: string,
  baseUrl: string,
  font = "",
) {
  const d = appointmentDetails(a, event);
  const row = (label: string, value: string) =>
    `<tr><th>${escape(label)}</th><td dir="auto">${escape(value)}</td></tr>`;
  return `<!doctype html><html lang="de"><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;background:#f2f7f8;color:#163843;font:14px Arial,sans-serif}.sheet{max-width:740px;margin:24px auto;background:white;border:1px solid #d5e5e8;padding:38px;border-radius:18px}.brand{color:#087e97;font-weight:bold;letter-spacing:2px}h1{font-size:27px;margin:22px 0 10px}p{line-height:1.6}table{width:100%;border-collapse:collapse;margin:24px 0}th,td{text-align:left;padding:12px 8px;border-bottom:1px solid #e3ecee;vertical-align:top;overflow-wrap:anywhere}th{width:28%;color:#56737d;font-weight:normal}.code{font:14px monospace;background:#eff7f9;padding:12px;overflow-wrap:anywhere}.notice{padding:14px;background:#eff7f9;border-left:3px solid #07869f}footer{font-size:12px;color:#54717a;margin-top:26px}a{color:#087e97}@page{size:A4;margin:12mm}@media print{body{background:white}.sheet{border:0;margin:0;padding:18px;max-width:none}}${font}</style><main class="sheet"><div class="brand">CARO BARA · BERLIN</div><h1>${escape(d.title)}</h1><p>Guten Tag <bdi>${escape(a.full_name)}</bdi>,</p><p>${event === "pending" ? "Ihre Anfrage ist gespeichert. Der Termin ist erst nach unserer ausdrücklichen Bestätigung verbindlich bestätigt." : event === "confirmed" ? "Wir bestätigen Ihren Termin. Bitte bewahren Sie Ihren Termincode auf." : event === "late_cancellation" ? "Ihre kurzfristige Absage ist eingegangen und wird geprüft. Der Termin bleibt bis zu unserer Rückmeldung reserviert." : "Der Termin ist nicht mehr reserviert."}</p><div class="code">Termincode: ${escape(a.reference)}</div><table>${row("Terminart", MODE_DE[a.mode])}${row("Datum / Uhrzeit", d.when)}${row("Ort / Kontakt", d.location)}${row("Ihr Telefon", a.phone)}${row("Ihre E-Mail", a.email)}${row("Express", d.fee)}${a.notes ? row("Ihre Nachricht", a.notes) : ""}</table><p class="notice">Bitte sagen Sie mindestens 24 Stunden vor Beginn ab. Geben Sie dafür Ihren Termincode und Ihre E-Mail-Adresse unter <a href="${escape(baseUrl)}/booking/manage">Termin verwalten</a> ein. Bei kürzerer Frist ist eine Prüfung durch Caro Bara erforderlich; der Termin wird nicht automatisch freigegeben. Gesetzliche Rechte bleiben unberührt.</p><footer><strong>${escape(LEGAL_COMPANY.tradeName)}</strong><br>${escape(LEGAL_COMPANY.address)}<br>Telefon: ${escape(LEGAL_COMPANY.phone)} · ${escape(LEGAL_COMPANY.email)}<br>${escape(baseUrl)}<br>Alle Terminzeiten gelten in der Zeitzone Europe/Berlin.</footer></main></html>`;
}
function icsEscape(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}
function utc(value: string) {
  return new Date(value)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z/, "Z");
}
export function foldCalendarLine(line: string) {
  const parts: string[] = [];
  let current = "",
    bytes = 0;
  for (const char of line) {
    const n = Buffer.byteLength(char);
    if (bytes + n > 75) {
      parts.push(current);
      current = " ";
      bytes = 1;
    }
    current += char;
    bytes += n;
  }
  parts.push(current);
  return parts.join("\r\n");
}
export function calendarFile(a: Appointment, baseUrl: string) {
  const d = appointmentDetails(a);
  const cancelled = a.status === "cancelled" || a.status === "rejected";
  const description = `Termincode: ${a.reference}\n${LEGAL_COMPANY.tradeName}\n${LEGAL_COMPANY.address}\nTelefon: ${LEGAL_COMPANY.phone}\nE-Mail: ${LEGAL_COMPANY.email}\n${baseUrl}\n${d.fee}\nAbsage mindestens 24 Stunden vorher: ${baseUrl}/booking/manage\nBitte Termincode und E-Mail eingeben.\nIhre Nachricht: ${a.notes}`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Caro Bara//Appointments//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${a.id}@carobara.com`,
    `SEQUENCE:${a.revision}`,
    `DTSTAMP:${utc(a.updated_at)}`,
    `DTSTART:${utc(a.start_at)}`,
    `DTEND:${utc(a.end_at)}`,
    `SUMMARY:${icsEscape(`${MODE_DE[a.mode]} - Caro Bara`)}`,
    `DESCRIPTION:${icsEscape(description)}`,
    `LOCATION:${icsEscape(d.location)}`,
    `STATUS:${cancelled ? "CANCELLED" : "CONFIRMED"}`,
    "TRANSP:OPAQUE",
    `URL:${baseUrl}/booking/manage`,
    "BEGIN:VALARM",
    "TRIGGER:-PT24H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Erinnerung an Ihren Termin bei Caro Bara",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(foldCalendarLine).join("\r\n") + "\r\n";
}
export async function appointmentPdf(
  a: Appointment,
  event: string,
  baseUrl: string,
) {
  const [{ launchBrowser }, { readFile }, { join }] = await Promise.all([
    import("@/lib/documents/pdf-generator"),
    import("node:fs/promises"),
    import("node:path"),
  ]);
  const font = await readFile(
    join(process.cwd(), "public/fonts/Cairo-Regular.ttf"),
  );
  const css = `@font-face{font-family:Booking;src:url(data:font/ttf;base64,${font.toString("base64")})}body{font-family:Booking,Arial,sans-serif}`;
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setJavaScriptEnabled(false);
    await page.setContent(bookingHtml(a, event, baseUrl, css), {
      waitUntil: "load",
    });
    await page.evaluate(() => document.fonts.ready);
    return Buffer.from(
      await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
      }),
    );
  } finally {
    await browser.close();
  }
}
