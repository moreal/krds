# 아코디언 {#accordion}

**계약 상태: 네이티브 구현용으로 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 승인일 뿐입니다. 네이티브 동작, 시각·자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `accordion`, 한국어 이름 아코디언, export `Accordion`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_04_07](https://www.krds.go.kr/html/site/component/component_04_07.html). 보존 [HTML](../../upstream/krds/raw/components/component_04_07.html). 조회 시각 `2026-10-29T23:28:03.699Z`, `84688` 바이트, SHA-256 `b7cd55bbfda033e500711ddf92543704e918c0e041c418856c5ac3445cbf9b3a`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 별개입니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 원천 종류 `component`, 수용된 프로젝트 완료 종류 `component`. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 케이스(변형·상태 축): `default`, `line`. 이는 네이티브 케이스 이름입니다. 상태·반응형·외형 축이 곧 공식 명명 변형은 아닙니다. 공식 유형·예시 제목은 근거 부록에 그대로 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

페이지에 맞는 제목 수준을 가진 순서 있는 콘텐츠 섹션입니다. 각 섹션은 전체 너비 type=button 트리거, 상태 아이콘, 인접한 연결 패널을 포함합니다. 펼침 상태를 노출합니다. 패널은 독립적인 세로·가로 스크롤을 갖지 않습니다. 필수 콘텐츠를 중첩 아코디언·탭 안에 숨기지 않습니다.

## 의미 API {#plain-semantic-api}

독립 API: items {id,title,content}[], openIds/defaultOpenIds=[], onOpenChange({ids}), multiple=true, variant=default|line. 공식 페이지가 단일 펼침을 요구하지 않으므로 multiple과 초기 정책은 독립적 선택입니다. 안정적인 ID로 트리거와 패널을 연결합니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 정의된 value/open은 제어 모드이고 undefined는 비제어 모드입니다. 제어 prop과 기본값을 함께 주거나 모드를 바꾸면 잘못된 구성입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 시맨틱 변경 요청을 한 번 내보냅니다. 비활성, 변화 없음, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 모드에서 거부되면 커밋된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 우선합니다. 추가 필드로 렌더러·머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

Tab은 헤더와 열린 콘텐츠를 순회합니다. Enter/Space/클릭은 한 번 토글하고 초점은 헤더에 머뭅니다. 헤더 전체가 클릭 대상입니다. 닫힌 콘텐츠는 초점을 받거나 읽을 수 없습니다. 초점이 있는 패널이 외부에서 닫히면 초점은 해당 트리거로 돌아갑니다. 필수 화살표 키 roving 모델은 만들지 않습니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

긴 패널은 자연스러운 페이지 스크롤을 씁니다. 제목·레이블은 읽기 좋게 줄바꿈하고 상태 아이콘은 위치를 일정하게 유지합니다. 동작 줄이기는 논리적 펼침 상태를 바꾸지 않습니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

집계 폼 값이나 리셋은 없습니다. 접을 때 자식 폼 값은 기본적으로 보존합니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 관련 콘텐츠와 제목 수준을 제공합니다. 완료에는 default/line 스타일로 독립 펼침되는 실제 섹션이 필요합니다.

## 고정 파트와 상태 {#stable-parts-and-states}

파트: root, item, heading, trigger, icon, panel. 상태: open,closed,disabled (명시적으로 지원하는 경우).

렌더링되는 모든 소유 파트는 `data-krds-component="accordion"`, 하나의 `data-krds-part` 토큰, 공백으로 구분된 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 우선합니다. 위 문장의 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 제목·버튼 관계와 상태에 접근할 수 있다.
2. 포인터/Enter/Space는 트리거 초점을 유지하며 한 번 토글한다.
3. 긴 패널을 열면 페이지 스크롤을 쓴다.
4. 숨겨진 링크는 사용할 수 없다.
5. 다중 펼침 정책이 명시적이고 제어 모드 거부가 안정적이다.

이 항목은 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색 이외의 상태 단서, 움직임이 있는 곳의 동작 줄이기를 확인합니다. 빈 스위트를 성공으로 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`accordion--default`, `accordion--line`, `accordion--multiple-open`, `accordion--interactive-panel`, `accordion--long-panel`, `accordion--controlled`.

각 케이스는 해당하는 모든 네이티브 렌더러에서 로컬 args/inputs/slots와 관찰 가능한 순수 로컬 상태를 가져야 합니다. 대상은 Solid 1, React, Svelte, Vue, Lit, Qwik, Angular이며 Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 단계별로 따로 있으며 현재 파일럿 러너의 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 수용되어야 합니다. 동작 스위트는 스토리 파일과 분리하며 지원되는 upstream siheom 어댑터만 씁니다. Lit과 Solid 2는 선택된 네이티브 테스트 경로를 쓰며 siheom 지원을 만들어 내지 않습니다. Qwik은 첫 lazy 이벤트를 테스트합니다. Angular의 폼 컨트롤은 CVA·리셋과 partial APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러·렌더러를 가져오면 안 됩니다. 다른 렌더러의 래퍼는 쓰지 않습니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 실제 보존된 상세 HTML에서 가져왔으며 핵심 지침과 상호작용·마크업 표를 포함합니다. 공식 요구사항을 만들어 내지 않도록 원문 언어를 유지합니다. “고려/권장/가능” 같은 표현은 권고로 남습니다. 예시와 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원문 JS 함수 표는 참고 근거일 뿐이며 원본 KRDS JS는 네이티브가 제어하는 DOM에서 실행하면 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립적 선택입니다.


### 구조

- L[884–884](../../upstream/krds/raw/components/component_04_07.html:884): 구조
- L[893–893](../../upstream/krds/raw/components/component_04_07.html:893): a. 제목 패널 섹션의 콘텐츠 제목
- L[894–894](../../upstream/krds/raw/components/component_04_07.html:894): b. 아이콘 패널의 펼침/접힘 상태를 나타냄
- L[890–896](../../upstream/krds/raw/components/component_04_07.html:890): 1. 헤더 a. 제목 패널 섹션의 콘텐츠 제목 b. 아이콘 패널의 펼침/접힘 상태를 나타냄
- L[897–900](../../upstream/krds/raw/components/component_04_07.html:897): 2. 패널 헤더 하위에 속하는 콘텐츠 섹션

### 용례

- L[908–908](../../upstream/krds/raw/components/component_04_07.html:908): 용례
- L[910–910](../../upstream/krds/raw/components/component_04_07.html:910): 사용하기 적합한 경우
- L[912–913](../../upstream/krds/raw/components/component_04_07.html:912): 아코디언 컴포넌트는 콘텐츠가 숨겨진 형태이므로 사용자가 콘텐츠가 있음을 인지하지 못할 가능성이 있으며, 콘텐츠를 표시하기 위해 헤더를 클릭할 것인지에 대한 의사결정 과정이 필요하기 때문에 사용자의 인지적 부담을 증가시킨다. 그러므로 다음 중 하나에 해당하고 아코디언을 사용함으로써 사용자에게 도움이 된다는 뚜렷한 증거가 없는 경우에는 가급적 아코디언 컴포넌트를 사용하지 않아야 한다.
- L[915–915](../../upstream/krds/raw/components/component_04_07.html:915): 모바일 스크린, 사이드 패널과 같이 공간이 부족하여 긴 콘텐츠를 한 번에 보여주기 어려운 경우
- L[916–916](../../upstream/krds/raw/components/component_04_07.html:916): 사용자가 여러 콘텐츠 섹션 중 일부의 정보만 필요로 하는 경우
- L[917–917](../../upstream/krds/raw/components/component_04_07.html:917): 사용자가 여러 콘텐츠 섹션 전체를 다 읽어야 할 만큼 중요한 정보가 아니어서 화면의 스크롤을 줄이고자 하는 경우
- L[918–918](../../upstream/krds/raw/components/component_04_07.html:918): 사용자가 서로 관련된 여러 콘텐츠 섹션의 개요를 빠르게 파악하고 비교해야 하는 경우
- L[923–923](../../upstream/krds/raw/components/component_04_07.html:923): 사용하기 적합하지 않은 경우
- L[925–925](../../upstream/krds/raw/components/component_04_07.html:925): 아코디언을 사용하기에 앞서 다른 컴포넌트나 패턴을 사용하여 콘텐츠를 제공하는 방안을 최우선으로 고려해야 한다. 콘텐츠를 적절히 구조화하여 표현하면 아코디언을 사용하지 않고도 효과적으로 정보를 전달할 수 있다.
- L[930–930](../../upstream/krds/raw/components/component_04_07.html:930): 아코디언의 상호작용 방식에 익숙하지 않은 사용자도 있으며 중요한 정보를 놓칠 가능성이 높아진다.
- L[927–932](../../upstream/krds/raw/components/component_04_07.html:927): 사용자가 콘텐츠의 전체 또는 대부분을 반드시 확인해야 하거나 중요도가 높은 정보인 경우 아코디언의 상호작용 방식에 익숙하지 않은 사용자도 있으며 중요한 정보를 놓칠 가능성이 높아진다.
- L[936–936](../../upstream/krds/raw/components/component_04_07.html:936): 아코디언과 탭은 콘텐츠를 숨겨둔 상태에서 사용자가 콘텐츠의 표시 여부를 선택해야 하기 때문에 사용자의 인지적 부담을 더욱 증가시킬 수 있다.
- L[933–938](../../upstream/krds/raw/components/component_04_07.html:933): 하위 또는 상위 요소로 이미 아코디언 컴포넌트가 사용되었거나 탭 패턴이 사용된 경우 아코디언과 탭은 콘텐츠를 숨겨둔 상태에서 사용자가 콘텐츠의 표시 여부를 선택해야 하기 때문에 사용자의 인지적 부담을 더욱 증가시킬 수 있다.
- L[942–942](../../upstream/krds/raw/components/component_04_07.html:942): 이 경우 콘텐츠를 여러 페이지에 분할하여 제공하는 것이 적합하다.
- L[939–944](../../upstream/krds/raw/components/component_04_07.html:939): 패널 내부 콘텐츠의 양이 많거나 복잡하여 표시되는 데 많은 시간이 걸리는 경우 이 경우 콘텐츠를 여러 페이지에 분할하여 제공하는 것이 적합하다.
- L[948–948](../../upstream/krds/raw/components/component_04_07.html:948): 콘텐츠를 하나의 페이지에 제공하고 섹션의 헤딩을 명확하게 구분하는 것만으로 콘텐츠를 쉽게 인지할 수 있다. 필요한 경우 콘텐츠 상단부에 사용자가 페이지의 특정 섹션으로 이동할 수 있는 링크 목록을 제공할 수 있다.
- L[945–950](../../upstream/krds/raw/components/component_04_07.html:945): 콘텐츠가 매우 단순한 경우 콘텐츠를 하나의 페이지에 제공하고 섹션의 헤딩을 명확하게 구분하는 것만으로 콘텐츠를 쉽게 인지할 수 있다. 필요한 경우 콘텐츠 상단부에 사용자가 페이지의 특정 섹션으로 이동할 수 있는 링크 목록을 제공할 수 있다.

### 사용성 가이드라인

- L[959–959](../../upstream/krds/raw/components/component_04_07.html:959): 사용성 가이드라인
- L[962–962](../../upstream/krds/raw/components/component_04_07.html:962): 아코디언의 확장 상태를 나타내는 아이콘은 항상 일관된 위치에 제공한다.
- L[963–964](../../upstream/krds/raw/components/component_04_07.html:963): 아코디언을 서로 관련 있는 콘텐츠 섹션의 정보를 전달하기 위한 목적으로 사용하는 경우에는 아이콘을 헤더의 끝에 배치하는 것이 바람직하다. 헤더 목록에서 텍스트가 같은 위치에서 시작될 수 있어 사용자의 안구 운동 피로도를 줄일 수 있다. 만약 콘텐츠 섹션 목록이 트리 구조로 구성되어 있다면 이러한 정보를 전달하기 위해서 아이콘을 헤더의 시작 부분에 배치할 수 있다.
- L[967–967](../../upstream/krds/raw/components/component_04_07.html:967): 아코디언의 확장 상태를 나타내는 아이콘은 패널이 펼쳐지거나 접히는 방향을 정확하게 반영하도록 제공한다.
- L[968–968](../../upstream/krds/raw/components/component_04_07.html:968): 아코디언이 접혀 있는 경우 사용자가 확장 가능한 영역이 있음을 알 수 있도록 'V' 또는 '+' 아이콘이, 펼쳐진 경우에는 '^', '-' 아이콘이 제공되어야 한다.
- L[976–976](../../upstream/krds/raw/components/component_04_07.html:976): 헤더 전체를 클릭 가능하도록 만든다.
- L[977–978](../../upstream/krds/raw/components/component_04_07.html:977): 상호작용이 가능한 타깃 영역이 클수록 사용자가 더 쉽게 조작할 수 있다. 사용자가 패널을 펼치거나 접기 위해 헤더 전체를 클릭할 수 있도록 구현해야 한다. 만약, 패널 내부 콘텐츠에 링크, 버튼과 같은 인터페이스가 포함되어 있다면 헤더와 패널 사이에 충분한 공간을 확보하여 사용자가 실수로 헤더를 클릭하지 않도록 해야 한다.
- L[989–989](../../upstream/krds/raw/components/component_04_07.html:989): 헤더와 패널은 서로 관련 있는 것으로 인지될 수 있게 표현한다.
- L[990–990](../../upstream/krds/raw/components/component_04_07.html:990): 헤더와 패널이 하나의 콘텐츠 섹션으로 인지될 수 있게 표현되어야 하며, 필요한 경우 여백, 색상, 그림자, 선을 사용할 수 있다.
- L[1001–1001](../../upstream/krds/raw/components/component_04_07.html:1001): 패널 영역에 스크롤이 발생하지 않도록 한다.
- L[1002–1002](../../upstream/krds/raw/components/component_04_07.html:1002): 패널 내부 콘텐츠가 길어져 화면의 뷰포트를 넘어가는 경우, 페이지 스크롤을 통해 콘텐츠를 탐색할 수 있어야 한다. 패널 영역에 별도의 세로, 가로 스크롤이 생성되어서는 안 된다.

### 접근성 가이드라인

- L[1113–1113](../../upstream/krds/raw/components/component_04_07.html:1113): 접근성 가이드라인
- L[1116–1116](../../upstream/krds/raw/components/component_04_07.html:1116): 아코디언에 접근 가능한 제목을 제공한다.
- L[1117–1117](../../upstream/krds/raw/components/component_04_07.html:1117): 아코디언 헤더 내부의 제목은 페이지의 다른 콘텐츠의 구조에 맞추어 &lt;h1&gt;~&lt;h6&gt; 태그로 마크업한다. 스크린 리더 사용자가 아코디언 목록에서 어떤 정보를 확인할 수 있는지 개요를 파악하고 필요한 정보를 빠르게 탐색하는 데 도움이 된다.
- L[1124–1124](../../upstream/krds/raw/components/component_04_07.html:1124): 아코디언의 활성화 상태 정보를 스크린 리더에서 확인할 수 있도록 한다.
- L[1125–1125](../../upstream/krds/raw/components/component_04_07.html:1125): 아코디언의 확장 상태에 대한 정보를 텍스트 정보로 제공(펼치기/접기, 축소됨/확장됨)하여 스크린 리더 사용자가 컨트롤의 상태를 인지할 수 있도록 해야 한다.
- L[1131–1131](../../upstream/krds/raw/components/component_04_07.html:1131): 헤더를 버튼 역할로 제공한다.
- L[1132–1132](../../upstream/krds/raw/components/component_04_07.html:1132): 헤더를 실행하였을 때 특정 섹션이나 화면으로 이동하는 것이 아니므로 &lt;button&gt;을 사용하거나 role="button"을 사용하여 스크린 리더에서 버튼 역할임을 인지할 수 있도록 한다.

### 상호작용 가이드라인

- L[1143–1143](../../upstream/krds/raw/components/component_04_07.html:1143): 상호작용 가이드라인
- L[1145–1145](../../upstream/krds/raw/components/component_04_07.html:1145): 헤더 목록 탐색
- L[1163–1166](../../upstream/krds/raw/components/component_04_07.html:1163): Tab, Shift + Tab 아코디언 목록의 헤더 버튼에 순차적으로 접근한다.
- L[1173–1173](../../upstream/krds/raw/components/component_04_07.html:1173): 패널 확장 또는 축소
- L[1191–1194](../../upstream/krds/raw/components/component_04_07.html:1191): Click 사용자가 헤더 영역 전체 또는 아이콘을 Click 하면 아코디언의 확장 상태가 변경된다.
- L[1195–1198](../../upstream/krds/raw/components/component_04_07.html:1195): Enter, Space 헤더에 초점이 있는 상태에서 Enter 또는 Space 키를 누르면 아코디언의 확장 상태가 변경된다. 이때, 초점은 헤더에 유지되어야 한다.

### 예시

- L[1217–1217](../../upstream/krds/raw/components/component_04_07.html:1217): 예시
- L[1221–1221](../../upstream/krds/raw/components/component_04_07.html:1221): 기본
- L[1231–1232](../../upstream/krds/raw/components/component_04_07.html:1231): 아코디언 타이틀 영역
- L[1242–1243](../../upstream/krds/raw/components/component_04_07.html:1242): 아코디언 타이틀 영역
- L[1261–1261](../../upstream/krds/raw/components/component_04_07.html:1261): 기본 코드 확인하기
- L[1277–1277](../../upstream/krds/raw/components/component_04_07.html:1277): 라인형
- L[1287–1288](../../upstream/krds/raw/components/component_04_07.html:1287): 아코디언 타이틀 영역
- L[1298–1299](../../upstream/krds/raw/components/component_04_07.html:1298): 아코디언 타이틀 영역
- L[1317–1317](../../upstream/krds/raw/components/component_04_07.html:1317): 라인형 코드 확인하기

### 마크업 가이드

- L[1338–1338](../../upstream/krds/raw/components/component_04_07.html:1338): 마크업 가이드
- L[1341–1341](../../upstream/krds/raw/components/component_04_07.html:1341): CSS 선택자
- L[1361–1366](../../upstream/krds/raw/components/component_04_07.html:1361): 전체영역 .krds-accordion 라인 타입 .type-line
- L[1367–1372](../../upstream/krds/raw/components/component_04_07.html:1367): 아코디언 그룹 .accordion-item 활성화 .active
- L[1373–1378](../../upstream/krds/raw/components/component_04_07.html:1373): 제목 및 내용 활성화 버튼 .btn-accordion 활성화 .active [aria-expanded="true"]
- L[1388–1388](../../upstream/krds/raw/components/component_04_07.html:1388): JS
- L[1407–1411](../../upstream/krds/raw/components/component_04_07.html:1407): krds_accordion init() 초기화 및 주요 이벤트 실행
- L[1412–1415](../../upstream/krds/raw/components/component_04_07.html:1412): setupAccordions() 아코디언 설정
- L[1443–1443](../../upstream/krds/raw/components/component_04_07.html:1443): 개발 시 접근성 관련 주의 사항
- L[1445–1445](../../upstream/krds/raw/components/component_04_07.html:1445): 헤더 영역을 h태그로 제공하고 button을 사용한다.
- L[1446–1446](../../upstream/krds/raw/components/component_04_07.html:1446): 바디영역 확장/축소를 wai-aria 속성 등으로 표편해주고 있는지 확인한다.

보존된 인라인 예시 마크업(참고용, 공개 네이티브 API 아님): L[1226–1255](../../upstream/krds/raw/components/component_04_07.html:1226), L[1282–1311](../../upstream/krds/raw/components/component_04_07.html:1282)

원문의 CSS/JS/가이드 이미지 참조는 복사된 구현이 아닙니다. 필수/선택 열을 보존한 표 행의 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화된 발췌는 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 원문은 단일/다중 펼침, 비활성 헤더, 화살표 단축키를 규정하지 않습니다. 초안은 다중 펼침과 네이티브 Tab 순회를 택합니다.
- 연결된 외부 코드 예시는 참조만 하고 이번 준비에서 별도 파일로 포함하거나 읽지 않았습니다: L1266 `../../code/accordion.html`, L1322 `../../code/accordion_line.html`, L1430 `../../../resources/js/examples/krds_accordion.js`, L1458 `./variable/accordion.html`. 보지 않은 내용을 추정하지 않습니다.
- 상세 페이지에 가이드 이미지 참조가 7개 있으며, 그 안의 픽셀 도식은 시각적으로 검사하지 않았습니다. 텍스트 구조와 지침은 읽었습니다. 정확한 시각 치수·자산은 이후 시각·출처 검토가 필요합니다.
- 시맨틱 인터페이스와 파트·상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 자체 구현, 동작·스토리 소스, 독립 인수가 여전히 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 시맨틱 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `AccordionContract`입니다. 네이티브 프레임워크는 자체 콘텐츠·ref·이벤트 전달만 확장합니다. 공유 매니페스트는 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에서 인용·파생한 공식 텍스트는 원래의 KRDS 권리와 출처 표기를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 원천 식별 정보는 바뀌지 않습니다. 열린 근거 한계는 검사하지 않은 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며 여기 인용된 실질 요구사항을 면제하지 않습니다.
