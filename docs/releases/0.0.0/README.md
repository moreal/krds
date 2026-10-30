# Intermediate candidate handoff

This is actual local development version `0.0.0`, not a published or ready release. `verification.json` and `verification.exit-code.txt` preserve the latest actual result. A blocker report never completes T16.

Use Node 24.18.0 and vendored Yarn 4.14.1 through `node tools/yarn.mjs`. The verifier reads evidence without launching native/build/browser jobs. The controller owns the frozen producer order and leases in `.github/workflows/release-prepare.yml`.

M1 uses twelve stable/shared artifacts and fourteen minimum/current consumers. M2 uses six preview/shared artifacts and the exact RC19 consumer. M3 additionally requires all thirteen packages and fifteen consumers, licensing/provenance, ownership, prepared versions/changelogs, exact CI handoff and all review/manual requirements. No publication, push or tag is authorized.

The verifier checks current source blobs against the real HEAD, rejects tracked changes/deletions and untracked source, and does not invent an uncommitted version-plan transformation. Current HEAD remains unborn. Diagnostic content hashes cannot replace a candidate commit.

The existing comprehensive coverage gate validates the 378 stable pairs. T13 matrices use exactly one newest relevant run; failed/stale/unfinished current runs do not fall back. Complete current inventories include actual source-bound retained stage files and metadata collected by T13, rather than guessing outputs from workspace `dist/` alone. Selected Node executable/version, exact argv, original command logs and all nine required browser/timezone outcomes are checked.

T14 tarballs are actually unpacked. The verifier rejects altered/truncated declared file inventories or packed manifests, then forwards the recomputed canonical package records to exact installed-byte validation. Debug and legacy receipts cannot pass. Stable/preview source, build, artifact and consumer bindings remain independent.

The former generic asserted-row protocol is replaced by [release evidence v3](../../../tools/release-evidence/README.md). Concrete parsers/recorders validate actual native patterns, documentation, preview, hosted CI, independent review and explicitly attested human sessions against the same candidate. Missing genuine recordings remain blocked; required adapters no longer permanently return unsupported. No complete accepted index, manual session or hosted CI execution was generated here. Recorder description was tested; unleased native/browser/build execution was not launched.

Authentic screen-reader speech, original-media/sign-language equivalence, real zoom, forced colors and focus visibility need the named human's performed observations and bound original support. Screenshots, synthetic media, a present application and generic `passed` flags cannot substitute. No new signing or enrollment requirement exists.

The fix1 count erratum is explicit: the named two-file consumer-interface command produced eight tests, not nine. The separate retained-installation probe was not part of that command. Original fix1 bytes/hashes remain archived in `.superpowers/sdd/PLAN/task-T16-fix2-base/`; current counts are extracted from actual stdout.

Current package/version/environment/hash and remaining gates are in [verification.json](./verification.json), [compatibility.md](./compatibility.md), [licenses.md](./licenses.md) and [release-summary.md](./release-summary.md). Even a zero future verifier exit grants no external publication permission.
