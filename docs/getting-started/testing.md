# Stories and behavior tests

Three surfaces answer different questions. Keep their evidence and source files separate.

| Surface | Purpose | Source and command |
| --- | --- | --- |
| Native Storybook | Inspect native states, args, inputs, content and visual/accessibility outcomes | `apps/storybook-<framework>/`; `node tools/yarn.mjs test:stories --framework react` is one native profile example |
| Native siheom | Exercise observable component behavior with the supported native adapter | Native fixture `tests/siheom/` files; `node tools/yarn.mjs test:siheom --framework react` |
| Production app with Playwright | Verify the built consumer, focus, form submission, network policy and framework-specific boundaries | Native fixture and `tools/run-contract-tests.mjs`; `node tools/yarn.mjs test:contract --framework react` |

Substitute a framework only when its actual manifest/runner supports that command. Lit and Solid 2 have **no supported upstream siheom adapter**. Their selected native test paths remain explicit; widening peers or using a foreign renderer does not create support.

## Keep stories deterministic

Story state comes from local args/inputs/slots/snippets and pure fixtures. Do not prepare it with APIs, authentication, CDNs, external fonts or images. Shared fixtures may contain semantic state and observations; they do not render through another adapter. Keep full behavior journeys out of Storybook `play` and separate from story source.

Each component page links its specification, story obligations and actual native profile. A story ID in the required manifest is an obligation, not proof that the story has run. A probe is infrastructure evidence only and contributes zero catalog coverage. An empty behavioral suite must fail.

## Read raw results

Check actual assertion counts, raw axe violations, browser errors and request-policy findings. A runner exiting zero does not automatically mean axe found zero violations. Compiler success does not prove keyboard behavior, screen-reader output, touch behavior, forced colors, zoom or cleanup.

Qwik's Storybook client render is separate from its real production SSR/resume and first lazy event. Angular's stories are separate from partial APF and CVA form/reset consumption. Lit's light DOM appearance is separate from actual Shadow DOM naming and form association. Solid 2 remains an isolated preview.

This documentation site has its own generated-data/link tests and browser checks. They validate the docs UI and evidence links; they do not promote native component coverage.

## Parallel native CI

`select-and-check` resolves affected scope once and publishes a source-SHA-bound manifest. Seven stable framework workers, shared checks, docs and the Solid 2 preview then run independently in fresh checkouts. `native-ci-result` is the mandatory aggregate: every selected target and required cache restoration must pass, including preview. Empty lanes record `not-selected`; missing, skipped or cancelled evidence fails aggregation.

Each worker uploads its own 14-day `native-worker-<worker>-<run>-<attempt>` artifact with target ledgers, streaming logs, cache reports and behavioral results. The selection and final artifacts retain the manifest and separate stable/preview summaries. Inspect the owning worker's log for the last started test; Lit uses timestamped file/subtest progress and a ten-minute isolated test cap. A timeout retains process diagnostics and cleanup results instead of marking the suite successful.

CI installs the exact pinned Playwright builds under `$RUNNER_TEMP/krds-playwright-1.64.1` and propagates that path to all children. For a local run, explicitly set `PLAYWRIGHT_BROWSERS_PATH` to your installed pinned cache or install into the portable default first. Jobs share only Yarn's download cache; prerequisites and cache restoration run inside each worker's checkout.
