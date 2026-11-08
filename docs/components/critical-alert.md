---
title: 'Critical alerts'
---

# Critical alerts {#critical-alerts}

긴급 공지 · `CriticalAlert`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_04_02.html) · [전체 명세](/sources/specs/components/critical-alert.md.txt) · [프레임워크 지원](../compatibility/README.md)

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
export interface CriticalAlertContract {
    urgency: 'high' | 'medium' | 'low';
    label: string;
    message: string;
    details?: LinkData & {
        destinationTitle: string;
    };
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
| `urgency` | 예 | `'high' \| 'medium' \| 'low'` | 데이터 / 상태 |
| `label` | 예 | `string` | 데이터 / 상태 |
| `message` | 예 | `string` | 데이터 / 상태 |
| `details` | 아니요 | `LinkData & {destinationTitle: string}` | 데이터 / 상태 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

본문 첫 콘텐츠로 MainMenu와 히어로 사이에 전체 너비 섹션을 둡니다. 장식용 긴급도 아이콘, 보이는 긴급도 레이블, 간결한 공지, 직접 관련된 상세 링크(최대 하나)로 구성합니다. 닫기/접기 컨트롤은 없습니다. 공식 텍스트는 role=banner를 명시적으로 요청합니다.

### 의미 API {#plain-semantic-api}

독립 API: urgency=high|medium|low, label, message, details? {href,label,destinationTitle}. open/defaultOpen이나 닫기 이벤트는 없습니다. 기간 제한 게시는 호스트가 제어합니다. danger/ok/info 스타일 선택자는 예시일 뿐이며, "safe"가 숫자 긴급도 수준과 같다는 증거가 아닙니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어/기본값을 함께 주거나 모드를 바꾸는 것은 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청 하나를 냅니다. 비활성, 무동작, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 커밋된 UI와 초점 상태를 유지합니다. 취소된 리셋은 아무 일도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하며, 제어 prop이 계속 우선합니다. 추가 필드로 렌더러/머신 객체를 노출하지 않습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

상세 앵커만 Tab 순서에 들어갑니다. 긴급도에서 자동 초점이나 단정적(assertive) 라이브 역할을 추론하지 않습니다. 장식 아이콘에는 중복 alt가 없습니다. 배너 랜드마크의 이름 지정과 페이지 Header와의 구분은 검토가 필요합니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

텍스트는 보통 한 줄, 좁은 화면에서는 최대 두 줄입니다. 줄 수를 맞추려고 필수 정보를 잘라내지 않습니다. 호스트 문구와 상세 링크는 간결하게 씁니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

폼/리셋/IME 동작이 없습니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 사실에 맞는 긴급 정보와 게시 기간을 소유합니다. 완료 시험은 닫을 수 없음과 상세 링크 목적지를 확인하며, 컴포넌트 안에 폴링이나 네트워크 긴급도 피드는 없습니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, icon, label, message, link; urgency=high|medium|low.

렌더되는 모든 소유 파트는 `data-krds-component="critical-alert"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위 열거는 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정됩니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `high-urgency`, `medium-urgency`, `low-urgency`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-15) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_04_02.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/index.md)를 읽어야 합니다.
