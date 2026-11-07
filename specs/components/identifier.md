# 운영기관 식별자 {#identifier}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐입니다. 네이티브 동작, 시각·자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `identifier`, 한국어 이름 운영기관 식별자, export `Identifier`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_02_02](https://www.krds.go.kr/html/site/component/component_02_02.html), 보존본 [HTML](../../upstream/krds/raw/components/component_02_02.html). 수집 `2026-10-29T23:28:02.603Z`, `63641` 바이트, SHA-256 `c066b27040aae221596061378f7ce90e3cb675f9aea71aa8395efc2adf64148d`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류는 `component`, 수용된 프로젝트 완료 종류도 `component`입니다. component로 유지합니다. 고정된 식별 마크업과 이미지·텍스트 의미만 다루며 범용 푸터 레이아웃은 아닙니다.

지원하는 네이티브 케이스(변형·상태 축)는 `light`, `dark`입니다. 이는 네이티브 케이스 이름입니다. 상태·반응형·외형 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형·예시 헤딩 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

푸터 안의 마지막 하위 영역으로 section/article을 둡니다. 운영기관 로고 뒤에 정해진 관리 문장이 옵니다. 로고는 책임 운영기관을 나타내며, 서비스 로고는 푸터의 다른 곳에 속합니다. 요소 배치와 문장 패턴을 보존합니다.

## 의미 API {#plain-semantic-api}

독립 API입니다. Identifier는 institutionName, logo {src, alt}, theme light/dark(기본 light), 호스트가 검증하는 명시적 기관 관계 문구를 받습니다. alt는 실제 기관을 가리킵니다. 기본 기관, 저작권자, 정부 관계는 없습니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어와 기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 변경 요청 하나를 냅니다. 비활성, 무동작, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

정적 콘텐츠이므로 탭 정지점, 라이브 역할, 변경 이벤트가 없습니다. 호스트가 기관을 별도로 링크하더라도 그 Link 동작은 식별자 계약과 별개입니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

좁은 레이아웃에서도 로고/텍스트 순서를 유지합니다. 정체성을 바꾸지 않고 밝은/어두운 스킴 모두에서 대비를 유지합니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼 값, 리셋, IME 동작은 없습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 사실에 맞는 기관/관계와 사용이 승인된 로고를 제공합니다. 완료하려면 로컬 자산 출처 기록이 있어야 하며 브랜딩을 지어내지 않습니다. 비정부 사이트의 사용을 금지하는 공식 제한은 공식 배너(Masthead)와 마찬가지로 표본에도 적용됩니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, logo, text; theme=light|dark.

렌더링된 모든 소유 파트는 `data-krds-component="identifier"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 씁니다. 네이티브/ARIA 상태가 우선합니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 식별자는 푸터 랜드마크 안의 마지막 섹션입니다.
2. 로고 대체 텍스트는 운영기관을 가리킵니다.
3. 서비스 로고와 기관 로고를 바꿔 쓰지 않습니다.
4. 밝은/어두운 버전은 좁은 너비에서도 읽을 수 있습니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색 외 상태 단서, 움직임이 있다면 동작 줄이기를 검증합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`identifier--light`, `identifier--dark`, `identifier--footer-placement`.

각 케이스는 해당하는 모든 네이티브 렌더러에서 로컬 args/inputs/slots와 관찰 가능한 순수 로컬 상태가 필요합니다. 렌더러는 Solid 1, React, Svelte, Vue, Lit, Qwik, Angular이며 Solid 2 미리보기는 따로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 별도로 준비됩니다. 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 인수되어야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 상류 siheom 어댑터만 씁니다. Lit과 Solid 2는 siheom 지원을 지어내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름과 대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러/렌더러를 가져와서는 안 됩니다. 다른 프레임워크 렌더러 래퍼는 금지합니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 실제 보존 상세 HTML에서 추출했으며 핵심 지침과 상호작용·마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 출처 언어(한국어)를 그대로 둡니다. “고려/권장/수 있다” 같은 표현은 권고로 남습니다. 예시나 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 출처 JS 함수 표는 참고 근거일 뿐이며 원본 KRDS JS를 네이티브 제어 DOM에서 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 빼면 독립 선택입니다.

### 구조

- L[883–883](../../upstream/krds/raw/components/component_02_02.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_02_02.html:889): 1. 컨테이너 식별 정보가 제공되는 영역
- L[890–890](../../upstream/krds/raw/components/component_02_02.html:890): 2. 운영기관 로고 서비스 운영을 최종적으로 책임지는 기관의 로고
- L[891–891](../../upstream/krds/raw/components/component_02_02.html:891): 3. 안내 텍스트 운영기관의 관리를 받고 있음을 안내하는 정보

### 유형

- L[899–899](../../upstream/krds/raw/components/component_02_02.html:899): 유형
- L[901–901](../../upstream/krds/raw/components/component_02_02.html:901): 라이트
- L[907–907](../../upstream/krds/raw/components/component_02_02.html:907): 다크

### 사용성 가이드라인

- L[917–917](../../upstream/krds/raw/components/component_02_02.html:917): 사용성 가이드라인
- L[920–920](../../upstream/krds/raw/components/component_02_02.html:920): 식별자가 지나치게 주의를 끌지 않도록 표현한다.
- L[921–921](../../upstream/krds/raw/components/component_02_02.html:921): 서비스의 디자인 주제에 적합한 컨테이너 배경색을 사용한다. 화면 하단 영역에서 사용자가 가장 먼저 집중해야 하는 정보는 푸터 내부의 정보와 링크이다.
- L[924–924](../../upstream/krds/raw/components/component_02_02.html:924): 로고 영역에는 서비스의 로고가 아니라 서비스 운영 주체와 관련된 기관의 로고를 제공한다.
- L[925–925](../../upstream/krds/raw/components/component_02_02.html:925): 식별자는 서비스 운영을 책임지는 기관을 안내하기 위한 것이므로 서비스를 운영하는 기관의 로고가 제공되어야 하며 서비스 로고는 푸터에 배치되어야 한다.
- L[928–928](../../upstream/krds/raw/components/component_02_02.html:928): 안내 텍스트와 요소의 배치를 변경하지 않는다.
- L[929–929](../../upstream/krds/raw/components/component_02_02.html:929): 모든 디지털 정부서비스에서 식별자가 일관성 있게 제공되었을 때 신뢰도를 높일 수 있다.
- L[930–930](../../upstream/krds/raw/components/component_02_02.html:930): 안내 텍스트 예시: (운영기관 로고) 이 누리집은 [운영기관명]에서 운영하는 누리집입니다.
- L[934–934](../../upstream/krds/raw/components/component_02_02.html:934): 공식 디지털 정부서비스가 아닌 사이트에서는 식별자를 사용하지 않아야 한다.
- L[935–935](../../upstream/krds/raw/components/component_02_02.html:935): 정부의 공식 서비스가 아닌 곳에서 식별자를 사용하게 될 경우 사용자에게 혼동을 줄 수 있으므로 식별자를 사용하지 않아야 한다.

### 접근성 가이드라인

- L[1060–1060](../../upstream/krds/raw/components/component_02_02.html:1060): 접근성 가이드라인
- L[1063–1063](../../upstream/krds/raw/components/component_02_02.html:1063): 식별자 영역은 구조적으로 푸터 내부에 포함되도록 제공한다.
- L[1064–1064](../../upstream/krds/raw/components/component_02_02.html:1064): 푸터가 항상 문서의 마지막 요소로 제공되어야 하므로 식별자 영역은 &lt;section&gt;이나 &lt;article&gt;로 제공하고 푸터 내부의 가장 마지막 구획으로 포함시킨다.
- L[1070–1070](../../upstream/krds/raw/components/component_02_02.html:1070): 로고 이미지에 대체 텍스트를 제공한다.
- L[1071–1071](../../upstream/krds/raw/components/component_02_02.html:1071): 이미지 로고를 사용하는 경우 스크린 리더를 위한 대체 텍스트를 제공해야 한다.

### 예시

- L[1091–1091](../../upstream/krds/raw/components/component_02_02.html:1091): 예시
- L[1095–1095](../../upstream/krds/raw/components/component_02_02.html:1095): 기본
- L[1117–1117](../../upstream/krds/raw/components/component_02_02.html:1117): 기본 코드 확인하기

### 마크업 가이드

- L[1137–1137](../../upstream/krds/raw/components/component_02_02.html:1137): 마크업 가이드
- L[1140–1140](../../upstream/krds/raw/components/component_02_02.html:1140): CSS 선택자
- L[1157–1160](../../upstream/krds/raw/components/component_02_02.html:1157): 전체영역 .krds-identifier

보존된 인라인 예시 마크업(참고용이며 공개 네이티브 API가 아님): L[1100–1111](../../upstream/krds/raw/components/component_02_02.html:1100)

CSS/JS/안내 이미지 출처 참조는 복사한 구현이 아닙니다. 표 행의 필수/선택 열을 보존한 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화된 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 추가로 확인된 텍스트상의 모순은 없습니다. 의미 API와 기본값은 이 수용된 계약으로 고정됩니다. 네이티브 구현은 별도의 근거·검토 대상입니다.
- 연결된 외부 코드 예시는 참조만 하며 이 준비 단계에서 별도 파일로 포함하거나 읽지 않았습니다. L1122 `../../code/identifier.html`. 보지 않은 내용을 추측하지 않습니다.
- 상세에는 안내 이미지 참조 3건이 있습니다. 내장 픽셀 도해는 시각적으로 검사하지 않았습니다. 텍스트 구조와 지침은 읽었습니다. 정확한 시각 치수·자산은 이후 시각·출처 검토가 필요합니다.
- 의미 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작/스토리 소스, 독립 인수가 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `IdentifierContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트는 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼로는 이 계약을 충족할 수 없습니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에 인용·파생된 공식 텍스트는 원래의 KRDS 권리와 출처 표시를 유지합니다. 독립 코드의 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 검사하지 않은 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며, 여기 인용한 실질 요구사항을 면제하지 않습니다.
