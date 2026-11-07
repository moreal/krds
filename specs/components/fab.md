# 플로팅 버튼 {#fab}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 수락일 뿐이며, 네이티브 동작·시각/자산 검토·실행된 커버리지는 별도 게이트입니다. 어떤 게시도 승인되지 않았습니다.

시맨틱 ID `fab`, 한국어 이름 플로팅 버튼, export `FAB`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_05_03](https://www.krds.go.kr/html/site/component/component_05_03.html), 보존된 [HTML](../../upstream/krds/raw/components/component_05_03.html). 조회 시각 `2026-10-29T23:28:04.322Z`, `57722` 바이트, SHA-256 `ed0e344ae805288e065b84646ec4237e68dc9fdf5c8b935744c83b8f55699863`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조해 확인했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 별개입니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류 `component`, 수용된 프로젝트 완료 종류 `component`. 프로젝트 완료 종류는 아래 근거를 따르며, 구체적인 완료 의무와 호스트 경계는 이 계약에 기술됩니다.

지원하는 네이티브 케이스(변형·상태 축): `single-icon`, `extended-label`, `expandable`. 이는 네이티브 케이스 이름이며, 상태·반응형·외관 축이 공식 명명 변형인 것은 아닙니다. 공식 유형/예시 제목 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

오른쪽 아래에 고정된 이름 있는 동작 버튼에 아이콘과 선택적 레이블이 있습니다. 확장형은 오버레이/그림자, 확장/닫기 트리거, 관련 동작 최대 3개(2수준 이하)를 더합니다. 하단 TabBar 위에 두며 중요한 콘텐츠를 가리지 않습니다.

## 의미 API {#plain-semantic-api}

독립 API: 필수 접근 가능한 label, onAction(), icon, showLabel=true, expanded/defaultExpanded=false, onExpandedChange({expanded}), 확장 모드용 actions {id,label,onAction}[]. 트리거는 type=button이며, 확장은 말단 동작 실행과 별개입니다.

`showLabel?: boolean`은 선택적으로 보이는 기본 레이블만 제어합니다. 생략하면 기존의 레이블 표시(`true`)를 유지합니다. `false`이면 아이콘 전용으로 렌더하되, 필수 `label`을 실제 버튼의 접근 가능한 이름으로 보존합니다. 장식 아이콘 콘텐츠는 이름을 대신하지 않습니다. label 파트는 눈에 보이게 렌더되지 않습니다. 관련 동작은 레이블 표시와 무관하게 확장 동작을 결정합니다. 레이블 표시를 바꿔도 동작·확장 콜백이 나오지 않고, 동작, 확장 상태, 초점도 바뀌지 않습니다. 이는 공식 동작 변형이 추가된 것이 아니라 독립적인 일반 표시 정책입니다. 단일 아이콘 로컬 스토리는 `showLabel:false`, 레이블 확장은 `true`를 줍니다. 어댑터는 스토리 ID가 아니라 실제 prop을 읽어야 합니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어/기본값을 함께 주거나 모드를 바꾸는 것은 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청 하나를 냅니다. 비활성, 무동작, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 커밋된 UI와 초점 상태를 유지합니다. 취소된 리셋은 아무 일도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하며, 제어 prop이 계속 우선합니다. 추가 필드로 렌더러/머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

독립 네이티브 정책: 모든 버튼에 이름이 있고 Enter/Space로 키보드 조작이 가능하며, 트리거는 aria-expanded/controls를 가집니다. Tab은 펼쳐진 동작을 방문합니다. Escape는 접고 트리거로 초점을 돌립니다. 닫힌 동작은 탭으로 이동할 수 없습니다. 명시적으로 모달로 조합하지 않는 한 모달 트랩은 없습니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

하단 안전 영역, TabBar 여유, 확대를 존중합니다. 제스처가 많은 페이지에서는 오버레이 가림을 피해야 합니다. 동작 줄이기는 장식용 확장 애니메이션을 끕니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼 값/리셋이 없으며 기본적으로 호스트 폼을 제출하지 않습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 실제 기본 동작을 제공하며, 컴포넌트 안에 인증/네트워크는 없습니다. 완료에는 동작하는 단일·확장 로컬 동작, 오버레이 배치, 정리가 필요합니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, trigger, icon, label, overlay, actions, action; expanded,collapsed,disabled.

렌더되는 모든 소유 파트는 `data-krds-component="fab"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위 열거는 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정됩니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 키보드 기본 활성화는 한 번 실행됩니다.
2. 확장은 이름 있는 도달 가능한 동작을 3개 이하로 노출합니다.
3. Escape는 닫고 트리거를 복원합니다.
4. 하단 TabBar와 콘텐츠가 계속 조작 가능합니다.
5. 접힌 동작은 접근할 수 없습니다.

위 항목은 앞으로 필요한 테스트이며, 실행되었거나 인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색 이외의 상태 단서, 움직임이 있는 곳의 동작 줄이기를 검증합니다. 빈 스위트를 성공으로 간주하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`fab--single-icon`, `fab--extended-label`, `fab--expandable`, `fab--tabbar-clearance`, `fab--narrow`.

각 케이스는 적용 가능한 모든 네이티브 렌더러(Solid 1, React, Svelte, Vue, Lit, Qwik, Angular)에서 로컬 args/입력/슬롯과 관찰 가능한 순수 로컬 상태를 가져야 합니다. Solid 2 미리보기는 별도로 격리됩니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 따로 마련되며, 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 수락되어야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 씁니다. Lit/Solid 2는 siheom 지원을 만들어 내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연(lazy) 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러/렌더러를 가져오면 안 됩니다. 다른 렌더러 래퍼는 금지입니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 보존된 상세 HTML 원본(본문 지침과 상호작용·마크업 표 포함)에서 추출했습니다. 공식 요구사항을 만들어 내지 않도록 원문 언어를 유지합니다. "고려한다/권장/할 수 있다" 같은 표현은 권고로 남습니다. 예시나 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원본 JS 함수 표는 참고 근거일 뿐이며, 네이티브가 제어하는 DOM에서 KRDS 원본 JS를 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립 선택입니다.

### 구조

- L[864–864](../../upstream/krds/raw/components/component_05_03.html:864): 구조
- L[870–870](../../upstream/krds/raw/components/component_05_03.html:870): 1. 아이콘 버튼 이름이 나타내는 의미/개념을 시각적으로 표상화한 요소
- L[871–872](../../upstream/krds/raw/components/component_05_03.html:871): 2. 컨테이너 아이콘 또는 아이콘과 레이블을 담고 있는 영역
- L[873–873](../../upstream/krds/raw/components/component_05_03.html:873): 3. 레이블 버튼 이름을 보여주는 텍스트
- L[874–874](../../upstream/krds/raw/components/component_05_03.html:874): 4. 오버레이(Overlay) 플로팅 액션 버튼과 기본 창을 시각적으로 구분하기 위한 그림자 또는 가림막
- L[875–876](../../upstream/krds/raw/components/component_05_03.html:875): 5. 확장/닫기 버튼 확장을 ‘+’, 닫기는 ‘X’로 표현

### 용례

- L[884–884](../../upstream/krds/raw/components/component_05_03.html:884): 용례
- L[886–886](../../upstream/krds/raw/components/component_05_03.html:886): 사용하기 적합한 경우
- L[891–893](../../upstream/krds/raw/components/component_05_03.html:891): 플로팅 버튼은 화면에서 사용자가 반복적으로 수행하는 주요 단일 행동이 있는 경우, 사용자의 접근성과 사용성을 증진할 수 있다.
- L[888–895](../../upstream/krds/raw/components/component_05_03.html:888): 사용자가 자주 사용하는 단일 행동이 있는 경우 플로팅 버튼은 화면에서 사용자가 반복적으로 수행하는 주요 단일 행동이 있는 경우, 사용자의 접근성과 사용성을 증진할 수 있다.
- L[899–899](../../upstream/krds/raw/components/component_05_03.html:899): 사용하기 적합하지 않은 경우
- L[904–904](../../upstream/krds/raw/components/component_05_03.html:904): 자주 사용하는 행동이 다수인 경우에는 메뉴, 탭바 등과 같이 다른 UI요소가 더 적합하다.
- L[901–906](../../upstream/krds/raw/components/component_05_03.html:901): 사용자의 주요 행동이 다수인 경우 자주 사용하는 행동이 다수인 경우에는 메뉴, 탭바 등과 같이 다른 UI요소가 더 적합하다.
- L[910–910](../../upstream/krds/raw/components/component_05_03.html:910): 지도, 캘린더, 이미지 편집 등과 관리 제스처 조작이 많은 화면의 경우 손동작이나 콘텐츠 탐색 영역을 가려 사용성을저하할 수 있기 때문에 사용하기 적합하지 않다.
- L[907–912](../../upstream/krds/raw/components/component_05_03.html:907): 제스처(Gesture) 중심 화면인 경우 지도, 캘린더, 이미지 편집 등과 관리 제스처 조작이 많은 화면의 경우 손동작이나 콘텐츠 탐색 영역을 가려 사용성을저하할 수 있기 때문에 사용하기 적합하지 않다.

### 사용성 가이드라인

- L[920–920](../../upstream/krds/raw/components/component_05_03.html:920): 사용성 가이드라인
- L[923–923](../../upstream/krds/raw/components/component_05_03.html:923): 플로팅 버튼은 우측 하단에 배치한다.
- L[924–927](../../upstream/krds/raw/components/component_05_03.html:924): 대부분의 사용자가 오른손 엄지손가락으로 스마트 폰을 조작하기 때문에 손가락 접근성을 고려하여 우측하단에 배치하는 것이 제일 안정적이다. 콘텐츠의 흐름이 위에서 아래로 진행되기 때문에 우측 하단에 배치하는 것이 콘텐츠 가림을 최소화 할 수 있다. ‘탭바’를 사용하는 경우 탭바와 겹치지 않게 ‘탭바’ 위 우측 하단에 배치한다.
- L[931–931](../../upstream/krds/raw/components/component_05_03.html:931): 플로팅 버튼은 항상 화면의 모든 항목 위에 배치한다.
- L[932–934](../../upstream/krds/raw/components/component_05_03.html:932): 사용자가 어떤 화면에 있더라도 항상 동일한 주요 작업을 즉시 접근할 수 있도록 해야 하며, 사용자의 주의가 자연스럽게 플로팅 버튼에 집중할 수 있게 시각적 우선순위에 배치하는 것이 좋다.
- L[938–938](../../upstream/krds/raw/components/component_05_03.html:938): 너무 많은 플로팅 버튼을 구성하지 않는다.
- L[939–941](../../upstream/krds/raw/components/component_05_03.html:939): 플로팅 버튼을 2개 이상 사용해야 하는 경우 확장형 플로팅 버튼을 사용하는 것이 적합하며, 확장형 플로팅 버튼의 수량은 3개 이하로 구성하는 것이 적합하다. 너무 많은 수의 플로팅 버튼을 구성하는 경우 사용자에게 시작적 혼란과 중요 버튼의 집중도를 저하할 수 있다.
- L[953–953](../../upstream/krds/raw/components/component_05_03.html:953): 확장형 플로팅 버튼 터치의 깊이는 2수준 이하로만 사용한다.
- L[954–955](../../upstream/krds/raw/components/component_05_03.html:954): 플로팅 버튼은 사용자의 주요 작업을 신속하게 접근, 수행하도록 설계된 구성 요소로, 터치의 깊이가 2수준 이상으로 깊어지면,사용자로 하여금 사용성 저하와 인지 저하를 유발할 수 있다.

인라인으로 보존된 예시 마크업(참고용이며 공개 네이티브 API가 아님): 이 상세에는 인라인 샘플 뷰 마크업이 없습니다.

CSS/JS/가이드 이미지 원본 참조는 복사된 구현이 아닙니다. 필수/선택 열을 보존한 표 행의 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위 평탄화 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 고정된 상세는 구조와 용례만 제공하며 ARIA/키보드 계약이 없습니다. 위의 네이티브 동작은 독립 프로젝트 정책입니다.
- 상세에 가이드 이미지 참조가 3개 있으며, 내장 픽셀 도식은 시각적으로 검사하지 않았습니다. 텍스트 구조와 지침만 읽었으며, 정확한 시각 치수와 자산은 이후 시각/출처 검토가 필요합니다.
- 의미 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정됩니다. 각 네이티브 렌더러는 자체 구현, 동작/스토리 소스, 독립 인수가 여전히 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `FABContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트가 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트·조합·자산·통합에 계속 필수입니다.

이 문서의 공식 인용·파생 텍스트는 원래 KRDS 권리와 출처 표기를 유지하며, 독립 코드 MIT 부여는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며, 여기 인용한 실질 요구사항을 면제하지 않습니다.
