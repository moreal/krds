# 사이드 메뉴 {#side-navigation}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐입니다. 네이티브 동작, 시각·자산 검토, 실행된 커버리지는 별도 관문으로 남습니다. 게시는 승인되지 않았습니다.

시맨틱 ID `side-navigation`, 한국어 이름 사이드 메뉴, export `SideNavigation`. 고정된 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세 페이지: [component_03_04](https://www.krds.go.kr/html/site/component/component_03_04.html), 보존본 [HTML](../../upstream/krds/raw/components/component_03_04.html). 조회 시각 `2026-10-29T23:28:03.067Z`, `98998` 바이트, SHA-256 `12f628f6e3fee2ebebc637ed2773beec9dc30c74edf5d16f1c71b31c3ace951f`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정된 출처 종류는 `composition`이고, 수용된 프로젝트 완료 종류도 `composition`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 사례(변형·상태 축): `simple`, `with-header`, `mobile-dropdown`. 이는 네이티브 사례 이름입니다. 상태·반응형·외형 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형·예시 헤딩 원문은 근거 부록에 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

이름 있는 내비게이션 랜드마크에 선택적 제목·상위로 돌아가기 컨트롤, 중첩된 <ul>/<li> 링크, 선택된 잎 항목 단서, 별도의 하위 펼침 버튼을 둡니다. 한 번에 최대 두 수준만 노출합니다. 더 깊은 구조는 헤더 맥락과 함께 점진적으로 노출합니다. 현재 잎 항목은 aria-current=page, 트리거는 aria-expanded/controls를 갖습니다.

## 의미 API {#plain-semantic-api}

독립 API: items {id,label,href?,children?}[], currentId, expandedIds/defaultExpandedIds(초기값은 현재 가지), onExpandedChange({ids}), title/parentLink(선택). 여러 가지를 독립적으로 펼칠 수 있습니다. 아코디언(Accordion)의 단일 열림 기본값을 적용하지 않습니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어/기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 의미 변경 요청 하나를 냅니다. 비활성, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 0회 냅니다. 제어 거부 시 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고, 제어 props가 계속 우선합니다. 추가 필드는 렌더러·머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

Tab은 보이는 계층 순서를 따릅니다. Enter/클릭은 잎 항목에서는 이동하고 부모에서는 펼침을 토글합니다. 두 번째 가지를 열어도 첫 번째는 열려 있습니다. 접힌 하위 항목은 초점과 접근성 트리에서 제외합니다. 초점이 있는 하위 항목을 포함한 가지를 접으면 초점은 그 가지의 트리거로 돌아갑니다. 비모달 데스크톱 내비게이션에는 초점 트랩이 없습니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

너비가 부족하면 사이드바를 숨기고, 호스트의 MainMenu가 동등한 내비게이션을 제공합니다. 전체 4수준 이상이면 페이지 제목 드롭다운이 현재 깊은 수준을 노출할 수 있습니다. 동등한 경로 접근이 있을 때만 숨깁니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼·리셋·IME 상태는 없습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

완료는 실제 Link·펼침 동작과 헤더 기반 깊은 내비게이션 픽스처를 조합합니다. 호스트가 경로 트리, 현재 상태, 좁은 화면의 동등한 내비게이션을 소유합니다. 문서화되지 않은 어댑터 간 재사용은 없습니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, header, parent-link, list, item, link, trigger, submenu, indicator; current,expanded,collapsed.

렌더링되는 모든 소유 파트는 `data-krds-component="side-navigation"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 기준입니다. 위 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 현재 가지가 처음부터 접근 가능하고 올바른 현재 페이지를 표시합니다.
2. 두 가지를 펼친 채로 둘 수 있습니다.
3. 닫힌 하위 항목에는 Tab으로 갈 수 없습니다.
4. 키보드로 쓰는 링크도 경로 의미를 유지합니다.
5. 좁은 호스트도 동등한 경로 접근을 유지합니다.
6. 드릴다운 헤더가 부모 맥락을 나타냅니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 단서, 움직임이 있다면 동작 줄이기를 검증합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 독립 로컬 표본 정책 {#independent-local-specimen-policy}

독립 깊은 점진적 표본은 확정된 현재 경로나 펼친 가지 없이 시작합니다. 닫힌 가지의 실제 동작은 “분류 펼치기”이고 펼친 동안에는 “분류 접기”입니다. 펼침 버튼 이름은 보이는 가지 레이블과 동작을 함께 포함합니다. 현재·펼침 상태는 네이티브·ARIA가 기준입니다.

## 필수 네이티브 스토리 {#required-native-stories}

`side-navigation--simple`, `side-navigation--with-header`, `side-navigation--two-open-branches`, `side-navigation--deep-progressive`, `side-navigation--mobile-dropdown`, `side-navigation--long-menu`.

각 사례는 해당하는 모든 네이티브 렌더러에서 로컬 args/입력/슬롯과 관찰 가능한 순수 로컬 상태가 필요합니다: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에서 따로 단계화하며, 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부를 인수해야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 씁니다. Lit과 Solid 2는 siheom 지원을 만들어 내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular의 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러·렌더러를 절대 import하지 않습니다. 다른 렌더러 래퍼는 없습니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 보존된 상세 HTML에서 가져왔으며 핵심 지침과 상호작용·마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 원문 언어를 유지합니다. “고려한다/권장/할 수 있다” 같은 표현은 권고로 남습니다. 예시·CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원본 JS 함수 표는 참고 근거일 뿐이며, 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행해서는 안 됩니다. 위의 공통 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립 선택입니다.

### 구조

- L[886–886](../../upstream/krds/raw/components/component_03_04.html:886): 구조
- L[892–895](../../upstream/krds/raw/components/component_03_04.html:892): 1. 컨테이너 사이드 메뉴 링크 목록을 담고 있는 영역으로 배경색 또는 테두리로 본문 및 인접 영역과 구분함
- L[896–899](../../upstream/krds/raw/components/component_03_04.html:896): 2. 구분선 링크 목록 내의 항목을 구분하기 위한 가로선
- L[903–903](../../upstream/krds/raw/components/component_03_04.html:903): a. 제목 메뉴 목록 전체의 상위 수준 정보 구조를 알려주는 텍스트
- L[904–904](../../upstream/krds/raw/components/component_03_04.html:904): b. 화살표 제목으로 제공되는 상위 수준 정보 구조로 이동하는 데 사용되는 버튼
- L[900–906](../../upstream/krds/raw/components/component_03_04.html:900): 3. 헤더(선택) 메뉴 목록의 제목을 제공하는 영역 a. 제목 메뉴 목록 전체의 상위 수준 정보 구조를 알려주는 텍스트 b. 화살표 제목으로 제공되는 상위 수준 정보 구조로 이동하는 데 사용되는 버튼
- L[907–910](../../upstream/krds/raw/components/component_03_04.html:907): 4. 기본 화면 링크 목록 기본 탐색 링크 그룹
- L[911–914](../../upstream/krds/raw/components/component_03_04.html:911): 5. 하위 수준 페이지 링크 목록 기본 페이지 링크 하위 수준에 속하는 링크 목록
- L[915–918](../../upstream/krds/raw/components/component_03_04.html:915): 6. 식별자 선택된 링크를 변별하기 위한 시각적 단서
- L[919–922](../../upstream/krds/raw/components/component_03_04.html:919): 7. 꺾쇠 아이콘 하위 수준 화면 링크 목록의 확장/축소 상태를 나타냄. 사용자는 꺾쇠 아이콘의 유무를 통해 개별 기본 화면 링크 하위에 추가적으로 탐색할 수 있는 링크 목록이 존재하는지를 인지할 수 있음

### 유형

- L[930–930](../../upstream/krds/raw/components/component_03_04.html:930): 유형
- L[932–932](../../upstream/krds/raw/components/component_03_04.html:932): 단순 목록
- L[933–933](../../upstream/krds/raw/components/component_03_04.html:933): 사이드 메뉴의 가장 기본적인 형태로 모든 수준의 링크가 표시된다. 사용자는 메인 메뉴와 메인 메뉴의 식별자를 통해 사이드 메뉴 목록의 계층 구조를 파악할 수 있다.
- L[939–939](../../upstream/krds/raw/components/component_03_04.html:939): 헤더가 있는 목록
- L[940–943](../../upstream/krds/raw/components/component_03_04.html:940): 4수준 이상의 계층 구조를 가진 서비스에서 4수준 이상의 메뉴를 점진적으로 공개할 때, 상위 수준 메뉴 텍스트를 보여주는 제목과 이동 버튼으로 구성된 헤더를 포함하여 사용한다. 링크 목록이 메인 메뉴에 표시된 정보 구조의 하위 수준에 속하지 않는 경우, 사용자가 정보 구조를 명확하게 파악하는 것을 돕기 위해 제목을 제공할 수 있다.
- L[949–949](../../upstream/krds/raw/components/component_03_04.html:949): 드롭다운
- L[950–950](../../upstream/krds/raw/components/component_03_04.html:950): 4수준 이상의 계층 구조를 가진 서비스에서 햄버거 메뉴로 전환되었을 때 메인 메뉴를 보조하여 탐색할 수 있는 수단으로 사용한다. 본문의 제목이 드롭다운 버튼으로 사용되며, 실행 시 동일한 수준의 메뉴 링크 목록을 표시한다.

### 용례

- L[960–960](../../upstream/krds/raw/components/component_03_04.html:960): 용례
- L[962–962](../../upstream/krds/raw/components/component_03_04.html:962): 사용하기 적합한 경우
- L[967–967](../../upstream/krds/raw/components/component_03_04.html:967): 제한된 메인 메뉴 영역에서 가로로 배치된 목록을 탐색하는 것보다 세로로 배치된 사이드 메뉴 링크 목록을 훑어보는 것이 쉽다.
- L[964–969](../../upstream/krds/raw/components/component_03_04.html:964): 메인 메뉴에서 선택한 메뉴 하위에 많은 화면이 존재하는 경우 제한된 메인 메뉴 영역에서 가로로 배치된 목록을 탐색하는 것보다 세로로 배치된 사이드 메뉴 링크 목록을 훑어보는 것이 쉽다.
- L[973–973](../../upstream/krds/raw/components/component_03_04.html:973): 메인 메뉴 항목 하위 링크 목록이 유사한 정보 그룹으로 구성되어 있고 사용자가 링크 목록을 비교하여 탐색하는 행동을 빈번하게 수행하는 경우, 본문 옆에 배치된 사이드 메뉴가 탐색 과정을 효율적으로 수행하는 것을 도울 수 있다.
- L[970–975](../../upstream/krds/raw/components/component_03_04.html:970): 사용자가 사이트 정보의 계층 구조에서 특정 수준의 메뉴를 상세하게 탐색할 필요가 있는 경우 메인 메뉴 항목 하위 링크 목록이 유사한 정보 그룹으로 구성되어 있고 사용자가 링크 목록을 비교하여 탐색하는 행동을 빈번하게 수행하는 경우, 본문 옆에 배치된 사이드 메뉴가 탐색 과정을 효율적으로 수행하는 것을 도울 수 있다.
- L[979–979](../../upstream/krds/raw/components/component_03_04.html:979): 사용하기 적합하지 않은 경우
- L[984–984](../../upstream/krds/raw/components/component_03_04.html:984): 화면 수가 5개 미만인 소규모 서비스는 메인 메뉴 또는 다른 보조적 탐색 수단을 통해 사이트 정보 구조를 충분히 탐색할 수 있다.
- L[981–986](../../upstream/krds/raw/components/component_03_04.html:981): 사이트 규모가 작은 경우 화면 수가 5개 미만인 소규모 서비스는 메인 메뉴 또는 다른 보조적 탐색 수단을 통해 사이트 정보 구조를 충분히 탐색할 수 있다.
- L[990–990](../../upstream/krds/raw/components/component_03_04.html:990): 넓은 본문 영역이 필요한 경우, 수준이 깊은 메인 메뉴 형식을 사용하여 사용자가 메인 메뉴를 통해 로컬 탐색을 수행하도록 한다. 화면 너비가 충분하다면 화면 전체 너비로 레이아웃을 확장하고 사이드 메뉴와 본문을 함께 표시할 수 있다.
- L[987–992](../../upstream/krds/raw/components/component_03_04.html:987): 콘텐츠 표현과 인지를 위해 넓은 본문 영역이 필요한 경우 넓은 본문 영역이 필요한 경우, 수준이 깊은 메인 메뉴 형식을 사용하여 사용자가 메인 메뉴를 통해 로컬 탐색을 수행하도록 한다. 화면 너비가 충분하다면 화면 전체 너비로 레이아웃을 확장하고 사이드 메뉴와 본문을 함께 표시할 수 있다.
- L[996–996](../../upstream/krds/raw/components/component_03_04.html:996): 2수준까지 탐색 가능한 메인 메뉴를 통해 서비스의 정보 구조를 충분히 탐색할 수 있다.
- L[993–998](../../upstream/krds/raw/components/component_03_04.html:993): 탐색 계층 구조가 2수준 이내이고 탐색 항목 수가 적은 경우 2수준까지 탐색 가능한 메인 메뉴를 통해 서비스의 정보 구조를 충분히 탐색할 수 있다.

### 사용성 가이드라인

- L[1006–1006](../../upstream/krds/raw/components/component_03_04.html:1006): 사용성 가이드라인
- L[1009–1009](../../upstream/krds/raw/components/component_03_04.html:1009): 현재 탐색 중인 화면에 대한 링크를 강조 표시한다.
- L[1010–1010](../../upstream/krds/raw/components/component_03_04.html:1010): 사용자가 탐색 계층 구조 내에서 어디에 있는지 알 수 있도록 식별자를 통해 탐색 중인 링크를 강조 표시한다.
- L[1013–1013](../../upstream/krds/raw/components/component_03_04.html:1013): 메뉴의 계층 구조는 최대 2개 수준까지 사용한다.
- L[1014–1015](../../upstream/krds/raw/components/component_03_04.html:1014): 사이드 메뉴 영역의 너비는 제한되어 있기 때문에 3개 이상의 수준을 한 번에 표시할 경우 인지와 탐색이 어려워질 수 있다. 2개 이상의 수준에 대한 탐색이 필요한 경우 더 깊은 수준의 메뉴를 점진적으로 공개하고 헤더가 있는 목록을 사용하거나, 본문에 보조적인 탐색 수단을 제공하는 것이 적절하다.
- L[1026–1026](../../upstream/krds/raw/components/component_03_04.html:1026): 하위 수준 메뉴 표시에 확장 가능한 영역을 사용하는 방안을 고려한다.
- L[1027–1030](../../upstream/krds/raw/components/component_03_04.html:1027): 긴 계층 구조를 한 번에 표시할 경우 정보가 복잡해지며 사용자가 뷰포트 바깥에 제공된 링크를 놓칠 수 있다. 하위 수준 메뉴를 확장 가능한 영역으로 구성하고 페이지가 로딩되었을 때 사용자가 탐색 중인 메뉴의 하위 수준 메뉴를 확장된 상태로 제공하면 사용자가 목록을 보다 쉽게 탐색할 수 있다. 만약 모든 수준의 메뉴를 표시하였을 때 목록이 사이드 메뉴 영역을 벗어나지 않으며 간결하다면 기본으로 모든 메뉴가 보이도록 표현할 수 있다.
- L[1042–1042](../../upstream/krds/raw/components/component_03_04.html:1042): 메뉴의 계층 구조를 명확하게 구분하여 표현한다.
- L[1043–1043](../../upstream/krds/raw/components/component_03_04.html:1043): 사용자의 탐색을 방해하지 않도록 수직으로 나란히 배치된 링크 간 수준을 들여쓰기, 배경 구분 등의 방식을 활용하여 명확하게 구분해야 한다.

### 플랫폼에 대한 고려 사항

- L[1059–1059](../../upstream/krds/raw/components/component_03_04.html:1059): 플랫폼에 대한 고려 사항
- L[1062–1062](../../upstream/krds/raw/components/component_03_04.html:1062): 화면 너비가 충분하지 않은 경우 사이드 메뉴를 표시하지 않는다.
- L[1063–1063](../../upstream/krds/raw/components/component_03_04.html:1063): 사용자는 햄버거 아이콘으로 축소된 메인 메뉴를 통해 정보 구조를 탐색한다. 4수준 이상의 정보 구조가 필요하다면 본문 제목을 4수준 메뉴에 대한 보조적 탐색 수단으로 사용하여 사용자의 탐색을 도울 수 있다.

### 접근성 가이드라인

- L[1184–1184](../../upstream/krds/raw/components/component_03_04.html:1184): 접근성 가이드라인
- L[1187–1187](../../upstream/krds/raw/components/component_03_04.html:1187): 메뉴의 컨테이너가 내비게이션 섹션임을 스크린 리더에서 인지할 수 있도록 한다.
- L[1188–1189](../../upstream/krds/raw/components/component_03_04.html:1188): 메뉴의 전체 컨테이너는 &lt;nav&gt;로 감싸거나 WAI-ARIA 영역을 role="navigation"으로 지정하여 스크린 리더에서 내비게이션 요소임을 인지할 수 있도록 제공해야 한다. 내비게이션 섹션에 aria-label="사이드 메뉴"를 제공하면 스크린 리더 사용자는 사이드 메뉴의 역할을 보다 명확하게 인지할 수 있다.
- L[1196–1196](../../upstream/krds/raw/components/component_03_04.html:1196): 메뉴 링크의 계층 구조를 표현한다.
- L[1197–1197](../../upstream/krds/raw/components/component_03_04.html:1197): 스크린 리더 사용자가 사이트의 정보 구조를 파악하는 데 도움을 줄 수 있도록 &lt;h2&gt;~&lt;h6&gt;, &lt;ul&gt;, &lt;li&gt; 태그를 활용하여 계층 구조로 정보를 제공해야 한다.
- L[1204–1204](../../upstream/krds/raw/components/component_03_04.html:1204): 활성화된 메뉴 정보가 스크린 리더로 전달될 수 있도록 한다.
- L[1205–1205](../../upstream/krds/raw/components/component_03_04.html:1205): 인디케이터가 시각적으로만 구분되는 것이 아니라 스크린 리더로도 전달될 수 있도록 WAI-ARIA aria-current 속성을 제공한다. 현재 탐색 중인 화면에 대한 링크인 경우 aria-current="page" 속성을 추가한다.
- L[1212–1212](../../upstream/krds/raw/components/component_03_04.html:1212): 메뉴 링크는 키보드로 탐색할 수 있도록 한다.
- L[1213–1213](../../upstream/krds/raw/components/component_03_04.html:1213): 사이드 메뉴의 링크는 반드시 키보드가 접근할 수 있도록 제공해야 한다. 사용자가 키보드를 이용하여 영역을 확장하거나 축소하고 목록을 탐색할 수 있는지 점검해야 한다.
- L[1221–1221](../../upstream/krds/raw/components/component_03_04.html:1221): 키보드의 초점은 메뉴의 계층 순서대로 이동하도록 한다.
- L[1222–1222](../../upstream/krds/raw/components/component_03_04.html:1222): 키보드를 이용하여 메뉴를 탐색하는 경우, 키보드의 탐색 위치를 표시하는 초점이 메뉴의 계층 순서에 맞게 이동되도록 제공해야 한다. 문서에 메뉴의 계층 구조를 표현하지 않거나 임의로 키보드 초점의 이동 순서를 조작하면 보조 기술 사용자는 메뉴 탐색에 혼동을 느끼게 된다.
- L[1229–1229](../../upstream/krds/raw/components/component_03_04.html:1229): 스크린 리더에서 하위 수준 메뉴의 확장/축소 상태를 확인할 수 있도록 한다.
- L[1230–1230](../../upstream/krds/raw/components/component_03_04.html:1230): aria-expanded 속성이나 title 속성을 활용하여 하위 메뉴 영역의 활성화 상태 정보가 스크린 리더에 탐지될 수 있도록 해야 한다.
- L[1236–1236](../../upstream/krds/raw/components/component_03_04.html:1236): 축소된 메뉴 링크에 보조 기술이 접근되지 않도록 제공한다.
- L[1237–1237](../../upstream/krds/raw/components/component_03_04.html:1237): 시각적으로 확인할 수 없는 메뉴 링크에 보조 기술이 접근하게 되면, 보조 기술 사용자들은 의도와 상관없이 숨겨진 링크에 모두 접근해야 한다.

### 상호작용 가이드라인

- L[1249–1249](../../upstream/krds/raw/components/component_03_04.html:1249): 상호작용 가이드라인
- L[1251–1251](../../upstream/krds/raw/components/component_03_04.html:1251): 메뉴 링크 탐색
- L[1269–1272](../../upstream/krds/raw/components/component_03_04.html:1269): Enter 연결된 링크 목적지로 이동한다.
- L[1273–1276](../../upstream/krds/raw/components/component_03_04.html:1273): Click 연결된 링크 목적지로 이동한다.
- L[1277–1280](../../upstream/krds/raw/components/component_03_04.html:1277): Tab, Shift + Tab 시각적으로 표시된 메뉴 링크에 순차적으로 접근한다.
- L[1287–1287](../../upstream/krds/raw/components/component_03_04.html:1287): 메뉴 영역 확장 및 축소
- L[1305–1312](../../upstream/krds/raw/components/component_03_04.html:1305): Click 꺾쇠 아이콘이 있는 메뉴 링크가 초점을 가진 상태에서 마우스 Click 이벤트가 발생하였을 때 하위 수준 메뉴가 펼쳐지거나 접혀야 한다. 하나의 하위 링크 목록의 확장 상태는 다른 하위 링크 목록에 영향을 미치지 않는다. 즉, 어떤 하위 메뉴가 확장되어 있는 상태에서 다른 하위 링크 목록이 확장되더라도 기존에 확장된 링크 목록의 확장 상태가 유지되어야 한다.
- L[1313–1320](../../upstream/krds/raw/components/component_03_04.html:1313): Enter 꺾쇠 아이콘이 있는 메뉴 링크가 초점을 가진 상태에서 키보드 Enter 이벤트가 발생하였을 때 하위 수준 메뉴가 펼쳐지거나 접혀야 한다. 하나의 하위 링크 목록의 확장 상태는 다른 하위 링크 목록에 영향을 미치지 않는다. 즉, 어떤 하위 메뉴가 확장되어 있는 상태에서 다른 하위 링크 목록이 확장되더라도 기존에 확장된 링크 목록의 확장 상태가 유지되어야 한다.

### 예시

- L[1338–1338](../../upstream/krds/raw/components/component_03_04.html:1338): 예시
- L[1342–1342](../../upstream/krds/raw/components/component_03_04.html:1342): 기본
- L[1441–1441](../../upstream/krds/raw/components/component_03_04.html:1441): 기본 코드 확인하기

### 마크업 가이드

- L[1488–1488](../../upstream/krds/raw/components/component_03_04.html:1488): 마크업 가이드
- L[1491–1491](../../upstream/krds/raw/components/component_03_04.html:1491): CSS 선택자
- L[1511–1514](../../upstream/krds/raw/components/component_03_04.html:1511): 전체영역 .krds-side-navigation
- L[1515–1518](../../upstream/krds/raw/components/component_03_04.html:1515): 헤더 .lnb-tit
- L[1519–1524](../../upstream/krds/raw/components/component_03_04.html:1519): 기본 목록(1depth) .lnb-list .lnb-item 활성화 상태 .lnb-btn.selected
- L[1525–1528](../../upstream/krds/raw/components/component_03_04.html:1525): 링크 .lnb-btn.lnb-link
- L[1529–1532](../../upstream/krds/raw/components/component_03_04.html:1529): 하위 목록 드롭다운 .lnb-btn.lnb-toggle
- L[1533–1538](../../upstream/krds/raw/components/component_03_04.html:1533): 하위 목록(2depth) .lnb-submenu .lnb-subitem 활성화 상태 .lnb-btn.selected
- L[1539–1542](../../upstream/krds/raw/components/component_03_04.html:1539): 링크 .lnb-btn.lnb-link
- L[1543–1546](../../upstream/krds/raw/components/component_03_04.html:1543): 하위 목록 팝업 .lnb-btn.lnb-toggle-popup
- L[1547–1552](../../upstream/krds/raw/components/component_03_04.html:1547): 하위 목록(3depth) .lnb-submenu-lv2 활성화 상태 .lnb-btn.selected
- L[1562–1562](../../upstream/krds/raw/components/component_03_04.html:1562): JS
- L[1581–1585](../../upstream/krds/raw/components/component_03_04.html:1581): krds_sideNavigation init() 초기화 및 주요 이벤트 실행
- L[1586–1589](../../upstream/krds/raw/components/component_03_04.html:1586): setupSideNavLists() 사이드 메뉴 설정
- L[1590–1593](../../upstream/krds/raw/components/component_03_04.html:1590): setupToggleEvents() 하위 목록 토글 설정
- L[1594–1597](../../upstream/krds/raw/components/component_03_04.html:1594): setupPopupEvents() 하위 목록 팝업 설정
- L[1625–1625](../../upstream/krds/raw/components/component_03_04.html:1625): 개발 시 접근성 관련 주의 사항
- L[1627–1627](../../upstream/krds/raw/components/component_03_04.html:1627): 키보드 탐색 시 초점이 순차적으로 이동하는지 확인한다.
- L[1628–1628](../../upstream/krds/raw/components/component_03_04.html:1628): 하위메뉴가 있는경우 하위메뉴 열림/닫힘을 wai-aria 속성 등으로 표편해주고 있는지 확인한다.

보존된 예시 마크업 인라인(참고용이며 공개 네이티브 API가 아님): L[1347–1435](../../upstream/krds/raw/components/component_03_04.html:1347)

CSS/JS/안내 이미지 출처 참조는 복사된 구현이 아닙니다. 표 행의 원본 HTML(필수/선택 열 보존)은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화한 발췌가 조건부 선택자를 필수로 재분류하지는 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 기록된 독립 결정: 수용된 두 수준 동시 표시 레이아웃은 더 깊은 정보를 명시적인 점진적 공개로 보존합니다. 3수준 예시 선택자가 모든 수준을 동시에 보여도 된다는 허가는 아닙니다.
- 외부 코드 예시는 참조만 하며 이번 준비에서 별도 파일로 삽입하거나 읽지 않았습니다: L1446 `../../code/side_navigation.html`, L1612 `../../../resources/js/examples/krds_sideNavigation.js`, L1640 `./variable/side_navigation.html`. 보지 못한 내용은 추정하지 않습니다.
- 상세 페이지에 안내 이미지 참조가 10개 있으며, 그 안의 픽셀 도식은 눈으로 확인하지 않았습니다. 텍스트 구조와 지침만 읽었습니다. 정확한 시각 치수와 자산은 이후 시각·출처 검토가 필요합니다.
- 의미 인터페이스와 파트·상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작·스토리 소스, 독립 인수가 필요합니다.

## 수용된 독립 결정 {#accepted-independent-resolution}

수용된 두 수준 동시 표시 레이아웃은 더 깊은 정보를 명시적인 점진적 공개로 보존합니다. 3수준 예시 선택자가 모든 수준을 동시에 보여도 된다는 허가는 아닙니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `SideNavigationContract`입니다. 네이티브 프레임워크는 자체 콘텐츠·ref·이벤트 전달만 확장합니다. 공통 매니페스트가 지원 사례 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼로는 이 계약을 충족할 수 없습니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에 인용·파생된 공식 텍스트는 원래 KRDS 권리와 출처 표시를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며 여기 인용한 실질 요구사항을 면제하지 않습니다.
