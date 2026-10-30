# TextInput

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `text-input`; Korean name 텍스트 입력 필드; export `TextInput`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_09_03](https://www.krds.go.kr/html/site/component/component_09_03.html); preserved [HTML](../../upstream/krds/raw/components/component_09_03.html). Retrieved `2026-10-29T23:28:05.462Z`; `89860` bytes; SHA-256 `5644f9fe165d0143d87c56356cf23de1658d4b13c4a20cc180b8d10bc223a53f`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `default`, `error`, `success`, `small`, `medium`, `large`, `icon-action`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Native single-line input with persistent label, optional help/error and placeholder, optional separately named icon button. Visible focus and error/success cues. Browser autocomplete for recurring personal information; do not block paste.

## Plain semantic API

Independent API: type=text|email|tel|url|password|search (text default), value/defaultValue="", onValueChange({value}), name, autocomplete,inputMode, required, disabled, readOnly, minLength/maxLength/pattern, status=default|error|success, helpId/errorId, size=medium, iconAction? {label,onAction}. No date parsing or numeric coercion by default.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Native editing/selection, label click focuses. Icon button type=button does not submit. Do not rewrite value during Korean IME or treat composing Enter as confirm. Native normal Enter form submission remains host/browser behavior after composition.

## Responsive/mobile requirements

Fluid field generally fills section; predictable short fields may size to expected input but remain uncut on small screen. Mobile keyboard uses provided type/inputMode, never force numeric keyboard for arbitrary identifiers.

## Forms, reset and composition

Native name/value FormData, disabled excluded/readonly included, reset defaultValue, controlled reset retains current prop without a callback. Errors aria-invalid/description and required validity. Password reveal if offered must preserve value/caret and change accessible toggle label.

## Asset, integration and composition completion

Host owns validation timing, personal-data autocomplete tokens, optional reveal/search action and remote checks. Local stories cannot call auth/API.

## Stable parts and states

root, label, control, help, error, icon-action; invalid,success,disabled,readonly,focused.

All rendered owned parts use `data-krds-component="text-input"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Visible label and description/error associations survive input.
2. FormData/reset/disabled/readonly correct.
3. Paste/IME/caret remain stable.
4. Icon action executes once without form submission.
5. Autocomplete reaches real input.
6. Success/error not color-only.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`text-input--default`, `text-input--error`, `text-input--success`, `text-input--sizes`, `text-input--icon-action`, `text-input--disabled-readonly`, `text-input--ime`, `text-input--form-reset`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_09_03.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_09_03.html:889): 1. 레이블 사용자가 어떤 텍스트를 입력해야 하는지를 안내하는 문구
- L[890–890](../../upstream/krds/raw/components/component_09_03.html:890): 2. 입력 필드 텍스트가 입력되는 영역으로 배경과 입력 필드를 구분하여 사용자가 텍스트 입력 필드임을 인지할 수 있게 함
- L[891–891](../../upstream/krds/raw/components/component_09_03.html:891): 3. 도움말(선택) 입력 방식에 대한 도움말 또는 오류 메시지를 제공함
- L[892–892](../../upstream/krds/raw/components/component_09_03.html:892): 4. 플레이스홀더(선택) 어떤 값을 입력해야 하는지에 대한 힌트 또는 예시를 제공함

### 용례

- L[900–900](../../upstream/krds/raw/components/component_09_03.html:900): 용례
- L[902–902](../../upstream/krds/raw/components/component_09_03.html:902): 사용하기 적합한 경우
- L[910–910](../../upstream/krds/raw/components/component_09_03.html:910): 이름
- L[911–911](../../upstream/krds/raw/components/component_09_03.html:911): 전화번호
- L[912–912](../../upstream/krds/raw/components/component_09_03.html:912): 생년월일
- L[913–913](../../upstream/krds/raw/components/component_09_03.html:913): 최소/최대 입력값이 정해진 숫자
- L[907–915](../../upstream/krds/raw/components/component_09_03.html:907): 사용자가 입력해야 하는 정보가 명확하고 텍스트의 길이가 고정된 경우에는 텍스트 입력 필드를 사용하는 것이 적합하다. 이름 전화번호 생년월일 최소/최대 입력값이 정해진 숫자
- L[904–917](../../upstream/krds/raw/components/component_09_03.html:904): 입력값이 한 줄의 텍스트로 예상되는 경우 사용자가 입력해야 하는 정보가 명확하고 텍스트의 길이가 고정된 경우에는 텍스트 입력 필드를 사용하는 것이 적합하다. 이름 전화번호 생년월일 최소/최대 입력값이 정해진 숫자
- L[921–921](../../upstream/krds/raw/components/component_09_03.html:921): 사용자의 응답을 예측할 수 없거나 사용자가 자유롭게 텍스트를 입력할 수 있게 하는 경우에는 라디오 버튼, 셀렉트가 아닌 텍스트 입력 필드를 사용하는 것이 적합하다.
- L[918–923](../../upstream/krds/raw/components/component_09_03.html:918): 예상할 수 없는 임의의 값을 입력받고자 하는 경우 사용자의 응답을 예측할 수 없거나 사용자가 자유롭게 텍스트를 입력할 수 있게 하는 경우에는 라디오 버튼, 셀렉트가 아닌 텍스트 입력 필드를 사용하는 것이 적합하다.
- L[927–927](../../upstream/krds/raw/components/component_09_03.html:927): 사용하기 적합하지 않은 경우
- L[932–932](../../upstream/krds/raw/components/component_09_03.html:932): 텍스트 입력 필드가 아니라 텍스트 영역을 사용해야 한다.
- L[929–934](../../upstream/krds/raw/components/component_09_03.html:929): 입력값이 여러 줄의 텍스트로 예상되는 경우 텍스트 입력 필드가 아니라 텍스트 영역을 사용해야 한다.
- L[938–938](../../upstream/krds/raw/components/component_09_03.html:938): 라디오 버튼, 체크박스, 셀렉트와 같은 컴포넌트를 사용해야 한다.
- L[935–940](../../upstream/krds/raw/components/component_09_03.html:935): 입력값의 내용, 양식이 정해져 있는 경우 라디오 버튼, 체크박스, 셀렉트와 같은 컴포넌트를 사용해야 한다.

### 사용성 가이드라인

- L[948–948](../../upstream/krds/raw/components/component_09_03.html:948): 사용성 가이드라인
- L[951–951](../../upstream/krds/raw/components/component_09_03.html:951): 입력 필드는 텍스트의 길이를 고려하여 적절한 크기로 제공한다.
- L[952–953](../../upstream/krds/raw/components/component_09_03.html:952): 기본적으로 텍스트 입력 필드의 크기를 그리드, 화면 크기에 따라 유동적이나 전체 섹션 영역을 차지하도록 구현한다. 그러나 이름, 우편번호, 전화번호 등 입력값의 길이를 예측할 수 있는 경우 최대 길이에 맞추어 입력 필드의 너비를 고정하고, 사용자가 더 작은 크기의 화면에서도 잘림 없이 입력값을 확인할 수 있는지를 점검해야 한다.
- L[964–964](../../upstream/krds/raw/components/component_09_03.html:964): 모든 텍스트 입력 필드에는 레이블을 제공한다.
- L[965–965](../../upstream/krds/raw/components/component_09_03.html:965): 텍스트 입력 필드에 레이블이 제공되지 않으면 사용자는 어떤 정보를 입력해야 하는지 알 수 없다. 레이블을 생략하고자 하는 경우에는 레이블 없이도 사용자가 값을 선택하는 데 문제가 없다는 근거가 명확해야 한다.
- L[968–968](../../upstream/krds/raw/components/component_09_03.html:968): 플레이스홀더가 레이블이나 도움말의 대체 수단으로 사용되어서는 안 된다.
- L[969–970](../../upstream/krds/raw/components/component_09_03.html:969): 플레이스홀더는 사용자가 값을 입력하기 시작하는 순간 사라진다. 플레이스홀더가 레이블이나 도움말의 대체 수단으로 활용되는 경우, 사용자는 값을 입력하는 도중 어떤 값을 입력하는 중이었는지, 어떤 형식으로 입력해야 하는지 다시 확인할 수 없다. 또한 거의 모든 웹 브라우저가 플레이스홀더 텍스트의 기본 색상을 최소 명도 대비 기준보다 낮게 제공하므로 읽기 어렵다. 이와 같이 플레이스홀더는 다양한 사용자 그룹에서 여러 사용성 문제를 야기하므로 단순히 사용자의 행동을 유도하기 위한 수단으로 사용해야 한다.
- L[981–981](../../upstream/krds/raw/components/component_09_03.html:981): 복사, 붙여쓰기를 제한하지 않는다.
- L[982–982](../../upstream/krds/raw/components/component_09_03.html:982): 사용자가 다른 웹사이트나 플랫폼에서 텍스트를 복사하여 붙여 넣어야 하는 경우가 있을 수 있으므로 복사, 붙여쓰기 기능을 제한하지 않는 것이 바람직하다
- L[985–985](../../upstream/krds/raw/components/component_09_03.html:985): 사용자가 자주, 반복적으로 입력하는 값은 자동 완성될 수 있도록 구현한다.
- L[986–986](../../upstream/krds/raw/components/component_09_03.html:986): 사용자에게 개인 정보를 입력받는 입력 필드에 프로그램(웹 브라우저)을 통해 사용자가 기존에 입력한 정보를 활용할 수 있는 기술을 적용한다. 이를 통해 정보 입력에 필요한 사용자의 인지적, 신체적 노력을 최소화할 수 있다.

### 접근성 가이드라인

- L[1093–1093](../../upstream/krds/raw/components/component_09_03.html:1093): 접근성 가이드라인
- L[1096–1096](../../upstream/krds/raw/components/component_09_03.html:1096): 모든 입력 필드의 초점은 시각적으로 확인할 수 있도록 표현한다.
- L[1097–1097](../../upstream/krds/raw/components/component_09_03.html:1097): 입력 필드의 초점이 표시되지 않으면 키보드 사용자는 조작하고 있는 대상을 알 수 없으므로 초점은 시각적으로 확인할 수 있게 표현해야 한다. 특히 브라우저가 제공하는 기본 입력 필드 대신 입력 필드를 임의로 만들어 사용하는 경우, 초점 제공에 유의해야 한다.
- L[1104–1104](../../upstream/krds/raw/components/component_09_03.html:1104): 입력 필드와 인접 배경 간 명도 대비를 3:1 이상으로 표현한다.
- L[1105–1105](../../upstream/krds/raw/components/component_09_03.html:1105): 입력 필드의 테두리 또는 채움 색상이 인접한 배경과 3:1 이상의 명도 대비를 갖도록 스타일을 제공하는 것을 권장한다. 인접한 배경과의 명도 대비가 충분한 경우, 사용자가 텍스트 입력 필드임을 보다 명확하게 인지할 수 있다.
- L[1112–1112](../../upstream/krds/raw/components/component_09_03.html:1112): 텍스트 입력 필드에 접근 가능한 이름을 제공한다.
- L[1113–1114](../../upstream/krds/raw/components/component_09_03.html:1113): 스크린 리더 사용자가 텍스트 입력 필드의 용도를 확인할 수 있도록 &lt;label&gt;, title, aria-label, aria-labelledby 중 1가지 방식을 이용하여 레이블을 제공해야 한다. 이때, 가능하면 &lt;label&gt;을 이용하여 사용자가 레이블을 클릭하였을 때에도 값을 입력할 수 있도록 구현하는 것이 좋다.

### 상호작용 가이드라인

- L[1127–1127](../../upstream/krds/raw/components/component_09_03.html:1127): 상호작용 가이드라인
- L[1129–1129](../../upstream/krds/raw/components/component_09_03.html:1129): 데이터 입력
- L[1147–1150](../../upstream/krds/raw/components/component_09_03.html:1147): Click 레이블 또는 입력 필드를 Click 하면 입력 필드에 커서가 활성화되면서 텍스트를 입력할 수 있게 된다.
- L[1151–1154](../../upstream/krds/raw/components/component_09_03.html:1151): Tab, Shift + Tab 모든 텍스트 필드는 사용 불가인 상태를 제외하고 Tab, Shift + Tab 키를 눌렀을 때 접근할 수 있어야 한다.

### 예시

- L[1173–1173](../../upstream/krds/raw/components/component_09_03.html:1173): 예시
- L[1177–1177](../../upstream/krds/raw/components/component_09_03.html:1177): 기본
- L[1228–1228](../../upstream/krds/raw/components/component_09_03.html:1228): 기본 코드 확인하기
- L[1244–1244](../../upstream/krds/raw/components/component_09_03.html:1244): 상태
- L[1295–1295](../../upstream/krds/raw/components/component_09_03.html:1295): 상태 코드 확인하기
- L[1311–1311](../../upstream/krds/raw/components/component_09_03.html:1311): 사이즈
- L[1362–1362](../../upstream/krds/raw/components/component_09_03.html:1362): 사이즈 코드 확인하기
- L[1378–1378](../../upstream/krds/raw/components/component_09_03.html:1378): 아이콘 버튼
- L[1458–1458](../../upstream/krds/raw/components/component_09_03.html:1458): 아이콘 버튼 코드 확인하기

### 마크업 가이드

- L[1478–1478](../../upstream/krds/raw/components/component_09_03.html:1478): 마크업 가이드
- L[1481–1481](../../upstream/krds/raw/components/component_09_03.html:1481): CSS 선택자
- L[1502–1508](../../upstream/krds/raw/components/component_09_03.html:1502): 기본 .krds-input 상태 에러 .is-error .krds-input
- L[1509–1512](../../upstream/krds/raw/components/component_09_03.html:1509): 성공 .is-success .krds-input
- L[1513–1517](../../upstream/krds/raw/components/component_09_03.html:1513): 사이즈 작게 .small
- L[1518–1521](../../upstream/krds/raw/components/component_09_03.html:1518): 중간 .medium
- L[1522–1525](../../upstream/krds/raw/components/component_09_03.html:1522): 크게 .large
- L[1535–1535](../../upstream/krds/raw/components/component_09_03.html:1535): 개발 시 접근성 관련 주의 사항
- L[1537–1537](../../upstream/krds/raw/components/component_09_03.html:1537): 입력 필드는 label로 연결이 불가능한 경우 title 속성 등을 제공하여 어떤 값을 입력하는지 알 수 있도록 한다.

Inline preserved example markup (reference, not the public native API): L[1182–1222](../../upstream/krds/raw/components/component_09_03.html:1182), L[1249–1289](../../upstream/krds/raw/components/component_09_03.html:1249), L[1316–1356](../../upstream/krds/raw/components/component_09_03.html:1316), L[1383–1452](../../upstream/krds/raw/components/component_09_03.html:1383)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Official size/state/icon examples do not mandate a password-reveal feature; any such action needs a separately reviewed explicit API.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1233 `../../code/text_input.html`, L1300 `../../code/text_input_state.html`, L1367 `../../code/text_input_size.html`, L1463 `../../code/text_input_icon.html`, L1549 `./variable/input.html`. Do not infer unseen contents.
- 5 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `TextInputContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
