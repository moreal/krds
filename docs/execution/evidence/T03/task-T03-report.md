# T03 execution report

Status: implemented for local development; ready for controller-owned independent review. Selected distributed assets have verified source/terms records and package-local notices. Publication remains blocked by the unchanged project identity record and release authorization boundary. No commit, push, tag or publishing action was performed.

## Exact deliverable inventory

The complete path/byte-count/SHA-256 inventory is `t03-logs/owned-file-inventory.json`: 3,292 source and generated notice artifacts, 16,806,385 bytes. It intentionally excludes build outputs, this report, the inventory itself and execution logs. Each source document and copied material also has its own preserved provenance hash.

- Root policy/notice documents: `LICENSE.md`, `ATTRIBUTION.md`, `THIRD-PARTY-NOTICES.md`.
- `LICENSES/`: 1,600 original license/notice/policy documents and the explicitly incomplete independent-code MIT intent text. Exact package-source documents preserve their original copyright and wording; originals were not replaced by generic SPDX templates.
- `compliance/provenance.json`: exact PLAN 9.7 `ProvenanceEntry[]`, 1,599 entries: 1,520 verified and 79 unresolved. Kinds: 1,577 package records, 11 assets, 8 repository files, 3 web documents. Every unresolved entry has an empty `distributedIn` array.
- `compliance/provenance.schema.json`, `compliance/license-policy.json`: required fields, whitespace rejection, conditional verified rights/full-terms/evidence requirements, explicit metadata-absence notes, unresolved-distribution prohibition, local KOGL reference, ISC discrepancy, source document hashes, policy relationship and exclusion rules.
- `compliance/provenance-package-sources.json`: 105 frozen exact published metadata sources. 81 license collections came from integrity-checked exact tarballs; 21 came from each published version's recorded repository commit/tag; 3 have no preserved complete original license and remain unresolved for copying/bundling. The 105 include selected installed versions, the selected vendored Yarn, pinned KRDS source package, and five explicitly marked unselected candidates; they are not all claimed as runtime dependencies.
- `compliance/provenance-dependencies.json` and `compliance/provenance-dependency-manifests/` (1,570 unmodified original manifests): all 1,878 exact npm lock resolutions are inventoried. 1,570 have local cache source metadata; 308 platform-conditioned resolutions not fetched on this host are explicitly listed with conditions, unresolved rights and empty distribution lists. Their unknown original package/license metadata is not fabricated. Inventory drift against the sole `yarn.lock` fails verification.
- `compliance/provenance-asset-sources.json`, `compliance/provenance-font-package.json`, `compliance/provenance-font-tree.json`: exact official source URLs, commit, original paths, SHA-256, retrieval times and selected Git blob hashes. Only original tree entries for selected GOV source files are retained; the compact tree record does not claim to be a full repository snapshot.
- `tools/generate-notices.mjs`, `tools/verify-licenses.mjs`, `tools/tests/notices.test.mjs`.
- `packages/assets/src/index.ts`, `packages/assets/README.md`, `packages/assets/icons/`: eight official unmodified generic KRDS SVGs: `ico_close.svg`, `ico_sch.svg`, `ico_plus.svg`, `ico_calendar.svg`, `ico_download.svg`, `ico_information.svg`, `ico_angle.svg`, `ico_checkbox_checked.svg`. Source commit: `d6bb184c823e4757f05807ea4646a23e3133b6e6`. All eight source blobs and SHA-256 values were checked; each SVG was inspected for external references, scripts, institutional identity, third-party brands and conflicting file notices. No such content was found. `krdsIconUrls` exposes local URLs; `InstitutionIdentity` describes consumer-supplied identity without inventing an institution.
- `packages/fonts/src/index.ts`, `packages/fonts/README.md`, `packages/fonts/fonts.css`, `packages/fonts/fonts/`: official full Regular/Medium/Bold WOFF2 files from Pretendard GOV 1.3.9 at commit `7aeb0698819be2b4097dae8ec8fe6a795e5cf3ae`. Source Git blobs, WOFF2 headers and SHA-256 values were checked. No subset, conversion, glyph removal, rename or metadata edit occurred. CSS uses local relative URLs. Full original SIL OFL 1.1 and copyright/RFN notices are preserved, including RFNs `Pretendard GOV`, `Source`, `Inter`, `M PLUS 1`.
- Public `package.json` legal `license`/`files` fields and generated package-local `LICENSE.md`, `LICENSES/`, `ATTRIBUTION.md`, `THIRD-PARTY-NOTICES.md`, `provenance.json` for all 13 public packages: angular, assets, contracts, fonts, lit, qwik, react, solid, solid-next, styles, svelte, tokens, vue. There are 27 package-local license documents. Assets/fonts also replace bootstrap API probes, expose their actual local files through exports/files, update descriptions and use the license verifier as their package test. No dependency versions changed.

The controller's sole root integration owner added `generate:notices`, `verify:licenses`, `test:notices`; T03 did not edit the shared root manifest, lockfile, T02 contracts/catalog/specs, frozen upstream inputs, or project identity record.

## Behavior and source boundaries

Only `@krds-native/assets` (eight icons) and `@krds-native/fonts` (three font files) have distributed third-party materials at this snapshot. Notices include precisely those assets and their full relevant terms. External runtime/development tool inventory is separate from copied/bundled material. An unused external dependency's license is not copied into an adapter's package notices.

The controller's T02 owner confirmed that contracts runtime/type sources are independent API/validation code; KRDS catalog identity metadata and paraphrased specifications stay repository-only, outside contracts packaging. No extra distributedIn target was added for contracts.

KRDS README/pinned package.json discrepancy is retained with exact commit and source paths. The implementation does not assert ISC/KOGL dual licensing or that one document always legally overrides another. Generic inspected KRDS assets use verified official KRDS and KOGL Type 1 attribution conditions. `LicenseRef-KRDS-KOGL-Type-1` is explicitly a local reference, not an official SPDX ID.

Original complete English KRDS policy and the complete KOGL license-policy page were preserved. T00's inaccessible Korean dynamic policy body remains an unresolved reference record; it is not represented as verified text. Missing original web versions/material-specific copyright are null with evidence and absence notes; website footers are not assigned as individual-file copyright. This metadata absence is distinct from unresolved permission.

Original KRDS JavaScript remains local reference evidence and is neither distributed by these packages nor executed alongside Ark/Zag. Institutional logos, official service identities, third-party social/application brand marks and the unverified KRDS kit font subsets are excluded. Official full GOV fonts provide the local alternative.

## Verification commands and results

All JavaScript execution used the selected launcher. Recorded versions: `node tools/yarn.mjs node --version` → `v24.18.0`; `node tools/yarn.mjs --version` → `4.14.1`.

| Command/check | Result | Evidence |
| --- | --- | --- |
| `node tools/yarn.mjs node --test tools/tests/notices.test.mjs` before tools existed | RED: 9/9 failed for absent implementation | `t03-logs/notices-red.log` |
| Added untracked shipped payload test, before general package-file scanning | Meaningful RED: 11 passed, 1 failed because an undeclared shipped binary incorrectly succeeded | `t03-logs/notices-red-shipped-payload.log` |
| Added stale inventory test, before inventory validation | Meaningful RED: 13 passed, 1 failed because a changed lockfile incorrectly succeeded | `t03-logs/notices-red-stale-inventory.log` |
| `node tools/yarn.mjs test:notices` | GREEN: 14 passed, 0 failed | `t03-logs/notices-green.log` |
| `node tools/yarn.mjs workspace @krds-native/assets build:local` | Passed | `t03-logs/assets-build.log` |
| `node tools/yarn.mjs workspace @krds-native/fonts build:local` | Passed | `t03-logs/fonts-build.log` |
| `node tools/yarn.mjs generate:notices` | Passed: 13 public package notice sets | `t03-logs/generate.log` |
| `node tools/yarn.mjs verify:licenses` | Passed: 1,599 source records, 13 package notice sets; reports outstanding identity gates | `t03-logs/verify.log` |
| `node tools/yarn.mjs node tools/verify-licenses.mjs --release` | Expected failure: scope/publish authority, independent-code holder, published repository ownership/URL | `t03-logs/release-gate.log` |
| For every public package: `node tools/yarn.mjs workspace <name> pack --out /private/tmp/krds-t03-pack/<package>.tgz`, then Python tarfile inspection | 13/13 passed; root legal files and all LICENSES bytes matched actual sources; all 11 shipped assets existed and matched recorded SHA-256 | `t03-logs/pack.log`, `pack-fonts-final.log`, `pack-results.json` |
| `node tools/yarn.mjs test` | Broad root suite: Nx 52 tasks, 50 succeeded, fixture-angular:build failed, 1 skipped | `t03-logs/root-test.log`; original fixture log `.nx/cache/terminalOutputs/16403552252379578265` |

The broad root failure stopped after Angular printed “Building…” and supplied no compiler diagnostic. The controller identified it as the already-known sandbox Angular startup limitation from T01, for which a bounded-worker build outside the sandbox previously passed, and explicitly instructed T03 to stop broad/Angular retries. No compiler defect or compliance regression is inferred. All T03-specific checks above passed.

Tests exercise exact license/copyright preservation; selected-package scope; unresolved distribution rejection; missing/truncated terms and hash drift; absent original metadata with evidence; whitespace/unknown-field rejection; untracked shipped assets inside/outside configured roots; stale notices/files lists; missing evidence/copyright; supporting full-policy text; and lock inventory drift.

The initial notice implementation and later inventory changes exposed an invalid escaped quote in a Unicode regular expression during verification. The parser diagnostic was inspected, the erroneous escape was corrected, and the final 14-test/verifier runs passed. Intermediate errors are not claimed as successful verification.

Collection logs: `collection.log`, `missing-collection.log`, `provenance-build.log`, `remaining-license-investigation.log`. Exact asset/source and dependency records are durable under `compliance/`; transient acquisition/pack-inspection scripts were run from `/tmp` and did not alter global tools.

## Unresolved rights and publication follow-up

1. `compliance/project-identity.json` remains unchanged: npm scope ownership/publish authority, independent-code holder/year, and published repository ownership/URL are unconfirmed. No upstream author or Git remote was substituted for the project holder. The root and package license documents explicitly describe incomplete independent-code MIT intent; all public local packages use `SEE LICENSE IN LICENSE.md`. These are not release candidates. T03's selected-asset evidence does not clear the frozen identity record's wider release review or authorize publication.
2. `storybook-framework-qwik@0.6.1` has no license document in its exact tarball or exact published-gitHead recursive repository tree (`d983ff87696be21206dbd1b48d2dd862858d1c4f`). `vite-plugin-solid@2.11.14` has no tarball license; its exact version tag resolves to `ce707ed620d5d4839472f9defb3c52c6ce57840e`, where checked root `LICENSE` and `LICENSE.md` paths returned 404. Full-original terms are unresolved for copying/bundling; both remain external tools with no distributedIn targets. Their metadata MIT strings alone are not treated as copied-code clearance.
3. The complete `krds-uiux@1.1.0` package is unresolved as a whole (ISC metadata, README policy direction, separate embedded third-party fonts/assets). Its individual inspected KRDS source records use the official policy without electing ISC. The original package is not an adapter dependency or distributed package payload.
4. Remaining unresolved local dependency/reference records are fully listed in provenance.json; none are distributed. The 308 unfetched platform-conditioned npm resolutions are enumerated separately without invented original hashes/copyright/terms. Before future code copying/bundling or target-platform inclusion, obtain the exact applicable originals and update provenance/distributed paths/notices.
5. Future token/style/component implementation tasks must record translations, adaptations, generated output paths and actual included sources before adding package distributedIn targets. Source hashes apply to preserved originals; modified output records must describe their changes. A new dependency resolution requires a refreshed inventory, because the verifier checks the exact lockfile fingerprint and complete resolution coverage.
6. Controller-owned independent license/source scope review remains to be performed. No subagents were created by T03, and no Git commit is authorized while the exact active identity hook is unavailable.

## Fix round 1 of 5 — independent review follow-up

Addressed both Important findings from `task-T03-review.md`. The changes affect local candidate-readiness and source-selection verification; they do not request or grant publishing permission. Actual project identity, copyright holder/year, policy readiness flags and the incomplete independent-code MIT document remain unchanged.

Exact changed source inventory (relative to the original 3,292-file snapshot) is `t03-logs/fix1-changed-inventory.json`:

| Path | Bytes | Current SHA-256 |
| --- | ---: | --- |
| `tools/generate-notices.mjs` | 12,969 | `d9ba1181eb577473535e2ff5e4ecabefaf1179ec0adf95eabe7db3ad805f7f79` |
| `tools/verify-licenses.mjs` | 7,750 | `0e0a647f85e8ee91bd43f90610f1c5af2e74de7b620c9f5a6ac700b3db2e2b1a` |
| `tools/tests/notices.test.mjs` | 14,211 | `2d34725e6e31c184d3c697e1a8c4f9c371cca1c4a6ab0483e52e3b110dd975f5` |

This report was appended and the fix-round logs/inventory were added. Re-generation produced byte-identical actual package notices: comparison against every original inventoried file found only the three source changes above. No policy, grant, package manifest, selected asset, source document, root manifest or lockfile changed.

Release readiness now reconciles confirmed identity with the independent-code policy (`intent: MIT`, confirmed holder status, explicit local readiness), a source-hashed complete canonical MIT grant carrying the confirmed holder and year, and root/package license and attribution notices. Line wrapping is normalized; permission/condition/disclaimer wording is preserved. Explicitly incomplete notices fail readiness. Confirming identity alone, or toggling policy flags while retaining incomplete terms/notices, does not pass. A completed grant naming a different holder also fails. A wholly isolated synthetic fixture demonstrates the valid agreement case without changing or inventing the actual project's legal identity. The generator now copies the independent-code terms path selected by policy; the real policy still selects the incomplete `LICENSES/MIT-intended.txt`.

Package `files` glob and extglob patterns now fail closed with the package name, unsupported pattern and an instruction to use literal file/directory roots so shipped material can be checked. The generator and verifier reject `payload/*.svg`, `payload/@(mystery).svg`, `payload/+(mystery).svg` and `payload/!(other).svg`; no pattern is silently skipped. Literal roots retain their existing asset scan.

| Scoped command/check | Result | Log |
| --- | --- | --- |
| `node tools/yarn.mjs test:notices` with four review regressions before implementation | Meaningful RED: 18 tests, 14 passed / 4 failed; all four defect cases incorrectly succeeded before the fix | `t03-logs/fix1-red.log` |
| Expanded release agreement/holder mismatch cases before implementation | RED: 20 tests, 14 passed / 6 failed | `t03-logs/fix1-red-expanded.log` |
| Extended pattern regression before extglob rejection | Meaningful RED: 20 tests, 19 passed / 1 failed; extglob payload still incorrectly succeeded | `t03-logs/fix1-red-extglob.log` |
| `node tools/yarn.mjs test:notices` after both fixes | GREEN: 20 passed, 0 failed | `t03-logs/fix1-green.log` |
| `node tools/yarn.mjs generate:notices` | Passed: 13 public package notice sets, 1,599 records | `t03-logs/fix1-generate.log` |
| `node tools/yarn.mjs verify:licenses` | Passed; reports actual outstanding identity, policy, grant and notice readiness gates | `t03-logs/fix1-verify.log` |
| `node tools/yarn.mjs node tools/verify-licenses.mjs --release` | Expected current failure: three identity checks plus incomplete independent-code policy, grant and notices | `t03-logs/fix1-release-gate.log` |

No root, Angular or full native suite was repeated. No new payload-selection syntax was enabled and actual packed bytes are unchanged, so the earlier 13 real pack inspections were not repeated. The focused regressions establish rejection of unsupported selections. No subagents, commits, remote writes or publishing actions were performed. Ready for controller-owned re-review.
