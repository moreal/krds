# T05 native harness interface v1

This is the shared implementation protocol. Test-only probes never count as KRDS component coverage. Use built package exports (no source aliases). Core owns common code and manifests; native owners own only their app directories. Root manifest/lock/Nx changes go to controller.

## Fixture route and bridge

Every fixture production app provides `/fixtures/<component-id>?case=<case-id>`, including SPA fallback. For every route, render a native `role="status" aria-label="Fixture health"` with text `ready` after native mount, and install `window.__KRDS_FIXTURE__` through `createFixtureBridge(framework)` from `@krds-native/test-contracts/driver`.

Bridge: `{ protocol: 1, framework, setState(next): Promise<void>, readEvents(): {name,detail}[], getState(): Record, subscribe(listener): cleanup, recordEvent(name, detail), dispose() }`. Native owner subscribes to bridge changes and maps semantic state to native state. Bridge `setState` merges a JSON-only patch and waits two animation frames; listener is synchronous and native owner must schedule rendering immediately. `readEvents` returns a serializable snapshot, does not drain; new route means new empty history. Call dispose on unmount; don't put bridge in UI runtime package.

`createFixtureBridge(framework, initialState?)` installs the bridge on window, returns it. `subscribe` invokes listener immediately with current state. For pilot routes without implementation, keep the healthy bridge/status and show `role="note"` text `Component not implemented: <component-id>/<case-id>`. Do not emulate missing KRDS widgets with probe markup.

## Explicit infrastructure probe

Route `/fixtures/__probe?case=native-state`. Initial state `{count:0,label:"Probe increment",disabled:false}`. Native renderer shows button accessible name from `label`, `disabled` from state, and `role="status" aria-label="Probe value"` with count text. Click increments count and emits exactly one `recordEvent('change', {value: newCount})`; bridge state must reflect count. `setState({count:7,label:'Updated probe'})` changes native UI; next click displays 8. This route is only selected with runner `--probe`. Driver first verifies route health, bridge protocol and framework before assertions. Native code owns all renderer behavior.

## Canonical pilot routes

Default runner executes actual scenarios from fixture manifest; absent widgets intentionally fail with feature assertions after bridge health succeeds. Exact IDs: `button/disabled`, `native-select/controlled`, `native-select/form-reset`, `modal/focus-return`, `modal/trigger-removed`, `tabs/manual-activation`, `date-input/leap-year`, `date-input/ime`, `date-input/timezone-invariance`. Canonical selectors/state are described by `catalog/fixture-cases.json` and common scenarios. T05 owners only need healthy missing routes, not widgets. Health and missing-feature failures must be reported separately.

## Stories

Import `infrastructureStoryCases`, `storyStateCases` from `@krds-native/test-contracts/fixtures`; import `StoryStateCase` from package root. These are serializable state only. Native stories map state to native args/inputs and slots.

Infrastructure CSF title `Infrastructure/Native probe`, exports `Default`, `Loading`, `Error`, IDs `infrastructure-native-probe--default`, `--loading`, `--error`. Default visible button `Probe increment`, status named `Probe value` text `0`; loading button `Loading` disabled; error visible alert `Local error`. All three are test-only. Stories have no play, loaders, APIs, external assets, authentication or MSW. Local CSS/fonts permitted. Production Storybook output must be `apps/storybook-<framework>/dist` containing `index.json` and `iframe.html`; build script `storybook-build:local`. Common story runner serves this output directly, never dev/HMR. Native build target can call root `test:stories --framework <id>` (runner never calls Nx).

Default canonical story IDs derive from manifest, e.g. `krds-button--disabled`; missing canonical stories fail nonzero. Do not replace canonical entries with probes. Native package import may be the existing built probe export until owning component task replaces it.

## siheom

Native fixtures have `vitest.config.*`, `tests/setup.*`, `tests/siheom/native-probe.test.*` for explicit probe mode. Must exercise actual native render, click, controlled update and cleanup, with a separate focus test. Canonical behavior files are separate `tests/siheom/<component>.test.*`. Root runner sets `KRDS_TEST_MODE=probe|pilot` and passes exact selected paths; config must support this and fail when no tests. Workspace script `siheom:local` runs `vitest run --config vitest.config.ts`; common runner uses it directly, never invokes recursive root scripts. Six required native siheom adapters remain required even when blocked. Lit and Solid2 are unsupported by upstream adapters, reported with native Playwright alternative.

## Commands and resources

`node tools/yarn.mjs test:contract --framework <id> [--component <id>] [--browser chromium|firefox|webkit] [--probe]`; `--all-stable` selects 7 stable targets. Contract runner serves built fixture dist, finds Angular `dist/browser` when needed; Qwik production SSR ownership must report a server entry/command if static production fixture cannot resume.

`node tools/yarn.mjs test:stories --framework <id> [--probe] [--browser chromium]`; `--all-stable` retains seven required Storybooks. `node tools/yarn.mjs test:siheom --framework <id> [--probe]`; `--supported` retains six required adapters regardless of pending status. Framework selection accepts one or comma-separated IDs. Missing/empty/default suites are failures.

Common runners write unique JSON reports beneath ignored `test-results/t05/<kind>-<timestamp>-<pid>-<random>/` and report path on stdout. They allocate loopback port 0, clean up owned servers/browser contexts in finally, and never build or launch unselected apps. Browser download path `/private/tmp/krds-playwright-1.64.1`; export `PLAYWRIGHT_BROWSERS_PATH` for native siheom runs (common runners set it by default). Core announces actual browser install availability separately; do not concurrently install browsers.

Axe 4.14.0, Playwright 1.64.1; default viewport 1280x800, locale ko-KR, timezone Asia/Seoul, light mode, reduced motion reduce. Wait for `document.fonts.ready` before screenshots. Static source checks and browser request checks apply to stories. Report exact native tooling and commands to core/controller; only executed evidence permits manifest verification status.

## Fix round1: exact native pilot observations

The following clarifications replace the earlier vague pilot outcomes and are binding for T06+ fixture implementations. They do not require T05 native owners to implement widgets.

- `button/disabled`: native disabled button named `저장`; the common test asserts disabled then sends real browser mouse input at its visible bounds, expecting no emitted events. DOM `dispatchEvent('click')` is deliberately excluded because it bypasses native disabled activation.
- `modal/focus-return` and `modal/trigger-removed`: trigger button `열기`, dialog named `확인`, and focusable dialog close button `닫기`. The common test explicitly focuses `닫기` before closing with Escape. For `trigger-removed`, fixture state `{triggerVisible:false}` removes only the original trigger while keeping the dialog and its focus intact. An always-mounted external button named `다음 작업` is the exact fallback focus target after Escape closes the dialog. Connected body focus is insufficient. The default case restores the exact original trigger.
- `date-input/timezone-invariance`: the common test mounts the same route in fresh `Pacific/Kiritimati` and `America/Los_Angeles` browser contexts. Each mount proves native route/bridge health; it must emit zero unsolicited events. Semantic state `{value:'2024-02-29'}` must display exactly `2024-02-29` in the textbox named `날짜` in both zones, with zero events from controlled state injection. Treat the value as a date, not a UTC timestamp. Per-zone health evidence is attached and each context is closed even on failure.

`tools/tests/contract-observations.test.mjs` contains deliberate plain-DOM inspection fixtures that exercise correct and incorrect outcomes of these common gates. They are test infrastructure only, are not native adapters or KRDS component implementations, and never contribute catalog/story coverage.
