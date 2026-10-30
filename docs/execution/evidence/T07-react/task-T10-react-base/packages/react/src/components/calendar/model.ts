import { parseIsoDate } from '@unofficial-krds/contracts';
import type { DateRangeValue, ValueChangeDetails } from '@unofficial-krds/contracts';
export type DateValue = string | null | DateRangeValue;
export type DateModeProps = { mode?: 'single'; value?: string | null; defaultValue?: string | null; onValueChange?: (details: ValueChangeDetails<string | null>) => void } | { mode: 'range'; value?: DateRangeValue; defaultValue?: DateRangeValue; onValueChange?: (details: ValueChangeDetails<DateRangeValue>) => void };
export const empty = (range: boolean): DateValue => range ? { start: null, end: null } : null;
export const pair = (value: DateValue): [string | null, string | null] => value !== null && typeof value === 'object' ? [value.start, value.end] : [value, null];
export const equal = (a: DateValue, b: DateValue) => pair(a).every((value, index) => value === pair(b)[index]);
export const clone = (value: DateValue): DateValue => value !== null && typeof value === 'object' ? { ...value } : value;
export function strict(value: string, name: string) { if (typeof value !== 'string' || !parseIsoDate(value)) throw new RangeError(`${name} requires YYYY-MM-DD.`); return value; }
export function configuration(props: { min?: string; max?: string; referenceDate?: string; today?: string }) {
  const min = strict(props.min ?? '0001-01-01', 'min'); const max = strict(props.max ?? '9999-12-31', 'max');
  if (min > max) throw new RangeError('min exceeds max.');
  if (props.today !== undefined) strict(props.today, 'today');
  return { min, max, referenceDate: strict(props.referenceDate ?? '2000-01-01', 'referenceDate') };
}
export function validate(value: DateValue, range: boolean, min: string, max: string): DateValue {
  if (range ? typeof value !== 'object' || value === null || !('start' in value) || !('end' in value) : value !== null && typeof value !== 'string') throw new TypeError('Date value shape does not match mode.');
  const [start, end] = pair(value);
  if (range && (start === null) !== (end === null)) throw new RangeError('Committed ranges must be complete.');
  for (const date of range ? [start, end] : [start]) if (date !== null && (strict(date, 'value') < min || date > max)) throw new RangeError('Date is outside bounds.');
  if (start && end && start > end) throw new RangeError('Range is reversed.');
  return value;
}
export const notify = (props: DateModeProps, value: DateValue) => (props.onValueChange as ((details: ValueChangeDetails<DateValue>) => void) | undefined)?.({ value: clone(value) });
export const text = (template: string, values: Record<string, string | number>) => template.replace(/\{(\w+)\}/g, (token, name: string) => String(values[name] ?? token));
export function dictionary<T extends object>(base: T, overrides?: Partial<T>): T {
  const result = { ...base, ...overrides };
  if (Object.values(result).some(value => typeof value === 'string' && !value.trim())) throw new TypeError('Translations must be nonempty.');
  return result;
}
