# T05 React native testing foundation report

Status: native infrastructure verified; real KRDS pilot components remain unimplemented and intentionally RED. No commits, pushes, tags, publishing, shared-source edits, or dependency installs were performed by this owner.

## Implementation

- Production React fixture uses its native React renderer and built public `@krds-native/react` / `@krds-native/test-contracts` entries. Every `/fixtures/<component>?case=<case>` route mounts the `Fixture health` status, installs protocol 1 React bridge, subscribes native state immediately, records click events, and disposes on unmount. Only explicit `__probe/native-state` renders the test-only controlled button/count. Canonical routes contain the exact missing-component note and no fake widgets.
- Actual `@siheom/react@0.4.1` adapter covers native render, provider click, controlled count update, cleanup, and separate focus. API inspected from installed published `src/index.ts`, `src/given.ts`, `src/reactRegistries.ts`, and `@siheom/core/src/{action,assert,query}.ts`; API calls are `createReactSiheom({ user: userEvent })`, `given.render(element)`, `actions.click(query.button(...))`, `assertions.textContent/focused`, and `cleanupReactRoots()`.
- Smoke and focus inject `userEvent` from `vitest/browser` into the adapter, so click/focus use Playwright provider input, not the adapter's default synthetic user-event input. Canonical siheom cases execute health/protocol assertions then feature-presence assertions; they fail before input because widgets are absent. No real KRDS focus, disabled-click, select, modal, tabs or date behavior is claimed.
- Native `@storybook/react-vite` builds three infrastructure CSF states from built pure shared fixtures. No play, loaders, API/auth/MSW/CDN/external assets. Canonical shared states are referenced as pending IDs but no canonical story is fabricated. Actual `dist/index.json` and `dist/iframe.html` exist. The builder resolves its integration with workspace-local `createRequire(...).resolve()` to support Yarn pnpm layout.
- Workspace and Nx scripts use common nonrecursive runners and build native output first. The default test scripts execute real canonical suites and return nonzero for absent components/stories. Local Vitest has nonempty mode selection and puts screenshots/attachments under a unique ignored run directory, rather than source directories.

## Exact versions and conditions

Node 24.18.0; Yarn 4.14.1; React/ReactDOM 19.3.1; TypeScript 6.0.2; Vite 8.3.5; @vitejs/plugin-react 6.1.2; Vitest/@vitest/browser-playwright 4.1.10; @siheom/core/@siheom/react 0.4.1; Storybook/@storybook/react-vite 10.6.5; Playwright 1.64.1 (Chromium 1248); axe 4.14.0. Commands always enter through `node tools/yarn.mjs`, which launches exact selected Node/Yarn. Installed browser root is `/private/tmp/krds-playwright-1.64.1`. Native browser tests use 1280x800, ko-KR, Asia/Seoul, light, reduced-motion reduce; common screenshot runner waits for document fonts. No remote fonts/assets were used.

## Commands and observed results

Logs below are under `t05-react-logs/`; complete command outputs and JSON summaries are retained there. Local server/browser commands used approved execution after ordinary sandbox execution returned `listen EPERM`.

| Command after `node tools/yarn.mjs` | Exit/result | Evidence log |
|---|---|---|
| `workspace @krds-native/fixture-react build:local` (baseline) | 0; existing T01 output built | 02-baseline-build.log |
| `exec node tools/run-contract-tests.mjs --framework react --probe` (baseline) | 1; real browser route timed out waiting for missing bridge | 04-contract-baseline-red.log |
| `workspace @krds-native/fixture-react typecheck` | 0 | 25-fixture-final-typecheck.log |
| `workspace @krds-native/fixture-react build:local` | 0 | 07-fixture-build.log |
| `workspace @krds-native/storybook-react typecheck` | 0; includes `.storybook` config | 18-story-typecheck-config.log |
| `workspace @krds-native/storybook-react storybook-build:local` | 0; native production output | 20-story-final-build.log |
| `test:contract --framework react --probe` | 0; 1/1 infrastructure probe passed | 11-contract-probe.log |
| `test:siheom --framework react --probe` | 0; 2/2 passed, separate smoke and focus | 16-siheom-probe.log, 16-siheom-probe-vitest.json |
| `test:stories --framework react --probe` | 0; 3/3 native stories, no policy violations, axe 0 violations | 22-stories-final-probe.log, matching report JSON |
| `exec node --test tools/tests/story-network.test.mjs` | 0; 1/1 negative guard test passed; 5 forbidden transport/request attempts blocked before external sending while local assets loaded | 24-request-policy-negative.log |
| `test:contract --framework react` | 1 expected; 9/9 missing pilots failed after native health passed | 14-contract-pilot-red.log |
| `test:siheom --framework react` | 1 expected; 9/9 missing widget assertions failed after health/protocol passed | 17-siheom-pilot-red.log |
| `workspace @krds-native/fixture-react test` | 1 expected; default suite 9 RED; final run confirms unique screenshot/attachment directory | 26-native-artifact-directory-red.log, 26-siheom-pilot-vitest.json |
| `test:stories --framework react` | 1 expected; 5 canonical story IDs missing | 15-stories-pilot-red.log |
| `workspace @krds-native/storybook-react test` | 1 expected; same 5 missing canonical stories | 23-story-default-test-red.log |
| `workspace @krds-native/fixture-react lint` | 0; workspace boundaries/pins verified | 19-workspace-lint.log |

`report-paths.json` lists the exact unique common runner report paths. Latest native siheom failure artifacts are in `test-results/t05/react-siheom-native-1793321810138-78853/`. Early failure screenshots/attachments were preserved inside this owner's log directory and removed from source folders.

The initial siheom startup attempt failed before test execution because the shared Vitest mocker could not resolve Vite (01-siheom-red.log). The controller's T01 owner repaired the shared peer graph; successful real native execution is recorded above. Early Storybook config/type errors were corrected locally (08/09 logs): the named `Error` CSF export shadowed the global error constructor, and pnpm preset resolution required an absolute integration path. Final Storybook build emits the standard >500KB chunk warning; it succeeds. No remaining React infrastructure blocker.

Probe counts are infrastructure evidence only: 1 production fixture probe, 2 siheom probes (one smoke plus one focus), 3 native stories, 1 shared negative request-policy test. They contribute zero KRDS component/catalog coverage. The 9 canonical fixture and siheom cases and 5 canonical stories remain required and RED.

## File inventory

Current maintained files in the owned app scope (excluding generated dist/node_modules):

- `apps/fixture-react/index.html`
- `apps/fixture-react/package.json`
- `apps/fixture-react/project.json`
- `apps/fixture-react/src/FixtureApp.tsx`
- `apps/fixture-react/src/NativeProbe.tsx`
- `apps/fixture-react/src/main.tsx`
- `apps/fixture-react/tests/setup.ts`
- `apps/fixture-react/tests/siheom/button.test.tsx`
- `apps/fixture-react/tests/siheom/date-input.test.tsx`
- `apps/fixture-react/tests/siheom/modal.test.tsx`
- `apps/fixture-react/tests/siheom/native-probe.test.tsx`
- `apps/fixture-react/tests/siheom/native-select.test.tsx`
- `apps/fixture-react/tests/siheom/tabs.test.tsx`
- `apps/fixture-react/tsconfig.json`
- `apps/fixture-react/vite.config.ts`
- `apps/fixture-react/vitest.config.ts`
- `apps/storybook-react/.storybook/main.ts`
- `apps/storybook-react/package.json`
- `apps/storybook-react/project.json`
- `apps/storybook-react/src/stories/native-probe.stories.tsx`
- `apps/storybook-react/tsconfig.json`

Removed obsolete scaffold files: `apps/fixture-react/playwright.config.ts`; `apps/storybook-react/index.html`, `vite.config.ts`, `playwright.config.ts`, `src/main.tsx`, `src/stories/probe.stories.ts`. Common runners own production serving/browser config; Storybook owns its native build instead of the old standalone Vite bootstrap.

Own report/log additions: `.superpowers/sdd/PLAN/task-T05-react-report.md` and `.superpowers/sdd/PLAN/t05-react-logs/` (numbered raw logs, copied common summary JSONs, native Vitest JSONs, report path index, preserved failure images).
