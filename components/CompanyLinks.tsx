"use client";
import { useRef } from "react";
import { Globe, Mail, MapPin, MessageCircle, X } from "lucide-react";
import { seoSite } from "@/data/seoSite";
import { useLanguage } from "@/lib/languageContext";
import SocialBrandIcon, { type SocialBrand } from "@/components/SocialBrandIcon";
import styles from "./ContactWidget.module.css";
const socialLinks: { href: string; label: string; brand: SocialBrand }[] = [
  { href: seoSite.facebook, label: "Facebook", brand: "facebook" },
  { href: seoSite.instagram, label: "Instagram", brand: "instagram" },
  { href: seoSite.tiktok, label: "TikTok", brand: "tiktok" },
  { href: seoSite.whatsapp, label: "WhatsApp", brand: "whatsapp" },
];
const text = {
  ar: { label: "تواصل معنا", main: "الموقع الرئيسي", maps: "موقعنا على الخريطة", close: "إغلاق التواصل" },
  de: { label: "Kontakt", main: "Unternehmenswebsite", maps: "Google Maps", close: "Kontakt schließen" },
  en: { label: "Contact us", main: "Company website", maps: "Google Maps", close: "Close contact" },
};
export default function CompanyLinks() {
  const { language, dir } = useLanguage();
  const details = useRef<HTMLDetailsElement>(null);
  const trigger = useRef<HTMLElement>(null);
  const t = text[language];
  function close() {
    if (details.current) details.current.open = false;
    trigger.current?.focus();
  }
  return <details ref={details} className={styles.widget} dir={dir} onKeyDown={event => {
    if (event.key === "Escape") { event.preventDefault(); close(); }
  }}>
    <summary ref={trigger} className={styles.trigger} aria-label={t.label} title={t.label}><MessageCircle size={23} aria-hidden="true" /><span className={styles.srOnly}>{t.label}</span></summary>
    <nav className={styles.panel} aria-label={t.label}>
      <div className={styles.heading}><strong>{t.label}</strong><button type="button" onClick={close} aria-label={t.close}><X size={18} aria-hidden="true" /></button></div>
      <a className={styles.email} href="mailto:info@carobara.com"><Mail size={23} aria-hidden="true" /><span>info@carobara.com</span></a>
      <div className={styles.links}>{socialLinks.map(({href,label,brand}) => <a key={brand} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}><SocialBrandIcon brand={brand} /><span>{label}</span></a>)}
        <a href={seoSite.maps} target="_blank" rel="noopener noreferrer"><MapPin size={24} aria-hidden="true" /><span>{t.maps}</span></a>
        <a href={seoSite.companyUrl} target="_blank" rel="noopener noreferrer"><Globe size={24} aria-hidden="true" /><span>{t.main}</span></a>
      </div>

    </nav>
  </details>;
}
