# Lit SSR evidence

Standalone server rendering runs in `packages/lit/tests/pilot-ssr.test.mjs` with the declared `@lit-labs/ssr` 4.1.0. Six native custom elements render declarative open shadow roots.

The actual Chromium/WebKit hydration suite is `apps/fixture-lit/tests/contract/hydration.test.mjs`. It renders the package's built public exports, saves server DOM identities, loads the production `hydrate` entry with official `lit-element-hydrate-support`, then verifies DOM reuse and first interaction. Application-owned JSON restores property-only options/items/value before explicit registration; this is not a claim of automatic property serialization or a generic framework SSR integration.

T10 candidate verification is separate from accepted pilot evidence. `packages/lit/tests/full-catalog-ssr.test.mjs` exercises all 48 new classes through the selected Lit SSR renderer. `apps/fixture-lit/tests/contract/catalog-hydration.test.mjs` serves real declarative shadow output, compares the actual native node before/after hydration in Chromium and WebKit, and checks first field/selection/disclosure events. Imports and registration are explicit; no host framework is substituted.

The native body component does not pretend to mutate the server head: use the public `faviconLinks()` template in the server head. Adjacent coach presentation is connected-client work and requires the actual target boundary. These limits do not waive the separate native behavior, asset/manual accessibility or full catalog acceptance gates.
