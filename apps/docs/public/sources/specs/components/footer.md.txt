# 푸터 {#footer}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐입니다. 네이티브 동작, 시각·자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `footer`, 한국어 이름 푸터, export `Footer`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_02_04](https://www.krds.go.kr/html/site/component/component_02_04.html), 보존본 [HTML](../../upstream/krds/raw/components/component_02_04.html). 수집 `2026-10-29T23:28:02.764Z`, `74171` 바이트, SHA-256 `b3235a0f1707901bf43826b17b1f9105260ab15c34ae1a2b9ecd2047a1f02609`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류는 `composition`, 수용된 프로젝트 완료 종류도 `composition`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 케이스(변형·상태 축)는 `default`, `narrow`입니다. 이는 네이티브 케이스 이름입니다. 상태·반응형·외형 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형·예시 헤딩 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

실제 <footer>가 페이지의 마지막 랜드마크입니다. 서비스 로고/연락처/유틸리티 링크를 묶고, 이어서 정책 링크, 저작권 정보, 마지막 하위 영역으로 운영기관 식별자(Identifier)를 둡니다. 눈에 띄게 구분되는 “개인정보 처리방침”을 포함합니다. 전자상거래 서비스는 이용약관과 사업자 신원을 추가로 제공합니다. 선택 서비스 내비게이션은 메인 내비게이션의 레이블과 계층을 그대로 따라야 합니다.

## 의미 API {#plain-semantic-api}

독립 API입니다. Footer는 serviceLogo {src,alt}, contacts {label,href,text}[], utilityLinks[], privacyPolicy {href,label}, policyLinks[], 명시적으로 전달되는 copyrightText, 선택 기관 식별 정보를 받습니다. 지어낸 원시 주소 대신 의미 Link 데이터를 보존합니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어와 기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 변경 요청 하나를 냅니다. 비활성, 무동작, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

실제 링크를 통해 자연스러운 Tab 순서를 따릅니다. 동작 가능한 연락처 값에는 tel:/mailto:를 씁니다. 외부/새 창 링크는 이동 동작을 알려야 합니다. 푸터 자체는 초점을 가두거나 돌리지 않습니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

작은 화면에서도 열을 같은 순서로 쌓습니다. 짧은 페이지에서는 호스트 페이지 레이아웃이 콘텐츠를 덮지 않고 푸터를 뷰포트 하단에 둡니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

집계된 폼/리셋/IME 상태는 없습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

정확하고 최신인 연락처, 정책, 저작권, 자산 권리는 호스트가 책임집니다. 저작권 기본값을 저장소 소유자나 KRDS 권리자로 두지 않습니다. 완료에는 실제 로컬 연락처·정책 링크, 운영기관 식별자(Identifier) 조합, 페이지 레이아웃 데모가 포함됩니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, logo, contacts, utilities, policies, privacy-link, copyright, identifier; 값 상태 없음.

렌더링된 모든 소유 파트는 `data-krds-component="footer"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 씁니다. 네이티브/ARIA 상태가 우선합니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 푸터 랜드마크가 모든 푸터 정보를 담고 운영기관 식별자(Identifier)가 마지막입니다.
2. 좁은 레이아웃도 출처 순서를 유지합니다.
3. 개인정보 처리방침은 필수 레이블과 시각적 구분을 갖습니다.
4. 짧은 페이지에서도 푸터가 콘텐츠를 가리지 않고 뷰포트 하단에 닿습니다.
5. 연락처 링크는 올바른 로컬 tel/mailto URI를 노출합니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색 외 상태 단서, 움직임이 있다면 동작 줄이기를 검증합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`footer--default`, `footer--narrow`, `footer--short-page`, `footer--commerce-policy`, `footer--navigation-mirror`.

각 케이스는 해당하는 모든 네이티브 렌더러에서 로컬 args/inputs/slots와 관찰 가능한 순수 로컬 상태가 필요합니다. 렌더러는 Solid 1, React, Svelte, Vue, Lit, Qwik, Angular이며 Solid 2 미리보기는 따로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 별도로 준비됩니다. 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 인수되어야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 상류 siheom 어댑터만 씁니다. Lit과 Solid 2는 siheom 지원을 지어내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름과 대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러/렌더러를 가져와서는 안 됩니다. 다른 프레임워크 렌더러 래퍼는 금지합니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 실제 보존 상세 HTML에서 추출했으며 핵심 지침과 상호작용·마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 출처 언어(한국어)를 그대로 둡니다. “고려/권장/수 있다” 같은 표현은 권고로 남습니다. 예시나 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 출처 JS 함수 표는 참고 근거일 뿐이며 원본 KRDS JS를 네이티브 제어 DOM에서 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 빼면 독립 선택입니다.

### 구조

- L[885–885](../../upstream/krds/raw/components/component_02_04.html:885): 구조
- L[891–894](../../upstream/krds/raw/components/component_02_04.html:891): 1. 컨테이너 푸터가 제공되는 영역
- L[895–898](../../upstream/krds/raw/components/component_02_04.html:895): 2. 서비스 로고 기관/서비스 로고를 통해 디지털 서비스 운영 주체의 정체성을 전달하는 요소
- L[899–902](../../upstream/krds/raw/components/component_02_04.html:899): 3. 연락처 주소, 이메일 주소, 대표 전화번호, 민원 전화번호 등 연락 수단 정보
- L[903–906](../../upstream/krds/raw/components/component_02_04.html:903): 4. 유틸리티 링크 오시는 길, 관련 기관 웹사이트 가기 링크, 소셜 채널 바로가기 링크 등이 제공됨
- L[907–910](../../upstream/krds/raw/components/component_02_04.html:907): 5. 정책 링크 웹 접근성, 개인 정보 처리 방침과 같은 각종 정책 링크가 제공됨
- L[911–914](../../upstream/krds/raw/components/component_02_04.html:911): 6. 저작권 정보 디지털 정부 서비스의 저작권을 명시한 텍스트

### 사용성 가이드라인

- L[922–922](../../upstream/krds/raw/components/component_02_04.html:922): 사용성 가이드라인
- L[925–925](../../upstream/krds/raw/components/component_02_04.html:925): 모든 페이지에 푸터를 일관된 위치에 제공해야 한다.
- L[926–926](../../upstream/krds/raw/components/component_02_04.html:926): 푸터는 페이지의 마지막 요소이므로 본문 하단에 배치해야 한다. 본문의 높이가 뷰포트 높이보다 짧은 경우 푸터가 뷰포트 하단에 고정되어 있는지 확인한다.
- L[937–937](../../upstream/krds/raw/components/component_02_04.html:937): 모든 디지털 정부 서비스에서 푸터 섹션의 정보는 일관된 순서로 제공한다.
- L[938–941](../../upstream/krds/raw/components/component_02_04.html:938): 푸터 내 정보 배치 일관성을 유지하는 것은 디지털 정부 서비스 브랜드 확립과 사용자 신뢰 구축에 매우 중요하므로 명확한 이유 없이 기본 순서를 변경해서는 안 된다. 푸터 섹션의 정보는 서비스 로고, 연락처, 유틸리티 링크, 정책 링크, 저작권 정보의 순으로 제공한다. 이때, 서비스 로고, 연락처, 유틸리티 링크는 하나의 그룹으로 인지될 수 있도록 표현해야 한다.
- L[944–944](../../upstream/krds/raw/components/component_02_04.html:944): 개인정보처리방침을 반드시 표시한다.
- L[945–946](../../upstream/krds/raw/components/component_02_04.html:945): 개인정보 처리의 투명성을 알리기 위한 개인정보 처리방침은 반드시 웹사이트에 공개해야 한다. 또한 반드시 ‘개인정보 처리방침’ 이라는 명칭을 사용하고, 변경된 경우 그 사항을 반영해야 한다. 개인정보 처리방침은 글자 크기를 달리하거나, 색상 또는 굵기(Bold) 등을 활용하여 다른 고지사항(이용약관, 저작권 안내 등)과 구분하는 등 다양한 방법을 통해 정보 주체가 쉽게 확인할 수 있도록 한다.
- L[949–949](../../upstream/krds/raw/components/component_02_04.html:949): 전자상거래가 포함된 경우 이용약관을 반드시 표시한다.
- L[950–950](../../upstream/krds/raw/components/component_02_04.html:950): 인터넷쇼핑몰 등 전자상거래가 포함된 경우, 소비자가 안전하게 거래할 수 있도록 사업자의 신원, 거래 약관 등을 푸터에서 제공해야 한다.
- L[953–953](../../upstream/krds/raw/components/component_02_04.html:953): 사용자들이 빈번하게 찾는 링크를 배치한다.
- L[954–955](../../upstream/krds/raw/components/component_02_04.html:954): 사이트맵을 비롯하여 사용자가 빈번하게 찾는 링크는 웹사이트의 하단에서도 쉽게 접근할 수 있도록 제공하는 것이 좋다. 웹사이트의 세로 길이가 길어질수록 다시 상단으로 이동하는 것보다 더 빠른 접근이 가능하기 때문이다. 필요하다면 목적별/유형별로 군집화하여 직관적으로 탐색할 수 있게 한다.
- L[958–958](../../upstream/krds/raw/components/component_02_04.html:958): 푸터에 제공하는 서비스 내비게이션은 기본 내비게이션과 동일한 구조 및 레이블을 따라야 한다.
- L[959–959](../../upstream/krds/raw/components/component_02_04.html:959): 푸터에 서비스 내비게이션을 제공할 때, 기본 내비게이션(메인 메뉴)에 포함된 모든 최상위 화면 링크가 푸터 탐색에도 포함되어야 한다. 하위 화면 링크가 푸터에 포함된 경우 하위 화면 링크도 기본 탐색과 동일한 구조 및 레이블을 따라야 한다.
- L[962–962](../../upstream/krds/raw/components/component_02_04.html:962): 연락처 정보와 각종 링크는 항상 최신 상태로 유지한다.
- L[963–963](../../upstream/krds/raw/components/component_02_04.html:963): 링크를 실행했을 때 존재하지 않는 사이트/페이지/화면으로 이동하거나 예상과 다른 목적지로 이동하지 않도록 점검하고 최신화해야 한다.

### 플랫폼에 대한 고려 사항

- L[971–971](../../upstream/krds/raw/components/component_02_04.html:971): 플랫폼에 대한 고려 사항
- L[974–974](../../upstream/krds/raw/components/component_02_04.html:974): 작은 화면 너비에서도 푸터의 정보 요소는 상대적으로 동일한 순서로 제공되도록 표현한다.
- L[975–975](../../upstream/krds/raw/components/component_02_04.html:975): 화면 너비가 충분하지 않아 병렬적으로 배치되었던 푸터 내부 요소가 수직 배열로 변경되더라도 서비스 로고, 연락처, 유틸리티 링크, 정책 링크, 저작권 정보의 순서로 배치한다.

### 접근성 가이드라인

- L[1100–1100](../../upstream/krds/raw/components/component_02_04.html:1100): 접근성 가이드라인
- L[1103–1103](../../upstream/krds/raw/components/component_02_04.html:1103): 푸터 영역이 스크린 리더에 인지될 수 있는 방식으로 제공한다.
- L[1104–1104](../../upstream/krds/raw/components/component_02_04.html:1104): 푸터의 모든 요소는 &lt;footer&gt; 내부에 배치하여 주요 랜드마크 정보가 스크린 리더로 전달될 수 있도록 해야 한다. 이를 통해 스크린 리더 사용자들은 페이지의 구성을 빠르게 파악할 수 있다.
- L[1110–1110](../../upstream/krds/raw/components/component_02_04.html:1110): 로고 이미지에 대체 텍스트를 제공한다.
- L[1111–1111](../../upstream/krds/raw/components/component_02_04.html:1111): 텍스트가 아닌 이미지로 된 로고를 사용하는 경우 스크린 리더를 위한 대체 텍스트를 포함해야 한다.

### 예시

- L[1131–1131](../../upstream/krds/raw/components/component_02_04.html:1131): 예시
- L[1135–1135](../../upstream/krds/raw/components/component_02_04.html:1135): 기본
- L[1222–1222](../../upstream/krds/raw/components/component_02_04.html:1222): 기본 코드 확인하기

### 마크업 가이드

- L[1242–1242](../../upstream/krds/raw/components/component_02_04.html:1242): 마크업 가이드
- L[1245–1245](../../upstream/krds/raw/components/component_02_04.html:1245): CSS 선택자
- L[1262–1265](../../upstream/krds/raw/components/component_02_04.html:1262): 전체영역 #krds-footer
- L[1266–1269](../../upstream/krds/raw/components/component_02_04.html:1266): 관련기관 링크 .foot-quick
- L[1270–1273](../../upstream/krds/raw/components/component_02_04.html:1270): 주소 및 연락처 등 정보 .f-info
- L[1274–1277](../../upstream/krds/raw/components/component_02_04.html:1274): 푸터 링크 .f-link
- L[1278–1281](../../upstream/krds/raw/components/component_02_04.html:1278): 운영기관 식별자 .krds-identifier

보존된 인라인 예시 마크업(참고용이며 공개 네이티브 API가 아님): L[1140–1216](../../upstream/krds/raw/components/component_02_04.html:1140)

CSS/JS/안내 이미지 출처 참조는 복사한 구현이 아닙니다. 표 행의 필수/선택 열을 보존한 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화된 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 법적 내용은 호스트가 제공합니다. 이 초안은 공식 지침을 기록할 뿐 어떤 전자상거래 법령이 적용되는지는 판단하지 않습니다.
- 연결된 외부 코드 예시는 참조만 하며 이 준비 단계에서 별도 파일로 포함하거나 읽지 않았습니다. L1227 `../../code/footer.html`. 보지 않은 내용을 추측하지 않습니다.
- 상세에는 안내 이미지 참조 3건이 있습니다. 내장 픽셀 도해는 시각적으로 검사하지 않았습니다. 텍스트 구조와 지침은 읽었습니다. 정확한 시각 치수·자산은 이후 시각·출처 검토가 필요합니다.
- 의미 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작/스토리 소스, 독립 인수가 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `FooterContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트는 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼로는 이 계약을 충족할 수 없습니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에 인용·파생된 공식 텍스트는 원래의 KRDS 권리와 출처 표시를 유지합니다. 독립 코드의 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 검사하지 않은 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며, 여기 인용한 실질 요구사항을 면제하지 않습니다.
