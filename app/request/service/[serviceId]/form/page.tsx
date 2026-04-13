"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
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

  const localizedServiceTitle =
    service?.title?.[language] ||
    service?.title?.en ||
    service?.title?.de ||
    service?.title?.ar ||
    serviceId;

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
  };

  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: "100vh",
      background:
        "linear-gradient(180deg, rgba(239, 234, 226, 0.72) 0%, rgba(239, 234, 226, 0.92) 100%)",
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
      background: "#f0f2f5",
      border: "1px solid #d1d7db",
      borderRadius: "22px",
      padding: "20px 16px",
      boxShadow: "0 2px 10px rgba(17, 27, 33, 0.04)",
    },

    fallbackTitle: {
      margin: "0 0 10px",
      fontSize: "clamp(24px, 6vw, 34px)",
      fontWeight: 800,
      color: "#111b21",
      lineHeight: 1.2,
      textAlign: isArabic ? "right" : "left",
    },

    fallbackDescription: {
      margin: 0,
      fontSize: "14px",
      lineHeight: 1.8,
      color: "#667781",
      textAlign: isArabic ? "right" : "left",
    },

    introCard: {
      background: "#f0f2f5",
      border: "1px solid #d1d7db",
      borderRadius: "22px",
      padding: "16px 16px",
      boxShadow: "0 2px 10px rgba(17, 27, 33, 0.04)",
      textAlign: isArabic ? "right" : "left",
      display: "grid",
      gap: "6px",
    },

    introTitle: {
      margin: 0,
      fontSize: "clamp(24px, 5vw, 34px)",
      lineHeight: 1.15,
      fontWeight: 800,
      color: "#111b21",
      textWrap: "balance",
      wordBreak: "break-word",
      overflowWrap: "anywhere",
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
          <h1 style={styles.introTitle}>{localizedServiceTitle}</h1>
        </div>

        <ServiceForm service={service} lang={language} />

        <CartPopup lang={language} />
      </div>
    </div>
  );
}