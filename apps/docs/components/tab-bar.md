---
title: 'Tab bars'
---

# Tab bars {#tab-bars}

**탭바** — 모바일 화면 아래에서 주요 화면 사이를 오가게 합니다.

`TabBar` · `@unofficial-krds/<프레임워크>/tab-bar` · CSS `@unofficial-krds/styles/tab-bar.css`

## 사용법 {#usage}

- 모바일이나 태블릿처럼 화면이 좁을 때, 적은 수의 최상위 화면으로 빠르게 이동하는 하단 내비게이션으로 씁니다. 화면 너비가 충분하면 메인 메뉴를 씁니다.
- 항목은 5개 이하로 두고 모두 같은 크기로 표시합니다. 더 많은 메뉴가 필요하면 전체 메뉴 버튼을 둡니다.
- 항목마다 아이콘과 레이블을 함께 씁니다. 레이블은 한두 단어로 짧게 써서 잘리거나 줄임표가 생기지 않게 합니다.
- 홈이 있으면 가장 왼쪽에, 전체 메뉴는 가장 오른쪽에 둡니다.
- 화면 하단에 고정하고 스크롤해도 숨기지 않습니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `items` **필수** | `readonly {id: string; label: string; href: string; icon: string; currentIcon?: string; badge?: string \| number}[]` | — | 탭바에 표시할 페이지 링크 목록입니다. 항목마다 `label`, `href`, `icon`이 필요합니다. `icon`이 `home`, `document`, `person`, `help`, `search` 가운데 하나이면 그림 아이콘으로, 그 밖의 값이면 글자 그대로 표시합니다. `currentIcon`은 현재 페이지일 때 대신 쓸 아이콘이고, `badge`는 새 소식이나 읽지 않은 개수를 표시합니다. |
| `currentId` **필수** | `string` | — | 현재 페이지에 해당하는 항목의 `id`입니다. 그 항목을 선택된 상태로 표시합니다. |
| `menuAction` | `{label: string; onRequest: () => void}` | — | 넘기면 마지막 자리에 전체 메뉴 버튼을 둡니다. `label`은 버튼 이름이고, 버튼을 누르면 `onRequest`가 불립니다. |

속성 이름은 프레임워크 공통입니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/#native-content-and-event-transport).

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 항목 사이를 차례로 이동합니다. |
| `Enter` | 초점이 있는 항목의 페이지로 이동하거나 전체 메뉴 버튼을 실행합니다. |
| `Space` | 전체 메뉴 버튼을 실행합니다. |

## 접근성 {#accessibility}

- '주요 화면'이라는 이름의 `nav` 영역으로 표시되어 화면 낭독기가 내비게이션으로 인식합니다. 항목은 탭 패널을 바꾸는 탭이 아니라 페이지로 이동하는 링크입니다.
- 현재 페이지 항목에는 `aria-current="page"`가 붙습니다.
- 현재 페이지 항목에는 표시기가 함께 붙으므로 색에만 의존하지 않습니다. `currentIcon`에 채워진 아이콘을 주면 더 분명하게 구분됩니다.
- 아이콘은 화면 낭독기가 읽지 않으므로 `label`을 항상 채웁니다. 번역된 레이블도 잘리지 않게 합니다.

## 알아 둘 점 {#notes}

- `currentId`는 현재 경로에 맞춰 직접 갱신합니다. 항목을 눌러도 컴포넌트가 스스로 현재 항목을 바꾸지 않습니다.
- 탭바는 화면 하단에 고정되고 safe-area만큼 아래 여백을 스스로 둡니다. 본문 아래쪽에는 탭바 높이만큼의 여백을 직접 더해 콘텐츠가 가려지지 않게 합니다.
- 전체 메뉴 화면은 직접 만들어 `menuAction.onRequest`에서 엽니다.
- 정보 구조상 하위 화면에서는 탭바를 표시하지 않아도 됩니다.
- 항목과 전체 메뉴 버튼을 합쳐 5개를 넘으면 오류를 냅니다.

## 스타일링 {#styling}

`@unofficial-krds/styles/tab-bar.css`를 가져옵니다. 각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `current` |
| `list` | 없음 |
| `item` | `current` |
| `link` | `current` |
| `icon` | 없음 |
| `label` | 없음 |
| `indicator` | `current` |
| `badge` | 없음 |
| `menu-trigger` | 없음 |

```css
[data-krds-component="tab-bar"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_12_07.html)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/)를 따릅니다.
