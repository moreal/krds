# T07 Vue evidence archive

The independent T07 Vue review and fix-round rereview are **Approved**: two Important findings fixed, zero open. This archive preserves the exact historical bytes and the approved 86-file snapshot captured before T10. It makes no claim about the moving T10 tree, full catalog coverage or release readiness.

- [Implementation and fix report](reports/task-T07-vue-report.md)
- [Independent review and approved fix-round rereview](reviews/task-T07-vue-review.md)
- [Exact original review delta](reviews/task-T07-vue-review-package.md) and [42-path review snapshot](reviews/task-T07-vue-snapshot.json)
- [Exact fix delta](logs/fix1-source-diff.patch), [before/after source hashes](logs/fix1-source-hashes.json), and [retained source inventory](logs/source-inventory.json)
- [Approved pre-T10 snapshot](snapshots/approved-pre-T10/) and its [original 86-file hash inventory](snapshots/approved-pre-T10-hashes.json)
- [Reviewed before-fix snapshot](snapshots/reviewed-before-fix1/) and [pre-native Vue inputs](snapshots/pre-native/)
- [Verification summary](logs/verification-summary.json), [retained logs and visuals](logs/), and [original runner JSON/screenshots](runners/)

The retained evidence distinguishes the original 20/20 native suite, Chromium/WebKit 10/10 contracts and six clean Storybook cases from the fix-round five-test RED/GREEN and final 14-pass affected run. Five visual modes and the original heading-order/WebKit failures remain preserved. Skipped tests are not promoted to a full rerun.

No tests, builds or captures were performed for archival. Original reports/logs retain their historical paths unchanged; [archive-map.json](archive-map.json) maps every copied file to its original location. [SHA256SUMS.json](SHA256SUMS.json) hashes the archive payload, including this index and mapping; it excludes only itself.
