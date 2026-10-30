import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import type { ContextualHelpContract } from '@unofficial-krds/contracts';
import { part, useValue, focusSafe, usable } from '../../catalog-utils.js';
export interface ContextualHelpProps extends ContextualHelpContract {
    children?: ReactNode;
}
export function ContextualHelp({ open, defaultOpen, onOpenChange, title, content, variant = 'information', placement = 'bottom-start', triggerLabel, relatedId, fallbackFocusId, children }: ContextualHelpProps) { const id = useId(); const state = useValue(open, defaultOpen, false, 'ContextualHelp'); const root = useRef<HTMLSpanElement>(null); const trigger = useRef<HTMLButtonElement>(null); const popup = useRef<HTMLDivElement>(null); const [position, setPosition] = useState({ left: 0, top: 0 }); const requestedClose = useRef(false); const wasOpen = useRef(state.current);
    const aliveOpen=useRef(state.current);aliveOpen.current=state.current;
    useLayoutEffect(() => {
        const ownedRoot = root.current;
        const doc = ownedRoot?.ownerDocument;
        return () => {
            const ownedFocus = ownedRoot?.contains(doc?.activeElement ?? null);
            queueMicrotask(() => {
                if (doc && aliveOpen.current && ownedFocus && !ownedRoot?.isConnected && (doc.activeElement === doc.body || !usable(doc.activeElement))) {
                    focusSafe(doc, undefined, fallbackFocusId);
                }
            });
        };
    }, []); const request = (next: boolean) => { if (next === state.current)
    return; requestedClose.current = !next; state.commit(next); onOpenChange?.({ open: next }); }; useLayoutEffect(() => { if (wasOpen.current && !state.current && requestedClose.current) {
    requestedClose.current = false;
    focusSafe(document, trigger.current?.id, fallbackFocusId, trigger.current);
} if (!wasOpen.current && state.current)
    popup.current?.querySelector<HTMLElement>('a[href],button')?.focus(); wasOpen.current = state.current; }, [state.current]); useEffect(() => { if (!state.current)
    return; const update = () => { const box = trigger.current?.getBoundingClientRect(); const pop = popup.current; if (!box || !pop)
    return; const top = placement.startsWith('top') ? box.top - pop.offsetHeight - 8 : box.bottom + 8; const alignedLeft=placement.endsWith('-start')?box.left:placement.endsWith('-end')?box.right-pop.offsetWidth:box.left+(box.width-pop.offsetWidth)/2; setPosition({ left: Math.max(8, Math.min(alignedLeft, innerWidth - pop.offsetWidth - 8)), top: Math.max(8, Math.min(top, innerHeight - pop.offsetHeight - 8)) }); }; const outside = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node))
    request(false); }; update(); const resize = new ResizeObserver(update); if (popup.current) resize.observe(popup.current); if (trigger.current) resize.observe(trigger.current); addEventListener('resize', update); addEventListener('scroll', update, true); document.addEventListener('click', outside); return () => { resize.disconnect(); removeEventListener('resize', update); removeEventListener('scroll', update, true); document.removeEventListener('click', outside); }; }, [state.current, placement]); return <span {...part('contextual-help', 'root', `${state.current ? 'open' : 'closed'} ${placement}`)} data-krds-variant={variant} data-krds-placement={placement} ref={root} onKeyDown={e => { if (state.current && e.key === 'Escape' && !e.defaultPrevented && !e.nativeEvent.isComposing) {
    e.preventDefault();
    request(false);
} }}><button {...part('contextual-help', 'trigger', state.current ? 'open' : 'closed')} ref={trigger} id={`${id}-trigger`} type="button" aria-expanded={state.current} aria-controls={id} aria-describedby={relatedId} onClick={() => request(!state.current)}>{triggerLabel}</button>{state.current && <div {...part('contextual-help', 'popover', `open ${placement}`)} ref={popup} id={id} role="region" aria-labelledby={`${id}-title`} style={{ position: 'fixed', zIndex: 1100, maxWidth: 'min(22rem,calc(100vw - 16px))', maxHeight: 'calc(100dvh - 16px)', overflow: 'auto', ...position }}><h2 {...part('contextual-help', 'title')} id={`${id}-title`}>{title}</h2><p {...part('contextual-help', 'body')}>{content}</p>{children}<button {...part('contextual-help', 'close')} type="button" onClick={() => request(false)}>닫기</button></div>}</span>; }
