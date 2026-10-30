# BottomSheet

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `bottom-sheet`; Korean name 바텀시트; export `BottomSheet`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_12_03](https://www.krds.go.kr/html/site/component/component_12_03.html); preserved [HTML](../../upstream/krds/raw/components/component_12_03.html). Retrieved `2026-10-29T23:28:06.049Z`; `58186` bytes; SHA-256 `6748eadb664f497d1b18e6e8a06a4faf9b96681d87eb31505fd000e398a43aa2`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `modal`, `short-content`, `select-cancel`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Bottom overlay/sheet with optional visual header, drag handle, body and clearly perceivable top Close button. Close cancels unconfirmed selection/action. One sheet at a time; avoid long policy/task-step content. Handle description in source repeats slider wording and is not a mandate to implement a range control.

## Plain semantic API

Independent API: open/defaultOpen=false,onOpenChange({open,reason}), required accessible title (visible or aria-label), description?, content, onCancel(), initialFocusId?, returnFocusId?, dismissOnOutside=false. Modal-only first contract; drag-to-close optional with equivalent Close action.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Independent native policy uses reviewed Modal role/dialog focus entry, trap, background isolation, Escape and opener return/unmount cleanup. Close is type=button with name. Pointer handle can drag downward or tap to request close; dragging never sole dismissal. Cancel restores draft value in host, no silent commit.

## Responsive/mobile requirements

Sheet respects bottom safe area and virtual keyboard; bounded height with scrollable content/actions accessible. Reduced-motion removes slide translation. No stacked sheets in first contract.

## Forms, reset and composition

No sheet value/reset; child form independent, Enter follows form semantics and composing Escape ignored. Closing cancel must not reset unrelated page form.

## Asset, integration and composition completion

Host owns selection draft/commit and cancellation. Completion includes usable dialog, close/drag equivalence and local select/cancel flow; not a bottom-positioned div.

## Stable parts and states

root, backdrop, content, handle, header, title, body, actions, close; open,closed,dragging.

All rendered owned parts use `data-krds-component="bottom-sheet"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Open focuses named dialog and traps only while open.
2. Close/Escape cancel draft and restore opener.
3. Drag has Close equivalent.
4. Virtual keyboard/narrow viewport keep controls reachable.
5. Unmount removes scroll lock/isolation.
6. No stacked-sheet ambiguity.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`bottom-sheet--modal`, `bottom-sheet--short-content`, `bottom-sheet--select-cancel`, `bottom-sheet--drag-close`, `bottom-sheet--narrow-keyboard`, `bottom-sheet--removed-opener`, `bottom-sheet--reduced-motion`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[864–864](../../upstream/krds/raw/components/component_12_03.html:864): 구조
- L[870–870](../../upstream/krds/raw/components/component_12_03.html:870): 1. 오버레이(Overlay) 바텀 시트와 기본 창을 시각적으로 구분하기 위한 그림자 또는 가림막
- L[871–872](../../upstream/krds/raw/components/component_12_03.html:871): 2. 헤더(선택) 바텀 시트에서 제공하는 콘텐츠나 요청하는 행동에 대한 간단한 정보를 담은 제목, 설명을 제공함
- L[873–873](../../upstream/krds/raw/components/component_12_03.html:873): 3. 핸들(Handle) 정해진 범위 내 값을 선택하는 선택자로, 슬라이더를 따라 좌/우로 이동함
- L[874–875](../../upstream/krds/raw/components/component_12_03.html:874): 4. 본문 콘텐츠 또는 컴포넌트 요소가 제공되는 영역
- L[876–879](../../upstream/krds/raw/components/component_12_03.html:876): 5. 닫기 버튼 사용자가 바텀 시트를 닫을 수 있게 하는 버튼 요소로 대게 ‘X’ 아이콘으로 표현됨. 바텀 시트에서 데이터를 선택하여 제출하거나 행동을 확정해야 하는 경우, 닫기 버튼은 바텀 시트를 닫는 동시에 취소와 동일한 기능을 제공함

### 용례

- L[887–887](../../upstream/krds/raw/components/component_12_03.html:887): 용례
- L[889–889](../../upstream/krds/raw/components/component_12_03.html:889): 사용하기 적합한 경우
- L[894–896](../../upstream/krds/raw/components/component_12_03.html:894): 바텀시트는 기존화면을 유지한 채 부가적인 정보나 세부 옵션을 제공할 수 있어, 화면전환 없이도 사용자가 현재 맥락을 잃지 않고 추가 행동을 수행할 수 있습니다.
- L[891–898](../../upstream/krds/raw/components/component_12_03.html:891): 사용자의 현재 상황을 보존하며, 추가정보 제공이 필요한 경우 바텀시트는 기존화면을 유지한 채 부가적인 정보나 세부 옵션을 제공할 수 있어, 화면전환 없이도 사용자가 현재 맥락을 잃지 않고 추가 행동을 수행할 수 있습니다.
- L[902–902](../../upstream/krds/raw/components/component_12_03.html:902): 바텀시트는 시각적으로 부각되어 표시되므로, 사용자의 시선을 자연스럽게 집중시켜 핵심 정보나 주요 선택 항목을 명확히 전달할 수 있습니다.
- L[899–904](../../upstream/krds/raw/components/component_12_03.html:899): 사용자가 집중하여 주요 정보를 인지하여야 하는 경우 바텀시트는 시각적으로 부각되어 표시되므로, 사용자의 시선을 자연스럽게 집중시켜 핵심 정보나 주요 선택 항목을 명확히 전달할 수 있습니다.
- L[908–908](../../upstream/krds/raw/components/component_12_03.html:908): 사용하기 적합하지 않은 경우
- L[913–913](../../upstream/krds/raw/components/component_12_03.html:913): 바텀 시트는 화면의 일부를 의도적으로 가리기 때문에 항상 필요한 정보나 도구를 표시하는데 적합하지 않다
- L[910–915](../../upstream/krds/raw/components/component_12_03.html:910): 사용자가 항상 필요로 하는 정보를 표시하는 경우 바텀 시트는 화면의 일부를 의도적으로 가리기 때문에 항상 필요한 정보나 도구를 표시하는데 적합하지 않다
- L[919–919](../../upstream/krds/raw/components/component_12_03.html:919): 바텀 시트는 서비스 제공 또는 정책 정보와 같이 상당 시간을 소비하는 페이지가 아닌 일시적 정보를 제공하는 UI에 적합합니다.
- L[916–921](../../upstream/krds/raw/components/component_12_03.html:916): 서비스 이용에 따른 사용자 여정의 한 스텝으로 사용하는 경우 바텀 시트는 서비스 제공 또는 정책 정보와 같이 상당 시간을 소비하는 페이지가 아닌 일시적 정보를 제공하는 UI에 적합합니다.

### 사용성 가이드라인

- L[929–929](../../upstream/krds/raw/components/component_12_03.html:929): 사용성 가이드라인
- L[932–932](../../upstream/krds/raw/components/component_12_03.html:932): 닫기 버튼을 포함하여 구현하여야 한다.
- L[933–935](../../upstream/krds/raw/components/component_12_03.html:933): 바텀 시트는 상단 핸들을 아래로 스와이프 하거나 탭 하여 닫을 수 있지만, 이 기능을 모든 사용자가 알지 못 한다. 사용자가 바텀 시트를 안정적으로 닫을 수 있도록 화면에서 인지하기 쉬운 바텀 시트 상단에 ‘닫기’ 또는 ‘X’ 버튼을 포함하여 구성하는 것이 좋다.
- L[947–947](../../upstream/krds/raw/components/component_12_03.html:947): 다중으로 바텀 시트를 사용하지 않아야 한다.
- L[948–950](../../upstream/krds/raw/components/component_12_03.html:948): 여러 개의 바텀 시트를 서로 위로 쌓을 경우, 사용자는 현재 자신이 위치한 단계에 혼란을 줄 수 있어 하나의 바텀시트만 사용하는 것이 바람직하다. 부득이하게 여러 개의 바텀 시트를 사용할 수 밖에 없는 경우, 현 단계를 사용자에게 명확하게 전달하여야 하며, 시트를 닫을 때 현재의 시트만 닫을지, 전체 시트를 닫을지를 구분하여 사용자에게 제공해야 한다.
- L[954–954](../../upstream/krds/raw/components/component_12_03.html:954): 짧은 상호작용에만 바텀 시트를 사용한다.
- L[955–956](../../upstream/krds/raw/components/component_12_03.html:955): 바텀 시트는 일시적인 UI 요소로 빠른 상호작용을 지원하기 위해 사용하는 것이 바람직하다. 사용자가 바텀 시트에 표시된 정보를 검토하는데 상당한 시간을 소비해야 하는 경우 바텀 시트를 사용하지 않는 것이 좋다.

Inline preserved example markup (reference, not the public native API): No inline sample-view markup in this detail.

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Official mobile detail has no modal ARIA/focus/keyboard section; modal-only focus policy is independent. Slider-like handle text L873 appears erroneous; do not infer range input.
- 3 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `BottomSheetContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
