# 셀렉트 {#native-select}

시맨틱 ID `native-select`, export `NativeSelect`, 출처 `component_06_03`: [KRDS Select](https://www.krds.go.kr/html/site/component/component_06_03.html). [공통 규약](README.md)을 읽습니다.

## 공식 요구사항 {#official-requirements}

KRDS는 이를 플랫폼의 네이티브 단일 선택 컨트롤로 규정합니다. 레이블/접근 가능한 이름과 키보드 접근이 필요하며, 선택 변경만으로 폼을 제출하지 않습니다. 다중 선택은 다른 컴포넌트의 몫입니다. 플랫폼 네이티브 팝업의 탐색, 열기, 닫기, 타이프어헤드는 브라우저/OS 동작으로 남습니다.

## 프로젝트 API와 기본값 {#project-api-and-defaults}

옵션: `options: SelectOption[]`(필수, 고유한 문자열 값), `value?: string`, `defaultValue?: string`, `name?: string`, `required: boolean`(false), `disabled: boolean`(false), `invalid: boolean`(false), `size: 'small' | 'medium' | 'large'`(medium), `id`, 레이블 콘텐츠, 힌트/오류 콘텐츠, `onValueChange(ValueChangeDetails<string>)`. 네이티브 이름 속성과 `form`을 지원합니다. `multiple`, 커스텀 listbox, 합성 팝업, 렌더러 대체는 없습니다.

실제 `select`에 실제 `option` 요소를 소스 순서대로 담아 렌더링합니다. 보이는 레이블을 `id`에 연결합니다. 보이는 맥락만으로 목적이 분명하면 `aria-label`/`aria-labelledby`가 명시적 대안입니다. 힌트와 보이는 오류의 ID는 `aria-describedby`에 들어갑니다. invalid는 힌트를 숨기지 않고 `aria-invalid=true`를 설정합니다. 각 옵션은 레이블을 텍스트로, 네이티브 disabled 상태를 씁니다. 사용자가 비활성 옵션을 선택하는 것은 불가능합니다. 다만 명시적으로 제공한 제어 모드의 비활성 옵션 값은 네이티브 select 동작처럼 계속 표시될 수 있습니다.

비제어 초기화는 `defaultValue`가 있으면 그것을, 없으면 첫 번째 비활성이 아닌 옵션을 씁니다. 활성화된 옵션이 없으면 선택이 없고 커밋된 의미 값은 `''`입니다. 필수인데 선택하지 않은 상태가 필요하면 활성화된 빈 값 자리표시자 옵션을 명시적으로 씁니다. 옵션에 없는 비어 있지 않은 값은 설정 오류입니다. 일치하는 옵션이 없으면 `''`가 선택 없음을 나타낼 수 있습니다(`selectedIndex=-1`). 빈 값 옵션을 조용히 끼워 넣지 않습니다. 폼 리셋은 선택 없음을 포함한 이 정확한 초기 선택을 콜백 없이 복원합니다. 네이티브 `defaultSelected`만으로 표현할 수 없을 때도 어댑터가 초기 기준선을 복원합니다. 제어 모드의 리셋은 현재 값을 다시 적용합니다.

다른 값으로 커밋된 네이티브 변경은 `{value}`와 함께 한 번 내보냅니다. 제출, 이동, 다른 필드로의 초점 이동은 하지 않습니다. 제어 모드의 시도는 요청이며, 거부되면 변경 핸들러 뒤에 현재 prop을 다시 적용합니다. 이미 선택된 옵션을 클릭하거나 prop을 다시 적용하면 내보내지 않습니다. 네이티브 input과 change에서 알림을 중복하지 않습니다.

## 키보드·폼·구조 {#keyboard-form-and-structure}

비활성이 아니면 Tab/Shift+Tab이 select를 방문합니다. 화살표 키, Enter/Space, Escape, 팝업 초점, 타이프어헤드는 브라우저/OS가 맡으며, 커스텀 select를 흉내 내려고 가로채지 않습니다. 운영체제마다 같은 팝업 키 순서를 요구하지 않습니다.

네이티브 name/값, 필수 유효성, 비활성 생략, 폼 연결이 적용됩니다. 비어 있는 필수 값은 네이티브 제출을 막습니다. 선택이 없는 select는 성공 값을 내지 않으며, 빈 값 옵션이 선택되면 빈 문자열을 냅니다. select 전체의 비활성 상태는 폼 데이터에서 제외합니다. prop 변경과 리셋은 공개 값 이벤트를 내보내지 않습니다.

파트: `root`, `label`, `control`, `hint`, `error`, 선택적 장식용 `icon`. 루트/컨트롤 상태: `disabled`, `invalid`. 옵션의 비활성 의미는 네이티브로 남습니다. 콘텐츠 순서: 레이블, 컨트롤, 힌트/오류.

인수 기준:

- 실제 select 검사
- FormData
- 비활성 옵션
- 필수 빈 선택
- 제어 모드의 부모 거부
- 초기 기본값으로 리셋
- 변경 시 제출 없음
- 커밋된 변경당 정확히 한 번의 알림
