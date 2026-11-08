---
title: 'Badge'
---

# Badge {#badge}

배지 · `Badge`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_04_06.html) · [전체 명세](/sources/specs/components/badge.md.txt) · [프레임워크 지원](../compatibility/README.md)

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
export interface BadgeContract {
    label: string;
    appearance?: 'outline' | 'filled' | 'pastel';
    tone?: 'secondary' | 'gray' | 'point' | 'danger' | 'warning' | 'success' | 'information' | 'disabled';
    size?: Size;
    numeric?: boolean;
}

export type Size = 'small' | 'medium' | 'large';
```

| 속성 / 콜백 | 필수 | 타입 | 역할 |
| --- | --- | --- | --- |
| `label` | 예 | `string` | 데이터 / 상태 |
| `appearance` | 아니요 | `'outline' \| 'filled' \| 'pastel'` | 데이터 / 상태 |
| `tone` | 아니요 | `'secondary' \| 'gray' \| 'point' \| 'danger' \| 'warning' \| 'success' \| 'information' \| 'disabled'` | 데이터 / 상태 |
| `size` | 아니요 | `Size` | 데이터 / 상태 |
| `numeric` | 아니요 | `boolean` | 데이터 / 상태 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

outline/filled/pastel 컨테이너 안의 비상호작용 레이블입니다. 텍스트는 항상 보이며 button/link 역할, href, 0 이상의 tabindex를 갖지 않습니다. 숫자 내용도 카운터 동작이 아니라 텍스트 정보입니다.

### 의미 API {#plain-semantic-api}

독립 API: label, appearance=outline|filled|pastel (기본 outline), tone=secondary|gray|point|danger|warning|success|information|disabled, size=small|medium|large (기본 medium), numeric=false. 공식 선택자 표에는 primary도 있으나 원문 지침이 primary 배경을 금지하므로, 지원 API는 primary 톤과 primary 배경을 제외합니다. 선택자와 본문의 충돌은 독립 프로젝트 정책으로 해소합니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 정의된 value/open은 제어 모드이고 undefined는 비제어 모드입니다. 제어 prop과 기본값을 함께 주거나 모드를 바꾸면 잘못된 구성입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 시맨틱 변경 요청을 한 번 내보냅니다. 비활성, 변화 없음, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 모드에서 거부되면 커밋된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 우선합니다. 추가 필드로 렌더러·머신 객체를 노출하지 않습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

기본적으로 키보드 동작, 선택 이벤트, 초점, 라이브 안내가 없습니다. disabled 톤은 정보용 스타일이며 컨트롤이 실제로 비활성이라는 의미를 암시하면 안 됩니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

레이블은 줄바꿈 없이 짧게 유지하고 연결된 요소마다 배지는 하나입니다. 호스트가 상태를 말없이 자르지 않고 문구를 줄입니다. 텍스트·배경 대비는 4.5:1 이상입니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

폼·리셋·IME 동작은 없습니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 간결하고 사실인 상태를 제공합니다. 완료는 실제 레이블이 있는 모든 톤·크기에서 시각·시맨틱을 만족하는 것이며 빈 장식 캡슐이 아닙니다.

### 고정 파트와 상태 {#stable-parts-and-states}

파트: root, label. 상태: appearance,tone,size,numeric. pressed/selected는 없습니다.

렌더링되는 모든 소유 파트는 `data-krds-component="badge"`, 하나의 `data-krds-part` 토큰, 공백으로 구분된 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 우선합니다. 위 문장의 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `outline`, `filled`, `pastel`, `numeric`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-19) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_04_06.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/index.md)를 읽어야 합니다.
