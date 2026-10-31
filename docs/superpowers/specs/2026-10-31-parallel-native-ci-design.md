# Parallel Native CI design — 2026-10-31

Status: proposal for user approval; no implementation or hosted rerun authorized by this document.

## Intent and evidence

Make Native CI finish or fail within useful, bounded intervals while preserving every selected native validation requirement. The current workflow has one 120-minute job; `run-targets.mjs` serializes eight target groups, first stable and then preview, with two Nx tasks at a time and buffered static output. A hung stable test prevents later stable targets and all preview results.

The [hosted diagnosis](../../../.superpowers/sdd/PLAN/task-hosted-native-ci-diagnosis.md) records four confirmed portability/prerequisite failures and identifies `fixture-lit:test` as the sole incomplete stable test. Its exact hanging test or process remains unknown. Parallelism improves isolation and feedback; it does not itself repair those failures.

## Approaches

| Approach | Benefit | Cost |
| --- | --- | --- |
| Coarse jobs for lint/types, tests, builds, browser contracts, and stories | Fewer runners and installs | Tests still mix all frameworks; builds repeat across phases; one hanging test obscures unrelated test results |
| Framework ownership matrix plus shared/docs jobs — recommended | One framework cannot block another; follows actual graph ownership; reuses builds within each job; exposes Lit separately | More immutable installs and repeated shared dependency builds; docs independently rebuilds its fixture dependencies |

The recommendation is an agent proposal, pending approval. Avoid a project × target matrix: it adds setup and prerequisite rebuilds without improving the first useful boundary beyond framework ownership.

## Job layout

All jobs use the exact checked-out source SHA, selected Node 24.18.0, vendored Yarn 4.14.1, immutable installation, existing local Corepack checks, and disabled Nx Cloud/daemon/TUI. Keep the existing workflow triggers, permissions, and cancellation policy.

| Job | Work | Initial job timeout |
| --- | --- | --- |
| `select-and-check` | Existing workspace/catalog checks, selection/release integration tests, eight affected propagation cases, release config check, PR version-plan check; resolve scope once and publish the selection/partition manifest | 20 min |
| `native-stable` matrix | Seven rows: react, solid, svelte, vue, lit, qwik, angular. Each owns its selected `krds-*`, `fixture-*`, and `storybook-*` targets | 60 min per row |
| `native-shared` | Selected contracts, tokens, styles, assets, fonts, and test-contracts targets | 40 min |
| `native-docs` | Selected `krds-docs` targets, including its own build and transitive fixture/library builds | 60 min |
| `native-preview` | Selected `krds-solid-next` and `fixture-solid-next` targets, separately named and reported | 45 min |
| `native-ci-result` | Always-run mandatory aggregation of checks, expected jobs, exact target results, and cache verification | 10 min |

After selection, all worker jobs are independent; neither preview nor docs waits for stable validation. Set matrix `fail-fast: false` and initially `max-parallel: 7`; no `continue-on-error`. GitHub runner availability may queue jobs. Each nonempty worker runs the existing supported target list, with Nx prerequisites, then `verify-cache.mjs --projects` for exactly its selected build projects. Do not add a zero-project cache invocation. Setup/browser-install steps also receive explicit step budgets within the job limit.

## Selection and completion contract

Keep `selection.mjs` authoritative: exact PR merge base/head, wrong-head rejection, explicit full fallback on missing history, mandatory native targets, zero-suite rejection, and existing capability quarantines. Partition its selected `(channel, project, target)` pairs by actual graph tags/ownership, rejecting unknown or duplicate ownership. No worker recomputes affected scope or broadens the suite to all projects.

Publish one versioned manifest containing source SHA, scope/reason, selection digest, full expected pair set, worker IDs, supported omissions, and expected cache-build sets. Each worker validates that manifest against its checkout and records its assigned pair set. Empty lanes emit an explicit successful `not-selected` result, rather than using a skipped job as success. A nonempty lane cannot return `not-selected`.

The final job uses `if: always()` and depends on selection and every worker family. It fails on any failed/cancelled/timed-out/skipped required job, unavailable selection, missing/duplicate/unexpected worker artifact, SHA/digest mismatch, incomplete pair coverage, any nonpassed selected target, or missing/failed required cache verification. It compares union and uniqueness against the authoritative manifest, not merely the matrix job conclusion. Legitimate capability omissions must exactly match selection metadata. Emit separate stable and preview summaries and one final result; preview failure remains mandatory. Use the final result as the single intended required check without changing repository settings in this scope.

## Builds, caches, and portability repairs

Each worker owns a fresh checkout, local Nx cache, and its own `dist/` outputs. It builds its prerequisites through Nx; no job downloads another job's build output or restores/shares mutable `.nx`, `node_modules`, generated docs, or `dist` caches. Yarn's lockfile-keyed download cache may remain. Cache restoration testing uses the existing isolated local cache and only deletes outputs in that worker checkout. Docs legitimately builds all fixture dependencies, including Solid 2; this does not count as preview behavioral validation or merge its result into stable.

Include these necessary repairs with parallelization:

1. Angular's APF consumer must launch and validate the current selected `process.execPath`, rather than the workstation-only `node.installedBinary` path recorded in toolchain metadata.
2. Choose one portable `PLAYWRIGHT_BROWSERS_PATH` under the runner's temporary directory before browser installation; pass it unchanged through all native test children and remove active harness overrides to `/private/tmp/...`. Preserve exact Playwright/browser builds. Each browser-using job installs its own pinned Chromium/Firefox/WebKit and dependencies; avoid browser caches in the initial change.
3. Add narrow Git ignore exceptions for required legal source files beneath `LICENSES/**/dist/`; inventory all provenance-referenced legal paths, ensure Git tracks them, and verify their existing hashes. Do not regenerate licensing or alter rights/attribution.
4. Add required own-build dependencies to Angular/Solid/Vue Storybook tests and docs tests, retaining `^build`. A test consuming its app's `dist` must work on a clean checkout without relying on a previous job or target ordering. Existing correct fixture prerequisites remain intact.

## Bounded execution and Lit diagnosis

Run selected project/target commands with live, prefixed Nx stream output and timestamped started/completed records written incrementally. Use at most two Nx tasks inside a worker. Give each command a hard timeout covering its prerequisite graph: initially 20 minutes, 30 for Angular/docs build-heavy commands, and 10 specifically for `fixture-lit:test`. These are proposed operational limits, not measured performance promises. On expiry record `timed-out`, collect process-tree diagnostics, terminate the child process group with a short grace period then force cleanup, and continue independent commands when the worker budget permits; an exhausted budget is a failing incomplete lane.

Within the Lit row, execute `fixture-lit:test` alone rather than batching it with other projects. Keep its existing complete test glob and own build, add streaming Node subtest start/end diagnostics, and capture test-file progress plus browser/server/child-process information on timeout. Do not quarantine, skip, or relabel it successful. This yields a bounded hosted diagnosis of the unresolved stall; a demonstrated test/handle cause may require a later targeted repair.

Every job initializes a diagnostic result before substantive work and uploads its own uniquely named artifact with `if: always()`, retaining the existing 14-day policy and missing-file error. Include manifest reference, target ledger, live log copies, cache report, and existing behavioral reports; merge only in the final job. Process-level timeouts must leave time for collection/upload. Runner termination can prevent upload; the aggregator treats that missing evidence as failure.

## Validation and scope

Implementation checks must cover exact partition coverage, wrong SHA/digest, duplicate/missing results, explicit empty lanes, stable/preview separation, quarantine preservation, process timeout/cleanup, and final rejection of skipped/failed jobs. Verify the four repairs against a fresh Linux checkout and retain existing selection, workspace/catalog, propagation, release-config, and cache-restoration checks. A hosted success claim requires the resulting hosted evidence; no long run is part of this design task.

No release workflow redesign, publication, push, tag, commit, dependency/toolchain upgrades, renderer substitutions, relaxed suite requirements, or invented Lit/Solid 2 siheom support. After approval, write the implementation plan; timing refinements remain implementation choices unless they reduce required coverage.
