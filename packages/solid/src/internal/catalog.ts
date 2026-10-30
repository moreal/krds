import { createStore, reconcile } from 'solid-js/store';
import { createEffect, createSignal, onCleanup, onMount, type Accessor } from 'solid-js';
/** State and lifecycle only: every component owns its native markup. */
export function owned(component: string, part = 'root', state = '') { return { 'data-krds-component': component, 'data-krds-part': part, 'data-krds-state': state }; }
export function stateValue<T>(value: Accessor<T | undefined>, initial: T | undefined, fallback: T, notify?: (value: T) => void) {
    const controlled = value() !== undefined;
    if (controlled && initial !== undefined)
        throw new TypeError('Controlled and default values cannot be combined');
    let baseline = initial === undefined ? fallback : initial; let initializedDefault = false;
    const [internal, setInternal] = createSignal<T>(baseline);
    const read = () => { if ((value() !== undefined) !== controlled)
        throw new TypeError('Controlled mode cannot change'); return controlled ? value()! : internal(); };
    createEffect(read);
    return { read, initializeDefault(next: T) { if(controlled || initial !== undefined || initializedDefault)return; initializedDefault=true;baseline=next;setInternal(()=>next); }, request(next: T) { if (Object.is(next, read()))
            return false; if (!controlled)
            setInternal(() => next); notify?.(next); return true; }, reset() { if (!controlled)
            setInternal(() => baseline); }, controlled };
}
export function resetField(element: Accessor<HTMLElement | undefined>, reset: () => void) {
    onMount(() => {
        const document = element()?.ownerDocument;
        if (!document) return;
        const ownerForm = () => {
            const control = element();
            if (!control) return null;
            return 'form' in control ? (control as HTMLInputElement).form : control.closest('form');
        };
        let pending: ReturnType<typeof setTimeout> | undefined;
        const listener = (event: Event) => {
            if (event.target !== ownerForm()) return;
            clearTimeout(pending);
            pending = setTimeout(() => { if (!event.defaultPrevented && event.target === ownerForm()) reset(); }, 0);
        };
        document.addEventListener('reset', listener, true);
        onCleanup(() => { clearTimeout(pending); document.removeEventListener('reset', listener, true); });
    });
}
export const focusSelector = 'a[href],button,input:not([type="hidden"]),select,textarea,[tabindex],audio[controls],video[controls]';
export function usable(element: Element | null | undefined): element is HTMLElement { if (!element || !('focus' in element) || !element.isConnected || element.closest('[hidden],[inert]') || element.matches(':disabled,[aria-disabled="true"]') || !element.matches(focusSelector))
    return false; const style = element.ownerDocument.defaultView?.getComputedStyle(element); return style?.visibility !== 'hidden' && style?.display !== 'none' && element.getClientRects().length > 0; }
export function focusTarget(target: HTMLElement | null | undefined) { if (!target?.isConnected || target.closest('[hidden],[inert]'))
    return; const before = target.getAttribute('tabindex'); if (!target.matches(focusSelector))
    target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); if (before === null)
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
else
    target.setAttribute('tabindex', before); }
export function savedFocusAncestors(target?: HTMLElement) { const chain: HTMLElement[] = []; let ancestor = target?.parentElement; while (ancestor && ancestor !== target?.ownerDocument.body) { chain.push(ancestor); ancestor = ancestor.parentElement; } return chain; }
export function restore(target?: HTMLElement, fallbackId?: string, alternatives: readonly (HTMLElement | undefined)[] = []) { const document=target?.ownerDocument??globalThis.document; if(!document)return;const modal = [...document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]')].filter(usable).at(-1); const candidates = [target, fallbackId ? document.getElementById(fallbackId) : null, ...alternatives]; const next = candidates.find(candidate => usable(candidate) && (!modal || modal.contains(candidate))); if (next)
    next.focus({ preventScroll: true });
else if (modal)
    focusTarget([...modal.querySelectorAll<HTMLElement>(focusSelector)].find(usable) ?? modal);
else
    focusTarget(document.body); }
export function ignoredKey(event: KeyboardEvent) { return event.defaultPrevented || event.isComposing || event.keyCode === 229; }
export function safeRel(target?: string, rel?: string) { return target === '_blank' ? [...new Set(`${rel ?? ''} noopener noreferrer`.trim().split(/\s+/))].join(' ') : rel; }
/** Reconcile immutable host arrays by semantic key so accepted requests retain native focus. */
export function keyedItems<T extends object>(source: Accessor<readonly T[]>, key = 'id') { const [items, setItems] = createStore<T[]>([...source()]); createEffect(() => setItems(reconcile([...source()], { key }))); return () => items; }

/** Plain configuration checks only; native components still own their markup. */
export function assertSemanticIds(items: readonly {id:string}[]) { const ids = items.map(item => item.id); if (ids.some(id => typeof id !== 'string' || !id.trim()) || new Set(ids).size !== ids.length) throw new TypeError('Semantic IDs must be nonempty and unique'); }
export function assertTreeDepth(items: readonly {id:string;children?:readonly any[]}[], maximum: number) { const all:{id:string}[]=[]; const visit=(nodes:typeof items,depth:number)=>{if(nodes.length&&depth>maximum)throw new TypeError('Navigation depth exceeds its contract');for(const node of nodes){all.push(node);visit(node.children??[],depth+1);}};visit(items,1);assertSemanticIds(all); }
