<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick, useId } from 'vue';
import type { ResizeContract } from '@unofficial-krds/contracts';
import { useOwned } from '../catalog-state';
import { usePopupPosition } from '../popup-position';
const p = withDefaults(defineProps<ResizeContract>(), { open: undefined, defaultOpen: undefined });
const emit = defineEmits<{
    valueChange: [
        detail: {
            value: string;
        }
    ];
    openChange: [
        detail: {
            open: boolean;
        }
    ];
}>();
// KRDS component_10_02 L896-905: the official five scales, each with its descriptive wording (L918).
const defaults = [{ id: '90', label: '작게 90%', percent: 90 }, { id: '100', label: '보통 100%', percent: 100 }, { id: '110', label: '조금 크게 110%', percent: 110 }, { id: '130', label: '크게 130%', percent: 130 }, { id: '150', label: '가장 크게 150%', percent: 150 }];
const levels = computed(() => p.levels ?? defaults);
const state = useOwned(() => p.value, () => p.defaultValue, '100', value => emit('valueChange', { value }));
const open = useOwned(() => p.open, () => p.defaultOpen, false, value => emit('openChange', { open: value }));
const root = ref<HTMLElement>(), trigger = ref<HTMLButtonElement>(), list = ref<HTMLElement>(), id = useId();
// Viewport-clamped placement (as React's floating box): the list stays reachable when the trigger sits near either inline edge.
const { style: listStyle } = usePopupPosition(computed(() => open.value.value), trigger, list, () => 'bottom-end');
function choose(value: string) { state.request(value); open.request(false); void nextTick(() => trigger.value?.focus()); }
function key(e: KeyboardEvent) {
    if (e.isComposing || e.defaultPrevented)
        return;
    if (e.key === 'Escape' && open.value.value) {
        e.preventDefault();
        open.request(false);
        void nextTick(() => {
            if (!open.value.value)
                trigger.value?.focus();
        });
    }
    if (!open.value.value && ['ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        const i = levels.value.findIndex(x => x.id === state.value.value);
        const next = levels.value[i + (e.key === 'ArrowDown' ? 1 : -1)];
        if (next)
            state.request(next.id);
    }
}
function outside(e: PointerEvent) {
    if (!root.value?.contains(e.target as Node))
        open.request(false);
}
onMounted(() => document.addEventListener('pointerdown', outside));
onUnmounted(() => document.removeEventListener('pointerdown', outside));
</script>
<template>
<div ref="root" data-krds-component="resize" data-krds-part="root" data-krds-state="" @keydown="key">
<button ref="trigger" type="button" data-krds-component="resize" data-krds-part="trigger" data-krds-state="" :aria-expanded="open.value.value" :aria-controls="id" @click="open.request(!open.value.value)">화면 크기 <span data-krds-component="resize" data-krds-part="current" data-krds-state="">{{levels.find(x=>x.id===state.value.value)?.label}}</span></button>
<div ref="list" :id="id" :style="listStyle" data-krds-component="resize" data-krds-part="list" data-krds-state="" :hidden="!open.value.value">
<button v-for="level in levels" :key="level.id" type="button" data-krds-component="resize" data-krds-part="option" :data-krds-state="level.id===state.value.value?'selected':''" :aria-pressed="level.id===state.value.value" @click="choose(level.id)">{{level.label}}</button>
</div>
</div>
</template>
