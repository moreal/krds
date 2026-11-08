---
title: 'Calendar'
---

# Calendar {#calendar}

달력 · `Calendar`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_04_03.html) · [전체 명세](/sources/specs/components/calendar.md.txt) · [프레임워크 지원](../compatibility/)

## 네이티브 지원 현황 {#native-availability}

상태는 기록된 커버리지 기준입니다. [상태의 의미](../compatibility/#what-the-evidence-means)를 참고하세요.

| 프레임워크 | 패키지 버전 | 상태 | 예제 |
| --- | --- | --- | --- |
| react | `0.1.0` | planned | [react 예제](../compatibility/examples#react) |
| solid | `0.1.0` | implemented | [solid 예제](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [svelte 예제](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [vue 예제](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [lit 예제](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [qwik 예제](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [angular 예제](../compatibility/examples#angular) |
| solid-next (미리보기) | `0.1.0-preview.0` | planned | [solid-next 예제](../compatibility/examples#solid-next) |

## 속성·이벤트·콘텐츠·기본값 {#props-events-content-and-defaults}

모든 프레임워크가 공유하는 의미 계약입니다. 콜백 이름과 detail 타입은 그대로 씁니다. 네이티브 콘텐츠, ref, 이벤트 전달은 각 어댑터가 맡습니다. 선택 속성의 기본값은 자동으로 채워지지 않으므로 아래 안내의 명시적 기본값을 씁니다.

공개 API는 아래 검토된 안내와 각 네이티브 공개 선언이 정의합니다. [공유 이벤트·날짜 타입](/sources/packages/contracts/src/types.ts.txt).

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 공식 요구사항 {#official-requirements}

KRDS는 요일 제목, 구별되는 오늘·선택됨·선택 불가·인접 달 상태, 날짜를 구분하는 색 이외의 수단, 그 상태에 대한 접근 가능한 설명, 모든 기능에 대한 키보드 접근과 보이는 초점을 요구합니다. 상호작용 표는 순차적 Tab/Shift+Tab 이동과 Click/Enter 실행을 제공합니다. 인접 달 날짜도 선택할 수 있습니다. 복잡한 이벤트 정보는 잘리지 않고 제공되어야 합니다. 이벤트 캘린더 콘텐츠는 이 파일럿의 날짜 선택기 변형 범위 밖이며 구현했다고 주장하지 않습니다.

### 프로젝트 API와 기본값 {#project-api-and-defaults}

옵션: `mode: 'single' | 'range'`(기본 single, 변경 불가), `value`, `defaultValue`, `onValueChange`, `min`, `max`, `disabled`(false), `locale: 'ko-KR' | 'en-US'`(ko-KR), `translations?: CalendarTranslations`, `referenceDate: string`('2000-01-01'), `today?: string`, 보이는 달력 레이블 또는 명시적 aria-label/aria-labelledby, 시맨틱 동작 훅 `onConfirm(ValueChangeDetails<T>)`/`onCancel()`(T는 모드별 값 타입). DateInput과 정확히 같은 값 형태, 엄격한 파싱, 완전한 커밋 범위 규칙, 경계 포함, RangeError 정책을 씁니다. 암묵적 UTC 변환이나 호스트 의존 파싱은 없습니다. 독립 Calendar에는 폼 제출용 이름·값이 없으며 제출은 DateInput이 소유합니다.

커밋된 상태와 임시 선택은 별개입니다. 마운트 시 또는 DateInput 팝업이 열릴 때 임시 상태를 커밋된 값으로 초기화합니다. 비제어 단독 사용에서는 확인이 값을 적용하고 알립니다. 제어 사용에서는 새 값을 한 번 요청합니다. onConfirm은 활성 확인마다 일반 값 동작 알림을 한 번 내며, 값이 같아도 냅니다. onValueChange는 값이 바뀔 때만 발생합니다. DateInput은 값이 같아도 onConfirm으로 닫으며, 자신의 단일 값 알림만 노출합니다. Calendar는 스스로 모달 래퍼를 렌더링하지 않으며 팝업 수명과 초점 트랩은 DateInput이 제공합니다. 취소는 임시 상태를 커밋값으로 되돌리고 onCancel 동작을 한 번 내며 값 변경은 내지 않습니다. 외부 value prop 갱신은 콜백 없이 임시 선택과 표시를 교체합니다.

### 보기와 날짜 상호작용 {#view-and-date-interaction}

처음 표시하는 달은 커밋된 시작·단일 날짜의 달이며 없으면 referenceDate의 달입니다. referenceDate는 명시적이고 결정적이며 선택된 날짜를 뜻하지 않습니다. 초기 달이 min/max 밖에 완전히 있으면 가장 가까운 경계의 달을 표시합니다. 항상 6행 7열 표를 렌더링하며 요일 머리글과 이전·다음 달 날짜를 포함합니다. 지원하는 두 로캘 모두 한 주가 일요일에 시작합니다. 보이는 달은 하나입니다. 로캘에 따른 달력 체계 변경은 없습니다(그레고리력만). 달 제목은 한국어로 `YYYY년 M월`, 영어로 `Month YYYY`입니다.

이전/다음 달 컨트롤은 지원하는 연도·경계 범위 안에서 이동하며, 대상 달에 경계 안의 날이 없으면 컨트롤을 비활성화합니다. 연·월 이동은 초점 날짜를 대상 달의 마지막 실제 날로 맞추며 커밋된 선택은 맞추지 않습니다. 달력 가장자리에서 0년이나 10000년의 날짜 버튼은 렌더링하지 않고 그 칸을 비웁니다. 명시적 today가 주어질 때만 오늘을 강조하고 오늘 버튼을 표시합니다. 오늘 버튼은 그 날짜로 이동·초점하되 선택하거나 커밋하지 않으며 오늘이 경계 밖이면 비활성입니다. 스토리에는 숨은 시계나 네트워크 로캘 상태가 필요 없습니다.

선택 가능한 날짜의 Click/Enter/Space는 임시 상태만 바꿉니다. single 모드는 그 날짜를 설정합니다. range 모드에서 첫 활성화는 시작일을 설정하고 종료일을 지웁니다. 두 번째 활성화는 두 끝점을 시간순으로 정렬해 경계를 포함하는 범위를 완성합니다(역순 직접 텍스트 입력과 달리, 시간순 두 끝점은 날짜 선택에서 모호하지 않습니다). 세 번째 활성화는 새 범위를 시작합니다. 시작과 끝이 같으면 유효한 하루 범위입니다. 인접 달 날짜를 활성화하면 보기가 그 달로 이동합니다. 비활성·경계 밖 날짜의 활성화는 아무 일도 하지 않습니다. disabled=true이면 모든 선택기·내비게이션·푸터 컨트롤이 비활성이고 임시 상태는 보존되며 동작이 발생하지 않습니다.

확인은 완전하고 유효한 비어 있지 않은 임시 선택이거나 선택 사항인 빈 선택일 때 활성입니다. DateInput이 필수이면 빈 선택의 확인도 비활성입니다. 부분 범위와 유효하지 않거나 사용할 수 없는 날짜에서는 확인이 비활성이며 조용히 고치지 않습니다. 선택 사항인 빈 선택은 지우기 동작으로 만듭니다. 지우기는 임시 상태만 비우고, 이후 확인이 null 또는 둘 다 null을 커밋합니다. 필수 DateInput에서는 지우기를 숨깁니다. 독립 Calendar는 빈 선택을 허용합니다. 취소는 Calendar 전체가 비활성이 아니면 항상 활성입니다. 대화상자에 들어간 비활성 Calendar에도 대화상자의 독립적인 활성 닫기 동작이 있어야 합니다.

### 키보드와 접근성 {#keyboard-and-accessibility}

캡션 또는 보이는 제목이 있는 네이티브 표와 scope=col 요일 머리글을 렌더링합니다. 각 날짜는 셀 안의 네이티브 type=button입니다. 활성 날짜와 컨트롤은 고정된 KRDS 지침대로 모두 Tab/Shift+Tab으로 순차 접근할 수 있어야 합니다. 백엔드의 roving 전용 그리드/tabindex 모델을 채택하지 않습니다. 날짜 버튼에 초점이 있을 때 다음 탐색을 추가합니다. Left/Right(±1일), Up/Down(±7일), Home/End(초점 주의 일요일/토요일), PageUp/PageDown(이전/다음 달), Shift+PageUp/PageDown(이전/다음 해). 이는 초점·보기만 옮기며 선택은 바꾸지 않습니다. 비활성 날짜는 이동 방향으로 건너뛰고, min/max/연도 경계에서 멈추며 달력 전체를 순환하지 않습니다. Home/End는 해당 주 안에서만 찾습니다. 월·연 이동은 먼저 날을 맞춘 뒤 대상 달 안에서 이동 방향으로 찾으며, 선택 가능한 대상이 없으면 현재 초점을 유지합니다. 지원하는 날짜 탐색 키만 소비하고 일반 Tab과 컨트롤 버튼 동작은 네이티브 그대로입니다. IME 조합 중에는 단축키를 막습니다. 팝업의 Escape 동작은 DateInput/Modal 소관이며 독립 Calendar의 Escape에는 닫기 의미가 없습니다.

오늘 날짜는 aria-current=date를 가집니다. 선택된 임시 날짜는 aria-pressed=true를 가집니다(범위는 포함된 모든 날짜를 표시). 사용할 수 없는 날짜는 네이티브로 비활성이며, 활성인 척하는 버튼이 아닙니다. 인접 달 날짜는 접근 가능한 날짜 이름에서도 분명히 표시되며 색만으로는 충분하지 않습니다. 머리글 약어에는 전체 요일 접근 가능 텍스트가 있습니다. 정중한(polite) 라이브 달 제목이 이동을 한 번 알립니다. 날짜 사이로 초점을 옮길 때 관련 없는 안내를 반복하면 안 됩니다.

CalendarTranslations는 로캘과 병합되는 부분 재정의, 비어 있지 않은 최종 문자열, 일반 텍스트 자리표시자를 씁니다. UI 기본 문구는 다음과 같습니다.

| 키 | ko-KR | en-US |
| --- | --- | --- |
| previousMonth | 이전 달 | Previous month |
| nextMonth | 다음 달 | Next month |
| today | 오늘 | Today |
| clear | 지우기 | Clear |
| cancel | 취소 | Cancel |
| confirm | 확인 | Confirm |
| selected | 선택됨 | Selected |
| unavailable | 선택할 수 없음 | Unavailable |
| adjacentMonth | 다른 달 | Outside displayed month |
| dateLabel | {year}년 {month}월 {day}일 {weekday} | {weekday}, {monthName} {day}, {year} |
| visibleDayLabel | {day}일 | {day} |
| monthLabel | {year}년 {month}월 | {monthName} {year} |

`visibleDayLabel`은 전체 접근 가능한 `dateLabel`과 별도로 실제 보이는 날짜 버튼 텍스트를 제어합니다. `{year}`, `{month}`, `{day}` 치환을 쓰는 비어 있지 않은 일반 텍스트 템플릿입니다. 따라서 한국어 기본값은 `29일`, 영어 기본값은 `29`를 표시합니다. 이는 고정된 upstream의 숫자만 있는 날짜 span 예시와 다른 프로젝트 표시 조정입니다. 필수인 전체 한국어 접근 가능 날짜·상태 이름을 그대로 보존하고, 설치된 axe 4.14의 전체 단어 비교에서 보이는 날짜 단위 토큰이 그 이름과 일치하게 합니다. KRDS가 보이는 날짜 접미사를 규정한다는 주장이 아니며, 자동 규칙이 음성 제어·스크린 리더 인수를 입증한다는 주장도 아닙니다. 이 조정은 컨트롤러의 구현 판정을 따르며, 원래의 실패 원본과 뒷받침 조사는 `.superpowers/sdd/PLAN/task-T06-calendar-axe-research.md`와 그 근거 로그에 남아 있습니다.

요일 이름 일요일→토요일: 한국어 `일요일, 월요일, 화요일, 수요일, 목요일, 금요일, 토요일`(보이는 표기 `일, 월, 화, 수, 목, 금, 토`), 영어 `Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday`(보이는 표기 `Sun, Mon, Tue, Wed, Thu, Fri, Sat`). 영어 월 이름은 January부터 December까지입니다. 로캘이 그레고리력 데이터로 이 목록을 정합니다. 요일·월 이름을 명시적으로 재정의하려면 각각 비어 있지 않은 이름 7개/12개의 완전한 배열이어야 합니다. 2024-02-29의 기본 날짜 이름은 `2024년 2월 29일 목요일` 또는 `Thursday, February 29, 2024`입니다. 해당할 때 번역된 오늘, 선택됨, 선택 불가/인접 달 설명을 이 순서로 쉼표로 구분해 덧붙입니다. 숫자 날짜만으로는 부족합니다. 범위 끝점에는 번역된 `시작일`/`종료일`(`Start date`/`End date`) 설명이 추가로 붙으며 하루 범위는 둘 다 가집니다. 이 끝점 용어는 DateInputTranslations 또는 같은 기본값을 가진 독립 재정의 `startLabel`/`endLabel`을 재사용합니다.

### 구조와 인수 기준 {#structure-and-acceptance}

순서: 이전/다음 달 컨트롤이 있는 제목, 요일·날짜 표, 선택적 오늘, 허용될 때 지우기, 취소와 확인. 파트: `root`, `header`, `heading`, `previous`, `next`, `table`, `weekday`, `cell`, `day`, `footer`, `today`, `clear`, `cancel`, `confirm`. 날짜 상태: `today`, `selected`, `range-start`, `range-end`, `in-range`, `outside-month`, `disabled`. 초점을 선택·오늘과 구별합니다. `selected`는 편집 중 임시 선택을 반영하며, 취소된 팝업은 커밋된 DateInput 표시를 갱신하지 않습니다. 컨트롤은 해당하는 경우 `disabled`를 노출합니다.

인수: 윤년과 세기 규칙, 월·연 경계, 경계 포함 한도와 사용 불가 날짜, 같은 날/역순 클릭 범위, 부분 범위의 확인 비활성, 지우기·취소·확인과 제어 요청 횟수, 이동 중 값 이벤트 없음, 명시적 today/referenceDate, 활성 버튼 전부의 순차 접근과 추가 화살표, 한국어 전체 날짜·요일·상태 이름, 팝업 초점 복귀 대 독립 사용 시 트랩 없음, 강제 색상 모드의 색 이외 상태 단서. 원천 기록, 명세, 테스트는 렌더러 커버리지로 계산하지 않습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `single`, `range`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-2) · [svelte](/examples/svelte-16) · [vue](/examples/vue-59) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_04_03.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
