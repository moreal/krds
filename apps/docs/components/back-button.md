---
title: 'Back button'
---

# Back button {#back-button}

뒤로가기 버튼 · `BackButton`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_12_02.html) · [전체 명세](/sources/specs/components/back-button.md.txt) · [프레임워크 지원](../compatibility/)

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
export interface BackButtonContract {
    label?: string;
    canGoBack: boolean;
    fallbackHref?: string;
    dirty?: boolean;
    onBackRequest: (detail: {
        reason: 'activate' | 'confirmed';
    }) => void;
    requestConfirmation?: () => boolean | Promise<boolean>;
}
```

| 속성 / 콜백 | 필수 | 타입 | 역할 |
| --- | --- | --- | --- |
| `label` | 아니요 | `string` | 데이터 / 상태 |
| `canGoBack` | 예 | `boolean` | 데이터 / 상태 |
| `fallbackHref` | 아니요 | `string` | 데이터 / 상태 |
| `dirty` | 아니요 | `boolean` | 데이터 / 상태 |
| `onBackRequest` | 예 | `(detail: {reason: 'activate' \| 'confirmed'}) => void` | 이벤트 |
| `requestConfirmation` | 아니요 | `() => boolean \| Promise<boolean>` | 데이터 / 상태 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

상단 바 왼쪽에 현재 화면 제목 옆 뒤로가기 컨트롤을 둡니다. 이전 화면(또는 정의된 상위)으로 돌아가며 취소·닫기와 시각적으로 구별됩니다. 입력 중인 내용을 잃기 전에 경고합니다. 호스트가 제어할 수 있으면 시스템·브라우저 뒤로가기와 앱 내 동작을 일치시켜야 합니다.

### 의미 API {#plain-semantic-api}

독립 API: label="뒤로가기", onBackRequest({reason}), canGoBack, fallbackHref?, dirty=false, 호스트가 제공하는 requestConfirmation. 이력 동작에는 type=button을 씁니다. 상위 목적지가 명시되면 실제 Link 변형을 씁니다. 알려진 앱 내 항목이 없을 때 history.back을 무작정 호출하지 않습니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 정의된 value/open은 제어 모드이고 undefined는 비제어 모드입니다. 제어 prop과 기본값을 함께 주거나 모드를 바꾸면 잘못된 구성입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 시맨틱 변경 요청을 한 번 내보냅니다. 비활성, 변화 없음, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 모드에서 거부되면 커밋된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 우선합니다. 추가 필드로 렌더러·머신 객체를 노출하지 않습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

독립 네이티브 정책: 버튼의 Enter/Space/클릭은 한 번만 동작합니다. 변경 확인은 검토된 Modal을 열고, 취소하면 페이지·값·초점을 유지하며, 확인하면 호스트 내비게이션을 한 번 호출합니다. 목적지 초점과 이력·제스처 가로채기는 라우터·호스트 소관입니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

좁은 화면에서도 왼쪽 위치와 제목이 읽기 쉽고, 충분한 대상 크기가 시스템 안전 영역과 겹치지 않습니다. 이는 웹에 적용되는 맥락이며 브라우저 UI의 대체가 아닙니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

자체 폼 값이나 리셋은 없습니다. 버튼은 폼을 제출하거나 지우지 않습니다. 호스트의 dirty 상태는 폼·IME를 정확히 관찰해야 합니다. 조합 중인 텍스트가 성급한 이동으로 사라지면 안 됩니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

컴포넌트에서 통합으로 올리기를 권장합니다. 호스트가 라우터·이력, 브라우저 뒤로가기 가드, 대체 이동, 데이터 손실 정책을 소유합니다. 완료에는 로컬 내비게이션 스택과 저장 안 된 폼 목업(취소된 확인 포함)이 필요합니다. 스토리에서 실제 페이지 이탈은 필요 없습니다.

### 고정 파트와 상태 {#stable-parts-and-states}

파트: root, icon, label. 상태: disabled,pending-confirmation. 인접한 페이지 제목은 호스트 페이지 조합에 속하며 BackButton의 소유 파트가 아닙니다.

렌더링되는 모든 소유 파트는 `data-krds-component="back-button"`, 하나의 `data-krds-part` 토큰, 공백으로 구분된 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 우선합니다. 위 문장의 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `default`, `dirty-confirmation`, `no-history-fallback`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-52) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_12_02.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
