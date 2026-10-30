import { parseIsoDate } from '@unofficial-krds/contracts';
import type { DateValue, CalendarTranslations, DateInputTranslations } from './types';
export const empty = (range: boolean): DateValue => range ? { start: null, end: null } : null;
export const ends = (v: DateValue): [
    string | null,
    string | null
] => v !== null && typeof v === 'object' ? [v.start, v.end] : [v, null];
export const equal = (a: DateValue, b: DateValue) => ends(a).every((v, i) => v === ends(b)[i]);
export const copy = (v: DateValue): DateValue => v && typeof v === 'object' ? { ...v } : v;
export function strict(v: string) { if (typeof v !== 'string' || !parseIsoDate(v))
    throw new RangeError('Expected strict ISO date'); return v; }
export function bounds(p: {
    min?: string;
    max?: string;
    referenceDate?: string;
    today?: string;
}) { const min = strict(p.min ?? '0001-01-01'), max = strict(p.max ?? '9999-12-31'); if (min > max)
    throw new RangeError('min exceeds max'); strict(p.referenceDate ?? '2000-01-01'); if (p.today !== undefined)
    strict(p.today); return { min, max }; }
export function validate(v: DateValue, range: boolean, min: string, max: string) { if (range && (!v || typeof v !== 'object' || !('start' in v) || !('end' in v)))
    throw new TypeError('Expected range'); if (!range && v !== null && typeof v !== 'string')
    throw new TypeError('Expected date'); const [a, b] = ends(v); if (range && (a === null) !== (b === null))
    throw new RangeError('Incomplete committed range'); for (const d of range ? [a, b] : [a])
    if (d !== null && (strict(d) < min || d > max))
        throw new RangeError('Unavailable date'); if (a && b && a > b)
    throw new RangeError('Reversed range'); return v; }
export function dictionary<T extends object>(base: T, override?: Partial<T>): T { const result = { ...base, ...override }; for (const v of Object.values(result))
    if (typeof v === 'string' && !v.trim() || Array.isArray(v) && v.some(x => typeof x !== 'string' || !x.trim()))
        throw new TypeError('Empty translation'); return result; }
export const interpolate = (s: string, values: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (all, key) => String(values[key] ?? all));
export function dateWords(en: boolean): DateInputTranslations { return en ? { startLabel: 'Start date', endLabel: 'End date', formatHint: 'Enter YYYY-MM-DD, for example 2024-02-29', openCalendar: 'Open calendar', calendarTitle: 'Choose date', requiredError: 'Enter a date', formatError: 'Enter a valid date in YYYY-MM-DD format', incompleteRangeError: 'Enter both start and end dates', orderError: 'End date must not precede start date', minError: 'Enter a date on or after {min}', maxError: 'Enter a date on or before {max}' } : { startLabel: '시작일', endLabel: '종료일', formatHint: 'YYYY-MM-DD 형식으로 입력하세요. 예: 2024-02-29', openCalendar: '달력 열기', calendarTitle: '날짜 선택', requiredError: '날짜를 입력하세요', formatError: 'YYYY-MM-DD 형식의 올바른 날짜를 입력하세요', incompleteRangeError: '시작일과 종료일을 모두 입력하세요', orderError: '종료일은 시작일보다 빠를 수 없습니다', minError: '{min} 이후 날짜를 입력하세요 (당일 포함)', maxError: '{max} 이전 날짜를 입력하세요 (당일 포함)' }; }
export function calendarWords(en: boolean): CalendarTranslations { return en ? { previousMonth: 'Previous month', nextMonth: 'Next month', today: 'Today', clear: 'Clear', cancel: 'Cancel', confirm: 'Confirm', selected: 'Selected', unavailable: 'Unavailable', adjacentMonth: 'Outside displayed month', dateLabel: '{weekday}, {monthName} {day}, {year}', visibleDayLabel: '{day}', monthLabel: '{monthName} {year}', startLabel: 'Start date', endLabel: 'End date', weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], weekdayLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] } : { previousMonth: '이전 달', nextMonth: '다음 달', today: '오늘', clear: '지우기', cancel: '취소', confirm: '확인', selected: '선택됨', unavailable: '선택할 수 없음', adjacentMonth: '다른 달', dateLabel: '{year}년 {month}월 {day}일 {weekday}', visibleDayLabel: '{day}일', monthLabel: '{year}년 {month}월', startLabel: '시작일', endLabel: '종료일', weekdays: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'], weekdayLabels: ['일', '월', '화', '수', '목', '금', '토'], months: Array.from({ length: 12 }, (_, i) => `${i + 1}월`) }; }
