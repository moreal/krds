# Toast

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `toast`; Korean name 토스트; export `Toast`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_12_05](https://www.krds.go.kr/html/site/component/component_12_05.html); preserved [HTML](../../upstream/krds/raw/components/component_12_05.html). Retrieved `2026-10-29T23:28:06.180Z`; `57107` bytes; SHA-256 `407e2dc99ded84b9ceaeab40478d4a5c4d0125d96c968c05d2f309ae802fb9af`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `information`, `warning`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Transient noninteractive container with one concise sentence, bottom-center above page and clear of TabBar/FAB. No action buttons; action-needed content uses Snackbar. Do not use for urgent/critical or individual field errors.

## Plain semantic API

Choose a **host-owned current-message and queue** API: required `message:{id:string,text:string,tone:information|warning,persistentResultId:string}|null`, initially null; durationMs defaults to 3000 information/4000 warning, and `onDismiss({id,reason:"timeout",generation})` is a dismissal **request**, not notification that host content has been removed. No defaultMessage, internal queue or enqueue/store object exists. The host owns result correctness, current message, ordering and queue advancement; it can configure a longer positive duration. role=status/aria-live=polite is independent native policy; toast remains noninteractive and never a focus destination.

**Adequate exposure/retrieval is mandatory completion**, beyond matching a short default timer ([official L946–949](../../upstream/krds/raw/components/component_12_05.html:946)). This project's concrete accommodation requires persistentResultId to resolve to the same result text in a discoverable accessible **persistent result/status or history outside the transient toast**, in normal reading/navigation order. It stays available until deliberate host/user clearing or leaving the relevant screen. The fixture must include this real local persistent result so a slow reader or delayed announcement can still retrieve the outcome after the toast expires. The history/log mechanism is independent project policy, not a claim that KRDS prescribes that exact UI; absence of sufficient exposure/retrieval cannot pass completion.

## Keyboard, focus and state transitions

Never steal focus or add action/close controls. A changed message ID immediately replaces the visible message because the host chose it; the component does not enqueue the previous/current snapshots. message=null removes it. Neither replacement nor prop removal emits onDismiss or advances a queue internally.

Maintain a monotonic internal generation for each new ID or meaningful same-ID text/tone/effective-duration revision. Same-ID changed text updates the current toast, announces changed text once and starts a fresh full exposure; same-ID tone/duration-only revision updates appearance/lifetime with no duplicate identical-text announcement. Identical same-ID content and mere callback/object identity changes do not reannounce or restart. The same ID reused after message=null is a new visible generation. Requests carry the ID and generation they concern; callbacks contain no renderer object.

Start the full countdown only after that generation is actually rendered. Pause remaining time while the document is hidden; resume the remaining time when visible. Replacement, removal, meaningful revision and unmount cancel the former generation's timer/listeners; stale callbacks must check the current generation before requesting anything. Timeout emits exactly one dismissal request for its generation, then consumes that timer. If the controlled host keeps the message, it remains visible: no local hiding, queue advancement, repeated timeout loop or false “actual dismissal” callback. A new meaningful generation can start a fresh timer. Focus, prop updates, mount and reset do not fabricate user-change/dismissal events.

## Responsive/mobile requirements

Keep clear of bottom safe-area/navigation/FAB; wrap only as necessary for translated/zoom text, prioritize readable message over clipping. No motion required; reduced motion appears/disappears without sliding.

## Forms, reset and composition

No form/reset/IME behavior.

## Asset, integration and composition completion

Host owns the queue/current-message prop, persistent result/history target and result truth/recovery. Completion requires a local action producing both actual persistent result and transient message; slow-reading/delayed-announcement retrieval; and deterministic timeout, update, replacement, rejected-dismissal and cleanup behavior. The official 2–3s information/3–4s warning values are defaults within sufficient-exposure guidance, not proof every user has read/heard a result. A correctly timed but irretrievable result fails the gate. No action or close button is added to turn Toast into Snackbar.

## Stable parts and states

root, message; information,warning,open,closed.

All rendered owned parts use `data-krds-component="toast"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. User action shows correctly announced result without focus move.
2. No interactive descendants.
3. Information/warning default durations match policy.
4. Same ID not redundantly announced.
5. Hidden/unmounted timer cannot dismiss new message.
6. Bottom navigation remains unobscured.
7. Slow-reading or delayed-announcement user can retrieve the same complete result in the required persistent local status/history after transient expiry.
8. Changed same-ID text updates current content and announces once; identical duplicate content neither reannounces nor restarts its lifetime.
9. Host replacement or null removal cancels the old generation without dismissal callbacks or internal queue advancement.
10. Rejected timeout request leaves the host-controlled message visible and emits no repeated timeout or false actual-removal notification.
11. Stale timer for an old ID or same-ID revision cannot request dismissal of the current generation.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`toast--information`, `toast--warning`, `toast--duplicate`, `toast--queued`, `toast--timer-cleanup`, `toast--narrow`, `toast--reduced-motion`, `toast--slow-reading-persistent-result`, `toast--same-id-content-update`, `toast--host-replacement-removal`, `toast--timeout-rejected`, `toast--generation-timer`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[864–864](../../upstream/krds/raw/components/component_12_05.html:864): 구조
- L[870–870](../../upstream/krds/raw/components/component_12_05.html:870): 1. 컨테이너 메시지를 담고 일시적으로 표시되었다가 사라지는 영역
- L[871–872](../../upstream/krds/raw/components/component_12_05.html:871): 2. 본문 사용자 행동에 대한 구체적인 설명 텍스트로 짧은 한 문장으로 구성

### 용례

- L[881–881](../../upstream/krds/raw/components/component_12_05.html:881): 용례
- L[883–883](../../upstream/krds/raw/components/component_12_05.html:883): 사용하기 적합한 경우
- L[888–890](../../upstream/krds/raw/components/component_12_05.html:888): 긴급공지 혹은 모달을 사용하는 것이 적합하다.
- L[885–892](../../upstream/krds/raw/components/component_12_05.html:885): 사용자 행동에 대한 즉각적인 피드백을 안내하는 경우 긴급공지 혹은 모달을 사용하는 것이 적합하다.
- L[896–896](../../upstream/krds/raw/components/component_12_05.html:896): 사용하기 적합하지 않은 경우
- L[901–901](../../upstream/krds/raw/components/component_12_05.html:901): 긴급공지 혹은 모달을 사용하는 것이 적합하다.
- L[898–903](../../upstream/krds/raw/components/component_12_05.html:898): 중요하거나 긴급한 메시지를 전달해야 하는 경우 긴급공지 혹은 모달을 사용하는 것이 적합하다.
- L[907–907](../../upstream/krds/raw/components/component_12_05.html:907): 메시지와 함께 사용자의 추가 행동을 제공해야 하는 경우 스낵바를 사용하는 것이 적합하다.
- L[904–909](../../upstream/krds/raw/components/component_12_05.html:904): 사용자의 추가 행동을 함께 제공해야 하는 경우 메시지와 함께 사용자의 추가 행동을 제공해야 하는 경우 스낵바를 사용하는 것이 적합하다.
- L[913–913](../../upstream/krds/raw/components/component_12_05.html:913): 토스트는 한 줄 이내의 짧은 설명을 제공할 때 사용하기 적합하며, 더 긴 설명이 필요하다면 모달을 사용하는 것이 적합하다.
- L[910–915](../../upstream/krds/raw/components/component_12_05.html:910): 한 문장 이상의 긴 설명을 제공해야 하는 경우 토스트는 한 줄 이내의 짧은 설명을 제공할 때 사용하기 적합하며, 더 긴 설명이 필요하다면 모달을 사용하는 것이 적합하다.
- L[919–919](../../upstream/krds/raw/components/component_12_05.html:919): 개별 입력 양식에 대한 메시지는 입력 폼이 제공되는 화면의 각 요소에 인 라인 텍스트 방식으로 제공하는 것이 사용자가 인지하기에 더 적합하다.
- L[916–921](../../upstream/krds/raw/components/component_12_05.html:916): 개별 입력 양식에 대한 오류, 성공, 경고 메시지를 제공하는 경우 개별 입력 양식에 대한 메시지는 입력 폼이 제공되는 화면의 각 요소에 인 라인 텍스트 방식으로 제공하는 것이 사용자가 인지하기에 더 적합하다.

### 사용성 가이드라인

- L[929–929](../../upstream/krds/raw/components/component_12_05.html:929): 사용성 가이드라인
- L[932–932](../../upstream/krds/raw/components/component_12_05.html:932): 토스트는 화면 중앙 하단에 표시한다.
- L[933–935](../../upstream/krds/raw/components/component_12_05.html:933): 토스트는 화면의 중앙 하단에 다른 요소 위에 배치하며, 하단 탭 바나 플로팅 버튼 등 주요 탐색 요소와 겹치지 않게 표시하여야 한다.
- L[939–939](../../upstream/krds/raw/components/component_12_05.html:939): 명확하고 간결하게 알림 메시지를 제공한다.
- L[940–942](../../upstream/krds/raw/components/component_12_05.html:940): 사용자 행동에 대한 결과를 명확하고 간결하게 한 줄의 메시지로 제공한다. 결과 전달에 있어 두줄 이상의 설명 또는 사용자의 추가 행동이 필요한 경우 스낵바를 사용하는 것이 적합하다.
- L[946–946](../../upstream/krds/raw/components/component_12_05.html:946): 메시지 노출 시간을 적절하게 설정한다.
- L[947–949](../../upstream/krds/raw/components/component_12_05.html:947): 토스트는 일시적으로 나타났다 사라지는 메시지로 사용자가 메시지의 내용을 충분히 인지할 수 있는 시간 만큼 노출 되었다가 사라져야 한다. 정보형 메시지는 2초 ~ 3초가 적정하며, 주의·경고형 메시지는 3초 ~ 4초가 적정하다.
- L[954–954](../../upstream/krds/raw/components/component_12_05.html:954): 인증 완료, 저장 완료, 파일 업로드 완료 등
- L[951–956](../../upstream/krds/raw/components/component_12_05.html:951): 정보형 메시지 (2초~3초) 인증 완료, 저장 완료, 파일 업로드 완료 등
- L[960–960](../../upstream/krds/raw/components/component_12_05.html:960): 인증 실패 (반복 시 모달로 표시 권장), 임시 저장 실패, 파일 업로드 실패 등
- L[957–962](../../upstream/krds/raw/components/component_12_05.html:957): 주의·경고형 메시지 인증 실패 (반복 시 모달로 표시 권장), 임시 저장 실패, 파일 업로드 실패 등

Inline preserved example markup (reference, not the public native API): No inline sample-view markup in this detail.

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Sufficient retrieval is now required through a concrete host persistent-result accommodation; its UI, host queue ownership, generation and request-only timer policy are independent design. The contradictory suitable-use sentence and literal official duration guidance remain preserved below.
- 1 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `ToastContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
