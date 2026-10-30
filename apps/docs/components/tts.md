---
title: 'TTS · 음성지원'
---

# TTS

음성지원 · `TTS` · integration

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_08_06.html) · [Full reviewed specification](/sources/specs/components/tts.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/tts/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.0.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/tts/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/TTS.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/tts/TTS.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/tts/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/tts/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-tts.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface TTSContract {
    summary: string;
    locale: string;
    state: 'idle' | 'playing' | 'paused' | 'error' | 'unsupported';
    onRequest: (detail: {
        action: 'play' | 'pause' | 'resume' | 'stop';
        summary: string;
        locale: string;
    }) => void;
    label: string;
    size?: 'xsmall' | 'small' | 'medium';
    iconOnly?: boolean;
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `summary` | yes | `string` | data / state |
| `locale` | yes | `string` | data / state |
| `state` | yes | `'idle' \| 'playing' \| 'paused' \| 'error' \| 'unsupported'` | data / state |
| `onRequest` | yes | `(detail: {action: 'play' \| 'pause' \| 'resume' \| 'stop'; summary: string; locale: string}) => void` | semantic event request |
| `label` | yes | `string` | data / state |
| `size` | no | `'xsmall' \| 'small' \| 'medium'` | data / state |
| `iconOnly` | no | `boolean` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Named speech-start button adjacent to page title or region and explicit pause/stop controls. Read a concise purpose/flow summary, not indiscriminate whole-page text or duplication of screen reader. No automatic playback on mount/navigation.

### Plain semantic API

Independent API: summary, locale, state=idle|playing|paused|error, onRequest({action:play|pause|resume|stop,summary,locale}), label, size=small, iconOnly=false. Host confirms state; component does not invoke speech engine from prop change.

Shared state policy follows [current pilot conventions](/sources/specs/components/README.md.txt): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

### Keyboard, focus and state transitions

Native buttons Enter/Space/click once; pause and stop always available while playing. State is exposed in text/control names without competing automatic speech/live announcements. Independent policy: disable Play when unsupported and show explanation; cleanup issues stop request on route/unmount through host lifecycle.

### Responsive/mobile requirements

Visible labels recommended; icon-only has functional accessible name. Page/region placement remains attached to correct summary on narrow screens.

### Forms, reset and composition

No form/reset/IME behavior; controls type=button.

### Asset, integration and composition completion

Integration completion includes native controls + documented host driver boundary + explicit local mock supporting play/pause/stop/error. Host owns SpeechSynthesis/service, voices, consent/runtime support and actual audio. No network/real speech required by stories.

### Stable parts and states

root, play, pause, stop, label, status; idle,playing,paused,error,unsupported.

All rendered owned parts use `data-krds-component="tts"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `page`, `region`, `play`, `icon`, `xsmall`, `small`, `medium`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-tts--page`, `krds-tts--region`, `krds-tts--play-pause-stop-mock`, `krds-tts--icon`, `krds-tts--sizes`, `krds-tts--unsupported`, `krds-tts--error`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Page](/native/storybook-react/?path=/story/krds-tts--page) · [Region](/native/storybook-react/?path=/story/krds-tts--region) · [Play Pause Stop Mock](/native/storybook-react/?path=/story/krds-tts--play-pause-stop-mock) · [Icon](/native/storybook-react/?path=/story/krds-tts--icon) · [Sizes](/native/storybook-react/?path=/story/krds-tts--sizes) · [Unsupported](/native/storybook-react/?path=/story/krds-tts--unsupported) · [Error](/native/storybook-react/?path=/story/krds-tts--error).
- solid: [page](/native/storybook-solid/?path=/story/krds-tts--page) · [region](/native/storybook-solid/?path=/story/krds-tts--region) · [play-pause-stop-mock](/native/storybook-solid/?path=/story/krds-tts--play-pause-stop-mock) · [icon](/native/storybook-solid/?path=/story/krds-tts--icon) · [sizes](/native/storybook-solid/?path=/story/krds-tts--sizes) · [unsupported](/native/storybook-solid/?path=/story/krds-tts--unsupported) · [error](/native/storybook-solid/?path=/story/krds-tts--error).
- svelte: [page](/native/storybook-svelte/?path=/story/krds-tts--page) · [region](/native/storybook-svelte/?path=/story/krds-tts--region) · [play-pause-stop-mock](/native/storybook-svelte/?path=/story/krds-tts--play-pause-stop-mock) · [icon](/native/storybook-svelte/?path=/story/krds-tts--icon) · [sizes](/native/storybook-svelte/?path=/story/krds-tts--sizes) · [unsupported](/native/storybook-svelte/?path=/story/krds-tts--unsupported) · [error](/native/storybook-svelte/?path=/story/krds-tts--error).
- vue: [page](/native/storybook-vue/?path=/story/krds-tts--page) · [region](/native/storybook-vue/?path=/story/krds-tts--region) · [play-pause-stop-mock](/native/storybook-vue/?path=/story/krds-tts--play-pause-stop-mock) · [icon](/native/storybook-vue/?path=/story/krds-tts--icon) · [sizes](/native/storybook-vue/?path=/story/krds-tts--sizes) · [unsupported](/native/storybook-vue/?path=/story/krds-tts--unsupported) · [error](/native/storybook-vue/?path=/story/krds-tts--error).
- lit: [Page](/native/storybook-lit/?path=/story/krds-tts--page) · [Region](/native/storybook-lit/?path=/story/krds-tts--region) · [Play Pause Stop Mock](/native/storybook-lit/?path=/story/krds-tts--play-pause-stop-mock) · [Icon](/native/storybook-lit/?path=/story/krds-tts--icon) · [Sizes](/native/storybook-lit/?path=/story/krds-tts--sizes) · [Unsupported](/native/storybook-lit/?path=/story/krds-tts--unsupported) · [Error](/native/storybook-lit/?path=/story/krds-tts--error).
- qwik: [page](/native/storybook-qwik/?path=/story/krds-tts--page) · [region](/native/storybook-qwik/?path=/story/krds-tts--region) · [play-pause-stop-mock](/native/storybook-qwik/?path=/story/krds-tts--play-pause-stop-mock) · [icon](/native/storybook-qwik/?path=/story/krds-tts--icon) · [sizes](/native/storybook-qwik/?path=/story/krds-tts--sizes) · [unsupported](/native/storybook-qwik/?path=/story/krds-tts--unsupported) · [error](/native/storybook-qwik/?path=/story/krds-tts--error).
- angular: [page](/native/storybook-angular/?path=/story/krds-tts--page) · [region](/native/storybook-angular/?path=/story/krds-tts--region) · [play-pause-stop-mock](/native/storybook-angular/?path=/story/krds-tts--play-pause-stop-mock) · [icon](/native/storybook-angular/?path=/story/krds-tts--icon) · [sizes](/native/storybook-angular/?path=/story/krds-tts--sizes) · [unsupported](/native/storybook-angular/?path=/story/krds-tts--unsupported) · [error](/native/storybook-angular/?path=/story/krds-tts--error).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-42); [download exact source](/sources/apps/fixture-svelte/src/public-examples/TTSExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:05.240Z`. SHA-256: `a097e58a8d1692f196188d0bca075636c5c7125083834e47e71313842536e280`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_08_06.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
