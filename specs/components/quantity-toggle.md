# QuantityToggle

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `quantity-toggle`; Korean name 수량 토글; export `QuantityToggle`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_12_04](https://www.krds.go.kr/html/site/component/component_12_04.html); preserved [HTML](../../upstream/krds/raw/components/component_12_04.html). Retrieved `2026-10-29T23:28:06.116Z`; `58655` bytes; SHA-256 `d896d4eea40d962bc4cf335c1d325e9101ffd5dd8d8a942d892a8ad97ab4d522`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `default`, `minimum`, `maximum`, `disabled`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Labeled group with decrement button, visible current quantity centered, increment button separated by field. User adjusts by buttons, not keyboard text entry. Bound available choices to <=11 levels including baseline; reaching limit disables corresponding button.

## Plain semantic API

Independent API: min=0,max=10,step=1,value/defaultValue=min,onValueChange({value}),name?,disabled=false,label,unit?. Reject configuration with >11 selectable values or inconsistent step. Center output is read-only text, not editable spinbutton; named hidden value can serialize.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Independent policy: native buttons click/Enter/Space change once. Stable names “decrease/increase [quantity label]”; output relationship identifies current value. At newly disabled boundary, focus retention must remain perceivable (accepted independent policy uses aria-disabled button with blocked activation while keeping focus).

## Responsive/mobile requirements

Button hit regions sufficiently large and spaced around centered value; label/value remain visible on narrow/zoom. No press-and-hold autorepeat default or drag gesture.

## Forms, reset and composition

Optional named hidden input carries actual numeric string and is omitted when disabled; reset restores initial value or controlled reset retains current prop without a callback. Buttons type=button. No free-text/IME path.

## Asset, integration and composition completion

Host owns commonly selected default, bounds and real quantity effect. Completion includes actual boundary feedback and form reset, not static plus/minus icons.

## Stable parts and states

root, label, decrement, output, increment, hidden-input; at-minimum,at-maximum,disabled.

All rendered owned parts use `data-krds-component="quantity-toggle"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Current value always visible and bounded.
2. Each keyboard/pointer activation changes one step.
3. At bounds unavailable action does nothing and state is announced.
4. <=11 values validated.
5. Named value/reset/disabled submission correct.
6. No accidental form submission.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`quantity-toggle--default`, `quantity-toggle--minimum`, `quantity-toggle--maximum`, `quantity-toggle--disabled`, `quantity-toggle--unit-label`, `quantity-toggle--form-reset`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[864–864](../../upstream/krds/raw/components/component_12_04.html:864): 구조
- L[870–870](../../upstream/krds/raw/components/component_12_04.html:870): 1. 레이블 사용자가 어떤 값을 선택해야 하는지를 안내하는 문구
- L[871–872](../../upstream/krds/raw/components/component_12_04.html:871): 2. 버튼 수량 필드의 값을 증가, 감소 시키는 역할의 버튼
- L[873–873](../../upstream/krds/raw/components/component_12_04.html:873): 3. 수량 필드 현재 선택된 값을 표시하는 텍스트

### 용례

- L[882–882](../../upstream/krds/raw/components/component_12_04.html:882): 용례
- L[884–884](../../upstream/krds/raw/components/component_12_04.html:884): 사용하기 적합한 경우
- L[889–891](../../upstream/krds/raw/components/component_12_04.html:889): 증명서 발급 수, 관람 인원 수 등과 같이 일반적으로 선택되는 값이 대부분의 사용자가 선택하는 값이거나 그 값을 크게 벗어나지 않는 경우 사용이 적합하다.
- L[886–893](../../upstream/krds/raw/components/component_12_04.html:886): 사용자들이 선택하는 일반적인 값이 정해져 있는 경우 증명서 발급 수, 관람 인원 수 등과 같이 일반적으로 선택되는 값이 대부분의 사용자가 선택하는 값이거나 그 값을 크게 벗어나지 않는 경우 사용이 적합하다.
- L[894–896](../../upstream/krds/raw/components/component_12_04.html:894): 사용자가 최소한의 선택으로 목표 값을 선택할 수 있는 경우
- L[900–900](../../upstream/krds/raw/components/component_12_04.html:900): 사용하기 적합하지 않은 경우
- L[905–905](../../upstream/krds/raw/components/component_12_04.html:905): ‘나이’와 같이 사용자가 선택할 수 있는 값의 범위가 넓고 다양한 경우 사용하기 적합하지 않다.
- L[902–907](../../upstream/krds/raw/components/component_12_04.html:902): 사용자가 선택할 수 있는 값이 다양한 경우 ‘나이’와 같이 사용자가 선택할 수 있는 값의 범위가 넓고 다양한 경우 사용하기 적합하지 않다.

### 사용성 가이드라인

- L[915–915](../../upstream/krds/raw/components/component_12_04.html:915): 사용성 가이드라인
- L[918–918](../../upstream/krds/raw/components/component_12_04.html:918): 모든 수량 토글에 레이블을 제공한다.
- L[919–921](../../upstream/krds/raw/components/component_12_04.html:919): 수량 토글에 레이블이 제공되지 않으면 사용자는 어떤 수량 값을 선택해야 하는지 알 수 없다. 레이블을 생략하고자 하는 경우에는 레이블이 없어도 사용자가 값을 선택하는데 문제가 없다는 근거가 명확해야 한다.
- L[925–925](../../upstream/krds/raw/components/component_12_04.html:925): 키보드 입력 없이 수량 값 선택을 위해 사용한다.
- L[926–928](../../upstream/krds/raw/components/component_12_04.html:926): 키보드를 사용하여 수량 값 입력 시 발생할 수 있는 오류를 최소화 하고, 기본값의 최소한의 조정을 목표 값을 지적하는데 적합합니다.
- L[932–932](../../upstream/krds/raw/components/component_12_04.html:932): 수량 필드에 현재 값을 항상 표시하여 사용한다.
- L[933–935](../../upstream/krds/raw/components/component_12_04.html:933): 사용자가 증가, 감소 버튼을 클릭할 때 값이 얼마나 증가하거나 감소 하는지 알 수 있도록 수량 필드에 현재 값을 항상 표시하여 제공해야 합니다. 수량필드의 기본 값은 사용자가 가장 자주 선택하는 값으로 제공하는 것 적합합니다.
- L[939–939](../../upstream/krds/raw/components/component_12_04.html:939): 선택 수량의 범위를 제한해야 한다.
- L[940–942](../../upstream/krds/raw/components/component_12_04.html:940): 선택 수량에 제한을 설정할 때 버튼 상태를 비활성화로 변경하여 즉시 피드백을 제공해야 하며, 선택 수량은 기준 값을 포함하여 총 11단계 이내 범위를 제한하여 구현한다. 너무 많은 선택 값을 제공해야 하는 경우 수량 토글 보다는 텍스트 입력 필드를 적용하는 것이 적합합니다.
- L[954–954](../../upstream/krds/raw/components/component_12_04.html:954): 수량 조정 버튼의 크기를 너무 작게 표시하지 않는다.
- L[955–956](../../upstream/krds/raw/components/component_12_04.html:955): 수량 값을 조정하는 증가, 감소 버튼을 모아서 배치하거나, 너무 작게 제공하는 경우 사용자는 속도를 늦추고 신중하게 움직여 잘못 클릭하는 경우를 발생할 수 있다. 수량 조정 버튼은 항상 입력 필드를 가운데 두고 분리하여 배치하는 것이 적합하다.

Inline preserved example markup (reference, not the public native API): No inline sample-view markup in this detail.

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Recorded independent decision: Boundary buttons use aria-disabled=true with blocked activation, a clear unavailable visual/noncolor cue and retained focus. Whole-control disabled uses native disabled controls and omits form value. Independent boundary focus policy does not waive the official unavailable-action outcome.
- 5 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Accepted independent resolution

Boundary buttons use aria-disabled=true with blocked activation, a clear unavailable visual/noncolor cue and retained focus. Whole-control disabled uses native disabled controls and omits form value. Independent boundary focus policy does not waive the official unavailable-action outcome.

## Shared implementation handoff

The exact semantic interface is `QuantityToggleContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
