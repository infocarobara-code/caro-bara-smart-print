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
@page {
  size: A4;
  margin: 0;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 210mm;
  min-height: 297mm;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  color: #2a241d;
  background: #e9ddc9;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.page {
  width: 210mm;
  height: 297mm;
  position: relative;
  overflow: hidden;
  padding: 13mm 14mm 11mm;
  background:
    radial-gradient(circle at 18% 8%, rgba(255,255,255,0.34) 0, rgba(255,255,255,0) 32mm),
    radial-gradient(circle at 92% 18%, rgba(116,82,42,0.055) 0, rgba(116,82,42,0) 42mm),
    linear-gradient(135deg, #efe6d7 0%, #e6d8c2 48%, #f2eadc 100%);
}

.page::before {
  content: "";
  position: absolute;
  inset: 5mm;
  border: 1px solid rgba(126, 94, 58, 0.22);
  pointer-events: none;
}

.page::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(80, 58, 34, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(80, 58, 34, 0.018) 1px, transparent 1px);
  background-size: 7mm 7mm, 7mm 7mm;
  opacity: 0.48;
  pointer-events: none;
}

.content {
  position: relative;
  z-index: 1;
  height: 100%;
}

.header {
  height: 30mm;
  border-bottom: 1.4px solid #8f6e46;
  display: grid;
  grid-template-columns: 1fr 62mm;
  column-gap: 10mm;
  align-items: start;
  padding-bottom: 6mm;
}

.brand-kicker {
  font-size: 8.8px;
  letter-spacing: 2.2px;
  text-transform: uppercase;
  color: #7b5a36;
  font-weight: 700;
  margin-bottom: 4mm;
}

.title {
  font-size: 28px;
  line-height: 1;
  letter-spacing: -0.55px;
  color: #181512;
  font-weight: 800;
  margin: 0 0 3.2mm;
}

.subtitle {
  font-size: 12.2px;
  color: #4f4131;
  line-height: 1.45;
  max-width: 112mm;
}

.header-meta {
  border: 1px solid rgba(143, 110, 70, 0.52);
  background: rgba(246, 239, 226, 0.54);
  padding: 4.2mm 4.4mm;
  min-height: 22mm;
}

.meta-row {
  display: grid;
  grid-template-columns: 23mm 1fr;
  gap: 3mm;
  margin-bottom: 2.5mm;
  font-size: 9.8px;
  line-height: 1.25;
}

.meta-row:last-child {
  margin-bottom: 0;
}

.meta-label {
  color: #735537;
  font-weight: 700;
}

.meta-value {
  color: #191512;
  font-weight: 700;
  word-break: break-word;
}

.notice {
  margin-top: 7mm;
  display: grid;
  grid-template-columns: 10mm 1fr;
  gap: 4mm;
  align-items: center;
  min-height: 20mm;
  border: 1px solid rgba(143, 110, 70, 0.44);
  background: rgba(248, 242, 231, 0.48);
  padding: 4.2mm 5mm;
}

.notice-icon {
  width: 8mm;
  height: 8mm;
  border-radius: 99px;
  background: #8c6a42;
  color: #fff8ef;
  text-align: center;
  line-height: 8mm;
  font-size: 15px;
  font-weight: 800;
}

.notice-text {
  font-size: 12px;
  line-height: 1.62;
  color: #352b20;
}

.section {
  margin-top: 5.2mm;
  border: 1px solid rgba(143, 110, 70, 0.48);
  background: rgba(248, 242, 231, 0.42);
}

.section-head {
  height: 10mm;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(143, 110, 70, 0.36);
  padding: 0 5mm;
  color: #765434;
  font-size: 10.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.3px;
}

.customer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.customer-col {
  padding: 4.7mm 5mm 3.4mm;
}

.customer-col:first-child {
  border-right: 1px solid rgba(143, 110, 70, 0.32);
}

.info-row {
  min-height: 13.2mm;
  display: grid;
  grid-template-columns: 6mm 1fr;
  gap: 3mm;
  align-items: start;
  padding-bottom: 3.2mm;
  margin-bottom: 2.7mm;
  border-bottom: 1px solid rgba(143, 110, 70, 0.16);
}

.info-row:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.info-icon {
  color: #8f6e46;
  font-size: 13px;
  line-height: 1;
  text-align: center;
  padding-top: 1mm;
}

.label {
  color: #6c5a45;
  font-size: 9.8px;
  line-height: 1.1;
  margin-bottom: 1.2mm;
}

.value {
  color: #16130f;
  font-size: 12.1px;
  line-height: 1.34;
  font-weight: 700;
  word-break: break-word;
}

.company-card {
  margin-top: 5.2mm;
  border: 1px solid rgba(143, 110, 70, 0.48);
  background: rgba(248, 242, 231, 0.35);
  display: grid;
  grid-template-columns: 1fr 56mm 1fr;
  min-height: 43mm;
}

.company-column {
  padding: 4.7mm 4.8mm;
}

.company-column:first-child {
  border-right: 1px solid rgba(143, 110, 70, 0.32);
}

.company-column:last-child {
  border-left: 1px solid rgba(143, 110, 70, 0.32);
}

.block-title {
  color: #765434;
  font-size: 10.4px;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin-bottom: 3.8mm;
  display: flex;
  align-items: center;
  gap: 2.4mm;
}

.block-title::after {
  content: "";
  height: 1px;
  background: rgba(143, 110, 70, 0.58);
  flex: 1;
}

.company-name {
  font-size: 12.4px;
  line-height: 1.35;
  font-weight: 800;
  color: #17130f;
  margin-bottom: 3.4mm;
}

.contact-line {
  display: grid;
  grid-template-columns: 5mm 1fr;
  gap: 2.3mm;
  font-size: 10.6px;
  line-height: 1.28;
  color: #342a20;
  margin-bottom: 2mm;
}

.contact-icon {
  color: #8f6e46;
  font-weight: 700;
  text-align: center;
}

.logo-box {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3mm 2mm;
}

.logo-mark {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 29px;
  line-height: 1;
  color: #7b5a36;
  margin-bottom: 2mm;
}

.logo-name {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 21px;
  line-height: 1;
  letter-spacing: 2.1px;
  color: #17130f;
}

.logo-sub {
  margin-top: 1.8mm;
  font-size: 9px;
  letter-spacing: 4.4px;
  color: #2a241d;
}

.logo-rule {
  height: 1px;
  width: 34mm;
  background: rgba(143, 110, 70, 0.72);
  margin: 4mm auto 2.8mm;
}

.logo-slogan {
  font-size: 8.7px;
  line-height: 1.35;
  color: #5d4a36;
  text-transform: uppercase;
}

.details-card {
  margin-top: 5.2mm;
  border: 1px solid rgba(143, 110, 70, 0.48);
  background: rgba(248, 242, 231, 0.32);
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 31mm;
}

.details-section {
  padding: 4.6mm 5mm;
}

.details-section:first-child {
  border-right: 1px solid rgba(143, 110, 70, 0.32);
}

.small-label {
  color: #6c5a45;
  font-size: 9.4px;
  margin-top: 2.5mm;
  margin-bottom: 1mm;
}

.strong {
  font-size: 11.4px;
  line-height: 1.35;
  color: #17130f;
  font-weight: 750;
  word-break: break-word;
}

.footer {
  position: absolute;
  left: 14mm;
  right: 14mm;
  bottom: 11mm;
  height: 35mm;
  border-top: 1.4px solid #8f6e46;
  padding-top: 5mm;
  display: grid;
  grid-template-columns: 1fr 31mm;
  gap: 9mm;
  align-items: start;
  z-index: 2;
}

.footer-note {
  display: grid;
  grid-template-columns: 9mm 1fr;
  gap: 3.5mm;
  align-items: start;
  font-size: 11.1px;
  line-height: 1.48;
  color: #3c3023;
}

.footer-symbol {
  color: #8f6e46;
  font-size: 22px;
  line-height: 1;
  text-align: center;
}

.footer-brand {
  margin-top: 5mm;
  font-size: 9.2px;
  letter-spacing: 4px;
  color: #765434;
  font-weight: 800;
  text-transform: uppercase;
}

.qr-wrap {
  width: 31mm;
  text-align: center;
}

.qr-frame {
  width: 28mm;
  min-height: 31mm;
  margin-left: auto;
  border: 1px solid rgba(143, 110, 70, 0.54);
  background: rgba(255, 255, 255, 0.45);
  padding: 2.4mm 2.4mm 1.8mm;
}

.qr-frame img {
  width: 22mm;
  height: 22mm;
  object-fit: contain;
  display: block;
  margin: 0 auto 1.5mm;
  background: #fff;
}

.qr-caption {
  font-size: 7.1px;
  line-height: 1.25;
  color: #6c5a45;
}

@media print {
  body {
    background: #e9ddc9;
  }
}
</style>
</head>

<body>
<div class="page">
  <div class="content">
    <header class="header">
      <div>
        <div class="brand-kicker">Caro Bara Smart Print · Berlin</div>
        <h1 class="title">Eingangsbestätigung</h1>
        <div class="subtitle">
          Ihre Anfrage wurde erfolgreich empfangen. Dieses Dokument bestätigt die erfassten Kunden- und Referenzdaten.
        </div>
      </div>

      <div class="header-meta">
        <div class="meta-row">
          <div class="meta-label">Dokument</div>
          <div class="meta-value">${escapeHtml(serial)}</div>
        </div>
        <div class="meta-row">
          <div class="meta-label">Datum</div>
          <div class="meta-value">${escapeHtml(date)}</div>
        </div>
        <div class="meta-row">
          <div class="meta-label">Status</div>
          <div class="meta-value">Eingegangen</div>
        </div>
      </div>
    </header>

    <section class="notice">
      <div class="notice-icon">✓</div>
      <div class="notice-text">
        Vielen Dank für Ihre Anfrage. Unser Team prüft die Angaben sorgfältig und meldet sich mit dem nächsten passenden Schritt bei Ihnen.
      </div>
    </section>

    <section class="section">
      <div class="section-head">Kunden- und Referenzdaten</div>

      <div class="customer-grid">
        <div class="customer-col">
          <div class="info-row">
            <div class="info-icon">♙</div>
            <div>
              <div class="label">Name des Kunden</div>
              <div class="value">${escapeHtml(input.customerName)}</div>
            </div>
          </div>

          <div class="info-row">
            <div class="info-icon">▣</div>
            <div>
              <div class="label">Kundennummer</div>
              <div class="value">${escapeHtml(input.customerNumber)}</div>
            </div>
          </div>

          <div class="info-row">
            <div class="info-icon">✉</div>
            <div>
              <div class="label">E-Mail</div>
              <div class="value">${escapeHtml(input.customerEmail)}</div>
            </div>
          </div>

          <div class="info-row">
            <div class="info-icon">⌖</div>
            <div>
              <div class="label">Adresse</div>
              <div class="value">${escapeHtml(
                input.customerAddress || "Nicht verfügbar"
              )}</div>
            </div>
          </div>
        </div>

        <div class="customer-col">
          <div class="info-row">
            <div class="info-icon">☎</div>
            <div>
              <div class="label">Telefonnummer</div>
              <div class="value">${escapeHtml(
                input.customerPhone || "Nicht verfügbar"
              )}</div>
            </div>
          </div>

          <div class="info-row">
            <div class="info-icon">▤</div>
            <div>
              <div class="label">Anfragenummer</div>
              <div class="value">${escapeHtml(input.requestNumber)}</div>
            </div>
          </div>

          <div class="info-row">
            <div class="info-icon">▦</div>
            <div>
              <div class="label">Eingangsdatum</div>
              <div class="value">${escapeHtml(date)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="company-card">
      <div class="company-column">
        <div class="block-title">Unternehmen</div>
        <div class="company-name">Caro Bara Smart Print</div>
        <div class="contact-line">
          <span class="contact-icon">⌖</span>
          <span>Fanninger Straße 20</span>
        </div>
        <div class="contact-line">
          <span class="contact-icon"></span>
          <span>10365 Berlin</span>
        </div>
        <div class="contact-line">
          <span class="contact-icon"></span>
          <span>Deutschland</span>
        </div>
      </div>

      <div class="logo-box">
        <div class="logo-mark">CB</div>
        <div class="logo-name">CARO BARA</div>
        <div class="logo-sub">SMART PRINT</div>
        <div class="logo-rule"></div>
        <div class="logo-slogan">Smart print solutions<br />for a smarter business</div>
      </div>

      <div class="company-column">
        <div class="block-title">Kontakt</div>
        <div class="contact-line">
          <span class="contact-icon">☎</span>
          <span>+49 176 211 050 86</span>
        </div>
        <div class="contact-line">
          <span class="contact-icon">☎</span>
          <span>+49 30 68 96 555 9</span>
        </div>
        <div class="contact-line">
          <span class="contact-icon">✉</span>
          <span>info@carobara.com</span>
        </div>
        <div class="contact-line">
          <span class="contact-icon">✉</span>
          <span>info@carobara.de</span>
        </div>
        <div class="contact-line">
          <span class="contact-icon">◎</span>
          <span>www.carobara.de</span>
        </div>
      </div>
    </section>

    <section class="details-card">
      <div class="details-section">
        <div class="block-title">Bankverbindung</div>
        <div class="small-label">Kontoinhaber</div>
        <div class="strong">Alyoussef, Mohammad Refat</div>
        <div class="small-label">IBAN</div>
        <div class="strong">DE83 1005 0000 0191 3591 90</div>
      </div>

      <div class="details-section">
        <div class="block-title">Steuerinformationen</div>
        <div class="small-label">Steuer-Nr.</div>
        <div class="strong">DE367793052</div>
      </div>
    </section>
  </div>

  <footer class="footer">
    <div>
      <div class="footer-note">
        <div class="footer-symbol">◇</div>
        <div>
          Vielen Dank für Ihr Vertrauen in Caro Bara Smart Print.<br />
          Wir freuen uns auf eine erfolgreiche Zusammenarbeit.
        </div>
      </div>
      <div class="footer-brand">Caro Bara Smart Print</div>
    </div>

    <div class="qr-wrap">
      ${
        qrValue
          ? `
      <div class="qr-frame">
        <img src="${escapeHtml(qrValue)}" />
        <div class="qr-caption">Referenzcode</div>
      </div>`
          : ""
      }
    </div>
  </footer>
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