"use client";
import Link from "next/link";
import { logoutAction } from "./login/actions";
import styles from "./admin.module.css";
type Lang = "ar" | "de" | "en";
const text = {
 ar:{label:"إدارة Caro Bara",appointments:"المواعيد",requests:"الطلبات",customers:"العملاء",categories:"فئات الخدمات",logout:"خروج",site:"الموقع"},
 de:{label:"Caro Bara Verwaltung",appointments:"Termine",requests:"Anfragen",customers:"Kunden",categories:"Kategorien",logout:"Abmelden",site:"Website"},
 en:{label:"Caro Bara administration",appointments:"Appointments",requests:"Requests",customers:"Customers",categories:"Categories",logout:"Sign out",site:"Website"}
};
export default function AdminNav({lang,active,onLanguage,office,search}:{lang:Lang;active:"appointments"|"requests"|"customers"|"categories";onLanguage?:(lang:Lang)=>void;office?:string;search?:string}) {
 const t=text[lang];
 return <header className={styles.header} dir={lang==="ar"?"rtl":"ltr"}>
  <div className={styles.identity}><strong>Caro Bara<span> • </span></strong><span>{t.label}</span><Link href="/">{t.site} ↗</Link></div>
  <div className={styles.links}>
   <nav className={styles.links} aria-label={t.label}>
    {(["appointments","requests","customers","categories"] as const).map(key=><Link key={key} aria-current={active===key?"page":undefined} className={active===key?styles.button:styles.secondary} href={key==="categories"?`/admin/categories?lang=${lang}`:key==="appointments"?`/admin/appointments?lang=${lang}`:`/admin/requests?lang=${lang}&office=${key==="customers"?"customer_data":"requests_new"}`}>{t[key]}</Link>)}
   </nav>
   <div className={styles.languages} aria-label="Language">
    {(["ar","de","en"] as const).map(l=>onLanguage?<button type="button" key={l} aria-pressed={l===lang} onClick={()=>onLanguage(l)}>{l==="ar"?"عربي":l==="de"?"Deutsch":"English"}</button>:<Link key={l} aria-current={l===lang?"true":undefined} href={`/admin/requests?lang=${l}&office=${office || (active==="customers"?"customer_data":"requests_new")}${search ? `&search=${encodeURIComponent(search)}` : ""}`}>{l==="ar"?"عربي":l==="de"?"Deutsch":"English"}</Link>)}
   </div>
   <form action={logoutAction}><button className={styles.secondary}>{t.logout}</button></form>
  </div>
 </header>;
}
