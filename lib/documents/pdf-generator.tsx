import fs from "fs";
import path from "path";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import type { NormalizedOperationIdentity } from "./operation-identity";
import { buildOperationHumanReference } from "./operation-identity";

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

export type OperationPdfInput = {
  identity: NormalizedOperationIdentity;
  qrCodeDataUrl?: string;
  company: CompanyPdfProfile;
};

type SupportedLanguage = "ar" | "de" | "en";

type TranslationKey =
  | "requestDocument"
  | "appointmentDocument"
  | "documentSubtitle"
  | "companySection"
  | "customerSection"
  | "detailsSection"
  | "detailsSectionContinued"
  | "internalReference"
  | "customerNumber"
  | "requestNumber"
  | "appointmentNumber"
  | "createdAt"
  | "status"
  | "fullName"
  | "email"
  | "phone"
  | "address"
  | "serviceType"
  | "subject"
  | "appointmentType"
  | "appointmentMode"
  | "office"
  | "date"
  | "timeWindow"
  | "fieldColumn"
  | "valueColumn"
  | "technicalSpecs"
  | "materials"
  | "dimensions"
  | "installation"
  | "electricityLighting"
  | "deliveryShipping"
  | "notes"
  | "notAvailable"
  | "page"
  | "of"
  | "legalFooterTax";

type DisplayRow = {
  label: string;
  value: string;
  forceLtr?: boolean;
};

type DetailPage = {
  rows: DisplayRow[];
  twoColumn: boolean;
};

const COMPANY_NAME = "Caro Bara Smart Print";
const COMPANY_ADDRESS_LINE_1 = "Fanninger Straße 20";
const COMPANY_ADDRESS_LINE_2 = "10365 Berlin";
const COMPANY_TAX_NUMBER = "DE367793052";

const translations: Record<SupportedLanguage, Record<TranslationKey, string>> = {
  ar: {
    requestDocument: "مستند طلب رسمي",
    appointmentDocument: "مستند موعد رسمي",
    documentSubtitle: "مرجع منظم للمراجعة والمتابعة",
    companySection: "بيانات الشركة",
    customerSection: "بيانات العميل",
    detailsSection: "تفاصيل الطلب",
    detailsSectionContinued: "تفاصيل الطلب (تابع)",
    internalReference: "المرجع الداخلي",
    customerNumber: "رقم العميل",
    requestNumber: "رقم الطلب",
    appointmentNumber: "رقم الموعد",
    createdAt: "تاريخ الإنشاء",
    status: "الحالة",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    address: "العنوان",
    serviceType: "نوع الخدمة",
    subject: "الموضوع",
    appointmentType: "نوع الموعد",
    appointmentMode: "طريقة الموعد",
    office: "المكتب",
    date: "التاريخ",
    timeWindow: "النافذة الزمنية",
    fieldColumn: "البند",
    valueColumn: "القيمة",
    technicalSpecs: "المواصفات الفنية",
    materials: "المواد",
    dimensions: "الأبعاد",
    installation: "التركيب",
    electricityLighting: "الكهرباء / الإضاءة",
    deliveryShipping: "التسليم / الشحن",
    notes: "ملاحظات",
    notAvailable: "غير متوفر",
    page: "صفحة",
    of: "من",
    legalFooterTax: "Steuer-Nr.",
  },
  de: {
    requestDocument: "Offizielles Anfragedokument",
    appointmentDocument: "Offizielles Termindokument",
    documentSubtitle: "Strukturierter Nachweis für interne Prüfung und Nachverfolgung",
    companySection: "Unternehmensdaten",
    customerSection: "Kundendaten",
    detailsSection: "Auftragsdetails",
    detailsSectionContinued: "Auftragsdetails (Fortsetzung)",
    internalReference: "Interne Referenz",
    customerNumber: "Kundennummer",
    requestNumber: "Anfragenummer",
    appointmentNumber: "Terminnummer",
    createdAt: "Erstellt am",
    status: "Status",
    fullName: "Vollständiger Name",
    email: "E-Mail",
    phone: "Telefon",
    address: "Adresse",
    serviceType: "Serviceart",
    subject: "Betreff",
    appointmentType: "Terminart",
    appointmentMode: "Terminmodus",
    office: "Standort",
    date: "Datum",
    timeWindow: "Zeitfenster",
    fieldColumn: "Feld",
    valueColumn: "Wert",
    technicalSpecs: "Technische Angaben",
    materials: "Materialien",
    dimensions: "Abmessungen",
    installation: "Montage",
    electricityLighting: "Elektrik / Beleuchtung",
    deliveryShipping: "Lieferung / Versand",
    notes: "Notizen",
    notAvailable: "Nicht verfügbar",
    page: "Seite",
    of: "von",
    legalFooterTax: "Steuer-Nr.",
  },
  en: {
    requestDocument: "Official Request Document",
    appointmentDocument: "Official Appointment Document",
    documentSubtitle: "Structured reference for internal review and tracking",
    companySection: "Company Details",
    customerSection: "Customer Details",
    detailsSection: "Request Details",
    detailsSectionContinued: "Request Details (Continued)",
    internalReference: "Internal Reference",
    customerNumber: "Customer Number",
    requestNumber: "Request Number",
    appointmentNumber: "Appointment Number",
    createdAt: "Created At",
    status: "Status",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    serviceType: "Service Type",
    subject: "Subject",
    appointmentType: "Appointment Type",
    appointmentMode: "Appointment Mode",
    office: "Office",
    date: "Date",
    timeWindow: "Time Window",
    fieldColumn: "Field",
    valueColumn: "Value",
    technicalSpecs: "Technical Specs",
    materials: "Materials",
    dimensions: "Dimensions",
    installation: "Installation",
    electricityLighting: "Electricity / Lighting",
    deliveryShipping: "Delivery / Shipping",
    notes: "Notes",
    notAvailable: "Not available",
    page: "Page",
    of: "of",
    legalFooterTax: "Steuer-Nr.",
  },
};

export async function generateOperationPdfBufferWithPuppeteer(
  input: OperationPdfInput
): Promise<Buffer> {
  const html = buildOperationPdfHtml(input);
  const browser = await launchPuppeteerBrowser();

  try {
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: false,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

export function buildOperationPdfHtml(input: OperationPdfInput): string {
  const identity = input.identity;
  const language = resolvePdfLanguage(identity?.language);
  const t = createTranslator(language);
  const dir = language === "ar" ? "rtl" : "ltr";
  const isAppointment = identity.kind === "appointment";
  const documentTitle = isAppointment
    ? t("appointmentDocument")
    : t("requestDocument");

  const logoDataUrl = resolvePublicAssetDataUrl(input.company.logoSrc);
  const regularFontDataUrl = resolveFontDataUrl("Cairo-Regular.ttf");
  const boldFontDataUrl = resolveFontDataUrl("Cairo-Bold.ttf");

  const companyRows = buildCompanyRows();
  const customerRows = buildCustomerRows(identity, language, t);
  const metaRows = buildMetaRows(identity, language, t, isAppointment);
  const allDetailRows = buildMasterDetailRows(identity, language, t);
  const detailPages = paginateMasterTable(allDetailRows);
  const totalPages = Math.max(1, detailPages.length);

  return `<!DOCTYPE html>
<html lang="${escapeHtml(language)}" dir="${escapeHtml(dir)}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(documentTitle)}</title>
  <style>
    ${buildFontFaceCss(regularFontDataUrl, boldFontDataUrl)}
    @page {
      size: A4;
      margin: 0;
    }
    * {
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #111827;
      font-family: "CairoPdf", Arial, sans-serif;
      direction: ${dir};
      -webkit-font-smoothing: antialiased;
      text-rendering: geometricPrecision;
    }
    body {
      font-size: 11px;
      line-height: 1.5;
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 14mm;
      display: flex;
      flex-direction: column;
      gap: 7mm;
      page-break-after: always;
      background: #ffffff;
    }
    .page:last-child {
      page-break-after: auto;
    }
    .page-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 7mm;
    }
    .page-break-avoid {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .doc-topline {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10mm;
      min-height: 18mm;
    }
    .doc-title {
      margin: 0 0 1.5mm;
      font-size: 19px;
      line-height: 1.15;
      font-family: "CairoPdfBold", Arial, sans-serif;
    }
    .doc-subtitle {
      margin: 0;
      color: #6b7280;
      font-size: 10px;
      line-height: 1.35;
    }
    .logo-box {
      min-width: 30mm;
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
    }
    .logo-box img {
      max-width: 25mm;
      max-height: 16mm;
      object-fit: contain;
      display: block;
    }
    .mini-brand {
      font-family: "CairoPdfBold", Arial, sans-serif;
      font-size: 10px;
      text-align: ${dir === "rtl" ? "left" : "right"};
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8mm;
      align-items: stretch;
    }
    .info-box {
      border: 0.35mm solid #111827;
      padding: 5mm 5mm 4.5mm;
      min-height: 42mm;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .info-title {
      margin: 0 0 3mm;
      font-size: 12px;
      font-family: "CairoPdfBold", Arial, sans-serif;
    }
    .info-line {
      display: grid;
      grid-template-columns: 30mm 1fr;
      gap: 4mm;
      align-items: start;
      margin: 0 0 1.8mm;
    }
    .info-label {
      color: #374151;
      font-size: 10px;
      font-family: "CairoPdfBold", Arial, sans-serif;
    }
    .info-value {
      color: #111827;
      font-size: 10.4px;
      word-break: break-word;
      overflow-wrap: anywhere;
      unicode-bidi: plaintext;
      white-space: pre-wrap;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 3mm;
    }
    .meta-box {
      border: 0.25mm solid #9ca3af;
      padding: 2.8mm 3mm;
      min-height: 16mm;
    }
    .meta-label {
      margin: 0 0 1mm;
      font-size: 9px;
      color: #6b7280;
      font-family: "CairoPdfBold", Arial, sans-serif;
    }
    .meta-value {
      margin: 0;
      font-size: 10px;
      line-height: 1.35;
      word-break: break-word;
      overflow-wrap: anywhere;
      unicode-bidi: plaintext;
      white-space: pre-wrap;
    }
    .section-title {
      margin: 0 0 2.5mm;
      font-size: 13px;
      font-family: "CairoPdfBold", Arial, sans-serif;
    }
    .master-table {
      border: 0.35mm solid #111827;
      overflow: hidden;
      background: #ffffff;
    }
    .master-table.two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
    .master-table-half + .master-table-half {
      border-${dir === "rtl" ? "right" : "left"}: 0.35mm solid #111827;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }
    thead th {
      border-bottom: 0.35mm solid #111827;
      background: #f8fafc;
      padding: 2.5mm 3mm;
      font-size: 9.5px;
      text-align: ${dir === "rtl" ? "right" : "left"};
      font-family: "CairoPdfBold", Arial, sans-serif;
    }
    tbody td {
      vertical-align: top;
      padding: 2.5mm 3mm;
      font-size: 10px;
      border-top: 0.2mm solid #d1d5db;
      word-break: break-word;
      overflow-wrap: anywhere;
      unicode-bidi: plaintext;
      white-space: pre-wrap;
    }
    tbody tr:first-child td {
      border-top: none;
    }
    .col-label {
      width: 34%;
      color: #374151;
      font-family: "CairoPdfBold", Arial, sans-serif;
    }
    .col-value {
      width: 66%;
    }
    .ltr {
      direction: ltr;
      text-align: left;
    }
    .page-footer {
      margin-top: auto;
      padding-top: 4mm;
      border-top: 0.25mm solid #9ca3af;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 10mm;
    }
    .footer-company {
      text-align: ${dir === "rtl" ? "right" : "left"};
      font-size: 8.8px;
      line-height: 1.35;
      color: #374151;
    }
    .footer-company strong {
      color: #111827;
      font-family: "CairoPdfBold", Arial, sans-serif;
    }
    .footer-page {
      font-size: 8.8px;
      color: #374151;
      white-space: nowrap;
    }
  </style>
</head>
<body>
  ${detailPages
      .map(
        (page, index) => `
      <section class="page">
        <div class="page-content">
          ${index === 0
            ? `
              <div class="doc-topline page-break-avoid">
                <div>
                  <p class="doc-title">${escapeHtml(documentTitle)}</p>
                  <p class="doc-subtitle">${escapeHtml(t("documentSubtitle"))}</p>
                </div>
                <div class="logo-box">${buildTopLogoHtml(logoDataUrl)}</div>
              </div>

              <div class="info-grid page-break-avoid">
                ${buildInfoBoxHtml(t("companySection"), companyRows)}
                ${buildInfoBoxHtml(t("customerSection"), customerRows)}
              </div>

              <div class="meta-grid page-break-avoid">
                ${metaRows
              .map(
                (row) => `
                    <div class="meta-box">
                      <p class="meta-label">${escapeHtml(row.label)}</p>
                      <p class="meta-value${row.forceLtr ? " ltr" : ""}">${escapeHtml(row.value)}</p>
                    </div>
                  `
              )
              .join("")}
              </div>
            `
            : ""
          }

          ${buildMasterTableSectionHtml({
            title: index === 0 ? t("detailsSection") : t("detailsSectionContinued"),
            rows: page.rows,
            twoColumn: page.twoColumn,
            fieldTitle: t("fieldColumn"),
            valueTitle: t("valueColumn"),
          })}

          ${buildFooterHtml(language, index + 1, totalPages)}
        </div>
      </section>
    `
      )
      .join("")}
</body>
</html>`;
}

async function launchPuppeteerBrowser() {
  const isVercel = Boolean(process.env.VERCEL);
  const configuredExecutable = safeString(process.env.PUPPETEER_EXECUTABLE_PATH);

  try {
    if (isVercel) {
      const executablePath = await chromium.executablePath();

      return await puppeteer.launch({
        executablePath,
        headless: true,
        args: [...chromium.args, "--font-render-hinting=medium"],
      });
    }

    const localExecutablePath = resolveLocalChromeExecutablePath(configuredExecutable);

    return await puppeteer.launch({
      headless: true,
      executablePath: localExecutablePath || undefined,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--font-render-hinting=medium",
      ],
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Puppeteer launch error";

    throw new Error(
      `Puppeteer launch failed: ${errorMessage}. ` +
      `Expected runtime: local Chrome/Chromium in development or @sparticuz/chromium on Vercel. ` +
      `If local launch still fails, set PUPPETEER_EXECUTABLE_PATH to your Chrome/Chromium executable.`
    );
  }
}

function resolveLocalChromeExecutablePath(configuredExecutable?: string): string {
  if (configuredExecutable && fs.existsSync(configuredExecutable)) {
    return configuredExecutable;
  }

  const platform = process.platform;
  const candidates: string[] = [];

  if (platform === "win32") {
    candidates.push(
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      path.join(
        process.env.LOCALAPPDATA || "",
        "Google",
        "Chrome",
        "Application",
        "chrome.exe"
      ),
      path.join(
        process.env.PROGRAMFILES || "",
        "Google",
        "Chrome",
        "Application",
        "chrome.exe"
      ),
      path.join(
        process.env["PROGRAMFILES(X86)"] || "",
        "Google",
        "Chrome",
        "Application",
        "chrome.exe"
      ),
      "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
    );
  } else if (platform === "darwin") {
    candidates.push(
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
      path.join(
        process.env.HOME || "",
        "Applications",
        "Google Chrome.app",
        "Contents",
        "MacOS",
        "Google Chrome"
      )
    );
  } else {
    candidates.push(
      "/usr/bin/google-chrome",
      "/usr/bin/google-chrome-stable",
      "/usr/bin/chromium-browser",
      "/usr/bin/chromium",
      "/snap/bin/chromium"
    );
  }

  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return "";
}

function buildInfoBoxHtml(title: string, rows: DisplayRow[]): string {
  return `
    <div class="info-box">
      <p class="info-title">${escapeHtml(title)}</p>
      ${rows
      .map(
        (row) => `
          <div class="info-line">
            <div class="info-label">${escapeHtml(row.label)}</div>
            <div class="info-value${row.forceLtr ? " ltr" : ""}">${escapeHtml(
          row.value
        )}</div>
          </div>
        `
      )
      .join("")}
    </div>
  `;
}

function buildMasterTableSectionHtml(params: {
  title: string;
  rows: DisplayRow[];
  twoColumn: boolean;
  fieldTitle: string;
  valueTitle: string;
}): string {
  if (!params.rows.length) {
    return "";
  }

  if (!params.twoColumn) {
    return `
      <div class="page-break-avoid">
        <p class="section-title">${escapeHtml(params.title)}</p>
        <div class="master-table">
          ${buildRowsTableHtml(params.rows, params.fieldTitle, params.valueTitle)}
        </div>
      </div>
    `;
  }

  const midpoint = Math.ceil(params.rows.length / 2);
  const leftRows = params.rows.slice(0, midpoint);
  const rightRows = params.rows.slice(midpoint);

  return `
    <div class="page-break-avoid">
      <p class="section-title">${escapeHtml(params.title)}</p>
      <div class="master-table two-column">
        <div class="master-table-half">
          ${buildRowsTableHtml(leftRows, params.fieldTitle, params.valueTitle)}
        </div>
        <div class="master-table-half">
          ${buildRowsTableHtml(rightRows, params.fieldTitle, params.valueTitle)}
        </div>
      </div>
    </div>
  `;
}

function buildRowsTableHtml(
  rows: DisplayRow[],
  fieldTitle: string,
  valueTitle: string
): string {
  return `
    <table>
      <thead>
        <tr>
          <th class="col-label">${escapeHtml(fieldTitle)}</th>
          <th class="col-value">${escapeHtml(valueTitle)}</th>
        </tr>
      </thead>
      <tbody>
        ${rows
      .map(
        (row) => `
            <tr>
              <td class="col-label">${escapeHtml(row.label)}</td>
              <td class="col-value${row.forceLtr ? " ltr" : ""}">${escapeHtml(
          row.value
        )}</td>
            </tr>
          `
      )
      .join("")}
      </tbody>
    </table>
  `;
}

function buildFooterHtml(
  language: SupportedLanguage,
  pageNumber: number,
  totalPages: number
): string {
  const t = createTranslator(language);

  return `
    <div class="page-footer">
      <div class="footer-company">
        <div><strong>${escapeHtml(COMPANY_NAME)}</strong></div>
        <div>${escapeHtml(COMPANY_ADDRESS_LINE_1)}</div>
        <div>${escapeHtml(COMPANY_ADDRESS_LINE_2)}</div>
        <div>${escapeHtml(t("legalFooterTax"))} ${escapeHtml(COMPANY_TAX_NUMBER)}</div>
      </div>
      <div class="footer-page">${escapeHtml(t("page"))} ${pageNumber} ${escapeHtml(
    t("of")
  )} ${totalPages}</div>
    </div>
  `;
}

function buildTopLogoHtml(logoDataUrl?: string): string {
  if (hasValue(logoDataUrl)) {
    return `<img src="${escapeHtml(logoDataUrl)}" alt="Logo" />`;
  }

  return `<div class="mini-brand">${escapeHtml(COMPANY_NAME)}</div>`;
}

function buildCompanyRows(): DisplayRow[] {
  return [
    { label: "Name", value: COMPANY_NAME },
    { label: "Address", value: COMPANY_ADDRESS_LINE_1 },
    { label: "City", value: COMPANY_ADDRESS_LINE_2 },
    { label: "Tax", value: `Steuer-Nr. ${COMPANY_TAX_NUMBER}`, forceLtr: true },
  ];
}

function buildCustomerRows(
  identity: NormalizedOperationIdentity,
  language: SupportedLanguage,
  t: (key: TranslationKey) => string
): DisplayRow[] {
  const customerAddress = firstNonEmpty(
    safeString(identity.customer.addressLine),
    buildCustomerAddressFromParts(identity)
  );

  return compactRows(
    [
      {
        label: t("fullName"),
        value: normalizeDisplayValue(identity.customer.fullName, language),
      },
      {
        label: t("email"),
        value: normalizeDisplayValue(identity.customer.email, language),
        forceLtr: true,
      },
      {
        label: t("phone"),
        value: normalizeDisplayValue(identity.customer.phone, language),
        forceLtr: true,
      },
      {
        label: t("address"),
        value: normalizeDisplayValue(customerAddress, language),
      },
    ],
    language
  );
}

function buildMetaRows(
  identity: NormalizedOperationIdentity,
  language: SupportedLanguage,
  t: (key: TranslationKey) => string,
  isAppointment: boolean
): DisplayRow[] {
  const operationNumber = firstNonEmpty(
    safeString(identity.ids.appointmentId),
    safeString(identity.ids.requestId),
    safeString(identity.ids.referenceNumber)
  );

  return compactRows(
    [
      {
        label: t("internalReference"),
        value: buildSafeHumanReference(identity),
        forceLtr: true,
      },
      {
        label: isAppointment ? t("appointmentNumber") : t("requestNumber"),
        value: normalizeDisplayValue(operationNumber, language),
        forceLtr: true,
      },
      {
        label: t("customerNumber"),
        value: resolveCustomerNumber(identity, language),
        forceLtr: true,
      },
      {
        label: t("createdAt"),
        value: formatDateTime(identity.meta?.createdAt, language),
      },
      {
        label: t("status"),
        value: normalizeDisplayValue(identity.operation.status, language),
      },
    ],
    language
  );
}

function buildMasterDetailRows(
  identity: NormalizedOperationIdentity,
  language: SupportedLanguage,
  t: (key: TranslationKey) => string
): DisplayRow[] {
  const rows: DisplayRow[] = [];
  const subjectValue = normalizeDisplayValue(identity.operation.subject, language);
  const serviceTypeValue = normalizeDisplayValue(identity.operation.serviceType, language);

  pushUsefulRow(
    rows,
    {
      label: t("serviceType"),
      value: serviceTypeValue,
    },
    language
  );

  pushUsefulRow(
    rows,
    {
      label: t("subject"),
      value: subjectValue,
    },
    language
  );

  pushUsefulRow(
    rows,
    {
      label: t("appointmentType"),
      value: normalizeDisplayValue(identity.operation.appointmentType, language),
    },
    language
  );

  pushUsefulRow(
    rows,
    {
      label: t("appointmentMode"),
      value: normalizeDisplayValue(identity.operation.appointmentMode, language),
    },
    language
  );

  pushUsefulRow(
    rows,
    {
      label: t("office"),
      value: firstNonEmpty(
        safeString(identity.operation.officeLabel),
        safeString(identity.operation.officeId)
      ),
    },
    language
  );

  pushUsefulRow(
    rows,
    {
      label: t("date"),
      value: formatDateOnly(identity.schedule.date, language),
    },
    language
  );

  pushUsefulRow(
    rows,
    {
      label: t("timeWindow"),
      value: firstNonEmpty(
        safeString(identity.schedule.timeLabel),
        buildTimeWindow(identity.schedule.startTime, identity.schedule.endTime, language)
      ),
      forceLtr: true,
    },
    language
  );

  const dimensions = extractDimensions(identity);
  pushUsefulRow(
    rows,
    {
      label: prettifyKnownLabel("dimensions", t),
      value: dimensions,
      forceLtr: true,
    },
    language
  );

  collectExtraRows(rows, identity.extra, language, t, {
    subjectValue,
    serviceTypeValue,
  });
  collectMessageRows(rows, identity.operation.message, language, t, {
    subjectValue,
    serviceTypeValue,
    customerFullName: normalizeDisplayValue(identity.customer.fullName, language),
  });

  return compactRows(rows, language);
}

function collectExtraRows(
  target: DisplayRow[],
  extra: Record<string, unknown> | undefined,
  language: SupportedLanguage,
  t: (key: TranslationKey) => string,
  context: {
    subjectValue: string;
    serviceTypeValue: string;
  }
) {
  if (!extra || typeof extra !== "object") {
    return;
  }

  for (const [key, rawValue] of Object.entries(extra)) {
    const cleanKey = compactWhitespace(key);
    const cleanValue = stringifyUnknown(rawValue);

    if (!cleanValue) {
      continue;
    }

    if (
      isInternalKey(cleanKey) ||
      isCustomerKey(cleanKey) ||
      shouldDropByLabel(cleanKey)
    ) {
      continue;
    }

    if (shouldDropByValue(cleanValue, context)) {
      continue;
    }

    pushUsefulRow(
      target,
      {
        label: normalizeExternalLabel(cleanKey, t),
        value: cleanValue,
        forceLtr: shouldForceLtrValue(cleanValue),
      },
      language
    );
  }
}

function collectMessageRows(
  target: DisplayRow[],
  message: string | undefined,
  language: SupportedLanguage,
  t: (key: TranslationKey) => string,
  context: {
    subjectValue: string;
    serviceTypeValue: string;
    customerFullName: string;
  }
) {
  const reservedLabels = new Set(
    [
      t("fullName"),
      t("email"),
      t("phone"),
      t("address"),
      t("internalReference"),
      t("customerNumber"),
      t("requestNumber"),
      t("appointmentNumber"),
      t("createdAt"),
      t("status"),
      t("serviceType"),
      t("subject"),
      t("appointmentType"),
      t("appointmentMode"),
      t("office"),
      t("date"),
      t("timeWindow"),
      "first name",
      "last name",
      "surname",
      "name",
      "full name",
      "phone",
      "email",
      "address",
      "street",
      "house number",
      "postal code",
      "city",
      "country",
      "salutation",
      "source path",
      "items count",
      "service id",
      "request id",
      "appointment id",
      "customer data",
      "طلبات",
      "الطلب",
      "الاسم",
      "الاسم الأول",
      "اسم العائلة",
      "العنوان",
      "الشارع",
      "رقم المنزل",
      "رقم المنزل / الشقة",
      "الرمز البريدي",
      "المدينة",
      "الدولة",
      "الصفة",
      "الهاتف",
      "الإيميل",
      "البريد الإلكتروني",
      "بيانات العميل",
      "cart",
      "language",
      "اللغة",
      "operation type",
      "نوع العملية",
    ].map((value) => value.toLowerCase())
  );

  const normalizedMessage = normalizeMultilineText(message, language);
  if (!normalizedMessage || isNotAvailableValue(normalizedMessage)) {
    return;
  }

  const lines = normalizedMessage
    .split("\n")
    .map((line) => cleanLine(line))
    .filter(Boolean);

  for (const line of lines) {
    const labeledLine = line.match(/^([^:：]{1,120})\s*[:：]\s*(.+)$/);

    if (labeledLine) {
      const rawLabel = compactWhitespace(labeledLine[1]);
      const rawValue = compactWhitespace(labeledLine[2]);

      if (!rawLabel || !rawValue) {
        continue;
      }

      if (
        reservedLabels.has(rawLabel.toLowerCase()) ||
        isCustomerKey(rawLabel) ||
        isInternalKey(rawLabel) ||
        isCustomerKey(rawValue) ||
        shouldDropByLabel(rawLabel) ||
        shouldDropByValue(rawValue, context)
      ) {
        continue;
      }

      pushUsefulRow(
        target,
        {
          label: normalizeExternalLabel(rawLabel, t),
          value: rawValue,
          forceLtr: shouldForceLtrValue(rawValue),
        },
        language
      );

      continue;
    }

    const inlineDimensions = extractInlineDimensions(line);
    if (inlineDimensions.length) {
      for (const dimension of inlineDimensions) {
        pushUsefulRow(
          target,
          {
            label: prettifyKnownLabel("dimensions", t),
            value: dimension,
            forceLtr: true,
          },
          language
        );
      }
      continue;
    }

    if (
      isCustomerKey(line) ||
      isInternalKey(line) ||
      shouldDropByValue(line, context) ||
      shouldDropPlainLine(line)
    ) {
      continue;
    }

    pushUsefulRow(
      target,
      {
        label: t("notes"),
        value: line,
        forceLtr: shouldForceLtrValue(line),
      },
      language
    );
  }
}

function paginateMasterTable(rows: DisplayRow[]): DetailPage[] {
  if (!rows.length) {
    return [{ rows: [], twoColumn: false }];
  }

  const useTwoColumns = rows.length > 16;
  const firstPageCapacity = useTwoColumns ? 20 : 12;
  const nextPageCapacity = useTwoColumns ? 32 : 22;

  const pages: DetailPage[] = [];
  let cursor = 0;

  pages.push({
    rows: rows.slice(cursor, cursor + firstPageCapacity),
    twoColumn: useTwoColumns,
  });
  cursor += firstPageCapacity;

  while (cursor < rows.length) {
    pages.push({
      rows: rows.slice(cursor, cursor + nextPageCapacity),
      twoColumn: useTwoColumns,
    });
    cursor += nextPageCapacity;
  }

  return pages;
}

function normalizeExternalLabel(
  rawLabel: string,
  t: (key: TranslationKey) => string
): string {
  const clean = compactWhitespace(rawLabel);
  const haystack = clean.toLowerCase();

  if (
    hasAny(haystack, [
      "dimensions",
      "dimension",
      "größe",
      "maß",
      "maße",
      "abmess",
      "أبعاد",
      "مقاس",
      "المقاس",
      "قياس",
      "size",
      "format",
      "größe",
    ])
  ) {
    return prettifyKnownLabel("dimensions", t);
  }

  if (
    hasAny(haystack, [
      "material",
      "materials",
      "materialien",
      "مواد",
      "المواد",
      "paper",
      "نوع الورق",
      "غراماج",
      "finish",
      "coating",
      "lamination",
      "fabric",
      "holz",
      "acrylic",
      "dibond",
      "vinyl",
      "pvc",
      "carton",
      "box",
      "sticker",
      "textile",
      "gift",
      "promo",
    ])
  ) {
    return prettifyKnownLabel("materials", t);
  }

  if (
    hasAny(haystack, [
      "technical",
      "spec",
      "farbe",
      "color",
      "colors",
      "ألوان",
      "الطباعة",
      "print",
      "druck",
      "resolution",
      "seiten",
      "pages",
      "fold",
      "falz",
      "finish type",
      "style",
      "shape",
      "model",
      "version",
      "quantity specification",
    ])
  ) {
    return prettifyKnownLabel("technicalSpecs", t);
  }

  if (
    hasAny(haystack, [
      "install",
      "installation",
      "montage",
      "تركيب",
      "تثبيت",
      "mounting",
      "assembly",
      "setup",
      "event setup",
    ])
  ) {
    return prettifyKnownLabel("installation", t);
  }

  if (
    hasAny(haystack, [
      "electric",
      "electricity",
      "light",
      "lighting",
      "led",
      "power",
      "voltage",
      "adapter",
      "cable",
      "كهرباء",
      "إضاءة",
      "اضاءة",
    ])
  ) {
    return prettifyKnownLabel("electricityLighting", t);
  }

  if (
    hasAny(haystack, [
      "delivery",
      "shipping",
      "pickup",
      "lieferung",
      "versand",
      "تسليم",
      "شحن",
      "موعد التسليم",
      "deadline",
      "express",
      "pickup date",
    ])
  ) {
    return prettifyKnownLabel("deliveryShipping", t);
  }

  if (
    hasAny(haystack, [
      "note",
      "notes",
      "remark",
      "comment",
      "commentary",
      "ملاحظة",
      "ملاحظات",
      "general notes",
      "ملاحظات عامة",
      "brief",
      "description",
      "details",
    ])
  ) {
    return prettifyKnownLabel("notes", t);
  }

  return prettifyKey(clean);
}

function prettifyKnownLabel(
  key:
    | "technicalSpecs"
    | "materials"
    | "dimensions"
    | "installation"
    | "electricityLighting"
    | "deliveryShipping"
    | "notes",
  t: (key: TranslationKey) => string
): string {
  return t(key);
}

function shouldDropByLabel(value: string): boolean {
  const haystack = compactWhitespace(value).toLowerCase();

  return hasAny(haystack, [
    "source path",
    "items count",
    "language",
    "operation type",
    "project info",
    "project information",
    "projectinformationen",
    "معلومات المشروع",
    "internal id",
    "service id",
    "request id",
    "appointment id",
    "raw message",
    "debug",
    "system",
    "api",
  ]);
}

function shouldDropByValue(
  value: string,
  context: {
    subjectValue?: string;
    serviceTypeValue?: string;
    customerFullName?: string;
  }
): boolean {
  const clean = compactWhitespace(value);
  const lower = clean.toLowerCase();

  if (!clean) {
    return true;
  }

  if (lower === compactWhitespace(context.customerFullName || "").toLowerCase()) {
    return true;
  }

  if (
    hasAny(lower, [
      "/cart",
      "source path",
      "items count",
      "cart",
      "api",
      "debug",
      "internal",
    ])
  ) {
    return true;
  }

  return false;
}

function shouldDropPlainLine(value: string): boolean {
  const lower = compactWhitespace(value).toLowerCase();

  return hasAny(lower, [
    "/cart",
    "source path",
    "items count",
    "api",
    "debug",
    "internal",
  ]);
}

function buildFontFaceCss(
  regularFontDataUrl?: string,
  boldFontDataUrl?: string
): string {
  const cssBlocks: string[] = [];

  if (regularFontDataUrl) {
    cssBlocks.push(`
      @font-face {
        font-family: "CairoPdf";
        src: url("${regularFontDataUrl}") format("truetype");
        font-weight: 400;
        font-style: normal;
      }
    `);
  }

  if (boldFontDataUrl) {
    cssBlocks.push(`
      @font-face {
        font-family: "CairoPdfBold";
        src: url("${boldFontDataUrl}") format("truetype");
        font-weight: 700;
        font-style: normal;
      }
    `);
  }

  if (!cssBlocks.length) {
    cssBlocks.push(`
      @font-face { font-family: "CairoPdf"; src: local("Arial"); }
      @font-face { font-family: "CairoPdfBold"; src: local("Arial Bold"); }
    `);
  }

  return cssBlocks.join("\n");
}

function createTranslator(language: SupportedLanguage) {
  return function translate(key: TranslationKey): string {
    return translations[language][key] || translations.en[key] || key;
  };
}

function resolvePdfLanguage(value?: string): SupportedLanguage {
  return value === "ar" || value === "de" || value === "en" ? value : "en";
}

function formatDateOnly(
  value?: string | null,
  language: SupportedLanguage = "en"
): string {
  if (!hasValue(value)) {
    return translations[language].notAvailable;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  try {
    return new Intl.DateTimeFormat(mapLocale(language), {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch {
    return value;
  }
}

function formatDateTime(
  value?: string | null,
  language: SupportedLanguage = "en"
): string {
  if (!hasValue(value)) {
    return translations[language].notAvailable;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  try {
    return new Intl.DateTimeFormat(mapLocale(language), {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return value;
  }
}

function buildTimeWindow(
  startTime?: string | null,
  endTime?: string | null,
  language: SupportedLanguage = "en"
): string {
  if (hasValue(startTime) && hasValue(endTime)) {
    return `${startTime} - ${endTime}`;
  }

  if (hasValue(startTime)) {
    return startTime;
  }

  if (hasValue(endTime)) {
    return endTime;
  }

  return translations[language].notAvailable;
}

function normalizeMultilineText(
  value?: string | null,
  language: SupportedLanguage = "en"
): string {
  if (!hasValue(value)) {
    return translations[language].notAvailable;
  }

  return value
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ \u00A0]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeDisplayValue(
  value?: string | null,
  language: SupportedLanguage = "en"
): string {
  return hasValue(value) ? compactWhitespace(value) : translations[language].notAvailable;
}

function buildCustomerAddressFromParts(identity: NormalizedOperationIdentity): string {
  const parts = [
    safeString(identity?.customer?.addressParts?.street),
    safeString(identity?.customer?.addressParts?.houseNumber),
    safeString(identity?.customer?.addressParts?.postalCode),
    safeString(identity?.customer?.addressParts?.city),
    safeString(identity?.customer?.addressParts?.country),
  ].filter(Boolean);

  return parts.join(", ");
}

function buildSafeHumanReference(identity: NormalizedOperationIdentity): string {
  try {
    return buildOperationHumanReference(identity);
  } catch {
    return firstNonEmpty(
      safeString(identity?.ids?.referenceNumber),
      safeString(identity?.ids?.requestId),
      safeString(identity?.ids?.appointmentId),
      "N/A"
    );
  }
}

function resolveCustomerNumber(
  identity: NormalizedOperationIdentity,
  language: SupportedLanguage
): string {
  const explicit = safeString(identity?.ids?.customerId);
  if (explicit) {
    return explicit;
  }

  const source = firstNonEmpty(
    safeString(identity?.customer?.email),
    safeString(identity?.customer?.phone),
    safeString(identity?.customer?.fullName),
    safeString(identity?.ids?.referenceNumber),
    safeString(identity?.ids?.requestId),
    safeString(identity?.ids?.appointmentId)
  );

  if (!source) {
    return translations[language].notAvailable;
  }

  const hash = stableHash(source).toString(16).toUpperCase().padStart(8, "0");
  return `CUS-${hash.slice(0, 8)}`;
}

function stableHash(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function extractDimensions(identity: NormalizedOperationIdentity): string {
  const width = safeUnknownToString(identity.extra?.width);
  const height = safeUnknownToString(identity.extra?.height);
  const length = safeUnknownToString(identity.extra?.length);

  if (width && height && length) {
    return `${width} × ${height} × ${length}`;
  }

  if (width && height) {
    return `${width} × ${height}`;
  }

  const haystack = [
    safeString(identity.operation.subject),
    safeString(identity.operation.message),
    safeString(identity.operation.serviceType),
    stringifyUnknown(identity.extra),
  ].join(" ");

  return extractInlineDimensions(haystack)[0] || "";
}

function extractInlineDimensions(value: string): string[] {
  const results: string[] = [];
  const normalized = String(value || "");

  const regex =
    /(\d+(?:[.,]\d+)?)\s*(cm|mm|m|meter|meters|metre|metres|سم|مم|متر)\s*[x×*-]\s*(\d+(?:[.,]\d+)?)\s*(cm|mm|m|meter|meters|metre|metres|سم|مم|متر)(?:\s*[x×*-]\s*(\d+(?:[.,]\d+)?)\s*(cm|mm|m|meter|meters|metre|metres|سم|مم|متر))?/gi;

  let match: RegExpExecArray | null = null;
  while ((match = regex.exec(normalized))) {
    const first = `${match[1]} ${match[2]}`;
    const second = `${match[3]} ${match[4]}`;
    const third = match[5] && match[6] ? ` × ${match[5]} ${match[6]}` : "";
    results.push(`${first} × ${second}${third}`);
  }

  return uniqueStrings(results);
}

function resolvePublicAssetDataUrl(src?: string): string | undefined {
  const safeSrc = safeString(src);

  if (!safeSrc) {
    return undefined;
  }

  if (safeSrc.startsWith("data:") || /^https?:\/\//i.test(safeSrc)) {
    return safeSrc;
  }

  const normalizedPath = safeSrc.startsWith("/") ? safeSrc.slice(1) : safeSrc;
  const absolutePath = path.join(process.cwd(), "public", normalizedPath);

  return readFileAsDataUrl(absolutePath);
}

function resolveFontDataUrl(fileName: string): string | undefined {
  const absolutePath = path.join(process.cwd(), "public", "fonts", fileName);
  return readFileAsDataUrl(absolutePath);
}

function readFileAsDataUrl(absolutePath: string): string | undefined {
  if (!fs.existsSync(absolutePath)) {
    return undefined;
  }

  const fileBuffer = fs.readFileSync(absolutePath);
  const mimeType = getMimeTypeFromPath(absolutePath);

  return `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
}

function getMimeTypeFromPath(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".ttf") return "font/ttf";
  if (ext === ".otf") return "font/otf";
  if (ext === ".woff") return "font/woff";
  if (ext === ".woff2") return "font/woff2";

  return "application/octet-stream";
}

function mapLocale(language: SupportedLanguage): string {
  if (language === "ar") return "ar";
  if (language === "de") return "de-DE";
  return "en-US";
}

function isCustomerKey(value: string): boolean {
  const haystack = compactWhitespace(value).toLowerCase();

  return hasAny(haystack, [
    "full name",
    "first name",
    "last name",
    "surname",
    "customer",
    "salutation",
    "phone",
    "email",
    "address",
    "street",
    "house number",
    "postal code",
    "city",
    "country",
    "customer data",
    "الاسم",
    "الاسم الأول",
    "اسم العائلة",
    "الصفة",
    "الهاتف",
    "الإيميل",
    "الايميل",
    "البريد الإلكتروني",
    "العنوان",
    "الشارع",
    "رقم المنزل",
    "الرمز البريدي",
    "المدينة",
    "الدولة",
    "بيانات العميل",
  ]);
}

function isInternalKey(value: string): boolean {
  const haystack = compactWhitespace(value).toLowerCase();

  return hasAny(haystack, [
    "source path",
    "service id",
    "request id",
    "appointment id",
    "reference number",
    "raw message",
    "system",
    "internal",
    "items count",
    "cart",
    "api",
    "debug",
  ]);
}

function hasAny(text: string, values: string[]): boolean {
  return values.some((value) => text.includes(value.toLowerCase()));
}

function pushUsefulRow(
  target: DisplayRow[],
  row: DisplayRow,
  language: SupportedLanguage
) {
  const cleanLabel = compactWhitespace(row.label);
  const cleanValue = compactWhitespace(row.value);

  if (!cleanLabel || !cleanValue || isNotAvailableValue(cleanValue)) {
    return;
  }

  target.push({
    label: cleanLabel,
    value: cleanValue,
    forceLtr: Boolean(row.forceLtr),
  });
}

function compactRows(rows: DisplayRow[], language: SupportedLanguage): DisplayRow[] {
  const seen = new Set<string>();
  const result: DisplayRow[] = [];

  for (const row of rows) {
    const label = compactWhitespace(row.label);
    const value = compactWhitespace(row.value);

    if (!label || !value || isNotAvailableValue(value)) {
      continue;
    }

    if (value === translations[language].notAvailable) {
      continue;
    }

    const key = `${label.toLowerCase()}::${value.toLowerCase()}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push({
      label,
      value,
      forceLtr: Boolean(row.forceLtr),
    });
  }

  return result;
}

function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const clean = compactWhitespace(value);
    if (!clean) {
      continue;
    }

    const key = clean.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(clean);
  }

  return result;
}

function stringifyUnknown(value: unknown): string {
  if (typeof value === "string") {
    return compactWhitespace(value);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => stringifyUnknown(item))
      .filter(Boolean)
      .join(", ");
  }

  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, item]) => `${prettifyKey(key)}: ${stringifyUnknown(item)}`)
      .filter((item) => !item.endsWith(": "))
      .join(" | ");
  }

  return "";
}

function prettifyKey(value: string): string {
  return String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

function cleanLine(value: string): string {
  return compactWhitespace(
    value
      .replace(/^[\s\-–—•·*#\u2022]+/, "")
      .replace(/^[0-9]+[.)-]\s*/, "")
      .trim()
  );
}

function shouldForceLtrValue(value: string): boolean {
  return /[@/_.:+#%&=?-]|\d|https?:\/\/|www\./i.test(String(value || ""));
}

function isNotAvailableValue(value: string): boolean {
  const normalized = compactWhitespace(String(value || "")).toLowerCase();

  return (
    normalized === translations.ar.notAvailable.toLowerCase() ||
    normalized === translations.de.notAvailable.toLowerCase() ||
    normalized === translations.en.notAvailable.toLowerCase()
  );
}

function safeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function safeUnknownToString(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return "";
}

function hasValue(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function firstNonEmpty(...values: Array<string | undefined | null>): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function compactWhitespace(value: string): string {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}