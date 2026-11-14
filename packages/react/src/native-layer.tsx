import { useEffect, useLayoutEffect, useRef, useState, isValidElement, cloneElement, type ReactNode, type ReactElement, type Ref } from 'react';
import { createPortal } from 'react-dom';
import { focusSafe, focusSelector, usable } from './catalog-utils.js';
import { acquireDocumentLayer, offerDocumentEscape } from './document-layer.js';
export function useNarrow() { const [narrow, setNarrow] = useState(false); useEffect(() => { const media = window.matchMedia('(max-width: 767px)'); const update = () => setNarrow(media.matches); update(); media.addEventListener('change', update); return () => media.removeEventListener('change', update); }, []); return narrow; }
/** Native isolation/trapping primitive. Composition owns return focus after release. */
export function NativeLayer({ open, titleId, label, descriptionId, children, onEscape, onOutside, onReleased, initialFocusId, surface = 'bare' }: {
    /** 'bare' adds dialog semantics to the one hosted native element; 'modal' emits the public Modal root, backdrop and content around the children. */
    surface?: 'bare' | 'modal';
    open: boolean;
    titleId?: string;
    /** Names the dialog directly when no visible title element labels it. */
    label?: string;
    descriptionId?: string;
    children: ReactNode;
    onEscape: () => void;
    onOutside?: () => void;
    onReleased?: () => void;
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
        if (surface === 'modal') { portal.dataset.krdsComponent = 'modal'; portal.dataset.krdsPart = 'root'; portal.dataset.krdsState = 'open'; }
        const releaseSurface = () => { portal.style.removeProperty('position'); portal.style.removeProperty('inset'); portal.style.removeProperty('z-index'); delete portal.dataset.krdsComponent; delete portal.dataset.krdsPart; delete portal.dataset.krdsState; };
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
            releaseSurface();
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
        return () => { doc.removeEventListener('keydown', key); doc.removeEventListener('focusin', focus); const wasTop = top(); registration.release(); releaseSurface(); if (wasTop)
            current.current.onReleased?.(); };
    }, [open, portal]);
    const attach = (node: HTMLDivElement | null) => { ref.current = node; const original = surface === 'bare' && isValidElement(children) ? (children.props as { ref?: Ref<HTMLDivElement> }).ref : undefined; if (typeof original === 'function')
        original(node);
    else if (original)
        original.current = node; };
    const semantics = { role: 'dialog', 'aria-modal': true as const, 'aria-label': label, 'aria-labelledby': label === undefined ? titleId : undefined, 'aria-describedby': descriptionId, tabIndex: -1, ref: attach };
    if (!open || !portal) return null;
    // The shared stylesheet owns every surface; the layer adds dialog semantics only.
    if (surface === 'modal') return createPortal(<><div data-krds-component="modal" data-krds-part="backdrop" data-krds-state="open" onClick={() => current.current.onOutside?.()}/><div {...semantics} data-krds-component="modal" data-krds-part="content" data-krds-state="open">{children}</div></>, portal);
    if (!isValidElement(children) || typeof children.type !== 'string') throw new TypeError('NativeLayer hosts one native element.');
    return createPortal(cloneElement(children as ReactElement<Record<string, unknown>>, semantics), portal);
}
