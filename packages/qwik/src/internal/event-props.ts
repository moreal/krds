import { sync$ } from '@builder.io/qwik';
/** Sync QRLs are embedded in SSR. They own only default behavior, never semantic state. */
export const preventDateEnter = sync$((event: KeyboardEvent, element: HTMLInputElement) => {
    if (element.dataset.krdsComposing === 'true')
        return;
    if (event.key === 'Enter' && !event.isComposing && event.keyCode !== 229 && !event.ctrlKey && !event.metaKey && !event.altKey)
        event.preventDefault();
});
export const preventTabNavigation = sync$((event: KeyboardEvent, element: HTMLElement) => {
    if (event.isComposing || event.keyCode === 229 || event.ctrlKey || event.metaKey || event.altKey)
        return;
    const vertical = element.getAttribute('data-orientation') === 'vertical';
    if (['Home', 'End', ...(vertical ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'])].includes(event.key))
        event.preventDefault();
});
export const preventCalendarNavigation = sync$((event: KeyboardEvent) => {
    if (event.isComposing || event.keyCode === 229 || event.ctrlKey || event.metaKey || event.altKey)
        return;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key))
        event.preventDefault();
});
export const markTabPointer = sync$((event: PointerEvent, element: HTMLElement) => {
    delete element.dataset.krdsSkipClick;
    delete element.dataset.krdsPointer;
    if (event.button === 0 && event.isPrimary)
        element.dataset.krdsPointer = 'true';
});
export const markTabFocus = sync$((_: FocusEvent, element: HTMLElement) => {
    if (element.getAttribute('data-activation-mode') === 'automatic' && element.dataset.krdsPointer === 'true')
        element.dataset.krdsSkipClick = 'true';
    delete element.dataset.krdsPointer;
});
/**
 * Install the small browser-default boundary before Qwik restores listener contexts.
 * Qwik 1.20.3's first deserialized SyncQRL resolve is a Promise; a native listener
 * keeps cancellation synchronous even in that interval. Semantic actions stay QRLs.
 * The listener belongs to its DOM node and is collected when that node unmounts.
 */
export const initializeKeyboardBoundary = sync$((_: Event, root: HTMLElement) => {
    if (root.dataset.krdsKeyboardBoundary === 'ready')
        return;
    root.dataset.krdsKeyboardBoundary = 'ready';
    root.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.defaultPrevented || event.isComposing || event.keyCode === 229 || event.ctrlKey || event.metaKey || event.altKey)
            return;
        const target = event.target instanceof Element ? event.target : null;
        const component = root.getAttribute('data-krds-component');
        if (component === 'tabs' && target?.closest('[role="tablist"]')?.parentElement === root && target.matches('[role="tab"]:not(:disabled)')) {
            const vertical = target.getAttribute('data-orientation') === 'vertical';
            if (['Home', 'End', ...(vertical ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'])].includes(event.key))
                event.preventDefault();
        }
        if (component === 'calendar' && target?.closest('[data-krds-component="calendar"][data-krds-part="root"]') === root && target.matches('[data-krds-part="day"]:not(:disabled)')) {
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key))
                event.preventDefault();
        }
        if (component === 'date-input' && event.key === 'Enter' && target?.closest('[data-krds-component="date-input"][data-krds-part="root"]') === root && target.matches('input[type="text"]:not(:disabled)') && target.getAttribute('data-krds-composing') !== 'true')
            event.preventDefault();
    });
});
/** Transient initiating element belongs to the document, never Qwik serialized state. */
export const captureModalPointer = sync$((event: PointerEvent) => {
    if (event.button !== 0 || !event.isPrimary)
        return;
    const target = event.composedPath().find(node => node instanceof HTMLElement && node.matches('button,a[href],input,select,textarea,[tabindex],[role="button"]')) as HTMLElement | undefined;
    if (target)
        (target.ownerDocument as unknown as Record<symbol, WeakRef<HTMLElement> | undefined>)[Symbol.for('unofficial-krds.modal-pointer')] = new WeakRef(target);
});
export const clearModalPointer = sync$((event: KeyboardEvent) => {
    const target = event.target instanceof Node ? event.target.ownerDocument : null;
    if (target)
        delete (target as unknown as Record<symbol, WeakRef<HTMLElement> | undefined>)[Symbol.for('unofficial-krds.modal-pointer')];
});
