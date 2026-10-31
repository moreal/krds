# Parallel Native CI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Bound and parallelize every selected native CI requirement with exact completion evidence.

**Architecture:** Selection remains authoritative and produces one SHA-bound partition manifest. Independent framework, shared, docs, and preview workers execute bounded commands and upload ledgers; an always-run aggregator rejects incomplete or inconsistent evidence.

**Tech Stack:** Node 24.18.0, vendored Yarn 4.14.1, Nx 24.0.2, GitHub Actions, pinned Playwright 1.64.1.

**Spec:** `docs/superpowers/specs/2026-10-31-parallel-native-ci-design.md`

## Global Constraints

- Seven stable frameworks: react, solid, svelte, vue, lit, qwik, angular; separate shared, docs, and Solid 2 preview lanes.
- Keep selection.mjs authoritative, exact SHA/digest/pair coverage, mandatory native targets, zero-suite rejection, and existing capability quarantines.
- Immutable Yarn installation; nodeLinker: pnpm; no root resolutions, renderer substitutions, dependency upgrades, remote telemetry, or Nx Cloud.
- Fresh checkout and own outputs per job; no shared mutable build/cache outputs. Cache verification uses exactly selected build projects and never zero projects.
- Preserve triggers, permissions, cancellation, pinned browsers, required suites and 14-day always-upload artifacts.
- User selected direct main execution and Sol delegates. No commits, pushes, dispatches, tags, publication, repository-setting changes, or rights changes in this execution.

## Review Focus

- An empty affected lane must emit explicit not-selected evidence; selected work cannot claim that state (Task 2).
- Missing, duplicated, unexpected, stale or partially passed results must fail aggregation (Task 2).
- A timed-out parent with live descendants must be cleaned up and leave incremental diagnostics (Task 2).
- Browser installation and all active consumers must agree on caller-selected portable cache location (Task 1).
- Clean-checkout tests must build their own consumed outputs and tracked legal files must match recorded hashes (Tasks 1 and 3).

---

### Task 1: Repair proven portability and build prerequisites

**Files:** Modify `apps/fixture-angular/tests/apf/verify.mjs`, `tools/testing/support.mjs`, `tools/testing/browser-cache-preload.mjs`, active browser consumers that override portable selection, `.gitignore`, required `LICENSES/**/dist/` originals, `apps/storybook-{angular,solid,vue}/project.json`, `apps/docs/project.json`. Create focused `tools/ci/portability.test.mjs`.

**Interfaces:** Consumes existing toolchain/provenance records and Nx project targets. Produces caller-authoritative `browserPath` (PLAYWRIGHT_BROWSERS_PATH when provided, portable temp default otherwise), selected current process.execPath for Angular APF, and own build prerequisites retaining ^build.

- [x] Write regression tests for foreign workstation installedBinary, caller browser cache propagation (including `0`), clean own-build dependency graph, and every provenance-referenced legal source's existence/hash/Git inclusion; run RED.
- [x] Implement only the four proven repairs. Inventory ignored legal source paths and add narrow exceptions for actual required files, preserving bytes/hashes/rights. Keep release workflow redesign outside scope.
- [x] Run focused tests, workspace/license checks, and a clean-tree portability check without deleting this checkout's outputs. Record actual commands, platform and any unavailable Linux evidence.
- [x] Self-review and write the task report; do not commit.

### Task 2: Implement manifest, bounded workers, and strict aggregation

**Files:** Create `tools/ci/partition.mjs`, `tools/ci/process-runner.mjs`, `tools/ci/aggregate.mjs`, `tools/ci/parallel-ci.test.mjs`, `tools/ci/process-runner.test.mjs`; modify `tools/ci/run-targets.mjs`, `tools/ci/verify-cache.mjs` if necessary for streaming/bounded integration, and `apps/fixture-lit/package.json`; create `tools/ci/lit-test-reporter.mjs`.

**Interfaces:** `createManifest(selection, nodes, sourceSha)` returns `{schemaVersion:1,sourceSha,selectionDigest,scope,omittedProjects,unsupported,expectedPairs,workers}`; each pair is `{channel,project,target}` and each worker `{id,pairs,cacheProjects}`. Stable IDs are `stable-react` etc., other IDs `shared`, `docs`, `preview`. `validateManifest(manifest, sourceSha)` rejects malformed/digest/ownership/coverage mismatches. CLI `partition.mjs` reads selection.json and graph, writes `test-results/ci/manifest.json`. CLI `run-targets.mjs --manifest PATH --worker ID` writes `test-results/ci/worker-result.json` and incremental diagnostics. Result carries schemaVersion/sourceSha/selectionDigest/workerId/status/pairs/cache, with each pair status and cache project coverage; status is passed/failed/not-selected. CLI `aggregate.mjs --manifest PATH --results DIR --needs PATH` reads recursively downloaded uniquely named worker artifacts and GitHub needs JSON, writes final and stable/preview summaries and exits nonzero on invalid evidence. `runCommand({command,args,cwd,env,timeoutMs,logPath,label})` asynchronously returns status/exit/signal/timing diagnostics and terminates process groups on expiry.

- [x] Write RED tests proving exact graph-tag ownership/pair union, unknown/duplicate rejection, SHA/digest mismatch, supported quarantine metadata, empty lanes, duplicate/missing/unexpected artifacts, failed/skipped needs, incomplete/failed pair and cache results, preview independence.
- [x] Implement deterministic manifest/digest and strict worker validation without recomputing affected scope. Validate actual framework tags and shared/docs ownership rather than silently assigning unknown projects.
- [x] Write RED process tests using real short child/grandchild commands, live output observation, timeout, group cleanup, and spawn failure; implement streaming prefixed logs, timestamps, bounded grace/kill diagnostics and incremental target ledgers.
- [x] Implement workers with max two Nx tasks, stream output, 20-minute command cap (30 Angular/docs build-heavy, 10 fixture-lit:test), bounded cache verification, and continuation after independent command failure when budget permits. Fixture Lit test runs alone with complete existing glob and Node start/end reporter; never skip/quarantine it.
- [x] Implement strict aggregator against authoritative expected jobs, pairs and cache sets, explicit empty-lane success and exact omissions; preserve distinct mandatory preview reporting.
- [x] Run focused tests and existing selection tests; self-review and write report without committing.

### Task 3: Wire independent jobs and verify concrete behavior

**Files:** Modify `.github/workflows/ci.yml`; create `.github/actions/native-ci-setup/action.yml` if setup reuse is useful, `tools/ci/workflow.test.mjs`; modify Task 2 interfaces only if a demonstrated integration gap requires it; update concise CI operational documentation if existing docs warrant it.

**Interfaces:** Consumes Task 2 CLI and artifact contracts exactly. Selection publishes manifest. All workers checkout manifest source SHA, download selection artifact and invoke their fixed worker ID. Aggregator receives needs JSON and downloads uniquely named artifacts. No worker waits on another worker or shares mutable outputs.

- [x] Write RED workflow tests for existing triggers/permissions/cancellation, common selection/checks, seven-row fail-fast false/max-parallel 7 matrix, independent shared/docs/preview, always mandatory aggregation, exact setup/browser env, timeouts, fresh checkout, immutable install and unique always artifacts.
- [x] Implement select-and-check (20 min), native-stable (60), native-shared (40), native-docs (60), native-preview (45), native-ci-result (10). Initialize diagnostics before substantive work, bound setup/browser steps, preserve current checks including eight affected cases, release config and PR plans. Install pinned browsers in browser consumers with one runner-temp path propagated unchanged.
- [x] Run focused workflow/protocol/portability tests and retained workspace/catalog/selection/release/affected checks. Verify exact selected Node/Yarn and immutable installation as appropriate without upgrades.
- [x] Run a bounded isolated streaming fixture-lit:test locally with its own prerequisites, capture test-file/subtest/process progress and cleanup. Record measured result; if it hangs, preserve failure and supported cause evidence without guessing or weakening suites.
- [x] Verify required legal originals and own-build dependency behavior from a temporary clean checkout representation; report Linux/hosted limits accurately. Do not dispatch CI.
- [x] Self-review and write report, including changed-file inventory, actual commands/results and remaining limits; no commit.

## Plan self-review

All approved design sections map to the three tasks. Tasks 2→3 share only the specified CLI/artifact contracts; Task 1→3 shares portable browser selection and corrected target prerequisites. Test input classes cover every Review Focus entry. Execution approval and direct-main choice are already established; this plan records the approved implementation without another approval gate. Final independent review covers the full source diff against the accepted design.
