# Spinner

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `spinner`; Korean name 스피너; export `Spinner`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_07_02](https://www.krds.go.kr/html/site/component/component_07_02.html); preserved [HTML](../../upstream/krds/raw/components/component_07_02.html). Retrieved `2026-10-29T23:28:04.806Z`; `69546` bytes; SHA-256 `9e6ffa72e4e23e83cef056b525264dbcd19a89cfbfeda28bfcd125c70007c422`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `determinate`, `indeterminate`, `inline`, `region`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Progress path/indicator near actual pending operation; determinate fills 0–360 clockwise from actual progress, indeterminate rotates clockwise. Not decorative; no unnecessary <1s wait spinner. One region spinner except independent inline operations.

## Plain semantic API

Independent API: pending, value? (0–100), label, completionMessage, size=medium; value absent means indeterminate. Determinate role=progressbar with min/max/now; loading/completion polite status distinct from animated decoration. Invalid/nonfinite range is configuration error.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

No focus move, keyboard action or focus trap. Emit no simulated progress/completion timers; host changes pending/value. Polite loading/completed messages occur once per actual lifecycle, not each animation frame.

## Responsive/mobile requirements

Adequate size/3:1 path/background contrast. Reduced motion replaces continuous spin with stable progress/label as independent policy; source asks loop not pause at zero, so record accessibility alternative explicitly.

## Forms, reset and composition

No form value/reset/IME behavior.

## Asset, integration and composition completion

Host owns real loading lifetime, content readiness and aria-busy on target region. Completion requires actual local operation transition and accessible start/end, not permanent animated ring.

## Stable parts and states

root, track, indicator, label, status; pending,complete,determinate,indeterminate.

All rendered owned parts use `data-krds-component="spinner"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Value accurately reflects supplied progress.
2. Indeterminate has no fake aria-valuenow.
3. Start/end announced politely once.
4. No focus stolen.
5. Pending ends when host completes and no timer remains.
6. Reduced-motion retains meaningful status.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`spinner--determinate`, `spinner--indeterminate`, `spinner--inline`, `spinner--region`, `spinner--complete`, `spinner--reduced-motion`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_07_02.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_07_02.html:889): 1. 경로 식별자가 표시되는 경로로 표현 방식에 따라 시각적으로 경로를 표시하거나 식별자의 운동 경로를 위해 가상으로 설정할 수 있음
- L[890–890](../../upstream/krds/raw/components/component_07_02.html:890): 2. 식별자 경로를 따라 이동하는 시각적 표시기로 상태 정보를 안내함

### 유형

- L[898–898](../../upstream/krds/raw/components/component_07_02.html:898): 유형
- L[900–900](../../upstream/krds/raw/components/component_07_02.html:900): 확정 스피너
- L[901–901](../../upstream/krds/raw/components/component_07_02.html:901): 확정 스피너는 완료 상태로 변경되기까지의 진행률을 계산할 수 있는 경우에 사용한다. 식별자가 도넛형 경로의 0도에서부터 360도까지 채워지면서 진행 정도를 표시한다. 파일 다운로드, 업로드와 같이 명확한 종료 지점이 존재하는 경우에 사용하기 적합하다.
- L[904–904](../../upstream/krds/raw/components/component_07_02.html:904): 불확정 스피너
- L[905–905](../../upstream/krds/raw/components/component_07_02.html:905): 불확정 스피너는 계산할 수 없는 대기 시간을 표현할 때 사용한다. 필터링·정렬 옵션을 사용했을 때와 같이 시스템의 작업이 진행 중이지만 완료까지 걸리는 시간을 확정할 수 없는 경우에 사용하기 적합하다.

### 용례

- L[912–912](../../upstream/krds/raw/components/component_07_02.html:912): 용례
- L[914–914](../../upstream/krds/raw/components/component_07_02.html:914): 사용하기 적합한 경우
- L[919–920](../../upstream/krds/raw/components/component_07_02.html:919): 페이지 전체가 로딩되거나 페이지의 맥락이 완전히 변경된 영역의 콘텐츠가 변경되는 경우에 사용한다. 스피너를 화면 중앙 또는 맥락이 변경되는 콘텐츠 영역 중앙에 배치하여 전체 페이지의 콘텐츠가 로딩되고 있음을 표시한다. 페이지 로딩에 오랜 시간이 걸리고 중대한 변경이 발생하는 프로세스에 적합하다.
- L[916–922](../../upstream/krds/raw/components/component_07_02.html:916): 화면이 완전히 새롭게 로딩되는 경우 페이지 전체가 로딩되거나 페이지의 맥락이 완전히 변경된 영역의 콘텐츠가 변경되는 경우에 사용한다. 스피너를 화면 중앙 또는 맥락이 변경되는 콘텐츠 영역 중앙에 배치하여 전체 페이지의 콘텐츠가 로딩되고 있음을 표시한다. 페이지 로딩에 오랜 시간이 걸리고 중대한 변경이 발생하는 프로세스에 적합하다.
- L[926–926](../../upstream/krds/raw/components/component_07_02.html:926): 화면이나 페이지의 전환 없이 일부 요소에 시스템의 작업이 진행되고 있는 경우 해당 요소 컨테이너 내부에 스피너를 표시할 수 있다. 검색 필드, 버튼과 같은 컴포넌트에 사용한다.
- L[923–928](../../upstream/krds/raw/components/component_07_02.html:923): 화면에서 일부 요소의 상태에 변경이 발생하는 경우 화면이나 페이지의 전환 없이 일부 요소에 시스템의 작업이 진행되고 있는 경우 해당 요소 컨테이너 내부에 스피너를 표시할 수 있다. 검색 필드, 버튼과 같은 컴포넌트에 사용한다.
- L[932–932](../../upstream/krds/raw/components/component_07_02.html:932): 사용하기 적합하지 않은 경우
- L[937–937](../../upstream/krds/raw/components/component_07_02.html:937): 스피너 제공을 고려하고 있는 화면, 요소가 완료 상태로 변경되는 데 안정적으로 1초 미만의 시간이 걸리는 경우 스피너를 사용하지 않는다. 이용 가능한 상태로 빠르게 전환될 수 있음에도 불구하고 스피너를 제공하게 되면 오히려 주의가 산만해질 수 있다.
- L[934–939](../../upstream/krds/raw/components/component_07_02.html:934): 완료 상태로 변경되는 데 1초 미만의 시간이 걸리는 경우 스피너 제공을 고려하고 있는 화면, 요소가 완료 상태로 변경되는 데 안정적으로 1초 미만의 시간이 걸리는 경우 스피너를 사용하지 않는다. 이용 가능한 상태로 빠르게 전환될 수 있음에도 불구하고 스피너를 제공하게 되면 오히려 주의가 산만해질 수 있다.

### 사용성 가이드라인

- L[947–947](../../upstream/krds/raw/components/component_07_02.html:947): 사용성 가이드라인
- L[951–951](../../upstream/krds/raw/components/component_07_02.html:951): 스피너를 장식용으로 사용하지 않는다.
- L[952–952](../../upstream/krds/raw/components/component_07_02.html:952): 스피너는 실제 대기 상태가 필요한 경우에 사용해야 한다. 화면이 빠르게 표시될 수 있음에도 불구하고 스피너를 제공하게 되면 오히려 주의가 산만해질 수 있다.
- L[955–955](../../upstream/krds/raw/components/component_07_02.html:955): 상황에 맞는 적절한 크기의 스피너를 사용한다.
- L[956–957](../../upstream/krds/raw/components/component_07_02.html:956): 페이지 전체의 맥락이 변경되거나 공간적으로 제약이 없는 요소에서의 대기 상태를 표현하는 경우에는 큰 크기의 스피너를 사용하여 사용자가 스피너를 명확하게 인지할 수 있도록 한다. 버튼, 메뉴 항목, 입력 필드와 같이 세로 및 가로 공간이 제한되어 있는 경우 작은 스피너를 사용한다.
- L[960–960](../../upstream/krds/raw/components/component_07_02.html:960): 스피너는 처리가 진행 중인 영역 근처에 배치한다.
- L[961–961](../../upstream/krds/raw/components/component_07_02.html:961): 사용자가 주의를 기울일 것으로 예상되는 위치에 배치해야 한다. 예를 들어 특정 콘텐츠 영역에 대한 데이터가 검색되고 있음을 표시하는 경우 해당 영역에 스피너를 표시한다. 입력폼의 제출 처리 상태를 표시하기 위해서는 제출 버튼 내부에 스피너를 사용할 수 있다.
- L[964–964](../../upstream/krds/raw/components/component_07_02.html:964): 불확정 스피너의 애니메이션의 루프를 중지하지 않는다.
- L[965–965](../../upstream/krds/raw/components/component_07_02.html:965): 불확정 스피너에서 식별자가 0도 위치에 도달하였을 때 애니메이션이 중지되면 사용자는 시스템이 작동을 멈춘 것으로 오인할 수 있다.
- L[968–968](../../upstream/krds/raw/components/component_07_02.html:968): 컴포넌트의 일부로 작게 표시되지 않는 한, 두 개 이상의 스피너를 동시에 표시하지 않는다.
- L[969–969](../../upstream/krds/raw/components/component_07_02.html:969): 정보 과부하와 시각적 노이즈를 줄이기 위해 가능한 한 화면에는 1개의 스피너만 표시될 수 있도록 한다. 파일 업로드 컴포넌트와 같이 개별 항목에 진행 상태 정보가 표시되어야 하는 경우를 제외하고, 화면이나 관련 영역 중앙에 1개의 스피너를 사용하는 것이 적절하다.

### 접근성 가이드라인

- L[1077–1077](../../upstream/krds/raw/components/component_07_02.html:1077): 접근성 가이드라인
- L[1081–1081](../../upstream/krds/raw/components/component_07_02.html:1081): 인접 배경과 경로 간 명도 대비, 경로와 식별자 간 명도 대비를 3:1 이상으로 표현한다.
- L[1082–1082](../../upstream/krds/raw/components/component_07_02.html:1082): 시력이 좋지 않은 사용자도 스피너의 출현 여부와 진행 상태를 인지할 수 있도록 인접 배경과 경로 간 명도 대비, 경로와 식별자 간 명도 대비를 3:1 이상으로 제공해야 한다.
- L[1091–1091](../../upstream/krds/raw/components/component_07_02.html:1091): 스피너 상태에 대한 설명을 스크린 리더에서 확인할 수 있도록 한다.
- L[1092–1093](../../upstream/krds/raw/components/component_07_02.html:1092): 스크린 리더 사용자가 스피너를 통해 제공되는 페이지 로딩 상태 정보를 확인할 수 있도록 스피너가 제공되기 시작했을 때와 로딩이 완료되었을 때의 상태 정보를 제공해야 한다. 페이지의 핵심 정보에 대한 음성 안내 방해를 최소화하도록 aria-live 속성값은 assertive가 아닌 polite를 사용해야 한다.

### 상호작용 가이드라인

- L[1107–1107](../../upstream/krds/raw/components/component_07_02.html:1107): 상호작용 가이드라인
- L[1110–1110](../../upstream/krds/raw/components/component_07_02.html:1110): 확정 스피너
- L[1111–1111](../../upstream/krds/raw/components/component_07_02.html:1111): 식별자가 도넛형 경로의 0도에서부터 360도까지 채워지면서 진행 정도를 표시한다. 식별자가 채워진 정도는 실제 진행률을 반영해야 하며, 360도 전체가 채워지면 스피너를 숨기고 페이지를 표시한다. 식별자는 0도에서 운동을 시작하여 시계 방향으로 경로를 채운다.
- L[1114–1114](../../upstream/krds/raw/components/component_07_02.html:1114): 불확정 스피너
- L[1115–1115](../../upstream/krds/raw/components/component_07_02.html:1115): 식별자가 도넛형 경로의 0도에서부터 360도를 따라 회전하면서 대기 상태에 있음을 표시한다. 페이지가 표시되기 전까지 식별자의 회전 운동은 반복되어야 한다. 식별자는 0도에서 운동을 시작하여 시계 방향으로 회전한다.

### 예시

- L[1131–1131](../../upstream/krds/raw/components/component_07_02.html:1131): 예시
- L[1135–1135](../../upstream/krds/raw/components/component_07_02.html:1135): 기본
- L[1176–1176](../../upstream/krds/raw/components/component_07_02.html:1176): 기본 코드 확인하기

### 마크업 가이드

- L[1196–1196](../../upstream/krds/raw/components/component_07_02.html:1196): 마크업 가이드
- L[1199–1199](../../upstream/krds/raw/components/component_07_02.html:1199): CSS 선택자
- L[1216–1219](../../upstream/krds/raw/components/component_07_02.html:1216): 전체영역 .krds-spinner

Inline preserved example markup (reference, not the public native API): L[1140–1170](../../upstream/krds/raw/components/component_07_02.html:1140)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Recorded independent decision: Reduced motion replaces continuous rotation with a static perceivable indicator plus loading/completion text; determinate values remain real progress. This is independent accessibility policy, not a claim of literal source rotation compliance.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1181 `../../code/spinner.html`, L1234 `./variable/spinner.html`. Do not infer unseen contents.
- 1 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Accepted independent resolution

Reduced motion replaces continuous rotation with a static perceivable indicator plus loading/completion text; determinate values remain real progress. This is independent accessibility policy, not a claim of literal source rotation compliance.

## Shared implementation handoff

The exact semantic interface is `SpinnerContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
