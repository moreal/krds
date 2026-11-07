# 탭 {#tabs}

시맨틱 ID `tabs`, export `Tabs`, 출처 `component_04_10`: [KRDS Tabs](https://www.krds.go.kr/html/site/component/component_04_10.html). [공통 규약](README.md)을 함께 읽습니다.

## 공식 요구사항 {#official-requirements}

KRDS는 다음을 요구합니다.

- 키보드 접근과 보이는 초점.
- 색에 의존하지 않는 선택 상태 표시.
- 노출된 선택 상태.
- tablist/tab/tabpanel의 프로그램적 관계.

상호작용 표는 모든 탭을 Tab/Shift+Tab으로 이동할 수 있고, Click/Enter가 초점이 있는 탭을 선택한다고 규정합니다. 이 순차 키보드 접근을 유지합니다. 백엔드 기본값인 roving-tabindex를 그대로 물려받지 않습니다.

## 프로젝트 API와 기본값 {#project-api-and-defaults}

옵션:

- 순서가 있는 `items`. 각 항목은 비어 있지 않은 고유 문자열 `value`, 보이는 레이블, 패널 콘텐츠, 선택적 disabled 플래그를 가집니다.
- `value?: string`, `defaultValue?: string`.
- `activationMode: 'manual' | 'automatic'` (manual).
- `orientation: 'horizontal' | 'vertical'` (horizontal).
- `onValueChange(ValueChangeDetails<string>)`.
- 보이는 tablist 레이블 또는 aria-label/aria-labelledby (필수).
- 안정적인 인스턴스/항목 ID.

콘텐츠는 로컬입니다. 어댑터는 각자의 네이티브 슬롯/children을 사용합니다. 탐색 URL이나 비동기 로드 계약은 암시하지 않습니다. 모든 패널은 마운트된 채로 두어 선택이 바뀌어도 로컬 상태가 유지됩니다. 비활성 패널은 hidden이며 탭 순서와 접근성 트리에서 빠집니다.

기본 선택은 defaultValue이고, 없으면 첫 번째 활성 항목입니다. 비었거나 모두 disabled인 목록은 선택(`''`)도 활성 패널도 없습니다. 선택 값은 활성 항목을 가리켜야 합니다. 활성 항목이 없을 때의 `''`만 예외입니다. 따라서 활성 항목이 하나라도 있으면 선택된 패널이 정확히 하나 있습니다. 잘못된 선택을 담은 prop 갱신은 구성 오류입니다. 다른 항목을 몰래 선택하는 자동 복구는 없습니다.

## 초점과 활성화 정책 {#focus-and-activation-policy}

모든 활성 탭은 tabindex=0입니다. disabled 탭은 네이티브 disabled/tabindex=-1입니다. Tab/Shift+Tab으로 모든 활성 탭을 DOM 순서대로 순차 방문할 수 있습니다. manual 모드에서는 초점이 선택을 뜻하지 않습니다. 패널은 읽기 순서에서 tablist 뒤에 옵니다. 활성 패널은 첫 자식이 초점을 받을 수 없을 때만 tabindex=0입니다. 그렇지 않으면 일반 초점이 첫 초점 가능 콘텐츠에 닿습니다. 숨은 패널은 초점을 받지 않습니다.

다른 활성 탭의 Click 또는 Enter/Space는 정확히 한 번 선택합니다. Enter/Space는 네이티브 버튼 click 디스패치가 처리합니다. keydown에서 선택을 또 보내지 않습니다.

manual 모드: 화살표/Home/End는 초점만 옮기고, Enter/Space가 확정합니다.

automatic 모드는 즉시 쓸 수 있는 로컬 패널을 위한 명시적 옵트인입니다. 다른 활성 탭으로 초점이 이동하면 정확히 한 번 선택을 요청합니다. Tab과 프로그램적 초점도 포함합니다. 같은 초점/선택에 이어지는 click은 두 번 발생시키지 않습니다. 제어 부모가 거부하면 원래 선택된 패널을 유지하고, 초점은 요청된 탭에 남을 수 있습니다. 같은 활성화 제스처에서 짝지어진 focus/click 중복만 억제하고, 이후의 의도적 제스처는 억제하지 않습니다.

수평 모드는 Left/Right, 수직 모드는 Up/Down으로 이전/다음 활성 탭으로 이동합니다. 끝에서는 순환하고 disabled 항목은 건너뜁니다. Home/End는 첫/마지막 활성 탭에 초점을 둡니다. 처리한 탐색 키만 소비하며, 직교 화살표는 일반 스크롤을 유지합니다. 화살표는 KRDS 순차 접근에 더해지는 것이며 대체가 아닙니다.

선택이나 키보드 탐색은 URL을 바꾸지 않고, 폼을 제출하지 않으며, 초점을 패널로 옮기지 않습니다. 외부 선택 변경은 초점을 빼앗거나 콜백을 내지 않고 올바른 패널을 렌더링합니다.

## 관계·구조·인수 기준 {#relationships-structure-and-acceptance}

이름이 있는 role=tablist, type=button role=tab 컨트롤, aria-selected=true/false, 안정적 패널 ID를 가리키는 aria-controls, 자기 탭을 가리키는 aria-labelledby가 있는 role=tabpanel을 사용합니다. 방향은 tablist에 표시합니다. 활성 항목이 있으면 선택된 탭/보이는 패널이 정확히 하나입니다. 폼 이름/값이나 리셋 동작은 없습니다. 콘텐츠 오류는 해당 패널 안에 두며 탭 선택이 지우지 않습니다.

파트: `root`, `list`, `trigger`, `panel`, 선택적 장식용 `indicator`. 트리거 상태: `selected`, `disabled`. 패널 상태: `active` 또는 `inactive`. 선택 표시와 초점 링은 서로 구별됩니다.

인수 기준:

- 모든 활성 탭을 순차적으로 이동할 수 있습니다.
- manual 초점은 패널을 바꾸지 않습니다.
- automatic 옵트인은 제스처당 요청을 한 번만 처리합니다.
- 제어 거부를 처리합니다.
- disabled를 건너뛰고 순환합니다.
- ID가 안정적이고, 숨은 콘텐츠가 제외되며, 상태가 보존됩니다.
- prop 변경은 콜백을 내지 않고 초점을 옮기지 않습니다.
