# T06 Solid controls handoff

Implemented native Solid 1 Button and NativeSelect. Current scoped evidence after review fix round 2: controls 31/31 and canonical native suite 77/77 pass after public rebuild; source/fixture typechecks pass. Earlier RED/GREEN results below are retained history. This is component implementation evidence, not whole-T06 or visual acceptance.

## Owned files

- `packages/solid/src/components/button/index.tsx`
- `packages/solid/src/components/native-select/index.tsx`
- `apps/fixture-solid/tests/siheom/button.test.tsx`
- `apps/fixture-solid/tests/siheom/native-select.test.tsx`
- `apps/storybook-solid/src/stories/button.stories.tsx`
- `apps/storybook-solid/src/stories/native-select.stories.tsx`

Public indexes, package exports, fixture mappings, shared data, dist and build/browser queue remain lead-owned. No dependency, provider, catalog, lockfile or shared CSS edits were made by this owner. No commits, pushing or publication.

## Source and API

Read common component conventions, authoritative Button/NativeSelect specs, shared token/style READMEs and CSS, and frozen KRDS detail pages `upstream/krds/raw/components/component_05_02.html` and `component_06_03.html`. Implemented independent renderer code; no source JavaScript or assets incorporated and no remote content loaded.

`Button` / `ButtonProps`: native Solid button attributes, children/ref/callbacks, type default `button`; variant primary/secondary/tertiary/text/icon; size xsmall/small/medium/large/xlarge; optional decorative `icon: JSX.Element` slot. Browser owns pointer/Enter/Space activation, validation, submitter FormData and cancelable reset. Public root/label/icon parts and disabled state match CSS. Missing action names and malformed type/variant/size throw TypeError. Decorative/hidden label content does not satisfy the action name requirement.

`NativeSelect` / `NativeSelectProps`: native Solid select attributes/ref/callbacks except children/multiple/native numeric size/value; required `SelectOption[]`; string value/defaultValue, label/hint/error JSX, invalid, small/medium/large size, and `onValueChange(ValueChangeDetails<string>)` from contracts. ID is supplied or native createUniqueId; label/hint/error relationships remain explicit. Options preserve order and native disabled semantics. Controlled prop updates never emit. A declined native change immediately restores the authoritative value even when its prop did not change. Uncontrolled changes update then emit once. Configuration conflicts, mode changes, duplicates and invalid values throw TypeError. Document capture listener observes associated form reset, defers restoration past the native algorithm, respects cancellation, restores captured initial baseline/absent selection and cleans up on disposal. No Ark public types or foreign renderer.

## Stories and state requests

Explicit CSF IDs `krds-button` and `krds-native-select`; no play/loaders/network. Existing canonical IDs remain `krds-button--disabled` and `krds-native-select--controlled`.

Button adds default, secondary, tertiary, text, icon, loading and local-action. Loading is application-owned disabled content, not an invented persistent component state. NativeSelect adds default, rejected-change, selected, disabled, invalid and form-reset. Controlled state is a local Solid signal; rejected state leaves the prop fixed. Invalid state has an explicit enabled empty placeholder, required validity, hint and visible error. All state and export details were sent to the lead; no new canonical coverage claims requested.

## Actual RED/GREEN evidence

Raw logs are in `t06-controls-logs/` (copies of lead-owned logs plus worker noEmit checks). See `commands-and-results.txt` for commands and exact outcomes.

1. Initial public-entry RED: 15 failures because Button/NativeSelect were missing, before implementation.
2. First implementation: 12 substantive native tests passed; three canonical tests still failed at missing fixture mappings, subsequently integrated by lead.
3. Added icon accessibility regression: 15 passed and one expected failure; fixed naming validation only after observed RED.
4. Lead all-six native run: controls 16/16 passed. Overall 41 passed / 6 failed. The remaining failures were DateInput invalid-draft error query, range error query, popup naming; Modal initially-open fallback; Tabs empty-state query and duplicate rejected automatic click. Owners/lead are handling those.
5. Worker final source typecheck: `node tools/yarn.mjs workspace @krds-native/solid typecheck`, exit 0. Storybook source typecheck: `node tools/yarn.mjs workspace @krds-native/storybook-solid typecheck`, exit 0.

Owned tests cover real native element types, default non-submission, exactly-once pointer/Enter/Space release, explicit submit/reset and canceled reset, enabled/disabled named submitter FormData, reactive disabled, accessible icon names, first enabled select option, source order, FormData, required empty placeholder, disabled options/whole control, controlled rejected requests and programmatic updates, exact semantic callback payloads, no submit-on-change, captured reset baseline, external form association, hint/error linkage, absent selection reset and configuration errors.

## Remaining acceptance and limits

Final all-six suite, canonical contracts/stories, built Storybook rendering, external request blocking and actual image inspection (focus-visible, forced colors, narrow viewport and 200% text zoom) are lead-owned and remain required. This owner has not claimed visual acceptance or catalog implemented/verified status. Native popup interaction sequences remain platform-owned and are deliberately not intercepted or standardized across OSes.


## Review fix round 1 (2026-10-30)

Finding: NativeSelect treated every non-null label prop as an accessible name. Changed only its component source, owned naming tests and the owned Controlled story.

Added ten native regressions: reject empty/whitespace/false/aria-hidden-only JSX labels when no alternative name exists; accept each with explicit `aria-label`; accept explicit `aria-labelledby`; preserve visually hidden accessible label text. After observing the four expected rejection failures, the source now captures the rendered label and validates its meaningful text, excluding hidden and aria-hidden descendants while retaining CSS visually hidden text and explicit naming alternatives.

Separately aligned `krds-native-select--controlled` options to the exact common fixture: `[{value:'seoul',label:'서울'},{value:'busan',label:'부산'}]`. Other showcase stories retain the disabled illustrative option. This story change requires the lead's final Storybook rebuild.

Exact RED command, run by lead's serialized browser queue:

```sh
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs workspace @krds-native/fixture-solid siheom:local tests/siheom/native-select.test.tsx
```

Observed result: exit 1, one failed file, four failed / sixteen passed tests (twenty total). Each failure is the intended empty/whitespace/false/decorative-only label rejection regression. Raw output: `t06-controls-logs/review-round1-red.log`.

Worker source verification after fix: `node tools/yarn.mjs workspace @krds-native/solid typecheck`, exit 0, empty output, recorded in `t06-controls-logs/review-round1-solid-typecheck.log`. The lead subsequently rebuilt public Solid output and observed the full six-file GREEN result recorded below.

Additional noEmit checks for the new test cases and story alignment: `node tools/yarn.mjs workspace @krds-native/fixture-solid typecheck` and `node tools/yarn.mjs workspace @krds-native/storybook-solid typecheck`, both exit 0 with empty output. Logs: `t06-controls-logs/review-round1-fixture-typecheck.log` and `review-round1-storybook-typecheck.log`.


Review round 1 GREEN, after public rebuild, exact lead command:

```sh
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs workspace @krds-native/fixture-solid siheom:local tests/siheom/button.test.tsx tests/siheom/native-select.test.tsx tests/siheom/modal.test.tsx tests/siheom/tabs.test.tsx tests/siheom/calendar.test.tsx tests/siheom/date-input.test.tsx
```

Observed result: exit 0, six files passed, sixty-nine tests passed; owned controls twenty-six passed (Button six, NativeSelect twenty). All four reviewed accessible-label rejection regressions and all explicit/visually hidden positive naming cases pass. Logs: `t06-controls-logs/review-round1-green.log`; public build output `t06-controls-logs/review-round1-build.log`. Source and owned story/test scope are frozen for targeted review. This resolves the scoped naming finding without claiming whole-T06 or visual acceptance.


## Review fix round 2 (2026-10-30)

The first naming fix unintentionally required DOM text nodes and rejected otherwise valid native JSX labels named by a text alternative. Added focused native regressions for a self-contained local image with nonempty alt and a named image-role descendant. Also added a positive hidden-ancestor regression: a properly labeled field can mount in an inactive container and exposes its native accessible name when shown. The controller selected a narrow conservative presence guard with no new runtime dependency or homemade full ACCNAME algorithm. The lead observed the expected focused RED result before source repair: two failed / twenty-one passed tests (twenty-three total). After that result, the narrow source repair accepts nonempty native image alt and image-role aria-label text alternatives in the existing hidden/decorative-pruned label content. The source comment explicitly identifies this as a conservative presence guard, not a full ACCNAME implementation. No dependencies, manifests or shared source changed.


Exact fix-round-2 RED command:

```sh
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs workspace @krds-native/fixture-solid siheom:local tests/siheom/native-select.test.tsx
```

Observed exit 1, one failed file, two failed / twenty-one passed tests. Failures were exactly the local-image-alt and named-image-role label regressions. Raw log: `t06-controls-logs/review-round2-red.log`. Post-fix noEmit commands `node tools/yarn.mjs workspace @krds-native/solid typecheck` and `node tools/yarn.mjs workspace @krds-native/fixture-solid typecheck` both exited 0 with empty output (`review-round2-solid-typecheck.log` and `review-round2-fixture-typecheck.log`). Public rebuild and lead canonical GREEN subsequently passed as recorded below.


The lead identified the same load-bearing valid-content gap in Button's existing label-only text guard. The controller extended this bounded round to Button. Added two native positive regressions for local-image alt and a named image-role child. Exact lead RED command:

```sh
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs workspace @krds-native/fixture-solid siheom:local tests/siheom/button.test.tsx
```

Observed exit 1, two expected new failures / six existing passes (eight total), raw output `t06-controls-logs/review-round2-button-red.log`. Only after that RED, Button received the same conservative text-alternative presence guard within its label content. Its separate icon slot remains decorative and excluded; the original decorative-only rejection test is retained. Button's public native JSX children remain accepted without imposing DOM-text-only content. Fresh post-both-fixes Solid and fixture noEmit checks both exited 0 (same round2 log paths above). No public API, provider, exports, shared styles, manifest or dependency changed.


Final fix-round-2 verification, lead-owned queue:

```sh
node tools/yarn.mjs test:siheom --framework solid
```

Observed exit 0; native canonical suite 77/77 passed, including all 31 owned controls tests (Button 8, NativeSelect 23). Public build and lead typechecks passed. Read raw output before reporting success: `t06-controls-logs/final-siheom-77.log` and `final-public-build.log`. Root report: `test-results/t05/siheom-1793327466349-27865-88667273/report.json`, also copied to `t06-controls-logs/review-round2-canonical-report.json`.

Fix inventory: two source guards (`button/index.tsx`, `native-select/index.tsx`), two corresponding test files with five focused positive regressions total; no further story/API/shared-file/dependency change in this round. Original blank/false/hidden-only/decorative rejection tests and explicit-name cases remain passing; newly accepted text-alternative labels are verified through actual native browser accessible-name assertions. Guard remains deliberately conservative and is not a complete ACCNAME certification helper. Source is frozen for targeted re-review. Lead retains all final visual/story/release acceptance; no whole-T06 acceptance, commits or publication claimed.
