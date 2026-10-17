'use client';
import {useEffect,useRef,useState} from 'react';
import {pcmWave,validateAudio} from '@/lib/inquiry-assistant/audio';
const labels={ar:{start:'تحدث معنا',finish:'انتهيت — أرسل كلامي',cancel:'إلغاء التسجيل',record:'أستمع إليك…',work:'أحوّل كلامك…',notice:'بعد إنهاء التسجيل يُرسل صوتك إلى OpenAI لفهمه. دقيقة لكل رسالة، ويمكنك متابعة الحديث برسالة أخرى.',error:'تعذر استخدام الصوت. تحقق من إذن الميكروفون وحاول مجددًا.',replay:'اسمع الرد',stop:'إيقاف الصوت'},de:{start:'Mit uns sprechen',finish:'Fertig — Sprache senden',cancel:'Aufnahme verwerfen',record:'Ich höre zu…',work:'Sprache wird verarbeitet…',notice:'Nach Abschluss wird deine Aufnahme zur Erkennung an OpenAI gesendet. Bis zu einer Minute pro Nachricht; danach kannst du weiterreden.',error:'Sprache nicht verfügbar. Bitte Mikrofonberechtigung prüfen und erneut versuchen.',replay:'Antwort anhören',stop:'Stimme stoppen'},en:{start:'Talk to us',finish:'Done — send recording',cancel:'Discard recording',record:'Listening…',work:'Processing your voice…',notice:'After recording, your audio is sent to OpenAI for transcription. Up to one minute per message; continue with another message afterwards.',error:'Could not use voice. Check microphone permission and try again.',replay:'Hear the reply',stop:'Stop voice'}};
export function speakReply(text:string,language:string){if(typeof window==='undefined'||!window.speechSynthesis)return;window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang={ar:'ar',de:'de-DE',en:'en-GB'}[language]??language;const voice=window.speechSynthesis.getVoices().find(v=>v.lang.startsWith(language));if(voice)utterance.voice=voice;window.speechSynthesis.speak(utterance);}
export default function Voice({language,disabled,onText,lastReply}:{language:'ar'|'de'|'en';disabled:boolean;onText:(text:string)=>Promise<void>;lastReply:string}){
 const t=labels[language];const [phase,setPhase]=useState<'idle'|'permission'|'recording'|'processing'>('idle');const [error,setError]=useState(false);
 const resources=useRef<{recorder?:MediaRecorder;stream?:MediaStream;timer?:ReturnType<typeof setTimeout>;abort?:AbortController;generation:number}>({generation:0});
 function release(){const r=resources.current;clearTimeout(r.timer);r.stream?.getTracks().forEach(track=>track.stop());}
 function cancel(){resources.current.generation++;resources.current.abort?.abort();if(resources.current.recorder?.state==='recording')resources.current.recorder.stop();release();setPhase('idle');}
 useEffect(()=>()=>{resources.current.generation++;resources.current.abort?.abort();const r=resources.current;if(r.recorder?.state==='recording')r.recorder.stop();clearTimeout(r.timer);r.stream?.getTracks().forEach(track=>track.stop());window.speechSynthesis?.cancel();},[]);
 async function start(){
  if(disabled||phase!=='idle')return;const generation=++resources.current.generation;setError(false);setPhase('permission');window.speechSynthesis?.cancel();
  try{
   const stream=await navigator.mediaDevices.getUserMedia({audio:true});if(generation!==resources.current.generation){stream.getTracks().forEach(t=>t.stop());return;}resources.current.stream=stream;
   const recorder=new MediaRecorder(stream);resources.current.recorder=recorder;const chunks:BlobPart[]=[];let size=0;
   recorder.ondataavailable=e=>{size+=e.data.size;if(size>8000000){cancel();setError(true);}else if(e.data.size)chunks.push(e.data);};
   recorder.onerror=()=>{cancel();setError(true);};
   recorder.onstop=async()=>{
    if(generation!==resources.current.generation)return;release();setPhase('processing');let context:AudioContext|undefined;
    try{
     context=new AudioContext();const decoded=await context.decodeAudioData(await new Blob(chunks,{type:recorder.mimeType}).arrayBuffer());await context.close();context=undefined;
     const count=Math.min(60*16000,Math.floor(decoded.duration*16000));if(count<1600)throw Error('short');
     const offline=new OfflineAudioContext(1,count,16000);const source=offline.createBufferSource();source.buffer=decoded;source.connect(offline.destination);source.start();const rendered=await offline.startRendering();const bytes=pcmWave(rendered.getChannelData(0));validateAudio(bytes);
     if(generation!==resources.current.generation)return;const abort=new AbortController();resources.current.abort=abort;const timer=setTimeout(()=>abort.abort(),45000);
     let response:Response;try{response=await fetch(`/api/inquiry-assistant/transcribe?language=${language}`,{method:'POST',headers:{'Content-Type':'audio/wav'},body:new Blob([bytes],{type:'audio/wav'}),signal:abort.signal});}finally{clearTimeout(timer);}
     if(!response.ok)throw Error('transcription');const result=await response.json();if(generation!==resources.current.generation)return;if(typeof result.text!=='string')throw Error('text');await onText(result.text);
    }catch{if(generation===resources.current.generation)setError(true);}finally{await context?.close();if(generation===resources.current.generation)setPhase('idle');}
   };
   recorder.start(1000);setPhase('recording');resources.current.timer=setTimeout(()=>{if(recorder.state==='recording')recorder.stop();},60000);
  }catch{release();if(generation===resources.current.generation){setError(true);setPhase('idle');}}
 }
 return <div><button type="button" onClick={phase==='recording'?()=>resources.current.recorder?.stop():start} disabled={disabled||phase==='processing'||phase==='permission'}>{phase==='recording'?t.finish:phase==='processing'?t.work:t.start}</button>{phase!=='idle'&&<button type="button" onClick={cancel}>{t.cancel}</button>}<p role="status">{phase==='recording'?t.record:''}</p><small>{t.notice}</small>{error&&<p role="alert">{t.error}</p>}{lastReply&&<div><button type="button" disabled={phase!=='idle'} onClick={()=>speakReply(lastReply,language)}>{t.replay}</button><button type="button" onClick={()=>window.speechSynthesis?.cancel()}>{t.stop}</button></div>}</div>;
}
