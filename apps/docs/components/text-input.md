---
title: 'Text input · 텍스트 입력 필드'
---

# Text input

텍스트 입력 필드 · `TextInput` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_09_03.html) · [Full reviewed specification](/sources/specs/components/text-input.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [exact subpath types](/sources/packages/react/dist/components/text-input/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.1.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/text-input/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/TextInput.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/text-input/TextInput.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/text-input/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/text-input/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-text-input.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.1.0-preview.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface TextInputContract extends ControlledValue<string>, FieldContract {
    type?: 'text' | 'email' | 'tel' | 'url' | 'password' | 'search';
    autocomplete?: string;
    inputMode?: string;
    readOnly?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    status?: 'default' | 'error' | 'success';
    size?: Size;
    iconAction?: {
        label: string;
        onAction: () => void;
    };
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

export type Size = 'small' | 'medium' | 'large';
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `value` | no | `string` | data / state |
| `defaultValue` | no | `string` | data / state |
| `onValueChange` | no | `(detail: ValueChangeDetails<string>) => void` | semantic event request |
| `id` | no | `string` | data / state |
| `name` | no | `string` | data / state |
| `label` | yes | `string` | data / state |
| `disabled` | no | `boolean` | data / state |
| `required` | no | `boolean` | data / state |
| `invalid` | no | `boolean` | data / state |
| `helpId` | no | `string` | data / state |
| `errorId` | no | `string` | data / state |
| `type` | no | `'text' \| 'email' \| 'tel' \| 'url' \| 'password' \| 'search'` | data / state |
| `autocomplete` | no | `string` | data / state |
| `inputMode` | no | `string` | data / state |
| `readOnly` | no | `boolean` | data / state |
| `minLength` | no | `number` | data / state |
| `maxLength` | no | `number` | data / state |
| `pattern` | no | `string` | data / state |
| `status` | no | `'default' \| 'error' \| 'success'` | data / state |
| `size` | no | `Size` | data / state |
| `iconAction` | no | `{label: string; onAction: () => void}` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Native single-line input with persistent label, optional help/error and placeholder, optional separately named icon button. Visible focus and error/success cues. Browser autocomplete for recurring personal information; do not block paste.

### Plain semantic API

Independent API: type=text|email|tel|url|password|search (text default), value/defaultValue="", onValueChange({value}), name, autocomplete,inputMode, required, disabled, readOnly, minLength/maxLength/pattern, status=default|error|success, helpId/errorId, size=medium, iconAction? {label,onAction}. No date parsing or numeric coercion by default.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Native editing/selection, label click focuses. Icon button type=button does not submit. Do not rewrite value during Korean IME or treat composing Enter as confirm. Native normal Enter form submission remains host/browser behavior after composition.

### Responsive/mobile requirements

Fluid field generally fills section; predictable short fields may size to expected input but remain uncut on small screen. Mobile keyboard uses provided type/inputMode, never force numeric keyboard for arbitrary identifiers.

### Forms, reset and composition

Native name/value FormData, disabled excluded/readonly included, reset defaultValue, controlled reset retains current prop without a callback. Errors aria-invalid/description and required validity. Password reveal if offered must preserve value/caret and change accessible toggle label.

### Asset, integration and composition completion

Host owns validation timing, personal-data autocomplete tokens, optional reveal/search action and remote checks. Local stories cannot call auth/API.

### Stable parts and states

root, label, control, help, error, icon-action; invalid,success,disabled,readonly,focused.

All rendered owned parts use `data-krds-component="text-input"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `default`, `error`, `success`, `small`, `medium`, `large`, `icon-action`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-text-input--default`, `krds-text-input--error`, `krds-text-input--success`, `krds-text-input--sizes`, `krds-text-input--icon-action`, `krds-text-input--disabled-readonly`, `krds-text-input--ime`, `krds-text-input--form-reset`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Default](/native/storybook-react/?path=/story/krds-text-input--default) · [Error](/native/storybook-react/?path=/story/krds-text-input--error) · [Success](/native/storybook-react/?path=/story/krds-text-input--success) · [Sizes](/native/storybook-react/?path=/story/krds-text-input--sizes) · [Icon Action](/native/storybook-react/?path=/story/krds-text-input--icon-action) · [Disabled Readonly](/native/storybook-react/?path=/story/krds-text-input--disabled-readonly) · [Ime](/native/storybook-react/?path=/story/krds-text-input--ime) · [Form Reset](/native/storybook-react/?path=/story/krds-text-input--form-reset).
- solid: [default](/native/storybook-solid/?path=/story/krds-text-input--default) · [error](/native/storybook-solid/?path=/story/krds-text-input--error) · [success](/native/storybook-solid/?path=/story/krds-text-input--success) · [sizes](/native/storybook-solid/?path=/story/krds-text-input--sizes) · [icon-action](/native/storybook-solid/?path=/story/krds-text-input--icon-action) · [disabled-readonly](/native/storybook-solid/?path=/story/krds-text-input--disabled-readonly) · [ime](/native/storybook-solid/?path=/story/krds-text-input--ime) · [form-reset](/native/storybook-solid/?path=/story/krds-text-input--form-reset).
- svelte: [default](/native/storybook-svelte/?path=/story/krds-text-input--default) · [error](/native/storybook-svelte/?path=/story/krds-text-input--error) · [success](/native/storybook-svelte/?path=/story/krds-text-input--success) · [sizes](/native/storybook-svelte/?path=/story/krds-text-input--sizes) · [icon-action](/native/storybook-svelte/?path=/story/krds-text-input--icon-action) · [disabled-readonly](/native/storybook-svelte/?path=/story/krds-text-input--disabled-readonly) · [ime](/native/storybook-svelte/?path=/story/krds-text-input--ime) · [form-reset](/native/storybook-svelte/?path=/story/krds-text-input--form-reset).
- vue: [default](/native/storybook-vue/?path=/story/krds-text-input--default) · [error](/native/storybook-vue/?path=/story/krds-text-input--error) · [success](/native/storybook-vue/?path=/story/krds-text-input--success) · [sizes](/native/storybook-vue/?path=/story/krds-text-input--sizes) · [icon-action](/native/storybook-vue/?path=/story/krds-text-input--icon-action) · [disabled-readonly](/native/storybook-vue/?path=/story/krds-text-input--disabled-readonly) · [ime](/native/storybook-vue/?path=/story/krds-text-input--ime) · [form-reset](/native/storybook-vue/?path=/story/krds-text-input--form-reset).
- lit: [Default](/native/storybook-lit/?path=/story/krds-text-input--default) · [Error](/native/storybook-lit/?path=/story/krds-text-input--error) · [Success](/native/storybook-lit/?path=/story/krds-text-input--success) · [Sizes](/native/storybook-lit/?path=/story/krds-text-input--sizes) · [Icon Action](/native/storybook-lit/?path=/story/krds-text-input--icon-action) · [Disabled Readonly](/native/storybook-lit/?path=/story/krds-text-input--disabled-readonly) · [Ime](/native/storybook-lit/?path=/story/krds-text-input--ime) · [Form Reset](/native/storybook-lit/?path=/story/krds-text-input--form-reset).
- qwik: [default](/native/storybook-qwik/?path=/story/krds-text-input--default) · [error](/native/storybook-qwik/?path=/story/krds-text-input--error) · [success](/native/storybook-qwik/?path=/story/krds-text-input--success) · [sizes](/native/storybook-qwik/?path=/story/krds-text-input--sizes) · [icon-action](/native/storybook-qwik/?path=/story/krds-text-input--icon-action) · [disabled-readonly](/native/storybook-qwik/?path=/story/krds-text-input--disabled-readonly) · [ime](/native/storybook-qwik/?path=/story/krds-text-input--ime) · [form-reset](/native/storybook-qwik/?path=/story/krds-text-input--form-reset).
- angular: [default](/native/storybook-angular/?path=/story/krds-text-input--default) · [error](/native/storybook-angular/?path=/story/krds-text-input--error) · [success](/native/storybook-angular/?path=/story/krds-text-input--success) · [sizes](/native/storybook-angular/?path=/story/krds-text-input--sizes) · [icon-action](/native/storybook-angular/?path=/story/krds-text-input--icon-action) · [disabled-readonly](/native/storybook-angular/?path=/story/krds-text-input--disabled-readonly) · [ime](/native/storybook-angular/?path=/story/krds-text-input--ime) · [form-reset](/native/storybook-angular/?path=/story/krds-text-input--form-reset).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [read the checked consumer](/examples/svelte-45); [download exact source](/sources/apps/fixture-svelte/src/public-examples/TextInputExample.svelte.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:05.462Z`. SHA-256: `5644f9fe165d0143d87c56356cf23de1658d4b13c4a20cc180b8d10bc223a53f`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_09_03.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
