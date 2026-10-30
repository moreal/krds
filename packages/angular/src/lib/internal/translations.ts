import { oneOf, type Locale } from './behavior';
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
export interface DateInputTranslations {
    startLabel: string;
    endLabel: string;
    formatHint: string;
    openCalendar: string;
    calendarTitle: string;
    requiredError: string;
    formatError: string;
    incompleteRangeError: string;
    orderError: string;
    minError: string;
    maxError: string;
}
const enMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export function calendarTranslations(locale: Locale, overrides: Partial<CalendarTranslations> = {}): CalendarTranslations {
    oneOf(locale, ['ko-KR', 'en-US'], 'locale');
    const en = locale === 'en-US';
    const result: CalendarTranslations = { previousMonth: en ? 'Previous month' : '이전 달', nextMonth: en ? 'Next month' : '다음 달', today: en ? 'Today' : '오늘', clear: en ? 'Clear' : '지우기', cancel: en ? 'Cancel' : '취소', confirm: en ? 'Confirm' : '확인', selected: en ? 'Selected' : '선택됨', unavailable: en ? 'Unavailable' : '선택할 수 없음', adjacentMonth: en ? 'Outside displayed month' : '다른 달', dateLabel: en ? '{weekday}, {monthName} {day}, {year}' : '{year}년 {month}월 {day}일 {weekday}', visibleDayLabel: en ? '{day}' : '{day}일', monthLabel: en ? '{monthName} {year}' : '{year}년 {month}월', startLabel: en ? 'Start date' : '시작일', endLabel: en ? 'End date' : '종료일', weekdays: en ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] : ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'], weekdayShort: en ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['일', '월', '화', '수', '목', '금', '토'], months: enMonths, ...overrides };
    for (const [key, value] of Object.entries(result))
        if (typeof value === 'string' ? !value.trim() : !value.every((part: string) => typeof part === 'string' && part.trim()))
            throw new TypeError(`Empty translation: ${key}`);
    if (result.weekdays.length !== 7 || result.weekdayShort.length !== 7 || result.months.length !== 12)
        throw new TypeError('Complete weekday/month lists required.');
    return result;
}
export function dateTranslations(locale: Locale, overrides: Partial<DateInputTranslations> = {}): DateInputTranslations {
    oneOf(locale, ['ko-KR', 'en-US'], 'locale');
    const en = locale === 'en-US';
    const result = { startLabel: en ? 'Start date' : '시작일', endLabel: en ? 'End date' : '종료일', formatHint: en ? 'Enter YYYY-MM-DD, for example 2024-02-29' : 'YYYY-MM-DD 형식으로 입력하세요. 예: 2024-02-29', openCalendar: en ? 'Open calendar' : '달력 열기', calendarTitle: en ? 'Choose date' : '날짜 선택', requiredError: en ? 'Enter a date' : '날짜를 입력하세요', formatError: en ? 'Enter a valid date in YYYY-MM-DD format' : 'YYYY-MM-DD 형식의 올바른 날짜를 입력하세요', incompleteRangeError: en ? 'Enter both start and end dates' : '시작일과 종료일을 모두 입력하세요', orderError: en ? 'End date must not precede start date' : '종료일은 시작일보다 빠를 수 없습니다', minError: en ? 'Enter a date on or after {min}' : '{min} 이후 날짜를 입력하세요 (당일 포함)', maxError: en ? 'Enter a date on or before {max}' : '{max} 이전 날짜를 입력하세요 (당일 포함)', ...overrides };
    if (Object.values(result).some(value => !value.trim()))
        throw new TypeError('Empty date translation.');
    return result;
}
export function interpolate(template: string, values: Record<string, string | number>): string { return template.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match)); }
