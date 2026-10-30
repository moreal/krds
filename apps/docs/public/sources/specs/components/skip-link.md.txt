# SkipLink

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `skip-link`; Korean name 건너뛰기 링크; export `SkipLink`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_03_01](https://www.krds.go.kr/html/site/component/component_03_01.html); preserved [HTML](../../upstream/krds/raw/components/component_03_01.html). Retrieved `2026-10-29T23:28:02.834Z`; `71606` bytes; SHA-256 `f11cdbee2d0ac2d8831ed8acb0daea45152f98ffc9d08571cce00f755122297e`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `visible`, `focus-revealed`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Real same-document anchors in a list before Masthead and header. Main-content link comes first and targets content excluding side navigation/breadcrumb/utilities. No more than three links; omit on pages with no repeated region. Focus-revealed is the proposed default.

## Plain semantic API

Independent API: SkipLink accepts links {id,label,targetId}[] (one main target normally), visibility=focus-revealed|visible. Target IDs must resolve in the same document/root strategy; report invalid targets during development rather than silently linking #.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Enter scrolls and focuses destination section/title; use temporary tabindex=-1 on nonfocusable destination without adding it to normal tab order. Next Tab starts at its first interactive descendant. Tap scrolls; screen-reader virtual navigation needs manual verification. Focus reveal must expose an unobscured focus ring.

## Responsive/mobile requirements

Required web behavior remains on mobile web; native-app exception is not a mobile-web exclusion. Keep links readable/above sticky content and honor reduced-motion scrolling.

## Forms, reset and composition

No form value/reset/IME behavior.

## Asset, integration and composition completion

Host supplies stable target IDs and meaningful content landmarks. Lit shadow boundaries require explicit target registration or light-DOM anchor resolution; raw document.getElementById assumptions must not cross closed roots.

## Stable parts and states

root, list, item, link; focus-visible.

All rendered owned parts use `data-krds-component="skip-link"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. First Tab reveals link before banner.
2. Enter moves activeElement to main and next Tab enters main content.
3. No repeated-region content sits inside the target boundary.
4. Missing target is diagnosed.
5. Zoom/sticky header does not hide focused destination.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`skip-link--visible`, `skip-link--focus-revealed`, `skip-link--three-targets`, `skip-link--sticky-page`, `skip-link--shadow-target`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_03_01.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_03_01.html:889): 1. 컨테이너 건너뛰기 링크 레이블이 제공되는 영역
- L[890–890](../../upstream/krds/raw/components/component_03_01.html:890): 2. 레이블 링크와 연결된 대상을 안내하는 텍스트

### 유형

- L[898–898](../../upstream/krds/raw/components/component_03_01.html:898): 유형
- L[900–900](../../upstream/krds/raw/components/component_03_01.html:900): 보이는 건너뛰기 링크
- L[901–904](../../upstream/krds/raw/components/component_03_01.html:901): 페이지 상단 영역, 즉 헤더 주변에 배치하여 항상 눈에 보이도록 하는 유형의 건너뛰기 링크이다. 별도의 행동 없이 존재 여부를 확인할 수 있어 직관적이고, 건너뛰기 링크를 통해 도움을 받을 수 있는 사용자가 쉽게 접근할 수 있다. 그러나 서비스 특성으로 인해 헤더에 많은 정보와 기능이 배치되어야 하는 경우, 보이는 건너뛰기 링크가 시각적 복잡성을 증가시킬 수 있으므로 일시적으로 숨긴 건너뛰기 링크를 사용하는 것이 적합하다.
- L[907–907](../../upstream/krds/raw/components/component_03_01.html:907): 일시적으로 숨긴 건너뛰기 링크
- L[908–908](../../upstream/krds/raw/components/component_03_01.html:908): 일시적으로 숨긴 건너뛰기 링크는 눈에 보이지 않게 숨겨두었다 키보드 탐색을 시도할 때 링크를 보여준다.

### 용례

- L[915–915](../../upstream/krds/raw/components/component_03_01.html:915): 용례
- L[917–917](../../upstream/krds/raw/components/component_03_01.html:917): 사용하기 적합하지 않은 경우
- L[922–923](../../upstream/krds/raw/components/component_03_01.html:922): 정보 구조 없이 단일 화면으로 구성된 사이트나 정보 구조상 문서 시작 부분에 메뉴 탐색을 위한 내비게이션이 제공되지 않는 페이지에서는 건너뛰기 링크를 사용하지 않아야 한다. 반복되는 영역이 없는 페이지에 건너뛰기 링크를 제공하게 되면 사용자에게 혼동을 줄 수 있으며, 탐색해야 할 요소가 늘어나므로 오히려 탐색 효율성을 저하시킬 수 있다.
- L[919–925](../../upstream/krds/raw/components/component_03_01.html:919): 반복되는 영역이 없는 사이트 또는 페이지 정보 구조 없이 단일 화면으로 구성된 사이트나 정보 구조상 문서 시작 부분에 메뉴 탐색을 위한 내비게이션이 제공되지 않는 페이지에서는 건너뛰기 링크를 사용하지 않아야 한다. 반복되는 영역이 없는 페이지에 건너뛰기 링크를 제공하게 되면 사용자에게 혼동을 줄 수 있으며, 탐색해야 할 요소가 늘어나므로 오히려 탐색 효율성을 저하시킬 수 있다.

### 사용성 가이드라인

- L[933–933](../../upstream/krds/raw/components/component_03_01.html:933): 사용성 가이드라인
- L[936–936](../../upstream/krds/raw/components/component_03_01.html:936): 웹사이트의 모든 페이지에 건너뛰기 링크를 제공한다.
- L[937–938](../../upstream/krds/raw/components/component_03_01.html:937): 마우스를 사용하고 시력이 있는 사용자는 페이지를 훑어보고 주요 콘텐츠의 위치를 파악할 수 있다. 그러나 키보드, 스크린 리더를 사용하여 페이지를 탐색하는 사용자는 주요 콘텐츠에 접근하기까지 헤더의 수많은 요소를 거쳐야 한다. 웹사이트를 이용하는 동안 계속 이러한 반복 행동을 수행해야 한다면 탐색 효율성이 낮아지고 피로도가 증가할 수밖에 없다. 따라서 사용하기 적합하지 않은 상황을 제외하고 웹사이트의 모든 페이지에는 건너뛰기 링크를 제공해야 한다.
- L[941–941](../../upstream/krds/raw/components/component_03_01.html:941): 건너뛰기 링크의 개수는 3개 이내로 제공한다.
- L[942–943](../../upstream/krds/raw/components/component_03_01.html:942): 대부분은 페이지의 핵심 영역, 즉 본문으로 건너뛰는 링크 1개만 제공해도 충분하다. 만약 콘텐츠의 구성과 구조가 복잡하다면 추가적인 건너뛰기 링크를 제공할 수 있다. 여러 개의 건너뛰기 링크를 제공하는 경우, 다른 링크보다 화면의 핵심 영역으로 이동하는 링크를 가장 첫 번째 항목으로 제공해야 한다.
- L[946–946](../../upstream/krds/raw/components/component_03_01.html:946): 건너뛰기 링크 외에 다른 콘텐츠 섹션 탐색 수단을 제공하는 방안을 고려한다.
- L[947–950](../../upstream/krds/raw/components/component_03_01.html:947): 건너뛰기 링크의 목적은 키보드 탐색을 보다 효율적으로 만드는 것이다. 건너뛰기 링크의 개수가 늘어날수록 복잡해져 탐색 효율성이 저하될 수 있으므로 링크를 추가하는 것보다 다른 보조적 탐색 수단을 제공하는 방안을 고려한다. 예를 들어, 페이지 내 탐색 컴포넌트를 제공하면 사용자는 건너뛰기 링크를 사용하여 본문에 접근한 다음 페이지 내 탐색 링크를 활용하여 원하는 본문 섹션으로 이동할 수 있다.
- L[953–953](../../upstream/krds/raw/components/component_03_01.html:953): 건너뛰기 링크의 목적지를 적절하게 설정한다.
- L[954–954](../../upstream/krds/raw/components/component_03_01.html:954): 건너뛰기 링크의 목적지에 반복되는 콘텐츠 영역이 포함되지 않도록 유의한다. 건너뛰기 링크의 핵심인 본문 바로가기 링크에는 목적지 섹션에 사이드 메뉴, 브레드크럼, 페이지 유틸리티 버튼/ 링크가 포함되어 있어서는 안 된다.

### 플랫폼에 대한 고려 사항

- L[962–962](../../upstream/krds/raw/components/component_03_01.html:962): 플랫폼에 대한 고려 사항
- L[965–965](../../upstream/krds/raw/components/component_03_01.html:965): 모바일 애플리케이션에서는 건너뛰기 링크를 제공하지 않을 수 있다.
- L[966–966](../../upstream/krds/raw/components/component_03_01.html:966): 모바일 애플리케이션은 모바일 웹과 탐색 내비게이션의 구성 방식, 정보 구조, 화면 구성이 달라 건너뛰기 링크의 효용이 낮다.

### 접근성 가이드라인

- L[1073–1073](../../upstream/krds/raw/components/component_03_01.html:1073): 접근성 가이드라인
- L[1076–1076](../../upstream/krds/raw/components/component_03_01.html:1076): 건너뛰기 링크 목록은 문서의 가장 첫 요소로 제공한다.
- L[1077–1077](../../upstream/krds/raw/components/component_03_01.html:1077): 쿠키 배너, 화면의 맥락을 가린 모달이 제공되는 경우를 제외하고 건너뛰기 링크 목록은 웹 문서의 가장 첫 요소로 제공해야 한다.
- L[1087–1087](../../upstream/krds/raw/components/component_03_01.html:1087): 건너뛰기 링크의 초점이 명확하게 구분되도록 표현한다.
- L[1088–1088](../../upstream/krds/raw/components/component_03_01.html:1088): 특히 일시적으로 숨긴 건너뛰기 링크 형식에서 포커스링이 인접한 본문 영역과 중첩될 수 있음을 유의해야 한다. 건너뛰기 링크의 outline-offset 속성을 음수 값으로 지정하면 컨테이너 영역 안쪽으로 포커스링이 생성되어 변별이 쉬워진다.
- L[1095–1095](../../upstream/krds/raw/components/component_03_01.html:1095): 건너뛰기 링크 실행 시 스크롤 동작과 함께 연결된 목적지 섹션으로 Focus 이벤트가 발생해야 한다.
- L[1096–1096](../../upstream/krds/raw/components/component_03_01.html:1096): 링크 실행 후 목표 지점으로 스크롤 동작만 발생하고 키보드 초점이 링크나 기타 요소에 머물러 있게 되면 건너뛰기 링크를 필요로 하는 사용자는 원하는 지점에서부터 탐색을 시작할 수 없다.

### 상호작용 가이드라인

- L[1108–1108](../../upstream/krds/raw/components/component_03_01.html:1108): 상호작용 가이드라인
- L[1110–1110](../../upstream/krds/raw/components/component_03_01.html:1110): 목적지 섹션으로의 이동
- L[1128–1131](../../upstream/krds/raw/components/component_03_01.html:1128): Enter 건너뛰기 링크가 초점을 가진 상태에서 Enter 키를 누르면 목적지 섹션으로 키보드 초점이 이동하고 화면이 스크롤 된다.
- L[1132–1135](../../upstream/krds/raw/components/component_03_01.html:1132): Tap 건너뛰기 링크 영역을 Tap 하면 목적지 섹션으로 화면이 스크롤 된다. 만약 스크린 리더가 활성화된 상태라면 가상 초점이 목적지 섹션으로 이동한다.
- L[1142–1142](../../upstream/krds/raw/components/component_03_01.html:1142): 콘텐츠 탐색
- L[1160–1163](../../upstream/krds/raw/components/component_03_01.html:1160): Tab 목적지 섹션으로 스크롤 된 상태에서 Tab 키를 누르면 이동한 섹션 내부 요소 중 상호작용이 가능한 첫 요소로 초점이 이동한다.
- L[1164–1167](../../upstream/krds/raw/components/component_03_01.html:1164): Swipe 목적지 섹션으로 스크롤 된 상태에서 Swipe 동작을 실행하면 섹션 내부 요소 중 가장 첫 번째 요소로 가상 초점이 이동한다.

### 예시

- L[1186–1186](../../upstream/krds/raw/components/component_03_01.html:1186): 예시
- L[1190–1190](../../upstream/krds/raw/components/component_03_01.html:1190): 기본
- L[1209–1209](../../upstream/krds/raw/components/component_03_01.html:1209): 기본 코드 확인하기

### 마크업 가이드

- L[1229–1229](../../upstream/krds/raw/components/component_03_01.html:1229): 마크업 가이드
- L[1232–1232](../../upstream/krds/raw/components/component_03_01.html:1232): CSS 선택자
- L[1249–1252](../../upstream/krds/raw/components/component_03_01.html:1249): 전체영역 #krds-skip-link
- L[1262–1262](../../upstream/krds/raw/components/component_03_01.html:1262): 개발 시 접근성 관련 주의 사항
- L[1265–1265](../../upstream/krds/raw/components/component_03_01.html:1265): 건너뛰기 링크는 웹페이지 가장 앞에 제공하여 사용자가 제일 먼저 접근할 수 있도록 한다.

Inline preserved example markup (reference, not the public native API): L[1195–1203](../../upstream/krds/raw/components/component_03_01.html:1195)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Recorded independent decision: Resolve targets in the same accessible native root or through an explicit adapter-native target registration. Temporary tabindex=-1 is removed on blur/unmount only if library-added; preserve a pre-existing host tabindex. Do not use cross-root document ID assumptions.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1214 `../../code/skip_link.html`. Do not infer unseen contents.
- 1 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Accepted independent resolution

Resolve targets in the same accessible native root or through an explicit adapter-native target registration. Temporary tabindex=-1 is removed on blur/unmount only if library-added; preserve a pre-existing host tabindex. Do not use cross-root document ID assumptions.

## Shared implementation handoff

The exact semantic interface is `SkipLinkContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
