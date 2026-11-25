---
title: 'Select'
---

# Select {#select}

**셀렉트** — 펼침 목록에서 하나를 고르게 합니다.

`NativeSelect` · `@unofficial-krds/<프레임워크>/native-select` · CSS `@unofficial-krds/styles/native-select.css`

## 사용법 {#usage}

- 여러 선택지 가운데 하나를 고르게 할 때 씁니다. 브라우저와 운영체제가 제공하는 기본 선택 목록을 그대로 씁니다.
- 여러 개를 동시에 고르게 해야 하면 체크박스 같은 다른 컴포넌트를 씁니다.
- 값을 고르는 것만으로 폼을 제출하거나 다른 화면으로 이동시키지 않습니다.
- 아직 고르지 않은 상태가 필요하면 값이 빈 문자열인 안내용 옵션을 `options`의 맨 앞에 직접 넣습니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `options` | `SelectOption[]` | — | 선택지 목록입니다. 각 항목은 `value`, `label`, 선택적인 `disabled`를 가지며 `value`는 서로 달라야 합니다. 적은 순서대로 표시합니다. |
| `value` | `string` | — | 선택된 값을 직접 제어합니다. `options`에 있는 값이어야 하며 `defaultValue`와 함께 쓸 수 없습니다. |
| `defaultValue` | `string` | 비활성이 아닌 첫 번째 옵션의 값 | 직접 제어하지 않을 때 처음 선택 값입니다. `options`에 있는 값이어야 합니다. |
| `label` | `JSX.Element` | — | 컨트롤 위에 보이는 레이블입니다. 생략하려면 `aria-label`이나 `aria-labelledby`를 대신 줍니다. |
| `hint` | `JSX.Element` | — | 컨트롤 아래에 보여 주는 도움말입니다. 오류 상태에서도 숨기지 않습니다. |
| `error` | `JSX.Element` | — | 컨트롤 아래에 보여 주는 오류 문구입니다. |
| `invalid` | `boolean` | `false` | 오류 상태로 표시하고 `aria-invalid="true"`를 설정합니다. |
| `size` | `'small' \| 'medium' \| 'large'` | `"medium"` | 컨트롤의 크기입니다. |
| `onValueChange` | `(details: ValueChangeDetails<string>) => void` | — | 사용자가 다른 옵션을 골랐을 때 `{value}`를 받아 한 번 불립니다. 이미 선택된 옵션을 다시 고르거나 `value`를 바깥에서 바꿀 때는 불리지 않습니다. |
| `id` | `string` | 자동 생성 | `select` 요소의 `id`입니다. 주지 않으면 자동으로 만들어 레이블과 연결합니다. |
| `name` | `string` | — | 폼을 제출할 때 쓰는 이름입니다. |
| `required` | `boolean` | `false` | 필수 항목으로 만듭니다. 빈 값이 선택된 채로는 폼이 제출되지 않습니다. |
| `disabled` | `boolean` | `false` | `true`이면 조작할 수 없고 폼 제출 값에서도 빠집니다. |

속성 이름은 프레임워크 공통입니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/#native-content-and-event-transport).

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 셀렉트로 초점을 옮기거나 벗어납니다. |
| 화살표 키, `Enter`, `Space`, `Esc`, 글자 입력 | 목록을 열고 닫고 옵션을 고르는 동작은 브라우저와 운영체제의 기본 동작을 따르므로 환경마다 조금씩 다를 수 있습니다. |

## 접근성 {#accessibility}

- 실제 `select`와 `option` 요소를 쓰므로 화면 낭독기와 모바일 기기의 기본 선택 화면이 그대로 동작합니다.
- `label`을 주면 컨트롤과 연결합니다. 레이블을 숨겨야 하면 `aria-label`이나 `aria-labelledby`로 반드시 이름을 줍니다.
- `hint`와 `error`는 `aria-describedby`로 연결해 컨트롤과 함께 읽히게 합니다.
- 비활성 옵션은 사용자가 고를 수 없습니다.

## 알아 둘 점 {#notes}

- `name`을 주면 선택된 옵션의 `value`가 폼과 함께 제출됩니다. `form` 같은 `select`의 기본 속성도 그대로 넘길 수 있습니다.
- 폼을 초기화하면 처음 선택 값으로 돌아갑니다. 이때 `onValueChange`는 불리지 않습니다.
- `value`로 직접 제어할 때 `onValueChange`에서 값을 갱신하지 않으면 선택은 원래 값으로 되돌아갑니다.

## 스타일링 {#styling}

`@unofficial-krds/styles/native-select.css`를 가져옵니다. 각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `disabled`, `invalid` |
| `label` | 없음 |
| `control` | `disabled`, `invalid` |
| `hint` | 없음 |
| `error` | 없음 |
| `icon` | 없음 |

```css
[data-krds-component="native-select"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_06_03.html)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/)를 따릅니다.
