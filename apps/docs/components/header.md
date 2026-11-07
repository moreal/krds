---
title: '헤더 · Header'
---

# 헤더 {#header}

Header · `Header` · composition

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_02_03.html) · [검토된 전체 명세](/sources/specs/components/header.md.txt) · [프레임워크 지원](../compatibility/)

## 네이티브 지원 현황 {#native-availability}

아래 상태는 `catalog/coverage.json`에서 그대로 가져옵니다. export, 예제, 테스트 실행기 종료 코드에서 추론하지 않습니다.

| 프레임워크 | 패키지 버전 | 기록된 상태 | export 선언 | 네이티브 예제와 스토리 |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/react/package.json.txt); [과거 선언 체크포인트](/sources/packages/react/dist/components/header/index.d.ts.txt) | [react 소스와 미리보기 정책](../compatibility/examples#react) |
| solid | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/solid/package.json.txt); [과거 선언 체크포인트](/sources/packages/solid/dist/components/header/index.d.ts.txt) | [solid 소스와 미리보기 정책](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/svelte/package.json.txt); [과거 선언 체크포인트](/sources/packages/svelte/dist/components/Header.svelte.d.ts.txt) | [svelte 소스와 미리보기 정책](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/vue/package.json.txt); [과거 선언 체크포인트](/sources/packages/vue/dist/components/header/Header.vue.d.ts.txt) | [vue 소스와 미리보기 정책](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/lit/package.json.txt); [과거 선언 체크포인트](/sources/packages/lit/dist/components/header/index.d.ts.txt) | [lit 소스와 미리보기 정책](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/qwik/package.json.txt); [과거 선언 체크포인트](/sources/packages/qwik/dist/components/header/index.d.ts.txt) | [qwik 소스와 미리보기 정책](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/angular/package.json.txt); [과거 선언 체크포인트](/sources/packages/angular/dist/types/unofficial-krds-angular-header.d.ts.txt) | [angular 소스와 미리보기 정책](../compatibility/examples#angular) |
| solid-next (미리보기) | `0.1.0-preview.0` | planned | [현재 루트 매니페스트](/sources/packages/solid-next/package.json.txt); [과거 선언 체크포인트](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next 소스와 미리보기 정책](../compatibility/examples#solid-next) |

## 속성·이벤트·콘텐츠·기본값 {#props-events-content-and-defaults}

아래 의미 계약은 공유 데이터일 뿐입니다. 네이티브 콘텐츠, ref, 이벤트 전달은 각 어댑터가 맡습니다. 계약의 콜백 이름과 detail 타입은 그대로 씁니다. 머신 객체를 전달하지 않습니다. 선택 속성에는 기본값이 자동으로 채워지지 않습니다. 아래 안내의 명시적 기본값을 씁니다.

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

| 의미 속성 / 콜백 | 필수 | 정확한 타입 | 역할 |
| --- | --- | --- | --- |
| `currentId` | 아니요 | `string` | 데이터 / 상태 |
| `mobileOpen` | 아니요 | `boolean` | 데이터 / 상태 |
| `defaultMobileOpen` | 아니요 | `boolean` | 데이터 / 상태 |
| `onMobileOpenChange` | 아니요 | `(detail: OpenChangeDetails) => void` | 의미 이벤트 요청 |
| `mobileTriggerId` | 아니요 | `string` | 데이터 / 상태 |
| `mobileTriggerLabel` | 아니요 | `string` | 데이터 / 상태 |
| `navigationLabel` | 아니요 | `string` | 데이터 / 상태 |
| `home` | 예 | `LinkData & {logo: LogoData}` | 데이터 / 상태 |
| `utilityItems` | 예 | `readonly (LinkData & {id: string})[]` | 데이터 / 상태 |
| `search` | 아니요 | `{label: string; onRequest: () => void}` | 데이터 / 상태 |
| `mainNavigation` | 예 | `readonly NavigationItem[]` | 데이터 / 상태 |
| `actionLayout` | 아니요 | `'vertical' \| 'horizontal'` | 데이터 / 상태 |
| `sticky` | 아니요 | `boolean` | 데이터 / 상태 |

선택 값과 명시적 기본값은 다릅니다. 기본값과 네이티브 콘텐츠 요구사항은 아래 검토된 안내에 있습니다.

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 네이티브 JSX/콘텐츠 prop을 씁니다. Svelte는 네이티브 snippet을 씁니다. Vue는 네이티브 슬롯을 씁니다. Angular는 네이티브 input, output, 콘텐츠 투영을 씁니다. Lit은 custom element 속성, 슬롯, DOM 이벤트를 씁니다. Qwik은 네이티브 QRL 이벤트 경계를 씁니다. 이 전달 방식은 서로 바꿔 쓸 수 없습니다. 정확한 이름과 필수 콘텐츠는 링크된 공개 패키지 선언에서 확인합니다. 아래 의미 콜백이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

공식 상대 순서대로 구성합니다. 건너뛰기 링크(SkipLink)가 첫째, 이어서 공식 배너(Masthead), 서비스 정체성/홈 링크, 유틸리티 그룹(유틸리티 링크가 다섯 개 이상이면 드롭다운), 검색 동작, 메인 메뉴(MainMenu)입니다. 정부 로고는 왼쪽 위, 유틸리티는 오른쪽 위에 둡니다. 네이티브 &lt;header>가 서비스 배너 랜드마크입니다. 문서에서 가장 먼저 오도록 건너뛰기 링크는 그 앞에 인접해 둘 수 있습니다.

### 의미 API {#plain-semantic-api}

독립 API입니다. Header는 home {href,label,logo}, utilityItems {id,label,href}, search {label,onRequest}, mainNavigation 의미 데이터, actionLayout vertical/horizontal(기본 horizontal), sticky=false를 받습니다. 불투명한 임의 컨테이너가 아니라 이름이 있는 명시적 컴포넌트 영역을 씁니다. 공개 데이터와 이벤트는 Ark/Zag 인스턴스를 노출하지 않습니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어와 기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 변경 요청 하나를 냅니다. 비활성, 무동작, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

**추가되는 네이티브 조합 입력:** currentId는 기존 실제 MainMenu에서 현재 경로를 선택적으로 표시합니다. mobileOpen/defaultMobileOpen/onMobileOpenChange({open})는 같은 메뉴의 모바일 펼침을 노출합니다. false를 포함해 mobileOpen이 정의되면 그 값이 우선하고, 아니면 기본값을 한 번 읽습니다(기존 기본값은 닫힘). 둘을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 사용자 동작이 수용되면 일반 요청 하나를 냅니다. 마운트, prop, 리셋은 요청을 내지 않습니다. 거부되면 확정된 실제 패널·초점 상태를 보존합니다. mobileTriggerId/mobileTriggerLabel은 실제 기본 모바일 트리거를 선택적으로 식별하고 이름 붙입니다. navigationLabel은 실제 MainMenu 랜드마크의 이름을 선택적으로 정하며 그 레이블로 전달됩니다. 생략하면 기존 기본값을 유지합니다. 네이티브 navigationContent/슬롯 전달로 같은 실제 네이티브 MainMenu 하나를 줄 수 있습니다. 이때 current/open/기본 트리거 정체성을 공유해야 하며, 빈 메뉴나 추가 내비게이션 래퍼를 만들면 안 됩니다. 전달하는 트리거 ID와 레이블은 비어 있지 않아야 하고 실제 컨트롤에 이름을 붙입니다. 이 의미 API에는 렌더러 객체가 들어가지 않습니다. T11은 주요 메뉴와 그 실제 트리거 ID를 명시적으로 전달합니다. 사이드바 이름은 기존 제목 예제 메뉴를 씁니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

링크 이동에는 네이티브 앵커를 씁니다. 유틸리티/메뉴 토글과 검색에는 이름 있는 버튼을 씁니다. 하위 MainMenu가 펼침/현재 상태와 모바일 레이어 초점을 맡습니다. 검색은 가짜 로컬 검색 서비스를 만들지 않고 onRequest를 한 번 요청합니다. 로고 링크 이름에는 중복되는 “logo”를 넣지 않습니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

메뉴가 더는 들어가지 않으면 바를 이름 있는 햄버거 열기 버튼과 키보드로 조작할 수 있는 메뉴 레이어로 바꿉니다. 고정(sticky) 동작은 선택입니다. 공식 배너는 고정 영역에서 제외합니다. 헤더가 두 줄을 넘으면 위로 스크롤할 때 나타나고 아래로 스크롤할 때 풀립니다. 네이티브 모바일 앱 전용 왼쪽 메뉴 제한·설정은 모바일 웹의 보편 의무가 아닙니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

Header 자체에는 폼 상태가 없습니다. 검색 폼은 호스트/검색 조합에 속하며 입력한 검색어와 IME 동작은 거기서 보존합니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

완료하려면 SkipLink, 공식 배너 표본, Link, MainMenu, 선택 LanguageSwitcher/Resize를 결정적 상태로 조합한 동작하는 로컬 구성이 필요합니다. 다른 렌더러에서 어댑터를 가져오지 않습니다. 인증, 검색 이동, 기관 로고, 유틸리티 목적지는 호스트가 책임집니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, identity, utilities, utility-trigger, actions, search, navigation, mobile-trigger; expanded/collapsed, sticky.

렌더링된 모든 소유 파트는 `data-krds-component="header"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 씁니다. 네이티브/ARIA 상태가 우선합니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

지원하는 케이스 축: `vertical-actions`, `horizontal-actions`, `mobile-menu`, `sticky`. 이 케이스 이름은 프로젝트의 독립 축입니다. 공식 KRDS 유형 이름이나 완료된 커버리지를 뜻하지 않습니다.

[필수 네이티브 스토리 매니페스트](/sources/catalog/full-catalog-stories.json.txt) · [파일럿 스토리 매니페스트](/sources/catalog/story-cases.json.txt) · [커버리지 근거와 네이티브 리뷰 링크](/sources/catalog/coverage.json.txt)

필수 전체 카탈로그 스토리: `krds-header--horizontal-actions`, `krds-header--vertical-actions`, `krds-header--five-utilities`, `krds-header--mobile-menu`, `krds-header--sticky-long-page`, `krds-header--translated-long-labels`.

### 로컬 네이티브 스토리 {#local-native-stories}

픽스처와 Storybook 출력은 로컬 전용입니다. 이 공개 문서 사이트에 올리지 않습니다. 로컬 문서 서버도 그쪽으로 리디렉션하지 않습니다. 각 네이티브 Storybook은 자기 워크스페이스 스크립트로 실행합니다. 컴포넌트 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/` 아래에 조립된 네이티브 미리보기입니다. Solid 2에는 지원되는 네이티브 Storybook 통합이 없습니다. Qwik 프로덕션 SSR/resume에는 실제 서버가 필요합니다. 정적 미리보기로 대신할 수 없습니다. 스토리가 있다고 동작 인수가 성립하지는 않습니다.

네이티브 컴파일러 체크포인트입니다. 소스 해시는 문서를 빌드할 때마다 검증합니다. 이 기록은 최신 네이티브 후보나 동작 인수를 인증하지 않습니다. 검사된 소스 페이지마다 체크포인트 범위가 적혀 있습니다.

- react: [검사된 소비 코드 보기](/examples/react-1); [소스 그대로 내려받기](/sources/packages/react/examples/catalog.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [검사된 소비 코드 보기](/examples/solid-3); [소스 그대로 내려받기](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [검사된 소비 코드 보기](/examples/svelte-6); [소스 그대로 내려받기](/sources/apps/fixture-svelte/src/public-examples/HeaderExample.svelte.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [검사된 소비 코드 보기](/examples/vue-58); [소스 그대로 내려받기](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [검사된 소비 코드 보기](/examples/lit-60); [소스 그대로 내려받기](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [검사된 소비 코드 보기](/examples/qwik-61); [소스 그대로 내려받기](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [검사된 소비 코드 보기](/examples/angular-62); [소스 그대로 내려받기](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## 출처와 권리 {#source-identity-and-rights}

기준선: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. 공식 상세 스냅숏 수집 시각: `2026-10-29T23:28:02.681Z`. SHA-256: `09265da2efd4f428c0c55d0593d2e8554484769ef8b4b7d1e4e6f7b95557053e`. [고정된 컴포넌트 출처 기록](/sources/catalog/components.json.txt) · [공식 출처](https://www.krds.go.kr/html/site/component/component_02_03.html). 원본 HTML은 체크아웃의 참고 근거로만 남습니다. 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
