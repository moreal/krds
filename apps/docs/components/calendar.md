---
title: 'Calendar'
---

# Calendar {#calendar}

**달력** — 달력에서 날짜나 기간을 고르게 합니다.

## 사용법 {#usage}

- 달력에서 날짜 하나 또는 기간을 고르게 할 때 씁니다.
- 입력 필드와 함께 날짜를 받고 폼으로 제출하려면 `DateInput`을 씁니다. `DateInput`이 이 달력을 팝업으로 엽니다.
- 날짜를 눌러도 바로 값이 바뀌지 않습니다. 확인을 눌러야 적용되고, 취소를 누르면 고르던 내용이 원래 값으로 돌아갑니다.
- 보이는 `label`이나 `aria-label`, `aria-labelledby` 중 하나로 달력의 이름을 반드시 줍니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `mode` | `'single' \| 'range'` | `single` | 날짜 하나를 고를지(`single`) 시작일과 종료일로 이루어진 기간을 고를지(`range`) 정합니다. 처음 정한 뒤에는 바꿀 수 없습니다. |
| `value` | `string \| null \| DateRangeValue` | — | 적용된 값을 직접 제어합니다. `single`에서는 `YYYY-MM-DD` 문자열 또는 `null`, `range`에서는 `{start, end}`입니다. 바깥에서 값을 바꾸면 달력의 선택과 표시도 따라 바뀝니다. |
| `defaultValue` | `string \| null \| DateRangeValue` | — | 처음에 선택해 둘 값입니다. 상태를 직접 제어하지 않을 때 씁니다. |
| `onValueChange` | `(details: ValueChangeDetails<string \| null>) => void \| (details: ValueChangeDetails<DateRangeValue>) => void` | — | 확인을 눌러 값이 실제로 바뀔 때 불립니다. 새 `value`를 받습니다. 날짜를 고르는 중이거나 달을 넘길 때는 불리지 않습니다. |
| `onConfirm` | `(details: ValueChangeDetails<string \| null>) => void \| (details: ValueChangeDetails<DateRangeValue>) => void` | — | 확인을 누를 때마다 불립니다. 값이 이전과 같아도 불리며, 확정된 `value`를 받습니다. |
| `onCancel` | `() => void` | — | 취소를 누를 때 불립니다. 고르던 내용은 적용된 값으로 되돌아갑니다. |
| `label` | `JSX.Element` | — | 달력 위에 보이는 이름입니다. 달력의 접근 가능한 이름으로 쓰입니다. |
| `min` | `string` | `0001-01-01` | 고를 수 있는 가장 이른 날짜입니다. 이 날짜도 고를 수 있습니다. |
| `max` | `string` | `9999-12-31` | 고를 수 있는 가장 늦은 날짜입니다. 이 날짜도 고를 수 있습니다. |
| `disabled` | `boolean` | `false` | 날짜, 달 이동, 아래쪽 버튼을 모두 비활성화합니다. 고르던 내용은 그대로 남습니다. |
| `required` | `boolean` | — | 켜면 날짜를 고르지 않은 채로는 확인할 수 없습니다. |
| `locale` | `'ko-KR' \| 'en-US'` | `ko-KR` | 달 제목, 요일, 버튼 문구의 언어입니다. 두 언어 모두 한 주는 일요일에 시작합니다. |
| `translations` | `Partial<CalendarTranslations>` | — | 버튼 문구, 날짜 이름 형식, 요일·월 이름 가운데 바꾸고 싶은 것만 넘겨 기본 문구를 덮어씁니다. 요일과 월 이름은 각각 7개, 12개를 모두 넘겨야 합니다. |
| `referenceDate` | `string` | `2000-01-01` | 선택된 날짜가 없을 때 처음 보여 줄 달을 정하는 날짜입니다. 이 날짜가 선택되지는 않습니다. |
| `today` | `string` | — | 오늘 날짜입니다. 넘기면 그 날짜를 강조하고 오늘 버튼을 표시합니다. 오늘 버튼은 그 날짜로 이동할 뿐 선택하지는 않습니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/#native-content-and-event-transport).

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 달 이동 버튼, 날짜, 아래쪽 버튼을 차례로 이동합니다. |
| `Enter` / `Space` | 초점이 있는 날짜를 고르거나 버튼을 실행합니다. |
| `←` / `→` | 하루 전이나 뒤의 날짜로 초점을 옮깁니다. |
| `↑` / `↓` | 일주일 전이나 뒤의 날짜로 초점을 옮깁니다. |
| `Home` / `End` | 초점이 있는 주의 일요일이나 토요일로 초점을 옮깁니다. |
| `PageUp` / `PageDown` | 이전 달이나 다음 달로 이동합니다. |
| `Shift+PageUp` / `Shift+PageDown` | 이전 해나 다음 해로 이동합니다. |

## 접근성 {#accessibility}

- 요일 머리글이 있는 표로 제공되며, 날짜마다 버튼입니다. 요일 약어에는 전체 요일 이름이 함께 전달됩니다.
- 날짜 버튼의 이름은 '2024년 2월 29일 목요일'처럼 전체 날짜이고, 오늘, 선택됨, 선택할 수 없음, 다른 달, 시작일·종료일 같은 상태가 뒤에 붙습니다.
- 오늘, 선택, 선택 불가, 다른 달 날짜는 색만이 아니라 텍스트로도 구분됩니다.
- 고를 수 없는 날짜는 비활성 버튼이며, 방향키로 이동할 때 건너뜁니다.
- 달을 넘기면 바뀐 달 제목을 화면 낭독기에 한 번 알립니다.

## 알아 둘 점 {#notes}

- `value`와 `defaultValue`는 함께 쓰지 않으며, 제어 방식은 처음 정한 뒤 바꿀 수 없습니다.
- 날짜 값은 모두 `YYYY-MM-DD` 형식입니다. 형식이 틀리거나 `min`·`max`를 벗어난 값을 넘기면 오류가 납니다.
- `range`에서는 첫 번째로 누른 날짜가 시작일, 두 번째가 종료일이 됩니다. 더 이른 날짜를 나중에 눌러도 순서를 맞춰 주며, 같은 날을 두 번 누르면 하루짜리 기간이 됩니다. 한 번 더 누르면 새 기간을 시작합니다.
- 지우기는 고르던 날짜를 비울 뿐이며, 이어서 확인을 눌러야 빈 값이 적용됩니다. 기간을 한쪽만 고른 상태에서는 확인할 수 없습니다.
- 이전·다음 달의 날짜도 고를 수 있으며, 누르면 그 달로 넘어갑니다. 달력은 항상 여섯 주를 표시합니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | 없음 |
| `header` | 없음 |
| `heading` | 없음 |
| `previous` | `disabled` |
| `next` | `disabled` |
| `table` | 없음 |
| `weekday` | 없음 |
| `cell` | 없음 |
| `day` | `today`, `selected`, `range-start`, `range-end`, `in-range`, `outside-month`, `disabled` |
| `footer` | 없음 |
| `today` | `disabled` |
| `clear` | `disabled` |
| `cancel` | `disabled` |
| `confirm` | `disabled` |

```css
[data-krds-component="calendar"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_04_03.html)
- [상세 명세](/sources/specs/components/calendar.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/)를 따릅니다.
