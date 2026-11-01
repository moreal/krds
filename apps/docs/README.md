# Unofficial KRDS documentation

This private documentation workspace uses a static Astro pipeline with one server-rendered and hydrated native Solid 1 app per document. The complete shell, search, home and rich article compose actual public KRDS components. The original 135 HTML paths and 609 source downloads remain preserved. The UI uses the public reset, original local Pretendard GOV fonts and supported light/forced-colors presentation. npm publication and release readiness remain separate gates.

`build:local` runs source generation, original-path route generation and Astro build. `typecheck` runs Astro sync, the official `astro-check` CLI and Solid TSX `tsc`. `test:content` checks the parser, rich public server APIs and TSX types. `test:shell:browser` checks the real shell, keyboard search/menu coordination, FontFace loading, computed root/body/button sizes, 320px and 200% text, no-JS navigation, axe and download bytes in Chromium/WebKit. `test:pipeline` checks routes, public Solid SSR, immutable historical identities, the explicit current-input allowlist and actual failing Astro/TSX diagnostics. Generated routes, data and `.astro` cache are ignored; authored `.astro` imports remain workspace-policy checked. `tests/fixtures/vitepress-baseline.json` preserves the pre-migration 135 HTML paths, heading IDs, local href targets and all 609 source downloads.

The seven source/build tests and current browser producer validate the Astro shell. Dependency provenance, exact emitted font assets and original bundled runtime notices are registered through the owning generators. Current-source snapshot changes must be explicitly added to `migration-current-inputs.json`, with exact before/after hashes and reasons in `migration-current-input-diff.json`.

Generation still creates 54 web component references from `catalog/`, reviewed `specs/components/`, public package manifests and frozen public declaration records. It does not promote native coverage.

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

It checks keyboard entry, Korean local search, catalog navigation, local source downloads, narrow overflow, raw axe findings, runtime errors and external requests in Chromium/WebKit. It self-serves the exact built `dist` at an ephemeral localhost port. Screenshots and raw results are retained under `test-results/docs-pages/browser/`. The release recorder invokes this same full producer and binds actual browser-delivered home/reference and asset bytes to current dist hashes.

`scripts/generate.mjs` copies authored guides from `docs/getting-started/` and `docs/legal/`. It regenerates component pages, examples, the support matrix and text-only source downloads. It validates frozen official source hashes but keeps raw original component/pattern HTML reference-only in the checkout. The site links official source URLs and frozen hash records. Downloaded authored specs may contain original KRDS excerpts and retain their attribution. Original license-policy texts are separate unchanged plain-text downloads, never executed. Output metadata distinguishes all input hashes, actually distributed text files and reference-only source URLs.

`example-evidence.json` registers all seven native compiler checkpoints. Each record needs exact source and original proof hashes, concrete component IDs, successful producer compiler evidence and public built-package consumption. The generator rejects changed source/proof bytes and an incomplete 54-component framework mapping. Historical producer-build scope and current native repair limitations stay visible; no checkpoint certifies the latest global candidate. Register only checks supplied by that native owner; a generic fixture, cast escape hatch or unexecuted snippet does not qualify.

The browser producer verifies all 609 downloaded `text/plain` files against their registered source hashes in each engine. It retains raw axe findings and checks the original policy is text-only. Its exact root/evidence declaration literals are preserved for T16's output-only recorder transform.

The support matrix is generated from actual metadata. Do not manually add all-supported badges. Rebuild after owners change exports, declarations, coverage or registered example sources; the freshness test deliberately fails stale generated metadata.

Frozen component-source downloads use `catalog/components.json`. The full upstream manifest remains a checkout reference because its documentation-distribution field contains this site's own snapshot hashes; copying that mutable field into its own distributed input would prevent a coherent current-byte binding.

`artifact-checkpoint.json` preserves historical T14 package names, versions, paths and recorded/observed hashes from the accepted docs checkpoint. Artifact documentation reads only this tracked record; it does not probe live `artifacts/` files or claim current availability or acceptance. Current candidate manifests, tarballs and source/build/consumer gates remain T14/T16 responsibilities. Updating this historical record requires a reviewed docs refresh and legal distribution rebind.

The isolated artifact regression uses synthetic generator inputs and temporary artifacts, without native builds or changes to real producer outputs:

```sh
node tools/yarn.mjs workspace @unofficial-krds/docs exec node --test tests/artifact-checkpoint.test.mjs
```

`tools/refresh-docs-distribution.mjs` rebinds the explicit changed-current-input allowlist and exact emitted original fonts after a build; `generate:notices` then regenerates the linked legal sidecars. It never changes historical checkpoints or expands download paths. `tools/refresh-dependency-provenance.py` refreshes the current lock graph from original local Yarn cache manifests/licenses, preserves retained records and keeps unfetched platform packages explicitly unresolved.

The compiler audit in `scripts/bundle-provenance.mjs` records actual client chunk packages and Astro’s inline island runtime under the ignored `.astro/` cache. The docs notice generator preserves the original Astro, Solid integration and Solid 1 license texts in the served `_legal` output. This audit adds no runtime network access.
