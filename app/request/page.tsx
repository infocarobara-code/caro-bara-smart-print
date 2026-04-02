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
        ? "الفئات الرئيسية"
        : language === "de"
          ? "Hauptkategorien"
          : "Main Categories",

    servicesTitle:
      language === "ar"
        ? "الخدمات ضمن هذه الفئة"
        : language === "de"
          ? "Services in dieser Kategorie"
          : "Services in This Category",

    chooseCategoryFirst:
      language === "ar"
        ? "اختر فئة رئيسية أولًا"
        : language === "de"
          ? "Bitte zuerst eine Hauptkategorie auswählen"
          : "Please choose a main category first",

    noServices:
      language === "ar"
        ? "لا توجد خدمات ضمن هذه الفئة حاليًا"
        : language === "de"
          ? "Derzeit sind in dieser Kategorie keine Services vorhanden"
          : "There are currently no services in this category",

    selectedTitle:
      language === "ar"
        ? "الخدمة المختارة"
        : language === "de"
          ? "Ausgewählter Service"
          : "Selected Service",

    changeService:
      language === "ar"
        ? "تغيير الخدمة"
        : language === "de"
          ? "Service ändern"
          : "Change Service",
  };

  return (
    <div
      dir={dir}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f7f1e8 0%, #f3eadf 100%)",
        padding: "0 16px 80px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Header showBackHome />

      <div
        style={{
          maxWidth: "1180px",
          margin: "22px auto 0",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #fffaf4 0%, #f8efe3 100%)",
            border: "1px solid #e3d3bf",
            borderRadius: "28px",
            padding: "28px 20px",
            boxShadow: "0 14px 40px rgba(96, 73, 46, 0.10)",
            marginBottom: "28px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              marginBottom: "14px",
              padding: "8px 14px",
              borderRadius: "999px",
              background: "#efe1cf",
              color: "#6d5338",
              fontSize: "13px",
              fontWeight: 700,
              border: "1px solid #ddc8af",
            }}
          >
            {text.badge}
          </div>

          <h1
            style={{
              margin: "0 0 12px",
              fontSize: "clamp(28px, 4vw, 42px)",
              lineHeight: 1.25,
              color: "#2f2419",
            }}
          >
            {text.title}
          </h1>

          <p
            style={{
              margin: "0 auto",
              maxWidth: "820px",
              color: "#5b4b3c",
              lineHeight: 1.9,
              fontSize: "15px",
            }}
          >
            {text.subtitle}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "24px",
          }}
        >
          <section
            style={{
              background: "rgba(255,255,255,0.78)",
              border: "1px solid #e7d9c8",
              borderRadius: "24px",
              padding: "22px 18px",
              boxShadow: "0 8px 28px rgba(90, 70, 40, 0.07)",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                margin: "0 0 16px",
                textAlign: "center",
                color: "#35281d",
              }}
            >
              {text.categoriesTitle}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "14px",
              }}
            >
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
                      padding: "18px 16px",
                      border: isSelected ? "1.5px solid #3d3126" : "1px solid #dccab4",
                      background: isSelected ? "#3d3126" : "#fffaf5",
                      color: isSelected ? "#ffffff" : "#3f3125",
                      cursor: "pointer",
                      borderRadius: "18px",
                      textAlign: isArabic ? "right" : "left",
                      fontWeight: 700,
                      fontSize: "15px",
                      lineHeight: 1.5,
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

          <section
            style={{
              background: "rgba(255,255,255,0.78)",
              border: "1px solid #e7d9c8",
              borderRadius: "24px",
              padding: "22px 18px",
              boxShadow: "0 8px 28px rgba(90, 70, 40, 0.07)",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                margin: "0 0 16px",
                textAlign: "center",
                color: "#35281d",
              }}
            >
              {text.servicesTitle}
            </h2>

            {!selectedCategory && (
              <div
                style={{
                  padding: "18px",
                  border: "1px dashed #d2bba0",
                  borderRadius: "16px",
                  background: "#fff8f1",
                  color: "#6d5b49",
                }}
              >
                {text.chooseCategoryFirst}
              </div>
            )}

            {selectedCategory && filteredServices.length === 0 && (
              <div
                style={{
                  padding: "18px",
                  border: "1px dashed #d2bba0",
                  borderRadius: "16px",
                  background: "#fff8f1",
                  color: "#6d5b49",
                }}
              >
                {text.noServices}
              </div>
            )}

            {filteredServices.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "14px",
                }}
              >
                {filteredServices.map((service) => {
                  const isSelected = selectedServiceId === service.id;

                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedServiceId(service.id)}
                      style={{
                        padding: "20px 18px",
                        border: isSelected ? "1.5px solid #3d3126" : "1px solid #dccab4",
                        background: isSelected ? "#3d3126" : "#fffdf9",
                        color: isSelected ? "#ffffff" : "#2f2419",
                        cursor: "pointer",
                        borderRadius: "20px",
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
                          lineHeight: "1.8",
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
        </div>

        {selectedService && (
          <div
            style={{
              marginTop: "24px",
              marginBottom: "20px",
              padding: "20px",
              border: "1px solid #e3d3bf",
              borderRadius: "22px",
              background: "linear-gradient(135deg, #fffaf4 0%, #f6ecdf 100%)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              boxShadow: "0 10px 28px rgba(96, 73, 46, 0.08)",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#7a6653",
                  marginBottom: "4px",
                }}
              >
                {text.selectedTitle}
              </div>

              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#2f2419",
                  lineHeight: 1.4,
                }}
              >
                {selectedService.title[language]}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedServiceId(null)}
              style={{
                padding: "10px 16px",
                borderRadius: "999px",
                border: "1px solid #8f7354",
                background: "#ffffff",
                cursor: "pointer",
                fontWeight: 700,
                color: "#3d3126",
              }}
            >
              {text.changeService}
            </button>
          </div>
        )}

        {selectedService && (
          <ServiceForm
            service={selectedService}
            lang={language}
            onAddedToCart={() => setCartVersion((prev) => prev + 1)}
          />
        )}

        <CartPopup lang={language} />
      </div>
    </div>
  );
}