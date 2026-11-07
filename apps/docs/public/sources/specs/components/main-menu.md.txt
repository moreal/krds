# 메인 메뉴 {#main-menu}

**계약 상태: 네이티브 구현용으로 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐이며, 네이티브 동작, 시각/자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `main-menu`, 한국어 이름 메인 메뉴, export `MainMenu`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_03_02](https://www.krds.go.kr/html/site/component/component_03_02.html), 보존된 [HTML](../../upstream/krds/raw/components/component_03_02.html). 조회 시각 `2026-10-29T23:28:02.921Z`, `132503` 바이트, SHA-256 `07d43ecd2faad3500071e6cc5427534d4e5a86c680e17dde4b1ab4a5f3475e14`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조해 확인했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 별개입니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류 `composition`, 수용된 프로젝트 완료 종류 `composition`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 케이스(변형·상태 축): `desktop-links`, `desktop-dropdown`, `desktop-described`, `mobile-simple`, `mobile-sections`, `mobile-drilldown`. 이는 네이티브 케이스 이름이며, 상태·반응형·외형 축이 곧 공식 명명 변형은 아닙니다. 공식 유형/예시 헤딩은 근거 부록에 그대로 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

이름 있는 `<nav aria-label="메인 메뉴">`가 제목/목록 계층을 담습니다. 말단 항목은 실제 링크입니다. 하위 항목을 펼치는 항목은 버튼이며, 꺾쇠와 현재/펼침 단서를 갖습니다. 데스크톱 드롭다운은 제목과 선택적 설명/유틸리티를 포함합니다. 모바일 레이어는 여는 버튼, 유틸리티, 섹션 탐색, 선택적 메뉴 내 검색, 상위 이동 버튼, 닫기 버튼을 포함합니다.

## 의미 API {#plain-semantic-api}

독립 API: `items` `{id,label,href?,description?,children?}[]`, `currentId`, `expandedId`/`defaultExpandedId`, `onExpandedChange({id})`, `mobileOpen`/`defaultMobileOpen`, `onMobileOpenChange({open})`, 검색을 제공할 때 로컬 `query`/`onQueryChange`. 노출하는 탐색 수준은 최대 3단계입니다. 더 깊은 드릴다운 데이터는 데스크톱 평탄화와 분리합니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/열림 상태를 정의하면 제어 모드, 없으면 비제어 모드입니다. 제어/기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청 하나를 내보냅니다. 비활성, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내보내지 않습니다. 제어 모드에서 거부되면 커밋된 UI/초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 그대로 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

**추가 랜드마크·트리거 식별:** `label`로 실제 내비게이션 랜드마크 이름을 줄 수 있습니다(기존 기본값 메인 메뉴는 그대로). `mobileTriggerId`/`mobileTriggerLabel`로 실제 기본 모바일 여는 버튼 하나의 ID와 이름을 줄 수 있습니다. 생략하면 기존 기본값을 유지합니다. 헤더(Header)가 조합하면 그 `navigationLabel`이 이 `label`에 대응하고, 공유 현재/모바일 상태는 같은 메뉴 인스턴스를 대상으로 합니다. Header가 기본 네이티브 트리거를 소유하면 어댑터가 그 실제 네이티브 컨트롤을 내부에서 연결하고, ID 중복 없이 중복 여는 버튼을 숨깁니다. 네이티브 콘텐츠 슬롯은 이 실제 메뉴의 전달 통로이며, 빈 두 번째 메뉴나 추가 내비게이션 래퍼를 렌더링해도 된다는 허가가 아닙니다. 일반 ID는 어댑터 네이티브 ref나 유효한 같은 루트 관계를 대체하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

클릭/Enter가 부모를 토글합니다. 호버만으로 열지 않습니다. Escape는 펼친 드롭다운을 모두 닫고 최상위 트리거로 초점을 옮깁니다. Tab은 계층 순서를 따릅니다. 공식 드롭다운 활성 단서 `aria-current=true`는 현재 말단의 `aria-current=page`와 구분합니다. `aria-expanded`/`controls`도 노출합니다. 닫힌 하위 항목은 초점/접근성 트리에서 제외합니다. 모바일 전체 화면 모달 레이어는 프로젝트 선택으로 검토된 모달(Modal)의 초점/격리 계약을 따르며, 말단 앵커는 브라우저 동작을 유지합니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

데스크톱 드롭다운의 최대 높이는 70vh이며 내부에서 스크롤합니다. 좁은 화면은 잘린 데스크톱 링크 대신 햄버거 레이어를 씁니다. 검색은 복잡한 메뉴에서 선택 사항이며 스토리에서는 로컬입니다. 레이아웃을 바꿀 때 초점 순서를 재배열하지 않습니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

탐색에는 폼 값/리셋이 없습니다. 선택적 검색은 IME를 보존하며, 조합 중 Enter로 탐색을 활성화하지 않습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

링크(Link), 버튼, 모바일 대화상자, 선택적 텍스트 입력 필드(TextInput), 유틸리티를 각 렌더러에서 네이티브로 조합합니다. 라우트 맵/현재 페이지, 인증/유틸리티, 검색 결정은 호스트가 맡습니다. 메뉴는 데이터를 가져오지 않으며 네이티브 링크 외에 히스토리를 바꾸지 않습니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, list, item, trigger, link, indicator, submenu, submenu-title, description, utilities, mobile-trigger, mobile-content, back, close, search; expanded/collapsed,current, mobile-open.

렌더링되는 모든 소유 파트는 `data-krds-component="main-menu"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 사용합니다. 네이티브/ARIA 상태가 기준입니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 말단 항목의 수정자 클릭/새 탭 열기가 실제 `href`로 동작합니다.
2. 부모는 클릭/Enter로 한 번 열리며 호버로는 열리지 않습니다.
3. Escape는 최상위 트리거로 초점을 돌려줍니다.
4. 숨겨진 링크는 초점을 받을 수 없습니다.
5. 70vh의 드롭다운은 스크롤 가능한 상태를 유지합니다.
6. 모바일 상위 이동은 이전 수준과 초점을 복원합니다.
7. 현재 경로 단서는 펼쳐진 그룹과 구별됩니다.

이는 앞으로 필요한 테스트이며, 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 단서, 움직임이 있는 곳의 동작 줄이기를 확인합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`main-menu--desktop-links`, `main-menu--desktop-dropdown`, `main-menu--desktop-described`, `main-menu--large-menu-overflow`, `main-menu--mobile-simple`, `main-menu--mobile-sections`, `main-menu--mobile-drilldown`, `main-menu--local-search`.

각 케이스는 해당되는 모든 네이티브 렌더러(Solid 1, React, Svelte, Vue, Lit, Qwik, Angular)에서 로컬 args/입력/슬롯과 관찰 가능한 순수 로컬 상태를 갖춰야 합니다. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 따로 준비하며, 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 인수되어야 합니다. 동작 스위트는 스토리 파일과 분리하며, 지원되는 upstream siheom 어댑터만 사용합니다. Lit/Solid 2는 siheom 지원을 만들어 내지 않고 선택한 네이티브 테스트 경로를 씁니다. Qwik은 첫 lazy 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 partial APF 소비를 테스트해야 합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증해야 합니다. Solid 2는 Solid 1 컴파일러/렌더러를 가져오지 않습니다. 다른 렌더러의 래퍼는 금지합니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 보존된 상세 HTML 원본에서 뽑았으며, 실질 지침과 상호작용/마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 원문 언어를 유지합니다. “고려/권장/가능” 같은 표현은 권고로 남습니다. 예시나 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원본 JS 함수 표는 참고 근거일 뿐이며, 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행하면 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립적 선택입니다.

### 구조

- L[886–886](../../upstream/krds/raw/components/component_03_02.html:886): 구조
- L[888–888](../../upstream/krds/raw/components/component_03_02.html:888): PC
- L[893–896](../../upstream/krds/raw/components/component_03_02.html:893): 1. 레이블 메뉴의 이름으로 하위 수준의 메뉴가 존재하지 않는 경우 링크로 작동하며 하위 수준이 존재하는 경우에는 버튼으로 작동함
- L[897–900](../../upstream/krds/raw/components/component_03_02.html:897): 2. 꺾쇠 아이콘 드롭다운 영역의 확장/축소 상태를 표시하는 아이콘
- L[901–904](../../upstream/krds/raw/components/component_03_02.html:901): 3. 활성화된 메뉴 식별자 드롭다운 영역이 확장된 메뉴의 변별성을 높이기 위한 시각적 단서
- L[905–908](../../upstream/krds/raw/components/component_03_02.html:905): 4. 드롭다운 영역 하위 수준의 메뉴가 제공되는 컨테이너
- L[909–912](../../upstream/krds/raw/components/component_03_02.html:909): 5. 제목 드롭다운 영역의 제목으로 최하위 수준 메뉴와 바로 연결된 요소가 제목으로 제공됨
- L[913–916](../../upstream/krds/raw/components/component_03_02.html:913): 6. 설명 레이블에 대한 이해를 돕기 위해 제공되는 간단한 설명 텍스트
- L[917–920](../../upstream/krds/raw/components/component_03_02.html:917): 7. 유틸리티 링크 활성화된 메뉴와 관련하여 사용자가 자주 찾은 페이지, 도움이 될 만한 정보 및 링크가 제공됨
- L[925–925](../../upstream/krds/raw/components/component_03_02.html:925): Mobile
- L[930–933](../../upstream/krds/raw/components/component_03_02.html:930): 1. 햄버거 아이콘 메뉴 레이어를 활성화하는 데 사용되는 아이콘 버튼
- L[934–937](../../upstream/krds/raw/components/component_03_02.html:934): 2. 유틸리티 링크 화면 크기 조정, 언어 선택, 로그인, 자주 사용하는 메뉴 등의 링크가 제공됨
- L[938–941](../../upstream/krds/raw/components/component_03_02.html:938): 3. 섹션 탐색 버튼 메뉴 섹션의 구성을 확인하고 탐색하는 데 사용되는 버튼. 정보 구조의 깊이에 따라 레이어 상단에 고정되거나 왼쪽에 고정하여 제공할 수 있음
- L[942–945](../../upstream/krds/raw/components/component_03_02.html:942): 4. 레이블 메뉴의 이름으로 링크로 작동함
- L[946–949](../../upstream/krds/raw/components/component_03_02.html:946): 5. 검색어 입력 필드와 검색 버튼 메뉴의 수가 많거나 정보 구조의 깊이가 깊은 경우 사용자의 메뉴 탐색을 돕기 위해 사용되는 부분 검색 기능
- L[950–953](../../upstream/krds/raw/components/component_03_02.html:950): 6. 상위 메뉴 이동 링크 현재 표시된 하위 수준 메뉴 링크 목록에서 벗어나 기본 메뉴 레이어로 돌아가는 데 사용되는 버튼

### 유형

- L[961–961](../../upstream/krds/raw/components/component_03_02.html:961): 유형
- L[964–964](../../upstream/krds/raw/components/component_03_02.html:964): PC
- L[967–967](../../upstream/krds/raw/components/component_03_02.html:967): 하위 수준의 메뉴가 존재하지 않는 경우에 사용한다.
- L[974–974](../../upstream/krds/raw/components/component_03_02.html:974): 2~3수준의 메뉴가 존재하는 경우에 사용한다.
- L[991–991](../../upstream/krds/raw/components/component_03_02.html:991): 메뉴 레이블이 어려운 용어 또는 사용자에게 익숙하지 않은 단어로 제공된 경우나 메뉴 레이블을 통해 화면에서 제공되는 콘텐츠를 파악하기 어려운 경우에 사용한다.
- L[1001–1001](../../upstream/krds/raw/components/component_03_02.html:1001): Mobile
- L[1004–1004](../../upstream/krds/raw/components/component_03_02.html:1004): 1~2수준의 메뉴로 구성된 경우에 사용한다.
- L[1011–1011](../../upstream/krds/raw/components/component_03_02.html:1011): 2수준 이상의 메뉴로 구성된 경우에 사용한다.
- L[1018–1018](../../upstream/krds/raw/components/component_03_02.html:1018): 사용자가 주로 특정 카테고리의 메뉴만 탐색하거나 3수준 이상의 정보 구조를 가진 경우에 사용한다. 사용자가 기본 화면에서 가장 하위 수준의 메뉴를 실행했을 때 해당 메뉴의 하위 수준 메뉴 목록만 볼 수 있는 화면으로 전환된다.

### 사용성 가이드라인

- L[1030–1030](../../upstream/krds/raw/components/component_03_02.html:1030): 사용성 가이드라인
- L[1033–1033](../../upstream/krds/raw/components/component_03_02.html:1033): 드롭다운 메뉴 영역 내에서 레이블은 좌측으로 정렬한다.
- L[1034–1034](../../upstream/krds/raw/components/component_03_02.html:1034): 드롭다운 메뉴 영역은 본문 그리드를 기준으로 가장 왼쪽부터 하위 수준의 링크 목록이 배치되도록 표현하여 사용자가 항상 일관된 위치에서 정보를 스캔할 수 있도록 해야 한다.
- L[1045–1045](../../upstream/krds/raw/components/component_03_02.html:1045): 드롭다운 영역의 최대 높이는 뷰포트의 70%를 초과하지 않도록 하고 최대 높이를 초과하는 경우에 스크롤이 생성되도록 제공한다.
- L[1046–1047](../../upstream/krds/raw/components/component_03_02.html:1046): 링크 목록의 수가 많아 뷰포트 높이의 70%를 넘어가는 경우 브라우저 기본 스크롤이 아니라 드롭다운 영역 스크롤을 통해 메뉴를 탐색할 수 있도록 해야 한다. 브라우저 기본 스크롤을 통해 메뉴를 탐색하는 경우, 1수준 링크 레이블을 클릭하거나 배경 마스크를 클릭하여 메뉴를 닫는 과정에서 많은 행동이 요구되며 메뉴를 닫았을 때 본문의 중간부터 콘텐츠를 탐색하게 되는 불편을 겪을 수 있다.
- L[1060–1060](../../upstream/krds/raw/components/component_03_02.html:1060): 링크의 활성화 상태, 선택 상태가 명확히 구분되도록 표현한다.
- L[1061–1061](../../upstream/krds/raw/components/component_03_02.html:1061): 현재 탐색 중인 페이지가 사이트 구조상 어디에 위치하는지를 알 수 있도록 활성화된 메뉴 링크를 명확하게 구분한다.
- L[1064–1064](../../upstream/krds/raw/components/component_03_02.html:1064): 드롭다운 영역에 제목을 제공한다.
- L[1065–1065](../../upstream/krds/raw/components/component_03_02.html:1065): 드롭다운 영역에 제목을 제공하여 어떤 메뉴 하위의 메뉴 목록을 탐색하고 있는지를 사용자가 직관적으로 인지할 수 있도록 한다. 사이드 메뉴에 메인 화면이 존재하는 경우 제목은 링크로 사용될 수 있다.
- L[1068–1068](../../upstream/krds/raw/components/component_03_02.html:1068): 링크의 개수를 최소화한다.
- L[1069–1069](../../upstream/krds/raw/components/component_03_02.html:1069): 반드시 필요한 링크만 제공하여 사용자가 빠르게 메뉴를 파악할 수 있게 만들고, 선택 과정에서의 혼동을 방지해야 한다.
- L[1072–1072](../../upstream/krds/raw/components/component_03_02.html:1072): 서비스 정보 구조를 적절하게 반영하여 메인 메뉴를 구성하고 최대 3수준의 메뉴를 사용한다.
- L[1073–1073](../../upstream/krds/raw/components/component_03_02.html:1073): 정보 구조가 깊고 복잡한 경우, 메인 메뉴가 지나치게 간결하게 제공되면 사용자는 메인 메뉴를 통해 원하는 정보에 접근하기 어렵다.
- L[1076–1076](../../upstream/krds/raw/components/component_03_02.html:1076): 링크명에 이해하기 쉬운 용어를 사용한다.
- L[1077–1077](../../upstream/krds/raw/components/component_03_02.html:1077): 링크명에 전문 용어 또는 일반적인 사람들에게 익숙하지 않은 용어를 사용할 경우, 의미를 이해하기 어려워 탐색에 많은 시간이 소요되거나 원하는 페이지를 발견하지 못할 수도 있다.
- L[1080–1080](../../upstream/krds/raw/components/component_03_02.html:1080): 링크는 우선순위에 따라 배치한다.
- L[1081–1081](../../upstream/krds/raw/components/component_03_02.html:1081): 이용 빈도가 높고 중요한 콘텐츠로 연결된 링크일수록 좌측에 배치하여 접근과 사용이 쉽게 만든다.
- L[1084–1084](../../upstream/krds/raw/components/component_03_02.html:1084): 마우스오버를 사용하여 드롭다운 목록을 확장하지 않는다.
- L[1085–1085](../../upstream/krds/raw/components/component_03_02.html:1085): 일부 사용자에게는 작은 메뉴 링크 영역에 일정 시간 동안 마우스의 위치를 고정하는 상호작용이 어려울 수 있고 터치 스크린에서는 마우스오버 인터랙션은 작동하지 않는다. 이러한 상황을 고려하여 드롭다운은 클릭 또는 키보드 탐색을 통해 확장되어야 한다.

### 플랫폼에 대한 고려 사항

- L[1093–1093](../../upstream/krds/raw/components/component_03_02.html:1093): 플랫폼에 대한 고려 사항
- L[1096–1096](../../upstream/krds/raw/components/component_03_02.html:1096): 화면 너비가 충분한 경우에는 1수준 메뉴 전체를 확인할 수 있도록 표현한다.
- L[1097–1097](../../upstream/krds/raw/components/component_03_02.html:1097): 모바일에서는 별도 페이지나 영역으로 메뉴를 숨기고 햄버거 아이콘을 눌러 메뉴를 확인할 수 있다.
- L[1110–1110](../../upstream/krds/raw/components/component_03_02.html:1110): 메뉴 탐색 기능을 제공한다.
- L[1111–1111](../../upstream/krds/raw/components/component_03_02.html:1111): 3수준의 메뉴의 수준을 사용할 때에는 메뉴 탐색 기능을 제공하여 빠른 정보 탐색이 가능하도록 할 수 있다.

### 접근성 가이드라인

- L[1233–1233](../../upstream/krds/raw/components/component_03_02.html:1233): 접근성 가이드라인
- L[1236–1236](../../upstream/krds/raw/components/component_03_02.html:1236): 메뉴의 컨테이너가 내비게이션 섹션임을 스크린 리더에서 인지할 수 있도록 한다.
- L[1237–1238](../../upstream/krds/raw/components/component_03_02.html:1237): 메뉴의 전체 컨테이너는 &lt;nav&gt;로 감싸거나 WAI-ARIA 영역을 role="navigation"으로 지정하여 스크린 리더에서 내비게이션 요소임을 인지할 수 있도록 제공해야 한다. 내비게이션 섹션에 aria-label="메인 메뉴"를 제공하면 스크린 리더 사용자는 메인 메뉴의 역할을 보다 명확하게 인지할 수 있다.
- L[1245–1245](../../upstream/krds/raw/components/component_03_02.html:1245): 메뉴 링크의 계층 구조를 표현한다.
- L[1246–1246](../../upstream/krds/raw/components/component_03_02.html:1246): 스크린 리더 사용자가 사이트의 정보 구조를 파악하는 데 도움을 줄 수 있도록 &lt;h2&gt;~&lt;h6&gt;, &lt;ul&gt;, &lt;li&gt; 태그를 활용하여 계층 구조로 정보를 제공해야 한다.
- L[1253–1253](../../upstream/krds/raw/components/component_03_02.html:1253): 활성화된 메뉴 정보가 스크린 리더로 전달될 수 있도록 한다.
- L[1254–1255](../../upstream/krds/raw/components/component_03_02.html:1254): 인디케이터가 시각적으로만 구분되는 것이 아니라 스크린 리더로도 전달될 수 있도록 WAI-ARIA aria current 속성을 제공한다. 드롭다운이 활성화된 상태에서는 aria-current="true"를, 현재 탐색 중인 페이지에 대한 링크인 경우 aria-current="page" 속성을 추가한다.
- L[1261–1261](../../upstream/krds/raw/components/component_03_02.html:1261): 메뉴 링크는 키보드로 탐색할 수 있도록 한다.
- L[1262–1262](../../upstream/krds/raw/components/component_03_02.html:1262): 메인 메뉴는 웹사이트의 주요 사이트로 접근할 수 있는 수단이므로 메뉴 링크는 반드시 키보드가 접근할 수 있도록 제공해야 한다. 사용자가 키보드를 이용하여 드롭다운을 실행하고 목록을 탐색할 수 있는지 점검해야 한다.
- L[1270–1270](../../upstream/krds/raw/components/component_03_02.html:1270): 키보드의 초점은 메뉴의 계층 순서대로 이동하도록 한다.
- L[1271–1271](../../upstream/krds/raw/components/component_03_02.html:1271): 키보드를 이용하여 메뉴를 탐색하는 경우, 키보드의 탐색 위치를 표시하는 초점이 메뉴의 계층 순서에 맞게 이동되도록 제공해야 한다. 문서에 메뉴의 계층 구조를 표현하지 않거나 임의로 키보드 초점의 이동 순서를 조작하면 보조 기술 사용자는 메뉴 탐색에 혼동을 느끼게 된다.

### 상호작용 가이드라인

- L[1283–1283](../../upstream/krds/raw/components/component_03_02.html:1283): 상호작용 가이드라인
- L[1285–1285](../../upstream/krds/raw/components/component_03_02.html:1285): 메뉴 영역 확장 및 축소
- L[1303–1306](../../upstream/krds/raw/components/component_03_02.html:1303): Click 메뉴 링크를 Click 하였을 때 하위 수준 메뉴가 펼쳐진다. 활성화된 1수준 메뉴를 다시 Click 하거나 헤더와 메인 영역을 벗어나는 화면영역을 Click 하였을 때 메뉴가 접힌다.
- L[1307–1310](../../upstream/krds/raw/components/component_03_02.html:1307): Enter 메뉴 링크가 초점을 가진 상태에서 Enter 키를 눌렀을 때 하위 수준 메뉴가 펼쳐진다. 활성화된 1수준 메뉴에서 다시 Enter 키를 눌렀을 때 드롭다운 메뉴가 접힌다
- L[1311–1314](../../upstream/krds/raw/components/component_03_02.html:1311): Esc 펼쳐진 드롭다운 메뉴가 모두 축소되며 펼쳐졌던 메뉴의 상위 수준에 속하는 1수준 메뉴로 초점이 이동한다.
- L[1321–1321](../../upstream/krds/raw/components/component_03_02.html:1321): 메뉴 링크 탐색
- L[1339–1342](../../upstream/krds/raw/components/component_03_02.html:1339): Tab 1수준 메뉴 링크에 순차적으로 접근한다.

### 예시

- L[1361–1361](../../upstream/krds/raw/components/component_03_02.html:1361): 예시
- L[1365–1365](../../upstream/krds/raw/components/component_03_02.html:1365): PC
- L[1480–1482](../../upstream/krds/raw/components/component_03_02.html:1480): 3Depth title
- L[1502–1504](../../upstream/krds/raw/components/component_03_02.html:1502): 3Depth title
- L[1581–1581](../../upstream/krds/raw/components/component_03_02.html:1581): PC 코드 확인하기
- L[1597–1597](../../upstream/krds/raw/components/component_03_02.html:1597): Mobile
- L[1709–1709](../../upstream/krds/raw/components/component_03_02.html:1709): 4Depth title
- L[1771–1771](../../upstream/krds/raw/components/component_03_02.html:1771): Mobile 코드 확인하기

### 마크업 가이드

- L[1829–1829](../../upstream/krds/raw/components/component_03_02.html:1829): 마크업 가이드
- L[1832–1832](../../upstream/krds/raw/components/component_03_02.html:1832): CSS 선택자 (PC)
- L[1853–1856](../../upstream/krds/raw/components/component_03_02.html:1853): 메인메뉴 전체영역 .krds-main-menu
- L[1857–1865](../../upstream/krds/raw/components/component_03_02.html:1857): 메인메뉴 1뎁스 버튼 .gnb-main-trigger 선택된 메뉴 .active [aria-expanded=true]
- L[1866–1869](../../upstream/krds/raw/components/component_03_02.html:1866): 링크 메뉴 .is-link
- L[1870–1875](../../upstream/krds/raw/components/component_03_02.html:1870): 메인메뉴 2뎁스 전체영역 .gnb-toggle-wrap 선택된 메뉴영역 .is-open
- L[1876–1884](../../upstream/krds/raw/components/component_03_02.html:1876): 메인메뉴 2뎁스 버튼 .gnb-sub-trigger 선택된 메뉴 .active [aria-expanded=true]
- L[1885–1892](../../upstream/krds/raw/components/component_03_02.html:1885): 메인메뉴 3뎁스 전체영역 .gnb-sub-list 선택된 메뉴영역 .active
- L[1893–1896](../../upstream/krds/raw/components/component_03_02.html:1893): 신규서비스 배너 우측 배치 .between
- L[1897–1902](../../upstream/krds/raw/components/component_03_02.html:1897): 메인메뉴 3뎁스 메뉴 .gnb-sub-content &gt; ul 메뉴 상세설명 있는경우 .type-description
- L[1912–1912](../../upstream/krds/raw/components/component_03_02.html:1912): CSS 선택자 (MOBILE)
- L[1933–1936](../../upstream/krds/raw/components/component_03_02.html:1933): 메인메뉴 전체영역 .krds-main-menu-mobile
- L[1937–1945](../../upstream/krds/raw/components/component_03_02.html:1937): 메인메뉴 1뎁스 버튼 .gnb-main-trigger 선택된 메뉴 .active [aria-selected=true]
- L[1946–1949](../../upstream/krds/raw/components/component_03_02.html:1946): 메인메뉴 2뎁스 전체영역 .submenu-wrap
- L[1950–1953](../../upstream/krds/raw/components/component_03_02.html:1950): 메인메뉴 2뎁스 버튼 .gnb-sub-trigger
- L[1954–1957](../../upstream/krds/raw/components/component_03_02.html:1954): 메인메뉴 3뎁스 전체영역 .depth3-wrap
- L[1958–1963](../../upstream/krds/raw/components/component_03_02.html:1958): 메인메뉴 3뎁스 메뉴 .depth3-trigger 4뎁스 있는경우 .has-depth4
- L[1964–1969](../../upstream/krds/raw/components/component_03_02.html:1964): 메인메뉴 4뎁스 메뉴영역 .depth4-wrap 선택된 영역 .is-open
- L[1979–1979](../../upstream/krds/raw/components/component_03_02.html:1979): JS (PC)
- L[1999–2003](../../upstream/krds/raw/components/component_03_02.html:1999): krds_mainMenuPC init() 초기화 및 주요 이벤트 실행
- L[2004–2007](../../upstream/krds/raw/components/component_03_02.html:2004): setupMainTrigger(mainTrigger) 1뎁스 메뉴 및 2뎁스 메뉴영역 기본 설정
- L[2008–2011](../../upstream/krds/raw/components/component_03_02.html:2008): setupSubTrigger(subTrigger) 2뎁스 메뉴 및 3뎁스 메뉴영역 기본 설정
- L[2012–2015](../../upstream/krds/raw/components/component_03_02.html:2012): toggleMainMenu(mainTrigger) 2뎁스 메뉴 토글 설정
- L[2016–2019](../../upstream/krds/raw/components/component_03_02.html:2016): toggleSubMenu(subTrigger) 3뎁스 메뉴 토글 설정
- L[2020–2023](../../upstream/krds/raw/components/component_03_02.html:2020): closeMainMenu() 메뉴 닫기
- L[2052–2052](../../upstream/krds/raw/components/component_03_02.html:2052): JS (MOBILE)
- L[2071–2075](../../upstream/krds/raw/components/component_03_02.html:2071): krds_mainMenuMobile init() 초기화 및 주요 이벤트 실행
- L[2076–2079](../../upstream/krds/raw/components/component_03_02.html:2076): openMainMenu(mobileGnb) 메뉴 열기
- L[2080–2083](../../upstream/krds/raw/components/component_03_02.html:2080): closeMainMenu(mobileGnb) 메뉴 닫기
- L[2084–2087](../../upstream/krds/raw/components/component_03_02.html:2084): setupAnchorScroll(mobileGnb) 스크롤 시 해당메뉴 활성화
- L[2116–2116](../../upstream/krds/raw/components/component_03_02.html:2116): 개발 시 접근성 관련 주의 사항
- L[2118–2118](../../upstream/krds/raw/components/component_03_02.html:2118): 키보드 탐색 시 초점이 순차적으로 이동하는지 확인한다.
- L[2119–2119](../../upstream/krds/raw/components/component_03_02.html:2119): 하위메뉴가 있는경우 하위메뉴 열림/닫힘을 wai-aria 속성 등으로 표편해주고 있는지 확인한다.

보존된 인라인 예시 마크업(참고용이며 공개 네이티브 API 아님): L[1370–1575](../../upstream/krds/raw/components/component_03_02.html:1370), L[1602–1765](../../upstream/krds/raw/components/component_03_02.html:1602)

CSS/JS/가이드 이미지에 대한 출처 참조는 복사된 구현이 아닙니다. 표 행의 원본 HTML(필수/선택 열 보존)은 [source-evidence.json](../../catalog/source-evidence.json)에 보관합니다. 위의 평탄화 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 공식 상호작용 표는 1수준 탐색에 Tab을 나열하지만 접근성은 계층적 접근을 요구합니다. 네이티브 목록 순회가 이를 해결하며, ARIA menubar 화살표 의미를 만들어 내지 않습니다.
- 연결된 외부 코드 예시는 참조만 했고 이번 준비에서 별도 파일로 포함·열람하지 않았습니다: L1586 `../../code/main_menu_pc.html`, L1776 `../../code/main_menu_mobile.html`, L2038 `../../../resources/js/examples/krds_mainMenuPC.js`, L2102 `../../../resources/js/examples/krds_mainMenuMobile.js`, L2133 `./variable/main_menu_pc.html`, L2144 `./variable/main_menu_mobile.html`. 보지 못한 내용은 추정하지 않습니다.
- 상세에는 가이드 이미지 참조가 15개 있으나, 포함된 픽셀 다이어그램은 시각 검사하지 않았습니다. 텍스트 구조와 지침만 읽었습니다. 정확한 시각 수치와 자산은 이후 시각/출처 검토가 필요합니다.
- 의미 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 자체 구현, 동작/스토리 소스, 독립 인수가 여전히 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `MainMenuContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트가 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크의 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 의무입니다.

공식 인용·파생 텍스트는 원래의 KRDS 권리와 출처 표기를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 출처 식별은 그대로입니다. 남은 근거 한계는 검사하지 못한 가이드 픽셀, 연결 코드, 자산 승인에 관한 것이며, 여기 인용한 실질 요구사항을 면제하지 않습니다.
