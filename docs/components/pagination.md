---
title: 'Pagination'
---

# Pagination {#pagination}

**페이지네이션** — 여러 페이지로 나뉜 목록에서 페이지를 옮겨 다니게 합니다.

## 사용법 {#usage}

- 긴 목록을 여러 화면으로 나누어 탐색하게 할 때 씁니다. 한 화면에 모두 보여 주면 목록 높이가 화면의 2배를 넘거나 항목이 20개를 넘을 때 검토합니다.
- 항목이 적으면 한 화면에 모두 보여 주고, 주제나 범주로 나눌 목록에는 사이드 메뉴 같은 탐색 수단을 씁니다. 무한 스크롤과 함께 쓰지 않습니다.
- 목록 아래 가운데에 두고, 서비스 전체에서 같은 위치를 유지합니다. 한 화면에는 하나만 씁니다.
- 페이지 수가 아주 많으면 번호를 직접 입력하는 `direct-page`를, 목록 아래에 항목을 이어 붙이려면 `load-more`를 씁니다.
- 전체 페이지 수와 페이지당 항목 수는 화면 크기와 상관없이 같게 유지합니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `page` | `number` | — | 현재 페이지를 직접 제어합니다. 1부터 시작하며 `defaultPage`와 함께 쓸 수 없습니다. |
| `defaultPage` | `number` | `1` | 직접 제어하지 않을 때 처음 페이지입니다. |
| `pageCount` **필수** | `number` | — | 전체 페이지 수입니다. |
| `hrefForPage` **필수** | `(page: number) => string` | — | 페이지 번호를 받아 그 페이지의 주소를 돌려줍니다. 번호와 이전·다음 링크의 `href`로 쓰입니다. |
| `onPageChange` | `(detail: {page: number}) => void` | — | 사용자가 번호, 이전·다음, 이동 버튼으로 다른 페이지를 요청하면 `{page}`를 받아 불립니다. `page`를 바깥에서 바꾸는 것으로는 불리지 않습니다. |
| `variant` | `'number-links' \| 'direct-page' \| 'load-more'` | `"number-links"` | `number-links`는 번호 링크 목록, `direct-page`는 페이지 번호 입력란과 이동 버튼, `load-more`는 더 보기 버튼을 보여 줍니다. |
| `loadMore` | `{shown: number; total: number; pending: boolean; firstNewItemId?: string; onLoadMore: () => void}` | — | `load-more`에서 쓰는 설정입니다. `shown`과 `total`은 표시된 항목 수와 전체 항목 수, `pending`은 불러오는 중인지, `onLoadMore`는 버튼을 눌렀을 때 불리는 콜백, `firstNewItemId`는 새로 추가된 첫 항목의 `id`입니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

```ts
export interface PaginationContract {
    page?: number;
    defaultPage?: number;
    pageCount: number;
    hrefForPage: (page: number) => string;
    onPageChange?: (detail: {
        page: number;
    }) => void;
    variant?: 'number-links' | 'direct-page' | 'load-more';
    loadMore?: {
        shown: number;
        total: number;
        pending: boolean;
        firstNewItemId?: string;
        onLoadMore: () => void;
    };
}
```

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | `number-links`에서는 이전, 번호 링크, 다음 순으로, `direct-page`에서는 이전, 페이지 입력란, 이동 버튼, 다음 순으로 이동합니다. 현재 페이지 번호는 건너뜁니다. |
| `Enter` | 초점이 있는 링크의 페이지로 이동합니다. 페이지 입력란에서는 입력한 번호로 이동합니다. |
| `Enter` / `Space` | 이동 버튼이나 더 보기 버튼을 실행합니다. |

## 접근성 {#accessibility}

- 전체를 이름이 있는 `nav` 영역으로 감싸고 번호를 목록으로 전달합니다.
- 현재 페이지 번호는 링크가 아니며 `aria-current`로 현재 위치임을 알립니다. 색만으로 구분하지 않습니다.
- 화면 너비와 상관없이 이전, 번호 목록(또는 페이지 입력란, 전체 페이지 수, 이동 버튼), 다음 순으로 읽습니다. 첫 페이지에서는 이전 링크가, 마지막 페이지에서는 다음 링크가 나타나지 않습니다.
- 페이지 입력란에는 보이는 레이블이 있고, 범위를 벗어난 번호를 넣으면 이동하지 않고 오류 문구를 알려 줍니다.
- 더 보기로 항목이 추가되면 `firstNewItemId`가 가리키는 첫 새 항목으로 스크롤하고 초점을 옮깁니다. 추가한 첫 항목에 그 `id`를 붙여 둡니다.

## 알아 둘 점 {#notes}

- 번호와 줄임표는 넓은 화면에서 최대 11개, 좁은 화면에서 최대 7개를 보여 줍니다. 첫 페이지와 마지막 페이지는 항상 표시하며 줄임표는 누를 수 없습니다.
- 좁은 화면에서는 이전·다음 버튼이 번호 목록 위에 놓입니다.
- `onPageChange`를 주지 않으면 번호 링크는 `hrefForPage`가 돌려준 주소로 이동하는 일반 링크로 동작합니다.
- 데이터를 불러오고 `shown`, `total`, `pending`을 갱신하는 일은 쓰는 쪽에서 합니다. 불러오기에 실패하면 초점과 표시 개수는 그대로 남습니다.
- 폼을 초기화하면 페이지 입력란에 입력하던 내용이 현재 페이지 번호로 돌아갑니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `current`, `disabled`, `pending`, `invalid` |
| `list` | 없음 |
| `item` | `current` |
| `link` | `current`, `disabled` |
| `previous` | `disabled` |
| `next` | `disabled` |
| `ellipsis` | 없음 |
| `input` | `invalid` |
| `total` | 없음 |
| `go` | `disabled` |
| `load-more` | `pending`, `disabled` |
| `count` | `pending` |

```css
[data-krds-component="pagination"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_03_06.html)
- [상세 명세](/sources/specs/components/pagination.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
