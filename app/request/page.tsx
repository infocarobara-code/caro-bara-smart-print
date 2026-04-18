"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useMemo } from "react";
import { categories } from "@/data/categories";
import { getServicesByCategory } from "@/data/services";
import CartPopup from "@/components/CartPopup";
import { useLanguage } from "@/lib/languageContext";
import Header from "@/components/Header";

export default function RequestPage() {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  const text = {
    title:
      language === "ar"
        ? "اختر الفئة"
        : language === "de"
          ? "Wähle die Kategorie"
          : "Choose a Category",

    openCategory:
      language === "ar"
        ? "دخول"
        : language === "de"
          ? "Öffnen"
          : "Open",

    openRequestTitle:
      language === "ar"
        ? "طلب مفتوح"
        : language === "de"
          ? "Offene Anfrage"
          : "Open Request",

    openRequestText:
      language === "ar"
        ? "إذا لم تكن متأكدًا من الفئة أو الخدمة المناسبة، ابدأ من هنا."
        : language === "de"
          ? "Wenn du dir bei Kategorie oder Leistung noch nicht sicher bist, beginne hier."
          : "If you are not sure which category or service fits, start here.",

    openRequestButton:
      language === "ar"
        ? "ابدأ الطلب"
        : language === "de"
          ? "Anfrage starten"
          : "Start Request",

    backHome:
      language === "ar"
        ? "الرئيسية"
        : language === "de"
          ? "Startseite"
          : "Home",
  };

  const visibleCategories = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      serviceCount: getServicesByCategory(category.id).length,
    }));
  }, []);

  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: "100vh",
      background: "#ffffff",
      padding: "0 12px 72px",
      fontFamily: "Arial, sans-serif",
    },

    container: {
      maxWidth: "1240px",
      margin: "14px auto 0",
      display: "grid",
      gap: "18px",
    },

    hero: {
      padding: "10px 4px 2px",
      textAlign: "center",
    },

    title: {
      margin: 0,
      fontSize: "clamp(24px, 4.4vw, 42px)",
      lineHeight: 1.08,
      color: "var(--wa-text-primary)",
      fontWeight: 800,
      letterSpacing: "-0.02em",
      textWrap: "balance",
    },

    categoriesSection: {
      display: "grid",
      gap: "14px",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "14px",
    },

    card: {
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
      overflow: "hidden",
      borderRadius: "24px",
      border: "1px solid var(--wa-border)",
      background: "#ffffff",
      textDecoration: "none",
      color: "var(--wa-text-primary)",
      boxShadow: "0 6px 18px rgba(24, 119, 242, 0.06)",
      transition:
        "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, background 0.18s ease",
    },

    imageWrap: {
      position: "relative",
      height: "240px",
      overflow: "hidden",
      backgroundColor: "#ffffff",
    },

    imageArea: {
      position: "absolute",
      inset: 0,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      transform: "scale(1)",
      transition: "transform 0.35s ease",
    },

    imageOverlay: {
      position: "absolute",
      inset: 0,
      background: "rgba(0, 0, 0, 0.34)",
    },

    imageTitleWrap: {
      position: "absolute",
      left: "16px",
      right: "16px",
      bottom: "16px",
      zIndex: 2,
      display: "grid",
      gap: "6px",
    },

    imageTitle: {
      margin: 0,
      fontSize: "20px",
      lineHeight: 1.2,
      fontWeight: 800,
      color: "#ffffff",
      textAlign: isArabic ? "right" : "left",
      textShadow: "0 3px 10px rgba(0,0,0,0.22)",
      textWrap: "balance",
    },

    cardFooter: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      padding: "14px 16px",
      borderTop: "1px solid var(--wa-border)",
      background: "#ffffff",
    },

    statusText: {
      margin: 0,
      fontSize: "12px",
      lineHeight: 1.4,
      color: "var(--wa-text-secondary)",
      fontWeight: 700,
      textAlign: isArabic ? "right" : "left",
    },

    openPill: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "34px",
      padding: "0 14px",
      borderRadius: "999px",
      border: "1px solid var(--wa-green-primary)",
      background: "var(--wa-green-primary)",
      color: "#ffffff",
      fontSize: "12px",
      fontWeight: 800,
      flexShrink: 0,
      boxShadow: "0 8px 18px rgba(24, 119, 242, 0.18)",
    },

    lowerPanel: {
      marginTop: "6px",
      background: "#ffffff",
      border: "1px solid var(--wa-border)",
      borderRadius: "22px",
      padding: "18px 16px",
      boxShadow: "0 8px 22px rgba(24, 119, 242, 0.06)",
      display: "grid",
      gap: "12px",
    },

    lowerTitle: {
      margin: 0,
      fontSize: "18px",
      lineHeight: 1.3,
      fontWeight: 800,
      color: "var(--wa-text-primary)",
      textAlign: isArabic ? "right" : "left",
    },

    lowerText: {
      margin: 0,
      fontSize: "13px",
      lineHeight: 1.8,
      color: "var(--wa-text-secondary)",
      textAlign: isArabic ? "right" : "left",
      maxWidth: "760px",
    },

    lowerActions: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      justifyContent: isArabic ? "flex-start" : "flex-end",
    },

    primaryButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "42px",
      padding: "0 18px",
      borderRadius: "999px",
      border: "1px solid var(--wa-green-primary)",
      background: "var(--wa-green-primary)",
      color: "#ffffff",
      textDecoration: "none",
      fontSize: "13px",
      fontWeight: 800,
      transition:
        "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease",
      boxShadow: "0 8px 18px rgba(24, 119, 242, 0.18)",
    },

    secondaryButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "42px",
      padding: "0 18px",
      borderRadius: "999px",
      border: "1px solid var(--wa-green-primary)",
      background: "var(--wa-green-primary)",
      color: "#ffffff",
      textDecoration: "none",
      fontSize: "13px",
      fontWeight: 800,
      transition:
        "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease",
      boxShadow: "0 8px 18px rgba(24, 119, 242, 0.18)",
    },
  };

  return (
    <div dir={dir} style={styles.page}>
      <Header showBackHome />

      <div style={styles.container}>
        <section style={styles.hero}>
          <h1 style={styles.title}>{text.title}</h1>
        </section>

        <section id="categories" style={styles.categoriesSection}>
          <div style={styles.grid}>
            {visibleCategories.map((category) => {
              const localizedTitle =
                category.title[language] ||
                category.title.en ||
                category.title.de ||
                category.title.ar ||
                category.id;

              return (
                <Link
                  key={category.id}
                  href={`/request/category/${category.id}`}
                  style={styles.card}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow =
                      "0 14px 28px rgba(24, 119, 242, 0.10)";
                    e.currentTarget.style.borderColor = "var(--wa-green-primary)";
                    e.currentTarget.style.background = "#ffffff";

                    const image = e.currentTarget.querySelector(
                      "[data-card-image='true']"
                    ) as HTMLDivElement | null;

                    if (image) image.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 18px rgba(24, 119, 242, 0.06)";
                    e.currentTarget.style.borderColor = "var(--wa-border)";
                    e.currentTarget.style.background = "#ffffff";

                    const image = e.currentTarget.querySelector(
                      "[data-card-image='true']"
                    ) as HTMLDivElement | null;

                    if (image) image.style.transform = "scale(1)";
                  }}
                >
                  <div style={styles.imageWrap}>
                    <div
                      data-card-image="true"
                      style={{
                        ...styles.imageArea,
                        backgroundImage: `url(${category.image})`,
                      }}
                    />
                    <div style={styles.imageOverlay} />

                    <div style={styles.imageTitleWrap}>
                      <h2 style={styles.imageTitle}>{localizedTitle}</h2>
                    </div>
                  </div>

                  <div style={styles.cardFooter}>
                    <p style={styles.statusText}>
                      {category.serviceCount > 0 ? `${category.serviceCount}` : ""}
                    </p>
                    <span style={styles.openPill}>{text.openCategory}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section style={styles.lowerPanel}>
          <h2 style={styles.lowerTitle}>{text.openRequestTitle}</h2>
          <p style={styles.lowerText}>{text.openRequestText}</p>

          <div style={styles.lowerActions}>
            <Link
              href="/request/service/open-request"
              style={styles.primaryButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 22px rgba(24, 119, 242, 0.24)";
                e.currentTarget.style.background = "var(--wa-green-primary-hover)";
                e.currentTarget.style.borderColor = "var(--wa-green-primary-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 18px rgba(24, 119, 242, 0.18)";
                e.currentTarget.style.background = "var(--wa-green-primary)";
                e.currentTarget.style.borderColor = "var(--wa-green-primary)";
              }}
            >
              {text.openRequestButton}
            </Link>

            <Link
              href="/"
              style={styles.secondaryButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 22px rgba(24, 119, 242, 0.24)";
                e.currentTarget.style.background = "var(--wa-green-primary-hover)";
                e.currentTarget.style.borderColor = "var(--wa-green-primary-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 18px rgba(24, 119, 242, 0.18)";
                e.currentTarget.style.background = "var(--wa-green-primary)";
                e.currentTarget.style.borderColor = "var(--wa-green-primary)";
              }}
            >
              {text.backHome}
            </Link>
          </div>
        </section>

        <CartPopup lang={language} />
      </div>
    </div>
  );
}