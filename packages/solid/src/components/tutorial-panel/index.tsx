import { For, createEffect, createSignal, createUniqueId, onCleanup, onMount, sharedConfig, Show, type JSX } from 'solid-js';
import { Portal, Dynamic } from 'solid-js/web';
import type { TutorialPanelContract, TutorialStopDetails } from '@unofficial-krds/contracts';
import { owned, keyedItems, stateValue, restore, ignoredKey } from '../../internal/catalog';
import { narrowViewport, panelLifecycle } from '../../internal/panel';
import { TutorialCoordinator } from '../../internal/tutorial-context';
export interface TutorialPanelProps extends TutorialPanelContract {startActionVisible?:boolean;children?:JSX.Element;helpContent?:JSX.Element;}
export function TutorialPanel(props:TutorialPanelProps){
 const tasks=keyedItems(()=>props.tasks),uid=createUniqueId(),narrow=narrowViewport();
 const open=stateValue(()=>props.open,props.defaultOpen,!narrow(),open=>props.onOpenChange?.({open}));
 const running=stateValue(()=>props.running,props.defaultRunning,false);
 const [pendingStart,setPendingStart]=createSignal<{taskId:string;stepId:string}|null>(null);
 const presentRunning=()=>running.read()&&(!pendingStart()||(props.activeTaskId===pendingStart()!.taskId&&props.activeStepId===pendingStart()!.stepId));
 createEffect(()=>{if(pendingStart()&&running.read()&&props.activeTaskId===pendingStart()!.taskId&&props.activeStepId===pendingStart()!.stepId)setPendingStart(null);});
 const activePanel=stateValue(()=>props.activePanel,props.defaultActivePanel,'tutorial',value=>props.onActivePanelChange?.({value}));
 let opener!:HTMLButtonElement;const [panel,setPanel]=createSignal<HTMLElement>();let stopPending=false,restoringStop=false,wasOpen=open.read();
 if(typeof window!=='undefined'&&sharedConfig.context&&props.open===undefined&&props.defaultOpen===undefined)onMount(()=>{const initial=!matchMedia('(max-width: 767px)').matches;wasOpen=initial;open.initializeDefault(initial);});
 panelLifecycle(open.read,narrow,panel,()=>open.request(false),()=>restoringStop||(stopPending&&!running.read()));
 createEffect(()=>{const actualRunning=running.read(),actualOpen=open.read();if(stopPending&&!actualRunning){restoringStop=true;stopPending=false;queueMicrotask(()=>{if(!restoringStop)return;restoringStop=false;restore(document.getElementById(props.startActionId)??opener,props.fallbackFocusId);});}else if(wasOpen&&!actualOpen&&!stopPending)queueMicrotask(()=>restore(opener,props.fallbackFocusId));wasOpen=actualOpen;});
 const stop=(reason:TutorialStopDetails['reason'])=>{if(!running.read())return;stopPending=true;if(!running.controlled){running.request(false);activePanel.request('tutorial');open.request(true);}props.onStop?.({reason,running:false,returnTo:{panel:'tutorial',open:true,startActionId:props.startActionId}});};
 const start=()=>{if(running.read())return;const task=props.tasks.find(task=>task.id===props.activeTaskId&&task.steps.length)??props.tasks.find(task=>task.steps.length);if(!task)return;const step=task.steps.find(step=>step.id===props.activeStepId)??task.steps[0];if(!step)return;const detail={taskId:task.id,stepId:step.id};setPendingStart(detail);if(!running.controlled)running.request(true);props.onStart?.(detail);};
 onCleanup(()=>{if(open.read())queueMicrotask(()=>restore(opener,props.fallbackFocusId));});

 function PanelSurface(){const content=<>
   <div {...owned('tutorial-panel','header')}><h2 id={`${uid}-title`} {...owned('tutorial-panel','title')}>따라하기</h2><button type="button" {...owned('tutorial-panel','close')} onClick={()=>open.request(false)}>튜토리얼 닫기</button></div>
   <div {...owned('tutorial-panel','tabs')} role="tablist" aria-label="지원 패널" onKeyDown={event=>{if(ignoredKey(event)||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;const buttons=[...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')];const index=buttons.indexOf(document.activeElement as HTMLButtonElement);event.preventDefault();buttons[event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length]?.focus();}}>
    <button id={`${uid}-help-tab`} type="button" role="tab" aria-controls={`${uid}-help`} aria-selected={activePanel.read()==='help'} onClick={()=>activePanel.request('help')}>도움말</button><button id={`${uid}-tutorial-tab`} type="button" role="tab" aria-controls={`${uid}-tutorial`} aria-selected={activePanel.read()==='tutorial'} onClick={()=>activePanel.request('tutorial')}>튜토리얼</button>
   </div>
   <section id={`${uid}-help`} role="tabpanel" aria-labelledby={`${uid}-help-tab`} hidden={activePanel.read()!=='help'}>{props.helpContent??<p>도움말을 확인하세요.</p>}</section>
   <section id={`${uid}-tutorial`} role="tabpanel" aria-labelledby={`${uid}-tutorial-tab`} hidden={activePanel.read()!=='tutorial'}>
    <Show when={props.startActionVisible!==false}><button id={props.startActionId} type="button" onClick={start}>따라하기 시작</button></Show>
    <button type="button" {...owned('tutorial-panel','back')} onClick={()=>{if(props.activeTaskId!==null)props.onTaskChange?.({id:null});}}>전체 과제</button>
    <ul {...owned('tutorial-panel','task-list')}><For each={tasks()}>{task=><li {...owned('tutorial-panel','task')}><details open={props.activeTaskId===task.id}><summary>{task.title}</summary><ol {...owned('tutorial-panel','step-list')}><For each={task.steps}>{step=><li data-krds-state={props.activeStepId===step.id?'active-step':''}><button type="button" onClick={()=>{if(props.activeTaskId!==task.id)props.onTaskChange?.({id:task.id});if(props.activeStepId!==step.id)props.onStepChange?.({id:step.id});}}>{step.title}</button><p>{step.instruction}</p></li>}</For></ol></details></li>}</For></ul>
   </section>
   <Show when={presentRunning()}><button type="button" {...owned('tutorial-panel','stop')} onClick={()=>stop('stop')}>따라하기 중지</button></Show>
  </>;return <Dynamic component={narrow()?'div':'aside'} ref={setPanel} id={uid} {...owned('tutorial-panel','root',presentRunning()?'open running':'open idle')} data-krds-layout={narrow()?'narrow-modal':'desktop'} role={narrow()?'dialog':'complementary'} aria-modal={narrow()?'true':undefined} aria-labelledby={`${uid}-title`} tabIndex={-1}>{content}</Dynamic>;}
 return <TutorialCoordinator.Provider value={{requestStop:stop}}>
  <button ref={opener} type="button" {...owned('tutorial-panel','opener')} aria-expanded={open.read()} onClick={()=>open.request(!open.read())}>튜토리얼 열기</button>
  <Show when={open.read()}><Portal><PanelSurface/></Portal></Show>
  {props.children}
 </TutorialCoordinator.Provider>;
}
