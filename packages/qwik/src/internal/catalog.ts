import {registerModalLayer,topModal,afterLayerDisposal} from './modal-service';
import { $, useComputed$, useSignal, useVisibleTask$, type QRL, type Signal } from '@builder.io/qwik';
type Fn = (...args: any[]) => any;
/** Native Qwik event transport; semantic data stays framework independent. */
type NativeData<T> = T extends Fn ? QRL<T> : T extends File ? T : T extends readonly unknown[] ? { [K in keyof T]: NativeData<T[K]> } : T extends object ? { [K in keyof T]: NativeData<T[K]> } : T;
export type NativeContract<T> = { [K in keyof T as Extract<T[K], Fn> extends never ? K : `${Extract<K,string>}$`]: Extract<T[K],Fn> extends never ? NativeData<T[K]> : QRL<Extract<T[K],Fn>> };
export const owned = (component:string,part='root',state='') => ({'data-krds-component':component,'data-krds-part':part,'data-krds-state':state});
export const states=(...tokens:(string|false|undefined)[])=>tokens.filter(Boolean).join(' ');
export const safeRel=(target?:string,rel?:string)=>target==='_blank'?[...new Set(`${rel??''} noopener noreferrer`.trim().split(/\s+/))].join(' '):rel;
export const focusSelector='a[href],button,input:not([type="hidden"]),textarea,select,[tabindex],audio[controls],video[controls]';
export function usable(node:Element|null|undefined):node is HTMLElement {return !!node&&'focus'in node&&node.isConnected&&!node.closest('[hidden],[inert]')&&!node.matches(':disabled,[aria-disabled="true"]')&&node.getClientRects().length>0&&node.ownerDocument.defaultView?.getComputedStyle(node).visibility!=='hidden';}
export function focusTarget(node:HTMLElement|null|undefined){if(!node?.isConnected||node.closest('[hidden],[inert]'))return;const before=node.getAttribute('tabindex');if(!node.matches(focusSelector))node.tabIndex=-1;node.focus({preventScroll:true});if(before===null)node.addEventListener('blur',()=>node.removeAttribute('tabindex'),{once:true});else node.setAttribute('tabindex',before);}
export function restore(preferred?:string,fallback?:string,saved?:HTMLElement|null){const doc=saved?.ownerDocument??document,modal=topModal(doc);const target=[preferred?doc.getElementById(preferred):null,fallback?doc.getElementById(fallback):null,saved].find(n=>usable(n)&&(!modal||modal.contains(n)));if(target)focusTarget(target);else if(modal)focusTarget([...modal.querySelectorAll<HTMLElement>(focusSelector)].find(usable)??modal);else focusTarget(doc.body);}
export function ignoredKey(e:KeyboardEvent){return e.defaultPrevented||e.isComposing||e.keyCode===229||e.ctrlKey||e.altKey||e.metaKey;}
/** Signals, computed reads and QRL requests only; no renderer or DOM interpreter. */
export function useField<T>(props:Record<string,any>,key:string,defaultKey:string,fallback:T){
 const controlled=useSignal(props[key]!==undefined),baseline=useSignal<T>(props[defaultKey]===undefined?fallback:props[defaultKey]),local=useSignal<T>(baseline.value),revision=useSignal(0),alive=useSignal(true);
 if(props[key]!==undefined&&props[defaultKey]!==undefined)throw new TypeError('Controlled and default values cannot be combined');
 const value=useComputed$(()=>{if((props[key]!==undefined)!==controlled.value)throw new TypeError('Controlled mode cannot change');return controlled.value?props[key] as T:local.value;});
 useVisibleTask$(({cleanup})=>{alive.value=true;cleanup(()=>{alive.value=false;revision.value++;});},{strategy:'document-ready'});
 const request=$(async(next:T,notify?:()=>unknown)=>{if(!alive.value||Object.is(next,controlled.value?props[key]:local.value))return false;const version=revision.value;if(!controlled.value)local.value=next;await notify?.();return alive.value&&version===revision.value;});
 const reset=$(()=>{revision.value++;if(!controlled.value)local.value=baseline.value;});
 return {value,request,reset,local,baseline,controlled,revision,alive};
}
export function useReset(ref:Signal<HTMLElement|undefined>,reset:QRL<()=>void>,reconcile?:QRL<()=>void>){
 useVisibleTask$(({cleanup})=>{const element=ref.value;const form=element&&('form'in element?(element as HTMLInputElement).form:element.closest('form'));if(!form)return;const timers=new Set<ReturnType<typeof setTimeout>>();const listener=(event:Event)=>{const timer=setTimeout(async()=>{timers.delete(timer);if(event.defaultPrevented)return;await reset();await reconcile?.();},0);timers.add(timer);};form.addEventListener('reset',listener);cleanup(()=>{form.removeEventListener('reset',listener);for(const timer of timers)clearTimeout(timer);});},{strategy:'document-ready'});
}
/** Absent open defaults depend on the initial browser layout; explicit values remain authoritative. */
export function useResponsiveOpen(props:Record<string,any>){const field=useField<boolean>(props,'open','defaultOpen',false);useVisibleTask$(()=>{if(props.open===undefined&&props.defaultOpen===undefined)field.local.value=!matchMedia('(max-width: 767px)').matches;},{strategy:'document-ready'});return field;}
/** One composition-owned return on committed closure or removal, after shell disposal. */
export function usePanelReturn(open:Signal<boolean>,root:Signal<HTMLElement|undefined>,opener:Signal<HTMLButtonElement|undefined>,preferred?:string,fallback?:string,suppress?:Signal<boolean>,teardownReturn?:QRL<(doc:Document,preferred?:string,fallback?:string,saved?:HTMLElement|null,departing?:HTMLElement)=>unknown>,teardownPreferred?:string,departingScope?:Signal<HTMLElement|undefined>){
 useVisibleTask$(({track,cleanup})=>{if(!track(()=>open.value))return;const panel=root.value,doc=panel?.ownerDocument??document,saved=doc.activeElement as HTMLElement|null;cleanup(()=>{if(suppress?.value){const teardown=open.value,departing=departingScope?.value??panel;afterLayerDisposal(teardown?departing:panel,()=>{queueMicrotask(()=>{if(teardown)void teardownReturn?.(doc,teardownPreferred,fallback,saved,departing);});},teardown);return;}afterLayerDisposal(panel,()=>{queueMicrotask(()=>restore(preferred,fallback,usable(opener.value)?opener.value:saved));});});},{strategy:'document-ready'});
}
export function useNarrow(){const narrow=useSignal(false);useVisibleTask$(({cleanup})=>{const query=matchMedia('(max-width: 767px)');const update=()=>narrow.value=query.matches;update();query.addEventListener('change',update);cleanup(()=>query.removeEventListener('change',update));},{strategy:'document-ready'});return narrow;}
/** Composition owns restoration; this lifecycle owns only entry, isolation and trap cleanup. */
export function usePanel(open:Signal<boolean>,narrow:Signal<boolean>,root:Signal<HTMLElement|undefined>,close:QRL<()=>unknown>){
 useVisibleTask$(({track,cleanup})=>{if(!track(()=>open.value))return;const modal=track(()=>narrow.value),panel=track(()=>root.value);if(!panel)return;
 const doc=panel.ownerDocument,layer=modal?registerModalLayer(panel,panel):undefined,top=()=>layer?layer.top():!topModal(doc);
 if(top()&&!panel.contains(doc.activeElement))focusTarget(panel);
 const key=(event:KeyboardEvent)=>{if(!top()||ignoredKey(event))return;if(event.key==='Escape'&&panel.contains(doc.activeElement)){event.preventDefault();event.stopPropagation();void close();}else if(event.key==='Tab'&&modal){const controls=[...panel.querySelectorAll<HTMLElement>(focusSelector)].filter(n=>usable(n)&&n.tabIndex>=0),index=controls.indexOf(doc.activeElement as HTMLElement);event.preventDefault();if(!controls.length)panel.focus();else controls[index<0?(event.shiftKey?controls.length-1:0):(index+(event.shiftKey?-1:1)+controls.length)%controls.length]?.focus();}};
 const focus=(event:FocusEvent)=>{if(modal&&top()&&!panel.contains(event.target as Node))panel.focus({preventScroll:true});};
 doc.addEventListener('keydown',key);doc.addEventListener('focusin',focus);
 cleanup(()=>{doc.removeEventListener('keydown',key);doc.removeEventListener('focusin',focus);layer?.dispose();});
 },{strategy:'document-ready'});
}
