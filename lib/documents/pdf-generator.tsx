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
  | "customerDetails"
  | "fullName"
  | "email"
  | "phone"
  | "address"
  | "operationSummary"
  | "operationType"
  | "serviceType"
  | "subject"
  | "appointmentType"
  | "appointmentMode"
  | "office"
  | "scheduleDetails"
  | "date"
  | "startTime"
  | "endTime"
  | "timeWindow"
  | "requestMessage"
  | "attachedReferenceQr"
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

const BRAND = {
  text: "#101828",
  muted: "#667085",
  line: "#D0D5DD",
  soft: "#F8FAFC",
  softBlue: "#EEF4FF",
  primary: "#1877F2",
  primaryDark: "#0F52BA",
  white: "#FFFFFF",
  gold: "#B36B00",
};

const MAIN_FONT = "Cairo";
const MAIN_FONT_BOLD = "CairoBold";

let fontsRegistered = false;
const registeredFamilies = new Set<string>();

const translations: Record<SupportedLanguage, Record<TranslationKey, string>> = {
  ar: {
    requestDocument: "مستند طلب رسمي",
    appointmentDocument: "مستند موعد رسمي",
    documentSubtitle: "مرجع احترافي منظم للمتابعة والأرشفة والمراجعة",
    internalReference: "المرجع الداخلي",
    customerNumber: "رقم العميل",
    requestNumber: "رقم الطلب",
    appointmentNumber: "رقم الموعد",
    status: "الحالة",
    language: "اللغة",
    createdAt: "تاريخ الإنشاء",
    updatedAt: "آخر تحديث",
    customerDetails: "بيانات العميل",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    address: "العنوان",
    operationSummary: "ملخص العملية",
    operationType: "نوع العملية",
    serviceType: "نوع الخدمة",
    subject: "الموضوع",
    appointmentType: "نوع الموعد",
    appointmentMode: "طريقة الموعد",
    office: "المكتب",
    scheduleDetails: "تفاصيل الموعد",
    date: "التاريخ",
    startTime: "وقت البداية",
    endTime: "وقت النهاية",
    timeWindow: "النافذة الزمنية",
    requestMessage: "تفاصيل الرسالة أو الطلب",
    attachedReferenceQr: "رمز QR المرجعي",
    companyInformation: "معلومات الشركة",
    legalInformation: "البيانات القانونية",
    website: "الموقع الإلكتروني",
    taxNumber: "الرقم الضريبي",
    vatId: "رقم ضريبة القيمة المضافة",
    registrationNumber: "رقم السجل",
    documentNote:
      "تم إنشاء هذا المستند تلقائيًا ويُستخدم كمرجع تنظيمي مهني للمتابعة والمراجعة والأرشفة.",
    thankYou: "شكرًا لاختياركم Caro Bara Smart Print",
    request: "طلب",
    appointment: "موعد",
    notAvailable: "غير متوفر",
  },
  de: {
    requestDocument: "Offizielles Anfragedokument",
    appointmentDocument: "Offizielles Termindokument",
    documentSubtitle:
      "Professioneller Organisationsnachweis für Prüfung, Nachverfolgung und Archivierung",
    internalReference: "Interne Referenz",
    customerNumber: "Kundennummer",
    requestNumber: "Anfragenummer",
    appointmentNumber: "Terminnummer",
    status: "Status",
    language: "Sprache",
    createdAt: "Erstellt am",
    updatedAt: "Zuletzt aktualisiert",
    customerDetails: "Kundendaten",
    fullName: "Vollständiger Name",
    email: "E-Mail",
    phone: "Telefon",
    address: "Adresse",
    operationSummary: "Vorgangszusammenfassung",
    operationType: "Vorgangsart",
    serviceType: "Serviceart",
    subject: "Betreff",
    appointmentType: "Terminart",
    appointmentMode: "Terminmodus",
    office: "Standort",
    scheduleDetails: "Termindetails",
    date: "Datum",
    startTime: "Startzeit",
    endTime: "Endzeit",
    timeWindow: "Zeitfenster",
    requestMessage: "Nachricht / Anfragedetails",
    attachedReferenceQr: "QR-Referenzcode",
    companyInformation: "Unternehmensinformationen",
    legalInformation: "Rechtliche Angaben",
    website: "Webseite",
    taxNumber: "Steuernummer",
    vatId: "USt-IdNr.",
    registrationNumber: "Registernummer",
    documentNote:
      "Dieses Dokument wurde automatisch erstellt und dient als professioneller Nachweis für Organisation, Prüfung und Archivierung.",
    thankYou: "Vielen Dank, dass Sie Caro Bara Smart Print gewählt haben",
    request: "Anfrage",
    appointment: "Termin",
    notAvailable: "Nicht verfügbar",
  },
  en: {
    requestDocument: "Official Request Document",
    appointmentDocument: "Official Appointment Document",
    documentSubtitle:
      "Professional operational reference for review, tracking, and archiving",
    internalReference: "Internal Reference",
    customerNumber: "Customer Number",
    requestNumber: "Request Number",
    appointmentNumber: "Appointment Number",
    status: "Status",
    language: "Language",
    createdAt: "Created At",
    updatedAt: "Updated At",
    customerDetails: "Customer Details",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    operationSummary: "Operation Summary",
    operationType: "Operation Type",
    serviceType: "Service Type",
    subject: "Subject",
    appointmentType: "Appointment Type",
    appointmentMode: "Appointment Mode",
    office: "Office",
    scheduleDetails: "Schedule Details",
    date: "Date",
    startTime: "Start Time",
    endTime: "End Time",
    timeWindow: "Time Window",
    requestMessage: "Message / Request Details",
    attachedReferenceQr: "QR Reference",
    companyInformation: "Company Information",
    legalInformation: "Legal Information",
    website: "Website",
    taxNumber: "Tax Number",
    vatId: "VAT ID",
    registrationNumber: "Registration Number",
    documentNote:
      "This document was generated automatically and serves as a professional reference for review, tracking, and archiving.",
    thankYou: "Thank you for choosing Caro Bara Smart Print",
    request: "Request",
    appointment: "Appointment",
    notAvailable: "Not available",
  },
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: BRAND.white,
    color: BRAND.text,
    fontSize: 10,
    paddingTop: 26,
    paddingBottom: 28,
    paddingHorizontal: 26,
    lineHeight: 1.4,
  },
  topShell: {
    borderWidth: 1,
    borderColor: BRAND.line,
    borderRadius: 18,
    backgroundColor: BRAND.soft,
    padding: 16,
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowReverse: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  logoBox: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: BRAND.softBlue,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginRight: 12,
  },
  logoBoxRtl: {
    marginRight: 0,
    marginLeft: 12,
  },
  logoImage: {
    width: 54,
    height: 54,
  },
  logoFallback: {
    fontSize: 18,
    color: BRAND.primary,
  },
  companyTitle: {
    fontSize: 18,
    color: BRAND.text,
    marginBottom: 2,
  },
  companySub: {
    fontSize: 9,
    color: BRAND.muted,
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 11,
    backgroundColor: BRAND.primary,
    color: BRAND.white,
    borderRadius: 999,
    fontSize: 8,
  },
  heroCard: {
    borderWidth: 1,
    borderColor: BRAND.line,
    borderRadius: 16,
    backgroundColor: BRAND.white,
    padding: 16,
  },
  heroTitle: {
    fontSize: 20,
    color: BRAND.text,
    marginBottom: 3,
  },
  heroSubtitle: {
    fontSize: 9,
    color: BRAND.muted,
    marginBottom: 8,
  },
  heroRefWrap: {
    borderWidth: 1,
    borderColor: "#F4D7A1",
    backgroundColor: "#FFF9F1",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  heroRefLabel: {
    fontSize: 7.5,
    color: BRAND.gold,
    marginBottom: 2,
  },
  heroRefValue: {
    fontSize: 9,
    color: BRAND.gold,
    lineHeight: 1.35,
  },
  twoColGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  twoColGridRtl: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48.5%",
    marginBottom: 10,
  },
  section: {
    borderWidth: 1,
    borderColor: BRAND.line,
    borderRadius: 16,
    backgroundColor: BRAND.white,
    overflow: "hidden",
    marginBottom: 12,
  },
  sectionHead: {
    backgroundColor: BRAND.softBlue,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.line,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 10.5,
    color: BRAND.primaryDark,
  },
  sectionBody: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  itemHalf: {
    width: "48.5%",
    marginBottom: 10,
  },
  itemFull: {
    width: "100%",
    marginBottom: 10,
  },
  label: {
    fontSize: 8,
    color: BRAND.muted,
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    color: BRAND.text,
    lineHeight: 1.45,
  },
  valueMuted: {
    color: BRAND.muted,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  summaryRowRtl: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
  },
  summaryMain: {
    width: "71%",
  },
  summarySide: {
    width: "26%",
    marginLeft: "3%",
  },
  summarySideRtl: {
    width: "26%",
    marginRight: "3%",
  },
  qrCard: {
    borderWidth: 1,
    borderColor: BRAND.line,
    borderRadius: 16,
    backgroundColor: BRAND.soft,
    padding: 12,
    marginBottom: 12,
  },
  qrTitle: {
    fontSize: 10.5,
    color: BRAND.primaryDark,
    marginBottom: 8,
  },
  qrFrame: {
    borderWidth: 1,
    borderColor: BRAND.line,
    borderRadius: 14,
    backgroundColor: BRAND.white,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  qrImage: {
    width: 136,
    height: 136,
    alignSelf: "center",
  },
  qrFallback: {
    width: 136,
    height: 136,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  qrRefLabel: {
    fontSize: 7.5,
    color: BRAND.muted,
    textAlign: "center",
    marginBottom: 4,
  },
  qrRef: {
    fontSize: 8,
    color: BRAND.text,
    textAlign: "center",
    lineHeight: 1.35,
  },
  messageCard: {
    borderWidth: 1,
    borderColor: BRAND.line,
    borderRadius: 16,
    backgroundColor: BRAND.white,
    overflow: "hidden",
    marginBottom: 12,
  },
  messageBody: {
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  messageLine: {
    fontSize: 10,
    lineHeight: 1.6,
    marginBottom: 4,
    color: BRAND.text,
  },
  footer: {
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: BRAND.line,
    paddingTop: 10,
  },
  footerCols: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerColsRtl: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  footerCol: {
    width: "48.5%",
  },
  footerTitle: {
    fontSize: 8.2,
    color: BRAND.primaryDark,
    marginBottom: 4,
  },
  footerText: {
    fontSize: 7.8,
    color: BRAND.muted,
    marginBottom: 2,
    lineHeight: 1.35,
  },
  footerBottom: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: BRAND.line,
  },
  footerNote: {
    fontSize: 7.5,
    color: BRAND.muted,
    marginBottom: 4,
  },
  footerThanks: {
    fontSize: 7.7,
    color: BRAND.text,
  },
});

export function OperationPdfDocument({
  identity,
  qrCodeDataUrl,
  company,
}: OperationPdfInput) {
  ensurePdfFontsRegistered();

  const lang = normalizeLanguage(identity.language);
  const t = createTranslator(lang);
  const isRtl = lang === "ar";

  const title =
    identity.kind === "appointment"
      ? t("appointmentDocument")
      : t("requestDocument");

  const operationNumber =
    identity.kind === "appointment"
      ? identity.ids.appointmentId || identity.ids.referenceNumber
      : identity.ids.requestId || identity.ids.referenceNumber;

  const customerNumber = identity.ids.customerId || t("notAvailable");
  const internalReference = buildOperationHumanReference(identity);
  const companyAddress = buildCompanyAddress(company);
  const timeWindow = buildTimeWindow(
    identity.schedule.startTime,
    identity.schedule.endTime,
    lang
  );

  return (
    <Document
      title={buildPdfTitle(identity, customerNumber)}
      author={company.companyName}
      subject={title}
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
        <View style={styles.topShell}>
          <View style={isRtl ? styles.rowReverse : styles.row}>
            <View style={mergeViewStyles(styles.logoBox, isRtl ? styles.logoBoxRtl : undefined)}>
              {company.logoSrc ? (
                <Image src={company.logoSrc} style={styles.logoImage} />
              ) : (
                <Text
                  style={[
                    styles.logoFallback,
                    { fontFamily: getBoldFont() },
                  ]}
                >
                  CB
                </Text>
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.companyTitle,
                  {
                    textAlign: isRtl ? "right" : "left",
                    fontFamily: getBoldFont(),
                  },
                ]}
              >
                {company.companyName}
              </Text>
              <Text
                style={[
                  styles.companySub,
                  { textAlign: isRtl ? "right" : "left" },
                ]}
              >
                {company.legalName || company.companyName}
              </Text>
            </View>

            <Text
              style={[
                styles.badge,
                {
                  fontFamily: getBoldFont(),
                  textAlign: "center",
                },
              ]}
            >
              {identity.kind === "appointment" ? t("appointment") : t("request")}
            </Text>
          </View>

          <View style={styles.heroCard}>
            <Text
              style={[
                styles.heroTitle,
                {
                  textAlign: isRtl ? "right" : "left",
                  fontFamily: getBoldFont(),
                },
              ]}
            >
              {title}
            </Text>

            <Text
              style={[
                styles.heroSubtitle,
                {
                  textAlign: isRtl ? "right" : "left",
                  fontFamily: getRegularFont(),
                },
              ]}
            >
              {t("documentSubtitle")}
            </Text>

            <View style={styles.heroRefWrap}>
              <Text
                style={[
                  styles.heroRefLabel,
                  {
                    textAlign: isRtl ? "right" : "left",
                    fontFamily: getBoldFont(),
                  },
                ]}
              >
                {t("internalReference")}
              </Text>
              <RichText
                text={internalReference}
                documentLanguage={lang}
                isRtl={false}
                isBold={true}
                forceLtr={true}
                preserveTokens={true}
                textStyle={[
                  styles.heroRefValue,
                  {
                    textAlign: isRtl ? "right" : "left",
                  },
                ]}
              />
            </View>

            <View style={isRtl ? styles.twoColGridRtl : styles.twoColGrid}>
              <MetaItem
                label={t("customerNumber")}
                value={customerNumber}
                lang={lang}
                isRtl={isRtl}
              />
              <MetaItem
                label={
                  identity.kind === "appointment"
                    ? t("appointmentNumber")
                    : t("requestNumber")
                }
                value={operationNumber}
                lang={lang}
                isRtl={isRtl}
              />
              <MetaItem
                label={t("status")}
                value={identity.operation.status}
                lang={lang}
                isRtl={isRtl}
              />
              <MetaItem
                label={t("language")}
                value={String(identity.language || "").toUpperCase()}
                lang={lang}
                isRtl={isRtl}
              />
              <MetaItem
                label={t("createdAt")}
                value={formatDateTime(identity.meta.createdAt, lang)}
                lang={lang}
                isRtl={isRtl}
              />
              <MetaItem
                label={t("updatedAt")}
                value={formatDateTime(identity.meta.updatedAt, lang)}
                lang={lang}
                isRtl={isRtl}
              />
            </View>
          </View>
        </View>

        <View style={isRtl ? styles.summaryRowRtl : styles.summaryRow}>
          <View style={styles.summaryMain}>
            <Section title={t("customerDetails")} isRtl={isRtl}>
              <InfoItem
                label={t("fullName")}
                value={identity.customer.fullName}
                width="half"
                lang={lang}
                isRtl={isRtl}
              />
              <InfoItem
                label={t("email")}
                value={identity.customer.email}
                width="half"
                lang={lang}
                isRtl={isRtl}
                forceLtrValue={true}
              />
              <InfoItem
                label={t("phone")}
                value={identity.customer.phone}
                width="half"
                lang={lang}
                isRtl={isRtl}
                forceLtrValue={true}
              />
              <InfoItem
                label={t("address")}
                value={identity.customer.addressLine}
                width="full"
                lang={lang}
                isRtl={isRtl}
              />
            </Section>

            <Section title={t("operationSummary")} isRtl={isRtl}>
              <InfoItem
                label={t("operationType")}
                value={identity.kind === "appointment" ? t("appointment") : t("request")}
                width="half"
                lang={lang}
                isRtl={isRtl}
              />
              <InfoItem
                label={t("serviceType")}
                value={identity.operation.serviceType}
                width="half"
                lang={lang}
                isRtl={isRtl}
              />
              <InfoItem
                label={t("subject")}
                value={identity.operation.subject}
                width="full"
                lang={lang}
                isRtl={isRtl}
              />
              <InfoItem
                label={t("appointmentType")}
                value={identity.operation.appointmentType}
                width="half"
                lang={lang}
                isRtl={isRtl}
              />
              <InfoItem
                label={t("appointmentMode")}
                value={identity.operation.appointmentMode}
                width="half"
                lang={lang}
                isRtl={isRtl}
              />
              <InfoItem
                label={t("office")}
                value={identity.operation.officeLabel || identity.operation.officeId}
                width="full"
                lang={lang}
                isRtl={isRtl}
              />
            </Section>
          </View>

          <View style={isRtl ? styles.summarySideRtl : styles.summarySide}>
            <View style={styles.qrCard}>
              <Text
                style={[
                  styles.qrTitle,
                  {
                    textAlign: isRtl ? "right" : "left",
                    fontFamily: getBoldFont(),
                  },
                ]}
              >
                {t("attachedReferenceQr")}
              </Text>

              <View style={styles.qrFrame}>
                {qrCodeDataUrl ? (
                  <Image src={qrCodeDataUrl} style={styles.qrImage} />
                ) : (
                  <View style={styles.qrFallback}>
                    <Text
                      style={{
                        fontSize: 9,
                        color: BRAND.muted,
                        fontFamily: getRegularFont(),
                      }}
                    >
                      {t("notAvailable")}
                    </Text>
                  </View>
                )}
              </View>

              <Text
                style={[
                  styles.qrRefLabel,
                  { fontFamily: getBoldFont() },
                ]}
              >
                {t("internalReference")}
              </Text>

              <RichText
                text={internalReference}
                documentLanguage={lang}
                isRtl={false}
                isBold={false}
                forceLtr={true}
                preserveTokens={true}
                textStyle={styles.qrRef}
              />
            </View>

            <Section title={t("companyInformation")} isRtl={isRtl}>
              <InfoItem
                label={t("fullName")}
                value={company.legalName || company.companyName}
                width="full"
                lang={lang}
                isRtl={isRtl}
              />
              <InfoItem
                label={t("phone")}
                value={company.phone}
                width="full"
                lang={lang}
                isRtl={isRtl}
                forceLtrValue={true}
              />
              <InfoItem
                label={t("email")}
                value={company.email}
                width="full"
                lang={lang}
                isRtl={isRtl}
                forceLtrValue={true}
              />
              <InfoItem
                label={t("website")}
                value={company.website}
                width="full"
                lang={lang}
                isRtl={isRtl}
                forceLtrValue={true}
              />
              <InfoItem
                label={t("address")}
                value={companyAddress}
                width="full"
                lang={lang}
                isRtl={isRtl}
              />
            </Section>
          </View>
        </View>

        <View style={styles.messageCard}>
          <View style={styles.sectionHead}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  textAlign: isRtl ? "right" : "left",
                  fontFamily: getBoldFont(),
                },
              ]}
            >
              {t("requestMessage")}
            </Text>
          </View>

          <View style={styles.messageBody}>
            <MultilineRichText
              text={normalizeMultilineText(identity.operation.message, lang)}
              documentLanguage={lang}
              isRtl={isRtl}
              isBold={false}
              textStyle={styles.messageLine}
            />
          </View>
        </View>

        <Section title={t("scheduleDetails")} isRtl={isRtl}>
          <InfoItem
            label={t("date")}
            value={formatDateOnly(identity.schedule.date, lang)}
            width="half"
            lang={lang}
            isRtl={isRtl}
          />
          <InfoItem
            label={t("timeWindow")}
            value={identity.schedule.timeLabel || timeWindow}
            width="half"
            lang={lang}
            isRtl={isRtl}
            forceLtrValue={true}
          />
          <InfoItem
            label={t("startTime")}
            value={identity.schedule.startTime}
            width="half"
            lang={lang}
            isRtl={isRtl}
            forceLtrValue={true}
          />
          <InfoItem
            label={t("endTime")}
            value={identity.schedule.endTime}
            width="half"
            lang={lang}
            isRtl={isRtl}
            forceLtrValue={true}
          />
        </Section>

        <View style={styles.footer}>
          <View style={isRtl ? styles.footerColsRtl : styles.footerCols}>
            <View style={styles.footerCol}>
              <Text
                style={[
                  styles.footerTitle,
                  {
                    textAlign: isRtl ? "right" : "left",
                    fontFamily: getBoldFont(),
                  },
                ]}
              >
                {t("companyInformation")}
              </Text>
              <FooterLine text={company.companyName} lang={lang} isRtl={isRtl} />
              {company.legalName ? (
                <FooterLine text={company.legalName} lang={lang} isRtl={isRtl} />
              ) : null}
              {company.phone ? (
                <FooterLine text={company.phone} lang={lang} isRtl={isRtl} forceLtr={true} />
              ) : null}
              {company.email ? (
                <FooterLine text={company.email} lang={lang} isRtl={isRtl} forceLtr={true} />
              ) : null}
              {company.website ? (
                <FooterLine text={company.website} lang={lang} isRtl={isRtl} forceLtr={true} />
              ) : null}
              {companyAddress ? (
                <FooterLine text={companyAddress} lang={lang} isRtl={isRtl} />
              ) : null}
            </View>

            <View style={styles.footerCol}>
              <Text
                style={[
                  styles.footerTitle,
                  {
                    textAlign: isRtl ? "right" : "left",
                    fontFamily: getBoldFont(),
                  },
                ]}
              >
                {t("legalInformation")}
              </Text>
              {company.taxNumber ? (
                <FooterLine
                  text={`${t("taxNumber")}: ${company.taxNumber}`}
                  lang={lang}
                  isRtl={isRtl}
                  forceLtr={true}
                />
              ) : null}
              {company.vatId ? (
                <FooterLine
                  text={`${t("vatId")}: ${company.vatId}`}
                  lang={lang}
                  isRtl={isRtl}
                  forceLtr={true}
                />
              ) : null}
              {company.registrationNumber ? (
                <FooterLine
                  text={`${t("registrationNumber")}: ${company.registrationNumber}`}
                  lang={lang}
                  isRtl={isRtl}
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
                  textAlign: isRtl ? "right" : "left",
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
                  textAlign: isRtl ? "right" : "left",
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
  isRtl,
}: {
  title: string;
  children: React.ReactNode;
  isRtl: boolean;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <Text
          style={[
            styles.sectionTitle,
            {
              textAlign: isRtl ? "right" : "left",
              fontFamily: getBoldFont(),
            },
          ]}
        >
          {title}
        </Text>
      </View>
      <View style={styles.sectionBody}>
        <View style={isRtl ? styles.twoColGridRtl : styles.twoColGrid}>
          {children}
        </View>
      </View>
    </View>
  );
}

function InfoItem({
  label,
  value,
  width,
  lang,
  isRtl,
  forceLtrValue = false,
}: {
  label: string;
  value?: string | null;
  width: "half" | "full";
  lang: SupportedLanguage;
  isRtl: boolean;
  forceLtrValue?: boolean;
}) {
  const resolvedValue = hasValue(value) ? String(value) : translations[lang].notAvailable;

  return (
    <View style={width === "half" ? styles.itemHalf : styles.itemFull}>
      <RichText
        text={label}
        documentLanguage={lang}
        isRtl={isRtl}
        isBold={false}
        textStyle={[
          styles.label,
          {
            textAlign: isRtl ? "right" : "left",
          },
        ]}
      />
      <RichText
        text={resolvedValue}
        documentLanguage={lang}
        isRtl={forceLtrValue ? false : isRtl}
        isBold={hasValue(value)}
        forceLtr={forceLtrValue}
        preserveTokens={forceLtrValue}
        textStyle={[
          styles.value,
          !hasValue(value) ? styles.valueMuted : {},
          {
            textAlign: forceLtrValue ? "left" : isRtl ? "right" : "left",
          },
        ]}
      />
    </View>
  );
}

function MetaItem({
  label,
  value,
  lang,
  isRtl,
}: {
  label: string;
  value?: string | null;
  lang: SupportedLanguage;
  isRtl: boolean;
}) {
  const resolvedValue = hasValue(value) ? String(value) : translations[lang].notAvailable;
  const forceLtr = shouldForceLtrMetaValue(resolvedValue);

  return (
    <View style={styles.gridItem}>
      <RichText
        text={label}
        documentLanguage={lang}
        isRtl={isRtl}
        isBold={false}
        textStyle={[
          styles.label,
          {
            textAlign: isRtl ? "right" : "left",
          },
        ]}
      />
      <RichText
        text={resolvedValue}
        documentLanguage={lang}
        isRtl={forceLtr ? false : isRtl}
        isBold={hasValue(value)}
        forceLtr={forceLtr}
        preserveTokens={forceLtr}
        textStyle={[
          styles.value,
          !hasValue(value) ? styles.valueMuted : {},
          {
            textAlign: forceLtr ? "left" : isRtl ? "right" : "left",
          },
        ]}
      />
    </View>
  );
}

function FooterLine({
  text,
  lang,
  isRtl,
  forceLtr = false,
}: {
  text: string;
  lang: SupportedLanguage;
  isRtl: boolean;
  forceLtr?: boolean;
}) {
  return (
    <RichText
      text={text}
      documentLanguage={lang}
      isRtl={forceLtr ? false : isRtl}
      isBold={false}
      forceLtr={forceLtr}
      preserveTokens={forceLtr}
      textStyle={[
        styles.footerText,
        {
          textAlign: forceLtr ? "left" : isRtl ? "right" : "left",
        },
      ]}
    />
  );
}

function RichText({
  text,
  documentLanguage,
  isRtl,
  isBold,
  textStyle,
  forceLtr = false,
  preserveTokens = false,
}: {
  text: string;
  documentLanguage: SupportedLanguage;
  isRtl: boolean;
  isBold: boolean;
  textStyle?: Style | Style[];
  forceLtr?: boolean;
  preserveTokens?: boolean;
}) {
  const prepared = prepareDirectionalText(String(text || ""), {
    documentLanguage,
    isRtl,
    forceLtr,
    preserveTokens,
  });

  return (
    <Text
      style={[
        textStyle || {},
        {
          fontFamily: isBold ? getBoldFont() : getRegularFont(),
        },
      ]}
    >
      {prepared}
    </Text>
  );
}

function MultilineRichText({
  text,
  documentLanguage,
  isRtl,
  isBold,
  textStyle,
}: {
  text: string;
  documentLanguage: SupportedLanguage;
  isRtl: boolean;
  isBold: boolean;
  textStyle?: Style | Style[];
}) {
  const normalizedLines = text.split("\n");

  return (
    <View>
      {normalizedLines.map((line, index) => {
        const preparedLine = prepareMessageLine(line, {
          documentLanguage,
          isRtl,
        });

        return (
          <RichText
            key={`${index}-${preparedLine}`}
            text={preparedLine || " "}
            documentLanguage={documentLanguage}
            isRtl={isRtl}
            isBold={isBold}
            preserveTokens={containsStructuredContent(preparedLine)}
            textStyle={[
              textStyle || {},
              {
                textAlign: isRtl ? "right" : "left",
              },
            ]}
          />
        );
      })}
    </View>
  );
}

function normalizeLanguage(value?: string): SupportedLanguage {
  if (value === "ar" || value === "de" || value === "en") {
    return value;
  }

  return "en";
}

function createTranslator(language: SupportedLanguage) {
  return function translate(key: TranslationKey): string {
    return translations[language][key] || translations.en[key] || key;
  };
}

function hasValue(value?: string | null): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function formatDateOnly(value?: string, language: SupportedLanguage = "en"): string {
  if (!hasValue(value)) {
    return translations[language].notAvailable;
  }

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  try {
    return new Intl.DateTimeFormat(mapLocale(language), {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch {
    return String(value);
  }
}

function formatDateTime(value?: string, language: SupportedLanguage = "en"): string {
  if (!hasValue(value)) {
    return translations[language].notAvailable;
  }

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    return String(value);
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
    return String(value);
  }
}

function buildTimeWindow(
  startTime?: string,
  endTime?: string,
  language: SupportedLanguage = "en"
): string {
  if (hasValue(startTime) && hasValue(endTime)) {
    return `${startTime} - ${endTime}`;
  }

  if (hasValue(startTime)) {
    return String(startTime);
  }

  if (hasValue(endTime)) {
    return String(endTime);
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
    .replace(/\t/g, "    ")
    .replace(/[ \u00A0]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function buildCompanyAddress(company: CompanyPdfProfile): string {
  const parts = [
    company.addressLine1,
    company.addressLine2,
    company.postalCode,
    company.city,
    company.country,
  ]
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean);

  return parts.join(", ");
}

function buildPdfTitle(
  identity: NormalizedOperationIdentity,
  customerNumber?: string
): string {
  const operationType = identity.kind === "appointment" ? "appointment" : "request";
  const operationNumber =
    identity.ids.appointmentId ||
    identity.ids.requestId ||
    identity.ids.referenceNumber ||
    "document";

  const cleanOperationNumber = sanitizeFilePart(operationNumber);
  const cleanCustomerNumber = sanitizeFilePart(customerNumber || identity.ids.customerId);

  return `${operationType}-${cleanCustomerNumber}-${cleanOperationNumber}`;
}

function sanitizeFilePart(value?: string): string {
  const clean = String(value || "")
    .trim()
    .replace(/[^A-Za-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return clean || "customer";
}

function mapLocale(language: SupportedLanguage): string {
  if (language === "ar") return "ar";
  if (language === "de") return "de-DE";
  return "en-US";
}

function getRegularFont(): string {
  if (hasRegisteredFamily(MAIN_FONT)) {
    return MAIN_FONT;
  }

  return "Helvetica";
}

function getBoldFont(): string {
  if (hasRegisteredFamily(MAIN_FONT_BOLD)) {
    return MAIN_FONT_BOLD;
  }

  return "Helvetica-Bold";
}

function hasRegisteredFamily(family: string): boolean {
  return registeredFamilies.has(family);
}

function registerFontIfExists(
  family: string,
  filePath: string,
  fontWeight?: number | string
) {
  if (!fs.existsSync(filePath) || registeredFamilies.has(family)) {
    return;
  }

  Font.register({
    family,
    src: filePath,
    fontWeight,
  });

  registeredFamilies.add(family);
}

function ensurePdfFontsRegistered() {
  if (fontsRegistered) {
    return;
  }

  Font.registerHyphenationCallback((word) => [word]);

  const fontsDir = path.join(process.cwd(), "public", "fonts");

  registerFontIfExists(MAIN_FONT, path.join(fontsDir, "Cairo-Regular.ttf"));
  registerFontIfExists(MAIN_FONT_BOLD, path.join(fontsDir, "Cairo-Bold.ttf"), 700);

  fontsRegistered = true;
}

function prepareDirectionalText(
  text: string,
  options: {
    documentLanguage: SupportedLanguage;
    isRtl: boolean;
    forceLtr: boolean;
    preserveTokens: boolean;
  }
): string {
  const raw = String(text || "");
  if (!raw) {
    return "";
  }

  const normalized = normalizeVisibleText(raw);

  if (options.forceLtr) {
    return wrapLtr(insertSoftBreaks(normalized));
  }

  if (!options.isRtl) {
    return options.preserveTokens ? insertSoftBreaks(normalized) : normalized;
  }

  if (!containsStructuredContent(normalized)) {
    return wrapRtl(normalized);
  }

  return wrapArabicMixedLine(normalized);
}

function prepareMessageLine(
  line: string,
  options: {
    documentLanguage: SupportedLanguage;
    isRtl: boolean;
  }
): string {
  const normalized = normalizeVisibleText(line);
  if (!normalized.trim()) {
    return " ";
  }

  if (!options.isRtl) {
    return normalized;
  }

  const match = normalized.match(/^([^:：]{1,80})\s*[:：]\s*(.+)$/);
  if (!match) {
    return containsStructuredContent(normalized)
      ? wrapArabicMixedLine(normalized)
      : wrapRtl(normalized);
  }

  const key = normalizeVisibleText(match[1]);
  const value = normalizeVisibleText(match[2]);

  if (!key || !value) {
    return containsStructuredContent(normalized)
      ? wrapArabicMixedLine(normalized)
      : wrapRtl(normalized);
  }

  const formattedValue = containsStructuredContent(value)
    ? wrapLtr(insertSoftBreaks(value))
    : wrapRtl(value);

  return `${wrapRtl(key)} ${wrapLtr(":")} ${formattedValue}`;
}

function wrapArabicMixedLine(value: string): string {
  const pattern =
    /(https?:\/\/[^\s]+|www\.[^\s]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?:\+?\d[\d\s\-()/:._]{2,}\d)|(?:[A-Za-z0-9][A-Za-z0-9/_:+#%&=?.,-]*[A-Za-z0-9]))/gi;

  let result = "";
  let lastIndex = 0;
  let match: RegExpExecArray | null = null;

  while ((match = pattern.exec(value)) !== null) {
    const start = match.index;
    const end = start + match[0].length;

    if (start > lastIndex) {
      result += wrapRtl(value.slice(lastIndex, start));
    }

    result += wrapLtr(insertSoftBreaks(match[0]));
    lastIndex = end;
  }

  if (lastIndex < value.length) {
    result += wrapRtl(value.slice(lastIndex));
  }

  return result || wrapRtl(value);
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

function shouldForceLtrMetaValue(value: string): boolean {
  return containsStructuredContent(value) || /^[A-Z]{2,}$/i.test(value);
}

function wrapLtr(value: string): string {
  return `\u200E${value}\u200E`;
}

function wrapRtl(value: string): string {
  return `\u200F${value}\u200F`;
}

function mergeViewStyles(...stylesToMerge: Array<Style | undefined>): Style[] {
  return stylesToMerge.filter(Boolean) as Style[];
}