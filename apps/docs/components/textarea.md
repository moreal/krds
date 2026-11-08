---
title: 'Textarea'
---

# Textarea {#textarea}

텍스트 영역 (Textarea) · `Textarea`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_09_02.html) · [전체 명세](/sources/specs/components/textarea.md.txt) · [프레임워크 지원](../compatibility/)

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
export interface TextareaContract extends ControlledValue<string>, FieldContract {
    rows?: number;
    readOnly?: boolean;
    maxLength?: number;
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
| `rows` | 아니요 | `number` | 데이터 / 상태 |
| `readOnly` | 아니요 | `boolean` | 데이터 / 상태 |
| `maxLength` | 아니요 | `number` | 데이터 / 상태 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

실제 &lt;textarea>에 지속적으로 연결된 레이블을 두고, 선택적 플레이스홀더/도움말/오류를 둡니다. 글자 수 제한이 있으면 최대 글자 수와 남은 글자 수를 안내합니다. 글자 수는 레이블이나 필드 뒤에 옵니다. 플레이스홀더는 레이블/도움말을 대체하지 않으며 복사/붙여넣기를 제한하지 않습니다.

### 의미 API {#plain-semantic-api}

독립 API: value/defaultValue="", onValueChange({value}), name, rows=5 (제안), required/disabled/readOnly=false, maxLength?, helpId/errorId, invalid=false. 글자 수는 maxlength와 일치하도록 HTML UTF-16 코드 유닛으로 셉니다. 사용자에게 보이는 글자 수가 다르면 레이블/글자 수 문구에 이 프로젝트 정책을 드러냅니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어 값과 기본값을 함께 주거나 mode를 바꾸는 것은 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청을 한 번 내보냅니다. disabled, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI/초점 상태를 유지하고, 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하며 제어 prop이 계속 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

편집, 선택, 붙여넣기, Enter 줄 바꿈은 네이티브입니다. Tab은 초점을 일반적으로 옮기며 Enter 제출이나 단축키는 없습니다. IME 중에는 선택/조합 문자열을 보존합니다. 조합 중인 텍스트를 다시 쓰거나 자르지 않고 입력 갱신을 내보냅니다. 글자 수 표시는 키 입력마다 단호하게(assertive) 알리지 않아야 합니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

예상 텍스트에 맞는 크기로 만듭니다. 더 긴 입력은 textarea 안에서 세로로 스크롤하며 화살표 키는 네이티브 편집을 유지합니다. 쓸 수 있는 크기 조절을 허용하고 좁은 화면/확대에서 리플로우합니다. 오류/글자 수가 잘리면 안 됩니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

이름이 있고 활성인 textarea는 네이티브 FormData에 참여합니다(readonly 포함, disabled 제외). 리셋은 기본 문자열과 글자 수를 복원합니다. 제어 리셋은 콜백 없이 현재 prop을 유지합니다. required/maxLength는 네이티브 유효성과 명시적 오류 연결을 함께 씁니다. 브라우저 FormData의 CRLF 의미를 보존합니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

검증 시점과 오류 문구는 컴포넌트가 아니라 호스트가 소유합니다. 완료에는 긴 입력, 붙여넣기, 한글 IME, 레이블/오류, FormData/리셋이 포함됩니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, label, control, help, error, count; disabled,readonly,invalid,focused.

렌더링되는 모든 소유 파트는 `data-krds-component="textarea"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위의 파트/상태 어휘는 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `default`, `limited`, `invalid`, `disabled`, `readonly`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-44) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_09_02.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
