# 화면 크기 조정 {#resize}

**계약 상태: 네이티브 구현용으로 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐이며, 네이티브 동작, 시각/자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `resize`, 한국어 이름 화면 크기 조정, export `Resize`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_10_02](https://www.krds.go.kr/html/site/component/component_10_02.html), 보존된 [HTML](../../upstream/krds/raw/components/component_10_02.html). 조회 시각 `2026-10-29T23:28:05.696Z`, `75629` 바이트, SHA-256 `b20eb8f9d7cd29d12e5a87be485cbcd5e1ba2bff549f40ab16e29925fe34cba4`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조해 확인했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 별개입니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류 `integration`, 수용된 프로젝트 완료 종류 `integration`입니다. 통합을 유지합니다. L1066–1077은 컨트롤 마크업을 넘어 호스트 페이지의 콘텐츠/기능 유지를 요구합니다.

지원하는 네이티브 케이스(변형·상태 축): `five-levels`, `custom-levels`, `narrow-reflow`. 이는 네이티브 케이스 이름이며, 상태·반응형·외형 축이 곧 공식 명명 변형은 아닙니다. 공식 유형/예시 헤딩은 근거 부록에 그대로 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

이름 있는 화면 크기 컨트롤입니다. 설명 레이블이 있는 옵션과 현재 선택 값을 보여 줍니다. 공식 예시는 90%,100%,110%,130%,150%이며 옵션은 5개 이하입니다. 텍스트 레이블이 크기 아이콘/숫자와 함께 표시됩니다.

## 의미 API {#plain-semantic-api}

독립 API: `levels` `{id,label,percent}[]`=공식 5단계, `value?:string`, `defaultValue?:string="100"`, `onValueChange({value:id})`, `open`/`defaultOpen=false`, `onOpenChange`. 요청 값은 옵션 ID이며 콜백은 [ValueChangeDetails<T>](../../packages/contracts/src/types.ts:7)를 따릅니다. 호스트는 호환되지 않는 id 전용 페이로드를 받는 대신 `levels`에서 percent를 찾습니다. 정의된 `value`는 제어 모드를 택하고, 없으면 한 번만 읽는 기본값을 씁니다. 제어/기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 사용자의 선택 변경은 요청 하나를 내며, 같은 값/비활성 동작, props, 마운트, 리셋은 요청을 내지 않습니다. 호스트가 범위가 한정된 배율을 적용하고 값을 확정하며, 브라우저/기기 확대는 조작하지 않습니다.

제어 모드에서 거부된 클릭/Enter/접힌 상태 화살표 요청은 현재 옵션, 표시 값, 호스트 배율을 커밋된 값으로 유지합니다. 요청된 percent를 낙관적으로 적용하거나 조정 중에 두 번째 요청을 내보내지 않습니다. 배율 적용과 선택은 같은 권위 있는 값을 공유합니다. [파일럿 정책](./README.md)과 별도의 열림 상태 소유는 그대로 적용됩니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

클릭/Enter/Space로 열고, Tab으로 옵션을 방문하며, 바깥 클릭/Escape로 닫고, Escape는 트리거로 초점을 돌려줍니다. Enter는 선택하고 닫습니다. 접힌 상태의 ArrowUp/Down은 공식 표에 따라 이전/다음 옵션을 선택하며 끝에서 순환하지 않습니다(프로젝트 정책). 리플로 후에도 선택 초점이 사용 가능해야 합니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

확대된 배율에서도 모든 콘텐츠와 동작에 접근할 수 있고, 문서화된 미디어/표 예외를 제외하면 페이지는 한 방향으로만 스크롤합니다. 컴포넌트 단계와 함께 실제 브라우저 200/400% 확대를 확인합니다. CSS transform만으로는 사용 가능한 레이아웃 리플로를 대신할 수 없습니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼 값이 없습니다. 설정 리셋은 암묵적 폼 리셋이 아니라 명시적인 호스트 환경설정 동작입니다. IME 편집은 없습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

배율 적용, 환경설정 영속화, 범위는 호스트가 맡습니다. 레이블 변경만이 아니라 리플로를 보여 주는 동작하는 로컬 설정 드라이버와 대표 페이지가 완료 조건입니다. 원격 저장소나 전역 브라우저 설정 편집은 없습니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, trigger, current, list, option, scale-icon; open,closed,selected.

렌더링되는 모든 소유 파트는 `data-krds-component="resize"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 사용합니다. 네이티브/ARIA 상태가 기준입니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 각 선택이 로컬 호스트 콘텐츠 배율을 눈에 띄게 바꿉니다.
2. 접힌 상태의 화살표는 선택을 한 번만 바꿉니다.
3. Escape가 초점을 돌려줍니다.
4. 브라우저 200/400% 확대에서도 콘텐츠와 동작이 유지됩니다.
5. 본질적인 미디어/표를 제외하면 양방향 페이지 스크롤이 없습니다.
6. 마운트 해제 시 범위 스타일과 리스너를 복원합니다.
7. 접힌 상태 화살표로 값이 바뀔 때마다, 요청된 옵션 ID를 값으로 하는 공유 형태의 값 요청을 정확히 하나 내보냅니다.
8. 제어 모드에서 거부된 배율 요청은 두 번째 조정 이벤트 없이 현재 옵션과 실제 호스트 배율을 유지합니다.

이는 앞으로 필요한 테스트이며, 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 단서, 움직임이 있는 곳의 동작 줄이기를 확인합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`resize--five-levels`, `resize--custom-levels`, `resize--narrow-reflow`, `resize--browser-zoom`, `resize--controlled-rejected`, `resize--shared-value-payload`, `resize--collapsed-arrow-rejected`.

각 케이스는 해당되는 모든 네이티브 렌더러(Solid 1, React, Svelte, Vue, Lit, Qwik, Angular)에서 로컬 args/입력/슬롯과 관찰 가능한 순수 로컬 상태를 갖춰야 합니다. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 따로 준비하며, 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 인수되어야 합니다. 동작 스위트는 스토리 파일과 분리하며, 지원되는 upstream siheom 어댑터만 사용합니다. Lit/Solid 2는 siheom 지원을 만들어 내지 않고 선택한 네이티브 테스트 경로를 씁니다. Qwik은 첫 lazy 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 partial APF 소비를 테스트해야 합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증해야 합니다. Solid 2는 Solid 1 컴파일러/렌더러를 가져오지 않습니다. 다른 렌더러의 래퍼는 금지합니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 보존된 상세 HTML 원본에서 뽑았으며, 실질 지침과 상호작용/마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 원문 언어를 유지합니다. “고려/권장/가능” 같은 표현은 권고로 남습니다. 예시나 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원본 JS 함수 표는 참고 근거일 뿐이며, 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행하면 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립적 선택입니다.

### 구조

- L[886–886](../../upstream/krds/raw/components/component_10_02.html:886): 구조
- L[895–895](../../upstream/krds/raw/components/component_10_02.html:895): 1. 아이콘과 레이블 화면 크기 조정 옵션 목록을 실행하는 데 사용하는 버튼의 이름
- L[899–899](../../upstream/krds/raw/components/component_10_02.html:899): a. 작게 90% 축소
- L[900–900](../../upstream/krds/raw/components/component_10_02.html:900): b. 보통 100%, 기본 크기
- L[901–901](../../upstream/krds/raw/components/component_10_02.html:901): c. 조금 크게 110% 확대
- L[902–902](../../upstream/krds/raw/components/component_10_02.html:902): d. 크게 130% 확대
- L[903–903](../../upstream/krds/raw/components/component_10_02.html:903): e. 가장 크게 150% 확대
- L[896–905](../../upstream/krds/raw/components/component_10_02.html:896): 2. 옵션 사용자가 선택할 수 있는 화면 크기 조정 옵션 값의 목록 a. 작게 90% 축소 b. 보통 100%, 기본 크기 c. 조금 크게 110% 확대 d. 크게 130% 확대 e. 가장 크게 150% 확대
- L[906–906](../../upstream/krds/raw/components/component_10_02.html:906): 3. 선택값 사용자가 옵션 목록에서 선택한 값을 보여줌

### 사용성 가이드라인

- L[914–914](../../upstream/krds/raw/components/component_10_02.html:914): 사용성 가이드라인
- L[917–917](../../upstream/krds/raw/components/component_10_02.html:917): 옵션 레이블을 명확한 내용으로 제공한다.
- L[918–918](../../upstream/krds/raw/components/component_10_02.html:918): 옵션에 텍스트 레이블 없이 글자 크기만을 보여주는 아이콘만 제공되거나 확대 배율만 표시될 경우 사용자에 따라 이해가 어려울 수 있으므로 설명적인 레이블을 함께 제공해야 한다.
- L[929–929](../../upstream/krds/raw/components/component_10_02.html:929): 옵션을 5개 이내로 제공한다.
- L[930–930](../../upstream/krds/raw/components/component_10_02.html:930): 서비스 특성에 따라 확대/축소 옵션값을 추가하거나 제거할 수 있다. 옵션의 개수가 많아질 수록 인지적 부담이 증가하므로 옵션 개수는 5개 이내로 제공하는 것이 바람직하다.
- L[941–941](../../upstream/krds/raw/components/component_10_02.html:941): 반응형 레이아웃 사용을 고려한다.
- L[942–942](../../upstream/krds/raw/components/component_10_02.html:942): 사용자 에이전트의 확대 기능을 사용하여 화면을 400%까지 확대했을 때, 1920 x 1080 해상도의 모니터를 기준으로 뷰포트 너비가 480px로 줄어들어 모바일 레이아웃으로 전환된다.
- L[943–943](../../upstream/krds/raw/components/component_10_02.html:943): DPR(Device Pixel Ratio)이 2인 고해상도 모니터일 경우, 200%로 확대되었을 때 뷰포트 너비가 480px로 줄어든다.
- L[944–944](../../upstream/krds/raw/components/component_10_02.html:944): 따라서 화면을 확대했을 때 화면에 콘텐츠를 문제 없이 표시하기 위해서는 반응형 레이아웃을 사용하는 것이 용이하다.

### 플랫폼에 대한 고려 사항

- L[952–952](../../upstream/krds/raw/components/component_10_02.html:952): 플랫폼에 대한 고려 사항
- L[955–955](../../upstream/krds/raw/components/component_10_02.html:955): 모바일 애플리케이션에서는 별도 설정 화면에서 화면 크기 조정 기능을 제공할 수 있다.
- L[956–956](../../upstream/krds/raw/components/component_10_02.html:956): 모바일 애플리케이션에서는 ‘화면 크기 조정’ 컴포넌트를 사용하는 대신 사용자에게 익숙한 방식의 설정 화면에서 동등한 기능을 사용할 수 있도록 제공한다.

### 접근성 가이드라인

- L[1063–1063](../../upstream/krds/raw/components/component_10_02.html:1063): 접근성 가이드라인
- L[1066–1066](../../upstream/krds/raw/components/component_10_02.html:1066): 화면 크기를 조정했을 때 콘텐츠가 가려지거나 기능이 손실되지 않도록 한다.
- L[1067–1067](../../upstream/krds/raw/components/component_10_02.html:1067): '화면 크기 조정' 컴포넌트의 제공 목적은 사용자가 문제없이 읽을 수 있는 배율의 콘텐츠를 제공하는 것이므로 기본 크기에서 제공되는 콘텐츠, 기능은 조정된 배율의 화면에서도 문제없이 접근할 수 있어야 한다.
- L[1068–1068](../../upstream/krds/raw/components/component_10_02.html:1068): 조정된 배율의 화면에서 모든 콘텐츠와 기능을 기본 배율과 동일한 방식으로 사용할 수 있도록 해야 하는 것은 아니다. 모바일 레이아웃에서 메인 메뉴가 햄버거 메뉴 형식으로 전환되는 것처럼 콘텐츠와 기능에 대한 접근 방식은 달라질 수 있으나, 내용이 변형되어서는 안 된다.
- L[1075–1075](../../upstream/krds/raw/components/component_10_02.html:1075): 화면을 확대했을 때 화면 스크롤은 단일 방향으로 유지/생성되도록 한다.
- L[1076–1076](../../upstream/krds/raw/components/component_10_02.html:1076): 화면을 확대하여 뷰포트 영역이 좁아졌을 때, 요소의 배열/배치가 조정되지 않아 뷰포트 영역 밖으로 배치되어 스크롤이 생성되면 콘텐츠를 읽을 때 더 많은 노력이 필요하다.
- L[1077–1077](../../upstream/krds/raw/components/component_10_02.html:1077): 단, 이미지, 멀티미디어, 표와 같이 기본적으로 양방향으로 배치되는 특성을 가진 콘텐츠와 모바일 레이아웃에서는 세로, 가로 스크롤이 동시에 사용될 수 있다.

### 상호작용 가이드라인

- L[1088–1088](../../upstream/krds/raw/components/component_10_02.html:1088): 상호작용 가이드라인
- L[1090–1090](../../upstream/krds/raw/components/component_10_02.html:1090): 목록 확장 및 축소
- L[1108–1111](../../upstream/krds/raw/components/component_10_02.html:1108): Click 컨테이너를 Click 했을 때, 옵션 목록이 확장되거나 축소된다. 옵션 목록이 확장된 상태에서 레이블, 컨테이너, 옵션 목록이 아닌 영역을 Click 하면 옵션 목록은 축소되어야 한다.
- L[1112–1115](../../upstream/krds/raw/components/component_10_02.html:1112): Enter, Space 컨테이너에 초점이 있는 경우, 옵션 목록이 확장되거나 축소된다.
- L[1116–1119](../../upstream/krds/raw/components/component_10_02.html:1116): Esc 옵션 목록을 축소하고 컨테이너로 초점이 이동해야 한다.
- L[1126–1126](../../upstream/krds/raw/components/component_10_02.html:1126): 탐색
- L[1144–1147](../../upstream/krds/raw/components/component_10_02.html:1144): Tab, Shift + Tab Tab, Shift + Tab 키를 눌렀을 때 접근할 수 있어야 한다.
- L[1148–1151](../../upstream/krds/raw/components/component_10_02.html:1148): Scroll 옵션 목록에 스크롤이 생성된 경우 목록이 상/하로 이동한다.
- L[1158–1158](../../upstream/krds/raw/components/component_10_02.html:1158): 옵션 선택
- L[1176–1179](../../upstream/krds/raw/components/component_10_02.html:1176): Click 옵션 목록에서 특정 옵션을 Click 하면 해당 옵션으로 선택값이 변경된다.
- L[1180–1183](../../upstream/krds/raw/components/component_10_02.html:1180): Enter 옵션에 초점이 있는 경우, 해당 옵션값이 선택된 후 목록이 축소된다.
- L[1184–1187](../../upstream/krds/raw/components/component_10_02.html:1184): 방향키 ↑, ↓ 컨테이너에 초점이 있고 옵션 목록이 축소된 경우, 이전/다음 옵션으로 선택값이 변경된다.

### 예시

- L[1206–1206](../../upstream/krds/raw/components/component_10_02.html:1206): 예시
- L[1210–1210](../../upstream/krds/raw/components/component_10_02.html:1210): 기본
- L[1243–1243](../../upstream/krds/raw/components/component_10_02.html:1243): 기본 코드 확인하기

### 마크업 가이드

- L[1264–1264](../../upstream/krds/raw/components/component_10_02.html:1264): 마크업 가이드
- L[1267–1267](../../upstream/krds/raw/components/component_10_02.html:1267): CSS 선택자
- L[1287–1295](../../upstream/krds/raw/components/component_10_02.html:1287): 전체영역 .krds-drop-wrap .krds-resize 드롭다운 위치 .drop-left (왼쪽 정렬) .drop-right (오른쪽 정렬)
- L[1296–1299](../../upstream/krds/raw/components/component_10_02.html:1296): 드롭다운 메뉴 전체영역 .drop-menu
- L[1300–1303](../../upstream/krds/raw/components/component_10_02.html:1300): 드롭다운 메뉴 상단 .drop-top
- L[1304–1307](../../upstream/krds/raw/components/component_10_02.html:1304): 드롭다운 메뉴 리스트 .drop-list
- L[1308–1311](../../upstream/krds/raw/components/component_10_02.html:1308): 드롭다운 메뉴 하단 .drop-bottom

보존된 인라인 예시 마크업(참고용이며 공개 네이티브 API 아님): L[1215–1237](../../upstream/krds/raw/components/component_10_02.html:1215)

CSS/JS/가이드 이미지에 대한 출처 참조는 복사된 구현이 아닙니다. 표 행의 원본 HTML(필수/선택 열 보존)은 [source-evidence.json](../../catalog/source-evidence.json)에 보관합니다. 위의 평탄화 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 콜백은 이제 공유 `value` 필드를 구체적으로 씁니다. 정확한 CSS 배율 적용/영속화는 호스트가 맡는 독립 통합으로 남으며, 공식 옵션 개수/맞춤 지침은 바뀌지 않습니다.
- 연결된 외부 코드 예시는 참조만 했고 이번 준비에서 별도 파일로 포함·열람하지 않았습니다: L1248 `../../code/resize.html`. 보지 못한 내용은 추정하지 않습니다.
- 상세에는 가이드 이미지 참조가 6개 있으나, 포함된 픽셀 다이어그램은 시각 검사하지 않았습니다. 텍스트 구조와 지침만 읽었습니다. 정확한 시각 수치와 자산은 이후 시각/출처 검토가 필요합니다.
- 의미 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 자체 구현, 동작/스토리 소스, 독립 인수가 여전히 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `ResizeContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트가 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크의 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 의무입니다.

공식 인용·파생 텍스트는 원래의 KRDS 권리와 출처 표기를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 출처 식별은 그대로입니다. 남은 근거 한계는 검사하지 못한 가이드 픽셀, 연결 코드, 자산 승인에 관한 것이며, 여기 인용한 실질 요구사항을 면제하지 않습니다.
