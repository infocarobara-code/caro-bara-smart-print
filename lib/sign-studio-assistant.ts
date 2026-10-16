import { changeFamily, validDesign, validConstruction, type SignDesign, type SignFamily } from './sign-studio';
export const assistantFields = ['family','depthCm','font','background','foreground','textScale','logoScale','logoX','logoY','lighting'] as const;
export type AssistantField = typeof assistantFields[number];
export type AssistantProposal = { kind: 'proposal'|'review'|'clarify'; changes: {field:AssistantField;value:string}[] };
export function validateAssistantProposal(base: SignDesign, raw: unknown): { proposal:AssistantProposal; design:SignDesign } {
  if (!validDesign(base) || !validConstruction(base) || !raw || typeof raw !== 'object') throw new Error('Invalid proposal');
  const p = raw as AssistantProposal;
  if (Object.keys(p).some(k=>!['kind','changes'].includes(k)) || !['proposal','review','clarify'].includes(p.kind) || !Array.isArray(p.changes) || p.changes.length>10 || (p.kind!=='proposal' && p.changes.length)) throw new Error('Invalid proposal');
  const seen=new Set<string>();
  for (const c of p.changes) {
    if (!c || Object.keys(c).some(k=>!['field','value'].includes(k)) || !assistantFields.includes(c.field) || seen.has(c.field) || typeof c.value!=='string' || c.value.length>40) throw new Error('Invalid change');
    seen.add(c.field);
  }
  const family=p.changes.find(c=>c.field==='family');
  if(family && !['panel','lightbox','blade'].includes(family.value)) throw new Error('Invalid family');
  const next={...(family?changeFamily(base,family.value as SignFamily):base)};
  for(const c of p.changes) {
    if(c.field==='family') continue;
    const numeric=['depthCm','textScale','logoScale','logoX','logoY'].includes(c.field);
    if(numeric && !/^\d+(?:\.\d+)?$/.test(c.value)) throw new Error('Invalid number');
    Object.assign(next,{[c.field]:numeric?Number(c.value):c.value});
  }
  if(!validDesign(next)||!validConstruction(next)) throw new Error('Unsupported configuration');
  return {proposal:p,design:next};
}
