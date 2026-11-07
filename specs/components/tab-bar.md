# 탭바 {#tab-bar}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐입니다. 네이티브 동작, 시각·자산 검토, 실행된 커버리지는 별도 관문으로 남습니다. 게시는 승인되지 않았습니다.

시맨틱 ID `tab-bar`, 한국어 이름 탭바, export `TabBar`. 고정된 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세 페이지: [component_12_07](https://www.krds.go.kr/html/site/component/component_12_07.html), 보존본 [HTML](../../upstream/krds/raw/components/component_12_07.html). 조회 시각 `2026-10-29T23:28:06.337Z`, `69814` 바이트, SHA-256 `89a4830ba2601fe898f1dfc5afd31166c49ca6b76d55d10a78ab4faf76e6d378`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정된 출처 종류는 `component`이고, 수용된 프로젝트 완료 종류도 `component`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 사례(변형·상태 축): `three-items`, `five-items`, `with-badge`. 이는 네이티브 사례 이름입니다. 상태·반응형·외형 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형·예시 헤딩 원문은 근거 부록에 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

웹 <nav> 랜드마크에 크기가 같은 내비게이션 항목을 5개 이하로 두며, 각 항목은 아이콘과 짧은 레이블로 구성합니다. 현재 항목은 aria-current=page를 가지며 채운 아이콘과 윤곽 아이콘 또는 표시기로 구분합니다. 홈이 있으면 맨 앞(맨 왼쪽), 전체 메뉴가 있으면 맨 뒤(맨 오른쪽)에 둡니다. 선택적 Badge로 읽지 않음·새 항목 상태를 전달합니다.

## 의미 API {#plain-semantic-api}

독립 API: items {id,label,href,icon,currentIcon?,badge?}[], currentId, 선택적 마지막 항목 menuAction {label,onRequest}. 페이지 경로에는 실제 앵커를 쓰고, 이름 있는 버튼은 전체 메뉴를 여는 데만 씁니다. 이것은 내비게이션이며 role=tablist나 Tabs의 공통 상태 패널 API가 아닙니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어/기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 의미 변경 요청 하나를 냅니다. 비활성, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 0회 냅니다. 제어 거부 시 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고, 제어 props가 계속 우선합니다. 추가 필드는 렌더러·머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

링크는 네이티브 Tab/Shift+Tab과 Enter, 전체 메뉴의 네이티브 버튼은 Enter/Space를 씁니다. 방향키나 탭 패널 자동 활성화는 추정하지 않습니다. 현재 경로는 호스트가 제공하며, 수동적인 prop 변경은 선택 이벤트를 내지 않습니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

하단에 고정하며 스크롤해도 숨기지 않습니다. 호스트가 그에 맞는 콘텐츠 하단 패딩·safe-area inset을 더합니다. 더 깊은 화면에서의 생략은 경로 설계에 따를 때만 허용합니다. 번역을 포함해 레이블은 말줄임하지 않습니다. 너비가 충분하면 MainMenu를 씁니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼·리셋·IME 동작은 없습니다. 메뉴 버튼은 type=button입니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 경로 맵·현재 페이지, 전체 메뉴 레이어, 배지 출처를 소유합니다. 완료는 실제 로컬 페이지 이동과 전체 메뉴 조합을 포함합니다. 배지는 정적 메타데이터이며 원격 알림 요구는 없습니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, list, item, link, icon, label, indicator, badge, menu-trigger; current.

렌더링되는 모든 소유 파트는 `data-krds-component="tab-bar"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 기준입니다. 위 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 랜드마크와 실제 앵커가 탭이 아닌 페이지 내비게이션을 노출합니다.
2. 현재 페이지가 안내되며 색만으로 구분하지 않습니다.
3. 홈은 맨 앞, 전체 메뉴는 맨 뒤입니다.
4. 3/5개 항목이 같은 크기이고 번역 레이블이 온전합니다.
5. 고정 바가 스크롤해도 유지되고 콘텐츠를 가리지 않습니다.
6. 전체 메뉴는 닫을 때 초점을 돌려줍니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 단서, 움직임이 있다면 동작 줄이기를 검증합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`tab-bar--three-items`, `tab-bar--five-items`, `tab-bar--with-badge`, `tab-bar--all-menu`, `tab-bar--long-translated-label`, `tab-bar--scroll-page`.

각 사례는 해당하는 모든 네이티브 렌더러에서 로컬 args/입력/슬롯과 관찰 가능한 순수 로컬 상태가 필요합니다: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에서 따로 단계화하며, 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부를 인수해야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 씁니다. Lit과 Solid 2는 siheom 지원을 만들어 내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular의 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러·렌더러를 절대 import하지 않습니다. 다른 렌더러 래퍼는 없습니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 보존된 상세 HTML에서 가져왔으며 핵심 지침과 상호작용·마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 원문 언어를 유지합니다. “고려한다/권장/할 수 있다” 같은 표현은 권고로 남습니다. 예시·CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원본 JS 함수 표는 참고 근거일 뿐이며, 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행해서는 안 됩니다. 위의 공통 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립 선택입니다.

### 구조

- L[879–879](../../upstream/krds/raw/components/component_12_07.html:879): 구조
- L[885–885](../../upstream/krds/raw/components/component_12_07.html:885): 1. 컨테이너 메뉴 링크/버튼 목록을 담고 있는 영역으로 본문과의 구분을 위해 배경색, 구분선, 그림자 등을 사용할 수 있음
- L[886–886](../../upstream/krds/raw/components/component_12_07.html:886): 2. 아이콘 메뉴 이름이 나타내는 의미/개념을 시각적으로 표상화한 요소
- L[887–887](../../upstream/krds/raw/components/component_12_07.html:887): 3. 레이블 메뉴 이름을 보여주는 텍스트
- L[888–888](../../upstream/krds/raw/components/component_12_07.html:888): 4. 인디케이터(선택) 선택된 상태임을 알려주는 시각적인 식별자
- L[889–889](../../upstream/krds/raw/components/component_12_07.html:889): 5. 배지(선택) 표시된 메뉴에 새로운 정보가 제공되거나 사용자의 행동이 필요함을 보여줌

### 용례

- L[897–897](../../upstream/krds/raw/components/component_12_07.html:897): 용례
- L[899–899](../../upstream/krds/raw/components/component_12_07.html:899): 사용하기 적합한 경우
- L[901–901](../../upstream/krds/raw/components/component_12_07.html:901): 화면 너비가 좁은 경우
- L[902–902](../../upstream/krds/raw/components/component_12_07.html:902): 모바일, 태블릿과 같이 콘텐츠를 표시할 영역이 좁은 경우 탭바를 사용하여 주요 화면과 연결되는 직관적인 내비게이션을 제공할 수 있다.
- L[905–905](../../upstream/krds/raw/components/component_12_07.html:905): 적은 수의 상위 수준 화면에 빠르게 접근할 필요가 있는 경우
- L[906–906](../../upstream/krds/raw/components/component_12_07.html:906): 모바일 디바이스는 한 손에 디바이스를 쥐었을 때 엄지 손가락이 도달할 수 있는 범위가 한정되어 있으므로 하단에 고정된 탭바를 사용하면 보다 효율적으로 서비스의 정보 구조를 탐색할 수 있다.
- L[910–910](../../upstream/krds/raw/components/component_12_07.html:910): 사용하기 적합하지 않은 경우
- L[912–912](../../upstream/krds/raw/components/component_12_07.html:912): 화면 너비가 충분한 경우
- L[913–913](../../upstream/krds/raw/components/component_12_07.html:913): 메인 메뉴를 사용한다.

### 사용성 가이드라인

- L[921–921](../../upstream/krds/raw/components/component_12_07.html:921): 사용성 가이드라인
- L[924–924](../../upstream/krds/raw/components/component_12_07.html:924): 탭 메뉴의 크기를 동일하게 유지한다.
- L[925–925](../../upstream/krds/raw/components/component_12_07.html:925): 탭 바 내의 모든 메뉴는 동일한 너비와 높이를 가져야 한다. 이를 통해 사용자가 메뉴 간의 차이를 혼란 없이 인식하여 빠르고 쉽게 탭 메뉴를 선택할 수 있으며, 시각적으로 일관된 탐색 경험을 통해 사용자 경험이 향상된다.
- L[936–936](../../upstream/krds/raw/components/component_12_07.html:936): 선택된 메뉴 상태를 명확하게 표현한다.
- L[937–938](../../upstream/krds/raw/components/component_12_07.html:937): 아이콘의 형태나 별도 인디케이터를 사용하여 선택된 메뉴의 상태를 명확하게 구분해야 한다. 선택되지 않은 탭 메뉴의 아이콘은 라인 형식으로 표시하고, 선택된 탭 메뉴는 글리프 형식의 채워진 상태로 표현하여 시각적인 차이를 제공한다. 선택된 메뉴에 인디케이터를 제공하는 표현 방식도 활용할 수 있으며, 두 가지 방법을 사용하면 사용자에게 보다 명확하게 상태 정보를 전달할 수 있다.
- L[949–949](../../upstream/krds/raw/components/component_12_07.html:949): 모든 탭 버튼을 일관성있게 표현한다.
- L[950–951](../../upstream/krds/raw/components/component_12_07.html:950): 특정 버튼이 선택되지 않은 상태임에도 불구하고 아이콘이나 레이블 색상을 다른 버튼과는 다른 색으로 표현하게 되면 사용자에게 혼동을 줄 수 있다. 서비스 특성상 특정 버튼을 강조해야 할 필요가 있다면 해당 버튼의 아이콘 크기와 표현 방식을 다른 버튼과 명확하게 구분해야 한다. 그러나 강조된 버튼은 사용자의 주의를 끌어 다른 메뉴를 탐색하거나 조작하는 데 방해가 될 수 있으므로 사용을 지양하며, 불가피하게 사용하는 경우에도 일시적으로만 사용하는 것이 바람직하다.
- L[962–962](../../upstream/krds/raw/components/component_12_07.html:962): 탭 메뉴의 개수를 5개 이내로 제한한다.
- L[963–964](../../upstream/krds/raw/components/component_12_07.html:963): 탭 메뉴는 5개 이내로 제한하여 탐색의 효율성을 높인다. 5개 이상의 메뉴가 있으면 화면이 복잡해지며, 각 탭의 선택 영역이 줄어들어 사용자가 터치하기 어려워질 수 있다. 만약 더 많은 항목이 필요한 경우, 전체 메뉴나 더 보기 메뉴와 같은 부가적인 탐색 수단을 제공하고 탭바는 직관적이고 간결한 탐색이 가능하도록 구성해야 한다.
- L[975–975](../../upstream/krds/raw/components/component_12_07.html:975): 아이콘과 레이블을 함께 사용한다.
- L[976–977](../../upstream/krds/raw/components/component_12_07.html:976): 각 탭에는 아이콘과 레이블을 함께 제공하여 의미를 명확하게 전달해야 한다. 아이콘만 사용할 경우 의미가 모호할 수 있고, 레이블만 사용할 경우 시각적 주목도가 떨어질 수 있다. 따라서 두 정보 표현 방식의 문제점을 상호 보완하고 사용자에게 정확한 정보를 제공하기 위해, 레이블을 제공하고 레이블의 의미를 이해하는 데 도움을 줄 수 있는 간결한 아이콘을 제공한다.
- L[988–988](../../upstream/krds/raw/components/component_12_07.html:988): 레이블 텍스트를 간결하게 작성하여 잘리지 않도록 한다.
- L[989–990](../../upstream/krds/raw/components/component_12_07.html:989): 레이블 텍스트는 짧고 간결하게 작성해야 하며, 화면에서 잘리거나 말줄임표가 표시되지 않도록 한다. 각 레이블은 1~2 단어로 작성하되, 메뉴의 기능을 명확히 설명할 수 있어야 한다. 다양한 화면 크기와 해상도에서도 테스트를 거쳐 문제없이 표시되도록 하고, 다국어 지원 시 번역된 레이블도 잘리거나 축약되지 않도록 한다.
- L[1001–1001](../../upstream/krds/raw/components/component_12_07.html:1001): 탭바에 홈 버튼, 전체 버튼이 사용되는 경우 각각 가장 왼쪽, 가장 오른쪽 항목으로 배치한다.
- L[1002–1003](../../upstream/krds/raw/components/component_12_07.html:1002): 모든 디지털 정부서비스에서의 일관성 있는 탐색 제공을 위해 주요 탭 버튼은 항상 일관된 순서로 제공한다. 탭바 버튼 목록에 홈 버튼이 있다면 가장 왼쪽에 첫 번째 버튼으로 배치한다. 전체 메뉴를 포함하여 탭바에 표시되지 않은 더 많은 메뉴를 확인하는 데 사용되는 버튼은 가장 오른쪽에 마지막 버튼으로 배치한다.
- L[1016–1016](../../upstream/krds/raw/components/component_12_07.html:1016): 탭바는 화면 하단에 위치를 고정하여 제공하며, 스크롤 동작 시 숨겨지지 않도록 한다.
- L[1017–1017](../../upstream/krds/raw/components/component_12_07.html:1017): 탭바의 이용 목적과 탭바에 익숙하지 않은 사용자를 고려하여 탭바의 배치를 변경하거나 사용자의 행동에 반응하여 숨겨졌다 표시되지 않도록 한다. 정보 구조상 하위 수준에 속하는 뷰에 진입하였을 때 탭바가 제공되지 않는 것은 적절하며 이 항목을 준수하지 않는 것이 아니다.

### 접근성 가이드라인

- L[1129–1129](../../upstream/krds/raw/components/component_12_07.html:1129): 접근성 가이드라인
- L[1132–1132](../../upstream/krds/raw/components/component_12_07.html:1132): 탭바의 역할을 스크린 리더에서 인지할 수 있도록 한다.
- L[1133–1133](../../upstream/krds/raw/components/component_12_07.html:1133): 웹에서는 탭바 컨테이너를 &lt;nav&gt;로 감싸거나 WAI-ARIA 영역을 role="navigation"으로 지정하여 스크린 리더에서 내비게이션 요소임을 인지할 수 있도록 제공해야 한다.
- L[1134–1134](../../upstream/krds/raw/components/component_12_07.html:1134): 네이티브 애플리케이션은 각 운영체제에서 지원하는 내장 요소(예: iOS - Tab bars, Android - Navigation bar)를 사용하여 다른 요소와 역할이 구분되도록 한다.
- L[1141–1141](../../upstream/krds/raw/components/component_12_07.html:1141): 활성화된 메뉴 정보가 스크린 리더로 전달될 수 있도록 한다.
- L[1142–1142](../../upstream/krds/raw/components/component_12_07.html:1142): 웹에서는 활성화된 메뉴 버튼에 aria-current=”page” 속성을 추가하여, 스크린 리더로 활성화된 메뉴 정보를 전달한다.
- L[1143–1143](../../upstream/krds/raw/components/component_12_07.html:1143): 네이티브 애플리케이션의 경우, 각 운영체제에서 지원하는 내장 요소(예: iOS - Tab bars, Android - Navigation bar)를 사용하면 별도의 설정 없이도 선택된 메뉴 정보가 스크린 리더로 전달된다.

보존된 예시 마크업 인라인(참고용이며 공개 네이티브 API가 아님): 이 상세 페이지에는 인라인 예시 뷰 마크업이 없습니다.

CSS/JS/안내 이미지 출처 참조는 복사된 구현이 아닙니다. 표 행의 원본 HTML(필수/선택 열 보존)은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화한 발췌가 조건부 선택자를 필수로 재분류하지는 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 전용 공식 키보드 표는 없습니다. 중단점, safe-area 패딩, 전체 메뉴 대화상자 초점의 선택은 프로젝트의 네이티브 정책입니다.
- 상세 페이지에 안내 이미지 참조가 16개 있으며, 그 안의 픽셀 도식은 눈으로 확인하지 않았습니다. 텍스트 구조와 지침만 읽었습니다. 정확한 시각 치수와 자산은 이후 시각·출처 검토가 필요합니다.
- 의미 인터페이스와 파트·상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작·스토리 소스, 독립 인수가 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `TabBarContract`입니다. 네이티브 프레임워크는 자체 콘텐츠·ref·이벤트 전달만 확장합니다. 공통 매니페스트가 지원 사례 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼로는 이 계약을 충족할 수 없습니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에 인용·파생된 공식 텍스트는 원래 KRDS 권리와 출처 표시를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며 여기 인용한 실질 요구사항을 면제하지 않습니다.
