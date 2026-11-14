---
title: 'Accordion'
---

# Accordion {#accordion}

**아코디언** — 여러 구역의 내용을 제목만 남기고 접었다 펼칩니다.

## 사용법 {#usage}

- 공간이 부족해 긴 콘텐츠를 한 번에 보여 주기 어렵거나, 사용자가 여러 섹션 중 일부만 필요로 할 때 씁니다.
- 사용자가 대부분 읽어야 하는 중요한 정보에는 쓰지 않습니다. 접힌 내용은 놓치기 쉽습니다.
- 아코디언이나 탭 안에 다시 아코디언을 넣지 않습니다.
- 콘텐츠가 아주 단순하면 제목으로 구분해 그대로 보여 주고, 양이 많거나 복잡하면 여러 페이지로 나눕니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `items` **필수** | `readonly {id: string; title: string; content: string}[]` | — | 섹션 목록입니다. 항목마다 고유한 `id`, 헤더에 표시할 `title`, 패널에 표시할 `content`를 넣습니다. |
| `openIds` | `readonly string[]` | — | 펼쳐진 섹션의 `id` 목록입니다. 넘기면 펼침 상태를 직접 제어하며, `onOpenChange`에서 받은 값으로 갱신해야 합니다. |
| `defaultOpenIds` | `readonly string[]` | `[]` | 처음에 펼쳐 둘 섹션의 `id` 목록입니다. 상태를 직접 제어하지 않을 때 씁니다. |
| `onOpenChange` | `(detail: {ids: readonly string[]}) => void` | — | 사용자가 헤더를 눌러 섹션을 펼치거나 접을 때 불립니다. 변경 후 펼쳐져 있어야 할 `ids`를 받습니다. |
| `multiple` | `boolean` | `true` | 여러 섹션을 동시에 펼칠 수 있게 합니다. `false`로 두면 한 번에 하나만 펼쳐집니다. |
| `variant` | `'default' \| 'line'` | `"default"` | 모양을 고릅니다. `default`는 기본형, `line`은 구분선만 쓰는 라인형입니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

```ts
export interface AccordionContract {
    items: readonly {
        id: string;
        title: string;
        content: string;
    }[];
    openIds?: readonly string[];
    defaultOpenIds?: readonly string[];
    onOpenChange?: (detail: {
        ids: readonly string[];
    }) => void;
    multiple?: boolean;
    variant?: 'default' | 'line';
}
```

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 헤더와 펼쳐진 패널 안의 요소를 차례로 이동합니다. |
| `Enter` / `Space` | 초점이 있는 헤더의 패널을 펼치거나 접습니다. 초점은 헤더에 남습니다. |

## 접근성 {#accessibility}

- 헤더는 제목 안의 버튼으로 제공되며, 펼침 상태가 화면 낭독기에 전달됩니다.
- 접힌 패널의 내용은 초점을 받지 않고 화면 낭독기도 읽지 않습니다. 패널 안에 초점이 있는 채로 접히면 초점은 그 섹션의 헤더로 옮겨집니다.
- 헤더 전체가 누를 수 있는 영역입니다. 패널 안에 링크나 버튼이 있으면 헤더와 충분히 떨어뜨려 잘못 누르지 않게 합니다.
- 섹션 제목은 내용을 짐작할 수 있게 짓습니다. 제목만 훑어도 전체 개요를 파악할 수 있어야 합니다.

## 알아 둘 점 {#notes}

- `openIds`와 `defaultOpenIds`를 함께 넘기면 오류가 납니다. `multiple`이 `false`일 때 `id`를 둘 이상 넘겨도 오류가 납니다.
- 패널에는 자체 스크롤이 생기지 않습니다. 내용이 길면 페이지 스크롤로 읽습니다.
- 패널을 접어도 그 안에 있는 입력 값은 유지됩니다.
- 제목이 길면 줄바꿈되며, 상태 아이콘은 같은 위치를 유지합니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `open`, `closed` |
| `item` | `open`, `closed` |
| `heading` | 없음 |
| `trigger` | `open`, `closed` |
| `icon` | 없음 |
| `panel` | `open`, `closed` |

```css
[data-krds-component="accordion"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_04_07.html)
- [상세 명세](/sources/specs/components/accordion.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
