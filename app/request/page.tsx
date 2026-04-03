"use client";

import { useMemo, useState } from "react";
import { categories } from "@/data/categories";
import { services } from "@/data/services/index";
import ServiceForm from "@/components/ServiceForm";
import CartPopup from "@/components/CartPopup";
import { useLanguage } from "@/lib/languageContext";
import Header from "@/components/Header";

export default function RequestPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [, setCartVersion] = useState(0);

  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  const filteredServices = useMemo(() => {
    if (!selectedCategory) return [];
    return services.filter((service) => service.category === selectedCategory);
  }, [selectedCategory]);

  const selectedCategoryObject = useMemo(() => {
    return categories.find((category) => category.id === selectedCategory) || null;
  }, [selectedCategory]);

  const selectedService = useMemo(() => {
    return services.find((service) => service.id === selectedServiceId) || null;
  }, [selectedServiceId]);

  const text = {
    badge:
      language === "ar"
        ? "نظام طلبات احترافي"
        : language === "de"
          ? "Professionelles Anfrage-System"
          : "Professional Request System",

    title:
      language === "ar"
        ? "اطلب خدمتك بطريقة واضحة واحترافية"
        : language === "de"
          ? "Wähle deinen Service klar und professionell aus"
          : "Request your service clearly and professionally",

    subtitle:
      language === "ar"
        ? "ابدأ باختيار الفئة الرئيسية، ثم اختر الخدمة المناسبة، وبعدها أضف الطلب إلى السلة. يمكنك جمع عدة طلبات ثم إرسالها دفعة واحدة."
        : language === "de"
          ? "Wähle zuerst eine Hauptkategorie, dann den passenden Service und füge die Anfrage zum Warenkorb hinzu. Du kannst mehrere Anfragen sammeln und gemeinsam senden."
          : "Start by choosing a main category, then select the right service, and add the request to the cart. You can collect multiple requests and send them together.",

    categoriesTitle:
      language === "ar"
        ? "1) اختر الفئة الرئيسية"
        : language === "de"
          ? "1) Hauptkategorie auswählen"
          : "1) Choose the Main Category",

    servicesTitle:
      language === "ar"
        ? "2) اختر الخدمة المناسبة"
        : language === "de"
          ? "2) Passenden Service auswählen"
          : "2) Choose the Right Service",

    selectedTitle:
      language === "ar"
        ? "3) الخدمة المختارة"
        : language === "de"
          ? "3) Ausgewählter Service"
          : "3) Selected Service",

    formTitle:
      language === "ar"
        ? "4) أدخل تفاصيل الطلب"
        : language === "de"
          ? "4) Anfrage ausfüllen"
          : "4) Fill in the Request Details",

    chooseCategoryFirst:
      language === "ar"
        ? "اختر فئة رئيسية أولًا لعرض الخدمات المتاحة."
        : language === "de"
          ? "Bitte zuerst eine Hauptkategorie auswählen, um die verfügbaren Services zu sehen."
          : "Please choose a main category first to see the available services.",

    noServices:
      language === "ar"
        ? "لا توجد خدمات ضمن هذه الفئة حاليًا."
        : language === "de"
          ? "Derzeit sind in dieser Kategorie keine Services vorhanden."
          : "There are currently no services in this category.",

    selectedCategoryLabel:
      language === "ar"
        ? "الفئة المختارة"
        : language === "de"
          ? "Ausgewählte Kategorie"
          : "Selected Category",

    selectedServiceLabel:
      language === "ar"
        ? "الخدمة المختارة"
        : language === "de"
          ? "Ausgewählter Service"
          : "Selected Service",

    changeCategory:
      language === "ar"
        ? "تغيير الفئة"
        : language === "de"
          ? "Kategorie ändern"
          : "Change Category",

    changeService:
      language === "ar"
        ? "تغيير الخدمة"
        : language === "de"
          ? "Service ändern"
          : "Change Service",

    formIntro:
      language === "ar"
        ? "املأ النموذج التالي بدقة، ويمكنك أيضًا رفع صورة أو ملف مرجعي إذا كان متوفرًا."
        : language === "de"
          ? "Fülle das folgende Formular möglichst genau aus. Du kannst auch ein Referenzbild oder eine Datei hochladen."
          : "Fill in the form as clearly as possible. You can also upload a reference image or file if available.",
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f7f1e8 0%, #f3eadf 100%)",
      padding: "0 16px 80px",
      fontFamily: "Arial, sans-serif",
    } as const,

    container: {
      maxWidth: "1180px",
      margin: "22px auto 0",
    } as const,

    hero: {
      background: "linear-gradient(135deg, #fffaf4 0%, #f8efe3 100%)",
      border: "1px solid #e3d3bf",
      borderRadius: "28px",
      padding: "30px 22px",
      boxShadow: "0 14px 40px rgba(96, 73, 46, 0.10)",
      marginBottom: "28px",
      textAlign: "center" as const,
    },

    badge: {
      display: "inline-block",
      marginBottom: "14px",
      padding: "8px 14px",
      borderRadius: "999px",
      background: "#efe1cf",
      color: "#6d5338",
      fontSize: "13px",
      fontWeight: 700,
      border: "1px solid #ddc8af",
    },

    title: {
      margin: "0 0 12px",
      fontSize: "clamp(28px, 4vw, 42px)",
      lineHeight: 1.25,
      color: "#2f2419",
      fontWeight: 800,
    },

    subtitle: {
      margin: "0 auto",
      maxWidth: "820px",
      color: "#5b4b3c",
      lineHeight: 1.9,
      fontSize: "15px",
    },

    section: {
      background: "rgba(255,255,255,0.78)",
      border: "1px solid #e7d9c8",
      borderRadius: "24px",
      padding: "22px 18px",
      boxShadow: "0 8px 28px rgba(90, 70, 40, 0.07)",
      marginBottom: "22px",
    },

    sectionTitle: {
      fontSize: "24px",
      margin: "0 0 16px",
      textAlign: "center" as const,
      color: "#35281d",
      fontWeight: 800,
    },

    categoryGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "14px",
    } as const,

    categoryButton: {
      padding: "18px 16px",
      cursor: "pointer",
      borderRadius: "18px",
      fontWeight: 700,
      fontSize: "15px",
      lineHeight: 1.5,
      transition: "0.2s ease",
    } as const,

    serviceGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: "14px",
    } as const,

    serviceButton: {
      padding: "20px 18px",
      cursor: "pointer",
      borderRadius: "20px",
      transition: "0.2s ease",
    } as const,

    helperBox: {
      padding: "18px",
      border: "1px dashed #d2bba0",
      borderRadius: "16px",
      background: "#fff8f1",
      color: "#6d5b49",
      lineHeight: 1.8,
      fontSize: "14px",
    },

    summaryCard: {
      marginTop: "8px",
      marginBottom: "22px",
      padding: "20px",
      border: "1px solid #e3d3bf",
      borderRadius: "22px",
      background: "linear-gradient(135deg, #fffaf4 0%, #f6ecdf 100%)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "14px",
      flexWrap: "wrap" as const,
      boxShadow: "0 10px 28px rgba(96, 73, 46, 0.08)",
    },

    summaryMeta: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "6px",
    },

    summaryLabel: {
      fontSize: "13px",
      color: "#7a6653",
    },

    summaryValue: {
      fontSize: "22px",
      fontWeight: 700,
      color: "#2f2419",
      lineHeight: 1.4,
    },

    pillButton: {
      padding: "10px 16px",
      borderRadius: "999px",
      border: "1px solid #8f7354",
      background: "#ffffff",
      cursor: "pointer",
      fontWeight: 700,
      color: "#3d3126",
    },

    formIntroBox: {
      marginBottom: "14px",
      padding: "18px",
      borderRadius: "18px",
      border: "1px solid #eadbc9",
      background: "#fffaf4",
      color: "#5f4c3c",
      lineHeight: 1.9,
      fontSize: "14px",
    },
  };

  return (
    <div dir={dir} style={styles.page}>
      <Header showBackHome />

      <div style={styles.container}>
        <div style={styles.hero}>
          <div style={styles.badge}>{text.badge}</div>
          <h1 style={styles.title}>{text.title}</h1>
          <p style={styles.subtitle}>{text.subtitle}</p>
        </div>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>{text.categoriesTitle}</h2>

          <div style={styles.categoryGrid}>
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setSelectedServiceId(null);
                  }}
                  style={{
                    ...styles.categoryButton,
                    border: isSelected ? "1.5px solid #3d3126" : "1px solid #dccab4",
                    background: isSelected ? "#3d3126" : "#fffaf5",
                    color: isSelected ? "#ffffff" : "#3f3125",
                    textAlign: isArabic ? "right" : "left",
                    boxShadow: isSelected
                      ? "0 10px 25px rgba(61, 49, 38, 0.18)"
                      : "0 4px 12px rgba(90, 70, 40, 0.05)",
                  }}
                >
                  {category.title[language]}
                </button>
              );
            })}
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>{text.servicesTitle}</h2>

          {!selectedCategory && <div style={styles.helperBox}>{text.chooseCategoryFirst}</div>}

          {selectedCategory && filteredServices.length === 0 && (
            <div style={styles.helperBox}>{text.noServices}</div>
          )}

          {filteredServices.length > 0 && (
            <div style={styles.serviceGrid}>
              {filteredServices.map((service) => {
                const isSelected = selectedServiceId === service.id;

                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedServiceId(service.id)}
                    style={{
                      ...styles.serviceButton,
                      border: isSelected ? "1.5px solid #3d3126" : "1px solid #dccab4",
                      background: isSelected ? "#3d3126" : "#fffdf9",
                      color: isSelected ? "#ffffff" : "#2f2419",
                      textAlign: isArabic ? "right" : "left",
                      boxShadow: isSelected
                        ? "0 12px 26px rgba(61, 49, 38, 0.18)"
                        : "0 4px 12px rgba(90, 70, 40, 0.05)",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "18px",
                        marginBottom: "8px",
                        lineHeight: 1.4,
                      }}
                    >
                      {service.title[language]}
                    </div>

                    <div
                      style={{
                        fontSize: "14px",
                        lineHeight: 1.8,
                        color: isSelected ? "#f7ede2" : "#6a5642",
                      }}
                    >
                      {service.description[language]}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {selectedService && (
          <>
            <div style={styles.summaryCard}>
              <div style={styles.summaryMeta}>
                <div style={styles.summaryLabel}>{text.selectedCategoryLabel}</div>
                <div style={{ ...styles.summaryValue, fontSize: "16px" }}>
                  {selectedCategoryObject?.title?.[language] || ""}
                </div>

                <div style={{ ...styles.summaryLabel, marginTop: "8px" }}>
                  {text.selectedServiceLabel}
                </div>
                <div style={styles.summaryValue}>{selectedService.title[language]}</div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  justifyContent: isArabic ? "flex-start" : "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedServiceId(null);
                  }}
                  style={styles.pillButton}
                >
                  {text.changeCategory}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedServiceId(null)}
                  style={styles.pillButton}
                >
                  {text.changeService}
                </button>
              </div>
            </div>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>{text.formTitle}</h2>

              <div style={styles.formIntroBox}>{text.formIntro}</div>

              <ServiceForm
                service={selectedService}
                lang={language}
                onAddedToCart={() => setCartVersion((prev) => prev + 1)}
              />
            </section>
          </>
        )}

        <CartPopup lang={language} />
      </div>
    </div>
  );
}