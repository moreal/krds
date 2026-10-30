---
title: 'Resize · 화면 크기 조정'
---

# Resize

화면 크기 조정 · `Resize` · integration

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_10_02.html) · [Full reviewed specification](/sources/specs/components/resize.md.txt) · [Framework support](../compatibility/README.md)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/resize/index.d.ts.txt) | [react sources and preview policy](../compatibility/README.mdexamples#react) |
| solid | `0.0.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/resize/index.d.ts.txt) | [solid sources and preview policy](../compatibility/README.mdexamples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/Resize.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/README.mdexamples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/resize/Resize.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/README.mdexamples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/resize/index.d.ts.txt) | [lit sources and preview policy](../compatibility/README.mdexamples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/resize/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/README.mdexamples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-resize.d.ts.txt) | [angular sources and preview policy](../compatibility/README.mdexamples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/README.mdexamples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface ResizeContract extends ControlledValue<string>, ControlledOpen {
    levels?: readonly {
        id: string;
        label: string;
        percent: number;
    }[];
}

export interface ControlledValue<T> {
    value?: T;
    defaultValue?: T;
    onValueChange?: (detail: ValueChangeDetails<T>) => void;
}

export interface ValueChangeDetails<T> {
    value: T;
}

export interface ControlledOpen {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (detail: OpenChangeDetails) => void;
}

export interface OpenChangeDetails {
    open: boolean;
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `value` | no | `string` | data / state |
| `defaultValue` | no | `string` | data / state |
| `onValueChange` | no | `(detail: ValueChangeDetails<string>) => void` | semantic event request |
| `open` | no | `boolean` | data / state |
| `defaultOpen` | no | `boolean` | data / state |
| `onOpenChange` | no | `(detail: OpenChangeDetails) => void` | semantic event request |
| `levels` | no | `readonly {id: string; label: string; percent: number}[]` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Named screen-size control, options with descriptive label and current selected value. Official examples: 90%,100%,110%,130%,150%; &lt;=5 options. Text labels accompany scale icons/numbers.

### Plain semantic API

Independent API: levels {id,label,percent}[]=official five, `value?:string`, `defaultValue?:string="100"`, `onValueChange({value:id})`, open/defaultOpen=false, onOpenChange. The requested value is the option ID and the callback conforms to [ValueChangeDetails&lt;T>](/sources/packages/contracts/src/types.ts.txt); hosts look up percent from levels rather than receiving an incompatible id-only payload. Defined value chooses controlled mode; absent value uses its read-once default; controlled/default together or mode switching is invalid. One changed user selection request, none for same-value/disabled action, props, mount or reset. Host applies scoped scale and confirms value; no browser/device zoom manipulation.

For a controlled declined click/Enter/collapsed-arrow request, keep the current option, displayed value and host scale at the committed value. Do not optimistically apply the requested percent or emit a second request during reconciliation. Scale application and selection share that same authoritative value. The [pilot policy](/sources/specs/components/README.md.txt) and separate open-state ownership still apply.

### Keyboard, focus and state transitions

Click/Enter/Space opens; Tab visits options; outside/Escape closes and Escape returns trigger. Enter selects and closes. While collapsed ArrowUp/Down selects previous/next option per official table; endpoints do not wrap (project policy). Selection focus remains usable after reflow.

### Responsive/mobile requirements

All content/actions remain accessible at enlarged scale, page normally single-direction scroll with documented media/table exceptions. Check actual browser 200/400% zoom alongside component levels; CSS transform alone cannot stand in for usable layout reflow.

### Forms, reset and composition

No form value; settings reset is explicit host preference action, not implicit form reset. No IME editing.

### Asset, integration and composition completion

Host owns scaling application, preference persistence and scope. Completion includes working local settings driver+representative page demonstrating reflow, not only changed label. No remote storage or global browser setting edits.

### Stable parts and states

root, trigger, current, list, option, scale-icon; open,closed,selected.

All rendered owned parts use `data-krds-component="resize"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `five-levels`, `custom-levels`, `narrow-reflow`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-resize--five-levels`, `krds-resize--custom-levels`, `krds-resize--narrow-reflow`, `krds-resize--browser-zoom`, `krds-resize--controlled-rejected`, `krds-resize--shared-value-payload`, `krds-resize--collapsed-arrow-rejected`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Five Levels](/native/storybook-react/?path=/story/krds-resize--five-levels) · [Custom Levels](/native/storybook-react/?path=/story/krds-resize--custom-levels) · [Narrow Reflow](/native/storybook-react/?path=/story/krds-resize--narrow-reflow) · [Browser Zoom](/native/storybook-react/?path=/story/krds-resize--browser-zoom) · [Controlled Rejected](/native/storybook-react/?path=/story/krds-resize--controlled-rejected) · [Shared Value Payload](/native/storybook-react/?path=/story/krds-resize--shared-value-payload) · [Collapsed Arrow Rejected](/native/storybook-react/?path=/story/krds-resize--collapsed-arrow-rejected).
- solid: [five-levels](/native/storybook-solid/?path=/story/krds-resize--five-levels) · [custom-levels](/native/storybook-solid/?path=/story/krds-resize--custom-levels) · [narrow-reflow](/native/storybook-solid/?path=/story/krds-resize--narrow-reflow) · [browser-zoom](/native/storybook-solid/?path=/story/krds-resize--browser-zoom) · [controlled-rejected](/native/storybook-solid/?path=/story/krds-resize--controlled-rejected) · [shared-value-payload](/native/storybook-solid/?path=/story/krds-resize--shared-value-payload) · [collapsed-arrow-rejected](/native/storybook-solid/?path=/story/krds-resize--collapsed-arrow-rejected).
- svelte: [five-levels](/native/storybook-svelte/?path=/story/krds-resize--five-levels) · [custom-levels](/native/storybook-svelte/?path=/story/krds-resize--custom-levels) · [narrow-reflow](/native/storybook-svelte/?path=/story/krds-resize--narrow-reflow) · [browser-zoom](/native/storybook-svelte/?path=/story/krds-resize--browser-zoom) · [controlled-rejected](/native/storybook-svelte/?path=/story/krds-resize--controlled-rejected) · [shared-value-payload](/native/storybook-svelte/?path=/story/krds-resize--shared-value-payload) · [collapsed-arrow-rejected](/native/storybook-svelte/?path=/story/krds-resize--collapsed-arrow-rejected).
- vue: [five-levels](/native/storybook-vue/?path=/story/krds-resize--five-levels) · [custom-levels](/native/storybook-vue/?path=/story/krds-resize--custom-levels) · [narrow-reflow](/native/storybook-vue/?path=/story/krds-resize--narrow-reflow) · [browser-zoom](/native/storybook-vue/?path=/story/krds-resize--browser-zoom) · [controlled-rejected](/native/storybook-vue/?path=/story/krds-resize--controlled-rejected) · [shared-value-payload](/native/storybook-vue/?path=/story/krds-resize--shared-value-payload) · [collapsed-arrow-rejected](/native/storybook-vue/?path=/story/krds-resize--collapsed-arrow-rejected).
- lit: [Five Levels](/native/storybook-lit/?path=/story/krds-resize--five-levels) · [Custom Levels](/native/storybook-lit/?path=/story/krds-resize--custom-levels) · [Narrow Reflow](/native/storybook-lit/?path=/story/krds-resize--narrow-reflow) · [Browser Zoom](/native/storybook-lit/?path=/story/krds-resize--browser-zoom) · [Controlled Rejected](/native/storybook-lit/?path=/story/krds-resize--controlled-rejected) · [Shared Value Payload](/native/storybook-lit/?path=/story/krds-resize--shared-value-payload) · [Collapsed Arrow Rejected](/native/storybook-lit/?path=/story/krds-resize--collapsed-arrow-rejected).
- qwik: [five-levels](/native/storybook-qwik/?path=/story/krds-resize--five-levels) · [custom-levels](/native/storybook-qwik/?path=/story/krds-resize--custom-levels) · [narrow-reflow](/native/storybook-qwik/?path=/story/krds-resize--narrow-reflow) · [browser-zoom](/native/storybook-qwik/?path=/story/krds-resize--browser-zoom) · [controlled-rejected](/native/storybook-qwik/?path=/story/krds-resize--controlled-rejected) · [shared-value-payload](/native/storybook-qwik/?path=/story/krds-resize--shared-value-payload) · [collapsed-arrow-rejected](/native/storybook-qwik/?path=/story/krds-resize--collapsed-arrow-rejected).
- angular: [five-levels](/native/storybook-angular/?path=/story/krds-resize--five-levels) · [custom-levels](/native/storybook-angular/?path=/story/krds-resize--custom-levels) · [narrow-reflow](/native/storybook-angular/?path=/story/krds-resize--narrow-reflow) · [browser-zoom](/native/storybook-angular/?path=/story/krds-resize--browser-zoom) · [controlled-rejected](/native/storybook-angular/?path=/story/krds-resize--controlled-rejected) · [shared-value-payload](/native/storybook-angular/?path=/story/krds-resize--shared-value-payload) · [collapsed-arrow-rejected](/native/storybook-angular/?path=/story/krds-resize--collapsed-arrow-rejected).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-48); [download exact source](/sources/apps/fixture-svelte/src/public-examples/ResizeExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:05.696Z`. SHA-256: `b20eb8f9d7cd29d12e5a87be485cbcd5e1ba2bff549f40ab16e29925fe34cba4`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_10_02.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/index.md) before redistributing.
