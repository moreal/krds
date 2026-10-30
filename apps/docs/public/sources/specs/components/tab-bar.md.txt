# TabBar

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `tab-bar`; Korean name 탭바; export `TabBar`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_12_07](https://www.krds.go.kr/html/site/component/component_12_07.html); preserved [HTML](../../upstream/krds/raw/components/component_12_07.html). Retrieved `2026-10-29T23:28:06.337Z`; `69814` bytes; SHA-256 `89a4830ba2601fe898f1dfc5afd31166c49ca6b76d55d10a78ab4faf76e6d378`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `three-items`, `five-items`, `with-badge`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Web <nav> landmark with <=5 equal-size navigation items, each icon+short label. Current item aria-current=page and filled-vs-outline icon/indicator. Home if present first/leftmost, all-menu if present last/rightmost. Optional Badge conveys unread/new state.

## Plain semantic API

Independent API: items {id,label,href,icon,currentIcon?,badge?}[], currentId; optional terminal menuAction {label,onRequest}. Real anchors for page routes; named button only for opening all-menu. This is navigation, never role=tablist or Tabs shared-state panel API.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Native Tab/Shift+Tab and Enter links, native button Enter/Space for all-menu. No automatic arrow/tab-panel activation inferred. Current route comes from host; passive prop change emits no selection event.

## Responsive/mobile requirements

Bottom fixed and does not hide on scroll; host adds matching content bottom padding/safe-area inset. Omit on deeper views only by route design. Labels never ellipsize, including translations; use MainMenu when width sufficient.

## Forms, reset and composition

No form/reset/IME behavior; menu button type=button.

## Asset, integration and composition completion

Host owns route map/current page, all-menu layer and badge source. Completion includes real local page navigation and all-menu composition; badge is static metadata, no remote notification requirement.

## Stable parts and states

root, list, item, link, icon, label, indicator, badge, menu-trigger; current.

All rendered owned parts use `data-krds-component="tab-bar"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Landmark/real anchors expose page navigation rather than tabs.
2. Current page announced and not color-only.
3. Home first/all-menu last.
4. 3/5 items equal size with complete translated labels.
5. Fixed bar stays present on scroll without covering content.
6. All-menu returns focus after close.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`tab-bar--three-items`, `tab-bar--five-items`, `tab-bar--with-badge`, `tab-bar--all-menu`, `tab-bar--long-translated-label`, `tab-bar--scroll-page`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


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

Inline preserved example markup (reference, not the public native API): No inline sample-view markup in this detail.

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- No dedicated official keyboard table. Choice of breakpoint, safe-area padding and all-menu dialog focus is native project policy.
- 16 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `TabBarContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
