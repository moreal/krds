# T06 date-helpers exact uncommitted scoped changes

Baseline reviewed T05 foundation. Sharedintegration/providers/publicbarrel/fixture and othercomponents are distinctowners; fullT06acceptance later.

## packages/contracts/src/date.ts

```diff
--- base/packages/contracts/src/date.ts
+++ packages/contracts/src/date.ts
@@ -1,23 +1,30 @@
 import type { DateParts } from './types.js';
 
 function validDate(input: DateParts): boolean {
   if (typeof input !== 'object' || input === null) return false;
   const { year, month, day } = input;
   if (![year, month, day].every(Number.isInteger) || year < 1 || year > 9999 || month < 1 || month > 12 || day < 1) return false;
-  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
-  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
-  return day <= days[month - 1];
+  return day <= daysInMonth(year, month);
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
+
+/** Gregorian month length, restricted to integer years 1–9999 and months 1–12. */
+export function daysInMonth(year: number, month: number): number {
+  if (!Number.isInteger(year) || !Number.isInteger(month) || year < 1 || year > 9999 || month < 1 || month > 12) {
+    throw new RangeError('Expected an integer year 1–9999 and month 1–12.');
+  }
+  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
+  return [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
+}
```

## packages/contracts/src/calendar-date.ts

```diff
--- base/packages/contracts/src/calendar-date.ts
+++ packages/contracts/src/calendar-date.ts
@@ -0,0 +1,90 @@
+import { daysInMonth, formatIsoDate, parseIsoDate } from './date.js';
+import type { DateParts } from './types.js';
+
+type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;
+
+function dateParts(input: string | DateParts): DateParts {
+  if (typeof input === 'string') {
+    const parts = parseIsoDate(input);
+    if (parts === null) throw new RangeError('Expected a strict Gregorian YYYY-MM-DD date.');
+    return parts;
+  }
+  formatIsoDate(input); // Reuse the public parts validation, including malformed JavaScript inputs.
+  return input;
+}
+
+function daysBeforeYear(year: number): number {
+  const previous = year - 1;
+  return previous * 365 + Math.floor(previous / 4) - Math.floor(previous / 100) + Math.floor(previous / 400);
+}
+
+/** Zero-based day count: Gregorian 0001-01-01 is day 0 (Monday). */
+function ordinal(parts: DateParts): number {
+  let result = daysBeforeYear(parts.year) + parts.day - 1;
+  for (let month = 1; month < parts.month; month++) result += daysInMonth(parts.year, month);
+  return result;
+}
+
+const lastOrdinal = daysBeforeYear(10000) - 1;
+const lastMonthIndex = 9999 * 12 - 1;
+
+/** Internal input is already bounded; binary search avoids iteration proportional to the delta. */
+function fromOrdinal(value: number): string {
+  let low = 1;
+  let high = 10000;
+  while (low + 1 < high) {
+    const middle = Math.floor((low + high) / 2);
+    if (daysBeforeYear(middle) <= value) low = middle;
+    else high = middle;
+  }
+  let remaining = value - daysBeforeYear(low);
+  let month = 1;
+  while (remaining >= daysInMonth(low, month)) {
+    remaining -= daysInMonth(low, month);
+    month++;
+  }
+  return formatIsoDate({ year: low, month, day: remaining + 1 });
+}
+
+function assertDelta(delta: number): void {
+  if (!Number.isSafeInteger(delta)) throw new RangeError('Date arithmetic requires a safe integer delta.');
+}
+
+/** Sunday=0 through Saturday=6; no Date, timestamp, locale or timezone conversion. */
+export function weekday(input: string | DateParts): Weekday {
+  return ((ordinal(dateParts(input)) + 1) % 7) as Weekday;
+}
+
+/** Return null for valid arithmetic outside years 1–9999; invalid arguments throw RangeError. */
+export function addDays(input: string | DateParts, delta: number): string | null {
+  const current = ordinal(dateParts(input));
+  assertDelta(delta);
+  // Bound before adding so even a maximal safe delta never loses precision.
+  if (delta < -current || delta > lastOrdinal - current) return null;
+  return fromOrdinal(current + delta);
+}
+
+/** Calendar-month arithmetic clamps the day to the real final day of the target month. */
+export function addMonths(input: string | DateParts, delta: number): string | null {
+  const parts = dateParts(input);
+  assertDelta(delta);
+  const current = (parts.year - 1) * 12 + parts.month - 1;
+  if (delta < -current || delta > lastMonthIndex - current) return null;
+  const target = current + delta;
+  const year = Math.floor(target / 12) + 1;
+  const month = target % 12 + 1;
+  return formatIsoDate({ year, month, day: Math.min(parts.day, daysInMonth(year, month)) });
+}
+
+/** Exactly six Sunday-first weeks, retaining adjacent dates and null-padding year boundaries. */
+export function calendarMonthGrid(referenceDate: string): ReadonlyArray<string | null> {
+  if (typeof referenceDate !== 'string') throw new RangeError('Month grid requires an ISO reference date.');
+  const reference = dateParts(referenceDate);
+  const first = { year: reference.year, month: reference.month, day: 1 };
+  const firstOrdinal = ordinal(first);
+  const start = firstOrdinal - (firstOrdinal + 1) % 7;
+  return Array.from({ length: 42 }, (_, index) => {
+    const value = start + index;
+    return value < 0 || value > lastOrdinal ? null : fromOrdinal(value);
+  });
+}
```

## packages/contracts/src/calendar-date.test.ts

```diff
--- base/packages/contracts/src/calendar-date.test.ts
+++ packages/contracts/src/calendar-date.test.ts
@@ -0,0 +1,114 @@
+import { describe, expect, it } from 'vitest';
+import { addDays, addMonths, calendarMonthGrid, daysInMonth, weekday } from './index.js';
+import type { DateParts } from './types.js';
+
+describe('Gregorian month lengths', () => {
+  it.each([
+    [1, 1, 31], [9999, 12, 31], [1900, 2, 28], [2000, 2, 29], [2024, 2, 29], [2025, 2, 28],
+    [2024, 4, 30], [2024, 6, 30], [2024, 9, 30], [2024, 11, 30], [2024, 7, 31],
+  ])('counts %i-%i as %i days', (year, month, expected) => expect(daysInMonth(year, month)).toBe(expected));
+  it.each([[0, 1], [10000, 1], [2024.5, 1], [NaN, 1], [Infinity, 1], [2024, 0], [2024, 13], [2024, 1.5], [2024, NaN]])
+    ('rejects invalid year/month %j %j', (year, month) => expect(() => daysInMonth(year, month)).toThrow(RangeError));
+});
+
+describe('Sunday-zero weekday', () => {
+  it.each([
+    ['0001-01-01', 1], ['1900-03-01', 4], ['2000-01-01', 6], ['2000-02-29', 2],
+    ['2024-02-29', 4], ['2024-03-03', 0], ['9999-12-31', 5],
+  ] as const)('maps %s to %i', (input, expected) => expect(weekday(input)).toBe(expected));
+  it('accepts date parts without modifying them', () => {
+    const parts = { year: 2024, month: 2, day: 29 };
+    expect(weekday(parts)).toBe(4);
+    expect(parts).toEqual({ year: 2024, month: 2, day: 29 });
+  });
+});
+
+describe('day arithmetic', () => {
+  it.each([
+    ['2024-02-28', 1, '2024-02-29'], ['2024-02-28', 2, '2024-03-01'], ['2024-03-01', -1, '2024-02-29'],
+    ['1900-02-28', 1, '1900-03-01'], ['2000-02-28', 1, '2000-02-29'],
+    ['2023-12-31', 1, '2024-01-01'], ['2024-01-01', -1, '2023-12-31'],
+    ['0001-01-01', 3652058, '9999-12-31'], ['9999-12-31', -3652058, '0001-01-01'],
+    ['0001-01-01', -1, null], ['9999-12-31', 1, null],
+    ['2024-02-29', Number.MAX_SAFE_INTEGER, null], ['2024-02-29', Number.MIN_SAFE_INTEGER, null],
+    ['2024-02-29', 0, '2024-02-29'],
+  ] as const)('adds %s + %i days as %s', (input, delta, expected) => expect(addDays(input, delta)).toBe(expected));
+  it('accepts date parts across a year boundary without mutation', () => {
+    const input = { year: 2024, month: 1, day: 1 };
+    expect(addDays(input, -1)).toBe('2023-12-31');
+    expect(input).toEqual({ year: 2024, month: 1, day: 1 });
+  });
+});
+
+describe('clamped month arithmetic', () => {
+  it.each([
+    ['2024-01-31', 1, '2024-02-29'], ['2025-01-31', 1, '2025-02-28'], ['1900-01-31', 1, '1900-02-28'],
+    ['2000-01-31', 1, '2000-02-29'], ['2024-03-31', -1, '2024-02-29'],
+    ['2024-02-29', 12, '2025-02-28'], ['2024-02-29', -12, '2023-02-28'],
+    ['2024-12-31', 1, '2025-01-31'], ['2024-01-31', -1, '2023-12-31'],
+    ['0001-01-31', 119987, '9999-12-31'], ['9999-12-31', -119987, '0001-01-31'],
+    ['0001-01-01', -1, null], ['9999-12-31', 1, null],
+    ['2024-01-31', Number.MAX_SAFE_INTEGER, null], ['2024-01-31', Number.MIN_SAFE_INTEGER, null],
+    ['2024-01-31', 0, '2024-01-31'],
+  ] as const)('adds %s + %i months as %s', (input, delta, expected) => expect(addMonths(input, delta)).toBe(expected));
+  it('accepts date parts without mutation', () => {
+    const input = { year: 2024, month: 1, day: 31 };
+    expect(addMonths(input, 1)).toBe('2024-02-29');
+    expect(input).toEqual({ year: 2024, month: 1, day: 31 });
+  });
+});
+
+describe('strict arithmetic inputs', () => {
+  it.each(['2025-02-29', '2024-2-1', '0000-01-01', '10000-01-01', '2024-02-29\n', '2024-13-01', ''])
+    ('rejects invalid ISO %j in every operation', (input) => {
+      expect(() => weekday(input)).toThrow(RangeError);
+      expect(() => addDays(input, 0)).toThrow(RangeError);
+      expect(() => addMonths(input, 0)).toThrow(RangeError);
+      expect(() => calendarMonthGrid(input)).toThrow(RangeError);
+    });
+  it.each([null, undefined, {}, { year: 2024, month: 2, day: 30 }, { year: 2024, month: 2, day: 1.5 }])
+    ('rejects malformed date parts %j', (value) => {
+      const input = value as unknown as DateParts;
+      expect(() => weekday(input)).toThrow(RangeError);
+      expect(() => addDays(input, 0)).toThrow(RangeError);
+      expect(() => addMonths(input, 0)).toThrow(RangeError);
+    });
+  it.each([1.5, NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER + 1, Number.MIN_SAFE_INTEGER - 1])
+    ('rejects non-safe-integer delta %j', (delta) => {
+      expect(() => addDays('2024-01-01', delta)).toThrow(RangeError);
+      expect(() => addMonths('2024-01-01', delta)).toThrow(RangeError);
+    });
+});
+
+describe('fixed Sunday-first month grid', () => {
+  it('lays out a leap February with real adjacent dates', () => {
+    const grid = calendarMonthGrid('2024-02-29');
+    expect(grid).toHaveLength(42);
+    expect(grid.slice(0, 7)).toEqual(['2024-01-28', '2024-01-29', '2024-01-30', '2024-01-31', '2024-02-01', '2024-02-02', '2024-02-03']);
+    expect(grid[32]).toBe('2024-02-29');
+    expect(grid[41]).toBe('2024-03-09');
+    expect(calendarMonthGrid('2024-02-01')).toEqual(grid);
+  });
+  it('starts a Sunday month on its first day rather than adding a prior week', () => {
+    const grid = calendarMonthGrid('2024-09-15');
+    expect(grid).toHaveLength(42);
+    expect(grid[0]).toBe('2024-09-01');
+    expect(grid[41]).toBe('2024-10-12');
+  });
+  it('pads cells before year 1 with null', () => {
+    const grid = calendarMonthGrid('0001-01-01');
+    expect(grid).toHaveLength(42);
+    expect(grid.slice(0, 3)).toEqual([null, '0001-01-01', '0001-01-02']);
+    expect(grid[41]).toBe('0001-02-10');
+  });
+  it('pads cells beyond year 9999 with null', () => {
+    const grid = calendarMonthGrid('9999-12-31');
+    expect(grid).toHaveLength(42);
+    expect(grid[0]).toBe('9999-11-28');
+    expect(grid[33]).toBe('9999-12-31');
+    expect(grid.slice(34)).toEqual([null, null, null, null, null, null, null, null]);
+  });
+  it('rejects date parts rather than coercing the string-only reference date', () => {
+    expect(() => calendarMonthGrid({ year: 2024, month: 2, day: 1 } as unknown as string)).toThrow(RangeError);
+  });
+});
```

## packages/contracts/src/index.ts

```diff
--- base/packages/contracts/src/index.ts
+++ packages/contracts/src/index.ts
@@ -1,4 +1,6 @@
 export type { FrameworkId, OpenChangeDetails, ValueChangeDetails, SelectOption, DateParts, DateRangeValue, ComponentCoverage } from './types.js';
 export { parseIsoDate, formatIsoDate } from './date.js';
 export { frameworkIds, validateCatalog, validateCoverage } from './catalog.js';
 export type { ComponentKind, CatalogSource, CatalogEntry, ComponentCatalog } from './catalog.js';
+export { daysInMonth } from './date.js';
+export { weekday, addDays, addMonths, calendarMonthGrid } from './calendar-date.js';
```

## packages/contracts/src/catalog.test.ts

```diff
--- base/packages/contracts/src/catalog.test.ts
+++ packages/contracts/src/catalog.test.ts
@@ -1,20 +1,26 @@
 import { readFileSync } from 'node:fs';
 import { describe, expect, it } from 'vitest';
 import { validateCatalog, validateCoverage } from './catalog.js';
 const load = (path: string) => JSON.parse(readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8'));
 const manifest = load('upstream/krds/manifest.json');
 const catalog = load('catalog/components.json');
 const coverage = load('catalog/coverage.json');
 const copy = <T>(value: T): T => structuredClone(value);
+// Planned-state fixtures remain valid as live native implementation tracking advances.
+const plannedCoverage = copy(coverage);
+for (const entry of plannedCoverage.coverage) {
+  entry.status = 'planned';
+  entry.evidencePaths = [];
+}
 
 describe('frozen catalog integrity', () => {
   it('accepts all frozen identities, including the non-web guidance', () => {
     expect(validateCatalog(catalog, manifest)).toEqual([]);
     expect(catalog.components).toHaveLength(55);
     expect(catalog.components.filter((c: { webApplicable: boolean }) => c.webApplicable)).toHaveLength(54);
     expect(catalog.components.find((c: { id: string }) => c.id === 'native-select').canonicalId).toBe('component_06_03');
   });
   it.each(['id', 'slug', 'canonicalId', 'exportName'])('rejects duplicate %s', (field) => {
     const value = copy(catalog); value.components[1][field] = value.components[0][field];
     expect(validateCatalog(value, manifest).length).toBeGreaterThan(0);
   });
@@ -36,44 +42,44 @@
   });
   it.each([null, [], {}, { components: [null] }])('reports malformed input %j without crashing', (value) => {
     expect(validateCatalog(value, manifest).length).toBeGreaterThan(0);
   });
   it('rejects empty implementation ownership', () => {
     const value = copy(catalog); value.components[0].implementationOwners = {};
     expect(validateCatalog(value, manifest).length).toBeGreaterThan(0);
   });
 });
 
 describe('honest native coverage', () => {
   it('accepts all planned stable and preview entries without implementation claims', () => {
+    expect(validateCoverage(plannedCoverage, catalog)).toEqual([]);
     expect(validateCoverage(coverage, catalog)).toEqual([]);
-    expect(coverage.coverage).toHaveLength(432);
-    expect(coverage.coverage.every((c: { status: string }) => c.status === 'planned')).toBe(true);
+    expect(plannedCoverage.coverage).toHaveLength(432);
   });
   it('rejects missing native framework work', () => {
-    const value = copy(coverage); value.coverage.pop();
+    const value = copy(plannedCoverage); value.coverage.pop();
     expect(validateCoverage(value, catalog).length).toBeGreaterThan(0);
   });
   it('rejects duplicate component/framework entries', () => {
-    const value = copy(coverage); value.coverage[1] = value.coverage[0];
+    const value = copy(plannedCoverage); value.coverage[1] = value.coverage[0];
     expect(validateCoverage(value, catalog).length).toBeGreaterThan(0);
   });
   it.each(['implemented', 'verified'])('rejects %s claims without evidence', (status) => {
-    const value = copy(coverage); value.coverage[0].status = status;
+    const value = copy(plannedCoverage); value.coverage[0].status = status;
     expect(validateCoverage(value, catalog).length).toBeGreaterThan(0);
   });
   it('rejects a probe masquerading as verification', () => {
-    const value = copy(coverage); value.coverage[0].status = 'verified'; value.coverage[0].evidencePaths = ['packages/solid/tests/workspace-probe.test.ts'];
+    const value = copy(plannedCoverage); value.coverage[0].status = 'verified'; value.coverage[0].evidencePaths = ['packages/solid/tests/workspace-probe.test.ts'];
     expect(validateCoverage(value, catalog).length).toBeGreaterThan(0);
   });
   it('rejects non-web guidance counted as native implementation', () => {
-    const value = copy(coverage); value.coverage[0].componentId = 'splash-screen';
+    const value = copy(plannedCoverage); value.coverage[0].componentId = 'splash-screen';
     expect(validateCoverage(value, catalog).length).toBeGreaterThan(0);
   });
   it('rejects an unsupported renderer name', () => {
-    const value = copy(coverage); value.coverage[0].framework = 'react-wrapper';
+    const value = copy(plannedCoverage); value.coverage[0].framework = 'react-wrapper';
     expect(validateCoverage(value, catalog).length).toBeGreaterThan(0);
   });
   it.each([null, [], {}, { coverage: [null] }])('reports malformed coverage %j', (value) => {
     expect(validateCoverage(value, catalog).length).toBeGreaterThan(0);
   });
 });
```
