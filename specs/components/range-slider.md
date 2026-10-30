# RangeSlider

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `range-slider`; Korean name 범위슬라이드; export `RangeSlider`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_12_01](https://www.krds.go.kr/html/site/component/component_12_01.html); preserved [HTML](../../upstream/krds/raw/components/component_12_01.html). Retrieved `2026-10-29T23:28:05.892Z`; `58988` bytes; SHA-256 `49cf06a81cbea5a27c4dced0676a69d073d43ae0c2fc2908331e5d296699551f`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `single-value`, `disabled`, `discrete`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Persistent label, slider track/handle, current value above handle or at track end (not below finger), visible minimum/maximum. Official detail illustrates one selected value within range, not proof of two-thumb interval selection. Recommended step about 10–20% of range.

## Plain semantic API

Independent API: min=0,max=100,step=10,value/defaultValue=0, `onValueChange({value:number})`, name,label,disabled=false,valueText? formatter. **No onValueCommit API is offered in this contract.** Native input[type=range] is preferred; output reflects the committed value with units. Invalid bounds/step are rejected and fractional math normalized without drift. The defined value/read-once default/no-mode-switch and no mount/prop/reset callback rules follow [pilot conventions](./README.md). Controlled native input changes are requests; display/output/submitted value remain the committed prop if rejected.

## Keyboard, focus and state transitions

Officially support dragging handle and clicking track. Independent native keyboard policy: arrows change one step, Home/End reach limits, normal Tab/focus and numeric native value semantics; no invented two-thumb roles. For each native user input event whose requested normalized number differs from the committed value, emit one onValueChange. Uncontrolled input commits that number before the callback; controlled input emits the request once and reconciles native value/output back to the prop if declined.

A drag may produce multiple distinct input requests, one per changed input event; a track click producing one changed input produces one request; each changed keyboard adjustment produces one request. Same-value/boundary input emits none. Native change, pointerup, blur and gesture completion add **no second or commit callback**. Pointer cancellation preserves the last committed value and produces no synthetic rollback/commit request. No input/change double notification. Preserve vertical page scrolling during touch and actual native form lifecycle.

## Responsive/mobile requirements

Current value remains above/end and not occluded by finger; min/max readable narrow/zoom; large enough handle and non-drag keyboard/click equivalent.

## Forms, reset and composition

Named enabled native range contributes value; disabled excluded; reset restores default and output. Controlled reset retains current prop without a callback. No IME editing; embedded editable value alternative is outside this draft.

## Asset, integration and composition completion

Host owns units/setting effects. Completion includes actual bounded native range, output and form lifecycle, not decorative track. No external engine needed.

## Stable parts and states

root, label, control, track, range, thumb, output, minimum, maximum; disabled,dragging.

All rendered owned parts use `data-krds-component="range-slider"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Pointer drag/track click and arrows update one bounded value.
2. Home/End reach bounds.
3. Visible output and accessible value text match units.
4. Reset/FormData/disabled correct.
5. Touch does not prevent normal vertical scrolling.
6. Fractional steps avoid drift.
7. Drag input, one changed track click and changed keyboard adjustments each emit one request per changed input and no extra callback from change, release, blur or completion.
8. Same-value boundary actions, pointer cancellation, props, mount and reset produce no synthetic value or commit callback.
9. Controlled rejected range input reconciles native value, visible output and FormData to the committed prop.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`range-slider--single-value`, `range-slider--discrete`, `range-slider--disabled`, `range-slider--form-reset`, `range-slider--narrow-touch`, `range-slider--input-notification-counts`, `range-slider--controlled-rejected`, `range-slider--pointer-cancel`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[864–864](../../upstream/krds/raw/components/component_12_01.html:864): 구조
- L[870–870](../../upstream/krds/raw/components/component_12_01.html:870): 1. 레이블 사용자가 어떤 값을 선택해야 하는지를 안내하는 문구
- L[871–872](../../upstream/krds/raw/components/component_12_01.html:871): 2. 슬라이더(Slider) 핸들의 이동 경로를 보여주는 영역
- L[873–874](../../upstream/krds/raw/components/component_12_01.html:873): 3. 핸들(Handle) 정해진 범위 내 값을 선택하는 선택자로, 슬라이더를 따라 좌/우로 이동함
- L[875–875](../../upstream/krds/raw/components/component_12_01.html:875): 4. 선택 값 현재 선택된 값을 표시하는 텍스트
- L[876–876](../../upstream/krds/raw/components/component_12_01.html:876): 5. 범위 값 슬라이더의 최소 값과 최대 값

### 용례

- L[884–884](../../upstream/krds/raw/components/component_12_01.html:884): 용례
- L[886–886](../../upstream/krds/raw/components/component_12_01.html:886): 사용하기 적합한 경우
- L[891–893](../../upstream/krds/raw/components/component_12_01.html:891): 선택하여야 하는 값이 특정 범위 내에서 선택해야 한다고 알려주는 것이 더 중요한 경우
- L[888–895](../../upstream/krds/raw/components/component_12_01.html:888): 범위가 정확도 보다 더 중요한 경우 선택하여야 하는 값이 특정 범위 내에서 선택해야 한다고 알려주는 것이 더 중요한 경우
- L[899–899](../../upstream/krds/raw/components/component_12_01.html:899): 볼륨이나 해상도 밝기 설정 처럼 정확한 특정 값 보다 상대적 값 지정에 중점을 둔 경우
- L[896–901](../../upstream/krds/raw/components/component_12_01.html:896): 상대적인 값이 정확한 값보다 더 중요한 경우 볼륨이나 해상도 밝기 설정 처럼 정확한 특정 값 보다 상대적 값 지정에 중점을 둔 경우
- L[905–905](../../upstream/krds/raw/components/component_12_01.html:905): 볼륨 설정, 해상도 설정, 선호도 조사, 모드 설정, 글자크기설정, 숫자지정 등
- L[902–907](../../upstream/krds/raw/components/component_12_01.html:902): 적합한 예) 볼륨 설정, 해상도 설정, 선호도 조사, 모드 설정, 글자크기설정, 숫자지정 등
- L[911–911](../../upstream/krds/raw/components/component_12_01.html:911): 사용하기 적합하지 않은 경우
- L[916–916](../../upstream/krds/raw/components/component_12_01.html:916): 사용자가 특정한 수치나 단위를 입력해야 하는 경우
- L[913–918](../../upstream/krds/raw/components/component_12_01.html:913): 정확한 값이 중요한 경우 사용자가 특정한 수치나 단위를 입력해야 하는 경우
- L[922–922](../../upstream/krds/raw/components/component_12_01.html:922): 세밀한 조정보다는 ‘ON/OFF’, “낮음/보통/높음’처럼 명확한 단일 선택이 효율적인 경우
- L[919–924](../../upstream/krds/raw/components/component_12_01.html:919): 사용자가 세밀한 조정보다는 빠른 성택을 원할 경우 세밀한 조정보다는 ‘ON/OFF’, “낮음/보통/높음’처럼 명확한 단일 선택이 효율적인 경우

### 사용성 가이드라인

- L[932–932](../../upstream/krds/raw/components/component_12_01.html:932): 사용성 가이드라인
- L[935–935](../../upstream/krds/raw/components/component_12_01.html:935): 모든 범위 슬라이더에 레이블 제공한다.
- L[936–938](../../upstream/krds/raw/components/component_12_01.html:936): 범위 슬라이더에 레이블이 제공되지 않으면 사용자는 어떤 값을 선택해야 하는지 알 수 없다. 레이블을 생략하고자 하는 경우에는 레이블이 없어도 사용자가 값을 선택하는 데 문제가 없다는 근거가 명확해야 한다,
- L[941–941](../../upstream/krds/raw/components/component_12_01.html:941): 사용자의 선택 값은 항상 인지할 수 있는 곳에 표기 한다.
- L[942–943](../../upstream/krds/raw/components/component_12_01.html:942): 사용자가 핸들을 이용하여 선택한 선택 값은 핸들의 위 또는 슬라이더의 끝에 배치하여 항상 사용자가 인지할 수 있게 표기하여야 한다. 플랫폼의 특성상 손가락을 이용하여 값을 선택하기 때문에 선택 값을 하단에 배치하여서는 안 된다.
- L[956–956](../../upstream/krds/raw/components/component_12_01.html:956): 핸들을 드래그할 수 있어야 한다.
- L[957–958](../../upstream/krds/raw/components/component_12_01.html:957): 사용자가 슬라이더 위의 핸들을 드래그하거나, 슬라이더 자체의 특정 위치를 선택하여 값을 변경할 수 있어야 한다.
- L[962–962](../../upstream/krds/raw/components/component_12_01.html:962): 범위 정보를 표시하여야 한다.
- L[963–964](../../upstream/krds/raw/components/component_12_01.html:963): 사용자에게 슬라이더 선택 값의 최소값과 최대값에 대한 정보를 제공하여야 한다
- L[968–968](../../upstream/krds/raw/components/component_12_01.html:968): 선택 값을 너무 세밀하게 설정하지 않는다.
- L[969–970](../../upstream/krds/raw/components/component_12_01.html:969): 범위 슬라이더에서는 상대적인 값이 구체적인 값보다 중요하므로 단계 속성을 너무 세밀하게 설정하지 않는다. 단계 값이너무 세밀한 경우, 사용자에게 인지적 부담을 줄 수 있으며 단계는 전체 범위의 10%~20%로 설정하는 것이 적정하다.

Inline preserved example markup (reference, not the public native API): No inline sample-view markup in this detail.

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- The previously unspecified commit event is removed; input-only change timing and cancellation policy are independent design. Frozen mobile guidance still does not establish a two-thumb interval, exact keyboard/page-step or touch geometry rule.
- 5 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `RangeSliderContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
