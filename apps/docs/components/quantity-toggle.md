---
title: 'Quantity toggle'
---

# Quantity toggle {#quantity-toggle}

수량 토글 · `QuantityToggle` — 버튼으로 수량을 하나씩 늘리거나 줄이게 합니다.

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_12_04.html) · [전체 명세](/sources/specs/components/quantity-toggle.md.txt) · [프레임워크 지원](../compatibility/)

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
| `value` | `number` | 선택 | 속성 |
| `defaultValue` | `number` | 선택 | 속성 |
| `onValueChange` | `(detail: ValueChangeDetails<number>) => void` | 선택 | 이벤트 |
| `id` | `string` | 선택 | 속성 |
| `name` | `string` | 선택 | 속성 |
| `label` | `string` | 필수 | 속성 |
| `disabled` | `boolean` | 선택 | 속성 |
| `required` | `boolean` | 선택 | 속성 |
| `invalid` | `boolean` | 선택 | 속성 |
| `helpId` | `string` | 선택 | 속성 |
| `errorId` | `string` | 선택 | 속성 |
| `min` | `number` | 선택 | 속성 |
| `max` | `number` | 선택 | 속성 |
| `step` | `number` | 선택 | 속성 |
| `unit` | `string` | 선택 | 속성 |

표에 나온 타입의 정의입니다.

```ts
export interface QuantityToggleContract extends ControlledValue<number>, FieldContract {
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
}

export interface ControlledValue<T> {
    value?: T;
    defaultValue?: T;
    onValueChange?: (detail: ValueChangeDetails<T>) => void;
}

export interface ValueChangeDetails<T> {
    value: T;
}

export interface FieldContract {
    id?: string;
    name?: string;
    label: string;
    disabled?: boolean;
    required?: boolean;
    invalid?: boolean;
    helpId?: string;
    errorId?: string;
}
```

### 프레임워크별 콘텐츠와 이벤트 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 마크업 구조와 순서 {#native-structure-and-mandatory-ordering}

레이블이 있는 그룹입니다. 감소 버튼, 가운데에 보이는 현재 수량, 필드로 분리된 증가 버튼으로 구성합니다. 사용자는 키보드 텍스트 입력이 아니라 버튼으로 조정합니다. 기준값을 포함해 선택 가능한 값을 11단계 이하로 제한하고, 한계에 닿으면 해당 버튼을 비활성화합니다.

### API와 기본값 {#plain-semantic-api}

독립 API: `min=0`, `max=10`, `step=1`, `value`/`defaultValue=min`, `onValueChange({value})`, `name?`, `disabled=false`, `label`, `unit?`. 선택 가능한 값이 11개를 넘거나 step이 일관되지 않은 설정은 거부합니다. 가운데 출력은 편집할 수 없는 텍스트이며 편집 가능한 spinbutton이 아닙니다. 이름 붙은 숨김 값이 직렬화될 수 있습니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 값/열림 상태를 정의하면 제어 모드, 없으면 비제어 모드입니다. 제어/기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청 하나를 내보냅니다. 비활성, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내보내지 않습니다. 제어 모드에서 거부되면 커밋된 UI/초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 그대로 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

### 키보드와 초점 {#keyboard-focus-and-state-transitions}

독립 정책: 네이티브 버튼의 클릭/Enter/Space는 한 번만 변경합니다. 고정 이름은 “decrease/increase [quantity label]”입니다. 출력 관계가 현재 값을 식별합니다. 새로 비활성이 된 경계에서도 초점 유지가 인지 가능해야 합니다(수용된 독립 정책: 활성화를 막은 `aria-disabled` 버튼을 쓰면서 초점 유지).

### 반응형 동작 {#responsive-mobile-requirements}

버튼 클릭 영역은 가운데 값 주변에서 충분히 크고 간격을 둡니다. 좁은 화면과 확대에서도 레이블과 값이 보입니다. 기본값으로 길게 눌러 자동 반복하거나 드래그 제스처를 쓰지 않습니다.

### 폼 제출과 초기화 {#forms-reset-and-composition}

이름 붙은 선택적 숨김 입력이 실제 숫자 문자열을 전달하며, 비활성이면 생략됩니다. 리셋은 초기값을 복원하고, 제어 리셋은 콜백 없이 현재 prop을 유지합니다. 버튼은 `type=button`입니다. 자유 텍스트/IME 경로는 없습니다.

### 호스트 책임과 완료 기준 {#asset-integration-and-composition-completion}

흔히 선택되는 기본값, 경계, 실제 수량 효과는 호스트가 맡습니다. 정적인 더하기/빼기 아이콘이 아니라 실제 경계 피드백과 폼 리셋이 완료 조건입니다.

### 파트와 상태 속성 {#stable-parts-and-states}

root, label, decrement, output, increment, hidden-input; at-minimum,at-maximum,disabled.

렌더링되는 모든 소유 파트는 `data-krds-component="quantity-toggle"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 사용합니다. 네이티브/ARIA 상태가 기준입니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 지원하는 변형 {#state-examples-and-native-checks}

`default`, `minimum`, `maximum`, `disabled`

이 이름은 프로젝트가 정한 구분이며 공식 KRDS 유형 이름은 아닙니다.

### 예제 코드 {#local-native-stories}

위 미리보기는 각 프레임워크의 실제 패키지로 만든 예제입니다. Storybook은 로컬에서만 실행하며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-54) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_12_04.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
