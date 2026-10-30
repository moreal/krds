# T05 Angular native foundation independent review

Spec compliance: ✅

Code quality: Approved

Reviewed the supplied 24-file Angular application diff against `task-T05-angular-brief.md`, `task-T05-harness-interface.md`, and `task-T05-brief.md`. Scope is `apps/fixture-angular/` and `apps/storybook-angular/`; shared runner, dependency peer repairs, and root integration have separate owners. No implementation files were changed, no tests were rerun, and no Git operations were performed.

## Findings

- Critical: none.
- Important: none.
- Minor: none requiring changes within this native foundation scope.

## Compliance and strengths

- `apps/fixture-angular/src/fixture-app.ts:22` creates the actual Angular protocol bridge; the immediate subscription maps its state into an Angular signal. `NativeProbe` receives native inputs and emits a native output. The click handler records one semantic change and synchronously schedules the merged count update through the bridge. `apps/fixture-angular/src/fixture-app.ts:31` unsubscribes and disposes on Angular destruction. Missing canonical routes retain native health and explicitly identify their absent widget rather than substituting probe markup.
- `apps/fixture-angular/src/main.ts:1` uses official `bootstrapApplication`; the application configuration selects `@angular/build:application`. Built public package imports remain intact, without source aliases or another framework renderer. Saved production build and contract-probe evidence independently exercise the official CLI result.
- `apps/fixture-angular/tests/siheom/native-probe.test.ts:19` exercises native render, click, externally controlled signal updates, a subsequent click, and DOM removal through official TestBed destruction. Separate synthetic and trusted-provider tests establish focus; the trusted test explicitly checks `event.isTrusted`. Inspection of installed `@siheom/angular` confirms its render path delegates to Testing Library Angular and uses published core actions/assertions; installed core actions use Testing Library user-event. This supports the report's distinction between synthetic adapter input and Playwright provider input.
- `apps/fixture-angular/vitest.config.ts:10` keeps legacy decorator lowering test-only, with selected TypeScript preceding official JIT TestBed. It does not purport to validate AOT. Probe/default file selection is explicit and `passWithNoTests: false` prevents an empty behavioral pass. The loopback port reservation closes before Vitest starts; the residual release race is acknowledged, with normal alternate-port behavior retained. Setup resets TestBed after every test.
- `apps/storybook-angular/src/stories/probe.stories.ts:6` maps pure shared fixture state into three native Angular stories with the prescribed IDs. Story code has no loaders, plays, API calls, authentication, or external asset dependencies. Native Angular inputs own rendering. Storybook's official Angular builder, framework resolution from its consuming workspace, and application-local output are appropriate.
- `apps/storybook-angular/tsconfig.json:5` enables emission for the official Storybook build while the typecheck command explicitly requests no emit. The report documents the earlier indexed-but-empty-CSF failure and follows the fix with real production story execution. Disabling unused Compodoc through the official builder option is justified for this infrastructure-only Storybook.
- Angular Nx contract/siheom/stories targets declare build prerequisites, disable caching for behavior execution, and call shared selected-framework runners. Local siheom/build commands terminate in native tools rather than recursively invoking Nx. Fixture and Storybook implicit dependencies include their native library and shared test contracts, tokens, and styles.

## Evidence assessed

The owner report and saved artifacts support: official production fixture build; fixture/test/Storybook typechecks; official static Storybook build; production contract probe 1/1; native published siheom probe 3/3; native production stories 3/3; and one real-browser negative request-policy test. Inspected probe report JSON records no widget coverage. Story reports record eight local requests per state, zero forbidden requests, and axe 4.14.0 with zero reported violations.

Saved canonical reports show nine contract failures, nine siheom failures, and five missing canonical stories. The siheom failure snapshots show native `Fixture health` as `ready` and the matching missing-component note before the missing widget observation. These are intentional T05 failure observations, not completed component behavior tests. The hard-coded missing-note checks and minimal first observations must be replaced/expanded by the owning component tasks before any semantic coverage claim.

No fresh build or browser run was necessary to resolve a concrete outstanding doubt. Successful typecheck logs are empty, so their exit status is owner-reported rather than independently re-executed here. Existing browser evidence is Chromium only. Production AOT/CLI proof and test-only JIT proof are separate; neither establishes Angular forms integration, APF release correctness, widget SSR, or actual KRDS behavior, which remain T07A/component work.

The historical Angular contract-pilot report contains `coverage: true` beside a failed result. The controller confirms this was the old canonical-selection field and that current core reports distinguish `canonicalSelection` from `coverageAwarded: false`, reviewed separately. No Angular source or owner claim awards implementation coverage. Treat that historical field as schema ambiguity, not successful widget coverage.

Approval applies to the Angular native T05 foundation only. Shared runner shutdown/request-policy correctness, current common-report schema, root peer repairs, cross-framework selection, and affected inputs remain the separate core review's responsibility.
