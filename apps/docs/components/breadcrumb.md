---
title: 'Breadcrumb · 브레드크럼'
---

# Breadcrumb

브레드크럼 · `Breadcrumb` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_03_03.html) · [Full reviewed specification](/sources/specs/components/breadcrumb.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/breadcrumb/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.0.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/breadcrumb/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/Breadcrumb.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/breadcrumb/Breadcrumb.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/breadcrumb/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/breadcrumb/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-breadcrumb.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface BreadcrumbContract {
    items: readonly {
        id: string;
        label: string;
        href?: string;
    }[];
    home: LinkData;
    currentItem?: {
        id: string;
        label: string;
    };
    omitCurrent?: boolean;
    maxVisible?: number;
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
| `items` | yes | `readonly {id: string; label: string; href?: string}[]` | data / state |
| `home` | yes | `LinkData` | data / state |
| `currentItem` | no | `{id: string; label: string}` | data / state |
| `omitCurrent` | no | `boolean` | data / state |
| `maxVisible` | no | `number` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Named &lt;nav aria-label="브레드크럼"> with &lt;ol>&lt;li>. First item links home; include every parent level even if no destination exists (plain text then). Separator is hidden from AT, with visible 3:1 contrast. Breadcrumb precedes page heading; parent-last mode omits current title only when no other content intervenes.

### Plain semantic API

Independent API: items {id,label,href?}[], home {href,label}, currentItem? {id,label}, omitCurrent=true, maxVisible=4 desktop/2 narrow. Ellipsis directly follows home and is descriptive noninteractive text, not a fabricated expand action. Items contain ancestors/parents only, excluding Home and the current page. `omitCurrent` controls only the separate explicit `currentItem`; never drop the last parent or infer current from a missing href. A missing parent href renders text and remains present. `omitCurrent=false` requires currentItem and appends it as noninteractive aria-current=page text. Home is always the separate first item.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Native Tab/Shift+Tab and Enter apply only to links; non-destinations and ellipsis are not tab stops. Preserve complete accessible hierarchy when visually collapsing intermediate path without creating invisible focusable links.

### Responsive/mobile requirements

One line; five-plus paths collapse after home; narrow mode shows home and last parent with ellipsis between. Last label may truncate only when still needed after path reduction; full accessible name remains.

### Forms, reset and composition

No form/reset/IME behavior.

### Asset, integration and composition completion

Host provides true hierarchy/destinations and adjacent page title, not visit history. Completion includes parent-last placement and hierarchy fixture. No router dependency required.

### Stable parts and states

root, list, item, link, home, separator, ellipsis; current,collapsed.

All rendered owned parts use `data-krds-component="breadcrumb"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `default`, `collapsed`, `narrow`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-breadcrumb--default`, `krds-breadcrumb--deep-collapsed`, `krds-breadcrumb--missing-parent-href`, `krds-breadcrumb--narrow-long-label`, `krds-breadcrumb--parent-last-heading`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Default](/native/storybook-react/?path=/story/krds-breadcrumb--default) · [Deep Collapsed](/native/storybook-react/?path=/story/krds-breadcrumb--deep-collapsed) · [Missing Parent Href](/native/storybook-react/?path=/story/krds-breadcrumb--missing-parent-href) · [Narrow Long Label](/native/storybook-react/?path=/story/krds-breadcrumb--narrow-long-label) · [Parent Last Heading](/native/storybook-react/?path=/story/krds-breadcrumb--parent-last-heading).
- solid: [default](/native/storybook-solid/?path=/story/krds-breadcrumb--default) · [deep-collapsed](/native/storybook-solid/?path=/story/krds-breadcrumb--deep-collapsed) · [missing-parent-href](/native/storybook-solid/?path=/story/krds-breadcrumb--missing-parent-href) · [narrow-long-label](/native/storybook-solid/?path=/story/krds-breadcrumb--narrow-long-label) · [parent-last-heading](/native/storybook-solid/?path=/story/krds-breadcrumb--parent-last-heading).
- svelte: [default](/native/storybook-svelte/?path=/story/krds-breadcrumb--default) · [deep-collapsed](/native/storybook-svelte/?path=/story/krds-breadcrumb--deep-collapsed) · [missing-parent-href](/native/storybook-svelte/?path=/story/krds-breadcrumb--missing-parent-href) · [narrow-long-label](/native/storybook-svelte/?path=/story/krds-breadcrumb--narrow-long-label) · [parent-last-heading](/native/storybook-svelte/?path=/story/krds-breadcrumb--parent-last-heading).
- vue: [default](/native/storybook-vue/?path=/story/krds-breadcrumb--default) · [deep-collapsed](/native/storybook-vue/?path=/story/krds-breadcrumb--deep-collapsed) · [missing-parent-href](/native/storybook-vue/?path=/story/krds-breadcrumb--missing-parent-href) · [narrow-long-label](/native/storybook-vue/?path=/story/krds-breadcrumb--narrow-long-label) · [parent-last-heading](/native/storybook-vue/?path=/story/krds-breadcrumb--parent-last-heading).
- lit: [Default](/native/storybook-lit/?path=/story/krds-breadcrumb--default) · [Deep Collapsed](/native/storybook-lit/?path=/story/krds-breadcrumb--deep-collapsed) · [Missing Parent Href](/native/storybook-lit/?path=/story/krds-breadcrumb--missing-parent-href) · [Narrow Long Label](/native/storybook-lit/?path=/story/krds-breadcrumb--narrow-long-label) · [Parent Last Heading](/native/storybook-lit/?path=/story/krds-breadcrumb--parent-last-heading).
- qwik: [default](/native/storybook-qwik/?path=/story/krds-breadcrumb--default) · [deep-collapsed](/native/storybook-qwik/?path=/story/krds-breadcrumb--deep-collapsed) · [missing-parent-href](/native/storybook-qwik/?path=/story/krds-breadcrumb--missing-parent-href) · [narrow-long-label](/native/storybook-qwik/?path=/story/krds-breadcrumb--narrow-long-label) · [parent-last-heading](/native/storybook-qwik/?path=/story/krds-breadcrumb--parent-last-heading).
- angular: [default](/native/storybook-angular/?path=/story/krds-breadcrumb--default) · [deep-collapsed](/native/storybook-angular/?path=/story/krds-breadcrumb--deep-collapsed) · [missing-parent-href](/native/storybook-angular/?path=/story/krds-breadcrumb--missing-parent-href) · [narrow-long-label](/native/storybook-angular/?path=/story/krds-breadcrumb--narrow-long-label) · [parent-last-heading](/native/storybook-angular/?path=/story/krds-breadcrumb--parent-last-heading).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-10); [download exact source](/sources/apps/fixture-svelte/src/public-examples/BreadcrumbExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:02.993Z`. SHA-256: `d3bc6305143388437ad54f4b099daa1f0cb4643170ee594522fb6603c2c48aca`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_03_03.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
