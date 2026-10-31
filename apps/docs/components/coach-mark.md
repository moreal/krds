---
title: 'Coach mark · 코치마크'
---

# Coach mark

코치마크 · `CoachMark` · composition

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_08_04.html) · [Full reviewed specification](/sources/specs/components/coach-mark.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [current subpath manifest](/sources/packages/react/package.json.txt); [historical declaration checkpoint](/sources/packages/react/dist/components/coach-mark/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.1.0` | planned | [current subpath manifest](/sources/packages/solid/package.json.txt); [historical declaration checkpoint](/sources/packages/solid/dist/components/coach-mark/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [current subpath manifest](/sources/packages/svelte/package.json.txt); [historical declaration checkpoint](/sources/packages/svelte/dist/components/CoachMark.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [current subpath manifest](/sources/packages/vue/package.json.txt); [historical declaration checkpoint](/sources/packages/vue/dist/components/coach-mark/CoachMark.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [current subpath manifest](/sources/packages/lit/package.json.txt); [historical declaration checkpoint](/sources/packages/lit/dist/components/coach-mark/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [current subpath manifest](/sources/packages/qwik/package.json.txt); [historical declaration checkpoint](/sources/packages/qwik/dist/components/coach-mark/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [current subpath manifest](/sources/packages/angular/package.json.txt); [historical declaration checkpoint](/sources/packages/angular/dist/types/unofficial-krds-angular-coach-mark.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.1.0-preview.0` | planned | [current root manifest](/sources/packages/solid-next/package.json.txt); [historical declaration checkpoint](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface CoachMarkContract extends ControlledOpen {
    onTargetAction?: (detail: CoachMarkTargetActionDetails) => boolean | Promise<boolean>;
    steps: readonly CoachMarkStep[];
    boundaries: readonly CoachMarkBoundary[];
    stepId?: string;
    defaultStepId?: string;
    onStepChange?: (detail: {
        id: string;
        reason: 'previous' | 'next' | 'target-action';
    }) => void;
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

export interface CoachMarkTargetActionDetails {
    stepId: string;
    targetId: string;
}

export interface CoachMarkStep {
    id: string;
    targetId: string;
    title: string;
    instruction: string;
    requiresAction?: boolean;
}

/** The host registers a native insertion location immediately after the real target. */
export interface CoachMarkBoundary {
    targetId: string;
    insertionBoundaryId: string;
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
| `onTargetAction` | no | `(detail: CoachMarkTargetActionDetails) => boolean \| Promise<boolean>` | semantic event request |
| `steps` | yes | `readonly CoachMarkStep[]` | data / state |
| `boundaries` | yes | `readonly CoachMarkBoundary[]` | data / state |
| `stepId` | no | `string` | data / state |
| `defaultStepId` | no | `string` | data / state |
| `onStepChange` | no | `(detail: {id: string; reason: 'previous' \| 'next' \| 'target-action'}) => void` | semantic event request |
| `onStop` | no | `(detail: TutorialStopDetails) => void` | semantic event request |
| `startActionId` | yes | `string` | data / state |
| `fallbackFocusId` | no | `string` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

The **actual related target/control** is immediately followed by the current coach popover in logical DOM/accessibility order ([official L1123–1124](https://www.krds.go.kr/html/site/component/component_08_04.html)). The spotlight is only aria-hidden visual decoration around that target; a remote overlay/spotlight followed by a popover does not satisfy target→instruction order. Register the real target plus an adjacent insertion boundary in the same relevant DOM/accessibility root; render the popover natively there. Do not move, replace, clone or reparent a live target/form input just to create this order. A portal is allowed only into that registered adjacent same-root boundary with order proven; a decorative body-level portal is insufficient.

Popover contains step/title, concise instructions, current/total and action row Stop, Previous, Next. No Previous on first; last Next becomes Finish; single becomes Confirm. One visible coach at a time; title ideally one line/instructions &lt;=3; recommended &lt;=4/page and max15 steps. Native target operation, its label relationships, value, focus/caret and IME remain intact throughout an action-gated step.

### Plain semantic API

Independent API: steps {id,targetId,title,instruction,requiresAction?}[], registered adjacent popover insertion boundaries, open/defaultOpen=false, stepId/defaultStepId, onStepChange({id,reason}), onOpenChange, `startActionId`, `fallbackFocusId?`, and `onStop({reason,running:false,returnTo:{panel:"tutorial",open:true,startActionId}})` when linked to TutorialPanel. The registration contract carries plain IDs/relationships; each adapter provides its own native insertion mechanism without foreign-renderer wrappers. For steps with requiresAction, supply onTargetAction({stepId,targetId}): boolean|Promise&lt;boolean>. It is called only after the corresponding real registered target action has executed, with plain IDs and no native Event. The native host closure validates actual committed application state; only true authorizes one next-step request. False, rejection or absence never advances. A requiresAction configuration without a verifier is invalid (TypeError). Invoke after native target handlers/commit, not from a synthetic spotlight click. While a verification is pending, coalesce duplicate activation for that same step. Bind it to the actual open/step/target generation: close, step change, route change, target removal or unmount invalidates pending resolution. A stale true never advances or restores focus. Controlled declined advancement retains the current step; a later distinct real action can request again. Mount, props and focus never invoke the verifier. This is an independent concrete host-verification API preserving the official real-action outcome.

Controlled/default and no-mode-switch rules follow [pilot conventions](/sources/specs/components/README.md.txt). In linked mode the tutorial coordinator derives CoachMark presentation from committed running/step/target state, and the joint onStop request is the only Stop transaction event. For a standalone CoachMark, Stop requests actual open=false through its single owner; rejection leaves it open and does not restore focus. Mount/props/focus/cleanup emit zero synthetic user-change events.

### Keyboard, focus and state transitions

User requested only; never auto-run at page load. Tab traverses the real target and current popover's controls in their actual reading sequence without blocking a required target action. Independent entry policy focuses the popover heading on an accepted step change; Escape requests Stop except during composition or when an inner widget already handled it. Offscreen existing target may scroll into view; missing target suspends presentation with visible recovery/Stop, never a fabricated target coordinate or substituted control.

**Joint TutorialPanel/CoachMark Stop transaction (independent coordination policy preserving the official preferred destination):** A linked CoachMark's visible/open state is derived by the tutorial coordinator from committed running/task/target state, rather than maintained by a second independent close owner. Stop emits one `onStop({reason,running:false,returnTo:{panel:"tutorial",open:true,startActionId}})` transaction request to that owner; do not also emit a duplicate CoachMark onOpenChange for the same Stop. An uncontrolled coordinator commits it synchronously; controlled ownership ends the tutorial only when running=false is actually accepted and the coach presentation has actually closed/been removed. Until acceptance, retain the running UI/current focus and do not restore. The owner must commit any accepted Tutorial-tab/panel exposure together with that stop transaction; a partially accepted exposure is explicit in the resulting committed tab/open state, not guessed from timers.

The request asks to select the Tutorial tab, open/expose its panel, and render/enable the preferred startActionId. After the actual stopped/closed transition and completed native panel rendering, the **single Stop restoration coordinator first resolves the actual topmost active modal**, including a narrow Help modal that remains selected after the host rejects the Tutorial-tab request. A focus candidate must be mounted, visible, enabled, focusable and non-inert; if a modal is still active it must additionally be inside that actual topmost modal. Prefer the startActionId whenever it is actually usable under those rules. Never focus through a closed modal, hidden tab, rejected panel-open state, active-modal boundary or stale target.

If preferred-start exposure is declined or the start action is removed/unusable **and any modal remains actually open**, select a usable fallbackFocusId inside that modal, otherwise its first usable internal interactive target in logical DOM order, otherwise its own focusable container (tabindex=-1 with prior value preserved). The outside panel opener, saved outside initiating control/ancestor and document body are not candidates while that trap remains active, even when no named fallback was supplied. Do not remove isolation, disable the trap, force a controlled tab/open prop or invoke a second private restoration owner to manufacture an outside target. If a candidate/container is removed before focus, re-resolve the actual committed topmost modal instead of using a stale outside fallback.

Only **when no modal remains actually active after committed cleanup** may the fallback use the usable persistent tutorial panel opener, then supplied fallbackFocusId, then usable saved initiating control/nearest usable ancestor, finally live document body with temporary tabindex=-1 restored afterwards. A requested but rejected modal closure never qualifies; outside focus must await actual accepted closure and cleanup. This modal-aware resolution also applies during route removal/teardown if another modal remains active. In the concrete accepted-Stop state running=false/open=true with Help still selected, hidden or removed Tutorial start and inert outside controls, focus therefore remains in that Help modal on an internal target/container, with its trap and isolation intact.

The same Stop coordinator owns this one resolution and delegates modal-shell entry/return to prevent competing focus work; public Modal returnFocusId rules remain unchanged. Rejected Stop still performs no restoration. Later asynchronous tab/open changes must not replay a completed Stop restoration; any later accepted ordinary modal close uses its existing single close/restoration owner, rather than replaying this earlier Stop fallback.

### Responsive/mobile requirements

Consistent popup width across tour, collision-aware to remain onscreen without covering target; reduced-motion removes spotlight animation/smooth scroll. Target resize/scroll updates placement; observers clean on close.

### Forms, reset and composition

No form/reset; only host validated events advance real form tasks, composing input never counts as completion.

### Asset, integration and composition completion

Independent API: composition completion includes actual registered target→popover DOM/accessibility order, spotlight geometry, ordered task state and joint TutorialPanel return. Host supplies the adjacent native insertion boundary and keeps the target operable; it owns route/task success, coordinated Stop/exposure state and competing-layer suppression. An action-gated local story must operate the real native child form control while its value/label/IME behavior remains intact, then visibly advance from the verified action. A detached overlay alone is not completion. Missing insertion boundary/target is a configuration or suspended-target outcome, never permission to clone/move the control.

### Stable parts and states

root, spotlight, popover, title, instruction, position, actions, stop, previous, next; open,closed,current-step,waiting,missing-target.

All rendered owned parts use `data-krds-component="coach-mark"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `single`, `multi-step`, `action-gated`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-coach-mark--single`, `krds-coach-mark--multi-step`, `krds-coach-mark--action-gated`, `krds-coach-mark--offscreen-target`, `krds-coach-mark--missing-target`, `krds-coach-mark--route-change`, `krds-coach-mark--reduced-motion`, `krds-coach-mark--target-reading-order`, `krds-coach-mark--action-native-control`, `krds-coach-mark--stop-hidden-panel`, `krds-coach-mark--stop-help-tab`, `krds-coach-mark--stop-fallback-rejected`, `krds-coach-mark--stop-partial-narrow-help`.

### Local native stories

Fixture and Storybook outputs are local-only and are not hosted on this public documentation site. Build the selected native workspace, then run `node tools/yarn.mjs exec node apps/docs/scripts/serve.mjs`. Open `/krds/native/storybook-<framework>/` on that local server. Solid 2 has no supported native Storybook integration. Qwik production SSR/resume requires its real server and cannot be replaced by a static preview. Story availability does not establish behavioral acceptance.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [read the checked consumer](/examples/svelte-40); [download exact source](/sources/apps/fixture-svelte/src/public-examples/CoachMarkExample.svelte.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:05.101Z`. SHA-256: `754efe232a5733c103dcdb25f572978409790aeae323ac1afc943eb497845b23`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_08_04.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
