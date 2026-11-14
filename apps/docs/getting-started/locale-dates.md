# 로케일과 날짜 값 {#locale-and-date-only-values}

로케일과 글 방향은 각 프레임워크의 provider/context로 전달합니다. provider는 문서 언어를 바꾸지 않습니다. import만으로 전역 document를 건드리지도 않습니다.

여러 문서나 임베드 화면을 다루는 앱에서는 컴포넌트가 속한 문서를 어댑터에 명시적으로 지정합니다.

## 날짜는 타임스탬프가 아닙니다 {#dates-are-not-timestamps}

Calendar와 DateInput의 값은 `YYYY-MM-DD` 문자열입니다. 0001–9999년의 그레고리력 날짜만 받습니다.

- 공유 날짜 헬퍼는 시간대 변환 없이 날짜 부분만 파싱하고 계산합니다.
- 날짜 문자열을 `new Date(...)`에 넣어 표시하지 않습니다. 시간대에 따라 날짜가 하루 밀릴 수 있습니다.
- 현재 시각에 기대지 말고 기준 날짜를 명시합니다.

날짜 범위는 `{ start: string | null, end: string | null }`입니다. 입력 중인 미완성 값은 확정된 값과 따로 보관합니다. min/max, 비활성 날짜, 시작과 끝의 순서, 확인 동작은 각 컴포넌트 문서에 있습니다.

## 현지화된 레이블과 키보드 사용 {#localized-labels-and-keyboard-use}

Calendar 셀은 한국어에서 `{day}일`, 영어에서 `{day}`로 날짜를 표시합니다. 스크린 리더가 읽는 전체 날짜와 상태 이름은 이 표시 형식과 별개입니다.

Calendar는 6행 7열의 네이티브 table입니다. 좁은 화면이나 높은 확대율에서는 table 영역 안에서만 스크롤됩니다.

키보드로는 Tab과 화살표를 모두 쓸 수 있습니다. 활성 상태인 Calendar 날짜와 Tabs의 탭은 모두 Tab으로 차례로 이동할 수 있습니다. 화살표 키는 Tab 이동을 대신하지 않고 탐색 방법을 하나 더합니다.

정확한 키보드 규칙은 [달력(Calendar)](../components/calendar), [날짜 입력 필드(DateInput)](../components/date-input), [탭(Tabs)](../components/tabs)에 있습니다.

앱을 테스트할 때는 서로 다른 시간대, 로케일 변경, 부모가 변경을 받아들이지 않는 경우를 함께 확인합니다.
