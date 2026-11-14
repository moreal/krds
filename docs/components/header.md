---
title: 'Header'
---

# Header {#header}

**헤더** — 로고, 유틸리티 링크, 검색, 주 메뉴를 한데 모은 페이지 상단 영역입니다.

## 사용법 {#usage}

- 모든 페이지 맨 위에서 서비스 로고, 유틸리티 링크, 검색, 메인 메뉴를 한곳에 제공할 때 씁니다.
- 건너뛰기 링크(`SkipLink`)와 공식 배너(`Masthead`)를 헤더보다 먼저 두고, 헤더 안은 서비스 로고, 유틸리티 링크, 검색, 메인 메뉴 순서를 유지합니다.
- 로고는 왼쪽 위, 유틸리티 링크는 오른쪽 위에 둡니다. 스타일 수정은 최소화하고 꼭 필요한 항목만 간결하게 넣습니다.
- 유틸리티 링크가 다섯 개 이상이면 드롭다운으로 묶어 표시합니다.
- 아이콘 버튼에는 텍스트 레이블을 함께 제공합니다. 검색이나 로그인처럼 누구나 이해하는 아이콘만 레이블을 생략할 수 있습니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `currentId` | `string` | — | 현재 페이지에 해당하는 메뉴 항목의 `id`입니다. 메인 메뉴에서 그 항목을 현재 위치로 표시합니다. |
| `mobileOpen` | `boolean` | — | 좁은 화면에서 메뉴 레이어가 열려 있는지를 직접 제어합니다. `onMobileOpenChange`와 함께 씁니다. |
| `defaultMobileOpen` | `boolean` | `false` | 직접 제어하지 않을 때 메뉴 레이어의 처음 열림 상태입니다. |
| `onMobileOpenChange` | `(detail: OpenChangeDetails) => void` | — | 사용자가 메뉴 레이어를 열거나 닫으려 할 때 불립니다. 바뀔 상태를 `{open}`으로 받습니다. |
| `mobileTriggerId` | `string` | — | 좁은 화면에 나타나는 메뉴 열기 버튼의 `id`입니다. |
| `mobileTriggerLabel` | `string` | `"메뉴"` | 메뉴 열기 버튼의 이름입니다. 넘긴다면 빈 문자열이 아니어야 합니다. |
| `navigationLabel` | `string` | `"메인 메뉴"` | 메인 메뉴 내비게이션 영역의 이름입니다. 화면 낭독기가 이 이름으로 영역을 읽습니다. |
| `home` **필수** | `LinkData & {logo: LogoData}` | — | 홈으로 가는 로고 링크입니다. `href`, 링크 이름이 되는 `label`, 로고 이미지 `logo`를 넘깁니다. |
| `utilityItems` **필수** | `readonly (LinkData & {id: string})[]` | — | 로그인, 회원가입처럼 대부분의 화면에서 자주 쓰는 보조 링크 목록입니다. 다섯 개 이상이면 드롭다운으로 묶입니다. |
| `search` | `{label: string; onRequest: () => void}` | — | 넘기면 검색 버튼을 표시합니다. `label`이 버튼 이름이 되고, 누르면 `onRequest`가 한 번 불립니다. 검색 화면이나 레이어를 여는 일은 `onRequest`에서 처리합니다. |
| `mainNavigation` **필수** | `readonly NavigationItem[]` | — | 메인 메뉴에 표시할 항목 목록입니다. 항목마다 `id`, `label`을 넘기고 `children`으로 하위 메뉴를 둡니다. |
| `actionLayout` | `'vertical' \| 'horizontal'` | `"horizontal"` | 아이콘 버튼과 레이블의 배치입니다. `vertical`은 아이콘 아래에, `horizontal`은 아이콘 옆에 레이블을 둡니다. |
| `sticky` | `boolean` | `false` | `true`면 스크롤해도 헤더를 화면 위쪽에 고정합니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

```ts
export interface HeaderContract {
    currentId?: string;
    mobileOpen?: boolean;
    defaultMobileOpen?: boolean;
    onMobileOpenChange?: (detail: OpenChangeDetails) => void;
    mobileTriggerId?: string;
    mobileTriggerLabel?: string;
    navigationLabel?: string;
    home: LinkData & {
        logo: LogoData;
    };
    utilityItems: readonly (LinkData & {
        id: string;
    })[];
    search?: {
        label: string;
        onRequest: () => void;
    };
    mainNavigation: readonly NavigationItem[];
    actionLayout?: 'vertical' | 'horizontal';
    sticky?: boolean;
}

export interface OpenChangeDetails {
    open: boolean;
}

export interface LinkData {
    id?: string;
    label: string;
    href: string;
    target?: string;
    rel?: string;
}

export interface LogoData {
    src: string;
    alt: string;
}

export interface NavigationItem {
    id: string;
    label: string;
    href?: string;
    description?: string;
    children?: readonly NavigationItem[];
}
```

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 로고, 유틸리티 링크, 검색, 메인 메뉴 순서로 이동합니다. |
| `Enter` | 초점이 있는 링크로 이동하거나 버튼을 실행합니다. |
| `Space` | 유틸리티 드롭다운, 검색, 메뉴 열기 버튼을 실행합니다. |
| `Escape` | 열려 있는 유틸리티 드롭다운을 닫고 초점을 드롭다운 버튼으로 돌려놓습니다. |

## 접근성 {#accessibility}

- `<header>` 요소로 배너 영역을 표시해 화면 낭독기가 헤더로 바로 이동할 수 있습니다.
- 로고는 홈으로 가는 링크이므로 `home.logo.alt`에 서비스 이름을 넣고 '로고'라는 말은 넣지 않습니다.
- 건너뛰기 링크는 헤더보다 앞, 문서의 가장 처음에 둡니다.
- 유틸리티 드롭다운, 검색, 메뉴 열기 버튼은 모두 이름이 있는 버튼으로 표시합니다.
- 언어 선택 드롭다운에는 국기 대신 언어 이름을 그 언어로 적습니다.

## 알아 둘 점 {#notes}

- 화면이 좁으면 메뉴 막대 대신 메뉴 열기 버튼과 메뉴 레이어를 보여 줍니다. 레이어 안의 펼침과 초점 이동은 메인 메뉴와 같습니다.
- `mobileOpen`을 넘기면 제어 방식으로 동작하므로 `onMobileOpenChange`에서 값을 갱신해야 레이어가 열리고 닫힙니다. `mobileOpen`과 `defaultMobileOpen`은 함께 쓰지 않습니다.
- `sticky`로 고정할 때 공식 배너는 고정 영역에 넣지 않습니다. 헤더가 두 줄을 넘으면 아래로 스크롤할 때 숨기고 위로 스크롤할 때 다시 보여 주는 것이 좋은데, 이 동작은 앱에서 따로 구현합니다.
- 검색어 입력 폼은 헤더에 들어 있지 않습니다. 검색 화면이나 레이어는 앱에서 따로 만듭니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `expanded`, `collapsed`, `sticky` |
| `identity` | 없음 |
| `utilities` | 없음 |
| `utility-trigger` | `expanded`, `collapsed` |
| `actions` | 없음 |
| `search` | 없음 |
| `navigation` | 없음 |
| `mobile-trigger` | `expanded`, `collapsed` |

```css
[data-krds-component="header"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_02_03.html)
- [상세 명세](/sources/specs/components/header.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
