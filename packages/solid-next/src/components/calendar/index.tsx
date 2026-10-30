import { createEffect, createMemo, createSignal, createUniqueId, flush, For, untrack } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { addDays, addMonths, calendarMonthGrid, parseIsoDate, weekday, type DateRangeValue, type ValueChangeDetails } from '@unofficial-krds/contracts';
import { bounds, dictionary, empty, ends, equal, interpolate, validValue, type DateModeProps, type DateValue } from '../../internal/date';
import { nativeState, part, useEnvironment } from '../../internal/native';
export interface CalendarTranslations {
    previousMonth: string;
    nextMonth: string;
    today: string;
    clear: string;
    cancel: string;
    confirm: string;
    selected: string;
    unavailable: string;
    adjacentMonth: string;
    dateLabel: string;
    visibleDayLabel: string;
    monthLabel: string;
    startLabel: string;
    endLabel: string;
    weekdays: readonly string[];
    weekdayShort: readonly string[];
    months: readonly string[];
}
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const chrome = {
    'ko-KR': { previousMonth: '이전 달', nextMonth: '다음 달', today: '오늘', clear: '지우기', cancel: '취소', confirm: '확인', selected: '선택됨', unavailable: '선택할 수 없음', adjacentMonth: '다른 달', dateLabel: '{year}년 {month}월 {day}일 {weekday}', visibleDayLabel: '{day}일', monthLabel: '{year}년 {month}월', startLabel: '시작일', endLabel: '종료일', weekdays: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'], weekdayShort: ['일', '월', '화', '수', '목', '금', '토'], months },
    'en-US': { previousMonth: 'Previous month', nextMonth: 'Next month', today: 'Today', clear: 'Clear', cancel: 'Cancel', confirm: 'Confirm', selected: 'Selected', unavailable: 'Unavailable', adjacentMonth: 'Outside displayed month', dateLabel: '{weekday}, {monthName} {day}, {year}', visibleDayLabel: '{day}', monthLabel: '{monthName} {year}', startLabel: 'Start date', endLabel: 'End date', weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], weekdayShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], months },
};
interface Base {
    id?: string;
    label?: JSX.Element;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    min?: string;
    max?: string;
    referenceDate?: string;
    today?: string;
    disabled?: boolean;
    required?: boolean;
    locale?: 'ko-KR' | 'en-US';
    translations?: Partial<CalendarTranslations>;
    onCancel?: () => void;
}
export type CalendarProps = Base & (DateModeProps extends infer P ? P extends {
    mode?: 'single';
} ? P & {
    onConfirm?: (detail: ValueChangeDetails<string | null>) => void;
} : P & {
    onConfirm?: (detail: ValueChangeDetails<DateRangeValue>) => void;
} : never);
export function Calendar(props: CalendarProps) {
    const env = useEnvironment(), range = untrack(() => props.mode === 'range'), id = untrack(()=>props.id ?? `krds-calendar-${createUniqueId()}`);
    const config = createMemo(() => bounds(props));
    const state = nativeState<DateValue>(() => props.value, () => props.defaultValue ?? empty(range), () => props.defaultValue);
    const committed = createMemo(() => {
        if ((props.mode === 'range') !== range)
            throw new TypeError('Date mode immutable');
        return validValue(state.value(), range, config().min, config().max);
    });
    const firstMonth = (v: DateValue) => {
        const date = ends(v)[0] ?? config().referenceDate;
        return `${(date < config().min ? config().min : date > config().max ? config().max : date).slice(0, 7)}-01`;
    };
    const [draft, setDraft] = createSignal<DateValue>(() => untrack(committed));
    const [month, setMonth] = createSignal(() => untrack(() => firstMonth(committed())));
    createEffect(committed, value => {
        setDraft(() => value);
        setMonth(firstMonth(value));
    }, { defer: true });
    const t = createMemo(() => {
        const locale = props.locale ?? env.locale ?? 'ko-KR';
        const result = dictionary(chrome[locale], props.translations);
        for (const [key, n] of [['weekdays', 7], ['weekdayShort', 7], ['months', 12]] as const)
            if (!Array.isArray(result[key]) || result[key].length !== n || result[key].some(v => typeof v !== 'string' || !v.trim()))
                throw new TypeError(`Invalid ${key}`);
        return result;
    });
    const label = (date: string, template: string) => {
        const p = parseIsoDate(date)!;
        return interpolate(template, { ...p, weekday: t().weekdays[weekday(date)]!, monthName: t().months[p.month - 1]! });
    };
    const heading = () => label(month(), t().monthLabel), grid = () => calendarMonthGrid(month());
    const available = (date: string) => !props.disabled && date >= config().min && date <= config().max;
    const selected = (date: string) => {
        const [start, end] = ends(draft());
        return !!start && (range ? date >= start && date <= (end ?? start) : date === start);
    };
    const states = (date: string) => {
        const [start, end] = ends(draft());
        return [date === props.today && 'today', selected(date) && 'selected', range && date === start && 'range-start', range && date === end && 'range-end', range && !!start && !!end && date > start && date < end && 'in-range', date.slice(0, 7) !== month().slice(0, 7) && 'outside-month', !available(date) && 'disabled'].filter(Boolean).join(' ');
    };
    const accessible = (date: string) => {
        const [start, end] = ends(draft());
        return [label(date, t().dateLabel), date === props.today && t().today, selected(date) && t().selected, !available(date) && t().unavailable, date.slice(0, 7) !== month().slice(0, 7) && t().adjacentMonth, range && date === start && t().startLabel, range && date === end && t().endLabel].filter(Boolean).join(', ');
    };
    const navigateMonth = (delta: number) => {
        const target = addMonths(month(), delta);
        if (!target)
            return null;
        const next = addMonths(target, 1), last = next ? addDays(next, -1)! : '9999-12-31';
        return target <= config().max && last >= config().min ? target : null;
    };
    let root!: HTMLDivElement;
    function focusDate(date: string) {
        setMonth(`${date.slice(0, 7)}-01`);
        flush();
        root.querySelector<HTMLButtonElement>(`button[data-date="${date}"]`)?.focus();
    }
    function activate(date: string) {
        if (!available(date))
            return;
        if (range) {
            const [start, end] = ends(draft());
            setDraft(!start || end ? { start: date, end: null } : date < start ? { start: date, end: start } : { start, end: date });
        }
        else
            setDraft(date);
        if (date.slice(0, 7) !== month().slice(0, 7))
            setMonth(`${date.slice(0, 7)}-01`);
    }
    function key(event: KeyboardEvent, date: string) {
        if (event.defaultPrevented || event.isComposing || event.keyCode === 229 || props.disabled)
            return;
        let delta = 0, target: string | null = null, stopMonth: string | undefined;
        const key = event.key;
        if (key === 'ArrowLeft')
            delta = -1;
        else if (key === 'ArrowRight')
            delta = 1;
        else if (key === 'ArrowUp')
            delta = -7;
        else if (key === 'ArrowDown')
            delta = 7;
        else if (key === 'Home' || key === 'End') {
            event.preventDefault();
            for (let i = 0; i < 7; i++) {
                const candidate = addDays(date, (key === 'Home' ? i : 6 - i) - weekday(date));
                if (candidate && available(candidate)) {
                    focusDate(candidate);
                    break;
                }
            }
            return;
        }
        else if (key === 'PageUp' || key === 'PageDown') {
            delta = key === 'PageUp' ? -1 : 1;
            target = addMonths(date, delta * (event.shiftKey ? 12 : 1));
            if (!target) {
                event.preventDefault();
                return;
            }
            stopMonth = target.slice(0, 7);
        }
        else
            return;
        event.preventDefault();
        if (!stopMonth) target = addDays(date, delta);
        const direction = delta < 0 ? -1 : 1;
        while (target && !available(target)) {
            if (target < config().min || target > config().max)
                return;
            target = addDays(target, direction);
            if (stopMonth && target?.slice(0, 7) !== stopMonth)
                return;
        }
        if (target)
            focusDate(target);
    }
    const canConfirm = () => {
        const [start, end] = ends(draft());
        return !props.disabled && (!start ? !props.required : available(start) && (!range || !!end && available(end)));
    };
    function confirm() {
        if (!canConfirm())
            return;
        const value = draft();
        if (!equal(value, committed()))
            state.request(value, detail => (props.onValueChange as ((d: ValueChangeDetails<DateValue>) => void) | undefined)?.(detail));
        (props.onConfirm as ((d: ValueChangeDetails<DateValue>) => void) | undefined)?.({ value });
        if (state.controlled) {
            setDraft(() => committed());
            setMonth(firstMonth(committed()));
        }
    }
    return <div ref={el => root = el} role="group" aria-label={props['aria-label']} aria-labelledby={props['aria-labelledby'] ?? (props.label != null ? `${id}-label` : undefined)} dir={env.direction ?? 'ltr'} {...part('calendar', 'root', props.disabled ? 'disabled' : '')}>{props.label != null && <div id={`${id}-label`}>{props.label}</div>}<div {...part('calendar', 'header')}><button type="button" aria-label={t().previousMonth} disabled={props.disabled || !navigateMonth(-1)} {...part('calendar', 'previous')} onClick={() => {
            const target = navigateMonth(-1);
            if (target && !props.disabled)
                setMonth(target);
        }}>‹</button><h2 id={`${id}-heading`} aria-live="polite" aria-atomic="true" {...part('calendar', 'heading')}>{heading()}</h2><button type="button" aria-label={t().nextMonth} disabled={props.disabled || !navigateMonth(1)} {...part('calendar', 'next')} onClick={() => {
            const target = navigateMonth(1);
            if (target && !props.disabled)
                setMonth(target);
        }}>›</button></div><div data-krds-component="calendar" data-krds-internal="table-scroll" role="region" aria-labelledby={`${id}-heading`} tabindex={0}><table aria-labelledby={`${id}-heading`} {...part('calendar', 'table')}><thead><tr><For each={t().weekdays}>{(day, index) => <th scope="col" aria-label={day} {...part('calendar', 'weekday')}>{t().weekdayShort[index()]}</th>}</For></tr></thead><tbody><For each={[0, 1, 2, 3, 4, 5]}>{row => <tr><For each={grid().slice(row * 7, row * 7 + 7)}>{date => <td {...part('calendar', 'cell')}>{date && <button type="button" data-date={date} aria-label={accessible(date)} aria-pressed={selected(date) ? 'true' : 'false'} aria-current={date === props.today ? 'date' : undefined} disabled={!available(date)} {...part('calendar', 'day', states(date))} onClick={() => activate(date)} onKeyDown={event => key(event, date)}>{label(date, t().visibleDayLabel)}</button>}</td>}</For></tr>}</For></tbody></table></div><div {...part('calendar', 'footer')}>{props.today && <button type="button" disabled={!available(props.today)} {...part('calendar', 'today')} onClick={() => {
                if (props.today && available(props.today))
                    focusDate(props.today);
            }}>{t().today}</button>}{!props.required && <button type="button" disabled={props.disabled} {...part('calendar', 'clear')} onClick={() => {
                if (!props.disabled)
                    setDraft(empty(range));
            }}>{t().clear}</button>}<button type="button" disabled={props.disabled} {...part('calendar', 'cancel')} onClick={() => {
            if (!props.disabled) {
                setDraft(() => committed());
                setMonth(firstMonth(committed()));
                props.onCancel?.();
            }
        }}>{t().cancel}</button><button type="button" disabled={!canConfirm()} {...part('calendar', 'confirm')} onClick={confirm}>{t().confirm}</button></div></div>;
}
