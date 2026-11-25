---
title: 'Contextual help'
---

# Contextual help {#contextual-help}

**맥락적 도움말** — 입력 항목이나 용어 옆에서 짧은 도움말을 눌러 볼 수 있게 합니다.

`ContextualHelp` · `@unofficial-krds/<프레임워크>/contextual-help` · CSS `@unofficial-krds/styles/contextual-help.css`

## 사용법 {#usage}

- 필드나 레이블 옆에서, 알면 도움이 되는 부가 설명을 사용자가 원할 때 펼쳐 보여 줄 때 씁니다. 입력 방법 설명, 전문 용어 해설, 컨트롤을 쓸 수 없는 이유 안내 등에 맞습니다.
- 작업을 마치는 데 꼭 필요한 정보는 여기에 숨기지 않습니다. 필수 정보는 본문에 적고, 보충 설명만 도움말로 제공합니다.
- 아이콘만 있는 컨트롤의 이름을 알려 주거나 아주 짧은 정보를 덧붙일 때는 툴팁이나 인라인 도움말을 씁니다.
- 도움말 안에서 다른 도움말이나 모달을 열지 않습니다. 한 과업 흐름에서 도움 패널과 함께 쓰지도 않습니다.
- 본문에 넣는 링크는 새 창으로 엽니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `open` | `boolean` | — | 팝오버의 열림 상태를 직접 제어할 때 넘깁니다. |
| `defaultOpen` | `boolean` | `false` | 직접 제어하지 않을 때의 초기 열림 상태입니다. |
| `onOpenChange` | `(detail: OpenChangeDetails) => void` | — | 사용자가 팝오버를 열거나 닫으려 할 때 불리며 `{open}`을 받습니다. |
| `title` **필수** | `string` | — | 팝오버 제목입니다. |
| `content` **필수** | `string` | — | 팝오버 본문입니다. 짧은 단락으로 씁니다. |
| `variant` | `'information' \| 'help'` | — | 버튼 아이콘의 종류입니다. `information`은 정보(i) 아이콘, `help`는 물음표(?) 아이콘을 씁니다. |
| `placement` | `HelpPlacement` | `"bottom-start"` | 버튼을 기준으로 팝오버가 열리는 위치입니다. 위아래와 시작, 가운데, 끝 정렬을 조합한 여섯 가지 가운데 고릅니다. |
| `triggerLabel` **필수** | `string` | — | 아이콘 버튼의 접근 가능한 이름입니다. 무엇에 대한 도움말인지 드러나게 쓰고, 페이지 안에서 겹치지 않게 합니다. |
| `relatedId` | `string` | — | 이 도움말이 설명하는 필드나 레이블의 `id`입니다. 넘기면 화면 낭독기가 버튼 이름 뒤에 그 요소의 텍스트를 부가 설명으로 읽습니다. |
| `fallbackFocusId` | `string` | — | 닫힐 때 버튼이 사라지고 없으면 대신 초점을 받을 요소의 `id`입니다. |

속성 이름은 프레임워크 공통입니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/#native-content-and-event-transport).

표에 나온 타입입니다.

```ts
export interface OpenChangeDetails {
    open: boolean;
}

export type HelpPlacement = 'top-start' | 'top' | 'top-end' | 'bottom-start' | 'bottom' | 'bottom-end';
```

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Enter` / `Space` | 아이콘 버튼에 초점이 있을 때 팝오버를 열거나 닫습니다. |
| `Tab` | 팝오버 안의 링크와 닫기 버튼을 차례로 이동하고, 끝에서는 팝오버 밖으로 나갑니다. |
| `Esc` | 팝오버를 닫고 아이콘 버튼으로 초점을 돌려줍니다. |

## 접근성 {#accessibility}

- 아이콘 버튼은 `button`이며 열림 상태를 `aria-expanded`로 알립니다. 팝오버는 버튼 바로 뒤에 놓여 화면 낭독기가 순서대로 읽습니다.
- 열리면 팝오버 안의 첫 링크로, 링크가 없으면 닫기 버튼으로 초점을 옮깁니다. 초점을 가두지 않습니다.
- 닫기 버튼, 바깥 누르기, `Esc`로 닫으면 아이콘 버튼으로 초점이 돌아갑니다.
- `triggerLabel`은 버튼마다 고유하게 씁니다. '도움말'처럼 같은 이름을 반복하지 않습니다.
- 스타일을 바꿀 때는 아이콘과 주변 배경의 명도 대비를 3:1 이상으로 유지하고, 버튼 크기는 44px 이상을 권장합니다.

## 알아 둘 점 {#notes}

- 화면 가장자리에서는 팝오버가 잘리지 않도록 방향을 뒤집거나 위치를 옮깁니다. 화면이 아주 작으면 내용을 스크롤합니다.
- `open`과 `defaultOpen`은 함께 넘기지 않습니다. `open`을 넘겼다면 `onOpenChange`에서 받은 값을 반영해야 열리고 닫힙니다.

## 스타일링 {#styling}

`@unofficial-krds/styles/contextual-help.css`를 가져옵니다. 각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `open`, `closed`, `top-start`, `top`, `top-end`, `bottom-start`, `bottom`, `bottom-end` |
| `trigger` | `open`, `closed` |
| `icon` | 없음 |
| `popover` | `open`, `closed`, `top-start`, `top`, `top-end`, `bottom-start`, `bottom`, `bottom-end` |
| `title` | 없음 |
| `body` | 없음 |
| `close` | 없음 |

```css
[data-krds-component="contextual-help"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_08_03.html)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/)를 따릅니다.
