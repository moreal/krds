# Lit SSR evidence

Standalone server rendering runs in `packages/lit/tests/pilot-ssr.test.mjs` with the declared `@lit-labs/ssr` 4.1.0. Six native custom elements render declarative open shadow roots.

The actual Chromium/WebKit hydration suite is `apps/fixture-lit/tests/contract/hydration.test.mjs`. It renders the package's built public exports, saves server DOM identities, loads the production `hydrate` entry with official `lit-element-hydrate-support`, then verifies DOM reuse and first interaction. Application-owned JSON restores property-only options/items/value before explicit registration; this is not a claim of automatic property serialization or a generic framework SSR integration.
