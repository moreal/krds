---
title: 'Language switcher · 언어 변경'
---

# Language switcher

언어 변경 · `LanguageSwitcher` · integration

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_10_01.html) · [Full reviewed specification](/sources/specs/components/language-switcher.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [exact subpath types](/sources/packages/react/dist/components/language-switcher/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.1.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/language-switcher/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/LanguageSwitcher.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/language-switcher/LanguageSwitcher.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/language-switcher/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/language-switcher/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-language-switcher.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.1.0-preview.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface LanguageSwitcherContract extends ControlledOpen {
    currentLocale: string;
    options: readonly LanguageOption[];
    onLocaleRequest?: (detail: {
        locale: string;
        href: string;
    }) => void;
}

export interface ControlledOpen {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (detail: OpenChangeDetails) => void;
}

export interface OpenChangeDetails {
    open: boolean;
}

export interface LanguageOption {
    locale: string;
    nativeLabel: string;
    translatedLabel: string;
    href: string;
    separateService?: boolean;
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `open` | no | `boolean` | data / state |
| `defaultOpen` | no | `boolean` | data / state |
| `onOpenChange` | no | `(detail: OpenChangeDetails) => void` | semantic event request |
| `currentLocale` | yes | `string` | data / state |
| `options` | yes | `readonly LanguageOption[]` | data / state |
| `onLocaleRequest` | no | `(detail: {locale: string; href: string}) => void` | semantic event request |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Two-language services expose real alternate-language link; >=3 use named dropdown with current language/options. Options show native language name plus current-language translation where needed. No flags or unfamiliar language codes as visible labels. Set lang on each link to match spoken label.

### Plain semantic API

Independent API: currentLocale, options {locale,nativeLabel,translatedLabel,href,separateService?}[], open/defaultOpen=false, onOpenChange, onLocaleRequest({locale,href}) optional for host same-page localization. Separate-service link opens new window and marks this behavior; ordinary translated routes remain actual links.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Click/Enter/Space toggle dropdown; Tab/Shift+Tab visit options; outside closes; Escape closes and returns trigger. Choosing option follows native href or explicitly handled host localization and updates document language/content through host. No fake translated page from control alone.

### Responsive/mobile requirements

Narrow generally moves into hamburger menu or footer; high-frequency language change may stay directly discoverable in footer. Maintain current locale on relocation.

### Forms, reset and composition

No form/reset/IME behavior; translation selector does not serialize a form value.

### Asset, integration and composition completion

Host owns translations, route equivalence, document lang and separate-service destination. Completion includes local route/translation mock with native labels and trigger focus; no external translation API.

### Stable parts and states

root, trigger, globe, current, list, option, external-icon; open,closed,current.

All rendered owned parts use `data-krds-component="language-switcher"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `two-language-link`, `dropdown`, `separate-service`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-language-switcher--two-language-link`, `krds-language-switcher--dropdown`, `krds-language-switcher--separate-service`, `krds-language-switcher--narrow-footer`, `krds-language-switcher--local-translation-mock`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Two Language Link](/native/storybook-react/?path=/story/krds-language-switcher--two-language-link) · [Dropdown](/native/storybook-react/?path=/story/krds-language-switcher--dropdown) · [Separate Service](/native/storybook-react/?path=/story/krds-language-switcher--separate-service) · [Narrow Footer](/native/storybook-react/?path=/story/krds-language-switcher--narrow-footer) · [Local Translation Mock](/native/storybook-react/?path=/story/krds-language-switcher--local-translation-mock).
- solid: [two-language-link](/native/storybook-solid/?path=/story/krds-language-switcher--two-language-link) · [dropdown](/native/storybook-solid/?path=/story/krds-language-switcher--dropdown) · [separate-service](/native/storybook-solid/?path=/story/krds-language-switcher--separate-service) · [narrow-footer](/native/storybook-solid/?path=/story/krds-language-switcher--narrow-footer) · [local-translation-mock](/native/storybook-solid/?path=/story/krds-language-switcher--local-translation-mock).
- svelte: [two-language-link](/native/storybook-svelte/?path=/story/krds-language-switcher--two-language-link) · [dropdown](/native/storybook-svelte/?path=/story/krds-language-switcher--dropdown) · [separate-service](/native/storybook-svelte/?path=/story/krds-language-switcher--separate-service) · [narrow-footer](/native/storybook-svelte/?path=/story/krds-language-switcher--narrow-footer) · [local-translation-mock](/native/storybook-svelte/?path=/story/krds-language-switcher--local-translation-mock).
- vue: [two-language-link](/native/storybook-vue/?path=/story/krds-language-switcher--two-language-link) · [dropdown](/native/storybook-vue/?path=/story/krds-language-switcher--dropdown) · [separate-service](/native/storybook-vue/?path=/story/krds-language-switcher--separate-service) · [narrow-footer](/native/storybook-vue/?path=/story/krds-language-switcher--narrow-footer) · [local-translation-mock](/native/storybook-vue/?path=/story/krds-language-switcher--local-translation-mock).
- lit: [Two Language Link](/native/storybook-lit/?path=/story/krds-language-switcher--two-language-link) · [Dropdown](/native/storybook-lit/?path=/story/krds-language-switcher--dropdown) · [Separate Service](/native/storybook-lit/?path=/story/krds-language-switcher--separate-service) · [Narrow Footer](/native/storybook-lit/?path=/story/krds-language-switcher--narrow-footer) · [Local Translation Mock](/native/storybook-lit/?path=/story/krds-language-switcher--local-translation-mock).
- qwik: [two-language-link](/native/storybook-qwik/?path=/story/krds-language-switcher--two-language-link) · [dropdown](/native/storybook-qwik/?path=/story/krds-language-switcher--dropdown) · [separate-service](/native/storybook-qwik/?path=/story/krds-language-switcher--separate-service) · [narrow-footer](/native/storybook-qwik/?path=/story/krds-language-switcher--narrow-footer) · [local-translation-mock](/native/storybook-qwik/?path=/story/krds-language-switcher--local-translation-mock).
- angular: [two-language-link](/native/storybook-angular/?path=/story/krds-language-switcher--two-language-link) · [dropdown](/native/storybook-angular/?path=/story/krds-language-switcher--dropdown) · [separate-service](/native/storybook-angular/?path=/story/krds-language-switcher--separate-service) · [narrow-footer](/native/storybook-angular/?path=/story/krds-language-switcher--narrow-footer) · [local-translation-mock](/native/storybook-angular/?path=/story/krds-language-switcher--local-translation-mock).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [read the checked consumer](/examples/svelte-47); [download exact source](/sources/apps/fixture-svelte/src/public-examples/LanguageSwitcherExample.svelte.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:05.612Z`. SHA-256: `cdef8d8f6c3377fc01747d464ed51a7fc4ca1276c418161bc2f539572b2de397`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_10_01.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
