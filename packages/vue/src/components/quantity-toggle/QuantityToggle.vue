<script setup lang="ts">
import { controlContract } from '../control';
import { validateQuantityConfiguration } from './validation';
import { computed, nextTick, onUpdated, ref, useId, watchEffect } from 'vue';
import type { QuantityToggleContract } from '@unofficial-krds/contracts';
import { useOwned, useNativeReset } from '../catalog-state';
const p = defineProps<QuantityToggleContract & {
    form?: string;
    modelValue?: number;
}>();
controlContract(() => ({ value: p.value, modelValue: p.modelValue, defaultValue: p.defaultValue }));
const emit = defineEmits<{
    valueChange: [
        detail: {
            value: number;
        }
    ];
    'update:modelValue': [
        value: number
    ];
}>();
const min = computed(() => p.min ?? 0), max = computed(() => p.max ?? 10), step = computed(() => p.step ?? 1);
const state = useOwned(() => p.modelValue ?? p.value, () => p.defaultValue, min.value, value => { emit('update:modelValue', value); emit('valueChange', { value }); });
const control = ref<HTMLInputElement>();
const root = ref<HTMLElement>();
// Without a name there is no hidden input; reset is still observed through the owning form of the root.
const resetAnchor = computed(() => control.value ?? (root.value ? { get form() { return root.value?.closest('form') ?? null; }, ownerDocument: root.value.ownerDocument } as unknown as HTMLInputElement : undefined));
const id = p.id ?? useId();
watchEffect(() => validateQuantityConfiguration({ min: min.value, max: max.value, step: step.value, value: state.value.value }));
function adjust(delta: number) {
    if (p.disabled)
        return;
    const next = Number((state.value.value + delta * step.value).toFixed(10));
    if (next >= min.value && next <= max.value)
        state.request(next);
}
function sync() {
    if (control.value) {
        control.value.defaultValue = String(state.controlled ? state.value.value : state.baseline);
        control.value.value = String(state.value.value);
    }
}
watchEffect(() => { state.value.value; void nextTick(sync); });
onUpdated(sync);
useNativeReset(resetAnchor, state.reset, sync);
</script>
<template>
<div ref="root" role="group" :aria-labelledby="`${id}-label`" data-krds-component="quantity-toggle" data-krds-part="root" :data-krds-state="disabled?'disabled':state.value.value===min?'at-minimum':state.value.value===max?'at-maximum':''">
<span :id="`${id}-label`" data-krds-component="quantity-toggle" data-krds-part="label" data-krds-state="">{{label}}</span>
<button type="button" data-krds-component="quantity-toggle" data-krds-part="decrement" data-krds-state="" :aria-label="`${label} 줄이기`" :disabled="disabled" :aria-disabled="disabled||state.value.value<=min" @click="adjust(-1)">−</button>
<output data-krds-component="quantity-toggle" data-krds-part="output" data-krds-state="" aria-live="polite">{{state.value.value}}{{unit}}</output>
<button type="button" data-krds-component="quantity-toggle" data-krds-part="increment" data-krds-state="" :aria-label="`${label} 늘리기`" :disabled="disabled" :aria-disabled="disabled||state.value.value>=max" @click="adjust(1)">+</button>
<input v-if="name" ref="control" data-krds-component="quantity-toggle" data-krds-part="hidden-input" data-krds-state="" type="text" hidden readonly :name="name" :form="form" :value="state.value.value" :disabled="disabled"/>
</div>
</template>
