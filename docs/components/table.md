---
title: 'Table'
---

# Table {#table}

**표** — 행과 열로 정리한 데이터를 비교하기 쉽게 보여 줍니다.

## 사용법 {#usage}

- 통계 데이터나 게시물 목록처럼 행과 열로 정리되는 데이터를 비교해 볼 수 있게 할 때 씁니다.
- 요소를 격자로 배치하려는 목적으로는 쓰지 않습니다. 목록이나 제목과 문단이 더 어울리는 내용, 구조가 일정하지 않은 데이터에도 쓰지 않습니다.
- 항목 선택이나 항목별 동작처럼 복잡한 상호작용이 필요하면 구조화 목록을 씁니다.
- 열 수를 최소로 줄이고, 데이터가 잘리지 않는 넓이의 영역에 둡니다. 모달이나 아코디언처럼 좁은 영역은 피합니다.
- 셀 텍스트는 가능하면 3줄을 넘지 않게 합니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `rowHeaderColumnId` | `string` | — | 행 제목으로 쓸 열의 `id`입니다. 지정하면 그 열의 셀을 행 헤더로 표시해, 화면 낭독기가 각 데이터 셀을 행 제목과 함께 읽습니다. |
| `caption` **필수** | `string` | — | 표의 제목이자 설명입니다. 표의 목적과 어떤 헤더로 구성되는지를 문장으로 적습니다. |
| `columns` **필수** | `readonly TableColumn[]` | — | 열 정의 목록입니다. `label`은 열 헤더 문구이고, `kind`가 `number`인 열은 끝쪽(오른쪽)으로, `text`와 `date`인 열은 시작쪽(왼쪽)으로 정렬합니다. `sortable`이 `true`인 열은 `onSortChange`를 함께 넘겼을 때 헤더에 정렬 버튼이 생깁니다. |
| `rows` **필수** | `readonly {id: string; cells: Readonly<Record<string, string \| number \| null>>}[]` | — | 행 데이터 목록입니다. `cells`는 열 `id`를 키로 하는 값의 묶음이며, 값이 `null`인 셀에는 대시를 표시합니다. |
| `sort` | `{columnId: string; direction: 'ascending' \| 'descending'}` | — | 현재 정렬 기준 열과 방향입니다. 해당 열 헤더에 정렬 방향을 표시합니다. 생략하면 어느 열도 정렬된 상태로 표시하지 않습니다. |
| `onSortChange` | `(detail: {columnId: string; direction: 'ascending' \| 'descending'}) => void` | — | 사용자가 열 헤더의 정렬 버튼을 누르면 불리고, 요청한 `columnId`와 `direction`을 받습니다. 지금 오름차순으로 정렬된 열을 누르면 `descending`을, 그 밖에는 `ascending`을 요청합니다. 넘기지 않으면 정렬 버튼이 생기지 않습니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

```ts
export interface TableContract {
    rowHeaderColumnId?: string;
    caption: string;
    columns: readonly TableColumn[];
    rows: readonly {
        id: string;
        cells: Readonly<Record<string, string | number | null>>;
    }[];
    sort?: {
        columnId: string;
        direction: 'ascending' | 'descending';
    };
    onSortChange?: (detail: {
        columnId: string;
        direction: 'ascending' | 'descending';
    }) => void;
}

export interface TableColumn {
    id: string;
    label: string;
    kind: 'text' | 'number' | 'date';
    sortable?: boolean;
}
```

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 정렬 버튼 사이를 이동합니다. 일반 셀에는 초점이 가지 않습니다. 표가 가로로 넘치면 스크롤 영역과 좌우 이동 버튼에도 초점이 갑니다. |
| `Enter` / `Space` | 초점이 있는 열 헤더의 정렬 버튼을 실행합니다. 초점은 그 버튼에 남습니다. |
| `←` / `→` | 표가 가로로 넘칠 때, 초점이 있는 스크롤 영역을 좌우로 스크롤합니다. |

## 접근성 {#accessibility}

- 실제 `<table>`로 표시하고 `caption`, 열 헤더, 행 헤더를 연결하므로 화면 낭독기가 셀을 헤더와 함께 읽습니다.
- 정렬된 열 헤더에는 `aria-sort`로 현재 정렬 방향을 전달합니다.
- `caption`은 헤더 문구를 대신하는 것이 아닙니다. 헤더 `label`은 그대로 두고, `caption`에는 표의 목적과 헤더 구성을 풀어 적습니다.
- 행마다 그 행을 대표하는 열이 있으면 `rowHeaderColumnId`로 지정합니다. 자동으로 정해지지 않습니다.
- 표가 가로로 넘치면 스크롤 영역에 이름이 붙고 키보드 초점을 받습니다. 표 아래에 '표 왼쪽으로 이동', '표 오른쪽으로 이동' 버튼도 생겨 끌지 않고도 스크롤할 수 있습니다.

## 알아 둘 점 {#notes}

- 개수, 비율, 용량 같은 양적 숫자 열은 `kind`를 `number`로, 텍스트와 날짜·우편번호 같은 명목 데이터 열은 `text`나 `date`로 지정합니다.
- 행을 실제로 재정렬하는 일은 쓰는 쪽에서 합니다. `onSortChange`에서 `rows`를 다시 정렬하고 `sort`를 갱신해 넘깁니다.
- 정렬 기능을 제공할 때 처음 상태는 첫 번째 열 기준으로 정렬된 상태로 둡니다.
- 화면이 좁아 표가 다 들어가지 않으면 표 영역을 가로로 스크롤합니다. 데이터를 잘라 내거나 낱말 중간에서 줄바꿈하지 않습니다.
- `rowHeaderColumnId`가 `columns`에 없는 `id`이면 오류를 냅니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `ascending`, `descending`, `overflow` |
| `caption` | 없음 |
| `head` | 없음 |
| `body` | 없음 |
| `row` | 없음 |
| `header-cell` | `ascending`, `descending` |
| `cell` | 없음 |
| `sort-trigger` | `ascending`, `descending` |
| `scroll-region` | `overflow` |
| `scroll-previous` | `overflow` |
| `scroll-next` | `overflow` |

```css
[data-krds-component="table"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_04_11.html)
- [상세 명세](/sources/specs/components/table.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
