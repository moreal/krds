# BackButton

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `back-button`; Korean name 뒤로가기 버튼; export `BackButton`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_12_02](https://www.krds.go.kr/html/site/component/component_12_02.html); preserved [HTML](../../upstream/krds/raw/components/component_12_02.html). Retrieved `2026-10-29T23:28:05.968Z`; `55546` bytes; SHA-256 `08604e589588973c18a57db8c3bfde067b1e3b627691151d44592ad26c825bbf`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `integration`. Recommend integration from L898–927 history destination, warning and system/in-app back consistency; router/history owner required.

Supported native cases (variant and state axes): `default`, `dirty-confirmation`, `no-history-fallback`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Top-bar left back control beside current screen title. Returns to previous screen (or defined parent), visually distinct from cancel/close. Warn before loss of in-progress input; system/browser back and in-app behavior should align where host can control.

## Plain semantic API

Independent API: label="뒤로가기", onBackRequest({reason}), canGoBack, fallbackHref?, dirty=false, requestConfirmation supplied by host. Type=button for history action; explicit parent destination uses real Link variant. Never call history.back blindly when no known in-app entry.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Independent native policy: button Enter/Space/click once; dirty confirmation opens reviewed Modal, cancel retains page/values/focus, confirm invokes host navigation once. Destination focus and history/gesture interception belong router/host.

## Responsive/mobile requirements

Left position and title remain readable narrow; adequate target does not collide with system safe area. This is web-applicable context, not browser UI replacement.

## Forms, reset and composition

No own form value/reset; button never submits or clears form. Host dirty state observes form/IME accurately; composing text must not be lost by premature navigation.

## Asset, integration and composition completion

Recommend component→integration: host owns router/history, browser-back guard, fallback and data-loss policy. Completion needs local navigation stack and unsaved-form mock, including cancelled confirmation; no real page departure needed in stories.

## Stable parts and states

root, icon, label; disabled,pending-confirmation. The adjacent page title belongs to the host page composition and is not an owned BackButton part.

All rendered owned parts use `data-krds-component="back-button"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Back request uses expected prior/parent route.
2. Dirty cancel retains form and focus.
3. Confirmed back invokes navigation once.
4. No-history uses known fallback instead of external exit.
5. Host browser/in-app back guard shares decision.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Independent local specimen policy

The browser/in-app loss-guard outcome starts with actual `dirty:true` input. The host presents its real pending confirmation modal before any navigation; cancel or Escape retains input and route, while confirmation permits the requested destination. `expectedConfirmationResult` is an assertion marker, never an eager host decision.

## Required native stories

`back-button--default`, `back-button--dirty-confirmation`, `back-button--cancel-navigation`, `back-button--no-history-fallback`, `back-button--narrow`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[864–864](../../upstream/krds/raw/components/component_12_02.html:864): 구조
- L[870–870](../../upstream/krds/raw/components/component_12_02.html:870): 1. 뒤로가기 버튼 이전 화면으로 돌아가는 버튼
- L[871–872](../../upstream/krds/raw/components/component_12_02.html:871): 2. 제목 현재 화면의 제목을 표시

### 사용성 가이드라인

- L[880–880](../../upstream/krds/raw/components/component_12_02.html:880): 사용성 가이드라인
- L[883–883](../../upstream/krds/raw/components/component_12_02.html:883): 뒤로가기 버튼은 항상 상단바 좌측에 표시한다.
- L[884–886](../../upstream/krds/raw/components/component_12_02.html:884): 뒤로가기는 상단바 좌측에 위치함으로써 이전 화면으로 이동을 자연스럽게 의미 할 수 있도록 한다.
- L[898–898](../../upstream/krds/raw/components/component_12_02.html:898): 이전 화면으로의 이동을 기본으로 한다.
- L[899–900](../../upstream/krds/raw/components/component_12_02.html:899): 뒤로가기는 기본적으로 직전에 보던 화면(또는 상위 단계)으로 이동해야 한다, 동일 위치에 닫기, 취소 버튼을 위치 시켜 버튼 본연의 역할이 겹치지 않도록 명확이 구분하여 사용한다.
- L[913–913](../../upstream/krds/raw/components/component_12_02.html:913): 사용자가 이동을 예측 가능하도록 한다.
- L[914–915](../../upstream/krds/raw/components/component_12_02.html:914): 사용자가 버튼을 누르면 어디로 이동할지 예측이 가능하도록 설계한다.
- L[919–919](../../upstream/krds/raw/components/component_12_02.html:919): 작성 중인 내용이 사라지는 경우에는 항상 경고하여야 한다.
- L[920–921](../../upstream/krds/raw/components/component_12_02.html:920): 신청 프로세스나 정보를 입력하면 화면에서의 동작은 작성 중인 내용이 유실될 가능성이 있는 모든 상황에서, 반드시 사전 경고를 제공하여 사용자가 계속 진행 여부를 스스로 결정할 수 있도록 하여야 한다.
- L[925–925](../../upstream/krds/raw/components/component_12_02.html:925): 시스템 뒤로가기와 앱 내 뒤로가기는 최대한 동일하게 동작하여야 한다.
- L[926–927](../../upstream/krds/raw/components/component_12_02.html:926): 같은 화면에서 상단 뒤로가기 버튼과 시스템 back/제스처를 사용했을 때, 서로 다른 화면으로 이동하거나, 하나는 팝업을 닫고 하나는 페이지를 이탈하는 등 상이한 결과를 초래해서는 안 된다.

Inline preserved example markup (reference, not the public native API): No inline sample-view markup in this detail.

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Official web handling of browser history interception is unspecified; no promise that a library button can intercept OS gestures itself.
- 5 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `BackButtonContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
