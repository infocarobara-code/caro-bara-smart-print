"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";
import styles from "./CookiePreferences.module.css";
const STORAGE_KEY = "carobara_cookie_preferences_v1";
const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
const copy = {
  de: {title:"Deine Privatsphäre",body:"Wir verwenden nur notwendigen Speicher für Sprache, Anfrage und Verwaltung. Kein Analyse- oder Marketing-Tracking.",save:"Verstanden",settings:"Cookie-Einstellungen",privacy:"Mehr zum Datenschutz",error:"Die Auswahl konnte nicht dauerhaft gespeichert werden. Für diesen Besuch bleiben nur notwendige Funktionen aktiv.",close:"Schließen"},
  ar: {title:"خصوصيتك",body:"نستخدم التخزين الضروري فقط للغة والاستفسار والإدارة، دون تتبّع للتحليل أو التسويق.",save:"حسنًا، فهمت",settings:"إعدادات ملفات الارتباط",privacy:"المزيد عن الخصوصية",error:"تعذر حفظ الاختيار بشكل دائم. تبقى الوظائف الضرورية فقط مفعّلة خلال هذه الزيارة.",close:"إغلاق"},
  en: {title:"Your privacy",body:"We use only necessary storage for language, inquiries and administration. No analytics or marketing tracking.",save:"Understood",settings:"Cookie settings",privacy:"More about privacy",error:"Your choice could not be saved permanently. Only necessary features remain active for this visit.",close:"Close"},
};
export default function CookiePreferences() {
  const {language,dir}=useLanguage(); const t=copy[language];
  const dialog=useRef<HTMLDialogElement>(null);
  const settings=useRef<HTMLButtonElement>(null);
  const [storageError,setStorageError]=useState(false);
  useEffect(()=>{
    let saved=false;
    try { const value=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null"); saved=value?.version===1&&value?.necessary===true&&typeof value?.savedAt==="number"&&value.savedAt<=Date.now()&&Date.now()-value.savedAt<MAX_AGE; } catch { /* Show the choices when storage is unavailable. */ }
    if(!saved&&!dialog.current?.open)dialog.current?.show();
  },[]);
  function close(){dialog.current?.close();settings.current?.focus();}
  function save(){
    try {localStorage.setItem(STORAGE_KEY,JSON.stringify({version:1,necessary:true,savedAt:Date.now()}));setStorageError(false);close();}
    catch {setStorageError(true);}
  }
  return <>
    <button ref={settings} type="button" className={styles.settings} onClick={()=>dialog.current?.show()}><Cookie size={16} aria-hidden="true" />{t.settings}</button>
    <dialog ref={dialog} className={styles.dialog} dir={dir} onKeyDown={event=>{if(event.key==="Escape"){event.preventDefault();close();}}} aria-labelledby="cookie-preferences-title" aria-describedby="cookie-preferences-description">
      <div className={styles.heading}><Cookie size={18} aria-hidden="true" /><h2 id="cookie-preferences-title">{t.title}</h2><button type="button" onClick={close} aria-label={t.close}><X size={20} aria-hidden="true" /></button></div>
      <p id="cookie-preferences-description">{t.body}</p>
      {storageError&&<p role="status">{t.error}</p>}
      <div className={styles.actions}><Link href="/datenschutz" onClick={close}>{t.privacy}</Link><button type="button" onClick={storageError?close:save}>{storageError?t.close:t.save}</button></div>
    </dialog>
  </>;
}
