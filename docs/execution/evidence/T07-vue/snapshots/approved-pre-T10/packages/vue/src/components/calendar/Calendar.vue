<script setup lang="ts">
import { controlContract, oneOf } from '../control';
import { addDays, addMonths, calendarMonthGrid, daysInMonth, parseIsoDate, weekday } from '@unofficial-krds/contracts';
import { computed, nextTick, ref, useId, watch } from 'vue';
import { useKrds } from '../context';
import { bounds, calendarWords, copy, dictionary, empty, ends, equal, interpolate, validate } from '../date-model';
import type { CalendarTranslations, DateValue, DateMode } from '../types';
const p = withDefaults(defineProps<{
    mode?: DateMode;
    value?: DateValue;
    modelValue?: DateValue;
    defaultValue?: DateValue;
    min?: string;
    max?: string;
    disabled?: boolean;
    required?: boolean;
    locale?: 'ko-KR' | 'en-US';
    translations?: Partial<CalendarTranslations>;
    referenceDate?: string;
    today?: string;
    label?: string;
    id?: string;
}>(), { mode: 'single', disabled: false, required: false, referenceDate: '2000-01-01' });
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
    confirm: [
        detail: {
            value: DateValue;
        }
    ];
    cancel: [
    ];
}>();
const context = useKrds();
const id = p.id ?? useId();
oneOf(p.mode, ['single','range'], 'date mode');
const initialMode = p.mode;
const range = computed(() => p.mode === 'range');
const limits = computed(() => bounds(p));
const words = computed(() => { const w = dictionary(calendarWords((p.locale ?? context.locale.value) === 'en-US'), p.translations); if (w.weekdays.length !== 7 || w.weekdayLabels.length !== 7 || w.months.length !== 12)
    throw new TypeError('Complete weekday and month arrays required'); return w; });
const local = ref<DateValue>(copy(p.defaultValue ?? empty(range.value)));
const committed = computed(() => validate(p.modelValue !== undefined ? p.modelValue : p.value !== undefined ? p.value : local.value, range.value, limits.value.min, limits.value.max));
const tentative = ref<DateValue>(copy(committed.value));
function startMonth(v: DateValue) { const d = ends(v)[0] ?? p.referenceDate; return (d < limits.value.min ? limits.value.min : d > limits.value.max ? limits.value.max : d).slice(0, 7) + '-01'; }
const month = ref(startMonth(committed.value));
const root = ref<HTMLElement>();
watch(() => p.mode, () => { if (p.mode !== initialMode)
    throw new TypeError('Calendar mode is immutable'); });
watch(committed, v => { tentative.value = copy(v); month.value = startMonth(v); }, { deep: true });
const grid = computed(() => calendarMonthGrid(month.value));
const rows = computed(() => Array.from({ length: 6 }, (_, i) => grid.value.slice(i * 7, i * 7 + 7)));
const unavailable = (d: string) => p.disabled || d < limits.value.min || d > limits.value.max;
const selected = (d: string) => { const [a, b] = ends(tentative.value); return range.value ? !!a && d >= a && d <= (b ?? a) : a === d; };
function state(d: string) { const [a, b] = ends(tentative.value); return [d === p.today ? 'today' : '', selected(d) ? 'selected' : '', range.value && d === a ? 'range-start' : '', range.value && d === b ? 'range-end' : '', range.value && a && b && d > a && d < b ? 'in-range' : '', d.slice(0, 7) !== month.value.slice(0, 7) ? 'outside-month' : '', unavailable(d) ? 'disabled' : ''].filter(Boolean).join(' '); }
function fields(d: string) { const part = parseIsoDate(d)!; return { ...part, weekday: words.value.weekdays[weekday(d)]!, monthName: words.value.months[part.month - 1]! }; }
const heading = computed(() => interpolate(words.value.monthLabel, fields(month.value)));
function name(d: string) { const [a, b] = ends(tentative.value); return [interpolate(words.value.dateLabel, fields(d)), d === p.today ? words.value.today : '', selected(d) ? words.value.selected : '', unavailable(d) ? words.value.unavailable : '', d.slice(0, 7) !== month.value.slice(0, 7) ? words.value.adjacentMonth : '', range.value && d === a ? words.value.startLabel : '', range.value && d === b ? words.value.endLabel : ''].filter(Boolean).join(', '); }
function choose(d: string) { if (unavailable(d))
    return; const [a, b] = ends(tentative.value); tentative.value = range.value ? (!a || b ? { start: d, end: null } : { start: d < a ? d : a, end: d < a ? a : d }) : d; month.value = d.slice(0, 7) + '-01'; }
const complete = computed(() => { const [a, b] = ends(tentative.value); return !p.disabled && (!range.value || !!a === !!b) && (!p.required || !!a) && (!a || !unavailable(a)) && (!b || !unavailable(b)); });
function confirm() { if (!complete.value)
    return; const next = copy(tentative.value); if (!equal(next, committed.value)) {
    if (p.modelValue === undefined && p.value === undefined)
        local.value = copy(next);
    emit('update:modelValue', copy(next));
    emit('valueChange', { value: copy(next) });
} emit('confirm', { value: copy(next) }); void nextTick(() => { tentative.value = copy(committed.value); }); }
function cancel() { if (p.disabled)
    return; tentative.value = copy(committed.value); emit('cancel'); }
function canMonth(delta: number) { const target = addMonths(month.value, delta); if (!target)
    return false; const part = parseIsoDate(target)!; const last = target.slice(0, 8) + String(daysInMonth(part.year, part.month)).padStart(2, '0'); return last >= limits.value.min && target <= limits.value.max; }
function moveMonth(delta: number) { if (!p.disabled && canMonth(delta))
    month.value = addMonths(month.value, delta)!; }
async function focusDate(d: string) { month.value = d.slice(0, 7) + '-01'; await nextTick(); root.value?.querySelector<HTMLElement>(`[data-date="${d}"]`)?.focus(); }
function key(e: KeyboardEvent, d: string) { if (e.defaultPrevented || e.isComposing || e.keyCode === 229 || p.disabled)
    return; let target: string | null = null; let direction = 1; let withinMonth = false; let weekEnd: string | null = null; const delta: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }; if (e.key in delta) {
    direction = Math.sign(delta[e.key]!);
    target = addDays(d, delta[e.key]!);
}
else if (e.key === 'Home' || e.key === 'End') {
    direction = e.key === 'Home' ? 1 : -1;
    target = addDays(d, e.key === 'Home' ? -weekday(d) : 6 - weekday(d));
    weekEnd = d;
}
else if (e.key === 'PageUp' || e.key === 'PageDown') {
    direction = e.key === 'PageUp' ? -1 : 1;
    target = addMonths(d, direction * (e.shiftKey ? 12 : 1));
    withinMonth = true;
}
else
    return; e.preventDefault(); const monthKey = target?.slice(0, 7); while (target && unavailable(target)) {
    if (target < limits.value.min && direction < 0 || target > limits.value.max && direction > 0)
        return;
    target = addDays(target, direction);
    if (withinMonth && target?.slice(0, 7) !== monthKey)
        return;
    if (weekEnd && target && (direction > 0 ? target > weekEnd : target < weekEnd))
        return;
} if (target)
    void focusDate(target); }
function today() { if (p.today && !unavailable(p.today))
    void focusDate(p.today); }
defineExpose({ focusInitial: async () => { await nextTick(); const selected = root.value?.querySelector<HTMLElement>('button[data-date][aria-pressed="true"]:not(:disabled)'); const first = root.value?.querySelector<HTMLElement>('button[data-date]:not([data-krds-state*="outside-month"]):not(:disabled)'); (selected ?? first ?? root.value?.querySelector<HTMLElement>('button:not(:disabled)'))?.focus(); } });
</script>
<template>
<section :id="id" ref="root" data-krds-component="calendar" data-krds-part="root" :aria-label="label" :dir="context.direction.value">
<header data-krds-component="calendar" data-krds-part="header">
<button type="button" data-krds-component="calendar" data-krds-part="previous" :disabled="disabled||!canMonth(-1)" :aria-label="words.previousMonth" @click="moveMonth(-1)">‹</button>
<h2 :id="`${id}-heading`" data-krds-component="calendar" data-krds-part="heading" aria-live="polite">{{heading}}</h2>
<button type="button" data-krds-component="calendar" data-krds-part="next" :disabled="disabled||!canMonth(1)" :aria-label="words.nextMonth" @click="moveMonth(1)">›</button>
</header>
<div data-krds-component="calendar" data-krds-internal="table-scroll">
<table data-krds-component="calendar" data-krds-part="table" :aria-labelledby="`${id}-heading`">
<thead>
<tr>
<th v-for="(day,index) in words.weekdayLabels" :key="index" scope="col" data-krds-component="calendar" data-krds-part="weekday" :aria-label="words.weekdays[index]">{{day}}</th>
</tr>
</thead>
<tbody>
<tr v-for="(week,index) in rows" :key="index">
<td v-for="(day,column) in week" :key="column" data-krds-component="calendar" data-krds-part="cell">
<button v-if="day" type="button" data-krds-component="calendar" data-krds-part="day" :data-date="day" :data-krds-state="state(day)" :disabled="unavailable(day)" :aria-label="name(day)" :aria-current="day===p.today?'date':undefined" :aria-pressed="selected(day)" @click="choose(day)" @keydown="key($event,day)">{{interpolate(words.visibleDayLabel,fields(day))}}</button>
</td>
</tr>
</tbody>
</table>
</div>
<footer data-krds-component="calendar" data-krds-part="footer">
<button v-if="p.today" type="button" data-krds-component="calendar" data-krds-part="today" :disabled="disabled||unavailable(p.today)" @click="today">{{words.today}}</button>
<button v-if="!required" type="button" data-krds-component="calendar" data-krds-part="clear" :disabled="disabled" @click="tentative=empty(range)">{{words.clear}}</button>
<button type="button" data-krds-component="calendar" data-krds-part="cancel" :disabled="disabled" @click="cancel">{{words.cancel}}</button>
<button type="button" data-krds-component="calendar" data-krds-part="confirm" :disabled="!complete" @click="confirm">{{words.confirm}}</button>
</footer>
</section>
</template>
