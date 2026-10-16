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
test('portfolio entries resolve to actual assets and existing category IDs',()=>{const ids=new Set();const categories=load('data/categories.ts').categories;for(const item of data.portfolio){assert.ok(!ids.has(item.id));ids.add(item.id);assert.ok(categories.some(c=>c.id===item.category));for(const src of [item.image,item.original].filter(Boolean)){assert.ok(fs.statSync('public'+src).size>1000);assert.ok(fs.statSync('public'+src).size<300000);}for(const lang of ['de','ar','en'])assert.ok(item.description[lang].length>10);}});
for(const lang of ['de','ar','en'])test(`portfolio renders a compact translated initial view in ${lang}`,()=>{const html=renderToStaticMarkup(React.createElement(Component,{language:lang}));assert.equal((html.match(/<article/g)||[]).length,6);assert.equal((html.match(/loading="lazy"/g)||[]).length,6);assert.ok(html.includes(`dir="${lang==='ar'?'rtl':'ltr'}"`));assert.ok(html.includes('aria-labelledby="portfolio-active-title"'));assert.ok(html.includes('/request/category/signage'));if(lang!=='ar')assert.doesNotMatch(html,/[\u0600-\u06ff]/);});
