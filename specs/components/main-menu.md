# MainMenu

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `main-menu`; Korean name 메인 메뉴; export `MainMenu`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_03_02](https://www.krds.go.kr/html/site/component/component_03_02.html); preserved [HTML](../../upstream/krds/raw/components/component_03_02.html). Retrieved `2026-10-29T23:28:02.921Z`; `132503` bytes; SHA-256 `07d43ecd2faad3500071e6cc5427534d4e5a86c680e17dde4b1ab4a5f3475e14`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `composition`; accepted project completion kind `composition`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `desktop-links`, `desktop-dropdown`, `desktop-described`, `mobile-simple`, `mobile-sections`, `mobile-drilldown`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Named <nav aria-label="메인 메뉴"> containing heading/list hierarchy. Leaf items are real links; items that reveal descendants are buttons, with chevron and current/expanded cues. Desktop dropdown includes a title, optional description/utilities. Mobile layer includes opener, utilities, section navigation, optional local menu-search, drill-back and close controls.

## Plain semantic API

Independent API: items {id,label,href?,description?,children?}[] with currentId, expandedId/defaultExpandedId, onExpandedChange({id}), mobileOpen/defaultMobileOpen, onMobileOpenChange({open}), local query/onQueryChange when search supplied. At most three exposed navigation levels; separate any deeper drilldown data from desktop flattening.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

**Additive landmark and trigger identity:** label optionally supplies the real navigation landmark name (existing 메인 메뉴 default unchanged). mobileTriggerId/mobileTriggerLabel optionally identify/name its one actual primary mobile opener; omitted values retain existing defaults. When composed by Header, its navigationLabel maps to this label and shared current/mobile state targets this same menu instance. If Header owns the primary native trigger, the adapter connects that actual native control internally and suppresses duplicate openers without duplicate IDs. A native content slot is transport for this real menu, not permission to render a second empty menu or an extra navigation wrapper. Plain IDs do not replace adapter-native refs or valid same-root relationships.

## Keyboard, focus and state transitions

Click/Enter toggles a parent; no hover-only opening. Escape closes expanded dropdown(s) and focuses top-level trigger. Tab follows hierarchy. Official dropdown active cue aria-current=true is distinct from current leaf aria-current=page; also expose aria-expanded/controls. Closed descendants leave focus/a11y trees. Mobile full-screen modal layer follows the reviewed Modal focus/isolation contract as a project choice; leaf anchors retain browser behavior.

## Responsive/mobile requirements

Desktop dropdown maximum height 70vh with internal overflow; narrow screens use hamburger layer rather than clipped desktop links. Search is optional for complex menus and local in stories. Avoid rearranging focus order when switching layout.

## Forms, reset and composition

No navigation form value/reset. Optional search preserves IME and never activates navigation from composing Enter.

## Asset, integration and composition completion

Compose Link, buttons, mobile dialog, optional TextInput and utilities natively in each renderer. Host owns route map/current page, auth/utilities, and search decisions; menu does not fetch or mutate history beyond native links.

## Stable parts and states

root, list, item, trigger, link, indicator, submenu, submenu-title, description, utilities, mobile-trigger, mobile-content, back, close, search; expanded/collapsed,current, mobile-open.

All rendered owned parts use `data-krds-component="main-menu"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Leaf modified-click/open-new-tab works with real href.
2. Parent opens once by click/Enter and not hover.
3. Escape returns top-level trigger.
4. Hidden links cannot receive focus.
5. Dropdown at 70vh remains scrollable.
6. Mobile drill-back restores prior level and focus.
7. Current route cue differs from expanded group.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`main-menu--desktop-links`, `main-menu--desktop-dropdown`, `main-menu--desktop-described`, `main-menu--large-menu-overflow`, `main-menu--mobile-simple`, `main-menu--mobile-sections`, `main-menu--mobile-drilldown`, `main-menu--local-search`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


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

Inline preserved example markup (reference, not the public native API): L[1370–1575](../../upstream/krds/raw/components/component_03_02.html:1370), L[1602–1765](../../upstream/krds/raw/components/component_03_02.html:1602)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Official interaction table lists Tab for first-level navigation, while accessibility requires hierarchical access; native list traversal resolves this without inventing ARIA menubar arrow semantics.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1586 `../../code/main_menu_pc.html`, L1776 `../../code/main_menu_mobile.html`, L2038 `../../../resources/js/examples/krds_mainMenuPC.js`, L2102 `../../../resources/js/examples/krds_mainMenuMobile.js`, L2133 `./variable/main_menu_pc.html`, L2144 `./variable/main_menu_mobile.html`. Do not infer unseen contents.
- 15 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `MainMenuContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
