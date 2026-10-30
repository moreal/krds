# Link

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `link`; Korean name 링크; export `Link`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_05_01](https://www.krds.go.kr/html/site/component/component_05_01.html); preserved [HTML](../../upstream/krds/raw/components/component_05_01.html). Retrieved `2026-10-29T23:28:04.183Z`; `79213` bytes; SHA-256 `5dd23146a2c35cd36a52f4658c457abd8c1f3f934ce62d5c9d93fcea288ce5b5`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `standalone`, `inline`, `group`, `external`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Actual <a href> containing destination-specific label and optional decorative/external icon/underline. Inline size matches prose. Distinguish external destination and new-window behavior. Unavailable link omits href and is not a keyboard action.

## Plain semantic API

Independent API: href, target, rel, label/content, disabled=false, appearance=basic|emphasis, size=small|medium|large, underline=true except clear navigation contexts. disabled omits href and prevents all navigation/callbacks; do not keep stale clickable handlers.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Native Tab and Enter/click navigation, including modified click, context menu and open-new-tab. No Space-as-button handler. Same-document focus policy belongs to SkipLink/InPageNavigation rather than all links.

## Responsive/mobile requirements

Readable label and visible focus; recommended hit regions 17×17 pointer/44×44 touch apply with suitable layout, while inline links remain text flow.

## Forms, reset and composition

No form/reset/IME behavior.

## Asset, integration and composition completion

Host owns real destinations, tel:/mailto: values and external meaning. No automatic target=_blank except source-specific compositions requiring it. Native browser Link behavior must survive router integration.

## Stable parts and states

root, label, icon; disabled,external.

All rendered owned parts use `data-krds-component="link"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Anchor href exposes real destination and native modified-click.
2. Disabled omits href and executes nothing.
3. Inline link remains identifiable without color.
4. External/new-window intent is announced.
5. Label names destination consistently.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`link--standalone`, `link--inline`, `link--group`, `link--external`, `link--disabled`, `link--mailto-tel`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_05_01.html:883): 구조
- L[889–892](../../upstream/krds/raw/components/component_05_01.html:889): 1. 레이블 링크와 연결된 대상을 안내하는 텍스트
- L[893–896](../../upstream/krds/raw/components/component_05_01.html:893): 2. 인디케이터(선택) 일반 텍스트와 링크 텍스트를 명확하게 구분하기 위한 시각적인 식별자로 실선/파선, 밑줄로 표현됨. 링크가 메뉴, 푸터, 사이트맵과 같이 용도가 명확한 요소 내에서 사용되는 경우에는 인디케이터를 생략할 수 있음
- L[897–900](../../upstream/krds/raw/components/component_05_01.html:897): 3. 아이콘(선택) 현재 서비스의 맥락을 벗어나 다른 웹사이트로 이동하거나 부가적인 도움말 제공 화면으로 이동하는 경우에 사용됨

### 유형

- L[908–908](../../upstream/krds/raw/components/component_05_01.html:908): 유형
- L[910–910](../../upstream/krds/raw/components/component_05_01.html:910): 단독
- L[916–916](../../upstream/krds/raw/components/component_05_01.html:916): 인라인
- L[922–922](../../upstream/krds/raw/components/component_05_01.html:922): 그룹

### 용례

- L[932–932](../../upstream/krds/raw/components/component_05_01.html:932): 용례
- L[934–934](../../upstream/krds/raw/components/component_05_01.html:934): 사용하기 적합한 경우
- L[936–939](../../upstream/krds/raw/components/component_05_01.html:936): 다른 서비스/애플리케이션, 한 서비스 내의 다른 화면, 한 화면 내의 다른 섹션 등으로 이동이 필요한 경우 링크 역할의 컴포넌트를 지원하는 경우 링크를 사용한다.
- L[943–943](../../upstream/krds/raw/components/component_05_01.html:943): 사용하기 적합하지 않은 경우
- L[945–948](../../upstream/krds/raw/components/component_05_01.html:945): 입력폼 제출, 대화창 실행, 기능 취소 등 중요한 상호작용이 필요한 경우 버튼 컴포넌트를 사용하는 것이 적절하다.

### 사용성 가이드라인

- L[956–956](../../upstream/krds/raw/components/component_05_01.html:956): 사용성 가이드라인
- L[959–959](../../upstream/krds/raw/components/component_05_01.html:959): 링크가 인라인으로 사용될 때 링크 텍스트를 주변 텍스트와 동일한 크기로 제공한다.
- L[960–960](../../upstream/krds/raw/components/component_05_01.html:960): 문장 중 일부 단어의 크기만 조정되면 문단의 가독성에 중요한 텍스트의 스타일 속성(행간 등)에 일관성이 저하되어 정보 인지를 어렵게 만들고 사용자에게 혼동을 줄 수 있다.
- L[963–963](../../upstream/krds/raw/components/component_05_01.html:963): 링크와 관련된 사용자 과업, 플로(Flow)의 중요도에 따라 위계를 명확하게 구분한다.
- L[964–967](../../upstream/krds/raw/components/component_05_01.html:964): 일반적으로 파란색이나 서비스의 주조색(Main color)으로 표현되는 강조 링크를 가장 중요한 정보에 사용한다. 기본 링크는 중간 수준의 강조가 필요한 경우에 사용한다. 링크와 관련된 행동의 중요도가 낮거나 한 페이지 또는 한 개의 뷰에서 중요도가 동일한 여러 개의 링크가 제공되어야 하는 경우에 적합하다.
- L[974–974](../../upstream/krds/raw/components/component_05_01.html:974): 링크를 색상만으로 구분하지 않는다.
- L[975–975](../../upstream/krds/raw/components/component_05_01.html:975): 링크에 인디케이터를 제공하면 요소를 직관적으로 인지할 수 있으며, 색상 지각에 어려움이 있는 사용자도 링크를 명확하게 변별할 수 있다.
- L[986–986](../../upstream/krds/raw/components/component_05_01.html:986): 링크 레이블은 연결된 목적지 정보를 예측할 수 있는 내용으로 제공한다.
- L[987–991](../../upstream/krds/raw/components/component_05_01.html:987): 링크는 사용자를 현재의 맥락에서 데리고 나와 새로운 위치로 이동시킨다. 그러므로 링크 레이블은 목적지에서 발견할 수 있는 콘텐츠 내용을 정확하게 반영해야 한다. 따라서 주변 맥락을 활용하여 링크 목적지 정보를 명확하게 파악할 수 있는 경우를 제외하고 '이곳을 클릭하세요', '더 읽기'와 같은 일반적인 텍스트를 레이블로 사용해서는 안 된다. 레이블은 사용자가 이해할 수 있을 만큼 구체적이고 설명적이어야 하지만 텍스트가 여러 줄로 줄바꿈될 정도로 길어지는 것은 피해야 한다.
- L[994–994](../../upstream/krds/raw/components/component_05_01.html:994): 이메일 주소, 전화번호 정보를 링크로 제공한다.
- L[995–995](../../upstream/krds/raw/components/component_05_01.html:995): 이메일 주소, 전화번호를 링크로 마크업하고 각각에 'mailto:', 'tel:' URI 스킴을 적용하면 텍스트를 복사하지 않고 링크를 실행하는 것만으로 적절한 플랫폼으로 연결될 수 있다.
- L[998–998](../../upstream/krds/raw/components/component_05_01.html:998): 외부 서비스로 이동하는 링크를 분명하게 구분하고 일관된 방식으로 표현한다.
- L[999–999](../../upstream/krds/raw/components/component_05_01.html:999): 외부 서비스로 이동하는 링크에는 별도의 아이콘이나 텍스트(예 - ‘외부’)를 제공하여 링크를 실행함으로써 현재 이용 중인 서비스를 벗어나게 될 것임을 사용자가 예측할 수 있도록 해야 한다.
- L[1010–1010](../../upstream/krds/raw/components/component_05_01.html:1010): 링크는 레이블의 설명과 가장 관련성이 높은 목적지로 바로 이동할 수 있도록 구성한다.
- L[1011–1011](../../upstream/krds/raw/components/component_05_01.html:1011): 사용자가 링크를 실행하여 이동한 후, 원하는 정보를 찾기 위해 부가적인 탐색을 시도하지 않도록 적절한 목적지로 연결해야 한다. 적절한 경우 연결된 서비스의 특정 섹션이 목적지로 사용될 수 있다.

### 접근성 가이드라인

- L[1133–1133](../../upstream/krds/raw/components/component_05_01.html:1133): 접근성 가이드라인
- L[1136–1136](../../upstream/krds/raw/components/component_05_01.html:1136): 비활성화, 사용불가 상태인 경우를 제외하고 모든 링크는 키보드로 접근하고 조작할 수 있도록 한다.
- L[1137–1137](../../upstream/krds/raw/components/component_05_01.html:1137): &lt;a&gt;가 스크린 리더에서 컨트롤 요소로 인식되고 키보드로 접근할 수 있도록 href 속성을 선언해야 한다. 단, 링크가 사용불가 상태이거나 일시적으로 기능이 동작하지 않도록 하는 경우, href 속성을 생략하여 키보드가 접근하지 않도록 하는 것이 적절하다.
- L[1144–1144](../../upstream/krds/raw/components/component_05_01.html:1144): 링크 텍스트는 링크 목적지 정보를 적절하게 설명할 수 있는 내용으로 제공한다.
- L[1145–1145](../../upstream/krds/raw/components/component_05_01.html:1145): 링크 요소의 레이블을 텍스트 형식으로 제공하여 스크린 리더 사용자가 링크 목적지 정보를 전달받을 수 있도록 해야 한다. 만약 눈에 보이는 텍스트만으로 목적지에 대한 정보를 충분히 전달하기 어렵다면 툴팁 속성(title)을 보조적인 수단으로 활용할 수 있다.
- L[1152–1152](../../upstream/krds/raw/components/component_05_01.html:1152): 링크 레이블은 고유한 내용으로 제공한다.
- L[1153–1153](../../upstream/krds/raw/components/component_05_01.html:1153): 같은 목적지로 이동하는 링크 레이블은 동일하게, 서로 다른 목적지로 이동하는 링크 레이블은 다르게 제공하여 사용자가 목적지를 혼동하지 않도록 해야 한다.
- L[1161–1161](../../upstream/krds/raw/components/component_05_01.html:1161): 링크를 적절한 크기로 제공한다.
- L[1162–1162](../../upstream/krds/raw/components/component_05_01.html:1162): 클릭, 터치 영역을 정교하게 조작하기 어려운 사용자를 고려하여, 마우스 상호작용에 대해서는 17px x 17px, 터치 상호작용에 대해서는 44px x 44px 이상의 영역에서 반응할 수 있는 컨트롤 크기를 사용할 것을 권장한다.
- L[1168–1168](../../upstream/krds/raw/components/component_05_01.html:1168): 링크로 작동하는 모든 요소는 스크린 리더에서 링크로 인지될 수 있도록 한다.
- L[1169–1169](../../upstream/krds/raw/components/component_05_01.html:1169): &lt;a&gt; 대신 불가피하게 다른 태그를 사용해야 하는 경우 role="link"를 사용하여 스크린 리더에서 요소의 역할이 링크로 인식될 수 있도록 해야 한다.

### 상호작용 가이드라인

- L[1180–1180](../../upstream/krds/raw/components/component_05_01.html:1180): 상호작용 가이드라인
- L[1182–1182](../../upstream/krds/raw/components/component_05_01.html:1182): 탐색
- L[1200–1203](../../upstream/krds/raw/components/component_05_01.html:1200): Tab, Shift + Tab 모든 링크는 Tab, Shift + Tab 키를 눌렀을 때 접근할 수 있어야 한다.
- L[1210–1210](../../upstream/krds/raw/components/component_05_01.html:1210): 링크 실행
- L[1228–1231](../../upstream/krds/raw/components/component_05_01.html:1228): Click 링크 영역을 Click 하면 링크가 실행된다.
- L[1232–1235](../../upstream/krds/raw/components/component_05_01.html:1232): Enter 링크가 초점을 가진 상태에서 Enter 키를 누르면 링크가 실행된다.

### 예시

- L[1254–1254](../../upstream/krds/raw/components/component_05_01.html:1254): 예시
- L[1258–1258](../../upstream/krds/raw/components/component_05_01.html:1258): 기본
- L[1291–1291](../../upstream/krds/raw/components/component_05_01.html:1291): 기본 코드 확인하기

### 마크업 가이드

- L[1311–1311](../../upstream/krds/raw/components/component_05_01.html:1311): 마크업 가이드
- L[1314–1314](../../upstream/krds/raw/components/component_05_01.html:1314): CSS 선택자
- L[1336–1341](../../upstream/krds/raw/components/component_05_01.html:1336): 전체영역 .krds-btn.link 본문 텍스트 컬러 .basic
- L[1342–1345](../../upstream/krds/raw/components/component_05_01.html:1342): 가상클래스 상태 시 컬러 유지 .pure
- L[1346–1350](../../upstream/krds/raw/components/component_05_01.html:1346): 사이즈 작게 .small
- L[1351–1354](../../upstream/krds/raw/components/component_05_01.html:1351): 중간 .medium
- L[1355–1358](../../upstream/krds/raw/components/component_05_01.html:1355): 크게 .large
- L[1359–1362](../../upstream/krds/raw/components/component_05_01.html:1359): 밑줄 &gt;.underline
- L[1363–1366](../../upstream/krds/raw/components/component_05_01.html:1363): 가상클래스 상태 시 밑줄 .hidden-underline

Inline preserved example markup (reference, not the public native API): L[1263–1285](../../upstream/krds/raw/components/component_05_01.html:1263)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- No additional textual contradiction found. The semantic API/defaults are frozen by this accepted contract; native implementation remains subject to separate evidence/review.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1296 `../../code/link.html`, L1382 `./variable/link.html`. Do not infer unseen contents.
- 9 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `LinkContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
