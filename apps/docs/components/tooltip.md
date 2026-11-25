---
title: 'Tooltip'
---

# Tooltip {#tooltip}

**툴팁** — 요소에 마우스를 올리거나 초점을 두면 짧은 설명을 보여 줍니다.

`Tooltip` · `@unofficial-krds/<프레임워크>/tooltip` · CSS `@unofficial-krds/styles/tooltip.css`

## 사용법 {#usage}

- 텍스트 레이블이 없는 아이콘 버튼에 레이블을 보여 줄 때 씁니다.
- 단어 뜻처럼, 꼭 필요하지는 않지만 도움이 되는 짧은 추가 정보를 정보 아이콘 옆에 제공할 때 씁니다.
- 150자 안팎의 짧은 설명에만 씁니다. 더 긴 설명이나 링크·버튼이 들어가야 하면 맥락적 도움말이나 도움 패널을 씁니다.
- HTML `title` 속성 대신 툴팁을 쓰고, 둘을 함께 쓰지 않습니다.
- 팝업이 화면 밖으로 나가거나 트리거와 설명 대상 콘텐츠를 가리지 않도록 `placement`를 정합니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `open` | `boolean` | — | 툴팁이 열려 있는지 여부입니다. 지정하면 열림 상태를 직접 관리하는 제어 방식이 되며 `defaultOpen`과 함께 쓰지 않습니다. |
| `defaultOpen` | `boolean` | `false` | 처음에 열어 둘지 정합니다. 처음 한 번만 읽습니다. |
| `onOpenChange` | `(detail: OpenChangeDetails) => void` | — | 마우스를 올리거나 초점을 주거나 `Esc`를 누르는 등 사용자 동작으로 열림 상태가 바뀌려 할 때 불리며 새 상태를 `open`으로 받습니다. |
| `text` **필수** | `string` | — | 툴팁에 표시할 텍스트입니다. 비워 둘 수 없습니다. `label` 관계에서는 이 텍스트가 트리거 버튼의 이름이 됩니다. |
| `relationship` | `'description' \| 'label'` | `"description"` | 텍스트와 트리거의 관계입니다. `description`은 트리거의 보충 설명으로, `label`은 트리거의 이름으로 연결합니다. |
| `triggerLabel` | `string` | — | 트리거 버튼의 접근 가능한 이름입니다. `description` 관계에서는 반드시 주고, `label` 관계에서는 주지 않습니다. |
| `triggerId` **필수** | `string` | — | 트리거 버튼의 `id`입니다. |
| `textId` **필수** | `string` | — | 툴팁 텍스트 요소의 `id`입니다. 트리거가 이 `id`를 `aria-describedby` 또는 `aria-labelledby`로 참조합니다. |
| `placement` | `HelpPlacement` | — | 팝업을 트리거의 어느 쪽에 둘지 정합니다. `top-start`, `top`, `top-end`, `bottom-start`, `bottom`, `bottom-end` 중 하나입니다. |
| `fallbackFocusId` | `string` | — | `Esc`로 툴팁을 닫을 때 트리거가 사라졌거나 쓸 수 없으면 대신 초점을 받을 요소의 `id`입니다. |
| `touchToggle` | `boolean` | — | `true`로 두면 터치 화면에서 트리거를 눌러 툴팁을 열고 닫을 수 있습니다. 바깥을 누르면 닫힙니다. |

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
| `Tab` / `Shift+Tab` | 트리거에 초점이 가면 툴팁이 열리고, 초점이 벗어나면 닫힙니다. 팝업 자체는 초점을 받지 않습니다. |
| `Esc` | 툴팁을 닫고 초점을 트리거로 옮깁니다. 초점이 트리거를 벗어났다가 다시 들어올 때까지 툴팁은 다시 열리지 않습니다. |

## 접근성 {#accessibility}

- 팝업은 `role="tooltip"`이며 트리거 바로 뒤에 놓여 화면 낭독기가 논리적인 순서로 읽습니다.
- `description` 관계에서는 `triggerLabel`로 트리거의 기능을 나타내는 고유한 이름을 주고, 툴팁 텍스트는 `aria-describedby`로 연결됩니다.
- `label` 관계에서는 툴팁 텍스트가 `aria-labelledby`로 트리거의 이름이 됩니다. 툴팁이 닫혀 있어도 이름은 유지됩니다.
- 화면에 트리거가 여럿이면 이름이 서로 겹치지 않게 합니다.
- 툴팁 안에는 링크나 버튼을 넣지 않습니다.
- 터치 사용자는 마우스를 올릴 수 없으므로 트리거의 아이콘이나 레이블만으로도 의미가 통해야 합니다.

## 알아 둘 점 {#notes}

- 마우스를 트리거에 올리면 열리고, 트리거와 팝업 모두에서 벗어나면 닫힙니다. 포인터를 팝업 위로 옮겨도 닫히지 않습니다.
- 마우스로 열려도 다른 곳에 있던 키보드 초점은 옮기지 않습니다.
- `open`으로 제어하는 경우 `onOpenChange`를 받고도 `open`을 바꾸지 않으면 툴팁은 그대로 열려 있고 초점도 움직이지 않습니다.
- 팝업은 화면 가장자리에서 잘리지 않도록 위치를 조정하고, 너비가 넓어지면 줄을 바꿉니다.

## 스타일링 {#styling}

`@unofficial-krds/styles/tooltip.css`를 가져옵니다. 각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `open`, `closed`, `suppressed`, `top-start`, `top`, `top-end`, `bottom-start`, `bottom`, `bottom-end` |
| `trigger` | `open`, `closed`, `suppressed` |
| `popup` | `open`, `closed`, `suppressed`, `top-start`, `top`, `top-end`, `bottom-start`, `bottom`, `bottom-end` |
| `icon` | 없음 |
| `text` | 없음 |

```css
[data-krds-component="tooltip"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_08_05.html)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/)를 따릅니다.
