# 건너뛰기 링크 {#skip-link}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐입니다. 네이티브 동작, 시각·자산 검토, 실행된 커버리지는 별도 관문으로 남습니다. 게시는 승인되지 않았습니다.

시맨틱 ID `skip-link`, 한국어 이름 건너뛰기 링크, export `SkipLink`. 고정된 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세 페이지: [component_03_01](https://www.krds.go.kr/html/site/component/component_03_01.html), 보존본 [HTML](../../upstream/krds/raw/components/component_03_01.html). 조회 시각 `2026-10-29T23:28:02.834Z`, `71606` 바이트, SHA-256 `f11cdbee2d0ac2d8831ed8acb0daea45152f98ffc9d08571cce00f755122297e`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정된 출처 종류는 `component`이고, 수용된 프로젝트 완료 종류도 `component`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 사례(변형·상태 축): `visible`, `focus-revealed`. 이는 네이티브 사례 이름입니다. 상태·반응형·외형 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형·예시 헤딩 원문은 근거 부록에 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

Masthead와 헤더보다 앞선 목록 안에 같은 문서 안의 실제 앵커를 둡니다. 본문 링크가 첫 번째이며, 사이드 내비게이션·브레드크럼·유틸리티를 제외한 콘텐츠를 가리킵니다. 링크는 세 개를 넘지 않습니다. 반복 영역이 없는 페이지에서는 생략합니다. 초점 시 표시(focus-revealed)가 제안 기본값입니다.

## 의미 API {#plain-semantic-api}

독립 API: SkipLink는 links {id,label,targetId}[] (보통 본문 대상 하나)와 visibility=focus-revealed|visible을 받습니다. 대상 ID는 같은 문서·루트 전략 안에서 해석되어야 합니다. 잘못된 대상은 조용히 #으로 연결하지 말고 개발 중에 보고합니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어/기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 의미 변경 요청 하나를 냅니다. 비활성, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 0회 냅니다. 제어 거부 시 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고, 제어 props가 계속 우선합니다. 추가 필드는 렌더러·머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

Enter는 대상 섹션·제목으로 스크롤하고 초점을 옮깁니다. 초점을 받을 수 없는 대상에는 임시 tabindex=-1을 쓰되 일반 Tab 순서에는 넣지 않습니다. 다음 Tab은 대상의 첫 번째 상호작용 자손에서 시작합니다. 탭(터치)은 스크롤합니다. 스크린 리더 가상 탐색은 수동 검증이 필요합니다. 초점 시 표시는 가려지지 않은 초점 링을 보여야 합니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

필수 웹 동작은 모바일 웹에서도 유지합니다. 네이티브 앱 예외는 모바일 웹 제외가 아닙니다. 링크는 읽을 수 있게, 고정(sticky) 콘텐츠 위에 둡니다. 동작 줄이기를 존중해 스크롤합니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼 값·리셋·IME 동작은 없습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 안정적인 대상 ID와 의미 있는 콘텐츠 랜드마크를 제공합니다. Lit의 Shadow DOM 경계에서는 명시적 대상 등록이나 light-DOM 앵커 해석이 필요합니다. 닫힌 루트를 넘어서 document.getElementById를 쓴다고 가정해서는 안 됩니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, list, item, link; focus-visible.

렌더링되는 모든 소유 파트는 `data-krds-component="skip-link"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 기준입니다. 위 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 첫 Tab이 배너보다 앞에서 링크를 드러냅니다.
2. Enter는 activeElement를 본문으로 옮기고, 다음 Tab은 본문 콘텐츠로 들어갑니다.
3. 반복 영역 콘텐츠가 대상 경계 안에 없습니다.
4. 없는 대상은 진단됩니다.
5. 확대나 고정 헤더가 초점 받은 대상을 가리지 않습니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 단서, 움직임이 있다면 동작 줄이기를 검증합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`skip-link--visible`, `skip-link--focus-revealed`, `skip-link--three-targets`, `skip-link--sticky-page`, `skip-link--shadow-target`.

각 사례는 해당하는 모든 네이티브 렌더러에서 로컬 args/입력/슬롯과 관찰 가능한 순수 로컬 상태가 필요합니다: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에서 따로 단계화하며, 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부를 인수해야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 씁니다. Lit과 Solid 2는 siheom 지원을 만들어 내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular의 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러·렌더러를 절대 import하지 않습니다. 다른 렌더러 래퍼는 없습니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 보존된 상세 HTML에서 가져왔으며 핵심 지침과 상호작용·마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 원문 언어를 유지합니다. “고려한다/권장/할 수 있다” 같은 표현은 권고로 남습니다. 예시·CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원본 JS 함수 표는 참고 근거일 뿐이며, 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행해서는 안 됩니다. 위의 공통 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립 선택입니다.

### 구조

- L[883–883](../../upstream/krds/raw/components/component_03_01.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_03_01.html:889): 1. 컨테이너 건너뛰기 링크 레이블이 제공되는 영역
- L[890–890](../../upstream/krds/raw/components/component_03_01.html:890): 2. 레이블 링크와 연결된 대상을 안내하는 텍스트

### 유형

- L[898–898](../../upstream/krds/raw/components/component_03_01.html:898): 유형
- L[900–900](../../upstream/krds/raw/components/component_03_01.html:900): 보이는 건너뛰기 링크
- L[901–904](../../upstream/krds/raw/components/component_03_01.html:901): 페이지 상단 영역, 즉 헤더 주변에 배치하여 항상 눈에 보이도록 하는 유형의 건너뛰기 링크이다. 별도의 행동 없이 존재 여부를 확인할 수 있어 직관적이고, 건너뛰기 링크를 통해 도움을 받을 수 있는 사용자가 쉽게 접근할 수 있다. 그러나 서비스 특성으로 인해 헤더에 많은 정보와 기능이 배치되어야 하는 경우, 보이는 건너뛰기 링크가 시각적 복잡성을 증가시킬 수 있으므로 일시적으로 숨긴 건너뛰기 링크를 사용하는 것이 적합하다.
- L[907–907](../../upstream/krds/raw/components/component_03_01.html:907): 일시적으로 숨긴 건너뛰기 링크
- L[908–908](../../upstream/krds/raw/components/component_03_01.html:908): 일시적으로 숨긴 건너뛰기 링크는 눈에 보이지 않게 숨겨두었다 키보드 탐색을 시도할 때 링크를 보여준다.

### 용례

- L[915–915](../../upstream/krds/raw/components/component_03_01.html:915): 용례
- L[917–917](../../upstream/krds/raw/components/component_03_01.html:917): 사용하기 적합하지 않은 경우
- L[922–923](../../upstream/krds/raw/components/component_03_01.html:922): 정보 구조 없이 단일 화면으로 구성된 사이트나 정보 구조상 문서 시작 부분에 메뉴 탐색을 위한 내비게이션이 제공되지 않는 페이지에서는 건너뛰기 링크를 사용하지 않아야 한다. 반복되는 영역이 없는 페이지에 건너뛰기 링크를 제공하게 되면 사용자에게 혼동을 줄 수 있으며, 탐색해야 할 요소가 늘어나므로 오히려 탐색 효율성을 저하시킬 수 있다.
- L[919–925](../../upstream/krds/raw/components/component_03_01.html:919): 반복되는 영역이 없는 사이트 또는 페이지 정보 구조 없이 단일 화면으로 구성된 사이트나 정보 구조상 문서 시작 부분에 메뉴 탐색을 위한 내비게이션이 제공되지 않는 페이지에서는 건너뛰기 링크를 사용하지 않아야 한다. 반복되는 영역이 없는 페이지에 건너뛰기 링크를 제공하게 되면 사용자에게 혼동을 줄 수 있으며, 탐색해야 할 요소가 늘어나므로 오히려 탐색 효율성을 저하시킬 수 있다.

### 사용성 가이드라인

- L[933–933](../../upstream/krds/raw/components/component_03_01.html:933): 사용성 가이드라인
- L[936–936](../../upstream/krds/raw/components/component_03_01.html:936): 웹사이트의 모든 페이지에 건너뛰기 링크를 제공한다.
- L[937–938](../../upstream/krds/raw/components/component_03_01.html:937): 마우스를 사용하고 시력이 있는 사용자는 페이지를 훑어보고 주요 콘텐츠의 위치를 파악할 수 있다. 그러나 키보드, 스크린 리더를 사용하여 페이지를 탐색하는 사용자는 주요 콘텐츠에 접근하기까지 헤더의 수많은 요소를 거쳐야 한다. 웹사이트를 이용하는 동안 계속 이러한 반복 행동을 수행해야 한다면 탐색 효율성이 낮아지고 피로도가 증가할 수밖에 없다. 따라서 사용하기 적합하지 않은 상황을 제외하고 웹사이트의 모든 페이지에는 건너뛰기 링크를 제공해야 한다.
- L[941–941](../../upstream/krds/raw/components/component_03_01.html:941): 건너뛰기 링크의 개수는 3개 이내로 제공한다.
- L[942–943](../../upstream/krds/raw/components/component_03_01.html:942): 대부분은 페이지의 핵심 영역, 즉 본문으로 건너뛰는 링크 1개만 제공해도 충분하다. 만약 콘텐츠의 구성과 구조가 복잡하다면 추가적인 건너뛰기 링크를 제공할 수 있다. 여러 개의 건너뛰기 링크를 제공하는 경우, 다른 링크보다 화면의 핵심 영역으로 이동하는 링크를 가장 첫 번째 항목으로 제공해야 한다.
- L[946–946](../../upstream/krds/raw/components/component_03_01.html:946): 건너뛰기 링크 외에 다른 콘텐츠 섹션 탐색 수단을 제공하는 방안을 고려한다.
- L[947–950](../../upstream/krds/raw/components/component_03_01.html:947): 건너뛰기 링크의 목적은 키보드 탐색을 보다 효율적으로 만드는 것이다. 건너뛰기 링크의 개수가 늘어날수록 복잡해져 탐색 효율성이 저하될 수 있으므로 링크를 추가하는 것보다 다른 보조적 탐색 수단을 제공하는 방안을 고려한다. 예를 들어, 페이지 내 탐색 컴포넌트를 제공하면 사용자는 건너뛰기 링크를 사용하여 본문에 접근한 다음 페이지 내 탐색 링크를 활용하여 원하는 본문 섹션으로 이동할 수 있다.
- L[953–953](../../upstream/krds/raw/components/component_03_01.html:953): 건너뛰기 링크의 목적지를 적절하게 설정한다.
- L[954–954](../../upstream/krds/raw/components/component_03_01.html:954): 건너뛰기 링크의 목적지에 반복되는 콘텐츠 영역이 포함되지 않도록 유의한다. 건너뛰기 링크의 핵심인 본문 바로가기 링크에는 목적지 섹션에 사이드 메뉴, 브레드크럼, 페이지 유틸리티 버튼/ 링크가 포함되어 있어서는 안 된다.

### 플랫폼에 대한 고려 사항

- L[962–962](../../upstream/krds/raw/components/component_03_01.html:962): 플랫폼에 대한 고려 사항
- L[965–965](../../upstream/krds/raw/components/component_03_01.html:965): 모바일 애플리케이션에서는 건너뛰기 링크를 제공하지 않을 수 있다.
- L[966–966](../../upstream/krds/raw/components/component_03_01.html:966): 모바일 애플리케이션은 모바일 웹과 탐색 내비게이션의 구성 방식, 정보 구조, 화면 구성이 달라 건너뛰기 링크의 효용이 낮다.

### 접근성 가이드라인

- L[1073–1073](../../upstream/krds/raw/components/component_03_01.html:1073): 접근성 가이드라인
- L[1076–1076](../../upstream/krds/raw/components/component_03_01.html:1076): 건너뛰기 링크 목록은 문서의 가장 첫 요소로 제공한다.
- L[1077–1077](../../upstream/krds/raw/components/component_03_01.html:1077): 쿠키 배너, 화면의 맥락을 가린 모달이 제공되는 경우를 제외하고 건너뛰기 링크 목록은 웹 문서의 가장 첫 요소로 제공해야 한다.
- L[1087–1087](../../upstream/krds/raw/components/component_03_01.html:1087): 건너뛰기 링크의 초점이 명확하게 구분되도록 표현한다.
- L[1088–1088](../../upstream/krds/raw/components/component_03_01.html:1088): 특히 일시적으로 숨긴 건너뛰기 링크 형식에서 포커스링이 인접한 본문 영역과 중첩될 수 있음을 유의해야 한다. 건너뛰기 링크의 outline-offset 속성을 음수 값으로 지정하면 컨테이너 영역 안쪽으로 포커스링이 생성되어 변별이 쉬워진다.
- L[1095–1095](../../upstream/krds/raw/components/component_03_01.html:1095): 건너뛰기 링크 실행 시 스크롤 동작과 함께 연결된 목적지 섹션으로 Focus 이벤트가 발생해야 한다.
- L[1096–1096](../../upstream/krds/raw/components/component_03_01.html:1096): 링크 실행 후 목표 지점으로 스크롤 동작만 발생하고 키보드 초점이 링크나 기타 요소에 머물러 있게 되면 건너뛰기 링크를 필요로 하는 사용자는 원하는 지점에서부터 탐색을 시작할 수 없다.

### 상호작용 가이드라인

- L[1108–1108](../../upstream/krds/raw/components/component_03_01.html:1108): 상호작용 가이드라인
- L[1110–1110](../../upstream/krds/raw/components/component_03_01.html:1110): 목적지 섹션으로의 이동
- L[1128–1131](../../upstream/krds/raw/components/component_03_01.html:1128): Enter 건너뛰기 링크가 초점을 가진 상태에서 Enter 키를 누르면 목적지 섹션으로 키보드 초점이 이동하고 화면이 스크롤 된다.
- L[1132–1135](../../upstream/krds/raw/components/component_03_01.html:1132): Tap 건너뛰기 링크 영역을 Tap 하면 목적지 섹션으로 화면이 스크롤 된다. 만약 스크린 리더가 활성화된 상태라면 가상 초점이 목적지 섹션으로 이동한다.
- L[1142–1142](../../upstream/krds/raw/components/component_03_01.html:1142): 콘텐츠 탐색
- L[1160–1163](../../upstream/krds/raw/components/component_03_01.html:1160): Tab 목적지 섹션으로 스크롤 된 상태에서 Tab 키를 누르면 이동한 섹션 내부 요소 중 상호작용이 가능한 첫 요소로 초점이 이동한다.
- L[1164–1167](../../upstream/krds/raw/components/component_03_01.html:1164): Swipe 목적지 섹션으로 스크롤 된 상태에서 Swipe 동작을 실행하면 섹션 내부 요소 중 가장 첫 번째 요소로 가상 초점이 이동한다.

### 예시

- L[1186–1186](../../upstream/krds/raw/components/component_03_01.html:1186): 예시
- L[1190–1190](../../upstream/krds/raw/components/component_03_01.html:1190): 기본
- L[1209–1209](../../upstream/krds/raw/components/component_03_01.html:1209): 기본 코드 확인하기

### 마크업 가이드

- L[1229–1229](../../upstream/krds/raw/components/component_03_01.html:1229): 마크업 가이드
- L[1232–1232](../../upstream/krds/raw/components/component_03_01.html:1232): CSS 선택자
- L[1249–1252](../../upstream/krds/raw/components/component_03_01.html:1249): 전체영역 #krds-skip-link
- L[1262–1262](../../upstream/krds/raw/components/component_03_01.html:1262): 개발 시 접근성 관련 주의 사항
- L[1265–1265](../../upstream/krds/raw/components/component_03_01.html:1265): 건너뛰기 링크는 웹페이지 가장 앞에 제공하여 사용자가 제일 먼저 접근할 수 있도록 한다.

보존된 예시 마크업 인라인(참고용이며 공개 네이티브 API가 아님): L[1195–1203](../../upstream/krds/raw/components/component_03_01.html:1195)

CSS/JS/안내 이미지 출처 참조는 복사된 구현이 아닙니다. 표 행의 원본 HTML(필수/선택 열 보존)은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화한 발췌가 조건부 선택자를 필수로 재분류하지는 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 기록된 독립 결정: 대상은 같은 접근 가능한 네이티브 루트 안에서, 또는 어댑터 고유의 명시적 대상 등록을 통해 해석합니다. 임시 tabindex=-1은 라이브러리가 추가한 경우에만 blur/unmount 때 제거합니다. 호스트에 이미 있던 tabindex는 보존합니다. 루트를 넘는 문서 ID를 가정하지 않습니다.
- 외부 코드 예시는 참조만 하며 이번 준비에서 별도 파일로 삽입하거나 읽지 않았습니다: L1214 `../../code/skip_link.html`. 보지 못한 내용은 추정하지 않습니다.
- 상세 페이지에 안내 이미지 참조가 1개 있으며, 그 안의 픽셀 도식은 눈으로 확인하지 않았습니다. 텍스트 구조와 지침만 읽었습니다. 정확한 시각 치수와 자산은 이후 시각·출처 검토가 필요합니다.
- 의미 인터페이스와 파트·상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작·스토리 소스, 독립 인수가 필요합니다.

## 수용된 독립 결정 {#accepted-independent-resolution}

대상은 같은 접근 가능한 네이티브 루트 안에서, 또는 어댑터 고유의 명시적 대상 등록을 통해 해석합니다. 임시 tabindex=-1은 라이브러리가 추가한 경우에만 blur/unmount 때 제거합니다. 호스트에 이미 있던 tabindex는 보존합니다. 루트를 넘는 문서 ID를 가정하지 않습니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `SkipLinkContract`입니다. 네이티브 프레임워크는 자체 콘텐츠·ref·이벤트 전달만 확장합니다. 공통 매니페스트가 지원 사례 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼로는 이 계약을 충족할 수 없습니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에 인용·파생된 공식 텍스트는 원래 KRDS 권리와 출처 표시를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며 여기 인용한 실질 요구사항을 면제하지 않습니다.
