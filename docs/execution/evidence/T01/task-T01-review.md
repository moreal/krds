# T01 independent review

Spec compliance: ❌

Code quality: **Needs fixes**

Reviewed the T01 brief, AGENTS.md, PLAN.md sections 3.4 and 5, task report, and the complete authored-source snapshot. The verdict concerns workspace bootstrap only. Browser behavior, static Storybook integration, SSR/resume/forms, full catalog components, independent tarball consumers and publication remain later gates. The unavailable identity hook correctly prevents the planned commit and is not a code defect.

## Findings

### Important — CSS URL imports bypass dependency boundaries

`tools/check-workspace.mjs:108` recognizes `@import "..."`, but does not recognize standard CSS `@import url("...")` or unquoted `url(...)`. Such imports never reach the existing internal declaration and layer checks at lines 117–120. A shared package can therefore reference an adapter stylesheet without a declared dependency or graph edge while `verify:workspace` and the lint targets report success. CSS dependency and graph enforcement are explicit T01 requirements, so this belongs in bootstrap rather than a later component task.

Confirmed with the selected Node through `node tools/yarn.mjs node` in a disposable workspace copy:

- Baseline `inspectWorkspace`: `[]`.
- Add `packages/contracts/src/review-boundary.css` containing `@import url("../../react/src/review.css");`: `[]`.
- Change only that statement to `@import "../../react/src/review.css";`: reports both `import boundary -> packages/react` and `undeclared internal import @krds-native/react`.

Handle quoted and unquoted CSS URL imports, including embedded styles in supported component files, through the same dependency-policy path and add focused negative cases plus an allowed-import control. Preserve the required implicit graph edges for permitted CSS dependencies.

Critical: none. Other Important findings: none. Minor findings: none.

## Strengths and evidence limits

- Exact Yarn/Node selection is explicit, Yarn remains the only installer, pnpm is the linker, and root resolutions are prohibited. Per-workspace direct runtime/compiler pins and resolution probes address Solid generation and Qwik/Vite isolation.
- Angular uses official CLI/ng-packagr with partial compilation; Qwik uses its optimizer library mode; other frameworks have native compiler paths and their own outputs. The report records actual artifact assertions and distinguishes failed attempts from subsequent successful runs.
- All workspace targets invoke executable tools. Bootstrap tests are labeled, empty behavioral runners are not converted into success, and unsupported Lit/Solid 2 siheom integrations are not invented.
- Private apps, explicit CSS/docs graph edges in the current manifests, local declarative stories, unresolved license/ownership status and blocked publication are handled honestly. No catalog completion or publishing rights are asserted.
- Existing reported install, peer, native-artifact and Nx evidence was accepted without repeating broad tests. The only additional execution was the targeted disposable-copy verifier experiment above; it resolved a concrete gap not covered by the reported negative cases. No Git operation, source edit, build, install or publication was performed during review. The first stdin probe needed a supplied `process.argv[1]` because the verifier's entry-point comparison assumes a file invocation; the corrected probe completed successfully. Temporary copies were removed.

Re-review can be limited to the CSS import extraction change and its focused verifier evidence, unless that change affects other policy behavior.
