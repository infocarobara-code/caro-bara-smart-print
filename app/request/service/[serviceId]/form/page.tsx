"use client";

import { useParams } from "next/navigation";
import type { CSSProperties } from "react";
import Header from "@/components/Header";
import CartPopup from "@/components/CartPopup";
import ServiceForm from "@/components/ServiceForm";
import { getServiceById } from "@/data/services/index";
import { useLanguage } from "@/lib/languageContext";

export default function ServiceFormPage() {
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

    intro:
      language === "ar"
        ? "املأ الحقول الأساسية بدقة. بعد الإضافة إلى السلة يمكنك متابعة طلبات أخرى أو الانتقال إلى المراجعة والإرسال."
        : language === "de"
          ? "Fülle die wichtigsten Felder möglichst genau aus. Nach dem Hinzufügen zum Warenkorb kannst du weitere Anfragen erfassen oder zur Prüfung und zum Versand wechseln."
          : "Fill in the key fields as accurately as possible. After adding to the cart, you can continue with more requests or move to review and submission.",

    currentStep:
      language === "ar"
        ? "الخطوة الحالية"
        : language === "de"
          ? "Aktueller Schritt"
          : "Current Step",

    currentStepValue:
      language === "ar"
        ? "إدخال تفاصيل الطلب"
        : language === "de"
          ? "Anfragedetails eingeben"
          : "Enter Request Details",
  };

  const localizedTitle =
    service?.title?.[language] ||
    service?.title?.en ||
    service?.title?.de ||
    service?.title?.ar ||
    serviceId;

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

    hero: {
      background: "linear-gradient(135deg, #fffaf4 0%, #f8efe3 100%)",
      border: "1px solid #e3d4c2",
      borderRadius: "22px",
      padding: "20px 16px 18px",
      boxShadow: "0 10px 28px rgba(96, 73, 46, 0.08)",
      marginBottom: "14px",
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
      margin: "0 0 8px",
      fontSize: "clamp(24px, 6vw, 34px)",
      lineHeight: 1.2,
      color: "#2f2419",
      fontWeight: 800,
      textAlign: isArabic ? "right" : "left",
    },

    description: {
      margin: 0,
      color: "#5b4b3c",
      lineHeight: 1.75,
      fontSize: "14px",
      textAlign: isArabic ? "right" : "left",
    },

    stepBox: {
      marginTop: "14px",
      padding: "12px 13px",
      borderRadius: "14px",
      border: "1px solid #eadbc9",
      background: "#fffdf9",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },

    stepLabel: {
      fontSize: "11px",
      fontWeight: 700,
      color: "#8b7156",
      textAlign: isArabic ? "right" : "left",
    },

    stepValue: {
      fontSize: "14px",
      lineHeight: 1.5,
      fontWeight: 700,
      color: "#2f2419",
      textAlign: isArabic ? "right" : "left",
    },

    fallbackCard: {
      background: "#fffaf4",
      border: "1px solid #e3d4c2",
      borderRadius: "22px",
      padding: "20px 16px",
      boxShadow: "0 10px 28px rgba(96, 73, 46, 0.08)",
    },

    fallbackTitle: {
      margin: "0 0 10px",
      fontSize: "clamp(24px, 6vw, 34px)",
      fontWeight: 800,
      color: "#2f2419",
      lineHeight: 1.2,
      textAlign: isArabic ? "right" : "left",
    },

    fallbackDescription: {
      margin: 0,
      fontSize: "14px",
      lineHeight: 1.8,
      color: "#5b4b3c",
      textAlign: isArabic ? "right" : "left",
    },
  };

  if (!service) {
    return (
      <div dir={dir} style={styles.page}>
        <Header showBackButton showBackHome backHref="/request" />

        <div style={styles.container}>
          <div style={styles.fallbackCard}>
            <div style={styles.badge}>{text.badge}</div>
            <h1 style={styles.fallbackTitle}>{text.fallbackTitle}</h1>
            <p style={styles.fallbackDescription}>{text.fallbackDescription}</p>
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
        backHref={`/request/service/${service.id}`}
      />

      <div style={styles.container}>
        <section style={styles.hero}>
          <div style={styles.badge}>{text.badge}</div>
          <h1 style={styles.title}>{localizedTitle}</h1>
          <p style={styles.description}>{text.intro}</p>

          <div style={styles.stepBox}>
            <div style={styles.stepLabel}>{text.currentStep}</div>
            <div style={styles.stepValue}>{text.currentStepValue}</div>
          </div>
        </section>

        <ServiceForm service={service} lang={language} />

        <CartPopup lang={language} />
      </div>
    </div>
  );
}