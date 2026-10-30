# FAB

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `fab`; Korean name 플로팅 버튼; export `FAB`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_05_03](https://www.krds.go.kr/html/site/component/component_05_03.html); preserved [HTML](../../upstream/krds/raw/components/component_05_03.html). Retrieved `2026-10-29T23:28:04.322Z`; `57722` bytes; SHA-256 `ed0e344ae805288e065b84646ec4237e68dc9fdf5c8b935744c83b8f55699863`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `single-icon`, `extended-label`, `expandable`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Fixed bottom-right named action button with icon and optional label; expandable form adds overlay/shadow, expand/close trigger and at most three related actions at <=2 levels. Above bottom TabBar, without covering critical content.

## Plain semantic API

Independent API: required accessible label, onAction(), icon, showLabel=true, expanded/defaultExpanded=false, onExpandedChange({expanded}), actions {id,label,onAction}[] for expandable mode. Trigger type=button; expansion is separate from executing a leaf action.

`showLabel?: boolean` controls only the optional visible primary label. Omission retains the existing visible-label presentation (`true`). When `false`, render the icon-only presentation while preserving the required `label` as the real button's accessible name; decorative icon content is not a replacement name. The label part is not visibly rendered. Related actions still determine expandable behavior independently of label visibility. Changing label visibility emits no action or expansion callback and does not change the action, expansion state or focus. This is a plain independent presentation policy, not an additional official behavior variant. The single-icon local story supplies `showLabel:false`; extended-label supplies `true`; adapters must read the actual prop rather than story IDs.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Independent native policy: all buttons named and keyboard-operable by Enter/Space, trigger aria-expanded/controls. Tab visits expanded actions; Escape collapses and returns trigger. Closed actions untabbable; no modal trap unless explicitly composed as modal.

## Responsive/mobile requirements

Respect bottom safe area/tabbar clearance and zoom. Gesture-intensive pages should avoid overlay obstruction. Reduced motion disables decorative expansion animation.

## Forms, reset and composition

No form value/reset; never submit host form by default.

## Asset, integration and composition completion

Host supplies real primary action; no auth/network in component. Completion needs functioning single and expandable local actions, overlay placement and cleanup.

## Stable parts and states

root, trigger, icon, label, overlay, actions, action; expanded,collapsed,disabled.

All rendered owned parts use `data-krds-component="fab"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Primary keyboard activation fires once.
2. Expansion exposes <=3 reachable named actions.
3. Escape closes and restores trigger.
4. Bottom tabbar and content remain operable.
5. Collapsed actions inaccessible.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`fab--single-icon`, `fab--extended-label`, `fab--expandable`, `fab--tabbar-clearance`, `fab--narrow`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[864–864](../../upstream/krds/raw/components/component_05_03.html:864): 구조
- L[870–870](../../upstream/krds/raw/components/component_05_03.html:870): 1. 아이콘 버튼 이름이 나타내는 의미/개념을 시각적으로 표상화한 요소
- L[871–872](../../upstream/krds/raw/components/component_05_03.html:871): 2. 컨테이너 아이콘 또는 아이콘과 레이블을 담고 있는 영역
- L[873–873](../../upstream/krds/raw/components/component_05_03.html:873): 3. 레이블 버튼 이름을 보여주는 텍스트
- L[874–874](../../upstream/krds/raw/components/component_05_03.html:874): 4. 오버레이(Overlay) 플로팅 액션 버튼과 기본 창을 시각적으로 구분하기 위한 그림자 또는 가림막
- L[875–876](../../upstream/krds/raw/components/component_05_03.html:875): 5. 확장/닫기 버튼 확장을 ‘+’, 닫기는 ‘X’로 표현

### 용례

- L[884–884](../../upstream/krds/raw/components/component_05_03.html:884): 용례
- L[886–886](../../upstream/krds/raw/components/component_05_03.html:886): 사용하기 적합한 경우
- L[891–893](../../upstream/krds/raw/components/component_05_03.html:891): 플로팅 버튼은 화면에서 사용자가 반복적으로 수행하는 주요 단일 행동이 있는 경우, 사용자의 접근성과 사용성을 증진할 수 있다.
- L[888–895](../../upstream/krds/raw/components/component_05_03.html:888): 사용자가 자주 사용하는 단일 행동이 있는 경우 플로팅 버튼은 화면에서 사용자가 반복적으로 수행하는 주요 단일 행동이 있는 경우, 사용자의 접근성과 사용성을 증진할 수 있다.
- L[899–899](../../upstream/krds/raw/components/component_05_03.html:899): 사용하기 적합하지 않은 경우
- L[904–904](../../upstream/krds/raw/components/component_05_03.html:904): 자주 사용하는 행동이 다수인 경우에는 메뉴, 탭바 등과 같이 다른 UI요소가 더 적합하다.
- L[901–906](../../upstream/krds/raw/components/component_05_03.html:901): 사용자의 주요 행동이 다수인 경우 자주 사용하는 행동이 다수인 경우에는 메뉴, 탭바 등과 같이 다른 UI요소가 더 적합하다.
- L[910–910](../../upstream/krds/raw/components/component_05_03.html:910): 지도, 캘린더, 이미지 편집 등과 관리 제스처 조작이 많은 화면의 경우 손동작이나 콘텐츠 탐색 영역을 가려 사용성을저하할 수 있기 때문에 사용하기 적합하지 않다.
- L[907–912](../../upstream/krds/raw/components/component_05_03.html:907): 제스처(Gesture) 중심 화면인 경우 지도, 캘린더, 이미지 편집 등과 관리 제스처 조작이 많은 화면의 경우 손동작이나 콘텐츠 탐색 영역을 가려 사용성을저하할 수 있기 때문에 사용하기 적합하지 않다.

### 사용성 가이드라인

- L[920–920](../../upstream/krds/raw/components/component_05_03.html:920): 사용성 가이드라인
- L[923–923](../../upstream/krds/raw/components/component_05_03.html:923): 플로팅 버튼은 우측 하단에 배치한다.
- L[924–927](../../upstream/krds/raw/components/component_05_03.html:924): 대부분의 사용자가 오른손 엄지손가락으로 스마트 폰을 조작하기 때문에 손가락 접근성을 고려하여 우측하단에 배치하는 것이 제일 안정적이다. 콘텐츠의 흐름이 위에서 아래로 진행되기 때문에 우측 하단에 배치하는 것이 콘텐츠 가림을 최소화 할 수 있다. ‘탭바’를 사용하는 경우 탭바와 겹치지 않게 ‘탭바’ 위 우측 하단에 배치한다.
- L[931–931](../../upstream/krds/raw/components/component_05_03.html:931): 플로팅 버튼은 항상 화면의 모든 항목 위에 배치한다.
- L[932–934](../../upstream/krds/raw/components/component_05_03.html:932): 사용자가 어떤 화면에 있더라도 항상 동일한 주요 작업을 즉시 접근할 수 있도록 해야 하며, 사용자의 주의가 자연스럽게 플로팅 버튼에 집중할 수 있게 시각적 우선순위에 배치하는 것이 좋다.
- L[938–938](../../upstream/krds/raw/components/component_05_03.html:938): 너무 많은 플로팅 버튼을 구성하지 않는다.
- L[939–941](../../upstream/krds/raw/components/component_05_03.html:939): 플로팅 버튼을 2개 이상 사용해야 하는 경우 확장형 플로팅 버튼을 사용하는 것이 적합하며, 확장형 플로팅 버튼의 수량은 3개 이하로 구성하는 것이 적합하다. 너무 많은 수의 플로팅 버튼을 구성하는 경우 사용자에게 시작적 혼란과 중요 버튼의 집중도를 저하할 수 있다.
- L[953–953](../../upstream/krds/raw/components/component_05_03.html:953): 확장형 플로팅 버튼 터치의 깊이는 2수준 이하로만 사용한다.
- L[954–955](../../upstream/krds/raw/components/component_05_03.html:954): 플로팅 버튼은 사용자의 주요 작업을 신속하게 접근, 수행하도록 설계된 구성 요소로, 터치의 깊이가 2수준 이상으로 깊어지면,사용자로 하여금 사용성 저하와 인지 저하를 유발할 수 있다.

Inline preserved example markup (reference, not the public native API): No inline sample-view markup in this detail.

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Frozen detail provides structure/usage only, no ARIA/keyboard contract; native behavior above is independent project policy.
- 3 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `FABContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
