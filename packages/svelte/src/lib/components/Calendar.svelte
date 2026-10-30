<script lang="ts">
import {controlOwnership} from './control-ownership.svelte.js';
const generatedId = $props.id();
import { tick, untrack } from 'svelte';
import { parseIsoDate, formatIsoDate, calendarMonthGrid, addDays, addMonths, weekday, daysInMonth } from '@unofficial-krds/contracts';
import type { CalendarProps, DateValue } from './types.js';
import { bounds, empty, equal, texts, validateValue, calendarDictionary, template } from './date-utils.js';
import { context } from './context.js';
const provider = context();
let { mode = 'single', value, defaultValue, onValueChange, onConfirm, onCancel, min, max, disabled = false, locale, translations, referenceDate = '2000-01-01', today, label, 'aria-label': ariaLabel, 'aria-labelledby': labelledby, required = false, id = generatedId }: CalendarProps = $props();
const ownership=controlOwnership(()=>value,untrack(()=>defaultValue),'Calendar');
const initialMode = untrack(() => mode);
let local = $state<DateValue>(untrack(() => defaultValue ?? empty(mode)));
let committed = $derived(ownership.read() === undefined ? local : value!);
let tentative = $state<DateValue>(untrack(() => committed));
let view = $state(untrack(() => referenceDate));
let root = $state<HTMLElement>()!;
let t = $derived(calendarDictionary(locale ?? provider.locale ?? 'ko-KR', translations));
let grid = $derived(calendarMonthGrid(view));
let parts = $derived(parseIsoDate(view)!);
let month = $derived(view.slice(0, 7));
function viewFor(v: DateValue) {
    let date = texts(v)[0] || referenceDate;
    if (max && date.slice(0, 7) > max.slice(0, 7))
        date = max;
    if (min && date.slice(0, 7) < min.slice(0, 7))
        date = min;
    return date;
}
$effect(() => {
    if (mode !== initialMode)
        throw new TypeError('Calendar mode is immutable');
    bounds(min, max, referenceDate, today);
    validateValue(mode, committed, min, max);
    tentative = typeof committed === 'object' && committed !== null ? { ...committed } : committed;
    view = viewFor(committed);
});
const enabled = (date: string | null): date is string => Boolean(date && !disabled && (!min || date >= min) && (!max || date <= max));
function selected(date: string) {
    const [a, b] = texts(tentative);
    return mode === 'single' ? a === date : Boolean(a && b ? date >= a && date <= b : date === a);
}
function dayState(date: string) {
    const [a, b] = texts(tentative);
    return [date === today ? 'today' : '', selected(date) ? 'selected' : '', mode === 'range' && date === a ? 'range-start' : '', mode === 'range' && date === b ? 'range-end' : '', mode === 'range' && a && b && date > a && date < b ? 'in-range' : '', date.slice(0, 7) !== month ? 'outside-month' : '', !enabled(date) ? 'disabled' : ''].filter(Boolean).join(' ');
}
function replace(text: string, date: string) {
    const p = parseIsoDate(date)!;
    return template(text, { year: p.year, month: p.month, day: p.day, weekday: t.weekdays[weekday(date)], monthName: t.months[p.month - 1] });
}
function name(date: string) {
    const [a, b] = texts(tentative);
    return [replace(t.dateLabel, date), date === today ? t.today : '', selected(date) ? t.selected : '', !enabled(date) ? t.unavailable : '', date.slice(0, 7) !== month ? t.adjacentMonth : '', mode === 'range' && date === a ? t.startLabel : '', mode === 'range' && date === b ? t.endLabel : ''].filter(Boolean).join(', ');
}
function select(date: string) {
    if (!enabled(date))
        return;
    if (mode === 'single')
        tentative = date;
    else {
        const [a, b] = texts(tentative);
        tentative = !a || b ? { start: date, end: null } : date < a ? { start: date, end: a } : { start: a, end: date };
    }
    if (date.slice(0, 7) !== month)
        view = date;
}
function canMonth(delta: number) {
    const target = addMonths(view, delta);
    if (!target)
        return false;
    const p = parseIsoDate(target)!;
    const first = formatIsoDate({ ...p, day: 1 });
    const last = formatIsoDate({ ...p, day: daysInMonth(p.year, p.month) });
    return !disabled && (!min || last >= min) && (!max || first <= max);
}
function navigate(delta: number) {
    if (canMonth(delta))
        view = addMonths(view, delta)!;
}
async function focus(date: string) {
    view = date;
    await tick();
    root.querySelector<HTMLButtonElement>(`[data-date="${date}"]`)?.focus();
}
function key(event: KeyboardEvent, date: string) {
    if (event.isComposing || event.keyCode === 229 || disabled)
        return;
    let target: string | null = null;
    let direction = 1;
    let limitStart = min ?? '0001-01-01';
    let limitEnd = max ?? '9999-12-31';
    const wd = weekday(date);
    switch (event.key) {
        case 'ArrowLeft':
            direction = -1;
            target = addDays(date, -1);
            break;
        case 'ArrowRight':
            target = addDays(date, 1);
            break;
        case 'ArrowUp':
            direction = -1;
            target = addDays(date, -7);
            break;
        case 'ArrowDown':
            target = addDays(date, 7);
            break;
        case 'Home':
            direction = 1;
            target = addDays(date, -wd);
            limitEnd = addDays(date, 6 - wd) ?? limitEnd;
            break;
        case 'End':
            direction = -1;
            target = addDays(date, 6 - wd);
            limitStart = addDays(date, -wd) ?? limitStart;
            break;
        case 'PageUp':
        case 'PageDown':
            direction = event.key === 'PageUp' ? -1 : 1;
            target = addMonths(date, direction * (event.shiftKey ? 12 : 1));
            if (target) {
                const p = parseIsoDate(target)!;
                limitStart = formatIsoDate({ ...p, day: 1 });
                limitEnd = formatIsoDate({ ...p, day: daysInMonth(p.year, p.month) });
            }
            break;
        default: return;
    }
    event.preventDefault();
    if (target && direction > 0 && target < limitStart)
        target = limitStart;
    if (target && direction < 0 && target > limitEnd)
        target = limitEnd;
    while (target && target >= limitStart && target <= limitEnd) {
        if (enabled(target)) {
            void focus(target);
            return;
        }
        target = addDays(target, direction);
    }
}
let valid = $derived.by(() => {
    try {
        validateValue(mode, tentative, min, max);
        return !required || Boolean(texts(tentative)[0]);
    }
    catch {
        return false;
    }
});
async function confirm() {
    if (disabled || !valid)
        return;
    const next = typeof tentative === 'object' && tentative !== null ? { ...tentative } : tentative;
    if (!equal(next, committed)) {
        if (value === undefined)
            local = next;
        onValueChange?.({ value: next });
    }
    onConfirm?.({ value: next });
    await tick();
    tentative = typeof committed === 'object' && committed !== null ? { ...committed } : committed;
}
function cancel() {
    if (disabled)
        return;
    tentative = typeof committed === 'object' && committed !== null ? { ...committed } : committed;
    onCancel?.();
}
</script>
<section dir={provider.direction} lang={(locale??provider.locale??'ko-KR').slice(0,2)} bind:this={root!} aria-label={ariaLabel??label} aria-labelledby={labelledby} data-krds-component="calendar" data-krds-part="root">
 <div data-krds-component="calendar" data-krds-part="header">
  <button type="button" disabled={!canMonth(-1)} onclick={()=>navigate(-1)} data-krds-component="calendar" data-krds-part="previous">{t.previousMonth}</button>
  <h2 id={`${id}-heading`} aria-live="polite" data-krds-component="calendar" data-krds-part="heading">{replace(t.monthLabel,view)}</h2>
  <button type="button" disabled={!canMonth(1)} onclick={()=>navigate(1)} data-krds-component="calendar" data-krds-part="next">{t.nextMonth}</button>
 </div>
 <div data-krds-component="calendar" data-krds-internal="table-scroll">
<table aria-labelledby={`${id}-heading`} data-krds-component="calendar" data-krds-part="table">
  <thead>
<tr>{#each t.weekdays as day,index}
<th scope="col" aria-label={day} data-krds-component="calendar" data-krds-part="weekday">{(locale??provider.locale??'ko-KR')==='ko-KR'?day.slice(0,1):day.slice(0,3)}</th>{/each}
</tr>
</thead>
  <tbody>{#each [0,1,2,3,4,5] as row}
<tr>{#each grid.slice(row*7,row*7+7) as date}
<td data-krds-component="calendar" data-krds-part="cell">{#if date}
<button type="button" data-date={date} disabled={!enabled(date)} aria-label={name(date)} aria-current={date===today?'date':undefined} aria-pressed={selected(date)} data-krds-component="calendar" data-krds-part="day" data-krds-state={dayState(date)} onclick={()=>select(date)} onkeydown={event=>key(event,date)}>{replace(t.visibleDayLabel,date)}</button>{/if}
</td>{/each}
</tr>{/each}
</tbody>
 </table>
</div>
 <div data-krds-component="calendar" data-krds-part="footer">
  {#if today}
<button type="button" disabled={!enabled(today)} onclick={()=>today&&focus(today)} data-krds-component="calendar" data-krds-part="today">{t.today}</button>{/if}
  {#if !required}
<button type="button" {disabled} onclick={()=>{if(!disabled)tentative=empty(mode);}} data-krds-component="calendar" data-krds-part="clear">{t.clear}</button>{/if}
  <button type="button" {disabled} onclick={cancel} data-krds-component="calendar" data-krds-part="cancel">{t.cancel}</button>
  <button type="button" disabled={disabled||!valid} onclick={confirm} data-krds-component="calendar" data-krds-part="confirm">{t.confirm}</button>
 </div>
</section>
