import { TutorialCoordinator } from '../../internal/tutorial-context';
import { Show, createMemo, createEffect, createSignal, createUniqueId, onMount, onCleanup, untrack, useContext } from 'solid-js';
import { Portal } from 'solid-js/web';
import type { CoachMarkContract } from '@unofficial-krds/contracts';
import { owned, stateValue, ignoredKey, restore } from '../../internal/catalog';
export type CoachMarkProps=CoachMarkContract;
export function CoachMark(props:CoachMarkProps){
 const coordinator=useContext(TutorialCoordinator);const linked=()=>Boolean(coordinator||props.onStop);const uid=createUniqueId();
 const open=stateValue(()=>props.open,props.defaultOpen,false,open=>props.onOpenChange?.({open}));
 const step=stateValue(()=>props.stepId,props.defaultStepId,props.steps[0]?.id??'');
 const [mounted,setMounted]=createSignal(false);
 const [revision,setRevision]=createSignal(0),[pendingAction,setPendingAction]=createSignal(false),[rectangle,setRectangle]=createSignal<DOMRect>();
 const current=()=>props.steps.find(item=>item.id===step.read());
 const target=createMemo(()=>{revision();return mounted()&&typeof document!=='undefined'&&current()?document.getElementById(current()!.targetId):null;});
 const boundary=createMemo(()=>{revision();if(!mounted()||typeof document==='undefined')return null;const record=props.boundaries.find(record=>record.targetId===current()?.targetId);if(!record)return null;const insertion=document.getElementById(record.insertionBoundaryId),actualTarget=target();if(!insertion||!actualTarget||insertion.getRootNode()!==actualTarget.getRootNode())return null;let cursor:Element|null=actualTarget;while(cursor&&cursor!==document.body){if(cursor.nextElementSibling)return cursor.nextElementSibling===insertion?insertion:null;cursor=cursor.parentElement;}return null;});
 const ready=()=>Boolean(target()&&boundary());
 let pendingStop=false,previous=open.read(),generation=0;let heading:HTMLHeadingElement|undefined;
 createEffect(()=>{if(props.steps.some(item=>item.requiresAction)&&!props.onTargetAction)throw new TypeError('Action-gated CoachMark requires a verified host target-action driver');});
 const stop=(reason:'stop'|'finish'|'target-removed'|'route-change')=>{pendingStop=true;if(coordinator){coordinator.requestStop(reason);return;}if(props.onStop)props.onStop({reason,running:false,returnTo:{panel:'tutorial',open:true,startActionId:props.startActionId}});else open.request(false);};
 const move=(reason:'previous'|'next'|'target-action')=>{const index=props.steps.findIndex(item=>item.id===step.read());const next=props.steps[index+(reason==='previous'?-1:1)];if(next){step.request(next.id);props.onStepChange?.({id:next.id,reason});}else if(reason!=='previous')stop('finish');};
 onMount(()=>{setMounted(true);setRevision(value=>value+1);const observer=new MutationObserver(()=>setRevision(value=>value+1));observer.observe(document.body,{childList:true,subtree:true});onCleanup(()=>observer.disconnect());});
 createEffect(()=>{
  const isOpen=open.read(),actualTarget=target(),actualBoundary=boundary(),stepId=step.read();const token=++generation;setPendingAction(false);
  if(!isOpen||!actualTarget||!actualBoundary)return;
  const item=untrack(current)!;actualTarget.scrollIntoView({block:'nearest'});queueMicrotask(()=>{if(token===generation)heading?.focus();});
  const measure=()=>setRectangle(actualTarget.getBoundingClientRect());measure();const observer=new ResizeObserver(measure);observer.observe(actualTarget);document.addEventListener('scroll',measure,true);window.addEventListener('resize',measure);
  let task:ReturnType<typeof setTimeout>|undefined;
  const action=()=>{
   if(!item.requiresAction||pendingAction())return;setPendingAction(true);
   // Wait until native/delegated target handlers have committed their host result.
   task=setTimeout(async()=>{try{const verified=await props.onTargetAction!({stepId,targetId:actualTarget.id});if(verified&&token===generation&&open.read()&&step.read()===stepId&&target()===actualTarget&&actualTarget.isConnected)move('target-action');}catch{/* A failed host verifier is not a completed task. */}finally{if(token===generation)setPendingAction(false);}},0);
  };
  actualTarget.addEventListener('click',action);
  onCleanup(()=>{generation++;clearTimeout(task);observer.disconnect();document.removeEventListener('scroll',measure,true);window.removeEventListener('resize',measure);actualTarget.removeEventListener('click',action);});
 });
 createEffect(()=>{const actual=open.read();if(previous&&!actual&&pendingStop){pendingStop=false;if(!linked())queueMicrotask(()=>restore(document.getElementById(props.startActionId)??undefined,props.fallbackFocusId));}previous=actual;});
 onCleanup(()=>{generation++;if(open.read()&&!linked())queueMicrotask(()=>restore(document.getElementById(props.startActionId)??undefined,props.fallbackFocusId));});
 function Popover(){return <div {...owned('coach-mark','root',!ready()?'open missing-target':pendingAction()?'open waiting':'open current-step')} onKeyDown={event=>{if(!ignoredKey(event)&&event.key==='Escape'){event.preventDefault();stop('stop');}}}>
  <Show when={target()&&rectangle()}><div {...owned('coach-mark','spotlight')} aria-hidden="true" style={{left:`${rectangle()!.left}px`,top:`${rectangle()!.top}px`,width:`${rectangle()!.width}px`,height:`${rectangle()!.height}px`}}/></Show>
  <div {...owned('coach-mark','popover',!ready()?'missing-target':pendingAction()?'waiting':'')} role="region" aria-labelledby={`${uid}-title`}>
   <h3 ref={heading} id={`${uid}-title`} tabIndex={-1} {...owned('coach-mark','title')}>{current()?.title}</h3>
   <p {...owned('coach-mark','instruction')}>{ready()?current()?.instruction:'대상을 찾을 수 없습니다. 따라하기를 중지하거나 화면을 확인하세요.'}</p>
   <p {...owned('coach-mark','position')}>{props.steps.findIndex(item=>item.id===step.read())+1} / {props.steps.length}</p>
   <div {...owned('coach-mark','actions')}><button type="button" {...owned('coach-mark','stop')} onClick={()=>stop('stop')}>그만보기</button><button type="button" {...owned('coach-mark','previous')} hidden={props.steps[0]?.id===step.read()} disabled={!ready()} onClick={()=>move('previous')}>이전</button><button type="button" {...owned('coach-mark','next')} disabled={current()?.requiresAction||!ready()} onClick={()=>move('next')}>{props.steps.length===1?'확인':props.steps.at(-1)?.id===step.read()?'마치기':'다음'}</button></div>
  </div>
 </div>;}
 return <Show when={mounted()&&open.read()}><Show when={boundary()} fallback={<Popover/>}>{mount=><Portal mount={mount()}><Popover/></Portal>}</Show></Show>;
}
