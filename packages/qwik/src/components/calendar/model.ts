import { addDays, addMonths, parseIsoDate, weekday } from '@unofficial-krds/contracts';
import { dictionary, endpoints, interpolate, states, type DateValue, type Locale } from '../../internal/behavior';
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
    monthLabel: string;
    visibleDayLabel: string;
    startLabel: string;
    endLabel: string;
    weekdays: readonly string[];
    weekdayShort: readonly string[];
    months: readonly string[];
}
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const translations: Record<Locale, CalendarTranslations> = {
    'ko-KR': { previousMonth: '이전 달', nextMonth: '다음 달', today: '오늘', clear: '지우기', cancel: '취소', confirm: '확인', selected: '선택됨', unavailable: '선택할 수 없음', adjacentMonth: '다른 달', dateLabel: '{year}년 {month}월 {day}일 {weekday}', monthLabel: '{year}년 {month}월', visibleDayLabel: '{day}일', startLabel: '시작일', endLabel: '종료일', weekdays: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'], weekdayShort: ['일', '월', '화', '수', '목', '금', '토'], months },
    'en-US': { previousMonth: 'Previous month', nextMonth: 'Next month', today: 'Today', clear: 'Clear', cancel: 'Cancel', confirm: 'Confirm', selected: 'Selected', unavailable: 'Unavailable', adjacentMonth: 'Outside displayed month', dateLabel: '{weekday}, {monthName} {day}, {year}', monthLabel: '{monthName} {year}', visibleDayLabel: '{day}', startLabel: 'Start date', endLabel: 'End date', weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], weekdayShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], months }
};
export function calendarTranslations(locale: Locale = 'ko-KR', overrides?: Partial<CalendarTranslations>) {
    if (!(locale in translations))
        throw new TypeError('Unsupported locale');
    const result = dictionary(translations[locale], overrides);
    for (const [key, length] of [['weekdays', 7], ['weekdayShort', 7], ['months', 12]] as const)
        if (!Array.isArray(result[key]) || result[key].length !== length || result[key].some(value => typeof value !== 'string' || !value.trim()))
            throw new TypeError(`Invalid ${key} translations`);
    return result;
}
export function initialMonth(value: DateValue, config: {
    min: string;
    max: string;
    referenceDate: string;
}) { const date = endpoints(value)[0] ?? config.referenceDate; return `${(date < config.min ? config.min : date > config.max ? config.max : date).slice(0, 7)}-01`; }
export function monthTarget(month: string, delta: number, min: string, max: string) {
    const target = addMonths(month, delta);
    if (!target)
        return null;
    const next = addMonths(target, 1), last = next ? addDays(next, -1)! : '9999-12-31';
    return target <= max && last >= min ? target : null;
}
export function selectedDate(date: string, draft: DateValue, range: boolean) { const [start, end] = endpoints(draft); return start !== null && (range ? date >= start && date <= (end ?? start) : date === start); }
export interface DayOptions {
    draft: DateValue;
    range: boolean;
    month: string;
    today?: string;
    disabled?: boolean;
    min: string;
    max: string;
}
export function dayState(date: string, options: DayOptions) { const [start, end] = endpoints(options.draft); return states(date === options.today && 'today', selectedDate(date, options.draft, options.range) && 'selected', options.range && date === start && 'range-start', options.range && date === end && 'range-end', options.range && start !== null && end !== null && date > start && date < end && 'in-range', date.slice(0, 7) !== options.month.slice(0, 7) && 'outside-month', (options.disabled || date < options.min || date > options.max) && 'disabled'); }
export function dayName(date: string, options: DayOptions, t: CalendarTranslations) { const parts = parseIsoDate(date)!, [start, end] = endpoints(options.draft); return [interpolate(t.dateLabel, { ...parts, weekday: t.weekdays[weekday(date)], monthName: t.months[parts.month - 1] }), date === options.today && t.today, selectedDate(date, options.draft, options.range) && t.selected, (options.disabled || date < options.min || date > options.max) && t.unavailable, date.slice(0, 7) !== options.month.slice(0, 7) && t.adjacentMonth, options.range && date === start && t.startLabel, options.range && date === end && t.endLabel].filter(Boolean).join(', '); }
export function navigationTarget(date: string, key: string, shift: boolean, min: string, max: string) {
    let target: string | null = null, direction = 1, targetMonth: string | undefined;
    const movement: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (key in movement) {
        direction = Math.sign(movement[key]);
        target = addDays(date, movement[key]);
    }
    else if (key === 'Home' || key === 'End') {
        direction = key === 'Home' ? 1 : -1;
        target = addDays(date, key === 'Home' ? -weekday(date) : 6 - weekday(date));
        const limit = addDays(date, key === 'Home' ? 6 - weekday(date) : -weekday(date));
        while (target && (target < min || target > max) && target !== limit)
            target = addDays(target, direction);
        return target && target >= min && target <= max ? target : null;
    }
    else if (key === 'PageUp' || key === 'PageDown') {
        direction = key === 'PageUp' ? -1 : 1;
        target = addMonths(date, direction * (shift ? 12 : 1));
        targetMonth = target?.slice(0, 7);
    }
    else
        return null;
    while (target && (target < min || target > max)) {
        if (direction < 0 && target < min || direction > 0 && target > max)
            return null;
        target = addDays(target, direction);
        if (targetMonth && target?.slice(0, 7) !== targetMonth)
            return null;
    }
    return target;
}
