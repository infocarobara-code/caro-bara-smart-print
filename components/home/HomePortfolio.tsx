"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X, ZoomIn } from "lucide-react";
import { portfolio, type PortfolioGroup } from "@/data/portfolio";
import styles from "./HomePortfolio.module.css";

type Language = "de" | "ar" | "en";
const copy = {
  de: { title: "Ideen, die sichtbar werden.", intro: "Einblicke in Gestaltung, Werbetechnik und Produktion bei Caro Bara.", all: "Alle", signage: "Schilder & Fassaden", textile: "Textildruck", design: "Design & Druck", workshop: "Aus der Werkstatt", previous: "Vorherige Arbeiten", next: "Weitere Arbeiten", swipe: "Wischen oder Pfeile verwenden", zoom: "Bild vergrößern", close: "Schließen", original: "Originaldatei ansehen", enhanced: "Präsentation ansehen", request: "Ähnliches anfragen", retouched: "Mit KI fotografisch aufbereitet", concept: "Designpräsentation", supplied: "Projektaufnahme", count: "Arbeiten", notice: "Fotografisch aufbereitete Ansichten sind gekennzeichnet. Die mitgelieferte Originaldatei ist jeweils separat verfügbar." },
  ar: { title: "أفكار تتحوّل إلى حضور.", intro: "نماذج من التصميم والإعلانات والإنتاج لدى كارو بارا.", all: "الكل", signage: "اللوحات والواجهات", textile: "طباعة الملابس", design: "التصميم والطباعة", workshop: "من الورشة", previous: "الأعمال السابقة", next: "الأعمال التالية", swipe: "اسحب أو استخدم السهمين", zoom: "تكبير الصورة", close: "إغلاق", original: "عرض الملف الأصلي", enhanced: "عرض الصورة المحسّنة", request: "استفسر عن خدمة مشابهة", retouched: "معالجة فوتوغرافية بالذكاء الاصطناعي", concept: "عرض تصميم", supplied: "صورة المشروع", count: "أعمال", notice: "الصور المعالجة بصريًا مميّزة بوضوح، ويمكن مشاهدة الملف الأصلي المرفق لكل منها." },
  en: { title: "Ideas made visible.", intro: "A closer look at design, signage and production at Caro Bara.", all: "All", signage: "Signs & facades", textile: "Textile printing", design: "Design & print", workshop: "In the workshop", previous: "Previous work", next: "Next work", swipe: "Swipe or use the arrows", zoom: "Enlarge image", close: "Close", original: "View original file", enhanced: "View presentation", request: "Ask about something similar", retouched: "Photo presentation enhanced with AI", concept: "Design presentation", supplied: "Project image", count: "works", notice: "Enhanced photographic views are labelled. The supplied original file is available separately for each." },
} as const;
const groups = ["all", "signage", "textile", "design", "workshop"] as const;

export default function HomePortfolio({ language }: { language: Language }) {
  const t = copy[language];
  const [group, setGroup] = useState<PortfolioGroup | "all">("all");
  const rail = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [selected, setSelected] = useState<string | null>(null);
  const [original, setOriginal] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const items = portfolio.filter(item => group === "all" || item.group === group);
  const updateEdges = () => {
    const el = rail.current;
    if (el) setEdges({ start: Math.abs(el.scrollLeft) < 2, end: Math.abs(el.scrollLeft) + el.clientWidth >= el.scrollWidth - 2 });
  };
  const move = (direction: number) => {
    const el = rail.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const distance = (card?.getBoundingClientRect().width ?? el.clientWidth) + 20;
    el.scrollBy({ left: direction * (language === "ar" ? -1 : 1) * distance, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    el.scrollTo({ left: 0, behavior: "auto" });
    const observer = new ResizeObserver(updateEdges);
    observer.observe(el);
    return () => observer.disconnect();
  }, [group, language]);
  const active = portfolio.find(item => item.id === selected);
  useEffect(() => {
    if (selected && !dialog.current?.open) dialog.current?.showModal();
    if (!selected && dialog.current?.open) dialog.current.close();
  }, [selected]);
  return (
    <section id="arbeiten" className={styles.section} dir={language === "ar" ? "rtl" : "ltr"} aria-labelledby="portfolio-title">
      <header className={styles.header}><span className={styles.eyebrow}>CARO BARA · PORTFOLIO</span><h2 id="portfolio-title">{t.title}</h2><p>{t.intro}</p></header>
      <div className={styles.filters} aria-label={t.title}>{groups.map(value => <button key={value} type="button" aria-pressed={group === value} onClick={() => { setGroup(value); setEdges({ start: true, end: false }); }}>{t[value]}</button>)}</div>
      <div className={styles.railHeader}><p className={styles.count} aria-live="polite">{t.count}: {items.length} · {t.swipe}</p><div className={styles.controls}>
        <button type="button" aria-label={t.previous} aria-controls="portfolio-rail" disabled={edges.start} onClick={() => move(-1)}>{language === "ar" ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}</button>
        <button type="button" aria-label={t.next} aria-controls="portfolio-rail" disabled={edges.end} onClick={() => move(1)}>{language === "ar" ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}</button>
      </div></div>
      <div ref={rail} id="portfolio-rail" className={styles.grid} role="region" aria-roledescription="carousel" aria-label={t.title} tabIndex={0} onScroll={updateEdges}>{items.map(item => <article key={item.id} className={styles.card}>
        <button type="button" className={styles.photo} aria-label={`${t.zoom}: ${item.title[language]}`} onClick={() => { setOriginal(false); setSelected(item.id); }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} width={1200} height={800} loading="lazy" decoding="async" alt={`${item.title[language]} – ${item.description[language]}`} /><span className={styles.zoom}><ZoomIn size={18} aria-hidden="true" /></span>
        </button>
        <div className={styles.body}><span className={styles.kind}>{item.group === "design" ? t.concept : item.original ? t.retouched : t.supplied}</span><h3>{item.title[language]}</h3><p>{item.description[language]}</p><Link href={`/request/category/${item.category}`} className={styles.cta}>{t.request}<ArrowUpRight size={17} aria-hidden="true" /></Link></div>
      </article>)}</div>
      <p className={styles.notice}>{t.notice}</p>
      <dialog ref={dialog} aria-labelledby="portfolio-active-title" className={styles.dialog} onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        {active && <div className={styles.detail} dir={language === "ar" ? "rtl" : "ltr"}>
          <header><h2 id="portfolio-active-title">{active.title[language]}</h2><button type="button" autoFocus aria-label={t.close} onClick={() => dialog.current?.close()}><X size={22} /></button></header>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={original && active.original ? active.original : active.image} width={1200} height={800} alt={`${active.title[language]} – ${active.description[language]}`} />
          <p>{original ? t.original : active.group === "design" ? t.concept : active.original ? t.retouched : t.supplied}</p>
          {active.original && <button type="button" className={styles.more} onClick={() => setOriginal(!original)}>{original ? t.enhanced : t.original}</button>}
          <Link href={`/request/category/${active.category}`} className={styles.cta}>{t.request}<ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>}
      </dialog>
    </section>
  );
}
