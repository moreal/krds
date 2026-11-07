import { $, component$, useSignal, Slot, useId, useComputed$, useVisibleTask$, useTask$, type JSXChildren, type QRL } from '@builder.io/qwik';
import type { ToastContract } from '@unofficial-krds/contracts';
import { owned, states, safeRel, useField, useReset, useNarrow, usable, focusTarget, restore, ignoredKey, type NativeContract } from '../../internal/catalog';
import { useNotification } from '../../internal/notification';
export type ToastProps = NativeContract<ToastContract>;
export const Toast = component$<ToastProps>((props) => { const signature = useComputed$(() => props.message ? JSON.stringify([props.message.id, props.message.text, props.message.tone, props.durationMs]) : null), duration = useComputed$(() => props.durationMs ?? (props.message?.tone === 'warning' ? 4000 : 3000)), paused = useSignal(false); useNotification(signature, duration, paused, $(generation => { if (props.message)
    return props.onDismiss$({ id: props.message.id, reason: 'timeout', generation }); })); const message = props.message; return message ? <div {...owned('toast', 'root', `open ${message.tone}`)} data-krds-tone={message.tone}><span key={message.id} {...owned('toast', 'message')} role="status" aria-live="polite" aria-atomic="true">{message.text}</span></div> : null; });
