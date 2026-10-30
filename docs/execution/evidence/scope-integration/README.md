# Scope integration — durable approved checkpoint

Independent scope review: **PASS, no unresolved material findings**. The atomic rename to `@unofficial-krds` and user-supplied repository metadata are locally complete.

- [Execution report](task-scope-integration-report.md), [independent review](task-scope-integration-review.md), [T03 compliance/pack supplement](task-scope-compliance-report.md).
- Canonical renamed Solid checks: **77/77 siheom, 10/10 production contracts, 6/6 canonical stories**, raw axe and forbidden-request findings **0**. Raw reports/logs are in `scope-integration-logs/candidate-*` and the command logs. These are the selected namespace-regression checks, not another full native/platform acceptance.
- **13/13 actual tarballs**, **60 packed export/entry checks**, and normal local license checks for **1,599 records / 13 notice sets** pass. Exact tarball copies are in [pack-artifacts](pack-artifacts/index.json), with original paths and SHA256; legal source conditions and the completed independent MIT grant are preserved.
- Frozen authored source: [135-path v2 hash/byte manifest](scope-integration-logs/authored-source-snapshot-v2-final.json), [complete raw final diff](scope-integration-logs/authored-full-final.diff), [v2 supplement](scope-integration-logs/authored-v2-supplement.diff). Original v1/before bytes remain available. T03 retains its own 98-artifact inventory and 43-file owned diff separately.
- Dependency proof: **1,878 npm artifacts + 5 patched resolutions + 32 renamed local workspaces = 1,915**; all 1,544 recorded npm checksums unchanged. [Exact comparison](scope-integration-logs/lock-comparison.json). Final integration lock SHA256: `fb40749425ddd90ce46937551ae72c63d4bdf7caa53706edf073f4ccc69b0b58`.
- [Pre-native baseline map](native-baselines/native-baseline-map.json) and [context guide](native-baselines/README.md) point to preserved T01 full library additions, raw T05 app bases, reviewed T05 deltas and scope raw snapshots.

The reviewed checkpoint is defined by the immutable captured bytes and tarballs. Later native workers were released after capture and may legitimately change current workspace files; those later implementations are not folded into this metadata-only approval. Historical commands/old scope names and absolute local paths in original reports remain original. This archive keeps local-path references and provides durable copies/mappings rather than rewriting reviewed reports.

This transition awards **zero catalog coverage**. It does not assert full browser/SSR/manual-accessibility/release readiness or authenticate npm/repository ownership. Publication, commits, push and tags remain unauthorized. No tests/builds/installs were repeated during archival. Captured one-time mutation scripts are evidence, not instructions to rerun against the current state.

`ARCHIVE-MANIFEST.json` records every durable file SHA256/size; its own hash is in `ARCHIVE-MANIFEST.sha256`.

`CAPTURE-PATH-MAP.json` maps original local capture paths to durable paths without modifying reviewed snapshot JSON. In the scope archive, `RUNTIME-REPORT-PATH-MAP.json` additionally maps the three original unique test-results roots to their copied result trees.
