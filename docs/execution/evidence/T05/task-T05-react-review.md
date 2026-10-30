# T05 React foundation review

Spec: ✅ conforming within the scoped T05 React foundation requirements.

Quality: Approved.

Critical: none. Important: none. Minor: none requiring changes for this scope.

## Scope and evidence

Read the React brief, shared harness interface, complete T05 brief, owner report, and exact React review package once. Reviewed only `apps/fixture-react` and `apps/storybook-react`; shared runners, root configuration, manifests, and core protocol implementation are separately owned. Focused supplementary reads checked existing workspace dependencies/project headers, installed published `@siheom/react` implementation, and recorded result artifacts. No test reruns, source changes, commits, publishing, or subagents.

## Findings and strengths

- `apps/fixture-react/src/FixtureApp.tsx:17`: native React effect creates the framework bridge, subscribes native state immediately, and removes the subscription and disposes the channel on unmount/route dependency change. Health is gated on bridge creation. The explicit probe maps semantic count/label/disabled state to React props; clicks record one change and update bridge state. Canonical routes retain the required missing-component note rather than fabricated widgets.
- `apps/fixture-react/src/NativeProbe.tsx:8` and `apps/fixture-react/src/main.tsx:1`: rendering and state interaction remain native React. Built package entry imports are used; no foreign renderer or source alias is introduced.
- `apps/fixture-react/tests/siheom/native-probe.test.tsx:7`: `createReactSiheom({ user: userEvent })` matches installed published 0.4.1 source. That source forwards the supplied user to native action registries, while `given.render` creates React roots inside React `act`. The smoke covers render, provider click, controlled update to 7, subsequent click to 8, and explicit DOM cleanup. The separate test at line 37 checks actual button focus after provider input. `tests/setup.ts:7` supplies cleanup after every test as well.
- `apps/fixture-react/vitest.config.ts:12`: explicit probe/pilot file selection and `passWithNoTests: false` prevent empty-suite success. Browser locale, timezone, color scheme, motion, viewport, and ignored artifact directories are explicit. Canonical files stay separate from probes and stories; their current assertions intentionally stop at missing features after native health/protocol checks.
- `apps/storybook-react/src/stories/native-probe.stories.tsx:18`: the three exact infrastructure IDs derive their native args from built pure shared fixtures. Default/loading/error are local states; there are no loaders, play functions, API/auth/CDN/remote asset dependencies, or fabricated canonical IDs. `.storybook/main.ts:6` uses the native React Vite integration with workspace-local resolution and telemetry disabled.
- `apps/fixture-react/project.json:48` and `apps/storybook-react/project.json:49`: execution flows through common runners without a root/Nx recursion loop. Contract/siheom/stories targets build the owning app and dependencies, disable result caching, and list shared contract/catalog/config inputs. Package scripts reach local native builders and actual nonempty tests. Direct dependencies and implicit shared library/CSS dependencies are present.

## Recorded verification assessed

Owner evidence supports successful native fixture build and typecheck, native Storybook build and typecheck, 1/1 production fixture probe, 2/2 real-provider siheom smoke/focus probes, and 3/3 native Storybook states. The final story report records only local asset/index requests, no policy violations, and axe 4.14.0 with no violations. The shared negative request-policy log records 1/1 passing guard test; its implementation is outside this review.

The default paths intentionally remain RED: nine canonical contract cases, nine canonical siheom cases, and five missing canonical story IDs. The report clearly distinguishes those failures from healthy infrastructure and attributes zero KRDS component/catalog coverage to probes. No native widget behavior, KRDS accessibility acceptance, modal focus policy, select behavior, tabs interaction, or date semantics is accepted by this review.

## Limits

This is a foundation approval using the provided exact diff and existing execution evidence, not a new execution certification. The siheom cleanup assertion establishes native probe DOM cleanup; bridge disposal is established by the fixture effect code rather than a dedicated bridge-unmount regression test. Canonical siheom feature-presence RED gates must become behavioral tests when their owning widget implementations arrive. The common runner/protocol/request-policy correctness and repository-wide integration remain the controller/core review's responsibility.
