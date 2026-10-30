---
title: 'Toggle switch · 토글 스위치'
---

# Toggle switch

토글 스위치 · `Switch` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_06_07.html) · [Full reviewed specification](/sources/specs/components/switch.md.txt) · [Framework support](../compatibility/README.md)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [exact subpath types](/sources/packages/react/dist/components/switch/index.d.ts.txt) | [react sources and preview policy](../compatibility/README.mdexamples#react) |
| solid | `0.1.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/switch/index.d.ts.txt) | [solid sources and preview policy](../compatibility/README.mdexamples#solid) |
| svelte | `0.1.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/Switch.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/README.mdexamples#svelte) |
| vue | `0.1.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/switch/Switch.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/README.mdexamples#vue) |
| lit | `0.1.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/switch/index.d.ts.txt) | [lit sources and preview policy](../compatibility/README.mdexamples#lit) |
| qwik | `0.1.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/switch/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/README.mdexamples#qwik) |
| angular | `0.1.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-switch.d.ts.txt) | [angular sources and preview policy](../compatibility/README.mdexamples#angular) |
| solid-next (preview) | `0.1.0-preview.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/README.mdexamples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface SwitchContract extends FieldContract {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (detail: {
        checked: boolean;
    }) => void;
    value?: string;
    size?: 'medium' | 'large';
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
| `id` | no | `string` | data / state |
| `name` | no | `string` | data / state |
| `label` | yes | `string` | data / state |
| `disabled` | no | `boolean` | data / state |
| `required` | no | `boolean` | data / state |
| `invalid` | no | `boolean` | data / state |
| `helpId` | no | `string` | data / state |
| `errorId` | no | `string` | data / state |
| `checked` | no | `boolean` | data / state |
| `defaultChecked` | no | `boolean` | data / state |
| `onCheckedChange` | no | `(detail: {checked: boolean}) => void` | semantic event request |
| `value` | no | `string` | data / state |
| `size` | no | `'medium' \| 'large'` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Labeled boolean control with track, handle, state icon and optional aria-describedby help. Stable purpose label does not change with state. Use native checkbox with role=switch and actual checked boolean; no mixed state.

### Plain semantic API

Independent API: checked/defaultChecked=false, onCheckedChange({checked}), label, name/value optional, disabled=false, help/error IDs, size=medium. Callback requests immediate setting application; controlled host can reject while pending without visually lying.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Label/control click and Space toggle once; normal Tab/focus. aria-checked actual state; no extra Enter requirement inferred. State icon/handle provides noncolor clue and 3:1 contrast.

### Responsive/mobile requirements

Consistent label/control layout throughout page; nearby label on wide container. Touch-friendly target and readable help on narrow screens.

### Forms, reset and composition

If named, native checked checkbox FormData behavior; uncontrolled reset restores defaultChecked, controlled state remains its current prop without a callback. Setting side effects occur only from explicit user action/host policy, not mount/prop/reset replay. No IME.

### Asset, integration and composition completion

Host owns actual preference/storage/async error. Do not use for choices requiring separate Apply; Checkbox/Radio fits those cases. Local stories change an observable local setting.

### Stable parts and states

root, control, track, handle, state-icon, label, help; checked,unchecked,disabled.

All rendered owned parts use `data-krds-component="switch"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `medium`, `large`, `with-help`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-switch--medium`, `krds-switch--large`, `krds-switch--with-help`, `krds-switch--disabled`, `krds-switch--controlled-rejected`, `krds-switch--form-reset`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Medium](/native/storybook-react/?path=/story/krds-switch--medium) · [Large](/native/storybook-react/?path=/story/krds-switch--large) · [With Help](/native/storybook-react/?path=/story/krds-switch--with-help) · [Disabled](/native/storybook-react/?path=/story/krds-switch--disabled) · [Controlled Rejected](/native/storybook-react/?path=/story/krds-switch--controlled-rejected) · [Form Reset](/native/storybook-react/?path=/story/krds-switch--form-reset).
- solid: [medium](/native/storybook-solid/?path=/story/krds-switch--medium) · [large](/native/storybook-solid/?path=/story/krds-switch--large) · [with-help](/native/storybook-solid/?path=/story/krds-switch--with-help) · [disabled](/native/storybook-solid/?path=/story/krds-switch--disabled) · [controlled-rejected](/native/storybook-solid/?path=/story/krds-switch--controlled-rejected) · [form-reset](/native/storybook-solid/?path=/story/krds-switch--form-reset).
- svelte: [medium](/native/storybook-svelte/?path=/story/krds-switch--medium) · [large](/native/storybook-svelte/?path=/story/krds-switch--large) · [with-help](/native/storybook-svelte/?path=/story/krds-switch--with-help) · [disabled](/native/storybook-svelte/?path=/story/krds-switch--disabled) · [controlled-rejected](/native/storybook-svelte/?path=/story/krds-switch--controlled-rejected) · [form-reset](/native/storybook-svelte/?path=/story/krds-switch--form-reset).
- vue: [medium](/native/storybook-vue/?path=/story/krds-switch--medium) · [large](/native/storybook-vue/?path=/story/krds-switch--large) · [with-help](/native/storybook-vue/?path=/story/krds-switch--with-help) · [disabled](/native/storybook-vue/?path=/story/krds-switch--disabled) · [controlled-rejected](/native/storybook-vue/?path=/story/krds-switch--controlled-rejected) · [form-reset](/native/storybook-vue/?path=/story/krds-switch--form-reset).
- lit: [Medium](/native/storybook-lit/?path=/story/krds-switch--medium) · [Large](/native/storybook-lit/?path=/story/krds-switch--large) · [With Help](/native/storybook-lit/?path=/story/krds-switch--with-help) · [Disabled](/native/storybook-lit/?path=/story/krds-switch--disabled) · [Controlled Rejected](/native/storybook-lit/?path=/story/krds-switch--controlled-rejected) · [Form Reset](/native/storybook-lit/?path=/story/krds-switch--form-reset).
- qwik: [medium](/native/storybook-qwik/?path=/story/krds-switch--medium) · [large](/native/storybook-qwik/?path=/story/krds-switch--large) · [with-help](/native/storybook-qwik/?path=/story/krds-switch--with-help) · [disabled](/native/storybook-qwik/?path=/story/krds-switch--disabled) · [controlled-rejected](/native/storybook-qwik/?path=/story/krds-switch--controlled-rejected) · [form-reset](/native/storybook-qwik/?path=/story/krds-switch--form-reset).
- angular: [medium](/native/storybook-angular/?path=/story/krds-switch--medium) · [large](/native/storybook-angular/?path=/story/krds-switch--large) · [with-help](/native/storybook-angular/?path=/story/krds-switch--with-help) · [disabled](/native/storybook-angular/?path=/story/krds-switch--disabled) · [controlled-rejected](/native/storybook-angular/?path=/story/krds-switch--controlled-rejected) · [form-reset](/native/storybook-angular/?path=/story/krds-switch--form-reset).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [read the checked consumer](/examples/svelte-34); [download exact source](/sources/apps/fixture-svelte/src/public-examples/SwitchExample.svelte.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:04.668Z`. SHA-256: `d24abf7be779128a28e4a62746ccfe801a442cacb0d3ecb5386b92062b554625`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_06_07.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/index.md) before redistributing.
