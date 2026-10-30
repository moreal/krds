# Header

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `header`; Korean name 헤더; export `Header`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_02_03](https://www.krds.go.kr/html/site/component/component_02_03.html); preserved [HTML](../../upstream/krds/raw/components/component_02_03.html). Retrieved `2026-10-29T23:28:02.681Z`; `128284` bytes; SHA-256 `09265da2efd4f428c0c55d0593d2e8554484769ef8b4b7d1e4e6f7b95557053e`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `composition`; accepted project completion kind `composition`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `vertical-actions`, `horizontal-actions`, `mobile-menu`, `sticky`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Compose SkipLink first, Masthead, service identity/home link, utility group (or dropdown when five or more utility links), search action and MainMenu in the official relative order. Government logo is upper left, utilities upper right. Native <header> is the service banner landmark; the skip link may be adjacent before it to remain document-first.

## Plain semantic API

Independent API: Header receives home {href,label,logo}, utilityItems {id,label,href}, search {label,onRequest}, mainNavigation semantic data, actionLayout vertical/horizontal (horizontal default), sticky=false. Use explicit named component regions, not opaque arbitrary containers. Public data/events never expose Ark/Zag instances.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

**Additive native composition inputs:** currentId optionally marks the actual route in the existing real MainMenu. mobileOpen/defaultMobileOpen/onMobileOpenChange({open}) expose that same menu’s mobile disclosure: defined mobileOpen, including false, is authoritative; otherwise read the default once (existing closed default). Both/mode switching are invalid. One accepted user action emits one plain request; mount, props and reset emit none; rejection preserves actual committed panel/focus state. mobileTriggerId/mobileTriggerLabel optionally identify/name the actual primary mobile trigger. navigationLabel optionally names the real MainMenu landmark and is forwarded as its label. Omission preserves existing defaults. A native navigationContent/slot transport may supply the same one real native MainMenu; it must share current/open/primary-trigger identity, not cause an extra empty menu or extra navigation wrapper. Supplied trigger IDs/labels are nonempty and label the actual control; no renderer object enters this semantic API. T11 explicitly supplies 주요 메뉴 and its actual trigger ID; sidebar naming uses its existing title 예제 메뉴.

## Keyboard, focus and state transitions

Link navigation uses native anchors; utility/menu toggles and search use named buttons. Child MainMenu owns expanded/current state and mobile layer focus. Search requests onRequest once without creating a fake local search service. Logo link name excludes redundant “logo”.

## Responsive/mobile requirements

When menu no longer fits, replace bar with a named hamburger opener and keyboard-operable menu layer. Sticky behavior is optional: exclude Masthead from sticky region; for header exceeding two rows, show on upward scroll and release on downward scroll. Native mobile-app-only left-menu limits/settings are not universal mobile-web mandates.

## Forms, reset and composition

Header itself has no form state. A search form belongs to the host/search composition; preserve entered query and IME behavior there.

## Asset, integration and composition completion

Completion requires working local compositions of SkipLink, Masthead specimen, Link, MainMenu and optional LanguageSwitcher/Resize with deterministic state; no adapter imports from other renderers. Host owns auth, search navigation, institution logo and utility destinations.

## Stable parts and states

root, identity, utilities, utility-trigger, actions, search, navigation, mobile-trigger; expanded/collapsed, sticky.

All rendered owned parts use `data-krds-component="header"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. DOM/read/focus order follows identity→utilities→search→navigation after SkipLink.
2. Five-plus utilities remain reachable in dropdown by keyboard.
3. Logo is a home link with meaningful name.
4. Mobile menu opens/closes and restores focus.
5. Sticky mode does not hide focused controls or Masthead within fixed region.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`header--horizontal-actions`, `header--vertical-actions`, `header--five-utilities`, `header--mobile-menu`, `header--sticky-long-page`, `header--translated-long-labels`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


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

Inline preserved example markup (reference, not the public native API): L[1208–1671](../../upstream/krds/raw/components/component_02_03.html:1208)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Recorded independent decision: Wide/narrow presentation follows actual container layout; the library does not infer a native-app-only web exemption. The host supplies identity assets. Sticky Header excludes Masthead; narrow fixtures use 360 CSS pixels and wide fixtures use 1280.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1682 `../../code/header.html`, L1968 `../../../resources/js/examples/krds_mainMenuPC.js`, L2032 `../../../resources/js/examples/krds_mainMenuMobile.js`. Do not infer unseen contents.
- 13 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Accepted independent resolution

Wide/narrow presentation follows actual container layout; the library does not infer a native-app-only web exemption. The host supplies identity assets. Sticky Header excludes Masthead; narrow fixtures use 360 CSS pixels and wide fixtures use 1280.

## Shared implementation handoff

The exact semantic interface is `HeaderContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
