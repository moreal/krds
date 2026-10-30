# T05 Solid 2 native fixture foundation

Native fixture scope implemented and verified with the exact selected Solid 2 RC. No KRDS pilot implementation or catalog coverage is claimed. Controller retains shared-code and review ownership. No commits, installs, publishing, pushing or tagging were performed.

## Files changed

- `apps/fixture-solid-next/src/main.tsx`: native `@solidjs/web` render; built `@krds-native/solid-next` and `@krds-native/test-contracts/driver` imports; route-specific bridge; healthy native status; explicit state/click probe; missing-component notes for pilot routes; subscription/root lifecycle cleanup.
- `apps/fixture-solid-next/index.html`: fixture title, Korean document language and viewport.
- `apps/fixture-solid-next/package.json`: real local native Playwright test command using the shared installed browser directory; contract command forwards to the nonrecursive shared runner.
- `apps/fixture-solid-next/project.json`: contract invokes root selected runner, disables cache and requires own/dependency builds; local native tests also require own/dependency production builds.
- `apps/fixture-solid-next/playwright.config.ts`: explicit local native suite, unique output directories, Chromium, fixed viewport/locale/timezone/motion/color settings, forbidden-only/retries/workers policy.
- `apps/fixture-solid-next/tests/native-probe.spec.ts`: controlled state/event/disabled/keyboard focus; all nine healthy missing pilot routes; navigation history reset and native root disposal. Uses shared production static server with port 0 and finally cleanup.
- This report and `t05-solid-next-logs/01-*.log` through `20-*.log`.

`apps/storybook-solid-next/` was left unchanged. Its existing T01 candidate is not counted as verified native Storybook. No unsupported Solid 1 renderer or siheom adapter was substituted.

## Runtime and API evidence

Read `upstream/krds/raw/solid2-migration.html` before implementation and checked installed published types. Native rendering imports `@solidjs/web`, signals use the selected Solid 2 runtime, lifecycle subscription uses `onSettled`, disposal uses `onCleanup` and the render disposer, and delegated clicks use `onClick`. This is an original synthetic infrastructure probe, not a KRDS widget or real provider integration. No original KRDS JavaScript or new upstream assets are incorporated.

Installed resolution evidence is in `t05-solid-next-logs/15-versions.log`: Node **24.18.0**, Yarn **4.14.1**, `solid-js`/`@solidjs/web`/`@solidjs/compiler`/`@solidjs/babel-plugin` **2.0.0-rc.19**, `@solidjs/vite-plugin` **3.0.0-next.53**, Vite **8.3.5**, TypeScript **6.0.2**, Playwright/`@playwright/test` **1.64.1**. Browser installations are controller-owned `/private/tmp/krds-playwright-1.64.1`, Chromium **1248**, Firefox **1555**, WebKit **2370**.

## Executed verification

All commands use `node tools/yarn.mjs`; browser/server runs were approved outside the sandbox because loopback binding returns EPERM inside it. Complete actual command output is retained in the named logs.

| Command suffix | Result | Log |
| --- | --- | --- |
| `workspace @krds-native/fixture-solid-next build:local` on original T01 fixture | exit 0 | `01-baseline-build.log` |
| `test:contract --framework solid-next --probe` on original T01 fixture | exit 1, missing bridge timeout in real Chromium | `03-baseline-probe-red-unsandboxed.log` |
| `workspace @krds-native/fixture-solid-next typecheck` final | exit 0, no diagnostics | `17-final-typecheck.log` |
| `workspace @krds-native/fixture-solid-next build:local` final | exit 0; 52 modules; `dist/index.html`, native JS bundle | `18-final-build.log` |
| `workspace @krds-native/fixture-solid-next lint` final | exit 0; workspace verified | `19-final-lint.log` |
| `workspace @krds-native/fixture-solid-next test` final | exit 0; **3/3 native tests passed** | `16-final-native-tests.log` |
| `test:contract --framework solid-next --probe` final | exit 0; **1/1 Chromium probe passed** | `20-final-probe-chromium.log` |
| `test:contract --framework solid-next --browser webkit --probe` | exit 0; **1/1 WebKit probe passed** | `09-probe-webkit.log` |
| `test:contract --framework solid-next --browser firefox --probe` | exit 1; Firefox launch fails before fixture execution | `08-probe-firefox.log` |
| `TMPDIR=/private/tmp node tools/yarn.mjs test:contract --framework solid-next --browser firefox --probe` | exit 1; same Firefox profile startup failure | `11-probe-firefox-private-tmp.log` |
| `test:contract --framework solid-next` | exit 1; **9/9 expected missing-feature RED**, all nine native health attachments present | `10-pilot-red.log` |
| `test:siheom --framework solid-next --probe` | exit 1, explicit upstream unsupported result | `12-siheom-unsupported.log` |
| `test:stories --framework solid-next --probe` | exit 1, explicit native integration pending result | `13-stories-unverified.log` |

Native suite verifies the count/label/disabled bridge maps into Solid 2 DOM; click emits exactly one event and bridge state agrees; controlled count 7 followed by keyboard activation displays 8; disabled synthetic click does not change state or events; programmatic focus and keyboard activation work; new navigation starts with clean history; pagehide disposes the native root and bridge. Nine canonical route health/state round trips are independently green. This is Playwright evidence, not siheom evidence. No screenshot, axe, native component, IME, real-date or SSR acceptance is claimed beyond the infrastructure checks.

## Shared runner reports

- Final Chromium GREEN: `test-results/t05/contract-1793321709595-78048-ae4ac5ba/report.json`.
- Initial Chromium GREEN with probe screenshot: `test-results/t05/contract-1793321539803-75484-068fbae5/report.json`.
- WebKit GREEN: `test-results/t05/contract-1793321573891-76135-5d13d6a7/report.json`.
- Pilot expected RED: `test-results/t05/contract-1793321582606-76305-0a4b6f2d/report.json`; its `solid-next/playwright.json` has nine `native-health.json` attachments and each error says `Required KRDS feature not implemented: ...; native health passed`.
- Firefox environment failures: `test-results/t05/contract-1793321569392-76033-90ebe871/report.json` and retry `test-results/t05/contract-1793321618332-76941-760c8a3c/report.json`.
- Unsupported siheom: `test-results/t05/siheom-1793321619510-76957-e8958887/report.json`.
- Unverified Storybook: `test-results/t05/stories-1793321620083-76962-6b74d1aa/report.json`.

## Remaining limits and rulings

- Firefox 1555 exits immediately with `Could not find profile folder` before opening any fixture. Both the system temporary directory and `/private/tmp` fail, so no source change or common TMPDIR default is justified by this evidence. Controller/core were informed. Chromium and WebKit verify native fixture infrastructure.
- Upstream siheom has no Solid 2 RC native adapter; native Playwright is the explicit alternative. No siheom support claim, peer widening or wrapper.
- Storybook candidate remains unverified and is outside this preview-only gate. The root story runner fails explicitly rather than treating zero stories as success.
- Actual KRDS button/select/modal/tabs/date-input implementations, IME/date/timezone semantics, and SSR preview remain T09 work. Probes contribute zero component coverage.
- Existing tool output emits the `NO_COLOR`/`FORCE_COLOR` environment warning. Native page tests captured no browser `pageerror`.
- Scope ruling: implement only the specified native fixture and its own checks; leave unsupported Storybook candidate untouched, as the scoped Solid 2 brief explicitly permits. Cost if later required: a separate exact-RC native Storybook investigation, not acceptance of stable renderer compatibility.

Ready for the controller's scoped independent review. No shared files or compatibility statuses were edited by this owner.
