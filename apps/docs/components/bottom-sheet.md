---
title: 'Bottom sheet'
---

# Bottom sheet {#bottom-sheet}

바텀시트 · `BottomSheet` — 화면 아래에서 올라오는 패널에 보조 내용이나 선택지를 담습니다.

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_12_03.html) · [전체 명세](/sources/specs/components/bottom-sheet.md.txt) · [프레임워크 지원](../compatibility/)

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
| `open` | `boolean` | 선택 | 속성 |
| `defaultOpen` | `boolean` | 선택 | 속성 |
| `onOpenChange` | `(detail: OpenChangeDetails & {reason: 'close' \| 'escape' \| 'outside' \| 'drag'}) => void` | 선택 | 이벤트 |
| `title` | `string` | 필수 | 속성 |
| `description` | `string` | 선택 | 속성 |
| `onCancel` | `() => void` | 선택 | 이벤트 |
| `initialFocusId` | `string` | 선택 | 속성 |
| `returnFocusId` | `string` | 선택 | 속성 |
| `dismissOnOutside` | `boolean` | 선택 | 속성 |

표에 나온 타입의 정의입니다.

```ts
export interface BottomSheetContract {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (detail: OpenChangeDetails & {
        reason: 'close' | 'escape' | 'outside' | 'drag';
    }) => void;
    title: string;
    description?: string;
    onCancel?: () => void;
    initialFocusId?: string;
    returnFocusId?: string;
    dismissOnOutside?: boolean;
}

export interface OpenChangeDetails {
    open: boolean;
}
```

### 프레임워크별 콘텐츠와 이벤트 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 마크업 구조와 순서 {#native-structure-and-mandatory-ordering}

하단 오버레이/시트에는 선택적 시각 헤더, 드래그 핸들, 본문, 분명히 알아볼 수 있는 상단 닫기 버튼이 있습니다. 닫기는 확정되지 않은 선택·동작을 취소합니다. 시트는 한 번에 하나만 둡니다. 긴 정책·작업 단계 콘텐츠는 피합니다. 원문의 핸들 설명은 슬라이더 문구를 반복한 것이며 범위 컨트롤을 구현하라는 지시가 아닙니다.

### API와 기본값 {#plain-semantic-api}

독립 API: open/defaultOpen=false, onOpenChange({open,reason}), 필수 접근 가능한 제목(보이는 제목 또는 aria-label), description?, content, onCancel(), initialFocusId?, returnFocusId?, dismissOnOutside=false. 첫 계약은 모달 전용입니다. 드래그로 닫기는 선택이며 동등한 닫기 동작이 있어야 합니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 정의된 value/open은 제어 모드이고 undefined는 비제어 모드입니다. 제어 prop과 기본값을 함께 주거나 모드를 바꾸면 잘못된 구성입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 시맨틱 변경 요청을 한 번 내보냅니다. 비활성, 변화 없음, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 모드에서 거부되면 커밋된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 우선합니다. 추가 필드로 렌더러·머신 객체를 노출하지 않습니다.

### 키보드와 초점 {#keyboard-focus-and-state-transitions}

독립 네이티브 정책은 검토된 Modal의 dialog 역할과 초점 진입, 트랩, 배경 격리, Escape, 여는 요소로의 복귀·언마운트 정리를 따릅니다. 닫기는 이름이 있는 type=button입니다. 포인터 핸들은 아래로 드래그하거나 탭하여 닫기를 요청할 수 있으며, 드래그가 유일한 닫기 수단이어서는 안 됩니다. 취소하면 호스트가 초안 값을 복원하며 조용히 커밋하지 않습니다.

**독립 핸들 이름과 구조 순서:** 초점을 받을 수 있는 탭하여 닫기 컨트롤로 렌더링된 핸들은 모든 렌더러에서 “시트 닫기”라는 이름의 `type=button`입니다(보이는 텍스트 없음, 막대는 공유 CSS가 그림). 탭은 이유 `close`로 닫기를 요청합니다(완료된 드래그는 `drag`를 한 번 보고하고 뒤따르는 클릭을 무시합니다). 순수 장식 핸들(드래그 전용)은 `aria-hidden`이며 텍스트가 없습니다. 렌더링 순서는 핸들, 헤더(제목, 닫기), 설명과 본문, 동작 순입니다. 이 문구는 로컬 기준이며 KRDS 공식 원문으로 귀속하지 않습니다.

### 반응형 동작 {#responsive-mobile-requirements}

시트는 하단 안전 영역과 가상 키보드를 존중하고 높이가 제한되며, 스크롤되는 콘텐츠와 동작 버튼에 접근할 수 있습니다. 동작 줄이기는 슬라이드 이동을 제거합니다. 첫 계약에서는 시트를 겹쳐 쌓지 않습니다.

### 폼 제출과 초기화 {#forms-reset-and-composition}

시트 자체의 값이나 리셋은 없습니다. 자식 폼은 독립적이며 Enter는 폼 시맨틱을 따르고 조합 중인 Escape는 무시합니다. 닫기 취소가 무관한 페이지 폼을 리셋하면 안 됩니다.

### 호스트 책임과 완료 기준 {#asset-integration-and-composition-completion}

호스트가 선택 초안과 커밋·취소를 소유합니다. 완료에는 사용할 수 있는 대화상자, 닫기·드래그 동등성, 로컬 선택·취소 흐름이 필요합니다. 하단에 놓은 div는 완료가 아닙니다.

### 파트와 상태 속성 {#stable-parts-and-states}

파트: root, backdrop, content, handle, header, title, body, actions, close. 상태: open,closed,dragging.

렌더링되는 모든 소유 파트는 `data-krds-component="bottom-sheet"`, 하나의 `data-krds-part` 토큰, 공백으로 구분된 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 우선합니다. 위 문장의 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 지원하는 변형 {#state-examples-and-native-checks}

`modal`, `short-content`, `select-cancel`

이 이름은 프로젝트가 정한 구분이며 공식 KRDS 유형 이름은 아닙니다.

### 예제 코드 {#local-native-stories}

위 미리보기는 각 프레임워크의 실제 패키지로 만든 예제입니다. Storybook은 로컬에서만 실행하며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-53) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_12_03.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
