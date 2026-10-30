import { createEffect, createMemo, createSignal, sharedConfig, onMount, onCleanup, type Accessor } from 'solid-js';
import { registerModalLayer, activeModalContent } from './modal-layer';
import { focusSelector, usable, ignoredKey } from './catalog';
/** Composition-owned entry/isolation only; the composing panel owns every return. */
export function narrowViewport() { const [narrow, setNarrow] = createSignal(!sharedConfig.context && typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches); onMount(() => { const media = matchMedia('(max-width: 767px)'); const update = () => setNarrow(media.matches); update(); media.addEventListener('change', update); onCleanup(() => media.removeEventListener('change', update)); }); return narrow; }
export function panelLifecycle(open: Accessor<boolean>, narrow: Accessor<boolean>, root: Accessor<HTMLElement | undefined>, close: () => void, delegateFocus?:()=>boolean) { const actualOpen=createMemo(open),actualNarrow=createMemo(narrow),actualRoot=createMemo(root); createEffect(() => { if (!actualOpen())
    return; const panel = actualRoot(); if (!panel)
    return; const modal = actualNarrow(); let layer: ReturnType<typeof registerModalLayer> | undefined; if (modal)
    layer = registerModalLayer(panel.ownerDocument, { root: panel, content: panel }); panel.focus({ preventScroll: true }); const key = (event: KeyboardEvent) => { if (ignoredKey(event) || layer && !layer.top() || !layer && (!panel.contains(event.target as Node) || Boolean(activeModalContent(panel.ownerDocument) && !activeModalContent(panel.ownerDocument)!.contains(panel))))
    return; if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    close();
}
else if (event.key === 'Tab' && modal) {
    const controls = [...panel.querySelectorAll<HTMLElement>(focusSelector)].filter(element => usable(element) && element.tabIndex >= 0);
    const first = controls[0], last = controls.at(-1);
    if (!first) {
        event.preventDefault();
        panel.focus();
    }
    else if (event.shiftKey && (panel.ownerDocument.activeElement === first || panel.ownerDocument.activeElement === panel)) {
        event.preventDefault();
        last!.focus();
    }
    else if (!event.shiftKey && (panel.ownerDocument.activeElement === last || panel.ownerDocument.activeElement === panel)) {
        event.preventDefault();
        first.focus();
    }
} }; const focus = (event: FocusEvent) => { if (modal && layer?.top() && !panel.contains(event.target as Node) && !delegateFocus?.())
    panel.focus(); }; panel.ownerDocument.addEventListener('keydown', key); panel.ownerDocument.addEventListener('focusin', focus); onCleanup(() => { panel.ownerDocument.removeEventListener('keydown', key); panel.ownerDocument.removeEventListener('focusin', focus); layer?.release(); }); }); }
