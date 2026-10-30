# ContextualHelp

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `contextual-help`; Korean name 맥락적 도움말; export `ContextualHelp`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_08_03](https://www.krds.go.kr/html/site/component/component_08_03.html); preserved [HTML](../../upstream/krds/raw/components/component_08_03.html). Retrieved `2026-10-29T23:28:05.025Z`; `96929` bytes; SHA-256 `13d1fe66ded72ef2b1492db7e2d7d549457511c87b12003ced10f78c96637531`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `information`, `help`, `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Named info/question button adjacent to associated field/label, followed immediately in DOM by popover: title, body with optional links and close button. No nested help/modal, no required task information hidden only here.

## Plain semantic API

Independent API: open/defaultOpen=false, onOpenChange({open}), title, content, variant=information|help, placement=bottom-start default (official six alignments mapped), triggerLabel, relatedId. Native button aria-expanded/controls; labeled nonmodal popover region; no tooltip role for interactive content.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Click/Enter/Space opens/toggles. If links present, opening focuses first interactive element. Tab can leave (no trap). Outside click, Escape or trigger toggle closes and returns trigger per official table; Escape ignores composing/handled events. Removed trigger falls back to supplied usable return target then body. Restore only on accepted actual close.

## Responsive/mobile requirements

Collision flip/shift keeps whole popup onscreen and does not cover trigger/important target. Scroll content if viewport very small; no opaque clipping at 200–400% zoom.

## Forms, reset and composition

No form state; help buttons type=button, composition Escape is ignored.

## Asset, integration and composition completion

Host owns short contextual content/new-window links and avoids simultaneous HelpPanel in same task. Completion requires actual interactive-link focus, close and reposition behavior.

## Stable parts and states

root, trigger, icon, popover, title, body, close; open,closed,placement.

All rendered owned parts use `data-krds-component="contextual-help"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Closed by default and never autostarts.
2. Unique trigger name identifies subject.
3. Link content receives focus and Tab exits.
4. Escape/outside return trigger.
5. Viewport edges reflow popup.
6. Removed trigger/route unmount cleans listeners.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`contextual-help--information`, `contextual-help--help`, `contextual-help--six-placements`, `contextual-help--interactive-link`, `contextual-help--narrow-edge`, `contextual-help--removed-trigger`, `contextual-help--controlled-rejected`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_08_03.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_08_03.html:889): 1. 아이콘 버튼 도움말 콘텐츠의 표시를 토글하는 버튼. 정보의 유형에 따라 정보(i) 아이콘, 물음표(?) 아이콘으로 구분됨
- L[890–890](../../upstream/krds/raw/components/component_08_03.html:890): 2. 컨테이너 도움말 영역과 배경을 구분하는 요소
- L[891–891](../../upstream/krds/raw/components/component_08_03.html:891): 3. 제목 도움말의 제목
- L[892–892](../../upstream/krds/raw/components/component_08_03.html:892): 4. 본문 구체적인 설명 텍스트. 일반적으로 짧은 단락으로 구성되며, 링크를 포함할 수 있음
- L[893–893](../../upstream/krds/raw/components/component_08_03.html:893): 5. 닫기 버튼 컨테이너에 포함된 x 아이콘 버튼

### 유형

- L[901–901](../../upstream/krds/raw/components/component_08_03.html:901): 유형
- L[903–903](../../upstream/krds/raw/components/component_08_03.html:903): 정보 제공
- L[905–907](../../upstream/krds/raw/components/component_08_03.html:905): 버튼이 정보(i) 아이콘으로 표현된다. 컴포넌트나 레이블 옆에 배치되어 해당 요소에 관한 부가적인 정보나 사용자가 알았을 때 도움이 되는 정보를 전달하기 위해 사용된다. 본문은 간략하지만 요소에 대한 구체적인 안내를 포함하고 있어야 한다.
- L[909–909](../../upstream/krds/raw/components/component_08_03.html:909): 예) 비활성화 상태인 컨트롤 요소에 대해 현시점에서 사용할 수 없는 이유에 대한 설명 등
- L[914–914](../../upstream/krds/raw/components/component_08_03.html:914): 도움 제공
- L[920–920](../../upstream/krds/raw/components/component_08_03.html:920): 예) 입력 방법에 대한 설명, 전문 용어에 대한 해설 등

### 용례

- L[929–929](../../upstream/krds/raw/components/component_08_03.html:929): 용례
- L[931–931](../../upstream/krds/raw/components/component_08_03.html:931): 사용하기 적합하지 않은 경우
- L[936–936](../../upstream/krds/raw/components/component_08_03.html:936): 텍스트 레이블 없는 아이콘 단독 컨트롤 요소에 레이블을 표시하고자 하는 경우에는 툴팁을 사용하는 것이 적절하다.
- L[933–938](../../upstream/krds/raw/components/component_08_03.html:933): 컨트롤 요소에 대한 레이블을 제공할 때 텍스트 레이블 없는 아이콘 단독 컨트롤 요소에 레이블을 표시하고자 하는 경우에는 툴팁을 사용하는 것이 적절하다.
- L[942–942](../../upstream/krds/raw/components/component_08_03.html:942): 사용자가 맥락적 도움말을 발견하지 못할 수 있으므로 사용자가 반드시 확인해야 하는 중요한 정보를 도움말 팝오버에 숨겨서는 안 된다. 중요한 정보를 전달하는 데는 인라인 도움말이나 도움 패널이 적합하다.
- L[939–944](../../upstream/krds/raw/components/component_08_03.html:939): 사용자가 작업을 완료하는 데 필요한 중요한 정보를 전달할 때 사용자가 맥락적 도움말을 발견하지 못할 수 있으므로 사용자가 반드시 확인해야 하는 중요한 정보를 도움말 팝오버에 숨겨서는 안 된다. 중요한 정보를 전달하는 데는 인라인 도움말이나 도움 패널이 적합하다.
- L[948–948](../../upstream/krds/raw/components/component_08_03.html:948): 툴팁이나 인라인 도움말을 사용하는 것이 적절하다.
- L[945–950](../../upstream/krds/raw/components/component_08_03.html:945): 간단한 추가 정보를 제공할 때 툴팁이나 인라인 도움말을 사용하는 것이 적절하다.

### 사용성 가이드라인

- L[958–958](../../upstream/krds/raw/components/component_08_03.html:958): 사용성 가이드라인
- L[961–961](../../upstream/krds/raw/components/component_08_03.html:961): 아이콘 버튼은 도움 정보를 제공하고자 하는 요소 주변에 배치한다.
- L[962–962](../../upstream/krds/raw/components/component_08_03.html:962): 정보를 제공하고자 하는 컴포넌트나 레이블 옆에 배치하여 관련 요소와의 연관성이 명확하게 인지될 수 있도록 한다.
- L[965–965](../../upstream/krds/raw/components/component_08_03.html:965): 팝오버 영역이 화면을 벗어나지 않도록 표현한다.
- L[966–966](../../upstream/krds/raw/components/component_08_03.html:966): 도움말 팝오버 영역이 시각적으로 확인할 수 없는 화면 밖의 영역에 배치되어 내부 콘텐츠가 가려지지 않도록 해야 한다.
- L[969–969](../../upstream/krds/raw/components/component_08_03.html:969): 팝오버 영역이 본문의 중요 콘텐츠를 가리지 않도록 표현한다.
- L[970–970](../../upstream/krds/raw/components/component_08_03.html:970): 팝오버 영역이 활성화 버튼과 맥락적으로 도움을 제공하고자 하는 본문 콘텐츠 요소를 가리지 않도록 적절한 표시 방향을 설정한다.
- L[973–973](../../upstream/krds/raw/components/component_08_03.html:973): 사용자가 작업을 수행하기 위해 반드시 알아야 하는 필수 정보가 맥락적 도움말 콘텐츠에서만 제공되지 않도록 한다.
- L[974–975](../../upstream/krds/raw/components/component_08_03.html:974): 맥락적 도움말을 발견하지 못할 수 있으므로 사용자가 반드시 확인해야 하는 중요한 정보를 도움말 팝오버에만 제공해서는 안 된다. 맥락적 도움말은 필수 정보가 아니라 제공되었을 때 사용자가 더 쉽게 이용하는 데 도움되는 정보를 제공해야 한다. 필수 정보를 잘 요약하여 본문에 표현하고 관련된 유용한 정보를 맥락적 도움말로 제공한다.
- L[983–983](../../upstream/krds/raw/components/component_08_03.html:983): 맥락적 도움말에서 또 다른 맥락적 도움말을 실행하거나 모달을 실행하지 않도록 한다.
- L[984–984](../../upstream/krds/raw/components/component_08_03.html:984): 여러 개의 도움말 팝업을 동시에 활성화 하거나 하나의 팝오버를 다른 팝오버 내부에 중첩시켜서는 안 된다. 또한 맥락적 도움말에서 모달이 생성되지 않도록 하여 복잡성을 피해야 한다.
- L[987–987](../../upstream/krds/raw/components/component_08_03.html:987): 도움말 내부 링크는 새 창으로 실행한다.
- L[988–988](../../upstream/krds/raw/components/component_08_03.html:988): 본문에 링크가 포함되어 있는 경우에는 항상 새 창으로 링크를 실행시켜 사용자의 현재 과업 맥락이 중단되지 않도록 한다.
- L[991–991](../../upstream/krds/raw/components/component_08_03.html:991): 맥락적 도움말과 도움 패널을 함께 사용하지 않는다.
- L[992–992](../../upstream/krds/raw/components/component_08_03.html:992): 사용자가 인터페이스의 작동 방식을 혼동하지 않도록 하나의 과업 흐름에서 맥락적 도움말과 도움 패널을 동시에 사용하지 않아야 한다.

### 플랫폼에 대한 고려 사항

- L[1004–1004](../../upstream/krds/raw/components/component_08_03.html:1004): 플랫폼에 대한 고려 사항
- L[1007–1007](../../upstream/krds/raw/components/component_08_03.html:1007): 모든 화면 크기에서 팝오버 영역이 완전히 표시되는지 확인한다.
- L[1008–1008](../../upstream/krds/raw/components/component_08_03.html:1008): 특정 너비에서 도움말 팝오버 영역이 시각적으로 확인할 수 없는 화면 밖의 영역에 배치되지 않는지 확인하여 문제가 발견된 경우 적절한 영역으로 배치를 변경해야 한다.

### 접근성 가이드라인

- L[1130–1130](../../upstream/krds/raw/components/component_08_03.html:1130): 접근성 가이드라인
- L[1133–1133](../../upstream/krds/raw/components/component_08_03.html:1133): 아이콘과 인접 배경 간 명도 대비를 3:1 이상으로 제공한다.
- L[1134–1134](../../upstream/krds/raw/components/component_08_03.html:1134): 사용자가 아이콘이 컨트롤로 사용되고 있으며 유형에 따라 다른 정보를 제공함을 인지할 수 있도록 아이콘과 인접 배경의 명도 대비를 3:1 이상으로 제공해야 한다.
- L[1141–1141](../../upstream/krds/raw/components/component_08_03.html:1141): 아이콘 버튼에 이름을 제공한다.
- L[1142–1142](../../upstream/krds/raw/components/component_08_03.html:1142): 스크린 리더 사용자가 활성화 버튼의 용도를 이해할 수 있도록 각각의 아이콘 버튼에 이름을 제공해야 한다.
- L[1150–1150](../../upstream/krds/raw/components/component_08_03.html:1150): 아이콘 버튼에 고유하고 적절한 이름을 제공한다.
- L[1151–1152](../../upstream/krds/raw/components/component_08_03.html:1151): 아이콘 버튼이 맥락적으로 도움을 제공하고자 하는 본문 콘텐츠의 내용을 포함하고 있지 않다면 해당 정보를 아이콘 버튼의 이름으로 포함하여 스크린 리더 사용자가 정확한 용도를 이해할 수 있도록 제공한다. 페이지에 존재하는 다른 아이콘 버튼과 혼동되지 않도록 모든 아이콘 버튼의 이름은 고유해야 한다.
- L[1159–1159](../../upstream/krds/raw/components/component_08_03.html:1159): 맥락적 도움말은 사용자가 요청한 경우에만 실행되어야 한다.
- L[1160–1160](../../upstream/krds/raw/components/component_08_03.html:1160): 페이지가 로딩되자마자 특정 맥락적 도움말이 활성화되는 등 사용자가 의도하지 않는 상황에서 자동으로 실행되어서는 안 된다.
- L[1168–1168](../../upstream/krds/raw/components/component_08_03.html:1168): 아이콘 버튼과 도움말 팝오버 콘텐츠를 적절한 순서로 제공한다.
- L[1169–1169](../../upstream/krds/raw/components/component_08_03.html:1169): 스크린 리더 사용자가 도움말 팝오버 콘텐츠에 논리적인 순서로 접근할 수 있도록 관련 있는 아이콘 버튼 다음 요소로 제공해야 한다.
- L[1176–1176](../../upstream/krds/raw/components/component_08_03.html:1176): 키보드 초점은 논리적인 순서로 이동해야 한다.
- L[1177–1177](../../upstream/krds/raw/components/component_08_03.html:1177): 맥락적 도움말 팝오버 내부에 링크가 포함된 경우, 맥락적 도움말을 활성화했을 때 키보드 초점은 팝오버 내부의 대화형 요소로 이동해야 한다. 이때, 팝오버 내부에서 키보드 함정이 발생하지 않도록 유의해야 한다.
- L[1185–1185](../../upstream/krds/raw/components/component_08_03.html:1185): 아이콘 버튼의 크기를 44px x 44px 이상으로 제공하는 방안을 고려한다.
- L[1186–1189](../../upstream/krds/raw/components/component_08_03.html:1186): 클릭이나 터치 영역을 정교하게 조작하기 어려운 사용자를 고려하여 아이콘 버튼의 크기를 44px x 44px 이상으로 제공하는 방안을 고려한다. 이때, 단위는 CSS 픽셀을 기준으로 한다. 만약 아이콘 버튼이 문장의 끝에 제공되고 있다면 문장의 일부 요소로 간주되기 때문에 크기에 대한 요구사항을 충족하지 않아도 된다.

### 상호작용 가이드라인

- L[1201–1201](../../upstream/krds/raw/components/component_08_03.html:1201): 상호작용 가이드라인
- L[1203–1203](../../upstream/krds/raw/components/component_08_03.html:1203): 맥락적 도움말 실행
- L[1221–1224](../../upstream/krds/raw/components/component_08_03.html:1221): Click 아이콘 버튼을 Click 하면 도움말 콘텐츠가 표시된다.
- L[1225–1228](../../upstream/krds/raw/components/component_08_03.html:1225): Enter, Space 아이콘 버튼이 초점을 가진 상태에서 Enter 또는 Space 키를 누르면 도움말 콘텐츠가 표시된다.
- L[1235–1235](../../upstream/krds/raw/components/component_08_03.html:1235): 도움말 내부 콘텐츠 탐색
- L[1253–1256](../../upstream/krds/raw/components/component_08_03.html:1253): Tab 도움말 팝오버가 활성화된 상태에서 내부 링크 요소를 순차적으로 탐색한다.
- L[1263–1263](../../upstream/krds/raw/components/component_08_03.html:1263): 맥락적 도움말 비활성화
- L[1281–1287](../../upstream/krds/raw/components/component_08_03.html:1281): Click 아이콘 버튼 또는 도움말 팝오버 바깥쪽 본문 영역을 Click 하면 도움말 콘텐츠가 숨겨진다. 키보드 초점은 관련된 아이콘 버튼으로 돌아간다.
- L[1288–1294](../../upstream/krds/raw/components/component_08_03.html:1288): Esc 초점의 위치와 상관없이 Esc 키를 누르면 도움말 콘텐츠가 숨겨진다. 키보드 초점은 관련된 아이콘 버튼으로 돌아간다.
- L[1295–1301](../../upstream/krds/raw/components/component_08_03.html:1295): Enter, Space 아이콘 버튼이 초점을 가진 상태에서 Enter 또는 Space 키를 누르면 도움말 콘텐츠가 숨겨진다. 키보드 초점은 관련된 아이콘 버튼으로 돌아간다.

### 예시

- L[1320–1320](../../upstream/krds/raw/components/component_08_03.html:1320): 예시
- L[1324–1324](../../upstream/krds/raw/components/component_08_03.html:1324): 기본
- L[1341–1341](../../upstream/krds/raw/components/component_08_03.html:1341): 도움말 제목
- L[1366–1366](../../upstream/krds/raw/components/component_08_03.html:1366): 도움말 제목
- L[1391–1391](../../upstream/krds/raw/components/component_08_03.html:1391): 도움말 제목
- L[1418–1418](../../upstream/krds/raw/components/component_08_03.html:1418): 도움말 제목
- L[1443–1443](../../upstream/krds/raw/components/component_08_03.html:1443): 도움말 제목
- L[1468–1468](../../upstream/krds/raw/components/component_08_03.html:1468): 도움말 제목
- L[1491–1491](../../upstream/krds/raw/components/component_08_03.html:1491): 기본 코드 확인하기

### 마크업 가이드

- L[1511–1511](../../upstream/krds/raw/components/component_08_03.html:1511): 마크업 가이드
- L[1514–1514](../../upstream/krds/raw/components/component_08_03.html:1514): CSS 선택자
- L[1534–1546](../../upstream/krds/raw/components/component_08_03.html:1534): 전체영역 .krds-contextual-help 팝오버 위치 .top.left (상단 왼쪽) .top.center (상단 중앙) .top.right (상단 오른쪽) .bottom.left (하단 왼쪽) .bottom.center (하단 중앙) .bottom.right (하단 오른쪽)
- L[1547–1550](../../upstream/krds/raw/components/component_08_03.html:1547): 도움말 제어 .tooltip-action
- L[1551–1554](../../upstream/krds/raw/components/component_08_03.html:1551): 팝오버 .tooltip-popover
- L[1564–1564](../../upstream/krds/raw/components/component_08_03.html:1564): JS
- L[1583–1587](../../upstream/krds/raw/components/component_08_03.html:1583): krds_contextualHelp init() 초기화 및 주요 이벤트 실행
- L[1588–1591](../../upstream/krds/raw/components/component_08_03.html:1588): setupTooltips() 도움말 설정
- L[1592–1595](../../upstream/krds/raw/components/component_08_03.html:1592): toggleTooltip() 도움말 팝오버 토글

Inline preserved example markup (reference, not the public native API): L[1329–1485](../../upstream/krds/raw/components/component_08_03.html:1329)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Recorded independent decision: Accepted outside-click dismissal follows the literal official trigger-return rule even when the pointer target is another control. Run that target action normally, then restore the usable trigger once only after actual accepted close; an opened topmost modal keeps restoration inside its own active boundary. No focus transfer occurs on rejected close. Missing trigger uses usable same-boundary fallbackFocusId then focusable container/body only outside active modal isolation.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1496 `../../code/contextual_help.html`, L1610 `../../../resources/js/examples/krds_contextualHelp.js`, L1629 `./variable/contextual_help.html`. Do not infer unseen contents.
- 3 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Accepted independent resolution

Accepted outside-click dismissal follows the literal official trigger-return rule even when the pointer target is another control. Run that target action normally, then restore the usable trigger once only after actual accepted close; an opened topmost modal keeps restoration inside its own active boundary. No focus transfer occurs on rejected close. Missing trigger uses usable same-boundary fallbackFocusId then focusable container/body only outside active modal isolation.

## Shared implementation handoff

The exact semantic interface is `ContextualHelpContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
