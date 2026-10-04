import {useEffect,useRef} from 'react';
import type {State} from './model';
export function useCabinAudio(s:State,onError:(m:string)=>void){
 const audio=useRef<AudioContext|null>(null),live=useRef(s);live.current=s;
 useEffect(()=>{if(!s.playing&&s.muted)return;try{audio.current??=new AudioContext();void audio.current.resume().catch(()=>onError('Audio is unavailable. Visual controls remain active.'));}catch{onError('Audio is unavailable in this browser.');return;}
 let beat=0,lastBeep=0;const timer=setInterval(()=>{const a=audio.current,v=live.current;if(!a||a.state!=='running'||document.hidden)return;const t=a.currentTime;
 const tone=(frequency:number,duration:number,volume:number,type:OscillatorType='sine')=>{const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=frequency;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume,t+.025);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g).connect(a.destination);o.start(t);o.stop(t+duration+.01);o.onended=()=>{o.disconnect();g.disconnect();};};
 if(v.playing&&beat%2===0){const notes=[[110,164.81,220,261.63,164.81,220,329.63,261.63],[130.81,196,261.63,293.66,196,261.63,392,293.66],[98,146.83,196,246.94,146.83,196,293.66,246.94]][v.track];tone(notes[Math.floor(beat/2)%8],.8,v.volume/100*.10,'sine');if(beat%8===0)tone(notes[0]/2,1.4,v.volume/100*.08);}
 if(!v.muted&&t-lastBeep>(v.distance<=30?.18:v.distance<=50?.35:v.distance<=80?.6:1.0)){tone(v.distance<=30?1050:780,.10,.05);lastBeep=t;}beat++;
 },180);return()=>clearInterval(timer);
 },[s.playing,s.muted]);
 useEffect(()=>()=>{void audio.current?.close();},[]);
}
