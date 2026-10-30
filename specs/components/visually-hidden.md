# VisuallyHidden

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `visually-hidden`; Korean name 숨긴 콘텐츠; export `VisuallyHidden`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_11_02](https://www.krds.go.kr/html/site/component/component_11_02.html); preserved [HTML](../../upstream/krds/raw/components/component_11_02.html). Retrieved `2026-10-29T23:28:05.828Z`; `59345` bytes; SHA-256 `85084e384fe08830d57e655107833ede6044760d3e4c83f20dc54ddd0c5488c6`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `text`, `interactive-overlay`, `aria-association`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Text hiding primitive preserves meaningful content in accessibility tree, plus a separate interactive overlay pattern matching visible surrogate geometry. Never display:none/visibility:hidden, zero-sized/zero-font text, offscreen displaced focus targets. Prefer native semantics/visible information first.

## Plain semantic API

Independent API: VisuallyHidden renders span by default with id/lang/content; text variant uses nonzero clipping style. Interactive-overlay variant requires an actual native child control over its visible representation at matching dimensions, opacity/z-index and visible surrogate focus outline. ARIA relationship mode uses actual IDs/attributes instead of extra hidden duplicate name.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Text primitive has no tab stop/key behavior. Interactive child retains native keyboard behavior and a visible focus indicator at its true position; do not apply 1px text-clipping style to focusable controls. Screen-reader virtual cursor geometry manually tested.

## Responsive/mobile requirements

Maintain overlay alignment on responsive layout/zoom and translate hidden text when service locale changes. Test mobile VoiceOver/TalkBack as well as desktop combinations named in source.

## Forms, reset and composition

Hidden content itself no form value. Native overlaid input retains full name/value/reset/IME rules of consuming control.

## Asset, integration and composition completion

Host owns meaningful descriptions and translations; this primitive does not replace proper native semantics or universal naming decisions. Completion includes text a11y-tree proof plus interactive geometry/manual AT evidence; CSS class alone untested is insufficient.

## Stable parts and states

root, overlay-control, visible-surrogate; text,interactive-overlay,focus-visible.

All rendered owned parts use `data-krds-component="visually-hidden"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Text remains in a11y tree while visually absent.
2. No zero-size/display-none implementation.
3. Native child focus outline aligns with visible surrogate.
4. Zoom/reflow preserves virtual cursor geometry.
5. Locale update translates hidden content.
6. No duplicate spoken label.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`visually-hidden--text`, `visually-hidden--aria-association`, `visually-hidden--interactive-overlay`, `visually-hidden--zoom`, `visually-hidden--translated`, `visually-hidden--manual-at`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 용례

- L[857–857](../../upstream/krds/raw/components/component_11_02.html:857): 용례
- L[859–859](../../upstream/krds/raw/components/component_11_02.html:859): 사용하기 적합한 경우
- L[861–861](../../upstream/krds/raw/components/component_11_02.html:861): 텍스트가 아닌 콘텐츠에 대한 복잡한 설명을 제공하는 경우
- L[862–862](../../upstream/krds/raw/components/component_11_02.html:862): 지시 사항을 전달하거나 조작 방식을 설명하는 경우
- L[863–863](../../upstream/krds/raw/components/component_11_02.html:863): 요소나 화면의 상태 변화에 대한 정보를 전달하는 경우
- L[867–867](../../upstream/krds/raw/components/component_11_02.html:867): 사용하기 적합하지 않은 경우
- L[869–869](../../upstream/krds/raw/components/component_11_02.html:869): 전달하는 정보가 간결한 이미지 콘텐츠
- L[870–870](../../upstream/krds/raw/components/component_11_02.html:870): 요소에 접근 가능한 이름을 전달하고자 하는 경우

### 유형

- L[878–878](../../upstream/krds/raw/components/component_11_02.html:878): 유형
- L[880–880](../../upstream/krds/raw/components/component_11_02.html:880): WAI-ARIA 표준을 사용하는 콘텐츠
- L[881–881](../../upstream/krds/raw/components/component_11_02.html:881): WAI-ARIA 속성을 사용하여 숨긴 콘텐츠를 구현할 수 있다. 예를 들어, aria-label, aria-describedby, aria-labelledby 등의 속성을 적절히 활용하여 스크린 리더 사용자가 정보를 충분히 인지할 수 있도록 해야 한다.
- L[884–884](../../upstream/krds/raw/components/component_11_02.html:884): 전용 스타일을 적용한 텍스트 콘텐츠
- L[885–885](../../upstream/krds/raw/components/component_11_02.html:885): 전용 스타일을 적용하여 콘텐츠를 시각적으로 숨길 수 있다. 다음과 같은 CSS를 사용하면 화면에는 시각적으로 표시되지 않지만 스크린 리더에는 노출할 수 있다.
- L[895–895](../../upstream/krds/raw/components/component_11_02.html:895): 전용 스타일을 적용한 대화형 요소
- L[896–896](../../upstream/krds/raw/components/component_11_02.html:896): 모바일 등 특정 디바이스에서 대화형 요소를 시각적으로 숨길 때, 스크린 리더의 가상 커서 위치가 정확하게 표시되도록 하는 스타일이다. 아래 코드를 적용하더라도 부모 요소의 레이아웃 특성에 따라 가상 커서 위치가 달라질 수 있으므로, 반드시 스크린 리더로 테스트해야 한다.

### 사용성 가이드라인

- L[910–910](../../upstream/krds/raw/components/component_11_02.html:910): 사용성 가이드라인
- L[913–913](../../upstream/krds/raw/components/component_11_02.html:913): 숨긴 콘텐츠를 사용하는 대신 주변 정보를 활용하거나 시각으로 정보를 표시하는 방안을 우선 고려한다.
- L[914–915](../../upstream/krds/raw/components/component_11_02.html:914): 숨김 콘텐츠를 필요로 하는 사용자 중 다수는 스크린 리더가 낭독하는 음성 정보와 화면에 표시된 시각 정보를 함께 확인한다. 따라서 콘텐츠는 누구나 확인할 수 있도록 시각적으로 표시하는 것이 바람직하며, 부가적으로 설명이 필요한 경우나 텍스트가 아닌 콘텐츠에 대한 설명이 필요한 경우에만 숨긴 텍스트를 제공하는 것이 바람직하다.
- L[918–918](../../upstream/krds/raw/components/component_11_02.html:918): 시맨틱 마크업을 한다.
- L[919–920](../../upstream/krds/raw/components/component_11_02.html:919): 정보의 의미/역할에 적합한 태그를 사용하게 되면 별도의 설명을 제공하지 않아도 스크린 리더는 해당 요소가 전달하고자 하는 정보의 특성(예 - 표, 목록, 제목 등)을 사용자에게 전달할 수 있다. 또한 대부분의 스크린 리더는 주요 태그별로 탐색할 수 있는 단축키가 지정되어 있거나, 단위별 탐색 기능을 지원하므로 사용자는 보다 효과적으로 화면 내 정보를 탐색할 수 있게 된다.
- L[923–923](../../upstream/krds/raw/components/component_11_02.html:923): 숨긴 콘텐츠에 스크린 리더가 정보를 탐지하는 것을 방지하는 스타일을 사용하지 않는다.
- L[924–925](../../upstream/krds/raw/components/component_11_02.html:924): CSS의 visibility:hidden, display:none 속성은 적용된 요소를 표시할 화면의 시각적 플로에서 제거하기 때문에 스크린 리더를 사용하지 않는 사용자도 해당 요소를 볼 수 없으며 스크린 리더는 이를 무시한다. 따라서 숨긴 텍스트는 코드 예제를 참조하여 적절한 시각적 숨김 스타일을 적용해야 하며, visibility:hidden 또는 display:none이 사용되어서는 안 된다.
- L[928–928](../../upstream/krds/raw/components/component_11_02.html:928): 숨긴 콘텐츠의 크기 지정에 유의한다.
- L[929–929](../../upstream/krds/raw/components/component_11_02.html:929): width:0, height:0, font-size:0, line-height:0과 같은 스타일이 적용되었을 때, 정보가 어떤 태그로 마크업되었는지, 어떤 스크린 리더를 사용하는지에 따라 정보가 무시될 수 있으므로 사용하지 않아야 한다.
- L[932–932](../../upstream/krds/raw/components/component_11_02.html:932): 대화형 요소를 숨길 때 상대적 위치 지정에 유의한다.
- L[933–934](../../upstream/krds/raw/components/component_11_02.html:933): &lt;label&gt;, &lt;input&gt;과 같은 대화형 요소에 text-indent, top, left 등의 스타일 속성을 사용하여, 대화형 요소가 본래 배치되어야 할 영역을 벗어난 곳으로 이동하게 되면 요소에 키보드가 접근하거나 스크린 리더의 가상 초점이 접근했을 때 포커스링을 확인할 수 없게 된다. 별도의 값을 지정하는 대신 top, left 스타일 속성값이 auto로 유지되도록 해야 한다.
- L[937–937](../../upstream/krds/raw/components/component_11_02.html:937): 대화형 요소를 숨길 때 크기 지정에 유의한다.
- L[938–939](../../upstream/krds/raw/components/component_11_02.html:938): 대화형 요소를 숨기기 위해 높이와 너비를 1px로 지정하게 되면 키보드가 접근하거나 스크린 리더의 가상 초점이 접근했을 때 포커스링을 확인할 수 없게 된다. 대화형 요소를 시각적으로 숨길 때는 시각적으로 표시할 대체 요소의 크기와 숨겨진 대화형 요소의 크기를 같게 유지하고 z-index, opacity 스타일 속성을 사용하여 숨겨야 한다. 또한 키보드 사용자가 포커스링을 확인할 수 있도록 별도의 outline 속성을 제공해야 한다.
- L[942–942](../../upstream/krds/raw/components/component_11_02.html:942): 서비스 제공 언어를 변경할 때 숨긴 콘텐츠에 포함된 텍스트의 언어도 변경되도록 한다.
- L[943–943](../../upstream/krds/raw/components/component_11_02.html:943): 숨긴 콘텐츠는 화면에 표시되지 않기 때문에 서비스 제공 언어를 번역하는 과정에서 놓치기 쉽고, 콘텐츠를 검토하는 과정에서도 문제가 있음을 발견하기 어렵다.
- L[946–946](../../upstream/krds/raw/components/component_11_02.html:946): 텍스트 편집기에 숨긴 콘텐츠를 제공할 수 있는 옵션을 제공한다.
- L[947–947](../../upstream/krds/raw/components/component_11_02.html:947): 서비스 내·외부 사용자가 콘텐츠를 작성할 때, 스크린 리더 사용자를 위한 부가 설명을 제공할 수 있도록 숨긴 콘텐츠를 작성할 수 있는 입력란을 제공하거나 관련 기능을 제공하는 텍스트 편집기를 채택하는 것이 좋다.
- L[950–950](../../upstream/krds/raw/components/component_11_02.html:950): 스크린 리더 테스트를 수행한다.
- L[951–952](../../upstream/krds/raw/components/component_11_02.html:951): 사용자 에이전트, 스크린 리더는 주기적으로 업데이트되기 때문에 숨긴 콘텐츠가 호환되지 않을 수 있다. 따라서 정기적인 스크린 리더 테스트를 거쳐 숨긴 콘텐츠가 제대로 작동하고 있는지 확인해야 한다. 다양한 스크린 리더(예 - SenseReader, VoiceOver, TalkBack)와 브라우저(예 - Chrome, Edge, Safari) 조합에서 테스트를 수행해 호환성을 보장해야 한다.

Inline preserved example markup (reference, not the public native API): No inline sample-view markup in this detail.

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Recorded independent decision: The text primitive exposes descriptive content, not a universal accessible-name generator. In aria-association mode the native consuming control owns actual same-root aria-labelledby/aria-describedby relationships and any target ID; the primitive does not add duplicate hidden labels. Text clipping must never be applied to focusable native controls. This explicit scope preserves both quoted source statements without inventing a blanket naming recipe.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L889 `./code/hidden_text.html`, L900 `./code/hidden_control.html`. Do not infer unseen contents.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Accepted independent resolution

The text primitive exposes descriptive content, not a universal accessible-name generator. In aria-association mode the native consuming control owns actual same-root aria-labelledby/aria-describedby relationships and any target ID; the primitive does not add duplicate hidden labels. Text clipping must never be applied to focusable native controls. This explicit scope preserves both quoted source statements without inventing a blanket naming recipe.

## Shared implementation handoff

The exact semantic interface is `VisuallyHiddenContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
