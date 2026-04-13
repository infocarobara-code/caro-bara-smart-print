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

  const localizedGuideSummary =
    getLocalizedGuideText(guide?.summary, language, "") ||
    getLocalizedGuideText(guide?.title, language, "");

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
      background:
        "linear-gradient(180deg, rgba(239, 234, 226, 0.72) 0%, rgba(239, 234, 226, 0.92) 100%)",
      padding: "0 12px 72px",
      fontFamily: "Arial, sans-serif",
    },

    container: {
      maxWidth: "1000px",
      margin: "14px auto",
      display: "grid",
      gap: "16px",
    },

    hero: {
      background: "#f0f2f5",
      border: "1px solid #d1d7db",
      borderRadius: "24px",
      padding: "24px",
      display: "grid",
      gap: "12px",
      textAlign: isArabic ? "right" : "left",
      boxShadow: "0 2px 10px rgba(17, 27, 33, 0.04)",
    },

    title: {
      margin: 0,
      fontSize: "clamp(26px,5vw,40px)",
      fontWeight: 800,
      color: "#111b21",
      lineHeight: 1.08,
      letterSpacing: "-0.02em",
      wordBreak: "break-word",
    },

    description: {
      margin: 0,
      fontSize: "14px",
      color: "#667781",
      lineHeight: 1.8,
      maxWidth: "760px",
      wordBreak: "break-word",
      overflowWrap: "anywhere",
    },

    buttonRow: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      justifyContent: isArabic ? "flex-start" : "flex-start",
      alignItems: "center",
      paddingTop: "2px",
    },

    button: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "44px",
      padding: "0 18px",
      borderRadius: "999px",
      background: "#25d366",
      border: "1px solid #25d366",
      color: "#ffffff",
      textDecoration: "none",
      fontWeight: 800,
      width: "fit-content",
      boxShadow: "0 8px 18px rgba(37, 211, 102, 0.18)",
      transition:
        "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease",
    },

    lower: {
      background: "#f0f2f5",
      borderRadius: "20px",
      padding: "16px",
      border: "1px solid #d1d7db",
      boxShadow: "0 2px 10px rgba(17, 27, 33, 0.04)",
      display: "grid",
      gap: "12px",
    },

    lowerTitle: {
      margin: 0,
      fontSize: "16px",
      lineHeight: 1.35,
      fontWeight: 800,
      color: "#111b21",
      textAlign: isArabic ? "right" : "left",
    },

    helperText: {
      margin: 0,
      fontSize: "13px",
      lineHeight: 1.8,
      color: "#667781",
      textAlign: isArabic ? "right" : "left",
      wordBreak: "break-word",
      overflowWrap: "anywhere",
    },

    links: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
    },

    link: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "36px",
      padding: "0 12px",
      borderRadius: "999px",
      border: "1px solid #d1d7db",
      background: "#ffffff",
      textDecoration: "none",
      fontSize: "12px",
      fontWeight: 700,
      color: "#111b21",
      boxShadow: "0 1px 2px rgba(17, 27, 33, 0.03)",
      transition:
        "transform 0.18s ease, border-color 0.18s ease, background 0.18s ease, color 0.18s ease",
    },
  };

  if (!service) {
    return null;
  }

  return (
    <div dir={dir} style={styles.page}>
      <Header showBackButton showBackHome backHref="/request" />

      <div style={styles.container}>
        <div style={styles.hero}>
          <h1 style={styles.title}>{localizedServiceTitle}</h1>
          <p style={styles.description}>{localizedDescription}</p>

          <div style={styles.buttonRow}>
            <Link
              href={`/request/service/${service.id}/form`}
              style={styles.button}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 22px rgba(37, 211, 102, 0.22)";
                e.currentTarget.style.background = "#1fbe5a";
                e.currentTarget.style.borderColor = "#1fbe5a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 18px rgba(37, 211, 102, 0.18)";
                e.currentTarget.style.background = "#25d366";
                e.currentTarget.style.borderColor = "#25d366";
              }}
            >
              {text.startRequest}
            </Link>
          </div>
        </div>

        <div style={styles.lower}>
          <h3 style={styles.lowerTitle}>{text.supportTitle}</h3>

          {localizedGuideSummary ? (
            <p style={styles.helperText}>{localizedGuideSummary}</p>
          ) : null}

          <div style={styles.links}>
            <Link
              href={`/request/category/${service.category}`}
              style={styles.link}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.borderColor = "rgba(0, 168, 132, 0.18)";
                e.currentTarget.style.background = "rgba(217, 253, 211, 0.48)";
                e.currentTarget.style.color = "#00a884";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#d1d7db";
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.color = "#111b21";
              }}
            >
              {text.backToCategory}
            </Link>

            {quietLinks.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                style={styles.link}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.borderColor = "rgba(0, 168, 132, 0.18)";
                  e.currentTarget.style.background = "rgba(217, 253, 211, 0.48)";
                  e.currentTarget.style.color = "#00a884";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#d1d7db";
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.color = "#111b21";
                }}
              >
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