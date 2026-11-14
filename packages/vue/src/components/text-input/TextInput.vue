<script setup lang="ts">
import { controlContract } from '../control';
import { nextTick, ref, useId, watchEffect } from 'vue';
import type { TextInputContract } from '@unofficial-krds/contracts';
import { useOwned, useNativeReset } from '../catalog-state';
const p = defineProps<TextInputContract & {
    form?: string;
    modelValue?: string;
    placeholder?: string;
}>();
controlContract(() => ({ value: p.value, modelValue: p.modelValue, defaultValue: p.defaultValue }));
const emit = defineEmits<{
    valueChange: [
        detail: {
            value: string;
        }
    ];
    'update:modelValue': [
        value: string
    ];
}>();
const id = p.id ?? useId();
const control = ref<HTMLInputElement | HTMLTextAreaElement>();
const composing = ref(false);
const state = useOwned(() => p.modelValue ?? p.value, () => p.defaultValue, '', value => { emit('update:modelValue', value); emit('valueChange', { value }); });
const draft = ref(state.value.value);
function sync() {
    if (control.value && !composing.value) {
        control.value.defaultValue = state.controlled ? state.value.value : state.baseline;
        control.value.value = state.value.value;
        draft.value = state.value.value;
    }
}
function input(e: Event) {
    draft.value = (e.target as HTMLInputElement).value;
    if (composing.value || (e as InputEvent).isComposing)
        return;
    state.request(draft.value);
    sync();
    void nextTick(sync);
}
function end(e: Event) { composing.value = false; input(e); }
watchEffect(() => { state.value.value; void nextTick(sync); });
useNativeReset(control, () => { composing.value = false; state.reset(); }, sync);
</script>
<template>
<div data-krds-part="root" :data-krds-size="size??'medium'" :data-krds-status="status??(invalid?'error':'default')" :data-krds-state="invalid||status==='error'?'invalid':''" data-krds-component="text-input">
<label :for="id" data-krds-part="label" data-krds-component="text-input" data-krds-state="">{{label}}</label>
<input ref="control" :id="id" v-bind="$attrs" data-krds-part="control" data-krds-state="" :type="type??'text'" :autocomplete="autocomplete" :inputmode="inputMode as any" :minlength="minLength" :pattern="pattern" :value="draft" :name="name" :form="form" :disabled="disabled" :readonly="readOnly" :required="required" :maxlength="maxLength" :placeholder="placeholder" :aria-invalid="invalid||status==='error'||undefined" :aria-describedby="[helpId,invalid||status==='error'?errorId:undefined].filter(Boolean).join(' ')||undefined" @input="input" @compositionstart="composing=true" @compositionend="end" data-krds-component="text-input"/>
<button v-if="iconAction" type="button" data-krds-part="icon-action" :disabled="disabled" @click="iconAction.onAction()" data-krds-component="text-input" data-krds-state="">{{iconAction.label}}</button>
<slot name="help"/>
<slot name="error"/>
</div>
</template>
