# Footer

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `footer`; Korean name 푸터; export `Footer`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_02_04](https://www.krds.go.kr/html/site/component/component_02_04.html); preserved [HTML](../../upstream/krds/raw/components/component_02_04.html). Retrieved `2026-10-29T23:28:02.764Z`; `74171` bytes; SHA-256 `b3235a0f1707901bf43826b17b1f9105260ab15c34ae1a2b9ecd2047a1f02609`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `composition`; accepted project completion kind `composition`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `default`, `narrow`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Actual <footer> is the last page landmark: group service logo/contact/utility links, then policy links, copyright information, then Identifier as final subsection. Include visibly distinguishable “개인정보 처리방침”; commerce services additionally supply terms/business identity. Optional service navigation must mirror main navigation labels and hierarchy.

## Plain semantic API

Independent API: Footer takes serviceLogo {src,alt}, contacts {label,href,text}[], utilityLinks[], privacyPolicy {href,label}, policyLinks[], copyrightText supplied explicitly, optional institution identity. Preserve semantic Link data rather than raw fabricated addresses.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

Natural Tab order through real links; use tel:/mailto: for actionable contact values. External/new-window links announce their destination behavior. Footer itself does not trap or redirect focus.

## Responsive/mobile requirements

Stack columns in the same order on small screens. For short pages, host page layout puts footer at viewport bottom without overlaying content.

## Forms, reset and composition

No aggregate form/reset/IME state.

## Asset, integration and composition completion

Host owns accurate/up-to-date contact, policy, copyright and asset rights. Do not default copyright to repository owner or KRDS holder. Completion includes actual local contact/policy links and Identifier composition plus page layout demo.

## Stable parts and states

root, logo, contacts, utilities, policies, privacy-link, copyright, identifier; no value state.

All rendered owned parts use `data-krds-component="footer"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Footer landmark contains all footer information with Identifier last.
2. Narrow layout preserves source order.
3. Privacy policy has required label and visual distinction.
4. Short page footer reaches viewport bottom without obscuring content.
5. Contact links expose correct local tel/mailto URI.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`footer--default`, `footer--narrow`, `footer--short-page`, `footer--commerce-policy`, `footer--navigation-mirror`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[885–885](../../upstream/krds/raw/components/component_02_04.html:885): 구조
- L[891–894](../../upstream/krds/raw/components/component_02_04.html:891): 1. 컨테이너 푸터가 제공되는 영역
- L[895–898](../../upstream/krds/raw/components/component_02_04.html:895): 2. 서비스 로고 기관/서비스 로고를 통해 디지털 서비스 운영 주체의 정체성을 전달하는 요소
- L[899–902](../../upstream/krds/raw/components/component_02_04.html:899): 3. 연락처 주소, 이메일 주소, 대표 전화번호, 민원 전화번호 등 연락 수단 정보
- L[903–906](../../upstream/krds/raw/components/component_02_04.html:903): 4. 유틸리티 링크 오시는 길, 관련 기관 웹사이트 가기 링크, 소셜 채널 바로가기 링크 등이 제공됨
- L[907–910](../../upstream/krds/raw/components/component_02_04.html:907): 5. 정책 링크 웹 접근성, 개인 정보 처리 방침과 같은 각종 정책 링크가 제공됨
- L[911–914](../../upstream/krds/raw/components/component_02_04.html:911): 6. 저작권 정보 디지털 정부 서비스의 저작권을 명시한 텍스트

### 사용성 가이드라인

- L[922–922](../../upstream/krds/raw/components/component_02_04.html:922): 사용성 가이드라인
- L[925–925](../../upstream/krds/raw/components/component_02_04.html:925): 모든 페이지에 푸터를 일관된 위치에 제공해야 한다.
- L[926–926](../../upstream/krds/raw/components/component_02_04.html:926): 푸터는 페이지의 마지막 요소이므로 본문 하단에 배치해야 한다. 본문의 높이가 뷰포트 높이보다 짧은 경우 푸터가 뷰포트 하단에 고정되어 있는지 확인한다.
- L[937–937](../../upstream/krds/raw/components/component_02_04.html:937): 모든 디지털 정부 서비스에서 푸터 섹션의 정보는 일관된 순서로 제공한다.
- L[938–941](../../upstream/krds/raw/components/component_02_04.html:938): 푸터 내 정보 배치 일관성을 유지하는 것은 디지털 정부 서비스 브랜드 확립과 사용자 신뢰 구축에 매우 중요하므로 명확한 이유 없이 기본 순서를 변경해서는 안 된다. 푸터 섹션의 정보는 서비스 로고, 연락처, 유틸리티 링크, 정책 링크, 저작권 정보의 순으로 제공한다. 이때, 서비스 로고, 연락처, 유틸리티 링크는 하나의 그룹으로 인지될 수 있도록 표현해야 한다.
- L[944–944](../../upstream/krds/raw/components/component_02_04.html:944): 개인정보처리방침을 반드시 표시한다.
- L[945–946](../../upstream/krds/raw/components/component_02_04.html:945): 개인정보 처리의 투명성을 알리기 위한 개인정보 처리방침은 반드시 웹사이트에 공개해야 한다. 또한 반드시 ‘개인정보 처리방침’ 이라는 명칭을 사용하고, 변경된 경우 그 사항을 반영해야 한다. 개인정보 처리방침은 글자 크기를 달리하거나, 색상 또는 굵기(Bold) 등을 활용하여 다른 고지사항(이용약관, 저작권 안내 등)과 구분하는 등 다양한 방법을 통해 정보 주체가 쉽게 확인할 수 있도록 한다.
- L[949–949](../../upstream/krds/raw/components/component_02_04.html:949): 전자상거래가 포함된 경우 이용약관을 반드시 표시한다.
- L[950–950](../../upstream/krds/raw/components/component_02_04.html:950): 인터넷쇼핑몰 등 전자상거래가 포함된 경우, 소비자가 안전하게 거래할 수 있도록 사업자의 신원, 거래 약관 등을 푸터에서 제공해야 한다.
- L[953–953](../../upstream/krds/raw/components/component_02_04.html:953): 사용자들이 빈번하게 찾는 링크를 배치한다.
- L[954–955](../../upstream/krds/raw/components/component_02_04.html:954): 사이트맵을 비롯하여 사용자가 빈번하게 찾는 링크는 웹사이트의 하단에서도 쉽게 접근할 수 있도록 제공하는 것이 좋다. 웹사이트의 세로 길이가 길어질수록 다시 상단으로 이동하는 것보다 더 빠른 접근이 가능하기 때문이다. 필요하다면 목적별/유형별로 군집화하여 직관적으로 탐색할 수 있게 한다.
- L[958–958](../../upstream/krds/raw/components/component_02_04.html:958): 푸터에 제공하는 서비스 내비게이션은 기본 내비게이션과 동일한 구조 및 레이블을 따라야 한다.
- L[959–959](../../upstream/krds/raw/components/component_02_04.html:959): 푸터에 서비스 내비게이션을 제공할 때, 기본 내비게이션(메인 메뉴)에 포함된 모든 최상위 화면 링크가 푸터 탐색에도 포함되어야 한다. 하위 화면 링크가 푸터에 포함된 경우 하위 화면 링크도 기본 탐색과 동일한 구조 및 레이블을 따라야 한다.
- L[962–962](../../upstream/krds/raw/components/component_02_04.html:962): 연락처 정보와 각종 링크는 항상 최신 상태로 유지한다.
- L[963–963](../../upstream/krds/raw/components/component_02_04.html:963): 링크를 실행했을 때 존재하지 않는 사이트/페이지/화면으로 이동하거나 예상과 다른 목적지로 이동하지 않도록 점검하고 최신화해야 한다.

### 플랫폼에 대한 고려 사항

- L[971–971](../../upstream/krds/raw/components/component_02_04.html:971): 플랫폼에 대한 고려 사항
- L[974–974](../../upstream/krds/raw/components/component_02_04.html:974): 작은 화면 너비에서도 푸터의 정보 요소는 상대적으로 동일한 순서로 제공되도록 표현한다.
- L[975–975](../../upstream/krds/raw/components/component_02_04.html:975): 화면 너비가 충분하지 않아 병렬적으로 배치되었던 푸터 내부 요소가 수직 배열로 변경되더라도 서비스 로고, 연락처, 유틸리티 링크, 정책 링크, 저작권 정보의 순서로 배치한다.

### 접근성 가이드라인

- L[1100–1100](../../upstream/krds/raw/components/component_02_04.html:1100): 접근성 가이드라인
- L[1103–1103](../../upstream/krds/raw/components/component_02_04.html:1103): 푸터 영역이 스크린 리더에 인지될 수 있는 방식으로 제공한다.
- L[1104–1104](../../upstream/krds/raw/components/component_02_04.html:1104): 푸터의 모든 요소는 &lt;footer&gt; 내부에 배치하여 주요 랜드마크 정보가 스크린 리더로 전달될 수 있도록 해야 한다. 이를 통해 스크린 리더 사용자들은 페이지의 구성을 빠르게 파악할 수 있다.
- L[1110–1110](../../upstream/krds/raw/components/component_02_04.html:1110): 로고 이미지에 대체 텍스트를 제공한다.
- L[1111–1111](../../upstream/krds/raw/components/component_02_04.html:1111): 텍스트가 아닌 이미지로 된 로고를 사용하는 경우 스크린 리더를 위한 대체 텍스트를 포함해야 한다.

### 예시

- L[1131–1131](../../upstream/krds/raw/components/component_02_04.html:1131): 예시
- L[1135–1135](../../upstream/krds/raw/components/component_02_04.html:1135): 기본
- L[1222–1222](../../upstream/krds/raw/components/component_02_04.html:1222): 기본 코드 확인하기

### 마크업 가이드

- L[1242–1242](../../upstream/krds/raw/components/component_02_04.html:1242): 마크업 가이드
- L[1245–1245](../../upstream/krds/raw/components/component_02_04.html:1245): CSS 선택자
- L[1262–1265](../../upstream/krds/raw/components/component_02_04.html:1262): 전체영역 #krds-footer
- L[1266–1269](../../upstream/krds/raw/components/component_02_04.html:1266): 관련기관 링크 .foot-quick
- L[1270–1273](../../upstream/krds/raw/components/component_02_04.html:1270): 주소 및 연락처 등 정보 .f-info
- L[1274–1277](../../upstream/krds/raw/components/component_02_04.html:1274): 푸터 링크 .f-link
- L[1278–1281](../../upstream/krds/raw/components/component_02_04.html:1278): 운영기관 식별자 .krds-identifier

Inline preserved example markup (reference, not the public native API): L[1140–1216](../../upstream/krds/raw/components/component_02_04.html:1140)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Legal content is host-provided; draft records official guidance and does not adjudicate which commerce laws apply.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1227 `../../code/footer.html`. Do not infer unseen contents.
- 3 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `FooterContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
