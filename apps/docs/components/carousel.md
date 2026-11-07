---
title: '캐러셀 · Carousel'
---

# 캐러셀 {#carousel}

Carousel · `Carousel` · component

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_04_09.html) · [검토된 전체 명세](/sources/specs/components/carousel.md.txt) · [프레임워크 지원](../compatibility/)

## 네이티브 지원 현황 {#native-availability}

아래 상태는 `catalog/coverage.json`에서 그대로 가져옵니다. export, 예제, 테스트 실행기 종료 코드에서 추론하지 않습니다.

| 프레임워크 | 패키지 버전 | 기록된 상태 | export 선언 | 네이티브 예제와 스토리 |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/react/package.json.txt); [과거 선언 체크포인트](/sources/packages/react/dist/components/carousel/index.d.ts.txt) | [react 소스와 미리보기 정책](../compatibility/examples#react) |
| solid | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/solid/package.json.txt); [과거 선언 체크포인트](/sources/packages/solid/dist/components/carousel/index.d.ts.txt) | [solid 소스와 미리보기 정책](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/svelte/package.json.txt); [과거 선언 체크포인트](/sources/packages/svelte/dist/components/Carousel.svelte.d.ts.txt) | [svelte 소스와 미리보기 정책](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/vue/package.json.txt); [과거 선언 체크포인트](/sources/packages/vue/dist/components/carousel/Carousel.vue.d.ts.txt) | [vue 소스와 미리보기 정책](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/lit/package.json.txt); [과거 선언 체크포인트](/sources/packages/lit/dist/components/carousel/index.d.ts.txt) | [lit 소스와 미리보기 정책](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/qwik/package.json.txt); [과거 선언 체크포인트](/sources/packages/qwik/dist/components/carousel/index.d.ts.txt) | [qwik 소스와 미리보기 정책](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/angular/package.json.txt); [과거 선언 체크포인트](/sources/packages/angular/dist/types/unofficial-krds-angular-carousel.d.ts.txt) | [angular 소스와 미리보기 정책](../compatibility/examples#angular) |
| solid-next (미리보기) | `0.1.0-preview.0` | planned | [현재 루트 매니페스트](/sources/packages/solid-next/package.json.txt); [과거 선언 체크포인트](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next 소스와 미리보기 정책](../compatibility/examples#solid-next) |

## 속성·이벤트·콘텐츠·기본값 {#props-events-content-and-defaults}

아래 의미 계약은 공유 데이터일 뿐입니다. 네이티브 콘텐츠, ref, 이벤트 전달은 각 어댑터가 맡습니다. 계약의 콜백 이름과 detail 타입은 그대로 씁니다. 머신 객체를 전달하지 않습니다. 선택 속성에는 기본값이 자동으로 채워지지 않습니다. 아래 안내의 명시적 기본값을 씁니다.

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

| 의미 속성 / 콜백 | 필수 | 정확한 타입 | 역할 |
| --- | --- | --- | --- |
| `items` | 예 | `readonly {id: string; label: string; content: string}[]` | 데이터 / 상태 |
| `index` | 아니요 | `number` | 데이터 / 상태 |
| `defaultIndex` | 아니요 | `number` | 데이터 / 상태 |
| `onIndexChange` | 아니요 | `(detail: {index: number; reason: 'previous' \| 'next' \| 'indicator' \| 'swipe' \| 'timer'}) => void` | 의미 이벤트 요청 |
| `layout` | 아니요 | `'single' \| 'multiple'` | 데이터 / 상태 |
| `autoplay` | 아니요 | `boolean` | 데이터 / 상태 |
| `intervalMs` | 아니요 | `number` | 데이터 / 상태 |
| `playing` | 아니요 | `boolean` | 데이터 / 상태 |
| `defaultPlaying` | 아니요 | `boolean` | 데이터 / 상태 |
| `onPlayingChange` | 아니요 | `(detail: {playing: boolean; reason: 'play' \| 'stop' \| 'navigation'}) => void` | 의미 이벤트 요청 |
| `loop` | 아니요 | `boolean` | 데이터 / 상태 |

선택 값과 명시적 기본값은 다릅니다. 기본값과 네이티브 콘텐츠 요구사항은 아래 검토된 안내에 있습니다.

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 네이티브 JSX/콘텐츠 prop을 씁니다. Svelte는 네이티브 snippet을 씁니다. Vue는 네이티브 슬롯을 씁니다. Angular는 네이티브 input, output, 콘텐츠 투영을 씁니다. Lit은 custom element 속성, 슬롯, DOM 이벤트를 씁니다. Qwik은 네이티브 QRL 이벤트 경계를 씁니다. 이 전달 방식은 서로 바꿔 쓸 수 없습니다. 정확한 이름과 필수 콘텐츠는 링크된 공개 패키지 선언에서 확인합니다. 아래 의미 콜백이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

라벨이 있는 캐러셀 영역에 슬라이드, 이전/다음 버튼, 위치/전체 표시기를 둡니다. 자동 재생을 요청할 수 있는 경우(제어된 playing=true, 또는 처음 수동 의도에서의 명시적 재생 포함) 정지/재생이 첫 번째 상호작용 하위 요소입니다. 상호작용 하위 요소와 AT에는 주로 보이는 슬라이드만 노출하며, 숨겨졌거나 일부만 보이는 슬라이드는 노출하지 않습니다. 항목이 하나면 캐러셀 컨트롤을 모두 숨깁니다. 슬라이드는 5개 이하를 권장합니다.

### 의미 API {#plain-semantic-api}

독립 API: items {id,label,content}[], `index?/defaultIndex=0`, `onIndexChange({index,reason})`, layout=single|multiple, autoplay=false, intervalMs=6000, `playing?:boolean`, `defaultPlaying?:boolean`, `onPlayingChange({playing:boolean,reason:play|stop|navigation})`, loop=false. playing이 정의되면 제어되는 **재생 의도(playback intent)**이고, 없으면 비제어 의도입니다. defaultPlaying은 한 번만 읽으며 기본값은 autoplay입니다. 둘 다 주거나 모드를 바꾸는 것은 잘못된 사용입니다. autoplay는 한 번만 읽는 비제어 의도 초기화 값이며, 제어된 playing이나 정지 래치를 덮어쓰지 않습니다. 슬라이드가 둘 이상이면 재생 가능 API는 처음 의도가 수동/false여도 재생/정지 컨트롤을 첫 번째로 렌더합니다. prop만으로는 콜백이 나오지 않습니다. 표시기는 데스크톱에서 점(dots), 1023px 미만에서 분수(fraction)입니다.

재생 의도는 허락일 뿐, 타이머가 진행 중이라는 증거가 아닙니다. 실제 진행에는 다음이 모두 필요합니다. 커밋된 의도 true, 사용 가능한 슬라이드 둘 이상, 이용 가능한 다음 인덱스, 보이는 마운트된 문서, 현재 호버 억제 없음, 초점 정지/수동·탐색 정지 래치 없음, 동작 줄이기 허용. 로컬 안전/공식 억제 상태는 제어된 playing prop을 바꾸지 않고도 진행을 멈출 수 있습니다. 초점, 호버, 문서 가시성, 마운트, prop 변경은 **사용자 재생 변경 알림을 내지 않습니다**. 재생/정지 또는 사용자 탐색은 요청 의도가 다를 때만 의도 변경을 한 번 요청합니다. 제어 거부는 의도 prop을 바꾸지 않지만, 해당 정지 래치가 실제 움직임을 계속 막습니다. 재생/일시정지 레이블과 재생 중/일시정지 렌더 상태는 의도가 아니라 실제 허용된 진행을 나타냅니다.

타이머 틱은 진행이 허용될 때만 `onIndexChange`를 `reason:"timer"`로 한 번 호출해 다음 인덱스를 요청합니다. 이는 명시적인 시스템 기원 인덱스 요청이며, 사용자 사유 next/previous/indicator/swipe와 구별되고 사용자 재생 알림이 아닙니다. 비제어 인덱스는 변경된 적격 틱마다 커밋합니다. 제어 인덱스는 호스트가 요청을 거부하면 prop 값을 유지합니다. 중복 입력/클릭 이벤트나 prop/리셋/마운트 인덱스 콜백은 나오지 않습니다. 새 간격마다 현재 커밋된 인덱스를 기준으로 다음 인덱스를 다시 요청할 수 있습니다. 거부된 틱이 인덱스를 몰래 바꾸지 않습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

이전/다음/표시기 버튼과 좌우 표시기 탐색은 스와이프 없이 동작합니다. 스와이프/드래그가 세로 페이지 스크롤을 가로채면 안 됩니다. 공식 초점 진입은 실제로 진행을 멈추고, 명시적 재생 전까지 그 정지를 래치합니다([L1335–1338](https://www.krds.go.kr/html/site/component/component_04_09.html)). 초점을 벗어나거나 호스트가 playing=true를 써도 이 래치는 풀리지 않습니다. 초점 진입은 바깥에서 캐러셀 안으로 넘어오는 것을 뜻하며, 내부 초점 이동은 두 번째 진입을 만들지 않습니다. 호버는 포인터가 캐러셀 위에 있는 동안 제어 의도나 무시된 일시정지 요청과 관계없이 항상 실제 진행을 막습니다([L1347–1350](https://www.krds.go.kr/html/site/component/component_04_09.html)).

명시적 정지와 사용자 슬라이드 탐색도 로컬 정지 래치를 설정합니다(탐색 정지는 프로젝트 정책). 명시적 재생만이 초점/수동/탐색 정지 래치를 모두 풀며, 현재 의도가 false면 true 의도도 요청합니다. 따라서 초점이 안에 남아 있어도 재생은 재생을 허용할 수 있지만, 여전히 호버 중이면 포인터가 떠날 때까지 실제로는 멈춰 있습니다. 호버 종료만으로는 초점/수동 래치를 풀 수 없습니다. 제어된 재생 요청이 거부되면 의도는 false로 남고 움직임은 없습니다. 의도가 이미 true인데 억제된 상태라면, 재생은 중복 현재값 콜백 없이 래치만 풀 수 있습니다. 제어된 playing=true에서 명시적 정지는 false를 한 번 요청하고, 부모가 거부해도 로컬에서 멈춥니다. 의도를 외부에서 false/true로 바꾸는 것은 명시적 재생으로 치지 않습니다.

억제가 시작되면 활성 간격을 즉시 취소합니다. 모든 게이트가 다시 진행을 허용하면 이미 일부 지난 틱을 발사하지 않고 새 전체 간격을 시작합니다. 현재 초점이 있는 슬라이드가 숨겨지기 전에 안전한 초점을 복원합니다. 숨김/언마운트 시 타이머와 옵저버를 정리합니다. 이전 세대 틱은 해체나 교체 후 인덱스를 요청할 수 없습니다.

**로컬 억제 중 명시적 정지(수용된 독립 결정):** 슬라이드가 둘 이상이면 첫 재생 컨트롤 그룹은 기본 재생-일시정지 레이블을 실제 허용된 진행에 맞춰 정직하게 유지합니다. 진행 중에는 정지, 일시정지 중에는 재생입니다. 커밋된 재생 의도가 true인데 실제 진행이 억제된 동안에는, 이름이 자동 재생 중지인 별도의 네이티브 type=button도 렌더합니다. 소유 파트는 stop-intent이고 paused/disabled 어휘를 씁니다. 이 버튼은 슬라이드 탐색보다 앞선 첫 재생 그룹에 둡니다. 실제 포인터 클릭이나 키보드 활성화로 누르면 수동 정지를 래치하고, 제어 호스트가 거부해도 reason stop인 playing=false 요청을 한 번 냅니다. 거부가 래치를 풀거나 의도 prop을 바꾸지 않습니다. 수동적 초점/호버는 재생 요청을 내지 않습니다. 호버/초점 이전의 오래된 레이블을 캡처하거나 합성 디스패치로 정지 동작을 주장하면 안 됩니다. 명시적 재생은 기존 래치 해제 및 현재 의도 무동작 콜백 규칙을 유지합니다. 항목이 하나인 캐러셀은 기본 컨트롤, stop-intent, 탐색 컨트롤을 렌더하지 않습니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

1023px 미만에서는 점 대신 분수 표시기를 씁니다. 터치 컨트롤은 44×44 이상을 권장하고 포인터는 17×17 이상입니다. 내용은 1~2줄로 읽을 수 있어야 하고 경계가 분명해야 합니다. 동작 줄이기에서는 기본적으로 자동 재생과 슬라이드 애니메이션이 없으며, 이는 문서화된 독립 접근성 선택입니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

폼/리셋 상태가 없습니다. 내장 입력에서 조합 키로 탐색하지 않습니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

공식 예시는 Swiper CSS/JS를 참조합니다. 네이티브 계약은 KRDS 원본 JS를 실행하거나 Swiper를 요구하지 않고 문서화된 결과를 재현합니다. 슬라이드 콘텐츠와 로컬 자산은 호스트 소유입니다. 완료에는 실제 탐색·자동 재생 상태와 숨겨진 슬라이드 접근성이 포함되어야 합니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, viewport, list, slide, previous, next, indicators, indicator, position, play-pause, stop-intent; active,hidden,playing,paused,disabled.

렌더되는 모든 소유 파트는 `data-krds-component="carousel"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위 열거는 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정됩니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

지원하는 케이스 축: `single`, `multiple`, `autoplay`, `manual`, `full-banner`, `element-banner`. 이 케이스 이름은 프로젝트의 독립 축입니다. 공식 KRDS 유형 이름이나 완료된 커버리지를 뜻하지 않습니다.

[필수 네이티브 스토리 매니페스트](/sources/catalog/full-catalog-stories.json.txt) · [파일럿 스토리 매니페스트](/sources/catalog/story-cases.json.txt) · [커버리지 근거와 네이티브 리뷰 링크](/sources/catalog/coverage.json.txt)

필수 전체 카탈로그 스토리: `krds-carousel--single`, `krds-carousel--multiple`, `krds-carousel--manual`, `krds-carousel--autoplay`, `krds-carousel--paused-on-focus`, `krds-carousel--single-item`, `krds-carousel--narrow-fraction`, `krds-carousel--reduced-motion`, `krds-carousel--controlled-inhibition`, `krds-carousel--play-while-focused-hovered`, `krds-carousel--controlled-stop-rejected`, `krds-carousel--timer-request-rejected`.

### 로컬 네이티브 스토리 {#local-native-stories}

픽스처와 Storybook 출력은 로컬 전용입니다. 이 공개 문서 사이트에 올리지 않습니다. 로컬 문서 서버도 그쪽으로 리디렉션하지 않습니다. 각 네이티브 Storybook은 자기 워크스페이스 스크립트로 실행합니다. 컴포넌트 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/` 아래에 조립된 네이티브 미리보기입니다. Solid 2에는 지원되는 네이티브 Storybook 통합이 없습니다. Qwik 프로덕션 SSR/resume에는 실제 서버가 필요합니다. 정적 미리보기로 대신할 수 없습니다. 스토리가 있다고 동작 인수가 성립하지는 않습니다.

네이티브 컴파일러 체크포인트입니다. 소스 해시는 문서를 빌드할 때마다 검증합니다. 이 기록은 최신 네이티브 후보나 동작 인수를 인증하지 않습니다. 검사된 소스 페이지마다 체크포인트 범위가 적혀 있습니다.

- react: [검사된 소비 코드 보기](/examples/react-1); [소스 그대로 내려받기](/sources/packages/react/examples/catalog.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [검사된 소비 코드 보기](/examples/solid-3); [소스 그대로 내려받기](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [검사된 소비 코드 보기](/examples/svelte-22); [소스 그대로 내려받기](/sources/apps/fixture-svelte/src/public-examples/CarouselExample.svelte.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [검사된 소비 코드 보기](/examples/vue-58); [소스 그대로 내려받기](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [검사된 소비 코드 보기](/examples/lit-60); [소스 그대로 내려받기](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [검사된 소비 코드 보기](/examples/qwik-61); [소스 그대로 내려받기](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [검사된 소비 코드 보기](/examples/angular-62); [소스 그대로 내려받기](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## 출처와 권리 {#source-identity-and-rights}

기준선: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. 공식 상세 스냅숏 수집 시각: `2026-10-29T23:28:03.834Z`. SHA-256: `73d7d8f2691f3db02ede19f601675b4a23310fce5239e7b50211002d9676581d`. [고정된 컴포넌트 출처 기록](/sources/catalog/components.json.txt) · [공식 출처](https://www.krds.go.kr/html/site/component/component_04_09.html). 원본 HTML은 체크아웃의 참고 근거로만 남습니다. 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
