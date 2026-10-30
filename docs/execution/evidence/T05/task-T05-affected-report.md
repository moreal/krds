# T05 focused affected-selection acceptance

Status: **PASS after one conservative root Nx input correction.** Actual selected Nx 24.0.2 explicit `--files` project/task graph modes work in this unborn Git repository; no HEAD/base commit was needed. No build, test, browser, install, commit or index operation was executed.

## Concrete gap reproduced before correction

`specs/components/button.md` initially selected only four fixture contract targets: Angular, Lit, React, Solid-next. It missed **Qwik, Solid, Svelte and Vue**. The same change initially selected only React siheom, missing **Angular, Qwik, Solid, Svelte and Vue**. The before task graph also selected only React Storybook targets for this spec change.

The real merged Nx project graph showed that per-project target `inputs` arrays replace the root target-default input arrays. Several native targets listed `packages/contracts/src/specs/**/*` but omitted the actual source documentation glob `specs/components/**/*`; the root `contract` default's correct spec glob was therefore lost when overridden. All graph-exported `contract`, `siheom`, `storybook-build` and `stories` targets include `default`. This was reported to the controller before mutation; the controller authorized the smallest conservative root shared-input correction.

Evidence before the fix:

- `t05-affected-logs/spec-contract-projects.json`: actual `nx show projects --affected --files=specs/components/button.md --with-target=contract --json` selection.
- `spec-task-graph.json`, `selection-summary.json`, `acceptance-results.json`: actual four-family task selection and precise missing projects.
- `project-graph.json`, `spec-input-metadata.json`: real Nx merged target metadata showing the overridden inputs.
- `spec-explain-contract.log`: actual Nx `--explain` JSON identifies only the four touched contract tasks. The first explain attempt lacked `--withTarget` and exited 1 (`spec-explain.log`); adding `--withTarget=contract` succeeded. This was an invocation requirement, not a Git/HEAD limitation.

## Exact source change and tradeoff

Only authored configuration file changed: `nx.json`.

```diff
       "{workspaceRoot}/upstream/krds/manifest.json",
+      "{workspaceRoot}/specs/components/**/*",
```

This adds the actual spec source through `namedInputs.sharedGlobals`, already included by the common `default` input even when project-level target arrays override target defaults. No native target metadata or implementation required edits. An exact parsed-JSON equality assertion verifies that this is the only Nx change against `nx-before-spec-fix.json`.

Tradeoff accepted by the controller: a component-spec change now marks **all 32 projects** affected (`spec-fixed-projects.json`), conservatively invalidating their applicable tasks/builds. This is broader than a tuned per-component dependency model, and preserves correctness for the initial pipeline. No runtime or source behavior changed.

## Actual graph-only commands

All commands execute through `node tools/yarn.mjs`, selecting Node 24.18.0 and vendored Yarn 4.14.1. Local CLI help for this selected Nx 24.0.2 was inspected and persisted as `show-projects-help.log` and `affected-help.log`. Its `--graph=<file>` mode explicitly previews/saves task graphs instead of executing tasks.

The four requested changed paths and a supplemental actual Solid package entry were each checked before and after the correction. The exact final command shape was:

```sh
node tools/yarn.mjs nx affected -t contract,siheom,storybook-build,stories --files=<changed-file> --graph=.superpowers/sdd/PLAN/t05-affected-logs/<label>-fixed-task-graph.json
```

| Changed file | Final graph label | Actual final relevant target selection |
| --- | --- | --- |
| `specs/components/button.md` | `spec-fixed` | All8 fixture contracts, all 6 supported siheom, all 8 Storybook build/stories (including all 7 required stable frameworks) |
| `packages/test-contracts/src/fixtures/index.ts` | `common-fixed` | Same complete8/6/8/8 target selection |
| `apps/fixture-solid/src/fixture-app.tsx` (exists) | `native-fixed` | Only `fixture-solid:contract` and `fixture-solid:siheom`; no Storybook selection from an app-private source change |
| `catalog/story-cases.json` | `stories-fixed` | All8 `storybook-build` and `stories` targets; fixture Qwik/React/Solid contract/siheom also selected because those targets explicitly consume this manifest |
| `packages/solid/src/index.ts` (supplemental native package proof) | `native-package-fixed` | Solid fixture contract+siheom and Solid Storybook build+stories only; no other framework targets |

Every task-graph command exited 0 with nonempty, independently inspected task objects; none was treated as success merely because it returned an empty graph. Task graphs include required dependency build tasks as metadata, but **no executor was run**. Log files contain only graph-export confirmation, not task execution output. Unsupported Lit/Solid-next siheom targets were correctly absent.

Additional actual Nx commands:

```sh
node tools/yarn.mjs nx show projects --affected --files=specs/components/button.md --json
node tools/yarn.mjs nx graph --file=.superpowers/sdd/PLAN/t05-affected-logs/project-graph-fixed.json
```

Both exited 0. The project selection contains 32 names. The exported full project graph supplies the actual available targets used to derive expectations; validation asserts eight contracts, six supported siheom targets, and all eight Storybook targets including the seven mandatory stable targets. There is no inferred static-only affected claim.

## Covering assertions and evidence

`acceptance-fixed.log` contains assertions against the task objects from all five real final Nx task graphs. It verifies:

- Spec/common fixture changes select every graph-declared contract/siheom/Storybook target.
- Story-manifest changes select every graph-declared Storybook build/stories target.
- The Solid fixture and native package retain their appropriate framework-specific scope.
- Root Nx changed only by the single shared spec glob.
- Lock SHA256 is unchanged: `136bebc1c213d0bc274b905ee291fa096beefa4dbbaece6ecf915689adadf4f4`.

Actual assertion output:

```text
spec-fixed {"contract": ["fixture-angular", "fixture-lit", "fixture-qwik", "fixture-react", "fixture-solid", "fixture-solid-next", "fixture-svelte", "fixture-vue"], "siheom": ["fixture-angular", "fixture-qwik", "fixture-react", "fixture-solid", "fixture-svelte", "fixture-vue"], "storybook-build": ["storybook-angular", "storybook-lit", "storybook-qwik", "storybook-react", "storybook-solid", "storybook-solid-next", "storybook-svelte", "storybook-vue"], "stories": ["storybook-angular", "storybook-lit", "storybook-qwik", "storybook-react", "storybook-solid", "storybook-solid-next", "storybook-svelte", "storybook-vue"]}
common-fixed {"contract": ["fixture-angular", "fixture-lit", "fixture-qwik", "fixture-react", "fixture-solid", "fixture-solid-next", "fixture-svelte", "fixture-vue"], "siheom": ["fixture-angular", "fixture-qwik", "fixture-react", "fixture-solid", "fixture-svelte", "fixture-vue"], "storybook-build": ["storybook-angular", "storybook-lit", "storybook-qwik", "storybook-react", "storybook-solid", "storybook-solid-next", "storybook-svelte", "storybook-vue"], "stories": ["storybook-angular", "storybook-lit", "storybook-qwik", "storybook-react", "storybook-solid", "storybook-solid-next", "storybook-svelte", "storybook-vue"]}
native-fixed {"contract": ["fixture-solid"], "siheom": ["fixture-solid"], "storybook-build": [], "stories": []}
stories-fixed {"contract": ["fixture-qwik", "fixture-react", "fixture-solid"], "siheom": ["fixture-qwik", "fixture-react", "fixture-solid"], "storybook-build": ["storybook-angular", "storybook-lit", "storybook-qwik", "storybook-react", "storybook-solid", "storybook-solid-next", "storybook-svelte", "storybook-vue"], "stories": ["storybook-angular", "storybook-lit", "storybook-qwik", "storybook-react", "storybook-solid", "storybook-solid-next", "storybook-svelte", "storybook-vue"]}
native-package-fixed {"contract": ["fixture-solid"], "siheom": ["fixture-solid"], "storybook-build": ["storybook-solid"], "stories": ["storybook-solid"]}
PASS: real Nx task graphs select all 8 fixture contracts,6 supported siheom,8 Storybook build/stories (including required7 stable) for spec/common changes; Solid fixture/package remain appropriately scoped; story manifest selects all stories.
Exact source diff: added only {workspaceRoot}/specs/components/**/* to nx.namedInputs.sharedGlobals.
Lock SHA unchanged: 136bebc1c213d0bc274b905ee291fa096beefa4dbbaece6ecf915689adadf4f4
```

Final structured selection is persisted in `selection-summary-fixed.json`; expected graph-declared project lists in `expected-target-projects.json`. Before-fix logs/graphs remain preserved, rather than overwritten. Final actual task graph files are `spec-fixed-task-graph.json`, `common-fixed-task-graph.json`, `native-fixed-task-graph.json`, `stories-fixed-task-graph.json`, and `native-package-fixed-task-graph.json`.

No dependency, lockfile, runtime/source, native app, test, compliance or license file changed. Existing graph/test evidence scope limits remain: this confirms affected selection and task graph wiring, not execution or behavior of the selected native tasks. The controller will independently review the single-line Nx correction before T06.
