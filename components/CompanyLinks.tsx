"use client";
import { seoSite } from "@/data/seoSite";
import { useLanguage } from "@/lib/languageContext";
const text = {
  ar: { label: "كارو بارا على الإنترنت", main: "الموقع الرئيسي", maps: "موقعنا على الخريطة" },
  de: { label: "Caro Bara online", main: "Unternehmenswebsite", maps: "Google Maps" },
  en: { label: "Caro Bara online", main: "Company website", maps: "Google Maps" },
};
export default function CompanyLinks() {
  const { language, dir } = useLanguage();
  const t = text[language];
  return <nav dir={dir} aria-label={t.label} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18, padding: "16px", background: "#fff", fontSize: 14 }}>
    {[[seoSite.companyUrl, t.main], [seoSite.maps, t.maps], [seoSite.facebook, "Facebook"], [seoSite.instagram, "Instagram"]].map(([href, label]) =>
      <a key={href} href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#075f75", padding: 4 }}>{label}</a>
    )}
  </nav>;
}
