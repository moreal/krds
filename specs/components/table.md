# Table

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `table`; Korean name 표; export `Table`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_04_11](https://www.krds.go.kr/html/site/component/component_04_11.html); preserved [HTML](../../upstream/krds/raw/components/component_04_11.html). Retrieved `2026-10-29T23:28:03.975Z`; `74382` bytes; SHA-256 `62101d3ac5f3758b0a31b07862f3e0575cb185fb871357f46dd0e43877d314d0`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `basic`, `sortable`, `narrow-scroll`, `narrow-stacked`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Real <table> with caption, thead/tbody, th scope and appropriate row headers/tfoot; complex relationships use headers/id. Caption explains header content per development note. Empty data cells show dash. Quantitative numbers right-align; text/nominal numbers left-align.

## Plain semantic API

Independent API: caption, columns {id,label,kind,sortable?}[], rows {id,cells}[], rowHeaderColumnId? naming one existing column, sort {columnId,direction}/onSortChange optional. No sorting behavior if absent. When sortable, initial sort is first column as official guidance. Header button inside th; aria-sort tracks actual order. With rowHeaderColumnId, that column renders native th scope=row with a stable ID, and every data cell references its row/column headers as required. Unknown rowHeaderColumnId is a configuration error; no automatic row-header inference from cell text/kind.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Ordinary table is read-only and non-tabbable except contained links/buttons. Sort activation retains header-button focus. Overflow wrapper has name and focus only when needed; provide simple click/tap scroll controls, not drag-only traversal.

## Responsive/mobile requirements

Simple single-dimension tables may stack header/data pairs while preserving associations; complex tables use horizontal region scroll. Keep horizontal scrollbar discoverable and data unclipped. Avoid restrictive modal/accordion placements.

## Forms, reset and composition

No table form/reset state. Embedded controls retain own semantics; selection-heavy interaction belongs to StructuredList.

## Asset, integration and composition completion

Host owns data/format/sorting handler; local example actually reorders rows and preserves header association. Completion requires native semantics and conditional sorting, not a div grid.

## Stable parts and states

root, caption, head, body, row, header-cell, cell, sort-trigger, scroll-region, scroll-previous, scroll-next; ascending,descending,overflow.

All rendered owned parts use `data-krds-component="table"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Screen-reader header associations match data.
2. Missing cells show dash.
3. Quantitative and nominal numbers use appropriate alignment.
4. Unconfigured table has no sort controls.
5. Sort button changes real order and aria-sort without focus loss.
6. Narrow complex table can be scrolled by simple buttons.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`table--basic`, `table--row-headers`, `table--missing-cells`, `table--sortable`, `table--narrow-scroll`, `table--narrow-stacked`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[885–885](../../upstream/krds/raw/components/component_04_11.html:885): 구조
- L[891–891](../../upstream/krds/raw/components/component_04_11.html:891): 1. 헤더 각 데이터 셀의 제목
- L[892–892](../../upstream/krds/raw/components/component_04_11.html:892): 2. 행 서로 다른 유형의 데이터를 보여줌
- L[893–893](../../upstream/krds/raw/components/component_04_11.html:893): 3. 디바이더 행과 행 사이를 시각적으로 구분하는 수단
- L[894–894](../../upstream/krds/raw/components/component_04_11.html:894): 4. 데이터 셀 행을 구성하는 데이터 요소

### 용례

- L[902–902](../../upstream/krds/raw/components/component_04_11.html:902): 용례
- L[904–904](../../upstream/krds/raw/components/component_04_11.html:904): 사용하기 적합한 경우
- L[909–909](../../upstream/krds/raw/components/component_04_11.html:909): 예) 통계 데이터
- L[906–911](../../upstream/krds/raw/components/component_04_11.html:906): 표 형식의 데이터를 제공하는 경우 예) 통계 데이터
- L[915–915](../../upstream/krds/raw/components/component_04_11.html:915): 에) 리소스 목록, 게시물 목록
- L[912–917](../../upstream/krds/raw/components/component_04_11.html:912): 다수의 항목에 대해서 유사한 방식으로 구조화된 정보를 표현하는 경우 에) 리소스 목록, 게시물 목록
- L[921–921](../../upstream/krds/raw/components/component_04_11.html:921): 사용하기 적합하지 않은 경우
- L[926–926](../../upstream/krds/raw/components/component_04_11.html:926): 콘텐츠의 의미와 맥락을 고려하였을 때 정의 목록, 순서 있는 목록, 순서 없는 목록, 제목과 문단의 조합으로 표현하는 것이 적합한 경우에는 표를 사용하지 않을 것을 권장한다. 데이터 셀 내의 정보가 복잡하거나 계층적인 구조를 가진 경우에도 마찬가지이다.
- L[923–928](../../upstream/krds/raw/components/component_04_11.html:923): 다른 콘텐츠 형식이 더 적합한 경우 콘텐츠의 의미와 맥락을 고려하였을 때 정의 목록, 순서 있는 목록, 순서 없는 목록, 제목과 문단의 조합으로 표현하는 것이 적합한 경우에는 표를 사용하지 않을 것을 권장한다. 데이터 셀 내의 정보가 복잡하거나 계층적인 구조를 가진 경우에도 마찬가지이다.
- L[932–932](../../upstream/krds/raw/components/component_04_11.html:932): 막대그래프와 같은 차트나 인포그래픽으로 정보를 제공하는 것이 보다 직관적일 수 있다.
- L[929–934](../../upstream/krds/raw/components/component_04_11.html:929): 데이터 간 복잡한 관계를 표현해야 하는 경우 막대그래프와 같은 차트나 인포그래픽으로 정보를 제공하는 것이 보다 직관적일 수 있다.
- L[938–938](../../upstream/krds/raw/components/component_04_11.html:938): 요소를 사각형으로 배치하기 위한 목적으로 표를 사용해서는 안 된다. 그리드, 플렉스 박스 등 적절한 스타일 속성을 활용해야 한다.
- L[935–940](../../upstream/krds/raw/components/component_04_11.html:935): 그리드를 표현하고자 하는 경우 요소를 사각형으로 배치하기 위한 목적으로 표를 사용해서는 안 된다. 그리드, 플렉스 박스 등 적절한 스타일 속성을 활용해야 한다.
- L[944–944](../../upstream/krds/raw/components/component_04_11.html:944): 카드와 같은 유연한 레이아웃을 사용하는 것이 적합하다.
- L[941–946](../../upstream/krds/raw/components/component_04_11.html:941): 데이터 구조에 일관성이 없는 경우 카드와 같은 유연한 레이아웃을 사용하는 것이 적합하다.
- L[950–950](../../upstream/krds/raw/components/component_04_11.html:950): 표 컴포넌트 대신 구조화 목록 컴포넌트를 사용해야 한다.
- L[947–952](../../upstream/krds/raw/components/component_04_11.html:947): 데이터와 관련하여 복잡한 상호작용이 필요한 경우 표 컴포넌트 대신 구조화 목록 컴포넌트를 사용해야 한다.

### 사용성 가이드라인

- L[960–960](../../upstream/krds/raw/components/component_04_11.html:960): 사용성 가이드라인
- L[963–963](../../upstream/krds/raw/components/component_04_11.html:963): 표는 데이터 잘림 없이 표시될 수 있는 영역에 사용한다.
- L[964–964](../../upstream/krds/raw/components/component_04_11.html:964): 아코디언, 모달과 같이 공간의 제한으로 인해 데이터가 잘리거나 데이터 확인을 위해 가로 스크롤을 사용해야 하는 영역에는 표를 사용하지 않아야 한다. 필요한 경우, 각각의 열이 아래로 떨어지도록 배치한다.
- L[971–971](../../upstream/krds/raw/components/component_04_11.html:971): 열의 최소 너비는 콘텐츠의 길이를 고려하여 설정한다.
- L[972–972](../../upstream/krds/raw/components/component_04_11.html:972): 데이터 셀을 구성하는 텍스트는 가능한 3줄을 넘어가지 않도록 하고 행과 행 사이의 간격을 적절하게 제공하여 사용자가 한 번에 많은 데이터를 비교할 수 있도록 해야 한다.
- L[975–975](../../upstream/krds/raw/components/component_04_11.html:975): 열 구분선의 사용을 지양한다.
- L[976–976](../../upstream/krds/raw/components/component_04_11.html:976): 열 구분선은 표 콘텐츠를 구조화하거나 구분하는 데 도움이 될 수 있으나 시각적인 복잡성을 높이므로 반드시 필요한 경우를 제외하고 사용하지 않는 것이 바람직하다.
- L[979–979](../../upstream/krds/raw/components/component_04_11.html:979): 양적 데이터를 전달하기 위한 숫자는 오른쪽으로 정렬한다.
- L[980–980](../../upstream/krds/raw/components/component_04_11.html:980): 개수, 퍼센트, 용량 등의 양적 데이터는 셀에서 오른쪽으로 정렬하여 사용자가 숫자를 더 잘 비교할 수 있도록 해야 한다. 숫자를 오른쪽으로 정렬하면 단위 구분 기호(, %, KB 등)가 일관된 위치에 배치되므로 가독성을 높인다.
- L[983–983](../../upstream/krds/raw/components/component_04_11.html:983): 텍스트 데이터, 명목 데이터는 왼쪽으로 정렬한다.
- L[984–984](../../upstream/krds/raw/components/component_04_11.html:984): 일반적인 텍스트 데이터와 범주를 구분하기 위한 목적으로 사용되는 명목 데이터(예 - 날짜, 우편번호, 핸드폰 번호, IP주소 등)는 왼쪽으로 정렬하여 사용자가 데이터를 탐색하기 위해 일관된 위치에서 안구 운동을 시작할 수 있도록 해야 한다.
- L[987–987](../../upstream/krds/raw/components/component_04_11.html:987): 열의 개수를 최소화한다.
- L[988–988](../../upstream/krds/raw/components/component_04_11.html:988): 수평으로 길게 배치된 정보를 읽는 것보다 수직으로 배치된 정보를 읽는 것이 더 쉬우므로 표를 구성하는 열의 개수를 최소화하는 것이 좋다. 가능하다면 불필요하거나 상대적으로 덜 중요한 열을 제거하고, 행과 열을 전환하는 방법을 활용할 수 있다.
- L[991–991](../../upstream/krds/raw/components/component_04_11.html:991): 사용자가 원하는 대로 데이터를 정렬할 수 있는 기능을 제공한다.
- L[992–992](../../upstream/krds/raw/components/component_04_11.html:992): 데이터의 수가 많은 경우 데이터를 논리적인 순서에 따라 정렬하거나 검색, 필터링, 탐색하는 기능을 제공하면 사용자가 효율적으로 원하는 데이터를 발견할 수 있다. 열 헤더에 정렬 버튼이 제공되는 경우, 기본 상태는 가장 첫 번째 열을 기준으로 데이터가 정렬된 상태이다.
- L[995–995](../../upstream/krds/raw/components/component_04_11.html:995): 데이터 값이 존재하지 않는 경우 셀을 비워두지 않고 대시(-)를 제공한다.
- L[996–996](../../upstream/krds/raw/components/component_04_11.html:996): 데이터 셀에 아무런 텍스트가 표시되지 않으면 사용자에게 혼동을 줄 수 있으므로 빈 셀에는 대시 기호를 표시하여 이용할 수 있는 정보가 존재하지 않음을 안내해야 한다.

### 플랫폼에 대한 고려 사항

- L[1004–1004](../../upstream/krds/raw/components/component_04_11.html:1004): 플랫폼에 대한 고려 사항
- L[1007–1007](../../upstream/krds/raw/components/component_04_11.html:1007): 화면 너비가 충분하지 않은 경우 데이터의 배열 방식의 변경을 고려한다.
- L[1008–1008](../../upstream/krds/raw/components/component_04_11.html:1008): 한 줄의 행 헤더 또는 열 헤더로 구성된 단일 차원의 단순한 표의 경우, 헤더 텍스트와 데이터 텍스트를 수직으로 배치를 변경할 수 있다.
- L[1019–1019](../../upstream/krds/raw/components/component_04_11.html:1019): 화면 너비가 충분하지 않은 경우 표 영역에 가로 스크롤을 사용하는 방안을 고려한다.
- L[1020–1021](../../upstream/krds/raw/components/component_04_11.html:1020): 행과 열 간의 관계 표현이 유지되어야 하거나 구성이 복잡하다면 셀의 배치를 변경하지 않고 표 섹션에 가로 스크롤을 생성할 수 있다. 만약 표에 열 헤더가 존재한다면 가로 스크롤의 위치가 변경되더라도 열 헤더를 화면의 왼쪽에 고정함으로써 데이터를 탐색하는 과정의 편의성을 높일 수 있다.

### 접근성 가이드라인

- L[1132–1132](../../upstream/krds/raw/components/component_04_11.html:1132): 접근성 가이드라인
- L[1135–1135](../../upstream/krds/raw/components/component_04_11.html:1135): 데이터의 구조를 적절하게 반영하여 마크업한다.
- L[1136–1136](../../upstream/krds/raw/components/component_04_11.html:1136): 표는 &lt;table&gt;로 마크업하고 &lt;caption&gt;, &lt;thead&gt;, &lt;th&gt;, &lt;tfoot&gt; 태그를 적절히 사용하여 시각적으로 표현된 정보의 구조가 스크린 리더를 통해서도 동등하게 전달될 수 있도록 해야 한다.
- L[1143–1143](../../upstream/krds/raw/components/component_04_11.html:1143): 가로 스크롤이 필요한 경우 단순한 동작으로 스크롤 위치를 조정할 수 있도록 한다.
- L[1144–1144](../../upstream/krds/raw/components/component_04_11.html:1144): 표 섹션이 스크롤되는 영역임을 인지할 수 있도록 가로 스크롤을 표시하고 버튼을 클릭하거나 탭하는 단순한 동작만으로도 스크롤 위치를 조정할 수 있도록 한다.

### 예시

- L[1164–1164](../../upstream/krds/raw/components/component_04_11.html:1164): 예시
- L[1168–1168](../../upstream/krds/raw/components/component_04_11.html:1168): 기본
- L[1213–1213](../../upstream/krds/raw/components/component_04_11.html:1213): 기본 코드 확인하기

### 마크업 가이드

- L[1234–1234](../../upstream/krds/raw/components/component_04_11.html:1234): 마크업 가이드
- L[1237–1237](../../upstream/krds/raw/components/component_04_11.html:1237): CSS 선택자
- L[1254–1257](../../upstream/krds/raw/components/component_04_11.html:1254): 전체영역 .krds-table-wrap
- L[1258–1261](../../upstream/krds/raw/components/component_04_11.html:1258): 테이블영역 .tbl
- L[1271–1271](../../upstream/krds/raw/components/component_04_11.html:1271): 개발 시 접근성 관련 주의 사항
- L[1273–1273](../../upstream/krds/raw/components/component_04_11.html:1273): 테이블에 th 속성이 있는경우 scope를 작성하여 테이블이 읽히는 방향을 정해주고 caption에 th 내용을 모두 넣어 설명해준다.

Inline preserved example markup (reference, not the public native API): L[1173–1207](../../upstream/krds/raw/components/component_04_11.html:1173)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Recorded independent decision: The host-authored caption must describe the purpose and all header meanings in natural language, retaining actual column/row header associations. Do not replace th labels with a caption or omit header explanation merely to shorten text. Wide-table copy still needs human editorial review, independent of native semantic completion.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1218 `../../code/table.html`, L1285 `./variable/table.html`. Do not infer unseen contents.
- 5 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Accepted independent resolution

The host-authored caption must describe the purpose and all header meanings in natural language, retaining actual column/row header associations. Do not replace th labels with a caption or omit header explanation merely to shorten text. Wide-table copy still needs human editorial review, independent of native semantic completion.

## Shared implementation handoff

The exact semantic interface is `TableContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
