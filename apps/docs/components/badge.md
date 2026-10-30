---
title: 'Badge · 배지'
---

# Badge

배지 · `Badge` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_04_06.html) · [Full reviewed specification](/sources/specs/components/badge.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [exact subpath types](/sources/packages/react/dist/components/badge/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.1.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/badge/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/Badge.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/badge/Badge.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/badge/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/badge/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-badge.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.1.0-preview.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface BadgeContract {
    label: string;
    appearance?: 'outline' | 'filled' | 'pastel';
    tone?: 'secondary' | 'gray' | 'point' | 'danger' | 'warning' | 'success' | 'information' | 'disabled';
    size?: Size;
    numeric?: boolean;
}

export type Size = 'small' | 'medium' | 'large';
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `label` | yes | `string` | data / state |
| `appearance` | no | `'outline' \| 'filled' \| 'pastel'` | data / state |
| `tone` | no | `'secondary' \| 'gray' \| 'point' \| 'danger' \| 'warning' \| 'success' \| 'information' \| 'disabled'` | data / state |
| `size` | no | `Size` | data / state |
| `numeric` | no | `boolean` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Noninteractive label within outlined/filled/pastel container. Always visible text; no button/link role, href or nonnegative tabindex. Numeric content is still text information, not a counter action.

### Plain semantic API

Independent API: label, appearance=outline|filled|pastel (outline default), tone=secondary|gray|point|danger|warning|success|information|disabled, size=small|medium|large (medium), numeric=false. Official selector table additionally lists primary; source guidance forbids primary background, so the supported API excludes primary tone and primary backgrounds. This resolves the selector/prose tension as independent project policy.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

No keyboard action, selection event, focus or live announcement by default. Disabled tone is informational styling and must not imply actual control disabled semantics.

### Responsive/mobile requirements

Short unwrapped label; one badge per associated element. Host shortens copy rather than silently truncating status. Text/background contrast at least 4.5:1.

### Forms, reset and composition

No form/reset/IME behavior.

### Asset, integration and composition completion

Host supplies concise true status. Completion is visual/semantic across tones and sizes with actual label; not an empty decorative capsule.

### Stable parts and states

root, label; appearance,tone,size,numeric; no pressed/selected.

All rendered owned parts use `data-krds-component="badge"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `outline`, `filled`, `pastel`, `numeric`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-badge--outline`, `krds-badge--filled`, `krds-badge--pastel`, `krds-badge--numeric`, `krds-badge--sizes`, `krds-badge--tones`, `krds-badge--long-label`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Outline](/native/storybook-react/?path=/story/krds-badge--outline) · [Filled](/native/storybook-react/?path=/story/krds-badge--filled) · [Pastel](/native/storybook-react/?path=/story/krds-badge--pastel) · [Numeric](/native/storybook-react/?path=/story/krds-badge--numeric) · [Sizes](/native/storybook-react/?path=/story/krds-badge--sizes) · [Tones](/native/storybook-react/?path=/story/krds-badge--tones) · [Long Label](/native/storybook-react/?path=/story/krds-badge--long-label).
- solid: [outline](/native/storybook-solid/?path=/story/krds-badge--outline) · [filled](/native/storybook-solid/?path=/story/krds-badge--filled) · [pastel](/native/storybook-solid/?path=/story/krds-badge--pastel) · [numeric](/native/storybook-solid/?path=/story/krds-badge--numeric) · [sizes](/native/storybook-solid/?path=/story/krds-badge--sizes) · [tones](/native/storybook-solid/?path=/story/krds-badge--tones) · [long-label](/native/storybook-solid/?path=/story/krds-badge--long-label).
- svelte: [outline](/native/storybook-svelte/?path=/story/krds-badge--outline) · [filled](/native/storybook-svelte/?path=/story/krds-badge--filled) · [pastel](/native/storybook-svelte/?path=/story/krds-badge--pastel) · [numeric](/native/storybook-svelte/?path=/story/krds-badge--numeric) · [sizes](/native/storybook-svelte/?path=/story/krds-badge--sizes) · [tones](/native/storybook-svelte/?path=/story/krds-badge--tones) · [long-label](/native/storybook-svelte/?path=/story/krds-badge--long-label).
- vue: [outline](/native/storybook-vue/?path=/story/krds-badge--outline) · [filled](/native/storybook-vue/?path=/story/krds-badge--filled) · [pastel](/native/storybook-vue/?path=/story/krds-badge--pastel) · [numeric](/native/storybook-vue/?path=/story/krds-badge--numeric) · [sizes](/native/storybook-vue/?path=/story/krds-badge--sizes) · [tones](/native/storybook-vue/?path=/story/krds-badge--tones) · [long-label](/native/storybook-vue/?path=/story/krds-badge--long-label).
- lit: [Outline](/native/storybook-lit/?path=/story/krds-badge--outline) · [Filled](/native/storybook-lit/?path=/story/krds-badge--filled) · [Pastel](/native/storybook-lit/?path=/story/krds-badge--pastel) · [Numeric](/native/storybook-lit/?path=/story/krds-badge--numeric) · [Sizes](/native/storybook-lit/?path=/story/krds-badge--sizes) · [Tones](/native/storybook-lit/?path=/story/krds-badge--tones) · [Long Label](/native/storybook-lit/?path=/story/krds-badge--long-label).
- qwik: [outline](/native/storybook-qwik/?path=/story/krds-badge--outline) · [filled](/native/storybook-qwik/?path=/story/krds-badge--filled) · [pastel](/native/storybook-qwik/?path=/story/krds-badge--pastel) · [numeric](/native/storybook-qwik/?path=/story/krds-badge--numeric) · [sizes](/native/storybook-qwik/?path=/story/krds-badge--sizes) · [tones](/native/storybook-qwik/?path=/story/krds-badge--tones) · [long-label](/native/storybook-qwik/?path=/story/krds-badge--long-label).
- angular: [outline](/native/storybook-angular/?path=/story/krds-badge--outline) · [filled](/native/storybook-angular/?path=/story/krds-badge--filled) · [pastel](/native/storybook-angular/?path=/story/krds-badge--pastel) · [numeric](/native/storybook-angular/?path=/story/krds-badge--numeric) · [sizes](/native/storybook-angular/?path=/story/krds-badge--sizes) · [tones](/native/storybook-angular/?path=/story/krds-badge--tones) · [long-label](/native/storybook-angular/?path=/story/krds-badge--long-label).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [read the checked consumer](/examples/svelte-19); [download exact source](/sources/apps/fixture-svelte/src/public-examples/BadgeExample.svelte.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:03.628Z`. SHA-256: `87506e8571849615ded7d2d2836f7ad4f19f2b4cae68906d7d13d303cfb7bf42`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_04_06.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
