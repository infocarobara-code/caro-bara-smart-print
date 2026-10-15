"use client";
import { seoSite } from "@/data/seoSite";
import { useLanguage } from "@/lib/languageContext";
import SocialBrandIcon, { type SocialBrand } from "@/components/SocialBrandIcon";
const socialLinks: { href: string; label: string; brand: SocialBrand }[] = [
  { href: seoSite.facebook, label: "Facebook", brand: "facebook" },
  { href: seoSite.instagram, label: "Instagram", brand: "instagram" },
  { href: seoSite.tiktok, label: "TikTok", brand: "tiktok" },
  { href: seoSite.whatsapp, label: "WhatsApp", brand: "whatsapp" },
];
const text = {
  ar: { label: "كارو بارا على الإنترنت", main: "الموقع الرئيسي", maps: "موقعنا على الخريطة" },
  de: { label: "Caro Bara online", main: "Unternehmenswebsite", maps: "Google Maps" },
  en: { label: "Caro Bara online", main: "Company website", maps: "Google Maps" },
};
export default function CompanyLinks() {
  const { language, dir } = useLanguage();
  const t = text[language];
  return <nav dir={dir} aria-label={t.label} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18, padding: "16px", background: "#fff", fontSize: 14 }}>
    {[[seoSite.companyUrl, t.main], [seoSite.maps, t.maps]].map(([href, label]) =>
      <a key={href} href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#075f75", padding: 4 }}>{label}</a>
    )}
    {socialLinks.map(({href, label, brand}) => <a key={brand} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} style={{display:"inline-flex",alignItems:"center",gap:8,minHeight:44,padding:"0 10px",color:"#075f75",textDecoration:"none",border:"1px solid #e3e8eb",borderRadius:12}}><SocialBrandIcon brand={brand} /><span>{label}</span></a>)}
  </nav>;
}
