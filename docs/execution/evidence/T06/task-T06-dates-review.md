# T06 Solid dates scoped review

Spec compliance: ❌ — one Important accessible-naming gap remains.

Quality assessment: **Needs fixes**.

Scope: the seven files in `task-T06-dates-review-package.md` (native Solid 1 Calendar, DateInput, their private date model, native browser tests and stories). Reviewed against `specs/components/{README,date-input,calendar}.md` and the T06 dates/interface handoffs. Shared pure Gregorian helpers have a separate review; provider/public integration, production acceptance and rendered visual acceptance remain lead-owned. This is not whole-T06 acceptance.

## Findings

### Critical

None found in this slice.

### Important

1. **JSX range labels lose the required task context on calendar openers.** `packages/solid/src/components/date-input/index.tsx:169` builds the contextual accessible name only when `typeof props.label === 'string'`. The public `label` accepts native `JSX.Element`, so two valid range instances with labels such as `<strong>방문 기간</strong>` and `<strong>접수 기간</strong>` both expose only `달력 열기`. The DateInput specification explicitly requires the range opener to be named with its task-label context when multiple date inputs exist. Associate the rendered legend and opener text through stable IDs/`aria-labelledby` (or an equivalent accessible relationship) so ordinary JSX label content participates in the name. Add a focused regression with two distinct JSX range labels and verify each opener's accessible name contains its task context.

### Minor

None requiring a separate change.

## What matches the specification

- ✅ Native Solid rendering, local semantic callback types and native inputs/table/buttons/dialog; no foreign renderer wrapper, timestamp parsing or exposed Ark types appear in the scoped source.
- ✅ Strict shared ISO parsing and inclusive bounds feed mode-specific committed-value validation. Raw text and tentative Calendar selection remain distinct from committed state; text ranges reject reversed order while clicked ranges sort endpoints.
- ✅ DateInput consumes non-composing Enter, defers range-field group commits, explicitly reconciles declined controlled requests, and replaces drafts on external committed changes without user callbacks.
- ✅ Canonical hidden entries carry committed values while visible drafts carry custom validity. Submit attempts commit pending drafts and prevent a declined controlled request; reset waits for cancellation and restores the original uncontrolled baseline/current controlled prop without value notifications.
- ✅ Calendar renders a six-by-seven native table, full weekday/date accessible names, native disabled dates, tentative range/interior/endpoint states, optional Clear/Today, and distinct Confirm/Cancel actions. Enabled dates retain sequential Tab access; additive date navigation changes focus/view only.
- ✅ DateInput's native dialog initializes focus from selected/first selectable/navigation/container order, returns to an available trigger before an explicit fallback, blocks backdrop dismissal, and owns Escape/Tab propagation relative to an ancestor Modal. Cleanup removes form listeners and closes an active popup.
- ✅ Stories use local args/state and deterministic dates; scoped tests exercise actual public entries and include siheom assertions.
- ❌ Range opener contextual naming does not cover the supported JSX label API; see the Important finding.

## Evidence and limits

The supplied owner report records Calendar 7/7 and DateInput 12/12, with the integrated six-component native run at 53/53, plus passing source/Storybook typechecks. The lead additionally reports current type/build and production common-contract checks passing. Those results are supporting evidence from the coordinated queue; this read-only review did not rerun suites or produce new browser evidence.

The source inspection found no additional concrete blocker in draft/committed reconciliation, strict-date bounds, named FormData values, invalid-draft submission, canceled reset, simulated IME or dialog cleanup. The tests are meaningful but do not by themselves establish every keyboard/focus permutation or physical OS IME behavior. Actual rendered narrow/focus/error/disabled and forced-color Calendar range/focus acceptance remains pending with the lead. Approval of this slice must not be promoted to renderer coverage or release acceptance.

No source changes, Git operations, commits, publishing or subdelegation were performed. Only this review artifact was written.

## Fix round 1 re-review — current verdict

**Spec compliance: ✅ for the reviewed source slice. Quality assessment: Approved.** This supersedes the initial Needs fixes verdict above. Final rendered layout/axe and whole-T06 acceptance remain separately gated.

Reviewed only the original finding, the explicit controller-approved Calendar adaptation and material regressions introduced by those changes, using `task-T06-dates-fix1-review-package.md`, its snapshot, the appended owner report and `task-T06-calendar-axe-research.md`. All eight snapshot hashes match the current files. No suites were rerun or source files edited during this re-review.

- **Original Important finding resolved:** the range legend now has an instance-specific ID and the opener uses `aria-labelledby` referencing that legend and its visible translated trigger text. This retains task context for ordinary JSX labels as well as strings. The two distinct JSX-label regression directly covers the reported failure. Single-field opener naming remains intact.
- **Approved visible-day localization matches the bounded specification change:** `visibleDayLabel` supplies actual Korean `{day}일` and English `{day}` text through the existing plain interpolation/nonempty-translation path. Full accessible date/state names, endpoint descriptions, selection state and day interaction handlers are unchanged. The spec explicitly distinguishes the presentation adaptation from the frozen numeric-only upstream example and from assistive-technology acceptance.
- **Approved table-only scroll structure preserves semantic/control ownership:** the named, focusable private region wraps the native table only. Heading, previous/next navigation and footer actions remain outside it; the table retains its public part, weekday/date structure, sequentially reachable enabled date buttons and additive keyboard handlers. Final CSS overflow, focus visibility and geometry are not established by this source review.
- The Invalid story error text alignment adds no behavior change. The focused new tests cover JSX contextual names, visible locale/template text with unchanged full date names, and the focusable six-row/42-cell table region with controls outside it.

Critical: none. Important: none remaining in the re-reviewed change. Minor: none requiring a separate change. No material fix-introduced source regression was found.

The owner/lead evidence records the JSX regression failing before repair, the two new Calendar regressions failing before implementation, and the final rebuilt public canonical run passing **77/77**, including Calendar **9/9** and DateInput **13/13** (**22/22 dates**). Passing typechecks/builds are also reported. These are coordinated execution results, not fresh execution by this reviewer.

The historical real native Calendar axe failure remains preserved as one rule affecting 42 buttons; the research's isolated `{day}일` success is not substituted for final renderer evidence. Final raw native Calendar/DateInput-popup axe, narrow/200% text/focus/forced-color images and T04 layout review remain pending with the lead. Screen-reader/voice-control and physical OS IME acceptance are not claimed. This source approval neither closes those gates nor establishes whole-T06 or catalog/release acceptance.
