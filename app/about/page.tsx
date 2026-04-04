"use client";

import Header from "@/components/Header";
import { useLanguage } from "@/lib/languageContext";
import {
  ShieldCheck,
  Workflow,
  SearchCheck,
  Route,
  Sparkles,
  Building2,
} from "lucide-react";

const pageText = {
  badge: {
    ar: "من نحن",
    de: "Über uns",
    en: "About Us",
  },
  title: {
    ar: "نحن لا نستقبل الطلب فقط، بل نفهمه وننظمه ونوجّهه باحتراف.",
    de: "Wir nehmen Anfragen nicht nur entgegen – wir verstehen, strukturieren und leiten sie professionell weiter.",
    en: "We do not just receive requests — we understand, organize, and direct them professionally.",
  },
  intro: {
    ar: "Caro Bara Smart Print ليست مجرد واجهة لعرض الخدمات، وليست مجرد مطبعة تقليدية. نحن نعمل كنظام ذكي يساعد العميل على تحويل فكرته أو حاجته إلى طلب واضح، منظم، وقابل للتنفيذ بأعلى درجة ممكنة من الدقة والوضوح.",
    de: "Caro Bara Smart Print ist nicht nur eine Präsentationsseite und auch keine klassische Druckerei. Wir arbeiten als intelligentes System, das dem Kunden hilft, seine Idee oder seinen Bedarf in eine klare, strukturierte und umsetzbare Anfrage zu verwandeln.",
    en: "Caro Bara Smart Print is not just a showcase website, and not just a traditional print shop. We operate as an intelligent system that helps the client transform an idea or need into a clear, structured, and executable request.",
  },

  section1Title: {
    ar: "ما هو دورنا الحقيقي؟",
    de: "Was ist unsere eigentliche Rolle?",
    en: "What is our real role?",
  },
  section1Text: {
    ar: "دورنا يبدأ قبل التنفيذ. نحن نساعد العميل على تحديد ما يحتاجه فعلًا، نراجع التفاصيل، نكشف ما هو ناقص، ونرتب الطلب بطريقة تجعله أوضح وأسهل في المعالجة. ثم نوجّه هذا الطلب إلى المسار الأنسب من حيث الخدمة، التنفيذ، والنتيجة النهائية.",
    de: "Unsere Rolle beginnt vor der Umsetzung. Wir helfen dem Kunden zu erkennen, was wirklich benötigt wird, prüfen die Details, identifizieren Lücken und strukturieren die Anfrage so, dass sie klarer und leichter bearbeitbar wird. Danach leiten wir sie an den passendsten Weg in Bezug auf Leistung, Umsetzung und Endergebnis weiter.",
    en: "Our role starts before execution. We help the client identify what is actually needed, review the details, uncover what is missing, and organize the request in a way that makes it clearer and easier to process. Then we direct it to the most suitable path in terms of service, execution, and final result.",
  },

  section2Title: {
    ar: "لماذا هذا مهم للعميل؟",
    de: "Warum ist das für den Kunden wichtig?",
    en: "Why does this matter for the client?",
  },
  section2Text: {
    ar: "كثير من العملاء يعرفون أنهم يحتاجون إلى إعلان أو طباعة أو تجهيز، لكنهم لا يعرفون دائمًا ما هو النوع الأنسب، أو ما هي المعلومات الضرورية، أو كيف يجب أن يُصاغ الطلب بشكل احترافي. هنا تأتي قيمة Caro Bara: نحن نقلل العشوائية، نرفع جودة الفهم، ونساعد على الوصول إلى نتيجة أفضل بوقت أقل وأخطاء أقل.",
    de: "Viele Kunden wissen, dass sie Werbung, Druck oder Vorbereitung benötigen, wissen aber nicht immer, welcher Typ passend ist, welche Informationen nötig sind oder wie eine professionelle Anfrage formuliert werden sollte. Genau hier liegt der Wert von Caro Bara: Wir reduzieren Zufälligkeit, erhöhen die Klarheit und helfen, schneller mit weniger Fehlern zu besseren Ergebnissen zu kommen.",
    en: "Many clients know they need printing, signage, or setup work, but they do not always know which option fits best, which details are required, or how the request should be formulated professionally. That is where Caro Bara adds value: we reduce randomness, improve clarity, and help achieve better results with less time and fewer mistakes.",
  },

  section3Title: {
    ar: "كيف نفكر؟",
    de: "Wie denken wir?",
    en: "How do we think?",
  },
  section3Text: {
    ar: "نحن ننظر إلى الطلب ليس كمنتج فقط، بل كحاجة تجارية أو بصرية أو تشغيلية يجب فهمها في سياقها الصحيح. لذلك فإننا لا نكتفي بسؤال: ماذا تريد؟ بل نبحث أيضًا في: لماذا تريده؟ أين سيُستخدم؟ ما الهدف منه؟ وما هي أفضل طريقة للوصول إلى النتيجة المناسبة؟",
    de: "Wir betrachten eine Anfrage nicht nur als Produkt, sondern als geschäftlichen, visuellen oder operativen Bedarf, der im richtigen Kontext verstanden werden muss. Deshalb fragen wir nicht nur: Was möchtest du? Sondern auch: Warum? Wo wird es eingesetzt? Was ist das Ziel? Und was ist der beste Weg zum passenden Ergebnis?",
    en: "We look at a request not just as a product, but as a commercial, visual, or operational need that must be understood in the right context. That is why we do not only ask: what do you want? We also ask: why do you need it, where will it be used, what is the goal, and what is the best path to the right result?",
  },

  valuesTitle: {
    ar: "ما الذي يميزنا؟",
    de: "Was zeichnet uns aus?",
    en: "What makes us different?",
  },

  cards: {
    clarity: {
      title: {
        ar: "وضوح قبل التنفيذ",
        de: "Klarheit vor der Umsetzung",
        en: "Clarity Before Execution",
      },
      text: {
        ar: "نرتب الطلب ونحوّله إلى صيغة أوضح وأسهل في الفهم والمعالجة.",
        de: "Wir strukturieren die Anfrage und machen sie klarer und leichter umsetzbar.",
        en: "We structure the request and turn it into something clearer and easier to execute.",
      },
    },
    review: {
      title: {
        ar: "مراجعة ذكية",
        de: "Intelligente Prüfung",
        en: "Smart Review",
      },
      text: {
        ar: "نكشف النواقص ونلفت الانتباه إلى التفاصيل التي قد تؤثر على النتيجة.",
        de: "Wir erkennen Lücken und weisen auf Details hin, die das Ergebnis beeinflussen können.",
        en: "We detect gaps and highlight details that may affect the final result.",
      },
    },
    routing: {
      title: {
        ar: "توجيه صحيح",
        de: "Richtige Weiterleitung",
        en: "Correct Routing",
      },
      text: {
        ar: "نوجّه كل طلب إلى المسار الأنسب بدل المعالجة العشوائية أو غير الدقيقة.",
        de: "Wir leiten jede Anfrage an den passendsten Weg weiter statt sie zufällig zu behandeln.",
        en: "We direct each request to the most suitable path instead of handling it randomly.",
      },
    },
    thinking: {
      title: {
        ar: "فهم تجاري وبصري",
        de: "Geschäftliches und visuelles Verständnis",
        en: "Commercial and Visual Understanding",
      },
      text: {
        ar: "نفهم أن كل طلب يخدم هدفًا أكبر: صورة المشروع، المبيعات، والظهور.",
        de: "Wir verstehen, dass jede Anfrage einem größeren Ziel dient: Markenbild, Verkauf und Sichtbarkeit.",
        en: "We understand that every request serves a bigger goal: brand image, sales, and visibility.",
      },
    },
  },

  visionTitle: {
    ar: "رؤيتنا",
    de: "Unsere Vision",
    en: "Our Vision",
  },
  visionText: {
    ar: "رؤيتنا أن تتحول Caro Bara Smart Print إلى منظومة أكثر ذكاءً وقدرة على التحليل والتنظيم، بحيث تساعد الأفراد والشركات على بناء طلباتهم بشكل احترافي، وتربطهم دائمًا بالحل الأنسب من حيث الجودة، السرعة، والوضوح. نحن لا نريد فقط استقبال الطلبات، بل نريد رفع مستوى طريقة تقديمها وفهمها ومعالجتها.",
    de: "Unsere Vision ist es, Caro Bara Smart Print zu einem noch intelligenteren System für Analyse und Strukturierung weiterzuentwickeln, damit Privatkunden und Unternehmen ihre Anfragen professionell aufbauen und immer mit der passendsten Lösung in Bezug auf Qualität, Geschwindigkeit und Klarheit verbunden werden. Wir wollen nicht nur Anfragen empfangen, sondern auch die Art verbessern, wie sie formuliert, verstanden und bearbeitet werden.",
    en: "Our vision is to develop Caro Bara Smart Print into an even smarter system for analysis and organization, helping individuals and businesses build requests professionally and always connect them to the most suitable solution in terms of quality, speed, and clarity. We do not only want to receive requests; we want to elevate how they are presented, understood, and handled.",
  },
};

export default function AboutPage() {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  const featureCards = [
    {
      icon: ShieldCheck,
      title: pageText.cards.clarity.title[language],
      text: pageText.cards.clarity.text[language],
    },
    {
      icon: SearchCheck,
      title: pageText.cards.review.title[language],
      text: pageText.cards.review.text[language],
    },
    {
      icon: Route,
      title: pageText.cards.routing.title[language],
      text: pageText.cards.routing.text[language],
    },
    {
      icon: Building2,
      title: pageText.cards.thinking.title[language],
      text: pageText.cards.thinking.text[language],
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
        paddingBottom: "72px",
      }}
    >
      <Header showBackButton />

      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "20px 16px 0",
        }}
      >
        <section
          style={{
            padding: "40px 0 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px 14px",
              marginBottom: "16px",
              borderRadius: "999px",
              border: "1px solid #ddccb6",
              background: "rgba(255,255,255,0.55)",
              color: "#6a5642",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            {pageText.badge[language]}
          </div>

          <h1
            style={{
              margin: "0 auto 16px",
              maxWidth: "960px",
              fontSize: "clamp(30px, 5vw, 56px)",
              lineHeight: 1.2,
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
              color: "#5d4b3b",
            }}
          >
            {pageText.intro[language]}
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gap: "16px",
            marginTop: "18px",
          }}
        >
          {[
            {
              title: pageText.section1Title[language],
              text: pageText.section1Text[language],
              icon: Workflow,
            },
            {
              title: pageText.section2Title[language],
              text: pageText.section2Text[language],
              icon: Sparkles,
            },
            {
              title: pageText.section3Title[language],
              text: pageText.section3Text[language],
              icon: SearchCheck,
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                style={{
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid #e7dacb",
                  borderRadius: "24px",
                  padding: "24px 22px",
                  boxShadow: "0 10px 28px rgba(82, 61, 37, 0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: isArabic ? "row-reverse" : "row",
                    alignItems: "flex-start",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "16px",
                      background: "#efe3d1",
                      border: "1px solid #ddccb6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={22} color="#4a392b" />
                  </div>

                  <div style={{ flex: 1 }}>
                    <h2
                      style={{
                        margin: "0 0 10px",
                        fontSize: "24px",
                        lineHeight: 1.35,
                        color: "#2f2419",
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {item.title}
                    </h2>

                    <p
                      style={{
                        margin: 0,
                        fontSize: "15px",
                        lineHeight: 2,
                        color: "#5d4b3b",
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {item.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section style={{ marginTop: "28px" }}>
          <div
            style={{
              marginBottom: "14px",
              textAlign: isArabic ? "right" : "left",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "30px",
                color: "#2f2419",
                lineHeight: 1.3,
              }}
            >
              {pageText.valuesTitle[language]}
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            {featureCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <div
                  key={index}
                  style={{
                    background: "#fffdfa",
                    border: "1px solid #e6d8c8",
                    borderRadius: "22px",
                    padding: "22px 18px",
                    boxShadow: "0 8px 20px rgba(82, 61, 37, 0.04)",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "15px",
                      background: "#efe3d1",
                      border: "1px solid #ddccb6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "14px",
                    }}
                  >
                    <Icon size={20} color="#4a392b" />
                  </div>

                  <h3
                    style={{
                      margin: "0 0 10px",
                      fontSize: "18px",
                      lineHeight: 1.45,
                      color: "#2f2419",
                      textAlign: isArabic ? "right" : "left",
                    }}
                  >
                    {card.title}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      lineHeight: 1.9,
                      color: "#645240",
                      textAlign: isArabic ? "right" : "left",
                    }}
                  >
                    {card.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section
          style={{
            marginTop: "28px",
            background: "linear-gradient(135deg, #1e1711 0%, #2b2118 100%)",
            color: "#ffffff",
            borderRadius: "28px",
            padding: "30px 24px",
            boxShadow: "0 14px 34px rgba(35, 24, 16, 0.12)",
          }}
        >
          <h2
            style={{
              margin: "0 0 12px",
              fontSize: "30px",
              lineHeight: 1.3,
              textAlign: isArabic ? "right" : "left",
            }}
          >
            {pageText.visionTitle[language]}
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: "15px",
              lineHeight: 2,
              color: "#e8ddd2",
              textAlign: isArabic ? "right" : "left",
              maxWidth: "980px",
            }}
          >
            {pageText.visionText[language]}
          </p>
        </section>
      </div>
    </main>
  );
}