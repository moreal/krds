---
title: 'Tooltip · 툴팁'
---

# Tooltip

툴팁 · `Tooltip` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_08_05.html) · [Full reviewed specification](/sources/specs/components/tooltip.md.txt) · [Framework support](../compatibility/README.md)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [exact subpath types](/sources/packages/react/dist/components/tooltip/index.d.ts.txt) | [react sources and preview policy](../compatibility/README.mdexamples#react) |
| solid | `0.1.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/tooltip/index.d.ts.txt) | [solid sources and preview policy](../compatibility/README.mdexamples#solid) |
| svelte | `0.1.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/Tooltip.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/README.mdexamples#svelte) |
| vue | `0.1.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/tooltip/Tooltip.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/README.mdexamples#vue) |
| lit | `0.1.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/tooltip/index.d.ts.txt) | [lit sources and preview policy](../compatibility/README.mdexamples#lit) |
| qwik | `0.1.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/tooltip/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/README.mdexamples#qwik) |
| angular | `0.1.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-tooltip.d.ts.txt) | [angular sources and preview policy](../compatibility/README.mdexamples#angular) |
| solid-next (preview) | `0.1.0-preview.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/README.mdexamples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface TooltipContract extends ControlledOpen {
    text: string;
    relationship?: 'description' | 'label';
    triggerLabel?: string;
    triggerId: string;
    textId: string;
    placement?: HelpPlacement;
    fallbackFocusId?: string;
    touchToggle?: boolean;
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
| `text` | yes | `string` | data / state |
| `relationship` | no | `'description' \| 'label'` | data / state |
| `triggerLabel` | no | `string` | data / state |
| `triggerId` | yes | `string` | data / state |
| `textId` | yes | `string` | data / state |
| `placement` | no | `HelpPlacement` | data / state |
| `fallbackFocusId` | no | `string` | data / state |
| `touchToggle` | no | `boolean` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Named trigger button immediately followed by short noninteractive popup; no links/buttons inside tooltip. Informational icon vs icon-button label tooltip are different use cases. Do not duplicate HTML title. Source explicitly says aria-labelledby connects trigger/container; exact direction is not stated.

### Plain semantic API

Independent API: `text`, `relationship:description|label=description`, `triggerLabel?`, `triggerId`, `textId`, placement, open/defaultOpen=false, onOpenChange, `fallbackFocusId?`, touchToggle=false unless distinct info trigger. Popup role=tooltip and content is noninteractive. The relationship discriminator is mandatory semantic behavior, not inferred from icon appearance or whichever attributes a renderer happens to choose.

In **description** mode require an independent functional/contextual triggerLabel (or equivalent validated native visible name); it remains the actual trigger name. Add textId exactly once to that trigger's aria-describedby; do not set its aria-labelledby from explanatory tooltip text. In **label** mode text must itself be the stable functional button name; trigger aria-labelledby points to textId, triggerLabel/alternate aria-label is not allowed, and the same text is not also aria-describedby. Retain the actual textId node in the same accessible tree/root while the visual popup is closed so the functional name exists before opening; visual hiding is not unmounting that referenced text. Avoid a second duplicate hidden label/live message. Consumers with other help descriptions retain distinct valid IDs without repeating textId.

Both modes require real resolved trigger/text relationships in their actual root, including Lit Shadow DOM; do not assume a light-DOM ID can name an internal control across a boundary. Use a same-root owned trigger/text relationship or a proven native equivalent, and fail invalid unresolved configuration. The literal official aria-labelledby wording ([L1163–1164](https://www.krds.go.kr/html/site/component/component_08_05.html)) remains quoted below; description-mode aria-describedby is an explicit independent interpretation of supplementary content, not a claimed literal KRDS instruction. Controlled props/defaults/reset/no-duplicate rules remain the [pilot policy](/sources/specs/components/README.md.txt).

### Keyboard, focus and state transitions

Hover/focus shows; pointer leave of both trigger+popup or blur hides. Ordinary hover opening never steals keyboard focus from elsewhere. Pointer may travel into the popup without closing. Touch distinct info-button click toggles and outside tap closes; primary icon action is not swallowed. Popup has no Tab stops.

For a processed Escape, request close once, ignoring composing/keyCode229 and inner-handled events. **Only on accepted actual closure**, mark Escape suppression before moving focus, then focus the usable trigger even when the tooltip was hover-open and focus previously lay elsewhere ([official L1251–1255](https://www.krds.go.kr/html/site/component/component_08_05.html)). The induced trigger focus must not reopen it. Suppress automatic hover/focus reopening until Tab/Shift+Tab departs that trigger to another element and focus subsequently reenters; pointer movement or a prop change alone does not satisfy that reset. If controlled close is rejected, keep actual open state and do not transfer focus or claim successful dismissal.

If the trigger is removed/unusable by accepted close or teardown, clean listeners/pending requests and choose usable fallbackFocusId, then the saved trigger's nearest usable focusable ancestor, then the live document body using temporary tabindex=-1 and restoring its prior value. Usable means mounted, visible, enabled, focusable, same live document and not inert. Do not focus hidden/removed trigger nodes, run stale generation focus work, or emit an extra user event from restoration. External prop closure alone does not pretend to be an Escape action.

### Responsive/mobile requirements

Collision-aware popup completely onscreen and not covering target; touch users still have meaningful icon/label. Keep about 150 characters; longer interactive content goes to ContextualHelp.

### Forms, reset and composition

No form/reset state; Enter/Space activation belongs trigger action, not tooltip; ignore composing Escape.

### Asset, integration and composition completion

Host supplies meaningful functional text for label mode and a separate functional trigger name plus supplementary text for description mode. Completion requires deterministic computed name/description before, during and after visual opening; real same-root/Shadow DOM relationships; hover/focus/touch/Escape suppression; and the hover-origin Escape return/fallback/rejected-close cases. Rendering title text or merely storing an ID string does not establish those native relationships.

### Stable parts and states

root, trigger, popup, icon, text; open,closed,suppressed,placement.

All rendered owned parts use `data-krds-component="tooltip"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `information-icon`, `icon-button`, `vertical`, `box`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-tooltip--information-icon`, `krds-tooltip--icon-button`, `krds-tooltip--vertical`, `krds-tooltip--box`, `krds-tooltip--touch-toggle`, `krds-tooltip--escape-suppression`, `krds-tooltip--viewport-edge`, `krds-tooltip--relationship-description`, `krds-tooltip--relationship-label-closed`, `krds-tooltip--hover-escape-return`, `krds-tooltip--controlled-escape-rejected`, `krds-tooltip--trigger-removed`, `krds-tooltip--shadow-relationship`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Information Icon](/native/storybook-react/?path=/story/krds-tooltip--information-icon) · [Icon Button](/native/storybook-react/?path=/story/krds-tooltip--icon-button) · [Vertical](/native/storybook-react/?path=/story/krds-tooltip--vertical) · [Box](/native/storybook-react/?path=/story/krds-tooltip--box) · [Touch Toggle](/native/storybook-react/?path=/story/krds-tooltip--touch-toggle) · [Escape Suppression](/native/storybook-react/?path=/story/krds-tooltip--escape-suppression) · [Viewport Edge](/native/storybook-react/?path=/story/krds-tooltip--viewport-edge) · [Relationship Description](/native/storybook-react/?path=/story/krds-tooltip--relationship-description) · [Relationship Label Closed](/native/storybook-react/?path=/story/krds-tooltip--relationship-label-closed) · [Hover Escape Return](/native/storybook-react/?path=/story/krds-tooltip--hover-escape-return) · [Controlled Escape Rejected](/native/storybook-react/?path=/story/krds-tooltip--controlled-escape-rejected) · [Trigger Removed](/native/storybook-react/?path=/story/krds-tooltip--trigger-removed) · [Shadow Relationship](/native/storybook-react/?path=/story/krds-tooltip--shadow-relationship).
- solid: [information-icon](/native/storybook-solid/?path=/story/krds-tooltip--information-icon) · [icon-button](/native/storybook-solid/?path=/story/krds-tooltip--icon-button) · [vertical](/native/storybook-solid/?path=/story/krds-tooltip--vertical) · [box](/native/storybook-solid/?path=/story/krds-tooltip--box) · [touch-toggle](/native/storybook-solid/?path=/story/krds-tooltip--touch-toggle) · [escape-suppression](/native/storybook-solid/?path=/story/krds-tooltip--escape-suppression) · [viewport-edge](/native/storybook-solid/?path=/story/krds-tooltip--viewport-edge) · [relationship-description](/native/storybook-solid/?path=/story/krds-tooltip--relationship-description) · [relationship-label-closed](/native/storybook-solid/?path=/story/krds-tooltip--relationship-label-closed) · [hover-escape-return](/native/storybook-solid/?path=/story/krds-tooltip--hover-escape-return) · [controlled-escape-rejected](/native/storybook-solid/?path=/story/krds-tooltip--controlled-escape-rejected) · [trigger-removed](/native/storybook-solid/?path=/story/krds-tooltip--trigger-removed) · [shadow-relationship](/native/storybook-solid/?path=/story/krds-tooltip--shadow-relationship).
- svelte: [information-icon](/native/storybook-svelte/?path=/story/krds-tooltip--information-icon) · [icon-button](/native/storybook-svelte/?path=/story/krds-tooltip--icon-button) · [vertical](/native/storybook-svelte/?path=/story/krds-tooltip--vertical) · [box](/native/storybook-svelte/?path=/story/krds-tooltip--box) · [touch-toggle](/native/storybook-svelte/?path=/story/krds-tooltip--touch-toggle) · [escape-suppression](/native/storybook-svelte/?path=/story/krds-tooltip--escape-suppression) · [viewport-edge](/native/storybook-svelte/?path=/story/krds-tooltip--viewport-edge) · [relationship-description](/native/storybook-svelte/?path=/story/krds-tooltip--relationship-description) · [relationship-label-closed](/native/storybook-svelte/?path=/story/krds-tooltip--relationship-label-closed) · [hover-escape-return](/native/storybook-svelte/?path=/story/krds-tooltip--hover-escape-return) · [controlled-escape-rejected](/native/storybook-svelte/?path=/story/krds-tooltip--controlled-escape-rejected) · [trigger-removed](/native/storybook-svelte/?path=/story/krds-tooltip--trigger-removed) · [shadow-relationship](/native/storybook-svelte/?path=/story/krds-tooltip--shadow-relationship).
- vue: [information-icon](/native/storybook-vue/?path=/story/krds-tooltip--information-icon) · [icon-button](/native/storybook-vue/?path=/story/krds-tooltip--icon-button) · [vertical](/native/storybook-vue/?path=/story/krds-tooltip--vertical) · [box](/native/storybook-vue/?path=/story/krds-tooltip--box) · [touch-toggle](/native/storybook-vue/?path=/story/krds-tooltip--touch-toggle) · [escape-suppression](/native/storybook-vue/?path=/story/krds-tooltip--escape-suppression) · [viewport-edge](/native/storybook-vue/?path=/story/krds-tooltip--viewport-edge) · [relationship-description](/native/storybook-vue/?path=/story/krds-tooltip--relationship-description) · [relationship-label-closed](/native/storybook-vue/?path=/story/krds-tooltip--relationship-label-closed) · [hover-escape-return](/native/storybook-vue/?path=/story/krds-tooltip--hover-escape-return) · [controlled-escape-rejected](/native/storybook-vue/?path=/story/krds-tooltip--controlled-escape-rejected) · [trigger-removed](/native/storybook-vue/?path=/story/krds-tooltip--trigger-removed) · [shadow-relationship](/native/storybook-vue/?path=/story/krds-tooltip--shadow-relationship).
- lit: [Information Icon](/native/storybook-lit/?path=/story/krds-tooltip--information-icon) · [Icon Button](/native/storybook-lit/?path=/story/krds-tooltip--icon-button) · [Vertical](/native/storybook-lit/?path=/story/krds-tooltip--vertical) · [Box](/native/storybook-lit/?path=/story/krds-tooltip--box) · [Touch Toggle](/native/storybook-lit/?path=/story/krds-tooltip--touch-toggle) · [Escape Suppression](/native/storybook-lit/?path=/story/krds-tooltip--escape-suppression) · [Viewport Edge](/native/storybook-lit/?path=/story/krds-tooltip--viewport-edge) · [Relationship Description](/native/storybook-lit/?path=/story/krds-tooltip--relationship-description) · [Relationship Label Closed](/native/storybook-lit/?path=/story/krds-tooltip--relationship-label-closed) · [Hover Escape Return](/native/storybook-lit/?path=/story/krds-tooltip--hover-escape-return) · [Controlled Escape Rejected](/native/storybook-lit/?path=/story/krds-tooltip--controlled-escape-rejected) · [Trigger Removed](/native/storybook-lit/?path=/story/krds-tooltip--trigger-removed) · [Shadow Relationship](/native/storybook-lit/?path=/story/krds-tooltip--shadow-relationship).
- qwik: [information-icon](/native/storybook-qwik/?path=/story/krds-tooltip--information-icon) · [icon-button](/native/storybook-qwik/?path=/story/krds-tooltip--icon-button) · [vertical](/native/storybook-qwik/?path=/story/krds-tooltip--vertical) · [box](/native/storybook-qwik/?path=/story/krds-tooltip--box) · [touch-toggle](/native/storybook-qwik/?path=/story/krds-tooltip--touch-toggle) · [escape-suppression](/native/storybook-qwik/?path=/story/krds-tooltip--escape-suppression) · [viewport-edge](/native/storybook-qwik/?path=/story/krds-tooltip--viewport-edge) · [relationship-description](/native/storybook-qwik/?path=/story/krds-tooltip--relationship-description) · [relationship-label-closed](/native/storybook-qwik/?path=/story/krds-tooltip--relationship-label-closed) · [hover-escape-return](/native/storybook-qwik/?path=/story/krds-tooltip--hover-escape-return) · [controlled-escape-rejected](/native/storybook-qwik/?path=/story/krds-tooltip--controlled-escape-rejected) · [trigger-removed](/native/storybook-qwik/?path=/story/krds-tooltip--trigger-removed) · [shadow-relationship](/native/storybook-qwik/?path=/story/krds-tooltip--shadow-relationship).
- angular: [information-icon](/native/storybook-angular/?path=/story/krds-tooltip--information-icon) · [icon-button](/native/storybook-angular/?path=/story/krds-tooltip--icon-button) · [vertical](/native/storybook-angular/?path=/story/krds-tooltip--vertical) · [box](/native/storybook-angular/?path=/story/krds-tooltip--box) · [touch-toggle](/native/storybook-angular/?path=/story/krds-tooltip--touch-toggle) · [escape-suppression](/native/storybook-angular/?path=/story/krds-tooltip--escape-suppression) · [viewport-edge](/native/storybook-angular/?path=/story/krds-tooltip--viewport-edge) · [relationship-description](/native/storybook-angular/?path=/story/krds-tooltip--relationship-description) · [relationship-label-closed](/native/storybook-angular/?path=/story/krds-tooltip--relationship-label-closed) · [hover-escape-return](/native/storybook-angular/?path=/story/krds-tooltip--hover-escape-return) · [controlled-escape-rejected](/native/storybook-angular/?path=/story/krds-tooltip--controlled-escape-rejected) · [trigger-removed](/native/storybook-angular/?path=/story/krds-tooltip--trigger-removed) · [shadow-relationship](/native/storybook-angular/?path=/story/krds-tooltip--shadow-relationship).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [read the checked consumer](/examples/svelte-41); [download exact source](/sources/apps/fixture-svelte/src/public-examples/TooltipExample.svelte.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:05.172Z`. SHA-256: `cbbbf46d9fb23ba34d57fc1b4ae0e9ef072fba2956bee367673a11e28838118a`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_08_05.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/index.md) before redistributing.
