# KRDS Native documentation

This private VitePress workspace generates 54 web component references from `catalog/`, reviewed `specs/components/`, public package manifests and available public declarations. It does not promote native coverage.

```sh
node tools/yarn.mjs nx run krds-docs:build
node tools/yarn.mjs workspace @unofficial-krds/docs test
node tools/yarn.mjs workspace @unofficial-krds/docs typecheck
node apps/docs/scripts/serve.mjs
```

The local server prints the docs address (port 49100 by default) and separate free ports for existing native fixture/Storybook outputs. It does not rebuild them. Qwik's real SSR/resume application must use its own server and first-event tests. Solid 2 has no supported native Storybook integration.

With the selected local Playwright browser cache, the actual docs browser check is:

```sh
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs workspace @unofficial-krds/docs exec node tests/browser.mjs
```

It checks keyboard entry, Korean local search, catalog navigation, local source downloads, narrow overflow, raw axe findings, runtime errors and external requests in Chromium/WebKit. Screenshots and raw results are retained under `.superpowers/sdd/PLAN/t12-docs-logs/browser/`. The CUA browser access host was unavailable in this session; the selected Playwright browser path is independent of it.

`scripts/generate.mjs` copies authored guides from `docs/getting-started/` and `docs/legal/`. It regenerates component pages, examples, the support matrix and text-only source downloads. It validates frozen official source hashes but keeps raw original component/pattern HTML reference-only in the checkout. The site links official source URLs and frozen hash records. Downloaded authored specs may contain original KRDS excerpts and retain their attribution. Original license-policy texts are separate unchanged plain-text downloads, never executed. Output metadata distinguishes all input hashes, actually distributed text files and reference-only source URLs.

`example-evidence.json` registers all seven native compiler checkpoints. Each record needs exact source and original proof hashes, concrete component IDs, successful producer compiler evidence and public built-package consumption. The generator rejects changed source/proof bytes and an incomplete 54-component framework mapping. Historical producer-build scope and current native repair limitations stay visible; no checkpoint certifies the latest global candidate. Register only checks supplied by that native owner; a generic fixture, cast escape hatch or unexecuted snippet does not qualify.

The browser producer follows one real compiler-source link per framework and verifies the downloaded `text/plain` bytes against its registered source hash. It retains raw axe findings and checks the original policy is text-only. Its exact root/evidence declaration literals are preserved for T16's output-only recorder transform.

The support matrix is generated from actual metadata. Do not manually add all-supported badges. Rebuild after owners change exports, declarations, coverage or registered example sources; the freshness test deliberately fails stale generated metadata.

Frozen component-source downloads use `catalog/components.json`. The full upstream manifest remains a checkout reference because its documentation-distribution field contains this site's own snapshot hashes; copying that mutable field into its own distributed input would prevent a coherent current-byte binding.

`artifact-checkpoint.json` preserves historical T14 package names, versions, paths and recorded/observed hashes from the accepted docs checkpoint. Artifact documentation reads only this tracked record; it does not probe live `artifacts/` files or claim current availability or acceptance. Current candidate manifests, tarballs and source/build/consumer gates remain T14/T16 responsibilities. Updating this historical record requires a reviewed docs refresh and legal distribution rebind.

The isolated artifact regression uses synthetic generator inputs and temporary artifacts, without native builds or changes to real producer outputs:

```sh
node tools/yarn.mjs workspace @unofficial-krds/docs exec node --test tests/artifact-checkpoint.test.mjs
```
