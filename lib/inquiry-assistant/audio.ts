// Canonical mono 16-bit PCM at 16 kHz: duration is verified from bytes,
// never from an untrusted browser-provided duration or compressed metadata.
export const MAX_AUDIO_BYTES=44+16000*2*60;
export function validateAudio(bytes:Uint8Array){
 if(bytes.length<44+3200||bytes.length>MAX_AUDIO_BYTES)throw Error('audio_size');
 const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 const tag=(p:number)=>String.fromCharCode(...bytes.slice(p,p+4));
 if(tag(0)!=='RIFF'||tag(8)!=='WAVE'||tag(12)!=='fmt '||tag(36)!=='data'||v.getUint32(4,true)!==bytes.length-8||v.getUint32(16,true)!==16||v.getUint16(20,true)!==1||v.getUint16(22,true)!==1||v.getUint32(24,true)!==16000||v.getUint32(28,true)!==32000||v.getUint16(32,true)!==2||v.getUint16(34,true)!==16||v.getUint32(40,true)!==bytes.length-44||(bytes.length-44)%2)throw Error('audio_format');
 let peak=0;for(let p=44;p<bytes.length;p+=2)peak=Math.max(peak,Math.abs(v.getInt16(p,true)));
 if(peak<100)throw Error('audio_silent');
 return (bytes.length-44)/32000;
}
export function pcmWave(samples:Float32Array){
 const bytes=new Uint8Array(44+samples.length*2);const v=new DataView(bytes.buffer);
 const tag=(p:number,s:string)=>{for(let i=0;i<s.length;i++)bytes[p+i]=s.charCodeAt(i);};
 tag(0,'RIFF');v.setUint32(4,bytes.length-8,true);tag(8,'WAVE');tag(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,16000,true);v.setUint32(28,32000,true);v.setUint16(32,2,true);v.setUint16(34,16,true);tag(36,'data');v.setUint32(40,samples.length*2,true);
 for(let i=0;i<samples.length;i++){const s=Math.max(-1,Math.min(1,samples[i]));v.setInt16(44+i*2,s<0?s*32768:s*32767,true);}return bytes;
}
