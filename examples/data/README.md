# Local example data

The executable source is the private workspace module [`@unofficial-krds/test-contracts/patterns`](../../packages/test-contracts/src/patterns/index.ts). Native fixture apps already depend directly on that workspace. Import its built export; do not import source across app roots or copy a renderer from another adapter.

- [`content.ts`](../../packages/test-contracts/src/patterns/content.ts): twelve fictional resources, explicit independent identity, sample form options, consent copy and local navigation.
- [`types.ts`](../../packages/test-contracts/src/patterns/types.ts): discriminated state/action/effect interfaces. Emitted declarations come from the implementation's compiler.
- [`flows.ts`](../../packages/test-contracts/src/patterns/flows.ts): validation, deterministic query/pagination and pure transitions.
- [`local-driver.ts`](../../packages/test-contracts/src/patterns/local-driver.ts): fixture-only local completion control, retry seeds, cancellation and snapshots; optional typed `initialState` clones validated ready URL state without synthetic requests or completion.
- [`presentation.ts`](../../packages/test-contracts/src/patterns/presentation.ts): sixteen plain presentation snapshots. They perform no requests and prove no native story execution.
- [`scenarios.ts`](../../packages/test-contracts/src/patterns/scenarios.ts): fifteen future native scenarios, exact route IDs/actions and observable outcomes.
- [`payloads.schema.json`](payloads.schema.json): JSON Schema definitions for normalized local payloads/resources. Select an explicit `#/$defs/...` reference; the root is a definition collection, not a state validator. Full state interfaces are in `types.ts`.

No data represents a real person, agency, application, authentication token or delivery destination. All completion records are visibly prefixed `DEMO-`. Values stay in memory and disappear on reload. These examples do not demonstrate a production security or server-validation boundary.

The independent code/data grant is [MIT](../../LICENSES/MIT.txt), copyright 2026 Lee Dogeon <dev.moreal@gmail.com>. Referenced KRDS guidance and its evidence retain their separate original rights; see [sources](../../docs/patterns/sources.md).
