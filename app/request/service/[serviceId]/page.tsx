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
        ? "تفاصيل الخدمة"
        : language === "de"
          ? "Servicedetails"
          : "Service Details",

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
        ? "ابدأ الطلب"
        : language === "de"
          ? "Anfrage starten"
          : "Start Request",

    introTitle:
      language === "ar"
        ? "قبل البدء"
        : language === "de"
          ? "Vor dem Start"
          : "Before You Start",

    defaultIntro:
      language === "ar"
        ? "هذه الصفحة تساعدك على فهم الخدمة قبل الانتقال إلى نموذج الطلب المخصص لها."
        : language === "de"
          ? "Diese Seite hilft dir, den Service zu verstehen, bevor du zum passenden Anfrageformular wechselst."
          : "This page helps you understand the service before moving to its dedicated request form.",
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
      maxWidth: "920px",
      margin: "14px auto 0",
    },

    card: {
      background: "#fffaf4",
      border: "1px solid #e3d4c2",
      borderRadius: "22px",
      padding: "20px 16px",
      boxShadow: "0 10px 28px rgba(96, 73, 46, 0.08)",
    },

    badge: {
      display: "inline-block",
      marginBottom: "10px",
      padding: "6px 12px",
      borderRadius: "999px",
      background: "#efe1cf",
      color: "#6d5338",
      fontSize: "12px",
      fontWeight: 700,
      border: "1px solid #ddc8af",
    },

    title: {
      margin: "0 0 10px",
      fontSize: "clamp(24px, 6vw, 34px)",
      fontWeight: 800,
      color: "#2f2419",
      lineHeight: 1.2,
      textAlign: isArabic ? "right" : "left",
    },

    description: {
      margin: "0 0 18px",
      fontSize: "14px",
      lineHeight: 1.8,
      color: "#5b4b3c",
      textAlign: isArabic ? "right" : "left",
    },

    infoBox: {
      marginTop: "14px",
      padding: "14px",
      borderRadius: "16px",
      border: "1px solid #eadbc9",
      background: "#fffdf9",
    },

    infoTitle: {
      margin: "0 0 8px",
      fontSize: "15px",
      lineHeight: 1.35,
      fontWeight: 800,
      color: "#33271d",
      textAlign: isArabic ? "right" : "left",
    },

    infoText: {
      margin: 0,
      fontSize: "13px",
      lineHeight: 1.75,
      color: "#645240",
      textAlign: isArabic ? "right" : "left",
    },

    guidanceList: {
      margin: "10px 0 0",
      paddingInlineStart: "18px",
      fontSize: "13px",
      lineHeight: 1.75,
      color: "#6b5846",
      textAlign: isArabic ? "right" : "left",
    },

    actionWrap: {
      marginTop: "18px",
      display: "flex",
      justifyContent: "stretch",
    },

    button: {
      width: "100%",
      minHeight: "48px",
      padding: "12px 16px",
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
          <div style={styles.card}>
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
        <div style={styles.card}>
          <div style={styles.badge}>{text.badge}</div>

          <h1 style={styles.title}>{localizedTitle}</h1>

          <p style={styles.description}>{localizedDescription}</p>

          <div style={styles.infoBox}>
            <h2 style={styles.infoTitle}>{text.introTitle}</h2>
            <p style={styles.infoText}>{localizedIntro}</p>

            {guidanceItems.length > 0 && (
              <ul style={styles.guidanceList}>
                {guidanceItems.map((item, index) => (
                  <li key={`${service.id}-guidance-${index}`}>{item}</li>
                ))}
              </ul>
            )}
          </div>

          <div style={styles.actionWrap}>
            <Link href={`/request/service/${service.id}/form`} style={styles.button}>
              {text.start}
            </Link>
          </div>
        </div>

        <CartPopup lang={language} />
      </div>
    </div>
  );
}