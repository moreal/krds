<script lang="ts">
import {untrack,tick,onMount,mount,unmount} from 'svelte';
import type {CoachMarkContract} from '@unofficial-krds/contracts';
import {owned,control,ignoredKey} from './catalog-state.svelte.js';
import {claimCoach} from './coach-state.js';
import {currentModal} from './modal-state.js';
import CoachPopover from './CoachPopover.svelte';
let p:CoachMarkContract&{panelId?:string}=$props();
const owner=Symbol('coach');let composing=$state(false);
const signature=$derived(JSON.stringify([p.steps.map(step=>[step.id,step.targetId,Boolean(step.requiresAction)]),p.boundaries]));
const open=control(()=>p.open,untrack(()=>p.defaultOpen),false,open=>p.onOpenChange?.({open}));
let reason:'previous'|'next'|'target-action'='next';
const step=control(()=>p.stepId,untrack(()=>p.defaultStepId),untrack(()=>p.steps[0]?.id??''),id=>p.onStepChange?.({id,reason}));
let positioned=$state(false),missing=$state(false),pendingAction=$state(false),rect=$state({left:0,top:0,width:0,height:0});
const committedOpen=$derived(open.value),committedStep=$derived(step.value);
const currentIndex=$derived(p.steps.findIndex(item=>item.id===committedStep));
const current=$derived(p.steps.find(item=>item.id===committedStep));
function stop(why:'stop'|'finish'|'target-removed'|'route-change'='stop'){
 if(p.onStop)p.onStop({reason:why,running:false,returnTo:{panel:'tutorial',open:true,startActionId:p.startActionId}});
 else open.request(false);
}
function advance(delta:number,why:typeof reason){
 const index=p.steps.findIndex(item=>item.id===step.value);
 if(index+delta>=p.steps.length){stop('finish');return;}
 if(index+delta<0)return;
 reason=why;step.request(p.steps[index+delta].id);
}
$effect(()=>{
 const actual=committedOpen,stepId=committedStep;signature;
 if(!actual)return;
 const selected=untrack(()=>p.steps.find(item=>item.id===stepId));
 if(!selected)return;
 // Validate before taking a document owner. Every later acquisition also has exception-safe cleanup.
 untrack(()=>{for(const item of p.steps)if(item.requiresAction&&!p.onTargetAction)throw new TypeError('Action-gated coach requires host verifier');});
 const release=claimCoach(document,owner);
 const resources:(()=>void)[]=[release,()=>{pendingAction=false;}];let active=true,pending=false;pendingAction=false;
 let timer:ReturnType<typeof setTimeout>|undefined;
 function cleanup(){
  active=false;const failures:unknown[]=[];
  for(const dispose of resources.splice(0).reverse())try{dispose();}catch(error){failures.push(error);}
  composing=false;
  if(failures.length)throw new AggregateError(failures,'CoachMark cleanup failed');
 }
 try{
  const targetId=selected.targetId;
  const boundaryId=untrack(()=>p.boundaries.find(item=>item.targetId===targetId)?.insertionBoundaryId);
  const target=document.getElementById(targetId),boundary=boundaryId?document.getElementById(boundaryId):null;
  missing=!target||!boundary;positioned=Boolean(boundary);
  if(!boundary)return cleanup;
  resources.push(()=>{if(timer!==undefined)clearTimeout(timer);});
  const update=()=>{if(target){const box=target.getBoundingClientRect();rect={left:box.left,top:box.top,width:box.width,height:box.height};}};
  if(target){target.scrollIntoView({block:'nearest'});update();}
  const app=untrack(()=>mount(CoachPopover,{target:boundary,props:{
   get suppressEntry(){return composing;},
   get panel(){return(p.panelId?document.getElementById(p.panelId):null)??document.getElementById(p.startActionId)?.closest<HTMLElement>('[data-krds-component="tutorial-panel"][data-krds-part="root"]')??null;},
   get anchor(){return{...rect,targetId:current?.targetId};},get current(){return current??selected;},
   get index(){return currentIndex;},get total(){return p.steps.length;},
   get waiting(){return Boolean(current?.requiresAction);},get pending(){return pendingAction;},get missing(){return missing;},
   previous:()=>advance(-1,'previous'),next:()=>{if(!current?.requiresAction&&!missing)advance(1,'next');},stop:()=>stop()
  }}));
  resources.push(()=>{void unmount(app);});
  const action=(event:Event)=>{
   if(!current?.requiresAction||pending||(event as InputEvent).isComposing)return;
   pending=true;pendingAction=true;timer=setTimeout(async()=>{
    timer=undefined;await tick();
    try{
     if(!active||!open.value||step.value!==stepId||missing)return;
     const valid=await p.onTargetAction?.({stepId,targetId});
     if(active&&open.value&&step.value===stepId&&valid&&!missing&&target?.isConnected&&document.getElementById(targetId)===target)advance(1,'target-action');
    }catch{/* A declined or rejected host verifier never advances. */}finally{pending=false;if(active)pendingAction=false;}
   },0);
  };
  const observer=new MutationObserver(()=>{if(active&&(!boundary.isConnected||target&&!target.isConnected)){missing=true;if(!boundary.isConnected)positioned=false;}});
  resources.push(()=>observer.disconnect());observer.observe(document.body,{childList:true,subtree:true});
  const resize=new ResizeObserver(update);resources.push(()=>resize.disconnect());if(target)resize.observe(target);
  const composeStart=()=>composing=true,composeEnd=()=>composing=false;
  for(const[name,listener]of[['compositionstart',composeStart],['compositionend',composeEnd],['click',action],['change',action]]as const){target?.addEventListener(name,listener);resources.push(()=>target?.removeEventListener(name,listener));}
  window.addEventListener('scroll',update,true);resources.push(()=>window.removeEventListener('scroll',update,true));
  window.addEventListener('resize',update);resources.push(()=>window.removeEventListener('resize',update));
  return cleanup;
 }catch(error){cleanup();throw error;}
});
onMount(()=>{
 const key=(event:KeyboardEvent)=>{const modal=currentModal(document);if(!ignoredKey(event)&&event.key==='Escape'&&open.value&&(!modal||!!modal.contains(document.getElementById(current?.targetId??'')))){event.preventDefault();stop();}};
 document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key);
});
</script>
{#if open.value&&missing&&!positioned}<CoachPopover floating={false} suppressEntry current={current??{title:'안내',instruction:''}} index={currentIndex} total={p.steps.length} waiting={Boolean(current?.requiresAction)} missing previous={()=>advance(-1,'previous')} next={()=>{}} stop={()=>stop()}/>{/if}
