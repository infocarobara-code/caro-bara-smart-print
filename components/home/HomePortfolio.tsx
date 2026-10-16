"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X, ZoomIn } from "lucide-react";
import { portfolio, type PortfolioGroup } from "@/data/portfolio";
import styles from "./HomePortfolio.module.css";

type Language = "de" | "ar" | "en";
const copy = {
  de: { title: "Ideen, die sichtbar werden.", intro: "Einblicke in Gestaltung, Werbetechnik und Produktion bei Caro Bara.", all: "Alle", signage: "Schilder & Fassaden", textile: "Textildruck", design: "Design & Druck", workshop: "Aus der Werkstatt", more: "Weitere Arbeiten zeigen", less: "Weniger zeigen", zoom: "Bild vergrößern", close: "Schließen", original: "Originaldatei ansehen", enhanced: "Präsentation ansehen", request: "Ähnliches anfragen", retouched: "Mit KI fotografisch aufbereitet", concept: "Designpräsentation", supplied: "Projektaufnahme", count: "Arbeiten", notice: "Fotografisch aufbereitete Ansichten sind gekennzeichnet. Die mitgelieferte Originaldatei ist jeweils separat verfügbar." },
  ar: { title: "أفكار تتحوّل إلى حضور.", intro: "نماذج من التصميم والإعلانات والإنتاج لدى كارو بارا.", all: "الكل", signage: "اللوحات والواجهات", textile: "طباعة الملابس", design: "التصميم والطباعة", workshop: "من الورشة", more: "عرض المزيد من الأعمال", less: "عرض أقل", zoom: "تكبير الصورة", close: "إغلاق", original: "عرض الملف الأصلي", enhanced: "عرض الصورة المحسّنة", request: "استفسر عن خدمة مشابهة", retouched: "معالجة فوتوغرافية بالذكاء الاصطناعي", concept: "عرض تصميم", supplied: "صورة المشروع", count: "أعمال", notice: "الصور المعالجة بصريًا مميّزة بوضوح، ويمكن مشاهدة الملف الأصلي المرفق لكل منها." },
  en: { title: "Ideas made visible.", intro: "A closer look at design, signage and production at Caro Bara.", all: "All", signage: "Signs & facades", textile: "Textile printing", design: "Design & print", workshop: "In the workshop", more: "Show more work", less: "Show less", zoom: "Enlarge image", close: "Close", original: "View original file", enhanced: "View presentation", request: "Ask about something similar", retouched: "Photo presentation enhanced with AI", concept: "Design presentation", supplied: "Project image", count: "works", notice: "Enhanced photographic views are labelled. The supplied original file is available separately for each." },
} as const;
const groups = ["all", "signage", "textile", "design", "workshop"] as const;

export default function HomePortfolio({ language }: { language: Language }) {
  const t = copy[language];
  const [group, setGroup] = useState<PortfolioGroup | "all">("all");
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [original, setOriginal] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const items = portfolio.filter(item => group === "all" || item.group === group);
  const visible = expanded ? items : items.slice(0, 6);
  const active = portfolio.find(item => item.id === selected);
  useEffect(() => {
    if (selected && !dialog.current?.open) dialog.current?.showModal();
    if (!selected && dialog.current?.open) dialog.current.close();
  }, [selected]);
  return (
    <section id="arbeiten" className={styles.section} dir={language === "ar" ? "rtl" : "ltr"} aria-labelledby="portfolio-title">
      <header className={styles.header}><span className={styles.eyebrow}>CARO BARA · PORTFOLIO</span><h2 id="portfolio-title">{t.title}</h2><p>{t.intro}</p></header>
      <div className={styles.filters} aria-label={t.title}>{groups.map(value => <button key={value} type="button" aria-pressed={group === value} onClick={() => { setGroup(value); setExpanded(false); }}>{t[value]}</button>)}</div>
      <p className={styles.count} aria-live="polite">{items.length} {t.count}</p>
      <div className={styles.grid}>{visible.map(item => <article key={item.id} className={styles.card}>
        <button type="button" className={styles.photo} aria-label={`${t.zoom}: ${item.title}`} onClick={() => { setOriginal(false); setSelected(item.id); }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} width={1200} height={800} loading="lazy" decoding="async" alt={`${item.title} – ${item.description[language]}`} /><span className={styles.zoom}><ZoomIn size={18} aria-hidden="true" /></span>
        </button>
        <div className={styles.body}><span className={styles.kind}>{item.original ? t.retouched : item.group === "design" ? t.concept : t.supplied}</span><h3>{item.title}</h3><p>{item.description[language]}</p><Link href={`/request/category/${item.category}`} className={styles.cta}>{t.request}<ArrowUpRight size={17} aria-hidden="true" /></Link></div>
      </article>)}</div>
      {items.length > 6 && <button className={styles.more} type="button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? t.less : t.more}</button>}
      <p className={styles.notice}>{t.notice}</p>
      <dialog ref={dialog} aria-labelledby="portfolio-active-title" className={styles.dialog} onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        {active && <div className={styles.detail} dir={language === "ar" ? "rtl" : "ltr"}>
          <header><h2 id="portfolio-active-title">{active.title}</h2><button type="button" autoFocus aria-label={t.close} onClick={() => dialog.current?.close()}><X size={22} /></button></header>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={original && active.original ? active.original : active.image} width={1200} height={800} alt={`${active.title} – ${active.description[language]}`} />
          <p>{original ? t.original : active.original ? t.retouched : active.group === "design" ? t.concept : t.supplied}</p>
          {active.original && <button type="button" className={styles.more} onClick={() => setOriginal(!original)}>{original ? t.enhanced : t.original}</button>}
          <Link href={`/request/category/${active.category}`} className={styles.cta}>{t.request}<ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>}
      </dialog>
    </section>
  );
}
