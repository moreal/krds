import {positionPopup}from '../../internal/popup-service';
import { $, component$, useSignal, Slot, useId, useComputed$, useVisibleTask$, useTask$, type JSXChildren, type QRL } from '@builder.io/qwik';
import type { ContextualHelpContract } from '@unofficial-krds/contracts';
import { owned, states, safeRel, useField, useReset, useNarrow, usable, focusTarget, restore, ignoredKey, type NativeContract } from '../../internal/catalog';
export type ContextualHelpProps = NativeContract<ContextualHelpContract> & {
    children?: JSXChildren;
};
export const ContextualHelp = component$<ContextualHelpProps>((props) => { const id = useId(), open = useField<boolean>(props, 'open', 'defaultOpen', false), root = useSignal<HTMLDivElement>(), trigger = useSignal<HTMLButtonElement>(), panel = useSignal<HTMLDivElement>(), pending = useSignal(false); const close = $(async () => { if(!open.value.value)return;pending.value = true; await open.request(false,()=>props.onOpenChange$?.({ open: false })); }); useVisibleTask$(({ track, cleanup }) => { const actual = track(() => open.value.value);track(()=>props.placement); if (actual && panel.value) {
    const element = panel.value;
    queueMicrotask(() => focusTarget([...element.querySelectorAll<HTMLElement>('button,a[href],input')].find(usable) ?? element));
    const position = () => { if (!trigger.value || !panel.value)
        return; positionPopup(trigger.value,panel.value,props.placement??'bottom-start'); };
    position();
    const observer = new ResizeObserver(position);
    observer.observe(element);
    addEventListener('resize', position);
    addEventListener('scroll', position, true);
    cleanup(() => { observer.disconnect(); removeEventListener('resize', position); removeEventListener('scroll', position, true); });
}
else if (pending.value) {
    pending.value = false;
    restore(trigger.value?.id, props.fallbackFocusId, trigger.value);
} }, { strategy: 'document-ready' }); useVisibleTask$(({ cleanup }) => { const outside = (e: PointerEvent) => { if (open.value.value && !root.value?.contains(e.target as Node))
    void close(); }; const key = (e: KeyboardEvent) => { if (!ignoredKey(e) && e.key === 'Escape' && open.value.value) {
    e.preventDefault();
    void close();
} }; document.addEventListener('pointerdown', outside); document.addEventListener('keydown', key); cleanup(() => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', key); if (open.value.value)
    restore(undefined, props.fallbackFocusId, trigger.value); }); }, { strategy: 'document-ready' }); return <div ref={root} {...owned('contextual-help', 'root', open.value.value ? 'open' : 'closed')} data-krds-variant={props.variant ?? 'help'}><button ref={trigger} id={`${id}-trigger`} type="button" {...owned('contextual-help', 'trigger')} aria-expanded={open.value.value} aria-controls={id} aria-describedby={props.relatedId} onClick$={async () => { if (open.value.value)
    await close();
else
    await open.request(true, () => props.onOpenChange$?.({ open: true })); }}>{props.triggerLabel}</button>{open.value.value && <div ref={panel} id={id} {...owned('contextual-help', 'popover', 'open')} data-krds-placement={props.placement??'bottom-start'} role="region" aria-labelledby={`${id}-title`} tabIndex={-1}><h3 id={`${id}-title`} {...owned('contextual-help', 'title')}>{props.title}</h3><div {...owned('contextual-help', 'body')}>{props.content}<Slot /></div><button type="button" {...owned('contextual-help', 'close')} onClick$={close}>닫기</button></div>}</div>; });
