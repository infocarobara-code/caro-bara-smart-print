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

    introBadge:
      language === "ar"
        ? isOpenRequest
          ? "ابدأ من الفكرة"
          : "ابدأ من المعلومات المتوفرة"
        : language === "de"
          ? isOpenRequest
            ? "Starte mit der Idee"
            : "Starte mit den vorhandenen Angaben"
          : isOpenRequest
            ? "Start from the Idea"
            : "Start with What You Know",

    introTitle:
      language === "ar"
        ? isOpenRequest
          ? "لا تحتاج لمعرفة كل شيء من البداية"
          : "أدخل ما تعرفه فقط وسنرتب الباقي"
        : language === "de"
          ? isOpenRequest
            ? "Du musst nicht alles von Anfang an wissen"
            : "Gib einfach an, was du weißt – wir strukturieren den Rest"
          : isOpenRequest
            ? "You Do Not Need to Know Everything from the Start"
            : "Enter What You Know — We Will Structure the Rest",

    introText:
      language === "ar"
        ? isOpenRequest
          ? "اكتب ما تعرفه فقط عن مشروعك أو حاجتك، حتى لو كانت الفكرة ما تزال غير مرتبة بالكامل. هذا النموذج يساعدنا على فهم طلبك، كشف النواقص، ثم توجيهه إلى المسار الصحيح."
          : "هذا النموذج لا يشترط أن تكون كل التفاصيل جاهزة من البداية. أدخل المعلومات المتوفرة لديك حاليًا، وسنساعدك على تنظيم الطلب بشكل أوضح وأكثر قابلية للتنفيذ."
        : language === "de"
          ? isOpenRequest
            ? "Gib einfach das an, was du bereits über dein Projekt oder deinen Bedarf weißt – auch wenn die Idee noch nicht vollständig strukturiert ist. Dieses Formular hilft uns, deine Anfrage zu verstehen, Lücken zu erkennen und sie in den richtigen Weg zu leiten."
            : "Dieses Formular setzt nicht voraus, dass alle Details von Anfang an feststehen. Trage einfach die Informationen ein, die du bereits hast, und wir helfen dir dabei, die Anfrage klarer und umsetzbarer zu strukturieren."
          : isOpenRequest
            ? "Just enter what you already know about your project or need, even if the idea is still not fully structured. This form helps us understand your request, identify missing parts, and guide it into the right path."
            : "This form does not require every detail to be ready from the beginning. Simply enter the information you already have, and we will help structure the request more clearly and make it easier to execute.",

    noteTitle:
      language === "ar"
        ? "ملاحظة سريعة"
        : language === "de"
          ? "Kurzer Hinweis"
          : "Quick Note",

    noteText:
      language === "ar"
        ? "يمكنك إكمال الطلب خطوة خطوة، ثم مراجعته قبل إضافته إلى السلة أو متابعة الإرسال."
        : language === "de"
          ? "Du kannst die Anfrage Schritt für Schritt ausfüllen und sie anschließend prüfen, bevor du sie in den Warenkorb legst oder weiter sendest."
          : "You can complete the request step by step and review it before adding it to the cart or continuing to submit it.",
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
      display: "grid",
      gap: "16px",
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
      background: "#fffaf4",
      border: "1px solid #e3d4c2",
      borderRadius: "22px",
      padding: "18px 16px",
      boxShadow: "0 8px 22px rgba(96, 73, 46, 0.06)",
      textAlign: isArabic ? "right" : "left",
      display: "grid",
      gap: "10px",
    },

    introBadge: {
      display: "inline-block",
      width: "fit-content",
      padding: "6px 12px",
      borderRadius: "999px",
      background: "#efe1cf",
      color: "#6d5338",
      fontSize: "12px",
      fontWeight: 700,
      border: "1px solid #ddc8af",
    },

    introTitle: {
      margin: 0,
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
      textWrap: "pretty",
    },

    noteBox: {
      marginTop: "2px",
      padding: "10px 12px",
      borderRadius: "14px",
      border: "1px solid #e2d2bf",
      background: "#f7ede1",
      display: "grid",
      gap: "4px",
    },

    noteTitle: {
      margin: 0,
      fontSize: "12px",
      fontWeight: 800,
      color: "#5f4a37",
    },

    noteText: {
      margin: 0,
      fontSize: "12px",
      lineHeight: 1.7,
      color: "#735f4b",
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
        <div style={styles.introCard}>
          <div style={styles.introBadge}>{text.introBadge}</div>
          <h1 style={styles.introTitle}>{text.introTitle}</h1>
          <p style={styles.introText}>{text.introText}</p>

          <div style={styles.noteBox}>
            <p style={styles.noteTitle}>{text.noteTitle}</p>
            <p style={styles.noteText}>{text.noteText}</p>
          </div>
        </div>

        <ServiceForm service={service} lang={language} />
        <CartPopup lang={language} />
      </div>
    </div>
  );
}