---
title: 'Footer · 푸터'
---

# Footer

푸터 · `Footer` · composition

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_02_04.html) · [Full reviewed specification](/sources/specs/components/footer.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [exact subpath types](/sources/packages/react/dist/components/footer/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.1.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/footer/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/Footer.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/footer/Footer.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/footer/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/footer/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-footer.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.1.0-preview.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface FooterContract {
    serviceLogo: LogoData;
    contacts: readonly {
        label: string;
        href?: string;
        text: string;
    }[];
    utilityLinks: readonly LinkData[];
    privacyPolicy: LinkData;
    policyLinks: readonly LinkData[];
    copyrightText: string;
    institution?: IdentifierContract;
}

export interface LogoData {
    src: string;
    alt: string;
}

export interface LinkData {
    id?: string;
    label: string;
    href: string;
    target?: string;
    rel?: string;
}

export interface IdentifierContract {
    institutionName: string;
    logo: LogoData;
    relationshipText: string;
    theme?: 'light' | 'dark';
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `serviceLogo` | yes | `LogoData` | data / state |
| `contacts` | yes | `readonly {label: string; href?: string; text: string}[]` | data / state |
| `utilityLinks` | yes | `readonly LinkData[]` | data / state |
| `privacyPolicy` | yes | `LinkData` | data / state |
| `policyLinks` | yes | `readonly LinkData[]` | data / state |
| `copyrightText` | yes | `string` | data / state |
| `institution` | no | `IdentifierContract` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Actual &lt;footer> is the last page landmark: group service logo/contact/utility links, then policy links, copyright information, then Identifier as final subsection. Include visibly distinguishable “개인정보 처리방침”; commerce services additionally supply terms/business identity. Optional service navigation must mirror main navigation labels and hierarchy.

### Plain semantic API

Independent API: Footer takes serviceLogo {src,alt}, contacts {label,href,text}[], utilityLinks[], privacyPolicy {href,label}, policyLinks[], copyrightText supplied explicitly, optional institution identity. Preserve semantic Link data rather than raw fabricated addresses.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Natural Tab order through real links; use tel:/mailto: for actionable contact values. External/new-window links announce their destination behavior. Footer itself does not trap or redirect focus.

### Responsive/mobile requirements

Stack columns in the same order on small screens. For short pages, host page layout puts footer at viewport bottom without overlaying content.

### Forms, reset and composition

No aggregate form/reset/IME state.

### Asset, integration and composition completion

Host owns accurate/up-to-date contact, policy, copyright and asset rights. Do not default copyright to repository owner or KRDS holder. Completion includes actual local contact/policy links and Identifier composition plus page layout demo.

### Stable parts and states

root, logo, contacts, utilities, policies, privacy-link, copyright, identifier; no value state.

All rendered owned parts use `data-krds-component="footer"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `default`, `narrow`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-footer--default`, `krds-footer--narrow`, `krds-footer--short-page`, `krds-footer--commerce-policy`, `krds-footer--navigation-mirror`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Default](/native/storybook-react/?path=/story/krds-footer--default) · [Narrow](/native/storybook-react/?path=/story/krds-footer--narrow) · [Short Page](/native/storybook-react/?path=/story/krds-footer--short-page) · [Commerce Policy](/native/storybook-react/?path=/story/krds-footer--commerce-policy) · [Navigation Mirror](/native/storybook-react/?path=/story/krds-footer--navigation-mirror).
- solid: [default](/native/storybook-solid/?path=/story/krds-footer--default) · [narrow](/native/storybook-solid/?path=/story/krds-footer--narrow) · [short-page](/native/storybook-solid/?path=/story/krds-footer--short-page) · [commerce-policy](/native/storybook-solid/?path=/story/krds-footer--commerce-policy) · [navigation-mirror](/native/storybook-solid/?path=/story/krds-footer--navigation-mirror).
- svelte: [default](/native/storybook-svelte/?path=/story/krds-footer--default) · [narrow](/native/storybook-svelte/?path=/story/krds-footer--narrow) · [short-page](/native/storybook-svelte/?path=/story/krds-footer--short-page) · [commerce-policy](/native/storybook-svelte/?path=/story/krds-footer--commerce-policy) · [navigation-mirror](/native/storybook-svelte/?path=/story/krds-footer--navigation-mirror).
- vue: [default](/native/storybook-vue/?path=/story/krds-footer--default) · [narrow](/native/storybook-vue/?path=/story/krds-footer--narrow) · [short-page](/native/storybook-vue/?path=/story/krds-footer--short-page) · [commerce-policy](/native/storybook-vue/?path=/story/krds-footer--commerce-policy) · [navigation-mirror](/native/storybook-vue/?path=/story/krds-footer--navigation-mirror).
- lit: [Default](/native/storybook-lit/?path=/story/krds-footer--default) · [Narrow](/native/storybook-lit/?path=/story/krds-footer--narrow) · [Short Page](/native/storybook-lit/?path=/story/krds-footer--short-page) · [Commerce Policy](/native/storybook-lit/?path=/story/krds-footer--commerce-policy) · [Navigation Mirror](/native/storybook-lit/?path=/story/krds-footer--navigation-mirror).
- qwik: [default](/native/storybook-qwik/?path=/story/krds-footer--default) · [narrow](/native/storybook-qwik/?path=/story/krds-footer--narrow) · [short-page](/native/storybook-qwik/?path=/story/krds-footer--short-page) · [commerce-policy](/native/storybook-qwik/?path=/story/krds-footer--commerce-policy) · [navigation-mirror](/native/storybook-qwik/?path=/story/krds-footer--navigation-mirror).
- angular: [default](/native/storybook-angular/?path=/story/krds-footer--default) · [narrow](/native/storybook-angular/?path=/story/krds-footer--narrow) · [short-page](/native/storybook-angular/?path=/story/krds-footer--short-page) · [commerce-policy](/native/storybook-angular/?path=/story/krds-footer--commerce-policy) · [navigation-mirror](/native/storybook-angular/?path=/story/krds-footer--navigation-mirror).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [read the checked consumer](/examples/svelte-7); [download exact source](/sources/apps/fixture-svelte/src/public-examples/FooterExample.svelte.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:02.764Z`. SHA-256: `b3235a0f1707901bf43826b17b1f9105260ab15c34ae1a2b9ecd2047a1f02609`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_02_04.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
