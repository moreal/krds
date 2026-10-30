---
title: 'In-page navigation · 콘텐츠 내 탐색'
---

# In-page navigation

콘텐츠 내 탐색 · `InPageNavigation` · composition

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_03_05.html) · [Full reviewed specification](/sources/specs/components/in-page-navigation.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/in-page-navigation/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.0.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/in-page-navigation/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/InPageNavigation.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/in-page-navigation/InPageNavigation.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/in-page-navigation/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/in-page-navigation/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-in-page-navigation.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface InPageNavigationContract {
    sections: readonly InPageSection[];
    title?: string;
    activeId?: string;
    onActiveChange?: (detail: {
        id: string;
        reason: 'scroll' | 'activation';
    }) => void;
    narrowMode?: 'inline' | 'disclosure';
}

export interface InPageSection {
    id: string;
    label: string;
    children?: readonly InPageSection[];
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `sections` | yes | `readonly InPageSection[]` | data / state |
| `title` | no | `string` | data / state |
| `activeId` | no | `string` | data / state |
| `onActiveChange` | no | `(detail: {id: string; reason: 'scroll' \| 'activation'}) => void` | semantic event request |
| `narrowMode` | no | `'inline' \| 'disclosure'` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Outline title (not h1), nested list of same-document section links, and active-section cue. Mark up between page title and body even if desktop CSS places it at the right. Link labels match target headings; use at most three levels and normally one.

### Plain semantic API

Independent API: sections {id,label,children?}[], title="이 페이지의 구성", activeId/onActiveChange({id,reason}), optional collapsible narrow mode. Real anchors target registered sections; active state follows scroll observation independently of link activation.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Tab/Shift+Tab traverse links. Enter and official Space action scroll and focus target heading/section; mouse click scrolls while focus remains on link. Prevent Space page-scroll only on outline link activation, ignore composition. No focus move from passive scroll-observer updates.

### Responsive/mobile requirements

Desktop positions to right; narrow outline is nonsticky between title/body, optionally Disclosure if long. Account for sticky-header offset and reduced motion; no infinite-scroll outline.

### Forms, reset and composition

No form value/reset. IME-sensitive key filtering only if keyboard handling receives composing events.

### Asset, integration and composition completion

Host supplies matching stable section headings/targets and can remove sections; clean observers on unmount/route change and update active state without stale target focus. Completion requires long page with real destinations.

### Stable parts and states

root, header, title, list, item, link, indicator, disclosure-trigger; active,expanded/collapsed.

All rendered owned parts use `data-krds-component="in-page-navigation"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `desktop-side`, `mobile-inline`, `mobile-disclosure`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-in-page-navigation--desktop-side`, `krds-in-page-navigation--mobile-inline`, `krds-in-page-navigation--mobile-disclosure`, `krds-in-page-navigation--three-level-outline`, `krds-in-page-navigation--sticky-offset`, `krds-in-page-navigation--removed-section`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Desktop Side](/native/storybook-react/?path=/story/krds-in-page-navigation--desktop-side) · [Mobile Inline](/native/storybook-react/?path=/story/krds-in-page-navigation--mobile-inline) · [Mobile Disclosure](/native/storybook-react/?path=/story/krds-in-page-navigation--mobile-disclosure) · [Three Level Outline](/native/storybook-react/?path=/story/krds-in-page-navigation--three-level-outline) · [Sticky Offset](/native/storybook-react/?path=/story/krds-in-page-navigation--sticky-offset) · [Removed Section](/native/storybook-react/?path=/story/krds-in-page-navigation--removed-section).
- solid: [desktop-side](/native/storybook-solid/?path=/story/krds-in-page-navigation--desktop-side) · [mobile-inline](/native/storybook-solid/?path=/story/krds-in-page-navigation--mobile-inline) · [mobile-disclosure](/native/storybook-solid/?path=/story/krds-in-page-navigation--mobile-disclosure) · [three-level-outline](/native/storybook-solid/?path=/story/krds-in-page-navigation--three-level-outline) · [sticky-offset](/native/storybook-solid/?path=/story/krds-in-page-navigation--sticky-offset) · [removed-section](/native/storybook-solid/?path=/story/krds-in-page-navigation--removed-section).
- svelte: [desktop-side](/native/storybook-svelte/?path=/story/krds-in-page-navigation--desktop-side) · [mobile-inline](/native/storybook-svelte/?path=/story/krds-in-page-navigation--mobile-inline) · [mobile-disclosure](/native/storybook-svelte/?path=/story/krds-in-page-navigation--mobile-disclosure) · [three-level-outline](/native/storybook-svelte/?path=/story/krds-in-page-navigation--three-level-outline) · [sticky-offset](/native/storybook-svelte/?path=/story/krds-in-page-navigation--sticky-offset) · [removed-section](/native/storybook-svelte/?path=/story/krds-in-page-navigation--removed-section).
- vue: [desktop-side](/native/storybook-vue/?path=/story/krds-in-page-navigation--desktop-side) · [mobile-inline](/native/storybook-vue/?path=/story/krds-in-page-navigation--mobile-inline) · [mobile-disclosure](/native/storybook-vue/?path=/story/krds-in-page-navigation--mobile-disclosure) · [three-level-outline](/native/storybook-vue/?path=/story/krds-in-page-navigation--three-level-outline) · [sticky-offset](/native/storybook-vue/?path=/story/krds-in-page-navigation--sticky-offset) · [removed-section](/native/storybook-vue/?path=/story/krds-in-page-navigation--removed-section).
- lit: [Desktop Side](/native/storybook-lit/?path=/story/krds-in-page-navigation--desktop-side) · [Mobile Inline](/native/storybook-lit/?path=/story/krds-in-page-navigation--mobile-inline) · [Mobile Disclosure](/native/storybook-lit/?path=/story/krds-in-page-navigation--mobile-disclosure) · [Three Level Outline](/native/storybook-lit/?path=/story/krds-in-page-navigation--three-level-outline) · [Sticky Offset](/native/storybook-lit/?path=/story/krds-in-page-navigation--sticky-offset) · [Removed Section](/native/storybook-lit/?path=/story/krds-in-page-navigation--removed-section).
- qwik: [desktop-side](/native/storybook-qwik/?path=/story/krds-in-page-navigation--desktop-side) · [mobile-inline](/native/storybook-qwik/?path=/story/krds-in-page-navigation--mobile-inline) · [mobile-disclosure](/native/storybook-qwik/?path=/story/krds-in-page-navigation--mobile-disclosure) · [three-level-outline](/native/storybook-qwik/?path=/story/krds-in-page-navigation--three-level-outline) · [sticky-offset](/native/storybook-qwik/?path=/story/krds-in-page-navigation--sticky-offset) · [removed-section](/native/storybook-qwik/?path=/story/krds-in-page-navigation--removed-section).
- angular: [desktop-side](/native/storybook-angular/?path=/story/krds-in-page-navigation--desktop-side) · [mobile-inline](/native/storybook-angular/?path=/story/krds-in-page-navigation--mobile-inline) · [mobile-disclosure](/native/storybook-angular/?path=/story/krds-in-page-navigation--mobile-disclosure) · [three-level-outline](/native/storybook-angular/?path=/story/krds-in-page-navigation--three-level-outline) · [sticky-offset](/native/storybook-angular/?path=/story/krds-in-page-navigation--sticky-offset) · [removed-section](/native/storybook-angular/?path=/story/krds-in-page-navigation--removed-section).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-12); [download exact source](/sources/apps/fixture-svelte/src/public-examples/InPageNavigationExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:03.138Z`. SHA-256: `7de4b0ef8b8d310581242e20cf5714c2de62dd2410bf46d1e6984fd90d7124fc`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_03_05.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
