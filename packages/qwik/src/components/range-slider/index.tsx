import {useOnDocument} from '@builder.io/qwik';
import {initializeFieldBoundary,fieldInputValues} from '../../internal/catalog-event-boundary';
import {$,component$,useId,useSignal,useTask$,useVisibleTask$}from '@builder.io/qwik';
import type{RangeSliderContract}from '@unofficial-krds/contracts';
import{owned,useField,useReset,type NativeContract}from '../../internal/catalog';
export type RangeSliderProps=NativeContract<RangeSliderContract>;
export const RangeSlider=component$<RangeSliderProps>(props=>{useOnDocument('qinit',initializeFieldBoundary);
 const generated=useId(),id=props.id??generated,min=props.min??0,max=props.max??100,step=props.step??10,value=useField<number>(props,'value','defaultValue',min),ref=useSignal<HTMLInputElement>(),revision=useSignal(0),seen=useSignal<string[]>([]),pending=useSignal(false),queue=useSignal<{value:number;revision:number;generation:number}[]>([]),ready=useSignal(false),text=useSignal(String(value.value.value)),draft=useSignal(String(value.value.value));
 if(![min,max,step,value.value.value].every(Number.isFinite)||max<=min||step<=0||value.value.value<min||value.value.value>max)throw new TypeError('Range bounds, step and value are invalid');
 const sync=$(()=>{const actual=value.controlled.value?props.value!:value.local.value;draft.value=String(actual);if(ref.value&&ref.value.value!==String(actual))ref.value.value=String(actual);});useReset(ref,value.reset,sync);
 useTask$(async({track})=>{const next=track(()=>value.value.value),formatter=track(()=>props.valueText$);text.value=formatter?await formatter(next):String(next);});

 useVisibleTask$(({track})=>{track(()=>value.value.value);if(!ready.value){ready.value=true;return;}if(!pending.value)void sync();},{strategy:'document-ready'});

 return <div {...owned('range-slider','root',props.invalid?'invalid':props.disabled?'disabled':'')}><label for={id} {...owned('range-slider','label')}>{props.label}</label><input ref={ref} {...owned('range-slider','control')} type="range" data-krds-native-ordered="input" id={id} name={props.name} min={min} max={max} step={step} value={draft.value} disabled={props.disabled} required={props.required} aria-invalid={props.invalid||undefined} aria-describedby={[props.helpId,props.invalid?props.errorId:undefined].filter(Boolean).join(' ')||undefined} aria-valuetext={props.valueText$?text.value:undefined} onInput$={async(event,element)=>{
  if(seen.value.includes(`${event.type}:${event.timeStamp}`))return;
  seen.value=[...seen.value,`${event.type}:${event.timeStamp}`].slice(-64);
  for(const snapshot of fieldInputValues(event,element)){
   const next=Number(Math.min(props.max??100,Math.max(props.min??0,(props.min??0)+Math.round((Number(snapshot.value)-(props.min??0))/(props.step??10))*(props.step??10))).toFixed(10));
   draft.value=String(next);queue.value=[...queue.value,{value:next,revision:++revision.value,generation:value.revision.value}];
  }
  if(pending.value)return;pending.value=true;
  try{while(queue.value.length){const[candidate,...remaining]=queue.value;queue.value=remaining;if(!candidate||props.disabled||!value.alive.value||candidate.generation!==value.revision.value)continue;
   const current=value.controlled.value?props.value!:value.local.value;
   if(!Object.is(candidate.value,current)){if(!value.controlled.value){value.local.value=candidate.value;element.value=String(candidate.value);}await props.onValueChange$?.({value:candidate.value});if(value.controlled.value)await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));}
   if(candidate.revision===revision.value&&candidate.generation===value.revision.value&&value.alive.value)await sync();
  }}finally{pending.value=false;}
 }}/><output for={id} {...owned('range-slider','output')}>{text.value}</output><span {...owned('range-slider','minimum')}>{min}</span><span {...owned('range-slider','maximum')}>{max}</span></div>;
});
