export type CompanyPdfProfile = {
  companyName: string;
  legalName?: string;
  taxNumber?: string;
  vatId?: string;
  registrationNumber?: string;
  phone?: string;
  email?: string;
  website?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  logoSrc?: string;
};

export type ConfirmationPdfInput = {
  requestNumber: string;
  customerNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  qrCodeDataUrl?: string;
};

export type OperationPdfInput = {
  identity: any;
  qrCodeDataUrl?: string;
  company?: CompanyPdfProfile;
};

export async function generateOperationPdfBufferWithPuppeteer(
  input: OperationPdfInput
): Promise<Buffer> {
  const identity = input.identity;

  return generateConfirmationPdf({
    requestNumber:
      identity?.ids?.requestId ||
      identity?.ids?.appointmentId ||
      identity?.ids?.referenceNumber ||
      "N/A",
    customerNumber: identity?.ids?.customerId || buildCustomerNumber(identity),
    createdAt: identity?.meta?.createdAt || new Date().toISOString(),
    customerName: identity?.customer?.fullName || "Nicht verfügbar",
    customerEmail: identity?.customer?.email || "Nicht verfügbar",
    customerPhone: identity?.customer?.phone || "",
    customerAddress:
      identity?.customer?.addressLine ||
      buildCustomerAddressFromParts(identity) ||
      "",
    qrCodeDataUrl: input.qrCodeDataUrl,
  });
}

export async function generateConfirmationPdf(
  input: ConfirmationPdfInput
): Promise<Buffer> {
  const html = buildHtml(input);
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

async function launchBrowser() {
  const isServerless = Boolean(
    process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
  );

  if (isServerless) {
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteerCore = (await import("puppeteer-core")).default;

    return puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  const puppeteer = (await import("puppeteer")).default;

  return puppeteer.launch({
    headless: true,
  });
}

function buildHtml(input: ConfirmationPdfInput): string {
  const serial = generateSerial(input);
  const date = formatDate(input.createdAt);
  const qrValue = input.qrCodeDataUrl || "";

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8" />
<style>
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #efe4d2;
  color: #2b2620;
}

.page {
  width: 210mm;
  height: 297mm;
  padding: 12mm 13mm 10mm;
  position: relative;
  background: #efe4d2;
  overflow: hidden;
}

.top-line {
  border-top: 2px solid #b8956a;
  padding-top: 6px;
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  color: #2b2620;
  margin-bottom: 21mm;
}

.serial {
  font-weight: 700;
  letter-spacing: 0.4px;
}

.main-title {
  font-size: 31px;
  font-weight: 700;
  color: #161616;
  margin-bottom: 5px;
  letter-spacing: -0.6px;
}

.subtitle {
  font-size: 14px;
  color: #2f261b;
  margin-bottom: 12px;
}

.confirmation {
  background: rgba(248, 241, 229, 0.72);
  border: 1px solid #c9b698;
  padding: 13px 18px;
  margin-bottom: 14px;
  font-size: 12.5px;
  line-height: 1.55;
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 14px;
  align-items: center;
}

.check {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #b0864b;
  color: #fff;
  font-size: 18px;
  line-height: 28px;
  text-align: center;
  font-weight: 700;
}

.customer-box {
  background: rgba(248, 241, 229, 0.56);
  border: 1px solid #c9b698;
  padding: 15px 18px;
  margin-bottom: 13px;
}

.section-title {
  font-size: 14px;
  font-weight: 700;
  color: #8b6b45;
  text-transform: uppercase;
  margin-bottom: 14px;
  letter-spacing: 0.2px;
}

.customer-layout {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 22px;
}

.customer-divider {
  background: #d3bfa3;
  width: 1px;
}

.info-item {
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 9px;
  margin-bottom: 13px;
  align-items: start;
}

.info-icon {
  color: #a77d45;
  font-size: 19px;
  line-height: 1;
  text-align: center;
}

.label {
  font-size: 11.3px;
  color: #5b4c39;
  margin-bottom: 2px;
}

.value {
  font-size: 13.3px;
  color: #111;
  font-weight: 600;
  word-break: break-word;
}

.company-card {
  background: rgba(248, 241, 229, 0.45);
  border: 1px solid #c9b698;
  display: grid;
  grid-template-columns: 1fr 1.08fr 1fr;
  gap: 0;
  margin-bottom: 12px;
}

.company-column {
  padding: 14px 14px;
  border-right: 1px solid #d3bfa3;
  min-height: 81px;
}

.company-column:last-child {
  border-right: none;
}

.company-title-line {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8b6b45;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.company-title-line::after {
  content: "";
  display: block;
  height: 1px;
  background: #b8956a;
  flex: 1;
  margin-left: 6px;
}

.company-name {
  font-size: 13.5px;
  font-weight: 700;
  margin-bottom: 10px;
}

.contact-line {
  display: grid;
  grid-template-columns: 20px 1fr;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 12.3px;
  line-height: 1.22;
}

.icon {
  color: #a77d45;
  font-weight: 600;
  text-align: center;
}

.logo-box {
  text-align: center;
  padding: 12px 8px 9px;
}

.logo-mark {
  font-size: 42px;
  color: #9a7a52;
  font-family: Georgia, serif;
  line-height: 0.85;
  margin-bottom: 4px;
  font-weight: 400;
}

.logo-name {
  font-size: 27px;
  letter-spacing: 2.5px;
  font-family: Georgia, serif;
  color: #111;
  font-weight: 400;
}

.logo-sub {
  font-size: 12px;
  letter-spacing: 7px;
  color: #111;
  margin-top: 1px;
  font-weight: 400;
}

.logo-slogan {
  border-top: 1px solid #b8956a;
  margin: 10px auto 0;
  padding-top: 7px;
  width: 78%;
  font-size: 11px;
  color: #2b2620;
  line-height: 1.25;
}

.contact-list {
  padding-left: 10px;
}

.mini-divider {
  border-top: 1px solid #d3bfa3;
  margin: 8px 0;
}

.bottom-card {
  background: rgba(248, 241, 229, 0.45);
  border: 1px solid #c9b698;
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  margin-bottom: 12px;
}

.bottom-section {
  padding: 14px 18px;
}

.bottom-divider {
  background: #d3bfa3;
  width: 1px;
}

.bottom-title {
  color: #8b6b45;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.small-label {
  font-size: 11px;
  color: #5b4c39;
  margin-top: 6px;
}

.strong {
  font-size: 13px;
  font-weight: 600;
  color: #111;
  line-height: 1.25;
}

.footer-area {
  position: absolute;
  left: 13mm;
  right: 13mm;
  bottom: 10mm;
  border-top: 1px solid #b8956a;
  padding-top: 10px;
  display: grid;
  grid-template-columns: 1fr 28mm;
  gap: 18px;
  align-items: end;
}

.footer-note {
  display: grid;
  grid-template-columns: 38px 1fr;
  gap: 12px;
  align-items: center;
  font-size: 12.3px;
  color: #2f261b;
  line-height: 1.35;
}

.handshake {
  font-size: 26px;
  color: #a77d45;
}

.footer-brand {
  margin-top: 8px;
  font-size: 12.5px;
  color: #9a7a52;
  letter-spacing: 7px;
  font-weight: 700;
}

.qr-corner {
  width: 28mm;
  text-align: center;
}

.qr-frame {
  width: 24mm;
  text-align: center;
  font-size: 7px;
  color: #6b5a44;
  margin-left: auto;
}

.qr-frame img {
  width: 22mm;
  height: 22mm;
  object-fit: contain;
  background: #ffffff;
  border: 1px solid #b8956a;
  padding: 3px;
}
</style>
</head>

<body>
<div class="page">
  <div class="top-line">
    <div>Caro Bara Smart Print</div>
    <div class="serial">${escapeHtml(serial)}</div>
  </div>

  <div class="main-title">Eingangsbestätigung</div>
  <div class="subtitle">Ihre Anfrage wurde erfolgreich empfangen.</div>

  <div class="confirmation">
    <div class="check">✓</div>
    <div>
      Vielen Dank für Ihre Anfrage. Wir bestätigen hiermit den Eingang Ihrer Anfrage.
      Unser Team wird die Angaben sorgfältig prüfen und sich schnellstmöglich mit Ihnen in Verbindung setzen.
    </div>
  </div>

  <div class="customer-box">
    <div class="section-title">Kunden- und Referenzdaten</div>

    <div class="customer-layout">
      <div>
        <div class="info-item">
          <div class="info-icon">♙</div>
          <div>
            <div class="label">Name des Kunden</div>
            <div class="value">${escapeHtml(input.customerName)}</div>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon">▣</div>
          <div>
            <div class="label">Kundennummer</div>
            <div class="value">${escapeHtml(input.customerNumber)}</div>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon">✉</div>
          <div>
            <div class="label">E-Mail</div>
            <div class="value">${escapeHtml(input.customerEmail)}</div>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon">⌖</div>
          <div>
            <div class="label">Adresse</div>
            <div class="value">${escapeHtml(input.customerAddress || "Nicht verfügbar")}</div>
          </div>
        </div>
      </div>

      <div class="customer-divider"></div>

      <div>
        <div class="info-item">
          <div class="info-icon">☎</div>
          <div>
            <div class="label">Telefonnummer</div>
            <div class="value">${escapeHtml(input.customerPhone || "Nicht verfügbar")}</div>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon">▤</div>
          <div>
            <div class="label">Anfragenummer</div>
            <div class="value">${escapeHtml(input.requestNumber)}</div>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon">▦</div>
          <div>
            <div class="label">Eingangsdatum</div>
            <div class="value">${escapeHtml(date)}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="company-card">
    <div class="company-column">
      <div class="company-title-line">▥ Unternehmen</div>
      <div class="company-name">Caro Bara Smart Print</div>
      <div class="contact-line"><span class="icon">⌖</span><span>Fanningerstraße 20</span></div>
      <div class="contact-line"><span class="icon"></span><span>10365 Berlin</span></div>
      <div class="contact-line"><span class="icon"></span><span>Deutschland</span></div>
    </div>

    <div class="logo-box">
      <div class="logo-mark">CB</div>
      <div class="logo-name">CARO BARA</div>
      <div class="logo-sub">SMART PRINT</div>
      <div class="logo-slogan">SMART PRINT SOLUTIONS<br/>FOR A SMARTER BUSINESS</div>
    </div>

    <div class="company-column">
      <div class="company-title-line">☎ Kontakt</div>
      <div class="contact-list">
        <div class="contact-line"><span class="icon">☎</span><span>+49 176 211 050 86</span></div>
        <div class="contact-line"><span class="icon">☎</span><span>+49 30 68 96 555 9</span></div>
        <div class="mini-divider"></div>
        <div class="contact-line"><span class="icon">✉</span><span>info@carobara.com</span></div>
        <div class="contact-line"><span class="icon">✉</span><span>info@carobara.de</span></div>
        <div class="mini-divider"></div>
        <div class="contact-line"><span class="icon">◎</span><span>www.carobara.com</span></div>
        <div class="contact-line"><span class="icon">◎</span><span>www.carobara.de</span></div>
      </div>
    </div>
  </div>

  <div class="bottom-card">
    <div class="bottom-section">
      <div class="bottom-title">▤ Bankverbindung</div>
      <div class="small-label">Kontoinhaber</div>
      <div class="strong">Alyoussef, Mohammad Refat</div>
      <div class="small-label">IBAN</div>
      <div class="strong">DE83 1005 0000 0191 3591 90</div>
    </div>

    <div class="bottom-divider"></div>

    <div class="bottom-section">
      <div class="bottom-title">▧ Steuerinformationen</div>
      <div class="small-label">Steuer-Nr.</div>
      <div class="strong">DE367793052</div>
    </div>
  </div>

  <div class="footer-area">
    <div>
      <div class="footer-note">
        <div class="handshake">◇</div>
        <div>
          Vielen Dank für Ihr Vertrauen in Caro Bara Smart Print.<br/>
          Wir freuen uns auf eine erfolgreiche Zusammenarbeit.
        </div>
      </div>
      <div class="footer-brand">CARO BARA SMART PRINT</div>
    </div>

    <div class="qr-corner">
      ${
        qrValue
          ? `
      <div class="qr-frame">
        <img src="${escapeHtml(qrValue)}" />
        <div>Referenzcode</div>
      </div>`
          : ""
      }
    </div>
  </div>
</div>
</body>
</html>`;
}

function buildCustomerNumber(identity: any): string {
  const source =
    identity?.customer?.email ||
    identity?.customer?.phone ||
    identity?.customer?.fullName ||
    "customer";

  const hash = stableHash(source).toString(16).toUpperCase();
  return `CUS-${hash.slice(0, 8)}`;
}

function buildCustomerAddressFromParts(identity: any): string {
  const parts = [
    identity?.customer?.addressParts?.street,
    identity?.customer?.addressParts?.houseNumber,
    identity?.customer?.addressParts?.postalCode,
    identity?.customer?.addressParts?.city,
    identity?.customer?.addressParts?.country,
  ]
    .map((value) => String(value || "").trim())
    .filter(Boolean);

  return parts.join(", ");
}

function generateSerial(input: ConfirmationPdfInput): string {
  const base = `${input.requestNumber}-${input.customerNumber}-${input.createdAt}`;
  const hash = stableHash(base).toString(16).toUpperCase();
  return `CB-${hash.slice(0, 8)}`;
}

function stableHash(value: string): number {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function formatDate(date: string): string {
  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return date;
  }

  return d.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function escapeHtml(value: string): string {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}