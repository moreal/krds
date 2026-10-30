# Breadcrumb

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `breadcrumb`; Korean name 브레드크럼; export `Breadcrumb`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_03_03](https://www.krds.go.kr/html/site/component/component_03_03.html); preserved [HTML](../../upstream/krds/raw/components/component_03_03.html). Retrieved `2026-10-29T23:28:02.993Z`; `76569` bytes; SHA-256 `d3bc6305143388437ad54f4b099daa1f0cb4643170ee594522fb6603c2c48aca`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `default`, `collapsed`, `narrow`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Named <nav aria-label="브레드크럼"> with <ol><li>. First item links home; include every parent level even if no destination exists (plain text then). Separator is hidden from AT, with visible 3:1 contrast. Breadcrumb precedes page heading; parent-last mode omits current title only when no other content intervenes.

## Plain semantic API

Independent API: items {id,label,href?}[], home {href,label}, currentItem? {id,label}, omitCurrent=true, maxVisible=4 desktop/2 narrow. Ellipsis directly follows home and is descriptive noninteractive text, not a fabricated expand action. Items contain ancestors/parents only, excluding Home and the current page. `omitCurrent` controls only the separate explicit `currentItem`; never drop the last parent or infer current from a missing href. A missing parent href renders text and remains present. `omitCurrent=false` requires currentItem and appends it as noninteractive aria-current=page text. Home is always the separate first item.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Native Tab/Shift+Tab and Enter apply only to links; non-destinations and ellipsis are not tab stops. Preserve complete accessible hierarchy when visually collapsing intermediate path without creating invisible focusable links.

## Responsive/mobile requirements

One line; five-plus paths collapse after home; narrow mode shows home and last parent with ellipsis between. Last label may truncate only when still needed after path reduction; full accessible name remains.

## Forms, reset and composition

No form/reset/IME behavior.

## Asset, integration and composition completion

Host provides true hierarchy/destinations and adjacent page title, not visit history. Completion includes parent-last placement and hierarchy fixture. No router dependency required.

## Stable parts and states

root, list, item, link, home, separator, ellipsis; current,collapsed.

All rendered owned parts use `data-krds-component="breadcrumb"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Home href is actual service root.
2. Parent without destination is text rather than fake link.
3. Separators are absent from a11y output.
4. Narrow deep path keeps home/last parent and communicates omitted hierarchy.
5. Tab visits only visible true links.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`breadcrumb--default`, `breadcrumb--deep-collapsed`, `breadcrumb--missing-parent-href`, `breadcrumb--narrow-long-label`, `breadcrumb--parent-last-heading`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_03_03.html:883): 구조
- L[895–895](../../upstream/krds/raw/components/component_03_03.html:895): a. 홈 아이콘과 레이블 브레드크럼 목록의 첫 번째 항목으로 메인 화면으로 이동하는 링크로 작동함
- L[896–896](../../upstream/krds/raw/components/component_03_03.html:896): b. 상위 구조 탐색 중인 화면의 상위 수준의 정보 구조를 표시하는 텍스트로 연결 가능한 페이지가 존재하는 경우 링크로 작동함
- L[892–898](../../upstream/krds/raw/components/component_03_03.html:892): 1. 경로 a. 홈 아이콘과 레이블 브레드크럼 목록의 첫 번째 항목으로 메인 화면으로 이동하는 링크로 작동함 b. 상위 구조 탐색 중인 화면의 상위 수준의 정보 구조를 표시하는 텍스트로 연결 가능한 페이지가 존재하는 경우 링크로 작동함
- L[899–902](../../upstream/krds/raw/components/component_03_03.html:899): 2. 말줄임표 페이지 링크 표시 개수를 초과하는 경우 축약된 경로가 있음을 안내하기 위해 제공됨. 말줄임표는 항상 홈 아이콘 링크 다음 요소로 제공됨
- L[903–906](../../upstream/krds/raw/components/component_03_03.html:903): 3. 구분자 브레드크럼 항목을 구분하기 위한 구분 기호. 화면 간의 시각적 계층 구조를 나타냄

### 용례

- L[914–914](../../upstream/krds/raw/components/component_03_03.html:914): 용례
- L[916–916](../../upstream/krds/raw/components/component_03_03.html:916): 사용하기 적합하지 않은 경우
- L[921–921](../../upstream/krds/raw/components/component_03_03.html:921): 탐색 구조의 깊이가 2단계인 사이트에는 탐색 경로가 존재하지 않으며, 메인 메뉴와 메뉴의 활성화 상태 인디케이터 정보를 통해 탐색 위치를 파악할 수 있으므로 탐색 수단으로 브레드크럼을 제공할 필요가 없다.
- L[918–923](../../upstream/krds/raw/components/component_03_03.html:918): 탐색 계층 구조가 1수준인 사이트 탐색 구조의 깊이가 2단계인 사이트에는 탐색 경로가 존재하지 않으며, 메인 메뉴와 메뉴의 활성화 상태 인디케이터 정보를 통해 탐색 위치를 파악할 수 있으므로 탐색 수단으로 브레드크럼을 제공할 필요가 없다.
- L[927–927](../../upstream/krds/raw/components/component_03_03.html:927): 메인 페이지나 랜딩 페이지는 정보 구조의 최상위 수준이므로 브레드크럼을 사용하지 않는 것이 적절하다.
- L[924–929](../../upstream/krds/raw/components/component_03_03.html:924): 메인 또는 랜딩 페이지 메인 페이지나 랜딩 페이지는 정보 구조의 최상위 수준이므로 브레드크럼을 사용하지 않는 것이 적절하다.
- L[933–933](../../upstream/krds/raw/components/component_03_03.html:933): 진행 상황을 표시하고자 하는 경우에는 단계 식별자나 진행 상황 표시기를 사용해야 한다.
- L[930–935](../../upstream/krds/raw/components/component_03_03.html:930): 진행 상황 표시 진행 상황을 표시하고자 하는 경우에는 단계 식별자나 진행 상황 표시기를 사용해야 한다.

### 사용성 가이드라인

- L[943–943](../../upstream/krds/raw/components/component_03_03.html:943): 사용성 가이드라인
- L[946–946](../../upstream/krds/raw/components/component_03_03.html:946): 브레드크럼 목록의 가장 첫 번째 항목으로 메인 화면 링크를 제공한다.
- L[947–947](../../upstream/krds/raw/components/component_03_03.html:947): 브레드크럼 목록의 가장 첫 번째 항목은 메인 화면 링크여야하며, 실제 사용자가 방문한 웹사이트의 메인 화면으로 연결되어야 한다.
- L[950–950](../../upstream/krds/raw/components/component_03_03.html:950): 브레드크럼 목록의 가장 마지막 항목으로 현재 화면의 상위 화면 링크를 제공한다.
- L[951–951](../../upstream/krds/raw/components/component_03_03.html:951): 본문 상단에 명확한 본문 제목이 제공되고 있는 경우, 브레드크럼의 마지막 항목으로 현재 화면의 경로를 생략하고 상위 화면을 경로로 제공할 수 있다. 이때 브레드크럼과 본문 제목 사이에 다른 요소가 존재해서는 안 된다.
- L[963–963](../../upstream/krds/raw/components/component_03_03.html:963): 상위 화면으로 연결되는 링크가 없는 경우에도 항상 현재 화면의 전체 정보 계층 구조를 표시한다.
- L[964–964](../../upstream/krds/raw/components/component_03_03.html:964): 연결될 수 있는 상위 화면이 없는 경우에는 해당 텍스트가 링크로 작동하지 않도록 하고 링크를 변별하기 위한 밑줄, 마우스오버(Mouseover) 효과를 제거한다.
- L[967–967](../../upstream/krds/raw/components/component_03_03.html:967): 브레드크럼 텍스트 경로가 링크임을 인지할 수 있는 시각적 단서를 제공한다.
- L[968–968](../../upstream/krds/raw/components/component_03_03.html:968): 텍스트 아래에 명도 대비 기준을 충족하는 밑줄을 제공하고 마우스오버(Mouseover) 효과를 적용하여 링크로 작동함을 사용자가 명확하게 인지할 수 있도록 해야 한다.
- L[971–971](../../upstream/krds/raw/components/component_03_03.html:971): 브레드크럼은 단일 행으로 제공한다.
- L[972–973](../../upstream/krds/raw/components/component_03_03.html:972): 브레드크럼이 여러 줄로 제공되면 탐색 경로의 계층 구조를 적절하게 보여줄 수 없다. 화면 너비가 충분한 경우 브레드크럼은 메인 화면 링크를 포함하여 최대 4개의 링크를 표시한다. 경로가 5개 이상인 경우, 메인 화면 링크 다음 수준의 계층 구조를 말줄임표로 축약함으로써 브레드크럼이 한 줄로 구성되도록 한다. 만약 4개 이내의 경로만 표시하고 있음에도 줄바꿈이 발생하는 경우 가장 마지막 링크를 축약할 수 있다.
- L[984–984](../../upstream/krds/raw/components/component_03_03.html:984): 브레드크럼은 항상 본문 제목의 왼쪽 상단에 표시한다.
- L[985–985](../../upstream/krds/raw/components/component_03_03.html:985): 브레드크럼을 제목 상단에 배치함으로써 브레드크럼의 가장 마지막 경로 텍스트와 현재 화면의 제목 텍스트가 탐색 경로로 자연스럽게 이어질 수 있다. 또한 모든 화면에서 일관성 있는 영역에 배치되므로 탐색 경로를 보다 효과적으로 인지할 수 있다.
- L[988–988](../../upstream/krds/raw/components/component_03_03.html:988): 브레드크럼 경로 링크 간 간격을 충분히 제공한다.
- L[989–989](../../upstream/krds/raw/components/component_03_03.html:989): 다양한 화면 크기를 고려하여 클릭 또는 터치 가능한 충분한 영역을 제공하고 인접한 경로 링크를 실수로 실행하지 않도록 적절한 간격을 제공해야 한다.
- L[992–992](../../upstream/krds/raw/components/component_03_03.html:992): 브레드크럼이 메인 메뉴나 사이드 메뉴를 대체해서는 안 된다.
- L[993–994](../../upstream/krds/raw/components/component_03_03.html:993): 브레드크럼은 탐색 중인 화면의 상위 경로로 이동하는 데 사용되는 탐색 수단으로서 메인 메뉴와 사이드 메뉴를 대체하여 사용할 수 없다. 또한 브레드크럼 형태의 내비게이션에 메인 메뉴나 사이드 메뉴 역할과 기능을 동시에 제공하는 경우 사용자가 혼동할 수 있으므로 혼용하여 사용하지 않는 것이 적절하다.

### 플랫폼에 대한 고려 사항

- L[1006–1006](../../upstream/krds/raw/components/component_03_03.html:1006): 플랫폼에 대한 고려 사항
- L[1009–1009](../../upstream/krds/raw/components/component_03_03.html:1009): 화면 너비가 충분하지 않은 경우 첫 번째 경로와 마지막 경로만 표시한다.
- L[1010–1010](../../upstream/krds/raw/components/component_03_03.html:1010): 첫 번째 경로는 메인 화면 링크, 마지막 링크는 현재 화면의 상위 화면 링크로 일관성 있게 제공한다. 이때, 첫 번째 경로와 마지막 경로 사이에 말줄임표를 제공함으로써 탐색 경로가 축약되어 있음을 사용자가 인지할 수 있도록 해야 한다.

### 접근성 가이드라인

- L[1121–1121](../../upstream/krds/raw/components/component_03_03.html:1121): 접근성 가이드라인
- L[1124–1124](../../upstream/krds/raw/components/component_03_03.html:1124): 경로 목록을 &lt;nav&gt; 구획으로 감싸고 적절한 구획 제목을 제공한다.
- L[1125–1125](../../upstream/krds/raw/components/component_03_03.html:1125): 브레드크럼 목록을 &lt;nav&gt; 구획으로 감싸고 구획 태그에 aria-label="브레드크럼"으로 구획 제목을 제공함으로써 스크린 리더로 구획을 빠르게 탐색하고 정보 역할을 인지할 수 있도록 해야 한다.
- L[1132–1132](../../upstream/krds/raw/components/component_03_03.html:1132): 순서 있는 목록을 사용한다.
- L[1133–1133](../../upstream/krds/raw/components/component_03_03.html:1133): 목록과 항목을 &lt;ol&gt;, &lt;li&gt;로 마크업하여 스크린 리더에서 계층 구조와 깊이를 빠르게 탐지할 수 있도록 제공한다.
- L[1140–1140](../../upstream/krds/raw/components/component_03_03.html:1140): 구분자는 배경과 3:1 이상의 명도 대비를 갖도록 표현한다.
- L[1141–1141](../../upstream/krds/raw/components/component_03_03.html:1141): 구분자는 경로 항목 간 계층 구조가 존재함을 시각적으로 안내하는 정보이기 때문에 인접한 배경과 최소 3:1 이상의 명도 대비를 가져야 한다.
- L[1148–1148](../../upstream/krds/raw/components/component_03_03.html:1148): 스크린 리더에서 구분자 정보가 탐지되지 않도록 한다.
- L[1149–1149](../../upstream/krds/raw/components/component_03_03.html:1149): &lt;ol&gt;, &lt;li&gt; 구조를 통해 계층 구조 정보를 파악할 수 있으므로 정보가 중복되지 않도록 스크린 리더에서 숨겨야 한다.

### 상호작용 가이드라인

- L[1160–1160](../../upstream/krds/raw/components/component_03_03.html:1160): 상호작용 가이드라인
- L[1162–1162](../../upstream/krds/raw/components/component_03_03.html:1162): 탐색
- L[1180–1183](../../upstream/krds/raw/components/component_03_03.html:1180): Tab, Shift + Tab Tab 키와 Shift + Tab 키를 누르면 브레드크럼 링크를 순차적으로 탐색한다.
- L[1190–1190](../../upstream/krds/raw/components/component_03_03.html:1190): 관련 페이지로 이동
- L[1208–1211](../../upstream/krds/raw/components/component_03_03.html:1208): Click 링크인 경로 텍스트를 Click 하면 연결된 페이지로 이동한다.
- L[1212–1215](../../upstream/krds/raw/components/component_03_03.html:1212): Enter 링크에 초점이 있는 상태에서 Enter 키를 누르면 연결된 페이지로 이동한다.

### 예시

- L[1234–1234](../../upstream/krds/raw/components/component_03_03.html:1234): 예시
- L[1238–1238](../../upstream/krds/raw/components/component_03_03.html:1238): 기본
- L[1261–1261](../../upstream/krds/raw/components/component_03_03.html:1261): 기본 코드 확인하기

### 마크업 가이드

- L[1281–1281](../../upstream/krds/raw/components/component_03_03.html:1281): 마크업 가이드
- L[1284–1284](../../upstream/krds/raw/components/component_03_03.html:1284): CSS 선택자
- L[1301–1304](../../upstream/krds/raw/components/component_03_03.html:1301): 전체영역 .krds-breadcrumb-wrap
- L[1305–1308](../../upstream/krds/raw/components/component_03_03.html:1305): 목록 ol.breadcrumb
- L[1309–1312](../../upstream/krds/raw/components/component_03_03.html:1309): 홈 li.home

Inline preserved example markup (reference, not the public native API): L[1243–1255](../../upstream/krds/raw/components/component_03_03.html:1243)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Recorded independent decision: Keep visually omitted intermediate hierarchy as noninteractive accessible text in DOM order, with any decorative ellipsis hidden from assistive technology. Only actually visible endpoint navigation links are sequentially focusable. Never invent an ellipsis expand control.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1266 `../../code/breadcrumb.html`, L1327 `./variable/breadcrumb.html`. Do not infer unseen contents.
- 8 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Accepted independent resolution

Keep visually omitted intermediate hierarchy as noninteractive accessible text in DOM order, with any decorative ellipsis hidden from assistive technology. Only actually visible endpoint navigation links are sequentially focusable. Never invent an ellipsis expand control.

## Shared implementation handoff

The exact semantic interface is `BreadcrumbContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
