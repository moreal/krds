---
title: 'Masthead · 공식 배너'
---

# Masthead

공식 배너 · `Masthead` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_02_01.html) · [Full reviewed specification](/sources/specs/components/masthead.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/masthead/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.0.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/masthead/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/Masthead.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/masthead/Masthead.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/masthead/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/masthead/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-masthead.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface MastheadContract {
    governmentService: boolean;
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `governmentService` | yes | `boolean` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

A noninteractive banner container with the fixed official sentence: “이 누리집은 대한민국 공식 전자정부 누리집입니다.” Keep it at the top of each government service page, after SkipLink and before Header. Preserve the official wording and appearance; do not invent a disclosure from the example’s toggle-wrap class.

### Plain semantic API

Independent API: Masthead has no action or selection API. Provide an explicit governmentService authorization flag at composition level; plain content is fixed Korean text, with any translated wording held for evidence review. No href, dismiss, open, or onClick semantics.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

No tab stop, key handler, focus move or live announcement. SkipLink must remain the first reachable content before this repeated region.

### Responsive/mobile requirements

Allow the official sentence to remain readable at narrow widths and zoom; avoid attention-grabbing animation. Page composition maintains identical relative order.

### Forms, reset and composition

No form value/reset/IME behavior.

### Asset, integration and composition completion

Only actual official government services may display the banner as a service claim. The independent library/demo must label any local specimen as an example, without presenting the repository as a government site. Hosting and eligibility are host responsibilities.

### Stable parts and states

root, text; no interactive state.

All rendered owned parts use `data-krds-component="masthead"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `default`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-masthead--default-specimen`, `krds-masthead--narrow-zoom`, `krds-masthead--page-order`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Default Specimen](/native/storybook-react/?path=/story/krds-masthead--default-specimen) · [Narrow Zoom](/native/storybook-react/?path=/story/krds-masthead--narrow-zoom) · [Page Order](/native/storybook-react/?path=/story/krds-masthead--page-order).
- solid: [default-specimen](/native/storybook-solid/?path=/story/krds-masthead--default-specimen) · [narrow-zoom](/native/storybook-solid/?path=/story/krds-masthead--narrow-zoom) · [page-order](/native/storybook-solid/?path=/story/krds-masthead--page-order).
- svelte: [default-specimen](/native/storybook-svelte/?path=/story/krds-masthead--default-specimen) · [narrow-zoom](/native/storybook-svelte/?path=/story/krds-masthead--narrow-zoom) · [page-order](/native/storybook-svelte/?path=/story/krds-masthead--page-order).
- vue: [default-specimen](/native/storybook-vue/?path=/story/krds-masthead--default-specimen) · [narrow-zoom](/native/storybook-vue/?path=/story/krds-masthead--narrow-zoom) · [page-order](/native/storybook-vue/?path=/story/krds-masthead--page-order).
- lit: [Default Specimen](/native/storybook-lit/?path=/story/krds-masthead--default-specimen) · [Narrow Zoom](/native/storybook-lit/?path=/story/krds-masthead--narrow-zoom) · [Page Order](/native/storybook-lit/?path=/story/krds-masthead--page-order).
- qwik: [default-specimen](/native/storybook-qwik/?path=/story/krds-masthead--default-specimen) · [narrow-zoom](/native/storybook-qwik/?path=/story/krds-masthead--narrow-zoom) · [page-order](/native/storybook-qwik/?path=/story/krds-masthead--page-order).
- angular: [default-specimen](/native/storybook-angular/?path=/story/krds-masthead--default-specimen) · [narrow-zoom](/native/storybook-angular/?path=/story/krds-masthead--narrow-zoom) · [page-order](/native/storybook-angular/?path=/story/krds-masthead--page-order).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-4); [download exact source](/sources/apps/fixture-svelte/src/public-examples/MastheadExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:02.535Z`. SHA-256: `851bee30ce1846611f28161d508d7c72cdbebcb0bda29b594c768375167ff466`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_02_01.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
