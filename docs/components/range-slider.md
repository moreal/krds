---
title: 'Range slider'
---

# Range slider {#range-slider}

**범위슬라이드** — 막대를 움직여 범위 안의 값을 고르게 합니다.

`RangeSlider` · `@unofficial-krds/<프레임워크>/range-slider` · CSS `@unofficial-krds/styles/range-slider.css`

## 사용법 {#usage}

- 볼륨, 밝기, 글자 크기, 선호도처럼 정확한 수치보다 범위 안에서의 상대적인 값을 고르게 할 때 씁니다.
- 정확한 수치를 입력받아야 하면 쓰지 않습니다. 켜기/끄기나 낮음/보통/높음처럼 몇 개 중 하나를 빠르게 고르는 경우에도 알맞지 않습니다.
- 단계를 너무 촘촘하게 나누지 않습니다. `step`은 전체 범위의 10~20% 정도가 적당합니다.
- 레이블을 항상 제공해 어떤 값을 고르는지 알 수 있게 합니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `value` | `number` | — | 현재 값을 직접 제어합니다. `defaultValue`와 함께 쓸 수 없습니다. |
| `defaultValue` | `number` | `min` 값 | 직접 제어하지 않을 때 처음 값입니다. |
| `onValueChange` | `(detail: ValueChangeDetails<number>) => void` | — | 드래그, 트랙 클릭, 키보드로 값이 바뀔 때마다 `{value}`를 받아 불립니다. 드래그하는 동안에는 값이 바뀔 때마다 여러 번 불리고, 손을 뗄 때 따로 불리지는 않습니다. |
| `id` | `string` | 자동 생성 | 슬라이더 입력의 `id`입니다. 주지 않으면 자동으로 만들어 레이블과 연결합니다. |
| `name` | `string` | — | 폼을 제출할 때 쓰는 이름입니다. |
| `label` **필수** | `string` | — | 어떤 값을 고르는지 알려 주는 레이블입니다. 항상 화면에 보입니다. |
| `disabled` | `boolean` | `false` | `true`이면 조작할 수 없고 폼 제출 값에서도 빠집니다. |
| `required` | `boolean` | `false` | 반드시 값을 골라야 하는 항목임을 나타냅니다. |
| `invalid` | `boolean` | `false` | 입력값에 오류가 있는 상태로 표시합니다. 오류 내용은 `errorId`가 가리키는 문구로 알려 줍니다. |
| `helpId` | `string` | — | 도움말 문구 요소의 `id`입니다. 화면 낭독기가 컨트롤과 함께 읽도록 설명으로 연결합니다. |
| `errorId` | `string` | — | 오류 문구 요소의 `id`입니다. `invalid`일 때 설명으로 연결합니다. |
| `min` | `number` | `0` | 고를 수 있는 가장 작은 값입니다. 트랙 끝에 표시합니다. |
| `max` | `number` | `100` | 고를 수 있는 가장 큰 값입니다. 트랙 끝에 표시합니다. |
| `step` | `number` | `10` | 한 단계의 크기입니다. 값은 `min`에서 `step` 간격으로만 고를 수 있습니다. |
| `valueText` | `(value: number) => string` | — | 값을 받아 표시할 문구를 돌려줍니다. 단위를 붙일 때 쓰며, 화면에 보이는 현재 값과 화면 낭독기가 읽는 값에 함께 적용됩니다. |

속성 이름은 프레임워크 공통입니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입입니다.

```ts
export interface ValueChangeDetails<T> {
    value: T;
}
```

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 슬라이더 핸들로 초점을 옮기거나 벗어납니다. |
| 화살표 키 | 값을 한 `step`씩 줄이거나 늘립니다. |
| `Home` / `End` | 최솟값 또는 최댓값으로 이동합니다. |

## 접근성 {#accessibility}

- 실제 `input[type=range]`를 쓰므로 드래그하지 않고도 키보드나 트랙 클릭으로 값을 바꿀 수 있습니다.
- 레이블을 슬라이더와 연결하고, 현재 값과 최솟값·최댓값을 항상 화면에 보여 줍니다.
- 단위가 있으면 `valueText`로 붙여 화면 낭독기도 같은 값을 읽게 합니다.
- 현재 값은 핸들 위나 트랙 끝에 표시해 손가락에 가려지지 않게 합니다.

## 알아 둘 점 {#notes}

- `name`을 주면 현재 값이 폼과 함께 제출됩니다.
- 폼을 초기화하면 처음 값으로 돌아갑니다. 이때 `onValueChange`는 불리지 않습니다.
- `value`로 직접 제어할 때 `onValueChange`에서 값을 갱신하지 않으면 핸들과 표시 값은 원래 값으로 되돌아갑니다.

## 스타일링 {#styling}

`@unofficial-krds/styles/range-slider.css`를 가져옵니다. 각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `disabled`, `dragging` |
| `label` | 없음 |
| `control` | `disabled`, `dragging` |
| `track` | `disabled`, `dragging` |
| `range` | `disabled` |
| `thumb` | `disabled`, `dragging` |
| `output` | 없음 |
| `minimum` | 없음 |
| `maximum` | 없음 |

```css
[data-krds-component="range-slider"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_12_01.html)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
