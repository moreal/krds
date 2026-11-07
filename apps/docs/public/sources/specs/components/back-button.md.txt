# 뒤로가기 버튼 {#back-button}

**계약 상태: 네이티브 구현용으로 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 승인일 뿐입니다. 네이티브 동작, 시각·자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `back-button`, 한국어 이름 뒤로가기 버튼, export `BackButton`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_12_02](https://www.krds.go.kr/html/site/component/component_12_02.html). 보존 [HTML](../../upstream/krds/raw/components/component_12_02.html). 조회 시각 `2026-10-29T23:28:05.968Z`, `55546` 바이트, SHA-256 `08604e589588973c18a57db8c3bfde067b1e3b627691151d44592ad26c825bbf`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 별개입니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 원천 종류 `component`, 수용된 프로젝트 완료 종류 `integration`. 이력 목적지, 경고, 시스템·앱 내 뒤로가기 일관성을 다룬 L898–927에 따라 통합을 권장합니다. 라우터·이력 소유자가 필요합니다.

지원하는 네이티브 케이스(변형·상태 축): `default`, `dirty-confirmation`, `no-history-fallback`. 이는 네이티브 케이스 이름입니다. 상태·반응형·외형 축이 곧 공식 명명 변형은 아닙니다. 공식 유형·예시 제목은 근거 부록에 그대로 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

상단 바 왼쪽에 현재 화면 제목 옆 뒤로가기 컨트롤을 둡니다. 이전 화면(또는 정의된 상위)으로 돌아가며 취소·닫기와 시각적으로 구별됩니다. 입력 중인 내용을 잃기 전에 경고합니다. 호스트가 제어할 수 있으면 시스템·브라우저 뒤로가기와 앱 내 동작을 일치시켜야 합니다.

## 의미 API {#plain-semantic-api}

독립 API: label="뒤로가기", onBackRequest({reason}), canGoBack, fallbackHref?, dirty=false, 호스트가 제공하는 requestConfirmation. 이력 동작에는 type=button을 씁니다. 상위 목적지가 명시되면 실제 Link 변형을 씁니다. 알려진 앱 내 항목이 없을 때 history.back을 무작정 호출하지 않습니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 정의된 value/open은 제어 모드이고 undefined는 비제어 모드입니다. 제어 prop과 기본값을 함께 주거나 모드를 바꾸면 잘못된 구성입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 시맨틱 변경 요청을 한 번 내보냅니다. 비활성, 변화 없음, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 모드에서 거부되면 커밋된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 우선합니다. 추가 필드로 렌더러·머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

독립 네이티브 정책: 버튼의 Enter/Space/클릭은 한 번만 동작합니다. 변경 확인은 검토된 Modal을 열고, 취소하면 페이지·값·초점을 유지하며, 확인하면 호스트 내비게이션을 한 번 호출합니다. 목적지 초점과 이력·제스처 가로채기는 라우터·호스트 소관입니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

좁은 화면에서도 왼쪽 위치와 제목이 읽기 쉽고, 충분한 대상 크기가 시스템 안전 영역과 겹치지 않습니다. 이는 웹에 적용되는 맥락이며 브라우저 UI의 대체가 아닙니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

자체 폼 값이나 리셋은 없습니다. 버튼은 폼을 제출하거나 지우지 않습니다. 호스트의 dirty 상태는 폼·IME를 정확히 관찰해야 합니다. 조합 중인 텍스트가 성급한 이동으로 사라지면 안 됩니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

컴포넌트에서 통합으로 올리기를 권장합니다. 호스트가 라우터·이력, 브라우저 뒤로가기 가드, 대체 이동, 데이터 손실 정책을 소유합니다. 완료에는 로컬 내비게이션 스택과 저장 안 된 폼 목업(취소된 확인 포함)이 필요합니다. 스토리에서 실제 페이지 이탈은 필요 없습니다.

## 고정 파트와 상태 {#stable-parts-and-states}

파트: root, icon, label. 상태: disabled,pending-confirmation. 인접한 페이지 제목은 호스트 페이지 조합에 속하며 BackButton의 소유 파트가 아닙니다.

렌더링되는 모든 소유 파트는 `data-krds-component="back-button"`, 하나의 `data-krds-part` 토큰, 공백으로 구분된 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 우선합니다. 위 문장의 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 뒤로가기 요청은 기대하는 이전/상위 경로를 쓴다.
2. 변경 확인을 취소하면 폼과 초점이 유지된다.
3. 확인된 뒤로가기는 내비게이션을 한 번 호출한다.
4. 이력이 없으면 외부로 나가지 않고 알려진 대체 경로를 쓴다.
5. 호스트의 브라우저/앱 뒤로가기 가드가 같은 결정을 공유한다.

이 항목은 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색 이외의 상태 단서, 움직임이 있는 곳의 동작 줄이기를 확인합니다. 빈 스위트를 성공으로 주장하지 않습니다.

## 독립 로컬 표본 정책 {#independent-local-specimen-policy}

브라우저/앱 내 손실 방지 결과는 실제 `dirty:true` 입력에서 시작합니다. 호스트는 이동 전에 실제 보류 확인 모달을 표시합니다. 취소 또는 Escape는 입력과 경로를 유지하고, 확인하면 요청한 목적지로 이동할 수 있습니다. `expectedConfirmationResult`는 단언 표지일 뿐 호스트가 미리 내리는 결정이 아닙니다.

## 필수 네이티브 스토리 {#required-native-stories}

`back-button--default`, `back-button--dirty-confirmation`, `back-button--cancel-navigation`, `back-button--no-history-fallback`, `back-button--narrow`.

각 케이스는 해당하는 모든 네이티브 렌더러에서 로컬 args/inputs/slots와 관찰 가능한 순수 로컬 상태를 가져야 합니다. 대상은 Solid 1, React, Svelte, Vue, Lit, Qwik, Angular이며 Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 단계별로 따로 있으며 현재 파일럿 러너의 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 수용되어야 합니다. 동작 스위트는 스토리 파일과 분리하며 지원되는 upstream siheom 어댑터만 씁니다. Lit과 Solid 2는 선택된 네이티브 테스트 경로를 쓰며 siheom 지원을 만들어 내지 않습니다. Qwik은 첫 lazy 이벤트를 테스트합니다. Angular의 폼 컨트롤은 CVA·리셋과 partial APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러·렌더러를 가져오면 안 됩니다. 다른 렌더러의 래퍼는 쓰지 않습니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 실제 보존된 상세 HTML에서 가져왔으며 핵심 지침과 상호작용·마크업 표를 포함합니다. 공식 요구사항을 만들어 내지 않도록 원문 언어를 유지합니다. “고려/권장/가능” 같은 표현은 권고로 남습니다. 예시와 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원문 JS 함수 표는 참고 근거일 뿐이며 원본 KRDS JS는 네이티브가 제어하는 DOM에서 실행하면 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립적 선택입니다.


### 구조

- L[864–864](../../upstream/krds/raw/components/component_12_02.html:864): 구조
- L[870–870](../../upstream/krds/raw/components/component_12_02.html:870): 1. 뒤로가기 버튼 이전 화면으로 돌아가는 버튼
- L[871–872](../../upstream/krds/raw/components/component_12_02.html:871): 2. 제목 현재 화면의 제목을 표시

### 사용성 가이드라인

- L[880–880](../../upstream/krds/raw/components/component_12_02.html:880): 사용성 가이드라인
- L[883–883](../../upstream/krds/raw/components/component_12_02.html:883): 뒤로가기 버튼은 항상 상단바 좌측에 표시한다.
- L[884–886](../../upstream/krds/raw/components/component_12_02.html:884): 뒤로가기는 상단바 좌측에 위치함으로써 이전 화면으로 이동을 자연스럽게 의미 할 수 있도록 한다.
- L[898–898](../../upstream/krds/raw/components/component_12_02.html:898): 이전 화면으로의 이동을 기본으로 한다.
- L[899–900](../../upstream/krds/raw/components/component_12_02.html:899): 뒤로가기는 기본적으로 직전에 보던 화면(또는 상위 단계)으로 이동해야 한다, 동일 위치에 닫기, 취소 버튼을 위치 시켜 버튼 본연의 역할이 겹치지 않도록 명확이 구분하여 사용한다.
- L[913–913](../../upstream/krds/raw/components/component_12_02.html:913): 사용자가 이동을 예측 가능하도록 한다.
- L[914–915](../../upstream/krds/raw/components/component_12_02.html:914): 사용자가 버튼을 누르면 어디로 이동할지 예측이 가능하도록 설계한다.
- L[919–919](../../upstream/krds/raw/components/component_12_02.html:919): 작성 중인 내용이 사라지는 경우에는 항상 경고하여야 한다.
- L[920–921](../../upstream/krds/raw/components/component_12_02.html:920): 신청 프로세스나 정보를 입력하면 화면에서의 동작은 작성 중인 내용이 유실될 가능성이 있는 모든 상황에서, 반드시 사전 경고를 제공하여 사용자가 계속 진행 여부를 스스로 결정할 수 있도록 하여야 한다.
- L[925–925](../../upstream/krds/raw/components/component_12_02.html:925): 시스템 뒤로가기와 앱 내 뒤로가기는 최대한 동일하게 동작하여야 한다.
- L[926–927](../../upstream/krds/raw/components/component_12_02.html:926): 같은 화면에서 상단 뒤로가기 버튼과 시스템 back/제스처를 사용했을 때, 서로 다른 화면으로 이동하거나, 하나는 팝업을 닫고 하나는 페이지를 이탈하는 등 상이한 결과를 초래해서는 안 된다.

보존된 인라인 예시 마크업(참고용, 공개 네이티브 API 아님): 이 상세 페이지에는 인라인 예시 마크업이 없습니다.

원문의 CSS/JS/가이드 이미지 참조는 복사된 구현이 아닙니다. 필수/선택 열을 보존한 표 행의 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화된 발췌는 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 브라우저 이력 가로채기에 대한 공식 웹 처리는 규정되어 있지 않습니다. 라이브러리 버튼이 OS 제스처를 직접 가로챈다고 약속하지 않습니다.
- 상세 페이지에 가이드 이미지 참조가 5개 있으며, 그 안의 픽셀 도식은 시각적으로 검사하지 않았습니다. 텍스트 구조와 지침은 읽었습니다. 정확한 시각 치수·자산은 이후 시각·출처 검토가 필요합니다.
- 시맨틱 인터페이스와 파트·상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 자체 구현, 동작·스토리 소스, 독립 인수가 여전히 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 시맨틱 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `BackButtonContract`입니다. 네이티브 프레임워크는 자체 콘텐츠·ref·이벤트 전달만 확장합니다. 공유 매니페스트는 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에서 인용·파생한 공식 텍스트는 원래의 KRDS 권리와 출처 표기를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 원천 식별 정보는 바뀌지 않습니다. 열린 근거 한계는 검사하지 않은 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며 여기 인용된 실질 요구사항을 면제하지 않습니다.
