# 숨긴 콘텐츠 {#visually-hidden}

**계약 상태: 네이티브 구현용으로 범위 승인됨.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 승인일 뿐이며, 네이티브 동작, 시각/자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `visually-hidden`, 한국어 이름 숨긴 콘텐츠, export `VisuallyHidden`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_11_02](https://www.krds.go.kr/html/site/component/component_11_02.html), 보존된 [HTML](../../upstream/krds/raw/components/component_11_02.html). 조회 시각 `2026-10-29T23:28:05.828Z`, `59345` 바이트, SHA-256 `85084e384fe08830d57e655107833ede6044760d3e4c83f20dc54ddd0c5488c6`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류는 `component`, 인수된 프로젝트 완료 종류도 `component`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 사례(변형·상태 축): `text`, `interactive-overlay`, `aria-association`. 이는 네이티브 사례 이름입니다. 상태, 반응형, 외관 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형/예시 헤딩 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

의미 있는 콘텐츠를 접근성 트리에 보존하는 텍스트 숨김 프리미티브와, 보이는 대체 요소의 기하와 일치하는 별도의 대화형 오버레이 패턴을 둡니다. display:none/visibility:hidden, 크기가 0인 텍스트/글꼴 크기 0 텍스트, 화면 밖으로 옮긴 초점 대상은 절대 쓰지 않습니다. 네이티브 시맨틱과 보이는 정보를 먼저 선택합니다.

## 의미 API {#plain-semantic-api}

독립 API: VisuallyHidden은 기본적으로 id/lang/콘텐츠를 가진 span을 렌더링하며, text 변형은 0이 아닌 클리핑 스타일을 씁니다. interactive-overlay 변형에는 보이는 표현 위에 같은 크기, opacity/z-index, 보이는 대체 초점 윤곽선을 가진 실제 네이티브 자식 컨트롤이 필요합니다. ARIA 관계 모드는 숨은 중복 이름을 추가하지 않고 실제 ID/속성을 씁니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어 값과 기본값을 함께 주거나 mode를 바꾸는 것은 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청을 한 번 내보냅니다. disabled, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI/초점 상태를 유지하고, 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하며 제어 prop이 계속 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

텍스트 프리미티브에는 탭 정지점이나 키 동작이 없습니다. 대화형 자식은 네이티브 키보드 동작을 유지하고 실제 위치에 보이는 초점 표시를 둡니다. 초점 가능한 컨트롤에는 1px 텍스트 클리핑 스타일을 적용하지 않습니다. 스크린 리더 가상 커서 기하는 수동으로 테스트합니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

반응형 레이아웃/확대에서 오버레이 정렬을 유지하고, 서비스 언어가 바뀌면 숨긴 텍스트도 번역합니다. 출처에 명시된 데스크톱 조합뿐 아니라 모바일 VoiceOver/TalkBack도 테스트합니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

숨긴 콘텐츠 자체에는 폼 값이 없습니다. 위에 겹친 네이티브 입력은 이를 소비하는 컨트롤의 name/value/리셋/IME 규칙을 모두 유지합니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

의미 있는 설명과 번역은 호스트가 소유합니다. 이 프리미티브는 올바른 네이티브 시맨틱이나 보편적인 이름 결정을 대체하지 않습니다. 완료에는 텍스트의 접근성 트리 증명과 대화형 기하/수동 보조 기술 근거가 포함됩니다. 테스트하지 않은 CSS 클래스만으로는 부족합니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, overlay-control, visible-surrogate; text,interactive-overlay,focus-visible.

렌더링되는 모든 소유 파트는 `data-krds-component="visually-hidden"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위의 파트/상태 어휘는 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 텍스트는 시각적으로 없어도 접근성 트리에 남습니다.
2. 크기 0 또는 display-none 구현이 없습니다.
3. 네이티브 자식의 초점 윤곽선이 보이는 대체 요소와 정렬됩니다.
4. 확대/리플로우가 가상 커서 기하를 보존합니다.
5. 언어 갱신이 숨긴 콘텐츠를 번역합니다.
6. 음성으로 읽히는 레이블이 중복되지 않습니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 표시, 움직임이 있는 곳의 동작 줄이기를 검증합니다. 빈 스위트를 성공으로 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`visually-hidden--text`, `visually-hidden--aria-association`, `visually-hidden--interactive-overlay`, `visually-hidden--zoom`, `visually-hidden--translated`, `visually-hidden--manual-at`.

각 사례에는 해당하는 모든 네이티브 렌더러(Solid 1, React, Svelte, Vue, Lit, Qwik, Angular)에서 로컬 args/inputs/slots와 관찰 가능한 순수 로컬 상태가 필요합니다. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 따로 마련되며 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부를 인수해야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 사용합니다. Lit/Solid 2는 siheom 지원을 만들지 않고 선택된 네이티브 테스트 경로를 사용해야 합니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름/대상 관계를 검증해야 합니다. Solid 2는 Solid 1 컴파일러/렌더러를 import하면 안 됩니다. 다른 렌더러의 래퍼는 쓰지 않습니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 실제 보존된 상세 HTML에서 추출했으며 핵심 지침과 상호작용/마크업 표를 포함합니다. 공식 요구사항을 만들어 내지 않도록 원문 언어를 그대로 둡니다. “consider/recommended/can”에 해당하는 표현은 권고로 남습니다. 예시/CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 출처 JS 함수 표는 참고 근거일 뿐이며 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 아래 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립적인 선택입니다.


### 용례

- L[857–857](../../upstream/krds/raw/components/component_11_02.html:857): 용례
- L[859–859](../../upstream/krds/raw/components/component_11_02.html:859): 사용하기 적합한 경우
- L[861–861](../../upstream/krds/raw/components/component_11_02.html:861): 텍스트가 아닌 콘텐츠에 대한 복잡한 설명을 제공하는 경우
- L[862–862](../../upstream/krds/raw/components/component_11_02.html:862): 지시 사항을 전달하거나 조작 방식을 설명하는 경우
- L[863–863](../../upstream/krds/raw/components/component_11_02.html:863): 요소나 화면의 상태 변화에 대한 정보를 전달하는 경우
- L[867–867](../../upstream/krds/raw/components/component_11_02.html:867): 사용하기 적합하지 않은 경우
- L[869–869](../../upstream/krds/raw/components/component_11_02.html:869): 전달하는 정보가 간결한 이미지 콘텐츠
- L[870–870](../../upstream/krds/raw/components/component_11_02.html:870): 요소에 접근 가능한 이름을 전달하고자 하는 경우

### 유형

- L[878–878](../../upstream/krds/raw/components/component_11_02.html:878): 유형
- L[880–880](../../upstream/krds/raw/components/component_11_02.html:880): WAI-ARIA 표준을 사용하는 콘텐츠
- L[881–881](../../upstream/krds/raw/components/component_11_02.html:881): WAI-ARIA 속성을 사용하여 숨긴 콘텐츠를 구현할 수 있다. 예를 들어, aria-label, aria-describedby, aria-labelledby 등의 속성을 적절히 활용하여 스크린 리더 사용자가 정보를 충분히 인지할 수 있도록 해야 한다.
- L[884–884](../../upstream/krds/raw/components/component_11_02.html:884): 전용 스타일을 적용한 텍스트 콘텐츠
- L[885–885](../../upstream/krds/raw/components/component_11_02.html:885): 전용 스타일을 적용하여 콘텐츠를 시각적으로 숨길 수 있다. 다음과 같은 CSS를 사용하면 화면에는 시각적으로 표시되지 않지만 스크린 리더에는 노출할 수 있다.
- L[895–895](../../upstream/krds/raw/components/component_11_02.html:895): 전용 스타일을 적용한 대화형 요소
- L[896–896](../../upstream/krds/raw/components/component_11_02.html:896): 모바일 등 특정 디바이스에서 대화형 요소를 시각적으로 숨길 때, 스크린 리더의 가상 커서 위치가 정확하게 표시되도록 하는 스타일이다. 아래 코드를 적용하더라도 부모 요소의 레이아웃 특성에 따라 가상 커서 위치가 달라질 수 있으므로, 반드시 스크린 리더로 테스트해야 한다.

### 사용성 가이드라인

- L[910–910](../../upstream/krds/raw/components/component_11_02.html:910): 사용성 가이드라인
- L[913–913](../../upstream/krds/raw/components/component_11_02.html:913): 숨긴 콘텐츠를 사용하는 대신 주변 정보를 활용하거나 시각으로 정보를 표시하는 방안을 우선 고려한다.
- L[914–915](../../upstream/krds/raw/components/component_11_02.html:914): 숨김 콘텐츠를 필요로 하는 사용자 중 다수는 스크린 리더가 낭독하는 음성 정보와 화면에 표시된 시각 정보를 함께 확인한다. 따라서 콘텐츠는 누구나 확인할 수 있도록 시각적으로 표시하는 것이 바람직하며, 부가적으로 설명이 필요한 경우나 텍스트가 아닌 콘텐츠에 대한 설명이 필요한 경우에만 숨긴 텍스트를 제공하는 것이 바람직하다.
- L[918–918](../../upstream/krds/raw/components/component_11_02.html:918): 시맨틱 마크업을 한다.
- L[919–920](../../upstream/krds/raw/components/component_11_02.html:919): 정보의 의미/역할에 적합한 태그를 사용하게 되면 별도의 설명을 제공하지 않아도 스크린 리더는 해당 요소가 전달하고자 하는 정보의 특성(예 - 표, 목록, 제목 등)을 사용자에게 전달할 수 있다. 또한 대부분의 스크린 리더는 주요 태그별로 탐색할 수 있는 단축키가 지정되어 있거나, 단위별 탐색 기능을 지원하므로 사용자는 보다 효과적으로 화면 내 정보를 탐색할 수 있게 된다.
- L[923–923](../../upstream/krds/raw/components/component_11_02.html:923): 숨긴 콘텐츠에 스크린 리더가 정보를 탐지하는 것을 방지하는 스타일을 사용하지 않는다.
- L[924–925](../../upstream/krds/raw/components/component_11_02.html:924): CSS의 visibility:hidden, display:none 속성은 적용된 요소를 표시할 화면의 시각적 플로에서 제거하기 때문에 스크린 리더를 사용하지 않는 사용자도 해당 요소를 볼 수 없으며 스크린 리더는 이를 무시한다. 따라서 숨긴 텍스트는 코드 예제를 참조하여 적절한 시각적 숨김 스타일을 적용해야 하며, visibility:hidden 또는 display:none이 사용되어서는 안 된다.
- L[928–928](../../upstream/krds/raw/components/component_11_02.html:928): 숨긴 콘텐츠의 크기 지정에 유의한다.
- L[929–929](../../upstream/krds/raw/components/component_11_02.html:929): width:0, height:0, font-size:0, line-height:0과 같은 스타일이 적용되었을 때, 정보가 어떤 태그로 마크업되었는지, 어떤 스크린 리더를 사용하는지에 따라 정보가 무시될 수 있으므로 사용하지 않아야 한다.
- L[932–932](../../upstream/krds/raw/components/component_11_02.html:932): 대화형 요소를 숨길 때 상대적 위치 지정에 유의한다.
- L[933–934](../../upstream/krds/raw/components/component_11_02.html:933): &lt;label&gt;, &lt;input&gt;과 같은 대화형 요소에 text-indent, top, left 등의 스타일 속성을 사용하여, 대화형 요소가 본래 배치되어야 할 영역을 벗어난 곳으로 이동하게 되면 요소에 키보드가 접근하거나 스크린 리더의 가상 초점이 접근했을 때 포커스링을 확인할 수 없게 된다. 별도의 값을 지정하는 대신 top, left 스타일 속성값이 auto로 유지되도록 해야 한다.
- L[937–937](../../upstream/krds/raw/components/component_11_02.html:937): 대화형 요소를 숨길 때 크기 지정에 유의한다.
- L[938–939](../../upstream/krds/raw/components/component_11_02.html:938): 대화형 요소를 숨기기 위해 높이와 너비를 1px로 지정하게 되면 키보드가 접근하거나 스크린 리더의 가상 초점이 접근했을 때 포커스링을 확인할 수 없게 된다. 대화형 요소를 시각적으로 숨길 때는 시각적으로 표시할 대체 요소의 크기와 숨겨진 대화형 요소의 크기를 같게 유지하고 z-index, opacity 스타일 속성을 사용하여 숨겨야 한다. 또한 키보드 사용자가 포커스링을 확인할 수 있도록 별도의 outline 속성을 제공해야 한다.
- L[942–942](../../upstream/krds/raw/components/component_11_02.html:942): 서비스 제공 언어를 변경할 때 숨긴 콘텐츠에 포함된 텍스트의 언어도 변경되도록 한다.
- L[943–943](../../upstream/krds/raw/components/component_11_02.html:943): 숨긴 콘텐츠는 화면에 표시되지 않기 때문에 서비스 제공 언어를 번역하는 과정에서 놓치기 쉽고, 콘텐츠를 검토하는 과정에서도 문제가 있음을 발견하기 어렵다.
- L[946–946](../../upstream/krds/raw/components/component_11_02.html:946): 텍스트 편집기에 숨긴 콘텐츠를 제공할 수 있는 옵션을 제공한다.
- L[947–947](../../upstream/krds/raw/components/component_11_02.html:947): 서비스 내·외부 사용자가 콘텐츠를 작성할 때, 스크린 리더 사용자를 위한 부가 설명을 제공할 수 있도록 숨긴 콘텐츠를 작성할 수 있는 입력란을 제공하거나 관련 기능을 제공하는 텍스트 편집기를 채택하는 것이 좋다.
- L[950–950](../../upstream/krds/raw/components/component_11_02.html:950): 스크린 리더 테스트를 수행한다.
- L[951–952](../../upstream/krds/raw/components/component_11_02.html:951): 사용자 에이전트, 스크린 리더는 주기적으로 업데이트되기 때문에 숨긴 콘텐츠가 호환되지 않을 수 있다. 따라서 정기적인 스크린 리더 테스트를 거쳐 숨긴 콘텐츠가 제대로 작동하고 있는지 확인해야 한다. 다양한 스크린 리더(예 - SenseReader, VoiceOver, TalkBack)와 브라우저(예 - Chrome, Edge, Safari) 조합에서 테스트를 수행해 호환성을 보장해야 한다.


인라인으로 보존된 예시 마크업(참고용이며 공개 네이티브 API가 아님): 이 상세에는 인라인 샘플 뷰 마크업이 없습니다.

CSS/JS/안내 이미지의 출처 참조는 복사된 구현이 아닙니다. 필수/선택 열을 보존한 표 행의 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화된 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 기록된 독립 결정: 텍스트 프리미티브는 설명 콘텐츠를 노출할 뿐 보편적인 접근 가능한 이름 생성기가 아닙니다. aria-association 모드에서는 이를 소비하는 네이티브 컨트롤이 같은 루트의 실제 aria-labelledby/aria-describedby 관계와 대상 ID를 소유하며, 프리미티브는 중복된 숨은 레이블을 추가하지 않습니다. 텍스트 클리핑은 초점 가능한 네이티브 컨트롤에 절대 적용하면 안 됩니다. 이 명시적 범위는 만능 이름 부여 방식을 만들어 내지 않고 인용된 두 출처 진술을 모두 보존합니다.
- 연결된 외부 코드 예시는 참조만 하며 이번 준비에서 별도 파일로 포함하거나 읽지 않았습니다: L889 `./code/hidden_text.html`, L900 `./code/hidden_control.html`. 보지 못한 내용을 추론하지 않습니다.
- 시맨틱 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작/스토리 소스, 독립 인수가 필요합니다.

## 수용된 독립 결정 {#accepted-independent-resolution}

텍스트 프리미티브는 설명 콘텐츠를 노출할 뿐 보편적인 접근 가능한 이름 생성기가 아닙니다. aria-association 모드에서는 이를 소비하는 네이티브 컨트롤이 같은 루트의 실제 aria-labelledby/aria-describedby 관계와 대상 ID를 소유하며, 프리미티브는 중복된 숨은 레이블을 추가하지 않습니다. 텍스트 클리핑은 초점 가능한 네이티브 컨트롤에 절대 적용하면 안 됩니다. 이 명시적 범위는 만능 이름 부여 방식을 만들어 내지 않고 인용된 두 출처 진술을 모두 보존합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 시맨틱 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `VisuallyHiddenContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트는 지원 사례 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에서 인용하거나 파생한 공식 텍스트는 원래의 KRDS 권리와 출처 표기를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며 여기 인용한 실질 요구사항을 면제하지 않습니다.
