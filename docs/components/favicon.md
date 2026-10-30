---
title: 'Favicon · 파비콘'
---

# Favicon

파비콘 · `Favicon` · asset

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_04_14.html) · [Full reviewed specification](/sources/specs/components/favicon.md.txt) · [Framework support](../compatibility/README.md)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/favicon/index.d.ts.txt) | [react sources and preview policy](../compatibility/README.mdexamples#react) |
| solid | `0.0.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/favicon/index.d.ts.txt) | [solid sources and preview policy](../compatibility/README.mdexamples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/Favicon.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/README.mdexamples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/favicon/Favicon.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/README.mdexamples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/favicon/index.d.ts.txt) | [lit sources and preview policy](../compatibility/README.mdexamples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/favicon/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/README.mdexamples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-favicon.d.ts.txt) | [angular sources and preview policy](../compatibility/README.mdexamples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/README.mdexamples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface FaviconContract {
    light: IconAsset;
    dark?: IconAsset;
    touchIcon?: IconAsset;
}

export interface IconAsset {
    href: string;
    type: string;
    sizes: string;
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `light` | yes | `IconAsset` | data / state |
| `dark` | no | `IconAsset` | data / state |
| `touchIcon` | no | `IconAsset` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Document-head favicon asset integration, not an on-page div. Official standard applies government-symbol institutions; extended applies own-CI institutions/services. Supply recognizable 16px mark and consistent institution identity across representative/subservice domains.

### Plain semantic API

Independent API: Favicon asset descriptor {light:{href,type,sizes},dark?:{href,type,sizes},touchIcon?}; head integration emits actual &lt;link rel=icon> with color-scheme media as supported. No event, focus, form or runtime value state. Paths point to locally bundled cleared files; no default government crest.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

No keyboard behavior; verify browser/head metadata and accessible instructions for host installation rather than creating a fake visual control.

### Responsive/mobile requirements

Prepare light/dark versions retaining same symbol; mobile homescreen/touch asset support is host integration choice and requires matching platform metadata review.

### Forms, reset and composition

No form/reset/IME behavior.

### Asset, integration and composition completion

Host owns CI rights, files, domain consistency and head insertion. Asset completion requires committed local files with provenance/hash, correct MIME/sizes/head links and browser/tab review in each host fixture; a component export alone cannot satisfy it.

### Stable parts and states

No rendered data-krds parts required; optional documentation preview root and light/dark sample are explicitly previews, not runtime favicon DOM.

All rendered owned parts use `data-krds-component="favicon"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `standard`, `extended`, `light`, `dark`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-favicon--standard-local-head`, `krds-favicon--extended-local-head`, `krds-favicon--light-dark-preview`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Standard Local Head](/native/storybook-react/?path=/story/krds-favicon--standard-local-head) · [Extended Local Head](/native/storybook-react/?path=/story/krds-favicon--extended-local-head) · [Light Dark Preview](/native/storybook-react/?path=/story/krds-favicon--light-dark-preview).
- solid: [standard-local-head](/native/storybook-solid/?path=/story/krds-favicon--standard-local-head) · [extended-local-head](/native/storybook-solid/?path=/story/krds-favicon--extended-local-head) · [light-dark-preview](/native/storybook-solid/?path=/story/krds-favicon--light-dark-preview).
- svelte: [standard-local-head](/native/storybook-svelte/?path=/story/krds-favicon--standard-local-head) · [extended-local-head](/native/storybook-svelte/?path=/story/krds-favicon--extended-local-head) · [light-dark-preview](/native/storybook-svelte/?path=/story/krds-favicon--light-dark-preview).
- vue: [standard-local-head](/native/storybook-vue/?path=/story/krds-favicon--standard-local-head) · [extended-local-head](/native/storybook-vue/?path=/story/krds-favicon--extended-local-head) · [light-dark-preview](/native/storybook-vue/?path=/story/krds-favicon--light-dark-preview).
- lit: [Standard Local Head](/native/storybook-lit/?path=/story/krds-favicon--standard-local-head) · [Extended Local Head](/native/storybook-lit/?path=/story/krds-favicon--extended-local-head) · [Light Dark Preview](/native/storybook-lit/?path=/story/krds-favicon--light-dark-preview).
- qwik: [standard-local-head](/native/storybook-qwik/?path=/story/krds-favicon--standard-local-head) · [extended-local-head](/native/storybook-qwik/?path=/story/krds-favicon--extended-local-head) · [light-dark-preview](/native/storybook-qwik/?path=/story/krds-favicon--light-dark-preview).
- angular: [standard-local-head](/native/storybook-angular/?path=/story/krds-favicon--standard-local-head) · [extended-local-head](/native/storybook-angular/?path=/story/krds-favicon--extended-local-head) · [light-dark-preview](/native/storybook-angular/?path=/story/krds-favicon--light-dark-preview).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-26); [download exact source](/sources/apps/fixture-svelte/src/public-examples/FaviconExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:04.115Z`. SHA-256: `1ded75634138e65690cc3a60c6d61c6c344b7d4d5cca6ef9ced66605a7d68a83`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_04_14.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/index.md) before redistributing.
