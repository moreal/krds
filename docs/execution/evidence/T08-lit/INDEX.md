# T08 Lit pilot evidence

**Archived accepted pilot scope: six native Lit components.** The independent revision-1 review closes all four Important findings: **4 fixed, 0 open**. This historical archive does not establish full-catalog, manual assistive-technology, physical IME, Firefox, outside-consumer or release completion, and grants no publication authority.

- [Final implementation report and finding responses](task-T08-lit-report.md)
- [Independent review, including superseding revision-1 acceptance](task-T08-lit-review.md)
- [Exact initial review diff](task-T08-lit-review-package.md) and [initial 43-entry snapshot](task-T08-lit-snapshot.json)
- [Exact revision-1 diff](t08-lit-logs/fix1/diff.patch) and [10-entry before/after hash inventory](t08-lit-logs/fix1/inventory.json)
- [Approved 59-file pre-T10 inventory](task-T10-lit-base-hashes.json), preserved under `accepted-pre-T10-source/`; reviewed-before revision bytes remain in `task-T08-lit-fix1-base/`, and the 22 reconstructed pre-native Lit files remain in `pre-native-baseline/`.

The accepted candidate uses native LitElement/open Shadow DOM, official Vanilla Zag service lifecycle, FACE as the sole persistent form contribution, actual external-form Button submit/reset, native table Calendar, same-root semantic names, native dialog focus/isolation, explicit registration and standalone selected Lit Labs SSR/hydration.

## Retained results

All original command lines, boundaries and limitations remain unchanged in the linked report and raw logs. Selected execution used Node 24.18.0/Yarn 4.14.1 through `node tools/yarn.mjs`.

| Evidence phase | Actual retained result | Location |
| --- | --- | --- |
| Initial native candidate | Package SSR/configuration 4/4; native browser/visual 7/7; three builds and typechecks passed | `t08-lit-logs/` |
| Canonical Chromium/WebKit contracts | 10/10 in each engine | `runners/contract-1793330976561-61995-ac20a265/`, `runners/contract-1793331032192-62855-1073f66f/` |
| Six canonical native stories | 6/6; raw axe 4.14 findings 0 and forbidden/external request violations 0; local asset requests retained | `runners/stories-1793331005984-62323-5f9c8db4/report.json`, `t08-lit-logs/stories-report.json` |
| Revision-1 regression RED | SSR 0/4; browser 0/8, reproducing all four findings in both engines | `t08-lit-logs/fix1/red-ssr.log`, `red-browser.log` |
| Accepted revision-1 GREEN | Focused SSR 5/5; focused browser 8/8; final affected browser 12/12; package 9/9; three builds and typechecks passed | `t08-lit-logs/fix1/` |
| Unsupported tool boundary | Lit siheom rejected explicitly; never counted as passing support | `t08-lit-logs/siheom-unsupported.log` |

Canonical/story/visual evidence was **not rerun** for the narrow revision. Its earlier phase is preserved separately from the final affected regression evidence. The initial RED summary is explicitly a session-observed summary; the revision RED logs are raw command output.

## Five inspected gallery images

[Desktop](t08-lit-logs/visuals/desktop.png), [320px narrow](t08-lit-logs/visuals/narrow.png), [200% text](t08-lit-logs/visuals/zoom-200.png), [forced colors](t08-lit-logs/visuals/forced-colors.png), [themed modal and focus](t08-lit-logs/visuals/modal-shadow-theme.png). Their original [metrics](t08-lit-logs/visuals/metrics.json) retain bounded page width, size scaling and inherited top-layer surface color. Inspection findings are in the report and independent review.

This archival step copied only retained evidence and immutable snapshots. It ran no tests, builds, captures, or current moving-source hashes. [COPY-MAP.json](COPY-MAP.json) records source-to-archive locations; [SHA256SUMS.json](SHA256SUMS.json) hashes archived files only and excludes itself. Historical bytes and path references inside copied material were not rewritten. T10 owns subsequent live-source changes; no shared progress, PLAN or catalog record was edited by this archive.
