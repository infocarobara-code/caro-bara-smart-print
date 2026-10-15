import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as jsx from 'react/jsx-runtime';
import * as icons from 'lucide-react';
function load(path,mocks,globals={}){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,{exports,require:id=>{if(id in mocks)return mocks[id];throw Error(id)},Date,Intl,URLSearchParams,console,...globals});return exports;}
const css={default:new Proxy({},{get:(_,k)=>k})};
const Nav=load('app/admin/AdminNav.tsx',{'lucide-react':icons,'react/jsx-runtime':jsx,'next/link':{default:'a'},'./login/actions':{logoutAction:()=>{}},'./admin.module.css':css}).default;
const adminModel=load('lib/appointments/admin-model.ts',{});
const operationCopy=load('app/admin/appointments/operations-copy.ts',{});
const policyModule=load('lib/appointments/policy.ts',{});const policy=policyModule.DEFAULT_POLICY;
const appointment={id:'fixture',reference:'CB-TEST',full_name:'Test Person',start_at:'2099-10-16T13:00:00Z',end_at:'2099-10-16T14:00:00Z',status:'pending',mode:'we_come_free',email:'test@example.invalid',phone:'000',notes:'نص العميل الأصلي',revision:0};
function harness(lang='de',rows=[appointment]){
 let slots=[],index=0,effects=[],first=true,failRefresh=false,writes=0;
 const mockReact={useState(initial){const i=index++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return [slots[i],v=>{slots[i]=typeof v==='function'?v(slots[i]):v}]},useRef(value){const i=index++;return slots[i]??(slots[i]={current:value})},useCallback:f=>f,useEffect(f){if(first)effects.push(f)}};
 let policyResponse=structuredClone(policy);
 const Page=load('app/admin/appointments/AppointmentOffice.tsx',{'@/lib/appointments/admin-model':adminModel,'./operations-copy':operationCopy,'react':mockReact,'react/jsx-runtime':jsx,'next/link':{default:'a'},'../AdminNav':{default:Nav},'../admin.module.css':{default:new Proxy({},{get:(_,k)=>k})},'@/lib/appointments/policy':{DEFAULT_POLICY:policy,validatePolicy:policyModule.validatePolicy}}, {window:{location:{search:`?lang=${lang}`},confirm:()=>true},fetch:async(_url,options)=>{if(options?.method === "POST")writes++;return ({ok:!failRefresh||options?.method === "POST",json:async()=>options?.method === "POST"?{success:true}:{success:!failRefresh,appointments:rows,outbox:[],settings:[{policy:policyResponse,updated_at:'2026-10-15T10:00:00Z'}]}});}}).default;
 function render(){index=0;const tree=Page();first=false;return tree;}
 const flat=tree=>!tree||typeof tree!=='object'?[]:Array.isArray(tree)?tree.flatMap(flat):[tree,...flat(tree.props?.children)];
 const flush=()=>new Promise(resolve=>setImmediate(resolve));
 return {render,flat,flush,get writes(){return writes},async start(){render();effects.forEach(f=>f());await flush();return render()},fail(){failRefresh=true},newPolicy(p){policyResponse=p}};
}
test('appointment workspace uses three languages, preserves original text and blocks past confirmation',async()=>{
 for(const [lang,label] of [['ar','تأكيد الموعد'],['de','Termin bestätigen'],['en','Confirm appointment']]){
  const h=harness(lang,[{...appointment,start_at:'2000-01-01T10:00Z',end_at:'2000-01-01T11:00Z'}]);let tree=await h.start();
  let nodes=h.flat(tree);const history=nodes.find(n=>n.type==='input'&&n.props.type==='checkbox');history.props.onChange({target:{checked:true}});nodes=h.flat(h.render());
  assert.ok(nodes.some(n=>n.type==='p'&&n.props.children==='نص العميل الأصلي'));
  const button=nodes.find(n=>n.type==='button'&&n.props.children===label);assert.equal(button.props.disabled,true);
 }
});
test('a successful write followed by failed refresh does not display a success notice',async()=>{
 const h=harness();let nodes=h.flat(await h.start());h.fail();nodes.find(n=>n.type==='button'&&n.props.children==='Termin bestätigen').props.onClick();await h.flush();nodes=h.flat(h.render());assert.equal(nodes.some(n=>n.props?.role==='status'),false);assert.equal(nodes.some(n=>n.props?.role==='alert'),true);
});
test('refresh preserves an unsaved schedule draft',async()=>{
 const h=harness();let nodes=h.flat(await h.start());nodes.find(n=>n.type==='button'&&n.props.children==='Wochenplan').props.onClick();nodes=h.flat(h.render());const form=nodes.find(n=>n.type==='form');form.props.onChange();nodes.find(n=>n.type==='input'&&n.props.type==='time').props.onChange({target:{value:'12:00'}});
 h.newPolicy({...structuredClone(policy),leadMinutes:300});nodes=h.flat(h.render());nodes.find(n=>n.type==='button'&&n.props.children==='Aktualisieren').props.onClick();await h.flush();nodes=h.flat(h.render());assert.equal(nodes.find(n=>n.type==='input'&&n.props.type==='time').props.value,'12:00');
});

test('synchronous action guard blocks double clicks before React rerenders',async()=>{
 const h=harness();const nodes=h.flat(await h.start());const button=nodes.find(n=>n.type==='button'&&n.props.children==='Termin bestätigen');button.props.onClick();button.props.onClick();await h.flush();assert.equal(h.writes,1);
});
test('a durable write with failed refresh blocks a second write until data refresh',async()=>{
 const h=harness();let nodes=h.flat(await h.start());h.fail();nodes.find(n=>n.type==='button'&&n.props.children==='Termin bestätigen').props.onClick();await h.flush();nodes=h.flat(h.render());const button=nodes.find(n=>n.type==='button'&&n.props.children==='Termin bestätigen');assert.equal(button.props.disabled,true);button.props.onClick();await h.flush();assert.equal(h.writes,1);
});

test('shared administration navigation labels every destination and preserves language/search context',()=>{
 const flat=t=>!t||typeof t!=='object'?[]:Array.isArray(t)?t.flatMap(flat):[t,...flat(t.props?.children)];
 for(const lang of ['ar','de','en']){
  const nodes=flat(Nav({lang,active:'customers',office:'customer_data',search:'أصل العميل'}));
  const current=nodes.filter(n=>n.type==='a'&&n.props['aria-current']==='page');
  assert.equal(current.length,1);
  assert.match(current[0].props.href,/office=customer_data/);
  assert.equal(nodes.filter(n=>n.type==='a'&&n.props.href?.startsWith('/admin/')).length,7);
  for(const link of nodes.filter(n=>n.type==='a'&&n.props.href?.includes('&search='))){assert.ok(link.props.href.includes(encodeURIComponent('أصل العميل')));assert.match(link.props.href,/office=customer_data/);}
  assert.equal(nodes.find(n=>n.type==='header').props.dir,lang==='ar'?'rtl':'ltr');
  assert.equal(nodes.filter(n=>n.type==='nav').length,1);
 }
});
