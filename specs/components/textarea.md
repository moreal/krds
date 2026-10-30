# Textarea

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `textarea`; Korean name 텍스트 영역 (Textarea); export `Textarea`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_09_02](https://www.krds.go.kr/html/site/component/component_09_02.html); preserved [HTML](../../upstream/krds/raw/components/component_09_02.html). Retrieved `2026-10-29T23:28:05.395Z`; `71668` bytes; SHA-256 `e8d2416c6bf6905c634a67d1ffddc551e8b233db8a2306831d68a80122c25bd9`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `default`, `limited`, `invalid`, `disabled`, `readonly`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Actual <textarea> with persistent associated label, optional placeholder/help/error and maximum/remaining character information if limited. Count follows label or field. Placeholder never replaces label/help; copy/paste unrestricted.

## Plain semantic API

Independent API: value/defaultValue="", onValueChange({value}), name, rows=5 proposed, required/disabled/readOnly=false, maxLength?, helpId/errorId, invalid=false. Count uses HTML UTF-16 code units to agree with maxlength; label/count wording exposes this project policy if user-facing counts differ.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Native editing, selection, paste and Enter newline. Tab moves focus normally; no Enter submit/shortcut. Preserve selection/composition string during IME; emit input updates without rewriting/truncating composing text. Counter should not announce every keystroke assertively.

## Responsive/mobile requirements

Size for expected text; longer input scrolls vertically inside textarea and arrow keys retain native editing. Allow usable resize and reflow at narrow/zoom; no clipped error/count.

## Forms, reset and composition

Named enabled textarea participates native FormData (readonly included, disabled excluded); reset restores default string and count, controlled reset retains current prop without a callback. Required/maxLength native validity plus explicit error association. Preserve CRLF browser FormData semantics.

## Asset, integration and composition completion

Host owns validation timing and error copy, not component. Completion includes long input, paste, Korean IME, label/error, FormData/reset.

## Stable parts and states

root, label, control, help, error, count; disabled,readonly,invalid,focused.

All rendered owned parts use `data-krds-component="textarea"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Label persists after typing.
2. Enter inserts newline without submitting.
3. Paste and IME preserve text/selection.
4. Count matches configured limit semantics.
5. FormData/reset/disabled/readonly behave natively.
6. Error connected and readable narrow.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`textarea--default`, `textarea--limited`, `textarea--invalid`, `textarea--disabled`, `textarea--readonly`, `textarea--long-value`, `textarea--ime`, `textarea--form-reset`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_09_02.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_09_02.html:889): 1. 레이블 사용자가 어떤 텍스트를 입력해야 하는지를 알려줌
- L[890–890](../../upstream/krds/raw/components/component_09_02.html:890): 2. 입력 영역 텍스트가 입력되는 영역으로 배경과 입력 영역을 구분하여 사용자가 텍스트 영역임을 인지할 수 있게 함
- L[891–891](../../upstream/krds/raw/components/component_09_02.html:891): 3. 플레이스홀더(선택) 어떤 값을 입력해야 하는지에 대한 힌트 또는 예시를 제공함
- L[892–892](../../upstream/krds/raw/components/component_09_02.html:892): 4. 입력된 글자 수 입력 가능한 글자 수와 입력된 글자 수를 안내하는 텍스트

### 용례

- L[900–900](../../upstream/krds/raw/components/component_09_02.html:900): 용례
- L[902–902](../../upstream/krds/raw/components/component_09_02.html:902): 사용하기 적합한 경우
- L[907–907](../../upstream/krds/raw/components/component_09_02.html:907): 텍스트 입력 필드가 아니라 텍스트 영역을 사용해야 한다.
- L[904–909](../../upstream/krds/raw/components/component_09_02.html:904): 입력값이 여러 줄의 텍스트로 예상되는 경우 텍스트 입력 필드가 아니라 텍스트 영역을 사용해야 한다.
- L[913–913](../../upstream/krds/raw/components/component_09_02.html:913): 사용하기 적합하지 않은 경우
- L[918–918](../../upstream/krds/raw/components/component_09_02.html:918): 질문을 여러 개로 분할하고, 가능하다면 응답을 라디오 버튼이나 체크박스로 구성하여 사용자가 텍스트를 직접 입력하지 않고도 빠르게 질문에 응답할 수 있게 해야 한다.
- L[915–920](../../upstream/krds/raw/components/component_09_02.html:915): 여러 가지 질문에 대한 응답을 받기 위한 경우 질문을 여러 개로 분할하고, 가능하다면 응답을 라디오 버튼이나 체크박스로 구성하여 사용자가 텍스트를 직접 입력하지 않고도 빠르게 질문에 응답할 수 있게 해야 한다.

### 사용성 가이드라인

- L[928–928](../../upstream/krds/raw/components/component_09_02.html:928): 사용성 가이드라인
- L[931–931](../../upstream/krds/raw/components/component_09_02.html:931): 입력 영역은 텍스트의 길이를 고려하여 적절한 크기로 제공한다.
- L[932–932](../../upstream/krds/raw/components/component_09_02.html:932): 입력 영역의 높이는 사용자가 입력할 것으로 예상되는 최대 텍스트 길이에 비례하도록 제공하여 사용자가 별도의 스크롤 동작 없이도 한 번에 적절한 양의 텍스트를 확인할 수 있게 만든다.
- L[935–935](../../upstream/krds/raw/components/component_09_02.html:935): 모든 텍스트 영역에는 레이블을 제공한다.
- L[936–936](../../upstream/krds/raw/components/component_09_02.html:936): 텍스트 입력 영역에 레이블이 제공되지 않으면 사용자는 어떤 정보를 입력해야 하는지 알 수 없다. 레이블을 생략하고자 하는 경우에는 레이블 없이도 사용자가 값을 선택하는 데 문제가 없다는 근거가 명확해야 한다.
- L[939–939](../../upstream/krds/raw/components/component_09_02.html:939): 플레이스홀더가 레이블이나 도움말의 대체 수단으로 사용되어서는 안 된다.
- L[940–941](../../upstream/krds/raw/components/component_09_02.html:940): 플레이스홀더는 사용자가 값을 입력하기 시작하는 순간 사라진다. 플레이스홀더가 레이블이나 도움말의 대체 수단으로 활용되는 경우, 사용자는 값을 입력하는 도중 어떤 값을 입력하는 중이었는지, 어떤 형식으로 입력해야 하는지 다시 확인할 수 없다. 또한 거의 모든 웹 브라우저가 플레이스홀더 텍스트의 기본 색상을 최소 명도 대비 기준보다 낮게 제공하므로 읽기 어렵다. 이와 같이 플레이스홀더는 다양한 사용자 그룹에서 여러 사용성 문제를 야기하므로 단순히 사용자의 행동을 유도하기 위한 수단으로 사용해야 한다.
- L[952–952](../../upstream/krds/raw/components/component_09_02.html:952): 복사, 붙여쓰기를 제한하지 않는다.
- L[953–953](../../upstream/krds/raw/components/component_09_02.html:953): 사용자가 다른 웹사이트나 플랫폼에서 텍스트를 복사하여 붙여 넣어야 하는 경우가 있을 수 있으므로 복사, 붙여쓰기 기능을 제한하지 않는 것이 바람직하다.
- L[956–956](../../upstream/krds/raw/components/component_09_02.html:956): 입력 가능한 글자 수에 제한이 있는 경우 사용자에게 글자 수 정보를 제공한다.
- L[957–957](../../upstream/krds/raw/components/component_09_02.html:957): 입력폼 주변에 레이블 다음 또는 입력 영역 다음 요소로 최대 글자 수와 남은 입력 가능 글자 수 정보를 제공한다. 남은 입력 가능 글자 수는 사용자의 입력에 따라 동적으로 업데이트하여 사용자가 입력폼을 제출하기 전에 입력 제약 사항에 대해 예측할 수 있도록 해야 한다.

### 접근성 가이드라인

- L[1068–1068](../../upstream/krds/raw/components/component_09_02.html:1068): 접근성 가이드라인
- L[1071–1071](../../upstream/krds/raw/components/component_09_02.html:1071): 입력 영역과 인접 배경 간 명도 대비를 3:1 이상으로 제공한다.
- L[1072–1072](../../upstream/krds/raw/components/component_09_02.html:1072): 입력 영역의 테두리 또는 채움 색상이 인접한 배경과 3:1 이상의 명도 대비를 갖도록 스타일을 제공하는 것을 권장한다. 인접한 배경과의 명도 대비가 충분한 경우 사용자가 텍스트 영역임을 보다 명확하게 인지할 수 있다.
- L[1079–1079](../../upstream/krds/raw/components/component_09_02.html:1079): 텍스트 영역에 접근 가능한 이름을 제공한다.
- L[1080–1080](../../upstream/krds/raw/components/component_09_02.html:1080): 스크린 리더 사용자가 텍스트 영역의 용도를 확인할 수 있도록 &lt;label&gt;, title, aria-label, aria-labelledby 중 1가지 방식을 이용하여 레이블을 제공해야 한다.

### 상호작용 가이드라인

- L[1093–1093](../../upstream/krds/raw/components/component_09_02.html:1093): 상호작용 가이드라인
- L[1095–1095](../../upstream/krds/raw/components/component_09_02.html:1095): 마우스
- L[1113–1116](../../upstream/krds/raw/components/component_09_02.html:1113): Click 레이블 또는 입력 영역을 Click 하면 입력 영역에 커서가 활성화되면서 텍스트를 입력할 수 있게 된다.
- L[1117–1120](../../upstream/krds/raw/components/component_09_02.html:1117): Scroll 사용자가 많은 양의 텍스트를 작성하여 영역의 기본 높이를 초과하는 경우 영역에 세로 스크롤이 생성되며, 작성한 콘텐츠를 상/하로 탐색할 수 있다.
- L[1127–1127](../../upstream/krds/raw/components/component_09_02.html:1127): 키보드
- L[1145–1148](../../upstream/krds/raw/components/component_09_02.html:1145): Tab, Shift + Tab 모든 텍스트 필드는 사용 불가인 상태를 제외하고 Tab, Shift + Tab 키를 눌렀을 때 접근할 수 있어야 한다.
- L[1149–1152](../../upstream/krds/raw/components/component_09_02.html:1149): 방향키 ↑, ↓ 사용자가 많은 양의 텍스트를 작성하여 영역의 기본 높이를 초과하는 경우 영역에 세로 스크롤이 생성되며, 작성한 콘텐츠를 상/하로 탐색할 수 있다.

### 예시

- L[1171–1171](../../upstream/krds/raw/components/component_09_02.html:1171): 예시
- L[1175–1175](../../upstream/krds/raw/components/component_09_02.html:1175): 기본
- L[1206–1206](../../upstream/krds/raw/components/component_09_02.html:1206): 기본 코드 확인하기

### 마크업 가이드

- L[1226–1226](../../upstream/krds/raw/components/component_09_02.html:1226): 마크업 가이드
- L[1229–1229](../../upstream/krds/raw/components/component_09_02.html:1229): CSS 선택자
- L[1246–1249](../../upstream/krds/raw/components/component_09_02.html:1246): 전체영역 .textarea-wrap
- L[1250–1253](../../upstream/krds/raw/components/component_09_02.html:1250): 텍스트 영역 .krds-input
- L[1263–1263](../../upstream/krds/raw/components/component_09_02.html:1263): 개발 시 접근성 관련 주의 사항
- L[1265–1265](../../upstream/krds/raw/components/component_09_02.html:1265): 입력 필드는 label로 연결이 불가능한 경우 title 속성 등을 제공하여 어떤 값을 입력하는지 알 수 있도록 한다.

Inline preserved example markup (reference, not the public native API): L[1180–1200](../../upstream/krds/raw/components/component_09_02.html:1180)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Recorded independent decision: The accepted count is HTML UTF-16 code units, matching maxlength. Validation occurs on user input/blur according to host-provided required/error state; IME local composition remains untouched until completion and produces no duplicate notification.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1211 `../../code/textarea.html`, L1277 `./variable/input.html`. Do not infer unseen contents.
- 4 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Accepted independent resolution

The accepted count is HTML UTF-16 code units, matching maxlength. Validation occurs on user input/blur according to host-provided required/error state; IME local composition remains untouched until completion and produces no duplicate notification.

## Shared implementation handoff

The exact semantic interface is `TextareaContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
