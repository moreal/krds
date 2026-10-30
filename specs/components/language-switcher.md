# LanguageSwitcher

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `language-switcher`; Korean name 언어 변경; export `LanguageSwitcher`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_10_01](https://www.krds.go.kr/html/site/component/component_10_01.html); preserved [HTML](../../upstream/krds/raw/components/component_10_01.html). Retrieved `2026-10-29T23:28:05.612Z`; `78986` bytes; SHA-256 `cdef8d8f6c3377fc01747d464ed51a7fc4ca1276c418161bc2f539572b2de397`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `integration`; accepted project completion kind `integration`. Retain integration: language control must connect locale/routes/content; official L959–961 distinguishes separate foreign-language service from whole-content translation.

Supported native cases (variant and state axes): `two-language-link`, `dropdown`, `separate-service`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Two-language services expose real alternate-language link; >=3 use named dropdown with current language/options. Options show native language name plus current-language translation where needed. No flags or unfamiliar language codes as visible labels. Set lang on each link to match spoken label.

## Plain semantic API

Independent API: currentLocale, options {locale,nativeLabel,translatedLabel,href,separateService?}[], open/defaultOpen=false, onOpenChange, onLocaleRequest({locale,href}) optional for host same-page localization. Separate-service link opens new window and marks this behavior; ordinary translated routes remain actual links.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Click/Enter/Space toggle dropdown; Tab/Shift+Tab visit options; outside closes; Escape closes and returns trigger. Choosing option follows native href or explicitly handled host localization and updates document language/content through host. No fake translated page from control alone.

## Responsive/mobile requirements

Narrow generally moves into hamburger menu or footer; high-frequency language change may stay directly discoverable in footer. Maintain current locale on relocation.

## Forms, reset and composition

No form/reset/IME behavior; translation selector does not serialize a form value.

## Asset, integration and composition completion

Host owns translations, route equivalence, document lang and separate-service destination. Completion includes local route/translation mock with native labels and trigger focus; no external translation API.

## Stable parts and states

root, trigger, globe, current, list, option, external-icon; open,closed,current.

All rendered owned parts use `data-krds-component="language-switcher"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Korean page shows English and reverse page shows 한국어.
2. Each language label has correct lang.
3. Dropdown keyboard/outside/Escape behavior works.
4. Separate-service link announces new window.
5. Host updates document language and local content together.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Independent local specimen policy

The independent dropdown specimen requires the actual current-language button named “언어: 한국어” and correctly labeled language options. A separate navigation landmark is not required for this dropdown; the exact button expectation does not authorize removing its current-language or expanded state.

## Required native stories

`language-switcher--two-language-link`, `language-switcher--dropdown`, `language-switcher--separate-service`, `language-switcher--narrow-footer`, `language-switcher--local-translation-mock`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[886–886](../../upstream/krds/raw/components/component_10_01.html:886): 구조
- L[892–892](../../upstream/krds/raw/components/component_10_01.html:892): 1. 아이콘과 레이블 언어 변경 옵션 목록을 실행하는 데 사용하는 버튼/링크의 이름
- L[893–893](../../upstream/krds/raw/components/component_10_01.html:893): 2. 현재 언어 현재 표시되고 있는 언어 이름
- L[894–894](../../upstream/krds/raw/components/component_10_01.html:894): 3. 옵션 사용자가 선택할 수 있는 표시 언어 옵션 값의 목록. 언어 이름을 ‘원어-현재 서비스를 표시하는 데 사용된 언어’로 작성함

### 유형

- L[902–902](../../upstream/krds/raw/components/component_10_01.html:902): 유형
- L[904–904](../../upstream/krds/raw/components/component_10_01.html:904): 링크
- L[905–905](../../upstream/krds/raw/components/component_10_01.html:905): 서비스가 2개의 언어를 지원하는 경우, 두 언어 간 표시를 전환할 때 사용한다.
- L[908–908](../../upstream/krds/raw/components/component_10_01.html:908): 드롭다운
- L[909–909](../../upstream/krds/raw/components/component_10_01.html:909): 서비스가 3개 이상의 언어를 지원하는 경우 사용한다.

### 사용성 가이드라인

- L[916–916](../../upstream/krds/raw/components/component_10_01.html:916): 사용성 가이드라인
- L[919–919](../../upstream/krds/raw/components/component_10_01.html:919): 링크 레이블에 아이콘을 제공한다.
- L[920–921](../../upstream/krds/raw/components/component_10_01.html:920): 드롭다운 유형에서 레이블 왼쪽에 지구본 형태의 아이콘을 표시하여 사용자가 버튼의 용도를 직관적으로 인지할 수 있도록 표현한다. 언어 변경을 필요로 하는 사용자는 레이블 텍스트만으로 의미를 이해하는 것이 어려울 수 있으므로 사용자에게 익숙한 기호 체계를 활용하여 부가적인 단서를 제공해야 한다.
- L[932–932](../../upstream/krds/raw/components/component_10_01.html:932): 링크 레이블은 전환되는 언어의 이름을 해당 언어로 작성한다.
- L[933–933](../../upstream/krds/raw/components/component_10_01.html:933): 사용자가 링크 레이블을 읽고 이해할 수 있어야 이용하기 적합한 언어로 전환하거나 관련 서비스로 이동할 수 있다. 만약 모든 언어 이름이 영어로 작성되어 있다면 영어를 읽을 수 없는 사용자는 자신에게 필요한 서비스가 제공되고 있더라도 사용할 수 없을 것이다.
- L[934–935](../../upstream/krds/raw/components/component_10_01.html:934): 특히 링크 유형의 언어 변경 방식을 사용할 때, 두 언어 간 링크 레이블을 반대로 제공하거나 하나의 언어로만 고정하여 제공하지 않도록 유의해야 한다. 예를 들어, 한국어, 영어로 표시되는 서비스가 있다면 한국어 화면에서 링크 레이블은 ‘English’, 영어 화면에서 링크 레이블은 ‘한국어’로 표시되어야 한다.
- L[946–946](../../upstream/krds/raw/components/component_10_01.html:946): 링크 레이블을 언어 코드로 축약하지 않는다.
- L[947–947](../../upstream/krds/raw/components/component_10_01.html:947): 사용자에게 익숙하지 않은 언어 코드를 링크 레이블로 사용해서는 안 된다. 언어 이름을 그대로 사용했을 때 의미를 명확하게 전달할 수 있으며, 별도 설명 없이도 스크린 리더 사용자에게 자연스러운 설명을 제공할 수 있다.
- L[954–954](../../upstream/krds/raw/components/component_10_01.html:954): 국가명은 필요한 경우에만 사용한다.
- L[955–956](../../upstream/krds/raw/components/component_10_01.html:955): 한 국가 내에서도 다양한 언어가 사용되므로 서비스 언어 변경을 위한 링크 레이블을 국가와 관련된 정보로 표현하는 것은 적절하지 않다. 만약 사용자의 국적이나 접속 국가에 따라 제공되는 서비스가 달라지거나 서비스 정책이 변경되는 경우에는 링크에 국가명을 보조적인 정보로 제공할 수 있다. 그러나 국가명을 보조적인 정보로 제공하는 경우에도 언어명이 가장 강조된 정보여야 한다.
- L[959–959](../../upstream/krds/raw/components/component_10_01.html:959): 외국어 서비스로 이동하는 경우 링크를 새 창으로 실행하고, 새 창 열림 아이콘을 제공한다.
- L[960–961](../../upstream/krds/raw/components/component_10_01.html:960): 이때, 외국어 서비스는 서비스 내 콘텐츠 전체 내용을 외국어로 번역하는 대신, 외국어 사용자들에게 가장 중요하고 필수적인 정보만을 선별하여 제공하는 간소화된 다국어 정보 플랫폼을 의미한다. 별도의 외국어 서비스를 제공하는 경우, 사용자가 언어 변경을 시도하게 되면 사용자가 탐색 중인 화면의 맥락과 상관없이 외국어 서비스의 대표 화면으로 이동하게 된다. 사용자가 이용 맥락의 변화로 인한 혼동을 겪지 않도록 링크를 새 창으로 실행하고, 새 창 열림 아이콘을 제공해야 한다.

### 플랫폼에 대한 고려 사항

- L[979–979](../../upstream/krds/raw/components/component_10_01.html:979): 플랫폼에 대한 고려 사항
- L[982–982](../../upstream/krds/raw/components/component_10_01.html:982): 화면 너비가 충분하지 않은 경우, 언어 변경 컴포넌트를 햄버거 메뉴 내부나 푸터에 배치한다.
- L[983–984](../../upstream/krds/raw/components/component_10_01.html:983): 외국어로 표시된 콘텐츠에 대한 이용 빈도가 높거나 언어 변경이 중요한 서비스인 경우 언어 변경 버튼을 푸터에 배치하여, 사용자가 숨겨진 콘텐츠 영역을 탐색하지 않고도 쉽게 기능을 발견할 수 있도록 하는 것이 좋다. 일반적인 서비스에서는 헤더의 복잡성을 줄이기 위해, ‘헤더’ 컴포넌트 가이드라인을 참조하여 햄버거 메뉴 내부에 언어 변경 버튼을 배치한다.

### 접근성 가이드라인

- L[1091–1091](../../upstream/krds/raw/components/component_10_01.html:1091): 접근성 가이드라인
- L[1094–1094](../../upstream/krds/raw/components/component_10_01.html:1094): 링크에 lang 속성을 선언하고 레이블과 일치하는 언어 코드를 속성값으로 제공한다.
- L[1095–1095](../../upstream/krds/raw/components/component_10_01.html:1095): 스크린 리더가 lang 속성값으로 제공된 언어 코드를 식별하여 해당 언어에 맞는 발음과 억양으로 레이블을 읽어주게 된다. 잘못된 발음은 링크 레이블의 내용 이해를 어렵게 만들며, 해석에 정신적 노력이 필요하므로 피로를 증가시킨다.

### 상호작용 가이드라인

- L[1106–1106](../../upstream/krds/raw/components/component_10_01.html:1106): 상호작용 가이드라인
- L[1108–1108](../../upstream/krds/raw/components/component_10_01.html:1108): 드롭다운 목록 확장 및 축소
- L[1126–1129](../../upstream/krds/raw/components/component_10_01.html:1126): Click 컨테이너를 Click 했을 때, 옵션 목록이 확장되거나 축소된다.옵션 목록이 확장된 상태에서 레이블, 컨테이너, 옵션 목록이 아닌 영역을 Click 하면 옵션 목록은 축소되어야 한다.
- L[1130–1133](../../upstream/krds/raw/components/component_10_01.html:1130): Enter, Space 컨테이너에 초점이 있는 경우, 옵션 목록이 확장되거나 축소된다.
- L[1134–1137](../../upstream/krds/raw/components/component_10_01.html:1134): Esc 옵션 목록을 축소하고 컨테이너로 초점이 이동해야 한다.
- L[1144–1144](../../upstream/krds/raw/components/component_10_01.html:1144): 드롭다운 목록 탐색
- L[1162–1165](../../upstream/krds/raw/components/component_10_01.html:1162): Tab, Shift + Tab Tab, Shift + Tab 키를 눌렀을 때 옵션에 접근할 수 있어야 한다.
- L[1166–1169](../../upstream/krds/raw/components/component_10_01.html:1166): Scroll 옵션 목록에 스크롤이 생성된 경우 목록이 상/하로 이동한다.

### 예시

- L[1188–1188](../../upstream/krds/raw/components/component_10_01.html:1188): 예시
- L[1192–1192](../../upstream/krds/raw/components/component_10_01.html:1192): 기본
- L[1226–1226](../../upstream/krds/raw/components/component_10_01.html:1226): 기본 코드 확인하기
- L[1242–1242](../../upstream/krds/raw/components/component_10_01.html:1242): 페이지 전환
- L[1281–1281](../../upstream/krds/raw/components/component_10_01.html:1281): 페이지 전환 코드 확인하기

### 마크업 가이드

- L[1302–1302](../../upstream/krds/raw/components/component_10_01.html:1302): 마크업 가이드
- L[1305–1305](../../upstream/krds/raw/components/component_10_01.html:1305): CSS 선택자
- L[1325–1333](../../upstream/krds/raw/components/component_10_01.html:1325): 전체영역 .krds-drop-wrap .krds-language 드롭다운 위치 .drop-left (왼쪽 정렬) .drop-right (오른쪽 정렬)
- L[1334–1337](../../upstream/krds/raw/components/component_10_01.html:1334): 드롭다운 메뉴 전체영역 .drop-menu
- L[1338–1341](../../upstream/krds/raw/components/component_10_01.html:1338): 드롭다운 메뉴 상단 .drop-top
- L[1342–1345](../../upstream/krds/raw/components/component_10_01.html:1342): 드롭다운 메뉴 리스트 .drop-list
- L[1346–1349](../../upstream/krds/raw/components/component_10_01.html:1346): 드롭다운 메뉴 하단 .drop-bottom

Inline preserved example markup (reference, not the public native API): L[1197–1220](../../upstream/krds/raw/components/component_10_01.html:1197), L[1247–1275](../../upstream/krds/raw/components/component_10_01.html:1247)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- No ownership of translation quality or npm scope inferred from example namespace.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1231 `../../code/language_switcher.html`, L1286 `../../code/language_switcher_page.html`. Do not infer unseen contents.
- 8 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `LanguageSwitcherContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
