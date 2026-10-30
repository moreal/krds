<script setup lang="ts">
import { controlContract } from '../control';
import { computed, nextTick, ref, useId, watchEffect } from 'vue';
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
const focused = ref(false);
const state = useOwned(() => p.modelValue ?? p.value, () => p.defaultValue, '', value => { emit('update:modelValue', value); emit('valueChange', { value }); });
const draft = ref(state.value.value);
const tokens = computed(() => [p.disabled ? 'disabled' : '', p.readOnly ? 'readonly' : '', p.invalid || p.status === 'error' ? 'invalid' : '', p.status === 'success' ? 'success' : '', focused.value ? 'focused' : ''].filter(Boolean).join(' '));
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
<div data-krds-part="root" :data-krds-status="invalid?'error':status??'default'" :data-krds-size="size??'medium'" :data-krds-state="tokens" data-krds-component="text-input">
<label :for="id" data-krds-part="label" data-krds-component="text-input" data-krds-state="">{{label}}</label>
<input ref="control" :id="id" v-bind="$attrs" data-krds-part="control" :data-krds-size="size??'medium'" :data-krds-state="tokens" :type="type??'text'" :autocomplete="autocomplete" :inputmode="inputMode as any" :minlength="minLength" :pattern="pattern" :value="draft" :name="name" :form="form" :disabled="disabled" :readonly="readOnly" :required="required" :maxlength="maxLength" :placeholder="placeholder" :aria-invalid="invalid||status==='error'||undefined" :aria-describedby="[helpId,errorId,maxLength!==undefined?`${id}-count`:''].filter(Boolean).join(' ')||undefined" @input="input" @compositionstart="composing=true" @compositionend="end" @focus="focused=true" @blur="focused=false" data-krds-component="text-input"/>
<button v-if="iconAction" type="button" data-krds-part="icon-action" :disabled="disabled" @click="iconAction.onAction()" data-krds-component="text-input" data-krds-state="">{{iconAction.label}}</button>
<span v-if="maxLength!==undefined" :id="`${id}-count`" data-krds-part="help" data-krds-component="text-input" data-krds-state="">{{draft.length}} / {{maxLength}}</span>
<slot name="help"/>
<slot name="error"/>
</div>
</template>
