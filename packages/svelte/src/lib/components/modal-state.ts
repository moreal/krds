const stack: HTMLDialogElement[] = [];
const locks = new WeakMap<Document, {
    count: number;
    overflow: string;
}>();
export const topModal = (dialog: HTMLDialogElement) => stack.at(-1) === dialog;
export function registerModal(dialog: HTMLDialogElement) {
    const doc = dialog.ownerDocument;
    let lock = locks.get(doc);
    if (!lock) {
        lock = { count: 0, overflow: doc.body.style.overflow };
        locks.set(doc, lock);
    }
    lock.count++;
    doc.body.style.overflow = 'hidden';
    stack.push(dialog);
    return () => {
        const i = stack.indexOf(dialog);
        if (i >= 0)
            stack.splice(i, 1);
        if (--lock.count === 0) {
            doc.body.style.overflow = lock.overflow;
            locks.delete(doc);
        }
    };
}
export function usable(node: Element | null): node is HTMLElement {
    return node instanceof HTMLElement && node.isConnected && node.ownerDocument.defaultView?.getComputedStyle(node).visibility !== 'hidden' && !node.closest('[inert],[aria-disabled="true"]') && !node.matches(':disabled') && node.getClientRects().length > 0 && node.matches('button,input,select,textarea,a[href],[tabindex]');
}
export function focusables(root: HTMLElement) {
    return Array.from(root.querySelectorAll<HTMLElement>('button,input,select,textarea,a[href],[tabindex]')).filter(node => usable(node) && node.tabIndex >= 0);
}
/** Sequential Tab eligibility differs from restoration: aria-disabled controls can remain deliberate native tab stops. */
export function sequentialFocusables(root: HTMLElement) {
    return Array.from(root.querySelectorAll<HTMLElement>('button,input,select,textarea,a[href],[tabindex]')).filter(node => {
        const view = node.ownerDocument.defaultView;
        return node instanceof HTMLElement && node.isConnected && !!view && !['hidden','collapse'].includes(view.getComputedStyle(node).visibility) && !node.closest('[hidden],[inert]') && !node.matches(':disabled') && node.getClientRects().length > 0 && node.tabIndex >= 0;
    });
}
export function restoreFocus(doc: Document, opener: HTMLElement | null, fallback?: string, ancestors: HTMLElement[] = []) {
    let target: HTMLElement | null = usable(opener) && opener.ownerDocument===doc ? opener : null;
    if (!target && fallback) {
        const other = doc.getElementById(fallback);
        if (usable(other))
            target = other;
    }
    for (const ancestor of ancestors) {
        if (!target && usable(ancestor))
            target = ancestor;
    }
    let ancestor = opener?.parentElement;
    while (!target && ancestor) {
        if (usable(ancestor))
            target = ancestor;
        ancestor = ancestor.parentElement;
    }
    if (target) {
        target.focus();
        return;
    }
    const previous = doc.body.getAttribute('tabindex');
    doc.body.tabIndex = -1;
    doc.body.focus();
    if (previous === null)
        doc.body.removeAttribute('tabindex');
    else
        doc.body.setAttribute('tabindex', previous);
}
export function ancestorChain(node: HTMLElement | null): HTMLElement[] {
    const result: HTMLElement[] = [];
    for (let current = node?.parentElement; current; current = current.parentElement)
        result.push(current);
    return result;
}
export function currentModal(doc?:Document):HTMLDialogElement|undefined{return [...stack].reverse().find(dialog=>dialog.isConnected&&dialog.open&&(!doc||dialog.ownerDocument===doc));}
export function restoreInContext(doc:Document,preferred:HTMLElement|null,fallback?:string,ancestors:HTMLElement[]=[]){const modal=currentModal(doc);if(!modal){restoreFocus(doc,preferred,fallback,ancestors);return;}const named=fallback?doc.getElementById(fallback):null;const target=usable(preferred)&&preferred.ownerDocument===doc&&modal.contains(preferred)?preferred:usable(named)&&modal.contains(named)?named:focusables(modal)[0]??modal;const before=target.getAttribute('tabindex');if(target===modal&&!target.hasAttribute('tabindex'))target.tabIndex=-1;target.focus();if(before===null&&target===modal)target.removeAttribute('tabindex');}
