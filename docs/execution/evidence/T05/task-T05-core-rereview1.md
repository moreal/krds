# T05 core fix1 scoped re-review

Spec compliance: ✅ for the four requested corrections and their common-foundation integration.

Code quality: **Approved**. All four prior findings are **ADDRESSED**. No new Critical, Important or Minor issue was found within the fix1 changes. This supersedes the prior Needs fixes verdict for this common-infrastructure review scope.

## Findings disposition

1. **Disabled-button native activation — ADDRESSED.** `tools/testing/observations.mjs:5` retains the disabled assertion and uses browser mouse input at visible button bounds; canonical `contract.spec.ts` invokes this helper. The browser regression accepts a native disabled button with an attached click handler and rejects an active aria-disabled handler through its emitted event. It therefore covers the original false rejection without substituting DOM dispatch for user activation.

2. **Owning-workspace CLI cwd failure — ADDRESSED.** `tools/tests/harness.test.mjs:79` resolves the runner through a module-relative URL converted to an absolute filesystem path. The actual owning-workspace command is recorded with 12/12 passing tests, including the formerly failing CLI test. Root `test:harness` includes the observation regressions and is recorded with 13/13 passing tests.

3. **Timezone invariance — ADDRESSED.** `tools/testing/observations.mjs:36` mounts the same semantic fixture in independent Pacific/Kiritimati and America/Los_Angeles contexts, checks native bridge/status health on each mount, requires the exact ISO display and no unsolicited mount/state-update events, and closes contexts in `finally`. The canonical scenario uses this helper and attaches per-zone health. The browser regressions accept correct semantic dates and reject both a timestamp-induced date shift and an unsolicited mount event; they also check context cleanup.

4. **Removed-trigger exact fallback focus — ADDRESSED.** `tools/testing/observations.mjs:16` first proves focus inside the dialog, verifies trigger removal while focus remains inside, closes with Escape, then requires the exact alternate `다음 작업` button to receive focus. The default case requires the original trigger. The protocol and scenario descriptions now define that predictable fallback. The regression accepts correct restoration and rejects connected-document-body focus without restoration.

## Evidence reviewed

Read the supplied nine-file fix diff and appended protocol clarification once, plus the final fix1 report section and its logs/maps. The observation helpers are reused by canonical scenarios and deliberate plain-DOM inspection regressions; these fixtures are explicitly excluded from native-adapter and canonical KRDS coverage.

- Supplied root harness log: 13 tests, 13 passed, 0 failed.
- Supplied actual private-workspace log: 12 tests, 12 passed, 0 failed.
- The fix1 report records successful package build and typecheck; their persisted logs were inspected. No fresh build or suite was launched by this reviewer.
- A fresh read-only artifact assertion independently matched all **11** source hashes in `t05-core-logs/fix1-source-hashes.json` against current files.
- Independently parsed all four reports in `t05-core-logs/fix1-current-runner-evidence.json`: current Svelte contract probe 1 passing test; production Storybook 3 passing states with no request violations; native siheom 2 passing tests and matching Vitest leaf counts; intentional canonical button RED with exit 1, `nativeHealth:true` and `missing-implementation` classification.
- All four current reports explicitly contain the expected `canonicalSelection` and `coverageAwarded:false` fields and omit historical `coverage`. Earlier all-native 8/7/6 records remain historical evidence and are not attributed to current runner bytes.

No test rerun was needed: the scoped source changes and positive/counterexample browser evidence answer the original defects, and no specific new execution doubt remained. No source, app, Git or dependency mutation was performed; this report is the only new artifact.

## Declined to judge

- Full canonical widget, form, keyboard/focus, IME, SSR/resume, visual and accessibility acceptance: later owning implementation tasks/T13, outside this fix review.
- Native app source/build correctness beyond the reported selected current runner execution: separate scoped reviews own those implementations.
- The explicitly recorded Firefox launch/profile blocker: unchanged environment limitation; no Firefox pass is inferred.
- Revalidating every historical native combination after the common fixes: outside this bounded re-review; the current selected runner reports provide the stated narrower execution evidence.

## Assessment

**Ready to proceed to T06 from the common-foundation review: Yes.** The four requested fixes now have meaningful shared browser observations and regression evidence, the real owning-workspace test path is covered, and current runner reports preserve healthy missing-feature RED and zero canonical coverage. Overall T05 acceptance remains the controller's aggregation decision.
