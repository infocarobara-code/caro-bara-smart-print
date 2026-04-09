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
      background: "linear-gradient(180deg, #f7f1e8 0%, #f3eadf 100%)",
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
      color: "#2f2419",
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
      border: "1px solid #ddcbb7",
      background: "#fffaf5",
      textDecoration: "none",
      color: "#2f2419",
      boxShadow: "0 8px 20px rgba(90, 70, 40, 0.05)",
      transition:
        "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
    },

    imageWrap: {
      position: "relative",
      height: "240px",
      overflow: "hidden",
      backgroundColor: "#efe5d8",
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
        "linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.52) 100%)",
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
      textShadow: "0 3px 10px rgba(0,0,0,0.28)",
      textWrap: "balance",
    },

    cardFooter: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      padding: "14px 16px",
      borderTop: "1px solid #eadbc9",
      background: "#fffaf5",
    },

    statusText: {
      margin: 0,
      fontSize: "12px",
      lineHeight: 1.4,
      color: "#6c5844",
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
      border: "1px solid #d7c2aa",
      background: "#f7ede1",
      color: "#4b3a2b",
      fontSize: "12px",
      fontWeight: 800,
      flexShrink: 0,
    },

    lowerPanel: {
      marginTop: "6px",
      background: "rgba(255,255,255,0.82)",
      border: "1px solid #e7d9c8",
      borderRadius: "22px",
      padding: "18px 16px",
      boxShadow: "0 6px 20px rgba(90, 70, 40, 0.05)",
      display: "grid",
      gap: "12px",
    },

    lowerTitle: {
      margin: 0,
      fontSize: "18px",
      lineHeight: 1.3,
      fontWeight: 800,
      color: "#2f2419",
      textAlign: isArabic ? "right" : "left",
    },

    lowerText: {
      margin: 0,
      fontSize: "13px",
      lineHeight: 1.8,
      color: "#665240",
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
      border: "1px solid #2f2419",
      background: "#2f2419",
      color: "#ffffff",
      textDecoration: "none",
      fontSize: "13px",
      fontWeight: 800,
      transition:
        "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
      boxShadow: "0 10px 20px rgba(47, 36, 25, 0.12)",
    },

    secondaryButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "42px",
      padding: "0 18px",
      borderRadius: "999px",
      border: "1px solid #d7c2aa",
      background: "#fffaf5",
      color: "#3e3125",
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
                      "0 16px 30px rgba(90, 70, 40, 0.12)";
                    e.currentTarget.style.borderColor = "#cfb79a";

                    const image = e.currentTarget.querySelector(
                      "[data-card-image='true']"
                    ) as HTMLDivElement | null;

                    if (image) image.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(90, 70, 40, 0.05)";
                    e.currentTarget.style.borderColor = "#ddcbb7";

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
                  "0 14px 26px rgba(47, 36, 25, 0.16)";
                e.currentTarget.style.background = "#241b13";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 20px rgba(47, 36, 25, 0.12)";
                e.currentTarget.style.background = "#2f2419";
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
                  "0 10px 18px rgba(72, 52, 32, 0.06)";
                e.currentTarget.style.background = "#fffdf9";
                e.currentTarget.style.borderColor = "#cdb79f";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.background = "#fffaf5";
                e.currentTarget.style.borderColor = "#d7c2aa";
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