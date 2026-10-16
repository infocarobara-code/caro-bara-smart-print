import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
function load(file,mocks={}){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,{exports,require:id=>mocks[id]??require(id)});return exports;}
const data=load('data/portfolio.ts');
const Component=load('components/home/HomePortfolio.tsx',{'@/data/portfolio':data,'./HomePortfolio.module.css':{default:new Proxy({},{get:(_,key)=>String(key)})},'next/link':{default:({href,children,...props})=>React.createElement('a',{href,...props},children)}}).default;
test('portfolio entries resolve to actual assets and existing category IDs',()=>{const ids=new Set();const categories=load('data/categories.ts').categories;for(const item of data.portfolio){assert.ok(!ids.has(item.id));ids.add(item.id);assert.ok(categories.some(c=>c.id===item.category));for(const src of [item.image,item.original,...(item.photos??[]).flatMap(p=>[p.image,p.original])].filter(Boolean)){assert.ok(fs.statSync('public'+src).size>1000);assert.ok(fs.statSync('public'+src).size<300000);}for(const lang of ['de','ar','en'])assert.ok(item.description[lang].length>10);}});
for(const lang of ['de','ar','en'])test(`portfolio renders a translated horizontal rail in ${lang}`,()=>{const html=renderToStaticMarkup(React.createElement(Component,{language:lang}));assert.equal((html.match(/<article/g)||[]).length,34);assert.equal((html.match(/loading="lazy"/g)||[]).length,34);assert.ok(html.includes(`dir="${lang==='ar'?'rtl':'ltr'}"`));assert.ok(html.includes('aria-labelledby="portfolio-active-title"'));assert.ok(html.includes('aria-roledescription="carousel"'));assert.ok(html.includes('id="portfolio-rail"'));assert.doesNotMatch(html,/Weitere Arbeiten zeigen|Show more work/);assert.ok(html.includes('/request/category/signage'));if(lang!=='ar')assert.doesNotMatch(html,/[\u0600-\u06ff]/);});

test('each brand owns its gallery without repeated image paths',()=>{for(const item of data.portfolio){const photos=[item,...(item.photos??[])];assert.equal(new Set(photos.map(p=>p.image)).size,photos.length,item.id);for(const photo of photos)assert.ok(photo.image.startsWith('/portfolio/'));}assert.ok(data.portfolio.find(p=>p.id==='choco').photos.length>=4);assert.ok(data.portfolio.find(p=>p.id==='shahba').photos.length>=8);});

test('visual source reconciliation preserves views and keeps differently spelled brands separate',()=>{
 const all=data.portfolio.flatMap(p=>[p,...(p.photos??[])]);
 assert.equal(all.length,122);
 assert.equal(new Set(all.map(p=>p.image)).size,122);
 const latakia=data.portfolio.find(p=>p.id==='latakia');
 const lataria=data.portfolio.find(p=>p.id==='lataria');
 assert.ok(latakia.photos.some(p=>p.image==='/portfolio/archive-22.webp'));
 assert.equal(lataria.image,'/portfolio/batch-latakia-illustrated-large.webp');
 assert.equal(lataria.title.de,'LATARIA');
 assert.ok(data.portfolio.find(p=>p.id==='shahba').photos.some(p=>p.image==='/portfolio/archive-35.webp'));
 assert.equal(data.portfolio.find(p=>p.id==='derbeck').title.de,'Dr. foody');
 assert.equal(data.portfolio.find(p=>p.id==='legend').presentation,true);
});

test('a queued close event cannot dismiss a newly reopened gallery',()=>{
 let calls=0;let stateIndex=0;let refIndex=0;
 const dialog={open:true};
 const mockReact={...React,useEffect(){},useRef(){return {current:refIndex++===0?null:dialog}},useState(initial){const i=stateIndex++;return [i===2?'sultan':initial,i===2?()=>calls++:()=>{}]}};
 const Page=load('components/home/HomePortfolio.tsx',{'react':mockReact,'@/data/portfolio':data,'./HomePortfolio.module.css':{default:{}},'next/link':{default:'a'}}).default;
 const tree=Page({language:'de'});
 const modal=React.Children.toArray(tree.props.children).find(n=>n.type==='dialog');
 modal.props.onClose();assert.equal(calls,0);
 dialog.open=false;modal.props.onClose();assert.equal(calls,1);
});
