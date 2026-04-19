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
import type { Style } from "@react-pdf/types";
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
  | "internalReference"
  | "customerNumber"
  | "requestNumber"
  | "appointmentNumber"
  | "status"
  | "language"
  | "createdAt"
  | "updatedAt"
  | "customerSection"
  | "fullName"
  | "email"
  | "phone"
  | "address"
  | "operationSummary"
  | "operationType"
  | "serviceType"
  | "subject"
  | "message"
  | "appointmentType"
  | "appointmentMode"
  | "office"
  | "scheduleSection"
  | "date"
  | "startTime"
  | "endTime"
  | "timeWindow"
  | "qrSection"
  | "qrDescription"
  | "messageSection"
  | "friendlyMessageTitle"
  | "friendlyMessageBody"
  | "companyInformation"
  | "legalInformation"
  | "website"
  | "taxNumber"
  | "vatId"
  | "registrationNumber"
  | "documentNote"
  | "thankYou"
  | "request"
  | "appointment"
  | "notAvailable";

const FONT_REGULAR = "Cairo";
const FONT_BOLD = "CairoBold";

const COLORS = {
  text: "#0F172A",
  muted: "#64748B",
  line: "#CBD5E1",
  soft: "#F8FAFC",
  softBlue: "#EFF6FF",
  blue: "#2563EB",
  blueDark: "#1D4ED8",
  white: "#FFFFFF",
  goldSoft: "#FFF7ED",
  gold: "#C2410C",
};

const translations: Record<SupportedLanguage, Record<TranslationKey, string>> = {
  ar: {
    requestDocument: "مستند طلب رسمي",
    appointmentDocument: "مستند موعد رسمي",
    documentSubtitle: "مرجع احترافي منظم للمتابعة الداخلية والمراجعة والأرشفة",
    internalReference: "المرجع الداخلي",
    customerNumber: "رقم العميل",
    requestNumber: "رقم الطلب",
    appointmentNumber: "رقم الموعد",
    status: "الحالة",
    language: "اللغة",
    createdAt: "تاريخ الإنشاء",
    updatedAt: "آخر تحديث",
    customerSection: "بيانات العميل",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    address: "العنوان",
    operationSummary: "ملخص العملية",
    operationType: "نوع العملية",
    serviceType: "نوع الخدمة",
    subject: "الموضوع",
    message: "الرسالة",
    appointmentType: "نوع الموعد",
    appointmentMode: "طريقة الموعد",
    office: "المكتب",
    scheduleSection: "تفاصيل الموعد",
    date: "التاريخ",
    startTime: "وقت البداية",
    endTime: "وقت النهاية",
    timeWindow: "النافذة الزمنية",
    qrSection: "رمز QR المرجعي",
    qrDescription: "يمكن استخدام هذا الرمز للمراجعة والأرشفة والتنظيم الداخلي.",
    messageSection: "رسالة مختصرة",
    friendlyMessageTitle: "ملاحظة ودية",
    friendlyMessageBody:
      "نشكر لكم ثقتكم بـ Caro Bara Smart Print. تم إنشاء هذا المستند تلقائيًا كمرجع احترافي واضح لهذه العملية.",
    companyInformation: "معلومات الشركة",
    legalInformation: "البيانات القانونية",
    website: "الموقع الإلكتروني",
    taxNumber: "الرقم الضريبي",
    vatId: "رقم ضريبة القيمة المضافة",
    registrationNumber: "رقم السجل",
    documentNote:
      "تم إنشاء هذا المستند تلقائيًا ويُستخدم كمرجع تنظيمي داخلي واحترافي.",
    thankYou: "شكرًا لاختياركم Caro Bara Smart Print",
    request: "طلب",
    appointment: "موعد",
    notAvailable: "غير متوفر",
  },
  de: {
    requestDocument: "Offizielles Anfragedokument",
    appointmentDocument: "Offizielles Termindokument",
    documentSubtitle:
      "Professioneller Nachweis für interne Prüfung, Nachverfolgung und Archivierung",
    internalReference: "Interne Referenz",
    customerNumber: "Kundennummer",
    requestNumber: "Anfragenummer",
    appointmentNumber: "Terminnummer",
    status: "Status",
    language: "Sprache",
    createdAt: "Erstellt am",
    updatedAt: "Aktualisiert am",
    customerSection: "Kundendaten",
    fullName: "Vollständiger Name",
    email: "E-Mail",
    phone: "Telefon",
    address: "Adresse",
    operationSummary: "Vorgangszusammenfassung",
    operationType: "Vorgangsart",
    serviceType: "Serviceart",
    subject: "Betreff",
    message: "Nachricht",
    appointmentType: "Terminart",
    appointmentMode: "Terminmodus",
    office: "Standort",
    scheduleSection: "Terminangaben",
    date: "Datum",
    startTime: "Startzeit",
    endTime: "Endzeit",
    timeWindow: "Zeitfenster",
    qrSection: "QR-Referenzcode",
    qrDescription:
      "Dieser Code kann für Prüfung, Archivierung und interne Organisation verwendet werden.",
    messageSection: "Kurze Mitteilung",
    friendlyMessageTitle: "Freundliche Mitteilung",
    friendlyMessageBody:
      "Vielen Dank für Ihr Vertrauen in Caro Bara Smart Print. Dieses Dokument wurde automatisch als klarer und professioneller Referenznachweis erstellt.",
    companyInformation: "Unternehmensinformationen",
    legalInformation: "Rechtliche Angaben",
    website: "Webseite",
    taxNumber: "Steuernummer",
    vatId: "USt-IdNr.",
    registrationNumber: "Registernummer",
    documentNote:
      "Dieses Dokument wurde automatisch erstellt und dient als professioneller interner Referenznachweis.",
    thankYou: "Vielen Dank, dass Sie Caro Bara Smart Print gewählt haben",
    request: "Anfrage",
    appointment: "Termin",
    notAvailable: "Nicht verfügbar",
  },
  en: {
    requestDocument: "Official Request Document",
    appointmentDocument: "Official Appointment Document",
    documentSubtitle:
      "Professional reference for internal review, tracking, and archiving",
    internalReference: "Internal Reference",
    customerNumber: "Customer Number",
    requestNumber: "Request Number",
    appointmentNumber: "Appointment Number",
    status: "Status",
    language: "Language",
    createdAt: "Created At",
    updatedAt: "Updated At",
    customerSection: "Customer Details",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    operationSummary: "Operation Summary",
    operationType: "Operation Type",
    serviceType: "Service Type",
    subject: "Subject",
    message: "Message",
    appointmentType: "Appointment Type",
    appointmentMode: "Appointment Mode",
    office: "Office",
    scheduleSection: "Schedule Details",
    date: "Date",
    startTime: "Start Time",
    endTime: "End Time",
    timeWindow: "Time Window",
    qrSection: "QR Reference",
    qrDescription:
      "This code can be used for review, archiving, and internal organization.",
    messageSection: "Short Message",
    friendlyMessageTitle: "Friendly Note",
    friendlyMessageBody:
      "Thank you for trusting Caro Bara Smart Print. This document was generated automatically as a clear professional reference for this operation.",
    companyInformation: "Company Information",
    legalInformation: "Legal Information",
    website: "Website",
    taxNumber: "Tax Number",
    vatId: "VAT ID",
    registrationNumber: "Registration Number",
    documentNote:
      "This document was generated automatically and serves as a professional internal reference.",
    thankYou: "Thank you for choosing Caro Bara Smart Print",
    request: "Request",
    appointment: "Appointment",
    notAvailable: "Not available",
  },
};

let fontsRegistered = false;
const registeredFamilies = new Set<string>();

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.white,
    color: COLORS.text,
    fontSize: 10,
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
    lineHeight: 1.45,
  },
  shell: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 18,
    backgroundColor: COLORS.soft,
    padding: 16,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  logoBox: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: COLORS.softBlue,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginRight: 12,
  },
  logoImage: {
    width: 54,
    height: 54,
  },
  logoFallback: {
    fontSize: 18,
    color: COLORS.blue,
  },
  headerMain: {
    flex: 1,
  },
  companyTitle: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 3,
    lineHeight: 1.2,
  },
  companySub: {
    fontSize: 9,
    color: COLORS.muted,
    lineHeight: 1.25,
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.blue,
    borderRadius: 999,
    color: COLORS.white,
    fontSize: 8,
  },
  heroCard: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  heroTitle: {
    fontSize: 19,
    color: COLORS.text,
    marginBottom: 4,
    lineHeight: 1.2,
  },
  heroSubtitle: {
    fontSize: 9,
    color: COLORS.muted,
    marginBottom: 10,
    lineHeight: 1.3,
  },
  refCard: {
    borderWidth: 1,
    borderColor: "#FED7AA",
    backgroundColor: COLORS.goldSoft,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  refLabel: {
    fontSize: 7.5,
    color: COLORS.gold,
    marginBottom: 2,
  },
  refValue: {
    fontSize: 9,
    color: COLORS.gold,
    lineHeight: 1.35,
  },
  twoColGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  metaItem: {
    width: "48.5%",
    marginBottom: 10,
  },
  section: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    overflow: "hidden",
    marginBottom: 12,
  },
  sectionHead: {
    backgroundColor: COLORS.softBlue,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 10.5,
    color: COLORS.blueDark,
  },
  sectionBody: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  infoRow: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 8,
    color: COLORS.muted,
    marginBottom: 2,
    lineHeight: 1.25,
  },
  infoValue: {
    fontSize: 10,
    color: COLORS.text,
    lineHeight: 1.5,
  },
  mutedValue: {
    color: COLORS.muted,
  },
  qrCard: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    overflow: "hidden",
    marginBottom: 12,
  },
  qrBody: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  qrText: {
    fontSize: 9,
    color: COLORS.muted,
    lineHeight: 1.5,
    textAlign: "center",
    marginBottom: 10,
  },
  qrFrame: {
    width: 150,
    minHeight: 150,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    marginBottom: 10,
  },
  qrImage: {
    width: 132,
    height: 132,
  },
  qrFallback: {
    fontSize: 9,
    color: COLORS.muted,
  },
  qrRefLabel: {
    fontSize: 7.5,
    color: COLORS.muted,
    textAlign: "center",
    marginBottom: 4,
  },
  qrRefValue: {
    fontSize: 8,
    color: COLORS.text,
    lineHeight: 1.35,
    textAlign: "center",
  },
  messageLine: {
    fontSize: 10,
    lineHeight: 1.65,
    color: COLORS.text,
    marginBottom: 4,
  },
  footer: {
    marginTop: 2,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    paddingTop: 10,
  },
  footerCols: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerCol: {
    width: "48.5%",
  },
  footerTitle: {
    fontSize: 8.2,
    color: COLORS.blueDark,
    marginBottom: 4,
  },
  footerText: {
    fontSize: 7.8,
    color: COLORS.muted,
    lineHeight: 1.35,
    marginBottom: 2,
  },
  footerBottom: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
  },
  footerNote: {
    fontSize: 7.5,
    color: COLORS.muted,
    marginBottom: 4,
    lineHeight: 1.3,
  },
  footerThanks: {
    fontSize: 7.8,
    color: COLORS.text,
  },
});

export function OperationPdfDocument({
  identity,
  qrCodeDataUrl,
  company,
}: OperationPdfInput) {
  ensurePdfFontsRegistered();

  const lang = resolvePdfLanguage(identity?.language);
  const t = createTranslator(lang);
  const isAppointment = safeString(identity?.kind) === "appointment";

  const operationNumber = firstNonEmpty(
    safeString(identity?.ids?.appointmentId),
    safeString(identity?.ids?.requestId),
    safeString(identity?.ids?.referenceNumber)
  );

  const customerNumber = firstNonEmpty(safeString(identity?.ids?.customerId));
  const internalReference = safeString(buildSafeHumanReference(identity));
  const companyAddress = buildCompanyAddress(company);
  const customerAddress = firstNonEmpty(
    safeString(
      (
        identity as NormalizedOperationIdentity & {
          customer?: { addressLine?: string };
        }
      )?.customer?.addressLine
    ),
    buildCustomerAddressFromParts(identity)
  );

  const scheduleDate = formatDateOnly(identity?.schedule?.date, lang);
  const scheduleStart = normalizeDisplayValue(identity?.schedule?.startTime, lang);
  const scheduleEnd = normalizeDisplayValue(identity?.schedule?.endTime, lang);
  const scheduleWindow = firstNonEmpty(
    safeString(identity?.schedule?.timeLabel),
    buildTimeWindow(identity?.schedule?.startTime, identity?.schedule?.endTime, lang)
  );

  const operationTypeValue = isAppointment ? t("appointment") : t("request");
  const documentTitle = isAppointment
    ? t("appointmentDocument")
    : t("requestDocument");

  return (
    <Document
      title={buildPdfTitle(identity, customerNumber)}
      author={safeString(company.companyName) || "Caro Bara Smart Print"}
      subject={documentTitle}
      language={lang}
    >
      <Page
        size="A4"
        style={[
          styles.page,
          {
            fontFamily: getRegularFont(),
          },
        ]}
      >
        <View style={styles.shell}>
          <View style={styles.headerRow}>
            <View style={styles.logoBox}>
              {hasValue(company.logoSrc) ? (
                <Image src={company.logoSrc as string} style={styles.logoImage} />
              ) : (
                <Text
                  style={[
                    styles.logoFallback,
                    {
                      fontFamily: getBoldFont(),
                    },
                  ]}
                >
                  CB
                </Text>
              )}
            </View>

            <View style={styles.headerMain}>
              <Text
                style={[
                  styles.companyTitle,
                  {
                    fontFamily: getBoldFont(),
                  },
                ]}
              >
                {normalizeDisplayValue(company.companyName, lang)}
              </Text>
              <Text
                style={[
                  styles.companySub,
                  {
                    fontFamily: getRegularFont(),
                  },
                ]}
              >
                {normalizeDisplayValue(company.legalName || company.companyName, lang)}
              </Text>
            </View>

            <Text
              style={[
                styles.badge,
                {
                  fontFamily: getBoldFont(),
                },
              ]}
            >
              {operationTypeValue}
            </Text>
          </View>

          <View style={styles.heroCard}>
            <Text
              style={[
                styles.heroTitle,
                {
                  fontFamily: getBoldFont(),
                },
              ]}
            >
              {documentTitle}
            </Text>
            <Text
              style={[
                styles.heroSubtitle,
                {
                  fontFamily: getRegularFont(),
                },
              ]}
            >
              {t("documentSubtitle")}
            </Text>

            <View style={styles.refCard}>
              <Text
                style={[
                  styles.refLabel,
                  {
                    fontFamily: getBoldFont(),
                  },
                ]}
              >
                {t("internalReference")}
              </Text>
              <SafeText
                text={internalReference}
                isBold={true}
                forceLtr={true}
                preserveTokens={true}
                textStyle={styles.refValue}
              />
            </View>

            <View style={styles.twoColGrid}>
              <MetaItem label={t("customerNumber")} value={customerNumber} lang={lang} />
              <MetaItem
                label={isAppointment ? t("appointmentNumber") : t("requestNumber")}
                value={operationNumber}
                lang={lang}
              />
              <MetaItem
                label={t("status")}
                value={safeString(identity?.operation?.status)}
                lang={lang}
              />
              <MetaItem
                label={t("language")}
                value={String(lang).toUpperCase()}
                lang={lang}
              />
              <MetaItem
                label={t("createdAt")}
                value={formatDateTime(identity?.meta?.createdAt, lang)}
                lang={lang}
              />
              <MetaItem
                label={t("updatedAt")}
                value={formatDateTime(identity?.meta?.updatedAt, lang)}
                lang={lang}
              />
            </View>
          </View>
        </View>

        <Section title={t("customerSection")}>
          <InfoItem
            label={t("fullName")}
            value={safeString(identity?.customer?.fullName)}
            lang={lang}
          />
          <InfoItem
            label={t("email")}
            value={safeString(identity?.customer?.email)}
            forceLtrValue={true}
            lang={lang}
          />
          <InfoItem
            label={t("phone")}
            value={safeString(identity?.customer?.phone)}
            forceLtrValue={true}
            lang={lang}
          />
          <InfoItem label={t("address")} value={customerAddress} lang={lang} />
        </Section>

        <Section title={t("operationSummary")}>
          <InfoItem label={t("operationType")} value={operationTypeValue} lang={lang} />
          <InfoItem
            label={t("serviceType")}
            value={safeString(identity?.operation?.serviceType)}
            lang={lang}
          />
          <InfoItem
            label={t("subject")}
            value={safeString(identity?.operation?.subject)}
            lang={lang}
          />
          <InfoItem
            label={t("appointmentType")}
            value={safeString(identity?.operation?.appointmentType)}
            lang={lang}
          />
          <InfoItem
            label={t("appointmentMode")}
            value={safeString(identity?.operation?.appointmentMode)}
            lang={lang}
          />
          <InfoItem
            label={t("office")}
            value={firstNonEmpty(
              safeString(identity?.operation?.officeLabel),
              safeString(identity?.operation?.officeId)
            )}
            lang={lang}
          />
        </Section>

        <View style={styles.qrCard}>
          <View style={styles.sectionHead}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  fontFamily: getBoldFont(),
                },
              ]}
            >
              {t("qrSection")}
            </Text>
          </View>
          <View style={styles.qrBody}>
            <Text
              style={[
                styles.qrText,
                {
                  fontFamily: getRegularFont(),
                },
              ]}
            >
              {t("qrDescription")}
            </Text>

            <View style={styles.qrFrame}>
              {hasValue(qrCodeDataUrl) ? (
                <Image src={qrCodeDataUrl as string} style={styles.qrImage} />
              ) : (
                <Text
                  style={[
                    styles.qrFallback,
                    {
                      fontFamily: getRegularFont(),
                    },
                  ]}
                >
                  {t("notAvailable")}
                </Text>
              )}
            </View>

            <Text
              style={[
                styles.qrRefLabel,
                {
                  fontFamily: getBoldFont(),
                },
              ]}
            >
              {t("internalReference")}
            </Text>
            <SafeText
              text={internalReference}
              forceLtr={true}
              preserveTokens={true}
              textStyle={styles.qrRefValue}
            />
          </View>
        </View>

        <Section title={t("messageSection")}>
          <MultilineText
            text={normalizeMultilineText(identity?.operation?.message, lang)}
          />
        </Section>

        <Section title={t("friendlyMessageTitle")}>
          <MultilineText text={t("friendlyMessageBody")} />
        </Section>

        <Section title={t("scheduleSection")}>
          <InfoItem label={t("date")} value={scheduleDate} lang={lang} />
          <InfoItem
            label={t("timeWindow")}
            value={scheduleWindow}
            forceLtrValue={true}
            lang={lang}
          />
          <InfoItem
            label={t("startTime")}
            value={scheduleStart}
            forceLtrValue={true}
            lang={lang}
          />
          <InfoItem
            label={t("endTime")}
            value={scheduleEnd}
            forceLtrValue={true}
            lang={lang}
          />
        </Section>

        <View style={styles.footer}>
          <View style={styles.footerCols}>
            <View style={styles.footerCol}>
              <Text
                style={[
                  styles.footerTitle,
                  {
                    fontFamily: getBoldFont(),
                  },
                ]}
              >
                {t("companyInformation")}
              </Text>
              <FooterLine text={safeString(company.companyName)} />
              {hasValue(company.legalName) ? (
                <FooterLine text={safeString(company.legalName)} />
              ) : null}
              {hasValue(company.phone) ? (
                <FooterLine text={safeString(company.phone)} forceLtr={true} />
              ) : null}
              {hasValue(company.email) ? (
                <FooterLine text={safeString(company.email)} forceLtr={true} />
              ) : null}
              {hasValue(company.website) ? (
                <FooterLine text={safeString(company.website)} forceLtr={true} />
              ) : null}
              {hasValue(companyAddress) ? <FooterLine text={companyAddress} /> : null}
            </View>

            <View style={styles.footerCol}>
              <Text
                style={[
                  styles.footerTitle,
                  {
                    fontFamily: getBoldFont(),
                  },
                ]}
              >
                {t("legalInformation")}
              </Text>
              {hasValue(company.taxNumber) ? (
                <FooterLine
                  text={`${t("taxNumber")}: ${safeString(company.taxNumber)}`}
                  forceLtr={true}
                />
              ) : null}
              {hasValue(company.vatId) ? (
                <FooterLine
                  text={`${t("vatId")}: ${safeString(company.vatId)}`}
                  forceLtr={true}
                />
              ) : null}
              {hasValue(company.registrationNumber) ? (
                <FooterLine
                  text={`${t("registrationNumber")}: ${safeString(
                    company.registrationNumber
                  )}`}
                  forceLtr={true}
                />
              ) : null}
            </View>
          </View>

          <View style={styles.footerBottom}>
            <Text
              style={[
                styles.footerNote,
                {
                  fontFamily: getRegularFont(),
                },
              ]}
            >
              {t("documentNote")}
            </Text>
            <Text
              style={[
                styles.footerThanks,
                {
                  fontFamily: getBoldFont(),
                },
              ]}
            >
              {t("thankYou")}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function generateOperationPdfBuffer(
  input: OperationPdfInput
): Promise<Buffer> {
  ensurePdfFontsRegistered();
  return renderToBuffer(<OperationPdfDocument {...input} />);
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <Text
          style={[
            styles.sectionTitle,
            {
              fontFamily: getBoldFont(),
            },
          ]}
        >
          {title}
        </Text>
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function InfoItem({
  label,
  value,
  forceLtrValue = false,
  lang,
}: {
  label: string;
  value?: string | null;
  forceLtrValue?: boolean;
  lang: SupportedLanguage;
}) {
  const resolvedValue = normalizeDisplayValue(value, lang);

  return (
    <View style={styles.infoRow}>
      <Text
        style={[
          styles.infoLabel,
          {
            fontFamily: getRegularFont(),
          },
        ]}
      >
        {label}
      </Text>
      <SafeText
        text={resolvedValue}
        isBold={hasValue(value)}
        forceLtr={forceLtrValue}
        preserveTokens={forceLtrValue}
        textStyle={[
          styles.infoValue,
          !hasValue(value) ? styles.mutedValue : {},
        ]}
      />
    </View>
  );
}

function MetaItem({
  label,
  value,
  lang,
}: {
  label: string;
  value?: string | null;
  lang: SupportedLanguage;
}) {
  const resolvedValue = normalizeDisplayValue(value, lang);
  const forceLtr = shouldForceLtrValue(resolvedValue);

  return (
    <View style={styles.metaItem}>
      <Text
        style={[
          styles.infoLabel,
          {
            fontFamily: getRegularFont(),
          },
        ]}
      >
        {label}
      </Text>
      <SafeText
        text={resolvedValue}
        isBold={hasValue(value)}
        forceLtr={forceLtr}
        preserveTokens={forceLtr}
        textStyle={[
          styles.infoValue,
          !hasValue(value) ? styles.mutedValue : {},
        ]}
      />
    </View>
  );
}

function FooterLine({
  text,
  forceLtr = false,
}: {
  text: string;
  forceLtr?: boolean;
}) {
  return (
    <SafeText
      text={text}
      forceLtr={forceLtr}
      preserveTokens={forceLtr}
      textStyle={styles.footerText}
    />
  );
}

function SafeText({
  text,
  isBold = false,
  forceLtr = false,
  preserveTokens = false,
  textStyle,
}: {
  text: string;
  isBold?: boolean;
  forceLtr?: boolean;
  preserveTokens?: boolean;
  textStyle?: Style | Style[];
}) {
  const prepared = prepareText(text, { forceLtr, preserveTokens });
  const resolvedTextStyles = resolveTextStyles(textStyle);

  return (
    <Text
      style={[
        ...resolvedTextStyles,
        {
          fontFamily: isBold ? getBoldFont() : getRegularFont(),
        },
      ]}
    >
      {prepared}
    </Text>
  );
}

function MultilineText({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <View>
      {lines.map((line, index) => (
        <SafeText
          key={`${index}-${line}`}
          text={line || " "}
          preserveTokens={containsStructuredContent(line)}
          textStyle={styles.messageLine}
        />
      ))}
    </View>
  );
}

function resolveTextStyles(textStyle?: Style | Style[]): Style[] {
  if (!textStyle) {
    return [];
  }

  return Array.isArray(textStyle) ? textStyle : [textStyle];
}

function createTranslator(language: SupportedLanguage) {
  return function translate(key: TranslationKey): string {
    return translations[language][key] || translations.en[key] || key;
  };
}

function resolvePdfLanguage(value?: string): SupportedLanguage {
  if (value === "ar" || value === "de" || value === "en") {
    return value;
  }

  return "en";
}

function safeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
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

function normalizeDisplayValue(
  value?: string | null,
  language: SupportedLanguage = "en"
): string {
  return hasValue(value) ? value.trim() : translations[language].notAvailable;
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
    .replace(/\t/g, "    ")
    .replace(/[ \u00A0]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function buildCompanyAddress(company: CompanyPdfProfile): string {
  const parts = [
    safeString(company.addressLine1),
    safeString(company.addressLine2),
    safeString(company.postalCode),
    safeString(company.city),
    safeString(company.country),
  ].filter(Boolean);

  return parts.join(", ");
}

function buildCustomerAddressFromParts(identity: NormalizedOperationIdentity): string {
  const addressParts = identity?.customer?.addressParts;

  const parts = [
    safeString(addressParts?.street),
    safeString(addressParts?.houseNumber),
    safeString(addressParts?.postalCode),
    safeString(addressParts?.city),
    safeString(addressParts?.country),
  ].filter(Boolean);

  return parts.join(", ");
}

function buildPdfTitle(
  identity: NormalizedOperationIdentity,
  customerNumber?: string
): string {
  const operationType = identity?.kind === "appointment" ? "appointment" : "request";
  const operationNumber = firstNonEmpty(
    safeString(identity?.ids?.appointmentId),
    safeString(identity?.ids?.requestId),
    safeString(identity?.ids?.referenceNumber),
    "document"
  );
  const customerPart = firstNonEmpty(
    safeString(customerNumber),
    safeString(identity?.ids?.customerId),
    "customer"
  );

  return `${operationType}-${sanitizeFilePart(customerPart)}-${sanitizeFilePart(
    operationNumber
  )}`;
}

function sanitizeFilePart(value?: string | null): string {
  const clean = safeString(value)
    .replace(/[^A-Za-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return clean || "document";
}

function mapLocale(language: SupportedLanguage): string {
  if (language === "ar") return "ar";
  if (language === "de") return "de-DE";
  return "en-US";
}

function getRegularFont(): string {
  return registeredFamilies.has(FONT_REGULAR) ? FONT_REGULAR : "Helvetica";
}

function getBoldFont(): string {
  return registeredFamilies.has(FONT_BOLD) ? FONT_BOLD : "Helvetica-Bold";
}

function registerFontIfExists(family: string, filePath: string) {
  if (!fs.existsSync(filePath) || registeredFamilies.has(family)) {
    return;
  }

  Font.register({
    family,
    src: filePath,
  });

  registeredFamilies.add(family);
}

function ensurePdfFontsRegistered() {
  if (fontsRegistered) {
    return;
  }

  Font.registerHyphenationCallback((word) => [word]);

  const fontsDir = path.join(process.cwd(), "public", "fonts");
  registerFontIfExists(FONT_REGULAR, path.join(fontsDir, "Cairo-Regular.ttf"));
  registerFontIfExists(FONT_BOLD, path.join(fontsDir, "Cairo-Bold.ttf"));

  fontsRegistered = true;
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

function prepareText(
  value: string,
  options: {
    forceLtr?: boolean;
    preserveTokens?: boolean;
  }
): string {
  const normalized = normalizeVisibleText(value);

  if (!normalized) {
    return "";
  }

  if (options.forceLtr) {
    return wrapLtr(insertSoftBreaks(normalized));
  }

  if (options.preserveTokens || containsStructuredContent(normalized)) {
    return insertSoftBreaks(normalized);
  }

  return normalized;
}

function normalizeVisibleText(value: string): string {
  return String(value || "")
    .replace(/[ـ]+/g, "")
    .replace(/\s+([،؛,.!?])/g, "$1")
    .replace(/([(\[{])\s+/g, "$1")
    .replace(/\s+([)\]}])/g, "$1")
    .replace(/[ \u00A0]{2,}/g, " ")
    .trim();
}

function insertSoftBreaks(value: string): string {
  return String(value || "")
    .replace(/([/@#?&=._:-])/g, "$1\u200B")
    .replace(/(\d)(\/)(\d)/g, "$1$2\u200B$3")
    .replace(/\u200B{2,}/g, "\u200B");
}

function containsStructuredContent(value: string): boolean {
  return /[@/_.:+#%&=?-]|\d|https?:\/\/|www\./i.test(String(value || ""));
}

function shouldForceLtrValue(value: string): boolean {
  return containsStructuredContent(value) || /^[A-Z]{2,}$/i.test(value);
}

function wrapLtr(value: string): string {
  return `\u200E${value}\u200E`;
}