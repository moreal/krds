# 브레드크럼 {#breadcrumb}

**계약 상태: 네이티브 구현용으로 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 승인일 뿐입니다. 네이티브 동작, 시각·자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `breadcrumb`, 한국어 이름 브레드크럼, export `Breadcrumb`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_03_03](https://www.krds.go.kr/html/site/component/component_03_03.html). 보존 [HTML](../../upstream/krds/raw/components/component_03_03.html). 조회 시각 `2026-10-29T23:28:02.993Z`, `76569` 바이트, SHA-256 `d3bc6305143388437ad54f4b099daa1f0cb4643170ee594522fb6603c2c48aca`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 별개입니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 원천 종류 `component`, 수용된 프로젝트 완료 종류 `component`. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 케이스(변형·상태 축): `default`, `collapsed`, `narrow`. 이는 네이티브 케이스 이름입니다. 상태·반응형·외형 축이 곧 공식 명명 변형은 아닙니다. 공식 유형·예시 제목은 근거 부록에 그대로 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

이름 있는 `<nav aria-label="브레드크럼">` 안에 `<ol><li>`를 씁니다. 첫 항목은 홈 링크입니다. 목적지가 없어도 모든 상위 수준을 포함하며 그 경우 일반 텍스트로 표시합니다. 구분자는 보조 기술에서 숨기고 보이는 대비는 3:1입니다. 브레드크럼은 페이지 제목 앞에 옵니다. 상위 마지막 모드는 다른 콘텐츠가 끼어들지 않을 때만 현재 제목을 생략합니다.

## 의미 API {#plain-semantic-api}

독립 API: items {id,label,href?}[], home {href,label}, currentItem? {id,label}, omitCurrent=true, maxVisible=데스크톱 4/좁은 화면 2. 줄임표는 홈 바로 뒤에 오며 설명용 비상호작용 텍스트이고, 지어낸 펼치기 동작이 아닙니다. items에는 홈과 현재 페이지를 제외한 조상·상위만 담습니다. `omitCurrent`는 별도의 명시적 `currentItem`만 제어합니다. 마지막 상위를 버리거나 href가 없다는 이유로 현재 페이지를 추정하지 않습니다. 상위의 href가 없으면 텍스트로 렌더링하며 항목은 남습니다. `omitCurrent=false`이면 currentItem이 필요하고 비상호작용 aria-current=page 텍스트로 덧붙입니다. 홈은 항상 별도의 첫 항목입니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 정의된 value/open은 제어 모드이고 undefined는 비제어 모드입니다. 제어 prop과 기본값을 함께 주거나 모드를 바꾸면 잘못된 구성입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 시맨틱 변경 요청을 한 번 내보냅니다. 비활성, 변화 없음, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 모드에서 거부되면 커밋된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 우선합니다. 추가 필드로 렌더러·머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

네이티브 Tab/Shift+Tab과 Enter는 링크에만 적용됩니다. 목적지가 없는 항목과 줄임표는 탭 정지점이 아닙니다. 중간 경로를 시각적으로 접어도 보이지 않는 초점 가능 링크를 만들지 않고 접근 가능한 전체 계층을 보존합니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

한 줄로 표시합니다. 경로가 다섯 개 이상이면 홈 뒤를 접습니다. 좁은 화면에서는 홈과 마지막 상위를 보이고 그 사이에 줄임표를 둡니다. 마지막 레이블은 경로 축소 후에도 필요할 때만 잘릴 수 있으며 전체 접근 가능한 이름은 유지됩니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼·리셋·IME 동작은 없습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 방문 이력이 아닌 실제 계층과 목적지, 인접한 페이지 제목을 제공합니다. 완료에는 상위 마지막 배치와 계층 픽스처가 포함됩니다. 라우터 의존성은 필요 없습니다.

## 고정 파트와 상태 {#stable-parts-and-states}

파트: root, list, item, link, home, separator, ellipsis. 상태: current,collapsed.

렌더링되는 모든 소유 파트는 `data-krds-component="breadcrumb"`, 하나의 `data-krds-part` 토큰, 공백으로 구분된 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 우선합니다. 위 문장의 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 홈 href는 실제 서비스 루트다.
2. 목적지 없는 상위는 가짜 링크가 아니라 텍스트다.
3. 구분자는 접근성 출력에 없다.
4. 좁은 화면의 깊은 경로는 홈과 마지막 상위를 유지하고 생략된 계층을 전달한다.
5. Tab은 보이는 실제 링크만 방문한다.

이 항목은 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색 이외의 상태 단서, 움직임이 있는 곳의 동작 줄이기를 확인합니다. 빈 스위트를 성공으로 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`breadcrumb--default`, `breadcrumb--deep-collapsed`, `breadcrumb--missing-parent-href`, `breadcrumb--narrow-long-label`, `breadcrumb--parent-last-heading`.

각 케이스는 해당하는 모든 네이티브 렌더러에서 로컬 args/inputs/slots와 관찰 가능한 순수 로컬 상태를 가져야 합니다. 대상은 Solid 1, React, Svelte, Vue, Lit, Qwik, Angular이며 Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 단계별로 따로 있으며 현재 파일럿 러너의 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 수용되어야 합니다. 동작 스위트는 스토리 파일과 분리하며 지원되는 upstream siheom 어댑터만 씁니다. Lit과 Solid 2는 선택된 네이티브 테스트 경로를 쓰며 siheom 지원을 만들어 내지 않습니다. Qwik은 첫 lazy 이벤트를 테스트합니다. Angular의 폼 컨트롤은 CVA·리셋과 partial APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러·렌더러를 가져오면 안 됩니다. 다른 렌더러의 래퍼는 쓰지 않습니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 실제 보존된 상세 HTML에서 가져왔으며 핵심 지침과 상호작용·마크업 표를 포함합니다. 공식 요구사항을 만들어 내지 않도록 원문 언어를 유지합니다. “고려/권장/가능” 같은 표현은 권고로 남습니다. 예시와 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원문 JS 함수 표는 참고 근거일 뿐이며 원본 KRDS JS는 네이티브가 제어하는 DOM에서 실행하면 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립적 선택입니다.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_03_03.html:883): 구조
- L[895–895](../../upstream/krds/raw/components/component_03_03.html:895): a. 홈 아이콘과 레이블 브레드크럼 목록의 첫 번째 항목으로 메인 화면으로 이동하는 링크로 작동함
- L[896–896](../../upstream/krds/raw/components/component_03_03.html:896): b. 상위 구조 탐색 중인 화면의 상위 수준의 정보 구조를 표시하는 텍스트로 연결 가능한 페이지가 존재하는 경우 링크로 작동함
- L[892–898](../../upstream/krds/raw/components/component_03_03.html:892): 1. 경로 a. 홈 아이콘과 레이블 브레드크럼 목록의 첫 번째 항목으로 메인 화면으로 이동하는 링크로 작동함 b. 상위 구조 탐색 중인 화면의 상위 수준의 정보 구조를 표시하는 텍스트로 연결 가능한 페이지가 존재하는 경우 링크로 작동함
- L[899–902](../../upstream/krds/raw/components/component_03_03.html:899): 2. 말줄임표 페이지 링크 표시 개수를 초과하는 경우 축약된 경로가 있음을 안내하기 위해 제공됨. 말줄임표는 항상 홈 아이콘 링크 다음 요소로 제공됨
- L[903–906](../../upstream/krds/raw/components/component_03_03.html:903): 3. 구분자 브레드크럼 항목을 구분하기 위한 구분 기호. 화면 간의 시각적 계층 구조를 나타냄

### 용례

- L[914–914](../../upstream/krds/raw/components/component_03_03.html:914): 용례
- L[916–916](../../upstream/krds/raw/components/component_03_03.html:916): 사용하기 적합하지 않은 경우
- L[921–921](../../upstream/krds/raw/components/component_03_03.html:921): 탐색 구조의 깊이가 2단계인 사이트에는 탐색 경로가 존재하지 않으며, 메인 메뉴와 메뉴의 활성화 상태 인디케이터 정보를 통해 탐색 위치를 파악할 수 있으므로 탐색 수단으로 브레드크럼을 제공할 필요가 없다.
- L[918–923](../../upstream/krds/raw/components/component_03_03.html:918): 탐색 계층 구조가 1수준인 사이트 탐색 구조의 깊이가 2단계인 사이트에는 탐색 경로가 존재하지 않으며, 메인 메뉴와 메뉴의 활성화 상태 인디케이터 정보를 통해 탐색 위치를 파악할 수 있으므로 탐색 수단으로 브레드크럼을 제공할 필요가 없다.
- L[927–927](../../upstream/krds/raw/components/component_03_03.html:927): 메인 페이지나 랜딩 페이지는 정보 구조의 최상위 수준이므로 브레드크럼을 사용하지 않는 것이 적절하다.
- L[924–929](../../upstream/krds/raw/components/component_03_03.html:924): 메인 또는 랜딩 페이지 메인 페이지나 랜딩 페이지는 정보 구조의 최상위 수준이므로 브레드크럼을 사용하지 않는 것이 적절하다.
- L[933–933](../../upstream/krds/raw/components/component_03_03.html:933): 진행 상황을 표시하고자 하는 경우에는 단계 식별자나 진행 상황 표시기를 사용해야 한다.
- L[930–935](../../upstream/krds/raw/components/component_03_03.html:930): 진행 상황 표시 진행 상황을 표시하고자 하는 경우에는 단계 식별자나 진행 상황 표시기를 사용해야 한다.

### 사용성 가이드라인

- L[943–943](../../upstream/krds/raw/components/component_03_03.html:943): 사용성 가이드라인
- L[946–946](../../upstream/krds/raw/components/component_03_03.html:946): 브레드크럼 목록의 가장 첫 번째 항목으로 메인 화면 링크를 제공한다.
- L[947–947](../../upstream/krds/raw/components/component_03_03.html:947): 브레드크럼 목록의 가장 첫 번째 항목은 메인 화면 링크여야하며, 실제 사용자가 방문한 웹사이트의 메인 화면으로 연결되어야 한다.
- L[950–950](../../upstream/krds/raw/components/component_03_03.html:950): 브레드크럼 목록의 가장 마지막 항목으로 현재 화면의 상위 화면 링크를 제공한다.
- L[951–951](../../upstream/krds/raw/components/component_03_03.html:951): 본문 상단에 명확한 본문 제목이 제공되고 있는 경우, 브레드크럼의 마지막 항목으로 현재 화면의 경로를 생략하고 상위 화면을 경로로 제공할 수 있다. 이때 브레드크럼과 본문 제목 사이에 다른 요소가 존재해서는 안 된다.
- L[963–963](../../upstream/krds/raw/components/component_03_03.html:963): 상위 화면으로 연결되는 링크가 없는 경우에도 항상 현재 화면의 전체 정보 계층 구조를 표시한다.
- L[964–964](../../upstream/krds/raw/components/component_03_03.html:964): 연결될 수 있는 상위 화면이 없는 경우에는 해당 텍스트가 링크로 작동하지 않도록 하고 링크를 변별하기 위한 밑줄, 마우스오버(Mouseover) 효과를 제거한다.
- L[967–967](../../upstream/krds/raw/components/component_03_03.html:967): 브레드크럼 텍스트 경로가 링크임을 인지할 수 있는 시각적 단서를 제공한다.
- L[968–968](../../upstream/krds/raw/components/component_03_03.html:968): 텍스트 아래에 명도 대비 기준을 충족하는 밑줄을 제공하고 마우스오버(Mouseover) 효과를 적용하여 링크로 작동함을 사용자가 명확하게 인지할 수 있도록 해야 한다.
- L[971–971](../../upstream/krds/raw/components/component_03_03.html:971): 브레드크럼은 단일 행으로 제공한다.
- L[972–973](../../upstream/krds/raw/components/component_03_03.html:972): 브레드크럼이 여러 줄로 제공되면 탐색 경로의 계층 구조를 적절하게 보여줄 수 없다. 화면 너비가 충분한 경우 브레드크럼은 메인 화면 링크를 포함하여 최대 4개의 링크를 표시한다. 경로가 5개 이상인 경우, 메인 화면 링크 다음 수준의 계층 구조를 말줄임표로 축약함으로써 브레드크럼이 한 줄로 구성되도록 한다. 만약 4개 이내의 경로만 표시하고 있음에도 줄바꿈이 발생하는 경우 가장 마지막 링크를 축약할 수 있다.
- L[984–984](../../upstream/krds/raw/components/component_03_03.html:984): 브레드크럼은 항상 본문 제목의 왼쪽 상단에 표시한다.
- L[985–985](../../upstream/krds/raw/components/component_03_03.html:985): 브레드크럼을 제목 상단에 배치함으로써 브레드크럼의 가장 마지막 경로 텍스트와 현재 화면의 제목 텍스트가 탐색 경로로 자연스럽게 이어질 수 있다. 또한 모든 화면에서 일관성 있는 영역에 배치되므로 탐색 경로를 보다 효과적으로 인지할 수 있다.
- L[988–988](../../upstream/krds/raw/components/component_03_03.html:988): 브레드크럼 경로 링크 간 간격을 충분히 제공한다.
- L[989–989](../../upstream/krds/raw/components/component_03_03.html:989): 다양한 화면 크기를 고려하여 클릭 또는 터치 가능한 충분한 영역을 제공하고 인접한 경로 링크를 실수로 실행하지 않도록 적절한 간격을 제공해야 한다.
- L[992–992](../../upstream/krds/raw/components/component_03_03.html:992): 브레드크럼이 메인 메뉴나 사이드 메뉴를 대체해서는 안 된다.
- L[993–994](../../upstream/krds/raw/components/component_03_03.html:993): 브레드크럼은 탐색 중인 화면의 상위 경로로 이동하는 데 사용되는 탐색 수단으로서 메인 메뉴와 사이드 메뉴를 대체하여 사용할 수 없다. 또한 브레드크럼 형태의 내비게이션에 메인 메뉴나 사이드 메뉴 역할과 기능을 동시에 제공하는 경우 사용자가 혼동할 수 있으므로 혼용하여 사용하지 않는 것이 적절하다.

### 플랫폼에 대한 고려 사항

- L[1006–1006](../../upstream/krds/raw/components/component_03_03.html:1006): 플랫폼에 대한 고려 사항
- L[1009–1009](../../upstream/krds/raw/components/component_03_03.html:1009): 화면 너비가 충분하지 않은 경우 첫 번째 경로와 마지막 경로만 표시한다.
- L[1010–1010](../../upstream/krds/raw/components/component_03_03.html:1010): 첫 번째 경로는 메인 화면 링크, 마지막 링크는 현재 화면의 상위 화면 링크로 일관성 있게 제공한다. 이때, 첫 번째 경로와 마지막 경로 사이에 말줄임표를 제공함으로써 탐색 경로가 축약되어 있음을 사용자가 인지할 수 있도록 해야 한다.

### 접근성 가이드라인

- L[1121–1121](../../upstream/krds/raw/components/component_03_03.html:1121): 접근성 가이드라인
- L[1124–1124](../../upstream/krds/raw/components/component_03_03.html:1124): 경로 목록을 &lt;nav&gt; 구획으로 감싸고 적절한 구획 제목을 제공한다.
- L[1125–1125](../../upstream/krds/raw/components/component_03_03.html:1125): 브레드크럼 목록을 &lt;nav&gt; 구획으로 감싸고 구획 태그에 aria-label="브레드크럼"으로 구획 제목을 제공함으로써 스크린 리더로 구획을 빠르게 탐색하고 정보 역할을 인지할 수 있도록 해야 한다.
- L[1132–1132](../../upstream/krds/raw/components/component_03_03.html:1132): 순서 있는 목록을 사용한다.
- L[1133–1133](../../upstream/krds/raw/components/component_03_03.html:1133): 목록과 항목을 &lt;ol&gt;, &lt;li&gt;로 마크업하여 스크린 리더에서 계층 구조와 깊이를 빠르게 탐지할 수 있도록 제공한다.
- L[1140–1140](../../upstream/krds/raw/components/component_03_03.html:1140): 구분자는 배경과 3:1 이상의 명도 대비를 갖도록 표현한다.
- L[1141–1141](../../upstream/krds/raw/components/component_03_03.html:1141): 구분자는 경로 항목 간 계층 구조가 존재함을 시각적으로 안내하는 정보이기 때문에 인접한 배경과 최소 3:1 이상의 명도 대비를 가져야 한다.
- L[1148–1148](../../upstream/krds/raw/components/component_03_03.html:1148): 스크린 리더에서 구분자 정보가 탐지되지 않도록 한다.
- L[1149–1149](../../upstream/krds/raw/components/component_03_03.html:1149): &lt;ol&gt;, &lt;li&gt; 구조를 통해 계층 구조 정보를 파악할 수 있으므로 정보가 중복되지 않도록 스크린 리더에서 숨겨야 한다.

### 상호작용 가이드라인

- L[1160–1160](../../upstream/krds/raw/components/component_03_03.html:1160): 상호작용 가이드라인
- L[1162–1162](../../upstream/krds/raw/components/component_03_03.html:1162): 탐색
- L[1180–1183](../../upstream/krds/raw/components/component_03_03.html:1180): Tab, Shift + Tab Tab 키와 Shift + Tab 키를 누르면 브레드크럼 링크를 순차적으로 탐색한다.
- L[1190–1190](../../upstream/krds/raw/components/component_03_03.html:1190): 관련 페이지로 이동
- L[1208–1211](../../upstream/krds/raw/components/component_03_03.html:1208): Click 링크인 경로 텍스트를 Click 하면 연결된 페이지로 이동한다.
- L[1212–1215](../../upstream/krds/raw/components/component_03_03.html:1212): Enter 링크에 초점이 있는 상태에서 Enter 키를 누르면 연결된 페이지로 이동한다.

### 예시

- L[1234–1234](../../upstream/krds/raw/components/component_03_03.html:1234): 예시
- L[1238–1238](../../upstream/krds/raw/components/component_03_03.html:1238): 기본
- L[1261–1261](../../upstream/krds/raw/components/component_03_03.html:1261): 기본 코드 확인하기

### 마크업 가이드

- L[1281–1281](../../upstream/krds/raw/components/component_03_03.html:1281): 마크업 가이드
- L[1284–1284](../../upstream/krds/raw/components/component_03_03.html:1284): CSS 선택자
- L[1301–1304](../../upstream/krds/raw/components/component_03_03.html:1301): 전체영역 .krds-breadcrumb-wrap
- L[1305–1308](../../upstream/krds/raw/components/component_03_03.html:1305): 목록 ol.breadcrumb
- L[1309–1312](../../upstream/krds/raw/components/component_03_03.html:1309): 홈 li.home

보존된 인라인 예시 마크업(참고용, 공개 네이티브 API 아님): L[1243–1255](../../upstream/krds/raw/components/component_03_03.html:1243)

원문의 CSS/JS/가이드 이미지 참조는 복사된 구현이 아닙니다. 필수/선택 열을 보존한 표 행의 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화된 발췌는 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 기록된 독립 결정: 시각적으로 생략한 중간 계층은 DOM 순서의 비상호작용 접근 가능 텍스트로 유지하고, 장식용 줄임표는 보조 기술에서 숨깁니다. 실제로 보이는 양 끝 내비게이션 링크만 순차 초점을 받습니다. 줄임표 펼치기 컨트롤을 만들어 내지 않습니다.
- 연결된 외부 코드 예시는 참조만 하고 이번 준비에서 별도 파일로 포함하거나 읽지 않았습니다: L1266 `../../code/breadcrumb.html`, L1327 `./variable/breadcrumb.html`. 보지 않은 내용을 추정하지 않습니다.
- 상세 페이지에 가이드 이미지 참조가 8개 있으며, 그 안의 픽셀 도식은 시각적으로 검사하지 않았습니다. 텍스트 구조와 지침은 읽었습니다. 정확한 시각 치수·자산은 이후 시각·출처 검토가 필요합니다.
- 시맨틱 인터페이스와 파트·상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 자체 구현, 동작·스토리 소스, 독립 인수가 여전히 필요합니다.

## 수용된 독립 결정 {#accepted-independent-resolution}

시각적으로 생략한 중간 계층은 DOM 순서의 비상호작용 접근 가능 텍스트로 유지하고, 장식용 줄임표는 보조 기술에서 숨깁니다. 실제로 보이는 양 끝 내비게이션 링크만 순차 초점을 받습니다. 줄임표 펼치기 컨트롤을 만들어 내지 않습니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 시맨틱 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `BreadcrumbContract`입니다. 네이티브 프레임워크는 자체 콘텐츠·ref·이벤트 전달만 확장합니다. 공유 매니페스트는 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에서 인용·파생한 공식 텍스트는 원래의 KRDS 권리와 출처 표기를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 원천 식별 정보는 바뀌지 않습니다. 열린 근거 한계는 검사하지 않은 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며 여기 인용된 실질 요구사항을 면제하지 않습니다.
