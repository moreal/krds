# T07 Vue native six-pilot implementation

Native Vue implementation and framework-owned evidence are ready for independent review. No catalog coverage was promoted, no release readiness was declared, and no commit/push/tag/publication occurred. The shared Nx discovery regression was corrected by its root owner; the affected isolated Vue typecheck rerun passes (one task). Direct package/app checks pass.

## Delivered native behavior

- Six Vue 3.5.44 SFCs: Button, NativeSelect, Modal, Tabs, Calendar and DateInput. Vue refs/computed/watchers, typed emits, native slots, useId, Teleport and lifecycle cleanup own rendering and interaction. KrdsProvider uses native provide/inject for reactive locale/direction/document access. No foreign adapter/renderer import or original KRDS JavaScript is used.
- Built typed root exports and six default component subpaths; native SFC consumer example and DOM-free public-root/subpath SSR smoke. Global CSS/fonts remain opt-in. Old public probe export/source replaced.
- Defined controlled values, including false/null/empty values, remain authoritative. Controlled/default conflicts, changing ownership, duplicate values and malformed configuration reject. Prop updates/reset emit no user events; actual rejected select/tab/date/modal actions retain committed state.
- Native form Button submitter behavior; select reset/no-selection; strict date-only text drafts, range validation, composition/Enter/group blur, canonical hidden controls, invalid-draft submission prevention, reset and popup Confirm/Cancel. NativeSelect leaves OS popup keys untouched.
- Modal stack isolates background DOM with preserved inert/overflow, tracks actual opening activation including macOS WebKit's non-focusing pointer buttons, validates initial-focus policy, traps topmost focus, guards Escape/IME/handled events and backdrop drags, restores usable opener/fallback/ancestor/body on actual close/unmount, and removes native listeners.
- Tabs keep all enabled triggers at tabindex=0, additive manual/automatic focus navigation and mounted hidden panels. Calendar renders a six-by-seven native table; all enabled dates remain sequential Tab stops. Additive date-only navigation, inclusive bounds/year edges, tentative range/clear/cancel/confirm, explicit today/reference date, Korean full accessible names and visible day suffixes are implemented.

## Evidence

All commands launch the selected Node 24.18.0/Yarn 4.14.1 through `node tools/yarn.mjs`. Browser execution uses the selected cached Playwright browsers and scoped localhost approval. Builds write only Vue-owned dist directories; no installation/dependency/lock change occurred.

| Check | Command | Actual result / evidence |
|---|---|---|
| Native RED | `workspace @unofficial-krds/fixture-vue siheom:local` | Two actual feature failures before native implementation (missing disabled Button and native six-row Calendar); `t07-vue-logs/red-native.log`. Initial sandbox listen denial separately retained in `red.log`. |
| Package build/types | `workspace @unofficial-krds/vue build:local` | Pass; Vite ES root/subpaths plus vue-tsc declarations; `build.log`. |
| Isolated Nx build | `nx run krds-vue:build --excludeTaskDependencies --skip-nx-cache` | One task, one success; `nx-build.log`. Shared dependencies were deliberately not rebuilt. |
| Isolated Nx typecheck | `nx run krds-vue:typecheck --excludeTaskDependencies --skip-nx-cache` | Pass after sole root owner excluded copied evidence snapshots; one affected-gate rerun, one task succeeds in `nx-typecheck-final.log`. The original shared graph failure remains in `nx-typecheck.log`. |
| Fixture + docs consumer types | `workspace @unofficial-krds/fixture-vue typecheck` | Pass, including `ConsumerExample.vue` compiled against built public root/subpath; `fixture-type.log`. |
| Storybook types | `workspace @unofficial-krds/storybook-vue typecheck` | Pass; `story-type.log`. |
| Fixture production build | `workspace @unofficial-krds/fixture-vue build:local` | Pass; `fixture-build.log`. |
| Storybook production build | `workspace @unofficial-krds/storybook-vue build:local` | Pass; `storybook-build.log`. Normal upstream large-chunk warning retained. |
| Native browser behavior | `test:siheom --framework vue` | 20/20 pass through the native @siheom/vue runner; `siheom-final.log` links raw Vitest JSON/report. Includes real Vue rendering, controlled rejection, defaults/reset, IME, strict dates/year edges, range popup/forms, topmost nested modal cleanup, rich labels and reactive provider portals. Expected Vue setup warnings from deliberate configuration-error tests remain unsuppressed. |
| Canonical Chromium contracts | `test:contract --framework vue --browser chromium` | 10/10 pass; `contracts-chromium-final.log` links raw report/artifacts. |
| Canonical WebKit contracts | `test:contract --framework vue --browser webkit` | 10/10 pass; `contracts-webkit-final.log`. Original 9/10 failure retained in `contracts-webkit.log`; the opener capture fix addresses the actual WebKit native focus difference. |
| Real native keyboard | `workspace @unofficial-krds/fixture-vue exec node tests/production-behavior.mjs` | Pass; `production-behavior.log/json`: pointer/Enter/Space exactly three button events, disabled zero additional events, real sequential Tab/Enter tabs, all 42 date stops with zero navigation changes, popup selected-date focus/same Confirm/opener return and rejected controlled Enter. |
| Native Storybook | `test:stories --framework vue` | Six canonical states pass; final runner report linked by `stories-chromium-final.log`. Raw axe violation arrays and network violation arrays inspected, not inferred from process exit. |
| Public SSR | `workspace @unofficial-krds/fixture-vue test:consumer` | Built root/default-subpath native Vue SSR without document globals passes; `ssr-consumer.log`. |
| Visual/axe/request matrix | `workspace @unofficial-krds/fixture-vue test:visual` | Normal, 320px narrow, CSS zoom 200%, actual root text size 200%, forced colors, and modal variants: full-body axe [] / modal axe [], zero runtime errors and zero external requests; `visual.log`, `visual/raw-results.json`, actual inspected PNGs. |

## Actual visual inspection

Inspected normal, narrow, zoom200, text200, forced-colors and modal screenshots, plus individual focused Select/DateInput/Tabs/Calendar captures. Button xsmall→xlarge sizes are visibly distinct; native disabled dashed/non-color cues, invalid field border/text cues, selected tab underline and selected/range/today date cues remain legible. Focus outline remains separate from selected state. Range field labels stay attached to their fields and wrap at narrow widths. The 320px page has no horizontal overflow (`scrollWidth=320`); only the private Calendar table wrapper scrolls (`clientWidth=292`, `scrollWidth=328`) while month navigation and footer remain in view. Modal content fits the narrow viewport and preserves reading/action order.

The first full-body audit found Calendar h3 skipping h2 under the fixture h1. That genuine failure and screenshots remain in `visual-initial/`; the component heading was corrected to h2, then the raw audits and screenshots were rerun. No axe/network finding was suppressed.

## Source inventory and boundaries

`source-inventory.json` records SHA-256 for the delivered adapter/fixture/story/example/docs sources and references all six existing frozen upstream URL/retrieval/hash records. Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Inputs were the six accepted specs, common conventions, native handoff, existing pure contracts date helpers and test driver/scenario contracts. Solid was read only for semantic reference (date value policies and submit expectations); no Solid renderer/source import or mechanical syntax port was used.

Owned changes stay in `packages/vue/**`, `apps/fixture-vue/**`, `apps/storybook-vue/**`, `docs/compatibility/vue.md`, this report and `t07-vue-logs/**`. Shared root/lock/catalog/styles/provenance remain untouched. The coordinator may associate the six Vue entries with these evidence paths after independent review; this worker awards no implemented/verified catalog status. Package provenance metadata, broad release checks, source archive movement and Nx evidence ignores remain sole-integrator work.

## Limits and remaining gates

- Independent review and PLAN 8.4/T10 evidence gates remain required. This pilot is six controls, not the full 54-component web catalog.
- Firefox1555 profile-creation failure is inherited from the handoff, not silently marked passing. Chromium and WebKit have actual native evidence.
- SSR covers built public imports and closed server-renderable controls. Open Teleport modals require a mounted browser document; no separate SSR hydration/browser-matrix claim is made.
- A pending differing controlled DateInput draft requests one commit and blocks that submission until the parent reconciles; it never submits stale canonical values. Normal Enter/group-blur commits allow the subsequent explicit submit. No recursive form submission is used.
- Shared evidence-snapshot Nx discovery was fixed by its root owner; one affected isolated Vue typecheck rerun passes. No unrelated all-workspace rerun was performed.

`verification-summary.json` consolidates the final raw 20-test, six-story and five-visual-mode counts. Final native Storybook report: `/Users/moreal/github/moreal/krds/test-results/t05/stories-1793331231963-64006-4d1dadd7/report.json`. Final native siheom report: `/Users/moreal/github/moreal/krds/test-results/t05/siheom-1793331213102-63846-e7ffc79d/report.json`.

## Review fix round 1 — native disclosure focus and reactive form ownership

Read the complete `task-T07-vue-review.md` and verified both Important findings against the reviewed source. `task-T07-vue-fix1-base/` preserves the exact reviewed before bytes; the four changed source/test paths all match the initial review snapshot's before SHA-256. No Critical finding or extra feature was introduced.

1. Modal's owned `canFocus`/`focusables` helper now includes a native disclosure's first `summary` in logical DOM order. An explicitly focusable summary still follows its native tabindex; implicit summary eligibility is restricted to the first direct summary of its details element. Existing visibility, inert, disabled and sequential-tabindex filters remain in force. The same helper continues to drive initial-first-interactive validation, Tab/Shift+Tab wrapping and focus return. The strict rejection of later initial-focus targets was not relaxed.
2. NativeSelect and DateInput observe reset/submit at the mounted controls' ownerDocument and filter every event against the control's **current native `form` owner**, rather than retaining the mount-time form. This handles reactive external `form` changes and actual native ownership independently of Vue prop timing. Reset rechecks ownership and `defaultPrevented` after dispatch; the old owner cannot clear drafts or reset values. DateInput's existing one-request controlled pending-submit policy and synchronous uncontrolled canonical-value update remain intact. No recursive submit is used. Every document observer is removed on unmount.

Five focused regressions were added before changing adapter source. They reproduced all five failures: summary skipped by Tab, valid first-summary initial focus rejected, old-owner reset affecting reassociated select, stale canonical DateInput submission on the new owner, and an unblocked rejected controlled draft on the new owner. The initial-focus failure also produced the existing unhandled RangeError; this is retained in the RED log, not suppressed. All five then passed after the source fixes. A sixth preservation test records actual native reset/submit observer removal across repeated mount/unmount.

Native keyboard regression uses the existing Vitest Playwright browser provider's `userEvent.keyboard`: Tab reaches the summary, Enter opens the real details disclosure, Tab reaches the newly visible input, and both wrapping directions retain the summary while hidden/inert controls remain excluded. Form regressions change between two real external forms, keep a pending draft focused through requestSubmit, inspect FormData and notification counts, verify canceled resets and old-owner isolation, reset popup/error/draft state only through the new owner, and verify current controlled reconciliation. The cleanup test inspects balanced native listener registrations/removals and zero value notifications after unmount.

Commands and actual results (selected Node/Yarn, cached browser path, scoped localhost approval):

| Gate | Exact command | Actual result |
|---|---|---|
| Focused RED | `PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs workspace @unofficial-krds/fixture-vue siheom:local tests/siheom/native-behavior.test.ts -t fix1` | **5 failed, 18 skipped; 1 expected original unhandled initial-focus RangeError**. `fix1-red.log`. |
| Public package build/declarations | `node tools/yarn.mjs workspace @unofficial-krds/vue build:local` | Pass, exit 0; frozen fix source in `fix1-build-final.log`. |
| Focused GREEN | Same focused RED command after source fixes | **5 passed, 18 skipped, zero unhandled errors**. `fix1-green.log`. |
| Affected native GREEN + cleanup | Exact command below | **14 passed, 10 skipped**, exit 0; `fix1-affected-green-final.log`. These include all six fix-round tests and the existing affected native Modal/forms cases. |
| Package typecheck | `node tools/yarn.mjs workspace @unofficial-krds/vue typecheck` | Pass, exit 0; `fix1-typecheck.log`. |
| Fixture/consumer/test typecheck | `node tools/yarn.mjs workspace @unofficial-krds/fixture-vue typecheck` | Pass, exit 0; `fix1-fixture-typecheck-final.log`. |
| Production fixture build | `node tools/yarn.mjs workspace @unofficial-krds/fixture-vue build:local` | Pass, exit 0; `fix1-fixture-build-final.log`. |

Only three adapter source files and the existing native behavior test changed. `fix1-source-hashes.json` records exact before/after SHA-256, `fix1-source-diff.patch` is the narrow review diff, and `fix1-before-source-inventory.json` preserves the prior inventory. The main `source-inventory.json` now matches all 42 current inventoried files with zero mismatches. `verification-summary.json` retains the original full pilot evidence and appends the explicitly scoped fix-round results. No full visual, Storybook or unrelated all-framework gate was repeated; the unchanged successful evidence remains preserved. No shared/root/dependency/lock/style/provenance/catalog changes, commits, subagents or publication occurred. Source and inventory are frozen for narrow independent re-review; no verified coverage or release status is awarded here.

Exact affected-native command:

```sh
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs workspace @unofficial-krds/fixture-vue siheom:local tests/siheom/native-behavior.test.ts -t 'NativeSelect|DateInput|Modal|fix1'
```
