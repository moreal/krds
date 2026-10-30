# T05 license inventory fingerprint integration

Status: complete. Independently verified the latest final lock and unchanged resolution sets, refreshed only the inventory lock fingerprint, and passed local license verification. No source, dependency version, distributed material or rights claim was added.

## Exact change

Only `compliance/provenance-dependencies.json` → `lockfileSha256` changed:

- Previous pre-T05 fingerprint: `3e5cd9db6ab945332185dac797415a87e7a4426b8c873b3e8558612be56e7e0b`.
- Latest final fingerprint: `136bebc1c213d0bc274b905ee291fa096beefa4dbbaece6ecf915689adadf4f4`.
- Inventory file SHA-256 before: `bb9dc073259b22c987f9c476122afbeba9b2f78d9ea7dae91754b993572f9d72`.
- Inventory file SHA-256 after: `3e6d1e8c7321110cf407e29ede7a94e9bb75cb328d41a68918e88923fdf0a2fb`.

The intermediate `8b457…` lock was not accepted as the candidate. The exact final SHA above was asserted against both actual lock bytes and T01's latest `lock-after.json` before mutation. An exact byte replacement preserved every other inventory byte; reversing that fingerprint substitution reproduces the original inventory bytes. A parsed equality assertion also confirmed all other fields unchanged. Original license/source hashes, records and `retrievedAt: 2026-10-30T00:10:08.665961+00:00` remain intact.

## Focused proof and commands

Read `task-T05-integration-report.md`, then independently parsed the actual `yarn.lock` and compared it against original pre-T05 `t05-integration-logs/lock-before.json`, latest `lock-after.json`, and the existing compliance inventory.

| Check | Actual result |
| --- | --- |
| All literal Yarn `resolution:` field values, retaining quotes | **1,915**, identical to both original and latest T01 sets; no additions/removals |
| Full resolution-set SHA-256 (sorted unique values, LF, final LF) | `a4567b92b66cd95a3e38b7cbe1cbcebe1ec6c2d1c166f0549478d2e68d85141c` |
| Normalized npm resolution set using the compliance verifier's virtual normalization | **1,878**, identical to every existing inventory package/unfetched record; no additions/removals |
| Normalized npm set SHA-256 (sorted unique values, LF, final LF) | `f28e41b5d8c47cdb1df7a23c5a52fa3f619643cefabf06235114e4d98a6fe4f3` |
| Python comparison and exact fingerprint-only byte mutation | Passed; all assertions ran before writing the new fingerprint |
| `node tools/yarn.mjs verify:licenses` after refresh | **Exit 0**: 1,599 source records and 13 public package notice sets verified |

Evidence is in `t05-license-integration-logs/fingerprint-refresh.log`, `fingerprint-refresh.json`, and `verify-licenses.log`.

The local verifier continues to report unresolved scope/publish authority, independent-code holder, published repository ownership/URL, incomplete independent-code policy/grant, and incomplete/disagreeing independent-code notices. Its local success does not authorize a release or publication.

No full suite, native/Angular build, pack, source collection, root/config/lock edit, package/public-distribution edit, source/license/rights record edit, subagent or Git commit was performed. This report and the three evidence files are the only additional artifacts besides the inventory fingerprint update.
