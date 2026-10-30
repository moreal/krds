import {onMount,tick,untrack} from 'svelte';
export function notificationLife(signature:()=>string|null,duration:()=>number|null,inhibited:()=>boolean,request:(generation:number)=>void){
 let generation=0,hidden=$state(false),alive=false;let timer:ReturnType<typeof setTimeout>|undefined,remaining=0,started=0,consumed=false,revision=0;
 function cancel(){if(timer!==undefined){clearTimeout(timer);timer=undefined;remaining=Math.max(0,remaining-(performance.now()-started));}}
 function schedule(){cancel();if(!alive||signature()===null||consumed||duration()===null||hidden||inhibited())return;const token=revision;started=performance.now();timer=setTimeout(()=>{timer=undefined;if(!alive||token!==revision||consumed)return;consumed=true;request(generation);},remaining);}
 const currentSignature=$derived.by(signature);
 $effect(()=>{const sig=currentSignature,effectiveDuration=untrack(duration);untrack(()=>{cancel();revision++;const token=revision;if(sig===null)return;generation++;consumed=false;remaining=effectiveDuration??0;if(effectiveDuration!==null&&(!Number.isFinite(remaining)||remaining<=0))throw new RangeError('Notification duration must be positive');void tick().then(()=>{if(token===revision)schedule();});});});
 $effect(()=>{hidden;inhibited();untrack(schedule);});
 onMount(()=>{alive=true;const visibility=()=>hidden=document.hidden;visibility();document.addEventListener('visibilitychange',visibility);void tick().then(schedule);return()=>{alive=false;revision++;cancel();document.removeEventListener('visibilitychange',visibility);};});
 return{get generation(){return generation;}};
}
