---
title: 'Skip link · 건너뛰기 링크'
---

# Skip link

건너뛰기 링크 · `SkipLink` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_03_01.html) · [Full reviewed specification](/sources/specs/components/skip-link.md.txt) · [Framework support](../compatibility/README.md)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/skip-link/index.d.ts.txt) | [react sources and preview policy](../compatibility/README.mdexamples#react) |
| solid | `0.0.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/skip-link/index.d.ts.txt) | [solid sources and preview policy](../compatibility/README.mdexamples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/SkipLink.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/README.mdexamples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/skip-link/SkipLink.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/README.mdexamples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/skip-link/index.d.ts.txt) | [lit sources and preview policy](../compatibility/README.mdexamples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/skip-link/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/README.mdexamples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-skip-link.d.ts.txt) | [angular sources and preview policy](../compatibility/README.mdexamples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/README.mdexamples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface SkipLinkContract {
    links: readonly {
        id: string;
        label: string;
        targetId: string;
    }[];
    visibility?: 'focus-revealed' | 'visible';
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `links` | yes | `readonly {id: string; label: string; targetId: string}[]` | data / state |
| `visibility` | no | `'focus-revealed' \| 'visible'` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Real same-document anchors in a list before Masthead and header. Main-content link comes first and targets content excluding side navigation/breadcrumb/utilities. No more than three links; omit on pages with no repeated region. Focus-revealed is the proposed default.

### Plain semantic API

Independent API: SkipLink accepts links {id,label,targetId}[] (one main target normally), visibility=focus-revealed|visible. Target IDs must resolve in the same document/root strategy; report invalid targets during development rather than silently linking #.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Enter scrolls and focuses destination section/title; use temporary tabindex=-1 on nonfocusable destination without adding it to normal tab order. Next Tab starts at its first interactive descendant. Tap scrolls; screen-reader virtual navigation needs manual verification. Focus reveal must expose an unobscured focus ring.

### Responsive/mobile requirements

Required web behavior remains on mobile web; native-app exception is not a mobile-web exclusion. Keep links readable/above sticky content and honor reduced-motion scrolling.

### Forms, reset and composition

No form value/reset/IME behavior.

### Asset, integration and composition completion

Host supplies stable target IDs and meaningful content landmarks. Lit shadow boundaries require explicit target registration or light-DOM anchor resolution; raw document.getElementById assumptions must not cross closed roots.

### Stable parts and states

root, list, item, link; focus-visible.

All rendered owned parts use `data-krds-component="skip-link"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `visible`, `focus-revealed`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-skip-link--visible`, `krds-skip-link--focus-revealed`, `krds-skip-link--three-targets`, `krds-skip-link--sticky-page`, `krds-skip-link--shadow-target`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Visible](/native/storybook-react/?path=/story/krds-skip-link--visible) · [Focus Revealed](/native/storybook-react/?path=/story/krds-skip-link--focus-revealed) · [Three Targets](/native/storybook-react/?path=/story/krds-skip-link--three-targets) · [Sticky Page](/native/storybook-react/?path=/story/krds-skip-link--sticky-page) · [Shadow Target](/native/storybook-react/?path=/story/krds-skip-link--shadow-target).
- solid: [visible](/native/storybook-solid/?path=/story/krds-skip-link--visible) · [focus-revealed](/native/storybook-solid/?path=/story/krds-skip-link--focus-revealed) · [three-targets](/native/storybook-solid/?path=/story/krds-skip-link--three-targets) · [sticky-page](/native/storybook-solid/?path=/story/krds-skip-link--sticky-page) · [shadow-target](/native/storybook-solid/?path=/story/krds-skip-link--shadow-target).
- svelte: [visible](/native/storybook-svelte/?path=/story/krds-skip-link--visible) · [focus-revealed](/native/storybook-svelte/?path=/story/krds-skip-link--focus-revealed) · [three-targets](/native/storybook-svelte/?path=/story/krds-skip-link--three-targets) · [sticky-page](/native/storybook-svelte/?path=/story/krds-skip-link--sticky-page) · [shadow-target](/native/storybook-svelte/?path=/story/krds-skip-link--shadow-target).
- vue: [visible](/native/storybook-vue/?path=/story/krds-skip-link--visible) · [focus-revealed](/native/storybook-vue/?path=/story/krds-skip-link--focus-revealed) · [three-targets](/native/storybook-vue/?path=/story/krds-skip-link--three-targets) · [sticky-page](/native/storybook-vue/?path=/story/krds-skip-link--sticky-page) · [shadow-target](/native/storybook-vue/?path=/story/krds-skip-link--shadow-target).
- lit: [Visible](/native/storybook-lit/?path=/story/krds-skip-link--visible) · [Focus Revealed](/native/storybook-lit/?path=/story/krds-skip-link--focus-revealed) · [Three Targets](/native/storybook-lit/?path=/story/krds-skip-link--three-targets) · [Sticky Page](/native/storybook-lit/?path=/story/krds-skip-link--sticky-page) · [Shadow Target](/native/storybook-lit/?path=/story/krds-skip-link--shadow-target).
- qwik: [visible](/native/storybook-qwik/?path=/story/krds-skip-link--visible) · [focus-revealed](/native/storybook-qwik/?path=/story/krds-skip-link--focus-revealed) · [three-targets](/native/storybook-qwik/?path=/story/krds-skip-link--three-targets) · [sticky-page](/native/storybook-qwik/?path=/story/krds-skip-link--sticky-page) · [shadow-target](/native/storybook-qwik/?path=/story/krds-skip-link--shadow-target).
- angular: [visible](/native/storybook-angular/?path=/story/krds-skip-link--visible) · [focus-revealed](/native/storybook-angular/?path=/story/krds-skip-link--focus-revealed) · [three-targets](/native/storybook-angular/?path=/story/krds-skip-link--three-targets) · [sticky-page](/native/storybook-angular/?path=/story/krds-skip-link--sticky-page) · [shadow-target](/native/storybook-angular/?path=/story/krds-skip-link--shadow-target).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-8); [download exact source](/sources/apps/fixture-svelte/src/public-examples/SkipLinkExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:02.834Z`. SHA-256: `f11cdbee2d0ac2d8831ed8acb0daea45152f98ffc9d08571cce00f755122297e`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_03_01.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/index.md) before redistributing.
