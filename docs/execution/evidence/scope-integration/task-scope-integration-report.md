# Atomic npm scope integration — completed execution

Current status: **atomic scope integration complete; selected checks and T03 local pack/legal checks pass; independent scope review is the remaining handoff gate.** All 32 workspace names/imports/current commands now use `@unofficial-krds`, with agreed repository metadata and regenerated Angular APF basenames. No dependency version or original-source rights changed. Publication remains unauthorized. The read-only preparation section below is retained as execution history; final results and immutable review artifacts are at the end.

Preparation phase (retained history): **read-only inventory and execution plan was prepared before the controller freeze/window.** No active source, manifest, identity, lockfile, generated output, or runtime configuration was renamed. This report and local preparation inventories are the only new artifacts. T06 source owners continue their edits. Inventory hashes are observations of active files, not a frozen source assertion; they will be recaptured immediately before the authorized atomic change.

Requested namespace: **`@unofficial-krds`**. User-supplied repository metadata: **`https://github.com/moreal/krds`**. These values establish naming/metadata intent, not npm or GitHub account ownership and not publication authorization.

## Observed identity handoff

T03 has now staged the user-confirmed independent metadata in `compliance/project-identity.json` and `compliance/metadata-evidence.json` while preserving current actual `localPackageScope: @krds-native` until this integration:

- Independent holder: **Lee Dogeon <dev.moreal@gmail.com>**, year **2026**; completed independent MIT grant at `LICENSES/MIT.txt`.
- Official KRDS material provider: **행정안전부 / Ministry of the Interior and Safety**, under verified original terms; no government co-ownership of independent code asserted.
- Repository URL metadata is user-confirmed; account ownership remains unauthenticated.
- Requested scope is confirmed; actual npm scope ownership remains unverified and publication authorization remains false.

T03 still owns the exact compliance identity transition, provenance package names/source inventory, legal notice generation, independent grant and official attribution. I will not blanket-replace or hand-edit their hashes/records. The final window/handoff is still required before applying any source changes.

## Exact namespace mapping

There are **32 Yarn workspaces** including the private root: 14 packages, 17 apps, and the root workspace. Every package name and internal `workspace:^` dependency key will map from `@krds-native/<suffix>` to `@unofficial-krds/<same suffix>`. Versions, folder paths, public/private flags, framework generations, compiler pins and dependency ranges remain unchanged. Nx project names such as `krds-solid` and `fixture-solid` remain the fixed PLAN identifiers; only their Yarn workspace command references change.

| Manifest path | Existing package name | New package name |
| --- | --- | --- |
| `package.json` | `@krds-native/workspace` | `@unofficial-krds/workspace` |
| `packages/angular/package.json` | `@krds-native/angular` | `@unofficial-krds/angular` |
| `packages/assets/package.json` | `@krds-native/assets` | `@unofficial-krds/assets` |
| `packages/contracts/package.json` | `@krds-native/contracts` | `@unofficial-krds/contracts` |
| `packages/fonts/package.json` | `@krds-native/fonts` | `@unofficial-krds/fonts` |
| `packages/lit/package.json` | `@krds-native/lit` | `@unofficial-krds/lit` |
| `packages/qwik/package.json` | `@krds-native/qwik` | `@unofficial-krds/qwik` |
| `packages/react/package.json` | `@krds-native/react` | `@unofficial-krds/react` |
| `packages/solid/package.json` | `@krds-native/solid` | `@unofficial-krds/solid` |
| `packages/solid-next/package.json` | `@krds-native/solid-next` | `@unofficial-krds/solid-next` |
| `packages/styles/package.json` | `@krds-native/styles` | `@unofficial-krds/styles` |
| `packages/svelte/package.json` | `@krds-native/svelte` | `@unofficial-krds/svelte` |
| `packages/test-contracts/package.json` | `@krds-native/test-contracts` | `@unofficial-krds/test-contracts` |
| `packages/tokens/package.json` | `@krds-native/tokens` | `@unofficial-krds/tokens` |
| `packages/vue/package.json` | `@krds-native/vue` | `@unofficial-krds/vue` |
| `apps/docs/package.json` | `@krds-native/docs` | `@unofficial-krds/docs` |
| `apps/fixture-angular/package.json` | `@krds-native/fixture-angular` | `@unofficial-krds/fixture-angular` |
| `apps/fixture-lit/package.json` | `@krds-native/fixture-lit` | `@unofficial-krds/fixture-lit` |
| `apps/fixture-qwik/package.json` | `@krds-native/fixture-qwik` | `@unofficial-krds/fixture-qwik` |
| `apps/fixture-react/package.json` | `@krds-native/fixture-react` | `@unofficial-krds/fixture-react` |
| `apps/fixture-solid/package.json` | `@krds-native/fixture-solid` | `@unofficial-krds/fixture-solid` |
| `apps/fixture-solid-next/package.json` | `@krds-native/fixture-solid-next` | `@unofficial-krds/fixture-solid-next` |
| `apps/fixture-svelte/package.json` | `@krds-native/fixture-svelte` | `@unofficial-krds/fixture-svelte` |
| `apps/fixture-vue/package.json` | `@krds-native/fixture-vue` | `@unofficial-krds/fixture-vue` |
| `apps/storybook-angular/package.json` | `@krds-native/storybook-angular` | `@unofficial-krds/storybook-angular` |
| `apps/storybook-lit/package.json` | `@krds-native/storybook-lit` | `@unofficial-krds/storybook-lit` |
| `apps/storybook-qwik/package.json` | `@krds-native/storybook-qwik` | `@unofficial-krds/storybook-qwik` |
| `apps/storybook-react/package.json` | `@krds-native/storybook-react` | `@unofficial-krds/storybook-react` |
| `apps/storybook-solid/package.json` | `@krds-native/storybook-solid` | `@unofficial-krds/storybook-solid` |
| `apps/storybook-solid-next/package.json` | `@krds-native/storybook-solid-next` | `@unofficial-krds/storybook-solid-next` |
| `apps/storybook-svelte/package.json` | `@krds-native/storybook-svelte` | `@unofficial-krds/storybook-svelte` |
| `apps/storybook-vue/package.json` | `@krds-native/storybook-vue` | `@unofficial-krds/storybook-vue` |

The machine-readable exact mapping, including current versions/private flags, is `scope-integration-logs/workspace-name-mapping.preparation.json`.

### Additional derived-path correction

`packages/angular/package.json` exports refer to generated APF basenames containing `krds-native-angular`. With package `@unofficial-krds/angular`, source export references must become **`unofficial-krds-angular`** (`dist/types/unofficial-krds-angular.d.ts`, `dist/fesm2022/unofficial-krds-angular.mjs`). `packages/angular/ng-package.json` allowed internal package names must use the new scoped names. ng-packagr output will be regenerated with the official tool; generated APF/dist files will not be hand-patched. This small package-only rebuild is needed for renamed APF exports even though the primary current implementation gate is foundations + Solid.

### Current-source inventory and ownership

Literal scope/artifact references were inventoried in **178** current text paths. Exact per-file mappings/counts and preparation SHA256 observations are in `scope-integration-logs/scope-source-inventory.preparation.json`.

- `integration-atomic-scope-rewrite`: 133 paths.
- `historical-json-field-review`: 2 paths.
- `T03-coordinated-regeneration`: 42 paths.
- `controller-ledger-history-preserve`: 1 paths.

The integration-owned set contains manifests, project commands, current authoring docs/spec references, tools, tests, renderer imports, and native/Storybook sources. It is held untouched until all T06 edits freeze. AGENTS requires a separate identity-wording update even though it has no literal old namespace: it must describe the confirmed user metadata/independent grant separately from still-unverified ownership and still-absent publication authority. The controller's progress/decisions ledger remains controller-owned.

### Preserve non-namespace identifiers

Do **not** globally replace bare `krds-native` text. The following are semantic/stable identifiers, not npm scopes:

- `krds-native-select` / `krds-native-select--controlled` are component story/fixture IDs. Keep them stable in catalog, common fixtures and Solid stories.
- Angular native-probe selectors/element names containing `krds-native-probe` are local native test contracts, not package names.
- `implement/krds-native` is the observed Git branch, not a package namespace; no branch/index/commit operation is authorized.
- `urn:krds-native:provenance-schema:1` is an existing schema identifier; T03 owns any intentional schema-version decision. A scope rename alone does not require breaking that URI.

Exact observed paths/lines are preserved in `stable-identifiers-to-preserve.preparation.json`. Current catalog old-looking matches are these stable native-select IDs, not package scope references, so they must not be renamed mechanically. Only the exact `@krds-native` scope token and specifically identified Angular APF basename require namespace substitution.

### Exclusions and historical field policy

Never rewrite immutable upstream sources or external registry metadata: `upstream/**`, `compatibility/evidence/**`, original license/font/third-party payloads, Yarn releases/cache, dependency installs or preserved third-party manifest trees. Preserve historical evidence/reports/snapshots under `docs/execution/evidence/**`, `.superpowers/**`, and prior release evidence. Generated `dist/`, reports, caches and runtime build output are rebuilt/invalidated by owners, not string-replaced.

Two current compatibility JSON files contain historical command/selection evidence rather than mutable import names:

- `compatibility/testing.json.browserInstallation.command` records the actual earlier browser installation under the old scope.
- `compatibility/testing.json.owningWorkspace.command` records the actual earlier package test command under the old scope.
- `compatibility/toolchain.json.publishedPackages[postcss@8.5.32].selectionReason` records the T04 choice referencing the old styles package.

These actual historical facts should stay intact or be explicitly labeled as previous-scope evidence; newly executed new-scope verification should be appended separately. Do not rewrite historical commands to imply they were previously run with names that did not exist. Current imports/selection fields discovered at the freeze will be renamed normally. T03's `metadata-evidence.json` likewise preserves the prior actual/requested scope transition history while its current identity state is updated by T03.

`PLAN.md` is the current authoring plan, so its working-scope examples/commands will use the new namespace; its ownership wording must still distinguish user-selected namespace metadata from authenticated ownership. `docs/execution/decisions.md` has a chronological T00 old-scope decision that should remain historical, followed by a new controller decision rather than a fabricated rewrite.

## Baseline for metadata-only resolution proof

No install was run during preparation. Current sole lockfile baseline:

- Lock SHA256: `136bebc1c213d0bc274b905ee291fa096beefa4dbbaece6ecf915689adadf4f4`.
- Total exact resolved identifiers: **1915**.
- Registry npm artifact identifiers: **1878**.
- Built-in patched resolutions: **5**.
- Local workspace resolutions: **32**.
- npm artifact-set SHA256: `f28e41b5d8c47cdb1df7a23c5a52fa3f619643cefabf06235114e4d98a6fe4f3`.
- Recorded npm cache checksum entries: **1544** (the remaining platform-optional resolutions do not all carry downloaded cache checksums).

Full npm artifact list, five patched identifiers, 32 workspace identifiers, checksum records and hashes are in `lock-baseline.preparation.json`. The freeze baseline will be recaptured; the final comparison must show all 1878 npm artifacts and five patched resolutions unchanged. The only expected full-resolution identifier changes are the 32 mapped workspace names, with exact same workspace paths and versions. Scope-normalizing the old workspace resolutions to the new scope must yield the entire final resolution set. The total remains 1915. Any other package/version/checksum drift is a concrete blocker to investigate, not an acceptable metadata rename.

## Authorized-window execution plan (not executed yet)

1. Controller freezes T06/common/native writers and supplies the T03 identity/provenance window. Re-inventory actual current files and capture final pre-mutation manifest/lock/artifact-set baselines. Do not act on a stale preparation snapshot.
2. Coordinate T03's current `localPackageScope` transition and provenance package-name/source-inventory refresh. Update all 32 names, internal dependency keys/imports and current command/config references consistently; keep project names, runtime pins, stable semantic IDs and source paths unchanged.
3. Add root/public package repository metadata using T03's confirmed exact URL/representation and correct package directories; do not invent author/ownership fields or change license coverage. Update AGENTS to name the user-confirmed scope/repository/independent grant and preserve ownership/publication limitations. Keep strict release checks intact.
4. Intentional selected `node tools/yarn.mjs install`, followed sequentially by `node tools/yarn.mjs install --immutable`. Use required existing global-store hard-link approval when needed. Preserve Yarn 4.14.1, Node 24.18.0, pnpm linker and single lockfile. No dependency/version/resolution/global-tool changes.
5. Compare npm 1878 / patches 5 / workspace 32 against the frozen baseline; prove complete scope-normalized metadata-only resolution equality. Deliver exact old/new lock hashes to T03. T03 regenerates current provenance/notices/source inventory after final source bytes are stable.
6. Rebuild current foundations and Solid candidate with the new workspace names, for example `node tools/yarn.mjs workspace @unofficial-krds/contracts build:local`, then the tokens/styles/assets/fonts/test-contracts/Solid dependency order through the fixed Nx project names or exact new scoped commands. Run their relevant build/typecheck/package tests; use the current owner-approved candidate check commands. Regenerate Angular APF for its renamed export basename. No generated dist hand edits.
7. Run focused workspace/package gates under new names: workspace boundary verifier and its regression suite, catalog verification, required common harness/package tests, and T03's normal notices/license/pack checks. Gate commands using new names must be logged as new execution evidence. Do not promote historical browser checks to new executions.
8. Verify current namespace references are consistent with explicit historical/stable-identifier exclusions, all source package/runtime dependency boundaries remain intact, and generated output names match exports. T03 completes its final inventory/normal local pack proof; strict release ownership checks remain appropriately unverified/blocked. Controller reviews the atomic result before unfreezing or starting the next native implementation.

No global all-workspace target invocation will run while new workers are active. Any expanded native/Storybook execution is scheduled by the coordinator during the freeze; preparation has run no suite, build, install or browser.

## Exact integration source-path inventory at preparation

These are observed integration-owned literal-scope/artifact paths; every file will be checked again at freeze:

- `PLAN.md`
- `apps/docs/package.json`
- `apps/docs/project.json`
- `apps/fixture-angular/package.json`
- `apps/fixture-angular/project.json`
- `apps/fixture-angular/src/fixture-app.ts`
- `apps/fixture-lit/package.json`
- `apps/fixture-lit/project.json`
- `apps/fixture-lit/src/main.ts`
- `apps/fixture-qwik/package.json`
- `apps/fixture-qwik/project.json`
- `apps/fixture-qwik/src/root.tsx`
- `apps/fixture-react/package.json`
- `apps/fixture-react/project.json`
- `apps/fixture-react/src/FixtureApp.tsx`
- `apps/fixture-solid-next/package.json`
- `apps/fixture-solid-next/project.json`
- `apps/fixture-solid-next/src/main.tsx`
- `apps/fixture-solid-next/tests/native-probe.spec.ts`
- `apps/fixture-solid/package.json`
- `apps/fixture-solid/project.json`
- `apps/fixture-solid/src/examples.tsx`
- `apps/fixture-solid/src/fixture-app.tsx`
- `apps/fixture-solid/src/main.tsx`
- `apps/fixture-solid/tests/setup.ts`
- `apps/fixture-solid/tests/siheom/button.test.tsx`
- `apps/fixture-solid/tests/siheom/calendar.test.tsx`
- `apps/fixture-solid/tests/siheom/date-input.test.tsx`
- `apps/fixture-solid/tests/siheom/modal.test.tsx`
- `apps/fixture-solid/tests/siheom/native-select.test.tsx`
- `apps/fixture-solid/tests/siheom/tabs.test.tsx`
- `apps/fixture-svelte/package.json`
- `apps/fixture-svelte/project.json`
- `apps/fixture-svelte/src/App.svelte`
- `apps/fixture-vue/package.json`
- `apps/fixture-vue/project.json`
- `apps/fixture-vue/src/FixtureApp.ts`
- `apps/storybook-angular/package.json`
- `apps/storybook-angular/project.json`
- `apps/storybook-angular/src/main.ts`
- `apps/storybook-angular/src/stories/probe.stories.ts`
- `apps/storybook-lit/package.json`
- `apps/storybook-lit/project.json`
- `apps/storybook-lit/src/main.ts`
- `apps/storybook-lit/src/stories/probe.stories.ts`
- `apps/storybook-qwik/package.json`
- `apps/storybook-qwik/project.json`
- `apps/storybook-qwik/src/main.tsx`
- `apps/storybook-qwik/src/root.tsx`
- `apps/storybook-qwik/src/stories/probe.stories.tsx`
- `apps/storybook-react/package.json`
- `apps/storybook-react/project.json`
- `apps/storybook-react/src/stories/native-probe.stories.tsx`
- `apps/storybook-solid-next/package.json`
- `apps/storybook-solid-next/project.json`
- `apps/storybook-solid-next/src/main.tsx`
- `apps/storybook-solid-next/src/stories/probe.stories.ts`
- `apps/storybook-solid/.storybook/preview.ts`
- `apps/storybook-solid/package.json`
- `apps/storybook-solid/project.json`
- `apps/storybook-solid/src/stories/button.stories.tsx`
- `apps/storybook-solid/src/stories/calendar.stories.tsx`
- `apps/storybook-solid/src/stories/date-input.stories.tsx`
- `apps/storybook-solid/src/stories/modal.stories.tsx`
- `apps/storybook-solid/src/stories/native-select.stories.tsx`
- `apps/storybook-solid/src/stories/probe.stories.tsx`
- `apps/storybook-solid/src/stories/tabs.stories.tsx`
- `apps/storybook-svelte/package.json`
- `apps/storybook-svelte/project.json`
- `apps/storybook-svelte/src/App.svelte`
- `apps/storybook-svelte/src/stories/NativeProbe.svelte`
- `apps/storybook-svelte/src/stories/probe.stories.ts`
- `apps/storybook-vue/package.json`
- `apps/storybook-vue/project.json`
- `apps/storybook-vue/src/main.ts`
- `apps/storybook-vue/src/stories/NativeProbe.ts`
- `apps/storybook-vue/src/stories/probe.stories.ts`
- `package.json`
- `packages/angular/README.md`
- `packages/angular/ng-package.json`
- `packages/angular/package.json`
- `packages/angular/project.json`
- `packages/assets/README.md`
- `packages/assets/package.json`
- `packages/assets/project.json`
- `packages/contracts/README.md`
- `packages/contracts/package.json`
- `packages/contracts/project.json`
- `packages/fonts/README.md`
- `packages/fonts/package.json`
- `packages/fonts/project.json`
- `packages/fonts/src/index.ts`
- `packages/lit/README.md`
- `packages/lit/package.json`
- `packages/lit/project.json`
- `packages/qwik/README.md`
- `packages/qwik/package.json`
- `packages/qwik/project.json`
- `packages/react/README.md`
- `packages/react/package.json`
- `packages/react/project.json`
- `packages/solid-next/README.md`
- `packages/solid-next/package.json`
- `packages/solid-next/project.json`
- `packages/solid/README.md`
- `packages/solid/package.json`
- `packages/solid/project.json`
- `packages/solid/src/components/calendar/index.tsx`
- `packages/solid/src/components/calendar/model.ts`
- `packages/solid/src/components/date-input/index.tsx`
- `packages/solid/src/components/modal/index.tsx`
- `packages/solid/src/components/native-select/index.tsx`
- `packages/solid/src/components/tabs/index.tsx`
- `packages/styles/README.md`
- `packages/styles/package.json`
- `packages/styles/project.json`
- `packages/svelte/README.md`
- `packages/svelte/package.json`
- `packages/svelte/project.json`
- `packages/test-contracts/README.md`
- `packages/test-contracts/package.json`
- `packages/test-contracts/project.json`
- `packages/test-contracts/src/types.ts`
- `packages/tokens/README.md`
- `packages/tokens/package.json`
- `packages/tokens/project.json`
- `packages/tokens/src/outputs.test.ts`
- `packages/vue/README.md`
- `packages/vue/package.json`
- `packages/vue/project.json`
- `specs/components/README.md`
- `tools/check-workspace.test.mjs`
- `tools/run-siheom-tests.mjs`

### T03-coordinated current paths

- `compliance/project-identity.json`
- `compliance/provenance.json`
- `packages/angular/ATTRIBUTION.md`
- `packages/angular/LICENSE.md`
- `packages/angular/THIRD-PARTY-NOTICES.md`
- `packages/assets/LICENSE.md`
- `packages/assets/THIRD-PARTY-NOTICES.md`
- `packages/assets/provenance.json`
- `packages/contracts/ATTRIBUTION.md`
- `packages/contracts/LICENSE.md`
- `packages/contracts/THIRD-PARTY-NOTICES.md`
- `packages/fonts/ATTRIBUTION.md`
- `packages/fonts/LICENSE.md`
- `packages/fonts/THIRD-PARTY-NOTICES.md`
- `packages/fonts/provenance.json`
- `packages/lit/ATTRIBUTION.md`
- `packages/lit/LICENSE.md`
- `packages/lit/THIRD-PARTY-NOTICES.md`
- `packages/qwik/ATTRIBUTION.md`
- `packages/qwik/LICENSE.md`
- `packages/qwik/THIRD-PARTY-NOTICES.md`
- `packages/react/ATTRIBUTION.md`
- `packages/react/LICENSE.md`
- `packages/react/THIRD-PARTY-NOTICES.md`
- `packages/solid-next/ATTRIBUTION.md`
- `packages/solid-next/LICENSE.md`
- `packages/solid-next/THIRD-PARTY-NOTICES.md`
- `packages/solid/ATTRIBUTION.md`
- `packages/solid/LICENSE.md`
- `packages/solid/THIRD-PARTY-NOTICES.md`
- `packages/styles/LICENSE.md`
- `packages/styles/THIRD-PARTY-NOTICES.md`
- `packages/styles/provenance.json`
- `packages/svelte/ATTRIBUTION.md`
- `packages/svelte/LICENSE.md`
- `packages/svelte/THIRD-PARTY-NOTICES.md`
- `packages/tokens/LICENSE.md`
- `packages/tokens/THIRD-PARTY-NOTICES.md`
- `packages/tokens/provenance.json`
- `packages/vue/ATTRIBUTION.md`
- `packages/vue/LICENSE.md`
- `packages/vue/THIRD-PARTY-NOTICES.md`


Additional manual/current metadata wording review: `AGENTS.md`, `tools/README.md`, T03-owned identity/notice fields, and controller-owned progress/decisions. This preparation does not authorize simultaneous global replacements or edits to those owners' active work.

Ready for the controller's freeze/window. No source rename has begun.


## Execution appendix — source/lock stable, validation pending

Controller opened the explicit atomic window after T06 source reviews passed. Namespace edits are now applied to 133 active authored files. This is a staged execution status, not a completion claim. Builds and renamed-candidate checks are pending; T03 is coordinating its separately owned identity/provenance/legal outputs.

### Frozen authored review package v1

- Exact before/after bytes and SHA256 manifest: `scope-integration-logs/authored-source-snapshot-v1.json`, with immutable `before/` and `after-source-v1/` trees.
- Complete authored raw diff: `scope-integration-logs/source-scope.diff`.
- Smaller manifest/name/repository/APF slice: `scope-integration-logs/manifest-scope.diff`.
- Repetitive namespace imports/config/docs plus AGENTS identity slice: `scope-integration-logs/authored-imports-and-config.diff`.
- Per-file scope counts and metadata classification: `scope-integration-logs/source-mutations.json`.

Every non-manifest authored file except AGENTS is byte-for-byte the prior source with only the exact npm scope prefix substituted. Manifest parsed equality is asserted against the translated old manifest, adding only the agreed repository descriptor to root/public packages and the derived Angular APF basename correction. AGENTS adds a confirmed naming/location-versus-ownership/publication note and preserves the user-confirmed independent MIT holder distinction. No runtime logic, story IDs, probe selectors or package versions were changed.

Excluded concurrent lead paths: PLAN.md, docs/execution/progress.md, catalog/coverage.json and all durable T06 evidence. Original reports/hashes and immutable third-party sources remain original. Controller-owned decisions/progress are not rewritten.

### Separate generated lock/npm proof

Intentional install and immutable install passed. Before bytes are `before/yarn.lock`; new generated bytes are `yarn.after-scope-v1.lock`; raw generated diff is `yarn-generated.diff`. Machine proof: `lock-baseline.frozen.json`, `lock-after.json`, `lock-comparison.json` / `.log`. The lock changes only 32 authorized workspace identifiers/dependency keys; the 1878 npm artifact identifiers, 5 built-in patch resolutions and 1544 downloaded npm cache checksum records are exact matches. Scope-normalizing the old 32 local workspace identifiers yields the complete 1915-entry new resolution set.

Old lock: 136bebc1c213d0bc274b905ee291fa096beefa4dbbaece6ecf915689adadf4f4.
New lock: fb40749425ddd90ce46937551ae72c63d4bdf7caa53706edf073f4ccc69b0b58.

Independent review may inspect this frozen authored mapping now, withholding verdict until the final renamed build/test evidence and T03 legal-output supplement are supplied. Any later legitimate authored correction receives a separate snapshot/diff supplement; v1 will not be silently overwritten.


## Final execution result and review handoff

**PASS within the authorized namespace/metadata migration scope.** No runtime/component behavior was intentionally changed. All 32 Yarn workspaces, internal dependency keys, current imports/configs/commands and package README examples use the new scope. Fixed Nx project names, physical folders, semantic story IDs and Angular probe selectors remain unchanged. Root/public package repository descriptors use the exact agreed URL and correct directories; no account ownership or author identity was invented. Current AGENTS distinguishes user-confirmed metadata/independent grant from unauthenticated account ownership and absent publication authorization.

### Exact authored v2 diff and immutable bytes

The final authored change set is 135 paths: initial 133 files, plus the current PLAN naming reconciliation and append-only progress status. Complete replayable byte/hash manifest: **`scope-integration-logs/authored-source-snapshot-v2-final.json`**. Every row points to frozen original before bytes and immutable after bytes; 135 before/after hashes were verified. **`authored-full-final.diff`** is the complete raw final authored diff. `review-artifact-sha256.json` fingerprints the review manifests, source/lock diffs and result summaries.

Original v1 snapshots/diffs were not overwritten. The exact v2 delta is **`authored-v2-supplement.diff`**:

1. Two escaped regex scope expectations in `tools/check-workspace.test.mjs` were missed by literal slash-prefix substitution. The actual intended suite ran RED (`test-workspace.log`, 21 tests total; nine child cases plus enclosing test fail because expected old namespace). The checker itself already reported new-scope diagnostics correctly. Only those two expected namespace strings changed; the same suite then passed 21/21 in `test-workspace-green.log`. The final entire test file equals the frozen original with only the exact scope token changed, including escaped-slash contexts. No checker/runtime policy logic changed.
2. After the lead announced archive completion, `PLAN.md` received 9 exact namespace substitutions. Its current before bytes are preserved; every checkbox and other requirement is unchanged.
3. After all selected checks passed, `docs/execution/progress.md` received only an appended current-scope status paragraph. Prior metadata waiting notes and actual historical commands remain unchanged and explicitly superseded by the new current note.

Frozen source v1/v2 and raw diffs are the scope review input. The controller released existing-file/dist holds after T03's 13-pack checkpoint so later native owners could continue legitimate implementation work; mutable current files may subsequently differ from the frozen scope checkpoint. Those later changes are not silently included in this migration diff.

### Actual command/result matrix

Commands execute through selected Node 24.18.0 / vendored Yarn 4.14.1. Browser checks use the already installed pinned local Chromium via the shown path. The canonical 77/10/6 checks ran **once each**, after rebuilding the renamed candidate. No unrelated framework-native suite or global all-workspace run was added.

| Command | Actual result | Log under `scope-integration-logs/` |
| --- | --- | --- |
| `node tools/yarn.mjs install` | Exit 0; 32 new-scope workspace links, no new npm artifact | `install.log` |
| `node tools/yarn.mjs install --immutable` | Exit 0; Exit 0; no lock mutation | `install-immutable.log` |
| `node tools/yarn.mjs nx run-many -t build,typecheck --projects=krds-contracts,krds-tokens,krds-styles,krds-assets,krds-fonts,krds-test-contracts,krds-solid,krds-angular --parallel=2 --skip-nx-cache --output-style=static` | Exit 0; 8 projects,16 tasks pass;8.5s,cache skipped | `foundations-solid-angular-build-typecheck.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/fixture-solid build:local` | Exit 0; Pass | `solid-fixture-build.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/storybook-solid storybook-build:local` | Exit 0; Pass | `solid-storybook-build.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/fixture-solid typecheck` | Exit 0; Pass | `solid-fixture-typecheck.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/storybook-solid typecheck` | Exit 0; Pass | `solid-storybook-typecheck.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/contracts test` | Exit 0; 154 passed | `contracts-test.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/tokens test` | Exit 0; 10 passed | `tokens-test.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/styles test` | Exit 0; 8 passed | `styles-test.log` |
| `PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs workspace @unofficial-krds/solid test` | Exit 0; 2 passed | `solid-provider-test.log` |
| `node tools/yarn.mjs verify:workspace` | Exit 0; Pass | `verify-workspace.log` |
| `node tools/yarn.mjs test:workspace` | Exit 0; 21 passed after observed escaped-regex RED | `test-workspace-green.log` |
| `node tools/yarn.mjs verify:catalog` | Exit 0; 55 frozen records/54 web,55 upstream hashes; no coverage promotion | `verify-catalog.log` |
| `PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs test:harness` | Exit 0; 19 passed | `test-harness.log` |
| `PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs test:siheom --framework solid` | Exit 0; 77 passed,canonical | `solid-siheom-77.log` |
| `PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs test:contract --framework solid` | Exit 0; 10 passed,canonical | `solid-contract-10.log` |
| `PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs test:stories --framework solid` | Exit 0; 6 passed,canonical,axe0,forbidden requests0 | `solid-canonical-stories-6.log` |
| `node tools/yarn.mjs nx graph --file=.superpowers/sdd/PLAN/scope-integration-logs/project-graph.json` | Exit 0; 32 real projects,new-scope workspace commands; graph only | `project-graph.log` |

All raw canonical result trees were copied without modifying their contents into `candidate-siheom/`, `candidate-contract/`, and `candidate-stories/`. These retain the original unique report paths as evidence references. `canonical-result-summary.json` records 77/77 native siheom, 10/10 production contracts, 6/6 canonical stories, **0 raw axe violations and 0 forbidden request findings**, and `coverageAwarded: false`. The native-select story ID remains `krds-native-select--controlled`, proving semantic IDs were not confused with package scopes. Source/compiled entry checks confirm generated Angular `@unofficial-krds/angular` APF exports and actual `unofficial-krds-angular` FESM2022/DTS files; generated dist was rebuilt, not edited by string replacement.

Install warnings are the same previously documented transitive DocSearch/WASI peer warnings and Yarn's pnpm workspace-peer informational limitation. No runtime resolution or warning suppression was introduced. The environment's existing dependency build-script policy was not changed. Existing Angular compatibility-builder deprecation/export rewrite and Storybook chunk-size warnings do not replace any failed check; the actual selected build commands exited 0.

### Exact lock/npm metadata-only proof

Before lock SHA256: `136bebc1c213d0bc274b905ee291fa096beefa4dbbaece6ecf915689adadf4f4`.
After lock SHA256: **`fb40749425ddd90ce46937551ae72c63d4bdf7caa53706edf073f4ccc69b0b58`**.

The unchanged npm artifact set contains 1878 exact identifiers with SHA256 `f28e41b5d8c47cdb1df7a23c5a52fa3f619643cefabf06235114e4d98a6fe4f3`; all 5 built-in patch resolutions and 1544 recorded npm cache checksums match. Only 32 authorized workspace identifiers/keys changed. Scope-normalizing the original full resolution set yields the complete 1915-entry final set, with no npm addition/removal/version change. `lock-comparison.json`, frozen before/current resolution snapshots and exact generated lock diff remain separately available. T03 independently re-parsed actual lock bytes and confirmed the same set/checksum proof before refreshing its owned fingerprint.

### Coordinated T03 legal/provenance supplement

See **`task-scope-compliance-report.md`**, `scope-compliance-logs/current-owned-and-package-inventory.json`, `changed-owned-inventory.json`, `owned-unified.diff`, protected hash records and the immutable package results. T03 changed only current scope/metadata status, 18 package distribution references across 16 provenance records, the dependency-inventory lock fingerprint, and deterministic generated notice/header/provenance names. Reverse scope mapping restores the old provenance bytes; original source/copyright/license/retrieval/modification fields remain unchanged. Historical metadata evidence, independent MIT grant and official upstream fingerprints remain protected.

T03 independently reports:

- Normal local rebuilt-output license verification: 1599 source records / 13 public notice sets, exit 0.
- 13 actual `@unofficial-krds/*` tarballs packed, opened and inspected: new names, exact repository URL/directories, complete MIT grant and legal/material source-byte matches, all pass.
- 60 packed export/entry-target checks pass, including actual regenerated Angular files. Tarball hashes and actual artifacts at `/private/tmp/krds-scope-pack/` define the checkpoint, rather than later mutable native outputs.
- 98 captured legal/package-metadata artifacts (85 owned + 13 read-only public manifests), 43 owned changed files, and before/after bytes preserved separately. No scope/repository account ownership or publication permission was invented.

The hold was released promptly after that source/pack checkpoint, without waiting for cosmetic report work. No further source/lock/dist/package write is planned by integration; subsequent work is independent scope review/reporting or separately authorized native work.

This migration adds **zero catalog coverage** and does not constitute release, full browser/platform/SSR support, or publication acceptance. No npm publish, global tool change, dependency expansion, Git index mutation, commit, push, tag or subagent was performed by this integration owner.
