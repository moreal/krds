---
title: 'Calendar · 달력'
---

# Calendar

달력 · `Calendar` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_04_03.html) · [Full reviewed specification](/sources/specs/components/calendar.md.txt) · [Framework support](../compatibility/README.md)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [exact subpath types](/sources/packages/react/dist/components/calendar/index.d.ts.txt) | [react sources and preview policy](../compatibility/README.mdexamples#react) |
| solid | `0.1.0` | implemented | [exact subpath types](/sources/packages/solid/dist/components/calendar/index.d.ts.txt) | [solid sources and preview policy](../compatibility/README.mdexamples#solid) |
| svelte | `0.1.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/Calendar.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/README.mdexamples#svelte) |
| vue | `0.1.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/calendar/Calendar.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/README.mdexamples#vue) |
| lit | `0.1.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/calendar/index.d.ts.txt) | [lit sources and preview policy](../compatibility/README.mdexamples#lit) |
| qwik | `0.1.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/calendar/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/README.mdexamples#qwik) |
| angular | `0.1.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-calendar.d.ts.txt) | [angular sources and preview policy](../compatibility/README.mdexamples#angular) |
| solid-next (preview) | `0.1.0-preview.0` | planned | [exact subpath types](/sources/packages/solid-next/dist/components/calendar/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/README.mdexamples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

The public API is defined in the reviewed guidance below and each native public declaration. [Shared event and date types](/sources/packages/contracts/src/types.ts.txt).

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Official requirements

KRDS requires weekday headings, distinct today/selected/unavailable/adjacent-month states, a non-color means to distinguish dates, accessible descriptions for those states, and keyboard access with visible focus to all functionality. Its interaction table provides sequential Tab/Shift+Tab navigation and Click/Enter execution. Adjacent-month dates can be selectable. Complex event information must remain available without truncation. Event-calendar content is outside this pilot date-selector variant; do not claim it as implemented.

### Project API and defaults

Options: `mode: 'single' | 'range'` (single, immutable), `value`, `defaultValue`, `onValueChange`, `min`, `max`, `disabled` (false), `locale: 'ko-KR' | 'en-US'` (ko-KR), `translations?: CalendarTranslations`, `referenceDate: string` ('2000-01-01'), `today?: string`, visible calendar label or explicit aria-label/aria-labelledby, and semantic `onConfirm(ValueChangeDetails<T>)`/`onCancel()` action hooks (T is the mode-specific value type). Use exactly the DateInput value shapes, strict parsing, complete committed-range rule, inclusive bounds and RangeError policies. No implicit UTC conversion or host-dependent parsing. Standalone Calendar has no successful form name/value; DateInput owns submission.

Committed state and tentative selection are distinct. On mount or when a DateInput popup opens, initialize tentative state from committed value. In uncontrolled standalone use, Confirm applies and notifies; controlled use requests a new value once. onConfirm is one plain-value action notification per enabled confirmation, including same-value confirmation; onValueChange occurs only for a changed value. A DateInput uses onConfirm to close even when the value is unchanged and exposes only its own single value notification. Calendar never self-renders a modal wrapper; DateInput supplies popup lifetime/focus trap. Cancel resets tentative state to committed, emits one onCancel action, and zero value changes. External value prop updates replace tentative selection and display without callbacks.

### View and date interaction

Initial displayed month is the committed start/single date, otherwise referenceDate. ReferenceDate is explicit and deterministic; it does not imply a selected date. If the initial month lies wholly outside min/max, view the nearest bound month. Always render a six-row, seven-column table, with weekday headers and preceding/following month dates. Both supported locales start the week on Sunday. There is one visible month; no implicit locale-calendar system changes (Gregorian only). Month heading uses `YYYY년 M월` in Korean, `Month YYYY` in English.

Previous/next month controls navigate within the supported year/bound range; disable a control if the target month has no in-bounds day. Year/month navigation clamps the focused day to the last real day in the target month; it never clamps a committed selection. Do not render year 0 or 10000 grid date buttons at calendar edges; leave those cells empty. Today is highlighted and the Today button shown only when explicit today is supplied. Today navigates/focuses that date without selecting or committing it; it is disabled if today is outside bounds. No hidden clock or network locale state is needed in stories.

Click/Enter/Space on a selectable date changes tentative state only. Single mode sets that date; range mode first activation sets start and clears end; the second activation completes the inclusive range, sorting the two endpoints chronologically (unlike reversed direct text input, two chronological endpoints are unambiguous date selection). A third activation starts a new range. Same start/end is a valid one-day range. Adjacent-month activation navigates the view to that month. Disabled/out-of-bounds date activation does nothing. With disabled=true, all selector/navigation/footer controls are disabled, tentative state is preserved, and no actions fire.

Confirm is enabled for a complete valid nonempty tentative selection, or an empty optional selection. DateInput required state additionally disables empty confirmation. Confirm is disabled for partial range and invalid/unavailable dates; it must never silently repair them. Optional empty selection is reachable via a Clear action: it empties tentative state only, then Confirm commits null or both null. Clear is hidden for required DateInput. Standalone Calendar permits empty selection. Cancel always remains enabled unless the whole Calendar is disabled. A disabled Calendar embedded in a dialog must still have the dialog's independent enabled close action.

### Keyboard and accessibility

Render a native table with caption/visible heading and scope=col weekday headings. Each date is a native type=button in its cell; every enabled date and control remains sequentially reachable with Tab/Shift+Tab, as in the frozen KRDS guidance. Do not adopt a roving-only grid/tabindex model from a backend. Add Left/Right (±1 day), Up/Down (±7 days), Home/End (Sunday/Saturday of the focused week), PageUp/PageDown (previous/next month), Shift+PageUp/PageDown (previous/next year) navigation when a date button is focused. These move focus/view only, never selection. Skip disabled dates in the movement direction, stopping at min/max/year boundaries without wrapping the entire calendar. Home/End search only within that week. Month/year movements clamp the day first then search in movement direction within the target month; when no selectable target exists keep current focus. Consume only supported date-navigation keys; normal Tab and control-button behavior remain native. IME composition suppresses shortcuts. Popup Escape behavior belongs to DateInput/Modal; standalone Escape has no close semantics.

Current day has aria-current=date; selected tentative day(s) have aria-pressed=true (a range marks every included day). Unavailable dates are natively disabled, never buttons that pretend to be enabled. Adjacent-month dates remain clearly marked in their accessible date name; color alone is insufficient. Header abbreviations have full weekday accessible text. A polite live month heading announces navigation once; moving focus among dates must not repeat unrelated instructions.

CalendarTranslations uses partial overrides merged with locale, nonempty resolved strings, plain-text placeholders. Chrome defaults:

| Key | ko-KR | en-US |
| --- | --- | --- |
| previousMonth | 이전 달 | Previous month |
| nextMonth | 다음 달 | Next month |
| today | 오늘 | Today |
| clear | 지우기 | Clear |
| cancel | 취소 | Cancel |
| confirm | 확인 | Confirm |
| selected | 선택됨 | Selected |
| unavailable | 선택할 수 없음 | Unavailable |
| adjacentMonth | 다른 달 | Outside displayed month |
| dateLabel | {year}년 {month}월 {day}일 {weekday} | {weekday}, {monthName} {day}, {year} |
| visibleDayLabel | {day}일 | {day} |
| monthLabel | {year}년 {month}월 | {monthName} {year} |

`visibleDayLabel` controls actual visible day-button text separately from the full accessible `dateLabel`; it is a nonempty plain-text template with `{year}`, `{month}` and `{day}` substitutions. Korean defaults therefore show `29일`, while English defaults show `29`. This project presentation adaptation differs from the frozen upstream numeric-only day-span example. It preserves the exact required full Korean accessible date/state name and makes the visible date-unit token match that name under the installed axe 4.14 whole-word comparison; it is not a claim that KRDS prescribes a visible day suffix or that an automated rule establishes voice-control/screen-reader acceptance. The adaptation follows the controller's implementation ruling; the original raw failure and supporting research remain retained in `.superpowers/sdd/PLAN/task-T06-calendar-axe-research.md` and its evidence logs.

Weekday names Sunday→Saturday: Korean `일요일, 월요일, 화요일, 수요일, 목요일, 금요일, 토요일` (visible `일, 월, 화, 수, 목, 금, 토`); English `Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday` (visible `Sun, Mon, Tue, Wed, Thu, Fri, Sat`). English month names are January through December. Locale determines these lists using Gregorian data; explicit weekday/month-name overrides must provide complete arrays of 7/12 nonempty names. Base day name for 2024-02-29 is `2024년 2월 29일 목요일` or `Thursday, February 29, 2024`. Append translated today, selected and unavailable/adjacent descriptions in that order when applicable, separated by commas. A numeric day alone is insufficient. Range endpoints additionally have translated `시작일`/`종료일` (`Start date`/`End date`) descriptions; a one-day range has both. These endpoint terms reuse DateInputTranslations or explicit standalone overrides `startLabel`/`endLabel` with the same defaults.

### Structure and acceptance

Order: heading with previous/next month controls, weekday/date table, optional Today, Clear when allowed, Cancel and Confirm. Parts: `root`, `header`, `heading`, `previous`, `next`, `table`, `weekday`, `cell`, `day`, `footer`, `today`, `clear`, `cancel`, `confirm`. Day states: `today`, `selected`, `range-start`, `range-end`, `in-range`, `outside-month`, `disabled`. Distinguish focus from selected/today. `selected` reflects tentative selection while editing; a canceled popup never updates committed DateInput display. Controls expose `disabled` as applicable.

Acceptance: leap years and century rules; month/year boundaries; inclusive limits and unavailable dates; same-day/reversed-click range; partial range disables Confirm; Clear/Cancel/Confirm and controlled request counts; no value events during navigation; explicit today/referenceDate; all enabled buttons sequentially reachable plus additive arrows; Korean full date/weekday/state names; popup focus return versus standalone no trap; forced-colors non-color state cues. Source records, specs and tests do not count as renderer coverage.

## State examples and native checks

Supported case axes: `single`, `range`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Selected Range](/native/storybook-react/?path=/story/krds-calendar--selected-range) · [Default](/native/storybook-react/?path=/story/krds-calendar--default) · [Disabled](/native/storybook-react/?path=/story/krds-calendar--disabled) · [English](/native/storybook-react/?path=/story/krds-calendar--english).
- solid: [Default](/native/storybook-solid/?path=/story/krds-calendar--default) · [Disabled](/native/storybook-solid/?path=/story/krds-calendar--disabled) · [Selected](/native/storybook-solid/?path=/story/krds-calendar--selected) · [Selected Range](/native/storybook-solid/?path=/story/krds-calendar--selected-range) · [Boundaries](/native/storybook-solid/?path=/story/krds-calendar--boundaries) · [Controlled](/native/storybook-solid/?path=/story/krds-calendar--controlled).
- svelte: [Selected Range](/native/storybook-svelte/?path=/story/krds-calendar--selected-range).
- vue: [Selected Range](/native/storybook-vue/?path=/story/krds-calendar--selected-range).
- lit: [Selected Range](/native/storybook-lit/?path=/story/krds-calendar--selected-range).
- qwik: [Selected Range](/native/storybook-qwik/?path=/story/krds-calendar--selected-range).
- angular: [Selected Range](/native/storybook-angular/?path=/story/krds-calendar--selected-range) · [Single](/native/storybook-angular/?path=/story/krds-calendar--single) · [Disabled](/native/storybook-angular/?path=/story/krds-calendar--disabled).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [read the checked consumer](/examples/solid-2); [download exact source](/sources/apps/fixture-solid/src/examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [read the checked consumer](/examples/svelte-16); [download exact source](/sources/apps/fixture-svelte/src/public-examples/CalendarExample.svelte.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [read the checked consumer](/examples/vue-59); [download exact source](/sources/apps/fixture-vue/src/ConsumerExample.vue.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:03.411Z`. SHA-256: `026a0d8bf8b8245e3633ea91edb1e891ff0fe4c1d880b1c7b3677bb51dcf7f0b`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_04_03.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/index.md) before redistributing.
