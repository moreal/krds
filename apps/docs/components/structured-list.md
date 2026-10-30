---
title: 'Structured list · 구조화 목록'
---

# Structured list

구조화 목록 · `StructuredList` · composition

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_04_01.html) · [Full reviewed specification](/sources/specs/components/structured-list.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [exact subpath types](/sources/packages/react/dist/components/structured-list/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.1.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/structured-list/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/StructuredList.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/structured-list/StructuredList.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/structured-list/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/structured-list/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-structured-list.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.1.0-preview.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface StructuredListContract {
    items: readonly StructuredListItem[];
    variant?: 'list' | 'table';
    toolbar?: readonly {
        id: string;
        label: string;
        disabled?: boolean;
    }[];
    selection?: {
        ids: readonly string[];
        onChange: (detail: {
            ids: readonly string[];
        }) => void;
    };
    sort?: {
        key: string;
        direction: 'ascending' | 'descending';
        onChange: (detail: {
            key: string;
            direction: 'ascending' | 'descending';
        }) => void;
    };
}

/** Text is plain data. Rich native content uses adapter-owned slots keyed by item ID. */
export interface StructuredListItem {
    id: string;
    title: string;
    href?: string;
    metadata: readonly {
        label: string;
        value: string | null;
    }[];
    image?: LogoData;
    tags?: readonly string[];
}

export interface LogoData {
    src: string;
    alt: string;
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `items` | yes | `readonly StructuredListItem[]` | data / state |
| `variant` | no | `'list' \| 'table'` | data / state |
| `toolbar` | no | `readonly {id: string; label: string; disabled?: boolean}[]` | data / state |
| `selection` | no | `{ids: readonly string[]; onChange: (detail: {ids: readonly string[]}) => void}` | data / state |
| `sort` | no | `{key: string; direction: 'ascending' \| 'descending'; onChange: (detail: {key: string; direction: 'ascending' \| 'descending'}) => void}` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Optional section title, consistent search/filter/sort/action toolbar, list/table of items, optional Pagination. Each item preserves metadata classification/order, preview, content/CTA and trailing share/save actions; source requires share/save after content in markup. Missing category value shows dash.

### Plain semantic API

Independent API: items {id,title,href?,metadata:{label,value}[],image?,tags?}[], variant=list|table, toolbar semantic controls, selection {ids,onChange} optional, sort {key,direction,onChange} optional. Provide explicit item link/action contracts; whole card is not a nested button containing buttons.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Every action works through keyboard/touch, visible focus, and native links/buttons. Sort/query activation retains focus on activating UI; selection uses labeled checkboxes. New window/application actions explain result. Only provide behavior configured by host.

### Responsive/mobile requirements

Keep metadata order when stacking; toolbar order remains consistent. Table variant preserves table semantics and header relationships under overflow/reflow.

### Forms, reset and composition

Child query/selection fields retain native form/reset/IME contracts; no invented aggregate serialized “list” field.

### Asset, integration and composition completion

Completion requires functioning toolbar, selection, CTA, share/save, Badge/Tag, optional Pagination in local-data composition; a div with children is insufficient. Host owns filtering algorithm/data, share target and save persistence; stories use pure local state.

### Stable parts and states

root, header, toolbar, list, item, preview, content, metadata, cta, badges, tags, actions, pagination; selected,pending,empty.

All rendered owned parts use `data-krds-component="structured-list"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `list`, `table`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-structured-list--list`, `krds-structured-list--table`, `krds-structured-list--local-filter-sort`, `krds-structured-list--selection-actions`, `krds-structured-list--missing-metadata`, `krds-structured-list--empty`, `krds-structured-list--narrow`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [List](/native/storybook-react/?path=/story/krds-structured-list--list) · [Table](/native/storybook-react/?path=/story/krds-structured-list--table) · [Local Filter Sort](/native/storybook-react/?path=/story/krds-structured-list--local-filter-sort) · [Selection Actions](/native/storybook-react/?path=/story/krds-structured-list--selection-actions) · [Missing Metadata](/native/storybook-react/?path=/story/krds-structured-list--missing-metadata) · [Empty](/native/storybook-react/?path=/story/krds-structured-list--empty) · [Narrow](/native/storybook-react/?path=/story/krds-structured-list--narrow).
- solid: [list](/native/storybook-solid/?path=/story/krds-structured-list--list) · [table](/native/storybook-solid/?path=/story/krds-structured-list--table) · [local-filter-sort](/native/storybook-solid/?path=/story/krds-structured-list--local-filter-sort) · [selection-actions](/native/storybook-solid/?path=/story/krds-structured-list--selection-actions) · [missing-metadata](/native/storybook-solid/?path=/story/krds-structured-list--missing-metadata) · [empty](/native/storybook-solid/?path=/story/krds-structured-list--empty) · [narrow](/native/storybook-solid/?path=/story/krds-structured-list--narrow).
- svelte: [list](/native/storybook-svelte/?path=/story/krds-structured-list--list) · [table](/native/storybook-svelte/?path=/story/krds-structured-list--table) · [local-filter-sort](/native/storybook-svelte/?path=/story/krds-structured-list--local-filter-sort) · [selection-actions](/native/storybook-svelte/?path=/story/krds-structured-list--selection-actions) · [missing-metadata](/native/storybook-svelte/?path=/story/krds-structured-list--missing-metadata) · [empty](/native/storybook-svelte/?path=/story/krds-structured-list--empty) · [narrow](/native/storybook-svelte/?path=/story/krds-structured-list--narrow).
- vue: [list](/native/storybook-vue/?path=/story/krds-structured-list--list) · [table](/native/storybook-vue/?path=/story/krds-structured-list--table) · [local-filter-sort](/native/storybook-vue/?path=/story/krds-structured-list--local-filter-sort) · [selection-actions](/native/storybook-vue/?path=/story/krds-structured-list--selection-actions) · [missing-metadata](/native/storybook-vue/?path=/story/krds-structured-list--missing-metadata) · [empty](/native/storybook-vue/?path=/story/krds-structured-list--empty) · [narrow](/native/storybook-vue/?path=/story/krds-structured-list--narrow).
- lit: [List](/native/storybook-lit/?path=/story/krds-structured-list--list) · [Table](/native/storybook-lit/?path=/story/krds-structured-list--table) · [Local Filter Sort](/native/storybook-lit/?path=/story/krds-structured-list--local-filter-sort) · [Selection Actions](/native/storybook-lit/?path=/story/krds-structured-list--selection-actions) · [Missing Metadata](/native/storybook-lit/?path=/story/krds-structured-list--missing-metadata) · [Empty](/native/storybook-lit/?path=/story/krds-structured-list--empty) · [Narrow](/native/storybook-lit/?path=/story/krds-structured-list--narrow).
- qwik: [list](/native/storybook-qwik/?path=/story/krds-structured-list--list) · [table](/native/storybook-qwik/?path=/story/krds-structured-list--table) · [local-filter-sort](/native/storybook-qwik/?path=/story/krds-structured-list--local-filter-sort) · [selection-actions](/native/storybook-qwik/?path=/story/krds-structured-list--selection-actions) · [missing-metadata](/native/storybook-qwik/?path=/story/krds-structured-list--missing-metadata) · [empty](/native/storybook-qwik/?path=/story/krds-structured-list--empty) · [narrow](/native/storybook-qwik/?path=/story/krds-structured-list--narrow).
- angular: [list](/native/storybook-angular/?path=/story/krds-structured-list--list) · [table](/native/storybook-angular/?path=/story/krds-structured-list--table) · [local-filter-sort](/native/storybook-angular/?path=/story/krds-structured-list--local-filter-sort) · [selection-actions](/native/storybook-angular/?path=/story/krds-structured-list--selection-actions) · [missing-metadata](/native/storybook-angular/?path=/story/krds-structured-list--missing-metadata) · [empty](/native/storybook-angular/?path=/story/krds-structured-list--empty) · [narrow](/native/storybook-angular/?path=/story/krds-structured-list--narrow).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [read the checked consumer](/examples/svelte-14); [download exact source](/sources/apps/fixture-svelte/src/public-examples/StructuredListExample.svelte.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:03.275Z`. SHA-256: `89be72c79361c1b25695e66a8430156a54365035ce769d4d7c67476a1204cca5`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_04_01.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
