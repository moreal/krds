---
title: 'Tag'
---

# Tag {#tag}

**태그** — 항목을 분류하는 키워드를 보여 주고, 필요하면 선택하거나 지울 수 있게 합니다.

## 사용법 {#usage}

- 필터링·정렬에서 사용자가 고른 조건을 보여 주고, 조건을 켜고 끄거나 삭제하게 할 때 씁니다.
- 누를 수 없고 분류나 속성만 강조하려면 태그 대신 배지를 씁니다.
- 한 그룹 안에는 누를 수 있는 태그와 누를 수 없는 태그를 섞지 않습니다.
- 레이블은 2단어 이내로 짧게 써서 줄이 바뀌지 않게 하고, 태그 개수와 색상 수는 최소로 유지합니다.
- 어떤 항목에 붙은 태그인지 알 수 있도록 관련 요소 가까이에 둡니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `items` **필수** | `readonly {id: string; label: string; href?: string; disabled?: boolean}[]` | — | 표시할 태그 목록입니다. 항목마다 `id`와 `label`을 주고, `link` 모드에서는 `href`로 이동할 주소를 지정합니다. `disabled`인 항목은 누를 수 없습니다. |
| `mode` | `'static' \| 'toggle' \| 'removable' \| 'add-filter' \| 'link'` | — | 그룹 전체의 동작을 정합니다. `static`은 누를 수 없는 레이블, `toggle`은 선택을 켜고 끄는 버튼, `removable`은 삭제 버튼이 붙은 태그, `add-filter`는 누르면 필터 조건으로 추가되는 태그, `link`는 링크입니다. |
| `selectedIds` | `readonly string[]` | — | 선택된 태그의 `id` 목록입니다. `toggle` 모드에서 눌린 상태로 표시합니다. |
| `onSelectionChange` | `(detail: {ids: readonly string[]}) => void` | — | `toggle` 모드에서 태그를 눌러 선택을 바꾸려 할 때 불립니다. 바뀐 뒤의 선택 목록을 `ids`로 받습니다. |
| `onRemove` | `(detail: {id: string}) => void` | — | `removable` 모드에서 태그를 삭제하려 할 때 불립니다. 삭제할 태그의 `id`를 받으며, 실제로 `items`에서 빼는 일은 직접 처리합니다. |
| `onAdd` | `(detail: {id: string}) => void` | — | `add-filter` 모드에서 태그를 눌러 필터 조건으로 추가하려 할 때 불립니다. 해당 태그의 `id`를 받습니다. |
| `onClear` | `() => void` | — | 그룹 오른쪽의 모두 지우기 버튼을 눌렀을 때 불립니다. |
| `appliedBarId` | `string` | — | 적용된 필터를 보여 주는 막대 요소의 `id`입니다. `add-filter` 모드에서 필터를 추가하면 초점이 이 요소로 이동합니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

```ts
export interface TagContract {
    items: readonly {
        id: string;
        label: string;
        href?: string;
        disabled?: boolean;
    }[];
    mode?: 'static' | 'toggle' | 'removable' | 'add-filter' | 'link';
    selectedIds?: readonly string[];
    onSelectionChange?: (detail: {
        ids: readonly string[];
    }) => void;
    onRemove?: (detail: {
        id: string;
    }) => void;
    onAdd?: (detail: {
        id: string;
    }) => void;
    onClear?: () => void;
    appliedBarId?: string;
}
```

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` | 그룹에 들어가면 첫 태그에 초점이 갑니다. 그룹은 탭 정지점을 하나만 가집니다. |
| `←` / `→` | 그룹 안에서 이전·다음 태그로 초점을 옮깁니다. |
| `Home` / `End` | 첫 태그·마지막 태그로 초점을 옮깁니다. |
| `Space` / `Enter` | 키를 뗄 때 태그를 실행합니다. 모드에 따라 선택을 토글하거나, 태그를 삭제하거나, 필터로 추가합니다. `link` 모드에서는 링크로 이동합니다. |

## 접근성 {#accessibility}

- `toggle` 모드의 태그는 `aria-pressed`로 선택 상태를 알립니다.
- 삭제 버튼은 '[레이블] 옵션 삭제', 추가 버튼은 '[레이블] 필터 옵션 추가'라는 이름을 갖습니다.
- 태그를 삭제하면 초점이 이전 태그로, 이전 태그가 없으면 다음 태그로, 남은 태그가 없으면 그룹 컨테이너로 이동합니다. 토글한 뒤에는 초점이 그 태그에 남습니다.
- `static` 모드의 태그는 초점을 받지 않습니다.
- 색상만으로 의미를 전달하지 않습니다. 레이블과 아이콘, 초점 윤곽선은 인접 배경과 3:1 이상의 명도 대비를 유지합니다.

## 알아 둘 점 {#notes}

- 태그는 선택 상태나 필터 결과를 직접 보관하지 않습니다. 콜백을 받아 `items`와 `selectedIds`, 실제 필터 결과를 갱신합니다.
- 태그는 폼 값으로 제출되지 않습니다. 폼과 함께 쓴다면 초기화할 때 `selectedIds`를 기본값으로 직접 되돌립니다.
- 공간이 부족해 숨긴 태그는 더 보기 버튼으로 펼치기 전까지 키보드나 화면 낭독기로 접근할 수 없습니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `selected`, `disabled`, `expanded` |
| `list` | `expanded` |
| `item` | `selected`, `disabled` |
| `label` | 없음 |
| `icon` | 없음 |
| `remove` | `disabled` |
| `clear` | `disabled` |
| `more` | `expanded`, `disabled` |

```css
[data-krds-component="tag"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_06_04.html)
- [상세 명세](/sources/specs/components/tag.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
