import type { ToastContract } from '@unofficial-krds/contracts';
import { part } from '../../catalog-utils.js';
import { useMessageLifetime } from '../../message-lifetime.js';
export interface ToastProps extends ToastContract {clearance?:number;}
export function Toast({ message, durationMs, onDismiss, clearance }: ToastProps) { const duration = durationMs ?? (message?.tone === 'warning' ? 4000 : 3000); useMessageLifetime(message ? JSON.stringify([message.id, message.text, message.tone, duration]) : null, duration, generation => { if (message)
    onDismiss({ id: message.id, reason: 'timeout', generation }); }); return <div style={{insetBlockEnd:clearance===undefined?undefined:`${clearance}px`}} {...part('toast', 'root', message ? `open ${message.tone}` : 'closed')} data-krds-tone={message?.tone} hidden={!message}>{message && <span {...part('toast', 'message', `open ${message.tone}`)} role="status" aria-live="polite" aria-atomic="true">{message.text}</span>}</div>; }
