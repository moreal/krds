import { anchoredPosition } from '../../internal/position';
import { createEffect, createSignal, onMount, onCleanup } from 'solid-js';
import type { TooltipContract } from '@unofficial-krds/contracts';
import { owned, stateValue, ignoredKey, restore, savedFocusAncestors } from '../../internal/catalog';
export type TooltipProps = TooltipContract;
export function Tooltip(props: TooltipProps) { if (!props.text.trim() || props.relationship === 'label' && props.triggerLabel || props.relationship !== 'label' && !props.triggerLabel?.trim())
    throw new TypeError('Tooltip requires unambiguous functional naming'); const open = stateValue(() => props.open, props.defaultOpen, false, open => props.onOpenChange?.({ open })); const [suppressed, setSuppressed] = createSignal(false); let root!: HTMLSpanElement, trigger!: HTMLButtonElement; const [popup,setPopup]=createSignal<HTMLElement>(); anchoredPosition(open.read,()=>trigger,popup,()=>props.placement); let ancestors:HTMLElement[]=[]; let escapePending = false; let pointerActivation=false; let keyboardDeparted = false; let leaveTimer: ReturnType<typeof setTimeout> | undefined; const show = () => { if (!suppressed())
    open.request(true); }; const close = () => open.request(false); createEffect(() => { if (!open.read() && escapePending) {
    escapePending = false;
    setSuppressed(true);
    keyboardDeparted = false;
    queueMicrotask(() => restore(trigger, props.fallbackFocusId, ancestors));
} }); onMount(() => { ancestors=savedFocusAncestors(trigger); const key = (event: KeyboardEvent) => { if(event.key==='Tab')pointerActivation=false; if (ignoredKey(event))
    return; if (event.key === 'Escape' && open.read()) {
    event.preventDefault();
    escapePending = true;
    close();
    queueMicrotask(() => { if (open.read())
        escapePending = false; });
}
else if (event.key === 'Tab' && suppressed() && document.activeElement === trigger)
    keyboardDeparted = true; }; const outside = (event: PointerEvent) => { if (props.touchToggle && open.read() && !root.contains(event.target as Node))
    close(); }; document.addEventListener('keydown', key); document.addEventListener('pointerdown', outside); onCleanup(() => { document.removeEventListener('keydown', key); document.removeEventListener('pointerdown', outside); clearTimeout(leaveTimer); if (escapePending || open.read())
    queueMicrotask(()=>restore(trigger, props.fallbackFocusId, ancestors)); }); }); return <span ref={root} {...owned('tooltip', 'root', suppressed() ? 'suppressed' : open.read() ? 'open' : 'closed')} onPointerEnter={() => { clearTimeout(leaveTimer); if(!props.touchToggle) show(); }} onPointerLeave={() => { leaveTimer = setTimeout(close, 100); }} onFocusOut={event => { if (!root.contains(event.relatedTarget as Node)) {
    close();
} }}><button ref={trigger} id={props.triggerId} type="button" tabIndex={0} {...owned('tooltip', 'trigger')} aria-label={props.relationship !== 'label' ? props.triggerLabel : undefined} aria-labelledby={props.relationship === 'label' ? props.textId : undefined} aria-describedby={props.relationship !== 'label' ? props.textId : undefined} onPointerDown={()=>{pointerActivation=true;}} onPointerCancel={()=>{pointerActivation=false;}} onFocus={() => { if(props.touchToggle&&pointerActivation)return; if (suppressed() && keyboardDeparted) {
    setSuppressed(false);
    keyboardDeparted = false;
} show(); }} onClick={() => { if (props.touchToggle)
    open.request(!open.read()); pointerActivation=false; }}>ⓘ</button><span ref={setPopup} id={props.textId} role="tooltip" hidden={!open.read() && props.relationship !== 'label'} {...owned('tooltip', 'popup', open.read() ? 'open' : 'closed')} data-krds-placement={props.placement ?? 'top'} style={open.read() ? { 'max-width': 'min(24rem, calc(100vw - 2rem))' } : { display: props.relationship === 'label' ? 'inline-block' : undefined, position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', 'white-space': 'nowrap' }}>{props.text}</span></span>; }
