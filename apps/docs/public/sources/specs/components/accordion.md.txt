# Accordion

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `accordion`; Korean name 아코디언; export `Accordion`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_04_07](https://www.krds.go.kr/html/site/component/component_04_07.html); preserved [HTML](../../upstream/krds/raw/components/component_04_07.html). Retrieved `2026-10-29T23:28:03.699Z`; `84688` bytes; SHA-256 `b7cd55bbfda033e500711ddf92543704e918c0e041c418856c5ac3445cbf9b3a`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `default`, `line`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Ordered content sections with page-appropriate heading containing a full-width type=button trigger, state icon and adjacent associated panel. Expose expanded state; panels have no independent vertical/horizontal scroll. Avoid nested accordion/tab hiding for essential content.

## Plain semantic API

Independent API: items {id,title,content}[], openIds/defaultOpenIds=[], onOpenChange({ids}), multiple=true, variant=default|line. multiple and initial policy are independent choices because official page does not mandate single-open. Stable IDs link triggers/panels.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Tab traverses headers and open content; Enter/Space/click toggle once, focus stays header. Full header target clickable. Closed content cannot be focused/read; external closure of focused panel returns its trigger. No invented mandatory arrow-key roving model.

## Responsive/mobile requirements

Use natural page scroll for long panels; headings/labels wrap legibly and state icons keep consistent position. Reduced motion does not alter logical open state.

## Forms, reset and composition

No aggregate form value/reset; preserve child form values on collapse by default.

## Asset, integration and composition completion

Host supplies related content and heading level. Completion includes real independently expandable sections in default/line styling.

## Stable parts and states

root, item, heading, trigger, icon, panel; open,closed,disabled if explicitly supported.

All rendered owned parts use `data-krds-component="accordion"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Heading/button relationships and state are accessible.
2. Pointer/Enter/Space toggle one transition with trigger focus.
3. Open long panel uses page scroll.
4. Hidden links unavailable.
5. Multiple-open policy is explicit and controlled rejection stable.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`accordion--default`, `accordion--line`, `accordion--multiple-open`, `accordion--interactive-panel`, `accordion--long-panel`, `accordion--controlled`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[884–884](../../upstream/krds/raw/components/component_04_07.html:884): 구조
- L[893–893](../../upstream/krds/raw/components/component_04_07.html:893): a. 제목 패널 섹션의 콘텐츠 제목
- L[894–894](../../upstream/krds/raw/components/component_04_07.html:894): b. 아이콘 패널의 펼침/접힘 상태를 나타냄
- L[890–896](../../upstream/krds/raw/components/component_04_07.html:890): 1. 헤더 a. 제목 패널 섹션의 콘텐츠 제목 b. 아이콘 패널의 펼침/접힘 상태를 나타냄
- L[897–900](../../upstream/krds/raw/components/component_04_07.html:897): 2. 패널 헤더 하위에 속하는 콘텐츠 섹션

### 용례

- L[908–908](../../upstream/krds/raw/components/component_04_07.html:908): 용례
- L[910–910](../../upstream/krds/raw/components/component_04_07.html:910): 사용하기 적합한 경우
- L[912–913](../../upstream/krds/raw/components/component_04_07.html:912): 아코디언 컴포넌트는 콘텐츠가 숨겨진 형태이므로 사용자가 콘텐츠가 있음을 인지하지 못할 가능성이 있으며, 콘텐츠를 표시하기 위해 헤더를 클릭할 것인지에 대한 의사결정 과정이 필요하기 때문에 사용자의 인지적 부담을 증가시킨다. 그러므로 다음 중 하나에 해당하고 아코디언을 사용함으로써 사용자에게 도움이 된다는 뚜렷한 증거가 없는 경우에는 가급적 아코디언 컴포넌트를 사용하지 않아야 한다.
- L[915–915](../../upstream/krds/raw/components/component_04_07.html:915): 모바일 스크린, 사이드 패널과 같이 공간이 부족하여 긴 콘텐츠를 한 번에 보여주기 어려운 경우
- L[916–916](../../upstream/krds/raw/components/component_04_07.html:916): 사용자가 여러 콘텐츠 섹션 중 일부의 정보만 필요로 하는 경우
- L[917–917](../../upstream/krds/raw/components/component_04_07.html:917): 사용자가 여러 콘텐츠 섹션 전체를 다 읽어야 할 만큼 중요한 정보가 아니어서 화면의 스크롤을 줄이고자 하는 경우
- L[918–918](../../upstream/krds/raw/components/component_04_07.html:918): 사용자가 서로 관련된 여러 콘텐츠 섹션의 개요를 빠르게 파악하고 비교해야 하는 경우
- L[923–923](../../upstream/krds/raw/components/component_04_07.html:923): 사용하기 적합하지 않은 경우
- L[925–925](../../upstream/krds/raw/components/component_04_07.html:925): 아코디언을 사용하기에 앞서 다른 컴포넌트나 패턴을 사용하여 콘텐츠를 제공하는 방안을 최우선으로 고려해야 한다. 콘텐츠를 적절히 구조화하여 표현하면 아코디언을 사용하지 않고도 효과적으로 정보를 전달할 수 있다.
- L[930–930](../../upstream/krds/raw/components/component_04_07.html:930): 아코디언의 상호작용 방식에 익숙하지 않은 사용자도 있으며 중요한 정보를 놓칠 가능성이 높아진다.
- L[927–932](../../upstream/krds/raw/components/component_04_07.html:927): 사용자가 콘텐츠의 전체 또는 대부분을 반드시 확인해야 하거나 중요도가 높은 정보인 경우 아코디언의 상호작용 방식에 익숙하지 않은 사용자도 있으며 중요한 정보를 놓칠 가능성이 높아진다.
- L[936–936](../../upstream/krds/raw/components/component_04_07.html:936): 아코디언과 탭은 콘텐츠를 숨겨둔 상태에서 사용자가 콘텐츠의 표시 여부를 선택해야 하기 때문에 사용자의 인지적 부담을 더욱 증가시킬 수 있다.
- L[933–938](../../upstream/krds/raw/components/component_04_07.html:933): 하위 또는 상위 요소로 이미 아코디언 컴포넌트가 사용되었거나 탭 패턴이 사용된 경우 아코디언과 탭은 콘텐츠를 숨겨둔 상태에서 사용자가 콘텐츠의 표시 여부를 선택해야 하기 때문에 사용자의 인지적 부담을 더욱 증가시킬 수 있다.
- L[942–942](../../upstream/krds/raw/components/component_04_07.html:942): 이 경우 콘텐츠를 여러 페이지에 분할하여 제공하는 것이 적합하다.
- L[939–944](../../upstream/krds/raw/components/component_04_07.html:939): 패널 내부 콘텐츠의 양이 많거나 복잡하여 표시되는 데 많은 시간이 걸리는 경우 이 경우 콘텐츠를 여러 페이지에 분할하여 제공하는 것이 적합하다.
- L[948–948](../../upstream/krds/raw/components/component_04_07.html:948): 콘텐츠를 하나의 페이지에 제공하고 섹션의 헤딩을 명확하게 구분하는 것만으로 콘텐츠를 쉽게 인지할 수 있다. 필요한 경우 콘텐츠 상단부에 사용자가 페이지의 특정 섹션으로 이동할 수 있는 링크 목록을 제공할 수 있다.
- L[945–950](../../upstream/krds/raw/components/component_04_07.html:945): 콘텐츠가 매우 단순한 경우 콘텐츠를 하나의 페이지에 제공하고 섹션의 헤딩을 명확하게 구분하는 것만으로 콘텐츠를 쉽게 인지할 수 있다. 필요한 경우 콘텐츠 상단부에 사용자가 페이지의 특정 섹션으로 이동할 수 있는 링크 목록을 제공할 수 있다.

### 사용성 가이드라인

- L[959–959](../../upstream/krds/raw/components/component_04_07.html:959): 사용성 가이드라인
- L[962–962](../../upstream/krds/raw/components/component_04_07.html:962): 아코디언의 확장 상태를 나타내는 아이콘은 항상 일관된 위치에 제공한다.
- L[963–964](../../upstream/krds/raw/components/component_04_07.html:963): 아코디언을 서로 관련 있는 콘텐츠 섹션의 정보를 전달하기 위한 목적으로 사용하는 경우에는 아이콘을 헤더의 끝에 배치하는 것이 바람직하다. 헤더 목록에서 텍스트가 같은 위치에서 시작될 수 있어 사용자의 안구 운동 피로도를 줄일 수 있다. 만약 콘텐츠 섹션 목록이 트리 구조로 구성되어 있다면 이러한 정보를 전달하기 위해서 아이콘을 헤더의 시작 부분에 배치할 수 있다.
- L[967–967](../../upstream/krds/raw/components/component_04_07.html:967): 아코디언의 확장 상태를 나타내는 아이콘은 패널이 펼쳐지거나 접히는 방향을 정확하게 반영하도록 제공한다.
- L[968–968](../../upstream/krds/raw/components/component_04_07.html:968): 아코디언이 접혀 있는 경우 사용자가 확장 가능한 영역이 있음을 알 수 있도록 'V' 또는 '+' 아이콘이, 펼쳐진 경우에는 '^', '-' 아이콘이 제공되어야 한다.
- L[976–976](../../upstream/krds/raw/components/component_04_07.html:976): 헤더 전체를 클릭 가능하도록 만든다.
- L[977–978](../../upstream/krds/raw/components/component_04_07.html:977): 상호작용이 가능한 타깃 영역이 클수록 사용자가 더 쉽게 조작할 수 있다. 사용자가 패널을 펼치거나 접기 위해 헤더 전체를 클릭할 수 있도록 구현해야 한다. 만약, 패널 내부 콘텐츠에 링크, 버튼과 같은 인터페이스가 포함되어 있다면 헤더와 패널 사이에 충분한 공간을 확보하여 사용자가 실수로 헤더를 클릭하지 않도록 해야 한다.
- L[989–989](../../upstream/krds/raw/components/component_04_07.html:989): 헤더와 패널은 서로 관련 있는 것으로 인지될 수 있게 표현한다.
- L[990–990](../../upstream/krds/raw/components/component_04_07.html:990): 헤더와 패널이 하나의 콘텐츠 섹션으로 인지될 수 있게 표현되어야 하며, 필요한 경우 여백, 색상, 그림자, 선을 사용할 수 있다.
- L[1001–1001](../../upstream/krds/raw/components/component_04_07.html:1001): 패널 영역에 스크롤이 발생하지 않도록 한다.
- L[1002–1002](../../upstream/krds/raw/components/component_04_07.html:1002): 패널 내부 콘텐츠가 길어져 화면의 뷰포트를 넘어가는 경우, 페이지 스크롤을 통해 콘텐츠를 탐색할 수 있어야 한다. 패널 영역에 별도의 세로, 가로 스크롤이 생성되어서는 안 된다.

### 접근성 가이드라인

- L[1113–1113](../../upstream/krds/raw/components/component_04_07.html:1113): 접근성 가이드라인
- L[1116–1116](../../upstream/krds/raw/components/component_04_07.html:1116): 아코디언에 접근 가능한 제목을 제공한다.
- L[1117–1117](../../upstream/krds/raw/components/component_04_07.html:1117): 아코디언 헤더 내부의 제목은 페이지의 다른 콘텐츠의 구조에 맞추어 &lt;h1&gt;~&lt;h6&gt; 태그로 마크업한다. 스크린 리더 사용자가 아코디언 목록에서 어떤 정보를 확인할 수 있는지 개요를 파악하고 필요한 정보를 빠르게 탐색하는 데 도움이 된다.
- L[1124–1124](../../upstream/krds/raw/components/component_04_07.html:1124): 아코디언의 활성화 상태 정보를 스크린 리더에서 확인할 수 있도록 한다.
- L[1125–1125](../../upstream/krds/raw/components/component_04_07.html:1125): 아코디언의 확장 상태에 대한 정보를 텍스트 정보로 제공(펼치기/접기, 축소됨/확장됨)하여 스크린 리더 사용자가 컨트롤의 상태를 인지할 수 있도록 해야 한다.
- L[1131–1131](../../upstream/krds/raw/components/component_04_07.html:1131): 헤더를 버튼 역할로 제공한다.
- L[1132–1132](../../upstream/krds/raw/components/component_04_07.html:1132): 헤더를 실행하였을 때 특정 섹션이나 화면으로 이동하는 것이 아니므로 &lt;button&gt;을 사용하거나 role="button"을 사용하여 스크린 리더에서 버튼 역할임을 인지할 수 있도록 한다.

### 상호작용 가이드라인

- L[1143–1143](../../upstream/krds/raw/components/component_04_07.html:1143): 상호작용 가이드라인
- L[1145–1145](../../upstream/krds/raw/components/component_04_07.html:1145): 헤더 목록 탐색
- L[1163–1166](../../upstream/krds/raw/components/component_04_07.html:1163): Tab, Shift + Tab 아코디언 목록의 헤더 버튼에 순차적으로 접근한다.
- L[1173–1173](../../upstream/krds/raw/components/component_04_07.html:1173): 패널 확장 또는 축소
- L[1191–1194](../../upstream/krds/raw/components/component_04_07.html:1191): Click 사용자가 헤더 영역 전체 또는 아이콘을 Click 하면 아코디언의 확장 상태가 변경된다.
- L[1195–1198](../../upstream/krds/raw/components/component_04_07.html:1195): Enter, Space 헤더에 초점이 있는 상태에서 Enter 또는 Space 키를 누르면 아코디언의 확장 상태가 변경된다. 이때, 초점은 헤더에 유지되어야 한다.

### 예시

- L[1217–1217](../../upstream/krds/raw/components/component_04_07.html:1217): 예시
- L[1221–1221](../../upstream/krds/raw/components/component_04_07.html:1221): 기본
- L[1231–1232](../../upstream/krds/raw/components/component_04_07.html:1231): 아코디언 타이틀 영역
- L[1242–1243](../../upstream/krds/raw/components/component_04_07.html:1242): 아코디언 타이틀 영역
- L[1261–1261](../../upstream/krds/raw/components/component_04_07.html:1261): 기본 코드 확인하기
- L[1277–1277](../../upstream/krds/raw/components/component_04_07.html:1277): 라인형
- L[1287–1288](../../upstream/krds/raw/components/component_04_07.html:1287): 아코디언 타이틀 영역
- L[1298–1299](../../upstream/krds/raw/components/component_04_07.html:1298): 아코디언 타이틀 영역
- L[1317–1317](../../upstream/krds/raw/components/component_04_07.html:1317): 라인형 코드 확인하기

### 마크업 가이드

- L[1338–1338](../../upstream/krds/raw/components/component_04_07.html:1338): 마크업 가이드
- L[1341–1341](../../upstream/krds/raw/components/component_04_07.html:1341): CSS 선택자
- L[1361–1366](../../upstream/krds/raw/components/component_04_07.html:1361): 전체영역 .krds-accordion 라인 타입 .type-line
- L[1367–1372](../../upstream/krds/raw/components/component_04_07.html:1367): 아코디언 그룹 .accordion-item 활성화 .active
- L[1373–1378](../../upstream/krds/raw/components/component_04_07.html:1373): 제목 및 내용 활성화 버튼 .btn-accordion 활성화 .active [aria-expanded="true"]
- L[1388–1388](../../upstream/krds/raw/components/component_04_07.html:1388): JS
- L[1407–1411](../../upstream/krds/raw/components/component_04_07.html:1407): krds_accordion init() 초기화 및 주요 이벤트 실행
- L[1412–1415](../../upstream/krds/raw/components/component_04_07.html:1412): setupAccordions() 아코디언 설정
- L[1443–1443](../../upstream/krds/raw/components/component_04_07.html:1443): 개발 시 접근성 관련 주의 사항
- L[1445–1445](../../upstream/krds/raw/components/component_04_07.html:1445): 헤더 영역을 h태그로 제공하고 button을 사용한다.
- L[1446–1446](../../upstream/krds/raw/components/component_04_07.html:1446): 바디영역 확장/축소를 wai-aria 속성 등으로 표편해주고 있는지 확인한다.

Inline preserved example markup (reference, not the public native API): L[1226–1255](../../upstream/krds/raw/components/component_04_07.html:1226), L[1282–1311](../../upstream/krds/raw/components/component_04_07.html:1282)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Source does not specify exclusive vs multiple opening, disabled headers or arrow shortcuts; draft chooses multiple and native Tab traversal.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1266 `../../code/accordion.html`, L1322 `../../code/accordion_line.html`, L1430 `../../../resources/js/examples/krds_accordion.js`, L1458 `./variable/accordion.html`. Do not infer unseen contents.
- 7 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `AccordionContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
