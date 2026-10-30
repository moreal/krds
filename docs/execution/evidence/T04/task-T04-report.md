# T04 token normalization and shared CSS — implementation report

Status: token/style generation foundation complete locally; no commit, push, tag or publish performed. No native renderer or visual/accessibility acceptance is claimed.

## Delivered behavior

- All 768 frozen transformed KRDS tokens retain exact original keys, values, aliases, types and descriptions. Normalized records add resolved values, reference lists and CSS names; source-map.json maps every original Figma and transformed key/value to output names.
- Build rejects cycles with their reference chain, missing targets, type conflicts and CSS-name collisions. Generated declarations exactly match all 768 official CSS name/value/alias declarations; only the scope additionally includes :host for shadow roots.
- Six pilot CSS sources match the documented parts. parts.json captures part-specific states plus presentation variant/size/orientation attributes. PostCSS 8.5.32 parses every source; build rejects unknown token references, parts, part/state combinations, presentation values, whole-string state selectors and remote assets.
- Ten CSS entries (base, reset, fonts, all and six components) and dependency-free plain strings are generated from identical source bytes. Individual component imports include tokens/scoped foundation; all.css includes them once. No Lit dependency, original KRDS JS, font binary, remote URL, reset or font-family opt-in enters default component CSS.
- Native semantics are preserved for future adapters. Focus-visible, forced colors, reduced motion, non-color disabled/error/selected cues, wrapping and viewport constraints are authored; no animation is introduced. Styles do not implement native rendering or interaction state.
- Package test/build/export fields replace probes. Related Nx test targets build their own outputs, and raw token/spec inputs participate in task hashing. Existing shared-to-shared implicit dependency is retained.

## Decisions and limits

Ruling: use exact directly-declared PostCSS 8.5.32 (already in the locked resolution set) for real CSS syntax parsing — fulfills actual parse checks without borrowing a transitive declaration. Controller/T01 owned install, lockfile and exact registry evidence; T03 refreshed the unchanged-resolution inventory fingerprint before provenance writes.

Ruling: retain original KRDS rem values. reset.css explicitly opts into the original 62.5% root base; without reset, dimensions follow the application's root rem scale. This preserves source numbers while keeping global changes opt-in.

Ruling: no bundled font files or @font-face. fonts.css only opts into installed/local Pretendard GOV and system fallbacks, producing no network requests. Separate font installation retains its own existing legal boundary.

Ruling: record actual generated dist derivatives literally, as requested. Consequently build is a prerequisite for global license verification on a fresh checkout; source-only verification before generation will report missing derivative paths. Controller has been informed to preserve build-before-rights-check ordering.

Actual default/focus-visible/disabled/error/zoom/small-viewport visual review and renderer-level forced-color behavior remain T06–T09 acceptance. PostCSS syntax and source assertions are not browser rendering evidence. Calendar event views and other non-pilot variants remain out of scope. Local verification does not authorize release; holder/scope/repository identity and complete independent-code grant remain unconfirmed.

## RED → GREEN evidence

- tokens-red.log: five intentional failures against the initial graph stub; cycle, missing target, type mismatch, resolution and CSS-name collision assertions failed before implementation.
- styles-red.log: intentional failures against the initial CSS validator/builder stub; unknown token/part and malformed-CSS assertions failed before implementation. Stub output was absent, also exposing missing generated exports/strings.
- style-contract-red.log: added negative tests exposed accepted state on the wrong part and misspelled variant; both pass after validator implementation. The part-inventory test initially overread the DateInput semicolon explanation; its parsing was corrected to the documented first part-list sentence.
- provenance-red.log: preserved-original/actual-distribution assertion failed while original-only records still had modified:false; passes after real derivative mappings and notices were generated.
- tokens-all-green.log and nx-tokens-test-final.log: 10 tests pass, zero failures.
- styles-green.log and nx-styles-test-final.log: 8 tests pass, zero failures.

## Actual verification commands

All commands run through the selected Node/Yarn launcher; ambient Node 26 was not used for builds/tests. Logs are in `.superpowers/sdd/PLAN/t04-logs/`.

| Command | Result / log |
| --- | --- |
| node tools/yarn.mjs nx run-many -t build -p krds-tokens krds-styles | 2 successful builds; nx-build.log |
| Same command with --skipNxCache --output-style=static | Fresh token generation + 9 parsed CSS sources / 10 outputs; nx-build-final.log |
| node tools/yarn.mjs nx run krds-tokens:test --skipNxCache --output-style=static | 10 passing tests; nx-tokens-test-final.log |
| node tools/yarn.mjs nx run krds-styles:test --skipNxCache --output-style=static | 8 passing tests plus both builds; nx-styles-test-final.log |
| node tools/yarn.mjs nx run-many -t typecheck -p krds-tokens krds-styles --skipNxCache --output-style=static | Both source checks pass; typecheck-final.log |
| node tools/yarn.mjs workspace @krds-native/styles lint | Workspace boundary/export/peer gate passes; workspace-final.log |
| node tools/yarn.mjs exec node tools/generate-notices.mjs | 13 public package notice sets generated from 1599 records; notices.log |
| node tools/yarn.mjs exec node tools/verify-licenses.mjs | Local verification passes; release identity/grant gates remain unresolved; licenses-final.log |
| node tools/yarn.mjs workspace @krds-native/styles exec node --input-type=module -e ... | Actual self exports for strings, all 10 CSS entries, parts.json and dependency token import resolve; public-exports.log |
| node tools/yarn.mjs exec node --input-type=module (inline SHA-256 checker) | All 53 literal derivative/output hash mappings across five KRDS source resources match; derivative-hashes.log |

Nx emitted its existing NO_COLOR/FORCE_COLOR warning under static output; no compile/test failures occurred. Only related package/build/type/license/boundary checks were run; no broad root suite or known sandbox-sensitive Angular startup was attempted.

## Provenance and notices

`compliance/provenance.json` modifies these existing source records, preserving the exact original raw bytes as localPaths[0]:

- krds-resource-tokens-figma_token.json → original-key source maps in tokens.
- krds-resource-tokens-transformed_tokens.json → tokens normalized JSON/CSS/map/JS/types plus styles component/all CSS/string payloads.
- krds-resource-resources-css-token-krds_tokens.css → generated token CSS and embedding style outputs.
- krds-resource-resources-css-common-common.css → scoped base, optional reset/local fonts and their ordinary/string outputs.
- krds-resource-resources-css-component-component.css → six rewritten public-part source styles and ordinary/string outputs.

Each record uses modified:true, explicit paths, change summary and actual @krds-native/tokens/@krds-native/styles distribution targets. `upstream/krds/manifest.json` adds derivation summaries and exact output hashes without changing original identities/hashes. Notices were regenerated using the T03 generator; root THIRD-PARTY-NOTICES.md and token/style per-package LICENSE.md, ATTRIBUTION.md, THIRD-PARTY-NOTICES.md, provenance.json and LICENSES copies now cover the actual material. Original JS stays evidence-only with no distribution target. No holders or years were invented.

## Exact current package inventory

`dist/` entries are reproducible generated outputs (ignored by Git), included here because provenance and package exports refer to actual outputs. Existing package license files are regenerated/preserved by T03 tooling. Other configuration/installation changes owned by T01/T03 are recorded in their integration reports.

- `packages/tokens/ATTRIBUTION.md`
- `packages/tokens/LICENSE.md`
- `packages/tokens/LICENSES/KOGL-license-policy.html`
- `packages/tokens/LICENSES/KRDS-copyright-en.html`
- `packages/tokens/LICENSES/MIT-intended.txt`
- `packages/tokens/README.md`
- `packages/tokens/THIRD-PARTY-NOTICES.md`
- `packages/tokens/dist/index.d.ts`
- `packages/tokens/dist/index.js`
- `packages/tokens/dist/source-map.json`
- `packages/tokens/dist/tokens.css`
- `packages/tokens/dist/tokens.json`
- `packages/tokens/package.json`
- `packages/tokens/project.json`
- `packages/tokens/provenance.json`
- `packages/tokens/scripts/build.mjs`
- `packages/tokens/src/index.ts`
- `packages/tokens/src/outputs.test.ts`
- `packages/tokens/src/source-map.json`
- `packages/tokens/src/token-graph.mjs`
- `packages/tokens/src/token-graph.test.ts`
- `packages/tokens/tsconfig.json`
- `packages/styles/ATTRIBUTION.md`
- `packages/styles/LICENSE.md`
- `packages/styles/LICENSES/KOGL-license-policy.html`
- `packages/styles/LICENSES/KRDS-copyright-en.html`
- `packages/styles/LICENSES/MIT-intended.txt`
- `packages/styles/README.md`
- `packages/styles/THIRD-PARTY-NOTICES.md`
- `packages/styles/dist/all.css`
- `packages/styles/dist/base.css`
- `packages/styles/dist/button.css`
- `packages/styles/dist/calendar.css`
- `packages/styles/dist/date-input.css`
- `packages/styles/dist/fonts.css`
- `packages/styles/dist/index.d.ts`
- `packages/styles/dist/index.js`
- `packages/styles/dist/lit.d.ts`
- `packages/styles/dist/lit.js`
- `packages/styles/dist/modal.css`
- `packages/styles/dist/native-select.css`
- `packages/styles/dist/parts.json`
- `packages/styles/dist/reset.css`
- `packages/styles/dist/tabs.css`
- `packages/styles/package.json`
- `packages/styles/project.json`
- `packages/styles/provenance.json`
- `packages/styles/scripts/build.mjs`
- `packages/styles/src/base.css`
- `packages/styles/src/build.test.ts`
- `packages/styles/src/components/button.css`
- `packages/styles/src/components/calendar.css`
- `packages/styles/src/components/date-input.css`
- `packages/styles/src/components/modal.css`
- `packages/styles/src/components/native-select.css`
- `packages/styles/src/components/tabs.css`
- `packages/styles/src/fonts.css`
- `packages/styles/src/index.ts`
- `packages/styles/src/parts.json`
- `packages/styles/src/reset.css`
- `packages/styles/tsconfig.json`

## Review fix round 1 (task-T04-review.md)

Finding addressed: the Calendar in-range selector's `(0,3,0)` outline/negative offset overrode the shared `(0,2,0)` focus-visible outline, including forced-colors focus color. Replaced that range cue with `border-style: dashed; border-color: currentColor`. No Calendar in-range rule now sets outline or outline-offset, so the existing outer focus-visible ring and its forced-colors `Highlight` color remain independent. Range endpoints retain the later double-border cue. This is a focused CSS correction; no new implementation-mirroring test or renderer was added.

Essential fix inventory (content changes):

- `packages/styles/src/components/calendar.css`: in-range outline moved to dashed border.
- `packages/styles/dist/calendar.css`, `packages/styles/dist/all.css`, `packages/styles/dist/lit.js`: regenerated affected ordinary/string outputs from the same source.
- `upstream/krds/manifest.json`: 13 affected derivative-reference hashes refreshed (three output files shared by four existing source mappings, plus Calendar source under the component mapping); all original resource identities/hashes remain unchanged.
- `compliance/provenance.json`: existing component-CSS record's change summary describes the focus/range separation; original-first paths and distribution targets remain intact.
- `packages/styles/LICENSE.md`, `packages/styles/THIRD-PARTY-NOTICES.md`, `packages/styles/provenance.json`, `THIRD-PARTY-NOTICES.md`: regenerated changed notices for that summary. Generator rewrote the 13 notice sets deterministically; other notice content is unchanged.
- `.superpowers/sdd/PLAN/task-T04-report.md` plus `t04-logs/fix1-build.log`, `fix1-styles-test.log`, `fix1-hash-updates.log`, `fix1-notices.log`, `fix1-derivative-hashes.log`, `fix1-licenses.log`: this fix record and actual outputs.

Exact verification commands and observed output:

| Command | Result |
| --- | --- |
| `node tools/yarn.mjs workspace @krds-native/styles build:local` | Exit 0; parsed/validated 9 CSS sources and generated 10 CSS entries plus identical plain strings (`fix1-build.log`). |
| `node tools/yarn.mjs workspace @krds-native/styles test` | Exit 0; all existing 8 tests pass, 0 failures, including byte-identical ordinary/string output and public part/token checks (`fix1-styles-test.log`). |
| `node tools/yarn.mjs exec node tools/generate-notices.mjs` | Exit 0; generated notices for 13 public packages from 1599 provenance records (`fix1-notices.log`). |
| `node tools/yarn.mjs exec node --input-type=module` with the same inline `readFileSync` + `createHash('sha256')` + `assert.equal` loop over every `resources[].derivation.outputs[]` as initial verification | Exit 0; all 53 explicit derivative/output SHA-256 mappings across five KRDS source resources match (`fix1-derivative-hashes.log`). |
| `node tools/yarn.mjs exec node tools/verify-licenses.mjs` | Exit 0; 1599 source records and 13 public package notice sets pass local verification; existing release-identity/grant gates remain unresolved (`fix1-licenses.log`). |

The exact old/new SHA-256 mapping values are in `fix1-hash-updates.log`. No root/native suite, additional typecheck, browser renderer, subagent, Git commit or publication was run for this one-rule CSS fix. T06+ acceptance must explicitly compare an unfocused in-range day with a keyboard-focused in-range day, including selected/range-endpoint combinations and OS forced colors; the outer focus ring must remain distinct from the range/selection border. Source cascade inspection and generation checks do not substitute for that renderer-level acceptance.

Exact derivative checker invocation used for fix round 1:

```sh
node tools/yarn.mjs exec node --input-type=module <<'JS' > .superpowers/sdd/PLAN/t04-logs/fix1-derivative-hashes.log 2>&1
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
