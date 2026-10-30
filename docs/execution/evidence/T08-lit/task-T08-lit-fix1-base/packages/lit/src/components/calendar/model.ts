import { parseIsoDate } from '@unofficial-krds/contracts';
import type { DateRangeValue } from '@unofficial-krds/contracts';
export type DateValue = string | null | DateRangeValue;
export function empty(mode: string): DateValue { return mode === 'range' ? { start: null, end: null } : null; }
export function equal(a: DateValue, b: DateValue) { return JSON.stringify(a) === JSON.stringify(b); }
export function bounds(min?: string, max?: string) { for (const value of [min, max])
    if (value !== undefined && !parseIsoDate(value))
        throw new RangeError('Invalid date bound'); if (min && max && min > max)
    throw new RangeError('min exceeds max'); }
export function validateValue(value: DateValue, mode: string, min?: string, max?: string, partial = false) {
    bounds(min, max);
    if (!['single', 'range'].includes(mode))
        throw new TypeError('Invalid date mode');
    if (mode === 'single' && value !== null && typeof value !== 'string')
        throw new TypeError('Single value must be date or null');
    if (mode === 'range' && (typeof value !== 'object' || value === null || !('start' in value) || !('end' in value)))
        throw new TypeError('Range value must contain start/end');
    const entries = mode === 'single' ? [value as string | null] : [(value as DateRangeValue).start, (value as DateRangeValue).end];
    for (const date of entries)
        if (date !== null && (typeof date !== 'string' || !parseIsoDate(date) || (min && date < min) || (max && date > max)))
            throw new RangeError('Invalid or out-of-bounds date');
    if (mode === 'range') {
        const range = value as DateRangeValue;
        if (!partial && !!range.start !== !!range.end)
            throw new RangeError('Incomplete range');
        if (range.start && range.end && range.start > range.end)
            throw new RangeError('Reversed range');
    }
}
export const weekdays = { 'ko-KR': ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'], 'en-US': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] };
export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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
    weekdayNames: readonly string[];
    monthNames: readonly string[];
}
export function translations(locale: 'ko-KR' | 'en-US', override: Partial<CalendarTranslations> = {}): CalendarTranslations {
    if (!['ko-KR', 'en-US'].includes(locale))
        throw new TypeError('Unsupported locale');
    const ko = locale === 'ko-KR';
    const resolved = { previousMonth: ko ? '이전 달' : 'Previous month', nextMonth: ko ? '다음 달' : 'Next month', today: ko ? '오늘' : 'Today', clear: ko ? '지우기' : 'Clear', cancel: ko ? '취소' : 'Cancel', confirm: ko ? '확인' : 'Confirm', selected: ko ? '선택됨' : 'Selected', unavailable: ko ? '선택할 수 없음' : 'Unavailable', adjacentMonth: ko ? '다른 달' : 'Outside displayed month', dateLabel: ko ? '{year}년 {month}월 {day}일 {weekday}' : '{weekday}, {monthName} {day}, {year}', visibleDayLabel: ko ? '{day}일' : '{day}', monthLabel: ko ? '{year}년 {month}월' : '{monthName} {year}', startLabel: ko ? '시작일' : 'Start date', endLabel: ko ? '종료일' : 'End date', weekdayNames: weekdays[locale], monthNames: months, ...override };
    for (const value of Object.values(resolved))
        if (typeof value === 'string' && !value.trim())
            throw new TypeError('Translation cannot be empty');
    if (resolved.weekdayNames.length !== 7 || resolved.monthNames.length !== 12 || [...resolved.weekdayNames, ...resolved.monthNames].some(value => !value.trim()))
        throw new TypeError('Invalid calendar name arrays');
    return resolved;
}
export function template(value: string, parts: Record<string, string | number>) { return value.replace(/\{(\w+)\}/g, (_, key) => String(parts[key] ?? `{${key}}`)); }
