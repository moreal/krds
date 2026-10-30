---
title: 'Back button · 뒤로가기 버튼'
---

# Back button

뒤로가기 버튼 · `BackButton` · integration

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_12_02.html) · [Full reviewed specification](/sources/specs/components/back-button.md.txt) · [Framework support](../compatibility/README.md)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/back-button/index.d.ts.txt) | [react sources and preview policy](../compatibility/README.mdexamples#react) |
| solid | `0.0.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/back-button/index.d.ts.txt) | [solid sources and preview policy](../compatibility/README.mdexamples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/BackButton.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/README.mdexamples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/back-button/BackButton.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/README.mdexamples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/back-button/index.d.ts.txt) | [lit sources and preview policy](../compatibility/README.mdexamples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/back-button/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/README.mdexamples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-back-button.d.ts.txt) | [angular sources and preview policy](../compatibility/README.mdexamples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/README.mdexamples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface BackButtonContract {
    label?: string;
    canGoBack: boolean;
    fallbackHref?: string;
    dirty?: boolean;
    onBackRequest: (detail: {
        reason: 'activate' | 'confirmed';
    }) => void;
    requestConfirmation?: () => boolean | Promise<boolean>;
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `label` | no | `string` | data / state |
| `canGoBack` | yes | `boolean` | data / state |
| `fallbackHref` | no | `string` | data / state |
| `dirty` | no | `boolean` | data / state |
| `onBackRequest` | yes | `(detail: {reason: 'activate' \| 'confirmed'}) => void` | semantic event request |
| `requestConfirmation` | no | `() => boolean \| Promise<boolean>` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Top-bar left back control beside current screen title. Returns to previous screen (or defined parent), visually distinct from cancel/close. Warn before loss of in-progress input; system/browser back and in-app behavior should align where host can control.

### Plain semantic API

Independent API: label="뒤로가기", onBackRequest({reason}), canGoBack, fallbackHref?, dirty=false, requestConfirmation supplied by host. Type=button for history action; explicit parent destination uses real Link variant. Never call history.back blindly when no known in-app entry.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Independent native policy: button Enter/Space/click once; dirty confirmation opens reviewed Modal, cancel retains page/values/focus, confirm invokes host navigation once. Destination focus and history/gesture interception belong router/host.

### Responsive/mobile requirements

Left position and title remain readable narrow; adequate target does not collide with system safe area. This is web-applicable context, not browser UI replacement.

### Forms, reset and composition

No own form value/reset; button never submits or clears form. Host dirty state observes form/IME accurately; composing text must not be lost by premature navigation.

### Asset, integration and composition completion

Recommend component→integration: host owns router/history, browser-back guard, fallback and data-loss policy. Completion needs local navigation stack and unsaved-form mock, including cancelled confirmation; no real page departure needed in stories.

### Stable parts and states

root, icon, label; disabled,pending-confirmation. The adjacent page title belongs to the host page composition and is not an owned BackButton part.

All rendered owned parts use `data-krds-component="back-button"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `default`, `dirty-confirmation`, `no-history-fallback`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-back-button--default`, `krds-back-button--dirty-confirmation`, `krds-back-button--cancel-navigation`, `krds-back-button--no-history-fallback`, `krds-back-button--narrow`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Default](/native/storybook-react/?path=/story/krds-back-button--default) · [Dirty Confirmation](/native/storybook-react/?path=/story/krds-back-button--dirty-confirmation) · [Cancel Navigation](/native/storybook-react/?path=/story/krds-back-button--cancel-navigation) · [No History Fallback](/native/storybook-react/?path=/story/krds-back-button--no-history-fallback) · [Narrow](/native/storybook-react/?path=/story/krds-back-button--narrow).
- solid: [default](/native/storybook-solid/?path=/story/krds-back-button--default) · [dirty-confirmation](/native/storybook-solid/?path=/story/krds-back-button--dirty-confirmation) · [cancel-navigation](/native/storybook-solid/?path=/story/krds-back-button--cancel-navigation) · [no-history-fallback](/native/storybook-solid/?path=/story/krds-back-button--no-history-fallback) · [narrow](/native/storybook-solid/?path=/story/krds-back-button--narrow).
- svelte: [default](/native/storybook-svelte/?path=/story/krds-back-button--default) · [dirty-confirmation](/native/storybook-svelte/?path=/story/krds-back-button--dirty-confirmation) · [cancel-navigation](/native/storybook-svelte/?path=/story/krds-back-button--cancel-navigation) · [no-history-fallback](/native/storybook-svelte/?path=/story/krds-back-button--no-history-fallback) · [narrow](/native/storybook-svelte/?path=/story/krds-back-button--narrow).
- vue: [default](/native/storybook-vue/?path=/story/krds-back-button--default) · [dirty-confirmation](/native/storybook-vue/?path=/story/krds-back-button--dirty-confirmation) · [cancel-navigation](/native/storybook-vue/?path=/story/krds-back-button--cancel-navigation) · [no-history-fallback](/native/storybook-vue/?path=/story/krds-back-button--no-history-fallback) · [narrow](/native/storybook-vue/?path=/story/krds-back-button--narrow).
- lit: [Default](/native/storybook-lit/?path=/story/krds-back-button--default) · [Dirty Confirmation](/native/storybook-lit/?path=/story/krds-back-button--dirty-confirmation) · [Cancel Navigation](/native/storybook-lit/?path=/story/krds-back-button--cancel-navigation) · [No History Fallback](/native/storybook-lit/?path=/story/krds-back-button--no-history-fallback) · [Narrow](/native/storybook-lit/?path=/story/krds-back-button--narrow).
- qwik: [default](/native/storybook-qwik/?path=/story/krds-back-button--default) · [dirty-confirmation](/native/storybook-qwik/?path=/story/krds-back-button--dirty-confirmation) · [cancel-navigation](/native/storybook-qwik/?path=/story/krds-back-button--cancel-navigation) · [no-history-fallback](/native/storybook-qwik/?path=/story/krds-back-button--no-history-fallback) · [narrow](/native/storybook-qwik/?path=/story/krds-back-button--narrow).
- angular: [default](/native/storybook-angular/?path=/story/krds-back-button--default) · [dirty-confirmation](/native/storybook-angular/?path=/story/krds-back-button--dirty-confirmation) · [cancel-navigation](/native/storybook-angular/?path=/story/krds-back-button--cancel-navigation) · [no-history-fallback](/native/storybook-angular/?path=/story/krds-back-button--no-history-fallback) · [narrow](/native/storybook-angular/?path=/story/krds-back-button--narrow).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-52); [download exact source](/sources/apps/fixture-svelte/src/public-examples/BackButtonExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:05.968Z`. SHA-256: `08604e589588973c18a57db8c3bfde067b1e3b627691151d44592ad26c825bbf`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_12_02.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/index.md) before redistributing.
