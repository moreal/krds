---
title: 'Quantity toggle · 수량 토글'
---

# Quantity toggle

수량 토글 · `QuantityToggle` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_12_04.html) · [Full reviewed specification](/sources/specs/components/quantity-toggle.md.txt) · [Framework support](../compatibility/README.md)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/quantity-toggle/index.d.ts.txt) | [react sources and preview policy](../compatibility/README.mdexamples#react) |
| solid | `0.0.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/quantity-toggle/index.d.ts.txt) | [solid sources and preview policy](../compatibility/README.mdexamples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/QuantityToggle.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/README.mdexamples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/quantity-toggle/QuantityToggle.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/README.mdexamples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/quantity-toggle/index.d.ts.txt) | [lit sources and preview policy](../compatibility/README.mdexamples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/quantity-toggle/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/README.mdexamples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-quantity-toggle.d.ts.txt) | [angular sources and preview policy](../compatibility/README.mdexamples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/README.mdexamples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface QuantityToggleContract extends ControlledValue<number>, FieldContract {
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
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
| `unit` | no | `string` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Labeled group with decrement button, visible current quantity centered, increment button separated by field. User adjusts by buttons, not keyboard text entry. Bound available choices to &lt;=11 levels including baseline; reaching limit disables corresponding button.

### Plain semantic API

Independent API: min=0,max=10,step=1,value/defaultValue=min,onValueChange({value}),name?,disabled=false,label,unit?. Reject configuration with >11 selectable values or inconsistent step. Center output is read-only text, not editable spinbutton; named hidden value can serialize.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Independent policy: native buttons click/Enter/Space change once. Stable names “decrease/increase [quantity label]”; output relationship identifies current value. At newly disabled boundary, focus retention must remain perceivable (accepted independent policy uses aria-disabled button with blocked activation while keeping focus).

### Responsive/mobile requirements

Button hit regions sufficiently large and spaced around centered value; label/value remain visible on narrow/zoom. No press-and-hold autorepeat default or drag gesture.

### Forms, reset and composition

Optional named hidden input carries actual numeric string and is omitted when disabled; reset restores initial value or controlled reset retains current prop without a callback. Buttons type=button. No free-text/IME path.

### Asset, integration and composition completion

Host owns commonly selected default, bounds and real quantity effect. Completion includes actual boundary feedback and form reset, not static plus/minus icons.

### Stable parts and states

root, label, decrement, output, increment, hidden-input; at-minimum,at-maximum,disabled.

All rendered owned parts use `data-krds-component="quantity-toggle"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `default`, `minimum`, `maximum`, `disabled`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-quantity-toggle--default`, `krds-quantity-toggle--minimum`, `krds-quantity-toggle--maximum`, `krds-quantity-toggle--disabled`, `krds-quantity-toggle--unit-label`, `krds-quantity-toggle--form-reset`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Default](/native/storybook-react/?path=/story/krds-quantity-toggle--default) · [Minimum](/native/storybook-react/?path=/story/krds-quantity-toggle--minimum) · [Maximum](/native/storybook-react/?path=/story/krds-quantity-toggle--maximum) · [Disabled](/native/storybook-react/?path=/story/krds-quantity-toggle--disabled) · [Unit Label](/native/storybook-react/?path=/story/krds-quantity-toggle--unit-label) · [Form Reset](/native/storybook-react/?path=/story/krds-quantity-toggle--form-reset).
- solid: [default](/native/storybook-solid/?path=/story/krds-quantity-toggle--default) · [minimum](/native/storybook-solid/?path=/story/krds-quantity-toggle--minimum) · [maximum](/native/storybook-solid/?path=/story/krds-quantity-toggle--maximum) · [disabled](/native/storybook-solid/?path=/story/krds-quantity-toggle--disabled) · [unit-label](/native/storybook-solid/?path=/story/krds-quantity-toggle--unit-label) · [form-reset](/native/storybook-solid/?path=/story/krds-quantity-toggle--form-reset).
- svelte: [default](/native/storybook-svelte/?path=/story/krds-quantity-toggle--default) · [minimum](/native/storybook-svelte/?path=/story/krds-quantity-toggle--minimum) · [maximum](/native/storybook-svelte/?path=/story/krds-quantity-toggle--maximum) · [disabled](/native/storybook-svelte/?path=/story/krds-quantity-toggle--disabled) · [unit-label](/native/storybook-svelte/?path=/story/krds-quantity-toggle--unit-label) · [form-reset](/native/storybook-svelte/?path=/story/krds-quantity-toggle--form-reset).
- vue: [default](/native/storybook-vue/?path=/story/krds-quantity-toggle--default) · [minimum](/native/storybook-vue/?path=/story/krds-quantity-toggle--minimum) · [maximum](/native/storybook-vue/?path=/story/krds-quantity-toggle--maximum) · [disabled](/native/storybook-vue/?path=/story/krds-quantity-toggle--disabled) · [unit-label](/native/storybook-vue/?path=/story/krds-quantity-toggle--unit-label) · [form-reset](/native/storybook-vue/?path=/story/krds-quantity-toggle--form-reset).
- lit: [Default](/native/storybook-lit/?path=/story/krds-quantity-toggle--default) · [Minimum](/native/storybook-lit/?path=/story/krds-quantity-toggle--minimum) · [Maximum](/native/storybook-lit/?path=/story/krds-quantity-toggle--maximum) · [Disabled](/native/storybook-lit/?path=/story/krds-quantity-toggle--disabled) · [Unit Label](/native/storybook-lit/?path=/story/krds-quantity-toggle--unit-label) · [Form Reset](/native/storybook-lit/?path=/story/krds-quantity-toggle--form-reset).
- qwik: [default](/native/storybook-qwik/?path=/story/krds-quantity-toggle--default) · [minimum](/native/storybook-qwik/?path=/story/krds-quantity-toggle--minimum) · [maximum](/native/storybook-qwik/?path=/story/krds-quantity-toggle--maximum) · [disabled](/native/storybook-qwik/?path=/story/krds-quantity-toggle--disabled) · [unit-label](/native/storybook-qwik/?path=/story/krds-quantity-toggle--unit-label) · [form-reset](/native/storybook-qwik/?path=/story/krds-quantity-toggle--form-reset).
- angular: [default](/native/storybook-angular/?path=/story/krds-quantity-toggle--default) · [minimum](/native/storybook-angular/?path=/story/krds-quantity-toggle--minimum) · [maximum](/native/storybook-angular/?path=/story/krds-quantity-toggle--maximum) · [disabled](/native/storybook-angular/?path=/story/krds-quantity-toggle--disabled) · [unit-label](/native/storybook-angular/?path=/story/krds-quantity-toggle--unit-label) · [form-reset](/native/storybook-angular/?path=/story/krds-quantity-toggle--form-reset).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-54); [download exact source](/sources/apps/fixture-svelte/src/public-examples/QuantityToggleExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:06.116Z`. SHA-256: `d896d4eea40d962bc4cf335c1d325e9101ffd5dd8d8a942d892a8ad97ab4d522`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_12_04.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/index.md) before redistributing.
