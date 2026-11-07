# 페이지네이션 {#pagination}

**계약 상태: 네이티브 구현용으로 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐이며, 네이티브 동작, 시각/자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `pagination`, 한국어 이름 페이지네이션, export `Pagination`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_03_06](https://www.krds.go.kr/html/site/component/component_03_06.html), 보존된 [HTML](../../upstream/krds/raw/components/component_03_06.html). 조회 시각 `2026-10-29T23:28:03.210Z`, `93930` 바이트, SHA-256 `7c61e379ce568edd893e86d5b02bc85a3aab50f4e5103c5acbae5df606006c2d`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조해 확인했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 별개입니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류 `component`, 수용된 프로젝트 완료 종류 `component`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 케이스(변형·상태 축): `number-links`, `direct-page`, `load-more`. 이는 네이티브 케이스 이름이며, 상태·반응형·외형 축이 곧 공식 명명 변형은 아닙니다. 공식 유형/예시 헤딩은 근거 부록에 그대로 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

데이터셋에 연결된 이름 있는 `<nav>`입니다. 소스 순서는 이전, 번호 링크 `<ul>`, 다음, 선택적 페이지 입력, 전체 레이블, 이동 버튼입니다. 더보기 유형을 제외하면 첫/마지막 페이지에 항상 닿을 수 있어야 합니다. 현재 번호는 `href`를 제거하고 `aria-current=true`를 가집니다. 줄임표는 비대화형입니다. 더보기는 결과 목록 뒤에 둡니다.

## 의미 API {#plain-semantic-api}

독립 API: `page`/`defaultPage=1`, `pageCount`, `hrefForPage(page)`, `onPageChange({page})`, `variant=number-links`, 선택적 직접 페이지 입력, 또는 더보기 `{shown,total,pending,onLoadMore,firstNewItemId}`. 페이지 크기를 뷰포트에서 유도하지 않습니다. 범위를 벗어난 페이지 입력은 편집 가능한 문자열로 남고, 이동 없이 오류를 알립니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/열림 상태를 정의하면 제어 모드, 없으면 비제어 모드입니다. 제어/기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청 하나를 내보냅니다. 비활성, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내보내지 않습니다. 제어 모드에서 거부되면 커밋된 UI/초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 그대로 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

네이티브 앵커가 탐색을 보존합니다. 현재/사용 불가 링크는 활성화되지 않습니다. 이동과 더보기는 버튼입니다(Enter/Space). 호스트가 결과를 덧붙인 뒤 더보기는 처음 추가된 항목으로 스크롤하고 초점을 옮기며, 표시 개수를 갱신하고, 실패 시 맥락을 보존합니다. 제어 prop만으로는 아무것도 내보내지 않습니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

번호/줄임표는 데스크톱에서 최대 11개, 좁은 화면에서 7개입니다. 좁은 화면에서는 이전/다음 줄이 시각적으로 번호 줄 앞에 오지만 공식 DOM 순서는 바뀌지 않습니다. 데이터셋의 페이지 수와 페이지당 개수는 뷰포트와 무관하게 안정적이어야 합니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

직접 페이지 입력에는 보이는 레이블과 오류 관계가 있으며, 둘러싼 폼의 암묵적 제출은 없습니다. 리셋은 페이지 입력 초안 텍스트를 실제 페이지로 복원합니다. IME 조합은 이동을 실행하지 않습니다. Pagination 자체는 폼 값을 내지 않습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

데이터 로딩, URL, 총계, 덧붙이기 성공 확인은 호스트가 맡습니다. 로컬 스토리는 고정된 메모리 내 레코드를 쓰며 fetch하지 않습니다. 원본의 더보기 설명 문단은 직접 페이지 텍스트를 반복합니다. 일치하는 동작을 지어내지 말고 더보기 구조와 상호작용에 의존합니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, list, item, link, previous, next, ellipsis, input, total, go, load-more, count; current,disabled,pending,invalid.

렌더링되는 모든 소유 파트는 `data-krds-component="pagination"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 사용합니다. 네이티브/ARIA 상태가 기준입니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 경계에서도 처음/마지막과 이전/다음이 동작합니다.
2. 현재 페이지에는 `href`가 없고 현재임을 안내합니다.
3. 직접 입력은 0과 범위 밖 값을 이동 없이 거부합니다.
4. 더보기는 성공 후에만 새로 삽입된 첫 결과에 초점을 둡니다.
5. 뷰포트가 바뀌어도 데이터셋 페이지네이션은 바뀌지 않습니다.

이는 앞으로 필요한 테스트이며, 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 단서, 움직임이 있는 곳의 동작 줄이기를 확인합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 독립 로컬 표본 정책 {#independent-local-specimen-policy}

독립 로컬 표본 이름: 번호/직접 이동은 “페이지 이동”, 더보기 탐색은 “결과 더보기”이며 결과를 덧붙이는 목적을 나타냅니다. 둘 다 이름 있는 탐색 랜드마크로 남고, 더보기 동작은 결과 목록 뒤의 실제 버튼으로 남습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`pagination--number-links`, `pagination--direct-page`, `pagination--load-more`, `pagination--first-last-boundary`, `pagination--narrow-seven-items`, `pagination--load-failure`.

각 케이스는 해당되는 모든 네이티브 렌더러(Solid 1, React, Svelte, Vue, Lit, Qwik, Angular)에서 로컬 args/입력/슬롯과 관찰 가능한 순수 로컬 상태를 갖춰야 합니다. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 따로 준비하며, 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 인수되어야 합니다. 동작 스위트는 스토리 파일과 분리하며, 지원되는 upstream siheom 어댑터만 사용합니다. Lit/Solid 2는 siheom 지원을 만들어 내지 않고 선택한 네이티브 테스트 경로를 씁니다. Qwik은 첫 lazy 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 partial APF 소비를 테스트해야 합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증해야 합니다. Solid 2는 Solid 1 컴파일러/렌더러를 가져오지 않습니다. 다른 렌더러의 래퍼는 금지합니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 보존된 상세 HTML 원본에서 뽑았으며, 실질 지침과 상호작용/마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 원문 언어를 유지합니다. “고려/권장/가능” 같은 표현은 권고로 남습니다. 예시나 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원본 JS 함수 표는 참고 근거일 뿐이며, 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행하면 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립적 선택입니다.

### 구조

- L[883–883](../../upstream/krds/raw/components/component_03_06.html:883): 구조
- L[885–885](../../upstream/krds/raw/components/component_03_06.html:885): 숫자 링크 목록
- L[890–893](../../upstream/krds/raw/components/component_03_06.html:890): 1. 이전/다음 버튼 화면 목록을 앞/뒤로 탐색하는 데 사용되는 버튼. 아이콘과 텍스트를 조합하여 제공하거나, 아이콘과 텍스트를 단독으로 사용할 수 있음
- L[894–897](../../upstream/krds/raw/components/component_03_06.html:894): 2. 숫자 링크 목록 표시된 숫자의 화면으로 이동할 수 있는 링크. 목록의 첫 번째 요소는 숫자 '1', 마지막 요소는 가장 마지막 화면의 숫자를 표시함
- L[898–901](../../upstream/krds/raw/components/component_03_06.html:898): 3. 말줄임표 번호 링크 사이에 생략된 숫자가 있음을 표시함
- L[902–905](../../upstream/krds/raw/components/component_03_06.html:902): 4. 현재 화면 식별자 사용자가 현재 탐색하고 있는 화면을 나타냄
- L[909–909](../../upstream/krds/raw/components/component_03_06.html:909): 직접 이동
- L[914–917](../../upstream/krds/raw/components/component_03_06.html:914): 1. 숫자 입력 필드 탐색하고자 하는 화면 번호를 입력할 수 있는 입력 필드. 입력 전에는 사용자가 현재 보고 있는 화면 번호를 보여줌
- L[918–921](../../upstream/krds/raw/components/component_03_06.html:918): 2. 전체 화면 수 레이블 페이지 숫자 입력 필드 오른쪽에 배치되어 전체 화면 수를 보여줌
- L[922–925](../../upstream/krds/raw/components/component_03_06.html:922): 3. 이동 버튼 실행 시 숫자 입력 필드에 입력된 숫자에 해당하는 화면으로 이동함
- L[929–929](../../upstream/krds/raw/components/component_03_06.html:929): 목록 확장
- L[934–937](../../upstream/krds/raw/components/component_03_06.html:934): 1. 더 보기 버튼 실행 시 항목을 추가적으로 표시함. '더 보기'라는 텍스트와 표시된 항목 수, 전체 항목 수를 안내하는 분수가 레이블로 제공됨

### 유형

- L[945–945](../../upstream/krds/raw/components/component_03_06.html:945): 유형
- L[949–949](../../upstream/krds/raw/components/component_03_06.html:949): 숫자 링크 목록
- L[950–950](../../upstream/krds/raw/components/component_03_06.html:950): 분할된 화면의 순서를 숫자로 표시한다. 숫자 링크를 눌러 원하는 순서의 화면 목록으로 직접 이동하거나 이전/다음 버튼을 눌러 화면을 순차적으로 탐색할 수 있다. 첫 화면과 마지막 화면 숫자 링크가 항상 표시되므로 사용자는 목록의 시작이나 끝으로 빠르게 이동할 수 있다.
- L[952–952](../../upstream/krds/raw/components/component_03_06.html:952): PC
- L[958–958](../../upstream/krds/raw/components/component_03_06.html:958): Mobile
- L[968–968](../../upstream/krds/raw/components/component_03_06.html:968): 화면 직접 이동
- L[969–969](../../upstream/krds/raw/components/component_03_06.html:969): 숫자 링크 목록과 함께 사용하며, 사용자가 원하는 화면 숫자를 직접 페이지 입력하여 이동할 수 있다. 숫자 링크 목록으로만 탐색하기 어려운 대규모의 데이터 목록 탐색에 적합하다.
- L[971–971](../../upstream/krds/raw/components/component_03_06.html:971): PC
- L[977–977](../../upstream/krds/raw/components/component_03_06.html:977): Mobile
- L[987–987](../../upstream/krds/raw/components/component_03_06.html:987): 목록 확장
- L[988–988](../../upstream/krds/raw/components/component_03_06.html:988): 숫자 링크 목록과 함께 사용하며, 사용자가 원하는 화면 숫자를 직접 페이지 입력하여 이동할 수 있다. 숫자 링크 목록으로만 탐색하기 어려운 대규모의 데이터 목록 탐색에 적합하다.

### 용례

- L[1000–1000](../../upstream/krds/raw/components/component_03_06.html:1000): 용례
- L[1002–1002](../../upstream/krds/raw/components/component_03_06.html:1002): 사용하기 적합한 경우
- L[1007–1007](../../upstream/krds/raw/components/component_03_06.html:1007): 데이터 집합에서 세부적인 정보를 확인하는 것이 아니라 특정 항목을 찾는 것이 중요한 경우, 데이터 집합을 여러 화면으로 구분하면 사용자가 데이터를 더 빨리 훑어 보고 탐색할 수 있다.
- L[1004–1009](../../upstream/krds/raw/components/component_03_06.html:1004): 데이터 집합에서 특정 항목을 찾는 것이 사용자의 목표일 때 데이터 집합에서 세부적인 정보를 확인하는 것이 아니라 특정 항목을 찾는 것이 중요한 경우, 데이터 집합을 여러 화면으로 구분하면 사용자가 데이터를 더 빨리 훑어 보고 탐색할 수 있다.
- L[1013–1013](../../upstream/krds/raw/components/component_03_06.html:1013): 데이터 집합을 한 화면에 표시하였을 때 목록의 높이가 뷰포트의 2배를 초과하거나, 전체 항목 개수가 20개를 초과하는 경우 페이지네이션의 사용을 검토한다.
- L[1010–1015](../../upstream/krds/raw/components/component_03_06.html:1010): 한 화면에 모든 콘텐츠를 표시하여 화면 로딩 시간이 오래 걸릴 때 데이터 집합을 한 화면에 표시하였을 때 목록의 높이가 뷰포트의 2배를 초과하거나, 전체 항목 개수가 20개를 초과하는 경우 페이지네이션의 사용을 검토한다.
- L[1019–1019](../../upstream/krds/raw/components/component_03_06.html:1019): 사용하기 적합하지 않은 경우
- L[1024–1024](../../upstream/krds/raw/components/component_03_06.html:1024): 긴 데이터 집합을 특정 주제나 범주로 구분하고자 하는 경우에는 별도 정보 구조로 포함시켜 사이드 메뉴를 통해 탐색하는 것이 적합하다.
- L[1021–1026](../../upstream/krds/raw/components/component_03_06.html:1021): 데이터 집합을 의미적으로 그룹화하고자 할 때 긴 데이터 집합을 특정 주제나 범주로 구분하고자 하는 경우에는 별도 정보 구조로 포함시켜 사이드 메뉴를 통해 탐색하는 것이 적합하다.
- L[1030–1030](../../upstream/krds/raw/components/component_03_06.html:1030): 데이터 집합을 한 화면에 표시하였을 때 목록의 높이가 뷰포트의 2배를 초과하지 않거나 전체 항목 개수가 20개 이내인 경우 한 화면에서 목록을 탐색하도록 하는 방안을 고려한다. 필요한 경우 필터링/조회 패턴을 활용하여 한 화면에 표시된 데이터 목록의 탐색을 도울 수 있다.
- L[1027–1032](../../upstream/krds/raw/components/component_03_06.html:1027): 전체 데이터 수가 적을 때 데이터 집합을 한 화면에 표시하였을 때 목록의 높이가 뷰포트의 2배를 초과하지 않거나 전체 항목 개수가 20개 이내인 경우 한 화면에서 목록을 탐색하도록 하는 방안을 고려한다. 필요한 경우 필터링/조회 패턴을 활용하여 한 화면에 표시된 데이터 목록의 탐색을 도울 수 있다.
- L[1036–1039](../../upstream/krds/raw/components/component_03_06.html:1036): 사용자가 화면을 아래로 스크롤할 때 추가적으로 데이터가 로드되는 무한 스크롤 기능을 사용하는 경우, 페이지네이션을 사용하지 않는다. 무한 스크롤은 키보드 사용자에게 문제를 야기할 수 있으므로 사용하지 않는 것이 좋으며, 항목 개수에 대한 추정치가 있고 사용자가 항목 목록의 끝으로 이동할 필요가 없을 때만 사용한다.
- L[1033–1041](../../upstream/krds/raw/components/component_03_06.html:1033): 무한 스크롤 기능을 사용할 때 사용자가 화면을 아래로 스크롤할 때 추가적으로 데이터가 로드되는 무한 스크롤 기능을 사용하는 경우, 페이지네이션을 사용하지 않는다. 무한 스크롤은 키보드 사용자에게 문제를 야기할 수 있으므로 사용하지 않는 것이 좋으며, 항목 개수에 대한 추정치가 있고 사용자가 항목 목록의 끝으로 이동할 필요가 없을 때만 사용한다.

### 사용성 가이드라인

- L[1049–1049](../../upstream/krds/raw/components/component_03_06.html:1049): 사용성 가이드라인
- L[1052–1052](../../upstream/krds/raw/components/component_03_06.html:1052): 페이지네이션에는 첫/마지막 화면, 이전/다음 화면으로 이동할 수 있는 수단을 제공한다.
- L[1053–1053](../../upstream/krds/raw/components/component_03_06.html:1053): 목록 확장형 페이지네이션을 제외하고 사용자는 어떤 페이지에서든 항상 첫 화면, 마지막 화면, 이전 화면, 다음 화면으로 이동할 수 있어야 한다.
- L[1056–1056](../../upstream/krds/raw/components/component_03_06.html:1056): 전체 화면 수를 표시한다.
- L[1057–1057](../../upstream/krds/raw/components/component_03_06.html:1057): 사용자가 전체 데이터 목록 수를 알 수 있도록 전체 화면 수를 제공해야 한다.
- L[1060–1060](../../upstream/krds/raw/components/component_03_06.html:1060): 번호 링크에 현재 화면 숫자를 강조하여 표현한다.
- L[1061–1061](../../upstream/krds/raw/components/component_03_06.html:1061): 사용자가 현재 몇 번째 화면을 탐색하는지 명확하게 변별할 수 있도록 현재 화면 숫자 링크를 적절하게 강조하여 표현한다. 목록 상단에 별도의 텍스트 정보를 제공함으로써 탐색 중인 화면의 인지를 도울 수 있다.
- L[1068–1068](../../upstream/krds/raw/components/component_03_06.html:1068): 페이지네이션은 전체 서비스에서 일관된 영역에 배치한다.
- L[1069–1069](../../upstream/krds/raw/components/component_03_06.html:1069): 페이지네이션은 유형에 상관없이 목록 하단에 중앙 정렬하여 사용자가 전체 사이트에 걸쳐 일관된 영역에서 접근할 수 있도록 한다.
- L[1072–1072](../../upstream/krds/raw/components/component_03_06.html:1072): 페이지네이션은 한 화면에 하나만 사용한다.
- L[1073–1073](../../upstream/krds/raw/components/component_03_06.html:1073): 페이지네이션을 이용하여 구분하고 탐색해야 할 항목이 한 화면에 여러 개 제공되면 복잡성이 증가하고 여러 개의 목록 및 페이지네이션의 용도와 역할 구분이 어려워진다.
- L[1076–1076](../../upstream/krds/raw/components/component_03_06.html:1076): 숫자 링크 목록에는 말줄임표를 포함하여 11개 이내의 항목을 표시한다.
- L[1077–1077](../../upstream/krds/raw/components/component_03_06.html:1077): 필요 이상으로 많은 숫자 링크 목록을 표시하면 인지적 부담이 증가한다. 화면 너비가 충분한 경우, 최대 11개의 항목을 표시하고 좁은 화면에서는 최대 7개의 항목을 표시한다.
- L[1080–1080](../../upstream/krds/raw/components/component_03_06.html:1080): 화면당 항목 수를 최적화한다.
- L[1081–1082](../../upstream/krds/raw/components/component_03_06.html:1081): 화면당 항목 수가 너무 많으면 사용자를 압도할 수 있고, 지나치게 적을 경우 정보 탐색이 불편할 수 있다. 각 화면에 표시되는 항목 수를 결정할 때는 화면 로딩 시간, 성능, 사용자의 스크롤 기본 설정 등을 고려한다. 사용자가 각 화면에 표시할 항목 수를 제어하는 컴포넌트를 필터링·정렬 옵션으로 추가하여 사용자가 원하는 방식대로 항목을 탐색하도록 할 수 있다.

### 플랫폼에 대한 고려 사항

- L[1090–1090](../../upstream/krds/raw/components/component_03_06.html:1090): 플랫폼에 대한 고려 사항
- L[1093–1093](../../upstream/krds/raw/components/component_03_06.html:1093): 화면 너비가 충분하지 않은 경우 이전/다음 버튼, 숫자 링크 목록을 수직으로 배치한다.
- L[1094–1095](../../upstream/krds/raw/components/component_03_06.html:1094): 화면 너비가 충분하지 않다면 데이터 목록 하단에 이전/다음 버튼을 배치하고 그 아래에 숫자 링크 목록을 배치한다. 선형적이고 순차적인 방식으로 탐색하는 수단을 더 쉽게 접근할 수 있는 영역에 배치하여, 작은 화면에서 일련의 숫자 링크 목록을 탐색하는 데서 발생하는 피로를 감소시키고 인접 영역을 실수로 터치하지 않도록 한다.
- L[1108–1108](../../upstream/krds/raw/components/component_03_06.html:1108): 화면 너비가 충분하지 않은 경우 숫자 링크 목록은 말줄임표를 포함하여 최대 7개 링크를 표시한다.
- L[1109–1109](../../upstream/krds/raw/components/component_03_06.html:1109): 더 많은 항목이 제공될 경우, 각 링크를 터치할 수 있는 충분한 영역을 확보하기 어렵다.
- L[1117–1117](../../upstream/krds/raw/components/component_03_06.html:1117): 화면 크기에 상관없이 전체 화면 수를 일정하게 유지한다.
- L[1118–1118](../../upstream/krds/raw/components/component_03_06.html:1118): 어떤 설정과 디바이스 환경에서 서비스를 이용하더라도 동일한 항목은 동일한 위치에서 찾을 수 있도록 전체 화면 수와 각 화면에 표시되는 항목 수를 일정하게 유지해야 한다.

### 접근성 가이드라인

- L[1246–1246](../../upstream/krds/raw/components/component_03_06.html:1246): 접근성 가이드라인
- L[1249–1249](../../upstream/krds/raw/components/component_03_06.html:1249): 페이지네이션의 컨테이너가 내비게이션 섹션임을 스크린 리더에서 인지할 수 있도록 한다.
- L[1250–1251](../../upstream/krds/raw/components/component_03_06.html:1250): 페이지네이션의 전체 컨테이너는 &lt;nav&gt;로 감싸거나 WAI-ARIA 영역을 role="navigation"으로 지정하여 스크린 리더에서 내비게이션 요소임을 인지할 수 있도록 제공해야 한다. 내비게이션 섹션에 aria-label 속성을 활용하여 어떤 데이터 집합에 대한 페이지네이션인지에 대한 설명을 제공하면 스크린 리더 사용자가 보다 명확하게 페이지네이션의 역할을 인지할 수 있다.
- L[1258–1258](../../upstream/krds/raw/components/component_03_06.html:1258): 숫자 링크 목록의 구조를 표현한다.
- L[1259–1259](../../upstream/krds/raw/components/component_03_06.html:1259): 스크린 리더 사용자가 페이지네이션의 항목 수를 빠르게 파악할 수 있도록 &lt;ul&gt;, &lt;li&gt; 태그를 활용하여 계층 구조로 정보를 제공해야 한다.
- L[1266–1266](../../upstream/krds/raw/components/component_03_06.html:1266): 스크린 리더에서 확인할 수 있는 현재 화면 정보를 제공한다.
- L[1267–1267](../../upstream/krds/raw/components/component_03_06.html:1267): 스크린 리더 사용자가 시각적으로 표시된 현재 화면 정보를 동등하게 전달받을 수 있도록 현재 화면 링크의 href 속성을 삭제하고 aria-current="true"를 부여한다.
- L[1273–1273](../../upstream/krds/raw/components/component_03_06.html:1273): 현재 화면 숫자 링크를 색상만으로 구분하지 않는다.
- L[1274–1274](../../upstream/krds/raw/components/component_03_06.html:1274): 현재 화면 숫자 링크는 밑줄, 배경 반전, 텍스트 크기 조정 등의 방식을 활용하여 다른 링크와 명확하게 구분되어야 한다.
- L[1289–1289](../../upstream/krds/raw/components/component_03_06.html:1289): 숫자 링크에 적절한 접근 가능한 이름을 제공한다.
- L[1290–1291](../../upstream/krds/raw/components/component_03_06.html:1290): 스크린 리더 사용자가 숫자 링크의 용도를 보다 명확하게 인지할 수 있도록 aria-label="페이지 1", aria label="페이지 2" 또는 title="페이지"와 같은 방식으로 접근 가능한 이름이나 보조적 설명을 제공한다. 마지막 화면의 경우, aria-label="마지막 페이지, [숫자]" 또는 title="마지막 페이지"로 설명을 제공한다.
- L[1298–1298](../../upstream/krds/raw/components/component_03_06.html:1298): 이전/다음 화면 이동 버튼을 아이콘으로만 제공하는 경우 이름을 제공해야 한다.
- L[1299–1299](../../upstream/krds/raw/components/component_03_06.html:1299): aria-label="이전 페이지", aria-label="다음 페이지"와 같은 방식으로 버튼에 접근 가능한 이름을 제공해야 한다.
- L[1306–1306](../../upstream/krds/raw/components/component_03_06.html:1306): 페이지네이션의 구성 요소를 적절한 크기로 표현하고 영역 간 구분을 제공한다.
- L[1307–1307](../../upstream/krds/raw/components/component_03_06.html:1307): 마우스 커서나 손가락으로 선택할 수 있도록 충분히 큰 버튼을 제공하고 실수를 방지하기 위해 버튼 간 충분한 간격을 확보한다. 요소의 적절한 크기는 버튼, 링크 컴포넌트 가이드라인을 참조한다.
- L[1315–1315](../../upstream/krds/raw/components/component_03_06.html:1315): 페이지네이션의 구성 요소를 일관된 순서로 제공한다.
- L[1316–1316](../../upstream/krds/raw/components/component_03_06.html:1316): 화면 너비와 시각적 배치에 상관없이 이전 버튼, 숫자 링크 목록, 다음 버튼, 페이지 숫자 입력 필드, 전체 화면 수 레이블, 이동 버튼 순서로 제공한다.
- L[1323–1323](../../upstream/krds/raw/components/component_03_06.html:1323): 목록 확장 페이지네이션을 사용할 때, 초점 이동 순서에 유의한다.
- L[1324–1324](../../upstream/krds/raw/components/component_03_06.html:1324): 더보기 버튼을 눌러 새로운 항목이 생성되었을 때, 새로 생성된 항목 중 가장 첫 번째 항목으로 Focus 이벤트가 발생해야 한다.

### 상호작용 가이드라인

- L[1336–1336](../../upstream/krds/raw/components/component_03_06.html:1336): 상호작용 가이드라인
- L[1338–1338](../../upstream/krds/raw/components/component_03_06.html:1338): 숫자 링크 목록
- L[1356–1359](../../upstream/krds/raw/components/component_03_06.html:1356): Click 기본 상태의 이전/다음 버튼, 숫자 링크를 Click 하면 해당 페이지로 이동한다.
- L[1360–1363](../../upstream/krds/raw/components/component_03_06.html:1360): Enter 기본 상태의 이전/다음 버튼, 숫자 링크가 초점을 가진 상태에서 Enter 키를 누르면 해당 화면으로 이동한다.
- L[1370–1370](../../upstream/krds/raw/components/component_03_06.html:1370): 페이지 직접 이동
- L[1388–1391](../../upstream/krds/raw/components/component_03_06.html:1388): Click 숫자 입력 필드에 숫자를 입력한 후 이동 버튼을 Click 하면 해당 화면으로 이동한다.
- L[1392–1395](../../upstream/krds/raw/components/component_03_06.html:1392): Space 숫자 입력 필드에 숫자를 입력한 후 이동 버튼이 초점을 가진 상태에서 Space 키를 누르면 해당 화면으로 이동한다.
- L[1402–1402](../../upstream/krds/raw/components/component_03_06.html:1402): 목록 확장
- L[1416–1422](../../upstream/krds/raw/components/component_03_06.html:1416): Click 더보기 버튼을 Click 하면 목록과 더보기 버튼 사이에 새로운 항목이 생성된다. 화면은 새로 생성된 항목 중 첫 번째 항목으로 스크롤 되며, 해당 요소에 Focus 이벤트가 발생한다. 표시된 항목 수 정보가 실제 내용에 맞추어 갱신된다.
- L[1423–1429](../../upstream/krds/raw/components/component_03_06.html:1423): Space 더보기 버튼이 초점을 가진 상태에서 Space 키를 누르면 목록과 더보기 버튼 사이에 새로운 항목이 생성된다. 화면은 새로 생성된 항목 중 첫 번째 항목으로 스크롤 되며, 해당 요소에 Focus 이벤트가 발생한다. 표시된 항목 수 정보가 실제 내용에 맞추어 갱신된다.

### 예시

- L[1448–1448](../../upstream/krds/raw/components/component_03_06.html:1448): 예시
- L[1452–1452](../../upstream/krds/raw/components/component_03_06.html:1452): 기본
- L[1484–1484](../../upstream/krds/raw/components/component_03_06.html:1484): 기본 코드 확인하기

### 마크업 가이드

- L[1504–1504](../../upstream/krds/raw/components/component_03_06.html:1504): 마크업 가이드
- L[1507–1507](../../upstream/krds/raw/components/component_03_06.html:1507): CSS 선택자
- L[1527–1532](../../upstream/krds/raw/components/component_03_06.html:1527): 전체영역 .krds-pagination
- L[1533–1541](../../upstream/krds/raw/components/component_03_06.html:1533): 이전/다음 탐색 .page-navi.prev(이전) .page-navi.next(다음) 비활성화 .disabled
- L[1542–1547](../../upstream/krds/raw/components/component_03_06.html:1542): 페이지 링크 .page-link 말줄임표 .link-dot

보존된 인라인 예시 마크업(참고용이며 공개 네이티브 API 아님): L[1457–1478](../../upstream/krds/raw/components/component_03_06.html:1457)

CSS/JS/가이드 이미지에 대한 출처 참조는 복사된 구현이 아닙니다. 표 행의 원본 HTML(필수/선택 열 보존)은 [source-evidence.json](../../catalog/source-evidence.json)에 보관합니다. 위의 평탄화 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 정확한 clamp/잘못된 입력 처리와 덧붙이기 성공 콜백은 제안된 API 정책입니다. 원본에는 L987–988에 더보기 문단이 중복되어 있습니다.
- 연결된 외부 코드 예시는 참조만 했고 이번 준비에서 별도 파일로 포함·열람하지 않았습니다: L1489 `../../code/pagination.html`, L1562 `./variable/pagination.html`. 보지 못한 내용은 추정하지 않습니다.
- 상세에는 가이드 이미지 참조가 14개 있으나, 포함된 픽셀 다이어그램은 시각 검사하지 않았습니다. 텍스트 구조와 지침만 읽었습니다. 정확한 시각 수치와 자산은 이후 시각/출처 검토가 필요합니다.
- 의미 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 자체 구현, 동작/스토리 소스, 독립 인수가 여전히 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `PaginationContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트가 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크의 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 의무입니다.

공식 인용·파생 텍스트는 원래의 KRDS 권리와 출처 표기를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 출처 식별은 그대로입니다. 남은 근거 한계는 검사하지 못한 가이드 픽셀, 연결 코드, 자산 승인에 관한 것이며, 여기 인용한 실질 요구사항을 면제하지 않습니다.
