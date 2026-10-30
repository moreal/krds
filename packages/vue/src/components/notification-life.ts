import { nextTick, onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
/** Generation-aware lifetime. Dismissal is a request; message ownership stays with host. */
export function useNotificationLife(signature: () => string | null, duration: () => number | null, inhibited: () => boolean, request: (generation: number) => void) {
    const generation = ref(0), hidden = ref(false);
    let timer: ReturnType<typeof setTimeout> | undefined, remaining = 0, started = 0, consumed = false, alive = false, revision = 0;
    function cancel() { if (timer !== undefined) {
        clearTimeout(timer);
        timer = undefined;
        remaining = Math.max(0, remaining - (performance.now() - started));
    } }
    function schedule() { cancel(); if (!alive || !signature() || consumed || duration() === null || hidden.value || inhibited())
        return; const token = revision; started = performance.now(); timer = setTimeout(() => { timer = undefined; if (!alive || token !== revision || consumed)
        return; consumed = true; request(generation.value); }, remaining); }
    watch(signature, async (value) => { cancel(); revision++; const token = revision; if (value === null)
        return; generation.value++; consumed = false; remaining = duration() ?? 0; if (duration() !== null && (!Number.isFinite(remaining) || remaining <= 0))
        throw new RangeError('Notification duration must be positive'); await nextTick(); if (token === revision)
        schedule(); }, { immediate: true, flush: 'post' });
    watch(() => hidden.value || inhibited(), () => schedule());
    function visibility() { hidden.value = document.hidden; }
    onMounted(() => { alive = true; hidden.value = document.hidden; document.addEventListener('visibilitychange', visibility); remaining = duration() ?? 0; schedule(); });
    onUnmounted(() => { alive = false; revision++; cancel(); document.removeEventListener('visibilitychange', visibility); });
    return generation;
}
