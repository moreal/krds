---
title: 'Text input'
---

# Text input {#text-input}

**텍스트 입력 필드** — 한 줄의 글이나 값을 입력받습니다.

`TextInput` · `@unofficial-krds/<프레임워크>/text-input` · CSS `@unofficial-krds/styles/text-input.css`

## 사용법 {#usage}

- 이름, 전화번호처럼 한 줄로 끝나는 텍스트를 입력받을 때 씁니다.
- 답을 예측할 수 없어 사용자가 자유롭게 입력해야 할 때도 씁니다. 답의 내용이나 양식이 정해져 있으면 라디오 버튼, 체크박스, 셀렉트를 씁니다.
- 여러 줄의 입력이 예상되면 텍스트 영역을 씁니다.
- 기본적으로 섹션 너비를 채우고, 우편번호처럼 길이를 예측할 수 있는 값은 그 길이에 맞춰 너비를 줄입니다. 작은 화면에서도 값이 잘리지 않아야 합니다.
- 플레이스홀더는 입력을 시작하면 사라지므로 레이블이나 도움말 대신 쓰지 않습니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `value` | `string` | — | 입력 값입니다. 지정하면 값을 직접 관리하는 제어 방식이 되며 `defaultValue`와 함께 쓰지 않습니다. |
| `defaultValue` | `string` | `""` | 처음 표시할 값입니다. 처음 한 번만 읽으며, 폼을 초기화하면 이 값으로 돌아갑니다. |
| `onValueChange` | `(detail: ValueChangeDetails<string>) => void` | — | 사용자가 값을 바꿀 때 불리며 새 값을 `value`로 받습니다. 한글을 조합하는 도중에는 값을 덮어쓰지 않습니다. |
| `id` | `string` | 자동 생성 | 입력 요소의 `id`입니다. 레이블이 이 `id`로 입력과 연결되며, 생략하면 자동으로 만듭니다. |
| `name` | `string` | — | 폼을 제출할 때 쓰는 필드 이름입니다. |
| `label` **필수** | `string` | — | 입력 위에 항상 보이는 레이블입니다. 무엇을 입력해야 하는지 알려 줍니다. |
| `disabled` | `boolean` | `false` | 입력을 비활성화합니다. 초점을 받지 않고 폼 제출에서도 빠집니다. |
| `required` | `boolean` | `false` | 필수 입력임을 보조 기술에 알리고 브라우저의 필수 값 검사를 적용합니다. |
| `invalid` | `boolean` | `false` | 오류 상태로 표시하고 `aria-invalid`로 알립니다. 이때 `errorId`의 메시지가 설명으로 연결됩니다. |
| `helpId` | `string` | — | 도움말 요소의 `id`입니다. 입력의 설명으로 연결되어 화면 낭독기가 함께 읽습니다. |
| `errorId` | `string` | — | 오류 메시지 요소의 `id`입니다. 오류 상태일 때 입력의 설명으로 연결됩니다. |
| `type` | `'text' \| 'email' \| 'tel' \| 'url' \| 'password' \| 'search'` | `"text"` | 입력 종류입니다. `text`, `email`, `tel`, `url`, `password`, `search` 중 하나이며 모바일 키보드와 브라우저 동작이 이에 맞춰집니다. |
| `autocomplete` | `string` | — | 브라우저 자동 완성 토큰입니다. 이름·연락처처럼 반복해서 입력하는 개인 정보에 지정합니다. |
| `inputMode` | `string` | — | 모바일에서 띄울 가상 키보드 종류를 지정합니다. |
| `readOnly` | `boolean` | `false` | 값을 읽기 전용으로 만듭니다. 초점은 받을 수 있고 폼 제출에도 포함됩니다. |
| `minLength` | `number` | — | 입력해야 하는 최소 글자 수입니다. |
| `maxLength` | `number` | — | 입력할 수 있는 최대 글자 수입니다. |
| `pattern` | `string` | — | 값이 따라야 하는 정규식입니다. 브라우저 유효성 검사에 쓰입니다. |
| `status` | `'default' \| 'error' \| 'success'` | `"default"`, `invalid`이면 `"error"` | `error` 또는 `success`로 두면 오류·성공 상태를 표시합니다. `error`는 `invalid`를 준 것과 같이 `aria-invalid`도 함께 알립니다. |
| `size` | `Size` | `"medium"` | 입력의 크기입니다. `small`, `medium`, `large` 중 하나입니다. |
| `iconAction` | `{label: string; onAction: () => void}` | — | 입력 안에 아이콘 버튼을 추가합니다. `label`은 버튼의 접근 가능한 이름이고, `onAction`은 버튼을 누를 때 불립니다. 이 버튼은 폼을 제출하지 않으며 `disabled`이면 함께 비활성화됩니다. |

속성 이름은 프레임워크 공통입니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입입니다.

```ts
export interface ValueChangeDetails<T> {
    value: T;
}

export type Size = 'small' | 'medium' | 'large';
```

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 입력과 아이콘 버튼으로 초점을 옮깁니다. 비활성 상태에서는 건너뜁니다. |
| `Enter` / `Space` | 아이콘 버튼에 초점이 있을 때 `iconAction.onAction`을 실행합니다. |

## 접근성 {#accessibility}

- `label`이 입력과 연결되어 접근 가능한 이름이 되고, 레이블을 눌러도 입력에 초점이 갑니다.
- `helpId`와 `errorId`로 넘긴 요소가 입력의 설명으로 연결됩니다. 도움말과 오류 메시지 요소는 직접 렌더링하고 같은 `id`를 붙입니다.
- 오류와 성공 상태는 색만이 아니라 메시지 텍스트로도 전달합니다.
- 아이콘 버튼에는 기능을 설명하는 `label`을 반드시 줍니다.
- 복사와 붙여넣기를 막지 않습니다.

## 알아 둘 점 {#notes}

- `name`을 주면 값이 폼과 함께 제출됩니다. `disabled`이면 제출에서 빠지고 `readOnly`이면 포함됩니다.
- 폼을 초기화하면 `defaultValue`로 돌아갑니다. `value`로 제어하는 경우에는 넘긴 값을 그대로 유지하며 `onValueChange`는 불리지 않습니다.
- 유효성 검사 시점과 오류 문구는 직접 정합니다.

## 스타일링 {#styling}

`@unofficial-krds/styles/text-input.css`를 가져옵니다. 각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `invalid`, `success`, `disabled`, `readonly`, `focused` |
| `label` | 없음 |
| `control` | `invalid`, `success`, `disabled`, `readonly`, `focused` |
| `help` | 없음 |
| `error` | 없음 |
| `icon-action` | `disabled` |

```css
[data-krds-component="text-input"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_09_03.html)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
