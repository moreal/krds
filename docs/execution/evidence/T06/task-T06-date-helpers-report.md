# T06 shared Gregorian date helpers

Status: helper API implemented and public build verified; independent controller review pending. This is a new T06 dependency addition after historical T02 acceptance, not a reopening of the catalog or pilot specification scope. No UI/framework code, manifest, catalog JSON, spec, lockfile, subagent, commit or publishing action was introduced.

## Exact source inventory

- New `packages/contracts/src/calendar-date.ts`: pure ordinal-based weekday, addDays, clamped addMonths and six-week calendarMonthGrid. Inputs reuse parseIsoDate/formatIsoDate validation; day/month arithmetic checks bounds before addition, including maximal safe integer deltas. Day conversion uses bounded binary year search, not loops proportional to delta.
- New `packages/contracts/src/calendar-date.test.ts`: 83 date-helper behavior cases for Gregorian leap-century rules, Sunday=0 weekdays including year 1 Monday and year 9999 Friday, positive/negative/day/month/year crossings, January 31 clamps, malformed inputs and deltas, supported-year edges and exact42-cell Sunday-first grid alignment with adjacent real dates/null edge cells.
- Modified `packages/contracts/src/date.ts`: exported daysInMonth, reused by the existing date validator so leap/month-length rules have one implementation. Existing parse/format signatures and behavior preserved.
- Modified `packages/contracts/src/index.ts`: exports all five helpers from the public package entry.

Generated verification output is the clean rebuilt contracts dist containing the five production modules (calendar-date, date, types, catalog, index) and their declarations/maps; no test/probe output is present.

## Public API and semantics

```ts
daysInMonth(year: number, month: number): number
weekday(input: string | DateParts): 0 | 1 | 2 | 3 | 4 | 5 | 6
addDays(input: string | DateParts, delta: number): string | null
addMonths(input: string | DateParts, delta: number): string | null
calendarMonthGrid(referenceDate: string): ReadonlyArray<string | null>
```

ISO input is strict ASCII YYYY-MM-DD and parts must be actual Gregorian dates in years 1–9999. Invalid dates, invalid integer year/month, or non-safe-integer deltas throw RangeError. Valid arithmetic beyond that year range returns null; a month shift clamps the original day to the actual target month's final day. The grid always has 42 cells beginning Sunday on/before the reference month's first date, includes adjacent-month dates, and uses null only beyond year 1/year 9999. Grid referenceDate remains string-only. Inputs are never mutated. There is no Date/timestamp/timezone arithmetic or framework type/runtime import.

## Commands and evidence

All commands use the selected Node 24.18.0/Yarn 4.14.1 launcher, `node tools/yarn.mjs`.

| Command | Actual outcome | Log under `t06-date-helpers-logs/` |
| --- | --- | --- |
| `node tools/yarn.mjs workspace @krds-native/contracts test src/calendar-date.test.ts` | RED exit1:74 failed/9 passed because month lengths, weekdays, arithmetic, validation and grids were deliberately absent behind typed seams; no import/runner failure | `red.log` |
| Same focused source command after implementation | GREEN exit0:83 passed | `helpers-green.log` |
| `node tools/yarn.mjs nx run krds-contracts:test --skip-nx-cache --output-style=static` (first complete run) | exit1:153 passed/1 failed; existing live-catalog all-planned assertion conflicts with legitimately advanced T06 status; no helper failure | `contracts-existing-catalog-red.log` |
| `node tools/yarn.mjs nx run krds-contracts:build --skip-nx-cache --output-style=static` after removing contracts dist | exit0: real public JS/declarations emitted without tests/probes | `build.log` |
| `node tools/yarn.mjs nx run krds-contracts:typecheck --skip-nx-cache --output-style=static` | exit0 | `typecheck.log` |
| `node tools/yarn.mjs exec node .superpowers/sdd/PLAN/t06-date-helpers-logs/built-entry.mjs` | exit0: all five helpers exercised through actual dist/index.js, including strict RangeError and first/last-year grids | `built-entry.log`; assertion source `built-entry.mjs` |

Exact built-entry output:

```text
Built public ESM date helpers passed: month lengths, weekday, day/month arithmetic, strict errors and 42-cell boundary grids under Node 24.18.0.
```

Selected toolchain commands emit existing Nx NO_COLOR/FORCE_COLOR warnings. No broad workspace suite was executed or inferred passing. Controller direction requested the existing 71 contracts cases in addition to the new helper cases; the historical planned-state catalog assertion was reported to the controller for scoped fixture maintenance before a final package-green claim.

## Controller-approved fixture maintenance and final verification

Additional modified source inventory: `packages/contracts/src/catalog.test.ts`. The controller approved making planned coverage a local copy fixture because live native coverage has legitimately advanced. The test still validates both the planned fixture and actual live coverage, and checks all432 component/framework pairs. Negative cases mutate a fresh planned copy so an implementation claim without evidence cannot accidentally inherit real implementation evidence. Live catalog/coverage JSON is unchanged, and no validator test was removed.

Final command:

```sh
node tools/yarn.mjs nx run krds-contracts:test --skip-nx-cache --output-style=static > .superpowers/sdd/PLAN/t06-date-helpers-logs/contracts-green.log 2>&1
```

Actual exit0; exact summary:

```text
Test Files  3 passed (3)
     Tests  154 passed (154)
NX   Successfully ran target test for project krds-contracts
```

Thus all83 new helper cases plus the original71 contracts cases pass. The previous 153/154 result remains preserved in its RED log as evidence of the pre-existing fixture assumption, not concealed. The fixture-only change is excluded from production build by the existing tsconfig; no production code changed after the successful clean build, typecheck and built-entry smoke run. Final status: scoped implementation and verification complete; ready for independent review before controller acceptance.
