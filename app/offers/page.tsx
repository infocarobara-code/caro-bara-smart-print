"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { useLanguage } from "@/lib/languageContext";
import {
  BadgePercent,
  Sparkles,
  Shield,
  Camera,
  Store,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const pageText = {
  badge: {
    ar: "العروض الحالية",
    de: "Aktuelle Angebote",
    en: "Current Offers",
  },
  title: {
    ar: "عروض ذكية تمنح مشروعك قيمة أعلى بتكلفة أوضح",
    de: "Intelligente Angebote, die deinem Projekt mehr Wert bei klaren Kosten geben",
    en: "Smart offers that give your project more value with clearer costs",
  },
  intro: {
    ar: "هذه العروض ليست مجرد أسعار، بل حلول مدروسة تساعد العميل على البدء بسرعة، وتمنحه نقطة دخول واضحة إلى التنفيذ أو التطوير أو تحسين الظهور البصري لمشروعه.",
    de: "Diese Angebote sind nicht nur Preise, sondern durchdachte Lösungen, die Kunden einen schnellen Einstieg in Umsetzung, Weiterentwicklung und visuelle Verbesserung ihres Projekts geben.",
    en: "These offers are not just prices, but thoughtful solutions that help clients start faster and gain a clear entry point into execution, improvement, and stronger visual presentation.",
  },

  sectionTitle: {
    ar: "عروض مختارة بعناية",
    de: "Sorgfältig ausgewählte Angebote",
    en: "Carefully Selected Offers",
  },
  sectionText: {
    ar: "تمت صياغة هذه العروض لتكون واضحة، سهلة الفهم، وقابلة للتحويل إلى طلب مباشر بسرعة.",
    de: "Diese Angebote wurden so gestaltet, dass sie klar, leicht verständlich und schnell in eine direkte Anfrage umwandelbar sind.",
    en: "These offers were designed to be clear, easy to understand, and quickly convertible into a direct request.",
  },

  offer1Badge: {
    ar: "عرض عملي سريع",
    de: "Schnelles Praxisangebot",
    en: "Fast Practical Offer",
  },
  offer1Title: {
    ar: "فوليا مع طبقة حماية",
    de: "Folie mit Schutzlaminat",
    en: "Vinyl with Protective Laminate",
  },
  offer1Price: {
    ar: "55 يورو / المتر الواحد",
    de: "55 € / pro laufendem Meter",
    en: "€55 / per linear meter",
  },
  offer1Text: {
    ar: "حل مناسب للأعمال التي تحتاج إلى مظهر واضح وحماية إضافية للسطح المطبوع، مع توازن جيد بين السعر والمتانة والنتيجة النهائية.",
    de: "Eine passende Lösung für Arbeiten, die eine klare Optik und zusätzlichen Schutz der bedruckten Oberfläche benötigen – mit guter Balance zwischen Preis, Haltbarkeit und Endergebnis.",
    en: "A suitable solution for projects that need a clear appearance and extra protection for the printed surface, with a strong balance between price, durability, and final result.",
  },
  offer1Points: {
    ar: [
      "يشمل الفوليا مع طبقة حماية",
      "مناسب للاستخدامات التجارية المتكررة",
      "يوفر مظهرًا أنظف وعمرًا أفضل",
    ],
    de: [
      "Enthält Folie mit Schutzlaminat",
      "Geeignet für wiederkehrende gewerbliche Anwendungen",
      "Sorgt für sauberere Optik und bessere Haltbarkeit",
    ],
    en: [
      "Includes vinyl with protective laminate",
      "Suitable for repeated commercial use",
      "Provides a cleaner look and better durability",
    ],
  },

  offer2Badge: {
    ar: "عرض ذكي لأصحاب المحلات",
    de: "Intelligentes Angebot für Geschäfte",
    en: "Smart Offer for Store Owners",
  },
  offer2Title: {
    ar: "تصميم ديكور محلك علينا والتنفيذ عليك",
    de: "Wir gestalten dein Shop-Konzept – die Umsetzung übernimmst du",
    en: "We design your shop decor concept — you handle execution",
  },
  offer2Price: {
    ar: "حل بصري مدروس",
    de: "Durchdachtes visuelles Konzept",
    en: "A Thoughtful Visual Concept",
  },
  offer2Text: {
    ar: "إذا كنت تريد رؤية أو تصورًا احترافيًا لمحلّك أو واجهتك أو التوزيع البصري الداخلي، فنحن نضع لك الفكرة والتوجيه والتصور العام، بينما تتولى أنت التنفيذ بالطريقة التي تناسبك.",
    de: "Wenn du eine professionelle Vision für deinen Laden, deine Fassade oder die innere visuelle Aufteilung möchtest, entwickeln wir Konzept, Richtung und Gesamtbild – während du die Umsetzung auf deine Weise übernimmst.",
    en: "If you want a professional vision for your shop, facade, or interior visual arrangement, we create the concept, direction, and overall visual approach while you take care of execution in the way that suits you.",
  },
  offer2Points: {
    ar: [
      "مناسب للمشاريع الجديدة أو التجديد",
      "يوفّر تصورًا أوضح قبل أي تنفيذ",
      "يساعدك على اتخاذ قرارات أدق وأهدأ",
    ],
    de: [
      "Geeignet für neue Projekte oder Relaunch",
      "Schafft mehr Klarheit vor jeder Umsetzung",
      "Hilft dir, präzisere und sicherere Entscheidungen zu treffen",
    ],
    en: [
      "Suitable for new projects or renewals",
      "Creates more clarity before any execution",
      "Helps you make more precise and confident decisions",
    ],
  },

  offer3Badge: {
    ar: "عرض بصري قوي",
    de: "Starkes visuelles Angebot",
    en: "Strong Visual Offer",
  },
  offer3Title: {
    ar: "تصوير منتجاتك بشكل كامل",
    de: "Komplette Produktfotografie",
    en: "Complete Product Photography",
  },
  offer3Price: {
    ar: "250 يورو فقط",
    de: "Nur 250 €",
    en: "Only €250",
  },
  offer3Text: {
    ar: "عرض مناسب للمشاريع التي تحتاج إلى صور منتجات منظمة، واضحة، وقابلة للاستخدام في السوشال ميديا أو العرض أو التسويق أو المنصات الرقمية.",
    de: "Ein passendes Angebot für Projekte, die strukturierte, klare Produktbilder für Social Media, Präsentation, Marketing oder digitale Plattformen benötigen.",
    en: "A suitable offer for businesses that need organized, clear product images for social media, presentation, marketing, or digital platforms.",
  },
  offer3Points: {
    ar: [
      "مناسب للظهور المهني للمنتجات",
      "يساعد على رفع جودة العرض البصري",
      "مفيد للمتاجر والسوشال ميديا والكتالوجات",
    ],
    de: [
      "Geeignet für einen professionellen Produktauftritt",
      "Verbessert die visuelle Präsentationsqualität",
      "Nützlich für Shops, Social Media und Kataloge",
    ],
    en: [
      "Suitable for a professional product presentation",
      "Improves visual presentation quality",
      "Useful for shops, social media, and catalogs",
    ],
  },

  ctaTitle: {
    ar: "هل تريد تحويل أحد هذه العروض إلى طلب مباشر؟",
    de: "Möchtest du eines dieser Angebote direkt als Anfrage starten?",
    en: "Do you want to turn one of these offers into a direct request?",
  },
  ctaText: {
    ar: "يمكنك الآن الانتقال مباشرة إلى صفحة الطلب واختيار الخدمة الأقرب، أو إرسال طلب مفتوح إذا كنت تريد أن نساعدك في تحديد المسار الأنسب.",
    de: "Du kannst jetzt direkt zur Anfrageseite wechseln und die passendste Leistung wählen – oder eine offene Anfrage senden, wenn wir dir beim besten Weg helfen sollen.",
    en: "You can now go directly to the request page and choose the closest service, or send an open request if you want us to help determine the best path.",
  },
  ctaPrimary: {
    ar: "ابدأ الطلب الآن",
    de: "Jetzt Anfrage starten",
    en: "Start Request Now",
  },
  ctaSecondary: {
    ar: "طلب ذكي مفتوح",
    de: "Offene intelligente Anfrage",
    en: "Smart Open Request",
  },
};

export default function OffersPage() {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  const offers = [
    {
      badge: pageText.offer1Badge[language],
      title: pageText.offer1Title[language],
      price: pageText.offer1Price[language],
      text: pageText.offer1Text[language],
      points: pageText.offer1Points[language],
      icon: Shield,
      featured: true,
    },
    {
      badge: pageText.offer2Badge[language],
      title: pageText.offer2Title[language],
      price: pageText.offer2Price[language],
      text: pageText.offer2Text[language],
      points: pageText.offer2Points[language],
      icon: Store,
      featured: false,
    },
    {
      badge: pageText.offer3Badge[language],
      title: pageText.offer3Title[language],
      price: pageText.offer3Price[language],
      text: pageText.offer3Text[language],
      points: pageText.offer3Points[language],
      icon: Camera,
      featured: false,
    },
  ];

  return (
    <main
      dir={dir}
      style={{
        fontFamily: "Arial, sans-serif",
        background: "#f5f1eb",
        color: "#2f2419",
        minHeight: "100vh",
        paddingBottom: "76px",
      }}
    >
      <Header showBackButton />

      <div
        style={{
          maxWidth: "1220px",
          margin: "0 auto",
          padding: "20px 16px 0",
        }}
      >
        <section
          style={{
            textAlign: "center",
            padding: "38px 0 20px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "8px 14px",
              borderRadius: "999px",
              border: "1px solid #ddccb6",
              background: "rgba(255,255,255,0.56)",
              color: "#6a5642",
              fontSize: "12px",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            <BadgePercent size={14} />
            <span>{pageText.badge[language]}</span>
          </div>

          <h1
            style={{
              margin: "0 auto 14px",
              maxWidth: "940px",
              fontSize: "clamp(30px, 5vw, 58px)",
              lineHeight: 1.18,
              color: "#2f2419",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            {pageText.title[language]}
          </h1>

          <p
            style={{
              margin: "0 auto",
              maxWidth: "860px",
              fontSize: "16px",
              lineHeight: 2,
              color: "#5c4a3a",
            }}
          >
            {pageText.intro[language]}
          </p>
        </section>

        <section
          style={{
            marginTop: "18px",
            marginBottom: "18px",
            background: "rgba(255,255,255,0.9)",
            border: "1px solid #e7dacb",
            borderRadius: "26px",
            padding: "24px 22px",
            boxShadow: "0 10px 28px rgba(82, 61, 37, 0.05)",
          }}
        >
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: "28px",
              lineHeight: 1.3,
              textAlign: isArabic ? "right" : "left",
            }}
          >
            {pageText.sectionTitle[language]}
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: "15px",
              lineHeight: 1.9,
              color: "#665442",
              textAlign: isArabic ? "right" : "left",
              maxWidth: "880px",
            }}
          >
            {pageText.sectionText[language]}
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "18px",
            alignItems: "stretch",
          }}
        >
          {offers.map((offer, index) => {
            const Icon = offer.icon;

            return (
              <div
                key={index}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "24px 20px 22px",
                  borderRadius: "28px",
                  border: offer.featured
                    ? "1px solid #d8c1a5"
                    : "1px solid #e7dacb",
                  background: offer.featured
                    ? "linear-gradient(180deg, #fff7ee 0%, #f9efe2 100%)"
                    : "linear-gradient(180deg, #fffdfa 0%, #fbf7f1 100%)",
                  boxShadow: offer.featured
                    ? "0 14px 34px rgba(100, 73, 42, 0.10)"
                    : "0 10px 26px rgba(82, 61, 37, 0.05)",
                  overflow: "hidden",
                }}
              >
                {offer.featured && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-38px",
                      [isArabic ? "left" : "right"]: "-38px",
                      width: "120px",
                      height: "120px",
                      borderRadius: "999px",
                      background: "rgba(176, 138, 91, 0.10)",
                      filter: "blur(2px)",
                    }}
                  />
                )}

                <div>
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "18px",
                      background: "#efe3d1",
                      border: "1px solid #dcc8b0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <Icon size={22} color="#4a392b" />
                  </div>

                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "7px 12px",
                      borderRadius: "999px",
                      border: "1px solid #e1cfba",
                      background: "rgba(255,255,255,0.65)",
                      color: "#7a6248",
                      fontSize: "12px",
                      fontWeight: 700,
                      marginBottom: "14px",
                    }}
                  >
                    {offer.badge}
                  </div>

                  <h3
                    style={{
                      margin: "0 0 10px",
                      fontSize: "24px",
                      lineHeight: 1.35,
                      color: "#2f2419",
                      textAlign: isArabic ? "right" : "left",
                    }}
                  >
                    {offer.title}
                  </h3>

                  <div
                    style={{
                      fontSize: "30px",
                      fontWeight: 800,
                      lineHeight: 1.2,
                      color: offer.featured ? "#6b4d2d" : "#2f2419",
                      marginBottom: "14px",
                      textAlign: isArabic ? "right" : "left",
                    }}
                  >
                    {offer.price}
                  </div>

                  <p
                    style={{
                      margin: "0 0 16px",
                      fontSize: "14px",
                      lineHeight: 1.95,
                      color: "#5f4d3d",
                      textAlign: isArabic ? "right" : "left",
                    }}
                  >
                    {offer.text}
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gap: "10px",
                    }}
                  >
                    {offer.points.map((point, pointIndex) => (
                      <div
                        key={pointIndex}
                        style={{
                          display: "flex",
                          flexDirection: isArabic ? "row-reverse" : "row",
                          alignItems: "flex-start",
                          gap: "10px",
                          color: "#4f4032",
                          fontSize: "14px",
                          lineHeight: 1.8,
                          textAlign: isArabic ? "right" : "left",
                        }}
                      >
                        <CheckCircle2
                          size={18}
                          color={offer.featured ? "#8c6b46" : "#6f5a44"}
                          style={{ flexShrink: 0, marginTop: "2px" }}
                        />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "22px",
                    paddingTop: "16px",
                    borderTop: "1px solid rgba(216, 198, 176, 0.7)",
                  }}
                >
                  <Link
                    href="/request"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      textDecoration: "none",
                      color: "#2f2419",
                      fontWeight: 800,
                      fontSize: "14px",
                    }}
                  >
                    <span>
                      {language === "ar"
                        ? "تحويله إلى طلب"
                        : language === "de"
                          ? "Als Anfrage starten"
                          : "Turn into a request"}
                    </span>
                    <ArrowRight
                      size={16}
                      style={{
                        transform: isArabic ? "rotate(180deg)" : "none",
                      }}
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </section>

        <section
          style={{
            marginTop: "28px",
            background: "linear-gradient(135deg, #1f1711 0%, #2c2118 100%)",
            borderRadius: "30px",
            padding: "30px 24px",
            boxShadow: "0 16px 36px rgba(35, 24, 16, 0.13)",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "18px",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "#eadfce",
                  fontSize: "12px",
                  fontWeight: 700,
                  marginBottom: "14px",
                }}
              >
                <Sparkles size={14} />
                <span>
                  {language === "ar"
                    ? "خطوة ذكية تالية"
                    : language === "de"
                      ? "Nächster intelligenter Schritt"
                      : "Next Smart Step"}
                </span>
              </div>

              <h2
                style={{
                  margin: "0 0 12px",
                  fontSize: "30px",
                  lineHeight: 1.3,
                  textAlign: isArabic ? "right" : "left",
                }}
              >
                {pageText.ctaTitle[language]}
              </h2>

              <p
                style={{
                  margin: 0,
                  fontSize: "15px",
                  lineHeight: 1.95,
                  color: "#e8ddd2",
                  textAlign: isArabic ? "right" : "left",
                  maxWidth: "760px",
                }}
              >
                {pageText.ctaText[language]}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                alignItems: isArabic ? "flex-start" : "flex-end",
              }}
            >
              <Link
                href="/request"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "230px",
                  minHeight: "48px",
                  padding: "12px 18px",
                  borderRadius: "16px",
                  background: "#ffffff",
                  color: "#1f1711",
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: "14px",
                }}
              >
                {pageText.ctaPrimary[language]}
              </Link>

              <Link
                href="/request/service/open-request"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "230px",
                  minHeight: "48px",
                  padding: "12px 18px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.08)",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: "14px",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                {pageText.ctaSecondary[language]}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}