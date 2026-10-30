# T06 actual-renderer shared-style repairs

Status: scoped style repairs, actual final-image inspection and package/provenance checks complete; source frozen for independent review. This is scoped Solid/Chromium renderer evidence, not complete cross-platform accessibility certification.

Scope: only shared CSS source plus essential generated derivative hashes/provenance/notices. No component/app markup, tokens, dependencies, root configuration, lockfile, commits or publication.

## Diagnosed before editing

Used view_image on all seven requested actual Solid production PNGs under `.superpowers/sdd/PLAN/t06-lead-logs/visual/` and read report.json. Exact file paths and SHA-256 values are preserved in `t06-style-logs/before-images.json`.

- calendar-in-range-focus-forced.png, calendar-range-start-focus-forced.png, calendar-range-end-focus-forced.png, calendar-both-endpoints-focus-forced.png: selected forced-color buttons showed unreadable white backplates instead of their digits, although computed outline/border inspection showed the separate focus cue remained present after T04 fix1.
- calendar-narrow-text-200.png: actual 320px viewport with 200% text split two-digit days across rows and crowded weekdays. Shared anywhere wrapping plus fixed table layout permitted invalid digit wrapping; no document-width overflow alone was not sufficient acceptance.
- date-input-calendar-popup.png: the native dialog stretched across the full 1280px viewport rather than containing the small date calendar.
- date-input-default.png: the always-mounted empty polite error region painted a red ! through the unconditional shared error pseudo-element.

Applied emil-design-engineering forms/control and touch/accessibility guidance, constrained by the KRDS part/state contracts. Original semantic native table/dialog, state/non-color cues and text size are retained.

## Source changes

- packages/styles/src/base.css: error ::before now requires :not(:empty). The persistent live region remains mounted; error text still receives its non-color ! cue when present.
- packages/styles/src/components/calendar.css: forced-color selected days use Canvas/ButtonText and existing bold/dashed/double-border cues rather than a filled Highlight/HighlightText pair. Shared focus outline is untouched; forced-color-adjust remains auto. Day/weekday content is nonwrapping, days use tabular numerals, the table uses intrinsic/auto layout with an em minimum, and actual overflow is contained in a private native table-scroll wrapper, keeping month navigation and footer actions stationary. The narrow header uses separate heading/navigation grid rows. Heading wraps at semantic whitespace without splitting the year. No font-size, zoom, transform-scale or overflow-hiding workaround was introduced.
- packages/styles/src/components/date-input.css: native popup dialog has explicit bounded inline size, viewport gutters, centered fixed positioning, padding/border and scrollable viewport-limited height, plus its native backdrop. Existing DateInput markup supports this; coordinated with date owner and lead, with no new public part required.

Exact final source diff against the controller's frozen task-T06-style-base snapshot is in `t06-style-logs/source-pass2.diff`; pass1 diff is retained as intermediate evidence.

## Package verification so far

| Exact command | Observed result |
| --- | --- |
| node tools/yarn.mjs workspace @krds-native/styles build:local | Exit 0; 9 CSS sources parsed/validated, 10 ordinary entries and identical plain strings generated (build-pass1.log). |
| node tools/yarn.mjs workspace @krds-native/styles test | Exit 0; existing 8 tests pass, 0 fail, including output equality, exports, syntax/part/token checks (tests-pass1.log). |

No Solid build or browser session was started by this style owner. Lead /root/sol_execution_resume/t06_lead owns the sole shared Solid build/browser queue; after captures and exact computed-style/layout evidence are requested before finalizing source/output provenance and this report.

## Intermediate native rerender and refinement

Lead's serialized first after run is retained in `t06-lead-logs/visual-after/` (30 PNGs and report.json). This owner inspected 11 relevant images with view_image; paths/hashes are in `t06-style-logs/after-pass1-images.json`.

Measured improvements: empty error `::before` computed `none`, while invalid error kept `"! "`; forced selected digits computed black on white Canvas with independent 2px solid focus outline and 1px dashed/4px double state borders; popup width was 400px centered in 1280px and 304px with 8px gutters at 320px; 200% popup was bounded to 288×608 inside 320×640. Enlarged dates remained intact and document width stayed 320px. Last-column native End navigation auto-scrolled the local root from 0 to 383px.

This first after inspection exposed two follow-on issues, so it was not treated as final acceptance: root-level scroll moved month/footer chrome away at the last column, and the smaller popup's enlarged year overlapped the next arrow. Lead/controller approved a private native table-only scroll wrapper implemented by the date owner (actual table semantics and public table part retained), with no component edits by this style owner. CSS pass2 isolates scrolling/focus clearance to that wrapper and separates narrow heading/navigation rows. Controller also approved actual visible Korean `{day}일` text (English stays numeric), implemented and tested by date owner to resolve real raw axe label-content mismatches without changing full accessible date names or suppressing checks. Existing nowrap/intrinsic table CSS accommodates the actual final Korean labels, as confirmed by final image inspection.

Styles build and all existing 8 tests passed again after pass2 (`build-pass2.log`, `tests-pass2.log`). Original/pass1 raw axe mismatch evidence is preserved; final raw axe and native image inspection were subsequently completed from the lead's sole queue, recorded below.

## Essential provenance and package evidence

Both style passes preserve every original `localPaths[0]`, upstream original hash and distribution target. Existing common/component CSS change summaries describe the actual visual corrections. Pass1 refreshed 36 affected derivative references; pass2 refreshed 13 references within that set. All 53 recorded output hashes now match final generated bytes (`derivative-hashes-final.log`). No original token value, alias, dependency or package export changed.

Exact content-changed implementation/output inventory for this style owner:

- Sources: `packages/styles/src/base.css`, `packages/styles/src/components/calendar.css`, `packages/styles/src/components/date-input.css`.
- Generated CSS: `packages/styles/dist/base.css`, `packages/styles/dist/button.css`, `packages/styles/dist/native-select.css`, `packages/styles/dist/modal.css`, `packages/styles/dist/tabs.css`, `packages/styles/dist/date-input.css`, `packages/styles/dist/calendar.css`, `packages/styles/dist/all.css`.
- Generated plain strings: `packages/styles/dist/lit.js`.
- Existing source mapping records: `upstream/krds/manifest.json`, `compliance/provenance.json`.
- Essential notices generated for the changed summaries: `packages/styles/LICENSE.md`, `packages/styles/THIRD-PARTY-NOTICES.md`, `packages/styles/provenance.json`, root `THIRD-PARTY-NOTICES.md`. The notice generator deterministically processes all 13 packages; identity/grant/attribution changes subsequently owned by T03 are separate from these style derivations.
- Evidence: this report and `t06-style-logs/` before/after image hash inventories, source diffs, package build/test output, per-pass hash updates, notice generation, local rights results and final 53-output checker log.

Additional exact verification commands:

| Command | Result |
| --- | --- |
| node tools/yarn.mjs workspace @krds-native/styles build:local | Pass2 exit 0; 9 parsed CSS sources, 10 CSS outputs and identical strings (`build-pass2.log`). |
| node tools/yarn.mjs workspace @krds-native/styles test | Pass2 exit 0; 8 pass, 0 fail (`tests-pass2.log`). |
| node tools/yarn.mjs exec node tools/generate-notices.mjs | Both passes exit 0; 1599 records / 13 package sets (`notices-pass1.log`, `notices-pass2.log`). |
| node tools/yarn.mjs exec node tools/verify-licenses.mjs | Both style-pass snapshots pass local verification; the then-current identity/grant release gates remain explicitly recorded in logs (`licenses-pass1.log`, `licenses-pass2.log`). T03 subsequently owns the newly-authorized metadata/licensing update and exclusive generated-notice write window. |

Exact final derivative checker invocation:

```sh
node tools/yarn.mjs exec node --input-type=module <<'JS' > .superpowers/sdd/PLAN/t06-style-logs/derivative-hashes-final.log 2>&1
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
let count = 0;
for (const resource of JSON.parse(readFileSync('upstream/krds/manifest.json')).resources) {
  for (const output of resource.derivation?.outputs ?? []) {
    assert.equal(createHash('sha256').update(readFileSync(output.localPath)).digest('hex'), output.sha256, output.localPath);
    count++;
  }
}
console.log(`Verified ${count} explicit derivative/output SHA-256 mappings across five KRDS source resources.`);
JS
```

## Final actual-renderer inspection

Lead's serialized final run is `t06-lead-logs/visual-final/` with report.json and 41 PNGs. This owner used view_image on 16 relevant final images: four forced-color range/endpoint combinations; normal in-range and both-endpoint focus; Calendar narrow with default text, 200%-text and last-column; DateInput popup desktop/320px/200%-text/footer/close; default and invalid DateInput errors. The exact 16 inspected paths/hashes are in `t06-style-logs/final-inspected-images.json`; the observed 41-image/7-scan report is retained as `final-observed-report.json`. The final refined capture sequence establishes keyboard modality with real Tab input, programmatically focuses Confirm, then uses actual Tab to reach Close; this owner re-inspected those two PNGs after refinement and recomputed all 16 current image hashes plus the exact final report snapshot. Earlier programmatic-focus metadata is retained separately as described in the evidence-refresh appendix.

Observed final results:

- Calendar in-range/start/end/both-endpoints show readable actual Korean labels, black ButtonText on white Canvas in forced colors. Computed focus stays solid 2px while state borders stay dashed 1px or double 4px. Normal selected/focus images retain readable text and distinct focus. No forced-color-adjust:none or fake image/text substitute is used.
- At 320px with real 200% text (root font changed from the reset's 62.5% to 125%, with no transform/zoom scaling), entire dates and their 일 suffix stay on one line. The native table region alone scrolls: clientWidth 240, scrollWidth 648, scrollLeft 408 after native End moves focus to Saturday 17일. Calendar root stays clientWidth=scrollWidth=256 with scrollLeft=0; document width stays 320. Header/footer remain x40..280 within root x32..288. Partial adjacent columns at a scroll edge are normal viewport clipping; focused full labels and controls remain reachable, and text is never shrunk.
- Native DateInput popup measures 400px at x440 in a 1280px viewport, 304px at x8 in a 320px viewport, and 288×608 at x16/y16 in 320×640 with 200% text. At the enlarged narrow size, heading text ends around y457 and the next arrow starts around y516, with no overlap. Vertical popup scrolling visibly exposes Confirm and Close. The current inspected popup footer/close sequence uses real Tab to establish keyboard modality, programmatic Confirm focus, then actual Tab to Close (activeElement asserted). Confirm and Close show distinct visible focus rings and remain within the vertically scrolled native popup.
- Default empty persistent error region computes ::before content none. Invalid error computes "! " and displays the real visible message, preserving its non-color cue.
- The actual final report has errors:[], externalRequests:[], and seven unsuppressed raw axe scans with axeViolations:[] (button, native-select, modal, tabs, DateInput invalid, DateInput popup, Calendar). The harness calls new AxeBuilder({ page }).analyze() without excludes or disabled rules. Original/intermediate Korean label mismatch evidence remains preserved, rather than removed from those reports.

Exact renderer command executed by the lead (not rerun concurrently by this owner):

```sh
node tools/yarn.mjs exec node .superpowers/sdd/PLAN/t06-lead-logs/visual-review.mjs > .superpowers/sdd/PLAN/t06-lead-logs/visual-final-command.log 2>&1
```

This style owner ran a final read-only `node tools/yarn.mjs exec node tools/verify-licenses.mjs` after T03's exclusive metadata/notice handoff. Exit 0: 1599 source records / 13 package notice sets; only scope/publication-authority and repository-ownership gates remain. The user-authorized completed independent MIT grant is now owned/recorded by T03, distinct from unchanged KRDS/third-party source terms. Historical style-pass logs accurately retain the earlier identity/grant blocks from their execution time.

Remaining limits: this repair evidence covers the actual tested Solid/Chromium fixture states, not every browser, OS forced-color palette, locale or future native adapter. Narrow calendars deliberately require table-only horizontal scrolling; tall enlarged popups deliberately require vertical scrolling. Other native adapters must provide equivalent internal scroll structure while preserving the public native-table part/semantics. No new behavioral coverage, publish authority or cross-framework completion is inferred. No style source or generated derivative change is pending; no subagent, commit, push, tag or publication was performed by this owner.


## Evidence-only refinement refresh

The lead refined the two final popup footer/close captures by establishing keyboard modality with real Tab, programmatically focusing Confirm, and then using actual Tab to Close with an activeElement assertion; the lead overwrote those two final paths using the same frozen source/CSS. This owner re-inspected ONLY those two PNGs with view_image after the refinement: Confirm has a clear visible keyboard focus ring, and the subsequent Close focus is visibly reachable at the popup bottom. The final report records the corresponding actual active buttons; popup bounds remain 288×608 at x16/y16 in a 320×640 viewport with 200% text.

Updated current SHA-256 values:

- `visual-final/date-input-popup-narrow-text-200-footer-focus.png`: `fcc36d7d31b0efe10e41de65b2b8a9a2f4923e7af339e5acc2f17aad578f2b66`.
- `visual-final/date-input-popup-narrow-text-200-close-focus.png`: `687e25fecacdc8b590d50e262eca88be800e766a23a6ec127a4392cc347585b6`.

Recomputed and checked every entry in `t06-style-logs/final-inspected-images.json` against its current image bytes (16/16 match), and replaced `final-observed-report.json` with exact current `visual-final/report.json` bytes. `evidence-refresh.json` records the old/new values and current report SHA-256; errors/externalRequests remain empty and all seven unsuppressed raw axe counts remain zero.

The previous programmatic-focus image hash manifest and observed report snapshot are preserved separately as `final-inspected-images-before-keyboard-refinement.json` and `final-observed-report-before-keyboard-refinement.json`. They are historical metadata, not claims that overwritten PNG bytes remain as separate files. Original before images and the independent intermediate `visual-after/` image set remain preserved. Current final image/report bytes are frozen with the lead/reviewer.

No suite, build, CSS, token, provenance, notice, dependency, Git or publication change was performed for this evidence-only refresh.
