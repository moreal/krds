# Button

Semantic ID `button`; public export `Button`; source `component_05_02`: [KRDS Button](https://www.krds.go.kr/html/site/component/component_05_02.html). Read [common conventions](README.md).

## Official requirements

KRDS requires an accessible action name, keyboard operation with Enter/Space, and visible focus. Icon-only buttons need a functional text alternative; decorative icons beside a label must not repeat it. Buttons perform actions; navigation uses Link. Disabled actions are unavailable. Repeated data-submission activation must be guarded by the application while a request is in progress.

## Project API and defaults

Render an actual `button`. Options: `type: 'button' | 'submit' | 'reset'` (default `button`), `disabled: boolean` (false), `variant: 'primary' | 'secondary' | 'tertiary' | 'text' | 'icon'` (primary), `size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'` (medium), native `name`, `value`, `form`, `aria-label`, `aria-labelledby`, and native content. Icon is a presentation variant, not a different role. Label text is required unless an explicit accessible name is provided. Native `onClick` is the action notification; no value-change callback or selection state exists.

Pointer click, Enter and Space use native button activation, each producing one action callback. Do not synthesize a second click from a key handler. Space activates on key release. Disabled buttons are natively disabled, omitted from sequential focus and form successful controls, and execute zero callbacks. Setting disabled externally emits nothing. No automatic debounce or async loading state is implied: a submission owner disables the action while pending and handles idempotence.

`submit` participates in native form validation and includes name/value when it is the submitter; default `button` submits nothing. `reset` invokes the normal cancelable form-reset algorithm once. No controlled/uncontrolled state applies. A failed form validation is not a Button error state; field owners expose errors. Content order is label with optional decorative icon; keep focus ring unobscured.

## Structure and acceptance

Parts: `root`, `label`, `icon`. States: `disabled` on root; native focus/active pseudo-classes handle transient focus/press. No persistent pressed state; a toggle-button contract belongs to another component.

Native adapter acceptance: default button inside a form does not submit; explicit submit/reset works; each pointer/Enter/Space activation executes once; disabled activation executes zero times; icon-only controls expose a functional name; focus and label remain legible in forced colors and zoom. These tests require each framework's native renderer, not the contracts package.
