"use client";
import CompanyLinks from "@/components/CompanyLinks";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/languageContext";
const links = [
 ["/impressum", "Impressum", "بيانات المشغّل", "Legal notice"],
 ["/datenschutz", "Datenschutz", "الخصوصية", "Privacy"],
 ["/agb", "AGB", "شروط التعامل", "Terms"],
 ["/widerruf", "Widerruf", "حق التراجع", "Withdrawal"],
 ["/rechtliches", "Anfrage & Rechte", "الاستفسار والحقوق", "Requests & rights"],
] as const;
export default function LegalFooter() {
 const {language, dir} = useLanguage();
 const pathname = usePathname();
 if (pathname?.startsWith("/admin")) return null;
 const index = language === "ar" ? 2 : language === "en" ? 3 : 1;
 return <><CompanyLinks /><nav dir={dir} aria-label={language === "ar" ? "المعلومات القانونية" : language === "de" ? "Rechtliche Informationen" : "Legal information"} style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:18,padding:"22px 16px",background:"#fff",borderTop:"1px solid #ddd",fontSize:14}}>
 {links.map(l=><Link key={l[0]} href={l[0]} style={{color:"#075f75",textDecoration:"underline",padding:4}}>{l[index]}</Link>)}
 </nav></>;
}
