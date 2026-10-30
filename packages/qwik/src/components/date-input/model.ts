import { parseIsoDate } from '@unofficial-krds/contracts';
import { dictionary, emptyValue, interpolate, type DateValue, type Locale } from '../../internal/behavior';
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
const dictionaries: Record<Locale, DateInputTranslations> = {
    'ko-KR': { startLabel: '시작일', endLabel: '종료일', formatHint: 'YYYY-MM-DD 형식으로 입력하세요. 예: 2024-02-29', openCalendar: '달력 열기', calendarTitle: '날짜 선택', requiredError: '날짜를 입력하세요', formatError: 'YYYY-MM-DD 형식의 올바른 날짜를 입력하세요', incompleteRangeError: '시작일과 종료일을 모두 입력하세요', orderError: '종료일은 시작일보다 빠를 수 없습니다', minError: '{min} 이후 날짜를 입력하세요 (당일 포함)', maxError: '{max} 이전 날짜를 입력하세요 (당일 포함)' },
    'en-US': { startLabel: 'Start date', endLabel: 'End date', formatHint: 'Enter YYYY-MM-DD, for example 2024-02-29', openCalendar: 'Open calendar', calendarTitle: 'Choose date', requiredError: 'Enter a date', formatError: 'Enter a valid date in YYYY-MM-DD format', incompleteRangeError: 'Enter both start and end dates', orderError: 'End date must not precede start date', minError: 'Enter a date on or after {min}', maxError: 'Enter a date on or before {max}' }
};
export function dateTranslations(locale: Locale = 'ko-KR', overrides?: Partial<DateInputTranslations>) {
    if (!(locale in dictionaries))
        throw new TypeError('Unsupported locale');
    return dictionary(dictionaries[locale], overrides);
}
export interface Validation {
    message: string;
    fields: number[];
    value?: DateValue;
}
export function validateDraft(draft: [
    string,
    string
], range: boolean, required: boolean, min: string, max: string, t: DateInputTranslations): Validation {
    const [start, end] = draft, failure = (message: string, fields: number[]): Validation => ({ message, fields });
    if (start && !parseIsoDate(start))
        return failure(t.formatError, [0]);
    if (range && end && !parseIsoDate(end))
        return failure(t.formatError, [1]);
    if (!start && (!range || !end))
        return required ? failure(t.requiredError, range ? [0, 1] : [0]) : { message: '', fields: [], value: emptyValue(range) };
    if (range && (!start || !end))
        return failure(t.incompleteRangeError, !start ? [0] : [1]);
    if (start < min)
        return failure(interpolate(t.minError, { min }), [0]);
    if (start > max)
        return failure(interpolate(t.maxError, { max }), [0]);
    if (range && end < min)
        return failure(interpolate(t.minError, { min }), [1]);
    if (range && end > max)
        return failure(interpolate(t.maxError, { max }), [1]);
    if (range && start > end)
        return failure(t.orderError, [0, 1]);
    return { message: '', fields: [], value: range ? { start, end } : start };
}
export function dateFields(id: string): HTMLInputElement[] { return [document.getElementById(id), document.getElementById(`${id}-end`)].filter((input): input is HTMLInputElement => input instanceof HTMLInputElement); }
export function readDraft(id: string): [
    string,
    string
] { const fields = dateFields(id); return [fields[0]?.value ?? '', fields[1]?.value ?? '']; }
export function mirrorValidity(id: string, result: Validation, disabled: boolean) { dateFields(id).forEach((input, index) => input.setCustomValidity(!disabled && result.fields.includes(index) ? result.message : '')); }

export function sameDraft(first: [string, string], second: [string, string]): boolean {
    return first[0] === second[0] && first[1] === second[1];
}
