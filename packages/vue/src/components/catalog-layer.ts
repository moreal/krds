import { nextTick, onMounted, onUnmounted, watch, ref, type Ref } from 'vue';
import { enter, leave, top, focusables, canFocus, type ModalEntry } from './modal/stack';

/** Native isolation/trapping; the composition remains the sole return owner. */
export function useLayer(
    open: Ref<boolean>, portal: Ref<HTMLElement | undefined>, dialog: Ref<HTMLElement | undefined>,
    close: () => void, returned: () => void, forceModal = false,
    initialFocus?: () => HTMLElement | null | undefined, opening?: () => void,
) {
    let entry: ModalEntry | undefined;
    let alive = false;
    let presented = false;
    const narrow = ref(false);
    let media: MediaQueryList | undefined;
    function key(event: KeyboardEvent) {
        if (!entry || !top(document, entry) || event.isComposing || event.keyCode === 229 || event.defaultPrevented) return;
        if (event.key === 'Escape') {
            event.preventDefault(); event.stopPropagation(); close();
        } else if (event.key === 'Tab') {
            const list = focusables(entry.dialog);
            const index = list.indexOf(document.activeElement as HTMLElement);
            if (!list.length) { event.preventDefault(); entry.dialog.focus(); }
            else if (event.shiftKey && index <= 0) { event.preventDefault(); list.at(-1)!.focus(); }
            else if (!event.shiftKey && (index < 0 || index === list.length - 1)) { event.preventDefault(); list[0]!.focus(); }
        }
    }
    function focus(event: FocusEvent) {
        if (entry && top(document, entry) && !entry.dialog.contains(event.target as Node)) entry.dialog.focus();
    }
    function cleanup(returnFocus: boolean) {
        if (entry) {
            leave(document, entry); entry = undefined;
            document.removeEventListener('keydown', key);
            document.removeEventListener('focusin', focus);
        }
        presented = false;
        if (returnFocus) returned();
    }
    async function activate(requestedFocus = true, retained?: HTMLElement | null) {
        await nextTick();
        if (!alive || !open.value || !dialog.value) return;
        presented = true;
        if (narrow.value && portal.value) {
            entry = { portal: portal.value, dialog: dialog.value };
            enter(document, entry);
            document.addEventListener('keydown', key);
            document.addEventListener('focusin', focus);
        }
        if (canFocus(retained) && dialog.value.contains(retained)) retained.focus();
        else if (narrow.value || requestedFocus) {
            const preferred = initialFocus?.();
            if (canFocus(preferred) && dialog.value.contains(preferred)) preferred.focus();
            else dialog.value.focus();
        }
    }
    function responsive() {
        const previous = narrow.value;
        narrow.value = forceModal || media?.matches || false;
        if (previous !== narrow.value && open.value) {
            const retained = dialog.value?.contains(document.activeElement) ? document.activeElement as HTMLElement : null;
            cleanup(false);
            void activate(false, retained);
        }
    }
    watch(open, (value, old) => {
        if (!alive) return;
        if (value) { opening?.(); void activate(); }
        else if (old) cleanup(presented);
    }, { flush: 'post' });
    onMounted(() => {
        alive = true;
        media = matchMedia('(max-width: 767px)');
        narrow.value = forceModal || media.matches;
        media.addEventListener('change', responsive);
        if (open.value) { opening?.(); void activate(false); }
    });
    onUnmounted(() => {
        alive = false;
        media?.removeEventListener('change', responsive);
        cleanup(open.value && presented);
    });
    return { narrow };
}
