# 바텀시트 {#bottom-sheet}

**계약 상태: 네이티브 구현용으로 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 승인일 뿐입니다. 네이티브 동작, 시각·자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `bottom-sheet`, 한국어 이름 바텀시트, export `BottomSheet`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_12_03](https://www.krds.go.kr/html/site/component/component_12_03.html). 보존 [HTML](../../upstream/krds/raw/components/component_12_03.html). 조회 시각 `2026-10-29T23:28:06.049Z`, `58186` 바이트, SHA-256 `6748eadb664f497d1b18e6e8a06a4faf9b96681d87eb31505fd000e398a43aa2`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 별개입니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 원천 종류 `component`, 수용된 프로젝트 완료 종류 `component`. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 케이스(변형·상태 축): `modal`, `short-content`, `select-cancel`. 이는 네이티브 케이스 이름입니다. 상태·반응형·외형 축이 곧 공식 명명 변형은 아닙니다. 공식 유형·예시 제목은 근거 부록에 그대로 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

하단 오버레이/시트에는 선택적 시각 헤더, 드래그 핸들, 본문, 분명히 알아볼 수 있는 상단 닫기 버튼이 있습니다. 닫기는 확정되지 않은 선택·동작을 취소합니다. 시트는 한 번에 하나만 둡니다. 긴 정책·작업 단계 콘텐츠는 피합니다. 원문의 핸들 설명은 슬라이더 문구를 반복한 것이며 범위 컨트롤을 구현하라는 지시가 아닙니다.

## 의미 API {#plain-semantic-api}

독립 API: open/defaultOpen=false, onOpenChange({open,reason}), 필수 접근 가능한 제목(보이는 제목 또는 aria-label), description?, content, onCancel(), initialFocusId?, returnFocusId?, dismissOnOutside=false. 첫 계약은 모달 전용입니다. 드래그로 닫기는 선택이며 동등한 닫기 동작이 있어야 합니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 정의된 value/open은 제어 모드이고 undefined는 비제어 모드입니다. 제어 prop과 기본값을 함께 주거나 모드를 바꾸면 잘못된 구성입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 시맨틱 변경 요청을 한 번 내보냅니다. 비활성, 변화 없음, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 모드에서 거부되면 커밋된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 우선합니다. 추가 필드로 렌더러·머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

독립 네이티브 정책은 검토된 Modal의 dialog 역할과 초점 진입, 트랩, 배경 격리, Escape, 여는 요소로의 복귀·언마운트 정리를 따릅니다. 닫기는 이름이 있는 type=button입니다. 포인터 핸들은 아래로 드래그하거나 탭하여 닫기를 요청할 수 있으며, 드래그가 유일한 닫기 수단이어서는 안 됩니다. 취소하면 호스트가 초안 값을 복원하며 조용히 커밋하지 않습니다.

**독립 핸들 이름과 구조 순서:** 초점을 받을 수 있는 탭하여 닫기 컨트롤로 렌더링된 핸들은 모든 렌더러에서 “시트 닫기”라는 이름의 `type=button`입니다(보이는 텍스트 없음, 막대는 공유 CSS가 그림). 탭은 이유 `close`로 닫기를 요청합니다(완료된 드래그는 `drag`를 한 번 보고하고 뒤따르는 클릭을 무시합니다). 순수 장식 핸들(드래그 전용)은 `aria-hidden`이며 텍스트가 없습니다. 렌더링 순서는 핸들, 헤더(제목, 닫기), 설명과 본문, 동작 순입니다. 이 문구는 로컬 기준이며 KRDS 공식 원문으로 귀속하지 않습니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

시트는 하단 안전 영역과 가상 키보드를 존중하고 높이가 제한되며, 스크롤되는 콘텐츠와 동작 버튼에 접근할 수 있습니다. 동작 줄이기는 슬라이드 이동을 제거합니다. 첫 계약에서는 시트를 겹쳐 쌓지 않습니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

시트 자체의 값이나 리셋은 없습니다. 자식 폼은 독립적이며 Enter는 폼 시맨틱을 따르고 조합 중인 Escape는 무시합니다. 닫기 취소가 무관한 페이지 폼을 리셋하면 안 됩니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 선택 초안과 커밋·취소를 소유합니다. 완료에는 사용할 수 있는 대화상자, 닫기·드래그 동등성, 로컬 선택·취소 흐름이 필요합니다. 하단에 놓은 div는 완료가 아닙니다.

## 고정 파트와 상태 {#stable-parts-and-states}

파트: root, backdrop, content, handle, header, title, body, actions, close. 상태: open,closed,dragging.

렌더링되는 모든 소유 파트는 `data-krds-component="bottom-sheet"`, 하나의 `data-krds-part` 토큰, 공백으로 구분된 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 우선합니다. 위 문장의 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 열면 이름 있는 대화상자에 초점이 가고 열린 동안에만 트랩한다.
2. 닫기/Escape는 초안을 취소하고 여는 요소를 복원한다.
3. 드래그에 동등한 닫기가 있다.
4. 가상 키보드·좁은 뷰포트에서도 컨트롤에 닿을 수 있다.
5. 언마운트하면 스크롤 잠금·격리가 제거된다.
6. 겹친 시트로 인한 모호함이 없다.

이 항목은 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색 이외의 상태 단서, 움직임이 있는 곳의 동작 줄이기를 확인합니다. 빈 스위트를 성공으로 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`bottom-sheet--modal`, `bottom-sheet--short-content`, `bottom-sheet--select-cancel`, `bottom-sheet--drag-close`, `bottom-sheet--narrow-keyboard`, `bottom-sheet--removed-opener`, `bottom-sheet--reduced-motion`.

각 케이스는 해당하는 모든 네이티브 렌더러에서 로컬 args/inputs/slots와 관찰 가능한 순수 로컬 상태를 가져야 합니다. 대상은 Solid 1, React, Svelte, Vue, Lit, Qwik, Angular이며 Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 단계별로 따로 있으며 현재 파일럿 러너의 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 수용되어야 합니다. 동작 스위트는 스토리 파일과 분리하며 지원되는 upstream siheom 어댑터만 씁니다. Lit과 Solid 2는 선택된 네이티브 테스트 경로를 쓰며 siheom 지원을 만들어 내지 않습니다. Qwik은 첫 lazy 이벤트를 테스트합니다. Angular의 폼 컨트롤은 CVA·리셋과 partial APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러·렌더러를 가져오면 안 됩니다. 다른 렌더러의 래퍼는 쓰지 않습니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 실제 보존된 상세 HTML에서 가져왔으며 핵심 지침과 상호작용·마크업 표를 포함합니다. 공식 요구사항을 만들어 내지 않도록 원문 언어를 유지합니다. “고려/권장/가능” 같은 표현은 권고로 남습니다. 예시와 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원문 JS 함수 표는 참고 근거일 뿐이며 원본 KRDS JS는 네이티브가 제어하는 DOM에서 실행하면 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립적 선택입니다.


### 구조

- L[864–864](../../upstream/krds/raw/components/component_12_03.html:864): 구조
- L[870–870](../../upstream/krds/raw/components/component_12_03.html:870): 1. 오버레이(Overlay) 바텀 시트와 기본 창을 시각적으로 구분하기 위한 그림자 또는 가림막
- L[871–872](../../upstream/krds/raw/components/component_12_03.html:871): 2. 헤더(선택) 바텀 시트에서 제공하는 콘텐츠나 요청하는 행동에 대한 간단한 정보를 담은 제목, 설명을 제공함
- L[873–873](../../upstream/krds/raw/components/component_12_03.html:873): 3. 핸들(Handle) 정해진 범위 내 값을 선택하는 선택자로, 슬라이더를 따라 좌/우로 이동함
- L[874–875](../../upstream/krds/raw/components/component_12_03.html:874): 4. 본문 콘텐츠 또는 컴포넌트 요소가 제공되는 영역
- L[876–879](../../upstream/krds/raw/components/component_12_03.html:876): 5. 닫기 버튼 사용자가 바텀 시트를 닫을 수 있게 하는 버튼 요소로 대게 ‘X’ 아이콘으로 표현됨. 바텀 시트에서 데이터를 선택하여 제출하거나 행동을 확정해야 하는 경우, 닫기 버튼은 바텀 시트를 닫는 동시에 취소와 동일한 기능을 제공함

### 용례

- L[887–887](../../upstream/krds/raw/components/component_12_03.html:887): 용례
- L[889–889](../../upstream/krds/raw/components/component_12_03.html:889): 사용하기 적합한 경우
- L[894–896](../../upstream/krds/raw/components/component_12_03.html:894): 바텀시트는 기존화면을 유지한 채 부가적인 정보나 세부 옵션을 제공할 수 있어, 화면전환 없이도 사용자가 현재 맥락을 잃지 않고 추가 행동을 수행할 수 있습니다.
- L[891–898](../../upstream/krds/raw/components/component_12_03.html:891): 사용자의 현재 상황을 보존하며, 추가정보 제공이 필요한 경우 바텀시트는 기존화면을 유지한 채 부가적인 정보나 세부 옵션을 제공할 수 있어, 화면전환 없이도 사용자가 현재 맥락을 잃지 않고 추가 행동을 수행할 수 있습니다.
- L[902–902](../../upstream/krds/raw/components/component_12_03.html:902): 바텀시트는 시각적으로 부각되어 표시되므로, 사용자의 시선을 자연스럽게 집중시켜 핵심 정보나 주요 선택 항목을 명확히 전달할 수 있습니다.
- L[899–904](../../upstream/krds/raw/components/component_12_03.html:899): 사용자가 집중하여 주요 정보를 인지하여야 하는 경우 바텀시트는 시각적으로 부각되어 표시되므로, 사용자의 시선을 자연스럽게 집중시켜 핵심 정보나 주요 선택 항목을 명확히 전달할 수 있습니다.
- L[908–908](../../upstream/krds/raw/components/component_12_03.html:908): 사용하기 적합하지 않은 경우
- L[913–913](../../upstream/krds/raw/components/component_12_03.html:913): 바텀 시트는 화면의 일부를 의도적으로 가리기 때문에 항상 필요한 정보나 도구를 표시하는데 적합하지 않다
- L[910–915](../../upstream/krds/raw/components/component_12_03.html:910): 사용자가 항상 필요로 하는 정보를 표시하는 경우 바텀 시트는 화면의 일부를 의도적으로 가리기 때문에 항상 필요한 정보나 도구를 표시하는데 적합하지 않다
- L[919–919](../../upstream/krds/raw/components/component_12_03.html:919): 바텀 시트는 서비스 제공 또는 정책 정보와 같이 상당 시간을 소비하는 페이지가 아닌 일시적 정보를 제공하는 UI에 적합합니다.
- L[916–921](../../upstream/krds/raw/components/component_12_03.html:916): 서비스 이용에 따른 사용자 여정의 한 스텝으로 사용하는 경우 바텀 시트는 서비스 제공 또는 정책 정보와 같이 상당 시간을 소비하는 페이지가 아닌 일시적 정보를 제공하는 UI에 적합합니다.

### 사용성 가이드라인

- L[929–929](../../upstream/krds/raw/components/component_12_03.html:929): 사용성 가이드라인
- L[932–932](../../upstream/krds/raw/components/component_12_03.html:932): 닫기 버튼을 포함하여 구현하여야 한다.
- L[933–935](../../upstream/krds/raw/components/component_12_03.html:933): 바텀 시트는 상단 핸들을 아래로 스와이프 하거나 탭 하여 닫을 수 있지만, 이 기능을 모든 사용자가 알지 못 한다. 사용자가 바텀 시트를 안정적으로 닫을 수 있도록 화면에서 인지하기 쉬운 바텀 시트 상단에 ‘닫기’ 또는 ‘X’ 버튼을 포함하여 구성하는 것이 좋다.
- L[947–947](../../upstream/krds/raw/components/component_12_03.html:947): 다중으로 바텀 시트를 사용하지 않아야 한다.
- L[948–950](../../upstream/krds/raw/components/component_12_03.html:948): 여러 개의 바텀 시트를 서로 위로 쌓을 경우, 사용자는 현재 자신이 위치한 단계에 혼란을 줄 수 있어 하나의 바텀시트만 사용하는 것이 바람직하다. 부득이하게 여러 개의 바텀 시트를 사용할 수 밖에 없는 경우, 현 단계를 사용자에게 명확하게 전달하여야 하며, 시트를 닫을 때 현재의 시트만 닫을지, 전체 시트를 닫을지를 구분하여 사용자에게 제공해야 한다.
- L[954–954](../../upstream/krds/raw/components/component_12_03.html:954): 짧은 상호작용에만 바텀 시트를 사용한다.
- L[955–956](../../upstream/krds/raw/components/component_12_03.html:955): 바텀 시트는 일시적인 UI 요소로 빠른 상호작용을 지원하기 위해 사용하는 것이 바람직하다. 사용자가 바텀 시트에 표시된 정보를 검토하는데 상당한 시간을 소비해야 하는 경우 바텀 시트를 사용하지 않는 것이 좋다.

보존된 인라인 예시 마크업(참고용, 공개 네이티브 API 아님): 이 상세 페이지에는 인라인 예시 마크업이 없습니다.

원문의 CSS/JS/가이드 이미지 참조는 복사된 구현이 아닙니다. 필수/선택 열을 보존한 표 행의 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화된 발췌는 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 공식 모바일 상세에는 모달 ARIA·초점·키보드 절이 없으므로 모달 전용 초점 정책은 독립적입니다. L873의 슬라이더 같은 핸들 문구는 오류로 보이며 범위 입력으로 추정하지 않습니다.
- 상세 페이지에 가이드 이미지 참조가 3개 있으며, 그 안의 픽셀 도식은 시각적으로 검사하지 않았습니다. 텍스트 구조와 지침은 읽었습니다. 정확한 시각 치수·자산은 이후 시각·출처 검토가 필요합니다.
- 시맨틱 인터페이스와 파트·상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 자체 구현, 동작·스토리 소스, 독립 인수가 여전히 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 시맨틱 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `BottomSheetContract`입니다. 네이티브 프레임워크는 자체 콘텐츠·ref·이벤트 전달만 확장합니다. 공유 매니페스트는 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에서 인용·파생한 공식 텍스트는 원래의 KRDS 권리와 출처 표기를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 원천 식별 정보는 바뀌지 않습니다. 열린 근거 한계는 검사하지 않은 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며 여기 인용된 실질 요구사항을 면제하지 않습니다.
