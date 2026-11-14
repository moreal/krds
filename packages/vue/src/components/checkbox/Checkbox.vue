<script setup lang="ts">
import { controlContract } from '../control';
import { computed, nextTick, ref, useId, watchEffect } from 'vue';
import type { CheckboxContract } from '@unofficial-krds/contracts';
import { useOwned, useNativeReset } from '../catalog-state';
const p = withDefaults(defineProps<CheckboxContract & {
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
const state = useOwned(() => p.modelValue ?? p.checked, () => p.defaultChecked, false, value => { emit('update:modelValue', value); emit('checkedChange', { checked: value }); });
const control = ref<HTMLInputElement>();
const id = p.id ?? useId();
const mark = computed(() => p.indeterminate ? 'mixed' : state.value.value ? 'checked' : 'unchecked');
const tokens = computed(() => p.disabled ? 'disabled' : mark.value);
function sync() {
    if (control.value) {
        control.value.defaultChecked = state.controlled ? state.value.value : state.baseline;
        control.value.checked = state.value.value;
        control.value.indeterminate = p.indeterminate ?? false;
    }
}
function change() {
    if (!p.disabled)
        state.request(control.value!.checked);
    sync();
    void nextTick(sync);
}
watchEffect(() => { state.value.value; p.indeterminate; void nextTick(sync); });
useNativeReset(control, state.reset, sync);
</script>
<template>
<div data-krds-part="root" :data-krds-state="tokens" :data-krds-appearance="appearance??'default'" :data-krds-size="size??'medium'" data-krds-component="checkbox">
<input :id="id" ref="control" type="checkbox" data-krds-part="control" data-krds-state="" :checked="state.value.value" :name="name" :form="form" :value="value??'on'" :disabled="disabled" :required="required" :aria-invalid="invalid||undefined" :aria-describedby="[helpId,invalid?errorId:undefined].filter(Boolean).join(' ')||undefined" @change="change" data-krds-component="checkbox"/>
<label :for="id" data-krds-part="label" data-krds-component="checkbox" data-krds-state=""><slot>{{label}}</slot><span data-krds-part="indicator" :data-krds-state="mark" aria-hidden="true" data-krds-component="checkbox"></span></label>
<slot name="help"/>
<slot name="error"/>
</div>
</template>
