# TextList

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `text-list`; Korean name 텍스트 목록; export `TextList`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_04_13](https://www.krds.go.kr/html/site/component/component_04_13.html); preserved [HTML](../../upstream/krds/raw/components/component_04_13.html). Retrieved `2026-10-29T23:28:04.043Z`; `77266` bytes; SHA-256 `3c795ef7618610dfeb0a91598af3f3f20078cf90f292b4fad27c423c8cab44a9`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `composition`; accepted project completion kind `component`. Recommend component instead of composition: L1110–1119 explicitly maps ul/ol/li and list roles; L1336–1353 describes marker styles, no composed service workflow.

Supported native cases (variant and state axes): `unordered-dot`, `unordered-dash`, `unordered-hollow`, `ordered`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Native ul/li for equal-importance unordered content, ol/li for sequence/rank; nested lists belong inside their parent li. At most three levels, consistent indentation, voice and punctuation. If list-style:none, explicit role=list/listitem retains mobile list discovery.

## Plain semantic API

Independent API: ordered=false, marker=dot|dash|hollow (dot), items {id,content,children?}[]; ordered variant uses true numeric ordering. Content may contain native links; no selection/current value or invented listbox role.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Static text adds no tab stops or arrow navigation; contained native interactive content follows normal reading order.

## Responsive/mobile requirements

Wrap text under same-level text with hanging indentation. Preserve hierarchy at zoom/narrow width; do not flatten lists into line breaks.

## Forms, reset and composition

No form/reset/IME behavior.

## Asset, integration and composition completion

Retain public export TextList but recommend provisional kind change composition→component: source defines semantic list primitive, without multi-component task workflow. Host owns editorial ordering and punctuation; renderer owns valid nesting.

## Stable parts and states

root, item, marker, content, nested-list; ordered/unordered,level.

All rendered owned parts use `data-krds-component="text-list"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Ordered and unordered semantics match visual markers.
2. Three-level nesting remains structurally valid.
3. Marker-reset styling retains mobile AT list roles.
4. Long wrapped labels preserve indentation.
5. No focusable generic list container.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`text-list--unordered-dot`, `text-list--unordered-dash`, `text-list--unordered-hollow`, `text-list--ordered`, `text-list--three-level`, `text-list--narrow`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_04_13.html:883): 구조
- L[892–892](../../upstream/krds/raw/components/component_04_13.html:892): a. 글머리 기호 순서 없는 목록에 사용됨. 원, 네모, 줄표가 흔하게 사용되며 이 외에도 다양한 도형과 이미지를 사용할 수 있음
- L[893–893](../../upstream/krds/raw/components/component_04_13.html:893): b. 번호 순서 있는 목록에 사용됨. 숫자, 한글 자음, 영문 알파벳과 같이 순서의 진행을 보여줄 수 있는 글자가 사용됨
- L[889–895](../../upstream/krds/raw/components/component_04_13.html:889): 1. 목록 구분자 순차적으로 배열된 목록의 각 항목의 시작을 정의하는 문자 또는 이미지 a. 글머리 기호 순서 없는 목록에 사용됨. 원, 네모, 줄표가 흔하게 사용되며 이 외에도 다양한 도형과 이미지를 사용할 수 있음 b. 번호 순서 있는 목록에 사용됨. 숫자, 한글 자음, 영문 알파벳과 같이 순서의 진행을 보여줄 수 있는 글자가 사용됨
- L[896–896](../../upstream/krds/raw/components/component_04_13.html:896): 2. 텍스트 항목별 본문 내용

### 용례

- L[904–904](../../upstream/krds/raw/components/component_04_13.html:904): 용례
- L[906–906](../../upstream/krds/raw/components/component_04_13.html:906): 사용하기 적합한 경우
- L[910–910](../../upstream/krds/raw/components/component_04_13.html:910): 표를 사용하는 것이 적절하다.
- L[908–912](../../upstream/krds/raw/components/component_04_13.html:908): 여러 차원으로 구성된 텍스트 정보인 경우 표를 사용하는 것이 적절하다.
- L[915–915](../../upstream/krds/raw/components/component_04_13.html:915): 문단 형식으로 표현한다.
- L[913–917](../../upstream/krds/raw/components/component_04_13.html:913): 긴 문장의 서술형 텍스트인 경우 문단 형식으로 표현한다.

### 유형

- L[925–925](../../upstream/krds/raw/components/component_04_13.html:925): 유형
- L[927–927](../../upstream/krds/raw/components/component_04_13.html:927): 순서 없는 목록
- L[928–928](../../upstream/krds/raw/components/component_04_13.html:928): 특정 순서나 순서를 따를 필요가 없는 관련 텍스트를 표현할 때 사용한다.
- L[931–931](../../upstream/krds/raw/components/component_04_13.html:931): 순서 있는 목록
- L[932–932](../../upstream/krds/raw/components/component_04_13.html:932): 특정 순서로 항목을 표시하거나 계층 구조를 표시해야 하는 경우에 사용한다.

### 사용성 가이드라인

- L[939–939](../../upstream/krds/raw/components/component_04_13.html:939): 사용성 가이드라인
- L[942–942](../../upstream/krds/raw/components/component_04_13.html:942): 콘텐츠에 적합한 유형의 목록을 사용한다.
- L[943–944](../../upstream/krds/raw/components/component_04_13.html:943): 모든 항목이 동등한 수준의 중요도를 갖는 경우에는 순서 없는 목록을 사용한다. 항목에 순서를 지정할 수 있거나 순위를 매기는 것이 가능하다면 순서 있는 목록을 사용한다. 모든 항목의 중요도가 동등함에도 순서 있는 목록을 사용하게 되면 사용자가 콘텐츠의 내용을 잘못 이해하거나, 특정 번호의 콘텐츠만 확인하거나, 순서를 건너뛰어 읽게 될 수 있다.
- L[955–955](../../upstream/krds/raw/components/component_04_13.html:955): 동일한 수준의 항목은 일관된 어투로 작성한다.
- L[956–956](../../upstream/krds/raw/components/component_04_13.html:956): 만약 첫 번째 항목이 서술식으로 작성되었다면 목록에서 동일한 수준의 항목은 일관되게 서술식으로 작성한다.
- L[967–967](../../upstream/krds/raw/components/component_04_13.html:967): 문장 형식에 적합한 종결 부호를 사용한다.
- L[968–968](../../upstream/krds/raw/components/component_04_13.html:968): 서술식 목록의 가장 마지막 문장에는 반드시 종결 부호를 사용한다. 개조식 목록의 가장 마지막 문장에는 종결 부호를 생략할 수 있다.
- L[979–979](../../upstream/krds/raw/components/component_04_13.html:979): 들여쓰기를 활용하여 계층 구조를 명확하게 구분한다.
- L[980–980](../../upstream/krds/raw/components/component_04_13.html:980): 글자 크기를 조정하는 것만으로는 서로 다른 수준의 항목을 구분하는 것이 어려울 수 있다. 글자 크기, 계층 구조의 수준을 고려하여 각 수준별로 적절한 들여쓰기 여백을 설정하여 계층 구조가 명확하게 구분될 수 있도록 한다.
- L[991–991](../../upstream/krds/raw/components/component_04_13.html:991): 목록은 3수준 이내로 구성한다.
- L[992–992](../../upstream/krds/raw/components/component_04_13.html:992): 목록의 수준이 지나치게 깊어지면 항목 간 상하 관계를 이해하기 어려워진다.

### 접근성 가이드라인

- L[1107–1107](../../upstream/krds/raw/components/component_04_13.html:1107): 접근성 가이드라인
- L[1110–1110](../../upstream/krds/raw/components/component_04_13.html:1110): 목록 유형에 적합한 태그를 사용한다.
- L[1111–1111](../../upstream/krds/raw/components/component_04_13.html:1111): 시각적으로 목록의 항목이 글머리 기호로 구분되어 있다면 &lt;ul&gt;, &lt;li&gt; 태그로 목록을 마크업한다. 시각적으로 목록의 항목이 번호로 구분되어 있다면 &lt;ol&gt;, &lt;li&gt; 태그로 목록을 마크업한다.
- L[1117–1117](../../upstream/krds/raw/components/component_04_13.html:1117): list-style-type: none 스타일 지정으로 인한 접근성 문제에 유의한다.
- L[1118–1119](../../upstream/krds/raw/components/component_04_13.html:1118): 목록 요소(&lt;ul&gt;, &lt;ol&gt;)에 list-style-type: none 스타일이 지정되었을 때, 일부 모바일 디바이스 스크린 리더에서 요소의 역할을 탐지하지 못하는 문제가 발생할 수 있다. 따라서 목록에 list-style-type: none 스타일을 사용한다면 목록에는 role=”list”, 항목에는 role=”listitem”을 사용하여 목록의 역할을 명시해야 한다.

### 예시

- L[1140–1140](../../upstream/krds/raw/components/component_04_13.html:1140): 예시
- L[1144–1144](../../upstream/krds/raw/components/component_04_13.html:1144): 순서 없는 목록
- L[1210–1210](../../upstream/krds/raw/components/component_04_13.html:1210): 순서 없는 목록 코드 확인하기
- L[1226–1226](../../upstream/krds/raw/components/component_04_13.html:1226): 순서 있는 목록
- L[1292–1292](../../upstream/krds/raw/components/component_04_13.html:1292): 순서 있는 목록 코드 확인하기

### 마크업 가이드

- L[1313–1313](../../upstream/krds/raw/components/component_04_13.html:1313): 마크업 가이드
- L[1316–1316](../../upstream/krds/raw/components/component_04_13.html:1316): CSS 선택자
- L[1336–1341](../../upstream/krds/raw/components/component_04_13.html:1336): 텍스트 목록 .krds-info-list 순서 없는 목록(decimal) .decimal
- L[1342–1345](../../upstream/krds/raw/components/component_04_13.html:1342): 순서 없는 목록(dash) .dash
- L[1346–1349](../../upstream/krds/raw/components/component_04_13.html:1346): 순서 없는 목록(hollow) .hollow
- L[1350–1353](../../upstream/krds/raw/components/component_04_13.html:1350): 순서 있는 목록 .ordered

Inline preserved example markup (reference, not the public native API): L[1149–1204](../../upstream/krds/raw/components/component_04_13.html:1149), L[1231–1286](../../upstream/krds/raw/components/component_04_13.html:1231)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Source 용례 heading says “appropriate” while examples recommend table/paragraph instead; treat explanatory recommendation as authoritative, not heading.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1215 `../../code/text_list.html`, L1297 `../../code/text_list_ordered.html`, L1368 `./variable/text_list.html`. Do not infer unseen contents.
- 11 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `TextListContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
