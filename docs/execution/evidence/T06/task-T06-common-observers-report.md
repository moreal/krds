# T06 scoped common observers report

Status: DONE for scoped common observer integration; independent controller review remains. T05 reports and prior evidence remain historical and unchanged. No commits, subagents, publication, root/lock/package metadata changes, app/widget implementation, contracts changes or data-file edits were made by this owner.

## Scope and exact diff

Changed exactly three source files:

- `tools/testing/observations.mjs`: separate controlled NativeSelect and uncontrolled form-reset observations; new standalone Calendar selection/confirmation observation.
- `tools/testing/contract.spec.ts`: dispatches explicit native-select case IDs and `calendar/selection-confirm`; unknown components/cases have explicit failure instead of falling through to DateInput.
- `tools/tests/contract-observations.test.mjs`: three focused behavior regressions using correct and deliberately incorrect plain native inspection fixtures. These award zero KRDS, native adapter or catalog coverage.

`tools/tests/harness.test.mjs` and all runner/config/package/root files remain unchanged. Existing root and owning-workspace test commands already include the observation test file, so no root file-list change was needed.

The exact unified three-file diff is `t06-common-observers-logs/source.diff`. Its baseline was recovered from the final T05 review package / a pre-T06 reconstruction and validated against the original recorded SHA256 for each file; `baseline-verification.json` records this check. Current hashes are `source-hashes.json`. Hashes remained unchanged when the lead's completed native contract report was read.

## NativeSelect behavior

`assertNativeSelectControlled(page, driver)` begins with zero events, injects semantic controlled `{value:'busan'}`, observes the actual combobox value and still zero notifications, then performs native `selectOption('seoul')`. The displayed value must become `seoul` and the full event history must be exactly one `{name:'valueChange',detail:{value:'seoul'}}`.

`assertNativeSelectReset(page, driver)` starts at uncontrolled native baseline `seoul`, performs user `selectOption('busan')`, observes exactly one busan value notification, clicks reset `초기화`, and requires `seoul` with the exact same event history. This path never uses `setState` to simulate user selection.

The inspection regression uses an actual native form/select with `selected` default and its browser reset action. Correct controlled and uncontrolled implementations pass. A controlled prop update that emits, duplicated user notifications and a reset callback that adds a value event are each rejected.

## Calendar case handoff

Common owner and `/root/sol_execution_resume/t06_lead` agreed this before the lead edited pure data:

- Native route `/fixtures/calendar?case=selection-confirm`.
- Pure initial state `{mode:'single',value:null,referenceDate:'2024-02-01',min:'2024-02-01',max:'2024-03-31',locale:'ko-KR'}`. Omit `today`; no clock-derived state.
- Visible heading `2024년 2월`; real native table with seven full-name weekday column headers and `scope=col`, six date rows / 42 date cells. No dialog wrapper or Today button.
- Initially no pressed date and no events. Choose exact base Korean date name `2024년 2월 29일 목요일`. After selection a `, 선택됨` suffix is permitted; the tentative date must have `aria-pressed=true` and no value event.
- Click Confirm `확인`. Event history must be exactly `[{name:'valueChange',detail:{value:'2024-02-29'}}]`. The canonical fixture does not separately record the confirm action hook.

`assertCalendarSelectionConfirm` observes those native structure, accessible-name, tentative-state and notification outcomes. The inspection calendar uses fixed Gregorian UTC data only to create plain DOM for the gate test; it is not an adapter/widget implementation. Correct tentative selection passes. An eager value event on date click and a duplicated Confirm value event are each rejected.

The lead exclusively added/synchronized `catalog/fixture-cases.json`, source scenario data and production fixture state, then built `@krds-native/test-contracts`. This owner ran no Solid app command or Vite process and did not race that build or the lead's actual contract queue.

## Executed commands and outputs

All commands start with selected-toolchain `node tools/yarn.mjs` (Node24.18.0 / Yarn4.14.1). Local browser/server commands used approved execution and the existing `/private/tmp/krds-playwright-1.64.1` cache; no browser installation or external requests were needed. Logs below are under `t06-common-observers-logs/`.

| Command after launcher | Actual result | Log |
| --- | --- | --- |
| `exec node --test --test-name-pattern 'native select\|table calendar' tools/tests/contract-observations.test.mjs` before helpers | expected RED3, missing observations | `01-observers-red.log` |
| Same focused command after implementation | PASS3/3; correct and deliberately incorrect inspection outcomes checked | `02-observers-green.log` |
| `test:harness` after lead synchronized pure data/build | PASS16/16,0failed | `03-root-harness.log` |
| `workspace @krds-native/test-contracts test` | PASS15/15,0failed from actual private-workspace cwd | `04-workspace-harness.log` |

No broad native or Angular suite was run by this owner. Existing date/focus/disabled and request-policy regressions remain green within the scoped common root/workspace entries.

## Separate native execution evidence supplied by lead

Lead ran `node tools/yarn.mjs test:contract --framework solid` on its fresh production build: exit0,10/10 actual native cases passed, including both NativeSelect observations and the new Calendar case. Owner log is `.superpowers/sdd/PLAN/t06-lead-logs/final-contract.log`; report is `test-results/t05/contract-1793325215776-6380-b59753e4/report.json`.

This common owner read the completed report and verified all ten passing results, the selected three case results and their `nativeHealth:true` evidence. The compact extraction is `t06-common-observers-logs/05-lead-native-contract-evidence.json`. This is distinct from the plain inspection regression evidence; it is not attributed to a common-owner app execution.

Source and test changes are frozen for independent review. No coverage status or T05 historical verification record was altered by this scoped integration.

## Common review fix round1

Read `task-T06-common-observers-review.md` completely and addressed both Important findings. The exact provided baseline is `task-T06-common-fix1-base/`; the scoped delta and current fingerprints are `t06-common-observers-logs/fix1-source.diff` and `fix1-source-hashes.json`.

Changed only the same three common files:

- `tools/testing/observations.mjs`: Calendar now requires exactly six native `tbody > tr` date rows, exactly seven native `td` cells in each row, exactly one visible native `button[type="button"]` and one semantic button per date cell. Existing month heading, native table, weekday headers, exact full Korean date interaction, tentative `aria-pressed` and exact single Confirm event remain required. Added `assertFixtureCaseSupported` for the ten exact implemented component/case pairs.
- `tools/testing/contract.spec.ts`: validates the complete component/case pair before route/observer dispatch for canonical selections. Button/Modal/Tabs typos cannot silently select another valid behavior. Explicit infrastructure probe selection remains separate.
- `tools/tests/contract-observations.test.mjs`: new negative browser inspections preserve the misleading total42 count while concentrating all cells into one row, remove every date button except February29, replace other date controls with non-native role=button spans, and change a native date button to type=submit. All are rejected. A focused guard regression rejects recognized-component case typos for Button/Modal/Tabs and accepts both supported Modal cases. Inspection fixtures remain zero coverage.

### Exact commands and results

All commands use `node tools/yarn.mjs`; approved browser execution uses only local inspection fixtures and the existing browser cache. No apps, widgets, shared fixture data, contracts, root metadata, dependencies or lockfiles were changed. No app/Vite or broad native suite was run by the common owner.

| Command after launcher | Actual result | Log under `t06-common-observers-logs/` |
| --- | --- | --- |
| `exec node --test --test-name-pattern 'calendar rejects\|known component case' tools/tests/contract-observations.test.mjs` before observer fixes | expected RED3: malformed row/missing buttons were wrongly accepted; complete pair validator missing | `fix1-01-red.log` |
| Same focused command after fixes | PASS3/3; malformed rows, missing/non-native/wrong-type controls and case typos rejected | `fix1-02-green.log` |
| `test:harness` | PASS19/19,0failed; executed once for this final fix candidate | `fix1-03-root-harness.log` |
| `workspace @krds-native/test-contracts test` | PASS18/18,0failed from actual owning-workspace cwd; executed once for this candidate | `fix1-04-workspace-harness.log` |

All current source changes were complete and the three-file hashes frozen before requesting the lead's canonical Solid10 rerun. The earlier10/10 native result above is historical to the pre-review candidate and is not claimed as execution of the current bytes. Lead exclusively owns that actual app/build/runner queue; the request was sent after focused RED→GREEN and while the final common harness entries ran. Current native rerun evidence will be recorded separately when supplied by lead.

Source is frozen for independent review. No commits, subagents or publishing occurred.
