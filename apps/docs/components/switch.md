---
title: 'Toggle switch'
---

# Toggle switch {#toggle-switch}

토글 스위치 · `Switch`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_06_07.html) · [전체 명세](/sources/specs/components/switch.md.txt) · [프레임워크 지원](../compatibility/)

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
export interface SwitchContract extends FieldContract {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (detail: {
        checked: boolean;
    }) => void;
    value?: string;
    size?: 'medium' | 'large';
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
| `id` | 아니요 | `string` | 데이터 / 상태 |
| `name` | 아니요 | `string` | 데이터 / 상태 |
| `label` | 예 | `string` | 데이터 / 상태 |
| `disabled` | 아니요 | `boolean` | 데이터 / 상태 |
| `required` | 아니요 | `boolean` | 데이터 / 상태 |
| `invalid` | 아니요 | `boolean` | 데이터 / 상태 |
| `helpId` | 아니요 | `string` | 데이터 / 상태 |
| `errorId` | 아니요 | `string` | 데이터 / 상태 |
| `checked` | 아니요 | `boolean` | 데이터 / 상태 |
| `defaultChecked` | 아니요 | `boolean` | 데이터 / 상태 |
| `onCheckedChange` | 아니요 | `(detail: {checked: boolean}) => void` | 이벤트 |
| `value` | 아니요 | `string` | 데이터 / 상태 |
| `size` | 아니요 | `'medium' \| 'large'` | 데이터 / 상태 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

레이블이 있는 불리언 컨트롤로, 트랙, 핸들, 상태 아이콘, 선택적 aria-describedby 도움말을 가집니다. 목적을 나타내는 레이블은 상태에 따라 바뀌지 않습니다. role=switch를 가진 네이티브 체크박스를 쓰며, checked는 실제 불리언입니다. mixed 상태는 없습니다.

### 의미 API {#plain-semantic-api}

독립 API: checked/defaultChecked=false, onCheckedChange({checked}), label, 선택적 name/value, disabled=false, 도움말·오류 ID, size=medium. 콜백은 설정을 즉시 적용하라는 요청입니다. 제어하는 호스트는 대기 중에 요청을 거부할 수 있으며, 이때 화면이 거짓 상태를 보여서는 안 됩니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어/기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 의미 변경 요청 하나를 냅니다. 비활성, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 0회 냅니다. 제어 거부 시 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고, 제어 props가 계속 우선합니다. 추가 필드는 렌더러·머신 객체를 노출하지 않습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

레이블·컨트롤 클릭과 Space는 한 번만 토글합니다. Tab과 초점은 일반적으로 동작합니다. aria-checked는 실제 상태입니다. 추가 Enter 요구는 추정하지 않습니다. 상태 아이콘·핸들이 색에 의존하지 않는 단서와 3:1 대비를 제공합니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

페이지 전체에서 레이블·컨트롤 배치를 일관되게 유지하고, 넓은 컨테이너에서는 레이블을 컨트롤 가까이에 둡니다. 좁은 화면에서는 터치하기 쉬운 대상과 읽기 좋은 도움말을 제공합니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

name이 있으면 네이티브 checked 체크박스의 FormData 동작을 따릅니다. 비제어 리셋은 defaultChecked로 복원하고, 제어 상태는 콜백 없이 현재 prop을 유지합니다. 설정 부수 효과는 명시적 사용자 동작이나 호스트 정책에서만 일어나며, 마운트·prop·리셋을 재생해 일으키지 않습니다. IME는 없습니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 실제 설정·저장소·비동기 오류를 소유합니다. 별도의 적용 동작이 필요한 선택에는 쓰지 않으며, 그런 경우에는 Checkbox/Radio가 맞습니다. 로컬 스토리는 관찰 가능한 로컬 설정을 바꿉니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, control, track, handle, state-icon, label, help; checked,unchecked,disabled.

렌더링되는 모든 소유 파트는 `data-krds-component="switch"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 기준입니다. 위 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `medium`, `large`, `with-help`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-34) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_06_07.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
