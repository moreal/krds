---
title: 'FAB'
---

# FAB {#fab}

플로팅 버튼 · `FAB` — 화면 위에 떠서 가장 중요한 동작을 언제나 실행할 수 있게 합니다.

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_05_03.html) · [전체 명세](/sources/specs/components/fab.md.txt) · [프레임워크 지원](../compatibility/)

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
| `label` | `string` | 필수 | 속성 |
| `icon` | `string` | 필수 | 속성 |
| `showLabel` | `boolean` | 선택 | 속성 |
| `disabled` | `boolean` | 선택 | 속성 |
| `onAction` | `() => void` | 선택 | 이벤트 |
| `expanded` | `boolean` | 선택 | 속성 |
| `defaultExpanded` | `boolean` | 선택 | 속성 |
| `onExpandedChange` | `(detail: {expanded: boolean}) => void` | 선택 | 이벤트 |
| `actions` | `readonly {id: string; label: string; onAction: () => void}[]` | 선택 | 속성 |

표에 나온 타입의 정의입니다.

```ts
export interface FABContract {
    label: string;
    icon: string;
    showLabel?: boolean;
    disabled?: boolean;
    onAction?: () => void;
    expanded?: boolean;
    defaultExpanded?: boolean;
    onExpandedChange?: (detail: {
        expanded: boolean;
    }) => void;
    actions?: readonly {
        id: string;
        label: string;
        onAction: () => void;
    }[];
}
```

### 프레임워크별 콘텐츠와 이벤트 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 마크업 구조와 순서 {#native-structure-and-mandatory-ordering}

오른쪽 아래에 고정된 이름 있는 동작 버튼에 아이콘과 선택적 레이블이 있습니다. 확장형은 오버레이/그림자, 확장/닫기 트리거, 관련 동작 최대 3개(2수준 이하)를 더합니다. 하단 TabBar 위에 두며 중요한 콘텐츠를 가리지 않습니다.

### API와 기본값 {#plain-semantic-api}

독립 API: 필수 접근 가능한 label, onAction(), icon, showLabel=true, expanded/defaultExpanded=false, onExpandedChange({expanded}), 확장 모드용 actions {id,label,onAction}[]. 트리거는 type=button이며, 확장은 말단 동작 실행과 별개입니다.

`showLabel?: boolean`은 선택적으로 보이는 기본 레이블만 제어합니다. 생략하면 기존의 레이블 표시(`true`)를 유지합니다. `false`이면 아이콘 전용으로 렌더하되, 필수 `label`을 실제 버튼의 접근 가능한 이름으로 보존합니다. 장식 아이콘 콘텐츠는 이름을 대신하지 않습니다. label 파트는 눈에 보이게 렌더되지 않습니다. 관련 동작은 레이블 표시와 무관하게 확장 동작을 결정합니다. 레이블 표시를 바꿔도 동작·확장 콜백이 나오지 않고, 동작, 확장 상태, 초점도 바뀌지 않습니다. 이는 공식 동작 변형이 추가된 것이 아니라 독립적인 일반 표시 정책입니다. 단일 아이콘 로컬 스토리는 `showLabel:false`, 레이블 확장은 `true`를 줍니다. 어댑터는 스토리 ID가 아니라 실제 prop을 읽어야 합니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어/기본값을 함께 주거나 모드를 바꾸는 것은 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청 하나를 냅니다. 비활성, 무동작, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 커밋된 UI와 초점 상태를 유지합니다. 취소된 리셋은 아무 일도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하며, 제어 prop이 계속 우선합니다. 추가 필드로 렌더러/머신 객체를 노출하지 않습니다.

### 키보드와 초점 {#keyboard-focus-and-state-transitions}

독립 네이티브 정책: 모든 버튼에 이름이 있고 Enter/Space로 키보드 조작이 가능하며, 트리거는 aria-expanded/controls를 가집니다. Tab은 펼쳐진 동작을 방문합니다. Escape는 접고 트리거로 초점을 돌립니다. 닫힌 동작은 탭으로 이동할 수 없습니다. 명시적으로 모달로 조합하지 않는 한 모달 트랩은 없습니다.

### 반응형 동작 {#responsive-mobile-requirements}

하단 안전 영역, TabBar 여유, 확대를 존중합니다. 제스처가 많은 페이지에서는 오버레이 가림을 피해야 합니다. 동작 줄이기는 장식용 확장 애니메이션을 끕니다.

### 폼 제출과 초기화 {#forms-reset-and-composition}

폼 값/리셋이 없으며 기본적으로 호스트 폼을 제출하지 않습니다.

### 호스트 책임과 완료 기준 {#asset-integration-and-composition-completion}

호스트가 실제 기본 동작을 제공하며, 컴포넌트 안에 인증/네트워크는 없습니다. 완료에는 동작하는 단일·확장 로컬 동작, 오버레이 배치, 정리가 필요합니다.

### 파트와 상태 속성 {#stable-parts-and-states}

root, trigger, icon, label, overlay, actions, action; expanded,collapsed,disabled.

렌더되는 모든 소유 파트는 `data-krds-component="fab"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위 열거는 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정됩니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 지원하는 변형 {#state-examples-and-native-checks}

`single-icon`, `extended-label`, `expandable`

이 이름은 프로젝트가 정한 구분이며 공식 KRDS 유형 이름은 아닙니다.

### 예제 코드 {#local-native-stories}

위 미리보기는 각 프레임워크의 실제 패키지로 만든 예제입니다. Storybook은 로컬에서만 실행하며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-29) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_05_03.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
