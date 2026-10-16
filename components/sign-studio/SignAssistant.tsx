"use client";
import { useEffect, useRef, useState } from 'react';
import { validateAssistantProposal } from '@/lib/sign-studio-assistant';
import { construction, type SignDesign } from '@/lib/sign-studio';
import EngineeringScene, {defaultView} from './EngineeringScene';
import styles from './SignAssistant.module.css';
const copy={
 ar:{title:'لنصمّمها معًا',trial:'تجربة خاصة بالإدارة',intro:'صف التغيير الذي تتخيله. سأجهّز اقتراحًا لتراجعه أولًا.',privacy:'يُرسل وصفك ونص اللوحة ومقاساتها لخدمة الذكاء الاصطناعي. صورة الشعار تبقى على جهازك ولا يحللها المساعد.',placeholder:'مثلًا: خلفية كحلية ونص أبيض، واجعل الشعار على اليمين',send:'حضّر الاقتراح',wait:'أحضّر اقتراحك…',stop:'إيقاف المساعد',cancel:'إلغاء الطلب',apply:'تطبيق هذا الاقتراح',discard:'تجاهل',fail:'تعذّر تحضير الاقتراح. تصميمك محفوظ ويمكنك متابعة التعديل يدويًا.',review:'هذا الطلب يحتاج مراجعة فريق Caro Bara؛ لم أغيّر تصميمك.',clarify:'حدّد تغييرًا بصريًا واحدًا، مثل اللون أو حجم النص أو موضع الشعار.',boundary:'معاينة مقترحة، وليست موافقة تصنيع. الخامات والتركيب والإضاءة تحتاج مراجعة الورشة.',stale:'تغيّر التصميم منذ تحضير الاقتراح. اطلب اقتراحًا جديدًا.',off:'المساعد متوقف لهذه الجلسة. التعديل اليدوي متاح.',none:'لا يوجد تعديل جديد في هذا الاقتراح.'},
 de:{title:'Gestalten wir es gemeinsam',trial:'Privater Admin-Test',intro:'Beschreibe deine Idee. Du prüfst jeden Vorschlag vor der Übernahme.',privacy:'Beschreibung, Schildtext und Maße werden an den KI-Dienst gesendet. Dein Logobild bleibt auf deinem Gerät und wird nicht analysiert.',placeholder:'Zum Beispiel: dunkelblauer Hintergrund, weißer Text, Logo rechts',send:'Vorschlag vorbereiten',wait:'Dein Vorschlag entsteht…',stop:'Assistent ausschalten',cancel:'Anfrage abbrechen',apply:'Vorschlag übernehmen',discard:'Verwerfen',fail:'Der Vorschlag konnte nicht erstellt werden. Dein Entwurf bleibt erhalten und manuell bearbeitbar.',review:'Das Team von Caro Bara muss diese Anfrage prüfen. Dein Entwurf bleibt unverändert.',clarify:'Nenne bitte eine visuelle Änderung, etwa Farbe, Textgröße oder Logoposition.',boundary:'Gestaltungsvorschlag, keine Fertigungsfreigabe. Material, Montage und Beleuchtung benötigen eine Werkstattprüfung.',stale:'Der Entwurf wurde inzwischen geändert. Bitte erstelle einen neuen Vorschlag.',off:'Der Assistent ist für diese Sitzung ausgeschaltet. Du kannst manuell weiterarbeiten.',none:'Dieser Vorschlag enthält keine neue Änderung.'},
 en:{title:'Let’s design it together',trial:'Private admin trial',intro:'Describe your idea. Review every suggestion before applying it.',privacy:'Your description, sign text and dimensions are sent to the AI service. Your logo image stays on your device and is not analysed.',placeholder:'For example: navy background, white text, logo on the right',send:'Prepare suggestion',wait:'Preparing your suggestion…',stop:'Turn assistant off',cancel:'Cancel request',apply:'Apply suggestion',discard:'Discard',fail:'The suggestion could not be prepared. Your design is preserved and manual editing remains available.',review:'The Caro Bara team needs to review this request. Your design is unchanged.',clarify:'Please specify one visual change, such as colour, text size or logo position.',boundary:'Visual suggestion, not manufacturing approval. Materials, installation and lighting need workshop review.',stale:'The design has changed since this suggestion. Please request a new one.',off:'The assistant is off for this session. Manual editing remains available.',none:'This suggestion contains no new changes.'}
};
const fields={ar:['النوع','العمق (سم)','الخط','الخلفية','لون النص','حجم النص (%)','حجم الشعار (%)','موضع الشعار الأفقي (%)','موضع الشعار العمودي (%)','الإضاءة'],de:['Bauform','Tiefe (cm)','Schrift','Hintergrund','Textfarbe','Textgröße (%)','Logogröße (%)','Logo horizontal (%)','Logo vertikal (%)','Licht'],en:['Type','Depth (cm)','Font','Background','Text colour','Text size (%)','Logo size (%)','Logo horizontal (%)','Logo vertical (%)','Lighting']};
const keys=['family','depthCm','font','background','foreground','textScale','logoScale','logoX','logoY','lighting'] as const;
export default function SignAssistant({design,logo,language,valid,onApply}:{design:SignDesign;logo:string;language:'ar'|'de'|'en';valid:boolean;onApply:(d:SignDesign)=>void}) {
 const t=copy[language];const [available,setAvailable]=useState(false),[off,setOff]=useState(false),[prompt,setPrompt]=useState(''),[pending,setPending]=useState(false),[status,setStatus]=useState<'fail'|'review'|'clarify'|'stale'|''>('');
 const [proposal,setProposal]=useState<{base:string;design:SignDesign}|null>(null);
 const request=useRef<AbortController|null>(null);
 // Includes logo bytes locally only; neither this signature nor image bytes leave the browser.
 const signature=JSON.stringify([design,logo,valid]);
 useEffect(()=>{const c=new AbortController();fetch('/api/sign-studio/assistant',{signal:c.signal,cache:'no-store'}).then(r=>r.ok?r.json():null).then(v=>setAvailable(v?.available===true)).catch(()=>{});return()=>c.abort();},[]);
 useEffect(()=>()=>{request.current?.abort();},[]);
 useEffect(()=>{request.current?.abort();},[signature,language]);
 const stop=()=>{request.current?.abort();setProposal(null);setOff(true);};
 async function ask(){
  request.current?.abort();const c=new AbortController();request.current=c;
  setPending(true);setStatus('');setProposal(null);
  try{
   const response=await fetch('/api/sign-studio/assistant',{method:'POST',headers:{'Content-Type':'application/json'},signal:c.signal,body:JSON.stringify({prompt,design,language,hasLogo:!!logo})});
   if(!response.ok)throw new Error();
   const result=validateAssistantProposal(design,await response.json());
   if(c.signal.aborted)return;
   if(result.proposal.kind==='proposal')setProposal({base:signature,design:result.design});else setStatus(result.proposal.kind);
  }catch{if(!c.signal.aborted)setStatus('fail');}finally{if(request.current===c)setPending(false);}
 }
 if(!available)return null;
 const before={...design,...construction(design)},after=proposal?{...proposal.design,...construction(proposal.design)}:before;
 const changed=keys.filter(k=>before[k]!==after[k]);
 return <section className={styles.assistant} aria-label={t.title}>
  <small>{t.trial}</small><h2>{t.title}</h2>
  {off?<p role="status">{t.off}</p>:<><p>{t.intro}</p><p className={styles.note}>{t.privacy}</p>
   <label htmlFor="sign-ai-prompt">{t.title}</label><textarea id="sign-ai-prompt" rows={3} maxLength={1200} value={prompt} placeholder={t.placeholder} onChange={e=>setPrompt(e.target.value)} disabled={pending}/>
   <div className={styles.actions}><button type="button" disabled={!valid||!prompt.trim()||pending} onClick={ask}>{pending?t.wait:t.send}</button>{pending&&<button type="button" onClick={()=>request.current?.abort()}>{t.cancel}</button>}<button type="button" onClick={stop}>{t.stop}</button></div>
   <p role="status" aria-live="polite">{status&&t[status]}</p>
   {proposal&&<div className={styles.proposal}>
    {proposal.base!==signature?<p>{t.stale}</p>:<><EngineeringScene design={proposal.design} logo={logo} night={false} view={{...defaultView,wireframe:false}} label={t.boundary}/>
     {changed.length?<ul>{changed.map(k=><li key={k}>{fields[language][keys.indexOf(k)]}: <bdi>{String(before[k])} → {String(after[k])}</bdi></li>)}</ul>:<p>{t.none}</p>}
     <p className={styles.note}>{t.boundary}</p></>}
    <div className={styles.actions}><button type="button" disabled={!valid||proposal.base!==signature||!changed.length} onClick={()=>{if(proposal.base!==signature){setStatus('stale');return;}onApply(proposal.design);setProposal(null);}}>{t.apply}</button><button type="button" onClick={()=>setProposal(null)}>{t.discard}</button></div>
   </div>}
  </>}
 </section>;
}
