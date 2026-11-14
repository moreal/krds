---
title: 'Main menu'
---

# Main menu {#main-menu}

**메인 메뉴** — 서비스의 주요 메뉴를 펼쳐 보여 주는 전역 탐색입니다.

## 사용법 {#usage}

- 사이트의 주요 영역을 탐색하는 최상위 메뉴로 씁니다. 보통 `Header` 안에 둡니다.
- 메뉴는 서비스의 정보 구조를 반영해 최대 3단계까지 구성하고, 꼭 필요한 링크만 넣습니다.
- 자주 쓰고 중요한 메뉴일수록 왼쪽에 둡니다. 레이블은 전문 용어 대신 이해하기 쉬운 말로 씁니다.
- 레이블만으로 내용을 알기 어려운 메뉴에는 `description`으로 설명을 덧붙입니다.
- 하위 메뉴는 마우스를 올리는 것만으로 열리지 않습니다. 눌러서 엽니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `label` | `string` | `"메인 메뉴"` | 내비게이션 영역의 이름입니다. 화면 낭독기가 이 이름으로 영역을 읽습니다. |
| `mobileTriggerId` | `string` | — | 좁은 화면에 나타나는 메뉴 열기 버튼의 `id`입니다. |
| `mobileTriggerLabel` | `string` | `"전체 메뉴"` | 메뉴 열기 버튼의 이름입니다. |
| `items` **필수** | `readonly NavigationItem[]` | — | 메뉴 항목 목록입니다. 항목마다 `id`와 `label`을 넘깁니다. `href`가 있는 항목은 링크가 되고, `children`이 있는 항목에는 하위 메뉴를 여는 버튼이 나옵니다. `description`은 항목 설명으로 표시합니다. |
| `currentId` | `string` | — | 현재 페이지에 해당하는 항목의 `id`입니다. 그 항목을 현재 위치로 표시합니다. |
| `expandedId` | `string \| null` | — | 펼쳐진 최상위 항목의 `id`를 직접 제어합니다. `null`이면 모두 접힌 상태입니다. |
| `defaultExpandedId` | `string \| null` | `null` | 직접 제어하지 않을 때 처음 펼쳐 둘 항목의 `id`입니다. |
| `onExpandedChange` | `(detail: {id: string \| null}) => void` | — | 사용자가 하위 메뉴를 펼치거나 접으려 할 때 불립니다. 펼칠 항목을 `{id}`로 받고, 모두 접을 때는 `id`가 `null`입니다. |
| `mobileOpen` | `boolean` | — | 좁은 화면의 메뉴 레이어가 열려 있는지를 직접 제어합니다. `onMobileOpenChange`와 함께 씁니다. |
| `defaultMobileOpen` | `boolean` | `false` | 직접 제어하지 않을 때 메뉴 레이어의 처음 열림 상태입니다. |
| `onMobileOpenChange` | `(detail: OpenChangeDetails) => void` | — | 사용자가 메뉴 레이어를 열거나 닫으려 할 때 불립니다. 바뀔 상태를 `{open}`으로 받습니다. |
| `query` | `string` | `""` | 메뉴 검색창에 채울 검색어입니다. 메뉴가 복잡해 메뉴 검색을 제공할 때 `onQueryChange`와 함께 씁니다. |
| `onQueryChange` | `(detail: ValueChangeDetails<string>) => void` | — | 넘기면 메뉴 검색창을 표시하고, 사용자가 검색어를 바꿀 때 불립니다. 새 검색어를 `{value}`로 받습니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

```ts
export interface MainMenuContract {
    label?: string;
    mobileTriggerId?: string;
    mobileTriggerLabel?: string;
    items: readonly NavigationItem[];
    currentId?: string;
    expandedId?: string | null;
    defaultExpandedId?: string | null;
    onExpandedChange?: (detail: {
        id: string | null;
    }) => void;
    mobileOpen?: boolean;
    defaultMobileOpen?: boolean;
    onMobileOpenChange?: (detail: OpenChangeDetails) => void;
    query?: string;
    onQueryChange?: (detail: ValueChangeDetails<string>) => void;
}

export interface NavigationItem {
    id: string;
    label: string;
    href?: string;
    description?: string;
    children?: readonly NavigationItem[];
}

export interface OpenChangeDetails {
    open: boolean;
}

export interface ValueChangeDetails<T> {
    value: T;
}
```

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 메뉴의 계층 순서대로 이동합니다. 접힌 하위 메뉴는 건너뜁니다. |
| `Enter` / `Space` | 하위 메뉴를 여는 버튼에서 누르면 하위 메뉴를 펼치거나 접습니다. |
| `Enter` | 초점이 있는 링크로 이동합니다. |
| `Escape` | 펼쳐진 하위 메뉴를 닫고 초점을 그 메뉴를 연 버튼으로 옮깁니다. 펼쳐진 하위 메뉴가 없으면 좁은 화면의 메뉴 레이어를 닫습니다. |

## 접근성 {#accessibility}

- `<nav>` 영역에 `label`을 이름으로 붙이고, 제목과 중첩 목록으로 메뉴 계층을 전달합니다.
- 하위 메뉴를 여는 버튼은 `aria-expanded`로 펼침 상태를 알립니다.
- 현재 페이지 링크에는 `aria-current="page"`를, 현재 페이지를 아래에 둔 상위 항목의 버튼에는 `aria-current="true"`를 붙여 현재 위치를 화면 낭독기에도 전달합니다.
- 접힌 하위 메뉴는 초점 순서와 화면 낭독기에서 모두 빠집니다.
- 펼친 하위 메뉴에는 어떤 메뉴의 하위 목록인지 알 수 있도록 제목을 함께 표시합니다.

## 알아 둘 점 {#notes}

- 넓은 화면에서는 최상위 메뉴를 모두 보여 줍니다. 하위 메뉴 영역은 화면 높이의 70%까지만 커지고, 넘치면 그 안에서 스크롤됩니다.
- 좁은 화면에서는 메뉴를 잘라 보여 주지 않고 메뉴 열기 버튼과 전체 화면 메뉴 레이어로 바꿉니다. 레이어가 열려 있는 동안 초점은 레이어 안에 머물고, 닫으면 메뉴 열기 버튼으로 돌아갑니다.
- `expandedId`나 `mobileOpen`을 넘기면 제어 방식으로 동작하므로 콜백에서 값을 갱신해야 화면이 바뀝니다. 제어 속성과 같은 상태의 `default` 속성은 함께 쓰지 않습니다.
- `Header`와 함께 쓸 때는 `Header`의 `navigationLabel`이 이 메뉴의 `label`이 됩니다.
- 한글을 조합하는 중에 누른 `Escape`는 메뉴를 닫지 않습니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `expanded`, `collapsed`, `current`, `mobile-open` |
| `list` | 없음 |
| `item` | `current`, `expanded`, `collapsed` |
| `trigger` | `expanded`, `collapsed`, `current` |
| `link` | `current` |
| `indicator` | 없음 |
| `submenu` | `expanded`, `collapsed` |
| `submenu-title` | 없음 |
| `description` | 없음 |
| `utilities` | 없음 |
| `mobile-trigger` | `expanded`, `collapsed` |
| `mobile-content` | `mobile-open` |
| `back` | 없음 |
| `close` | 없음 |
| `search` | 없음 |

```css
[data-krds-component="main-menu"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_03_02.html)
- [상세 명세](/sources/specs/components/main-menu.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/)를 따릅니다.
