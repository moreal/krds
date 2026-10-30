# Badge

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `badge`; Korean name 배지; export `Badge`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_04_06](https://www.krds.go.kr/html/site/component/component_04_06.html); preserved [HTML](../../upstream/krds/raw/components/component_04_06.html). Retrieved `2026-10-29T23:28:03.628Z`; `77657` bytes; SHA-256 `87506e8571849615ded7d2d2836f7ad4f19f2b4cae68906d7d13d303cfb7bf42`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `outline`, `filled`, `pastel`, `numeric`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Noninteractive label within outlined/filled/pastel container. Always visible text; no button/link role, href or nonnegative tabindex. Numeric content is still text information, not a counter action.

## Plain semantic API

Independent API: label, appearance=outline|filled|pastel (outline default), tone=secondary|gray|point|danger|warning|success|information|disabled, size=small|medium|large (medium), numeric=false. Official selector table additionally lists primary; source guidance forbids primary background, so the supported API excludes primary tone and primary backgrounds. This resolves the selector/prose tension as independent project policy.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

No keyboard action, selection event, focus or live announcement by default. Disabled tone is informational styling and must not imply actual control disabled semantics.

## Responsive/mobile requirements

Short unwrapped label; one badge per associated element. Host shortens copy rather than silently truncating status. Text/background contrast at least 4.5:1.

## Forms, reset and composition

No form/reset/IME behavior.

## Asset, integration and composition completion

Host supplies concise true status. Completion is visual/semantic across tones and sizes with actual label; not an empty decorative capsule.

## Stable parts and states

root, label; appearance,tone,size,numeric; no pressed/selected.

All rendered owned parts use `data-krds-component="badge"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Badge never enters Tab order or exposes interactive role.
2. Text carries state without color alone.
3. Every style/size has legible label at zoom.
4. Primary background configuration is rejected/documented.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`badge--outline`, `badge--filled`, `badge--pastel`, `badge--numeric`, `badge--sizes`, `badge--tones`, `badge--long-label`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_04_06.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_04_06.html:889): 1. 레이블 배지를 통해 전달하고자 하는 메타 데이터
- L[890–890](../../upstream/krds/raw/components/component_04_06.html:890): 2. 컨테이너 배지를 배경과 구분하는 배경색 또는 윤곽선

### 용례

- L[898–898](../../upstream/krds/raw/components/component_04_06.html:898): 용례
- L[900–900](../../upstream/krds/raw/components/component_04_06.html:900): 사용하기 적합한 경우
- L[905–905](../../upstream/krds/raw/components/component_04_06.html:905): 배지를 사용함으로써 사용자의 주의를 끌어 중요한 정보를 확인하도록 행동을 유도할 수 있다.
- L[902–907](../../upstream/krds/raw/components/component_04_06.html:902): 새로 등록된 콘텐츠, 읽지 않은 알림을 안내할 때 배지를 사용함으로써 사용자의 주의를 끌어 중요한 정보를 확인하도록 행동을 유도할 수 있다.
- L[911–914](../../upstream/krds/raw/components/component_04_06.html:911): 데이터에 2개 이상의 상태 정보가 존재하며, 이를 사용자가 명확하게 인지하는 것이 중요한 경우 배지를 이용한다. 예) 신청 서비스의 진행 상태(접수 중, 마감됨, 모집 완료) 등
- L[908–916](../../upstream/krds/raw/components/component_04_06.html:908): 데이터의 상태 정보를 사용자가 알고 있는 것이 좋을 때 데이터에 2개 이상의 상태 정보가 존재하며, 이를 사용자가 명확하게 인지하는 것이 중요한 경우 배지를 이용한다. 예) 신청 서비스의 진행 상태(접수 중, 마감됨, 모집 완료) 등
- L[920–920](../../upstream/krds/raw/components/component_04_06.html:920): 사용하기 적합하지 않은 경우
- L[925–925](../../upstream/krds/raw/components/component_04_06.html:925): 태그를 사용하는 것이 적합하다.
- L[922–927](../../upstream/krds/raw/components/component_04_06.html:922): 대화형으로 사용하고자 할 때 태그를 사용하는 것이 적합하다.

### 사용성 가이드라인

- L[935–935](../../upstream/krds/raw/components/component_04_06.html:935): 사용성 가이드라인
- L[938–938](../../upstream/krds/raw/components/component_04_06.html:938): 레이블은 정확한 내용으로 간결하게 제공한다.
- L[939–939](../../upstream/krds/raw/components/component_04_06.html:939): 사용자가 배지를 통해 정보를 빠르게 파악할 수 있도록 핵심 정보를 간결하게 요약하고 텍스트에 줄바꿈이 발생하지 않도록 해야 한다.
- L[942–942](../../upstream/krds/raw/components/component_04_06.html:942): 레이블과 컨테이너의 색상은 일반적인 의미 체계, 일관성을 고려하여 선택한다.
- L[943–944](../../upstream/krds/raw/components/component_04_06.html:943): 배지 레이블이 전달하는 정보가 특정 색상이 가진 일반적인 의미 체계와 일치하는 경우, 적절한 색상의 사용은 사용자가 더 빠르게 정보를 처리하는 데 도움된다(예 - 중요, 경고, 반대와 같은 정보에 빨간색 사용). 그러나 과도한 색상 사용은 오히려 사용자의 주의를 분산시킬 수 있다.
- L[947–947](../../upstream/krds/raw/components/component_04_06.html:947): 배지를 대화형 요소로 사용하지 않는다.
- L[948–949](../../upstream/krds/raw/components/component_04_06.html:948): 배지를 대화형 요소로 마크업(&lt;a&gt;, &lt;button&gt; 등) 또는 역할(role=link, role=button 등)을 부여하거나 부적절한 속성(0 이상의 속성값을 가진 tabindex 속성)을 적용하여 키보드 사용자, 스크린 리더 사용자가 배지의 용도와 목적을 혼동하지 않도록 해야 한다.
- L[952–952](../../upstream/krds/raw/components/component_04_06.html:952): 하나의 요소에 한 개의 배지를 사용한다.
- L[953–953](../../upstream/krds/raw/components/component_04_06.html:953): 배지는 사용자가 빠르게 정보를 훑어 보는 과정을 돕기 위해 사용된다. 만약 한 항목에 여러 개의 배지가 사용된다면 지나치게 많은 정보가 강조되어 있어 배지의 사용 효과를 감소시킨다. 배지는 데이터와 관련된 가장 중요한 특성을 표현하는 데 한 번만 사용하는 것이 적절하다.
- L[956–956](../../upstream/krds/raw/components/component_04_06.html:956): 배지의 배경색으로 서비스의 주조색을 사용하지 않는다.
- L[957–957](../../upstream/krds/raw/components/component_04_06.html:957): 배지의 배경색으로 주조색(Primary color)을 이용하게 되면 사용자는 배지를 버튼으로 오인할 수 있다.

### 접근성 가이드라인

- L[1094–1094](../../upstream/krds/raw/components/component_04_06.html:1094): 접근성 가이드라인
- L[1097–1097](../../upstream/krds/raw/components/component_04_06.html:1097): 텍스트 레이블을 제공한다.
- L[1098–1098](../../upstream/krds/raw/components/component_04_06.html:1098): 배지는 접근성과 명확한 이해를 위해 항상 텍스트 레이블을 제공해야 한다.
- L[1105–1105](../../upstream/krds/raw/components/component_04_06.html:1105): 텍스트 레이블의 색상은 배경과 4.5:1 이상의 명도 대비를 갖도록 표현한다.
- L[1106–1106](../../upstream/krds/raw/components/component_04_06.html:1106): 대부분의 사용자가 텍스트 콘텐츠를 문제없이 인지할 수 있도록 텍스트 색상, 배지의 배경 색상 선정에 유의해야 한다.

### 예시

- L[1127–1127](../../upstream/krds/raw/components/component_04_06.html:1127): 예시
- L[1131–1131](../../upstream/krds/raw/components/component_04_06.html:1131): 기본
- L[1182–1182](../../upstream/krds/raw/components/component_04_06.html:1182): 기본 코드 확인하기
- L[1198–1198](../../upstream/krds/raw/components/component_04_06.html:1198): 사이즈
- L[1249–1249](../../upstream/krds/raw/components/component_04_06.html:1249): 사이즈 코드 확인하기
- L[1265–1265](../../upstream/krds/raw/components/component_04_06.html:1265): 숫자형
- L[1290–1290](../../upstream/krds/raw/components/component_04_06.html:1290): 숫자형 코드 확인하기

### 마크업 가이드

- L[1310–1310](../../upstream/krds/raw/components/component_04_06.html:1310): 마크업 가이드
- L[1313–1313](../../upstream/krds/raw/components/component_04_06.html:1313): CSS 선택자
- L[1334–1340](../../upstream/krds/raw/components/component_04_06.html:1334): 전체영역 .krds-badge 컬러 아웃라인 .outline-* (primary/ secondary/ gray/ point/ danger/ warning/ success/ information/ disabled)
- L[1341–1344](../../upstream/krds/raw/components/component_04_06.html:1341): bg .bg-* (primary/ secondary/ gray/ point/ danger/ warning/ success/ information/ disabled)
- L[1345–1348](../../upstream/krds/raw/components/component_04_06.html:1345): bg (파스텔) .bg-light-* (primary/ secondary/ gray/ point/ danger/ warning/ success/ information/ disabled)
- L[1349–1353](../../upstream/krds/raw/components/component_04_06.html:1349): 크기 크게 .large
- L[1354–1357](../../upstream/krds/raw/components/component_04_06.html:1354): 중간 .medium
- L[1358–1361](../../upstream/krds/raw/components/component_04_06.html:1358): 작게 .small
- L[1362–1365](../../upstream/krds/raw/components/component_04_06.html:1362): 숫자 .number

Inline preserved example markup (reference, not the public native API): L[1136–1176](../../upstream/krds/raw/components/component_04_06.html:1136), L[1203–1243](../../upstream/krds/raw/components/component_04_06.html:1203), L[1270–1284](../../upstream/krds/raw/components/component_04_06.html:1270)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Recorded independent decision: Primary tone and primary backgrounds are not supported in the accepted Badge API. This follows substantive forbidden-background prose while retaining the contradictory selector evidence.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1187 `../../code/badge.html`, L1254 `../../code/badge_size.html`, L1295 `../../code/badge_number.html`, L1380 `./variable/badge.html`. Do not infer unseen contents.
- 1 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Accepted independent resolution

Primary tone and primary backgrounds are not supported in the accepted Badge API. This follows substantive forbidden-background prose while retaining the contradictory selector evidence.

## Shared implementation handoff

The exact semantic interface is `BadgeContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
