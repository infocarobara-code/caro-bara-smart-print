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
        maxWidth: "100%",
        minWidth: 0,
        minHeight: "clamp(72px, 10vw, 96px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0",
        background: "transparent",
        overflowX: "clip",
        overflowY: "visible",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "980px",
          width: "100%",
          minWidth: 0,
          paddingInline: "clamp(18px, 4vw, 24px)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          overflowX: "clip",
          overflowY: "visible",
          background: "transparent",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            insetInlineStart: "clamp(28px, 7vw, 60px)",
            insetInlineEnd: "clamp(28px, 7vw, 60px)",
            top: "50%",
            height: "1px",
            background: "#d1d7db",
            transform: "translateY(-50%)",
            zIndex: 0,
            pointerEvents: "none",
            maxWidth: "100%",
          }}
        />

        <div
          style={{
            width: "100%",
            maxWidth: "560px",
            minWidth: 0,
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(14px, 3vw, 22px)",
            flexWrap: "wrap",
            boxSizing: "border-box",
            background: "transparent",
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
                minWidth: "12px",
                minHeight: "12px",
                maxWidth: "14px",
                maxHeight: "14px",
                borderRadius: "50%",
                background: "#25d366",
                display: "inline-block",
                boxShadow:
                  "0 0 0 clamp(6px, 1.4vw, 8px) rgba(37, 211, 102, 0.16)",
                transition:
                  "transform 0.22s ease, opacity 0.22s ease, box-shadow 0.22s ease",
                opacity: 0.98,
                flexShrink: 0,
                boxSizing: "border-box",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.18)";
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.boxShadow =
                  "0 0 0 11px rgba(37, 211, 102, 0.20)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.opacity = "0.98";
                e.currentTarget.style.boxShadow =
                  "0 0 0 8px rgba(37, 211, 102, 0.16)";
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}