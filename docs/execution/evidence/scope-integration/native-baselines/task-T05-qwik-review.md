# T05 Qwik native foundation review

Spec compliance: ✅

Code quality: Approved

Reviewed only the Qwik fixture/Storybook scope against `task-T05-qwik-brief.md`, `task-T05-harness-interface.md`, and applicable constraints in `task-T05-brief.md`. Read the supplied exact scope diff once, the owner report, complete app dependency/target definitions, relevant saved evidence, and the installed published siheom Qwik entry/given implementation. Shared runners, manifests, and root orchestration are separate reviews. No tests were rerun and no app code was changed.

## Findings

- Critical: none.
- Important: none.
- Minor: none requiring changes for the scoped T05 foundation.

## Strengths and compliance evidence

- `apps/fixture-qwik/src/root.tsx:6`: Qwik store contains serializable fields only. The bridge and subscription remain local to `useVisibleTask$`; cleanup unsubscribes and disposes. The event QRL accesses `window.__KRDS_FIXTURE__` instead of capturing that object. Health and the exact missing-component note remain distinct from the explicit probe.
- `apps/fixture-qwik/src/root.tsx:25`: native button dispatch updates the installed bridge and records one JSON change event. `apps/fixture-qwik/vite.config.ts:6` uses the native Qwik optimizer in explicit CSR mode and the official loader. Saved production build evidence contains actual renderer/component/QRL chunks, and the contract probe report passes with coverage false.
- `apps/fixture-qwik/tests/siheom/native-probe.test.tsx:18`: actual published `@siheom/qwik` render/click/fill assertions exercise native state, controlled value plus state echo, and explicit cleanup. Installed `@siheom/qwik/src/given.ts` accepts `JSXOutput` and delegates to `@noma.to/qwik-testing-library.render`, matching the test API. The separate focus test at line 31 checks click focus and tab traversal. Saved Vitest evidence records both tests passing.
- `apps/fixture-qwik/vitest.config.ts:20`: native optimizer, actual Chromium provider, mode-selected nonempty suites, fixed browser environment, and loopback API configuration preserve the intended separation. Required test/compiler packages are directly declared at their consuming app, including DOM dependencies explicitly optimized for browser ESM interop. Fixture pins remain Qwik 1.20.3 / Vite 7.3.1.
- `apps/storybook-qwik/src/stories/probe.stories.tsx:6`: the three exact infrastructure IDs map shared built fixture state into native Qwik args; canonical cases remain marked pending. `apps/storybook-qwik/src/stories/native-probe.tsx:6` uses local Qwik state. No play, loader, API, authentication, or remote asset preparation appears in these sources. The native Storybook integration is selected explicitly in `.storybook/main.ts:4`.
- `apps/fixture-qwik/project.json:46` and `apps/storybook-qwik/project.json:53`: behavior targets call the common selected-framework runners, use uncached execution, and include shared catalog/config/runner inputs. Fixture build dependencies and Storybook production build prerequisites are present. Workspace commands expose local execution without a root-to-Nx recursion.
- Saved evidence supports fixture and Storybook production builds/typechecks, one contract probe, three story probes with zero request/axe violations, and two siheom tests. Parsed contract pilot results show all nine fail specifically with `native health passed` at the missing-feature boundary. Saved canonical story report lists all five required IDs missing; saved siheom pilot output passes health and exact missing note before failing to find the absent save button. These RED outcomes preserve the intended absent-widget boundary.

## Limits retained

This approval covers native T05 infrastructure only: zero KRDS widget/catalog coverage and no T07Q production SSR/resume/first-interaction evidence. The explicit CSR fixture and client Storybook do not satisfy that later gate. siheom actions use synthetic testing-library events inside real Chromium; the common built-fixture probe supplies separate production Playwright interaction evidence. The report distinguishes these accurately.

The ephemeral API-port reservation has a release/bind handoff; the owner documents it and retains Vitest port fallback. This is a disclosed bounded limitation, not evidence of a failed scoped requirement. Existing unused T01 entry files establish no extra rendering or SSR claim.
