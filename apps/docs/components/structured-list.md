---
title: 'Structured list'
---

# Structured list {#structured-list}

**구조화 목록** — 제목, 설명, 상태 같은 정보를 일정한 구조의 항목으로 나열합니다.

## 사용법 {#usage}

- 게시물이나 서비스 목록처럼 같은 구조를 가진 여러 항목을 보여 주면서, 항목별 이동 링크와 정렬, 선택 같은 기능을 함께 제공할 때 씁니다.
- 모든 항목의 정보를 같은 분류와 같은 순서로 넣습니다. 값이 없는 분류는 빼지 말고 `value`를 `null`로 두면 그 자리에 대시를 표시합니다.
- 도구 막대는 목록 위에 두고, 어느 화면에서나 같은 위치와 같은 순서로 구성합니다.
- 항목에서 가장 중요한 행동 하나를 항목의 대표 링크로 두고, 공유나 저장 같은 부가 동작은 항목 내용 뒤에 둡니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `items` **필수** | `readonly StructuredListItem[]` | — | 표시할 항목 목록입니다. 항목마다 `title`과 `metadata`(`label`과 `value` 쌍의 배열)가 필요하고, `href`를 주면 제목이 링크가 됩니다. `image`는 미리보기 이미지, `tags`는 태그 목록입니다. |
| `variant` | `'list' \| 'table'` | `"list"` | `list`는 항목을 목록으로, `table`은 표로 표시합니다. |
| `toolbar` | `readonly {id: string; label: string; disabled?: boolean}[]` | — | 목록 위 도구 막대에 놓을 버튼 목록입니다. `disabled`인 버튼은 누를 수 없습니다. |
| `selection` | `{ids: readonly string[]; onChange: (detail: {ids: readonly string[]}) => void}` | — | 넘기면 항목마다 선택 체크박스를 표시합니다. `ids`는 현재 선택된 항목이고, 사용자가 체크박스를 바꾸면 `onChange`가 새 `ids` 배열을 받아 불립니다. |
| `sort` | `{key: string; direction: 'ascending' \| 'descending'; onChange: (detail: {key: string; direction: 'ascending' \| 'descending'}) => void}` | — | 넘기면 도구 막대에 현재 방향을 보여 주는 정렬 버튼을 표시합니다. `key`와 `direction`은 현재 정렬 상태이고, 버튼을 누르면 `onChange`가 같은 `key`와 반대 방향의 `direction`을 받아 불립니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

```ts
export interface StructuredListContract {
    items: readonly StructuredListItem[];
    variant?: 'list' | 'table';
    toolbar?: readonly {
        id: string;
        label: string;
        disabled?: boolean;
    }[];
    selection?: {
        ids: readonly string[];
        onChange: (detail: {
            ids: readonly string[];
        }) => void;
    };
    sort?: {
        key: string;
        direction: 'ascending' | 'descending';
        onChange: (detail: {
            key: string;
            direction: 'ascending' | 'descending';
        }) => void;
    };
}

/** Text is plain data. Rich native content uses adapter-owned slots keyed by item ID. */
export interface StructuredListItem {
    id: string;
    title: string;
    href?: string;
    metadata: readonly {
        label: string;
        value: string | null;
    }[];
    image?: LogoData;
    tags?: readonly string[];
}

export interface LogoData {
    src: string;
    alt: string;
}
```

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 도구 막대 버튼, 항목 링크, 체크박스, 항목 동작 사이를 차례로 이동합니다. |
| `Enter` | 초점이 있는 버튼을 실행하거나 링크 목적지로 이동합니다. |
| `Space` | 초점이 있는 체크박스를 선택하거나 해제하고, 버튼을 실행합니다. |

## 접근성 {#accessibility}

- 모든 기능이 링크, 버튼, 체크박스로 되어 있어 마우스, 키보드, 터치로 똑같이 쓸 수 있습니다.
- 선택 체크박스에는 항목 제목이 들어간 이름이 붙습니다.
- 정렬을 실행한 뒤에도 초점은 정렬 버튼에 그대로 남습니다.
- 공유, 저장 같은 항목 동작은 내용 뒤에 놓이므로 화면 낭독기 사용자가 내용을 먼저 확인한 뒤 쓸 수 있습니다.
- 새 창을 열거나 외부 애플리케이션을 실행하는 링크와 버튼은 레이블에 그 결과를 적어 둡니다.
- 미리보기 이미지를 쓸 때는 `image`의 `alt`에 대체 텍스트를 채웁니다.

## 알아 둘 점 {#notes}

- `selection`과 `sort`는 현재 값을 직접 관리하는 방식입니다. `onChange`에서 받은 값으로 상태를 바꿔 다시 넘겨야 화면에 반영됩니다.
- 실제 정렬, 필터링, 검색은 쓰는 쪽에서 처리해 정리된 `items`를 넘깁니다.
- 화면이 좁아 항목이 세로로 쌓여도 분류 정보와 도구 막대의 순서는 그대로 유지됩니다. `table` 변형은 좁은 화면에서도 표 구조와 헤더 관계를 유지합니다.
- `items`가 비어 있으면 '조회 결과가 없습니다.'라는 문구를 표시하고 화면 낭독기에도 알립니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `selected`, `pending`, `empty` |
| `header` | 없음 |
| `toolbar` | `pending` |
| `list` | `pending`, `empty` |
| `item` | `selected` |
| `preview` | 없음 |
| `content` | 없음 |
| `metadata` | 없음 |
| `cta` | 없음 |
| `badges` | 없음 |
| `tags` | 없음 |
| `actions` | 없음 |
| `pagination` | `pending` |

```css
[data-krds-component="structured-list"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_04_01.html)
- [상세 명세](/sources/specs/components/structured-list.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/)를 따릅니다.
