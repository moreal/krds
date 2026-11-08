---
title: 'Pagination'
---

# Pagination {#pagination}

페이지네이션 · `Pagination`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_03_06.html) · [전체 명세](/sources/specs/components/pagination.md.txt) · [프레임워크 지원](../compatibility/)

## 네이티브 지원 현황 {#native-availability}

상태는 기록된 커버리지 기준입니다. [상태의 의미](../compatibility/#what-the-evidence-means)를 참고하세요.

| 프레임워크 | 패키지 버전 | 상태 | 예제 |
| --- | --- | --- | --- |
| react | `0.1.0` | planned | [react 예제](../compatibility/examples#react) |
| solid | `0.1.0` | planned | [solid 예제](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [svelte 예제](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [vue 예제](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [lit 예제](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [qwik 예제](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [angular 예제](../compatibility/examples#angular) |
| solid-next (미리보기) | `0.1.0-preview.0` | planned | [solid-next 예제](../compatibility/examples#solid-next) |

## 속성·이벤트·콘텐츠·기본값 {#props-events-content-and-defaults}

모든 프레임워크가 공유하는 의미 계약입니다. 콜백 이름과 detail 타입은 그대로 씁니다. 네이티브 콘텐츠, ref, 이벤트 전달은 각 어댑터가 맡습니다. 선택 속성의 기본값은 자동으로 채워지지 않으므로 아래 안내의 명시적 기본값을 씁니다.

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

| 속성 / 콜백 | 필수 | 타입 | 역할 |
| --- | --- | --- | --- |
| `page` | 아니요 | `number` | 데이터 / 상태 |
| `defaultPage` | 아니요 | `number` | 데이터 / 상태 |
| `pageCount` | 예 | `number` | 데이터 / 상태 |
| `hrefForPage` | 예 | `(page: number) => string` | 데이터 / 상태 |
| `onPageChange` | 아니요 | `(detail: {page: number}) => void` | 이벤트 |
| `variant` | 아니요 | `'number-links' \| 'direct-page' \| 'load-more'` | 데이터 / 상태 |
| `loadMore` | 아니요 | `{shown: number; total: number; pending: boolean; firstNewItemId?: string; onLoadMore: () => void}` | 데이터 / 상태 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

데이터셋에 연결된 이름 있는 `<nav>`입니다. 소스 순서는 이전, 번호 링크 `<ul>`, 다음, 선택적 페이지 입력, 전체 레이블, 이동 버튼입니다. 더보기 유형을 제외하면 첫/마지막 페이지에 항상 닿을 수 있어야 합니다. 현재 번호는 `href`를 제거하고 `aria-current=true`를 가집니다. 줄임표는 비대화형입니다. 더보기는 결과 목록 뒤에 둡니다.

### 의미 API {#plain-semantic-api}

독립 API: `page`/`defaultPage=1`, `pageCount`, `hrefForPage(page)`, `onPageChange({page})`, `variant=number-links`, 선택적 직접 페이지 입력, 또는 더보기 `{shown,total,pending,onLoadMore,firstNewItemId}`. 페이지 크기를 뷰포트에서 유도하지 않습니다. 범위를 벗어난 페이지 입력은 편집 가능한 문자열로 남고, 이동 없이 오류를 알립니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 값/열림 상태를 정의하면 제어 모드, 없으면 비제어 모드입니다. 제어/기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청 하나를 내보냅니다. 비활성, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내보내지 않습니다. 제어 모드에서 거부되면 커밋된 UI/초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 그대로 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

네이티브 앵커가 탐색을 보존합니다. 현재/사용 불가 링크는 활성화되지 않습니다. 이동과 더보기는 버튼입니다(Enter/Space). 호스트가 결과를 덧붙인 뒤 더보기는 처음 추가된 항목으로 스크롤하고 초점을 옮기며, 표시 개수를 갱신하고, 실패 시 맥락을 보존합니다. 제어 prop만으로는 아무것도 내보내지 않습니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

번호/줄임표는 데스크톱에서 최대 11개, 좁은 화면에서 7개입니다. 좁은 화면에서는 이전/다음 줄이 시각적으로 번호 줄 앞에 오지만 공식 DOM 순서는 바뀌지 않습니다. 데이터셋의 페이지 수와 페이지당 개수는 뷰포트와 무관하게 안정적이어야 합니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

직접 페이지 입력에는 보이는 레이블과 오류 관계가 있으며, 둘러싼 폼의 암묵적 제출은 없습니다. 리셋은 페이지 입력 초안 텍스트를 실제 페이지로 복원합니다. IME 조합은 이동을 실행하지 않습니다. Pagination 자체는 폼 값을 내지 않습니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

데이터 로딩, URL, 총계, 덧붙이기 성공 확인은 호스트가 맡습니다. 로컬 스토리는 고정된 메모리 내 레코드를 쓰며 fetch하지 않습니다. 원본의 더보기 설명 문단은 직접 페이지 텍스트를 반복합니다. 일치하는 동작을 지어내지 말고 더보기 구조와 상호작용에 의존합니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, list, item, link, previous, next, ellipsis, input, total, go, load-more, count; current,disabled,pending,invalid.

렌더링되는 모든 소유 파트는 `data-krds-component="pagination"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 사용합니다. 네이티브/ARIA 상태가 기준입니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `number-links`, `direct-page`, `load-more`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-13) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_03_06.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
