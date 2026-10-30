# User-confirmed metadata and independent-code license update

Status at handoff: user-supplied naming/repository values and the independent MIT grant are complete locally. The requested scope has not yet been applied to manifests/imports/lock/provenance package names; T01 owns that atomic integration after review. Account ownership verification and publication authorization are separate and are not claimed. No M3 candidate completion or actual publishing readiness is asserted.

## Confirmed values and rights distinction

- Requested npm scope: `@unofficial-krds`, supplied by the user as `unofficial-krds`. `localPackageScope` still accurately records the actual current workspace as `@krds-native`; `requestedPackageScope` and `scopeNaming` record the confirmed request and pending T01 application.
- Repository metadata URL: `https://github.com/moreal/krds`, supplied by the user. The prior observed Git remote remains separate evidence. `ownershipVerified` remains false; providing a URL does not authenticate account ownership.
- Independently authored project code: `Copyright (c) 2026 Lee Dogeon <dev.moreal@gmail.com>`, with the complete canonical MIT permission, condition and disclaimer in `LICENSES/MIT.txt`. The holder was supplied by the user and confirmed for independent code by the controller. Year 2026 records this implementation session; it is not inferred from an upstream year. Grant SHA-256: `72dc9d2e9640b32083b77b78da03a71243155e62a870ac5c3061e6d91e22dc6e`.
- The user's proposed government-plus-author attribution is represented by separate scopes: Lee Dogeon for independent project code; 행정안전부 / Ministry of the Interior and Safety as the official KRDS source attribution. No government ownership or coownership of independent project code is asserted. Substantial KRDS adaptations keep their original conditions; retyping/translating alone does not make upstream material independent MIT code.
- Original KRDS, third-party and font terms/copyright/RFN remain intact. No per-file original copyright null was populated from the user proposal or a site footer; no unresolved rights record was cleared or newly distributed.

`compliance/project-identity.json` now separates `metadataReadiness`, `ownershipVerification`, and `publicationAuthorization`. The independent-code policy marks only the MIT grant's readiness as complete. Scope/account ownership remains unauthenticated, `publishAuthorized` and `publicationAuthorization.authorized` remain false, and repository ownership remains unauthenticated. The metadata request does not authorize npm publication, push or tagging.

The existing strict `verify-licenses --release` ownership/publication-related checks were retained, not expanded. They currently report two remaining categories: scope ownership/publish authority and repository ownership/URL. Independent holder, grant, policy and notice checks now agree. Ordinary local pack and candidate preparation do not acquire a new permission prerequisite from this update. T16 must assess the pre-existing strict policy against PLAN2.3/T16 candidate preparation and T17 actual publication; this task does not decide M3 acceptance.

## Official primary-source verification

Browsing was used for legal accuracy. Browser extraction successfully returned the official English KRDS policy; the Korean policy still exposes a dynamic shell, and the KOGL browser endpoint returned 502. A subsequent approved read-only retrieval directly from the official KOGL endpoint succeeded and preserved the complete Type 1 certificate/terms. No scripts from these pages were executed.

| Official source | Verification and legal labeling consequence |
| --- | --- |
| [KRDS copyright and license information](https://www.krds.go.kr/html/eng/utility/utility_05.html) | Provides KOGL Type 1 attribution terms for KRDS materials and an example identifying the Ministry of the Interior and Safety's 2024 KRDS work. Fresh exact response SHA-256 `a75159fad6d57e3e2693c067f7555f99730ea54354a18358cd3583ba3a6756bd`, retrieved `2026-10-30T02:25:18.836405+00:00`, matches preserved `LICENSES/KRDS-copyright-en.html` byte for byte. The site's 2023 footer is not assigned as individual-file copyright. |
| [KOGL Type 1 certificate and full terms](https://www.kogl.or.kr/info/licenseType1.do) | Confirms source attribution, commercial use/adaptation permissions, and the restriction against implying public-agency sponsorship or a special relationship. Exact response SHA-256 `6b40c3874cf8866f61d8d1bab95e5d4bbedae4dd11347288883a1e83cfd425a6`, retrieved `2026-10-30T02:25:18.941871+00:00`; 7,729 bytes preserved at `compliance/evidence/metadata/kogl-license-type1.html`. This is research evidence; no new runtime material was incorporated. |
| [Official KRDS FAQ](https://www.krds.go.kr/html/site/community/community_02.html) | Browser-indexed official text corroborates the source-label example. Fresh server HTML is a dynamic shell and is not used as the complete licensing basis. Research snapshot hash `e5f3d2b9bd1696f1975a3c8e7bee7598619c70b527e39f181e570ab8b094e883` is retained in the source-check log. |
| [KOGL policy page](https://www.kogl.or.kr/info/license.do) | Existing preserved full policy and its source hash remain unchanged. Its source/author credit and no-implied-sponsorship conditions remain part of the original package notices. |

The official sources support the KRDS source label; they do not identify Lee Dogeon or transfer/co-own the independent implementation. The latter holder comes from user authorization. Existing ISC package metadata versus KRDS README/policy discrepancy is preserved, without asserting a dual-license election or universal legal priority. The main provenance has not been rewritten to manufacture copyright or clearance.

## Exact edits and review artifacts

T04 granted an exclusive metadata/licensing and generated-notice write window before mutation. The window was released after final generation/checks; T04 can perform its final read-only T06 rights check. CSS/API sources and the existing original-first derivation mappings were preserved.

The exact before bytes were captured without Git/HEAD. Review artifacts under `metadata-compliance-logs/`:

- `before/` and `before-index.json`: **122 scoped paths**, including absent/new paths; original bytes and hashes retained.
- `after/` and `current-scoped-hashes.json`: exact handoff bytes/current hashes for the same scope.
- `scoped-unified.diff`: full **157,852-byte** before/after patch, including repetitive generated bundles.
- `authored-unified.diff`: **43,512 bytes**, every authored identity/policy/MIT/docs/tool/test change, separate from generated bundles. Includes root MIT replacement once, all active metadata sentence changes, and the complete new `compliance/metadata-evidence.json`.
- `official-evidence-unified.diff`: **7,965 bytes**, the verbatim official Type 1 evidence document addition, separately classified from authored implementation.
- `generated-unified.diff`: **106,375 bytes**, the repeated deterministic package outputs.
- `changed-file-inventory.json`: exact **78 changed source/evidence/generated paths** (excluding this report and execution-log artifacts) with before/after SHA-256 and byte counts: 48 modified, 14 deleted, 16 added. Of these, 26 are authored changes, one is the official evidence document, and 51 are generated output changes.
- `generated-notice-manifest.json`, `generated-summary.json`: deterministic full generation mapping/hash inventory; covers **82 existing generated artifacts** and deletions. The union with prior paths has 44 unchanged, 25 modified, 13 deleted and 13 added entries. Every copied source document was compared byte for byte to its declared root source.

Authored scope: `AGENTS.md`'s bounded identity-rule sentence; root `LICENSE.md`/`ATTRIBUTION.md`; replacement of `LICENSES/MIT-intended.txt` by completed `LICENSES/MIT.txt`; `compliance/project-identity.json`, `license-policy.json`, new `metadata-evidence.json`; appended user-confirmed decision in `docs/execution/decisions.md`; current metadata sentence corrections in all 13 public package READMEs and `tools/README.md`; small generation-comment/empty-license README wording and validator error-label corrections; and the notice test helper's input change from the removed actual intent document to a synthetic incomplete fixture constructed from the current MIT body. No validator gate was removed or bypassed.

Generated changes: all 13 package `LICENSE.md` files now describe the completed independent MIT scope; all 13 packages receive byte-identical `LICENSES/MIT.txt` and lose the old incomplete intent file. The three packages currently incorporating KRDS material—assets, styles and tokens—receive the updated root KRDS attribution. Nine no-copied-material `LICENSES/README.md` outputs stop describing an incomplete independent-code identity gate. Other original license documents, provenance summaries and third-party material notices remain byte-identical. `generated-notice-manifest.json` validates the complete source-to-output mapping without requiring a reviewer to reread the same MIT grant 13 times.

Historical T00/T03/T04 execution/review evidence was not rewritten. `docs/execution/progress.md` remains controller/T06-lead owned; its prior holder/grant-unknown wording should be updated by that owner after review/integration. The new decisions appendix explicitly supersedes the earlier T00 identity statement while preserving that historical row.

## Commands, tests and unchanged boundaries

All Node/Yarn commands used `node tools/yarn.mjs` and selected Node 24.18.0/Yarn 4.14.1. This is authorized metadata/grant content completion; existing regression behavior was retained rather than replaced with newly fabricated copyright fixture data for the actual project.

| Command/check | Actual result | Log |
| --- | --- | --- |
| Approved direct official source retrieval | Three exact responses preserved; authoritative English policy and Type 1 terms verified | `official-source-checks.log`, `official-source-checks.json` |
| `node tools/yarn.mjs test:notices` | **20 passed / 0 failed**, including incomplete-grant, mismatched-holder, completed-grant, and unsupported glob regressions | `notices-tests.log` |
| `node tools/yarn.mjs generate:notices` | Passed: 13 public package sets from 1,599 provenance records | `generate-notices.log` |
| `node tools/yarn.mjs verify:licenses` | **Exit 0**: 1,599 sources and 13 notice sets; independent-code metadata/grant gates cleared | `verify-licenses.log` |
| `node tools/yarn.mjs node tools/verify-licenses.mjs --release` | Expected current failure: only the existing scope/publish-authority and repository-ownership categories | `release-check.log` |
| Selected Node focused real-metadata/grant assertions | **Exit 0**: user values, completed MIT hash, all 13 copied grant bytes, removed intent files, original source-document hash map, protected input bytes and strict gate distinction verified | `metadata-focused-check.log` |
| Deterministic before/after and generation artifact construction | Passed; full/split diffs, all current hashes and exact source-copy mapping preserved | `review-artifacts.log`, replayable `build-review-artifacts.py` |

Protected hashes at handoff:

- `compliance/provenance.json`: `0533d3e07dd46f755d1a813198eafce30522e5bf91994ac7e1138b3d12478071`.
- `upstream/krds/manifest.json`: `1b8583c883193a5eb047e60ffbca3837d17a0e7ebc11762d1d94a005e0cb2933`.
- `yarn.lock`: `136bebc1c213d0bc274b905ee291fa096beefa4dbbaece6ecf915689adadf4f4`.

All three were asserted unchanged after generation. Existing upstream source/license hashes were unchanged; only the independent-grant source-document key/hash was replaced. No package manifest, version, runtime source, scope/import/lock rename, derivative mapping or dependency inventory fingerprint was changed here. No 1,599-source recrawl, broad native suite, Angular retry or repeated pack set was performed. No subagent, commit, push, tag or publication action occurred. Ready for scoped independent metadata review, then T01 atomic requested-scope integration and controller-owned progress update.
