# T05 Solid 2 RC native fixture review

Spec: ✅ Pass for the scoped preview fixture foundation.

Quality: Approved.

## Findings

- Critical: none.
- Important: none.
- Minor: none requiring a change within this scope.

## Scope and strengths

- `apps/fixture-solid-next/src/main.tsx:2` uses the selected Solid 2 signal/lifecycle API and native `@solidjs/web` rendering. The Vite and TypeScript configuration selects the native RC compiler/rendering path, with no foreign-renderer wrapper or source alias. Built public library and test-contract entry points are consumed.
- `apps/fixture-solid-next/src/main.tsx:20` maps bridge updates into native state through `onSettled`; the installed published `onSettled` declaration explicitly supports returning an owner-disposal cleanup. `onCleanup` disposes the bridge and the render disposer is connected to page lifecycle cleanup.
- `apps/fixture-solid-next/src/main.tsx:23` handles controlled count/label/disabled state and records one change event per accepted increment. The explicit infrastructure route stays separate from canonical missing-component notes; no pilot implementation or component coverage is implied.
- `apps/fixture-solid-next/tests/native-probe.spec.ts:7` serves production output on an allocated port and closes its owned server in `finally`. The tests exercise native controlled updates, event history, disabled interaction, focus/keyboard activation, all nine healthy missing pilot routes, navigation reset and native root disposal.
- `apps/fixture-solid-next/project.json:31` and `:43` use uncached test/contract targets with production build prerequisites; the selected shared contract runner does not recurse through the Nx target.

## Evidence checked and limits

Reviewed the scoped brief, shared harness protocol, global T05 constraints, implementation report, and the supplied exact scope diff once. Focused supporting reads covered the unchanged native compiler configuration, shared bridge semantics, installed lifecycle signature, saved logs and report JSON. No tests were rerun; no source files were modified.

The saved final logs support typecheck, production build and workspace lint, plus **3/3 native Playwright tests**, **1/1 Chromium probe**, and **1/1 WebKit probe**. The pilot Playwright report contains **nine native-health attachments**; its missing-feature assertion messages explicitly say native health passed. Those deliberate pilot failures remain required RED evidence, not implemented-component acceptance.

Firefox 1555 remains **unverified**: both recorded launches terminate with `Could not find profile folder` before fixture execution, using the system temporary directory and `/private/tmp`. Carry this concrete startup blocker into T13. This review does not claim Firefox compatibility or justify changing fixture code or a common TMPDIR default.

The siheom report fails explicitly because the stable Solid adapter does not cover this exact Solid 2 RC. The story report fails explicitly pending a verified native integration. Both limitations match the scoped preview exception; the unchanged Storybook candidate is not accepted as verified support. The report's synthetic probe classification is accurate. No KRDS widgets, SSR/T09 behavior, real-provider integration, IME/date semantics, axe acceptance or catalog coverage are approved by this review.
