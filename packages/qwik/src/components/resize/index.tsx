import {$,component$,useComputed$,useId,useSignal,useVisibleTask$}from '@builder.io/qwik';
import type{ResizeContract}from '@unofficial-krds/contracts';
import{owned,useField,ignoredKey,type NativeContract}from '../../internal/catalog';
export type ResizeProps=NativeContract<ResizeContract>;
export const Resize=component$<ResizeProps>(props=>{
 const id=useId(),value=useField<string>(props,'value','defaultValue','100'),open=useField<boolean>(props,'open','defaultOpen',false),trigger=useSignal<HTMLButtonElement>(),root=useSignal<HTMLDivElement>(),seen=useSignal<string[]>([]);
 const levels=useComputed$(()=>props.levels??[90,100,110,130,150].map(percent=>({id:String(percent),label:`${percent}%`,percent})));
 const change=$(async(next:string)=>{await value.request(next,()=>props.onValueChange$?.({value:next}));});
 const show=$(async(next:boolean,returnFocus=true)=>{await open.request(next,()=>props.onOpenChange$?.({open:next}));if(!open.value.value&&returnFocus)trigger.value?.focus();});
 const keyAction=$(async(key:string,token:string)=>{
  if(seen.value.includes(token))return;seen.value=[...seen.value,token].slice(-64);
  if(key==='Escape'&&open.value.value)await show(false);
  else if(!open.value.value&&['ArrowUp','ArrowDown'].includes(key)){
   const index=levels.value.findIndex(level=>level.id===value.value.value),next=levels.value[index+(key==='ArrowDown'?1:-1)];if(next)await change(next.id);
  }
 });
 useVisibleTask$(({cleanup})=>{
  const key=(event:KeyboardEvent)=>{if(!root.value?.contains(event.target as Node)||ignoredKey(event))return;if((event.key==='Escape'&&open.value.value)||(!open.value.value&&['ArrowUp','ArrowDown'].includes(event.key))){event.preventDefault();void keyAction(event.key,`${event.type}:${event.timeStamp}`);}};
  const outside=(event:PointerEvent)=>{if(open.value.value&&event.target instanceof Node&&!root.value?.contains(event.target))void show(false,false);};
  const doc=root.value?.ownerDocument??document;
  doc.addEventListener('keydown',key);doc.addEventListener('pointerdown',outside);cleanup(()=>{doc.removeEventListener('keydown',key);doc.removeEventListener('pointerdown',outside);});
 },{strategy:'document-ready'});
 return <div ref={root} {...owned('resize')} onKeyDown$={event=>{if(ignoredKey(event))return;if((event.key==='Escape'&&open.value.value)||(!open.value.value&&['ArrowUp','ArrowDown'].includes(event.key))){event.preventDefault();return keyAction(event.key,`${event.type}:${event.timeStamp}`);}}}><button ref={trigger} type="button" {...owned('resize','trigger')} aria-expanded={open.value.value} aria-controls={id} onClick$={()=>show(!open.value.value)}>화면 크기 <span {...owned('resize','current')}>{levels.value.find(level=>level.id===value.value.value)?.label}</span></button><div id={id} {...owned('resize','list')} hidden={!open.value.value}>{levels.value.map(level=><button key={level.id} type="button" {...owned('resize','option',value.value.value===level.id?'selected':'')} aria-pressed={value.value.value===level.id} onClick$={async()=>{await change(level.id);await show(false);}}>{level.label}</button>)}</div></div>;
});
