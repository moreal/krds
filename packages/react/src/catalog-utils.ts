import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { useControlledMode } from './use-controlled-mode.js';
export const part = (component: string, name: string, state = '') => ({ 'data-krds-component': component, 'data-krds-part': name, 'data-krds-state': state });
export const states = (...values: (string | false | undefined)[]) => values.filter(Boolean).join(' ');
export function useValue<T>(value: T | undefined, baseline: T | undefined, fallback: T, name: string) {
    const controlled = useControlledMode(value, baseline, name);
    const initial = useRef(baseline === undefined ? fallback : baseline);
    const [local, setLocal] = useState(initial.current);
    const current = controlled ? value as T : local;
    const latest = useRef(current);
    latest.current = current;
    return { current, controlled, initial: initial.current, latest, commit: (next: T) => { if (!controlled)
            setLocal(next); }, reset: () => { if (!controlled)
            setLocal(initial.current); } };
}
export function useFormReset<T extends HTMLElement>(ref: RefObject<T | null>, reset: () => void, reconcile: () => void) {
    const latest = useRef({reset,reconcile}); latest.current={reset,reconcile};
    useLayoutEffect(()=>{
        const node=ref.current;const form=node?('form' in node?(node as unknown as HTMLInputElement).form:node.closest('form')):null;if(!form)return;
        const pending=new Set<ReturnType<typeof setTimeout>>();
        const handle=(event:Event)=>{
            // A native listener can precede React's delegated reset listener.
            // Wait until propagation and the browser default action have finished.
            const timer=setTimeout(()=>{pending.delete(timer);if(event.defaultPrevented)return;latest.current.reset();queueMicrotask(()=>latest.current.reconcile());},0);
            pending.add(timer);
        };
        form.addEventListener('reset',handle);
        return()=>{form.removeEventListener('reset',handle);for(const timer of pending)clearTimeout(timer);};
    });
}
export function unique(ids: readonly string[], name: string) { if (new Set(ids).size !== ids.length)
    throw new TypeError(`${name} IDs must be unique.`); }
/** New-window links never expose their opener. */
export function safeRel(target?: string, rel?: string) { return target === '_blank' ? [...new Set(`${rel ?? ''} noopener noreferrer`.trim().split(/\s+/))].join(' ') : rel; }
export function described(help?: string, error?: string) { return [help, error].filter(Boolean).join(' ') || undefined; }
export const focusSelector = 'button:not(:disabled),input:not(:disabled):not([type="hidden"]),textarea:not(:disabled),select:not(:disabled),a[href],[tabindex]';
export function usable(node: Element | null | undefined): node is HTMLElement { return !!node && 'focus' in node && node.isConnected && !node.closest('[hidden],[inert]') && !node.matches(':disabled,[aria-disabled="true"]') && node.getClientRects().length > 0 && node.ownerDocument.defaultView?.getComputedStyle(node).visibility !== 'hidden'; }
export function focusSafe(doc: Document, preferred?: string, fallback?: string, saved?: HTMLElement | null) {
    const modal = [...doc.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]')].filter(usable).at(-1);
    const candidates = [preferred ? doc.getElementById(preferred) : null, fallback ? doc.getElementById(fallback) : null, saved];
    const target = candidates.find(n => usable(n) && n.matches(focusSelector) && (!modal || modal.contains(n)));
    if (target && usable(target)) {
        target.focus();
        return;
    }
    if (modal) {
        const first = [...modal.querySelectorAll<HTMLElement>(focusSelector)].find(n => usable(n) && n.tabIndex >= 0);
        (first ?? modal).focus();
        return;
    }
    const body = doc.body;
    const prior = body.getAttribute('tabindex');
    body.tabIndex = -1;
    body.focus();
    if (prior === null)
        body.removeAttribute('tabindex');
    else
        body.setAttribute('tabindex', prior);
}
export function numberBounds(min: number, max: number, step: number, value: number, limited = false) {
    if (![min, max, step, value].every(Number.isFinite) || max <= min || step <= 0 || value < min || value > max) {
        throw new RangeError('Invalid bounds, step or value.');
    }
    const { integers: [lower, upper, interval, selected] } = decimalLattice([min, max, step, value]);
    if ((upper! - lower!) % interval! !== 0n || (selected! - lower!) % interval! !== 0n || limited && (upper! - lower!) / interval! > 10n) {
        throw new RangeError('Bounds and value must fit the declared decimal step lattice.');
    }
}
/** Convert finite decimal Number spellings to an exact integer lattice. */
function decimalParts(value: number) {
    const [mantissa, exponentText] = String(value).split('e');
    const exponent = Number(exponentText ?? 0);
    const decimals = mantissa!.split('.')[1]?.length ?? 0;
    const scale = Math.max(0, decimals - exponent);
    const integer = BigInt(mantissa!.replace('.', '')) * 10n ** BigInt(Math.max(0, exponent - decimals));
    return { integer, scale };
}
function decimalLattice(values: readonly number[]) {
    const parts = values.map(decimalParts);
    const scale = Math.max(...parts.map(part => part.scale));
    return { scale, integers: parts.map(part => part.integer * 10n ** BigInt(scale - part.scale)) };
}
export function stepped(value: number, min: number, max: number, step: number) {
    const { scale, integers: [input, lower, upper, interval] } = decimalLattice([Math.min(max, Math.max(min, value)), min, max, step]);
    const nearestIndex = (offset: bigint) => {
        const quotient = offset / interval!;
        return offset % interval! * 2n >= interval! ? quotient + 1n : quotient;
    };
    const index = nearestIndex(input! - lower!);
    if (index === 0n) return min;
    if (index === nearestIndex(upper! - lower!)) return max;
    return Number(`${lower! + index * interval!}e-${scale}`);
}

/** Native anchored layers stay inside the live viewport as their content reflows. */
export function useFloatingBox(open:boolean,anchor:RefObject<HTMLElement|null>,popup:RefObject<HTMLElement|null>){
  const [position,setPosition]=useState({left:0,top:0});
  useLayoutEffect(()=>{
    const trigger=anchor.current,panel=popup.current;
    if(!open||!trigger||!panel)return;
    const view=trigger.ownerDocument.defaultView;if(!view)return;
    const update=()=>{const box=trigger.getBoundingClientRect();setPosition({left:Math.max(8,Math.min(box.left,view.innerWidth-panel.offsetWidth-8)),top:Math.max(8,Math.min(box.bottom+8,view.innerHeight-panel.offsetHeight-8))});};
    update();const observer=new ResizeObserver(update);observer.observe(panel);
    view.addEventListener('resize',update);view.addEventListener('scroll',update,true);
    return()=>{observer.disconnect();view.removeEventListener('resize',update);view.removeEventListener('scroll',update,true);};
  },[open,anchor,popup]);
  return {position:'fixed' as const,left:position.left,top:position.top,right:'auto',bottom:'auto',marginTop:0};
}
