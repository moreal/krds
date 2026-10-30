---
title: 'Tag · 태그'
---

# Tag

태그 · `Tag` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_06_04.html) · [Full reviewed specification](/sources/specs/components/tag.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [exact subpath types](/sources/packages/react/dist/components/tag/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.1.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/tag/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/Tag.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/tag/Tag.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/tag/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/tag/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-tag.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.1.0-preview.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface TagContract {
    items: readonly {
        id: string;
        label: string;
        href?: string;
        disabled?: boolean;
    }[];
    mode?: 'static' | 'toggle' | 'removable' | 'add-filter' | 'link';
    selectedIds?: readonly string[];
    onSelectionChange?: (detail: {
        ids: readonly string[];
    }) => void;
    onRemove?: (detail: {
        id: string;
    }) => void;
    onAdd?: (detail: {
        id: string;
    }) => void;
    onClear?: () => void;
    appliedBarId?: string;
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `items` | yes | `readonly {id: string; label: string; href?: string; disabled?: boolean}[]` | data / state |
| `mode` | no | `'static' \| 'toggle' \| 'removable' \| 'add-filter' \| 'link'` | data / state |
| `selectedIds` | no | `readonly string[]` | data / state |
| `onSelectionChange` | no | `(detail: {ids: readonly string[]}) => void` | semantic event request |
| `onRemove` | no | `(detail: {id: string}) => void` | semantic event request |
| `onAdd` | no | `(detail: {id: string}) => void` | semantic event request |
| `onClear` | no | `() => void` | semantic event request |
| `appliedBarId` | no | `string` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Label/container with optional leading checked icon or trailing remove icon; homogeneous interactive or static groups. Bulk action at group right and optional more control. Use real buttons for filtering/removal, real links only for navigation example.

### Plain semantic API

Independent API: items {id,label,href?}[], mode=static|toggle|removable|add-filter|link, selectedIds/onSelectionChange, onRemove({id}), onAdd({id}), onClear(), appliedBarId. Mode determines semantics; toggle uses aria-pressed; remove name “[label] 옵션 삭제”; add name “[label] 필터 옵션 추가”.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Interactive group entry focuses first; one tag tab stop via roving focus (ArrowLeft/Right/Home/End proposed). Official Space/Enter keyup activation must execute once, not keydown+native click twice. Toggle keeps focus; adding filter moves to applied-filter bar; removing moves to the previous surviving enabled tag, otherwise next surviving enabled tag, otherwise actual group container when no usable tags remain.

### Responsive/mobile requirements

Short &lt;=2-word, unbroken labels and minimal consistent colors; hidden overflow tags are inaccessible until More reveals them. Native touch targets/focus ring remain clear.

### Forms, reset and composition

No automatic form serialization. Filtering state belongs host; group reset can restore host default selectedIds if explicitly composed in a form. IME must not trigger custom Enter action.

### Asset, integration and composition completion

Host owns actual filter results and applied bar target; local story must visibly filter data and manage focus, not merely emit logs.

### Stable parts and states

root, list, item, label, icon, remove, clear, more; selected,disabled,expanded.

All rendered owned parts use `data-krds-component="tag"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `static`, `toggle`, `removable`, `add-filter`, `link`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-tag--static`, `krds-tag--toggle`, `krds-tag--removable`, `krds-tag--add-filter`, `krds-tag--link`, `krds-tag--remove-last`, `krds-tag--overflow`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Static](/native/storybook-react/?path=/story/krds-tag--static) · [Toggle](/native/storybook-react/?path=/story/krds-tag--toggle) · [Removable](/native/storybook-react/?path=/story/krds-tag--removable) · [Add Filter](/native/storybook-react/?path=/story/krds-tag--add-filter) · [Link](/native/storybook-react/?path=/story/krds-tag--link) · [Remove Last](/native/storybook-react/?path=/story/krds-tag--remove-last) · [Overflow](/native/storybook-react/?path=/story/krds-tag--overflow).
- solid: [static](/native/storybook-solid/?path=/story/krds-tag--static) · [toggle](/native/storybook-solid/?path=/story/krds-tag--toggle) · [removable](/native/storybook-solid/?path=/story/krds-tag--removable) · [add-filter](/native/storybook-solid/?path=/story/krds-tag--add-filter) · [link](/native/storybook-solid/?path=/story/krds-tag--link) · [remove-last](/native/storybook-solid/?path=/story/krds-tag--remove-last) · [overflow](/native/storybook-solid/?path=/story/krds-tag--overflow).
- svelte: [static](/native/storybook-svelte/?path=/story/krds-tag--static) · [toggle](/native/storybook-svelte/?path=/story/krds-tag--toggle) · [removable](/native/storybook-svelte/?path=/story/krds-tag--removable) · [add-filter](/native/storybook-svelte/?path=/story/krds-tag--add-filter) · [link](/native/storybook-svelte/?path=/story/krds-tag--link) · [remove-last](/native/storybook-svelte/?path=/story/krds-tag--remove-last) · [overflow](/native/storybook-svelte/?path=/story/krds-tag--overflow).
- vue: [static](/native/storybook-vue/?path=/story/krds-tag--static) · [toggle](/native/storybook-vue/?path=/story/krds-tag--toggle) · [removable](/native/storybook-vue/?path=/story/krds-tag--removable) · [add-filter](/native/storybook-vue/?path=/story/krds-tag--add-filter) · [link](/native/storybook-vue/?path=/story/krds-tag--link) · [remove-last](/native/storybook-vue/?path=/story/krds-tag--remove-last) · [overflow](/native/storybook-vue/?path=/story/krds-tag--overflow).
- lit: [Static](/native/storybook-lit/?path=/story/krds-tag--static) · [Toggle](/native/storybook-lit/?path=/story/krds-tag--toggle) · [Removable](/native/storybook-lit/?path=/story/krds-tag--removable) · [Add Filter](/native/storybook-lit/?path=/story/krds-tag--add-filter) · [Link](/native/storybook-lit/?path=/story/krds-tag--link) · [Remove Last](/native/storybook-lit/?path=/story/krds-tag--remove-last) · [Overflow](/native/storybook-lit/?path=/story/krds-tag--overflow).
- qwik: [static](/native/storybook-qwik/?path=/story/krds-tag--static) · [toggle](/native/storybook-qwik/?path=/story/krds-tag--toggle) · [removable](/native/storybook-qwik/?path=/story/krds-tag--removable) · [add-filter](/native/storybook-qwik/?path=/story/krds-tag--add-filter) · [link](/native/storybook-qwik/?path=/story/krds-tag--link) · [remove-last](/native/storybook-qwik/?path=/story/krds-tag--remove-last) · [overflow](/native/storybook-qwik/?path=/story/krds-tag--overflow).
- angular: [static](/native/storybook-angular/?path=/story/krds-tag--static) · [toggle](/native/storybook-angular/?path=/story/krds-tag--toggle) · [removable](/native/storybook-angular/?path=/story/krds-tag--removable) · [add-filter](/native/storybook-angular/?path=/story/krds-tag--add-filter) · [link](/native/storybook-angular/?path=/story/krds-tag--link) · [remove-last](/native/storybook-angular/?path=/story/krds-tag--remove-last) · [overflow](/native/storybook-angular/?path=/story/krds-tag--overflow).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [read the checked consumer](/examples/svelte-33); [download exact source](/sources/apps/fixture-svelte/src/public-examples/TagExample.svelte.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:04.603Z`. SHA-256: `fcd8bad8d3bc0942c03112ebd00b07645cca0281f14fe07c9faf021c1da60857`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_06_04.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
