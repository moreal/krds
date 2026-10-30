---
title: 'Main menu · 메인 메뉴'
---

# Main menu

메인 메뉴 · `MainMenu` · composition

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_03_02.html) · [Full reviewed specification](/sources/specs/components/main-menu.md.txt) · [Framework support](../compatibility/README.md)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/main-menu/index.d.ts.txt) | [react sources and preview policy](../compatibility/README.mdexamples#react) |
| solid | `0.0.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/main-menu/index.d.ts.txt) | [solid sources and preview policy](../compatibility/README.mdexamples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/MainMenu.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/README.mdexamples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/main-menu/MainMenu.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/README.mdexamples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/main-menu/index.d.ts.txt) | [lit sources and preview policy](../compatibility/README.mdexamples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/main-menu/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/README.mdexamples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-main-menu.d.ts.txt) | [angular sources and preview policy](../compatibility/README.mdexamples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/README.mdexamples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface MainMenuContract {
    label?: string;
    mobileTriggerId?: string;
    mobileTriggerLabel?: string;
    items: readonly NavigationItem[];
    currentId?: string;
    expandedId?: string | null;
    defaultExpandedId?: string | null;
    onExpandedChange?: (detail: {
        id: string | null;
    }) => void;
    mobileOpen?: boolean;
    defaultMobileOpen?: boolean;
    onMobileOpenChange?: (detail: OpenChangeDetails) => void;
    query?: string;
    onQueryChange?: (detail: ValueChangeDetails<string>) => void;
}

export interface NavigationItem {
    id: string;
    label: string;
    href?: string;
    description?: string;
    children?: readonly NavigationItem[];
}

export interface OpenChangeDetails {
    open: boolean;
}

export interface ValueChangeDetails<T> {
    value: T;
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `label` | no | `string` | data / state |
| `mobileTriggerId` | no | `string` | data / state |
| `mobileTriggerLabel` | no | `string` | data / state |
| `items` | yes | `readonly NavigationItem[]` | data / state |
| `currentId` | no | `string` | data / state |
| `expandedId` | no | `string \| null` | data / state |
| `defaultExpandedId` | no | `string \| null` | data / state |
| `onExpandedChange` | no | `(detail: {id: string \| null}) => void` | semantic event request |
| `mobileOpen` | no | `boolean` | data / state |
| `defaultMobileOpen` | no | `boolean` | data / state |
| `onMobileOpenChange` | no | `(detail: OpenChangeDetails) => void` | semantic event request |
| `query` | no | `string` | data / state |
| `onQueryChange` | no | `(detail: ValueChangeDetails<string>) => void` | semantic event request |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Named &lt;nav aria-label="메인 메뉴"> containing heading/list hierarchy. Leaf items are real links; items that reveal descendants are buttons, with chevron and current/expanded cues. Desktop dropdown includes a title, optional description/utilities. Mobile layer includes opener, utilities, section navigation, optional local menu-search, drill-back and close controls.

### Plain semantic API

Independent API: items {id,label,href?,description?,children?}[] with currentId, expandedId/defaultExpandedId, onExpandedChange({id}), mobileOpen/defaultMobileOpen, onMobileOpenChange({open}), local query/onQueryChange when search supplied. At most three exposed navigation levels; separate any deeper drilldown data from desktop flattening.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

**Additive landmark and trigger identity:** label optionally supplies the real navigation landmark name (existing 메인 메뉴 default unchanged). mobileTriggerId/mobileTriggerLabel optionally identify/name its one actual primary mobile opener; omitted values retain existing defaults. When composed by Header, its navigationLabel maps to this label and shared current/mobile state targets this same menu instance. If Header owns the primary native trigger, the adapter connects that actual native control internally and suppresses duplicate openers without duplicate IDs. A native content slot is transport for this real menu, not permission to render a second empty menu or an extra navigation wrapper. Plain IDs do not replace adapter-native refs or valid same-root relationships.

### Keyboard, focus and state transitions

Click/Enter toggles a parent; no hover-only opening. Escape closes expanded dropdown(s) and focuses top-level trigger. Tab follows hierarchy. Official dropdown active cue aria-current=true is distinct from current leaf aria-current=page; also expose aria-expanded/controls. Closed descendants leave focus/a11y trees. Mobile full-screen modal layer follows the reviewed Modal focus/isolation contract as a project choice; leaf anchors retain browser behavior.

### Responsive/mobile requirements

Desktop dropdown maximum height 70vh with internal overflow; narrow screens use hamburger layer rather than clipped desktop links. Search is optional for complex menus and local in stories. Avoid rearranging focus order when switching layout.

### Forms, reset and composition

No navigation form value/reset. Optional search preserves IME and never activates navigation from composing Enter.

### Asset, integration and composition completion

Compose Link, buttons, mobile dialog, optional TextInput and utilities natively in each renderer. Host owns route map/current page, auth/utilities, and search decisions; menu does not fetch or mutate history beyond native links.

### Stable parts and states

root, list, item, trigger, link, indicator, submenu, submenu-title, description, utilities, mobile-trigger, mobile-content, back, close, search; expanded/collapsed,current, mobile-open.

All rendered owned parts use `data-krds-component="main-menu"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `desktop-links`, `desktop-dropdown`, `desktop-described`, `mobile-simple`, `mobile-sections`, `mobile-drilldown`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-main-menu--desktop-links`, `krds-main-menu--desktop-dropdown`, `krds-main-menu--desktop-described`, `krds-main-menu--large-menu-overflow`, `krds-main-menu--mobile-simple`, `krds-main-menu--mobile-sections`, `krds-main-menu--mobile-drilldown`, `krds-main-menu--local-search`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Desktop Links](/native/storybook-react/?path=/story/krds-main-menu--desktop-links) · [Desktop Dropdown](/native/storybook-react/?path=/story/krds-main-menu--desktop-dropdown) · [Desktop Described](/native/storybook-react/?path=/story/krds-main-menu--desktop-described) · [Large Menu Overflow](/native/storybook-react/?path=/story/krds-main-menu--large-menu-overflow) · [Mobile Simple](/native/storybook-react/?path=/story/krds-main-menu--mobile-simple) · [Mobile Sections](/native/storybook-react/?path=/story/krds-main-menu--mobile-sections) · [Mobile Drilldown](/native/storybook-react/?path=/story/krds-main-menu--mobile-drilldown) · [Local Search](/native/storybook-react/?path=/story/krds-main-menu--local-search).
- solid: [desktop-links](/native/storybook-solid/?path=/story/krds-main-menu--desktop-links) · [desktop-dropdown](/native/storybook-solid/?path=/story/krds-main-menu--desktop-dropdown) · [desktop-described](/native/storybook-solid/?path=/story/krds-main-menu--desktop-described) · [large-menu-overflow](/native/storybook-solid/?path=/story/krds-main-menu--large-menu-overflow) · [mobile-simple](/native/storybook-solid/?path=/story/krds-main-menu--mobile-simple) · [mobile-sections](/native/storybook-solid/?path=/story/krds-main-menu--mobile-sections) · [mobile-drilldown](/native/storybook-solid/?path=/story/krds-main-menu--mobile-drilldown) · [local-search](/native/storybook-solid/?path=/story/krds-main-menu--local-search).
- svelte: [desktop-links](/native/storybook-svelte/?path=/story/krds-main-menu--desktop-links) · [desktop-dropdown](/native/storybook-svelte/?path=/story/krds-main-menu--desktop-dropdown) · [desktop-described](/native/storybook-svelte/?path=/story/krds-main-menu--desktop-described) · [large-menu-overflow](/native/storybook-svelte/?path=/story/krds-main-menu--large-menu-overflow) · [mobile-simple](/native/storybook-svelte/?path=/story/krds-main-menu--mobile-simple) · [mobile-sections](/native/storybook-svelte/?path=/story/krds-main-menu--mobile-sections) · [mobile-drilldown](/native/storybook-svelte/?path=/story/krds-main-menu--mobile-drilldown) · [local-search](/native/storybook-svelte/?path=/story/krds-main-menu--local-search).
- vue: [desktop-links](/native/storybook-vue/?path=/story/krds-main-menu--desktop-links) · [desktop-dropdown](/native/storybook-vue/?path=/story/krds-main-menu--desktop-dropdown) · [desktop-described](/native/storybook-vue/?path=/story/krds-main-menu--desktop-described) · [large-menu-overflow](/native/storybook-vue/?path=/story/krds-main-menu--large-menu-overflow) · [mobile-simple](/native/storybook-vue/?path=/story/krds-main-menu--mobile-simple) · [mobile-sections](/native/storybook-vue/?path=/story/krds-main-menu--mobile-sections) · [mobile-drilldown](/native/storybook-vue/?path=/story/krds-main-menu--mobile-drilldown) · [local-search](/native/storybook-vue/?path=/story/krds-main-menu--local-search).
- lit: [Desktop Links](/native/storybook-lit/?path=/story/krds-main-menu--desktop-links) · [Desktop Dropdown](/native/storybook-lit/?path=/story/krds-main-menu--desktop-dropdown) · [Desktop Described](/native/storybook-lit/?path=/story/krds-main-menu--desktop-described) · [Large Menu Overflow](/native/storybook-lit/?path=/story/krds-main-menu--large-menu-overflow) · [Mobile Simple](/native/storybook-lit/?path=/story/krds-main-menu--mobile-simple) · [Mobile Sections](/native/storybook-lit/?path=/story/krds-main-menu--mobile-sections) · [Mobile Drilldown](/native/storybook-lit/?path=/story/krds-main-menu--mobile-drilldown) · [Local Search](/native/storybook-lit/?path=/story/krds-main-menu--local-search).
- qwik: [desktop-links](/native/storybook-qwik/?path=/story/krds-main-menu--desktop-links) · [desktop-dropdown](/native/storybook-qwik/?path=/story/krds-main-menu--desktop-dropdown) · [desktop-described](/native/storybook-qwik/?path=/story/krds-main-menu--desktop-described) · [large-menu-overflow](/native/storybook-qwik/?path=/story/krds-main-menu--large-menu-overflow) · [mobile-simple](/native/storybook-qwik/?path=/story/krds-main-menu--mobile-simple) · [mobile-sections](/native/storybook-qwik/?path=/story/krds-main-menu--mobile-sections) · [mobile-drilldown](/native/storybook-qwik/?path=/story/krds-main-menu--mobile-drilldown) · [local-search](/native/storybook-qwik/?path=/story/krds-main-menu--local-search).
- angular: [desktop-links](/native/storybook-angular/?path=/story/krds-main-menu--desktop-links) · [desktop-dropdown](/native/storybook-angular/?path=/story/krds-main-menu--desktop-dropdown) · [desktop-described](/native/storybook-angular/?path=/story/krds-main-menu--desktop-described) · [large-menu-overflow](/native/storybook-angular/?path=/story/krds-main-menu--large-menu-overflow) · [mobile-simple](/native/storybook-angular/?path=/story/krds-main-menu--mobile-simple) · [mobile-sections](/native/storybook-angular/?path=/story/krds-main-menu--mobile-sections) · [mobile-drilldown](/native/storybook-angular/?path=/story/krds-main-menu--mobile-drilldown) · [local-search](/native/storybook-angular/?path=/story/krds-main-menu--local-search).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-9); [download exact source](/sources/apps/fixture-svelte/src/public-examples/MainMenuExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:02.921Z`. SHA-256: `07d43ecd2faad3500071e6cc5427534d4e5a86c680e17dde4b1ab4a5f3475e14`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_03_02.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/index.md) before redistributing.
