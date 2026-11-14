---
title: 'In-page navigation'
---

# In-page navigation {#in-page-navigation}

콘텐츠 내 탐색 · `InPageNavigation` — 긴 페이지에서 원하는 구역으로 바로 이동하게 합니다.

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_03_05.html) · [전체 명세](/sources/specs/components/in-page-navigation.md.txt) · [프레임워크 지원](../compatibility/)

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
| `sections` | `readonly InPageSection[]` | 필수 | 속성 |
| `title` | `string` | 선택 | 속성 |
| `activeId` | `string` | 선택 | 속성 |
| `onActiveChange` | `(detail: {id: string; reason: 'scroll' \| 'activation'}) => void` | 선택 | 이벤트 |
| `narrowMode` | `'inline' \| 'disclosure'` | 선택 | 속성 |

표에 나온 타입의 정의입니다.

```ts
export interface InPageNavigationContract {
    sections: readonly InPageSection[];
    title?: string;
    activeId?: string;
    onActiveChange?: (detail: {
        id: string;
        reason: 'scroll' | 'activation';
    }) => void;
    narrowMode?: 'inline' | 'disclosure';
}

export interface InPageSection {
    id: string;
    label: string;
    children?: readonly InPageSection[];
}
```

### 프레임워크별 콘텐츠와 이벤트 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 마크업 구조와 순서 {#native-structure-and-mandatory-ordering}

구성은 개요 제목(h1 아님), 같은 문서 섹션 링크의 중첩 목록, 활성 섹션 표시입니다. 데스크톱 CSS가 오른쪽에 두더라도 마크업은 페이지 제목과 본문 사이에 둡니다. 링크 레이블은 대상 헤딩과 일치해야 합니다. 단계는 최대 세 개이며 보통 한 개를 씁니다.

### API와 기본값 {#plain-semantic-api}

독립 API입니다. sections {id,label,children?}[], title="이 페이지의 구성", activeId/onActiveChange({id,reason}), 선택적 접이식 좁은 화면 모드를 씁니다. 실제 앵커가 등록된 섹션을 가리킵니다. 활성 상태는 링크 활성화와 무관하게 스크롤 관찰을 따릅니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어와 기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 변경 요청 하나를 냅니다. 비활성, 무동작, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

### 키보드와 초점 {#keyboard-focus-and-state-transitions}

Tab/Shift+Tab으로 링크를 순회합니다. Enter와 공식 Space 동작은 대상 헤딩/섹션으로 스크롤하고 초점을 옮깁니다. 마우스 클릭은 스크롤하되 초점은 링크에 남습니다. Space의 페이지 스크롤 방지는 개요 링크 활성화에서만 하고, 조합 입력은 무시합니다. 스크롤 관찰자의 패시브 갱신으로는 초점을 옮기지 않습니다.

### 반응형 동작 {#responsive-mobile-requirements}

데스크톱에서는 오른쪽에 배치합니다. 좁은 화면에서는 개요가 제목과 본문 사이에 고정되지 않은 채 놓이며, 길면 선택적으로 Disclosure를 씁니다. 고정 헤더 오프셋과 동작 줄이기를 고려합니다. 무한 스크롤 개요는 없습니다.

### 폼 제출과 초기화 {#forms-reset-and-composition}

폼 값과 리셋은 없습니다. 키보드 처리가 조합(composing) 이벤트를 받을 때만 IME를 고려한 키 필터링을 합니다.

### 호스트 책임과 완료 기준 {#asset-integration-and-composition-completion}

호스트가 일치하는 안정적인 섹션 헤딩/대상을 제공하며 섹션을 제거할 수도 있습니다. 언마운트·라우트 변경 시 관찰자를 정리하고, 오래된 대상에 초점을 두지 않고 활성 상태를 갱신합니다. 완료하려면 실제 목적지가 있는 긴 페이지가 필요합니다.

### 파트와 상태 속성 {#stable-parts-and-states}

root, header, title, list, item, link, indicator, disclosure-trigger; active,expanded/collapsed.

렌더링된 모든 소유 파트는 `data-krds-component="in-page-navigation"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 씁니다. 네이티브/ARIA 상태가 우선합니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 지원하는 변형 {#state-examples-and-native-checks}

`desktop-side`, `mobile-inline`, `mobile-disclosure`

이 이름은 프로젝트가 정한 구분이며 공식 KRDS 유형 이름은 아닙니다.

### 예제 코드 {#local-native-stories}

위 미리보기는 각 프레임워크의 실제 패키지로 만든 예제입니다. Storybook은 로컬에서만 실행하며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-12) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_03_05.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
