# 로케일과 날짜 값 {#locale-and-date-only-values}

로케일과 방향은 네이티브 provider/context로 전달합니다. provider는 문서 언어를 바꾸거나 import 시점에 전역 document를 건드리지 않아야 합니다. 애플리케이션이 여러 문서나 임베드 화면을 소유하면 해당 어댑터의 명시적 소유 문서 경로를 사용합니다.

## 날짜는 타임스탬프가 아닙니다 {#dates-are-not-timestamps}

Calendar와 DateInput은 0001–9999년의 엄격한 그레고리력 `YYYY-MM-DD` 값을 사용합니다. 공유 날짜 헬퍼는 시간대 변환 없이 날짜 부분만 파싱하고 계산합니다. 날짜 문자열을 `new Date(...)`에 넣어 로컬 형식으로 표시하면 안 됩니다. 시간대에 따라 날짜가 하루 밀릴 수 있습니다. 현재 시각에 의존하지 말고 기준 날짜를 명시합니다.

날짜 범위는 `{ start: string | null, end: string | null }`입니다. 미완성 초안은 커밋된 값과 분리합니다. min/max, 비활성 날짜, 순서, 확인, no-op 동작은 컴포넌트 명세가 정의합니다.

## 현지화된 레이블과 키보드 사용 {#localized-labels-and-keyboard-use}

한국어 Calendar 셀은 `{day}일` 형식으로, 영어는 `{day}`로 날짜를 표시합니다. 접근 가능한 전체 날짜·상태 이름은 이 표시 형식과 별개입니다. Calendar는 6행 7열의 네이티브 table을 사용합니다. 좁은 화면이나 높은 확대율의 스크롤은 table 영역 안에 가둡니다. 관련 없는 예제의 ARIA grid로 대체하지 않습니다.

활성 상태인 모든 Calendar 날짜와 모든 Tabs 탭은 검토된 KRDS 계약에 따라 순차 Tab 정지점으로 유지됩니다. 화살표는 순차 접근을 대체하지 않고 탐색을 더합니다. 정확한 키보드 계약은 [달력(Calendar)](../components/calendar), [날짜 입력 필드(DateInput)](../components/date-input), [탭(Tabs)](../components/tabs)에 있습니다.

네이티브 검증에는 서로 다른 시간대, 로케일 갱신, 제어 거부가 포함되어야 합니다. 공유 헬퍼가 맞다고 해서 프레임워크 렌더러, 하이드레이션, 애플리케이션 레이블까지 검증된 것은 아닙니다.
