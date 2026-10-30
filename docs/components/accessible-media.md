---
title: 'Accessible multimedia · 접근 가능한 미디어'
---

# Accessible multimedia

접근 가능한 미디어 · `AccessibleMedia` · composition

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_11_01.html) · [Full reviewed specification](/sources/specs/components/accessible-media.md.txt) · [Framework support](../compatibility/README.md)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/accessible-media/index.d.ts.txt) | [react sources and preview policy](../compatibility/README.mdexamples#react) |
| solid | `0.0.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/accessible-media/index.d.ts.txt) | [solid sources and preview policy](../compatibility/README.mdexamples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/AccessibleMedia.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/README.mdexamples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/accessible-media/AccessibleMedia.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/README.mdexamples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/accessible-media/index.d.ts.txt) | [lit sources and preview policy](../compatibility/README.mdexamples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/accessible-media/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/README.mdexamples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-accessible-media.d.ts.txt) | [angular sources and preview policy](../compatibility/README.mdexamples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/README.mdexamples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface AccessibleMediaContract {
    media: {
        kind: 'audio' | 'silent-video' | 'multimedia';
        src: string;
        type: string;
        poster?: string;
    };
    captionTracks?: readonly {
        src: string;
        lang: string;
        label: string;
    }[];
    transcript: {
        content: string;
        href?: never;
    } | {
        href: string;
        content?: never;
    };
    descriptionTrack?: {
        src: string;
        lang: string;
        label: string;
    };
    signLanguageSource?: string;
    title: string;
    controls?: true;
    autoplay?: false;
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `media` | yes | `{kind: 'audio' \| 'silent-video' \| 'multimedia'; src: string; type: string; poster?: string}` | data / state |
| `captionTracks` | no | `readonly {src: string; lang: string; label: string}[]` | data / state |
| `transcript` | yes | `{content: string; href?: never} \| {href: string; content?: never}` | data / state |
| `descriptionTrack` | no | `{src: string; lang: string; label: string}` | data / state |
| `signLanguageSource` | no | `string` | data / state |
| `title` | yes | `string` | data / state |
| `controls` | no | `true` | data / state |
| `autoplay` | no | `false` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Semantic audio/video and adjacent labeled alternative-information region/links. Audio needs captions or simple transcript; silent visual video needs description/descriptive transcript; audiovisual content needs combined alternatives according to complexity. Captions synchronize meaningful speech/sounds/speakers, not just translated subtitles.

### Plain semantic API

Independent API: media {kind,src,type,poster?}, captionTracks {src,lang,label}[], transcript {content|href}, descriptionTrack?, signLanguageSource?, title. Native controls=true, autoplay=false proposed. No claim that a transcript slot alone makes arbitrary media accessible.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Native media keyboard controls retain focus; alternate transcript links/buttons use standard semantics. Do not introduce custom inaccessible player shortcuts. Description track switch if offered has explicit state and does not play automatically.

### Responsive/mobile requirements

Captions remain unobscured/readable with adequate contrast and synchronized; allow caption customization when player supports it. Local responsive video maintains aspect ratio without cropping meaningful information; transcript remains selectable/reflowable.

### Forms, reset and composition

No form/reset/IME behavior.

### Asset, integration and composition completion

Host/content producer owns complete accurate synchronized captions, description, transcripts/sign language and updates alongside media. Completion requires local playable licensed sample, real VTT/alternate content, keyboard controls and manual timing/content review; not an empty media wrapper. No external video/telemetry player.

### Stable parts and states

root, media, caption-track, alternatives, transcript, description, sign-language; playing,paused,ended,error only native state.

All rendered owned parts use `data-krds-component="accessible-media"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `audio`, `silent-video`, `multimedia`, `captions`, `description`, `transcript`, `sign-language`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-accessible-media--audio`, `krds-accessible-media--silent-video`, `krds-accessible-media--multimedia-captions`, `krds-accessible-media--description`, `krds-accessible-media--transcript`, `krds-accessible-media--sign-language`, `krds-accessible-media--load-error`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Audio](/native/storybook-react/?path=/story/krds-accessible-media--audio) · [Silent Video](/native/storybook-react/?path=/story/krds-accessible-media--silent-video) · [Multimedia Captions](/native/storybook-react/?path=/story/krds-accessible-media--multimedia-captions) · [Description](/native/storybook-react/?path=/story/krds-accessible-media--description) · [Transcript](/native/storybook-react/?path=/story/krds-accessible-media--transcript) · [Sign Language](/native/storybook-react/?path=/story/krds-accessible-media--sign-language) · [Load Error](/native/storybook-react/?path=/story/krds-accessible-media--load-error).
- solid: [audio](/native/storybook-solid/?path=/story/krds-accessible-media--audio) · [silent-video](/native/storybook-solid/?path=/story/krds-accessible-media--silent-video) · [multimedia-captions](/native/storybook-solid/?path=/story/krds-accessible-media--multimedia-captions) · [description](/native/storybook-solid/?path=/story/krds-accessible-media--description) · [transcript](/native/storybook-solid/?path=/story/krds-accessible-media--transcript) · [sign-language](/native/storybook-solid/?path=/story/krds-accessible-media--sign-language) · [load-error](/native/storybook-solid/?path=/story/krds-accessible-media--load-error).
- svelte: [audio](/native/storybook-svelte/?path=/story/krds-accessible-media--audio) · [silent-video](/native/storybook-svelte/?path=/story/krds-accessible-media--silent-video) · [multimedia-captions](/native/storybook-svelte/?path=/story/krds-accessible-media--multimedia-captions) · [description](/native/storybook-svelte/?path=/story/krds-accessible-media--description) · [transcript](/native/storybook-svelte/?path=/story/krds-accessible-media--transcript) · [sign-language](/native/storybook-svelte/?path=/story/krds-accessible-media--sign-language) · [load-error](/native/storybook-svelte/?path=/story/krds-accessible-media--load-error).
- vue: [audio](/native/storybook-vue/?path=/story/krds-accessible-media--audio) · [silent-video](/native/storybook-vue/?path=/story/krds-accessible-media--silent-video) · [multimedia-captions](/native/storybook-vue/?path=/story/krds-accessible-media--multimedia-captions) · [description](/native/storybook-vue/?path=/story/krds-accessible-media--description) · [transcript](/native/storybook-vue/?path=/story/krds-accessible-media--transcript) · [sign-language](/native/storybook-vue/?path=/story/krds-accessible-media--sign-language) · [load-error](/native/storybook-vue/?path=/story/krds-accessible-media--load-error).
- lit: [Audio](/native/storybook-lit/?path=/story/krds-accessible-media--audio) · [Silent Video](/native/storybook-lit/?path=/story/krds-accessible-media--silent-video) · [Multimedia Captions](/native/storybook-lit/?path=/story/krds-accessible-media--multimedia-captions) · [Description](/native/storybook-lit/?path=/story/krds-accessible-media--description) · [Transcript](/native/storybook-lit/?path=/story/krds-accessible-media--transcript) · [Sign Language](/native/storybook-lit/?path=/story/krds-accessible-media--sign-language) · [Load Error](/native/storybook-lit/?path=/story/krds-accessible-media--load-error).
- qwik: [audio](/native/storybook-qwik/?path=/story/krds-accessible-media--audio) · [silent-video](/native/storybook-qwik/?path=/story/krds-accessible-media--silent-video) · [multimedia-captions](/native/storybook-qwik/?path=/story/krds-accessible-media--multimedia-captions) · [description](/native/storybook-qwik/?path=/story/krds-accessible-media--description) · [transcript](/native/storybook-qwik/?path=/story/krds-accessible-media--transcript) · [sign-language](/native/storybook-qwik/?path=/story/krds-accessible-media--sign-language) · [load-error](/native/storybook-qwik/?path=/story/krds-accessible-media--load-error).
- angular: [audio](/native/storybook-angular/?path=/story/krds-accessible-media--audio) · [silent-video](/native/storybook-angular/?path=/story/krds-accessible-media--silent-video) · [multimedia-captions](/native/storybook-angular/?path=/story/krds-accessible-media--multimedia-captions) · [description](/native/storybook-angular/?path=/story/krds-accessible-media--description) · [transcript](/native/storybook-angular/?path=/story/krds-accessible-media--transcript) · [sign-language](/native/storybook-angular/?path=/story/krds-accessible-media--sign-language) · [load-error](/native/storybook-angular/?path=/story/krds-accessible-media--load-error).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-49); [download exact source](/sources/apps/fixture-svelte/src/public-examples/AccessibleMediaExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:05.761Z`. SHA-256: `a90a3417fbb1aed59066915d4ad4f556f058aadcff4b914a97d1c9671b43eda1`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_11_01.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/index.md) before redistributing.
