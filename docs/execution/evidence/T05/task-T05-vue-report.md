# T05 Vue native foundation report

Scope: only `apps/fixture-vue`, `apps/storybook-vue`, this report, and `t05-vue-logs/`. No KRDS widgets implemented, no catalog coverage claimed, no Git commit or publication. Shared runner/lock/peer metadata changes belong to controller/core/T01 owners.

## Implemented files

- `apps/fixture-vue/src/FixtureApp.ts`: native Vue3 setup/render state, shared built bridge subscription/disposal, explicit count probe and exact event payload, healthy missing-pilot routes. Imports the built public `@krds-native/vue` entry; no source alias/foreign renderer.
- `apps/fixture-vue/src/main.ts`: native Vue mount and pagehide unmount.
- `apps/fixture-vue/tests/setup.ts`: jest-dom matchers and native testing-library cleanup.
- `apps/fixture-vue/tests/siheom/native-probe.test.ts`: actual published siheom native render/click/controlled state/disabled/cleanup smoke and separate real Playwright provider click/focus assertion.
- `apps/fixture-vue/tests/siheom/button.test.ts`: canonical disabled button behavior, healthy bridge first, intentionally RED while actual widget is missing.
- `apps/fixture-vue/vitest.config.ts`: explicit probe versus pilot selection, nonempty required suites, native Vue compiler, Chromium browser with fixed locale/timezone/viewport/motion conditions.
- `apps/fixture-vue/package.json`, `project.json`, `tsconfig.json`: root runner targets without recursion, direct native local Vitest command, meaningful default test, Vue compiler typecheck including tests/configs, shared inputs/dependencies, exact direct server-renderer dependency.
- `apps/storybook-vue/.storybook/main.ts`: native `@storybook/vue3-vite` builder, local resolved framework path for pnpm linker, telemetry disabled.
- `apps/storybook-vue/src/stories/NativeProbe.ts`, `probe.stories.ts`: three state-only native Vue stories, shared serializable fixture inputs, built public adapter import, exact default/loading/error IDs. No play/loaders/API/auth/remote assets.
- `apps/storybook-vue/package.json`, `project.json`, `tsconfig.json`: actual static build into own `dist`, production story runner, meaningful default test, typecheck including config.
- Removed both apps' obsolete hardcoded-port `playwright.config.ts`; common production runner owns server port allocation/configuration.

## Tooling

Selected Node24.18.0/Yarn4.14.1 through `node tools/yarn.mjs`; Vue/compiler3.5.44, vue-tsc3.3.14, Vite8.3.5, Storybook/native Vue integration10.6.5, Vitest/browser-provider4.1.10, siheom Vue0.3.2/core0.4.1, Playwright1.64.1/Chromium1248, axe4.14.0. Browser cache `/private/tmp/krds-playwright-1.64.1`; no browser/install race or ambient tool replacement.

## Executed evidence

All commands run from repository root; output logs are under `.superpowers/sdd/PLAN/t05-vue-logs/`.

| Command (following `node tools/yarn.mjs`) | Result | Log/report |
| --- | --- | --- |
| `workspace @krds-native/fixture-vue build:local` before bridge | PASS bootstrap | `02-bootstrap-build.log` |
| `test:contract --framework vue --probe` before bridge | Expected RED: missing bridge protocol after route served | `04-contract-red.log`; `test-results/t05/contract-1793321470883-74589-f34631ba/report.json` |
| `workspace @krds-native/fixture-vue build:local` | PASS native production | `06-fixture-build.log` |
| `workspace @krds-native/fixture-vue typecheck` | PASS including tests/configs | `24-fixture-typecheck.log` |
| `workspace @krds-native/storybook-vue typecheck` | PASS | `22-story-typecheck.log` |
| `workspace @krds-native/storybook-vue storybook-build:local` | PASS actual native static builder, index.json/iframe.html produced | `10-story-build.log` |
| `test:contract --framework vue --probe` | PASS1 actual provider probe | `09-contract-probe.log`; `test-results/t05/contract-1793321548080-75680-dd89761e/report.json` |
| `test:contract --framework vue` | Expected RED9 missing pilots; all9 native-health.json attachments prove prior healthy routes/bridge | `12-contract-pilot-red.log`; `test-results/t05/contract-1793321573026-76085-e860d9e1/report.json` |
| `test:stories --framework vue --probe` | PASS3, local production requests allowed, no request/axe violations | `13-story-probe.log`; `test-results/t05/stories-1793321580648-76270-ac0458ff/report.json` |
| `test:stories --framework vue` | Expected RED5 canonical stories missing | `14-story-pilot-red.log`; `test-results/t05/stories-1793321614137-76848-b62c75c1/report.json` |
| `workspace @krds-native/fixture-vue lint` | PASS workspace boundaries/pins | `26-workspace-lint.log` |

Story build emits upstream docgen deprecation guidance and chunk-size warning; build succeeds. No production KRDS implementation is implied.

## siheom integration evidence and final results

Installed published source inspected: `@siheom/vue/src/given.ts` uses `@testing-library/vue.render(component)`, `src/index.ts` provides native `given`, `runSiheom`, `actions`, `assertions`, `query`; `@siheom/core/src/action.ts` defaults to synthetic `@testing-library/user-event`; `assertions.focused` calls the published focus assertion. Native smoke uses these actual APIs. Separate focus test uses real `vitest/browser` provider click and siheom focus assertion. Production Playwright contract input is real provider input.

Initial siheom startup was blocked by shared Vitest→Vite peer forwarding (`01-native-red.log`), repaired by T01. Subsequent browser run reached setup but correctly reported zero tests/nonzero because Vue Test Utils2.5.1 eagerly loads its missing optional server-renderer peer (`15-siheom-probe.log`, `17-siheom-diagnostic.log`). Exact direct `@vue/server-renderer3.5.44` added with controller approval; T01 owns the corresponding testing-library peer forwarding/lock update. T01 completed the exact optional peer forwarding, lock update and immutable installation verification. The final native runs below now execute actual tests successfully; this startup blocker is resolved.


| Final command (following `node tools/yarn.mjs`) | Result | Evidence |
| --- | --- | --- |
| `test:siheom --framework vue --probe` | PASS2: native adapter smoke and separate real provider focus | `23-siheom-probe.log`; `test-results/t05/siheom-1793321960834-81478-4b00bcfc/report.json`, `vue-vitest.json` |
| `test:siheom --framework vue` | Expected RED1 canonical disabled button absent after native health/bridge assertions | `25-siheom-pilot-red.log`; `test-results/t05/siheom-1793321974224-81578-938611ec/report.json`, `vue-vitest.json` |

Native smoke asserts initial0, synthetic click1, exactly one change event, controlled patch7/new label, next click8, disabled click leaves8/two events, unmount removes DOM/bridge and rejects late events. Separate focus test uses actual `vitest/browser.page.getByRole(...).click()` and native siheom `assertions.focused`. Both test titles/statuses are independently present in the actual Vitest JSON. The canonical failure snapshot shows Fixture health=ready and exact missing-component note before the missing `button "저장"` feature assertion. Zero KRDS coverage awarded.

Final status: required Vue native foundation implemented and verified; no unresolved Vue infrastructure blocker. Expected incomplete work remains the KRDS pilot widget implementation (all9 common scenarios,1 native siheom behavior,5 canonical stories intentionally RED). The shared core owner supplies request-policy negative-control evidence; this Vue run proves production local asset allowlisting and zero observed violations. No real external network request was needed.

Copies of final report/JSON evidence are retained in `t05-vue-logs/` alongside command outputs (`09-contract-report.json`, `12-contract-report.json`, `12-contract-playwright.json`, `13-story-report.json`, `14-story-report.json`, `23-siheom-report.json`, `23-siheom-vitest.json`, `25-siheom-report.json`, `25-siheom-vitest.json`).
