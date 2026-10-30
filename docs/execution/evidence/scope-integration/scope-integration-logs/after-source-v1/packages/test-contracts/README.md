# Private native test contracts

Built exports provide semantic types, JSON state fixtures, the fixture-only control bridge and required pilot scenario IDs. Build with `node tools/yarn.mjs workspace @unofficial-krds/test-contracts build:local`. Consumers import the package exports, never source aliases.

Every native fixture implements `/fixtures/<componentId>?case=<caseId>` and installs `createFixtureBridge(framework, initialState)` from `@unofficial-krds/test-contracts/driver`. Subscribe within the native renderer, dispose on unmount, and record serializable events. The bridge merges semantic state patches and waits two animation frames for native rendering. `createFixtureDriver(page, origin)` verifies protocol and native framework before controlling the app.

Shared `StoryStateCase` records from `/fixtures` contain serializable data; native story code maps them to framework inputs/slots and local callbacks. `pilotScenarios` from `/scenarios` lists required canonical observations. No runtime renderer, provider, callback, QRL or DI object belongs in these records.

`__probe/native-state` and `infrastructure-native-probe--*` are test-only bootstrap probes. Common runners select them only with `--probe`; default canonical cases fail if missing and probes never award implementation coverage.

- `node tools/yarn.mjs test:contract --framework react --probe`
- `node tools/yarn.mjs test:contract --all-stable`
- `node tools/yarn.mjs test:stories --all-stable --probe`
- `node tools/yarn.mjs test:siheom --supported --probe`
- `node tools/yarn.mjs test:harness`

Runners consume production outputs in each selected app's `dist/`, allocate unique loopback ports and save unique reports under `test-results/t05/`. Run builds before invoking runners; runners never call Nx recursively. Browser binaries are pinned by Playwright 1.64.1 and stored in `/private/tmp/krds-playwright-1.64.1`. Native browser execution and localhost listening may require the host's approved execution path.

Story verification installs a strict production-asset request allowlist before iframe navigation. It blocks and fails external/API requests, WebSocket/EventSource and service-worker attempts even if the story is visible. The shared negative fixture proves blocking before sending. Axe 4.14.0 findings are recorded separately from native rendering; neither probe nor automated axe results imply KRDS or accessibility certification.
