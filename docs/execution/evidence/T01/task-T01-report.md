# T01 handoff — complete within bootstrap scope

Status: required workspace scope implemented and locally verified; changes remain uncommitted. No publish, push or tag occurred. T00 interfaces and upstream/provenance files were read, not changed. Catalog support remains unimplemented. All runtime/package/app entries and stories are explicitly T01 compiler probes, and contribute **zero catalog coverage**.

## Invocation for successor tasks

From `/Users/moreal/github/moreal/krds`, use `node tools/yarn.mjs <Yarn arguments>`. The wrapper selects `/Users/moreal/.local/share/mise/installs/node/24.18.0/bin/node` when the invoking Node differs, and prepends that binary directory to child PATH. It executes `.yarn/releases/yarn-4.14.1.cjs`, bypassing the ambient Node 26 and preexisting global Corepack 0.35.0. Exact direct identity: Node **24.18.0**, Yarn **4.14.1**, workspace-local Corepack **0.36.0** (`node tools/yarn.mjs exec corepack --version`). Nx project commands call the same wrapper. No global configuration or shims changed.

Contracts is prepared for T02: `node tools/yarn.mjs nx run krds-contracts:build`, `:typecheck`, `:test` use tsc 6.0.2 and Vitest 4.1.10. Its current single test is labeled bootstrap-only and may be replaced by semantic tests. T03 can run Node tests directly with the explicit Node binary or `node tools/yarn.mjs node --test tools/<test>.test.mjs`; no additional root test dependencies are needed. The controller retains root manifest/lockfile integration ownership.

## Evidence: commands and actual results

All paths below are under `.superpowers/sdd/PLAN/t01-logs/`. Commands are recorded as invoked; the wrapper makes the execution versions explicit.

| Command | Actual result | Evidence |
| --- | --- | --- |
| `node tools/yarn.mjs install` (initial clean tree) | Sandbox DNS ENOTFOUND; retry with network permission succeeded, 1575 downloaded packages / 857.86 MiB, 45.208s; initial workspace peer warnings inspected and fixed | `install-initial.log`, `install-network.log` |
| `node tools/yarn.mjs install` after direct peer/extension fixes | Exit 0, 5.729s; only dependency-level peer warnings remain | `install-peers.log` |
| `node tools/yarn.mjs install --immutable` | Exit 0, no lockfile changes; selected pnpm linker retained | `install-immutable.log`, `install-immutable-final.log` |
| `node tools/yarn.mjs config get nodeLinker` | `pnpm` | `linker.log` |
| `node tools/yarn.mjs node --version`, `--version`, `exec corepack --version` | `v24.18.0`, `4.14.1`, `0.36.0` | `node-version.log`, `yarn-version.log`, `corepack-version.log` |
| `node tools/yarn.mjs verify:workspace` | Exit 0; selected pins, pnpm linker, private apps, metadata and dependency/import boundaries verified | `verify-workspace-final.log` |
| `node tools/yarn.mjs test:workspace` | Final 11 tests passed, 0 failed; negative linker/lock/public-app/resolution/tag/relative/multiline/foreign-renderer/import cases | `verifier-complete.log`; first expected missing-verifier RED in `verifier-red.log` |
| `node tools/yarn.mjs nx show projects` | Exit 0; 32 real projects (14 packages, 8 fixtures, 8 Storybooks, docs, tools) | `nx-projects-final.log` |
| `node tools/yarn.mjs nx graph --file=.superpowers/sdd/PLAN/t01-logs/project-graph.json` | Exit 0; real 32-node graph with manifest and implicit CSS/docs/fixture edges | `nx-graph.log`, `project-graph.json` |
| `node tools/yarn.mjs explain peer-requirements` and each remaining hash | Exit 0; eight remaining transitive warnings individually explained below | `peers-final.log`, `peer-details.log` |
| `node tools/yarn.mjs nx run-many -t build,typecheck --projects=krds-contracts,krds-tokens,krds-styles,krds-assets,krds-fonts,krds-react,krds-solid,krds-svelte,krds-vue,krds-lit,krds-qwik,krds-angular,krds-solid-next,krds-test-contracts --parallel=3 --output-style=static` | Exit 0; all 28 build/typecheck tasks for 14 packages passed, 7 read valid cache outputs | `build-typecheck-packages.log` |
| `NG_BUILD_MAX_WORKERS=2 node tools/yarn.mjs nx run-many -t typecheck,test,lint --parallel=3 --output-style=static` (outside sandbox) | Exit 0; all 32 projects plus 20 dependency tasks passed, 116 tasks, **0 cache hits**, 30.7s | `workspace-checks-complete.log` |
| `node tools/yarn.mjs nx run krds-workspace:build --output-style=static` | Exit 0; builds verified `tools/dist/workspace-summary.json` | `build-tools.log` |
| Emitted native artifact assertions | Angular partial `ɵɵngDeclareComponent` + FESM2022/DTS; Qwik `.qwik.mjs`/`.qwik.cjs` + DTS; distinct Solid1 `solid-js/web` and Solid2 `@solidjs/web` renderer imports | `native-artifacts.log` |

The original Qwik build correctly failed because the selected optimizer chooses its library target from `--mode lib`; corrected script uses that mode. Initial Nx nested bare Yarn failed trying to prepare the global Corepack cache; targets now use the explicit wrapper. These failure records remain in `build-packages.log` and `build-contracts-initial.log` rather than being hidden.

The Angular fixture application builder exited **129** at startup inside the sandbox (`build-angular-fixture.log`, also `workspace-checks.log`). The identical bounded-worker command passed outside the sandbox: application bundle generated in **2.245s**, 795.29 kB initial bundle (`build-angular-fixture-network.log`). The full outside-sandbox Nx check above also passed. The fixture is a compiler probe, so no bundle-size/behavior claim is made. Other fixture builds ran as docs dependency tasks during that complete Nx check; static Storybook builds and docs publication were not added to this task's completion claim.

## Configuration and scope decisions

- Root Yarn 4.14.1 is vendored from the preinstalled exact distribution; `.yarnrc.yml` uses **pnpm**, the sole canonical lockfile is `yarn.lock`. No root resolutions. Root Nx and @nx/js are both 24.0.2. Registry fetches and linking are Yarn operations, never pnpm commands.
- Each adapter declares selected runtime peers plus exact development runtime/compiler/tooling. Qwik directly resolves Vite 7.3.1; other native workspaces resolve Vite 8.3.5. Solid2 uses exact rc.19 runtime/renderer/compiler and the official @solidjs/vite-plugin next.53. Direct-resolution tests passed in all consuming symlink environments despite Yarn's informational warning about differing workspace peers.
- Shared → shared, adapter → shared, test → shared, and app → library directions are represented by mandatory Nx tags and checked across direct dependencies, implicit edges, and source imports. Docs links all fixture outputs via explicit graph edges. Lint targets run this actual policy checker; they do not claim stylistic lint coverage.
- Angular uses its selected official CLI / ng-packagr compatibility library builder, partial APF, own dist. Angular warns that `@angular-devkit/build-angular:ng-packagr` is deprecated in favor of `@angular/build:ng-packagr`; T00 explicitly selected the former. ng-packagr emits an expected source-workspace export-path override warning and produces output-relative APF exports. Full distribution packing validation belongs to later tasks.
- All 32 projects have executable build/typecheck/test/lint targets. Fixtures have actual Playwright `contract` runners; the six supported siheom fixtures have actual Vitest browser runners. Empty behavioral suites fail normally. Lit and Solid2 do not falsely advertise upstream siheom support. Storybooks have actual native tool build targets and Playwright story runners. Their behavioral/static/browser completion remains later work.
- Storybook Solid2 has a local `vite-plugin-solid` npm alias to **the selected official** @solidjs/vite-plugin next.53 because the community integration names that peer. The official package is also declared directly; no root alias/resolution exists. Static integration/native renderer behavior remains unverified. Svelte fixture apps are native Vite/Svelte probes, not evidence of the later SvelteKit production-consumer requirement. Qwik SSR/resume/first interaction and Angular forms/CVA are unverified.
- No copyrighted upstream assets/font payloads were added. Local `LICENSE.md` status files deliberately do not fabricate an MIT copyright holder or grant. Scope/repository ownership remain unconfirmed in the unchanged identity interface. Package publishing is blocked. A local `private: false` library denotes intended workspace/public package shape, not release authorization.

## Peer corrections and remaining warnings

`.yarnrc.yml` uses narrowly versioned **peer-forwarding packageExtensions**, not runtime version overrides: @nx/js→nx, Angular build-angular→compiler, Storybook Vue→vue, Storybook web-components→lit, Testing Library Vue→compiler-dom, Qwik community Storybook→storybook/typescript/vite, Storybook manager→react. Each consuming workspace supplies the corresponding exact selected versions. Playwright consumers directly supply playwright-core 1.64.1 required by axe. React dependencies in non-React Storybook workspaces are for the manager UI, not native preview wrapping. These direct workspace warnings were removed.

Eight remaining dependency-level warnings have concrete unused-path explanations, and are **not asserted satisfied**:

| Hash | Published mismatch | Why deferred in T01 |
| --- | --- | --- |
| p88ede4 | autocomplete-core lacks @algolia/client-search for autocomplete-shared (`>=4.9.1 <6`) | VitePress optional DocSearch/Algolia feature is not configured or used |
| pae8a39 | autocomplete-core lacks algoliasearch (`>=4.9.1 <6`) | Same unused search path |
| p1ef116 | autocomplete-core lacks search-insights (`>=1 <3`) | Same unused search analytics path |
| p53213c | autocomplete-plugin-algolia-insights lacks @algolia/client-search (`>=4.9.1 <6`) | Same unused search path |
| pdf6714 | autocomplete-plugin-algolia-insights lacks algoliasearch (`>=4.9.1 <6`) | Same unused search path |
| p475665 | @docsearch/react 3.8.2 lacks @algolia/client-search for autocomplete-preset-algolia/shared (`>=4.9.1 <6`) | Same unused search path; revisit before enabling Algolia |
| p87e785 | optional oxc-parser WASI binding supplies @emnapi/core 2.0.0-alpha.3; runtime requests `^1.7.1 || 2.0.0-beta.2` | Installed macOS ARM64 native binding executes successfully; WASI fallback-platform support not verified |
| p85c163 | same mismatch for @emnapi/runtime | Same optional platform fallback |

The environment disables third-party dependency build scripts; installer logs name eight such packages. No global policy was changed. Installed platform binaries executed the Nx/framework builds successfully. Browser downloads/tests, independent tarball installs, full native components/stories, SSR/resume/forms contracts, asset rights and publishing gates remain explicitly outside this bootstrap claim.

## Exact created/modified file inventory

No preexisting T00 files were modified. All files below were created by T01. A machine-readable exact inventory is `t01-logs/files-created.json`.

- **Vendored third-party executable:** `.yarn/releases/yarn-4.14.1.cjs` (exact preinstalled Yarn 4.14.1 distribution, no local edits).
- **Machine-generated tracked dependency artifact:** `yarn.lock` (Yarn-generated, reviewed through install/peer/identity evidence).
- **Authored scaffold/configuration/probe sources:** every other path listed below (initially emitted with a temporary scaffolding helper, then edited/reviewed; the temporary helper is not a repository artifact).
- **Generated ignored state/output:** `.yarn/cache/`, `.yarn/install-state.gz`, root/workspace `node_modules/` symlinks and root `.store`, `.nx/cache/`, `.nx/workspace-data/`, package/app `dist/`, Angular `.angular/`, any framework `.vite/` caches. None is a source/coverage/license artifact.
- **Execution evidence only:** this report and every log/graph/inventory under `.superpowers/sdd/PLAN/t01-logs/`; the controller's existing `.superpowers` ignore rules retain these as local task artifacts.

- `.gitignore`
- `.node-version`
- `.yarn/releases/yarn-4.14.1.cjs`
- `.yarnrc.yml`
- `AGENTS.md`
- `apps/docs/index.md`
- `apps/docs/package.json`
- `apps/docs/project.json`
- `apps/docs/src/index.ts`
- `apps/docs/tsconfig.json`
- `apps/fixture-angular/angular.json`
- `apps/fixture-angular/index.html`
- `apps/fixture-angular/package.json`
- `apps/fixture-angular/playwright.config.ts`
- `apps/fixture-angular/project.json`
- `apps/fixture-angular/src/main.ts`
- `apps/fixture-angular/tsconfig.json`
- `apps/fixture-angular/vitest.config.ts`
- `apps/fixture-lit/index.html`
- `apps/fixture-lit/package.json`
- `apps/fixture-lit/playwright.config.ts`
- `apps/fixture-lit/project.json`
- `apps/fixture-lit/src/main.ts`
- `apps/fixture-lit/tsconfig.json`
- `apps/fixture-lit/vite.config.ts`
- `apps/fixture-qwik/index.html`
- `apps/fixture-qwik/package.json`
- `apps/fixture-qwik/playwright.config.ts`
- `apps/fixture-qwik/project.json`
- `apps/fixture-qwik/src/entry.dev.tsx`
- `apps/fixture-qwik/src/entry.ssr.tsx`
- `apps/fixture-qwik/src/main.tsx`
- `apps/fixture-qwik/src/root.tsx`
- `apps/fixture-qwik/tsconfig.json`
- `apps/fixture-qwik/vite.config.ts`
- `apps/fixture-qwik/vitest.config.ts`
- `apps/fixture-react/index.html`
- `apps/fixture-react/package.json`
- `apps/fixture-react/playwright.config.ts`
- `apps/fixture-react/project.json`
- `apps/fixture-react/src/main.tsx`
- `apps/fixture-react/tsconfig.json`
- `apps/fixture-react/vite.config.ts`
- `apps/fixture-react/vitest.config.ts`
- `apps/fixture-solid-next/index.html`
- `apps/fixture-solid-next/package.json`
- `apps/fixture-solid-next/playwright.config.ts`
- `apps/fixture-solid-next/project.json`
- `apps/fixture-solid-next/src/main.tsx`
- `apps/fixture-solid-next/tsconfig.json`
- `apps/fixture-solid-next/vite.config.ts`
- `apps/fixture-solid/index.html`
- `apps/fixture-solid/package.json`
- `apps/fixture-solid/playwright.config.ts`
- `apps/fixture-solid/project.json`
- `apps/fixture-solid/src/main.tsx`
- `apps/fixture-solid/tsconfig.json`
- `apps/fixture-solid/vite.config.ts`
- `apps/fixture-solid/vitest.config.ts`
- `apps/fixture-svelte/index.html`
- `apps/fixture-svelte/package.json`
- `apps/fixture-svelte/playwright.config.ts`
- `apps/fixture-svelte/project.json`
- `apps/fixture-svelte/src/App.svelte`
- `apps/fixture-svelte/src/main.ts`
- `apps/fixture-svelte/svelte.config.js`
- `apps/fixture-svelte/tsconfig.json`
- `apps/fixture-svelte/vite.config.ts`
- `apps/fixture-svelte/vitest.config.ts`
- `apps/fixture-vue/index.html`
- `apps/fixture-vue/package.json`
- `apps/fixture-vue/playwright.config.ts`
- `apps/fixture-vue/project.json`
- `apps/fixture-vue/src/main.ts`
- `apps/fixture-vue/tsconfig.json`
- `apps/fixture-vue/vite.config.ts`
- `apps/fixture-vue/vitest.config.ts`
- `apps/storybook-angular/.storybook/main.ts`
- `apps/storybook-angular/angular.json`
- `apps/storybook-angular/index.html`
- `apps/storybook-angular/package.json`
- `apps/storybook-angular/playwright.config.ts`
- `apps/storybook-angular/project.json`
- `apps/storybook-angular/src/main.ts`
- `apps/storybook-angular/src/stories/probe.stories.ts`
- `apps/storybook-angular/tsconfig.json`
- `apps/storybook-lit/.storybook/main.ts`
- `apps/storybook-lit/index.html`
- `apps/storybook-lit/package.json`
- `apps/storybook-lit/playwright.config.ts`
- `apps/storybook-lit/project.json`
- `apps/storybook-lit/src/main.ts`
- `apps/storybook-lit/src/stories/probe.stories.ts`
- `apps/storybook-lit/tsconfig.json`
- `apps/storybook-lit/vite.config.ts`
- `apps/storybook-qwik/.storybook/main.ts`
- `apps/storybook-qwik/index.html`
- `apps/storybook-qwik/package.json`
- `apps/storybook-qwik/playwright.config.ts`
- `apps/storybook-qwik/project.json`
- `apps/storybook-qwik/src/entry.dev.tsx`
- `apps/storybook-qwik/src/entry.ssr.tsx`
- `apps/storybook-qwik/src/main.tsx`
- `apps/storybook-qwik/src/root.tsx`
- `apps/storybook-qwik/src/stories/probe.stories.tsx`
- `apps/storybook-qwik/tsconfig.json`
- `apps/storybook-qwik/vite.config.ts`
- `apps/storybook-react/.storybook/main.ts`
- `apps/storybook-react/index.html`
- `apps/storybook-react/package.json`
- `apps/storybook-react/playwright.config.ts`
- `apps/storybook-react/project.json`
- `apps/storybook-react/src/main.tsx`
- `apps/storybook-react/src/stories/probe.stories.ts`
- `apps/storybook-react/tsconfig.json`
- `apps/storybook-react/vite.config.ts`
- `apps/storybook-solid-next/.storybook/main.ts`
- `apps/storybook-solid-next/index.html`
- `apps/storybook-solid-next/package.json`
- `apps/storybook-solid-next/playwright.config.ts`
- `apps/storybook-solid-next/project.json`
- `apps/storybook-solid-next/src/main.tsx`
- `apps/storybook-solid-next/src/stories/probe.stories.ts`
- `apps/storybook-solid-next/tsconfig.json`
- `apps/storybook-solid-next/vite.config.ts`
- `apps/storybook-solid/.storybook/main.ts`
- `apps/storybook-solid/index.html`
- `apps/storybook-solid/package.json`
- `apps/storybook-solid/playwright.config.ts`
- `apps/storybook-solid/project.json`
- `apps/storybook-solid/src/main.tsx`
- `apps/storybook-solid/src/stories/probe.stories.ts`
- `apps/storybook-solid/tsconfig.json`
- `apps/storybook-solid/vite.config.ts`
- `apps/storybook-svelte/.storybook/main.ts`
- `apps/storybook-svelte/index.html`
- `apps/storybook-svelte/package.json`
- `apps/storybook-svelte/playwright.config.ts`
- `apps/storybook-svelte/project.json`
- `apps/storybook-svelte/src/App.svelte`
- `apps/storybook-svelte/src/main.ts`
- `apps/storybook-svelte/src/stories/probe.stories.ts`
- `apps/storybook-svelte/svelte.config.js`
- `apps/storybook-svelte/tsconfig.json`
- `apps/storybook-svelte/vite.config.ts`
- `apps/storybook-vue/.storybook/main.ts`
- `apps/storybook-vue/index.html`
- `apps/storybook-vue/package.json`
- `apps/storybook-vue/playwright.config.ts`
- `apps/storybook-vue/project.json`
- `apps/storybook-vue/src/main.ts`
- `apps/storybook-vue/src/stories/probe.stories.ts`
- `apps/storybook-vue/tsconfig.json`
- `apps/storybook-vue/vite.config.ts`
- `nx.json`
- `package.json`
- `packages/angular/LICENSE.md`
- `packages/angular/README.md`
- `packages/angular/angular.json`
- `packages/angular/ng-package.json`
- `packages/angular/package.json`
- `packages/angular/project.json`
- `packages/angular/src/index.ts`
- `packages/angular/tsconfig.json`
- `packages/angular/tsconfig.lib.json`
- `packages/angular/tsconfig.lib.prod.json`
- `packages/assets/LICENSE.md`
- `packages/assets/README.md`
- `packages/assets/package.json`
- `packages/assets/project.json`
- `packages/assets/src/index.ts`
- `packages/assets/tsconfig.json`
- `packages/contracts/LICENSE.md`
- `packages/contracts/README.md`
- `packages/contracts/package.json`
- `packages/contracts/project.json`
- `packages/contracts/src/index.ts`
- `packages/contracts/tests/workspace-probe.test.ts`
- `packages/contracts/tsconfig.json`
- `packages/fonts/LICENSE.md`
- `packages/fonts/README.md`
- `packages/fonts/package.json`
- `packages/fonts/project.json`
- `packages/fonts/src/index.ts`
- `packages/fonts/tsconfig.json`
- `packages/lit/LICENSE.md`
- `packages/lit/README.md`
- `packages/lit/package.json`
- `packages/lit/project.json`
- `packages/lit/src/index.ts`
- `packages/lit/tsconfig.json`
- `packages/lit/vite.config.ts`
- `packages/qwik/LICENSE.md`
- `packages/qwik/README.md`
- `packages/qwik/package.json`
- `packages/qwik/project.json`
- `packages/qwik/src/WorkspaceProbe.tsx`
- `packages/qwik/src/index.ts`
- `packages/qwik/tsconfig.json`
- `packages/qwik/vite.config.ts`
- `packages/react/LICENSE.md`
- `packages/react/README.md`
- `packages/react/package.json`
- `packages/react/project.json`
- `packages/react/src/WorkspaceProbe.tsx`
- `packages/react/src/index.ts`
- `packages/react/tsconfig.json`
- `packages/react/vite.config.ts`
- `packages/solid-next/LICENSE.md`
- `packages/solid-next/README.md`
- `packages/solid-next/package.json`
- `packages/solid-next/project.json`
- `packages/solid-next/src/WorkspaceProbe.tsx`
- `packages/solid-next/src/index.ts`
- `packages/solid-next/tsconfig.json`
- `packages/solid-next/vite.config.ts`
- `packages/solid/LICENSE.md`
- `packages/solid/README.md`
- `packages/solid/package.json`
- `packages/solid/project.json`
- `packages/solid/src/WorkspaceProbe.tsx`
- `packages/solid/src/index.ts`
- `packages/solid/tsconfig.json`
- `packages/solid/vite.config.ts`
- `packages/styles/LICENSE.md`
- `packages/styles/README.md`
- `packages/styles/package.json`
- `packages/styles/project.json`
- `packages/styles/src/index.ts`
- `packages/styles/tsconfig.json`
- `packages/svelte/LICENSE.md`
- `packages/svelte/README.md`
- `packages/svelte/package.json`
- `packages/svelte/project.json`
- `packages/svelte/src/lib/WorkspaceProbe.svelte`
- `packages/svelte/src/lib/index.ts`
- `packages/svelte/svelte.config.js`
- `packages/svelte/tsconfig.json`
- `packages/test-contracts/package.json`
- `packages/test-contracts/project.json`
- `packages/test-contracts/src/index.ts`
- `packages/test-contracts/tsconfig.json`
- `packages/tokens/LICENSE.md`
- `packages/tokens/README.md`
- `packages/tokens/package.json`
- `packages/tokens/project.json`
- `packages/tokens/src/index.ts`
- `packages/tokens/tsconfig.json`
- `packages/vue/LICENSE.md`
- `packages/vue/README.md`
- `packages/vue/package.json`
- `packages/vue/project.json`
- `packages/vue/src/WorkspaceProbe.vue`
- `packages/vue/src/index.ts`
- `packages/vue/tsconfig.json`
- `packages/vue/vite.config.ts`
- `tools/README.md`
- `tools/block-publish.mjs`
- `tools/build.mjs`
- `tools/check-node.mjs`
- `tools/check-workspace.mjs`
- `tools/check-workspace.test.mjs`
- `tools/project.json`
- `tools/tsconfig.json`
- `tools/workspace-probe.test.mjs`
- `tools/yarn.mjs`
- `tsconfig.base.json`
- `yarn.lock`

## Evidence file inventory

- `.superpowers/sdd/PLAN/t01-logs/build-angular-fixture-network.log`
- `.superpowers/sdd/PLAN/t01-logs/build-angular-fixture.log`
- `.superpowers/sdd/PLAN/t01-logs/build-contracts-initial.log`
- `.superpowers/sdd/PLAN/t01-logs/build-packages.log`
- `.superpowers/sdd/PLAN/t01-logs/build-tools.log`
- `.superpowers/sdd/PLAN/t01-logs/build-typecheck-packages.log`
- `.superpowers/sdd/PLAN/t01-logs/corepack-version.log`
- `.superpowers/sdd/PLAN/t01-logs/files-created.json`
- `.superpowers/sdd/PLAN/t01-logs/install-immutable-final.log`
- `.superpowers/sdd/PLAN/t01-logs/install-immutable.log`
- `.superpowers/sdd/PLAN/t01-logs/install-initial.log`
- `.superpowers/sdd/PLAN/t01-logs/install-network.log`
- `.superpowers/sdd/PLAN/t01-logs/install-peers.log`
- `.superpowers/sdd/PLAN/t01-logs/linker.log`
- `.superpowers/sdd/PLAN/t01-logs/native-artifacts.log`
- `.superpowers/sdd/PLAN/t01-logs/node-version.log`
- `.superpowers/sdd/PLAN/t01-logs/nx-graph.log`
- `.superpowers/sdd/PLAN/t01-logs/nx-projects-final.log`
- `.superpowers/sdd/PLAN/t01-logs/nx-projects-initial.log`
- `.superpowers/sdd/PLAN/t01-logs/peer-details.log`
- `.superpowers/sdd/PLAN/t01-logs/peers-final.log`
- `.superpowers/sdd/PLAN/t01-logs/peers-initial.log`
- `.superpowers/sdd/PLAN/t01-logs/project-graph.json`
- `.superpowers/sdd/PLAN/t01-logs/verifier-complete.log`
- `.superpowers/sdd/PLAN/t01-logs/verifier-final.log`
- `.superpowers/sdd/PLAN/t01-logs/verifier-green.log`
- `.superpowers/sdd/PLAN/t01-logs/verifier-red.log`
- `.superpowers/sdd/PLAN/t01-logs/verify-workspace-final.log`
- `.superpowers/sdd/PLAN/t01-logs/workspace-checks-complete.log`
- `.superpowers/sdd/PLAN/t01-logs/workspace-checks-final.log`
- `.superpowers/sdd/PLAN/t01-logs/workspace-checks.log`
- `.superpowers/sdd/PLAN/t01-logs/yarn-version.log`

No commit was created because the exact active model identity hook is unavailable. Implementation/review delegate model preference in AGENTS is expressly scoped to this PLAN session. Shared progress/decision documents were left for the controller.

## T01 review fix round 1 — CSS URL dependency boundaries

Addressed the single Important finding in `task-T01-review.md`. Changed only `tools/check-workspace.mjs` and `tools/check-workspace.test.mjs`, plus this required evidence append. The verifier now extracts double-quoted, single-quoted, and unquoted CSS `@import url(...)` specifiers, including whitespace inside `url(...)`, then sends them through the existing internal dependency declaration, layer boundary and foreign runtime policy. The complete supported source file remains scanned, so this also covers Vue/Svelte `<style>` blocks and Lit/Angular inline stylesheet strings.

Focused disposable-copy negative tests cover all three URL forms, multiline URL whitespace, Vue/Svelte/Lit/Angular embedded imports, and a permitted shared-to-shared layer import without a dependency declaration. Disallowed shared/adapter and adapter/adapter imports assert both the boundary and undeclared-dependency diagnostics. The allowed control imports tokens CSS into styles with quoted and URL forms, expects no diagnostics, confirms the existing `krds-tokens` implicit dependency, and verifies the project configuration is unchanged. No package/project manifest or implicit graph edge was edited.

Executed only the requested covering verification, under the selected Node/Yarn wrapper:

- `node tools/yarn.mjs node --test tools/check-workspace.test.mjs` before the extraction fix: **exit 1**, reproduced every new URL-import negative case returning empty diagnostics; full output `.superpowers/sdd/PLAN/t01-logs/css-import-red.log`.
- Same command after the fix: **exit 0**, **21 tests passed, 0 failed**; full output `.superpowers/sdd/PLAN/t01-logs/css-import-green.log`.
- `node tools/yarn.mjs verify:workspace`: **exit 0**, output `Workspace verified: selected pins, pnpm linker, private apps, package metadata, dependency/import boundaries.`; full output `.superpowers/sdd/PLAN/t01-logs/css-import-verify.log`.

No native/framework suite, install, subagent, commit or publish operation was performed in this fix round. Existing bootstrap scope limitations and the previously explained transitive peers are unchanged.
