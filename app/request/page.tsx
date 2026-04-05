"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { categories } from "@/data/categories";
import CartPopup from "@/components/CartPopup";
import { useLanguage } from "@/lib/languageContext";
import Header from "@/components/Header";

type LocalizedText = {
  ar: string;
  de: string;
  en: string;
};

type CategorySupportContent = {
  smartHint: LocalizedText;
  voiceExamples: LocalizedText;
};

const categorySupportMap: Record<string, CategorySupportContent> = {
  smart: {
    smartHint: {
      ar: "مناسب إذا لم تكن متأكدًا من اسم الخدمة أو المسار الصحيح.",
      de: "Passend, wenn du noch nicht sicher bist, welche Leistung oder welcher Weg der richtige ist.",
      en: "Suitable if you are not yet sure which service or path is the right one.",
    },
    voiceExamples: {
      ar: "مثال بحث طبيعي: أريد شيئًا لمحل جديد ولا أعرف من أين أبدأ",
      de: "Natürliches Suchbeispiel: Ich brauche etwas für einen neuen Laden und weiß nicht, wo ich anfangen soll",
      en: "Natural search example: I need something for a new shop and do not know where to start",
    },
  },
  signage: {
    smartHint: {
      ar: "مناسب للوحات، الحروف، الواجهات، والإضاءات الداخلية والخارجية.",
      de: "Passend für Schilder, Buchstaben, Fassaden und Lichtwerbung innen und außen.",
      en: "Suitable for signs, letters, facades, and illuminated solutions indoors and outdoors.",
    },
    voiceExamples: {
      ar: "مثال بحث طبيعي: أريد لوحة مضيئة لواجهة محل",
      de: "Natürliches Suchbeispiel: Ich brauche ein beleuchtetes Schild für meine Ladenfassade",
      en: "Natural search example: I need an illuminated sign for my shop facade",
    },
  },
  surfaces: {
    smartHint: {
      ar: "مناسب للزجاج، الستيكر، الفروستد، واللصق على الواجهات والأسطح.",
      de: "Passend für Glas, Folien, Milchglas und Beklebungen auf Flächen und Fassaden.",
      en: "Suitable for glass, stickers, frosted films, and adhesive graphics on surfaces and facades.",
    },
    voiceExamples: {
      ar: "مثال بحث طبيعي: أريد ستيكر أو فروستد للزجاج",
      de: "Natürliches Suchbeispiel: Ich brauche Folie oder Milchglas für Fenster",
      en: "Natural search example: I need sticker or frosted film for glass",
    },
  },
  vehicle: {
    smartHint: {
      ar: "مناسب لتغليف السيارات والفانات وكتابة الشعارات والنصوص عليها.",
      de: "Passend für Fahrzeugfolierung sowie Logos und Beschriftung auf Autos und Vans.",
      en: "Suitable for vehicle wraps and adding logos or lettering to cars and vans.",
    },
    voiceExamples: {
      ar: "مثال بحث طبيعي: أريد كتابة شعار على سيارة الشركة",
      de: "Natürliches Suchbeispiel: Ich möchte mein Firmenlogo auf ein Fahrzeug kleben",
      en: "Natural search example: I want to place my company logo on a vehicle",
    },
  },
  printing: {
    smartHint: {
      ar: "مناسب للمطبوعات الورقية مثل البزنس كارد، الفلايرات، المنيوهات، والبروشورات.",
      de: "Passend für Papierdrucksachen wie Visitenkarten, Flyer, Speisekarten und Broschüren.",
      en: "Suitable for printed paper products such as business cards, flyers, menus, and brochures.",
    },
    voiceExamples: {
      ar: "مثال بحث طبيعي: أحتاج بزنس كارد أو فلاير أو منيو",
      de: "Natürliches Suchbeispiel: Ich brauche Visitenkarten oder Flyer oder eine Speisekarte",
      en: "Natural search example: I need business cards or flyers or a menu",
    },
  },
  packaging: {
    smartHint: {
      ar: "مناسب للملصقات، التغليف، العلب، الأكياس، وحلول التعبئة والعرض.",
      de: "Passend für Etiketten, Verpackung, Boxen, Taschen und Präsentationslösungen.",
      en: "Suitable for labels, packaging, boxes, bags, and presentation solutions.",
    },
    voiceExamples: {
      ar: "مثال بحث طبيعي: أريد علب أو ملصقات لمنتج",
      de: "Natürliches Suchbeispiel: Ich brauche Boxen oder Etiketten für ein Produkt",
      en: "Natural search example: I need boxes or labels for a product",
    },
  },
  textile: {
    smartHint: {
      ar: "مناسب لطباعة الملابس والهدايا الدعائية والمنتجات القماشية.",
      de: "Passend für Textildruck, Giveaways und bedruckte Stoffprodukte.",
      en: "Suitable for textile printing, giveaways, and printed fabric products.",
    },
    voiceExamples: {
      ar: "مثال بحث طبيعي: أريد طباعة تيشيرتات أو قبعات للشركة",
      de: "Natürliches Suchbeispiel: Ich brauche bedruckte T-Shirts oder Caps für meine Firma",
      en: "Natural search example: I need printed t-shirts or caps for my company",
    },
  },
  display: {
    smartHint: {
      ar: "مناسب للستاندات، الرول أب، الخلفيات، وتجهيزات العرض والفعاليات.",
      de: "Passend für Roll-ups, Displays, Backdrops und Eventausstattung.",
      en: "Suitable for roll-ups, displays, backdrops, and exhibition or event materials.",
    },
    voiceExamples: {
      ar: "مثال بحث طبيعي: أريد رول أب أو ستاند لمعرض أو فعالية",
      de: "Natürliches Suchbeispiel: Ich brauche ein Roll-up oder Display für ein Event",
      en: "Natural search example: I need a roll-up or display for an event",
    },
  },
  branding: {
    smartHint: {
      ar: "مناسب للشعار والهوية البصرية وتصميم المشروع بشكل متكامل.",
      de: "Passend für Logo, visuelle Identität und ganzheitliches Projektdesign.",
      en: "Suitable for logo design, visual identity, and complete project branding.",
    },
    voiceExamples: {
      ar: "مثال بحث طبيعي: أريد شعارًا وهوية بصرية لمشروعي",
      de: "Natürliches Suchbeispiel: Ich brauche ein Logo und Branding für mein Projekt",
      en: "Natural search example: I need a logo and branding for my project",
    },
  },
  fabrication: {
    smartHint: {
      ar: "مناسب للتصنيع الخاص، القص CNC أو الليزر، وتجهيز العناصر غير الجاهزة.",
      de: "Passend für Sonderanfertigung, CNC- oder Laserschnitt und nicht standardisierte Elemente.",
      en: "Suitable for custom fabrication, CNC or laser cutting, and non-standard custom-made pieces.",
    },
    voiceExamples: {
      ar: "مثال بحث طبيعي: أريد قص CNC أو تصنيع قطعة خاصة",
      de: "Natürliches Suchbeispiel: Ich brauche CNC-Schnitt oder eine Sonderanfertigung",
      en: "Natural search example: I need CNC cutting or a custom-made piece",
    },
  },
  marketing: {
    smartHint: {
      ar: "مناسب إذا كنت تحتاج حلولًا متكاملة للمشروع من الفكرة حتى الظهور.",
      de: "Passend, wenn du eine integrierte Lösung vom Konzept bis zur Sichtbarkeit brauchst.",
      en: "Suitable if you need a complete solution from concept to visibility.",
    },
    voiceExamples: {
      ar: "مثال بحث طبيعي: أريد حلًا متكاملًا لمشروعي وليس خدمة واحدة فقط",
      de: "Natürliches Suchbeispiel: Ich brauche eine komplette Lösung für mein Projekt, nicht nur eine einzelne Leistung",
      en: "Natural search example: I need a complete solution for my project, not just one service",
    },
  },
};

export default function RequestPage() {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  const text = {
    badge:
      language === "ar"
        ? "نظام الطلب الذكي"
        : language === "de"
          ? "Intelligentes Anfrage-System"
          : "Smart Request System",

    title:
      language === "ar"
        ? "ابدأ من المسار الصحيح"
        : language === "de"
          ? "Starte mit dem richtigen Weg"
          : "Start with the right path",

    subtitle:
      language === "ar"
        ? "هذا النظام لا يطلب منك معرفة كل شيء من البداية. اختر الفئة الأقرب لطلبك، ثم انتقل إلى الخدمة المناسبة، وسنساعدك على تحويل فكرتك إلى طلب واضح ومنظم وجاهز للتنفيذ."
        : language === "de"
          ? "Du musst nicht von Anfang an jedes Detail kennen. Wähle zuerst die Kategorie, die deiner Anfrage am nächsten kommt, gehe dann zum passenden Service, und wir helfen dir dabei, daraus eine klare und umsetzbare Anfrage zu machen."
          : "You do not need to know every detail from the start. Choose the category closest to your request, move to the right service, and we will help turn your idea into a clear and execution-ready order.",

    categoriesTitle:
      language === "ar"
        ? "الفئات الرئيسية"
        : language === "de"
          ? "Hauptkategorien"
          : "Main Categories",

    categoriesHelper:
      language === "ar"
        ? "اختر الفئة الأقرب لما تحتاجه. وإذا لم تكن متأكدًا 100%، فهذا طبيعي — المهم أن تبدأ من الاتجاه الصحيح."
        : language === "de"
          ? "Wähle die Kategorie, die deiner Anfrage am nächsten kommt. Wenn du noch nicht zu 100 % sicher bist, ist das völlig normal – wichtig ist, dass du mit dem richtigen Einstieg beginnst."
          : "Choose the category that best matches your request. If you are not 100% sure yet, that is completely normal — the important thing is to start from the right direction.",

    smartHelperTitle:
      language === "ar"
        ? "كيف تستخدم هذا النظام بشكل ذكي؟"
        : language === "de"
          ? "Wie nutzt du dieses System am besten?"
          : "How to use this system smartly",

    smartHelperText:
      language === "ar"
        ? "يمكنك الاختيار بناءً على ما تريد فعله فعلًا، لا فقط بناءً على الاسم التقني للخدمة. هذا مهم أيضًا للبحث الطبيعي والصوتي، لأن المستخدم قد يكتب أو يقول حاجته بصيغة بشرية عفوية."
        : language === "de"
          ? "Wähle nach dem tatsächlichen Ziel deiner Anfrage, nicht nur nach dem technischen Namen der Leistung. Das ist auch wichtig für natürliche und sprachbasierte Suche."
          : "Choose based on what you actually want to achieve, not only on the technical service name. This is also important for natural and voice-style search.",

    openCategory:
      language === "ar"
        ? "فتح الفئة"
        : language === "de"
          ? "Kategorie öffnen"
          : "Open Category",

    openRequestTitle:
      language === "ar"
        ? "ما زلت غير متأكد؟"
        : language === "de"
          ? "Noch nicht sicher?"
          : "Still not sure?",

    openRequestText:
      language === "ar"
        ? "ابدأ من الطلب الذكي المفتوح، وسنساعدك على تحديد المسار المناسب حتى لو لم تكن تعرف اسم الخدمة بدقة."
        : language === "de"
          ? "Starte mit der offenen intelligenten Anfrage. Wir helfen dir, den passenden Weg zu finden, auch wenn du die genaue Leistung noch nicht kennst."
          : "Start with the smart open request. We will help you find the right path even if you do not know the exact service name yet.",

    openRequestButton:
      language === "ar"
        ? "ابدأ بالطلب المفتوح"
        : language === "de"
          ? "Mit offener Anfrage starten"
          : "Start with open request",
  };

  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f7f1e8 0%, #f3eadf 100%)",
      padding: "0 12px 72px",
      fontFamily: "Arial, sans-serif",
    },

    container: {
      maxWidth: "1080px",
      margin: "14px auto 0",
    },

    hero: {
      background: "linear-gradient(135deg, #fffaf4 0%, #f8efe3 100%)",
      border: "1px solid #e4d6c4",
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
      lineHeight: 1.8,
      fontSize: "14px",
    },

    helperPanel: {
      background: "rgba(255,255,255,0.84)",
      border: "1px solid #e7d9c8",
      borderRadius: "20px",
      padding: "16px 14px",
      boxShadow: "0 6px 20px rgba(90, 70, 40, 0.06)",
      marginBottom: "14px",
    },

    helperTitle: {
      fontSize: "18px",
      margin: "0 0 8px",
      color: "#35281d",
      fontWeight: 800,
      lineHeight: 1.3,
      textAlign: isArabic ? "right" : "left",
    },

    helperTextBlock: {
      margin: 0,
      color: "#665240",
      lineHeight: 1.8,
      fontSize: "13px",
      textAlign: isArabic ? "right" : "left",
    },

    section: {
      background: "rgba(255,255,255,0.84)",
      border: "1px solid #e7d9c8",
      borderRadius: "20px",
      padding: "16px 14px",
      boxShadow: "0 6px 20px rgba(90, 70, 40, 0.06)",
    },

    sectionTitle: {
      fontSize: "18px",
      margin: "0 0 8px",
      color: "#35281d",
      fontWeight: 800,
      lineHeight: 1.3,
      textAlign: isArabic ? "right" : "left",
    },

    helperText: {
      margin: "0 0 14px",
      color: "#665240",
      lineHeight: 1.8,
      fontSize: "13px",
      textAlign: isArabic ? "right" : "left",
      maxWidth: "760px",
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
      transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
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

    supportText: {
      margin: 0,
      fontSize: "12px",
      lineHeight: 1.7,
      color: "#5e4d3e",
      textAlign: isArabic ? "right" : "left",
    },

    supportExample: {
      margin: 0,
      fontSize: "11px",
      lineHeight: 1.7,
      color: "#8b745e",
      textAlign: isArabic ? "right" : "left",
      padding: "8px 10px",
      borderRadius: "12px",
      background: "#f7ede1",
      border: "1px solid #e2d2bf",
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

    openRequestPanel: {
      marginTop: "14px",
      background: "linear-gradient(135deg, #fffaf4 0%, #f8efe3 100%)",
      border: "1px solid #e4d6c4",
      borderRadius: "20px",
      padding: "16px 14px",
      boxShadow: "0 8px 22px rgba(96, 73, 46, 0.06)",
      display: "grid",
      gap: "10px",
    },

    openRequestTitle: {
      margin: 0,
      fontSize: "18px",
      fontWeight: 800,
      color: "#2f2419",
      textAlign: isArabic ? "right" : "left",
    },

    openRequestText: {
      margin: 0,
      fontSize: "13px",
      lineHeight: 1.8,
      color: "#665240",
      textAlign: isArabic ? "right" : "left",
    },

    openRequestActionRow: {
      display: "flex",
      justifyContent: isArabic ? "flex-start" : "flex-end",
    },

    openRequestButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "40px",
      padding: "0 16px",
      borderRadius: "999px",
      border: "1px solid #2f2419",
      background: "#2f2419",
      color: "#ffffff",
      textDecoration: "none",
      fontSize: "13px",
      fontWeight: 800,
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

        <section style={styles.helperPanel}>
          <h2 style={styles.helperTitle}>{text.smartHelperTitle}</h2>
          <p style={styles.helperTextBlock}>{text.smartHelperText}</p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>{text.categoriesTitle}</h2>
          <p style={styles.helperText}>{text.categoriesHelper}</p>

          <div style={styles.grid}>
            {categories.map((category) => {
              const support = categorySupportMap[category.id];

              return (
                <Link
                  key={category.id}
                  href={`/request/category/${category.id}`}
                  style={styles.card}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 26px rgba(90, 70, 40, 0.10)";
                    e.currentTarget.style.borderColor = "#cfb79a";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 5px 16px rgba(90, 70, 40, 0.05)";
                    e.currentTarget.style.borderColor = "#decdb8";
                  }}
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

                    {support ? (
                      <>
                        <p style={styles.supportText}>
                          {support.smartHint[language]}
                        </p>
                        <p style={styles.supportExample}>
                          {support.voiceExamples[language]}
                        </p>
                      </>
                    ) : null}

                    <div style={styles.footerRow}>
                      <span style={styles.openPill}>{text.openCategory}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div style={styles.openRequestPanel}>
            <h3 style={styles.openRequestTitle}>{text.openRequestTitle}</h3>
            <p style={styles.openRequestText}>{text.openRequestText}</p>

            <div style={styles.openRequestActionRow}>
              <Link
                href="/request/service/open-request"
                style={styles.openRequestButton}
              >
                {text.openRequestButton}
              </Link>
            </div>
          </div>
        </section>

        <CartPopup lang={language} />
      </div>
    </div>
  );
}