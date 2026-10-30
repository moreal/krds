import { createEffect, createSignal, onCleanup, onMount, untrack, type Accessor } from 'solid-js';
/** One timer per semantic generation; host message presence remains authoritative. */
export function notificationLifetime(signature: Accessor<string | null>, duration: Accessor<number | null>, paused: Accessor<boolean>, timeout: (generation: number) => void) {
    type Lifetime = {
        generation: number;
        remaining: number;
        consumed: boolean;
    };
    const [record, setRecord] = createSignal<Lifetime>({ generation: 0, remaining: 0, consumed: false });
    const [visible, setVisible] = createSignal(true);
    let previous: string | null = null;
    let serial = 0;
    onMount(() => { const update = () => setVisible(!document.hidden); update(); document.addEventListener('visibilitychange', update); onCleanup(() => document.removeEventListener('visibilitychange', update)); });
    createEffect(() => { const next = signature(); if (next === previous)
        return; previous = next; setRecord({ generation: ++serial, remaining: untrack(duration) ?? 0, consumed: false }); });
    createEffect(() => { const current = record(); const key = signature(); const delay = duration(); if (!key || delay === null || current.consumed || !visible() || paused())
        return; if (delay <= 0)
        throw new TypeError('Notification duration must be positive'); const started = performance.now(); const timer = setTimeout(() => { if (current.generation !== serial || current.consumed)
        return; current.consumed = true; timeout(current.generation); }, current.remaining); onCleanup(() => { clearTimeout(timer); current.remaining = Math.max(0, current.remaining - (performance.now() - started)); }); });
    return () => record().generation;
}
