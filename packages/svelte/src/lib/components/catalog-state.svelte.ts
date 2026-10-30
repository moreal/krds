import { onMount, untrack } from 'svelte';
export function owned(component: string, part: string, ...states: (string|false|null|undefined)[]) { return {'data-krds-component':component,'data-krds-part':part,'data-krds-state':states.filter(Boolean).join(' ')}; }
export function ignoredKey(event: KeyboardEvent) { return event.defaultPrevented || event.isComposing || event.keyCode===229; }
export function control<T>(read:()=>T|undefined, initial:T|undefined, fallback:T, notify:(value:T)=>void) {
 const controlled=untrack(()=>read()!==undefined);if(controlled&&initial!==undefined)throw new TypeError('Controlled and default values cannot coexist');
 const baseline=initial===undefined?fallback:initial;let local=$state<T>(baseline);
 return {get value():T{const current=read();if((current!==undefined)!==controlled)throw new TypeError('Control mode cannot change');return controlled?current as T:local;},request(next:T){const before=controlled?read() as T:local;if(JSON.stringify(before)===JSON.stringify(next))return;if(!controlled)local=next;notify(next);},reset(){if(!controlled)local=baseline;}};
}
export function resetField(root:()=>HTMLElement|undefined, reset:()=>void, association?:()=>unknown){$effect(()=>{association?.();const node=root();const form=(node as HTMLInputElement|undefined)?.form??node?.closest('form');if(!form)return;let pending:ReturnType<typeof setTimeout>|undefined;const listener=(event:Event)=>{if(pending)clearTimeout(pending);pending=setTimeout(()=>{pending=undefined;if(!event.defaultPrevented&&root()?.isConnected)reset();},0);};form.addEventListener('reset',listener);return()=>{if(pending)clearTimeout(pending);form.removeEventListener('reset',listener);};});}
