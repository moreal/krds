# T06 Solid controls review

Spec compliance: ❌ — one accessible-name configuration gap remains in NativeSelect.

Code quality: Needs fixes.

Scope: the six files in `task-T06-controls-review-package.md`, checked against the actual Button/NativeSelect source, the common/component specs, ownership handoffs, and shared part/state CSS. Integration, providers, public exports, fixtures/common cases, production and Storybook browser acceptance, and full visual acceptance belong to the lead and are outside this scoped verdict.

## Findings

### Important — reject an empty/decorative select label when no alternative name exists

`packages/solid/src/components/native-select/index.tsx:40` treats every non-null `label` as a sufficient accessible name; line 69 renders that label without checking its meaningful content. Validly typed inputs such as `label=""`, `label="   "`, `label={false}`, or `label={<span aria-hidden="true">지역</span>}` therefore bypass the TypeError and render an unnamed combobox when neither naming attribute is supplied. NativeSelect requires a label/accessible name, and the common contract makes missing structural naming configuration an error. Button already checks empty and decorative-only child content, so the controls currently enforce this requirement inconsistently.

Validate meaningful label content after resolving/rendering the native Solid JSX label, while preserving explicit `aria-label`/`aria-labelledby` alternatives. Add focused cases for empty, whitespace, false and decorative-only labels, plus a positive case where an empty/decorative label has an explicit functional name. A source fix and those focused regressions are sufficient to re-review this finding; no wider suite rerun is requested by this review alone.

### Critical

None found.

### Minor

None recorded.

## Strengths

- Both components use native Solid and actual button/select/option elements. Public types use native Solid JSX plus plain contracts, with no Ark or foreign-renderer types.
- Button delegates pointer/Enter/Space, submitter FormData, validity and cancelable reset to the browser, defaults to `type="button"`, reacts to disabled changes, and hides its decorative icon slot from assistive technology.
- NativeSelect keeps a captured uncontrolled reset baseline; restores declined controlled requests in `finally` even when the parent prop does not change; emits one plain `{ value }` notification only for an accepted different value; and emits nothing for prop synchronization/reset. Disabled options, absent selection and required empty placeholders retain native behavior.
- Reset observation follows the associated form, supports external form association, waits until the native reset algorithm completes, honors cancellation, and removes its document listener on cleanup.
- Public component/part/state attributes and presentation values agree with the shared CSS contract. Hint/error relationships retain the caller's `aria-describedby` values. Stories use local props/signals, separate behavior files, and no remote resources.
- Owned tests exercise substantive browser behavior through the public package: native activation/form algorithms, exact callback payloads, declined controlled requests, disabled states, reset cancellation/baselines, external form association and absent selection.

## Evidence and limits

Reviewed the bounded supplied diff once and actual implementation source once; no Git mutation or test/build rerun was performed. The lead supplied current all-six native evidence of 53/53 passing (including 16 controls tests), with public build/types passing; these are supporting supplied results rather than independently rerun claims. The original controls report's 41-pass/6-fail all-family result is historical, not the current result or a whole-T06 acceptance claim.

The empty/decorative-label finding follows directly from the validator and rendered label structure and is not covered by the existing missing-label test. Full Storybook/browser, forced-colors/focus, narrow viewport, zoom and production acceptance remain the lead's pending checks; this review does not infer visual acceptance or catalog verification from source/tests.

## Fix round 1 scoped re-review

Spec compliance: ❌. Code quality: Needs fixes.

Finding counts: original Important finding fixed **1**; open fix-introduced Important finding **1**. Critical **0**; Minor **0**. This appended verdict supersedes the original finding's open status while retaining its review history.

The source now inspects the rendered label, excludes hidden/aria-hidden descendants and rejects the original empty, whitespace, false and decorative-only cases. The ten added tests cover those four rejection cases, their four explicit `aria-label` alternatives, explicit `aria-labelledby`, and visually hidden text. The original finding is resolved. The Controlled story's exact two-option fixture alignment preserves its local controlled-state behavior.

### Important — preserve valid text alternatives in JSX labels

`packages/solid/src/components/native-select/index.tsx:85`–87 reduces meaningful label content to `textContent`. This newly rejects accessible label content such as `label={<img src={localAsset} alt="지역" />}` or `label={<span role="img" aria-label="지역" />}` when there is no naming attribute on the select itself. These native JSX labels have functional accessible names through their content's text alternative, but their DOM `textContent` is empty, so the new effect throws `TypeError` and prevents rendering. The public label API accepts native Solid JSX content; the supplied NativeSelect/common specs require an accessible name rather than requiring a DOM text node. This is a regression introduced by the touched validation, not an additional review of untouched behavior.

Preserve meaningful native text alternatives while continuing to reject the four original unnamed cases. Add a focused positive regression for a label containing a locally sourced image with nonempty `alt` (or an equivalently named `role="img"` descendant); retain the existing rejection tests. The added tests currently use only textual positive label content or explicit naming attributes on the select, so they do not cover this path.

Compared the supplied `task-T06-controls-fix1-review-package.md` with the actual three changed files and verified all six owned file SHA-256 values against `task-T06-controls-fix1-snapshot.json`; all matched. No tests/builds were rerun and no source was edited. Supplied lead evidence is current public build/types passing and all six native suites green at 69 tests (Button 6, NativeSelect 20). This review accepts that evidence for the exercised cases without treating it as coverage of the new text-alternative regression or as whole-T06 visual acceptance.

## Fix round 2 scoped re-review

Spec compliance: ✅ within the reviewed controls scope. Code quality: Approved.

Previously recorded findings: **2 fixed, 0 open**. The separately identified matching Button text-alternative gap is also fixed (**1 additional fixed, 0 open**). Open Critical **0**, Important **0**, Minor **0**. This appended verdict supersedes the prior open naming verdicts.

The narrow guards now accept nonempty native image `alt` and named `role="img"` descendants after removing hidden/decorative descendants. NativeSelect therefore preserves the valid JSX text alternatives rejected by fix round 1. Button receives the same bounded repair within its action label; its separate icon slot remains decorative. Existing empty/false/decorative-only rejection and explicit-name handling are preserved. Neither fix changes event, state, form, rendering structure or public API behavior. The comments accurately describe a conservative presence check rather than a complete accessible-name implementation.

The five new regressions directly exercise the repaired native accessible names: image-alt and image-role positives for each control, plus NativeSelect mounting inside an inactive hidden ancestor and exposing its name when shown. The existing original rejection cases remain in place. No new actionable regression was found in this bounded change. Broader untouched accessible-name scenarios were not added to this re-review.

All six owned file SHA-256 values match `task-T06-controls-fix2-snapshot.json`. Checked the frozen fix diff and actual changed guard blocks, appended implementer RED/GREEN record, public build log, final siheom log and copied canonical report. The report records canonical selection, exit 0, **77 passed / 0 failed** across the six native files; supplied owned controls evidence is **31/31** (Button 8, NativeSelect 23), with public build/typechecks passing. No tests/builds were rerun, no source was edited, and no commits were made. Full visual/Storybook and whole-T06 acceptance remain the lead's separate responsibility; the canonical report explicitly awards no catalog coverage.
