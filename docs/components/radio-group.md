---
title: 'Radio button'
---

# Radio button {#radio-button}

라디오 버튼 · `RadioGroup`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_06_01.html) · [전체 명세](/sources/specs/components/radio-group.md.txt) · [프레임워크 지원](../compatibility/README.md)

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
export interface RadioGroupContract extends ControlledValue<string | null>, FieldContract {
    options: readonly RadioGroupOption[];
    size?: 'medium' | 'large';
    appearance?: 'default' | 'chip';
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

export interface RadioGroupOption extends SelectOption {
    id?: string;
}

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}
```

| 속성 / 콜백 | 필수 | 타입 | 역할 |
| --- | --- | --- | --- |
| `value` | 아니요 | `string \| null` | 데이터 / 상태 |
| `defaultValue` | 아니요 | `string \| null` | 데이터 / 상태 |
| `onValueChange` | 아니요 | `(detail: ValueChangeDetails<string \| null>) => void` | 이벤트 |
| `id` | 아니요 | `string` | 데이터 / 상태 |
| `name` | 아니요 | `string` | 데이터 / 상태 |
| `label` | 예 | `string` | 데이터 / 상태 |
| `disabled` | 아니요 | `boolean` | 데이터 / 상태 |
| `required` | 아니요 | `boolean` | 데이터 / 상태 |
| `invalid` | 아니요 | `boolean` | 데이터 / 상태 |
| `helpId` | 아니요 | `string` | 데이터 / 상태 |
| `errorId` | 아니요 | `string` | 데이터 / 상태 |
| `options` | 예 | `readonly RadioGroupOption[]` | 데이터 / 상태 |
| `size` | 아니요 | `'medium' \| 'large'` | 데이터 / 상태 |
| `appearance` | 아니요 | `'default' \| 'chip'` | 데이터 / 상태 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

이름 있는 fieldset/legend 그룹 안에 같은 `name`의 네이티브 `input[type=radio]`와 오른쪽 레이블을 연결합니다. 기본은 세로이며, 가로 배치는 충분한 간격이 필요합니다. 정확한 선택이 중요한 경우 미리 선택하지 않습니다. 선택적 “없음/모름”은 호스트가 명시하는 옵션입니다.

### 의미 API {#plain-semantic-api}

독립 API: `options: readonly RadioGroupOption[]`(`RadioGroupOption`은 기존 `SelectOption`을 확장하며 선택적 `id?:string`을 가짐), `name`, `value?: string | null`, `defaultValue?: string | null`(비제어 기준선은 `null`), `onValueChange({value:string | null})`, `required=false`, `disabled=false`, `invalid`/`errorId`/`helpId`, `size=medium`, `appearance=default|chip`. `null`을 포함해 정의된 `value`는 제어 모드를 택하며, `undefined`만 비제어를 뜻합니다. `null`은 체크된 라디오가 없음을 뜻합니다. 빈 문자열 `""`을 포함한 모든 문자열은 유효한 일반 옵션 값이며, 고유한 옵션 하나와 정확히 일치해야 합니다. 빈 문자열도, 없는 옵션도 빈 값 표지(sentinel)가 아닙니다. 알 수 없는 non-null 값과 중복 옵션 값은 설정 오류입니다. “없음/모름” 옵션을 자동으로 넣지 않으며, 그것은 호스트가 명시하는 콘텐츠입니다.

[파일럿 제어/리셋 규약](/sources/specs/components/README.md.txt)을 적용합니다. 제어/기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 선택이 바뀔 때마다 사용자 요청 하나를 내보내며, 거부되어도 마찬가지입니다. 마운트, 하이드레이션, prop, 리셋 변경은 콜백을 내보내지 않습니다. 이미 선택된 옵션을 클릭하면 no-op입니다. prop이 `null`로 바뀌면 이벤트 없이 체크된 비트를 모두 지웁니다. 제어 모드에서 거부되면 모든 실제 네이티브 라디오의 체크 비트를 커밋된 prop에 맞춰 조정하며, `null`이면 모두 해제로 복원합니다. 수용되지 않은 브라우저 토글이 렌더링, 유효성, FormData로 새어 나가면 안 됩니다.

**명시적 옵션 식별(추가 조합 API):** 옵션은 실제 네이티브 라디오 입력에 쓸 비어 있지 않은 고유 `id`를 줄 수 있습니다. 그 ID를 그대로 적용하고 실제 레이블을 같은 컨트롤에 연결하며, 중복 프록시 입력을 만들거나 ID를 선택 값으로 쓰지 않습니다. 생략하면 기존의 안정적인 생성 ID 동작이 그대로입니다. 중복되거나 빈 명시 ID는 설정 오류입니다. 이 라디오 전용 하위 타입은 NativeSelect와 무관한 `SelectOption` 계약에 ID를 더하거나 의미를 바꾸지 않습니다. 선택, 그룹화, `null`/빈 문자열 값, 리셋, 콜백은 그대로입니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

공식 요구 **활성화된 모든 라디오를 Tab과 Shift+Tab으로 순차 접근할 수 있어야 한다**를 보존합니다. 이는 실제 같은 `name` 네이티브 라디오 그룹화, 그리고 별도로 요구되는 화살표 이동/선택과 함께 적용됩니다([공식 L1211–1218](https://www.krds.go.kr/html/site/component/component_06_01.html)). 비활성 라디오는 건너뜁니다. Tab 순회는 초점만 바꿉니다. Space, 연결된 레이블/컨트롤 클릭, 해당 화살표 키가 옵션 하나를 선택하며, 중복 합성 활성화 없이 변경 값 요청 하나를 내보냅니다. 초점 링은 보이는 라디오 영역에 둡니다.

고정된 같은 `name` 네이티브 예시는 브라우저의 통상적인 단일 그룹 Tab 동작을 가지며, 이는 모든 라디오 순차 접근이라는 명시적 행과 충돌합니다. 이 긴장이 그 행을 부정하거나 네이티브 기본 그룹화를 적합하다고 선언할 근거가 되지는 않습니다. 제안 계약은 활성화된 모든 라디오의 순차 접근을 보존합니다. 수용된 독립 구현 정책은 초점이 그룹 안에 있을 때 Tab/Shift+Tab을 가로채 체크 상태를 바꾸지 않고 다음/이전의 활성화된 실제 같은 `name` 네이티브 라디오로 초점을 옮기며, 그룹 경계에서는 브라우저가 빠져나가도록 허용하는 것입니다. 모든 실제 라디오는 일반 네이티브 그룹 속성을 유지하며 이름을 바꾸거나 복제하거나 대체하지 않습니다. 이로써 네이티브 화살표/폼 동작을 유지하면서 명시된 순차 접근 행을 보존합니다. 각 렌더러는 역방향 진입/이탈과 거부된 제어 선택을 검증해야 하며, 네이티브 기본 Tab만으로는 충분하지 않습니다. 각 렌더러/브라우저는 실제 라디오 폼/그룹 의미와 화살표 선택을 보존하고 Tab으로 인한 추가 선택이 없는 상태에서, 활성화된 모든 라디오에 대한 정방향·역방향 순차 접근을 입증해야 합니다. 백엔드/네이티브 기본값만으로는 이 결과의 근거가 되지 않습니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

세로 배치와 오른쪽 레이블을 선호합니다. 옵션이 많으면(익숙한 기준 7개 초과) 셀렉트(Select)가 나을 수 있습니다. 네이티브 앱/모바일 권고는 맥락에 따르며 배제가 아닙니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

`null`이면 모든 실제 라디오가 해제되고, 필수 그룹은 유효하지 않으며, FormData에 name/값이 담기지 않습니다. 체크된 활성 옵션은 정확한 문자열(빈 문자열 값 포함)을 전달하고, 비활성 컨트롤/fieldset은 제외됩니다. 취소되지 않은 리셋은 비제어 초기 `defaultValue`/`null`을 복원하고, 제어 상태는 현재 prop을 유지합니다. 모든 네이티브 체크 비트와 필수 유효성을 콜백 없이 조정합니다. 취소된 리셋은 선택도 네이티브 조정 기준선도 바꾸지 않습니다. prop에 의한 해제는 리셋도 사용자 동작도 아닙니다. 레이블과 오류/도움말 연결은 네이티브로 남아 테스트 가능해야 합니다. 편집 가능한 IME 경로는 없습니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

정렬(정당한 우선순위가 없으면 가나다순 기본), 옵션 데이터, 필수 검증 문구는 호스트가 맡습니다. 버튼 role 대체물이 아니라 실제 네이티브 라디오의 폼 참여가 완료 조건입니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, legend, item, control, indicator, label, help, error; checked,unchecked,disabled,invalid.

렌더링되는 모든 소유 파트는 `data-krds-component="radio-group"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 사용합니다. 네이티브/ARIA 상태가 기준입니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `default`, `chip`, `medium`, `large`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-30) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_06_01.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/index.md)를 읽어야 합니다.
