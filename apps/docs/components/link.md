---
title: 'Link · 링크'
---

# Link

링크 · `Link` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_05_01.html) · [Full reviewed specification](/sources/specs/components/link.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/link/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.0.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/link/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/Link.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/link/Link.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/link/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/link/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-link.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface LinkContract {
    href: string;
    label: string;
    target?: string;
    rel?: string;
    disabled?: boolean;
    appearance?: 'basic' | 'emphasis';
    size?: Size;
    underline?: boolean;
}

export type Size = 'small' | 'medium' | 'large';
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `href` | yes | `string` | data / state |
| `label` | yes | `string` | data / state |
| `target` | no | `string` | data / state |
| `rel` | no | `string` | data / state |
| `disabled` | no | `boolean` | data / state |
| `appearance` | no | `'basic' \| 'emphasis'` | data / state |
| `size` | no | `Size` | data / state |
| `underline` | no | `boolean` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Actual &lt;a href> containing destination-specific label and optional decorative/external icon/underline. Inline size matches prose. Distinguish external destination and new-window behavior. Unavailable link omits href and is not a keyboard action.

### Plain semantic API

Independent API: href, target, rel, label/content, disabled=false, appearance=basic|emphasis, size=small|medium|large, underline=true except clear navigation contexts. disabled omits href and prevents all navigation/callbacks; do not keep stale clickable handlers.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Native Tab and Enter/click navigation, including modified click, context menu and open-new-tab. No Space-as-button handler. Same-document focus policy belongs to SkipLink/InPageNavigation rather than all links.

### Responsive/mobile requirements

Readable label and visible focus; recommended hit regions 17×17 pointer/44×44 touch apply with suitable layout, while inline links remain text flow.

### Forms, reset and composition

No form/reset/IME behavior.

### Asset, integration and composition completion

Host owns real destinations, tel:/mailto: values and external meaning. No automatic target=_blank except source-specific compositions requiring it. Native browser Link behavior must survive router integration.

### Stable parts and states

root, label, icon; disabled,external.

All rendered owned parts use `data-krds-component="link"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `standalone`, `inline`, `group`, `external`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-link--standalone`, `krds-link--inline`, `krds-link--group`, `krds-link--external`, `krds-link--disabled`, `krds-link--mailto-tel`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Standalone](/native/storybook-react/?path=/story/krds-link--standalone) · [Inline](/native/storybook-react/?path=/story/krds-link--inline) · [Group](/native/storybook-react/?path=/story/krds-link--group) · [External](/native/storybook-react/?path=/story/krds-link--external) · [Disabled](/native/storybook-react/?path=/story/krds-link--disabled) · [Mailto Tel](/native/storybook-react/?path=/story/krds-link--mailto-tel).
- solid: [standalone](/native/storybook-solid/?path=/story/krds-link--standalone) · [inline](/native/storybook-solid/?path=/story/krds-link--inline) · [group](/native/storybook-solid/?path=/story/krds-link--group) · [external](/native/storybook-solid/?path=/story/krds-link--external) · [disabled](/native/storybook-solid/?path=/story/krds-link--disabled) · [mailto-tel](/native/storybook-solid/?path=/story/krds-link--mailto-tel).
- svelte: [standalone](/native/storybook-svelte/?path=/story/krds-link--standalone) · [inline](/native/storybook-svelte/?path=/story/krds-link--inline) · [group](/native/storybook-svelte/?path=/story/krds-link--group) · [external](/native/storybook-svelte/?path=/story/krds-link--external) · [disabled](/native/storybook-svelte/?path=/story/krds-link--disabled) · [mailto-tel](/native/storybook-svelte/?path=/story/krds-link--mailto-tel).
- vue: [standalone](/native/storybook-vue/?path=/story/krds-link--standalone) · [inline](/native/storybook-vue/?path=/story/krds-link--inline) · [group](/native/storybook-vue/?path=/story/krds-link--group) · [external](/native/storybook-vue/?path=/story/krds-link--external) · [disabled](/native/storybook-vue/?path=/story/krds-link--disabled) · [mailto-tel](/native/storybook-vue/?path=/story/krds-link--mailto-tel).
- lit: [Standalone](/native/storybook-lit/?path=/story/krds-link--standalone) · [Inline](/native/storybook-lit/?path=/story/krds-link--inline) · [Group](/native/storybook-lit/?path=/story/krds-link--group) · [External](/native/storybook-lit/?path=/story/krds-link--external) · [Disabled](/native/storybook-lit/?path=/story/krds-link--disabled) · [Mailto Tel](/native/storybook-lit/?path=/story/krds-link--mailto-tel).
- qwik: [standalone](/native/storybook-qwik/?path=/story/krds-link--standalone) · [inline](/native/storybook-qwik/?path=/story/krds-link--inline) · [group](/native/storybook-qwik/?path=/story/krds-link--group) · [external](/native/storybook-qwik/?path=/story/krds-link--external) · [disabled](/native/storybook-qwik/?path=/story/krds-link--disabled) · [mailto-tel](/native/storybook-qwik/?path=/story/krds-link--mailto-tel).
- angular: [standalone](/native/storybook-angular/?path=/story/krds-link--standalone) · [inline](/native/storybook-angular/?path=/story/krds-link--inline) · [group](/native/storybook-angular/?path=/story/krds-link--group) · [external](/native/storybook-angular/?path=/story/krds-link--external) · [disabled](/native/storybook-angular/?path=/story/krds-link--disabled) · [mailto-tel](/native/storybook-angular/?path=/story/krds-link--mailto-tel).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-27); [download exact source](/sources/apps/fixture-svelte/src/public-examples/LinkExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:04.183Z`. SHA-256: `5dd23146a2c35cd36a52f4658c457abd8c1f3f934ce62d5c9d93fcea288ce5b5`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_05_01.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
