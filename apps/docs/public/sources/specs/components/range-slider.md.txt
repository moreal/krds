# 범위슬라이드 {#range-slider}

**계약 상태: 네이티브 구현용으로 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐이며, 네이티브 동작, 시각/자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `range-slider`, 한국어 이름 범위슬라이드, export `RangeSlider`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_12_01](https://www.krds.go.kr/html/site/component/component_12_01.html), 보존된 [HTML](../../upstream/krds/raw/components/component_12_01.html). 조회 시각 `2026-10-29T23:28:05.892Z`, `58988` 바이트, SHA-256 `49cf06a81cbea5a27c4dced0676a69d073d43ae0c2fc2908331e5d296699551f`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조해 확인했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 별개입니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류 `component`, 수용된 프로젝트 완료 종류 `component`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 케이스(변형·상태 축): `single-value`, `disabled`, `discrete`. 이는 네이티브 케이스 이름이며, 상태·반응형·외형 축이 곧 공식 명명 변형은 아닙니다. 공식 유형/예시 헤딩은 근거 부록에 그대로 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

상시 레이블, 슬라이더 트랙/핸들, 핸들 위나 트랙 끝에 현재 값(손가락 아래가 아님), 보이는 최솟값/최댓값으로 구성합니다. 공식 상세는 범위 안의 선택 값 하나를 보여 주며, 두 핸들 구간 선택의 증거는 아닙니다. 권장 step은 범위의 약 10–20%입니다.

## 의미 API {#plain-semantic-api}

독립 API: `min=0`, `max=100`, `step=10`, `value`/`defaultValue=0`, `onValueChange({value:number})`, `name`, `label`, `disabled=false`, `valueText?` 포매터. **이 계약에는 `onValueCommit` API가 없습니다.** 네이티브 `input[type=range]`를 선호하며, output은 커밋된 값을 단위와 함께 반영합니다. 잘못된 경계/step은 거부하고 소수 연산은 오차 없이 정규화합니다. 정의된 값, 한 번만 읽는 기본값, 모드 전환 금지, 마운트/prop/리셋 콜백 없음 규칙은 [파일럿 규약](./README.md)을 따릅니다. 제어 모드의 네이티브 입력 변경은 요청이며, 거부되면 표시/output/제출 값은 커밋된 prop으로 남습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

핸들 드래그와 트랙 클릭을 공식 지원합니다. 독립 네이티브 키보드 정책: 화살표는 한 step씩 바꾸고, Home/End는 한계에 닿으며, Tab/초점과 숫자 네이티브 값 의미는 일반 그대로입니다. 두 핸들 role은 만들어 내지 않습니다. 정규화한 요청 숫자가 커밋된 값과 다른 네이티브 사용자 input 이벤트마다 `onValueChange`를 한 번 내보냅니다. 비제어 입력은 콜백 전에 그 숫자를 커밋하고, 제어 입력은 요청을 한 번 내보낸 뒤 거부되면 네이티브 값/output을 prop으로 되돌립니다.

드래그는 변경된 input 이벤트마다 하나씩, 서로 다른 입력 요청을 여러 개 낼 수 있습니다. 변경된 입력 하나를 만드는 트랙 클릭은 요청 하나를, 변경된 키보드 조정은 각각 요청 하나를 냅니다. 같은 값/경계 입력은 아무것도 내지 않습니다. 네이티브 change, pointerup, blur, 제스처 완료는 **두 번째 콜백이나 commit 콜백을 추가하지 않습니다.** 포인터 취소는 마지막으로 커밋된 값을 보존하며 합성 롤백/commit 요청을 내지 않습니다. input/change 이중 알림이 없습니다. 터치 중 세로 페이지 스크롤과 실제 네이티브 폼 수명주기를 보존합니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

현재 값은 위쪽/끝에 있고 손가락에 가려지지 않으며, 최솟값/최댓값은 좁은 화면과 확대에서 읽을 수 있습니다. 핸들은 충분히 크고, 드래그 없이 쓸 수 있는 키보드/클릭 대안이 있습니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

이름 있는 활성 네이티브 range는 값을 전달하고, 비활성은 제외되며, 리셋은 기본값과 output을 복원합니다. 제어 리셋은 콜백 없이 현재 prop을 유지합니다. IME 편집은 없고, 내장된 편집 가능한 값 대안은 이 초안의 범위 밖입니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

단위와 설정 효과는 호스트가 맡습니다. 장식용 트랙이 아니라 경계가 있는 실제 네이티브 range, output, 폼 수명주기가 완료 조건입니다. 외부 엔진은 필요 없습니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, label, control, track, range, thumb, output, minimum, maximum; disabled,dragging.

렌더링되는 모든 소유 파트는 `data-krds-component="range-slider"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 사용합니다. 네이티브/ARIA 상태가 기준입니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 포인터 드래그/트랙 클릭과 화살표가 경계 안의 값 하나를 갱신합니다.
2. Home/End가 경계에 닿습니다.
3. 보이는 output과 접근 가능한 값 텍스트가 단위와 일치합니다.
4. 리셋/FormData/비활성이 올바릅니다.
5. 터치가 일반 세로 스크롤을 막지 않습니다.
6. 소수 step이 오차를 만들지 않습니다.
7. 드래그 입력, 값이 바뀐 트랙 클릭 하나, 값이 바뀐 키보드 조정은 각각 변경된 입력마다 요청 하나를 내며, change/릴리스/blur/완료에서 추가 콜백이 없습니다.
8. 같은 값의 경계 동작, 포인터 취소, props, 마운트, 리셋은 합성 값/commit 콜백을 내지 않습니다.
9. 제어 모드에서 거부된 range 입력은 네이티브 값, 보이는 output, FormData를 커밋된 prop으로 되돌립니다.

이는 앞으로 필요한 테스트이며, 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 단서, 움직임이 있는 곳의 동작 줄이기를 확인합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`range-slider--single-value`, `range-slider--discrete`, `range-slider--disabled`, `range-slider--form-reset`, `range-slider--narrow-touch`, `range-slider--input-notification-counts`, `range-slider--controlled-rejected`, `range-slider--pointer-cancel`.

각 케이스는 해당되는 모든 네이티브 렌더러(Solid 1, React, Svelte, Vue, Lit, Qwik, Angular)에서 로컬 args/입력/슬롯과 관찰 가능한 순수 로컬 상태를 갖춰야 합니다. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 따로 준비하며, 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 인수되어야 합니다. 동작 스위트는 스토리 파일과 분리하며, 지원되는 upstream siheom 어댑터만 사용합니다. Lit/Solid 2는 siheom 지원을 만들어 내지 않고 선택한 네이티브 테스트 경로를 씁니다. Qwik은 첫 lazy 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 partial APF 소비를 테스트해야 합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증해야 합니다. Solid 2는 Solid 1 컴파일러/렌더러를 가져오지 않습니다. 다른 렌더러의 래퍼는 금지합니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 보존된 상세 HTML 원본에서 뽑았으며, 실질 지침과 상호작용/마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 원문 언어를 유지합니다. “고려/권장/가능” 같은 표현은 권고로 남습니다. 예시나 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원본 JS 함수 표는 참고 근거일 뿐이며, 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행하면 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립적 선택입니다.

### 구조

- L[864–864](../../upstream/krds/raw/components/component_12_01.html:864): 구조
- L[870–870](../../upstream/krds/raw/components/component_12_01.html:870): 1. 레이블 사용자가 어떤 값을 선택해야 하는지를 안내하는 문구
- L[871–872](../../upstream/krds/raw/components/component_12_01.html:871): 2. 슬라이더(Slider) 핸들의 이동 경로를 보여주는 영역
- L[873–874](../../upstream/krds/raw/components/component_12_01.html:873): 3. 핸들(Handle) 정해진 범위 내 값을 선택하는 선택자로, 슬라이더를 따라 좌/우로 이동함
- L[875–875](../../upstream/krds/raw/components/component_12_01.html:875): 4. 선택 값 현재 선택된 값을 표시하는 텍스트
- L[876–876](../../upstream/krds/raw/components/component_12_01.html:876): 5. 범위 값 슬라이더의 최소 값과 최대 값

### 용례

- L[884–884](../../upstream/krds/raw/components/component_12_01.html:884): 용례
- L[886–886](../../upstream/krds/raw/components/component_12_01.html:886): 사용하기 적합한 경우
- L[891–893](../../upstream/krds/raw/components/component_12_01.html:891): 선택하여야 하는 값이 특정 범위 내에서 선택해야 한다고 알려주는 것이 더 중요한 경우
- L[888–895](../../upstream/krds/raw/components/component_12_01.html:888): 범위가 정확도 보다 더 중요한 경우 선택하여야 하는 값이 특정 범위 내에서 선택해야 한다고 알려주는 것이 더 중요한 경우
- L[899–899](../../upstream/krds/raw/components/component_12_01.html:899): 볼륨이나 해상도 밝기 설정 처럼 정확한 특정 값 보다 상대적 값 지정에 중점을 둔 경우
- L[896–901](../../upstream/krds/raw/components/component_12_01.html:896): 상대적인 값이 정확한 값보다 더 중요한 경우 볼륨이나 해상도 밝기 설정 처럼 정확한 특정 값 보다 상대적 값 지정에 중점을 둔 경우
- L[905–905](../../upstream/krds/raw/components/component_12_01.html:905): 볼륨 설정, 해상도 설정, 선호도 조사, 모드 설정, 글자크기설정, 숫자지정 등
- L[902–907](../../upstream/krds/raw/components/component_12_01.html:902): 적합한 예) 볼륨 설정, 해상도 설정, 선호도 조사, 모드 설정, 글자크기설정, 숫자지정 등
- L[911–911](../../upstream/krds/raw/components/component_12_01.html:911): 사용하기 적합하지 않은 경우
- L[916–916](../../upstream/krds/raw/components/component_12_01.html:916): 사용자가 특정한 수치나 단위를 입력해야 하는 경우
- L[913–918](../../upstream/krds/raw/components/component_12_01.html:913): 정확한 값이 중요한 경우 사용자가 특정한 수치나 단위를 입력해야 하는 경우
- L[922–922](../../upstream/krds/raw/components/component_12_01.html:922): 세밀한 조정보다는 ‘ON/OFF’, “낮음/보통/높음’처럼 명확한 단일 선택이 효율적인 경우
- L[919–924](../../upstream/krds/raw/components/component_12_01.html:919): 사용자가 세밀한 조정보다는 빠른 성택을 원할 경우 세밀한 조정보다는 ‘ON/OFF’, “낮음/보통/높음’처럼 명확한 단일 선택이 효율적인 경우

### 사용성 가이드라인

- L[932–932](../../upstream/krds/raw/components/component_12_01.html:932): 사용성 가이드라인
- L[935–935](../../upstream/krds/raw/components/component_12_01.html:935): 모든 범위 슬라이더에 레이블 제공한다.
- L[936–938](../../upstream/krds/raw/components/component_12_01.html:936): 범위 슬라이더에 레이블이 제공되지 않으면 사용자는 어떤 값을 선택해야 하는지 알 수 없다. 레이블을 생략하고자 하는 경우에는 레이블이 없어도 사용자가 값을 선택하는 데 문제가 없다는 근거가 명확해야 한다,
- L[941–941](../../upstream/krds/raw/components/component_12_01.html:941): 사용자의 선택 값은 항상 인지할 수 있는 곳에 표기 한다.
- L[942–943](../../upstream/krds/raw/components/component_12_01.html:942): 사용자가 핸들을 이용하여 선택한 선택 값은 핸들의 위 또는 슬라이더의 끝에 배치하여 항상 사용자가 인지할 수 있게 표기하여야 한다. 플랫폼의 특성상 손가락을 이용하여 값을 선택하기 때문에 선택 값을 하단에 배치하여서는 안 된다.
- L[956–956](../../upstream/krds/raw/components/component_12_01.html:956): 핸들을 드래그할 수 있어야 한다.
- L[957–958](../../upstream/krds/raw/components/component_12_01.html:957): 사용자가 슬라이더 위의 핸들을 드래그하거나, 슬라이더 자체의 특정 위치를 선택하여 값을 변경할 수 있어야 한다.
- L[962–962](../../upstream/krds/raw/components/component_12_01.html:962): 범위 정보를 표시하여야 한다.
- L[963–964](../../upstream/krds/raw/components/component_12_01.html:963): 사용자에게 슬라이더 선택 값의 최소값과 최대값에 대한 정보를 제공하여야 한다
- L[968–968](../../upstream/krds/raw/components/component_12_01.html:968): 선택 값을 너무 세밀하게 설정하지 않는다.
- L[969–970](../../upstream/krds/raw/components/component_12_01.html:969): 범위 슬라이더에서는 상대적인 값이 구체적인 값보다 중요하므로 단계 속성을 너무 세밀하게 설정하지 않는다. 단계 값이너무 세밀한 경우, 사용자에게 인지적 부담을 줄 수 있으며 단계는 전체 범위의 10%~20%로 설정하는 것이 적정하다.

보존된 인라인 예시 마크업(참고용이며 공개 네이티브 API 아님): 이 상세에는 인라인 샘플 뷰 마크업이 없습니다.

CSS/JS/가이드 이미지에 대한 출처 참조는 복사된 구현이 아닙니다. 표 행의 원본 HTML(필수/선택 열 보존)은 [source-evidence.json](../../catalog/source-evidence.json)에 보관합니다. 위의 평탄화 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 이전에 명세되지 않았던 commit 이벤트는 제거되었습니다. input만 쓰는 변경 시점과 취소 정책은 독립 설계입니다. 고정된 모바일 지침도 두 핸들 구간, 정확한 키보드/페이지 step, 터치 기하 규칙을 정하지 않습니다.
- 상세에는 가이드 이미지 참조가 5개 있으나, 포함된 픽셀 다이어그램은 시각 검사하지 않았습니다. 텍스트 구조와 지침만 읽었습니다. 정확한 시각 수치와 자산은 이후 시각/출처 검토가 필요합니다.
- 의미 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 자체 구현, 동작/스토리 소스, 독립 인수가 여전히 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `RangeSliderContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트가 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크의 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 의무입니다.

공식 인용·파생 텍스트는 원래의 KRDS 권리와 출처 표기를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 출처 식별은 그대로입니다. 남은 근거 한계는 검사하지 못한 가이드 픽셀, 연결 코드, 자산 승인에 관한 것이며, 여기 인용한 실질 요구사항을 면제하지 않습니다.
