# 콘텐츠 내 탐색 {#in-page-navigation}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐입니다. 네이티브 동작, 시각·자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `in-page-navigation`, 한국어 이름 콘텐츠 내 탐색, export `InPageNavigation`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_03_05](https://www.krds.go.kr/html/site/component/component_03_05.html), 보존본 [HTML](../../upstream/krds/raw/components/component_03_05.html). 수집 `2026-10-29T23:28:03.138Z`, `80770` 바이트, SHA-256 `7de4b0ef8b8d310581242e20cf5714c2de62dd2410bf46d1e6984fd90d7124fc`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류는 `composition`, 수용된 프로젝트 완료 종류도 `composition`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 케이스(변형·상태 축)는 `desktop-side`, `mobile-inline`, `mobile-disclosure`입니다. 이는 네이티브 케이스 이름입니다. 상태·반응형·외형 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형·예시 헤딩 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

구성은 개요 제목(h1 아님), 같은 문서 섹션 링크의 중첩 목록, 활성 섹션 표시입니다. 데스크톱 CSS가 오른쪽에 두더라도 마크업은 페이지 제목과 본문 사이에 둡니다. 링크 레이블은 대상 헤딩과 일치해야 합니다. 단계는 최대 세 개이며 보통 한 개를 씁니다.

## 의미 API {#plain-semantic-api}

독립 API입니다. sections {id,label,children?}[], title="이 페이지의 구성", activeId/onActiveChange({id,reason}), 선택적 접이식 좁은 화면 모드를 씁니다. 실제 앵커가 등록된 섹션을 가리킵니다. 활성 상태는 링크 활성화와 무관하게 스크롤 관찰을 따릅니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어와 기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 변경 요청 하나를 냅니다. 비활성, 무동작, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

Tab/Shift+Tab으로 링크를 순회합니다. Enter와 공식 Space 동작은 대상 헤딩/섹션으로 스크롤하고 초점을 옮깁니다. 마우스 클릭은 스크롤하되 초점은 링크에 남습니다. Space의 페이지 스크롤 방지는 개요 링크 활성화에서만 하고, 조합 입력은 무시합니다. 스크롤 관찰자의 패시브 갱신으로는 초점을 옮기지 않습니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

데스크톱에서는 오른쪽에 배치합니다. 좁은 화면에서는 개요가 제목과 본문 사이에 고정되지 않은 채 놓이며, 길면 선택적으로 Disclosure를 씁니다. 고정 헤더 오프셋과 동작 줄이기를 고려합니다. 무한 스크롤 개요는 없습니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼 값과 리셋은 없습니다. 키보드 처리가 조합(composing) 이벤트를 받을 때만 IME를 고려한 키 필터링을 합니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 일치하는 안정적인 섹션 헤딩/대상을 제공하며 섹션을 제거할 수도 있습니다. 언마운트·라우트 변경 시 관찰자를 정리하고, 오래된 대상에 초점을 두지 않고 활성 상태를 갱신합니다. 완료하려면 실제 목적지가 있는 긴 페이지가 필요합니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, header, title, list, item, link, indicator, disclosure-trigger; active,expanded/collapsed.

렌더링된 모든 소유 파트는 `data-krds-component="in-page-navigation"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 씁니다. 네이티브/ARIA 상태가 우선합니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 데스크톱의 시각 위치가 오른쪽이어도 DOM 개요가 본문보다 앞에 옵니다.
2. 키보드 Enter/Space가 대상에 초점을 두고 다음 Tab이 그 안으로 들어갑니다.
3. 포인터 이동은 링크 초점을 보존합니다.
4. 패시브 스크롤은 표시기만 갱신합니다.
5. 제거된 대상에는 오래된 관찰자나 초점 시도가 없습니다.
6. 좁은 화면의 개요는 인라인이며 접근 가능합니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색 외 상태 단서, 움직임이 있다면 동작 줄이기를 검증합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 독립 로컬 표본 정책 {#independent-local-specimen-policy}

독립 접힘 모바일 disclosure 표본은 실제 컨트롤 이름을 “구성 펼치기”로 정합니다. 펼친 뒤 동작은 “구성 접기”입니다. 내비게이션은 전달받은 개요 제목을 유지합니다. 이 문구는 로컬 표본 정책이며 공식 필수 리터럴이 아닙니다.

## 필수 네이티브 스토리 {#required-native-stories}

`in-page-navigation--desktop-side`, `in-page-navigation--mobile-inline`, `in-page-navigation--mobile-disclosure`, `in-page-navigation--three-level-outline`, `in-page-navigation--sticky-offset`, `in-page-navigation--removed-section`.

각 케이스는 해당하는 모든 네이티브 렌더러에서 로컬 args/inputs/slots와 관찰 가능한 순수 로컬 상태가 필요합니다. 렌더러는 Solid 1, React, Svelte, Vue, Lit, Qwik, Angular이며 Solid 2 미리보기는 따로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 별도로 준비됩니다. 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 인수되어야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 상류 siheom 어댑터만 씁니다. Lit과 Solid 2는 siheom 지원을 지어내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름과 대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러/렌더러를 가져와서는 안 됩니다. 다른 프레임워크 렌더러 래퍼는 금지합니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 실제 보존 상세 HTML에서 추출했으며 핵심 지침과 상호작용·마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 출처 언어(한국어)를 그대로 둡니다. “고려/권장/수 있다” 같은 표현은 권고로 남습니다. 예시나 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 출처 JS 함수 표는 참고 근거일 뿐이며 원본 KRDS JS를 네이티브 제어 DOM에서 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 빼면 독립 선택입니다.

### 구조

- L[883–883](../../upstream/krds/raw/components/component_03_05.html:883): 구조
- L[889–892](../../upstream/krds/raw/components/component_03_05.html:889): 1. 제목 콘텐츠 내 탐색 목록의 제목. '이 페이지의 구성', '목차'와 같은 설명적인 제목을 제공하여 콘텐츠 내 탐색의 기능에 대한 사용자의 이해도를 높일 수 있음
- L[893–896](../../upstream/krds/raw/components/component_03_05.html:893): 2. 개요 목록 본문을 구성하는 콘텐츠의 섹션 제목을 보여주는 링크 목록. 클릭하면 해당 콘텐츠 섹션으로 빠르게 이동할 수 있음
- L[897–900](../../upstream/krds/raw/components/component_03_05.html:897): 3. 활성화 상태 인디케이터 탐색 중인 콘텐츠 섹션을 알려주는 시각적 표시기. 사용자가 특정 콘텐츠 섹션에 위치할 때 인디케이터가 활성화됨

### 용례

- L[908–908](../../upstream/krds/raw/components/component_03_05.html:908): 용례
- L[910–910](../../upstream/krds/raw/components/component_03_05.html:910): 사용하기 적합한 경우
- L[915–915](../../upstream/krds/raw/components/component_03_05.html:915): 콘텐츠 내 탐색은 세 개 이상의 개별 콘텐츠 섹션 또는 세 개 이상의 뷰포트 높이를 초과하는 콘텐츠가 포함된 본문의 탐색에 사용하기 적합하다.
- L[912–917](../../upstream/krds/raw/components/component_03_05.html:912): 구조화된 콘텐츠이며 화면이 길 때 콘텐츠 내 탐색은 세 개 이상의 개별 콘텐츠 섹션 또는 세 개 이상의 뷰포트 높이를 초과하는 콘텐츠가 포함된 본문의 탐색에 사용하기 적합하다.
- L[921–921](../../upstream/krds/raw/components/component_03_05.html:921): 사용하기 적합하지 않은 경우
- L[926–926](../../upstream/krds/raw/components/component_03_05.html:926): 스크롤 동작이 거의 필요하지 않은 화면의 경우 콘텐츠 내 탐색이 제공되지 않아도 된다.
- L[923–928](../../upstream/krds/raw/components/component_03_05.html:923): 화면 길이가 짧을 때 스크롤 동작이 거의 필요하지 않은 화면의 경우 콘텐츠 내 탐색이 제공되지 않아도 된다.
- L[932–932](../../upstream/krds/raw/components/component_03_05.html:932): 계층 구조가 없는 본문에는 콘텐츠 내 탐색 요소를 사용할 수 없다.
- L[929–934](../../upstream/krds/raw/components/component_03_05.html:929): 콘텐츠가 구조화되지 않았을 때 계층 구조가 없는 본문에는 콘텐츠 내 탐색 요소를 사용할 수 없다.
- L[938–938](../../upstream/krds/raw/components/component_03_05.html:938): 무한 스크롤 기능이 있는 페이지의 경우 콘텐츠 내 탐색은 구현할 수 없으며 실용성이 없다.
- L[935–940](../../upstream/krds/raw/components/component_03_05.html:935): 무한 스크롤 기능을 사용할 때 무한 스크롤 기능이 있는 페이지의 경우 콘텐츠 내 탐색은 구현할 수 없으며 실용성이 없다.
- L[944–944](../../upstream/krds/raw/components/component_03_05.html:944): 사이드 메뉴 등의 서브 메뉴를 사용하는 것이 적절하다.
- L[941–946](../../upstream/krds/raw/components/component_03_05.html:941): 서비스의 정보 구조를 탐색할 때 사이드 메뉴 등의 서브 메뉴를 사용하는 것이 적절하다.
- L[950–950](../../upstream/krds/raw/components/component_03_05.html:950): 콘텐츠에 대한 필터 목록을 표시하는 데 콘텐츠 내 탐색을 사용하지 않는다.
- L[947–952](../../upstream/krds/raw/components/component_03_05.html:947): 필터 목록을 표시할 때 콘텐츠에 대한 필터 목록을 표시하는 데 콘텐츠 내 탐색을 사용하지 않는다.

### 사용성 가이드라인

- L[960–960](../../upstream/krds/raw/components/component_03_05.html:960): 사용성 가이드라인
- L[963–963](../../upstream/krds/raw/components/component_03_05.html:963): 적절한 너비로 표현한다.
- L[964–964](../../upstream/krds/raw/components/component_03_05.html:964): 콘텐츠 내 탐색 구성 요소의 너비는 충분히 넓어야 한다. 텍스트 길이에 따라 줄바꿈이 발생하지 않는 일관된 너비로 정의하여 버튼이나 다른 컨트롤과 혼동되지 않도록 한다.
- L[967–967](../../upstream/krds/raw/components/component_03_05.html:967): 콘텐츠 내 탐색은 본문 우측에 표시한다.
- L[968–968](../../upstream/krds/raw/components/component_03_05.html:968): 콘텐츠 내 탐색은 사용자의 자연스러운 읽기 순서를 고려하여 본문 다음에 배치한다. 한글과 같이 왼쪽에서 오른쪽으로 읽는 언어로 구성된 페이지에서 페이지 내 탐색은 기본 콘텐츠의 오른쪽에 배치하는 것이 적절하다.
- L[971–971](../../upstream/krds/raw/components/component_03_05.html:971): 개요 목록 텍스트는 연결된 섹션 제목과 일치하는 내용으로 제공한다.
- L[972–972](../../upstream/krds/raw/components/component_03_05.html:972): 콘텐츠 내 탐색에 표시되는 링크의 텍스트는 해당 콘텐츠 섹션의 제목 텍스트와 일치해야 한다.
- L[975–975](../../upstream/krds/raw/components/component_03_05.html:975): 목록 수준은 최대 3단계까지 사용한다.
- L[976–976](../../upstream/krds/raw/components/component_03_05.html:976): 탐색의 깊이를 지나치게 세부적으로 구분하게 되면 콘텐츠 내 탐색을 통해 본문의 구조를 빠르게 파악하기 어렵다. 가능한 한 1단계 수준으로 구성하되 수준 표현이 필요한 경우 최대 3단계까지만 사용해야 한다.

### 플랫폼에 대한 고려 사항

- L[984–984](../../upstream/krds/raw/components/component_03_05.html:984): 플랫폼에 대한 고려 사항
- L[987–987](../../upstream/krds/raw/components/component_03_05.html:987): 모바일에서 콘텐츠 내 탐색은 제목과 본문 사이에 배치한다.
- L[988–988](../../upstream/krds/raw/components/component_03_05.html:988): 화면 너비가 충분하지 않을 때, 콘텐츠 내 탐색은 특정 위치에 고정하지 않고 제목과 본문 사이에 배치한다. 본문의 구조가 복잡하여 콘텐츠 내 탐색 링크 목록의 길이가 길어질 경우, 디스클로저와 같은 확장 가능한 섹션으로 페이지 내 탐색을 제공할 수 있다.

### 접근성 가이드라인

- L[1094–1094](../../upstream/krds/raw/components/component_03_05.html:1094): 접근성 가이드라인
- L[1097–1097](../../upstream/krds/raw/components/component_03_05.html:1097): 키보드로 접근과 조작이 가능하도록 한다.
- L[1098–1098](../../upstream/krds/raw/components/component_03_05.html:1098): 사용자는 Tab 키를 사용하여 항목 사이를 탐색할 수 있어야 하며, 키보드에서 Enter 키를 누르면 링크의 동작을 실행할 수 있어야 한다. 사용자는 마우스와 키보드 모두로 호버 및 포커스 상태를 활성화할 수 있어야 한다.
- L[1105–1105](../../upstream/krds/raw/components/component_03_05.html:1105): 콘텐츠 내 탐색은 제목과 본문 사이에 배치한다.
- L[1106–1106](../../upstream/krds/raw/components/component_03_05.html:1106): 콘텐츠 내 탐색을 통해 본문의 구조를 파악하고 원하는 정보가 있는 섹션에 바로 접근할 수 있도록 본문 전에 콘텐츠 내 탐색이 마크업되어야 한다.
- L[1114–1114](../../upstream/krds/raw/components/component_03_05.html:1114): 키보드로 콘텐츠 내 탐색 링크를 실행하였을 때 화면과 함께 키보드 초점이 해당 섹션으로 이동되도록 한다.
- L[1115–1115](../../upstream/krds/raw/components/component_03_05.html:1115): 키보드 사용자가 Enter 키를 눌러 링크를 실행하였을 때, 해당 섹션으로 초점이 이동되어야 한다. 마우스 사용자가 콘텐츠 내 탐색 목록 링크를 실행한 경우 초점은 선택한 링크에 유지되어야 한다.
- L[1122–1122](../../upstream/krds/raw/components/component_03_05.html:1122): 링크 목록에 &lt;h1&gt;을 사용하지 않는다.
- L[1123–1123](../../upstream/krds/raw/components/component_03_05.html:1123): 각 화면에는 해당 화면에서 전달하고자 하는 핵심 콘텐츠를 대표하는 제목이 &lt;h1&gt;으로 제공된다. 콘텐츠 내 탐색에 &lt;h1&gt; 태그를 사용하는 경우 중복될 수 있다.

### 상호작용 가이드라인

- L[1135–1135](../../upstream/krds/raw/components/component_03_05.html:1135): 상호작용 가이드라인
- L[1137–1137](../../upstream/krds/raw/components/component_03_05.html:1137): 목록 탐색
- L[1155–1158](../../upstream/krds/raw/components/component_03_05.html:1155): Tab, Shift + tab 콘텐츠 내 탐색 링크를 순차적으로 탐색한다.
- L[1165–1165](../../upstream/krds/raw/components/component_03_05.html:1165): 콘텐츠 섹션 이동
- L[1183–1186](../../upstream/krds/raw/components/component_03_05.html:1183): Click 링크를 Click 하면 해당 콘텐츠 섹션으로 화면이 스크롤된다.
- L[1187–1190](../../upstream/krds/raw/components/component_03_05.html:1187): Enter, Space 목록 링크가 초점을 가진 상태에서 Enter 또는 Space 키를 누르면 해당 콘텐츠 섹션으로 화면이 스크롤되며 콘텐츠 섹션의 제목 또는 콘텐츠 섹션 자체로 초점이 이동한다.

### 예시

- L[1208–1208](../../upstream/krds/raw/components/component_03_05.html:1208): 예시
- L[1212–1212](../../upstream/krds/raw/components/component_03_05.html:1212): 기본
- L[1253–1253](../../upstream/krds/raw/components/component_03_05.html:1253): 기본 코드 확인하기

### 마크업 가이드

- L[1316–1316](../../upstream/krds/raw/components/component_03_05.html:1316): 마크업 가이드
- L[1319–1319](../../upstream/krds/raw/components/component_03_05.html:1319): CSS 선택자
- L[1339–1342](../../upstream/krds/raw/components/component_03_05.html:1339): 전체영역 .krds-in-page-navigation-type
- L[1343–1346](../../upstream/krds/raw/components/component_03_05.html:1343): 탐색영역 .krds-in-page-navigation-area
- L[1347–1350](../../upstream/krds/raw/components/component_03_05.html:1347): 탐색영역 제목 .in-page-navigation-header
- L[1351–1356](../../upstream/krds/raw/components/component_03_05.html:1351): 탐색영역 목록 .in-page-navigation-list 활성화 상태 li.active
- L[1357–1360](../../upstream/krds/raw/components/component_03_05.html:1357): 탐색영역 하단 .in-page-navigation-action
- L[1370–1370](../../upstream/krds/raw/components/component_03_05.html:1370): JS
- L[1389–1393](../../upstream/krds/raw/components/component_03_05.html:1389): krds_inPageNavigation init() 초기화 및 주요 이벤트 실행
- L[1394–1397](../../upstream/krds/raw/components/component_03_05.html:1394): setupAnchorScroll() 탐색영역 목록 동작 설정
- L[1398–1401](../../upstream/krds/raw/components/component_03_05.html:1398): updateActiveSection() 활성화된 목록 업데이트
- L[1429–1429](../../upstream/krds/raw/components/component_03_05.html:1429): 개발 시 접근성 관련 주의 사항
- L[1431–1431](../../upstream/krds/raw/components/component_03_05.html:1431): 키보드 탐색 시 초점이 순차적으로 이동하는지 확인한다.
- L[1432–1432](../../upstream/krds/raw/components/component_03_05.html:1432): 해당 컴포넌트가 본문 영역 이전에 위치하는지 확인한다.

보존된 인라인 예시 마크업(참고용이며 공개 네이티브 API가 아님): L[1217–1247](../../upstream/krds/raw/components/component_03_05.html:1217)

CSS/JS/안내 이미지 출처 참조는 복사한 구현이 아닙니다. 표 행의 필수/선택 열을 보존한 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화된 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 공식 데스크톱 설명은 콘텐츠 뒤의 자연스러운 읽기 순서를 말하지만, 접근성 항목은 마크업을 본문 앞에 두라고 명시합니다. 명시된 접근성 순서를 따르고 이 출처 내 긴장을 표시합니다.
- 연결된 외부 코드 예시는 참조만 하며 이 준비 단계에서 별도 파일로 포함하거나 읽지 않았습니다. L1258 `../../code/in_page_navigation.html`, L1416 `../../../resources/js/examples/krds_inPageNavigation.js`, L1444 `./variable/in_page_navigation.html`. 보지 않은 내용을 추측하지 않습니다.
- 상세에는 안내 이미지 참조 1건이 있습니다. 내장 픽셀 도해는 시각적으로 검사하지 않았습니다. 텍스트 구조와 지침은 읽었습니다. 정확한 시각 치수·자산은 이후 시각·출처 검토가 필요합니다.
- 의미 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작/스토리 소스, 독립 인수가 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `InPageNavigationContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트는 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼로는 이 계약을 충족할 수 없습니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에 인용·파생된 공식 텍스트는 원래의 KRDS 권리와 출처 표시를 유지합니다. 독립 코드의 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 검사하지 않은 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며, 여기 인용한 실질 요구사항을 면제하지 않습니다.
