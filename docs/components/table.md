---
title: 'Table'
---

# Table {#table}

표 · `Table`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_04_11.html) · [전체 명세](/sources/specs/components/table.md.txt) · [프레임워크 지원](../compatibility/README.md)

## 네이티브 지원 현황 {#native-availability}

상태는 기록된 커버리지 기준입니다. [상태의 의미](../compatibility/README.md#what-the-evidence-means)를 참고하세요.

| 프레임워크 | 패키지 버전 | 상태 | 예제 |
| --- | --- | --- | --- |
| react | `0.1.0` | planned | [react 예제](../compatibility/README.mdexamples#react) |
| solid | `0.1.0` | planned | [solid 예제](../compatibility/README.mdexamples#solid) |
| svelte | `0.1.0` | planned | [svelte 예제](../compatibility/README.mdexamples#svelte) |
| vue | `0.1.0` | planned | [vue 예제](../compatibility/README.mdexamples#vue) |
| lit | `0.1.0` | planned | [lit 예제](../compatibility/README.mdexamples#lit) |
| qwik | `0.1.0` | planned | [qwik 예제](../compatibility/README.mdexamples#qwik) |
| angular | `0.1.0` | planned | [angular 예제](../compatibility/README.mdexamples#angular) |
| solid-next (미리보기) | `0.1.0-preview.0` | planned | [solid-next 예제](../compatibility/README.mdexamples#solid-next) |

## 속성·이벤트·콘텐츠·기본값 {#props-events-content-and-defaults}

모든 프레임워크가 공유하는 의미 계약입니다. 콜백 이름과 detail 타입은 그대로 씁니다. 네이티브 콘텐츠, ref, 이벤트 전달은 각 어댑터가 맡습니다. 선택 속성의 기본값은 자동으로 채워지지 않으므로 아래 안내의 명시적 기본값을 씁니다.

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

| 속성 / 콜백 | 필수 | 타입 | 역할 |
| --- | --- | --- | --- |
| `rowHeaderColumnId` | 아니요 | `string` | 데이터 / 상태 |
| `caption` | 예 | `string` | 데이터 / 상태 |
| `columns` | 예 | `readonly TableColumn[]` | 데이터 / 상태 |
| `rows` | 예 | `readonly {id: string; cells: Readonly<Record<string, string \| number \| null>>}[]` | 데이터 / 상태 |
| `sort` | 아니요 | `{columnId: string; direction: 'ascending' \| 'descending'}` | 데이터 / 상태 |
| `onSortChange` | 아니요 | `(detail: {columnId: string; direction: 'ascending' \| 'descending'}) => void` | 이벤트 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

실제 &lt;table>에 caption, thead/tbody, th scope, 적절한 행 헤더/tfoot을 둡니다. 복잡한 관계는 headers/id를 씁니다. 개발 메모에 따라 caption이 헤더 내용을 설명합니다. 비어 있는 데이터 셀은 대시를 표시합니다. 정량 수치는 오른쪽 정렬하고, 텍스트·명목 숫자는 왼쪽 정렬합니다.

### 의미 API {#plain-semantic-api}

독립 API: caption, columns {id,label,kind,sortable?}[], rows {id,cells}[], 기존 열 하나를 가리키는 rowHeaderColumnId?, 선택적 sort {columnId,direction}/onSortChange. 없으면 정렬 동작이 없습니다. 정렬 가능하면 공식 지침에 따라 초기 정렬은 첫 번째 열입니다. 헤더 버튼은 th 안에 두고, aria-sort는 실제 순서를 따릅니다. rowHeaderColumnId가 있으면 그 열은 안정적인 ID를 가진 네이티브 th scope=row로 렌더링되며, 모든 데이터 셀이 요구되는 대로 자신의 행·열 헤더를 참조합니다. 알 수 없는 rowHeaderColumnId는 구성 오류입니다. 셀 텍스트나 kind로 행 헤더를 자동 추론하지 않습니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어/기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 의미 변경 요청 하나를 냅니다. 비활성, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 0회 냅니다. 제어 거부 시 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고, 제어 props가 계속 우선합니다. 추가 필드는 렌더러·머신 객체를 노출하지 않습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

일반 표는 읽기 전용이며, 포함된 링크·버튼을 제외하면 Tab으로 이동하지 않습니다. 정렬을 활성화해도 헤더 버튼의 초점을 유지합니다. 넘침 래퍼는 이름을 가지며, 필요할 때만 초점을 받습니다. 드래그 전용 이동이 아니라 단순한 클릭·탭 스크롤 컨트롤을 제공합니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

단순한 1차원 표는 연관성을 보존하면서 헤더·데이터 쌍을 쌓을 수 있습니다. 복잡한 표는 가로 영역 스크롤을 씁니다. 가로 스크롤바를 발견하기 쉽게 유지하고 데이터를 잘라내지 않습니다. 제한적인 모달·아코디언 배치는 피합니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

표 자체의 폼·리셋 상태는 없습니다. 포함된 컨트롤은 자신의 의미를 유지합니다. 선택 중심 상호작용은 StructuredList의 몫입니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 데이터, 형식, 정렬 핸들러를 소유합니다. 로컬 예시는 실제로 행을 재정렬하며 헤더 연관을 보존합니다. 완료는 div 그리드가 아니라 네이티브 의미와 조건부 정렬을 요구합니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, caption, head, body, row, header-cell, cell, sort-trigger, scroll-region, scroll-previous, scroll-next; ascending,descending,overflow.

렌더링되는 모든 소유 파트는 `data-krds-component="table"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 기준입니다. 위 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `basic`, `sortable`, `narrow-scroll`, `narrow-stacked`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-24) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_04_11.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/index.md)를 읽어야 합니다.
