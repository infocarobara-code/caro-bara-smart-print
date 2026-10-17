import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function load(file, require) {
 const exports={};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require,encodeURIComponent});
 return exports;
}
const helper=load('lib/admin-login-return.ts');
test('return destination accepts only exact assistant path',()=>{
 assert.equal(helper.adminLoginReturn('/inquiry-assistant'),'/inquiry-assistant');
 for(const value of [undefined,null,['/inquiry-assistant'],'https://evil.example','//evil.example','/\\evil.example','/inquiry-assistant/../admin','/inquiry-assistant?next=//evil.example','%2Finquiry-assistant','/admin/login']) assert.equal(helper.adminLoginReturn(value),'');
});
for(const valid of [true,false])test(`login preserves assistant destination with valid=${valid}`,async()=>{
 let sessions=0;
 const actions=load('app/admin/login/actions.ts',id=>id==='next/navigation'?{redirect:url=>{throw new Error(url);}}:id==='@/lib/admin-login-return'?helper:{verifyAdminCredentials:async()=>valid,createAdminSession:async()=>{sessions++;},clearAdminSession:async()=>{}});
 const form=new FormData();form.set('next','/inquiry-assistant');form.set('lang','ar');
 await assert.rejects(actions.loginAction(form),e=>e.message===(valid?'/inquiry-assistant':'/admin/login?lang=ar&error=invalid_credentials&next=%2Finquiry-assistant'));
 assert.equal(sessions,valid?1:0);
});
test('tampered return destination falls back to normal admin landing',async()=>{
 const actions=load('app/admin/login/actions.ts',id=>id==='next/navigation'?{redirect:url=>{throw new Error(url);}}:id==='@/lib/admin-login-return'?helper:{verifyAdminCredentials:async()=>true,createAdminSession:async()=>{},clearAdminSession:async()=>{}});
 const form=new FormData();form.set('next','https://evil.example');form.set('lang','en');
 await assert.rejects(actions.loginAction(form),e=>e.message==='/admin/appointments?lang=en');
});
