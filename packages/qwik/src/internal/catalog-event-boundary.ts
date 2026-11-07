import{sync$,useOnDocument,useVisibleTask$,type Signal}from '@builder.io/qwik';
export interface NativeFieldSnapshot{value:string;checked:boolean;composing:boolean;sequence?:number;}
/**
 * DOM-owned event snapshots survive lazy import without serializing DOM, Event or File objects.
 * The eager boundary also stamps a per-element native sequence for the event types the field consumes
 * (`change` for checkboxes/radios; `input` and composition events otherwise). Handlers settle the sequence
 * they processed, and write-backs skip while native input is still ahead of the lazily loaded handlers.
 * Native input dispatched before a (non-canceled) form reset is stale once the reset happened and is dropped.
 */
export const initializeFieldBoundary=sync$((_:Event,root:HTMLElement)=>{
 const key=Symbol.for('unofficial-krds.native-field-events'),sequenceKey=Symbol.for('unofficial-krds.native-field-sequence');
 if((root as unknown as Record<symbol,unknown>)[key])return;
 (root as unknown as Record<symbol,unknown>)[key]=true;
 const capture=(event:Event)=>{const target=event.target;if(!(target instanceof HTMLInputElement||target instanceof HTMLTextAreaElement))return;const owner=target as unknown as Record<symbol,unknown>;const events=(owner[key]??(owner[key]=new WeakMap()))as WeakMap<Event,{value:string;checked:boolean;composing:boolean;sequence:number}>;if(events.has(event))return;const toggle=target instanceof HTMLInputElement&&(target.type==='checkbox'||target.type==='radio'),counted=toggle?event.type==='change':event.type!=='change',sequence=counted?(owner[sequenceKey]=((owner[sequenceKey] as number|undefined)??0)+1)as number:((owner[sequenceKey] as number|undefined)??0);const snapshot={value:target.value,checked:target instanceof HTMLInputElement?target.checked:false,composing:(event as InputEvent).isComposing===true,sequence};events.set(event,snapshot);if(counted&&target.dataset.krdsNativeOrdered!=='input'){const ordered=Symbol.for('unofficial-krds.native-field-order'),list=target as unknown as Record<symbol,Array<{event:Event;type:string;snapshot:typeof snapshot}>>;(list[ordered]??=[]).push({event,type:event.type,snapshot});}if(event.type==='input'&&target.dataset.krdsNativeOrdered==='input'){const order=Symbol.for('unofficial-krds.native-field-input-order'),resource=target as unknown as Record<symbol,Array<{event:Event;snapshot:typeof snapshot}>>;(resource[order]??=[]).push({event,snapshot});}};
 // Capture on the window so snapshots exist before qwikloader's document-capture dispatch runs an already-resolved handler synchronously.
 // Inside a shadow root `change` is not composed and targets are retargeted, so the window never sees the field: fail loudly instead of guarding silently.
 if(root.getRootNode()!==root.ownerDocument){console.error('[unofficial-krds] Native field event boundary does not support shadow roots; early native input is not ordered or guarded for this field.',root);return;}
 const view=root.ownerDocument.defaultView??window,names=['input','change','compositionstart','compositionend'],scoped=(event:Event)=>{if(event.target instanceof Node&&root.contains(event.target))capture(event);};
 for(const name of names)view.addEventListener(name,scoped,true);
 // The component's cleanup (useFieldBoundary) disposes the listeners and clears the guard flag, so a later install re-guards the root.
 (root as unknown as Record<symbol,unknown>)[Symbol.for('unofficial-krds.native-field-dispose')]=()=>{for(const name of names)view.removeEventListener(name,scoped,true);delete (root as unknown as Record<symbol,unknown>)[key];};
 // A native form reset supersedes native input dispatched before it: record a per-field barrier (honoured unless the reset is canceled).
 const doc=root.ownerDocument as unknown as Record<symbol,unknown>,resetKey=Symbol.for('unofficial-krds.native-field-reset');
 if(!doc[resetKey]){doc[resetKey]=true;root.ownerDocument.addEventListener('reset',event=>{const form=event.target;if(!(form instanceof HTMLFormElement))return;for(const element of Array.from(form.elements)){const owner=element as unknown as Record<symbol,unknown>,sequence=owner[sequenceKey] as number|undefined;if(sequence!==undefined)((owner[resetKey]??=[]) as Array<{sequence:number;event:Event}>).push({sequence,event});}},true);}
});
/**
 * Installs the boundary for a field root: eagerly on `qinit` for resumed SSR (before any lazy handler), idempotently again
 * from a visible task (client-created or re-mounted roots), and disposes it deterministically on component cleanup.
 */
export function useFieldBoundary(root:Signal<HTMLElement|undefined>){
 useOnDocument('qinit',initializeFieldBoundary);
 useVisibleTask$(({cleanup})=>{const element=root.value;if(!element)return;void initializeFieldBoundary(new Event('qinit'),element);cleanup(()=>disposeFieldBoundary(element));},{strategy:'document-ready'});
}
/** Remove a root's window listeners and clear its guard flag. */
export function disposeFieldBoundary(root:HTMLElement){const owner=root as unknown as Record<symbol,(()=>void)|undefined>,key=Symbol.for('unofficial-krds.native-field-dispose'),dispose=owner[key];delete owner[key];dispose?.();}
export function fieldSnapshot(event:Event,element:HTMLElement):NativeFieldSnapshot|undefined{return(element as unknown as Record<symbol,WeakMap<Event,NativeFieldSnapshot>|undefined>)[Symbol.for('unofficial-krds.native-field-events')]?.get(event);}

/** Drain captured native inputs in dispatch order even if lazy handlers resolve out of order. */
export function fieldInputValues(event:Event,element:HTMLInputElement):NativeFieldSnapshot[]{const pending=(element as unknown as Record<symbol,Array<{event:Event;snapshot:NativeFieldSnapshot}>|undefined>)[Symbol.for('unofficial-krds.native-field-input-order')];if(pending){const index=pending.findIndex(item=>item.event===event);return index<0?[]:fresh(element,pending.splice(0,index+1).map(item=>item.snapshot));}return unobservedOnce(event,element)?[fieldSnapshot(event,element)??{value:element.value,checked:element.checked,composing:false}]:[];}

type SequenceOwner=Record<symbol,number|undefined>;
/** Native input superseded by a later, non-canceled form reset. */
function resetStale(element:HTMLElement,snapshot:NativeFieldSnapshot):boolean{const sequence=snapshot.sequence;if(sequence===undefined)return false;const barriers=(element as unknown as Record<symbol,Array<{sequence:number;event:Event}>|undefined>)[Symbol.for('unofficial-krds.native-field-reset')];return Boolean(barriers?.some(item=>!item.event.defaultPrevented&&sequence<=item.sequence));}
function fresh(element:HTMLElement,snapshots:NativeFieldSnapshot[]):NativeFieldSnapshot[]{return snapshots.filter(snapshot=>{if(!resetStale(element,snapshot))return true;settleField(element,snapshot.sequence);return false;});}
const nativeSequence=Symbol.for('unofficial-krds.native-field-sequence'),processedSequence=Symbol.for('unofficial-krds.native-field-processed');
/** Record that the handler finished with the native event of this sequence (call on every exit, including early returns). */
export function settleField(element:HTMLElement|undefined,sequence:number|undefined){if(!element||sequence===undefined)return;const owner=element as unknown as SequenceOwner;owner[processedSequence]=Math.max(owner[processedSequence]??0,sequence);}
/** Native input the lazily loaded handlers have not processed yet: a write-back now would erase it. */
export function fieldAhead(element:HTMLElement):boolean{const owner=element as unknown as SequenceOwner;return(owner[nativeSequence]??0)>(owner[processedSequence]??0);}
/** Authoritative write-backs (form reset) supersede pending native input. */
export function settleAllField(element:HTMLElement){const owner=element as unknown as SequenceOwner;owner[processedSequence]=Math.max(owner[processedSequence]??0,owner[nativeSequence]??0);}
/**
 * Native events this handler must process, in native dispatch order. The same event reaches two dispatch paths
 * (the lazily imported `on*$` handler and the visible-task listener) whose execution order differs from native order;
 * whichever runs first drains every earlier observed event as well, so later handlers find them already processed
 * and nothing is applied out of order. Events the eager boundary did not observe are processed on their own.
 */
export interface NativeFieldEvent{type:string;snapshot:NativeFieldSnapshot;}
export function fieldEvents(event:Event,element:HTMLElement):NativeFieldEvent[]{const snapshot=fieldSnapshot(event,element);if(snapshot){const list=(element as unknown as Record<symbol,Array<{event:Event;type:string;snapshot:NativeFieldSnapshot}>|undefined>)[Symbol.for('unofficial-krds.native-field-order')],index=list?list.findIndex(item=>item.event===event):-1;return index<0?[]:list!.splice(0,index+1).filter(({snapshot})=>fresh(element,[snapshot]).length>0).map(({type,snapshot})=>({type,snapshot}));}if(!unobservedOnce(event,element))return[];const field=element as HTMLInputElement;return[{type:event.type,snapshot:{value:field.value,checked:field.checked===true,composing:(event as InputEvent).isComposing===true}}];}
/** Events the boundary did not observe (client-created fields): both dispatch paths may see the same Event object; process it once. */
function unobservedOnce(event:Event,element:HTMLElement):boolean{const owner=element as unknown as Record<symbol,WeakSet<Event>|undefined>,key=Symbol.for('unofficial-krds.native-field-unobserved'),seen=owner[key]??(owner[key]=new WeakSet());if(seen.has(event))return false;seen.add(event);return true;}
