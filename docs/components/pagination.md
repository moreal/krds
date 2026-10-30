---
title: 'Pagination · 페이지네이션'
---

# Pagination

페이지네이션 · `Pagination` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_03_06.html) · [Full reviewed specification](/sources/specs/components/pagination.md.txt) · [Framework support](../compatibility/README.md)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/pagination/index.d.ts.txt) | [react sources and preview policy](../compatibility/README.mdexamples#react) |
| solid | `0.0.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/pagination/index.d.ts.txt) | [solid sources and preview policy](../compatibility/README.mdexamples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/Pagination.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/README.mdexamples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/pagination/Pagination.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/README.mdexamples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/pagination/index.d.ts.txt) | [lit sources and preview policy](../compatibility/README.mdexamples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/pagination/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/README.mdexamples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-pagination.d.ts.txt) | [angular sources and preview policy](../compatibility/README.mdexamples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/README.mdexamples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface PaginationContract {
    page?: number;
    defaultPage?: number;
    pageCount: number;
    hrefForPage: (page: number) => string;
    onPageChange?: (detail: {
        page: number;
    }) => void;
    variant?: 'number-links' | 'direct-page' | 'load-more';
    loadMore?: {
        shown: number;
        total: number;
        pending: boolean;
        firstNewItemId?: string;
        onLoadMore: () => void;
    };
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `page` | no | `number` | data / state |
| `defaultPage` | no | `number` | data / state |
| `pageCount` | yes | `number` | data / state |
| `hrefForPage` | yes | `(page: number) => string` | data / state |
| `onPageChange` | no | `(detail: {page: number}) => void` | semantic event request |
| `variant` | no | `'number-links' \| 'direct-page' \| 'load-more'` | data / state |
| `loadMore` | no | `{shown: number; total: number; pending: boolean; firstNewItemId?: string; onLoadMore: () => void}` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Named &lt;nav> tied to dataset; source order previous, &lt;ul> number links, next, optional page input, total label, go button. First/last page always reachable except load-more. Current number removes href and carries aria-current=true. Ellipsis is noninteractive. Load-more sits after result list.

### Plain semantic API

Independent API: page/defaultPage=1, pageCount, hrefForPage(page), onPageChange({page}), variant=number-links, optional direct-page input, or load-more {shown,total,pending,onLoadMore,firstNewItemId}. Never derive page size from viewport. Range-invalid page input remains an editable string and reports an error without navigation.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Native anchors preserve navigation; current/unavailable links do not activate. Go/load-more are buttons (Enter/Space). After host appends results, load-more scrolls/focuses first added item, updates shown count, and preserves context on failure. Controlled props alone emit nothing.

### Responsive/mobile requirements

At most 11 numbers/ellipses desktop, seven narrow. Narrow previous/next row precedes number row visually while official DOM order remains unchanged. Dataset page count and per-page count stay stable across viewports.

### Forms, reset and composition

Direct page input has visible label and error relationship; no implicit surrounding form submission. Reset restores draft page text to actual page; IME does not trigger Go. Pagination itself contributes no form value.

### Asset, integration and composition completion

Host owns data loading, URLs, totals and successful-append confirmation. Local story uses fixed in-memory records; no fetch. Source load-more descriptive paragraph repeats direct-page text; rely on load-more structure/interaction rather than invent matching behavior.

### Stable parts and states

root, list, item, link, previous, next, ellipsis, input, total, go, load-more, count; current,disabled,pending,invalid.

All rendered owned parts use `data-krds-component="pagination"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `number-links`, `direct-page`, `load-more`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-pagination--number-links`, `krds-pagination--direct-page`, `krds-pagination--load-more`, `krds-pagination--first-last-boundary`, `krds-pagination--narrow-seven-items`, `krds-pagination--load-failure`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Number Links](/native/storybook-react/?path=/story/krds-pagination--number-links) · [Direct Page](/native/storybook-react/?path=/story/krds-pagination--direct-page) · [Load More](/native/storybook-react/?path=/story/krds-pagination--load-more) · [First Last Boundary](/native/storybook-react/?path=/story/krds-pagination--first-last-boundary) · [Narrow Seven Items](/native/storybook-react/?path=/story/krds-pagination--narrow-seven-items) · [Load Failure](/native/storybook-react/?path=/story/krds-pagination--load-failure).
- solid: [number-links](/native/storybook-solid/?path=/story/krds-pagination--number-links) · [direct-page](/native/storybook-solid/?path=/story/krds-pagination--direct-page) · [load-more](/native/storybook-solid/?path=/story/krds-pagination--load-more) · [first-last-boundary](/native/storybook-solid/?path=/story/krds-pagination--first-last-boundary) · [narrow-seven-items](/native/storybook-solid/?path=/story/krds-pagination--narrow-seven-items) · [load-failure](/native/storybook-solid/?path=/story/krds-pagination--load-failure).
- svelte: [number-links](/native/storybook-svelte/?path=/story/krds-pagination--number-links) · [direct-page](/native/storybook-svelte/?path=/story/krds-pagination--direct-page) · [load-more](/native/storybook-svelte/?path=/story/krds-pagination--load-more) · [first-last-boundary](/native/storybook-svelte/?path=/story/krds-pagination--first-last-boundary) · [narrow-seven-items](/native/storybook-svelte/?path=/story/krds-pagination--narrow-seven-items) · [load-failure](/native/storybook-svelte/?path=/story/krds-pagination--load-failure).
- vue: [number-links](/native/storybook-vue/?path=/story/krds-pagination--number-links) · [direct-page](/native/storybook-vue/?path=/story/krds-pagination--direct-page) · [load-more](/native/storybook-vue/?path=/story/krds-pagination--load-more) · [first-last-boundary](/native/storybook-vue/?path=/story/krds-pagination--first-last-boundary) · [narrow-seven-items](/native/storybook-vue/?path=/story/krds-pagination--narrow-seven-items) · [load-failure](/native/storybook-vue/?path=/story/krds-pagination--load-failure).
- lit: [Number Links](/native/storybook-lit/?path=/story/krds-pagination--number-links) · [Direct Page](/native/storybook-lit/?path=/story/krds-pagination--direct-page) · [Load More](/native/storybook-lit/?path=/story/krds-pagination--load-more) · [First Last Boundary](/native/storybook-lit/?path=/story/krds-pagination--first-last-boundary) · [Narrow Seven Items](/native/storybook-lit/?path=/story/krds-pagination--narrow-seven-items) · [Load Failure](/native/storybook-lit/?path=/story/krds-pagination--load-failure).
- qwik: [number-links](/native/storybook-qwik/?path=/story/krds-pagination--number-links) · [direct-page](/native/storybook-qwik/?path=/story/krds-pagination--direct-page) · [load-more](/native/storybook-qwik/?path=/story/krds-pagination--load-more) · [first-last-boundary](/native/storybook-qwik/?path=/story/krds-pagination--first-last-boundary) · [narrow-seven-items](/native/storybook-qwik/?path=/story/krds-pagination--narrow-seven-items) · [load-failure](/native/storybook-qwik/?path=/story/krds-pagination--load-failure).
- angular: [number-links](/native/storybook-angular/?path=/story/krds-pagination--number-links) · [direct-page](/native/storybook-angular/?path=/story/krds-pagination--direct-page) · [load-more](/native/storybook-angular/?path=/story/krds-pagination--load-more) · [first-last-boundary](/native/storybook-angular/?path=/story/krds-pagination--first-last-boundary) · [narrow-seven-items](/native/storybook-angular/?path=/story/krds-pagination--narrow-seven-items) · [load-failure](/native/storybook-angular/?path=/story/krds-pagination--load-failure).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-13); [download exact source](/sources/apps/fixture-svelte/src/public-examples/PaginationExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:03.210Z`. SHA-256: `7c61e379ce568edd893e86d5b02bc85a3aab50f4e5103c5acbae5df606006c2d`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_03_06.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/index.md) before redistributing.
