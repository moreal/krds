# SideNavigation

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `side-navigation`; Korean name 사이드 메뉴; export `SideNavigation`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_03_04](https://www.krds.go.kr/html/site/component/component_03_04.html); preserved [HTML](../../upstream/krds/raw/components/component_03_04.html). Retrieved `2026-10-29T23:28:03.067Z`; `98998` bytes; SHA-256 `12f628f6e3fee2ebebc637ed2773beec9dc30c74edf5d16f1c71b31c3ace951f`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `composition`; accepted project completion kind `composition`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `simple`, `with-header`, `mobile-dropdown`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Named navigation landmark with optional heading/back-to-parent control, nested <ul>/<li> links, selected leaf cue, and separate descendant disclosure buttons. Expose at most two levels together; deeper structure is progressively exposed with header context. Current leaf aria-current=page; triggers aria-expanded/controls.

## Plain semantic API

Independent API: items {id,label,href?,children?}[], currentId, expandedIds/defaultExpandedIds (initially current branch), onExpandedChange({ids}), title/parentLink optional. Multiple expanded branches are independent; do not apply Accordion single-open defaults.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Tab follows visible hierarchy; Enter/click navigate leaves or toggle parents. Opening a second branch leaves first open. Collapsed descendants are absent from focus/a11y tree; collapsing a branch containing active focus returns that branch trigger. Nonmodal desktop navigation has no focus trap.

## Responsive/mobile requirements

Hide sidebar when width insufficient; host MainMenu supplies equivalent navigation. For four-plus overall levels, page-title dropdown may expose the current deep level. Hide only when equivalent route access exists.

## Forms, reset and composition

No form/reset/IME state.

## Asset, integration and composition completion

Completion composes actual Link/disclosure behavior and a header-based deeper-navigation fixture. Host owns route tree/current state and equivalent narrow navigation. No undocumented cross-adapter reuse.

## Stable parts and states

root, header, parent-link, list, item, link, trigger, submenu, indicator; current,expanded,collapsed.

All rendered owned parts use `data-krds-component="side-navigation"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Current branch starts reachable and marks correct current page.
2. Two branches can stay expanded.
3. Closed descendants cannot be tabbed.
4. Keyboard links retain route semantics.
5. Narrow host retains equivalent route access.
6. Drilldown header identifies parent context.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Independent local specimen policy

The independent deep-progressive specimen starts without a committed current route or expanded branches. Its real closed branch action is “분류 펼치기”, then “분류 접기” while expanded. Disclosure names include both the visible branch label and action; current/expanded state remains native/ARIA authoritative.

## Required native stories

`side-navigation--simple`, `side-navigation--with-header`, `side-navigation--two-open-branches`, `side-navigation--deep-progressive`, `side-navigation--mobile-dropdown`, `side-navigation--long-menu`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[886–886](../../upstream/krds/raw/components/component_03_04.html:886): 구조
- L[892–895](../../upstream/krds/raw/components/component_03_04.html:892): 1. 컨테이너 사이드 메뉴 링크 목록을 담고 있는 영역으로 배경색 또는 테두리로 본문 및 인접 영역과 구분함
- L[896–899](../../upstream/krds/raw/components/component_03_04.html:896): 2. 구분선 링크 목록 내의 항목을 구분하기 위한 가로선
- L[903–903](../../upstream/krds/raw/components/component_03_04.html:903): a. 제목 메뉴 목록 전체의 상위 수준 정보 구조를 알려주는 텍스트
- L[904–904](../../upstream/krds/raw/components/component_03_04.html:904): b. 화살표 제목으로 제공되는 상위 수준 정보 구조로 이동하는 데 사용되는 버튼
- L[900–906](../../upstream/krds/raw/components/component_03_04.html:900): 3. 헤더(선택) 메뉴 목록의 제목을 제공하는 영역 a. 제목 메뉴 목록 전체의 상위 수준 정보 구조를 알려주는 텍스트 b. 화살표 제목으로 제공되는 상위 수준 정보 구조로 이동하는 데 사용되는 버튼
- L[907–910](../../upstream/krds/raw/components/component_03_04.html:907): 4. 기본 화면 링크 목록 기본 탐색 링크 그룹
- L[911–914](../../upstream/krds/raw/components/component_03_04.html:911): 5. 하위 수준 페이지 링크 목록 기본 페이지 링크 하위 수준에 속하는 링크 목록
- L[915–918](../../upstream/krds/raw/components/component_03_04.html:915): 6. 식별자 선택된 링크를 변별하기 위한 시각적 단서
- L[919–922](../../upstream/krds/raw/components/component_03_04.html:919): 7. 꺾쇠 아이콘 하위 수준 화면 링크 목록의 확장/축소 상태를 나타냄. 사용자는 꺾쇠 아이콘의 유무를 통해 개별 기본 화면 링크 하위에 추가적으로 탐색할 수 있는 링크 목록이 존재하는지를 인지할 수 있음

### 유형

- L[930–930](../../upstream/krds/raw/components/component_03_04.html:930): 유형
- L[932–932](../../upstream/krds/raw/components/component_03_04.html:932): 단순 목록
- L[933–933](../../upstream/krds/raw/components/component_03_04.html:933): 사이드 메뉴의 가장 기본적인 형태로 모든 수준의 링크가 표시된다. 사용자는 메인 메뉴와 메인 메뉴의 식별자를 통해 사이드 메뉴 목록의 계층 구조를 파악할 수 있다.
- L[939–939](../../upstream/krds/raw/components/component_03_04.html:939): 헤더가 있는 목록
- L[940–943](../../upstream/krds/raw/components/component_03_04.html:940): 4수준 이상의 계층 구조를 가진 서비스에서 4수준 이상의 메뉴를 점진적으로 공개할 때, 상위 수준 메뉴 텍스트를 보여주는 제목과 이동 버튼으로 구성된 헤더를 포함하여 사용한다. 링크 목록이 메인 메뉴에 표시된 정보 구조의 하위 수준에 속하지 않는 경우, 사용자가 정보 구조를 명확하게 파악하는 것을 돕기 위해 제목을 제공할 수 있다.
- L[949–949](../../upstream/krds/raw/components/component_03_04.html:949): 드롭다운
- L[950–950](../../upstream/krds/raw/components/component_03_04.html:950): 4수준 이상의 계층 구조를 가진 서비스에서 햄버거 메뉴로 전환되었을 때 메인 메뉴를 보조하여 탐색할 수 있는 수단으로 사용한다. 본문의 제목이 드롭다운 버튼으로 사용되며, 실행 시 동일한 수준의 메뉴 링크 목록을 표시한다.

### 용례

- L[960–960](../../upstream/krds/raw/components/component_03_04.html:960): 용례
- L[962–962](../../upstream/krds/raw/components/component_03_04.html:962): 사용하기 적합한 경우
- L[967–967](../../upstream/krds/raw/components/component_03_04.html:967): 제한된 메인 메뉴 영역에서 가로로 배치된 목록을 탐색하는 것보다 세로로 배치된 사이드 메뉴 링크 목록을 훑어보는 것이 쉽다.
- L[964–969](../../upstream/krds/raw/components/component_03_04.html:964): 메인 메뉴에서 선택한 메뉴 하위에 많은 화면이 존재하는 경우 제한된 메인 메뉴 영역에서 가로로 배치된 목록을 탐색하는 것보다 세로로 배치된 사이드 메뉴 링크 목록을 훑어보는 것이 쉽다.
- L[973–973](../../upstream/krds/raw/components/component_03_04.html:973): 메인 메뉴 항목 하위 링크 목록이 유사한 정보 그룹으로 구성되어 있고 사용자가 링크 목록을 비교하여 탐색하는 행동을 빈번하게 수행하는 경우, 본문 옆에 배치된 사이드 메뉴가 탐색 과정을 효율적으로 수행하는 것을 도울 수 있다.
- L[970–975](../../upstream/krds/raw/components/component_03_04.html:970): 사용자가 사이트 정보의 계층 구조에서 특정 수준의 메뉴를 상세하게 탐색할 필요가 있는 경우 메인 메뉴 항목 하위 링크 목록이 유사한 정보 그룹으로 구성되어 있고 사용자가 링크 목록을 비교하여 탐색하는 행동을 빈번하게 수행하는 경우, 본문 옆에 배치된 사이드 메뉴가 탐색 과정을 효율적으로 수행하는 것을 도울 수 있다.
- L[979–979](../../upstream/krds/raw/components/component_03_04.html:979): 사용하기 적합하지 않은 경우
- L[984–984](../../upstream/krds/raw/components/component_03_04.html:984): 화면 수가 5개 미만인 소규모 서비스는 메인 메뉴 또는 다른 보조적 탐색 수단을 통해 사이트 정보 구조를 충분히 탐색할 수 있다.
- L[981–986](../../upstream/krds/raw/components/component_03_04.html:981): 사이트 규모가 작은 경우 화면 수가 5개 미만인 소규모 서비스는 메인 메뉴 또는 다른 보조적 탐색 수단을 통해 사이트 정보 구조를 충분히 탐색할 수 있다.
- L[990–990](../../upstream/krds/raw/components/component_03_04.html:990): 넓은 본문 영역이 필요한 경우, 수준이 깊은 메인 메뉴 형식을 사용하여 사용자가 메인 메뉴를 통해 로컬 탐색을 수행하도록 한다. 화면 너비가 충분하다면 화면 전체 너비로 레이아웃을 확장하고 사이드 메뉴와 본문을 함께 표시할 수 있다.
- L[987–992](../../upstream/krds/raw/components/component_03_04.html:987): 콘텐츠 표현과 인지를 위해 넓은 본문 영역이 필요한 경우 넓은 본문 영역이 필요한 경우, 수준이 깊은 메인 메뉴 형식을 사용하여 사용자가 메인 메뉴를 통해 로컬 탐색을 수행하도록 한다. 화면 너비가 충분하다면 화면 전체 너비로 레이아웃을 확장하고 사이드 메뉴와 본문을 함께 표시할 수 있다.
- L[996–996](../../upstream/krds/raw/components/component_03_04.html:996): 2수준까지 탐색 가능한 메인 메뉴를 통해 서비스의 정보 구조를 충분히 탐색할 수 있다.
- L[993–998](../../upstream/krds/raw/components/component_03_04.html:993): 탐색 계층 구조가 2수준 이내이고 탐색 항목 수가 적은 경우 2수준까지 탐색 가능한 메인 메뉴를 통해 서비스의 정보 구조를 충분히 탐색할 수 있다.

### 사용성 가이드라인

- L[1006–1006](../../upstream/krds/raw/components/component_03_04.html:1006): 사용성 가이드라인
- L[1009–1009](../../upstream/krds/raw/components/component_03_04.html:1009): 현재 탐색 중인 화면에 대한 링크를 강조 표시한다.
- L[1010–1010](../../upstream/krds/raw/components/component_03_04.html:1010): 사용자가 탐색 계층 구조 내에서 어디에 있는지 알 수 있도록 식별자를 통해 탐색 중인 링크를 강조 표시한다.
- L[1013–1013](../../upstream/krds/raw/components/component_03_04.html:1013): 메뉴의 계층 구조는 최대 2개 수준까지 사용한다.
- L[1014–1015](../../upstream/krds/raw/components/component_03_04.html:1014): 사이드 메뉴 영역의 너비는 제한되어 있기 때문에 3개 이상의 수준을 한 번에 표시할 경우 인지와 탐색이 어려워질 수 있다. 2개 이상의 수준에 대한 탐색이 필요한 경우 더 깊은 수준의 메뉴를 점진적으로 공개하고 헤더가 있는 목록을 사용하거나, 본문에 보조적인 탐색 수단을 제공하는 것이 적절하다.
- L[1026–1026](../../upstream/krds/raw/components/component_03_04.html:1026): 하위 수준 메뉴 표시에 확장 가능한 영역을 사용하는 방안을 고려한다.
- L[1027–1030](../../upstream/krds/raw/components/component_03_04.html:1027): 긴 계층 구조를 한 번에 표시할 경우 정보가 복잡해지며 사용자가 뷰포트 바깥에 제공된 링크를 놓칠 수 있다. 하위 수준 메뉴를 확장 가능한 영역으로 구성하고 페이지가 로딩되었을 때 사용자가 탐색 중인 메뉴의 하위 수준 메뉴를 확장된 상태로 제공하면 사용자가 목록을 보다 쉽게 탐색할 수 있다. 만약 모든 수준의 메뉴를 표시하였을 때 목록이 사이드 메뉴 영역을 벗어나지 않으며 간결하다면 기본으로 모든 메뉴가 보이도록 표현할 수 있다.
- L[1042–1042](../../upstream/krds/raw/components/component_03_04.html:1042): 메뉴의 계층 구조를 명확하게 구분하여 표현한다.
- L[1043–1043](../../upstream/krds/raw/components/component_03_04.html:1043): 사용자의 탐색을 방해하지 않도록 수직으로 나란히 배치된 링크 간 수준을 들여쓰기, 배경 구분 등의 방식을 활용하여 명확하게 구분해야 한다.

### 플랫폼에 대한 고려 사항

- L[1059–1059](../../upstream/krds/raw/components/component_03_04.html:1059): 플랫폼에 대한 고려 사항
- L[1062–1062](../../upstream/krds/raw/components/component_03_04.html:1062): 화면 너비가 충분하지 않은 경우 사이드 메뉴를 표시하지 않는다.
- L[1063–1063](../../upstream/krds/raw/components/component_03_04.html:1063): 사용자는 햄버거 아이콘으로 축소된 메인 메뉴를 통해 정보 구조를 탐색한다. 4수준 이상의 정보 구조가 필요하다면 본문 제목을 4수준 메뉴에 대한 보조적 탐색 수단으로 사용하여 사용자의 탐색을 도울 수 있다.

### 접근성 가이드라인

- L[1184–1184](../../upstream/krds/raw/components/component_03_04.html:1184): 접근성 가이드라인
- L[1187–1187](../../upstream/krds/raw/components/component_03_04.html:1187): 메뉴의 컨테이너가 내비게이션 섹션임을 스크린 리더에서 인지할 수 있도록 한다.
- L[1188–1189](../../upstream/krds/raw/components/component_03_04.html:1188): 메뉴의 전체 컨테이너는 &lt;nav&gt;로 감싸거나 WAI-ARIA 영역을 role="navigation"으로 지정하여 스크린 리더에서 내비게이션 요소임을 인지할 수 있도록 제공해야 한다. 내비게이션 섹션에 aria-label="사이드 메뉴"를 제공하면 스크린 리더 사용자는 사이드 메뉴의 역할을 보다 명확하게 인지할 수 있다.
- L[1196–1196](../../upstream/krds/raw/components/component_03_04.html:1196): 메뉴 링크의 계층 구조를 표현한다.
- L[1197–1197](../../upstream/krds/raw/components/component_03_04.html:1197): 스크린 리더 사용자가 사이트의 정보 구조를 파악하는 데 도움을 줄 수 있도록 &lt;h2&gt;~&lt;h6&gt;, &lt;ul&gt;, &lt;li&gt; 태그를 활용하여 계층 구조로 정보를 제공해야 한다.
- L[1204–1204](../../upstream/krds/raw/components/component_03_04.html:1204): 활성화된 메뉴 정보가 스크린 리더로 전달될 수 있도록 한다.
- L[1205–1205](../../upstream/krds/raw/components/component_03_04.html:1205): 인디케이터가 시각적으로만 구분되는 것이 아니라 스크린 리더로도 전달될 수 있도록 WAI-ARIA aria-current 속성을 제공한다. 현재 탐색 중인 화면에 대한 링크인 경우 aria-current="page" 속성을 추가한다.
- L[1212–1212](../../upstream/krds/raw/components/component_03_04.html:1212): 메뉴 링크는 키보드로 탐색할 수 있도록 한다.
- L[1213–1213](../../upstream/krds/raw/components/component_03_04.html:1213): 사이드 메뉴의 링크는 반드시 키보드가 접근할 수 있도록 제공해야 한다. 사용자가 키보드를 이용하여 영역을 확장하거나 축소하고 목록을 탐색할 수 있는지 점검해야 한다.
- L[1221–1221](../../upstream/krds/raw/components/component_03_04.html:1221): 키보드의 초점은 메뉴의 계층 순서대로 이동하도록 한다.
- L[1222–1222](../../upstream/krds/raw/components/component_03_04.html:1222): 키보드를 이용하여 메뉴를 탐색하는 경우, 키보드의 탐색 위치를 표시하는 초점이 메뉴의 계층 순서에 맞게 이동되도록 제공해야 한다. 문서에 메뉴의 계층 구조를 표현하지 않거나 임의로 키보드 초점의 이동 순서를 조작하면 보조 기술 사용자는 메뉴 탐색에 혼동을 느끼게 된다.
- L[1229–1229](../../upstream/krds/raw/components/component_03_04.html:1229): 스크린 리더에서 하위 수준 메뉴의 확장/축소 상태를 확인할 수 있도록 한다.
- L[1230–1230](../../upstream/krds/raw/components/component_03_04.html:1230): aria-expanded 속성이나 title 속성을 활용하여 하위 메뉴 영역의 활성화 상태 정보가 스크린 리더에 탐지될 수 있도록 해야 한다.
- L[1236–1236](../../upstream/krds/raw/components/component_03_04.html:1236): 축소된 메뉴 링크에 보조 기술이 접근되지 않도록 제공한다.
- L[1237–1237](../../upstream/krds/raw/components/component_03_04.html:1237): 시각적으로 확인할 수 없는 메뉴 링크에 보조 기술이 접근하게 되면, 보조 기술 사용자들은 의도와 상관없이 숨겨진 링크에 모두 접근해야 한다.

### 상호작용 가이드라인

- L[1249–1249](../../upstream/krds/raw/components/component_03_04.html:1249): 상호작용 가이드라인
- L[1251–1251](../../upstream/krds/raw/components/component_03_04.html:1251): 메뉴 링크 탐색
- L[1269–1272](../../upstream/krds/raw/components/component_03_04.html:1269): Enter 연결된 링크 목적지로 이동한다.
- L[1273–1276](../../upstream/krds/raw/components/component_03_04.html:1273): Click 연결된 링크 목적지로 이동한다.
- L[1277–1280](../../upstream/krds/raw/components/component_03_04.html:1277): Tab, Shift + Tab 시각적으로 표시된 메뉴 링크에 순차적으로 접근한다.
- L[1287–1287](../../upstream/krds/raw/components/component_03_04.html:1287): 메뉴 영역 확장 및 축소
- L[1305–1312](../../upstream/krds/raw/components/component_03_04.html:1305): Click 꺾쇠 아이콘이 있는 메뉴 링크가 초점을 가진 상태에서 마우스 Click 이벤트가 발생하였을 때 하위 수준 메뉴가 펼쳐지거나 접혀야 한다. 하나의 하위 링크 목록의 확장 상태는 다른 하위 링크 목록에 영향을 미치지 않는다. 즉, 어떤 하위 메뉴가 확장되어 있는 상태에서 다른 하위 링크 목록이 확장되더라도 기존에 확장된 링크 목록의 확장 상태가 유지되어야 한다.
- L[1313–1320](../../upstream/krds/raw/components/component_03_04.html:1313): Enter 꺾쇠 아이콘이 있는 메뉴 링크가 초점을 가진 상태에서 키보드 Enter 이벤트가 발생하였을 때 하위 수준 메뉴가 펼쳐지거나 접혀야 한다. 하나의 하위 링크 목록의 확장 상태는 다른 하위 링크 목록에 영향을 미치지 않는다. 즉, 어떤 하위 메뉴가 확장되어 있는 상태에서 다른 하위 링크 목록이 확장되더라도 기존에 확장된 링크 목록의 확장 상태가 유지되어야 한다.

### 예시

- L[1338–1338](../../upstream/krds/raw/components/component_03_04.html:1338): 예시
- L[1342–1342](../../upstream/krds/raw/components/component_03_04.html:1342): 기본
- L[1441–1441](../../upstream/krds/raw/components/component_03_04.html:1441): 기본 코드 확인하기

### 마크업 가이드

- L[1488–1488](../../upstream/krds/raw/components/component_03_04.html:1488): 마크업 가이드
- L[1491–1491](../../upstream/krds/raw/components/component_03_04.html:1491): CSS 선택자
- L[1511–1514](../../upstream/krds/raw/components/component_03_04.html:1511): 전체영역 .krds-side-navigation
- L[1515–1518](../../upstream/krds/raw/components/component_03_04.html:1515): 헤더 .lnb-tit
- L[1519–1524](../../upstream/krds/raw/components/component_03_04.html:1519): 기본 목록(1depth) .lnb-list .lnb-item 활성화 상태 .lnb-btn.selected
- L[1525–1528](../../upstream/krds/raw/components/component_03_04.html:1525): 링크 .lnb-btn.lnb-link
- L[1529–1532](../../upstream/krds/raw/components/component_03_04.html:1529): 하위 목록 드롭다운 .lnb-btn.lnb-toggle
- L[1533–1538](../../upstream/krds/raw/components/component_03_04.html:1533): 하위 목록(2depth) .lnb-submenu .lnb-subitem 활성화 상태 .lnb-btn.selected
- L[1539–1542](../../upstream/krds/raw/components/component_03_04.html:1539): 링크 .lnb-btn.lnb-link
- L[1543–1546](../../upstream/krds/raw/components/component_03_04.html:1543): 하위 목록 팝업 .lnb-btn.lnb-toggle-popup
- L[1547–1552](../../upstream/krds/raw/components/component_03_04.html:1547): 하위 목록(3depth) .lnb-submenu-lv2 활성화 상태 .lnb-btn.selected
- L[1562–1562](../../upstream/krds/raw/components/component_03_04.html:1562): JS
- L[1581–1585](../../upstream/krds/raw/components/component_03_04.html:1581): krds_sideNavigation init() 초기화 및 주요 이벤트 실행
- L[1586–1589](../../upstream/krds/raw/components/component_03_04.html:1586): setupSideNavLists() 사이드 메뉴 설정
- L[1590–1593](../../upstream/krds/raw/components/component_03_04.html:1590): setupToggleEvents() 하위 목록 토글 설정
- L[1594–1597](../../upstream/krds/raw/components/component_03_04.html:1594): setupPopupEvents() 하위 목록 팝업 설정
- L[1625–1625](../../upstream/krds/raw/components/component_03_04.html:1625): 개발 시 접근성 관련 주의 사항
- L[1627–1627](../../upstream/krds/raw/components/component_03_04.html:1627): 키보드 탐색 시 초점이 순차적으로 이동하는지 확인한다.
- L[1628–1628](../../upstream/krds/raw/components/component_03_04.html:1628): 하위메뉴가 있는경우 하위메뉴 열림/닫힘을 wai-aria 속성 등으로 표편해주고 있는지 확인한다.

Inline preserved example markup (reference, not the public native API): L[1347–1435](../../upstream/krds/raw/components/component_03_04.html:1347)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Recorded independent decision: The accepted two-level simultaneously visible layout preserves deeper information through explicit progressive disclosure. Third-level example selectors are not permission to show all levels simultaneously.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1446 `../../code/side_navigation.html`, L1612 `../../../resources/js/examples/krds_sideNavigation.js`, L1640 `./variable/side_navigation.html`. Do not infer unseen contents.
- 10 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Accepted independent resolution

The accepted two-level simultaneously visible layout preserves deeper information through explicit progressive disclosure. Third-level example selectors are not permission to show all levels simultaneously.

## Shared implementation handoff

The exact semantic interface is `SideNavigationContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
