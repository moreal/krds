# Pagination

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `pagination`; Korean name 페이지네이션; export `Pagination`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_03_06](https://www.krds.go.kr/html/site/component/component_03_06.html); preserved [HTML](../../upstream/krds/raw/components/component_03_06.html). Retrieved `2026-10-29T23:28:03.210Z`; `93930` bytes; SHA-256 `7c61e379ce568edd893e86d5b02bc85a3aab50f4e5103c5acbae5df606006c2d`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `number-links`, `direct-page`, `load-more`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Named <nav> tied to dataset; source order previous, <ul> number links, next, optional page input, total label, go button. First/last page always reachable except load-more. Current number removes href and carries aria-current=true. Ellipsis is noninteractive. Load-more sits after result list.

## Plain semantic API

Independent API: page/defaultPage=1, pageCount, hrefForPage(page), onPageChange({page}), variant=number-links, optional direct-page input, or load-more {shown,total,pending,onLoadMore,firstNewItemId}. Never derive page size from viewport. Range-invalid page input remains an editable string and reports an error without navigation.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Native anchors preserve navigation; current/unavailable links do not activate. Go/load-more are buttons (Enter/Space). After host appends results, load-more scrolls/focuses first added item, updates shown count, and preserves context on failure. Controlled props alone emit nothing.

## Responsive/mobile requirements

At most 11 numbers/ellipses desktop, seven narrow. Narrow previous/next row precedes number row visually while official DOM order remains unchanged. Dataset page count and per-page count stay stable across viewports.

## Forms, reset and composition

Direct page input has visible label and error relationship; no implicit surrounding form submission. Reset restores draft page text to actual page; IME does not trigger Go. Pagination itself contributes no form value.

## Asset, integration and composition completion

Host owns data loading, URLs, totals and successful-append confirmation. Local story uses fixed in-memory records; no fetch. Source load-more descriptive paragraph repeats direct-page text; rely on load-more structure/interaction rather than invent matching behavior.

## Stable parts and states

root, list, item, link, previous, next, ellipsis, input, total, go, load-more, count; current,disabled,pending,invalid.

All rendered owned parts use `data-krds-component="pagination"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. First/last and prior/next work at boundaries.
2. Current page has no href and announces current.
3. Direct input rejects zero/out-of-range without navigation.
4. Load-more focuses first newly inserted result after success only.
5. Viewport change does not alter dataset pagination.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Independent local specimen policy

Independent local specimen names: number/direct navigation is “페이지 이동”; the load-more navigation is “결과 더보기”, identifying its result-append purpose. Both remain named navigation landmarks, and the load-more action remains a real button after the result list.

## Required native stories

`pagination--number-links`, `pagination--direct-page`, `pagination--load-more`, `pagination--first-last-boundary`, `pagination--narrow-seven-items`, `pagination--load-failure`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_03_06.html:883): 구조
- L[885–885](../../upstream/krds/raw/components/component_03_06.html:885): 숫자 링크 목록
- L[890–893](../../upstream/krds/raw/components/component_03_06.html:890): 1. 이전/다음 버튼 화면 목록을 앞/뒤로 탐색하는 데 사용되는 버튼. 아이콘과 텍스트를 조합하여 제공하거나, 아이콘과 텍스트를 단독으로 사용할 수 있음
- L[894–897](../../upstream/krds/raw/components/component_03_06.html:894): 2. 숫자 링크 목록 표시된 숫자의 화면으로 이동할 수 있는 링크. 목록의 첫 번째 요소는 숫자 '1', 마지막 요소는 가장 마지막 화면의 숫자를 표시함
- L[898–901](../../upstream/krds/raw/components/component_03_06.html:898): 3. 말줄임표 번호 링크 사이에 생략된 숫자가 있음을 표시함
- L[902–905](../../upstream/krds/raw/components/component_03_06.html:902): 4. 현재 화면 식별자 사용자가 현재 탐색하고 있는 화면을 나타냄
- L[909–909](../../upstream/krds/raw/components/component_03_06.html:909): 직접 이동
- L[914–917](../../upstream/krds/raw/components/component_03_06.html:914): 1. 숫자 입력 필드 탐색하고자 하는 화면 번호를 입력할 수 있는 입력 필드. 입력 전에는 사용자가 현재 보고 있는 화면 번호를 보여줌
- L[918–921](../../upstream/krds/raw/components/component_03_06.html:918): 2. 전체 화면 수 레이블 페이지 숫자 입력 필드 오른쪽에 배치되어 전체 화면 수를 보여줌
- L[922–925](../../upstream/krds/raw/components/component_03_06.html:922): 3. 이동 버튼 실행 시 숫자 입력 필드에 입력된 숫자에 해당하는 화면으로 이동함
- L[929–929](../../upstream/krds/raw/components/component_03_06.html:929): 목록 확장
- L[934–937](../../upstream/krds/raw/components/component_03_06.html:934): 1. 더 보기 버튼 실행 시 항목을 추가적으로 표시함. '더 보기'라는 텍스트와 표시된 항목 수, 전체 항목 수를 안내하는 분수가 레이블로 제공됨

### 유형

- L[945–945](../../upstream/krds/raw/components/component_03_06.html:945): 유형
- L[949–949](../../upstream/krds/raw/components/component_03_06.html:949): 숫자 링크 목록
- L[950–950](../../upstream/krds/raw/components/component_03_06.html:950): 분할된 화면의 순서를 숫자로 표시한다. 숫자 링크를 눌러 원하는 순서의 화면 목록으로 직접 이동하거나 이전/다음 버튼을 눌러 화면을 순차적으로 탐색할 수 있다. 첫 화면과 마지막 화면 숫자 링크가 항상 표시되므로 사용자는 목록의 시작이나 끝으로 빠르게 이동할 수 있다.
- L[952–952](../../upstream/krds/raw/components/component_03_06.html:952): PC
- L[958–958](../../upstream/krds/raw/components/component_03_06.html:958): Mobile
- L[968–968](../../upstream/krds/raw/components/component_03_06.html:968): 화면 직접 이동
- L[969–969](../../upstream/krds/raw/components/component_03_06.html:969): 숫자 링크 목록과 함께 사용하며, 사용자가 원하는 화면 숫자를 직접 페이지 입력하여 이동할 수 있다. 숫자 링크 목록으로만 탐색하기 어려운 대규모의 데이터 목록 탐색에 적합하다.
- L[971–971](../../upstream/krds/raw/components/component_03_06.html:971): PC
- L[977–977](../../upstream/krds/raw/components/component_03_06.html:977): Mobile
- L[987–987](../../upstream/krds/raw/components/component_03_06.html:987): 목록 확장
- L[988–988](../../upstream/krds/raw/components/component_03_06.html:988): 숫자 링크 목록과 함께 사용하며, 사용자가 원하는 화면 숫자를 직접 페이지 입력하여 이동할 수 있다. 숫자 링크 목록으로만 탐색하기 어려운 대규모의 데이터 목록 탐색에 적합하다.

### 용례

- L[1000–1000](../../upstream/krds/raw/components/component_03_06.html:1000): 용례
- L[1002–1002](../../upstream/krds/raw/components/component_03_06.html:1002): 사용하기 적합한 경우
- L[1007–1007](../../upstream/krds/raw/components/component_03_06.html:1007): 데이터 집합에서 세부적인 정보를 확인하는 것이 아니라 특정 항목을 찾는 것이 중요한 경우, 데이터 집합을 여러 화면으로 구분하면 사용자가 데이터를 더 빨리 훑어 보고 탐색할 수 있다.
- L[1004–1009](../../upstream/krds/raw/components/component_03_06.html:1004): 데이터 집합에서 특정 항목을 찾는 것이 사용자의 목표일 때 데이터 집합에서 세부적인 정보를 확인하는 것이 아니라 특정 항목을 찾는 것이 중요한 경우, 데이터 집합을 여러 화면으로 구분하면 사용자가 데이터를 더 빨리 훑어 보고 탐색할 수 있다.
- L[1013–1013](../../upstream/krds/raw/components/component_03_06.html:1013): 데이터 집합을 한 화면에 표시하였을 때 목록의 높이가 뷰포트의 2배를 초과하거나, 전체 항목 개수가 20개를 초과하는 경우 페이지네이션의 사용을 검토한다.
- L[1010–1015](../../upstream/krds/raw/components/component_03_06.html:1010): 한 화면에 모든 콘텐츠를 표시하여 화면 로딩 시간이 오래 걸릴 때 데이터 집합을 한 화면에 표시하였을 때 목록의 높이가 뷰포트의 2배를 초과하거나, 전체 항목 개수가 20개를 초과하는 경우 페이지네이션의 사용을 검토한다.
- L[1019–1019](../../upstream/krds/raw/components/component_03_06.html:1019): 사용하기 적합하지 않은 경우
- L[1024–1024](../../upstream/krds/raw/components/component_03_06.html:1024): 긴 데이터 집합을 특정 주제나 범주로 구분하고자 하는 경우에는 별도 정보 구조로 포함시켜 사이드 메뉴를 통해 탐색하는 것이 적합하다.
- L[1021–1026](../../upstream/krds/raw/components/component_03_06.html:1021): 데이터 집합을 의미적으로 그룹화하고자 할 때 긴 데이터 집합을 특정 주제나 범주로 구분하고자 하는 경우에는 별도 정보 구조로 포함시켜 사이드 메뉴를 통해 탐색하는 것이 적합하다.
- L[1030–1030](../../upstream/krds/raw/components/component_03_06.html:1030): 데이터 집합을 한 화면에 표시하였을 때 목록의 높이가 뷰포트의 2배를 초과하지 않거나 전체 항목 개수가 20개 이내인 경우 한 화면에서 목록을 탐색하도록 하는 방안을 고려한다. 필요한 경우 필터링/조회 패턴을 활용하여 한 화면에 표시된 데이터 목록의 탐색을 도울 수 있다.
- L[1027–1032](../../upstream/krds/raw/components/component_03_06.html:1027): 전체 데이터 수가 적을 때 데이터 집합을 한 화면에 표시하였을 때 목록의 높이가 뷰포트의 2배를 초과하지 않거나 전체 항목 개수가 20개 이내인 경우 한 화면에서 목록을 탐색하도록 하는 방안을 고려한다. 필요한 경우 필터링/조회 패턴을 활용하여 한 화면에 표시된 데이터 목록의 탐색을 도울 수 있다.
- L[1036–1039](../../upstream/krds/raw/components/component_03_06.html:1036): 사용자가 화면을 아래로 스크롤할 때 추가적으로 데이터가 로드되는 무한 스크롤 기능을 사용하는 경우, 페이지네이션을 사용하지 않는다. 무한 스크롤은 키보드 사용자에게 문제를 야기할 수 있으므로 사용하지 않는 것이 좋으며, 항목 개수에 대한 추정치가 있고 사용자가 항목 목록의 끝으로 이동할 필요가 없을 때만 사용한다.
- L[1033–1041](../../upstream/krds/raw/components/component_03_06.html:1033): 무한 스크롤 기능을 사용할 때 사용자가 화면을 아래로 스크롤할 때 추가적으로 데이터가 로드되는 무한 스크롤 기능을 사용하는 경우, 페이지네이션을 사용하지 않는다. 무한 스크롤은 키보드 사용자에게 문제를 야기할 수 있으므로 사용하지 않는 것이 좋으며, 항목 개수에 대한 추정치가 있고 사용자가 항목 목록의 끝으로 이동할 필요가 없을 때만 사용한다.

### 사용성 가이드라인

- L[1049–1049](../../upstream/krds/raw/components/component_03_06.html:1049): 사용성 가이드라인
- L[1052–1052](../../upstream/krds/raw/components/component_03_06.html:1052): 페이지네이션에는 첫/마지막 화면, 이전/다음 화면으로 이동할 수 있는 수단을 제공한다.
- L[1053–1053](../../upstream/krds/raw/components/component_03_06.html:1053): 목록 확장형 페이지네이션을 제외하고 사용자는 어떤 페이지에서든 항상 첫 화면, 마지막 화면, 이전 화면, 다음 화면으로 이동할 수 있어야 한다.
- L[1056–1056](../../upstream/krds/raw/components/component_03_06.html:1056): 전체 화면 수를 표시한다.
- L[1057–1057](../../upstream/krds/raw/components/component_03_06.html:1057): 사용자가 전체 데이터 목록 수를 알 수 있도록 전체 화면 수를 제공해야 한다.
- L[1060–1060](../../upstream/krds/raw/components/component_03_06.html:1060): 번호 링크에 현재 화면 숫자를 강조하여 표현한다.
- L[1061–1061](../../upstream/krds/raw/components/component_03_06.html:1061): 사용자가 현재 몇 번째 화면을 탐색하는지 명확하게 변별할 수 있도록 현재 화면 숫자 링크를 적절하게 강조하여 표현한다. 목록 상단에 별도의 텍스트 정보를 제공함으로써 탐색 중인 화면의 인지를 도울 수 있다.
- L[1068–1068](../../upstream/krds/raw/components/component_03_06.html:1068): 페이지네이션은 전체 서비스에서 일관된 영역에 배치한다.
- L[1069–1069](../../upstream/krds/raw/components/component_03_06.html:1069): 페이지네이션은 유형에 상관없이 목록 하단에 중앙 정렬하여 사용자가 전체 사이트에 걸쳐 일관된 영역에서 접근할 수 있도록 한다.
- L[1072–1072](../../upstream/krds/raw/components/component_03_06.html:1072): 페이지네이션은 한 화면에 하나만 사용한다.
- L[1073–1073](../../upstream/krds/raw/components/component_03_06.html:1073): 페이지네이션을 이용하여 구분하고 탐색해야 할 항목이 한 화면에 여러 개 제공되면 복잡성이 증가하고 여러 개의 목록 및 페이지네이션의 용도와 역할 구분이 어려워진다.
- L[1076–1076](../../upstream/krds/raw/components/component_03_06.html:1076): 숫자 링크 목록에는 말줄임표를 포함하여 11개 이내의 항목을 표시한다.
- L[1077–1077](../../upstream/krds/raw/components/component_03_06.html:1077): 필요 이상으로 많은 숫자 링크 목록을 표시하면 인지적 부담이 증가한다. 화면 너비가 충분한 경우, 최대 11개의 항목을 표시하고 좁은 화면에서는 최대 7개의 항목을 표시한다.
- L[1080–1080](../../upstream/krds/raw/components/component_03_06.html:1080): 화면당 항목 수를 최적화한다.
- L[1081–1082](../../upstream/krds/raw/components/component_03_06.html:1081): 화면당 항목 수가 너무 많으면 사용자를 압도할 수 있고, 지나치게 적을 경우 정보 탐색이 불편할 수 있다. 각 화면에 표시되는 항목 수를 결정할 때는 화면 로딩 시간, 성능, 사용자의 스크롤 기본 설정 등을 고려한다. 사용자가 각 화면에 표시할 항목 수를 제어하는 컴포넌트를 필터링·정렬 옵션으로 추가하여 사용자가 원하는 방식대로 항목을 탐색하도록 할 수 있다.

### 플랫폼에 대한 고려 사항

- L[1090–1090](../../upstream/krds/raw/components/component_03_06.html:1090): 플랫폼에 대한 고려 사항
- L[1093–1093](../../upstream/krds/raw/components/component_03_06.html:1093): 화면 너비가 충분하지 않은 경우 이전/다음 버튼, 숫자 링크 목록을 수직으로 배치한다.
- L[1094–1095](../../upstream/krds/raw/components/component_03_06.html:1094): 화면 너비가 충분하지 않다면 데이터 목록 하단에 이전/다음 버튼을 배치하고 그 아래에 숫자 링크 목록을 배치한다. 선형적이고 순차적인 방식으로 탐색하는 수단을 더 쉽게 접근할 수 있는 영역에 배치하여, 작은 화면에서 일련의 숫자 링크 목록을 탐색하는 데서 발생하는 피로를 감소시키고 인접 영역을 실수로 터치하지 않도록 한다.
- L[1108–1108](../../upstream/krds/raw/components/component_03_06.html:1108): 화면 너비가 충분하지 않은 경우 숫자 링크 목록은 말줄임표를 포함하여 최대 7개 링크를 표시한다.
- L[1109–1109](../../upstream/krds/raw/components/component_03_06.html:1109): 더 많은 항목이 제공될 경우, 각 링크를 터치할 수 있는 충분한 영역을 확보하기 어렵다.
- L[1117–1117](../../upstream/krds/raw/components/component_03_06.html:1117): 화면 크기에 상관없이 전체 화면 수를 일정하게 유지한다.
- L[1118–1118](../../upstream/krds/raw/components/component_03_06.html:1118): 어떤 설정과 디바이스 환경에서 서비스를 이용하더라도 동일한 항목은 동일한 위치에서 찾을 수 있도록 전체 화면 수와 각 화면에 표시되는 항목 수를 일정하게 유지해야 한다.

### 접근성 가이드라인

- L[1246–1246](../../upstream/krds/raw/components/component_03_06.html:1246): 접근성 가이드라인
- L[1249–1249](../../upstream/krds/raw/components/component_03_06.html:1249): 페이지네이션의 컨테이너가 내비게이션 섹션임을 스크린 리더에서 인지할 수 있도록 한다.
- L[1250–1251](../../upstream/krds/raw/components/component_03_06.html:1250): 페이지네이션의 전체 컨테이너는 &lt;nav&gt;로 감싸거나 WAI-ARIA 영역을 role="navigation"으로 지정하여 스크린 리더에서 내비게이션 요소임을 인지할 수 있도록 제공해야 한다. 내비게이션 섹션에 aria-label 속성을 활용하여 어떤 데이터 집합에 대한 페이지네이션인지에 대한 설명을 제공하면 스크린 리더 사용자가 보다 명확하게 페이지네이션의 역할을 인지할 수 있다.
- L[1258–1258](../../upstream/krds/raw/components/component_03_06.html:1258): 숫자 링크 목록의 구조를 표현한다.
- L[1259–1259](../../upstream/krds/raw/components/component_03_06.html:1259): 스크린 리더 사용자가 페이지네이션의 항목 수를 빠르게 파악할 수 있도록 &lt;ul&gt;, &lt;li&gt; 태그를 활용하여 계층 구조로 정보를 제공해야 한다.
- L[1266–1266](../../upstream/krds/raw/components/component_03_06.html:1266): 스크린 리더에서 확인할 수 있는 현재 화면 정보를 제공한다.
- L[1267–1267](../../upstream/krds/raw/components/component_03_06.html:1267): 스크린 리더 사용자가 시각적으로 표시된 현재 화면 정보를 동등하게 전달받을 수 있도록 현재 화면 링크의 href 속성을 삭제하고 aria-current="true"를 부여한다.
- L[1273–1273](../../upstream/krds/raw/components/component_03_06.html:1273): 현재 화면 숫자 링크를 색상만으로 구분하지 않는다.
- L[1274–1274](../../upstream/krds/raw/components/component_03_06.html:1274): 현재 화면 숫자 링크는 밑줄, 배경 반전, 텍스트 크기 조정 등의 방식을 활용하여 다른 링크와 명확하게 구분되어야 한다.
- L[1289–1289](../../upstream/krds/raw/components/component_03_06.html:1289): 숫자 링크에 적절한 접근 가능한 이름을 제공한다.
- L[1290–1291](../../upstream/krds/raw/components/component_03_06.html:1290): 스크린 리더 사용자가 숫자 링크의 용도를 보다 명확하게 인지할 수 있도록 aria-label="페이지 1", aria label="페이지 2" 또는 title="페이지"와 같은 방식으로 접근 가능한 이름이나 보조적 설명을 제공한다. 마지막 화면의 경우, aria-label="마지막 페이지, [숫자]" 또는 title="마지막 페이지"로 설명을 제공한다.
- L[1298–1298](../../upstream/krds/raw/components/component_03_06.html:1298): 이전/다음 화면 이동 버튼을 아이콘으로만 제공하는 경우 이름을 제공해야 한다.
- L[1299–1299](../../upstream/krds/raw/components/component_03_06.html:1299): aria-label="이전 페이지", aria-label="다음 페이지"와 같은 방식으로 버튼에 접근 가능한 이름을 제공해야 한다.
- L[1306–1306](../../upstream/krds/raw/components/component_03_06.html:1306): 페이지네이션의 구성 요소를 적절한 크기로 표현하고 영역 간 구분을 제공한다.
- L[1307–1307](../../upstream/krds/raw/components/component_03_06.html:1307): 마우스 커서나 손가락으로 선택할 수 있도록 충분히 큰 버튼을 제공하고 실수를 방지하기 위해 버튼 간 충분한 간격을 확보한다. 요소의 적절한 크기는 버튼, 링크 컴포넌트 가이드라인을 참조한다.
- L[1315–1315](../../upstream/krds/raw/components/component_03_06.html:1315): 페이지네이션의 구성 요소를 일관된 순서로 제공한다.
- L[1316–1316](../../upstream/krds/raw/components/component_03_06.html:1316): 화면 너비와 시각적 배치에 상관없이 이전 버튼, 숫자 링크 목록, 다음 버튼, 페이지 숫자 입력 필드, 전체 화면 수 레이블, 이동 버튼 순서로 제공한다.
- L[1323–1323](../../upstream/krds/raw/components/component_03_06.html:1323): 목록 확장 페이지네이션을 사용할 때, 초점 이동 순서에 유의한다.
- L[1324–1324](../../upstream/krds/raw/components/component_03_06.html:1324): 더보기 버튼을 눌러 새로운 항목이 생성되었을 때, 새로 생성된 항목 중 가장 첫 번째 항목으로 Focus 이벤트가 발생해야 한다.

### 상호작용 가이드라인

- L[1336–1336](../../upstream/krds/raw/components/component_03_06.html:1336): 상호작용 가이드라인
- L[1338–1338](../../upstream/krds/raw/components/component_03_06.html:1338): 숫자 링크 목록
- L[1356–1359](../../upstream/krds/raw/components/component_03_06.html:1356): Click 기본 상태의 이전/다음 버튼, 숫자 링크를 Click 하면 해당 페이지로 이동한다.
- L[1360–1363](../../upstream/krds/raw/components/component_03_06.html:1360): Enter 기본 상태의 이전/다음 버튼, 숫자 링크가 초점을 가진 상태에서 Enter 키를 누르면 해당 화면으로 이동한다.
- L[1370–1370](../../upstream/krds/raw/components/component_03_06.html:1370): 페이지 직접 이동
- L[1388–1391](../../upstream/krds/raw/components/component_03_06.html:1388): Click 숫자 입력 필드에 숫자를 입력한 후 이동 버튼을 Click 하면 해당 화면으로 이동한다.
- L[1392–1395](../../upstream/krds/raw/components/component_03_06.html:1392): Space 숫자 입력 필드에 숫자를 입력한 후 이동 버튼이 초점을 가진 상태에서 Space 키를 누르면 해당 화면으로 이동한다.
- L[1402–1402](../../upstream/krds/raw/components/component_03_06.html:1402): 목록 확장
- L[1416–1422](../../upstream/krds/raw/components/component_03_06.html:1416): Click 더보기 버튼을 Click 하면 목록과 더보기 버튼 사이에 새로운 항목이 생성된다. 화면은 새로 생성된 항목 중 첫 번째 항목으로 스크롤 되며, 해당 요소에 Focus 이벤트가 발생한다. 표시된 항목 수 정보가 실제 내용에 맞추어 갱신된다.
- L[1423–1429](../../upstream/krds/raw/components/component_03_06.html:1423): Space 더보기 버튼이 초점을 가진 상태에서 Space 키를 누르면 목록과 더보기 버튼 사이에 새로운 항목이 생성된다. 화면은 새로 생성된 항목 중 첫 번째 항목으로 스크롤 되며, 해당 요소에 Focus 이벤트가 발생한다. 표시된 항목 수 정보가 실제 내용에 맞추어 갱신된다.

### 예시

- L[1448–1448](../../upstream/krds/raw/components/component_03_06.html:1448): 예시
- L[1452–1452](../../upstream/krds/raw/components/component_03_06.html:1452): 기본
- L[1484–1484](../../upstream/krds/raw/components/component_03_06.html:1484): 기본 코드 확인하기

### 마크업 가이드

- L[1504–1504](../../upstream/krds/raw/components/component_03_06.html:1504): 마크업 가이드
- L[1507–1507](../../upstream/krds/raw/components/component_03_06.html:1507): CSS 선택자
- L[1527–1532](../../upstream/krds/raw/components/component_03_06.html:1527): 전체영역 .krds-pagination
- L[1533–1541](../../upstream/krds/raw/components/component_03_06.html:1533): 이전/다음 탐색 .page-navi.prev(이전) .page-navi.next(다음) 비활성화 .disabled
- L[1542–1547](../../upstream/krds/raw/components/component_03_06.html:1542): 페이지 링크 .page-link 말줄임표 .link-dot

Inline preserved example markup (reference, not the public native API): L[1457–1478](../../upstream/krds/raw/components/component_03_06.html:1457)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Exact clamp/invalid handling and successful-append callback are proposed API policies; source has duplicated load-more prose at L987–988.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1489 `../../code/pagination.html`, L1562 `./variable/pagination.html`. Do not infer unseen contents.
- 14 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `PaginationContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
