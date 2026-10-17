import { parseDraft, type InquiryDraft } from './draft';

export type ConversationMessage = { role: 'user' | 'assistant'; content: string };
export type TurnInput = { draft: InquiryDraft; message: string; language: 'ar' | 'de' | 'en'; history: ConversationMessage[] };
export function parseHistory(raw: unknown): ConversationMessage[] {
  if (!Array.isArray(raw) || raw.length > 12) throw new Error('Invalid history');
  let size = 0;
  return raw.map(entry => {
    if (!entry || typeof entry !== 'object' || !['user','assistant'].includes(entry.role) || typeof entry.content !== 'string' || entry.content.length > 2000 || !entry.content.trim()) throw new Error('Invalid history');
    size += entry.content.length;
    if (size > 10000) throw new Error('History too large');
    return {role:entry.role,content:entry.content};
  });
}
export function parseTurn(raw: unknown): TurnInput {
  if (!raw || typeof raw !== 'object') throw new Error('Invalid turn');
  const input = raw as Record<string, unknown>;
  if (typeof input.message !== 'string' || !input.message.trim() || input.message.length > 2000 || !['ar','de','en'].includes(input.language as string)) throw new Error('Invalid turn');
  return {draft:parseDraft(input.draft),message:input.message.trim(),language:input.language as TurnInput['language'],history:parseHistory(input.history ?? [])};
}
