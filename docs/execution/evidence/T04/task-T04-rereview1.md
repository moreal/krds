# T04 fix1 scoped re-review

Original finding: **ADDRESSED**.

Spec compliance: ✅ for the T04 token/style generation foundation.

Quality: **Approved**.

Reviewed only `task-T04-fix1-review-package.md` and the final fix1 evidence in `task-T04-report.md`, against the original review finding. No implementation files were changed, no tests were rerun, and no subagent, browser or Git operation was used.

`packages/styles/src/components/calendar.css:9` now uses a dashed `currentColor` border for the in-range cue and sets neither `outline` nor `outline-offset`. It therefore no longer overrides the shared focus-visible outline or the forced-colors `Highlight` focus color. The following range-endpoint rule retains its double-border cue through equal specificity and later source order. Range indication and keyboard focus use independent properties.

No Critical, Important or Minor new breakage was identified in this fix-only diff. Provenance change summaries describe the actual correction; the changed Calendar source and affected calendar/all/string derivative hashes are refreshed consistently across their existing source mappings. Original resource identities, hashes, paths and distribution targets remain intact. The generated-notice hash table identifies the notice updates derived from that summary.

The implementation report records successful actual style generation, all 8 existing style tests, all 53 derivative hashes, deterministic notice generation and local verification of 1599 source records / 13 public package notice sets. These are supplied execution records, not new runs by this reviewer. Additional typechecking or a mirrored source test was unnecessary for this one-rule CSS correction.

This approval does not claim browser or native-renderer visual/accessibility acceptance. T06+ explicitly retains comparison of focused/unfocused in-range days, selected/endpoint combinations and OS forced colors. Existing release-identity/grant gates remain unresolved; no publication is authorized.
