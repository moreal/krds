import { useRef, useLayoutEffect, useEffect } from 'react';
import type { SnackbarContract } from '@unofficial-krds/contracts';
import { part, focusSafe, usable, focusSelector } from '../../catalog-utils.js';
import { useMessageLifetime } from '../../message-lifetime.js';
export interface SnackbarProps extends SnackbarContract { clearance?: number; }
export function Snackbar({ message, action, onAction, onDismiss, durationMs = null, fallbackFocusId, clearance }: SnackbarProps) {
    const root = useRef<HTMLDivElement>(null);
    const previous = useRef<SnackbarContract['message']>(null);
    const origin = useRef<HTMLElement | null>(null);
    const originAncestors = useRef<HTMLElement[]>([]);
    const lastFocused = useRef<HTMLElement | null>(null);
    const fallback = useRef(fallbackFocusId);
    fallback.current = fallbackFocusId;
    const restore = (doc: Document) => {
        if (usable(origin.current) && origin.current.matches(focusSelector)) {
            focusSafe(doc, undefined, undefined, origin.current);
        } else {
            focusSafe(doc, undefined, fallback.current, originAncestors.current.find(node => usable(node) && node.matches(focusSelector)));
        }
    };
    const hover = useRef(false);
    const focused = useRef(false);
    const lifetime = useMessageLifetime(message ? JSON.stringify([message.id, message.title, message.text, action, durationMs]) : null, durationMs, generation => {
        if (message) onDismiss({ id: message.id, reason: 'timeout', generation });
    });
    useEffect(() => lifetime.setPaused(hover.current || focused.current || !!message?.actionPending), [message?.actionPending]);
    useLayoutEffect(() => {
        const node = root.current;
        if (!node) return;
        const doc = node.ownerDocument;
        const active = doc.activeElement;
        if (message && (!previous.current || previous.current.id !== message.id) && usable(active) && active !== doc.body && !node.contains(active)) {
            origin.current = active;
            originAncestors.current = [];
            for (let ancestor = active.parentElement; ancestor; ancestor = ancestor.parentElement) originAncestors.current.push(ancestor);
        }
        const oldControl = lastFocused.current;
        if (oldControl && !usable(oldControl) && (active === doc.body || active === oldControl)) {
            lastFocused.current = null;
            restore(doc);
        }
        previous.current = message;
    }, [message, action]);
    useLayoutEffect(() => {
        const doc = root.current?.ownerDocument;
        if (!doc) return;
        const handoff = (event: Event) => {
            if (!root.current?.contains(event.target as Node)) lastFocused.current = null;
        };
        doc.addEventListener('pointerdown', handoff, true);
        doc.addEventListener('focusin', handoff);
        return () => {
            doc.removeEventListener('pointerdown', handoff, true);
            doc.removeEventListener('focusin', handoff);
            const owned = lastFocused.current;
            if (owned) queueMicrotask(() => {
                if (!owned.isConnected && doc.activeElement === doc.body) restore(doc);
            });
        };
    }, []);
    const token = message?.actionPending ? 'open action-pending' : message?.error ? 'open error' : 'open';
    const linkRel = action?.kind === 'link' && action.target === '_blank'
        ? [...new Set([...(action.rel?.split(/\s+/) ?? []), 'noopener', 'noreferrer'])].filter(Boolean).join(' ')
        : action?.kind === 'link' ? action.rel : undefined;
    return <div style={{ insetBlockEnd: clearance === undefined ? undefined : `${clearance}px` }} {...(message ? part('snackbar', 'root', token) : {})} ref={root} hidden={!message}
        onFocusCapture={event => { lastFocused.current = event.target as HTMLElement; focused.current = true; lifetime.setPaused(true); }}
        onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) { focused.current = false; lifetime.setPaused(hover.current || !!message?.actionPending); } }}
        onPointerEnter={() => { hover.current = true; lifetime.setPaused(true); }}
        onPointerLeave={() => { hover.current = false; lifetime.setPaused(focused.current || !!message?.actionPending); }}>
        {message && <>
            <div role="status" aria-live="polite" aria-atomic="true">{message.icon && <span {...part('snackbar', 'icon')} aria-hidden="true">{message.icon}</span>}<strong {...part('snackbar', 'title')}>{message.title}</strong><p {...part('snackbar', 'message')}>{message.text}</p>{message.error && <p>{message.error}</p>}</div>
            {action && (action.kind === 'link'
                ? <a {...part('snackbar', 'action')} href={action.href} target={action.target} rel={linkRel}>{action.label}{action.target === '_blank' && ' (새 창)'}</a>
                : <button {...part('snackbar', 'action')} type="button" disabled={message.actionPending} onClick={() => onAction?.({ id: message.id, generation: lifetime.generation, actionId: action.id })}>{action.label}</button>)}
            <button {...part('snackbar', 'close')} type="button" aria-label="알림 닫기" onClick={() => onDismiss({ id: message.id, reason: 'close', generation: lifetime.generation })}>닫기</button>
        </>}
    </div>;
}
