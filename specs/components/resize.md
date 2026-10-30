# Resize

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `resize`; Korean name 화면 크기 조정; export `Resize`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_10_02](https://www.krds.go.kr/html/site/component/component_10_02.html); preserved [HTML](../../upstream/krds/raw/components/component_10_02.html). Retrieved `2026-10-29T23:28:05.696Z`; `75629` bytes; SHA-256 `b20eb8f9d7cd29d12e5a87be485cbcd5e1ba2bff549f40ab16e29925fe34cba4`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `integration`; accepted project completion kind `integration`. Retain integration: L1066–1077 requires host-page content/function retention, beyond control markup.

Supported native cases (variant and state axes): `five-levels`, `custom-levels`, `narrow-reflow`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Named screen-size control, options with descriptive label and current selected value. Official examples: 90%,100%,110%,130%,150%; <=5 options. Text labels accompany scale icons/numbers.

## Plain semantic API

Independent API: levels {id,label,percent}[]=official five, `value?:string`, `defaultValue?:string="100"`, `onValueChange({value:id})`, open/defaultOpen=false, onOpenChange. The requested value is the option ID and the callback conforms to [ValueChangeDetails<T>](../../packages/contracts/src/types.ts:7); hosts look up percent from levels rather than receiving an incompatible id-only payload. Defined value chooses controlled mode; absent value uses its read-once default; controlled/default together or mode switching is invalid. One changed user selection request, none for same-value/disabled action, props, mount or reset. Host applies scoped scale and confirms value; no browser/device zoom manipulation.

For a controlled declined click/Enter/collapsed-arrow request, keep the current option, displayed value and host scale at the committed value. Do not optimistically apply the requested percent or emit a second request during reconciliation. Scale application and selection share that same authoritative value. The [pilot policy](./README.md) and separate open-state ownership still apply.

## Keyboard, focus and state transitions

Click/Enter/Space opens; Tab visits options; outside/Escape closes and Escape returns trigger. Enter selects and closes. While collapsed ArrowUp/Down selects previous/next option per official table; endpoints do not wrap (project policy). Selection focus remains usable after reflow.

## Responsive/mobile requirements

All content/actions remain accessible at enlarged scale, page normally single-direction scroll with documented media/table exceptions. Check actual browser 200/400% zoom alongside component levels; CSS transform alone cannot stand in for usable layout reflow.

## Forms, reset and composition

No form value; settings reset is explicit host preference action, not implicit form reset. No IME editing.

## Asset, integration and composition completion

Host owns scaling application, preference persistence and scope. Completion includes working local settings driver+representative page demonstrating reflow, not only changed label. No remote storage or global browser setting edits.

## Stable parts and states

root, trigger, current, list, option, scale-icon; open,closed,selected.

All rendered owned parts use `data-krds-component="resize"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Each choice visibly changes local host content scale.
2. Collapsed arrows change selection once.
3. Escape returns focus.
4. 200/400% browser zoom retains content/actions.
5. No two-direction page scrolling except intrinsic media/table.
6. Unmount restores scoped style/listeners.
7. Each changed collapsed-arrow action emits exactly one shared-shape value request whose value is the requested option ID.
8. Controlled rejected scale request retains current option and actual host scale without a second reconciliation event.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`resize--five-levels`, `resize--custom-levels`, `resize--narrow-reflow`, `resize--browser-zoom`, `resize--controlled-rejected`, `resize--shared-value-payload`, `resize--collapsed-arrow-rejected`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[886–886](../../upstream/krds/raw/components/component_10_02.html:886): 구조
- L[895–895](../../upstream/krds/raw/components/component_10_02.html:895): 1. 아이콘과 레이블 화면 크기 조정 옵션 목록을 실행하는 데 사용하는 버튼의 이름
- L[899–899](../../upstream/krds/raw/components/component_10_02.html:899): a. 작게 90% 축소
- L[900–900](../../upstream/krds/raw/components/component_10_02.html:900): b. 보통 100%, 기본 크기
- L[901–901](../../upstream/krds/raw/components/component_10_02.html:901): c. 조금 크게 110% 확대
- L[902–902](../../upstream/krds/raw/components/component_10_02.html:902): d. 크게 130% 확대
- L[903–903](../../upstream/krds/raw/components/component_10_02.html:903): e. 가장 크게 150% 확대
- L[896–905](../../upstream/krds/raw/components/component_10_02.html:896): 2. 옵션 사용자가 선택할 수 있는 화면 크기 조정 옵션 값의 목록 a. 작게 90% 축소 b. 보통 100%, 기본 크기 c. 조금 크게 110% 확대 d. 크게 130% 확대 e. 가장 크게 150% 확대
- L[906–906](../../upstream/krds/raw/components/component_10_02.html:906): 3. 선택값 사용자가 옵션 목록에서 선택한 값을 보여줌

### 사용성 가이드라인

- L[914–914](../../upstream/krds/raw/components/component_10_02.html:914): 사용성 가이드라인
- L[917–917](../../upstream/krds/raw/components/component_10_02.html:917): 옵션 레이블을 명확한 내용으로 제공한다.
- L[918–918](../../upstream/krds/raw/components/component_10_02.html:918): 옵션에 텍스트 레이블 없이 글자 크기만을 보여주는 아이콘만 제공되거나 확대 배율만 표시될 경우 사용자에 따라 이해가 어려울 수 있으므로 설명적인 레이블을 함께 제공해야 한다.
- L[929–929](../../upstream/krds/raw/components/component_10_02.html:929): 옵션을 5개 이내로 제공한다.
- L[930–930](../../upstream/krds/raw/components/component_10_02.html:930): 서비스 특성에 따라 확대/축소 옵션값을 추가하거나 제거할 수 있다. 옵션의 개수가 많아질 수록 인지적 부담이 증가하므로 옵션 개수는 5개 이내로 제공하는 것이 바람직하다.
- L[941–941](../../upstream/krds/raw/components/component_10_02.html:941): 반응형 레이아웃 사용을 고려한다.
- L[942–942](../../upstream/krds/raw/components/component_10_02.html:942): 사용자 에이전트의 확대 기능을 사용하여 화면을 400%까지 확대했을 때, 1920 x 1080 해상도의 모니터를 기준으로 뷰포트 너비가 480px로 줄어들어 모바일 레이아웃으로 전환된다.
- L[943–943](../../upstream/krds/raw/components/component_10_02.html:943): DPR(Device Pixel Ratio)이 2인 고해상도 모니터일 경우, 200%로 확대되었을 때 뷰포트 너비가 480px로 줄어든다.
- L[944–944](../../upstream/krds/raw/components/component_10_02.html:944): 따라서 화면을 확대했을 때 화면에 콘텐츠를 문제 없이 표시하기 위해서는 반응형 레이아웃을 사용하는 것이 용이하다.

### 플랫폼에 대한 고려 사항

- L[952–952](../../upstream/krds/raw/components/component_10_02.html:952): 플랫폼에 대한 고려 사항
- L[955–955](../../upstream/krds/raw/components/component_10_02.html:955): 모바일 애플리케이션에서는 별도 설정 화면에서 화면 크기 조정 기능을 제공할 수 있다.
- L[956–956](../../upstream/krds/raw/components/component_10_02.html:956): 모바일 애플리케이션에서는 ‘화면 크기 조정’ 컴포넌트를 사용하는 대신 사용자에게 익숙한 방식의 설정 화면에서 동등한 기능을 사용할 수 있도록 제공한다.

### 접근성 가이드라인

- L[1063–1063](../../upstream/krds/raw/components/component_10_02.html:1063): 접근성 가이드라인
- L[1066–1066](../../upstream/krds/raw/components/component_10_02.html:1066): 화면 크기를 조정했을 때 콘텐츠가 가려지거나 기능이 손실되지 않도록 한다.
- L[1067–1067](../../upstream/krds/raw/components/component_10_02.html:1067): '화면 크기 조정' 컴포넌트의 제공 목적은 사용자가 문제없이 읽을 수 있는 배율의 콘텐츠를 제공하는 것이므로 기본 크기에서 제공되는 콘텐츠, 기능은 조정된 배율의 화면에서도 문제없이 접근할 수 있어야 한다.
- L[1068–1068](../../upstream/krds/raw/components/component_10_02.html:1068): 조정된 배율의 화면에서 모든 콘텐츠와 기능을 기본 배율과 동일한 방식으로 사용할 수 있도록 해야 하는 것은 아니다. 모바일 레이아웃에서 메인 메뉴가 햄버거 메뉴 형식으로 전환되는 것처럼 콘텐츠와 기능에 대한 접근 방식은 달라질 수 있으나, 내용이 변형되어서는 안 된다.
- L[1075–1075](../../upstream/krds/raw/components/component_10_02.html:1075): 화면을 확대했을 때 화면 스크롤은 단일 방향으로 유지/생성되도록 한다.
- L[1076–1076](../../upstream/krds/raw/components/component_10_02.html:1076): 화면을 확대하여 뷰포트 영역이 좁아졌을 때, 요소의 배열/배치가 조정되지 않아 뷰포트 영역 밖으로 배치되어 스크롤이 생성되면 콘텐츠를 읽을 때 더 많은 노력이 필요하다.
- L[1077–1077](../../upstream/krds/raw/components/component_10_02.html:1077): 단, 이미지, 멀티미디어, 표와 같이 기본적으로 양방향으로 배치되는 특성을 가진 콘텐츠와 모바일 레이아웃에서는 세로, 가로 스크롤이 동시에 사용될 수 있다.

### 상호작용 가이드라인

- L[1088–1088](../../upstream/krds/raw/components/component_10_02.html:1088): 상호작용 가이드라인
- L[1090–1090](../../upstream/krds/raw/components/component_10_02.html:1090): 목록 확장 및 축소
- L[1108–1111](../../upstream/krds/raw/components/component_10_02.html:1108): Click 컨테이너를 Click 했을 때, 옵션 목록이 확장되거나 축소된다. 옵션 목록이 확장된 상태에서 레이블, 컨테이너, 옵션 목록이 아닌 영역을 Click 하면 옵션 목록은 축소되어야 한다.
- L[1112–1115](../../upstream/krds/raw/components/component_10_02.html:1112): Enter, Space 컨테이너에 초점이 있는 경우, 옵션 목록이 확장되거나 축소된다.
- L[1116–1119](../../upstream/krds/raw/components/component_10_02.html:1116): Esc 옵션 목록을 축소하고 컨테이너로 초점이 이동해야 한다.
- L[1126–1126](../../upstream/krds/raw/components/component_10_02.html:1126): 탐색
- L[1144–1147](../../upstream/krds/raw/components/component_10_02.html:1144): Tab, Shift + Tab Tab, Shift + Tab 키를 눌렀을 때 접근할 수 있어야 한다.
- L[1148–1151](../../upstream/krds/raw/components/component_10_02.html:1148): Scroll 옵션 목록에 스크롤이 생성된 경우 목록이 상/하로 이동한다.
- L[1158–1158](../../upstream/krds/raw/components/component_10_02.html:1158): 옵션 선택
- L[1176–1179](../../upstream/krds/raw/components/component_10_02.html:1176): Click 옵션 목록에서 특정 옵션을 Click 하면 해당 옵션으로 선택값이 변경된다.
- L[1180–1183](../../upstream/krds/raw/components/component_10_02.html:1180): Enter 옵션에 초점이 있는 경우, 해당 옵션값이 선택된 후 목록이 축소된다.
- L[1184–1187](../../upstream/krds/raw/components/component_10_02.html:1184): 방향키 ↑, ↓ 컨테이너에 초점이 있고 옵션 목록이 축소된 경우, 이전/다음 옵션으로 선택값이 변경된다.

### 예시

- L[1206–1206](../../upstream/krds/raw/components/component_10_02.html:1206): 예시
- L[1210–1210](../../upstream/krds/raw/components/component_10_02.html:1210): 기본
- L[1243–1243](../../upstream/krds/raw/components/component_10_02.html:1243): 기본 코드 확인하기

### 마크업 가이드

- L[1264–1264](../../upstream/krds/raw/components/component_10_02.html:1264): 마크업 가이드
- L[1267–1267](../../upstream/krds/raw/components/component_10_02.html:1267): CSS 선택자
- L[1287–1295](../../upstream/krds/raw/components/component_10_02.html:1287): 전체영역 .krds-drop-wrap .krds-resize 드롭다운 위치 .drop-left (왼쪽 정렬) .drop-right (오른쪽 정렬)
- L[1296–1299](../../upstream/krds/raw/components/component_10_02.html:1296): 드롭다운 메뉴 전체영역 .drop-menu
- L[1300–1303](../../upstream/krds/raw/components/component_10_02.html:1300): 드롭다운 메뉴 상단 .drop-top
- L[1304–1307](../../upstream/krds/raw/components/component_10_02.html:1304): 드롭다운 메뉴 리스트 .drop-list
- L[1308–1311](../../upstream/krds/raw/components/component_10_02.html:1308): 드롭다운 메뉴 하단 .drop-bottom

Inline preserved example markup (reference, not the public native API): L[1215–1237](../../upstream/krds/raw/components/component_10_02.html:1215)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- The callback now concretely uses the shared value field; exact CSS scale application/persistence remains host-owned independent integration, and the official option count/customization guidance remains unchanged.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1248 `../../code/resize.html`. Do not infer unseen contents.
- 6 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Shared implementation handoff

The exact semantic interface is `ResizeContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
