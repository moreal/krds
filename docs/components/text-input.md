---
title: 'Text input'
---

# Text input {#text-input}

텍스트 입력 필드 · `TextInput`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_09_03.html) · [전체 명세](/sources/specs/components/text-input.md.txt) · [프레임워크 지원](../compatibility/README.md)

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
export interface TextInputContract extends ControlledValue<string>, FieldContract {
    type?: 'text' | 'email' | 'tel' | 'url' | 'password' | 'search';
    autocomplete?: string;
    inputMode?: string;
    readOnly?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    status?: 'default' | 'error' | 'success';
    size?: Size;
    iconAction?: {
        label: string;
        onAction: () => void;
    };
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

export type Size = 'small' | 'medium' | 'large';
```

| 속성 / 콜백 | 필수 | 타입 | 역할 |
| --- | --- | --- | --- |
| `value` | 아니요 | `string` | 데이터 / 상태 |
| `defaultValue` | 아니요 | `string` | 데이터 / 상태 |
| `onValueChange` | 아니요 | `(detail: ValueChangeDetails<string>) => void` | 이벤트 |
| `id` | 아니요 | `string` | 데이터 / 상태 |
| `name` | 아니요 | `string` | 데이터 / 상태 |
| `label` | 예 | `string` | 데이터 / 상태 |
| `disabled` | 아니요 | `boolean` | 데이터 / 상태 |
| `required` | 아니요 | `boolean` | 데이터 / 상태 |
| `invalid` | 아니요 | `boolean` | 데이터 / 상태 |
| `helpId` | 아니요 | `string` | 데이터 / 상태 |
| `errorId` | 아니요 | `string` | 데이터 / 상태 |
| `type` | 아니요 | `'text' \| 'email' \| 'tel' \| 'url' \| 'password' \| 'search'` | 데이터 / 상태 |
| `autocomplete` | 아니요 | `string` | 데이터 / 상태 |
| `inputMode` | 아니요 | `string` | 데이터 / 상태 |
| `readOnly` | 아니요 | `boolean` | 데이터 / 상태 |
| `minLength` | 아니요 | `number` | 데이터 / 상태 |
| `maxLength` | 아니요 | `number` | 데이터 / 상태 |
| `pattern` | 아니요 | `string` | 데이터 / 상태 |
| `status` | 아니요 | `'default' \| 'error' \| 'success'` | 데이터 / 상태 |
| `size` | 아니요 | `Size` | 데이터 / 상태 |
| `iconAction` | 아니요 | `{label: string; onAction: () => void}` | 데이터 / 상태 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

네이티브 한 줄 입력에 지속되는 레이블, 선택적 도움말/오류와 플레이스홀더, 선택적이며 별도 이름을 가진 아이콘 버튼을 둡니다. 보이는 초점과 오류/성공 표시가 있어야 합니다. 반복되는 개인 정보에는 브라우저 자동 완성을 씁니다. 붙여넣기를 막지 않습니다.

### 의미 API {#plain-semantic-api}

독립 API: type=text|email|tel|url|password|search (기본 text), value/defaultValue="", onValueChange({value}), name, autocomplete,inputMode, required, disabled, readOnly, minLength/maxLength/pattern, status=default|error|success, helpId/errorId, size=medium, iconAction? {label,onAction}. 기본적으로 날짜 파싱이나 숫자 변환은 하지 않습니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어 값과 기본값을 함께 주거나 mode를 바꾸는 것은 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청을 한 번 내보냅니다. disabled, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI/초점 상태를 유지하고, 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하며 제어 prop이 계속 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

편집/선택은 네이티브 동작이며 레이블을 클릭하면 초점이 갑니다. 아이콘 버튼은 type=button이며 제출하지 않습니다. 한글 IME 조합 중에는 값을 다시 쓰지 않으며 조합 중 Enter를 확정으로 취급하지 않습니다. 조합이 끝난 뒤의 일반 Enter 폼 제출은 호스트/브라우저 동작으로 남습니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

유동 필드는 보통 섹션을 채웁니다. 예측 가능한 짧은 필드는 예상 입력 크기에 맞출 수 있으나 작은 화면에서 잘리면 안 됩니다. 모바일 키보드는 제공된 type/inputMode를 따르며, 임의의 식별자에 숫자 키보드를 강제하지 않습니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

네이티브 name/value FormData를 따릅니다. disabled는 제외하고 readonly는 포함하며, 리셋은 defaultValue로 되돌립니다. 제어 리셋은 콜백 없이 현재 prop을 유지합니다. 오류는 aria-invalid/설명과 required 유효성으로 나타냅니다. 비밀번호 표시 기능을 제공한다면 값과 캐럿을 보존하고 접근 가능한 토글 레이블을 바꿔야 합니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

검증 시점, 개인 정보 자동 완성 토큰, 선택적 표시/검색 동작, 원격 검사는 호스트가 소유합니다. 로컬 스토리는 인증/API를 호출할 수 없습니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, label, control, help, error, icon-action; invalid,success,disabled,readonly,focused.

렌더링되는 모든 소유 파트는 `data-krds-component="text-input"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위의 파트/상태 어휘는 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `default`, `error`, `success`, `small`, `medium`, `large`, `icon-action`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-45) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_09_03.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/index.md)를 읽어야 합니다.
