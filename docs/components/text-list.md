---
title: 'Text list'
---

# Text list {#text-list}

**텍스트 목록** — 관련된 내용을 순서가 있거나 없는 목록으로 나열합니다.

`TextList` · `@unofficial-krds/<프레임워크>/text-list` · CSS `@unofficial-krds/styles/text-list.css`

## 사용법 {#usage}

- 서로 관련된 짧은 텍스트 항목을 나열할 때 씁니다.
- 항목의 중요도가 같으면 순서 없는 목록을, 순서나 순위가 있으면 순서 있는 목록을 씁니다. 순서가 없는 내용에 번호를 붙이면 사용자가 내용을 잘못 이해할 수 있습니다.
- 여러 차원으로 이루어진 정보는 표로, 긴 서술형 문장은 문단으로 표현합니다.
- 목록은 3수준 이내로 구성합니다.
- 같은 수준의 항목은 어투를 통일합니다. 서술식 항목의 마지막 문장에는 종결 부호를 쓰고, 개조식에서는 생략할 수 있습니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `ordered` | `boolean` | `false` | `true`로 두면 번호가 붙는 순서 있는 목록(`ol`)으로 표시합니다. |
| `marker` | `'dot' \| 'dash' \| 'hollow'` | `"dot"` | 순서 없는 목록의 글머리 기호 모양입니다. `dot`, `dash`, `hollow` 중 하나이며 순서 있는 목록에서는 쓰이지 않습니다. |
| `items` **필수** | `readonly TextListItem[]` | — | 목록 항목입니다. 항목마다 `id`와 `content`를 주고, `children`에 하위 항목을 넣으면 중첩 목록이 됩니다. 3수준을 넘게 중첩하면 오류가 납니다. |

속성 이름은 프레임워크 공통입니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입입니다.

```ts
export interface TextListItem {
    id: string;
    content: string;
    children?: readonly TextListItem[];
}
```

## 접근성 {#accessibility}

- 순서 없는 목록은 `ul`, 순서 있는 목록은 `ol`로 표시해 화면 낭독기가 목록과 항목 수를 알려 줍니다.
- 글머리 기호 모양을 바꿔도 모바일 화면 낭독기가 목록으로 인식하도록 목록에 `role="list"`, 항목에 `role="listitem"`을 함께 붙입니다.
- 목록과 항목은 초점을 받지 않습니다.

## 알아 둘 점 {#notes}

- 줄이 바뀐 텍스트는 글머리 기호 아래가 아니라 같은 항목의 첫 줄 텍스트에 맞춰 정렬합니다.
- 화면이 좁아지거나 글자를 확대해도 수준별 들여쓰기를 유지합니다.

## 스타일링 {#styling}

`@unofficial-krds/styles/text-list.css`를 가져옵니다. 각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `ordered`, `unordered`, `level-1`, `level-2`, `level-3` |
| `item` | `level-1`, `level-2`, `level-3` |
| `marker` | 없음 |
| `content` | 없음 |
| `nested-list` | `ordered`, `unordered`, `level-1`, `level-2`, `level-3` |

```css
[data-krds-component="text-list"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_04_13.html)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
