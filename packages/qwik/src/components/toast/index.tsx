import { $, component$, useSignal, Slot, useId, useComputed$, useVisibleTask$, useTask$, type JSXChildren, type QRL } from '@builder.io/qwik';
import type { ToastContract } from '@unofficial-krds/contracts';
import { owned, states, safeRel, useField, useReset, useNarrow, usable, focusTarget, restore, ignoredKey, type NativeContract } from '../../internal/catalog';
import { useNotification } from '../../internal/notification';
export type ToastProps = NativeContract<ToastContract>;
/*
 * The live region's text is its own component: Qwik rewrites a text node on every re-render of its owner, and rewriting
 * the same string in a live region is a redundant announcement. A component's props are compared by value, so an equal
 * message (a new object, or an inline object literal) re-renders the toast without touching this text node. The value is
 * computed by a call so the optimizer passes the string itself instead of a binding derived from `props.message`, which
 * would rewrite the text node whenever the message object is replaced.
 */
const plainText = (value: string | undefined) => value ?? "";
const ToastText = component$<{ text: string }>(props => <>{props.text}</>);
export const Toast = component$<ToastProps>((props) => { const signature = useComputed$(() => props.message ? JSON.stringify([props.message.id, props.message.text, props.message.tone, props.durationMs]) : null), duration = useComputed$(() => props.durationMs ?? (props.message?.tone === 'warning' ? 4000 : 3000)), paused = useSignal(false); useNotification(signature, duration, paused, $(generation => { if (props.message)
    return props.onDismiss$({ id: props.message.id, reason: 'timeout', generation }); }));  const message = props.message, text = plainText(message?.text); return message ? <div {...owned('toast', 'root', `open ${message.tone}`)} data-krds-tone={message.tone}><span key={message.id} {...owned('toast', 'message')} role="status" aria-live="polite" aria-atomic="true"><ToastText text={text}/></span></div> : null; });
