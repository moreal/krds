---
title: 'Range slider'
---

# Range slider {#range-slider}

범위슬라이드 · `RangeSlider`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_12_01.html) · [전체 명세](/sources/specs/components/range-slider.md.txt) · [프레임워크 지원](../compatibility/README.md)

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
export interface RangeSliderContract extends ControlledValue<number>, FieldContract {
    min?: number;
    max?: number;
    step?: number;
    valueText?: (value: number) => string;
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

| 속성 / 콜백 | 필수 | 타입 | 역할 |
| --- | --- | --- | --- |
| `value` | 아니요 | `number` | 데이터 / 상태 |
| `defaultValue` | 아니요 | `number` | 데이터 / 상태 |
| `onValueChange` | 아니요 | `(detail: ValueChangeDetails<number>) => void` | 이벤트 |
| `id` | 아니요 | `string` | 데이터 / 상태 |
| `name` | 아니요 | `string` | 데이터 / 상태 |
| `label` | 예 | `string` | 데이터 / 상태 |
| `disabled` | 아니요 | `boolean` | 데이터 / 상태 |
| `required` | 아니요 | `boolean` | 데이터 / 상태 |
| `invalid` | 아니요 | `boolean` | 데이터 / 상태 |
| `helpId` | 아니요 | `string` | 데이터 / 상태 |
| `errorId` | 아니요 | `string` | 데이터 / 상태 |
| `min` | 아니요 | `number` | 데이터 / 상태 |
| `max` | 아니요 | `number` | 데이터 / 상태 |
| `step` | 아니요 | `number` | 데이터 / 상태 |
| `valueText` | 아니요 | `(value: number) => string` | 데이터 / 상태 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

상시 레이블, 슬라이더 트랙/핸들, 핸들 위나 트랙 끝에 현재 값(손가락 아래가 아님), 보이는 최솟값/최댓값으로 구성합니다. 공식 상세는 범위 안의 선택 값 하나를 보여 주며, 두 핸들 구간 선택의 증거는 아닙니다. 권장 step은 범위의 약 10–20%입니다.

### 의미 API {#plain-semantic-api}

독립 API: `min=0`, `max=100`, `step=10`, `value`/`defaultValue=0`, `onValueChange({value:number})`, `name`, `label`, `disabled=false`, `valueText?` 포매터. **이 계약에는 `onValueCommit` API가 없습니다.** 네이티브 `input[type=range]`를 선호하며, output은 커밋된 값을 단위와 함께 반영합니다. 잘못된 경계/step은 거부하고 소수 연산은 오차 없이 정규화합니다. 정의된 값, 한 번만 읽는 기본값, 모드 전환 금지, 마운트/prop/리셋 콜백 없음 규칙은 [파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 제어 모드의 네이티브 입력 변경은 요청이며, 거부되면 표시/output/제출 값은 커밋된 prop으로 남습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

핸들 드래그와 트랙 클릭을 공식 지원합니다. 독립 네이티브 키보드 정책: 화살표는 한 step씩 바꾸고, Home/End는 한계에 닿으며, Tab/초점과 숫자 네이티브 값 의미는 일반 그대로입니다. 두 핸들 role은 만들어 내지 않습니다. 정규화한 요청 숫자가 커밋된 값과 다른 네이티브 사용자 input 이벤트마다 `onValueChange`를 한 번 내보냅니다. 비제어 입력은 콜백 전에 그 숫자를 커밋하고, 제어 입력은 요청을 한 번 내보낸 뒤 거부되면 네이티브 값/output을 prop으로 되돌립니다.

드래그는 변경된 input 이벤트마다 하나씩, 서로 다른 입력 요청을 여러 개 낼 수 있습니다. 변경된 입력 하나를 만드는 트랙 클릭은 요청 하나를, 변경된 키보드 조정은 각각 요청 하나를 냅니다. 같은 값/경계 입력은 아무것도 내지 않습니다. 네이티브 change, pointerup, blur, 제스처 완료는 **두 번째 콜백이나 commit 콜백을 추가하지 않습니다.** 포인터 취소는 마지막으로 커밋된 값을 보존하며 합성 롤백/commit 요청을 내지 않습니다. input/change 이중 알림이 없습니다. 터치 중 세로 페이지 스크롤과 실제 네이티브 폼 수명주기를 보존합니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

현재 값은 위쪽/끝에 있고 손가락에 가려지지 않으며, 최솟값/최댓값은 좁은 화면과 확대에서 읽을 수 있습니다. 핸들은 충분히 크고, 드래그 없이 쓸 수 있는 키보드/클릭 대안이 있습니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

이름 있는 활성 네이티브 range는 값을 전달하고, 비활성은 제외되며, 리셋은 기본값과 output을 복원합니다. 제어 리셋은 콜백 없이 현재 prop을 유지합니다. IME 편집은 없고, 내장된 편집 가능한 값 대안은 이 초안의 범위 밖입니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

단위와 설정 효과는 호스트가 맡습니다. 장식용 트랙이 아니라 경계가 있는 실제 네이티브 range, output, 폼 수명주기가 완료 조건입니다. 외부 엔진은 필요 없습니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, label, control, track, range, thumb, output, minimum, maximum; disabled,dragging.

렌더링되는 모든 소유 파트는 `data-krds-component="range-slider"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 사용합니다. 네이티브/ARIA 상태가 기준입니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `single-value`, `disabled`, `discrete`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-51) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_12_01.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/index.md)를 읽어야 합니다.
