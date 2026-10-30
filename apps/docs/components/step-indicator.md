---
title: 'Step indicator · 단계 표시기'
---

# Step indicator

단계 표시기 · `StepIndicator` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_07_01.html) · [Full reviewed specification](/sources/specs/components/step-indicator.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/step-indicator/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.0.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/step-indicator/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/StepIndicator.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/step-indicator/StepIndicator.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/step-indicator/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/step-indicator/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-step-indicator.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface StepIndicatorContract {
    steps: readonly {
        id: string;
        label: string;
        status: 'pending' | 'current' | 'complete';
        href?: string;
        optional?: boolean;
    }[];
    mode?: 'sequential' | 'adaptive';
    onStepRequest?: (detail: {
        id: string;
    }) => void;
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `steps` | yes | `readonly {id: string; label: string; status: 'pending' \| 'current' \| 'complete'; href?: string; optional?: boolean}[]` | data / state |
| `mode` | no | `'sequential' \| 'adaptive'` | data / state |
| `onStepRequest` | no | `(detail: {id: string}) => void` | semantic event request |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Native ordered list of 3–7 labeled steps, step numbers, current/completed cues and connectors. Current state announced with aria-current=true or equivalent text; completion not color-only. A process may be static indicators or explicit navigation where host permits.

### Plain semantic API

Independent API: steps {id,label,status:pending|current|complete,href?,optional?}[], mode=sequential|adaptive. Optional onStepRequest({id}) only for configured navigation. Process owner determines blocked future steps and optional-step skip control.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Static labels not tab stops. True navigable steps use anchors or named task buttons; disabled future steps cannot activate. Never imply that selecting a step completes validation. Optional skip has explicit name and destination.

### Responsive/mobile requirements

Narrow compact view may show current/total only (e.g. 1 of 4); keep full accessible process overview without hidden focusable steps. Preserve logical left→right or top→bottom progression.

### Forms, reset and composition

No form value/reset/IME state; child step forms owned by host.

### Asset, integration and composition completion

Host owns process state, completed prerequisites, route/validation and optional skip. Completion includes actual sequential/adaptive local flow rather than colored dots only.

### Stable parts and states

root, list, item, number, label, connector, current-indicator, complete-indicator; current,complete,pending,blocked.

All rendered owned parts use `data-krds-component="step-indicator"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `sequential`, `adaptive`, `compact`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-step-indicator--sequential`, `krds-step-indicator--adaptive`, `krds-step-indicator--compact`, `krds-step-indicator--optional-skip`, `krds-step-indicator--completed`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Sequential](/native/storybook-react/?path=/story/krds-step-indicator--sequential) · [Adaptive](/native/storybook-react/?path=/story/krds-step-indicator--adaptive) · [Compact](/native/storybook-react/?path=/story/krds-step-indicator--compact) · [Optional Skip](/native/storybook-react/?path=/story/krds-step-indicator--optional-skip) · [Completed](/native/storybook-react/?path=/story/krds-step-indicator--completed).
- solid: [sequential](/native/storybook-solid/?path=/story/krds-step-indicator--sequential) · [adaptive](/native/storybook-solid/?path=/story/krds-step-indicator--adaptive) · [compact](/native/storybook-solid/?path=/story/krds-step-indicator--compact) · [optional-skip](/native/storybook-solid/?path=/story/krds-step-indicator--optional-skip) · [completed](/native/storybook-solid/?path=/story/krds-step-indicator--completed).
- svelte: [sequential](/native/storybook-svelte/?path=/story/krds-step-indicator--sequential) · [adaptive](/native/storybook-svelte/?path=/story/krds-step-indicator--adaptive) · [compact](/native/storybook-svelte/?path=/story/krds-step-indicator--compact) · [optional-skip](/native/storybook-svelte/?path=/story/krds-step-indicator--optional-skip) · [completed](/native/storybook-svelte/?path=/story/krds-step-indicator--completed).
- vue: [sequential](/native/storybook-vue/?path=/story/krds-step-indicator--sequential) · [adaptive](/native/storybook-vue/?path=/story/krds-step-indicator--adaptive) · [compact](/native/storybook-vue/?path=/story/krds-step-indicator--compact) · [optional-skip](/native/storybook-vue/?path=/story/krds-step-indicator--optional-skip) · [completed](/native/storybook-vue/?path=/story/krds-step-indicator--completed).
- lit: [Sequential](/native/storybook-lit/?path=/story/krds-step-indicator--sequential) · [Adaptive](/native/storybook-lit/?path=/story/krds-step-indicator--adaptive) · [Compact](/native/storybook-lit/?path=/story/krds-step-indicator--compact) · [Optional Skip](/native/storybook-lit/?path=/story/krds-step-indicator--optional-skip) · [Completed](/native/storybook-lit/?path=/story/krds-step-indicator--completed).
- qwik: [sequential](/native/storybook-qwik/?path=/story/krds-step-indicator--sequential) · [adaptive](/native/storybook-qwik/?path=/story/krds-step-indicator--adaptive) · [compact](/native/storybook-qwik/?path=/story/krds-step-indicator--compact) · [optional-skip](/native/storybook-qwik/?path=/story/krds-step-indicator--optional-skip) · [completed](/native/storybook-qwik/?path=/story/krds-step-indicator--completed).
- angular: [sequential](/native/storybook-angular/?path=/story/krds-step-indicator--sequential) · [adaptive](/native/storybook-angular/?path=/story/krds-step-indicator--adaptive) · [compact](/native/storybook-angular/?path=/story/krds-step-indicator--compact) · [optional-skip](/native/storybook-angular/?path=/story/krds-step-indicator--optional-skip) · [completed](/native/storybook-angular/?path=/story/krds-step-indicator--completed).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-35); [download exact source](/sources/apps/fixture-svelte/src/public-examples/StepIndicatorExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:04.734Z`. SHA-256: `2720b539f16fe5e37c42c26eb502fdb0a5da7bfedc557e6c1c5b21f2cd237774`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_07_01.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
