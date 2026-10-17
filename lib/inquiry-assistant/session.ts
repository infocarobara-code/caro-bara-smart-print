import { serviceIndex, serviceSchema } from './catalog';
import { applyActions, parseDraft, type InquiryDraft } from './draft';
import { parseHistory, type ConversationMessage } from './turn';

export const SESSION_KEY = 'carobara.inquiry-assistant.v1';
const lifetime = 2 * 60 * 60 * 1000;
// Compatibility marker, not a security hash. Server always revalidates every field.
const catalogue = JSON.stringify(serviceIndex().map(service => serviceSchema(service.id)));
export const CATALOG_VERSION = [...catalogue].reduce((hash,char) => Math.imul(hash ^ char.charCodeAt(0),16777619) >>> 0,2166136261).toString(16);
export type SavedSession = {draft:InquiryDraft;history:ConversationMessage[];language:'ar'|'de'|'en';message:string};
export function encodeSession(session:SavedSession, now=Date.now()):string {
  const value = JSON.stringify({version:1,catalog:CATALOG_VERSION,expiresAt:now+lifetime,history:session.history,language:session.language,message:session.message,draft:{...session.draft,reviewedRevision:null}});
  if(value.length>128000)throw new Error('Draft too large');
  return value;
}
export function decodeSession(value:string, now=Date.now()):SavedSession {
  if(value.length>128000)throw new Error('Draft too large');
  const raw=JSON.parse(value);
  if(raw?.version!==1||raw.catalog!==CATALOG_VERSION||!Number.isFinite(raw.expiresAt)||raw.expiresAt<=now||raw.expiresAt>now+lifetime||!['ar','de','en'].includes(raw.language)||typeof raw.message!=='string'||raw.message.length>2000)throw new Error('Expired or incompatible draft');
  return {draft:parseDraft(raw.draft),history:parseHistory(raw.history),language:raw.language,message:raw.message};
}
export function recentHistory(history:ConversationMessage[]):ConversationMessage[] {
  const next=history.slice(-12);
  while(next.reduce((size,entry)=>size+entry.content.length,0)>10000)next.shift();
  return parseHistory(next);
}
/** Never trust a provider-returned draft. Apply validated actions to the latest local revision. */
export function acceptProposal(current:InquiryDraft, expectedRevision:number, raw:unknown) {
  if(!raw||typeof raw!=='object')throw new Error('Invalid response');
  const reply=raw as Record<string,unknown>;
  if(reply.baseRevision!==expectedRevision||current.revision!==expectedRevision)throw new Error('Stale draft');
  if(typeof reply.message!=='string'||!reply.message.trim()||reply.message.length>600||!Array.isArray(reply.actions))throw new Error('Invalid response');
  // Model may not remove items, consent or submit, even if a tampered endpoint suggests it.
  if(reply.actions.some(action=>!action||!['add','set','contact'].includes(action.type)))throw new Error('Invalid action');
  return {message:reply.message,draft:reply.actions.length?applyActions(current,expectedRevision,reply.actions):current};
}
export function undoProposal(current:InquiryDraft,before:InquiryDraft,appliedRevision:number):InquiryDraft {
  if(current.revision!==appliedRevision)throw new Error('Stale undo');
  return {...parseDraft(before),revision:current.revision+1,reviewedRevision:null};
}
