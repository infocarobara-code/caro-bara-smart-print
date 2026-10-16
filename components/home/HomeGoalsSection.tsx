"use client";

import Link from "next/link";
import { Store, Car, Printer, Sparkles, ArrowUpRight } from "lucide-react";
import styles from "./HomeGoalsSection.module.css";

type Language = "ar" | "de" | "en";
const text = {
  ar: { eyebrow: "من الفكرة إلى التنفيذ", title: "ما الذي تريد تجهيزه؟", intro: "ابدأ بهدفك، ثم اختر الخدمة المناسبة وتفاصيلها.", browse: "استعرض كل الخدمات", uncertain: "لدي فكرة وأحتاج مساعدة",
    goals: ["أجهّز واجهة محلي", "أعلن على سيارتي", "أحتاج مطبوعات"],
    details: ["لوحات وحروف بارزة وإعلانات مضيئة.", "كتابة وتغليف جزئي أو كامل للمركبات.", "كروت أعمال وفلايرات ومنيوهات وبوسترات."] },
  de: { eyebrow: "Von der Idee zur Umsetzung", title: "Was möchtest du gestalten?", intro: "Starte mit deinem Vorhaben und finde die passende Leistung.", browse: "Alle Leistungen entdecken", uncertain: "Ich habe eine Idee und brauche Beratung",
    goals: ["Mein Geschäft sichtbar machen", "Mein Fahrzeug beschriften", "Meine Drucksachen gestalten"],
    details: ["Schilder, Profilbuchstaben und Lichtwerbung.", "Beschriftung, Teil- und Vollfolierung für Fahrzeuge.", "Visitenkarten, Flyer, Speisekarten und Poster."] },
  en: { eyebrow: "From idea to production", title: "What would you like to create?", intro: "Start with your goal, then explore the right service and its details.", browse: "Explore all services", uncertain: "I have an idea and need guidance",
    goals: ["Make my shop stand out", "Brand my vehicle", "Create my printed materials"],
    details: ["Signs, raised letters and illuminated advertising.", "Vehicle lettering, partial wraps and full wraps.", "Business cards, flyers, menus and posters."] },
} as const;
const goals = [
  { id: "signage", icon: Store },
  { id: "vehicle", icon: Car },
  { id: "printing", icon: Printer },
] as const;

export default function HomeGoalsSection({ language }: { language: Language }) {
  const t = text[language];
  return (
    <section className={styles.section} dir={language === "ar" ? "rtl" : "ltr"} aria-labelledby="home-goals-title">
      <header className={styles.header}>
        <span className={styles.eyebrow}>{t.eyebrow}</span>
        <h2 id="home-goals-title">{t.title}</h2>
        <p>{t.intro}</p>
      </header>
      <div className={styles.grid}>
        {goals.map(({ id, icon: Icon }, index) => (
          <Link key={id} href={`/request/category/${id}`} className={styles.card}>
            <Icon size={25} strokeWidth={1.6} aria-hidden="true" />
            <h3>{t.goals[index]}</h3>
            <p>{t.details[index]}</p>
            <ArrowUpRight className={styles.arrow} size={20} aria-hidden="true" />
          </Link>
        ))}
      </div>
      <div className={styles.footer}>
        <Link href="/request/category/smart" className={styles.guidance}><Sparkles size={18} aria-hidden="true" />{t.uncertain}</Link>
        <Link href="/request#categories" className={styles.browse}>{t.browse}</Link>
      </div>
    </section>
  );
}
