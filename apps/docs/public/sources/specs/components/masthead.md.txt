# 공식 배너 {#masthead}

**계약 상태: 네이티브 구현용으로 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐이며, 네이티브 동작, 시각/자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `masthead`, 한국어 이름 공식 배너, export `Masthead`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_02_01](https://www.krds.go.kr/html/site/component/component_02_01.html), 보존된 [HTML](../../upstream/krds/raw/components/component_02_01.html). 조회 시각 `2026-10-29T23:28:02.535Z`, `62751` 바이트, SHA-256 `851bee30ce1846611f28161d508d7c72cdbebcb0bda29b594c768375167ff466`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조해 확인했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 별개입니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류 `component`, 수용된 프로젝트 완료 종류 `component`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 케이스(변형·상태 축): `default`. 이는 네이티브 케이스 이름이며, 상태·반응형·외형 축이 곧 공식 명명 변형은 아닙니다. 공식 유형/예시 헤딩은 근거 부록에 그대로 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

고정된 공식 문장 “이 누리집은 대한민국 공식 전자정부 누리집입니다.”를 담은 비대화형 배너 컨테이너입니다. 각 정부 서비스 페이지 최상단에서 건너뛰기 링크(SkipLink) 뒤, 헤더(Header) 앞에 둡니다. 공식 문구와 외형을 보존하며, 예시의 toggle-wrap 클래스를 근거로 펼침 UI를 만들지 않습니다.

## 의미 API {#plain-semantic-api}

독립 API: Masthead에는 동작/선택 API가 없습니다. 조합 수준에서 `governmentService` 승인 플래그를 명시적으로 제공합니다. 일반 콘텐츠는 고정된 한국어 문구이며, 번역 문구는 근거 검토 때까지 보류합니다. `href`, dismiss, open, `onClick` 의미는 없습니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/열림 상태를 정의하면 제어 모드, 없으면 비제어 모드입니다. 제어/기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청 하나를 내보냅니다. 비활성, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내보내지 않습니다. 제어 모드에서 거부되면 커밋된 UI/초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 그대로 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

탭 정지, 키 핸들러, 초점 이동, 라이브 안내가 없습니다. 이 반복 영역 앞에서 SkipLink가 첫 번째로 닿는 콘텐츠여야 합니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

좁은 너비와 확대에서도 공식 문장을 읽을 수 있게 둡니다. 주의를 끄는 애니메이션은 피합니다. 페이지 구성에서 상대 순서를 동일하게 유지합니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼 값, 리셋, IME 동작이 없습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

실제 공식 정부 서비스만 배너를 서비스 주장으로 표시할 수 있습니다. 독립 라이브러리/데모는 로컬 표본에 예시임을 표시해야 하며, 저장소를 정부 사이트로 보이게 해서는 안 됩니다. 호스팅과 자격은 호스트 책임입니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, text; 대화형 상태 없음.

렌더링되는 모든 소유 파트는 `data-krds-component="masthead"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 사용합니다. 네이티브/ARIA 상태가 기준입니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 페이지의 키보드 진입은 배너/Header 앞에서 SkipLink에 닿습니다.
2. 고정 문장을 읽을 수 있고 배너에 초점을 받는 하위 요소가 없습니다.
3. 무관한 독립 데모는 공식 정부 서비스라고 주장하지 않습니다.

이는 앞으로 필요한 테스트이며, 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 단서, 움직임이 있는 곳의 동작 줄이기를 확인합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 독립 로컬 표본 정책 {#independent-local-specimen-policy}

`governmentService:false`일 때는 공식 서비스 문장을 절대 렌더링하지 않습니다. 네이티브 컴포넌트는 배너를 생략하거나 독립 콘텐츠만 렌더링할 수 있습니다. 호스트 면책 문구로 false 분기가 공식 지위를 주장하도록 허가할 수 없습니다. 공개 `specimen` prop은 없습니다. 호스트는 `true`로 강제하거나 케이스 ID로 분기하지 말고 실제로 받은 `governmentService` 값을 그대로 전달해야 합니다.

문구/순서/좁은 화면 로컬 스토리 3개와 outcomes01/02는 `governmentService:true`를 공인 서비스 UI를 명시적으로 흉내 낸 조합 안에서만 씁니다. 각 호스트는 기존 표본 라벨 전달 통로로 바로 옆에 “공식 정부서비스를 가정한 배너 UI 예시입니다. 실제 공식 정부서비스가 아닙니다.”라는 안내를 보이게 렌더링합니다. 이 순수 예시는 localhost/프로젝트의 자격을 성립시키지 않고 실제 승인도 검증하지 않습니다. 실제 호스트 메타데이터는 `authorizedGovernmentHost:false`로 유지합니다. Outcome03은 대신 `governmentService:false`를 주고 “비공식 독립 로컬 예제”를 표시하며, 공식 서비스 문장이 독립 페이지 전체에 없어야 합니다. 보이는 호스트 문구는 네이티브 Masthead 콘텐츠와 별개이며 공개 API, 저장소 소유권, 권리를 바꾸지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`masthead--default-specimen`, `masthead--narrow-zoom`, `masthead--page-order`.

각 케이스는 해당되는 모든 네이티브 렌더러(Solid 1, React, Svelte, Vue, Lit, Qwik, Angular)에서 로컬 args/입력/슬롯과 관찰 가능한 순수 로컬 상태를 갖춰야 합니다. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 따로 준비하며, 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 인수되어야 합니다. 동작 스위트는 스토리 파일과 분리하며, 지원되는 upstream siheom 어댑터만 사용합니다. Lit/Solid 2는 siheom 지원을 만들어 내지 않고 선택한 네이티브 테스트 경로를 씁니다. Qwik은 첫 lazy 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 partial APF 소비를 테스트해야 합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증해야 합니다. Solid 2는 Solid 1 컴파일러/렌더러를 가져오지 않습니다. 다른 렌더러의 래퍼는 금지합니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 보존된 상세 HTML 원본에서 뽑았으며, 실질 지침과 상호작용/마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 원문 언어를 유지합니다. “고려/권장/가능” 같은 표현은 권고로 남습니다. 예시나 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원본 JS 함수 표는 참고 근거일 뿐이며, 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행하면 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립적 선택입니다.

### 구조

- L[883–883](../../upstream/krds/raw/components/component_02_01.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_02_01.html:889): 1. 컨테이너 배너 정보가 제공되는 영역
- L[890–890](../../upstream/krds/raw/components/component_02_01.html:890): 2. 텍스트 공식 디지털 서비스임을 안내하는 문구

### 사용성 가이드라인

- L[898–898](../../upstream/krds/raw/components/component_02_01.html:898): 사용성 가이드라인
- L[901–901](../../upstream/krds/raw/components/component_02_01.html:901): 배너는 모든 화면의 최상단에 제공한다.
- L[902–905](../../upstream/krds/raw/components/component_02_01.html:902): 공식 정부 배너 영역은 사용자가 해당 디지털 서비스를 신뢰할 수 있는 기준이 되며, 디지털 공공 서비스에 대한 일관성 있는 사용자 경험의 출발점이므로 모든 서비스에서 동일한 위치에 동일한 형태와 스타일로 제공한다. 배너의 위치가 일관성 없거나 특정 화면에만 제공될 경우 사용자에게 혼동을 줄 수 있다.
- L[908–908](../../upstream/krds/raw/components/component_02_01.html:908): 배너가 지나치게 주의를 끌지 않도록 표현한다.
- L[909–909](../../upstream/krds/raw/components/component_02_01.html:909): 서비스의 디자인 주제에 적합한 컨테이너 배경색을 사용한다. 화면 상단 영역에서 사용자가 가장 먼저 집중해야 하는 정보는 헤더 내부의 내비게이션과 기능 버튼이다.
- L[920–920](../../upstream/krds/raw/components/component_02_01.html:920): 배너 텍스트와 스타일을 변형하지 않는다.
- L[921–921](../../upstream/krds/raw/components/component_02_01.html:921): 모든 디지털 정부서비스에서 공식 배너가 일관성 있게 제공되었을 때 신뢰할 수 있다.
- L[932–932](../../upstream/krds/raw/components/component_02_01.html:932): 공식 디지털 정부서비스가 아닌 사이트에서는 배너를 사용하지 않아야 한다.
- L[933–933](../../upstream/krds/raw/components/component_02_01.html:933): 정부의 공식 서비스가 아닌 곳에서 배너를 사용하게 될 경우 사용자에게 혼동을 줄 수 있으므로 배너를 사용하지 않아야 한다.

### 접근성 가이드라인

- L[1039–1039](../../upstream/krds/raw/components/component_02_01.html:1039): 접근성 가이드라인
- L[1042–1042](../../upstream/krds/raw/components/component_02_01.html:1042): 건너뛰기 링크는 공식 배너 이전에 제공한다.
- L[1043–1043](../../upstream/krds/raw/components/component_02_01.html:1043): 공식 배너는 모든 페이지에서 반복되는 영역이므로 스크린 리더 사용자와 키보드 사용자가 이를 건너뛸 수 있도록 건너뛰기 링크를 가장 첫 요소로 제공해야 한다.

### 예시

- L[1064–1064](../../upstream/krds/raw/components/component_02_01.html:1064): 예시
- L[1068–1068](../../upstream/krds/raw/components/component_02_01.html:1068): 기본
- L[1093–1093](../../upstream/krds/raw/components/component_02_01.html:1093): 기본 코드 확인하기

### 마크업 가이드

- L[1113–1113](../../upstream/krds/raw/components/component_02_01.html:1113): 마크업 가이드
- L[1116–1116](../../upstream/krds/raw/components/component_02_01.html:1116): CSS 선택자
- L[1133–1136](../../upstream/krds/raw/components/component_02_01.html:1133): 전체영역 #krds-masthead
- L[1146–1146](../../upstream/krds/raw/components/component_02_01.html:1146): 개발 시 접근성 관련 주의 사항
- L[1148–1148](../../upstream/krds/raw/components/component_02_01.html:1148): 공식배너보다 건너뛰기 링크를 먼저 제공한다.

보존된 인라인 예시 마크업(참고용이며 공개 네이티브 API 아님): L[1073–1087](../../upstream/krds/raw/components/component_02_01.html:1073)

CSS/JS/가이드 이미지에 대한 출처 참조는 복사된 구현이 아닙니다. 표 행의 원본 HTML(필수/선택 열 보존)은 [source-evidence.json](../../catalog/source-evidence.json)에 보관합니다. 위의 평탄화 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 공식 HTML의 가이드 이미지는 픽셀 스타일을 시각 검토하지 않았습니다. 파일명으로 정확한 색상/간격을 추정하지 않습니다.
- 연결된 외부 코드 예시는 참조만 했고 이번 준비에서 별도 파일로 포함·열람하지 않았습니다: L1098 `../../code/masthead.html`. 보지 못한 내용은 추정하지 않습니다.
- 상세에는 가이드 이미지 참조가 6개 있으나, 포함된 픽셀 다이어그램은 시각 검사하지 않았습니다. 텍스트 구조와 지침만 읽었습니다. 정확한 시각 수치와 자산은 이후 시각/출처 검토가 필요합니다.
- 의미 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 자체 구현, 동작/스토리 소스, 독립 인수가 여전히 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `MastheadContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트가 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크의 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 의무입니다.

공식 인용·파생 텍스트는 원래의 KRDS 권리와 출처 표기를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 출처 식별은 그대로입니다. 남은 근거 한계는 검사하지 못한 가이드 픽셀, 연결 코드, 자산 승인에 관한 것이며, 여기 인용한 실질 요구사항을 면제하지 않습니다.
