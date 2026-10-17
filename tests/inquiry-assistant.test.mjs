import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
const cache=new Map();
function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file);const exports={};cache.set(file,exports);const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;vm.runInNewContext(code,{exports,structuredClone,require:id=>{let p=id.startsWith('@/')?path.resolve(id.slice(2)):path.resolve(path.dirname(file),id);if(fs.existsSync(p+'.ts'))p+='.ts';else p+='/index.ts';return load(p);}});return exports;}
const catalog=load('lib/inquiry-assistant/catalog.ts');
const d=load('lib/inquiry-assistant/draft.ts');
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
function provider(output){const exports={};let call;
 vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/inquiry-assistant/provider.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:id=>({'ai':{generateText:async options=>{call=options;return {output};},jsonSchema:x=>x,Output:{object:x=>x}},'@ai-sdk/openai':{createOpenAI:()=>({responses:()=>({})})},'./draft':d,'./catalog':catalog}[id])});return {run:exports.proposeInquiry,call:()=>call};}
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
