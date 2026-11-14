<script setup lang="ts">
import { controlContract, oneOf } from '../control';
import { computed, nextTick, onMounted, onUnmounted, ref, useId, useSlots, watch } from 'vue';
import { parseIsoDate } from '@unofficial-krds/contracts';
import Modal from '../modal/Modal.vue';
import Calendar from '../calendar/Calendar.vue';
import { useKrds } from '../context';
import { bounds, copy, dateWords, dictionary, empty, ends, equal, interpolate, validate } from '../date-model';
import type { DateInputTranslations, CalendarTranslations, DateMode, DateValue } from '../types';
const p = withDefaults(defineProps<{
    mode?: DateMode;
    value?: DateValue;
    modelValue?: DateValue;
    defaultValue?: DateValue;
    id?: string;
    name?: string;
    form?: string;
    autocomplete?: string;
    label?: string;
    hint?: string;
    error?: string;
    invalid?: boolean;
    required?: boolean;
    disabled?: boolean;
    min?: string;
    max?: string;
    locale?: 'ko-KR' | 'en-US';
    translations?: Partial<DateInputTranslations>;
    calendarTranslations?: Partial<CalendarTranslations>;
    withCalendar?: boolean;
    referenceDate?: string;
    today?: string;
}>(), { mode: 'single', required: false, disabled: false, withCalendar: true, referenceDate: '2000-01-01' });
controlContract(() => ({ value: p.value, modelValue: p.modelValue, defaultValue: p.defaultValue }));
const emit = defineEmits<{
    'update:modelValue': [
        value: DateValue
    ];
    valueChange: [
        detail: {
            value: DateValue;
        }
    ];
}>();
const context = useKrds();
const slots = useSlots();
if (!p.label && !slots.label) throw new TypeError('DateInput needs a task-specific label.');
const canonicalInputs = ref<HTMLInputElement[]>([]);
const id = p.id ?? useId();
oneOf(p.mode, ['single','range'], 'date mode');
const firstMode = p.mode;
const range = computed(() => p.mode === 'range');
const limits = computed(() => bounds(p));
const words = computed(() => dictionary(dateWords((p.locale ?? context.locale.value) === 'en-US'), p.translations));
const baseline = copy(p.defaultValue ?? empty(range.value));
const local = ref<DateValue>(copy(baseline));
const controlled = computed(() => p.value !== undefined || p.modelValue !== undefined);
const committed = computed(() => validate(p.modelValue !== undefined ? p.modelValue : p.value !== undefined ? p.value : local.value, range.value, limits.value.min, limits.value.max));
const raw = ref<[
    string,
    string
]>(['', '']);
const error = ref('');
// Field index the current draft error belongs to; undefined marks every field.
const errorField = ref<number | undefined>();
const composing = ref(false);
const popup = ref(false);
const root = ref<HTMLElement>();
const fields = ref<HTMLInputElement[]>([]);
const calendar = ref<InstanceType<typeof Calendar>>();
function display() { const [a, b] = ends(committed.value); raw.value = [a ?? '', b ?? '']; error.value = ''; errorField.value = undefined; validity(); }
watch(committed, display, { deep: true, immediate: true });
watch(() => p.mode, () => { if (p.mode !== firstMode)
    throw new TypeError('DateInput mode is immutable'); });
watch(() => p.disabled, disabled => { if (disabled)
    popup.value = false; });
function parsed(): { value?: DateValue; error: string; index?: number } {
  const [start, end] = raw.value;
  const wordsForDate = words.value;
  if (!start && (!range.value || !end)) {
    return p.required ? { error: wordsForDate.requiredError, index: 0 } : { value: empty(range.value), error: '' };
  }
  if (start && !parseIsoDate(start)) return { error: wordsForDate.formatError, index: 0 };
  if (range.value && end && !parseIsoDate(end)) return { error: wordsForDate.formatError, index: 1 };
  if (range.value && (!start || !end)) return { error: wordsForDate.incompleteRangeError, index: start ? 1 : 0 };
  if (range.value && start > end) return { error: wordsForDate.orderError };
  for (const [index, date] of (range.value ? [start, end] : [start]).entries()) {
    if (date < limits.value.min) return { error: interpolate(wordsForDate.minError, { min: limits.value.min }), index };
    if (date > limits.value.max) return { error: interpolate(wordsForDate.maxError, { max: limits.value.max }), index };
  }
  return { value: range.value ? { start, end } : start, error: '' };
}
function validity() {
  if (composing.value) return;
  const result = parsed();
  fields.value.forEach((field, index) => field?.setCustomValidity(result.index === undefined || result.index === index ? result.error : ''));
}
function syncCanonical(value: DateValue) {
  const [start, end] = ends(value);
  if (canonicalInputs.value[0]) canonicalInputs.value[0].value = start ?? '';
  if (canonicalInputs.value[1]) canonicalInputs.value[1].value = end ?? '';
}
function change(index: number, e: Event) { raw.value[index] = (e.target as HTMLInputElement).value; validity(); }
function notify(value: DateValue) { if (equal(value, committed.value))
    return; if (!controlled.value)
    local.value = copy(value); emit('update:modelValue', copy(value)); emit('valueChange', { value: copy(value) }); }
async function commit() { if (p.disabled || composing.value)
    return false; const result = parsed(); error.value = result.error; errorField.value = result.index; if (result.error) {
    validity();
    return false;
} const next = result.value!; notify(next); await nextTick(); const accepted = equal(next, committed.value); display(); return accepted; }
function key(e: KeyboardEvent) { if (e.key === 'Enter' && !e.isComposing && e.keyCode !== 229 && !composing.value) {
    e.preventDefault();
    void commit();
} }
function blur() { queueMicrotask(() => { const active = context.document()?.activeElement; if (!composing.value && !root.value?.contains(active ?? null) && !popup.value)
    void commit(); }); }
function compositionEnd(index: number, e: CompositionEvent) { raw.value[index] = (e.target as HTMLInputElement).value; composing.value = false; }
async function open() { if (p.disabled || composing.value)
    return; popup.value = true; await nextTick(); await calendar.value?.focusInitial(); }
function confirmed(detail: {
    value: DateValue;
}) { notify(detail.value); popup.value = false; void nextTick(display); }
const pendingResets = new Set<ReturnType<typeof setTimeout>>();
function reset(event: Event) {
  if (event.target !== fields.value[0]?.form) return;
  const timer = setTimeout(() => {
    pendingResets.delete(timer);
    if (event.defaultPrevented || event.target !== fields.value[0]?.form) return;
    if (!controlled.value) local.value = copy(baseline);
    popup.value = false;
    display();
  }, 0);
  pendingResets.add(timer);
}
function submit(event: Event) {
  if (event.target !== fields.value[0]?.form || p.disabled) return;
  const result = parsed();
  if (result.error || result.value === undefined) {
    event.preventDefault();
    error.value = result.error;
    errorField.value = result.index;
    validity();
    fields.value[result.index ?? 0]?.reportValidity();
    return;
  }
  if (!equal(result.value, committed.value)) {
    notify(result.value);
    if (!controlled.value) syncCanonical(result.value);
    if (controlled.value) {
      event.preventDefault();
      void nextTick(display);
    }
  }
}
function beforeInvalid() { if (!composing.value) {
    const result = parsed();
    error.value = result.error;
    errorField.value = result.index;
} }
let ownerDocument: Document | null = null;
onMounted(() => {
  display();
  ownerDocument = fields.value[0]?.ownerDocument ?? null;
  // Filter each native event against the current owner, including external form reassociation.
  ownerDocument?.addEventListener('reset', reset, true);
  ownerDocument?.addEventListener('submit', submit, true);
});
onUnmounted(() => {
  ownerDocument?.removeEventListener('reset', reset, true);
  ownerDocument?.removeEventListener('submit', submit, true);
  for (const timer of pendingResets) clearTimeout(timer);
  pendingResets.clear();
});
const bad = computed(() => !!error.value || !!p.error || !!slots.error || !!p.invalid);
const described = computed(() => `${id}-hint${bad.value ? ` ${id}-error` : ''}`);
function fieldBad(index: number) { return !!p.invalid || !!p.error || !!slots.error || !!error.value && (errorField.value === undefined || errorField.value === index); }
const canonical = computed(() => ends(committed.value));
</script>
<template>
<component :is="range?'fieldset':'div'" ref="root" data-krds-component="date-input" data-krds-part="root" :dir="context.direction.value" :data-krds-state="[disabled?'disabled':'',bad?'invalid':''].filter(Boolean).join(' ')" @focusout="blur">
<legend v-if="range" :id="`${id}-label`" data-krds-component="date-input" data-krds-part="label" data-krds-state="">
<slot name="label">{{label}}</slot>
</legend>
<label v-else :for="`${id}-input`" data-krds-component="date-input" data-krds-part="label" data-krds-state="">
<slot name="label">{{label}}</slot>
</label>
<template v-for="index in range?[0,1]:[0]" :key="index">
<label v-if="range" :for="`${id}-${index}`" data-krds-component="date-input" data-krds-part="label" data-krds-state="">{{index===0?words.startLabel:words.endLabel}}</label>
<input :id="range?`${id}-${index}`:`${id}-input`" :ref="(el)=>{if(el)fields[index]=el as HTMLInputElement}" type="text" inputmode="numeric" :data-krds-state="[disabled?'disabled':'',fieldBad(index)?'invalid':''].filter(Boolean).join(' ')" data-krds-component="date-input" :data-krds-part="range?(index===0?'start-input':'end-input'):'control'" :value="raw[index]" :form="p.form" :autocomplete="autocomplete" :required="required" :disabled="disabled" placeholder="YYYY-MM-DD" :aria-describedby="described" :aria-invalid="fieldBad(index)?'true':undefined" @input="change(index,$event)" @keydown="key" @compositionstart="composing=true" @compositionend="compositionEnd(index,$event)" @invalid="beforeInvalid" />
</template>
<button v-if="withCalendar" :id="`${id}-trigger`" type="button" data-krds-component="date-input" data-krds-part="trigger" :data-krds-state="popup?'open':'closed'" :disabled="disabled" aria-haspopup="dialog" :aria-expanded="popup" :aria-controls="`${id}-popup`" :aria-label="range?undefined:words.openCalendar" :aria-labelledby="range?`${id}-label ${id}-trigger-label`:undefined" @click="open"><span :id="`${id}-trigger-label`">{{words.openCalendar}}</span></button>
<span :id="`${id}-hint`" data-krds-component="date-input" data-krds-part="hint" data-krds-state="">
<slot name="hint">{{hint??words.formatHint}}</slot>
</span>
<span :id="`${id}-error`" role="status" aria-live="polite" aria-atomic="true" data-krds-component="date-input" data-krds-part="error" data-krds-state="">
<slot name="error">{{error||p.error}}</slot>
</span>
<template v-if="name">
<input :ref="(el)=>{if(el)canonicalInputs[0]=el as HTMLInputElement}" type="hidden" :name="range?`${name}.start`:name" :value="canonical[0]??''" :form="p.form" :disabled="disabled" />
<input v-if="range" :ref="(el)=>{if(el)canonicalInputs[1]=el as HTMLInputElement}" type="hidden" :name="`${name}.end`" :value="canonical[1]??''" :form="p.form" :disabled="disabled" />
</template>
<Modal :id="`${id}-popup`" :open="popup" :title="words.calendarTitle" :return-focus-id="`${id}-trigger`" @open-change="popup=$event.open">
<Calendar ref="calendar" :mode="mode" :value="committed" :required="required" :disabled="disabled" :min="min" :max="max" :locale="locale" :translations="calendarTranslations" :reference-date="referenceDate" :today="today" @confirm="confirmed" @cancel="popup=false" />
</Modal>
</component>
</template>
