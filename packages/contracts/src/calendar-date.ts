import { daysInMonth, formatIsoDate, parseIsoDate } from './date.js';
import type { DateParts } from './types.js';

type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

function dateParts(input: string | DateParts): DateParts {
  if (typeof input === 'string') {
    const parts = parseIsoDate(input);
    if (parts === null) throw new RangeError('Expected a strict Gregorian YYYY-MM-DD date.');
    return parts;
  }
  formatIsoDate(input); // Reuse the public parts validation, including malformed JavaScript inputs.
  return input;
}

function daysBeforeYear(year: number): number {
  const previous = year - 1;
  return previous * 365 + Math.floor(previous / 4) - Math.floor(previous / 100) + Math.floor(previous / 400);
}

/** Zero-based day count: Gregorian 0001-01-01 is day 0 (Monday). */
function ordinal(parts: DateParts): number {
  let result = daysBeforeYear(parts.year) + parts.day - 1;
  for (let month = 1; month < parts.month; month++) result += daysInMonth(parts.year, month);
  return result;
}

const lastOrdinal = daysBeforeYear(10000) - 1;
const lastMonthIndex = 9999 * 12 - 1;

/** Internal input is already bounded; binary search avoids iteration proportional to the delta. */
function fromOrdinal(value: number): string {
  let low = 1;
  let high = 10000;
  while (low + 1 < high) {
    const middle = Math.floor((low + high) / 2);
    if (daysBeforeYear(middle) <= value) low = middle;
    else high = middle;
  }
  let remaining = value - daysBeforeYear(low);
  let month = 1;
  while (remaining >= daysInMonth(low, month)) {
    remaining -= daysInMonth(low, month);
    month++;
  }
  return formatIsoDate({ year: low, month, day: remaining + 1 });
}

function assertDelta(delta: number): void {
  if (!Number.isSafeInteger(delta)) throw new RangeError('Date arithmetic requires a safe integer delta.');
}

/** Sunday=0 through Saturday=6; no Date, timestamp, locale or timezone conversion. */
export function weekday(input: string | DateParts): Weekday {
  return ((ordinal(dateParts(input)) + 1) % 7) as Weekday;
}

/** Return null for valid arithmetic outside years 1–9999; invalid arguments throw RangeError. */
export function addDays(input: string | DateParts, delta: number): string | null {
  const current = ordinal(dateParts(input));
  assertDelta(delta);
  // Bound before adding so even a maximal safe delta never loses precision.
  if (delta < -current || delta > lastOrdinal - current) return null;
  return fromOrdinal(current + delta);
}

/** Calendar-month arithmetic clamps the day to the real final day of the target month. */
export function addMonths(input: string | DateParts, delta: number): string | null {
  const parts = dateParts(input);
  assertDelta(delta);
  const current = (parts.year - 1) * 12 + parts.month - 1;
  if (delta < -current || delta > lastMonthIndex - current) return null;
  const target = current + delta;
  const year = Math.floor(target / 12) + 1;
  const month = target % 12 + 1;
  return formatIsoDate({ year, month, day: Math.min(parts.day, daysInMonth(year, month)) });
}

/** Exactly six Sunday-first weeks, retaining adjacent dates and null-padding year boundaries. */
export function calendarMonthGrid(referenceDate: string): ReadonlyArray<string | null> {
  if (typeof referenceDate !== 'string') throw new RangeError('Month grid requires an ISO reference date.');
  const reference = dateParts(referenceDate);
  const first = { year: reference.year, month: reference.month, day: 1 };
  const firstOrdinal = ordinal(first);
  const start = firstOrdinal - (firstOrdinal + 1) % 7;
  return Array.from({ length: 42 }, (_, index) => {
    const value = start + index;
    return value < 0 || value > lastOrdinal ? null : fromOrdinal(value);
  });
}
