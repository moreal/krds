# T06 shared Gregorian date helpers review

Spec compliance: ✅

Code quality: Approved

Reviewed the five-file scoped review package against the exact helper API in `task-T06-date-helpers-report.md` and the date-only/shared-contract requirements in `task-T06-interfaces.md`. This review covers shared helpers and the approved catalog test fixture maintenance only; it is not T06 UI or framework acceptance.

## Findings

- Critical: none.
- Important: none.
- Minor: none requiring changes.

## Strengths and contract checks

- `packages/contracts/src/date.ts:24`: `daysInMonth` validates integer years 1–9999 and months 1–12, preserves Gregorian century exceptions, and supplies the existing date validator with the same month-length rule.
- `packages/contracts/src/calendar-date.ts:6`: strict ISO strings reuse `parseIsoDate`; parts reuse `formatIsoDate` validation. The helpers do not write to caller input or import framework/runtime date facilities.
- `packages/contracts/src/calendar-date.ts:21`: the ordinal formula correctly counts leap days before the year; Monday at ordinal zero produces Sunday-zero weekdays. The inverse binary search is bounded to years 1–9999 and then traverses at most 12 months.
- `packages/contracts/src/calendar-date.ts:58`: both arithmetic operations reject non-safe-integer deltas and check the allowed displacement before adding. Consequently even maximal safe deltas cannot cause precision loss, and valid out-of-range results return `null`. Month arithmetic clamps the original day to the target month's actual length.
- `packages/contracts/src/calendar-date.ts:79`: grids validate their string-only reference, anchor to the month's first day, start on the Sunday on/before it, emit exactly 42 cells, retain adjacent dates, and use `null` only outside the supported years.
- `packages/contracts/src/index.ts:5`: all five requested helpers are exported through the public entry without adding a renderer dependency.
- `packages/contracts/src/calendar-date.test.ts:5`: the added cases exercise leap-century behavior, weekday anchors, both arithmetic directions, exact supported-range crossings, extreme deltas, malformed values, input preservation, month clamping, Sunday starts, and both boundary grids.
- `packages/contracts/src/catalog.test.ts:9`: planned coverage is a detached local fixture with cleared evidence; negative cases clone it afresh. Actual live coverage still goes through `validateCoverage`, the 432-entry fixture assertion remains, and the existing negative validator cases are retained.

## Verification and limits

The implementation report records 83 new helper cases plus 71 existing contracts cases passing (154 total), a clean public build, typecheck, and execution of all five helpers from the built public ESM entry. Those reported checks were not rerun during this read-only review, as directed. Mathematical bounds and conversion logic were inspected directly; no unanswered arithmetic edge required an additional focused execution. No claim is made about wider workspace suites or native component behavior.

Reviewed the supplied diff once. No source changes, Git operations, dependency changes, or publishing actions were performed; this review report is the only output.
