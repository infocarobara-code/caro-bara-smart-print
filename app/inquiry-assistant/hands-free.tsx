'use client';
import {useEffect,useRef,useState} from 'react';
import {useInquirySession} from '../admin/inquiry-assistant/useInquirySession';
import {pcmWave,validateAudio} from '@/lib/inquiry-assistant/audio';
import {advanceVoice,voiceActivity} from '@/lib/inquiry-assistant/voice-turn';
import {germanSummary} from '@/lib/inquiry-assistant/draft';
import styles from './voice.module.css';
const copy={
 ar:{title:'احكِ لي، أنا معك',hint:'نتحدث ونرتّب فكرتك معًا.',start:'ابدأ الحديث',end:'إنهاء الحديث',permission:'اسمح باستخدام الميكروفون',listen:'أسمعك… خذ راحتك',think:'أفكّر في طلبك…',speak:'أتحدث معك…',hello:'أهلًا بك في كارو بارا. احكِ لي، شو حابب نعمل لك؟',privacy:'مساعد آلي · يُرسل صوتك إلى OpenAI أثناء المحادثة.',preview:'تجربة خاصة — لا تُرسل طلبات أو رسائل بريد.',unavailable:'التجربة غير متاحة الآن أو انتهى حدها.',error:'توقفت المحادثة. تحقق من الميكروفون والصوت والاتصال، ثم اضغط للمحاولة.',idle:'لم أسمع كلامًا واضحًا. اضغط عندما تكون جاهزًا.',summary:'تفاصيل طلبك بالألمانية',stopped:'يمكنك متابعة الحديث بالضغط مجددًا.'},
 de:{title:'Erzähl mir deine Idee',hint:'Wir besprechen dein Vorhaben gemeinsam.',start:'Gespräch starten',end:'Gespräch beenden',permission:'Mikrofonzugriff erlauben',listen:'Ich höre zu…',think:'Ich überlege…',speak:'Ich antworte…',hello:'Willkommen bei Caro Bara. Was möchtest du gerne umsetzen?',privacy:'KI-Assistent · Deine Stimme wird während des Gesprächs an OpenAI gesendet.',preview:'Private Vorschau — kein Anfrage- oder E-Mail-Versand.',unavailable:'Der Test ist gerade nicht verfügbar oder das Limit wurde erreicht.',error:'Gespräch unterbrochen. Mikrofon, Ton und Verbindung prüfen und erneut starten.',idle:'Keine deutliche Sprache erkannt. Starte erneut, wenn du bereit bist.',summary:'Deine Anfrage auf Deutsch',stopped:'Zum Weiterreden erneut drücken.'},
 en:{title:'Tell me your idea',hint:'Let’s work through it together.',start:'Start talking',end:'End conversation',permission:'Allow microphone access',listen:'I’m listening…',think:'Thinking about your request…',speak:'Speaking…',hello:'Welcome to Caro Bara. What would you like us to help you create?',privacy:'AI assistant · Your voice is sent to OpenAI during the conversation.',preview:'Private preview — no inquiry or email is sent.',unavailable:'The trial is unavailable or its limit has been reached.',error:'Conversation stopped. Check microphone, sound and connection, then try again.',idle:'No clear speech detected. Press when you are ready.',summary:'Your request in German',stopped:'Press again to continue.'}
};
type Phase='idle'|'permission'|'listen'|'think'|'speak';
export default function HandsFree(){
 const session=useInquirySession();const language=session.state.language;const t=copy[language];
 const [available,setAvailable]=useState<boolean|null>(null);const [phase,setPhase]=useState<Phase>('idle');const [caption,setCaption]=useState('');const [error,setError]=useState('');
 const live=useRef<{controller?:AbortController;stream?:MediaStream;context?:AudioContext}>({});
 useEffect(()=>{const c=new AbortController();fetch('/api/inquiry-assistant',{cache:'no-store',signal:c.signal}).then(async r=>{const data=r.ok?await r.json():{};if(!c.signal.aborted)setAvailable(data.available===true);}).catch(()=>{if(!c.signal.aborted)setAvailable(false);});return()=>c.abort();},[]);
 useEffect(()=>{
  const halt=()=>{live.current.controller?.abort();live.current.stream?.getTracks().forEach(track=>track.stop());window.speechSynthesis?.cancel();};
  const hidden=()=>{if(document.hidden)halt();};document.addEventListener('visibilitychange',hidden);
  return()=>{document.removeEventListener('visibilitychange',hidden);halt();};
 },[]);
 function stop(){live.current.controller?.abort();live.current.stream?.getTracks().forEach(track=>track.stop());window.speechSynthesis?.cancel();}
 async function talk(){
  if(live.current.controller){stop();return;}if(!available||!session.state.ready)return;
  const controller=new AbortController();const signal=controller.signal;live.current.controller=controller;setError('');setPhase('permission');
  let stream:MediaStream|undefined;let context:AudioContext|undefined;
  try{
   if(!window.speechSynthesis||!navigator.mediaDevices?.getUserMedia)throw Error('unsupported');
   context=new AudioContext();live.current.context=context;await context.resume();
   stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});live.current.stream=stream;signal.throwIfAborted();
   const source=context.createMediaStreamSource(stream);const analyser=context.createAnalyser();analyser.fftSize=1024;source.connect(analyser);
   const speak=(text:string)=>new Promise<void>((resolve,reject)=>{
    signal.throwIfAborted();setPhase('speak');setCaption(text);stream!.getAudioTracks().forEach(track=>{track.enabled=false;});
    const speech=new SpeechSynthesisUtterance(text);speech.lang={ar:'ar',de:'de-DE',en:'en-GB'}[language];const voice=window.speechSynthesis.getVoices().find(v=>v.lang.startsWith(language));if(voice)speech.voice=voice;
    const timer=setTimeout(()=>finish(Error('voice_timeout')),45000);
    function abort(){finish(Error('aborted'));}
    function finish(error?:Error){clearTimeout(timer);signal.removeEventListener('abort',abort);speech.onend=null;speech.onerror=null;if(error){window.speechSynthesis.cancel();reject(error);}else resolve();}
    signal.addEventListener('abort',abort,{once:true});speech.onend=()=>finish();speech.onerror=()=>finish(Error('voice_unavailable'));window.speechSynthesis.speak(speech);
   });
   await speak(session.current.current.history.filter(e=>e.role==='assistant').at(-1)?.content??t.hello);
   while(!signal.aborted){
    setPhase('listen');stream.getAudioTracks().forEach(track=>{track.enabled=true;});
    const blob=await new Promise<Blob>((resolve,reject)=>{
     const recorder=new MediaRecorder(stream!);const chunks:BlobPart[]=[];let size=0;let activity=voiceActivity();const start=performance.now();let fail:Error|undefined;
     const samples=new Float32Array(analyser.fftSize);
     const timer=setInterval(()=>{if(recorder.state!=='recording'){clearInterval(timer);return;}analyser.getFloatTimeDomainData(samples);const rms=Math.sqrt(samples.reduce((sum,n)=>sum+n*n,0)/samples.length);const result=advanceVoice(activity,rms,performance.now()-start);activity=result.activity;if(result.idle){fail=Error('idle');recorder.stop();}else if(result.done||result.limit)recorder.stop();},80);
     const abort=()=>{fail=Error('aborted');if(recorder.state==='recording')recorder.stop();};signal.addEventListener('abort',abort,{once:true});
     recorder.ondataavailable=e=>{size+=e.data.size;if(size>8000000){fail=Error('size');if(recorder.state==='recording')recorder.stop();}else chunks.push(e.data);};
     recorder.onerror=()=>{fail=Error('recording');clearInterval(timer);signal.removeEventListener('abort',abort);reject(fail);};
     recorder.onstop=()=>{clearInterval(timer);signal.removeEventListener('abort',abort);if(fail)reject(fail);else resolve(new Blob(chunks,{type:recorder.mimeType}));};try{recorder.start(500);}catch(e){clearInterval(timer);signal.removeEventListener('abort',abort);reject(e);}
    });
    signal.throwIfAborted();stream.getAudioTracks().forEach(track=>{track.enabled=false;});setPhase('think');
    const decoded=await context.decodeAudioData(await blob.arrayBuffer());signal.throwIfAborted();const length=Math.min(60*16000,Math.floor(decoded.duration*16000));const offline=new OfflineAudioContext(1,length,16000);const input=offline.createBufferSource();input.buffer=decoded;input.connect(offline.destination);input.start();const audio=pcmWave((await offline.startRendering()).getChannelData(0));validateAudio(audio);signal.throwIfAborted();
    const transcription=await fetch(`/api/inquiry-assistant/transcribe?language=${language}`,{method:'POST',headers:{'Content-Type':'audio/wav'},body:new Blob([audio],{type:'audio/wav'}),signal:AbortSignal.any([signal,AbortSignal.timeout(45000)])});if(!transcription.ok)throw Error('transcribe');const {text}=await transcription.json();if(typeof text!=='string'||!text.trim())throw Error('empty');signal.throwIfAborted();
    session.setMessage(text);const snapshot=session.current.current;
    const response=await fetch('/api/inquiry-assistant',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({draft:snapshot.draft,message:text,language,history:snapshot.history}),signal:AbortSignal.any([signal,AbortSignal.timeout(45000)])});if(!response.ok)throw Error('assistant');const reply:unknown=await response.json();signal.throwIfAborted();session.accept(snapshot.draft.revision,reply,text);
    await speak(session.current.current.history.at(-1)!.content);
   }
  }catch(e){if(!signal.aborted)setError(e instanceof Error&&e.message==='idle'?t.idle:t.error);}
  finally{stream?.getTracks().forEach(track=>track.stop());await context?.close().catch(()=>{});if(live.current.controller===controller){live.current={};setPhase('idle');}}
 }
 const active=phase!=='idle';
 return <main className={styles.page} dir={language==='ar'?'rtl':'ltr'}><header className={styles.header}><span>CARO BARA</span><select aria-label="Language" value={language} disabled={active} onChange={e=>session.setLanguage(e.target.value as typeof language)}><option value="de">Deutsch</option><option value="ar">العربية</option><option value="en">English</option></select></header><section className={styles.center}><h1>{t.title}</h1><p>{t.hint}</p><button className={styles.orb} data-phase={phase} onClick={()=>void talk()} disabled={!session.state.ready||available!==true} aria-label={active?t.end:t.start} aria-pressed={active}><svg viewBox="0 0 48 48" fill="none" aria-hidden="true">{active?<rect x="15" y="15" width="18" height="18" rx="4" fill="currentColor"/>:<><rect x="18" y="7" width="12" height="23" rx="6" stroke="currentColor" strokeWidth="2.5"/><path d="M12 23v2a12 12 0 0 0 24 0v-2M24 37v5M18 42h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></>}</svg></button><strong role="status">{active?t[phase]:t.start}</strong><p className={styles.caption} aria-live="polite">{error||(available===false?t.unavailable:caption)}</p>{!active&&caption&&!error&&<small>{t.stopped}</small>}</section><footer className={styles.footer}><small>{t.privacy}</small><small>{t.preview}</small>{!active&&session.state.draft.items.length>0&&<details><summary>{t.summary}</summary><div lang="de" dir="ltr">{germanSummary(session.state.draft).map(item=><section key={item.itemId}><h2>{item.title}</h2>{item.fields.map(field=><p key={field.id}>{field.label}: {field.value}</p>)}</section>)}</div></details>}</footer></main>;
}
