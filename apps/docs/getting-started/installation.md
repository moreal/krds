# Start with a local candidate

KRDS Native is an independent project under the selected `@unofficial-krds` namespace. Current manifests use version `0.0.0`. Neither the namespace nor the repository metadata proves authenticated ownership or public package availability. This guide uses the local checkout; it does not ask you to install an assumed public npm release. Publication, pushing and tagging remain unauthorized.

## Use the selected toolchain

The repository selects Node **24.18.0** and Yarn **4.14.1** in `compatibility/toolchain.json`. The repository wrapper launches that exact Node binary and the vendored Yarn. It does not change global tooling.

```sh
node tools/yarn.mjs --version
node tools/yarn.mjs install --immutable
```

Yarn Berry owns the single `yarn.lock`. Retain `nodeLinker: pnpm` in `.yarnrc.yml`; the linker name is not permission to run `pnpm install`. There is no npm or pnpm lockfile workflow.

## Build a native package and its first consumer

Choose the framework profile in the [compatibility matrix](../compatibility/). React is used below only to demonstrate the workspace command structure. Other native adapters have their own manifests, runtime peers, compiler paths and fixture commands.

```sh
node tools/yarn.mjs workspace @unofficial-krds/contracts build:local
node tools/yarn.mjs workspace @unofficial-krds/tokens build:local
node tools/yarn.mjs workspace @unofficial-krds/styles build:local
node tools/yarn.mjs workspace @unofficial-krds/react build:local
node tools/yarn.mjs workspace @unofficial-krds/fixture-react typecheck
node tools/yarn.mjs workspace @unofficial-krds/fixture-react build:local
```

Build outputs belong to each workspace's `dist/`. The [native examples directory](../compatibility/examples) links actual consumer source and registered compiler evidence. Start from that framework's checked consumer, then choose the [Button](../components/button) reference. Adapter imports do not automatically install global styles or fonts: follow [CSS, tokens and fonts](./styling).

## Inspect a local tarball

Local packing is distinct from publication. After the selected native package and shared packages are built, a local inspection pack can be created with the repository wrapper:

```sh
node tools/yarn.mjs workspace @unofficial-krds/react pack --out /private/tmp/krds-react-local.tgz
```

This is a concrete local inspection filename, not a release artifact identity. Inspect its `package.json`, `dist/`, attribution, license texts and provenance. A standalone consumer must install the actual local tarballs for **every** internal public dependency (including contracts/styles/tokens where declared), use the exact framework runtime/compiler versions, and resolve only packaged exports. Do not replace this check with source aliases or workspace linking. A successful workspace build does not establish independent tarball installation.

The release task owns the authoritative candidate artifact index, final filenames, hashes and isolated installation evidence. Until that index exists and its checks pass, this guide makes no release-ready installation claim. The package version and dependency ranges remain those in the actual manifests; do not invent a release version or substitute an unavailable registry package.

The [recorded local artifact page](./artifacts) derives versions, filenames and hashes from the actual available T14 inventories and checks their existing bytes. It explicitly identifies debug-only records and a missing final candidate manifest. No historical debug record is promoted to current-candidate acceptance.

## Build and read these docs

```sh
node tools/yarn.mjs nx run krds-docs:build
node apps/docs/scripts/serve.mjs
```

Open the local address printed by the server. Its native-preview links serve existing fixture and Storybook outputs separately. Qwik production resume requires its real server build and first lazy event test; a static or Storybook preview cannot replace that check. See [testing roles](./testing).
