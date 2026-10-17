import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {PGlite} from '@electric-sql/pglite';
function guard({reserve=true,dbFail=false,env={}}={}){
 const calls=[];const exports={};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/sign-studio-budget.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,URL,TextEncoder,AbortSignal,process:{env:{VERCEL_ENV:'preview',VERCEL_GIT_COMMIT_REF:'feature/interactive-sign-studio',SUPABASE_URL:'https://mmnbqvwjemyxhjzhzlcu.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'test',...env}},fetch:async(url,init)=>{calls.push({url,init});if(url.includes('supabase')){if(dbFail)throw Error('offline');return Response.json(reserve);}return Response.json({ok:true});}});
 return {fetch:exports.budgetedOpenAIFetch(),calls};
}
const url='https://api.openai.com/v1/responses';
const init=(extra={})=>({method:'POST',body:JSON.stringify({model:'gpt-6-astra',max_output_tokens:1200,service_tier:'default',store:false,...extra})});
test('durable reservation precedes provider; failed/closed budget and wrong environment fail closed',async()=>{
 for(const options of [{reserve:false},{dbFail:true},{env:{VERCEL_ENV:'production'}},{env:{SUPABASE_URL:'https://another-project.supabase.co'}}]){const g=guard(options);await assert.rejects(()=>g.fetch(url,init()));assert.equal(g.calls.filter(c=>c.url===url).length,0);}
 const g=guard();await g.fetch(url,init());assert.equal(g.calls.length,2);assert.match(g.calls[0].url,/cb_sign_trial_reserve$/);assert.equal(g.calls[1].init.redirect,'error');await assert.rejects(()=>g.fetch(url,init()));assert.equal(g.calls.length,2);
});
test('transport rejects oversized payloads, expensive tiers, output changes and tools before reserving',async()=>{
 for(const extra of [{input:'x'.repeat(12000)},{service_tier:'fast'},{max_output_tokens:1201},{tools:[{type:'web_search'}]},{store:true},{model:'other'},{previous_response_id:'old'}]){const g=guard();await assert.rejects(()=>g.fetch(url,init(extra)));assert.equal(g.calls.length,0);}
});
test('database quota survives separate callers, caps attempts and denies public roles',async()=>{
 const db=new PGlite();await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
 await db.exec(fs.readFileSync('supabase/migrations/20261017092434_sign_studio_trial_budget.sql','utf8'));
 const reserve=async()=> (await db.query('select public.cb_sign_trial_reserve() as ok')).rows[0].ok;
 assert.equal(await reserve(),false);
 await db.exec("update public.cb_sign_trial_budget set enabled=true, expires_at=now()+interval '1 day';");
 const concurrent=await Promise.all(Array.from({length:15},reserve));assert.equal(concurrent.filter(Boolean).length,1);
 for(let i=1;i<10;i++){await db.exec('update public.cb_sign_trial_budget set last_attempt_at=null');assert.equal(await reserve(),true);}
 await db.exec('update public.cb_sign_trial_budget set last_attempt_at=null');assert.equal(await reserve(),false);
 assert.equal((await db.query('select attempts from public.cb_sign_trial_budget')).rows[0].attempts,10);
 await db.exec('set role anon');await assert.rejects(()=>reserve());await assert.rejects(()=>db.query('select * from public.cb_sign_trial_budget'));await db.exec('reset role');
 await db.exec("update public.cb_sign_trial_budget set attempts=0,expires_at=now()-interval '1 second'");assert.equal(await reserve(),false);await db.close();
});
