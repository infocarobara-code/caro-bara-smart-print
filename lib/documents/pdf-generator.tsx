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

  const companyRows = buildCompanyRows(input.company);
  const customerRows = buildCustomerRows(identity, language, t);
  const metaRows = buildMetaRows(identity, language, t, isAppointment);
  const allDetailRows = buildMasterDetailRows(identity, language, t);
  const detailPages = paginateMasterTable(allDetailRows);
  const totalPages = Math.max(1, detailPages.length);

  const documentTitle = isAppointment
    ? t("appointmentDocument")
    : t("requestDocument");

  const logoSource = resolvePublicAssetSource(input.company.logoSrc);
  const companyFooter = buildCompanyFooter(input.company, language, t);
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
      {detailPages.map((detailPage, index) => (
        <Page
          key={`pdf-page-${index + 1}`}
          size="A4"
          style={styles.page}
          wrap
        >
          <View style={styles.pageBody}>
            {index === 0 ? (
              <>
                <View style={styles.docTopline} wrap={false}>
                  <View style={styles.docTitleWrap}>
                    <Text style={styles.docTitle}>{documentTitle}</Text>
                    <Text style={styles.docSubtitle}>
                      {t("documentSubtitle")}
                    </Text>
                  </View>

                  <View style={styles.logoBox}>
                    {logoSource ? (
                      <Image src={logoSource} style={styles.logoImage} />
                    ) : (
                      <Text style={styles.miniBrand}>
                        {input.company.companyName || COMPANY_NAME}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.infoGrid} wrap={false}>
                  <PdfInfoBox
                    title={t("companySection")}
                    rows={companyRows}
                    language={language}
                    styles={styles}
                  />
                  <PdfInfoBox
                    title={t("customerSection")}
                    rows={customerRows}
                    language={language}
                    styles={styles}
                  />
                </View>

                <View style={styles.metaGrid} wrap={false}>
                  {metaRows.map((row, rowIndex) => (
                    <View key={`meta-${rowIndex}`} style={styles.metaBox}>
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

                {input.qrCodeDataUrl ? (
                  <View style={styles.qrCard} wrap={false}>
                    <View style={styles.qrTextWrap}>
                      <Text style={styles.qrTitle}>{t("qrSection")}</Text>
                      <Text style={styles.qrCaption}>
                        {t("qrReference")}: {buildSafeHumanReference(identity)}
                      </Text>
                    </View>

                    <View style={styles.qrImageWrap}>
                      <Image
                        src={input.qrCodeDataUrl}
                        style={styles.qrImage}
                      />
                    </View>
                  </View>
                ) : null}
              </>
            ) : null}

            <PdfDetailSection
              title={
                index === 0 ? t("detailsSection") : t("detailsSectionContinued")
              }
              rows={detailPage.rows}
              twoColumn={detailPage.twoColumn}
              fieldTitle={t("fieldColumn")}
              valueTitle={t("valueColumn")}
              language={language}
              styles={styles}
            />
          </View>

          <View style={styles.pageFooter} fixed>
            <View style={styles.footerCompany}>
              {companyFooter.map((line, lineIndex) => (
                <Text key={`footer-line-${lineIndex}`} style={styles.footerLine}>
                  {line}
                </Text>
              ))}
            </View>

            <Text style={styles.footerPage}>
              {t("page")} {index + 1} {t("of")} {totalPages}
            </Text>
          </View>
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
  const allDetailRows = buildMasterDetailRows(identity, language, t);
  const detailPages = paginateMasterTable(allDetailRows);
  const totalPages = Math.max(1, detailPages.length);
  const footerRows = buildCompanyFooter(input.company, language, t);

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
      padding: 14mm 14mm 16mm;
      display: flex;
      flex-direction: column;
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
    .qr-card {
      border: 0.25mm solid #9ca3af;
      padding: 4mm;
      display: grid;
      grid-template-columns: 1fr 28mm;
      gap: 5mm;
      align-items: center;
      background: #f8fafc;
    }
    .qr-title {
      margin: 0 0 1.5mm;
      font-size: 11px;
      font-family: "CairoPdfBold", Arial, sans-serif;
    }
    .qr-caption {
      margin: 0;
      font-size: 9.5px;
      color: #4b5563;
      unicode-bidi: plaintext;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .qr-image-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .qr-image {
      width: 24mm;
      height: 24mm;
      object-fit: contain;
      border: 0.2mm solid #d1d5db;
      background: #ffffff;
      padding: 1.5mm;
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
          ${
            index === 0
              ? `
              <div class="doc-topline page-break-avoid">
                <div>
                  <p class="doc-title">${escapeHtml(documentTitle)}</p>
                  <p class="doc-subtitle">${escapeHtml(t("documentSubtitle"))}</p>
                </div>
                <div class="logo-box">${buildTopLogoHtml(
                  logoDataUrl,
                  input.company.companyName || COMPANY_NAME
                )}</div>
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

              ${
                input.qrCodeDataUrl
                  ? `
                    <div class="qr-card page-break-avoid">
                      <div>
                        <p class="qr-title">${escapeHtml(t("qrSection"))}</p>
                        <p class="qr-caption">${escapeHtml(t("qrReference"))}: ${escapeHtml(
                          buildSafeHumanReference(identity)
                        )}</p>
                      </div>
                      <div class="qr-image-wrap">
                        <img class="qr-image" src="${escapeHtml(input.qrCodeDataUrl)}" alt="QR Code" />
                      </div>
                    </div>
                  `
                  : ""
              }
            `
              : ""
          }

          ${buildMasterTableSectionHtml({
            title:
              index === 0 ? t("detailsSection") : t("detailsSectionContinued"),
            rows: page.rows,
            twoColumn: page.twoColumn,
            fieldTitle: t("fieldColumn"),
            valueTitle: t("valueColumn"),
          })}

          <div class="page-footer">
            <div class="footer-company">
              ${footerRows.map((row) => `<div>${escapeHtml(row)}</div>`).join("")}
            </div>
            <div class="footer-page">${escapeHtml(t("page"))} ${index + 1} ${escapeHtml(
        t("of")
      )} ${totalPages}</div>
          </div>
        </div>
      </section>
    `
    )
    .join("")}
</body>
</html>`;
}

function PdfInfoBox(params: {
  title: string;
  rows: DisplayRow[];
  language: SupportedLanguage;
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
  twoColumn: boolean;
  fieldTitle: string;
  valueTitle: string;
  language: SupportedLanguage;
  styles: ReturnType<typeof createPdfStyles>;
}) {
  const { title, rows, twoColumn, fieldTitle, valueTitle, styles } = params;

  if (!rows.length) {
    return null;
  }

  if (!twoColumn) {
    return (
      <View style={styles.detailSection} wrap={false}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.masterTable}>
          <PdfRowsTable
            rows={rows}
            fieldTitle={fieldTitle}
            valueTitle={valueTitle}
            styles={styles}
          />
        </View>
      </View>
    );
  }

  const midpoint = Math.ceil(rows.length / 2);
  const leftRows = rows.slice(0, midpoint);
  const rightRows = rows.slice(midpoint);

  return (
    <View style={styles.detailSection} wrap={false}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.masterTableTwoColumn}>
        <View style={styles.masterTableHalf}>
          <PdfRowsTable
            rows={leftRows}
            fieldTitle={fieldTitle}
            valueTitle={valueTitle}
            styles={styles}
          />
        </View>

        <View style={[styles.masterTableHalf, styles.masterTableHalfBorder]}>
          <PdfRowsTable
            rows={rightRows}
            fieldTitle={fieldTitle}
            valueTitle={valueTitle}
            styles={styles}
          />
        </View>
      </View>
    </View>
  );
}

function PdfRowsTable(params: {
  rows: DisplayRow[];
  fieldTitle: string;
  valueTitle: string;
  styles: ReturnType<typeof createPdfStyles>;
}) {
  const { rows, fieldTitle, valueTitle, styles } = params;

  return (
    <View>
      <View style={styles.tableHeaderRow}>
        <Text style={[styles.tableHeaderCell, styles.colLabelHeader]}>
          {fieldTitle}
        </Text>
        <Text style={[styles.tableHeaderCell, styles.colValueHeader]}>
          {valueTitle}
        </Text>
      </View>

      {rows.map((row, index) => (
        <View
          key={`detail-row-${index}`}
          style={[
            styles.tableBodyRow,
            ...(index === 0 ? [styles.tableBodyRowFirst] : []),
          ]}
        >
          <Text style={[styles.tableBodyCellLabel, styles.colLabelBody]}>
            {row.label}
          </Text>
          <Text
            style={[
              styles.tableBodyCellValue,
              styles.colValueBody,
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

function createPdfStyles(language: SupportedLanguage) {
  const isRtl = language === "ar";

  return StyleSheet.create({
    page: {
      backgroundColor: "#ffffff",
      paddingTop: 40,
      paddingRight: 40,
      paddingBottom: 52,
      paddingLeft: 40,
      fontFamily: pdfFontFamilyRegular,
      fontSize: 10,
      color: "#111827",
    },
    pageBody: {
      flexGrow: 1,
    },
    docTopline: {
      flexDirection: isRtl ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 20,
      minHeight: 52,
    },
    docTitleWrap: {
      flexGrow: 1,
      paddingRight: isRtl ? 0 : 18,
      paddingLeft: isRtl ? 18 : 0,
    },
    docTitle: {
      fontFamily: pdfFontFamilyBold,
      fontSize: 19,
      lineHeight: 1.2,
      marginBottom: 6,
      textAlign: isRtl ? "right" : "left",
    },
    docSubtitle: {
      fontSize: 10,
      lineHeight: 1.35,
      color: "#6b7280",
      textAlign: isRtl ? "right" : "left",
    },
    logoBox: {
      width: 88,
      minHeight: 48,
      justifyContent: "flex-start",
      alignItems: isRtl ? "flex-start" : "flex-end",
    },
    logoImage: {
      maxWidth: 72,
      maxHeight: 46,
      objectFit: "contain",
    },
    miniBrand: {
      fontFamily: pdfFontFamilyBold,
      fontSize: 10,
      textAlign: isRtl ? "left" : "right",
    },
    infoGrid: {
      flexDirection: isRtl ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginBottom: 18,
      gap: 16,
    },
    infoBox: {
      width: "48.5%",
      borderWidth: 1,
      borderColor: "#111827",
      paddingTop: 14,
      paddingRight: 14,
      paddingBottom: 12,
      paddingLeft: 14,
      minHeight: 120,
    },
    infoTitle: {
      fontFamily: pdfFontFamilyBold,
      fontSize: 12,
      marginBottom: 10,
      textAlign: isRtl ? "right" : "left",
    },
    infoLine: {
      flexDirection: isRtl ? "row-reverse" : "row",
      alignItems: "flex-start",
      marginBottom: 6,
    },
    infoLabel: {
      width: 95,
      fontFamily: pdfFontFamilyBold,
      fontSize: 9.6,
      color: "#374151",
      textAlign: isRtl ? "right" : "left",
    },
    infoValue: {
      flexGrow: 1,
      flexShrink: 1,
      fontSize: 10.2,
      color: "#111827",
      lineHeight: 1.38,
      textAlign: isRtl ? "right" : "left",
    },
    metaGrid: {
      flexDirection: isRtl ? "row-reverse" : "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: 18,
    },
    metaBox: {
      width: "19%",
      borderWidth: 0.8,
      borderColor: "#9ca3af",
      paddingTop: 8,
      paddingRight: 8,
      paddingBottom: 8,
      paddingLeft: 8,
      minHeight: 46,
      marginBottom: 8,
    },
    metaLabel: {
      marginBottom: 4,
      fontSize: 8.4,
      color: "#6b7280",
      fontFamily: pdfFontFamilyBold,
      textAlign: isRtl ? "right" : "left",
    },
    metaValue: {
      fontSize: 9.4,
      lineHeight: 1.32,
      textAlign: isRtl ? "right" : "left",
    },
    qrCard: {
      borderWidth: 0.8,
      borderColor: "#9ca3af",
      backgroundColor: "#f8fafc",
      paddingTop: 10,
      paddingRight: 10,
      paddingBottom: 10,
      paddingLeft: 10,
      marginBottom: 18,
      flexDirection: isRtl ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    qrTextWrap: {
      flexGrow: 1,
      flexShrink: 1,
      paddingRight: isRtl ? 0 : 10,
      paddingLeft: isRtl ? 10 : 0,
    },
    qrTitle: {
      fontFamily: pdfFontFamilyBold,
      fontSize: 10.6,
      marginBottom: 4,
      textAlign: isRtl ? "right" : "left",
    },
    qrCaption: {
      fontSize: 9.2,
      color: "#4b5563",
      lineHeight: 1.35,
      textAlign: isRtl ? "right" : "left",
    },
    qrImageWrap: {
      width: 72,
      alignItems: "center",
      justifyContent: "center",
    },
    qrImage: {
      width: 64,
      height: 64,
      objectFit: "contain",
      borderWidth: 0.8,
      borderColor: "#d1d5db",
      backgroundColor: "#ffffff",
      padding: 4,
    },
    detailSection: {
      marginBottom: 14,
    },
    sectionTitle: {
      marginBottom: 8,
      fontFamily: pdfFontFamilyBold,
      fontSize: 12.6,
      textAlign: isRtl ? "right" : "left",
    },
    masterTable: {
      borderWidth: 1,
      borderColor: "#111827",
      backgroundColor: "#ffffff",
    },
    masterTableTwoColumn: {
      borderWidth: 1,
      borderColor: "#111827",
      backgroundColor: "#ffffff",
      flexDirection: isRtl ? "row-reverse" : "row",
    },
    masterTableHalf: {
      width: "50%",
    },
    masterTableHalfBorder: {
      borderLeftWidth: isRtl ? 0 : 1,
      borderRightWidth: isRtl ? 1 : 0,
      borderColor: "#111827",
    },
    tableHeaderRow: {
      flexDirection: isRtl ? "row-reverse" : "row",
      backgroundColor: "#f8fafc",
      borderBottomWidth: 1,
      borderColor: "#111827",
    },
    tableHeaderCell: {
      paddingTop: 7,
      paddingRight: 8,
      paddingBottom: 7,
      paddingLeft: 8,
      fontSize: 8.9,
      fontFamily: pdfFontFamilyBold,
      textAlign: isRtl ? "right" : "left",
    },
    tableBodyRow: {
      flexDirection: isRtl ? "row-reverse" : "row",
      borderTopWidth: 0.7,
      borderColor: "#d1d5db",
    },
    tableBodyRowFirst: {
      borderTopWidth: 0,
    },
    tableBodyCellLabel: {
      paddingTop: 7,
      paddingRight: 8,
      paddingBottom: 7,
      paddingLeft: 8,
      fontSize: 9.2,
      fontFamily: pdfFontFamilyBold,
      color: "#374151",
      lineHeight: 1.35,
      textAlign: isRtl ? "right" : "left",
    },
    tableBodyCellValue: {
      paddingTop: 7,
      paddingRight: 8,
      paddingBottom: 7,
      paddingLeft: 8,
      fontSize: 9.4,
      color: "#111827",
      lineHeight: 1.35,
      textAlign: isRtl ? "right" : "left",
    },
    colLabelHeader: {
      width: "34%",
    },
    colValueHeader: {
      width: "66%",
    },
    colLabelBody: {
      width: "34%",
    },
    colValueBody: {
      width: "66%",
    },
    ltrValue: {
      direction: "ltr",
      textAlign: "left",
    },
    pageFooter: {
      position: "absolute",
      left: 40,
      right: 40,
      bottom: 20,
      paddingTop: 10,
      borderTopWidth: 0.8,
      borderColor: "#9ca3af",
      flexDirection: isRtl ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    footerCompany: {
      flexGrow: 1,
      flexShrink: 1,
      paddingRight: isRtl ? 0 : 12,
      paddingLeft: isRtl ? 12 : 0,
    },
    footerLine: {
      fontSize: 8.4,
      lineHeight: 1.28,
      color: "#374151",
      textAlign: isRtl ? "right" : "left",
    },
    footerPage: {
      fontSize: 8.4,
      color: "#374151",
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

function buildCompanyFooter(
  company: CompanyPdfProfile,
  language: SupportedLanguage,
  t: (key: TranslationKey) => string
): string[] {
  const companyName = firstNonEmpty(
    safeString(company.companyName),
    COMPANY_NAME
  );
  const lines = [
    companyName,
    firstNonEmpty(safeString(company.addressLine1), COMPANY_ADDRESS_LINE_1),
    firstNonEmpty(buildCompanyAddressLine2(company), COMPANY_ADDRESS_LINE_2),
  ];

  const taxLine = buildCompanyTaxLine(company);
  if (taxLine) {
    lines.push(
      `${t("legalFooterTax")} ${taxLine.replace(/^Steuer-Nr\.\s*/i, "")}`
    );
  }

  const contactLine = [safeString(company.phone), safeString(company.email)]
    .filter(Boolean)
    .join(" | ");
  if (contactLine) {
    lines.push(contactLine);
  }

  const webLine = safeString(company.website);
  if (webLine) {
    lines.push(webLine);
  }

  const generatedAt = formatDateTime(inputSafeGeneratedAt(), language);
  if (!isNotAvailableValue(generatedAt)) {
    lines.push(`${t("generatedAt")} ${generatedAt}`);
  }

  return uniqueStrings(lines);
}

function inputSafeGeneratedAt(): string {
  return new Date().toISOString();
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

  const useTwoColumns = rows.length > 16;
  const firstPageCapacity = useTwoColumns ? 18 : 12;
  const nextPageCapacity = useTwoColumns ? 28 : 20;

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