# Local service-pattern examples

The four examples combine native components around real host-flow state: [input form/errors](../../examples/pattern-specs/form-errors.md), [search/filter/list/pagination](../../examples/pattern-specs/search-results.md), [consent/confirmation](../../examples/pattern-specs/consent-confirmation.md), and [service layout](../../examples/pattern-specs/service-layout.md). Their sample content identifies this repository as an independent project and makes no government-service claim.

Shared data/model, sixteen presentation snapshots and fifteen concrete scenario descriptors are implemented in the private [`test-contracts/patterns`](../../packages/test-contracts/src/patterns/index.ts) source. They supply no renderer. At this foundation handoff, seven real stable native compositions and their browser/framework tests are still required. These documents contain no executed framework coverage or T11 completion claim.

Use the [native handoff](native-handoff.md) to implement a framework's fixtures and presentation components, and the [source mapping](sources.md) to distinguish official guidance from independent sample choices. Pure logic is tested separately from native focus, accessibility, layouts, SSR/resume, form participation and visual checks. Stories use only injected presentation state; fixture behavior owns requests and retry.

All data and completion records are local, fictional and memory-only. There are no real authentication flows, personal records, agency operations, API requests, external assets or telemetry requirements. Production server validation/security is outside these sample flows.
