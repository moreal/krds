---
title: 'Radio button · 라디오 버튼'
---

# Radio button

라디오 버튼 · `RadioGroup` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_06_01.html) · [Full reviewed specification](/sources/specs/components/radio-group.md.txt) · [Framework support](../compatibility/README.md)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [current subpath manifest](/sources/packages/react/package.json.txt); [historical declaration checkpoint](/sources/packages/react/dist/components/radio-group/index.d.ts.txt) | [react sources and preview policy](../compatibility/README.mdexamples#react) |
| solid | `0.1.0` | planned | [current subpath manifest](/sources/packages/solid/package.json.txt); [historical declaration checkpoint](/sources/packages/solid/dist/components/radio-group/index.d.ts.txt) | [solid sources and preview policy](../compatibility/README.mdexamples#solid) |
| svelte | `0.1.0` | planned | [current subpath manifest](/sources/packages/svelte/package.json.txt); [historical declaration checkpoint](/sources/packages/svelte/dist/components/RadioGroup.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/README.mdexamples#svelte) |
| vue | `0.1.0` | planned | [current subpath manifest](/sources/packages/vue/package.json.txt); [historical declaration checkpoint](/sources/packages/vue/dist/components/radio-group/RadioGroup.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/README.mdexamples#vue) |
| lit | `0.1.0` | planned | [current subpath manifest](/sources/packages/lit/package.json.txt); [historical declaration checkpoint](/sources/packages/lit/dist/components/radio-group/index.d.ts.txt) | [lit sources and preview policy](../compatibility/README.mdexamples#lit) |
| qwik | `0.1.0` | planned | [current subpath manifest](/sources/packages/qwik/package.json.txt); [historical declaration checkpoint](/sources/packages/qwik/dist/components/radio-group/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/README.mdexamples#qwik) |
| angular | `0.1.0` | planned | [current subpath manifest](/sources/packages/angular/package.json.txt); [historical declaration checkpoint](/sources/packages/angular/dist/types/unofficial-krds-angular-radio-group.d.ts.txt) | [angular sources and preview policy](../compatibility/README.mdexamples#angular) |
| solid-next (preview) | `0.1.0-preview.0` | planned | [current root manifest](/sources/packages/solid-next/package.json.txt); [historical declaration checkpoint](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/README.mdexamples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface RadioGroupContract extends ControlledValue<string | null>, FieldContract {
    options: readonly RadioGroupOption[];
    size?: 'medium' | 'large';
    appearance?: 'default' | 'chip';
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

export interface RadioGroupOption extends SelectOption {
    id?: string;
}

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `value` | no | `string \| null` | data / state |
| `defaultValue` | no | `string \| null` | data / state |
| `onValueChange` | no | `(detail: ValueChangeDetails<string \| null>) => void` | semantic event request |
| `id` | no | `string` | data / state |
| `name` | no | `string` | data / state |
| `label` | yes | `string` | data / state |
| `disabled` | no | `boolean` | data / state |
| `required` | no | `boolean` | data / state |
| `invalid` | no | `boolean` | data / state |
| `helpId` | no | `string` | data / state |
| `errorId` | no | `string` | data / state |
| `options` | yes | `readonly RadioGroupOption[]` | data / state |
| `size` | no | `'medium' \| 'large'` | data / state |
| `appearance` | no | `'default' \| 'chip'` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Named fieldset/legend group of native same-name input[type=radio] with associated right-side labels. Vertical default; horizontal requires sufficient spacing. No preselection when deliberate accurate choice matters. Optional “none/unknown” is an explicit host option.

### Plain semantic API

Independent API: `options: readonly RadioGroupOption[]` (`RadioGroupOption` extends existing `SelectOption` with optional `id?:string`), `name`, `value?: string | null`, `defaultValue?: string | null` (uncontrolled baseline `null`), `onValueChange({value:string | null})`, required=false, disabled=false, invalid/errorId/helpId, size=medium, appearance=default|chip. Defined `value`, including `null`, chooses controlled mode; only `undefined` means uncontrolled. `null` means no checked radio. Every string, including `""`, is an ordinary valid option value and must match exactly one unique option; neither empty string nor a missing option is an empty sentinel. Unknown non-null values and duplicate option values are configuration errors. Never insert a “none/unknown” option automatically; that is explicit host content.

Apply the [pilot controlled/reset conventions](/sources/specs/components/README.md.txt): controlled/default together or mode switching is invalid; read default once; one plain user request per changed choice, including when rejected; no mount/hydration/prop/reset change callbacks. Clicking an already selected option is a no-op. A prop transition to `null` clears every checked bit without an event. Controlled rejection reconciles every actual native radio's checked bit to the committed prop, including restoring all unchecked for `null`; the unaccepted browser toggle must not leak into rendering, validity or FormData.

**Explicit option identity (additive composition API):** An option may provide a nonempty unique id for its actual native radio input. Honor that exact ID and associate its real label with the same control; do not create a duplicate proxy input or use the ID as a selection value. If omitted, existing stable generated-ID behavior is unchanged. Duplicate/empty explicit IDs are configuration errors. This radio-specific subtype does not add IDs or change semantics on NativeSelect’s unrelated SelectOption contract. Selection, grouping, null/empty-string values, reset and callbacks remain unchanged.

### Keyboard, focus and state transitions

Preserve the explicit official requirement that **every enabled radio is sequentially reachable with Tab and Shift+Tab**, alongside real same-name native radio grouping and the separately required arrow movement/selection ([official L1211–1218](https://www.krds.go.kr/html/site/component/component_06_01.html)). Disabled radios are skipped. Tab traversal only changes focus; Space, associated-label/control click and the appropriate arrow key choose one option, emitting one changed-value request without duplicate synthetic activation. Keep the focus ring on the visible radio area.

The frozen same-name native examples have the usual browser single-group Tab behavior, which conflicts with the explicit all-radio sequential-access row. That tension does not authorize negating the row or declaring native-default grouping conformant. The proposed contract preserves all-enabled sequential access; The accepted independent implementation policy is to intercept Tab/Shift+Tab while focus is inside the group, focus the next/previous enabled actual same-name native radio without changing checked state, and allow browser exit at group boundaries. Keep all actual radios with ordinary native group attributes; do not rename, clone or replace them. This preserves the explicit sequential-access row while retaining native arrow/form behavior. Each renderer must verify reverse entry/exit and rejected controlled selection; native-default Tab alone is insufficient. Each renderer/browser must demonstrate forward and reverse sequential access through all enabled radios while preserving real radio form/group semantics, arrow selection and no extra Tab-induced selection. Backend/native defaults alone are not evidence of this outcome.

### Responsive/mobile requirements

Prefer vertical label-right arrangement; many (>7 familiar) options may be better Select. Native-app/mobile recommendation is contextual, not exclusion.

### Forms, reset and composition

For `null`, all actual radios are unchecked, a required group is invalid, and no name/value is contributed to FormData. A checked enabled option contributes its exact string (including an empty-string value); disabled controls/fieldset are omitted. Noncanceled reset restores uncontrolled initial `defaultValue`/`null`, while controlled state retains current prop; reconcile all native checked bits and required validity without a change callback. Canceled reset changes neither selection nor native reconciliation baseline. Prop-driven clearing is not a reset or user action. Labels and error/help associations remain native and testable. No editable IME path.

### Asset, integration and composition completion

Host owns ordering (alphabetical default absent justified priority), option data and required validation text. Completion includes real native radio form participation, not button role substitutes.

### Stable parts and states

root, legend, item, control, indicator, label, help, error; checked,unchecked,disabled,invalid.

All rendered owned parts use `data-krds-component="radio-group"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `default`, `chip`, `medium`, `large`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-radio-group--default`, `krds-radio-group--chip`, `krds-radio-group--medium-large`, `krds-radio-group--unselected-required`, `krds-radio-group--disabled-option`, `krds-radio-group--form-reset`, `krds-radio-group--controlled`, `krds-radio-group--all-radio-sequential-access`, `krds-radio-group--controlled-null`, `krds-radio-group--controlled-clear-rejected`, `krds-radio-group--empty-string-option`.

### Local native stories

Fixture and Storybook outputs are local-only and are not hosted on this public documentation site. Build the selected native workspace, then run `node tools/yarn.mjs exec node apps/docs/scripts/serve.mjs`. Open `/krds/native/storybook-<framework>/` on that local server. Solid 2 has no supported native Storybook integration. Qwik production SSR/resume requires its real server and cannot be replaced by a static preview. Story availability does not establish behavioral acceptance.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [read the checked consumer](/examples/svelte-30); [download exact source](/sources/apps/fixture-svelte/src/public-examples/RadioGroupExample.svelte.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:04.390Z`. SHA-256: `28578bf2746fa0f35bb0d4faac7f9c6d2515a9dc3dacc07cb3ffeacdca6c5e44`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_06_01.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/index.md) before redistributing.
