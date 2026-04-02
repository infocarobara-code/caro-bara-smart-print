"use client";

import Hero from "@/components/Hero";
import Link from "next/link";
import { useLanguage } from "@/lib/languageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  UserRound,
  LayoutGrid,
  BadgePercent,
  MessageCircleMore,
  ClipboardList,
  MapPin,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  Camera,
  Music2,
} from "lucide-react";

const pageText = {
  enterSection: {
    ar: "دخول القسم",
    de: "Bereich öffnen",
    en: "Enter section",
  },
  footerTitle: {
    ar: "Caro Bara Smart Print",
    de: "Caro Bara Smart Print",
    en: "Caro Bara Smart Print",
  },
  footerDescription: {
    ar: "منصة احترافية لتنظيم طلبات الطباعة والإعلان والتوجيه إلى أفضل جهة تنفيذ.",
    de: "Eine professionelle Plattform zur strukturierten Annahme, Analyse und Weiterleitung von Druck- und Werbeanfragen.",
    en: "A professional platform for receiving, organizing, and directing print and advertising requests to the best execution partner.",
  },
  contactTitle: {
    ar: "التواصل",
    de: "Kontakt",
    en: "Contact",
  },
  socialTitle: {
    ar: "منصاتنا",
    de: "Social Media",
    en: "Social Media",
  },
  rights: {
    ar: "جميع الحقوق محفوظة",
    de: "Alle Rechte vorbehalten",
    en: "All rights reserved",
  },
};

const navCards = [
  {
    title: {
      ar: "من نحن",
      de: "Über uns",
      en: "About Us",
    },
    description: {
      ar: "رؤية Caro Bara ودورها كجهة تنظم الطلب وتفهمه وتشرف على تنفيذه.",
      de: "Die Vision von Caro Bara und ihre Rolle als Stelle, die Anfragen strukturiert, versteht und deren Umsetzung begleitet.",
      en: "Caro Bara’s vision and its role in structuring, understanding, and supervising requests.",
    },
    href: "/about",
    icon: UserRound,
  },
  {
    title: {
      ar: "خدماتنا",
      de: "Unsere Leistungen",
      en: "Our Services",
    },
    description: {
      ar: "الفئات والخدمات الأساسية بشكل مرتب وواضح يساعد العميل على الاختيار السريع.",
      de: "Die wichtigsten Kategorien und Leistungen in klarer und geordneter Form für eine schnelle Auswahl.",
      en: "Main categories and services presented in a clear and organized way.",
    },
    href: "/services",
    icon: LayoutGrid,
  },
  {
    title: {
      ar: "العروض",
      de: "Angebote",
      en: "Offers",
    },
    description: {
      ar: "عروض وباقات مقترحة للأفراد والشركات وفق طابع احترافي منظم.",
      de: "Angebote und Pakete für Privatkunden und Unternehmen in professioneller Form.",
      en: "Offers and packages for individuals and businesses in a professional format.",
    },
    href: "/offers",
    icon: BadgePercent,
  },
  {
    title: {
      ar: "تواصل معنا",
      de: "Kontakt",
      en: "Contact Us",
    },
    description: {
      ar: "كل وسائل التواصل والاستفسار وطلب المساعدة أو التوضيح قبل تنفيذ المشروع.",
      de: "Alle Kontaktwege für Rückfragen, Unterstützung und Klärung vor der Umsetzung.",
      en: "All contact options for inquiries, support, and clarification before execution.",
    },
    href: "/contact",
    icon: MessageCircleMore,
  },
  {
    title: {
      ar: "اطلب الآن",
      de: "Jetzt anfragen",
      en: "Request Now",
    },
    description: {
      ar: "ابدأ الطلب مباشرة عبر نموذج منظم يساعدنا على فهم مشروعك بسرعة ودقة.",
      de: "Starte deine Anfrage direkt über ein strukturiertes Formular, das uns hilft, dein Projekt schnell und präzise zu verstehen.",
      en: "Start your request directly through a structured form that helps us understand your project quickly and accurately.",
    },
    href: "/request",
    icon: ClipboardList,
  },
];

const contactInfo = {
  name: "Refat Al-youssef",
  address: "Fanninger Straße 20, 10365 Berlin, Deutschland",
  phone: "+49 176 21105086",
  email: "inf@carobara.de",
  website: "www.carobara.de",
  websiteHref: "https://www.carobara.de",
  whatsappHref: "https://wa.me/4917621105086",
  facebookHref: "https://facebook.com",
  instagramHref: "https://instagram.com",
  tiktokHref: "https://tiktok.com",
};

export default function Home() {
  const { language, dir } = useLanguage();

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
      <div
        style={{
          maxWidth: "1220px",
          margin: "0 auto",
          padding: "20px 16px 0",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/platform-guide"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Caro Bara Logo"
          >
            <img
              src="/logo.png"
              alt="Caro Bara Logo"
              style={{
                width: "54px",
                height: "54px",
                objectFit: "contain",
                display: "block",
              }}
            />
          </Link>

          <LanguageSwitcher justify="center" />
        </header>
      </div>

      <Hero lang={language} />

      <section
        style={{
          maxWidth: "1220px",
          margin: "0 auto",
          padding: "0 20px 88px",
          marginTop: "-18px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
          }}
        >
          {navCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.href}
                href={card.href}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  background: "rgba(255,255,255,0.72)",
                  border: "1px solid #e5d8c8",
                  borderRadius: "24px",
                  padding: "22px 20px",
                  minHeight: "220px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 8px 24px rgba(74, 54, 34, 0.04)",
                  transition:
                    "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 28px rgba(74, 54, 34, 0.08)";
                  e.currentTarget.style.borderColor = "#d8c6b1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(74, 54, 34, 0.04)";
                  e.currentTarget.style.borderColor = "#e5d8c8";
                }}
              >
                <div>
                  <div
                    style={{
                      width: "58px",
                      height: "58px",
                      borderRadius: "16px",
                      background: "#eadfce",
                      border: "1px solid #dcc8b0",
                      marginBottom: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={26} strokeWidth={1.9} color="#3d3126" />
                  </div>

                  <h3
                    style={{
                      margin: "0 0 10px",
                      fontSize: "18px",
                      lineHeight: 1.4,
                      fontWeight: 700,
                      color: "#2f2419",
                    }}
                  >
                    {card.title[language]}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      lineHeight: 1.85,
                      color: "#665342",
                    }}
                  >
                    {card.description[language]}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: "18px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#2f2419",
                  }}
                >
                  {pageText.enterSection[language]} →
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <footer
        style={{
          background: "#f1ebe2",
          borderTop: "1px solid #e2d7c8",
        }}
      >
        <div
          style={{
            maxWidth: "1220px",
            margin: "0 auto",
            padding: "42px 20px 24px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.15fr 1fr 0.8fr",
              gap: "28px",
            }}
          >
            <div>
              <h3
                style={{
                  margin: "0 0 12px",
                  fontSize: "20px",
                  lineHeight: 1.4,
                  color: "#2f2419",
                }}
              >
                {pageText.footerTitle[language]}
              </h3>

              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  lineHeight: 1.9,
                  color: "#665443",
                  maxWidth: "460px",
                }}
              >
                {pageText.footerDescription[language]}
              </p>
            </div>

            <div>
              <h4
                style={{
                  margin: "0 0 14px",
                  fontSize: "15px",
                  color: "#2f2419",
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    color: "#5d4a39",
                    fontSize: "14px",
                    lineHeight: 1.7,
                  }}
                >
                  <MapPin size={17} style={{ marginTop: "3px", flexShrink: 0 }} />
                  <span>{contactInfo.address}</span>
                </div>

                <a
                  href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "#5d4a39",
                    fontSize: "14px",
                    textDecoration: "none",
                  }}
                >
                  <Phone size={17} />
                  <span>{contactInfo.phone}</span>
                </a>

                <a
                  href={`mailto:${contactInfo.email}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "#5d4a39",
                    fontSize: "14px",
                    textDecoration: "none",
                  }}
                >
                  <Mail size={17} />
                  <span>{contactInfo.email}</span>
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
                  }}
                >
                  <Globe size={17} />
                  <span>{contactInfo.website}</span>
                </a>
              </div>
            </div>

            <div>
              <h4
                style={{
                  margin: "0 0 14px",
                  fontSize: "15px",
                  color: "#2f2419",
                }}
              >
                {pageText.socialTitle[language]}
              </h4>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
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
                        width: "42px",
                        height: "42px",
                        borderRadius: "12px",
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
              © 2026 {contactInfo.name} — {pageText.rights[language]}
            </span>
            <span>{contactInfo.website}</span>
          </div>
        </div>
      </footer>
    </main>
  );
}