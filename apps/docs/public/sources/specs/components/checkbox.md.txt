# 체크박스 {#checkbox}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 수락일 뿐이며, 네이티브 동작·시각/자산 검토·실행된 커버리지는 별도 게이트입니다. 어떤 게시도 승인되지 않았습니다.

시맨틱 ID `checkbox`, 한국어 이름 체크박스, export `Checkbox`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_06_02](https://www.krds.go.kr/html/site/component/component_06_02.html), 보존된 [HTML](../../upstream/krds/raw/components/component_06_02.html). 조회 시각 `2026-10-29T23:28:04.458Z`, `85481` 바이트, SHA-256 `ec11aad1a4bb2912e7381e3e81472e30817fdc92cdb712de0e039e95fc0fe537`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조해 확인했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 별개입니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류 `component`, 수용된 프로젝트 완료 종류 `component`. 프로젝트 완료 종류는 아래 근거를 따르며, 구체적인 완료 의무와 호스트 경계는 이 계약에 기술됩니다.

지원하는 네이티브 케이스(변형·상태 축): `binary`, `mixed-parent`, `chip`, `medium`, `large`. 이는 네이티브 케이스 이름이며, 상태·반응형·외관 축이 공식 명명 변형인 것은 아닙니다. 공식 유형/예시 제목 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

네이티브 체크박스와 연결된 레이블, 선택적 fieldset/legend 그룹으로 구성합니다. 계층형 전체 선택 상위 항목은 하위 항목 일부만 체크되면 mixed를 노출하고, 이진 컨트롤은 독립적입니다. 기본은 세로 배치에 레이블 오른쪽입니다.

## 의미 API {#plain-semantic-api}

독립 API: `checked?:boolean`, `defaultChecked?:boolean=false`, `indeterminate:boolean=false`, `onCheckedChange({checked:boolean})`, name/value="on", disabled=false, required=false, invalid/errorId/helpId, appearance=default|chip, size=medium. checked가 정의되면 제어 checked 모드이고, 없으면 한 번만 읽는 defaultChecked의 비제어 모드입니다. 둘 다 주거나 모드를 바꾸는 것은 잘못된 사용입니다. **indeterminate는 기본값 false를 포함해 항상 호스트 권위**입니다. 별도의 비제어 모드나 defaultIndeterminate가 없습니다. 그룹 소유자가 현재 적격 하위 선택에서 이를 도출하며, 임의로 만든 mixed 기준선으로 되돌리지 않습니다. 실제 `input.checked`와 `input.indeterminate`를 모두 적용하고, "mixed"라는 단어를 직렬화하지 않습니다.

[파일럿 알림/리셋 규약](./README.md)이 적용됩니다. 사용자 토글이 값을 바꾸면 checked 변경 요청을 한 번 내고, 마운트·prop·조정·리셋에서는 내지 않습니다. 네이티브 활성화가 브라우저의 indeterminate 비트를 지운 뒤에는 권위 있는 indeterminate와 제어 checked prop(또는 새로 커밋된 비제어 checked)을 다시 적용합니다. 거부된 제어 동작은 **두** 비트를 모두 복원해야 하므로, mixed 상위 항목에서 거절된 선택은 진짜 mixed로 남습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

레이블/컨트롤 클릭과 Space는 한 번 토글하며 Tab 순서는 보통과 같습니다. 전체 선택 상위 항목은 그룹 소유자가 제어합니다. 적격 활성 하위 항목이 모두 체크되면 checked, 일부만 체크되면 indeterminate입니다. mixed에서 활성화하면 적격 하위 항목 전체 선택을 요청하고, 전체 체크 상태에서 활성화하면 전체 해제를 요청합니다. 비활성 하위 항목은 몰래 바뀌지 않습니다. 수락·거부 후 상위 항목은 네이티브 클릭의 추측 결과가 아니라 실제 커밋된 하위 항목에서 다시 계산합니다. 대비, 색 이외의 단서, 보이는 초점은 계속 필수입니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

세로가 기본입니다. 가로 레이블은 간격이 분명해야 하고 좁은 화면에서 줄바꿈해야 합니다. 초점 기하가 보이는 체크박스와 다른, 작고 숨은 네이티브 컨트롤을 쓰면 안 됩니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

활성화된 이름 있는 체크박스에서 실제 checked 비트만 FormData 성공 여부를 정하며, indeterminate만으로는 정해지지 않습니다. 취소되지 않은 리셋은 비제어 checked를 초기 defaultChecked로 복원하고, 제어 checked는 유지하며, 현재 호스트 권위 indeterminate를 다시 적용합니다. "mixed 무조건 해제" 규칙은 없습니다. 전체 선택 조합에서는 먼저 각 하위 항목의 해당 리셋 상태를 복원한 뒤, 커밋된 적격 하위 항목에서 상위 항목의 checked/indeterminate 쌍을 다시 계산합니다. 따라서 처음에 일부만 선택된 그룹은 리셋 후 mixed 상위 항목으로 돌아갑니다. 호스트의 도출 재계산·조정은 사용자 변경 콜백을 내지 않습니다. 취소된 리셋은 하위 항목, 상위 항목, 두 네이티브 비트 모두에 무동작입니다. 네이티브 required 검증은 실제 입력의 checked 상태에 묶입니다. IME 편집은 없습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

그룹 소유자가 전체 선택 범위와 비활성 하위 항목 정책을 정의합니다. 수용된 독립 전체 선택 범위는 적격 활성 하위 항목만 포함하며, 비활성 하위 항목은 자신의 상태를 유지합니다. 설정이 즉시 적용되는 부수 효과는 암시하지 않으며, 제출/적용은 호스트 소유입니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, control, indicator, label, legend, help, error; checked,unchecked,mixed,disabled,invalid.

렌더되는 모든 소유 파트는 `data-krds-component="checkbox"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위 열거는 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정됩니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 레이블과 Space가 한 번 토글합니다.
2. mixed 상위 항목은 시각적으로도 프로그램적으로도 mixed입니다.
3. FormData는 체크 안 됨/비활성 값을 제외합니다.
4. 리셋은 checked 기준선과, 무조건 해제가 아닌 호스트 권위 또는 재계산된 mixed 상태를 복원합니다.
5. 전체 선택은 비활성 하위 항목을 몰래 바꾸지 않습니다.
6. 사용자 지정 스타일도 초점과 접근성을 유지합니다.
7. 거부된 제어 활성화는 브라우저가 지운 mixed 비트가 새지 않도록 checked와 indeterminate를 다시 적용합니다.
8. 처음에 일부만 선택된 그룹을 리셋하면 적격 하위 항목 기준선을 복원한 뒤 진짜 mixed 상위 항목을 재계산하며, 변경 콜백은 없습니다.
9. 취소된 리셋은 하위 항목과 정확한 checked/indeterminate 쌍을 바꾸지 않습니다.

위 항목은 앞으로 필요한 테스트이며, 실행되었거나 인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색 이외의 상태 단서, 움직임이 있는 곳의 동작 줄이기를 검증합니다. 빈 스위트를 성공으로 간주하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`checkbox--binary`, `checkbox--mixed-parent`, `checkbox--chip`, `checkbox--sizes`, `checkbox--disabled`, `checkbox--form-reset`, `checkbox--required`, `checkbox--initial-partial-reset`, `checkbox--controlled-mixed-rejected`, `checkbox--canceled-reset`.

각 케이스는 적용 가능한 모든 네이티브 렌더러(Solid 1, React, Svelte, Vue, Lit, Qwik, Angular)에서 로컬 args/입력/슬롯과 관찰 가능한 순수 로컬 상태를 가져야 합니다. Solid 2 미리보기는 별도로 격리됩니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 따로 마련되며, 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 수락되어야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 씁니다. Lit/Solid 2는 siheom 지원을 만들어 내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연(lazy) 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러/렌더러를 가져오면 안 됩니다. 다른 렌더러 래퍼는 금지입니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 보존된 상세 HTML 원본(본문 지침과 상호작용·마크업 표 포함)에서 추출했습니다. 공식 요구사항을 만들어 내지 않도록 원문 언어를 유지합니다. "고려한다/권장/할 수 있다" 같은 표현은 권고로 남습니다. 예시나 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원본 JS 함수 표는 참고 근거일 뿐이며, 네이티브가 제어하는 DOM에서 KRDS 원본 JS를 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립 선택입니다.

### 구조

- L[883–883](../../upstream/krds/raw/components/component_06_02.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_06_02.html:889): 1. 그룹 레이블(선택) 옵션 목록의 카테고리에 대한 설명 또는 옵션 선택에 대한 도움말을 제공함
- L[890–890](../../upstream/krds/raw/components/component_06_02.html:890): 2. 체크박스 양식 체크박스의 현재 선택 상태를 보여줌
- L[891–891](../../upstream/krds/raw/components/component_06_02.html:891): 3. 체크박스 레이블 선택하거나 선택 해제할 정보를 나타냄

### 유형

- L[899–899](../../upstream/krds/raw/components/component_06_02.html:899): 유형
- L[901–901](../../upstream/krds/raw/components/component_06_02.html:901): 한 그룹 내 모든 옵션을 독립적으로 선택할 수 있도록 할 때
- L[902–902](../../upstream/krds/raw/components/component_06_02.html:902): 가장 기본적인 체크박스 유형으로 체크박스 양식은 선택됨, 선택 안 됨 두 가지 상태로 표현된다.
- L[905–905](../../upstream/krds/raw/components/component_06_02.html:905): 전체 옵션을 선택할 수 있을 때
- L[906–907](../../upstream/krds/raw/components/component_06_02.html:906): 체크박스의 양식은 선택됨, 선택 안 됨, 중간의 세 가지 상태로 표현된다. 옵션이 의미적으로 상하 관계로 구성되어 있어 상위 옵션의 선택, 선택 해제를 통해 모든 하위 옵션을 선택, 선택 해제할 수 있다. 이때 하위 옵션의 일부만을 선택할 수 있으므로 이 경우에는 상위 옵션이 중간 상태로 설정된다. 사용자가 한 그룹 내의 모든 옵션을 개별적으로 선택하도록 할 수 있으나, 전체 선택 옵션을 제공할 경우 사용자는 모든 옵션을 선택할 수 있음을 분명하게 인지할 수 있고 효율적으로 값을 선택할 수 있다.

### 용례

- L[914–914](../../upstream/krds/raw/components/component_06_02.html:914): 용례
- L[916–916](../../upstream/krds/raw/components/component_06_02.html:916): 사용하기 적합한 경우
- L[921–921](../../upstream/krds/raw/components/component_06_02.html:921): 필터링
- L[922–922](../../upstream/krds/raw/components/component_06_02.html:922): 약관, 조건 선택 등
- L[918–924](../../upstream/krds/raw/components/component_06_02.html:918): 사용자가 옵션 목록에서 여러 개의 값을 선택할 수 있는 경우 필터링 약관, 조건 선택 등
- L[928–928](../../upstream/krds/raw/components/component_06_02.html:928): 사용하기 적합하지 않은 경우
- L[933–933](../../upstream/krds/raw/components/component_06_02.html:933): 라디오 버튼을 사용해야 한다.
- L[930–935](../../upstream/krds/raw/components/component_06_02.html:930): 사용자가 한 개의 옵션을 선택할 수 있도록 하는 경우 라디오 버튼을 사용해야 한다.
- L[939–939](../../upstream/krds/raw/components/component_06_02.html:939): 토글 스위치를 사용을 고려한다. 체크박스는 적용, 제출과 같은 별도의 확정 행위가 필요한 하나의 큰 과업 플로(Flow) 내에서 부분적으로 옵션을 선택하는 경우에 사용하기 적합하다.
- L[936–941](../../upstream/krds/raw/components/component_06_02.html:936): 옵션을 선택하자마자 적용되는 경우 토글 스위치를 사용을 고려한다. 체크박스는 적용, 제출과 같은 별도의 확정 행위가 필요한 하나의 큰 과업 플로(Flow) 내에서 부분적으로 옵션을 선택하는 경우에 사용하기 적합하다.

### 사용성 가이드라인

- L[949–949](../../upstream/krds/raw/components/component_06_02.html:949): 사용성 가이드라인
- L[952–952](../../upstream/krds/raw/components/component_06_02.html:952): 기본적으로 체크박스의 옵션은 가나다순으로 정렬한다.
- L[953–954](../../upstream/krds/raw/components/component_06_02.html:953): 사용자가 가장 많이 선택하는 옵션을 먼저 배치할 경우 옵션을 빠르게 선택하는 데 도움이 될 수 있다. 그러나 특정한 기준에 따른 옵션 정렬이 편견이나 차별을 강화할 수 있으므로 유의해서 사용해야 한다. 정렬 기준에 대한 명확한 근거나 이유가 없는 경우에는 가나다순으로 정렬하는 것이 가장 안전하다.
- L[957–957](../../upstream/krds/raw/components/component_06_02.html:957): 체크박스는 수직으로, 체크박스 레이블은 양식의 오른쪽에 배치한다.
- L[958–958](../../upstream/krds/raw/components/component_06_02.html:958): 가독성과 옵션 간 명확한 구분을 위하여 체크박스는 수직으로 배치하는 것이 좋다. 이때, 레이블은 양식의 오른쪽에 배치해 일관된 위치에서 텍스트를 읽을 수 있도록 해야 한다. 만약 체크박스를 수평으로 배치해야 한다면 레이블의 텍스트 길이가 지나치게 길지 않아야 한다.
- L[969–969](../../upstream/krds/raw/components/component_06_02.html:969): 체크박스의 레이블은 분명하고 정확하게 제공한다
- L[970–970](../../upstream/krds/raw/components/component_06_02.html:970): 사용자가 어떤 옵션을 선택하는 것인지 이해할 수 있도록 체크박스의 레이블은 분명하고 정확하게 제공해야 한다.
- L[973–973](../../upstream/krds/raw/components/component_06_02.html:973): 전체 선택 옵션이 제공되는 경우 중간 상태를 명확하게 표현한다.
- L[974–974](../../upstream/krds/raw/components/component_06_02.html:974): 하위 옵션의 일부만 선택되었음에도 불구하고 상위 옵션이 선택 상태로 유지되면 사용자에게 혼동을 줄 수 있다.

### 접근성 가이드라인

- L[1089–1089](../../upstream/krds/raw/components/component_06_02.html:1089): 접근성 가이드라인
- L[1092–1092](../../upstream/krds/raw/components/component_06_02.html:1092): 체크박스, 아이콘과 인접 배경 간 명도 대비를 3:1 이상으로 표현한다.
- L[1093–1093](../../upstream/krds/raw/components/component_06_02.html:1093): 체크박스의 배경과 체크 아이콘은 체크박스의 선택 상태와 해당 요소가 체크박스 컴포넌트임을 인지할 수 있게 도와주는 중요한 시각적 정보이므로 인접 배경과의 명도 대비를 최소 3:1 이상으로 제공해야 한다.
- L[1100–1100](../../upstream/krds/raw/components/component_06_02.html:1100): 체크박스의 선택 상태를 색상으로만 구분하지 않는다.
- L[1101–1101](../../upstream/krds/raw/components/component_06_02.html:1101): 체크박스의 선택 상태를 색상 이외의 수단으로 구분할 수 있는 시각적 단서를 제공해야 한다.
- L[1116–1116](../../upstream/krds/raw/components/component_06_02.html:1116): 체크박스를 키보드로 탐색하고 실행할 수 있도록 한다.
- L[1117–1118](../../upstream/krds/raw/components/component_06_02.html:1117): 사용자 에이전트에서 제공되는 기본 체크박스가 아니라 커스텀 디자인을 사용하는 경우에 기본 체크박스에 display:none, visibility:hidden, opacity:0과 같은 스타일을 하면 스크린 리더에서 체크박스의 역할을 인지할 수 없으며 키보드로 옵션을 선택할 수 없게 된다.
- L[1126–1126](../../upstream/krds/raw/components/component_06_02.html:1126): 체크박스에 키보드 초점이 명확하게 표시되도록 한다.
- L[1127–1128](../../upstream/krds/raw/components/component_06_02.html:1127): 사용자 에이전트에서 제공되는 기본 체크박스가 아니라 커스텀 디자인을 사용하는 경우 키보드 초점이 시각적으로 표시되도록 스타일을 제공해야 한다. 체크박스 요소를 시각적으로 숨기는 경우, 시각적으로 표시되고 있는 체크박스 양식과 숨겨진 요소의 크기와 위치를 일치시켜 포커스링이 적절하게 표시되도록 구현해야 한다.
- L[1136–1136](../../upstream/krds/raw/components/component_06_02.html:1136): 체크박스에 접근 가능한 이름을 제공한다.
- L[1137–1138](../../upstream/krds/raw/components/component_06_02.html:1137): 스크린 리더 사용자가 체크박스의 용도를 확인할 수 있도록 &lt;label&gt;, title, aria-label, aria-labelledby 중 1가지 방식을 이용하여 레이블을 제공해야 한다. 이때, 가능하면 &lt;label&gt;을 이용하여 사용자가 레이블을 클릭하였을 때에도 값을 선택할 수 있도록 구현하는 것이 좋다.
- L[1146–1146](../../upstream/krds/raw/components/component_06_02.html:1146): 스크린 리더에서 그룹 레이블과 체크박스 그룹의 관계를 확인할 수 있도록 한다.
- L[1147–1147](../../upstream/krds/raw/components/component_06_02.html:1147): &lt;fieldset&gt;, &lt;legend&gt;를 사용하여 스크린 리더 사용자에게 체크박스 그룹에서 값을 선택하는 목적을 보다 명확하게 전달할 수 있다.

### 상호작용 가이드라인

- L[1159–1159](../../upstream/krds/raw/components/component_06_02.html:1159): 상호작용 가이드라인
- L[1161–1161](../../upstream/krds/raw/components/component_06_02.html:1161): 옵션 탐색
- L[1179–1182](../../upstream/krds/raw/components/component_06_02.html:1179): Tab, Shift + Tab 모든 체크박스는 Tab, Shift + Tab 키를 눌렀을 때 접근할 수 있어야 한다.
- L[1189–1189](../../upstream/krds/raw/components/component_06_02.html:1189): 옵션 선택 및 선택 해제
- L[1207–1210](../../upstream/krds/raw/components/component_06_02.html:1207): Click 사용자는 체크박스 양식 또는 체크박스 레이블을 눌러 옵션을 선택하거나 선택 해제할 수 있다. 일반적으로 체크박스 양식은 조작하기에 크기가 충분하지 않으므로 레이블로 상호작용이 확장될 수 있도록 구현해야 한다.
- L[1211–1214](../../upstream/krds/raw/components/component_06_02.html:1211): Space 체크박스 양식에 초점이 있는 상태에서 Space 키를 누르면 값이 선택된다.

### 예시

- L[1233–1233](../../upstream/krds/raw/components/component_06_02.html:1233): 예시
- L[1237–1237](../../upstream/krds/raw/components/component_06_02.html:1237): 기본
- L[1302–1302](../../upstream/krds/raw/components/component_06_02.html:1302): 기본 코드 확인하기
- L[1318–1318](../../upstream/krds/raw/components/component_06_02.html:1318): 사이즈
- L[1344–1344](../../upstream/krds/raw/components/component_06_02.html:1344): 사이즈 코드 확인하기
- L[1360–1360](../../upstream/krds/raw/components/component_06_02.html:1360): chip
- L[1390–1390](../../upstream/krds/raw/components/component_06_02.html:1390): chip 코드 확인하기

### 마크업 가이드

- L[1411–1411](../../upstream/krds/raw/components/component_06_02.html:1411): 마크업 가이드
- L[1414–1414](../../upstream/krds/raw/components/component_06_02.html:1414): CSS 선택자
- L[1435–1440](../../upstream/krds/raw/components/component_06_02.html:1435): 전체영역 .krds-check-area 체크박스 세로 정렬 .chk-column
- L[1441–1447](../../upstream/krds/raw/components/component_06_02.html:1441): radio 감싸는 영역 .krds-form-check 사이즈 중간 .medium
- L[1448–1451](../../upstream/krds/raw/components/component_06_02.html:1448): 크게 .large
- L[1461–1461](../../upstream/krds/raw/components/component_06_02.html:1461): 개발 시 접근성 관련 주의 사항
- L[1463–1463](../../upstream/krds/raw/components/component_06_02.html:1463): 폼 컨트롤에 label을 매칭할 수 없는경우 title, aria-label, aria-labelledby 중 한가지 속성을 넣어 레이블은 제공한다.

인라인으로 보존된 예시 마크업(참고용이며 공개 네이티브 API가 아님): L[1242–1296](../../upstream/krds/raw/components/component_06_02.html:1242), L[1323–1338](../../upstream/krds/raw/components/component_06_02.html:1323), L[1365–1384](../../upstream/krds/raw/components/component_06_02.html:1365)

CSS/JS/가이드 이미지 원본 참조는 복사된 구현이 아닙니다. 필수/선택 열을 보존한 표 행의 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위 평탄화 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 기록된 독립 결정: 전체 선택은 적격 활성 하위 항목만 포함합니다. mixed 상위 항목을 활성화하면 적격 하위 항목 전체 선택을 요청하며, 이후 상태는 호스트 권위로 남습니다. 복원된 일부 선택 하위 기준선은 mixed를 재계산하며 무조건 해제하지 않습니다.
- 연결된 외부 코드 예시는 참조만 하고, 이번 준비에서 별도 파일로 포함하거나 읽지 않았습니다: L1307 `../../code/checkbox.html`, L1349 `../../code/checkbox_size.html`, L1395 `../../code/checkbox_chip.html`, L1475 `./variable/radio_button.html`. 확인하지 못한 내용은 추정하지 않습니다.
- 상세에 가이드 이미지 참조가 7개 있으며, 내장 픽셀 도식은 시각적으로 검사하지 않았습니다. 텍스트 구조와 지침만 읽었으며, 정확한 시각 치수와 자산은 이후 시각/출처 검토가 필요합니다.
- 의미 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정됩니다. 각 네이티브 렌더러는 자체 구현, 동작/스토리 소스, 독립 인수가 여전히 필요합니다.

## 수용된 독립 결정 {#accepted-independent-resolution}

전체 선택은 적격 활성 하위 항목만 포함합니다. mixed 상위 항목을 활성화하면 적격 하위 항목 전체 선택을 요청하며, 이후 상태는 호스트 권위로 남습니다. 복원된 일부 선택 하위 기준선은 mixed를 재계산하며 무조건 해제하지 않습니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `CheckboxContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트가 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트·조합·자산·통합에 계속 필수입니다.

이 문서의 공식 인용·파생 텍스트는 원래 KRDS 권리와 출처 표기를 유지하며, 독립 코드 MIT 부여는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며, 여기 인용한 실질 요구사항을 면제하지 않습니다.
