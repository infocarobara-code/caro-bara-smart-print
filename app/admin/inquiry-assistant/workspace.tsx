'use client';
import { useState } from 'react';
import { services } from '@/data/services';
import ServiceForm from '@/components/ServiceForm';
import { serviceFormValues, serviceFormAction } from '@/lib/inquiry-assistant/form-bridge';
import { germanSummary, missingFields, type DraftAction } from '@/lib/inquiry-assistant/draft';
import type { LanguageCode } from '@/types/service';
import styles from './workspace.module.css';
import { useInquirySession } from './useInquirySession';
import Conversation from './conversation';
const text={
 ar:{title:'اختبار مساعد الطلبات',notice:'نسخة تطوير للإدارة: ربط الحقول والمراجعة فقط. المحادثة والصوت والإرسال لم تُفعّل.',add:'إضافة خدمة',review:'مراجعة ألمانية',back:'العودة للتعبئة',remove:'حذف البند',confirm:'راجعت البيانات والتفاصيل',check:'اعتماد المراجعة محليًا',ok:'سُجلت مراجعة هذه النسخة محليًا فقط. لم يُرسل طلب أو بريد.',error:'راجع الحقول المطلوبة والبريد قبل الموافقة.',required:'حقول مطلوبة لم تُملأ',contact:'بيانات التواصل',empty:'أضف خدمة لاختبار ربط الحقول بالموقع.',optional:'اختياري',select:'اختر',missing:'المرفقات لم تُنفّذ في هذه الدفعة.',ack:'أي تعديل يلغي اعتماد المراجعة السابق.'},
 de:{title:'Anfrage-Assistent · Entwicklung',notice:'Interner Test: Formularbindung und Prüfung. Gespräch, Spracheingabe und Versand sind noch nicht aktiviert.',add:'Service hinzufügen',review:'Deutsche Übersicht',back:'Zurück zur Bearbeitung',remove:'Position entfernen',confirm:'Angaben und Details geprüft',check:'Prüfung lokal bestätigen',ok:'Diese Version wurde nur lokal geprüft. Keine Anfrage und keine E-Mail versandt.',error:'Bitte Pflichtfelder und E-Mail prüfen.',required:'Offene Pflichtfelder',contact:'Kontaktdaten',empty:'Service hinzufügen, um die bestehenden Formularfelder zu prüfen.',optional:'Optional',select:'Auswählen',missing:'Dateianhänge sind in diesem Schritt noch nicht implementiert.',ack:'Jede Änderung hebt die vorherige Bestätigung auf.'},
 en:{title:'Inquiry assistant · Development',notice:'Internal test: field binding and review only. Conversation, voice and submission are not activated.',add:'Add service',review:'German summary',back:'Back to editing',remove:'Remove item',confirm:'I checked the details',check:'Confirm review locally',ok:'This version was reviewed locally only. No inquiry or email was sent.',error:'Check required fields and email.',required:'Missing required fields',contact:'Contact details',empty:'Add a service to test the existing catalogue fields.',optional:'Optional',select:'Select',missing:'Attachments are not implemented in this batch.',ack:'Any change clears the previous approval.'}
};
export default function InquiryWorkspace(){
 const session=useInquirySession();const {language,draft}=session.state;const setLanguage=session.setLanguage;const t=text[language];
 const [serviceId,setServiceId]=useState(services[0].id);
 const activeId=session.state.activeItemId;const setActiveId=session.setActiveItemId;
 const activeItem=draft.items.find(item=>item.id===activeId)??draft.items.at(-1);
 const [review,setReview]=useState(false);const [consent,setConsent]=useState<number|null>(null);const [error,setError]=useState('');
 function edit(action:DraftAction){try{session.edit(action);setConsent(null);setError('');}catch{setError(t.error);}}
 const missing=missingFields(draft);
 return <main className={styles.page} dir={language==='ar'?'rtl':'ltr'}>
 <header className={styles.header}><strong>CARO BARA</strong><select aria-label="Language" value={language} onChange={e=>setLanguage(e.target.value as LanguageCode)}><option value="de">Deutsch</option><option value="ar">العربية</option><option value="en">English</option></select></header>
 <h1>{t.title}</h1><p className={styles.notice}>{t.notice}</p>
 {error&&<p role="alert">{error}</p>}
 <Conversation session={session}/>
 {!review?<>
 <div className={styles.actions}><select aria-label={t.add} value={serviceId} onChange={e=>setServiceId(e.target.value)}>{services.map(service=><option key={service.id} value={service.id}>{service.title[language]}</option>)}</select><button onClick={()=>{const itemId=crypto.randomUUID();edit({type:'add',itemId,serviceId});setActiveId(itemId);}} disabled={!session.state.ready||draft.items.length>=20}>{t.add}</button></div>
 {!draft.items.length&&<p>{t.empty}</p>}
 <div className={styles.itemTabs} aria-label={t.add}>{draft.items.map((item,index)=><button key={item.id} aria-pressed={activeItem?.id===item.id} onClick={()=>setActiveId(item.id)}>{index+1}. {services.find(service=>service.id===item.serviceId)?.title[language]}</button>)}</div>
 {activeItem&&<section className={styles.item} lang="de" dir="ltr"><div className={styles.header}><h2>{services.find(service=>service.id===activeItem.serviceId)!.title.de}</h2><button onClick={()=>edit({type:'remove',itemId:activeItem.id})}>{t.remove}</button></div>
 <ServiceForm key={activeItem.id} service={services.find(service=>service.id===activeItem.serviceId)!} lang="de" inquiry={{values:serviceFormValues(activeItem),onFieldChange:(fieldId,value)=>{try{edit(serviceFormAction(activeItem,fieldId,value));}catch{setError(t.error);}},onReview:()=>{setReview(true);setConsent(null);},reviewLabel:text.de.review}}/>
 </section>}

 </>:<>{germanSummary(draft).map(item=><section className={styles.item} key={item.itemId} lang="de" dir="ltr"><h2>{item.title}</h2><dl>{item.fields.map(field=><div key={field.id}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl></section>)}{missing.length>0&&<section className={styles.notice}><strong>{t.required}</strong><ul>{missing.map(field=><li key={field.itemId+field.fieldId}>{draft.items.findIndex(i=>i.id===field.itemId)+1}: {field.label.de}</li>)}</ul></section>}</>}
 <section className={styles.item}><h2>{t.contact}</h2><div className={styles.grid}>{([['fullName','Name'],['email','E-Mail'],['phone','Telefon'],['street','Straße'],['houseNumber','Hausnummer'],['postalCode','PLZ'],['city','Ort']] as const).map(([fieldId,label])=><label key={fieldId}>{label}<input dir="auto" value={draft.contact[fieldId]} type={fieldId==='email'?'email':'text'} onChange={e=>edit({type:'contact',fieldId,value:e.target.value})}/></label>)}</div></section>
 <p>{t.missing}</p><div className={styles.actions}><button disabled={!draft.items.length} onClick={()=>{setReview(!review);setConsent(null);}}>{review?t.back:t.review}</button></div>
 {review&&<section className={styles.item}><label className={styles.check}><input type="checkbox" checked={consent===draft.revision} onChange={e=>setConsent(e.target.checked?draft.revision:null)}/>{t.confirm}</label><p>{t.ack}</p><button disabled={consent!==draft.revision||missing.length>0} onClick={()=>{try{session.review();setError('');}catch{setError(t.error);}}}>{t.check}</button>{draft.reviewedRevision===draft.revision&&<p role="status">{t.ok}</p>}</section>}
 </main>;
}
