import { parseIsoDate } from '@krds-native/contracts';
import type { DateRangeValue, ValueChangeDetails } from '@krds-native/contracts';

export type DateValue = string | null | DateRangeValue;
export type DateModeProps = {
  mode?: 'single'; value?: string | null; defaultValue?: string | null;
  onValueChange?: (details: ValueChangeDetails<string | null>) => void;
} | {
  mode: 'range'; value?: DateRangeValue; defaultValue?: DateRangeValue;
  onValueChange?: (details: ValueChangeDetails<DateRangeValue>) => void;
};
export const emptyValue = (range: boolean): DateValue => range ? { start: null, end: null } : null;
export const copyValue = (value: DateValue): DateValue => typeof value === 'object' && value !== null ? { ...value } : value;
export const endpoints = (value: DateValue): [string | null, string | null] => typeof value === 'object' && value !== null ? [value.start, value.end] : [value, null];
export const sameValue = (a: DateValue, b: DateValue): boolean => endpoints(a).every((value, index) => value === endpoints(b)[index]);
export function strictDate(value: string, name: string): string {
  if (typeof value !== 'string' || !parseIsoDate(value)) throw new RangeError(`${name} must be a strict Gregorian ISO date.`);
  return value;
}
export function dateConfig(props: { min?: string; max?: string; referenceDate?: string; today?: string }) {
  const min = strictDate(props.min ?? '0001-01-01', 'min');
  const max = strictDate(props.max ?? '9999-12-31', 'max');
  if (min > max) throw new RangeError('min must not exceed max.');
  const referenceDate = strictDate(props.referenceDate ?? '2000-01-01', 'referenceDate');
  if (props.today !== undefined) strictDate(props.today, 'today');
  return { min, max, referenceDate };
}
export function validateValue(value: DateValue, range: boolean, min: string, max: string): DateValue {
  if (range) {
    if (typeof value !== 'object' || value === null || !('start' in value) || !('end' in value)) throw new TypeError('Range mode requires { start, end }.');
    if (value.start === null && value.end === null) return value;
    if (value.start === null || value.end === null) throw new RangeError('A committed range must have both endpoints.');
    strictDate(value.start, 'start'); strictDate(value.end, 'end');
    if (value.start > value.end || value.start < min || value.end > max) throw new RangeError('Invalid or unavailable committed range.');
  } else {
    if (value !== null && typeof value !== 'string') throw new TypeError('Single mode requires a date string or null.');
    if (value !== null && (strictDate(value, 'value') < min || value > max)) throw new RangeError('Committed date is outside bounds.');
  }
  return value;
}
export function notifyValue(props: DateModeProps, value: DateValue) {
  (props.onValueChange as ((details: ValueChangeDetails<DateValue>) => void) | undefined)?.({ value: copyValue(value) });
}
export function interpolate(text: string, values: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match));
}
export function nonemptyDictionary<T extends object>(defaults: T, overrides?: Partial<T>): T {
  const result = { ...defaults, ...overrides };
  for (const value of Object.values(result)) {
    if (typeof value === 'string' && !value.trim()) throw new TypeError('Translations must not be empty.');
  }
  return result;
}
