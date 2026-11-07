# 버튼 {#button}

시맨틱 ID `button`, 공개 export `Button`, 원천 `component_05_02`: [KRDS Button](https://www.krds.go.kr/html/site/component/component_05_02.html). [공통 규약](README.md)을 읽습니다.

## 공식 요구사항 {#official-requirements}

KRDS는 접근 가능한 동작 이름, Enter/Space 키보드 조작, 보이는 초점을 요구합니다. 아이콘만 있는 버튼에는 기능적 텍스트 대체가 필요합니다. 레이블 옆의 장식 아이콘은 레이블을 반복하면 안 됩니다. 버튼은 동작을 수행하고, 이동에는 Link를 씁니다. 비활성 동작은 사용할 수 없습니다. 데이터 제출 버튼의 반복 활성화는 요청이 진행 중인 동안 애플리케이션이 막아야 합니다.

## 프로젝트 API와 기본값 {#project-api-and-defaults}

실제 `button`을 렌더링합니다. 옵션: `type: 'button' | 'submit' | 'reset'`(기본 `button`), `disabled: boolean`(false), `variant: 'primary' | 'secondary' | 'tertiary' | 'text' | 'icon'`(primary), `size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'`(medium), 네이티브 `name`, `value`, `form`, `aria-label`, `aria-labelledby`, 네이티브 콘텐츠. 아이콘은 다른 역할이 아니라 표시 변형입니다. 명시적인 접근 가능한 이름이 없으면 레이블 텍스트가 필요합니다. 동작 알림은 네이티브 `onClick`입니다. 값 변경 콜백과 선택 상태는 없습니다.

포인터 클릭, Enter, Space는 네이티브 버튼 활성화를 쓰며 각각 동작 콜백을 한 번 냅니다. 키 핸들러에서 두 번째 click을 합성하지 않습니다. Space는 키를 뗄 때 활성화됩니다. 비활성 버튼은 네이티브로 비활성이며, 순차 초점과 폼의 성공 컨트롤에서 제외되고, 콜백을 실행하지 않습니다. 외부에서 disabled를 설정해도 아무것도 내지 않습니다. 자동 디바운스나 비동기 로딩 상태는 없습니다. 제출 소유자가 대기 중에 동작을 비활성화하고 멱등성을 처리합니다.

`submit`은 네이티브 폼 검증에 참여하며, 제출자일 때 name/value를 포함합니다. 기본 `button`은 아무것도 제출하지 않습니다. `reset`은 취소 가능한 일반 폼 리셋 알고리즘을 한 번 호출합니다. 제어/비제어 상태는 적용되지 않습니다. 폼 검증 실패는 Button의 오류 상태가 아니며 오류는 필드 소유자가 노출합니다. 콘텐츠 순서는 레이블, 그다음 선택적 장식 아이콘입니다. 초점 링이 가려지지 않게 합니다.

## 구조와 인수 기준 {#structure-and-acceptance}

파트: `root`, `label`, `icon`. 상태: root의 `disabled`. 일시적인 초점·눌림은 네이티브 focus/active 의사 클래스가 처리합니다. 지속되는 pressed 상태는 없으며, 토글 버튼 계약은 다른 컴포넌트의 몫입니다.

네이티브 어댑터 인수: 폼 안의 기본 버튼은 제출하지 않습니다. 명시적 submit/reset은 동작합니다. 포인터/Enter/Space 활성화는 각각 한 번만 실행됩니다. 비활성 상태의 활성화는 실행되지 않습니다. 아이콘만 있는 컨트롤은 기능적 이름을 노출합니다. 강제 색상 모드와 확대에서도 초점과 레이블이 읽을 수 있어야 합니다. 이 테스트는 contracts 패키지가 아니라 각 프레임워크의 네이티브 렌더러가 필요합니다.
