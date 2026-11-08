---
title: 'Header'
---

# Header {#header}

헤더 · `Header`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_02_03.html) · [전체 명세](/sources/specs/components/header.md.txt) · [프레임워크 지원](../compatibility/README.md)

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

| 속성 / 콜백 | 필수 | 타입 | 역할 |
| --- | --- | --- | --- |
| `currentId` | 아니요 | `string` | 데이터 / 상태 |
| `mobileOpen` | 아니요 | `boolean` | 데이터 / 상태 |
| `defaultMobileOpen` | 아니요 | `boolean` | 데이터 / 상태 |
| `onMobileOpenChange` | 아니요 | `(detail: OpenChangeDetails) => void` | 이벤트 |
| `mobileTriggerId` | 아니요 | `string` | 데이터 / 상태 |
| `mobileTriggerLabel` | 아니요 | `string` | 데이터 / 상태 |
| `navigationLabel` | 아니요 | `string` | 데이터 / 상태 |
| `home` | 예 | `LinkData & {logo: LogoData}` | 데이터 / 상태 |
| `utilityItems` | 예 | `readonly (LinkData & {id: string})[]` | 데이터 / 상태 |
| `search` | 아니요 | `{label: string; onRequest: () => void}` | 데이터 / 상태 |
| `mainNavigation` | 예 | `readonly NavigationItem[]` | 데이터 / 상태 |
| `actionLayout` | 아니요 | `'vertical' \| 'horizontal'` | 데이터 / 상태 |
| `sticky` | 아니요 | `boolean` | 데이터 / 상태 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

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

케이스: `vertical-actions`, `horizontal-actions`, `mobile-menu`, `sticky`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-6) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_02_03.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/index.md)를 읽어야 합니다.
