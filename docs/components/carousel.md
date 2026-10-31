---
title: 'Carousel · 캐러셀'
---

# Carousel

캐러셀 · `Carousel` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_04_09.html) · [Full reviewed specification](/sources/specs/components/carousel.md.txt) · [Framework support](../compatibility/README.md)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [current subpath manifest](/sources/packages/react/package.json.txt); [historical declaration checkpoint](/sources/packages/react/dist/components/carousel/index.d.ts.txt) | [react sources and preview policy](../compatibility/README.mdexamples#react) |
| solid | `0.1.0` | planned | [current subpath manifest](/sources/packages/solid/package.json.txt); [historical declaration checkpoint](/sources/packages/solid/dist/components/carousel/index.d.ts.txt) | [solid sources and preview policy](../compatibility/README.mdexamples#solid) |
| svelte | `0.1.0` | planned | [current subpath manifest](/sources/packages/svelte/package.json.txt); [historical declaration checkpoint](/sources/packages/svelte/dist/components/Carousel.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/README.mdexamples#svelte) |
| vue | `0.1.0` | planned | [current subpath manifest](/sources/packages/vue/package.json.txt); [historical declaration checkpoint](/sources/packages/vue/dist/components/carousel/Carousel.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/README.mdexamples#vue) |
| lit | `0.1.0` | planned | [current subpath manifest](/sources/packages/lit/package.json.txt); [historical declaration checkpoint](/sources/packages/lit/dist/components/carousel/index.d.ts.txt) | [lit sources and preview policy](../compatibility/README.mdexamples#lit) |
| qwik | `0.1.0` | planned | [current subpath manifest](/sources/packages/qwik/package.json.txt); [historical declaration checkpoint](/sources/packages/qwik/dist/components/carousel/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/README.mdexamples#qwik) |
| angular | `0.1.0` | planned | [current subpath manifest](/sources/packages/angular/package.json.txt); [historical declaration checkpoint](/sources/packages/angular/dist/types/unofficial-krds-angular-carousel.d.ts.txt) | [angular sources and preview policy](../compatibility/README.mdexamples#angular) |
| solid-next (preview) | `0.1.0-preview.0` | planned | [current root manifest](/sources/packages/solid-next/package.json.txt); [historical declaration checkpoint](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/README.mdexamples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface CarouselContract {
    items: readonly {
        id: string;
        label: string;
        content: string;
    }[];
    index?: number;
    defaultIndex?: number;
    onIndexChange?: (detail: {
        index: number;
        reason: 'previous' | 'next' | 'indicator' | 'swipe' | 'timer';
    }) => void;
    layout?: 'single' | 'multiple';
    autoplay?: boolean;
    intervalMs?: number;
    playing?: boolean;
    defaultPlaying?: boolean;
    onPlayingChange?: (detail: {
        playing: boolean;
        reason: 'play' | 'stop' | 'navigation';
    }) => void;
    loop?: boolean;
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `items` | yes | `readonly {id: string; label: string; content: string}[]` | data / state |
| `index` | no | `number` | data / state |
| `defaultIndex` | no | `number` | data / state |
| `onIndexChange` | no | `(detail: {index: number; reason: 'previous' \| 'next' \| 'indicator' \| 'swipe' \| 'timer'}) => void` | semantic event request |
| `layout` | no | `'single' \| 'multiple'` | data / state |
| `autoplay` | no | `boolean` | data / state |
| `intervalMs` | no | `number` | data / state |
| `playing` | no | `boolean` | data / state |
| `defaultPlaying` | no | `boolean` | data / state |
| `onPlayingChange` | no | `(detail: {playing: boolean; reason: 'play' \| 'stop' \| 'navigation'}) => void` | semantic event request |
| `loop` | no | `boolean` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Labeled carousel region with slides, previous/next buttons and position/total indicator. Whenever automatic playback can be requested, including controlled playing=true or explicit Play from initially manual intent, stop/play is the first interactive descendant. Only primary visible slides expose interactive descendants/AT; hidden/partial slides do not. One item hides all carousel controls. Slide count &lt;=5 guidance.

### Plain semantic API

Independent API: items {id,label,content}[], `index?/defaultIndex=0`, `onIndexChange({index,reason})`, layout=single|multiple, autoplay=false, intervalMs=6000, `playing?:boolean`, `defaultPlaying?:boolean`, `onPlayingChange({playing:boolean,reason:play|stop|navigation})`, loop=false. Defined playing chooses controlled **playback intent**, absent playing chooses uncontrolled intent; defaultPlaying is read once and defaults to autoplay. Supplying both/mode switching is invalid. autoplay is a read-once uncontrolled intent initializer, not an override for controlled playing or any stop latch. For two or more slides the playback-capable API renders its Play/Stop control first even when initial intent is manual/false. Props alone emit no callbacks. Indicator=dots desktop/fraction below 1023px.

Playback intent is permission, not proof that a timer is advancing. Actual advancement requires committed intent true, at least two usable slides, an available next index, a visible mounted document, no current hover inhibition, no focus-stop or manual/navigation-stop latch, and reduced-motion permission. The local safety/official-inhibition state can halt advancement without mutating a controlled playing prop. Focus, hover, document visibility, mount and prop changes emit **zero user playback-change notifications**. Play/Stop or user navigation request intent changes once only when requested intent differs; a controlled rejection leaves the intent prop unchanged while the applicable stop latch still prevents actual motion. The play/pause label and playing/paused rendered state describe actual permitted advancement, not intent alone.

Timer ticks call `onIndexChange` once with `reason:"timer"` and a next-index request only while advancement is permitted. This is explicitly a system-origin index request, distinguishable from user reasons next/previous/indicator/swipe; it is not a user playback notification. Uncontrolled index commits each eligible changed tick; controlled index remains the prop if the host rejects the request. No duplicate input/click event or prop/reset/mount index callback is emitted. Each new interval may request another next index against the current committed index; a rejected tick never silently mutates it.

### Keyboard, focus and state transitions

Previous/next/indicator buttons and left/right indicator navigation work without swipe; swipe/drag must not hijack vertical page scroll. Official focus entry actually stops advancement and latches that stop until explicit Play ([L1335–1338](https://www.krds.go.kr/html/site/component/component_04_09.html)); leaving focus or a host writing playing=true never clears that latch. Focus entry means crossing from outside into the carousel; internal focus movement does not fabricate a second entry. Hover always inhibits actual advancement while the pointer remains over the carousel ([L1347–1350](https://www.krds.go.kr/html/site/component/component_04_09.html)), regardless of controlled intent or ignored pause requests.

Explicit Stop and user slide navigation also set a local stop latch (navigation stop is project policy). Explicit Play is the only action that clears the focus/manual/navigation stop latches; it also requests true intent if currently false. Thus Play while focus remains inside may permit playback, but Play while still hovered remains actually paused until pointer leaves; hover exit alone cannot clear a focus/manual latch. If a controlled Play request is rejected, intent remains false and no motion occurs. If intent is already true but inhibited, Play can clear latches without a redundant current-value callback. Explicit Stop with controlled playing=true requests false once yet halts locally even when the parent refuses. Externally changing intent false/true does not count as explicit Play.

Cancel the active interval immediately on inhibition; when all gates permit advancement again, begin a fresh full interval rather than firing a stale partially elapsed tick. Restore safe focus before a currently focused slide is hidden. Hide/unmount cleans timers/observers; stale generation ticks cannot request an index after teardown or replacement.

**Explicit Stop while locally inhibited (accepted independent closure):** For at least two slides, the first playback control group keeps the primary play-pause label truthful to actual permitted advancement: 정지 while advancing, 재생 while paused. Whenever committed playback intent remains true but actual advancement is inhibited, also render a distinct native type=button named 자동 재생 중지, owned part stop-intent with paused/disabled vocabulary. It is in that first playback group before slide navigation. Activating it by a real pointer click or keyboard activation latches manual stop and emits one playing=false request with reason stop even if the controlled host rejects it; rejection never clears the latch or mutates the intent prop. Passive focus/hover emits zero playback requests. Do not capture an obsolete pre-hover/pre-focus label or use synthetic dispatch to claim a Stop action. Explicit Play retains the existing latch-clear and current-intent no-op callback rules. Single-item carousels render neither primary nor stop-intent/navigation controls.

### Responsive/mobile requirements

Below 1023px fraction indicator replaces dots. Touch controls >=44×44 recommended, pointer >=17×17; readable 1–2 line content and clear boundaries. Reduced motion defaults to no autoplay/no sliding animation, a documented independent accessibility choice.

### Forms, reset and composition

No form/reset state; no composition-key navigation from embedded inputs.

### Asset, integration and composition completion

Official examples reference Swiper CSS/JS; native contract reproduces documented outcomes without executing original KRDS JS or requiring Swiper. Host owns slide content/local assets. Completion must include actual navigation/autoplay state and hidden-slide accessibility.

### Stable parts and states

root, viewport, list, slide, previous, next, indicators, indicator, position, play-pause, stop-intent; active,hidden,playing,paused,disabled.

All rendered owned parts use `data-krds-component="carousel"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `single`, `multiple`, `autoplay`, `manual`, `full-banner`, `element-banner`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-carousel--single`, `krds-carousel--multiple`, `krds-carousel--manual`, `krds-carousel--autoplay`, `krds-carousel--paused-on-focus`, `krds-carousel--single-item`, `krds-carousel--narrow-fraction`, `krds-carousel--reduced-motion`, `krds-carousel--controlled-inhibition`, `krds-carousel--play-while-focused-hovered`, `krds-carousel--controlled-stop-rejected`, `krds-carousel--timer-request-rejected`.

### Local native stories

Fixture and Storybook outputs are local-only and are not hosted on this public documentation site. Build the selected native workspace, then run `node tools/yarn.mjs exec node apps/docs/scripts/serve.mjs`. Open `/krds/native/storybook-<framework>/` on that local server. Solid 2 has no supported native Storybook integration. Qwik production SSR/resume requires its real server and cannot be replaced by a static preview. Story availability does not establish behavioral acceptance.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [read the checked consumer](/examples/svelte-22); [download exact source](/sources/apps/fixture-svelte/src/public-examples/CarouselExample.svelte.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:03.834Z`. SHA-256: `73d7d8f2691f3db02ede19f601675b4a23310fce5239e7b50211002d9676581d`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_04_09.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/index.md) before redistributing.
