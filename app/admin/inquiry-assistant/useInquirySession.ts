'use client';
import { useEffect, useRef, useState } from 'react';
import { applyActions, emptyDraft, markReviewed, type DraftAction, type InquiryDraft } from '@/lib/inquiry-assistant/draft';
import { SESSION_KEY, encodeSession, decodeSession, recentHistory, acceptProposal, undoProposal, type SavedSession } from '@/lib/inquiry-assistant/session';

type State = SavedSession & {ready:boolean;storageFailed:boolean;restoreFailed:boolean};
const initial = ():State => ({draft:emptyDraft(),history:[],language:'de',message:'',ready:false,storageFailed:false,restoreFailed:false});
export function useInquirySession() {
  const [state,setState]=useState(initial);
  const current=useRef(state);
  const undo=useRef<{before:InquiryDraft;revision:number;history:State['history']}|null>(null);
  const [canUndo,setCanUndo]=useState(false);
  function commit(next:State) {
    try { sessionStorage.setItem(SESSION_KEY,encodeSession(next));next={...next,storageFailed:false}; }
    catch { next={...next,storageFailed:true}; }
    current.current=next;setState(next);
  }
  useEffect(()=>{
    let next={...current.current,ready:true};
    try {const saved=sessionStorage.getItem(SESSION_KEY);if(saved)next={...next,...decodeSession(saved)};}
    catch {next={...next,restoreFailed:true};}
    current.current=next;
    // Hydration from tab-local storage must happen after the server render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(next);
  },[]);
  function edit(action:DraftAction) {
    const latest=current.current;
    const draft=applyActions(latest.draft,latest.draft.revision,[action]);
    undo.current=null;setCanUndo(false);commit({...latest,draft});
  }
  function accept(expectedRevision:number,reply:unknown,utterance:string) {
    const latest=current.current;
    const result=acceptProposal(latest.draft,expectedRevision,reply);
    if(result.draft!==latest.draft){undo.current={before:latest.draft,revision:result.draft.revision,history:latest.history};setCanUndo(true);}
    commit({...latest,draft:result.draft,message:latest.message.trim()===utterance?'':latest.message,
      history:recentHistory([...latest.history,{role:'user',content:utterance},{role:'assistant',content:result.message}])});
  }
  function revert() {
    const previous=undo.current;if(!previous)return;
    const latest=current.current;
    const draft=undoProposal(latest.draft,previous.before,previous.revision);
    undo.current=null;setCanUndo(false);
    // Drop the reverted model exchange so it cannot silently replay that change.
    commit({...latest,draft,history:previous.history});
  }
  return {state,current,canUndo,edit,accept,revert,
    setMessage:(message:string)=>commit({...current.current,message}),
    setLanguage:(language:State['language'])=>commit({...current.current,language}),
    review:()=>commit({...current.current,draft:markReviewed(current.current.draft)}),
  };
}
