# InPageNavigation

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `in-page-navigation`; Korean name 콘텐츠 내 탐색; export `InPageNavigation`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_03_05](https://www.krds.go.kr/html/site/component/component_03_05.html); preserved [HTML](../../upstream/krds/raw/components/component_03_05.html). Retrieved `2026-10-29T23:28:03.138Z`; `80770` bytes; SHA-256 `7de4b0ef8b8d310581242e20cf5714c2de62dd2410bf46d1e6984fd90d7124fc`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `composition`; accepted project completion kind `composition`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `desktop-side`, `mobile-inline`, `mobile-disclosure`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Outline title (not h1), nested list of same-document section links, and active-section cue. Mark up between page title and body even if desktop CSS places it at the right. Link labels match target headings; use at most three levels and normally one.

## Plain semantic API

Independent API: sections {id,label,children?}[], title="이 페이지의 구성", activeId/onActiveChange({id,reason}), optional collapsible narrow mode. Real anchors target registered sections; active state follows scroll observation independently of link activation.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Tab/Shift+Tab traverse links. Enter and official Space action scroll and focus target heading/section; mouse click scrolls while focus remains on link. Prevent Space page-scroll only on outline link activation, ignore composition. No focus move from passive scroll-observer updates.

## Responsive/mobile requirements

Desktop positions to right; narrow outline is nonsticky between title/body, optionally Disclosure if long. Account for sticky-header offset and reduced motion; no infinite-scroll outline.

## Forms, reset and composition

No form value/reset. IME-sensitive key filtering only if keyboard handling receives composing events.

## Asset, integration and composition completion

Host supplies matching stable section headings/targets and can remove sections; clean observers on unmount/route change and update active state without stale target focus. Completion requires long page with real destinations.

## Stable parts and states

root, header, title, list, item, link, indicator, disclosure-trigger; active,expanded/collapsed.

All rendered owned parts use `data-krds-component="in-page-navigation"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. DOM outline precedes body while desktop visual position is right.
2. Keyboard Enter/Space focuses target and next Tab enters it.
3. Pointer navigation preserves link focus.
4. Passive scrolling only updates indicator.
5. Removed target has no stale observer or focus attempt.
6. Narrow outline is inline and accessible.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Independent local specimen policy

The independent collapsed mobile-disclosure specimen names its actual control “구성 펼치기”; after expansion the action is “구성 접기”. The navigation retains its supplied outline title. This wording is local specimen policy, not an official required literal.

## Required native stories

`in-page-navigation--desktop-side`, `in-page-navigation--mobile-inline`, `in-page-navigation--mobile-disclosure`, `in-page-navigation--three-level-outline`, `in-page-navigation--sticky-offset`, `in-page-navigation--removed-section`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


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

Inline preserved example markup (reference, not the public native API): L[1217–1247](../../upstream/krds/raw/components/component_03_05.html:1217)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Official desktop prose says natural reading order after content while accessibility explicitly says markup before body; follow explicit accessibility order and flag this source tension.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1258 `../../code/in_page_navigation.html`, L1416 `../../../resources/js/examples/krds_inPageNavigation.js`, L1444 `./variable/in_page_navigation.html`. Do not infer unseen contents.
- 1 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `InPageNavigationContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
