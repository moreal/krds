# 파비콘 {#favicon}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 수락일 뿐이며, 네이티브 동작·시각/자산 검토·실행된 커버리지는 별도 게이트입니다. 어떤 게시도 승인되지 않았습니다.

시맨틱 ID `favicon`, 한국어 이름 파비콘, export `Favicon`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_04_14](https://www.krds.go.kr/html/site/component/component_04_14.html), 보존된 [HTML](../../upstream/krds/raw/components/component_04_14.html). 조회 시각 `2026-10-29T23:28:04.115Z`, `59532` 바이트, SHA-256 `1ded75634138e65690cc3a60c6d61c6c344b7d4d5cca6ef9ced66605a7d68a83`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조해 확인했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 별개입니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류 `asset`, 수용된 프로젝트 완료 종류 `asset`. 자산으로 유지합니다. 공식 L903–913은 CI 기반 파비콘 파일과 테마별 버전을 요구하며, 상호작용 컴포넌트는 설명하지 않습니다.

지원하는 네이티브 케이스(변형·상태 축): `standard`, `extended`, `light`, `dark`. 이는 네이티브 케이스 이름이며, 상태·반응형·외관 축이 공식 명명 변형인 것은 아닙니다. 공식 유형/예시 제목 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

문서 head의 파비콘 자산 통합이며 페이지 안의 div가 아닙니다. 공식 표준형은 정부상징 기관에, 확장형은 자체 CI 기관/서비스에 적용됩니다. 알아볼 수 있는 16px 마크를 제공하고, 대표/하위 서비스 도메인 전반에 일관된 기관 정체성을 유지합니다.

## 의미 API {#plain-semantic-api}

독립 API: Favicon 자산 기술자 {light:{href,type,sizes},dark?:{href,type,sizes},touchIcon?}. head 통합은 지원되는 범위에서 color-scheme 미디어와 함께 실제 <link rel=icon>을 냅니다. 이벤트, 초점, 폼, 런타임 값 상태는 없습니다. 경로는 로컬에 번들된 승인 파일을 가리키며, 기본 정부 문장(crest) 이미지는 없습니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어/기본값을 함께 주거나 모드를 바꾸는 것은 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청 하나를 냅니다. 비활성, 무동작, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 커밋된 UI와 초점 상태를 유지합니다. 취소된 리셋은 아무 일도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하며, 제어 prop이 계속 우선합니다. 추가 필드로 렌더러/머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

키보드 동작이 없습니다. 가짜 시각 컨트롤을 만들지 않고, 브라우저/head 메타데이터와 호스트 설치용 접근 가능한 안내를 검증합니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

같은 심볼을 유지하는 라이트/다크 버전을 준비합니다. 모바일 홈 화면/터치 자산 지원은 호스트의 통합 선택이며, 일치하는 플랫폼 메타데이터 검토가 필요합니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼/리셋/IME 동작이 없습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 CI 권리, 파일, 도메인 일관성, head 삽입을 소유합니다. 자산 완료에는 출처 기록/해시가 있는 커밋된 로컬 파일, 올바른 MIME/크기/head 링크, 각 호스트 픽스처의 브라우저/탭 검토가 필요하며, 컴포넌트 export만으로는 충족할 수 없습니다.

## 고정 파트와 상태 {#stable-parts-and-states}

렌더되는 data-krds 파트가 필요 없습니다. 선택적 문서 미리보기 루트와 라이트/다크 샘플은 명시적으로 미리보기이며 런타임 파비콘 DOM이 아닙니다.

렌더되는 모든 소유 파트는 `data-krds-component="favicon"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위 열거는 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정됩니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. head 링크가 예상 MIME/크기의 로컬 자산으로 해석됩니다.
2. 라이트/다크 환경 모두 16px에서 알아볼 수 있는 실루엣을 유지합니다.
3. 외부 서비스로의 런타임 요청이 없습니다.
4. 호스트 픽스처에서 SSR/클라이언트 탐색 뒤에도 파비콘이 있습니다.

위 항목은 앞으로 필요한 테스트이며, 실행되었거나 인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색 이외의 상태 단서, 움직임이 있는 곳의 동작 줄이기를 검증합니다. 빈 스위트를 성공으로 간주하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`favicon--standard-local-head`, `favicon--extended-local-head`, `favicon--light-dark-preview`.

각 케이스는 적용 가능한 모든 네이티브 렌더러(Solid 1, React, Svelte, Vue, Lit, Qwik, Angular)에서 로컬 args/입력/슬롯과 관찰 가능한 순수 로컬 상태를 가져야 합니다. Solid 2 미리보기는 별도로 격리됩니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 따로 마련되며, 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 수락되어야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 씁니다. Lit/Solid 2는 siheom 지원을 만들어 내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연(lazy) 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러/렌더러를 가져오면 안 됩니다. 다른 렌더러 래퍼는 금지입니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 보존된 상세 HTML 원본(본문 지침과 상호작용·마크업 표 포함)에서 추출했습니다. 공식 요구사항을 만들어 내지 않도록 원문 언어를 유지합니다. "고려한다/권장/할 수 있다" 같은 표현은 권고로 남습니다. 예시나 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원본 JS 함수 표는 참고 근거일 뿐이며, 네이티브가 제어하는 DOM에서 KRDS 원본 JS를 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립 선택입니다.

### 유형

- L[880–880](../../upstream/krds/raw/components/component_04_14.html:880): 유형
- L[882–882](../../upstream/krds/raw/components/component_04_14.html:882): 표준형
- L[883–883](../../upstream/krds/raw/components/component_04_14.html:883): (대상 : 정부 상징 로고를 사용하는 중앙행정기관(부/처/청), 특별지방행정기관, 부속기관 등)
- L[889–889](../../upstream/krds/raw/components/component_04_14.html:889): 확장형
- L[890–890](../../upstream/krds/raw/components/component_04_14.html:890): (대상 : 독자적인 로고를 사용하는 중앙기관 (운영 서비스·시스템) 및 공공기관 (대표·운영서비스·시스템)

### 사용성 가이드라인

- L[900–900](../../upstream/krds/raw/components/component_04_14.html:900): 사용성 가이드라인
- L[903–903](../../upstream/krds/raw/components/component_04_14.html:903): 정부기관의 식별성을 높이기 위해 기관 CI 기반 파비콘을 필수로 제공한다.
- L[904–905](../../upstream/krds/raw/components/component_04_14.html:904): 브라우저 탭·즐겨찾기·모바일 홈 화면에서 기관/서비스를 빠르게 식별할 수 있도록 기관 CI 기반 파비콘을 필수로 제공한다. 파비콘은 16px에서도 인지 가능하도록 복잡한 디테일을 제거하고 단순화된 심볼 또는 약칭으로 제작하며, 배경과의 명도·색상 대비를 충분히 확보해 어떤 환경에서도 또렷하게 보이도록 한다. 대표 도메인과 서브 서비스에 동일 파비콘을 적용해 이용자가 동일 기관 서비스임을 인지할 수 있게 한다.
- L[912–912](../../upstream/krds/raw/components/component_04_14.html:912): 라이트·다크 테마 모두에서 구분되도록 버전을 마련한다.
- L[913–913](../../upstream/krds/raw/components/component_04_14.html:913): 라이트·다크 테마 및 브라우저 및 OS UI 배경 변화에도 식별성이 유지되도록 테마 대응 버전을 제공하며 동일한 심볼 형태를 유지한 채 명도 반전, 외곽선, 배경판 적용 등으로 충분한 대비를 확보한다.

### 예시

- L[1045–1045](../../upstream/krds/raw/components/component_04_14.html:1045): 예시
- L[1049–1049](../../upstream/krds/raw/components/component_04_14.html:1049): 기본
- L[1070–1070](../../upstream/krds/raw/components/component_04_14.html:1070): 기본 코드 확인하기

인라인으로 보존된 예시 마크업(참고용이며 공개 네이티브 API가 아님): L[1054–1064](../../upstream/krds/raw/components/component_04_14.html:1054)

CSS/JS/가이드 이미지 원본 참조는 복사된 구현이 아닙니다. 필수/선택 열을 보존한 표 행의 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위 평탄화 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 고정 HTML은 정확한 ICO/PNG/SVG 조합이나 터치 아이콘 크기를 정의하지 않습니다. 호스트 브라우저/플랫폼 자산 정책 검토 뒤에만 선택합니다. 로고 권리는 미해결입니다.
- 연결된 외부 코드 예시는 참조만 하고, 이번 준비에서 별도 파일로 포함하거나 읽지 않았습니다: L1075 `../../code/favicon.html`. 확인하지 못한 내용은 추정하지 않습니다.
- 상세에 가이드 이미지 참조가 5개 있으며, 내장 픽셀 도식은 시각적으로 검사하지 않았습니다. 텍스트 구조와 지침만 읽었으며, 정확한 시각 치수와 자산은 이후 시각/출처 검토가 필요합니다.
- 의미 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정됩니다. 각 네이티브 렌더러는 자체 구현, 동작/스토리 소스, 독립 인수가 여전히 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `FaviconContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트가 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트·조합·자산·통합에 계속 필수입니다.

이 문서의 공식 인용·파생 텍스트는 원래 KRDS 권리와 출처 표기를 유지하며, 독립 코드 MIT 부여는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며, 여기 인용한 실질 요구사항을 면제하지 않습니다.
