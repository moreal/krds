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
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/table/index.d.ts.txt) | [react sources and preview policy](../compatibility/README.mdexamples#react) |
| solid | `0.0.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/table/index.d.ts.txt) | [solid sources and preview policy](../compatibility/README.mdexamples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/Table.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/README.mdexamples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/table/Table.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/README.mdexamples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/table/index.d.ts.txt) | [lit sources and preview policy](../compatibility/README.mdexamples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/table/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/README.mdexamples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-table.d.ts.txt) | [angular sources and preview policy](../compatibility/README.mdexamples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/README.mdexamples#solid-next) |

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

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Basic](/native/storybook-react/?path=/story/krds-table--basic) · [Row Headers](/native/storybook-react/?path=/story/krds-table--row-headers) · [Missing Cells](/native/storybook-react/?path=/story/krds-table--missing-cells) · [Sortable](/native/storybook-react/?path=/story/krds-table--sortable) · [Narrow Scroll](/native/storybook-react/?path=/story/krds-table--narrow-scroll) · [Narrow Stacked](/native/storybook-react/?path=/story/krds-table--narrow-stacked).
- solid: [basic](/native/storybook-solid/?path=/story/krds-table--basic) · [row-headers](/native/storybook-solid/?path=/story/krds-table--row-headers) · [missing-cells](/native/storybook-solid/?path=/story/krds-table--missing-cells) · [sortable](/native/storybook-solid/?path=/story/krds-table--sortable) · [narrow-scroll](/native/storybook-solid/?path=/story/krds-table--narrow-scroll) · [narrow-stacked](/native/storybook-solid/?path=/story/krds-table--narrow-stacked).
- svelte: [basic](/native/storybook-svelte/?path=/story/krds-table--basic) · [row-headers](/native/storybook-svelte/?path=/story/krds-table--row-headers) · [missing-cells](/native/storybook-svelte/?path=/story/krds-table--missing-cells) · [sortable](/native/storybook-svelte/?path=/story/krds-table--sortable) · [narrow-scroll](/native/storybook-svelte/?path=/story/krds-table--narrow-scroll) · [narrow-stacked](/native/storybook-svelte/?path=/story/krds-table--narrow-stacked).
- vue: [basic](/native/storybook-vue/?path=/story/krds-table--basic) · [row-headers](/native/storybook-vue/?path=/story/krds-table--row-headers) · [missing-cells](/native/storybook-vue/?path=/story/krds-table--missing-cells) · [sortable](/native/storybook-vue/?path=/story/krds-table--sortable) · [narrow-scroll](/native/storybook-vue/?path=/story/krds-table--narrow-scroll) · [narrow-stacked](/native/storybook-vue/?path=/story/krds-table--narrow-stacked).
- lit: [Basic](/native/storybook-lit/?path=/story/krds-table--basic) · [Row Headers](/native/storybook-lit/?path=/story/krds-table--row-headers) · [Missing Cells](/native/storybook-lit/?path=/story/krds-table--missing-cells) · [Sortable](/native/storybook-lit/?path=/story/krds-table--sortable) · [Narrow Scroll](/native/storybook-lit/?path=/story/krds-table--narrow-scroll) · [Narrow Stacked](/native/storybook-lit/?path=/story/krds-table--narrow-stacked).
- qwik: [basic](/native/storybook-qwik/?path=/story/krds-table--basic) · [row-headers](/native/storybook-qwik/?path=/story/krds-table--row-headers) · [missing-cells](/native/storybook-qwik/?path=/story/krds-table--missing-cells) · [sortable](/native/storybook-qwik/?path=/story/krds-table--sortable) · [narrow-scroll](/native/storybook-qwik/?path=/story/krds-table--narrow-scroll) · [narrow-stacked](/native/storybook-qwik/?path=/story/krds-table--narrow-stacked).
- angular: [basic](/native/storybook-angular/?path=/story/krds-table--basic) · [row-headers](/native/storybook-angular/?path=/story/krds-table--row-headers) · [missing-cells](/native/storybook-angular/?path=/story/krds-table--missing-cells) · [sortable](/native/storybook-angular/?path=/story/krds-table--sortable) · [narrow-scroll](/native/storybook-angular/?path=/story/krds-table--narrow-scroll) · [narrow-stacked](/native/storybook-angular/?path=/story/krds-table--narrow-stacked).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-24); [download exact source](/sources/apps/fixture-svelte/src/public-examples/TableExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:03.975Z`. SHA-256: `62101d3ac5f3758b0a31b07862f3e0575cb185fb871357f46dd0e43877d314d0`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_04_11.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/index.md) before redistributing.
