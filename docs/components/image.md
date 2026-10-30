---
title: 'Image · 이미지'
---

# Image

이미지 · `Image` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_04_08.html) · [Full reviewed specification](/sources/specs/components/image.md.txt) · [Framework support](../compatibility/README.md)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/image/index.d.ts.txt) | [react sources and preview policy](../compatibility/README.mdexamples#react) |
| solid | `0.0.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/image/index.d.ts.txt) | [solid sources and preview policy](../compatibility/README.mdexamples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/Image.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/README.mdexamples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/image/Image.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/README.mdexamples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/image/index.d.ts.txt) | [lit sources and preview policy](../compatibility/README.mdexamples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/image/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/README.mdexamples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-image.d.ts.txt) | [angular sources and preview policy](../compatibility/README.mdexamples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/README.mdexamples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface ImageContract {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    srcset?: string;
    sizes?: string;
    loading?: 'eager' | 'lazy';
    decorative?: boolean;
    caption?: string;
    descriptionId?: string;
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `src` | yes | `string` | data / state |
| `alt` | yes | `string` | data / state |
| `width` | no | `number` | data / state |
| `height` | no | `number` | data / state |
| `srcset` | no | `string` | data / state |
| `sizes` | no | `string` | data / state |
| `loading` | no | `'eager' \| 'lazy'` | data / state |
| `decorative` | no | `boolean` | data / state |
| `caption` | no | `string` | data / state |
| `descriptionId` | no | `string` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Native img with explicit alt; decorative alt="". Informative alternatives are concise/contextual and avoid author credit, redundant “image”, duplicate adjacent explanation or invented detail. Complex explanation can use nearby figure/figcaption or described content. Prefer live text over text baked into pixels.

### Plain semantic API

Independent API: src, alt (required, may be empty for decoration), width/height, srcset/sizes, loading, optional caption/descriptionId. Decorative flag must agree with alt. No native image role override or click callback; clickable images compose Link/Button.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Static image adds no tab stop. Link composition accessible name describes purpose. Load/error events expose native outcome without claiming content loaded before actual decode.

### Responsive/mobile requirements

Host supplies meaningful crop/source choices; preserve essential information when narrow. Decorative imagery may be omitted narrow, informative content needs equivalent text. Size assets for environment; no external CDN requirement.

### Forms, reset and composition

No form/reset/IME behavior.

### Asset, integration and composition completion

Host supplies local/correctly attributed assets and descriptions. Completion includes informative, decorative, complex and failed-image outcomes; not remote placeholder images.

### Stable parts and states

root (img), figure, caption, description; loaded,error when observed.

All rendered owned parts use `data-krds-component="image"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `informative`, `decorative`, `complex-description`, `responsive`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-image--informative`, `krds-image--decorative`, `krds-image--complex-description`, `krds-image--responsive`, `krds-image--load-error`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Informative](/native/storybook-react/?path=/story/krds-image--informative) · [Decorative](/native/storybook-react/?path=/story/krds-image--decorative) · [Complex Description](/native/storybook-react/?path=/story/krds-image--complex-description) · [Responsive](/native/storybook-react/?path=/story/krds-image--responsive) · [Load Error](/native/storybook-react/?path=/story/krds-image--load-error).
- solid: [informative](/native/storybook-solid/?path=/story/krds-image--informative) · [decorative](/native/storybook-solid/?path=/story/krds-image--decorative) · [complex-description](/native/storybook-solid/?path=/story/krds-image--complex-description) · [responsive](/native/storybook-solid/?path=/story/krds-image--responsive) · [load-error](/native/storybook-solid/?path=/story/krds-image--load-error).
- svelte: [informative](/native/storybook-svelte/?path=/story/krds-image--informative) · [decorative](/native/storybook-svelte/?path=/story/krds-image--decorative) · [complex-description](/native/storybook-svelte/?path=/story/krds-image--complex-description) · [responsive](/native/storybook-svelte/?path=/story/krds-image--responsive) · [load-error](/native/storybook-svelte/?path=/story/krds-image--load-error).
- vue: [informative](/native/storybook-vue/?path=/story/krds-image--informative) · [decorative](/native/storybook-vue/?path=/story/krds-image--decorative) · [complex-description](/native/storybook-vue/?path=/story/krds-image--complex-description) · [responsive](/native/storybook-vue/?path=/story/krds-image--responsive) · [load-error](/native/storybook-vue/?path=/story/krds-image--load-error).
- lit: [Informative](/native/storybook-lit/?path=/story/krds-image--informative) · [Decorative](/native/storybook-lit/?path=/story/krds-image--decorative) · [Complex Description](/native/storybook-lit/?path=/story/krds-image--complex-description) · [Responsive](/native/storybook-lit/?path=/story/krds-image--responsive) · [Load Error](/native/storybook-lit/?path=/story/krds-image--load-error).
- qwik: [informative](/native/storybook-qwik/?path=/story/krds-image--informative) · [decorative](/native/storybook-qwik/?path=/story/krds-image--decorative) · [complex-description](/native/storybook-qwik/?path=/story/krds-image--complex-description) · [responsive](/native/storybook-qwik/?path=/story/krds-image--responsive) · [load-error](/native/storybook-qwik/?path=/story/krds-image--load-error).
- angular: [informative](/native/storybook-angular/?path=/story/krds-image--informative) · [decorative](/native/storybook-angular/?path=/story/krds-image--decorative) · [complex-description](/native/storybook-angular/?path=/story/krds-image--complex-description) · [responsive](/native/storybook-angular/?path=/story/krds-image--responsive) · [load-error](/native/storybook-angular/?path=/story/krds-image--load-error).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-21); [download exact source](/sources/apps/fixture-svelte/src/public-examples/ImageExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:03.765Z`. SHA-256: `d09daa56a0c078f1e17db9481324c43bfbf13a39d4b679120dd9d782a2b9f895`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_04_08.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/index.md) before redistributing.
