<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick, useId } from 'vue';
import type { ResizeContract } from '@unofficial-krds/contracts';
import { useOwned } from '../catalog-state';
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
const levels = computed(() => p.levels ?? [90, 100, 110, 130, 150].map(percent => ({ id: String(percent), label: `${percent}%`, percent })));
const state = useOwned(() => p.value, () => p.defaultValue, '100', value => emit('valueChange', { value }));
const open = useOwned(() => p.open, () => p.defaultOpen, false, value => emit('openChange', { open: value }));
const root = ref<HTMLElement>(), trigger = ref<HTMLButtonElement>(), id = useId();
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
<div ref="root" data-krds-part="root" :data-krds-state="open.value.value?'open':'closed'" @keydown="key" data-krds-component="resize">
<button ref="trigger" type="button" data-krds-part="trigger" :aria-expanded="open.value.value" :aria-controls="id" @click="open.request(!open.value.value)" data-krds-component="resize" data-krds-state="">화면 크기 {{levels.find(x=>x.id===state.value.value)?.label}}</button>
<ul :id="id" data-krds-part="list" :hidden="!open.value.value" data-krds-component="resize" data-krds-state="">
<li v-for="level in levels" :key="level.id">
<button type="button" data-krds-part="option" :aria-pressed="level.id===state.value.value" :data-krds-state="level.id===state.value.value?'selected':''" @click="choose(level.id)" data-krds-component="resize">{{level.label}}</button>
</li>
</ul>
</div>
</template>
