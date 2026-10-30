# T05 Solid 1 native foundation

Solid 1 infrastructure is implemented and verified. KRDS pilot components remain unimplemented and are intentionally RED. Infrastructure probes contribute zero catalog coverage. No shared root/package/catalog/lockfile files were edited by this owner; no installs, commits, publication, pushing or tagging were performed.

## Native implementation

- `apps/fixture-solid/src/fixture-app.tsx`: Solid signals, mount health, built `@krds-native/test-contracts/driver` bridge, bridge subscription and disposal, explicit `__probe/native-state` button/count, disabled state, exactly one event per enabled click, healthy missing-component note for canonical routes. Consumes built `@krds-native/solid` export; no source alias or foreign renderer.
- `apps/fixture-solid/src/main.tsx`: `/fixtures/<component>?case=<case>` route decoding, native render, HMR/page teardown.
- `apps/fixture-solid/src/vite-env.d.ts`: Vite runtime types.
- `apps/fixture-solid/tests/setup.ts`: explicit native cleanup after each test.
- `apps/fixture-solid/tests/siheom/native-probe.test.tsx`: actual installed Solid adapter render, click, controlled count/label update, disabled ignored click, cleanup/disposed bridge; separate focus test.
- `apps/fixture-solid/tests/siheom/button.test.tsx`: actual default disabled-button pilot failure after health/framework/protocol assertions.
- `apps/fixture-solid/vitest.config.ts`: explicit probe/pilot selection, fail-on-empty, real Chromium browser provider, fixed viewport/locale/timezone/color/reduced motion, unique ignored screenshot directory. Explicit `environment: 'node'` prevents vite-plugin-solid's unnecessary auto-jsdom fallback; browser mode remains enabled and executes both tests in Chromium.
- `apps/fixture-solid/package.json`, `project.json`, `tsconfig.json`, `playwright.config.ts`: direct local siheom command, root runner targets with build prerequisites/cache disabled/common inputs, test typechecking, shared production Playwright config.
- `apps/storybook-solid/.storybook/main.ts`, `.storybook/preview.ts`: actual native Solid Storybook builder, local stories, telemetry disabled. With the pnpm linker this package has no physical root `preset.js`: framework path resolves to `dirname(require.resolve('storybook-solidjs-vite/preset'))`, retaining the installed native renderer/preset/builder.
- `apps/storybook-solid/src/stories/native-probe.tsx`, `probe.stories.tsx`: local Solid props/state and three serializable infrastructure states; shared canonical states remain unimplemented. No play/loaders/API/auth/CDN/external assets.
- `apps/storybook-solid/src/stories/probe.stories.ts`: obsolete T01 bootstrap story replaced by the TSX infrastructure story.
- `apps/storybook-solid/package.json`, `project.json`, `tsconfig.json`, `playwright.config.ts`: real native production build and default story runner, shared input tracking, shared Playwright config. Production `dist/index.json` has exactly the three required infrastructure IDs and `dist/iframe.html` exists.

## Tooling and execution

All commands use `node tools/yarn.mjs`, which launches selected Node 24.18.0 and vendored Yarn 4.14.1. Native versions: solid-js 1.9.18, vite-plugin-solid 2.11.14, babel-preset-solid 1.9.16, Vite 8.3.5, TypeScript 6.0.2, Vitest/browser provider 4.1.10, siheom Solid 0.3.2/core 0.4.1, Storybook 10.6.5/native integration 10.7.4, Playwright 1.64.1/Chromium revision 1248, axe 4.14.0. No Solid 2 packages are used.

Commands executed from repository root (logs in `t05-solid-logs/`):

| Command suffix after `node tools/yarn.mjs` | Result | Log |
| --- | --- | --- |
| `workspace @krds-native/fixture-solid typecheck` | exit 0 | `29-final-fixture-typecheck.log` |
| `workspace @krds-native/storybook-solid typecheck` | exit 0 | `25-final-story-typecheck.log` |
| `workspace @krds-native/fixture-solid build:local` | exit 0, own dist | `26-final-fixture-build.log` |
| `workspace @krds-native/storybook-solid build:local` | exit 0, actual Storybook static build | `27-final-storybook-build.log` |
| `workspace @krds-native/fixture-solid lint` | exit 0, workspace checker passed | `28-workspace-lint.log` |
| `test:contract --framework solid --probe` | exit 0, 1 passed | `15-contract-probe.log` |
| `test:contract --framework solid` | intentional exit 1, 9 missing features after 9 healthy native bridges | `17-contract-pilot-red.log` |
| `test:stories --framework solid --probe` | exit 0, 3 states passed, 0 request violations, axe 4.14.0: 0 violations | `16-stories-probe.log` |
| `test:stories --framework solid` | intentional exit 1, 5 missing canonical stories | `18-stories-pilot-red.log` |
| `test:siheom --framework solid --probe` | exit 0, 2 passed, native smoke and separate focus | `30-final-siheom-probe.log` |
| `test:siheom --framework solid` | intentional exit 1, disabled button absent after health passed | `23-siheom-pilot-red.log` |

Browser/server commands required the approved sandbox execution path for local loopback and installed Chromium; no browser installation was performed by this owner. Common runners select Solid only, allocate isolated local production origins and unique report directories, and clean up servers/contexts. Screenshots wait for fonts through the common production runner.

Initial real Chromium probe RED before bridge implementation is in `09-initial-contract-red-browser.log`: T01 entry loaded but bridge was absent. The implemented production probe subsequently passed. Initial build/type failures and the shared Vitest peer-resolution blocker are preserved in earlier numbered logs; these are resolved. The first successful browser tests still returned exit 1 because vite-plugin-solid automatically injected an unavailable jsdom environment; explicitly suppressing that fallback produced clean exit 0 without adding dependencies.

## Durable evidence

Summary JSON copies are in `t05-solid-logs/`:

- `contract-probe-report.json`: original `test-results/t05/contract-1793321574533-76143-2f855dfa/report.json`.
- `contract-pilot-report.json` and `pilot-health-summary.json`: original `test-results/t05/contract-1793321600067-76641-384b4a70/report.json`; all 9 cases have native-health attachments and explicit missing-feature failure messages.
- `stories-probe-report.json`: original `test-results/t05/stories-1793321577318-76222-739759f3/report.json`; 3 states with local asset request details and axe results.
- `stories-pilot-report.json`: original `test-results/t05/stories-1793321600449-76647-961ac055/report.json`.
- `siheom-probe-report.json`: final original `test-results/t05/siheom-1793321768664-78596-1ad8da0b/report.json`, native smoke plus focus 2/2 passed.
- `siheom-pilot-report.json`: original `test-results/t05/siheom-1793321701176-77940-5c05ee56/report.json`; failure snapshot includes native status ready and missing-component note. `siheom-pilot-red.png` preserves its screenshot.

The shared negative browser request proof was executed by core and reviewed here: `.superpowers/sdd/PLAN/t05-core-logs/network-negative-approved.log` reports 1 passed test. It blocks external fetch, same-origin API, WebSocket, EventSource and service-worker attempts before transmission and rejects apparent visible success. No per-framework negative duplicate was added.

## Input semantics and remaining work

Installed `@siheom/solid/src/given.ts` calls native testing-library render with a component function. Tests pass `given.render(Probe)`, never a JSX result. Installed adapter `runSiheom` uses core default actions backed by `@testing-library/user-event`, so its clicks and focus checks are synthetic DOM input in a real Chromium page. The independent production Playwright probe uses browser-provider input. Neither result claims trusted input through siheom.

There are no remaining Solid infrastructure blockers. The Storybook bundle-size warning is informational and unchanged from the native integration output. Default canonical suites remain RED intentionally: KRDS button/select/modal/tabs/date-input implementations and their canonical stories are subsequent component-owner work. This report does not claim their coverage or framework-wide production component support.
