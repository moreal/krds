# Scope integration — compliance and notices

Status: complete for the approved atomic scope handoff. T01 rebuilt the required foundations/Solid/APF outputs; this owner verified current licenses, captured the compliance/package-metadata snapshot, and inspected 13 actual new-scope package tarballs. The controller and T01 were promptly notified that the existing-export/dist hold could be released. This is scoped migration/pack evidence, not full native support or M3 release acceptance.

## Authorized scope transition

Current project identity now uses `@unofficial-krds`, matching the approved requested scope. Identity records the applied source/manifest/lock/provenance/notice transition and T01's verified production rebuild/typecheck handoff. Scope/account ownership and repository ownership remain unverified; publication authorization remains false. The previously completed `Copyright (c) 2026 Lee Dogeon <dev.moreal@gmail.com>` MIT grant is unchanged. Historical `compliance/metadata-evidence.json` remains the unchanged dated record of the earlier naming decision and staged transition.

Only 16 provenance records required target-name changes: 18 `distributedIn` references changed from `@krds-native/` to `@unofficial-krds/`. A complete byte reversal of that prefix mapping reproduces the original provenance bytes, and parsed equality confirmed every other source/copyright/license/hash/retrieval/modification field unchanged. No unresolved record received a distribution target. Physical asset/source/output paths did not change.

Dependency inventory changed only its `lockfileSha256`, from `136bebc1c213d0bc274b905ee291fa096beefa4dbbaece6ecf915689adadf4f4` to `fb40749425ddd90ce46937551ae72c63d4bdf7caa53706edf073f4ccc69b0b58`. All other inventory bytes, including original retrieval metadata, are unchanged.

## Independent lock proof before refresh

Compared the actual current lock with T01's frozen original and final snapshots at `scope-integration-logs/lock-baseline.frozen.json` and `lock-after.json`.

- 1,915 total resolution identifiers; all identical after reversing only the approved scope mapping on 32 workspace identifiers.
- 1,878 exact npm artifacts unchanged. Sorted normalized set SHA-256 remains `f28e41b5d8c47cdb1df7a23c5a52fa3f619643cefabf06235114e4d98a6fe4f3`, and the actual set equals all existing dependency inventory package/unfetched entries.
- Five patch identifiers and all 1,544 npm checksum records independently parsed from actual lock bytes match both frozen and final snapshots.
- No new external source, dependency version, rights clearance or upstream condition is asserted by the workspace-name transition.

Evidence: `scope-compliance-logs/apply-scope-compliance.log`, `scope-comparison.json`, and replayable `apply-scope-compliance.py`. The script is a one-time integration mutation and deliberately asserts the old fingerprint before writing; do not rerun it against the already-updated state.

## Source-input handoff

`node tools/yarn.mjs generate:notices` passed: 13 public package notice sets generated from 1,599 provenance records using the new package names. T01 received the legal/source-input-stable signal before beginning its production rebuild checks. This owner held package commands and final inventory until T01 confirmed rebuilt stable outputs. The controller then prioritized immediate snapshot/pack capture while new native workers were still restricted to NEW-only source files. No package builder was run by this owner.

The unchanged historical metadata evidence, complete MIT grant and official upstream manifest were SHA-256 checked after mutation. Their protected fingerprints are in `scope-compliance-logs/protected-hashes.json`. Exact pre-integration bytes for 85 owned compliance/generated artifacts are in `scope-compliance-logs/before/` and `before-index.json`.

No root manifest, lockfile, runtime source, package source wrapper, original upstream document, government/third-party copyright, or historical evidence was edited by this compliance owner. No subagent, Git commit, push, tag or publishing action occurred.


## Final rebuilt-output, snapshot and pack evidence

T01 supplied the stable production handoff: contracts/tokens/styles/assets/fonts/test-contracts, Solid and Angular APF builds/typechecks passed; Solid fixture and Storybook production builds/typechecks passed; no generated-wrapper or lock drift. Its final immutable authored-v2 snapshot contains 135 paths (`scope-integration-logs/authored-source-snapshot-v2-final.json`), with the append-only current progress note outside package payload; the prior 134 authored paths remain the package/source freeze boundary. No broad native or duplicate unit suite was run here.

| Owned check | Actual result | Evidence under `scope-compliance-logs/` |
| --- | --- | --- |
| `node tools/yarn.mjs verify:licenses` against rebuilt outputs | **Exit 0**, 1,599 source records and 13 package notice sets; existing scope/publish authority and repository ownership categories remain separate | `verify-licenses-built.log` |
| Final identity integration-label update | Applied verified T01 source/build handoff; requested/current scope agree; no ownership or publication flag changed | `after/compliance/project-identity.json` |
| Current compliance and package-metadata snapshot | **98 artifacts = 85 owned compliance/generated artifacts + 13 read-only public package manifests**; 43 owned files changed from the frozen before set | `current-owned-and-package-inventory.json`, `changed-owned-inventory.json`, `owned-unified.diff`, `before/`, `after/` |
| For each public package: `node tools/yarn.mjs workspace <@unofficial-krds/name> pack --out /private/tmp/krds-scope-pack/<name>.tgz` | **13/13 actual packs passed**; each tarball opened and inspected | `pack-current.log`, `pack-results.json`, replayable `pack-current.py` |
| Immutable tarball export/entry audit | **13/13 passed, 60 export/entry target checks**; targets including patterns select files actually present, no old scope in packed runtime package metadata | `packed-export-audit.log`, `packed-export-audit.json` |

Each actual tarball has the new exact package name, user-supplied repository URL `https://github.com/moreal/krds` and correct package directory; full root legal files match current workspace bytes; all `LICENSES/` files match their declared sources; all 13 contain the unchanged completed MIT grant and omit the old incomplete intent file. All declared material paths selected by actual package `files` roots were compared to current workspace bytes, and unmodified icon/font material also matched its preserved original SHA-256. Material-path checks can repeat across original-source records; they are not asserted as a unique catalog-coverage count.

Source records in actual packs are limited to assets (eight icons), fonts (three originals), tokens (three source records) and styles (four source records). Other packages retain independent-code notices and external-dependency boundaries. Actual tarball hashes, per-package manifest hashes and captured times are recorded in `pack-results.json`; the artifacts remain at `/private/tmp/krds-scope-pack/`. These immutable tarballs, rather than mutable later dist/source output, define this handoff evidence.

The final owned changes are exactly current identity scope/status metadata, main provenance distribution-target names, inventory lock fingerprint, and deterministic package notice/header/provenance-name updates. Source license text, MIT grant, physical paths, original source hashes/conditions and historical metadata evidence are unchanged. No release ownership proof is invented. T01 owns its current manifest/repository/source/import changes and completed append-only progress update; those edits are not attributed to this compliance task.

The pack/snapshot gate was explicitly released to the controller/T01 immediately after capture so new framework workers could modify existing exports/builds. Only report/read-only immutable-artifact audit work followed that release. No source, manifest, lock, builder or repeated pack command was run afterward. Later native work may legitimately change mutable workspace outputs; it does not change the captured scope snapshot or archived tarball evidence. No npm publication, account write, commit, push, tag or subagent action occurred.

T01 final handoff also reported the read-only Solid canonical checks passing **77/10/6**, and saved `authored-v2-supplement.diff` for the final progress addition. This owner did not rerun those native suites. The final lock remains the recorded `fb407494…69b0b58`; no further integration source/lock/dist mutation is planned.
