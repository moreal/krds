---
title: 'Date input'
---

# Date input {#date-input}

**날짜 입력 필드** — 연, 월, 일을 직접 입력하거나 달력에서 골라 날짜를 넣게 합니다.

`DateInput` · `@unofficial-krds/<프레임워크>/date-input` · CSS `@unofficial-krds/styles/date-input.css`

## 사용법 {#usage}

- 날짜 하나 또는 시작일과 종료일로 된 기간을 입력받을 때 씁니다.
- 날짜는 `YYYY-MM-DD` 형식으로 직접 입력하거나 달력에서 고릅니다. 달력을 함께 써도 입력란은 항상 키보드로 입력할 수 있습니다.
- `label`에는 `방문일`처럼 무엇을 위한 날짜인지 드러나는 이름을 씁니다.
- 형식 안내는 입력란 아래에 항상 보입니다. 플레이스홀더만으로 형식을 알리지 않습니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `mode` | `'single' \| 'range'` | `"single"` | `single`은 날짜 하나, `range`는 시작일과 종료일 두 입력란을 표시합니다. 처음 렌더링한 뒤에는 바꿀 수 없습니다. |
| `value` | `string \| null \| DateRangeValue` | — | 값을 직접 제어할 때 넘깁니다. `single`에서는 `YYYY-MM-DD` 문자열 또는 `null`, `range`에서는 `{start, end}`입니다. 범위는 둘 다 비어 있거나 둘 다 채워져 있어야 합니다. |
| `defaultValue` | `string \| null \| DateRangeValue` | `null`, `range`에서는 `{ start: null, end: null }` | 직접 제어하지 않을 때의 초기값입니다. 형태는 `value`와 같습니다. |
| `onValueChange` | `(details: ValueChangeDetails<string \| null>) => void \| (details: ValueChangeDetails<DateRangeValue>) => void` | — | 올바른 날짜가 확정되어 값이 바뀔 때 한 번 불리며 `{value}`를 받습니다. 입력 중이거나 잘못된 날짜일 때는 불리지 않습니다. |
| `id` | `string` | 자동 생성 | 입력 요소의 `id`입니다. `range`에서는 종료일 입력란에 `-end`가 붙습니다. 생략하면 자동으로 만듭니다. |
| `name` | `string` | — | 폼 제출에 쓰는 필드 이름입니다. `range`에서는 `name.start`와 `name.end` 두 이름으로 제출합니다. |
| `form` | `string` | — | 입력란을 연결할 `form` 요소의 `id`입니다. |
| `returnFocusId` | `string` | — | 달력을 닫을 때 달력 버튼이 사라지고 없으면 대신 초점을 받을 요소의 `id`입니다. |
| `autocomplete` | `JSX.InputHTMLAttributes<HTMLInputElement>['autocomplete']` | — | 입력란의 `autocomplete` 속성으로 전달합니다. |
| `label` | `JSX.Element` | — | 필수입니다. 입력란의 레이블이며, `range`에서는 두 입력란을 묶는 `legend`가 됩니다. |
| `hint` | `JSX.Element` | `"YYYY-MM-DD 형식으로 입력하세요. 예: 2024-02-29"` (`ko-KR` 기준) | 입력란 아래에 항상 보이는 안내입니다. 생략하면 `locale`에 맞는 기본 형식 안내를 표시합니다. |
| `error` | `JSX.Element` | — | 서버 검사 결과처럼 바깥에서 정한 오류 내용입니다. 넘기면 입력란을 오류 상태로 표시합니다. |
| `errorMessage` | `JSX.Element` | — | `error`와 같은 역할입니다. `error`가 없을 때 사용합니다. |
| `invalid` | `boolean` | `false` | `true`이면 오류 내용 없이도 입력란을 오류 상태로 표시합니다. |
| `required` | `boolean` | `false` | `true`이면 날짜를 입력해야 폼을 제출할 수 있습니다. |
| `disabled` | `boolean` | `false` | `true`이면 입력과 달력 열기를 막고 폼 제출에서도 뺍니다. |
| `min` | `string` | `"0001-01-01"` | 고를 수 있는 가장 이른 날짜입니다. 그 날짜도 포함합니다. |
| `max` | `string` | `"9999-12-31"` | 고를 수 있는 가장 늦은 날짜입니다. 그 날짜도 포함합니다. |
| `locale` | `'ko-KR' \| 'en-US'` | 상위 `KrdsProvider`의 `locale`, 없으면 `"ko-KR"` | 레이블, 안내, 오류 문구의 언어입니다. 입력 형식과 제출 값은 바뀌지 않습니다. |
| `translations` | `Partial<DateInputTranslations>` | — | 기본 문구를 바꿀 때 넘깁니다. 넘긴 키만 바뀌고 나머지는 `locale`의 기본 문구를 씁니다. 빈 문자열은 쓸 수 없습니다. |
| `calendarTranslations` | `Partial<CalendarTranslations>` | — | 달력 안의 문구를 바꿀 때 넘깁니다. |
| `withCalendar` | `boolean` | `true` | `false`이면 달력 버튼 없이 입력란만 표시합니다. |
| `referenceDate` | `string` | `"2000-01-01"` | 값이 비어 있을 때 달력이 처음 보여 줄 달을 정하는 기준 날짜입니다. |
| `today` | `string` | — | 달력에서 오늘로 표시할 날짜입니다. 넘기면 달력에 그 날짜로 이동하는 오늘 버튼도 생깁니다. |
| `class` | `string` | — | 가장 바깥 요소에 붙일 클래스입니다. |
| `style` | `JSX.CSSProperties \| string` | — | 가장 바깥 요소에 적용할 인라인 스타일입니다. |

속성 이름은 프레임워크 공통입니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/#native-content-and-event-transport).

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 입력란과 달력 버튼 사이를 이동합니다. 컴포넌트 밖으로 초점이 나가면 입력한 날짜를 확정합니다. |
| `Enter` | 입력란에서는 입력한 날짜를 확정합니다. 폼은 제출하지 않습니다. 달력 버튼에서는 달력을 엽니다. |
| `Space` | 달력 버튼에 초점이 있을 때 달력을 엽니다. |
| `Esc` | 달력을 닫고 고르던 날짜를 버립니다. 초점은 달력 버튼으로 돌아갑니다. |

## 접근성 {#accessibility}

- 입력란은 `label`과 연결되고, `range`에서는 `fieldset`과 `legend` 아래에 `시작일`, `종료일` 이름을 가진 입력란 두 개가 놓입니다.
- 형식 안내와 오류 메시지는 `aria-describedby`로 입력란에 연결하고, 오류가 있으면 `aria-invalid`를 설정합니다.
- 오류는 입력할 때마다가 아니라 날짜를 확정할 때 한 번 화면 낭독기에 알립니다. 확정할 때 오류가 나도 초점을 옮기지 않습니다.
- 달력 버튼은 `달력 열기`라는 이름을 가지며 열림 상태를 `aria-expanded`로 알립니다.
- 한 화면에 날짜 입력이 여럿이면 `label`로 각각을 구분할 수 있게 합니다.

## 알아 둘 점 {#notes}

- 입력한 글자는 `Enter`를 누르거나 초점이 컴포넌트 밖으로 나갈 때 확정됩니다. `range`에서 두 입력란 사이를 오갈 때는 확정하지 않습니다.
- 형식이 틀리거나 `min`, `max`를 벗어난 날짜는 입력란에 그대로 남고 오류를 표시합니다. 이전에 확정된 값은 유지됩니다. 슬래시나 공백이 섞인 날짜를 고쳐 주거나 범위 안으로 끌어오지 않습니다.
- 달력에서 고른 날짜는 `확인`을 눌러야 반영됩니다. 취소하거나 `Esc`로 닫으면 원래 값이 남습니다.
- 폼에는 확정된 값을 `YYYY-MM-DD` 문자열로 제출합니다. 비어 있으면 빈 문자열을 보냅니다. 잘못된 입력이 남아 있으면 제출을 막고 해당 입력란으로 초점을 옮깁니다.
- 폼을 초기화하면 직접 제어하지 않는 값은 초기값으로 돌아가고, `value`로 제어하는 값은 그대로 유지됩니다. 열려 있던 달력은 닫힙니다.

## 스타일링 {#styling}

`@unofficial-krds/styles/date-input.css`를 가져옵니다. 각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `disabled`, `invalid` |
| `label` | 없음 |
| `control` | `disabled`, `invalid` |
| `start-input` | `disabled`, `invalid` |
| `end-input` | `disabled`, `invalid` |
| `trigger` | `open`, `closed` |
| `hint` | 없음 |
| `error` | 없음 |
| `popup` | `open`, `closed` |

```css
[data-krds-component="date-input"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_09_01.html)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/)를 따릅니다.
