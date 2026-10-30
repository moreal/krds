---
title: 'Visually hidden · 숨긴 콘텐츠'
---

# Visually hidden

숨긴 콘텐츠 · `VisuallyHidden` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_11_02.html) · [Full reviewed specification](/sources/specs/components/visually-hidden.md.txt) · [Framework support](../compatibility/README.md)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [exact subpath types](/sources/packages/react/dist/components/visually-hidden/index.d.ts.txt) | [react sources and preview policy](../compatibility/README.mdexamples#react) |
| solid | `0.1.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/visually-hidden/index.d.ts.txt) | [solid sources and preview policy](../compatibility/README.mdexamples#solid) |
| svelte | `0.1.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/VisuallyHidden.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/README.mdexamples#svelte) |
| vue | `0.1.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/visually-hidden/VisuallyHidden.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/README.mdexamples#vue) |
| lit | `0.1.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/visually-hidden/index.d.ts.txt) | [lit sources and preview policy](../compatibility/README.mdexamples#lit) |
| qwik | `0.1.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/visually-hidden/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/README.mdexamples#qwik) |
| angular | `0.1.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-visually-hidden.d.ts.txt) | [angular sources and preview policy](../compatibility/README.mdexamples#angular) |
| solid-next (preview) | `0.1.0-preview.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/README.mdexamples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface VisuallyHiddenContract {
    id?: string;
    lang?: string;
    content?: string;
    variant?: 'text' | 'interactive-overlay' | 'aria-association';
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `id` | no | `string` | data / state |
| `lang` | no | `string` | data / state |
| `content` | no | `string` | data / state |
| `variant` | no | `'text' \| 'interactive-overlay' \| 'aria-association'` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Text hiding primitive preserves meaningful content in accessibility tree, plus a separate interactive overlay pattern matching visible surrogate geometry. Never display:none/visibility:hidden, zero-sized/zero-font text, offscreen displaced focus targets. Prefer native semantics/visible information first.

### Plain semantic API

Independent API: VisuallyHidden renders span by default with id/lang/content; text variant uses nonzero clipping style. Interactive-overlay variant requires an actual native child control over its visible representation at matching dimensions, opacity/z-index and visible surrogate focus outline. ARIA relationship mode uses actual IDs/attributes instead of extra hidden duplicate name.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Text primitive has no tab stop/key behavior. Interactive child retains native keyboard behavior and a visible focus indicator at its true position; do not apply 1px text-clipping style to focusable controls. Screen-reader virtual cursor geometry manually tested.

### Responsive/mobile requirements

Maintain overlay alignment on responsive layout/zoom and translate hidden text when service locale changes. Test mobile VoiceOver/TalkBack as well as desktop combinations named in source.

### Forms, reset and composition

Hidden content itself no form value. Native overlaid input retains full name/value/reset/IME rules of consuming control.

### Asset, integration and composition completion

Host owns meaningful descriptions and translations; this primitive does not replace proper native semantics or universal naming decisions. Completion includes text a11y-tree proof plus interactive geometry/manual AT evidence; CSS class alone untested is insufficient.

### Stable parts and states

root, overlay-control, visible-surrogate; text,interactive-overlay,focus-visible.

All rendered owned parts use `data-krds-component="visually-hidden"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `text`, `interactive-overlay`, `aria-association`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-visually-hidden--text`, `krds-visually-hidden--aria-association`, `krds-visually-hidden--interactive-overlay`, `krds-visually-hidden--zoom`, `krds-visually-hidden--translated`, `krds-visually-hidden--manual-at`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Text](/native/storybook-react/?path=/story/krds-visually-hidden--text) · [Aria Association](/native/storybook-react/?path=/story/krds-visually-hidden--aria-association) · [Interactive Overlay](/native/storybook-react/?path=/story/krds-visually-hidden--interactive-overlay) · [Zoom](/native/storybook-react/?path=/story/krds-visually-hidden--zoom) · [Translated](/native/storybook-react/?path=/story/krds-visually-hidden--translated) · [Manual At](/native/storybook-react/?path=/story/krds-visually-hidden--manual-at).
- solid: [text](/native/storybook-solid/?path=/story/krds-visually-hidden--text) · [aria-association](/native/storybook-solid/?path=/story/krds-visually-hidden--aria-association) · [interactive-overlay](/native/storybook-solid/?path=/story/krds-visually-hidden--interactive-overlay) · [zoom](/native/storybook-solid/?path=/story/krds-visually-hidden--zoom) · [translated](/native/storybook-solid/?path=/story/krds-visually-hidden--translated) · [manual-at](/native/storybook-solid/?path=/story/krds-visually-hidden--manual-at).
- svelte: [text](/native/storybook-svelte/?path=/story/krds-visually-hidden--text) · [aria-association](/native/storybook-svelte/?path=/story/krds-visually-hidden--aria-association) · [interactive-overlay](/native/storybook-svelte/?path=/story/krds-visually-hidden--interactive-overlay) · [zoom](/native/storybook-svelte/?path=/story/krds-visually-hidden--zoom) · [translated](/native/storybook-svelte/?path=/story/krds-visually-hidden--translated) · [manual-at](/native/storybook-svelte/?path=/story/krds-visually-hidden--manual-at).
- vue: [text](/native/storybook-vue/?path=/story/krds-visually-hidden--text) · [aria-association](/native/storybook-vue/?path=/story/krds-visually-hidden--aria-association) · [interactive-overlay](/native/storybook-vue/?path=/story/krds-visually-hidden--interactive-overlay) · [zoom](/native/storybook-vue/?path=/story/krds-visually-hidden--zoom) · [translated](/native/storybook-vue/?path=/story/krds-visually-hidden--translated) · [manual-at](/native/storybook-vue/?path=/story/krds-visually-hidden--manual-at).
- lit: [Text](/native/storybook-lit/?path=/story/krds-visually-hidden--text) · [Aria Association](/native/storybook-lit/?path=/story/krds-visually-hidden--aria-association) · [Interactive Overlay](/native/storybook-lit/?path=/story/krds-visually-hidden--interactive-overlay) · [Zoom](/native/storybook-lit/?path=/story/krds-visually-hidden--zoom) · [Translated](/native/storybook-lit/?path=/story/krds-visually-hidden--translated) · [Manual At](/native/storybook-lit/?path=/story/krds-visually-hidden--manual-at).
- qwik: [text](/native/storybook-qwik/?path=/story/krds-visually-hidden--text) · [aria-association](/native/storybook-qwik/?path=/story/krds-visually-hidden--aria-association) · [interactive-overlay](/native/storybook-qwik/?path=/story/krds-visually-hidden--interactive-overlay) · [zoom](/native/storybook-qwik/?path=/story/krds-visually-hidden--zoom) · [translated](/native/storybook-qwik/?path=/story/krds-visually-hidden--translated) · [manual-at](/native/storybook-qwik/?path=/story/krds-visually-hidden--manual-at).
- angular: [text](/native/storybook-angular/?path=/story/krds-visually-hidden--text) · [aria-association](/native/storybook-angular/?path=/story/krds-visually-hidden--aria-association) · [interactive-overlay](/native/storybook-angular/?path=/story/krds-visually-hidden--interactive-overlay) · [zoom](/native/storybook-angular/?path=/story/krds-visually-hidden--zoom) · [translated](/native/storybook-angular/?path=/story/krds-visually-hidden--translated) · [manual-at](/native/storybook-angular/?path=/story/krds-visually-hidden--manual-at).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [read the checked consumer](/examples/svelte-50); [download exact source](/sources/apps/fixture-svelte/src/public-examples/VisuallyHiddenExample.svelte.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:05.828Z`. SHA-256: `85084e384fe08830d57e655107833ede6044760d3e4c83f20dc54ddd0c5488c6`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_11_02.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/index.md) before redistributing.
