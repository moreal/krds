# 이미지 {#image}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐입니다. 네이티브 동작, 시각·자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `image`, 한국어 이름 이미지, export `Image`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_04_08](https://www.krds.go.kr/html/site/component/component_04_08.html), 보존본 [HTML](../../upstream/krds/raw/components/component_04_08.html). 수집 `2026-10-29T23:28:03.765Z`, `61894` 바이트, SHA-256 `d09daa56a0c078f1e17db9481324c43bfbf13a39d4b679120dd9d782a2b9f895`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류는 `component`, 수용된 프로젝트 완료 종류도 `component`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 케이스(변형·상태 축)는 `informative`, `decorative`, `complex-description`, `responsive`입니다. 이는 네이티브 케이스 이름입니다. 상태·반응형·외형 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형·예시 헤딩 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

명시적 alt를 가진 네이티브 img를 씁니다. 장식 이미지는 alt=""입니다. 정보 이미지의 대체 텍스트는 간결하고 맥락에 맞아야 합니다. 저작자 표기, 불필요한 “이미지”라는 말, 인접 설명과의 중복, 지어낸 세부 사항은 넣지 않습니다. 복잡한 설명은 가까운 figure/figcaption이나 연결된 설명 콘텐츠로 줄 수 있습니다. 픽셀에 굽힌 텍스트보다 실제 텍스트를 우선합니다.

## 의미 API {#plain-semantic-api}

독립 API입니다. src, alt(필수이며 장식이면 비어도 됨), width/height, srcset/sizes, loading, 선택 caption/descriptionId를 씁니다. 장식 플래그는 alt와 일치해야 합니다. 네이티브 이미지 role 재정의와 클릭 콜백은 없습니다. 클릭 가능한 이미지는 Link/Button과 조합합니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어와 기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 변경 요청 하나를 냅니다. 비활성, 무동작, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

정적 이미지는 탭 정지점을 더하지 않습니다. 링크 조합의 접근 가능한 이름은 목적을 설명합니다. 로드/오류 이벤트는 네이티브 결과를 노출하며, 실제 디코드 전에는 콘텐츠가 로드되었다고 주장하지 않습니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

호스트가 의미 있는 자르기/소스 선택을 제공합니다. 좁은 화면에서도 핵심 정보를 보존합니다. 장식 이미지는 좁은 화면에서 생략할 수 있지만, 정보 콘텐츠에는 동등한 텍스트가 필요합니다. 환경에 맞게 자산 크기를 정합니다. 외부 CDN을 요구하지 않습니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼/리셋/IME 동작은 없습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 로컬이며 출처가 바르게 표시된 자산과 설명을 제공합니다. 완료에는 정보, 장식, 복잡, 이미지 로드 실패 결과가 포함됩니다. 원격 자리표시 이미지는 해당하지 않습니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root (img), figure, caption, description; 관찰될 때 loaded,error.

렌더링된 모든 소유 파트는 `data-krds-component="image"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 씁니다. 네이티브/ARIA 상태가 우선합니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 정보 이미지의 대체 텍스트는 로드 실패 뒤에도 남습니다.
2. 장식 이미지는 불필요한 이름을 만들지 않습니다.
3. 복잡한 설명에 접근할 수 있고 이미지와 연결됩니다.
4. 반응형 자르기가 핵심 정보를 없애지 않습니다.
5. 링크된 이미지는 목적에 맞는 이름을 가집니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색 외 상태 단서, 움직임이 있다면 동작 줄이기를 검증합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`image--informative`, `image--decorative`, `image--complex-description`, `image--responsive`, `image--load-error`.

각 케이스는 해당하는 모든 네이티브 렌더러에서 로컬 args/inputs/slots와 관찰 가능한 순수 로컬 상태가 필요합니다. 렌더러는 Solid 1, React, Svelte, Vue, Lit, Qwik, Angular이며 Solid 2 미리보기는 따로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 별도로 준비됩니다. 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 인수되어야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 상류 siheom 어댑터만 씁니다. Lit과 Solid 2는 siheom 지원을 지어내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름과 대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러/렌더러를 가져와서는 안 됩니다. 다른 프레임워크 렌더러 래퍼는 금지합니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 실제 보존 상세 HTML에서 추출했으며 핵심 지침과 상호작용·마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 출처 언어(한국어)를 그대로 둡니다. “고려/권장/수 있다” 같은 표현은 권고로 남습니다. 예시나 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 출처 JS 함수 표는 참고 근거일 뿐이며 원본 KRDS JS를 네이티브 제어 DOM에서 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 빼면 독립 선택입니다.

### 용례

- L[879–879](../../upstream/krds/raw/components/component_04_08.html:879): 용례
- L[881–881](../../upstream/krds/raw/components/component_04_08.html:881): 사용하기 적합한 경우
- L[886–886](../../upstream/krds/raw/components/component_04_08.html:886): 의료 정보(피부 질환 등)
- L[887–887](../../upstream/krds/raw/components/component_04_08.html:887): 서비스 이용 방법
- L[888–888](../../upstream/krds/raw/components/component_04_08.html:888): 시설 위치
- L[883–890](../../upstream/krds/raw/components/component_04_08.html:883): 사용자에게 정보를 전달하는 데 텍스트보다 이미지가 적합한 경우 의료 정보(피부 질환 등) 서비스 이용 방법 시설 위치
- L[897–897](../../upstream/krds/raw/components/component_04_08.html:897): 텍스트 목록 계층 오류
- L[894–899](../../upstream/krds/raw/components/component_04_08.html:894): 의미가 명확하고 사용자에게 친숙한 아이콘, 이미지, 상징을 활용하게 되면 특히 텍스트를 잘 읽을 수 없거나 난독증이 있는 사용자가 정보를 파악하는 데 도움이 된다. 텍스트 목록 계층 오류
- L[891–901](../../upstream/krds/raw/components/component_04_08.html:891): 사용자에게 정보를 전달하는 데 이미지가 도움 되는 경우 의미가 명확하고 사용자에게 친숙한 아이콘, 이미지, 상징을 활용하게 되면 특히 텍스트를 잘 읽을 수 없거나 난독증이 있는 사용자가 정보를 파악하는 데 도움이 된다. 텍스트 목록 계층 오류
- L[905–905](../../upstream/krds/raw/components/component_04_08.html:905): 이 경우 이미지는 순수하게 장식 용도로 사용된다.
- L[902–907](../../upstream/krds/raw/components/component_04_08.html:902): 이미지를 통해 사용자에게 브랜드에 대한 총체적인 인상이나 재미, 즐거움을 전달하고자 하는 경우 이 경우 이미지는 순수하게 장식 용도로 사용된다.
- L[911–911](../../upstream/krds/raw/components/component_04_08.html:911): 사용하기 적합하지 않은 경우
- L[916–916](../../upstream/krds/raw/components/component_04_08.html:916): 인접한 텍스트와 내용이 일치하지 않거나 의미가 불분명한 이미지 사용, 과도한 이미지 사용은 사용자의 탐색 과정을 방해할 수 있으므로 유의해야 한다.
- L[913–918](../../upstream/krds/raw/components/component_04_08.html:913): 이미지가 정보 이해에 도움이 되지 않거나 화면의 정보 탐색을 방해하는 경우 인접한 텍스트와 내용이 일치하지 않거나 의미가 불분명한 이미지 사용, 과도한 이미지 사용은 사용자의 탐색 과정을 방해할 수 있으므로 유의해야 한다.

### 사용성 가이드라인

- L[926–926](../../upstream/krds/raw/components/component_04_08.html:926): 사용성 가이드라인
- L[929–929](../../upstream/krds/raw/components/component_04_08.html:929): 이미지 콘텐츠를 사용하는 목적에 대해 가장 먼저 정의한다.
- L[930–931](../../upstream/krds/raw/components/component_04_08.html:930): 이미지를 활용하여 사용자에게 전달하고자 하는 것이 무엇인지를 명확하게 정의해야 이에 적합한 스타일의 이미지와 주제를 선택할 수 있다. 이미지는 항상 콘텐츠의 맥락에 맞게 사용해야 한다. 특히 이미지 자체가 링크나 버튼으로 사용되거나 링크, 버튼의 일부로 포함될 경우 링크, 버튼의 용도, 목적, 기능과 일치하는 이미지, 상징을 사용하는 것이 중요하다.
- L[934–934](../../upstream/krds/raw/components/component_04_08.html:934): 이미지에 텍스트를 합성할 때 스타일에 유의한다.
- L[935–936](../../upstream/krds/raw/components/component_04_08.html:935): 이미지 위에 텍스트를 직접 합성하게 되면 해상도 문제로 인해 텍스트의 가독성이 저하될 수 있다. 텍스트에 그림자를 제공하거나 텍스트 영역에 별도의 배경을 적용하여 다양한 해상도에서 텍스트를 잘 읽을 수 있는지 테스트해야 한다. 가장 바람직한 방법은 배경 이미지와 텍스트를 구분하고 텍스트를 마크업으로 제공하는 것이다. 화면 크기가 변경되더라도 손실 없이 정보를 확인할 수 있으며 필요한 경우 사용자는 텍스트의 색상을 원하는 대로 조정할 수 있다.
- L[939–939](../../upstream/krds/raw/components/component_04_08.html:939): 이미지에 대체 텍스트 또는 설명을 제공한다.
- L[940–944](../../upstream/krds/raw/components/component_04_08.html:940): 정보를 전달하는 목적의 이미지에는 alt 속성을 활용하여 대체 텍스트를 제공하거나 이미지 전·후에 설명을 제공해야 한다. alt 속성으로 제공된 대체 텍스트는 스크린 리더 사용자에게 음성 정보로 변환되어 전달된다. 또한 어떠한 문제로 인해 이미지가 표시되지 못하는 경우에 이미지의 자리에 시각적으로 표시되어 정보를 유추할 수 있게 도와주므로 매우 중요하다. 이미지에 대체 텍스트 또는 설명을 제공하는 방법에 대해서는 접근성 체크리스트를 참조하면 된다.

### 플랫폼에 대한 고려 사항

- L[952–952](../../upstream/krds/raw/components/component_04_08.html:952): 플랫폼에 대한 고려 사항
- L[955–955](../../upstream/krds/raw/components/component_04_08.html:955): 사용자의 화면 크기, 접속 환경을 고려하여 이미지 계획을 수립한다.
- L[956–957](../../upstream/krds/raw/components/component_04_08.html:956): 과도한 이미지 사용은 화면 로딩 속도를 증가시키고 사용자가 스크롤 동작을 반복하도록 하여 정보 탐색의 효율성을 저하시킨다. 이는 특히 화면의 뷰포트 영역이 제한적인 모바일 디바이스에서 더 심각한 문제를 야기할 수 있다. 화면 너비가 충분하지 않아 모바일 레이아웃으로 전환할 때에는, 이미지가 사용자에게 의미가 있는지를 판단하여 이미지를 제거하는 방안을 고려해야 한다. 그런 다음, 남은 이미지는 크기를 조정하거나 적절하게 크롭하여 화면에 최적화될 수 있도록 만든다.

### 접근성 가이드라인

- L[1064–1064](../../upstream/krds/raw/components/component_04_08.html:1064): 접근성 가이드라인
- L[1067–1067](../../upstream/krds/raw/components/component_04_08.html:1067): 장식용 이미지를 제외한 모든 이미지에 대체 텍스트를 제공한다.
- L[1068–1068](../../upstream/krds/raw/components/component_04_08.html:1068): 대체 텍스트는 이미지가 제공하는 정보를 구체적이고 정확하면서도 간결한 내용으로 제공해야 한다. 이때, 대체 텍스트에 다음 내용이 포함되지 않도록 유의한다.
- L[1070–1070](../../upstream/krds/raw/components/component_04_08.html:1070): 사진가 또는 이미지를 만든 사람의 정보
- L[1071–1071](../../upstream/krds/raw/components/component_04_08.html:1071): '이미지', '그래픽'과 같이 요소의 역할과 중복되는 텍스트
- L[1072–1072](../../upstream/krds/raw/components/component_04_08.html:1072): 이미지와 인접한 텍스트 설명과 동일한 설명
- L[1073–1073](../../upstream/krds/raw/components/component_04_08.html:1073): 이미지에 없는 추가적인 정보
- L[1081–1081](../../upstream/krds/raw/components/component_04_08.html:1081): 가능한 한 이미지 텍스트를 사용하지 않는다.
- L[1082–1083](../../upstream/krds/raw/components/component_04_08.html:1082): 텍스트 정보를 이미지 형식으로 제공하게 되면 사용자가 해상도 손실 없이 텍스트를 확대/축소할 수 없으며 명도 대비, 자간 동의 표현을 상황에 맞게 조정할 수 없게 된다. 저시력 사용자, 읽기 장애가 있는 사용자가 텍스트 정보의 표현 방식을 변경하여 콘텐츠를 인지할 수 있도록 심미적인 효과 또는 특정한 텍스트 표현이 필수적인 경우를 제외하고 이미지 텍스트를 사용하지 않아야 한다.

### 상호작용 가이드라인

- L[1094–1094](../../upstream/krds/raw/components/component_04_08.html:1094): 상호작용 가이드라인

보존된 인라인 예시 마크업(참고용이며 공개 네이티브 API가 아님): 이 상세에는 인라인 샘플 뷰 마크업이 없습니다.

CSS/JS/안내 이미지 출처 참조는 복사한 구현이 아닙니다. 표 행의 필수/선택 열을 보존한 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화된 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 고정된 Image 페이지에는 실질적인 코드/선택자 예시나 상호작용 요구사항이 없습니다. 제안한 네이티브 이미지 API는 독립 설계입니다.
- 의미 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작/스토리 소스, 독립 인수가 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `ImageContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트는 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼로는 이 계약을 충족할 수 없습니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에 인용·파생된 공식 텍스트는 원래의 KRDS 권리와 출처 표시를 유지합니다. 독립 코드의 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 검사하지 않은 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며, 여기 인용한 실질 요구사항을 면제하지 않습니다.
