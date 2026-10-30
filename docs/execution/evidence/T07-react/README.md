# T07 React approved pilot archive

Independent round-2 review approved the reviewed six-pilot scope: **five findings fixed, zero open**. This directory preserves the evidence without rerunning tests or reading/hashing the moving implementation tree. T10 owns subsequent source changes. The frozen `task-T10-react-base/` snapshot is the post-fix, pre-T10 57-file handoff; it does not assert that live source remains unchanged.

- [Final report and chronological author responses](task-T07-react-report.md)
- [Independent review, both re-reviews and final approval](task-T07-react-review.md)
- [Initial exact native diff](initial-native.diff), [review package](task-T07-react-review-package.md), [30-path snapshot hashes](task-T07-react-snapshot.json)
- [Fix 1 exact diff](t07-react-logs/review1.diff) and [hash/byte manifest](t07-react-logs/review1-diff.json)
- [Fix 2 exact diff](t07-react-logs/review2.diff) and [hash/byte manifest](t07-react-logs/review2-diff.json)
- Frozen pre-native React sources: `task-native-pilots-base/`; reviewed before-bytes: `task-T07-react-fix1-base/` and `task-T07-react-fix2-base/`
- Frozen final handoff: `task-T10-react-base/`, [its captured hashes](task-T10-react-base-hashes.json), [final pilot inventory](t07-react-logs/review2-source-inventory.json)

Evidence retains its actual chronology. Initial native **25/25**, Chromium/WebKit contracts **10/10 each**, SSR **5/5**, six stories with raw axe/request violations **0**, and 33 inspected screenshots precede the review fixes. Fix 1 refreshed native **41/41**, Chromium **10/10**, SSR **5/5**; fix 2 refreshed the affected DateInput/form selection **22/22** after its **0 passed / 4 failed** RED. No claim is made that broad browser/story/visual gates were rerun after fix 2. Author reports retain historical pending-review wording; the independent review above records the subsequent approval.

`t07-react-logs/` contains exact command outputs, focused RED/GREEN JSON, all frozen inventories and `visual/` screenshots/observations. `test-results/t05/` contains copied raw final native/contract/story runner records and their screenshots, plus the relevant initial missing-control, raw Calendar axe and WebKit focus failures. Absolute paths inside raw JSON/logs remain historical and are not rewritten.

[ARCHIVE-MANIFEST.json](ARCHIVE-MANIFEST.json) lists archive-relative paths, original capture paths, byte counts and SHA-256 values of copied/generated archival files. [ARCHIVE-MANIFEST.sha256](ARCHIVE-MANIFEST.sha256) hashes that manifest. Hashing was limited to these archive bytes, never moving T10 source. Existing frozen source manifests remain unchanged. The archive manifest excludes itself and its checksum file.

Firefox environment limitations, physical platform/assistive-technology testing, installed-consumer qualification, full catalog and release gates remain as recorded. This approval/archive awards no catalog coverage or publication authorization. No commits or source changes were made during archival.
