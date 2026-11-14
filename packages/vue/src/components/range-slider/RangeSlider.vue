<script setup lang="ts">
import { controlContract } from '../control';
import { computed, nextTick, ref, useId, watchEffect } from 'vue';
import type { RangeSliderContract } from '@unofficial-krds/contracts';
import { useOwned, useNativeReset } from '../catalog-state';
const p = defineProps<RangeSliderContract & {
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
const min = computed(() => p.min ?? 0), max = computed(() => p.max ?? 100), step = computed(() => p.step ?? 10);
const state = useOwned(() => p.modelValue ?? p.value, () => p.defaultValue, min.value, value => { emit('update:modelValue', value); emit('valueChange', { value }); });
const control = ref<HTMLInputElement>();
const id = p.id ?? useId();
watchEffect(() => {
    if (!Number.isFinite(min.value) || !Number.isFinite(max.value) || min.value >= max.value || !Number.isFinite(step.value) || step.value <= 0 || !Number.isFinite(state.value.value) || Math.abs((state.value.value - min.value) / step.value - Math.round((state.value.value - min.value) / step.value)) > 1e-8 || state.value.value < min.value || state.value.value > max.value)
        throw new RangeError('Invalid slider bounds or value');
    void nextTick(sync);
});
function sync() {
    if (control.value) {
        control.value.defaultValue = String(state.controlled ? state.value.value : state.baseline);
        control.value.value = String(state.value.value);
    }
}
function input() {
    if (p.disabled)
        return;
    const raw = control.value!.valueAsNumber;
    const value = Number((Math.round((raw - min.value) / step.value) * step.value + min.value).toFixed(10));
    state.request(Math.min(max.value, Math.max(min.value, value)));
    sync();
    void nextTick(sync);
}
useNativeReset(control, state.reset, sync);
</script>
<template>
<div data-krds-component="range-slider" data-krds-part="root" :data-krds-state="disabled?'disabled':''">
<label :for="id" data-krds-component="range-slider" data-krds-part="label" data-krds-state="">{{label}}</label>
<input ref="control" data-krds-component="range-slider" data-krds-part="control" data-krds-state="" type="range" :id="id" :name="name" :form="form" :min="min" :max="max" :step="step" :value="state.value.value" :disabled="disabled" :aria-valuetext="valueText?.(state.value.value)" @input="input"/>
<output :for="id" data-krds-component="range-slider" data-krds-part="output" data-krds-state="">{{valueText?valueText(state.value.value):state.value.value}}</output>
<span data-krds-component="range-slider" data-krds-part="minimum" data-krds-state="">{{min}}</span>
<span data-krds-component="range-slider" data-krds-part="maximum" data-krds-state="">{{max}}</span>
</div>
</template>
