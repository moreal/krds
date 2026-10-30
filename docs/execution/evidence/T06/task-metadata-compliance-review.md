# Independent metadata and licensing review

Verdict: **Approved for the scoped local metadata and independent-code grant update. No material findings.** This review does not approve publication, authenticate account ownership, complete the T01 scope rename, or establish M3/T16 candidate acceptance.

Reviewed on 2026-10-30 against `AGENTS.md`, the controller's binding rights distinction, and `task-metadata-compliance-report.md`. The review covered specification compliance and implementation quality. No source files were changed, no supplied test commands were rerun, and no commit, push, tag, or publication action was taken. This review report is the only file written by the reviewer.

## Scope and evidence examined

Read the authored patch, the official Type 1 evidence addition, the current identity/evidence/policy records, the generator and validator, and the supplied test/check logs. Generated package changes were reviewed through the complete manifest and source/template mappings rather than by rereading identical license copies.

Independent read-only SHA-256, byte-count and existence checks confirmed:

- All **122** paths in `metadata-compliance-logs/current-scoped-hashes.json` match the current workspace.
- All **78** changed inventory entries match their preserved before and after snapshots: 48 modified, 14 deleted and 16 added paths; 51 are generated changes.
- All **95** generated manifest records agree with current files: **82 existing artifacts** and 13 deletions, consisting of 44 unchanged, 25 modified, 13 added and 13 deleted entries.
- Every declared exact source copy matches its root source. This includes **13** completed MIT grants, three KRDS attribution copies, three preserved KOGL policy copies, three preserved KRDS English policy copies and the font license copy. All package `LICENSE.md` template hashes and prefixes match the root license.
- Protected `compliance/provenance.json`, `upstream/krds/manifest.json` and `yarn.lock` hashes match the handoff values. No snapshot or generated-mapping discrepancy was found.

## Specification and quality assessment

The independent grant is complete canonical MIT text with `Copyright (c) 2026 Lee Dogeon <dev.moreal@gmail.com>`. The root grant and all 13 package copies have SHA-256 `72dc9d2e9640b32083b77b78da03a71243155e62a870ac5c3061e6d91e22dc6e`. The removed intent document is absent from the root and generated package sets. Policy, identity, active README statements, root notices and package notices agree about the completed independent grant.

The user-selected `@unofficial-krds` scope and `https://github.com/moreal/krds` repository URL are recorded as supplied metadata. `localPackageScope` accurately remains `@krds-native`, with the requested-scope application explicitly assigned to the pending T01 atomic integration. No scope or repository ownership is inferred from those values or from the observed Git remote. Publication authorization remains false in the identity record and the active notices.

The government attribution is confined to official KRDS source materials. The new documents do not invent government coownership of independent code, use a site footer as individual-file copyright, or turn the official 2024 example into missing per-file copyright data. They expressly preserve KRDS originals/adaptations, third-party terms, fonts and Reserved Font Names. Retyping or translation is not presented as a route to independent MIT ownership. The existing ISC-versus-KRDS-policy discrepancy remains recorded without an invented license election.

The preserved official Type 1 evidence supports source attribution, commercial use/adaptation and the prohibition on implying sponsorship or a special public-agency relationship. Its source URL, retrieval timestamp and hash are recorded separately as research evidence. The official English policy was already preserved, and the report's fresh-response hash matches that original. The new certificate is not silently incorporated into runtime packages. This review assessed those supplied primary-source bytes and retrieval evidence; it did not conduct another network retrieval.

Generator changes are confined to comments and accurate notice wording. Validator code changes only the package-license error label; strict grant, holder, notice, source-hash, stale-output, files-whitelist and unsupported-glob checks remain intact. The test helper now derives a synthetic incomplete fixture from the completed root grant while retaining a separate fixture holder. It does not insert synthetic identity into actual project metadata or weaken the incomplete-grant regression.

## Verification evidence and remaining integration work

The supplied execution logs record **20 notice tests passed, 0 failed**, successful generation, and ordinary license verification for **1,599 provenance records and 13 package notice sets**. The focused real-metadata assertions also passed. The supplied strict `--release` log reports only the two pre-existing categories: scope ownership/publish authority and repository ownership/URL. These results are evidence from the implementation run, not fresh test runs by this reviewer.

The pending T01 atomic rename and controller/T06-owned progress update remain necessary integration work. T16 must assess the existing strict ownership gates against candidate preparation and T17 publication requirements. Approval here establishes the consistency of this bounded metadata/grant update; it makes no claim that the whole project is ready to release or publish.
