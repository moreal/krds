import { parseIsoDate } from '@unofficial-krds/contracts';
import type { DateValue, Locale, CalendarTranslations, DateInputTranslations } from './types.js';
export const empty = (mode: string): DateValue => mode === 'range' ? { start: null, end: null } : null;
export const texts = (value: DateValue): [
    string,
    string
] => typeof value === 'object' && value !== null ? [value.start ?? '', value.end ?? ''] : [value ?? '', ''];
export function equal(a: DateValue, b: DateValue): boolean {
    if (a === b)
        return true;
    if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object')
        return false;
    return a.start === b.start && a.end === b.end;
}
export function bounds(min?: string, max?: string, referenceDate = '2000-01-01', today?: string) {
    for (const v of [min, max, referenceDate, today])
        if (v !== undefined && !parseIsoDate(v))
            throw new RangeError('Expected strict ISO date');
    if (min && max && min > max)
        throw new RangeError('min exceeds max');
}
export function validateValue(mode: string, value: DateValue, min?: string, max?: string): void {
    if (mode === 'single' ? value !== null && typeof value !== 'string' : value === null || typeof value !== 'object' || !('start' in value) || !('end' in value))
        throw new TypeError('Date value does not match mode');
    const [a, b] = texts(value);
    if (mode === 'range' && Boolean(a) !== Boolean(b))
        throw new RangeError('Incomplete range');
    for (const date of mode === 'range' ? [a, b] : [a])
        if (date && (!parseIsoDate(date) || (min && date < min) || (max && date > max)))
            throw new RangeError('Invalid or out-of-bounds date');
    if (a && b && a > b)
        throw new RangeError('Reversed range');
}
export function dictionary<T extends object>(base: T, overrides?: Partial<T>): T {
    const out = { ...base, ...overrides };
    for (const v of Object.values(out))
        if (typeof v === 'string' && !v.trim())
            throw new RangeError('Empty translation');
    return out;
}
export const weekdaysKo = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
export const weekdaysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export function calendarDictionary(locale: Locale, override?: Partial<CalendarTranslations>): CalendarTranslations {
    const en = locale === 'en-US';
    const out = dictionary({ previousMonth: en ? 'Previous month' : '이전 달', nextMonth: en ? 'Next month' : '다음 달', today: en ? 'Today' : '오늘', clear: en ? 'Clear' : '지우기', cancel: en ? 'Cancel' : '취소', confirm: en ? 'Confirm' : '확인', selected: en ? 'Selected' : '선택됨', unavailable: en ? 'Unavailable' : '선택할 수 없음', adjacentMonth: en ? 'Outside displayed month' : '다른 달', dateLabel: en ? '{weekday}, {monthName} {day}, {year}' : '{year}년 {month}월 {day}일 {weekday}', visibleDayLabel: en ? '{day}' : '{day}일', monthLabel: en ? '{monthName} {year}' : '{year}년 {month}월', startLabel: en ? 'Start date' : '시작일', endLabel: en ? 'End date' : '종료일', weekdays: en ? weekdaysEn : weekdaysKo, months: monthsEn }, override);
    for (const [array, length] of [[out.weekdays, 7], [out.months, 12]] as const)
        if (array.length !== length || array.some(v => !v.trim()))
            throw new RangeError('Incomplete date names');
    return out;
}
export function dateDictionary(locale: Locale, override?: Partial<DateInputTranslations>): DateInputTranslations {
    const en = locale === 'en-US';
    return dictionary({ startLabel: en ? 'Start date' : '시작일', endLabel: en ? 'End date' : '종료일', formatHint: en ? 'Enter YYYY-MM-DD, for example 2024-02-29' : 'YYYY-MM-DD 형식으로 입력하세요. 예: 2024-02-29', openCalendar: en ? 'Open calendar' : '달력 열기', calendarTitle: en ? 'Choose date' : '날짜 선택', requiredError: en ? 'Enter a date' : '날짜를 입력하세요', formatError: en ? 'Enter a valid date in YYYY-MM-DD format' : 'YYYY-MM-DD 형식의 올바른 날짜를 입력하세요', incompleteRangeError: en ? 'Enter both start and end dates' : '시작일과 종료일을 모두 입력하세요', orderError: en ? 'End date must not precede start date' : '종료일은 시작일보다 빠를 수 없습니다', minError: en ? 'Enter a date on or after {min}' : '{min} 이후 날짜를 입력하세요 (당일 포함)', maxError: en ? 'Enter a date on or before {max}' : '{max} 이전 날짜를 입력하세요 (당일 포함)' }, override);
}
export function template(value: string, replacements: Record<string, string | number>) {
    return value.replace(/\{(\w+)\}/g, (_, key) => String(replacements[key] ?? ''));
}
