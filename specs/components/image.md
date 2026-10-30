# Image

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `image`; Korean name 이미지; export `Image`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_04_08](https://www.krds.go.kr/html/site/component/component_04_08.html); preserved [HTML](../../upstream/krds/raw/components/component_04_08.html). Retrieved `2026-10-29T23:28:03.765Z`; `61894` bytes; SHA-256 `d09daa56a0c078f1e17db9481324c43bfbf13a39d4b679120dd9d782a2b9f895`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `informative`, `decorative`, `complex-description`, `responsive`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Native img with explicit alt; decorative alt="". Informative alternatives are concise/contextual and avoid author credit, redundant “image”, duplicate adjacent explanation or invented detail. Complex explanation can use nearby figure/figcaption or described content. Prefer live text over text baked into pixels.

## Plain semantic API

Independent API: src, alt (required, may be empty for decoration), width/height, srcset/sizes, loading, optional caption/descriptionId. Decorative flag must agree with alt. No native image role override or click callback; clickable images compose Link/Button.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Static image adds no tab stop. Link composition accessible name describes purpose. Load/error events expose native outcome without claiming content loaded before actual decode.

## Responsive/mobile requirements

Host supplies meaningful crop/source choices; preserve essential information when narrow. Decorative imagery may be omitted narrow, informative content needs equivalent text. Size assets for environment; no external CDN requirement.

## Forms, reset and composition

No form/reset/IME behavior.

## Asset, integration and composition completion

Host supplies local/correctly attributed assets and descriptions. Completion includes informative, decorative, complex and failed-image outcomes; not remote placeholder images.

## Stable parts and states

root (img), figure, caption, description; loaded,error when observed.

All rendered owned parts use `data-krds-component="image"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Informative alternative survives load failure.
2. Decorative image produces no redundant name.
3. Complex explanation is reachable and related.
4. Responsive crop does not remove essential information.
5. Linked image has purpose-specific name.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`image--informative`, `image--decorative`, `image--complex-description`, `image--responsive`, `image--load-error`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 용례

- L[879–879](../../upstream/krds/raw/components/component_04_08.html:879): 용례
- L[881–881](../../upstream/krds/raw/components/component_04_08.html:881): 사용하기 적합한 경우
- L[886–886](../../upstream/krds/raw/components/component_04_08.html:886): 의료 정보(피부 질환 등)
- L[887–887](../../upstream/krds/raw/components/component_04_08.html:887): 서비스 이용 방법
- L[888–888](../../upstream/krds/raw/components/component_04_08.html:888): 시설 위치
- L[883–890](../../upstream/krds/raw/components/component_04_08.html:883): 사용자에게 정보를 전달하는 데 텍스트보다 이미지가 적합한 경우 의료 정보(피부 질환 등) 서비스 이용 방법 시설 위치
- L[897–897](../../upstream/krds/raw/components/component_04_08.html:897): 텍스트 목록 계층 오류
- L[894–899](../../upstream/krds/raw/components/component_04_08.html:894): 의미가 명확하고 사용자에게 친숙한 아이콘, 이미지, 상징을 활용하게 되면 특히 텍스트를 잘 읽을 수 없거나 난독증이 있는 사용자가 정보를 파악하는 데 도움이 된다. 텍스트 목록 계층 오류
- L[891–901](../../upstream/krds/raw/components/component_04_08.html:891): 사용자에게 정보를 전달하는 데 이미지가 도움 되는 경우 의미가 명확하고 사용자에게 친숙한 아이콘, 이미지, 상징을 활용하게 되면 특히 텍스트를 잘 읽을 수 없거나 난독증이 있는 사용자가 정보를 파악하는 데 도움이 된다. 텍스트 목록 계층 오류
- L[905–905](../../upstream/krds/raw/components/component_04_08.html:905): 이 경우 이미지는 순수하게 장식 용도로 사용된다.
- L[902–907](../../upstream/krds/raw/components/component_04_08.html:902): 이미지를 통해 사용자에게 브랜드에 대한 총체적인 인상이나 재미, 즐거움을 전달하고자 하는 경우 이 경우 이미지는 순수하게 장식 용도로 사용된다.
- L[911–911](../../upstream/krds/raw/components/component_04_08.html:911): 사용하기 적합하지 않은 경우
- L[916–916](../../upstream/krds/raw/components/component_04_08.html:916): 인접한 텍스트와 내용이 일치하지 않거나 의미가 불분명한 이미지 사용, 과도한 이미지 사용은 사용자의 탐색 과정을 방해할 수 있으므로 유의해야 한다.
- L[913–918](../../upstream/krds/raw/components/component_04_08.html:913): 이미지가 정보 이해에 도움이 되지 않거나 화면의 정보 탐색을 방해하는 경우 인접한 텍스트와 내용이 일치하지 않거나 의미가 불분명한 이미지 사용, 과도한 이미지 사용은 사용자의 탐색 과정을 방해할 수 있으므로 유의해야 한다.

### 사용성 가이드라인

- L[926–926](../../upstream/krds/raw/components/component_04_08.html:926): 사용성 가이드라인
- L[929–929](../../upstream/krds/raw/components/component_04_08.html:929): 이미지 콘텐츠를 사용하는 목적에 대해 가장 먼저 정의한다.
- L[930–931](../../upstream/krds/raw/components/component_04_08.html:930): 이미지를 활용하여 사용자에게 전달하고자 하는 것이 무엇인지를 명확하게 정의해야 이에 적합한 스타일의 이미지와 주제를 선택할 수 있다. 이미지는 항상 콘텐츠의 맥락에 맞게 사용해야 한다. 특히 이미지 자체가 링크나 버튼으로 사용되거나 링크, 버튼의 일부로 포함될 경우 링크, 버튼의 용도, 목적, 기능과 일치하는 이미지, 상징을 사용하는 것이 중요하다.
- L[934–934](../../upstream/krds/raw/components/component_04_08.html:934): 이미지에 텍스트를 합성할 때 스타일에 유의한다.
- L[935–936](../../upstream/krds/raw/components/component_04_08.html:935): 이미지 위에 텍스트를 직접 합성하게 되면 해상도 문제로 인해 텍스트의 가독성이 저하될 수 있다. 텍스트에 그림자를 제공하거나 텍스트 영역에 별도의 배경을 적용하여 다양한 해상도에서 텍스트를 잘 읽을 수 있는지 테스트해야 한다. 가장 바람직한 방법은 배경 이미지와 텍스트를 구분하고 텍스트를 마크업으로 제공하는 것이다. 화면 크기가 변경되더라도 손실 없이 정보를 확인할 수 있으며 필요한 경우 사용자는 텍스트의 색상을 원하는 대로 조정할 수 있다.
- L[939–939](../../upstream/krds/raw/components/component_04_08.html:939): 이미지에 대체 텍스트 또는 설명을 제공한다.
- L[940–944](../../upstream/krds/raw/components/component_04_08.html:940): 정보를 전달하는 목적의 이미지에는 alt 속성을 활용하여 대체 텍스트를 제공하거나 이미지 전·후에 설명을 제공해야 한다. alt 속성으로 제공된 대체 텍스트는 스크린 리더 사용자에게 음성 정보로 변환되어 전달된다. 또한 어떠한 문제로 인해 이미지가 표시되지 못하는 경우에 이미지의 자리에 시각적으로 표시되어 정보를 유추할 수 있게 도와주므로 매우 중요하다. 이미지에 대체 텍스트 또는 설명을 제공하는 방법에 대해서는 접근성 체크리스트를 참조하면 된다.

### 플랫폼에 대한 고려 사항

- L[952–952](../../upstream/krds/raw/components/component_04_08.html:952): 플랫폼에 대한 고려 사항
- L[955–955](../../upstream/krds/raw/components/component_04_08.html:955): 사용자의 화면 크기, 접속 환경을 고려하여 이미지 계획을 수립한다.
- L[956–957](../../upstream/krds/raw/components/component_04_08.html:956): 과도한 이미지 사용은 화면 로딩 속도를 증가시키고 사용자가 스크롤 동작을 반복하도록 하여 정보 탐색의 효율성을 저하시킨다. 이는 특히 화면의 뷰포트 영역이 제한적인 모바일 디바이스에서 더 심각한 문제를 야기할 수 있다. 화면 너비가 충분하지 않아 모바일 레이아웃으로 전환할 때에는, 이미지가 사용자에게 의미가 있는지를 판단하여 이미지를 제거하는 방안을 고려해야 한다. 그런 다음, 남은 이미지는 크기를 조정하거나 적절하게 크롭하여 화면에 최적화될 수 있도록 만든다.

### 접근성 가이드라인

- L[1064–1064](../../upstream/krds/raw/components/component_04_08.html:1064): 접근성 가이드라인
- L[1067–1067](../../upstream/krds/raw/components/component_04_08.html:1067): 장식용 이미지를 제외한 모든 이미지에 대체 텍스트를 제공한다.
- L[1068–1068](../../upstream/krds/raw/components/component_04_08.html:1068): 대체 텍스트는 이미지가 제공하는 정보를 구체적이고 정확하면서도 간결한 내용으로 제공해야 한다. 이때, 대체 텍스트에 다음 내용이 포함되지 않도록 유의한다.
- L[1070–1070](../../upstream/krds/raw/components/component_04_08.html:1070): 사진가 또는 이미지를 만든 사람의 정보
- L[1071–1071](../../upstream/krds/raw/components/component_04_08.html:1071): '이미지', '그래픽'과 같이 요소의 역할과 중복되는 텍스트
- L[1072–1072](../../upstream/krds/raw/components/component_04_08.html:1072): 이미지와 인접한 텍스트 설명과 동일한 설명
- L[1073–1073](../../upstream/krds/raw/components/component_04_08.html:1073): 이미지에 없는 추가적인 정보
- L[1081–1081](../../upstream/krds/raw/components/component_04_08.html:1081): 가능한 한 이미지 텍스트를 사용하지 않는다.
- L[1082–1083](../../upstream/krds/raw/components/component_04_08.html:1082): 텍스트 정보를 이미지 형식으로 제공하게 되면 사용자가 해상도 손실 없이 텍스트를 확대/축소할 수 없으며 명도 대비, 자간 동의 표현을 상황에 맞게 조정할 수 없게 된다. 저시력 사용자, 읽기 장애가 있는 사용자가 텍스트 정보의 표현 방식을 변경하여 콘텐츠를 인지할 수 있도록 심미적인 효과 또는 특정한 텍스트 표현이 필수적인 경우를 제외하고 이미지 텍스트를 사용하지 않아야 한다.

### 상호작용 가이드라인

- L[1094–1094](../../upstream/krds/raw/components/component_04_08.html:1094): 상호작용 가이드라인

Inline preserved example markup (reference, not the public native API): No inline sample-view markup in this detail.

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Frozen Image page has no substantive code/selector examples or interaction requirements; proposed native image API is independent design.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `ImageContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
