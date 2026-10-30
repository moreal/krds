# Identifier

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `identifier`; Korean name 운영기관 식별자; export `Identifier`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_02_02](https://www.krds.go.kr/html/site/component/component_02_02.html); preserved [HTML](../../upstream/krds/raw/components/component_02_02.html). Retrieved `2026-10-29T23:28:02.603Z`; `63641` bytes; SHA-256 `c066b27040aae221596061378f7ce90e3cb675f9aea71aa8395efc2adf64148d`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. Retain component: fixed identity markup and image/text semantics, not a general footer layout.

Supported native cases (variant and state axes): `light`, `dark`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

A section/article as the last subdivision inside footer: operating institution logo followed by the prescribed management sentence. The logo identifies the responsible operating institution, while the service logo belongs elsewhere in Footer. Preserve element placement and sentence pattern.

## Plain semantic API

Independent API: Identifier accepts institutionName, logo {src, alt}, theme light/dark (light default), and explicit institution relationship wording validated by host. alt names the actual institution; no default institution, copyright holder or government relationship.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Static content has no tab stop, live role or change event. If a host separately links an institution, its Link behavior stays distinct from the identifier contract.

## Responsive/mobile requirements

Maintain logo/text order on narrow layouts; keep contrast in light/dark schemes without changing identity.

## Forms, reset and composition

No form value/reset/IME behavior.

## Asset, integration and composition completion

Host supplies truthful institution/relationship and cleared logo. Completion requires local asset provenance and no invented branding. Official restriction against use by nongovernment sites applies to specimens as in Masthead.

## Stable parts and states

root, logo, text; theme=light|dark.

All rendered owned parts use `data-krds-component="identifier"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Identifier is the final section inside the footer landmark.
2. Logo alternative names the operating institution.
3. Service and institution logos are not interchanged.
4. Light/dark versions remain readable at narrow width.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`identifier--light`, `identifier--dark`, `identifier--footer-placement`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_02_02.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_02_02.html:889): 1. 컨테이너 식별 정보가 제공되는 영역
- L[890–890](../../upstream/krds/raw/components/component_02_02.html:890): 2. 운영기관 로고 서비스 운영을 최종적으로 책임지는 기관의 로고
- L[891–891](../../upstream/krds/raw/components/component_02_02.html:891): 3. 안내 텍스트 운영기관의 관리를 받고 있음을 안내하는 정보

### 유형

- L[899–899](../../upstream/krds/raw/components/component_02_02.html:899): 유형
- L[901–901](../../upstream/krds/raw/components/component_02_02.html:901): 라이트
- L[907–907](../../upstream/krds/raw/components/component_02_02.html:907): 다크

### 사용성 가이드라인

- L[917–917](../../upstream/krds/raw/components/component_02_02.html:917): 사용성 가이드라인
- L[920–920](../../upstream/krds/raw/components/component_02_02.html:920): 식별자가 지나치게 주의를 끌지 않도록 표현한다.
- L[921–921](../../upstream/krds/raw/components/component_02_02.html:921): 서비스의 디자인 주제에 적합한 컨테이너 배경색을 사용한다. 화면 하단 영역에서 사용자가 가장 먼저 집중해야 하는 정보는 푸터 내부의 정보와 링크이다.
- L[924–924](../../upstream/krds/raw/components/component_02_02.html:924): 로고 영역에는 서비스의 로고가 아니라 서비스 운영 주체와 관련된 기관의 로고를 제공한다.
- L[925–925](../../upstream/krds/raw/components/component_02_02.html:925): 식별자는 서비스 운영을 책임지는 기관을 안내하기 위한 것이므로 서비스를 운영하는 기관의 로고가 제공되어야 하며 서비스 로고는 푸터에 배치되어야 한다.
- L[928–928](../../upstream/krds/raw/components/component_02_02.html:928): 안내 텍스트와 요소의 배치를 변경하지 않는다.
- L[929–929](../../upstream/krds/raw/components/component_02_02.html:929): 모든 디지털 정부서비스에서 식별자가 일관성 있게 제공되었을 때 신뢰도를 높일 수 있다.
- L[930–930](../../upstream/krds/raw/components/component_02_02.html:930): 안내 텍스트 예시: (운영기관 로고) 이 누리집은 [운영기관명]에서 운영하는 누리집입니다.
- L[934–934](../../upstream/krds/raw/components/component_02_02.html:934): 공식 디지털 정부서비스가 아닌 사이트에서는 식별자를 사용하지 않아야 한다.
- L[935–935](../../upstream/krds/raw/components/component_02_02.html:935): 정부의 공식 서비스가 아닌 곳에서 식별자를 사용하게 될 경우 사용자에게 혼동을 줄 수 있으므로 식별자를 사용하지 않아야 한다.

### 접근성 가이드라인

- L[1060–1060](../../upstream/krds/raw/components/component_02_02.html:1060): 접근성 가이드라인
- L[1063–1063](../../upstream/krds/raw/components/component_02_02.html:1063): 식별자 영역은 구조적으로 푸터 내부에 포함되도록 제공한다.
- L[1064–1064](../../upstream/krds/raw/components/component_02_02.html:1064): 푸터가 항상 문서의 마지막 요소로 제공되어야 하므로 식별자 영역은 &lt;section&gt;이나 &lt;article&gt;로 제공하고 푸터 내부의 가장 마지막 구획으로 포함시킨다.
- L[1070–1070](../../upstream/krds/raw/components/component_02_02.html:1070): 로고 이미지에 대체 텍스트를 제공한다.
- L[1071–1071](../../upstream/krds/raw/components/component_02_02.html:1071): 이미지 로고를 사용하는 경우 스크린 리더를 위한 대체 텍스트를 제공해야 한다.

### 예시

- L[1091–1091](../../upstream/krds/raw/components/component_02_02.html:1091): 예시
- L[1095–1095](../../upstream/krds/raw/components/component_02_02.html:1095): 기본
- L[1117–1117](../../upstream/krds/raw/components/component_02_02.html:1117): 기본 코드 확인하기

### 마크업 가이드

- L[1137–1137](../../upstream/krds/raw/components/component_02_02.html:1137): 마크업 가이드
- L[1140–1140](../../upstream/krds/raw/components/component_02_02.html:1140): CSS 선택자
- L[1157–1160](../../upstream/krds/raw/components/component_02_02.html:1157): 전체영역 .krds-identifier

Inline preserved example markup (reference, not the public native API): L[1100–1111](../../upstream/krds/raw/components/component_02_02.html:1100)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- No additional textual contradiction found. The semantic API/defaults are frozen by this accepted contract; native implementation remains subject to separate evidence/review.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1122 `../../code/identifier.html`. Do not infer unseen contents.
- 3 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `IdentifierContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
