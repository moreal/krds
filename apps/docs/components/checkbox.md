---
title: 'Checkbox'
---

# Checkbox {#checkbox}

**체크박스** — 여러 선택지 가운데 원하는 만큼 고르게 합니다.

## 사용법 {#usage}

- 옵션 목록에서 여러 개를 고를 수 있을 때 씁니다. 필터, 약관 동의, 조건 선택이 대표적입니다.
- 하나만 골라야 하면 라디오 버튼을, 고르는 즉시 적용되는 설정이면 토글 스위치를 씁니다. 체크박스는 제출이나 적용 같은 확정 단계가 따로 있는 흐름에 맞습니다.
- 세로로 나열하고 레이블은 체크박스 오른쪽에 둡니다. 가로로 놓아야 한다면 레이블을 짧게 씁니다.
- 옵션은 특별한 이유가 없으면 가나다순으로 정렬합니다.
- 전체 선택을 제공할 때는 하위 옵션이 일부만 선택된 상태를 상위 체크박스에 `indeterminate`로 표시합니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `id` | `string` | 자동 생성 | 체크박스 입력 요소의 `id`입니다. 생략하면 자동으로 만들어 레이블과 연결합니다. |
| `name` | `string` | — | 폼을 제출할 때 쓰는 필드 이름입니다. |
| `label` **필수** | `string` | — | 체크박스 옆에 보이는 레이블입니다. 누르면 체크박스가 토글됩니다. |
| `disabled` | `boolean` | `false` | `true`이면 조작할 수 없고 폼 제출에서도 빠집니다. |
| `required` | `boolean` | `false` | `true`이면 체크해야 폼을 제출할 수 있습니다. |
| `invalid` | `boolean` | `false` | `true`이면 오류 상태로 표시하고 화면 낭독기에도 오류로 알립니다. |
| `helpId` | `string` | — | 도움말 요소의 `id`입니다. 체크박스의 설명으로 연결합니다. |
| `errorId` | `string` | — | 오류 메시지 요소의 `id`입니다. 체크박스의 설명으로 연결합니다. |
| `checked` | `boolean` | — | 체크 여부를 직접 제어할 때 넘깁니다. 넘기면 `onCheckedChange`에서 받은 값을 반영해야 화면이 바뀝니다. |
| `defaultChecked` | `boolean` | `false` | 직접 제어하지 않을 때의 초기 체크 여부입니다. 처음 한 번만 읽습니다. |
| `indeterminate` | `boolean` | `false` | `true`이면 일부 선택 상태로 표시합니다. 전체 선택 체크박스에서 하위 옵션의 선택 상태를 보고 직접 계산해 넘깁니다. |
| `onCheckedChange` | `(detail: {checked: boolean}) => void` | — | 사용자가 체크박스를 토글할 때 한 번 불리며 `{checked}`를 받습니다. 속성 변경이나 폼 초기화로 값이 바뀔 때는 불리지 않습니다. |
| `value` | `string` | `"on"` | 체크된 상태로 폼을 제출할 때 보내는 값입니다. |
| `appearance` | `'default' \| 'chip'` | `"default"` | `default`는 일반 체크박스, `chip`은 칩 모양으로 표시합니다. |
| `size` | `'medium' \| 'large'` | `"medium"` | 체크박스와 레이블의 크기입니다. `medium` 또는 `large`입니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

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

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 체크박스 사이를 차례로 이동합니다. |
| `Space` | 초점이 있는 체크박스를 체크하거나 해제합니다. |

## 접근성 {#accessibility}

- 실제 `input type="checkbox"`와 연결된 `label`로 렌더링하므로 화면 낭독기가 역할과 상태를 읽고, 레이블을 눌러도 토글됩니다.
- 일부 선택 상태는 화면에 보이는 표시와 함께 화면 낭독기에도 전달됩니다.
- `label`은 무엇을 선택하는지 분명하게 씁니다.
- 여러 체크박스를 묶을 때는 `fieldset`과 `legend`로 감싸 그룹의 목적을 알려 줍니다.
- 스타일을 바꿀 때는 체크박스와 체크 표시가 주변 배경과 3:1 이상의 명도 대비를 유지하게 하고, 선택 상태를 색만으로 구분하지 않습니다.

## 알아 둘 점 {#notes}

- `checked`와 `defaultChecked`는 함께 넘기지 않습니다. 사용 중에 제어 방식을 바꾸지도 않습니다.
- 폼에는 `name`이 있고 체크된 활성 체크박스만 제출됩니다. 일부 선택 상태는 제출 여부에 영향을 주지 않습니다.
- 폼을 초기화하면 직접 제어하지 않는 체크박스는 `defaultChecked`로 돌아가고, `checked`로 제어하는 체크박스는 그대로 유지됩니다.
- 전체 선택을 만들 때는 비활성 하위 옵션을 건드리지 않고, 선택 가능한 하위 옵션만 기준으로 상위 체크박스의 `checked`와 `indeterminate`를 계산합니다.
- 좁은 화면에서 긴 레이블은 줄바꿈됩니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `checked`, `unchecked`, `mixed`, `disabled`, `invalid` |
| `control` | `checked`, `unchecked`, `mixed`, `disabled`, `invalid` |
| `indicator` | `checked`, `unchecked`, `mixed`, `disabled`, `invalid` |
| `label` | 없음 |
| `legend` | 없음 |
| `help` | 없음 |
| `error` | 없음 |

```css
[data-krds-component="checkbox"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_06_02.html)
- [상세 명세](/sources/specs/components/checkbox.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/)를 따릅니다.
