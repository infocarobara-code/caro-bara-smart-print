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
      background:
        "linear-gradient(180deg, rgba(239, 234, 226, 0.72) 0%, rgba(239, 234, 226, 0.92) 100%)",
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
      color: "#111b21",
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
      border: "1px solid #d1d7db",
      background: "#f0f2f5",
      textDecoration: "none",
      color: "#111b21",
      boxShadow: "0 2px 10px rgba(17, 27, 33, 0.04)",
      transition:
        "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, background 0.18s ease",
    },

    imageWrap: {
      position: "relative",
      height: "240px",
      overflow: "hidden",
      backgroundColor: "#e9edef",
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
      background:
        "linear-gradient(180deg, rgba(17,27,33,0.02) 0%, rgba(17,27,33,0.12) 56%, rgba(17,27,33,0.34) 100%)",
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
      borderTop: "1px solid #d1d7db",
      background: "#f0f2f5",
    },

    statusText: {
      margin: 0,
      fontSize: "12px",
      lineHeight: 1.4,
      color: "#667781",
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
      border: "1px solid #d1d7db",
      background: "#ffffff",
      color: "#111b21",
      fontSize: "12px",
      fontWeight: 800,
      flexShrink: 0,
      boxShadow: "0 1px 2px rgba(17, 27, 33, 0.03)",
    },

    lowerPanel: {
      marginTop: "6px",
      background: "#f0f2f5",
      border: "1px solid #d1d7db",
      borderRadius: "22px",
      padding: "18px 16px",
      boxShadow: "0 2px 10px rgba(17, 27, 33, 0.04)",
      display: "grid",
      gap: "12px",
    },

    lowerTitle: {
      margin: 0,
      fontSize: "18px",
      lineHeight: 1.3,
      fontWeight: 800,
      color: "#111b21",
      textAlign: isArabic ? "right" : "left",
    },

    lowerText: {
      margin: 0,
      fontSize: "13px",
      lineHeight: 1.8,
      color: "#667781",
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
      border: "1px solid #25d366",
      background: "#25d366",
      color: "#ffffff",
      textDecoration: "none",
      fontSize: "13px",
      fontWeight: 800,
      transition:
        "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease",
      boxShadow: "0 8px 18px rgba(37, 211, 102, 0.18)",
    },

    secondaryButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "42px",
      padding: "0 18px",
      borderRadius: "999px",
      border: "1px solid #d1d7db",
      background: "#ffffff",
      color: "#111b21",
      textDecoration: "none",
      fontSize: "13px",
      fontWeight: 800,
      transition:
        "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease",
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
                      "0 12px 24px rgba(17, 27, 33, 0.07)";
                    e.currentTarget.style.borderColor = "rgba(0, 168, 132, 0.16)";
                    e.currentTarget.style.background = "#f7f8fa";

                    const image = e.currentTarget.querySelector(
                      "[data-card-image='true']"
                    ) as HTMLDivElement | null;

                    if (image) image.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 10px rgba(17, 27, 33, 0.04)";
                    e.currentTarget.style.borderColor = "#d1d7db";
                    e.currentTarget.style.background = "#f0f2f5";

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
              {text.openRequestButton}
            </Link>

            <Link
              href="/"
              style={styles.secondaryButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 18px rgba(17, 27, 33, 0.05)";
                e.currentTarget.style.background = "#f7f8fa";
                e.currentTarget.style.borderColor = "rgba(0, 168, 132, 0.14)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.borderColor = "#d1d7db";
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