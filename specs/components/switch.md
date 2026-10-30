# Switch

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `switch`; Korean name 토글 스위치; export `Switch`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_06_07](https://www.krds.go.kr/html/site/component/component_06_07.html); preserved [HTML](../../upstream/krds/raw/components/component_06_07.html). Retrieved `2026-10-29T23:28:04.668Z`; `81080` bytes; SHA-256 `d24abf7be779128a28e4a62746ccfe801a442cacb0d3ecb5386b92062b554625`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `medium`, `large`, `with-help`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Labeled boolean control with track, handle, state icon and optional aria-describedby help. Stable purpose label does not change with state. Use native checkbox with role=switch and actual checked boolean; no mixed state.

## Plain semantic API

Independent API: checked/defaultChecked=false, onCheckedChange({checked}), label, name/value optional, disabled=false, help/error IDs, size=medium. Callback requests immediate setting application; controlled host can reject while pending without visually lying.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Label/control click and Space toggle once; normal Tab/focus. aria-checked actual state; no extra Enter requirement inferred. State icon/handle provides noncolor clue and 3:1 contrast.

## Responsive/mobile requirements

Consistent label/control layout throughout page; nearby label on wide container. Touch-friendly target and readable help on narrow screens.

## Forms, reset and composition

If named, native checked checkbox FormData behavior; uncontrolled reset restores defaultChecked, controlled state remains its current prop without a callback. Setting side effects occur only from explicit user action/host policy, not mount/prop/reset replay. No IME.

## Asset, integration and composition completion

Host owns actual preference/storage/async error. Do not use for choices requiring separate Apply; Checkbox/Radio fits those cases. Local stories change an observable local setting.

## Stable parts and states

root, control, track, handle, state-icon, label, help; checked,unchecked,disabled.

All rendered owned parts use `data-krds-component="switch"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Purpose label stays constant.
2. Space/label fires one change.
3. Visible/aria state match controlled acceptance.
4. Help relationship announced.
5. Reset does not replay external setting command.
6. Named enabled checked input participates in FormData.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`switch--medium`, `switch--large`, `switch--with-help`, `switch--disabled`, `switch--controlled-rejected`, `switch--form-reset`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_06_07.html:883): 구조
- L[892–892](../../upstream/krds/raw/components/component_06_07.html:892): a. 경로(Track) 핸들의 이동 경로를 보여주는 내부 영역 또는 테두리
- L[893–893](../../upstream/krds/raw/components/component_06_07.html:893): b. 핸들(Handle) 두 상태의 전환 상태를 표시하는 인디케이터로 경로를 따라 좌/우로 이동함
- L[889–895](../../upstream/krds/raw/components/component_06_07.html:889): 1. 스위치 a. 경로(Track) 핸들의 이동 경로를 보여주는 내부 영역 또는 테두리 b. 핸들(Handle) 두 상태의 전환 상태를 표시하는 인디케이터로 경로를 따라 좌/우로 이동함
- L[896–896](../../upstream/krds/raw/components/component_06_07.html:896): 2. 레이블 상태를 적용할 대상 정보를 나타내는 텍스트
- L[897–897](../../upstream/krds/raw/components/component_06_07.html:897): 3. 상태 아이콘 선택/선택 해제 상태를 보여주는 아이콘
- L[898–898](../../upstream/krds/raw/components/component_06_07.html:898): 4. 도움말 (선택) 대상 정보, 선택 결과 등에 대한 사용자의 이해를 돕기 위해 부가적인 설명을 제공할 때 사용하는 텍스트

### 용례

- L[906–906](../../upstream/krds/raw/components/component_06_07.html:906): 용례
- L[908–908](../../upstream/krds/raw/components/component_06_07.html:908): 사용하기 적합한 경우
- L[913–913](../../upstream/krds/raw/components/component_06_07.html:913): 두 가지 상태가 부울 유형(Boolean)이어서 상호 배타적인 경우, 토글 스위치를 사용할 수 있다.
- L[910–915](../../upstream/krds/raw/components/component_06_07.html:910): 서로 반대인 두 가지 상태 값을 선택하는 경우 두 가지 상태가 부울 유형(Boolean)이어서 상호 배타적인 경우, 토글 스위치를 사용할 수 있다.
- L[919–919](../../upstream/krds/raw/components/component_06_07.html:919): 알림의 표시 여부 등 기능의 사용을 설정하거나 해제할 때, 토글 스위치를 사용하여 값을 선택하도록 하는 것이 적절하다.
- L[916–921](../../upstream/krds/raw/components/component_06_07.html:916): 기능의 사용을 설정하거나 해제하고자 하는 경우 알림의 표시 여부 등 기능의 사용을 설정하거나 해제할 때, 토글 스위치를 사용하여 값을 선택하도록 하는 것이 적절하다.
- L[925–925](../../upstream/krds/raw/components/component_06_07.html:925): 선택한 상태가 화면/서비스 전체에 즉각적으로 반영되는 경우, 토글 스위치를 사용하여 값을 선택하도록 하는 것이 적절하다.
- L[922–927](../../upstream/krds/raw/components/component_06_07.html:922): 상태 전환의 결과가 즉각적으로 반영되는 경우 선택한 상태가 화면/서비스 전체에 즉각적으로 반영되는 경우, 토글 스위치를 사용하여 값을 선택하도록 하는 것이 적절하다.
- L[931–931](../../upstream/krds/raw/components/component_06_07.html:931): 사용하기 적합하지 않은 경우
- L[936–936](../../upstream/krds/raw/components/component_06_07.html:936): 중간 상태를 가지는 체크박스 목록을 사용한다.
- L[933–938](../../upstream/krds/raw/components/component_06_07.html:933): 선택 옵션이 계층 구조를 가지는 경우 중간 상태를 가지는 체크박스 목록을 사용한다.
- L[942–942](../../upstream/krds/raw/components/component_06_07.html:942): 서로 반대되는 상태를 선택하는 경우라도 단일 레이블로 적절하게 설명하기 어렵다면, 라디오 버튼을 사용하여 선택 컨트롤을 2개로 나누고 각각의 라디오 버튼에 정확하게 레이블을 제공하는 것이 좋다.
- L[939–944](../../upstream/krds/raw/components/component_06_07.html:939): 레이블이 직관적이지 않은 경우 서로 반대되는 상태를 선택하는 경우라도 단일 레이블로 적절하게 설명하기 어렵다면, 라디오 버튼을 사용하여 선택 컨트롤을 2개로 나누고 각각의 라디오 버튼에 정확하게 레이블을 제공하는 것이 좋다.
- L[948–948](../../upstream/krds/raw/components/component_06_07.html:948): 토글 형태의 요소는 항상 기본 상태를 갖는다. 기본 상태가 존재하지 않는(켜짐 또는 꺼짐이 모두 아님) 상황에서는 토글을 사용하지 않아야 한다.
- L[945–950](../../upstream/krds/raw/components/component_06_07.html:945): 기본 상태가 존재하지 않는 경우 토글 형태의 요소는 항상 기본 상태를 갖는다. 기본 상태가 존재하지 않는(켜짐 또는 꺼짐이 모두 아님) 상황에서는 토글을 사용하지 않아야 한다.
- L[954–954](../../upstream/krds/raw/components/component_06_07.html:954): 부울 유형(Boolean)의 상태를 전환하는 것이 아니라면 라디오 버튼을 사용한다.
- L[951–956](../../upstream/krds/raw/components/component_06_07.html:951): 두 상태가 서로 반대되는 상태가 아닌 경우 부울 유형(Boolean)의 상태를 전환하는 것이 아니라면 라디오 버튼을 사용한다.
- L[960–960](../../upstream/krds/raw/components/component_06_07.html:960): 라디오 버튼을 사용한다.
- L[957–962](../../upstream/krds/raw/components/component_06_07.html:957): 여러 개의 상호 배타적인 선택 옵션이 존재하는 경우 라디오 버튼을 사용한다.
- L[966–966](../../upstream/krds/raw/components/component_06_07.html:966): 선택 정보 및 옵션의 특성에 따라 체크박스나 라디오 버튼을 사용한다.
- L[963–968](../../upstream/krds/raw/components/component_06_07.html:963): 선택한 옵션 값의 적용에 별도 제출/적용 과정이 필요한 경우 선택 정보 및 옵션의 특성에 따라 체크박스나 라디오 버튼을 사용한다.

### 사용성 가이드라인

- L[976–976](../../upstream/krds/raw/components/component_06_07.html:976): 사용성 가이드라인
- L[980–980](../../upstream/krds/raw/components/component_06_07.html:980): 레이블은 가능한 명사형으로 작성한다.
- L[981–981](../../upstream/krds/raw/components/component_06_07.html:981): 명사형으로 작성하였을 때 의미가 명확하지 않다면 동사형으로 변경하거나, 부가적인 도움말을 제공하여 토글 스위치를 켜고 끄는 동작을 통해 무엇이 변경되는지를 사용자가 직관적으로 이해할 수 있어야 한다.
- L[992–992](../../upstream/krds/raw/components/component_06_07.html:992): 스위치 상태에 상관없이 레이블을 일관되게 유지한다.
- L[993–994](../../upstream/krds/raw/components/component_06_07.html:993): 스위치 상태가 변경될 때마다 레이블의 내용이 변경되어서는 안 된다. 스위치 상태 정보는 핸들의 위치, 상태 아이콘을 통해 전달할 수 있으므로 레이블의 내용은 스위치의 목적을 정확하게 보여줄 수 있는 내용으로 작성한다. 상태 정보를 텍스트로 제공하고자 하는 경우, 스위치의 인접 영역에 별도 텍스트로 제공해야 한다.
- L[1005–1005](../../upstream/krds/raw/components/component_06_07.html:1005): 레이블과 스위치 사이의 거리에 유의한다.
- L[1006–1006](../../upstream/krds/raw/components/component_06_07.html:1006): 레이블과 스위치가 지나치게 멀리 배치되어 있으면 사용자에 따라 두 요소 간 관계를 파악하기 어려울 수 있다. 넓은 컨테이너 내부에 스위치를 사용해야 하는 경우, 레이블을 스위치 오른쪽과 같이 보다 인접한 영역에 배치하는 것이 바람직하다.
- L[1017–1017](../../upstream/krds/raw/components/component_06_07.html:1017): 한 화면 내에서의 토글 스위치 표현에 동일한 레이아웃을 사용한다.
- L[1018–1019](../../upstream/krds/raw/components/component_06_07.html:1018): 만약 목록의 왼쪽 열에 레이블이 배치되고 오른쪽 열에 스위치가 배치된다면 목록에서의 모든 스위치는 동일한 배열을 가져야 한다. 또한 상태 레이블이나 상태 아이콘을 사용한 스위치가 하나라도 존재한다면, 이 역시 모든 스위치 항목에 제공되어야 한다. 이를 통해, 사용자의 시선이 일관된 흐름으로 이동하도록 도와 탐색 피로도를 최소화할 수 있다.

### 접근성 가이드라인

- L[1136–1136](../../upstream/krds/raw/components/component_06_07.html:1136): 접근성 가이드라인
- L[1139–1139](../../upstream/krds/raw/components/component_06_07.html:1139): 경로, 핸들, 상태 아이콘과 인접 배경 간 명도 대비를 3:1 이상으로 표현한다.
- L[1140–1140](../../upstream/krds/raw/components/component_06_07.html:1140): 경로와 핸들은 요소가 토글 스위치임을 알려주는 시각적 단서이며, 상태 아이콘은 스위치의 활성화 상태 정보를 전달하는 중요 정보이므로 인접한 영역과 3:1 이상의 명도 대비를 준수해야 한다.
- L[1147–1147](../../upstream/krds/raw/components/component_06_07.html:1147): 토글 스위치를 키보드로 탐색하고 실행할 수 있도록 한다.
- L[1148–1148](../../upstream/krds/raw/components/component_06_07.html:1148): 토글 스위치로 작동하는 요소에 display:none, visibility:hidden, opacity:0과 같은 스타일을 적용하면 스크린 리더에서 요소의 역할을 인지할 수 없으며 키보드로 옵션을 선택할 수 없게 된다.
- L[1156–1156](../../upstream/krds/raw/components/component_06_07.html:1156): 토글 스위치에 키보드 초점이 명확하게 표시되도록 한다.
- L[1157–1157](../../upstream/krds/raw/components/component_06_07.html:1157): 시각적으로 표시되고 있는 토글 스위치와 숨겨진 요소의 크기 및 위치를 일치시켜 포커스링이 적절하게 표시되도록 구현해야 한다.
- L[1165–1165](../../upstream/krds/raw/components/component_06_07.html:1165): 토글 스위치에 접근 가능한 이름을 제공한다.
- L[1166–1167](../../upstream/krds/raw/components/component_06_07.html:1166): 스크린 리더 사용자가 스위치의 용도를 확인할 수 있도록 &lt;label&gt;, aria-label, aria-labelledby 중 1가지 방식을 이용하여 레이블을 제공해야 한다. 이때, 가능하면 &lt;label&gt;을 이용하여 사용자가 레이블을 클릭하였을 때도 값을 선택할 수 있도록 구현하는 것이 좋다.
- L[1175–1175](../../upstream/krds/raw/components/component_06_07.html:1175): 스크린 리더에서 도움말을 인지할 수 있도록 한다.
- L[1176–1176](../../upstream/krds/raw/components/component_06_07.html:1176): 스위치가 도움말을 aria-describedby로 연결하여 스크린 리더가 스위치에 접근하였을 때, 도움말 정보를 즉각적으로 전달받을 수 있도록 한다.

### 상호작용 가이드라인

- L[1187–1187](../../upstream/krds/raw/components/component_06_07.html:1187): 상호작용 가이드라인
- L[1189–1189](../../upstream/krds/raw/components/component_06_07.html:1189): 옵션 탐색
- L[1207–1210](../../upstream/krds/raw/components/component_06_07.html:1207): Tab, Shift + Tab 모든 토글 스위치는 Tab, Shift + Tab 키를 눌렀을 때 접근할 수 있어야 한다.
- L[1217–1217](../../upstream/krds/raw/components/component_06_07.html:1217): 옵션 선택 및 선택 해제
- L[1235–1238](../../upstream/krds/raw/components/component_06_07.html:1235): Click 사용자는 스위치 또는 레이블을 눌러 선택하거나 선택 해제할 수 있다. 일반적으로 스위치는 조작하기에 크기가 충분하지 않으므로 레이블로 상호작용이 확장될 수 있도록 구현해야 한다.
- L[1239–1242](../../upstream/krds/raw/components/component_06_07.html:1239): Space 스위치에 초점이 있는 상태에서 Space 키를 누르면 값이 선택된다.

### 예시

- L[1261–1261](../../upstream/krds/raw/components/component_06_07.html:1261): 예시
- L[1265–1265](../../upstream/krds/raw/components/component_06_07.html:1265): 기본
- L[1293–1293](../../upstream/krds/raw/components/component_06_07.html:1293): 기본 코드 확인하기
- L[1309–1309](../../upstream/krds/raw/components/component_06_07.html:1309): 사이즈
- L[1333–1333](../../upstream/krds/raw/components/component_06_07.html:1333): 사이즈 코드 확인하기

### 마크업 가이드

- L[1353–1353](../../upstream/krds/raw/components/component_06_07.html:1353): 마크업 가이드
- L[1356–1356](../../upstream/krds/raw/components/component_06_07.html:1356): CSS 선택자
- L[1377–1383](../../upstream/krds/raw/components/component_06_07.html:1377): switch 감싸는 영역 .krds-form-toggle-switch 사이즈 중간 .medium
- L[1384–1387](../../upstream/krds/raw/components/component_06_07.html:1384): 크게 .large

Inline preserved example markup (reference, not the public native API): L[1270–1287](../../upstream/krds/raw/components/component_06_07.html:1270), L[1314–1327](../../upstream/krds/raw/components/component_06_07.html:1314)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- No additional textual contradiction found. The semantic API/defaults are frozen by this accepted contract; native implementation remains subject to separate evidence/review.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1298 `../../code/toggle_switch.html`, L1338 `../../code/toggle_switch_size.html`, L1402 `./variable/toggle_switch.html`. Do not infer unseen contents.
- 9 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `SwitchContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
