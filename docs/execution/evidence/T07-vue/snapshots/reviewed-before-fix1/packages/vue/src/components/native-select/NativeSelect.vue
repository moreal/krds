<script setup lang="ts">
import { useKrds } from '../context';
const context = useKrds();
import { controlContract, oneOf } from '../control';
import { computed, nextTick, onMounted, onUnmounted, ref, useAttrs, useSlots, useId, watchEffect } from 'vue';
import type { SelectOption } from '../types';
defineOptions({ inheritAttrs: false });
const p = withDefaults(defineProps<{
    options: SelectOption[];
    value?: string;
    modelValue?: string;
    defaultValue?: string;
    id?: string;
    name?: string;
    form?: string;
    label?: string;
    hint?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    size?: 'small' | 'medium' | 'large';
}>(), { required: false, disabled: false, invalid: false, size: 'medium' });
controlContract(() => ({ value: p.value, modelValue: p.modelValue, defaultValue: p.defaultValue }));
const attrs = useAttrs(); const slots = useSlots();
if (!p.label && !slots.label && !attrs['aria-label'] && !attrs['aria-labelledby']) throw new TypeError('Select needs a label.');
const emit = defineEmits<{
    'update:modelValue': [
        value: string
    ];
    valueChange: [
        detail: {
            value: string;
        }
    ];
}>();
const id = p.id ?? useId();
const control = ref<HTMLSelectElement>();
const initial = p.defaultValue ?? p.options.find(x => !x.disabled)?.value ?? '';
const local = ref(initial);
const controlled = computed(() => p.modelValue !== undefined || p.value !== undefined);
const value = computed(() => p.modelValue ?? p.value ?? local.value);
function sync() { if (control.value)
    control.value.value = value.value; }
watchEffect(() => { if ([p.value,p.modelValue,p.defaultValue].some(value => value !== undefined && typeof value !== 'string')) throw new TypeError('Select values must be strings'); oneOf(p.size, ['small','medium','large'], 'select size'); if (p.options.some(option => typeof option.value !== 'string' || typeof option.label !== 'string')) throw new TypeError('String option values and labels required'); if (new Set(p.options.map(x => x.value)).size !== p.options.length)
    throw new TypeError('Option values must be unique'); if (value.value !== '' && !p.options.some(x => x.value === value.value))
    throw new RangeError('Unknown select value'); void nextTick(sync); });
function change(e: Event) { const next = (e.target as HTMLSelectElement).value; if (next !== value.value) {
    if (!controlled.value)
        local.value = next;
    emit('update:modelValue', next);
    emit('valueChange', { value: next });
} void nextTick(sync); }
function reset(e: Event) { queueMicrotask(() => { if (e.defaultPrevented)
    return; if (!controlled.value)
    local.value = initial; sync(); }); }
let form: HTMLFormElement | null = null;
onMounted(() => { sync(); form = control.value?.form ?? null; form?.addEventListener('reset', reset); });
onUnmounted(() => form?.removeEventListener('reset', reset));
</script>
<template>
<div data-krds-component="native-select" data-krds-part="root" :dir="context.direction.value" :data-krds-state="[disabled?'disabled':'',invalid?'invalid':''].filter(Boolean).join(' ')" :data-krds-size="size">
<label v-if="label||$slots.label" :for="id" data-krds-component="native-select" data-krds-part="label">
<slot name="label">{{label}}</slot>
</label>
<select v-bind="$attrs" :id="id" ref="control" data-krds-component="native-select" data-krds-part="control" :data-krds-size="size" :value="value" :name="name" :form="p.form" :required="required" :disabled="disabled" :aria-invalid="invalid||undefined" :aria-describedby="[hint||$slots.hint?`${id}-hint`:'',error||$slots.error?`${id}-error`:'',$attrs['aria-describedby']].filter(Boolean).join(' ')||undefined" @change="change">
<option v-for="option in options" :key="option.value" :value="option.value" :disabled="option.disabled" :selected="option.value===value">{{option.label}}</option>
</select>
<div v-if="hint||$slots.hint" :id="`${id}-hint`" data-krds-component="native-select" data-krds-part="hint">
<slot name="hint">{{hint}}</slot>
</div>
<div v-if="error||$slots.error" :id="`${id}-error`" data-krds-component="native-select" data-krds-part="error">
<slot name="error">{{error}}</slot>
</div>
</div>
</template>
