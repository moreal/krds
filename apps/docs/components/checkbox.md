---
title: 'Checkbox · 체크박스'
---

# Checkbox

체크박스 · `Checkbox` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_06_02.html) · [Full reviewed specification](/sources/specs/components/checkbox.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [exact subpath types](/sources/packages/react/dist/components/checkbox/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.1.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/checkbox/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/Checkbox.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/checkbox/Checkbox.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/checkbox/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/checkbox/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-checkbox.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.1.0-preview.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface CheckboxContract extends FieldContract {
    checked?: boolean;
    defaultChecked?: boolean;
    indeterminate?: boolean;
    onCheckedChange?: (detail: {
        checked: boolean;
    }) => void;
    value?: string;
    appearance?: 'default' | 'chip';
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
| `indeterminate` | no | `boolean` | data / state |
| `onCheckedChange` | no | `(detail: {checked: boolean}) => void` | semantic event request |
| `value` | no | `string` | data / state |
| `appearance` | no | `'default' \| 'chip'` | data / state |
| `size` | no | `'medium' \| 'large'` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Native checkbox and associated label, optional fieldset/legend group. Hierarchical select-all parent exposes mixed when some children checked; binary controls independent. Vertical with right labels default.

### Plain semantic API

Independent API: `checked?:boolean`, `defaultChecked?:boolean=false`, `indeterminate:boolean=false`, `onCheckedChange({checked:boolean})`, name/value="on", disabled=false, required=false, invalid/errorId/helpId, appearance=default|chip, size=medium. Defined checked chooses controlled checked mode; absent checked chooses uncontrolled mode with a read-once defaultChecked. Both or mode switching is invalid. **Indeterminate is always host-authoritative**, including its default false; it has no separate uncontrolled mode or defaultIndeterminate. The group owner derives it from current eligible child choices; it is not reset to an invented mixed-state baseline. Apply both actual `input.checked` and `input.indeterminate`; never serialize the word "mixed".

The [pilot notification/reset conventions](/sources/specs/components/README.md.txt) apply: one checked-change request for a changed user toggle, none for mount, props, reconciliation or reset. After native activation clears the browser's indeterminate bit, reapply authoritative indeterminate and the controlled checked prop (or newly committed uncontrolled checked). A rejected controlled action must restore **both** bits, so a declined selection from a mixed parent remains genuinely mixed.

### Keyboard, focus and state transitions

Click label/control and Space toggle once, with normal Tab order. A select-all parent is controlled by the group owner: checked iff all eligible enabled children are checked, indeterminate iff some but not all are checked. From mixed, activation requests selecting all eligible children; from all-checked, activation requests clearing all. Disabled children do not silently change. Recompute the parent from the actual committed children after accepted or rejected changes, not from a guessed result of its native click. Contrast/noncolor check and visible focus remain required.

### Responsive/mobile requirements

Vertical default; horizontal labels need clear spacing and narrow wrap. No tiny hidden native control whose focus geometry differs from visible checkbox.

### Forms, reset and composition

Only the actual checked bit on an enabled named checkbox determines FormData success; indeterminate alone does not. Noncanceled reset restores uncontrolled checked to initial defaultChecked, retains controlled checked, and reapplies the current host-authoritative indeterminate; there is no unconditional “clear mixed” rule. In a select-all composition, first restore each child's applicable reset state, then recompute the parent's checked/indeterminate pair from those committed eligible children. An initially partially selected group therefore resets back to a mixed parent. The derived host recomputation/reconciliation emits zero user-change callbacks. A canceled reset is a no-op for children, parent and both native bits. Native required validation stays tied to the real input checked state. No IME editing.

### Asset, integration and composition completion

Group owner defines select-all scope/disabled-child policy; the accepted independent select-all scope includes eligible enabled children only; disabled children retain their own state. No immediate setting side effect implied; submission/Apply belongs host.

### Stable parts and states

root, control, indicator, label, legend, help, error; checked,unchecked,mixed,disabled,invalid.

All rendered owned parts use `data-krds-component="checkbox"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `binary`, `mixed-parent`, `chip`, `medium`, `large`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-checkbox--binary`, `krds-checkbox--mixed-parent`, `krds-checkbox--chip`, `krds-checkbox--sizes`, `krds-checkbox--disabled`, `krds-checkbox--form-reset`, `krds-checkbox--required`, `krds-checkbox--initial-partial-reset`, `krds-checkbox--controlled-mixed-rejected`, `krds-checkbox--canceled-reset`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Binary](/native/storybook-react/?path=/story/krds-checkbox--binary) · [Mixed Parent](/native/storybook-react/?path=/story/krds-checkbox--mixed-parent) · [Chip](/native/storybook-react/?path=/story/krds-checkbox--chip) · [Sizes](/native/storybook-react/?path=/story/krds-checkbox--sizes) · [Disabled](/native/storybook-react/?path=/story/krds-checkbox--disabled) · [Form Reset](/native/storybook-react/?path=/story/krds-checkbox--form-reset) · [Required](/native/storybook-react/?path=/story/krds-checkbox--required) · [Initial Partial Reset](/native/storybook-react/?path=/story/krds-checkbox--initial-partial-reset) · [Controlled Mixed Rejected](/native/storybook-react/?path=/story/krds-checkbox--controlled-mixed-rejected) · [Canceled Reset](/native/storybook-react/?path=/story/krds-checkbox--canceled-reset).
- solid: [binary](/native/storybook-solid/?path=/story/krds-checkbox--binary) · [mixed-parent](/native/storybook-solid/?path=/story/krds-checkbox--mixed-parent) · [chip](/native/storybook-solid/?path=/story/krds-checkbox--chip) · [sizes](/native/storybook-solid/?path=/story/krds-checkbox--sizes) · [disabled](/native/storybook-solid/?path=/story/krds-checkbox--disabled) · [form-reset](/native/storybook-solid/?path=/story/krds-checkbox--form-reset) · [required](/native/storybook-solid/?path=/story/krds-checkbox--required) · [initial-partial-reset](/native/storybook-solid/?path=/story/krds-checkbox--initial-partial-reset) · [controlled-mixed-rejected](/native/storybook-solid/?path=/story/krds-checkbox--controlled-mixed-rejected) · [canceled-reset](/native/storybook-solid/?path=/story/krds-checkbox--canceled-reset).
- svelte: [binary](/native/storybook-svelte/?path=/story/krds-checkbox--binary) · [mixed-parent](/native/storybook-svelte/?path=/story/krds-checkbox--mixed-parent) · [chip](/native/storybook-svelte/?path=/story/krds-checkbox--chip) · [sizes](/native/storybook-svelte/?path=/story/krds-checkbox--sizes) · [disabled](/native/storybook-svelte/?path=/story/krds-checkbox--disabled) · [form-reset](/native/storybook-svelte/?path=/story/krds-checkbox--form-reset) · [required](/native/storybook-svelte/?path=/story/krds-checkbox--required) · [initial-partial-reset](/native/storybook-svelte/?path=/story/krds-checkbox--initial-partial-reset) · [controlled-mixed-rejected](/native/storybook-svelte/?path=/story/krds-checkbox--controlled-mixed-rejected) · [canceled-reset](/native/storybook-svelte/?path=/story/krds-checkbox--canceled-reset).
- vue: [binary](/native/storybook-vue/?path=/story/krds-checkbox--binary) · [mixed-parent](/native/storybook-vue/?path=/story/krds-checkbox--mixed-parent) · [chip](/native/storybook-vue/?path=/story/krds-checkbox--chip) · [sizes](/native/storybook-vue/?path=/story/krds-checkbox--sizes) · [disabled](/native/storybook-vue/?path=/story/krds-checkbox--disabled) · [form-reset](/native/storybook-vue/?path=/story/krds-checkbox--form-reset) · [required](/native/storybook-vue/?path=/story/krds-checkbox--required) · [initial-partial-reset](/native/storybook-vue/?path=/story/krds-checkbox--initial-partial-reset) · [controlled-mixed-rejected](/native/storybook-vue/?path=/story/krds-checkbox--controlled-mixed-rejected) · [canceled-reset](/native/storybook-vue/?path=/story/krds-checkbox--canceled-reset).
- lit: [Binary](/native/storybook-lit/?path=/story/krds-checkbox--binary) · [Mixed Parent](/native/storybook-lit/?path=/story/krds-checkbox--mixed-parent) · [Chip](/native/storybook-lit/?path=/story/krds-checkbox--chip) · [Sizes](/native/storybook-lit/?path=/story/krds-checkbox--sizes) · [Disabled](/native/storybook-lit/?path=/story/krds-checkbox--disabled) · [Form Reset](/native/storybook-lit/?path=/story/krds-checkbox--form-reset) · [Required](/native/storybook-lit/?path=/story/krds-checkbox--required) · [Initial Partial Reset](/native/storybook-lit/?path=/story/krds-checkbox--initial-partial-reset) · [Controlled Mixed Rejected](/native/storybook-lit/?path=/story/krds-checkbox--controlled-mixed-rejected) · [Canceled Reset](/native/storybook-lit/?path=/story/krds-checkbox--canceled-reset).
- qwik: [binary](/native/storybook-qwik/?path=/story/krds-checkbox--binary) · [mixed-parent](/native/storybook-qwik/?path=/story/krds-checkbox--mixed-parent) · [chip](/native/storybook-qwik/?path=/story/krds-checkbox--chip) · [sizes](/native/storybook-qwik/?path=/story/krds-checkbox--sizes) · [disabled](/native/storybook-qwik/?path=/story/krds-checkbox--disabled) · [form-reset](/native/storybook-qwik/?path=/story/krds-checkbox--form-reset) · [required](/native/storybook-qwik/?path=/story/krds-checkbox--required) · [initial-partial-reset](/native/storybook-qwik/?path=/story/krds-checkbox--initial-partial-reset) · [controlled-mixed-rejected](/native/storybook-qwik/?path=/story/krds-checkbox--controlled-mixed-rejected) · [canceled-reset](/native/storybook-qwik/?path=/story/krds-checkbox--canceled-reset).
- angular: [binary](/native/storybook-angular/?path=/story/krds-checkbox--binary) · [mixed-parent](/native/storybook-angular/?path=/story/krds-checkbox--mixed-parent) · [chip](/native/storybook-angular/?path=/story/krds-checkbox--chip) · [sizes](/native/storybook-angular/?path=/story/krds-checkbox--sizes) · [disabled](/native/storybook-angular/?path=/story/krds-checkbox--disabled) · [form-reset](/native/storybook-angular/?path=/story/krds-checkbox--form-reset) · [required](/native/storybook-angular/?path=/story/krds-checkbox--required) · [initial-partial-reset](/native/storybook-angular/?path=/story/krds-checkbox--initial-partial-reset) · [controlled-mixed-rejected](/native/storybook-angular/?path=/story/krds-checkbox--controlled-mixed-rejected) · [canceled-reset](/native/storybook-angular/?path=/story/krds-checkbox--canceled-reset).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [read the checked consumer](/examples/svelte-31); [download exact source](/sources/apps/fixture-svelte/src/public-examples/CheckboxExample.svelte.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:04.458Z`. SHA-256: `ec11aad1a4bb2912e7381e3e81472e30817fdc92cdb712de0e039e95fc0fe537`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_06_02.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
