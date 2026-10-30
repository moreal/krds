# T06 common observers independent review

Verdict: **CHANGES REQUESTED** — 0 Critical, 2 Important findings.

Reviewed only the authored three-file diff in `t06-common-observers-logs/source.diff`, with the frozen NativeSelect and Calendar specs and lead-owned canonical data as context. All three current source SHA-256 hashes match `source-hashes.json`.

## Important findings

### 1. Calendar structural gate accepts a malformed table and a single actionable date

Location: `tools/testing/observations.mjs:93–95`.

The assertions count seven rows, 42 cells and seven column headings across the whole table. They do not require six date rows with seven date cells each, or a real native date button in each date cell. The later interaction checks only the February 29 button. Consequently the new first-class Calendar case can pass without the required native seven-column, six-row, 42-date control.

Two targeted browser probes against the existing plain inspection fixture confirmed false positives without changing source files:

- Move every body cell into the first body row. The date-row cell counts become `[42,0,0,0,0,0]`; `assertCalendarSelectionConfirm` still passes.
- Replace all date buttons except February 29 with their numeric text. Exactly one native date button remains; `assertCalendarSelectionConfirm` still passes.

Require six native body/date rows, seven native date cells per row and one native `button[type=button]` per date cell for this February fixture. Add focused negative inspection fixtures for malformed row distribution and missing/non-native day controls. Keep the exact full Korean date-name interaction and tentative/Confirm event assertions.

### 2. Unknown-case rejection remains incomplete for existing component branches

Location: `tools/testing/contract.spec.ts:38–50` (dispatch guard at `58–59`).

The new explicit rejection protects NativeSelect, DateInput and unsupported component IDs, including unsupported Calendar cases. Button and Tabs still dispatch solely on component ID, while Modal treats every case other than `trigger-removed` as `focus-return`. Thus an unknown case such as `modal/trigger-remvoed` is routed to a different supported behavior instead of the requested explicit failure. The final `else` cannot catch these inputs because their component branch already matched.

Validate the complete component/case pair before dispatch, or explicitly allow `button/disabled`, `modal/focus-return`, `modal/trigger-removed` and `tabs/manual-activation` with a failure for other case IDs. Add a small dispatch regression proving an unknown case for a recognized component is rejected.

## Correctness and evidence reviewed

The NativeSelect reset observation now uses real `selectOption('busan')` on the uncontrolled initial `seoul` baseline before native reset; it requires the exact unchanged one-event history after reset. The controlled observation checks zero events after the external `busan` update and exactly one `seoul` user event. The Calendar interaction uses the exact Korean full date name, observes `aria-pressed=true` with zero tentative events, and requires exactly one ISO-valued event after Confirm. Plain inspection evidence remains distinct from actual renderer evidence. The scoped diff does not weaken request policy, create timestamps/health substitutes, or change package/toolchain metadata.

Read the existing passing root harness 16/16, workspace harness 15/15 and lead actual Solid contract 10/10 logs; none of those suites or builds was rerun. The two new targeted structural probes used selected Node 24.18.0 through `node tools/yarn.mjs`, existing cached Chromium and temporary loopback inspection files only. The first sandboxed attempt stopped at loopback `listen EPERM`; the approved retry completed both probes with exit 0 and the false-positive results recorded above. These probes establish observer gaps and award no adapter/catalog coverage.

No implementation source, canonical data, commits, publication or subagents were created by this review. Only this review report was added.

## Fix round 1 rereview

Current scoped verdict: **APPROVED** for specification compliance and code quality. Original findings fixed: **2/2**. Open findings: **0 Critical, 0 Important**. No material regression was identified in the fix diff.

Reviewed `t06-common-observers-logs/fix1-source.diff`, its three frozen hashes, the appended owner report, and the supplied focused/root/workspace output logs. The current three source hashes exactly match `fix1-source-hashes.json`. This rereview was limited to the two original findings and breakage introduced by their fixes.

Finding 1 is fixed by `observations.mjs:110–121`: the observer now requires six native direct body rows, seven native direct cells in each row, and exactly one visible native `button[type="button"]` plus one semantic button per cell. The misleading aggregate-count layouts from the original review no longer satisfy the gate. Four malformed fixture variants cover uneven rows, missing date buttons, non-native role substitutes and incorrect native button type. The positive Calendar path retains the full Korean date name, tentative pressed state and exact Confirm notification checks.

Finding 2 is fixed by the ten exact component/case pairs in `observations.mjs:4–16` and the guard before canonical route/observer dispatch in `contract.spec.ts:14`. Unknown Button, Modal and Tabs case IDs can no longer enter their existing component-only branches. The regression covers typos in all three components and both supported Modal cases. The infrastructure probe remains separately selected.

The changes are small and directly implement the required contract boundaries. They preserve real native DOM and user actions, exact event histories, request policy, and the distinction between plain inspection evidence and renderer coverage. No package, canonical-data or widget change appears in this fix diff.

Supplied evidence read: focused GREEN 3/3, root harness 19/19 and owning-workspace harness 18/18, all with zero failures. No tests or builds were rerun during this rereview. The lead's actual Solid canonical rerun for these current observer bytes remains pending at review time; the earlier 10/10 is historical evidence only and is not attributed to the fix candidate. This scoped approval does not claim that pending native integration run has completed.

Only this review report was amended. No implementation edits, commits, publication or subagents occurred.
