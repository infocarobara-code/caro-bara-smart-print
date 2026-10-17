import { isAdminAuthenticated } from '@/lib/admin-auth';
import { parseTurn } from '@/lib/inquiry-assistant/turn';
import { proposeInquiry } from '@/lib/inquiry-assistant/provider';
import { budgetedInquiryFetch, trialAvailable } from '@/lib/inquiry-assistant/budget';
export const runtime = 'nodejs';
const response=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(){
  if(!await isAdminAuthenticated())return response({error:'unauthorized'},401);
  const available=await trialAvailable();
  return response({available,reason:available?null:'trial_not_activated'});
}
export async function POST(request:Request){
  if(!await isAdminAuthenticated())return response({error:'unauthorized'},401);
  if(request.headers.get('origin')!==new URL(request.url).origin)return response({error:'origin'},403);
  if(!request.headers.get('content-type')?.startsWith('application/json'))return response({error:'type'},415);
  let input;
  try{
    const reader=request.body?.getReader();if(!reader)return response({error:'input'},400);
    const chunks:Uint8Array[]=[];let size=0;
    while(true){const chunk=await reader.read();if(chunk.done)break;size+=chunk.value.byteLength;if(size>32000){await reader.cancel();return response({error:'size'},413);}chunks.push(chunk.value);}
    const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
    input=parseTurn(JSON.parse(new TextDecoder().decode(bytes)));
  }catch{return response({error:'input'},400);}
  if(!await trialAvailable())return response({error:'trial_not_activated'},503);
  try{
    const signal=AbortSignal.any([request.signal,AbortSignal.timeout(40000)]);
    return response(await proposeInquiry({...input,signal},budgetedInquiryFetch(),process.env.SIGN_STUDIO_OPENAI_API_KEY!));
  }catch{return response({error:'assistant_unavailable'},503);}
}
