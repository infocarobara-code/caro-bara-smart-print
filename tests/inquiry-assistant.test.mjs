import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { createRequire } from 'node:module';
const nativeRequire=createRequire(import.meta.url);
const cache=new Map();
function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file);const exports={};cache.set(file,exports);const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;vm.runInNewContext(code,{exports,structuredClone,TextEncoder,require:id=>{if(id==='react'||id==='react/jsx-runtime')return nativeRequire(id);let p=id.startsWith('@/')?path.resolve(id.slice(2)):path.resolve(path.dirname(file),id);if(fs.existsSync(p+'.ts'))p+='.ts';else if(fs.existsSync(p+'.tsx'))p+='.tsx';else p+='/index.ts';return load(p);}});return exports;}
const catalog=load('lib/inquiry-assistant/catalog.ts');
const d=load('lib/inquiry-assistant/draft.ts');
const turn=load('lib/inquiry-assistant/turn.ts');
const session=load('lib/inquiry-assistant/session.ts');
const add=(itemId,serviceId)=>({type:'add',itemId,serviceId});
test('catalogue schema covers real services without contact or file fields',()=>{
 const index=catalog.serviceIndex();assert.ok(index.length>10);
 for(const s of index){const schema=catalog.serviceSchema(s.id);assert.equal(schema.path,`/request/service/${s.id}/form`);assert.ok(schema.fields.every(f=>f.type!=='file'&&!catalog.contactField(f)));}
 console.log('Catalogue services:',index.length);
});
test('two identical services remain separate; revisions reject late model responses',()=>{
 let draft=d.applyActions(d.emptyDraft(),0,[add('first','open-request'),add('second','open-request')]);
 draft=d.applyActions(draft,1,[{type:'set',itemId:'second',fieldId:'vision',value:'Zweites Schild'}]);
 assert.equal(draft.items[0].values.vision,undefined);assert.equal(draft.items[1].values.vision,'Zweites Schild');
 assert.throws(()=>d.applyActions(draft,1,[{type:'remove',itemId:'first'}]),/Stale/);
});
test('invalid atomic batch cannot partially change original or impersonate consent',()=>{
 const base=d.applyActions(d.emptyDraft(),0,[add('one','open-request')]);
 for(const action of [{type:'set',itemId:'one',fieldId:'__proto__',value:'x'},{type:'set',itemId:'one',fieldId:'needs',value:['fake']},{type:'submit',itemId:'one'},{type:'contact',fieldId:'reviewedRevision',value:'1'},{type:'add',itemId:'one',serviceId:'signage'}])assert.throws(()=>d.applyActions(base,1,[{type:'set',itemId:'one',fieldId:'vision',value:'changed'},action]));
 assert.equal(base.items[0].values.vision,undefined);
});
test('German options are derived from catalogue; brand wording remains untouched',()=>{
 const base=d.applyActions(d.emptyDraft(),0,[add('one','open-request'),{type:'set',itemId:'one',fieldId:'needs',value:['printing']},{type:'set',itemId:'one',fieldId:'vision',value:'Marke: ورد الشام'}]);
 const fields=d.germanSummary(base)[0].fields;
 assert.equal(fields.find(f=>f.id==='needs').value,'Druck');assert.equal(fields.find(f=>f.id==='vision').value,'Marke: ورد الشام');
});
test('any change invalidates previous review; empty request cannot be approved',()=>{
 assert.throws(()=>d.markReviewed(d.emptyDraft()));
 const base=d.applyActions(d.emptyDraft(),0,[add('one','open-request')]);base.reviewedRevision=base.revision;
 const changed=d.applyActions(base,base.revision,[{type:'contact',fieldId:'fullName',value:'Testkunde'}]);
 assert.equal(changed.reviewedRevision,null);assert.equal(base.contact.fullName,'');
});
test('browser draft revalidation drops review and rejects injected catalogue fields',()=>{
 const draft=d.applyActions(d.emptyDraft(),0,[add('one','open-request')]);draft.reviewedRevision=1;
 assert.equal(d.parseDraft(draft).reviewedRevision,null);
 draft.items[0].values.notAField='x';assert.throws(()=>d.parseDraft(draft));
});
test('wrong option values and contact/file writes cannot bypass catalogue',()=>{
 const draft=d.applyActions(d.emptyDraft(),0,[add('one','open-request')]);
 for(const [fieldId,value] of [['needs',['printing','printing']],['projectStage','invented'],['email','other@example.com'],['sitePhoto','https://example.com/file']])assert.throws(()=>d.applyActions(draft,1,[{type:'set',itemId:'one',fieldId,value}]));
 assert.throws(()=>d.applyActions(draft,1,[{type:'add',itemId:'two',serviceId:'unknown'}]));
});
function provider(output){const exports={};let call;const calls=[];const outputs=Array.isArray(output)?[...output]:[output];
 vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/inquiry-assistant/provider.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,TextEncoder,require:id=>({'ai':{generateText:async options=>{call=options;calls.push(options);const next=outputs.shift();if(next instanceof Error)throw next;return {output:next};},jsonSchema:x=>x,Output:{object:x=>x}},'@ai-sdk/openai':{createOpenAI:()=>({responses:()=>({})})},'./draft':d,'./catalog':catalog,'./turn':turn}[id])});return {run:exports.proposeInquiry,call:()=>call,calls};}
test('model proposal is validated before draft update and cannot mark review or send',async()=>{
 const base=d.applyActions(d.emptyDraft(),0,[add('one','open-request')]);const input={draft:base,message:'وصف',language:'ar',history:[],signal:new AbortController().signal};
 const p=provider({message:'تم فهم الوصف.',actions:[{type:'set',itemId:'one',serviceId:'',fieldId:'vision',value:['Druckprojekt']}]});
 const result=await p.run(input,()=>{},'not-a-real-key');assert.equal(result.draft.items[0].values.vision,'Druckprojekt');assert.equal(base.items[0].values.vision,undefined);assert.equal(p.call().maxRetries,0);assert.equal(p.call().maxOutputTokens,1200);
 const bad=provider({message:'sent',actions:[{type:'submit',itemId:'one',serviceId:'',fieldId:'',value:[]}]});await assert.rejects(()=>bad.run(input,()=>{},'not-a-real-key'));
});
test('new service needs authoritative schema before model can populate fields',async()=>{
 const p=provider({message:'new',actions:[{type:'add',itemId:'new',serviceId:'open-request',fieldId:'',value:[]},{type:'set',itemId:'new',serviceId:'',fieldId:'vision',value:['test']}]});
 await assert.rejects(()=>p.run({draft:d.emptyDraft(),message:'test',language:'de',history:[],signal:new AbortController().signal},()=>{},'not-a-real-key'));
});

const wireAdd=(itemId,serviceId)=>({type:'add',itemId,serviceId,fieldId:'',value:[]});
const wireSet=(itemId,fieldId,...value)=>({type:'set',itemId,serviceId:'',fieldId,value});
const inputFor=(draft=d.emptyDraft())=>({draft,message:'أريد لوحتين، الأولى ورد الشام والثانية مطعم',language:'ar',history:[],signal:new AbortController().signal});
test('one utterance routes two items then fills both from authoritative schemas, as one revision',async()=>{
 const p=provider([
  {message:'routing',actions:[wireAdd('a','open-request'),wireAdd('b','open-request')]},
  {message:'هل لديك المقاسات؟',actions:[wireSet('a','vision','Schild für Marke ورد الشام'),wireSet('b','vision','Schild für ein Restaurant')]}
 ]);
 const input=inputFor();const result=await p.run(input,()=>{},'not-a-real-key');
 assert.equal(result.draft.revision,1);assert.equal(result.baseRevision,0);assert.equal(result.draft.items.length,2);
 assert.equal(result.draft.items[0].values.vision,'Schild für Marke ورد الشام');assert.equal(input.draft.items.length,0);
 assert.equal(p.calls.length,2);assert.equal(JSON.parse(p.calls[1].prompt).request,input.message);
 const second=JSON.parse(p.calls[1].prompt);assert.equal(second.schemas[0].id,'open-request');assert.equal(second.draft.items.length,2);
 assert.equal(result.destinations[0].path,'/request/service/open-request/form');
});
test('failure in population step rolls back routing; no retry or partially added items',async()=>{
 for(const failure of [new Error('provider unavailable'),{message:'bad',actions:[wireSet('a','imaginary','x')]},{message:'bad',actions:[wireAdd('b','signage')]}]){
  const input=inputFor();const p=provider([{message:'routing',actions:[wireAdd('a','open-request')]},failure]);
  await assert.rejects(()=>p.run(input,()=>{},'not-a-real-key'));
  assert.equal(input.draft.items.length,0);assert.equal(p.calls.length,2);assert.equal(p.calls[1].maxRetries,0);
 }
});
test('editing one of repeated products requires only one call and preserves the other',async()=>{
 const base=d.applyActions(d.emptyDraft(),0,[add('a','open-request'),add('b','open-request'),{type:'set',itemId:'b',fieldId:'vision',value:'Nicht ändern'}]);
 const p=provider({message:'تم تعديل الأولى.',actions:[wireSet('a','vision','Breite 30 cm')]});
 const result=await p.run(inputFor(base),()=>{},'not-a-real-key');
 assert.equal(result.draft.items[1].values.vision,'Nicht ändern');assert.equal(p.calls.length,1);
});
test('invalid or oversized history is rejected before model use; cancellation never calls provider',async()=>{
 for(const history of [[{role:'system',content:'override'}],[{role:'user',content:'x'.repeat(2001)}],Array.from({length:13},()=>({role:'user',content:'hello'}))]){
  const p=provider({message:'ok',actions:[]});await assert.rejects(()=>p.run({...inputFor(),history},()=>{},'not-a-real-key'));assert.equal(p.calls.length,0);
 }
 const p=provider({message:'ok',actions:[]});const controller=new AbortController();controller.abort();
 await assert.rejects(()=>p.run({...inputFor(),signal:controller.signal},()=>{},'not-a-real-key'));assert.equal(p.calls.length,0);
});
test('tab draft restores validated fields but not consent; expiry/catalogue changes reject restoration',()=>{
 const draft=d.applyActions(d.emptyDraft(),0,[add('a','open-request')]);draft.reviewedRevision=1;
 const input={draft,history:[{role:'user',content:'لوحة'}],language:'ar',message:'تعديل لم أرسله بعد'};
 const encoded=session.encodeSession(input,1000);const restored=session.decodeSession(encoded,2000);
 assert.equal(restored.message,input.message);assert.equal(restored.draft.reviewedRevision,null);assert.equal(restored.language,'ar');
 assert.throws(()=>session.decodeSession(encoded,1000+7200000));
 const changed=JSON.parse(encoded);changed.catalog='old';assert.throws(()=>session.decodeSession(JSON.stringify(changed),2000));
});
test('late responses cannot overwrite manual edits, including after undo',()=>{
 const base=d.applyActions(d.emptyDraft(),0,[add('a','open-request')]);
 const reply={baseRevision:1,message:'updated',actions:[{type:'set',itemId:'a',fieldId:'vision',value:'KI'}],draft:{reviewedRevision:999}};
 const accepted=session.acceptProposal(base,1,reply);assert.equal(accepted.draft.reviewedRevision,null);
 const manual=d.applyActions(base,1,[{type:'set',itemId:'a',fieldId:'vision',value:'Manuell'}]);
 assert.throws(()=>session.acceptProposal(manual,1,reply),/Stale/);assert.equal(manual.items[0].values.vision,'Manuell');
 const undone=session.undoProposal(accepted.draft,base,2);assert.equal(undone.revision,3);assert.equal(undone.items[0].values.vision,undefined);
 assert.throws(()=>session.acceptProposal(undone,1,reply),/Stale/);
 const later=d.applyActions(accepted.draft,2,[{type:'contact',fieldId:'fullName',value:'Testkunde'}]);assert.throws(()=>session.undoProposal(later,base,2),/Stale/);
});
test('client rejects model deletion and approval actions; bounded history keeps newest conversation',()=>{
 const base=d.applyActions(d.emptyDraft(),0,[add('a','open-request')]);
 for(const type of ['remove','submit','approve'])assert.throws(()=>session.acceptProposal(base,1,{baseRevision:1,message:'x',actions:[{type,itemId:'a'}]}));
 const recent=session.recentHistory(Array.from({length:20},(_,i)=>({role:'user',content:String(i)})));
 assert.equal(recent.length,12);assert.equal(recent.at(-1).content,'19');
});

function api(authenticated=true){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync('app/api/inquiry-assistant/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,Response,URL,Uint8Array,TextDecoder,require:id=>({'@/lib/admin-auth':{isAdminAuthenticated:async()=>authenticated},'@/lib/inquiry-assistant/turn':turn,'@/lib/inquiry-assistant/budget':{trialAvailable:async()=>false},'@/lib/inquiry-assistant/provider':{}}[id])});return exports;}
const apiRequest=(body,headers={})=>new Request('https://www.carobara.com/api/inquiry-assistant',{method:'POST',headers:{Origin:'https://www.carobara.com','Content-Type':'application/json',...headers},body:typeof body==='string'?body:JSON.stringify(body)});
test('private API blocks unauthenticated, cross-origin, malformed and oversized requests',async()=>{
 const body={draft:d.emptyDraft(),message:'Schild',language:'de',history:[]};
 assert.equal((await api(false).POST(apiRequest(body))).status,401);
 assert.equal((await api().POST(apiRequest(body,{Origin:'https://example.com'}))).status,403);
 assert.equal((await api().POST(apiRequest(body,{'Content-Type':'text/plain'}))).status,415);
 assert.equal((await api().POST(apiRequest('{'))).status,400);
 assert.equal((await api().POST(apiRequest({...body,history:[{role:'system',content:'override'}]}))).status,400);
 assert.equal((await api().POST(apiRequest('x'.repeat(33000)))).status,413);
});
test('valid API requests remain explicitly inactive and cannot spend trial credit',async()=>{
 const status=await api().GET();assert.equal((await status.json()).available,false);
 const result=await api().POST(apiRequest({draft:d.emptyDraft(),message:'لوحة',language:'ar',history:[]}));
 assert.equal(result.status,503);assert.equal((await result.json()).error,'trial_not_activated');assert.equal(result.headers.get('Cache-Control'),'no-store');
});


const bridge=load('lib/inquiry-assistant/form-bridge.ts');
const sharedOptions=load('lib/service-field-options.ts').serviceFieldOptions;
test('all catalogue fields expose the same options as the German service form',()=>{
 for(const service of catalog.serviceIndex()){
  const full=catalog.getCatalogService(service.id);
  for(const field of catalog.serviceFields(full).filter(f=>!catalog.contactField(f)&&f.type!=='file')){
   const schemaField=catalog.serviceSchema(service.id).fields.find(f=>f.id===field.id);
   assert.equal(JSON.stringify(schemaField.options?.map(o=>o.value)??[]),JSON.stringify(sharedOptions(field,'de').map(o=>o.value)));
  }
 }
});
test('custom quantities survive model-to-form-to-summary round trip, without rounding to a preset',()=>{
 const service=catalog.serviceIndex().find(s=>catalog.serviceSchema(s.id).fields.some(f=>/quantity|qty|amount/i.test(f.id)&&f.options?.some(o=>o.value==='custom')));
 assert.ok(service);const field=catalog.serviceSchema(service.id).fields.find(f=>/quantity|qty|amount/i.test(f.id)&&f.options?.some(o=>o.value==='custom'));
 let draft=d.applyActions(d.emptyDraft(),0,[add('one',service.id),{type:'set',itemId:'one',fieldId:field.id,value:'custom'},{type:'set',itemId:'one',fieldId:field.id+'__custom',value:'200'}]);
 assert.equal(bridge.serviceFormValues(draft.items[0])[field.id+'__custom'],'200');
 assert.equal(d.germanSummary(draft)[0].fields.find(f=>f.id===field.id).value,'200');
 draft=d.applyActions(draft,1,[bridge.serviceFormAction(draft.items[0],field.id+'__custom','333')]);
 assert.equal(d.germanSummary(draft)[0].fields.find(f=>f.id===field.id).value,'333');
 assert.throws(()=>d.applyActions(draft,2,[bridge.serviceFormAction(draft.items[0],field.id+'__custom','abc')]));
 const preset=field.options.find(o=>!['custom','custom-quantity'].includes(o.value)).value;
 draft=d.applyActions(draft,2,[bridge.serviceFormAction(draft.items[0],field.id,preset)]);
 assert.equal(draft.items[0].values[field.id+'__custom'],undefined);
 assert.throws(()=>d.applyActions(draft,3,[bridge.serviceFormAction(draft.items[0],field.id+'__custom','99')]));
});
test('custom helper restores after its parent even if serialized first; checkbox round trip preserves options',()=>{
 const service=catalog.serviceIndex().find(s=>catalog.serviceSchema(s.id).fields.some(f=>!/quantity|qty|amount/i.test(f.id)&&f.options?.some(o=>o.value==='custom')));
 const field=catalog.serviceSchema(service.id).fields.find(f=>!/quantity|qty|amount/i.test(f.id)&&f.options?.some(o=>o.value==='custom'));
 const raw=d.applyActions(d.emptyDraft(),0,[add('one',service.id)]);raw.items[0].values={[field.id+'__custom']:'44 × 30 cm',[field.id]:'custom'};
 const restored=d.parseDraft(raw);assert.equal(restored.items[0].values[field.id+'__custom'],'44 × 30 cm');
 let check=d.applyActions(d.emptyDraft(),0,[add('check','open-request'),{type:'set',itemId:'check',fieldId:'needs',value:['printing']}]);
 const values=bridge.serviceFormValues(check.items[0]);check=d.applyActions(check,1,[bridge.serviceFormAction(check.items[0],'needs',values.needs)]);
 assert.equal(check.items[0].values.needs[0],'printing');
});
test('real ServiceForm renders controlled assistant values and review action, without adding to cart',()=>{
 const {renderToStaticMarkup}=nativeRequire('react-dom/server');const {createElement}=nativeRequire('react');
 const Form=load('components/ServiceForm.tsx').default;
 const html=renderToStaticMarkup(createElement(Form,{service:catalog.getCatalogService('open-request'),lang:'de',inquiry:{values:{vision:'Marke ورد الشام'},onFieldChange:()=>{},onReview:()=>{},reviewLabel:'ASSISTANT_REVIEW'}}));
 assert.ok(html.includes('Marke ورد الشام'));assert.ok(html.includes('ASSISTANT_REVIEW'));
 const ordinary=renderToStaticMarkup(createElement(Form,{service:catalog.getCatalogService('open-request'),lang:'de'}));
 assert.ok(!ordinary.includes('ASSISTANT_REVIEW'));assert.ok(!ordinary.includes('Marke ورد الشام'));
});

function budget(env={}) {
 const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/inquiry-assistant/budget.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,process:{env},URL,TextEncoder,AbortSignal,fetch});return exports;
}
const trialEnv={VERCEL_ENV:'preview',VERCEL_GIT_COMMIT_REF:'feature/guided-inquiry',INQUIRY_ASSISTANT_TRIAL_ENABLED:'true',SUPABASE_URL:'https://mmnbqvwjemyxhjzhzlcu.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'test-only',SIGN_STUDIO_OPENAI_API_KEY:'test-only'};
const providerRequest=()=>({method:'POST',body:JSON.stringify({model:'gpt-6-astra',max_output_tokens:1200,service_tier:'default',store:false,input:[{role:'user',content:[{type:'input_text',text:'Schild'}]}]})});
test('trial stays closed outside its exact branch and without opt-in',async()=>{
 for(const env of [{},{...trialEnv,VERCEL_ENV:'production'},{...trialEnv,VERCEL_GIT_COMMIT_REF:'main'},{...trialEnv,INQUIRY_ASSISTANT_TRIAL_ENABLED:'false'}]){
  const b=budget(env);let calls=0;const transport=async()=>{calls++;return Response.json(true)};
  assert.equal(await b.trialAvailable(transport),false);
  await assert.rejects(b.budgetedInquiryFetch(transport)('https://api.openai.com/v1/responses',providerRequest()));assert.equal(calls,0);
 }
});
test('durable rejection prevents provider calls; two-call guard disallows SDK retries',async()=>{
 const b=budget(trialEnv);let reservations=0,paid=0;
 const transport=async url=>{if(String(url).includes('/rpc/')){reservations++;return Response.json(true)}paid++;return Response.json({})};
 const guarded=b.budgetedInquiryFetch(transport);
 await guarded('https://api.openai.com/v1/responses',providerRequest());await guarded('https://api.openai.com/v1/responses',providerRequest());
 await assert.rejects(guarded('https://api.openai.com/v1/responses',providerRequest()));assert.equal(reservations,2);assert.equal(paid,2);
 await assert.rejects(b.budgetedInquiryFetch(async()=>Response.json(false))('https://api.openai.com/v1/responses',providerRequest()));
});
test('oversized, foreign-endpoint and non-text requests fail before reserving money',async()=>{
 const b=budget(trialEnv);let calls=0;const transport=async()=>{calls++;return Response.json(true)};
 for(const [url,request] of [['https://example.com',providerRequest()],['https://api.openai.com/v1/responses',{method:'POST',body:'x'.repeat(32001)}],['https://api.openai.com/v1/responses',{...providerRequest(),body:providerRequest().body.replace('input_text','input_image')}]])await assert.rejects(b.budgetedInquiryFetch(transport)(url,request));
 assert.equal(calls,0);
});
test('failed provider calls keep reservation and never retry automatically',async()=>{
 let reservations=0,paid=0;const b=budget(trialEnv);
 await assert.rejects(b.budgetedInquiryFetch(async url=>{if(String(url).includes('/rpc/')){reservations++;return Response.json(true)}paid++;throw Error('timeout')})('https://api.openai.com/v1/responses',providerRequest()));
 assert.equal(reservations,1);assert.equal(paid,1);
});

test('installed AI SDK request passes guard without external network',async()=>{
 const {generateText,Output,jsonSchema}=await import('ai');const {createOpenAI}=await import('@ai-sdk/openai');
 let reservations=0,providerCalls=0;
 const guarded=budget(trialEnv).budgetedInquiryFetch(async(url,init)=>{
  if(String(url).includes('/rpc/')){reservations++;return Response.json(true)}
  providerCalls++;assert.equal(init.redirect,'error');
  return Response.json({id:'resp_test',created_at:0,model:'gpt-6-astra',status:'completed',output:[{type:'message',id:'msg_test',role:'assistant',status:'completed',content:[{type:'output_text',text:'{"message":"Welche Größe?"}',annotations:[]}]}],usage:{input_tokens:10,output_tokens:10,total_tokens:20}});
 });
 const model=createOpenAI({apiKey:'test-only',fetch:guarded}).responses('gpt-6-astra');
 const result=await generateText({model,maxRetries:0,maxOutputTokens:1200,system:'Print inquiry',prompt:'Schild',providerOptions:{openai:{store:false,reasoningEffort:'low',serviceTier:'default'}},output:Output.object({schema:jsonSchema({type:'object',properties:{message:{type:'string'}},required:['message'],additionalProperties:false})})});
 assert.equal(result.output.message,'Welche Größe?');assert.equal(reservations,1);assert.equal(providerCalls,1);
});

test('recorded audio validates actual PCM duration, rejects silence and malformed or oversized audio',()=>{
 const audio=load('lib/inquiry-assistant/audio.ts');
 const samples=new Float32Array(16000).fill(0.1);const wav=audio.pcmWave(samples);
 assert.equal(audio.validateAudio(wav),1);
 assert.throws(()=>audio.validateAudio(audio.pcmWave(new Float32Array(16000))),/silent/);
 const invalid=wav.slice();invalid[24]=0;assert.throws(()=>audio.validateAudio(invalid),/format/);
 assert.throws(()=>audio.validateAudio(audio.pcmWave(new Float32Array(960001).fill(0.1))),/size/);
 assert.throws(()=>audio.validateAudio(wav.slice(0,-1)),/format/);
 assert.equal(audio.validateAudio(audio.pcmWave(new Float32Array(960000).fill(0.1))),60);
});
