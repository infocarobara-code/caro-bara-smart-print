import React from "react";
import fs from "fs";
import path from "path";
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
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
  | "legalFooterTax"
  | "qrSection"
  | "qrReference"
  | "generatedAt";

type DisplayRow = {
  label: string;
  value: string;
  forceLtr?: boolean;
};

type DetailPage = {
  rows: DisplayRow[];
  twoColumn: boolean;
};

type SpreadRow = {
  left?: DisplayRow;
  right?: DisplayRow;
};

type MetaRow = {
  label: string;
  value: string;
  forceLtr?: boolean;
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
    qrSection: "رمز QR المرجعي",
    qrReference: "مرجع المسح",
    generatedAt: "تاريخ التوليد",
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
    qrSection: "QR-Referenzcode",
    qrReference: "Scan-Referenz",
    generatedAt: "Erzeugt am",
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
    qrSection: "QR Reference",
    qrReference: "Scan Reference",
    generatedAt: "Generated At",
  },
};

let pdfFontsRegistered = false;
let pdfFontFamilyRegular = "Helvetica";
let pdfFontFamilyBold = "Helvetica-Bold";

export async function generateOperationPdfBufferWithPuppeteer(
  input: OperationPdfInput
): Promise<Buffer> {
  ensurePdfFontsRegistered();

  const identity = input.identity;
  const language = resolvePdfLanguage(identity?.language);
  const t = createTranslator(language);
  const isAppointment = identity.kind === "appointment";

  const documentTitle = isAppointment
    ? t("appointmentDocument")
    : t("requestDocument");

  const companyRows = buildCompanyRows(input.company);
  const customerRows = buildCustomerRows(identity, language, t);
  const metaRows = buildMetaRows(identity, language, t, isAppointment);
  const detailRows = buildMasterDetailRows(identity, language, t);
  const detailPages = paginateMasterTable(detailRows);
  const totalPages = Math.max(1, detailPages.length);

  const logoSource = resolvePublicAssetSource(input.company.logoSrc);
  const footerGroups = buildFooterGroups(
    input.company,
    language,
    t,
    identity.meta?.generatedAt
  );
  const styles = createPdfStyles(language);

  const pdfBuffer = await renderToBuffer(
    <Document
      title={documentTitle}
      author={input.company.companyName || COMPANY_NAME}
      subject={buildSafeHumanReference(identity)}
      creator="Caro Bara Smart Print"
      producer="Caro Bara Smart Print"
      language={language}
    >
      {detailPages.map((detailPage, pageIndex) => (
        <Page
          key={`page-${pageIndex + 1}`}
          size="A4"
          style={styles.page}
          wrap
        >
          <View style={styles.pageBody}>
            {pageIndex === 0 ? (
              <>
                <View style={styles.topHeader} wrap={false}>
                  <View style={styles.topHeaderText}>
                    <Text style={styles.docTitle}>{documentTitle}</Text>
                    <Text style={styles.docSubtitle}>
                      {t("documentSubtitle")}
                    </Text>
                  </View>

                  <View style={styles.topHeaderBrand}>
                    {logoSource ? (
                      <Image src={logoSource} style={styles.logoImage} />
                    ) : (
                      <Text style={styles.miniBrand}>
                        {input.company.companyName || COMPANY_NAME}
                      </Text>
                    )}
                  </View>
                </View>

                <PdfMetaSection
                  rows={metaRows}
                  styles={styles}
                />

                {input.qrCodeDataUrl ? (
                  <View style={styles.qrCard} wrap={false}>
                    <View style={styles.qrCardImageColumn}>
                      <Image src={input.qrCodeDataUrl} style={styles.qrImage} />
                    </View>

                    <View style={styles.qrCardTextColumn}>
                      <Text style={styles.qrTitle}>{t("qrSection")}</Text>
                      <Text style={styles.qrCaption}>
                        {t("qrReference")}: {buildSafeHumanReference(identity)}
                      </Text>
                    </View>
                  </View>
                ) : null}

                <View style={styles.infoGrid} wrap={false}>
                  <PdfInfoBox
                    title={t("companySection")}
                    rows={companyRows}
                    styles={styles}
                  />
                  <PdfInfoBox
                    title={t("customerSection")}
                    rows={customerRows}
                    styles={styles}
                  />
                </View>
              </>
            ) : null}

            <PdfDetailSection
              title={
                pageIndex === 0
                  ? t("detailsSection")
                  : t("detailsSectionContinued")
              }
              rows={detailPage.rows}
              fieldTitle={t("fieldColumn")}
              valueTitle={t("valueColumn")}
              styles={styles}
            />
          </View>

          <PdfFooter
            styles={styles}
            footerGroups={footerGroups}
            pageNumber={pageIndex + 1}
            totalPages={totalPages}
            pageLabel={t("page")}
            ofLabel={t("of")}
          />
        </Page>
      ))}
    </Document>
  );

  return Buffer.from(pdfBuffer);
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

  const companyRows = buildCompanyRows(input.company);
  const customerRows = buildCustomerRows(identity, language, t);
  const metaRows = buildMetaRows(identity, language, t, isAppointment);
  const detailRows = buildMasterDetailRows(identity, language, t);
  const detailPages = paginateMasterTable(detailRows);
  const totalPages = Math.max(1, detailPages.length);
  const footerGroups = buildFooterGroups(
    input.company,
    language,
    t,
    identity.meta?.generatedAt
  );

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
      color: #1f2937;
      font-family: "CairoPdf", Arial, sans-serif;
      direction: ${dir};
    }
    body {
      font-size: 11px;
      line-height: 1.45;
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 14mm 14mm 17mm;
      display: flex;
      flex-direction: column;
      background: #ffffff;
      page-break-after: always;
    }
    .page:last-child {
      page-break-after: auto;
    }
    .page-body {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .top-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10mm;
      margin-bottom: 6mm;
    }
    .top-header-text {
      flex: 1;
    }
    .doc-title {
      margin: 0 0 1.5mm;
      font-size: 19px;
      line-height: 1.15;
      color: #1f2937;
      font-family: "CairoPdfBold", Arial, sans-serif;
      text-align: ${dir === "rtl" ? "right" : "left"};
    }
    .doc-subtitle {
      margin: 0;
      color: #6b7280;
      font-size: 10px;
      line-height: 1.35;
      text-align: ${dir === "rtl" ? "right" : "left"};
    }
    .top-header-brand {
      width: 38mm;
      min-height: 16mm;
      display: flex;
      justify-content: ${dir === "rtl" ? "flex-start" : "flex-end"};
      align-items: flex-start;
    }
    .top-header-brand img {
      max-width: 34mm;
      max-height: 14mm;
      object-fit: contain;
      display: block;
    }
    .mini-brand {
      font-family: "CairoPdfBold", Arial, sans-serif;
      font-size: 10px;
      text-align: ${dir === "rtl" ? "left" : "right"};
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr 1fr;
      gap: 3mm;
      margin-bottom: 4mm;
    }
    .meta-grid-second {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3mm;
      margin-bottom: 5mm;
    }
    .meta-card {
      border: 0.25mm solid #d1d5db;
      background: #ffffff;
      min-height: 17mm;
      padding: 3mm 3.2mm;
    }
    .meta-label {
      margin: 0 0 1mm;
      font-size: 8.8px;
      color: #6b7280;
      font-family: "CairoPdfBold", Arial, sans-serif;
      text-align: ${dir === "rtl" ? "right" : "left"};
    }
    .meta-value {
      margin: 0;
      font-size: 9.4px;
      line-height: 1.35;
      color: #111827;
      word-break: break-word;
      overflow-wrap: anywhere;
      unicode-bidi: plaintext;
      white-space: pre-wrap;
      text-align: ${dir === "rtl" ? "right" : "left"};
    }
    .ltr {
      direction: ltr;
      text-align: left;
    }
    .qr-card {
      display: grid;
      grid-template-columns: 24mm 1fr;
      gap: 4mm;
      border: 0.25mm solid #d1d5db;
      background: #f9fafb;
      padding: 3.5mm;
      margin-bottom: 5mm;
      align-items: center;
    }
    .qr-image-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .qr-image {
      width: 20mm;
      height: 20mm;
      object-fit: contain;
      border: 0.2mm solid #e5e7eb;
      background: #ffffff;
      padding: 1.2mm;
    }
    .qr-title {
      margin: 0 0 1mm;
      font-size: 11px;
      font-family: "CairoPdfBold", Arial, sans-serif;
      color: #1f2937;
      text-align: ${dir === "rtl" ? "right" : "left"};
    }
    .qr-caption {
      margin: 0;
      font-size: 9.3px;
      line-height: 1.35;
      color: #4b5563;
      word-break: break-word;
      overflow-wrap: anywhere;
      unicode-bidi: plaintext;
      white-space: pre-wrap;
      text-align: ${dir === "rtl" ? "right" : "left"};
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4mm;
      margin-bottom: 5mm;
    }
    .info-box {
      border: 0.25mm solid #d1d5db;
      background: #ffffff;
      padding: 4mm 4mm 3mm;
      min-height: 34mm;
    }
    .info-title {
      margin: 0 0 3mm;
      font-size: 12px;
      color: #1f2937;
      font-family: "CairoPdfBold", Arial, sans-serif;
      text-align: ${dir === "rtl" ? "right" : "left"};
    }
    .info-line {
      display: grid;
      grid-template-columns: 28mm 1fr;
      gap: 3mm;
      align-items: start;
      margin-bottom: 1.8mm;
    }
    .info-label {
      font-size: 9px;
      color: #6b7280;
      font-family: "CairoPdfBold", Arial, sans-serif;
      text-align: ${dir === "rtl" ? "right" : "left"};
    }
    .info-value {
      font-size: 9.8px;
      color: #111827;
      line-height: 1.35;
      word-break: break-word;
      overflow-wrap: anywhere;
      unicode-bidi: plaintext;
      white-space: pre-wrap;
      text-align: ${dir === "rtl" ? "right" : "left"};
    }
    .detail-section {
      margin-bottom: 5mm;
    }
    .section-title {
      margin: 0 0 2mm;
      font-size: 13px;
      color: #1f2937;
      font-family: "CairoPdfBold", Arial, sans-serif;
      text-align: ${dir === "rtl" ? "right" : "left"};
    }
    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      background: #ffffff;
      border: 0.25mm solid #d1d5db;
    }
    thead th {
      padding: 2.3mm 2.6mm;
      background: #f9fafb;
      border-bottom: 0.25mm solid #d1d5db;
      font-size: 8.9px;
      color: #374151;
      font-family: "CairoPdfBold", Arial, sans-serif;
      text-align: ${dir === "rtl" ? "right" : "left"};
    }
    tbody td {
      padding: 2.1mm 2.6mm;
      border-top: 0.2mm solid #e5e7eb;
      vertical-align: top;
      font-size: 9.4px;
      line-height: 1.38;
      color: #111827;
      word-break: break-word;
      overflow-wrap: anywhere;
      unicode-bidi: plaintext;
      white-space: pre-wrap;
      text-align: ${dir === "rtl" ? "right" : "left"};
    }
    tbody tr:first-child td {
      border-top: none;
    }
    .th-label, .td-label {
      width: 16%;
      color: #374151;
      font-family: "CairoPdfBold", Arial, sans-serif;
    }
    .th-value, .td-value {
      width: 34%;
    }
    .footer {
      margin-top: auto;
      padding-top: 3.5mm;
      border-top: 0.25mm solid #d1d5db;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 5mm;
      align-items: start;
    }
    .footer-block {
      min-height: 14mm;
    }
    .footer-block.center {
      text-align: center;
    }
    .footer-block.end {
      text-align: ${dir === "rtl" ? "left" : "right"};
    }
    .footer-line {
      margin: 0 0 0.8mm;
      font-size: 8.5px;
      line-height: 1.28;
      color: #4b5563;
      word-break: break-word;
      overflow-wrap: anywhere;
      unicode-bidi: plaintext;
      white-space: pre-wrap;
    }
    .footer-page {
      margin-top: 1.2mm;
      font-family: "CairoPdfBold", Arial, sans-serif;
      color: #1f2937;
    }
  </style>
</head>
<body>
  ${detailPages
    .map((detailPage, pageIndex) => {
      const spreadRows = buildSpreadRows(detailPage.rows);

      return `
      <section class="page">
        <div class="page-body">
          ${
            pageIndex === 0
              ? `
                <div class="top-header">
                  <div class="top-header-text">
                    <p class="doc-title">${escapeHtml(documentTitle)}</p>
                    <p class="doc-subtitle">${escapeHtml(
                      t("documentSubtitle")
                    )}</p>
                  </div>
                  <div class="top-header-brand">${buildTopLogoHtml(
                    logoDataUrl,
                    input.company.companyName || COMPANY_NAME
                  )}</div>
                </div>

                ${buildMetaSectionHtml(metaRows)}

                ${
                  input.qrCodeDataUrl
                    ? `
                      <div class="qr-card">
                        <div class="qr-image-wrap">
                          <img class="qr-image" src="${escapeHtml(
                            input.qrCodeDataUrl
                          )}" alt="QR Code" />
                        </div>
                        <div>
                          <p class="qr-title">${escapeHtml(t("qrSection"))}</p>
                          <p class="qr-caption">${escapeHtml(
                            t("qrReference")
                          )}: ${escapeHtml(buildSafeHumanReference(identity))}</p>
                        </div>
                      </div>
                    `
                    : ""
                }

                <div class="info-grid">
                  ${buildInfoBoxHtml(t("companySection"), companyRows)}
                  ${buildInfoBoxHtml(t("customerSection"), customerRows)}
                </div>
              `
              : ""
          }

          <div class="detail-section">
            <p class="section-title">${escapeHtml(
              pageIndex === 0
                ? t("detailsSection")
                : t("detailsSectionContinued")
            )}</p>

            ${buildDetailSpreadTableHtml(
              spreadRows,
              t("fieldColumn"),
              t("valueColumn")
            )}
          </div>

          <div class="footer">
            <div class="footer-block">
              ${footerGroups.left
                .map((line) => `<div class="footer-line">${escapeHtml(line)}</div>`)
                .join("")}
            </div>

            <div class="footer-block center">
              ${footerGroups.center
                .map((line) => `<div class="footer-line">${escapeHtml(line)}</div>`)
                .join("")}
            </div>

            <div class="footer-block end">
              ${footerGroups.right
                .map((line) => `<div class="footer-line">${escapeHtml(line)}</div>`)
                .join("")}
              <div class="footer-line footer-page">${escapeHtml(t("page"))} ${
                pageIndex + 1
              } ${escapeHtml(t("of"))} ${totalPages}</div>
            </div>
          </div>
        </div>
      </section>
    `;
    })
    .join("")}
</body>
</html>`;
}

function PdfMetaSection(params: {
  rows: MetaRow[];
  styles: ReturnType<typeof createPdfStyles>;
}) {
  const { rows, styles } = params;

  const firstRow = rows.slice(0, 3);
  const secondRow = rows.slice(3, 5);

  return (
    <View style={styles.metaSection} wrap={false}>
      <View style={styles.metaFirstRow}>
        {firstRow.map((row, index) => (
          <View
            key={`meta-top-${index}`}
            style={[
              styles.metaCard,
              index === 0 ? styles.metaCardWide : styles.metaCardNormal,
            ]}
          >
            <Text style={styles.metaLabel}>{row.label}</Text>
            <Text
              style={[
                styles.metaValue,
                ...(row.forceLtr ? [styles.ltrValue] : []),
              ]}
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.metaSecondRow}>
        {secondRow.map((row, index) => (
          <View key={`meta-bottom-${index}`} style={styles.metaCard}>
            <Text style={styles.metaLabel}>{row.label}</Text>
            <Text
              style={[
                styles.metaValue,
                ...(row.forceLtr ? [styles.ltrValue] : []),
              ]}
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function PdfInfoBox(params: {
  title: string;
  rows: DisplayRow[];
  styles: ReturnType<typeof createPdfStyles>;
}) {
  const { title, rows, styles } = params;

  return (
    <View style={styles.infoBox}>
      <Text style={styles.infoTitle}>{title}</Text>

      {rows.map((row, index) => (
        <View key={`info-row-${index}`} style={styles.infoLine}>
          <Text style={styles.infoLabel}>{row.label}</Text>
          <Text
            style={[
              styles.infoValue,
              ...(row.forceLtr ? [styles.ltrValue] : []),
            ]}
          >
            {row.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

function PdfDetailSection(params: {
  title: string;
  rows: DisplayRow[];
  fieldTitle: string;
  valueTitle: string;
  styles: ReturnType<typeof createPdfStyles>;
}) {
  const { title, rows, fieldTitle, valueTitle, styles } = params;
  const spreadRows = buildSpreadRows(rows);

  if (!spreadRows.length) {
    return null;
  }

  return (
    <View style={styles.detailSection}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.detailTable}>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableHeaderCell, styles.thLabel]}>
            {fieldTitle}
          </Text>
          <Text style={[styles.tableHeaderCell, styles.thValue]}>
            {valueTitle}
          </Text>
          <Text style={[styles.tableHeaderCell, styles.thLabel]}>
            {fieldTitle}
          </Text>
          <Text style={[styles.tableHeaderCell, styles.thValue]}>
            {valueTitle}
          </Text>
        </View>

        {spreadRows.map((spreadRow, index) => (
          <View
            key={`spread-row-${index}`}
            style={[
              styles.tableBodyRow,
              ...(index === 0 ? [styles.tableBodyRowFirst] : []),
            ]}
          >
            <Text style={[styles.tableBodyCellLabel, styles.tdLabel]}>
              {spreadRow.left?.label || ""}
            </Text>
            <Text
              style={[
                styles.tableBodyCellValue,
                styles.tdValue,
                ...(spreadRow.left?.forceLtr ? [styles.ltrValue] : []),
              ]}
            >
              {spreadRow.left?.value || ""}
            </Text>
            <Text style={[styles.tableBodyCellLabel, styles.tdLabel]}>
              {spreadRow.right?.label || ""}
            </Text>
            <Text
              style={[
                styles.tableBodyCellValue,
                styles.tdValue,
                ...(spreadRow.right?.forceLtr ? [styles.ltrValue] : []),
              ]}
            >
              {spreadRow.right?.value || ""}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function PdfFooter(params: {
  styles: ReturnType<typeof createPdfStyles>;
  footerGroups: {
    left: string[];
    center: string[];
    right: string[];
  };
  pageNumber: number;
  totalPages: number;
  pageLabel: string;
  ofLabel: string;
}) {
  const { styles, footerGroups, pageNumber, totalPages, pageLabel, ofLabel } =
    params;

  return (
    <View style={styles.pageFooter} fixed>
      <View style={styles.footerColumn}>
        {footerGroups.left.map((line, index) => (
          <Text key={`footer-left-${index}`} style={styles.footerLine}>
            {line}
          </Text>
        ))}
      </View>

      <View style={styles.footerColumnCenter}>
        {footerGroups.center.map((line, index) => (
          <Text key={`footer-center-${index}`} style={styles.footerLineCenter}>
            {line}
          </Text>
        ))}
      </View>

      <View style={styles.footerColumnEnd}>
        {footerGroups.right.map((line, index) => (
          <Text key={`footer-right-${index}`} style={styles.footerLineEnd}>
            {line}
          </Text>
        ))}
        <Text style={styles.footerPage}>
          {pageLabel} {pageNumber} {ofLabel} {totalPages}
        </Text>
      </View>
    </View>
  );
}

function createPdfStyles(language: SupportedLanguage) {
  const isRtl = language === "ar";

  return StyleSheet.create({
    page: {
      backgroundColor: "#ffffff",
      paddingTop: 40,
      paddingRight: 40,
      paddingBottom: 58,
      paddingLeft: 40,
      fontFamily: pdfFontFamilyRegular,
      fontSize: 10,
      color: "#1f2937",
    },
    pageBody: {
      flexGrow: 1,
    },

    topHeader: {
      flexDirection: isRtl ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 18,
    },
    topHeaderText: {
      flexGrow: 1,
      paddingRight: isRtl ? 0 : 18,
      paddingLeft: isRtl ? 18 : 0,
    },
    topHeaderBrand: {
      width: 112,
      minHeight: 40,
      justifyContent: "flex-start",
      alignItems: isRtl ? "flex-start" : "flex-end",
    },
    docTitle: {
      fontFamily: pdfFontFamilyBold,
      fontSize: 19,
      lineHeight: 1.15,
      color: "#1f2937",
      marginBottom: 6,
      textAlign: isRtl ? "right" : "left",
    },
    docSubtitle: {
      fontSize: 10,
      lineHeight: 1.35,
      color: "#6b7280",
      textAlign: isRtl ? "right" : "left",
    },
    logoImage: {
      maxWidth: 100,
      maxHeight: 40,
      objectFit: "contain",
    },
    miniBrand: {
      fontFamily: pdfFontFamilyBold,
      fontSize: 10,
      textAlign: isRtl ? "left" : "right",
    },

    metaSection: {
      marginBottom: 14,
    },
    metaFirstRow: {
      flexDirection: isRtl ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    metaSecondRow: {
      flexDirection: isRtl ? "row-reverse" : "row",
      justifyContent: "space-between",
    },
    metaCard: {
      borderWidth: 0.8,
      borderColor: "#d1d5db",
      backgroundColor: "#ffffff",
      paddingTop: 8,
      paddingRight: 9,
      paddingBottom: 8,
      paddingLeft: 9,
      minHeight: 48,
    },
    metaCardWide: {
      width: "40%",
    },
    metaCardNormal: {
      width: "28%",
    },
    metaLabel: {
      fontSize: 8.5,
      lineHeight: 1.2,
      marginBottom: 4,
      color: "#6b7280",
      fontFamily: pdfFontFamilyBold,
      textAlign: isRtl ? "right" : "left",
    },
    metaValue: {
      fontSize: 9.3,
      lineHeight: 1.35,
      color: "#111827",
      textAlign: isRtl ? "right" : "left",
    },

    qrCard: {
      borderWidth: 0.8,
      borderColor: "#d1d5db",
      backgroundColor: "#f9fafb",
      paddingTop: 10,
      paddingRight: 10,
      paddingBottom: 10,
      paddingLeft: 10,
      marginBottom: 14,
      flexDirection: isRtl ? "row-reverse" : "row",
      alignItems: "center",
    },
    qrCardImageColumn: {
      width: 84,
      alignItems: "center",
      justifyContent: "center",
    },
    qrCardTextColumn: {
      flexGrow: 1,
      flexShrink: 1,
      paddingRight: isRtl ? 0 : 10,
      paddingLeft: isRtl ? 10 : 0,
    },
    qrImage: {
      width: 68,
      height: 68,
      objectFit: "contain",
      borderWidth: 0.8,
      borderColor: "#e5e7eb",
      backgroundColor: "#ffffff",
      padding: 4,
    },
    qrTitle: {
      fontFamily: pdfFontFamilyBold,
      fontSize: 11,
      marginBottom: 4,
      textAlign: isRtl ? "right" : "left",
      color: "#1f2937",
    },
    qrCaption: {
      fontSize: 9.3,
      lineHeight: 1.35,
      color: "#4b5563",
      textAlign: isRtl ? "right" : "left",
    },

    infoGrid: {
      flexDirection: isRtl ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginBottom: 14,
    },
    infoBox: {
      width: "48.8%",
      borderWidth: 0.8,
      borderColor: "#d1d5db",
      backgroundColor: "#ffffff",
      paddingTop: 12,
      paddingRight: 12,
      paddingBottom: 9,
      paddingLeft: 12,
      minHeight: 100,
    },
    infoTitle: {
      fontFamily: pdfFontFamilyBold,
      fontSize: 12,
      color: "#1f2937",
      marginBottom: 10,
      textAlign: isRtl ? "right" : "left",
    },
    infoLine: {
      flexDirection: isRtl ? "row-reverse" : "row",
      alignItems: "flex-start",
      marginBottom: 5,
    },
    infoLabel: {
      width: 82,
      fontFamily: pdfFontFamilyBold,
      fontSize: 9,
      color: "#6b7280",
      textAlign: isRtl ? "right" : "left",
    },
    infoValue: {
      flexGrow: 1,
      flexShrink: 1,
      fontSize: 9.8,
      lineHeight: 1.35,
      color: "#111827",
      textAlign: isRtl ? "right" : "left",
    },

    detailSection: {
      marginBottom: 10,
    },
    sectionTitle: {
      fontFamily: pdfFontFamilyBold,
      fontSize: 12.8,
      color: "#1f2937",
      marginBottom: 8,
      textAlign: isRtl ? "right" : "left",
    },
    detailTable: {
      borderWidth: 0.8,
      borderColor: "#d1d5db",
      backgroundColor: "#ffffff",
    },
    tableHeaderRow: {
      flexDirection: isRtl ? "row-reverse" : "row",
      backgroundColor: "#f9fafb",
      borderBottomWidth: 0.8,
      borderColor: "#d1d5db",
    },
    tableHeaderCell: {
      paddingTop: 7,
      paddingRight: 8,
      paddingBottom: 7,
      paddingLeft: 8,
      fontSize: 8.8,
      lineHeight: 1.2,
      color: "#374151",
      fontFamily: pdfFontFamilyBold,
      textAlign: isRtl ? "right" : "left",
    },
    tableBodyRow: {
      flexDirection: isRtl ? "row-reverse" : "row",
      borderTopWidth: 0.6,
      borderColor: "#e5e7eb",
    },
    tableBodyRowFirst: {
      borderTopWidth: 0,
    },
    tableBodyCellLabel: {
      paddingTop: 7,
      paddingRight: 8,
      paddingBottom: 7,
      paddingLeft: 8,
      fontSize: 9,
      lineHeight: 1.35,
      color: "#4b5563",
      fontFamily: pdfFontFamilyBold,
      textAlign: isRtl ? "right" : "left",
    },
    tableBodyCellValue: {
      paddingTop: 7,
      paddingRight: 8,
      paddingBottom: 7,
      paddingLeft: 8,
      fontSize: 9.4,
      lineHeight: 1.38,
      color: "#111827",
      textAlign: isRtl ? "right" : "left",
    },
    thLabel: {
      width: "16%",
    },
    thValue: {
      width: "34%",
    },
    tdLabel: {
      width: "16%",
    },
    tdValue: {
      width: "34%",
    },

    ltrValue: {
      direction: "ltr",
      textAlign: "left",
    },

    pageFooter: {
      position: "absolute",
      left: 40,
      right: 40,
      bottom: 18,
      paddingTop: 10,
      borderTopWidth: 0.8,
      borderColor: "#d1d5db",
      flexDirection: isRtl ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    footerColumn: {
      width: "33.33%",
      paddingRight: isRtl ? 0 : 8,
      paddingLeft: isRtl ? 8 : 0,
    },
    footerColumnCenter: {
      width: "33.33%",
      paddingRight: 8,
      paddingLeft: 8,
      alignItems: "center",
    },
    footerColumnEnd: {
      width: "33.33%",
      paddingRight: isRtl ? 8 : 0,
      paddingLeft: isRtl ? 0 : 8,
      alignItems: isRtl ? "flex-start" : "flex-end",
    },
    footerLine: {
      fontSize: 8.5,
      lineHeight: 1.25,
      color: "#4b5563",
      marginBottom: 2,
      textAlign: isRtl ? "right" : "left",
    },
    footerLineCenter: {
      fontSize: 8.5,
      lineHeight: 1.25,
      color: "#4b5563",
      marginBottom: 2,
      textAlign: "center",
    },
    footerLineEnd: {
      fontSize: 8.5,
      lineHeight: 1.25,
      color: "#4b5563",
      marginBottom: 2,
      textAlign: isRtl ? "left" : "right",
    },
    footerPage: {
      fontSize: 8.7,
      lineHeight: 1.25,
      color: "#1f2937",
      fontFamily: pdfFontFamilyBold,
      marginTop: 4,
      textAlign: isRtl ? "left" : "right",
    },
  });
}

function ensurePdfFontsRegistered() {
  if (pdfFontsRegistered) {
    return;
  }

  const regularPath = resolveFontPath("Cairo-Regular.ttf");
  const boldPath = resolveFontPath("Cairo-Bold.ttf");

  if (regularPath && boldPath) {
    Font.register({
      family: "CairoPdf",
      fonts: [
        {
          src: regularPath,
          fontWeight: 400,
        },
        {
          src: boldPath,
          fontWeight: 700,
        },
      ],
    });

    pdfFontFamilyRegular = "CairoPdf";
    pdfFontFamilyBold = "CairoPdf";
    pdfFontsRegistered = true;
    return;
  }

  if (regularPath) {
    Font.register({
      family: "CairoPdf",
      src: regularPath,
      fontWeight: 400,
    });

    pdfFontFamilyRegular = "CairoPdf";
    pdfFontFamilyBold = "CairoPdf";
  }

  pdfFontsRegistered = true;
}

function buildMetaSectionHtml(rows: MetaRow[]): string {
  const firstRow = rows.slice(0, 3);
  const secondRow = rows.slice(3, 5);

  return `
    <div class="meta-grid">
      ${firstRow
        .map((row, index) => {
          const className = index === 0 ? "meta-card meta-card-wide" : "meta-card";
          return `
            <div class="${className}">
              <p class="meta-label">${escapeHtml(row.label)}</p>
              <p class="meta-value${row.forceLtr ? " ltr" : ""}">${escapeHtml(
                row.value
              )}</p>
            </div>
          `;
        })
        .join("")}
    </div>
    <div class="meta-grid-second">
      ${secondRow
        .map(
          (row) => `
            <div class="meta-card">
              <p class="meta-label">${escapeHtml(row.label)}</p>
              <p class="meta-value${row.forceLtr ? " ltr" : ""}">${escapeHtml(
                row.value
              )}</p>
            </div>
          `
        )
        .join("")}
    </div>
  `.replace(
    "meta-card-wide",
    `meta-card-wide" style="width:auto;`
  );
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

function buildDetailSpreadTableHtml(
  spreadRows: SpreadRow[],
  fieldTitle: string,
  valueTitle: string
): string {
  return `
    <table>
      <thead>
        <tr>
          <th class="th-label">${escapeHtml(fieldTitle)}</th>
          <th class="th-value">${escapeHtml(valueTitle)}</th>
          <th class="th-label">${escapeHtml(fieldTitle)}</th>
          <th class="th-value">${escapeHtml(valueTitle)}</th>
        </tr>
      </thead>
      <tbody>
        ${spreadRows
          .map(
            (row) => `
              <tr>
                <td class="td-label">${escapeHtml(row.left?.label || "")}</td>
                <td class="td-value${row.left?.forceLtr ? " ltr" : ""}">${escapeHtml(
                  row.left?.value || ""
                )}</td>
                <td class="td-label">${escapeHtml(row.right?.label || "")}</td>
                <td class="td-value${row.right?.forceLtr ? " ltr" : ""}">${escapeHtml(
                  row.right?.value || ""
                )}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function buildTopLogoHtml(
  logoDataUrl?: string,
  companyName = COMPANY_NAME
): string {
  if (hasValue(logoDataUrl)) {
    return `<img src="${escapeHtml(logoDataUrl)}" alt="Logo" />`;
  }

  return `<div class="mini-brand">${escapeHtml(companyName)}</div>`;
}

function buildCompanyRows(company?: CompanyPdfProfile): DisplayRow[] {
  const companyName = firstNonEmpty(
    safeString(company?.companyName),
    COMPANY_NAME
  );
  const addressLine1 = firstNonEmpty(
    safeString(company?.addressLine1),
    COMPANY_ADDRESS_LINE_1
  );
  const addressLine2 = buildCompanyAddressLine2(company);
  const taxLine = buildCompanyTaxLine(company);

  return compactRows(
    [
      { label: "Name", value: companyName },
      { label: "Address", value: addressLine1 },
      { label: "City", value: addressLine2 },
      { label: "Tax", value: taxLine, forceLtr: true },
    ],
    "en"
  );
}

function buildCompanyAddressLine2(company?: CompanyPdfProfile): string {
  const explicit = safeString(company?.addressLine2);
  if (explicit) {
    return explicit;
  }

  const parts = [
    safeString(company?.postalCode),
    safeString(company?.city),
    safeString(company?.country),
  ].filter(Boolean);

  if (parts.length) {
    return parts.join(", ");
  }

  return COMPANY_ADDRESS_LINE_2;
}

function buildCompanyTaxLine(company?: CompanyPdfProfile): string {
  const taxLike = firstNonEmpty(
    safeString(company?.taxNumber),
    safeString(company?.vatId),
    safeString(company?.registrationNumber),
    COMPANY_TAX_NUMBER
  );

  return `Steuer-Nr. ${taxLike}`;
}

function buildFooterGroups(
  company: CompanyPdfProfile,
  language: SupportedLanguage,
  t: (key: TranslationKey) => string,
  generatedAt?: string
): {
  left: string[];
  center: string[];
  right: string[];
} {
  const left = uniqueStrings(
    [
      firstNonEmpty(safeString(company.companyName), COMPANY_NAME),
      firstNonEmpty(safeString(company.addressLine1), COMPANY_ADDRESS_LINE_1),
      firstNonEmpty(buildCompanyAddressLine2(company), COMPANY_ADDRESS_LINE_2),
      `${t("legalFooterTax")} ${buildCompanyTaxLine(company).replace(
        /^Steuer-Nr\.\s*/i,
        ""
      )}`,
    ].filter(Boolean)
  );

  const center = uniqueStrings(
    [
      safeString(company.phone),
      safeString(company.email),
      safeString(company.website),
    ].filter(Boolean)
  );

  const formattedGeneratedAt = formatDateTime(
    hasValue(generatedAt) ? generatedAt : new Date().toISOString(),
    language
  );

  const right = uniqueStrings(
    [
      `${t("generatedAt")} ${formattedGeneratedAt}`,
    ].filter(Boolean)
  );

  return { left, center, right };
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
): MetaRow[] {
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
  const subjectValue = normalizeDisplayValue(
    identity.operation.subject,
    language
  );
  const serviceTypeValue = normalizeDisplayValue(
    identity.operation.serviceType,
    language
  );

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
        buildTimeWindow(
          identity.schedule.startTime,
          identity.schedule.endTime,
          language
        )
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

  const pages: DetailPage[] = [];
  const firstPageWeightLimit = 12;
  const nextPageWeightLimit = 18;

  let currentRows: DisplayRow[] = [];
  let currentWeight = 0;
  let currentLimit = firstPageWeightLimit;

  for (const row of rows) {
    const rowWeight = estimateRowWeight(row);

    if (currentRows.length > 0 && currentWeight + rowWeight > currentLimit) {
      pages.push({
        rows: currentRows,
        twoColumn: true,
      });
      currentRows = [];
      currentWeight = 0;
      currentLimit = nextPageWeightLimit;
    }

    currentRows.push(row);
    currentWeight += rowWeight;
  }

  if (currentRows.length) {
    pages.push({
      rows: currentRows,
      twoColumn: true,
    });
  }

  return pages;
}

function estimateRowWeight(row: DisplayRow): number {
  const labelLength = compactWhitespace(row.label).length;
  const valueLength = compactWhitespace(row.value).length;
  const lineBreaks = (row.value.match(/\n/g) || []).length;

  const estimatedLines =
    Math.ceil(labelLength / 28) +
    Math.ceil(valueLength / 82) +
    lineBreaks;

  return Math.max(1, estimatedLines);
}

function buildSpreadRows(rows: DisplayRow[]): SpreadRow[] {
  const result: SpreadRow[] = [];

  for (let index = 0; index < rows.length; index += 2) {
    result.push({
      left: rows[index],
      right: rows[index + 1],
    });
  }

  return result;
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

  return String(value)
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
  return hasValue(value)
    ? compactWhitespace(value)
    : translations[language].notAvailable;
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

function resolvePublicAssetSource(src?: string): string | undefined {
  const safeSrc = safeString(src);

  if (!safeSrc) {
    return undefined;
  }

  if (safeSrc.startsWith("data:") || /^https?:\/\//i.test(safeSrc)) {
    return safeSrc;
  }

  const normalizedPath = safeSrc.startsWith("/") ? safeSrc.slice(1) : safeSrc;
  const absolutePath = path.join(process.cwd(), "public", normalizedPath);

  if (fs.existsSync(absolutePath)) {
    return absolutePath;
  }

  return undefined;
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

function resolveFontPath(fileName: string): string | undefined {
  const absolutePath = path.join(process.cwd(), "public", "fonts", fileName);
  return fs.existsSync(absolutePath) ? absolutePath : undefined;
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

function compactRows(
  rows: DisplayRow[] | MetaRow[],
  language: SupportedLanguage
): DisplayRow[] {
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