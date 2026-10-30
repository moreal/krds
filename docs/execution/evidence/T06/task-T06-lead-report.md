# T06 Solid 1 native pilot integration

All six pilots have native implementations and passing final automated/visual evidence. This candidate is ready for independent integration review. Six Solid coverage records remain `in-progress` until the controller's review/archive/status window; no unqualified `verified` or release claim is made here.

## Final inventory and boundaries

- Public native components: Button, NativeSelect, Modal, Tabs, DateInput, Calendar. Components and their Props types are exported from the root and individual component entries; `/provider` is separate. No Ark implementation types or foreign renderer enter public declarations.
- `KrdsProvider` is wrapper-free native Solid context, with reactive inherited locale/direction and lazy document access. It adds no global stylesheet or document mutation. Public component imports have no CSS/font side effects; fixtures/Storybook explicitly import reset, local-font selection and shared styles.
- Native structures are actual button/select/options, Solid Portal dialog markup, native tab buttons/panels, text inputs with canonical hidden form entries/native dialog popup, and a six-row native Calendar table. The DateInput popup uses native dialog focus policy rather than weakening generic Modal's initial-focus restriction. No original KRDS JavaScript runs alongside these controllers.
- Bootstrap WorkspaceProbe source/export was removed. Explicit infrastructure routes/stories remain separate and award zero component coverage. Empty native suites fail.
- Lead owns integration/provider/build/exports/README, production fixture source, Storybook common configuration, pure shared fixtures/scenarios and coverage manifests. Three component owners supplied their own source/tests/stories. The lead spawned no subagents and serialized every public Solid build/browser/app-build operation.

Exact 26-path lead inventory: `task-T06-lead-owned-files.txt`. Immutable final existence/SHA-256 manifest: `task-T06-lead-final-source-hashes.json` (25 existing files and one removed probe). Family reports and independently reviewed snapshots are `task-T06-{controls,overlays-tabs,dates}-report.md`; helpers/common observers/styles have separate controller-owned reports. Source/status files are frozen for integration review.

## Executed final checks

Selected tools: Node 24.18.0, Yarn 4.14.1, Solid 1.9.18, Vite 8.3.5, Playwright 1.64.1 Chromium, axe 4.14.0, native `@siheom/solid` 0.3.2. Commands use `node tools/yarn.mjs`; native direct runs set `PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1`. Default browser environment is ko-KR/Asia-Seoul, light, reduced motion, 1280×800. Narrow captures explicitly use 320×640; 200% text sets the opt-in root rem scale from 62.5% to 125%.

| Check | Result | Raw evidence under `t06-lead-logs/` |
| --- | --- | --- |
| `workspace @krds-native/solid build:local` | pass, all public entries/declarations | `final-public-build.log` |
| Solid, fixture, Storybook typechecks | all pass; provider tests/config and README examples included | `final-{solid,fixture,story}-typecheck.log` |
| Production fixture and native Storybook builds | pass | `final-fixture-build.log`, `final-storybook-build.log` |
| `test:siheom --framework solid` | **77/77 pass** | `final-siheom-77.log` |
| `test:contract --framework solid` | **10/10 pass**, final reviewed observers | `final-contract-reviewed.log` |
| `test:stories --framework solid` | **6/6 canonical stories pass**, raw axe 0, forbidden requests 0 | `final-stories-reviewed.log` |
| Supplemental all native CSF stories | **38/38 pass**, raw axe/runtime/forbidden requests 0 | `story-all-states-command.log`, `story-all-states/report.json` |
| Provider native source tests | **2/2 pass** | `final-provider-source-test.log` |
| Actual production visual/interaction harness | **41 PNGs**, 3 trusted regressions pass, 7 axe scans with 0 findings, errors/external requests 0 | `visual-final-command.log`, `visual-final/report.json` |
| Dedicated Select/date text keyboard-focus supplement | **2 PNGs**, actual Tab focus, `:focus-visible`, solid 2px outline | `visual-focus-command.log`, `visual-focus-supplement/report.json` |

Final runner reports:

- `test-results/t05/siheom-1793327466349-27865-88667273/report.json` — Button 8, NativeSelect 23, Modal 12, Tabs 12, Calendar 9, DateInput 13; total 77.
- `test-results/t05/contract-1793327519951-28110-4fd4a456/report.json` — exact disabled activation, authoritative Select update and native user-selection/reset, modal opener/fallback, manual tabs, leap/IME dates, distinct Pacific/Kiritimati and America/Los_Angeles browser contexts without unsolicited changes, and Calendar tentative selection/Confirm.
- `test-results/t05/stories-1793327750302-29652-af5b2831/report.json` — all six canonical IDs, request logs and raw axe output.

The `t05` directory name is the existing harness output location, not a T05 coverage claim. Final commands above ran on the final source candidate; no root-wide repeat/build claim is implied.

## Story/state and visual coverage

The common canonical story runner selects exactly `krds-button--disabled`, `krds-native-select--controlled`, `krds-modal--open`, `krds-tabs--manual`, `krds-date-input--invalid`, `krds-calendar--selected-range`. These six IDs alone do not establish every showcase state.

The separate `storybook-all-states.mjs` verifier rendered all 38 native stories (including those six, not 44 distinct stories): Button 8, NativeSelect 7, Modal 4, Tabs 6, DateInput 7, Calendar 6. It recorded rendered component/part/state/size/variant attributes, screenshots, runtime errors, permitted requests and component-root axe findings. It includes normal/disabled/loading/error/selected/controlled/rejected/reset/manual/automatic/range/boundary stories, as applicable. It awards no new catalog coverage and copies no behavior journeys into stories.

Actual final image inspection covered Button normal/disabled/focus and all five sizes; NativeSelect default/disabled/invalid/focus/narrow and all three sizes; Modal open/close focus/narrow/error; Tabs manual focus versus selection, disabled and narrow; DateInput normal/error/disabled story/range/text focus and popup; Calendar selection/interior/endpoints/one-day range, disabled/narrow/200% text and forced colors. Variant/loading/error/range story images were also opened and inspected, not inferred from source assertions.

Trusted production mouse/keyboard checks supplement deterministic native-event tests: two cross-boundary Modal gestures do not create false outside dismissal; an abandoned Tabs pointer gesture preserves later rejected keyboard retries; Escape closes only the nested date popup before its containing Modal. Touch pointer-capture regression is a browser DOM event-sequence test, not a physical-device touch claim.

Four original visual defects were observed in actual `visual/` before images: stray empty-error `!`, unreadable selected forced-color digits, wrapped two-digit dates at narrow/200%, and full-width native popup. Shared CSS repairs were rebuilt and verified in `visual-after/`, then final markup/CSS in `visual-final/`. The final Calendar keeps native table-only horizontal scrolling at high zoom while month context and actions stay in place. At 320/200%, outer Calendar client/scroll widths are both 256; inner region is 240/648 with scrollLeft 408 after keyboard End reaches Saturday `17일`. Document width stays 320. Header/footer remain inside the root. Popup 200% heading and navigation do not overlap; actual keyboard Tab reaches Confirm and independent Close through native vertical scrolling.

Focused in-range/endpoint/both-endpoint forced-color images were inspected: legible black text on Canvas, solid 2px focus outline separate from dashed 1px interior and double 4px endpoint borders. Final default error pseudo-content is `none`; validated error has visible text and `! `.

All final PNG/report bytes are now frozen. The only final-capture refinement established keyboard modality before Confirm and used an actual Tab to Close, rather than relying on programmatic focus alone. `visual-final/report.json` SHA-256 is `21adf45454d1642e80b70682afc775b0d80fe50a13b4a0cf1dda3adf30678a60`; footer image `fcc36d7d31b0efe10e41de65b2b8a9a2f4923e7af339e5acc2f17aad578f2b66`; close image `687e25fecacdc8b590d50e262eca88be800e766a23a6ec127a4392cc347585b6`. The two extra text/select focus images are in a separate supplement; they overwrite no reviewed artifact.

## RED-to-GREEN record and rulings

Healthy canonical baseline: nine missing-widget RED cases after native health passed; canonical missing Button siheom and five absent story IDs also failed. Initial sandbox loopback EPERM was separately rerun with authorized local-server access; it was not counted as widget RED. Family native export baselines failed 15/14/15 tests before implementation.

Critical prior-failure evidence is retained in `initial-*-red.log`, `{controls,overlays-tabs,dates}-red.log`, `controls-icon-red.log`, `all6-{first,second,third}-native.log`, `*-review-red.log`, `overlays-tabs-naming-red.log`, `tabs-touch-red.log`, `controls-image-label-red.log`, `button-image-label-red.log`, `calendar-layout-label-red.log`. Confirmed fixes include decorative/empty/image label handling, JSX range opener names, initial-open and pointer-owned Modal focus/dismissal, Tabs first-child focus/rejected gesture/touch-capture pairing, and topmost popup Escape. Final 77/77 follows these observed failures. Label guards are conservative configuration checks, not a generic ACCNAME implementation/certification; actual browser names are regression-tested.

Independent primary-source research rejected the provisional substring-only explanation of Calendar's earlier raw axe finding. The controller approved real visible Korean `{day}일` and English `{day}`, with `visibleDayLabel` as a coherent plain template. Exact full accessible date/state names remain unchanged. This is a documented project presentation adaptation from the frozen KRDS numeric-only example, not a claim that KRDS mandates a suffix. No hidden-label workaround, rule suppression or fabricated clean result was used. Original raw axe 1-rule/42-button failure and research variants remain retained; final fixture/canonical/all-story scans now actually return zero findings.

## Limits and next gate

No known lead-run source/style/behavior failures remain. All three component slices, date helpers/common observers, shared styles and compliance have separate clean scoped reviews reported by the controller. Independent lead integration review, durable archival and the controller's explicit coverage/status window remain before whole T06 completion. No source/status mutation will occur during that review.

Physical OS IME, screen-reader/voice-control, real touch device, broader browser/device matrix, SSR/hydration/independent consumer and release gates remain for their planned stages. Local horizontal scrolling of the native month table at extreme text/viewport sizes is intentional; text is not shrunk to fake reflow. This pilot does not complete all 54 web-applicable catalog entries, future variants, or other native frameworks. Publishing ownership/scope/rights gates are not bypassed. No commits, pushes, tags or publication were performed; exact commit model identity is unavailable. No additional dependencies, lockfiles, global tools, remote assets, original KRDS controllers, telemetry or Nx Cloud were introduced by the lead.
