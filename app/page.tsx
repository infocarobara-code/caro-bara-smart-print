"use client";

import Hero from "@/components/Hero";
import Header from "@/components/Header";
import { useLanguage } from "@/lib/languageContext";
import HomeStatsSection from "@/components/home/HomeStatsSection";
import HomeTrustSection from "@/components/home/HomeTrustSection";
import HomeFooter from "@/components/home/HomeFooter";

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
      <Header />
      <Hero lang={language} />
      <HomeStatsSection language={language} />
      <HomeTrustSection language={language} />
      <HomeFooter language={language} />
    </main>
  );
}