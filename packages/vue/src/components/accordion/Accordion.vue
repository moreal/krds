<script setup lang="ts">
import { nextTick, ref, useId, watch } from 'vue';
import type { AccordionContract } from '@unofficial-krds/contracts';
import { useOwned, uniqueIds } from '../catalog-state';
const p = defineProps<AccordionContract>();
const emit = defineEmits<{
    openChange: [
        detail: {
            ids: readonly string[];
        }
    ];
}>();
const state = useOwned(() => p.openIds, () => p.defaultOpenIds, [] as readonly string[], ids => emit('openChange', { ids }));
const id = useId();
const root = ref<HTMLElement>();
uniqueIds(p.items);
function toggle(item: string) { const next = state.value.value.includes(item) ? state.value.value.filter(x => x !== item) : (p.multiple === false ? [item] : [...state.value.value, item]); state.request(next); }
watch(state.value, (ids, old) => {
    for (const key of old ?? []) {
        const panel = document.getElementById(`${id}-${key}-panel`);
        if (!ids.includes(key) && panel?.contains(document.activeElement))
            void nextTick(() => document.getElementById(`${id}-${key}-trigger`)?.focus());
    }
});
</script>
<template>
<div ref="root" data-krds-part="root" :data-krds-variant="variant??'default'" data-krds-component="accordion" data-krds-state="">
<section v-for="item in items" :key="item.id" data-krds-part="item" :data-krds-state="state.value.value.includes(item.id)?'open':'closed'" data-krds-component="accordion">
<h3 data-krds-part="heading" data-krds-component="accordion" data-krds-state="">
<button :id="`${id}-${item.id}-trigger`" type="button" data-krds-part="trigger" data-krds-state="" :aria-expanded="state.value.value.includes(item.id)" :aria-controls="`${id}-${item.id}-panel`" @click="toggle(item.id)" data-krds-component="accordion">{{item.title}}<span data-krds-part="icon" aria-hidden="true" data-krds-component="accordion" data-krds-state="">{{state.value.value.includes(item.id)?'−':'+'}}</span>
</button>
</h3>
<div :id="`${id}-${item.id}-panel`" data-krds-part="panel" data-krds-state="" :hidden="!state.value.value.includes(item.id)" data-krds-component="accordion">
<slot :name="item.id">{{item.content}}</slot>
</div>
</section>
</div>
</template>
