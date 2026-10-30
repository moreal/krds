import type { DateParts } from './types.js';

function validDate(input: DateParts): boolean {
  if (typeof input !== 'object' || input === null) return false;
  const { year, month, day } = input;
  if (![year, month, day].every(Number.isInteger) || year < 1 || year > 9999 || month < 1 || month > 12 || day < 1) return false;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= days[month - 1];
}

/** Strict ASCII YYYY-MM-DD, Gregorian years 0001–9999; no time or timezone. */
export function parseIsoDate(input: string): DateParts | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input) || input.length !== 10) return null;
  const parts = { year: Number(input.slice(0, 4)), month: Number(input.slice(5, 7)), day: Number(input.slice(8, 10)) };
  return validDate(parts) ? parts : null;
}

/** @throws RangeError for noninteger, out-of-range, or impossible date parts. */
export function formatIsoDate(input: DateParts): string {
  if (!validDate(input)) throw new RangeError('Expected a valid Gregorian date in years 1–9999.');
  return `${String(input.year).padStart(4, '0')}-${String(input.month).padStart(2, '0')}-${String(input.day).padStart(2, '0')}`;
}
