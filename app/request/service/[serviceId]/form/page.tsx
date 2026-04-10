"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import type { CSSProperties } from "react";
import Header from "@/components/Header";
import CartPopup from "@/components/CartPopup";
import ServiceForm from "@/components/ServiceForm";
import { getServiceById } from "@/data/services/index";
import {
  getGuideById,
  getGuideSmartInternalLinks,
  getLocalizedGuideText,
} from "@/data/guides";
import { useLanguage } from "@/lib/languageContext";

export default function ServiceFormPage() {
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

    supportTitle:
      language === "ar"
        ? "معلومات مساعدة"
        : language === "de"
          ? "Hilfreiche Informationen"
          : "Helpful Information",

    supportText:
      language === "ar"
        ? "أبقينا كل ما هو إضافي في الأسفل حتى تبقى أولوية الصفحة للنموذج نفسه، مع الحفاظ على الروابط المفيدة والفهم الأوضح."
        : language === "de"
          ? "Alles Zusätzliche liegt bewusst unten, damit der Fokus auf dem Formular bleibt und trotzdem hilfreiche Links und mehr Klarheit verfügbar sind."
          : "Everything extra is intentionally placed below so the form stays the priority while useful links and clearer understanding remain available.",

    supportBlockOneTitle:
      language === "ar"
        ? "طلب أوضح"
        : language === "de"
          ? "Klarere Anfrage"
          : "Clearer Request",

    supportBlockOneText:
      language === "ar"
        ? "كلما أدخلت ما تعرفه بوضوح أكبر، أصبح تجهيز الطلب ومراجعته أسهل."
        : language === "de"
          ? "Je klarer du das einträgst, was du weißt, desto leichter wird die Anfrage vorbereitet und geprüft."
          : "The clearer you enter what you know, the easier the request becomes to prepare and review.",

    supportBlockTwoTitle:
      language === "ar"
        ? "رجوع منطقي"
        : language === "de"
          ? "Logischer Rückweg"
          : "Logical Return Path",

    supportBlockTwoText:
      language === "ar"
        ? "يمكنك الرجوع إلى صفحة الخدمة أو الفئة عند الحاجة بدون فقدان فهم المسار."
        : language === "de"
          ? "Du kannst bei Bedarf zur Leistungsseite oder Kategorie zurückkehren, ohne den Ablauf aus dem Blick zu verlieren."
          : "You can return to the service page or the category when needed without losing the flow.",

    supportBlockThreeTitle:
      language === "ar"
        ? "ربط داخلي هادئ"
        : language === "de"
          ? "Ruhige interne Verlinkung"
          : "Quiet Internal Linking",

    supportBlockThreeText:
      language === "ar"
        ? "الروابط الإضافية موجودة هنا بهدوء لدعم الفهم والانتقال دون منافسة النموذج."
        : language === "de"
          ? "Zusätzliche Links liegen hier ruhig, um Verständnis und Übergang zu unterstützen, ohne mit dem Formular zu konkurrieren."
          : "Additional links are placed here calmly to support understanding and navigation without competing with the form.",

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

    backToService:
      language === "ar"
        ? "العودة إلى الخدمة"
        : language === "de"
          ? "Zurück zur Leistung"
          : "Back to service",

    backToCategory:
      language === "ar"
        ? "العودة إلى الفئة"
        : language === "de"
          ? "Zurück zur Kategorie"
          : "Back to category",

    noLinks:
      language === "ar"
        ? "لا توجد روابط إضافية حالياً."
        : language === "de"
          ? "Derzeit keine zusätzlichen Links."
          : "No additional links at the moment.",

    linksTitle:
      language === "ar"
        ? "روابط مرتبطة"
        : language === "de"
          ? "Verwandte Links"
          : "Related Links",
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
      padding: "16px 16px",
      boxShadow: "0 8px 22px rgba(96, 73, 46, 0.06)",
      textAlign: isArabic ? "right" : "left",
      display: "grid",
      gap: "6px",
    },

    introTitle: {
      margin: 0,
      fontSize: "clamp(24px, 5vw, 34px)",
      lineHeight: 1.15,
      fontWeight: 800,
      color: "#2f2419",
      textWrap: "balance",
    },

    lowerSection: {
      background: "rgba(255,255,255,0.88)",
      border: "1px solid #e7d9c8",
      borderRadius: "22px",
      padding: "18px 16px",
      boxShadow: "0 6px 20px rgba(90, 70, 40, 0.06)",
      display: "grid",
      gap: "14px",
    },

    lowerTitle: {
      margin: 0,
      fontSize: "18px",
      lineHeight: 1.3,
      color: "#2f2419",
      fontWeight: 800,
      textAlign: isArabic ? "right" : "left",
    },

    lowerText: {
      margin: 0,
      fontSize: "13px",
      lineHeight: 1.8,
      color: "#665240",
      textAlign: isArabic ? "right" : "left",
      maxWidth: "840px",
    },

    noteBox: {
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
      textAlign: isArabic ? "right" : "left",
    },

    noteText: {
      margin: 0,
      fontSize: "12px",
      lineHeight: 1.7,
      color: "#735f4b",
      textAlign: isArabic ? "right" : "left",
    },

    lowerGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "12px",
    },

    lowerItem: {
      background: "#fffaf4",
      border: "1px solid #ead9c6",
      borderRadius: "18px",
      padding: "14px",
      display: "grid",
      gap: "8px",
    },

    lowerItemTitle: {
      margin: 0,
      fontSize: "14px",
      lineHeight: 1.45,
      color: "#2f2419",
      fontWeight: 800,
      textAlign: isArabic ? "right" : "left",
    },

    lowerItemText: {
      margin: 0,
      fontSize: "13px",
      lineHeight: 1.75,
      color: "#6b5846",
      textAlign: isArabic ? "right" : "left",
    },

    lowerLinksBlock: {
      background: "#fffaf4",
      border: "1px solid #ead9c6",
      borderRadius: "18px",
      padding: "14px",
      display: "grid",
      gap: "10px",
    },

    lowerLinksTitle: {
      margin: 0,
      fontSize: "14px",
      lineHeight: 1.4,
      color: "#2f2419",
      fontWeight: 800,
      textAlign: isArabic ? "right" : "left",
    },

    lowerLinksWrap: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      justifyContent: isArabic ? "flex-end" : "flex-start",
    },

    lowerTextLink: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "34px",
      padding: "0 12px",
      borderRadius: "999px",
      border: "1px solid #d9c6b2",
      background: "#fff",
      color: "#5d4936",
      fontSize: "12px",
      fontWeight: 700,
      lineHeight: 1.6,
      textDecoration: "none",
      textAlign: isArabic ? "right" : "left",
      transition: "background 0.18s ease, border-color 0.18s ease",
    },

    emptyLinksText: {
      margin: 0,
      fontSize: "13px",
      lineHeight: 1.75,
      color: "#6b5846",
      textAlign: isArabic ? "right" : "left",
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

        <section style={styles.lowerSection}>
          <h2 style={styles.lowerTitle}>{text.supportTitle}</h2>
          <p style={styles.lowerText}>{text.supportText}</p>

          <div style={styles.noteBox}>
            <p style={styles.noteTitle}>{text.noteTitle}</p>
            <p style={styles.noteText}>{text.noteText}</p>
          </div>

          <div style={styles.lowerGrid}>
            <div style={styles.lowerItem}>
              <h3 style={styles.lowerItemTitle}>{text.supportBlockOneTitle}</h3>
              <p style={styles.lowerItemText}>{text.supportBlockOneText}</p>
            </div>

            <div style={styles.lowerItem}>
              <h3 style={styles.lowerItemTitle}>{text.supportBlockTwoTitle}</h3>
              <p style={styles.lowerItemText}>{text.supportBlockTwoText}</p>
            </div>

            <div style={styles.lowerItem}>
              <h3 style={styles.lowerItemTitle}>{text.supportBlockThreeTitle}</h3>
              <p style={styles.lowerItemText}>{text.supportBlockThreeText}</p>
            </div>
          </div>

          <div style={styles.lowerLinksBlock}>
            <h3 style={styles.lowerLinksTitle}>
              {text.linksTitle} —{" "}
              {guide
                ? getLocalizedGuideText(guide.title, language, localizedServiceTitle)
                : localizedServiceTitle}
            </h3>

            <div style={styles.lowerLinksWrap}>
              <Link
                href={`/request/service/${service.id}`}
                style={styles.lowerTextLink}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fbf3e8";
                  e.currentTarget.style.borderColor = "#ccb498";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.borderColor = "#d9c6b2";
                }}
              >
                {text.backToService}
              </Link>

              <Link
                href={service.category ? `/request/category/${service.category}` : "/request"}
                style={styles.lowerTextLink}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fbf3e8";
                  e.currentTarget.style.borderColor = "#ccb498";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.borderColor = "#d9c6b2";
                }}
              >
                {text.backToCategory}
              </Link>

              {quietLinks.map((item, index) => (
                <Link
                  key={`${item.href}-${index}`}
                  href={item.href}
                  style={styles.lowerTextLink}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fbf3e8";
                    e.currentTarget.style.borderColor = "#ccb498";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.borderColor = "#d9c6b2";
                  }}
                >
                  {getLocalizedGuideText(item.label, language, item.href)}
                </Link>
              ))}
            </div>

            {quietLinks.length === 0 ? (
              <p style={styles.emptyLinksText}>{text.noLinks}</p>
            ) : null}
          </div>
        </section>

        <CartPopup lang={language} />
      </div>
    </div>
  );
}
