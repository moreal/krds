import { parseIsoDate, type DateRangeValue, type ValueChangeDetails } from '@unofficial-krds/contracts';
export type DateValue = string | null | DateRangeValue;
export type DateModeProps = {
    mode?: 'single';
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (detail: ValueChangeDetails<string | null>) => void;
} | {
    mode: 'range';
    value?: DateRangeValue;
    defaultValue?: DateRangeValue;
    onValueChange?: (detail: ValueChangeDetails<DateRangeValue>) => void;
};
export const ends = (v: DateValue): [
    string | null,
    string | null
] => typeof v === 'object' && v !== null ? [v.start, v.end] : [v, null];
export const empty = (range: boolean): DateValue => range ? { start: null, end: null } : null;
export const equal = (a: DateValue, b: DateValue) => ends(a).every((v, i) => v === ends(b)[i]);
export const text = (v: DateValue): [
    string,
    string
] => {
    const [s, e] = ends(v);
    return [s ?? '', e ?? ''];
};
export function strict(v: string, key: string) {
    if (typeof v !== 'string' || !parseIsoDate(v))
        throw new RangeError(`Invalid ${key}: expected YYYY-MM-DD`);
    return v;
}
export function bounds(p: {
    min?: string;
    max?: string;
    referenceDate?: string;
    today?: string;
}) {
    const min = strict(p.min ?? '0001-01-01', 'min'), max = strict(p.max ?? '9999-12-31', 'max');
    if (min > max)
        throw new RangeError('min exceeds max');
    const referenceDate = strict(p.referenceDate ?? '2000-01-01', 'referenceDate');
    if (p.today !== undefined)
        strict(p.today, 'today');
    return { min, max, referenceDate };
}
export function validValue(v: DateValue, range: boolean, min: string, max: string) {
    if (range) {
        if (typeof v !== 'object' || v === null || !('start' in v) || !('end' in v))
            throw new TypeError('Range requires start/end');
        if (v.start === null && v.end === null)
            return v;
        if (v.start === null || v.end === null)
            throw new RangeError('Incomplete committed range');
        strict(v.start, 'start');
        strict(v.end, 'end');
        if (v.start > v.end || v.start < min || v.end > max)
            throw new RangeError('Unavailable committed range');
    }
    else {
        if (v !== null && typeof v !== 'string')
            throw new TypeError('Single requires string/null');
        if (v !== null && (strict(v, 'value') < min || v > max))
            throw new RangeError('Unavailable date');
    }
    return v;
}
export const interpolate = (template: string, values: Record<string, string | number>) => template.replace(/\{(\w+)\}/g, (all, key: string) => String(values[key] ?? all));
export function dictionary<T extends object>(base: T, override?: Partial<T>): T {
    const result = { ...base, ...override };
    if (Object.values(result).some(v => typeof v === 'string' && !v.trim()))
        throw new TypeError('Empty translation');
    return result;
}
