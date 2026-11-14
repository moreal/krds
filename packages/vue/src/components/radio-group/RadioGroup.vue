<script setup lang="ts">
import { controlContract } from '../control';
import { nextTick, ref, useId, watchEffect } from 'vue';
import type { RadioGroupContract } from '@unofficial-krds/contracts';
import { useOwned, useNativeReset } from '../catalog-state';
const p = defineProps<RadioGroupContract & {
    form?: string;
    modelValue?: string | null;
}>();
controlContract(() => ({ value: p.value, modelValue: p.modelValue, defaultValue: p.defaultValue }));
const emit = defineEmits<{
    valueChange: [
        detail: {
            value: string | null;
        }
    ];
    'update:modelValue': [
        value: string | null
    ];
}>();
const state = useOwned(() => p.modelValue !== undefined ? p.modelValue : p.value, () => p.defaultValue, null, value => { emit('update:modelValue', value); emit('valueChange', { value }); });
const id = p.id ?? useId();
const root = ref<HTMLFieldSetElement>();
const control = ref<HTMLInputElement>();
function radios() { return Array.from(root.value?.querySelectorAll<HTMLInputElement>('input[type=radio]') ?? []); }
function sync() {
    for (const el of radios()) {
        el.defaultChecked = el.value === (state.controlled ? state.value.value : state.baseline);
        el.checked = el.value === state.value.value;
    }
}
function select(value: string) {
    if (!p.disabled && !p.options.find(x => x.value === value)?.disabled)
        state.request(value);
    sync();
    void nextTick(sync);
}
function key(e: KeyboardEvent, index: number) {
    if (e.isComposing || e.defaultPrevented || e.key !== 'Tab')
        return;
    const eligible = radios().filter(el => !el.disabled);
    const at = eligible.indexOf(radios()[index]!);
    const next = eligible[at + (e.shiftKey ? -1 : 1)];
    if (next) {
        e.preventDefault();
        next.focus();
    }
}
watchEffect(() => {
    const ids = p.options.map((option, index) => option.id ?? `${id}-${index}`);
    if (ids.some(value => !value.trim()) || new Set(ids).size !== ids.length)
        throw new TypeError('Radio option IDs must be nonempty and unique');
    if (new Set(p.options.map(x => x.value)).size !== p.options.length)
        throw new TypeError('Duplicate radio values');
    if (state.value.value !== null && !p.options.some(x => x.value === state.value.value))
        throw new TypeError('Unknown radio value');
    void nextTick(sync);
});
useNativeReset(control, state.reset, sync);
</script>
<template>
<fieldset :id="p.id" ref="root" data-krds-component="radio-group" data-krds-part="root" :data-krds-state="invalid?'invalid':''" :disabled="disabled" :aria-describedby="[helpId,invalid?errorId:undefined].filter(Boolean).join(' ')||undefined" :data-krds-appearance="appearance??'default'" :data-krds-size="size??'medium'">
<legend data-krds-component="radio-group" data-krds-part="legend" data-krds-state="">{{label}}</legend>
<div v-for="(option,index) in options" :key="option.value" data-krds-component="radio-group" data-krds-part="item" :data-krds-state="`${state.value.value===option.value?'checked':'unchecked'}${disabled||option.disabled?' disabled':''}`">
<input :ref="el=>{if(index===0)control=el as HTMLInputElement}" :id="option.id??`${id}-${index}`" data-krds-component="radio-group" data-krds-part="control" data-krds-state="" type="radio" :name="name??id" :form="form" :value="option.value" :checked="state.value.value===option.value" :disabled="disabled||option.disabled" :required="required" tabindex="0" @change="select(option.value)" @keydown="key($event,index)"/>
<label :for="option.id??`${id}-${index}`" data-krds-component="radio-group" data-krds-part="label" data-krds-state="">{{option.label}}<span data-krds-component="radio-group" data-krds-part="indicator" data-krds-state="" aria-hidden="true"></span></label>
</div>
<slot name="help"/>
<slot name="error"/>
</fieldset>
</template>
