import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function load(file,mocks={},globals={}){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:id=>{if(id in mocks)return mocks[id];throw Error(id);},...globals});return exports;}
const model=load('lib/sign-studio.ts');
const validation=load('lib/sign-studio-assistant.ts',{'./sign-studio':model});
const proposal=changes=>({kind:'proposal',changes});
test('assistant preserves exact wording and dimensions; applies compatible family atomically',()=>{
 const base={...model.defaultSign,name:'فيصل <&>',subtitle:'KEEP'};
 const result=validation.validateAssistantProposal(base,proposal([{field:'family',value:'panel'},{field:'background',value:'#112233'}])).design;
 assert.equal(result.name,base.name);assert.equal(result.subtitle,base.subtitle);assert.equal(result.widthCm,base.widthCm);assert.equal(result.heightCm,base.heightCm);assert.equal(result.depthCm,.3);assert.equal(result.lighting,'none');assert.equal(base.family,'lightbox');
});
test('assistant refuses prohibited fields, invalid combinations, duplicates and unsupported output',()=>{
 for(const changes of [[{field:'name',value:'NEW'}],[{field:'widthCm',value:'120'}],[{field:'logo',value:'data:x'}],[{field:'lighting',value:'halo'}],[{field:'logoX',value:'101'}],[{field:'textScale',value:'NaN'}],[{field:'family',value:'panel'},{field:'lighting',value:'face'}],[{field:'font',value:'unknown'}],[{field:'background',value:'url(x)'}],[{field:'logoX',value:'1'},{field:'logoX',value:'2'}]])assert.throws(()=>validation.validateAssistantProposal(model.defaultSign,proposal(changes)));
 assert.throws(()=>validation.validateAssistantProposal(model.defaultSign,{kind:'review',changes:[{field:'font',value:'sans'}]}));
 assert.throws(()=>validation.validateAssistantProposal(model.defaultSign,{...proposal([]),approved:true}));
});
function route({enabled=true,authenticated=true,output=proposal([{field:'background',value:'#112233'}]),fail=false}={}){
 let calls=0;
 const api=load('app/api/sign-studio/assistant/route.ts',{'ai':{generateText:async()=>{calls++;if(fail)throw Error('provider');return {output};},Output:{object:x=>x},jsonSchema:x=>x},'@/lib/admin-auth':{isAdminAuthenticated:async()=>authenticated},'@/lib/sign-studio-assistant':validation,'@/lib/sign-studio':model},{process:{env:enabled?{SIGN_STUDIO_AI_TRIAL_ENABLED:'true',AI_GATEWAY_API_KEY:'mock-not-a-key'}:{}},Response,URL,TextDecoder,AbortSignal});
 return {api,calls:()=>calls};
}
const request=(body={},origin='https://example.com')=>new Request('https://example.com/api/sign-studio/assistant',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify({prompt:'Make background blue',language:'en',design:model.defaultSign,...body})});
test('disabled, unauthenticated, cross-origin and oversized requests never call model',async()=>{
 for(const [options,req,status] of [[{enabled:false},request(),503],[{authenticated:false},request(),401],[{},request({},'https://evil.example'),403],[{},request({prompt:'x'.repeat(9000)}),413],[{},request({prompt:''}),400]]){const r=route(options);assert.equal((await r.api.POST(req)).status,status);assert.equal(r.calls(),0);}
 assert.equal((await route({enabled:false}).api.GET()).status,200);
});
test('validated output only; provider failures and invalid output leave design untouched',async()=>{
 const r=route();assert.equal((await r.api.POST(request())).status,200);assert.equal(r.calls(),1);assert.equal((await r.api.POST(request())).status,429);assert.equal(r.calls(),1);
 for(const options of [{fail:true},{output:proposal([{field:'name',value:'bad'}])}]){const r=route(options);assert.equal((await r.api.POST(request())).status,502);}
});
