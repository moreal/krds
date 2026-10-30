# T08 Lit native pilots report

Implementation is ready for independent Sol review. All six pilots use native LitElement/open Shadow DOM, with real native behavior, standalone Lit Labs SSR/hydration and local Web Components Storybook evidence. No catalog coverage was promoted, no commit was created, and no publishing/push/tag action occurred.

## Implementation

- Public classes: Button, NativeSelect, Modal, Tabs, Calendar and DateInput. The T01 source/fixture/story probes were replaced. Source/public-entry imports perform no element registration; `registerKrdsElements(registry)` explicitly registers the fixed `krds-*` set, preflights collisions, and permits same-class idempotence only. Both public entry exports remain side-effect free; `sideEffects:false` is truthful.
- `ZagController` implements MachineBridge start/update/getApi/subscribe/stop around the exact official VanillaMachine. Lit owns native rendering. Tabs uses the actual service for selection, with KRDS sequential Tab stops and additive arrows/manual activation. Disconnection stops service effects and reconnect starts a fresh service.
- `machineProps` updates/removes attributes, properties, style declarations and normalized lowercase/camelcase listeners. Native tests prove replacement, stale listener removal, disconnected cleanup and reconnect without duplicate listeners. SSR semantics/public part attributes are also emitted directly in Lit templates, because element-position spread directives do not serialize attributes on the server.
- FACE NativeSelect/DateInput use ElementInternals as the sole successful control, including required validity, disabled fieldsets, canceled/noncanceled reset and state restoration. There are no hidden duplicate submission controls. External `form` association is exercised. DateInput maintains raw drafts separately from canonical values, handles composition, commits on Enter/group blur or submission, and blocks invalid/rejected pending submissions.
- Button renders a real native button. A shadow button has no external native form owner, so submit uses a temporary actual native submitter with host name/value through `requestSubmit`; FormData(form, event.submitter) proves the submitter entry. Reset executes the cancelable native reset algorithm once. Default actions do not submit; Enter/Space each dispatch one action. Native disabled controls suppress action.
- Modal uses native dialog/showModal top-layer isolation, same-root title/description IDs, default dialog focus, first-interactive-only explicit focus targets, nested topmost dismissal policy, Shadow DOM/slot focus traversal, last close control, actual opener restoration/fallback and preserved body scroll state. DateInput explicitly focuses its trigger before activation for WebKit pointer behavior and restores it after Cancel/Confirm/Escape.
- Calendar is a six-row/seven-column native table, with full date/state names, Korean visible `일` suffix, tentative single/range values, bounds, navigation, Clear/Cancel/Confirm and sequential enabled date Tab stops. DateInput's popup composes the native Modal and Calendar. No foreign renderer or upstream KRDS JavaScript controls the DOM.
- Component shadow roots consume the supported additive `shadowStyles` API delivered by the shared style owner. Global token defaults are explicitly imported by fixture/stories and documented for consumers. This avoids per-host token defaults overriding inherited user themes; actual top-layer theme inheritance passes.

## Verification commands and retained results

All commands use the selected wrapper (`Node 24.18.0`, `Yarn 4.14.1`). Builds and browser runs were serialized within Lit-owned outputs. Logs are under `.superpowers/sdd/PLAN/t08-lit-logs/`.

| Exact command | Result | Log |
| --- | --- | --- |
| `node tools/yarn.mjs workspace @unofficial-krds/lit build:local` | passed; package JS/declarations, public index/register entries | `build-lit.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/fixture-lit build:local` | passed; real production fixture/harness/hydration entries | `build-fixture.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/storybook-lit build:local` | passed; native Web Components Storybook; normal manager chunk-size warning retained | `build-storybook.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/lit typecheck` | passed | `typecheck-lit.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/fixture-lit typecheck` | passed | `typecheck-fixture.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/storybook-lit typecheck` | passed | `typecheck-storybook.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/lit test` | 4/4 passed: import/registration, six native SSR roots, collisions and invalid configuration | `test-lit.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/fixture-lit test` | 7/7 passed: Chromium/WebKit forms+lifecycle, Chromium/WebKit popup/range/keyboard, Chromium/WebKit actual SSR hydration/first action, native visual matrix | `test-native.log` |
| `node tools/yarn.mjs test:contract --framework lit` | canonical Chromium 10/10 passed | `contract.log`, `contract-report.json` |
| `node tools/yarn.mjs test:contract --framework lit --browser webkit` | canonical WebKit 10/10 passed | `contract-webkit.log`, `contract-webkit-report.json` |
| `node tools/yarn.mjs test:stories --framework lit` | all 6 canonical stories passed; raw axe 4.14 findings 0 each, external/network violations 0 each | `stories.log`, `stories-report.json`, `raw-axe-summary.json` |
| `node tools/yarn.mjs test:siheom --framework lit` | expected unsupported rejection; no official native Lit adapter, not counted as a passing suite | `siheom-unsupported.log` |

Canonical raw reports:

- Chromium contracts: `test-results/t05/contract-1793330976561-61995-ac20a265/report.json`.
- WebKit contracts: `test-results/t05/contract-1793331032192-62855-1073f66f/report.json`.
- Native stories: `test-results/t05/stories-1793331005984-62323-5f9c8db4/report.json` (actual local static asset requests retained; no external requests/network violations).

Initial RED preceded implementation: both native-class/export and explicit-registration SSR requirements failed because the original entry was a probe. Additional regression tests caught real reconnection, hydration hook ordering, normalized event listener, detached dialog, WebKit opener focus, narrow host sizing and shadow theme failures; `initial-red.txt` explicitly records these observed summaries without claiming reconstructed full stdout.

## SSR and visual evidence

The exact declared Labs packages (`@lit-labs/ssr` 4.1.0, `@lit-labs/ssr-client` 1.1.8) render all six custom elements as declarative open Shadow DOM. The production hydration entry installs the official hook before dynamically loading element definitions, supplies application-owned JSON property data before upgrade, removes defer-hydration, and reuses the server controls. Both Chromium and WebKit exercise first click/select/tab interactions without page errors. This is standalone Lit Labs evidence; automatic arbitrary property serialization and host-framework-specific SSR integration are not claimed. Details: `tests/ssr/lit/README.md`.

The following actual screenshots were opened and visually inspected after the passing native suite:

- `visuals/desktop.png`: all Button sizes, visible keyboard focus, native select, selected/disabled Tabs, DateInput invalid error and range Calendar states.
- `visuals/narrow.png`: 320px viewport, readable wrapped labels/errors, bounded page width, Calendar's private table scroll while navigation/footer stay available.
- `visuals/zoom-200.png`: 200% root text size at a 640px viewport; readable wrapping and table-only horizontal scrolling, no page overflow. The month heading wraps without losing content.
- `visuals/forced-colors.png`: distinct focus ring, disabled dashed/strike cues, visible error text and non-color selected/range boundary cues.
- `visuals/modal-shadow-theme.png`: focused final close control, native backdrop, inherited custom surface color in the top layer.

`visuals/metrics.json` records bounded page width in all four gallery variants, increasing Button size heights, doubled heights under 200% text size and actual themed dialog color `rgb(238, 245, 255)`.

## Ownership, inventory and limits

`source-inventory.txt` lists exact component/controller/directive/fixture/test/story/SSR source files. Package metadata/Vite entries, owning fixture/Storybook scripts and native docs were updated. No new dependency or lockfile change was needed; root/shared provenance/catalog/coverage files were not edited. The shared `shadowStyles` addition was requested with an exact scope and implemented/built by the shared style owner; existing common style outputs were preserved.

The inherited Firefox 1555 profile-creation problem is not a passing Firefox result and was not repeatedly retried. Lit siheom is explicitly unsupported without peer widening or foreign-renderer substitution. Full 54-component catalog verification, independent outside-consumer/release gates and final independent review remain controller/T10 responsibilities. These pilot logs do not establish full catalog completion, publication authority, npm ownership or blanket assistive-technology acceptance. Legal/attribution files and audited KRDS/font provenance remain separate and unchanged.

## Independent review revision 1

The four Important findings in `task-T08-lit-review.md` are addressed. Source is frozen for a narrow re-review. The exact reviewed-before source was checked against the original snapshot: **43/43 entries match** (41 existing files and two expected absences). Revision artifacts are `t08-lit-logs/fix1/inventory.json` and `diff.patch`: **10 changed entries**, consisting of six component/base sources, two new focused regression files and two native docs. No dependency, lock, shared/root, catalog or provenance file changed.

### Finding 1 — selected SSR option

NativeSelect now emits native `selected` on the committed matching option while retaining the existing client property reconciliation. Focused SSR tests cover a second-option controlled value and uncontrolled baseline. Chromium/WebKit tests block client JavaScript, inspect the actual pre-hydration native selection (`busan` for both instances), then import the real production hydration entry. Both select node identities and values survive hydration; the first controlled action is rejected back to its prop while the uncontrolled first action changes its native value.

The unmatched-empty case is explicitly bounded in README/compatibility docs: static single-select HTML cannot express `selectedIndex=-1` while enabled options exist. That particular semantic state needs hydration and is excluded from pre-hydration equivalence. No placeholder option was inserted and FACE remains the sole successful control.

### Finding 2 — affected range endpoint

Validation now retains the affected endpoint indices with the message. Field custom validity, field `aria-invalid`/state, ElementInternals validity anchor and failure focus follow those indices. An end-only format, max-bound or missing-end error leaves the valid start field valid and unmarked, focuses the actual end input and blocks native submission. Required empty groups can affect both endpoints; a missing start affects start. Invalid attempts keep the committed canonical range and emit zero value notifications.

The focused tests use real `form.requestSubmit()`, inspect actual native input validity/ARIA/focus and FormData, and verify no submit or value event occurs. Existing native FACE tests also pass with canceled reset, one successful contribution, external association and controlled ownership unchanged.

### Finding 3 — explicit semantic naming

Tabs accepts a resolved explicit name as an alternative to its visible label. Its tablist references its internal visible label only for that path; explicit names reach the actual tablist. Calendar applies the same alternative to its actual named region, and rejects an unnamed configuration rather than inventing a generic task name.

Browser `aria-labelledby` resolves actual elements in the host's document or enclosing shadow root. The internal semantic element uses native `ariaLabelledByElements` where available; a bounded plain-label text fallback is retained and reference text updates are observed. Unresolved external IDREFs are never copied into a different shadow root. Actual Document and enclosing-ShadowRoot label paths, live text updates, direct `aria-label`, and rejected empty/missing references pass in Chromium/WebKit.

Per the controller's explicit ruling, standalone SSR accepts optional application-owned `.labelReferences` plain text keyed by the host's actual `aria-labelledby` IDs. This is needed because the selected SSR shim does not build an external document tree. SSR tests assert the resulting semantic name, ensure no external IDREF is copied internally, and reject empty/unresolved text. The native docs identify this as host-supplied plain-label context, not automatic full accessible-name computation or assistive-technology proof. Live browser rendering uses actual references rather than masking a broken IDREF with the map.

### Finding 4 — effective inertness across Shadow DOM

Modal's return-target predicate now walks composed ancestry through assigned slots and shadow hosts. The nearest-usable-ancestor fallback uses that same ancestry. A saved shadow descendant whose outer host becomes inert is unusable, so the supplied visible/enabled fallback receives actual focus. The focused Chromium/WebKit tests reproduce that exact transition; existing removed-opener behavior remains in the prior canonical evidence, and existing affected native form/SSR suites remain green.

### RED/GREEN commands and results

All logs below are actual retained command output in `t08-lit-logs/fix1/`.

| Exact command | Before fix | After fix |
| --- | --- | --- |
| `node tools/yarn.mjs workspace @unofficial-krds/lit exec node --test tests/review-fix1.test.mjs` | **0/4**, expected selected-markup and naming failures; `red-ssr.log` | **5/5** including added empty-reference rejection; `green-ssr.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/fixture-lit exec node --test tests/contract/review-fix1.test.mjs` | **0/8**, both engines reproduce each of four findings; `red-browser.log` | **8/8**; `green-browser.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/fixture-lit exec node --test tests/contract/review-fix1.test.mjs tests/contract/hydration.test.mjs tests/contract/native-pilots.test.mjs` | not a repeated baseline run | **12/12**; `green-affected-browser.log`, with strengthened live-label/invalid-reference assertions and existing actual hydration/FACE/reset regressions |
| `node tools/yarn.mjs workspace @unofficial-krds/lit test` | prior result retained above | **9/9**; `package-tests.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/lit build:local` | prior result retained above | passed; `build-lit.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/fixture-lit build:local` | prior result retained above | passed; `build-fixture.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/storybook-lit build:local` | prior result retained above | passed; `build-storybook.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/lit typecheck` | prior result retained above | passed; `typecheck-lit.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/fixture-lit typecheck` | prior result retained above | passed; `typecheck-fixture.log` |
| `node tools/yarn.mjs workspace @unofficial-krds/storybook-lit typecheck` | prior result retained above | passed; `typecheck-storybook.log` |

No unrelated visual, full canonical contract, story/axe or all-workspace suite was repeated for this narrow revision. Their original evidence remains above without being represented as a fresh run. Firefox/siheom/AT/full-catalog/release limits remain unchanged. No commits, subagents or publication operations were performed.
