"use client";

import Image from "next/image";
import Link from "next/link";
import {useMemo, useState} from "react";
import {ArrowLeft, ArrowRight, Search} from "lucide-react";
import {categories} from "@/data/categories";
import {getServicesByCategory, searchServices} from "@/data/services";
import CartPopup from "@/components/CartPopup";
import {useLanguage} from "@/lib/languageContext";
import Header from "@/components/Header";
import styles from "./request.module.css";

const copy = {
 ar: {title:"ماذا تحتاج لمشروعك؟",hint:"اختر الفئة المناسبة، وسنرشدك إلى التفاصيل.",search:"ابحث عن خدمة",placeholder:"لوحات، كروت، تغليف…",unsure:"لست متأكدًا؟",start:"صف لنا فكرتك",one:"خدمة",many:"خدمات",empty:"لم نجد فئة مطابقة. جرّب كلمة أخرى أو صف لنا فكرتك.",clear:"عرض كل الفئات",categories:"فئات الخدمات"},
 de: {title:"Was brauchst du für dein Projekt?",hint:"Wähle eine Kategorie. Wir führen dich zu den Details.",search:"Leistung suchen",placeholder:"Schilder, Visitenkarten, Verpackung…",unsure:"Noch unsicher?",start:"Beschreibe deine Idee",one:"Leistung",many:"Leistungen",empty:"Keine passende Kategorie gefunden. Versuche einen anderen Begriff oder beschreibe deine Idee.",clear:"Alle Kategorien anzeigen",categories:"Leistungskategorien"},
 en: {title:"What does your project need?",hint:"Choose a category and we’ll guide you through the details.",search:"Find a service",placeholder:"Signs, business cards, packaging…",unsure:"Not sure?",start:"Tell us your idea",one:"service",many:"services",empty:"No matching category. Try another word or tell us your idea.",clear:"Show all categories",categories:"Service categories"},
} as const;

export default function RequestPage() {
 const {language,dir} = useLanguage();
 const [query,setQuery] = useState("");
 const t = copy[language];
 const Arrow = language === "ar" ? ArrowLeft : ArrowRight;
 const choices = useMemo(()=>categories.map(category=>{
  const services = getServicesByCategory(category.id);
  return {...category,services};
 }),[]);
 const normalizedQuery = query.trim().toLocaleLowerCase();
 const matchingServices = new Set(normalizedQuery ? searchServices(normalizedQuery).map(service=>service.id) : []);
 const visible = choices.filter(category=>!normalizedQuery || [
  ...Object.values(category.title), category.description[language],
  ...category.services.flatMap(service=>Object.values(service.title)),
 ].join(" ").toLocaleLowerCase().includes(normalizedQuery) || category.services.some(service=>matchingServices.has(service.id)));

 return <div dir={dir} className={styles.page}>
  <Header showBackHome />
  <main className={styles.container}>
   <header className={styles.intro}>
    <h1>{t.title}</h1>
    <p>{t.hint}</p>
   </header>
   <div className={styles.toolbar}>
    <label className={styles.search}>
     <Search size={18} aria-hidden="true"/>
     <span className={styles.srOnly}>{t.search}</span>
     <input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.placeholder} autoComplete="off" aria-controls="categories" />
    </label>
    <Link href="/request/service/open-request/form" className={styles.ideaLink}>
     <span>{t.unsure}</span><strong>{t.start}</strong><Arrow size={16} aria-hidden="true"/>
    </Link>
   </div>
   <section id="categories" aria-label={t.categories} className={styles.grid}>
    {visible.map(category=><Link key={category.id}
      href={category.services.length===1 ? `/request/service/${category.services[0].id}` : `/request/category/${category.id}`}
      className={styles.card}>
     <div className={styles.image}>
      <Image src={category.image} alt="" fill sizes="(max-width: 599px) 46vw, (max-width: 999px) 30vw, 275px" style={{objectFit:"cover"}}/>
     </div>
     <div className={styles.cardBody}>
      <h2>{category.title[language]}</h2>
      <div className={styles.cardMeta}><span>{category.services.length} {category.services.length===1?t.one:t.many}</span><Arrow size={16} aria-hidden="true"/></div>
     </div>
    </Link>)}
   </section>
   {visible.length===0 && <div className={styles.empty} role="status"><p>{t.empty}</p><button type="button" onClick={()=>setQuery("")}>{t.clear}</button></div>}
   {query && visible.length>0 && <button type="button" className={styles.clear} onClick={()=>setQuery("")}>{t.clear}</button>}
  </main>
  <CartPopup lang={language}/>
 </div>;
}
