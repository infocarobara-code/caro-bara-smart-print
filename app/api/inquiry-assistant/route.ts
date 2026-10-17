import { isAdminAuthenticated } from '@/lib/admin-auth';
import { parseDraft } from '@/lib/inquiry-assistant/draft';
// Intentionally no provider import yet: a new voice/intake budget must be approved
// and enforced before enabling paid requests. Existing sign-studio permits are not reused.
export const runtime = 'nodejs';
const response=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(){
  if(!await isAdminAuthenticated())return response({error:'unauthorized'},401);
  return response({available:false,reason:'trial_not_activated'});
}
export async function POST(request:Request){
  if(!await isAdminAuthenticated())return response({error:'unauthorized'},401);
  if(request.headers.get('origin')!==new URL(request.url).origin)return response({error:'origin'},403);
  if(!request.headers.get('content-type')?.startsWith('application/json'))return response({error:'type'},415);
  try{
    const reader=request.body?.getReader();if(!reader)return response({error:'input'},400);
    const chunks:Uint8Array[]=[];let size=0;
    while(true){const chunk=await reader.read();if(chunk.done)break;size+=chunk.value.byteLength;if(size>32000){await reader.cancel();return response({error:'size'},413);}chunks.push(chunk.value);}
    const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
    const input=JSON.parse(new TextDecoder().decode(bytes));parseDraft(input.draft);
    if(typeof input.message!=='string'||!input.message.trim()||input.message.length>2000||!['ar','de','en'].includes(input.language))return response({error:'input'},400);
    return response({error:'trial_not_activated'},503);
  }catch{return response({error:'input'},400);}
}
