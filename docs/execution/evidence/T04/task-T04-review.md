# T04 independent spec and quality review

Spec compliance: ❌ — one authored CSS focus-contract defect remains.

Quality: **Needs fixes**.

Reviewed AGENTS.md, the T04 brief/interface supplement, implementation report, both integration reports, the complete 152,703-byte review package in bounded chunks, and focused T02 public structure/state contracts. No Git operation, implementation edit, test rerun, browser session or subagent was used. This file is the only review output.

## Findings

### Important

1. **An in-range Calendar day loses its distinct keyboard-focus indication.** `packages/styles/src/components/calendar.css:9` gives every in-range day `outline: var(--krds-number-1) solid currentColor` and a negative outline offset. That selector has specificity `(0,3,0)`, greater than `(0,2,0)` for the common `[data-krds-component]:focus-visible` rule in `packages/styles/src/base.css:10`. Consequently the in-range outline overrides the focus outline and its offset even when the day is focused; focused and unfocused in-range days receive the same indication. The forced-colors focus-color rule also has lower specificity. This conflicts with `specs/components/calendar.md`'s distinct focus/selection requirement and the shared visible keyboard-focus contract. Preserve a separate focus-visible outline for this state, either by changing the range cue or by providing an appropriately specific focus treatment, including forced colors. Cover the focused in-range case in the eventual native renderer acceptance.

### Critical / Minor

None identified within this review scope.

## Requirements otherwise met

- Token normalization retains frozen keys/raw values/types/metadata, resolves aliases while rejecting cycles, missing references, conflicting types and output-name collisions, and preserves Figma/transformed-to-output mappings. The source comparison tests cover all 768 leaves and the complete official CSS declaration mapping.
- Ordinary component/all CSS and dependency-free Lit-compatible strings are generated from the same assembled values. Six component entries embed tokens and the scoped foundation; all.css embeds them once. Reset and local-font selection remain explicit separate entries. No foreign renderer, Lit runtime, original KRDS JS, remote font, image or other asset enters the authored output path.
- Part inventories, supported state tokens, variants, sizes and orientation agree with the pilot documents. Components keep their public identity on owned parts, including portal parts, as documented for future adapters. Native semantics and behavioral implementation remain outside T04.
- Real PostCSS parsing, negative token/part/state/variant checks, source/output equality and export-path checks replace the earlier probes. Public CSS exports are marked as side effects. Shared dependency declarations and Nx implicit/input dependencies are present.
- Provenance retains exact originals first, marks the five adapted resources modified, records literal derivative paths/hashes and corresponding distribution targets, and regenerates package/root notices and policy copies. Independent MIT intent does not replace KRDS/font terms; identity/release uncertainty remains explicit.
- Integration records show direct exact PostCSS 8.5.32, selected Node/Yarn, immutable installation, unchanged 1,915 Yarn resolution identifiers, and refreshed fingerprint for the unchanged 1,878 normalized npm inventory. The lock diff is limited to adding the direct workspace descriptor to an existing resolution.

## Evidence and limits

The supplied reports record 10 token and 8 style tests, fresh builds, source typechecks, actual package export resolution, all 53 derivative hashes, workspace checks and local license verification passing. These are reported execution evidence, not new executions by this reviewer. No unanswered execution-dependent code doubt justified rerunning those checks; the finding above follows directly from the authored selectors and declarations.

No native behavior, browser rendering, zoom, narrow-viewport, forced-colors appearance or accessibility acceptance is claimed. Those require the T06+ renderers. The global license verifier's generated-dist prerequisite and build-before-rights-check handoff are explicitly recorded; that known sequencing issue does not independently block this T04 foundation review. No commit, push, tag or publication is part of this approval decision.
