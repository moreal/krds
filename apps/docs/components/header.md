---
title: 'Header · 헤더'
---

# Header

헤더 · `Header` · composition

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_02_03.html) · [Full reviewed specification](/sources/specs/components/header.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [exact subpath types](/sources/packages/react/dist/components/header/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.1.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/header/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/Header.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/header/Header.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/header/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/header/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-header.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.1.0-preview.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface HeaderContract {
    currentId?: string;
    mobileOpen?: boolean;
    defaultMobileOpen?: boolean;
    onMobileOpenChange?: (detail: OpenChangeDetails) => void;
    mobileTriggerId?: string;
    mobileTriggerLabel?: string;
    navigationLabel?: string;
    home: LinkData & {
        logo: LogoData;
    };
    utilityItems: readonly (LinkData & {
        id: string;
    })[];
    search?: {
        label: string;
        onRequest: () => void;
    };
    mainNavigation: readonly NavigationItem[];
    actionLayout?: 'vertical' | 'horizontal';
    sticky?: boolean;
}

export interface OpenChangeDetails {
    open: boolean;
}

export interface LinkData {
    id?: string;
    label: string;
    href: string;
    target?: string;
    rel?: string;
}

export interface LogoData {
    src: string;
    alt: string;
}

export interface NavigationItem {
    id: string;
    label: string;
    href?: string;
    description?: string;
    children?: readonly NavigationItem[];
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `currentId` | no | `string` | data / state |
| `mobileOpen` | no | `boolean` | data / state |
| `defaultMobileOpen` | no | `boolean` | data / state |
| `onMobileOpenChange` | no | `(detail: OpenChangeDetails) => void` | semantic event request |
| `mobileTriggerId` | no | `string` | data / state |
| `mobileTriggerLabel` | no | `string` | data / state |
| `navigationLabel` | no | `string` | data / state |
| `home` | yes | `LinkData & {logo: LogoData}` | data / state |
| `utilityItems` | yes | `readonly (LinkData & {id: string})[]` | data / state |
| `search` | no | `{label: string; onRequest: () => void}` | data / state |
| `mainNavigation` | yes | `readonly NavigationItem[]` | data / state |
| `actionLayout` | no | `'vertical' \| 'horizontal'` | data / state |
| `sticky` | no | `boolean` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Compose SkipLink first, Masthead, service identity/home link, utility group (or dropdown when five or more utility links), search action and MainMenu in the official relative order. Government logo is upper left, utilities upper right. Native &lt;header> is the service banner landmark; the skip link may be adjacent before it to remain document-first.

### Plain semantic API

Independent API: Header receives home {href,label,logo}, utilityItems {id,label,href}, search {label,onRequest}, mainNavigation semantic data, actionLayout vertical/horizontal (horizontal default), sticky=false. Use explicit named component regions, not opaque arbitrary containers. Public data/events never expose Ark/Zag instances.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

**Additive native composition inputs:** currentId optionally marks the actual route in the existing real MainMenu. mobileOpen/defaultMobileOpen/onMobileOpenChange({open}) expose that same menu’s mobile disclosure: defined mobileOpen, including false, is authoritative; otherwise read the default once (existing closed default). Both/mode switching are invalid. One accepted user action emits one plain request; mount, props and reset emit none; rejection preserves actual committed panel/focus state. mobileTriggerId/mobileTriggerLabel optionally identify/name the actual primary mobile trigger. navigationLabel optionally names the real MainMenu landmark and is forwarded as its label. Omission preserves existing defaults. A native navigationContent/slot transport may supply the same one real native MainMenu; it must share current/open/primary-trigger identity, not cause an extra empty menu or extra navigation wrapper. Supplied trigger IDs/labels are nonempty and label the actual control; no renderer object enters this semantic API. T11 explicitly supplies 주요 메뉴 and its actual trigger ID; sidebar naming uses its existing title 예제 메뉴.

### Keyboard, focus and state transitions

Link navigation uses native anchors; utility/menu toggles and search use named buttons. Child MainMenu owns expanded/current state and mobile layer focus. Search requests onRequest once without creating a fake local search service. Logo link name excludes redundant “logo”.

### Responsive/mobile requirements

When menu no longer fits, replace bar with a named hamburger opener and keyboard-operable menu layer. Sticky behavior is optional: exclude Masthead from sticky region; for header exceeding two rows, show on upward scroll and release on downward scroll. Native mobile-app-only left-menu limits/settings are not universal mobile-web mandates.

### Forms, reset and composition

Header itself has no form state. A search form belongs to the host/search composition; preserve entered query and IME behavior there.

### Asset, integration and composition completion

Completion requires working local compositions of SkipLink, Masthead specimen, Link, MainMenu and optional LanguageSwitcher/Resize with deterministic state; no adapter imports from other renderers. Host owns auth, search navigation, institution logo and utility destinations.

### Stable parts and states

root, identity, utilities, utility-trigger, actions, search, navigation, mobile-trigger; expanded/collapsed, sticky.

All rendered owned parts use `data-krds-component="header"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `vertical-actions`, `horizontal-actions`, `mobile-menu`, `sticky`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-header--horizontal-actions`, `krds-header--vertical-actions`, `krds-header--five-utilities`, `krds-header--mobile-menu`, `krds-header--sticky-long-page`, `krds-header--translated-long-labels`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Horizontal Actions](/native/storybook-react/?path=/story/krds-header--horizontal-actions) · [Vertical Actions](/native/storybook-react/?path=/story/krds-header--vertical-actions) · [Five Utilities](/native/storybook-react/?path=/story/krds-header--five-utilities) · [Mobile Menu](/native/storybook-react/?path=/story/krds-header--mobile-menu) · [Sticky Long Page](/native/storybook-react/?path=/story/krds-header--sticky-long-page) · [Translated Long Labels](/native/storybook-react/?path=/story/krds-header--translated-long-labels).
- solid: [horizontal-actions](/native/storybook-solid/?path=/story/krds-header--horizontal-actions) · [vertical-actions](/native/storybook-solid/?path=/story/krds-header--vertical-actions) · [five-utilities](/native/storybook-solid/?path=/story/krds-header--five-utilities) · [mobile-menu](/native/storybook-solid/?path=/story/krds-header--mobile-menu) · [sticky-long-page](/native/storybook-solid/?path=/story/krds-header--sticky-long-page) · [translated-long-labels](/native/storybook-solid/?path=/story/krds-header--translated-long-labels).
- svelte: [horizontal-actions](/native/storybook-svelte/?path=/story/krds-header--horizontal-actions) · [vertical-actions](/native/storybook-svelte/?path=/story/krds-header--vertical-actions) · [five-utilities](/native/storybook-svelte/?path=/story/krds-header--five-utilities) · [mobile-menu](/native/storybook-svelte/?path=/story/krds-header--mobile-menu) · [sticky-long-page](/native/storybook-svelte/?path=/story/krds-header--sticky-long-page) · [translated-long-labels](/native/storybook-svelte/?path=/story/krds-header--translated-long-labels).
- vue: [horizontal-actions](/native/storybook-vue/?path=/story/krds-header--horizontal-actions) · [vertical-actions](/native/storybook-vue/?path=/story/krds-header--vertical-actions) · [five-utilities](/native/storybook-vue/?path=/story/krds-header--five-utilities) · [mobile-menu](/native/storybook-vue/?path=/story/krds-header--mobile-menu) · [sticky-long-page](/native/storybook-vue/?path=/story/krds-header--sticky-long-page) · [translated-long-labels](/native/storybook-vue/?path=/story/krds-header--translated-long-labels).
- lit: [Horizontal Actions](/native/storybook-lit/?path=/story/krds-header--horizontal-actions) · [Vertical Actions](/native/storybook-lit/?path=/story/krds-header--vertical-actions) · [Five Utilities](/native/storybook-lit/?path=/story/krds-header--five-utilities) · [Mobile Menu](/native/storybook-lit/?path=/story/krds-header--mobile-menu) · [Sticky Long Page](/native/storybook-lit/?path=/story/krds-header--sticky-long-page) · [Translated Long Labels](/native/storybook-lit/?path=/story/krds-header--translated-long-labels).
- qwik: [horizontal-actions](/native/storybook-qwik/?path=/story/krds-header--horizontal-actions) · [vertical-actions](/native/storybook-qwik/?path=/story/krds-header--vertical-actions) · [five-utilities](/native/storybook-qwik/?path=/story/krds-header--five-utilities) · [mobile-menu](/native/storybook-qwik/?path=/story/krds-header--mobile-menu) · [sticky-long-page](/native/storybook-qwik/?path=/story/krds-header--sticky-long-page) · [translated-long-labels](/native/storybook-qwik/?path=/story/krds-header--translated-long-labels).
- angular: [horizontal-actions](/native/storybook-angular/?path=/story/krds-header--horizontal-actions) · [vertical-actions](/native/storybook-angular/?path=/story/krds-header--vertical-actions) · [five-utilities](/native/storybook-angular/?path=/story/krds-header--five-utilities) · [mobile-menu](/native/storybook-angular/?path=/story/krds-header--mobile-menu) · [sticky-long-page](/native/storybook-angular/?path=/story/krds-header--sticky-long-page) · [translated-long-labels](/native/storybook-angular/?path=/story/krds-header--translated-long-labels).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [read the checked consumer](/examples/svelte-6); [download exact source](/sources/apps/fixture-svelte/src/public-examples/HeaderExample.svelte.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:02.681Z`. SHA-256: `09265da2efd4f428c0c55d0593d2e8554484769ef8b4b7d1e4e6f7b95557053e`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_02_03.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
