# Masthead

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `masthead`; Korean name 공식 배너; export `Masthead`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_02_01](https://www.krds.go.kr/html/site/component/component_02_01.html); preserved [HTML](../../upstream/krds/raw/components/component_02_01.html). Retrieved `2026-10-29T23:28:02.535Z`; `62751` bytes; SHA-256 `851bee30ce1846611f28161d508d7c72cdbebcb0bda29b594c768375167ff466`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `default`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

A noninteractive banner container with the fixed official sentence: “이 누리집은 대한민국 공식 전자정부 누리집입니다.” Keep it at the top of each government service page, after SkipLink and before Header. Preserve the official wording and appearance; do not invent a disclosure from the example’s toggle-wrap class.

## Plain semantic API

Independent API: Masthead has no action or selection API. Provide an explicit governmentService authorization flag at composition level; plain content is fixed Korean text, with any translated wording held for evidence review. No href, dismiss, open, or onClick semantics.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

No tab stop, key handler, focus move or live announcement. SkipLink must remain the first reachable content before this repeated region.

## Responsive/mobile requirements

Allow the official sentence to remain readable at narrow widths and zoom; avoid attention-grabbing animation. Page composition maintains identical relative order.

## Forms, reset and composition

No form value/reset/IME behavior.

## Asset, integration and composition completion

Only actual official government services may display the banner as a service claim. The independent library/demo must label any local specimen as an example, without presenting the repository as a government site. Hosting and eligibility are host responsibilities.

## Stable parts and states

root, text; no interactive state.

All rendered owned parts use `data-krds-component="masthead"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Page keyboard entry reaches SkipLink before banner/Header.
2. Fixed sentence is readable and banner has no focusable descendants.
3. Unrelated independent demo does not assert that it is an official government service.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Independent local specimen policy

`governmentService:false` must never render the official-service sentence. The native component may omit its banner or render only independent content; a host disclaimer cannot authorize the false branch to assert official status. There is no public `specimen` prop. Hosts must forward the actual supplied `governmentService` value instead of forcing `true` or branching on case IDs.

The three local wording/order/narrow stories and outcomes01/02 use `governmentService:true` solely inside an explicitly simulated authorized-service UI composition. Each host renders the visible adjacent notice “공식 정부서비스를 가정한 배너 UI 예시입니다. 실제 공식 정부서비스가 아닙니다.” through its existing specimen-label transport. These pure examples neither establish localhost/project eligibility nor verify actual authorization. Their actual-host metadata remains `authorizedGovernmentHost:false`. Outcome03 instead supplies `governmentService:false`, shows “비공식 독립 로컬 예제”, and requires the exact official-service sentence to be absent from the entire independent page. Visible host prose is separate from native Masthead content and does not alter the public API, repository ownership or rights.

## Required native stories

`masthead--default-specimen`, `masthead--narrow-zoom`, `masthead--page-order`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_02_01.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_02_01.html:889): 1. 컨테이너 배너 정보가 제공되는 영역
- L[890–890](../../upstream/krds/raw/components/component_02_01.html:890): 2. 텍스트 공식 디지털 서비스임을 안내하는 문구

### 사용성 가이드라인

- L[898–898](../../upstream/krds/raw/components/component_02_01.html:898): 사용성 가이드라인
- L[901–901](../../upstream/krds/raw/components/component_02_01.html:901): 배너는 모든 화면의 최상단에 제공한다.
- L[902–905](../../upstream/krds/raw/components/component_02_01.html:902): 공식 정부 배너 영역은 사용자가 해당 디지털 서비스를 신뢰할 수 있는 기준이 되며, 디지털 공공 서비스에 대한 일관성 있는 사용자 경험의 출발점이므로 모든 서비스에서 동일한 위치에 동일한 형태와 스타일로 제공한다. 배너의 위치가 일관성 없거나 특정 화면에만 제공될 경우 사용자에게 혼동을 줄 수 있다.
- L[908–908](../../upstream/krds/raw/components/component_02_01.html:908): 배너가 지나치게 주의를 끌지 않도록 표현한다.
- L[909–909](../../upstream/krds/raw/components/component_02_01.html:909): 서비스의 디자인 주제에 적합한 컨테이너 배경색을 사용한다. 화면 상단 영역에서 사용자가 가장 먼저 집중해야 하는 정보는 헤더 내부의 내비게이션과 기능 버튼이다.
- L[920–920](../../upstream/krds/raw/components/component_02_01.html:920): 배너 텍스트와 스타일을 변형하지 않는다.
- L[921–921](../../upstream/krds/raw/components/component_02_01.html:921): 모든 디지털 정부서비스에서 공식 배너가 일관성 있게 제공되었을 때 신뢰할 수 있다.
- L[932–932](../../upstream/krds/raw/components/component_02_01.html:932): 공식 디지털 정부서비스가 아닌 사이트에서는 배너를 사용하지 않아야 한다.
- L[933–933](../../upstream/krds/raw/components/component_02_01.html:933): 정부의 공식 서비스가 아닌 곳에서 배너를 사용하게 될 경우 사용자에게 혼동을 줄 수 있으므로 배너를 사용하지 않아야 한다.

### 접근성 가이드라인

- L[1039–1039](../../upstream/krds/raw/components/component_02_01.html:1039): 접근성 가이드라인
- L[1042–1042](../../upstream/krds/raw/components/component_02_01.html:1042): 건너뛰기 링크는 공식 배너 이전에 제공한다.
- L[1043–1043](../../upstream/krds/raw/components/component_02_01.html:1043): 공식 배너는 모든 페이지에서 반복되는 영역이므로 스크린 리더 사용자와 키보드 사용자가 이를 건너뛸 수 있도록 건너뛰기 링크를 가장 첫 요소로 제공해야 한다.

### 예시

- L[1064–1064](../../upstream/krds/raw/components/component_02_01.html:1064): 예시
- L[1068–1068](../../upstream/krds/raw/components/component_02_01.html:1068): 기본
- L[1093–1093](../../upstream/krds/raw/components/component_02_01.html:1093): 기본 코드 확인하기

### 마크업 가이드

- L[1113–1113](../../upstream/krds/raw/components/component_02_01.html:1113): 마크업 가이드
- L[1116–1116](../../upstream/krds/raw/components/component_02_01.html:1116): CSS 선택자
- L[1133–1136](../../upstream/krds/raw/components/component_02_01.html:1133): 전체영역 #krds-masthead
- L[1146–1146](../../upstream/krds/raw/components/component_02_01.html:1146): 개발 시 접근성 관련 주의 사항
- L[1148–1148](../../upstream/krds/raw/components/component_02_01.html:1148): 공식배너보다 건너뛰기 링크를 먼저 제공한다.

Inline preserved example markup (reference, not the public native API): L[1073–1087](../../upstream/krds/raw/components/component_02_01.html:1073)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Official HTML has guide images whose pixel styling has not been visually reviewed; do not infer exact color/spacing from their filenames.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1098 `../../code/masthead.html`. Do not infer unseen contents.
- 6 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `MastheadContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
