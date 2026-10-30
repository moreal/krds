---
title: 'Modal · 모달'
---

# Modal

모달 · `Modal` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_04_05.html) · [Full reviewed specification](/sources/specs/components/modal.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/modal/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.0.0` | implemented | [exact subpath types](/sources/packages/solid/dist/components/modal/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/Modal.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/modal/Modal.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/modal/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/modal/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-modal.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact subpath types](/sources/packages/solid-next/dist/components/modal/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

The public API is defined in the reviewed guidance below and each native public declaration. [Shared event and date types](/sources/packages/contracts/src/types.ts.txt).

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Official requirements

KRDS requires initial focus on the dialog itself or its first interactive element, confinement of keyboard and screen-reader focus to the active modal, restoration to its opening control, and logical reading order. The icon close button is the final element in modal markup. Tab/Shift+Tab wrap within the modal. Escape closes when a close button is provided.

### Project API and defaults

Options: `open?: boolean`, `defaultOpen?: boolean` (false), `onOpenChange(OpenChangeDetails)`, `closeOnOutsideClick: boolean` (false), `showCloseButton: boolean` (true), `initialFocusId?: string`, `returnFocusId?: string`, required title content/ID, optional description content/ID, body and action content. `showCloseButton=false` requires an enabled explicit close/cancel action in the body/footer. showCloseButton controls only the icon close button, not Escape permission. No modal without a reachable close action is allowed in the pilot, and there is no independent Escape opt-out when a close button is provided.

Render `role=dialog`, `aria-modal=true`, and `aria-labelledby` referencing its visible title. Description is optional and referenced only when present; do not announce an entire structured body as a flat description. Order: title, optional description, body, actions, icon close button last. Give the icon close button the translated default name `닫기` (`Close` for English) or an explicit local label. Close controls are type=button. Dialog content remains scrollable in a small viewport; background scrolling and interaction are blocked while actually open. Closed content is hidden/inert and not in the accessibility or tab tree.

### Dismissal and focus policy

On actual false→true transition, save the opener/active element. If initialFocusId is supplied, it may identify only the dialog container itself or the first enabled, visible, focusable interactive element in the dialog's logical DOM order; any other target (including a later action or the final close button when another interactive element precedes it) is a configuration error. Otherwise focus the dialog container with tabindex=-1. The dialog container uses tabindex=-1 when targeted explicitly as well. The latter is the deliberate default so the title and content context precede actions. Apply inert/background isolation, including screen-reader access, outside the active portal; preserve and restore pre-existing inert/scroll states. Tab and Shift+Tab cycle through enabled visible focusables; if none remain, keep focus on the dialog. Nested modals permit only the topmost modal to trap focus and process dismissal. Parent remains inert until child closes.

Outside pointer interaction is blocked by the backdrop and defaults to no dismissal. When `closeOnOutsideClick=true`, dismiss only a primary pointer gesture that starts and ends on the backdrop; a drag starting inside, secondary click, or click on a descendant never dismisses. Emit one `{open:false}` request. This option is project policy, not an inferred KRDS requirement.

Escape requests close whenever actually open, topmost, with a provided close button (the icon close button or the required explicit close/cancel action), and the event has not already been handled by an inner widget. A configuration cannot disable this dismissal while retaining a close button. Ignore Escape during IME composition (including keyCode 229 fallback). Consume only the Escape that is processed. An inner select/popover gets its own Escape first. Explicit close/cancel, trigger-open, and allowed outside dismissal each emit one request if state differs. An open trigger on an already open dialog emits zero. A controlled rejected close leaves focus trap, background isolation and UI open; do not restore focus before the parent's false prop arrives.

On actual true→false, remove isolation and restore focus to the saved opener whenever it remains mounted, visible, enabled, focusable and not inert; returnFocusId must never override a usable opener. Only when the opener is absent or unusable may a supplied returnFocusId identify an alternate visible, enabled, focusable, non-inert target. If that alternate is absent or unusable, focus the nearest remaining usable focusable ancestor of the opener; if none, focus document body using a temporary tabindex=-1 (restore prior tabindex). Unmounting an open dialog performs the same cleanup and restoration, without a synthetic user-change event. An initially open dialog with no opening action has no opener: use a usable returnFocusId, otherwise body. Prop transitions and mount emit zero open-change callbacks.

### Form, states and acceptance

No value/name or form-reset state. Enter submits a nested form only through its normal submitter; never treat all Enter keys as modal confirmation. Action failure is application content: keep open and announce a visible error, without implicit retry/close. Opening and closing animations must preserve these logical states and honor reduced motion.

Parts: `root`, `trigger`, `backdrop`, `content`, `title`, `description`, `body`, `actions`, `close`. Root/backdrop/content states: `open` or `closed`. Acceptance: title relationship; final close markup; dialog/first-interactive focus entry only, focus trap, mandatory usable-opener return and removed-opener fallback; backdrop default and opt-in drag protection; mandatory close-button Escape with topmost/handled/composing safeguards; controlled rejected dismissal; restoration on unmount; no duplicate open notifications.

## State examples and native checks

Supported case axes: `default`, `scrolling`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Open](/native/storybook-react/?path=/story/krds-modal--open) · [Trigger](/native/storybook-react/?path=/story/krds-modal--trigger).
- solid: [Default](/native/storybook-solid/?path=/story/krds-modal--default) · [Open](/native/storybook-solid/?path=/story/krds-modal--open) · [Error](/native/storybook-solid/?path=/story/krds-modal--error) · [Loading](/native/storybook-solid/?path=/story/krds-modal--loading).
- svelte: [Open](/native/storybook-svelte/?path=/story/krds-modal--open).
- vue: [Open](/native/storybook-vue/?path=/story/krds-modal--open).
- lit: [Open](/native/storybook-lit/?path=/story/krds-modal--open).
- qwik: [Open](/native/storybook-qwik/?path=/story/krds-modal--open).
- angular: [Open](/native/storybook-angular/?path=/story/krds-modal--open).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-2); [download exact source](/sources/apps/fixture-solid/src/examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-18); [download exact source](/sources/apps/fixture-svelte/src/public-examples/ModalExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-59); [download exact source](/sources/apps/fixture-vue/src/ConsumerExample.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:03.556Z`. SHA-256: `333c5f77e93a67c408874b067e2b0717dc0a3ad890269be35671fe1601bd3fd9`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_04_05.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
