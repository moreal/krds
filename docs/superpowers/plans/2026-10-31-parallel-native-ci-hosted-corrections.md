# Parallel Native CI Hosted Corrections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Repair the three proven residual failures from the first parallel hosted run without weakening its checks.

**Architecture:** Preserve the approved parallel workflow and change only semantic cache-log matching, the canonical Angular executable, and source visibility of registered docs snapshots. Existing inventory/hash validators remain authoritative.

**Tech Stack:** Selected Node 24.18.0, Yarn 4.14.1, Nx 24.0.2; existing native renderers and compliance records unchanged.

**Spec:** `docs/superpowers/specs/2026-10-31-parallel-native-ci-design.md`; corrective evidence: `.superpowers/sdd/2026-10-31-parallel-native-ci/hosted-first-run-diagnosis.md` for hosted source `2becd448f7abeaa12b1dc47674547af3ad7ca202`.

## Global Constraints

- Only the three proven hosted causes are in scope; no README, VitePress UI or Pages design changes.
- Preserve raw logs, cold-cache rejection, exact selected-project hit checks, restored byte/mode equality, SHA/digest/target/cache aggregation and supported capability omissions.
- Use the validated current selected Node executable in the canonical Angular SSR entry; do not alter toolchain metadata, versions, peers or dependencies.
- Include only already registered existing docs snapshot bytes, with recorded lengths/hashes/rights unchanged; do not weaken compliance validators or introduce adapter-to-docs dependencies.
- Direct-main Sol execution is authorized; no worker commits, staging of the live index, pushes, dispatches, tags or publication. Root owns integration.

## Review Focus

- ANSI between `nx run` and the exact project must not hide a real hit; another project's hit must still fail.
- ANSI must not hide a forbidden cold-cache hit; raw evidence must remain unchanged.
- The actual package Angular test entry must launch selected current Node despite foreign workstation metadata and reject a wrong runtime before side effects.
- Every registered docs snapshot must exist, match recorded bytes/hash and enter the proposed Git source set; unrelated generated `dist` outputs must remain ignored.
- Shared license validation must pass from a fresh proposed-source checkout with only proven existing shared build prerequisites; absence of adapter `.d.ts` originals must not be masked by invented bytes or broad dependencies.

---

### Task 1: Repair the three residual hosted causes and prove them

**Files:** Modify `tools/ci/verify-cache.mjs`, `tests/ssr/angular/verify.mjs`, `tools/ci/portability.test.mjs`, `.gitignore`; extend focused cache tests in `tools/ci/process-runner.test.mjs` or create `tools/ci/cache-restoration.test.mjs` if that keeps responsibilities clearer. Add exactly the existing 385 registered missing snapshot files under `apps/docs/public/sources/**/dist/` after independent inventory/hash verification; existing compliance metadata and rights bytes stay unchanged.

**Interfaces:** Existing `verifyCache(options)` and its report/raw-log contract stay intact; semantic matching uses normalized copies only. `packages/angular/package.json` continues to invoke the canonical `tests/ssr/angular/verify.mjs`; its current selected executable is validated by the existing `tools/check-node.mjs`. Docs metadata and `compliance/distribution-provenance.json` remain the source of exact registered destination/length/hash/rights records.

- [x] Write RED cache tests from actual hosted ANSI target headers, plus wrong-project and colored cold-hit rejection; retain raw log equality and byte/mode mismatch rejection assertions.
- [x] Normalize ANSI only for semantic matching in the verifier, preserving raw logs and all exact project/inventory guards; run focused GREEN.
- [x] Write a regression against the actual canonical package entry using a foreign `installedBinary` and a real selected-Node first-child boundary, plus wrong-version early rejection. Repair only that entry's validation/executable, then run GREEN.
- [x] Inspect the full shared-license source chain before changing ignores. Inventory metadata/distribution destinations and verify the existing 385 missing snapshot lengths/hashes/rights; add narrow source-only exceptions that do not admit generated package/app builds. Add a complete snapshot source-inclusion regression and RED/GREEN evidence.
- [x] Create a fresh proposed-source representation using Git-visible source plus the exact new registered files, without modifying the live index or deleting live outputs. Verify registered snapshots and license checks with only demonstrated shared prerequisites; record whether adapter original `.d.ts` paths are required. Do not generate replacement snapshots or run broad native suites.
- [x] Prove actual modest cache cold build → local hit → restored exact bytes/modes using the corrected verifier in an isolated source/output checkout. Run focused existing CI/portability tests, workspace/license checks and diff checks appropriate to changed source; no hosted dispatch.
- [x] Self-review; write exact commands, RED/GREEN results, source delta/hashes, platform limits and concerns to the task report. No commit. Controller dispatches independent task and final integration review.

## Self-review

The single task owns all shared files and its tests, so there are no cross-task interfaces. Each of the three diagnosed roots has a production fix and regression; cache proof and fresh-source licensing proof preserve the original guards. README/UI/Pages remain separate. Execution approval already covers this corrective CI scope; no additional approval gate is needed.
