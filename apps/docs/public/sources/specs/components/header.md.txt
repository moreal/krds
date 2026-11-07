# 헤더 {#header}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐입니다. 네이티브 동작, 시각·자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `header`, 한국어 이름 헤더, export `Header`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_02_03](https://www.krds.go.kr/html/site/component/component_02_03.html), 보존본 [HTML](../../upstream/krds/raw/components/component_02_03.html). 수집 `2026-10-29T23:28:02.681Z`, `128284` 바이트, SHA-256 `09265da2efd4f428c0c55d0593d2e8554484769ef8b4b7d1e4e6f7b95557053e`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류는 `composition`, 수용된 프로젝트 완료 종류도 `composition`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 케이스(변형·상태 축)는 `vertical-actions`, `horizontal-actions`, `mobile-menu`, `sticky`입니다. 이는 네이티브 케이스 이름입니다. 상태·반응형·외형 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형·예시 헤딩 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

공식 상대 순서대로 구성합니다. 건너뛰기 링크(SkipLink)가 첫째, 이어서 공식 배너(Masthead), 서비스 정체성/홈 링크, 유틸리티 그룹(유틸리티 링크가 다섯 개 이상이면 드롭다운), 검색 동작, 메인 메뉴(MainMenu)입니다. 정부 로고는 왼쪽 위, 유틸리티는 오른쪽 위에 둡니다. 네이티브 <header>가 서비스 배너 랜드마크입니다. 문서에서 가장 먼저 오도록 건너뛰기 링크는 그 앞에 인접해 둘 수 있습니다.

## 의미 API {#plain-semantic-api}

독립 API입니다. Header는 home {href,label,logo}, utilityItems {id,label,href}, search {label,onRequest}, mainNavigation 의미 데이터, actionLayout vertical/horizontal(기본 horizontal), sticky=false를 받습니다. 불투명한 임의 컨테이너가 아니라 이름이 있는 명시적 컴포넌트 영역을 씁니다. 공개 데이터와 이벤트는 Ark/Zag 인스턴스를 노출하지 않습니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어와 기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 변경 요청 하나를 냅니다. 비활성, 무동작, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

**추가되는 네이티브 조합 입력:** currentId는 기존 실제 MainMenu에서 현재 경로를 선택적으로 표시합니다. mobileOpen/defaultMobileOpen/onMobileOpenChange({open})는 같은 메뉴의 모바일 펼침을 노출합니다. false를 포함해 mobileOpen이 정의되면 그 값이 우선하고, 아니면 기본값을 한 번 읽습니다(기존 기본값은 닫힘). 둘을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 사용자 동작이 수용되면 일반 요청 하나를 냅니다. 마운트, prop, 리셋은 요청을 내지 않습니다. 거부되면 확정된 실제 패널·초점 상태를 보존합니다. mobileTriggerId/mobileTriggerLabel은 실제 기본 모바일 트리거를 선택적으로 식별하고 이름 붙입니다. navigationLabel은 실제 MainMenu 랜드마크의 이름을 선택적으로 정하며 그 레이블로 전달됩니다. 생략하면 기존 기본값을 유지합니다. 네이티브 navigationContent/슬롯 전달로 같은 실제 네이티브 MainMenu 하나를 줄 수 있습니다. 이때 current/open/기본 트리거 정체성을 공유해야 하며, 빈 메뉴나 추가 내비게이션 래퍼를 만들면 안 됩니다. 전달하는 트리거 ID와 레이블은 비어 있지 않아야 하고 실제 컨트롤에 이름을 붙입니다. 이 의미 API에는 렌더러 객체가 들어가지 않습니다. T11은 주요 메뉴와 그 실제 트리거 ID를 명시적으로 전달합니다. 사이드바 이름은 기존 제목 예제 메뉴를 씁니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

링크 이동에는 네이티브 앵커를 씁니다. 유틸리티/메뉴 토글과 검색에는 이름 있는 버튼을 씁니다. 하위 MainMenu가 펼침/현재 상태와 모바일 레이어 초점을 맡습니다. 검색은 가짜 로컬 검색 서비스를 만들지 않고 onRequest를 한 번 요청합니다. 로고 링크 이름에는 중복되는 “logo”를 넣지 않습니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

메뉴가 더는 들어가지 않으면 바를 이름 있는 햄버거 열기 버튼과 키보드로 조작할 수 있는 메뉴 레이어로 바꿉니다. 고정(sticky) 동작은 선택입니다. 공식 배너는 고정 영역에서 제외합니다. 헤더가 두 줄을 넘으면 위로 스크롤할 때 나타나고 아래로 스크롤할 때 풀립니다. 네이티브 모바일 앱 전용 왼쪽 메뉴 제한·설정은 모바일 웹의 보편 의무가 아닙니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

Header 자체에는 폼 상태가 없습니다. 검색 폼은 호스트/검색 조합에 속하며 입력한 검색어와 IME 동작은 거기서 보존합니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

완료하려면 SkipLink, 공식 배너 표본, Link, MainMenu, 선택 LanguageSwitcher/Resize를 결정적 상태로 조합한 동작하는 로컬 구성이 필요합니다. 다른 렌더러에서 어댑터를 가져오지 않습니다. 인증, 검색 이동, 기관 로고, 유틸리티 목적지는 호스트가 책임집니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, identity, utilities, utility-trigger, actions, search, navigation, mobile-trigger; expanded/collapsed, sticky.

렌더링된 모든 소유 파트는 `data-krds-component="header"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 씁니다. 네이티브/ARIA 상태가 우선합니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. SkipLink 뒤에서 DOM·읽기·초점 순서가 정체성→유틸리티→검색→내비게이션을 따릅니다.
2. 유틸리티가 다섯 개 이상이어도 드롭다운에서 키보드로 접근할 수 있습니다.
3. 로고는 의미 있는 이름을 가진 홈 링크입니다.
4. 모바일 메뉴가 열리고 닫히며 초점을 복원합니다.
5. 고정 모드가 초점을 가진 컨트롤이나 고정 영역 안의 공식 배너를 가리지 않습니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색 외 상태 단서, 움직임이 있다면 동작 줄이기를 검증합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`header--horizontal-actions`, `header--vertical-actions`, `header--five-utilities`, `header--mobile-menu`, `header--sticky-long-page`, `header--translated-long-labels`.

각 케이스는 해당하는 모든 네이티브 렌더러에서 로컬 args/inputs/slots와 관찰 가능한 순수 로컬 상태가 필요합니다. 렌더러는 Solid 1, React, Svelte, Vue, Lit, Qwik, Angular이며 Solid 2 미리보기는 따로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 별도로 준비됩니다. 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 인수되어야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 상류 siheom 어댑터만 씁니다. Lit과 Solid 2는 siheom 지원을 지어내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름과 대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러/렌더러를 가져와서는 안 됩니다. 다른 프레임워크 렌더러 래퍼는 금지합니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 실제 보존 상세 HTML에서 추출했으며 핵심 지침과 상호작용·마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 출처 언어(한국어)를 그대로 둡니다. “고려/권장/수 있다” 같은 표현은 권고로 남습니다. 예시나 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 출처 JS 함수 표는 참고 근거일 뿐이며 원본 KRDS JS를 네이티브 제어 DOM에서 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 빼면 독립 선택입니다.



### 구조

- L[883–883](../../upstream/krds/raw/components/component_02_03.html:883): 구조
- L[889–892](../../upstream/krds/raw/components/component_02_03.html:889): 1. 건너뛰기 링크 마우스 대신 키보드를 주 입력 인터페이스로 활용하는 사용자를 위한 보조적인 정보 구조 탐색 수단
- L[893–896](../../upstream/krds/raw/components/component_02_03.html:893): 2. 공식 배너 대한민국 정부 조직 및 관련 기관에서 운영·관리하는 디지털 정부 서비스임을 식별할 수 있도록 제공하는 정보 배너
- L[897–900](../../upstream/krds/raw/components/component_02_03.html:897): 3. 서비스 아이덴티티 기관/서비스 로고 및 슬로건을 배치하여 디지털 서비스 운영 주체의 정체성을 전달함
- L[901–904](../../upstream/krds/raw/components/component_02_03.html:901): 4. 유틸리티 링크 그룹 서비스의 주요 탐색 도구와 다르게 부차적이지만 대부분의 화면에서 빈번하게 사용되는 기능이 제공되는 영역
- L[905–908](../../upstream/krds/raw/components/component_02_03.html:905): 5. 드롭다운 메뉴 유틸리티 링크가 5개 이상 필요할 때 사용됨
- L[909–912](../../upstream/krds/raw/components/component_02_03.html:909): 6. 아이콘 링크/버튼과 레이블 통합검색 레이어/화면을 실행하는 버튼을 포함하여 로그인, 회원가입, 개인 메뉴와 같이 서비스 이용에 핵심적인 기능을 실행하거나 화면으로 이동하는 아이콘 버튼 및 텍스트 레이블
- L[913–916](../../upstream/krds/raw/components/component_02_03.html:913): 7. 메인 메뉴 사이트를 일차적으로 탐색하기 위해 사용되는 탐색 인터페이스

### 유형

- L[924–924](../../upstream/krds/raw/components/component_02_03.html:924): 유형
- L[925–925](../../upstream/krds/raw/components/component_02_03.html:925): 헤더 유형은 아이콘 링크/버튼과 레이블 구조를 기준으로 나뉘며, 기관의 필요에 따라 적절한 방식으로 선택하여 적용할 수 있다.
- L[927–927](../../upstream/krds/raw/components/component_02_03.html:927): 세로형
- L[933–933](../../upstream/krds/raw/components/component_02_03.html:933): 가로형

### 사용성 가이드라인

- L[943–943](../../upstream/krds/raw/components/component_02_03.html:943): 사용성 가이드라인
- L[946–946](../../upstream/krds/raw/components/component_02_03.html:946): 헤더의 스타일 수정을 최소화한다.
- L[947–947](../../upstream/krds/raw/components/component_02_03.html:947): 헤더의 일관성을 유지하는 것은 정부 브랜드 인지도와 사용자 신뢰를 구축하는 데 필수적이다.
- L[950–950](../../upstream/krds/raw/components/component_02_03.html:950): 정부 로고는 항상 헤더의 왼쪽 상단에 제공한다.
- L[951–951](../../upstream/krds/raw/components/component_02_03.html:951): 정부 로고는 정부와의 연결을 강화하며, 디지털 서비스 전반에 걸쳐 일관된 경험을 제공할 수 있다.
- L[954–954](../../upstream/krds/raw/components/component_02_03.html:954): 헤더의 내부 컴포넌트를 일관된 순서로 배치한다.
- L[955–955](../../upstream/krds/raw/components/component_02_03.html:955): 헤더에서 건너뛰기 링크가 항상 가장 먼저 제공되어야 한다. 그 다음으로 서비스 아이덴티티, 유틸리티 그룹/드롭다운 메뉴, 검색 버튼, 메인 메뉴 순으로 컴포넌트 요소들 간 상대적인 순서가 일관성을 가지도록 배치한다.
- L[958–958](../../upstream/krds/raw/components/component_02_03.html:958): 핵심적인 정보만 간결하게 제공한다.
- L[959–959](../../upstream/krds/raw/components/component_02_03.html:959): 헤더에 포함되는 요소 중 필수적인 항목을 간결하게 배치해야 한다. 헤더에 불필요한 꾸밈이나 과다한 정보가 배치되면, 사용자가 모든 화면에서 이용에 어려움을 겪을 수 있다.
- L[962–962](../../upstream/krds/raw/components/component_02_03.html:962): 유틸리티 링크 그룹은 헤더 우측 상단에 제공한다.
- L[963–963](../../upstream/krds/raw/components/component_02_03.html:963): 헤더 우측 상단은 일반적으로 사용자들이 유틸리티 그룹을 발견할 수 있을 것으로 예측하는 공간이다.
- L[966–966](../../upstream/krds/raw/components/component_02_03.html:966): 유틸리티 링크 그룹을 디바이더로 구분하여 표현한다.
- L[967–967](../../upstream/krds/raw/components/component_02_03.html:967): 서로 관련되지 않은 링크가 시각적으로 명확하게 변별될 수 있도록 여러 가지 형태의 디바이더를 활용하여 구분해야 한다.
- L[970–970](../../upstream/krds/raw/components/component_02_03.html:970): 유틸리티 링크가 5개 이상 필요한 경우 드롭다운 메뉴를 사용한다.
- L[971–971](../../upstream/krds/raw/components/component_02_03.html:971): 유사한 목적을 가진 링크를 하나의 드롭다운 메뉴로 제공함으로써 사용자는 관련 있는 기능을 더 빠르게 인지할 수 있으며, 헤더를 간결하게 유지함으로써 보다 중요한 정보에 집중하는 데 도움이 된다.
- L[982–982](../../upstream/krds/raw/components/component_02_03.html:982): 언어 설정을 위한 드롭다운 메뉴에 국기를 사용하지 않는다.
- L[983–983](../../upstream/krds/raw/components/component_02_03.html:983): 한 국가 내에서도 다양한 언어가 사용될 수 있기 때문에 국기 대신 언어의 이름을 해당 언어로 제공해야 한다.
- L[986–986](../../upstream/krds/raw/components/component_02_03.html:986): 아이콘 버튼/링크에 텍스트 레이블을 제공한다.
- L[987–987](../../upstream/krds/raw/components/component_02_03.html:987): 아이콘에 표현된 정보가 명확하지 않거나 정보 해석에 많은 시간 소요되는 사용자는 아이콘만 제공되었을 때 컨트롤의 기능을 이해하지 못할 가능성이 높다. 검색, 로그인처럼 대부분의 사용자가 의미를 이해할 수 있고 아이콘이 간결한 경우에는 텍스트 레이블을 생략할 수 있다.
- L[994–994](../../upstream/krds/raw/components/component_02_03.html:994): 메인 메뉴와 검색의 위치는 웹사이트의 목적에 적합한 형태로 제공한다.
- L[995–995](../../upstream/krds/raw/components/component_02_03.html:995): 메인 메뉴의 길이와 검색의 복잡도, 이용 빈도에 따라 적절한 레이아웃의 메인 메뉴와 통합검색 버튼 스타일을 결정한다.
- L[1006–1006](../../upstream/krds/raw/components/component_02_03.html:1006): 화면을 스크롤 했을 때 헤더를 뷰포트 상단에 고정할 수 있다.
- L[1007–1007](../../upstream/krds/raw/components/component_02_03.html:1007): 헤더가 간결하게 구성되어 있다면 사용자가 긴 화면을 스크롤 하면서도 헤더에서 제공하는 탐색 및 유틸리티에 계속 접근 가능하도록 헤더를 고정하여 제공할 수 있다.
- L[1008–1009](../../upstream/krds/raw/components/component_02_03.html:1008): 만약 2행을 초과하는 헤더를 고정하고자 한다면, 사용자가 현재 화면에서의 과업에 집중할 수 있도록 사용자가 스크롤을 내릴 때에는 헤더를 고정하지 않는다. 스크롤을 올릴 때에는 헤더를 화면 상단에 고정하여 메인 화면으로 이동하거나 메뉴를 탐색하고자 하는 사용자의 행동을 도울 수 있다.
- L[1010–1010](../../upstream/krds/raw/components/component_02_03.html:1010): 헤더가 고정될 때에는 공식 배너를 제외한 전체 헤더가 고정되어야 한다.

### 플랫폼에 대한 고려 사항

- L[1022–1022](../../upstream/krds/raw/components/component_02_03.html:1022): 플랫폼에 대한 고려 사항
- L[1025–1025](../../upstream/krds/raw/components/component_02_03.html:1025): 화면 너비가 충분하지 않아 메인 메뉴를 표시할 수 없을 때 햄버거 메뉴 형태로 제공할 수 있다.
- L[1026–1026](../../upstream/krds/raw/components/component_02_03.html:1026): 작은 화면에서는 사용자가 본문 콘텐츠에 집중할 수 있도록 메인 메뉴 막대를 숨기고 햄버거 메뉴 버튼과 메뉴 레이어를 사용할 수 있다.
- L[1035–1035](../../upstream/krds/raw/components/component_02_03.html:1035): 최소한의 메뉴만 제공한다.
- L[1036–1036](../../upstream/krds/raw/components/component_02_03.html:1036): 모바일 앱에서의 헤더의 좌측에는 최대 3개 이하의 최소한의 메뉴만 제공한다.
- L[1050–1050](../../upstream/krds/raw/components/component_02_03.html:1050): 콘텐츠 페이지로 이동 시 좌측에 뒤로가기버튼을 제공한다.
- L[1051–1051](../../upstream/krds/raw/components/component_02_03.html:1051): 콘텐츠 페이지로 이동 시 좌측에 이전버튼을 제공하여 사용자에게 이전으로 이동할 수 있도록 한다.
- L[1060–1060](../../upstream/krds/raw/components/component_02_03.html:1060): 유틸리티 링크 그룹은 재배치한다.
- L[1061–1061](../../upstream/krds/raw/components/component_02_03.html:1061): 모바일 앱에서는 유틸리티 링크 그룹을 설정창을 통하여 제공한다.

### 접근성 가이드라인

- L[1168–1168](../../upstream/krds/raw/components/component_02_03.html:1168): 접근성 가이드라인
- L[1171–1171](../../upstream/krds/raw/components/component_02_03.html:1171): 건너뛰기 링크를 최상단에 배치한다.
- L[1172–1172](../../upstream/krds/raw/components/component_02_03.html:1172): 웹페이지의 반복되는 영역을 건너뛰어 본문 등의 주요 영역으로 이동하는 데 사용되는 건너뛰기 링크는 배너 영역 이전에 제공되어야 한다.
- L[1179–1179](../../upstream/krds/raw/components/component_02_03.html:1179): 로고 이미지에 대체 텍스트를 제공한다.
- L[1180–1180](../../upstream/krds/raw/components/component_02_03.html:1180): 이미지 로고를 사용하는 경우 스크린 리더를 위한 대체 텍스트를 제공해야 한다. 헤더의 로고는 메인 페이지로 이동하는 링크로 사용되므로 대체 텍스트에 '로고'라는 단어가 포함되지 않도록 유의해야 한다.

### 예시

- L[1199–1199](../../upstream/krds/raw/components/component_02_03.html:1199): 예시
- L[1203–1203](../../upstream/krds/raw/components/component_02_03.html:1203): 기본
- L[1413–1415](../../upstream/krds/raw/components/component_02_03.html:1413): 3Depth title
- L[1435–1437](../../upstream/krds/raw/components/component_02_03.html:1435): 3Depth title
- L[1613–1613](../../upstream/krds/raw/components/component_02_03.html:1613): 4Depth title
- L[1677–1677](../../upstream/krds/raw/components/component_02_03.html:1677): 기본 코드 확인하기

### 마크업 가이드

- L[1735–1735](../../upstream/krds/raw/components/component_02_03.html:1735): 마크업 가이드
- L[1738–1738](../../upstream/krds/raw/components/component_02_03.html:1738): CSS 선택자 (PC)
- L[1759–1762](../../upstream/krds/raw/components/component_02_03.html:1759): 헤더 전체영역 #krds-header
- L[1763–1766](../../upstream/krds/raw/components/component_02_03.html:1763): 유틸리티 영역 .header-utility
- L[1767–1770](../../upstream/krds/raw/components/component_02_03.html:1767): 로고 및 주요메뉴 .header-branding
- L[1771–1774](../../upstream/krds/raw/components/component_02_03.html:1771): 메인메뉴 전체영역 .krds-main-menu
- L[1775–1783](../../upstream/krds/raw/components/component_02_03.html:1775): 메인메뉴 1뎁스 버튼 .gnb-main-trigger 선택된 메뉴 .active [aria-expanded=true]
- L[1784–1787](../../upstream/krds/raw/components/component_02_03.html:1784): 링크 메뉴 .is-link
- L[1788–1793](../../upstream/krds/raw/components/component_02_03.html:1788): 메인메뉴 2뎁스 전체영역 .gnb-toggle-wrap 선택된 메뉴영역 .is-open
- L[1794–1802](../../upstream/krds/raw/components/component_02_03.html:1794): 메인메뉴 2뎁스 버튼 .gnb-sub-trigger 선택된 메뉴 .active [aria-expanded=true]
- L[1803–1810](../../upstream/krds/raw/components/component_02_03.html:1803): 메인메뉴 3뎁스 전체영역 .gnb-sub-list 선택된 메뉴영역 .active
- L[1811–1814](../../upstream/krds/raw/components/component_02_03.html:1811): 신규서비스 배너 우측 배치 .between
- L[1815–1820](../../upstream/krds/raw/components/component_02_03.html:1815): 메인메뉴 3뎁스 메뉴 .gnb-sub-content &gt; ul 메뉴 상세설명 있는경우 .type-description
- L[1830–1830](../../upstream/krds/raw/components/component_02_03.html:1830): CSS 선택자 (MOBILE)
- L[1851–1854](../../upstream/krds/raw/components/component_02_03.html:1851): 헤더 전체영역 #krds-header
- L[1855–1858](../../upstream/krds/raw/components/component_02_03.html:1855): 유틸리티 영역 .gnb-utils
- L[1859–1862](../../upstream/krds/raw/components/component_02_03.html:1859): 로고 및 주요메뉴 .header-branding
- L[1863–1866](../../upstream/krds/raw/components/component_02_03.html:1863): 메인메뉴 전체영역 .krds-main-menu-mobile
- L[1867–1875](../../upstream/krds/raw/components/component_02_03.html:1867): 메인메뉴 1뎁스 버튼 .gnb-main-trigger 선택된 메뉴 .active [aria-selected=true]
- L[1876–1879](../../upstream/krds/raw/components/component_02_03.html:1876): 메인메뉴 2뎁스 전체영역 .submenu-wrap
- L[1880–1883](../../upstream/krds/raw/components/component_02_03.html:1880): 메인메뉴 2뎁스 버튼 .gnb-sub-trigger
- L[1884–1887](../../upstream/krds/raw/components/component_02_03.html:1884): 메인메뉴 3뎁스 전체영역 .depth3-wrap
- L[1888–1893](../../upstream/krds/raw/components/component_02_03.html:1888): 메인메뉴 3뎁스 메뉴 .depth3-trigger 4뎁스 있는경우 .has-depth4
- L[1894–1899](../../upstream/krds/raw/components/component_02_03.html:1894): 메인메뉴 4뎁스 메뉴영역 .depth4-wrap 선택된 영역 .is-open
- L[1909–1909](../../upstream/krds/raw/components/component_02_03.html:1909): JS (PC)
- L[1929–1933](../../upstream/krds/raw/components/component_02_03.html:1929): krds_mainMenuPC init() 초기화 및 주요 이벤트 실행
- L[1934–1937](../../upstream/krds/raw/components/component_02_03.html:1934): setupMainTrigger(mainTrigger) 1뎁스 메뉴 및 2뎁스 메뉴영역 기본 설정
- L[1938–1941](../../upstream/krds/raw/components/component_02_03.html:1938): setupSubTrigger(subTrigger) 2뎁스 메뉴 및 3뎁스 메뉴영역 기본 설정
- L[1942–1945](../../upstream/krds/raw/components/component_02_03.html:1942): toggleMainMenu(mainTrigger) 2뎁스 메뉴 토글 설정
- L[1946–1949](../../upstream/krds/raw/components/component_02_03.html:1946): toggleSubMenu(subTrigger) 3뎁스 메뉴 토글 설정
- L[1950–1953](../../upstream/krds/raw/components/component_02_03.html:1950): closeMainMenu() 메뉴 닫기
- L[1982–1982](../../upstream/krds/raw/components/component_02_03.html:1982): JS (MOBILE)
- L[2001–2005](../../upstream/krds/raw/components/component_02_03.html:2001): krds_mainMenuMobile init() 초기화 및 주요 이벤트 실행
- L[2006–2009](../../upstream/krds/raw/components/component_02_03.html:2006): openMainMenu(mobileGnb) 메뉴 열기
- L[2010–2013](../../upstream/krds/raw/components/component_02_03.html:2010): closeMainMenu(mobileGnb) 메뉴 닫기
- L[2014–2017](../../upstream/krds/raw/components/component_02_03.html:2014): setupAnchorScroll(mobileGnb) 스크롤 시 해당메뉴 활성화

보존된 인라인 예시 마크업(참고용이며 공개 네이티브 API가 아님): L[1208–1671](../../upstream/krds/raw/components/component_02_03.html:1208)

CSS/JS/안내 이미지 출처 참조는 복사한 구현이 아닙니다. 표 행의 필수/선택 열을 보존한 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화된 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 기록된 독립 결정: 넓음/좁음 표현은 실제 컨테이너 레이아웃을 따릅니다. 라이브러리는 네이티브 앱 전용이라는 웹 예외를 추정하지 않습니다. 정체성 자산은 호스트가 제공합니다. 고정 Header는 공식 배너를 제외합니다. 좁은 픽스처는 360 CSS 픽셀, 넓은 픽스처는 1280을 씁니다.
- 연결된 외부 코드 예시는 참조만 하며 이 준비 단계에서 별도 파일로 포함하거나 읽지 않았습니다. L1682 `../../code/header.html`, L1968 `../../../resources/js/examples/krds_mainMenuPC.js`, L2032 `../../../resources/js/examples/krds_mainMenuMobile.js`. 보지 않은 내용을 추측하지 않습니다.
- 상세에는 안내 이미지 참조 13건이 있습니다. 내장 픽셀 도해는 시각적으로 검사하지 않았습니다. 텍스트 구조와 지침은 읽었습니다. 정확한 시각 치수·자산은 이후 시각·출처 검토가 필요합니다.
- 의미 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작/스토리 소스, 독립 인수가 필요합니다.

## 수용된 독립 결정 {#accepted-independent-resolution}

넓음/좁음 표현은 실제 컨테이너 레이아웃을 따릅니다. 라이브러리는 네이티브 앱 전용이라는 웹 예외를 추정하지 않습니다. 정체성 자산은 호스트가 제공합니다. 고정 Header는 공식 배너를 제외합니다. 좁은 픽스처는 360 CSS 픽셀, 넓은 픽스처는 1280을 씁니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `HeaderContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트는 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼로는 이 계약을 충족할 수 없습니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에 인용·파생된 공식 텍스트는 원래의 KRDS 권리와 출처 표시를 유지합니다. 독립 코드의 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 검사하지 않은 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며, 여기 인용한 실질 요구사항을 면제하지 않습니다.
