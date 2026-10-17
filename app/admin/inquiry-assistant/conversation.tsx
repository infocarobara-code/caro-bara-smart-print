'use client';
import { useEffect, useRef, useState } from 'react';
import type { useInquirySession } from './useInquirySession';
import styles from './workspace.module.css';
import Voice,{speakReply} from './voice';
const copy={
 ar:{title:'احكِ لنا طلبك',hint:'اضغط وتحدث بلغتك، ثم اضغط «انتهيت». سيظهر الوصف الألماني في الطلب لتراجعه.',label:'ماذا تريد أن نجهز لك؟',send:'فهم طلبي',stop:'إيقاف',wait:'أرتّب تفاصيل طلبك…',undo:'تراجع عن آخر تعديل للمساعد',off:'المحادثة الذكية غير مفعّلة في هذه النسخة بعد. يمكنك تجربة التعبئة والمراجعة يدويًا.',failed:'تعذر إكمال الرد. كلامك وطلبك محفوظان؛ حاول مجددًا.',stale:'تغير الطلب أثناء الرد، لذلك لم نطبق الرد المتأخر. يمكنك المحاولة من جديد.',privacy:'يمكن استعادة المسودة داخل هذا التبويب حتى ساعتين من آخر تعديل. لا تُرسل المحادثة إلى الذكاء الاصطناعي إلا عند ضغط الزر وتفعيل التجربة.',restore:'تعذر استعادة المسودة السابقة أو انتهت صلاحيتها.',storage:'تعذر الحفظ في هذا المتصفح. أبقِ الصفحة مفتوحة حتى لا تفقد التعديلات.'},
 de:{title:'Erzähl uns von deinem Vorhaben',hint:'Sprich in deiner Sprache und tippe anschließend auf „Fertig“. Die Angaben erscheinen auf Deutsch in deiner Anfrage zur Prüfung.',label:'Was möchtest du anfertigen lassen?',send:'Anfrage verstehen',stop:'Stoppen',wait:'Ich ordne deine Angaben…',undo:'Letzte Änderung des Assistenten zurücknehmen',off:'Das KI-Gespräch ist in dieser Version noch nicht aktiviert. Formular und Übersicht lassen sich manuell testen.',failed:'Antwort nicht abgeschlossen. Text und Anfrage bleiben erhalten. Bitte erneut versuchen.',stale:'Die Anfrage wurde inzwischen geändert. Die verspätete Antwort wurde nicht übernommen.',privacy:'Der Entwurf kann in diesem Tab bis zwei Stunden nach der letzten Änderung wiederhergestellt werden. An die KI wird erst nach Klick auf den Button und aktivierter Testphase gesendet.',restore:'Der vorherige Entwurf ist abgelaufen oder konnte nicht wiederhergestellt werden.',storage:'Speichern ist in diesem Browser nicht möglich. Bitte die Seite offen lassen.'},
 en:{title:'Tell us what you need',hint:'Speak in your language, then press Done. German details will appear in your inquiry for review.',label:'What would you like us to make?',send:'Understand my request',stop:'Stop',wait:'Organizing your request…',undo:'Undo the assistant’s last change',off:'AI conversation is not activated in this version yet. You can test the form and review manually.',failed:'Could not complete the reply. Your text and request are preserved. Please try again.',stale:'Your request changed while the reply was loading. The late reply was not applied.',privacy:'The draft can be restored in this tab for up to two hours after the last change. Text is sent to AI only after pressing the button with the trial activated.',restore:'The previous draft expired or could not be restored.',storage:'This browser could not save the draft. Keep this page open.'}
};
export default function Conversation({session}:{session:ReturnType<typeof useInquirySession>}) {
 const {state}=session;const t=copy[state.language];
 const [available,setAvailable]=useState(false);const [pending,setPending]=useState(false);const [failure,setFailure]=useState<''|'failed'|'stale'>('');
 const active=useRef<AbortController|null>(null);
 useEffect(()=>{const controller=new AbortController();fetch('/api/inquiry-assistant',{signal:controller.signal,cache:'no-store'}).then(async response=>{if(response.ok){const status=await response.json();if(!controller.signal.aborted)setAvailable(status.available===true);}}).catch(()=>{});return()=>controller.abort();},[]);
 useEffect(()=>()=>{active.current?.abort();},[]);
 function stop(){active.current?.abort();active.current=null;setPending(false);}
 async function sendMessage(voiceText?:string){
  if(active.current||!available)return;
  const snapshot=session.current.current;const message=(voiceText??snapshot.message).trim();if(!message)return;
  const controller=new AbortController();active.current=controller;setPending(true);setFailure('');
  const timeout=setTimeout(()=>controller.abort(),45000);
  try{
   const response=await fetch('/api/inquiry-assistant',{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({draft:snapshot.draft,message,language:snapshot.language,history:snapshot.history})});
   if(!response.ok)throw new Error('Request failed');
   const reply:unknown=await response.json();
   if(controller.signal.aborted||active.current!==controller)return;
   session.accept(snapshot.draft.revision,reply,message);
   if(voiceText){const last=session.current.current.history.at(-1);if(last?.role==='assistant')speakReply(last.content,snapshot.language);}
  }catch(error){if(active.current===controller)setFailure(error instanceof Error&&error.message==='Stale draft'?'stale':'failed');}
  finally{clearTimeout(timeout);if(active.current===controller){active.current=null;setPending(false);}}
 }
 return <section className={styles.conversation} aria-labelledby="inquiry-conversation-title">
  <h2 id="inquiry-conversation-title">{t.title}</h2><p>{t.hint}</p>
  {!available&&<p className={styles.notice} role="status">{t.off}</p>}
  <div className={styles.messages} role="log" aria-live="polite" aria-relevant="additions text">{state.history.map((entry,index)=><p key={index} className={entry.role==='user'?styles.customerMessage:styles.assistantMessage} dir="auto">{entry.content}</p>)}</div>
  <Voice language={state.language} disabled={!available||pending||!state.ready} lastReply={state.history.filter(e=>e.role==='assistant').at(-1)?.content??''} onText={async text=>{session.setMessage(text);await sendMessage(text);}}/>
  <details><summary>{state.language==='ar'?'الكتابة أو تصحيح النص (اختياري)':state.language==='de'?'Text schreiben oder korrigieren (optional)':'Write or correct text (optional)'}</summary><form onSubmit={event=>{event.preventDefault();void sendMessage();}}><label htmlFor="inquiry-message">{t.label}</label><textarea id="inquiry-message" dir="auto" rows={3} maxLength={2000} value={state.message} onChange={e=>session.setMessage(e.target.value)} disabled={!state.ready}/><div className={styles.actions}><button type="submit" disabled={!available||pending||!state.message.trim()||!state.ready}>{pending?t.wait:t.send}</button>{pending&&<button type="button" onClick={stop}>{t.stop}</button>}{session.canUndo&&<button type="button" onClick={()=>{stop();session.revert();}}>{t.undo}</button>}</div></form></details>
  {failure&&<p role="alert">{t[failure]}</p>}{state.restoreFailed&&<p role="status">{t.restore}</p>}{state.storageFailed&&<p role="alert">{t.storage}</p>}
  <small>{t.privacy}</small>
 </section>;
}
