# HelpPanel

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `help-panel`; Korean name 도움 패널; export `HelpPanel`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_08_01](https://www.krds.go.kr/html/site/component/component_08_01.html); preserved [HTML](../../upstream/krds/raw/components/component_08_01.html). Retrieved `2026-10-29T23:28:04.876Z`; `84312` bytes; SHA-256 `c52ffcdd1637839597336232526fc7a56aa80a77de5d81a219ab4e13d3c5b346`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `composition`. Recommend composition from L889–914 multi-region structure, L960–993 topic/tab persistence, and L1004–1005 responsive Modal integration.

Supported native cases (variant and state axes): `desktop-open`, `narrow-modal`, `initial`, `context-detail`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Body followed by opener and help panel. Panel header offers optional Help/Tutorial tabs and close, content initial guidance or context-specific title/body, divider and related/help-channel footer. Context icon triggers beside related field/section have unique names; section title matches associated label.

## Plain semantic API

Independent API: open/defaultOpen=true on wide layout, selectedTopicId/defaultSelectedTopicId=null, onOpenChange({open}), onTopicChange({id}), topics {id,title,content,relatedLinks}[], mode=help|tutorial when composed, `fallbackFocusId?`. Closing/reopening preserves last topic; content changes only from an explicit contextual trigger. The panel opener is the separate persistent “open panel” button, not whichever contextual topic icon initiated this opening.

The [pilot controlled/reset conventions](./README.md) apply to each declared controlled field: props are authoritative, defaults read once, controlled/default together or mode switching invalid, one changed user request, no mount/prop/reset callbacks. A rejected controlled close retains the visible panel and its narrow-modal isolation/trap; no early return focus occurs.

## Keyboard, focus and state transitions

Opening focuses the panel container itself. Desktop panel permits Tab out without a trap; narrow presentation uses Modal-equivalent initial-container focus, isolation, scroll locking, topmost Escape and Tab wrapping while actually open. Links open a new window with communicated purpose.

**HelpPanel is the sole restoration owner in both modes.** The official close action returns to the distinct panel-opening button ([L1265–1278](../../upstream/krds/raw/components/component_08_01.html:1265)), even if a surviving topic icon opened the narrow panel. Reuse lower-level native isolation/trapping/entry primitives with their automatic return disabled/delegated to this composition; do not instantiate the public Modal contract and then override its saved usable opener using returnFocusId or a second focus call. The public [Modal actual-opener rule](./modal.md:23) remains unchanged. This explicit composition adaptation preserves HelpPanel's more specific official destination alongside narrow-modal presentation ([L1004–1005](../../upstream/krds/raw/components/component_08_01.html:1004)).

On an accepted actual true→false transition, first remove this panel's isolation/scroll lock, then focus exactly once: usable panel opener; else usable fallbackFocusId; else saved initiating topic icon if usable; else nearest remaining usable focusable ancestor of that icon; else document body with temporary tabindex=-1 (restore prior tabindex). Usable means mounted, visible, enabled, focusable, same live document, and not inert. Return policy also runs on unmount of an open panel after cleanup, without synthetic change events. A rejected controlled close does none of this; focus stays inside the active narrow modal. If a Tutorial/Coach Stop transaction owns this transition, explicitly hand off restoration to that one coordinator rather than running both owners.

## Responsive/mobile requirements

Wide initial panel open with initial guidance; narrow initially opener-only, opens modal. Keep icons >=44px target where applicable and no essential information exclusively hidden in help.

## Forms, reset and composition

No aggregate form/reset; panel must not clear in-progress body inputs or steal composing keys.

## Asset, integration and composition completion

Recommend component→composition: includes topic triggers, stateful panel, optional Tabs/TutorialPanel, Modal on narrow and related links. Completion requires a working field/topic demo and responsive shell; host owns help content/URLs and external help channels.

## Stable parts and states

root, opener, topic-trigger, header, tabs, close, title, body, related; open,closed,active-topic,modal.

All rendered owned parts use `data-krds-component="help-panel"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Wide starts open with initial guidance.
2. Explicit topic trigger changes title/body and focuses panel.
3. Close/reopen retains topic.
4. Desktop Tab escapes and narrow modal traps correctly.
5. Accepted close prefers the distinct usable panel-opening button even when a contextual topic icon survives or disappears, then uses the documented fallback if the opener is unusable.
6. Route cleanup restores scroll/isolation.
7. Narrow panel opened by a surviving contextual topic icon closes to the distinct usable panel-opening button with exactly one restoration owner.
8. Rejected controlled narrow close retains open state, trap and isolation without restoring focus.
9. Removed panel opener uses the documented usable fallback after actual close and never focuses a hidden or inert target.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`help-panel--desktop-open`, `help-panel--initial`, `help-panel--context-detail`, `help-panel--narrow-modal`, `help-panel--topic-trigger-removed`, `help-panel--help-tutorial-tabs`, `help-panel--narrow-topic-icon-return`, `help-panel--controlled-close-rejected`, `help-panel--panel-opener-removed`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_08_01.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_08_01.html:889): 1. 패널 열기 버튼 패널을 표시하는 데 사용되는 버튼. 본문 우측에 배치되며, 스크롤 동작 시 화면의 일관된 위치에 고정하여 배치됨
- L[890–890](../../upstream/krds/raw/components/component_08_01.html:890): 2. 아이콘 버튼 도움 패널과 상세 도움 콘텐츠의 표시를 토글하는 ? 아이콘 버튼
- L[891–891](../../upstream/krds/raw/components/component_08_01.html:891): 3. 식별자 활성화된 아이콘 버튼을 표시함
- L[895–895](../../upstream/krds/raw/components/component_08_01.html:895): a. 패널 선택 탭 도움 패널과 따라하기 패널을 전환하는 데 사용됨
- L[896–896](../../upstream/krds/raw/components/component_08_01.html:896): b. 패널 닫기 버튼 패널을 닫고 패널 활성화 버튼을 표시하는 데 사용됨
- L[892–898](../../upstream/krds/raw/components/component_08_01.html:892): 4. 헤더 a. 패널 선택 탭 도움 패널과 따라하기 패널을 전환하는 데 사용됨 b. 패널 닫기 버튼 패널을 닫고 패널 활성화 버튼을 표시하는 데 사용됨
- L[903–903](../../upstream/krds/raw/components/component_08_01.html:903): a. 섹션 제목 도움말을 제공할 대상에 대한 요약 텍스트
- L[904–904](../../upstream/krds/raw/components/component_08_01.html:904): b. 내용 콘텐츠. 필요한 경우 관련 페이지 링크나 파일 다운로드 링크가 포함될 수 있음
- L[899–906](../../upstream/krds/raw/components/component_08_01.html:899): 5. 본문 도움 패널의 용도를 안내하고, 사용을 유도하기 위한 초기 상태와 대상에 관련된 상세 정보를 제공하는 두 가지 상태로 구성됨 a. 섹션 제목 도움말을 제공할 대상에 대한 요약 텍스트 b. 내용 콘텐츠. 필요한 경우 관련 페이지 링크나 파일 다운로드 링크가 포함될 수 있음
- L[907–907](../../upstream/krds/raw/components/component_08_01.html:907): 6. 구분선 본문과 푸터를 구분하기 위한 선
- L[911–911](../../upstream/krds/raw/components/component_08_01.html:911): a. 관련 페이지 링크 원하는 페이지로 이동하지 못한 사용자를 고려하여, 탐색 중인 페이지와 관련되어 있거나 유사한 내용의 페이지 링크를 대안으로 제공함
- L[912–912](../../upstream/krds/raw/components/component_08_01.html:912): b. 기타 문의/도움말 채널 관련 질의응답을 확인할 수 있거나 추가적으로 질문할 수 있는 채널(자주 묻는 질문 목록, 챗봇, 상담 번호 등) 정보를 제공함
- L[908–914](../../upstream/krds/raw/components/component_08_01.html:908): 7. 푸터 a. 관련 페이지 링크 원하는 페이지로 이동하지 못한 사용자를 고려하여, 탐색 중인 페이지와 관련되어 있거나 유사한 내용의 페이지 링크를 대안으로 제공함 b. 기타 문의/도움말 채널 관련 질의응답을 확인할 수 있거나 추가적으로 질문할 수 있는 채널(자주 묻는 질문 목록, 챗봇, 상담 번호 등) 정보를 제공함

### 용례

- L[922–922](../../upstream/krds/raw/components/component_08_01.html:922): 용례
- L[924–924](../../upstream/krds/raw/components/component_08_01.html:924): 사용하기 적합하지 않은 경우
- L[929–929](../../upstream/krds/raw/components/component_08_01.html:929): 맥락적 도움말 컴포넌트를 사용하는 것이 적합하다.
- L[926–931](../../upstream/krds/raw/components/component_08_01.html:926): 안내/도움 정보가 간단한 경우 맥락적 도움말 컴포넌트를 사용하는 것이 적합하다.
- L[935–935](../../upstream/krds/raw/components/component_08_01.html:935): 도움 패널 대신 따라하기 패널과 코치 마크 컴포넌트를 사용한다.
- L[932–937](../../upstream/krds/raw/components/component_08_01.html:932): 작업을 완료하는 방법에 대한 단계별 안내를 제공하고자 하는 경우 도움 패널 대신 따라하기 패널과 코치 마크 컴포넌트를 사용한다.

### 사용성 가이드라인

- L[945–945](../../upstream/krds/raw/components/component_08_01.html:945): 사용성 가이드라인
- L[948–948](../../upstream/krds/raw/components/component_08_01.html:948): 화면이 로딩되었을 때 도움 패널은 열린 상태로 제공한다.
- L[949–949](../../upstream/krds/raw/components/component_08_01.html:949): 도움말이 필요한 사용자가 패널의 존재 유무를 직관적으로 인지할 수 있도록 화면이 로딩되었을 때 도움 패널을 펼친 상태로 제공한다.
- L[960–960](../../upstream/krds/raw/components/component_08_01.html:960): 도움 패널의 첫 화면은 기본 상태로 제공한다.
- L[961–961](../../upstream/krds/raw/components/component_08_01.html:961): 도움 패널과 따라하기 패널이 함께 제공되어야 하는 경우, 도움 패널이 선택되어 있어야 한다. 콘텐츠는 도움 패널의 용도와 활용 방법을 간략하게 안내하여, 사용자의 이용을 유도하고 사용자가 의도하지 않은 상황에서 상세 도움 정보가 제공되지 않도록 해야 한다.
- L[968–968](../../upstream/krds/raw/components/component_08_01.html:968): 아이콘 버튼은 도움 정보를 제공하고자 하는 요소 주변에 배치한다.
- L[969–969](../../upstream/krds/raw/components/component_08_01.html:969): 정보를 제공하고자 하는 컴포넌트나 레이블 옆에 배치하여 관련 요소와의 연관성이 명확하게 인지될 수 있도록 한다.
- L[972–972](../../upstream/krds/raw/components/component_08_01.html:972): 도움 패널의 섹션 제목은 아이콘 버튼과 관련된 본문 섹션 헤딩/레이블 텍스트와 일치해야 한다.
- L[973–976](../../upstream/krds/raw/components/component_08_01.html:973): 섹션 제목을 아이콘 버튼 옆의 본문 섹션 헤딩/레이블 텍스트와 일치시켜 사용자가 어떤 요소나 섹션에 관련된 도움말을 보는 중인지 명확하게 인지할 수 있도록 해야 한다. 만약 섹션 제목으로 사용할 수 있는 텍스트가 존재하지 않는다면, 안내/도움 정보를 제공하고자 하는 정보 그룹을 설명할 수 있는 내용을 섹션 제목으로 제공한다.
- L[979–979](../../upstream/krds/raw/components/component_08_01.html:979): 콘텐츠를 간결하게 유지한다.
- L[980–980](../../upstream/krds/raw/components/component_08_01.html:980): 가능한 한 사용자가 패널 영역을 스크롤 하지 않고 정보를 훑어볼 수 있도록 필요한 내용을 간결한 문장으로 작성한다.
- L[983–983](../../upstream/krds/raw/components/component_08_01.html:983): 사용자가 작업을 수행하기 위해 반드시 알아야 하는 필수 정보가 패널에서만 제공되지 않도록 한다.
- L[984–985](../../upstream/krds/raw/components/component_08_01.html:984): 도움 패널을 발견하지 못할 수 있으므로 사용자가 반드시 확인해야 하는 중요한 정보를 도움 패널에만 제공해서는 안 된다. 맥락적 도움말은 필수 정보가 아니라 제공되었을 때 사용자가 더 쉽게 이용하는 데 도움 되는 정보를 제공해야 한다. 필수 정보를 잘 요약하여 본문에 표현하고 관련된 유용한 정보를 도움 패널에 제공한다.
- L[988–988](../../upstream/krds/raw/components/component_08_01.html:988): 패널에서 제공하는 웹 페이지 링크는 새 창으로 실행한다.
- L[989–989](../../upstream/krds/raw/components/component_08_01.html:989): 패널에 웹 페이지 링크가 포함되어 있는 경우에는 항상 새 창으로 링크를 실행시켜 사용자의 현재 과업 맥락이 중단되지 않도록 한다.
- L[992–992](../../upstream/krds/raw/components/component_08_01.html:992): 본문은 사용자가 특정 아이콘 버튼을 실행하는 경우에만 변경되도록 한다.
- L[993–993](../../upstream/krds/raw/components/component_08_01.html:993): 사용자가 패널을 닫았다가 다시 실행한 경우, 본문은 사용자가 가장 마지막에 확인한 도움 콘텐츠를 표시해야 한다.

### 플랫폼에 대한 고려 사항

- L[1001–1001](../../upstream/krds/raw/components/component_08_01.html:1001): 플랫폼에 대한 고려 사항
- L[1004–1004](../../upstream/krds/raw/components/component_08_01.html:1004): 화면 너비가 충분하지 않을 때 도움 패널은 패널 열기 버튼으로 축약하여 제공한다.
- L[1005–1005](../../upstream/krds/raw/components/component_08_01.html:1005): 화면 너비가 충분하지 않을 경우, 사용자가 본문 콘텐츠에 우선적으로 접근하고 본문의 과업에 집중할 수 있도록 패널 열기 버튼을 제공한다. 패널 열기 버튼이나 아이콘 버튼을 눌렀을 때 패널은 모달 형식으로 제공하면 된다.

### 접근성 가이드라인

- L[1117–1117](../../upstream/krds/raw/components/component_08_01.html:1117): 접근성 가이드라인
- L[1120–1120](../../upstream/krds/raw/components/component_08_01.html:1120): 아이콘과 인접 배경 간 명도 대비를 3:1 이상으로 제공한다.
- L[1121–1121](../../upstream/krds/raw/components/component_08_01.html:1121): 사용자가 아이콘이 컨트롤로 사용되고 있으며 유형에 따라 다른 정보를 제공함을 인지할 수 있도록 아이콘과 인접 배경의 명도 대비를 3:1 이상으로 제공해야 한다.
- L[1128–1128](../../upstream/krds/raw/components/component_08_01.html:1128): 아이콘 버튼에 이름을 제공한다.
- L[1129–1129](../../upstream/krds/raw/components/component_08_01.html:1129): 스크린 리더 사용자가 활성화 버튼의 용도를 이해할 수 있도록 각각의 아이콘 버튼에 이름을 제공해야 한다.
- L[1137–1137](../../upstream/krds/raw/components/component_08_01.html:1137): 아이콘 버튼에 고유하고 적절한 이름을 제공한다.
- L[1138–1141](../../upstream/krds/raw/components/component_08_01.html:1138): 아이콘 버튼이 맥락적으로 도움을 제공하고자 하는 본문 콘텐츠의 내용을 포함하고 있지 않다면 해당 정보를 아이콘 버튼의 이름으로 포함하여 스크린 리더 사용자가 정확한 용도를 이해할 수 있도록 제공한다. 페이지에 존재하는 다른 아이콘 버튼과 혼동되지 않도록 모든 아이콘 버튼의 이름은 고유해야 한다. 예) 건축물 대장 유형 안내
- L[1148–1148](../../upstream/krds/raw/components/component_08_01.html:1148): 키보드 초점은 논리적인 순서로 이동해야 한다.
- L[1149–1149](../../upstream/krds/raw/components/component_08_01.html:1149): 패널이 실행되면 키보드 초점은 패널 영역 자체로 이동해야 한다. 패널 내부에서 키보드 함정이 발생하지 않아야 한다.
- L[1157–1157](../../upstream/krds/raw/components/component_08_01.html:1157): 아이콘 버튼의 크기를 44px x 44px 이상으로 제공하는 방안을 고려한다.
- L[1158–1161](../../upstream/krds/raw/components/component_08_01.html:1158): 클릭이나 터치 영역을 정교하게 조작하기 어려운 사용자를 고려하여 아이콘 버튼의 크기를 44px x 44px 이상으로 제공하는 방안을 고려한다. 이때, 단위는 CSS 픽셀을 기준으로 한다. 만약 아이콘 버튼이 문장의 끝에 제공되고 있다면 문장의 일부 요소로 간주되기 때문에 크기에 대한 요구사항을 충족하지 않아도 된다.
- L[1168–1168](../../upstream/krds/raw/components/component_08_01.html:1168): 패널 열기 버튼과 패널은 본문 바로 다음 요소로 제공한다.
- L[1169–1169](../../upstream/krds/raw/components/component_08_01.html:1169): 키보드, 스크린 리더 사용자가 우선 본문의 다양한 정보와 컨트롤 요소에 대한 개요를 파악한 후 도움 패널의 사용 여부를 결정할 수 있도록 본문 다음 요소로 제공한다.

### 상호작용 가이드라인

- L[1182–1182](../../upstream/krds/raw/components/component_08_01.html:1182): 상호작용 가이드라인
- L[1184–1184](../../upstream/krds/raw/components/component_08_01.html:1184): 도움 패널 실행
- L[1202–1205](../../upstream/krds/raw/components/component_08_01.html:1202): Click 패널 열기 버튼 또는 아이콘 버튼을 Click 하면 도움 패널이 표시된다. 패널 표시 후, 키보드 초점은 도움 패널 자체로 이동한다.
- L[1206–1212](../../upstream/krds/raw/components/component_08_01.html:1206): Enter, Space 패널 열기 버튼 또는 아이콘 버튼이 초점을 가진 상태에서 Enter 또는 Space 키를 누르면 도움 패널이 표시된다. 패널 표시 후, 키보드 초점은 도움 패널 자체로 이동한다.
- L[1219–1219](../../upstream/krds/raw/components/component_08_01.html:1219): 도움 패널 내부 콘텐츠 탐색
- L[1237–1240](../../upstream/krds/raw/components/component_08_01.html:1237): Tab 패널이 활성화된 상태에서 내부 링크 요소를 순차적으로 탐색한다.
- L[1247–1247](../../upstream/krds/raw/components/component_08_01.html:1247): 도움 패널 비활성화
- L[1265–1271](../../upstream/krds/raw/components/component_08_01.html:1265): Click 패널 닫기 버튼을 Click 하면 도움 패널이 닫히고 패널 열기 버튼이 표시된다. 키보드 초점은 패널 열기 버튼으로 이동한다.
- L[1272–1278](../../upstream/krds/raw/components/component_08_01.html:1272): Enter, Space 패널 닫기 버튼이 초점을 가진 상태에서 Enter 또는 Space 키를 누르면 도움 패널이 닫히고 패널 열기 버튼이 표시된다. 키보드 초점은 관련된 패널 열기 버튼으로 이동한다.

### 예시

- L[1297–1297](../../upstream/krds/raw/components/component_08_01.html:1297): 예시

### 마크업 가이드

- L[1344–1344](../../upstream/krds/raw/components/component_08_01.html:1344): 마크업 가이드
- L[1347–1347](../../upstream/krds/raw/components/component_08_01.html:1347): CSS 선택자
- L[1367–1372](../../upstream/krds/raw/components/component_08_01.html:1367): 전체영역 .krds-help-panel 영역 전개 .expand
- L[1373–1376](../../upstream/krds/raw/components/component_08_01.html:1373): 패널 제어 버튼 .btn-help-panel
- L[1377–1380](../../upstream/krds/raw/components/component_08_01.html:1377): 패널 본문 .help-conts
- L[1381–1384](../../upstream/krds/raw/components/component_08_01.html:1381): 패널 하단 .related-service
- L[1394–1394](../../upstream/krds/raw/components/component_08_01.html:1394): JS
- L[1413–1417](../../upstream/krds/raw/components/component_08_01.html:1413): krds_helpPanel init() 초기화 및 주요 이벤트 실행
- L[1418–1421](../../upstream/krds/raw/components/component_08_01.html:1418): setupHelpButtons() 도움 패널 버튼 설정
- L[1422–1425](../../upstream/krds/raw/components/component_08_01.html:1422): toggleHelpPanel() 도움 패널 토글

Inline preserved example markup (reference, not the public native API): No inline sample-view markup in this detail.

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Recorded independent decision: Composition kind is accepted. One HelpPanel owner delegates trap/isolation/entry to lower-level native primitives and alone restores the distinct usable panel opener after actual accepted closure.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1440 `../../../resources/js/examples/krds_helpPanel.js`, L1459 `./variable/help_panel.html`. Do not infer unseen contents.
- 5 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Accepted independent resolution

Composition kind is accepted. One HelpPanel owner delegates trap/isolation/entry to lower-level native primitives and alone restores the distinct usable panel opener after actual accepted closure.

## Shared implementation handoff

The exact semantic interface is `HelpPanelContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
