# T05 affected-selection metadata review

Spec compliance: ✅ for the scoped root metadata correction and affected-selection acceptance evidence.

Code quality: **Approved**. No Critical, Important or Minor findings in this one-line change. The four common-code fix1 findings remain closed; this review does not reopen native or common behavior logic.

## Change assessment

`nx.json:20` adds `{workspaceRoot}/specs/components/**/*` to `namedInputs.sharedGlobals`. This reaches targets through their existing `default` input even when a project target replaces the root target-default `inputs` array. It corrects the demonstrated loss of the actual spec-documentation input without editing individual native targets or changing dependencies, executors or runtime behavior.

The broader invalidation is an explicit, acceptable initial-pipeline tradeoff: a component-spec change now affects all 32 projects. This favors complete spec-triggered verification over a more selective per-component model. The recorded native-only checks retain framework-specific scope, so the correction does not generally make all native edits global.

## Evidence assessed

Read the exact one-line diff, affected report, assertion log and graph-export logs. Then independently parsed the persisted real Nx project/task graphs and compared current Nx JSON against the before snapshot. The fresh read-only artifact assertion confirmed:

- The complete current Nx JSON differs from the snapshot by exactly the single shared spec glob.
- Before correction, the spec change selected 4 contract, 1 siheom, 1 Storybook-build and 1 stories target.
- After correction, both the actual spec path and common fixture-data path select all graph-declared **8 contracts, 6 siheom, 8 Storybook-build and 8 stories** targets. Every relevant exported target includes `default`; all seven required stable Storybooks are included. Unsupported Lit/Solid-next siheom targets remain absent.
- An app-private Solid fixture change selects only Solid contract/siheom; a Solid public-package source change also selects only Solid Storybook build/stories.
- A story-manifest change selects all graph-declared Storybook build/stories targets; additional fixture selections are consistent with their declared manifest inputs.
- The actual spec affected-project list contains 32 projects.
- Lock SHA remains `136bebc1c213d0bc274b905ee291fa096beefa4dbbaece6ecf915689adadf4f4`.

The supplied evidence uses selected Nx 24.0.2 actual `--files` project/task-graph modes in the unborn repository. The before failure and after success are nonempty graph observations, not assumptions based only on static configuration. The initial `--explain` invocation error is disclosed and corrected; it is not represented as a HEAD/base limitation.

## Evidence limits and declined judgments

- Task-graph export verifies selection and dependency wiring, **not execution, successful builds, native behavior or tool support**. In particular, the eighth preview Storybook target's graph presence does not establish a supported Solid2 Storybook integration.
- The all-32-project cost ruling is accepted for this stage; performance tuning and per-component dependency optimization are outside this correction.
- Native/component/common behavior and the already approved four fix1 corrections are outside this re-review.
- No Nx command, test, build, browser, installation or dependency operation was rerun. This reviewer performed only artifact reads/assertions and wrote this report.

## Assessment

**Approved to integrate for T05/T06 progression.** The actual graph evidence demonstrates that the shared input repairs the reproduced selection gap while preserving appropriate native-change scope. Overall T05 acceptance and existing browser/coverage limits remain the controller's aggregation decision.
