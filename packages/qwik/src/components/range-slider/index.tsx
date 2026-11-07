import {isServer} from '@builder.io/qwik/build';
import {useFieldBoundary,fieldInputValues,settleField,fieldAhead,settleAllField} from '../../internal/catalog-event-boundary';
import {$,component$,useId,useSignal,useTask$,useVisibleTask$}from '@builder.io/qwik';
import type{RangeSliderContract}from '@unofficial-krds/contracts';
import{owned,useField,useReset,type NativeContract}from '../../internal/catalog';
export type RangeSliderProps=NativeContract<RangeSliderContract>;
export const RangeSlider=component$<RangeSliderProps>(props=>{const fieldRoot=useSignal<HTMLElement>();useFieldBoundary(fieldRoot);
 const generated=useId(),id=props.id??generated,min=props.min??0,max=props.max??100,step=props.step??10,value=useField<number>(props,'value','defaultValue',min),ref=useSignal<HTMLInputElement>(),revision=useSignal(0),pending=useSignal(false),queue=useSignal<{value:number;revision:number;generation:number;sequence?:number}[]>([]),ready=useSignal(false),text=useSignal(String(value.value.value)),draft=useSignal(String(value.value.value)),server=useSignal(isServer),rendered=useSignal(value.value.value);
 if(![min,max,step,value.value.value].every(Number.isFinite)||max<=min||step<=0||value.value.value<min||value.value.value>max)throw new TypeError('Range bounds, step and value are invalid');
 // Write-backs skip native steps that lazily loaded handlers have not processed yet; reset forces. The value property is rendered on the server only, so a host re-render after resume cannot write a lagging value over newer native steps.
 const sync=$((force?:boolean)=>{const actual=value.controlled.value?props.value!:value.local.value;draft.value=String(actual);const element=ref.value;if(!element)return;if(force)settleAllField(element);else if(fieldAhead(element))return;if(element.value!==String(actual))element.value=String(actual);});useReset(ref,value.reset,$(()=>sync(true)));
 useTask$(async({track})=>{const next=track(()=>value.value.value),formatter=track(()=>props.valueText$);text.value=formatter?await formatter(next):String(next);});

 // First resumed run: skip only while the committed value is still the server-rendered one; a host change made before resume finished is applied.
 useVisibleTask$(({track})=>{track(()=>value.value.value);if(!ready.value){ready.value=true;if(server.value&&Object.is(value.controlled.value?props.value!:value.local.value,rendered.value))return;}if(!pending.value)void sync();},{strategy:'document-ready'});

 return <div ref={fieldRoot} {...owned('range-slider','root',props.invalid?'invalid':props.disabled?'disabled':'')}><label for={id} {...owned('range-slider','label')}>{props.label}</label><input ref={ref} {...owned('range-slider','control')} type="range" data-krds-native-ordered="input" id={id} name={props.name} min={min} max={max} step={step} value={isServer?draft.value:undefined} disabled={props.disabled} required={props.required} aria-invalid={props.invalid||undefined} aria-describedby={[props.helpId,props.invalid?props.errorId:undefined].filter(Boolean).join(' ')||undefined} aria-valuetext={props.valueText$?text.value:undefined} onInput$={async(event,element)=>{
  for(const snapshot of fieldInputValues(event,element)){
   const next=Number(Math.min(props.max??100,Math.max(props.min??0,(props.min??0)+Math.round((Number(snapshot.value)-(props.min??0))/(props.step??10))*(props.step??10))).toFixed(10));
   draft.value=String(next);queue.value=[...queue.value,{value:next,revision:++revision.value,generation:value.revision.value,sequence:snapshot.sequence}];
  }
  if(pending.value)return;pending.value=true;let failure:unknown;
  try{do{while(queue.value.length){const[candidate,...remaining]=queue.value;queue.value=remaining;try{if(!candidate||props.disabled||!value.alive.value||candidate.generation!==value.revision.value)continue;
   const current=value.controlled.value?props.value!:value.local.value;
   if(!Object.is(candidate.value,current)){if(!value.controlled.value){value.local.value=candidate.value;settleField(element,candidate.sequence);if(!fieldAhead(element))element.value=String(candidate.value);}await props.onValueChange$?.({value:candidate.value});if(value.controlled.value)await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));}
   settleField(element,candidate.sequence);if(candidate.revision===revision.value&&candidate.generation===value.revision.value&&value.alive.value)await sync();
  }catch(error){failure??=error;}finally{settleField(element,candidate?.sequence);}}
  // A throwing host handler is reported after the loop: later steps are still processed and the field is restored.
  if(failure!==undefined&&value.alive.value)await sync();}while(queue.value.length);}finally{pending.value=false;}if(failure!==undefined)throw failure;
 }}/><output for={id} {...owned('range-slider','output')}>{text.value}</output><span {...owned('range-slider','minimum')}>{min}</span><span {...owned('range-slider','maximum')}>{max}</span></div>;
});
