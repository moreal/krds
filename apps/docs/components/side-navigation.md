---
title: 'Side navigation'
---

# Side navigation {#side-navigation}

**사이드 메뉴** — 같은 묶음 안의 하위 페이지를 옆에서 오갈 수 있게 합니다.

## 사용법 {#usage}

- 메인 메뉴에서 고른 메뉴 아래에 화면이 많아, 본문 옆에서 세로 목록으로 훑어보고 이동하게 할 때 씁니다.
- 화면 수가 5개 미만인 작은 서비스나, 메인 메뉴만으로 충분한 2수준 이내의 구조에는 쓰지 않습니다. 본문이 넓어야 하는 화면에도 알맞지 않습니다.
- 한 번에 두 수준까지만 보여 줍니다. 더 깊은 메뉴는 항목을 눌러 그 아래 목록으로 들어가며, 이때 헤더에 상위 메뉴 이름과 돌아가는 버튼이 나타납니다.
- `currentId`로 현재 화면의 항목을 표시합니다. 처음에는 현재 항목이 속한 가지가 펼쳐진 상태로 보입니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `items` **필수** | `readonly NavigationItem[]` | — | 메뉴 항목의 계층 목록입니다. 각 항목은 `id`, `label`과 선택적인 `href`, `children`을 가집니다. `children`이 있는 항목에는 하위 메뉴를 펼치는 버튼이 붙습니다. |
| `currentId` | `string` | — | 현재 화면에 해당하는 항목의 `id`입니다. 그 링크를 강조하고 `aria-current="page"`로 표시합니다. |
| `expandedIds` | `readonly string[]` | — | 펼쳐진 가지의 `id` 목록을 직접 제어합니다. `defaultExpandedIds`와 함께 쓸 수 없습니다. |
| `defaultExpandedIds` | `readonly string[]` | 현재 항목이 속한 가지 | 직접 제어하지 않을 때 처음에 펼쳐 둘 가지의 `id` 목록입니다. |
| `onExpandedChange` | `(detail: {ids: readonly string[]}) => void` | — | 사용자가 가지를 펼치거나 접으면 바뀐 뒤의 전체 목록을 `{ids}`로 받아 불립니다. |
| `title` | `string` | — | 메뉴 위에 보여 줄 제목입니다. 내비게이션 영역의 이름으로도 쓰이며, 주지 않으면 이름은 “사이드 메뉴”입니다. |
| `parentLink` | `LinkData` | — | 헤더에 두는 상위 메뉴로 가는 링크입니다. `label`과 `href`를 가집니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

```ts
export interface SideNavigationContract {
    items: readonly NavigationItem[];
    currentId?: string;
    expandedIds?: readonly string[];
    defaultExpandedIds?: readonly string[];
    onExpandedChange?: (detail: {
        ids: readonly string[];
    }) => void;
    title?: string;
    parentLink?: LinkData;
}

export interface NavigationItem {
    id: string;
    label: string;
    href?: string;
    description?: string;
    children?: readonly NavigationItem[];
}

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
| `Tab` / `Shift+Tab` | 화면에 보이는 링크와 펼침 버튼을 계층 순서대로 이동합니다. 접힌 하위 메뉴는 건너뜁니다. |
| `Enter` | 링크에서는 해당 화면으로 이동하고, 펼침 버튼에서는 하위 메뉴를 펼치거나 접습니다. |
| `Space` | 펼침 버튼에서 하위 메뉴를 펼치거나 접습니다. |

## 접근성 {#accessibility}

- 전체를 이름이 있는 `nav` 영역으로 감싸고, 중첩된 목록으로 메뉴의 계층을 전달합니다.
- 현재 화면의 링크는 `aria-current="page"`로, 펼침 버튼은 `aria-expanded`로 상태를 알립니다. 버튼 이름에는 메뉴 이름과 “펼치기” 또는 “접기”가 들어갑니다.
- 접힌 하위 메뉴의 링크는 키보드와 화면 낭독기 모두 닿지 않습니다.
- 초점이 있는 하위 메뉴를 접으면 초점은 그 가지의 펼침 버튼으로 돌아갑니다.
- 수준이 다른 링크는 들여쓰기나 배경으로 분명히 구분합니다.

## 알아 둘 점 {#notes}

- 여러 가지를 동시에 펼쳐 둘 수 있습니다. 한 가지를 펼쳐도 다른 가지는 접히지 않습니다.
- 화면이 좁으면 사이드 메뉴를 숨기고 햄버거 메뉴로 바뀐 메인 메뉴에서 같은 경로를 탐색하게 합니다. 같은 경로로 갈 다른 수단이 있을 때만 숨깁니다.
- `expandedIds`로 직접 제어할 때는 `onExpandedChange`에서 받은 목록으로 갱신해야 펼침 상태가 바뀝니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `current`, `expanded`, `collapsed` |
| `header` | 없음 |
| `parent-link` | 없음 |
| `list` | 없음 |
| `item` | `current`, `expanded`, `collapsed` |
| `link` | `current` |
| `trigger` | `expanded`, `collapsed` |
| `submenu` | `expanded`, `collapsed` |
| `indicator` | 없음 |

```css
[data-krds-component="side-navigation"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_03_04.html)
- [상세 명세](/sources/specs/components/side-navigation.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/)를 따릅니다.
