"use client";

import Hero from "@/components/Hero";
import Header from "@/components/Header";
import { useLanguage } from "@/lib/languageContext";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  Camera,
  Music2,
  Clock3,
  User,
  Star,
  ArrowUpRight,
  FileText,
  Layers3,
  ShieldCheck,
} from "lucide-react";

const pageText = {
  footerTitle: {
    ar: "Caro Bara Smart Print",
    de: "Caro Bara Smart Print",
    en: "Caro Bara Smart Print",
  },
  footerDescription: {
    ar: "نظام ذكي لتنظيم الطلبات وتوجيهها للتنفيذ",
    de: "Ein intelligentes System zur Organisation von Anfragen und ihrer Weiterleitung zur Ausführung",
    en: "A smart system for organizing requests and directing them to execution",
  },
  contactTitle: {
    ar: "التواصل المباشر",
    de: "Direkter Kontakt",
    en: "Direct Contact",
  },
  socialTitle: {
    ar: "منصاتنا",
    de: "Social Media",
    en: "Social Media",
  },
  reviewsTitle: {
    ar: "تقييمات Google",
    de: "Google-Bewertungen",
    en: "Google Reviews",
  },
  reviewsText: {
    ar: "اطّلع على التقييمات الحقيقية لعملائنا مباشرة عبر Google.",
    de: "Sieh dir die echten Bewertungen unserer Kunden direkt auf Google an.",
    en: "See real customer reviews directly on Google.",
  },
  reviewsAction: {
    ar: "عرض التقييمات",
    de: "Bewertungen ansehen",
    en: "View Reviews",
  },
  responsibleLabel: {
    ar: "المسؤول",
    de: "Verantwortlich",
    en: "Responsible",
  },
  hoursLabel: {
    ar: "ساعات العمل",
    de: "Arbeitszeiten",
    en: "Working Hours",
  },
  aroundClock: {
    ar: "المنصة متاحة على مدار الساعة",
    de: "Die Plattform ist rund um die Uhr verfügbar",
    en: "The platform is available 24/7",
  },
  directHours: {
    ar: "التواصل المباشر: الاثنين – السبت | 09:00 – 18:00",
    de: "Direkter Kontakt: Montag – Samstag | 09:00 – 18:00",
    en: "Direct contact: Monday – Saturday | 09:00 – 18:00",
  },
  inquiryLabel: {
    ar: "الاستعلام",
    de: "Anfragen",
    en: "Inquiry",
  },
  servicesLabel: {
    ar: "الخدمات",
    de: "Services",
    en: "Services",
  },
  supportLabel: {
    ar: "الشكاوي",
    de: "Beschwerden",
    en: "Complaints",
  },
  mapsAction: {
    ar: "فتح في Google Maps",
    de: "In Google Maps öffnen",
    en: "Open in Google Maps",
  },
  rights: {
    ar: "جميع الحقوق محفوظة",
    de: "Alle Rechte vorbehalten",
    en: "All rights reserved",
  },

  statsEyebrow: {
    ar: "مؤشرات سريعة عن المنصة",
    de: "Schnelle Kennzahlen zur Plattform",
    en: "Quick Platform Metrics",
  },
  statsTitle: {
    ar: "نحوّل فكرتك إلى طلب واضح جاهز للتنفيذ",
    de: "Wir verwandeln deine Idee in eine klare, umsetzbare Anfrage",
    en: "We turn your idea into a clear, ready-to-execute request",
  },
  statsDescription: {
    ar: "هذه المؤشرات تمهّد لعداد فعلي وربط أدق لاحقًا، وتوضح للعميل أن الطلب يمر عبر منصة منظمة لا مجرد صفحة تواصل.",
    de: "Diese Kennzahlen bereiten eine spätere echte Zählung und genauere Verknüpfung vor und zeigen dem Kunden, dass die Anfrage über eine strukturierte Plattform läuft – nicht nur über eine Kontaktseite.",
    en: "These metrics prepare the page for a real counter and deeper integrations later, while showing the customer that requests go through a structured platform, not just a contact page.",
  },
  requestsStatLabel: {
    ar: "الطلبات المنظمة",
    de: "Strukturierte Anfragen",
    en: "Structured Requests",
  },
  servicesStatLabel: {
    ar: "الفئات والخدمات",
    de: "Kategorien & Services",
    en: "Categories & Services",
  },
  availabilityStatLabel: {
    ar: "جاهزية المنصة",
    de: "Plattform-Verfügbarkeit",
    en: "Platform Availability",
  },
  requestsStatNote: {
    ar: "عداد تمهيدي بصري، وسنربطه لاحقًا بعداد حقيقي من الطلبات المرسلة.",
    de: "Visueller Vorab-Zähler; er wird später mit einem echten Anfragezähler verbunden.",
    en: "Visual starter counter that will later be connected to a real submitted-requests counter.",
  },
  servicesStatNote: {
    ar: "تجميع واسع لخدمات الطباعة والإعلان والتجهيزات البصرية.",
    de: "Breite Zusammenstellung für Druck, Werbung und visuelle Ausführung.",
    en: "A broad collection of print, advertising, and visual execution services.",
  },
  availabilityStatNote: {
    ar: "المنصة تستقبل الطلبات طوال الوقت مع متابعة بشرية ضمن أوقات العمل.",
    de: "Die Plattform nimmt Anfragen jederzeit an, mit persönlicher Betreuung während der Arbeitszeiten.",
    en: "The platform accepts requests anytime, with human follow-up during working hours.",
  },

  trustEyebrow: {
    ar: "لماذا هذه المنصة مختلفة",
    de: "Warum diese Plattform anders ist",
    en: "Why This Platform Is Different",
  },
  trustTitle: {
    ar: "ليست صفحة عادية، بل نظام يهيّئ الطلب للتنفيذ",
    de: "Keine gewöhnliche Seite, sondern ein System, das Anfragen für die Umsetzung vorbereitet",
    en: "Not a regular page, but a system that prepares requests for execution",
  },
  trustCardOneTitle: {
    ar: "فهم الطلب قبل تنفيذه",
    de: "Die Anfrage verstehen, bevor sie ausgeführt wird",
    en: "Understanding the request before execution",
  },
  trustCardOneText: {
    ar: "المنصة تساعد العميل على تنظيم تفاصيله بدل إرسال طلب ناقص أو مشتت.",
    de: "Die Plattform hilft dem Kunden, seine Angaben zu strukturieren, statt eine unklare oder unvollständige Anfrage zu senden.",
    en: "The platform helps the customer organize the request instead of sending something incomplete or unclear.",
  },
  trustCardTwoTitle: {
    ar: "ربط ذكي بين الفكرة والتنفيذ",
    de: "Intelligente Verbindung zwischen Idee und Ausführung",
    en: "Smart connection between idea and execution",
  },
  trustCardTwoText: {
    ar: "سواء كان الطلب طباعة، تصميم، تصنيع، أو تجهيز محل، يتم جمعه بشكل أوضح وأكثر قابلية للتنفيذ.",
    de: "Ob Druck, Design, Fertigung oder Ladenausstattung – die Anfrage wird klarer und umsetzbarer strukturiert.",
    en: "Whether it is print, design, fabrication, or store setup, the request is structured more clearly and made more executable.",
  },
  trustCardThreeTitle: {
    ar: "تجهيز للتوسع والربط الحقيقي",
    de: "Vorbereitet für Wachstum und echte Verknüpfung",
    en: "Prepared for growth and real integrations",
  },
  trustCardThreeText: {
    ar: "البنية الحالية تمهّد للعداد الفعلي، رفع الملفات، تتبع الطلبات، وربط أقوى في المستقبل.",
    de: "Die aktuelle Struktur bereitet echte Zähler, Datei-Uploads, Anfragenverfolgung und stärkere Integrationen für die Zukunft vor.",
    en: "The current structure prepares the platform for real counters, file uploads, request tracking, and stronger integrations in the future.",
  },
};

const contactInfo = {
  responsibleName: "Refat Al-Youssef",
  address: "Fanningerstraße 20, 10365 Berlin",
  mapsHref: "https://maps.app.goo.gl/fvs6SESQikKQ2GUD6",
  reviewsHref:
    "https://www.google.com/maps/place/Caro+Bara/@52.5143151,13.4936307,17z/data=!4m18!1m9!3m8!1s0x47a84f4acce6dfe7:0xc089293c112be34b!2sCaro+Bara!8m2!3d52.5143151!4d13.4936307!9m1!1b1!16s%2Fg%2F11vxyjg_91!3m7!1s0x47a84f4acce6dfe7:0xc089293c112be34b!8m2!3d52.5143151!4d13.4936307!9m1!1b1!16s%2Fg%2F11vxyjg_91?entry=ttu&g_ep=EgoyMDI2MDQwMS4wIKXMDSoASAFQAw%3D%3D",
  phone: "+49 30 68965559",
  whatsappNumber: "+49 176 21105086",
  whatsappHref: "https://wa.me/4917621105086",
  inquiryEmail: "info@carobara.com",
  servicesEmail: "serves@carobara.com",
  supportEmail: "help@carobara.com",
  website: "www.carobara.de",
  websiteHref: "https://www.carobara.de",
  facebookHref: "https://facebook.com",
  instagramHref: "https://instagram.com",
  tiktokHref: "https://tiktok.com",
};

const homepageStats = [
  {
    key: "requests",
    value: "1,284+",
    icon: FileText,
  },
  {
    key: "services",
    value: "20+",
    icon: Layers3,
  },
  {
    key: "availability",
    value: "24/7",
    icon: ShieldCheck,
  },
] as const;

export default function Home() {
  const { language, dir } = useLanguage();

  const statContent = {
    requests: {
      label: pageText.requestsStatLabel[language],
      note: pageText.requestsStatNote[language],
    },
    services: {
      label: pageText.servicesStatLabel[language],
      note: pageText.servicesStatNote[language],
    },
    availability: {
      label: pageText.availabilityStatLabel[language],
      note: pageText.availabilityStatNote[language],
    },
  };

  return (
    <main
      dir={dir}
      style={{
        fontFamily: "Arial, sans-serif",
        background: "#f5f1eb",
        color: "#2f2419",
        minHeight: "100vh",
      }}
    >
      <Header />

      <Hero lang={language} />

      <section
        style={{
          padding: "28px 20px 0",
        }}
      >
        <div
          style={{
            maxWidth: "1220px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              border: "1px solid #e2d7c8",
              background: "linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(251,248,244,0.92) 100%)",
              borderRadius: "30px",
              padding: "28px",
              boxShadow: "0 12px 32px rgba(70, 49, 29, 0.05)",
            }}
          >
            <div
              style={{
                maxWidth: "760px",
                marginBottom: "22px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#8a735c",
                  marginBottom: "10px",
                }}
              >
                {pageText.statsEyebrow[language]}
              </div>

              <h2
                style={{
                  margin: "0 0 10px",
                  fontSize: "clamp(24px, 3vw, 38px)",
                  lineHeight: 1.15,
                  color: "#2f2419",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                }}
              >
                {pageText.statsTitle[language]}
              </h2>

              <p
                style={{
                  margin: 0,
                  fontSize: "15px",
                  lineHeight: 1.9,
                  color: "#665443",
                  maxWidth: "760px",
                }}
              >
                {pageText.statsDescription[language]}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              {homepageStats.map((item) => {
                const Icon = item.icon;
                const content = statContent[item.key];

                return (
                  <div
                    key={item.key}
                    style={{
                      background: "#fffaf5",
                      border: "1px solid #e6dbcd",
                      borderRadius: "22px",
                      padding: "20px 18px",
                      boxShadow: "0 8px 24px rgba(70, 49, 29, 0.04)",
                    }}
                  >
                    <div
                      style={{
                        width: "46px",
                        height: "46px",
                        borderRadius: "16px",
                        background: "#f3ece3",
                        border: "1px solid #e3d6c7",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#3d3024",
                        marginBottom: "14px",
                      }}
                    >
                      <Icon size={19} />
                    </div>

                    <div
                      style={{
                        fontSize: "30px",
                        lineHeight: 1,
                        fontWeight: 800,
                        color: "#2f2419",
                        marginBottom: "10px",
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {item.value}
                    </div>

                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "#3d3024",
                        marginBottom: "8px",
                      }}
                    >
                      {content.label}
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        lineHeight: 1.8,
                        color: "#715f4e",
                      }}
                    >
                      {content.note}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
            <section
        style={{
          padding: "18px 20px 0",
        }}
      >
        <div
          style={{
            maxWidth: "1220px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.15fr) minmax(0, 1fr)",
              gap: "18px",
            }}
          >
            <div
              style={{
                border: "1px solid #e2d7c8",
                background: "linear-gradient(180deg, rgba(255,255,255,0.78) 0%, rgba(251,248,244,0.96) 100%)",
                borderRadius: "30px",
                padding: "28px",
                boxShadow: "0 12px 32px rgba(70, 49, 29, 0.05)",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#8a735c",
                  marginBottom: "10px",
                }}
              >
                {pageText.trustEyebrow[language]}
              </div>

              <h2
                style={{
                  margin: "0 0 12px",
                  fontSize: "clamp(24px, 3vw, 36px)",
                  lineHeight: 1.15,
                  color: "#2f2419",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  maxWidth: "700px",
                }}
              >
                {pageText.trustTitle[language]}
              </h2>

              <div
                style={{
                  display: "grid",
                  gap: "14px",
                  marginTop: "20px",
                }}
              >
                <div
                  style={{
                    background: "#fffaf5",
                    border: "1px solid #e6dbcd",
                    borderRadius: "22px",
                    padding: "18px 18px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 800,
                      color: "#2f2419",
                      marginBottom: "8px",
                    }}
                  >
                    {pageText.trustCardOneTitle[language]}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      lineHeight: 1.9,
                      color: "#6d5947",
                    }}
                  >
                    {pageText.trustCardOneText[language]}
                  </p>
                </div>

                <div
                  style={{
                    background: "#fffaf5",
                    border: "1px solid #e6dbcd",
                    borderRadius: "22px",
                    padding: "18px 18px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 800,
                      color: "#2f2419",
                      marginBottom: "8px",
                    }}
                  >
                    {pageText.trustCardTwoTitle[language]}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      lineHeight: 1.9,
                      color: "#6d5947",
                    }}
                  >
                    {pageText.trustCardTwoText[language]}
                  </p>
                </div>

                <div
                  style={{
                    background: "#fffaf5",
                    border: "1px solid #e6dbcd",
                    borderRadius: "22px",
                    padding: "18px 18px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 800,
                      color: "#2f2419",
                      marginBottom: "8px",
                    }}
                  >
                    {pageText.trustCardThreeTitle[language]}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      lineHeight: 1.9,
                      color: "#6d5947",
                    }}
                  >
                    {pageText.trustCardThreeText[language]}
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                border: "1px solid #e2d7c8",
                background: "linear-gradient(180deg, #2f2419 0%, #3b2d20 100%)",
                borderRadius: "30px",
                padding: "28px",
                boxShadow: "0 16px 36px rgba(49, 35, 22, 0.12)",
                color: "#fffaf4",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "100%",
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
                    border: "1px solid rgba(255,255,255,0.12)",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "16px",
                  }}
                >
                  <ShieldCheck size={15} />
                  <span>{pageText.availabilityStatLabel[language]}</span>
                </div>

                <h3
                  style={{
                    margin: "0 0 12px",
                    fontSize: "clamp(22px, 2.8vw, 34px)",
                    lineHeight: 1.15,
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {pageText.footerTitle[language]}
                </h3>

                <p
                  style={{
                    margin: 0,
                    fontSize: "15px",
                    lineHeight: 1.95,
                    color: "rgba(255,250,244,0.84)",
                    maxWidth: "520px",
                  }}
                >
                  {pageText.footerDescription[language]}
                </p>
              </div>

              <div
                style={{
                  marginTop: "24px",
                  display: "grid",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    borderRadius: "20px",
                    padding: "16px 16px",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      marginBottom: "6px",
                      color: "#f2e6d8",
                    }}
                  >
                    {pageText.requestsStatLabel[language]}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      lineHeight: 1.85,
                      color: "rgba(255,250,244,0.82)",
                    }}
                  >
                    {pageText.requestsStatNote[language]}
                  </div>
                </div>

                <div
                  style={{
                    borderRadius: "20px",
                    padding: "16px 16px",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      marginBottom: "6px",
                      color: "#f2e6d8",
                    }}
                  >
                    {pageText.servicesStatLabel[language]}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      lineHeight: 1.85,
                      color: "rgba(255,250,244,0.82)",
                    }}
                  >
                    {pageText.servicesStatNote[language]}
                  </div>
                </div>

                <div
                  style={{
                    borderRadius: "20px",
                    padding: "16px 16px",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      marginBottom: "6px",
                      color: "#f2e6d8",
                    }}
                  >
                    {pageText.availabilityStatLabel[language]}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      lineHeight: 1.85,
                      color: "rgba(255,250,244,0.82)",
                    }}
                  >
                    {pageText.availabilityStatNote[language]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer
        style={{
          background: "#f1ebe2",
          borderTop: "1px solid #e2d7c8",
          marginTop: "44px",
        }}
      >
        <div
          style={{
            maxWidth: "1220px",
            margin: "0 auto",
            padding: "52px 20px 24px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "22px",
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.42)",
                border: "1px solid #e2d7c8",
                borderRadius: "26px",
                padding: "26px",
                boxShadow: "0 10px 30px rgba(70, 49, 29, 0.04)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h3
                style={{
                  margin: "0 0 10px",
                  fontSize: "24px",
                  lineHeight: 1.2,
                  color: "#2f2419",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                {pageText.footerTitle[language]}
              </h3>

              <p
                style={{
                  margin: "0 0 22px",
                  fontSize: "14px",
                  lineHeight: 1.9,
                  color: "#665443",
                  maxWidth: "420px",
                }}
              >
                {pageText.footerDescription[language]}
              </p>
                            <a
                href={contactInfo.mapsHref}
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "16px 16px",
                  borderRadius: "18px",
                  background: "#fbf8f4",
                  border: "1px solid #e6dbcd",
                  marginBottom: "20px",
                }}
              >
                <MapPin size={18} style={{ marginTop: "3px", flexShrink: 0 }} />
                <div>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      lineHeight: 1.6,
                      color: "#2f2419",
                      marginBottom: "4px",
                    }}
                  >
                    {contactInfo.address}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#7a6856",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>{pageText.mapsAction[language]}</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </a>

              <div
                style={{
                  display: "grid",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    color: "#5d4a39",
                    fontSize: "14px",
                    lineHeight: 1.75,
                  }}
                >
                  <User size={16} style={{ marginTop: "3px", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: "2px" }}>
                      {pageText.responsibleLabel[language]}
                    </div>
                    <div>{contactInfo.responsibleName}</div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    color: "#5d4a39",
                    fontSize: "14px",
                    lineHeight: 1.75,
                  }}
                >
                  <Clock3 size={16} style={{ marginTop: "3px", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: "2px" }}>
                      {pageText.hoursLabel[language]}
                    </div>
                    <div>{pageText.aroundClock[language]}</div>
                    <div>{pageText.directHours[language]}</div>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.42)",
                border: "1px solid #e2d7c8",
                borderRadius: "26px",
                padding: "26px",
                boxShadow: "0 10px 30px rgba(70, 49, 29, 0.04)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h4
                style={{
                  margin: "0 0 20px",
                  fontSize: "16px",
                  color: "#2f2419",
                  fontWeight: 700,
                }}
              >
                {pageText.contactTitle[language]}
              </h4>

              <div
                style={{
                  display: "grid",
                  gap: "12px",
                }}
              >
                <a
                  href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    color: "#2f2419",
                    fontSize: "15px",
                    textDecoration: "none",
                    padding: "14px 14px",
                    borderRadius: "16px",
                    background: "#fbf8f4",
                    border: "1px solid #e6dbcd",
                    fontWeight: 600,
                  }}
                >
                  <Phone size={17} />
                  <span>{contactInfo.phone}</span>
                </a>

                <a
                  href={contactInfo.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    color: "#2f2419",
                    fontSize: "15px",
                    textDecoration: "none",
                    padding: "14px 14px",
                    borderRadius: "16px",
                    background: "#fbf8f4",
                    border: "1px solid #e6dbcd",
                    fontWeight: 600,
                  }}
                >
                  <MessageCircle size={17} />
                  <span>{contactInfo.whatsappNumber}</span>
                </a>

                <a
                  href={`mailto:${contactInfo.inquiryEmail}`}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    color: "#5d4a39",
                    fontSize: "14px",
                    textDecoration: "none",
                    padding: "14px 14px",
                    borderRadius: "16px",
                    background: "#fbf8f4",
                    border: "1px solid #e6dbcd",
                  }}
                >
                  <Mail size={17} style={{ marginTop: "2px", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "12px", marginBottom: "3px" }}>
                      {pageText.inquiryLabel[language]}
                    </div>
                    <div>{contactInfo.inquiryEmail}</div>
                  </div>
                </a>

                <a
                  href={`mailto:${contactInfo.servicesEmail}`}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    color: "#5d4a39",
                    fontSize: "14px",
                    textDecoration: "none",
                    padding: "14px 14px",
                    borderRadius: "16px",
                    background: "#fbf8f4",
                    border: "1px solid #e6dbcd",
                  }}
                >
                  <Mail size={17} style={{ marginTop: "2px", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "12px", marginBottom: "3px" }}>
                      {pageText.servicesLabel[language]}
                    </div>
                    <div>{contactInfo.servicesEmail}</div>
                  </div>
                </a>

                <a
                  href={`mailto:${contactInfo.supportEmail}`}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    color: "#5d4a39",
                    fontSize: "14px",
                    textDecoration: "none",
                    padding: "14px 14px",
                    borderRadius: "16px",
                    background: "#fbf8f4",
                    border: "1px solid #e6dbcd",
                  }}
                >
                  <Mail size={17} style={{ marginTop: "2px", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "12px", marginBottom: "3px" }}>
                      {pageText.supportLabel[language]}
                    </div>
                    <div>{contactInfo.supportEmail}</div>
                  </div>
                </a>
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.42)",
                border: "1px solid #e2d7c8",
                borderRadius: "26px",
                padding: "26px",
                boxShadow: "0 10px 30px rgba(70, 49, 29, 0.04)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h4
                style={{
                  margin: "0 0 18px",
                  fontSize: "16px",
                  color: "#2f2419",
                  fontWeight: 700,
                }}
              >
                {pageText.socialTitle[language]}
              </h4>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginBottom: "22px",
                }}
              >
                {[
                  {
                    href: contactInfo.whatsappHref,
                    label: "WhatsApp",
                    icon: MessageCircle,
                  },
                  {
                    href: contactInfo.facebookHref,
                    label: "Facebook",
                    icon: Globe,
                  },
                  {
                    href: contactInfo.instagramHref,
                    label: "Instagram",
                    icon: Camera,
                  },
                  {
                    href: contactInfo.tiktokHref,
                    label: "TikTok",
                    icon: Music2,
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.label}
                      title={item.label}
                      style={{
                        width: "46px",
                        height: "46px",
                        borderRadius: "16px",
                        border: "1px solid #dfd2c1",
                        background: "#fbf8f4",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#3b2f24",
                        textDecoration: "none",
                        transition:
                          "transform 0.18s ease, border-color 0.18s ease, background 0.18s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.borderColor = "#cdb89e";
                        e.currentTarget.style.background = "#f3ece3";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.borderColor = "#dfd2c1";
                        e.currentTarget.style.background = "#fbf8f4";
                      }}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
                            <a
                href={contactInfo.reviewsHref}
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    padding: "18px 18px",
                    borderRadius: "18px",
                    background: "#fbf8f4",
                    border: "1px solid #e6dbcd",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      color: "#2f2419",
                      marginBottom: "10px",
                    }}
                  >
                    <Star size={17} />
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                      }}
                    >
                      {pageText.reviewsTitle[language]}
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: "13px",
                      lineHeight: 1.8,
                      color: "#6b5847",
                      marginBottom: "10px",
                    }}
                  >
                    {pageText.reviewsText[language]}
                  </div>

                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#3f3125",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    <span>{pageText.reviewsAction[language]}</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </a>

              <a
                href={contactInfo.websiteHref}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#5d4a39",
                  fontSize: "14px",
                  textDecoration: "none",
                  padding: "16px 16px",
                  borderRadius: "18px",
                  background: "#fbf8f4",
                  border: "1px solid #e6dbcd",
                }}
              >
                <Globe size={17} />
                <span>{contactInfo.website}</span>
              </a>
            </div>
          </div>

          <div
            style={{
              marginTop: "28px",
              paddingTop: "18px",
              borderTop: "1px solid #e2d7c8",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              color: "#7a6856",
              fontSize: "13px",
            }}
          >
            <span>
              © 2026 {pageText.footerTitle[language]} — {pageText.rights[language]}
            </span>
            <span>{contactInfo.responsibleName}</span>
          </div>
        </div>
      </footer>
    </main>
  );
}