"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HomeStatsSection from "@/components/home/HomeStatsSection";
import HomeTrustSection from "@/components/home/HomeTrustSection";
import HomeFooter from "@/components/home/HomeFooter";
import { useLanguage } from "@/lib/languageContext";

export default function Home() {
  const { language } = useLanguage();

  return (
    <main
      style={{
        fontFamily: "Arial, sans-serif",
        background: "transparent",
        color: "var(--wa-text-primary)",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        overflowY: "visible",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        position: "relative",
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
          e.currentTarget.style.background = "var(--wa-green-dark)";
          e.currentTarget.style.color = "var(--wa-text-inverse)";
          e.currentTarget.style.zIndex = "9999";
          e.currentTarget.style.textDecoration = "none";
          e.currentTarget.style.boxShadow =
            "0 10px 24px rgba(0, 168, 132, 0.22)";
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
          maxWidth: "100%",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 0,
          overflowX: "hidden",
          overflowY: "visible",
          boxSizing: "border-box",
          background: "transparent",
          alignItems: "stretch",
          position: "relative",
        }}
      >
        <Hero lang={language} />

        <div
          style={{
            width: "100%",
            maxWidth: "1240px",
            margin: "0 auto",
            paddingInline: "clamp(16px, 3vw, 24px)",
            boxSizing: "border-box",
            display: "grid",
            gap: "18px",
            background: "transparent",
            position: "relative",
          }}
        >
          <HomeStatsSection language={language} />
          <HomeTrustSection language={language} />
        </div>
      </div>

      <div
        style={{
          height: isNaN(0) ? "0px" : "0px",
        }}
      />

      <HomeFooter language={language} />
    </main>
  );
}