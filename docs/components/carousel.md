---
title: 'Carousel'
---

# Carousel {#carousel}

**캐러셀** — 여러 콘텐츠를 한 자리에서 차례로 넘겨 보여 줍니다.

## 사용법 {#usage}

- 관련 있는 콘텐츠 여러 개를 한 영역에서 넘겨 보게 할 때 씁니다.
- 중요한 정보에는 쓰지 않습니다. 사용자는 대개 모든 슬라이드를 넘겨 보지 않습니다.
- 슬라이드는 5개 이내로 두고 중요한 것을 앞에 둡니다. 더 많으면 목록으로 보여 줍니다.
- 슬라이드의 글은 1~2줄로 짧게 쓰고, 글자를 이미지 안에 넣지 않습니다.
- 자동으로 넘기려면 내용을 읽기에 충분한 간격을 `intervalMs`로 줍니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `items` **필수** | `readonly {id: string; label: string; content: string}[]` | — | 슬라이드 목록입니다. 항목마다 고유한 `id`, 슬라이드 이름 `label`, 표시할 `content`를 넣습니다. 항목이 하나뿐이면 이동 버튼과 위치 표시, 재생 버튼을 모두 숨깁니다. |
| `index` | `number` | — | 현재 슬라이드의 순번을 직접 제어합니다. 넘기면 `onIndexChange`에서 받은 값으로 갱신해야 합니다. |
| `defaultIndex` | `number` | `0` | 처음에 보여 줄 슬라이드의 순번입니다. 상태를 직접 제어하지 않을 때 씁니다. |
| `onIndexChange` | `(detail: {index: number; reason: 'previous' \| 'next' \| 'indicator' \| 'swipe' \| 'timer'}) => void` | — | 슬라이드를 바꾸려 할 때 불립니다. 옮겨 갈 `index`와 `reason`을 받습니다. `reason`은 이전·다음 버튼이면 `previous`·`next`, 위치 표시를 누르면 `indicator`, 밀어서 넘기면 `swipe`, 자동 재생이면 `timer`입니다. |
| `layout` | `'single' \| 'multiple'` | — | 한 번에 슬라이드 하나만 보여 줄지(`single`) 여러 개를 나란히 보여 줄지(`multiple`) 정합니다. |
| `autoplay` | `boolean` | `false` | 처음부터 자동으로 넘기기 시작할지 정합니다. 처음 한 번만 읽습니다. |
| `intervalMs` | `number` | `6000` | 자동 재생에서 다음 슬라이드로 넘어가기까지의 시간(밀리초)입니다. |
| `playing` | `boolean` | — | 자동 재생 여부를 직접 제어합니다. `true`여도 사용자가 정지했거나 캐러셀 위에 포인터나 초점이 있으면 넘어가지 않습니다. |
| `defaultPlaying` | `boolean` | — | 처음에 자동 재생을 켤지 정합니다. 지정하지 않으면 `autoplay` 값을 따릅니다. |
| `onPlayingChange` | `(detail: {playing: boolean; reason: 'play' \| 'stop' \| 'navigation'}) => void` | — | 사용자가 자동 재생을 켜거나 끄려 할 때 불립니다. 바뀔 `playing` 값과 `reason`을 받습니다. `reason`은 재생 버튼이면 `play`, 정지 버튼이면 `stop`, 슬라이드를 직접 넘겨 멈춘 경우 `navigation`입니다. |
| `loop` | `boolean` | `false` | `true`로 두면 마지막 슬라이드 다음에 첫 슬라이드로 이어집니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

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

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 정지·재생 버튼, 이동 버튼, 위치 표시, 보이는 슬라이드 안의 요소를 차례로 이동합니다. 초점이 캐러셀 안으로 들어오면 자동 재생이 멈춥니다. |
| `Enter` / `Space` | 초점이 있는 버튼을 실행합니다. 이전·다음 슬라이드로 넘기거나 자동 재생을 멈추고 다시 시작합니다. |
| `←` / `→` | 위치 표시에 초점이 있을 때 이전이나 다음 슬라이드로 넘깁니다. |

## 접근성 {#accessibility}

- 자동 재생을 쓸 수 있는 캐러셀에서는 정지·재생 버튼이 가장 먼저 초점을 받습니다.
- 키보드 초점이 들어오거나 사용자가 슬라이드를 직접 넘기면 자동 재생이 멈추고, 재생 버튼을 누르기 전에는 다시 시작하지 않습니다. 포인터를 올려 둔 동안에도 멈춥니다.
- 가려졌거나 일부만 보이는 슬라이드는 초점을 받지 않고 화면 낭독기도 읽지 않습니다.
- 밀어서 넘기는 동작 없이도 버튼만으로 모든 슬라이드에 갈 수 있습니다.
- 동작 줄이기 설정을 켠 사용자에게는 자동 재생과 슬라이드 애니메이션을 쓰지 않습니다.
- 슬라이드마다 배경색이나 테두리로 경계를 분명히 하고, 이동 버튼과 위치 표시가 슬라이드 내용을 가리지 않게 합니다.

## 알아 둘 점 {#notes}

- 위치 표시는 넓은 화면에서 점 모양 버튼이고, 화면 너비가 1023px보다 좁으면 '3/5' 같은 숫자로 바뀝니다.
- `index`와 `defaultIndex`, `playing`과 `defaultPlaying`은 각각 함께 쓰지 않습니다.
- 자동 재생으로 넘어갈 때도 `onIndexChange`가 `reason: 'timer'`로 불립니다. `index`를 직접 제어한다면 이때도 값을 갱신해야 슬라이드가 넘어갑니다.
- 멈췄다가 다시 재생하면 남은 시간이 아니라 `intervalMs` 전체를 새로 기다립니다.
- 좌우로 밀어서 넘길 수 있으며, 세로 페이지 스크롤은 방해하지 않습니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `active`, `hidden`, `playing`, `paused`, `disabled` |
| `viewport` | `playing`, `paused` |
| `list` | 없음 |
| `slide` | `active`, `hidden` |
| `previous` | `disabled` |
| `next` | `disabled` |
| `indicators` | 없음 |
| `indicator` | `active` |
| `position` | 없음 |
| `play-pause` | `playing`, `paused`, `disabled` |
| `stop-intent` | `paused`, `disabled` |

```css
[data-krds-component="carousel"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_04_09.html)
- [상세 명세](/sources/specs/components/carousel.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
