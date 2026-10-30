# Four service compositions

These are concrete host-flow contracts awaiting native integration. Source/data tests do not establish that any framework composition runs. T11 remains incomplete until all seven stable native fixtures execute these flows and their required checks pass with independent review.

| Pattern ID | Native route | Binding flow contract |
| --- | --- | --- |
| `form-errors` | `/examples/form-errors?case=error-summary-focus` | [Input form and errors](form-errors.md) |
| `search-results` | `/examples/search-results?case=filter-resets-page` | [Search, filter, list and pagination](search-results.md) |
| `consent-confirmation` | `/examples/consent-confirmation?case=modal-focus-return` | [Consent and confirmation](consent-confirmation.md) |
| `service-layout` | `/examples/service-layout?case=navigate-current` | [Header, navigation and footer](service-layout.md) |

The canonical scenario objects are [`patternScenarios`](../../packages/test-contracts/src/patterns/scenarios.ts). Each has its exact route, seed, initial pure actions and subsequent user/driver steps. Those descriptors are future integration obligations, not catalog coverage, executed tests or permission to activate the full-catalog runner. Existing ten pilot scenarios stay unchanged.

Read the [native composition handoff](../../docs/patterns/native-handoff.md) for module consumption, fixture commands, DOM IDs and framework-specific ownership. Preserve the accepted [component contracts](../../specs/components/README.md), especially actual form participation, native focus, controlled rejection and reset notification rules. Neither these contracts nor common logic render DOM.
