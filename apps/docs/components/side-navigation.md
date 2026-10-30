---
title: 'Side navigation · 사이드 메뉴'
---

# Side navigation

사이드 메뉴 · `SideNavigation` · composition

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_03_04.html) · [Full reviewed specification](/sources/specs/components/side-navigation.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/side-navigation/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.0.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/side-navigation/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/SideNavigation.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/side-navigation/SideNavigation.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/side-navigation/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/side-navigation/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-side-navigation.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface SideNavigationContract {
    items: readonly NavigationItem[];
    currentId?: string;
    expandedIds?: readonly string[];
    defaultExpandedIds?: readonly string[];
    onExpandedChange?: (detail: {
        ids: readonly string[];
    }) => void;
    title?: string;
    parentLink?: LinkData;
}

export interface NavigationItem {
    id: string;
    label: string;
    href?: string;
    description?: string;
    children?: readonly NavigationItem[];
}

export interface LinkData {
    id?: string;
    label: string;
    href: string;
    target?: string;
    rel?: string;
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `items` | yes | `readonly NavigationItem[]` | data / state |
| `currentId` | no | `string` | data / state |
| `expandedIds` | no | `readonly string[]` | data / state |
| `defaultExpandedIds` | no | `readonly string[]` | data / state |
| `onExpandedChange` | no | `(detail: {ids: readonly string[]}) => void` | semantic event request |
| `title` | no | `string` | data / state |
| `parentLink` | no | `LinkData` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Named navigation landmark with optional heading/back-to-parent control, nested &lt;ul>/&lt;li> links, selected leaf cue, and separate descendant disclosure buttons. Expose at most two levels together; deeper structure is progressively exposed with header context. Current leaf aria-current=page; triggers aria-expanded/controls.

### Plain semantic API

Independent API: items {id,label,href?,children?}[], currentId, expandedIds/defaultExpandedIds (initially current branch), onExpandedChange({ids}), title/parentLink optional. Multiple expanded branches are independent; do not apply Accordion single-open defaults.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Tab follows visible hierarchy; Enter/click navigate leaves or toggle parents. Opening a second branch leaves first open. Collapsed descendants are absent from focus/a11y tree; collapsing a branch containing active focus returns that branch trigger. Nonmodal desktop navigation has no focus trap.

### Responsive/mobile requirements

Hide sidebar when width insufficient; host MainMenu supplies equivalent navigation. For four-plus overall levels, page-title dropdown may expose the current deep level. Hide only when equivalent route access exists.

### Forms, reset and composition

No form/reset/IME state.

### Asset, integration and composition completion

Completion composes actual Link/disclosure behavior and a header-based deeper-navigation fixture. Host owns route tree/current state and equivalent narrow navigation. No undocumented cross-adapter reuse.

### Stable parts and states

root, header, parent-link, list, item, link, trigger, submenu, indicator; current,expanded,collapsed.

All rendered owned parts use `data-krds-component="side-navigation"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `simple`, `with-header`, `mobile-dropdown`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-side-navigation--simple`, `krds-side-navigation--with-header`, `krds-side-navigation--two-open-branches`, `krds-side-navigation--deep-progressive`, `krds-side-navigation--mobile-dropdown`, `krds-side-navigation--long-menu`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Simple](/native/storybook-react/?path=/story/krds-side-navigation--simple) · [With Header](/native/storybook-react/?path=/story/krds-side-navigation--with-header) · [Two Open Branches](/native/storybook-react/?path=/story/krds-side-navigation--two-open-branches) · [Deep Progressive](/native/storybook-react/?path=/story/krds-side-navigation--deep-progressive) · [Mobile Dropdown](/native/storybook-react/?path=/story/krds-side-navigation--mobile-dropdown) · [Long Menu](/native/storybook-react/?path=/story/krds-side-navigation--long-menu).
- solid: [simple](/native/storybook-solid/?path=/story/krds-side-navigation--simple) · [with-header](/native/storybook-solid/?path=/story/krds-side-navigation--with-header) · [two-open-branches](/native/storybook-solid/?path=/story/krds-side-navigation--two-open-branches) · [deep-progressive](/native/storybook-solid/?path=/story/krds-side-navigation--deep-progressive) · [mobile-dropdown](/native/storybook-solid/?path=/story/krds-side-navigation--mobile-dropdown) · [long-menu](/native/storybook-solid/?path=/story/krds-side-navigation--long-menu).
- svelte: [simple](/native/storybook-svelte/?path=/story/krds-side-navigation--simple) · [with-header](/native/storybook-svelte/?path=/story/krds-side-navigation--with-header) · [two-open-branches](/native/storybook-svelte/?path=/story/krds-side-navigation--two-open-branches) · [deep-progressive](/native/storybook-svelte/?path=/story/krds-side-navigation--deep-progressive) · [mobile-dropdown](/native/storybook-svelte/?path=/story/krds-side-navigation--mobile-dropdown) · [long-menu](/native/storybook-svelte/?path=/story/krds-side-navigation--long-menu).
- vue: [simple](/native/storybook-vue/?path=/story/krds-side-navigation--simple) · [with-header](/native/storybook-vue/?path=/story/krds-side-navigation--with-header) · [two-open-branches](/native/storybook-vue/?path=/story/krds-side-navigation--two-open-branches) · [deep-progressive](/native/storybook-vue/?path=/story/krds-side-navigation--deep-progressive) · [mobile-dropdown](/native/storybook-vue/?path=/story/krds-side-navigation--mobile-dropdown) · [long-menu](/native/storybook-vue/?path=/story/krds-side-navigation--long-menu).
- lit: [Simple](/native/storybook-lit/?path=/story/krds-side-navigation--simple) · [With Header](/native/storybook-lit/?path=/story/krds-side-navigation--with-header) · [Two Open Branches](/native/storybook-lit/?path=/story/krds-side-navigation--two-open-branches) · [Deep Progressive](/native/storybook-lit/?path=/story/krds-side-navigation--deep-progressive) · [Mobile Dropdown](/native/storybook-lit/?path=/story/krds-side-navigation--mobile-dropdown) · [Long Menu](/native/storybook-lit/?path=/story/krds-side-navigation--long-menu).
- qwik: [simple](/native/storybook-qwik/?path=/story/krds-side-navigation--simple) · [with-header](/native/storybook-qwik/?path=/story/krds-side-navigation--with-header) · [two-open-branches](/native/storybook-qwik/?path=/story/krds-side-navigation--two-open-branches) · [deep-progressive](/native/storybook-qwik/?path=/story/krds-side-navigation--deep-progressive) · [mobile-dropdown](/native/storybook-qwik/?path=/story/krds-side-navigation--mobile-dropdown) · [long-menu](/native/storybook-qwik/?path=/story/krds-side-navigation--long-menu).
- angular: [simple](/native/storybook-angular/?path=/story/krds-side-navigation--simple) · [with-header](/native/storybook-angular/?path=/story/krds-side-navigation--with-header) · [two-open-branches](/native/storybook-angular/?path=/story/krds-side-navigation--two-open-branches) · [deep-progressive](/native/storybook-angular/?path=/story/krds-side-navigation--deep-progressive) · [mobile-dropdown](/native/storybook-angular/?path=/story/krds-side-navigation--mobile-dropdown) · [long-menu](/native/storybook-angular/?path=/story/krds-side-navigation--long-menu).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-11); [download exact source](/sources/apps/fixture-svelte/src/public-examples/SideNavigationExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:03.067Z`. SHA-256: `12f628f6e3fee2ebebc637ed2773beec9dc30c74edf5d16f1c71b31c3ace951f`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_03_04.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
