# 접근 가능한 미디어 {#accessible-media}

**계약 상태: 네이티브 구현용으로 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 승인일 뿐입니다. 네이티브 동작, 시각·자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `accessible-media`, 한국어 이름 접근 가능한 미디어, export `AccessibleMedia`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_11_01](https://www.krds.go.kr/html/site/component/component_11_01.html). 보존 [HTML](../../upstream/krds/raw/components/component_11_01.html). 조회 시각 `2026-10-29T23:28:05.761Z`, `61119` 바이트, SHA-256 `a90a3417fbb1aed59066915d4ad4f556f058aadcff4b914a97d1c9671b43eda1`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 별개입니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 원천 종류 `composition`, 수용된 프로젝트 완료 종류 `composition`. 조합으로 유지합니다. 공식 L862–895가 여러 콘텐츠·대체 형식을 정의하므로, 완료는 범용 래퍼가 아니라 실제 미디어와 대체 콘텐츠의 결합입니다.

지원하는 네이티브 케이스(변형·상태 축): `audio`, `silent-video`, `multimedia`, `captions`, `description`, `transcript`, `sign-language`. 이는 네이티브 케이스 이름입니다. 상태·반응형·외형 축이 곧 공식 명명 변형은 아닙니다. 공식 유형·예시 제목은 근거 부록에 그대로 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

시맨틱 오디오/비디오와, 인접한 레이블 있는 대체 정보 영역·링크로 구성합니다. 오디오는 캡션 또는 단순 원고가 필요합니다. 소리 없는 시각 비디오는 화면 해설 또는 설명적 원고가 필요합니다. 시청각 콘텐츠는 복잡도에 따라 대체 정보를 복합 제공해야 합니다. 캡션은 의미 있는 발화·소리·화자를 동기화해 표시하며 번역 자막만으로는 부족합니다.

## 의미 API {#plain-semantic-api}

독립 API: media {kind,src,type,poster?}, captionTracks {src,lang,label}[], transcript {content|href}, descriptionTrack?, signLanguageSource?, title. 네이티브 controls=true, autoplay=false를 제안합니다. 원고 슬롯만으로 임의의 미디어가 접근 가능해진다고 주장하지 않습니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 정의된 value/open은 제어 모드이고 undefined는 비제어 모드입니다. 제어 prop과 기본값을 함께 주거나 모드를 바꾸면 잘못된 구성입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 시맨틱 변경 요청을 한 번 내보냅니다. 비활성, 변화 없음, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 모드에서 거부되면 커밋된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 우선합니다. 추가 필드로 렌더러·머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

네이티브 미디어 키보드 컨트롤이 초점을 유지합니다. 대체 원고 링크·버튼은 표준 시맨틱을 씁니다. 접근할 수 없는 사용자 정의 플레이어 단축키를 도입하지 않습니다. 화면 해설 트랙 전환을 제공한다면 상태를 명시하며 자동 재생하지 않습니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

캡션은 가려지지 않고 충분한 대비로 읽을 수 있으며 동기화되어야 합니다. 플레이어가 지원하면 캡션 사용자 설정을 허용합니다. 로컬 반응형 비디오는 의미 있는 정보를 자르지 않고 가로세로 비율을 유지합니다. 원고는 선택 가능하고 리플로우됩니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼·리셋·IME 동작은 없습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트·콘텐츠 제작자가 완전하고 정확하며 동기화된 캡션, 화면 해설, 원고, 수어를 소유하고 미디어와 함께 갱신합니다. 완료에는 로컬에서 재생 가능한 라이선스 샘플, 실제 VTT·대체 콘텐츠, 키보드 컨트롤, 수동 타이밍·내용 검토가 필요합니다. 빈 미디어 래퍼는 완료가 아닙니다. 외부 비디오·텔레메트리 플레이어는 쓰지 않습니다.

## 고정 파트와 상태 {#stable-parts-and-states}

파트: root, media, caption-track, alternatives, transcript, description, sign-language. 상태: playing,paused,ended,error (네이티브 상태에 한함).

렌더링되는 모든 소유 파트는 `data-krds-component="accessible-media"`, 하나의 `data-krds-part` 토큰, 공백으로 구분된 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 우선합니다. 위 문장의 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 로컬 오디오에 일치하고 쓸 수 있는 원고가 있다.
2. 소리 없는 비디오가 핵심 시각 정보를 설명한다.
3. 멀티미디어 캡션이 올바른 시점에 화자와 의미 있는 소리를 포함한다.
4. 키보드로 일시정지하고 대체 정보를 열 수 있다.
5. 좁은 화면·확대에서도 캡션이 가려지지 않는다.
6. 미디어를 갱신하면 대체 콘텐츠 갱신 검토가 필요하다.

이 항목은 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색 이외의 상태 단서, 움직임이 있는 곳의 동작 줄이기를 확인합니다. 빈 스위트를 성공으로 주장하지 않습니다.

## 독립 로컬 표본 정책 {#independent-local-specimen-policy}

로컬 표본에서 인접한 대체 정보 영역의 이름은 제공된 미디어 제목을 써서 “{title} 대체 정보”입니다. 이로써 여러 미디어 인스턴스를 구분합니다. 새 제목을 만들거나 필수 대체 콘텐츠를 바꾸지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`accessible-media--audio`, `accessible-media--silent-video`, `accessible-media--multimedia-captions`, `accessible-media--description`, `accessible-media--transcript`, `accessible-media--sign-language`, `accessible-media--load-error`.

각 케이스는 해당하는 모든 네이티브 렌더러에서 로컬 args/inputs/slots와 관찰 가능한 순수 로컬 상태를 가져야 합니다. 대상은 Solid 1, React, Svelte, Vue, Lit, Qwik, Angular이며 Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 단계별로 따로 있으며 현재 파일럿 러너의 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 수용되어야 합니다. 동작 스위트는 스토리 파일과 분리하며 지원되는 upstream siheom 어댑터만 씁니다. Lit과 Solid 2는 선택된 네이티브 테스트 경로를 쓰며 siheom 지원을 만들어 내지 않습니다. Qwik은 첫 lazy 이벤트를 테스트합니다. Angular의 폼 컨트롤은 CVA·리셋과 partial APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러·렌더러를 가져오면 안 됩니다. 다른 렌더러의 래퍼는 쓰지 않습니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 실제 보존된 상세 HTML에서 가져왔으며 핵심 지침과 상호작용·마크업 표를 포함합니다. 공식 요구사항을 만들어 내지 않도록 원문 언어를 유지합니다. “고려/권장/가능” 같은 표현은 권고로 남습니다. 예시와 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원문 JS 함수 표는 참고 근거일 뿐이며 원본 KRDS JS는 네이티브가 제어하는 DOM에서 실행하면 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립적 선택입니다.


### 유형

- L[858–858](../../upstream/krds/raw/components/component_11_01.html:858): 유형
- L[860–860](../../upstream/krds/raw/components/component_11_01.html:860): 콘텐츠
- L[862–862](../../upstream/krds/raw/components/component_11_01.html:862): 오디오 콘텐츠
- L[863–863](../../upstream/krds/raw/components/component_11_01.html:863): 청각적 정보만으로 구성된 미디어 콘텐츠이다. 만약 비디오가 포함되었다고 하더라도 해당 비디오가 단순 커버 이미지인 경우, 오디오 콘텐츠로 간주한다. 캡션 또는 단순 원고(Simple transcripts)를 대체 정보로 제공해야 한다.
- L[866–866](../../upstream/krds/raw/components/component_11_01.html:866): 비디오 콘텐츠
- L[867–867](../../upstream/krds/raw/components/component_11_01.html:867): 소리 없이 화면만으로 구성된 미디어 콘텐츠이다. 만약 오디오가 포함되었다고 하더라도 단순 배경음인 경우, 비디오 콘텐츠로 간주한다. 화면 해설 또는 설명적 원고를 대체 정보로 제공해야 한다.
- L[870–870](../../upstream/krds/raw/components/component_11_01.html:870): 멀티미디어 콘텐츠
- L[871–871](../../upstream/krds/raw/components/component_11_01.html:871): 오디오, 비디오를 모두 포함한 미디어 콘텐츠이다. 콘텐츠의 복잡성, 중요도에 따라 여러 가지 대체 정보를 복합적으로 제공해야 한다.
- L[876–876](../../upstream/krds/raw/components/component_11_01.html:876): 대체 정보
- L[878–878](../../upstream/krds/raw/components/component_11_01.html:878): 캡션(Captions)
- L[879–880](../../upstream/krds/raw/components/component_11_01.html:879): 대화, 내레이션, 음향 효과와 같이 콘텐츠에 포함된 의미 있는 청각적 정보를 텍스트로 표시한 것으로, 정보의 출현 시점과 동기화하여 제공한다. 캡션은 청각 장애인, 난청인을 위한 대체 정보이며, 주변 환경이 소란스럽거나 일시적으로 소리를 사용할 수 없는 환경에서 유용하게 활용할 수 있다.
- L[881–881](../../upstream/krds/raw/components/component_11_01.html:881): 등장인물의 음성, 화면에 표시된 외국어 텍스트를 번역하여 표시하는 자막(Subtitles)과는 다르게 캡션은 누가 말하고 있는지(등장인물이 2명 이상인 경우), 어떤 효과음이 재생되고 있는지(효과음에 중요한 의미가 있는 경우)에 대한 정보를 포함해야 한다.
- L[884–884](../../upstream/krds/raw/components/component_11_01.html:884): 화면 해설(Description)
- L[885–886](../../upstream/krds/raw/components/component_11_01.html:885): 화면 해설은 시각 장애인, 시력이 낮은 사용자에게 필요한 대체 정보이다. 비디오 또는 멀티미디어 콘텐츠의 시각적 정보에 대한 정보를 제공하는 것으로 텍스트, 오디오, 비디오 형태를 사용할 수 있다. 비디오 해설은 해설이 필요한 미디어에 음성 설명을 포함하여 제작한 별도의 비디오 파일이다. 오디오 해설, 텍스트 해설은 모든 사용자가 동일한 비디오 콘텐츠를 사용한다. 오디오 해설은 사용자 선택에 따라 비디오의 기본 오디오 트랙과 해설용 오디오 트랙 재생이 전환된다. 텍스트 해설은 해설이 필요한 시간을 명시하여 별개의 텍스트 파일로 제공된다.
- L[889–889](../../upstream/krds/raw/components/component_11_01.html:889): 설명적 원고(Descriptive transcripts)
- L[890–890](../../upstream/krds/raw/components/component_11_01.html:890): 설명적 원고는 시각적 정보와 더불어 청각적 정보에 대한 상세한 설명을 하나의 원고로 제공하므로 시각 장애인과 청각 장애인 모두 사용할 수 있는 대체 정보다.
- L[893–893](../../upstream/krds/raw/components/component_11_01.html:893): 수어(Sign language)
- L[894–895](../../upstream/krds/raw/components/component_11_01.html:894): 수어는 수어 표준에 따라 콘텐츠에 포함된 청각 정보를 설명하는 대체 콘텐츠이다. 청각 장애인 사용자 중 일부는 수어가 모국어이며 텍스트로 작성된 콘텐츠 이해에 어려움을 겪는다. 모든 사용자가 반드시 확인해야 하는 중요한 정보가 멀티미디어 형식으로 제공된다면, 수어를 대체 콘텐츠로 제공하는 방안을 고려해야 한다.

### 사용성 가이드라인

- L[904–904](../../upstream/krds/raw/components/component_11_01.html:904): 사용성 가이드라인
- L[907–907](../../upstream/krds/raw/components/component_11_01.html:907): 미디어 콘텐츠를 제작하기 전에 대체 정보 제공에 대한 계획을 수립한다.
- L[908–909](../../upstream/krds/raw/components/component_11_01.html:908): 대체 정보를 제작하는 데 시간과 비용이 투입되기 때문에 콘텐츠를 제작하는 단계에서 대체 정보 제공 방식과 제작 방식을 함께 계획하는 것이 좋다. 대체 정보를 자체적으로 제작해야 한다면, 미디어 콘텐츠 제작 과정에서 사용한 녹화용 대본, 대사집 등의 자료를 활용하여 대체 정보를 제작하는 데 소요되는 시간을 줄일 수 있다.
- L[912–912](../../upstream/krds/raw/components/component_11_01.html:912): 가능한 다양한 유형의 대체 정보를 제공한다.
- L[913–913](../../upstream/krds/raw/components/component_11_01.html:913): 콘텐츠 유형별로 제공되어야 하는 대체 정보가 다르며, 대체 정보의 유형별로 사용할 수 있는 사용자가 다르다. 여러 방식을 사용하기 어렵다면 가능한 많은 사용자가 사용할 수 있는 설명적 원고를 제공한다.
- L[916–916](../../upstream/krds/raw/components/component_11_01.html:916): 대체 정보는 미디어에 포함된 모든 정보를 설명해야 한다.
- L[917–918](../../upstream/krds/raw/components/component_11_01.html:917): 미디어 콘텐츠의 대체 정보는 콘텐츠가 전달하는 정보를 동등한 수준으로 전달할 수 있도록 제작해야 한다. 예를 들어, 화면에 표시된 정보의 위치나 배열 정보가 중요하다면 시각에 대한 대체 정보에 포함해야 한다. 장면에는 표시되지 않았지만 청중이 박수를 치고 있음을 알려주는 오디오가 있다면 이를 청각 대체 정보에 포함해야 한다.
- L[929–929](../../upstream/krds/raw/components/component_11_01.html:929): 정보를 전달하기 위한 목적의 시각적 요소를 삽입할 때 명도 대비에 유의한다.
- L[930–931](../../upstream/krds/raw/components/component_11_01.html:930): 이미지화된 텍스트는 사용자가 직접 텍스트 색상을 조정할 수 없기 때문에 비디오, 멀티미디어 콘텐츠를 제작할 때 명도 대비 기준을 준수하는 것이 특히 중요하다. 장식 용도의 요소, 오디오로 설명이 제공되고 있는 정보를 제외한 시각적 정보는 인접한 배경과 가능한 4.5:1 이상의 명도 대비를 갖도록 표현한다.
- L[934–934](../../upstream/krds/raw/components/component_11_01.html:934): 자막은 주변 요소에 가려지거나 흐리게 표시되어서는 안 된다.
- L[935–936](../../upstream/krds/raw/components/component_11_01.html:935): 자막이 가려지면 사용자들은 중요한 정보를 놓칠 수 있다. 자막을 화면의 중요한 시각적 요소와 겹치지 않도록 배치하고, 필요한 경우 자막의 위치를 조정한다. 또한 배경과의 충분한 명도 대비 확보를 위해 자막 텍스트에 윤곽선을 표시하거나 반투명한 검은색 배경을 추가하는 것이 좋다. 가능한 경우, 사용자가 자막의 크기, 색상, 위치를 조정할 수 있는 옵션을 제공하면 대체 정보가 필요한 사용자의 편의성을 높일 수 있다.
- L[952–952](../../upstream/krds/raw/components/component_11_01.html:952): 자막은 오디오와 동기화하여 제공한다.
- L[953–953](../../upstream/krds/raw/components/component_11_01.html:953): 오디오가 제공되는 시점에 정확하게 정보를 전달할 수 있으며, 시청각 정보가 일치하므로 콘텐츠에 대한 사용자의 이해를 높일 수 있다.
- L[956–956](../../upstream/krds/raw/components/component_11_01.html:956): 콘텐츠를 업데이트할 때 대체 정보도 업데이트한다.
- L[957–957](../../upstream/krds/raw/components/component_11_01.html:957): 미디어 콘텐츠가 업데이트될 때마다 관련 대체 정보도 함께 검토 및 수정하여 최신 상태를 유지해야 한다.

보존된 인라인 예시 마크업(참고용, 공개 네이티브 API 아님): 이 상세 페이지에는 인라인 예시 마크업이 없습니다.

원문의 CSS/JS/가이드 이미지 참조는 복사된 구현이 아닙니다. 필수/선택 열을 보존한 표 행의 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화된 발췌는 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 고정 HTML은 마크업·플레이어 코드 없이 개념적 콘텐츠 지침만 제공합니다. 시맨틱 동등성과 스크린 리더·미디어 컨트롤은 사람이 검토해야 합니다. 자동화된 존재 검사로 대체 정보를 인증할 수 없습니다.
- 상세 페이지에 가이드 이미지 참조가 5개 있으며, 그 안의 픽셀 도식은 시각적으로 검사하지 않았습니다. 텍스트 구조와 지침은 읽었습니다. 정확한 시각 치수·자산은 이후 시각·출처 검토가 필요합니다.
- 시맨틱 인터페이스와 파트·상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 자체 구현, 동작·스토리 소스, 독립 인수가 여전히 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 시맨틱 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `AccessibleMediaContract`입니다. 네이티브 프레임워크는 자체 콘텐츠·ref·이벤트 전달만 확장합니다. 공유 매니페스트는 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에서 인용·파생한 공식 텍스트는 원래의 KRDS 권리와 출처 표기를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 원천 식별 정보는 바뀌지 않습니다. 열린 근거 한계는 검사하지 않은 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며 여기 인용된 실질 요구사항을 면제하지 않습니다.
