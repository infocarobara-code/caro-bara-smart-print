"use client";
import { useState } from "react";
import type { CustomerDataRow } from "./requests/_utils/admin-types";
import styles from "./admin.module.css";
const copy={
 ar:{manage:"إدارة السجلات",close:"إنهاء التحديد",select:"تحديد العميل",details:"بيانات التواصل والعنوان",delete:"حذف السجلات المحددة",confirm:"سيُطلب حذف سجلات العملاء المحددة حذفًا دائمًا. هل تريد المتابعة؟",empty:"لا توجد نتائج مطابقة.",unknown:"عميل بدون اسم",email:"البريد الإلكتروني",phone:"الهاتف",address:"العنوان",selected:"سجلات محددة"},
 de:{manage:"Datensätze verwalten",close:"Auswahl beenden",select:"Kunden auswählen",details:"Kontakt und Adresse",delete:"Ausgewählte Datensätze löschen",confirm:"Die ausgewählten Kundendatensätze werden endgültig gelöscht. Fortfahren?",empty:"Keine passenden Ergebnisse.",unknown:"Kunde ohne Namen",email:"E-Mail",phone:"Telefon",address:"Adresse",selected:"Datensätze ausgewählt"},
 en:{manage:"Manage records",close:"Finish selection",select:"Select customer",details:"Contact and address",delete:"Delete selected records",confirm:"Selected customer records will be permanently deleted. Continue?",empty:"No matching results.",unknown:"Unnamed customer",email:"Email",phone:"Phone",address:"Address",selected:"records selected"}
};
export default function CustomerRecords({rows,lang,office,search,deleteAction}:{rows:CustomerDataRow[];lang:"ar"|"de"|"en";office:string;search:string;deleteAction:(data:FormData)=>Promise<void>}) {
 const t=copy[lang];const [manage,setManage]=useState(false);const [selected,setSelected]=useState<string[]>([]);
 return <section>
  <details className={styles.panel}><summary>{t.manage}</summary><button type="button" className={styles.secondary} onClick={()=>{setManage(!manage);setSelected([])}}>{manage?t.close:t.select}</button></details>
  <form action={deleteAction} onSubmit={e=>{if(!selected.length||!window.confirm(t.confirm))e.preventDefault()}}>
   <input type="hidden" name="lang" value={lang}/><input type="hidden" name="office" value={office}/><input type="hidden" name="search" value={search}/>
   {manage&&<div className={styles.links}><span>{selected.length} {t.selected}</span><button type="submit" className={styles.danger} disabled={!selected.length}>{t.delete}</button></div>}
   {!rows.length&&<p className={styles.empty}>{t.empty}</p>}
   <div className={styles.customerGrid}>{rows.map(row=><article key={row.id} className={styles.panel}>
    <div className={styles.rowHeading}><h2 dir="auto">{`${row.firstName} ${row.lastName}`.trim()||t.unknown}</h2>{manage&&<label className={styles.check}><input type="checkbox" name="customerIds" value={row.id} checked={selected.includes(row.id)} onChange={e=>setSelected(ids=>e.target.checked?[...ids,row.id]:ids.filter(id=>id!==row.id))}/>{t.select}</label>}</div>
    {row.customerNumber&&<code className={styles.code}>{row.customerNumber}</code>}
    <details><summary>{t.details}</summary><dl className={styles.recordDetails}><dt>{t.email}</dt><dd dir="auto">{row.email||"—"}</dd><dt>{t.phone}</dt><dd><bdi>{row.phone||"—"}</bdi></dd><dt>{t.address}</dt><dd dir="auto">{row.address||"—"}</dd></dl></details>
   </article>)}</div>
  </form>
 </section>;
}
