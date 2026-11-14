import { useKrdsEnvironment } from '../../providers';
import { $, component$, useComputed$, useId, useOnDocument, useSignal, useTask$, type JSXChildren, type QRL } from '@builder.io/qwik';
import { calendarMonthGrid, parseIsoDate } from '@unofficial-krds/contracts';
import type { ValueChangeDetails } from '@unofficial-krds/contracts';
import { attrs, controlMode, copyValue, dateConfig, emptyValue, endpoints, interpolate, sameValue, validateValue, type DateValue, type Locale } from '../../internal/behavior';
import { initializeKeyboardBoundary, preventCalendarNavigation } from '../../internal/event-props';
import { calendarTranslations, dayName, dayState, initialMonth, monthTarget, navigationTarget, selectedDate, type CalendarTranslations } from './model';
export type { CalendarTranslations } from './model';
export interface CalendarProps {
    id?: string;
    mode?: 'single' | 'range';
    value?: DateValue;
    defaultValue?: DateValue;
    onValueChange$?: QRL<(details: ValueChangeDetails<DateValue>) => void>;
    onConfirm$?: QRL<(details: ValueChangeDetails<DateValue>) => void>;
    onCancel$?: QRL<() => void>;
    label?: JSXChildren;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    min?: string;
    max?: string;
    disabled?: boolean;
    required?: boolean;
    locale?: Locale;
    translations?: Partial<CalendarTranslations>;
    referenceDate?: string;
    today?: string;
}
export const Calendar = component$<CalendarProps>((props) => {
    const environment = useKrdsEnvironment();
    useOnDocument('qinit', initializeKeyboardBoundary);
    const generated = useId(), id = props.id ?? `krds-calendar-${generated}`, range = props.mode === 'range', controlled = props.value !== undefined;
    controlMode(props.value, props.defaultValue, controlled);
    if (props.mode !== undefined && !['single', 'range'].includes(props.mode))
        throw new TypeError('Invalid date mode');
    if (!props.label && !props['aria-label'] && !props['aria-labelledby'])
        throw new TypeError('Calendar requires a label');
    const config = useComputed$(() => dateConfig(props));
    const initial = copyValue(validateValue(props.value !== undefined ? props.value : (props.defaultValue !== undefined ? props.defaultValue : emptyValue(range)), range, config.value.min, config.value.max));
    const internal = useSignal<DateValue>(initial), draft = useSignal<DateValue>(copyValue(initial)), month = useSignal(initialMonth(initial, config.value));
    const committed = useComputed$(() => {
        controlMode(props.value, props.defaultValue, controlled);
        if ((props.mode === 'range') !== range)
            throw new TypeError('Date mode is immutable');
        return validateValue(controlled ? props.value! : internal.value, range, config.value.min, config.value.max);
    });
    const t = useComputed$(() => calendarTranslations(props.locale ?? environment.locale, props.translations));
    useTask$(({ track }) => { const value = track(() => committed.value); draft.value = copyValue(value); month.value = initialMonth(value, config.value); });
    const focusDate = $(async (date: string) => { month.value = `${date.slice(0, 7)}-01`; await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))); document.getElementById(id)?.querySelector<HTMLButtonElement>(`[data-date="${date}"]`)?.focus(); });
    const activate = $(async (date: string) => {
        if (props.disabled || date < config.value.min || date > config.value.max)
            return;
        if (!range)
            draft.value = date;
        else {
            const [start, end] = endpoints(draft.value);
            draft.value = !start || end ? { start: date, end: null } : { start: date < start ? date : start, end: date > start ? date : start };
        }
        if (date.slice(0, 7) !== month.value.slice(0, 7))
            await focusDate(date);
    });
    const keydown = $(async (event: KeyboardEvent, element: HTMLButtonElement) => {
        if (props.disabled || event.isComposing || event.keyCode === 229 || event.ctrlKey || event.metaKey || event.altKey)
            return;
        const target = navigationTarget(element.dataset.date!, event.key, event.shiftKey, config.value.min, config.value.max);
        if (target)
            await focusDate(target);
    });
    const canConfirm = useComputed$(() => { const [start, end] = endpoints(draft.value); return !props.disabled && (start === null ? !props.required : start >= config.value.min && start <= config.value.max && (!range || end !== null && end >= config.value.min && end <= config.value.max)); });
    const confirm = $(async () => {
        if (!canConfirm.value)
            return;
        const value = copyValue(draft.value);
        if (!sameValue(value, committed.value)) {
            if (!controlled)
                internal.value = copyValue(value);
            await props.onValueChange$?.({ value: copyValue(value) });
        }
        await props.onConfirm$?.({ value: copyValue(value) });
        if (controlled) {
            draft.value = copyValue(committed.value);
            month.value = initialMonth(committed.value, config.value);
        }
    });
    const grid = calendarMonthGrid(month.value), parts = parseIsoDate(month.value)!, heading = interpolate(t.value.monthLabel, { ...parts, monthName: t.value.months[parts.month - 1] });
    const previous = monthTarget(month.value, -1, config.value.min, config.value.max), next = monthTarget(month.value, 1, config.value.min, config.value.max);
    const dayOptions = { draft: draft.value, range, month: month.value, today: props.today, disabled: props.disabled, min: config.value.min, max: config.value.max };
    return <div id={id} dir={environment.direction} role="group" aria-label={props['aria-label']} aria-labelledby={props['aria-labelledby'] ?? (props.label ? `${id}-label` : undefined)} {...attrs('calendar', 'root')}>
  {props.label && <div id={`${id}-label`}>{props.label}</div>}
  <div {...attrs('calendar', 'header')}>
   <button type="button" tabIndex={0} aria-label={t.value.previousMonth} disabled={props.disabled || !previous} {...attrs('calendar', 'previous', props.disabled || !previous ? 'disabled' : '')} onClick$={() => {
            const target = monthTarget(month.value, -1, config.value.min, config.value.max);
            if (!props.disabled && target)
                month.value = target;
        }}>‹</button>
   <h2 id={`${id}-heading`} aria-live="polite" aria-atomic="true" {...attrs('calendar', 'heading')}>{heading}</h2>
   <button type="button" tabIndex={0} aria-label={t.value.nextMonth} disabled={props.disabled || !next} {...attrs('calendar', 'next', props.disabled || !next ? 'disabled' : '')} onClick$={() => {
            const target = monthTarget(month.value, 1, config.value.min, config.value.max);
            if (!props.disabled && target)
                month.value = target;
        }}>›</button>
  </div>
  <div data-krds-component="calendar" data-krds-internal="table-scroll" role="region" aria-labelledby={`${id}-heading`} tabIndex={0}>
   <table aria-labelledby={`${id}-heading`} {...attrs('calendar', 'table')}><thead><tr>{t.value.weekdays.map((name, index) => <th key={index} scope="col" aria-label={name} {...attrs('calendar', 'weekday')}>{t.value.weekdayShort[index]}</th>)}</tr></thead>
    <tbody>{[0, 1, 2, 3, 4, 5].map(row => <tr key={row}>{grid.slice(row * 7, row * 7 + 7).map((date, column) => <td key={column} {...attrs('calendar', 'cell')}>{date && <button type="button" tabIndex={props.disabled || date < config.value.min || date > config.value.max ? -1 : 0} data-date={date} aria-label={dayName(date, dayOptions, t.value)} aria-current={date === props.today ? 'date' : undefined} aria-pressed={selectedDate(date, draft.value, range)} disabled={props.disabled || date < config.value.min || date > config.value.max} {...attrs('calendar', 'day', dayState(date, dayOptions))} onKeyDown$={[preventCalendarNavigation, keydown]} onClick$={() => activate(date)}>{interpolate(t.value.visibleDayLabel, { ...parseIsoDate(date)! })}</button>}</td>)}</tr>)}</tbody>
   </table>
  </div>
  <div {...attrs('calendar', 'footer')}>
   {props.today && <button type="button" tabIndex={0} {...attrs('calendar', 'today', props.disabled || props.today < config.value.min || props.today > config.value.max ? 'disabled' : '')} disabled={props.disabled || props.today < config.value.min || props.today > config.value.max} onClick$={() => {
                if (!props.disabled && props.today && props.today >= config.value.min && props.today <= config.value.max)
                    return focusDate(props.today);
            }}>{t.value.today}</button>}
   {!props.required && <button type="button" tabIndex={0} {...attrs('calendar', 'clear', props.disabled ? 'disabled' : '')} disabled={props.disabled} onClick$={() => {
                if (!props.disabled)
                    draft.value = emptyValue(range);
            }}>{t.value.clear}</button>}
   <button type="button" tabIndex={0} {...attrs('calendar', 'cancel', props.disabled ? 'disabled' : '')} disabled={props.disabled} onClick$={async () => {
            if (props.disabled)
                return;
            draft.value = copyValue(committed.value);
            month.value = initialMonth(committed.value, config.value);
            await props.onCancel$?.();
        }}>{t.value.cancel}</button>
   <button type="button" tabIndex={0} {...attrs('calendar', 'confirm', canConfirm.value ? '' : 'disabled')} disabled={!canConfirm.value} onClick$={confirm}>{t.value.confirm}</button>
  </div>
 </div>;
});
