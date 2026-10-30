# CoachMark

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `coach-mark`; Korean name 코치마크; export `CoachMark`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_08_04](https://www.krds.go.kr/html/site/component/component_08_04.html); preserved [HTML](../../upstream/krds/raw/components/component_08_04.html). Retrieved `2026-10-29T23:28:05.101Z`; `80268` bytes; SHA-256 `754efe232a5733c103dcdb25f572978409790aeae323ac1afc943eb497845b23`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `composition`. Recommend composition from L889–898 spotlight+step/actions structure, L982–984 verified target action advancement and L1184–1197 TutorialPanel focus return.

Supported native cases (variant and state axes): `single`, `multi-step`, `action-gated`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

The **actual related target/control** is immediately followed by the current coach popover in logical DOM/accessibility order ([official L1123–1124](../../upstream/krds/raw/components/component_08_04.html:1123)). The spotlight is only aria-hidden visual decoration around that target; a remote overlay/spotlight followed by a popover does not satisfy target→instruction order. Register the real target plus an adjacent insertion boundary in the same relevant DOM/accessibility root; render the popover natively there. Do not move, replace, clone or reparent a live target/form input just to create this order. A portal is allowed only into that registered adjacent same-root boundary with order proven; a decorative body-level portal is insufficient.

Popover contains step/title, concise instructions, current/total and action row Stop, Previous, Next. No Previous on first; last Next becomes Finish; single becomes Confirm. One visible coach at a time; title ideally one line/instructions <=3; recommended <=4/page and max15 steps. Native target operation, its label relationships, value, focus/caret and IME remain intact throughout an action-gated step.

## Plain semantic API

Independent API: steps {id,targetId,title,instruction,requiresAction?}[], registered adjacent popover insertion boundaries, open/defaultOpen=false, stepId/defaultStepId, onStepChange({id,reason}), onOpenChange, `startActionId`, `fallbackFocusId?`, and `onStop({reason,running:false,returnTo:{panel:"tutorial",open:true,startActionId}})` when linked to TutorialPanel. The registration contract carries plain IDs/relationships; each adapter provides its own native insertion mechanism without foreign-renderer wrappers. For steps with requiresAction, supply onTargetAction({stepId,targetId}): boolean|Promise<boolean>. It is called only after the corresponding real registered target action has executed, with plain IDs and no native Event. The native host closure validates actual committed application state; only true authorizes one next-step request. False, rejection or absence never advances. A requiresAction configuration without a verifier is invalid (TypeError). Invoke after native target handlers/commit, not from a synthetic spotlight click. While a verification is pending, coalesce duplicate activation for that same step. Bind it to the actual open/step/target generation: close, step change, route change, target removal or unmount invalidates pending resolution. A stale true never advances or restores focus. Controlled declined advancement retains the current step; a later distinct real action can request again. Mount, props and focus never invoke the verifier. This is an independent concrete host-verification API preserving the official real-action outcome.

Controlled/default and no-mode-switch rules follow [pilot conventions](./README.md). In linked mode the tutorial coordinator derives CoachMark presentation from committed running/step/target state, and the joint onStop request is the only Stop transaction event. For a standalone CoachMark, Stop requests actual open=false through its single owner; rejection leaves it open and does not restore focus. Mount/props/focus/cleanup emit zero synthetic user-change events.

## Keyboard, focus and state transitions

User requested only; never auto-run at page load. Tab traverses the real target and current popover's controls in their actual reading sequence without blocking a required target action. Independent entry policy focuses the popover heading on an accepted step change; Escape requests Stop except during composition or when an inner widget already handled it. Offscreen existing target may scroll into view; missing target suspends presentation with visible recovery/Stop, never a fabricated target coordinate or substituted control.

**Joint TutorialPanel/CoachMark Stop transaction (independent coordination policy preserving the official preferred destination):** A linked CoachMark's visible/open state is derived by the tutorial coordinator from committed running/task/target state, rather than maintained by a second independent close owner. Stop emits one `onStop({reason,running:false,returnTo:{panel:"tutorial",open:true,startActionId}})` transaction request to that owner; do not also emit a duplicate CoachMark onOpenChange for the same Stop. An uncontrolled coordinator commits it synchronously; controlled ownership ends the tutorial only when running=false is actually accepted and the coach presentation has actually closed/been removed. Until acceptance, retain the running UI/current focus and do not restore. The owner must commit any accepted Tutorial-tab/panel exposure together with that stop transaction; a partially accepted exposure is explicit in the resulting committed tab/open state, not guessed from timers.

The request asks to select the Tutorial tab, open/expose its panel, and render/enable the preferred startActionId. After the actual stopped/closed transition and completed native panel rendering, the **single Stop restoration coordinator first resolves the actual topmost active modal**, including a narrow Help modal that remains selected after the host rejects the Tutorial-tab request. A focus candidate must be mounted, visible, enabled, focusable and non-inert; if a modal is still active it must additionally be inside that actual topmost modal. Prefer the startActionId whenever it is actually usable under those rules. Never focus through a closed modal, hidden tab, rejected panel-open state, active-modal boundary or stale target.

If preferred-start exposure is declined or the start action is removed/unusable **and any modal remains actually open**, select a usable fallbackFocusId inside that modal, otherwise its first usable internal interactive target in logical DOM order, otherwise its own focusable container (tabindex=-1 with prior value preserved). The outside panel opener, saved outside initiating control/ancestor and document body are not candidates while that trap remains active, even when no named fallback was supplied. Do not remove isolation, disable the trap, force a controlled tab/open prop or invoke a second private restoration owner to manufacture an outside target. If a candidate/container is removed before focus, re-resolve the actual committed topmost modal instead of using a stale outside fallback.

Only **when no modal remains actually active after committed cleanup** may the fallback use the usable persistent tutorial panel opener, then supplied fallbackFocusId, then usable saved initiating control/nearest usable ancestor, finally live document body with temporary tabindex=-1 restored afterwards. A requested but rejected modal closure never qualifies; outside focus must await actual accepted closure and cleanup. This modal-aware resolution also applies during route removal/teardown if another modal remains active. In the concrete accepted-Stop state running=false/open=true with Help still selected, hidden or removed Tutorial start and inert outside controls, focus therefore remains in that Help modal on an internal target/container, with its trap and isolation intact.

The same Stop coordinator owns this one resolution and delegates modal-shell entry/return to prevent competing focus work; public Modal returnFocusId rules remain unchanged. Rejected Stop still performs no restoration. Later asynchronous tab/open changes must not replay a completed Stop restoration; any later accepted ordinary modal close uses its existing single close/restoration owner, rather than replaying this earlier Stop fallback.

## Responsive/mobile requirements

Consistent popup width across tour, collision-aware to remain onscreen without covering target; reduced-motion removes spotlight animation/smooth scroll. Target resize/scroll updates placement; observers clean on close.

## Forms, reset and composition

No form/reset; only host validated events advance real form tasks, composing input never counts as completion.

## Asset, integration and composition completion

Independent API: composition completion includes actual registered target→popover DOM/accessibility order, spotlight geometry, ordered task state and joint TutorialPanel return. Host supplies the adjacent native insertion boundary and keeps the target operable; it owns route/task success, coordinated Stop/exposure state and competing-layer suppression. An action-gated local story must operate the real native child form control while its value/label/IME behavior remains intact, then visibly advance from the verified action. A detached overlay alone is not completion. Missing insertion boundary/target is a configuration or suspended-target outcome, never permission to clone/move the control.

## Stable parts and states

root, spotlight, popover, title, instruction, position, actions, stop, previous, next; open,closed,current-step,waiting,missing-target.

All rendered owned parts use `data-krds-component="coach-mark"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Explicit start required.
2. First/last/single action labels/order correct.
3. Action-gated step advances only on validated host event.
4. Accepted Stop returns to the actually exposed usable start action, with documented fallback if exposure or target is unavailable.
5. Removed/route-changed target suspends cleanly.
6. Offscreen target and narrow edge stay visible.
7. Only one coach/notification layer.
8. The real target or native control is immediately followed by its popover in DOM and accessibility reading order, while spotlight decoration contributes no substitute target.
9. Action-gated native target retains label, value, focus and IME during adjacent popover rendering without relocation or cloning.
10. Stop after fold, Help-tab switch or narrow presentation exposes and focuses the actual usable start action, or takes a documented usable fallback after accepted closure.
11. Rejected controlled Stop does not restore focus or end the running presentation; removed start action and route teardown never focus hidden or stale content.
12. Accepted narrow Stop running=false/open=true with Help retained after rejected Tutorial-tab change and a hidden or removed start keeps focus on a usable target or container inside the actual topmost modal, preserving its isolation and trap without outside or body restoration.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`coach-mark--single`, `coach-mark--multi-step`, `coach-mark--action-gated`, `coach-mark--offscreen-target`, `coach-mark--missing-target`, `coach-mark--route-change`, `coach-mark--reduced-motion`, `coach-mark--target-reading-order`, `coach-mark--action-native-control`, `coach-mark--stop-hidden-panel`, `coach-mark--stop-help-tab`, `coach-mark--stop-fallback-rejected`, `coach-mark--stop-partial-narrow-help`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_08_04.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_08_04.html:889): 1. 스포트라이트 지시 사항 제공을 위해 주의를 집중시키고자 하는 사용자 인터페이스 또는 콘텐츠 섹션. 사용자 인터페이스 또는 콘텐츠 섹션 주변을 둘러싼 외곽선과 애니메이션을 통해 주목도를 높임
- L[893–893](../../upstream/krds/raw/components/component_08_04.html:893): a. 제목 과업 수행 단계 번호와 과업 명칭 텍스트를 제공함
- L[894–894](../../upstream/krds/raw/components/component_08_04.html:894): b. 지시 사항 과업 수행을 위해 사용자가 확인하거나 따라야 할 사항을 안내하는 텍스트
- L[895–895](../../upstream/krds/raw/components/component_08_04.html:895): c. 단계 식별자 전체 단계와 현재 수행 중인 단계 번호를 분수 형식으로 표시함
- L[896–896](../../upstream/krds/raw/components/component_08_04.html:896): d. 액션 버튼 건너뛰기, 이전, 다음 버튼이 제공됨
- L[890–898](../../upstream/krds/raw/components/component_08_04.html:890): 2. 코치마크 팝오버 a. 제목 과업 수행 단계 번호와 과업 명칭 텍스트를 제공함 b. 지시 사항 과업 수행을 위해 사용자가 확인하거나 따라야 할 사항을 안내하는 텍스트 c. 단계 식별자 전체 단계와 현재 수행 중인 단계 번호를 분수 형식으로 표시함 d. 액션 버튼 건너뛰기, 이전, 다음 버튼이 제공됨

### 용례

- L[906–906](../../upstream/krds/raw/components/component_08_04.html:906): 용례
- L[908–908](../../upstream/krds/raw/components/component_08_04.html:908): 사용하기 적합한 경우
- L[910–910](../../upstream/krds/raw/components/component_08_04.html:910): 사용자를 안내하고 플로(Flow) 단계의 전체적인 순서를 학습시키기 위해 사용하는 경우
- L[911–911](../../upstream/krds/raw/components/component_08_04.html:911): 사용자가 사용 가능한 기능에 대한 개요를 파악할 수 있도록 하기 위해 사용하는 경우

### 사용성 가이드라인

- L[919–919](../../upstream/krds/raw/components/component_08_04.html:919): 사용성 가이드라인
- L[922–922](../../upstream/krds/raw/components/component_08_04.html:922): 코치마크는 정보를 제공하고자 하는 요소 주변에 배치한다.
- L[923–923](../../upstream/krds/raw/components/component_08_04.html:923): 정보를 제공하고자 하는 사용자 인터페이스 또는 콘텐츠 섹션 옆에 배치하여 관련 요소와의 연관성이 명확하게 인지될 수 있도록 한다.
- L[926–926](../../upstream/krds/raw/components/component_08_04.html:926): 팝오버 영역이 본문의 중요 콘텐츠를 가리지 않도록 표현한다.
- L[927–927](../../upstream/krds/raw/components/component_08_04.html:927): 팝오버 영역이 안내를 제공하고자 하는 본문 콘텐츠 요소를 가리지 않도록 적절한 표시 방향을 설정한다.
- L[934–934](../../upstream/krds/raw/components/component_08_04.html:934): 팝오버 영역의 너비를 일관되게 유지한다.
- L[935–935](../../upstream/krds/raw/components/component_08_04.html:935): 코치마크 팝오버 영역의 너비는 최대 지시 사항 텍스트 길이를 고려하여 결정한다. 하나의 과업에 대해 제공되는 모든 코치마크 팝오버는 동일한 너비를 갖도록 표현해야 한다.
- L[938–938](../../upstream/krds/raw/components/component_08_04.html:938): 코치마크의 제목과 지시 사항은 간결하고 명확하게 작성한다.
- L[939–939](../../upstream/krds/raw/components/component_08_04.html:939): 코치마크는 관련 요소에 대한 간결한 설명을 제공하여 사용자의 부담을 줄이고 과업의 완수를 격려해야 한다. 가능한 한 제목은 1줄을 유지하고 지시 사항은 3줄 이내로 작성한다.
- L[942–942](../../upstream/krds/raw/components/component_08_04.html:942): 지나치게 많은 코치마크를 사용하지 않는다.
- L[943–944](../../upstream/krds/raw/components/component_08_04.html:943): 한 페이지에 4개 이하의 코치마크를 사용하는 것이 가장 이상적이며, 최대 15단계를 넘지 않도록 한다. 최적의 코치마크 수를 유지하기 위해 각 코치마크가 사용자에게 도움 되는 정보를 포함하고 있는지 점검해야 한다. 불필요한 코치마크는 삭제하고 가능한 경우 메시지를 합치되, 사용자가 거쳐야 하는 핵심적인 과업 단계가 누락되지 않도록 유의한다.
- L[947–947](../../upstream/krds/raw/components/component_08_04.html:947): 코치마크는 전체 과업 플로(Flow)를 고려하여 논리적인 순서로 제공한다.
- L[948–948](../../upstream/krds/raw/components/component_08_04.html:948): 사용자의 실제 이용 플로(Flow)를 반영하여 논리적인 순서에 따라 단계가 진행될 수 있도록 구성해야 한다.
- L[951–951](../../upstream/krds/raw/components/component_08_04.html:951): 한 화면에 여러 개의 코치마크가 표시되지 않도록 한다.
- L[952–952](../../upstream/krds/raw/components/component_08_04.html:952): 여러 개의 코치마크가 동시에 표시되는 것은 코치마크의 제공 목적과 이용 흐름에 적합하지 않다.
- L[955–955](../../upstream/krds/raw/components/component_08_04.html:955): 코치마크가 표시된 상태에서 다른 메시지가 표시되지 않도록 한다.
- L[956–956](../../upstream/krds/raw/components/component_08_04.html:956): 코치마크가 제공될 때 페이지에 다른 알림이나 배너 등의 레이어가 실행되지 않도록 구성하여 사용자가 코치마크에서 안내하고 있는 과업에 집중할 수 있도록 한다.
- L[959–959](../../upstream/krds/raw/components/component_08_04.html:959): 지시 사항 내부 링크는 새 창으로 실행한다.
- L[960–960](../../upstream/krds/raw/components/component_08_04.html:960): 지시 사항에 참고 링크가 포함되어 있는 경우에는 항상 새 창으로 링크를 실행시켜 사용자의 현재 과업 맥락이 중단되지 않도록 한다.
- L[963–963](../../upstream/krds/raw/components/component_08_04.html:963): 모든 단계에서 액션 버튼을 일관성 있는 순서로 배치하고 동일한 레이블을 사용한다.
- L[964–967](../../upstream/krds/raw/components/component_08_04.html:964): 모든 단계에서 액션 버튼은 왼쪽부터 ’그만보기’, ‘이전’, ‘다음’ 순서로 제공한다. 단일 단계의 코치마크에서 ‘다음’ 버튼의 레이블은 ‘확인’으로 사용한다. 여러 단계의 코치마크에서 첫 번째 단계는 ‘이전’ 버튼을 사용하지 않으며, 마지막 단계에서 ‘다음’ 버튼의 레이블은 ‘마치기’로 제공한다.
- L[974–974](../../upstream/krds/raw/components/component_08_04.html:974): 액션 버튼을 적절한 강조 수준으로 표현한다.
- L[975–975](../../upstream/krds/raw/components/component_08_04.html:975): ’그만보기’, ‘이전’ 버튼은 텍스트 버튼 스타일을, ‘다음’, ‘마치기’ 버튼은 고스트 버튼 스타일을 사용한다. ‘다음’, ‘마치기’ 버튼은 본문 액션 버튼의 강조 수준보다 낮아야 한다.
- L[982–982](../../upstream/krds/raw/components/component_08_04.html:982): 사용자의 특정 행동 이후 다음 단계의 코치마크에 접근 가능한 경우, 사용자의 행동 완수 여부를 시스템이 확인하도록 한다.
- L[983–984](../../upstream/krds/raw/components/component_08_04.html:983): 코치마크에서 사용자가 지시 사항에 따라 특정 행동을 하도록 요구하는 경우, 사용자가 해당 행동을 완수했을 때 자동으로 다음 단계의 코치마크로 넘어가도록 한다. 사용자 스스로가 해당 행동을 수행하였음을 확인하는 것이 아니라 시스템에서 사용자가 정확한 행동을 수행하였는지 확인함으로써 사용자가 부적절하게 다음 단계에 접근하는 오류를 방지해야 한다. 이 경우 ‘그만보기’ 버튼을 제공하는 한, 다음 버튼을 제공하지 않아도 된다.

### 플랫폼에 대한 고려 사항

- L[992–992](../../upstream/krds/raw/components/component_08_04.html:992): 플랫폼에 대한 고려 사항
- L[995–995](../../upstream/krds/raw/components/component_08_04.html:995): 모든 화면 크기에서 팝오버 영역이 완전히 표시되는지 확인한다.
- L[996–996](../../upstream/krds/raw/components/component_08_04.html:996): 특정 너비에서 코치마크 팝오버 영역이 시각적으로 확인할 수 없는 화면 밖의 영역에 배치되지 않는지 확인하여 문제가 발견된 경우 적절한 영역으로 배치를 변경해야 한다.

### 접근성 가이드라인

- L[1103–1103](../../upstream/krds/raw/components/component_08_04.html:1103): 접근성 가이드라인
- L[1106–1106](../../upstream/krds/raw/components/component_08_04.html:1106): 스포트라이트와 인접 배경 간 명도 대비를 3:1 이상으로 제공한다.
- L[1107–1107](../../upstream/krds/raw/components/component_08_04.html:1107): 사용자가 집중해야 할 요소를 명확하게 인지할 수 있도록 스포트라이트와 인접 배경의 명도 대비를 3:1 이상으로 제공해야 한다.
- L[1114–1114](../../upstream/krds/raw/components/component_08_04.html:1114): 코치마크는 사용자가 요청한 경우에만 실행되어야 한다.
- L[1115–1115](../../upstream/krds/raw/components/component_08_04.html:1115): 페이지가 로딩되자마자 특정 코치마크가 활성화되는 등 사용자가 의도하지 않는 상황에서 자동으로 실행되어서는 안 된다.
- L[1123–1123](../../upstream/krds/raw/components/component_08_04.html:1123): 관련 요소와 코치마크 팝오버 콘텐츠를 적절한 순서로 제공한다.
- L[1124–1124](../../upstream/krds/raw/components/component_08_04.html:1124): 스크린 리더 사용자가 코치마크 팝오버 콘텐츠에 논리적인 순서로 접근할 수 있도록 관련 있는 요소의 바로 다음 요소로 제공해야 한다.

### 상호작용 가이드라인

- L[1136–1136](../../upstream/krds/raw/components/component_08_04.html:1136): 상호작용 가이드라인
- L[1138–1138](../../upstream/krds/raw/components/component_08_04.html:1138): 팝오버 내부 콘텐츠 탐색
- L[1156–1159](../../upstream/krds/raw/components/component_08_04.html:1156): Tab 코치마크 팝오버가 활성화된 상태에서 내부 컨트롤 요소를 순차적으로 탐색한다.
- L[1166–1166](../../upstream/krds/raw/components/component_08_04.html:1166): 코치마크 비활성화
- L[1184–1190](../../upstream/krds/raw/components/component_08_04.html:1184): Click 그만보기 버튼을 Click 하면 코치마크 팝오버가 숨겨진다. 키보드 초점은 따라하기 패널에서 따라하기를 실행하는 버튼으로 이동한다.
- L[1191–1197](../../upstream/krds/raw/components/component_08_04.html:1191): Enter, Space 그만보기 버튼이 초점을 가진 상태에서 Enter 또는 Space 키를 누르면 코치마크 팝오버가 숨겨진다. 키보드 초점은 따라하기 패널에서 따라하기를 실행하는 버튼으로 이동한다.

### 예시

- L[1216–1216](../../upstream/krds/raw/components/component_08_04.html:1216): 예시
- L[1220–1220](../../upstream/krds/raw/components/component_08_04.html:1220): 기본
- L[1231–1231](../../upstream/krds/raw/components/component_08_04.html:1231): 따라하기 가이드
- L[1251–1251](../../upstream/krds/raw/components/component_08_04.html:1251): 코치 마크 내용
- L[1263–1263](../../upstream/krds/raw/components/component_08_04.html:1263): 기본 코드 확인하기

### 마크업 가이드

- L[1335–1335](../../upstream/krds/raw/components/component_08_04.html:1335): 마크업 가이드
- L[1338–1338](../../upstream/krds/raw/components/component_08_04.html:1338): CSS 선택자
- L[1355–1358](../../upstream/krds/raw/components/component_08_04.html:1355): 전체영역 .krds-coach-mark
- L[1359–1362](../../upstream/krds/raw/components/component_08_04.html:1359): 팝오버 .coach-balloon

Inline preserved example markup (reference, not the public native API): L[1225–1257](../../upstream/krds/raw/components/component_08_04.html:1225)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Recorded independent decision: Composition kind is accepted. Real-target adjacent native insertion, verified target actions and the single modal-aware Stop coordinator are mandatory; native host wiring remains a separate evidence gate.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1268 `../../code/coach_mark.html`, L1377 `./variable/coach_mark.html`. Do not infer unseen contents.
- 4 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Accepted independent resolution

Composition kind is accepted. Real-target adjacent native insertion, verified target actions and the single modal-aware Stop coordinator are mandatory; native host wiring remains a separate evidence gate.

## Shared implementation handoff

The exact semantic interface is `CoachMarkContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
