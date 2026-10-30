# Tag

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `tag`; Korean name 태그; export `Tag`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_06_04](https://www.krds.go.kr/html/site/component/component_06_04.html); preserved [HTML](../../upstream/krds/raw/components/component_06_04.html). Retrieved `2026-10-29T23:28:04.603Z`; `84856` bytes; SHA-256 `fcd8bad8d3bc0942c03112ebd00b07645cca0281f14fe07c9faf021c1da60857`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `static`, `toggle`, `removable`, `add-filter`, `link`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Label/container with optional leading checked icon or trailing remove icon; homogeneous interactive or static groups. Bulk action at group right and optional more control. Use real buttons for filtering/removal, real links only for navigation example.

## Plain semantic API

Independent API: items {id,label,href?}[], mode=static|toggle|removable|add-filter|link, selectedIds/onSelectionChange, onRemove({id}), onAdd({id}), onClear(), appliedBarId. Mode determines semantics; toggle uses aria-pressed; remove name “[label] 옵션 삭제”; add name “[label] 필터 옵션 추가”.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Interactive group entry focuses first; one tag tab stop via roving focus (ArrowLeft/Right/Home/End proposed). Official Space/Enter keyup activation must execute once, not keydown+native click twice. Toggle keeps focus; adding filter moves to applied-filter bar; removing moves to the previous surviving enabled tag, otherwise next surviving enabled tag, otherwise actual group container when no usable tags remain.

## Responsive/mobile requirements

Short <=2-word, unbroken labels and minimal consistent colors; hidden overflow tags are inaccessible until More reveals them. Native touch targets/focus ring remain clear.

## Forms, reset and composition

No automatic form serialization. Filtering state belongs host; group reset can restore host default selectedIds if explicitly composed in a form. IME must not trigger custom Enter action.

## Asset, integration and composition completion

Host owns actual filter results and applied bar target; local story must visibly filter data and manage focus, not merely emit logs.

## Stable parts and states

root, list, item, label, icon, remove, clear, more; selected,disabled,expanded.

All rendered owned parts use `data-krds-component="tag"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Toggle aria-pressed matches visible/filter result.
2. Enter/Space keyup invokes once.
3. Removal focuses previous or group without dead focus.
4. Add focuses applied-filter bar.
5. Static tag never focusable.
6. Link mode retains href browser behavior.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Independent local specimen policy

The staged static specimen uses a native list; each homogeneous interactive specimen uses a group containing the mode-appropriate real buttons or links. A list role is not a universal requirement for interactive tags. This is independent specimen policy, not an additional official variant.

## Required native stories

`tag--static`, `tag--toggle`, `tag--removable`, `tag--add-filter`, `tag--link`, `tag--remove-last`, `tag--overflow`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_06_04.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_06_04.html:889): 1. 레이블 태그를 통해 전달하고자 하는 메타 데이터
- L[890–890](../../upstream/krds/raw/components/component_06_04.html:890): 2. 컨테이너 태그를 배경과 구분하는 윤곽선 또는 배경색
- L[891–891](../../upstream/krds/raw/components/component_06_04.html:891): 3. 삭제 아이콘 레이블과 관련된 데이터의 필터링을 해제할 수 있음을 안내함
- L[892–892](../../upstream/krds/raw/components/component_06_04.html:892): 4. 일괄 액션 버튼 태그 그룹 우측에 배치되어 전체 그룹에 대해 한 번에 동일한 동작을 수행하는 데 사용되는 버튼
- L[893–893](../../upstream/krds/raw/components/component_06_04.html:893): 5. 더 보기 버튼 표와 같이 공간이 제한되어 있는 경우 그룹 내 일부 토큰을 숨길 수 있음

### 유형

- L[901–901](../../upstream/krds/raw/components/component_06_04.html:901): 유형
- L[903–903](../../upstream/krds/raw/components/component_06_04.html:903): 단순 레이블
- L[904–904](../../upstream/krds/raw/components/component_06_04.html:904): 텍스트 레이블로만 구성된 태그 형식이다. 대개 데이터 집합의 개별 항목에 배치되어 항목의 분류 체계, 데이터 속성을 보여준다.
- L[907–907](../../upstream/krds/raw/components/component_06_04.html:907): 선행 아이콘과 레이블
- L[908–909](../../upstream/krds/raw/components/component_06_04.html:908): 체크 아이콘과 레이블로 구성된 태그 형식이다. 필터링·정렬 옵션의 하나로 선행 아이콘이 있는 태그 목록을 배치하여, 목록에 표시되고 있는 데이터 분류 또는 속성을 보여줄 수 있다. 이때, 태그 목록은 대화형 요소로 사용되며 사용자가 선택을 해제하면 단순 레이블 형태로 변경된다.
- L[912–912](../../upstream/krds/raw/components/component_06_04.html:912): 레이블과 삭제 아이콘
- L[913–913](../../upstream/krds/raw/components/component_06_04.html:913): 레이블과 삭제 아이콘으로 구성되어, 실행 시 설정된 필터링·정렬 옵션에서 해당 레이블 관련 옵션 설정이 해제됨을 안내한다.

### 용례

- L[920–920](../../upstream/krds/raw/components/component_06_04.html:920): 용례
- L[922–922](../../upstream/krds/raw/components/component_06_04.html:922): 사용하기 적합한 경우
- L[927–927](../../upstream/krds/raw/components/component_06_04.html:927): 사용자가 선택한 필터링·정렬 옵션 목록을 표시하고 선택된 조건을 삭제하는 데 태그를 이용할 수 있다.
- L[924–929](../../upstream/krds/raw/components/component_06_04.html:924): 필터링·정렬 패턴에서 설정된 옵션을 표시할 때 사용자가 선택한 필터링·정렬 옵션 목록을 표시하고 선택된 조건을 삭제하는 데 태그를 이용할 수 있다.
- L[933–933](../../upstream/krds/raw/components/component_06_04.html:933): 사용하기 적합하지 않은 경우
- L[938–938](../../upstream/krds/raw/components/component_06_04.html:938): 배지를 사용한다.
- L[935–940](../../upstream/krds/raw/components/component_06_04.html:935): 상호작용 없이 데이터의 특성 분류, 속성을 강조하여 표현하고자 할 때 배지를 사용한다.

### 사용성 가이드라인

- L[948–948](../../upstream/krds/raw/components/component_06_04.html:948): 사용성 가이드라인
- L[951–951](../../upstream/krds/raw/components/component_06_04.html:951): 레이블은 정확한 내용으로 간결하게 제공한다.
- L[952–952](../../upstream/krds/raw/components/component_06_04.html:952): 태그 레이블은 태그의 주제를 간결하고 명확하게 전달해야 한다. 레이블은 2단어 이내로 구성하고 텍스트 줄 바꿈이 발생하지 않도록 해야 한다.
- L[955–955](../../upstream/krds/raw/components/component_06_04.html:955): 태그는 관련 요소 주변에 배치한다.
- L[956–956](../../upstream/krds/raw/components/component_06_04.html:956): 한 페이지에서 여러 항목에 걸쳐 동일한 형태와 내용의 태그 반복적으로 사용되므로 사용자가 어떤 항목에 대한 태그인지를 명확하게 변별할 수 있도록 관련 요소 주변에 배치하고 항목이 서로 구분될 수 있도록 표현해야 한다.
- L[959–959](../../upstream/krds/raw/components/component_06_04.html:959): 대화형 태그와 비대화형 태그를 같은 그룹에 포함하지 않는다.
- L[960–960](../../upstream/krds/raw/components/component_06_04.html:960): 대화형 태그와 비대화형 태그가 같은 그룹에 혼합되어 있으면 사용자는 어떤 태그가 대화형으로 사용되는지 혼동을 느낄 수 있다.
- L[963–963](../../upstream/krds/raw/components/component_06_04.html:963): 지나치게 많은 태그를 사용하지 않는다.
- L[964–964](../../upstream/krds/raw/components/component_06_04.html:964): 태그를 많이 사용할수록 인지 부담이 증가되므로 최소의 태그를 사용한다. 이후, 사용자 의견 수렴 과정을 통해 추가가 필요한 태그를 확인하여 표시 개수를 늘릴 수 있다.
- L[971–971](../../upstream/krds/raw/components/component_06_04.html:971): 태그의 표현에 지나치게 많은 색상을 사용하지 않는다.
- L[972–973](../../upstream/krds/raw/components/component_06_04.html:972): 여러 색상은 사용자의 주의를 분산시키고 혼동을 줄 수 있으므로 가능한 한 태그에는 하나의 색상만 사용하는 것이 적합하다. 색상을 추가하고자 하는 경우, 색상을 활용한 태그 구분이 사용자에게 의미가 있는지를 가장 먼저 고려해야 한다. 그 다음 동시에 표시되는 태그 수를 고려하여, 모든 태그가 동등한 수준으로 강조될 수 있는 색상을 사용해야 한다.

### 접근성 가이드라인

- L[1099–1099](../../upstream/krds/raw/components/component_06_04.html:1099): 접근성 가이드라인
- L[1102–1102](../../upstream/krds/raw/components/component_06_04.html:1102): 대화형 태그의 초점을 명확하게 표시한다.
- L[1103–1103](../../upstream/krds/raw/components/component_06_04.html:1103): 대화형 태그가 초점을 가진 상태일 때, 태그에 인접 배경과 3:1 이상의 명도 대비를 갖는 윤곽선이 명확하게 표시되어야 한다.
- L[1111–1111](../../upstream/krds/raw/components/component_06_04.html:1111): 대화형 태그에 기능 또는 상태 정보를 명확하게 제공한다.
- L[1112–1112](../../upstream/krds/raw/components/component_06_04.html:1112): 사용자가 태그를 실행하였을 때 어떤 동작이 발생하는지 예측할 수 있도록 용도에 적합한 접근 가능한 이름이나 상태 정보를 제공해야 한다.
- L[1114–1117](../../upstream/krds/raw/components/component_06_04.html:1114): 필터링·조회 패턴의 일부로서 실행 시 해당 태그를 가진 요소에 대한 필터링 동작이 발생하는 경우: aria-pressed="true", aria-pressed="false" 속성을 활용하여 선택 상태에 대한 정보를 제공
- L[1118–1121](../../upstream/krds/raw/components/component_06_04.html:1118): 필터링·조회 패턴의 일부로서 실행 시 해당 태그에 대한 필터링 옵션이 해제되는 경우: aria-label="[태그 레이블] 옵션 삭제"
- L[1122–1125](../../upstream/krds/raw/components/component_06_04.html:1122): 관련된 항목 주변에 배치되어 실행 시 해당 태그에 대한 필터링 옵션이 설정되는 경우: aria-label="[태그 레이블] 필터 옵션 추가"
- L[1132–1132](../../upstream/krds/raw/components/component_06_04.html:1132): 태그의 색상으로 의미를 전달하지 않아야 한다.
- L[1133–1133](../../upstream/krds/raw/components/component_06_04.html:1133): 색상을 사용하여 태그를 구분할 수 있지만, 색상을 사용하여 의미를 전달해서는 안 된다.
- L[1140–1140](../../upstream/krds/raw/components/component_06_04.html:1140): 태그 레이블, 아이콘이 인접 배경과 3:1 이상의 명도 대비를 갖도록 표현한다.
- L[1141–1141](../../upstream/krds/raw/components/component_06_04.html:1141): 태그 레이블뿐만 아니라 태그 내부 아이콘이 인접 배경과 3:1 이상의 명도 대비를 갖도록 표현해야 한다. 아이콘은 태그를 통해 어떤 동작이 수행될 것인지를 예측하는 데 참고할 수 있는 중요한 정보이다.

### 상호작용 가이드라인

- L[1154–1154](../../upstream/krds/raw/components/component_06_04.html:1154): 상호작용 가이드라인
- L[1156–1156](../../upstream/krds/raw/components/component_06_04.html:1156): 태그 탐색과 실행
- L[1174–1177](../../upstream/krds/raw/components/component_06_04.html:1174): Click 대화형 태그인 경우, Click 시 해당 태그 조건이 필터링 옵션으로 추가된다. 초점은 적용된 필터링 옵션을 표시하는 막대로 이동한다.
- L[1178–1181](../../upstream/krds/raw/components/component_06_04.html:1178): Tab 대화형 태그인 경우, 태그 그룹으로 Tab 하면 첫 번째 태그에 초점이 위치한다. 한 번에 하나의 태그만 키보드 초점을 가진다.
- L[1182–1185](../../upstream/krds/raw/components/component_06_04.html:1182): Space, Enter 대화형 태그인 경우, 태그가 초점을 가진 상태에서 Space 또는 Enter 키에서 Keyup 이벤트가 발생하면 해당 태그 조건이 필터링 옵션으로 추가된다. 초점은 적용된 필터링 옵션을 표시하는 막대로 이동한다.
- L[1192–1192](../../upstream/krds/raw/components/component_06_04.html:1192): 태그 선택
- L[1210–1213](../../upstream/krds/raw/components/component_06_04.html:1210): Click Click 시 해당 태그 조건의 선택 상태가 토글된다. 초점은 Click한 요소에 유지된다.
- L[1214–1217](../../upstream/krds/raw/components/component_06_04.html:1214): Space 태그가 초점을 가진 상태에서 Space 또는 Enter 키에서 Keyup 이벤트가 발생하면 해당 태그 조건의 선택 상태가 토글된다. 초점은 Keyup 이벤트가 발생한 태그에 유지된다.
- L[1224–1224](../../upstream/krds/raw/components/component_06_04.html:1224): 태그 삭제
- L[1242–1245](../../upstream/krds/raw/components/component_06_04.html:1242): Click Click 시 해당 태그 조건이 목록에서 제거된다. 초점은 삭제된 태그의 이전 태그로 이동한다. 만약 초점을 이동할 태그가 목록에 남아 있지 않다면 태그 목록을 표시하는 컨테이너 자체로 초점이 이동한다.
- L[1246–1249](../../upstream/krds/raw/components/component_06_04.html:1246): Space 태그가 초점을 가진 상태에서 Space 또는 Enter 키에서 Keyup 이벤트가 발생하면 해당 태그 조건이 목록에서 제거된다. 초점은 삭제된 태그의 이전 태그로 이동한다. 만약 초점을 이동할 태그가 목록에 남아 있지 않다면 태그 목록을 표시하는 컨테이너 자체로 초점이 이동한다.

### 예시

- L[1268–1268](../../upstream/krds/raw/components/component_06_04.html:1268): 예시
- L[1272–1272](../../upstream/krds/raw/components/component_06_04.html:1272): 기본
- L[1348–1348](../../upstream/krds/raw/components/component_06_04.html:1348): 기본 코드 확인하기
- L[1364–1364](../../upstream/krds/raw/components/component_06_04.html:1364): 링크형
- L[1413–1413](../../upstream/krds/raw/components/component_06_04.html:1413): 링크형 코드 확인하기

### 마크업 가이드

- L[1433–1433](../../upstream/krds/raw/components/component_06_04.html:1433): 마크업 가이드
- L[1436–1436](../../upstream/krds/raw/components/component_06_04.html:1436): CSS 선택자
- L[1456–1462](../../upstream/krds/raw/components/component_06_04.html:1456): 태그 전체영역 .krds-tag-wrap 사이즈 크게 .large
- L[1463–1466](../../upstream/krds/raw/components/component_06_04.html:1463): 중간 .medium
- L[1467–1470](../../upstream/krds/raw/components/component_06_04.html:1467): 작게 .small
- L[1471–1476](../../upstream/krds/raw/components/component_06_04.html:1471): 태그 버튼영역 .krds-btn-tag 링크형 .link

Inline preserved example markup (reference, not the public native API): L[1277–1342](../../upstream/krds/raw/components/component_06_04.html:1277), L[1369–1407](../../upstream/krds/raw/components/component_06_04.html:1369)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Recorded independent decision: Accepted removal first prefers the previous surviving enabled tag. If the removed tag was first and later tags survive, focus the next surviving enabled tag. If no usable tags remain, focus the actual tag-list container with temporary tabindex=-1. Never focus a removed node; rejected host removal retains focus. This fills the unspecified first-item case while preserving the official previous-tag and empty-container destinations.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1353 `../../code/tag.html`, L1418 `../../code/tag_link.html`, L1491 `./variable/tag.html`. Do not infer unseen contents.
- 3 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Accepted independent resolution

Accepted removal first prefers the previous surviving enabled tag. If the removed tag was first and later tags survive, focus the next surviving enabled tag. If no usable tags remain, focus the actual tag-list container with temporary tabindex=-1. Never focus a removed node; rejected host removal retains focus. This fills the unspecified first-item case while preserving the official previous-tag and empty-container destinations.

## Shared implementation handoff

The exact semantic interface is `TagContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
