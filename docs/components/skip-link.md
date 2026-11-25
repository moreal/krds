---
title: 'Skip link'
---

# Skip link {#skip-link}

**건너뛰기 링크** — 키보드 사용자가 반복되는 영역을 지나 본문으로 바로 이동하게 합니다.

`SkipLink` · `@unofficial-krds/<프레임워크>/skip-link` · CSS `@unofficial-krds/styles/skip-link.css`

## 사용법 {#usage}

- 키보드나 화면 낭독기 사용자가 헤더와 메뉴처럼 페이지마다 반복되는 영역을 건너뛰고 본문으로 바로 갈 수 있게 할 때 씁니다. 반복 영역이 있는 모든 페이지에 둡니다.
- 문서의 가장 첫 요소로, 마스트헤드와 헤더보다 앞에 둡니다.
- 보통 본문으로 가는 링크 하나면 충분합니다. 링크는 세 개까지만 넣고, 본문 링크를 항상 첫 번째에 둡니다.
- 내비게이션 없이 단일 화면으로 된 페이지처럼 반복 영역이 없는 곳에는 쓰지 않습니다.
- 본문 링크의 목적지에는 사이드 메뉴, 브레드크럼, 페이지 유틸리티 버튼이 들어가지 않게 합니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `links` **필수** | `readonly {id: string; label: string; targetId: string}[]` | — | 건너뛰기 링크 목록입니다. 각 항목의 `label`은 링크 문구이고, `targetId`는 같은 문서 안에서 이동할 요소의 `id`입니다. |
| `visibility` | `'focus-revealed' \| 'visible'` | `"focus-revealed"` | `focus-revealed`는 평소에는 숨겨 두었다가 키보드 초점을 받을 때 링크를 보여 줍니다. `visible`은 링크를 항상 보여 줍니다. |

속성 이름은 프레임워크 공통입니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` | 페이지에서 처음 누르면 건너뛰기 링크로 초점이 이동하고, 숨겨져 있던 링크가 나타납니다. |
| `Enter` | 목적지로 스크롤하고 키보드 초점도 목적지로 옮깁니다. 이어서 `Tab`을 누르면 목적지 안의 첫 번째 상호작용 요소로 이동합니다. |

## 접근성 {#accessibility}

- 링크를 실행하면 스크롤만 하지 않고 초점도 목적지로 옮기므로, 사용자가 그 지점부터 탐색을 이어 갈 수 있습니다.
- 목적지가 초점을 받을 수 없는 요소이면 임시로 `tabindex="-1"`을 붙여 초점을 줍니다. 목적지가 일반 `Tab` 순서에 추가되지는 않습니다.
- `targetId`가 가리키는 요소는 직접 준비합니다. 변하지 않는 `id`를 가진 본문 영역이나 제목을 목적지로 씁니다.
- 초점을 받아 나타난 링크의 초점 표시가 주변 콘텐츠에 가려지지 않게 합니다.
- 고정 헤더가 있다면 이동한 목적지가 헤더에 가려지지 않게 합니다.

## 알아 둘 점 {#notes}

- 기본 방식에서는 화면 맨 위에 고정되어 다른 고정(sticky) 콘텐츠보다 위에 나타납니다. `visible`로 두면 문서 흐름 안에 자리를 차지합니다.
- `targetId`에 해당하는 요소가 없으면 링크를 눌러도 본문으로 이동하지 못합니다. 개발 중에 대상 `id`를 맞춰 둡니다.
- Lit처럼 Shadow DOM 안에 목적지가 있으면 문서 전체에서 `id`로 찾을 수 없으므로, 목적지를 건너뛰기 링크와 같은 루트 안에 두거나 light DOM에 둡니다.

## 스타일링 {#styling}

`@unofficial-krds/styles/skip-link.css`를 가져옵니다. 각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `focus-visible` |
| `list` | 없음 |
| `item` | 없음 |
| `link` | `focus-visible` |

```css
[data-krds-component="skip-link"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_03_01.html)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
