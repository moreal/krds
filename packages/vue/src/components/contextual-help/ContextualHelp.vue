<script setup lang="ts">
import { ref, useId, nextTick, watch, onMounted, onUnmounted } from 'vue';
import type { ContextualHelpContract } from '@unofficial-krds/contracts';
import { usePopupPosition } from '../popup-position';
import { useOwned } from '../catalog-state';
import { focusables, restore } from '../modal/stack';
const p = withDefaults(defineProps<ContextualHelpContract>(), { open: undefined, defaultOpen: undefined });
const emit = defineEmits<{
    openChange: [
        detail: {
            open: boolean;
        }
    ];
}>();
const state = useOwned(() => p.open, () => p.defaultOpen, false, open => emit('openChange', { open }));
const id = useId(), root = ref<HTMLElement>(), trigger = ref<HTMLButtonElement>(), popover = ref<HTMLElement>();
const position = usePopupPosition(state.value, trigger, popover, () => p.placement ?? 'bottom-start');
let mounted = false;
watch(state.value, async (open, old) => {
    if (!mounted)
        return;
    await nextTick();
    if (open) {
        if (popover.value)
            (focusables(popover.value)[0] ?? popover.value).focus();
    }
    else if (old) {
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
        if (mounted && !state.value.value)
            restore(document, trigger.value ?? null, p.fallbackFocusId);
    }
}, { flush: 'post' });
function key(e: KeyboardEvent) {
    if (e.key === 'Escape' && !e.isComposing && !e.defaultPrevented && state.value.value) {
        e.preventDefault();
        state.request(false);
    }
}
function outside(e: PointerEvent) {
    if (!root.value?.contains(e.target as Node))
        state.request(false);
}
onMounted(() => { mounted = true; document.addEventListener('pointerdown', outside); });
onUnmounted(() => {
    mounted = false;
    document.removeEventListener('pointerdown', outside);
    if (state.value.value)
        restore(document, trigger.value ?? null, p.fallbackFocusId);
});
</script>
<template>
<div ref="root" data-krds-part="root" :data-krds-state="state.value.value?'open':'closed'" :data-krds-variant="variant??'help'" @keydown="key" data-krds-component="contextual-help">
<button ref="trigger" type="button" data-krds-part="trigger" :aria-expanded="state.value.value" :aria-controls="id" :aria-describedby="relatedId" @click="state.request(!state.value.value)" data-krds-component="contextual-help" data-krds-state="">{{triggerLabel}}</button>
<div v-if="state.value.value" ref="popover" :style="position.style.value" :data-krds-placement="position.placement.value" :id="id" data-krds-part="popover" data-krds-state="open" role="region" :aria-labelledby="`${id}-title`" tabindex="-1" data-krds-component="contextual-help">
<h3 :id="`${id}-title`" data-krds-part="title" data-krds-component="contextual-help" data-krds-state="">{{title}}</h3>
<div data-krds-part="body" data-krds-component="contextual-help" data-krds-state="">
<slot>{{content}}</slot>
</div>
<button type="button" data-krds-part="close" @click="state.request(false)" data-krds-component="contextual-help" data-krds-state="">닫기</button>
</div>
</div>
</template>
