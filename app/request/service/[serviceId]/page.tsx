"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { CSSProperties } from "react";
import Header from "@/components/Header";
import CartPopup from "@/components/CartPopup";
import { getServiceById } from "@/data/services/index";
import { useLanguage } from "@/lib/languageContext";

export default function ServicePage() {
  const params = useParams();
  const serviceId = String(params?.serviceId || "");

  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  const service = getServiceById(serviceId);

  const text = {
    badge:
      language === "ar"
        ? "نموذج الطلب"
        : language === "de"
          ? "Anfrageformular"
          : "Request Form",

    fallbackTitle:
      language === "ar"
        ? "الخدمة غير موجودة"
        : language === "de"
          ? "Service nicht gefunden"
          : "Service not found",

    fallbackDescription:
      language === "ar"
        ? "تعذر العثور على هذه الخدمة. يمكنك الرجوع واختيار خدمة أخرى."
        : language === "de"
          ? "Dieser Service wurde nicht gefunden. Bitte gehe zurück und wähle einen anderen Service."
          : "This service could not be found. Please go back and choose another service.",

    start:
      language === "ar"
        ? "ابدأ الطلب الآن"
        : language === "de"
          ? "Jetzt Anfrage starten"
          : "Start Request Now",

    summaryTitle:
      language === "ar"
        ? "ما الذي سنطلبه منك؟"
        : language === "de"
          ? "Was wir von dir brauchen"
          : "What We Need From You",

    defaultIntro:
      language === "ar"
        ? "سنأخذ منك المعلومات الأساسية التي تساعدنا على فهم الطلب بشكل صحيح، ثم يمكنك الانتقال إلى النموذج المخصص وإدخال التفاصيل."
        : language === "de"
          ? "Wir erfassen zuerst die wichtigsten Informationen, um deine Anfrage richtig zu verstehen. Danach kannst du zum passenden Formular wechseln und die Details eingeben."
          : "We first collect the essential information needed to understand your request properly, then you can continue to the dedicated form and enter the details.",

    quickStartTitle:
      language === "ar"
        ? "الخطوة التالية"
        : language === "de"
          ? "Nächster Schritt"
          : "Next Step",

    quickStartText:
      language === "ar"
        ? "بعد الدخول إلى النموذج ستتمكن من إدخال تفاصيل الطلب بدقة، ثم إضافته إلى السلة أو متابعة الإرسال."
        : language === "de"
          ? "Nach dem Öffnen des Formulars kannst du die Anfrage präzise eingeben und anschließend zum Warenkorb oder zum Versand weitergehen."
          : "After opening the form, you will be able to enter the request details accurately and then proceed to cart or submission.",
  };

  const localizedTitle =
    service?.title?.[language] ||
    service?.title?.en ||
    service?.title?.de ||
    service?.title?.ar ||
    serviceId;

  const localizedDescription =
    service?.description?.[language] ||
    service?.description?.en ||
    service?.description?.de ||
    service?.description?.ar ||
    "";

  const localizedIntro =
    service?.intro?.[language] ||
    service?.intro?.en ||
    service?.intro?.de ||
    service?.intro?.ar ||
    text.defaultIntro;

  const guidanceItems =
    service?.requestGuidance
      ?.map((item) => item[language] || item.en || item.de || item.ar || "")
      .filter(Boolean) || [];

  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f7f1e8 0%, #f2e9de 100%)",
      padding: "0 12px 72px",
      fontFamily: "Arial, sans-serif",
    },

    container: {
      maxWidth: "980px",
      margin: "14px auto 0",
    },

    heroCard: {
      background: "#fffaf4",
      border: "1px solid #e3d4c2",
      borderRadius: "26px",
      padding: "24px 18px",
      boxShadow: "0 10px 28px rgba(96, 73, 46, 0.08)",
    },

    badge: {
      display: "inline-block",
      marginBottom: "12px",
      padding: "7px 13px",
      borderRadius: "999px",
      background: "#efe1cf",
      color: "#6d5338",
      fontSize: "12px",
      fontWeight: 700,
      border: "1px solid #ddc8af",
    },

    title: {
      margin: "0 0 12px",
      fontSize: "clamp(28px, 6vw, 42px)",
      fontWeight: 800,
      color: "#2f2419",
      lineHeight: 1.2,
      textAlign: isArabic ? "right" : "left",
    },

    description: {
      margin: 0,
      fontSize: "15px",
      lineHeight: 1.9,
      color: "#5b4b3c",
      textAlign: isArabic ? "right" : "left",
    },

    sectionCard: {
      marginTop: "16px",
      background: "rgba(255,255,255,0.88)",
      border: "1px solid #e7d9c8",
      borderRadius: "22px",
      padding: "18px 16px",
      boxShadow: "0 6px 20px rgba(90, 70, 40, 0.06)",
    },

    sectionHeader: {
      marginBottom: "12px",
      paddingBottom: "12px",
      borderBottom: "1px solid #eadbc9",
    },

    sectionBadge: {
      display: "inline-block",
      marginBottom: "10px",
      padding: "6px 12px",
      borderRadius: "999px",
      background: "#f3e7d8",
      color: "#6b5238",
      fontSize: "12px",
      fontWeight: 700,
      border: "1px solid #dec8ae",
    },

    sectionTitle: {
      margin: "0 0 8px",
      fontSize: "18px",
      lineHeight: 1.35,
      fontWeight: 800,
      color: "#33271d",
      textAlign: isArabic ? "right" : "left",
    },

    sectionText: {
      margin: 0,
      fontSize: "14px",
      lineHeight: 1.8,
      color: "#645240",
      textAlign: isArabic ? "right" : "left",
    },

    guidanceList: {
      margin: "14px 0 0",
      paddingInlineStart: "20px",
      fontSize: "14px",
      lineHeight: 1.8,
      color: "#6b5846",
      textAlign: isArabic ? "right" : "left",
    },

    actionCard: {
      marginTop: "16px",
      background: "#fffaf4",
      border: "1px solid #e3d4c2",
      borderRadius: "22px",
      padding: "18px 16px",
      boxShadow: "0 8px 24px rgba(96, 73, 46, 0.06)",
    },

    actionTitle: {
      margin: "0 0 8px",
      fontSize: "17px",
      fontWeight: 800,
      color: "#2f2419",
      textAlign: isArabic ? "right" : "left",
    },

    actionText: {
      margin: "0 0 16px",
      fontSize: "14px",
      lineHeight: 1.8,
      color: "#5f4d3d",
      textAlign: isArabic ? "right" : "left",
    },

    button: {
      width: "100%",
      minHeight: "50px",
      padding: "12px 18px",
      borderRadius: "16px",
      border: "1px solid #241a12",
      background: "#1f1711",
      color: "#fff",
      fontSize: "14px",
      fontWeight: 800,
      textAlign: "center",
      textDecoration: "none",
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0 8px 18px rgba(34, 23, 16, 0.12)",
    },
  };

  if (!service) {
    return (
      <div dir={dir} style={styles.page}>
        <Header showBackButton showBackHome backHref="/request" />

        <div style={styles.container}>
          <div style={styles.heroCard}>
            <div style={styles.badge}>{text.badge}</div>
            <h1 style={styles.title}>{text.fallbackTitle}</h1>
            <p style={styles.description}>{text.fallbackDescription}</p>
          </div>

          <CartPopup lang={language} />
        </div>
      </div>
    );
  }

  return (
    <div dir={dir} style={styles.page}>
      <Header
        showBackButton
        showBackHome
        backHref={`/request/category/${service.category}`}
      />

      <div style={styles.container}>
        <div style={styles.heroCard}>
          <div style={styles.badge}>{text.badge}</div>
          <h1 style={styles.title}>{localizedTitle}</h1>
          <p style={styles.description}>{localizedDescription}</p>
        </div>

        <div style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionBadge}>{text.summaryTitle}</div>
            <h2 style={styles.sectionTitle}>{localizedTitle}</h2>
            <p style={styles.sectionText}>{localizedIntro}</p>
          </div>

          {guidanceItems.length > 0 && (
            <ul style={styles.guidanceList}>
              {guidanceItems.map((item, index) => (
                <li key={`${service.id}-guidance-${index}`}>{item}</li>
              ))}
            </ul>
          )}
        </div>

        <div style={styles.actionCard}>
          <h3 style={styles.actionTitle}>{text.quickStartTitle}</h3>
          <p style={styles.actionText}>{text.quickStartText}</p>

          <Link href={`/request/service/${service.id}/form`} style={styles.button}>
            {text.start}
          </Link>
        </div>

        <CartPopup lang={language} />
      </div>
    </div>
  );
}