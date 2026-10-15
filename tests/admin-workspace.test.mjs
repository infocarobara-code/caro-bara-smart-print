import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as jsx from 'react/jsx-runtime';
function load(path,mocks,globals={}){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,{exports,require:id=>{if(id in mocks)return mocks[id];throw Error(id)},Date,Intl,URLSearchParams,console,...globals});return exports;}
const css={default:new Proxy({},{get:(_,k)=>k})};
const Nav=load('app/admin/AdminNav.tsx',{'react/jsx-runtime':jsx,'next/link':{default:'a'},'./login/actions':{logoutAction:()=>{}},'./admin.module.css':css}).default;
const policyModule=load('lib/appointments/policy.ts',{});const policy=policyModule.DEFAULT_POLICY;
const appointment={id:'fixture',reference:'CB-TEST',full_name:'Test Person',start_at:'2099-10-16T13:00:00Z',end_at:'2099-10-16T14:00:00Z',status:'pending',mode:'we_come_free',email:'test@example.invalid',phone:'000',notes:'نص العميل الأصلي',revision:0};
function harness(lang='de',rows=[appointment]){
 let slots=[],index=0,effects=[],first=true,failRefresh=false;
 const mockReact={useState(initial){const i=index++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return [slots[i],v=>{slots[i]=typeof v==='function'?v(slots[i]):v}]},useRef(value){const i=index++;return slots[i]??(slots[i]={current:value})},useCallback:f=>f,useEffect(f){if(first)effects.push(f)}};
 let policyResponse=structuredClone(policy);
 const Page=load('app/admin/appointments/AppointmentOffice.tsx',{'react':mockReact,'react/jsx-runtime':jsx,'next/link':{default:'a'},'../AdminNav':{default:Nav},'../admin.module.css':{default:new Proxy({},{get:(_,k)=>k})},'@/lib/appointments/policy':{DEFAULT_POLICY:policy,validatePolicy:policyModule.validatePolicy}}, {window:{location:{search:`?lang=${lang}`},confirm:()=>true},fetch:async(_url,options)=>({ok:!failRefresh||options?.method === "POST",json:async()=>options?.method === "POST"?{success:true}:{success:!failRefresh,appointments:rows,outbox:[],settings:[{policy:policyResponse,updated_at:'2026-10-15T10:00:00Z'}]}})}).default;
 function render(){index=0;const tree=Page();first=false;return tree;}
 const flat=tree=>!tree||typeof tree!=='object'?[]:Array.isArray(tree)?tree.flatMap(flat):[tree,...flat(tree.props?.children)];
 const flush=()=>new Promise(resolve=>setImmediate(resolve));
 return {render,flat,flush,async start(){render();effects.forEach(f=>f());await flush();return render()},fail(){failRefresh=true},newPolicy(p){policyResponse=p}};
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
