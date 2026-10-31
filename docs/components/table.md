---
title: 'Table · 표'
---

# Table

표 · `Table` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_04_11.html) · [Full reviewed specification](/sources/specs/components/table.md.txt) · [Framework support](../compatibility/README.md)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [current subpath manifest](/sources/packages/react/package.json.txt); [historical declaration checkpoint](/sources/packages/react/dist/components/table/index.d.ts.txt) | [react sources and preview policy](../compatibility/README.mdexamples#react) |
| solid | `0.1.0` | planned | [current subpath manifest](/sources/packages/solid/package.json.txt); [historical declaration checkpoint](/sources/packages/solid/dist/components/table/index.d.ts.txt) | [solid sources and preview policy](../compatibility/README.mdexamples#solid) |
| svelte | `0.1.0` | planned | [current subpath manifest](/sources/packages/svelte/package.json.txt); [historical declaration checkpoint](/sources/packages/svelte/dist/components/Table.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/README.mdexamples#svelte) |
| vue | `0.1.0` | planned | [current subpath manifest](/sources/packages/vue/package.json.txt); [historical declaration checkpoint](/sources/packages/vue/dist/components/table/Table.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/README.mdexamples#vue) |
| lit | `0.1.0` | planned | [current subpath manifest](/sources/packages/lit/package.json.txt); [historical declaration checkpoint](/sources/packages/lit/dist/components/table/index.d.ts.txt) | [lit sources and preview policy](../compatibility/README.mdexamples#lit) |
| qwik | `0.1.0` | planned | [current subpath manifest](/sources/packages/qwik/package.json.txt); [historical declaration checkpoint](/sources/packages/qwik/dist/components/table/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/README.mdexamples#qwik) |
| angular | `0.1.0` | planned | [current subpath manifest](/sources/packages/angular/package.json.txt); [historical declaration checkpoint](/sources/packages/angular/dist/types/unofficial-krds-angular-table.d.ts.txt) | [angular sources and preview policy](../compatibility/README.mdexamples#angular) |
| solid-next (preview) | `0.1.0-preview.0` | planned | [current root manifest](/sources/packages/solid-next/package.json.txt); [historical declaration checkpoint](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/README.mdexamples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface TableContract {
    rowHeaderColumnId?: string;
    caption: string;
    columns: readonly TableColumn[];
    rows: readonly {
        id: string;
        cells: Readonly<Record<string, string | number | null>>;
    }[];
    sort?: {
        columnId: string;
        direction: 'ascending' | 'descending';
    };
    onSortChange?: (detail: {
        columnId: string;
        direction: 'ascending' | 'descending';
    }) => void;
}

export interface TableColumn {
    id: string;
    label: string;
    kind: 'text' | 'number' | 'date';
    sortable?: boolean;
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `rowHeaderColumnId` | no | `string` | data / state |
| `caption` | yes | `string` | data / state |
| `columns` | yes | `readonly TableColumn[]` | data / state |
| `rows` | yes | `readonly {id: string; cells: Readonly<Record<string, string \| number \| null>>}[]` | data / state |
| `sort` | no | `{columnId: string; direction: 'ascending' \| 'descending'}` | data / state |
| `onSortChange` | no | `(detail: {columnId: string; direction: 'ascending' \| 'descending'}) => void` | semantic event request |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Real &lt;table> with caption, thead/tbody, th scope and appropriate row headers/tfoot; complex relationships use headers/id. Caption explains header content per development note. Empty data cells show dash. Quantitative numbers right-align; text/nominal numbers left-align.

### Plain semantic API

Independent API: caption, columns {id,label,kind,sortable?}[], rows {id,cells}[], rowHeaderColumnId? naming one existing column, sort {columnId,direction}/onSortChange optional. No sorting behavior if absent. When sortable, initial sort is first column as official guidance. Header button inside th; aria-sort tracks actual order. With rowHeaderColumnId, that column renders native th scope=row with a stable ID, and every data cell references its row/column headers as required. Unknown rowHeaderColumnId is a configuration error; no automatic row-header inference from cell text/kind.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Ordinary table is read-only and non-tabbable except contained links/buttons. Sort activation retains header-button focus. Overflow wrapper has name and focus only when needed; provide simple click/tap scroll controls, not drag-only traversal.

### Responsive/mobile requirements

Simple single-dimension tables may stack header/data pairs while preserving associations; complex tables use horizontal region scroll. Keep horizontal scrollbar discoverable and data unclipped. Avoid restrictive modal/accordion placements.

### Forms, reset and composition

No table form/reset state. Embedded controls retain own semantics; selection-heavy interaction belongs to StructuredList.

### Asset, integration and composition completion

Host owns data/format/sorting handler; local example actually reorders rows and preserves header association. Completion requires native semantics and conditional sorting, not a div grid.

### Stable parts and states

root, caption, head, body, row, header-cell, cell, sort-trigger, scroll-region, scroll-previous, scroll-next; ascending,descending,overflow.

All rendered owned parts use `data-krds-component="table"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `basic`, `sortable`, `narrow-scroll`, `narrow-stacked`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-table--basic`, `krds-table--row-headers`, `krds-table--missing-cells`, `krds-table--sortable`, `krds-table--narrow-scroll`, `krds-table--narrow-stacked`.

### Local native stories

Fixture and Storybook outputs are local-only and are not hosted on this public documentation site. Build the selected native workspace, then run `node tools/yarn.mjs exec node apps/docs/scripts/serve.mjs`. Open `/krds/native/storybook-<framework>/` on that local server. Solid 2 has no supported native Storybook integration. Qwik production SSR/resume requires its real server and cannot be replaced by a static preview. Story availability does not establish behavioral acceptance.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [read the checked consumer](/examples/svelte-24); [download exact source](/sources/apps/fixture-svelte/src/public-examples/TableExample.svelte.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:03.975Z`. SHA-256: `62101d3ac5f3758b0a31b07862f3e0575cb185fb871357f46dd0e43877d314d0`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_04_11.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/index.md) before redistributing.
