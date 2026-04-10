"use client";

type Lang = "ar" | "de" | "en";

type Props = {
  language: Lang;
};

const sectionText = {
  ariaLabel: {
    ar: "روابط داخلية مختصرة",
    de: "Kompakte interne Links",
    en: "Compact internal links",
  },
  links: {
    request: {
      href: "/request",
      label: {
        ar: "ابدأ طلب طباعة",
        de: "Druckanfrage starten",
        en: "Start print request",
      },
    },
    categories: {
      href: "/request#categories",
      label: {
        ar: "استكشف فئات الطباعة",
        de: "Druckkategorien entdecken",
        en: "Explore print categories",
      },
    },
    guide: {
      href: "/guide",
      label: {
        ar: "دليل الطباعة وآلية العمل",
        de: "Druckleitfaden und Ablauf",
        en: "Printing guide and workflow",
      },
    },
    offers: {
      href: "/offers",
      label: {
        ar: "خدمات وعروض الطباعة",
        de: "Druckservices und Angebote",
        en: "Printing services and offers",
      },
    },
    contact: {
      href: "/#contact",
      label: {
        ar: "تواصل مع خدمة الطباعة",
        de: "Druckservice kontaktieren",
        en: "Contact print service",
      },
    },
    about: {
      href: "/about",
      label: {
        ar: "عن منصة الطباعة",
        de: "Über die Druckplattform",
        en: "About print platform",
      },
    },
  },
} as const;

export default function HomeStatsSection({ language }: Props) {
  const links = [
    sectionText.links.request,
    sectionText.links.categories,
    sectionText.links.guide,
    sectionText.links.offers,
    sectionText.links.contact,
    sectionText.links.about,
  ];

  return (
    <section
      aria-label={sectionText.ariaLabel[language]}
      style={{
        width: "100%",
        minHeight: "clamp(72px, 10vw, 96px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0",
        background: "transparent",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "980px",
          width: "100%",
          paddingInline: "clamp(18px, 4vw, 24px)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* الخط */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "clamp(28px, 7vw, 60px)",
            right: "clamp(28px, 7vw, 60px)",
            top: "50%",
            height: "2px",
            background: "#e0cfbb",
            transform: "translateY(-50%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* النقاط */}
        <div
          style={{
            width: "100%",
            maxWidth: "560px",
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // 🔥 بدل space-between
            gap: "clamp(14px, 3vw, 22px)", // 🔥 توزيع ثابت بدل stretch
            flexWrap: "wrap", // 🔥 يمنع الكسر بالموبايل
            boxSizing: "border-box",
          }}
        >
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              title={item.label[language]}
              aria-label={item.label[language]}
              style={{
                width: "clamp(12px, 2vw, 14px)",
                height: "clamp(12px, 2vw, 14px)",
                borderRadius: "50%",
                background: "#9a6334",
                display: "inline-block",
                boxShadow:
                  "0 0 0 clamp(6px, 1.4vw, 8px) rgba(154, 99, 52, 0.12)",
                transition:
                  "transform 0.22s ease, opacity 0.22s ease, box-shadow 0.22s ease",
                opacity: 0.98,
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.18)";
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.boxShadow =
                  "0 0 0 11px rgba(154, 99, 52, 0.16)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.opacity = "0.98";
                e.currentTarget.style.boxShadow =
                  "0 0 0 8px rgba(154, 99, 52, 0.12)";
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}