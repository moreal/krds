# 배지 {#badge}

**계약 상태: 네이티브 구현용으로 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 승인일 뿐입니다. 네이티브 동작, 시각·자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `badge`, 한국어 이름 배지, export `Badge`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_04_06](https://www.krds.go.kr/html/site/component/component_04_06.html). 보존 [HTML](../../upstream/krds/raw/components/component_04_06.html). 조회 시각 `2026-10-29T23:28:03.628Z`, `77657` 바이트, SHA-256 `87506e8571849615ded7d2d2836f7ad4f19f2b4cae68906d7d13d303cfb7bf42`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 별개입니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 원천 종류 `component`, 수용된 프로젝트 완료 종류 `component`. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 케이스(변형·상태 축): `outline`, `filled`, `pastel`, `numeric`. 이는 네이티브 케이스 이름입니다. 상태·반응형·외형 축이 곧 공식 명명 변형은 아닙니다. 공식 유형·예시 제목은 근거 부록에 그대로 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

outline/filled/pastel 컨테이너 안의 비상호작용 레이블입니다. 텍스트는 항상 보이며 button/link 역할, href, 0 이상의 tabindex를 갖지 않습니다. 숫자 내용도 카운터 동작이 아니라 텍스트 정보입니다.

## 의미 API {#plain-semantic-api}

독립 API: label, appearance=outline|filled|pastel (기본 outline), tone=secondary|gray|point|danger|warning|success|information|disabled, size=small|medium|large (기본 medium), numeric=false. 공식 선택자 표에는 primary도 있으나 원문 지침이 primary 배경을 금지하므로, 지원 API는 primary 톤과 primary 배경을 제외합니다. 선택자와 본문의 충돌은 독립 프로젝트 정책으로 해소합니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 정의된 value/open은 제어 모드이고 undefined는 비제어 모드입니다. 제어 prop과 기본값을 함께 주거나 모드를 바꾸면 잘못된 구성입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 시맨틱 변경 요청을 한 번 내보냅니다. 비활성, 변화 없음, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 모드에서 거부되면 커밋된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 우선합니다. 추가 필드로 렌더러·머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

기본적으로 키보드 동작, 선택 이벤트, 초점, 라이브 안내가 없습니다. disabled 톤은 정보용 스타일이며 컨트롤이 실제로 비활성이라는 의미를 암시하면 안 됩니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

레이블은 줄바꿈 없이 짧게 유지하고 연결된 요소마다 배지는 하나입니다. 호스트가 상태를 말없이 자르지 않고 문구를 줄입니다. 텍스트·배경 대비는 4.5:1 이상입니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼·리셋·IME 동작은 없습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 간결하고 사실인 상태를 제공합니다. 완료는 실제 레이블이 있는 모든 톤·크기에서 시각·시맨틱을 만족하는 것이며 빈 장식 캡슐이 아닙니다.

## 고정 파트와 상태 {#stable-parts-and-states}

파트: root, label. 상태: appearance,tone,size,numeric. pressed/selected는 없습니다.

렌더링되는 모든 소유 파트는 `data-krds-component="badge"`, 하나의 `data-krds-part` 토큰, 공백으로 구분된 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 우선합니다. 위 문장의 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 배지는 Tab 순서에 들어가거나 상호작용 역할을 노출하지 않는다.
2. 색만이 아니라 텍스트가 상태를 전달한다.
3. 모든 스타일·크기가 확대에서도 읽을 수 있는 레이블을 가진다.
4. primary 배경 구성은 거부되거나 문서화된다.

이 항목은 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색 이외의 상태 단서, 움직임이 있는 곳의 동작 줄이기를 확인합니다. 빈 스위트를 성공으로 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`badge--outline`, `badge--filled`, `badge--pastel`, `badge--numeric`, `badge--sizes`, `badge--tones`, `badge--long-label`.

각 케이스는 해당하는 모든 네이티브 렌더러에서 로컬 args/inputs/slots와 관찰 가능한 순수 로컬 상태를 가져야 합니다. 대상은 Solid 1, React, Svelte, Vue, Lit, Qwik, Angular이며 Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 단계별로 따로 있으며 현재 파일럿 러너의 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 수용되어야 합니다. 동작 스위트는 스토리 파일과 분리하며 지원되는 upstream siheom 어댑터만 씁니다. Lit과 Solid 2는 선택된 네이티브 테스트 경로를 쓰며 siheom 지원을 만들어 내지 않습니다. Qwik은 첫 lazy 이벤트를 테스트합니다. Angular의 폼 컨트롤은 CVA·리셋과 partial APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러·렌더러를 가져오면 안 됩니다. 다른 렌더러의 래퍼는 쓰지 않습니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 실제 보존된 상세 HTML에서 가져왔으며 핵심 지침과 상호작용·마크업 표를 포함합니다. 공식 요구사항을 만들어 내지 않도록 원문 언어를 유지합니다. “고려/권장/가능” 같은 표현은 권고로 남습니다. 예시와 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원문 JS 함수 표는 참고 근거일 뿐이며 원본 KRDS JS는 네이티브가 제어하는 DOM에서 실행하면 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립적 선택입니다.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_04_06.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_04_06.html:889): 1. 레이블 배지를 통해 전달하고자 하는 메타 데이터
- L[890–890](../../upstream/krds/raw/components/component_04_06.html:890): 2. 컨테이너 배지를 배경과 구분하는 배경색 또는 윤곽선

### 용례

- L[898–898](../../upstream/krds/raw/components/component_04_06.html:898): 용례
- L[900–900](../../upstream/krds/raw/components/component_04_06.html:900): 사용하기 적합한 경우
- L[905–905](../../upstream/krds/raw/components/component_04_06.html:905): 배지를 사용함으로써 사용자의 주의를 끌어 중요한 정보를 확인하도록 행동을 유도할 수 있다.
- L[902–907](../../upstream/krds/raw/components/component_04_06.html:902): 새로 등록된 콘텐츠, 읽지 않은 알림을 안내할 때 배지를 사용함으로써 사용자의 주의를 끌어 중요한 정보를 확인하도록 행동을 유도할 수 있다.
- L[911–914](../../upstream/krds/raw/components/component_04_06.html:911): 데이터에 2개 이상의 상태 정보가 존재하며, 이를 사용자가 명확하게 인지하는 것이 중요한 경우 배지를 이용한다. 예) 신청 서비스의 진행 상태(접수 중, 마감됨, 모집 완료) 등
- L[908–916](../../upstream/krds/raw/components/component_04_06.html:908): 데이터의 상태 정보를 사용자가 알고 있는 것이 좋을 때 데이터에 2개 이상의 상태 정보가 존재하며, 이를 사용자가 명확하게 인지하는 것이 중요한 경우 배지를 이용한다. 예) 신청 서비스의 진행 상태(접수 중, 마감됨, 모집 완료) 등
- L[920–920](../../upstream/krds/raw/components/component_04_06.html:920): 사용하기 적합하지 않은 경우
- L[925–925](../../upstream/krds/raw/components/component_04_06.html:925): 태그를 사용하는 것이 적합하다.
- L[922–927](../../upstream/krds/raw/components/component_04_06.html:922): 대화형으로 사용하고자 할 때 태그를 사용하는 것이 적합하다.

### 사용성 가이드라인

- L[935–935](../../upstream/krds/raw/components/component_04_06.html:935): 사용성 가이드라인
- L[938–938](../../upstream/krds/raw/components/component_04_06.html:938): 레이블은 정확한 내용으로 간결하게 제공한다.
- L[939–939](../../upstream/krds/raw/components/component_04_06.html:939): 사용자가 배지를 통해 정보를 빠르게 파악할 수 있도록 핵심 정보를 간결하게 요약하고 텍스트에 줄바꿈이 발생하지 않도록 해야 한다.
- L[942–942](../../upstream/krds/raw/components/component_04_06.html:942): 레이블과 컨테이너의 색상은 일반적인 의미 체계, 일관성을 고려하여 선택한다.
- L[943–944](../../upstream/krds/raw/components/component_04_06.html:943): 배지 레이블이 전달하는 정보가 특정 색상이 가진 일반적인 의미 체계와 일치하는 경우, 적절한 색상의 사용은 사용자가 더 빠르게 정보를 처리하는 데 도움된다(예 - 중요, 경고, 반대와 같은 정보에 빨간색 사용). 그러나 과도한 색상 사용은 오히려 사용자의 주의를 분산시킬 수 있다.
- L[947–947](../../upstream/krds/raw/components/component_04_06.html:947): 배지를 대화형 요소로 사용하지 않는다.
- L[948–949](../../upstream/krds/raw/components/component_04_06.html:948): 배지를 대화형 요소로 마크업(&lt;a&gt;, &lt;button&gt; 등) 또는 역할(role=link, role=button 등)을 부여하거나 부적절한 속성(0 이상의 속성값을 가진 tabindex 속성)을 적용하여 키보드 사용자, 스크린 리더 사용자가 배지의 용도와 목적을 혼동하지 않도록 해야 한다.
- L[952–952](../../upstream/krds/raw/components/component_04_06.html:952): 하나의 요소에 한 개의 배지를 사용한다.
- L[953–953](../../upstream/krds/raw/components/component_04_06.html:953): 배지는 사용자가 빠르게 정보를 훑어 보는 과정을 돕기 위해 사용된다. 만약 한 항목에 여러 개의 배지가 사용된다면 지나치게 많은 정보가 강조되어 있어 배지의 사용 효과를 감소시킨다. 배지는 데이터와 관련된 가장 중요한 특성을 표현하는 데 한 번만 사용하는 것이 적절하다.
- L[956–956](../../upstream/krds/raw/components/component_04_06.html:956): 배지의 배경색으로 서비스의 주조색을 사용하지 않는다.
- L[957–957](../../upstream/krds/raw/components/component_04_06.html:957): 배지의 배경색으로 주조색(Primary color)을 이용하게 되면 사용자는 배지를 버튼으로 오인할 수 있다.

### 접근성 가이드라인

- L[1094–1094](../../upstream/krds/raw/components/component_04_06.html:1094): 접근성 가이드라인
- L[1097–1097](../../upstream/krds/raw/components/component_04_06.html:1097): 텍스트 레이블을 제공한다.
- L[1098–1098](../../upstream/krds/raw/components/component_04_06.html:1098): 배지는 접근성과 명확한 이해를 위해 항상 텍스트 레이블을 제공해야 한다.
- L[1105–1105](../../upstream/krds/raw/components/component_04_06.html:1105): 텍스트 레이블의 색상은 배경과 4.5:1 이상의 명도 대비를 갖도록 표현한다.
- L[1106–1106](../../upstream/krds/raw/components/component_04_06.html:1106): 대부분의 사용자가 텍스트 콘텐츠를 문제없이 인지할 수 있도록 텍스트 색상, 배지의 배경 색상 선정에 유의해야 한다.

### 예시

- L[1127–1127](../../upstream/krds/raw/components/component_04_06.html:1127): 예시
- L[1131–1131](../../upstream/krds/raw/components/component_04_06.html:1131): 기본
- L[1182–1182](../../upstream/krds/raw/components/component_04_06.html:1182): 기본 코드 확인하기
- L[1198–1198](../../upstream/krds/raw/components/component_04_06.html:1198): 사이즈
- L[1249–1249](../../upstream/krds/raw/components/component_04_06.html:1249): 사이즈 코드 확인하기
- L[1265–1265](../../upstream/krds/raw/components/component_04_06.html:1265): 숫자형
- L[1290–1290](../../upstream/krds/raw/components/component_04_06.html:1290): 숫자형 코드 확인하기

### 마크업 가이드

- L[1310–1310](../../upstream/krds/raw/components/component_04_06.html:1310): 마크업 가이드
- L[1313–1313](../../upstream/krds/raw/components/component_04_06.html:1313): CSS 선택자
- L[1334–1340](../../upstream/krds/raw/components/component_04_06.html:1334): 전체영역 .krds-badge 컬러 아웃라인 .outline-* (primary/ secondary/ gray/ point/ danger/ warning/ success/ information/ disabled)
- L[1341–1344](../../upstream/krds/raw/components/component_04_06.html:1341): bg .bg-* (primary/ secondary/ gray/ point/ danger/ warning/ success/ information/ disabled)
- L[1345–1348](../../upstream/krds/raw/components/component_04_06.html:1345): bg (파스텔) .bg-light-* (primary/ secondary/ gray/ point/ danger/ warning/ success/ information/ disabled)
- L[1349–1353](../../upstream/krds/raw/components/component_04_06.html:1349): 크기 크게 .large
- L[1354–1357](../../upstream/krds/raw/components/component_04_06.html:1354): 중간 .medium
- L[1358–1361](../../upstream/krds/raw/components/component_04_06.html:1358): 작게 .small
- L[1362–1365](../../upstream/krds/raw/components/component_04_06.html:1362): 숫자 .number

보존된 인라인 예시 마크업(참고용, 공개 네이티브 API 아님): L[1136–1176](../../upstream/krds/raw/components/component_04_06.html:1136), L[1203–1243](../../upstream/krds/raw/components/component_04_06.html:1203), L[1270–1284](../../upstream/krds/raw/components/component_04_06.html:1270)

원문의 CSS/JS/가이드 이미지 참조는 복사된 구현이 아닙니다. 필수/선택 열을 보존한 표 행의 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화된 발췌는 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 기록된 독립 결정: 수용된 Badge API는 primary 톤과 primary 배경을 지원하지 않습니다. 금지된 배경에 대한 실질 본문을 따르며, 모순되는 선택자 근거는 보존합니다.
- 연결된 외부 코드 예시는 참조만 하고 이번 준비에서 별도 파일로 포함하거나 읽지 않았습니다: L1187 `../../code/badge.html`, L1254 `../../code/badge_size.html`, L1295 `../../code/badge_number.html`, L1380 `./variable/badge.html`. 보지 않은 내용을 추정하지 않습니다.
- 상세 페이지에 가이드 이미지 참조가 1개 있으며, 그 안의 픽셀 도식은 시각적으로 검사하지 않았습니다. 텍스트 구조와 지침은 읽었습니다. 정확한 시각 치수·자산은 이후 시각·출처 검토가 필요합니다.
- 시맨틱 인터페이스와 파트·상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 자체 구현, 동작·스토리 소스, 독립 인수가 여전히 필요합니다.

## 수용된 독립 결정 {#accepted-independent-resolution}

수용된 Badge API는 primary 톤과 primary 배경을 지원하지 않습니다. 금지된 배경에 대한 실질 본문을 따르며, 모순되는 선택자 근거는 보존합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 시맨틱 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `BadgeContract`입니다. 네이티브 프레임워크는 자체 콘텐츠·ref·이벤트 전달만 확장합니다. 공유 매니페스트는 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에서 인용·파생한 공식 텍스트는 원래의 KRDS 권리와 출처 표기를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 원천 식별 정보는 바뀌지 않습니다. 열린 근거 한계는 검사하지 않은 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며 여기 인용된 실질 요구사항을 면제하지 않습니다.
