---
title: 'Button · 버튼'
---

# Button

버튼 · `Button` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_05_02.html) · [Full reviewed specification](/sources/specs/components/button.md.txt) · [Framework support](../compatibility/README.md)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/button/index.d.ts.txt) | [react sources and preview policy](../compatibility/README.mdexamples#react) |
| solid | `0.0.0` | implemented | [exact subpath types](/sources/packages/solid/dist/components/button/index.d.ts.txt) | [solid sources and preview policy](../compatibility/README.mdexamples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/Button.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/README.mdexamples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/button/Button.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/README.mdexamples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/button/index.d.ts.txt) | [lit sources and preview policy](../compatibility/README.mdexamples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/button/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/README.mdexamples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-button.d.ts.txt) | [angular sources and preview policy](../compatibility/README.mdexamples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact subpath types](/sources/packages/solid-next/dist/components/button/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/README.mdexamples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

The public API is defined in the reviewed guidance below and each native public declaration. [Shared event and date types](/sources/packages/contracts/src/types.ts.txt).

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Official requirements

KRDS requires an accessible action name, keyboard operation with Enter/Space, and visible focus. Icon-only buttons need a functional text alternative; decorative icons beside a label must not repeat it. Buttons perform actions; navigation uses Link. Disabled actions are unavailable. Repeated data-submission activation must be guarded by the application while a request is in progress.

### Project API and defaults

Render an actual `button`. Options: `type: 'button' | 'submit' | 'reset'` (default `button`), `disabled: boolean` (false), `variant: 'primary' | 'secondary' | 'tertiary' | 'text' | 'icon'` (primary), `size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'` (medium), native `name`, `value`, `form`, `aria-label`, `aria-labelledby`, and native content. Icon is a presentation variant, not a different role. Label text is required unless an explicit accessible name is provided. Native `onClick` is the action notification; no value-change callback or selection state exists.

Pointer click, Enter and Space use native button activation, each producing one action callback. Do not synthesize a second click from a key handler. Space activates on key release. Disabled buttons are natively disabled, omitted from sequential focus and form successful controls, and execute zero callbacks. Setting disabled externally emits nothing. No automatic debounce or async loading state is implied: a submission owner disables the action while pending and handles idempotence.

`submit` participates in native form validation and includes name/value when it is the submitter; default `button` submits nothing. `reset` invokes the normal cancelable form-reset algorithm once. No controlled/uncontrolled state applies. A failed form validation is not a Button error state; field owners expose errors. Content order is label with optional decorative icon; keep focus ring unobscured.

### Structure and acceptance

Parts: `root`, `label`, `icon`. States: `disabled` on root; native focus/active pseudo-classes handle transient focus/press. No persistent pressed state; a toggle-button contract belongs to another component.

Native adapter acceptance: default button inside a form does not submit; explicit submit/reset works; each pointer/Enter/Space activation executes once; disabled activation executes zero times; icon-only controls expose a functional name; focus and label remain legible in forced colors and zoom. These tests require each framework's native renderer, not the contracts package.

## State examples and native checks

Supported case axes: `primary`, `secondary`, `tertiary`, `text`, `icon`, `xsmall`, `small`, `medium`, `large`, `xlarge`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Disabled](/native/storybook-react/?path=/story/krds-button--disabled) · [Default](/native/storybook-react/?path=/story/krds-button--default) · [Small](/native/storybook-react/?path=/story/krds-button--small) · [Large](/native/storybook-react/?path=/story/krds-button--large) · [Icon](/native/storybook-react/?path=/story/krds-button--icon).
- solid: [Default](/native/storybook-solid/?path=/story/krds-button--default) · [Disabled](/native/storybook-solid/?path=/story/krds-button--disabled) · [Secondary](/native/storybook-solid/?path=/story/krds-button--secondary) · [Tertiary](/native/storybook-solid/?path=/story/krds-button--tertiary) · [Text](/native/storybook-solid/?path=/story/krds-button--text) · [Icon](/native/storybook-solid/?path=/story/krds-button--icon) · [Loading](/native/storybook-solid/?path=/story/krds-button--loading) · [Local Action](/native/storybook-solid/?path=/story/krds-button--local-action).
- svelte: [Disabled](/native/storybook-svelte/?path=/story/krds-button--disabled) · [Sizes](/native/storybook-svelte/?path=/story/krds-button--sizes).
- vue: [Disabled](/native/storybook-vue/?path=/story/krds-button--disabled).
- lit: [Disabled](/native/storybook-lit/?path=/story/krds-button--disabled).
- qwik: [Disabled](/native/storybook-qwik/?path=/story/krds-button--disabled).
- angular: [Disabled](/native/storybook-angular/?path=/story/krds-button--disabled) · [Default](/native/storybook-angular/?path=/story/krds-button--default) · [Sizes](/native/storybook-angular/?path=/story/krds-button--sizes).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-2); [download exact source](/sources/apps/fixture-solid/src/examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-28); [download exact source](/sources/apps/fixture-svelte/src/public-examples/ButtonExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-59); [download exact source](/sources/apps/fixture-vue/src/ConsumerExample.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:04.249Z`. SHA-256: `9f662175363678f870e7d6c74b44cfc4556a2dcfb57dc45e2cb541564ba6e9b9`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_05_02.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/index.md) before redistributing.
