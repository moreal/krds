# T14 artifact and outside-consumer report

Status: pipeline implemented and exercised with actual public tarballs and outside installations. Fifteen of fifteen matrix positions have passing incremental debug evidence, using the original twelve unaffected candidates plus a separately packed Solid 1 SSR repair. Final source acceptance and the final all-thirteen candidate remain pending the controller-owned source freeze/build window. No commit, push, tag or publication occurred.

## Changes and interfaces

- Added `tools/pack-all.mjs`, `tools/inspect-tarballs.mjs`, `tools/test-consumers.mjs`, shared consumer helpers/templates, four focused failure tests and consumer usage documentation. Generated actual artifacts and logs only within the exclusive T14 paths. No package/root/lock/provenance/notice source was changed by this task. Root script additions were coordinated with their owner.
- Root interfaces: `pack:all` → `node tools/pack-all.mjs`; `inspect:tarballs` → `node tools/inspect-tarballs.mjs`; `test:consumers` → `node tools/test-consumers.mjs`.
- `pack:all --build` serially invokes each public workspace build in declared internal dependency order and records `artifacts/build-evidence.json` input/output fingerprints before packing. Default packing requires matching evidence and rejects quiet stale dist as well as live source changes. Notices must already match current provenance. This final build has not been run while native owners are editing.
- Actual Yarn dry runs are parsed as NDJSON and compared to actual tar file lists. The inspector checks gzip/tar member paths/types/checksums, all file and normalized content hashes, packed identity/version, original internal dependency/optional/peer ranges before candidate overrides, exports/types/CSS/assets/maps, native public type imports, README and complete notices/licenses. Portable packed dependencies are required. Original internal versions are checked against the frozen candidate set. Unsupported internal range syntax fails closed.
- `inspect(manifest, { scope: "stable" | "preview" | "all" })` permits independent stable twelve-package and preview shared-five-plus-RC checks while retaining complete thirteen-package manifest and full current build/source attestation requirements. Default is all. Scoped return values must not overwrite the full manifest.
- Final consumers use fresh `/private/tmp/krds-consumer-*` projects, own manifests/locks/node_modules, consumer-only internal tarball resolutions and exact runtime/compiler pins. Offline install seeds only non-workspace npm resolutions from the selected lock, then Yarn prunes its own lock. Cached package archives are placed in a separate temporary cache/global index; no repository node_modules/source aliases or root resolutions are used. Each installed internal file is compared to its candidate bytes.
- Actual native type/build/server/browser paths run for all frameworks. Angular uses official partial APF secondary button/forms imports, application AOT/static SSR/hydration and Reactive Forms CVA. Qwik uses Vite 7 optimizer output, serialized SSR and first resumed click. Other native builds use selected Vite 8. Bundle inspection resolves actual `.store` package identities, rejects foreign renderers/test tools and checks scoped CSS/font exclusion and retained notices. Browser driver supports `KRDS_BROWSER` and `KRDS_TIMEZONE`; T14 pipeline evidence here uses Chromium/UTC.
- Debug inventory and consumer flags are explicit and cannot satisfy final gates. Existing debug bytes are archived before final packing overwrites their source paths. Filtered/case diagnostic reports have separate names; only a fresh all-framework fifteen-row report can pass the final consumer gate.

## Actual evidence

Original retained thirteen-package inventory SHA-256: `db6642c32d9e18f1f1860b05657d96d8bb0dc291dc07d301ab5fa9692fc2d7ae` (`artifacts/debug-inventory.json`). Repaired-Solid alternate thirteen-package inventory SHA-256: `a13cd9242bdb6f2a82c1907f8bfbdf9242892d9ac6f8245ffd4792d86e45e2f5` (`artifacts/debug-solid-inventory.json`). Both remain `debug-only-source-not-accepted`.

| Original candidate | Actual tarball SHA-256 |
| --- | --- |
| @unofficial-krds/angular | `49bfc35858c6f06f713882670da78442a2a4bdf59ffbccbe5fef1cb9274f78ad` |
| @unofficial-krds/assets | `c8c8e50d06e934028f3b19eb16f29a302c4ae9a3949d10e7d98f0c88ebbbca35` |
| @unofficial-krds/contracts | `ad2c3c5813f6e2025462ae8c01c52520d5e9bb47cc0b74be6e9915445fcec42d` |
| @unofficial-krds/fonts | `6a7028c459126e42defa6cf3bab13e2da0465988e932040c53934ba36a744c9a` |
| @unofficial-krds/lit | `80d6fd2d42d91d1a66772c61612196b8c223c557e730db0b0a95933a87efbf59` |
| @unofficial-krds/qwik | `cdd81a275301651388482a42e1ad7983d92f2ddcb9c4cb48083391b56809dff3` |
| @unofficial-krds/react | `2ee684a1c2215d7ee96532cc5389b66668f09e0cb72400413f7d98bf497f9d61` |
| @unofficial-krds/solid | `57b85a0fbba2701c8411272a0784f7827a27d1729e2940d8b705ccfe6a98a58e` |
| @unofficial-krds/solid-next | `2b04634a808da1302c9a55c0bd669656618fc29467fe8a0ff63e599239a1324e` |
| @unofficial-krds/styles | `35d5f49e184f086f76612a0d1831039969df3154c7dc153df07c2a0a1a92e56b` |
| @unofficial-krds/svelte | `0f7c3d8b8d103618d440436ee16399004cc3566d9b14232f1a81069927242c27` |
| @unofficial-krds/tokens | `c8d5a61dc631e1d2c2117c78b53140dc5d62c8b4db8919acc0fcab1608f094e9` |
| @unofficial-krds/vue | `3fa27abe46f2378403c8abecb34a90930a816723afb2b4218427ac418458144e` |

Separately retained Solid SSR repair: `artifacts/debug-updates/solid-ssr-repair.tgz`, SHA-256 `f5cd86e1ff3c7a69ebff5ef7442d6350133897ff4795e3c42149d494e51bb234`. Every other candidate remains byte-identical to the original inventory.

| Matrix | Result and evidence |
| --- | --- |
| React, Svelte, Vue, Lit, Qwik, Angular minimum/current; exact Solid 2 rc.19 | 13/13 positions pass install, installed-byte/resolution proof, types, client build, SSR render, click and keyboard interaction. `artifacts/consumers/<id>-<profile>.json` plus referenced logs. |
| Original Solid 1 minimum/current | Both correctly fail SSR: client-compiled public button invoked server-incompatible `template`; client browser click/Enter still passed. Preserved `artifacts/consumers/solid-*.json`. |
| Repaired Solid 1 minimum/current | Both pass all checks against the separately retained tarball. `artifacts/consumers/solid-ssr-repair-v2/solid-*.json`, aggregate `artifacts/debug-consumer-results-solid-solid-ssr-repair-v2.json`. |

`artifacts/debug-consumer-results.json` preserves the original fifteen-position matrix with thirteen passes and the original two Solid failures. Repaired rows are intentionally separate; no mixed-inventory result claims a final candidate. All positive rows include independent lock hashes, actual runtime/compiler versions and outside real paths, zero external browser requests, and candidate inventory hashes. Stable minimum/current bounds coincide at the exact versions selected by frozen official metadata; these runs do not widen peers.

## Verification and failures retained

- Fresh `node tools/yarn.mjs exec node --test tests/consumers/pipeline.test.mjs`: 4 passed, 0 failed (internal range mismatches/overrides, unsafe tar paths/symlinks, stale source evidence, debug inventory rejection). Syntax checks passed for the three tools and helper/template modules.
- Both actual thirteen-package inventories were re-inspected after the final native public-type checks: 13/13 each. A deliberate missing preview tarball passed scoped stable inspection (12 packages) and failed full inspection with ENOENT.
- The first two real all-thirteen pack attempts wrote actual tarballs/NDJSON, then failed the live-source fingerprint check. No final `artifacts/manifest.json` was created. Default packing now fails with the exact missing public-build-attestation diagnostic; default inspection fails on absent final manifest. These are required fail-closed results.
- Original React tarball contains stale `dist/WorkspaceProbe.d.ts` and `.map`; controller routed cleanup to its owner. Final inspector rejects stale probe payloads.
- Consumer setup errors were resolved with evidence: Yarn mirror/global-index paths moved to temporary cache; offline non-workspace resolution seed avoids new network resolution; CSS ambient declarations and Vue default subpath import match consuming tools; Angular noEmit:false was confirmed by a single-variable existing-install build changing failure into one prerendered route; Solid consumer compiler SSR option enabled after the package repair exposed a separate consumer JSX default. Intermediate failures remain retained.
- Sandboxed localhost listen failed with EPERM. Narrowly escalated local consumer commands were automatically approved and actual browser checks then passed. No automatic approval rejection occurred.

- Final fresh `node tools/yarn.mjs verify:licenses` exited 1 with `ENOENT: apps/storybook-angular/dist/_legal/index.html` after the live notice verifier began requiring app legal outputs. Earlier pack attempts verified 1,599 records and thirteen package notice sets successfully. This current app-output integration blocker was sent to the controller; no T14-owned source can repair it.

## Remaining controller integration

1. Wait for all public implementation sources/notices to freeze, then run `node tools/yarn.mjs pack:all --build` in the serialized window. This must create current build attestation and final thirteen-package manifest and expose any remaining native build/pack issues.
2. Run default `inspect:tarballs` and a fresh default all-framework `test:consumers` against that exact final manifest. The debug evidence cannot satisfy these gates. T15 CI and T16 release-verifier owners have the required interfaces and schemas.
3. Controller-owned independent review remains required. Scope/account ownership and repository ownership/publish authorization remain unresolved release gates; local verification does not authorize publication.

## Source SHA-256

| File | SHA-256 |
| --- | --- |
| `tools/pack-all.mjs` | `6d0f561898555de17d3bf1d917856fa869e1becdc530c8cf7a22155e4b667a2f` |
| `tools/inspect-tarballs.mjs` | `bacdddd31786321f6d074dfb4837f9638a734a7cc5e3e038a444ada794a28dd6` |
| `tools/test-consumers.mjs` | `cf6bd71acf92cce81e26b1be6c336e93606f9a375fae34651352c1d746b9ccb8` |
| `tests/consumers/lib.mjs` | `f816b8f804909459ba2a090484e21374d9647649b533102cd149611a5474ab0c` |
| `tests/consumers/pipeline.test.mjs` | `f0c63b03f074d97d3ca735577d69500695f27a2f1e25a912aa8ad9b2a17d2b98` |
| `tests/consumers/README.md` | `4710794ba1821193aa38d1035e807266a4762e1fd46f32b517c7ceaf391e2925` |
| `tests/consumers/templates/index.mjs` | `d0ac4b0c828efc7f81dbe95f48ba808cee70971acf701e6bfde5bf8d3a951920` |
| `tests/consumers/templates/browser.mjs` | `e561a4960b790ccfc95ba82e18043020b72e8d17e4945924e198cb20cb034930` |
| `tests/consumers/templates/resolve.mjs` | `9950b48ea1a6c9c0c5b436d46c60393a45be02577c8bb963b73acc81995d7db4` |
| `tests/consumers/templates/bundle-evidence.mjs` | `b969cd1f211eca68b11b893599b4c8dff78591554a719f080e0faff46b24872d` |
