# T05 Lit native foundation

Implemented the Lit fixture bridge, explicit infrastructure probe, healthy missing-pilot routes, and native WebComponents Storybook default/loading/error states. These probes provide **zero KRDS catalog coverage**. No KRDS widget, wrapper renderer, shared/root file, dependency version, or lockfile was changed. No commit, push, tag, or publication was performed.

## Exact file inventory

Modified:

- `apps/fixture-lit/src/main.ts`: native LitElement state subscription, click/change bridge, disconnect cleanup, route health and explicit missing-feature note; consumes built adapter/test-contracts exports.
- `apps/fixture-lit/index.html`: Korean document language, native fixture title and viewport.
- `apps/fixture-lit/package.json`: real native browser test and nonrecursive shared contract runner.
- `apps/fixture-lit/project.json`: uncached contract/test targets with own/dependency builds and contract inputs.
- `apps/storybook-lit/.storybook/main.ts`: actual WebComponents/Vite integration; workspace-resolved absolute framework path for pnpm links; telemetry disabled.
- `apps/storybook-lit/src/stories/probe.stories.ts`: three native Lit probe states from pure shared data; canonical story IDs remain pending, without fake implementations.
- `apps/storybook-lit/package.json`: production `storybook-build:local`, actual story probe test, nonrecursive canonical story runner.
- `apps/storybook-lit/project.json`: production Storybook target and uncached story/test targets with build prerequisites.
- `apps/storybook-lit/tsconfig.json`: also checks Storybook configuration.

Added:

- `apps/fixture-lit/tests/contract/native-probe.test.mjs`: native production bridge/render/click/controlled update/events/disabled/focus/disconnect and missing-route history check.
- `apps/storybook-lit/.storybook/preview.ts`: native preview configuration.
- This report and `t05-lit-logs/` evidence, including copied runner JSON reports and detailed Playwright JSON.

Removed obsolete T01 fixed-port/empty-suite configs:

- `apps/fixture-lit/playwright.config.ts`
- `apps/storybook-lit/playwright.config.ts`

## Executed evidence

All commands below ran from repository root through `node tools/yarn.mjs`, selecting Node **24.18.0** / Yarn **4.14.1**. Exact tools: Lit **3.3.3**, TypeScript **6.0.2**, Vite **8.3.5**, Storybook/WebComponents-Vite **10.6.5**, Playwright **1.64.1**, axe **4.14.0**. Browser location: `/private/tmp/krds-playwright-1.64.1`; actual executed browser Chromium revision **1248**. No browser installation was started by this owner.

| Command arguments after `node tools/yarn.mjs` | Actual result | Log |
| --- | --- | --- |
| `workspace @krds-native/fixture-lit exec node --test tests/contract/native-probe.test.mjs` before implementation, with `PLAYWRIGHT_BROWSERS_PATH` set | Expected RED: old T01 output missing Fixture health; 1 failed | `02-native-red.log` |
| `workspace @krds-native/fixture-lit typecheck` | exit 0 | `03-fixture-typecheck.log` |
| `workspace @krds-native/fixture-lit build:local` | exit 0, production Vite build, 12 modules | `04-fixture-build.log` |
| `workspace @krds-native/storybook-lit typecheck` | exit 0 | `05-story-typecheck.log` |
| `workspace @krds-native/storybook-lit storybook-build:local` initially | exit 1: framework preset bare package resolution failed from virtual Storybook store | `06-story-build.log` |
| `workspace @krds-native/storybook-lit storybook-build:local` after workspace-relative package resolution | exit 0, actual native production build; `dist/index.json` and `dist/iframe.html` exist | `09-story-build-resolution.log` |
| `test:contract --framework lit --probe` | exit 0, 1/1 native infrastructure case passed | `08-contract-probe.log` |
| `test:stories --framework lit --probe` | exit 0, 3/3 states, 8 local requests per state, zero network/axe violations | `10-stories-probe.log` |
| `test:contract --framework lit` | expected exit 1, all 9 canonical scenarios healthy then missing-feature RED | `11-contract-pilot-red.log` |
| `test:stories --framework lit` | expected exit 1, all 5 canonical stories missing | `12-stories-pilot-red.log` |
| `test:siheom --framework lit --probe` | expected exit 1: unsupported; no upstream native adapter | `13-siheom-unsupported.log` |
| `exec node --test tools/tests/story-network.test.mjs` | exit 0, 1/1 negative policy test; forbidden external/API/WebSocket/EventSource/service-worker requests blocked before sending, local asset succeeds | `14-request-policy-negative.log` |
| `workspace @krds-native/storybook-lit typecheck` including `.storybook` | exit 0 | `15-story-typecheck-final.log` |
| `workspace @krds-native/fixture-lit test` | exit 0, 1/1 native lifecycle test; default browser path works | `16-fixture-test-final.log` |
| `workspace @krds-native/storybook-lit test` | exit 0, 3/3 actual production states | `17-story-test-final.log` |
| `workspace @krds-native/fixture-lit lint` | exit 0: workspace pins, pnpm linker, metadata and dependency/import boundaries verified | `18-workspace-lint.log` |

The first sandbox attempt failed to bind localhost (`01-native-before.log`); targeted approved execution allowed local servers and browsers. This was an environment restriction, not counted as the feature RED. Storybook's initial native preset resolution failure was corrected using `createRequire(import.meta.url).resolve()` from the consuming workspace, retaining the exact installed native renderer. The successful build emits the upstream large-chunk advisory; Playwright emits a NO_COLOR/FORCE_COLOR warning. Neither caused a failing result.

## Reports and limits

The final copied evidence is in `t05-lit-logs/summary.json`, `contract-probe-report.json`, `contract-probe-playwright.json`, `contract-pilot-red-report.json`, `contract-pilot-playwright.json`, `stories-probe-report.json`, `stories-final-report.json`, `stories-pilot-red-report.json`, and `siheom-unsupported-report.json`. Detailed browser artifacts remain under the unique `test-results/t05/` directories named in those JSON files. The default story screenshot was visually inspected: the native button and count are visible at the fixed 1280×800 viewport.

All 9 expected pilot failures carry a `native-health.json` attachment: button/disabled; native-select/controlled and form-reset; modal/focus-return and trigger-removed; tabs/manual-activation; date-input/leap-year, ime and timezone-invariance. Each fails with `Required KRDS feature not implemented ... native health passed`, rather than server/selector errors. The canonical Storybook entries are absent intentionally until component implementation; infrastructure stories do not replace them.

Lit has no supported upstream siheom adapter. No peer widening, invented adapter, wrapper, empty successful suite, or siheom verification claim was introduced. Native Playwright supplies the executed alternative. Input evidence is a real Chromium browser provider with Playwright-generated click events and programmatic browser focus; it is not OS-level input, physical keyboard/IME, screen-reader, Firefox, or WebKit evidence. Screenshot conditions use locale ko-KR, timezone Asia/Seoul, light mode, reduced motion, fixed viewport, and `document.fonts.ready`.

No remaining Lit infrastructure blocker was observed. Actual KRDS pilots and canonical stories remain intentionally unimplemented, and Lit siheom remains upstream-unsupported.
