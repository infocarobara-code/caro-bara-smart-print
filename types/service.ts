"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { categories } from "@/data/categories";
import CartPopup from "@/components/CartPopup";
import Header from "@/components/Header";
import { useLanguage } from "@/lib/languageContext";

export default function RequestPage() {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  const text = {
    badge:
      language === "ar"
        ? "نظام استقبال الطلبات"
        : language === "de"
          ? "Anfrage-System"
          : "Request System",

    title:
      language === "ar"
        ? "ابدأ من الفئة المناسبة"
        : language === "de"
          ? "Starte mit der passenden Kategorie"
          : "Start with the right category",

    subtitle:
      language === "ar"
        ? "اختر المجال الأقرب لطلبك، ثم تابع إلى الخدمة المناسبة، وبعدها انتقل إلى صفحة الطلب الخاصة بها."
        : language === "de"
          ? "Wähle zuerst die passende Kategorie, dann den richtigen Service und gehe anschließend zur eigenen Anfrageseite."
          : "Choose the category that fits your request, then continue to the right service and its dedicated request page.",

    categoriesTitle:
      language === "ar"
        ? "الفئات الرئيسية"
        : language === "de"
          ? "Hauptkategorien"
          : "Main Categories",

    openCategory:
      language === "ar"
        ? "فتح الفئة"
        : language === "de"
          ? "Kategorie öffnen"
          : "Open Category",
  };

  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f7f1e8 0%, #f2e9de 100%)",
      padding: "0 12px 72px",
      fontFamily: "Arial, sans-serif",
    },

    container: {
      maxWidth: "1080px",
      margin: "14px auto 0",
    },

    hero: {
      background: "linear-gradient(135deg, #fffaf4 0%, #f8efe3 100%)",
      border: "1px solid #e3d4c2",
      borderRadius: "22px",
      padding: "22px 16px 18px",
      boxShadow: "0 10px 28px rgba(96, 73, 46, 0.08)",
      marginBottom: "14px",
      textAlign: "center",
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
      letterSpacing: "0.2px",
    },

    title: {
      margin: "0 0 10px",
      fontSize: "clamp(24px, 6vw, 38px)",
      lineHeight: 1.2,
      color: "#2f2419",
      fontWeight: 800,
    },

    subtitle: {
      margin: "0 auto",
      maxWidth: "760px",
      color: "#5b4b3c",
      lineHeight: 1.75,
      fontSize: "14px",
    },

    section: {
      background: "rgba(255,255,255,0.84)",
      border: "1px solid #e7d9c8",
      borderRadius: "20px",
      padding: "16px 14px",
      boxShadow: "0 6px 20px rgba(90, 70, 40, 0.06)",
    },

    sectionTitle: {
      margin: "0 0 12px",
      fontSize: "18px",
      lineHeight: 1.3,
      color: "#35281d",
      fontWeight: 800,
      textAlign: isArabic ? "right" : "left",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "12px",
    },

    card: {
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
      overflow: "hidden",
      borderRadius: "18px",
      border: "1px solid #decdb8",
      background: "#fffaf5",
      textDecoration: "none",
      color: "#2f2419",
      boxShadow: "0 5px 16px rgba(90, 70, 40, 0.05)",
      transition: "transform 0.18s ease, box-shadow 0.18s ease",
    },

    imageArea: {
      height: "132px",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      borderBottom: "1px solid #eadbc9",
      backgroundColor: "#efe5d8",
    },

    content: {
      padding: "14px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      minWidth: 0,
      flex: 1,
    },

    cardTitle: {
      margin: 0,
      fontSize: "16px",
      lineHeight: 1.35,
      fontWeight: 800,
      color: "#2f2419",
      textAlign: isArabic ? "right" : "left",
    },

    cardDescription: {
      margin: 0,
      fontSize: "13px",
      lineHeight: 1.7,
      color: "#6a5642",
      textAlign: isArabic ? "right" : "left",
      minHeight: "44px",
    },

    footerRow: {
      display: "flex",
      justifyContent: isArabic ? "flex-start" : "flex-end",
      marginTop: "2px",
    },

    openPill: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "34px",
      padding: "0 12px",
      borderRadius: "999px",
      border: "1px solid #d7c2aa",
      background: "#f7ede1",
      color: "#4b3a2b",
      fontSize: "12px",
      fontWeight: 700,
    },
  };

  return (
    <div dir={dir} style={styles.page}>
      <Header showBackHome />

      <div style={styles.container}>
        <section style={styles.hero}>
          <div style={styles.badge}>{text.badge}</div>
          <h1 style={styles.title}>{text.title}</h1>
          <p style={styles.subtitle}>{text.subtitle}</p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>{text.categoriesTitle}</h2>

          <div style={styles.grid}>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/request/category/${category.id}`}
                style={styles.card}
              >
                <div
                  style={{
                    ...styles.imageArea,
                    backgroundImage: `url(${category.image})`,
                  }}
                />

                <div style={styles.content}>
                  <h3 style={styles.cardTitle}>{category.title[language]}</h3>
                  <p style={styles.cardDescription}>
                    {category.description[language]}
                  </p>

                  <div style={styles.footerRow}>
                    <span style={styles.openPill}>{text.openCategory}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <CartPopup lang={language} />
      </div>
    </div>
  );
}