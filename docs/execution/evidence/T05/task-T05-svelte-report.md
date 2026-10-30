# T05 Svelte 5 native foundation execution report

Date: 2026-10-30 (Asia/Seoul). Scope: only `apps/fixture-svelte`, `apps/storybook-svelte`, this report and `t05-svelte-logs`. No commits, dependency installs, shared source edits, publishing, pushing or tagging.

## Result

Native production fixture probe PASS 1/1. Native siheom adapter smoke and separate trusted Playwright focus PASS 2/2. Native production Storybook infrastructure states PASS 3/3, with only local allowed requests and axe 4.14.0 zero violations. These probes contribute **zero KRDS implementation/catalog coverage**.

All nine canonical fixture cases fail after their native route, bridge and state health checks pass. Default siheom pilot fails because the KRDS button is absent after health and missing-component note checks pass. Five canonical stories remain absent and fail default story execution. These are expected implementation RED results, not environment failures.

## Exact file inventory

Modified:

- `apps/fixture-svelte/src/App.svelte`: native Svelte 5 runes, built public package imports, route parsing, mounted health, bridge subscription/disposal, explicit state/event probe, healthy missing-component routes.
- `apps/fixture-svelte/package.json`: actual default behavior runner, root contract/siheom forwarding and nonrecursive `siheom:local`.
- `apps/fixture-svelte/project.json`: uncached test/contract/siheom targets, production/dependency builds and common contract inputs.
- `apps/fixture-svelte/tsconfig.json`: include test/setup/config code in native typechecking.
- `apps/fixture-svelte/vitest.config.ts`: real Svelte browser compiler, probe/pilot selection, setup and fail-on-empty.
- `apps/storybook-svelte/.storybook/main.ts`: actual native Svelte Vite framework; resolve its installed package path for isolated Yarn pnpm layout; telemetry disabled.
- `apps/storybook-svelte/src/stories/probe.stories.ts`: exact three infrastructure IDs from shared serializable states; canonical state export explicitly excluded from stories.
- `apps/storybook-svelte/package.json`: production `storybook-build:local`, real default canonical story tests/root forwarding.
- `apps/storybook-svelte/project.json`: local static native build and uncached story/default tests, dependency builds and shared inputs.
- `apps/storybook-svelte/tsconfig.json`: include native Storybook configuration in typecheck.

Created:

- `apps/fixture-svelte/tests/setup.ts`: matcher setup and native cleanup/history reset.
- `apps/fixture-svelte/tests/siheom/native-probe.test.ts`: installed adapter render/click/state/events/disabled/cleanup smoke and separate trusted provider focus test.
- `apps/fixture-svelte/tests/siheom/button.test.ts`: separate canonical missing-widget RED after health.
- `apps/storybook-svelte/src/stories/NativeProbe.svelte`: native local args/state infrastructure component; default/loading/error, no network or behavior play.
- `.superpowers/sdd/PLAN/task-T05-svelte-report.md` and `.superpowers/sdd/PLAN/t05-svelte-logs/*`: evidence.

Generated production outputs remain ignored in each app's own `dist/`; common runner reports/screenshots/traces remain ignored under `test-results/t05/`.

## Executed commands and outcomes

All commands use the selected toolchain launcher. Browser commands required approved localhost/browser execution because sandboxed loopback listen returns EPERM. Commands below use the common runner's `/private/tmp/krds-playwright-1.64.1` browser path.

| Command | Actual result | Own log |
| --- | --- | --- |
| `node tools/yarn.mjs workspace @krds-native/fixture-svelte build:local` | exit 0; native Vite production build | `15-fixture-final-build.log` |
| `node tools/yarn.mjs workspace @krds-native/fixture-svelte typecheck` | exit 0; 0 errors, 0 warnings including native tests | `28-final-fixture-typecheck.log` |
| `node tools/yarn.mjs workspace @krds-native/storybook-svelte storybook-build:local` | exit 0; native Storybook dist includes index.json/iframe.html; only standard large bundle warning | `18-storybook-final-build.log` |
| `node tools/yarn.mjs workspace @krds-native/storybook-svelte typecheck` | exit 0; 0 errors, 0 warnings | `22-storybook-final-typecheck.log` |
| `node tools/yarn.mjs test:contract --framework svelte --probe` | exit 0; Chromium 1 passed, 0 failed | `23-contract-probe-final.log` |
| `node tools/yarn.mjs test:stories --framework svelte --probe` | exit 0; 3 passed, no blocked requests/axe violations | `24-stories-probe-final.log` |
| `node tools/yarn.mjs test:siheom --framework svelte --probe` | exit 0; 2 passed, 0 failed; provider input is trusted | `27-siheom-provider-trusted.log` |
| `node tools/yarn.mjs test:contract --framework svelte` | exit 1 expected; all nine scenarios healthy then missing-feature RED | `12-contract-pilot-red.log`; `26-pilot-health-summary.json` |
| `node tools/yarn.mjs workspace @krds-native/fixture-svelte test` | exit 1 expected; 1 canonical button failure after health | `20-siheom-pilot-red.log` |
| `node tools/yarn.mjs workspace @krds-native/storybook-svelte test` | exit 1 expected; five canonical stories absent | `21-stories-pilot-red-final.log` |

Initial RED evidence: `04-native-probe-red-localhost.log` shows the original compiler-only fixture cannot provide the bridge. `01-native-red.log` records the original shared Vitest mocker/Vite peer startup error; T01 root owner subsequently fixed and proved the peer forwarding. `03-native-probe-red.log` records sandbox EPERM, resolved through targeted approved execution. `07-storybook-build.log` records native preset bare resolution failure, fixed by resolving the framework package relative to this app. `06-fixture-typecheck.log` exposed Svelte's local `state` versus `$state` name conflict (renamed to `probeState`); `11-storybook-typecheck.log` exposed CSF export `Error` shadowing the global constructor (use `globalThis.Error`). Later logs above show these resolved.

## Machine-readable evidence

All paths below are relative to the repository root:

- Final contract probe: `test-results/t05/contract-1793321702441-77961-d2c1cbac/report.json` (native health, click 0→1, semantic update to 7, click to 8, two events; screenshot after font readiness).
- Canonical contract RED: `test-results/t05/contract-1793321538042-75455-2cb9042d/report.json` and `svelte/playwright.json`. Nine native-health attachments prove healthy routes before all nine feature failures. Own `26-pilot-health-summary.json` extracts each healthy result and exact missing-feature error.
- Final siheom smoke/focus: `test-results/t05/siheom-1793321775950-78655-2e73259b/report.json` and `svelte-vitest.json` (2 passed).
- Canonical siheom RED: `test-results/t05/siheom-1793321680841-77763-90f7bba1/report.json` and `svelte-vitest.json`; snapshot contains healthy fixture and missing-component note before absent `button "저장"` assertion.
- Final Storybook probe: `test-results/t05/stories-1793321703572-77975-866f4550/report.json` (3 passed, each allowed local requests and zero axe violations; per-state screenshots in `svelte/`).
- Canonical story RED: `test-results/t05/stories-1793321688986-77823-80183dd2/report.json` (5 required IDs missing).
- Shared request-policy negative proof (core-owned and executed by core): `.superpowers/sdd/PLAN/t05-core-logs/network-negative-approved.log`, `tools/tests/story-network.test.mjs`. Core reported actual Chromium execution, five forbidden attempted requests, zero forbidden requests completed, and visible fixture still rejected. Svelte's three positive production request-policy cases executed independently above.

## Native siheom API/input evidence

Inspected installed published sources: `@siheom/svelte/src/index.ts`, `given.ts`, `testSetup.ts`, `effects.ts`; `@siheom/core/src/action.ts`, `query.ts`, `assert.ts`, `siheom.ts`. Installed Svelte `given.render` accepts the native component function and calls `@testing-library/svelte` render/act. The adapter's actual `runSiheom` uses core default actions backed by testing-library user-event.

1. Smoke uses the actual `@siheom/svelte` exported `runSiheom`, `given.render(App)`, `actions.click`, `assertions.textContent`, `assertions.disabled`. Input is **synthetic testing-library user-event** in the real Chromium browser. It verifies native UI, exactly one event per enabled click, controlled label/count update, bridge state, disabled state and cleanup removing button/bridge.
2. Separate focus uses core `createRunSiheom` with Svelte's actual `defaultGivens`/`svelteEffects`, core `defaultAssertions`, and `createDefaultActions({ user: userEvent })` from the installed `vitest/browser` Playwright provider. It executes siheom's click/focused assertion and independently requires the delivered DOM click event's **`isTrusted === true`**. This is real browser-provider input.

## Versions and remaining limits

Observed runtime versions (`25-versions.log`) and directly pinned tooling: Node v24.18.0; Svelte 5.57.3; @siheom/svelte 0.3.2; @siheom/core 0.4.1; Vitest/browser-provider 4.1.10; Vite 8.3.5; Playwright 1.64.1 (Chromium revision 1248); Storybook/@storybook/svelte-vite 10.6.5; axe 4.14.0. Yarn remains the selected vendored 4.14.1. No dependency changes requested or lock edits performed by this owner.

No outstanding Svelte foundation environment blocker. Actual KRDS widgets and their canonical stories are deliberately unimplemented. Only Chromium was exercised by this native subtask; common runner exposes the other exact installed engines. Nx affected/root aggregation, shared protocol/runners/manifests, negative policy proof and release identity/compliance checks belong to their designated owners. No source alias, cross-renderer wrapper, remote assets, play/loaders or KRDS original script was introduced.
