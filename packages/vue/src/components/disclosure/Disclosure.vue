<script setup lang="ts">
import { controlContract } from '../control';
import { nextTick, ref, watch } from 'vue';
import type { DisclosureContract } from '@unofficial-krds/contracts';
import { useOwned } from '../catalog-state';
const p = withDefaults(defineProps<DisclosureContract & {
    content?: string;
    modelValue?: boolean;
}>(), { open: undefined, defaultOpen: undefined, modelValue: undefined });
controlContract(() => ({ value: p.open, modelValue: p.modelValue, defaultValue: p.defaultOpen }));
const emit = defineEmits<{
    openChange: [
        detail: {
            open: boolean;
        }
    ];
    'update:modelValue': [
        open: boolean
    ];
}>();
const state = useOwned(() => p.modelValue ?? p.open, () => p.defaultOpen, false, open => { emit('update:modelValue', open); emit('openChange', { open }); });
const trigger = ref<HTMLButtonElement>(), panel = ref<HTMLElement>();
watch(state.value, (open) => {
    if (!open && panel.value?.contains(document.activeElement))
        void nextTick(() => trigger.value?.focus());
});
</script>
<template>
<div data-krds-part="root" :data-krds-state="state.value.value?'open':'closed'" data-krds-component="disclosure">
<button ref="trigger" type="button" :aria-label="label" data-krds-part="trigger" :data-krds-state="state.value.value?'open':'closed'" :aria-expanded="state.value.value" :aria-controls="contentId" @click="state.request(!state.value.value)" data-krds-component="disclosure">{{label}}<span data-krds-part="icon" aria-hidden="true" data-krds-component="disclosure" data-krds-state="">{{state.value.value?'−':'+'}}</span>
</button>
<div ref="panel" :id="contentId" data-krds-part="content" :data-krds-state="state.value.value?'open':'closed'" :hidden="!state.value.value" data-krds-component="disclosure">
<slot>{{content}}</slot>
</div>
</div>
</template>
