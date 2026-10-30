import { useEffect, useLayoutEffect, useRef, useState, isValidElement, cloneElement, type ReactNode, type ReactElement, type Ref } from 'react';
import { createPortal } from 'react-dom';
import { focusSafe, focusSelector, usable } from './catalog-utils.js';
import { acquireDocumentLayer, offerDocumentEscape } from './document-layer.js';
export function useNarrow() { const [narrow, setNarrow] = useState(false); useEffect(() => { const media = window.matchMedia('(max-width: 767px)'); const update = () => setNarrow(media.matches); update(); media.addEventListener('change', update); return () => media.removeEventListener('change', update); }, []); return narrow; }
/** Native isolation/trapping primitive. Composition owns return focus after release. */
export function NativeLayer({ open, titleId, descriptionId, children, onEscape, onOutside, onReleased, component, initialFocusId }: {
    open: boolean;
    titleId: string;
    descriptionId?: string;
    children: ReactNode;
    onEscape: () => void;
    onOutside?: () => void;
    onReleased?: () => void;
    component: string;
    initialFocusId?: string;
}) {
    const [portal, setPortal] = useState<HTMLElement>();
    const ref = useRef<HTMLDivElement>(null);
    const current = useRef({ onEscape, onOutside, onReleased });
    current.current = { onEscape, onOutside, onReleased };
    useLayoutEffect(() => { const node = document.createElement('div');  document.body.append(node); setPortal(node); return () => node.remove(); }, []);
    useLayoutEffect(() => {
        const dialog = ref.current;
        if (!open || !dialog || !portal)
            return;
        const doc = dialog.ownerDocument;
        const registration = acquireDocumentLayer(doc, dialog, portal);
        portal.style.position = 'fixed';
        portal.style.inset = '0';
        portal.style.zIndex = String(1000 + registration.depth);
        const top = registration.top;
        const nodes = () => [...dialog.querySelectorAll<HTMLElement>(focusSelector)].filter(n => usable(n) && n.tabIndex >= 0);
        try {
            if (initialFocusId) {
                const requested = doc.getElementById(initialFocusId);
                if (requested !== dialog && requested !== nodes()[0]) throw new RangeError('initialFocusId must identify the dialog or its first interactive element.');
                requested.focus();
            } else dialog.focus();
        } catch (error) {
            registration.release();
            portal.style.removeProperty('position'); portal.style.removeProperty('inset'); portal.style.removeProperty('z-index');
            throw error;
        }
        const key = (e: KeyboardEvent) => { if (!top() || e.defaultPrevented || e.isComposing || e.keyCode === 229)
            return; if (e.key === 'Escape') {
            offerDocumentEscape(doc, e);
            if (e.defaultPrevented) return;
            e.preventDefault();
            current.current.onEscape();
        } if (e.key === 'Tab') {
            const list = nodes();
            const first = list[0], last = list.at(-1);
            if (!first) {
                e.preventDefault();
                dialog.focus();
            }
            else if (e.shiftKey ? (doc.activeElement === first || doc.activeElement === dialog) : (doc.activeElement === last || doc.activeElement === dialog)) {
                e.preventDefault();
                (e.shiftKey ? last : first)?.focus();
            }
        } };
        const focus = (e: FocusEvent) => { if (top() && !dialog.contains(e.target as Node))
            dialog.focus(); };
        doc.addEventListener('keydown', key);
        doc.addEventListener('focusin', focus);
        return () => { doc.removeEventListener('keydown', key); doc.removeEventListener('focusin', focus); const wasTop = top(); registration.release(); portal.style.removeProperty('position'); portal.style.removeProperty('inset'); portal.style.removeProperty('z-index'); if (wasTop)
            current.current.onReleased?.(); };
    }, [open, portal]);
    const dialogAttributes = { role: 'dialog', 'aria-modal': true as const, 'aria-labelledby': titleId, 'aria-describedby': descriptionId, tabIndex: -1, style: { background: 'Canvas', color: 'CanvasText', padding: '1rem', maxHeight: '90dvh', overflow: 'auto', maxWidth: 'min(48rem,100%)' }, ref: (node: HTMLDivElement | null) => { ref.current = node; const original = isValidElement(children) ? (children.props as {
            ref?: Ref<HTMLDivElement>;
        }).ref : undefined; if (typeof original === 'function')
            original(node);
        else if (original)
            original.current = node; } };
    const dialog = isValidElement(children) && typeof children.type === 'string' ? cloneElement(children as ReactElement<Record<string, unknown>>, dialogAttributes) : <div {...dialogAttributes} data-krds-component={component} data-krds-part="content">{children}</div>;
    return open && portal ? createPortal(<div style={{ position: 'fixed', inset: 0, zIndex: 1200, background: 'rgb(0 0 0 / .4)', display: 'grid', placeItems: 'center' }} {...(component==='bottom-sheet'?{'data-krds-component':component,'data-krds-part':'backdrop','data-krds-state':'open'}:{})} onClick={e => { if (e.target === e.currentTarget)
        current.current.onOutside?.(); }}>{dialog}</div>, portal) : null;
}
