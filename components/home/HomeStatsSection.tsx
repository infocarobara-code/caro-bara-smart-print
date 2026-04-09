"use client";

import { useEffect, useState } from "react";

type Lang = "ar" | "de" | "en";

type Props = {
  language: Lang;
};

export default function HomeStatsSection({ language }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const links = [
    { href: "/request", label: "Start print request" },
    { href: "/request#categories", label: "Explore print categories" },
    { href: "/guide", label: "Printing guide and workflow" },
    { href: "/offers", label: "Printing services and offers" },
    { href: "/#contact", label: "Contact print service" },
    { href: "/about", label: "About print platform" },
  ];

  return (
    <section
      aria-label={
        language === "ar"
          ? "روابط داخلية مختصرة"
          : language === "de"
            ? "Kompakte interne Links"
            : "Compact internal links"
      }
      style={{
        height: isMobile ? "72px" : "96px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "980px",
          width: "100%",
          padding: isMobile ? "0 18px" : "0 24px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: isMobile ? "28px" : "60px",
            right: isMobile ? "28px" : "60px",
            top: "50%",
            height: "2px",
            background: "#e0cfbb",
            transform: "translateY(-50%)",
            zIndex: 0,
          }}
        />

        <div
          style={{
            width: "100%",
            maxWidth: "560px",
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {links.map((item, index) => (
            <a
              key={index}
              href={item.href}
              title={item.label}
              aria-label={item.label}
              style={{
                width: isMobile ? "12px" : "14px",
                height: isMobile ? "12px" : "14px",
                borderRadius: "50%",
                background: "#9a6334",
                display: "inline-block",
                boxShadow: "0 0 0 8px rgba(154, 99, 52, 0.12)",
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