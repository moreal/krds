---
title: 'Bottom sheet · 바텀시트'
---

# Bottom sheet

바텀시트 · `BottomSheet` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_12_03.html) · [Full reviewed specification](/sources/specs/components/bottom-sheet.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [exact subpath types](/sources/packages/react/dist/components/bottom-sheet/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.1.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/bottom-sheet/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/BottomSheet.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/bottom-sheet/BottomSheet.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/bottom-sheet/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/bottom-sheet/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-bottom-sheet.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.1.0-preview.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface BottomSheetContract {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (detail: OpenChangeDetails & {
        reason: 'close' | 'escape' | 'outside' | 'drag';
    }) => void;
    title: string;
    description?: string;
    onCancel?: () => void;
    initialFocusId?: string;
    returnFocusId?: string;
    dismissOnOutside?: boolean;
}

export interface OpenChangeDetails {
    open: boolean;
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `open` | no | `boolean` | data / state |
| `defaultOpen` | no | `boolean` | data / state |
| `onOpenChange` | no | `(detail: OpenChangeDetails & {reason: 'close' \| 'escape' \| 'outside' \| 'drag'}) => void` | semantic event request |
| `title` | yes | `string` | data / state |
| `description` | no | `string` | data / state |
| `onCancel` | no | `() => void` | semantic event request |
| `initialFocusId` | no | `string` | data / state |
| `returnFocusId` | no | `string` | data / state |
| `dismissOnOutside` | no | `boolean` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Bottom overlay/sheet with optional visual header, drag handle, body and clearly perceivable top Close button. Close cancels unconfirmed selection/action. One sheet at a time; avoid long policy/task-step content. Handle description in source repeats slider wording and is not a mandate to implement a range control.

### Plain semantic API

Independent API: open/defaultOpen=false,onOpenChange({open,reason}), required accessible title (visible or aria-label), description?, content, onCancel(), initialFocusId?, returnFocusId?, dismissOnOutside=false. Modal-only first contract; drag-to-close optional with equivalent Close action.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Independent native policy uses reviewed Modal role/dialog focus entry, trap, background isolation, Escape and opener return/unmount cleanup. Close is type=button with name. Pointer handle can drag downward or tap to request close; dragging never sole dismissal. Cancel restores draft value in host, no silent commit.

### Responsive/mobile requirements

Sheet respects bottom safe area and virtual keyboard; bounded height with scrollable content/actions accessible. Reduced-motion removes slide translation. No stacked sheets in first contract.

### Forms, reset and composition

No sheet value/reset; child form independent, Enter follows form semantics and composing Escape ignored. Closing cancel must not reset unrelated page form.

### Asset, integration and composition completion

Host owns selection draft/commit and cancellation. Completion includes usable dialog, close/drag equivalence and local select/cancel flow; not a bottom-positioned div.

### Stable parts and states

root, backdrop, content, handle, header, title, body, actions, close; open,closed,dragging.

All rendered owned parts use `data-krds-component="bottom-sheet"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `modal`, `short-content`, `select-cancel`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-bottom-sheet--modal`, `krds-bottom-sheet--short-content`, `krds-bottom-sheet--select-cancel`, `krds-bottom-sheet--drag-close`, `krds-bottom-sheet--narrow-keyboard`, `krds-bottom-sheet--removed-opener`, `krds-bottom-sheet--reduced-motion`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Modal](/native/storybook-react/?path=/story/krds-bottom-sheet--modal) · [Short Content](/native/storybook-react/?path=/story/krds-bottom-sheet--short-content) · [Select Cancel](/native/storybook-react/?path=/story/krds-bottom-sheet--select-cancel) · [Drag Close](/native/storybook-react/?path=/story/krds-bottom-sheet--drag-close) · [Narrow Keyboard](/native/storybook-react/?path=/story/krds-bottom-sheet--narrow-keyboard) · [Removed Opener](/native/storybook-react/?path=/story/krds-bottom-sheet--removed-opener) · [Reduced Motion](/native/storybook-react/?path=/story/krds-bottom-sheet--reduced-motion).
- solid: [modal](/native/storybook-solid/?path=/story/krds-bottom-sheet--modal) · [short-content](/native/storybook-solid/?path=/story/krds-bottom-sheet--short-content) · [select-cancel](/native/storybook-solid/?path=/story/krds-bottom-sheet--select-cancel) · [drag-close](/native/storybook-solid/?path=/story/krds-bottom-sheet--drag-close) · [narrow-keyboard](/native/storybook-solid/?path=/story/krds-bottom-sheet--narrow-keyboard) · [removed-opener](/native/storybook-solid/?path=/story/krds-bottom-sheet--removed-opener) · [reduced-motion](/native/storybook-solid/?path=/story/krds-bottom-sheet--reduced-motion).
- svelte: [modal](/native/storybook-svelte/?path=/story/krds-bottom-sheet--modal) · [short-content](/native/storybook-svelte/?path=/story/krds-bottom-sheet--short-content) · [select-cancel](/native/storybook-svelte/?path=/story/krds-bottom-sheet--select-cancel) · [drag-close](/native/storybook-svelte/?path=/story/krds-bottom-sheet--drag-close) · [narrow-keyboard](/native/storybook-svelte/?path=/story/krds-bottom-sheet--narrow-keyboard) · [removed-opener](/native/storybook-svelte/?path=/story/krds-bottom-sheet--removed-opener) · [reduced-motion](/native/storybook-svelte/?path=/story/krds-bottom-sheet--reduced-motion).
- vue: [modal](/native/storybook-vue/?path=/story/krds-bottom-sheet--modal) · [short-content](/native/storybook-vue/?path=/story/krds-bottom-sheet--short-content) · [select-cancel](/native/storybook-vue/?path=/story/krds-bottom-sheet--select-cancel) · [drag-close](/native/storybook-vue/?path=/story/krds-bottom-sheet--drag-close) · [narrow-keyboard](/native/storybook-vue/?path=/story/krds-bottom-sheet--narrow-keyboard) · [removed-opener](/native/storybook-vue/?path=/story/krds-bottom-sheet--removed-opener) · [reduced-motion](/native/storybook-vue/?path=/story/krds-bottom-sheet--reduced-motion).
- lit: [Modal](/native/storybook-lit/?path=/story/krds-bottom-sheet--modal) · [Short Content](/native/storybook-lit/?path=/story/krds-bottom-sheet--short-content) · [Select Cancel](/native/storybook-lit/?path=/story/krds-bottom-sheet--select-cancel) · [Drag Close](/native/storybook-lit/?path=/story/krds-bottom-sheet--drag-close) · [Narrow Keyboard](/native/storybook-lit/?path=/story/krds-bottom-sheet--narrow-keyboard) · [Removed Opener](/native/storybook-lit/?path=/story/krds-bottom-sheet--removed-opener) · [Reduced Motion](/native/storybook-lit/?path=/story/krds-bottom-sheet--reduced-motion).
- qwik: [modal](/native/storybook-qwik/?path=/story/krds-bottom-sheet--modal) · [short-content](/native/storybook-qwik/?path=/story/krds-bottom-sheet--short-content) · [select-cancel](/native/storybook-qwik/?path=/story/krds-bottom-sheet--select-cancel) · [drag-close](/native/storybook-qwik/?path=/story/krds-bottom-sheet--drag-close) · [narrow-keyboard](/native/storybook-qwik/?path=/story/krds-bottom-sheet--narrow-keyboard) · [removed-opener](/native/storybook-qwik/?path=/story/krds-bottom-sheet--removed-opener) · [reduced-motion](/native/storybook-qwik/?path=/story/krds-bottom-sheet--reduced-motion).
- angular: [modal](/native/storybook-angular/?path=/story/krds-bottom-sheet--modal) · [short-content](/native/storybook-angular/?path=/story/krds-bottom-sheet--short-content) · [select-cancel](/native/storybook-angular/?path=/story/krds-bottom-sheet--select-cancel) · [drag-close](/native/storybook-angular/?path=/story/krds-bottom-sheet--drag-close) · [narrow-keyboard](/native/storybook-angular/?path=/story/krds-bottom-sheet--narrow-keyboard) · [removed-opener](/native/storybook-angular/?path=/story/krds-bottom-sheet--removed-opener) · [reduced-motion](/native/storybook-angular/?path=/story/krds-bottom-sheet--reduced-motion).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [read the checked consumer](/examples/svelte-53); [download exact source](/sources/apps/fixture-svelte/src/public-examples/BottomSheetExample.svelte.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:06.049Z`. SHA-256: `6748eadb664f497d1b18e6e8a06a4faf9b96681d87eb31505fd000e398a43aa2`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_12_03.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
