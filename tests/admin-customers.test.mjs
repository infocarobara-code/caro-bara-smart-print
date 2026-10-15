import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as jsx from 'react/jsx-runtime';
function fixture(lang,confirm){let states=[],index=0;const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync('app/admin/CustomerRecords.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{exports,require:id=>id==='react'?{useState(initial){const i=index++;if(!(i in states))states[i]=initial;return [states[i],v=>states[i]=typeof v==='function'?v(states[i]):v]}}:id==='react/jsx-runtime'?jsx:id==='./admin.module.css'?{default:{}}:undefined,window:{confirm}});const props={rows:[{id:'customer',firstName:'اسم العميل',lastName:'Original',address:'Original address',customerNumber:'C-1',email:'original@example.invalid'}],lang,office:'customer_data',search:'',deleteAction:async()=>{throw Error('must not delete in tests')}};const flat=t=>!t||typeof t!=='object'?[]:Array.isArray(t)?t.flatMap(flat):[t,...flat(t.props?.children)];return {render(){index=0;return flat(exports.default(props))}};}
test('customer management preserves original data in all languages and requires both selection and explicit confirmation',()=>{
 for(const lang of ['ar','de','en']){let confirmed=0;const h=fixture(lang,()=>{confirmed++;return false});let nodes=h.render();assert.ok(nodes.some(n=>n.type==='h2'&&n.props.children==='اسم العميل Original'));assert.equal(nodes.some(n=>n.type==='input'&&n.props.type==='checkbox'),false);
 let blocked=0;nodes.find(n=>n.type==='form').props.onSubmit({preventDefault(){blocked++}});assert.equal(blocked,1);assert.equal(confirmed,0);
 nodes.find(n=>n.type==='button').props.onClick();nodes=h.render();nodes.find(n=>n.type==='input'&&n.props.type==='checkbox').props.onChange({target:{checked:true}});nodes=h.render();nodes.find(n=>n.type==='form').props.onSubmit({preventDefault(){blocked++}});assert.equal(confirmed,1);assert.equal(blocked,2);
 }
});
