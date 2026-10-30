# DateInput

Semantic ID `date-input`; export `DateInput`; source `component_09_01`: [KRDS Date input](https://www.krds.go.kr/html/site/component/component_09_01.html). Read [common conventions](README.md) and [Calendar](calendar.md).

## Official requirements

KRDS distinguishes single, range, segmented and calendar-assisted input. It requires meaningful field labels, persistent format guidance, keyboard input even when a calendar exists, and programmatic label relationships. A calendar does not justify disabling or making the text field read-only. The pilot supports full-date single and two-field range input, with optional calendar assistance. Partial year/month and segmented inputs remain future variants and are not claimed implemented.

## Project API and defaults

Options: `mode: 'single' | 'range'` (single; immutable after mount); `value`, `defaultValue`, `onValueChange`; native `name`, `required` (false), `disabled` (false), `id`, `form`, `autocomplete`; `min?: string`, `max?: string`; `locale: 'ko-KR' | 'en-US'` (ko-KR), `translations?: DateInputTranslations`; `withCalendar: boolean` (true); `referenceDate: string` ('2000-01-01'); `today?: string`; field labels, persistent hint and optional external error content. No readOnly mode is added by the pilot.

Single value is `string | null`, empty default null, event `ValueChangeDetails<string | null>`. Range value is `DateRangeValue`, empty default `{start:null,end:null}`, event `ValueChangeDetails<DateRangeValue>`. A committed range is either empty or has two valid ordered endpoints; partial ranges exist only as local editing/calendar drafts. Mixing payload shape with mode is TypeError. Invalid, partial, reversed or out-of-bounds controlled/default date values are RangeError. min/max/referenceDate/today are strict ISO dates; min and max are inclusive, absent bounds mean 0001-01-01 and 9999-12-31, min>max is RangeError. referenceDate/today may lie outside the allowed range; they guide view/marking, never override bounds.

Render real type=text inputs, inputmode=numeric, no native date picker and no automatic separator insertion. Accepted text, display text and submitted value use exactly ASCII YYYY-MM-DD in both locales. `parseIsoDate` and `formatIsoDate` govern Gregorian years 1–9999 and leap years. Do not trim, guess day/month order, accept slashes, normalize overflowing dates, convert through a timestamp, or apply a host timezone. Locale changes labels/announcements, not data or parsing. Native text editing, paste, selection and undo must work.

A range has two separately named inputs (`시작일`/`종료일` by default), under a visible fieldset legend identifying the task. Single input needs task-specific label content (for example `방문일`); the library must not invent a business-purpose label. Placeholder `YYYY-MM-DD` supplements, never replaces, the persistent format hint.

## Editing, commits and notifications

Maintain raw text draft separately from committed semantic value. Input events update draft only. Validate and attempt commit on Enter in a field or focus leaving the whole input/calendar group, not on every keystroke or movement between range fields. Consume non-composing Enter to commit and prevent accidental form submission; the explicit form submit button still works. Once a valid changed value commits, a later blur does not emit again. Empty single text commits null. Both empty range texts commit the empty range; one empty endpoint is incomplete and does not commit. A reversed range is invalid; never silently reorder dates or clamp to min/max.

While composing, retain raw input and suppress validation, formatting, Enter commit and calendar shortcuts. Track compositionstart/end and `isComposing` (keyCode 229 fallback); compositionend only updates the draft. A later non-composing Enter or group blur validates it. Do not force numeric filtering or parse intermediate Hangul; completed Korean text remains invalid format until corrected, preserving the user's draft and caret. Opening the calendar never commits an unfinished text draft; it initializes from the last committed value.

Valid uncontrolled commits update state and emit once. Controlled commits emit once and reconcile the displayed committed value to the parent prop after the handler; a declined request restores the prop's formatted text. Invalid raw text stays visible, keeps the previous committed semantic value, sets aria-invalid, exposes a visible error and emits zero value events. External value changes replace drafts and clear local errors without emitting. External disabled changes suppress editing/calendar activation; they do not emit changes. Format errors take precedence over range errors; for range, validate start then end, then order. Required empty value is a required error. No locale change or validation pass emits a user value event.

## Calendar integration

The opener is type=button, named `달력 열기`/`Open calendar`, with aria-haspopup=dialog, aria-expanded and aria-controls. In range mode use one opener for the two fields, named with the task label as context when multiple date inputs exist. Opening shows a named modal calendar dialog and saves the trigger; it focuses the selected enabled date, otherwise the first selectable date in the displayed month, otherwise the enabled previous/next month control, otherwise dialog container. [Calendar](calendar.md) defines date navigation, tentative selection and Confirm/Cancel.

Calendar selection is tentative until `확인`/`Confirm`. Confirm of a valid different value emits exactly one DateInput value change and closes; same-value Confirm closes with zero value changes. Cancel, allowed Escape and closing without Confirm discard tentative dates and preserve committed input values. On Confirm, replace raw text drafts and clear local validation errors. Popup open/close is internal presentation state, not a second value event; no public open-change API in this pilot. Escape is ignored during composition or if an inner control handled it. Only the topmost dialog processes Escape. Backdrop clicks are blocked and never dismiss by default. Restore trigger focus after actual close; if the trigger disappeared use Modal's fallback. Parent-controlled value remains authoritative after Confirm. Merely opening/closing does not clear an existing invalid text draft.

## Translation and accessible feedback

`DateInputTranslations` is the semantic dictionary in this spec (adapter may expose a corresponding plain interface). Partial overrides merge with the selected locale; no key may resolve to an empty string. Required keys and defaults:

| Key | ko-KR | en-US |
| --- | --- | --- |
| startLabel | 시작일 | Start date |
| endLabel | 종료일 | End date |
| formatHint | YYYY-MM-DD 형식으로 입력하세요. 예: 2024-02-29 | Enter YYYY-MM-DD, for example 2024-02-29 |
| openCalendar | 달력 열기 | Open calendar |
| calendarTitle | 날짜 선택 | Choose date |
| requiredError | 날짜를 입력하세요 | Enter a date |
| formatError | YYYY-MM-DD 형식의 올바른 날짜를 입력하세요 | Enter a valid date in YYYY-MM-DD format |
| incompleteRangeError | 시작일과 종료일을 모두 입력하세요 | Enter both start and end dates |
| orderError | 종료일은 시작일보다 빠를 수 없습니다 | End date must not precede start date |
| minError | {min} 이후 날짜를 입력하세요 (당일 포함) | Enter a date on or after {min} |
| maxError | {max} 이전 날짜를 입력하세요 (당일 포함) | Enter a date on or before {max} |

Interpolate {min}/{max} as ISO text, not HTML. Calendar translations are specified separately. Visible hint/error nodes are linked by aria-describedby; set aria-invalid on affected fields. A persistent polite status region announces a new error once on validation, not every keystroke; do not duplicate assertive announcements. Invalid input never steals focus. Error text supplements the label and remains visible while the error persists. External error content is descriptive and can mark invalid but cannot make an invalid semantic date commit.

## Form, structure and acceptance

Single uses one successful canonical name; range uses `${name}.start` and `${name}.end`. Editable drafts have no successful name; canonical hidden inputs carry committed ISO text, or empty string for empty values. Disabled omits all successful entries. An enabled optional empty value contributes empty strings for its named canonical entries. Forward `form` to visible and hidden inputs, required/validity to visible inputs. Mirror current draft format/bounds/order/required validity using native setCustomValidity so invalid drafts block submit even when committed hidden values are valid. Submission validates pending drafts first and blocks an uncommitted differing draft until corrected/committed; it never silently sends a stale value. A valid pending draft may commit once during submit before native FormData construction; a controlled declined commit blocks that submission. Native invalid focus targets the first affected visible input. Do not call submit recursively. Uncontrolled reset restores initial committed value and display, closes popup, drops tentative state and errors, and emits zero. Controlled reset restores display from the current prop, closes popup and emits zero. Canceled reset changes nothing.

Parts: `root`, `label`, `control`, `start-input`, `end-input`, `trigger`, `hint`, `error`, `popup`; single uses `control`, range uses start/end parts. Root/field states: `disabled`, `invalid`; popup/trigger: `open` or `closed`. Content order: label/legend, input(s) with opener, hint, error, associated popup. Calendar contributes its own nested identity/parts.

Acceptance: valid leap day; invalid/non-padded dates; years 0001/9999; raw paste and IME composition; group-blur versus range-field focus; Enter and blur event count; same/rejected controlled commit; inclusive min/max and reversed/incomplete range; popup Confirm/Cancel consistency; translated Korean field/button/day names; error relationships; form data/reset/required and invalid-draft submit blocking. No browser locale or timezone may alter these expected values.
