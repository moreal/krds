# 언어 변경 {#language-switcher}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐입니다. 네이티브 동작, 시각·자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `language-switcher`, 한국어 이름 언어 변경, export `LanguageSwitcher`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_10_01](https://www.krds.go.kr/html/site/component/component_10_01.html), 보존본 [HTML](../../upstream/krds/raw/components/component_10_01.html). 수집 `2026-10-29T23:28:05.612Z`, `78986` 바이트, SHA-256 `cdef8d8f6c3377fc01747d464ed51a7fc4ca1276c418161bc2f539572b2de397`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류는 `integration`, 수용된 프로젝트 완료 종류도 `integration`입니다. integration으로 유지합니다. 언어 컨트롤은 로케일, 라우트, 콘텐츠를 연결해야 합니다. 공식 L959–961은 별도의 외국어 서비스와 전체 콘텐츠 번역을 구분합니다.

지원하는 네이티브 케이스(변형·상태 축)는 `two-language-link`, `dropdown`, `separate-service`입니다. 이는 네이티브 케이스 이름입니다. 상태·반응형·외형 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형·예시 헤딩 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

두 언어 서비스는 실제 다른 언어 링크를 노출합니다. 세 언어 이상이면 현재 언어와 선택지를 가진 이름 있는 드롭다운을 씁니다. 선택지는 해당 언어의 고유 이름을 보이고, 필요하면 현재 언어로의 번역도 함께 보입니다. 보이는 레이블로 국기나 낯선 언어 코드를 쓰지 않습니다. 각 링크의 lang은 발음되는 레이블과 일치하게 설정합니다.

## 의미 API {#plain-semantic-api}

독립 API입니다. currentLocale, options {locale,nativeLabel,translatedLabel,href,separateService?}[], open/defaultOpen=false, onOpenChange, 호스트의 같은 페이지 현지화용 선택 onLocaleRequest({locale,href})를 씁니다. 별도 서비스 링크는 새 창으로 열리며 그 동작을 표시합니다. 일반 번역 라우트는 계속 실제 링크입니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어와 기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 변경 요청 하나를 냅니다. 비활성, 무동작, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

클릭/Enter/Space로 드롭다운을 토글합니다. Tab/Shift+Tab으로 선택지를 순회합니다. 바깥 클릭은 닫습니다. Escape는 닫고 트리거로 초점을 되돌립니다. 선택지를 고르면 네이티브 href를 따르거나 명시적으로 처리되는 호스트 현지화를 실행하며, 호스트를 통해 문서 언어와 콘텐츠를 갱신합니다. 컨트롤만으로 가짜 번역 페이지를 만들지 않습니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

좁은 화면에서는 보통 햄버거 메뉴나 푸터로 옮깁니다. 언어를 자주 바꾸는 서비스는 푸터에서 바로 찾을 수 있게 둘 수 있습니다. 위치를 옮겨도 현재 로케일을 유지합니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼/리셋/IME 동작은 없습니다. 번역 선택기는 폼 값을 직렬화하지 않습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

번역, 라우트 대응, 문서 lang, 별도 서비스 목적지는 호스트가 책임집니다. 완료에는 네이티브 레이블과 트리거 초점을 갖춘 로컬 라우트/번역 모의가 포함됩니다. 외부 번역 API는 쓰지 않습니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, trigger, globe, current, list, option, external-icon; open,closed,current.

렌더링된 모든 소유 파트는 `data-krds-component="language-switcher"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 씁니다. 네이티브/ARIA 상태가 우선합니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 한국어 페이지는 English를 보이고, 반대쪽 페이지는 한국어를 보입니다.
2. 각 언어 레이블은 올바른 lang을 가집니다.
3. 드롭다운의 키보드·바깥 클릭·Escape 동작이 작동합니다.
4. 별도 서비스 링크는 새 창임을 알립니다.
5. 호스트가 문서 언어와 로컬 콘텐츠를 함께 갱신합니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색 외 상태 단서, 움직임이 있다면 동작 줄이기를 검증합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 독립 로컬 표본 정책 {#independent-local-specimen-policy}

독립 드롭다운 표본은 실제 현재 언어 버튼의 이름을 “언어: 한국어”로 하고, 올바르게 레이블된 언어 선택지를 요구합니다. 이 드롭다운에는 별도의 내비게이션 랜드마크가 필요하지 않습니다. 이 정확한 버튼 기대치가 현재 언어나 펼침 상태를 없애도 된다는 뜻은 아닙니다.

## 필수 네이티브 스토리 {#required-native-stories}

`language-switcher--two-language-link`, `language-switcher--dropdown`, `language-switcher--separate-service`, `language-switcher--narrow-footer`, `language-switcher--local-translation-mock`.

각 케이스는 해당하는 모든 네이티브 렌더러에서 로컬 args/inputs/slots와 관찰 가능한 순수 로컬 상태가 필요합니다. 렌더러는 Solid 1, React, Svelte, Vue, Lit, Qwik, Angular이며 Solid 2 미리보기는 따로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 별도로 준비됩니다. 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 인수되어야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 상류 siheom 어댑터만 씁니다. Lit과 Solid 2는 siheom 지원을 지어내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름과 대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러/렌더러를 가져와서는 안 됩니다. 다른 프레임워크 렌더러 래퍼는 금지합니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 실제 보존 상세 HTML에서 추출했으며 핵심 지침과 상호작용·마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 출처 언어(한국어)를 그대로 둡니다. “고려/권장/수 있다” 같은 표현은 권고로 남습니다. 예시나 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 출처 JS 함수 표는 참고 근거일 뿐이며 원본 KRDS JS를 네이티브 제어 DOM에서 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 빼면 독립 선택입니다.

### 구조

- L[886–886](../../upstream/krds/raw/components/component_10_01.html:886): 구조
- L[892–892](../../upstream/krds/raw/components/component_10_01.html:892): 1. 아이콘과 레이블 언어 변경 옵션 목록을 실행하는 데 사용하는 버튼/링크의 이름
- L[893–893](../../upstream/krds/raw/components/component_10_01.html:893): 2. 현재 언어 현재 표시되고 있는 언어 이름
- L[894–894](../../upstream/krds/raw/components/component_10_01.html:894): 3. 옵션 사용자가 선택할 수 있는 표시 언어 옵션 값의 목록. 언어 이름을 ‘원어-현재 서비스를 표시하는 데 사용된 언어’로 작성함

### 유형

- L[902–902](../../upstream/krds/raw/components/component_10_01.html:902): 유형
- L[904–904](../../upstream/krds/raw/components/component_10_01.html:904): 링크
- L[905–905](../../upstream/krds/raw/components/component_10_01.html:905): 서비스가 2개의 언어를 지원하는 경우, 두 언어 간 표시를 전환할 때 사용한다.
- L[908–908](../../upstream/krds/raw/components/component_10_01.html:908): 드롭다운
- L[909–909](../../upstream/krds/raw/components/component_10_01.html:909): 서비스가 3개 이상의 언어를 지원하는 경우 사용한다.

### 사용성 가이드라인

- L[916–916](../../upstream/krds/raw/components/component_10_01.html:916): 사용성 가이드라인
- L[919–919](../../upstream/krds/raw/components/component_10_01.html:919): 링크 레이블에 아이콘을 제공한다.
- L[920–921](../../upstream/krds/raw/components/component_10_01.html:920): 드롭다운 유형에서 레이블 왼쪽에 지구본 형태의 아이콘을 표시하여 사용자가 버튼의 용도를 직관적으로 인지할 수 있도록 표현한다. 언어 변경을 필요로 하는 사용자는 레이블 텍스트만으로 의미를 이해하는 것이 어려울 수 있으므로 사용자에게 익숙한 기호 체계를 활용하여 부가적인 단서를 제공해야 한다.
- L[932–932](../../upstream/krds/raw/components/component_10_01.html:932): 링크 레이블은 전환되는 언어의 이름을 해당 언어로 작성한다.
- L[933–933](../../upstream/krds/raw/components/component_10_01.html:933): 사용자가 링크 레이블을 읽고 이해할 수 있어야 이용하기 적합한 언어로 전환하거나 관련 서비스로 이동할 수 있다. 만약 모든 언어 이름이 영어로 작성되어 있다면 영어를 읽을 수 없는 사용자는 자신에게 필요한 서비스가 제공되고 있더라도 사용할 수 없을 것이다.
- L[934–935](../../upstream/krds/raw/components/component_10_01.html:934): 특히 링크 유형의 언어 변경 방식을 사용할 때, 두 언어 간 링크 레이블을 반대로 제공하거나 하나의 언어로만 고정하여 제공하지 않도록 유의해야 한다. 예를 들어, 한국어, 영어로 표시되는 서비스가 있다면 한국어 화면에서 링크 레이블은 ‘English’, 영어 화면에서 링크 레이블은 ‘한국어’로 표시되어야 한다.
- L[946–946](../../upstream/krds/raw/components/component_10_01.html:946): 링크 레이블을 언어 코드로 축약하지 않는다.
- L[947–947](../../upstream/krds/raw/components/component_10_01.html:947): 사용자에게 익숙하지 않은 언어 코드를 링크 레이블로 사용해서는 안 된다. 언어 이름을 그대로 사용했을 때 의미를 명확하게 전달할 수 있으며, 별도 설명 없이도 스크린 리더 사용자에게 자연스러운 설명을 제공할 수 있다.
- L[954–954](../../upstream/krds/raw/components/component_10_01.html:954): 국가명은 필요한 경우에만 사용한다.
- L[955–956](../../upstream/krds/raw/components/component_10_01.html:955): 한 국가 내에서도 다양한 언어가 사용되므로 서비스 언어 변경을 위한 링크 레이블을 국가와 관련된 정보로 표현하는 것은 적절하지 않다. 만약 사용자의 국적이나 접속 국가에 따라 제공되는 서비스가 달라지거나 서비스 정책이 변경되는 경우에는 링크에 국가명을 보조적인 정보로 제공할 수 있다. 그러나 국가명을 보조적인 정보로 제공하는 경우에도 언어명이 가장 강조된 정보여야 한다.
- L[959–959](../../upstream/krds/raw/components/component_10_01.html:959): 외국어 서비스로 이동하는 경우 링크를 새 창으로 실행하고, 새 창 열림 아이콘을 제공한다.
- L[960–961](../../upstream/krds/raw/components/component_10_01.html:960): 이때, 외국어 서비스는 서비스 내 콘텐츠 전체 내용을 외국어로 번역하는 대신, 외국어 사용자들에게 가장 중요하고 필수적인 정보만을 선별하여 제공하는 간소화된 다국어 정보 플랫폼을 의미한다. 별도의 외국어 서비스를 제공하는 경우, 사용자가 언어 변경을 시도하게 되면 사용자가 탐색 중인 화면의 맥락과 상관없이 외국어 서비스의 대표 화면으로 이동하게 된다. 사용자가 이용 맥락의 변화로 인한 혼동을 겪지 않도록 링크를 새 창으로 실행하고, 새 창 열림 아이콘을 제공해야 한다.

### 플랫폼에 대한 고려 사항

- L[979–979](../../upstream/krds/raw/components/component_10_01.html:979): 플랫폼에 대한 고려 사항
- L[982–982](../../upstream/krds/raw/components/component_10_01.html:982): 화면 너비가 충분하지 않은 경우, 언어 변경 컴포넌트를 햄버거 메뉴 내부나 푸터에 배치한다.
- L[983–984](../../upstream/krds/raw/components/component_10_01.html:983): 외국어로 표시된 콘텐츠에 대한 이용 빈도가 높거나 언어 변경이 중요한 서비스인 경우 언어 변경 버튼을 푸터에 배치하여, 사용자가 숨겨진 콘텐츠 영역을 탐색하지 않고도 쉽게 기능을 발견할 수 있도록 하는 것이 좋다. 일반적인 서비스에서는 헤더의 복잡성을 줄이기 위해, ‘헤더’ 컴포넌트 가이드라인을 참조하여 햄버거 메뉴 내부에 언어 변경 버튼을 배치한다.

### 접근성 가이드라인

- L[1091–1091](../../upstream/krds/raw/components/component_10_01.html:1091): 접근성 가이드라인
- L[1094–1094](../../upstream/krds/raw/components/component_10_01.html:1094): 링크에 lang 속성을 선언하고 레이블과 일치하는 언어 코드를 속성값으로 제공한다.
- L[1095–1095](../../upstream/krds/raw/components/component_10_01.html:1095): 스크린 리더가 lang 속성값으로 제공된 언어 코드를 식별하여 해당 언어에 맞는 발음과 억양으로 레이블을 읽어주게 된다. 잘못된 발음은 링크 레이블의 내용 이해를 어렵게 만들며, 해석에 정신적 노력이 필요하므로 피로를 증가시킨다.

### 상호작용 가이드라인

- L[1106–1106](../../upstream/krds/raw/components/component_10_01.html:1106): 상호작용 가이드라인
- L[1108–1108](../../upstream/krds/raw/components/component_10_01.html:1108): 드롭다운 목록 확장 및 축소
- L[1126–1129](../../upstream/krds/raw/components/component_10_01.html:1126): Click 컨테이너를 Click 했을 때, 옵션 목록이 확장되거나 축소된다.옵션 목록이 확장된 상태에서 레이블, 컨테이너, 옵션 목록이 아닌 영역을 Click 하면 옵션 목록은 축소되어야 한다.
- L[1130–1133](../../upstream/krds/raw/components/component_10_01.html:1130): Enter, Space 컨테이너에 초점이 있는 경우, 옵션 목록이 확장되거나 축소된다.
- L[1134–1137](../../upstream/krds/raw/components/component_10_01.html:1134): Esc 옵션 목록을 축소하고 컨테이너로 초점이 이동해야 한다.
- L[1144–1144](../../upstream/krds/raw/components/component_10_01.html:1144): 드롭다운 목록 탐색
- L[1162–1165](../../upstream/krds/raw/components/component_10_01.html:1162): Tab, Shift + Tab Tab, Shift + Tab 키를 눌렀을 때 옵션에 접근할 수 있어야 한다.
- L[1166–1169](../../upstream/krds/raw/components/component_10_01.html:1166): Scroll 옵션 목록에 스크롤이 생성된 경우 목록이 상/하로 이동한다.

### 예시

- L[1188–1188](../../upstream/krds/raw/components/component_10_01.html:1188): 예시
- L[1192–1192](../../upstream/krds/raw/components/component_10_01.html:1192): 기본
- L[1226–1226](../../upstream/krds/raw/components/component_10_01.html:1226): 기본 코드 확인하기
- L[1242–1242](../../upstream/krds/raw/components/component_10_01.html:1242): 페이지 전환
- L[1281–1281](../../upstream/krds/raw/components/component_10_01.html:1281): 페이지 전환 코드 확인하기

### 마크업 가이드

- L[1302–1302](../../upstream/krds/raw/components/component_10_01.html:1302): 마크업 가이드
- L[1305–1305](../../upstream/krds/raw/components/component_10_01.html:1305): CSS 선택자
- L[1325–1333](../../upstream/krds/raw/components/component_10_01.html:1325): 전체영역 .krds-drop-wrap .krds-language 드롭다운 위치 .drop-left (왼쪽 정렬) .drop-right (오른쪽 정렬)
- L[1334–1337](../../upstream/krds/raw/components/component_10_01.html:1334): 드롭다운 메뉴 전체영역 .drop-menu
- L[1338–1341](../../upstream/krds/raw/components/component_10_01.html:1338): 드롭다운 메뉴 상단 .drop-top
- L[1342–1345](../../upstream/krds/raw/components/component_10_01.html:1342): 드롭다운 메뉴 리스트 .drop-list
- L[1346–1349](../../upstream/krds/raw/components/component_10_01.html:1346): 드롭다운 메뉴 하단 .drop-bottom

보존된 인라인 예시 마크업(참고용이며 공개 네이티브 API가 아님): L[1197–1220](../../upstream/krds/raw/components/component_10_01.html:1197), L[1247–1275](../../upstream/krds/raw/components/component_10_01.html:1247)

CSS/JS/안내 이미지 출처 참조는 복사한 구현이 아닙니다. 표 행의 필수/선택 열을 보존한 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화된 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 번역 품질이나 npm 스코프의 소유권을 예시 네임스페이스에서 추정하지 않습니다.
- 연결된 외부 코드 예시는 참조만 하며 이 준비 단계에서 별도 파일로 포함하거나 읽지 않았습니다. L1231 `../../code/language_switcher.html`, L1286 `../../code/language_switcher_page.html`. 보지 않은 내용을 추측하지 않습니다.
- 상세에는 안내 이미지 참조 8건이 있습니다. 내장 픽셀 도해는 시각적으로 검사하지 않았습니다. 텍스트 구조와 지침은 읽었습니다. 정확한 시각 치수·자산은 이후 시각·출처 검토가 필요합니다.
- 의미 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작/스토리 소스, 독립 인수가 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `LanguageSwitcherContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트는 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼로는 이 계약을 충족할 수 없습니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에 인용·파생된 공식 텍스트는 원래의 KRDS 권리와 출처 표시를 유지합니다. 독립 코드의 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 검사하지 않은 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며, 여기 인용한 실질 요구사항을 면제하지 않습니다.
