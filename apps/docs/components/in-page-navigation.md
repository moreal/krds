---
title: 'In-page navigation'
---

# In-page navigation {#in-page-navigation}

**콘텐츠 내 탐색** — 긴 페이지에서 원하는 구역으로 바로 이동하게 합니다.

`InPageNavigation` · `@unofficial-krds/<프레임워크>/in-page-navigation` · CSS `@unofficial-krds/styles/in-page-navigation.css`

## 사용법 {#usage}

- 한 페이지 안에 섹션이 세 개 이상이거나 본문이 화면 높이의 세 배를 넘을 때, 원하는 섹션으로 바로 이동하게 하려고 씁니다.
- 스크롤이 거의 필요 없는 짧은 페이지, 제목 계층이 없는 본문, 무한 스크롤 페이지에는 쓰지 않습니다.
- 서비스의 다른 페이지를 탐색하는 용도로는 사이드 메뉴를 씁니다. 필터 목록을 보여 주는 데에도 쓰지 않습니다.
- 링크 레이블은 연결된 섹션의 제목과 똑같이 씁니다.
- 목록은 가능하면 1단계로 구성하고, 꼭 필요할 때만 3단계까지 씁니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `sections` **필수** | `readonly InPageSection[]` | — | 이동할 섹션 목록입니다. 항목마다 대상 섹션의 `id`와 `label`을 넘기고, `children`으로 하위 섹션을 둡니다. |
| `title` | `string` | `"이 페이지의 구성"` | 목록 위에 표시하는 제목이며 내비게이션 영역의 이름으로도 쓰입니다. |
| `activeId` | `string` | — | 현재 보고 있는 섹션의 `id`입니다. 해당 링크를 활성 상태로 표시합니다. 넘기지 않으면 스크롤 위치와 누른 링크에 따라 알아서 바뀝니다. |
| `onActiveChange` | `(detail: {id: string; reason: 'scroll' \| 'activation'}) => void` | — | 활성 섹션이 바뀔 때 불립니다. 섹션의 `id`와 함께, 스크롤로 바뀌었으면 `reason`을 `scroll`로, 링크를 눌러 바뀌었으면 `activation`으로 받습니다. |
| `narrowMode` | `'inline' \| 'disclosure'` | `"inline"` | 좁은 화면에서의 표시 방식입니다. `inline`은 목록을 그대로 펼쳐 보여 주고, `disclosure`는 버튼으로 접고 펼칠 수 있게 합니다. |

속성 이름은 프레임워크 공통입니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/#native-content-and-event-transport).

표에 나온 타입입니다.

```ts
export interface InPageSection {
    id: string;
    label: string;
    children?: readonly InPageSection[];
}
```

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 목록의 링크 사이를 차례로 이동합니다. |
| `Enter` / `Space` | 링크에서 누르면 해당 섹션으로 스크롤하고 초점을 그 섹션으로 옮깁니다. 좁은 화면의 접기 버튼에서 누르면 목록을 펼치거나 접습니다. |

## 접근성 {#accessibility}

- `nav` 영역에 `title`을 이름으로 붙이고 중첩 목록으로 섹션 계층을 전달합니다.
- 제목은 `h1`이 아닌 `h2`로 표시해 페이지 제목과 겹치지 않습니다.
- 키보드로 링크를 실행하면 초점이 대상 섹션으로 이동합니다. 마우스로 누르면 화면만 스크롤되고 초점은 링크에 남습니다.
- 활성 링크에는 `aria-current="location"`을 붙입니다. 스크롤에 따라 활성 표시가 바뀌어도 초점은 움직이지 않습니다.
- 본문 구조를 먼저 파악할 수 있도록 페이지 제목과 본문 사이에 둡니다. 넓은 화면에서 오른쪽에 보이더라도 마크업 위치는 같습니다.

## 알아 둘 점 {#notes}

- 넓은 화면에서는 본문 오른쪽에 표시합니다. 좁은 화면에서는 고정하지 않고 제목과 본문 사이에 놓입니다.
- 좁은 화면에서 목록이 길면 `narrowMode`를 `disclosure`로 두어 접을 수 있게 합니다.
- `activeId`를 넘기면 활성 표시는 그 값만 따릅니다. `onActiveChange`에서 값을 갱신해야 스크롤이나 링크 실행에 맞춰 바뀝니다.
- 상단에 고정된 헤더가 있으면 이동한 섹션의 제목이 헤더에 가려지지 않도록 스크롤 여백을 둡니다.
- 레이블이 줄바꿈되지 않을 만큼 넉넉하고 일정한 너비를 확보합니다.

## 스타일링 {#styling}

`@unofficial-krds/styles/in-page-navigation.css`를 가져옵니다. 각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `active`, `expanded`, `collapsed` |
| `header` | 없음 |
| `title` | 없음 |
| `list` | `expanded`, `collapsed` |
| `item` | `active` |
| `link` | `active` |
| `indicator` | `active` |
| `disclosure-trigger` | `expanded`, `collapsed` |

```css
[data-krds-component="in-page-navigation"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_03_05.html)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/)를 따릅니다.
