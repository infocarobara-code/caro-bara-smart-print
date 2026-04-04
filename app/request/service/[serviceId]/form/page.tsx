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
  const isOpenRequest = service?.id === "open-request";

  const text = {
    fallbackTitle:
      language === "ar"
        ? "الخدمة غير موجودة"
        : language === "de"
          ? "Service nicht gefunden"
          : "Service not found",

    fallbackDescription:
      language === "ar"
        ? "تعذر العثور على هذه الخدمة."
        : language === "de"
          ? "Dieser Service wurde nicht gefunden."
          : "This service could not be found.",

    formIntroBadge:
      language === "ar"
        ? "ابدأ من الفكرة"
        : language === "de"
          ? "Starte mit der Idee"
          : "Start from the Idea",

    formIntroTitle:
      language === "ar"
        ? "لا تحتاج لمعرفة كل شيء من البداية"
        : language === "de"
          ? "Du musst nicht alles von Anfang an wissen"
          : "You Do Not Need to Know Everything from the Start",

    formIntroText:
      language === "ar"
        ? "اكتب ما تعرفه فقط عن مشروعك أو حاجتك، حتى لو كانت الفكرة ما تزال غير مرتبة بالكامل. هذا النموذج يساعدنا على فهم طلبك، كشف النواقص، ثم توجيهه إلى المسار الصحيح."
        : language === "de"
          ? "Gib einfach das an, was du bereits über dein Projekt oder deinen Bedarf weißt – auch wenn die Idee noch nicht vollständig strukturiert ist. Dieses Formular hilft uns, deine Anfrage zu verstehen, Lücken zu erkennen und sie in den richtigen Weg zu leiten."
          : "Just enter what you already know about your project or need, even if the idea is still not fully structured. This form helps us understand your request, identify missing parts, and guide it into the right path.",
  };

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

    fallbackCard: {
      background: "#fffaf4",
      border: "1px solid #e3d4c2",
      borderRadius: "22px",
      padding: "20px 16px",
      boxShadow: "0 8px 22px rgba(96, 73, 46, 0.06)",
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

    introCard: {
      marginBottom: "16px",
      background: "#fffaf4",
      border: "1px solid #e3d4c2",
      borderRadius: "22px",
      padding: "18px 16px",
      boxShadow: "0 8px 22px rgba(96, 73, 46, 0.06)",
      textAlign: isArabic ? "right" : "left",
    },

    introBadge: {
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

    introTitle: {
      margin: "0 0 8px",
      fontSize: "18px",
      lineHeight: 1.35,
      fontWeight: 800,
      color: "#2f2419",
    },

    introText: {
      margin: 0,
      fontSize: "14px",
      lineHeight: 1.8,
      color: "#5b4b3c",
    },
  };

  if (!service) {
    return (
      <div dir={dir} style={styles.page}>
        <Header showBackButton showBackHome backHref="/request" />

        <div style={styles.container}>
          <div style={styles.fallbackCard}>
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
        {isOpenRequest && (
          <div style={styles.introCard}>
            <div style={styles.introBadge}>{text.formIntroBadge}</div>
            <h1 style={styles.introTitle}>{text.formIntroTitle}</h1>
            <p style={styles.introText}>{text.formIntroText}</p>
          </div>
        )}

        <ServiceForm service={service} lang={language} />
        <CartPopup lang={language} />
      </div>
    </div>
  );
}