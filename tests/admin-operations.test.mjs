import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function load(path,mocks={},globals={}){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:id=>{if(id in mocks)return mocks[id];throw Error(id)},Date,Intl,...globals});return exports;}
const model=load('lib/appointments/admin-model.ts');
const now=Date.parse('2026-10-15T10:00Z');
const row=(id,status,start,end,late=null)=>({id,reference:'CB-'+id,full_name:'Original name',revision:0,status,start_at:start,end_at:end,cancellation_requested_at:late});
const rows=[row('past','pending','2026-10-14T10:00Z','2026-10-14T11:00Z'),row('later','pending','2026-10-16T14:00Z','2026-10-16T15:00Z'),row('today','confirmed','2026-10-15T22:30Z','2026-10-15T23:00Z','2026-10-15T09:00Z'),row('early','pending','2026-10-16T10:00Z','2026-10-16T11:00Z')];
test('work queues distinguish upcoming pending, past unresolved, late requests and Berlin local days',()=>{
 assert.deepEqual(Array.from(model.selectAppointments(rows,'pending',false,'',now),r=>r.id),['early','later']);
 assert.deepEqual(Array.from(model.selectAppointments(rows,'unresolved',false,'',now),r=>r.id),['past']);
 assert.deepEqual(Array.from(model.selectAppointments(rows,'late',false,'',now),r=>r.id),['today']);
 assert.equal(model.selectAppointments(rows,'today',false,'',now).length,0); // 22:30 UTC is next day in Berlin
 assert.equal(model.selectAppointments(rows,'pending',false,' CB-EARLY ',now).length,1);
 assert.equal(model.berlinDay('2026-10-25T00:30Z'),model.berlinDay('2026-10-25T01:30Z')); // DST repeated hour
});
test('mail retries respect provider acceptance, attempt bounds and exact 23-hour boundary',()=>{
 const mail={id:'m',appointment_id:'a',event:'confirmed',recipient:'customer',attempts:0,created_at:new Date(now-1000).toISOString(),sent_at:null,last_error:null};
 assert.equal(model.canRetry(mail,now),true);
 assert.equal(model.canRetry({...mail,attempts:5},now),false);
 assert.equal(model.canRetry({...mail,created_at:new Date(now-23*3600000).toISOString()},now),false);
 assert.equal(model.canRetry({...mail,sent_at:new Date(now).toISOString()},now),false);
 assert.equal(model.mailState({...mail,last_error:'PDF_ENOENT'},now),'review');
 assert.equal(model.mailState({...mail,last_error:'old-error',sent_at:new Date(now).toISOString()},now),'accepted');
 assert.equal(model.validAppointments([{...rows[0],start_at:'broken'}]),false);
 assert.equal(model.validMail([{...mail,attempts:-1}]),false);
});
test('admin reads isolate upcoming work, omit internal idempotency fields and disclose query bounds',async()=>{
 const paths=[];const api=load('app/api/appointments/admin/route.ts',{
 'next/server':{after(){}},'@/lib/admin-auth':{isAdminAuthenticated:async()=>true},'@/lib/appointments/store':{database:async path=>{paths.push(path);return path.includes('end_at=gte.')?Array.from({length:301},(_,i)=>({id:String(i)})):[]}},'@/lib/appointments/policy':{},'@/lib/appointments/notifications':{},'@/lib/appointments/http':{ok:x=>x,fail:e=>{throw e}}});
 const result=await api.GET();assert.equal(result.appointments.length,300);assert.equal(result.limits.upcoming,true);
 assert.ok(paths.some(p=>p.includes('end_at=gte.')&&p.includes('order=start_at.asc')));
 assert.ok(paths.some(p=>p.includes('status=in.(pending,confirmed)')));
 assert.ok(paths.every(p=>!p.includes('select=*')&&!p.includes('idempotency_key')&&!p.includes('payload_hash')));
});
test('mail retry requires a specific appointment and eligible queued work before scheduling dispatch',async()=>{
 let body={action:'retry'},scheduled=0,queries=[];
 class BookingError extends Error{constructor(code,status){super(code);this.code=code;this.status=status}}
 const api=load('app/api/appointments/admin/route.ts',{
 'next/server':{after(){scheduled++}},'@/lib/admin-auth':{isAdminAuthenticated:async()=>true},'@/lib/appointments/store':{BookingError,assertOrigin(){},parseBody:async()=>body,database:async p=>{queries.push(p);return []}},'@/lib/appointments/policy':{},'@/lib/appointments/notifications':{},'@/lib/appointments/http':{ok:x=>x,fail:e=>({error:e.code,status:e.status})}});
 assert.equal((await api.POST({})).status,400);assert.equal(queries.length,0);assert.equal(scheduled,0);
 body={action:'retry',id:'4886e5cf-d48e-4f4d-9f33-d0739d554564'};
 assert.equal((await api.POST({})).status,409);assert.equal(scheduled,0);assert.match(queries[0],/appointment_id=eq\..+&sent_at=is.null&attempts=lt.5/);
});
