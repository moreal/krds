import { createContext, createSignal, flush, useContext, untrack, type Accessor } from 'solid-js';
import type { JSX } from '@solidjs/web';
export interface KrdsEnvironment {
    locale?: 'ko-KR' | 'en-US';
    direction?: 'ltr' | 'rtl';
    getDocument?: () => Document | undefined;
}
const Environment = createContext<KrdsEnvironment>({});
export function KrdsProvider(props: KrdsEnvironment & {
    children?: JSX.Element;
}) {
    return <Environment value={props}>{props.children}</Environment>;
}
export function useEnvironment() {
    return useContext(Environment)!;
}
export const part = (component: string, name: string, state = '') => ({ 'data-krds-component': component, 'data-krds-part': name, 'data-krds-state': state });
/** Settle accepted local writes before notification; reconcile controlled requests after it. */
export function nativeState<T>(read: () => T | undefined, fallback: () => T, readDefault: () => T | undefined) {
    const controlled = untrack(() => read() !== undefined);
    if (controlled && untrack(readDefault) !== undefined)
        throw new TypeError('Controlled and default props are mutually exclusive');
    const baseline = untrack(() => controlled ? read() as T : fallback());
    const [local, setLocal] = createSignal<T>(() => baseline);
    const value = () => {
        if ((read() !== undefined) !== controlled)
            throw new TypeError('Controlled mode cannot change');
        return controlled ? read() as T : local();
    };
    return { value: value as Accessor<T>, baseline, controlled,
        request(next: T, notify?: (detail: {
            value: T;
        }) => void) {
            if (!controlled) {
                setLocal(() => next);
                flush();
            }
            notify?.({ value: next });
            flush();
            return value();
        },
        reset() {
            if (!controlled)
                setLocal(() => baseline);
            flush();
            return value();
        } };
}
export const focusableSelector = 'button:not(:disabled),input:not(:disabled):not([type="hidden"]),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex]:not([tabindex="-1"]),[contenteditable="true"]';
export function usable(element: HTMLElement | null | undefined): element is HTMLElement {
    return !!element?.isConnected && !element.closest('[inert],[hidden]') && !element.matches(':disabled') && element.tabIndex >= 0 && element.getClientRects().length > 0 && element.ownerDocument.defaultView?.getComputedStyle(element).visibility !== 'hidden';
}
export function focusBody(doc: Document) {
    const old = doc.body.getAttribute('tabindex');
    doc.body.tabIndex = -1;
    doc.body.focus({ preventScroll: true });
    if (old === null)
        doc.body.removeAttribute('tabindex');
    else
        doc.body.setAttribute('tabindex', old);
}

interface DocumentScrollLock {
    owners: Set<symbol>;
    overflow: string;
    priority: string;
}
const documentScrollLocks = new WeakMap<Document, DocumentScrollLock>();

/** Keep the original inline scroll style until the final dialog owner releases it. */
export function lockDocumentScroll(doc: Document): () => void {
    let state = documentScrollLocks.get(doc);
    if (!state) {
        state = {
            owners: new Set(),
            overflow: doc.body.style.getPropertyValue('overflow'),
            priority: doc.body.style.getPropertyPriority('overflow'),
        };
        documentScrollLocks.set(doc, state);
        doc.body.style.setProperty('overflow', 'hidden', state.priority);
    }
    const owner = Symbol('dialog-scroll-owner');
    state.owners.add(owner);
    return () => {
        if (!state.owners.delete(owner) || state.owners.size) return;
        if (state.overflow) doc.body.style.setProperty('overflow', state.overflow, state.priority);
        else doc.body.style.removeProperty('overflow');
        documentScrollLocks.delete(doc);
    };
}

interface ParentDialogScope {
    isOpen(): boolean;
    register(close: () => void): () => void;
}
export const ParentDialog = createContext<ParentDialogScope | null>(null);
export function useParentDialog() {
    return useContext(ParentDialog);
}
