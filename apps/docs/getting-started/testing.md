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
