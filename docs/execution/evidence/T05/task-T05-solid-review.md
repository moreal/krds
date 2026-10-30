# T05 Solid 1 independent scoped review

Spec compliance: ✅

Code quality: **Approved**

Scope: `apps/fixture-solid/` and `apps/storybook-solid/`, against the Solid brief, harness interface and T05 brief. Reviewed the supplied exact native-scope diff, owner report, selected unchanged native build/dependency configuration, installed siheom API source, retained logs and underlying result JSON. Shared drivers/runners, root configuration, catalog/manifest aggregation and other frameworks belong to separate reviews. No source edits, Git operations or test reruns were performed; this file is the review deliverable.

## Findings

- Critical: none found in the scoped change.
- Important: none found in the scoped change.
- Minor: none requiring correction for this infrastructure task.

## Specification checks

- ✅ Native Solid 1 state and lifecycle: `apps/fixture-solid/src/fixture-app.tsx:1` uses `solid-js` signals, `onMount`, `onCleanup` and `Show`; it imports built public package entries. The bridge subscription updates native state synchronously, enabled clicks update count and record one event, and cleanup unsubscribes/disposes. `apps/fixture-solid/src/main.tsx:4` parses the fixture route and query, renders natively and registers teardown.
- ✅ Explicit infrastructure boundary: `apps/fixture-solid/src/fixture-app.tsx:20` restricts interactive probe markup to `__probe/native-state`; canonical routes retain mounted health/bridge plus a missing-component note. Nothing in this scope represents a KRDS widget implementation.
- ✅ Published siheom API: `apps/fixture-solid/tests/siheom/native-probe.test.tsx:6` passes a component function to `given.render`. Installed `@siheom/solid` 0.3.2 `src/given.ts` confirms that exact signature and native testing-library render. The smoke covers render/click, controlled count/label updates, disabled input, event/state observations and explicit DOM/bridge cleanup, including rejected updates after disposal. Focus is a separate test at line 26. Setup also cleans up after every test.
- ✅ Honest input semantics: installed Solid `src/index.ts` selects core `defaultActions`; installed core `src/action.ts` uses `@testing-library/user-event` by default. These tests exercise synthetic DOM input in real Chromium. The report correctly separates this from independent production Playwright browser input and makes no trusted-input claim for siheom.
- ✅ Native local stories: `apps/storybook-solid/.storybook/main.ts:8` resolves the installed Solid framework preset. `apps/storybook-solid/src/stories/probe.stories.tsx:6` declares the exact infrastructure title and three exports, maps serializable infrastructure state to local args, and keeps canonical states unrepresented. `native-probe.tsx:13` uses native Solid state/props. No play, loader, remote state preparation, authentication or external assets occur in the scoped stories.
- ✅ Execution boundaries: fixture and Storybook Nx targets call selected root runners without calling themselves; build targets call workspace `build:local`. Contract/siheom/stories targets retain build prerequisites, cache disabling and common scenario/catalog/config inputs. `apps/fixture-solid/vitest.config.ts:11` selects separate probe/pilot files and explicitly fails on an empty suite. Both apps retain their own output directory, declared native dependencies and shared library project dependencies. No source alias, foreign renderer substitution or Solid 2 integration was introduced.

## Evidence assessed

The retained evidence supports the owner's reported executions; these counts describe recorded runs, not fresh reviewer reruns:

| Recorded execution | Reviewed result |
| --- | --- |
| Native fixture production build and native Storybook static build | Completion output in final build logs; fixture dist output and Storybook `dist/iframe.html`/`dist/index.json` retained |
| Fixture/Storybook typechecks and workspace check | Reported exit 0; typecheck logs are empty, workspace checker explicitly reports verification |
| Production contract probe | 1 passed; report marks `coverage: false` |
| Infrastructure stories | Exactly 3 expected IDs in retained index; all 3 report passed, with local requests, zero policy violations and axe 4.14.0 zero violations |
| siheom native probe and separate focus | Original Vitest JSON records success, 2 passed and 0 failed; summary marks `coverage: false` |
| Canonical production contracts | Original Playwright JSON has nine `native-health.json` attachments with `healthy:true` and framework `solid`; nine feature failures match the missing-widget notes |
| Canonical stories | Five exact canonical IDs report missing and fail |
| Canonical siheom | One disabled-button failure; original snapshot shows health `ready` and `Component not implemented: button/disabled` before the absent button assertion |

The final logs and report copies are under `.superpowers/sdd/PLAN/t05-solid-logs/`; original JSON locations are recorded in the owner report. No concrete unresolved doubt required a browser/build rerun. Shared request-policy implementation and its negative proof remain core-review responsibilities; scoped story evidence demonstrates the three positive local-asset runs only.

## Strengths and acceptance limits

The implementation is small, uses actual Solid lifecycle/rendering, tests disposal explicitly, and preserves intentional default RED outcomes. Probe and canonical behavior are separate, and evidence does not inflate probe success into catalog coverage. The native Storybook preset resolution is supported by a completed static build and the expected retained story index.

Approval is for the Solid 1 T05 foundation only. Actual KRDS button/select/modal/tabs/date-input implementations, their canonical stories and their accessibility/behavior acceptance remain future work. This review does not establish full component support, Solid 2 support, cross-browser acceptance, or repository-wide integration correctness.
