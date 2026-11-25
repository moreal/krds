---
title: 'FAB'
---

# FAB {#fab}

**플로팅 버튼** — 화면 위에 떠서 가장 중요한 동작을 언제나 실행할 수 있게 합니다.

`FAB` · `@unofficial-krds/<프레임워크>/fab` · CSS `@unofficial-krds/styles/fab.css`

## 사용법 {#usage}

- 화면에서 사용자가 반복해서 수행하는 주요 동작이 하나 있을 때, 어디서든 바로 실행할 수 있게 띄워 둘 때 씁니다.
- 자주 쓰는 동작이 여럿이면 메뉴나 탭바를 씁니다. 지도, 캘린더, 이미지 편집처럼 손동작이 많은 화면에서는 쓰지 않습니다.
- 화면 오른쪽 아래에 고정합니다. 탭바가 있으면 겹치지 않게 그 위에 둡니다.
- 동작이 둘 이상 필요하면 `actions`로 확장형을 만들고, 펼쳐지는 동작은 3개 이하로 둡니다. 펼친 동작 안에서 다시 펼치지 않습니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `label` **필수** | `string` | — | 버튼의 이름입니다. 레이블을 숨겨도 화면 낭독기에는 이 이름이 전달됩니다. |
| `icon` **필수** | `string` | — | 버튼에 표시할 아이콘입니다. `plus`나 `add`를 넘기면 더하기 아이콘을 그리고, 그 밖의 문자열은 글자 그대로 표시합니다. 확장형이 펼쳐져 있는 동안에는 닫기(X) 아이콘을 그립니다. |
| `showLabel` | `boolean` | `true` | `false`이면 `label`을 화면에 보이지 않게 하고 아이콘만 표시합니다. |
| `disabled` | `boolean` | `false` | `true`이면 버튼과 펼쳐진 동작을 모두 누를 수 없습니다. |
| `onAction` | `() => void` | — | `actions`가 없을 때 버튼을 누르면 불립니다. 인자는 없습니다. |
| `expanded` | `boolean` | — | 확장형에서 펼침 상태를 직접 제어할 때 넘깁니다. |
| `defaultExpanded` | `boolean` | `false` | 직접 제어하지 않을 때의 초기 펼침 상태입니다. |
| `onExpandedChange` | `(detail: {expanded: boolean}) => void` | — | 사용자가 확장형 버튼을 펼치거나 접으려 할 때 불리며 `{expanded}`를 받습니다. |
| `actions` | `readonly {id: string; label: string; onAction: () => void}[]` | — | 넘기면 확장형이 됩니다. 펼쳤을 때 나오는 동작 목록이며, 각 항목은 `id`, `label`과 눌렀을 때 불리는 `onAction`을 가집니다. 4개 이상 넘기면 오류가 납니다. |

속성 이름은 프레임워크 공통입니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/#native-content-and-event-transport).

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Enter` / `Space` | 초점이 있는 버튼을 실행합니다. 확장형에서는 동작 목록을 펼치거나 접습니다. |
| `Tab` / `Shift+Tab` | 펼쳐진 동작들을 차례로 이동합니다. |
| `Esc` | 펼쳐진 동작 목록을 접고 플로팅 버튼으로 초점을 돌려줍니다. |

## 접근성 {#accessibility}

- 모든 버튼은 `button`이며 `label`을 이름으로 가집니다. 아이콘만 보여 줄 때도 `label`은 반드시 넘깁니다.
- 확장형 버튼은 펼침 상태를 `aria-expanded`로 알립니다.
- 접혀 있는 동작은 `Tab`으로 닿지 않고 화면 낭독기도 읽지 않습니다.
- 펼쳐도 초점을 가두지 않습니다.

## 알아 둘 점 {#notes}

- `expanded`와 `defaultExpanded`는 함께 넘기지 않습니다.
- 폼 안에 두어도 폼을 제출하지 않습니다.
- 버튼이 중요한 콘텐츠나 하단 탭바를 가리지 않도록 페이지 아래쪽에 여백을 둡니다.
- 펼친 상태에서 동작 목록 바깥의 배경을 누르면 접힙니다. 동작을 눌러도 목록은 저절로 접히지 않습니다.

## 스타일링 {#styling}

`@unofficial-krds/styles/fab.css`를 가져옵니다. 각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `expanded`, `collapsed`, `disabled` |
| `trigger` | `expanded`, `collapsed`, `disabled` |
| `icon` | 없음 |
| `label` | 없음 |
| `overlay` | `expanded`, `collapsed` |
| `actions` | `expanded`, `collapsed` |
| `action` | `disabled` |

```css
[data-krds-component="fab"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_05_03.html)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/)를 따릅니다.
