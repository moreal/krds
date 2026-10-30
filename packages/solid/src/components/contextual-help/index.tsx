import { Show, createUniqueId, onMount, onCleanup, createEffect, createSignal, type JSX } from 'solid-js';
import type { ContextualHelpContract } from '@unofficial-krds/contracts';
import { owned, stateValue, ignoredKey, restore, focusSelector, usable } from '../../internal/catalog';
import { anchoredPosition } from '../../internal/position';
export interface ContextualHelpProps extends ContextualHelpContract {children?:JSX.Element;}
export function ContextualHelp(props:ContextualHelpProps){
 const uid=createUniqueId();const open=stateValue(()=>props.open,props.defaultOpen,false,open=>props.onOpenChange?.({open}));
 let root!:HTMLDivElement,trigger!:HTMLButtonElement;const [surface,setSurface]=createSignal<HTMLElement>();let returnPending=false;let pointerClose=false;let generation=0;let returnTimer:ReturnType<typeof setTimeout>|undefined;
 anchoredPosition(open.read,()=>trigger,surface,()=>props.placement);
 const close=()=>{returnPending=true;open.request(false);queueMicrotask(()=>{if(open.read())returnPending=false;});};
 createEffect(()=>{const panel=surface();if(open.read()&&panel)queueMicrotask(()=>{if(open.read())([...panel.querySelectorAll<HTMLElement>(focusSelector)].find(usable)??panel).focus();});});
 createEffect(()=>{const actual=open.read(),token=++generation;clearTimeout(returnTimer);if(!actual&&returnPending){returnPending=false;const restoreClosed=()=>{if(token===generation&&!open.read())restore(trigger,props.fallbackFocusId);};if(pointerClose){pointerClose=false;returnTimer=setTimeout(restoreClosed,0);}else queueMicrotask(restoreClosed);}});
 onMount(()=>{const outside=(event:PointerEvent)=>{if(open.read()&&!root.contains(event.target as Node)){pointerClose=true;close();}};document.addEventListener('pointerdown',outside);onCleanup(()=>document.removeEventListener('pointerdown',outside));});
 onCleanup(()=>{generation++;clearTimeout(returnTimer);if(open.read())queueMicrotask(()=>restore(trigger,props.fallbackFocusId));});
 return <div ref={root} {...owned('contextual-help','root',open.read()?'open':'closed')} data-krds-variant={props.variant??'help'} onKeyDown={event=>{if(!ignoredKey(event)&&event.key==='Escape'&&open.read()){event.preventDefault();close();}}}>
  <button ref={trigger} type="button" {...owned('contextual-help','trigger')} aria-expanded={open.read()} aria-controls={uid} aria-describedby={props.relatedId} onClick={()=>open.read()?close():open.request(true)}>{props.triggerLabel}</button>
  <Show when={open.read()}><div ref={setSurface} id={uid} {...owned('contextual-help','popover','open')} data-krds-placement={props.placement??'bottom-start'} role="region" aria-labelledby={`${uid}-title`} tabIndex={-1} style={{'max-width':'min(24rem, calc(100vw - 2rem))'}}>
   <h3 id={`${uid}-title`} {...owned('contextual-help','title')}>{props.title}</h3><div {...owned('contextual-help','body')}>{props.content}{props.children}</div><button type="button" {...owned('contextual-help','close')} onClick={close}>닫기</button>
  </div></Show>
 </div>;
}
