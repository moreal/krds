import{sync$}from '@builder.io/qwik';
export interface NativeFieldSnapshot{value:string;checked:boolean;composing:boolean;}
/** DOM-owned event snapshots survive lazy import without serializing DOM, Event or File objects. */
export const initializeFieldBoundary=sync$((_:Event,root:HTMLElement)=>{
 const key=Symbol.for('unofficial-krds.native-field-events');
 if((root as unknown as Record<symbol,unknown>)[key])return;
 (root as unknown as Record<symbol,unknown>)[key]=true;
 const capture=(event:Event)=>{const target=event.target;if(!(target instanceof HTMLInputElement||target instanceof HTMLTextAreaElement))return;const owner=target as unknown as Record<symbol,WeakMap<Event,{value:string;checked:boolean;composing:boolean}>>;const events=owner[key]??(owner[key]=new WeakMap());if(events.has(event))return;const snapshot={value:target.value,checked:target instanceof HTMLInputElement?target.checked:false,composing:(event as InputEvent).isComposing===true};events.set(event,snapshot);if(event.type==='input'&&target.dataset.krdsNativeOrdered==='input'){const order=Symbol.for('unofficial-krds.native-field-input-order'),resource=target as unknown as Record<symbol,Array<{event:Event;snapshot:typeof snapshot}>>;(resource[order]??=[]).push({event,snapshot});}};
 for(const name of ['input','change','compositionstart','compositionend'])root.addEventListener(name,capture,true);
});
export function fieldSnapshot(event:Event,element:HTMLElement):NativeFieldSnapshot|undefined{return(element as unknown as Record<symbol,WeakMap<Event,NativeFieldSnapshot>|undefined>)[Symbol.for('unofficial-krds.native-field-events')]?.get(event);}

/** Drain captured native inputs in dispatch order even if lazy handlers resolve out of order. */
export function fieldInputValues(event:Event,element:HTMLInputElement):NativeFieldSnapshot[]{const pending=(element as unknown as Record<symbol,Array<{event:Event;snapshot:NativeFieldSnapshot}>|undefined>)[Symbol.for('unofficial-krds.native-field-input-order')];if(pending){const index=pending.findIndex(item=>item.event===event);return index<0?[]:pending.splice(0,index+1).map(item=>item.snapshot);}return[fieldSnapshot(event,element)??{value:element.value,checked:element.checked,composing:false}];}
