---
title: 'Side navigation'
---

# Side navigation {#side-navigation}

사이드 메뉴 · `SideNavigation`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_03_04.html) · [전체 명세](/sources/specs/components/side-navigation.md.txt) · [프레임워크 지원](../compatibility/)

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
export interface SideNavigationContract {
    items: readonly NavigationItem[];
    currentId?: string;
    expandedIds?: readonly string[];
    defaultExpandedIds?: readonly string[];
    onExpandedChange?: (detail: {
        ids: readonly string[];
    }) => void;
    title?: string;
    parentLink?: LinkData;
}

export interface NavigationItem {
    id: string;
    label: string;
    href?: string;
    description?: string;
    children?: readonly NavigationItem[];
}

export interface LinkData {
    id?: string;
    label: string;
    href: string;
    target?: string;
    rel?: string;
}
```

| 속성 / 콜백 | 필수 | 타입 | 역할 |
| --- | --- | --- | --- |
| `items` | 예 | `readonly NavigationItem[]` | 데이터 / 상태 |
| `currentId` | 아니요 | `string` | 데이터 / 상태 |
| `expandedIds` | 아니요 | `readonly string[]` | 데이터 / 상태 |
| `defaultExpandedIds` | 아니요 | `readonly string[]` | 데이터 / 상태 |
| `onExpandedChange` | 아니요 | `(detail: {ids: readonly string[]}) => void` | 이벤트 |
| `title` | 아니요 | `string` | 데이터 / 상태 |
| `parentLink` | 아니요 | `LinkData` | 데이터 / 상태 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

이름 있는 내비게이션 랜드마크에 선택적 제목·상위로 돌아가기 컨트롤, 중첩된 &lt;ul>/&lt;li> 링크, 선택된 잎 항목 단서, 별도의 하위 펼침 버튼을 둡니다. 한 번에 최대 두 수준만 노출합니다. 더 깊은 구조는 헤더 맥락과 함께 점진적으로 노출합니다. 현재 잎 항목은 aria-current=page, 트리거는 aria-expanded/controls를 갖습니다.

### 의미 API {#plain-semantic-api}

독립 API: items {id,label,href?,children?}[], currentId, expandedIds/defaultExpandedIds(초기값은 현재 가지), onExpandedChange({ids}), title/parentLink(선택). 여러 가지를 독립적으로 펼칠 수 있습니다. 아코디언(Accordion)의 단일 열림 기본값을 적용하지 않습니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어/기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 의미 변경 요청 하나를 냅니다. 비활성, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 0회 냅니다. 제어 거부 시 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고, 제어 props가 계속 우선합니다. 추가 필드는 렌더러·머신 객체를 노출하지 않습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

Tab은 보이는 계층 순서를 따릅니다. Enter/클릭은 잎 항목에서는 이동하고 부모에서는 펼침을 토글합니다. 두 번째 가지를 열어도 첫 번째는 열려 있습니다. 접힌 하위 항목은 초점과 접근성 트리에서 제외합니다. 초점이 있는 하위 항목을 포함한 가지를 접으면 초점은 그 가지의 트리거로 돌아갑니다. 비모달 데스크톱 내비게이션에는 초점 트랩이 없습니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

너비가 부족하면 사이드바를 숨기고, 호스트의 MainMenu가 동등한 내비게이션을 제공합니다. 전체 4수준 이상이면 페이지 제목 드롭다운이 현재 깊은 수준을 노출할 수 있습니다. 동등한 경로 접근이 있을 때만 숨깁니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

폼·리셋·IME 상태는 없습니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

완료는 실제 Link·펼침 동작과 헤더 기반 깊은 내비게이션 픽스처를 조합합니다. 호스트가 경로 트리, 현재 상태, 좁은 화면의 동등한 내비게이션을 소유합니다. 문서화되지 않은 어댑터 간 재사용은 없습니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, header, parent-link, list, item, link, trigger, submenu, indicator; current,expanded,collapsed.

렌더링되는 모든 소유 파트는 `data-krds-component="side-navigation"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 기준입니다. 위 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `simple`, `with-header`, `mobile-dropdown`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-11) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_03_04.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
