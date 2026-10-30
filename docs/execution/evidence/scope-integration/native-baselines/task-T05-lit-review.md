# T05 Lit native foundation scoped review

Spec compliance: ✅

Quality: Approved

No Critical, Important, or Minor findings in the supplied native app-owner diff.

## Scope and evidence

Reviewed `AGENTS.md`, the scoped Lit brief, shared harness interface, complete T05 brief/global constraints, the implementation report, and the supplied exact source/config/test diff. This is a read-only source review of `apps/fixture-lit/` and `apps/storybook-lit/`; shared bridges, runners, manifests, and request-policy implementation belong to the separate core review. No tests were rerun, no source files were changed, and no Git action was taken.

The executed evidence reported by the owner supports the scoped approval: fixture and Storybook production builds/typechecks, one native lifecycle test, one shared contract probe, and three production Storybook state tests passed. All nine canonical contract cases reportedly passed native health before the expected missing-feature failures; all five canonical story entries remain intentionally absent. These failures are the required T05 evidence of unimplemented pilots, rather than blockers for this foundation scope.

## Strengths

- `apps/fixture-lit/src/main.ts:18`: native Lit connection creates the shared protocol bridge and subscribes immediately; state assignment schedules native rendering. Disconnect unsubscribes and disposes the bridge. The explicit probe maps count, label, and disabled state into native controls, records one change event per enabled click, and keeps missing pilot routes visibly distinct.
- `apps/fixture-lit/tests/contract/native-probe.test.mjs:9`: the production-browser test checks protocol/framework identity, initial state, click and controlled update, exact event history, bridge state, disabled state, shadow-root focus, disconnect disposal, and an empty event history on a new missing-feature route. It exercises behavior beyond a successful mount.
- `apps/storybook-lit/src/stories/probe.stories.ts:30`: pure shared state is mapped to native Lit properties and three explicit CSF exports with the agreed infrastructure IDs. The stories contain no loaders, play functions, authentication, or remote assets. The built public adapter entry is consumed without a foreign renderer.
- `apps/fixture-lit/project.json:47` and `apps/storybook-lit/project.json:65`: contract/story targets invoke shared runners directly, use build prerequisites, and disable behavioral caching. The Storybook target performs a real WebComponents/Vite production build into its own `dist`; package scripts provide actual tests rather than unconditional success.
- The report treats Lit siheom as upstream-unsupported and documents the native Playwright alternative without inventing an adapter, widening peers, or claiming KRDS catalog coverage.

## Limits

Approval covers the T05 native infrastructure only. Probe rendering supplies zero KRDS catalog coverage. The reportedly inspected default probe screenshot establishes infrastructure visibility; it is not KRDS visual acceptance. Actual widget semantics, canonical stories, future component behavior suites, and component visual acceptance remain the owning implementation tasks.

The reported input evidence is Chromium with Playwright-generated clicks and programmatic browser focus, not physical input, real IME, screen-reader, Firefox, or WebKit verification. Shared runner/request-policy correctness and final aggregate manifest claims remain subject to the separate core review.
