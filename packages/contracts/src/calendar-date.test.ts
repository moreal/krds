import { describe, expect, it } from 'vitest';
import { addDays, addMonths, calendarMonthGrid, daysInMonth, weekday } from './index.js';
import type { DateParts } from './types.js';

describe('Gregorian month lengths', () => {
  it.each([
    [1, 1, 31], [9999, 12, 31], [1900, 2, 28], [2000, 2, 29], [2024, 2, 29], [2025, 2, 28],
    [2024, 4, 30], [2024, 6, 30], [2024, 9, 30], [2024, 11, 30], [2024, 7, 31],
  ])('counts %i-%i as %i days', (year, month, expected) => expect(daysInMonth(year, month)).toBe(expected));
  it.each([[0, 1], [10000, 1], [2024.5, 1], [NaN, 1], [Infinity, 1], [2024, 0], [2024, 13], [2024, 1.5], [2024, NaN]])
    ('rejects invalid year/month %j %j', (year, month) => expect(() => daysInMonth(year, month)).toThrow(RangeError));
});

describe('Sunday-zero weekday', () => {
  it.each([
    ['0001-01-01', 1], ['1900-03-01', 4], ['2000-01-01', 6], ['2000-02-29', 2],
    ['2024-02-29', 4], ['2024-03-03', 0], ['9999-12-31', 5],
  ] as const)('maps %s to %i', (input, expected) => expect(weekday(input)).toBe(expected));
  it('accepts date parts without modifying them', () => {
    const parts = { year: 2024, month: 2, day: 29 };
    expect(weekday(parts)).toBe(4);
    expect(parts).toEqual({ year: 2024, month: 2, day: 29 });
  });
});

describe('day arithmetic', () => {
  it.each([
    ['2024-02-28', 1, '2024-02-29'], ['2024-02-28', 2, '2024-03-01'], ['2024-03-01', -1, '2024-02-29'],
    ['1900-02-28', 1, '1900-03-01'], ['2000-02-28', 1, '2000-02-29'],
    ['2023-12-31', 1, '2024-01-01'], ['2024-01-01', -1, '2023-12-31'],
    ['0001-01-01', 3652058, '9999-12-31'], ['9999-12-31', -3652058, '0001-01-01'],
    ['0001-01-01', -1, null], ['9999-12-31', 1, null],
    ['2024-02-29', Number.MAX_SAFE_INTEGER, null], ['2024-02-29', Number.MIN_SAFE_INTEGER, null],
    ['2024-02-29', 0, '2024-02-29'],
  ] as const)('adds %s + %i days as %s', (input, delta, expected) => expect(addDays(input, delta)).toBe(expected));
  it('accepts date parts across a year boundary without mutation', () => {
    const input = { year: 2024, month: 1, day: 1 };
    expect(addDays(input, -1)).toBe('2023-12-31');
    expect(input).toEqual({ year: 2024, month: 1, day: 1 });
  });
});

describe('clamped month arithmetic', () => {
  it.each([
    ['2024-01-31', 1, '2024-02-29'], ['2025-01-31', 1, '2025-02-28'], ['1900-01-31', 1, '1900-02-28'],
    ['2000-01-31', 1, '2000-02-29'], ['2024-03-31', -1, '2024-02-29'],
    ['2024-02-29', 12, '2025-02-28'], ['2024-02-29', -12, '2023-02-28'],
    ['2024-12-31', 1, '2025-01-31'], ['2024-01-31', -1, '2023-12-31'],
    ['0001-01-31', 119987, '9999-12-31'], ['9999-12-31', -119987, '0001-01-31'],
    ['0001-01-01', -1, null], ['9999-12-31', 1, null],
    ['2024-01-31', Number.MAX_SAFE_INTEGER, null], ['2024-01-31', Number.MIN_SAFE_INTEGER, null],
    ['2024-01-31', 0, '2024-01-31'],
  ] as const)('adds %s + %i months as %s', (input, delta, expected) => expect(addMonths(input, delta)).toBe(expected));
  it('accepts date parts without mutation', () => {
    const input = { year: 2024, month: 1, day: 31 };
    expect(addMonths(input, 1)).toBe('2024-02-29');
    expect(input).toEqual({ year: 2024, month: 1, day: 31 });
  });
});

describe('strict arithmetic inputs', () => {
  it.each(['2025-02-29', '2024-2-1', '0000-01-01', '10000-01-01', '2024-02-29\n', '2024-13-01', ''])
    ('rejects invalid ISO %j in every operation', (input) => {
      expect(() => weekday(input)).toThrow(RangeError);
      expect(() => addDays(input, 0)).toThrow(RangeError);
      expect(() => addMonths(input, 0)).toThrow(RangeError);
      expect(() => calendarMonthGrid(input)).toThrow(RangeError);
    });
  it.each([null, undefined, {}, { year: 2024, month: 2, day: 30 }, { year: 2024, month: 2, day: 1.5 }])
    ('rejects malformed date parts %j', (value) => {
      const input = value as unknown as DateParts;
      expect(() => weekday(input)).toThrow(RangeError);
      expect(() => addDays(input, 0)).toThrow(RangeError);
      expect(() => addMonths(input, 0)).toThrow(RangeError);
    });
  it.each([1.5, NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER + 1, Number.MIN_SAFE_INTEGER - 1])
    ('rejects non-safe-integer delta %j', (delta) => {
      expect(() => addDays('2024-01-01', delta)).toThrow(RangeError);
      expect(() => addMonths('2024-01-01', delta)).toThrow(RangeError);
    });
});

describe('fixed Sunday-first month grid', () => {
  it('lays out a leap February with real adjacent dates', () => {
    const grid = calendarMonthGrid('2024-02-29');
    expect(grid).toHaveLength(42);
    expect(grid.slice(0, 7)).toEqual(['2024-01-28', '2024-01-29', '2024-01-30', '2024-01-31', '2024-02-01', '2024-02-02', '2024-02-03']);
    expect(grid[32]).toBe('2024-02-29');
    expect(grid[41]).toBe('2024-03-09');
    expect(calendarMonthGrid('2024-02-01')).toEqual(grid);
  });
  it('starts a Sunday month on its first day rather than adding a prior week', () => {
    const grid = calendarMonthGrid('2024-09-15');
    expect(grid).toHaveLength(42);
    expect(grid[0]).toBe('2024-09-01');
    expect(grid[41]).toBe('2024-10-12');
  });
  it('pads cells before year 1 with null', () => {
    const grid = calendarMonthGrid('0001-01-01');
    expect(grid).toHaveLength(42);
    expect(grid.slice(0, 3)).toEqual([null, '0001-01-01', '0001-01-02']);
    expect(grid[41]).toBe('0001-02-10');
  });
  it('pads cells beyond year 9999 with null', () => {
    const grid = calendarMonthGrid('9999-12-31');
    expect(grid).toHaveLength(42);
    expect(grid[0]).toBe('9999-11-28');
    expect(grid[33]).toBe('9999-12-31');
    expect(grid.slice(34)).toEqual([null, null, null, null, null, null, null, null]);
  });
  it('rejects date parts rather than coercing the string-only reference date', () => {
    expect(() => calendarMonthGrid({ year: 2024, month: 2, day: 1 } as unknown as string)).toThrow(RangeError);
  });
});
