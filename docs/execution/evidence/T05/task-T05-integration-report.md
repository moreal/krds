# T05 shared infrastructure integration

Status: complete within root/config/lock ownership. No native app, common harness implementation, compatibility version choice, or compliance file was edited. Native/common owners retain those sources. No subagents, commits, publish, push or tag operations occurred.

## Exact mutations

- `package.json`: added the following four root scripts and four exact direct development dependencies, preserving all previous root fields and choices. Existing parsed-field equality was checked against `t05-integration-logs/package-before.json` after applying only these additions.

```json
{
  "scripts": {
    "test:contract": "node tools/run-contract-tests.mjs",
    "test:siheom": "node tools/run-siheom-tests.mjs",
    "test:stories": "node tools/run-story-tests.mjs",
    "test:harness": "node --test tools/tests/harness.test.mjs tools/tests/story-network.test.mjs"
  },
  "devDependencies": {
    "@playwright/test": "1.64.1",
    "playwright": "1.64.1",
    "playwright-core": "1.64.1",
    "@axe-core/playwright": "4.14.0"
  }
}
```

- `nx.json`: appended only these relevant target input paths, skipping existing entries and asserting no duplicates. The already present `contract` root Playwright config input was retained once. All target commands/dependency ordering/cache/output settings and other Nx fields remain unchanged.

```json
{
  "contract": [
    "{workspaceRoot}/packages/test-contracts/**/*"
  ],
  "siheom": [
    "{workspaceRoot}/packages/test-contracts/**/*"
  ],
  "storybook-build": [
    "{workspaceRoot}/catalog/story-coverage.json",
    "{workspaceRoot}/packages/test-contracts/**/*"
  ],
  "stories": [
    "{workspaceRoot}/catalog/story-coverage.json",
    "{workspaceRoot}/packages/test-contracts/**/*",
    "{workspaceRoot}/playwright.config.ts"
  ]
}
```

  `contract`/`siheom` now explicitly include common test-contract sources. Story build/test targets include common test-contract sources and story coverage mapping; the Playwright-based `stories` target also includes the root Playwright config. Root scripts invoke Node entry files directly, with no root Nx target cycle introduced. Harness implementation owners remain responsible for preventing recursive runner internals.

- `.yarnrc.yml`: appended **only two exact-version peer-forwarding packageExtensions** after confirming a shared real Vitest startup blocker:

```yaml
'@vitest/browser@4.1.10':
  peerDependencies:
    vite: '^6.0.0 || ^7.0.0 || ^8.0.0'
'@vitest/browser-playwright@4.1.10':
  peerDependencies:
    vite: '^6.0.0 || ^7.0.0 || ^8.0.0'
```

  Existing pnpm linker, vendored Yarn and prior narrow extensions remain intact. This adds parent peer forwarding; it neither adds a root Vite dependency nor changes any consumer Vite/runtime version or root resolution.

- `yarn.lock`: intentionally refreshed to record the root direct dependencies. All four exact browser-tool packages were already locked. The later narrow peer-forwarding install did not further change the resulting lock bytes or resolution set; it corrected the installed virtual peer contexts.
- Execution evidence/report only: `.superpowers/sdd/PLAN/task-T05-integration-report.md` and `.superpowers/sdd/PLAN/t05-integration-logs/*`.

## Commands and actual results

Every Yarn command uses `node tools/yarn.mjs`, which selects **Node 24.18.0** and vendored **Yarn 4.14.1**, prepending the selected Node directory on child PATH. No global tools/settings were modified.

| Command | Actual result | Evidence under `t05-integration-logs/` |
| --- | --- | --- |
| `node tools/yarn.mjs install` | Initial sandbox attempt exited 1: EPERM hard-linking the existing Yarn global index into the new root axe peer context | `install.log` |
| Same intentional install with filesystem approval | Exit 0, **5.830s**, no new package/version resolution; root development tree relinked | `install-approved.log` |
| `node tools/yarn.mjs install --immutable` | Exit 0, **5.488s**, resulting lock retained | `install-immutable.log` |
| `node tools/yarn.mjs node .superpowers/sdd/PLAN/t05-integration-logs/check-root-integration.mjs` | Exit 0; exact four scripts/deps and relevant Nx additions asserted against before snapshots; actual imports of all four browser-tool packages succeed from root at their selected versions | `root-integration-check.log`, final repeat `root-integration-final.log` |
| `node tools/yarn.mjs verify:workspace` | Exit 0, boundary/configuration verifier succeeds; repeated after Vitest forwarding | `verify-workspace.log`, `verify-workspace-final.log` |
| `node tools/yarn.mjs node .superpowers/sdd/PLAN/t05-integration-logs/check-vitest-forwarding.mjs` before forwarding | Exit 1; nested @vitest/mocker context cannot resolve `vite/package.json`, matching native owners' `ERR_MODULE_NOT_FOUND` startup failures | `vitest-forwarding-red.log` |
| `node tools/yarn.mjs install` after narrow forwarding, with filesystem approval | Exit 0, **5.682s**; consumer-specific virtual peer contexts relinked without changing the selected package/version set | `install-vitest-forwarding.log` |
| `node tools/yarn.mjs install --immutable` after forwarding | Exit 0; no further lock mutation | `install-immutable-vitest-forwarding.log` |
| Same focused Vitest forwarding check after relink | Exit 0; actual Svelte/Vue/Qwik Vitest configs load, both parent paths' mocker Node entry imports succeed, Vite 8/7 isolation asserted | `vitest-forwarding-green.log` |
| `node tools/yarn.mjs explain peer-requirements` before/after forwarding | Exit 0; same eight previously explained unrelated DocSearch/WASI transitive warnings, no missing Vite forwarding warnings | `peers-before-mocker.log`, `peers-after-mocker.log` |
| Exact lock SHA/resolution-set comparison | Exit 0; 1915 exact resolved identifiers unchanged; zero added/removed resolutions | `lock-before.json`, `lock-after.json`, `lock-delta-final.json`, `lock-delta-final.log` |

The focused check scripts are persisted as evidence, so their exact assertions and commands can be replayed. No absent harness tool entry was fabricated or run. No broad root, native, browser or Angular test suite was launched by this integration.

Root import output:

```text
Exact four root scripts/dependencies and Nx input additions verified; existing fields, nonrecursive node entry wiring and target settings preserved.
Root direct @playwright/test@1.64.1: /Users/moreal/github/moreal/krds/node_modules/.store/@playwright-test-npm-1.64.1-959c781428/package/index.js
Root direct playwright@1.64.1: /Users/moreal/github/moreal/krds/node_modules/.store/playwright-npm-1.64.1-cf8187a4bc/package/index.js
Root direct playwright-core@1.64.1: /Users/moreal/github/moreal/krds/node_modules/.store/playwright-core-npm-1.64.1-d944d2b0cc/package/index.js
Root direct @axe-core/playwright@4.14.0: /Users/moreal/github/moreal/krds/node_modules/.store/@axe-core-playwright-virtual-814e471410/package/dist/index.js
All four real root imports loaded under Node 24.18.0; no browsers or not-yet-created harness scripts were launched.
```

Final workspace verifier output:

```text
Workspace verified: selected pins, pnpm linker, private apps, package metadata, dependency/import boundaries.
```

## Verified Vitest startup root cause and fix

Native owners supplied matching Svelte/Vue config-load failures in `t05-svelte-logs/01-native-red.log` and `t05-vue-logs/01-native-red.log`. The selected installed published metadata was captured in `vitest-published-metadata.log`:

- `@vitest/mocker@4.1.10` already declares optional Vite peer `^6.0.0 || ^7.0.0 || ^8.0.0`; its **Node** entry contains the unconditional real import `import { createFilter } from 'vite';`.
- Both `@vitest/browser@4.1.10` and `@vitest/browser-playwright@4.1.10` depend directly on that mocker but omit Vite from their own peer declarations. Under Yarn's pnpm linker their nested mocker therefore receives no Vite. Declaring Vite only in the fixture cannot skip this missing intermediate forwarding edge.
- The fix forwards each existing consumer's own Vite through those two exact-version parents, using exactly the mocker's published supported range. The mocker's existing optional peer metadata was not altered and no package/runtime version was forced.

Post-fix proof imports the actual nested `@vitest/mocker/node` from **both** parent contexts, verifies the nested resolved Vite version, then uses that fixture's real `vite.loadConfigFromFile` on its actual `vitest.config.ts`. It does not create a Vite server or launch browsers/tests. Actual output:

```text
svelte: direct Vite 8.3.5
  @vitest/browser-playwright@4.1.10 -> @vitest/mocker/node -> Vite 8.3.5: imported
  @vitest/browser@4.1.10 -> @vitest/mocker/node -> Vite 8.3.5: imported
  Actual svelte Vitest configuration loaded successfully; no browser/test suite launched.
vue: direct Vite 8.3.5
  @vitest/browser-playwright@4.1.10 -> @vitest/mocker/node -> Vite 8.3.5: imported
  @vitest/browser@4.1.10 -> @vitest/mocker/node -> Vite 8.3.5: imported
  Actual vue Vitest configuration loaded successfully; no browser/test suite launched.
qwik: direct Vite 7.3.1
  @vitest/browser-playwright@4.1.10 -> @vitest/mocker/node -> Vite 7.3.1: imported
  @vitest/browser@4.1.10 -> @vitest/mocker/node -> Vite 7.3.1: imported
  Actual qwik Vitest configuration loaded successfully; no browser/test suite launched.
```

Svelte/Vue retain **Vite 8.3.5** and Qwik retains **Vite 7.3.1** throughout. This resolves the identified shared loader failure; native render/interactions remain each owner's independent smoke checks. The controller was notified that native owners can retry those checks.

## Initial T05 lock fingerprint (superseded by the scoped fixes below)

```json
{
  "oldLockSha256": "3e5cd9db6ab945332185dac797415a87e7a4426b8c873b3e8558612be56e7e0b",
  "newLockSha256": "8b4571294b9f29492db6c6d3797b4af78dba719246ab1b1f0e258c78a3b34940",
  "oldResolutionCount": 1915,
  "newResolutionCount": 1915,
  "oldResolutionSetSha256": "a4567b92b66cd95a3e38b7cbe1cbcebe1ec6c2d1c166f0549478d2e68d85141c",
  "newResolutionSetSha256": "a4567b92b66cd95a3e38b7cbe1cbcebe1ec6c2d1c166f0549478d2e68d85141c",
  "addedResolutions": [],
  "removedResolutions": []
}
```

Resolution-set digest is SHA256 over sorted unique literal Yarn `resolution:` field values, joined with LF and one final LF. Full before/after lists are retained. The intermediate root-only lock snapshot is `lock-after-root-deps.json`; the final narrow forwarding fix did not change its lock SHA. No resolved package version was added, removed or widened.

**Compliance was deliberately untouched.** The controller received these exact hashes and unchanged-set result so the T03 owner can refresh its stale inventory/fingerprint after integration. Existing release/identity and unverified native behavior limitations remain in force.

## Final common-suite wiring extension

At the core owner's request, extended only the `test:harness` root script to:

```text
node --test tools/tests/harness.test.mjs tools/tests/story-network.test.mjs
```

Updated the exact mutation evidence and the script listing above accordingly. Replayed `node tools/yarn.mjs node .superpowers/sdd/PLAN/t05-integration-logs/check-root-integration.mjs`: exit 0; all exact root/config mutation and direct-import checks still pass. An explicit Node 24.18.0 JSON/SHA assertion verified the precise two-file script and unchanged lock SHA; output is in `t05-integration-logs/harness-script-wiring.log`:

```text
Harness root script includes both requested test files; no suite launched.
Lock SHA256 unchanged: 8b4571294b9f29492db6c6d3797b4af78dba719246ab1b1f0e258c78a3b34940
```

This was wiring only. The core owner retains the reported common-suite/transport proof; integration did not rerun or claim those suites. No dependencies, Nx configuration, lock bytes or compliance files changed in this final extension.


## Scoped follow-up — Vue renderer and Angular Storybook resolver forwarding

Status: both additional shared peer-layout failures reproduced and fixed. This section supersedes earlier final-lock handoff values. No app/native source or compliance file was edited by integration; the Vue owner separately added its fixture's direct `@vue/server-renderer: 3.5.44` before this install.

### Exact cause and narrow metadata corrections

1. The installed selected `@vue/test-utils@2.5.1` manifest actually spells its optional renderer peer **`3.x`** (semver-equivalent stable major to the requested `^3.0.0`). Its CJS entry eagerly executes `var serverRenderer = require('@vue/server-renderer');`. `@testing-library/vue@8.1.0` depends on the test-utils package but does not forward this optional peer. Added **only** `@vue/server-renderer: '3.x'` plus `peerDependenciesMeta.optional: true` to the existing exact `@testing-library/vue@8.1.0` extension. Existing compiler-dom forwarding remains unchanged; the fixture's selected Vue/runtime/renderer version remains **3.5.44**.

2. Actual selected `@storybook/angular@10.6.5` `dist/server/framework-preset-angular-cli.js` has exactly two relevant no-parent shared resolver calls: `resolvePackageDir('@angular-devkit/build-angular')` at line315 and `resolvePackageDir('@angular/animations')` at line338. Its helper comes from `storybook/internal/common`, whose `resolvePackageDir` fallback anchors `createRequire(parent ?? import.meta.url)` inside the shared Storybook virtual store. The Angular app already declares these packages, but its declaration alone cannot make them reachable from that helper's package context. Added **only those two optional peers** to the existing exact `storybook@10.6.5` extension, with each range copied literally from `@storybook/angular`'s actual published peer metadata: **`>=18.0.0 < 23.0.0`**. Both are marked optional at the framework-neutral Storybook layer; unrelated frameworks are not required to install Angular. No generic Angular dependency bundle, root framework version, resolution override, or native config workaround was added.

Selected installed published peer metadata, paths and the actual eager import are captured in `t05-integration-logs/vue-angular-published-metadata.log`. Focused reproduction uses the real nested package contexts and the exact same no-parent Storybook helper call as the Angular preset, rather than a root-level resolution shortcut.

### Covering commands and results

- `node tools/yarn.mjs node .superpowers/sdd/PLAN/t05-integration-logs/check-vue-angular-forwarding.mjs` before correction: **exit 1**, both failures reproduced. Vue cannot resolve server-renderer from test-utils' actual CJS directory; Angular's shared Storybook helper cannot resolve build-angular, despite the app-level package being present. Evidence: `vue-angular-forwarding-red.log`.
- `node tools/yarn.mjs install` with the existing global-store hard-link approval: **exit 0**, **5.550s**. Evidence: `install-vue-angular-forwarding.log`.
- `node tools/yarn.mjs install --immutable`: **exit 0**, **5.286s**. Evidence: `install-immutable-vue-angular.log`.
- Same focused check after relink: **exit 0**. It imports actual test-utils CJS and Testing Library Vue, verifies the nested renderer's exact version, and calls the real Storybook common resolver from @storybook/angular's own Storybook peer context for both identified names. Evidence: `vue-angular-forwarding-green.log` and the persisted `check-vue-angular-forwarding.mjs`.
- `node tools/yarn.mjs verify:workspace`: **exit 0**. Evidence: `verify-workspace-vue-angular.log`.
- Exact lock/resolution comparison: **exit 0**, same1915 exact resolved identifiers, zero additions/removals. Evidence: `lock-before-vue-angular.json`, `lock-delta-vue-angular.json`, `lock-delta-vue-angular.log`, and latest `lock-after.json` / `lock-delta-final.json`.

Actual GREEN import/resolver output:

```text
Vue: real nested @vue/test-utils CJS and @testing-library/vue imports passed with server-renderer 3.5.44.
Angular: actual Storybook resolvePackageDir('@angular-devkit/build-angular') -> 22.2.5, from /Users/moreal/github/moreal/krds/node_modules/.store/storybook-virtual-32655f9112/package/dist/common/index.js.
Angular: actual Storybook resolvePackageDir('@angular/animations') -> 22.2.4, from /Users/moreal/github/moreal/krds/node_modules/.store/storybook-virtual-32655f9112/package/dist/common/index.js.
No browser, Storybook build, native suite, or component implementation was executed.
```

Actual workspace verifier output:

```text
Workspace verified: selected pins, pnpm linker, private apps, package metadata, dependency/import boundaries.
```

No browser, Storybook build, native suite, common implementation or component source was executed or modified by these focused checks. Native Vue/Angular owners were informed that their original shared resolution failures are fixed and can retry their own checks. This proof does not claim native rendering or full static build completion.

### Latest final lock fingerprint — use this for T03 inventory refresh

Scoped follow-up transition:

```json
{
  "oldLockSha256": "8b4571294b9f29492db6c6d3797b4af78dba719246ab1b1f0e258c78a3b34940",
  "newLockSha256": "136bebc1c213d0bc274b905ee291fa096beefa4dbbaece6ecf915689adadf4f4",
  "oldResolutionCount": 1915,
  "newResolutionCount": 1915,
  "oldResolutionSetSha256": "a4567b92b66cd95a3e38b7cbe1cbcebe1ec6c2d1c166f0549478d2e68d85141c",
  "newResolutionSetSha256": "a4567b92b66cd95a3e38b7cbe1cbcebe1ec6c2d1c166f0549478d2e68d85141c",
  "addedResolutions": [],
  "removedResolutions": []
}
```

Complete T05 transition from its original pre-integration lock:

```json
{
  "oldLockSha256": "3e5cd9db6ab945332185dac797415a87e7a4426b8c873b3e8558612be56e7e0b",
  "newLockSha256": "136bebc1c213d0bc274b905ee291fa096beefa4dbbaece6ecf915689adadf4f4",
  "oldResolutionCount": 1915,
  "newResolutionCount": 1915,
  "oldResolutionSetSha256": "a4567b92b66cd95a3e38b7cbe1cbcebe1ec6c2d1c166f0549478d2e68d85141c",
  "newResolutionSetSha256": "a4567b92b66cd95a3e38b7cbe1cbcebe1ec6c2d1c166f0549478d2e68d85141c",
  "addedResolutions": [],
  "removedResolutions": []
}
```

**Latest lock SHA256: `136bebc1c213d0bc274b905ee291fa096beefa4dbbaece6ecf915689adadf4f4`.** The resolution-set digest remains `a4567b92b66cd95a3e38b7cbe1cbcebe1ec6c2d1c166f0549478d2e68d85141c` over1915 sorted unique literal `resolution:` values, with no added/removed package identifiers. The new lock bytes include the Vue owner's newly declared renderer edge; existing versions remain unchanged.

The controller received these latest exact values for the T03 owner's subsequent inventory refresh. Compliance remained untouched. No subagent, Git commit, publishing operation, generic dependency expansion or broad suite was introduced.

## Review fix 1 — core observation regression wiring

Appended only `tools/tests/contract-observations.test.mjs` to the root `test:harness` script, retaining both existing test paths:

```text
node --test tools/tests/harness.test.mjs tools/tests/story-network.test.mjs tools/tests/contract-observations.test.mjs
```

The core owner retains the new test implementation and its execution. Integration did not require the file to exist, fabricate it, or run a suite. No dependency, lockfile, native/private-workspace script, or other source file was changed.

Validation: selected Node 24.18.0 parsed root `package.json` and asserted the exact three-file command:

```sh
/Users/moreal/.local/share/mise/installs/node/24.18.0/bin/node --input-type=module <<'JS'
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
assert.equal(pkg.scripts['test:harness'], 'node --test tools/tests/harness.test.mjs tools/tests/story-network.test.mjs tools/tests/contract-observations.test.mjs');
console.log('Root JSON parses; test:harness retains both existing files and appends contract-observations.test.mjs. No suite launched.');
JS
```

Actual result: exit 0, with exactly the printed confirmation above. No install, suite, subagent or commit operation occurred.
