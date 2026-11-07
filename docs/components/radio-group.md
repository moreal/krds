---
title: '라디오 버튼 · Radio button'
---

# 라디오 버튼 {#radio-button}

Radio button · `RadioGroup` · component

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_06_01.html) · [검토된 전체 명세](/sources/specs/components/radio-group.md.txt) · [프레임워크 지원](../compatibility/README.md)

## 네이티브 지원 현황 {#native-availability}

아래 상태는 `catalog/coverage.json`에서 그대로 가져옵니다. export, 예제, 테스트 실행기 종료 코드에서 추론하지 않습니다.

| 프레임워크 | 패키지 버전 | 기록된 상태 | export 선언 | 네이티브 예제와 스토리 |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/react/package.json.txt); [과거 선언 체크포인트](/sources/packages/react/dist/components/radio-group/index.d.ts.txt) | [react 소스와 미리보기 정책](../compatibility/README.mdexamples#react) |
| solid | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/solid/package.json.txt); [과거 선언 체크포인트](/sources/packages/solid/dist/components/radio-group/index.d.ts.txt) | [solid 소스와 미리보기 정책](../compatibility/README.mdexamples#solid) |
| svelte | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/svelte/package.json.txt); [과거 선언 체크포인트](/sources/packages/svelte/dist/components/RadioGroup.svelte.d.ts.txt) | [svelte 소스와 미리보기 정책](../compatibility/README.mdexamples#svelte) |
| vue | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/vue/package.json.txt); [과거 선언 체크포인트](/sources/packages/vue/dist/components/radio-group/RadioGroup.vue.d.ts.txt) | [vue 소스와 미리보기 정책](../compatibility/README.mdexamples#vue) |
| lit | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/lit/package.json.txt); [과거 선언 체크포인트](/sources/packages/lit/dist/components/radio-group/index.d.ts.txt) | [lit 소스와 미리보기 정책](../compatibility/README.mdexamples#lit) |
| qwik | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/qwik/package.json.txt); [과거 선언 체크포인트](/sources/packages/qwik/dist/components/radio-group/index.d.ts.txt) | [qwik 소스와 미리보기 정책](../compatibility/README.mdexamples#qwik) |
| angular | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/angular/package.json.txt); [과거 선언 체크포인트](/sources/packages/angular/dist/types/unofficial-krds-angular-radio-group.d.ts.txt) | [angular 소스와 미리보기 정책](../compatibility/README.mdexamples#angular) |
| solid-next (미리보기) | `0.1.0-preview.0` | planned | [현재 루트 매니페스트](/sources/packages/solid-next/package.json.txt); [과거 선언 체크포인트](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next 소스와 미리보기 정책](../compatibility/README.mdexamples#solid-next) |

## 속성·이벤트·콘텐츠·기본값 {#props-events-content-and-defaults}

아래 의미 계약은 공유 데이터일 뿐입니다. 네이티브 콘텐츠, ref, 이벤트 전달은 각 어댑터가 맡습니다. 계약의 콜백 이름과 detail 타입은 그대로 씁니다. 머신 객체를 전달하지 않습니다. 선택 속성에는 기본값이 자동으로 채워지지 않습니다. 아래 안내의 명시적 기본값을 씁니다.

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

| 의미 속성 / 콜백 | 필수 | 정확한 타입 | 역할 |
| --- | --- | --- | --- |
| `value` | 아니요 | `string \| null` | 데이터 / 상태 |
| `defaultValue` | 아니요 | `string \| null` | 데이터 / 상태 |
| `onValueChange` | 아니요 | `(detail: ValueChangeDetails<string \| null>) => void` | 의미 이벤트 요청 |
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

선택 값과 명시적 기본값은 다릅니다. 기본값과 네이티브 콘텐츠 요구사항은 아래 검토된 안내에 있습니다.

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 네이티브 JSX/콘텐츠 prop을 씁니다. Svelte는 네이티브 snippet을 씁니다. Vue는 네이티브 슬롯을 씁니다. Angular는 네이티브 input, output, 콘텐츠 투영을 씁니다. Lit은 custom element 속성, 슬롯, DOM 이벤트를 씁니다. Qwik은 네이티브 QRL 이벤트 경계를 씁니다. 이 전달 방식은 서로 바꿔 쓸 수 없습니다. 정확한 이름과 필수 콘텐츠는 링크된 공개 패키지 선언에서 확인합니다. 아래 의미 콜백이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

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

지원하는 케이스 축: `default`, `chip`, `medium`, `large`. 이 케이스 이름은 프로젝트의 독립 축입니다. 공식 KRDS 유형 이름이나 완료된 커버리지를 뜻하지 않습니다.

[필수 네이티브 스토리 매니페스트](/sources/catalog/full-catalog-stories.json.txt) · [파일럿 스토리 매니페스트](/sources/catalog/story-cases.json.txt) · [커버리지 근거와 네이티브 리뷰 링크](/sources/catalog/coverage.json.txt)

필수 전체 카탈로그 스토리: `krds-radio-group--default`, `krds-radio-group--chip`, `krds-radio-group--medium-large`, `krds-radio-group--unselected-required`, `krds-radio-group--disabled-option`, `krds-radio-group--form-reset`, `krds-radio-group--controlled`, `krds-radio-group--all-radio-sequential-access`, `krds-radio-group--controlled-null`, `krds-radio-group--controlled-clear-rejected`, `krds-radio-group--empty-string-option`.

### 로컬 네이티브 스토리 {#local-native-stories}

픽스처와 Storybook 출력은 로컬 전용입니다. 이 공개 문서 사이트에 올리지 않습니다. 로컬 문서 서버도 그쪽으로 리디렉션하지 않습니다. 각 네이티브 Storybook은 자기 워크스페이스 스크립트로 실행합니다. 컴포넌트 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/` 아래에 조립된 네이티브 미리보기입니다. Solid 2에는 지원되는 네이티브 Storybook 통합이 없습니다. Qwik 프로덕션 SSR/resume에는 실제 서버가 필요합니다. 정적 미리보기로 대신할 수 없습니다. 스토리가 있다고 동작 인수가 성립하지는 않습니다.

네이티브 컴파일러 체크포인트입니다. 소스 해시는 문서를 빌드할 때마다 검증합니다. 이 기록은 최신 네이티브 후보나 동작 인수를 인증하지 않습니다. 검사된 소스 페이지마다 체크포인트 범위가 적혀 있습니다.

- react: [검사된 소비 코드 보기](/examples/react-1); [소스 그대로 내려받기](/sources/packages/react/examples/catalog.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [검사된 소비 코드 보기](/examples/solid-3); [소스 그대로 내려받기](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [검사된 소비 코드 보기](/examples/svelte-30); [소스 그대로 내려받기](/sources/apps/fixture-svelte/src/public-examples/RadioGroupExample.svelte.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [검사된 소비 코드 보기](/examples/vue-58); [소스 그대로 내려받기](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [검사된 소비 코드 보기](/examples/lit-60); [소스 그대로 내려받기](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [검사된 소비 코드 보기](/examples/qwik-61); [소스 그대로 내려받기](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [검사된 소비 코드 보기](/examples/angular-62); [소스 그대로 내려받기](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## 출처와 권리 {#source-identity-and-rights}

기준선: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. 공식 상세 스냅숏 수집 시각: `2026-10-29T23:28:04.390Z`. SHA-256: `28578bf2746fa0f35bb0d4faac7f9c6d2515a9dc3dacc07cb3ffeacdca6c5e44`. [고정된 컴포넌트 출처 기록](/sources/catalog/components.json.txt) · [공식 출처](https://www.krds.go.kr/html/site/component/component_06_01.html). 원본 HTML은 체크아웃의 참고 근거로만 남습니다. 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/index.md)를 읽어야 합니다.
