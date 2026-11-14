---
title: 'Structured list'
---

# Structured list {#structured-list}

구조화 목록 · `StructuredList` — 제목, 설명, 상태 같은 정보를 일정한 구조의 항목으로 나열합니다.

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_04_01.html) · [전체 명세](/sources/specs/components/structured-list.md.txt) · [프레임워크 지원](../compatibility/)

## 프레임워크 지원 현황 {#native-availability}

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

## 속성과 이벤트 {#props-events-content-and-defaults}

모든 프레임워크가 같은 속성 이름과 이벤트 타입을 씁니다. 콘텐츠를 넣는 방법과 이벤트를 받는 문법만 프레임워크마다 다릅니다. 선택 속성의 기본값은 아래 안내를 따릅니다.

| 이름 | 타입 | 필수 | 구분 |
| --- | --- | --- | --- |
| `items` | `readonly StructuredListItem[]` | 필수 | 속성 |
| `variant` | `'list' \| 'table'` | 선택 | 속성 |
| `toolbar` | `readonly {id: string; label: string; disabled?: boolean}[]` | 선택 | 속성 |
| `selection` | `{ids: readonly string[]; onChange: (detail: {ids: readonly string[]}) => void}` | 선택 | 속성 |
| `sort` | `{key: string; direction: 'ascending' \| 'descending'; onChange: (detail: {key: string; direction: 'ascending' \| 'descending'}) => void}` | 선택 | 속성 |

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

### 프레임워크별 콘텐츠와 이벤트 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 마크업 구조와 순서 {#native-structure-and-mandatory-ordering}

선택적 섹션 제목, 일관된 검색·필터·정렬·동작 툴바, 항목 목록·표, 선택적 Pagination으로 구성합니다. 각 항목은 메타데이터 분류·순서, 미리보기, 콘텐츠·CTA, 뒤따르는 공유·저장 동작을 보존합니다. 출처는 마크업에서 공유·저장이 콘텐츠 뒤에 오도록 요구합니다. 분류 값이 없으면 대시를 표시합니다.

### API와 기본값 {#plain-semantic-api}

독립 API: items {id,title,href?,metadata:{label,value}[],image?,tags?}[], variant=list|table, 툴바 의미 컨트롤, 선택적 selection {ids,onChange}, 선택적 sort {key,direction,onChange}. 항목의 링크·동작 계약을 명시적으로 제공합니다. 카드 전체가 버튼 안에 버튼을 담는 중첩 버튼이 되어서는 안 됩니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어/기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 의미 변경 요청 하나를 냅니다. 비활성, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 0회 냅니다. 제어 거부 시 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고, 제어 props가 계속 우선합니다. 추가 필드는 렌더러·머신 객체를 노출하지 않습니다.

### 키보드와 초점 {#keyboard-focus-and-state-transitions}

모든 동작은 키보드·터치, 보이는 초점, 네이티브 링크·버튼으로 작동합니다. 정렬·검색 활성화는 활성화한 UI에 초점을 유지합니다. 선택은 레이블이 있는 체크박스를 씁니다. 새 창·애플리케이션을 여는 동작은 결과를 설명합니다. 호스트가 구성한 동작만 제공합니다.

### 반응형 동작 {#responsive-mobile-requirements}

쌓을 때 메타데이터 순서를 유지하고, 툴바 순서도 일관되게 둡니다. 표 변형은 넘침·리플로 상황에서도 표 의미와 헤더 관계를 보존합니다.

### 폼 제출과 초기화 {#forms-reset-and-composition}

하위 검색·선택 필드는 네이티브 폼·리셋·IME 계약을 유지합니다. 직렬화되는 집계 “list” 필드를 만들어 내지 않습니다.

### 호스트 책임과 완료 기준 {#asset-integration-and-composition-completion}

완료하려면 로컬 데이터 조합에서 툴바, 선택, CTA, 공유·저장, Badge/Tag, 선택적 Pagination이 작동해야 합니다. 자식을 담은 div만으로는 부족합니다. 필터링 알고리즘·데이터, 공유 대상, 저장 영속성은 호스트가 소유합니다. 스토리는 순수 로컬 상태를 씁니다.

### 파트와 상태 속성 {#stable-parts-and-states}

root, header, toolbar, list, item, preview, content, metadata, cta, badges, tags, actions, pagination; selected,pending,empty.

렌더링되는 모든 소유 파트는 `data-krds-component="structured-list"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 기준입니다. 위 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 지원하는 변형 {#state-examples-and-native-checks}

`list`, `table`

이 이름은 프로젝트가 정한 구분이며 공식 KRDS 유형 이름은 아닙니다.

### 예제 코드 {#local-native-stories}

위 미리보기는 각 프레임워크의 실제 패키지로 만든 예제입니다. Storybook은 로컬에서만 실행하며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-14) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_04_01.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
