# @unofficial-krds/test-contracts

Internal, private package for this repository's tests. It is never packed or installed in an app.

It provides the shared test data that every native fixture and story uses:

- `@unofficial-krds/test-contracts/fixtures`: serializable story states for each component.
- `@unofficial-krds/test-contracts/scenarios`: the scenarios that the contract and catalog runners check.
- `@unofficial-krds/test-contracts/driver`: `createFixtureBridge(framework, initialState)` for a fixture app, and `createFixtureDriver(page, origin)` for Playwright.
- `@unofficial-krds/test-contracts/patterns`: data for the pattern examples.

Each fixture app serves `/fixtures/<componentId>?case=<caseId>` and installs the bridge. The records hold plain data only. Each framework maps them to its own inputs, slots and callbacks.

Build the package, then the apps you test, before you run a runner. Runners read each app's `dist/` and do not build it.

```sh
node tools/yarn.mjs workspace @unofficial-krds/test-contracts build:local
node tools/yarn.mjs test:contract --framework react
node tools/yarn.mjs test:stories --framework react
node tools/yarn.mjs test:siheom --framework react
node tools/yarn.mjs test:harness
```

[CONTRIBUTING.md](../../CONTRIBUTING.md) explains the three kinds of tests.
