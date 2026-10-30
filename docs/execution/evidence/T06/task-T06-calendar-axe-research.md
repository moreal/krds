# T06 Calendar Korean label-in-name research

Research date: 2026-10-30. Scope: primary-source review and isolated plain-DOM experiments; no implementation, test-policy, specification, dependency or suppression changes. No commits, publication, external communication or subagents. Temporary plain DOM earns **zero KRDS renderer/catalog coverage**.

## Recommended ruling

**Unresolved WCAG adjudication; retain the real axe violation. Do not classify it as a justified false positive from substring containment alone.** The observed result is consistent with axe 4.14.0's deliberate whole-word comparison and W3C's current **proposed** ACT method. Neither source establishes a Korean date-unit exception. This research does not establish an actual Korean voice-control failure, WCAG conformance, screen-reader acceptance or certification.

The smallest candidate that genuinely passes the focused rule while preserving the frozen full Korean accessible name is visible `{day}일` instead of `{day}`. This is a presentation change, requires controller adjudication, and has not been implemented. The frozen upstream example uses numeric-only day spans; narrow/200% text layout and KRDS presentation therefore need review before adopting it.

## Criterion and primary sources

1. [WCAG 2.2 SC 2.5.3, normative](https://www.w3.org/TR/WCAG22/#label-in-name): the name “contains the text that is presented visually.” Beginning the name with the visible label is a best practice, not the normative requirement. The criterion itself does not specify an `Intl.Segmenter` algorithm.
2. [W3C Understanding 2.5.3](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html): explains that speech users invoke controls through visible labels and that nearby/button text is the relevant label. This is informative guidance. A date number is meaningful label text, not an ornamental close-icon character.
3. [W3C G208](https://www.w3.org/WAI/WCAG22/Techniques/general/G208): permits supplementary accessible-name context when the visible label remains intact. Its test checks “the same letters in the same order”; it also suggests using a description for additional context where appropriate. Techniques are sufficient examples, not mandatory implementations. Moving the date into a description would conflict with this project's required full date name.
4. [W3C F96](https://www.w3.org/WAI/WCAG22/Techniques/failures/F96): describes mismatched names that prevent activation through the visible label. Its examples include hidden content interrupting a visible phrase. It provides no Korean date-specific exception or voice-control compatibility guarantee.
5. [W3C proposed ACT 2ee8b8](https://www.w3.org/WAI/standards-guidelines/act/rules/2ee8b8/proposed/): tokenizes with case folding, NFKD, letter/number filtering and language-sensitive word segmentation, then compares contiguous whole-word tokens. Failed Example 3 rejects `Discover It` inside `Discover Italy`; Failed Example 15 rejects visible `1` versus name `1a`. This defeats a general character-substring argument. The rule's visible-text treatment ignores `aria-hidden`. Its applicability requires ARIA naming, and its mapping explicitly says “An `inapplicable` outcome: success criterion needs further testing”. It is currently labeled **proposed**, not the normative SC. The generic rule URL redirects to this proposed version. There is no explicit example resolving Korean number-plus-date-unit morphology.
6. [Deque axe 4.14 rule documentation](https://dequeuniversity.com/rules/axe/4.14/label-content-name-mismatch): maps the rule to WCAG 2.1/2.2 Level A with serious impact and calls for inclusion of visible text in its order. Unlike the older 4.11 page, 4.14 is not labeled experimental; do not use the older page to dismiss this finding.
7. [Deque exact v4.14.0 source](https://github.com/dequelabs/axe-core/blob/v4.14.0/lib/checks/label/label-content-name-mismatch-evaluate.js): implements NFKD curation, punctuation separation, default-locale `Intl.Segmenter` (whitespace fallback), and contiguous token equality. Locally verified installed bundle sections: `axe.js:30798` onward and `:32958` matcher. [Deque issue #5420](https://github.com/dequelabs/axe-core/issues/5420) discusses rejecting substring shortcuts, ICU segmentation and occasional browser differences. [Merged PR #5437](https://github.com/dequelabs/axe-core/pull/5437) and the [4.14.0 release](https://github.com/dequelabs/axe-core/releases/tag/v4.14.0) establish that CJK segmentation and default rule enablement shipped. These support the mechanism, not a ruling about this particular Korean Calendar.

## Existing real Calendar evidence

Frozen local contract: `specs/components/calendar.md`, keyboard/accessibility and translation sections. Base name for leap day must be exactly `2024년 2월 29일 목요일`; applicable state descriptions follow in the specified order. A numeric-only accessible name is insufficient. Prefixing another `29`, adding whitespace inside `29일`, inserting punctuation/zero-width characters, or changing to English would violate or evade that contract.

Read-only inspection of `test-results/t05/stories-1793325286793-6802-70c4c487/report.json` confirms native story `krds-calendar--selected-range`, axe 4.14.0, **one violation rule affecting 42 buttons**. Example: visible `28`, `aria-label="2024년 1월 28일 일요일, 다른 달"`. This is historical candidate evidence, not a new application run. Its exact copied Calendar story and source SHA256 are preserved in [actual-story-raw-excerpt.json](t06-calendar-axe-logs/actual-story-raw-excerpt.json). Original raw results remain unchanged.

Frozen source `upstream/krds/raw/components/component_04_03.html:1384` onward shows `btn-set-date` buttons with numeric-only spans. No new upstream material/assets were incorporated.

## Reproducible isolated experiment

Run from repository root, using selected Node/Yarn and installed root dependencies:

```sh
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs node .superpowers/sdd/PLAN/t06-calendar-axe-logs/plain-dom-variants.mjs
```

Script: [plain-dom-variants.mjs](t06-calendar-axe-logs/plain-dom-variants.mjs). Full unfiltered per-variant axe objects, markup, actual visible text and browser accessible names: [plain-dom-results.json](t06-calendar-axe-logs/plain-dom-results.json). Final console output: [plain-dom-browser-final.log](t06-calendar-axe-logs/plain-dom-browser-final.log).

Environment: Node **24.18.0**, vendored Yarn **4.14.1**, root `@axe-core/playwright` **4.14.0**, actual `axe-core` **4.14.0**, Playwright **1.64.1**, Chromium headless shell **156.0.8078.4**, locale **ko-KR**, timezone **Asia/Seoul**. Browser binaries from `/private/tmp/krds-playwright-1.64.1`, revision 1248. The JSON records the normal Chromium path reported by Playwright separately; default headless launch uses the headless shell. All HTML uses `page.setContent`; no app/Vite/dist writes, application server, external resources or network requests are needed.

The initial sandbox launch failed at macOS Mach-port permission; [plain-dom-run.log](t06-calendar-axe-logs/plain-dom-run.log) retains that infrastructure failure. Approved local browser execution then exposed an inspection-only virtual-tree setup mistake, retained in `plain-dom-browser-run.log`; correcting the inspection API produced successful final execution, exit 0. No failing attempt counts as behavioral evidence.

For the table, K means `2024년 2월 29일 목요일`; KS means K followed by `, 오늘, 선택됨`. Accessible names below come from **Chromium's accessibility tree via CDP**, independently checked by Playwright ARIA snapshots. The `visibleText` value is axe's actual visible-text extraction, not `textContent`/`innerText` (both are also retained raw).

| Isolated markup | Visible text | Chromium accessible name | Raw focused rule result |
| --- | --- | --- | --- |
| `button aria-label=K` | `29` | K, exact | violation, 1 node |
| `button aria-label=KS aria-current=date aria-pressed=true` | `29` | KS, exact | violation, 1 node |
| English `aria-label` | `29` | `Thursday, February 29, 2024`, exact | pass, 1 node |
| `aria-label=K`, numeric child `aria-hidden=true` | `29` | K, exact | violation, 1 node |
| `aria-labelledby` references hidden full-date span | `29` | K, exact | violation, 1 node |
| Name from hidden prefix + visible number + hidden suffix | `29` | `2024년 2월 29 일 목요일` | inapplicable; exact-name contract broken |
| Name from hidden full-date span + `aria-hidden` numeric child; no ARIA name attributes | `29` | K, exact | inapplicable; not a rule pass |
| `aria-label=K`, visible date-unit suffix | `29일` | K, exact | pass, 1 node |

For Korean numeric-only markup, actual normalized tokens are visible `["29"]` versus name `["2024년", "2월", "29일", "목요일"]`. Visible `29일` normalizes to the same `29일` name token. English keeps a separate `29` token. The full Korean name is preserved in the baseline; this is not a missing-name defect. The split hidden-content case also exposes why axe's own name helper alone is insufficient: it returns K while Chromium inserts a space before `일`.

## Minimal options for controller adjudication

1. **Preferred repair candidate, if presentation change is accepted:** render actual visible `{day}일` for Korean and keep exact full date/state name and native button semantics. English remains numeric. Preserve translation override behavior coherently; do not derive suffixes by fragile string slicing. Validate all dates/states/locales, actual Calendar/DateInput popup and selected-range story raw axe findings, plus narrow/200% text, forced-colors and focus/selection readability. The eight-sample research proves only the isolated candidate, not full-family acceptance.
2. **Keep numeric-only presentation:** retain raw one-rule/42-node finding and describe WCAG/voice-control adjudication as open. Seek Korean-literate accessibility/voice-control review or upstream clarification before classifying a false positive. No issue was posted. An actual support-matrix check should try visible-number activation with Korean speech input, collisions between adjacent-month day numbers, month navigation, selected/today/range states, and correct target activation. Record OS/AT/browser/version/language and exact commands/results.
3. **Ordinary name-from-content alternative:** a hidden full-date span plus a decorative duplicate numeric span can preserve the exact browser name. However it only exits this automated rule's applicability while keeping the same visible/name relationship. It is not recommended as a fix merely to clear axe; independent criterion/voice-control assessment would still be required. Hidden prefix/suffix concatenation is additionally unsafe for this exact-name contract, as measured above.

Do not hide visible day numbers merely for axe, suppress/widen rules, replace the required Korean name with numeric-only/English text, inject special characters, or count an inapplicable result as passing the criterion. Screen-reader checks must separately establish full date/weekday, states/endpoints, table context, focus and month announcements; a CDP/ARIA snapshot is not spoken-output evidence. Voice-control and screen-reader acceptance remain **not executed**. Controller owns the implementation decision and any subsequent renderer work.
