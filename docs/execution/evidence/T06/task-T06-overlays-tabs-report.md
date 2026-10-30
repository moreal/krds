# T06 Solid Modal and Tabs implementation

Owned source, local stories and native behavior verification complete and frozen. Final lead-owned production/visual integration is in progress. This component slice is not whole T06 integration/visual acceptance.

## Owned files

- `packages/solid/src/components/modal/index.tsx`
- `packages/solid/src/components/tabs/index.tsx`
- `apps/fixture-solid/tests/siheom/modal.test.tsx`
- `apps/fixture-solid/tests/siheom/tabs.test.tsx`
- `apps/storybook-solid/src/stories/modal.stories.tsx`
- `apps/storybook-solid/src/stories/tabs.stories.tsx`

No public index, provider, fixture source, catalog, dependency manifest, shared styles/contracts or lockfile edits. Integration lead owns exports and public dist/browser queue. No subagents, commits, push, publishing or tags.

## Binding sources

Read task-T06-overlays-tabs-brief.md, task-T06-brief.md, task-T06-interfaces.md, task-T06-solid-interface.md, repository AGENTS.md, specs/components/README.md, modal.md and tabs.md, styles README/CSS and provider implementation. Inspected frozen upstream component_04_05.html focus/markup/Escape guidance and component_04_10.html sequential Tab and Click/Enter guidance. Original KRDS JavaScript is not executed, and no upstream code/assets were copied. Implementations are Solid-owned native DOM, Solid Portal/context/lifecycle, plain public semantic callback payloads, and shared data-krds attributes. No Ark controller is needed for the specified behavior, and no Ark types appear in public props.

## Public API

`Modal` and `ModalProps`: native HTML div attributes plus required JSX `title`, optional titleId/description/descriptionId/children/actions; open/defaultOpen/onOpenChange; closeOnOutsideClick/showCloseButton/initialFocusId/returnFocusId; closeLabel/locale/id. Native `ref` reaches the dialog container. The opener is an external application button, as agreed with the lead; there is no wrapper-owned trigger prop. Callback is exactly `{ open: false }` for accepted user dismissal requests. Programmatic props and mount emit no callback. Controlled rejection retains actual-open UI, focus trap, inert and body scroll lock. First-open initial mount has no opener. Actual later openings save active opener; usable opener wins over fallback. Final icon close is type=button and last in dialog markup. Escape is always enabled for the required close policy, guarded by topmost/defaultPrevented/composition/229. Backdrop dismissal requires opted-in, complete primary pointer down/up on the backdrop. The module coordinates nested modal isolation per ownerDocument and restores previous inert/overflow values on actual close/unmount. Modal without the icon button requires an enabled explicit close button in caller content/actions.

`Tabs`, `TabsProps`, `TabItem`: native div attributes; items `{value,label,content,disabled?,id?}`; id/label/aria-label/aria-labelledby; value/defaultValue/onValueChange; activationMode/orientation. Manual/horizontal default. Enabled tabs all tabindex0; native disabled tabs tabindex-1. Arrows wrap and skip disabled; Home/End; perpendicular arrows remain unhandled. Click/Enter/Space rely on the native button click rather than duplicate key activation. Automatic focus requests paired with pointer click are deduplicated while later deliberate rejected clicks still emit. Callback is exactly `{ value: string }`. Selection changes preserve mounted panels; inactive panels hidden. Active panels with no usable visible content control are sequentially reachable. Instance IDs use Solid createUniqueId; generated item IDs persist by value. Invalid modes/selections/duplicate values/IDs/controlled-default mixtures raise TypeError. Prop updates do not emit or steal focus.

## Stories and state coordination

Stories use explicit canonical meta.id `krds-modal` and `krds-tabs`, local state/props/JSX only, no play/loaders/remote requests/assets. Modal: default/open/error/loading. Tabs: default/manual/selected/disabled/automatic/controlled. No shared catalog state changes requested or made. Lead integrates exact canonical observation cases. Date owner uses a native dialog popup for selected-date initial focus; generic Modal's first-interactive/dialog focus policy is not widened.

## Actual verification evidence

Lead initial owned-family RED command:

`PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs workspace @krds-native/fixture-solid siheom:local tests/siheom/modal.test.tsx tests/siheom/tabs.test.tsx`

Exact integrated first/second/third browser command:

`PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs workspace @krds-native/fixture-solid siheom:local tests/siheom/button.test.tsx tests/siheom/native-select.test.tsx tests/siheom/modal.test.tsx tests/siheom/tabs.test.tsx tests/siheom/calendar.test.tsx tests/siheom/date-input.test.tsx`

Public package build command: `node tools/yarn.mjs workspace @krds-native/solid build:local`.

- Initial public-entry RED: 14/14 failed on absent Modal/Tabs export after infrastructure/native health was already healthy. Source implementation started only after lead observed this result. `.superpowers/sdd/PLAN/t06-lead-logs/overlays-tabs-red.log`.
- First integrated all-six run: owned Modal8/9 and Tabs5/7. Regression tests proved initially-open unrelated-opener restoration and focused automatic rejected click duplication defects; both were fixed. A third failure was an incorrect test assumption of aria-label where the visible label correctly uses aria-labelledby; corrected to accessible getByRole query. Full log `t06-lead-logs/all6-first-native.log`.
- Second integrated run: Modal10/10 (including nested parent unmount), Tabs7/8. Hidden-only content-control panel focusability regression failed expected tabindex0/actual default -1 and was fixed by actual visible/enabled/sequential descendant inspection. All-six result was 51/53; unrelated remaining DateInput failure belongs to dates owner. Log `t06-lead-logs/all6-second-native.log`.
- `node tools/yarn.mjs workspace @krds-native/solid typecheck`: passed after dependency contract helpers were built; passed again after final Tabs fix. An earlier invocation reported only then-unbuilt Calendar helper exports, not an owned source error. See owned logs.
- Third public package build: passed; six-file Chromium native suite GREEN 53/53, including Modal10/10 and Tabs8/8. Raw evidence copied into `t06-overlays-tabs-logs/all6-third-build.log` and `all6-third-native.log`. First/second/initial RED raw logs are copied there too. All owned source/tests/stories frozen after this run.
- Final production fixture/story/contract/visual integration remains lead-owned; these results do not alone establish whole T06 acceptance.

Owned behavior tests: Modal semantics/title/description/final-close/default focus; rejected controlled Escape + isolation; Tab cycling/handled/composing Escape; removed-opener fallback + unmount; exact first-interactive focus + backdrop drag/secondary protection; nested topmost Escape; existing inert/overflow restoration and default backdrop no-op; invalid config/focus; initially-open no opener; nested parent removal. Tabs sequential/manual/skip/wrap/Enter; hidden panel state and stable relationships; automatic controlled rejection and later retry; vertical policy/instance IDs/empty disabled lists; invalid configuration; dynamic items/defaultValue read once; pointer focus-blur pairing; panel keyboard reachability with hidden controls.

## Limits and integration concerns

All shared CSS is opt-in and no component imports CSS/fonts. Native unit behavior does not replace lead-owned final actual rendering/forced-colors/narrow-viewport/focus-visible checks, Storybook/contract/request policy/axe or full canonical fixture integration. Native synthetic KeyboardEvent cases are distinguished from user-event keyboard Tab/Enter sequences; these do not claim physical OS IME evidence. Source provenance and unconfirmed project ownership/release restrictions remain unchanged.


## Review fix round 1 — scoped Important findings

Independent review found three uncovered lifecycle/focus-policy defects and then appended one focused required-name finding before fixes were complete. The earlier 18/18 native GREEN did not cover these defects; original evidence remains above rather than being overwritten.

Test-first regressions added to the same owned native files:

1. Backdrop down → dialog up, followed by dialog down → backdrop up with the same pointer ID, must emit no close request; a subsequent complete backdrop gesture still requests exactly once.
2. Tab A pointer down → outside pointer up, followed by focus B and a rejected automatic request, must allow deliberate Enter and Space retries.
3. Text-first, direct-focusable-first, wrapper/nested-control-first and hidden-first panel content must follow the first-child policy. Sequential Tab explicitly reaches the text-first panel context.
4. Modal blank primitive titles/explicit icon labels and Tabs blank primitive/ARIA-only names are rejected. Empty ARIA naming overrides cannot hide a valid visible or direct ARIA name.

Actual RED queue command:

`PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs workspace @krds-native/fixture-solid siheom:local tests/siheom/modal.test.tsx tests/siheom/tabs.test.tsx`

- `overlays-tabs-review-red.log`: 3 new failures / 18 passing, total21, exit1, against existing public dist; original three source fixes began only after lead observed this RED.
- `overlays-tabs-naming-red.log`: 5 failures / 18 passing, total23, exit1, same original three plus two new naming failures against old public dist; naming source changes began only after lead observed this RED.
- Both raw logs copied into `t06-overlays-tabs-logs/`.

Source corrections (owned Modal/Tabs files only): Modal observes pointer down/up/cancel/lost capture at ownerDocument capture phase, so every end and every intervening down clears stale backdrop ownership even when a sibling or stopped bubble is involved; window blur and unmount clear/remove listeners. Tabs associates focus/click suppression with the originating tab and actual pointer completion, clears abandoned/canceled/capture-lost/keyboard ownership, and never suppresses a keyboard-generated click as a pointer pair. Its panel inspection now checks the first meaningful child itself (skipping comments/whitespace), with visible/enabled/sequential focusability checks; later or nested controls do not erase introductory context. Modal rejects blank string/boolean title and explicit blank closeLabel; Tabs treats blank primitive names and whitespace ARIA references as absent, validates a remaining name, and allows valid visible/direct ARIA fallback. This is intentionally scoped primitive/blank validation, not a generic accessible-name implementation.

Fresh `node tools/yarn.mjs workspace @krds-native/solid typecheck`: exit0, empty output after first-three fixes and again after naming fix.

Final review-round1 public build command `node tools/yarn.mjs workspace @krds-native/solid build:local`: exit0. Final native six-file command exactly:

`PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs workspace @krds-native/fixture-solid siheom:local tests/siheom/button.test.tsx tests/siheom/native-select.test.tsx tests/siheom/modal.test.tsx tests/siheom/tabs.test.tsx tests/siheom/calendar.test.tsx tests/siheom/date-input.test.tsx`

Lead observed GREEN69/69 overall, including Modal12/12 and Tabs11/11 (23/23 owned). Raw `review-round1-build.log` and `review-round1-green.log` are copied into the owned logs directory. All original and appended focused regression cases pass. Source/tests remain frozen. Lead is separately adding trusted production pointer-sequence evidence and owns final integration/visual acceptance. No additional scope edits or commits.


## Review fix round 2 — touch capture release

A fix-induced Important finding identified that round1 cleared a completed pointer's pending focus/click pairing on `lostpointercapture`. The synthetic primary-touch sequence down B → focus B (rejected request) → up B → lost capture B → corresponding click emitted a duplicate request. This sequence is permitted by [Pointer Events §9.5](https://www.w3.org/TR/pointerevents3/#implicit-release-of-pointer-capture) and [§4.1.3.2](https://www.w3.org/TR/pointerevents3/#process-pending-pointer-capture): releasing pointer capture is distinct from canceling a gesture, and its corresponding click can follow release. Both primary-source sections were checked during this round.

Added one native test in `tabs.test.tsx` that supplies that exact event ordering, asserts one request through the corresponding click, then verifies a later deliberate touch produces its own request. This synthetic native event test is not claimed as trusted hardware touch evidence. Existing abandoned-pointer, rejected Enter/Space retry, focus-blur click pairing and all Modal regressions remain in the suite.

Lead-observed RED command:

`PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs workspace @krds-native/fixture-solid siheom:local tests/siheom/tabs.test.tsx`

Result: exactly1 new failure / 11 passing, total12 Tabs; exit1. Raw log copied to `t06-overlays-tabs-logs/tabs-touch-red.log`. No source changes preceded observed RED.

Smallest source repair removes Tabs' `lostpointercapture`-as-cancellation listener and documents the distinction. It does not alter pointerup validation, pointercancel, new-pointerdown, keyboard, blur or unmount cleanup. Complete and abandoned gestures continue to be decided by pointerup; true pointercancel still clears ownership. The fix also preserves click pairing if capture is explicitly released while the same gesture continues. Modal pointer lifecycle is unchanged.

`node tools/yarn.mjs workspace @krds-native/solid typecheck`: exit0, empty output after repair.

Final lead-owned public build `node tools/yarn.mjs workspace @krds-native/solid build:local`: passed (`final-public-build.log`). Final canonical native command `node tools/yarn.mjs test:siheom --framework solid`: GREEN77/77 overall, including Modal12/12 and Tabs12/12 (24/24 owned); the new touch capture regression and prior abandoned-pointer/keyboard retry cases all pass. Root run JSON: `test-results/t05/siheom-1793327466349-27865-88667273/report.json`. Raw canonical/build logs copied to `t06-overlays-tabs-logs/final-siheom-77.log` and `final-public-build.log`.

Source/tests frozen after GREEN for independent rereview. This slice's verification does not replace lead-owned final rendered/production/Storybook acceptance. No shared source/config/catalog edits, commits or subagents.
