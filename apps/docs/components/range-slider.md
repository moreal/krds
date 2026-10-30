---
title: 'Range slider · 범위슬라이드'
---

# Range slider

범위슬라이드 · `RangeSlider` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_12_01.html) · [Full reviewed specification](/sources/specs/components/range-slider.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [exact subpath types](/sources/packages/react/dist/components/range-slider/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.1.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/range-slider/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/RangeSlider.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/range-slider/RangeSlider.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/range-slider/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/range-slider/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-range-slider.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.1.0-preview.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface RangeSliderContract extends ControlledValue<number>, FieldContract {
    min?: number;
    max?: number;
    step?: number;
    valueText?: (value: number) => string;
}

export interface ControlledValue<T> {
    value?: T;
    defaultValue?: T;
    onValueChange?: (detail: ValueChangeDetails<T>) => void;
}

export interface ValueChangeDetails<T> {
    value: T;
}

export interface FieldContract {
    id?: string;
    name?: string;
    label: string;
    disabled?: boolean;
    required?: boolean;
    invalid?: boolean;
    helpId?: string;
    errorId?: string;
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `value` | no | `number` | data / state |
| `defaultValue` | no | `number` | data / state |
| `onValueChange` | no | `(detail: ValueChangeDetails<number>) => void` | semantic event request |
| `id` | no | `string` | data / state |
| `name` | no | `string` | data / state |
| `label` | yes | `string` | data / state |
| `disabled` | no | `boolean` | data / state |
| `required` | no | `boolean` | data / state |
| `invalid` | no | `boolean` | data / state |
| `helpId` | no | `string` | data / state |
| `errorId` | no | `string` | data / state |
| `min` | no | `number` | data / state |
| `max` | no | `number` | data / state |
| `step` | no | `number` | data / state |
| `valueText` | no | `(value: number) => string` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Persistent label, slider track/handle, current value above handle or at track end (not below finger), visible minimum/maximum. Official detail illustrates one selected value within range, not proof of two-thumb interval selection. Recommended step about 10–20% of range.

### Plain semantic API

Independent API: min=0,max=100,step=10,value/defaultValue=0, `onValueChange({value:number})`, name,label,disabled=false,valueText? formatter. **No onValueCommit API is offered in this contract.** Native input[type=range] is preferred; output reflects the committed value with units. Invalid bounds/step are rejected and fractional math normalized without drift. The defined value/read-once default/no-mode-switch and no mount/prop/reset callback rules follow [pilot conventions](/sources/specs/components/README.md.txt). Controlled native input changes are requests; display/output/submitted value remain the committed prop if rejected.

### Keyboard, focus and state transitions

Officially support dragging handle and clicking track. Independent native keyboard policy: arrows change one step, Home/End reach limits, normal Tab/focus and numeric native value semantics; no invented two-thumb roles. For each native user input event whose requested normalized number differs from the committed value, emit one onValueChange. Uncontrolled input commits that number before the callback; controlled input emits the request once and reconciles native value/output back to the prop if declined.

A drag may produce multiple distinct input requests, one per changed input event; a track click producing one changed input produces one request; each changed keyboard adjustment produces one request. Same-value/boundary input emits none. Native change, pointerup, blur and gesture completion add **no second or commit callback**. Pointer cancellation preserves the last committed value and produces no synthetic rollback/commit request. No input/change double notification. Preserve vertical page scrolling during touch and actual native form lifecycle.

### Responsive/mobile requirements

Current value remains above/end and not occluded by finger; min/max readable narrow/zoom; large enough handle and non-drag keyboard/click equivalent.

### Forms, reset and composition

Named enabled native range contributes value; disabled excluded; reset restores default and output. Controlled reset retains current prop without a callback. No IME editing; embedded editable value alternative is outside this draft.

### Asset, integration and composition completion

Host owns units/setting effects. Completion includes actual bounded native range, output and form lifecycle, not decorative track. No external engine needed.

### Stable parts and states

root, label, control, track, range, thumb, output, minimum, maximum; disabled,dragging.

All rendered owned parts use `data-krds-component="range-slider"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `single-value`, `disabled`, `discrete`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-range-slider--single-value`, `krds-range-slider--discrete`, `krds-range-slider--disabled`, `krds-range-slider--form-reset`, `krds-range-slider--narrow-touch`, `krds-range-slider--input-notification-counts`, `krds-range-slider--controlled-rejected`, `krds-range-slider--pointer-cancel`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Single Value](/native/storybook-react/?path=/story/krds-range-slider--single-value) · [Discrete](/native/storybook-react/?path=/story/krds-range-slider--discrete) · [Disabled](/native/storybook-react/?path=/story/krds-range-slider--disabled) · [Form Reset](/native/storybook-react/?path=/story/krds-range-slider--form-reset) · [Narrow Touch](/native/storybook-react/?path=/story/krds-range-slider--narrow-touch) · [Input Notification Counts](/native/storybook-react/?path=/story/krds-range-slider--input-notification-counts) · [Controlled Rejected](/native/storybook-react/?path=/story/krds-range-slider--controlled-rejected) · [Pointer Cancel](/native/storybook-react/?path=/story/krds-range-slider--pointer-cancel).
- solid: [single-value](/native/storybook-solid/?path=/story/krds-range-slider--single-value) · [discrete](/native/storybook-solid/?path=/story/krds-range-slider--discrete) · [disabled](/native/storybook-solid/?path=/story/krds-range-slider--disabled) · [form-reset](/native/storybook-solid/?path=/story/krds-range-slider--form-reset) · [narrow-touch](/native/storybook-solid/?path=/story/krds-range-slider--narrow-touch) · [input-notification-counts](/native/storybook-solid/?path=/story/krds-range-slider--input-notification-counts) · [controlled-rejected](/native/storybook-solid/?path=/story/krds-range-slider--controlled-rejected) · [pointer-cancel](/native/storybook-solid/?path=/story/krds-range-slider--pointer-cancel).
- svelte: [single-value](/native/storybook-svelte/?path=/story/krds-range-slider--single-value) · [discrete](/native/storybook-svelte/?path=/story/krds-range-slider--discrete) · [disabled](/native/storybook-svelte/?path=/story/krds-range-slider--disabled) · [form-reset](/native/storybook-svelte/?path=/story/krds-range-slider--form-reset) · [narrow-touch](/native/storybook-svelte/?path=/story/krds-range-slider--narrow-touch) · [input-notification-counts](/native/storybook-svelte/?path=/story/krds-range-slider--input-notification-counts) · [controlled-rejected](/native/storybook-svelte/?path=/story/krds-range-slider--controlled-rejected) · [pointer-cancel](/native/storybook-svelte/?path=/story/krds-range-slider--pointer-cancel).
- vue: [single-value](/native/storybook-vue/?path=/story/krds-range-slider--single-value) · [discrete](/native/storybook-vue/?path=/story/krds-range-slider--discrete) · [disabled](/native/storybook-vue/?path=/story/krds-range-slider--disabled) · [form-reset](/native/storybook-vue/?path=/story/krds-range-slider--form-reset) · [narrow-touch](/native/storybook-vue/?path=/story/krds-range-slider--narrow-touch) · [input-notification-counts](/native/storybook-vue/?path=/story/krds-range-slider--input-notification-counts) · [controlled-rejected](/native/storybook-vue/?path=/story/krds-range-slider--controlled-rejected) · [pointer-cancel](/native/storybook-vue/?path=/story/krds-range-slider--pointer-cancel).
- lit: [Single Value](/native/storybook-lit/?path=/story/krds-range-slider--single-value) · [Discrete](/native/storybook-lit/?path=/story/krds-range-slider--discrete) · [Disabled](/native/storybook-lit/?path=/story/krds-range-slider--disabled) · [Form Reset](/native/storybook-lit/?path=/story/krds-range-slider--form-reset) · [Narrow Touch](/native/storybook-lit/?path=/story/krds-range-slider--narrow-touch) · [Input Notification Counts](/native/storybook-lit/?path=/story/krds-range-slider--input-notification-counts) · [Controlled Rejected](/native/storybook-lit/?path=/story/krds-range-slider--controlled-rejected) · [Pointer Cancel](/native/storybook-lit/?path=/story/krds-range-slider--pointer-cancel).
- qwik: [single-value](/native/storybook-qwik/?path=/story/krds-range-slider--single-value) · [discrete](/native/storybook-qwik/?path=/story/krds-range-slider--discrete) · [disabled](/native/storybook-qwik/?path=/story/krds-range-slider--disabled) · [form-reset](/native/storybook-qwik/?path=/story/krds-range-slider--form-reset) · [narrow-touch](/native/storybook-qwik/?path=/story/krds-range-slider--narrow-touch) · [input-notification-counts](/native/storybook-qwik/?path=/story/krds-range-slider--input-notification-counts) · [controlled-rejected](/native/storybook-qwik/?path=/story/krds-range-slider--controlled-rejected) · [pointer-cancel](/native/storybook-qwik/?path=/story/krds-range-slider--pointer-cancel).
- angular: [single-value](/native/storybook-angular/?path=/story/krds-range-slider--single-value) · [discrete](/native/storybook-angular/?path=/story/krds-range-slider--discrete) · [disabled](/native/storybook-angular/?path=/story/krds-range-slider--disabled) · [form-reset](/native/storybook-angular/?path=/story/krds-range-slider--form-reset) · [narrow-touch](/native/storybook-angular/?path=/story/krds-range-slider--narrow-touch) · [input-notification-counts](/native/storybook-angular/?path=/story/krds-range-slider--input-notification-counts) · [controlled-rejected](/native/storybook-angular/?path=/story/krds-range-slider--controlled-rejected) · [pointer-cancel](/native/storybook-angular/?path=/story/krds-range-slider--pointer-cancel).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [read the checked consumer](/examples/svelte-51); [download exact source](/sources/apps/fixture-svelte/src/public-examples/RangeSliderExample.svelte.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:05.892Z`. SHA-256: `49cf06a81cbea5a27c4dced0676a69d073d43ae0c2fc2908331e5d296699551f`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_12_01.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
