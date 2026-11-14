<script setup lang="ts">
import { controlContract } from '../control';
import { nextTick, ref, useId, watchEffect } from 'vue';
import type { SwitchContract } from '@unofficial-krds/contracts';
import { useOwned, useNativeReset } from '../catalog-state';
const p = withDefaults(defineProps<SwitchContract & {
    form?: string;
    modelValue?: boolean;
}>(), { checked: undefined, modelValue: undefined, defaultChecked: undefined });
controlContract(() => ({ value: p.checked, modelValue: p.modelValue, defaultValue: p.defaultChecked }));
const emit = defineEmits<{
    checkedChange: [
        detail: {
            checked: boolean;
        }
    ];
    'update:modelValue': [
        value: boolean
    ];
}>();
const id = p.id ?? useId();
const control = ref<HTMLInputElement>();
const state = useOwned(() => p.modelValue ?? p.checked, () => p.defaultChecked, false, value => { emit('update:modelValue', value); emit('checkedChange', { checked: value }); });
function sync() {
    if (control.value) {
        control.value.defaultChecked = state.controlled ? state.value.value : state.baseline;
        control.value.checked = state.value.value;
    }
}
function change() {
    if (!p.disabled)
        state.request(control.value!.checked);
    sync();
    void nextTick(sync);
}
watchEffect(() => { state.value.value; void nextTick(sync); });
useNativeReset(control, state.reset, sync);
</script>
<template>
<div data-krds-part="root" :data-krds-state="disabled?'disabled':state.value.value?'checked':'unchecked'" :data-krds-size="size??'medium'" data-krds-component="switch">
<input ref="control" :id="id" type="checkbox" role="switch" data-krds-part="control" data-krds-state="" :checked="state.value.value" :aria-checked="state.value.value" :name="name" :form="form" :value="value??'on'" :disabled="disabled" :required="required" :aria-invalid="invalid||undefined" :aria-describedby="[helpId,invalid?errorId:undefined].filter(Boolean).join(' ')||undefined" @change="change" data-krds-component="switch"/>
<label :for="id" data-krds-part="label" data-krds-component="switch" data-krds-state="">{{label}}<span data-krds-part="track" data-krds-state="" aria-hidden="true" data-krds-component="switch">
<span data-krds-part="handle" data-krds-state="" data-krds-component="switch"/>
</span>
</label>
<slot name="help"/>
</div>
</template>
