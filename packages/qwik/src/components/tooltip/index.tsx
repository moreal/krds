import {positionPopup,cancelPopupLeave,schedulePopupLeave}from '../../internal/popup-service';
import { $, component$, useSignal, Slot, useId, useComputed$, useVisibleTask$, useTask$, type JSXChildren, type QRL } from '@builder.io/qwik';
import type { TooltipContract } from '@unofficial-krds/contracts';
import { owned, states, safeRel, useField, useReset, useNarrow, usable, focusTarget, restore, ignoredKey, type NativeContract } from '../../internal/catalog';
export type TooltipProps = NativeContract<TooltipContract>;
export const Tooltip = component$<TooltipProps>((props) => { if (!props.text.trim() || props.relationship === 'label' && props.triggerLabel || props.relationship !== 'label' && !props.triggerLabel?.trim())
    throw new TypeError('Tooltip requires unambiguous functional naming'); const open = useField<boolean>(props, 'open', 'defaultOpen', false), suppressed = useSignal(false), departed = useSignal(false), escape = useSignal(false), pointer = useSignal(false), root = useSignal<HTMLSpanElement>(), trigger = useSignal<HTMLButtonElement>(), popup = useSignal<HTMLSpanElement>(); const request = $(async (next: boolean, origin?:'focus'|'blur') => {const doc=root.value?.ownerDocument??document;if(origin==='focus'&&doc.activeElement!==trigger.value||origin==='blur'&&root.value?.contains(doc.activeElement))return; if(!open.alive.value||Object.is(next,open.controlled.value?props.open:open.local.value))return;if(!open.controlled.value)open.local.value=next;await props.onOpenChange$?.({open:next}); }); useVisibleTask$(({track,cleanup})=>{const actual=track(()=>open.value.value);track(()=>props.placement);if(!actual&&escape.value){escape.value=false;suppressed.value=true;if(!departed.value)restore(props.triggerId,props.fallbackFocusId,trigger.value);}if(!actual||!trigger.value||!popup.value)return;const position=()=>{if(trigger.value&&popup.value)positionPopup(trigger.value,popup.value,props.placement??'top');};position();const observer=new ResizeObserver(position);observer.observe(popup.value);observer.observe(trigger.value);addEventListener('resize',position);addEventListener('scroll',position,true);cleanup(()=>{observer.disconnect();removeEventListener('resize',position);removeEventListener('scroll',position,true);});},{strategy:'document-ready'}); useVisibleTask$(({ cleanup }) => { const key = (event: KeyboardEvent) => {
    // Keyboard departure is any Tab that moves focus, including WebKit's Option/Alt+Tab focus navigation, so it is not
    // filtered by the modifier rules that guard Escape.
    if (event.key === 'Tab' && !event.defaultPrevented && (suppressed.value||escape.value) && document.activeElement === trigger.value) {
    departed.value = true;
    return;
} if (ignoredKey(event))
    return; if (event.key === 'Escape' && open.value.value) {
    event.preventDefault();
    departed.value = false;
    escape.value = true;
    void request(false);
} }; const outside = (event: PointerEvent) => { if (props.touchToggle && open.value.value && !root.value?.contains(event.target as Node))
    void request(false); }; document.addEventListener('keydown', key); document.addEventListener('pointerdown', outside); cleanup(() => { cancelPopupLeave(root.value);document.removeEventListener('keydown', key); document.removeEventListener('pointerdown', outside); if (open.value.value)
    restore(undefined, props.fallbackFocusId, trigger.value); }); }, { strategy: 'document-ready' }); return <span ref={root} {...owned('tooltip', 'root', suppressed.value ? 'suppressed' : open.value.value ? 'open' : 'closed')} onPointerEnter$={() => { cancelPopupLeave(root.value);if (!props.touchToggle && !suppressed.value)
    void request(true); }} onPointerLeave$={() => { if(!props.touchToggle)schedulePopupLeave(root.value,()=>request(false)); }} onFocusOut$={event => { if (!root.value?.contains(event.relatedTarget as Node))
    void request(false,'blur'); }}><button ref={trigger} id={props.triggerId} type="button" {...owned('tooltip', 'trigger')} aria-label={props.relationship !== 'label' ? props.triggerLabel : undefined} aria-labelledby={props.relationship === 'label' ? props.textId : undefined} aria-describedby={props.relationship !== 'label' ? props.textId : undefined} onPointerDown$={() => pointer.value = true} onFocus$={() => { if((root.value?.ownerDocument??document).activeElement!==trigger.value)return;cancelPopupLeave(root.value);if (props.touchToggle && pointer.value)
    return; if ((suppressed.value||escape.value) && departed.value && !open.value.value) {
    escape.value = false;
    suppressed.value = false;
    departed.value = false;
} if (!suppressed.value)
    void request(true,'focus'); }} onClick$={() => { if (props.touchToggle)
    void request(!open.value.value); pointer.value = false; }}>ⓘ</button><span ref={popup} id={props.textId} role="tooltip" {...owned('tooltip', 'popup', open.value.value ? 'open' : 'closed')} data-krds-placement={props.placement ?? 'top'} style={open.value.value ? { 'max-width': 'min(24rem, calc(100vw - 2rem))' } : { position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>{props.text}</span></span>; });
