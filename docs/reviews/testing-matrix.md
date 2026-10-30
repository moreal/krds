# Executed compatibility and SSR matrix

The reproducible gates are `node tools/yarn.mjs verify:compatibility` and `node tools/yarn.mjs test:ssr`. Both run Node 24.18.0 through Yarn 4.14.1. Full compatibility verification checks the exact declared runtime/compiler copies, public peers, package and consuming-fixture types, and production builds. `--metadata-only` is an explicitly narrower diagnostic that cannot stand in for the full gate.

| Target | Selected runtime | Native server/client path |
| --- | --- | --- |
| React | 19.3.1 | `react-dom/server.renderToString` and `react-dom/client.hydrateRoot` |
| Solid 1 | 1.9.18 | `solid-js/web.renderToString` and `hydrate`; requires actual server public exports |
| Svelte | 5.57.3 | `svelte/server.render` and `svelte.hydrate` with native `.svelte` compilation |
| Vue | 3.5.44 | `@vue/server-renderer.renderToString`, `createSSRApp().mount` |
| Lit | 3.3.3 | `@lit-labs/ssr` 4.1.0 declarative Shadow DOM and official SSR client hook 1.1.8 |
| Qwik | 1.20.3 | Vite 7 production SSR, paused serialization and cold QRL resume; Chromium precise execution coverage is separate |
| Angular | 22.2.4 | CLI/ng-packagr 22.2.5 partial APF, `provideClientHydration`, OnPush and zoneless Reactive Forms |
| Solid 2 preview | exact 2.0.0-rc.19 | separate exact runtime/renderer/compiler with plugin 3.0.0-next.53; six pilots only |

The default SSR matrix runs Chromium, Firefox and WebKit across UTC, Asia/Seoul and America/Los_Angeles. Native pilot checks require a DOM-free server entry, actual SSR control identity retained during hydration/resume, one first button event, one first selection event, canonical leap-date FormData, label/tab ID links and teardown of an open modal without stale inert/scroll state. Errors and external requests fail a row. A launch failure produces a failed row; no engine substitutes for another.

On the actual host (macOS 27.2, build 26B123, arm64), all nine browser/context health rows passed using Playwright 1.64.1: Chromium 156.0.8078.4, Firefox 157.0 and WebKit 27.2. This is launcher/context evidence only. Firefox initially failed with `Could not find profile folder` despite an existing writable temporary profile. The [upstream Playwright issue](https://github.com/microsoft/playwright/issues/42768) describes macOS 27 protection of Firefox's shared app-data root. T13 reproduced a successful launch by creating separate temporary `MOZ_APP_DATA` and `MOZ_LOCAL_APP_DATA` directories. `tests/compatibility/browser-environment.mjs` preserves explicit caller values, creates missing directories per run and removes only generated directories after browser close. It changes no browser version, binary, HOME or system permission. The filesystem sandbox also prevents normal loopback/browser startup, so actual browser commands ran through approved local execution outside that sandbox.

Each SSR run writes `test-results/t13/ssr-runs/<timestamp>/results.json`, exact source-before/after inventories, tested artifact hashes, command logs, and per-framework/browser/time-zone JSON. Any source drift fails aggregate acceptance. Compatibility writes equivalent source-bound inventories and types/build logs under `test-results/t13/compatibility-runs/`. These are six-pilot integration checks; full catalog contracts, six baseline plus 344 catalog story states, outside tarball installs and manual accessibility remain independent gates.

T14 owns minimum/current isolated tarball installs and their own lockfiles. The frozen T00 minimum/current bounds coincide at the selected exact runtime versions; results do not claim later registry releases or future Solid 2 RCs. Outside results under `artifacts/consumers/` retain actual resolved versions, compiler paths, candidate inventory hash and per-row logs. A debug inventory or a source-changing run cannot serve as final frozen-candidate support proof.

Human gates are machine-readable in [manual-gates.json](manual-gates.json). Actual screen-reader speech, real browser zoom, operating-system high contrast, touch assistive technology and authentic media equivalence are not accepted yet. Publication, pushing and tagging remain unauthorized.

## Retained incremental results (2026-10-30)

| Execution | Actual result | Acceptance limit |
| --- | --- | --- |
| `05-32-21.917Z` SSR run | React, Svelte, Vue, Lit, Qwik and exact Solid 2: nine browser/time-zone rows each passed; Qwik precise resume passed; Angular APF SSR build passed and hydration failed the one-event CVA assertion | Aggregate failed because of the Angular defect and source drift |
| `05-34-59.895Z` Solid 1 run | Nine native SSR/hydration rows passed after the owning renderer added public native server exports | Aggregate failed source drift; no final source acceptance |
| `05-40-21.333Z` Angular rerun | Official partial APF SSR build and all nine native hydration/CVA rows passed after the owner removed the redundant validator notification | Source-before/after matched for this Angular run; later changes require a fresh final candidate run |
| `05-36-41.744Z` full compatibility run | Svelte, Lit, Qwik, Angular and exact Solid 2 package/fixture type/build rows passed; React, Solid 1 and Vue exposed actual compiler errors | Aggregate failed; owner repairs and the in-progress Solid example API integration require a fresh complete rerun |
| `05-48-48.112Z` registered stable SSR rerun | All seven stable renderers passed all nine browser/time-zone rows each (63 positive rows); Qwik production/precise resume and Angular partial APF SSR stages passed | Aggregate failed source drift during live catalog implementation; final freeze still required |
| `05-46-16.168Z` registered full compatibility rerun | Seven targets passed all exact metadata, package/fixture types and production builds; only Solid 1 fixture types still fail the pending Header example API integration | Aggregate failed that actual compiler error and source drift |
| `05-41-23.366Z` compatibility diagnostic | Exact installed runtime/compiler/toolchain declarations and public peer development copies passed for all eight entries | Metadata only; excludes type/build, outside install and browser acceptance |

Timestamp directories are under the corresponding `test-results/t13/{ssr-runs,compatibility-runs}/` paths. Source inventories and raw per-row reports remain authoritative; these historical positive rows do not override an aggregate failure or establish a final freeze.


## Real page visibility capability

The focused `tests/compatibility/visibility-probe.mjs` uses the same selected headed Chromium with fresh temporary profiles. Playwright 1.64.1 ordinarily enables focus emulation on its internal target session, so second tabs, external CDP focus commands and native minimization still appeared visible in the original automated context. The documented [connectOverCDP `noDefaults` option](https://playwright.dev/docs/api/class-browsertype#browser-type-connect-over-cdp-option-no-defaults) leaves the default context's focus state under the native browser; creating a new context would re-enable the default overrides.

With `tests/compatibility/headed-browser.mjs`, actual second-tab activation produces `document.hidden === true` and natural `visibilitychange`; restoring the first tab returns false. Genuine [CDP native-window minimization/restoration](https://raw.githubusercontent.com/ChromeDevTools/devtools-protocol/master/pdl/domains/Browser.pdl) produces the same real transition. Keeping or removing the three default anti-backgrounding flags both succeeds: the cause is focus emulation, not a need to weaken application assertions. No document property, event or timer outcome is spoofed. Both test profiles were independently confirmed removed after cleanup; native window state is restored before browser close.

`test-results/t13/visibility/results.json` records both configurations and all real observations. This proves the browser capability, not Toast/Snackbar outcome acceptance. The shared observer owns the subsequent bounded actual-case integration for Toast `outcome-05` and Snackbar `outcome-12`, with fixture clocks, host health and application assertions unchanged. Other browser projects must use their own actual engine, never substitute Chromium evidence.
