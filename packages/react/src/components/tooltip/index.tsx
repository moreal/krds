import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, cloneElement, isValidElement, type ReactElement } from 'react';
import { registerDocumentEscapeOwner } from '../../document-layer.js';
import type { TooltipContract } from '@unofficial-krds/contracts';
import { part, useValue, focusSafe, usable } from '../../catalog-utils.js';
export interface TooltipProps extends TooltipContract {
    children?: ReactNode;
}
export function Tooltip({ open, defaultOpen, onOpenChange, text, relationship = 'description', triggerLabel, triggerId, textId, placement = 'top', fallbackFocusId, touchToggle = true, children }: TooltipProps) {
    const touch=useRef(false);
    const state = useValue(open, defaultOpen, false, 'Tooltip');
    const root = useRef<HTMLSpanElement>(null);
    const trigger = useRef<HTMLElement | null>(null);
    const [suppressed, setSuppressed] = useState(false);
    const suppression = useRef(false);
    const departed = useRef(false);
    const tabIntent = useRef(false);
    const escapePending = useRef(false);
    const prior = useRef(state.current);
    const [position, setPosition] = useState({ left: 0, top: 0 });
    const popup = useRef<HTMLSpanElement>(null);
    const request = (next: boolean) => { if (next === state.current || next && suppression.current)
        return; state.commit(next); onOpenChange?.({ open: next }); };
    useLayoutEffect(() => {
        trigger.current = root.current?.querySelector<HTMLElement>('[data-krds-component="tooltip"][data-krds-part="trigger"]') ?? null;
        if (prior.current && !state.current && escapePending.current) {
            escapePending.current = false;
            suppression.current = true;
            setSuppressed(true);
            focusSafe(root.current!.ownerDocument, triggerId, fallbackFocusId, trigger.current);
        }
        prior.current = state.current;
    });
    const dismiss = (event: KeyboardEvent | React.KeyboardEvent) => {
        if (event.key !== 'Escape' || !state.current || event.defaultPrevented || !usable(trigger.current)) return;
        const native = 'nativeEvent' in event ? event.nativeEvent : event;
        if (native.isComposing || native.keyCode === 229) return;
        event.preventDefault();
        escapePending.current = true;
        request(false);
    };
    useEffect(() => {
        const doc = root.current?.ownerDocument;
        if (!doc) return;
        const capture = (event: KeyboardEvent) => {
            if (event.key === 'Tab') {
                tabIntent.current = suppression.current && doc.activeElement === trigger.current;
            }
        };
        const scopedEscape = (event: KeyboardEvent) => {
            const triggerDialog = trigger.current?.closest('[role="dialog"],[role="alertdialog"]');
            const focusDialog = doc.activeElement?.closest('[role="dialog"],[role="alertdialog"]');
            if (triggerDialog === focusDialog) dismiss(event);
        };
        const releaseEscapeOwner = registerDocumentEscapeOwner(doc, scopedEscape);
        const key = (event: KeyboardEvent) => scopedEscape(event);
        const keyup = (event: KeyboardEvent) => { if (event.key === 'Tab') tabIntent.current = false; };
        const outside = (event: PointerEvent) => {
            tabIntent.current = false;
            if (!root.current?.contains(event.target as Node)) request(false);
        };
        doc.addEventListener('keydown', capture, true);
        doc.addEventListener('keydown', key);
        doc.addEventListener('keyup', keyup);
        doc.addEventListener('pointerdown', outside);
        return () => {
            releaseEscapeOwner();
            doc.removeEventListener('keydown', capture, true);
            doc.removeEventListener('keydown', key);
            doc.removeEventListener('keyup', keyup);
            doc.removeEventListener('pointerdown', outside);
        };
    }, [state.current]);
    useLayoutEffect(() => {
        const element = root.current;
        const doc = element?.ownerDocument;
        return () => {
            const ownedFocus = element?.contains(doc?.activeElement ?? null);
            queueMicrotask(() => {
                if (ownedFocus && doc && !element?.isConnected && (doc.activeElement === doc.body || !usable(doc.activeElement as HTMLElement))) {
                    focusSafe(doc, undefined, fallbackFocusId);
                }
            });
        };
    }, []);
    useLayoutEffect(() => { if (!state.current)
        return; const update = () => { const box = trigger.current?.getBoundingClientRect(); const pop = popup.current; if (!box || !pop)
        return; setPosition({ left: Math.max(8, Math.min(box.left, innerWidth - pop.offsetWidth - 8)), top: Math.max(8, Math.min(placement.startsWith('top') ? box.top - pop.offsetHeight - 8 : box.bottom + 8, innerHeight - pop.offsetHeight - 8)) }); }; update(); addEventListener('resize', update); addEventListener('scroll', update, true); return () => { removeEventListener('resize', update); removeEventListener('scroll', update, true); }; }, [state.current, placement]);
    const child = isValidElement(children) ? children as ReactElement<Record<string, unknown>> : null;
    if (children && (!child || typeof child.type !== 'string' || !['button', 'a', 'input', 'select', 'textarea'].includes(child.type) || child.type === 'a' && typeof child.props.href !== 'string' || child.type === 'input' && child.props.type === 'hidden' || child.props.hidden === true || child.props.disabled === true || typeof child.props.tabIndex === 'number' && child.props.tabIndex < 0)) {
        throw new TypeError('Tooltip requires an enabled keyboard-operable native child control.');
    }
    const childProps = child?.props ?? {};
    const descriptions = typeof childProps['aria-describedby'] === 'string' ? childProps['aria-describedby'].split(/\s+/).filter(Boolean) : [];
    const labels = typeof childProps['aria-labelledby'] === 'string' ? childProps['aria-labelledby'].split(/\s+/).filter(Boolean) : [];
    const association = relationship === 'label'
        ? { 'aria-labelledby': textId, 'aria-label': undefined, 'aria-describedby': descriptions.filter(id => id !== textId).join(' ') || undefined }
        : { 'aria-labelledby': labels.filter(id => id !== textId).join(' ') || undefined, 'aria-describedby': [...new Set([...descriptions, textId])].join(' '), 'aria-label': triggerLabel ?? (typeof childProps['aria-label'] === 'string' ? childProps['aria-label'] : undefined) };
    const activate = (event: React.MouseEvent<HTMLElement>) => {
        const wasTouch = touch.current;
        touch.current = false;
        const primaryAction = childProps.onClick;
        if (typeof primaryAction === 'function') primaryAction(event);
        if (!event.defaultPrevented && touchToggle && wasTouch) {
            suppression.current = false;
            departed.current = false;
            setSuppressed(false);
            request(!state.current);
        }
    };
    const triggerAttributes = {
        ...part('tooltip', 'trigger'),
        id: triggerId,
        ...association,
        onClick: activate,
    };
    return <span {...part('tooltip', 'root', suppressed ? 'suppressed' : state.current ? 'open' : 'closed')} ref={root} onKeyDown={dismiss} onPointerDownCapture={e=>{touch.current=e.pointerType==='touch';}} onPointerEnter={e=>{if(e.pointerType!=='touch')request(true);}} onPointerLeave={e=>{if(e.pointerType!=='touch')request(false);}} onFocusCapture={() => { if(touch.current)return; if (suppression.current && departed.current) {
        suppression.current = false;
        departed.current = false;
        setSuppressed(false);
    } request(true); }} onBlurCapture={e => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            if (tabIntent.current) departed.current = true;
            tabIntent.current = false;
            request(false);
        }
    }}>{child ? cloneElement(child, triggerAttributes) : <button {...triggerAttributes} ref={trigger as React.Ref<HTMLButtonElement>} type="button" tabIndex={0}>ⓘ</button>}<span {...part('tooltip', 'popup', state.current ? 'open' : 'closed')} data-krds-placement={placement} ref={popup} id={textId} role="tooltip" hidden={!state.current && relationship !== 'label'} style={state.current ? { position: 'fixed', maxWidth: 'min(24rem, calc(100vw - 2rem))', ...position } : { display: relationship === 'label' ? 'inline-block' : undefined, position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>{text}</span></span>;
}
