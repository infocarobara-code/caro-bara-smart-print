"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useLanguage } from "@/lib/languageContext";
import Header from "@/components/Header";

const text = {
  badge: {
    ar: "كيف تعمل المنصة",
    de: "Wie die Plattform funktioniert",
    en: "How the Platform Works",
  },
  title: {
    ar: "كيف يستخدم العميل الموقع وما فائدته؟",
    de: "Wie nutzt der Kunde die Website und was ist ihr Vorteil?",
    en: "How does the client use the website and what is its benefit?",
  },
  intro: {
    ar: "هذه المنصة ليست مجرد موقع عرض تقليدي، بل هي خطوة نحو نظام ذكي يربط العميل بالخدمة المناسبة بأوضح طريقة ممكنة، ويمنح Caro Bara دورًا احترافيًا في تنظيم الطلبات وتوجيهها إلى أفضل جهة تنفيذ.",
    de: "Diese Plattform ist nicht nur eine klassische Präsentationsseite, sondern ein Schritt in Richtung eines intelligenten Systems, das den Kunden klar zur passenden Leistung führt und Caro Bara eine professionelle Rolle bei der Organisation und Weiterleitung von Anfragen gibt.",
    en: "This platform is not just a traditional showcase website, but a step toward an intelligent system that connects the client to the right service in the clearest possible way and gives Caro Bara a professional role in organizing and directing requests.",
  },
  clientBenefitTitle: {
    ar: "ما فائدة الموقع للعميل؟",
    de: "Welchen Nutzen hat die Website für den Kunden?",
    en: "What is the benefit of the website for the client?",
  },
  futureTitle: {
    ar: "الرؤية المستقبلية للمنصة",
    de: "Die zukünftige Vision der Plattform",
    en: "The Future Vision of the Platform",
  },
  futureText: {
    ar: "الهدف المستقبلي هو أن تتحول المنصة إلى حلقة ربط ذكية بين العملاء والمطابع وجهات التنفيذ، بحيث تستقبل Caro Bara الطلبات، وتنظمها، وتوجهها إلى الشريك الأنسب مقابل آلية عمل احترافية وقابلة للتوسع لاحقًا مع الذكاء الاصطناعي والتسعير الذكي وإدارة الملفات والطلبات.",
    de: "Das zukünftige Ziel ist es, die Plattform in ein intelligentes Bindeglied zwischen Kunden, Druckereien und Ausführungsstellen zu verwandeln, sodass Caro Bara Anfragen empfängt, organisiert und an den passendsten Partner weiterleitet, mit einer professionellen und später skalierbaren Struktur inklusive KI, smartem Pricing und Dateiverwaltung.",
    en: "The future goal is to transform the platform into an intelligent link between clients, printers, and execution partners, where Caro Bara receives requests, organizes them, and directs them to the most suitable partner through a professional and scalable structure with AI, smart pricing, and file and request management.",
  },
};

const steps = [
  {
    title: {
      ar: "1. اختيار القسم المناسب",
      de: "1. Den passenden Bereich auswählen",
      en: "1. Choose the right section",
    },
    text: {
      ar: "يبدأ العميل من الصفحة الرئيسية، ثم يدخل إلى القسم الذي يناسب حاجته مثل الخدمات أو العروض أو صفحة الطلب المباشر.",
      de: "Der Kunde startet auf der Startseite und wechselt dann in den Bereich, der zu seinem Bedarf passt, etwa Leistungen, Angebote oder die direkte Anfrageseite.",
      en: "The client starts from the homepage and then enters the section that matches their need, such as services, offers, or the direct request page.",
    },
  },
  {
    title: {
      ar: "2. إرسال الطلب بشكل واضح",
      de: "2. Die Anfrage klar absenden",
      en: "2. Send the request clearly",
    },
    text: {
      ar: "عبر صفحة الطلب، يحدد العميل الفئة والخدمة المناسبة، ثم يرسل التفاصيل بطريقة منظمة تساعد على فهم المشروع بسرعة.",
      de: "Über die Anfrageseite wählt der Kunde die passende Kategorie und Leistung und sendet die Details strukturiert, damit das Projekt schnell verstanden wird.",
      en: "Through the request page, the client selects the right category and service, then sends the details in an organized way that helps the project be understood quickly.",
    },
  },
  {
    title: {
      ar: "3. تحليل الطلب",
      de: "3. Anfrage analysieren",
      en: "3. Analyze the request",
    },
    text: {
      ar: "تقوم Caro Bara بمراجعة الطلب وفهم متطلباته الفنية والتجارية قبل توجيهه إلى أفضل جهة تنفيذ أو مطبعة مناسبة.",
      de: "Caro Bara prüft die Anfrage und versteht ihre technischen und geschäftlichen Anforderungen, bevor sie an die beste Ausführungsstelle oder passende Druckerei weitergeleitet wird.",
      en: "Caro Bara reviews the request and understands its technical and commercial requirements before directing it to the best execution partner or suitable print shop.",
    },
  },
  {
    title: {
      ar: "4. التوجيه والتنفيذ",
      de: "4. Weiterleitung und Umsetzung",
      en: "4. Direct and execute",
    },
    text: {
      ar: "يتم توجيه الطلب إلى الجهة الأنسب من حيث الجودة والسعر والسرعة، مع بقاء Caro Bara كحلقة تنظيم وضبط احترافية.",
      de: "Die Anfrage wird an die geeignetste Stelle in Bezug auf Qualität, Preis und Geschwindigkeit weitergeleitet, während Caro Bara als professionelle Organisations- und Kontrollinstanz erhalten bleibt.",
      en: "The request is directed to the most suitable partner in terms of quality, price, and speed, while Caro Bara remains the professional coordination and control layer.",
    },
  },
];

const benefits = {
  ar: [
    "الوصول السريع إلى الخدمة المناسبة دون تشتيت.",
    "إرسال الطلب بطريقة مرتبة وواضحة.",
    "الحصول على معالجة احترافية بدل التواصل العشوائي.",
    "الاستفادة من خبرة Caro Bara في اختيار أفضل جهة تنفيذ.",
    "توفير الوقت وتقليل الأخطاء في فهم متطلبات المشروع.",
  ],
  de: [
    "Schneller Zugang zur passenden Leistung ohne Ablenkung.",
    "Die Anfrage strukturiert und klar senden.",
    "Professionelle Bearbeitung statt zufälliger Kommunikation.",
    "Von der Erfahrung von Caro Bara bei der Auswahl des besten Partners profitieren.",
    "Zeit sparen und Missverständnisse bei Projektanforderungen reduzieren.",
  ],
  en: [
    "Quick access to the right service without distraction.",
    "Send the request in a clear and organized way.",
    "Receive professional handling instead of random communication.",
    "Benefit from Caro Bara’s experience in choosing the best execution partner.",
    "Save time and reduce mistakes in understanding project requirements.",
  ],
};

export default function PlatformGuidePage() {
  const { language, dir } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 940);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pagePadding = isMobile ? "0 14px 56px" : "0 20px 80px";
  const contentMarginTop = isMobile ? "20px" : "32px";
  const introFontSize = isMobile ? "15px" : "17px";
  const sectionTitleSize = isMobile ? "24px" : "28px";
  const cardTitleSize = isMobile ? "18px" : "20px";
  const cardTextSize = isMobile ? "14px" : "15px";
  const bodyTextSize = isMobile ? "15px" : "16px";

  const whiteCardStyle: CSSProperties = {
    background: "#ffffff",
    border: "1px solid #e7d9c8",
    borderRadius: isMobile ? "20px" : "24px",
    padding: isMobile ? "22px 18px" : "30px 26px",
    boxShadow: "0 12px 28px rgba(82, 61, 37, 0.07)",
  };

  return (
    <main
      dir={dir}
      style={{
        fontFamily: "Arial, sans-serif",
        background: "#f5f1eb",
        color: "#2f2419",
        minHeight: "100vh",
        padding: pagePadding,
        overflowX: "hidden",
      }}
    >
      <Header showBackButton />

      <div
        style={{
          maxWidth: "1120px",
          margin: `${contentMarginTop} auto 0`,
          width: "100%",
        }}
      >
        <div
          style={{
            marginBottom: isMobile ? "18px" : "24px",
            display: "inline-block",
            padding: isMobile ? "7px 12px" : "8px 14px",
            borderRadius: "999px",
            background: "#ede0cf",
            color: "#6a523c",
            fontSize: isMobile ? "12px" : "13px",
            fontWeight: 700,
            border: "1px solid #dcc8af",
            maxWidth: "100%",
          }}
        >
          {text.badge[language]}
        </div>

        <h1
          style={{
            fontSize: isMobile ? "30px" : "clamp(32px, 5vw, 52px)",
            margin: "0 0 18px",
            lineHeight: 1.2,
            wordBreak: "break-word",
          }}
        >
          {text.title[language]}
        </h1>

        <p
          style={{
            fontSize: introFontSize,
            lineHeight: isMobile ? 1.9 : 2,
            color: "#5f4d3d",
            marginBottom: isMobile ? "28px" : "42px",
            maxWidth: "900px",
          }}
        >
          {text.intro[language]}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "minmax(0, 1fr)"
              : "repeat(2, minmax(0, 1fr))",
            gap: isMobile ? "16px" : "22px",
            marginBottom: isMobile ? "26px" : "40px",
          }}
        >
          {steps.map((item) => (
            <div
              key={item.title.en}
              style={{
                background: "#ffffff",
                border: "1px solid #e7d9c8",
                borderRadius: isMobile ? "20px" : "24px",
                padding: isMobile ? "22px 18px" : "28px 24px",
                boxShadow: "0 14px 30px rgba(82, 61, 37, 0.06)",
                minHeight: isMobile ? undefined : "210px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                overflow: "hidden",
              }}
            >
              <h2
                style={{
                  fontSize: cardTitleSize,
                  margin: "0 0 14px",
                  lineHeight: 1.5,
                  color: "#2f2419",
                  wordBreak: "break-word",
                }}
              >
                {item.title[language]}
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#6a5642",
                  lineHeight: isMobile ? 1.85 : 1.95,
                  fontSize: cardTextSize,
                }}
              >
                {item.text[language]}
              </p>
            </div>
          ))}
        </div>

        <section
          style={{
            ...whiteCardStyle,
            marginBottom: isMobile ? "20px" : "28px",
            overflow: "hidden",
          }}
        >
          <h2
            style={{
              fontSize: sectionTitleSize,
              margin: "0 0 14px",
              lineHeight: 1.3,
              wordBreak: "break-word",
            }}
          >
            {text.clientBenefitTitle[language]}
          </h2>

          <ul
            style={{
              margin: 0,
              paddingInlineStart: isMobile ? "20px" : "22px",
              lineHeight: isMobile ? 1.9 : 2,
              color: "#5f4d3d",
              fontSize: bodyTextSize,
            }}
          >
            {benefits[language].map((item) => (
              <li key={item} style={{ marginBottom: isMobile ? "6px" : "0" }}>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section
          style={{
            background: "linear-gradient(135deg, #161616 0%, #111111 100%)",
            color: "#ffffff",
            borderRadius: isMobile ? "20px" : "24px",
            padding: isMobile ? "24px 18px" : "30px 24px",
            overflow: "hidden",
          }}
        >
          <h2
            style={{
              fontSize: sectionTitleSize,
              margin: "0 0 12px",
              lineHeight: 1.3,
              wordBreak: "break-word",
            }}
          >
            {text.futureTitle[language]}
          </h2>

          <p
            style={{
              margin: 0,
              lineHeight: isMobile ? 1.9 : 2,
              color: "#ddd6ce",
              fontSize: bodyTextSize,
            }}
          >
            {text.futureText[language]}
          </p>
        </section>
      </div>
    </main>
  );
}