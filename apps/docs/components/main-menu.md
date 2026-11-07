---
title: '메인 메뉴 · Main menu'
---

# 메인 메뉴 {#main-menu}

Main menu · `MainMenu` · composition

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_03_02.html) · [검토된 전체 명세](/sources/specs/components/main-menu.md.txt) · [프레임워크 지원](../compatibility/)

## 네이티브 지원 현황 {#native-availability}

아래 상태는 `catalog/coverage.json`에서 그대로 가져옵니다. export, 예제, 테스트 실행기 종료 코드에서 추론하지 않습니다.

| 프레임워크 | 패키지 버전 | 기록된 상태 | export 선언 | 네이티브 예제와 스토리 |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/react/package.json.txt); [과거 선언 체크포인트](/sources/packages/react/dist/components/main-menu/index.d.ts.txt) | [react 소스와 미리보기 정책](../compatibility/examples#react) |
| solid | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/solid/package.json.txt); [과거 선언 체크포인트](/sources/packages/solid/dist/components/main-menu/index.d.ts.txt) | [solid 소스와 미리보기 정책](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/svelte/package.json.txt); [과거 선언 체크포인트](/sources/packages/svelte/dist/components/MainMenu.svelte.d.ts.txt) | [svelte 소스와 미리보기 정책](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/vue/package.json.txt); [과거 선언 체크포인트](/sources/packages/vue/dist/components/main-menu/MainMenu.vue.d.ts.txt) | [vue 소스와 미리보기 정책](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/lit/package.json.txt); [과거 선언 체크포인트](/sources/packages/lit/dist/components/main-menu/index.d.ts.txt) | [lit 소스와 미리보기 정책](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/qwik/package.json.txt); [과거 선언 체크포인트](/sources/packages/qwik/dist/components/main-menu/index.d.ts.txt) | [qwik 소스와 미리보기 정책](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/angular/package.json.txt); [과거 선언 체크포인트](/sources/packages/angular/dist/types/unofficial-krds-angular-main-menu.d.ts.txt) | [angular 소스와 미리보기 정책](../compatibility/examples#angular) |
| solid-next (미리보기) | `0.1.0-preview.0` | planned | [현재 루트 매니페스트](/sources/packages/solid-next/package.json.txt); [과거 선언 체크포인트](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next 소스와 미리보기 정책](../compatibility/examples#solid-next) |

## 속성·이벤트·콘텐츠·기본값 {#props-events-content-and-defaults}

아래 의미 계약은 공유 데이터일 뿐입니다. 네이티브 콘텐츠, ref, 이벤트 전달은 각 어댑터가 맡습니다. 계약의 콜백 이름과 detail 타입은 그대로 씁니다. 머신 객체를 전달하지 않습니다. 선택 속성에는 기본값이 자동으로 채워지지 않습니다. 아래 안내의 명시적 기본값을 씁니다.

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

| 의미 속성 / 콜백 | 필수 | 정확한 타입 | 역할 |
| --- | --- | --- | --- |
| `label` | 아니요 | `string` | 데이터 / 상태 |
| `mobileTriggerId` | 아니요 | `string` | 데이터 / 상태 |
| `mobileTriggerLabel` | 아니요 | `string` | 데이터 / 상태 |
| `items` | 예 | `readonly NavigationItem[]` | 데이터 / 상태 |
| `currentId` | 아니요 | `string` | 데이터 / 상태 |
| `expandedId` | 아니요 | `string \| null` | 데이터 / 상태 |
| `defaultExpandedId` | 아니요 | `string \| null` | 데이터 / 상태 |
| `onExpandedChange` | 아니요 | `(detail: {id: string \| null}) => void` | 의미 이벤트 요청 |
| `mobileOpen` | 아니요 | `boolean` | 데이터 / 상태 |
| `defaultMobileOpen` | 아니요 | `boolean` | 데이터 / 상태 |
| `onMobileOpenChange` | 아니요 | `(detail: OpenChangeDetails) => void` | 의미 이벤트 요청 |
| `query` | 아니요 | `string` | 데이터 / 상태 |
| `onQueryChange` | 아니요 | `(detail: ValueChangeDetails<string>) => void` | 의미 이벤트 요청 |

선택 값과 명시적 기본값은 다릅니다. 기본값과 네이티브 콘텐츠 요구사항은 아래 검토된 안내에 있습니다.

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 네이티브 JSX/콘텐츠 prop을 씁니다. Svelte는 네이티브 snippet을 씁니다. Vue는 네이티브 슬롯을 씁니다. Angular는 네이티브 input, output, 콘텐츠 투영을 씁니다. Lit은 custom element 속성, 슬롯, DOM 이벤트를 씁니다. Qwik은 네이티브 QRL 이벤트 경계를 씁니다. 이 전달 방식은 서로 바꿔 쓸 수 없습니다. 정확한 이름과 필수 콘텐츠는 링크된 공개 패키지 선언에서 확인합니다. 아래 의미 콜백이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

이름 있는 `<nav aria-label="메인 메뉴">`가 제목/목록 계층을 담습니다. 말단 항목은 실제 링크입니다. 하위 항목을 펼치는 항목은 버튼이며, 꺾쇠와 현재/펼침 단서를 갖습니다. 데스크톱 드롭다운은 제목과 선택적 설명/유틸리티를 포함합니다. 모바일 레이어는 여는 버튼, 유틸리티, 섹션 탐색, 선택적 메뉴 내 검색, 상위 이동 버튼, 닫기 버튼을 포함합니다.

### 의미 API {#plain-semantic-api}

독립 API: `items` `{id,label,href?,description?,children?}[]`, `currentId`, `expandedId`/`defaultExpandedId`, `onExpandedChange({id})`, `mobileOpen`/`defaultMobileOpen`, `onMobileOpenChange({open})`, 검색을 제공할 때 로컬 `query`/`onQueryChange`. 노출하는 탐색 수준은 최대 3단계입니다. 더 깊은 드릴다운 데이터는 데스크톱 평탄화와 분리합니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 값/열림 상태를 정의하면 제어 모드, 없으면 비제어 모드입니다. 제어/기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청 하나를 내보냅니다. 비활성, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내보내지 않습니다. 제어 모드에서 거부되면 커밋된 UI/초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 그대로 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

**추가 랜드마크·트리거 식별:** `label`로 실제 내비게이션 랜드마크 이름을 줄 수 있습니다(기존 기본값 메인 메뉴는 그대로). `mobileTriggerId`/`mobileTriggerLabel`로 실제 기본 모바일 여는 버튼 하나의 ID와 이름을 줄 수 있습니다. 생략하면 기존 기본값을 유지합니다. 헤더(Header)가 조합하면 그 `navigationLabel`이 이 `label`에 대응하고, 공유 현재/모바일 상태는 같은 메뉴 인스턴스를 대상으로 합니다. Header가 기본 네이티브 트리거를 소유하면 어댑터가 그 실제 네이티브 컨트롤을 내부에서 연결하고, ID 중복 없이 중복 여는 버튼을 숨깁니다. 네이티브 콘텐츠 슬롯은 이 실제 메뉴의 전달 통로이며, 빈 두 번째 메뉴나 추가 내비게이션 래퍼를 렌더링해도 된다는 허가가 아닙니다. 일반 ID는 어댑터 네이티브 ref나 유효한 같은 루트 관계를 대체하지 않습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

클릭/Enter가 부모를 토글합니다. 호버만으로 열지 않습니다. Escape는 펼친 드롭다운을 모두 닫고 최상위 트리거로 초점을 옮깁니다. Tab은 계층 순서를 따릅니다. 공식 드롭다운 활성 단서 `aria-current=true`는 현재 말단의 `aria-current=page`와 구분합니다. `aria-expanded`/`controls`도 노출합니다. 닫힌 하위 항목은 초점/접근성 트리에서 제외합니다. 모바일 전체 화면 모달 레이어는 프로젝트 선택으로 검토된 모달(Modal)의 초점/격리 계약을 따르며, 말단 앵커는 브라우저 동작을 유지합니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

데스크톱 드롭다운의 최대 높이는 70vh이며 내부에서 스크롤합니다. 좁은 화면은 잘린 데스크톱 링크 대신 햄버거 레이어를 씁니다. 검색은 복잡한 메뉴에서 선택 사항이며 스토리에서는 로컬입니다. 레이아웃을 바꿀 때 초점 순서를 재배열하지 않습니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

탐색에는 폼 값/리셋이 없습니다. 선택적 검색은 IME를 보존하며, 조합 중 Enter로 탐색을 활성화하지 않습니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

링크(Link), 버튼, 모바일 대화상자, 선택적 텍스트 입력 필드(TextInput), 유틸리티를 각 렌더러에서 네이티브로 조합합니다. 라우트 맵/현재 페이지, 인증/유틸리티, 검색 결정은 호스트가 맡습니다. 메뉴는 데이터를 가져오지 않으며 네이티브 링크 외에 히스토리를 바꾸지 않습니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, list, item, trigger, link, indicator, submenu, submenu-title, description, utilities, mobile-trigger, mobile-content, back, close, search; expanded/collapsed,current, mobile-open.

렌더링되는 모든 소유 파트는 `data-krds-component="main-menu"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 사용합니다. 네이티브/ARIA 상태가 기준입니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

지원하는 케이스 축: `desktop-links`, `desktop-dropdown`, `desktop-described`, `mobile-simple`, `mobile-sections`, `mobile-drilldown`. 이 케이스 이름은 프로젝트의 독립 축입니다. 공식 KRDS 유형 이름이나 완료된 커버리지를 뜻하지 않습니다.

[필수 네이티브 스토리 매니페스트](/sources/catalog/full-catalog-stories.json.txt) · [파일럿 스토리 매니페스트](/sources/catalog/story-cases.json.txt) · [커버리지 근거와 네이티브 리뷰 링크](/sources/catalog/coverage.json.txt)

필수 전체 카탈로그 스토리: `krds-main-menu--desktop-links`, `krds-main-menu--desktop-dropdown`, `krds-main-menu--desktop-described`, `krds-main-menu--large-menu-overflow`, `krds-main-menu--mobile-simple`, `krds-main-menu--mobile-sections`, `krds-main-menu--mobile-drilldown`, `krds-main-menu--local-search`.

### 로컬 네이티브 스토리 {#local-native-stories}

픽스처와 Storybook 출력은 로컬 전용입니다. 이 공개 문서 사이트에 올리지 않습니다. 로컬 문서 서버도 그쪽으로 리디렉션하지 않습니다. 각 네이티브 Storybook은 자기 워크스페이스 스크립트로 실행합니다. 컴포넌트 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/` 아래에 조립된 네이티브 미리보기입니다. Solid 2에는 지원되는 네이티브 Storybook 통합이 없습니다. Qwik 프로덕션 SSR/resume에는 실제 서버가 필요합니다. 정적 미리보기로 대신할 수 없습니다. 스토리가 있다고 동작 인수가 성립하지는 않습니다.

네이티브 컴파일러 체크포인트입니다. 소스 해시는 문서를 빌드할 때마다 검증합니다. 이 기록은 최신 네이티브 후보나 동작 인수를 인증하지 않습니다. 검사된 소스 페이지마다 체크포인트 범위가 적혀 있습니다.

- react: [검사된 소비 코드 보기](/examples/react-1); [소스 그대로 내려받기](/sources/packages/react/examples/catalog.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [검사된 소비 코드 보기](/examples/solid-3); [소스 그대로 내려받기](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [검사된 소비 코드 보기](/examples/svelte-9); [소스 그대로 내려받기](/sources/apps/fixture-svelte/src/public-examples/MainMenuExample.svelte.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [검사된 소비 코드 보기](/examples/vue-58); [소스 그대로 내려받기](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [검사된 소비 코드 보기](/examples/lit-60); [소스 그대로 내려받기](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [검사된 소비 코드 보기](/examples/qwik-61); [소스 그대로 내려받기](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [검사된 소비 코드 보기](/examples/angular-62); [소스 그대로 내려받기](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## 출처와 권리 {#source-identity-and-rights}

기준선: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. 공식 상세 스냅숏 수집 시각: `2026-10-29T23:28:02.921Z`. SHA-256: `07d43ecd2faad3500071e6cc5427534d4e5a86c680e17dde4b1ab4a5f3475e14`. [고정된 컴포넌트 출처 기록](/sources/catalog/components.json.txt) · [공식 출처](https://www.krds.go.kr/html/site/component/component_03_02.html). 원본 HTML은 체크아웃의 참고 근거로만 남습니다. 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
