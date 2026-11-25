---
title: 'Textarea'
---

# Textarea {#textarea}

**텍스트 영역 (Textarea)** — 여러 줄의 글을 입력받습니다.

`Textarea` · `@unofficial-krds/<프레임워크>/textarea` · CSS `@unofficial-krds/styles/textarea.css`

## 사용법 {#usage}

- 여러 줄의 텍스트를 입력받을 때 씁니다. 한 줄로 끝나는 값에는 텍스트 입력 필드를 씁니다.
- 여러 질문의 답을 한 영역에 받지 않습니다. 질문을 나누고, 가능하면 라디오 버튼이나 체크박스로 답하게 합니다.
- 높이는 예상되는 입력 분량에 맞춥니다. 사용자가 스크롤하지 않고도 적당한 양의 텍스트를 한 번에 볼 수 있어야 합니다.
- 글자 수 제한이 있으면 `maxLength`를 지정해 현재 글자 수와 최대 글자 수를 입력 영역 바로 뒤에 보여 줍니다.
- 플레이스홀더를 레이블이나 도움말 대신 쓰지 않습니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `value` | `string` | — | 입력 값입니다. 지정하면 값을 직접 관리하는 제어 방식이 되며 `defaultValue`와 함께 쓰지 않습니다. |
| `defaultValue` | `string` | `""` | 처음 표시할 값입니다. 처음 한 번만 읽으며, 폼을 초기화하면 이 값으로 돌아갑니다. |
| `onValueChange` | `(detail: ValueChangeDetails<string>) => void` | — | 사용자가 값을 바꿀 때 불리며 새 값을 `value`로 받습니다. 한글을 조합하는 도중의 텍스트는 덮어쓰거나 자르지 않습니다. |
| `id` | `string` | 자동 생성 | `textarea` 요소의 `id`입니다. 레이블이 이 `id`로 연결되며, 생략하면 자동으로 만듭니다. |
| `name` | `string` | — | 폼을 제출할 때 쓰는 필드 이름입니다. |
| `label` **필수** | `string` | — | 입력 영역 위에 항상 보이는 레이블입니다. 무엇을 입력해야 하는지 알려 줍니다. |
| `disabled` | `boolean` | `false` | 입력을 비활성화합니다. 초점을 받지 않고 폼 제출에서도 빠집니다. |
| `required` | `boolean` | `false` | 필수 입력임을 보조 기술에 알리고 브라우저의 필수 값 검사를 적용합니다. |
| `invalid` | `boolean` | `false` | 오류 상태로 표시하고 `aria-invalid`로 알립니다. 이때 `errorId`의 메시지가 설명으로 연결됩니다. |
| `helpId` | `string` | — | 도움말 요소의 `id`입니다. 입력 영역의 설명으로 연결되어 화면 낭독기가 함께 읽습니다. |
| `errorId` | `string` | — | 오류 메시지 요소의 `id`입니다. `invalid`일 때 입력 영역의 설명으로 연결됩니다. |
| `rows` | `number` | `5` | 처음 보이는 줄 수입니다. 입력 영역의 기본 높이를 정합니다. |
| `readOnly` | `boolean` | `false` | 값을 읽기 전용으로 만듭니다. 초점은 받을 수 있고 폼 제출에도 포함됩니다. |
| `maxLength` | `number` | — | 입력할 수 있는 최대 글자 수입니다. 지정하면 현재 글자 수 옆에 최대 글자 수를 함께 표시합니다. |

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
| `Tab` / `Shift+Tab` | 입력 영역으로 초점을 옮기거나 벗어납니다. 비활성 상태에서는 건너뜁니다. |
| `Enter` | 줄을 바꿉니다. 폼을 제출하지 않습니다. |
| `↑` / `↓` | 커서를 위아래 줄로 옮깁니다. 내용이 높이를 넘으면 영역 안에서 세로로 스크롤됩니다. |

## 접근성 {#accessibility}

- `label`이 `textarea`와 연결되어 접근 가능한 이름이 되고, 레이블을 눌러도 입력 영역에 초점이 갑니다.
- `helpId`와 `errorId`로 넘긴 요소가 입력 영역의 설명으로 연결됩니다. 도움말과 오류 메시지 요소는 직접 렌더링하고 같은 `id`를 붙입니다.
- 글자 수 표시는 입력할 때마다 화면 낭독기가 읽어 주지 않으므로 입력을 방해하지 않습니다.
- 입력 영역의 테두리나 배경은 인접 배경과 3:1 이상의 명도 대비를 유지합니다.
- 복사와 붙여넣기를 막지 않습니다.

## 알아 둘 점 {#notes}

- `name`을 주면 값이 폼과 함께 제출됩니다. `disabled`이면 제출에서 빠지고 `readOnly`이면 포함됩니다.
- 폼을 초기화하면 `defaultValue`와 글자 수 표시가 처음 상태로 돌아갑니다. `value`로 제어하는 경우에는 넘긴 값을 그대로 유지하며 `onValueChange`는 불리지 않습니다.
- 글자 수는 `maxlength`와 같은 기준(UTF-16 코드 유닛)으로 셉니다. 이모지처럼 눈에 보이는 글자 수와 다를 수 있습니다.
- 유효성 검사 시점과 오류 문구는 직접 정합니다.
- 화면이 좁거나 글자를 확대해도 오류 메시지와 글자 수가 잘리지 않습니다.

## 스타일링 {#styling}

`@unofficial-krds/styles/textarea.css`를 가져옵니다. 각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `disabled`, `readonly`, `invalid`, `focused` |
| `label` | 없음 |
| `control` | `disabled`, `readonly`, `invalid`, `focused` |
| `help` | 없음 |
| `error` | 없음 |
| `count` | `invalid` |

```css
[data-krds-component="textarea"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_09_02.html)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
