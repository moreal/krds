# 구조화 목록 {#structured-list}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐입니다. 네이티브 동작, 시각·자산 검토, 실행된 커버리지는 별도 관문으로 남습니다. 게시는 승인되지 않았습니다.

시맨틱 ID `structured-list`, 한국어 이름 구조화 목록, export `StructuredList`. 고정된 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세 페이지: [component_04_01](https://www.krds.go.kr/html/site/component/component_04_01.html), 보존본 [HTML](../../upstream/krds/raw/components/component_04_01.html). 조회 시각 `2026-10-29T23:28:03.275Z`, `97910` 바이트, SHA-256 `89be72c79361c1b25695e66a8430156a54365035ce769d4d7c67476a1204cca5`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정된 출처 종류는 `composition`이고, 수용된 프로젝트 완료 종류도 `composition`입니다. 조합(composition)을 유지합니다. 완료에는 카드 껍데기만이 아니라 실제 툴바·항목·내비게이션 상호작용과 하위 컴포넌트가 포함됩니다.

지원하는 네이티브 사례(변형·상태 축): `list`, `table`. 이는 네이티브 사례 이름입니다. 상태·반응형·외형 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형·예시 헤딩 원문은 근거 부록에 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

선택적 섹션 제목, 일관된 검색·필터·정렬·동작 툴바, 항목 목록·표, 선택적 Pagination으로 구성합니다. 각 항목은 메타데이터 분류·순서, 미리보기, 콘텐츠·CTA, 뒤따르는 공유·저장 동작을 보존합니다. 출처는 마크업에서 공유·저장이 콘텐츠 뒤에 오도록 요구합니다. 분류 값이 없으면 대시를 표시합니다.

## 의미 API {#plain-semantic-api}

독립 API: items {id,title,href?,metadata:{label,value}[],image?,tags?}[], variant=list|table, 툴바 의미 컨트롤, 선택적 selection {ids,onChange}, 선택적 sort {key,direction,onChange}. 항목의 링크·동작 계약을 명시적으로 제공합니다. 카드 전체가 버튼 안에 버튼을 담는 중첩 버튼이 되어서는 안 됩니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어/기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 의미 변경 요청 하나를 냅니다. 비활성, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 0회 냅니다. 제어 거부 시 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고, 제어 props가 계속 우선합니다. 추가 필드는 렌더러·머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

모든 동작은 키보드·터치, 보이는 초점, 네이티브 링크·버튼으로 작동합니다. 정렬·검색 활성화는 활성화한 UI에 초점을 유지합니다. 선택은 레이블이 있는 체크박스를 씁니다. 새 창·애플리케이션을 여는 동작은 결과를 설명합니다. 호스트가 구성한 동작만 제공합니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

쌓을 때 메타데이터 순서를 유지하고, 툴바 순서도 일관되게 둡니다. 표 변형은 넘침·리플로 상황에서도 표 의미와 헤더 관계를 보존합니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

하위 검색·선택 필드는 네이티브 폼·리셋·IME 계약을 유지합니다. 직렬화되는 집계 “list” 필드를 만들어 내지 않습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

완료하려면 로컬 데이터 조합에서 툴바, 선택, CTA, 공유·저장, Badge/Tag, 선택적 Pagination이 작동해야 합니다. 자식을 담은 div만으로는 부족합니다. 필터링 알고리즘·데이터, 공유 대상, 저장 영속성은 호스트가 소유합니다. 스토리는 순수 로컬 상태를 씁니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, header, toolbar, list, item, preview, content, metadata, cta, badges, tags, actions, pagination; selected,pending,empty.

렌더링되는 모든 소유 파트는 `data-krds-component="structured-list"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 기준입니다. 위 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 공유·저장은 DOM에서 읽을 수 있는 항목 콘텐츠 뒤에 옵니다.
2. 정렬은 초점을 보존하고 로컬 순서를 눈에 띄게 바꿉니다.
3. 메타데이터가 없어도 분류 위치를 대시로 유지합니다.
4. 선택 가능한 행은 항목별 이름을 노출합니다.
5. 목록·표 변형은 올바른 계층과 독립적인 CTA·동작을 유지합니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 단서, 움직임이 있다면 동작 줄이기를 검증합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`structured-list--list`, `structured-list--table`, `structured-list--local-filter-sort`, `structured-list--selection-actions`, `structured-list--missing-metadata`, `structured-list--empty`, `structured-list--narrow`.

각 사례는 해당하는 모든 네이티브 렌더러에서 로컬 args/입력/슬롯과 관찰 가능한 순수 로컬 상태가 필요합니다: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에서 따로 단계화하며, 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부를 인수해야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 씁니다. Lit과 Solid 2는 siheom 지원을 만들어 내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular의 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러·렌더러를 절대 import하지 않습니다. 다른 렌더러 래퍼는 없습니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 보존된 상세 HTML에서 가져왔으며 핵심 지침과 상호작용·마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 원문 언어를 유지합니다. “고려한다/권장/할 수 있다” 같은 표현은 권고로 남습니다. 예시·CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원본 JS 함수 표는 참고 근거일 뿐이며, 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행해서는 안 됩니다. 위의 공통 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립 선택입니다.

### 구조

- L[886–886](../../upstream/krds/raw/components/component_04_01.html:886): 구조
- L[889–889](../../upstream/krds/raw/components/component_04_01.html:889): 리스트형
- L[894–897](../../upstream/krds/raw/components/component_04_01.html:894): 1. 제목(선택) 구조화 목록에서 제공하는 정보의 카테고리로, 필요한 경우 부가적인 설명을 제공할 수 있음
- L[903–903](../../upstream/krds/raw/components/component_04_01.html:903): 검색
- L[904–904](../../upstream/krds/raw/components/component_04_01.html:904): 필터
- L[905–905](../../upstream/krds/raw/components/component_04_01.html:905): 정렬
- L[906–906](../../upstream/krds/raw/components/component_04_01.html:906): 더보기 링크
- L[907–907](../../upstream/krds/raw/components/component_04_01.html:907): 액션 버튼
- L[898–910](../../upstream/krds/raw/components/component_04_01.html:898): 2. 도구 막대(선택) 목록 내 일부 또는 전체 항목에 대해 실행할 여러 가지 기능을 제공하는 영역으로 대개 구조화 목록의 상단에 배치함 검색 필터 정렬 더보기 링크 액션 버튼
- L[916–916](../../upstream/krds/raw/components/component_04_01.html:916): 항목 선택 체크박스
- L[917–917](../../upstream/krds/raw/components/component_04_01.html:917): 미리보기 이미지
- L[918–918](../../upstream/krds/raw/components/component_04_01.html:918): 콘텐츠
- L[919–919](../../upstream/krds/raw/components/component_04_01.html:919): CTA
- L[920–920](../../upstream/krds/raw/components/component_04_01.html:920): 액션 버튼
- L[921–921](../../upstream/krds/raw/components/component_04_01.html:921): 항목 구분자
- L[911–924](../../upstream/krds/raw/components/component_04_01.html:911): 3. 항목 정보를 식별하기 위한 콘텐츠 집합으로 개별 항목에 대해 실행할 기능 관련 버튼, 상세 정보를 확인할 수 있는 탐색 링크가 포함될 수 있음 항목 선택 체크박스 미리보기 이미지 콘텐츠 CTA 액션 버튼 항목 구분자
- L[930–930](../../upstream/krds/raw/components/component_04_01.html:930): 인디케이터
- L[931–931](../../upstream/krds/raw/components/component_04_01.html:931): 페이징
- L[932–932](../../upstream/krds/raw/components/component_04_01.html:932): 이동 버튼
- L[925–935](../../upstream/krds/raw/components/component_04_01.html:925): 4. 페이지네이션(선택) 구조화 목록을 탐색하기 위한 기능 버튼 및 관련 정보를 제공하는 영역으로 대개 구조화 목록 하단에 배치함 인디케이터 페이징 이동 버튼
- L[940–940](../../upstream/krds/raw/components/component_04_01.html:940): 표형
- L[945–947](../../upstream/krds/raw/components/component_04_01.html:945): 1. 제목
- L[948–950](../../upstream/krds/raw/components/component_04_01.html:948): 2. 도구막대 (검색, 필터, 정렬, 더보기 링크, 액션버튼)
- L[951–953](../../upstream/krds/raw/components/component_04_01.html:951): 3. 항목 (항목선택 체크박스, 콘텐츠, CTA, 액션버튼, 항목구분자
- L[954–956](../../upstream/krds/raw/components/component_04_01.html:954): 4. 페이지네이션(선택)

### 사용성 가이드라인

- L[965–965](../../upstream/krds/raw/components/component_04_01.html:965): 사용성 가이드라인
- L[968–968](../../upstream/krds/raw/components/component_04_01.html:968): 도구 막대를 구성하는 사용자 인터페이스는 모든 화면에서 일관된 위치에 동일한 순서로 배치한다.
- L[969–969](../../upstream/krds/raw/components/component_04_01.html:969): 구조화 목록의 유형이나 콘텐츠 특성에 따라 툴바에서 제공되는 상세 사용자 인터페이스의 구성은 달라질 수 있다. 그러나 이 경우에도 유사한 기능을 가진 요소를 일관된 위치에 배치하여 사용자가 별도의 학습 없이 기능을 사용할 수 있도록 해야 한다.
- L[972–972](../../upstream/krds/raw/components/component_04_01.html:972): 콜투액션(Call to Action)은 항목과 관련된 가장 중요한 행동을 유도하기 위해 사용한다.
- L[973–973](../../upstream/krds/raw/components/component_04_01.html:973): 구조화 목록에서 전달하고자 하는 정보의 특성 및 사용자의 방문 목적을 고려하여 가장 중요한 행동을 콜투액션 버튼(최상위 수준의 강조 버튼)으로 표현해야 한다.
- L[976–976](../../upstream/krds/raw/components/component_04_01.html:976): 사용자가 필요로 하는 기능과 행동 버튼을 제공한다
- L[977–977](../../upstream/krds/raw/components/component_04_01.html:977): 구조화 목록에는 사용자가 필요로 하거나 가장 빈번하게 사용하는 기능과 관련된 다양한 행동 버튼을 제공함으로써 상세 페이지로 이동하거나 상세 정보 영역을 확장하지 않더라도 빠르게 목적을 달성할 수 있도록 도와준다.
- L[980–980](../../upstream/krds/raw/components/component_04_01.html:980): 항목의 콘텐츠에는 모든 정보를 일관된 분류 체계와 순서로 제공한다.
- L[981–982](../../upstream/krds/raw/components/component_04_01.html:981): 항목을 구성하는 모든 정보를 일관된 분류 체계와 순서로 제공해야 한다. 만약 구조화 목록을 구성하는 항목별로 원자료의 정보 수준이 달라 정보가 비어있거나 생략되면 사용자는 혼동을 느낄 수 있으므로 해당 카테고리 정보가 제공되어야 하는 위치에 대시(-)를 플레이스홀더로 제공한다.

### 접근성 가이드라인

- L[1104–1104](../../upstream/krds/raw/components/component_04_01.html:1104): 접근성 가이드라인
- L[1107–1107](../../upstream/krds/raw/components/component_04_01.html:1107): 구조화 목록에서 제공되는 모든 기능을 키보드로 실행할 수 있도록 한다.
- L[1108–1108](../../upstream/krds/raw/components/component_04_01.html:1108): 구조화 목록에서 제공되는 모든 기능은 마우스뿐만 아니라 키보드, 터치 인터페이스로 실행할 수 있어야 한다.
- L[1115–1115](../../upstream/krds/raw/components/component_04_01.html:1115): 구조화 목록에서 제공되는 모든 기능에 키보드 초점이 명확하게 표시되도록 한다.
- L[1116–1116](../../upstream/krds/raw/components/component_04_01.html:1116): 구조화 목록에서 제공되는 모든 사용자 인터페이스(버튼, 링크)는 초점을 받은 상태가 시각적으로 명확하게 구분되어야 한다.
- L[1123–1123](../../upstream/krds/raw/components/component_04_01.html:1123): 구조화 목록에서 제공되는 모든 기능은 사용자가 예측 가능한 방식으로 작동해야 한다.
- L[1124–1125](../../upstream/krds/raw/components/component_04_01.html:1124): 만약 새로운 브라우저 창을 실행하는 링크나 외부 애플리케이션을 실행하는 버튼이 있다면 부가적인 설명을 제공하여 스크린 리더 사용자가 기능의 실행 결과를 예측할 수 있어야 한다. 구조화 목록을 정렬하거나 조회하는 기능이 있다면 해당 기능 실행 후, 키보드 초점은 정렬/조회 UI에 유지되어야 한다.

### 상호작용 가이드라인

- L[1136–1136](../../upstream/krds/raw/components/component_04_01.html:1136): 상호작용 가이드라인
- L[1138–1138](../../upstream/krds/raw/components/component_04_01.html:1138): 탐색
- L[1156–1159](../../upstream/krds/raw/components/component_04_01.html:1156): Tab, Shift + Tab 구조화 목록 내 다음 인터페이스 요소를 순차적으로 탐색한다.
- L[1166–1166](../../upstream/krds/raw/components/component_04_01.html:1166): 기능 실행 또는 이동
- L[1184–1187](../../upstream/krds/raw/components/component_04_01.html:1184): Click 구조화 목록 내 액션 버튼의 기능이 실행되거나 링크 목적지로 이동한다.
- L[1188–1191](../../upstream/krds/raw/components/component_04_01.html:1188): Enter 구조화 목록 내 액션 버튼의 기능이 실행되거나 링크 목적지로 이동한다.

### 예시

- L[1210–1210](../../upstream/krds/raw/components/component_04_01.html:1210): 예시
- L[1214–1214](../../upstream/krds/raw/components/component_04_01.html:1214): 기본
- L[1322–1322](../../upstream/krds/raw/components/component_04_01.html:1322): 기본 코드 확인하기
- L[1338–1338](../../upstream/krds/raw/components/component_04_01.html:1338): 표형
- L[1591–1591](../../upstream/krds/raw/components/component_04_01.html:1591): 표형 코드 확인하기

### 마크업 가이드

- L[1611–1611](../../upstream/krds/raw/components/component_04_01.html:1611): 마크업 가이드
- L[1614–1614](../../upstream/krds/raw/components/component_04_01.html:1614): CSS 선택자
- L[1631–1634](../../upstream/krds/raw/components/component_04_01.html:1631): 전체영역(리스트형) .krds-structured-list
- L[1635–1638](../../upstream/krds/raw/components/component_04_01.html:1635): 전체영역(표형) .krds-structured-list-table
- L[1639–1642](../../upstream/krds/raw/components/component_04_01.html:1639): 뱃지 표시 영역 .card-top
- L[1643–1646](../../upstream/krds/raw/components/component_04_01.html:1643): 내용 표시 영역 .card-body
- L[1647–1650](../../upstream/krds/raw/components/component_04_01.html:1647): 태그 표시 영역 .card-btm
- L[1651–1654](../../upstream/krds/raw/components/component_04_01.html:1651): 내용 공유/찜하기 버튼 영역 .card-btn
- L[1664–1664](../../upstream/krds/raw/components/component_04_01.html:1664): 개발 시 접근성 관련 주의 사항
- L[1666–1666](../../upstream/krds/raw/components/component_04_01.html:1666): 내용을 확인한 뒤 공유하기, 찜하기 버튼을 사용할 수 있도록 해당 버튼은 컨텐츠 뒷 순서로 마크업한다.

보존된 예시 마크업 인라인(참고용이며 공개 네이티브 API가 아님): L[1219–1316](../../upstream/krds/raw/components/component_04_01.html:1219), L[1343–1585](../../upstream/krds/raw/components/component_04_01.html:1343)

CSS/JS/안내 이미지 출처 참조는 복사된 구현이 아닙니다. 표 행의 원본 HTML(필수/선택 열 보존)은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화한 발췌가 조건부 선택자를 필수로 재분류하지는 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 추가적인 텍스트 모순은 발견되지 않았습니다. 의미 API와 기본값은 이 수용된 계약이 고정합니다. 네이티브 구현은 여전히 별도의 근거 검토 대상입니다.
- 외부 코드 예시는 참조만 하며 이번 준비에서 별도 파일로 삽입하거나 읽지 않았습니다: L1327 `../../code/structured_list.html`, L1596 `../../code/structured_list_table.html`, L1678 `./variable/structured_list.html`. 보지 못한 내용은 추정하지 않습니다.
- 상세 페이지에 안내 이미지 참조가 2개 있으며, 그 안의 픽셀 도식은 눈으로 확인하지 않았습니다. 텍스트 구조와 지침만 읽었습니다. 정확한 시각 치수와 자산은 이후 시각·출처 검토가 필요합니다.
- 의미 인터페이스와 파트·상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작·스토리 소스, 독립 인수가 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `StructuredListContract`입니다. 네이티브 프레임워크는 자체 콘텐츠·ref·이벤트 전달만 확장합니다. 공통 매니페스트가 지원 사례 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼로는 이 계약을 충족할 수 없습니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에 인용·파생된 공식 텍스트는 원래 KRDS 권리와 출처 표시를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며 여기 인용한 실질 요구사항을 면제하지 않습니다.
