import { parseIsoDate } from '@unofficial-krds/contracts';
import type { DateRangeValue } from '@unofficial-krds/contracts';
export type DateValue = string | null | DateRangeValue;
export type Locale = 'ko-KR' | 'en-US';
export const attrs = (component: string, part: string, state = '') => ({ 'data-krds-component': component, 'data-krds-part': part, 'data-krds-state': state });
export const states = (...values: (string | false | undefined | null)[]) => values.filter(Boolean).join(' ');
export const emptyValue = (range: boolean): DateValue => range ? { start: null, end: null } : null;
export const copyValue = (value: DateValue): DateValue => typeof value === 'object' && value !== null ? { ...value } : value;
export const endpoints = (value: DateValue): [
    string | null,
    string | null
] => typeof value === 'object' && value !== null ? [value.start, value.end] : [value, null];
export const sameValue = (a: DateValue, b: DateValue) => endpoints(a).every((value, index) => value === endpoints(b)[index]);
export const textFor = (value: DateValue): [
    string,
    string
] => { const [start, end] = endpoints(value); return [start ?? '', end ?? '']; };
export function dateConfig(props: {
    min?: string;
    max?: string;
    referenceDate?: string;
    today?: string;
}) {
    const strict = (value: string, name: string) => {
        if (typeof value !== 'string' || !parseIsoDate(value))
            throw new RangeError(`${name} must be a strict Gregorian ISO date`);
        return value;
    };
    const min = strict(props.min ?? '0001-01-01', 'min'), max = strict(props.max ?? '9999-12-31', 'max');
    if (min > max)
        throw new RangeError('min must not exceed max');
    const referenceDate = strict(props.referenceDate ?? '2000-01-01', 'referenceDate');
    if (props.today !== undefined)
        strict(props.today, 'today');
    return { min, max, referenceDate };
}
export function validateValue(value: DateValue, range: boolean, min: string, max: string): DateValue {
    if (range) {
        if (typeof value !== 'object' || value === null || !('start' in value) || !('end' in value))
            throw new TypeError('Range mode requires {start,end}');
        if (value.start === null && value.end === null)
            return value;
        if (typeof value.start !== 'string' || typeof value.end !== 'string' || !parseIsoDate(value.start) || !parseIsoDate(value.end) || value.start > value.end || value.start < min || value.end > max)
            throw new RangeError('Invalid committed range');
    }
    else {
        if (value !== null && typeof value !== 'string')
            throw new TypeError('Single mode requires string or null');
        if (value !== null && (!parseIsoDate(value) || value < min || value > max))
            throw new RangeError('Invalid committed date');
    }
    return value;
}
export function dictionary<T extends object>(defaults: T, overrides?: Partial<T>): T {
    const result = { ...defaults, ...overrides };
    for (const value of Object.values(result))
        if (typeof value === 'string' && !value.trim())
            throw new TypeError('Translations must not be empty');
    return result;
}
export const interpolate = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match));
export function controlMode(value: unknown, defaultValue: unknown, controlled: boolean) {
    if ((value !== undefined) !== controlled)
        throw new TypeError('Controlled mode is immutable');
    if (controlled && defaultValue !== undefined)
        throw new TypeError('Controlled and default values are mutually exclusive');
}
