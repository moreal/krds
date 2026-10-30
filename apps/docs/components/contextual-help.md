---
title: 'Contextual help · 맥락적 도움말'
---

# Contextual help

맥락적 도움말 · `ContextualHelp` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_08_03.html) · [Full reviewed specification](/sources/specs/components/contextual-help.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/contextual-help/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.0.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/contextual-help/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/ContextualHelp.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/contextual-help/ContextualHelp.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/contextual-help/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/contextual-help/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-contextual-help.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface ContextualHelpContract extends ControlledOpen {
    title: string;
    content: string;
    variant?: 'information' | 'help';
    placement?: HelpPlacement;
    triggerLabel: string;
    relatedId?: string;
    fallbackFocusId?: string;
}

export interface ControlledOpen {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (detail: OpenChangeDetails) => void;
}

export interface OpenChangeDetails {
    open: boolean;
}

export type HelpPlacement = 'top-start' | 'top' | 'top-end' | 'bottom-start' | 'bottom' | 'bottom-end';
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `open` | no | `boolean` | data / state |
| `defaultOpen` | no | `boolean` | data / state |
| `onOpenChange` | no | `(detail: OpenChangeDetails) => void` | semantic event request |
| `title` | yes | `string` | data / state |
| `content` | yes | `string` | data / state |
| `variant` | no | `'information' \| 'help'` | data / state |
| `placement` | no | `HelpPlacement` | data / state |
| `triggerLabel` | yes | `string` | data / state |
| `relatedId` | no | `string` | data / state |
| `fallbackFocusId` | no | `string` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Named info/question button adjacent to associated field/label, followed immediately in DOM by popover: title, body with optional links and close button. No nested help/modal, no required task information hidden only here.

### Plain semantic API

Independent API: open/defaultOpen=false, onOpenChange({open}), title, content, variant=information|help, placement=bottom-start default (official six alignments mapped), triggerLabel, relatedId. Native button aria-expanded/controls; labeled nonmodal popover region; no tooltip role for interactive content.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Click/Enter/Space opens/toggles. If links present, opening focuses first interactive element. Tab can leave (no trap). Outside click, Escape or trigger toggle closes and returns trigger per official table; Escape ignores composing/handled events. Removed trigger falls back to supplied usable return target then body. Restore only on accepted actual close.

### Responsive/mobile requirements

Collision flip/shift keeps whole popup onscreen and does not cover trigger/important target. Scroll content if viewport very small; no opaque clipping at 200–400% zoom.

### Forms, reset and composition

No form state; help buttons type=button, composition Escape is ignored.

### Asset, integration and composition completion

Host owns short contextual content/new-window links and avoids simultaneous HelpPanel in same task. Completion requires actual interactive-link focus, close and reposition behavior.

### Stable parts and states

root, trigger, icon, popover, title, body, close; open,closed,placement.

All rendered owned parts use `data-krds-component="contextual-help"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `information`, `help`, `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-contextual-help--information`, `krds-contextual-help--help`, `krds-contextual-help--six-placements`, `krds-contextual-help--interactive-link`, `krds-contextual-help--narrow-edge`, `krds-contextual-help--removed-trigger`, `krds-contextual-help--controlled-rejected`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Information](/native/storybook-react/?path=/story/krds-contextual-help--information) · [Help](/native/storybook-react/?path=/story/krds-contextual-help--help) · [Six Placements](/native/storybook-react/?path=/story/krds-contextual-help--six-placements) · [Interactive Link](/native/storybook-react/?path=/story/krds-contextual-help--interactive-link) · [Narrow Edge](/native/storybook-react/?path=/story/krds-contextual-help--narrow-edge) · [Removed Trigger](/native/storybook-react/?path=/story/krds-contextual-help--removed-trigger) · [Controlled Rejected](/native/storybook-react/?path=/story/krds-contextual-help--controlled-rejected).
- solid: [information](/native/storybook-solid/?path=/story/krds-contextual-help--information) · [help](/native/storybook-solid/?path=/story/krds-contextual-help--help) · [six-placements](/native/storybook-solid/?path=/story/krds-contextual-help--six-placements) · [interactive-link](/native/storybook-solid/?path=/story/krds-contextual-help--interactive-link) · [narrow-edge](/native/storybook-solid/?path=/story/krds-contextual-help--narrow-edge) · [removed-trigger](/native/storybook-solid/?path=/story/krds-contextual-help--removed-trigger) · [controlled-rejected](/native/storybook-solid/?path=/story/krds-contextual-help--controlled-rejected).
- svelte: [information](/native/storybook-svelte/?path=/story/krds-contextual-help--information) · [help](/native/storybook-svelte/?path=/story/krds-contextual-help--help) · [six-placements](/native/storybook-svelte/?path=/story/krds-contextual-help--six-placements) · [interactive-link](/native/storybook-svelte/?path=/story/krds-contextual-help--interactive-link) · [narrow-edge](/native/storybook-svelte/?path=/story/krds-contextual-help--narrow-edge) · [removed-trigger](/native/storybook-svelte/?path=/story/krds-contextual-help--removed-trigger) · [controlled-rejected](/native/storybook-svelte/?path=/story/krds-contextual-help--controlled-rejected).
- vue: [information](/native/storybook-vue/?path=/story/krds-contextual-help--information) · [help](/native/storybook-vue/?path=/story/krds-contextual-help--help) · [six-placements](/native/storybook-vue/?path=/story/krds-contextual-help--six-placements) · [interactive-link](/native/storybook-vue/?path=/story/krds-contextual-help--interactive-link) · [narrow-edge](/native/storybook-vue/?path=/story/krds-contextual-help--narrow-edge) · [removed-trigger](/native/storybook-vue/?path=/story/krds-contextual-help--removed-trigger) · [controlled-rejected](/native/storybook-vue/?path=/story/krds-contextual-help--controlled-rejected).
- lit: [Information](/native/storybook-lit/?path=/story/krds-contextual-help--information) · [Help](/native/storybook-lit/?path=/story/krds-contextual-help--help) · [Six Placements](/native/storybook-lit/?path=/story/krds-contextual-help--six-placements) · [Interactive Link](/native/storybook-lit/?path=/story/krds-contextual-help--interactive-link) · [Narrow Edge](/native/storybook-lit/?path=/story/krds-contextual-help--narrow-edge) · [Removed Trigger](/native/storybook-lit/?path=/story/krds-contextual-help--removed-trigger) · [Controlled Rejected](/native/storybook-lit/?path=/story/krds-contextual-help--controlled-rejected).
- qwik: [information](/native/storybook-qwik/?path=/story/krds-contextual-help--information) · [help](/native/storybook-qwik/?path=/story/krds-contextual-help--help) · [six-placements](/native/storybook-qwik/?path=/story/krds-contextual-help--six-placements) · [interactive-link](/native/storybook-qwik/?path=/story/krds-contextual-help--interactive-link) · [narrow-edge](/native/storybook-qwik/?path=/story/krds-contextual-help--narrow-edge) · [removed-trigger](/native/storybook-qwik/?path=/story/krds-contextual-help--removed-trigger) · [controlled-rejected](/native/storybook-qwik/?path=/story/krds-contextual-help--controlled-rejected).
- angular: [information](/native/storybook-angular/?path=/story/krds-contextual-help--information) · [help](/native/storybook-angular/?path=/story/krds-contextual-help--help) · [six-placements](/native/storybook-angular/?path=/story/krds-contextual-help--six-placements) · [interactive-link](/native/storybook-angular/?path=/story/krds-contextual-help--interactive-link) · [narrow-edge](/native/storybook-angular/?path=/story/krds-contextual-help--narrow-edge) · [removed-trigger](/native/storybook-angular/?path=/story/krds-contextual-help--removed-trigger) · [controlled-rejected](/native/storybook-angular/?path=/story/krds-contextual-help--controlled-rejected).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-39); [download exact source](/sources/apps/fixture-svelte/src/public-examples/ContextualHelpExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:05.025Z`. SHA-256: `13d1fe66ded72ef2b1492db7e2d7d549457511c87b12003ced10f78c96637531`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_08_03.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
