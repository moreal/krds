---
title: 'Identifier · 운영기관 식별자'
---

# Identifier

운영기관 식별자 · `Identifier` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_02_02.html) · [Full reviewed specification](/sources/specs/components/identifier.md.txt) · [Framework support](../compatibility/README.md)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [exact subpath types](/sources/packages/react/dist/components/identifier/index.d.ts.txt) | [react sources and preview policy](../compatibility/README.mdexamples#react) |
| solid | `0.1.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/identifier/index.d.ts.txt) | [solid sources and preview policy](../compatibility/README.mdexamples#solid) |
| svelte | `0.1.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/Identifier.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/README.mdexamples#svelte) |
| vue | `0.1.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/identifier/Identifier.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/README.mdexamples#vue) |
| lit | `0.1.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/identifier/index.d.ts.txt) | [lit sources and preview policy](../compatibility/README.mdexamples#lit) |
| qwik | `0.1.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/identifier/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/README.mdexamples#qwik) |
| angular | `0.1.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-identifier.d.ts.txt) | [angular sources and preview policy](../compatibility/README.mdexamples#angular) |
| solid-next (preview) | `0.1.0-preview.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/README.mdexamples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface IdentifierContract {
    institutionName: string;
    logo: LogoData;
    relationshipText: string;
    theme?: 'light' | 'dark';
}

export interface LogoData {
    src: string;
    alt: string;
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `institutionName` | yes | `string` | data / state |
| `logo` | yes | `LogoData` | data / state |
| `relationshipText` | yes | `string` | data / state |
| `theme` | no | `'light' \| 'dark'` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

A section/article as the last subdivision inside footer: operating institution logo followed by the prescribed management sentence. The logo identifies the responsible operating institution, while the service logo belongs elsewhere in Footer. Preserve element placement and sentence pattern.

### Plain semantic API

Independent API: Identifier accepts institutionName, logo {src, alt}, theme light/dark (light default), and explicit institution relationship wording validated by host. alt names the actual institution; no default institution, copyright holder or government relationship.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Static content has no tab stop, live role or change event. If a host separately links an institution, its Link behavior stays distinct from the identifier contract.

### Responsive/mobile requirements

Maintain logo/text order on narrow layouts; keep contrast in light/dark schemes without changing identity.

### Forms, reset and composition

No form value/reset/IME behavior.

### Asset, integration and composition completion

Host supplies truthful institution/relationship and cleared logo. Completion requires local asset provenance and no invented branding. Official restriction against use by nongovernment sites applies to specimens as in Masthead.

### Stable parts and states

root, logo, text; theme=light|dark.

All rendered owned parts use `data-krds-component="identifier"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `light`, `dark`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-identifier--light`, `krds-identifier--dark`, `krds-identifier--footer-placement`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Light](/native/storybook-react/?path=/story/krds-identifier--light) · [Dark](/native/storybook-react/?path=/story/krds-identifier--dark) · [Footer Placement](/native/storybook-react/?path=/story/krds-identifier--footer-placement).
- solid: [light](/native/storybook-solid/?path=/story/krds-identifier--light) · [dark](/native/storybook-solid/?path=/story/krds-identifier--dark) · [footer-placement](/native/storybook-solid/?path=/story/krds-identifier--footer-placement).
- svelte: [light](/native/storybook-svelte/?path=/story/krds-identifier--light) · [dark](/native/storybook-svelte/?path=/story/krds-identifier--dark) · [footer-placement](/native/storybook-svelte/?path=/story/krds-identifier--footer-placement).
- vue: [light](/native/storybook-vue/?path=/story/krds-identifier--light) · [dark](/native/storybook-vue/?path=/story/krds-identifier--dark) · [footer-placement](/native/storybook-vue/?path=/story/krds-identifier--footer-placement).
- lit: [Light](/native/storybook-lit/?path=/story/krds-identifier--light) · [Dark](/native/storybook-lit/?path=/story/krds-identifier--dark) · [Footer Placement](/native/storybook-lit/?path=/story/krds-identifier--footer-placement).
- qwik: [light](/native/storybook-qwik/?path=/story/krds-identifier--light) · [dark](/native/storybook-qwik/?path=/story/krds-identifier--dark) · [footer-placement](/native/storybook-qwik/?path=/story/krds-identifier--footer-placement).
- angular: [light](/native/storybook-angular/?path=/story/krds-identifier--light) · [dark](/native/storybook-angular/?path=/story/krds-identifier--dark) · [footer-placement](/native/storybook-angular/?path=/story/krds-identifier--footer-placement).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [read the checked consumer](/examples/svelte-5); [download exact source](/sources/apps/fixture-svelte/src/public-examples/IdentifierExample.svelte.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:02.603Z`. SHA-256: `c066b27040aae221596061378f7ce90e3cb675f9aea71aa8395efc2adf64148d`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_02_02.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/index.md) before redistributing.
