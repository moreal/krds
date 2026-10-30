---
title: 'Tab · 탭'
---

# Tab

탭 · `Tabs` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_04_10.html) · [Full reviewed specification](/sources/specs/components/tabs.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/tabs/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.0.0` | implemented | [exact subpath types](/sources/packages/solid/dist/components/tabs/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/Tabs.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/tabs/Tabs.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/tabs/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/tabs/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-tabs.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact subpath types](/sources/packages/solid-next/dist/components/tabs/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

The public API is defined in the reviewed guidance below and each native public declaration. [Shared event and date types](/sources/packages/contracts/src/types.ts.txt).

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Official requirements

KRDS requires keyboard access and visible focus, a non-color selected-state cue, exposed selection state, and programmatic tablist/tab/tabpanel relationships. Its interaction table says all tabs are reachable with Tab/Shift+Tab and Click/Enter selects the focused tab. Preserve that sequential keyboard access; do not silently inherit a roving-tabindex backend default.

### Project API and defaults

Options: ordered `items` with unique nonempty string `value`, visible label, panel content and optional disabled flag; `value?: string`, `defaultValue?: string`, `activationMode: 'manual' | 'automatic'` (manual), `orientation: 'horizontal' | 'vertical'` (horizontal), `onValueChange(ValueChangeDetails<string>)`, required visible tablist label or aria-label/aria-labelledby, and stable instance/item IDs. Content is local; adapters use their native slots/children. No navigation URL or asynchronous load contract is implied. All panels stay mounted so local state survives selection changes; inactive panels have hidden and are absent from the tab and accessibility trees.

Default selection is defaultValue, otherwise the first enabled item; an empty/all-disabled list has no selection (`''`) and no active panel. A selected value must identify an enabled item, except `''` is valid for the no-enabled-items case. At least one enabled item therefore always has one selected panel. Prop updates containing an invalid selection are configuration errors; no automatic recovery silently selects a different item.

### Focus and activation policy

Every enabled tab has tabindex=0 (disabled tabs are natively disabled/tabindex=-1). Sequential Tab/Shift+Tab can visit all enabled tabs in DOM order; focus does not imply selection in manual mode. Panel follows tablist in reading order. The active panel has tabindex=0 only when it lacks a focusable first child; otherwise normal focus reaches its first focusable content. Hidden panels never receive focus.

Click or Enter/Space on a different enabled tab selects it exactly once. Native button click dispatch handles Enter/Space; do not dispatch another selection from keydown. Manual mode: arrows/Home/End move focus only; Enter/Space commits. Automatic mode is explicit opt-in for immediately available local panels: any focus movement onto a different enabled tab, including Tab and programmatic focus, requests selection exactly once. A subsequent click for that same focus/selection must not emit twice. Controlled parent rejection keeps the original selected panel while focus can remain on the requested tab; suppress paired focus/click duplicates for the same activation gesture, not future deliberate gestures.

Horizontal mode Left/Right moves to previous/next enabled tab; vertical mode Up/Down does so. Wrap at ends and skip disabled items. Home/End focus first/last enabled tab. Consume only the handled navigation keys; perpendicular arrows retain normal scrolling. Arrows are additive to KRDS sequential access, not a replacement. Neither selection nor keyboard navigation changes the URL, submits a form or moves focus into the panel. External selection changes render the correct panel without stealing focus or emitting a callback.

## State examples and native checks

Supported case axes: `manual`, `automatic`, `horizontal`, `vertical`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Manual](/native/storybook-react/?path=/story/krds-tabs--manual) · [Automatic](/native/storybook-react/?path=/story/krds-tabs--automatic).
- solid: [Default](/native/storybook-solid/?path=/story/krds-tabs--default) · [Manual](/native/storybook-solid/?path=/story/krds-tabs--manual) · [Selected](/native/storybook-solid/?path=/story/krds-tabs--selected) · [Disabled](/native/storybook-solid/?path=/story/krds-tabs--disabled) · [Automatic](/native/storybook-solid/?path=/story/krds-tabs--automatic) · [Controlled](/native/storybook-solid/?path=/story/krds-tabs--controlled).
- svelte: [Manual](/native/storybook-svelte/?path=/story/krds-tabs--manual).
- vue: [Manual](/native/storybook-vue/?path=/story/krds-tabs--manual).
- lit: [Manual](/native/storybook-lit/?path=/story/krds-tabs--manual).
- qwik: [Manual](/native/storybook-qwik/?path=/story/krds-tabs--manual).
- angular: [Manual](/native/storybook-angular/?path=/story/krds-tabs--manual) · [Automatic](/native/storybook-angular/?path=/story/krds-tabs--automatic) · [Vertical](/native/storybook-angular/?path=/story/krds-tabs--vertical).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-2); [download exact source](/sources/apps/fixture-solid/src/examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-23); [download exact source](/sources/apps/fixture-svelte/src/public-examples/TabsExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-59); [download exact source](/sources/apps/fixture-vue/src/ConsumerExample.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:03.905Z`. SHA-256: `ee99fe206d12a4500498b5370a68d246a4572a773a295e4ef1240464af0ffc03`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_04_10.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
