# Forms and controlled state

Use each framework's native public API. Shared semantic values and callbacks describe the request; the native renderer owns its props, event transport, lifecycle and form integration.

## Pick one state owner

A defined `value` or `open` is controlled. Without it, the supported default initializes uncontrolled state once. Do not supply both controlled and default values or switch modes after mount. A user callback requests a change; a controlled parent may reject that request. The visible committed UI must continue to reflect the parent.

Mounting, hydration, prop updates and form reset emit no user-change callback. Disabled and no-op actions also emit no change. An uncontrolled noncanceled reset restores its initial baseline; a controlled reset leaves the parent's value authoritative. A canceled reset changes neither state nor notification count.

## Submit real values

[Button](../components/button) defaults to `type="button"`. Choose `submit` or `reset` explicitly. A named submitter is part of native form semantics; a disabled action submits nothing and runs no action callback. The application owns pending-request guards and idempotence.

[NativeSelect](../components/native-select) uses actual select/options and canonical string values. Do not treat display labels as submitted data. For Lit, inspect the adapter's actual form-associated custom element and `ElementInternals` policy; an internal Shadow DOM input does not automatically join the host form. Angular form-bearing controls must use the documented CVA path and retain the expected touched, disabled and reset behavior.

## Preserve a date draft

[DateInput](../components/date-input) keeps the user's raw text draft separate from the committed date-only value. Invalid text remains editable. IME composition does not prematurely commit. A range submits its documented `.start` and `.end` entries once each. Display validation and the committed canonical value are different states.

[Calendar](../components/calendar) is a tentative selection surface. Confirm commits a meaningful changed value; cancel abandons a tentative choice. It has no implicit form value or modal behavior. DateInput composes its own native popup policy.

## Content and errors

Supply a visible label, persistent help/error relationship IDs where needed, and concise corrective text. An invalid control must be understandable without color alone. Do not replace native events with synthetic duplicates; native Enter/Space activation should notify once. Check each [component reference](../components/) for its exact events, defaults, structure and keyboard rules.
