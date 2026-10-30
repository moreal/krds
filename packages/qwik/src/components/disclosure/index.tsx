import { $, component$, useSignal, Slot, useId, useComputed$, useVisibleTask$, useTask$, type JSXChildren, type QRL } from '@builder.io/qwik';
import type { DisclosureContract } from '@unofficial-krds/contracts';
import { owned, states, safeRel, useField, useReset, useNarrow, usable, focusTarget, restore, ignoredKey, type NativeContract } from '../../internal/catalog';
export type DisclosureProps = NativeContract<DisclosureContract> & {
    children?: JSXChildren;
};
export const Disclosure = component$<DisclosureProps>((props) => { const open = useField<boolean>(props, 'open', 'defaultOpen', false), trigger = useSignal<HTMLButtonElement>(), panel = useSignal<HTMLDivElement>(); useVisibleTask$(({ track }) => { if (!track(() => open.value.value) && panel.value?.contains(document.activeElement))
    trigger.value?.focus(); }, { strategy: 'document-ready' }); return <div {...owned('disclosure', 'root', open.value.value ? 'open' : 'closed')}><button ref={trigger} type="button" {...owned('disclosure', 'trigger')} aria-expanded={open.value.value} aria-controls={props.contentId} onClick$={async () => { const next = !open.value.value; await open.request(next, () => props.onOpenChange$?.({ open: next })); }}><span>{props.label}</span><span {...owned('disclosure', 'icon')} aria-hidden="true">{open.value.value ? '−' : '+'}</span></button><div ref={panel} id={props.contentId} hidden={!open.value.value} {...owned('disclosure', 'content')}><Slot /></div></div>; });
