# Disclosure

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `disclosure`; Korean name 디스클로저; export `Disclosure`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_04_04](https://www.krds.go.kr/html/site/component/component_04_04.html); preserved [HTML](../../upstream/krds/raw/components/component_04_04.html). Retrieved `2026-10-29T23:28:03.476Z`; `75503` bytes; SHA-256 `ade08d8edb621cc764ea84520aa9e1deaa9f74f26f1ba8f1f9ecc0dee8c8467a`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `default`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

A type=button trigger with descriptive text and chevron followed by associated content. Initially collapsed, located beneath related information; normally one disclosure per section. aria-expanded and aria-controls expose state.

## Plain semantic API

Independent API: open/defaultOpen=false, onOpenChange({open}), label, contentId. No form value or href. Each user toggle requests one transition; controlled rejection keeps current visibility.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Click/Enter/Space toggle while focus remains on trigger. Closed content and descendants are removed from focus/a11y trees. If host closes while focus inside, return trigger before hiding.

## Responsive/mobile requirements

Content reflows normally without hidden critical information. No mandatory animation; reduced-motion behavior must remain readable.

## Forms, reset and composition

No value/reset; internal child forms own state and must not be discarded by ordinary collapse unless host requests unmount.

## Asset, integration and composition completion

Host decides appropriate supplemental content; never hide essential error or required task information. Completion includes actual hidden/revealed content and focus checks.

## Stable parts and states

root, trigger, icon, content; open,closed.

All rendered owned parts use `data-krds-component="disclosure"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Default content hidden.
2. One click/Enter/Space toggles once and updates aria-expanded.
3. Collapsed links are untabbable.
4. Focus stays trigger on toggle and returns when focused panel is externally hidden.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`disclosure--default`, `disclosure--interactive-content`, `disclosure--controlled-rejected`, `disclosure--narrow`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[886–886](../../upstream/krds/raw/components/component_04_04.html:886): 구조
- L[892–892](../../upstream/krds/raw/components/component_04_04.html:892): 1. 꺾쇠 아이콘 콘텐츠 섹션의 확장/축소 상태를 나타냄
- L[893–893](../../upstream/krds/raw/components/component_04_04.html:893): 2. 텍스트 확장할 콘텐츠 섹션의 내용을 유추할 수 있는 제목 텍스트
- L[894–894](../../upstream/krds/raw/components/component_04_04.html:894): 3. 컨테이너 정보가 제공되는 콘텐츠 섹션으로 꺾쇠 아이콘이나 텍스트를 눌러 표시하거나 숨길 수 있음

### 용례

- L[902–902](../../upstream/krds/raw/components/component_04_04.html:902): 용례
- L[904–904](../../upstream/krds/raw/components/component_04_04.html:904): 사용하기 적합한 경우
- L[909–909](../../upstream/krds/raw/components/component_04_04.html:909): 화면이 단일 섹션으로 구성된 경우 사용자가 여러 섹션을 비교·탐색하는 인지적 부담이 적으므로 부가적인 상호작용을 통해 콘텐츠를 표시하는 것보다 기본으로 보여주는 것이 적절하다.
- L[906–911](../../upstream/krds/raw/components/component_04_04.html:906): 화면이 여러 개의 콘텐츠 섹션으로 구성된 경우 화면이 단일 섹션으로 구성된 경우 사용자가 여러 섹션을 비교·탐색하는 인지적 부담이 적으므로 부가적인 상호작용을 통해 콘텐츠를 표시하는 것보다 기본으로 보여주는 것이 적절하다.
- L[915–918](../../upstream/krds/raw/components/component_04_04.html:915): 디스클로저는 탭이나 아코디언보다 시각적으로 눈에 덜 띄며 콘텐츠를 표시하기 위한 상호작용이 필요하므로 부가적인 정보를 제공하는 데 사용하는 것이 적합하다. 예) 부가적인 안내 콘텐츠, 시각적으로 표시되는 이미지 대체 텍스트
- L[912–920](../../upstream/krds/raw/components/component_04_04.html:912): 부가적인 정보를 제공하고자 하는 경우 디스클로저는 탭이나 아코디언보다 시각적으로 눈에 덜 띄며 콘텐츠를 표시하기 위한 상호작용이 필요하므로 부가적인 정보를 제공하는 데 사용하는 것이 적합하다. 예) 부가적인 안내 콘텐츠, 시각적으로 표시되는 이미지 대체 텍스트
- L[924–924](../../upstream/krds/raw/components/component_04_04.html:924): 사용하기 적합하지 않은 경우
- L[929–929](../../upstream/krds/raw/components/component_04_04.html:929): 화면이 단일 섹션으로 구성된 경우 부가적인 상호작용을 통해 콘텐츠를 표시하는 것보다 기본으로 정보를 보여주는 것이 적절하다.
- L[926–931](../../upstream/krds/raw/components/component_04_04.html:926): 화면이 단일 콘텐츠 섹션으로 구성된 경우 화면이 단일 섹션으로 구성된 경우 부가적인 상호작용을 통해 콘텐츠를 표시하는 것보다 기본으로 정보를 보여주는 것이 적절하다.
- L[935–935](../../upstream/krds/raw/components/component_04_04.html:935): 디스클로저 내부에 정보가 제공되고 있음을 발견하지 못할 수 있으므로 사용자가 명확하게 인지할 수 있는 레이아웃을 사용해야 한다.
- L[932–937](../../upstream/krds/raw/components/component_04_04.html:932): 오류 메시지나 중요한 정보를 전달해야 하는 경우 디스클로저 내부에 정보가 제공되고 있음을 발견하지 못할 수 있으므로 사용자가 명확하게 인지할 수 있는 레이아웃을 사용해야 한다.
- L[941–941](../../upstream/krds/raw/components/component_04_04.html:941): 표의 셀 내부는 콘텐츠를 표시할 수 있는 공간이 충분하지 않으며, 디스클로저로 인해 행의 높이가 유동적으로 변경되었을 경우 정보를 인지하기 어렵다.
- L[938–943](../../upstream/krds/raw/components/component_04_04.html:938): 표의 셀 내부 표의 셀 내부는 콘텐츠를 표시할 수 있는 공간이 충분하지 않으며, 디스클로저로 인해 행의 높이가 유동적으로 변경되었을 경우 정보를 인지하기 어렵다.

### 사용성 가이드라인

- L[951–951](../../upstream/krds/raw/components/component_04_04.html:951): 사용성 가이드라인
- L[954–954](../../upstream/krds/raw/components/component_04_04.html:954): 기본적으로 축소된 상태로 제공한다.
- L[955–955](../../upstream/krds/raw/components/component_04_04.html:955): 디스클로저는 화면 내 정보를 훑어보는 과정에서 사용자의 인지적 부담을 덜어주기 위한 용도로 사용되므로 화면이 로딩되었을 때 펼쳐진 상태로 제공하는 것은 적절하지 않다.
- L[958–958](../../upstream/krds/raw/components/component_04_04.html:958): 디스클로저를 통해 제공하고자 하는 부가 정보와 관련된 정보/컨트롤/섹션 아래에 배치한다.
- L[959–959](../../upstream/krds/raw/components/component_04_04.html:959): 사용자가 관련 정보와 디스클로저 컨트롤 및 섹션 간 관계를 인지할 수 있도록 부가적인 정보를 제공하고자 하는 요소 아래에 배치한다.
- L[962–962](../../upstream/krds/raw/components/component_04_04.html:962): 가능한 한 하나의 섹션에 하나의 디스클로저만 사용한다.
- L[963–963](../../upstream/krds/raw/components/component_04_04.html:963): 여러 개의 디스클로저를 연속적으로 배치하게 되면 복잡성이 증가되어 오히려 사용자에게 혼동을 줄 수 있다.

### 접근성 가이드라인

- L[1078–1078](../../upstream/krds/raw/components/component_04_04.html:1078): 접근성 가이드라인
- L[1081–1081](../../upstream/krds/raw/components/component_04_04.html:1081): 디스클로저를 버튼 역할로 제공한다.
- L[1082–1082](../../upstream/krds/raw/components/component_04_04.html:1082): 디스클로저를 실행하였을 때 특정 섹션이나 화면으로 이동하는 것이 아니므로 &lt;button&gt;을 사용하거나 role="button"을 사용하여 스크린 리더에서 버튼 역할임을 인지할 수 있도록 한다.
- L[1088–1088](../../upstream/krds/raw/components/component_04_04.html:1088): 스크린 리더에서 확장/축소 상태 정보를 확인할 수 있도록 한다.
- L[1089–1089](../../upstream/krds/raw/components/component_04_04.html:1089): aria-expanded 속성이나 title 속성을 활용하여 디스클로저 섹션의 활성화 상태 정보가 스크린 리더에 탐지될 수 있도록 해야 한다.

### 상호작용 가이드라인

- L[1100–1100](../../upstream/krds/raw/components/component_04_04.html:1100): 상호작용 가이드라인
- L[1102–1102](../../upstream/krds/raw/components/component_04_04.html:1102): 디스클로저 탐색
- L[1120–1123](../../upstream/krds/raw/components/component_04_04.html:1120): Tab, Shift + Tab 디스클로저 컨트롤에 초점이 진입하고 포커스링이 표시된다.
- L[1130–1130](../../upstream/krds/raw/components/component_04_04.html:1130): 디스클로저 확장 및 축소
- L[1148–1151](../../upstream/krds/raw/components/component_04_04.html:1148): Click 디스클로저를 Click 하여 펼치거나 접는다
- L[1152–1155](../../upstream/krds/raw/components/component_04_04.html:1152): Enter, Space 디스클로저 컨트롤이 초점을 가진 상태에서 Enter 또는 Space 키를 눌러 디스클로저를 펼치거나 접을 수 있다

### 예시

- L[1174–1174](../../upstream/krds/raw/components/component_04_04.html:1174): 예시
- L[1178–1178](../../upstream/krds/raw/components/component_04_04.html:1178): 기본
- L[1205–1205](../../upstream/krds/raw/components/component_04_04.html:1205): 기본 코드 확인하기

### 마크업 가이드

- L[1256–1256](../../upstream/krds/raw/components/component_04_04.html:1256): 마크업 가이드
- L[1259–1259](../../upstream/krds/raw/components/component_04_04.html:1259): CSS 선택자
- L[1276–1279](../../upstream/krds/raw/components/component_04_04.html:1276): 전체영역 .krds-disclosure .conts-expand-area
- L[1280–1283](../../upstream/krds/raw/components/component_04_04.html:1280): 디스클로저 버튼 .btn-conts-expand
- L[1284–1287](../../upstream/krds/raw/components/component_04_04.html:1284): 컨테이너 .expand-wrap
- L[1297–1297](../../upstream/krds/raw/components/component_04_04.html:1297): JS
- L[1316–1320](../../upstream/krds/raw/components/component_04_04.html:1316): krds_disclosure init() 초기화 및 주요 이벤트 실행
- L[1321–1324](../../upstream/krds/raw/components/component_04_04.html:1321): setupDisclosure() 디스클로저 설정
- L[1325–1328](../../upstream/krds/raw/components/component_04_04.html:1325): toggleDisclosure() 디스클로저 토글
- L[1356–1356](../../upstream/krds/raw/components/component_04_04.html:1356): 개발 시 접근성 관련 주의 사항
- L[1358–1358](../../upstream/krds/raw/components/component_04_04.html:1358): 키보드 탐색 시 초점이 순차적으로 이동하는지 확인한다.

Inline preserved example markup (reference, not the public native API): L[1183–1199](../../upstream/krds/raw/components/component_04_04.html:1183)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- No additional textual contradiction found. The semantic API/defaults are frozen by this accepted contract; native implementation remains subject to separate evidence/review.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1210 `../../code/disclosure.html`, L1343 `../../../resources/js/examples/krds_disclosure.js`, L1370 `./variable/disclosure.html`. Do not infer unseen contents.
- 3 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `DisclosureContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
