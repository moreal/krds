# Snackbar

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `snackbar`; Korean name 스낵바; export `Snackbar`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_12_06](https://www.krds.go.kr/html/site/component/component_12_06.html); preserved [HTML](../../upstream/krds/raw/components/component_12_06.html). Retrieved `2026-10-29T23:28:06.246Z`; `57980` bytes; SHA-256 `37d9d9357b2e3f020afed315ff700cc2cc0ee3c3aee5df128c62b458fb1b7322`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `message`, `with-action`, `with-icon`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

One bottom-center notification: optional subtle icon left, title, concise body, optional directly related text action (max one, at right), visible Close button. Never stack simultaneous snackbars or cover TabBar/FAB; field errors remain inline.

## Plain semantic API

Choose **host-owned current message and queue**: required `message:{id,title,text,icon?,error?,actionPending?}|null`, initially null; optional one discriminated action `action:{kind:"button",id,label}|{kind:"link",id,label,href,target?,rel?}`, `onAction({id,generation,actionId})` for button actions, `onDismiss({id,reason:close|timeout,generation})` as a dismissal request, durationMs=null (persistent default), and optional `fallbackFocusId`. Host controls message presence, queue/order and actual result; there is no internal enqueue/store/defaultMessage. An action does not implicitly dismiss; host explicitly replaces/removes message after its outcome if appropriate.

Undo/retry is a named native type=button invoking onAction once. Navigation is an actual anchor with href, native Enter/click, modified-click, context-menu and open-new-tab behavior; do not substitute imperative button navigation or cancel browser semantics. Communicate external/new-window meaning when applicable. Both occupy the one right-side text-action slot; never expose two actions or a nested interactive link/button. role=status applies to message text with controls outside the live text. Persistent default, optional timer and host lifecycle policies below are independent choices.

## Keyboard, focus and state transitions

No focus steal. Close is a named native type=button; the optional action uses its discriminated native button/link role. On each explicit Close activation request removal once, but wait for actual host removal before restoring focus or advancing any queue. A rejected request keeps the message, reachable action/Close and current focus; repeated explicit user activation may make a new one-per-action request. Button activation emits onAction only, not a synthetic dismissal. Native link navigation remains native; a route owner handles the destination focus rather than restoring an old-page initiator during departure.

The host's changed ID immediately replaces current content, and null removes it; neither emits a synthetic dismissal or internally advances a queue. Same-ID text/title/error/action kind/label/href updates the currently rendered notification rather than being discarded as a duplicate. Announce changed accessible message text once; identical text is not reannounced because a callback object changed. A removed/replaced focused control restores only after actual accepted rendering: usable saved initiating control, then usable fallbackFocusId, then nearest usable saved ancestor, finally live document body with temporary tabindex=-1 restored afterwards. Do not focus removed, hidden, disabled, inert or old-route controls; do not steal focus when another usable control already received it from the user's native navigation.

Use a generation bound to ID and meaningful accessible content/action/effective-duration revisions. Identical duplicate content/callback identity alone does not restart. Each meaningful generation cancels prior timers and may start a fresh full optional lifetime after actual rendering. Default duration null has no timer. For a configured positive timeout, pause remaining time while hovered, while focus is within the snackbar, while actionPending, or while document hidden; resume only when all gates clear. Increasing configured duration creates a new full lifetime as the explicit extension mechanism. A timeout emits one request per generation; if host rejects, keep it visible with no repeated timeout loop. Stale old-generation callbacks cannot dismiss replacements or same-ID revisions. Cleanup timers/listeners on actual removal/unmount; prop updates, focus movement and reset do not emit fabricated user/dismissal notifications.

## Responsive/mobile requirements

Bottom safe-area/navigation clearance; icon/message/action stay distinguishable and wrap readably on narrow/zoom. Reduced motion removes slide animation.

## Forms, reset and composition

No form/reset/IME state; buttons type=button.

## Asset, integration and composition completion

Host owns queue/current-message presence, undo/retry result, actual navigation destination and optional timer configuration. Required local examples include a functioning undo/retry **button** and a real href **navigation link**, each as the sole action; changed same-ID error/action content; rejected close/timeout; focus-safe accepted removal; and generation-safe replacement/cleanup. Persistent default keeps actions available; configured expiry must remain protected during hover/focus/hidden/pending interaction. No network or upstream toast manager is needed, and logging a navigation callback without an anchor does not satisfy completion.

## Stable parts and states

root, icon, title, message, action, close; open,closed,action-pending,error.

All rendered owned parts use `data-krds-component="snackbar"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Only one snackbar visible.
2. Action executes once and visibly changes local result.
3. Close is named and keyboard reachable.
4. Focus is preserved/restored after removal.
5. Optional timer cannot expire focused action.
6. Duplicate/unmount cleanup safe.
7. No overlap with bottom navigation.
8. Navigation action is a real named href link with native modified-click and context-menu behavior, while undo or retry is a separate-case native button and only one action is rendered.
9. Same-ID text, error or action revision updates the current snackbar rather than disappearing as a deduplicated message.
10. Rejected explicit close or timeout keeps the message and focus until actual host removal, with no internal queue advancement.
11. Host replacement or removal cancels previous generation without synthetic dismissal; stale old-generation timer cannot affect new or same-ID revised content.
12. Optional timer pauses remaining time across hover, focus, pending action and hidden document, while persistent default starts no timer.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`snackbar--message`, `snackbar--with-action`, `snackbar--with-icon`, `snackbar--undo-local`, `snackbar--action-error`, `snackbar--close-focused`, `snackbar--timer-cleanup`, `snackbar--narrow`, `snackbar--navigation-link`, `snackbar--same-id-error-action-update`, `snackbar--dismissal-rejected`, `snackbar--host-queue-replacement`, `snackbar--generation-timer-pauses`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[864–864](../../upstream/krds/raw/components/component_12_06.html:864): 구조
- L[870–870](../../upstream/krds/raw/components/component_12_06.html:870): 1. 컨테이너 메시지를 담고 있는 영역으로 배경을 구분하는 요소
- L[871–872](../../upstream/krds/raw/components/component_12_06.html:871): 2. 아이콘(선택) 메시지의 의미를 담은 관련도 높은 간단한 아이콘
- L[873–874](../../upstream/krds/raw/components/component_12_06.html:873): 3. 제목 메시지 제목
- L[875–876](../../upstream/krds/raw/components/component_12_06.html:875): 4. 본문 구체적인 설명 텍스트와 사용자의 추가 행동에 대한 텍스트링크를 제공하는 영역
- L[877–878](../../upstream/krds/raw/components/component_12_06.html:877): 5. 작업 버튼(선택) 작업의 세부 정보 표시. 텍스트 버튼 사용
- L[879–880](../../upstream/krds/raw/components/component_12_06.html:879): 6. 닫기 버튼 사용자가 스낵바을 닫을 수 있게 하는 버튼 요소로 대개 'X' 아이콘으로 표현됨.

### 용례

- L[888–888](../../upstream/krds/raw/components/component_12_06.html:888): 용례
- L[890–890](../../upstream/krds/raw/components/component_12_06.html:890): 사용하기 적합한 경우
- L[895–897](../../upstream/krds/raw/components/component_12_06.html:895): 되돌리기, 재시도, 목록 이동 등 사용자가 즉시 수행할 수 있는 간단한 조치를 안내 메시지와 함께 제공하는 경우 사용이 적합하다.
- L[892–899](../../upstream/krds/raw/components/component_12_06.html:892): 사용자에게 피드백과 선택적 조치를 안내하는 경우 되돌리기, 재시도, 목록 이동 등 사용자가 즉시 수행할 수 있는 간단한 조치를 안내 메시지와 함께 제공하는 경우 사용이 적합하다.
- L[903–903](../../upstream/krds/raw/components/component_12_06.html:903): 사용하기 적합하지 않은 경우
- L[908–908](../../upstream/krds/raw/components/component_12_06.html:908): 긴급공지 혹은 모달을 사용하는 것이 적합하다.
- L[905–910](../../upstream/krds/raw/components/component_12_06.html:905): 중요하거나 긴급한 메시지를 전달해야 하는 경우 긴급공지 혹은 모달을 사용하는 것이 적합하다.
- L[914–914](../../upstream/krds/raw/components/component_12_06.html:914): 스낵바는 한 문장 이내의 짧은 설명을 제공할 때 사용하기 적합하다. 더 긴 설명이 필요하다면 모달을 사용하는 것이 적합하다.
- L[911–916](../../upstream/krds/raw/components/component_12_06.html:911): 긴 설명을 제공해야 하는 경우 스낵바는 한 문장 이내의 짧은 설명을 제공할 때 사용하기 적합하다. 더 긴 설명이 필요하다면 모달을 사용하는 것이 적합하다.
- L[920–920](../../upstream/krds/raw/components/component_12_06.html:920): 개별 입력 양식에 대한 메시지는 입력 폼이 제공되는 화면의 각 요소에 인라인 텍스트 방식으로 제공하는 것이 사용자가 인지하기에 더 적합하다.
- L[917–922](../../upstream/krds/raw/components/component_12_06.html:917): 개별 입력 양식에 대한 오류, 성공, 경고 메시지를 제공하는 경우 개별 입력 양식에 대한 메시지는 입력 폼이 제공되는 화면의 각 요소에 인라인 텍스트 방식으로 제공하는 것이 사용자가 인지하기에 더 적합하다.

### 사용성 가이드라인

- L[930–930](../../upstream/krds/raw/components/component_12_06.html:930): 사용성 가이드라인
- L[933–933](../../upstream/krds/raw/components/component_12_06.html:933): 스낵바는 화면 중앙 하단에 표시한다.
- L[934–936](../../upstream/krds/raw/components/component_12_06.html:934): 스낵바는 화면의 중앙 하단에 다른 요소 위에 배치하며, 하단 탭 바나 플로팅 버튼 등 주요 탐색 요소와 겹치지 않게 표시하여야 한다.
- L[940–940](../../upstream/krds/raw/components/component_12_06.html:940): 명확하고 간결하게 피드백 메시지를 제공한다.
- L[941–943](../../upstream/krds/raw/components/component_12_06.html:941): 사용자 행동에 대해 어떤 결과가 발생하였는지 명확하고 간단하게 설명하여 사용자가 빠르게 인지할 수 있게 해주어야 한다. 메시지는 한 문장 이내로 짧게 제공하는 것이 적정하며, 두 문장 이상의 중요 정보를 전달해야 하는 경우는 모달을 사용하는 것이 적합하다.
- L[947–947](../../upstream/krds/raw/components/component_12_06.html:947): 한 페이지에 하나의 스낵바만 표시 한다.
- L[948–950](../../upstream/krds/raw/components/component_12_06.html:948): 여러개의 스낵바를 한 페이지에서 겹치거나 쌓아서 표시하지 않는다. 여러개의 스낵바를 사용할 경우 사용자의 주의를 분산시키고 담을 줄 수 있다.
- L[954–954](../../upstream/krds/raw/components/component_12_06.html:954): 메시지와 직접 관련된 추가 행동을 위한 작업 버튼을 필요 시 제공한다.
- L[955–957](../../upstream/krds/raw/components/component_12_06.html:955): 메시지와 함께 추가 행동 제공이 사용자에게 필요한 경우 텍스트 형태의 작업 버튼을 제공 한다. 버튼은 최대 1개만 제공하며, 메시지 우측에 구분하여 제공한다.
- L[961–961](../../upstream/krds/raw/components/component_12_06.html:961): 아이콘은 반드시 필요한 경우에만 사용한다.
- L[962–964](../../upstream/krds/raw/components/component_12_06.html:962): 메시지의 의미 전달 강화를 목적으로 필요 시 메시지 좌측에 아이콘을 배치하여 사용한다. 아이콘은 시각적으로 부각되지 않게 사용하며, 메시지 톤과 일관되게 사용하는 것이 적합하다.

Inline preserved example markup (reference, not the public native API): No inline sample-view markup in this detail.

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Current-message/queue authority, update generations, request-only dismissal and the button/link action discriminator are now concrete independent API choices. Official single-visible/one-related-action structure remains binding; default persistent timing is not claimed as official duration guidance.
- 1 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `SnackbarContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
