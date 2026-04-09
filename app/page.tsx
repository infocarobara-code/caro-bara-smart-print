"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HomeStatsSection from "@/components/home/HomeStatsSection";
import HomeTrustSection from "@/components/home/HomeTrustSection";
import HomeFooter from "@/components/home/HomeFooter";
import { useLanguage } from "@/lib/languageContext";

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
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <Header />

      <a
        href="#main-home-content"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
        onFocus={(e) => {
          e.currentTarget.style.left = "16px";
          e.currentTarget.style.top = "16px";
          e.currentTarget.style.width = "auto";
          e.currentTarget.style.height = "auto";
          e.currentTarget.style.padding = "10px 14px";
          e.currentTarget.style.borderRadius = "999px";
          e.currentTarget.style.background = "#2f2419";
          e.currentTarget.style.color = "#ffffff";
          e.currentTarget.style.zIndex = "9999";
          e.currentTarget.style.textDecoration = "none";
          e.currentTarget.style.boxShadow = "0 10px 24px rgba(47, 36, 25, 0.18)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.left = "-9999px";
          e.currentTarget.style.top = "auto";
          e.currentTarget.style.width = "1px";
          e.currentTarget.style.height = "1px";
          e.currentTarget.style.overflow = "hidden";
          e.currentTarget.style.padding = "0";
          e.currentTarget.style.borderRadius = "0";
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "transparent";
          e.currentTarget.style.zIndex = "auto";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {language === "ar"
          ? "انتقل إلى المحتوى"
          : language === "de"
            ? "Zum Inhalt springen"
            : "Skip to content"}
      </a>

      <div
        id="main-home-content"
        style={{
          width: "100%",
          display: "grid",
          gap: 0,
        }}
      >
        <section
          aria-label={
            language === "ar"
              ? "القسم الرئيسي"
              : language === "de"
                ? "Hauptbereich"
                : "Main hero section"
          }
          style={{
            width: "100%",
          }}
        >
          <Hero lang={language} />
        </section>

        <section
          aria-label={
            language === "ar"
              ? "إحصاءات المنصة"
              : language === "de"
                ? "Plattform-Statistiken"
                : "Platform statistics"
          }
          style={{
            width: "100%",
          }}
        >
          <HomeStatsSection language={language} />
        </section>

        <section
          aria-label={
            language === "ar"
              ? "عناصر الثقة والجودة"
              : language === "de"
                ? "Vertrauen und Qualität"
                : "Trust and quality"
          }
          style={{
            width: "100%",
          }}
        >
          <HomeTrustSection language={language} />
        </section>
      </div>

      <footer
        aria-label={
          language === "ar"
            ? "تذييل الصفحة"
            : language === "de"
              ? "Seitenfuß"
              : "Page footer"
        }
        style={{
          width: "100%",
        }}
      >
        <HomeFooter language={language} />
      </footer>
    </main>
  );
}