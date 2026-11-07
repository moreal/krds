# 단계 표시기 {#step-indicator}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐입니다. 네이티브 동작, 시각·자산 검토, 실행된 커버리지는 별도 관문으로 남습니다. 게시는 승인되지 않았습니다.

시맨틱 ID `step-indicator`, 한국어 이름 단계 표시기, export `StepIndicator`. 고정된 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세 페이지: [component_07_01](https://www.krds.go.kr/html/site/component/component_07_01.html), 보존본 [HTML](../../upstream/krds/raw/components/component_07_01.html). 조회 시각 `2026-10-29T23:28:04.734Z`, `73131` 바이트, SHA-256 `2720b539f16fe5e37c42c26eb502fdb0a5da7bfedc557e6c1c5b21f2cd237774`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정된 출처 종류는 `component`이고, 수용된 프로젝트 완료 종류도 `component`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 사례(변형·상태 축): `sequential`, `adaptive`, `compact`. 이는 네이티브 사례 이름입니다. 상태·반응형·외형 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형·예시 헤딩 원문은 근거 부록에 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

레이블이 있는 3–7개 단계를 네이티브 순서 목록으로 둡니다. 단계 번호, 현재·완료 단서, 연결선을 포함합니다. 현재 상태는 aria-current=true 또는 동등한 텍스트로 알리며, 완료를 색만으로 나타내지 않습니다. 프로세스는 정적 표시기일 수도 있고, 호스트가 허용하면 명시적 내비게이션일 수도 있습니다.

## 의미 API {#plain-semantic-api}

독립 API: steps {id,label,status:pending|current|complete,href?,optional?}[], mode=sequential|adaptive. 선택적 onStepRequest({id})는 내비게이션이 구성된 경우에만 둡니다. 막힌 이후 단계와 선택 단계의 건너뛰기 컨트롤은 프로세스 소유자가 결정합니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어/기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 의미 변경 요청 하나를 냅니다. 비활성, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 0회 냅니다. 제어 거부 시 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고, 제어 props가 계속 우선합니다. 추가 필드는 렌더러·머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

정적 레이블은 Tab 정지점이 아닙니다. 실제로 이동할 수 있는 단계는 앵커나 이름 있는 작업 버튼을 씁니다. 비활성 이후 단계는 활성화할 수 없습니다. 단계를 선택하면 검증이 완료된다는 암시를 하지 않습니다. 선택 단계의 건너뛰기는 명시적인 이름과 도착지를 가집니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

좁은 화면의 압축 보기는 현재/전체만 보여 줄 수 있습니다(예: 4단계 중 1단계). 숨겨진 초점 가능 단계 없이 접근 가능한 전체 프로세스 개요를 유지합니다. 왼쪽→오른쪽 또는 위→아래의 논리적 진행을 유지합니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼 값·리셋·IME 상태는 없습니다. 자식 단계의 폼은 호스트가 소유합니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 프로세스 상태, 완료된 선행 조건, 경로·검증, 선택 건너뛰기를 소유합니다. 완료는 색 점만이 아니라 실제 순차·적응형 로컬 흐름을 포함합니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, list, item, number, label, connector, current-indicator, complete-indicator; current,complete,pending,blocked.

렌더링되는 모든 소유 파트는 `data-krds-component="step-indicator"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 기준입니다. 위 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 순서 목록이 색 없이도 현재·완료를 전달합니다.
2. 순차형에서 막힌 단계는 검증을 우회할 수 없습니다.
3. 적응형 경로는 구성된 경우에만 활성화됩니다.
4. 압축 모드도 현재/전체를 노출합니다.
5. 선택 건너뛰기는 다음 필수 단계 또는 검토 단계에 도달합니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 단서, 움직임이 있다면 동작 줄이기를 검증합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 독립 로컬 표본 정책 {#independent-local-specimen-policy}

완료·선택 건너뛰기를 포함한 모든 로컬 프로세스 표본은 실제 단계 3–7개를 제공합니다. 선택 픽스처는 현재 선택 단계 `a`와 다음 검토 단계 `b`를 유지하며, 그 앞에 완료된 선행 단계 `prerequisite`가 있습니다. 실제 건너뛰기 도착지는 `/local/review`입니다.

## 필수 네이티브 스토리 {#required-native-stories}

`step-indicator--sequential`, `step-indicator--adaptive`, `step-indicator--compact`, `step-indicator--optional-skip`, `step-indicator--completed`.

각 사례는 해당하는 모든 네이티브 렌더러에서 로컬 args/입력/슬롯과 관찰 가능한 순수 로컬 상태가 필요합니다: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에서 따로 단계화하며, 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부를 인수해야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 씁니다. Lit과 Solid 2는 siheom 지원을 만들어 내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular의 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러·렌더러를 절대 import하지 않습니다. 다른 렌더러 래퍼는 없습니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 보존된 상세 HTML에서 가져왔으며 핵심 지침과 상호작용·마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 원문 언어를 유지합니다. “고려한다/권장/할 수 있다” 같은 표현은 권고로 남습니다. 예시·CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원본 JS 함수 표는 참고 근거일 뿐이며, 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행해서는 안 됩니다. 위의 공통 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립 선택입니다.

### 구조

- L[883–883](../../upstream/krds/raw/components/component_07_01.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_07_01.html:889): 1. 단계 숫자 단계 레이블 옆에 표시되는 작은 텍스트로 각 단계의 번호를 나타냄. 작은 디스플레이에서는 현재 단계, 전체 단계 수를 제외한 정보는 생략할 수 있음(예 - 4단계 중 1단계)
- L[890–890](../../upstream/krds/raw/components/component_07_01.html:890): 2. 단계 레이블 레이블각 단계에서 사용자가 수행해야 할 작업을 요약한 텍스트
- L[891–891](../../upstream/krds/raw/components/component_07_01.html:891): 3. 현재 단계 식별자 진행 중인 단계를 다른 단계와 구분하는 식별자
- L[892–892](../../upstream/krds/raw/components/component_07_01.html:892): 4. 완료된 단계 식별자 완료된 단계를 다른 단계와 구분하는 식별자
- L[893–893](../../upstream/krds/raw/components/component_07_01.html:893): 5. 연결선 단계와 단계 사이를 연결하는 선으로 프로세스의 선형성을 보여줌

### 사용성 가이드라인

- L[901–901](../../upstream/krds/raw/components/component_07_01.html:901): 사용성 가이드라인
- L[904–904](../../upstream/krds/raw/components/component_07_01.html:904): 단계 레이블은 해당 프로세스에 대한 간결하고 명확한 내용으로 제공한다.
- L[905–906](../../upstream/krds/raw/components/component_07_01.html:905): 레이블은 해당 단계/프로세스에서 사용자가 수행해야 하는 작업의 특성을 명확하게 보여줄 수 있는 내용으로 제공해야 한다. 레이블로만 설명을 제공하기 어려운 경우, 보조 텍스트를 인접 영역에 제공할 수 있으나, 레이블 자체는 텍스트가 잘리거나 줄 바꿈이 발생하지 않도록 짧은 단어, 문구로 구성해야 한다.
- L[917–917](../../upstream/krds/raw/components/component_07_01.html:917): 단계는 좌에서 우 또는 상에서 하의 순서로 논리적으로 전개될 수 있도록 구성한다.
- L[918–919](../../upstream/krds/raw/components/component_07_01.html:918): 사용자가 여러 단계로 구성된 프로세스에 관여 중임을 분명하게 인지하고 프로세스의 진행 방향을 확인할 수 있도록 각 단계는 선형적으로 표현한다. 단계의 흐름은 연결선, 화살표, 꺾쇠 기호 등을 활용하여 표현할 수 있다. 이 중 화살표, 꺾쇠 기호는 각 단계를 선형적으로 탐색하는 경우에 적합한 표현 방식이다. 어떤 표현 방식을 사용하든 한 사이트 내에서 단계는 일관성 있게 표현되어야 한다.
- L[922–922](../../upstream/krds/raw/components/component_07_01.html:922): 단계의 수는 최소 3개에서 최대 7개로 제공한다.
- L[923–924](../../upstream/krds/raw/components/component_07_01.html:923): 사용자의 인지적 부담을 줄이기 위해 단계의 수는 최대 7개로 제한할 것을 권장한다. 프로세스를 단계로 구분할 때 불필요한 단계나 사용자의 행동이 포함되지 않았는지 반복적으로 점검하고 논리적, 효율성 측면에서 문제가 없는 과업은 가능한 한 하나의 단계에서 처리될 수 있도록 해야 한다.
- L[927–927](../../upstream/krds/raw/components/component_07_01.html:927): 현재 단계를 명확하게 인지할 수 있도록 표현한다.
- L[928–928](../../upstream/krds/raw/components/component_07_01.html:928): 사용자가 자신이 거쳐온 단계, 앞으로 거쳐야 할 단계를 확인하고 진행 중인 단계의 과업을 명확하게 인지할 수 있도록 현재 단계를 다른 단계와 구분하여 표현해야 한다.
- L[939–939](../../upstream/krds/raw/components/component_07_01.html:939): 과업의 성격에 적합한 탐색 모델을 제공한다.
- L[940–941](../../upstream/krds/raw/components/component_07_01.html:940): 단계 표시기는 프로세스 및 단계의 논리적인 구성에 따라 순차적 탐색, 적응형 탐색 방식을 지원한다. 순차적 탐색 방식에서 사용자는 일단 정해진 순서에 따라 단계를 진행해야 한다. 한 단계에서 필요한 행동이 완료되지 않으면 다음 단계로 이동하는 데 사용되는 UI는 비활성화 상태로 제공된다. 반면 적응형 탐색 방식에서 사용자는 특정 단계를 건너뛰고 다른 단계를 먼저 탐색할 수 있고 건너뛴 단계에 자유로운 순서로 접근할 수 있다.
- L[944–944](../../upstream/krds/raw/components/component_07_01.html:944): 선택적인 단계를 건너뛸 수 있는 수단을 제공한다.
- L[945–946](../../upstream/krds/raw/components/component_07_01.html:945): 선택적인 단계는 가능한 한 모든 필수 단계를 거친 후 가장 마지막에 제공하는 것이 바람직하다. 프로세스에 선택적인 단계가 포함된 경우, 사용자가 선택적인 단계를 건너뛰어 다음 필수 단계로 이동할 수 있는 수단을 제공해야 한다. 남은 필수 단계가 존재하지 않는다면 최종 단계(최종 검토/제출)로 건너뛴다. 건너뛰기 UI에는 사용자가 쉽게 식별하고 이해할 수 있도록 ‘건너뛰기’, ‘다음에 입력하기’ 등 명확한 텍스트 레이블을 제공해야 한다.

### 접근성 가이드라인

- L[1053–1053](../../upstream/krds/raw/components/component_07_01.html:1053): 접근성 가이드라인
- L[1056–1056](../../upstream/krds/raw/components/component_07_01.html:1056): 순서 있는 목록을 사용한다.
- L[1057–1057](../../upstream/krds/raw/components/component_07_01.html:1057): 단계 목록과 항목을 &lt;ol&gt;, &lt;li&gt;로 마크업하여 스크린 리더에서 전체 단계 수와 구성을 빠르게 파악할 수 있도록 한다.
- L[1064–1064](../../upstream/krds/raw/components/component_07_01.html:1064): 단계 식별자를 색상으로만 구분하여 표현하지 않는다.
- L[1065–1065](../../upstream/krds/raw/components/component_07_01.html:1065): 현재 단계, 완료된 단계를 색상 이외의 수단으로 구분할 수 있는 시각적 단서를 제공해야 한다. 밑줄 제공, 1px 이상의 테두리 차이, 식별자 제공 등의 방법으로 크기나 형태 차원에서 정보를 구분하는 방법을 사용할 수 있다.
- L[1072–1072](../../upstream/krds/raw/components/component_07_01.html:1072): 현재 단계를 스크린 리더로 확인할 수 있도록 한다.
- L[1073–1074](../../upstream/krds/raw/components/component_07_01.html:1073): 단계 인디케이터가 시각적으로만 구분되는 것이 아니라 스크린 리더로도 전달될 수 있도록 해야 한다. 만약 단계 레이블에 ‘현재’, ‘현재 단계’라는 텍스트가 제공되지 않고 있다면 현재 탐색 중인 단계에 aria-current="true" 속성을 추가한다. aria-current 속성을 사용할 수 없는 경우, 현재 단계 레이블에 ‘현재 단계’라는 텍스트를 추가하여 시각적으로 표시되도록 하거나 프로그램적으로만 전달되도록 한다.

### 예시

- L[1094–1094](../../upstream/krds/raw/components/component_07_01.html:1094): 예시
- L[1098–1098](../../upstream/krds/raw/components/component_07_01.html:1098): 기본
- L[1187–1187](../../upstream/krds/raw/components/component_07_01.html:1187): 기본 코드 확인하기

### 마크업 가이드

- L[1208–1208](../../upstream/krds/raw/components/component_07_01.html:1208): 마크업 가이드
- L[1211–1211](../../upstream/krds/raw/components/component_07_01.html:1211): CSS 선택자
- L[1231–1234](../../upstream/krds/raw/components/component_07_01.html:1231): 전체영역 .krds-step-wrap
- L[1235–1240](../../upstream/krds/raw/components/component_07_01.html:1235): 단계 &gt; li 완료한 단계 .done
- L[1241–1244](../../upstream/krds/raw/components/component_07_01.html:1241): 현재단계 .active
- L[1245–1248](../../upstream/krds/raw/components/component_07_01.html:1245): 레이블 .step-tit
- L[1258–1258](../../upstream/krds/raw/components/component_07_01.html:1258): 개발 시 접근성 관련 주의 사항
- L[1260–1260](../../upstream/krds/raw/components/component_07_01.html:1260): 단계 표시기는 순서가 있는 목록에 해당하므로 ul 대신 ol 태그를 사용하여 마크업한다.
- L[1261–1261](../../upstream/krds/raw/components/component_07_01.html:1261): 스크린리더로 화면 낭독 시 현재 단계를 구분할 수 있도록 텍스트를 추가해 준다. (.sr-only 사용)

보존된 예시 마크업 인라인(참고용이며 공개 네이티브 API가 아님): L[1103–1181](../../upstream/krds/raw/components/component_07_01.html:1103)

CSS/JS/안내 이미지 출처 참조는 복사된 구현이 아닙니다. 표 행의 원본 HTML(필수/선택 열 보존)은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화한 발췌가 조건부 선택자를 필수로 재분류하지는 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 공식 페이지는 클릭 가능한 표시기를 요구하지 않습니다. 정적 의미와 내비게이션 의미는 분리해 두어야 합니다.
- 외부 코드 예시는 참조만 하며 이번 준비에서 별도 파일로 삽입하거나 읽지 않았습니다: L1192 `../../code/step_indicator.html`, L1273 `./variable/step_indicator.html`. 보지 못한 내용은 추정하지 않습니다.
- 상세 페이지에 안내 이미지 참조가 5개 있으며, 그 안의 픽셀 도식은 눈으로 확인하지 않았습니다. 텍스트 구조와 지침만 읽었습니다. 정확한 시각 치수와 자산은 이후 시각·출처 검토가 필요합니다.
- 의미 인터페이스와 파트·상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작·스토리 소스, 독립 인수가 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `StepIndicatorContract`입니다. 네이티브 프레임워크는 자체 콘텐츠·ref·이벤트 전달만 확장합니다. 공통 매니페스트가 지원 사례 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼로는 이 계약을 충족할 수 없습니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에 인용·파생된 공식 텍스트는 원래 KRDS 권리와 출처 표시를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며 여기 인용한 실질 요구사항을 면제하지 않습니다.
