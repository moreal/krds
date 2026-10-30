# StepIndicator

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `step-indicator`; Korean name 단계 표시기; export `StepIndicator`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_07_01](https://www.krds.go.kr/html/site/component/component_07_01.html); preserved [HTML](../../upstream/krds/raw/components/component_07_01.html). Retrieved `2026-10-29T23:28:04.734Z`; `73131` bytes; SHA-256 `2720b539f16fe5e37c42c26eb502fdb0a5da7bfedc557e6c1c5b21f2cd237774`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `sequential`, `adaptive`, `compact`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Native ordered list of 3–7 labeled steps, step numbers, current/completed cues and connectors. Current state announced with aria-current=true or equivalent text; completion not color-only. A process may be static indicators or explicit navigation where host permits.

## Plain semantic API

Independent API: steps {id,label,status:pending|current|complete,href?,optional?}[], mode=sequential|adaptive. Optional onStepRequest({id}) only for configured navigation. Process owner determines blocked future steps and optional-step skip control.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Static labels not tab stops. True navigable steps use anchors or named task buttons; disabled future steps cannot activate. Never imply that selecting a step completes validation. Optional skip has explicit name and destination.

## Responsive/mobile requirements

Narrow compact view may show current/total only (e.g. 1 of 4); keep full accessible process overview without hidden focusable steps. Preserve logical left→right or top→bottom progression.

## Forms, reset and composition

No form value/reset/IME state; child step forms owned by host.

## Asset, integration and composition completion

Host owns process state, completed prerequisites, route/validation and optional skip. Completion includes actual sequential/adaptive local flow rather than colored dots only.

## Stable parts and states

root, list, item, number, label, connector, current-indicator, complete-indicator; current,complete,pending,blocked.

All rendered owned parts use `data-krds-component="step-indicator"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Ordered list communicates current/complete without color.
2. Sequential blocked step cannot bypass validation.
3. Adaptive route is only enabled when configured.
4. Compact mode still exposes current/total.
5. Optional skip reaches next required/review step.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Independent local specimen policy

Every local process specimen, including completed and optional-skip, supplies 3–7 real steps. The optional fixture preserves current optional step `a` and next review step `b`, preceded by completed prerequisite `prerequisite`; its actual skip destination is `/local/review`.

## Required native stories

`step-indicator--sequential`, `step-indicator--adaptive`, `step-indicator--compact`, `step-indicator--optional-skip`, `step-indicator--completed`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_07_01.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_07_01.html:889): 1. 단계 숫자 단계 레이블 옆에 표시되는 작은 텍스트로 각 단계의 번호를 나타냄. 작은 디스플레이에서는 현재 단계, 전체 단계 수를 제외한 정보는 생략할 수 있음(예 - 4단계 중 1단계)
- L[890–890](../../upstream/krds/raw/components/component_07_01.html:890): 2. 단계 레이블 레이블각 단계에서 사용자가 수행해야 할 작업을 요약한 텍스트
- L[891–891](../../upstream/krds/raw/components/component_07_01.html:891): 3. 현재 단계 식별자 진행 중인 단계를 다른 단계와 구분하는 식별자
- L[892–892](../../upstream/krds/raw/components/component_07_01.html:892): 4. 완료된 단계 식별자 완료된 단계를 다른 단계와 구분하는 식별자
- L[893–893](../../upstream/krds/raw/components/component_07_01.html:893): 5. 연결선 단계와 단계 사이를 연결하는 선으로 프로세스의 선형성을 보여줌

### 사용성 가이드라인

- L[901–901](../../upstream/krds/raw/components/component_07_01.html:901): 사용성 가이드라인
- L[904–904](../../upstream/krds/raw/components/component_07_01.html:904): 단계 레이블은 해당 프로세스에 대한 간결하고 명확한 내용으로 제공한다.
- L[905–906](../../upstream/krds/raw/components/component_07_01.html:905): 레이블은 해당 단계/프로세스에서 사용자가 수행해야 하는 작업의 특성을 명확하게 보여줄 수 있는 내용으로 제공해야 한다. 레이블로만 설명을 제공하기 어려운 경우, 보조 텍스트를 인접 영역에 제공할 수 있으나, 레이블 자체는 텍스트가 잘리거나 줄 바꿈이 발생하지 않도록 짧은 단어, 문구로 구성해야 한다.
- L[917–917](../../upstream/krds/raw/components/component_07_01.html:917): 단계는 좌에서 우 또는 상에서 하의 순서로 논리적으로 전개될 수 있도록 구성한다.
- L[918–919](../../upstream/krds/raw/components/component_07_01.html:918): 사용자가 여러 단계로 구성된 프로세스에 관여 중임을 분명하게 인지하고 프로세스의 진행 방향을 확인할 수 있도록 각 단계는 선형적으로 표현한다. 단계의 흐름은 연결선, 화살표, 꺾쇠 기호 등을 활용하여 표현할 수 있다. 이 중 화살표, 꺾쇠 기호는 각 단계를 선형적으로 탐색하는 경우에 적합한 표현 방식이다. 어떤 표현 방식을 사용하든 한 사이트 내에서 단계는 일관성 있게 표현되어야 한다.
- L[922–922](../../upstream/krds/raw/components/component_07_01.html:922): 단계의 수는 최소 3개에서 최대 7개로 제공한다.
- L[923–924](../../upstream/krds/raw/components/component_07_01.html:923): 사용자의 인지적 부담을 줄이기 위해 단계의 수는 최대 7개로 제한할 것을 권장한다. 프로세스를 단계로 구분할 때 불필요한 단계나 사용자의 행동이 포함되지 않았는지 반복적으로 점검하고 논리적, 효율성 측면에서 문제가 없는 과업은 가능한 한 하나의 단계에서 처리될 수 있도록 해야 한다.
- L[927–927](../../upstream/krds/raw/components/component_07_01.html:927): 현재 단계를 명확하게 인지할 수 있도록 표현한다.
- L[928–928](../../upstream/krds/raw/components/component_07_01.html:928): 사용자가 자신이 거쳐온 단계, 앞으로 거쳐야 할 단계를 확인하고 진행 중인 단계의 과업을 명확하게 인지할 수 있도록 현재 단계를 다른 단계와 구분하여 표현해야 한다.
- L[939–939](../../upstream/krds/raw/components/component_07_01.html:939): 과업의 성격에 적합한 탐색 모델을 제공한다.
- L[940–941](../../upstream/krds/raw/components/component_07_01.html:940): 단계 표시기는 프로세스 및 단계의 논리적인 구성에 따라 순차적 탐색, 적응형 탐색 방식을 지원한다. 순차적 탐색 방식에서 사용자는 일단 정해진 순서에 따라 단계를 진행해야 한다. 한 단계에서 필요한 행동이 완료되지 않으면 다음 단계로 이동하는 데 사용되는 UI는 비활성화 상태로 제공된다. 반면 적응형 탐색 방식에서 사용자는 특정 단계를 건너뛰고 다른 단계를 먼저 탐색할 수 있고 건너뛴 단계에 자유로운 순서로 접근할 수 있다.
- L[944–944](../../upstream/krds/raw/components/component_07_01.html:944): 선택적인 단계를 건너뛸 수 있는 수단을 제공한다.
- L[945–946](../../upstream/krds/raw/components/component_07_01.html:945): 선택적인 단계는 가능한 한 모든 필수 단계를 거친 후 가장 마지막에 제공하는 것이 바람직하다. 프로세스에 선택적인 단계가 포함된 경우, 사용자가 선택적인 단계를 건너뛰어 다음 필수 단계로 이동할 수 있는 수단을 제공해야 한다. 남은 필수 단계가 존재하지 않는다면 최종 단계(최종 검토/제출)로 건너뛴다. 건너뛰기 UI에는 사용자가 쉽게 식별하고 이해할 수 있도록 ‘건너뛰기’, ‘다음에 입력하기’ 등 명확한 텍스트 레이블을 제공해야 한다.

### 접근성 가이드라인

- L[1053–1053](../../upstream/krds/raw/components/component_07_01.html:1053): 접근성 가이드라인
- L[1056–1056](../../upstream/krds/raw/components/component_07_01.html:1056): 순서 있는 목록을 사용한다.
- L[1057–1057](../../upstream/krds/raw/components/component_07_01.html:1057): 단계 목록과 항목을 &lt;ol&gt;, &lt;li&gt;로 마크업하여 스크린 리더에서 전체 단계 수와 구성을 빠르게 파악할 수 있도록 한다.
- L[1064–1064](../../upstream/krds/raw/components/component_07_01.html:1064): 단계 식별자를 색상으로만 구분하여 표현하지 않는다.
- L[1065–1065](../../upstream/krds/raw/components/component_07_01.html:1065): 현재 단계, 완료된 단계를 색상 이외의 수단으로 구분할 수 있는 시각적 단서를 제공해야 한다. 밑줄 제공, 1px 이상의 테두리 차이, 식별자 제공 등의 방법으로 크기나 형태 차원에서 정보를 구분하는 방법을 사용할 수 있다.
- L[1072–1072](../../upstream/krds/raw/components/component_07_01.html:1072): 현재 단계를 스크린 리더로 확인할 수 있도록 한다.
- L[1073–1074](../../upstream/krds/raw/components/component_07_01.html:1073): 단계 인디케이터가 시각적으로만 구분되는 것이 아니라 스크린 리더로도 전달될 수 있도록 해야 한다. 만약 단계 레이블에 ‘현재’, ‘현재 단계’라는 텍스트가 제공되지 않고 있다면 현재 탐색 중인 단계에 aria-current="true" 속성을 추가한다. aria-current 속성을 사용할 수 없는 경우, 현재 단계 레이블에 ‘현재 단계’라는 텍스트를 추가하여 시각적으로 표시되도록 하거나 프로그램적으로만 전달되도록 한다.

### 예시

- L[1094–1094](../../upstream/krds/raw/components/component_07_01.html:1094): 예시
- L[1098–1098](../../upstream/krds/raw/components/component_07_01.html:1098): 기본
- L[1187–1187](../../upstream/krds/raw/components/component_07_01.html:1187): 기본 코드 확인하기

### 마크업 가이드

- L[1208–1208](../../upstream/krds/raw/components/component_07_01.html:1208): 마크업 가이드
- L[1211–1211](../../upstream/krds/raw/components/component_07_01.html:1211): CSS 선택자
- L[1231–1234](../../upstream/krds/raw/components/component_07_01.html:1231): 전체영역 .krds-step-wrap
- L[1235–1240](../../upstream/krds/raw/components/component_07_01.html:1235): 단계 &gt; li 완료한 단계 .done
- L[1241–1244](../../upstream/krds/raw/components/component_07_01.html:1241): 현재단계 .active
- L[1245–1248](../../upstream/krds/raw/components/component_07_01.html:1245): 레이블 .step-tit
- L[1258–1258](../../upstream/krds/raw/components/component_07_01.html:1258): 개발 시 접근성 관련 주의 사항
- L[1260–1260](../../upstream/krds/raw/components/component_07_01.html:1260): 단계 표시기는 순서가 있는 목록에 해당하므로 ul 대신 ol 태그를 사용하여 마크업한다.
- L[1261–1261](../../upstream/krds/raw/components/component_07_01.html:1261): 스크린리더로 화면 낭독 시 현재 단계를 구분할 수 있도록 텍스트를 추가해 준다. (.sr-only 사용)

Inline preserved example markup (reference, not the public native API): L[1103–1181](../../upstream/krds/raw/components/component_07_01.html:1103)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Official page does not require clickable indicators; static and navigation semantics must remain separate.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1192 `../../code/step_indicator.html`, L1273 `./variable/step_indicator.html`. Do not infer unseen contents.
- 5 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `StepIndicatorContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
