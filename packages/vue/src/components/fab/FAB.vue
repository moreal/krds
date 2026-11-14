<script setup lang="ts">
import { nextTick, ref, useId } from 'vue';
import type { FABContract } from '@unofficial-krds/contracts';
import { useOwned } from '../catalog-state';
const p = withDefaults(defineProps<FABContract>(), { expanded: undefined, defaultExpanded: undefined,showLabel:true });
const emit = defineEmits<{
    expandedChange: [
        detail: {
            expanded: boolean;
        }
    ];
    action: [
    ];
}>();
const state = useOwned(() => p.expanded, () => p.defaultExpanded, false, expanded => emit('expandedChange', { expanded }));
const trigger = ref<HTMLButtonElement>();
const id = useId();
if ((p.actions?.length ?? 0) > 3)
    throw new RangeError('At most three FAB actions');
function activate() {
    if (p.disabled)
        return;
    if (p.actions?.length)
        state.request(!state.value.value);
    else
        emit('action');
}
function collapse() {
    state.request(false);
    void nextTick(() => {
        if (!state.value.value)
            trigger.value?.focus();
    });
}
function key(e: KeyboardEvent) {
    if (e.key === 'Escape' && !e.isComposing && state.value.value) {
        e.preventDefault();
        collapse();
    }
}
</script>
<template>
<div data-krds-part="root" :data-krds-state="state.value.value?'expanded':'collapsed'" :data-krds-variant="actions?.length?'expandable':showLabel===false?'single-icon':'extended-label'" @keydown="key" data-krds-component="fab">
<div v-if="actions?.length&&state.value.value" data-krds-part="overlay" aria-hidden="true" @click="collapse" data-krds-component="fab" data-krds-state="expanded"/>
<button ref="trigger" :aria-label="showLabel===false?label:undefined" type="button" data-krds-part="trigger" :disabled="disabled" :aria-expanded="actions?.length?state.value.value:undefined" :aria-controls="actions?.length?id:undefined" @click="activate" data-krds-component="fab" data-krds-state="">
<span data-krds-component="fab" data-krds-part="icon" data-krds-state="" aria-hidden="true">
<slot name="icon">
<svg v-if="icon==='plus'||icon==='add'" viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" tabindex="-1">
<path d="M12 4v16M4 12h16"/>
</svg>
<template v-else>{{icon}}</template>
</slot>
</span>
<span :hidden="showLabel===false" data-krds-part="label" data-krds-component="fab" data-krds-state="">{{label}}</span>
</button>
<div v-if="actions?.length" :id="id" data-krds-part="actions" :hidden="!state.value.value" data-krds-component="fab" data-krds-state="">
<button v-for="action in actions" :key="action.id" type="button" data-krds-part="action" :disabled="disabled" @click="action.onAction()" data-krds-component="fab" data-krds-state="">{{action.label}}</button>
</div>
</div>
</template>
