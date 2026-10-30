# T02 implementation report

Status: implemented; ready for the controller's independent review. No commit, push, tag or publication was performed. T00/T01 frozen interfaces and exact toolchain were consumed without changing manifests or the lockfile.

## Deliverables and exact source inventory

New:

- `packages/contracts/src/types.ts` — exact PLAN 4.1 FrameworkId, OpenChangeDetails, ValueChangeDetails, SelectOption, DateParts, DateRangeValue and ComponentCoverage semantic data types.
- `packages/contracts/src/date.ts` — strict Gregorian parse/format without Date construction or timezone conversion; malformed date parts throw RangeError.
- `packages/contracts/src/catalog.ts` — plain catalog types; pure catalog/coverage validators; native framework identities. Runtime dependencies: none. Imports: shared type only.
- `packages/contracts/src/date.test.ts` — 42 meaningful parse/format/date-boundary and malformed-parts cases.
- `packages/contracts/src/catalog.test.ts` — 29 integrity/scope/source/ownership/coverage cases.
- `catalog/components.json` — all 55 semantic IDs linked to frozen canonical IDs, URLs and exact source metadata; 54 web-applicable; no source scope reduction.
- `catalog/coverage.json` — 378 stable and 54 Solid 2 preview planned records; zero implementation/verification claims.
- `specs/components/README.md` — common state/event/reset/style/ownership conventions.
- `specs/components/button.md`
- `specs/components/native-select.md`
- `specs/components/modal.md`
- `specs/components/tabs.md`
- `specs/components/date-input.md`
- `specs/components/calendar.md`
- `tools/check-catalog.mjs` — source/coverage schema integration and source-byte/hash/spec/evidence-path checks using selected Node 24 built-in TypeScript stripping; calls the tested pure source validator.

Changed:

- `packages/contracts/src/index.ts` — replaces probe export with public pure types, date functions and catalog utilities.

Deleted with explicit controller authorization:

- `packages/contracts/tests/workspace-probe.test.ts` — obsolete T01 bootstrap assertion; no probe contributes coverage.

Controller/T01 integration owner changes, not authored by this delegate:

- Root `package.json`: `verify:catalog` → `node tools/check-catalog.mjs`.
- `packages/contracts/tsconfig.json`: excludes `src/**/*.test.ts` from production emission.
- Integration evidence: `.superpowers/sdd/PLAN/task-T02-T03-integration-report.md`.

Generated verification output: cleaned and rebuilt `packages/contracts/dist/`, containing only types/date/catalog/index JS, declarations and maps; no stale tests or probe artifacts. Generated outputs are not claimed as new source files.

## RED → GREEN evidence

All commands use `node tools/yarn.mjs`, which launches selected Node 24.18.0 and Yarn 4.14.1. No ambient Node 26 executes workspace tools.

| Command | Actual result | Log |
| --- | --- | --- |
| `node tools/yarn.mjs workspace @krds-native/contracts test src/date.test.ts` | RED exit 1: 23 failed, 15 passed; parsing valid dates, formatting, RangeError and round-trip behavior intentionally absent | `t02-logs/date-red.log` |
| `node tools/yarn.mjs workspace @krds-native/contracts test src/catalog.test.ts` | RED exit 1: 27 failed, 2 passed; validators initially accepted corrupt identities/scope/source/coverage | `t02-logs/catalog-red.log` |
| `node tools/yarn.mjs workspace @krds-native/contracts test src/date.test.ts` | Additional RED exit 1: 2 failed, 40 passed; null/undefined parts produced TypeError instead of required RangeError | `t02-logs/date-malformed-red.log` |
| `node tools/yarn.mjs nx run krds-contracts:test --skip-nx-cache --output-style=static` | GREEN exit 0: 2 files, 71 tests passed, no skipped/empty suites | `t02-logs/contracts-green.log` |
| `node tools/yarn.mjs verify:catalog` | GREEN exit 0: 55 records, 54 web; all 55 source hashes; 378 stable + 54 preview, 0 verified | `t02-logs/catalog-green.log` |
| `node tools/yarn.mjs nx run krds-contracts:build --skip-nx-cache --output-style=static` | GREEN exit 0 after cleaning output; only public source artifacts emitted | `t02-logs/contracts-build.log` |
| `node tools/yarn.mjs nx run krds-contracts:typecheck --skip-nx-cache --output-style=static` | GREEN exit 0 | `t02-logs/contracts-typecheck.log` |
| `node tools/yarn.mjs exec node --input-type=module -e <built-entry assertions>` | GREEN exit 0: built public ESM entry executes actual leap-day parsing, padded formatting and validator export without framework runtime | `t02-logs/built-entry.log` |
| `node tools/yarn.mjs verify:workspace` | GREEN exit 0: pins, linker, metadata and import/dependency boundaries | `t02-logs/workspace-check.log` |
| `node tools/yarn.mjs test --output-style=static` | Exit 1: only `fixture-angular:build` failed; `krds-docs:test` not run due to dependency failure. Other shown tasks and 21 workspace-boundary cases passed. No full-suite-success claim. | `t02-logs/workspace-tests.log` |

Log paths are relative to this report's directory. Initial build/typecheck exposed test-only `node:fs` type errors and unwanted test emission; the integration owner's production exclusion resolved both. Final build/typecheck logs contain the successful reruns. Nx emits pre-existing NO_COLOR/FORCE_COLOR warnings; these are recorded, not hidden.

The broad Angular run prints `Building...` then a generic nonzero command result, without a more specific error/exit code. The controller identified a known T01 sandbox Angular startup limitation (separate T01 evidence reportedly records exit 129 and a successful bounded-worker run outside sandbox); this report does not infer that exit code or cause from T02's log. Per controller direction, no broad-suite retry or unrelated Angular edit was made.

## Decisions and review notes

- Preserve PascalCase export names and semantic kebab-case IDs independently of canonical IDs: NativeSelect → native-select → component_06_03; FAB → fab; TTS → tts. SplashScreen remains in catalog, excluded only from web coverage using its frozen source classification.
- All planned component/framework pairs remain visible, including non-pilots and Solid 2 preview. Future spec paths are reservations; only six pilot specs are currently asserted present. Empty non-pilot variants mean pending T10, not absence upstream. `implementationOwner: T10` denotes full-catalog expansion accountability; `implementationOwners` maps pilot implementation to T06/T07/T07Q/T07A/T08/T09 by framework.
- Pure production files have no framework/runtime/test imports; shared payloads contain plain data. Real tsc output and built-entry execution independently prove the CLI's source import is not substituting for a missing public build.
- Specs distinguish frozen official requirements from project defaults. Tabs default to manual activation and retain every enabled tab in sequential Tab order, with additive arrows/Home/End; automatic activation is opt-in. Calendar likewise preserves KRDS sequential button access instead of inheriting a roving-only backend default.
- Modal defaults to no outside dismissal; opt-in requires a primary gesture starting/ending on backdrop. Escape requires visible close button, explicit permission, topmost dialog and an unhandled non-composing event. Controlled rejected close preserves isolation/focus trap; actual close restores focus with defined fallback. Close icon stays last in markup.
- Single/range dates use strict ISO text, explicit inclusive bounds, raw draft separate from committed value, IME-safe commit boundaries and translated Korean names. Calendar selection is tentative until Confirm; Cancel preserves input value. Direct reversed ranges are errors; unordered calendar endpoint clicks are sorted. Form submission cannot silently send an invalid/stale draft. Locale never changes date storage/parsing or invokes timezone conversion.
- No renderer, wrapper, generic UI factory, remote request, unrelated compliance change, subagent or Git mutation was introduced. The spec is an implementation contract, not adapter completion or comprehensive release evidence. `verify:catalog` is an integrity gate; T10 still owns the full evidence/release coverage validator.

No T02 source blocker remains. Independent review and later native adapter behavior evidence remain pending with their owning tasks.

## Fix round 1 — Modal source alignment

Status: both Important findings in `task-T02-review.md` addressed in `specs/components/modal.md`; ready for focused rereview. Only that spec, this appended report and two local review logs changed in this round. This section supersedes the earlier report's original Modal option summary.

- Removed the independent `closeOnEscape` option. A provided icon close button or required explicit close/cancel action mandates Escape dismissal, subject to the unchanged topmost, inner-widget-handled and IME safeguards. Controlled rejected dismissal still keeps the dialog, isolation and focus trap open. Hiding the icon close button does not disable Escape when the required explicit close action exists.
- Constrained `initialFocusId` to the dialog container or its first enabled/visible/focusable interactive element in logical DOM order; later interactive targets are configuration errors. The default remains dialog-container focus.
- Made the usable saved opener the mandatory return target. `returnFocusId` applies only if the opener is absent or unusable, including initially open dialogs. An unusable/missing alternate falls through to the remaining usable opener ancestor and then body, preserving the removed-opener fallback and unmount cleanup.

Manual source-alignment review checked frozen `component_04_05.html:1134` (initial dialog/first interactive, return opener), `:1187` and `:1231` (Escape executes closing when a close button is present). The revised API/focus/Escape/return/acceptance paragraphs are captured together with those original lines in `t02-logs/modal-fix-round1-alignment.log`. This is a focused human-readable comparison, not a new behavioral test or adapter verification claim.

Exact source-comparison command executed (exit 0), with full output in that log:

```sh
python3 - <<'PY' > .superpowers/sdd/PLAN/t02-logs/modal-fix-round1-alignment.log
from pathlib import Path
path=Path('upstream/krds/raw/components/component_04_05.html')
lines=path.read_text().splitlines()
for number in [1134,1187,1231]:
 print(f'{path}:{number}: {lines[number-1].strip()}')
print('\nRevised Modal contract (manual source-alignment review):')
path=Path('specs/components/modal.md')
for number,line in enumerate(path.read_text().splitlines(),1):
 if number in [11,17,21,23,29]:print(f'{path}:{number}: {line}')
PY
```

Targeted integrity command executed (exit 0):

```sh
node tools/yarn.mjs verify:catalog > .superpowers/sdd/PLAN/t02-logs/modal-fix-round1-catalog.log 2>&1
```

Exact output:

```text
Catalog verified: 55 frozen records, 54 web-applicable; 55 source hashes checked.
Coverage tracking: 378 stable + 54 preview entries; 0 verified. This is integrity validation, not a release coverage gate.
```

The passing contracts suite was not rerun for this prose-only correction, as directed. No broad suite, source code, catalog state, dependency, subagent, commit or publication change was made.
