// Silence ends a turn only after sustained sound; idle microphones never call AI.
export type VoiceActivity={started:number;lastSound:number;voicedMs:number};
export function voiceActivity(){return {started:0,lastSound:0,voicedMs:0};}
export function advanceVoice(activity:VoiceActivity,rms:number,elapsed:number){
 const next={...activity};
 if(rms>=0.015){if(!next.started)next.started=elapsed;next.lastSound=elapsed;next.voicedMs+=80;}
 const enough=next.voicedMs>=480;
 return {activity:next,done:enough&&elapsed-next.lastSound>=2200,idle:!enough&&elapsed>=20000,limit:elapsed>=55000};
}
