# CriticalAlert

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `critical-alert`; Korean name 긴급 공지; export `CriticalAlert`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_04_02](https://www.krds.go.kr/html/site/component/component_04_02.html); preserved [HTML](../../upstream/krds/raw/components/component_04_02.html). Retrieved `2026-10-29T23:28:03.344Z`; `72817` bytes; SHA-256 `be6556c675ce9269b7e70c9e71a0fbae7f6d5e846388e5c9431eee92ccdaf83b`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `high-urgency`, `medium-urgency`, `low-urgency`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Full-width section as first body content between MainMenu and hero: decorative urgency icon, visible urgency label, concise notice, at most one directly related detail link. No dismiss/collapse control. Official text explicitly requests role=banner.

## Plain semantic API

Independent API: urgency=high|medium|low, label, message, details? {href,label,destinationTitle}; no open/defaultOpen or dismiss event. Host controls time-limited presence. Style selectors danger/ok/info are examples, not proof that “safe” equals a numeric urgency level.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Only detail anchor enters Tab order; no automatic focus or assertive live role inferred from urgency. Decorative icon has no duplicate alt. Banner landmark naming/disambiguation with page Header needs review.

## Responsive/mobile requirements

Text one line normally/up to two narrow; do not clip essential information to enforce line count. Use concise host copy and details link.

## Forms, reset and composition

No form/reset/IME behavior.

## Asset, integration and composition completion

Host owns truthful urgent information and posting period. Completion tests nondismissibility and detail destination; no polling or network urgency feed in component.

## Stable parts and states

root, icon, label, message, link; urgency=high|medium|low.

All rendered owned parts use `data-krds-component="critical-alert"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Notice cannot be dismissed/collapsed.
2. Visible label conveys severity without color.
3. Only one detail link has destination-specific name.
4. Body-first placement remains readable narrow.
5. No redundant icon announcement.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`critical-alert--high-urgency`, `critical-alert--medium-urgency`, `critical-alert--low-urgency`, `critical-alert--narrow`, `critical-alert--page-placement`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_04_02.html:883): 구조
- L[889–892](../../upstream/krds/raw/components/component_04_02.html:889): 1. 아이콘 공지 유형을 구분하며 긴급한 정도에 대한 맥락을 파악하는 데 도움 되는 아이콘레이블
- L[902–902](../../upstream/krds/raw/components/component_04_02.html:902): 예) 태풍, 홍수, 감염병, 전산사고, 사이버테러 등
- L[897–905](../../upstream/krds/raw/components/component_04_02.html:897): a. 긴급도 상 국가적으로 재난 재해에 대응하거나 복구가 필요한 상황, 예고되지 않은 급작스러운 서비스 장애/ 이용 중단 상황에 대해 알림 예) 태풍, 홍수, 감염병, 전산사고, 사이버테러 등
- L[906–906](../../upstream/krds/raw/components/component_04_02.html:906): b. 긴급도 중 온/오프라인 서비스 이용 중단에 대한 사전 예고를 알림
- L[907–907](../../upstream/krds/raw/components/component_04_02.html:907): c. 긴급도 하 서비스 이용에 중대한 영향을 미치지는 않으나 대부분의 사용자가 인지해야 하는 상황을 알림
- L[893–909](../../upstream/krds/raw/components/component_04_02.html:893): 2. 레이블 공지 유형을 구분하는 텍스트로 긴급한 정도는 다음 세 가지 상태를 가짐 a. 긴급도 상 국가적으로 재난 재해에 대응하거나 복구가 필요한 상황, 예고되지 않은 급작스러운 서비스 장애/ 이용 중단 상황에 대해 알림 예) 태풍, 홍수, 감염병, 전산사고, 사이버테러 등 b. 긴급도 중 온/오프라인 서비스 이용 중단에 대한 사전 예고를 알림 c. 긴급도 하 서비스 이용에 중대한 영향을 미치지는 않으나 대부분의 사용자가 인지해야 하는 상황을 알림
- L[910–913](../../upstream/krds/raw/components/component_04_02.html:910): 3. 텍스트 공지 내용을 전달하기 위한 간략한 문구
- L[914–917](../../upstream/krds/raw/components/component_04_02.html:914): 4. 링크(선택) 긴급 공지와 관련된 상세 정보를 확인할 수 있는 서비스/화면 링크
- L[918–921](../../upstream/krds/raw/components/component_04_02.html:918): 5. 컨테이너 긴급 공지 배너가 제공되는 영역

### 용례

- L[929–929](../../upstream/krds/raw/components/component_04_02.html:929): 용례
- L[931–931](../../upstream/krds/raw/components/component_04_02.html:931): 사용하기 적합한 경우
- L[936–936](../../upstream/krds/raw/components/component_04_02.html:936): 구조의 레이블 유형을 참고하여 사용자에 중요하게 전달해야 할 필요가 있는 정보 전달에 긴급 공지를 사용해야 한다.
- L[933–938](../../upstream/krds/raw/components/component_04_02.html:933): 중요하고 시의성 있는 정보를 전달해야 할 경우 구조의 레이블 유형을 참고하여 사용자에 중요하게 전달해야 할 필요가 있는 정보 전달에 긴급 공지를 사용해야 한다.
- L[942–942](../../upstream/krds/raw/components/component_04_02.html:942): 사용하기 적합하지 않은 경우
- L[944–944](../../upstream/krds/raw/components/component_04_02.html:944): 홍보 목적의 콘텐츠를 전달하고자 하는 경우
- L[948–948](../../upstream/krds/raw/components/component_04_02.html:948): 본문에 구조화 목록 컴포넌트를 사용하거나 히어로 영역을 적절하게 활용하는 것이 적합하다.
- L[945–950](../../upstream/krds/raw/components/component_04_02.html:945): 일반적인 공지 콘텐츠를 전달하거나 강조하는 경우 본문에 구조화 목록 컴포넌트를 사용하거나 히어로 영역을 적절하게 활용하는 것이 적합하다.
- L[954–954](../../upstream/krds/raw/components/component_04_02.html:954): 입력폼에 대한 유효성 검사 결과, 완료 상태 등 사용자에게 피드백을 제공하기 위한 용도로 사용해서는 안 된다.
- L[951–956](../../upstream/krds/raw/components/component_04_02.html:951): 피드백 메시지를 제공하는 경우 입력폼에 대한 유효성 검사 결과, 완료 상태 등 사용자에게 피드백을 제공하기 위한 용도로 사용해서는 안 된다.

### 사용성 가이드라인

- L[964–964](../../upstream/krds/raw/components/component_04_02.html:964): 사용성 가이드라인
- L[967–967](../../upstream/krds/raw/components/component_04_02.html:967): 시급하고 사용자에게 중요한 정보를 전달하는 데 긴급 공지를 사용한다.
- L[968–968](../../upstream/krds/raw/components/component_04_02.html:968): 긴급 공지는 메인 메뉴와 히어로 영역 사이에 배치되어 사용자의 주의를 끌도록 표현하기 때문에 사용자가 서비스의 핵심 과업을 수행하거나 중요 정보에 접근하는 과정을 방해한다. 따라서 필요한 경우에만 사용해야 하며 공지 유형에 따른 적절한 강조 수준으로 표현해야 한다.
- L[971–971](../../upstream/krds/raw/components/component_04_02.html:971): 일시적으로 게시하고 정보가 필요한 기간 동안만 유지한다.
- L[972–972](../../upstream/krds/raw/components/component_04_02.html:972): 긴급 공지는 공지 내용과 관련된 기간 동안만 일시적으로 사용해야 한다. 긴급 공지 배너가 항상 표시되어 있고 최신화되지 않은 콘텐츠가 제공되면 실제로 긴급한 상황이 발생했을 때 사용자가 긴급 공지에 주의를 기울이지 않을 수 있다.
- L[975–975](../../upstream/krds/raw/components/component_04_02.html:975): 눈에 잘 띄게 표현하고 배치한다.
- L[976–976](../../upstream/krds/raw/components/component_04_02.html:976): 서비스에 접속하자마자 사용자가 가장 먼저 볼 수 있도록 본문 콘텐츠의 가장 첫 요소로 배치하며 컨테이너가 화면의 전체 너비를 차지하도록 표현한다.
- L[979–979](../../upstream/krds/raw/components/component_04_02.html:979): 긴급 공지 배너 숨기기 버튼을 제공하지 않는다.
- L[980–981](../../upstream/krds/raw/components/component_04_02.html:980): 한 번 배너를 숨기고 나면 페이지를 새로 고침하거나 방문 기록을 초기화하기 전까지 사용자는 긴급 공지 내용을 확인할 수 없다. 긴급 공지는 사용자가 반드시 알아야 하는 정보를 강조하기 위해 사용하는 컴포넌트이므로 배너를 숨기거나 일시적으로 접어두는 기능을 제공해서는 안 된다.
- L[984–984](../../upstream/krds/raw/components/component_04_02.html:984): 공지 내용은 이해하기 쉽고 간결하게 작성한다.
- L[985–988](../../upstream/krds/raw/components/component_04_02.html:985): 공지 내용은 이해하기 쉬운 언어를 사용하고 명확하게 이해할 수 있도록 작성한다. 문장은 1줄 이내로 작성하여 사용자의 인지적 부하를 최소화해야 한다. 만약 화면 너비가 충분하지 않다면 2줄까지 사용할 수 있다. 필요한 경우 관련 서비스/화면 링크를 사용하여 사용자가 상세 화면에서 정보를 확인할 수 있도록 구성한다.
- L[991–991](../../upstream/krds/raw/components/component_04_02.html:991): 여러 개의 긴급 공지를 사용하지 않는다.
- L[992–992](../../upstream/krds/raw/components/component_04_02.html:992): 여러 개의 긴급 공지가 제공되면 상대적으로 더 중요한 정보에 집중하기 어려워진다. 또한 사용자에게 부담을 가중시켜 긴급 공지를 무시하게 될 수도 있다.
- L[995–995](../../upstream/krds/raw/components/component_04_02.html:995): 관련 화면으로 이동하기 위한 링크를 여러 개 사용하지 않는다.
- L[996–996](../../upstream/krds/raw/components/component_04_02.html:996): 공지와 관련된 상세 화면으로 이동하기 위한 링크는 공지 내용과 직접적으로 관련된 화면으로 이동하는 1개의 링크만 사용해야 한다. 여러 개의 링크가 제공되면 긴급 공지 요소의 복잡도가 증가하여 내용에 집중하기 어려워진다.

### 플랫폼에 대한 고려 사항

- L[1004–1004](../../upstream/krds/raw/components/component_04_02.html:1004): 플랫폼에 대한 고려 사항
- L[1007–1007](../../upstream/krds/raw/components/component_04_02.html:1007): 화면 너비가 충분하지 않은 경우 텍스트는 2줄까지 표현할 수 있다.
- L[1008–1009](../../upstream/krds/raw/components/component_04_02.html:1008): 긴급 공지는 화면 상단에 표시되므로 작은 모바일 화면에서 다른 콘텐츠의 가시성에 큰 영향을 미칠 수 있다. 화면 너비가 충분하지 않다면 텍스트가 최대 2줄까지 표시되도록 하고,필요한 경우 관련 서비스/화면 링크를 사용하여 사용자가 상세 화면에서 정보를 확인할 수 있도록 구성한다.

### 접근성 가이드라인

- L[1116–1116](../../upstream/krds/raw/components/component_04_02.html:1116): 접근성 가이드라인
- L[1119–1119](../../upstream/krds/raw/components/component_04_02.html:1119): 긴급 공지 섹션에 배너 역할을 제공한다.
- L[1120–1120](../../upstream/krds/raw/components/component_04_02.html:1120): 긴급 공지 섹션에 role="banner"를 사용하여 배너 역할을 부여함으로써 스크린 리더 사용자가 섹션의 용도를 직관적이고 빠르게 탐색할 수 있도록 해야 한다.
- L[1126–1126](../../upstream/krds/raw/components/component_04_02.html:1126): 아이콘에 대체 텍스트를 제공하지 않는다.
- L[1127–1127](../../upstream/krds/raw/components/component_04_02.html:1127): 긴급 공지에는 아이콘 외에 레이블이 항상 표시되므로 스크린 리더 사용자에게 중복된 정보가 전달되지 않도록 아이콘 이미지에 대체 텍스트를 제공해서는 안 된다.
- L[1134–1134](../../upstream/krds/raw/components/component_04_02.html:1134): 목적지를 예측할 수 있는 링크 이름 또는 부가 설명을 제공한다.
- L[1135–1135](../../upstream/krds/raw/components/component_04_02.html:1135): ‘자세히 보기’라는 링크 레이블만으로는 링크에 연결된 목적지 정보를 예측하기 어려우므로 목적지의 웹 문서 제목(title)을 부가적인 설명으로 제공하는 것이 좋다.

### 예시

- L[1155–1155](../../upstream/krds/raw/components/component_04_02.html:1155): 예시
- L[1159–1159](../../upstream/krds/raw/components/component_04_02.html:1159): 기본
- L[1209–1209](../../upstream/krds/raw/components/component_04_02.html:1209): 기본 코드 확인하기

### 마크업 가이드

- L[1229–1229](../../upstream/krds/raw/components/component_04_02.html:1229): 마크업 가이드
- L[1232–1232](../../upstream/krds/raw/components/component_04_02.html:1232): CSS 선택자
- L[1250–1253](../../upstream/krds/raw/components/component_04_02.html:1250): 전체영역 .krds-critical-alerts
- L[1254–1259](../../upstream/krds/raw/components/component_04_02.html:1254): 뱃지영역 .critical-badge 긴급 .danger
- L[1260–1263](../../upstream/krds/raw/components/component_04_02.html:1260): 안전 .ok
- L[1264–1267](../../upstream/krds/raw/components/component_04_02.html:1264): 안내 .info

Inline preserved example markup (reference, not the public native API): L[1164–1203](../../upstream/krds/raw/components/component_04_02.html:1164)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Recorded independent decision: Preserve the explicit official banner role. Give the CriticalAlert banner its concise label as accessible landmark name, and independently name the service Header banner. Do not silently replace it with alert or automatically focus/announce assertively.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1214 `../../code/critical_alerts.html`, L1282 `./variable/critical_alerts.html`. Do not infer unseen contents.
- 1 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Accepted independent resolution

Preserve the explicit official banner role. Give the CriticalAlert banner its concise label as accessible landmark name, and independently name the service Header banner. Do not silently replace it with alert or automatically focus/announce assertively.

## Shared implementation handoff

The exact semantic interface is `CriticalAlertContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
