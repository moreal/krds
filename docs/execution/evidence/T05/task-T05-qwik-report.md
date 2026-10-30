# T05 Qwik native foundation report

Status: implemented and exercised. Infrastructure probes pass; absent KRDS pilots remain intentionally RED. No Git commit, publishing, pushing, tagging, installs, root manifest edits, or shared package edits were performed by this owner.

## Scope and native boundary

The fixture uses Qwik 1.20.3 and its optimizer on Vite 7.3.1. `/fixtures/__probe?case=native-state` is explicitly test-only native client rendering. All nine canonical routes render a healthy native status/bridge plus the exact missing-component note; no KRDS widget is emulated. The bridge lives inside `useVisibleTask$`, subscribes into serializable Qwik store fields, records JSON events, and disposes on native unmount. Event QRLs access the installed bridge through `window`; no bridge, DOM, unsubscribe callback, or machine is captured into Qwik serialized state.

This CSR fixture and client-rendered Qwik Storybook are **not T07Q production SSR/resume evidence**. There is no production SSR server entry/command in this T05 work. T07Q must provide its own native server/resume/first-interaction verification.

Stories use `storybook-framework-qwik` native rendering and shared built `@krds-native/test-contracts/fixtures` state. IDs are exactly `infrastructure-native-probe--default`, `--loading`, `--error`. They are local args/state only. Canonical stories stay missing.

## File inventory

Created or replaced:

- `apps/fixture-qwik/src/root.tsx`: native route health, bridge, explicit infrastructure probe and missing-component note.
- `apps/fixture-qwik/src/main.tsx`: real native client bootstrap, consuming built public native package through Root.
- `apps/fixture-qwik/vite.config.ts`: explicit CSR native optimizer and official Qwik loader injection.
- `apps/fixture-qwik/index.html`: client fixture entry/document metadata.
- `apps/fixture-qwik/vitest.config.ts`: mode-selected nonempty native suites, real Chromium provider, fixed environment, ephemeral loopback API port, CJS testing dependency optimization.
- `apps/fixture-qwik/tests/setup.ts`: official Qwik v1 testing setup, jest-dom matchers, native cleanup.
- `apps/fixture-qwik/tests/siheom/native-probe.test.tsx`: actual published adapter render/click/controlled input/cleanup smoke plus separate focus result.
- `apps/fixture-qwik/tests/siheom/button.test.tsx`: canonical disabled-button RED after native health and exact missing note.
- `apps/fixture-qwik/tsconfig.json`: includes native behavior test sources in typecheck.
- `apps/fixture-qwik/package.json`, `project.json`: local Vitest command, nonrecursive common runners, uncached behavior targets, build and shared input dependencies; replaced T01 bootstrap-only `test`.
- `apps/storybook-qwik/.storybook/main.ts`: native integration resolved absolutely for isolated pnpm-linker package resolution.
- `apps/storybook-qwik/src/stories/native-probe.tsx`: pure local Qwik story probe component.
- `apps/storybook-qwik/src/stories/probe.stories.tsx`: exact shared infrastructure state mapping and canonical pending IDs.
- `apps/storybook-qwik/package.json`, `project.json`: production `storybook-build:local`, nonrecursive common story runner, uncached behavior target; replaced T01 bootstrap-only `test`.

Removed stale `apps/fixture-qwik/playwright.config.ts` and `apps/storybook-qwik/playwright.config.ts`, which pointed at absent per-app suites. The shared production Playwright runner owns configuration.

Existing `entry.dev.tsx` / `entry.ssr.tsx` and the unused story-app T01 root/main files are unchanged; they do not establish SSR coverage and are not Storybook story inputs. No extra direct dependencies were needed.

## Versions and published adapter API

Selected Node **24.18.0** verified through `node tools/yarn.mjs exec node -p 'JSON.stringify({node:process.versions.node,executable:process.execPath})'`; executable `/Users/moreal/.local/share/mise/installs/node/24.18.0/bin/node`. Yarn **4.14.1** remains selected by the wrapper. Runtime/compiler **Qwik 1.20.3**, Vite **7.3.1**, TypeScript **6.0.2**. Storybook **10.6.5**, native Qwik integration **0.6.1**. Vitest/browser provider **4.1.10**, Playwright **1.64.1**, axe **4.14.0**. Actual adapter **@siheom/qwik 0.3.2**, core **0.4.1**, native testing library **@noma.to/qwik-testing-library 1.7.1**, jest-dom **7.0.1**.

Installed published `@siheom/qwik/src/given.ts` defines `given.render(element: JSXOutput)` and delegates to native `@noma.to/qwik-testing-library.render`. The tests use its actual exported `runSiheom`, `given`, `query`, `actions`, `assertions`, not a locally invented adapter API. Smoke passes JSX, increments local native state, fills a controlled input and checks both value and state echo, calls real cleanup, and verifies the button disappears. Separate focus test uses click then tab and verifies the native button/input focus.

Input provenance: siheom actions use the published adapter/core's testing-library synthetic user-event actions **inside real Chromium**; they are not Playwright mouse/keyboard provider actions. The separate common contract probe uses actual Playwright browser click operations against the built fixture. All probe data is synthetic local infrastructure data, with zero KRDS component coverage.

## Executed commands and results

Every Node/Yarn command used `node tools/yarn.mjs`; native browser runs used shared `PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1`. Browser/loopback execution used targeted approved execution. No concurrent browser installation was attempted.

| Command (after wrapper) | Actual result | Saved evidence in `t05-qwik-logs/` |
| --- | --- | --- |
| `workspace @krds-native/fixture-qwik typecheck` | PASS, native source and test sources included | `fixture-typecheck.log` |
| `workspace @krds-native/fixture-qwik build:local` | PASS, Vite 7.3.1 production `dist/index.html`, Qwik manifest and native chunks | `fixture-build.log` |
| `workspace @krds-native/storybook-qwik typecheck` | PASS | `story-typecheck.log` |
| `workspace @krds-native/storybook-qwik storybook-build:local` | PASS, real native production `dist/index.json` + `iframe.html` | `story-build.log` |
| `test:contract --framework qwik --probe` | PASS, 1 native route probe, bridge updates and exact event history | `contract-probe.log`, `contract-probe-report.json`, `contract-probe-playwright.json` |
| `test:contract --framework qwik` | Expected RED: 9/9 fail specifically at missing KRDS feature boundary after native health | `contract-pilot-red.log`, `contract-pilot-red-report.json`, `contract-pilot-red-playwright.json` |
| `test:stories --framework qwik --probe` | PASS, 3/3 exact native states; allowed local assets; zero request violations; axe 4.14.0 zero violations | `story-probe.log`, `story-probe-report.json` |
| `test:stories --framework qwik` | Expected RED: all 5 canonical story IDs missing | `story-pilot-red.log`, `story-pilot-red-report.json` |
| `test:siheom --framework qwik --probe` | PASS, 2/2 actual native tests: smoke and separate focus | `siheom-probe.log`, `siheom-probe-report.json`, `siheom-probe-vitest.json` |
| `test:siheom --framework qwik` | Expected RED: route health and missing note pass; disabled assertion cannot find absent KRDS save button | `siheom-pilot-red.log`, `siheom-pilot-red-report.json`, `siheom-pilot-red-vitest.json` |
| `exec node --test tools/tests/story-network.test.mjs` | PASS, 1 real-browser shared negative request fixture | `request-policy-negative.log` |
| `exec node tools/check-workspace.mjs` | PASS, selected pins/linker/private metadata/import boundaries | `workspace-check.log` |

The contract RED report was inspected: all nine failures include `native health passed` and occur inside `required observable behavior`, not bridge/server startup. They cover disabled click, controlled select/form reset, modal focus/removed trigger, manual tabs, leap-year/IME/timezone date cases. Canonical siheom RED log records `Fixture health` ready and `Component not implemented: button/disabled` before the missing button assertion.

The request-policy negative test is the core-owned isolated fixture, executed by this owner without modification. It verifies allowed local document fetch succeeds, external and same-origin API fetches reject, WebSocket/EventSource/service-worker attempts are blocked and detected, and no forbidden request finishes. The external address is deliberately invalid and the interception prevents sending; no external provider/network service was contacted.

Primary ignored evidence directories:

- Contract probe: `test-results/t05/contract-1793321611138-76791-31fca24a/`
- Canonical contract RED: `test-results/t05/contract-1793321634901-77074-91aaedf3/`
- Story probes/screenshots: `test-results/t05/stories-1793321571496-76068-6fc4225a/`
- Canonical missing stories: `test-results/t05/stories-1793321637360-77110-8e5f6917/`
- Final siheom probe: `test-results/t05/siheom-1793321856165-79234-bcf967d1/`
- Canonical siheom RED: `test-results/t05/siheom-1793321808424-78826-b8e2d1cb/`

## Concrete issues resolved and limits

1. A top-level `void render(...)` expression was eliminated by the native Qwik optimizer, producing a misleading empty 3-module build. Plain `render(...)` keeps the client bootstrap; final build emits the actual renderer/components/QRLs. Browser health and click assertions confirm execution.
2. CSR output does not automatically execute its emitted Qwik event loader. Injecting the official `QWIK_LOADER` through a Vite HTML transform restores native click/QRL dispatch. Initial bridge health succeeded but click count stayed zero; final production probe passes through 0 → 1 → controlled 7 → 8.
3. Isolated pnpm-linker Storybook could not resolve relative `storybook-framework-qwik/preset` from Storybook's own store location. Resolve the native integration's directory from the consuming app's `createRequire` in `.storybook/main.ts`; no peer forcing or foreign renderer used.
4. First siheom browser import failed because unoptimized `aria-query` CJS did not expose named `elementRoles`. Explicit `optimizeDeps.include` for directly declared DOM testing-library packages fixes browser ESM interop while preserving native Qwik packages through their optimizer. No install or patch to upstream packages was used.
5. Vitest normalizes browser API port `0` to its default port. The config explicitly reserves a kernel-selected loopback port using `node:net`, releases it before native Vitest bind, and retains normal Vitest fallback if that brief handoff races. Outputs remain unique through core runner report directories.

No unresolved T05 Qwik infrastructure blocker. KRDS component coverage remains zero; the missing canonical widgets/stories are expected implementation-task work. T07Q SSR/resume is unverified and independent. Initial Storybook warnings about base formatting and bundle size are nonblocking; actual static build and browser policy checks passed.
