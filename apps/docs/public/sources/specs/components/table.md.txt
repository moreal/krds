# 표 {#table}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐입니다. 네이티브 동작, 시각·자산 검토, 실행된 커버리지는 별도 관문으로 남습니다. 게시는 승인되지 않았습니다.

시맨틱 ID `table`, 한국어 이름 표, export `Table`. 고정된 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세 페이지: [component_04_11](https://www.krds.go.kr/html/site/component/component_04_11.html), 보존본 [HTML](../../upstream/krds/raw/components/component_04_11.html). 조회 시각 `2026-10-29T23:28:03.975Z`, `74382` 바이트, SHA-256 `62101d3ac5f3758b0a31b07862f3e0575cb185fb871357f46dd0e43877d314d0`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정된 출처 종류는 `component`이고, 수용된 프로젝트 완료 종류도 `component`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 사례(변형·상태 축): `basic`, `sortable`, `narrow-scroll`, `narrow-stacked`. 이는 네이티브 사례 이름입니다. 상태·반응형·외형 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형·예시 헤딩 원문은 근거 부록에 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

실제 <table>에 caption, thead/tbody, th scope, 적절한 행 헤더/tfoot을 둡니다. 복잡한 관계는 headers/id를 씁니다. 개발 메모에 따라 caption이 헤더 내용을 설명합니다. 비어 있는 데이터 셀은 대시를 표시합니다. 정량 수치는 오른쪽 정렬하고, 텍스트·명목 숫자는 왼쪽 정렬합니다.

## 의미 API {#plain-semantic-api}

독립 API: caption, columns {id,label,kind,sortable?}[], rows {id,cells}[], 기존 열 하나를 가리키는 rowHeaderColumnId?, 선택적 sort {columnId,direction}/onSortChange. 없으면 정렬 동작이 없습니다. 정렬 가능하면 공식 지침에 따라 초기 정렬은 첫 번째 열입니다. 헤더 버튼은 th 안에 두고, aria-sort는 실제 순서를 따릅니다. rowHeaderColumnId가 있으면 그 열은 안정적인 ID를 가진 네이티브 th scope=row로 렌더링되며, 모든 데이터 셀이 요구되는 대로 자신의 행·열 헤더를 참조합니다. 알 수 없는 rowHeaderColumnId는 구성 오류입니다. 셀 텍스트나 kind로 행 헤더를 자동 추론하지 않습니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어/기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 의미 변경 요청 하나를 냅니다. 비활성, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 0회 냅니다. 제어 거부 시 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고, 제어 props가 계속 우선합니다. 추가 필드는 렌더러·머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

일반 표는 읽기 전용이며, 포함된 링크·버튼을 제외하면 Tab으로 이동하지 않습니다. 정렬을 활성화해도 헤더 버튼의 초점을 유지합니다. 넘침 래퍼는 이름을 가지며, 필요할 때만 초점을 받습니다. 드래그 전용 이동이 아니라 단순한 클릭·탭 스크롤 컨트롤을 제공합니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

단순한 1차원 표는 연관성을 보존하면서 헤더·데이터 쌍을 쌓을 수 있습니다. 복잡한 표는 가로 영역 스크롤을 씁니다. 가로 스크롤바를 발견하기 쉽게 유지하고 데이터를 잘라내지 않습니다. 제한적인 모달·아코디언 배치는 피합니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

표 자체의 폼·리셋 상태는 없습니다. 포함된 컨트롤은 자신의 의미를 유지합니다. 선택 중심 상호작용은 StructuredList의 몫입니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 데이터, 형식, 정렬 핸들러를 소유합니다. 로컬 예시는 실제로 행을 재정렬하며 헤더 연관을 보존합니다. 완료는 div 그리드가 아니라 네이티브 의미와 조건부 정렬을 요구합니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, caption, head, body, row, header-cell, cell, sort-trigger, scroll-region, scroll-previous, scroll-next; ascending,descending,overflow.

렌더링되는 모든 소유 파트는 `data-krds-component="table"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 기준입니다. 위 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 스크린 리더의 헤더 연관이 데이터와 일치합니다.
2. 빠진 셀은 대시를 표시합니다.
3. 정량 숫자와 명목 숫자는 알맞게 정렬됩니다.
4. 구성하지 않은 표에는 정렬 컨트롤이 없습니다.
5. 정렬 버튼은 초점을 잃지 않고 실제 순서와 aria-sort를 바꿉니다.
6. 좁은 화면의 복잡한 표는 단순한 버튼으로 스크롤할 수 있습니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 단서, 움직임이 있다면 동작 줄이기를 검증합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`table--basic`, `table--row-headers`, `table--missing-cells`, `table--sortable`, `table--narrow-scroll`, `table--narrow-stacked`.

각 사례는 해당하는 모든 네이티브 렌더러에서 로컬 args/입력/슬롯과 관찰 가능한 순수 로컬 상태가 필요합니다: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에서 따로 단계화하며, 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부를 인수해야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 씁니다. Lit과 Solid 2는 siheom 지원을 만들어 내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular의 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러·렌더러를 절대 import하지 않습니다. 다른 렌더러 래퍼는 없습니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 보존된 상세 HTML에서 가져왔으며 핵심 지침과 상호작용·마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 원문 언어를 유지합니다. “고려한다/권장/할 수 있다” 같은 표현은 권고로 남습니다. 예시·CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원본 JS 함수 표는 참고 근거일 뿐이며, 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행해서는 안 됩니다. 위의 공통 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립 선택입니다.

### 구조

- L[885–885](../../upstream/krds/raw/components/component_04_11.html:885): 구조
- L[891–891](../../upstream/krds/raw/components/component_04_11.html:891): 1. 헤더 각 데이터 셀의 제목
- L[892–892](../../upstream/krds/raw/components/component_04_11.html:892): 2. 행 서로 다른 유형의 데이터를 보여줌
- L[893–893](../../upstream/krds/raw/components/component_04_11.html:893): 3. 디바이더 행과 행 사이를 시각적으로 구분하는 수단
- L[894–894](../../upstream/krds/raw/components/component_04_11.html:894): 4. 데이터 셀 행을 구성하는 데이터 요소

### 용례

- L[902–902](../../upstream/krds/raw/components/component_04_11.html:902): 용례
- L[904–904](../../upstream/krds/raw/components/component_04_11.html:904): 사용하기 적합한 경우
- L[909–909](../../upstream/krds/raw/components/component_04_11.html:909): 예) 통계 데이터
- L[906–911](../../upstream/krds/raw/components/component_04_11.html:906): 표 형식의 데이터를 제공하는 경우 예) 통계 데이터
- L[915–915](../../upstream/krds/raw/components/component_04_11.html:915): 에) 리소스 목록, 게시물 목록
- L[912–917](../../upstream/krds/raw/components/component_04_11.html:912): 다수의 항목에 대해서 유사한 방식으로 구조화된 정보를 표현하는 경우 에) 리소스 목록, 게시물 목록
- L[921–921](../../upstream/krds/raw/components/component_04_11.html:921): 사용하기 적합하지 않은 경우
- L[926–926](../../upstream/krds/raw/components/component_04_11.html:926): 콘텐츠의 의미와 맥락을 고려하였을 때 정의 목록, 순서 있는 목록, 순서 없는 목록, 제목과 문단의 조합으로 표현하는 것이 적합한 경우에는 표를 사용하지 않을 것을 권장한다. 데이터 셀 내의 정보가 복잡하거나 계층적인 구조를 가진 경우에도 마찬가지이다.
- L[923–928](../../upstream/krds/raw/components/component_04_11.html:923): 다른 콘텐츠 형식이 더 적합한 경우 콘텐츠의 의미와 맥락을 고려하였을 때 정의 목록, 순서 있는 목록, 순서 없는 목록, 제목과 문단의 조합으로 표현하는 것이 적합한 경우에는 표를 사용하지 않을 것을 권장한다. 데이터 셀 내의 정보가 복잡하거나 계층적인 구조를 가진 경우에도 마찬가지이다.
- L[932–932](../../upstream/krds/raw/components/component_04_11.html:932): 막대그래프와 같은 차트나 인포그래픽으로 정보를 제공하는 것이 보다 직관적일 수 있다.
- L[929–934](../../upstream/krds/raw/components/component_04_11.html:929): 데이터 간 복잡한 관계를 표현해야 하는 경우 막대그래프와 같은 차트나 인포그래픽으로 정보를 제공하는 것이 보다 직관적일 수 있다.
- L[938–938](../../upstream/krds/raw/components/component_04_11.html:938): 요소를 사각형으로 배치하기 위한 목적으로 표를 사용해서는 안 된다. 그리드, 플렉스 박스 등 적절한 스타일 속성을 활용해야 한다.
- L[935–940](../../upstream/krds/raw/components/component_04_11.html:935): 그리드를 표현하고자 하는 경우 요소를 사각형으로 배치하기 위한 목적으로 표를 사용해서는 안 된다. 그리드, 플렉스 박스 등 적절한 스타일 속성을 활용해야 한다.
- L[944–944](../../upstream/krds/raw/components/component_04_11.html:944): 카드와 같은 유연한 레이아웃을 사용하는 것이 적합하다.
- L[941–946](../../upstream/krds/raw/components/component_04_11.html:941): 데이터 구조에 일관성이 없는 경우 카드와 같은 유연한 레이아웃을 사용하는 것이 적합하다.
- L[950–950](../../upstream/krds/raw/components/component_04_11.html:950): 표 컴포넌트 대신 구조화 목록 컴포넌트를 사용해야 한다.
- L[947–952](../../upstream/krds/raw/components/component_04_11.html:947): 데이터와 관련하여 복잡한 상호작용이 필요한 경우 표 컴포넌트 대신 구조화 목록 컴포넌트를 사용해야 한다.

### 사용성 가이드라인

- L[960–960](../../upstream/krds/raw/components/component_04_11.html:960): 사용성 가이드라인
- L[963–963](../../upstream/krds/raw/components/component_04_11.html:963): 표는 데이터 잘림 없이 표시될 수 있는 영역에 사용한다.
- L[964–964](../../upstream/krds/raw/components/component_04_11.html:964): 아코디언, 모달과 같이 공간의 제한으로 인해 데이터가 잘리거나 데이터 확인을 위해 가로 스크롤을 사용해야 하는 영역에는 표를 사용하지 않아야 한다. 필요한 경우, 각각의 열이 아래로 떨어지도록 배치한다.
- L[971–971](../../upstream/krds/raw/components/component_04_11.html:971): 열의 최소 너비는 콘텐츠의 길이를 고려하여 설정한다.
- L[972–972](../../upstream/krds/raw/components/component_04_11.html:972): 데이터 셀을 구성하는 텍스트는 가능한 3줄을 넘어가지 않도록 하고 행과 행 사이의 간격을 적절하게 제공하여 사용자가 한 번에 많은 데이터를 비교할 수 있도록 해야 한다.
- L[975–975](../../upstream/krds/raw/components/component_04_11.html:975): 열 구분선의 사용을 지양한다.
- L[976–976](../../upstream/krds/raw/components/component_04_11.html:976): 열 구분선은 표 콘텐츠를 구조화하거나 구분하는 데 도움이 될 수 있으나 시각적인 복잡성을 높이므로 반드시 필요한 경우를 제외하고 사용하지 않는 것이 바람직하다.
- L[979–979](../../upstream/krds/raw/components/component_04_11.html:979): 양적 데이터를 전달하기 위한 숫자는 오른쪽으로 정렬한다.
- L[980–980](../../upstream/krds/raw/components/component_04_11.html:980): 개수, 퍼센트, 용량 등의 양적 데이터는 셀에서 오른쪽으로 정렬하여 사용자가 숫자를 더 잘 비교할 수 있도록 해야 한다. 숫자를 오른쪽으로 정렬하면 단위 구분 기호(, %, KB 등)가 일관된 위치에 배치되므로 가독성을 높인다.
- L[983–983](../../upstream/krds/raw/components/component_04_11.html:983): 텍스트 데이터, 명목 데이터는 왼쪽으로 정렬한다.
- L[984–984](../../upstream/krds/raw/components/component_04_11.html:984): 일반적인 텍스트 데이터와 범주를 구분하기 위한 목적으로 사용되는 명목 데이터(예 - 날짜, 우편번호, 핸드폰 번호, IP주소 등)는 왼쪽으로 정렬하여 사용자가 데이터를 탐색하기 위해 일관된 위치에서 안구 운동을 시작할 수 있도록 해야 한다.
- L[987–987](../../upstream/krds/raw/components/component_04_11.html:987): 열의 개수를 최소화한다.
- L[988–988](../../upstream/krds/raw/components/component_04_11.html:988): 수평으로 길게 배치된 정보를 읽는 것보다 수직으로 배치된 정보를 읽는 것이 더 쉬우므로 표를 구성하는 열의 개수를 최소화하는 것이 좋다. 가능하다면 불필요하거나 상대적으로 덜 중요한 열을 제거하고, 행과 열을 전환하는 방법을 활용할 수 있다.
- L[991–991](../../upstream/krds/raw/components/component_04_11.html:991): 사용자가 원하는 대로 데이터를 정렬할 수 있는 기능을 제공한다.
- L[992–992](../../upstream/krds/raw/components/component_04_11.html:992): 데이터의 수가 많은 경우 데이터를 논리적인 순서에 따라 정렬하거나 검색, 필터링, 탐색하는 기능을 제공하면 사용자가 효율적으로 원하는 데이터를 발견할 수 있다. 열 헤더에 정렬 버튼이 제공되는 경우, 기본 상태는 가장 첫 번째 열을 기준으로 데이터가 정렬된 상태이다.
- L[995–995](../../upstream/krds/raw/components/component_04_11.html:995): 데이터 값이 존재하지 않는 경우 셀을 비워두지 않고 대시(-)를 제공한다.
- L[996–996](../../upstream/krds/raw/components/component_04_11.html:996): 데이터 셀에 아무런 텍스트가 표시되지 않으면 사용자에게 혼동을 줄 수 있으므로 빈 셀에는 대시 기호를 표시하여 이용할 수 있는 정보가 존재하지 않음을 안내해야 한다.

### 플랫폼에 대한 고려 사항

- L[1004–1004](../../upstream/krds/raw/components/component_04_11.html:1004): 플랫폼에 대한 고려 사항
- L[1007–1007](../../upstream/krds/raw/components/component_04_11.html:1007): 화면 너비가 충분하지 않은 경우 데이터의 배열 방식의 변경을 고려한다.
- L[1008–1008](../../upstream/krds/raw/components/component_04_11.html:1008): 한 줄의 행 헤더 또는 열 헤더로 구성된 단일 차원의 단순한 표의 경우, 헤더 텍스트와 데이터 텍스트를 수직으로 배치를 변경할 수 있다.
- L[1019–1019](../../upstream/krds/raw/components/component_04_11.html:1019): 화면 너비가 충분하지 않은 경우 표 영역에 가로 스크롤을 사용하는 방안을 고려한다.
- L[1020–1021](../../upstream/krds/raw/components/component_04_11.html:1020): 행과 열 간의 관계 표현이 유지되어야 하거나 구성이 복잡하다면 셀의 배치를 변경하지 않고 표 섹션에 가로 스크롤을 생성할 수 있다. 만약 표에 열 헤더가 존재한다면 가로 스크롤의 위치가 변경되더라도 열 헤더를 화면의 왼쪽에 고정함으로써 데이터를 탐색하는 과정의 편의성을 높일 수 있다.

### 접근성 가이드라인

- L[1132–1132](../../upstream/krds/raw/components/component_04_11.html:1132): 접근성 가이드라인
- L[1135–1135](../../upstream/krds/raw/components/component_04_11.html:1135): 데이터의 구조를 적절하게 반영하여 마크업한다.
- L[1136–1136](../../upstream/krds/raw/components/component_04_11.html:1136): 표는 &lt;table&gt;로 마크업하고 &lt;caption&gt;, &lt;thead&gt;, &lt;th&gt;, &lt;tfoot&gt; 태그를 적절히 사용하여 시각적으로 표현된 정보의 구조가 스크린 리더를 통해서도 동등하게 전달될 수 있도록 해야 한다.
- L[1143–1143](../../upstream/krds/raw/components/component_04_11.html:1143): 가로 스크롤이 필요한 경우 단순한 동작으로 스크롤 위치를 조정할 수 있도록 한다.
- L[1144–1144](../../upstream/krds/raw/components/component_04_11.html:1144): 표 섹션이 스크롤되는 영역임을 인지할 수 있도록 가로 스크롤을 표시하고 버튼을 클릭하거나 탭하는 단순한 동작만으로도 스크롤 위치를 조정할 수 있도록 한다.

### 예시

- L[1164–1164](../../upstream/krds/raw/components/component_04_11.html:1164): 예시
- L[1168–1168](../../upstream/krds/raw/components/component_04_11.html:1168): 기본
- L[1213–1213](../../upstream/krds/raw/components/component_04_11.html:1213): 기본 코드 확인하기

### 마크업 가이드

- L[1234–1234](../../upstream/krds/raw/components/component_04_11.html:1234): 마크업 가이드
- L[1237–1237](../../upstream/krds/raw/components/component_04_11.html:1237): CSS 선택자
- L[1254–1257](../../upstream/krds/raw/components/component_04_11.html:1254): 전체영역 .krds-table-wrap
- L[1258–1261](../../upstream/krds/raw/components/component_04_11.html:1258): 테이블영역 .tbl
- L[1271–1271](../../upstream/krds/raw/components/component_04_11.html:1271): 개발 시 접근성 관련 주의 사항
- L[1273–1273](../../upstream/krds/raw/components/component_04_11.html:1273): 테이블에 th 속성이 있는경우 scope를 작성하여 테이블이 읽히는 방향을 정해주고 caption에 th 내용을 모두 넣어 설명해준다.

보존된 예시 마크업 인라인(참고용이며 공개 네이티브 API가 아님): L[1173–1207](../../upstream/krds/raw/components/component_04_11.html:1173)

CSS/JS/안내 이미지 출처 참조는 복사된 구현이 아닙니다. 표 행의 원본 HTML(필수/선택 열 보존)은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화한 발췌가 조건부 선택자를 필수로 재분류하지는 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 기록된 독립 결정: 호스트가 작성하는 caption은 목적과 모든 헤더의 의미를 자연어로 설명하고, 실제 열·행 헤더 연관을 유지해야 합니다. 텍스트를 줄이려고 th 레이블을 caption으로 대체하거나 헤더 설명을 생략하지 않습니다. 넓은 표의 문구는 네이티브 의미 완료와 별개로 사람의 편집 검토가 필요합니다.
- 외부 코드 예시는 참조만 하며 이번 준비에서 별도 파일로 삽입하거나 읽지 않았습니다: L1218 `../../code/table.html`, L1285 `./variable/table.html`. 보지 못한 내용은 추정하지 않습니다.
- 상세 페이지에 안내 이미지 참조가 5개 있으며, 그 안의 픽셀 도식은 눈으로 확인하지 않았습니다. 텍스트 구조와 지침만 읽었습니다. 정확한 시각 치수와 자산은 이후 시각·출처 검토가 필요합니다.
- 의미 인터페이스와 파트·상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작·스토리 소스, 독립 인수가 필요합니다.

## 수용된 독립 결정 {#accepted-independent-resolution}

호스트가 작성하는 caption은 목적과 모든 헤더의 의미를 자연어로 설명하고, 실제 열·행 헤더 연관을 유지해야 합니다. 텍스트를 줄이려고 th 레이블을 caption으로 대체하거나 헤더 설명을 생략하지 않습니다. 넓은 표의 문구는 네이티브 의미 완료와 별개로 사람의 편집 검토가 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `TableContract`입니다. 네이티브 프레임워크는 자체 콘텐츠·ref·이벤트 전달만 확장합니다. 공통 매니페스트가 지원 사례 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼로는 이 계약을 충족할 수 없습니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에 인용·파생된 공식 텍스트는 원래 KRDS 권리와 출처 표시를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며 여기 인용한 실질 요구사항을 면제하지 않습니다.
