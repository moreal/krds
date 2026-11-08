---
title: 'Checkbox'
---

# Checkbox {#checkbox}

체크박스 · `Checkbox`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_06_02.html) · [전체 명세](/sources/specs/components/checkbox.md.txt) · [프레임워크 지원](../compatibility/)

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
export interface CheckboxContract extends FieldContract {
    checked?: boolean;
    defaultChecked?: boolean;
    indeterminate?: boolean;
    onCheckedChange?: (detail: {
        checked: boolean;
    }) => void;
    value?: string;
    appearance?: 'default' | 'chip';
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
| `indeterminate` | 아니요 | `boolean` | 데이터 / 상태 |
| `onCheckedChange` | 아니요 | `(detail: {checked: boolean}) => void` | 이벤트 |
| `value` | 아니요 | `string` | 데이터 / 상태 |
| `appearance` | 아니요 | `'default' \| 'chip'` | 데이터 / 상태 |
| `size` | 아니요 | `'medium' \| 'large'` | 데이터 / 상태 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

네이티브 체크박스와 연결된 레이블, 선택적 fieldset/legend 그룹으로 구성합니다. 계층형 전체 선택 상위 항목은 하위 항목 일부만 체크되면 mixed를 노출하고, 이진 컨트롤은 독립적입니다. 기본은 세로 배치에 레이블 오른쪽입니다.

### 의미 API {#plain-semantic-api}

독립 API: `checked?:boolean`, `defaultChecked?:boolean=false`, `indeterminate:boolean=false`, `onCheckedChange({checked:boolean})`, name/value="on", disabled=false, required=false, invalid/errorId/helpId, appearance=default|chip, size=medium. checked가 정의되면 제어 checked 모드이고, 없으면 한 번만 읽는 defaultChecked의 비제어 모드입니다. 둘 다 주거나 모드를 바꾸는 것은 잘못된 사용입니다. **indeterminate는 기본값 false를 포함해 항상 호스트 권위**입니다. 별도의 비제어 모드나 defaultIndeterminate가 없습니다. 그룹 소유자가 현재 적격 하위 선택에서 이를 도출하며, 임의로 만든 mixed 기준선으로 되돌리지 않습니다. 실제 `input.checked`와 `input.indeterminate`를 모두 적용하고, "mixed"라는 단어를 직렬화하지 않습니다.

[파일럿 알림/리셋 규약](/sources/specs/components/README.md.txt)이 적용됩니다. 사용자 토글이 값을 바꾸면 checked 변경 요청을 한 번 내고, 마운트·prop·조정·리셋에서는 내지 않습니다. 네이티브 활성화가 브라우저의 indeterminate 비트를 지운 뒤에는 권위 있는 indeterminate와 제어 checked prop(또는 새로 커밋된 비제어 checked)을 다시 적용합니다. 거부된 제어 동작은 **두** 비트를 모두 복원해야 하므로, mixed 상위 항목에서 거절된 선택은 진짜 mixed로 남습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

레이블/컨트롤 클릭과 Space는 한 번 토글하며 Tab 순서는 보통과 같습니다. 전체 선택 상위 항목은 그룹 소유자가 제어합니다. 적격 활성 하위 항목이 모두 체크되면 checked, 일부만 체크되면 indeterminate입니다. mixed에서 활성화하면 적격 하위 항목 전체 선택을 요청하고, 전체 체크 상태에서 활성화하면 전체 해제를 요청합니다. 비활성 하위 항목은 몰래 바뀌지 않습니다. 수락·거부 후 상위 항목은 네이티브 클릭의 추측 결과가 아니라 실제 커밋된 하위 항목에서 다시 계산합니다. 대비, 색 이외의 단서, 보이는 초점은 계속 필수입니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

세로가 기본입니다. 가로 레이블은 간격이 분명해야 하고 좁은 화면에서 줄바꿈해야 합니다. 초점 기하가 보이는 체크박스와 다른, 작고 숨은 네이티브 컨트롤을 쓰면 안 됩니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

활성화된 이름 있는 체크박스에서 실제 checked 비트만 FormData 성공 여부를 정하며, indeterminate만으로는 정해지지 않습니다. 취소되지 않은 리셋은 비제어 checked를 초기 defaultChecked로 복원하고, 제어 checked는 유지하며, 현재 호스트 권위 indeterminate를 다시 적용합니다. "mixed 무조건 해제" 규칙은 없습니다. 전체 선택 조합에서는 먼저 각 하위 항목의 해당 리셋 상태를 복원한 뒤, 커밋된 적격 하위 항목에서 상위 항목의 checked/indeterminate 쌍을 다시 계산합니다. 따라서 처음에 일부만 선택된 그룹은 리셋 후 mixed 상위 항목으로 돌아갑니다. 호스트의 도출 재계산·조정은 사용자 변경 콜백을 내지 않습니다. 취소된 리셋은 하위 항목, 상위 항목, 두 네이티브 비트 모두에 무동작입니다. 네이티브 required 검증은 실제 입력의 checked 상태에 묶입니다. IME 편집은 없습니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

그룹 소유자가 전체 선택 범위와 비활성 하위 항목 정책을 정의합니다. 수용된 독립 전체 선택 범위는 적격 활성 하위 항목만 포함하며, 비활성 하위 항목은 자신의 상태를 유지합니다. 설정이 즉시 적용되는 부수 효과는 암시하지 않으며, 제출/적용은 호스트 소유입니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, control, indicator, label, legend, help, error; checked,unchecked,mixed,disabled,invalid.

렌더되는 모든 소유 파트는 `data-krds-component="checkbox"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위 열거는 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정됩니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `binary`, `mixed-parent`, `chip`, `medium`, `large`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-31) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_06_02.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
