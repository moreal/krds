# 캐러셀 {#carousel}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 수락일 뿐이며, 네이티브 동작·시각/자산 검토·실행된 커버리지는 별도 게이트입니다. 어떤 게시도 승인되지 않았습니다.

시맨틱 ID `carousel`, 한국어 이름 캐러셀, export `Carousel`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_04_09](https://www.krds.go.kr/html/site/component/component_04_09.html), 보존된 [HTML](../../upstream/krds/raw/components/component_04_09.html). 조회 시각 `2026-10-29T23:28:03.834Z`, `108858` 바이트, SHA-256 `73d7d8f2691f3db02ede19f601675b4a23310fce5239e7b50211002d9676581d`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조해 확인했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 별개입니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류 `component`, 수용된 프로젝트 완료 종류 `component`. 프로젝트 완료 종류는 아래 근거를 따르며, 구체적인 완료 의무와 호스트 경계는 이 계약에 기술됩니다.

지원하는 네이티브 케이스(변형·상태 축): `single`, `multiple`, `autoplay`, `manual`, `full-banner`, `element-banner`. 이는 네이티브 케이스 이름이며, 상태·반응형·외관 축이 공식 명명 변형인 것은 아닙니다. 공식 유형/예시 제목 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

라벨이 있는 캐러셀 영역에 슬라이드, 이전/다음 버튼, 위치/전체 표시기를 둡니다. 자동 재생을 요청할 수 있는 경우(제어된 playing=true, 또는 처음 수동 의도에서의 명시적 재생 포함) 정지/재생이 첫 번째 상호작용 하위 요소입니다. 상호작용 하위 요소와 AT에는 주로 보이는 슬라이드만 노출하며, 숨겨졌거나 일부만 보이는 슬라이드는 노출하지 않습니다. 항목이 하나면 캐러셀 컨트롤을 모두 숨깁니다. 슬라이드는 5개 이하를 권장합니다.

## 의미 API {#plain-semantic-api}

독립 API: items {id,label,content}[], `index?/defaultIndex=0`, `onIndexChange({index,reason})`, layout=single|multiple, autoplay=false, intervalMs=6000, `playing?:boolean`, `defaultPlaying?:boolean`, `onPlayingChange({playing:boolean,reason:play|stop|navigation})`, loop=false. playing이 정의되면 제어되는 **재생 의도(playback intent)**이고, 없으면 비제어 의도입니다. defaultPlaying은 한 번만 읽으며 기본값은 autoplay입니다. 둘 다 주거나 모드를 바꾸는 것은 잘못된 사용입니다. autoplay는 한 번만 읽는 비제어 의도 초기화 값이며, 제어된 playing이나 정지 래치를 덮어쓰지 않습니다. 슬라이드가 둘 이상이면 재생 가능 API는 처음 의도가 수동/false여도 재생/정지 컨트롤을 첫 번째로 렌더합니다. prop만으로는 콜백이 나오지 않습니다. 표시기는 데스크톱에서 점(dots), 1023px 미만에서 분수(fraction)입니다.

재생 의도는 허락일 뿐, 타이머가 진행 중이라는 증거가 아닙니다. 실제 진행에는 다음이 모두 필요합니다. 커밋된 의도 true, 사용 가능한 슬라이드 둘 이상, 이용 가능한 다음 인덱스, 보이는 마운트된 문서, 현재 호버 억제 없음, 초점 정지/수동·탐색 정지 래치 없음, 동작 줄이기 허용. 로컬 안전/공식 억제 상태는 제어된 playing prop을 바꾸지 않고도 진행을 멈출 수 있습니다. 초점, 호버, 문서 가시성, 마운트, prop 변경은 **사용자 재생 변경 알림을 내지 않습니다**. 재생/정지 또는 사용자 탐색은 요청 의도가 다를 때만 의도 변경을 한 번 요청합니다. 제어 거부는 의도 prop을 바꾸지 않지만, 해당 정지 래치가 실제 움직임을 계속 막습니다. 재생/일시정지 레이블과 재생 중/일시정지 렌더 상태는 의도가 아니라 실제 허용된 진행을 나타냅니다.

타이머 틱은 진행이 허용될 때만 `onIndexChange`를 `reason:"timer"`로 한 번 호출해 다음 인덱스를 요청합니다. 이는 명시적인 시스템 기원 인덱스 요청이며, 사용자 사유 next/previous/indicator/swipe와 구별되고 사용자 재생 알림이 아닙니다. 비제어 인덱스는 변경된 적격 틱마다 커밋합니다. 제어 인덱스는 호스트가 요청을 거부하면 prop 값을 유지합니다. 중복 입력/클릭 이벤트나 prop/리셋/마운트 인덱스 콜백은 나오지 않습니다. 새 간격마다 현재 커밋된 인덱스를 기준으로 다음 인덱스를 다시 요청할 수 있습니다. 거부된 틱이 인덱스를 몰래 바꾸지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

이전/다음/표시기 버튼과 좌우 표시기 탐색은 스와이프 없이 동작합니다. 스와이프/드래그가 세로 페이지 스크롤을 가로채면 안 됩니다. 공식 초점 진입은 실제로 진행을 멈추고, 명시적 재생 전까지 그 정지를 래치합니다([L1335–1338](../../upstream/krds/raw/components/component_04_09.html:1335)). 초점을 벗어나거나 호스트가 playing=true를 써도 이 래치는 풀리지 않습니다. 초점 진입은 바깥에서 캐러셀 안으로 넘어오는 것을 뜻하며, 내부 초점 이동은 두 번째 진입을 만들지 않습니다. 호버는 포인터가 캐러셀 위에 있는 동안 제어 의도나 무시된 일시정지 요청과 관계없이 항상 실제 진행을 막습니다([L1347–1350](../../upstream/krds/raw/components/component_04_09.html:1347)).

명시적 정지와 사용자 슬라이드 탐색도 로컬 정지 래치를 설정합니다(탐색 정지는 프로젝트 정책). 명시적 재생만이 초점/수동/탐색 정지 래치를 모두 풀며, 현재 의도가 false면 true 의도도 요청합니다. 따라서 초점이 안에 남아 있어도 재생은 재생을 허용할 수 있지만, 여전히 호버 중이면 포인터가 떠날 때까지 실제로는 멈춰 있습니다. 호버 종료만으로는 초점/수동 래치를 풀 수 없습니다. 제어된 재생 요청이 거부되면 의도는 false로 남고 움직임은 없습니다. 의도가 이미 true인데 억제된 상태라면, 재생은 중복 현재값 콜백 없이 래치만 풀 수 있습니다. 제어된 playing=true에서 명시적 정지는 false를 한 번 요청하고, 부모가 거부해도 로컬에서 멈춥니다. 의도를 외부에서 false/true로 바꾸는 것은 명시적 재생으로 치지 않습니다.

억제가 시작되면 활성 간격을 즉시 취소합니다. 모든 게이트가 다시 진행을 허용하면 이미 일부 지난 틱을 발사하지 않고 새 전체 간격을 시작합니다. 현재 초점이 있는 슬라이드가 숨겨지기 전에 안전한 초점을 복원합니다. 숨김/언마운트 시 타이머와 옵저버를 정리합니다. 이전 세대 틱은 해체나 교체 후 인덱스를 요청할 수 없습니다.

**로컬 억제 중 명시적 정지(수용된 독립 결정):** 슬라이드가 둘 이상이면 첫 재생 컨트롤 그룹은 기본 재생-일시정지 레이블을 실제 허용된 진행에 맞춰 정직하게 유지합니다. 진행 중에는 정지, 일시정지 중에는 재생입니다. 커밋된 재생 의도가 true인데 실제 진행이 억제된 동안에는, 이름이 자동 재생 중지인 별도의 네이티브 type=button도 렌더합니다. 소유 파트는 stop-intent이고 paused/disabled 어휘를 씁니다. 이 버튼은 슬라이드 탐색보다 앞선 첫 재생 그룹에 둡니다. 실제 포인터 클릭이나 키보드 활성화로 누르면 수동 정지를 래치하고, 제어 호스트가 거부해도 reason stop인 playing=false 요청을 한 번 냅니다. 거부가 래치를 풀거나 의도 prop을 바꾸지 않습니다. 수동적 초점/호버는 재생 요청을 내지 않습니다. 호버/초점 이전의 오래된 레이블을 캡처하거나 합성 디스패치로 정지 동작을 주장하면 안 됩니다. 명시적 재생은 기존 래치 해제 및 현재 의도 무동작 콜백 규칙을 유지합니다. 항목이 하나인 캐러셀은 기본 컨트롤, stop-intent, 탐색 컨트롤을 렌더하지 않습니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

1023px 미만에서는 점 대신 분수 표시기를 씁니다. 터치 컨트롤은 44×44 이상을 권장하고 포인터는 17×17 이상입니다. 내용은 1~2줄로 읽을 수 있어야 하고 경계가 분명해야 합니다. 동작 줄이기에서는 기본적으로 자동 재생과 슬라이드 애니메이션이 없으며, 이는 문서화된 독립 접근성 선택입니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼/리셋 상태가 없습니다. 내장 입력에서 조합 키로 탐색하지 않습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

공식 예시는 Swiper CSS/JS를 참조합니다. 네이티브 계약은 KRDS 원본 JS를 실행하거나 Swiper를 요구하지 않고 문서화된 결과를 재현합니다. 슬라이드 콘텐츠와 로컬 자산은 호스트 소유입니다. 완료에는 실제 탐색·자동 재생 상태와 숨겨진 슬라이드 접근성이 포함되어야 합니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, viewport, list, slide, previous, next, indicators, indicator, position, play-pause, stop-intent; active,hidden,playing,paused,disabled.

렌더되는 모든 소유 파트는 `data-krds-component="carousel"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위 열거는 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정됩니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 초점 진입은 일시정지하고, 초점을 벗어나도 재시작하지 않습니다.
2. 정지/재생이 키보드 순서에서 첫 번째입니다.
3. 숨겨진 슬라이드와 일부만 보이는 슬라이드의 하위 요소는 접근할 수도 탭할 수도 없습니다.
4. 화살표·표시기·스와이프가 같은 슬라이드에 도달합니다.
5. 항목이 하나면 컨트롤이 사라집니다.
6. 언마운트 후 타이머가 발사되지 않습니다.
7. 동작 줄이기에서는 자동 시작하지 않습니다.
8. 제어된 playing=true는 부모가 일시정지 요청을 무시해도 초점 정지나 호버 억제를 우회할 수 없으며, 초점·호버는 사용자 변경 콜백을 내지 않습니다.
9. 명시적 재생은 초점 래치를 풀지만, 호버는 포인터가 나갈 때까지 실제 진행을 계속 막습니다. 재생 없이 초점만 벗어나면 재개되지 않습니다.
10. 제어에서 거부된 명시적 정지도 로컬 래치로 실제 움직임을 멈추며 playing 의도 prop은 바꾸지 않습니다.
11. 타이머 인덱스 요청은 reason timer로 식별되고, 적격 간격마다 한 번 발생하며, 거부된 제어 인덱스를 바꾸지 않습니다.

위 항목은 앞으로 필요한 테스트이며, 실행되었거나 인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색 이외의 상태 단서, 움직임이 있는 곳의 동작 줄이기를 검증합니다. 빈 스위트를 성공으로 간주하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`carousel--single`, `carousel--multiple`, `carousel--manual`, `carousel--autoplay`, `carousel--paused-on-focus`, `carousel--single-item`, `carousel--narrow-fraction`, `carousel--reduced-motion`, `carousel--controlled-inhibition`, `carousel--play-while-focused-hovered`, `carousel--controlled-stop-rejected`, `carousel--timer-request-rejected`.

각 케이스는 적용 가능한 모든 네이티브 렌더러(Solid 1, React, Svelte, Vue, Lit, Qwik, Angular)에서 로컬 args/입력/슬롯과 관찰 가능한 순수 로컬 상태를 가져야 합니다. Solid 2 미리보기는 별도로 격리됩니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 따로 마련되며, 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 수락되어야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 씁니다. Lit/Solid 2는 siheom 지원을 만들어 내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연(lazy) 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러/렌더러를 가져오면 안 됩니다. 다른 렌더러 래퍼는 금지입니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 보존된 상세 HTML 원본(본문 지침과 상호작용·마크업 표 포함)에서 추출했습니다. 공식 요구사항을 만들어 내지 않도록 원문 언어를 유지합니다. "고려한다/권장/할 수 있다" 같은 표현은 권고로 남습니다. 예시나 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원본 JS 함수 표는 참고 근거일 뿐이며, 네이티브가 제어하는 DOM에서 KRDS 원본 JS를 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립 선택입니다.

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

인라인으로 보존된 예시 마크업(참고용이며 공개 네이티브 API가 아님): L[1378–1487](../../upstream/krds/raw/components/component_04_09.html:1378), L[1514–1625](../../upstream/krds/raw/components/component_04_09.html:1514)

CSS/JS/가이드 이미지 원본 참조는 복사된 구현이 아닙니다. 필수/선택 열을 보존한 표 행의 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위 평탄화 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 재생 의도, 실제 억제 게이트, 콜백 기원, 래치 우선순위는 공식 초점/호버 정지 결과를 보존하는 구체적인 독립 API 정책입니다. 수용된 독립 기본값은 loop=false, intervalMs=6000이며, 확인하지 못한 시각 치수는 여전히 시각 검토가 필요합니다.
- 연결된 외부 코드 예시는 참조만 하고, 이번 준비에서 별도 파일로 포함하거나 읽지 않았습니다: L1498 `../../code/carousel.html`, L1636 `../../code/carousel_banner.html`. 확인하지 못한 내용은 추정하지 않습니다.
- 상세에 가이드 이미지 참조가 14개 있으며, 내장 픽셀 도식은 시각적으로 검사하지 않았습니다. 텍스트 구조와 지침만 읽었으며, 정확한 시각 치수와 자산은 이후 시각/출처 검토가 필요합니다.
- 의미 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정됩니다. 각 네이티브 렌더러는 자체 구현, 동작/스토리 소스, 독립 인수가 여전히 필요합니다.

## 수용된 독립 결정 {#accepted-independent-resolution}

수용된 독립 초기값은 autoplay=false, intervalMs=6000, loop=false, defaultIndex=0입니다. 필수 로컬 초점/호버/가시성/동작 줄이기 억제가 제어된 재생 의도보다 우선하며, 출처 근거는 보존됩니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `CarouselContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트가 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트·조합·자산·통합에 계속 필수입니다.

이 문서의 공식 인용·파생 텍스트는 원래 KRDS 권리와 출처 표기를 유지하며, 독립 코드 MIT 부여는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며, 여기 인용한 실질 요구사항을 면제하지 않습니다.
