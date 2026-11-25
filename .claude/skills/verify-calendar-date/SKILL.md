---
name: verify-calendar-date
description: Exhaustively check the shared Gregorian date arithmetic in packages/contracts (parseIsoDate, formatIsoDate, daysInMonth, weekday, addDays, addMonths, calendarMonthGrid) against the real calendar. Use before finishing any change to packages/contracts/src/date.ts or calendar-date.ts, or when a calendar or date input in any adapter shows a wrong date, weekday, or month grid.
---

# Verify calendar date arithmetic

Every adapter's Calendar and DateInput gets its dates from seven functions in `packages/contracts/src`. A wrong answer there puts a wrong date, a wrong weekday, or a missing day in front of someone filling in a government form, in all eight frameworks at once. The unit tests in `calendar-date.test.ts` and `date.test.ts` check a few dozen hand-picked dates. This check covers every date from 0001-01-01 through 9999-12-31.

## Run it

From the repo root:

```bash
node .claude/skills/verify-calendar-date/check.mjs
```

It takes about a minute and exits 0 when every property holds. It relaunches itself under the Node version in `compatibility/toolchain.json`, runs the TypeScript source directly, and needs no build and no install.

It compares the source with the JavaScript engine's own calendar, `Date` in UTC, which shares no code with this repo. No verifier that proves properties of TypeScript is available to this repo, so the check enumerates the inputs instead. The date range is finite, so for most properties that enumeration is complete.

## What it checks

| Property | Promise | Inputs checked | Complete? |
| --- | --- | --- | --- |
| `strings` | `parseIsoDate` accepts a `YYYY-MM-DD` string exactly when it names a real day. `formatIsoDate` prints the parsed date back unchanged. `daysInMonth` matches the calendar. | All 100,000,000 strings of the shape `dddd-dd-dd`. | Yes, for that shape. |
| `weekday` | `weekday` returns the real day of the week, Sunday as 0. | All 3,652,059 dates. | Yes. |
| `days` | `addDays` lands on the real date that many days away, or returns null outside years 1 to 9999. | Every date to and from both ends of the range, one day either way, one day past each limit, the extreme safe integers, and one pseudo-random target per date. | Bounded. See below. |
| `months` | `addMonths` keeps the day of the month, moves to the last real day of a shorter month, or returns null outside the range. | Every date by 0, ±1, ±12, ±13 months, to the first and last month, one month past each limit, and one pseudo-random target month. Every target month from each day of 0001-01 and of 9999-12. | Bounded. See below. |
| `grid` | `calendarMonthGrid` returns six Sunday-first weeks of consecutive real dates that contain the whole month, with null only outside the range. | All 119,988 months, asked from the first and the last day of each. | Yes, for those reference days. |

`days` does not try every pair of date and delta, because there are about 1.3 × 10^13 of them. It does show that every date converts to its day number and back correctly. `addDays` is that conversion with one addition and one range check between, and the range check is tested at both limits for every date. A change that makes `addDays` do more than that needs new cases here. `months` has the same shape, with every target month and every day clamp covered from two source months.

Not covered:

- Strings that are not ten characters of digits and hyphens, and non-string or non-integer arguments. The unit tests cover a sample of those.
- The date models each adapter keeps for itself, such as `packages/react/src/components/calendar/model.ts` and `packages/vue/src/components/date-model.ts`: min and max bounds, range ordering, disabled days.
- Rendering, focus movement, and keyboard handling. `node tools/yarn.mjs test:contract --catalog --automated` covers those in a browser.

## Covered code

| File | Functions |
| --- | --- |
| `packages/contracts/src/date.ts` | `parseIsoDate`, `formatIsoDate`, `daysInMonth`, and the private `validDate` |
| `packages/contracts/src/calendar-date.ts` | `weekday`, `addDays`, `addMonths`, `calendarMonthGrid`, and the private `ordinal`, `fromOrdinal`, `daysBeforeYear`, `dateParts` |

Last confirmed in step with the code at commit `7a3ef4aeac8d74d8c7d28b2090574179b5f98faa`.

To see whether the covered code moved since then:

```bash
git diff --stat 7a3ef4aeac8d74d8c7d28b2090574179b5f98faa -- packages/contracts/src/date.ts packages/contracts/src/calendar-date.ts
```

If that prints anything, run both commands in this skill and read the next two sections before you trust a pass. Move the commit above forward only after you have run both, read the diff, and confirmed that the tables in this file still describe the code.

## Reading a failure

A failure names the property and gives one call with what the code returned and what the calendar says:

```
FAIL days: Adding days lands on the real date that many days away, or null outside years 1 to 9999.
     counterexample: addDays("0001-12-31", 1) threw RangeError: ...
```

Each property stops at its first counterexample, which is the earliest date that breaks, so later breaks may exist. Reproduce the call in a unit test in `packages/contracts/src/calendar-date.test.ts` and fix the source. Do not edit the expected values in `check.mjs` to make a failure pass.

The check itself is wrong only in these cases:

- The promise changed on purpose, for example Monday-first grids or a different year range. Update the property's `promise`, `scope`, and expected value in `check.mjs`, the tables here, and the mutants.
- The check crashes with something other than `FAIL`, such as an import error after a file was renamed or split. Fix the paths in `check.mjs` and the Covered code table.

## Prove the check can still fail

```bash
node .claude/skills/verify-calendar-date/check.mjs --mutants
```

This copies the source to a temporary folder, breaks one line at a time, and expects the named property to fail on each of the eleven broken variants. It takes about ten seconds and never touches the working tree.

- `CAUGHT` is the expected result.
- `STALE` means the line a mutant rewrites is no longer in the source. The covered code changed. Update the mutant's `find` and `replace` in `check.mjs` so it breaks the new code in the same way, then rerun.
- `MISSED` means a property passed on broken code. The property is too weak. Strengthen it before you rely on it.

When you add a function to the covered files, add a property for it and at least one mutant that breaks it.
