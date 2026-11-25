#!/usr/bin/env node
// Exhaustive check of packages/contracts/src/{date,calendar-date}.ts against the JavaScript engine's own
// proleptic Gregorian calendar (Date in UTC). Runs the TypeScript source directly; no build output is read.
//   node .claude/skills/verify-calendar-date/check.mjs            every property
//   node .claude/skills/verify-calendar-date/check.mjs --mutants  prove each property can fail
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '../../..');
const self = fileURLToPath(import.meta.url);
const { node } = JSON.parse(readFileSync(`${root}/compatibility/toolchain.json`, 'utf8'));
if (process.versions.node !== node.version) {
  const result = spawnSync(node.installedBinary, [self, ...process.argv.slice(2)], { stdio: 'inherit' });
  if (result.error) throw result.error;
  process.exit(result.status ?? 1);
}

const args = process.argv.slice(2);
const option = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const sourceFiles = ['date.ts', 'calendar-date.ts', 'types.ts'];
const defaultSrc = `${root}/packages/contracts/src`;

// Each mutant breaks one line of the real source. `caughtBy` is the property that must fail on it.
const mutants = [
  { name: 'century years stay leap years', file: 'date.ts', caughtBy: 'strings',
    find: 'year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)', replace: 'year % 4 === 0' },
  { name: 'any day up to 31 is accepted', file: 'date.ts', caughtBy: 'strings',
    find: 'return day <= daysInMonth(year, month);', replace: 'return day <= 31;' },
  { name: 'weekday loses its Monday offset', file: 'calendar-date.ts', caughtBy: 'weekday',
    find: '(ordinal(dateParts(input)) + 1) % 7', replace: 'ordinal(dateParts(input)) % 7' },
  { name: 'day count ignores the 400-year rule', file: 'calendar-date.ts', caughtBy: 'days',
    find: ' + Math.floor(previous / 400)', replace: '' },
  { name: 'year search is off by one at January 1', file: 'calendar-date.ts', caughtBy: 'days',
    find: 'if (daysBeforeYear(middle) <= value) low = middle;', replace: 'if (daysBeforeYear(middle) < value) low = middle;' },
  { name: 'addDays lets one day past 9999-12-31', file: 'calendar-date.ts', caughtBy: 'days',
    find: 'delta > lastOrdinal - current) return null;', replace: 'delta > lastOrdinal - current + 1) return null;' },
  { name: 'addMonths clamps every month to 28 days', file: 'calendar-date.ts', caughtBy: 'months',
    find: 'Math.min(parts.day, daysInMonth(year, month))', replace: 'Math.min(parts.day, 28)' },
  { name: 'addMonths rounds the target year', file: 'calendar-date.ts', caughtBy: 'months',
    find: 'const year = Math.floor(target / 12) + 1;', replace: 'const year = Math.round(target / 12) + 1;' },
  { name: 'addMonths lets one month before 0001-01', file: 'calendar-date.ts', caughtBy: 'months',
    find: 'if (delta < -current || delta > lastMonthIndex - current) return null;', replace: 'if (delta < -current - 1 || delta > lastMonthIndex - current) return null;' },
  { name: 'month grid starts on Monday', file: 'calendar-date.ts', caughtBy: 'grid',
    find: 'firstOrdinal - (firstOrdinal + 1) % 7', replace: 'firstOrdinal - firstOrdinal % 7' },
  { name: 'month grid drops 9999-12-31', file: 'calendar-date.ts', caughtBy: 'grid',
    find: 'value < 0 || value > lastOrdinal ? null', replace: 'value < 0 || value >= lastOrdinal ? null' },
];

if (args.includes('--mutants')) process.exit(runMutants());

const src = resolve(option('--src') ?? defaultSrc);
const only = option('--only');

// The source imports './date.js' the way tsc expects. Map that to the .ts file next to it.
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith('.') && specifier.endsWith('.js') && context.parentURL?.endsWith('.ts')) {
      const candidate = new URL(specifier.replace(/\.js$/, '.ts'), context.parentURL);
      if (existsSync(candidate)) return next(candidate.href, context);
    }
    return next(specifier, context);
  },
});
process.removeAllListeners('warning');
const { parseIsoDate, formatIsoDate, daysInMonth } = await import(pathToFileURL(`${src}/date.ts`).href);
const { weekday, addDays, addMonths, calendarMonthGrid } = await import(pathToFileURL(`${src}/calendar-date.ts`).href);

// Oracle: every day from 0001-01-01 through 9999-12-31 as the engine's Date sees it in UTC.
const dayMs = 86400000;
const epoch = new Date(0);
epoch.setUTCFullYear(1, 0, 1);
const firstMs = epoch.getTime();
epoch.setUTCFullYear(9999, 11, 31);
const total = (epoch.getTime() - firstMs) / dayMs + 1;
const years = new Uint16Array(total), monthsOf = new Uint8Array(total), daysOf = new Uint8Array(total), weekdays = new Uint8Array(total);
const monthStart = new Int32Array(9999 * 12 + 1); // day index of the first day of each month, plus an end sentinel
for (let index = 0; index < total; index++) {
  const date = new Date(firstMs + index * dayMs);
  years[index] = date.getUTCFullYear(); monthsOf[index] = date.getUTCMonth() + 1; daysOf[index] = date.getUTCDate(); weekdays[index] = date.getUTCDay();
  if (daysOf[index] === 1) monthStart[(years[index] - 1) * 12 + monthsOf[index] - 1] = index;
}
const monthCount = 9999 * 12;
monthStart[monthCount] = total;
const monthLength = (monthIndex) => monthStart[monthIndex + 1] - monthStart[monthIndex];
const two = Array.from({ length: 100 }, (_, value) => String(value).padStart(2, '0'));
const four = Array.from({ length: 10000 }, (_, value) => String(value).padStart(4, '0'));
const text = (year, month, day) => `${four[year]}-${two[month]}-${two[day]}`;
const iso = (index) => (index < 0 || index >= total ? null : text(years[index], monthsOf[index], daysOf[index]));

class Counterexample extends Error {}
const call = (label, run) => { try { return run(); } catch (error) { throw new Counterexample(`${label} threw ${error.name}: ${error.message}`); } };
function same(label, run, expected) {
  const actual = call(label, run);
  if (actual !== expected) throw new Counterexample(`${label} returned ${JSON.stringify(actual)}, the calendar says ${JSON.stringify(expected)}`);
}
let seed = 20261125;
const random = (limit) => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return Math.floor(seed / 4294967296 * limit); };

const properties = {
  strings: {
    promise: 'A YYYY-MM-DD string is accepted exactly when it names a real day, and accepted dates print back unchanged.',
    scope: 'all 100,000,000 strings of the shape dddd-dd-dd',
    check() {
      for (let year = 0; year <= 9999; year++) for (let month = 0; month <= 99; month++) {
        const length = year >= 1 && month >= 1 && month <= 12 ? monthLength((year - 1) * 12 + month - 1) : 0;
        if (length !== 0) same(`daysInMonth(${year}, ${month})`, () => daysInMonth(year, month), length);
        for (let day = 0; day <= 99; day++) {
          const input = text(year, month, day);
          const parts = call(`parseIsoDate("${input}")`, () => parseIsoDate(input));
          const real = day >= 1 && day <= length;
          if (!real && parts !== null) throw new Counterexample(`parseIsoDate("${input}") accepted a day that does not exist`);
          if (!real) continue;
          if (parts === null) throw new Counterexample(`parseIsoDate("${input}") rejected a real day`);
          if (parts.year !== year || parts.month !== month || parts.day !== day) throw new Counterexample(`parseIsoDate("${input}") returned ${JSON.stringify(parts)}`);
          same(`formatIsoDate(${JSON.stringify(parts)})`, () => formatIsoDate(parts), input);
        }
      }
    },
  },
  weekday: {
    promise: 'Every date gets its real day of the week.',
    scope: `all ${total.toLocaleString('en-US')} dates`,
    check() { for (let index = 0; index < total; index++) { const date = iso(index); same(`weekday("${date}")`, () => weekday(date), weekdays[index]); } },
  },
  days: {
    promise: 'Adding days lands on the real date that many days away, or null outside years 1 to 9999.',
    scope: `every date to and from 0001-01-01 and 9999-12-31, one day either way, one day past each limit, the extreme safe integers, and one pseudo-random target per date`,
    check() {
      const first = iso(0), last = iso(total - 1);
      for (let index = 0; index < total; index++) {
        const date = iso(index);
        same(`addDays("${first}", ${index})`, () => addDays(first, index), date);
        same(`addDays("${date}", ${-index})`, () => addDays(date, -index), first);
        same(`addDays("${date}", ${total - 1 - index})`, () => addDays(date, total - 1 - index), last);
        same(`addDays("${date}", 1)`, () => addDays(date, 1), iso(index + 1));
        same(`addDays("${date}", -1)`, () => addDays(date, -1), iso(index - 1));
        same(`addDays("${date}", ${-index - 1})`, () => addDays(date, -index - 1), null);
        same(`addDays("${date}", ${total - index})`, () => addDays(date, total - index), null);
        const target = random(total);
        same(`addDays("${date}", ${target - index})`, () => addDays(date, target - index), iso(target));
      }
      for (const date of [first, iso(730000), last]) for (const delta of [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]) same(`addDays("${date}", ${delta})`, () => addDays(date, delta), null);
    },
  },
  months: {
    promise: 'Adding months keeps the day of the month, or moves to the last real day when the target month is shorter, or returns null outside years 1 to 9999.',
    scope: 'every date by -13, -12, -1, 0, 1, 12, 13 months, to the first and last month, one month past each limit, and one pseudo-random target month; every target month from each day of 0001-01 and 9999-12',
    check() {
      const expected = (index, delta) => {
        const target = (years[index] - 1) * 12 + monthsOf[index] - 1 + delta;
        if (target < 0 || target >= monthCount) return null;
        return text(Math.floor(target / 12) + 1, target % 12 + 1, Math.min(daysOf[index], monthLength(target)));
      };
      const check = (index, delta) => { const date = iso(index); same(`addMonths("${date}", ${delta})`, () => addMonths(date, delta), expected(index, delta)); };
      for (let index = 0; index < total; index++) {
        const current = (years[index] - 1) * 12 + monthsOf[index] - 1;
        for (const delta of [-13, -12, -1, 0, 1, 12, 13, -current, -current - 1, monthCount - 1 - current, monthCount - current, random(monthCount) - current]) check(index, delta);
      }
      for (let day = 0; day < 31; day++) for (let delta = 0; delta < monthCount; delta++) { check(day, delta); check(total - 31 + day, -delta); }
      for (const index of [0, 730000, total - 1]) for (const delta of [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]) check(index, delta);
    },
  },
  grid: {
    promise: 'A month grid is six Sunday-first weeks of consecutive real dates that contain the whole month, with null only outside years 1 to 9999.',
    scope: `all ${monthCount.toLocaleString('en-US')} months, asked from the first and the last day of each`,
    check() {
      for (let month = 0; month < monthCount; month++) {
        const firstDay = monthStart[month];
        const start = firstDay - weekdays[firstDay];
        for (const reference of [iso(firstDay), iso(monthStart[month + 1] - 1)]) {
          const grid = call(`calendarMonthGrid("${reference}")`, () => calendarMonthGrid(reference));
          if (grid.length !== 42) throw new Counterexample(`calendarMonthGrid("${reference}") has ${grid.length} cells, not 42`);
          for (let cell = 0; cell < 42; cell++) if (grid[cell] !== iso(start + cell)) {
            throw new Counterexample(`calendarMonthGrid("${reference}") cell ${cell} (week ${Math.floor(cell / 7) + 1}, column ${cell % 7 + 1}) is ${JSON.stringify(grid[cell])}, the calendar says ${JSON.stringify(iso(start + cell))}`);
          }
        }
      }
    },
  },
};

let failed = 0;
for (const [name, property] of Object.entries(properties)) {
  if (only !== undefined && only !== name) continue;
  const started = performance.now();
  try {
    property.check();
    console.log(`PASS ${name}: ${property.promise}\n     checked ${property.scope} in ${((performance.now() - started) / 1000).toFixed(1)}s`);
  } catch (error) {
    if (!(error instanceof Counterexample)) throw error;
    failed++;
    console.log(`FAIL ${name}: ${property.promise}\n     counterexample: ${error.message}`);
  }
}
process.exit(failed === 0 ? 0 : 1);

function runMutants() {
  const work = mkdtempSync(join(tmpdir(), 'krds-calendar-date-'));
  let problems = 0;
  try {
    for (const mutant of mutants) {
      for (const file of sourceFiles) cpSync(`${defaultSrc}/${file}`, `${work}/${file}`);
      const original = readFileSync(`${work}/${mutant.file}`, 'utf8');
      if (original.split(mutant.find).length !== 2) {
        problems++;
        console.log(`STALE  ${mutant.name}: ${mutant.file} no longer contains exactly one \`${mutant.find}\`. The covered code changed; update this mutant.`);
        continue;
      }
      writeFileSync(`${work}/${mutant.file}`, original.replace(mutant.find, mutant.replace));
      const result = spawnSync(process.execPath, [self, '--src', work, '--only', mutant.caughtBy], { encoding: 'utf8' });
      const counterexample = /counterexample: (.*)/.exec(result.stdout)?.[1];
      if (result.status === 1 && counterexample !== undefined) console.log(`CAUGHT ${mutant.name} (${mutant.caughtBy}): ${counterexample}`);
      else { problems++; console.log(`MISSED ${mutant.name}: property ${mutant.caughtBy} did not fail.\n${result.stdout}${result.stderr}`); }
    }
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
  console.log(problems === 0 ? `All ${mutants.length} broken variants were caught.` : `${problems} of ${mutants.length} broken variants were not caught.`);
  return problems === 0 ? 0 : 1;
}
