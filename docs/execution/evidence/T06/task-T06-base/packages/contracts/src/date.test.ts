import { describe, expect, it } from 'vitest';
import { formatIsoDate, parseIsoDate } from './date.js';

describe('date-only Gregorian values', () => {
  it.each([
    ['2024-02-29', { year: 2024, month: 2, day: 29 }],
    ['2000-02-29', { year: 2000, month: 2, day: 29 }],
    ['0001-01-01', { year: 1, month: 1, day: 1 }],
    ['9999-12-31', { year: 9999, month: 12, day: 31 }],
  ])('parses valid %s without a host timezone', (value, parts) => {
    expect(parseIsoDate(value)).toEqual(parts);
  });
  it.each(['2025-02-29', '1900-02-29', '2024-13-01', '2024-2-1', '0000-01-01',
    '10000-01-01', '2024-04-31', '2024-00-01', '2024-01-00', '2024-01-32',
    ' 2024-02-29', '2024-02-29\n', '2024-02-29T00:00:00Z', '２０２４-02-29', ''])
    ('rejects malformed or impossible %j', (value) => expect(parseIsoDate(value)).toBeNull());
  it.each([
    [{ year: 1, month: 1, day: 1 }, '0001-01-01'],
    [{ year: 2024, month: 2, day: 29 }, '2024-02-29'],
    [{ year: 9999, month: 12, day: 31 }, '9999-12-31'],
  ])('formats valid parts %j', (parts, value) => expect(formatIsoDate(parts)).toBe(value));
  it.each([
    { year: 0, month: 1, day: 1 }, { year: 10000, month: 1, day: 1 },
    { year: 2025, month: 2, day: 29 }, { year: 1900, month: 2, day: 29 },
    { year: 2024, month: 13, day: 1 }, { year: 2024, month: 1, day: 0 },
    { year: 2024.5, month: 1, day: 1 }, { year: 2024, month: NaN, day: 1 },
    { year: Infinity, month: 1, day: 1 }, { year: 2024, month: 1, day: 1.5 },
  ])('throws RangeError for invalid parts %j', (parts) => {
    expect(() => formatIsoDate(parts)).toThrow(RangeError);
  });
  it.each([null, undefined, {}, { year: '2024', month: 2, day: 29 }])
    ('reports RangeError for malformed JavaScript date parts %j', (parts) => {
      expect(() => formatIsoDate(parts as unknown as import('./types.js').DateParts)).toThrow(RangeError);
    });
  it.each(['0001-01-01', '0099-12-31', '1900-03-01', '2000-02-29', '2024-02-29', '9999-12-31'])
    ('round-trips %s', (value) => expect(formatIsoDate(parseIsoDate(value)!)).toBe(value));
});
