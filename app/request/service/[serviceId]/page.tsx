"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import type { CSSProperties } from "react";
import Header from "@/components/Header";
import CartPopup from "@/components/CartPopup";
import { getServiceById } from "@/data/services";
import {
  getGuideById,
  getGuideSmartInternalLinks,
  getLocalizedGuideText,
} from "@/data/guides";
import { useLanguage } from "@/lib/languageContext";

export default function ServicePage() {
  const params = useParams();
  const serviceId = String(params?.serviceId || "");

  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  const service = getServiceById(serviceId);

  const guide = useMemo(() => {
    if (!service?.category) return null;
    return getGuideById(service.category);
  }, [service?.category]);

  const quietLinks = useMemo(() => {
    if (!service?.category) return [];
    return getGuideSmartInternalLinks(service.category, {
      limit: 6,
      prioritizeGuides: true,
    });
  }, [service?.category]);

  const localizedServiceTitle =
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

  const text = {
    startRequest:
      language === "ar"
        ? "ابدأ الطلب الآن"
        : language === "de"
          ? "Jetzt Anfrage starten"
          : "Start Request",

    supportTitle:
      language === "ar"
        ? "معلومات إضافية"
        : language === "de"
          ? "Zusätzliche Informationen"
          : "Additional Information",

    backToCategory:
      language === "ar"
        ? "العودة للفئة"
        : language === "de"
          ? "Zurück zur Kategorie"
          : "Back to category",
  };

  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: "100vh",
      background: "#f7f1e8",
      padding: "0 12px 72px",
      fontFamily: "Arial",
    },

    container: {
      maxWidth: "1000px",
      margin: "14px auto",
      display: "grid",
      gap: "16px",
    },

    hero: {
      background: "#fffaf4",
      border: "1px solid #e3d4c2",
      borderRadius: "20px",
      padding: "24px",
      display: "grid",
      gap: "10px",
      textAlign: isArabic ? "right" : "left",
    },

    title: {
      margin: 0,
      fontSize: "clamp(26px,5vw,40px)",
      fontWeight: 800,
      color: "#2f2419",
    },

    description: {
      margin: 0,
      fontSize: "14px",
      color: "#5b4b3c",
      lineHeight: 1.8,
    },

    button: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "44px",
      padding: "0 18px",
      borderRadius: "14px",
      background: "#2f2419",
      color: "#fff",
      textDecoration: "none",
      fontWeight: 800,
      width: "fit-content",
    },

    lower: {
      background: "#fff",
      borderRadius: "18px",
      padding: "16px",
      border: "1px solid #e7d9c8",
    },

    links: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
    },

    link: {
      padding: "6px 12px",
      borderRadius: "999px",
      border: "1px solid #d9c6b2",
      textDecoration: "none",
      fontSize: "12px",
      color: "#3f3125",
    },
  };

  if (!service) {
    return null;
  }

  return (
    <div dir={dir} style={styles.page}>
      <Header showBackButton showBackHome backHref="/request" />

      <div style={styles.container}>
        {/* HERO بدون صور نهائياً */}
        <div style={styles.hero}>
          <h1 style={styles.title}>{localizedServiceTitle}</h1>
          <p style={styles.description}>{localizedDescription}</p>

          <Link
            href={`/request/service/${service.id}/form`}
            style={styles.button}
          >
            {text.startRequest}
          </Link>
        </div>

        {/* روابط هادئة */}
        <div style={styles.lower}>
          <h3>{text.supportTitle}</h3>

          <div style={styles.links}>
            <Link
              href={`/request/category/${service.category}`}
              style={styles.link}
            >
              {text.backToCategory}
            </Link>

            {quietLinks.map((item, index) => (
              <Link key={index} href={item.href} style={styles.link}>
                {getLocalizedGuideText(item.label, language, item.href)}
              </Link>
            ))}
          </div>
        </div>

        <CartPopup lang={language} />
      </div>
    </div>
  );
}