---
title: 'Tutorial panel · 따라하기 패널'
---

# Tutorial panel

따라하기 패널 · `TutorialPanel` · composition

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_08_02.html) · [Full reviewed specification](/sources/specs/components/tutorial-panel.md.txt) · [Framework support](../compatibility/README.md)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [exact subpath types](/sources/packages/react/dist/components/tutorial-panel/index.d.ts.txt) | [react sources and preview policy](../compatibility/README.mdexamples#react) |
| solid | `0.1.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/tutorial-panel/index.d.ts.txt) | [solid sources and preview policy](../compatibility/README.mdexamples#solid) |
| svelte | `0.1.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/TutorialPanel.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/README.mdexamples#svelte) |
| vue | `0.1.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/tutorial-panel/TutorialPanel.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/README.mdexamples#vue) |
| lit | `0.1.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/tutorial-panel/index.d.ts.txt) | [lit sources and preview policy](../compatibility/README.mdexamples#lit) |
| qwik | `0.1.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/tutorial-panel/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/README.mdexamples#qwik) |
| angular | `0.1.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-tutorial-panel.d.ts.txt) | [angular sources and preview policy](../compatibility/README.mdexamples#angular) |
| solid-next (preview) | `0.1.0-preview.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/README.mdexamples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface TutorialPanelContract extends ControlledOpen {
    onStart?: (detail: TutorialStartDetails) => void;
    tasks: readonly {
        id: string;
        title: string;
        steps: readonly TutorialStep[];
    }[];
    activeTaskId: string | null;
    activeStepId: string | null;
    running?: boolean;
    defaultRunning?: boolean;
    activePanel?: 'help' | 'tutorial';
    defaultActivePanel?: 'help' | 'tutorial';
    onTaskChange?: (detail: {
        id: string | null;
    }) => void;
    onStepChange?: (detail: {
        id: string | null;
    }) => void;
    onActivePanelChange?: (detail: ValueChangeDetails<'help' | 'tutorial'>) => void;
    onStop?: (detail: TutorialStopDetails) => void;
    startActionId: string;
    fallbackFocusId?: string;
}

export interface ControlledOpen {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (detail: OpenChangeDetails) => void;
}

export interface OpenChangeDetails {
    open: boolean;
}

export interface TutorialStartDetails {
    taskId: string;
    stepId: string;
}

export interface TutorialStep {
    id: string;
    title: string;
    targetId: string;
    instruction: string;
}

export interface ValueChangeDetails<T> {
    value: T;
}

export interface TutorialStopDetails {
    reason: 'stop' | 'finish' | 'target-removed' | 'route-change';
    running: false;
    returnTo: {
        panel: 'tutorial';
        open: true;
        startActionId: string;
    };
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `open` | no | `boolean` | data / state |
| `defaultOpen` | no | `boolean` | data / state |
| `onOpenChange` | no | `(detail: OpenChangeDetails) => void` | semantic event request |
| `onStart` | no | `(detail: TutorialStartDetails) => void` | semantic event request |
| `tasks` | yes | `readonly {id: string; title: string; steps: readonly TutorialStep[]}[]` | data / state |
| `activeTaskId` | yes | `string \| null` | data / state |
| `activeStepId` | yes | `string \| null` | data / state |
| `running` | no | `boolean` | data / state |
| `defaultRunning` | no | `boolean` | data / state |
| `activePanel` | no | `'help' \| 'tutorial'` | data / state |
| `defaultActivePanel` | no | `'help' \| 'tutorial'` | data / state |
| `onTaskChange` | no | `(detail: {id: string \| null}) => void` | semantic event request |
| `onStepChange` | no | `(detail: {id: string \| null}) => void` | semantic event request |
| `onActivePanelChange` | no | `(detail: ValueChangeDetails<'help' \| 'tutorial'>) => void` | semantic event request |
| `onStop` | no | `(detail: TutorialStopDetails) => void` | semantic event request |
| `startActionId` | yes | `string` | data / state |
| `fallbackFocusId` | no | `string` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Body-following opener/panel with optional Help/Tutorial tabs, close, title, back-to-overview, task/subtask list and explicit Stop button. Subtask titles match CoachMark titles. Panel visibility is independent from active tutorial progress.

### Plain semantic API

Independent API: tasks {id,title,steps:{id,title,targetId,instruction}[]}[], activeTaskId, activeStepId, `running?/defaultRunning=false`, `open?/defaultOpen=true` wide, `activePanel?/defaultActivePanel=help|tutorial`, onOpenChange, `onStart({taskId,stepId})`, onTaskChange, onStepChange, onActivePanelChange({value}), `onStop({reason,running:false,returnTo:{panel:"tutorial",open:true,startActionId}})`, `startActionId`, `fallbackFocusId?`. Defined running/open/activePanel choose controlled ownership for their respective fields, absent fields use their read-once defaults. Controlled/default together or mode switching is invalid. Stop's returnTo is a plain exposure request, not permission to force a controlled prop.

**Start transaction (independent API):** A usable explicit Start action chooses the actual requested task and step: its configured task/step, otherwise the selected task’s first step, otherwise the first real task with a real step. Empty/unavailable task data never invents IDs or a Start request. Start while already running is a no-op. When running is uncontrolled, commit its owned running=true synchronously before one optional onStart({taskId,stepId}) callback. activeTaskId/activeStepId remain host-authoritative; the local host accepts those requested IDs through this same transaction. When running is controlled, emit this one request and await actual running=true plus the requested task/step props before showing/focusing the new running step. Start never emits onTaskChange or onStepChange as duplicate/no-op secondary requests. Those callbacks remain for distinct task/step selection actions. Rejected or partially accepted controlled Start retains committed state and focus; it must not fabricate a run or focus hidden/unaccepted tutorial content. Focus may enter the actual exposed running step only after the accepted transaction is rendered. Mount, prop changes and repeated keydown/click delivery emit no extra Start request.

Closing/folding the panel or switching to Help preserves running/task/step. Only an accepted explicit Stop transaction ends the running tutorial; ordinary panel visibility is independent. Props/mount/reset/focus restoration emit no user-change notifications. Each changed state request emits once; onStop is the one joint Stop request rather than competing close/restoration callbacks.

### Keyboard, focus and state transitions

Open focuses the panel container; ordinary close returns its usable opener through one composition owner. Native disclosure children actually expand/collapse via Click/Enter/Space and retain focus on their trigger. Wide panel is not trapped; narrow shell reuses native modal isolation/entry/trapping with restoration delegated to the relevant Tutorial or Stop coordinator, never by overriding the public Modal saved-opener rule.

**Joint TutorialPanel/CoachMark Stop transaction (independent coordination policy preserving the official preferred destination):** A linked CoachMark's visible/open state is derived by the tutorial coordinator from committed running/task/target state, rather than maintained by a second independent close owner. Stop emits one `onStop({reason,running:false,returnTo:{panel:"tutorial",open:true,startActionId}})` transaction request to that owner; do not also emit a duplicate CoachMark onOpenChange for the same Stop. An uncontrolled coordinator commits it synchronously; controlled ownership ends the tutorial only when running=false is actually accepted and the coach presentation has actually closed/been removed. Until acceptance, retain the running UI/current focus and do not restore. The owner must commit any accepted Tutorial-tab/panel exposure together with that stop transaction; a partially accepted exposure is explicit in the resulting committed tab/open state, not guessed from timers.

The request asks to select the Tutorial tab, open/expose its panel, and render/enable the preferred startActionId. After the actual stopped/closed transition and completed native panel rendering, the **single Stop restoration coordinator first resolves the actual topmost active modal**, including a narrow Help modal that remains selected after the host rejects the Tutorial-tab request. A focus candidate must be mounted, visible, enabled, focusable and non-inert; if a modal is still active it must additionally be inside that actual topmost modal. Prefer the startActionId whenever it is actually usable under those rules. Never focus through a closed modal, hidden tab, rejected panel-open state, active-modal boundary or stale target.

If preferred-start exposure is declined or the start action is removed/unusable **and any modal remains actually open**, select a usable fallbackFocusId inside that modal, otherwise its first usable internal interactive target in logical DOM order, otherwise its own focusable container (tabindex=-1 with prior value preserved). The outside panel opener, saved outside initiating control/ancestor and document body are not candidates while that trap remains active, even when no named fallback was supplied. Do not remove isolation, disable the trap, force a controlled tab/open prop or invoke a second private restoration owner to manufacture an outside target. If a candidate/container is removed before focus, re-resolve the actual committed topmost modal instead of using a stale outside fallback.

Only **when no modal remains actually active after committed cleanup** may the fallback use the usable persistent tutorial panel opener, then supplied fallbackFocusId, then usable saved initiating control/nearest usable ancestor, finally live document body with temporary tabindex=-1 restored afterwards. A requested but rejected modal closure never qualifies; outside focus must await actual accepted closure and cleanup. This modal-aware resolution also applies during route removal/teardown if another modal remains active. In the concrete accepted-Stop state running=false/open=true with Help still selected, hidden or removed Tutorial start and inert outside controls, focus therefore remains in that Help modal on an internal target/container, with its trap and isolation intact.

The same Stop coordinator owns this one resolution and delegates modal-shell entry/return to prevent competing focus work; public Modal returnFocusId rules remain unchanged. Rejected Stop still performs no restoration. Later asynchronous tab/open changes must not replay a completed Stop restoration; any later accepted ordinary modal close uses its existing single close/restoration owner, rather than replaying this earlier Stop fallback.

### Responsive/mobile requirements

Narrow opener-only panel opens Modal. Preserve tutorial state through layout changes; do not cover active CoachMark target with modal panel—host can temporarily close panel while task continues.

### Forms, reset and composition

No form value; tutorial must not submit or reset actual user forms. Action-completion signals come from host, with no IME Enter masquerading as task completion.

### Asset, integration and composition completion

Completion includes working task overview→step flow, real disclosure controls, actual CoachMark targets and HelpPanel-tab persistence. Host owns validated task signals/routes/content, the committed Stop/tab/open transaction, rendering the preferred start action, and valid fallbackFocusId where body fallback would be poor. The local fixture must demonstrate fold, Help-tab switch, narrow modal, rejected controlled Stop/exposure and route-removed start action. It must visibly expose the preferred action before focus, or visibly use the documented fallback; an emitted request/log alone is insufficient. Route teardown cleans the coach and panel isolation/observers without inventing a completed task or submitting/resetting the page form.

### Stable parts and states

root, opener, header, tabs, close, title, back, task-list, task, step-list, stop; open,closed,running,idle,active-step.

All rendered owned parts use `data-krds-component="tutorial-panel"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `task-overview`, `active-step`, `suspended-panel`, `narrow-modal`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-tutorial-panel--task-overview`, `krds-tutorial-panel--active-step`, `krds-tutorial-panel--suspended-panel`, `krds-tutorial-panel--help-tab-return`, `krds-tutorial-panel--narrow-modal`, `krds-tutorial-panel--route-change`, `krds-tutorial-panel--stop-after-fold`, `krds-tutorial-panel--stop-after-help-tab`, `krds-tutorial-panel--narrow-stop-return`, `krds-tutorial-panel--controlled-stop-exposure-rejected`, `krds-tutorial-panel--start-action-removed`, `krds-tutorial-panel--stop-partial-narrow-help`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Task Overview](/native/storybook-react/?path=/story/krds-tutorial-panel--task-overview) · [Active Step](/native/storybook-react/?path=/story/krds-tutorial-panel--active-step) · [Suspended Panel](/native/storybook-react/?path=/story/krds-tutorial-panel--suspended-panel) · [Help Tab Return](/native/storybook-react/?path=/story/krds-tutorial-panel--help-tab-return) · [Narrow Modal](/native/storybook-react/?path=/story/krds-tutorial-panel--narrow-modal) · [Route Change](/native/storybook-react/?path=/story/krds-tutorial-panel--route-change) · [Stop After Fold](/native/storybook-react/?path=/story/krds-tutorial-panel--stop-after-fold) · [Stop After Help Tab](/native/storybook-react/?path=/story/krds-tutorial-panel--stop-after-help-tab) · [Narrow Stop Return](/native/storybook-react/?path=/story/krds-tutorial-panel--narrow-stop-return) · [Controlled Stop Exposure Rejected](/native/storybook-react/?path=/story/krds-tutorial-panel--controlled-stop-exposure-rejected) · [Start Action Removed](/native/storybook-react/?path=/story/krds-tutorial-panel--start-action-removed) · [Stop Partial Narrow Help](/native/storybook-react/?path=/story/krds-tutorial-panel--stop-partial-narrow-help).
- solid: [task-overview](/native/storybook-solid/?path=/story/krds-tutorial-panel--task-overview) · [active-step](/native/storybook-solid/?path=/story/krds-tutorial-panel--active-step) · [suspended-panel](/native/storybook-solid/?path=/story/krds-tutorial-panel--suspended-panel) · [help-tab-return](/native/storybook-solid/?path=/story/krds-tutorial-panel--help-tab-return) · [narrow-modal](/native/storybook-solid/?path=/story/krds-tutorial-panel--narrow-modal) · [route-change](/native/storybook-solid/?path=/story/krds-tutorial-panel--route-change) · [stop-after-fold](/native/storybook-solid/?path=/story/krds-tutorial-panel--stop-after-fold) · [stop-after-help-tab](/native/storybook-solid/?path=/story/krds-tutorial-panel--stop-after-help-tab) · [narrow-stop-return](/native/storybook-solid/?path=/story/krds-tutorial-panel--narrow-stop-return) · [controlled-stop-exposure-rejected](/native/storybook-solid/?path=/story/krds-tutorial-panel--controlled-stop-exposure-rejected) · [start-action-removed](/native/storybook-solid/?path=/story/krds-tutorial-panel--start-action-removed) · [stop-partial-narrow-help](/native/storybook-solid/?path=/story/krds-tutorial-panel--stop-partial-narrow-help).
- svelte: [task-overview](/native/storybook-svelte/?path=/story/krds-tutorial-panel--task-overview) · [active-step](/native/storybook-svelte/?path=/story/krds-tutorial-panel--active-step) · [suspended-panel](/native/storybook-svelte/?path=/story/krds-tutorial-panel--suspended-panel) · [help-tab-return](/native/storybook-svelte/?path=/story/krds-tutorial-panel--help-tab-return) · [narrow-modal](/native/storybook-svelte/?path=/story/krds-tutorial-panel--narrow-modal) · [route-change](/native/storybook-svelte/?path=/story/krds-tutorial-panel--route-change) · [stop-after-fold](/native/storybook-svelte/?path=/story/krds-tutorial-panel--stop-after-fold) · [stop-after-help-tab](/native/storybook-svelte/?path=/story/krds-tutorial-panel--stop-after-help-tab) · [narrow-stop-return](/native/storybook-svelte/?path=/story/krds-tutorial-panel--narrow-stop-return) · [controlled-stop-exposure-rejected](/native/storybook-svelte/?path=/story/krds-tutorial-panel--controlled-stop-exposure-rejected) · [start-action-removed](/native/storybook-svelte/?path=/story/krds-tutorial-panel--start-action-removed) · [stop-partial-narrow-help](/native/storybook-svelte/?path=/story/krds-tutorial-panel--stop-partial-narrow-help).
- vue: [task-overview](/native/storybook-vue/?path=/story/krds-tutorial-panel--task-overview) · [active-step](/native/storybook-vue/?path=/story/krds-tutorial-panel--active-step) · [suspended-panel](/native/storybook-vue/?path=/story/krds-tutorial-panel--suspended-panel) · [help-tab-return](/native/storybook-vue/?path=/story/krds-tutorial-panel--help-tab-return) · [narrow-modal](/native/storybook-vue/?path=/story/krds-tutorial-panel--narrow-modal) · [route-change](/native/storybook-vue/?path=/story/krds-tutorial-panel--route-change) · [stop-after-fold](/native/storybook-vue/?path=/story/krds-tutorial-panel--stop-after-fold) · [stop-after-help-tab](/native/storybook-vue/?path=/story/krds-tutorial-panel--stop-after-help-tab) · [narrow-stop-return](/native/storybook-vue/?path=/story/krds-tutorial-panel--narrow-stop-return) · [controlled-stop-exposure-rejected](/native/storybook-vue/?path=/story/krds-tutorial-panel--controlled-stop-exposure-rejected) · [start-action-removed](/native/storybook-vue/?path=/story/krds-tutorial-panel--start-action-removed) · [stop-partial-narrow-help](/native/storybook-vue/?path=/story/krds-tutorial-panel--stop-partial-narrow-help).
- lit: [Task Overview](/native/storybook-lit/?path=/story/krds-tutorial-panel--task-overview) · [Active Step](/native/storybook-lit/?path=/story/krds-tutorial-panel--active-step) · [Suspended Panel](/native/storybook-lit/?path=/story/krds-tutorial-panel--suspended-panel) · [Help Tab Return](/native/storybook-lit/?path=/story/krds-tutorial-panel--help-tab-return) · [Narrow Modal](/native/storybook-lit/?path=/story/krds-tutorial-panel--narrow-modal) · [Route Change](/native/storybook-lit/?path=/story/krds-tutorial-panel--route-change) · [Stop After Fold](/native/storybook-lit/?path=/story/krds-tutorial-panel--stop-after-fold) · [Stop After Help Tab](/native/storybook-lit/?path=/story/krds-tutorial-panel--stop-after-help-tab) · [Narrow Stop Return](/native/storybook-lit/?path=/story/krds-tutorial-panel--narrow-stop-return) · [Controlled Stop Exposure Rejected](/native/storybook-lit/?path=/story/krds-tutorial-panel--controlled-stop-exposure-rejected) · [Start Action Removed](/native/storybook-lit/?path=/story/krds-tutorial-panel--start-action-removed) · [Stop Partial Narrow Help](/native/storybook-lit/?path=/story/krds-tutorial-panel--stop-partial-narrow-help).
- qwik: [task-overview](/native/storybook-qwik/?path=/story/krds-tutorial-panel--task-overview) · [active-step](/native/storybook-qwik/?path=/story/krds-tutorial-panel--active-step) · [suspended-panel](/native/storybook-qwik/?path=/story/krds-tutorial-panel--suspended-panel) · [help-tab-return](/native/storybook-qwik/?path=/story/krds-tutorial-panel--help-tab-return) · [narrow-modal](/native/storybook-qwik/?path=/story/krds-tutorial-panel--narrow-modal) · [route-change](/native/storybook-qwik/?path=/story/krds-tutorial-panel--route-change) · [stop-after-fold](/native/storybook-qwik/?path=/story/krds-tutorial-panel--stop-after-fold) · [stop-after-help-tab](/native/storybook-qwik/?path=/story/krds-tutorial-panel--stop-after-help-tab) · [narrow-stop-return](/native/storybook-qwik/?path=/story/krds-tutorial-panel--narrow-stop-return) · [controlled-stop-exposure-rejected](/native/storybook-qwik/?path=/story/krds-tutorial-panel--controlled-stop-exposure-rejected) · [start-action-removed](/native/storybook-qwik/?path=/story/krds-tutorial-panel--start-action-removed) · [stop-partial-narrow-help](/native/storybook-qwik/?path=/story/krds-tutorial-panel--stop-partial-narrow-help).
- angular: [task-overview](/native/storybook-angular/?path=/story/krds-tutorial-panel--task-overview) · [active-step](/native/storybook-angular/?path=/story/krds-tutorial-panel--active-step) · [suspended-panel](/native/storybook-angular/?path=/story/krds-tutorial-panel--suspended-panel) · [help-tab-return](/native/storybook-angular/?path=/story/krds-tutorial-panel--help-tab-return) · [narrow-modal](/native/storybook-angular/?path=/story/krds-tutorial-panel--narrow-modal) · [route-change](/native/storybook-angular/?path=/story/krds-tutorial-panel--route-change) · [stop-after-fold](/native/storybook-angular/?path=/story/krds-tutorial-panel--stop-after-fold) · [stop-after-help-tab](/native/storybook-angular/?path=/story/krds-tutorial-panel--stop-after-help-tab) · [narrow-stop-return](/native/storybook-angular/?path=/story/krds-tutorial-panel--narrow-stop-return) · [controlled-stop-exposure-rejected](/native/storybook-angular/?path=/story/krds-tutorial-panel--controlled-stop-exposure-rejected) · [start-action-removed](/native/storybook-angular/?path=/story/krds-tutorial-panel--start-action-removed) · [stop-partial-narrow-help](/native/storybook-angular/?path=/story/krds-tutorial-panel--stop-partial-narrow-help).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [read the checked consumer](/examples/svelte-38); [download exact source](/sources/apps/fixture-svelte/src/public-examples/TutorialPanelExample.svelte.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:04.943Z`. SHA-256: `38b2ffb0d2f3655d399ef17f8e84a41b04b8d3928a395429199ee47fff7e6d6e`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_08_02.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/index.md) before redistributing.
