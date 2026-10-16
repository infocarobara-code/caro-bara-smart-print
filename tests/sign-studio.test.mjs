import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
function load(file,mocks={},globals={}) {
 const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,{exports,require:id=>mocks[id]??require(id),...globals});return exports;
}
const model=load('lib/sign-studio.ts');
const engineeringTranslations=load('components/sign-studio/engineering-copy.ts');
const engineeringScene=load('components/sign-studio/EngineeringScene.tsx',{'@/lib/sign-studio':model});
const translations=load('components/sign-studio/copy.ts');
const Scene=load('components/sign-studio/SignScene.tsx',{'@/lib/sign-studio':model}).default;
function component(language,cart={addToCart(){}}) {
 return load('components/sign-studio/SignStudio.tsx',{'@/lib/sign-studio':model,'@/lib/languageContext':{useLanguage:()=>({language,dir:language==='ar'?'rtl':'ltr'})},'@/lib/cart':cart,'./copy':translations,'./EngineeringScene':engineeringScene,'./engineering-copy':engineeringTranslations,'./SignStudio.module.css':{default:new Proxy({},{get:(_,k)=>String(k)})},'next/link':{default:({href,children,...props})=>React.createElement('a',{href,...props},children)}}).default;
}
test('dimensions keep their physical ratio and correctly accept or reject customer input',()=>{
 assert.equal(model.parseDimension('240,5',80,480),240.5);
 for(const s of ['','0','-10','Infinity','2e2','120cm','481','NaN','1,2,3']) assert.equal(model.parseDimension(s,80,480),null);
 for(const [widthCm,heightCm] of [[240,60],[80,120],[480,20],[240.5,65.25]]){
  const g=model.signGeometry({...model.defaultSign,widthCm,heightCm});assert.equal(g.width/g.height,widthCm/heightCm);assert.equal(g.x+g.width/2,300);
 }
});
test('contrast calculations use actual colors; optimization preserves wording, dimensions and stronger sizes',()=>{
 assert.equal(model.colorContrast('#ffffff','#ffffff'),1);
 assert.equal(model.colorContrast('#000000','#ffffff'),21);
 const before={...model.defaultSign,name:'مقهى فيصل',subtitle:'قهوة وحلويات',foreground:'#203f35',textScale:100};
 const after=model.improveDesign(before);
 assert.equal(after.name,before.name);assert.equal(after.subtitle,before.subtitle);assert.equal(after.widthCm,before.widthCm);assert.equal(after.textScale,100);
 assert.ok(model.colorContrast(after.background,after.foreground)>4.5);
});
for(const language of ['de','ar','en']) test(`interactive studio renders controls, limits, and geometric SVG in ${language}`,()=>{
 const html=renderToStaticMarkup(React.createElement(component(language)));
 assert.ok(html.includes(`dir="${language==='ar'?'rtl':'ltr'}"`));assert.ok(html.includes(engineeringTranslations.engineeringCopy[language].review));
 assert.ok(html.includes('viewBox="0 0 600 400"'));assert.ok(html.includes('width="240" height="60"')); 
 assert.ok(html.includes('accept="image/png,image/jpeg,image/webp"'));assert.ok(html.includes(translations.studioCopy[language].attach));
 assert.ok((html.match(/type="range"/g)||[]).length>=4);
 assert.doesNotMatch(html,/\bfetch\(|API_KEY|<form/);
});
test('generated inquiry uses the existing sign service and preserves all dimensions and customer wording',()=>{
 for(const language of ['ar','de','en']) {
  const request=model.signInquiry({...model.defaultSign,name:'محل فيصل <&>',widthCm:321.5,heightCm:72.25},language,true);
  assert.equal(request.serviceId,'signage');assert.equal(request.requestLanguage,language);
  assert.equal(request.canonicalData.width,'321.5');assert.equal(request.canonicalData.height,'72.25');
  const note=request.fields.find(f=>f.id==='notes').value;
  assert.ok(note.includes('محل فيصل <&>'));assert.ok(note.includes('#153f35'));assert.ok(note.includes('#fff3d9'));
  assert.ok(note.includes({ar:'لا تُنقل الصورة تلقائيًا',de:'nicht automatisch übertragen',en:'not transferred automatically'}[language]));
 }
 assert.throws(()=>model.signInquiry({...model.defaultSign,widthCm:NaN},'de'));
 assert.throws(()=>model.signInquiry({...model.defaultSign,name:' '},'de'));
});
test('inquiry appends to existing cart and storage failure leaves prior items untouched',()=>{
 const saved=new Map();let fail=false;
 const storage={getItem:k=>saved.get(k)||null,setItem(k,v){if(fail)throw new Error('quota');saved.set(k,v)},removeItem:k=>saved.delete(k)};
 const cart=load('lib/cart.ts',{}, {window:{dispatchEvent(){}},localStorage:storage,Event:class{}});
 cart.addToCart({serviceId:'other-service',fields:[{id:'notes',label:'Notes',value:'Keep my existing request'}]});
 cart.addToCart(model.signInquiry(model.defaultSign,'de'));
 const items=cart.getCart();assert.equal(items.length,2);assert.equal(items[0].serviceId,'other-service');assert.equal(items[1].serviceId,'signage');assert.equal(items[1].canonicalData.width,'240');
 fail=true;assert.throws(()=>cart.addToCart(model.signInquiry(model.defaultSign,'en')));assert.equal(JSON.parse(saved.get('cart_v2')).length,2);
});
test('scene escapes customer text instead of injecting markup',()=>{
 const html=renderToStaticMarkup(React.createElement(Scene,{design:{...model.defaultSign,name:'<script>alert(1)</script>'},logo:'',night:true,distance:10,label:'Example'}));
 assert.ok(html.includes('&lt;script&gt;'));assert.doesNotMatch(html,/<script>/);
});

test('family changes preserve artwork and dimensions while resetting incompatible construction',()=>{
 const source={...model.defaultSign,name:'مقهى فيصل',subtitle:'Test',widthCm:321.5,heightCm:71,logoScale:120,font:'cairo'};
 const panel=model.changeFamily(source,'panel');
 assert.equal(panel.name,source.name);assert.equal(panel.widthCm,source.widthCm);assert.equal(panel.font,'cairo');assert.equal(panel.logoScale,120);
 assert.equal(panel.lighting,'none');assert.equal(panel.depthCm,.3);assert.ok(model.validConstruction(panel));
 assert.ok(!model.validConstruction({...panel,lighting:'face'}));
 for (const depthCm of [NaN,Infinity,-1,0,31]) assert.ok(!model.validConstruction({...source,depthCm}));
 assert.ok(!model.validConstruction({...source,lighting:'halo'}));
 assert.throws(()=>model.signInquiry({...panel,lighting:'face'},'de'));
});
test('orthographic projection retains front dimensions and true edge depth',()=>{
 assert.equal(model.projectSignPoint(240,60,12,0,0).x,240);
 assert.equal(model.projectSignPoint(240,60,12,0,0).y,60);
 assert.ok(Math.abs(model.projectSignPoint(240,60,12,90,0).x-12)<1e-10);
 assert.equal(model.projectSignPoint(240,60,12,90,0).y,60);
});
test('inquiry carries versioned construction and explicitly needs workshop review',()=>{
 const d={...model.defaultSign,family:'blade',depthCm:18,font:'cairo',logoScale:125};
 const request=model.signInquiry(d,'en',true), saved=JSON.parse(request.data._design);
 assert.equal(saved.family,'blade');assert.equal(saved.depthCm,18);assert.equal(saved.font,'cairo');assert.equal(saved.logoScale,125);
 assert.match(request.fields.find(x=>x.id==='notes').value,/workshop review required/);
 assert.equal(request.data._designVersion,'2');
});
test('construction view escapes artwork and remains finite at size and camera extremes',()=>{
 for(const family of model.familyOptions) for(const yaw of [-90,-80,0,80,90]) {
 const d={...model.changeFamily(model.defaultSign,family),widthCm:480,heightCm:20,name:'<script>unsafe</script>'};
 const html=renderToStaticMarkup(React.createElement(engineeringScene.default,{design:d,logo:'',night:false,view:{yaw,pitch:45,explode:100,wireframe:true},label:'Concept'}));
 assert.doesNotMatch(html,/NaN|Infinity|<script>/);assert.ok(html.includes('&lt;script&gt;'));
 }
});
