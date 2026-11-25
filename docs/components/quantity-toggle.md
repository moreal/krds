---
title: 'Quantity toggle'
---

# Quantity toggle {#quantity-toggle}

**수량 토글** — 버튼으로 수량을 하나씩 늘리거나 줄이게 합니다.

`QuantityToggle` · `@unofficial-krds/<프레임워크>/quantity-toggle` · CSS `@unofficial-krds/styles/quantity-toggle.css`

## 사용법 {#usage}

- 증명서 발급 부수나 관람 인원처럼 대부분의 사용자가 비슷한 값을 고르는 수량을, 키보드 입력 없이 버튼으로 조정하게 할 때 씁니다.
- 나이처럼 고를 수 있는 값의 범위가 넓으면 쓰지 않습니다. 선택할 수 있는 값은 11단계 이내로 제한하고, 더 많이 필요하면 텍스트 입력 필드를 씁니다.
- 처음 값은 사용자가 가장 자주 고르는 값으로 둡니다.
- 레이블을 항상 제공해 어떤 수량을 고르는지 알 수 있게 합니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `value` | `number` | — | 현재 수량을 직접 제어합니다. `defaultValue`와 함께 쓸 수 없습니다. |
| `defaultValue` | `number` | `min` 값 | 직접 제어하지 않을 때 처음 수량입니다. |
| `onValueChange` | `(detail: ValueChangeDetails<number>) => void` | — | 사용자가 감소·증가 버튼으로 수량을 바꾸면 `{value}`를 받아 불립니다. 최솟값이나 최댓값에서 더 누를 때는 불리지 않습니다. |
| `id` | `string` | — | 컨트롤에 붙일 `id`입니다. 바깥의 레이블이나 설명에서 이 컨트롤을 가리킬 때 씁니다. |
| `name` | `string` | — | 폼을 제출할 때 쓰는 이름입니다. 주면 현재 수량이 이 이름으로 제출됩니다. |
| `label` **필수** | `string` | — | 어떤 수량인지 알려 주는 레이블입니다. 감소·증가 버튼의 이름에도 쓰입니다. |
| `disabled` | `boolean` | `false` | `true`이면 두 버튼 모두 조작할 수 없고 폼 제출 값에서도 빠집니다. |
| `required` | `boolean` | `false` | 반드시 값을 골라야 하는 항목임을 나타냅니다. |
| `invalid` | `boolean` | `false` | 입력값에 오류가 있는 상태로 표시합니다. 오류 내용은 `errorId`가 가리키는 문구로 알려 줍니다. |
| `helpId` | `string` | — | 도움말 문구 요소의 `id`입니다. 화면 낭독기가 컨트롤과 함께 읽도록 설명으로 연결합니다. |
| `errorId` | `string` | — | 오류 문구 요소의 `id`입니다. `invalid`일 때 설명으로 연결합니다. |
| `min` | `number` | `0` | 고를 수 있는 가장 작은 값입니다. |
| `max` | `number` | `10` | 고를 수 있는 가장 큰 값입니다. |
| `step` | `number` | `1` | 버튼을 한 번 누를 때 바뀌는 크기입니다. `min`부터 `max`까지 `step` 간격으로 나눈 값이 11개를 넘을 수 없습니다. |
| `unit` | `string` | — | 수량 뒤에 붙여 보여 줄 단위입니다. |

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
| `Tab` / `Shift+Tab` | 감소 버튼과 증가 버튼 사이를 이동합니다. |
| `Enter` / `Space` | 초점이 있는 버튼으로 수량을 한 단계 줄이거나 늘립니다. |

## 접근성 {#accessibility}

- 레이블이 붙은 그룹으로 묶고, 버튼에는 레이블을 포함한 이름(예: “인원 줄이기”, “인원 늘리기”)을 붙입니다.
- 수량이 바뀌면 화면 낭독기가 새 값을 읽습니다. 가운데 수량은 읽기 전용 텍스트이며 직접 입력할 수 없습니다.
- 최솟값이나 최댓값에 닿은 버튼은 사용할 수 없는 상태로 알리되 초점은 그대로 유지합니다.
- 버튼은 수량을 가운데 두고 양쪽에 떨어뜨려 배치하고, 누르기 쉽게 충분히 크게 유지합니다.

## 알아 둘 점 {#notes}

- `name`을 주면 현재 수량을 숫자 문자열로 폼과 함께 제출합니다.
- 폼을 초기화하면 처음 수량으로 돌아갑니다. 이때 `onValueChange`는 불리지 않습니다.
- 버튼을 길게 눌러도 값이 연속으로 바뀌지 않습니다. 한 번 누를 때마다 한 단계씩 바뀝니다.
- 버튼은 `type="button"`이므로 폼 안에서 눌러도 폼이 제출되지 않습니다.

## 스타일링 {#styling}

`@unofficial-krds/styles/quantity-toggle.css`를 가져옵니다. 각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `at-minimum`, `at-maximum`, `disabled` |
| `label` | 없음 |
| `decrement` | `at-minimum`, `disabled` |
| `output` | `at-minimum`, `at-maximum`, `disabled` |
| `increment` | `at-maximum`, `disabled` |
| `hidden-input` | `disabled` |

```css
[data-krds-component="quantity-toggle"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_12_04.html)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
