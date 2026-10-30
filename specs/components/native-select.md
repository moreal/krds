# NativeSelect

Semantic ID `native-select`; export `NativeSelect`; source `component_06_03`: [KRDS Select](https://www.krds.go.kr/html/site/component/component_06_03.html). Read [common conventions](README.md).

## Official requirements

KRDS identifies this as the platform's native single-selection control, requires a label/accessible name, keyboard access, and no form submission solely from changing a selection. Multiple choice belongs to another component. Platform-native popup navigation, opening, closing and typeahead remain browser/OS behavior.

## Project API and defaults

Options: `options: SelectOption[]` (required, unique string values), `value?: string`, `defaultValue?: string`, `name?: string`, `required: boolean` (false), `disabled: boolean` (false), `invalid: boolean` (false), `size: 'small' | 'medium' | 'large'` (medium), `id`, label content, hint/error content and `onValueChange(ValueChangeDetails<string>)`. Native naming attributes and `form` are supported. No `multiple`, custom listbox, synthetic popup or renderer substitution.

Render a real `select` containing real `option` elements in source order. Associate a visible label with its id; `aria-label`/`aria-labelledby` is the explicit alternative when visible context makes its purpose clear. Hint and visible error IDs appear in `aria-describedby`; invalid sets `aria-invalid=true` without hiding the hint. Each option uses its label as text and native disabled state. User selection of a disabled option is impossible; an explicitly supplied controlled disabled-option value may still display, matching native select behavior.

Uncontrolled initialization uses defaultValue when supplied, otherwise the first non-disabled option; when no enabled option exists the selection is absent and the committed semantic value is `''`. Use an explicit enabled empty-valued placeholder option when a required unselected state is wanted. Nonempty values absent from options are configuration errors; `''` may represent no selection when no matching option exists (`selectedIndex=-1`). An empty-valued option is never silently inserted. Form reset restores this exact initial selection, including no selection, with zero change callbacks. The adapter restores the initial baseline even when native defaultSelected alone cannot represent it. Controlled reset re-applies the current value.

A native committed change to a different value emits once with `{value}`. It never submits, navigates or focuses another field. Controlled attempts are requests; if declined, reapply the current prop after the change handler. Clicking an already selected option or reapplying a prop emits zero. Do not duplicate notifications from native input and change.

## Keyboard, form and structure

Tab/Shift+Tab visit the select unless disabled. Browser/OS owns arrow keys, Enter/Space, Escape, popup focus and typeahead; do not intercept them to imitate a custom select. Do not require the same popup key sequence across operating systems.

Native name/value, required validity, disabled omission and form association apply. Empty required values block native submission. A select with no selection contributes no successful value; an empty-valued selected option contributes the empty string. Disabled state on the whole select omits it from form data. Prop changes and reset emit zero public value events.

Parts: `root`, `label`, `control`, `hint`, `error`, optional decorative `icon`. Root/control states: `disabled`, `invalid`; option disabled semantics stay native. Content order: label, control, hint/error. Acceptance: real select inspection, FormData, disabled options, required empty selection, controlled parent rejection, reset to initial default, no submit-on-change and exactly one notification per committed change.
