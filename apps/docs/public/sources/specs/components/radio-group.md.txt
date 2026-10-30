# RadioGroup

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `radio-group`; Korean name 라디오 버튼; export `RadioGroup`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_06_01](https://www.krds.go.kr/html/site/component/component_06_01.html); preserved [HTML](../../upstream/krds/raw/components/component_06_01.html). Retrieved `2026-10-29T23:28:04.390Z`; `89854` bytes; SHA-256 `28578bf2746fa0f35bb0d4faac7f9c6d2515a9dc3dacc07cb3ffeacdca6c5e44`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `default`, `chip`, `medium`, `large`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Named fieldset/legend group of native same-name input[type=radio] with associated right-side labels. Vertical default; horizontal requires sufficient spacing. No preselection when deliberate accurate choice matters. Optional “none/unknown” is an explicit host option.

## Plain semantic API

Independent API: `options: readonly RadioGroupOption[]` (`RadioGroupOption` extends existing `SelectOption` with optional `id?:string`), `name`, `value?: string | null`, `defaultValue?: string | null` (uncontrolled baseline `null`), `onValueChange({value:string | null})`, required=false, disabled=false, invalid/errorId/helpId, size=medium, appearance=default|chip. Defined `value`, including `null`, chooses controlled mode; only `undefined` means uncontrolled. `null` means no checked radio. Every string, including `""`, is an ordinary valid option value and must match exactly one unique option; neither empty string nor a missing option is an empty sentinel. Unknown non-null values and duplicate option values are configuration errors. Never insert a “none/unknown” option automatically; that is explicit host content.

Apply the [pilot controlled/reset conventions](./README.md): controlled/default together or mode switching is invalid; read default once; one plain user request per changed choice, including when rejected; no mount/hydration/prop/reset change callbacks. Clicking an already selected option is a no-op. A prop transition to `null` clears every checked bit without an event. Controlled rejection reconciles every actual native radio's checked bit to the committed prop, including restoring all unchecked for `null`; the unaccepted browser toggle must not leak into rendering, validity or FormData.

**Explicit option identity (additive composition API):** An option may provide a nonempty unique id for its actual native radio input. Honor that exact ID and associate its real label with the same control; do not create a duplicate proxy input or use the ID as a selection value. If omitted, existing stable generated-ID behavior is unchanged. Duplicate/empty explicit IDs are configuration errors. This radio-specific subtype does not add IDs or change semantics on NativeSelect’s unrelated SelectOption contract. Selection, grouping, null/empty-string values, reset and callbacks remain unchanged.

## Keyboard, focus and state transitions

Preserve the explicit official requirement that **every enabled radio is sequentially reachable with Tab and Shift+Tab**, alongside real same-name native radio grouping and the separately required arrow movement/selection ([official L1211–1218](../../upstream/krds/raw/components/component_06_01.html:1211)). Disabled radios are skipped. Tab traversal only changes focus; Space, associated-label/control click and the appropriate arrow key choose one option, emitting one changed-value request without duplicate synthetic activation. Keep the focus ring on the visible radio area.

The frozen same-name native examples have the usual browser single-group Tab behavior, which conflicts with the explicit all-radio sequential-access row. That tension does not authorize negating the row or declaring native-default grouping conformant. The proposed contract preserves all-enabled sequential access; The accepted independent implementation policy is to intercept Tab/Shift+Tab while focus is inside the group, focus the next/previous enabled actual same-name native radio without changing checked state, and allow browser exit at group boundaries. Keep all actual radios with ordinary native group attributes; do not rename, clone or replace them. This preserves the explicit sequential-access row while retaining native arrow/form behavior. Each renderer must verify reverse entry/exit and rejected controlled selection; native-default Tab alone is insufficient. Each renderer/browser must demonstrate forward and reverse sequential access through all enabled radios while preserving real radio form/group semantics, arrow selection and no extra Tab-induced selection. Backend/native defaults alone are not evidence of this outcome.

## Responsive/mobile requirements

Prefer vertical label-right arrangement; many (>7 familiar) options may be better Select. Native-app/mobile recommendation is contextual, not exclusion.

## Forms, reset and composition

For `null`, all actual radios are unchecked, a required group is invalid, and no name/value is contributed to FormData. A checked enabled option contributes its exact string (including an empty-string value); disabled controls/fieldset are omitted. Noncanceled reset restores uncontrolled initial `defaultValue`/`null`, while controlled state retains current prop; reconcile all native checked bits and required validity without a change callback. Canceled reset changes neither selection nor native reconciliation baseline. Prop-driven clearing is not a reset or user action. Labels and error/help associations remain native and testable. No editable IME path.

## Asset, integration and composition completion

Host owns ordering (alphabetical default absent justified priority), option data and required validation text. Completion includes real native radio form participation, not button role substitutes.

## Stable parts and states

root, legend, item, control, indicator, label, help, error; checked,unchecked,disabled,invalid.

All rendered owned parts use `data-krds-component="radio-group"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Exactly one selection and one change per user choice.
2. Labels activate matching radio.
3. Arrow navigation selects without visiting disabled choices.
4. FormData/reset/required validity match native controls.
5. Unselected deliberate-choice example has no accidental default.
6. Chip keeps native radio semantics.
7. Forward Tab and reverse Shift+Tab reach every enabled radio without changing selection merely from focus, preserving real same-name grouping.
8. Controlled null renders all unchecked with required invalidity and no FormData entry, while empty-string option selection submits an empty string.
9. Prop clearing, rejected choice and canceled or accepted reset reconcile all checked bits with zero prop/reset notifications.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`radio-group--default`, `radio-group--chip`, `radio-group--medium-large`, `radio-group--unselected-required`, `radio-group--disabled-option`, `radio-group--form-reset`, `radio-group--controlled`, `radio-group--all-radio-sequential-access`, `radio-group--controlled-null`, `radio-group--controlled-clear-rejected`, `radio-group--empty-string-option`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_06_01.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_06_01.html:889): 1. 그룹 레이블(선택) 옵션 목록의 카테고리에 대한 설명 또는 옵션 선택에 대한 도움말을 제공함
- L[890–890](../../upstream/krds/raw/components/component_06_01.html:890): 2. 버튼 양식 버튼의 현재 선택 상태를 보여줌
- L[891–891](../../upstream/krds/raw/components/component_06_01.html:891): 3. 버튼 레이블 선택하거나 선택 해제할 정보를 나타냄

### 용례

- L[899–899](../../upstream/krds/raw/components/component_06_01.html:899): 용례
- L[901–901](../../upstream/krds/raw/components/component_06_01.html:901): 사용하기 적합한 경우
- L[906–906](../../upstream/krds/raw/components/component_06_01.html:906): 사용자가 여러 개의 옵션을 선택할 수 있도록 하는 경우에는 체크박스를 사용해야 한다.
- L[903–908](../../upstream/krds/raw/components/component_06_01.html:903): 사용자가 옵션 목록에서 한 개의 값만 선택할 수 있는 경우 사용자가 여러 개의 옵션을 선택할 수 있도록 하는 경우에는 체크박스를 사용해야 한다.
- L[912–912](../../upstream/krds/raw/components/component_06_01.html:912): 셀렉트나 콤보 상자보다 라디오 버튼이 적합하다.
- L[913–913](../../upstream/krds/raw/components/component_06_01.html:913): 예) 설문조사 응답 문항
- L[909–915](../../upstream/krds/raw/components/component_06_01.html:909): 사용자가 옵션을 선택하기 위해 여러 옵션을 비교해야 하거나 선택 과정의 효율성이 중요한 경우 셀렉트나 콤보 상자보다 라디오 버튼이 적합하다. 예) 설문조사 응답 문항
- L[919–919](../../upstream/krds/raw/components/component_06_01.html:919): 사용하기 적합하지 않은 경우
- L[924–924](../../upstream/krds/raw/components/component_06_01.html:924): 체크박스를 사용해야 한다.
- L[921–926](../../upstream/krds/raw/components/component_06_01.html:921): 사용자가 여러 개의 옵션을 선택할 수 있도록 하는 경우 체크박스를 사용해야 한다.
- L[930–930](../../upstream/krds/raw/components/component_06_01.html:930): 옵션의 개수가 7개를 초과하며 사용자가 옵션 목록에 친숙한 경우에 라디오 버튼이 아니라 셀렉트나 콤보 상자를 사용하면 사용자의 인지적 부담을 줄이고 활용할 수 있는 공간을 확보하는 데 도움이 된다.
- L[927–932](../../upstream/krds/raw/components/component_06_01.html:927): 옵션의 개수가 많은 경우 옵션의 개수가 7개를 초과하며 사용자가 옵션 목록에 친숙한 경우에 라디오 버튼이 아니라 셀렉트나 콤보 상자를 사용하면 사용자의 인지적 부담을 줄이고 활용할 수 있는 공간을 확보하는 데 도움이 된다.
- L[936–936](../../upstream/krds/raw/components/component_06_01.html:936): 옵션을 확인하기 위해 전체 화면을 스크롤 하는 것보다 별도의 옵션 목록을 탐색하는 것이 더 효율적이므로 셀렉트나 콤보 상자의 사용을 우선적으로 고려해야 한다.
- L[933–938](../../upstream/krds/raw/components/component_06_01.html:933): 모바일 플랫폼 옵션을 확인하기 위해 전체 화면을 스크롤 하는 것보다 별도의 옵션 목록을 탐색하는 것이 더 효율적이므로 셀렉트나 콤보 상자의 사용을 우선적으로 고려해야 한다.

### 사용성 가이드라인

- L[946–946](../../upstream/krds/raw/components/component_06_01.html:946): 사용성 가이드라인
- L[949–949](../../upstream/krds/raw/components/component_06_01.html:949): 기본적으로 라디오 버튼의 옵션은 가나다순으로 정렬한다.
- L[950–951](../../upstream/krds/raw/components/component_06_01.html:950): 사용자가 가장 많이 선택하는 옵션을 먼저 배치할 경우 옵션을 빠르게 선택하는 데 도움이 될 수 있다. 그러나 특정한 기준에 따른 옵션 정렬이 편견이나 차별을 강화할 수 있으므로 유의해서 사용해야 한다. 정렬 기준에 대한 명확한 근거나 이유가 없는 경우에는 가나다순으로 정렬하는 것이 가장 안전하다.
- L[954–954](../../upstream/krds/raw/components/component_06_01.html:954): 라디오 버튼은 수직으로, 라디오 버튼의 레이블은 양식의 오른쪽에 배치한다.
- L[955–955](../../upstream/krds/raw/components/component_06_01.html:955): 가독성과 옵션 간 명확한 구분을 위하여 라디오 버튼은 수직으로 배치하는 것이 좋다. 이때, 레이블은 양식의 오른쪽에 배치해 일관된 위치에서 텍스트를 읽을 수 있도록 해야 한다. 만약 라디오 버튼을 수평으로 배치해야 한다면 레이블의 텍스트 길이가 지나치게 길지 않아야 한다.
- L[966–966](../../upstream/krds/raw/components/component_06_01.html:966): 라디오 버튼을 수평으로 배치하는 경우 버튼 간 간격을 충분히 제공한다.
- L[967–967](../../upstream/krds/raw/components/component_06_01.html:967): 각 라디오 버튼의 간격을 양식과 레이블 간 간격과 동일하게 제공하는 경우 사용자에게 혼동을 줄 수 있으므로 유의해야 한다.
- L[978–978](../../upstream/krds/raw/components/component_06_01.html:978): 라디오 버튼의 레이블은 분명하고 정확하게 제공한다.
- L[979–979](../../upstream/krds/raw/components/component_06_01.html:979): 사용자가 어떤 옵션을 선택하는 것인지 이해할 수 있도록 라디오 버튼의 레이블은 분명하고 정확하게 제공해야 한다.
- L[990–990](../../upstream/krds/raw/components/component_06_01.html:990): 사용자가 정확한 값을 입력하는 것이 중요한 경우 라디오 버튼의 특정 옵션을 기본 선택값으로 제공하지 않아야 한다.
- L[991–991](../../upstream/krds/raw/components/component_06_01.html:991): 사용자가 어떤 질문이나 선택을 해야 하는지를 놓치거나 잘못된 옵션 값을 제출하는 실수를 할 수 있으므로 유의해야 한다.
- L[1004–1004](../../upstream/krds/raw/components/component_06_01.html:1004): ‘해당 없음’, ‘잘 모름’ 옵션 제공을 고려한다.
- L[1005–1006](../../upstream/krds/raw/components/component_06_01.html:1005): 일단 라디오 버튼 옵션 목록에서 하나의 옵션을 선택하고 나면 화면을 새로 고침하기 전까지 선택을 되돌릴 수 없다. 필수 입력 항목이 아닌 경우와 같이 아무 값도 선택하지 않아도 되는 상황을 고려하여 ‘해당 없음’, 잘 모름’, ‘선택 안 함’과 같은 옵션을 제공하는 것이 좋다.

### 접근성 가이드라인

- L[1121–1121](../../upstream/krds/raw/components/component_06_01.html:1121): 접근성 가이드라인
- L[1124–1124](../../upstream/krds/raw/components/component_06_01.html:1124): 버튼 양식과 인접 배경 간 명도 대비를 3:1 이상으로 표현한다.
- L[1125–1125](../../upstream/krds/raw/components/component_06_01.html:1125): 원형의 라디오 버튼 양식은 라디오 버튼의 선택 상태와 해당 요소가 라디오 버튼 컴포넌트임을 인지할 수 있게 도와주는 중요한 시각적 정보이므로 인접 배경과의 명도 대비를 최소 3:1 이상으로 제공해야 한다.
- L[1132–1132](../../upstream/krds/raw/components/component_06_01.html:1132): 버튼 양식의 선택 상태를 색상으로만 구분하지 않는다.
- L[1133–1133](../../upstream/krds/raw/components/component_06_01.html:1133): 버튼 양식의 선택 상태를 색상 이외의 수단으로 구분할 수 있는 시각적 단서를 제공해야 한다.
- L[1148–1148](../../upstream/krds/raw/components/component_06_01.html:1148): 라디오 버튼을 키보드로 탐색하고 실행할 수 있도록 한다.
- L[1149–1150](../../upstream/krds/raw/components/component_06_01.html:1149): 사용자 에이전트에서 제공되는 기본 버튼 양식이 아니라 커스텀 양식 디자인을 사용하는 경우에 기본 버튼 양식에 display:none, visibility:hidden, opacity:0과 같은 스타일을 하면 스크린 리더에서 라디오 버튼의 역할을 인지할 수 없으며 키보드로 옵션을 선택할 수 없게 된다.
- L[1158–1158](../../upstream/krds/raw/components/component_06_01.html:1158): 라디오 버튼에 키보드 초점이 명확하게 표시되도록 한다.
- L[1159–1160](../../upstream/krds/raw/components/component_06_01.html:1159): 사용자 에이전트에서 제공되는 기본 버튼 양식이 아니라 커스텀 양식 디자인을 사용하는 경우 키보드 초점이 시각적으로 표시되도록 스타일을 제공해야 한다. 라디오 버튼 요소를 시각적으로 숨기는 경우, 시각적으로 표시되고 있는 버튼 양식과 숨겨진 요소의 크기와 위치를 일치시켜 포커스링이 적절하게 표시되도록 구현해야 한다.
- L[1168–1168](../../upstream/krds/raw/components/component_06_01.html:1168): 라디오 버튼에 접근 가능한 이름을 제공한다.
- L[1169–1170](../../upstream/krds/raw/components/component_06_01.html:1169): 스크린 리더 사용자가 라디오 버튼의 용도를 확인할 수 있도록 &lt;label&gt;, title, aria-label, aria-labelledby 중 1가지 방식을 이용하여 레이블을 제공해야 한다. 이때, 가능하면 &lt;label&gt;을 이용하여 사용자가 레이블을 클릭하였을 때에도 값을 선택할 수 있도록 구현하는 것이 좋다.
- L[1178–1178](../../upstream/krds/raw/components/component_06_01.html:1178): 스크린 리더에서 그룹 레이블과 라디오 버튼 그룹의 관계를 확인할 수 있도록 한다.
- L[1179–1179](../../upstream/krds/raw/components/component_06_01.html:1179): &lt;fieldset&gt;, &lt;legend&gt;를 사용하여 스크린 리더 사용자에게 라디오 버튼 그룹에서 값을 선택하는 목적을 보다 명확하게 전달할 수 있다.

### 상호작용 가이드라인

- L[1191–1191](../../upstream/krds/raw/components/component_06_01.html:1191): 상호작용 가이드라인
- L[1193–1193](../../upstream/krds/raw/components/component_06_01.html:1193): 탐색
- L[1211–1214](../../upstream/krds/raw/components/component_06_01.html:1211): Tab, Shift + Tab 모든 라디오 버튼은 Tab, Shift + Tab 키를 눌렀을 때 접근할 수 있어야 한다.
- L[1215–1218](../../upstream/krds/raw/components/component_06_01.html:1215): 방향키 ↑/←, ↓/→ 방향키 ↑/←, ↓/→를 눌렀을 때 다음/이전 라디오 버튼 양식으로 초점이 이동하고 값이 선택되어야 한다.
- L[1225–1225](../../upstream/krds/raw/components/component_06_01.html:1225): 실행
- L[1243–1246](../../upstream/krds/raw/components/component_06_01.html:1243): Click 버튼 양식 또는 버튼 레이블을 Click 하였을 때 값이 선택되어야 한다.
- L[1247–1250](../../upstream/krds/raw/components/component_06_01.html:1247): Space 라디오 버튼 양식에 초점이 있는 상태에서 Space 키를 누르면 값이 선택되어야 한다.
- L[1251–1254](../../upstream/krds/raw/components/component_06_01.html:1251): 방향키 ↑/←, ↓/→ 방향키 ↑/←, ↓/→를 눌렀을 때 다음/이전 라디오 버튼 양식으로 초점이 이동하고 값이 선택되어야 한다.

### 예시

- L[1273–1273](../../upstream/krds/raw/components/component_06_01.html:1273): 예시
- L[1277–1277](../../upstream/krds/raw/components/component_06_01.html:1277): 기본
- L[1342–1342](../../upstream/krds/raw/components/component_06_01.html:1342): 기본 코드 확인하기
- L[1358–1358](../../upstream/krds/raw/components/component_06_01.html:1358): 사이즈
- L[1384–1384](../../upstream/krds/raw/components/component_06_01.html:1384): 사이즈 코드 확인하기
- L[1400–1400](../../upstream/krds/raw/components/component_06_01.html:1400): chip
- L[1430–1430](../../upstream/krds/raw/components/component_06_01.html:1430): chip 코드 확인하기

### 마크업 가이드

- L[1450–1450](../../upstream/krds/raw/components/component_06_01.html:1450): 마크업 가이드
- L[1453–1453](../../upstream/krds/raw/components/component_06_01.html:1453): CSS 선택자
- L[1474–1479](../../upstream/krds/raw/components/component_06_01.html:1474): 전체영역 .krds-check-area 체크박스 세로 정렬 .chk-column
- L[1480–1486](../../upstream/krds/raw/components/component_06_01.html:1480): radio 감싸는 영역 .krds-form-check 사이즈 중간 .medium
- L[1487–1490](../../upstream/krds/raw/components/component_06_01.html:1487): 크게 .large
- L[1500–1500](../../upstream/krds/raw/components/component_06_01.html:1500): 개발 시 접근성 관련 주의 사항
- L[1502–1502](../../upstream/krds/raw/components/component_06_01.html:1502): 폼 컨트롤에 label을 매칭할 수 없는경우 title, aria-label, aria-labelledby 중 한가지 속성을 넣어 레이블을 제공한다.

Inline preserved example markup (reference, not the public native API): L[1282–1336](../../upstream/krds/raw/components/component_06_01.html:1282), L[1363–1378](../../upstream/krds/raw/components/component_06_01.html:1363), L[1405–1424](../../upstream/krds/raw/components/component_06_01.html:1405)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Recorded independent decision: Internal Tab/Shift+Tab explicitly focuses the next/previous enabled actual same-name native radio without selecting it; browser exit is retained at boundaries. Browser reverse group entry must be demonstrated. Arrow choice, native name grouping and FormData stay native. No cloned controls or renamed groups.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1347 `../../code/radio_button.html`, L1389 `../../code/radio_size.html`, L1435 `../../code/radio_chip.html`, L1514 `./variable/radio_button.html`. Do not infer unseen contents.
- 13 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Accepted independent resolution

Internal Tab/Shift+Tab explicitly focuses the next/previous enabled actual same-name native radio without selecting it; browser exit is retained at boundaries. Browser reverse group entry must be demonstrated. Arrow choice, native name grouping and FormData stay native. No cloned controls or renamed groups.

## Shared implementation handoff

The exact semantic interface is `RadioGroupContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
