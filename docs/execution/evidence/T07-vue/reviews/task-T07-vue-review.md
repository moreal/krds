# T07 Vue independent native-pilot review

Spec compliance: **Changes required** — two Important native interaction/form gaps remain.

Code quality: **Changes required** — the native Vue architecture is sound, but focus discovery and form-listener lifetime do not yet cover the supported native content/association contracts. No Critical finding.

## Findings

### 1. Important — Modal traps native disclosure summaries out of the keyboard sequence

Source: `packages/vue/src/components/modal/stack.ts:18–23`; callers at `packages/vue/src/components/modal/Modal.vue:67–79` and `:86–90`.

`canFocus` and `focusables` enumerate button/input/select/textarea/link/tabindex/contenteditable elements and omit a native `summary`. A normal modal body containing `<details><summary>More information</summary>…</details>` followed by the provided icon close button therefore has a discovered focus list containing only that close button. From the default dialog-container focus, Tab is intercepted and sent straight to Close; both forward and backward wrapping continue to skip the summary. The disclosure cannot be opened through the expected native keyboard sequence. Supplying that first summary as `initialFocusId` also throws because it is absent from `list[0]`, although it is the first enabled visible focusable interactive element in logical DOM order.

This violates the accepted Modal contract for native body content, first-interactive focus policy and cycling through enabled visible focusables. It is an actual reachability gap, not a request for a new widget or a different focus policy. The supplied modal tests use buttons/inputs and do not cover this native element.

Remedy: make focus discovery/return eligibility account for native focusable content, including the first `summary` of an enabled visible disclosure, while retaining hidden/inert/disabled filtering and logical DOM order. Use the same eligibility rules for the first-interactive initial-focus validation and trap. Add a focused native-modal regression proving Tab/Shift+Tab reach the summary, keyboard activation opens the disclosure, and `initialFocusId` to that first summary is accepted. Preserve the strict rejection of later initial-focus targets.

### 2. Important — changing native form association leaves reset/submit handling on the old form

Source: `packages/vue/src/components/date-input/DateInput.vue:149–151` and `:128–143`; corresponding select reset ownership at `packages/vue/src/components/native-select/NativeSelect.vue:57–59`. The reactive associations are rendered at DateInput `:168`, `:174–175` and NativeSelect `:66`.

Both components read `control.form` only in `onMounted` and retain that form until unmount. Their public `form` props remain reactive native attributes, so changing from one valid form ID to another immediately moves the visible/canonical controls to the new native form while the component listeners remain on the old form.

For DateInput, a concrete static trace is: mount with `form="old"` and committed `2024-02-29`; update the prop to `"new"`; leave a valid raw `2024-03-01` draft in the focused input; request native submission of the new form without a preceding group blur. The draft passes native format validity, but the new form has no DateInput submit listener to commit it or block a controlled request. Its successful hidden control still contains `2024-02-29`, allowing stale canonical data through the exact pending-draft path the spec requires the component to guard. The new form's reset also bypasses DateInput's initial-baseline/draft/error/popup cleanup. NativeSelect likewise loses its exact semantic reset-baseline restoration on the new owner. Conversely, resetting the old form can still reset components that no longer belong to it.

The API explicitly supports native `form` association; only date `mode` and controlled ownership are specified as immutable. This is not a requirement to support a new association API. The supplied tests keep the owner fixed after mounting, so their passing reset/form assertions do not establish this path.

Remedy: rebind reset/submit listeners whenever the actual native form owner changes, removing the previous owner's listeners first and cleaning up the current owner on unmount. Keep canceled-reset behavior and the existing one-request controlled reconciliation policy. Add a focused regression changing `form` between two real forms, then verify new-owner pending-draft submission and reset, old-owner isolation, exact FormData, and zero reset notifications. Do not introduce recursive submission.

These are source-derived failure traces; no new runtime reproduction or test execution was performed during this review.

## Scope and evidence inspected

Reviewed the 42-path `task-T07-vue-review-package.md`/`task-T07-vue-snapshot.json` change set against the reconstructed T01/T05/frozen-scope baseline, actual owned source, T07 brief, native common handoff, common conventions and all six accepted component specs. SHA-256 verification found **0 mismatches across all 42 snapshot paths**, including the expected removed probe; the separately recorded **42 source-inventory files also all match**. The inventory's six frozen upstream source records preserve URL, retrieval date, baseline and hashes. The report and verification summary were read. No implementation source, test, shared helper/style, other adapter, inventory or supplied evidence was changed.

| Area | Review result outside the findings above |
| --- | --- |
| Button | Actual native button; native click transport, explicit/default type, disabled, name/value/form and decorative icon slot. Supplied real pointer/Enter/Space and submitter evidence supports the intended action counts. |
| NativeSelect | Real select/options in source order, native popup keyboard behavior retained, visible/slot labels and descriptions, controlled rejection resync, empty/no-selection semantics and initial reset baseline are implemented. Form-owner rebinding remains finding 2. |
| Tabs | Native Vue named panel/label slots, typed plain emits, native buttons, all enabled sequential stops, manual/automatic handling, paired gesture suppression, mounted hidden panels and relationships. Prop changes do not select through user events. |
| Calendar | Native six-row/seven-column table, weekday headers and native date buttons; tentative versus committed values, range/Clear/Cancel/Confirm, strict date helpers, bounds/year edges, explicit reference/today, translated full date/state names and separate visible day labels. Navigation is additive to sequential Tab access. |
| DateInput | Native text fields and canonical hidden values, controlled defined-null handling, separate raw drafts, strict single/range parsing, Enter/group-blur commit and composition handling, native validity/reset hooks, native Calendar/Modal composition, selected-date initial popup focus and trigger restoration. The documented controlled submit policy blocks a differing pending submission until reconciliation and does not recursively submit; form-owner lifetime remains finding 2. |
| Modal/provider | Native Teleport and Vue lifecycle, actual opener capture including WebKit's non-focusing pointer activation, mandatory usable-opener precedence, strict initial-focus policy, nested topmost dismissal, handled/composing Escape guard, backdrop drag guard, inert/overflow preservation and cleanup. Native focus discovery remains finding 1. Provider locale/direction are computed provide/inject values and actual portaled names/direction are covered by the supplied reactive-provider test. |
| Public consumption | Root named exports and six default subpaths, emitted public declarations, public-root/subpath consumer SFC, built DOM-free closed-control SSR, opt-in styles/fonts and documented pilot/SSR limits. No foreign renderer/factory or original KRDS JavaScript controls these components. |

Read the supplied actual RED/native/browser/build/type evidence without rerunning suites or builds:

- Meaningful native RED: missing native Button and Calendar, retained separately from the sandbox listen denial.
- Final native siheom raw Vitest/report: **20 tests, 20 passed, 0 failed**, using the actual Vue adapter; deliberate malformed-configuration warnings remain visible.
- Canonical production contracts: **Chromium 10/10 and WebKit 10/10**. The original WebKit opener failure is retained, and the final source captures the actual activation target. Real-production evidence additionally covers exactly three pointer/Enter/Space button events, no disabled extra event, sequential enabled Tabs and all 42 dates, same-value popup confirmation/focus return and rejected controlled Enter.
- Final native Storybook raw report: **six canonical native states**, each with `axe.violations=[]` and request-policy `violations=[]`. The runner exit code was not substituted for raw inspection. Stories use local state and remain separate from behavioral tests.
- Visual raw results: **normal, narrow, CSS zoom 200%, root text 200%, forced colors** each have full-body and modal axe arrays empty, no runtime errors and no external requests. Directly viewed actual `normal.png`, `narrow.png`, `forced-colors.png`, `text200.png` and `narrow-modal.png`. They show distinct focus/selection/error/disabled cues and wrapping field labels. The narrow page remains 320px; only the private date-table wrapper scrolls. No shared-style rewrite is requested.
- Built package declarations/build, fixture consumer typecheck/build, Storybook typecheck/build and DOM-free public SSR pass in the supplied logs. Isolated Nx build passes; the final isolated Nx typecheck passes after the root owner's evidence-snapshot ignore correction. The original discovery failure remains retained.

The supplied evidence is credible for its tested paths and does not resolve the two findings. Address them and supply focused owning-workspace evidence for review before accepting T07 Vue. Existing successful results need not be broadly rerun without a change-driven reason.

No catalog coverage promotion, release-readiness claim, commit, push, tag or publication is made. Manual assistive-technology review, physical IME, the inherited Firefox profile-start blocker, full-catalog/T10 and release gates remain later work; they are not additional defects assigned to this six-pilot review. Other renderers, shared pure helpers and additive T10 styles are outside this review's ownership.

## Fix round 1 independent rereview

**Current spec-compliance verdict: Approved for the T07 Vue six-pilot scope. Current code-quality verdict: Approved.** These verdicts supersede the initial changes-required verdicts above. Original findings: **2 Important fixed, 0 Important open, 0 Critical open**. No new Critical or Important issue was found in the scoped fixes.

Rereview scope was limited to the original two findings and breakage introduced by their fixes: `t07-vue-logs/fix1-source-diff.patch`, the three changed adapter files, the additions to the existing native behavior test, the implementation report's responses and the focused evidence. The saved `task-T07-vue-fix1-base/` before bytes for all four paths hash-match the original review snapshot; current after bytes match `fix1-source-hashes.json`. Reconstructing the unified diff from those exact files matches the supplied patch byte-for-byte. All **42 current source-inventory file hashes match**. Unchanged components, shared styles and other frameworks were not broadly reviewed again.

### Finding 1 — fixed

`packages/vue/src/components/modal/stack.ts:18–31` includes native summaries in the shared candidate discovery used by trap entry/wrapping and first-interactive validation. Implicit eligibility is restricted to the first direct summary of its details parent; explicit tabindex continues through the existing sequential filter. Visibility, disabled and inert checks remain intact. The Modal's strict later-target rejection code was not relaxed.

The supplied actual browser regressions prove that Tab reaches the summary from the dialog, Enter opens the native disclosure, Tab then reaches its revealed input, wrapping in both directions includes the summary, and the first summary is accepted as `initialFocusId`. Hidden/inert actions remain excluded. Both relevant tests failed against the preserved reviewed implementation, including the retained original initial-focus RangeError, and pass after the fix.

### Finding 2 — fixed

`packages/vue/src/components/native-select/NativeSelect.vue:54–69` and `packages/vue/src/components/date-input/DateInput.vue:125–170` replace the stale mount-time form subscription with owner-document capture listeners filtered against the controls' current native `form` owner on each event. Reset additionally checks both current ownership and cancellation after dispatch. Listener removal uses the same document, callback and capture option on unmount. This addresses reactive `form` reassociation without introducing a second form-state owner.

The supplied real-form regressions change the external association, retain focus and a pending date draft through `requestSubmit`, and inspect resulting FormData. They verify the new owner receives the newly committed uncontrolled date, a declined controlled request blocks submission with one value request, the old owner cannot reset the reassociated controls, canceled reset preserves drafts, and a new-owner reset restores the exact baseline while clearing DateInput popup/error/draft state with zero reset value notifications. The preservation test records balanced reset/submit registrations/removals over repeated mount/unmount. Existing synchronous canonical synchronization and controlled reconciliation behavior remain unchanged; no recursive submission was introduced.

### Evidence and limits

Read the supplied `fix1-red.log` (**5 failed, 18 deliberately skipped, 1 original unhandled initial-focus error**), `fix1-green.log` (**5 passed, 18 deliberately skipped, no unhandled error**) and `fix1-affected-green-final.log` (**14 passed, 10 deliberately skipped**). The last run selects `NativeSelect|DateInput|Modal|fix1` in the existing native behavior file, including all six fix-round tests and the affected existing cases; it is not reported as a full 24-test or full-pilot rerun. Also read the successful final package/declaration build, package typecheck, fixture/consumer/test typecheck and fixture production-build evidence. The verification summary distinguishes these scoped results from the retained original full-pilot evidence.

No suites, builds or visual captures were rerun for this rereview, and no adapter/test source was edited by the reviewer. Existing visual/Storybook evidence remains historical evidence for unchanged presentation. The independent T07 review gate is satisfied; catalog promotion, manual AT/physical IME, Firefox, full-catalog/T10 and release gates retain the limitations recorded above. No commit, push, tag or publication is authorized or performed.
