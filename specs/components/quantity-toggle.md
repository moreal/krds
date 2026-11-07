# 수량 토글 {#quantity-toggle}

**계약 상태: 네이티브 구현용으로 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐이며, 네이티브 동작, 시각/자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `quantity-toggle`, 한국어 이름 수량 토글, export `QuantityToggle`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_12_04](https://www.krds.go.kr/html/site/component/component_12_04.html), 보존된 [HTML](../../upstream/krds/raw/components/component_12_04.html). 조회 시각 `2026-10-29T23:28:06.116Z`, `58655` 바이트, SHA-256 `d896d4eea40d962bc4cf335c1d325e9101ffd5dd8d8a942d892a8ad97ab4d522`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조해 확인했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 별개입니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류 `component`, 수용된 프로젝트 완료 종류 `component`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 케이스(변형·상태 축): `default`, `minimum`, `maximum`, `disabled`. 이는 네이티브 케이스 이름이며, 상태·반응형·외형 축이 곧 공식 명명 변형은 아닙니다. 공식 유형/예시 헤딩은 근거 부록에 그대로 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

레이블이 있는 그룹입니다. 감소 버튼, 가운데에 보이는 현재 수량, 필드로 분리된 증가 버튼으로 구성합니다. 사용자는 키보드 텍스트 입력이 아니라 버튼으로 조정합니다. 기준값을 포함해 선택 가능한 값을 11단계 이하로 제한하고, 한계에 닿으면 해당 버튼을 비활성화합니다.

## 의미 API {#plain-semantic-api}

독립 API: `min=0`, `max=10`, `step=1`, `value`/`defaultValue=min`, `onValueChange({value})`, `name?`, `disabled=false`, `label`, `unit?`. 선택 가능한 값이 11개를 넘거나 step이 일관되지 않은 설정은 거부합니다. 가운데 출력은 편집할 수 없는 텍스트이며 편집 가능한 spinbutton이 아닙니다. 이름 붙은 숨김 값이 직렬화될 수 있습니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/열림 상태를 정의하면 제어 모드, 없으면 비제어 모드입니다. 제어/기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청 하나를 내보냅니다. 비활성, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내보내지 않습니다. 제어 모드에서 거부되면 커밋된 UI/초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 그대로 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

독립 정책: 네이티브 버튼의 클릭/Enter/Space는 한 번만 변경합니다. 고정 이름은 “decrease/increase [quantity label]”입니다. 출력 관계가 현재 값을 식별합니다. 새로 비활성이 된 경계에서도 초점 유지가 인지 가능해야 합니다(수용된 독립 정책: 활성화를 막은 `aria-disabled` 버튼을 쓰면서 초점 유지).

## 반응형·모바일 요구 {#responsive-mobile-requirements}

버튼 클릭 영역은 가운데 값 주변에서 충분히 크고 간격을 둡니다. 좁은 화면과 확대에서도 레이블과 값이 보입니다. 기본값으로 길게 눌러 자동 반복하거나 드래그 제스처를 쓰지 않습니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

이름 붙은 선택적 숨김 입력이 실제 숫자 문자열을 전달하며, 비활성이면 생략됩니다. 리셋은 초기값을 복원하고, 제어 리셋은 콜백 없이 현재 prop을 유지합니다. 버튼은 `type=button`입니다. 자유 텍스트/IME 경로는 없습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

흔히 선택되는 기본값, 경계, 실제 수량 효과는 호스트가 맡습니다. 정적인 더하기/빼기 아이콘이 아니라 실제 경계 피드백과 폼 리셋이 완료 조건입니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, label, decrement, output, increment, hidden-input; at-minimum,at-maximum,disabled.

렌더링되는 모든 소유 파트는 `data-krds-component="quantity-toggle"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 사용합니다. 네이티브/ARIA 상태가 기준입니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 현재 값이 항상 보이고 경계 안에 있습니다.
2. 키보드/포인터 활성화마다 한 단계씩 바뀝니다.
3. 경계에서 사용할 수 없는 동작은 아무 일도 하지 않고 상태를 안내합니다.
4. 11개 이하의 값을 검증합니다.
5. 이름 값, 리셋, 비활성 제출이 올바릅니다.
6. 의도치 않은 폼 제출이 없습니다.

이는 앞으로 필요한 테스트이며, 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 단서, 움직임이 있는 곳의 동작 줄이기를 확인합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`quantity-toggle--default`, `quantity-toggle--minimum`, `quantity-toggle--maximum`, `quantity-toggle--disabled`, `quantity-toggle--unit-label`, `quantity-toggle--form-reset`.

각 케이스는 해당되는 모든 네이티브 렌더러(Solid 1, React, Svelte, Vue, Lit, Qwik, Angular)에서 로컬 args/입력/슬롯과 관찰 가능한 순수 로컬 상태를 갖춰야 합니다. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 따로 준비하며, 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 인수되어야 합니다. 동작 스위트는 스토리 파일과 분리하며, 지원되는 upstream siheom 어댑터만 사용합니다. Lit/Solid 2는 siheom 지원을 만들어 내지 않고 선택한 네이티브 테스트 경로를 씁니다. Qwik은 첫 lazy 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 partial APF 소비를 테스트해야 합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증해야 합니다. Solid 2는 Solid 1 컴파일러/렌더러를 가져오지 않습니다. 다른 렌더러의 래퍼는 금지합니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 보존된 상세 HTML 원본에서 뽑았으며, 실질 지침과 상호작용/마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 원문 언어를 유지합니다. “고려/권장/가능” 같은 표현은 권고로 남습니다. 예시나 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원본 JS 함수 표는 참고 근거일 뿐이며, 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행하면 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립적 선택입니다.

### 구조

- L[864–864](../../upstream/krds/raw/components/component_12_04.html:864): 구조
- L[870–870](../../upstream/krds/raw/components/component_12_04.html:870): 1. 레이블 사용자가 어떤 값을 선택해야 하는지를 안내하는 문구
- L[871–872](../../upstream/krds/raw/components/component_12_04.html:871): 2. 버튼 수량 필드의 값을 증가, 감소 시키는 역할의 버튼
- L[873–873](../../upstream/krds/raw/components/component_12_04.html:873): 3. 수량 필드 현재 선택된 값을 표시하는 텍스트

### 용례

- L[882–882](../../upstream/krds/raw/components/component_12_04.html:882): 용례
- L[884–884](../../upstream/krds/raw/components/component_12_04.html:884): 사용하기 적합한 경우
- L[889–891](../../upstream/krds/raw/components/component_12_04.html:889): 증명서 발급 수, 관람 인원 수 등과 같이 일반적으로 선택되는 값이 대부분의 사용자가 선택하는 값이거나 그 값을 크게 벗어나지 않는 경우 사용이 적합하다.
- L[886–893](../../upstream/krds/raw/components/component_12_04.html:886): 사용자들이 선택하는 일반적인 값이 정해져 있는 경우 증명서 발급 수, 관람 인원 수 등과 같이 일반적으로 선택되는 값이 대부분의 사용자가 선택하는 값이거나 그 값을 크게 벗어나지 않는 경우 사용이 적합하다.
- L[894–896](../../upstream/krds/raw/components/component_12_04.html:894): 사용자가 최소한의 선택으로 목표 값을 선택할 수 있는 경우
- L[900–900](../../upstream/krds/raw/components/component_12_04.html:900): 사용하기 적합하지 않은 경우
- L[905–905](../../upstream/krds/raw/components/component_12_04.html:905): ‘나이’와 같이 사용자가 선택할 수 있는 값의 범위가 넓고 다양한 경우 사용하기 적합하지 않다.
- L[902–907](../../upstream/krds/raw/components/component_12_04.html:902): 사용자가 선택할 수 있는 값이 다양한 경우 ‘나이’와 같이 사용자가 선택할 수 있는 값의 범위가 넓고 다양한 경우 사용하기 적합하지 않다.

### 사용성 가이드라인

- L[915–915](../../upstream/krds/raw/components/component_12_04.html:915): 사용성 가이드라인
- L[918–918](../../upstream/krds/raw/components/component_12_04.html:918): 모든 수량 토글에 레이블을 제공한다.
- L[919–921](../../upstream/krds/raw/components/component_12_04.html:919): 수량 토글에 레이블이 제공되지 않으면 사용자는 어떤 수량 값을 선택해야 하는지 알 수 없다. 레이블을 생략하고자 하는 경우에는 레이블이 없어도 사용자가 값을 선택하는데 문제가 없다는 근거가 명확해야 한다.
- L[925–925](../../upstream/krds/raw/components/component_12_04.html:925): 키보드 입력 없이 수량 값 선택을 위해 사용한다.
- L[926–928](../../upstream/krds/raw/components/component_12_04.html:926): 키보드를 사용하여 수량 값 입력 시 발생할 수 있는 오류를 최소화 하고, 기본값의 최소한의 조정을 목표 값을 지적하는데 적합합니다.
- L[932–932](../../upstream/krds/raw/components/component_12_04.html:932): 수량 필드에 현재 값을 항상 표시하여 사용한다.
- L[933–935](../../upstream/krds/raw/components/component_12_04.html:933): 사용자가 증가, 감소 버튼을 클릭할 때 값이 얼마나 증가하거나 감소 하는지 알 수 있도록 수량 필드에 현재 값을 항상 표시하여 제공해야 합니다. 수량필드의 기본 값은 사용자가 가장 자주 선택하는 값으로 제공하는 것 적합합니다.
- L[939–939](../../upstream/krds/raw/components/component_12_04.html:939): 선택 수량의 범위를 제한해야 한다.
- L[940–942](../../upstream/krds/raw/components/component_12_04.html:940): 선택 수량에 제한을 설정할 때 버튼 상태를 비활성화로 변경하여 즉시 피드백을 제공해야 하며, 선택 수량은 기준 값을 포함하여 총 11단계 이내 범위를 제한하여 구현한다. 너무 많은 선택 값을 제공해야 하는 경우 수량 토글 보다는 텍스트 입력 필드를 적용하는 것이 적합합니다.
- L[954–954](../../upstream/krds/raw/components/component_12_04.html:954): 수량 조정 버튼의 크기를 너무 작게 표시하지 않는다.
- L[955–956](../../upstream/krds/raw/components/component_12_04.html:955): 수량 값을 조정하는 증가, 감소 버튼을 모아서 배치하거나, 너무 작게 제공하는 경우 사용자는 속도를 늦추고 신중하게 움직여 잘못 클릭하는 경우를 발생할 수 있다. 수량 조정 버튼은 항상 입력 필드를 가운데 두고 분리하여 배치하는 것이 적합하다.

보존된 인라인 예시 마크업(참고용이며 공개 네이티브 API 아님): 이 상세에는 인라인 샘플 뷰 마크업이 없습니다.

CSS/JS/가이드 이미지에 대한 출처 참조는 복사된 구현이 아닙니다. 표 행의 원본 HTML(필수/선택 열 보존)은 [source-evidence.json](../../catalog/source-evidence.json)에 보관합니다. 위의 평탄화 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 기록된 독립 결정: 경계 버튼은 `aria-disabled=true`, 막힌 활성화, 분명한 비색상 사용 불가 단서, 유지되는 초점을 씁니다. 컨트롤 전체 비활성은 네이티브 disabled 컨트롤을 쓰고 폼 값을 생략합니다. 독립 경계 초점 정책은 공식 사용 불가 동작 결과를 면제하지 않습니다.
- 상세에는 가이드 이미지 참조가 5개 있으나, 포함된 픽셀 다이어그램은 시각 검사하지 않았습니다. 텍스트 구조와 지침만 읽었습니다. 정확한 시각 수치와 자산은 이후 시각/출처 검토가 필요합니다.
- 의미 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 자체 구현, 동작/스토리 소스, 독립 인수가 여전히 필요합니다.

## 수용된 독립 결정 {#accepted-independent-resolution}

경계 버튼은 `aria-disabled=true`, 막힌 활성화, 분명한 비색상 사용 불가 단서, 유지되는 초점을 씁니다. 컨트롤 전체 비활성은 네이티브 disabled 컨트롤을 쓰고 폼 값을 생략합니다. 독립 경계 초점 정책은 공식 사용 불가 동작 결과를 면제하지 않습니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `QuantityToggleContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트가 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크의 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 의무입니다.

공식 인용·파생 텍스트는 원래의 KRDS 권리와 출처 표기를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 출처 식별은 그대로입니다. 남은 근거 한계는 검사하지 못한 가이드 픽셀, 연결 코드, 자산 승인에 관한 것이며, 여기 인용한 실질 요구사항을 면제하지 않습니다.
