import { spokenLanguage } from '@/lib/inquiry-assistant/spoken-language';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { reserveInquiryCall, voiceTrialAvailable } from '@/lib/inquiry-assistant/budget';
import { MAX_AUDIO_BYTES,validateAudio } from '@/lib/inquiry-assistant/audio';
export const runtime='nodejs';
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request:Request){
 if(!await isAdminAuthenticated())return reply({error:'unauthorized'},401);
 if(request.headers.get('origin')!==new URL(request.url).origin)return reply({error:'origin'},403);
 if(request.headers.get('content-type')!=='audio/wav')return reply({error:'type'},415);
 // Do not force a page language: detect it again for every spoken turn.
 let bytes:Uint8Array;
 try{
  const reader=request.body?.getReader();if(!reader)return reply({error:'audio'},400);
  const chunks:Uint8Array[]=[];let size=0;
  while(true){const c=await reader.read();if(c.done)break;size+=c.value.length;if(size>MAX_AUDIO_BYTES){await reader.cancel();return reply({error:'size'},413);}chunks.push(c.value);}
  bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}validateAudio(bytes);
 }catch{return reply({error:'audio'},400);}
 try{
  const signal=AbortSignal.any([request.signal,AbortSignal.timeout(30000)]);signal.throwIfAborted();
  if(!await voiceTrialAvailable())return reply({error:'voice_budget_unavailable'},503);
  await reserveInquiryCall();signal.throwIfAborted();
  const form=new FormData();form.append('file',new Blob([new Uint8Array(bytes)],{type:'audio/wav'}),'request.wav');form.append('model','whisper-1');form.append('response_format','verbose_json');
  const response=await fetch('https://api.openai.com/v1/audio/transcriptions',{method:'POST',headers:{Authorization:`Bearer ${process.env.SIGN_STUDIO_OPENAI_API_KEY}`},body:form,signal,redirect:'error',cache:'no-store'});
  if(!response.ok)return reply({error:'transcription_unavailable'},503);
  const result=await response.json();if(typeof result.text!=='string'||!result.text.trim()||result.text.length>2000)return reply({error:'transcription_invalid'},422);
  return reply({text:result.text.trim(),language:spokenLanguage(result.language)});
 }catch{return reply({error:'transcription_unavailable'},503);}
}
