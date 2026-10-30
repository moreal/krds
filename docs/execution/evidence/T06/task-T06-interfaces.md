# T06 Solid reference pilot handoff

Read task-T06-brief.md first. T00–T05 foundations are implemented and independently reviewed. Authoritative semantics: specs/components/README.md plus button/native-select/modal/tabs/date-input/calendar.md. Exact common observable contracts: tools/testing/contract.spec.ts, observations.mjs, catalog/fixture-cases.json and task-T05-harness-interface.md final clarification. Initial canonical suites are healthy missing-implementation RED.

## Binding reviewed details

- Every component/owned part uses the documented data-krds-component/part/state contract; styles are built public exports from @krds-native/styles. Read token/style READMEs. Explicitly opt into reset/local font styles in standalone fixtures, never make public component imports pull all CSS/fonts.
- Controlled parent values are authoritative even when the parent rejects a user request. Prop updates and form reset must not re-emit user changes. Native select DOM restoration cannot rely only on a prop effect when the value stays unchanged.
- Tabs and Calendar preserve sequential Tab access required by frozen KRDS; do not inherit a roving-only backend default. Manual Tabs activation is default. Modal Escape cannot be opted out when a close button exists; initial focus dialog/first interactive only; usable opener takes precedence, otherwise the exact fixture fallback is next-task button.
- Date-only values are strict ISO Gregorian1–9999, independent of timestamp timezone conversion. Kiritimati/Los_Angeles are distinct actual browser contexts. IME simulation is not physical OS IME evidence. Calendar confirmation/cancel, range drafts and invalid-form values must follow specs.
- Calendar in-range border is separate from focus outline. Actual focused in-range and endpoint combinations, including forced colors, must be rendered and reviewed.
- Native providers/Portal/theme/lifecycle belong to Solid. Shared contracts may carry only plain semantic data/pure functions. Additional truly shared date helpers go via controller/T02 owner with tests/review before other adapters consume. No generic UI renderer or foreign-renderer wrapper.

## Parallel component ownership

T06 lead owns Solid providers/internal integration, public index/build/export/config/README, fixture-solid src and configs, Storybook common config, shared fixture/story/coverage data and final integration evidence. Lead first writes stable provider/API/test-queue handoff task-T06-solid-interface.md and announces readiness. Controller dispatches three component owners:

- controls: components/button +native-select; matching own siheom tests and canonical story files.
- overlays-tabs: components/modal +tabs; matching tests/stories.
- dates: components/date-input +calendar; matching tests/stories.

No component owner edits shared index/provider/fixture source/catalog/lockfile. Each exports its component and own adapter Props from its directory; lead publishes ready public exports. All components use exact common payload types where applicable, with normal Solid native props/children/callbacks. Lead adapts fixtures to their documented native APIs. Root manifest/lock/Nx changes remain T01 sole owner.

Only one lead-owned public dist build/browser test queue runs for the same Solid workspace, preventing concurrent Vite caches/dist writers. Workers write meaningful native tests before implementation and request serialized RED/GREEN runs/build availability through lead/controller; no unrun pass claims. Plain inspection tests stay outside canonical coverage.

Actual Storybook/siheom/contract and visual outputs must be validated after all six components land. Any partial source review is not T06 acceptance. Do not stop at simple controls or replace remaining components with generic containers. Commit/model identity remains unavailable to Sol; leave uncommitted.
