"use client";

import { useMemo, useState, useEffect, type CSSProperties } from "react";
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
  ChevronDown,
  Package,
  BadgePercent,
  PanelsTopLeft,
  FileText,
  Info,
} from "lucide-react";
import { contactInfo, pageText } from "@/components/home/home.data";

type Props = {
  language: "ar" | "de" | "en";
};

type FooterPanelId = "contact" | "location" | "social" | "details";

export default function HomeFooter({ language }: Props) {
  const isArabic = language === "ar";
  const [isMobile, setIsMobile] = useState(false);
  const [openPanels, setOpenPanels] = useState<Record<FooterPanelId, boolean>>({
    contact: true,
    location: false,
    social: false,
    details: false,
  });

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth <= 920);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const togglePanel = (panelId: FooterPanelId) => {
    setOpenPanels((prev) => ({
      ...prev,
      [panelId]: !prev[panelId],
    }));
  };

  const text = useMemo(
    () => ({
      quickContact:
        language === "ar"
          ? "تواصل سريع"
          : language === "de"
            ? "Schneller Kontakt"
            : "Quick Contact",

      locationInfo:
        language === "ar"
          ? "الموقع والمواعيد"
          : language === "de"
            ? "Standort & Zeiten"
            : "Location & Hours",

      socialLinks:
        language === "ar"
          ? "الروابط والمنصات"
          : language === "de"
            ? "Links & Plattformen"
            : "Links & Platforms",

      companyDetails:
        language === "ar"
          ? "معلومات إضافية"
          : language === "de"
            ? "Weitere Informationen"
            : "Additional Information",

      internalLinksTitle:
        language === "ar"
          ? "روابط مهمة"
          : language === "de"
            ? "Wichtige Links"
            : "Important Links",

      categoryLink:
        language === "ar"
          ? "استكشف جميع الفئات"
          : language === "de"
            ? "Alle Kategorien ansehen"
            : "Explore all categories",

      requestLink:
        language === "ar"
          ? "ابدأ طلبًا جديدًا"
          : language === "de"
            ? "Neue Anfrage starten"
            : "Start a new request",

      guideLink:
        language === "ar"
          ? "دليل المنصة"
          : language === "de"
            ? "Plattform-Leitfaden"
            : "Platform guide",

      offersLink:
        language === "ar"
          ? "العروض والخدمات"
          : language === "de"
            ? "Angebote & Leistungen"
            : "Offers & Services",

      footerSeoText:
        language === "ar"
          ? "منصة متعددة اللغات لتنظيم طلبات الطباعة والإعلانات واللوحات والتغليف والتجهيزات التجارية بمسار واضح وروابط داخلية ذكية."
          : language === "de"
            ? "Mehrsprachige Plattform für Druck, Beschilderung, Verpackung und Werbetechnik mit klarer Struktur und intelligenter interner Verlinkung."
            : "Multilingual platform for print, signage, packaging, and advertising requests with a clear structure and strong internal linking.",

      smartPathsTitle:
        language === "ar"
          ? "ابدأ من المسار الأقرب لطلبك"
          : language === "de"
            ? "Starte mit dem passenden Anfrageweg"
            : "Start with the closest path to your request",

      smartPathsText:
        language === "ar"
          ? "اختر نقطة البداية الأنسب، ثم انتقل مباشرة إلى المسار الذي يختصر عليك الوقت ويقربك من التنفيذ."
          : language === "de"
            ? "Wähle den passenden Einstieg und gehe direkt zum Weg, der deine Anfrage klarer und schneller zum Ziel bringt."
            : "Choose the best starting point and jump directly into the path that makes your request clearer and faster to execute.",

      smartPathOneTitle:
        language === "ar"
          ? "لوحات وواجهات"
          : language === "de"
            ? "Schilder & Fassaden"
            : "Signs & Facades",

      smartPathOneText:
        language === "ar"
          ? "للمحال، الحروف البارزة، الإضاءات، والواجهات التجارية."
          : language === "de"
            ? "Für Geschäfte, Leuchtwerbung, Profilbuchstaben und Fassaden."
            : "For shops, illuminated signs, raised letters, and storefronts.",

      smartPathTwoTitle:
        language === "ar"
          ? "مطبوعات ورقية"
          : language === "de"
            ? "Papierdruck"
            : "Paper Printing",

      smartPathTwoText:
        language === "ar"
          ? "بطاقات، فلايرات، منيوهات، بوسترات، وأوراق رسمية."
          : language === "de"
            ? "Visitenkarten, Flyer, Speisekarten, Poster und Geschäftsdruck."
            : "Cards, flyers, menus, posters, and business stationery.",

      smartPathThreeTitle:
        language === "ar"
          ? "تغليف وملصقات"
          : language === "de"
            ? "Verpackung & Etiketten"
            : "Packaging & Labels",

      smartPathThreeText:
        language === "ar"
          ? "ملصقات المنتجات، العلب، التغليف، والهوية على العبوات."
          : language === "de"
            ? "Produktetiketten, Verpackung, Boxen und Markendarstellung."
            : "Product labels, boxes, packaging, and branded presentation.",

      smartPathFourTitle:
        language === "ar"
          ? "طلب مفتوح"
          : language === "de"
            ? "Offene Anfrage"
            : "Open Request",

      smartPathFourText:
        language === "ar"
          ? "إذا لم تكن متأكدًا من المسار الصحيح، ابدأ من هنا."
          : language === "de"
            ? "Wenn du dir noch nicht sicher bist, beginne hier."
            : "Start here if you are not yet sure which path fits best.",

      smartPathsBottomTitle:
        language === "ar"
          ? "انتقال سريع وذكي"
          : language === "de"
            ? "Schneller intelligenter Einstieg"
            : "Fast smart entry",

      smartPathsBottomText:
        language === "ar"
          ? "هذا القسم مصمم ليقود العميل إلى أقرب مسار حقيقي بدل تركه أمام فراغ بصري أو محتوى زائد."
          : language === "de"
            ? "Dieser Bereich führt Nutzer direkt zum passenden Weg, statt leeren Raum oder unnötige Inhalte zu zeigen."
            : "This area guides users into the most relevant path instead of leaving them with empty space or extra noise.",

      hiddenIntroTitle:
        language === "ar"
          ? "نبذة سريعة"
          : language === "de"
            ? "Kurzer Überblick"
            : "Quick Overview",

      hiddenIntroText:
        language === "ar"
          ? "هذا القسم يجمع الروابط الداعمة والنصوص الثانوية بطريقة مخفية ومنظمة حتى تبقى الواجهة الأساسية نظيفة وواضحة."
          : language === "de"
            ? "Dieser Bereich sammelt unterstützende Links und sekundäre Inhalte auf eine ruhige Weise, damit die Hauptansicht klar und sauber bleibt."
            : "This section keeps supporting links and secondary content tucked away so the main interface stays clean and focused.",
    }),
    [language]
  );

  const socialItems = [
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
  ];

  const smartPaths = [
    {
      href: "/request/category/signage",
      icon: PanelsTopLeft,
      title: text.smartPathOneTitle,
      text: text.smartPathOneText,
    },
    {
      href: "/request/category/printing",
      icon: FileText,
      title: text.smartPathTwoTitle,
      text: text.smartPathTwoText,
    },
    {
      href: "/request/category/packaging",
      icon: Package,
      title: text.smartPathThreeTitle,
      text: text.smartPathThreeText,
    },
    {
      href: "/request/service/open-request",
      icon: BadgePercent,
      title: text.smartPathFourTitle,
      text: text.smartPathFourText,
    },
  ];

  const panelButtonStyle = (isOpen: boolean): CSSProperties => ({
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: isMobile ? "16px 16px" : "18px 20px",
    borderRadius: isOpen ? "18px 18px 0 0" : "18px",
    border: "1px solid #e3d7ca",
    background: isOpen
      ? "linear-gradient(180deg, #fbf7f2 0%, #f6efe7 100%)"
      : "linear-gradient(180deg, #fffaf5 0%, #faf5ef 100%)",
    color: "#2f2419",
    cursor: "pointer",
    textAlign: isArabic ? "right" : "left",
    transition:
      "background 0.18s ease, border-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease",
    boxShadow: isOpen
      ? "0 10px 22px rgba(70, 49, 29, 0.06)"
      : "0 4px 12px rgba(70, 49, 29, 0.03)",
    boxSizing: "border-box",
  });

  const panelContentStyle: CSSProperties = {
    border: "1px solid #e7dccf",
    borderTop: "none",
    borderBottomLeftRadius: "18px",
    borderBottomRightRadius: "18px",
    background: "rgba(255,255,255,0.7)",
    padding: isMobile ? "12px" : "16px",
    display: "grid",
    gap: "12px",
    boxSizing: "border-box",
  };

  const itemCardStyle: CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: isMobile ? "12px" : "14px",
    borderRadius: "16px",
    border: "1px solid #e8ddd1",
    background: "#fbf8f4",
    color: "#5d4a39",
    textDecoration: "none",
    boxSizing: "border-box",
    minWidth: 0,
  };

  const secondaryLinkStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid #e6dbcd",
    background: "#fbf8f4",
    color: "#2f2419",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 700,
    maxWidth: "100%",
    boxSizing: "border-box",
  };

  const miniTitleStyle: CSSProperties = {
    margin: 0,
    fontSize: "14px",
    fontWeight: 800,
    color: "#2f2419",
    wordBreak: "break-word",
  };

  const miniTextStyle: CSSProperties = {
    margin: "4px 0 0",
    fontSize: "13px",
    lineHeight: 1.8,
    color: "#6b5847",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
  };

  return (
    <footer
      id="contact"
      style={{
        background: "linear-gradient(180deg, #f4eee6 0%, #f0e9df 100%)",
        borderTop: "1px solid #e2d7c8",
        marginTop: isMobile ? "22px" : "48px",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1220px",
          margin: "0 auto",
          padding: isMobile ? "18px 12px 20px" : "28px 20px 24px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: isMobile ? "12px" : "16px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "minmax(0, 1fr)"
                : "minmax(280px, 0.82fr) minmax(0, 1.18fr)",
              gap: isMobile ? "12px" : "14px",
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.5)",
                border: "1px solid #e2d7c8",
                borderRadius: isMobile ? "22px" : "26px",
                padding: isMobile ? "12px" : "14px",
                boxShadow: "0 10px 28px rgba(70, 49, 29, 0.04)",
                display: "grid",
                gap: "12px",
                minHeight: "100%",
                minWidth: 0,
                boxSizing: "border-box",
                order: 1,
              }}
            >
              <div>
                <button
                  type="button"
                  aria-expanded={openPanels.contact}
                  onClick={() => togglePanel("contact")}
                  style={panelButtonStyle(openPanels.contact)}
                  onMouseEnter={(e) => {
                    if (isMobile) return;
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.borderColor = "#d8c5b2";
                  }}
                  onMouseLeave={(e) => {
                    if (isMobile) return;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "#e3d7ca";
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "15px",
                      fontWeight: 800,
                      minWidth: 0,
                    }}
                  >
                    <Phone size={16} />
                    {text.quickContact}
                  </span>

                  <ChevronDown
                    size={18}
                    style={{
                      transform: openPanels.contact
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.18s ease",
                      flexShrink: 0,
                    }}
                  />
                </button>

                {openPanels.contact && (
                  <div style={panelContentStyle}>
                    <a
                      href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
                      style={itemCardStyle}
                    >
                      <Phone size={17} style={{ marginTop: "2px", flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={miniTitleStyle}>{pageText.contactTitle[language]}</p>
                        <p style={miniTextStyle}>{contactInfo.phone}</p>
                      </div>
                    </a>

                    <a
                      href={contactInfo.whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      style={itemCardStyle}
                    >
                      <MessageCircle
                        size={17}
                        style={{ marginTop: "2px", flexShrink: 0 }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <p style={miniTitleStyle}>WhatsApp</p>
                        <p style={miniTextStyle}>{contactInfo.whatsappNumber}</p>
                      </div>
                    </a>

                    <a
                      href={`mailto:${contactInfo.inquiryEmail}`}
                      style={itemCardStyle}
                    >
                      <Mail size={17} style={{ marginTop: "2px", flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={miniTitleStyle}>{pageText.inquiryLabel[language]}</p>
                        <p style={miniTextStyle}>{contactInfo.inquiryEmail}</p>
                      </div>
                    </a>

                    <a
                      href={`mailto:${contactInfo.servicesEmail}`}
                      style={itemCardStyle}
                    >
                      <Mail size={17} style={{ marginTop: "2px", flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={miniTitleStyle}>{pageText.servicesLabel[language]}</p>
                        <p style={miniTextStyle}>{contactInfo.servicesEmail}</p>
                      </div>
                    </a>

                    <a
                      href={`mailto:${contactInfo.supportEmail}`}
                      style={itemCardStyle}
                    >
                      <Mail size={17} style={{ marginTop: "2px", flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={miniTitleStyle}>{pageText.supportLabel[language]}</p>
                        <p style={miniTextStyle}>{contactInfo.supportEmail}</p>
                      </div>
                    </a>
                  </div>
                )}
              </div>

              <div>
                <button
                  type="button"
                  aria-expanded={openPanels.location}
                  onClick={() => togglePanel("location")}
                  style={panelButtonStyle(openPanels.location)}
                  onMouseEnter={(e) => {
                    if (isMobile) return;
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.borderColor = "#d8c5b2";
                  }}
                  onMouseLeave={(e) => {
                    if (isMobile) return;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "#e3d7ca";
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "15px",
                      fontWeight: 800,
                      minWidth: 0,
                    }}
                  >
                    <MapPin size={16} />
                    {text.locationInfo}
                  </span>

                  <ChevronDown
                    size={18}
                    style={{
                      transform: openPanels.location
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.18s ease",
                      flexShrink: 0,
                    }}
                  />
                </button>

                {openPanels.location && (
                  <div style={panelContentStyle}>
                    <a
                      href={contactInfo.mapsHref}
                      target="_blank"
                      rel="noreferrer"
                      style={itemCardStyle}
                    >
                      <MapPin size={18} style={{ marginTop: "2px", flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={miniTitleStyle}>{pageText.mapsAction[language]}</p>
                        <p style={miniTextStyle}>{contactInfo.address}</p>
                      </div>
                    </a>

                    <div style={itemCardStyle}>
                      <User size={16} style={{ marginTop: "2px", flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={miniTitleStyle}>
                          {pageText.responsibleLabel[language]}
                        </p>
                        <p style={miniTextStyle}>{contactInfo.responsibleName}</p>
                      </div>
                    </div>

                    <div style={itemCardStyle}>
                      <Clock3 size={16} style={{ marginTop: "2px", flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={miniTitleStyle}>{pageText.hoursLabel[language]}</p>
                        <p style={miniTextStyle}>{pageText.aroundClock[language]}</p>
                        <p style={miniTextStyle}>{pageText.directHours[language]}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <button
                  type="button"
                  aria-expanded={openPanels.social}
                  onClick={() => togglePanel("social")}
                  style={panelButtonStyle(openPanels.social)}
                  onMouseEnter={(e) => {
                    if (isMobile) return;
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.borderColor = "#d8c5b2";
                  }}
                  onMouseLeave={(e) => {
                    if (isMobile) return;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "#e3d7ca";
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "15px",
                      fontWeight: 800,
                      minWidth: 0,
                    }}
                  >
                    <Globe size={16} />
                    {text.socialLinks}
                  </span>

                  <ChevronDown
                    size={18}
                    style={{
                      transform: openPanels.social
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.18s ease",
                      flexShrink: 0,
                    }}
                  />
                </button>

                {openPanels.social && (
                  <div style={panelContentStyle}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      {socialItems.map((item) => {
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
                              flexShrink: 0,
                            }}
                            onMouseEnter={(e) => {
                              if (isMobile) return;
                              e.currentTarget.style.transform = "translateY(-2px)";
                              e.currentTarget.style.borderColor = "#cdb89e";
                              e.currentTarget.style.background = "#f3ece3";
                            }}
                            onMouseLeave={(e) => {
                              if (isMobile) return;
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
                      style={itemCardStyle}
                    >
                      <Star size={17} style={{ marginTop: "2px", flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={miniTitleStyle}>{pageText.reviewsTitle[language]}</p>
                        <p style={miniTextStyle}>{pageText.reviewsText[language]}</p>
                        <p
                          style={{
                            ...miniTextStyle,
                            fontWeight: 700,
                            color: "#3f3125",
                          }}
                        >
                          {pageText.reviewsAction[language]}
                        </p>
                      </div>
                    </a>

                    <a
                      href={contactInfo.websiteHref}
                      target="_blank"
                      rel="noreferrer"
                      style={itemCardStyle}
                    >
                      <Globe size={17} style={{ marginTop: "2px", flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={miniTitleStyle}>{pageText.socialTitle[language]}</p>
                        <p style={miniTextStyle}>{contactInfo.website}</p>
                      </div>
                    </a>
                  </div>
                )}
              </div>

              <div>
                <button
                  type="button"
                  aria-expanded={openPanels.details}
                  onClick={() => togglePanel("details")}
                  style={panelButtonStyle(openPanels.details)}
                  onMouseEnter={(e) => {
                    if (isMobile) return;
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.borderColor = "#d8c5b2";
                  }}
                  onMouseLeave={(e) => {
                    if (isMobile) return;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "#e3d7ca";
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "15px",
                      fontWeight: 800,
                      minWidth: 0,
                    }}
                  >
                    <Info size={16} />
                    {text.companyDetails}
                  </span>

                  <ChevronDown
                    size={18}
                    style={{
                      transform: openPanels.details
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.18s ease",
                      flexShrink: 0,
                    }}
                  />
                </button>

                {openPanels.details && (
                  <div style={panelContentStyle}>
                    <div style={itemCardStyle}>
                      <div style={{ minWidth: 0 }}>
                        <p style={miniTitleStyle}>{text.hiddenIntroTitle}</p>
                        <p style={miniTextStyle}>{text.hiddenIntroText}</p>
                      </div>
                    </div>

                    <div style={itemCardStyle}>
                      <div style={{ minWidth: 0 }}>
                        <p style={miniTitleStyle}>{text.internalLinksTitle}</p>

                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                            marginTop: "10px",
                          }}
                        >
                          <a href="/request" style={secondaryLinkStyle}>
                            <ArrowUpRight size={15} />
                            <span>{text.requestLink}</span>
                          </a>

                          <a href="/request#categories" style={secondaryLinkStyle}>
                            <ArrowUpRight size={15} />
                            <span>{text.categoryLink}</span>
                          </a>

                          <a href="/guide" style={secondaryLinkStyle}>
                            <ArrowUpRight size={15} />
                            <span>{text.guideLink}</span>
                          </a>

                          <a href="/offers" style={secondaryLinkStyle}>
                            <ArrowUpRight size={15} />
                            <span>{text.offersLink}</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: "12px",
                        lineHeight: 1.8,
                        color: "#8a7663",
                        opacity: 0.78,
                        textAlign: isArabic ? "right" : "left",
                        paddingInline: "2px",
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {text.footerSeoText}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.5)",
                border: "1px solid #e2d7c8",
                borderRadius: isMobile ? "22px" : "26px",
                padding: isMobile ? "16px" : "22px",
                boxShadow: "0 10px 28px rgba(70, 49, 29, 0.04)",
                display: "grid",
                gap: isMobile ? "14px" : "18px",
                minHeight: "100%",
                minWidth: 0,
                boxSizing: "border-box",
                order: 2,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gap: "8px",
                  textAlign: isArabic ? "right" : "left",
                  minWidth: 0,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: isMobile
                      ? "clamp(20px, 7vw, 28px)"
                      : "clamp(22px, 2.8vw, 34px)",
                    lineHeight: 1.1,
                    color: "#2f2419",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {text.smartPathsTitle}
                </h3>

                <p
                  style={{
                    margin: 0,
                    fontSize: isMobile ? "13px" : "14px",
                    lineHeight: 1.9,
                    color: "#665443",
                    maxWidth: "760px",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {text.smartPathsText}
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "minmax(0, 1fr)"
                    : "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "12px",
                  alignContent: "start",
                }}
              >
                {smartPaths.map((item) => {
                  const Icon = item.icon;

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      style={{
                        display: "grid",
                        gap: "12px",
                        textDecoration: "none",
                        color: "#2f2419",
                        padding: isMobile ? "16px" : "18px",
                        borderRadius: "22px",
                        border: "1px solid #e4d8cb",
                        background:
                          "linear-gradient(180deg, #fffaf5 0%, #fbf5ee 100%)",
                        boxShadow: "0 8px 22px rgba(70, 49, 29, 0.03)",
                        transition:
                          "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, background 0.18s ease",
                        boxSizing: "border-box",
                        minWidth: 0,
                      }}
                      onMouseEnter={(e) => {
                        if (isMobile) return;
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 16px 30px rgba(70, 49, 29, 0.07)";
                        e.currentTarget.style.borderColor = "#d7c3ae";
                        e.currentTarget.style.background =
                          "linear-gradient(180deg, #fffdf9 0%, #faf3ea 100%)";
                      }}
                      onMouseLeave={(e) => {
                        if (isMobile) return;
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 22px rgba(70, 49, 29, 0.03)";
                        e.currentTarget.style.borderColor = "#e4d8cb";
                        e.currentTarget.style.background =
                          "linear-gradient(180deg, #fffaf5 0%, #fbf5ee 100%)";
                      }}
                    >
                      <div
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "14px",
                          border: "1px solid #e4d7c7",
                          background: "#f5ece1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#3d3024",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={18} />
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gap: "6px",
                          textAlign: isArabic ? "right" : "left",
                          minWidth: 0,
                        }}
                      >
                        <div
                          style={{
                            fontSize: isMobile ? "16px" : "17px",
                            lineHeight: 1.3,
                            fontWeight: 800,
                            color: "#2f2419",
                            wordBreak: "break-word",
                          }}
                        >
                          {item.title}
                        </div>

                        <div
                          style={{
                            fontSize: "13px",
                            lineHeight: 1.8,
                            color: "#675444",
                            wordBreak: "break-word",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {item.text}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "13px",
                          fontWeight: 800,
                          color: "#3f3125",
                          flexWrap: "wrap",
                        }}
                      >
                        <span>{text.requestLink}</span>
                        <ArrowUpRight size={14} />
                      </div>
                    </a>
                  );
                })}
              </div>

              <div
                style={{
                  borderTop: "1px solid #e9ddcf",
                  paddingTop: "14px",
                  display: "grid",
                  gap: "6px",
                  textAlign: isArabic ? "right" : "left",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    color: "#2f2419",
                  }}
                >
                  {text.smartPathsBottomTitle}
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    lineHeight: 1.8,
                    color: "#7a6856",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {text.smartPathsBottomText}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.42)",
              border: "1px solid #e2d7c8",
              borderRadius: "22px",
              padding: isMobile ? "14px 14px" : "16px 18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              gap: "12px",
              flexWrap: "wrap",
              color: "#7a6856",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          >
            <span style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
              © 2026 {pageText.footerTitle[language]} — {pageText.rights[language]}
            </span>
            <span style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
              {contactInfo.responsibleName}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}