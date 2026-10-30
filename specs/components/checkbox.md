# Checkbox

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `checkbox`; Korean name 체크박스; export `Checkbox`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_06_02](https://www.krds.go.kr/html/site/component/component_06_02.html); preserved [HTML](../../upstream/krds/raw/components/component_06_02.html). Retrieved `2026-10-29T23:28:04.458Z`; `85481` bytes; SHA-256 `ec11aad1a4bb2912e7381e3e81472e30817fdc92cdb712de0e039e95fc0fe537`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `binary`, `mixed-parent`, `chip`, `medium`, `large`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Native checkbox and associated label, optional fieldset/legend group. Hierarchical select-all parent exposes mixed when some children checked; binary controls independent. Vertical with right labels default.

## Plain semantic API

Independent API: `checked?:boolean`, `defaultChecked?:boolean=false`, `indeterminate:boolean=false`, `onCheckedChange({checked:boolean})`, name/value="on", disabled=false, required=false, invalid/errorId/helpId, appearance=default|chip, size=medium. Defined checked chooses controlled checked mode; absent checked chooses uncontrolled mode with a read-once defaultChecked. Both or mode switching is invalid. **Indeterminate is always host-authoritative**, including its default false; it has no separate uncontrolled mode or defaultIndeterminate. The group owner derives it from current eligible child choices; it is not reset to an invented mixed-state baseline. Apply both actual `input.checked` and `input.indeterminate`; never serialize the word "mixed".

The [pilot notification/reset conventions](./README.md) apply: one checked-change request for a changed user toggle, none for mount, props, reconciliation or reset. After native activation clears the browser's indeterminate bit, reapply authoritative indeterminate and the controlled checked prop (or newly committed uncontrolled checked). A rejected controlled action must restore **both** bits, so a declined selection from a mixed parent remains genuinely mixed.

## Keyboard, focus and state transitions

Click label/control and Space toggle once, with normal Tab order. A select-all parent is controlled by the group owner: checked iff all eligible enabled children are checked, indeterminate iff some but not all are checked. From mixed, activation requests selecting all eligible children; from all-checked, activation requests clearing all. Disabled children do not silently change. Recompute the parent from the actual committed children after accepted or rejected changes, not from a guessed result of its native click. Contrast/noncolor check and visible focus remain required.

## Responsive/mobile requirements

Vertical default; horizontal labels need clear spacing and narrow wrap. No tiny hidden native control whose focus geometry differs from visible checkbox.

## Forms, reset and composition

Only the actual checked bit on an enabled named checkbox determines FormData success; indeterminate alone does not. Noncanceled reset restores uncontrolled checked to initial defaultChecked, retains controlled checked, and reapplies the current host-authoritative indeterminate; there is no unconditional “clear mixed” rule. In a select-all composition, first restore each child's applicable reset state, then recompute the parent's checked/indeterminate pair from those committed eligible children. An initially partially selected group therefore resets back to a mixed parent. The derived host recomputation/reconciliation emits zero user-change callbacks. A canceled reset is a no-op for children, parent and both native bits. Native required validation stays tied to the real input checked state. No IME editing.

## Asset, integration and composition completion

Group owner defines select-all scope/disabled-child policy; the accepted independent select-all scope includes eligible enabled children only; disabled children retain their own state. No immediate setting side effect implied; submission/Apply belongs host.

## Stable parts and states

root, control, indicator, label, legend, help, error; checked,unchecked,mixed,disabled,invalid.

All rendered owned parts use `data-krds-component="checkbox"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Label and Space toggle once.
2. Mixed parent is visually and programmatically mixed.
3. FormData omits unchecked/disabled values.
4. Reset restores checked baselines and host-authoritative or recomputed mixed state rather than unconditionally clearing it.
5. Select-all does not silently mutate disabled children.
6. Custom styling retains focus/accessibility.
7. Rejected controlled activation reapplies both checked and indeterminate without leaking the browser-cleared mixed bit.
8. Reset of an initially partially selected group restores eligible child baselines then recomputes a genuinely mixed parent with zero change callbacks.
9. Canceled reset leaves children and the exact checked/indeterminate pair unchanged.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`checkbox--binary`, `checkbox--mixed-parent`, `checkbox--chip`, `checkbox--sizes`, `checkbox--disabled`, `checkbox--form-reset`, `checkbox--required`, `checkbox--initial-partial-reset`, `checkbox--controlled-mixed-rejected`, `checkbox--canceled-reset`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_06_02.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_06_02.html:889): 1. 그룹 레이블(선택) 옵션 목록의 카테고리에 대한 설명 또는 옵션 선택에 대한 도움말을 제공함
- L[890–890](../../upstream/krds/raw/components/component_06_02.html:890): 2. 체크박스 양식 체크박스의 현재 선택 상태를 보여줌
- L[891–891](../../upstream/krds/raw/components/component_06_02.html:891): 3. 체크박스 레이블 선택하거나 선택 해제할 정보를 나타냄

### 유형

- L[899–899](../../upstream/krds/raw/components/component_06_02.html:899): 유형
- L[901–901](../../upstream/krds/raw/components/component_06_02.html:901): 한 그룹 내 모든 옵션을 독립적으로 선택할 수 있도록 할 때
- L[902–902](../../upstream/krds/raw/components/component_06_02.html:902): 가장 기본적인 체크박스 유형으로 체크박스 양식은 선택됨, 선택 안 됨 두 가지 상태로 표현된다.
- L[905–905](../../upstream/krds/raw/components/component_06_02.html:905): 전체 옵션을 선택할 수 있을 때
- L[906–907](../../upstream/krds/raw/components/component_06_02.html:906): 체크박스의 양식은 선택됨, 선택 안 됨, 중간의 세 가지 상태로 표현된다. 옵션이 의미적으로 상하 관계로 구성되어 있어 상위 옵션의 선택, 선택 해제를 통해 모든 하위 옵션을 선택, 선택 해제할 수 있다. 이때 하위 옵션의 일부만을 선택할 수 있으므로 이 경우에는 상위 옵션이 중간 상태로 설정된다. 사용자가 한 그룹 내의 모든 옵션을 개별적으로 선택하도록 할 수 있으나, 전체 선택 옵션을 제공할 경우 사용자는 모든 옵션을 선택할 수 있음을 분명하게 인지할 수 있고 효율적으로 값을 선택할 수 있다.

### 용례

- L[914–914](../../upstream/krds/raw/components/component_06_02.html:914): 용례
- L[916–916](../../upstream/krds/raw/components/component_06_02.html:916): 사용하기 적합한 경우
- L[921–921](../../upstream/krds/raw/components/component_06_02.html:921): 필터링
- L[922–922](../../upstream/krds/raw/components/component_06_02.html:922): 약관, 조건 선택 등
- L[918–924](../../upstream/krds/raw/components/component_06_02.html:918): 사용자가 옵션 목록에서 여러 개의 값을 선택할 수 있는 경우 필터링 약관, 조건 선택 등
- L[928–928](../../upstream/krds/raw/components/component_06_02.html:928): 사용하기 적합하지 않은 경우
- L[933–933](../../upstream/krds/raw/components/component_06_02.html:933): 라디오 버튼을 사용해야 한다.
- L[930–935](../../upstream/krds/raw/components/component_06_02.html:930): 사용자가 한 개의 옵션을 선택할 수 있도록 하는 경우 라디오 버튼을 사용해야 한다.
- L[939–939](../../upstream/krds/raw/components/component_06_02.html:939): 토글 스위치를 사용을 고려한다. 체크박스는 적용, 제출과 같은 별도의 확정 행위가 필요한 하나의 큰 과업 플로(Flow) 내에서 부분적으로 옵션을 선택하는 경우에 사용하기 적합하다.
- L[936–941](../../upstream/krds/raw/components/component_06_02.html:936): 옵션을 선택하자마자 적용되는 경우 토글 스위치를 사용을 고려한다. 체크박스는 적용, 제출과 같은 별도의 확정 행위가 필요한 하나의 큰 과업 플로(Flow) 내에서 부분적으로 옵션을 선택하는 경우에 사용하기 적합하다.

### 사용성 가이드라인

- L[949–949](../../upstream/krds/raw/components/component_06_02.html:949): 사용성 가이드라인
- L[952–952](../../upstream/krds/raw/components/component_06_02.html:952): 기본적으로 체크박스의 옵션은 가나다순으로 정렬한다.
- L[953–954](../../upstream/krds/raw/components/component_06_02.html:953): 사용자가 가장 많이 선택하는 옵션을 먼저 배치할 경우 옵션을 빠르게 선택하는 데 도움이 될 수 있다. 그러나 특정한 기준에 따른 옵션 정렬이 편견이나 차별을 강화할 수 있으므로 유의해서 사용해야 한다. 정렬 기준에 대한 명확한 근거나 이유가 없는 경우에는 가나다순으로 정렬하는 것이 가장 안전하다.
- L[957–957](../../upstream/krds/raw/components/component_06_02.html:957): 체크박스는 수직으로, 체크박스 레이블은 양식의 오른쪽에 배치한다.
- L[958–958](../../upstream/krds/raw/components/component_06_02.html:958): 가독성과 옵션 간 명확한 구분을 위하여 체크박스는 수직으로 배치하는 것이 좋다. 이때, 레이블은 양식의 오른쪽에 배치해 일관된 위치에서 텍스트를 읽을 수 있도록 해야 한다. 만약 체크박스를 수평으로 배치해야 한다면 레이블의 텍스트 길이가 지나치게 길지 않아야 한다.
- L[969–969](../../upstream/krds/raw/components/component_06_02.html:969): 체크박스의 레이블은 분명하고 정확하게 제공한다
- L[970–970](../../upstream/krds/raw/components/component_06_02.html:970): 사용자가 어떤 옵션을 선택하는 것인지 이해할 수 있도록 체크박스의 레이블은 분명하고 정확하게 제공해야 한다.
- L[973–973](../../upstream/krds/raw/components/component_06_02.html:973): 전체 선택 옵션이 제공되는 경우 중간 상태를 명확하게 표현한다.
- L[974–974](../../upstream/krds/raw/components/component_06_02.html:974): 하위 옵션의 일부만 선택되었음에도 불구하고 상위 옵션이 선택 상태로 유지되면 사용자에게 혼동을 줄 수 있다.

### 접근성 가이드라인

- L[1089–1089](../../upstream/krds/raw/components/component_06_02.html:1089): 접근성 가이드라인
- L[1092–1092](../../upstream/krds/raw/components/component_06_02.html:1092): 체크박스, 아이콘과 인접 배경 간 명도 대비를 3:1 이상으로 표현한다.
- L[1093–1093](../../upstream/krds/raw/components/component_06_02.html:1093): 체크박스의 배경과 체크 아이콘은 체크박스의 선택 상태와 해당 요소가 체크박스 컴포넌트임을 인지할 수 있게 도와주는 중요한 시각적 정보이므로 인접 배경과의 명도 대비를 최소 3:1 이상으로 제공해야 한다.
- L[1100–1100](../../upstream/krds/raw/components/component_06_02.html:1100): 체크박스의 선택 상태를 색상으로만 구분하지 않는다.
- L[1101–1101](../../upstream/krds/raw/components/component_06_02.html:1101): 체크박스의 선택 상태를 색상 이외의 수단으로 구분할 수 있는 시각적 단서를 제공해야 한다.
- L[1116–1116](../../upstream/krds/raw/components/component_06_02.html:1116): 체크박스를 키보드로 탐색하고 실행할 수 있도록 한다.
- L[1117–1118](../../upstream/krds/raw/components/component_06_02.html:1117): 사용자 에이전트에서 제공되는 기본 체크박스가 아니라 커스텀 디자인을 사용하는 경우에 기본 체크박스에 display:none, visibility:hidden, opacity:0과 같은 스타일을 하면 스크린 리더에서 체크박스의 역할을 인지할 수 없으며 키보드로 옵션을 선택할 수 없게 된다.
- L[1126–1126](../../upstream/krds/raw/components/component_06_02.html:1126): 체크박스에 키보드 초점이 명확하게 표시되도록 한다.
- L[1127–1128](../../upstream/krds/raw/components/component_06_02.html:1127): 사용자 에이전트에서 제공되는 기본 체크박스가 아니라 커스텀 디자인을 사용하는 경우 키보드 초점이 시각적으로 표시되도록 스타일을 제공해야 한다. 체크박스 요소를 시각적으로 숨기는 경우, 시각적으로 표시되고 있는 체크박스 양식과 숨겨진 요소의 크기와 위치를 일치시켜 포커스링이 적절하게 표시되도록 구현해야 한다.
- L[1136–1136](../../upstream/krds/raw/components/component_06_02.html:1136): 체크박스에 접근 가능한 이름을 제공한다.
- L[1137–1138](../../upstream/krds/raw/components/component_06_02.html:1137): 스크린 리더 사용자가 체크박스의 용도를 확인할 수 있도록 &lt;label&gt;, title, aria-label, aria-labelledby 중 1가지 방식을 이용하여 레이블을 제공해야 한다. 이때, 가능하면 &lt;label&gt;을 이용하여 사용자가 레이블을 클릭하였을 때에도 값을 선택할 수 있도록 구현하는 것이 좋다.
- L[1146–1146](../../upstream/krds/raw/components/component_06_02.html:1146): 스크린 리더에서 그룹 레이블과 체크박스 그룹의 관계를 확인할 수 있도록 한다.
- L[1147–1147](../../upstream/krds/raw/components/component_06_02.html:1147): &lt;fieldset&gt;, &lt;legend&gt;를 사용하여 스크린 리더 사용자에게 체크박스 그룹에서 값을 선택하는 목적을 보다 명확하게 전달할 수 있다.

### 상호작용 가이드라인

- L[1159–1159](../../upstream/krds/raw/components/component_06_02.html:1159): 상호작용 가이드라인
- L[1161–1161](../../upstream/krds/raw/components/component_06_02.html:1161): 옵션 탐색
- L[1179–1182](../../upstream/krds/raw/components/component_06_02.html:1179): Tab, Shift + Tab 모든 체크박스는 Tab, Shift + Tab 키를 눌렀을 때 접근할 수 있어야 한다.
- L[1189–1189](../../upstream/krds/raw/components/component_06_02.html:1189): 옵션 선택 및 선택 해제
- L[1207–1210](../../upstream/krds/raw/components/component_06_02.html:1207): Click 사용자는 체크박스 양식 또는 체크박스 레이블을 눌러 옵션을 선택하거나 선택 해제할 수 있다. 일반적으로 체크박스 양식은 조작하기에 크기가 충분하지 않으므로 레이블로 상호작용이 확장될 수 있도록 구현해야 한다.
- L[1211–1214](../../upstream/krds/raw/components/component_06_02.html:1211): Space 체크박스 양식에 초점이 있는 상태에서 Space 키를 누르면 값이 선택된다.

### 예시

- L[1233–1233](../../upstream/krds/raw/components/component_06_02.html:1233): 예시
- L[1237–1237](../../upstream/krds/raw/components/component_06_02.html:1237): 기본
- L[1302–1302](../../upstream/krds/raw/components/component_06_02.html:1302): 기본 코드 확인하기
- L[1318–1318](../../upstream/krds/raw/components/component_06_02.html:1318): 사이즈
- L[1344–1344](../../upstream/krds/raw/components/component_06_02.html:1344): 사이즈 코드 확인하기
- L[1360–1360](../../upstream/krds/raw/components/component_06_02.html:1360): chip
- L[1390–1390](../../upstream/krds/raw/components/component_06_02.html:1390): chip 코드 확인하기

### 마크업 가이드

- L[1411–1411](../../upstream/krds/raw/components/component_06_02.html:1411): 마크업 가이드
- L[1414–1414](../../upstream/krds/raw/components/component_06_02.html:1414): CSS 선택자
- L[1435–1440](../../upstream/krds/raw/components/component_06_02.html:1435): 전체영역 .krds-check-area 체크박스 세로 정렬 .chk-column
- L[1441–1447](../../upstream/krds/raw/components/component_06_02.html:1441): radio 감싸는 영역 .krds-form-check 사이즈 중간 .medium
- L[1448–1451](../../upstream/krds/raw/components/component_06_02.html:1448): 크게 .large
- L[1461–1461](../../upstream/krds/raw/components/component_06_02.html:1461): 개발 시 접근성 관련 주의 사항
- L[1463–1463](../../upstream/krds/raw/components/component_06_02.html:1463): 폼 컨트롤에 label을 매칭할 수 없는경우 title, aria-label, aria-labelledby 중 한가지 속성을 넣어 레이블은 제공한다.

Inline preserved example markup (reference, not the public native API): L[1242–1296](../../upstream/krds/raw/components/component_06_02.html:1242), L[1323–1338](../../upstream/krds/raw/components/component_06_02.html:1323), L[1365–1384](../../upstream/krds/raw/components/component_06_02.html:1365)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Recorded independent decision: Select-all includes eligible enabled children only. A mixed parent activation requests all eligible children selected; subsequent state remains host-authoritative. Restored partial child baseline recomputes mixed, never unconditionally clears it.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1307 `../../code/checkbox.html`, L1349 `../../code/checkbox_size.html`, L1395 `../../code/checkbox_chip.html`, L1475 `./variable/radio_button.html`. Do not infer unseen contents.
- 7 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Accepted independent resolution

Select-all includes eligible enabled children only. A mixed parent activation requests all eligible children selected; subsequent state remains host-authoritative. Restored partial child baseline recomputes mixed, never unconditionally clears it.

## Shared implementation handoff

The exact semantic interface is `CheckboxContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
