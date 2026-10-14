import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function load(path, mocks = {}) {
 const exports = {};
 const code = ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 vm.runInNewContext(code,{exports,require:id=>{if(id in mocks)return mocks[id];throw new Error(`Unexpected import: ${id}`);}});
 return exports;
}
test('operation profile has real tax identity and no template corporate registration',()=>{
 const {getCompanyProfile}=load('lib/documents/company-profile.ts');
 const p=getCompanyProfile();
 assert.equal(p.legalName,'Mohammad Refat Alyoussef – Caro Bara Werbeagentur');
 assert.equal(p.vatId,'DE367793052');
 assert.equal(p.taxNumber,'32/205/00414');
 assert.equal(p.registrationNumber,undefined);
 assert.doesNotMatch(JSON.stringify(p),/GmbH|DE123456789|HRB 123456/);
});
test('AGB PDF renders the public terms source with inquiry and statutory rights intact',()=>{
 const terms=load('lib/legal/terms.ts');
 const {buildCaroBaraAgbHtml}=load('lib/documents/caro-bara-agb.ts',{'@/lib/legal/terms':terms});
 const html=buildCaroBaraAgbHtml();
 for(const [heading,body] of terms.termsSections){assert.ok(html.includes(heading));assert.ok(html.includes(body));}
 assert.match(html,/keine Zahlungspflicht/);
 assert.match(html,/gesetzlichen Mängelrechte/);
 assert.doesNotMatch(html,/Anfrage des Kunden gilt als verbindliches Angebot/);
});
