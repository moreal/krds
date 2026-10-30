---
title: 'Text list · 텍스트 목록'
---

# Text list

텍스트 목록 · `TextList` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_04_13.html) · [Full reviewed specification](/sources/specs/components/text-list.md.txt) · [Framework support](../compatibility/README.md)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/text-list/index.d.ts.txt) | [react sources and preview policy](../compatibility/README.mdexamples#react) |
| solid | `0.0.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/text-list/index.d.ts.txt) | [solid sources and preview policy](../compatibility/README.mdexamples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/TextList.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/README.mdexamples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/text-list/TextList.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/README.mdexamples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/text-list/index.d.ts.txt) | [lit sources and preview policy](../compatibility/README.mdexamples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/text-list/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/README.mdexamples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-text-list.d.ts.txt) | [angular sources and preview policy](../compatibility/README.mdexamples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/README.mdexamples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface TextListContract {
    ordered?: boolean;
    marker?: 'dot' | 'dash' | 'hollow';
    items: readonly TextListItem[];
}

export interface TextListItem {
    id: string;
    content: string;
    children?: readonly TextListItem[];
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `ordered` | no | `boolean` | data / state |
| `marker` | no | `'dot' \| 'dash' \| 'hollow'` | data / state |
| `items` | yes | `readonly TextListItem[]` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Native ul/li for equal-importance unordered content, ol/li for sequence/rank; nested lists belong inside their parent li. At most three levels, consistent indentation, voice and punctuation. If list-style:none, explicit role=list/listitem retains mobile list discovery.

### Plain semantic API

Independent API: ordered=false, marker=dot|dash|hollow (dot), items {id,content,children?}[]; ordered variant uses true numeric ordering. Content may contain native links; no selection/current value or invented listbox role.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Static text adds no tab stops or arrow navigation; contained native interactive content follows normal reading order.

### Responsive/mobile requirements

Wrap text under same-level text with hanging indentation. Preserve hierarchy at zoom/narrow width; do not flatten lists into line breaks.

### Forms, reset and composition

No form/reset/IME behavior.

### Asset, integration and composition completion

Retain public export TextList but recommend provisional kind change composition→component: source defines semantic list primitive, without multi-component task workflow. Host owns editorial ordering and punctuation; renderer owns valid nesting.

### Stable parts and states

root, item, marker, content, nested-list; ordered/unordered,level.

All rendered owned parts use `data-krds-component="text-list"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `unordered-dot`, `unordered-dash`, `unordered-hollow`, `ordered`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-text-list--unordered-dot`, `krds-text-list--unordered-dash`, `krds-text-list--unordered-hollow`, `krds-text-list--ordered`, `krds-text-list--three-level`, `krds-text-list--narrow`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Unordered Dot](/native/storybook-react/?path=/story/krds-text-list--unordered-dot) · [Unordered Dash](/native/storybook-react/?path=/story/krds-text-list--unordered-dash) · [Unordered Hollow](/native/storybook-react/?path=/story/krds-text-list--unordered-hollow) · [Ordered](/native/storybook-react/?path=/story/krds-text-list--ordered) · [Three Level](/native/storybook-react/?path=/story/krds-text-list--three-level) · [Narrow](/native/storybook-react/?path=/story/krds-text-list--narrow).
- solid: [unordered-dot](/native/storybook-solid/?path=/story/krds-text-list--unordered-dot) · [unordered-dash](/native/storybook-solid/?path=/story/krds-text-list--unordered-dash) · [unordered-hollow](/native/storybook-solid/?path=/story/krds-text-list--unordered-hollow) · [ordered](/native/storybook-solid/?path=/story/krds-text-list--ordered) · [three-level](/native/storybook-solid/?path=/story/krds-text-list--three-level) · [narrow](/native/storybook-solid/?path=/story/krds-text-list--narrow).
- svelte: [unordered-dot](/native/storybook-svelte/?path=/story/krds-text-list--unordered-dot) · [unordered-dash](/native/storybook-svelte/?path=/story/krds-text-list--unordered-dash) · [unordered-hollow](/native/storybook-svelte/?path=/story/krds-text-list--unordered-hollow) · [ordered](/native/storybook-svelte/?path=/story/krds-text-list--ordered) · [three-level](/native/storybook-svelte/?path=/story/krds-text-list--three-level) · [narrow](/native/storybook-svelte/?path=/story/krds-text-list--narrow).
- vue: [unordered-dot](/native/storybook-vue/?path=/story/krds-text-list--unordered-dot) · [unordered-dash](/native/storybook-vue/?path=/story/krds-text-list--unordered-dash) · [unordered-hollow](/native/storybook-vue/?path=/story/krds-text-list--unordered-hollow) · [ordered](/native/storybook-vue/?path=/story/krds-text-list--ordered) · [three-level](/native/storybook-vue/?path=/story/krds-text-list--three-level) · [narrow](/native/storybook-vue/?path=/story/krds-text-list--narrow).
- lit: [Unordered Dot](/native/storybook-lit/?path=/story/krds-text-list--unordered-dot) · [Unordered Dash](/native/storybook-lit/?path=/story/krds-text-list--unordered-dash) · [Unordered Hollow](/native/storybook-lit/?path=/story/krds-text-list--unordered-hollow) · [Ordered](/native/storybook-lit/?path=/story/krds-text-list--ordered) · [Three Level](/native/storybook-lit/?path=/story/krds-text-list--three-level) · [Narrow](/native/storybook-lit/?path=/story/krds-text-list--narrow).
- qwik: [unordered-dot](/native/storybook-qwik/?path=/story/krds-text-list--unordered-dot) · [unordered-dash](/native/storybook-qwik/?path=/story/krds-text-list--unordered-dash) · [unordered-hollow](/native/storybook-qwik/?path=/story/krds-text-list--unordered-hollow) · [ordered](/native/storybook-qwik/?path=/story/krds-text-list--ordered) · [three-level](/native/storybook-qwik/?path=/story/krds-text-list--three-level) · [narrow](/native/storybook-qwik/?path=/story/krds-text-list--narrow).
- angular: [unordered-dot](/native/storybook-angular/?path=/story/krds-text-list--unordered-dot) · [unordered-dash](/native/storybook-angular/?path=/story/krds-text-list--unordered-dash) · [unordered-hollow](/native/storybook-angular/?path=/story/krds-text-list--unordered-hollow) · [ordered](/native/storybook-angular/?path=/story/krds-text-list--ordered) · [three-level](/native/storybook-angular/?path=/story/krds-text-list--three-level) · [narrow](/native/storybook-angular/?path=/story/krds-text-list--narrow).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-25); [download exact source](/sources/apps/fixture-svelte/src/public-examples/TextListExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:04.043Z`. SHA-256: `3c795ef7618610dfeb0a91598af3f3f20078cf90f292b4fad27c423c8cab44a9`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_04_13.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/index.md) before redistributing.
