// Server transport only. Reservations are conservative USD-cent allowances,
// not measured invoices. Failed/aborted calls are never refunded.
export class InquiryBudgetError extends Error {}
export function trialConfigured() {
  return process.env.VERCEL_ENV === 'preview'
    && process.env.VERCEL_GIT_COMMIT_REF === 'feature/guided-inquiry'
    && process.env.INQUIRY_ASSISTANT_TRIAL_ENABLED === 'true'
    && process.env.SUPABASE_URL?.replace(/\/$/, '') === 'https://mmnbqvwjemyxhjzhzlcu.supabase.co'
    && !!process.env.SUPABASE_SERVICE_ROLE_KEY
    && !!process.env.SIGN_STUDIO_OPENAI_API_KEY;
}
async function rpc(name:string, transport:typeof fetch) {
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const result=await transport(`https://mmnbqvwjemyxhjzhzlcu.supabase.co/rest/v1/rpc/${name}`,{
    method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'},
    body:'{}',cache:'no-store',redirect:'error',signal:AbortSignal.timeout(10000),
  });
  if(!result.ok)throw new InquiryBudgetError('budget_unavailable');
  return await result.json() === true;
}
export async function trialAvailable(transport:typeof fetch=fetch) {
  if(!trialConfigured())return false;
  try{return await rpc('cb_inquiry_trial_available',transport);}catch{return false;}
}
export function budgetedInquiryFetch(transport:typeof fetch=fetch):typeof fetch {
  let attempts=0;
  return async(input,init)=>{
    if(!trialConfigured())throw new InquiryBudgetError('trial_not_activated');
    if(++attempts>2)throw new InquiryBudgetError('call_limit');
    const endpoint=typeof input==='string'?input:input instanceof URL?input.href:input.url;
    if(endpoint!=='https://api.openai.com/v1/responses'||init?.method!=='POST'||typeof init.body!=='string')throw new InquiryBudgetError('transport');
    if(new TextEncoder().encode(init.body).byteLength>32000)throw new InquiryBudgetError('context_limit');
    const body=JSON.parse(init.body);
    if(body.model!=='gpt-6-astra'||body.max_output_tokens!==1200||body.service_tier!=='default'||body.store!==false||body.tools?.length||body.background||body.previous_response_id||body.conversation)throw new InquiryBudgetError('configuration');
    if(!Array.isArray(body.input)||body.input.some((message:{role?:string;content?:unknown})=>!['system','developer','user','assistant'].includes(message.role??'')||!(typeof message.content==='string'||Array.isArray(message.content)&&message.content.every(part=>part.type==='input_text'&&typeof part.text==='string'))))throw new InquiryBudgetError('text_only');
    init.signal?.throwIfAborted();
    if(!await rpc('cb_inquiry_trial_reserve',transport))throw new InquiryBudgetError('budget_exhausted');
    init.signal?.throwIfAborted();
    return transport(input,{...init,redirect:'error'});
  };
}
