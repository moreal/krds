# T07 React native six-pilot implementation report

React's six native pilot components are implemented with public root/subpath declarations, production fixtures, separate local-state stories, native browser behavior tests and SSR checks. The listed local gates pass. This report does not promote catalog coverage, full-catalog support or release readiness. Independent review and shared integration remain the controller's gates.

## Ownership and source inventory

Work stayed inside `packages/react/**`, `apps/fixture-react/**`, `apps/storybook-react/**`, `docs/compatibility/react.md`, and this report/evidence directory. No shared catalog/spec/style/provenance edits, dependency additions, lock edits, installs, commits, pushes, tags or publication were performed by this worker. Existing identity/provenance/license records remain separately owned. Implementation uses the accepted specs as semantic requirements and existing shared CSS/date helpers; no official JavaScript or source asset was incorporated.

The initial concurrency guard was honored: only new component/test/story files were written before the controller explicitly released existing React files. No public build output was produced before release.

Current owned-source snapshot: `t07-react-logs/source-inventory.json` records 56 files with SHA-256 hashes and sizes. This is an inventory of current owned source, including pre-existing scaffold/license files; it is not a claim that all 56 files were newly authored.

Core implementation:

- `packages/react/src/providers/index.tsx`: native React context, inherited locale/direction/ownerDocument, lazy document resolution.
- `packages/react/src/components/button/index.tsx`: actual button, native submit/reset/disabled and ref forwarding.
- `packages/react/src/components/native-select/index.tsx`: actual select/options, visible relationships, no-selection representation, initial reset baseline and controlled reconciliation.
- `packages/react/src/components/tabs/index.tsx`: native button tabs, all enabled sequential stops, manual/additive navigation, automatic request deduplication, persistent panels.
- `packages/react/src/components/modal/index.tsx`: React portal/layout-effect lifetime, native trigger focus, document-level topmost stack, inert/scroll preservation, Escape/focus trap, guarded primary backdrop gesture and restoration on close/unmount.
- `packages/react/src/components/calendar/model.ts`: adapter-local date value validation and translation helpers, using shared pure Gregorian parsing/arithmetic only.
- `packages/react/src/components/calendar/index.tsx`: Sunday-first 6×7 native table, exact accessible names, locale-specific visible days, tentative single/range state and native controls/navigation.
- `packages/react/src/components/date-input/index.tsx`: native editable text, separate draft/committed state, canonical hidden fields, composition handling, validation/commit/reset/submit and modal-calendar composition.
- `packages/react/src/index.ts`, package manifest and Vite config: public exports/types and isolated output entries.

Fixture integration is in `apps/fixture-react/src/PilotFixture.tsx`, `FixtureApp.tsx`, `main.tsx` and local Vite/Vitest configuration. Six canonical test files remain separate from seven story source files (six component stories plus the clearly marked pre-existing infrastructure probe). The broader form/lifecycle tests currently live in `tests/siheom/calendar.test.tsx`; they explicitly exercise all six public React components and are counted as native behavioral evidence, not as extra catalog components.

Documentation/examples: `packages/react/README.md` and `docs/compatibility/react.md`. Root and `/button`, `/native-select`, `/modal`, `/tabs`, `/calendar`, `/date-input`, `/providers` entries all expose their own generated declarations. Infrastructure probe exports/stories remain explicitly non-catalog.

## Native rendering and behavior

React owns JSX, hooks, refs, context, lifecycle and portals. No adapter imports another adapter or renders through a foreign renderer. The existing Ark dependency was not used as a second state owner; no original KRDS JavaScript runs alongside these controls.

Controlled values/open props remain authoritative. Prop updates and reset produce no user notifications. DateInput keeps raw drafts apart from committed canonical form values; invalid text stays visible, IME does not commit, and accepted/rejected pending submissions are reconciled against the parent after React's flush. A named range submits `.start`/`.end` once each. Calendar actions are tentative until Confirm; cancel, clear, same-value confirmation and changed-value notifications are separate actions. No implicit current date or timestamp conversion is used.

Tabs and Calendar retain every enabled sequential Tab stop; arrows are additional focus navigation. Modal isolation is shared per owner document, so nested-tree removal restores the original scroll/inert state regardless of React cleanup order. Closed portals lose their full-screen positioning, avoiding an invisible pointer intercepting layer. DateInput uses its own public `popup` part while reusing the native modal lifetime and its specialized selected/first-date focus entry.

## RED and defects found during verification

Initial command: `PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs workspace @unofficial-krds/fixture-react siheom:local`.

The first sandboxed attempt failed to listen on `::1` with EPERM; the scoped approved browser invocation then ran real Chromium tests. Initial RED was nine failures across five canonical files, each at the missing actual-control boundary (fixture health was healthy). Initial screenshots remain in `test-results/t05/react-siheom-native-1793329464395-46752/screenshots/`. This initial run did not emit a JSON summary; its exact observed result is recorded here rather than inventing one.

Subsequent retained reports:

- `t07-react-logs/siheom-first-green.json`: 11 passed / 6 failed. Additional Testing Library rendering exposed duplicate optimized React instances. Local `resolve.dedupe` and explicit optimizer entries corrected the test module graph without changing dependency pins or root resolutions.
- `t07-react-logs/siheom-second.json`: 17 passed / 0 failed.
- `t07-react-logs/siheom-third.json`: 19 passed / 1 failed. Testing Library's role query did not treat inert ancestry as hidden; the test was corrected to assert the actual inert boundary, while browser accessibility/focus contracts remained independent.
- `t07-react-logs/siheom-fourth.json`: 20 passed / 0 failed.
- `t07-react-logs/siheom-submit-red.json`: 20 passed / 1 failed. A controlled accepted pending submit was incorrectly prevented before the parent's update flushed. Submission now compares the intended canonical date with the post-flush parent value; rejected submission remains blocked.
- `t07-react-logs/siheom-final.json`: 21 passed / 0 failed, before the final additional edge/lifecycle cases.
- `t07-react-logs/siheom-nested-red.json`: 24 passed / 1 failed. Unmounting an open nested modal tree left body overflow hidden. Document-level isolation ownership fixed the actual cleanup defect.

The first canonical Storybook run exited 0 but its raw Calendar axe record contained `heading-order`. The month heading was changed from h3 to h2. Original raw report: `test-results/t05/stories-1793329912778-52602-309a5d73/report.json`. Final raw axe is independently checked below; runner exit alone was not used as acceptance.

The first two WebKit contract attempts passed nine cases and failed mandatory usable-opener focus return. WebKit pointer activation may leave a button unfocused. The native Modal trigger now explicitly focuses its actual opening control before requesting open; the canonical fixture uses that supported trigger composition. Current controlled external openings also retain active-element/gesture fallback. Retained initial failure: `t07-react-logs/contracts-webkit.log` and `test-results/t05/contract-1793330389417-56718-a90e6060/`. Final WebKit passes all ten cases.

## Final command/results

All commands used the selected wrapper. Version logs show Node v24.18.0 and Yarn 4.14.0 (`node-version.log`, `yarn-version.log`). Browser cache was `/private/tmp/krds-playwright-1.64.1`. Local server/browser commands required and received scoped sandbox escalation; no automatic-approval rejection remains.

| Exact command | Result / evidence |
| --- | --- |
| `node tools/yarn.mjs workspace @unofficial-krds/react build:local` | Exit 0; `t07-react-logs/package-build.log`; Vite ESM entries plus declaration emission |
| `node tools/yarn.mjs workspace @unofficial-krds/react typecheck` | Exit 0; `package-typecheck.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/fixture-react build:local` | Exit 0; `fixture-build.log`; actual JS and common CSS in own dist |
| `node tools/yarn.mjs workspace @unofficial-krds/fixture-react typecheck` | Exit 0; `fixture-typecheck.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/storybook-react build:local` | Exit 0; `storybook-build.log`; local native production stories |
| `node tools/yarn.mjs workspace @unofficial-krds/storybook-react typecheck` | Exit 0; `storybook-typecheck.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/react test` | 5/5 SSR/import/native semantic/error-policy tests; `ssr-tests.log` |
| `node tools/yarn.mjs test:siheom --framework react` | 25/25 native Chromium tests; `siheom-runner-final.log`; raw report `test-results/t05/siheom-1793330745910-60008-a983928f/report.json` and `react-vitest.json` |
| `node tools/yarn.mjs test:contract --framework react` | 10/10 Chromium canonical production cases; `contracts-chromium-final.log`; raw report `test-results/t05/contract-1793330774635-60173-8275b87d/report.json` |
| `node tools/yarn.mjs test:contract --framework react --browser webkit` | 10/10 WebKit canonical production cases; `contracts-webkit-final.log`; raw report `test-results/t05/contract-1793330811786-60455-5581ff1e/report.json` |
| `node tools/yarn.mjs test:stories --framework react` | Six canonical stories passed; all six raw `axe.violations` arrays empty, all request-policy `violations` arrays empty; `stories-final.log`; raw report `test-results/t05/stories-1793330782953-60227-a7eb077f/report.json` |
| `PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs exec node apps/fixture-react/tests/inspect-react.mjs` | Exit 0; 33 actual screenshots/observations; `visual-command.log`, `visual/observations.json` |

The native suite includes default/submit/named Button behavior and disabled actions; NativeSelect controlled rejection/prop update/no-selection/FormData/reset; sequential manual and automatic Tabs with preserved panel state; leap-day and IME drafts; canonical range submission; same/changed commits and accepted/rejected pending submit; cancellation/reset; tentative Calendar ranges and month/year focus clamping; year-9999 grid padding; controlled Modal rejection, nested topmost handling, IME/handled Escape, guarded backdrop drags, repeated StrictMode mounts and nested-tree cleanup. Canonical timezone checks independently mount Pacific/Kiritimati and America/Los_Angeles contexts.

Build logs retain the normal Storybook large-chunk advisory. Contract logs retain the environment's NO_COLOR/FORCE_COLOR warning. Neither was suppressed or represented as an accessibility finding. No unrelated all-workspace suite was run during concurrent ownership.

## Visual inspection

Screenshots were actually opened and inspected, not accepted from CSS text assertions. `visual/observations.json` retains the exact browser geometry/focus and private table scroll measurements.

- Normal native states: default/small/large/disabled Button, invalid NativeSelect, manual Tabs including disabled tab, invalid DateInput, open Modal, selected Calendar range. Label, hint and error remain visible; focus, today and range cues are distinct.
- All six components were captured at 320px with computed root font size doubled, at effective 200% layout (640×450 CSS viewport, DPR 2, yielding 1280×900 screenshots), and emulated forced colors.
- Narrow Calendar retains table-only horizontal scroll and visible month/footer controls; body scroll width never exceeds its viewport in the measured states. Narrow Tabs use the list's local horizontal scroll. Field labels/errors wrap and stay readable.
- DateInput popup initially focuses an enabled date, exposes `data-krds-part="popup"`, and retains visible focus in forced colors. Both initial and footer-scrolled popup images were inspected. At 320px doubled text its dialog measures 864px client height / 1282px scroll height; scrolling brings Clear/Cancel/Confirm and the final close control into view. At the effective 200% viewport it measures 432px / 519px and the footer remains reachable.
- Forced-colors inspection shows explicit range borders/endpoints, selected tab underline/border, disabled text cues and focus outlines. Invalid input retains error text and focus independently of color.

The effective-zoom fixture is a controlled viewport/DPR emulation, not an automated operation of browser-chrome zoom. CSS-root zoom was used in an early exploratory capture and then replaced because it does not reproduce fixed-position viewport geometry; final `zoom200` images and observations use half CSS viewport / DPR 2. Narrow doubled-text evidence is separately identified. These captures are renderer evidence, not assistive-technology certification.

## Remaining limits / integration requests

- No unresolved finding remains in the listed final local behavior, contract, SSR, raw axe or request-policy gates.
- Firefox was not reclassified as working: the handoff's Firefox1555 profile-creation failure remains an inherited environment blocker. This worker did not claim a Firefox pass or repeat that known environment failure.
- Full catalog implementation, independent installed-consumer qualification, broader assistive-technology/platform testing, browser-chrome zoom operation, licensing/release checks and publication remain later/controller gates. Native SSR import/static rendering is tested here; it is not a complete hydration or every React-generation compatibility claim.
- No catalog/coverage JSON was changed. The controller may record the six React pilot implementations and the exact evidence above at the appropriate PLAN8.4 stage; this report itself awards no verified coverage.
- No new shared CSS, contract or dependency change is requested. Shared heading-order policy was satisfied locally by the native heading element.

## Independent review fix round 1

The independent review in `task-T07-react-review.md` requested changes for four Important findings. The author has addressed all four below; independent re-review remains the acceptance gate. Earlier results/inventory above describe the original reviewed handoff, not an assertion that the review findings were covered then.

### Per-finding response

1. **Disabled DateInput blocking an otherwise valid form.** The form submit listener now returns before validation or commit when DateInput is disabled. Native disabled omission of editable/canonical controls remains intact. Regression tests exercise both containment and explicit external `form` association, a separate successful `other` control, actual submit-button activation, no date entries, and zero date notifications.

2. **Rejected controlled group blur permitting stale submission.** DateInput now keeps a pending semantic request separately from its parent-truth display. A rejected blur restores the displayed parent value while retaining that request for the following submit; submit compares the intended value against the parent after React flushes. The same unresolved request is not emitted again or submitted recursively. New editing/composition, reset and an actual external value update clear the retained request; a parent update to the requested value permits submission without another notification. Tests use `userEvent.click` in the real Chromium-rendered React form, so focus leaves the field before submit. Both accepting/rejecting parents, repeated rejected submission, later parent reconciliation, date-valued and `null` requests, exact request counts and actual FormData/default prevention are exercised. Pending object presence is checked explicitly so a request for `null` cannot be confused with absence of a request.

3. **Calendar confirming a draft invalidated by bounds changes.** Confirm eligibility now includes both tentative endpoints against current inclusive bounds, in addition to completeness/required/disabled checks. The activation handler checks eligibility again and validates the draft before committing or notifying. Unavailable tentative state is retained rather than silently repaired. Single/range standalone Calendar tests update `min` without changing the empty committed value, then assert disabled Confirm and zero value/action events. Single/range DateInput popup tests update `max` while open, assert disabled Confirm and zero value events, and cancel normally.

4. **Missing controlled-mode configuration guards.** A small React-local hook, `packages/react/src/use-controlled-mode.ts`, captures the initial `value !== undefined`/`open !== undefined` choice and throws TypeError for a simultaneous defined default or a later ownership change. NativeSelect, Tabs, Calendar, DateInput and Modal all use it. `false`, `null` and `''` remain defined controlled values. Browser ErrorBoundary regressions cover all five components: conflicting defaults on mount, default added to an already controlled instance, controlled→uncontrolled and uncontrolled→controlled. The valid controlled starting configurations intentionally use false/null/empty values. DateInput's uncontrolled default/baseline validation is now a lazy state initializer, so later default changes are not read or revalidated; a regression changes the default to an invalid date, edits a real value, then resets to the original baseline with no reset notification.

### Focused RED → GREEN evidence

All commands used the selected Node/Yarn wrapper and the existing native Chromium browser setup. No dependency, root, lock, catalog, shared CSS or provenance change was made. Approved scoped local-browser/server escalation was used as before.

Exact initial focused RED command:

```sh
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs workspace @unofficial-krds/fixture-react siheom:local tests/siheom/calendar.test.tsx -t review1 --reporter=json --outputFile=../../.superpowers/sdd/PLAN/t07-react-logs/review1-red.json
```

Observed **1 passed / 12 failed** before implementation changes. The already-correct accepting-parent pointer case passed; both disabled-form cases, rejected pointer submission, four dynamic-bounds cases and five ownership-policy cases failed at their specific missing behavior assertions. Raw failures are retained in `t07-react-logs/review1-red.json`.

After the first native changes, the same focused command with `--outputFile=../../.superpowers/sdd/PLAN/t07-react-logs/review1-first-green.json` observed **13 passed / 0 failed**.

The additional empty-date intent case was tested before correcting its null/absence distinction:

```sh
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs workspace @unofficial-krds/fixture-react siheom:local tests/siheom/calendar.test.tsx -t 'review1 pointer' --reporter=json --outputFile=../../.superpowers/sdd/PLAN/t07-react-logs/review1-null-red.json
```

Observed **3 passed / 1 failed**: only rejected `null` intent still allowed the stale value. Replacing nullish fallback with explicit pending-object detection fixed it. The final focused command is the initial command with `--outputFile=../../.superpowers/sdd/PLAN/t07-react-logs/review1-green.json`; it observed **16 passed / 0 failed**, including the frozen-default regression.

### Refreshed affected verification

| Exact command | Observed result / retained output |
| --- | --- |
| `node tools/yarn.mjs workspace @unofficial-krds/react build:local` | Exit 0, including declarations; `t07-react-logs/review1-package-build.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/react typecheck` | Exit 0; `review1-package-typecheck.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/fixture-react typecheck` | Exit 0; `review1-fixture-typecheck.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/storybook-react typecheck` | Exit 0; `review1-storybook-typecheck.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/react test` | SSR/import suite **5/5**; `review1-ssr.log` |
| `node tools/yarn.mjs test:siheom --framework react` | Full owned native suite **41/41**, six nonempty files; `review1-native-final.log`; raw `test-results/t05/siheom-1793332376433-74862-a750f8d8/report.json` and `react-vitest.json` |
| `node tools/yarn.mjs workspace @unofficial-krds/fixture-react build:local` | Exit 0; `review1-fixture-build.log` |
| `node tools/yarn.mjs test:contract --framework react` | Rebuilt production fixture **10/10 Chromium**; `review1-contract-final.log`; raw `test-results/t05/contract-1793332414058-75111-86ce624d/report.json` |

No broad styling/visual or unrelated workspace suite was repeated. The changes do not alter shared CSS or the existing story layouts; the newly disabled Confirm state is asserted on the actual rendered native control in the focused dynamic-bounds tests. The earlier WebKit/story/raw axe/request/screenshot evidence is retained as pre-fix evidence and was not silently relabeled as a new fix-round execution. Firefox, physical zoom/IME, assistive technology, installed-consumer, full-catalog and release limits remain as recorded above.

### Exact fix-round source diff and inventory

`task-T07-react-fix1-base/` is the controller-captured reviewed before-bytes baseline. `t07-react-logs/review1.diff` is the exact unified diff against those bytes; `review1-diff.json` records each changed path's before/after SHA-256 and byte counts. Seven source paths changed: the five stateful component implementations, the existing native browser test file, and the new React-local controlled-mode hook (before empty). No other reviewed source file changed in this round.

Current owned-source inventory is **57 files**, including the new hook: `t07-react-logs/review1-source-inventory.json`. The original 56-file `source-inventory.json` remains immutable historical evidence for the first review. No catalog coverage, release status, commit or publication is awarded by this author response.

## Independent review fix round 2

The round-1 re-review confirmed the original four findings fixed, then identified one Important regression: the retained pending request also deduplicated a later deliberate popup Confirm and survived confirmation of the current parent value. This author response addresses that single regression; independent re-review remains pending.

### Repair and focused regressions

Only the DateInput popup Confirm callback changes. A valid explicit Confirm clears the earlier pending intent before calling the existing commit function. A newly chosen B therefore makes one fresh request even when an earlier B request was rejected. Confirming current parent A follows the normal same-value path: zero value events, popup closes, and no stale B intent remains to block submission. Implicit group blur and submit callbacks do not clear pending state; the previously fixed stale-submit barrier and repeated-submit deduplication remain in place.

Four new native browser regressions cover single and range modes:

- Parent remains A; popup selects/confirms B, closes, reopens and selects/confirms B again: exactly two requests total and the displayed fields stay at A.
- Parent rejects B; reopened popup confirms its initialized current A without another selection: zero extra value events, popup closes, and an actual pointer submit is allowed with exact canonical A FormData (`current` or `current.start`/`current.end`).

Exact RED command, before the repair:

```sh
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs workspace @unofficial-krds/fixture-react siheom:local tests/siheom/calendar.test.tsx -t review2 --reporter=json --outputFile=../../.superpowers/sdd/PLAN/t07-react-logs/review2-red.json
```

Observed **0 passed / 4 failed**. Both retry cases received only one request; both same-value confirmation cases reached submission with `defaultPrevented=true`. Raw assertions are retained in `t07-react-logs/review2-red.json`.

Exact affected GREEN command:

```sh
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs workspace @unofficial-krds/fixture-react siheom:local tests/siheom/calendar.test.tsx tests/siheom/date-input.test.tsx -t 'review2|DateInput|date drafts|controlled date|a controlled parent|canceled native reset|review1 pointer|date-input' --reporter=json --outputFile=../../.superpowers/sdd/PLAN/t07-react-logs/review2-green.json
```

Observed **22 passed / 0 failed**. This explicitly filtered affected selection includes the four new popup cases, prior accepted/rejected pending submit cases, pointer blur→submit with date and null requests, repeated-submit blocking and later parent reconciliation, disabled contained/external forms, IME/date drafts, cancel/reset, popup bounds changes, DateInput ownership/default guards and the three canonical DateInput cases. Other component cases were filtered/skipped, not represented as freshly run.

Additional affected commands:

| Exact command | Observed result / output |
| --- | --- |
| `node tools/yarn.mjs workspace @unofficial-krds/react build:local` | Exit 0, ESM/declarations; `t07-react-logs/review2-package-build.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/react typecheck` | Exit 0; `review2-package-typecheck.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/fixture-react typecheck` | Exit 0; `review2-fixture-typecheck.log` |

No broad component, style, visual, Storybook, network or unrelated workspace suite was repeated. Their prior evidence remains historical. No public API, markup, CSS, shared/root/lock/dependency file, commit or publication changed in this round.

### Exact source hashes and diff

The seven reviewed before-byte files are retained under `task-T07-react-fix2-base/`. Five remain byte-identical. Only these two paths changed:

| Path | Before SHA-256 | After SHA-256 |
| --- | --- | --- |
| `packages/react/src/components/date-input/index.tsx` | `75771facec7b5999faca76720136bf0cf561775f5132f019b371a0695fdfbbfd` | `2e429f21821723fc861b13411bb8c158a10a311cf63771b2433cc6aabb2176bd` |
| `apps/fixture-react/tests/siheom/calendar.test.tsx` | `0748ca429bd2d4383eece0cbd1ccf7eb71f9cc4dd0e8b54be9c430f186d37e6b` | `8df9dd4d479fc770ae65add7598e4955a2f15134183c4eaaffd71b3a7eb3ae3c` |

`t07-react-logs/review2.diff` contains the exact unified diff; `review2-diff.json` records hashes and byte counts. `review2-source-inventory.json` is the refreshed 57-file owned-source inventory, with zero hash mismatches. Earlier inventories remain immutable review evidence. `review2-final-summary.json` records the focused RED/GREEN counts and pending independent re-review. Coverage, Firefox/environment, platform/assistive-technology, full-catalog and release limits remain unchanged.
