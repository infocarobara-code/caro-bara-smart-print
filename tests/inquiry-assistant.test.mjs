import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
const cache=new Map();
function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file);const exports={};cache.set(file,exports);const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;vm.runInNewContext(code,{exports,structuredClone,TextEncoder,require:id=>{let p=id.startsWith('@/')?path.resolve(id.slice(2)):path.resolve(path.dirname(file),id);if(fs.existsSync(p+'.ts'))p+='.ts';else p+='/index.ts';return load(p);}});return exports;}
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

function api(authenticated=true){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync('app/api/inquiry-assistant/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,Response,URL,Uint8Array,TextDecoder,require:id=>({'@/lib/admin-auth':{isAdminAuthenticated:async()=>authenticated},'@/lib/inquiry-assistant/turn':turn}[id])});return exports;}
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
