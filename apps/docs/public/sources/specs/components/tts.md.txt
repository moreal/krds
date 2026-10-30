# TTS

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `tts`; Korean name 음성지원; export `TTS`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_08_06](https://www.krds.go.kr/html/site/component/component_08_06.html); preserved [HTML](../../upstream/krds/raw/components/component_08_06.html). Retrieved `2026-10-29T23:28:05.240Z`; `74209` bytes; SHA-256 `a097e58a8d1692f196188d0bca075636c5c7125083834e47e71313842536e280`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `integration`; accepted project completion kind `integration`. Retain integration: L900–911 scopes page/region summaries, L972–980 user-controlled playback, L1341–1346 function signature; engine is host-owned.

Supported native cases (variant and state axes): `page`, `region`, `play`, `icon`, `xsmall`, `small`, `medium`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Named speech-start button adjacent to page title or region and explicit pause/stop controls. Read a concise purpose/flow summary, not indiscriminate whole-page text or duplication of screen reader. No automatic playback on mount/navigation.

## Plain semantic API

Independent API: summary, locale, state=idle|playing|paused|error, onRequest({action:play|pause|resume|stop,summary,locale}), label, size=small, iconOnly=false. Host confirms state; component does not invoke speech engine from prop change.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Native buttons Enter/Space/click once; pause and stop always available while playing. State is exposed in text/control names without competing automatic speech/live announcements. Independent policy: disable Play when unsupported and show explanation; cleanup issues stop request on route/unmount through host lifecycle.

## Responsive/mobile requirements

Visible labels recommended; icon-only has functional accessible name. Page/region placement remains attached to correct summary on narrow screens.

## Forms, reset and composition

No form/reset/IME behavior; controls type=button.

## Asset, integration and composition completion

Integration completion includes native controls + documented host driver boundary + explicit local mock supporting play/pause/stop/error. Host owns SpeechSynthesis/service, voices, consent/runtime support and actual audio. No network/real speech required by stories.

## Stable parts and states

root, play, pause, stop, label, status; idle,playing,paused,error,unsupported.

All rendered owned parts use `data-krds-component="tts"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Mount/route changes never autoplay.
2. Each request emitted once with correct region summary.
3. Pause/stop remain reachable.
4. Mock confirmed state updates labels.
5. Unsupported/error visible and actionable.
6. Driver disposed/stopped on teardown.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Independent canonical default names

Use the actual supplied label in control names. The canonical paused/resume action name is “{label} 다시 재생”; activating it still requests resume and preserves the current playback position rather than restarting. Error retry uses the same “{label} 다시 재생” name with its existing retry request semantics. This is independent default UI wording, not a new action/prop or an instruction to reset playback; supplied labels remain authoritative.

## Required native stories

`tts--page`, `tts--region`, `tts--play-pause-stop-mock`, `tts--icon`, `tts--sizes`, `tts--unsupported`, `tts--error`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[882–882](../../upstream/krds/raw/components/component_08_06.html:882): 구조
- L[888–888](../../upstream/krds/raw/components/component_08_06.html:888): 1. 음성 안내 아이콘 버튼과 및 텍스트 레이블
- L[889–889](../../upstream/krds/raw/components/component_08_06.html:889): 2. 음성 제어 음성 안내를 제어할 수 있는 버튼

### 유형

- L[897–897](../../upstream/krds/raw/components/component_08_06.html:897): 유형
- L[900–900](../../upstream/krds/raw/components/component_08_06.html:900): 페이지 단위 음성지원
- L[901–902](../../upstream/krds/raw/components/component_08_06.html:901): 페이지 상단 또는 주요 타이틀 근처에 배치하여 이 페이지의 목적, 주요 기능, 이용 순서 등을 요약하여 낭독 (예: 민원 신청 첫 화면, 복잡한 안내 페이지 등)
- L[908–908](../../upstream/krds/raw/components/component_08_06.html:908): 영역 단위 음성 지원
- L[909–911](../../upstream/krds/raw/components/component_08_06.html:909): 카드, 서브 타이틀, 약관 등 독립된 정보 단위 옆에 배치하여 해당 영역 텍스트를 요약하여 낭독 (예: 신청 안내, 도움 안내 등)

### 용례

- L[922–922](../../upstream/krds/raw/components/component_08_06.html:922): 용례
- L[924–924](../../upstream/krds/raw/components/component_08_06.html:924): 사용하기 적합한 경우
- L[926–928](../../upstream/krds/raw/components/component_08_06.html:926): 페이지 전체 흐름을 요약·설명해야 하는 경우
- L[929–931](../../upstream/krds/raw/components/component_08_06.html:929): 특정 영역(신청 단계 등)의 내용을 음성으로 설명할 때
- L[932–934](../../upstream/krds/raw/components/component_08_06.html:932): 디지털 취약계층·고령자·외국인을 대상으로, 텍스트 이해를 보완해야 할 때
- L[935–937](../../upstream/krds/raw/components/component_08_06.html:935): 튜토리얼/도움말 플로우에서 단계별로 화면 사용법을 읽어줄 때
- L[941–941](../../upstream/krds/raw/components/component_08_06.html:941): 사용하기 적합하지 않은 경우
- L[943–945](../../upstream/krds/raw/components/component_08_06.html:943): 전체페이지를 의미 없이 읽어주어 재생되는 음성이 실질적인 정보나 도움을 제공하지 않는 경우
- L[946–948](../../upstream/krds/raw/components/component_08_06.html:946): 음성 보조기구(스크린리더 등)와 동일한 내용을 중복해서 제공하는 경우

### 사용성 가이드라인

- L[956–956](../../upstream/krds/raw/components/component_08_06.html:956): 사용성 가이드라인
- L[959–959](../../upstream/krds/raw/components/component_08_06.html:959): 명확한 레이블을 제공한다.
- L[960–961](../../upstream/krds/raw/components/component_08_06.html:960): 사용자자가 제공되는 정보를 정확하게 인지할 수 있도록 동작과 목적이 드러나도록버튼 레이블을 붙인다.
- L[972–972](../../upstream/krds/raw/components/component_08_06.html:972): 자동재생을 금지한다.
- L[973–974](../../upstream/krds/raw/components/component_08_06.html:973): 화면 전환 시 사용자의 조작 없이 자동으로 실행되지 않도록 한다. 또한 언제든지 일시정지, 정지할 수 있어야 한다.
- L[978–978](../../upstream/krds/raw/components/component_08_06.html:978): 너무 긴 내용을 읽어주지 않도록 한다.
- L[979–980](../../upstream/krds/raw/components/component_08_06.html:979): 음성 지원은 음성 보조기구(스크린리더 등)와 동일한 내용을 중복해서 제공하지 않도록 하고, 사용자에게 꼭 필요한 정보를 요약된 형태로 제공한다. (예 : 무엇을 할 수 있는지, 어떤 순서로 진행하면 되는지, 안내 및 주의 사항 등)

### 예시

- L[1102–1102](../../upstream/krds/raw/components/component_08_06.html:1102): 예시
- L[1106–1106](../../upstream/krds/raw/components/component_08_06.html:1106): 기본
- L[1146–1146](../../upstream/krds/raw/components/component_08_06.html:1146): 기본 코드 확인하기
- L[1162–1162](../../upstream/krds/raw/components/component_08_06.html:1162): 사이즈
- L[1195–1195](../../upstream/krds/raw/components/component_08_06.html:1195): 사이즈 코드 확인하기
- L[1211–1211](../../upstream/krds/raw/components/component_08_06.html:1211): 아이콘 버튼
- L[1246–1246](../../upstream/krds/raw/components/component_08_06.html:1246): 아이콘 버튼 코드 확인하기

### 마크업 가이드

- L[1267–1267](../../upstream/krds/raw/components/component_08_06.html:1267): 마크업 가이드
- L[1270–1270](../../upstream/krds/raw/components/component_08_06.html:1270): CSS 선택자
- L[1291–1299](../../upstream/krds/raw/components/component_08_06.html:1291): 전체영역 .krds-tts 타입 플레이 타입 .play
- L[1300–1304](../../upstream/krds/raw/components/component_08_06.html:1300): 사이즈 더 작게 .xsmall
- L[1305–1308](../../upstream/krds/raw/components/component_08_06.html:1305): 작게 .small
- L[1309–1312](../../upstream/krds/raw/components/component_08_06.html:1309): 중간 .medium
- L[1322–1322](../../upstream/krds/raw/components/component_08_06.html:1322): JS
- L[1341–1346](../../upstream/krds/raw/components/component_08_06.html:1341): krds_playTts krds_playTts('읽을 내용', this)

Inline preserved example markup (reference, not the public native API): L[1111–1140](../../upstream/krds/raw/components/component_08_06.html:1111), L[1167–1189](../../upstream/krds/raw/components/component_08_06.html:1167), L[1216–1240](../../upstream/krds/raw/components/component_08_06.html:1216)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Frozen detail has JS function signature only, no exact speech engine/timer/state lifecycle. Proposed host driver is independent design.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1151 `../../code/tts.html`, L1200 `../../code/tts_size.html`, L1251 `../../code/tts_icon.html`. Do not infer unseen contents.
- 5 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `TTSContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
