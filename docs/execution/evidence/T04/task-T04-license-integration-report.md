# T04 license inventory fingerprint integration

Status: complete for this narrow handoff. T04 may resume provenance/notices writes. No new source, dependency resolution or rights claim was introduced.

## Exact change

Only `compliance/provenance-dependencies.json` → `lockfileSha256` changed:

- Previous: `361bbaa310756b89004e9e945985dbe5c0812ffaac93d064548db27438a46d7c`.
- Current: `3e5cd9db6ab945332185dac797415a87e7a4426b8c873b3e8558612be56e7e0b`.
- Inventory file SHA-256 before: `0bdb1c73fcb182962de7b78144c5b6146851f2cb401c30fcc4d93c08cdd29077`.
- Inventory file SHA-256 after: `bb9dc073259b22c987f9c476122afbeba9b2f78d9ea7dae91754b993572f9d72`.

An in-memory equality assertion proved that replacing the new fingerprint with the previous value yields the entire previous parsed inventory. Existing source metadata, license documents, rights status, original retrieval timestamps and all package records were preserved. The original `retrievedAt` remains `2026-10-30T00:10:08.665961+00:00`; this refresh is not represented as a new upstream retrieval.

## Independent comparison before refresh

Read `task-T04-integration-report.md` and its original `t04-integration-logs/lock-before.json` snapshot, then parsed the actual current `yarn.lock` independently.

| Set definition | Actual count | SHA-256 of sorted unique values joined by LF plus a final LF | Result |
| --- | ---: | --- | --- |
| Every exact Yarn `resolution:` field value, retaining the original quoting | 1,915 | `a4567b92b66cd95a3e38b7cbe1cbcebe1ec6c2d1c166f0549478d2e68d85141c` | Equal to every original T01 snapshot member; additions/removals empty |
| Compliance normalized exact npm resolutions, using the verifier's virtual normalization | 1,878 | `f28e41b5d8c47cdb1df7a23c5a52fa3f619643cefabf06235114e4d98a6fe4f3` | Equal to every existing inventory package/unfetched resolution; additions/removals empty |

These counts use different definitions; neither changed. The actual lockfile fingerprint also matched T01's reported new SHA before the inventory was edited. The already-inventoried `postcss@8.5.32` source manifest and full license document remain sufficient for this integration.

## Focused commands and results

1. Python SHA-256/JSON/Yarn-resolution assertions against the current lock, original T01 full-resolution snapshot and existing compliance normalized set: **passed**. Only after both sets matched did the script refresh the fingerprint. Evidence: `t04-license-integration-logs/fingerprint-refresh.log` and `fingerprint-refresh.json`.
2. `node tools/yarn.mjs node --input-type=module` with focused post-refresh assertions: **exit 0**, selected Node **24.18.0**. Rechecked the current lock fingerprint, all **1,878** normalized npm inventory resolutions, and the existing PostCSS source manifest plus **one full license document** hash. Evidence: `t04-license-integration-logs/inventory-verify.log`.

Full `verify:licenses` is left to T04 after its new derived-path mappings and notices are ready; no global license-pass claim is made by this inventory-only handoff. No broad suite, native/Angular build or pack inspection was run. No root manifest, lockfile, toolchain, implementation source, derived mapping, package manifest, source/rights record or notice was edited by this task. No subagent, commit, push, tag or publishing action was performed.
