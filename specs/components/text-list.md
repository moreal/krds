# 텍스트 목록 {#text-list}

**계약 상태: 네이티브 구현용으로 범위 승인됨.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 승인일 뿐이며, 네이티브 동작, 시각/자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `text-list`, 한국어 이름 텍스트 목록, export `TextList`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_04_13](https://www.krds.go.kr/html/site/component/component_04_13.html), 보존된 [HTML](../../upstream/krds/raw/components/component_04_13.html). 조회 시각 `2026-10-29T23:28:04.043Z`, `77266` 바이트, SHA-256 `3c795ef7618610dfeb0a91598af3f3f20078cf90f292b4fad27c423c8cab44a9`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류는 `composition`, 인수된 프로젝트 완료 종류는 `component`입니다. composition 대신 component를 권장합니다. L1110–1119는 ul/ol/li와 list role을 명시적으로 매핑하고, L1336–1353은 마커 스타일을 설명할 뿐 조합된 서비스 워크플로는 없습니다.

지원하는 네이티브 사례(변형·상태 축): `unordered-dot`, `unordered-dash`, `unordered-hollow`, `ordered`. 이는 네이티브 사례 이름입니다. 상태, 반응형, 외관 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형/예시 헤딩 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

중요도가 같은 순서 없는 내용에는 네이티브 ul/li를, 순서/순위에는 ol/li를 씁니다. 중첩 목록은 부모 li 안에 둡니다. 수준은 최대 3개이며 들여쓰기, 어투, 문장 부호가 일관되어야 합니다. list-style:none이면 명시적 role=list/listitem으로 모바일 목록 탐색을 유지합니다.

## 의미 API {#plain-semantic-api}

독립 API: ordered=false, marker=dot|dash|hollow (dot), items {id,content,children?}[]. ordered 변형은 실제 숫자 순서를 씁니다. 콘텐츠에는 네이티브 링크를 담을 수 있습니다. 선택/현재 값이나 만들어 낸 listbox role은 없습니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어 값과 기본값을 함께 주거나 mode를 바꾸는 것은 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청을 한 번 내보냅니다. disabled, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI/초점 상태를 유지하고, 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하며 제어 prop이 계속 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

정적 텍스트는 탭 정지점이나 화살표 탐색을 추가하지 않습니다. 포함된 네이티브 대화형 콘텐츠는 일반 읽기 순서를 따릅니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

줄 바꿈된 텍스트는 같은 수준 텍스트 아래에 내어쓰기로 정렬합니다. 확대/좁은 너비에서도 계층을 유지합니다. 목록을 줄 바꿈으로 평탄화하지 않습니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼/리셋/IME 동작은 없습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

공개 export `TextList`는 유지하되 잠정 종류를 composition→component로 바꾸기를 권장합니다. 출처는 여러 컴포넌트의 작업 워크플로 없이 시맨틱 목록 프리미티브를 정의합니다. 편집상의 순서와 문장 부호는 호스트가, 올바른 중첩은 렌더러가 소유합니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, item, marker, content, nested-list; ordered/unordered,level.

렌더링되는 모든 소유 파트는 `data-krds-component="text-list"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위의 파트/상태 어휘는 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 순서/비순서 의미가 시각적 마커와 일치합니다.
2. 3수준 중첩이 구조적으로 유효합니다.
3. 마커를 초기화한 스타일에서도 모바일 보조 기술의 list role이 유지됩니다.
4. 길게 줄 바꿈된 레이블이 들여쓰기를 유지합니다.
5. 초점을 받는 범용 목록 컨테이너가 없습니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 표시, 움직임이 있는 곳의 동작 줄이기를 검증합니다. 빈 스위트를 성공으로 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`text-list--unordered-dot`, `text-list--unordered-dash`, `text-list--unordered-hollow`, `text-list--ordered`, `text-list--three-level`, `text-list--narrow`.

각 사례에는 해당하는 모든 네이티브 렌더러(Solid 1, React, Svelte, Vue, Lit, Qwik, Angular)에서 로컬 args/inputs/slots와 관찰 가능한 순수 로컬 상태가 필요합니다. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 따로 마련되며 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부를 인수해야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 사용합니다. Lit/Solid 2는 siheom 지원을 만들지 않고 선택된 네이티브 테스트 경로를 사용해야 합니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름/대상 관계를 검증해야 합니다. Solid 2는 Solid 1 컴파일러/렌더러를 import하면 안 됩니다. 다른 렌더러의 래퍼는 쓰지 않습니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 실제 보존된 상세 HTML에서 추출했으며 핵심 지침과 상호작용/마크업 표를 포함합니다. 공식 요구사항을 만들어 내지 않도록 원문 언어를 그대로 둡니다. “consider/recommended/can”에 해당하는 표현은 권고로 남습니다. 예시/CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 출처 JS 함수 표는 참고 근거일 뿐이며 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 아래 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립적인 선택입니다.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_04_13.html:883): 구조
- L[892–892](../../upstream/krds/raw/components/component_04_13.html:892): a. 글머리 기호 순서 없는 목록에 사용됨. 원, 네모, 줄표가 흔하게 사용되며 이 외에도 다양한 도형과 이미지를 사용할 수 있음
- L[893–893](../../upstream/krds/raw/components/component_04_13.html:893): b. 번호 순서 있는 목록에 사용됨. 숫자, 한글 자음, 영문 알파벳과 같이 순서의 진행을 보여줄 수 있는 글자가 사용됨
- L[889–895](../../upstream/krds/raw/components/component_04_13.html:889): 1. 목록 구분자 순차적으로 배열된 목록의 각 항목의 시작을 정의하는 문자 또는 이미지 a. 글머리 기호 순서 없는 목록에 사용됨. 원, 네모, 줄표가 흔하게 사용되며 이 외에도 다양한 도형과 이미지를 사용할 수 있음 b. 번호 순서 있는 목록에 사용됨. 숫자, 한글 자음, 영문 알파벳과 같이 순서의 진행을 보여줄 수 있는 글자가 사용됨
- L[896–896](../../upstream/krds/raw/components/component_04_13.html:896): 2. 텍스트 항목별 본문 내용

### 용례

- L[904–904](../../upstream/krds/raw/components/component_04_13.html:904): 용례
- L[906–906](../../upstream/krds/raw/components/component_04_13.html:906): 사용하기 적합한 경우
- L[910–910](../../upstream/krds/raw/components/component_04_13.html:910): 표를 사용하는 것이 적절하다.
- L[908–912](../../upstream/krds/raw/components/component_04_13.html:908): 여러 차원으로 구성된 텍스트 정보인 경우 표를 사용하는 것이 적절하다.
- L[915–915](../../upstream/krds/raw/components/component_04_13.html:915): 문단 형식으로 표현한다.
- L[913–917](../../upstream/krds/raw/components/component_04_13.html:913): 긴 문장의 서술형 텍스트인 경우 문단 형식으로 표현한다.

### 유형

- L[925–925](../../upstream/krds/raw/components/component_04_13.html:925): 유형
- L[927–927](../../upstream/krds/raw/components/component_04_13.html:927): 순서 없는 목록
- L[928–928](../../upstream/krds/raw/components/component_04_13.html:928): 특정 순서나 순서를 따를 필요가 없는 관련 텍스트를 표현할 때 사용한다.
- L[931–931](../../upstream/krds/raw/components/component_04_13.html:931): 순서 있는 목록
- L[932–932](../../upstream/krds/raw/components/component_04_13.html:932): 특정 순서로 항목을 표시하거나 계층 구조를 표시해야 하는 경우에 사용한다.

### 사용성 가이드라인

- L[939–939](../../upstream/krds/raw/components/component_04_13.html:939): 사용성 가이드라인
- L[942–942](../../upstream/krds/raw/components/component_04_13.html:942): 콘텐츠에 적합한 유형의 목록을 사용한다.
- L[943–944](../../upstream/krds/raw/components/component_04_13.html:943): 모든 항목이 동등한 수준의 중요도를 갖는 경우에는 순서 없는 목록을 사용한다. 항목에 순서를 지정할 수 있거나 순위를 매기는 것이 가능하다면 순서 있는 목록을 사용한다. 모든 항목의 중요도가 동등함에도 순서 있는 목록을 사용하게 되면 사용자가 콘텐츠의 내용을 잘못 이해하거나, 특정 번호의 콘텐츠만 확인하거나, 순서를 건너뛰어 읽게 될 수 있다.
- L[955–955](../../upstream/krds/raw/components/component_04_13.html:955): 동일한 수준의 항목은 일관된 어투로 작성한다.
- L[956–956](../../upstream/krds/raw/components/component_04_13.html:956): 만약 첫 번째 항목이 서술식으로 작성되었다면 목록에서 동일한 수준의 항목은 일관되게 서술식으로 작성한다.
- L[967–967](../../upstream/krds/raw/components/component_04_13.html:967): 문장 형식에 적합한 종결 부호를 사용한다.
- L[968–968](../../upstream/krds/raw/components/component_04_13.html:968): 서술식 목록의 가장 마지막 문장에는 반드시 종결 부호를 사용한다. 개조식 목록의 가장 마지막 문장에는 종결 부호를 생략할 수 있다.
- L[979–979](../../upstream/krds/raw/components/component_04_13.html:979): 들여쓰기를 활용하여 계층 구조를 명확하게 구분한다.
- L[980–980](../../upstream/krds/raw/components/component_04_13.html:980): 글자 크기를 조정하는 것만으로는 서로 다른 수준의 항목을 구분하는 것이 어려울 수 있다. 글자 크기, 계층 구조의 수준을 고려하여 각 수준별로 적절한 들여쓰기 여백을 설정하여 계층 구조가 명확하게 구분될 수 있도록 한다.
- L[991–991](../../upstream/krds/raw/components/component_04_13.html:991): 목록은 3수준 이내로 구성한다.
- L[992–992](../../upstream/krds/raw/components/component_04_13.html:992): 목록의 수준이 지나치게 깊어지면 항목 간 상하 관계를 이해하기 어려워진다.

### 접근성 가이드라인

- L[1107–1107](../../upstream/krds/raw/components/component_04_13.html:1107): 접근성 가이드라인
- L[1110–1110](../../upstream/krds/raw/components/component_04_13.html:1110): 목록 유형에 적합한 태그를 사용한다.
- L[1111–1111](../../upstream/krds/raw/components/component_04_13.html:1111): 시각적으로 목록의 항목이 글머리 기호로 구분되어 있다면 &lt;ul&gt;, &lt;li&gt; 태그로 목록을 마크업한다. 시각적으로 목록의 항목이 번호로 구분되어 있다면 &lt;ol&gt;, &lt;li&gt; 태그로 목록을 마크업한다.
- L[1117–1117](../../upstream/krds/raw/components/component_04_13.html:1117): list-style-type: none 스타일 지정으로 인한 접근성 문제에 유의한다.
- L[1118–1119](../../upstream/krds/raw/components/component_04_13.html:1118): 목록 요소(&lt;ul&gt;, &lt;ol&gt;)에 list-style-type: none 스타일이 지정되었을 때, 일부 모바일 디바이스 스크린 리더에서 요소의 역할을 탐지하지 못하는 문제가 발생할 수 있다. 따라서 목록에 list-style-type: none 스타일을 사용한다면 목록에는 role=”list”, 항목에는 role=”listitem”을 사용하여 목록의 역할을 명시해야 한다.

### 예시

- L[1140–1140](../../upstream/krds/raw/components/component_04_13.html:1140): 예시
- L[1144–1144](../../upstream/krds/raw/components/component_04_13.html:1144): 순서 없는 목록
- L[1210–1210](../../upstream/krds/raw/components/component_04_13.html:1210): 순서 없는 목록 코드 확인하기
- L[1226–1226](../../upstream/krds/raw/components/component_04_13.html:1226): 순서 있는 목록
- L[1292–1292](../../upstream/krds/raw/components/component_04_13.html:1292): 순서 있는 목록 코드 확인하기

### 마크업 가이드

- L[1313–1313](../../upstream/krds/raw/components/component_04_13.html:1313): 마크업 가이드
- L[1316–1316](../../upstream/krds/raw/components/component_04_13.html:1316): CSS 선택자
- L[1336–1341](../../upstream/krds/raw/components/component_04_13.html:1336): 텍스트 목록 .krds-info-list 순서 없는 목록(decimal) .decimal
- L[1342–1345](../../upstream/krds/raw/components/component_04_13.html:1342): 순서 없는 목록(dash) .dash
- L[1346–1349](../../upstream/krds/raw/components/component_04_13.html:1346): 순서 없는 목록(hollow) .hollow
- L[1350–1353](../../upstream/krds/raw/components/component_04_13.html:1350): 순서 있는 목록 .ordered


인라인으로 보존된 예시 마크업(참고용이며 공개 네이티브 API가 아님): L[1149–1204](../../upstream/krds/raw/components/component_04_13.html:1149), L[1231–1286](../../upstream/krds/raw/components/component_04_13.html:1231)

CSS/JS/안내 이미지의 출처 참조는 복사된 구현이 아닙니다. 필수/선택 열을 보존한 표 행의 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화된 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 출처의 용례 헤딩은 “appropriate”라고 하지만 예시는 표/문단을 대신 권장합니다. 헤딩이 아니라 설명의 권장을 기준으로 삼습니다.
- 연결된 외부 코드 예시는 참조만 하며 이번 준비에서 별도 파일로 포함하거나 읽지 않았습니다: L1215 `../../code/text_list.html`, L1297 `../../code/text_list_ordered.html`, L1368 `./variable/text_list.html`. 보지 못한 내용을 추론하지 않습니다.
- 상세에는 안내 이미지 참조 11개가 있으며, 내장 픽셀 다이어그램은 시각적으로 확인하지 않았습니다. 텍스트 구조/지침은 읽었습니다. 정확한 시각 치수/자산은 이후 시각·출처 검토가 필요합니다.
- 시맨틱 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작/스토리 소스, 독립 인수가 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 시맨틱 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `TextListContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트는 지원 사례 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에서 인용하거나 파생한 공식 텍스트는 원래의 KRDS 권리와 출처 표기를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며 여기 인용한 실질 요구사항을 면제하지 않습니다.
