# T05 common infrastructure and root integration review

Spec compliance: ❌ — four common-foundation issues need correction before T06 consumes these gates.

Code quality: **Needs fixes**. No Critical findings. The architecture and evidence boundaries are sound; the findings concern the executable common tests, not missing KRDS widgets.

Reviewed the supplied 29-file exact change package once in bounded sections (rereading only the section truncated by tool output), the brief, interface supplements, core/integration/license reports, common execution logs and aggregated native evidence. No Git operations, source changes, app crawl, subagents or broad suite reruns were performed. This report is the only review artifact written.

## Strengths

- Selection is explicit and strict, retains all seven required Storybooks and six required siheom adapters, and rejects absent/zero canonical selections. Root runners invoke selected tools directly; they do not recurse into Nx targets. Root target inputs cover shared specs, manifests, configuration and common code through explicit inputs and sharedGlobals.
- The bridge is renderer independent, rejects non-JSON state, snapshots state/events, verifies framework identity and supports disposal. Health is attached before feature assertions, so missing pilots remain distinguishable from server/browser/control failures.
- Production Storybook verification installs context HTTP and transport guards before creating/navigating the iframe page. The allowlist uses actual output files, same origin and GET/HEAD, with WebSocket, EventSource and service-worker attempts rejected and recorded. The supplied actual Chromium negative test verifies visible content still fails policy.
- Exact-version peer extensions forward consumer dependencies without changing selected runtime/compiler versions or adding root resolutions. The final lock SHA independently matches the inventory fingerprint: `136bebc1c213d0bc274b905ee291fa096beefa4dbbaece6ecf915689adadf4f4`.
- Native tool evidence is scoped to probes; canonical coverage remains unawarded. Firefox installation is accurately separated from its profile-launch blocker. Unsupported Lit/Solid2 siheom and Solid2 Storybook remain explicit.

## Findings

### Critical

None.

### Important

1. **Disabled-button pilot bypasses the native activation behavior it should test.** `tools/testing/contract.spec.ts:39` uses `dispatchEvent('click')` on a disabled button. DOM dispatch invokes an attached handler even when native user activation is disabled, so a correct native Button can fail this common contract. A focused Chromium check on `<button disabled onclick="window.clicks++">` produced `{afterUserClick:0, afterDispatch:1, disabled:true}`. Replace the dispatch with real browser pointer input at the button's bounds, retain the disabled assertion and assert no event; include a regression using a plain native disabled button so correct browser behavior is accepted. This is a foundation gate defect and should be fixed before T06.

2. **The workspace's declared test command fails because the CLI regression assumes the repository-root cwd.** `tools/tests/harness.test.mjs:78` launches `tools/run-contract-tests.mjs` relative to the inherited working directory, while `packages/test-contracts/package.json:7` executes this suite from `packages/test-contracts`. The child consequently cannot find the runner; its empty stdout fails the `/Report:/` assertion. Focused reproduction: `node tools/yarn.mjs workspace @krds-native/test-contracts exec node --test --test-name-pattern 'real CLI reports' ../../tools/tests/harness.test.mjs` reports 1 test, 0 pass, 1 fail. Use a module-relative absolute runner path or an explicit repository-root cwd. Verify the owning workspace test path as well as root `test:harness`; otherwise the declared package/Nx test integration remains broken.

3. **The timezone-invariance pilot never varies timezone.** `tools/testing/contract.spec.ts:59` sets one value and observes it only in the globally fixed Asia/Seoul context (`playwright.config.ts:7`). A timezone-dependent implementation can pass this case. Run the same semantic date in at least two deliberately distant browser timezones, including a negative UTC offset that exposes ISO-date timestamp shifts, and compare the displayed value and zero unsolicited events after healthy mounts. This is a missing observation in a required common scenario, not a request for full DateInput acceptance at T05.

4. **Removed-trigger modal focus assertion cannot establish the advertised fallback outcome.** `tools/testing/contract.spec.ts:49` checks only `document.activeElement?.isConnected`. Removing the focused dialog commonly leaves the connected document body active even if the implementation performs no restoration, so the required `modal/trigger-removed` case can pass without testing a fallback. Define a predictable fallback in this fixture (for example, a named alternate target or the documented body fallback), put focus inside the dialog before removal/close, and assert the exact expected active element after close. Keep the test at this single required outcome; the full modal focus/trap matrix remains later implementation work.

### Minor

None required for this review.

## Spec checks and evidence limits

- ✅ Real CLI selection, zero-case rejection, isolated reports/ports, selected production outputs, nonrecursive root wiring, shared inputs, direct root browser-tool dependencies and scoped peer forwarding.
- ✅ Plain bridge/state/event boundary and health-versus-feature classification; reported default pilots intentionally fail after native health.
- ✅ Production asset allowlist before iframe navigation, HTTP/WS/EventSource/SW rejection, local allowed asset success and failure despite visible output.
- ✅ Independently parsed the aggregate's underlying reports: 8 contract probes, 7 Storybooks with 3 states each, and 6 siheom adapter reports with the recorded nonzero passing counts. Most use an earlier report schema; their actual Playwright/Vitest leaf results were checked rather than assuming current field names.
- ✅ Supplied final common log records 10 tests, 10 passed, 0 failed; supplied root integration and license reports document their focused checks. These were evidence review, not fresh reruns of those suites by this reviewer.
- ❌ Correct native disabled input is currently rejected by the synthetic pilot, workspace test execution is broken, and timezone/removed-trigger observations are incomplete.
- Firefox1555 is blocked before tests, with no pass inferred. Chromium1248 and WebKit2370 execution claims remain limited to the recorded combinations. Canonical widget/stories remain intentionally RED and unverified.

Fresh review-only checks: the isolated native disabled-button Chromium probe, the single workspace CLI regression reproduction above, and a read-only Python assertion of all aggregate report counts/statuses and final lock/inventory equality. No network was used by the focused browser probe. The artifact assertion passed after adapting to historical report schemas; this does not claim every report was generated by the final runner bytes.

## Declined to judge

- Actual KRDS component implementation, full keyboard/focus/form/IME/SSR/hydration/resume/Angular APF behavior and visual/accessibility conformance: later owning tasks/T13; probe success cannot establish them.
- Native app implementation and builder correctness beyond aggregated execution evidence: separate scoped native reviews own those files.
- Fixing the Firefox provider/profile environment: explicitly blocked evidence, not a common-runner implementation failure established here.
- Release authorization and unresolved project identity/license ownership: existing release restrictions remain; this local integration review does not authorize publication.

## Assessment

**Ready to proceed to T06: With fixes.** Correct the four common test defects above, run focused regressions plus the owning workspace/root harness entry points, and preserve the current intentional missing-widget RED and evidence boundaries. No missing canonical widget is itself a T05 review finding.
