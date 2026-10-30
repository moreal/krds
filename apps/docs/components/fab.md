---
title: 'FAB · 플로팅 버튼'
---

# FAB

플로팅 버튼 · `FAB` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_05_03.html) · [Full reviewed specification](/sources/specs/components/fab.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [exact subpath types](/sources/packages/react/dist/components/fab/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.1.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/fab/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/FAB.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/fab/FAB.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/fab/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/fab/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-fab.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.1.0-preview.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface FABContract {
    label: string;
    icon: string;
    showLabel?: boolean;
    disabled?: boolean;
    onAction?: () => void;
    expanded?: boolean;
    defaultExpanded?: boolean;
    onExpandedChange?: (detail: {
        expanded: boolean;
    }) => void;
    actions?: readonly {
        id: string;
        label: string;
        onAction: () => void;
    }[];
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `label` | yes | `string` | data / state |
| `icon` | yes | `string` | data / state |
| `showLabel` | no | `boolean` | data / state |
| `disabled` | no | `boolean` | data / state |
| `onAction` | no | `() => void` | semantic event request |
| `expanded` | no | `boolean` | data / state |
| `defaultExpanded` | no | `boolean` | data / state |
| `onExpandedChange` | no | `(detail: {expanded: boolean}) => void` | semantic event request |
| `actions` | no | `readonly {id: string; label: string; onAction: () => void}[]` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Fixed bottom-right named action button with icon and optional label; expandable form adds overlay/shadow, expand/close trigger and at most three related actions at &lt;=2 levels. Above bottom TabBar, without covering critical content.

### Plain semantic API

Independent API: required accessible label, onAction(), icon, showLabel=true, expanded/defaultExpanded=false, onExpandedChange({expanded}), actions {id,label,onAction}[] for expandable mode. Trigger type=button; expansion is separate from executing a leaf action.

`showLabel?: boolean` controls only the optional visible primary label. Omission retains the existing visible-label presentation (`true`). When `false`, render the icon-only presentation while preserving the required `label` as the real button's accessible name; decorative icon content is not a replacement name. The label part is not visibly rendered. Related actions still determine expandable behavior independently of label visibility. Changing label visibility emits no action or expansion callback and does not change the action, expansion state or focus. This is a plain independent presentation policy, not an additional official behavior variant. The single-icon local story supplies `showLabel:false`; extended-label supplies `true`; adapters must read the actual prop rather than story IDs.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Independent native policy: all buttons named and keyboard-operable by Enter/Space, trigger aria-expanded/controls. Tab visits expanded actions; Escape collapses and returns trigger. Closed actions untabbable; no modal trap unless explicitly composed as modal.

### Responsive/mobile requirements

Respect bottom safe area/tabbar clearance and zoom. Gesture-intensive pages should avoid overlay obstruction. Reduced motion disables decorative expansion animation.

### Forms, reset and composition

No form value/reset; never submit host form by default.

### Asset, integration and composition completion

Host supplies real primary action; no auth/network in component. Completion needs functioning single and expandable local actions, overlay placement and cleanup.

### Stable parts and states

root, trigger, icon, label, overlay, actions, action; expanded,collapsed,disabled.

All rendered owned parts use `data-krds-component="fab"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `single-icon`, `extended-label`, `expandable`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-fab--single-icon`, `krds-fab--extended-label`, `krds-fab--expandable`, `krds-fab--tabbar-clearance`, `krds-fab--narrow`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Single Icon](/native/storybook-react/?path=/story/krds-fab--single-icon) · [Extended Label](/native/storybook-react/?path=/story/krds-fab--extended-label) · [Expandable](/native/storybook-react/?path=/story/krds-fab--expandable) · [Tabbar Clearance](/native/storybook-react/?path=/story/krds-fab--tabbar-clearance) · [Narrow](/native/storybook-react/?path=/story/krds-fab--narrow).
- solid: [single-icon](/native/storybook-solid/?path=/story/krds-fab--single-icon) · [extended-label](/native/storybook-solid/?path=/story/krds-fab--extended-label) · [expandable](/native/storybook-solid/?path=/story/krds-fab--expandable) · [tabbar-clearance](/native/storybook-solid/?path=/story/krds-fab--tabbar-clearance) · [narrow](/native/storybook-solid/?path=/story/krds-fab--narrow).
- svelte: [single-icon](/native/storybook-svelte/?path=/story/krds-fab--single-icon) · [extended-label](/native/storybook-svelte/?path=/story/krds-fab--extended-label) · [expandable](/native/storybook-svelte/?path=/story/krds-fab--expandable) · [tabbar-clearance](/native/storybook-svelte/?path=/story/krds-fab--tabbar-clearance) · [narrow](/native/storybook-svelte/?path=/story/krds-fab--narrow).
- vue: [single-icon](/native/storybook-vue/?path=/story/krds-fab--single-icon) · [extended-label](/native/storybook-vue/?path=/story/krds-fab--extended-label) · [expandable](/native/storybook-vue/?path=/story/krds-fab--expandable) · [tabbar-clearance](/native/storybook-vue/?path=/story/krds-fab--tabbar-clearance) · [narrow](/native/storybook-vue/?path=/story/krds-fab--narrow).
- lit: [Single Icon](/native/storybook-lit/?path=/story/krds-fab--single-icon) · [Extended Label](/native/storybook-lit/?path=/story/krds-fab--extended-label) · [Expandable](/native/storybook-lit/?path=/story/krds-fab--expandable) · [Tabbar Clearance](/native/storybook-lit/?path=/story/krds-fab--tabbar-clearance) · [Narrow](/native/storybook-lit/?path=/story/krds-fab--narrow).
- qwik: [single-icon](/native/storybook-qwik/?path=/story/krds-fab--single-icon) · [extended-label](/native/storybook-qwik/?path=/story/krds-fab--extended-label) · [expandable](/native/storybook-qwik/?path=/story/krds-fab--expandable) · [tabbar-clearance](/native/storybook-qwik/?path=/story/krds-fab--tabbar-clearance) · [narrow](/native/storybook-qwik/?path=/story/krds-fab--narrow).
- angular: [single-icon](/native/storybook-angular/?path=/story/krds-fab--single-icon) · [extended-label](/native/storybook-angular/?path=/story/krds-fab--extended-label) · [expandable](/native/storybook-angular/?path=/story/krds-fab--expandable) · [tabbar-clearance](/native/storybook-angular/?path=/story/krds-fab--tabbar-clearance) · [narrow](/native/storybook-angular/?path=/story/krds-fab--narrow).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [read the checked consumer](/examples/svelte-29); [download exact source](/sources/apps/fixture-svelte/src/public-examples/FABExample.svelte.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:04.322Z`. SHA-256: `ed0e344ae805288e065b84646ec4237e68dc9fdf5c8b935744c83b8f55699863`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_05_03.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
