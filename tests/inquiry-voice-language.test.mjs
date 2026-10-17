import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function load(file,mocks={},globals={}){
 const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:id=>mocks[id],Response,URL,Uint8Array,Blob,FormData,AbortSignal,process:{env:{SIGN_STUDIO_OPENAI_API_KEY:'test-only'}},...globals});return exports;
}
const languages=load('lib/inquiry-assistant/spoken-language.ts');
const audio=load('lib/inquiry-assistant/audio.ts');
const wav=audio.pcmWave(new Float32Array(16000).fill(0.1));
function fixture({authenticated=true,available=true}={}){
 let reservations=0;const forms=[];let answer;
 const route=load('app/api/inquiry-assistant/transcribe/route.ts',{
  '@/lib/admin-auth':{isAdminAuthenticated:async()=>authenticated},
  '@/lib/inquiry-assistant/budget':{voiceTrialAvailable:async()=>available,reserveInquiryCall:async()=>{reservations++;}},
  '@/lib/inquiry-assistant/audio':audio,'@/lib/inquiry-assistant/spoken-language':languages,
 },{fetch:async(url,init)=>{assert.equal(url,'https://api.openai.com/v1/audio/transcriptions');forms.push(init.body);return Response.json(answer);}});
 return {run:async(result,origin='https://preview.example')=>{answer=result;return route.POST(new Request('https://preview.example/api/inquiry-assistant/transcribe?language=de',{method:'POST',headers:{origin,'content-type':'audio/wav'},body:wav}));},forms,reservations:()=>reservations};
}
test('every turn detects Arabic, English, German without a page language hint',async()=>{
 const f=fixture();
 for(const [language,text,code] of [['arabic','بدي ألف بروشور','ar'],['english','Make that two thousand','en'],['german','Bitte auf beiden Seiten','de']]){
  const r=await f.run({language,text});assert.equal(r.status,200);assert.deepEqual(await r.json(),{language:code,text});
  const form=f.forms.at(-1);assert.equal(form.has('language'),false);assert.equal(form.get('response_format'),'verbose_json');assert.equal(form.get('model'),'whisper-1');
  assert.equal(languages.voiceLocale(code),{ar:'ar',en:'en-GB',de:'de-DE'}[code]);
 }
 assert.equal(f.reservations(),3);
});
test('unrecognized language remains unknown instead of silently becoming German',async()=>{
 const f=fixture();const r=await f.run({language:'unknown',text:'Caro Bara'});assert.equal((await r.json()).language,null);
 for(const value of [null,{},['arabic'],'french'])assert.equal(languages.spokenLanguage(value),null);
});
test('voice auth, origin and insufficient complete-turn budget prevent paid transcription',async()=>{
 const blocked=fixture({authenticated:false});assert.equal((await blocked.run({})).status,401);assert.equal(blocked.reservations(),0);
 const foreign=fixture();assert.equal((await foreign.run({},'https://evil.example')).status,403);assert.equal(foreign.reservations(),0);
 const budget=fixture({available:false});assert.equal((await budget.run({})).status,503);assert.equal(budget.reservations(),0);assert.equal(budget.forms.length,0);
});
