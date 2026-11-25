---
title: 'Breadcrumb'
---

# Breadcrumb {#breadcrumb}

**브레드크럼** — 현재 페이지가 사이트 구조에서 어디에 있는지 경로로 보여 줍니다.

`Breadcrumb` · `@unofficial-krds/<프레임워크>/breadcrumb` · CSS `@unofficial-krds/styles/breadcrumb.css`

## 사용법 {#usage}

- 현재 페이지가 사이트 계층에서 어디에 있는지 보여 주고, 상위 페이지로 돌아갈 수 있게 할 때 씁니다.
- 페이지 제목 바로 위 왼쪽에 둡니다. 브레드크럼과 제목 사이에 다른 요소를 넣지 않습니다.
- 메인 페이지나 랜딩 페이지, 계층이 한 단계뿐인 사이트에는 쓰지 않습니다.
- 진행 단계를 나타내는 용도로 쓰지 않습니다. 그때는 단계 표시기를 씁니다. 메인 메뉴나 사이드 메뉴를 대신할 수도 없습니다.
- 방문한 순서가 아니라 사이트의 실제 계층을 넘깁니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `items` **필수** | `readonly {id: string; label: string; href?: string}[]` | — | 홈과 현재 페이지 사이의 상위 페이지 목록입니다. 이동할 페이지가 없는 단계도 빼지 않고 넣으며, `href`가 없는 항목은 링크가 아닌 텍스트로 표시합니다. |
| `home` **필수** | `LinkData` | — | 항상 첫 항목으로 표시하는 홈 링크입니다. `href`는 서비스의 실제 메인 화면 주소여야 합니다. |
| `currentItem` | `{id: string; label: string}` | — | 현재 페이지입니다. `omitCurrent`가 `false`일 때 마지막 항목으로 표시합니다. |
| `omitCurrent` | `boolean` | `true` | 현재 페이지를 생략하고 바로 위 상위 페이지를 마지막 항목으로 둡니다. `false`로 두면 `currentItem`을 마지막에 링크가 아닌 텍스트로 표시합니다. |
| `maxVisible` | `number` | `4` | 홈과 상위 페이지를 합쳐 한 줄에 보여 줄 항목 수입니다. 경로가 이보다 길면 홈 다음의 항목부터 줄임표로 접습니다. `2`보다 작게 줄일 수 없고, 좁은 화면에서는 값과 상관없이 `2`가 됩니다. |

속성 이름은 프레임워크 공통입니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입입니다.

```ts
export interface LinkData {
    id?: string;
    label: string;
    href: string;
    target?: string;
    rel?: string;
}
```

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 보이는 링크 사이를 차례로 이동합니다. 링크가 아닌 항목과 줄임표는 건너뜁니다. |
| `Enter` | 초점이 있는 링크의 페이지로 이동합니다. |

## 접근성 {#accessibility}

- `nav` 영역에 '브레드크럼'이라는 이름을 붙이고 순서 있는 목록으로 계층을 전달합니다.
- 구분자는 화면 낭독기가 읽지 않습니다. 눈에 보이는 구분자는 배경과 3:1 이상의 대비를 갖습니다.
- 줄임표로 접힌 단계의 이름은 화면 낭독기에 '생략된 경로'로 전달됩니다.
- `omitCurrent`를 `false`로 두면 현재 페이지 항목에 `aria-current="page"`가 붙습니다.
- 링크에는 밑줄이 표시되고, 이동할 페이지가 없는 항목에는 밑줄과 마우스오버 효과가 없습니다.

## 알아 둘 점 {#notes}

- 항상 한 줄로 표시합니다. 홈과 상위 페이지를 합쳐 `maxVisible`개를 넘으면 홈 다음부터 줄임표로 접습니다. 줄임표는 누를 수 없습니다.
- 화면 너비가 767px 이하이면 홈과 바로 위 상위 페이지만 보여 주고 사이를 줄임표로 접습니다.
- 접은 뒤에도 한 줄에 들어가지 않으면 마지막 항목의 글자가 잘려 보일 수 있습니다. 이때도 전체 이름은 화면 낭독기에 전달됩니다.
- `omitCurrent`를 `false`로 두면 `currentItem`을 반드시 함께 넘깁니다. 빠뜨리면 오류가 납니다.

## 스타일링 {#styling}

`@unofficial-krds/styles/breadcrumb.css`를 가져옵니다. 각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `current`, `collapsed` |
| `list` | 없음 |
| `item` | `current`, `collapsed` |
| `link` | `current` |
| `home` | 없음 |
| `separator` | 없음 |
| `ellipsis` | `collapsed` |

```css
[data-krds-component="breadcrumb"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_03_03.html)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
