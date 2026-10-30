# Favicon

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `favicon`; Korean name 파비콘; export `Favicon`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_04_14](https://www.krds.go.kr/html/site/component/component_04_14.html); preserved [HTML](../../upstream/krds/raw/components/component_04_14.html). Retrieved `2026-10-29T23:28:04.115Z`; `59532` bytes; SHA-256 `1ded75634138e65690cc3a60c6d61c6c344b7d4d5cca6ef9ced66605a7d68a83`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `asset`; accepted project completion kind `asset`. Retain asset: official L903–913 requires CI-based favicon files and theme versions; no interactive component is described.

Supported native cases (variant and state axes): `standard`, `extended`, `light`, `dark`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Document-head favicon asset integration, not an on-page div. Official standard applies government-symbol institutions; extended applies own-CI institutions/services. Supply recognizable 16px mark and consistent institution identity across representative/subservice domains.

## Plain semantic API

Independent API: Favicon asset descriptor {light:{href,type,sizes},dark?:{href,type,sizes},touchIcon?}; head integration emits actual <link rel=icon> with color-scheme media as supported. No event, focus, form or runtime value state. Paths point to locally bundled cleared files; no default government crest.

Shared state policy follows [current pilot conventions](./README.md): defined value/open is controlled, absent is uncontrolled; supplying both controlled/default or switching mode is invalid. Defaults are read once. User action emits one plain semantic request; disabled, no-op, mount, hydration, prop update and form reset emit zero user-change callbacks. Controlled rejection retains committed UI/focus state; canceled reset does nothing. Noncanceled reset restores uncontrolled baseline and leaves controlled props authoritative. Extra fields never expose renderer/machine objects.

## Keyboard, focus and state transitions

No keyboard behavior; verify browser/head metadata and accessible instructions for host installation rather than creating a fake visual control.

## Responsive/mobile requirements

Prepare light/dark versions retaining same symbol; mobile homescreen/touch asset support is host integration choice and requires matching platform metadata review.

## Forms, reset and composition

No form/reset/IME behavior.

## Asset, integration and composition completion

Host owns CI rights, files, domain consistency and head insertion. Asset completion requires committed local files with provenance/hash, correct MIME/sizes/head links and browser/tab review in each host fixture; a component export alone cannot satisfy it.

## Stable parts and states

No rendered data-krds parts required; optional documentation preview root and light/dark sample are explicitly previews, not runtime favicon DOM.

All rendered owned parts use `data-krds-component="favicon"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Head links resolve to local assets with expected MIME/dimensions.
2. Light/dark contexts retain recognized silhouette at 16px.
3. No runtime request to external service.
4. Host fixture favicon is present after SSR/client navigation.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`favicon--standard-local-head`, `favicon--extended-local-head`, `favicon--light-dark-preview`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 유형

- L[880–880](../../upstream/krds/raw/components/component_04_14.html:880): 유형
- L[882–882](../../upstream/krds/raw/components/component_04_14.html:882): 표준형
- L[883–883](../../upstream/krds/raw/components/component_04_14.html:883): (대상 : 정부 상징 로고를 사용하는 중앙행정기관(부/처/청), 특별지방행정기관, 부속기관 등)
- L[889–889](../../upstream/krds/raw/components/component_04_14.html:889): 확장형
- L[890–890](../../upstream/krds/raw/components/component_04_14.html:890): (대상 : 독자적인 로고를 사용하는 중앙기관 (운영 서비스·시스템) 및 공공기관 (대표·운영서비스·시스템)

### 사용성 가이드라인

- L[900–900](../../upstream/krds/raw/components/component_04_14.html:900): 사용성 가이드라인
- L[903–903](../../upstream/krds/raw/components/component_04_14.html:903): 정부기관의 식별성을 높이기 위해 기관 CI 기반 파비콘을 필수로 제공한다.
- L[904–905](../../upstream/krds/raw/components/component_04_14.html:904): 브라우저 탭·즐겨찾기·모바일 홈 화면에서 기관/서비스를 빠르게 식별할 수 있도록 기관 CI 기반 파비콘을 필수로 제공한다. 파비콘은 16px에서도 인지 가능하도록 복잡한 디테일을 제거하고 단순화된 심볼 또는 약칭으로 제작하며, 배경과의 명도·색상 대비를 충분히 확보해 어떤 환경에서도 또렷하게 보이도록 한다. 대표 도메인과 서브 서비스에 동일 파비콘을 적용해 이용자가 동일 기관 서비스임을 인지할 수 있게 한다.
- L[912–912](../../upstream/krds/raw/components/component_04_14.html:912): 라이트·다크 테마 모두에서 구분되도록 버전을 마련한다.
- L[913–913](../../upstream/krds/raw/components/component_04_14.html:913): 라이트·다크 테마 및 브라우저 및 OS UI 배경 변화에도 식별성이 유지되도록 테마 대응 버전을 제공하며 동일한 심볼 형태를 유지한 채 명도 반전, 외곽선, 배경판 적용 등으로 충분한 대비를 확보한다.

### 예시

- L[1045–1045](../../upstream/krds/raw/components/component_04_14.html:1045): 예시
- L[1049–1049](../../upstream/krds/raw/components/component_04_14.html:1049): 기본
- L[1070–1070](../../upstream/krds/raw/components/component_04_14.html:1070): 기본 코드 확인하기

Inline preserved example markup (reference, not the public native API): L[1054–1064](../../upstream/krds/raw/components/component_04_14.html:1054)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Frozen HTML does not define exact ICO/PNG/SVG matrix or touch-icon sizes; choose only after host browser/platform asset policy review. Logo rights are unresolved.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1075 `../../code/favicon.html`. Do not infer unseen contents.
- 5 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `FaviconContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
