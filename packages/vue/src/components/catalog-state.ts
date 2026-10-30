import { computed, ref, watchEffect, onMounted, onUnmounted, nextTick, type Ref } from 'vue';
import { canFocus, focusables, restore } from './modal/stack';
/** State ownership only. Rendering remains in each native SFC. */
export function useOwned<T>(read: () => T | undefined, defaultRead: () => T | undefined, fallback: T, notify: (value: T) => void) {
    const controlled = read() !== undefined;
    const initial = defaultRead() ?? fallback;
    const local = ref(initial) as Ref<T>;
    const value = computed(() => controlled ? read() as T : local.value);
    watchEffect(() => { if ((read() !== undefined) !== controlled)
        throw new TypeError('Controlled mode cannot change'); if (controlled && defaultRead() !== undefined)
        throw new TypeError('Controlled and default values cannot be combined'); });
    function request(next: T) { if (Object.is(next, value.value))
        return; if (!controlled)
        local.value = next; notify(next); }
    return { value, baseline: initial, request, commit(next: T) { if (!controlled)
            local.value = next; }, reset() { if (!controlled)
            local.value = initial; }, controlled };
}
export function useNativeReset(element: Ref<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | undefined>, reset: () => void, sync: () => void) {
    let doc: Document | undefined;
    const pending = new Map<ReturnType<typeof setTimeout>, Event>();
    function apply(event: Event) {
        if (event.defaultPrevented || event.target !== element.value?.form)
            return false;
        reset();
        sync();
        void nextTick(sync);
        return true;
    }
    function handler(event: Event) {
        if (event.target !== element.value?.form)
            return;
        const timer = setTimeout(() => { pending.delete(timer); apply(event); }, 0);
        pending.set(timer, event);
    }
    // FormData may be constructed before the queued reset task. Reconcile only
    // after native dispatch has ended, when every cancellation listener has run.
    function settleReset() {
        let applied = false;
        for (const [timer, event] of pending) {
            if (event.eventPhase !== Event.NONE)
                continue;
            clearTimeout(timer);
            pending.delete(timer);
            applied = apply(event) || applied;
        }
        return applied;
    }
    onMounted(() => { doc = element.value?.ownerDocument; doc?.addEventListener('reset', handler, true); sync(); });
    onUnmounted(() => { doc?.removeEventListener('reset', handler, true); for (const timer of pending.keys())
        clearTimeout(timer); pending.clear(); });
    return settleReset;
}
export function uniqueIds(items: readonly {
    id: string;
}[]) { if (new Set(items.map(x => x.id)).size !== items.length)
    throw new TypeError('IDs must be unique'); }
export function focusDestination(id: string) { const target = document.getElementById(id); if (!target)
    throw new TypeError(`Missing destination: ${id}`); const old = target.getAttribute('tabindex'); if (!target.matches('button,input,select,textarea,a[href],[tabindex]'))
    target.tabIndex = -1; target.scrollIntoView({ block: 'start', behavior: 'instant' }); target.focus(); if (old === null)
    target.removeAttribute('tabindex');
else
    target.setAttribute('tabindex', old); }
/** A Stop transaction resolves the actual remaining modal before an outside destination. */
export function restoreStop(startId: string, fallbackId?: string, opener?: HTMLElement | null) {
    const dialogs = Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]')).filter(el => el.isConnected && !el.closest('[inert],[hidden]') && el.getClientRects().length);
    const modal = dialogs.at(-1);
    const preferred = document.getElementById(startId);
    const fallback = fallbackId ? document.getElementById(fallbackId) : null;
    if (modal) {
        const target = [preferred, fallback, ...focusables(modal)].find(el => canFocus(el) && modal.contains(el));
        if (target instanceof HTMLElement)
            target.focus();
        else {
            const before = modal.getAttribute('tabindex');
            modal.tabIndex = -1;
            modal.focus();
            if (before === null)
                modal.removeAttribute('tabindex');
            else
                modal.setAttribute('tabindex', before);
        }
        return;
    }
    restore(document, canFocus(preferred) ? preferred : opener ?? null, fallbackId);
}
