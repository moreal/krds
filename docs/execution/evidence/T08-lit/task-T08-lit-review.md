# T08 Lit independent review

Spec-compliance verdict: **changes required**. Code-quality verdict: **changes required**. There are no Critical findings. The four Important findings below affect accepted native form, naming, focus-return, or SSR behavior; they are not CSS or broader-catalog requests.

## Frozen boundary and method

Reviewed `task-T08-lit-review-package.md`, `task-T08-lit-snapshot.json`, the T08 brief, native-pilot handoff, implementation report, common conventions, and all six accepted pilot specs. All **43 snapshot entries match** the current source, including the two expected deletions. The **22 Lit reconstructed baseline entries** in `task-native-pilots-base/BASELINE-MANIFEST.json` also match their recorded SHA-256 values. The review package describes the reconstruction from retained T01/T05/scope evidence rather than assuming the current checkout is the before-state.

Read the component/controller/directive/registration sources, fixture and browser suites, native stories, package/Vite metadata, SSR setup and documentation, and retained logs/reports. Opened all five supplied gallery PNGs directly. No tests, builds, browser suites, source edits, commits, subagents, publication, push, or tag operations were performed during this review. Findings below are source-level conclusions; no new browser reproduction is claimed.

## Important findings

### 1. NativeSelect does not serialize a non-first selected value for SSR

Location: `packages/lit/src/components/native-select/index.ts:59` (the select property binding and option template); client-only repair at lines 33–38.

The selected value is assigned only through `.value=${live(this.committedValue)}` and `updated()`. Each server-rendered option lacks a `selected` attribute. The retained actual `apps/fixture-lit/dist/ssr-test.html:362` confirms that both options have only their values and text, with no serialized selection. A valid controlled/default selection of the second option therefore renders the browser's first option until the client update repairs it. That is incorrect SSR state, even when hydration later reuses the node. The current hydration fixture selects the first option (`hydration.test.mjs:7–8`), so its post-hydration assertion cannot detect this.

Remedy: serialize the committed selected option in the native option markup while retaining the client property reconciliation. Cover a non-first controlled and uncontrolled selection before hydration, then confirm the same select node/state and first native action after hydration. Explicitly document or implement the unmatched-empty/no-selection SSR case rather than extending the current promise to an unrepresentable static single-select state.

### 2. Range validation marks and focuses the valid start field when only the end field is invalid

Location: `packages/lit/src/components/date-input/index.ts:70–88`, and `:97–99`.

`problem()` returns only one group message, `syncForm()` installs that message on every input, and both the ElementInternals anchor and explicit submission focus always use `querySelector('input')`. For example, with start `2024-02-29` and end `bad`, the start input receives custom validity and becomes the native invalid target despite being valid. Both fields also receive the same `aria-invalid` state (`:135–138`). The accepted DateInput contract requires affected-field state and submission focus on the first affected visible input. This can direct a keyboard or assistive-technology user to edit the wrong endpoint. Existing range tests verify a group error but do not check end-only invalid submission focus.

Remedy: retain the affected endpoint(s) with the validation result, set field validity/ARIA on those inputs, and use the first affected input as the FACE anchor and failure focus target. Add end-only format/bounds and incomplete-range native submission coverage, preserving zero invalid-value notifications and canonical form data.

### 3. Accepted explicit naming paths do not reach Tabs/Calendar semantics

Locations: `packages/lit/src/components/tabs/index.ts:33–34,66`; `packages/lit/src/components/calendar/index.ts:133`.

Tabs rejects an otherwise valid instance with only `aria-label` or `aria-labelledby` because it unconditionally requires `this.label`; its tablist always references the internal visible-label node. Calendar ignores `explicitName` and substitutes its generic default name when `label` is empty. The base class already resolves the host's naming attributes (`components/base.ts:16–27`), but these consumers do not use that result. The accepted Tabs and Calendar APIs expressly permit explicit accessible naming. Thus a valid named Tabs instance fails to render, and a Calendar supplied a specific explicit task name exposes the generic name instead.

Remedy: accept the resolved explicit name as the alternative to a visible label and apply it to the actual tablist/calendar region inside the shadow root. Preserve same-root relationships for visible labels. Cover `aria-label` and external `aria-labelledby` inputs in native browser and SSR paths.

### 4. Modal can mistake an inert shadow descendant for a usable return target

Location: `packages/lit/src/components/modal/index.ts:61,73–82`.

`usable()` checks `node.closest('[inert]')`, which does not cross a shadow-root boundary. If the saved opener is a native button inside an open shadow root and its host or an ancestor of that host becomes inert while the modal is open, it still passes this check: it remains connected, visible, enabled and locally matches the focusable selector. Cleanup then calls `focus()` on that inert descendant and skips the supplied usable `returnFocusId`. Native inertness prevents the focus restoration. The accepted Modal policy explicitly requires an opener to be non-inert and requires fallback when it becomes unusable; shadow descendants are a normal integration path for this package.

Remedy: determine effective inertness across the composed ancestor chain (including hosts/assigned slots) before choosing a return target, and use equivalent ancestry for the nearest-usable-ancestor fallback. Cover a shadow opener made inert before close, alongside the existing removed-opener case, in Chromium and WebKit.

## Confirmed implementation and retained evidence

The six pilots are actual LitElement classes with open Shadow DOM and native button/select/text-input/table/dialog semantics. No foreign renderer or original KRDS JavaScript owns their DOM. The official VanillaMachine bridge starts/stops through Lit lifecycle, and the retained lifecycle test checks detach/reconnect. `machineProps` has reversible listener/property/style/attribute paths and disconnect/reconnect evidence. Public entries contain no implicit registration; the explicit fixed registration function preflights collisions and only permits same-class idempotence.

ElementInternals is the sole persistent successful-control path for NativeSelect and DateInput. Button uses a temporary actual native submitter and `requestSubmit`; retained tests inspect named submitter FormData, canceled reset, fieldset disabling, restore state, controlled rejection, raw drafts/composition, invalid/pending submissions, and zero duplicate actions. Modal uses native top-layer isolation, same-root title/description, final close markup, default dialog focus, controlled rejection and opener/fallback cleanup. Calendar uses a native six-row/seven-column table, sequential date stops, strict date/range semantics and tentative confirmation. These are substantive implementations; the findings do not invalidate those demonstrated paths.

Retained logs record package/fixture/Storybook builds and three typechecks; **4/4** package SSR/configuration tests; **7/7** native browser/visual suites; **10/10** canonical contracts in each of Chromium and WebKit. The hydration suite uses real server-rendered declarative shadow DOM, loads the official hook before element classes, restores application-owned properties, and exercises first actions. Its explicit node-identity assertions currently cover Button and DateInput, not every native control; its title should not be read as six separate identity assertions. SSR documentation correctly limits the claim to standalone selected Lit Labs integration and does not promise arbitrary property serialization or every host framework.

Inspected the full retained stories report as well as its summary: all **six** canonical native stories have raw axe **4.14.0 violations=[]** and network **violations=[]**, with local requests retained. This conclusion is based on findings, not runner exit status. The siheom result remains **unsupported**, not a pass; no invented Lit adapter or widened peer was introduced.

Direct gallery inspection: `desktop.png` shows the size sequence, clear keyboard focus, native select, selected/disabled Tabs, invalid DateInput and range Calendar. `narrow.png` and `zoom-200.png` retain readable labels/errors and available header/footer controls while the private table region scrolls. `forced-colors.png` retains focus, disabled/error and range-boundary cues. `modal-shadow-theme.png` supplies the sixth pilot with focused final close control and visible inherited top-layer surface. Metrics retain bounded page width, doubled button heights at 200% text and actual dialog color `rgb(238, 245, 255)`. The consumer imports the public additive `shadowStyles` API and the README documents global token installation; the shared API/CSS itself remains under its separate owner review.

## Limits and disposition

Manual assistive-technology acceptance, physical Korean IME behavior, the inherited Firefox profile failure, independent packed/outside consumers, release checks, and the remaining full catalog are explicitly unresolved later gates. Synthetic composition checks and automated axe results do not establish those outcomes. No catalog coverage promotion or release authorization follows from this review.

Resolve the four Important findings and retain focused regression evidence before accepting T08. The existing native implementation and evidence provide a sound basis for that revision; no broad rewrite or cosmetic expansion is requested.

## Revision 1 scoped re-review

**Current spec-compliance verdict: accepted for the T08 pilot scope. Current code-quality verdict: accepted for the T08 pilot scope.** These supersede the original changes-required verdicts above. Original findings: **4 fixed, 0 open**. Current open findings: **0 Critical, 0 Important**. No new material regression was found in the scoped fixes.

Reviewed `t08-lit-logs/fix1/diff.patch`, `inventory.json`, the appended implementation responses, all ten changed files and focused regression sources, and retained RED/GREEN/build/typecheck logs. Verified the original **43 entries** against `task-T08-lit-fix1-base` (41 present, two absent), every changed before/after hash, and the unchanged current entries: **zero mismatches**. No tests or builds were rerun, and no implementation source was edited during re-review.

1. **SSR selection — fixed.** `native-select/index.ts:59` now serializes a native `selected` attribute for the committed matching option while preserving live client reconciliation. The new browser test aborts JavaScript first, observes the actual second-option selection for both controlled and uncontrolled instances, then loads the production hydration entry and checks select identity, preserved values and first action behavior in both engines. README/compatibility documentation explicitly bounds unmatched-empty/no-selection SSR rather than inserting a placeholder or claiming equivalence for that static-HTML limitation.

2. **Affected range endpoint — fixed.** `date-input/index.ts:71–106` carries affected endpoint indices through validation, per-field native validity and the ElementInternals anchor. `:116–123` focuses that anchor on submission failure, and `:163–166` applies field-specific invalid state. The focused real `requestSubmit()` tests cover an end-only format error, max-bound error and missing end: start stays valid/unmarked, end receives focus, submission is blocked, canonical range data is unchanged and no value event fires. Existing affected FACE/hydration tests remain green, including canceled reset and single successful contribution.

3. **Explicit naming — fixed within the documented plain-label contract.** Tabs now accepts explicit naming and applies it to its internal tablist (`tabs/index.ts:34,62,67`); Calendar applies it to its named region (`calendar/index.ts:127–135`). The base class resolves actual host-root references, uses native element-reference ARIA when available, observes live label text/ARIA-label changes, and disconnects its observer (`base.ts:18–72`). The final browser assertions cover direct labels, Document/enclosing-ShadowRoot references, live text updates, and empty/missing-reference rejection. The controller-approved standalone SSR `labelReferences` map is an explicit application-owned plain-text fallback, documented without pretending an external DOM or full accessible-name algorithm exists; SSR tests reject unresolved/empty context and do not copy an external IDREF into the internal root.

4. **Inert shadow opener — fixed.** `base.ts:125–139` walks assigned slots and shadow hosts for effective inertness. Modal uses it for return-target usability and uses the same composed ancestry for ancestor fallback (`modal/index.ts:61,77–79`). The focused Chromium/WebKit test makes the actual opener's enclosing shadow host inert before closing and verifies actual focus on the supplied usable fallback.

Retained actual RED evidence records **0/4 SSR** and **0/8 browser** before the fixes; the browser failures match all four reported behaviors in both Chromium and WebKit. GREEN evidence records **5/5 focused SSR**, **8/8 focused browser**, then **12/12 final affected browser** with the strengthened live naming/rejection checks plus existing actual hydration/FACE regressions. Package tests are **9/9**; package, fixture and Storybook builds and all three typechecks are reported passing in the retained logs. The original canonical/story/axe/gallery evidence was not represented as freshly rerun for this revision.

The prior manual-AT, physical-IME, Firefox environment, outside-consumer/release and full-catalog limits remain unchanged. This acceptance closes T08's four findings; it does not promote full-catalog coverage or authorize publication.
