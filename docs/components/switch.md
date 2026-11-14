---
title: 'Toggle switch'
---

# Toggle switch {#toggle-switch}

**토글 스위치** — 설정 하나를 켜거나 끕니다.

## 사용법 {#usage}

- 알림 표시 여부처럼 켜짐과 꺼짐 두 상태뿐인 설정을 바꾸고, 그 결과가 즉시 반영될 때 씁니다.
- 별도의 제출이나 적용 단계가 있어야 반영되는 선택에는 체크박스나 라디오 버튼을 씁니다. 선택지가 셋 이상이거나 두 상태가 서로 반대가 아닐 때도 라디오 버튼을 씁니다.
- 레이블은 가능하면 명사형으로 스위치의 목적을 적고, 상태가 바뀌어도 레이블을 바꾸지 않습니다. 상태를 글로 보여 주려면 스위치 옆에 별도 텍스트를 둡니다.
- 레이블과 스위치를 가까이 둡니다. 한 화면의 스위치는 모두 같은 배치를 씁니다.
- 켜짐도 꺼짐도 아닌 기본 상태가 필요한 경우에는 쓰지 않습니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `id` | `string` | — | 스위치 입력 요소의 `id`입니다. 생략하면 자동으로 만들어 레이블과 연결합니다. |
| `name` | `string` | — | 폼으로 제출할 때 쓰는 필드 이름입니다. |
| `label` **필수** | `string` | — | 스위치가 무엇을 켜고 끄는지 알려 주는 레이블입니다. 레이블을 눌러도 스위치가 전환됩니다. |
| `disabled` | `boolean` | `false` | `true`이면 스위치를 조작할 수 없습니다. |
| `required` | `boolean` | — | 폼을 제출하려면 스위치가 켜져 있어야 함을 나타냅니다. |
| `invalid` | `boolean` | — | 현재 값이 유효하지 않음을 보조 기술에 알리고, `errorId`의 오류 문구를 설명으로 연결합니다. |
| `helpId` | `string` | — | 도움말 요소의 `id`입니다. 스위치에 초점이 가면 화면 낭독기가 그 도움말을 함께 읽습니다. |
| `errorId` | `string` | — | 오류 문구 요소의 `id`입니다. `invalid`일 때만 스위치의 설명으로 연결됩니다. |
| `checked` | `boolean` | — | 켜짐 상태를 직접 제어할 때 넘깁니다. 넘기면 `onCheckedChange`에서 값을 바꿔야 화면이 바뀝니다. |
| `defaultChecked` | `boolean` | `false` | 상태를 직접 제어하지 않을 때의 처음 상태입니다. |
| `onCheckedChange` | `(detail: {checked: boolean}) => void` | — | 사용자가 스위치를 전환할 때 한 번 불리고, 바뀔 `checked` 값을 받습니다. 설정을 바로 적용하는 곳입니다. |
| `value` | `string` | — | 켜져 있을 때 폼으로 제출되는 값입니다. |
| `size` | `'medium' \| 'large'` | `medium` | 스위치 크기입니다. `medium` 또는 `large`입니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

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

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 스위치로 초점을 옮기거나 스위치에서 벗어납니다. |
| `Space` | 스위치를 켜거나 끕니다. |

## 접근성 {#accessibility}

- `role="switch"`인 체크박스로 표시되어 화면 낭독기가 스위치임과 현재 켜짐 상태를 읽어 줍니다.
- `label`이 스위치의 이름이 되며, 레이블 영역까지 누를 수 있어 조작 대상이 넓어집니다.
- 도움말이 있으면 `helpId`로 연결해 화면 낭독기가 스위치에 닿았을 때 함께 읽게 합니다.
- 핸들 위치와 상태 아이콘으로 상태를 전달하므로 색만으로 구분하지 않습니다.
- 트랙, 핸들, 상태 아이콘과 주변 배경의 명도 대비를 3:1 이상으로 유지합니다.

## 알아 둘 점 {#notes}

- `checked`와 `defaultChecked`는 함께 쓰지 않습니다. `checked`를 넘기면 제어 방식, 넘기지 않으면 `defaultChecked`에서 시작해 컴포넌트가 상태를 관리합니다.
- 제어 방식에서 `onCheckedChange`를 받고도 `checked`를 바꾸지 않으면 스위치는 이전 상태로 남습니다. 저장에 실패했을 때 화면이 실제 설정과 어긋나지 않게 할 수 있습니다.
- `name`이 있으면 체크박스처럼 켜져 있을 때만 폼 데이터에 포함됩니다.
- 폼을 초기화하면 `defaultChecked` 상태로 돌아갑니다. 제어 방식에서는 `checked` 값을 그대로 유지하며, 어느 쪽도 `onCheckedChange`를 부르지 않습니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `checked`, `unchecked`, `disabled` |
| `control` | `checked`, `unchecked`, `disabled` |
| `track` | `checked`, `unchecked`, `disabled` |
| `handle` | `checked`, `unchecked`, `disabled` |
| `state-icon` | `checked`, `unchecked`, `disabled` |
| `label` | 없음 |
| `help` | 없음 |

```css
[data-krds-component="switch"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_06_07.html)
- [상세 명세](/sources/specs/components/switch.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
