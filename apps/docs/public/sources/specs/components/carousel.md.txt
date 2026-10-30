# Carousel

**Contract status: scoped approved for native implementation.** The complete reviewed contract, including official evidence, is binding. This is specification acceptance only; native behavior, visual/asset review and executed coverage remain separate gates. No publication is authorized.

Semantic ID `carousel`; Korean name 캐러셀; export `Carousel`. Frozen baseline `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

Official detail: [component_04_09](https://www.krds.go.kr/html/site/component/component_04_09.html); preserved [HTML](../../upstream/krds/raw/components/component_04_09.html). Retrieved `2026-10-29T23:28:03.834Z`; `108858` bytes; SHA-256 `73d7d8f2691f3db02ede19f601675b4a23310fce5239e7b50211002d9676581d`. Verified against `catalog/components.json`, `upstream/krds/manifest.json`, and actual bytes. Website snapshot is distinct from kit tag 1.1.0.

## Scope and completion kind

Frozen source kind `component`; accepted project completion kind `component`. The project completion kind follows the evidence below; the specific completion obligations and host boundary are described in this contract.

Supported native cases (variant and state axes): `single`, `multiple`, `autoplay`, `manual`, `full-banner`, `element-banner`. These are native case names; state, responsive and appearance axes are not automatically official named variants. Exact official type/example headings remain in the evidence appendix.

## Native structure and mandatory ordering

Labeled carousel region with slides, previous/next buttons and position/total indicator. Whenever automatic playback can be requested, including controlled playing=true or explicit Play from initially manual intent, stop/play is the first interactive descendant. Only primary visible slides expose interactive descendants/AT; hidden/partial slides do not. One item hides all carousel controls. Slide count <=5 guidance.

## Plain semantic API

Independent API: items {id,label,content}[], `index?/defaultIndex=0`, `onIndexChange({index,reason})`, layout=single|multiple, autoplay=false, intervalMs=6000, `playing?:boolean`, `defaultPlaying?:boolean`, `onPlayingChange({playing:boolean,reason:play|stop|navigation})`, loop=false. Defined playing chooses controlled **playback intent**, absent playing chooses uncontrolled intent; defaultPlaying is read once and defaults to autoplay. Supplying both/mode switching is invalid. autoplay is a read-once uncontrolled intent initializer, not an override for controlled playing or any stop latch. For two or more slides the playback-capable API renders its Play/Stop control first even when initial intent is manual/false. Props alone emit no callbacks. Indicator=dots desktop/fraction below 1023px.

Playback intent is permission, not proof that a timer is advancing. Actual advancement requires committed intent true, at least two usable slides, an available next index, a visible mounted document, no current hover inhibition, no focus-stop or manual/navigation-stop latch, and reduced-motion permission. The local safety/official-inhibition state can halt advancement without mutating a controlled playing prop. Focus, hover, document visibility, mount and prop changes emit **zero user playback-change notifications**. Play/Stop or user navigation request intent changes once only when requested intent differs; a controlled rejection leaves the intent prop unchanged while the applicable stop latch still prevents actual motion. The play/pause label and playing/paused rendered state describe actual permitted advancement, not intent alone.

Timer ticks call `onIndexChange` once with `reason:"timer"` and a next-index request only while advancement is permitted. This is explicitly a system-origin index request, distinguishable from user reasons next/previous/indicator/swipe; it is not a user playback notification. Uncontrolled index commits each eligible changed tick; controlled index remains the prop if the host rejects the request. No duplicate input/click event or prop/reset/mount index callback is emitted. Each new interval may request another next index against the current committed index; a rejected tick never silently mutates it.

## Keyboard, focus and state transitions

Previous/next/indicator buttons and left/right indicator navigation work without swipe; swipe/drag must not hijack vertical page scroll. Official focus entry actually stops advancement and latches that stop until explicit Play ([L1335–1338](../../upstream/krds/raw/components/component_04_09.html:1335)); leaving focus or a host writing playing=true never clears that latch. Focus entry means crossing from outside into the carousel; internal focus movement does not fabricate a second entry. Hover always inhibits actual advancement while the pointer remains over the carousel ([L1347–1350](../../upstream/krds/raw/components/component_04_09.html:1347)), regardless of controlled intent or ignored pause requests.

Explicit Stop and user slide navigation also set a local stop latch (navigation stop is project policy). Explicit Play is the only action that clears the focus/manual/navigation stop latches; it also requests true intent if currently false. Thus Play while focus remains inside may permit playback, but Play while still hovered remains actually paused until pointer leaves; hover exit alone cannot clear a focus/manual latch. If a controlled Play request is rejected, intent remains false and no motion occurs. If intent is already true but inhibited, Play can clear latches without a redundant current-value callback. Explicit Stop with controlled playing=true requests false once yet halts locally even when the parent refuses. Externally changing intent false/true does not count as explicit Play.

Cancel the active interval immediately on inhibition; when all gates permit advancement again, begin a fresh full interval rather than firing a stale partially elapsed tick. Restore safe focus before a currently focused slide is hidden. Hide/unmount cleans timers/observers; stale generation ticks cannot request an index after teardown or replacement.

**Explicit Stop while locally inhibited (accepted independent closure):** For at least two slides, the first playback control group keeps the primary play-pause label truthful to actual permitted advancement: 정지 while advancing, 재생 while paused. Whenever committed playback intent remains true but actual advancement is inhibited, also render a distinct native type=button named 자동 재생 중지, owned part stop-intent with paused/disabled vocabulary. It is in that first playback group before slide navigation. Activating it by a real pointer click or keyboard activation latches manual stop and emits one playing=false request with reason stop even if the controlled host rejects it; rejection never clears the latch or mutates the intent prop. Passive focus/hover emits zero playback requests. Do not capture an obsolete pre-hover/pre-focus label or use synthetic dispatch to claim a Stop action. Explicit Play retains the existing latch-clear and current-intent no-op callback rules. Single-item carousels render neither primary nor stop-intent/navigation controls.

## Responsive/mobile requirements

Below 1023px fraction indicator replaces dots. Touch controls >=44×44 recommended, pointer >=17×17; readable 1–2 line content and clear boundaries. Reduced motion defaults to no autoplay/no sliding animation, a documented independent accessibility choice.

## Forms, reset and composition

No form/reset state; no composition-key navigation from embedded inputs.

## Asset, integration and composition completion

Official examples reference Swiper CSS/JS; native contract reproduces documented outcomes without executing original KRDS JS or requiring Swiper. Host owns slide content/local assets. Completion must include actual navigation/autoplay state and hidden-slide accessibility.

## Stable parts and states

root, viewport, list, slide, previous, next, indicators, indicator, position, play-pause, stop-intent; active,hidden,playing,paused,disabled.

All rendered owned parts use `data-krds-component="carousel"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## Required native user outcomes

1. Focus entry pauses and leaving does not restart.
2. Stop/play first in keyboard order.
3. Hidden and partial slides have no accessible/tabbable descendants.
4. Arrow/indicator/swipe reach same slide.
5. One item removes controls.
6. Timers do not fire after unmount.
7. Reduced motion never autostarts.
8. Controlled playing=true cannot bypass focus-stop or hover inhibition even when the parent ignores pause requests, and focus or hover produces no user-change callbacks.
9. Explicit Play clears the focus latch while hover continues to inhibit actual advancement until pointer exit; leaving focus without Play never resumes.
10. Controlled rejected explicit Stop still halts actual motion through a local latch without mutating the playing intent prop.
11. Timer index requests are identified by reason timer, occur once per eligible interval and never mutate a rejected controlled index.

These are required future tests, not executed/accepted results. In addition verify visible focus, forced colors, 200% text zoom, narrow layout, noncolor state cues, and reduced motion where movement exists. Never claim success from an empty suite.

## Required native stories

`carousel--single`, `carousel--multiple`, `carousel--manual`, `carousel--autoplay`, `carousel--paused-on-focus`, `carousel--single-item`, `carousel--narrow-fraction`, `carousel--reduced-motion`, `carousel--controlled-inhibition`, `carousel--play-while-focused-hovered`, `carousel--controlled-stop-rejected`, `carousel--timer-request-rejected`.

Each case needs local args/inputs/slots and observable pure local state in every applicable native renderer: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular; Solid 2 preview is separately isolated. Full-catalog story obligations are staged separately in `catalog/full-catalog-stories.json`; current pilot runner selection is unchanged. Native availability must be accepted before activation. Keep behavioral suites separate from story files; supported upstream siheom adapters only. Lit/Solid 2 must use their selected native test path without inventing siheom support. Qwik tests the first lazy event; Angular form-bearing controls must test CVA/reset and partial APF consumption; Lit must verify real Shadow DOM naming/target relationships; Solid 2 must never import Solid 1 compiler/renderer. No foreign-renderer wrappers.

## Official evidence, separate from independent policy

The following excerpts were extracted from this item’s actual preserved detailed HTML, including substantive guidance and interaction/markup tables. Source language is retained to avoid inventing official requirements. Wording such as “consider/recommended/can” remains advisory; an example/CSS selector is not proof of universal mandatory behavior. Source JS function tables are reference evidence only: original KRDS JS must not execute on native-controlled DOM. Shared APIs, defaults, extra keyboard rules, failure cleanup and host-driver policies above are independent choices except where these excerpts expressly support them.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_04_09.html:883): 구조
- L[891–894](../../upstream/krds/raw/components/component_04_09.html:891): 1. 컨테이너 캐러셀 항목과 관련 컨트롤이 시각적으로 표시되는 영역
- L[900–900](../../upstream/krds/raw/components/component_04_09.html:900): a. 기본 항목 컨테이너 내에서 시각적으로 완전하게 표시되는 항목
- L[901–901](../../upstream/krds/raw/components/component_04_09.html:901): b. 작은/가려진 항목 항목 목록의 가장 첫 번째, 가장 마지막 항목을 작게 표현하거나 컨테이너 영역에 가려지도록 표현한 것. 숨겨진 콘텐츠가 있음을 암시하여 콘텐츠 탐색을 유도함
- L[895–904](../../upstream/krds/raw/components/component_04_09.html:895): 2. 캐러셀 항목 캐러셀을 구성하고 있는 개별 콘텐츠 a. 기본 항목 컨테이너 내에서 시각적으로 완전하게 표시되는 항목 b. 작은/가려진 항목 항목 목록의 가장 첫 번째, 가장 마지막 항목을 작게 표현하거나 컨테이너 영역에 가려지도록 표현한 것. 숨겨진 콘텐츠가 있음을 암시하여 콘텐츠 탐색을 유도함
- L[905–908](../../upstream/krds/raw/components/component_04_09.html:905): 3. 탐색 버튼 항목 목록의 이전/다음 요소를 탐색하는 데 사용되는 버튼
- L[914–915](../../upstream/krds/raw/components/component_04_09.html:914): a. 도형 식별자를 시각적으로 강조하여 표현한 유형으로 일반적으로 원 아이콘이 사용됨. 화면 너비가 충분하거나 전체 슬라이드 수가 5개 이내인 경우에 사용하기 적합하며, 각 슬라이드로 이동할 수 있는 수단으로 활용됨
- L[918–918](../../upstream/krds/raw/components/component_04_09.html:918): 예) 3/5
- L[916–920](../../upstream/krds/raw/components/component_04_09.html:916): b. 분수 전체 항목 수와 탐색 중인 항목 순서를 숫자로 표시함 예) 3/5
- L[909–923](../../upstream/krds/raw/components/component_04_09.html:909): 4. 항목 탐색 식별자 캐러셀의 전체 항목 수와 활성화된 항목의 순서 정보를 표시함 a. 도형 식별자를 시각적으로 강조하여 표현한 유형으로 일반적으로 원 아이콘이 사용됨. 화면 너비가 충분하거나 전체 슬라이드 수가 5개 이내인 경우에 사용하기 적합하며, 각 슬라이드로 이동할 수 있는 수단으로 활용됨 b. 분수 전체 항목 수와 탐색 중인 항목 순서를 숫자로 표시함 예) 3/5
- L[924–927](../../upstream/krds/raw/components/component_04_09.html:924): 5. 정지/재생 버튼 자동 회전 캐러셀에서 움직임을 정지하거나 재생하는 데 사용하는 버튼

### 유형

- L[935–935](../../upstream/krds/raw/components/component_04_09.html:935): 유형
- L[937–937](../../upstream/krds/raw/components/component_04_09.html:937): 레이아웃
- L[939–939](../../upstream/krds/raw/components/component_04_09.html:939): 단일 항목
- L[940–941](../../upstream/krds/raw/components/component_04_09.html:940): 캐러셀 컨테이너에 기본 항목이 1개만 표시되어 사용자는 한 번의 탐색에서 하나의 정보에 집중할 수 있다. 단일 항목 중에서도 항목이 전체 화면 크기로 제공되거나 본문 높이의 절반 이상을 차지하는 전체 화면 유형은 메인 화면 히어로 영역이나 사용자가 주목해야 하는 콘텐츠를 전달하는 데 사용하기 적합하다.
- L[950–950](../../upstream/krds/raw/components/component_04_09.html:950): 다중 항목
- L[951–952](../../upstream/krds/raw/components/component_04_09.html:951): 캐러셀 컨테이너에 기본 항목이 2개 이상 표시된다. 미디어 콘텐츠, 정책, 법령과 같은 여러 항목의 정보를 탐색하는 데 적합하다. 화면 너비에 따라 항목의 크기가 줄어들 경우 정보를 표시하는 데 제약이 있을 수 있으므로 항목 내부에 복잡한 이미지나 텍스트가 제공되어야 한다면 정보를 적절히 인지할 수 있는 항목 수를 선택하거나 단일 항목 레이아웃을 사용해야 한다.
- L[962–962](../../upstream/krds/raw/components/component_04_09.html:962): 애니메이션
- L[964–964](../../upstream/krds/raw/components/component_04_09.html:964): 자동 회전
- L[965–966](../../upstream/krds/raw/components/component_04_09.html:965): 일정 시간 이후에 다음 슬라이드 항목으로 전환된다. 자동 회전을 사용하는 경우, 항목에 포함된 콘텐츠의 복잡성을 고려하여 적절한 시간 간격으로 콘텐츠가 전환될 수 있도록 해야 한다. 또한 콘텐츠를 이해하는 데 더 많은 시간이 필요한 사용자, 애니메이션에 민감한 사용자를 위해 자동 회전을 정지할 수 있는 컨트롤을 제공해야 한다.
- L[970–970](../../upstream/krds/raw/components/component_04_09.html:970): 고정
- L[971–971](../../upstream/krds/raw/components/component_04_09.html:971): 사용자가 이전/다음 항목 탐색을 시도하는 경우에 회전 동작이 발생한다. 캐러셀이 고정되어 있으면 사용자가 캐러셀 요소임을 인지하지 못할 수 있기 때문에 가려진 항목을 사용하거나 탐색 버튼이 시각적으로 보다 명확하게 드러나야 한다.

### 용례

- L[979–979](../../upstream/krds/raw/components/component_04_09.html:979): 용례
- L[981–981](../../upstream/krds/raw/components/component_04_09.html:981): 사용하기 적합하지 않은 경우
- L[986–987](../../upstream/krds/raw/components/component_04_09.html:986): 캐러셀은 컨테이너 영역 바깥에 콘텐츠를 숨겨둔 상태로 숨어 있는 콘텐츠를 확인하기 위해서는 선형적으로 콘텐츠를 탐색해야 한다. 사용자가 캐러셀임을 인지하지 못하거나 캐러셀의 모든 콘텐츠를 탐색하지 않는 상황이 발생할 수 있으므로 중요한 콘텐츠를 표시하는 데 캐러셀을 사용하는 것은 적절하지 않다.
- L[983–989](../../upstream/krds/raw/components/component_04_09.html:983): 중요한 정보를 전달할 때 캐러셀은 컨테이너 영역 바깥에 콘텐츠를 숨겨둔 상태로 숨어 있는 콘텐츠를 확인하기 위해서는 선형적으로 콘텐츠를 탐색해야 한다. 사용자가 캐러셀임을 인지하지 못하거나 캐러셀의 모든 콘텐츠를 탐색하지 않는 상황이 발생할 수 있으므로 중요한 콘텐츠를 표시하는 데 캐러셀을 사용하는 것은 적절하지 않다.

### 사용성 가이드라인

- L[997–997](../../upstream/krds/raw/components/component_04_09.html:997): 사용성 가이드라인
- L[1000–1000](../../upstream/krds/raw/components/component_04_09.html:1000): 슬라이드 수를 5개 이내로 사용한다.
- L[1001–1001](../../upstream/krds/raw/components/component_04_09.html:1001): 슬라이드 수가 많으면 사용자의 인지 부하가 증가하고 이후에 캐러셀에서 필요한 정보를 다시 탐색하는 데 어려움을 겪게 된다. 대부분의 사용자는 캐러셀에서 3~4개의 슬라이드를 확인한 후 탐색을 중단한다. 항목 수가 많은 경우에는 캐러셀 대신 목록을 사용해야 한다.
- L[1008–1008](../../upstream/krds/raw/components/component_04_09.html:1008): 캐러셀 항목의 텍스트 콘텐츠는 1~2줄로 작성한다.
- L[1009–1009](../../upstream/krds/raw/components/component_04_09.html:1009): 각 캐러셀 항목에 지나치게 많은 정보가 제공되면 사용자의 인지적 부담이 증가한다. 캐러셀 항목에 포함된 텍스트는 가독성 있는 간단한 문구로 1~2줄 이하로 작성한다.
- L[1012–1012](../../upstream/krds/raw/components/component_04_09.html:1012): 캐러셀 항목의 콘텐츠의 윤곽이 명확하게 드러나도록 표현한다.
- L[1013–1013](../../upstream/krds/raw/components/component_04_09.html:1013): 배경색, 테두리, 그림자 등을 활용하여 캐러셀 각 항목이 변별되도록 표현해야 한다. 항목의 경계가 명확하게 변별되지 않으면 링크나 버튼으로 작동하는 캐러셀 항목은 상호작용 가능한 영역을 인지하기 어려우며, 다중 항목의 캐러셀에서 항목 간 구분이 어려워진다.
- L[1016–1016](../../upstream/krds/raw/components/component_04_09.html:1016): 캐러셀 관련 컨트롤, 항목 탐색 식별자가 캐러셀 항목과 중첩되지 않도록 한다.
- L[1017–1017](../../upstream/krds/raw/components/component_04_09.html:1017): 탐색 버튼, 항목 탐색 식별자를 캐러셀 항목 위에 제공하게 되면 각 항목에서 전달하고자 하는 정보가 가려질 가능성이 높다. 단, 전체 화면 유형의 단일 항목 캐러셀은 사용자가 캐러셀임을 인지할 수 있는 단서로서 해당 요소를 항목 하단의 일관된 영역에 배치할 수 있다.
- L[1029–1029](../../upstream/krds/raw/components/component_04_09.html:1029): 캐러셀 관련 컨트롤과 항목 탐색 식별자가 명확하게 인지될 수 있도록 표현한다.
- L[1030–1031](../../upstream/krds/raw/components/component_04_09.html:1030): 캐러셀 관련 컨트롤과 항목 탐색 식별자는 항목과 명확하게 구분되어야 한다. 만약 단일 항목, 전체 화면 레이아웃을 사용하여 항목과 요소들이 중첩되어야 하는 경우, 버튼 요소/영역과 항목 간 명도 대비를 분명하게 하거나 버튼 색상과 대비되는 그림자 또는 글로우 등을 활용하여 두 정보가 변별되도록 할 수 있다.
- L[1043–1043](../../upstream/krds/raw/components/component_04_09.html:1043): 캐러셀 관련 컨트롤과 항목 탐색 식별자를 일관된 위치에 표시한다.
- L[1044–1044](../../upstream/krds/raw/components/component_04_09.html:1044): 도형형 항목 탐색 식별자는 컨테이너 중앙, 분수형 항목 탐색 식별자는 컨테이터 우측 하단에 배치한다. 탐색 버튼은 레이아웃 유형에 따라 컨테이너 중앙의 좌/우 또는 우측 하단에 배치한다.
- L[1047–1047](../../upstream/krds/raw/components/component_04_09.html:1047): 전체 슬라이드 수와 사용자의 탐색 위치를 표시한다.
- L[1048–1048](../../upstream/krds/raw/components/component_04_09.html:1048): 사용자가 탐색 가능한 정보의 양을 가늠하고 탐색 중인 슬라이드 위치를 확인하여 필요에 따라 다시 정보를 탐색할 수 있도록 정보를 제공해야 한다.
- L[1051–1051](../../upstream/krds/raw/components/component_04_09.html:1051): 캐러셀 관련 컨트롤 요소를 쉽게 조작할 수 있도록 충분히 크게 표현한다.
- L[1052–1053](../../upstream/krds/raw/components/component_04_09.html:1052): 클릭, 터치 영역을 정교하게 조작하기 어려운 사용자를 고려하여, 마우스 상호작용에 대해서는 17px * 17px, 터치 상호작용에 대해서는 44px * 44px 이상의 영역에서 반응할 수 있는 컨트롤 크기를 사용할 것을 권장한다. 이때, 단위는 CSS 픽셀을 기준으로 한다.
- L[1056–1056](../../upstream/krds/raw/components/component_04_09.html:1056): 중요한 항목을 우선적으로 배치한다.
- L[1057–1058](../../upstream/krds/raw/components/component_04_09.html:1057): 사용자가 항상 캐러셀 내부의 모든 항목을 탐색하지는 않으므로 항목의 우선순위를 구분하여 시의성 있거나 사용자가 관심 있어 할 만한 정보를 우선적으로 배치한다. 우선순위의 지정을 통해 사용자가 캐러셀 항목을 탐색하는 과정에서의 지루함을 덜 수 있고, 사용자의 흥미를 끌어 더 많은 항목을 탐색하도록 유도할 수 있다.
- L[1061–1061](../../upstream/krds/raw/components/component_04_09.html:1061): 드래그 앤 드롭/스와이프로 슬라이드를 전환할 수 있도록 한다.
- L[1062–1062](../../upstream/krds/raw/components/component_04_09.html:1062): 별도의 탐색 버튼이 존재하는 상황에서도 사용자가 원하는 방식으로 캐러셀을 탐색할 수 있도록 드래그 앤 드롭 또는 스와이프 동작을 통해 슬라이딩 애니메이션이 작동할 수 있도록 한다.
- L[1069–1069](../../upstream/krds/raw/components/component_04_09.html:1069): 표시할 캐러셀 항목 수가 1개인 경우 캐러셀과 관련된 단서를 숨긴다.
- L[1070–1070](../../upstream/krds/raw/components/component_04_09.html:1070): 콘텐츠의 변경으로 캐러셀 항목 수가 1개가 되는 상황을 고려하여, 해당 상황이 발생하였을 때 탐색 버튼, 항목 탐색 식별자, 정지/재생 버튼을 숨겨 사용자가 불필요한 정보 탐색 행동을 수행하지 않도록 한다.

### 플랫폼에 대한 고려 사항

- L[1086–1086](../../upstream/krds/raw/components/component_04_09.html:1086): 플랫폼에 대한 고려 사항
- L[1089–1089](../../upstream/krds/raw/components/component_04_09.html:1089): 화면 크기가 충분한 경우 도형형 항목 탐색 식별자를 버튼으로 제공한다.
- L[1090–1090](../../upstream/krds/raw/components/component_04_09.html:1090): 식별자를 클릭하였을 때 해당 식별자에 상응하는 슬라이드로 전환하도록 한다. 이를 통해 사용자는 항목을 순차적으로 탐색하지 않고 원하는 순서의 슬라이드에 바로 접근할 수 있다.
- L[1097–1097](../../upstream/krds/raw/components/component_04_09.html:1097): 화면 크기가 충분하지 않은 경우 도형형 항목 탐색 식별자는 분수형으로 전환한다.
- L[1098–1098](../../upstream/krds/raw/components/component_04_09.html:1098): 페이지 너비가 1023px 미만이 되면 도형을 통한 슬라이드 수와 탐색 위치 파악, 버튼 기능의 이용이 어려워지므로 분수형 식별자로 전환해야 한다.

### 접근성 가이드라인

- L[1205–1205](../../upstream/krds/raw/components/component_04_09.html:1205): 접근성 가이드라인
- L[1208–1208](../../upstream/krds/raw/components/component_04_09.html:1208): 자동 재생 캐러셀에서 정지 버튼이 상호작용 가능한 첫 요소로 제공되어야 한다.
- L[1209–1209](../../upstream/krds/raw/components/component_04_09.html:1209): 캐러셀 항목과 다른 컨트롤 요소보다 우선적으로 접근 가능하도록 하여 항목을 원활하게 탐색할 수 있도록 해야 한다.
- L[1216–1216](../../upstream/krds/raw/components/component_04_09.html:1216): 단일 지점과의 상호작용을 통해 슬라이드를 탐색할 수 있는 수단을 제공한다.
- L[1217–1217](../../upstream/krds/raw/components/component_04_09.html:1217): 경로 기반의 상호작용, 다중 지점 상호작용이 아닌 단순 클릭/터치로 탐색할 수 있도록 한다
- L[1224–1224](../../upstream/krds/raw/components/component_04_09.html:1224): 캐러셀에서 제공되는 모든 기능을 키보드로 실행할 수 있도록 한다.
- L[1225–1225](../../upstream/krds/raw/components/component_04_09.html:1225): 캐러셀에서 제공되는 모든 기능은 마우스뿐만 아니라 키보드, 터치 인터페이스로 실행할 수 있어야 한다.
- L[1232–1232](../../upstream/krds/raw/components/component_04_09.html:1232): 키보드와 스크린 리더는 기본 항목에만 접근하도록 한다.
- L[1233–1234](../../upstream/krds/raw/components/component_04_09.html:1233): 작은/가려진 항목에 키보드와 스크린 리더 초점이 접근하게 되면 관련 인터페이스 및 보조 기술 사용자는 수 많은 캐러셀 항목을 모두 탐색하기 전까지 다음 콘텐츠 섹션을 탐색할 수 없다. 작은/가려진 항목에는 tabindex='-1', aria-hidden='true' 속성이나 display:none 스타일을 적용하여 사용자가 의도적으로 항목 탐색을 시도하기 전까지 작은/가려진 항목에 초점이 진입하지 않도록 해야 한다.
- L[1241–1241](../../upstream/krds/raw/components/component_04_09.html:1241): 텍스트가 포함된 이미지를 사용하지 않는다.
- L[1242–1242](../../upstream/krds/raw/components/component_04_09.html:1242): 슬라이드에 이미지를 추가하는 경우 로고의 일부가 아닌 한 텍스트(텍스트가 이미지의 일부인 경우)가 포함된 슬라이드는 피한다. 대신 해당 텍스트를 제목이나 본문 콘텐츠 내에 배치한다.

### 상호작용 가이드라인

- L[1253–1253](../../upstream/krds/raw/components/component_04_09.html:1253): 상호작용 가이드라인
- L[1255–1255](../../upstream/krds/raw/components/component_04_09.html:1255): 슬라이드 탐색
- L[1273–1279](../../upstream/krds/raw/components/component_04_09.html:1273): Click 화살표 아이콘을 Click 하면 이전 또는 다음 슬라이드로 넘어간다. 페이지네이션 인디케이터의 경우 특정 인디케이터를 선택하면 해당하는 슬라이드로 넘어간다.
- L[1280–1283](../../upstream/krds/raw/components/component_04_09.html:1280): Drag & Drop 가로 스크롤 인디케이터의 경우 스크롤바를 드래그하여 슬라이드를 넘길 수 있다.
- L[1284–1287](../../upstream/krds/raw/components/component_04_09.html:1284): 방향키 ←, → 페이지네이션 인디케이터의 경우 인디케이터 그룹에 초점이 있을 때 키보드 방향키 ←, →를 눌러 다음 또는 이전 콘텐츠로 선택을 전환한다.
- L[1288–1294](../../upstream/krds/raw/components/component_04_09.html:1288): Tab Tab 키를 눌러 캐러셀의 대화형 요소에 초점을 이동한다. 캐러셀의 마지막 콘텐츠에 초점이 있을 때 Tab 키를 누르면 페이지의 캐러셀 다음 항목으로 초점이 빠져나간다.
- L[1295–1298](../../upstream/krds/raw/components/component_04_09.html:1295): Shift+Tab 콘텐츠의 첫 번째 요소에 초점이 있는 경우 Shift + Tab 키를 누르면 페이지의 캐러셀 이전 항목으로 초점이 빠져나간다.
- L[1299–1302](../../upstream/krds/raw/components/component_04_09.html:1299): Enter 탐색 버튼에 초점이 있을 때 Enter 키를 눌러 기능을 활성화 한다.
- L[1303–1306](../../upstream/krds/raw/components/component_04_09.html:1303): Swipe 왼쪽이나 오른쪽으로 스와이프 하면 캐러셀이 좌우로 이동한다.
- L[1307–1310](../../upstream/krds/raw/components/component_04_09.html:1307): Tap 탐색 버튼을 Tap 하면 이전 또는 다음 슬라이드로 넘어간다.
- L[1317–1317](../../upstream/krds/raw/components/component_04_09.html:1317): 자동 재생 중지 및 재생
- L[1335–1338](../../upstream/krds/raw/components/component_04_09.html:1335): Tab 자동 재생 캐러셀의 경우 Tab 키를 눌러 캐러셀의 요소에 키보드 초점이 들어가면 자동 재생이 중지된다. 사용자가 재생 컨트롤을 활성화하지 않으면 다시 시작하지 않는다.
- L[1339–1342](../../upstream/krds/raw/components/component_04_09.html:1339): Enter 자동 재생 캐러셀의 재생 컨트롤에 초점이 있을 때 Enter 키를 눌러 기능을 활성화 한다.
- L[1343–1346](../../upstream/krds/raw/components/component_04_09.html:1343): Click 자동 재생 캐러셀의 경우 정지 버튼을 Click 하면 슬라이드가 정지되고, 재생 버튼을 Click 하면 다시 재생된다.
- L[1347–1350](../../upstream/krds/raw/components/component_04_09.html:1347): Hover 자동 재생 캐러셀의 경우 마우스를 캐러셀 위로 올렸을 때마다 재생을 중지한다.

### 예시

- L[1369–1369](../../upstream/krds/raw/components/component_04_09.html:1369): 예시
- L[1373–1373](../../upstream/krds/raw/components/component_04_09.html:1373): 풀 배너
- L[1493–1493](../../upstream/krds/raw/components/component_04_09.html:1493): 풀 배너 코드 확인하기
- L[1509–1509](../../upstream/krds/raw/components/component_04_09.html:1509): 요소 배너
- L[1631–1631](../../upstream/krds/raw/components/component_04_09.html:1631): 요소 배너 코드 확인하기

### 마크업 가이드

- L[1722–1722](../../upstream/krds/raw/components/component_04_09.html:1722): 마크업 가이드
- L[1725–1732](../../upstream/krds/raw/components/component_04_09.html:1725): KRDS의 캐러셀 컴포넌트는 Swiper 플러그인을 사용하여 제작되었으므로 해당 플러그인에 대한 자세한 사항은 Swiper 플러그인 사이트에서 확인 가능하다. Swiper 사이트 바로가기
- L[1733–1738](../../upstream/krds/raw/components/component_04_09.html:1733): 캐러셀 컴포넌트 사용 시에는 /resources/css/plugin/swiper-bundle.min.css /resources/js/plugin/swiper-bundle.min.js 파일을 페이지 내에 추가해 준다. (CDN 사용 시에는 해당 코드가 포함되어 있으므로 따로 추가하지 않아도 된다.)

Inline preserved example markup (reference, not the public native API): L[1378–1487](../../upstream/krds/raw/components/component_04_09.html:1378), L[1514–1625](../../upstream/krds/raw/components/component_04_09.html:1514)

Source references to CSS/JS/guide images are not copied implementations. The exact raw HTML of table rows (preserving required/optional columns) is retained in [source-evidence.json](../../catalog/source-evidence.json); flattened excerpts above do not reclassify a conditional selector as mandatory.

## Evidence limitations and recorded policy

- Playback intent, actual-inhibition gates, callback origins and latch precedence above are concrete independent API policy preserving the official focus/hover stop outcomes. The accepted independent defaults are loop=false and intervalMs=6000; unseen visual measurements still require visual review.
- Linked external code examples are referenced but not embedded/read as a separate file in this preparation: L1498 `../../code/carousel.html`, L1636 `../../code/carousel_banner.html`. Do not infer unseen contents.
- 14 guide image references occur in the detail; their embedded pixel diagrams were not visually inspected. Textual structure/guidance was read; exact visual measurements/assets need later visual/provenance review.
- Semantic interfaces and part/state tokens are frozen in `packages/contracts/src/full-catalog.ts`. Each native renderer still requires its own implementation, behavior/story sources and independent acceptance.

## Accepted independent resolution

The accepted independent initializers are autoplay=false, intervalMs=6000, loop=false and defaultIndex=0. Mandatory local focus/hover/visibility/reduced-motion inhibition takes precedence over controlled playback intent; source evidence is preserved.

## Shared implementation handoff

The exact semantic interface is `CarouselContract` in [full-catalog.ts](../../packages/contracts/src/full-catalog.ts); native frameworks extend only their own content/ref/event transport. The shared manifest freezes supported case axes, parts and states. No generic renderer or foreign-framework wrapper satisfies this contract. All required outcomes in this contract remain mandatory for components, compositions, assets and integrations.

Official quoted/derived text in this document retains its original KRDS rights and attribution; the independent code MIT grant does not relicense these excerpts, fonts or assets. Exact source identity above remains unchanged. Open evidence limitations concern uninspected guide pixels, linked code and asset clearance; they do not waive the substantive requirements quoted here.
