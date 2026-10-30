---
title: 'Tab bars · 탭바'
---

# Tab bars

탭바 · `TabBar` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_12_07.html) · [Full reviewed specification](/sources/specs/components/tab-bar.md.txt) · [Framework support](../compatibility/README.md)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/tab-bar/index.d.ts.txt) | [react sources and preview policy](../compatibility/README.mdexamples#react) |
| solid | `0.0.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/tab-bar/index.d.ts.txt) | [solid sources and preview policy](../compatibility/README.mdexamples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/TabBar.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/README.mdexamples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/tab-bar/TabBar.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/README.mdexamples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/tab-bar/index.d.ts.txt) | [lit sources and preview policy](../compatibility/README.mdexamples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/tab-bar/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/README.mdexamples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-tab-bar.d.ts.txt) | [angular sources and preview policy](../compatibility/README.mdexamples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/README.mdexamples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface TabBarContract {
    items: readonly {
        id: string;
        label: string;
        href: string;
        icon: string;
        currentIcon?: string;
        badge?: string | number;
    }[];
    currentId: string;
    menuAction?: {
        label: string;
        onRequest: () => void;
    };
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `items` | yes | `readonly {id: string; label: string; href: string; icon: string; currentIcon?: string; badge?: string \| number}[]` | data / state |
| `currentId` | yes | `string` | data / state |
| `menuAction` | no | `{label: string; onRequest: () => void}` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Web &lt;nav> landmark with &lt;=5 equal-size navigation items, each icon+short label. Current item aria-current=page and filled-vs-outline icon/indicator. Home if present first/leftmost, all-menu if present last/rightmost. Optional Badge conveys unread/new state.

### Plain semantic API

Independent API: items {id,label,href,icon,currentIcon?,badge?}[], currentId; optional terminal menuAction {label,onRequest}. Real anchors for page routes; named button only for opening all-menu. This is navigation, never role=tablist or Tabs shared-state panel API.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Native Tab/Shift+Tab and Enter links, native button Enter/Space for all-menu. No automatic arrow/tab-panel activation inferred. Current route comes from host; passive prop change emits no selection event.

### Responsive/mobile requirements

Bottom fixed and does not hide on scroll; host adds matching content bottom padding/safe-area inset. Omit on deeper views only by route design. Labels never ellipsize, including translations; use MainMenu when width sufficient.

### Forms, reset and composition

No form/reset/IME behavior; menu button type=button.

### Asset, integration and composition completion

Host owns route map/current page, all-menu layer and badge source. Completion includes real local page navigation and all-menu composition; badge is static metadata, no remote notification requirement.

### Stable parts and states

root, list, item, link, icon, label, indicator, badge, menu-trigger; current.

All rendered owned parts use `data-krds-component="tab-bar"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `three-items`, `five-items`, `with-badge`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-tab-bar--three-items`, `krds-tab-bar--five-items`, `krds-tab-bar--with-badge`, `krds-tab-bar--all-menu`, `krds-tab-bar--long-translated-label`, `krds-tab-bar--scroll-page`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Three Items](/native/storybook-react/?path=/story/krds-tab-bar--three-items) · [Five Items](/native/storybook-react/?path=/story/krds-tab-bar--five-items) · [With Badge](/native/storybook-react/?path=/story/krds-tab-bar--with-badge) · [All Menu](/native/storybook-react/?path=/story/krds-tab-bar--all-menu) · [Long Translated Label](/native/storybook-react/?path=/story/krds-tab-bar--long-translated-label) · [Scroll Page](/native/storybook-react/?path=/story/krds-tab-bar--scroll-page).
- solid: [three-items](/native/storybook-solid/?path=/story/krds-tab-bar--three-items) · [five-items](/native/storybook-solid/?path=/story/krds-tab-bar--five-items) · [with-badge](/native/storybook-solid/?path=/story/krds-tab-bar--with-badge) · [all-menu](/native/storybook-solid/?path=/story/krds-tab-bar--all-menu) · [long-translated-label](/native/storybook-solid/?path=/story/krds-tab-bar--long-translated-label) · [scroll-page](/native/storybook-solid/?path=/story/krds-tab-bar--scroll-page).
- svelte: [three-items](/native/storybook-svelte/?path=/story/krds-tab-bar--three-items) · [five-items](/native/storybook-svelte/?path=/story/krds-tab-bar--five-items) · [with-badge](/native/storybook-svelte/?path=/story/krds-tab-bar--with-badge) · [all-menu](/native/storybook-svelte/?path=/story/krds-tab-bar--all-menu) · [long-translated-label](/native/storybook-svelte/?path=/story/krds-tab-bar--long-translated-label) · [scroll-page](/native/storybook-svelte/?path=/story/krds-tab-bar--scroll-page).
- vue: [three-items](/native/storybook-vue/?path=/story/krds-tab-bar--three-items) · [five-items](/native/storybook-vue/?path=/story/krds-tab-bar--five-items) · [with-badge](/native/storybook-vue/?path=/story/krds-tab-bar--with-badge) · [all-menu](/native/storybook-vue/?path=/story/krds-tab-bar--all-menu) · [long-translated-label](/native/storybook-vue/?path=/story/krds-tab-bar--long-translated-label) · [scroll-page](/native/storybook-vue/?path=/story/krds-tab-bar--scroll-page).
- lit: [Three Items](/native/storybook-lit/?path=/story/krds-tab-bar--three-items) · [Five Items](/native/storybook-lit/?path=/story/krds-tab-bar--five-items) · [With Badge](/native/storybook-lit/?path=/story/krds-tab-bar--with-badge) · [All Menu](/native/storybook-lit/?path=/story/krds-tab-bar--all-menu) · [Long Translated Label](/native/storybook-lit/?path=/story/krds-tab-bar--long-translated-label) · [Scroll Page](/native/storybook-lit/?path=/story/krds-tab-bar--scroll-page).
- qwik: [three-items](/native/storybook-qwik/?path=/story/krds-tab-bar--three-items) · [five-items](/native/storybook-qwik/?path=/story/krds-tab-bar--five-items) · [with-badge](/native/storybook-qwik/?path=/story/krds-tab-bar--with-badge) · [all-menu](/native/storybook-qwik/?path=/story/krds-tab-bar--all-menu) · [long-translated-label](/native/storybook-qwik/?path=/story/krds-tab-bar--long-translated-label) · [scroll-page](/native/storybook-qwik/?path=/story/krds-tab-bar--scroll-page).
- angular: [three-items](/native/storybook-angular/?path=/story/krds-tab-bar--three-items) · [five-items](/native/storybook-angular/?path=/story/krds-tab-bar--five-items) · [with-badge](/native/storybook-angular/?path=/story/krds-tab-bar--with-badge) · [all-menu](/native/storybook-angular/?path=/story/krds-tab-bar--all-menu) · [long-translated-label](/native/storybook-angular/?path=/story/krds-tab-bar--long-translated-label) · [scroll-page](/native/storybook-angular/?path=/story/krds-tab-bar--scroll-page).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-57); [download exact source](/sources/apps/fixture-svelte/src/public-examples/TabBarExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:06.337Z`. SHA-256: `89a4830ba2601fe898f1dfc5afd31166c49ca6b76d55d10a78ab4faf76e6d378`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_12_07.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/index.md) before redistributing.
