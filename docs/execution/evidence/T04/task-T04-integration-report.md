# T04 shared PostCSS/lockfile integration

Status: complete. No changes to the active styles manifest, source implementations, compliance records, or existing dependency/version selections. No subagent or commit was created.

## Exact mutations

- `yarn.lock`: intentionally refreshed with selected Yarn 4.14.1 after the T04 owner added exact `postcss: 8.5.32` to `packages/styles/package.json` devDependencies. PostCSS was already present transitively; no resolved package/version set changed.
- `compatibility/evidence/postcss-8.5.32.json`: exact successful JSON response bytes from `https://registry.npmjs.org/postcss/8.5.32`; no fabricated/cache-only status. The initial sandbox request failed DNS; the approved registry request succeeded.
- `compatibility/toolchain.json`: appended only `sharedPins.postcss = "8.5.32"` and `publishedPackages["postcss@8.5.32"]` containing the published package/dependency/engine/license/gitHead/dist metadata and local evidence hash/status/retrieval URL/time. An in-memory equality assertion proved that removing these two additions yields the entire previous parsed toolchain unchanged.
- `.superpowers/sdd/PLAN/task-T04-integration-report.md` and local evidence logs under `.superpowers/sdd/PLAN/t04-integration-logs/`: this handoff.

No root manifest, runtime resolution, other dependency, checker implementation, or compliance file was changed. The existing workspace checker accepts the newly declared direct dependency without modification; the focused direct-resolution check additionally verifies that the selected shared pin, manifest exact version and installed package all agree.

## Commands and actual outputs

All Yarn commands use `node tools/yarn.mjs`, which executes vendored Yarn **4.14.1** under the selected **Node 24.18.0**, with the selected Node directory first on child PATH.

| Command | Actual result | Evidence |
| --- | --- | --- |
| Python urllib fetch of `https://registry.npmjs.org/postcss/8.5.32` | Initial sandbox request failed DNS; approved retry exit 0, exact name/version asserted before saving response bytes | `registry-fetch.log`, `registry-fetch-approved.log`, `registry-fetch.json` |
| `node tools/yarn.mjs install` | Exit 0, **5.291s**; no packages fetched/added, retained pnpm linker | `install.log` |
| `node tools/yarn.mjs install --immutable` | Exit 0, **5.264s**, unchanged resulting lockfile | `install-immutable.log` |
| `node tools/yarn.mjs node --input-type=module` with focused assertions | Exit 0; direct styles manifest, shared pin, installed PostCSS and evidence version all **8.5.32**; registry dist integrity matches toolchain record; actual PostCSS parser parsed a CSS declaration | `postcss-direct-resolution.log` |
| `node tools/yarn.mjs verify:workspace` | Exit 0; selected pins, pnpm linker, private apps, metadata and dependency/import boundaries verified | `verify-workspace.log` |
| Python SHA256 / sorted-resolution-set comparison | Exit 0; exact lock SHA changed, all **1915** resolved package identifiers unchanged; zero additions/removals | `lock-before.json`, `lock-after.json`, `lock-delta.json`, `lock-delta.log` |

Direct-resolution output:

```text
Node 24.18.0; styles direct PostCSS 8.5.32
Resolved entry: /Users/moreal/github/moreal/krds/node_modules/.store/postcss-npm-8.5.32-ab11640221/package/lib/postcss.js
Exact direct manifest, selected pin, registry integrity record, and real CSS parse verified.
```

Workspace verification output:

```text
Workspace verified: selected pins, pnpm linker, private apps, package metadata, dependency/import boundaries.
```

Focused direct-resolution assertions used `createRequire(resolve('packages/styles/package.json'))`, required `postcss/package.json` and `postcss` through the styles workspace's own symlink context, compared version 8.5.32 against both local manifest and selected shared pin, checked the selected registry integrity record, then ran `postcss.parse('.workspace-probe { color: red; }')` and asserted its declaration property is `color`.

## Published evidence

- Status: `retrieved-registry-manifest`.
- Registry URL: `https://registry.npmjs.org/postcss/8.5.32`.
- Retrieved at: `2026-10-30T00:34:02.000538+00:00`.
- Exact response SHA256: `9a29a73945980f4c243743e34b01fac170a2679ba9e1ca42f02c39d52ac0eddc`.
- Published tarball: `https://registry.npmjs.org/postcss/-/postcss-8.5.32.tgz`.
- Published npm SRI: `sha512-LJlKCCAUFKOuZxipUdYw1NzIITEsPcgyOG9LkvRJvuKj/bRzbuRY0ARXvL0pWGpsZvn8jku+LMep2eU0seHp8g==`.
- License: `MIT`; engine requirement `^10 || ^12 || >=14` includes selected Node 24.18.0.

## Lock fingerprint handoff for T03 owner

```json
{
  "oldLockSha256": "361bbaa310756b89004e9e945985dbe5c0812ffaac93d064548db27438a46d7c",
  "newLockSha256": "3e5cd9db6ab945332185dac797415a87e7a4426b8c873b3e8558612be56e7e0b",
  "oldResolutionCount": 1915,
  "newResolutionCount": 1915,
  "oldResolutionSetSha256": "a4567b92b66cd95a3e38b7cbe1cbcebe1ec6c2d1c166f0549478d2e68d85141c",
  "newResolutionSetSha256": "a4567b92b66cd95a3e38b7cbe1cbcebe1ec6c2d1c166f0549478d2e68d85141c",
  "addedResolutions": [],
  "removedResolutions": []
}
```

Resolution-set digest is SHA256 over the sorted unique exact `resolution:` field values from Yarn's lockfile, joined by LF with one final LF. The resolution lists are preserved in `lock-before.json` and `lock-after.json`, so the no-addition/no-removal result is reproducible.

The previous compliance/source-inventory lock fingerprint is now stale. **Compliance was deliberately not edited.** The exact old/new fingerprint and unchanged resolution result were sent to the controller for the T03 owner to refresh.

No broad root test suite, Angular build, dependency expansion, native integration suite or publishing operation was run. Existing dependency-level peer warnings and Yarn's pnpm workspace-peer informational message remain unchanged; no warning/resolution suppression was introduced.
