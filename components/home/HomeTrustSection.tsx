"use client";

import { useEffect, useState } from "react";
import { homepageStats, pageText } from "@/components/home/home.data";

type Lang = "ar" | "de" | "en";
type StatKey = "requests" | "services" | "availability";
type LocalizedText = Record<Lang, string>;

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

  const getLocalizedText = (value: unknown): string => {
    const localized = value as LocalizedText;
    return localized[language] ?? localized.en ?? "";
  };

  const statsEyebrow = getLocalizedText(pageText.statsEyebrow);
  const statsTitle = getLocalizedText(pageText.statsTitle);

  const statContent: Record<StatKey, { label: string }> = {
    requests: {
      label: getLocalizedText(pageText.requestsStatLabel),
    },
    services: {
      label: getLocalizedText(pageText.servicesStatLabel),
    },
    availability: {
      label: getLocalizedText(pageText.availabilityStatLabel),
    },
  };

  return (
    <section
      style={{
        padding: isMobile ? "18px 16px 0" : "14px 20px 0",
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
            border: "1px solid #e8ddd1",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(250,246,241,0.96) 100%)",
            borderRadius: isMobile ? "24px" : "26px",
            padding: isMobile ? "18px 14px 14px" : "18px",
            boxShadow: isMobile
              ? "0 10px 26px rgba(70, 49, 29, 0.05)"
              : "0 6px 18px rgba(70, 49, 29, 0.025)",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: isMobile ? "16px" : "14px",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: "#8a735c",
                marginBottom: "6px",
              }}
            >
              {statsEyebrow}
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: isMobile ? "23px" : "clamp(17px, 1.8vw, 23px)",
                lineHeight: 1.22,
                color: "#2f2419",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              {statsTitle}
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(2, 1fr)"
                : "repeat(auto-fit, minmax(200px, 1fr))",
              gap: isMobile ? "12px" : "14px",
            }}
          >
            {homepageStats.map((item, index) => {
              const Icon = item.icon;
              const itemKey = item.key as StatKey;
              const content = statContent[itemKey];

              const isLastSingleMobile =
                isMobile &&
                homepageStats.length % 2 !== 0 &&
                index === homepageStats.length - 1;

              return (
                <div
                  key={item.key}
                  style={{
                    gridColumn: isLastSingleMobile ? "1 / -1" : "auto",
                    background:
                      "linear-gradient(180deg, #fffaf5 0%, #fcf7f1 100%)",
                    border: "1px solid #ebe1d6",
                    borderRadius: "20px",
                    padding: isMobile ? "16px 12px" : "16px",
                    minHeight: isMobile ? "126px" : "112px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    gap: "5px",
                    boxShadow: isMobile
                      ? "0 8px 20px rgba(70, 49, 29, 0.04)"
                      : "0 4px 12px rgba(70, 49, 29, 0.02)",
                    transition:
                      "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow =
                      "0 16px 32px rgba(70, 49, 29, 0.08)";
                    e.currentTarget.style.borderColor = "#dfd0c0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = isMobile
                      ? "0 8px 20px rgba(70, 49, 29, 0.04)"
                      : "0 4px 12px rgba(70, 49, 29, 0.02)";
                    e.currentTarget.style.borderColor = "#ebe1d6";
                  }}
                >
                  <div
                    style={{
                      width: isMobile ? "40px" : "38px",
                      height: isMobile ? "40px" : "38px",
                      borderRadius: "12px",
                      background: "#f4ede4",
                      border: "1px solid #e7dbcd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#3d3024",
                    }}
                  >
                    <Icon size={16} />
                  </div>

                  <div
                    style={{
                      fontSize: isMobile ? "20px" : "21px",
                      fontWeight: 700,
                      color: "#2f2419",
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                    }}
                  >
                    {item.value}
                  </div>

                  <div
                    style={{
                      fontSize: isMobile ? "11px" : "12px",
                      fontWeight: 600,
                      color: "#4a3a2b",
                      lineHeight: 1.45,
                      maxWidth: "150px",
                    }}
                  >
                    {content.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}