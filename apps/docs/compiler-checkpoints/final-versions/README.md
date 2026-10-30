# Native compiler checkpoints after version application

These retained files are the exact original successful command records, stdout,
stderr and package output inventories captured after Nx applied stable `0.1.0`
versions. Each framework's `proof.json` binds its public examples to the built
package and compiler command. Angular also retains the consumed partial-APF
archive. The two diagnostic Angular sandbox failures remain in the session
archive; the successful command ran outside that sandbox with one build worker.

These are local compiler checkpoints. They do not establish current release,
native behavior, SSR, hydration, Qwik resume, manual or hosted CI acceptance.
The source checkpoint recorded in the proofs precedes the metadata commit.

From a clean checkout, use the exact Node and vendored Yarn selected by
`compatibility/toolchain.json`. Run existing producers sequentially:

```sh
node tools/yarn.mjs workspace @unofficial-krds/contracts build:local
node tools/yarn.mjs workspace @unofficial-krds/tokens build:local
node tools/yarn.mjs workspace @unofficial-krds/styles build:local
node tools/yarn.mjs workspace @unofficial-krds/assets build:local
node tools/yarn.mjs workspace @unofficial-krds/fonts build:local
```

For each of `react`, `solid`, `svelte`, `vue`, `lit`, `qwik` and `angular`, run
`node tools/yarn.mjs workspace @unofficial-krds/<framework> build:local`.
Use `NG_BUILD_MAX_WORKERS=1` for Angular. Then run the compiler commands:

```sh
node tools/yarn.mjs workspace @unofficial-krds/react exec tsc -p examples/tsconfig.json
node tools/yarn.mjs workspace @unofficial-krds/fixture-solid typecheck
node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck
node tools/yarn.mjs workspace @unofficial-krds/fixture-vue typecheck
node tools/yarn.mjs workspace @unofficial-krds/fixture-lit typecheck
node tools/yarn.mjs workspace @unofficial-krds/fixture-qwik exec tsc -p tsconfig.examples.json --noEmit
NG_BUILD_MAX_WORKERS=1 node tools/yarn.mjs workspace @unofficial-krds/fixture-angular build:local
```

Run `node tools/yarn.mjs workspace @unofficial-krds/fixture-<framework>
build:local` for the other six fixtures, then
`node tools/yarn.mjs workspace @unofficial-krds/storybook-<framework>
build:local` for all seven stable frameworks. Set
`STORYBOOK_DISABLE_TELEMETRY=1`; keep Angular's worker limit.

Retain fresh argv, environment overrides, exit status, stdout and stderr under a
new evidence directory. Capture SHA-256 and byte counts of consumed package
outputs, configuration and source examples. Preserve the existing proof bytes;
timestamps and build timing logs are observations and need not reproduce
byte-for-byte. A new checkpoint requires explicitly updating
`apps/docs/example-evidence.json` source hashes, proof paths/hashes and Angular's
consumed-archive binding. Keep `checkpointOnly: true` and
`currentCandidate: false`. The existing generator verifies those registrations.

With producer outputs frozen, generate and verify the real site:

```sh
node tools/yarn.mjs workspace @unofficial-krds/docs build:local
node tools/yarn.mjs workspace @unofficial-krds/docs typecheck
node tools/yarn.mjs workspace @unofficial-krds/docs test
```

Changed documentation snapshots require the existing explicit legal/provenance
rebind before the final metadata commit. Rebuilding native inputs later can
invalidate strict docs freshness. The tracked historical artifact checkpoint
remains historical and independent of mutable current package artifacts.
