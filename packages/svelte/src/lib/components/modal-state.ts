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
/** Shared native modal <dialog> lifecycle for Modal and BottomSheet: modal stack + scroll lock, showModal (inert background),
 * initial-focus validation, and close/focus return. Returns the teardown; throws RangeError after restoring on invalid setup. */
export function openModalDialog(node: HTMLDialogElement, options: { doc: Document; opener: HTMLElement | null; initialFocusId?: string; returnFocusId: () => string | undefined; requireCloseAction?: boolean }): () => void {
    const { doc, opener } = options;
    const ancestors = ancestorChain(opener);
    const release = registerModal(node);
    node.showModal();
    const targets = focusables(node);
    const target = options.initialFocusId ? doc.getElementById(options.initialFocusId) : node;
    const teardown = () => {
        release();
        node.close();
        restoreFocus(doc, opener, options.returnFocusId(), ancestors);
    };
    const failure = options.requireCloseAction && !targets.some(n => n.matches('button[type=button],input[type=button]'))
        ? 'Modal requires an enabled explicit close action'
        : !target || (target !== node && target !== targets[0])
            ? 'initialFocusId must identify dialog or first interactive element' : '';
    if (failure) {
        teardown();
        throw new RangeError(failure);
    }
    target!.focus();
    return teardown;
}
/** Shared modal dialog keyboard handling: Escape requests dismissal, Tab/Shift+Tab cycle within the top-most dialog. */
export function modalDialogKeydown(dialog: HTMLDialogElement | undefined, event: KeyboardEvent, onEscape: () => void) {
    if (!dialog || !topModal(dialog) || event.defaultPrevented || event.isComposing || event.keyCode === 229)
        return;
    if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onEscape();
    }
    else if (event.key === 'Tab') {
        const nodes = sequentialFocusables(dialog).sort((a, b) => a.tabIndex > 0 && b.tabIndex > 0 ? a.tabIndex - b.tabIndex : a.tabIndex > 0 ? -1 : b.tabIndex > 0 ? 1 : 0);
        event.preventDefault();
        if (!nodes.length) {
            dialog.focus();
            return;
        }
        const index = nodes.indexOf(dialog.ownerDocument.activeElement as HTMLElement);
        nodes[event.shiftKey ? (index <= 0 ? nodes.length - 1 : index - 1) : (index + 1) % nodes.length].focus();
    }
}
/** Shared outside-press tracking on a modal dialog's ::backdrop: a primary press must start and end outside the dialog box. */
export function modalOutsidePress(dialog: () => HTMLDialogElement | undefined, enabled: () => boolean | undefined, onOutside: () => void) {
    let started = false;
    const outside = (event: PointerEvent) => {
        const node = dialog();
        if (!node || event.target !== node)
            return false;
        const rect = node.getBoundingClientRect();
        return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    };
    const reset = () => { started = false; };
    return {
        onpointerdown: (event: PointerEvent) => { started = outside(event) && event.button === 0; },
        onpointerup: (event: PointerEvent) => {
            const node = dialog();
            if (enabled() && started && outside(event) && event.button === 0 && node && topModal(node))
                onOutside();
            started = false;
        },
        onpointercancel: reset,
        onlostpointercapture: reset,
    };
}
