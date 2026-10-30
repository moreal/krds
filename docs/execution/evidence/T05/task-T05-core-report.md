# T05 common native harness execution report

Date: 2026-10-30. Owner scope is common infrastructure only. No app-owned code, root manifest/lock/Nx configuration, Git commits, publishing, pushing or tagging was changed by core. T01/controller integrates root scripts/dependencies/Nx inputs. Native owners implement their own compilers/renderers and submit native execution evidence.

## Current acceptance state

Common behavior infrastructure is implemented and validated. Public entries were built before framework owners consumed them. The frozen handoff is `task-T05-harness-interface.md`. All eight native fixture infrastructure probes have actual Chromium passing evidence. All seven required native Storybooks and all six required native siheom combinations now have recorded passing evidence. Angular final official native builder produced actual3/3 passing states. The complete actual-count/report matrix is `t05-core-logs/native-evidence-matrix.json`.

The required framework lists remain seven Storybooks and six siheom adapters. Lit and Solid2 siheom remain unsupported with native Playwright alternatives. Solid2 Storybook remains unverified. No canonical component or story coverage was awarded; `catalog/coverage.json` remains zero verified and `catalog/story-coverage.json` contains only planned canonical states. Explicit infrastructure probes cannot satisfy default canonical selections.

Firefox1555 downloaded successfully but exits before test execution with `Could not find profile folder` using both the standard macOS temporary directory and `/private/tmp`. This remains a browser environment blocker. Chromium1248 and WebKit2370 have native probe execution evidence; the installed-browser matrix never claims Firefox passed.

## Exact core files

- `packages/test-contracts/package.json`: private built root, driver, fixtures and scenarios exports; scoped behavior test command; no extra runtime renderer/test-library dependencies.
- `packages/test-contracts/src/index.ts`, `types.ts`, `story-types.ts`: required fixture/driver/state types; FrameworkId is imported from contracts.
- `packages/test-contracts/src/driver.ts`: fixture-only plain-JSON state/event bridge, subscription/unmount disposal, two-frame native update wait, structural Playwright driver and native framework check.
- `packages/test-contracts/src/fixtures/index.ts`: pure serializable canonical and explicit test-only default/loading/error states and fixed environment data.
- `packages/test-contracts/src/scenarios/index.ts`: nine required pilot scenario definitions; probes excluded.
- `packages/test-contracts/README.md`: built imports, runner/probe contracts and local request policy.
- `catalog/fixture-cases.json`: nine canonical required cases plus separate excluded infrastructure probe.
- `catalog/story-cases.json`: five canonical state records plus three separately identified probes.
- `catalog/story-coverage.json`: 35 stable canonical state mappings, planned; probe exclusion explicit.
- `tools/run-contract-tests.mjs`: real selected-framework/browser CLI, production app serving, selected Playwright invocation, unique reports, cleanup, classified native health versus missing implementation.
- `tools/run-story-tests.mjs`: real selected stable native production Storybook verification and strict request guard before iframe navigation; missing states fail.
- `tools/run-siheom-tests.mjs`: exact local native Vitest command/path selection, separate probe mode, mandatory adapter installation, nonzero executed/passed count, unique evidence and unsupported alternatives.
- `tools/testing/selection.mjs`: strict framework/browser/option parsing; all stable/required selections retain all targets.
- `tools/testing/support.mjs`: exact browser cache, static build asset enumeration, ephemeral loopback ports, traversal/symlink rejection, unique report directories, bounded selected tool execution and process-group cleanup.
- `tools/testing/network.mjs`: same-origin GET/HEAD real-build-asset allowlist; HTTP abort and WebSocket/EventSource/service-worker prevention plus violation failure.
- `tools/testing/stories.mjs`: story source policy checks; native state/role observations; disabled state, runtime error checks, font-ready deterministic screenshots, axe4.14.0 findings.
- `tools/testing/results.mjs`: nonempty execution and native-health-aware failure classification.
- `tools/testing/contract.spec.ts`: actual native fixture health/control checks before separate observable probe/pilot assertions; missing implementations fail at feature boundary; nine required pilot behaviors.
- `tools/tests/harness.test.mjs`: common selection/state/server/CLI/classification/manifest consistency behavior tests.
- `tools/tests/story-network.test.mjs`: actual Chromium deliberate forbidden fetch/WebSocket/EventSource/service-worker negative fixture; no external sending and visible fixture still fails policy.
- `playwright.config.ts`: Playwright1.64.1 Chromium/Firefox/WebKit projects, fixed viewport/locale/timezone/color/reduced motion, unique reports, failures/traces/screenshots.
- `compatibility/testing.json`: core-owned evidence aggregation, installation revisions/environment boundary and explicit test-only verification scope.
- `.superpowers/sdd/PLAN/task-T05-harness-interface.md`, this report, `t05-core-logs/*`: phased handoff and evidence.

Generated output stays ignored in `packages/test-contracts/dist` and `test-results/t05`. Browser downloads are outside global tool installation at `/private/tmp/krds-playwright-1.64.1`.

## Commands and evidence

All commands use `node tools/yarn.mjs`, selecting Node24.18.0 and Yarn4.14.1. Sandbox DNS blocked initial browser download; the exact same scoped install succeeded with approved execution. Sandbox loopback listen returns EPERM; actual local server/browser commands used approved execution. No global tools or ambient Node26 were used.

| Command | Result | Core log / exact report |
| --- | --- | --- |
| `workspace @krds-native/test-contracts build:local` | PASS built public exports | `t05-core-logs/package-build.log` |
| `workspace @krds-native/test-contracts typecheck` | PASS | `t05-core-logs/package-typecheck.log` |
| `exec node --test tools/tests/harness.test.mjs` before implementation | expected RED3 missing selection/policy/bridge | `t05-core-logs/unit-red.log` |
| Server/method/JSON/classification/scenario regression RED runs | expected feature failures before matching implementation | `server-red.log`, `hardening-red.log`, `classification-red.log`, `scenarios-red.log` |
| `test:harness` | PASS10/10 actual behavior tests, including real Chromium negative policy | `t05-core-logs/final-common.log` |
| `verify:workspace` | PASS pins/linker/boundaries/private apps | `t05-core-logs/workspace-check.log` |
| `verify:catalog` | PASS55 hashes,378stable+54preview records,0verified | `t05-core-logs/catalog-check.log` |
| `workspace @krds-native/fixture-react exec playwright install chromium firefox webkit` with `PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1` | PASS exact installed Chromium1248 / Firefox1555 / WebKit2370 | `t05-core-logs/browser-install-approved.log` |
| `test:contract --framework svelte --probe` | PASS1; actual production native renderer/state/events | `t05-core-logs/contract-probe.log`; `test-results/t05/contract-1793321737841-78231-c79ae735/report.json` |
| `test:contract --framework svelte --component button` | expected exit1; `nativeHealth:true`, `classification:missing-implementation` | `t05-core-logs/contract-pilot-red.log`; `test-results/t05/contract-1793321741550-78281-9629b45e/report.json` |
| `test:stories --framework svelte --probe` | PASS3 production native states; no forbidden requests, deterministic screenshots and axe evidence | `t05-core-logs/stories-probe.log`; `test-results/t05/stories-1793321902129-79436-ad13a18b/report.json` |
| `test:siheom --framework svelte --probe` | PASS2 native smoke and separate trusted provider focus; no empty success | `t05-core-logs/siheom-probe.log`; `test-results/t05/siheom-1793321905375-79486-7eceff9a/report.json` |

The negative policy test attempts external fetch, same-origin API fetch, WebSocket, EventSource and service-worker registration. It verifies five violations, no forbidden completed requests, allowed static fetch success, and a visible fixture that is still rejected by `assertClean`. Routes and transport guards are installed on context before the first page/iframe navigation.

Native default pilots remain intentionally RED until T06+ implements widgets. Native owner reports contain nine healthy-before-failure attachments per framework. Synthetic Testing Library input versus real provider input is explicitly recorded per siheom execution evidence; actual Korean IME, SSR/hydration/resume, Angular APF/forms and full accessibility/visual conformance are later task coverage.

## Remaining evidence and limits

- Angular official Storybook production build/native3states execution: resolved; final3/3PASS `test-results/t05/stories-1793322095524-82290-051d2368/report.json`. The request guard caught an initial empty emitted CSF chunk despite valid index entries; the native owner fixed inherited `noEmit` using the official Angular builder before recording success.
- Vue native siheom smoke+separate focus: resolved by exact server-renderer peer forwarding; final actual2/2PASS `test-results/t05/siheom-1793321960834-81478-4b00bcfc/report.json`. Required adapter retained. Angular now has3/3 native smoke/synthetic focus/trusted provider focus evidence `test-results/t05/siheom-1793321915160-80108-1f66a7ad/report.json`.
- Firefox1555 launch: blocked before tests; exact logs `.superpowers/sdd/PLAN/t05-solid-next-logs/11-probe-firefox-private-tmp.log`, report `test-results/t05/contract-1793321618332-76941-760c8a3c/report.json`.
- All canonical KRDS pilots/stories are missing by design at T05, and default commands fail nonzero. Infrastructure success is not component completion.
- Axe findings are reported; automatic audits alone are not an accessibility certification.

DONE for core interface, common runner behavior validation and actual owner evidence aggregation. Controller owns independent review and overall T05 acceptance; Firefox environment failure remains explicitly blocked, and all canonical KRDS implementation suites remain intentionally RED. No unexecuted combination is marked successful.

## Final native infrastructure matrix

| Framework | Contract probe | Native production stories | Native siheom smoke/focus |
| --- | --- | --- | --- |
| react | 1 PASS | 3 PASS | 2 PASS |
| solid | 1 PASS | 3 PASS | 2 PASS |
| svelte | 1 PASS | 3 PASS | 2 PASS |
| vue | 1 PASS | 3 PASS | 2 PASS |
| lit | 1 PASS | 3 PASS | unsupported upstream; native contract used |
| qwik | 1 PASS | 3 PASS | 2 PASS |
| angular | 1 PASS | 3 PASS | 3 PASS |
| solid-next | 1 PASS | unsupported/pending native preview | unsupported upstream; native contract used |


## Fix round1: four review findings resolved

Read full `task-T05-core-review.md` and verified the private-workspace CLI regression before changes. All changes stay within common infrastructure; native apps/widgets are untouched. T01/controller alone appended the new regression file to root `test:harness`; no dependency, lockfile or Nx changes were needed.

### Exact fix inventory

- `tools/testing/observations.mjs` (new): shared actual browser observations used by both canonical scenarios and inspection regressions. Disabled activation asserts disabled and sends real mouse input at the visible bounds, then checks no events. Modal close first proves focus inside the dialog, removes the original trigger when requested, and requires exact `다음 작업` fallback focus after Escape. Timezone invariance uses fresh healthy `Pacific/Kiritimati` and `America/Los_Angeles` contexts, the same `2024-02-29` semantic value, exact display and zero unsolicited mount/controlled-update events, with context cleanup in `finally`.
- `tools/testing/contract.spec.ts`: canonical disabled/modal/timezone cases invoke those actual common observations. Per-zone native health is attached for successful mounts. Existing missing-feature boundary remains before the actual widget observations, so intentionally missing pilots still fail after main native health.
- `tools/tests/contract-observations.test.mjs` (new): temporary plain-DOM inspection fixtures, explicitly excluded from canonical/native-adapter/KRDS coverage. Correct native disabled activation passes; an aria-disabled active handler fails. Correct semantic date passes both zones; timestamp conversion that displays the previous day in the negative-offset zone and unsolicited mount events each fail. Correct alternate-target focus passes; connected-body-only focus fails. These tests exercise browser behavior rather than inspect source text or mock helper calls.
- `tools/tests/harness.test.mjs`: CLI child path is module-relative and absolute through `fileURLToPath`, so package cwd cannot hide the real runner.
- `packages/test-contracts/package.json`: owning workspace test entry now includes the focused observation regression as well as common harness tests.
- `packages/test-contracts/src/scenarios/index.ts`, `catalog/fixture-cases.json`: exact fallback/timezone descriptions match the clarified protocol.
- `task-T05-harness-interface.md`: binding fallback labels, inside-focus prerequisite, exact independent timezone mounts and no-event state contract for T06 consumers.
- `compatibility/testing.json`: current common verification/report references only; native required lists and zero canonical coverage remain unchanged.

### Exact commands and results

All commands below use the selected `node tools/yarn.mjs` entry. Actual browser/server runs used approved execution for loopback/browser access. Logs are in `t05-core-logs/`.

| Command after launcher | Result | Log |
| --- | --- | --- |
| `workspace @krds-native/test-contracts exec node --test --test-name-pattern 'real CLI reports' ../../tools/tests/harness.test.mjs` before fix | Expected RED1 from package cwd, matching review | `fix1-workspace-cli-red.log` |
| `exec node --test tools/tests/contract-observations.test.mjs` before helpers | Expected RED3 missing browser observations | `fix1-observations-red.log` |
| `exec node --test tools/tests/contract-observations.test.mjs` after fixes | PASS3; correct and deliberately incorrect inspection outcomes | `fix1-observations-green.log` |
| `workspace @krds-native/test-contracts build:local` | PASS exit0 | `fix1-package-build.log` |
| `workspace @krds-native/test-contracts typecheck` | PASS exit0 | `fix1-package-typecheck.log` |
| `test:harness` | PASS13/13,0failed | `fix1-root-harness.log` |
| `workspace @krds-native/test-contracts test` | PASS12/12,0failed from actual package cwd | `fix1-workspace-test.log` |
| `test:contract --framework svelte --probe` | PASS1 actual production native fixture | `fix1-contract-probe.log` |
| `test:contract --framework svelte --component button` | Expected exit1; nativeHealth true, missing-implementation classification | `fix1-contract-pilot-red.log` |
| `test:stories --framework svelte --probe` | PASS3 actual production native stories, no request violations | `fix1-story-probe.log` |
| `test:siheom --framework svelte --probe` | PASS2 actual native smoke + separate provider focus | `fix1-siheom-probe.log` |

The first post-implementation inspection run found missing UTF-8 metadata in the temporary inspection HTML, causing Korean names to decode incorrectly. `fix1-inspection-encoding-error.log` preserves that failed diagnostic; the inspection HTML now declares UTF-8 and the final three browser observations pass. No native app fix or relaxed assertion was used.

### Current candidate execution evidence

These reports were generated after all common code changes in this fix round. `fix1-source-hashes.json` records the exact common candidate files. All four reports explicitly have `canonicalSelection` and `coverageAwarded:false`; none has the historical `coverage` field.

- Current contract probe: `test-results/t05/contract-1793322899548-91498-d2d6d57d/report.json`.
- Current healthy canonical RED: `test-results/t05/contract-1793322902390-91510-09bc7a49/report.json`.
- Current production story probe: `test-results/t05/stories-1793322905119-91525-dbcd4827/report.json`.
- Current native siheom probe: `test-results/t05/siheom-1793322908537-91540-370214f1/report.json` and `svelte-vitest.json`.
- Compact current report map: `t05-core-logs/fix1-current-runner-evidence.json`.

Earlier T05 execution evidence above remains unchanged and historical; it is not reattributed to the current runner bytes. This focused round does not rerun every native renderer or the broad Angular suite. Firefox's recorded environment blocker and canonical missing-widget RED remain unchanged.
