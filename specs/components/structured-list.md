# StructuredList

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `structured-list`; Korean name 구조화 목록; export `StructuredList`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_04_01](https://www.krds.go.kr/html/site/component/component_04_01.html); preserved [HTML](../../upstream/krds/raw/components/component_04_01.html). Retrieved `2026-10-29T23:28:03.275Z`; `97910` bytes; SHA-256 `89be72c79361c1b25695e66a8430156a54365035ce769d4d7c67476a1204cca5`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `composition`; accepted project completion kind `composition`. Retain composition: completion includes real toolbar/item/navigation interactions and subcomponents, not only a card shell.

Supported native cases (variant and state axes): `list`, `table`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Optional section title, consistent search/filter/sort/action toolbar, list/table of items, optional Pagination. Each item preserves metadata classification/order, preview, content/CTA and trailing share/save actions; source requires share/save after content in markup. Missing category value shows dash.

## Plain semantic API

Independent API: items {id,title,href?,metadata:{label,value}[],image?,tags?}[], variant=list|table, toolbar semantic controls, selection {ids,onChange} optional, sort {key,direction,onChange} optional. Provide explicit item link/action contracts; whole card is not a nested button containing buttons.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Every action works through keyboard/touch, visible focus, and native links/buttons. Sort/query activation retains focus on activating UI; selection uses labeled checkboxes. New window/application actions explain result. Only provide behavior configured by host.

## Responsive/mobile requirements

Keep metadata order when stacking; toolbar order remains consistent. Table variant preserves table semantics and header relationships under overflow/reflow.

## Forms, reset and composition

Child query/selection fields retain native form/reset/IME contracts; no invented aggregate serialized “list” field.

## Asset, integration and composition completion

Completion requires functioning toolbar, selection, CTA, share/save, Badge/Tag, optional Pagination in local-data composition; a div with children is insufficient. Host owns filtering algorithm/data, share target and save persistence; stories use pure local state.

## Stable parts and states

root, header, toolbar, list, item, preview, content, metadata, cta, badges, tags, actions, pagination; selected,pending,empty.

All rendered owned parts use `data-krds-component="structured-list"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Share/save occurs after readable item content in DOM.
2. Sort preserves focus and visibly changes local order.
3. Missing metadata retains category position with dash.
4. Selectable rows expose item-specific names.
5. List/table variants retain correct hierarchy and independent CTA/actions.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`structured-list--list`, `structured-list--table`, `structured-list--local-filter-sort`, `structured-list--selection-actions`, `structured-list--missing-metadata`, `structured-list--empty`, `structured-list--narrow`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[886–886](../../upstream/krds/raw/components/component_04_01.html:886): 구조
- L[889–889](../../upstream/krds/raw/components/component_04_01.html:889): 리스트형
- L[894–897](../../upstream/krds/raw/components/component_04_01.html:894): 1. 제목(선택) 구조화 목록에서 제공하는 정보의 카테고리로, 필요한 경우 부가적인 설명을 제공할 수 있음
- L[903–903](../../upstream/krds/raw/components/component_04_01.html:903): 검색
- L[904–904](../../upstream/krds/raw/components/component_04_01.html:904): 필터
- L[905–905](../../upstream/krds/raw/components/component_04_01.html:905): 정렬
- L[906–906](../../upstream/krds/raw/components/component_04_01.html:906): 더보기 링크
- L[907–907](../../upstream/krds/raw/components/component_04_01.html:907): 액션 버튼
- L[898–910](../../upstream/krds/raw/components/component_04_01.html:898): 2. 도구 막대(선택) 목록 내 일부 또는 전체 항목에 대해 실행할 여러 가지 기능을 제공하는 영역으로 대개 구조화 목록의 상단에 배치함 검색 필터 정렬 더보기 링크 액션 버튼
- L[916–916](../../upstream/krds/raw/components/component_04_01.html:916): 항목 선택 체크박스
- L[917–917](../../upstream/krds/raw/components/component_04_01.html:917): 미리보기 이미지
- L[918–918](../../upstream/krds/raw/components/component_04_01.html:918): 콘텐츠
- L[919–919](../../upstream/krds/raw/components/component_04_01.html:919): CTA
- L[920–920](../../upstream/krds/raw/components/component_04_01.html:920): 액션 버튼
- L[921–921](../../upstream/krds/raw/components/component_04_01.html:921): 항목 구분자
- L[911–924](../../upstream/krds/raw/components/component_04_01.html:911): 3. 항목 정보를 식별하기 위한 콘텐츠 집합으로 개별 항목에 대해 실행할 기능 관련 버튼, 상세 정보를 확인할 수 있는 탐색 링크가 포함될 수 있음 항목 선택 체크박스 미리보기 이미지 콘텐츠 CTA 액션 버튼 항목 구분자
- L[930–930](../../upstream/krds/raw/components/component_04_01.html:930): 인디케이터
- L[931–931](../../upstream/krds/raw/components/component_04_01.html:931): 페이징
- L[932–932](../../upstream/krds/raw/components/component_04_01.html:932): 이동 버튼
- L[925–935](../../upstream/krds/raw/components/component_04_01.html:925): 4. 페이지네이션(선택) 구조화 목록을 탐색하기 위한 기능 버튼 및 관련 정보를 제공하는 영역으로 대개 구조화 목록 하단에 배치함 인디케이터 페이징 이동 버튼
- L[940–940](../../upstream/krds/raw/components/component_04_01.html:940): 표형
- L[945–947](../../upstream/krds/raw/components/component_04_01.html:945): 1. 제목
- L[948–950](../../upstream/krds/raw/components/component_04_01.html:948): 2. 도구막대 (검색, 필터, 정렬, 더보기 링크, 액션버튼)
- L[951–953](../../upstream/krds/raw/components/component_04_01.html:951): 3. 항목 (항목선택 체크박스, 콘텐츠, CTA, 액션버튼, 항목구분자
- L[954–956](../../upstream/krds/raw/components/component_04_01.html:954): 4. 페이지네이션(선택)

### 사용성 가이드라인

- L[965–965](../../upstream/krds/raw/components/component_04_01.html:965): 사용성 가이드라인
- L[968–968](../../upstream/krds/raw/components/component_04_01.html:968): 도구 막대를 구성하는 사용자 인터페이스는 모든 화면에서 일관된 위치에 동일한 순서로 배치한다.
- L[969–969](../../upstream/krds/raw/components/component_04_01.html:969): 구조화 목록의 유형이나 콘텐츠 특성에 따라 툴바에서 제공되는 상세 사용자 인터페이스의 구성은 달라질 수 있다. 그러나 이 경우에도 유사한 기능을 가진 요소를 일관된 위치에 배치하여 사용자가 별도의 학습 없이 기능을 사용할 수 있도록 해야 한다.
- L[972–972](../../upstream/krds/raw/components/component_04_01.html:972): 콜투액션(Call to Action)은 항목과 관련된 가장 중요한 행동을 유도하기 위해 사용한다.
- L[973–973](../../upstream/krds/raw/components/component_04_01.html:973): 구조화 목록에서 전달하고자 하는 정보의 특성 및 사용자의 방문 목적을 고려하여 가장 중요한 행동을 콜투액션 버튼(최상위 수준의 강조 버튼)으로 표현해야 한다.
- L[976–976](../../upstream/krds/raw/components/component_04_01.html:976): 사용자가 필요로 하는 기능과 행동 버튼을 제공한다
- L[977–977](../../upstream/krds/raw/components/component_04_01.html:977): 구조화 목록에는 사용자가 필요로 하거나 가장 빈번하게 사용하는 기능과 관련된 다양한 행동 버튼을 제공함으로써 상세 페이지로 이동하거나 상세 정보 영역을 확장하지 않더라도 빠르게 목적을 달성할 수 있도록 도와준다.
- L[980–980](../../upstream/krds/raw/components/component_04_01.html:980): 항목의 콘텐츠에는 모든 정보를 일관된 분류 체계와 순서로 제공한다.
- L[981–982](../../upstream/krds/raw/components/component_04_01.html:981): 항목을 구성하는 모든 정보를 일관된 분류 체계와 순서로 제공해야 한다. 만약 구조화 목록을 구성하는 항목별로 원자료의 정보 수준이 달라 정보가 비어있거나 생략되면 사용자는 혼동을 느낄 수 있으므로 해당 카테고리 정보가 제공되어야 하는 위치에 대시(-)를 플레이스홀더로 제공한다.

### 접근성 가이드라인

- L[1104–1104](../../upstream/krds/raw/components/component_04_01.html:1104): 접근성 가이드라인
- L[1107–1107](../../upstream/krds/raw/components/component_04_01.html:1107): 구조화 목록에서 제공되는 모든 기능을 키보드로 실행할 수 있도록 한다.
- L[1108–1108](../../upstream/krds/raw/components/component_04_01.html:1108): 구조화 목록에서 제공되는 모든 기능은 마우스뿐만 아니라 키보드, 터치 인터페이스로 실행할 수 있어야 한다.
- L[1115–1115](../../upstream/krds/raw/components/component_04_01.html:1115): 구조화 목록에서 제공되는 모든 기능에 키보드 초점이 명확하게 표시되도록 한다.
- L[1116–1116](../../upstream/krds/raw/components/component_04_01.html:1116): 구조화 목록에서 제공되는 모든 사용자 인터페이스(버튼, 링크)는 초점을 받은 상태가 시각적으로 명확하게 구분되어야 한다.
- L[1123–1123](../../upstream/krds/raw/components/component_04_01.html:1123): 구조화 목록에서 제공되는 모든 기능은 사용자가 예측 가능한 방식으로 작동해야 한다.
- L[1124–1125](../../upstream/krds/raw/components/component_04_01.html:1124): 만약 새로운 브라우저 창을 실행하는 링크나 외부 애플리케이션을 실행하는 버튼이 있다면 부가적인 설명을 제공하여 스크린 리더 사용자가 기능의 실행 결과를 예측할 수 있어야 한다. 구조화 목록을 정렬하거나 조회하는 기능이 있다면 해당 기능 실행 후, 키보드 초점은 정렬/조회 UI에 유지되어야 한다.

### 상호작용 가이드라인

- L[1136–1136](../../upstream/krds/raw/components/component_04_01.html:1136): 상호작용 가이드라인
- L[1138–1138](../../upstream/krds/raw/components/component_04_01.html:1138): 탐색
- L[1156–1159](../../upstream/krds/raw/components/component_04_01.html:1156): Tab, Shift + Tab 구조화 목록 내 다음 인터페이스 요소를 순차적으로 탐색한다.
- L[1166–1166](../../upstream/krds/raw/components/component_04_01.html:1166): 기능 실행 또는 이동
- L[1184–1187](../../upstream/krds/raw/components/component_04_01.html:1184): Click 구조화 목록 내 액션 버튼의 기능이 실행되거나 링크 목적지로 이동한다.
- L[1188–1191](../../upstream/krds/raw/components/component_04_01.html:1188): Enter 구조화 목록 내 액션 버튼의 기능이 실행되거나 링크 목적지로 이동한다.

### 예시

- L[1210–1210](../../upstream/krds/raw/components/component_04_01.html:1210): 예시
- L[1214–1214](../../upstream/krds/raw/components/component_04_01.html:1214): 기본
- L[1322–1322](../../upstream/krds/raw/components/component_04_01.html:1322): 기본 코드 확인하기
- L[1338–1338](../../upstream/krds/raw/components/component_04_01.html:1338): 표형
- L[1591–1591](../../upstream/krds/raw/components/component_04_01.html:1591): 표형 코드 확인하기

### 마크업 가이드

- L[1611–1611](../../upstream/krds/raw/components/component_04_01.html:1611): 마크업 가이드
- L[1614–1614](../../upstream/krds/raw/components/component_04_01.html:1614): CSS 선택자
- L[1631–1634](../../upstream/krds/raw/components/component_04_01.html:1631): 전체영역(리스트형) .krds-structured-list
- L[1635–1638](../../upstream/krds/raw/components/component_04_01.html:1635): 전체영역(표형) .krds-structured-list-table
- L[1639–1642](../../upstream/krds/raw/components/component_04_01.html:1639): 뱃지 표시 영역 .card-top
- L[1643–1646](../../upstream/krds/raw/components/component_04_01.html:1643): 내용 표시 영역 .card-body
- L[1647–1650](../../upstream/krds/raw/components/component_04_01.html:1647): 태그 표시 영역 .card-btm
- L[1651–1654](../../upstream/krds/raw/components/component_04_01.html:1651): 내용 공유/찜하기 버튼 영역 .card-btn
- L[1664–1664](../../upstream/krds/raw/components/component_04_01.html:1664): 개발 시 접근성 관련 주의 사항
- L[1666–1666](../../upstream/krds/raw/components/component_04_01.html:1666): 내용을 확인한 뒤 공유하기, 찜하기 버튼을 사용할 수 있도록 해당 버튼은 컨텐츠 뒷 순서로 마크업한다.

Inline preserved example markup (reference, not the public native API): L[1219–1316](../../upstream/krds/raw/components/component_04_01.html:1219), L[1343–1585](../../upstream/krds/raw/components/component_04_01.html:1343)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- No additional textual contradiction found. The semantic API/defaults are frozen by this accepted contract; native implementation remains subject to separate evidence/review.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1327 `../../code/structured_list.html`, L1596 `../../code/structured_list_table.html`, L1678 `./variable/structured_list.html`. Do not infer unseen contents.
- 2 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `StructuredListContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
