# T06 shared-style independent review

Verdict: **APPROVED** for the scoped shared-style repair. Spec compliance: pass. Code quality: pass. **Critical findings: 0. Important findings: 0.**

## Exact scope

Reviewed `packages/styles/src/base.css`, `packages/styles/src/components/calendar.css`, and `packages/styles/src/components/date-input.css` against `task-T06-style-base/` and the exact `task-T06-style-review-package.md`. Reviewed essential derivation summaries/hash mappings in `upstream/krds/manifest.json` and `compliance/provenance.json`, the supplied style build/test/hash/rights logs, the generation path, and actual final Solid/Chromium PNGs. Read AGENTS.md, T04/T06 briefs, T04 interfaces, and the Calendar/DateInput part/state contracts.

All five current files match `task-T06-style-snapshot.json` SHA-256 values. This review does not reopen separately reviewed native component markup, behavior, metadata identity/MIT grant/notices, or untouched styles. Approved visible Korean `{day}일` text and the private named/focusable native table scroller are inputs to this review. The deliberate numeric-example difference is not a hidden naming workaround or suppression.

## Spec and quality assessment

- The base correction changes only the error pseudo-element's nonempty condition. Actual default and invalid captures show an empty persistent region without a stray exclamation and the visible invalid message with its non-color `!` cue. The shared focus rules remain unchanged.
- Calendar selectors preserve actual public part/state names and exact token references. The internal scroll hook stays private; the public native table part remains intact. Intrinsic sizing, nonwrapping dates/weekdays, tabular numerals, and em minima accommodate enlarged real text without shrinking it. The narrow heading occupies its own grid row; month navigation and footer remain outside the horizontal table scroller.
- Forced-color selected days retain `forced-color-adjust: auto` and use system Canvas/ButtonText. The four inspected range/endpoint combinations retain readable digits/suffixes. Solid keyboard-focus outlines remain distinct from dashed in-range and double endpoint borders, consistent with the supplied computed 2px solid versus 1px dashed/4px double measurements. The repair does not overwrite focus with selection styling.
- The native DateInput dialog has bounded explicit width, viewport gutters, centered fixed positioning, viewport-limited height, and scrollable overflow. Desktop, narrow, and 200%-text captures show contained dialog chrome, no heading/next-arrow overlap, and reachable footer/independent close controls. The inspected enlarged close capture visibly contains the full close control and focus ring.
- The changes introduce no font-size reduction, zoom, scale, overflow-hiding workaround, foreign renderer, remote asset, runtime dependency, global reset, or default font opt-in. Existing shared generation continues to produce ordinary CSS and dependency-free plain strings from identical source data. No token definitions or aliases change.
- Original manifest resource fields are identical to the pre-repair baseline after excluding derivation fields. The common/component provenance records preserve their raw original `localPaths[0]`, upstream SHA-256 values, source URL/baseline/retrieval data, and distribution targets. Updated summaries accurately describe the repairs; generated derivatives remain attributed to the original sources.

No material correctness, maintainability, or final visual regression was found within this scope.

## Evidence examined

Supplied evidence was read, without rerunning already supplied suites/build/browser sessions:

- `t06-style-logs/build-pass2.log`: 9 parsed/validated sources, 10 CSS entries and identical strings.
- `t06-style-logs/tests-pass2.log`: 8 tests, 8 pass, 0 fail, including parsing/token/part validation, exports, plain-string equality and reset/font opt-ins. Reviewed the actual existing test and generator source.
- `t06-style-logs/derivative-hashes-final.log`: 53 explicit output SHA-256 mappings verified.
- `t06-style-logs/licenses-final.log`: local verification of 1599 source records / 13 notice sets; remaining publication/ownership gates are separate from this style verdict.
- `t06-lead-logs/visual-final/report.json`: 41 screenshots, seven raw axe scans with no violations, empty runtime-error and external-request arrays. The actual harness uses `new AxeBuilder({ page }).analyze()` without rule disabling or exclusions.
- Fresh read-only SHA-256 comparison confirmed the five-file frozen snapshot; a structural comparison confirmed original-preserving manifest/provenance fields. No source was edited and no test/build/browser suite was rerun by this reviewer.

At 320px with 200% text, the final report records Calendar root clientWidth=scrollWidth=256 and scrollLeft=0; only the table wrapper changes scrollLeft to 408 (clientWidth 240, scrollWidth 648) when the native End action focuses 17일. Header/footer remain within the root and document width stays 320px. The actual last-column PNG confirms a fully readable focused date and stationary controls. Partial neighboring columns at the table viewport edge are expected scroll clipping, not wrapped/shrunken text. The enlarged popup is 288×608 at x16/y16 in the 320×640 viewport; the footer/close images visibly demonstrate vertical scroll reachability.

## Actual images inspected

Each image below was opened with `view_image`, not inferred from the report. All paths are under `.superpowers/sdd/PLAN/t06-lead-logs/visual-final/`.

| PNG | Actual SHA-256 at review |
| --- | --- |
| calendar-in-range-focus-forced.png | `75d2f897a9c29d0ac025cf3423a95f69621965db15148ab84914bf5e0247f736` |
| calendar-range-start-focus-forced.png | `3d130965a28f8f3f27aa0c392b2da3a98a088108393b493ef5894ee1fa8e57dd` |
| calendar-range-end-focus-forced.png | `3aea2e358be78757819d5ca9066bd9e3433e015b14d57a0d525b74734dffeed9` |
| calendar-both-endpoints-focus-forced.png | `c41fc486d3a8a6a1e16cce4968e677b7b7098e9416810dbb29f8f6e17b8b7d53` |
| calendar-in-range-focus.png | `810e9d3d4cc9425ebdee33af41e14737a64849c055d0ca7e2a1fe4c5bad06e9f` |
| calendar-both-endpoints-focus.png | `003002e64c6200c70084329b36a51ae6b81a3ebb4bac8850c0ee9ef7b6951f50` |
| calendar-narrow.png | `a2cc59ee83431a8e3cfc376e144ad4e2f7e465e854ce70101a5b76dc93ac23ea` |
| calendar-narrow-text-200.png | `956004142d98cd69829a38d4da9df7ca32da359b4bac9d851447c172f89b5d57` |
| calendar-narrow-text-200-last-column.png | `92684e4952c513a62bb2440cac086a89273161af55959008064bc8018236160a` |
| date-input-calendar-popup.png | `e7699ddb6bae5327afdfc72fd92e29780798429e89003243dc24af82f7e45a4b` |
| date-input-popup-narrow.png | `107960ea933bb86f28960713885610782537fce6eb9b2b02a9f76ebe3404df85` |
| date-input-popup-narrow-text-200.png | `669a5122a1a0adb656ceab7d13aad568a57bb23c00db78a4281391797ad3edb6` |
| date-input-popup-narrow-text-200-footer-focus.png | `fcc36d7d31b0efe10e41de65b2b8a9a2f4923e7af339e5acc2f17aad578f2b66` |
| date-input-popup-narrow-text-200-close-focus.png | `687e25fecacdc8b590d50e262eca88be800e766a23a6ec127a4392cc347585b6` |
| date-input-default.png | `44b0ab7cbb9b6c13fe29fd89d8a693ad421683651830791714d0a5a4e6dc1399` |
| date-input-invalid.png | `b25d83c6478da393ea6e7ebee2e4a1b28d7ac7dcf0ae62b8a2ab044a442726f9` |

Evidence bookkeeping note: `t06-style-logs/final-inspected-images.json` retains the earlier identical `11c852…` footer/close hashes. The two current images above are the lead's refined captures; the other 14 match that inventory. This is an evidence refresh, not a CSS/source finding. The current harness directly focuses Confirm after a trusted Tab and asserts a following trusted Tab reaches Close; this review does not broaden that into full independent popup keyboard certification.

Limits: approval covers these frozen shared repairs and inspected native Solid/Chromium states. It does not certify every browser, forced-color palette, locale, or future framework adapter. Narrow enlarged calendars intentionally use table-only horizontal scrolling, and tall enlarged popups intentionally use vertical scrolling. No commit, push, tag, publication, source edit, or subagent was performed by this reviewer.
