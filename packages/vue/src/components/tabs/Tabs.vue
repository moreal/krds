<script setup lang="ts">
import { useKrds } from '../context';
const context = useKrds();
import { controlContract, oneOf } from '../control';
import { computed, nextTick, ref, useAttrs, useId, watchEffect } from 'vue';
import type { TabItem } from '../types';
const p = withDefaults(defineProps<{
    items: TabItem[];
    value?: string;
    modelValue?: string;
    defaultValue?: string;
    label?: string;
    id?: string;
    activationMode?: 'manual' | 'automatic';
    orientation?: 'horizontal' | 'vertical';
}>(), { activationMode: 'manual', orientation: 'horizontal' });
controlContract(() => ({ value: p.value, modelValue: p.modelValue, defaultValue: p.defaultValue }));
defineOptions({ inheritAttrs: false });
const attrs = useAttrs();
const rootAttrs = computed(() => { const { 'aria-label': _label, 'aria-labelledby': _labelledby, ...rest } = attrs; return rest; });
if (!p.label && !attrs['aria-label'] && !attrs['aria-labelledby']) throw new TypeError('Tablist needs a label.');
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
const local = ref(p.defaultValue ?? p.items.find(x => !x.disabled)?.value ?? '');
const value = computed(() => p.modelValue ?? p.value ?? local.value);
const root = ref<HTMLElement>();
const panels = ref<HTMLElement[]>([]);
let focusRequest: string | null = null;
watchEffect(() => { if ([p.value,p.modelValue,p.defaultValue].some(value => value !== undefined && typeof value !== 'string') || p.items.some(item => typeof item.value !== 'string')) throw new TypeError('Tab values must be strings'); oneOf(p.activationMode, ['manual','automatic'], 'activation mode'); oneOf(p.orientation, ['horizontal','vertical'], 'orientation'); if (new Set(p.items.map(x => x.value)).size !== p.items.length || p.items.some(x => !x.value))
    throw new TypeError('Unique nonempty tab values required'); if (!p.items.some(x => x.value === value.value && !x.disabled) && !(value.value === '' && !p.items.some(x => !x.disabled)))
    throw new RangeError('Invalid selected tab'); void nextTick(() => panels.value.forEach(panel => { panel.tabIndex = panel.firstElementChild?.matches('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex="0"]') ? -1 : 0; })); });
const tabId = (index: number) => `${id}-tab-${index}`, panelId = (index: number) => `${id}-panel-${index}`;
function select(v: string) { if (v === value.value)
    return; if (p.value === undefined && p.modelValue === undefined)
    local.value = v; emit('update:modelValue', v); emit('valueChange', { value: v }); }
function focus(v: string) { if (p.activationMode === 'automatic' && v !== value.value) {
    focusRequest = v;
    select(v);
} }
function click(v: string) { if (focusRequest === v) {
    focusRequest = null;
    return;
} select(v); }
function pointer() { focusRequest = null; }
function key(e: KeyboardEvent, index: number) { focusRequest = null; const enabled = p.items.map((x, i) => !x.disabled ? i : -1).filter(x => x >= 0); let next: number | undefined; if (e.key === 'Home')
    next = enabled[0];
else if (e.key === 'End')
    next = enabled.at(-1);
else {
    const delta = e.key === (p.orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown') ? 1 : e.key === (p.orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp') ? -1 : 0;
    if (delta)
        next = enabled[(enabled.indexOf(index) + delta + enabled.length) % enabled.length];
} if (next !== undefined) {
    e.preventDefault();
    root.value?.querySelector<HTMLElement>(`#${CSS.escape(tabId(next))}`)?.focus();
} }
</script>
<template>
<div v-bind="rootAttrs" :id="id" ref="root" data-krds-component="tabs" data-krds-part="root" data-krds-state="" :dir="context.direction.value">
<div v-if="label" :id="`${id}-label`">{{label}}</div>
<div role="tablist" data-krds-component="tabs" data-krds-part="list" data-krds-state="" :data-krds-orientation="orientation" :aria-label="($attrs['aria-label'] as string|undefined)" :aria-labelledby="($attrs['aria-labelledby'] as string|undefined)??(label?`${id}-label`:undefined)" :aria-orientation="orientation">
<button v-for="(item,index) in items" :id="tabId(index)" :key="item.value" type="button" role="tab" data-krds-component="tabs" data-krds-part="trigger" :data-krds-state="[value===item.value?'selected':'',item.disabled?'disabled':''].filter(Boolean).join(' ')" :disabled="item.disabled" :tabindex="item.disabled?-1:0" :aria-selected="value===item.value" :aria-controls="panelId(index)" @pointerdown="pointer" @focus="focus(item.value)" @click="click(item.value)" @keydown="key($event,index)">
<slot name="label" :item="item">{{item.label}}</slot>
</button>
</div>
<div v-for="(item,index) in items" :id="panelId(index)" :key="item.value" :ref="(el)=>{if(el)panels[index]=el as HTMLElement}" role="tabpanel" data-krds-component="tabs" data-krds-part="panel" :data-krds-state="value===item.value?'active':'inactive'" :aria-labelledby="tabId(index)" :hidden="value!==item.value" tabindex="0">
<slot :name="item.value" :item="item" />
</div>
</div>
</template>
