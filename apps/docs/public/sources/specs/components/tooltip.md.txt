# Tooltip

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `tooltip`; Korean name 툴팁; export `Tooltip`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_08_05](https://www.krds.go.kr/html/site/component/component_08_05.html); preserved [HTML](../../upstream/krds/raw/components/component_08_05.html). Retrieved `2026-10-29T23:28:05.172Z`; `89103` bytes; SHA-256 `cbbbf46d9fb23ba34d57fc1b4ae0e9ef072fba2956bee367673a11e28838118a`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `information-icon`, `icon-button`, `vertical`, `box`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Named trigger button immediately followed by short noninteractive popup; no links/buttons inside tooltip. Informational icon vs icon-button label tooltip are different use cases. Do not duplicate HTML title. Source explicitly says aria-labelledby connects trigger/container; exact direction is not stated.

## Plain semantic API

Independent API: `text`, `relationship:description|label=description`, `triggerLabel?`, `triggerId`, `textId`, placement, open/defaultOpen=false, onOpenChange, `fallbackFocusId?`, touchToggle=false unless distinct info trigger. Popup role=tooltip and content is noninteractive. The relationship discriminator is mandatory semantic behavior, not inferred from icon appearance or whichever attributes a renderer happens to choose.

In **description** mode require an independent functional/contextual triggerLabel (or equivalent validated native visible name); it remains the actual trigger name. Add textId exactly once to that trigger's aria-describedby; do not set its aria-labelledby from explanatory tooltip text. In **label** mode text must itself be the stable functional button name; trigger aria-labelledby points to textId, triggerLabel/alternate aria-label is not allowed, and the same text is not also aria-describedby. Retain the actual textId node in the same accessible tree/root while the visual popup is closed so the functional name exists before opening; visual hiding is not unmounting that referenced text. Avoid a second duplicate hidden label/live message. Consumers with other help descriptions retain distinct valid IDs without repeating textId.

Both modes require real resolved trigger/text relationships in their actual root, including Lit Shadow DOM; do not assume a light-DOM ID can name an internal control across a boundary. Use a same-root owned trigger/text relationship or a proven native equivalent, and fail invalid unresolved configuration. The literal official aria-labelledby wording ([L1163–1164](../../upstream/krds/raw/components/component_08_05.html:1163)) remains quoted below; description-mode aria-describedby is an explicit independent interpretation of supplementary content, not a claimed literal KRDS instruction. Controlled props/defaults/reset/no-duplicate rules remain the [pilot policy](./README.md).

## Keyboard, focus and state transitions

Hover/focus shows; pointer leave of both trigger+popup or blur hides. Ordinary hover opening never steals keyboard focus from elsewhere. Pointer may travel into the popup without closing. Touch distinct info-button click toggles and outside tap closes; primary icon action is not swallowed. Popup has no Tab stops.

For a processed Escape, request close once, ignoring composing/keyCode229 and inner-handled events. **Only on accepted actual closure**, mark Escape suppression before moving focus, then focus the usable trigger even when the tooltip was hover-open and focus previously lay elsewhere ([official L1251–1255](../../upstream/krds/raw/components/component_08_05.html:1251)). The induced trigger focus must not reopen it. Suppress automatic hover/focus reopening until Tab/Shift+Tab departs that trigger to another element and focus subsequently reenters; pointer movement or a prop change alone does not satisfy that reset. If controlled close is rejected, keep actual open state and do not transfer focus or claim successful dismissal.

If the trigger is removed/unusable by accepted close or teardown, clean listeners/pending requests and choose usable fallbackFocusId, then the saved trigger's nearest usable focusable ancestor, then the live document body using temporary tabindex=-1 and restoring its prior value. Usable means mounted, visible, enabled, focusable, same live document and not inert. Do not focus hidden/removed trigger nodes, run stale generation focus work, or emit an extra user event from restoration. External prop closure alone does not pretend to be an Escape action.

## Responsive/mobile requirements

Collision-aware popup completely onscreen and not covering target; touch users still have meaningful icon/label. Keep about 150 characters; longer interactive content goes to ContextualHelp.

## Forms, reset and composition

No form/reset state; Enter/Space activation belongs trigger action, not tooltip; ignore composing Escape.

## Asset, integration and composition completion

Host supplies meaningful functional text for label mode and a separate functional trigger name plus supplementary text for description mode. Completion requires deterministic computed name/description before, during and after visual opening; real same-root/Shadow DOM relationships; hover/focus/touch/Escape suppression; and the hover-origin Escape return/fallback/rejected-close cases. Rendering title text or merely storing an ID string does not establish those native relationships.

## Stable parts and states

root, trigger, popup, icon, text; open,closed,suppressed,placement.

All rendered owned parts use `data-krds-component="tooltip"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Focus/hover reveal same readable text.
2. Pointer can enter popup without premature dismissal.
3. Accepted Escape stays closed through induced trigger focus until keyboard leave and reentry, while rejected controlled close does not pretend to dismiss.
4. No focusable tooltip descendants.
5. Touch info trigger toggles without hijacking icon action.
6. Name and description not duplicated.
7. Description mode preserves the independent trigger action name and references supplemental text once, while label mode uses stable tooltip text as the name even when visually closed with no duplicate description.
8. Hover opens without moving focus from another control; accepted Escape then focuses the usable trigger and remains suppressed through the induced focus.
9. Rejected controlled Escape keeps open state and prior focus, while removed trigger or teardown uses the documented usable fallback with no stale reopening.
10. Actual naming and description ID relationships resolve in native same-root and Lit Shadow DOM output.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`tooltip--information-icon`, `tooltip--icon-button`, `tooltip--vertical`, `tooltip--box`, `tooltip--touch-toggle`, `tooltip--escape-suppression`, `tooltip--viewport-edge`, `tooltip--relationship-description`, `tooltip--relationship-label-closed`, `tooltip--hover-escape-return`, `tooltip--controlled-escape-rejected`, `tooltip--trigger-removed`, `tooltip--shadow-relationship`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_08_05.html:883): 구조
- L[892–892](../../upstream/krds/raw/components/component_08_05.html:892): 1. 활성화 버튼 툴팁 콘텐츠의 표시를 토글하는 버튼
- L[893–893](../../upstream/krds/raw/components/component_08_05.html:893): 2. 컨테이너 팝오버 영역과 배경을 구분하는 요소
- L[894–894](../../upstream/krds/raw/components/component_08_05.html:894): 3. 아이콘(선택) 강조가 필요한 경우, 본문의 내용에 따라 시스템 상태 아이콘을 사용할 수 있음
- L[895–895](../../upstream/krds/raw/components/component_08_05.html:895): 4. 본문 구체적인 설명 텍스트

### 유형

- L[903–903](../../upstream/krds/raw/components/component_08_05.html:903): 유형
- L[905–905](../../upstream/krds/raw/components/component_08_05.html:905): 정보/물음표 아이콘 툴팁
- L[906–906](../../upstream/krds/raw/components/component_08_05.html:906): 컴포넌트나 레이블 옆에 배치되어 해당 요소에 관한 부가적인 정보를 제공하는 툴팁이다. 아이콘의 선택 방법에 대해서는 맥락적 도움말 컴포넌트의 유형을 참고하면 된다.
- L[909–909](../../upstream/krds/raw/components/component_08_05.html:909): 아이콘 버튼 툴팁
- L[910–910](../../upstream/krds/raw/components/component_08_05.html:910): 텍스트 레이블이 없거나 공간 제약으로 인해 레이블이 축약된 아이콘 버튼에 제공되는 툴팁이다.

### 용례

- L[917–917](../../upstream/krds/raw/components/component_08_05.html:917): 용례
- L[919–919](../../upstream/krds/raw/components/component_08_05.html:919): 사용하기 적합한 경우
- L[924–924](../../upstream/krds/raw/components/component_08_05.html:924): 텍스트 레이블 없는 아이콘 단독 컨트롤 요소에 레이블을 표시하고자 하는 경우에 툴팁을 사용한다.
- L[921–926](../../upstream/krds/raw/components/component_08_05.html:921): 컨트롤 요소에 대한 레이블을 제공할 때 텍스트 레이블 없는 아이콘 단독 컨트롤 요소에 레이블을 표시하고자 하는 경우에 툴팁을 사용한다.
- L[930–930](../../upstream/krds/raw/components/component_08_05.html:930): 단어 의미에 대한 설명과 같이 간단한 추가 정보를 제공할 때 툴팁을 사용한다.
- L[927–932](../../upstream/krds/raw/components/component_08_05.html:927): 서비스 이용/콘텐츠 이해에 필수적이지는 않으나 간단한 추가 정보를 제공할 때 단어 의미에 대한 설명과 같이 간단한 추가 정보를 제공할 때 툴팁을 사용한다.
- L[936–936](../../upstream/krds/raw/components/component_08_05.html:936): 사용하기 적합하지 않은 경우
- L[941–941](../../upstream/krds/raw/components/component_08_05.html:941): 맥락적 도움말을 사용한다.
- L[938–943](../../upstream/krds/raw/components/component_08_05.html:938): 팝오버에 대화형 요소가 포함되어야 하는 경우 맥락적 도움말을 사용한다.
- L[947–947](../../upstream/krds/raw/components/component_08_05.html:947): 툴팁은 150자 내외의 짧은 설명을 제공할 때 사용하기 적합하다. 더 긴 설명이 필요하다면 콘텐츠의 특성과 이용 맥락에 따라 맥락적 도움말, 도움 패널, 별도 도움말 페이지를 활용한다.
- L[944–949](../../upstream/krds/raw/components/component_08_05.html:944): 긴 설명을 제공해야 하는 경우 툴팁은 150자 내외의 짧은 설명을 제공할 때 사용하기 적합하다. 더 긴 설명이 필요하다면 콘텐츠의 특성과 이용 맥락에 따라 맥락적 도움말, 도움 패널, 별도 도움말 페이지를 활용한다.

### 사용성 가이드라인

- L[957–957](../../upstream/krds/raw/components/component_08_05.html:957): 사용성 가이드라인
- L[960–960](../../upstream/krds/raw/components/component_08_05.html:960): 툴팁 컴포넌트 사용을 우선적으로 고려한다.
- L[961–962](../../upstream/krds/raw/components/component_08_05.html:961): HTML title 속성으로 제공되는 힌트 텍스트는 글자 크기, 표시 위치와 같은 스타일을 수정할 수 없어 툴팁을 필요로하는 사용자가 정보를 확인하기 어려울 수 있다. 또한 스크린 리더 환경설정에 따라 title 속성으로 제공된 힌트 텍스트가 음성으로 출력되지 않을 수 있으므로 가능한 툴팁 컴포넌트를 사용하는 것이 좋다.
- L[965–965](../../upstream/krds/raw/components/component_08_05.html:965): 팝오버 영역이 화면을 벗어나지 않도록 표현한다.
- L[966–966](../../upstream/krds/raw/components/component_08_05.html:966): 툴팁의 팝오버 영역이 시각적으로 확인할 수 없는 화면 밖의 영역에 배치되어 내부 콘텐츠가 가려지지 않도록 해야 한다.
- L[977–977](../../upstream/krds/raw/components/component_08_05.html:977): 팝오버 영역이 본문의 중요 콘텐츠를 가리지 않도록 표현한다.
- L[978–978](../../upstream/krds/raw/components/component_08_05.html:978): 툴팁의 팝오버 영역이 활성화 버튼과 부가 정보를 제공하고자 하는 본문 콘텐츠 요소를 가리지 않도록 적절한 표시 방향을 설정한다.
- L[989–989](../../upstream/krds/raw/components/component_08_05.html:989): 아이콘 버튼에 툴팁을 제공한다.
- L[990–990](../../upstream/krds/raw/components/component_08_05.html:990): 아이콘만으로 구성된 컨트롤 요소는 사용자에게 의미/용도를 정확하게 전달하기 어렵다. 그러므로 아이콘만으로 구성된 메뉴/기능 버튼에는 툴팁을 반드시 제공해야 한다.
- L[1001–1001](../../upstream/krds/raw/components/component_08_05.html:1001): 툴팁은 부가적인 정보를 전달하는 데 사용한다.
- L[1002–1002](../../upstream/krds/raw/components/component_08_05.html:1002): 사용자가 반드시 확인해야 하는 중요한 정보를 툴팁 팝오버에만 제공해서는 안 된다. 필수 정보는 사용자가 잘 발견할 수 있도록 별도의 상호작용 없이 본문에 표시하는 것이 적절하다.
- L[1013–1013](../../upstream/krds/raw/components/component_08_05.html:1013): 툴팁 컴포넌트와 title 속성을 중첩하여 사용하지 않는다.
- L[1014–1014](../../upstream/krds/raw/components/component_08_05.html:1014): 툴팁 컴포넌트와 title 속성이 동시에 사용되면 두 요소의 위치가 중첩되면서 설명이 정확하게 전달되기 어렵다. 스크린 리더 사용자에게도 동일한 설명이 여러 번 제공되므로 피로를 유발할 수 있다.
- L[1021–1021](../../upstream/krds/raw/components/component_08_05.html:1021): 한 화면에 아이콘 툴팁과 맥락적 도움말 또는 도움말 패널을 혼용하지 않는다.
- L[1022–1022](../../upstream/krds/raw/components/component_08_05.html:1022): 정보/물음표 아이콘 툴팁과 맥락적 도움말의 활성화 버튼은 동일하게 생겼으나 상호작용 방식이 다르므로 한 화면에 두 개의 요소를 혼용할 경우 사용자가 혼동을 느낄 수 있다. 만약 맥락적 도움말이나 도움말 패널 사용이 필요하다면 툴팁 대신 맥락적 도움말 컴포넌트를 사용한다.

### 플랫폼에 대한 고려 사항

- L[1030–1030](../../upstream/krds/raw/components/component_08_05.html:1030): 플랫폼에 대한 고려 사항
- L[1033–1033](../../upstream/krds/raw/components/component_08_05.html:1033): 터치 인터페이스에서의 사용성을 고려한다.
- L[1034–1035](../../upstream/krds/raw/components/component_08_05.html:1034): 툴팁은 마우스, 키보드, 펜 인터페이스로만 실행할 수 있기 때문에 터치가 1차적인 입력 방식인 경우에는 사용자에게 부가적인 정보를 제공하기 어렵다. 이러한 상황을 고려하여 아이콘 버튼을 표현할 때는 메뉴/기능의 의미를 명확하게 보여줄 수 있는 아이콘을 선택해야 한다. 별도의 활성화 버튼이 존재한다면 터치 인터페이스가 탐지되었을 때, 활성화 버튼의 Click 이벤트에 팝오버의 출현이 토글 될 수 있도록 한다.

### 접근성 가이드라인

- L[1142–1142](../../upstream/krds/raw/components/component_08_05.html:1142): 접근성 가이드라인
- L[1145–1145](../../upstream/krds/raw/components/component_08_05.html:1145): 활성화 버튼에 이름을 제공한다.
- L[1146–1146](../../upstream/krds/raw/components/component_08_05.html:1146): 스크린 리더 사용자가 활성화 버튼의 용도를 이해할 수 있도록 각각의 버튼에 이름을 제공해야 한다.
- L[1154–1154](../../upstream/krds/raw/components/component_08_05.html:1154): 활성화 버튼에 고유하고 적절한 이름을 제공한다.
- L[1155–1156](../../upstream/krds/raw/components/component_08_05.html:1155): 활성화 버튼이 맥락적으로 도움을 제공하고자 하는 본문 콘텐츠의 내용을 포함하고 있지 않다면 해당 정보를 활성화 버튼의 이름으로 포함하여 스크린 리더 사용자가 정확한 용도를 이해할 수 있도록 제공한다. 화면에 존재하는 다른 활성화 버튼과 혼동되지 않도록 모든 활성화 버튼의 이름은 고유해야 한다.
- L[1163–1163](../../upstream/krds/raw/components/component_08_05.html:1163): 활성화 버튼과 컨테이너 영역을 aria-labelledby 속성으로 연결한다.
- L[1164–1164](../../upstream/krds/raw/components/component_08_05.html:1164): 이를 통해 시각을 활용하여 정보를 탐색하는 사용자가 활성화 버튼에 접근했을 때 툴팁 콘텐츠를 바로 확인할 수 있는 것처럼 스크린 리더 사용자도 동일한 방식으로 정보를 전달받을 수 있다.
- L[1170–1170](../../upstream/krds/raw/components/component_08_05.html:1170): 활성화 버튼과 팝오버 콘텐츠를 적절한 순서로 제공한다.
- L[1171–1171](../../upstream/krds/raw/components/component_08_05.html:1171): 스크린 리더 사용자가 도움말 팝오버 콘텐츠에 논리적인 순서로 접근할 수 있도록 관련 있는 활성화 버튼 다음 요소로 제공해야 한다.

### 상호작용 가이드라인

- L[1183–1183](../../upstream/krds/raw/components/component_08_05.html:1183): 상호작용 가이드라인
- L[1185–1185](../../upstream/krds/raw/components/component_08_05.html:1185): 툴팁 활성화
- L[1203–1206](../../upstream/krds/raw/components/component_08_05.html:1203): Click 터치 인터페이스에서 활성화 버튼을 누르면 툴팁 팝오버가 표시된다.
- L[1207–1210](../../upstream/krds/raw/components/component_08_05.html:1207): Mouseover 활성화 버튼에 Mouseover 이벤트가 발생하면 툴팁 팝오버가 표시된다.
- L[1211–1214](../../upstream/krds/raw/components/component_08_05.html:1211): Focus 활성화 버튼이 초점을 가지면 툴팁 팝오버가 표시된다.
- L[1221–1221](../../upstream/krds/raw/components/component_08_05.html:1221): 툴팁 비활성화
- L[1239–1242](../../upstream/krds/raw/components/component_08_05.html:1239): Click 터치 인터페이스에서 활성화 버튼 또는 팝오버 영역 외의 화면을 누르면 팝오버가 사라진다.
- L[1243–1246](../../upstream/krds/raw/components/component_08_05.html:1243): Mouseleave 활성화 버튼 또는 팝오버 영역 밖으로 마우스가 이동하면 팝오버가 사라진다.
- L[1247–1250](../../upstream/krds/raw/components/component_08_05.html:1247): Blur 활성화 버튼에서 Tab, Shift + Tab을 눌러 초점이 버튼 외부로 빠져나가면 팝오버가 사라진다.
- L[1251–1255](../../upstream/krds/raw/components/component_08_05.html:1251): Esc 툴팁 팝오버가 표시된 상태에서 Esc 키를 누르면 팝오버가 닫히면서 키보드 초점이 활성화 버튼으로 이동한다. Tab, Shift + Tab을 눌러 다른 요소를 탐색한 후 활성화 버튼에 다시 초점이 다시 진입하기 전까지 팝오버는 사라진 상태로 유지된다.

### 예시

- L[1274–1274](../../upstream/krds/raw/components/component_08_05.html:1274): 예시
- L[1278–1278](../../upstream/krds/raw/components/component_08_05.html:1278): 기본
- L[1304–1304](../../upstream/krds/raw/components/component_08_05.html:1304): 기본 코드 확인하기
- L[1320–1320](../../upstream/krds/raw/components/component_08_05.html:1320): tooltip vertical
- L[1346–1346](../../upstream/krds/raw/components/component_08_05.html:1346): tooltip vertical 코드 확인하기
- L[1362–1362](../../upstream/krds/raw/components/component_08_05.html:1362): tooltip box
- L[1392–1392](../../upstream/krds/raw/components/component_08_05.html:1392): tooltip box 코드 확인하기

### 마크업 가이드

- L[1413–1413](../../upstream/krds/raw/components/component_08_05.html:1413): 마크업 가이드
- L[1416–1416](../../upstream/krds/raw/components/component_08_05.html:1416): CSS 선택자
- L[1436–1441](../../upstream/krds/raw/components/component_08_05.html:1436): 활성화 버튼 .krds-tooltip 인라인형 상하 방향 .tooltip-vertical
- L[1442–1445](../../upstream/krds/raw/components/component_08_05.html:1442): 박스형 .tooltip-box
- L[1446–1449](../../upstream/krds/raw/components/component_08_05.html:1446): 팝오버 .krds-tooltip-popover
- L[1459–1459](../../upstream/krds/raw/components/component_08_05.html:1459): JS
- L[1478–1482](../../upstream/krds/raw/components/component_08_05.html:1478): krds_tooltip init() 초기화 및 주요 이벤트 실행
- L[1483–1486](../../upstream/krds/raw/components/component_08_05.html:1483): setupTooltips() 툴팁 설정
- L[1487–1490](../../upstream/krds/raw/components/component_08_05.html:1487): setupGlobalEvents() 툴팁 전역 이벤트 설정
- L[1491–1494](../../upstream/krds/raw/components/component_08_05.html:1491): showTooltip() 툴팁 열기
- L[1495–1498](../../upstream/krds/raw/components/component_08_05.html:1495): closeAllTooltips() 툴팁 닫기

Inline preserved example markup (reference, not the public native API): L[1283–1298](../../upstream/krds/raw/components/component_08_05.html:1283), L[1325–1340](../../upstream/krds/raw/components/component_08_05.html:1325), L[1367–1386](../../upstream/krds/raw/components/component_08_05.html:1367)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- The source aria-labelledby direction remains literally ambiguous, but the independent relationship discriminator above now makes native naming/description behavior deterministic. Its description adaptation must not be represented as literal official wording; source citations and visual/linked-code gaps remain unchanged.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1309 `../../code/tooltip.html`, L1351 `../../code/tooltip_vertical.html`, L1397 `../../code/tooltip_box.html`, L1513 `../../../resources/js/examples/krds_tooltip.js`, L1532 `./variable/tooltip.html`. Do not infer unseen contents.
- 11 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `TooltipContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
