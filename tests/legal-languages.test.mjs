import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createRequire} from 'node:module';
const nodeRequire=createRequire(import.meta.url);
function load(path,mocks={}){
 const exports={};
 const code=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 vm.runInNewContext(code,{exports,require:id=>mocks[id]??nodeRequire(id),Date,Intl});
 return exports;
}
const terms=load('lib/legal/terms.ts'),privacy=load('lib/legal/privacy.ts');
const data=load('lib/legal/content.ts',{'./terms':terms,'./privacy':privacy});
let language='de';
const {default:Page}=load('components/LegalPage.tsx',{
 '@/components/Header':{default:()=>null},
 'next/link':{default:({href,children})=>React.createElement('a',{href},children)},
 '@/lib/languageContext':{useLanguage:()=>({language,dir:language==='ar'?'rtl':'ltr'})},
 '@/lib/legal/content':data,
});
for(const id of Object.keys(data.legalContent)){
 test(`${id} switches the entire legal page among DE, AR and EN`,()=>{
  let previous;
  for(const lang of ['de','ar','en']){
   language=lang;
   const localized=data.legalContent[id][lang];
   const html=renderToStaticMarkup(React.createElement(Page,{pageId:id}));
   assert.match(html,new RegExp(`lang="${lang}"`));
   assert.match(html,new RegExp(`dir="${lang==='ar'?'rtl':'ltr'}"`));
   assert.ok(html.includes(localized.title));
   assert.ok(html.includes(localized.summary));
   assert.equal(localized.sections.length,data.legalContent[id].de.sections.length);
   for(const [heading] of localized.sections)assert.ok(html.includes(heading));
   assert.notEqual(html,previous);
   if(lang!=='ar')assert.doesNotMatch(html,/[\u0600-\u06ff]/);
   else assert.doesNotMatch(html,/Verantwortlicher|Anbieter nach|Hinweis zur Website|Stand:|Allgemeine Geschäftsbedingungen/);
   previous=html;
  }
 });
}
test('legal receipt notices follow the email language without trilingual blocks',()=>{
 const {legalReceiptHtml}=load('lib/legal/receipt.ts');
 for(const lang of ['de','ar','en']){
  const html=legalReceiptHtml(lang);
  assert.match(html,new RegExp(`lang="${lang}"`));
  if(lang!=='ar')assert.doesNotMatch(html,/[\u0600-\u06ff]/);
  if(lang!=='de')assert.doesNotMatch(html,/Unverbindliche Eingangsbestätigung|Impressum|Datenschutz/);
  if(lang!=='en')assert.doesNotMatch(html,/Non-binding inquiry receipt|Legal notice/);
 }
});
