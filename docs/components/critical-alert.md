---
title: 'Critical alerts · 긴급 공지'
---

# Critical alerts

긴급 공지 · `CriticalAlert` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_04_02.html) · [Full reviewed specification](/sources/specs/components/critical-alert.md.txt) · [Framework support](../compatibility/README.md)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [exact subpath types](/sources/packages/react/dist/components/critical-alert/index.d.ts.txt) | [react sources and preview policy](../compatibility/README.mdexamples#react) |
| solid | `0.1.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/critical-alert/index.d.ts.txt) | [solid sources and preview policy](../compatibility/README.mdexamples#solid) |
| svelte | `0.1.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/CriticalAlert.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/README.mdexamples#svelte) |
| vue | `0.1.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/critical-alert/CriticalAlert.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/README.mdexamples#vue) |
| lit | `0.1.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/critical-alert/index.d.ts.txt) | [lit sources and preview policy](../compatibility/README.mdexamples#lit) |
| qwik | `0.1.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/critical-alert/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/README.mdexamples#qwik) |
| angular | `0.1.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-critical-alert.d.ts.txt) | [angular sources and preview policy](../compatibility/README.mdexamples#angular) |
| solid-next (preview) | `0.1.0-preview.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/README.mdexamples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface CriticalAlertContract {
    urgency: 'high' | 'medium' | 'low';
    label: string;
    message: string;
    details?: LinkData & {
        destinationTitle: string;
    };
}

export interface LinkData {
    id?: string;
    label: string;
    href: string;
    target?: string;
    rel?: string;
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `urgency` | yes | `'high' \| 'medium' \| 'low'` | data / state |
| `label` | yes | `string` | data / state |
| `message` | yes | `string` | data / state |
| `details` | no | `LinkData & {destinationTitle: string}` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Full-width section as first body content between MainMenu and hero: decorative urgency icon, visible urgency label, concise notice, at most one directly related detail link. No dismiss/collapse control. Official text explicitly requests role=banner.

### Plain semantic API

Independent API: urgency=high|medium|low, label, message, details? {href,label,destinationTitle}; no open/defaultOpen or dismiss event. Host controls time-limited presence. Style selectors danger/ok/info are examples, not proof that “safe” equals a numeric urgency level.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Only detail anchor enters Tab order; no automatic focus or assertive live role inferred from urgency. Decorative icon has no duplicate alt. Banner landmark naming/disambiguation with page Header needs review.

### Responsive/mobile requirements

Text one line normally/up to two narrow; do not clip essential information to enforce line count. Use concise host copy and details link.

### Forms, reset and composition

No form/reset/IME behavior.

### Asset, integration and composition completion

Host owns truthful urgent information and posting period. Completion tests nondismissibility and detail destination; no polling or network urgency feed in component.

### Stable parts and states

root, icon, label, message, link; urgency=high|medium|low.

All rendered owned parts use `data-krds-component="critical-alert"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `high-urgency`, `medium-urgency`, `low-urgency`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-critical-alert--high-urgency`, `krds-critical-alert--medium-urgency`, `krds-critical-alert--low-urgency`, `krds-critical-alert--narrow`, `krds-critical-alert--page-placement`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [High Urgency](/native/storybook-react/?path=/story/krds-critical-alert--high-urgency) · [Medium Urgency](/native/storybook-react/?path=/story/krds-critical-alert--medium-urgency) · [Low Urgency](/native/storybook-react/?path=/story/krds-critical-alert--low-urgency) · [Narrow](/native/storybook-react/?path=/story/krds-critical-alert--narrow) · [Page Placement](/native/storybook-react/?path=/story/krds-critical-alert--page-placement).
- solid: [high-urgency](/native/storybook-solid/?path=/story/krds-critical-alert--high-urgency) · [medium-urgency](/native/storybook-solid/?path=/story/krds-critical-alert--medium-urgency) · [low-urgency](/native/storybook-solid/?path=/story/krds-critical-alert--low-urgency) · [narrow](/native/storybook-solid/?path=/story/krds-critical-alert--narrow) · [page-placement](/native/storybook-solid/?path=/story/krds-critical-alert--page-placement).
- svelte: [high-urgency](/native/storybook-svelte/?path=/story/krds-critical-alert--high-urgency) · [medium-urgency](/native/storybook-svelte/?path=/story/krds-critical-alert--medium-urgency) · [low-urgency](/native/storybook-svelte/?path=/story/krds-critical-alert--low-urgency) · [narrow](/native/storybook-svelte/?path=/story/krds-critical-alert--narrow) · [page-placement](/native/storybook-svelte/?path=/story/krds-critical-alert--page-placement).
- vue: [high-urgency](/native/storybook-vue/?path=/story/krds-critical-alert--high-urgency) · [medium-urgency](/native/storybook-vue/?path=/story/krds-critical-alert--medium-urgency) · [low-urgency](/native/storybook-vue/?path=/story/krds-critical-alert--low-urgency) · [narrow](/native/storybook-vue/?path=/story/krds-critical-alert--narrow) · [page-placement](/native/storybook-vue/?path=/story/krds-critical-alert--page-placement).
- lit: [High Urgency](/native/storybook-lit/?path=/story/krds-critical-alert--high-urgency) · [Medium Urgency](/native/storybook-lit/?path=/story/krds-critical-alert--medium-urgency) · [Low Urgency](/native/storybook-lit/?path=/story/krds-critical-alert--low-urgency) · [Narrow](/native/storybook-lit/?path=/story/krds-critical-alert--narrow) · [Page Placement](/native/storybook-lit/?path=/story/krds-critical-alert--page-placement).
- qwik: [high-urgency](/native/storybook-qwik/?path=/story/krds-critical-alert--high-urgency) · [medium-urgency](/native/storybook-qwik/?path=/story/krds-critical-alert--medium-urgency) · [low-urgency](/native/storybook-qwik/?path=/story/krds-critical-alert--low-urgency) · [narrow](/native/storybook-qwik/?path=/story/krds-critical-alert--narrow) · [page-placement](/native/storybook-qwik/?path=/story/krds-critical-alert--page-placement).
- angular: [high-urgency](/native/storybook-angular/?path=/story/krds-critical-alert--high-urgency) · [medium-urgency](/native/storybook-angular/?path=/story/krds-critical-alert--medium-urgency) · [low-urgency](/native/storybook-angular/?path=/story/krds-critical-alert--low-urgency) · [narrow](/native/storybook-angular/?path=/story/krds-critical-alert--narrow) · [page-placement](/native/storybook-angular/?path=/story/krds-critical-alert--page-placement).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [read the checked consumer](/examples/svelte-15); [download exact source](/sources/apps/fixture-svelte/src/public-examples/CriticalAlertExample.svelte.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:03.344Z`. SHA-256: `be6556c675ce9269b7e70c9e71a0fbae7f6d5e846388e5c9431eee92ccdaf83b`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_04_02.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/index.md) before redistributing.
