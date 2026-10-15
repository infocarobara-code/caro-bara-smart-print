import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import ts from 'typescript';import {PGlite} from '@electric-sql/pglite';
function load(path,mocks={}){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:id=>{if(id in mocks)return mocks[id];throw Error(id)},Date,Set,JSON});return exports}
const categoryData=load('data/categories.ts');const model=load('lib/catalog/model.ts',{'@/data/categories':categoryData});
test('catalogue draft preserves IDs; publishing requires three complete translations and safe known image assets',()=>{
 const d=model.defaultDocument();assert.equal(model.validDocument(d,true),true);
 d.entries[0].title.ar='';assert.equal(model.validDocument(d),true);assert.equal(model.validDocument(d,true),false);
 d.entries[0].title.ar='اسم جديد';d.entries[0].image='https://outside.invalid/image.jpg';assert.equal(model.validDocument(d),false);
 d.entries[0].image=categoryData.categories[0].image;d.entries[0].id='unknown';assert.equal(model.validDocument(d),false);
 const ordered=model.defaultDocument();[ordered.entries[0].order,ordered.entries[1].order]=[1,0];assert.equal(model.publicCategories(ordered)[0].id,ordered.entries[1].id);
 ordered.entries[1].order=1;assert.equal(model.validDocument(ordered),false);
 for(const c of categoryData.categories)assert.ok(fs.existsSync('public'+c.image),c.image);
});
test('admin publication uses saved draft, rejects stale revisions and denies anonymous access before data reads',async()=>{
 let auth=false,reads=0,writes=0,invalidations=0,body={action:'publish',revision:2,document:model.defaultDocument()};let saved=model.defaultDocument();saved.entries[0].title.de='Gespeicherter Entwurf';
 class BookingError extends Error{constructor(code,status){super(code);this.code=code;this.status=status}}
 const api=load('app/api/admin/categories/route.ts',{'next/cache':{revalidateTag(){invalidations++}},'@/lib/admin-auth':{isAdminAuthenticated:async()=>auth},'@/lib/appointments/store':{BookingError,assertOrigin(){},parseBody:async()=>body,database:async(_path,method,data)=>{writes++;assert.equal(method,'PATCH');assert.equal(data.published.entries[0].title.de,'Gespeicherter Entwurf');return [{}]}},'@/lib/appointments/http':{ok:x=>x,fail:e=>({error:e.code,status:e.status})},'@/lib/catalog/server':{categoryState:async()=>{reads++;return {revision:2,draft:saved,published:{},published_at:null}}},'@/lib/catalog/model':model});
 assert.equal((await api.GET()).status,401);assert.equal((await api.POST({})).status,401);assert.equal(reads,0);
 auth=true;body.revision=1;assert.equal((await api.POST({})).status,409);assert.equal(writes,0);
 body.revision=2;assert.equal((await api.POST({})).published,true);assert.equal(writes,1);assert.equal(invalidations,1);
 saved.entries[0].description.en='';assert.equal((await api.POST({})).status,400);assert.equal(writes,1);
});
test('category storage has one stable row, isolates drafts from published content and denies both public roles',async()=>{
 const pg=new PGlite();try{await pg.exec('create role anon;create role authenticated;create role service_role bypassrls;');const file=fs.readdirSync('supabase/migrations').find(p=>p.endsWith('_category_content.sql'));const sql=fs.readFileSync('supabase/migrations/'+file,'utf8');await pg.exec(sql);await pg.exec(sql);
 for(const role of ['anon','authenticated']){await pg.exec('set role '+role);await assert.rejects(pg.query('select * from cb_category_content'),/permission denied/);await pg.exec('reset role');}
 await pg.exec('set role service_role');await pg.query("update cb_category_content set draft=$1,revision=1 where id=true and revision=0",[JSON.stringify(model.defaultDocument())]);const state=await pg.query('select revision,published from cb_category_content');assert.equal(state.rows[0].revision,1);assert.deepEqual(state.rows[0].published,{version:1,entries:[]});const stale=await pg.query('update cb_category_content set revision=2 where revision=0 returning id');assert.equal(stale.rows.length,0);
 }finally{await pg.close()}
});
test('public category page reads the published category context, not an independent hardcoded list',async()=>{
 const React=await import('react');const runtime=await import('react/jsx-runtime');const {renderToStaticMarkup}=await import('react-dom/server');const exports={};
 const published=model.publicCategories(model.defaultDocument());published[0]={...published[0],title:{ar:'فئة منشورة',de:'Veröffentlichte Kategorie',en:'Published category'}};
 const code=ts.transpileModule(fs.readFileSync('app/request/page.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 vm.runInNewContext(code,{exports,Set,require:id=>{
 if(id==='react')return React;if(id==='react/jsx-runtime')return runtime;
 if(id==='@/lib/catalog/context')return {useCategories:()=>published};
 if(id==='@/lib/languageContext')return {useLanguage:()=>({language:'de',dir:'ltr'})};
 if(id==='@/data/services')return {getServicesByCategory:()=>[{id:'s',title:{de:'Service'}}],searchServices:()=>[]};
 if(id==='next/link')return {default:({children,...props})=>React.createElement('a',props,children)};
 if(id==='next/image')return {default:({fill,priority,...props})=>React.createElement('img',props)};
 if(id==='lucide-react')return {ArrowLeft:()=>null,ArrowRight:()=>null,Search:()=>null};
 if(id==='./request.module.css')return {default:{}};
 if(id==='@/components/Header'||id==='@/components/CartPopup')return {default:()=>null};
 throw Error(id);
 }});const html=renderToStaticMarkup(React.createElement(exports.default));assert.match(html,/Veröffentlichte Kategorie/);assert.doesNotMatch(html,/Intelligente Anfrage/);
});
