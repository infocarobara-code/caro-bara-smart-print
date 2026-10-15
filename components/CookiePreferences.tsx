"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";
import styles from "./CookiePreferences.module.css";
const STORAGE_KEY = "carobara_cookie_preferences_v1";
const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
const copy = {
  de: {title:"Cookies & Datenschutz",body:"Wir verwenden technisch notwendigen Speicher für deine Anfrage, die Sprachauswahl und die geschützte Verwaltung. Auf dieser Website sind derzeit keine optionalen Analyse- oder Marketing-Tracker eingebunden.",necessary:"Technisch notwendig",always:"Immer aktiv",detail:"Social-Media-Links öffnen externe Dienste erst, wenn du sie auswählst. Deine Auswahl für diese Website aktiviert dort keine Zustimmung.",save:"Nur notwendige zulassen",settings:"Cookie-Einstellungen",privacy:"Datenschutzerklärung",error:"Dein Browser konnte die Auswahl nicht dauerhaft speichern. Für diesen Besuch bleiben nur notwendige Funktionen aktiv.",close:"Schließen"},
  ar: {title:"ملفات الارتباط والخصوصية",body:"نستخدم التخزين الضروري لاستفسارك واختيار اللغة والإدارة المحمية. لا توجد حاليًا أدوات تتبع اختيارية للتحليل أو التسويق مضمّنة في هذا الموقع.",necessary:"الضرورية تقنيًا",always:"مفعّلة دائمًا",detail:"روابط التواصل تفتح خدمات خارجية فقط عند اختيارها. اختيارك لهذا الموقع لا يُعد موافقة على تلك الخدمات.",save:"السماح بالضرورية فقط",settings:"إعدادات ملفات الارتباط",privacy:"سياسة الخصوصية",error:"تعذر حفظ الاختيار بشكل دائم في متصفحك. تبقى الوظائف الضرورية فقط مفعلة خلال هذه الزيارة.",close:"إغلاق"},
  en: {title:"Cookies & privacy",body:"We use technically necessary storage for your inquiry, language selection and protected administration. This website currently embeds no optional analytics or marketing trackers.",necessary:"Technically necessary",always:"Always active",detail:"Social links open external services only when you choose them. Your selection for this website does not give consent to those services.",save:"Allow necessary only",settings:"Cookie settings",privacy:"Privacy notice",error:"Your browser could not save this choice permanently. Only necessary features remain active for this visit.",close:"Close"},
};
export default function CookiePreferences() {
  const {language,dir}=useLanguage(); const t=copy[language];
  const dialog=useRef<HTMLDialogElement>(null);
  const settings=useRef<HTMLButtonElement>(null);
  const [storageError,setStorageError]=useState(false);
  useEffect(()=>{
    let saved=false;
    try { const value=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null"); saved=value?.version===1&&value?.necessary===true&&typeof value?.savedAt==="number"&&value.savedAt<=Date.now()&&Date.now()-value.savedAt<MAX_AGE; } catch { /* Show the choices when storage is unavailable. */ }
    if(!saved&&!dialog.current?.open)dialog.current?.showModal();
  },[]);
  function close(){dialog.current?.close();settings.current?.focus();}
  function save(){
    try {localStorage.setItem(STORAGE_KEY,JSON.stringify({version:1,necessary:true,savedAt:Date.now()}));setStorageError(false);close();}
    catch {setStorageError(true);}
  }
  return <>
    <button ref={settings} type="button" className={styles.settings} onClick={()=>dialog.current?.showModal()}><Cookie size={16} aria-hidden="true" />{t.settings}</button>
    <dialog ref={dialog} className={styles.dialog} dir={dir} aria-labelledby="cookie-preferences-title" aria-describedby="cookie-preferences-description">
      <div className={styles.heading}><Cookie size={23} aria-hidden="true" /><h2 id="cookie-preferences-title">{t.title}</h2><button type="button" onClick={close} aria-label={t.close}><X size={20} aria-hidden="true" /></button></div>
      <p id="cookie-preferences-description">{t.body}</p>
      <div className={styles.necessary}><strong>{t.necessary}</strong><span>{t.always}</span></div>
      <p className={styles.detail}>{t.detail}</p>
      <Link href="/datenschutz" onClick={close}>{t.privacy}</Link>
      {storageError&&<p role="status">{t.error}</p>}
      <div className={styles.actions}><button type="button" onClick={storageError?close:save}>{storageError?t.close:t.save}</button></div>
    </dialog>
  </>;
}
