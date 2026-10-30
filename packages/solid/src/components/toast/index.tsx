import { Show } from 'solid-js';
import type { ToastContract } from '@unofficial-krds/contracts';
import { owned } from '../../internal/catalog';
import { notificationLifetime } from '../../internal/notification';
export type ToastProps = ToastContract;
export function Toast(props: ToastProps) { const duration = () => props.durationMs ?? (props.message?.tone === 'warning' ? 4000 : 3000); notificationLifetime(() => props.message ? JSON.stringify([props.message.id, props.message.text, props.message.tone, duration()]) : null, duration, () => false, generation => { if (props.message)
    props.onDismiss({ id: props.message.id, reason: 'timeout', generation }); }); return <Show when={props.message}><div {...owned('toast', 'root', `open ${props.message!.tone}`)} data-krds-tone={props.message!.tone}><span {...owned('toast', 'message')} role="status" aria-live="polite" aria-atomic="true">{props.message!.text}</span></div></Show>; }
