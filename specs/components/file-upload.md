# 파일 업로드 {#file-upload}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐입니다. 네이티브 동작, 시각·자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `file-upload`, 한국어 이름 파일 업로드, export `FileUpload`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_09_04](https://www.krds.go.kr/html/site/component/component_09_04.html), 보존본 [HTML](../../upstream/krds/raw/components/component_09_04.html). 수집 `2026-10-29T23:28:05.532Z`, `88760` 바이트, SHA-256 `c498892258d66f642e54152aa6518c4520d58df848739038014bda505e180cb3`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류는 `component`, 수용된 프로젝트 완료 종류는 `integration`입니다. integration을 권고하는 이유는 다음과 같습니다. L1005–1006은 폼 제출 전 서버 자동 업로드·저장을 금지합니다. L1012–1018은 서버 전용 실패 상태를 포함합니다. L1188–1189는 네이티브 파일 입력을 의무로 합니다.

지원하는 네이티브 케이스(변형·상태 축)는 `single`, `multiple`, `button`, `dropzone`, `pending`, `success`, `error`입니다. 이는 네이티브 케이스 이름입니다. 상태·반응형·외형 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형·예시 헤딩 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

순서는 다음과 같습니다. 섹션 레이블/제목, 선택 설명, 유형·크기·개수 제약, 실제 파일 선택 컨트롤, 선택 드롭 영역, 개수, 파일 레코드(이름/확장자/크기/상태/삭제). 단일 파일은 p로, 다중 파일은 ul/li로 묶습니다. 삭제 버튼은 해당 파일 텍스트로 설명합니다. 긴 파일 이름은 시각적으로 한 줄로 두고 접근 가능한 이름에는 전체를 담습니다.

## 의미 API {#plain-semantic-api}

**제어 전용 확정 파일 집합**을 씁니다. 필수 `files: readonly FileRecord[]`는 처음에 `[]`로 명시해 전달합니다. defaultFiles나 비제어 기준선(비어 있지 않은/빈)은 없습니다. `FileRecord={id:string,file:File,status:staged|uploading|success|error,progress?:number,error?:string}`는 고유하고 안정적인 ID와 실제 불변 File 핸들을 가집니다. 경로명이나 렌더러·머신 객체는 담지 않습니다. 다른 prop은 multiple=false, accept?, maxFiles?, maxBytes?, disabled=false, name입니다. 보관된 브라우저 File은 의도적으로 지원하는 네이티브 파일 데이터입니다. 콜백은 네이티브 Event 객체를 전달하지 않습니다. 파일 변경·삭제는 호스트가 새 files prop을 줄 때만 일어납니다. 마운트·하이드레이션·prop·리셋·재조정은 사용자 변경 콜백을 내지 않습니다.

수용된 후보 선택·삭제 요청은 `onFilesChange({value:FileRecord[],reason:picker|drop|remove,addedIds:string[],removedIds:string[]})`만 한 번 호출합니다. 여기에는 **요청된 최종 집합 전체**를 담습니다. 삭제도 같은 이벤트를 쓰며 별도 onRemove 요청은 없습니다. 검증에서 거부된 후보는 별도 `onFilesRejected({rejected:{file,code,message}[]})`로 한 번 보고하고, 연결된 오류를 화면에 표시합니다. 이는 검증 피드백이지 값 변경 알림이 아닙니다. 유효한 후보가 요청 집합을 바꾸지 않으면 onFilesChange를 내지 않습니다. 제어 호스트는 유효한 요청도 거절할 수 있습니다. 이때 표시, 개수, 실제 제출 집합, 보관된 미리보기는 확정된 파일 기준을 유지합니다. 낙관적 삭제·추가가 FormData로 새어 나가서는 안 됩니다.

multiple=true일 때 선택기 선택과 드롭은 유효한 후보를 전달된 순서대로 현재 확정 집합 뒤에 추가하고, 기존 파일은 모두 유지합니다. 유형/확장자/크기를 검증한 뒤 남은 개수 칸을 순서대로 채우며, 초과분은 거부로 보고하되 기존 레코드는 지우지 않습니다. 새로 고른 서로 다른 File 객체는 파일명·메타데이터가 같아도 새 ID를 받습니다. 내용 중복 제거는 주장하지 않습니다. 이미 확정된 바로 그 File 객체는 중복이므로 아무 일도 하지 않습니다. multiple=false이면 유효한 후보 하나가 현재 집합을 대체합니다. 여러 파일 드롭은 하나를 임의로 고르지 않고 개수 안내와 함께 통째로 거부합니다. 잘못된 선택이나 취소한 선택은 이전 집합을 지우지 않습니다. accept는 선택기 힌트로만 남습니다. 비밀번호·바이러스 검사나 선택 시 전송을 꾸며 내지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

네이티브 선택기가 OS 키보드 탐색을 맡으며 실제 사용자 동작으로만 열립니다. 드롭 영역은 클릭/키보드 선택기 대응 수단을 포함합니다. 고른 File 객체를 스냅샷한 뒤 임시 네이티브 선택기 값만 비워 같은 파일을 다시 고를 수 있게 합니다. 이 선택기는 확정 파일 저장소가 아닙니다. 취소는 files-change도 거부도 내지 않으며 확정 레코드를 보존합니다. 삭제는 최종 집합을 한 번 요청합니다. **실제로 삭제가 수용된 뒤** 초점은 앞에 남은 삭제 컨트롤로, 없으면 다음 것으로, 그것도 없으면 선택기로 옮깁니다. 거부된 삭제는 레코드·컨트롤·초점을 그대로 둡니다. 네이티브 목록을 갱신하는 동안 입력과 선택기를 안정적으로 유지합니다. 추가만으로 호스트 전송을 시작하지 않습니다. pending/success/error 레코드는 명시적 제출로 시작된 호스트 상태에서 옵니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

다중 파일용 모달 레이아웃을 쓰지 않습니다. 좁은 화면에서도 목록을 읽을 수 있고 개수가 보여야 합니다. 드래그 안내가 터치 사용자를 배제해서는 안 됩니다. pending/success/error는 아이콘과 텍스트를 함께 씁니다. 추가에 성공한 뒤에도 호스트가 입력을 비활성화하지 않는 한 선택 컨트롤을 계속 쓸 수 있어야 합니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

실제 네이티브 파일 입력은 사용자 선택기로서 계속 필요합니다. 그러나 임시 FileList는 선택기와 드롭이 누적된 저장소가 아닙니다. 비어 있지 않은 input.value를 설정하지 않으며, 네이티브 FormData가 확정 배열을 자동으로 담는다고 주장하지 않습니다. 호스트 제출 드라이버는 이 필드의 임시 선택기 항목을 제거해야 합니다. 그리고 명시적 제출 시 **현재 확정된 활성** 레코드만 정확히 `FormData.append(name,record.file,record.file.name)`으로 추가해야 합니다. 비활성 업로더는 아무것도 보내지 않습니다. 호스트의 필수·개수 검증도 빈 선택기가 아니라 확정 레코드를 읽습니다. 선택기에서 A 선택, B 드롭, 삭제 수용으로 A 제거, 제출 순서면 B만 전송해야 합니다. 거부된 추가·삭제는 이 결과를 바꾸지 않습니다.

취소된 네이티브 리셋은 선택기, 확정 레코드, 오류, 미리보기에 아무 영향이 없습니다. 취소되지 않은 리셋은 선택기와 일시적 드래그·검증 상태를 비웁니다. 이 API는 제어 전용이므로 현재 files prop과 같은 제출 집합은 유지하며, files-change·삭제 알림은 0건입니다. 폼 리셋으로 확정 파일을 비우려는 호스트는 자체의 취소되지 않은 리셋 정책에서 명시적으로 files=[]를 설정합니다. 그 prop 갱신은 컴포넌트 콜백을 내지 않습니다. 비제어 리셋 기준선이 있는 것처럼 암시하지 않습니다. 컴포넌트가 소유한 객체 URL은 해당 확정 레코드가 실제로 제거·대체되거나 언마운트될 때만 해제합니다. 네이티브 리셋이 보관된 제어 파일에 필요한 미리보기를 해제해서는 안 됩니다. 명시적 제출 전에는 서버 전송·저장이 없습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

수용된 프로젝트 component→integration 완료 조건은 다음과 같습니다. 필수 네이티브 선택기·스테이징 UI가 명시적 호스트 FormData/전송 드라이버와 연결되어야 합니다. 공식 지침인 추가 선택 지속, 네이티브 입력, 제출 전 전송 금지([L989–1006](../../upstream/krds/raw/components/component_09_04.html:989), [L1188–1189](../../upstream/krds/raw/components/component_09_04.html:1188))는 계속 구속력을 가집니다. 드롭 문구 “업로드 시작”은 명시적 제출 경계에 맞춘 스테이징으로 해석하며, 조용히 네트워크 전송을 실행한다는 뜻이 아닙니다. 완료하려면 다음이 모두 필요합니다. 최종 집합 요청을 실제로 수락·거절하는 제어 로컬 저장소, 선택기+드롭 누적·대체, 제출된 파일 검사, 리셋 정책, 제출로 시작되는 결정적 모의 진행·실패·삭제, 미리보기 정리. 로그만 내보내거나 input type=file을 감싸기만 하는 것으로는 부족합니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, label, description, help, picker, file-input, dropzone, count, list, item, filename, size, status, progress, remove, error; staged,drag-over,uploading,success,error,disabled.

렌더링된 모든 소유 파트는 `data-krds-component="file-upload"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 씁니다. 네이티브/ARIA 상태가 우선합니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 취소하면 콜백 없이 이전 파일을 유지합니다.
2. 삭제 후 같은 파일을 다시 고를 수 있습니다.
3. 드롭에는 키보드 선택기 대응 수단이 있습니다.
4. 제약 위반은 파일별 오류를 냅니다.
5. 명시적 제출 전에는 네트워크 전송이 없습니다.
6. 삭제가 수용되든 거부되든, 선언된 제어 리셋 정책 아래에서도 렌더링과 제출 파일은 항상 확정 집합을 반영합니다.
7. pending/success/error 모의가 올바른 레이블을 보이고 객체 URL을 정리합니다.
8. 제어 multiple에서 선택기 A, 드롭 B가 둘 다 추가되고, 삭제 수용으로 A를 제거한 뒤 제출하면 확정된 B만 실제 File로 전송됩니다.
9. 제어 추가·삭제가 거부되면 렌더링된 개수, 초점, 제출 File 집합이 정확히 그대로입니다.
10. 단일 파일 대체, 잘못된 후보, 여러 파일 드롭 거부는 지정한 최종 집합 정책을 지킵니다.
11. 취소된 리셋은 완전히 무동작입니다. 일반 제어 리셋은 호스트가 files를 명시적으로 바꾸지 않는 한 레코드를 유지하며 files-change 콜백은 0건입니다.
12. 최종 집합이 바뀌는 요청마다 onFilesChange는 한 번 나오고 onRemove는 중복되지 않으며, 검증 피드백은 별도입니다.
13. 선택기를 비워도 확정 저장소가 지워지지 않고 보관된 미리보기 URL도 해제되지 않으며, 같은 파일을 다시 고를 수 있습니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색 외 상태 단서, 움직임이 있다면 동작 줄이기를 검증합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`file-upload--single`, `file-upload--multiple`, `file-upload--button`, `file-upload--dropzone`, `file-upload--cancel-reselect`, `file-upload--constraints-error`, `file-upload--submit-mock-progress`, `file-upload--failure-retry`, `file-upload--form-reset`, `file-upload--picker-drop-remove-submit`, `file-upload--controlled-add-rejected`, `file-upload--controlled-remove-rejected`, `file-upload--single-replacement`, `file-upload--controlled-reset-retained`, `file-upload--host-reset-clear`.

각 케이스는 해당하는 모든 네이티브 렌더러에서 로컬 args/inputs/slots와 관찰 가능한 순수 로컬 상태가 필요합니다. 렌더러는 Solid 1, React, Svelte, Vue, Lit, Qwik, Angular이며 Solid 2 미리보기는 따로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 별도로 준비됩니다. 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 인수되어야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 상류 siheom 어댑터만 씁니다. Lit과 Solid 2는 siheom 지원을 지어내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름과 대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러/렌더러를 가져와서는 안 됩니다. 다른 프레임워크 렌더러 래퍼는 금지합니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 실제 보존 상세 HTML에서 추출했으며 핵심 지침과 상호작용·마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 출처 언어(한국어)를 그대로 둡니다. “고려/권장/수 있다” 같은 표현은 권고로 남습니다. 예시나 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 출처 JS 함수 표는 참고 근거일 뿐이며 원본 KRDS JS를 네이티브 제어 DOM에서 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 빼면 독립 선택입니다.

### 구조

- L[883–883](../../upstream/krds/raw/components/component_09_04.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_09_04.html:889): 1. 레이블/제목 파일 업로드 섹션을 설명하는 텍스트로 파일 용도 등 업로드 맥락을 제공함
- L[890–890](../../upstream/krds/raw/components/component_09_04.html:890): 2. 설명(선택) 헤딩의 정보를 보완하는 텍스트 설명
- L[891–891](../../upstream/krds/raw/components/component_09_04.html:891): 3. 도움말 텍스트 업로드 프로세스 또는 요구 사항을 설명하고 파일 형식 및 크기에 대한 가이드라인을 제공
- L[892–892](../../upstream/krds/raw/components/component_09_04.html:892): 4. 파일 선택 버튼 업로드할 파일을 선택하는 파일 선택기를 실행하는 버튼
- L[893–893](../../upstream/krds/raw/components/component_09_04.html:893): 5. 드롭 영역 업로드할 파일을 끌어다 놓는 영역
- L[894–894](../../upstream/krds/raw/components/component_09_04.html:894): 6. 카운터 업로드 가능한 전체 파일 수와 업로드된 파일 수를 보여줌
- L[895–895](../../upstream/krds/raw/components/component_09_04.html:895): 7. 파일 항목 업로드가 진행 중이거나 완료된 파일의 이름, 확장자, 크기를 보여줌
- L[896–896](../../upstream/krds/raw/components/component_09_04.html:896): 8. 삭제 버튼 업로드된 파일을 제거하는 아이콘 버튼
- L[900–900](../../upstream/krds/raw/components/component_09_04.html:900): a. 업로드 중 파일이 업로드 중일 때 스피너 아이콘을 표시함
- L[901–901](../../upstream/krds/raw/components/component_09_04.html:901): b. 성공 문제없이 파일이 업로드되었음을 안내하는 아이콘. 성공 상태인 경우에 표시되었다 삭제 버튼으로 전환됨
- L[897–903](../../upstream/krds/raw/components/component_09_04.html:897): 9. 업로드 상태 아이콘 a. 업로드 중 파일이 업로드 중일 때 스피너 아이콘을 표시함 b. 성공 문제없이 파일이 업로드되었음을 안내하는 아이콘. 성공 상태인 경우에 표시되었다 삭제 버튼으로 전환됨

### 유형

- L[911–911](../../upstream/krds/raw/components/component_09_04.html:911): 유형
- L[913–913](../../upstream/krds/raw/components/component_09_04.html:913): 업로드 가능 파일 수
- L[916–916](../../upstream/krds/raw/components/component_09_04.html:916): 1개 파일의 업로드만 필요하거나 서로 관련이 없는 여러 개의 파일을 업로드해야 할 경우에 사용한다. 서로 관련 없는 파일은 섹션을 명확하게 구분하고 각 파일에 대해 개별적인 파일 업로드 컴포넌트를 제공하는 것이 적절하다.
- L[920–920](../../upstream/krds/raw/components/component_09_04.html:920): 한 번에 업로드할 파일을 여러 개 선택할 수 있도록 허용하는 경우에 사용한다. 모든 파일이 서로 관련되어 있는 경우(예- 사진첩에서 여러 개의 사진을 선택하여 업로드)에 사용하기 적합하다.
- L[924–924](../../upstream/krds/raw/components/component_09_04.html:924): 업로드 수단
- L[927–927](../../upstream/krds/raw/components/component_09_04.html:927): 파일 선택 대화 상자를 표시하는 작업 버튼을 클릭하여 하나 이상의 파일을 업로드할 수 있다.
- L[931–931](../../upstream/krds/raw/components/component_09_04.html:931): 선택한 파일을 드롭 영역에 직접 끌어다 놓거나 드롭 영역 내부의 텍스트 링크를 클릭하여 파일 선택 대화 상자를 통해 파일을 업로드할 수 있다.

### 용례

- L[939–939](../../upstream/krds/raw/components/component_09_04.html:939): 용례
- L[941–941](../../upstream/krds/raw/components/component_09_04.html:941): 사용하기 적합하지 않은 경우
- L[946–946](../../upstream/krds/raw/components/component_09_04.html:946): 업로드된 파일 목록이 수직으로 쌓이기 때문에 여러 파일을 업로드할 때는 모달 레이아웃을 사용하지 않는다.
- L[943–948](../../upstream/krds/raw/components/component_09_04.html:943): 모달 레이아웃에서의 다중 파일 업로드 업로드된 파일 목록이 수직으로 쌓이기 때문에 여러 파일을 업로드할 때는 모달 레이아웃을 사용하지 않는다.

### 사용성 가이드라인

- L[956–956](../../upstream/krds/raw/components/component_09_04.html:956): 사용성 가이드라인
- L[959–959](../../upstream/krds/raw/components/component_09_04.html:959): 파일 업로드는 필요한 경우에만 사용한다.
- L[960–960](../../upstream/krds/raw/components/component_09_04.html:960): 파일 업로드는 파일의 탐색과 선택이라는 복잡한 과업을 사용자에게 요구한다. 파일 업로드 컴포넌트를 사용하기 전에 파일의 첨부가 꼭 필요한지 확인하여 사용자에게 불필요한 입력을 요청하지 않아야 한다.
- L[963–963](../../upstream/krds/raw/components/component_09_04.html:963): 레이블을 제공한다.
- L[964–964](../../upstream/krds/raw/components/component_09_04.html:964): 파일 업로더에 명확한 레이블을 제공하여 사용자가 파일의 제출 용도와 정확히 어떤 파일을 업로드해야 하는지 명확하게 알 수 있도록 한다.
- L[967–967](../../upstream/krds/raw/components/component_09_04.html:967): 파일 유형, 파일 크기, 파일 개수 제한에 대해 안내한다.
- L[968–968](../../upstream/krds/raw/components/component_09_04.html:968): 업로드 가능한 문서 유형, 파일 크기, 파일 개수에 제한이 있는 경우 도움말 텍스트를 사용하여 제약 사항에 대한 정보를 강조하여 표시한다. 이를 통해 사용자가 잘못된 형식의 파일을 업로드하거나 너무 큰 파일을 업로드하여 오류가 발생하는 것을 방지할 수 있다.
- L[975–975](../../upstream/krds/raw/components/component_09_04.html:975): 가능한 한 파일 형식을 제한하지 않는다.
- L[976–977](../../upstream/krds/raw/components/component_09_04.html:976): 제출을 요구하는 파일의 일반적인 형식을 확인하여 사용자가 다양한 파일 형식을 업로드할 수 있도록 한다. 모든 사람이 동일한 소프트웨어에 접근할 수 있는 것이 아니므로 불필요한 소프트웨어 설치 요구 등을 피하기 위해 업로드 파일 형식을 유연하게 구성해야 한다. 이때, 파일의 확장자에도 부적절한 제한이 발생하지 않도록 한다(예 - JPEG 형식의 파일에 대해 .jpg, .jpeg, .jpe 등의 확장자를 허용함).
- L[980–980](../../upstream/krds/raw/components/component_09_04.html:980): 가능한 한 파일 크기를 제한하지 않는다.
- L[981–982](../../upstream/krds/raw/components/component_09_04.html:981): 만약 업로드 가능한 파일 크기를 제한해야 한다면 제출을 요구하는 파일의 일반적인 크기를 확인하여 사용자가 원활하게 파일을 업로드할 수 있도록 해야 한다. 어떤 사용자는 파일의 크기를 줄이는 방법을 알지 못할 수 있으며, 파일 크기를 원하는 수준으로 줄이기 위해서는 다른 도구를 사용해야 한다.
- L[985–985](../../upstream/krds/raw/components/component_09_04.html:985): 이미지 유형의 파일에 대해 파일 크기 자동 압축 기능을 제공한다.
- L[986–986](../../upstream/krds/raw/components/component_09_04.html:986): 이미지를 원하는 크기와 품질로 줄이는 과정에는 여러 번의 테스트가 필요하다. 만약 사용자의 이미지 파일 제출이 필요하고 용량을 제한해야 한다면 파일 크기를 필요한 수준으로 압축하는 기능을 제공하는 방안을 고려한다.
- L[989–989](../../upstream/krds/raw/components/component_09_04.html:989): 파일이 업로드된 후에도 파일 선택 버튼을 기본 상태로 유지한다.
- L[990–990](../../upstream/krds/raw/components/component_09_04.html:990): 사용자가 파일을 선택한 후에도 새 파일을 추가하거나 변경할 수 있도록 파일 선택 버튼 또는 드롭 영역을 사용 가능한 기본 상태로 유지한다. 파일 업로드의 사용 불가 상태는 사용자의 입력 행위 자체를 제한할 때에 사용한다.
- L[993–993](../../upstream/krds/raw/components/component_09_04.html:993): 파일 선택 버튼을 적절한 강조 수준으로 표현한다.
- L[994–994](../../upstream/krds/raw/components/component_09_04.html:994): 페이지에 입력폼 제출 버튼과 같은 최상위 수준의 버튼이 존재하는 경우에는 하위 위계 수준의 버튼 강조 표현을 사용하여 핵심 작업과 파일 업로드 작업이 충돌하지 않도록 한다.
- L[1005–1005](../../upstream/krds/raw/components/component_09_04.html:1005): 파일을 자동으로 제출하지 않는다.
- L[1006–1006](../../upstream/krds/raw/components/component_09_04.html:1006): 사용자가 입력폼을 제출할 때까지 파일을 서버에 업로드하거나 저장해서는 안 된다.
- L[1009–1009](../../upstream/krds/raw/components/component_09_04.html:1009): 오류 상태에 대한 구체적인 오류 메시지를 제공한다.
- L[1010–1010](../../upstream/krds/raw/components/component_09_04.html:1010): 사용자가 어떤 종류의 오류가 발생했는지 명확히 이해할 수 있도록 구체적인 오류 메시지를 제공한다. 파일 업로드에 제공할 수 있는 오류 메시지는 다음과 같다. 기타 항목은 파일 업로더의 능력에 따라 선택적으로 제공할 수 있는 오류 상태이다.
- L[1012–1012](../../upstream/krds/raw/components/component_09_04.html:1012): 선택한 파일이 없는 경우
- L[1013–1013](../../upstream/krds/raw/components/component_09_04.html:1013): 잘못된 파일 형식인 경우
- L[1014–1014](../../upstream/krds/raw/components/component_09_04.html:1014): 파일이 너무 큰 경우
- L[1015–1015](../../upstream/krds/raw/components/component_09_04.html:1015): 파일이 비어있는 경우
- L[1016–1016](../../upstream/krds/raw/components/component_09_04.html:1016): 문제가 발생하여 파일이 업로드되지 않은 경우
- L[1017–1017](../../upstream/krds/raw/components/component_09_04.html:1017): 사용자가 선택할 수 있는 파일 수에 제한이 있는 경우
- L[1018–1018](../../upstream/krds/raw/components/component_09_04.html:1018): 기타: 파일이 비밀번호로 보호되어 있는 경우, 파일에 바이러스가 포함된 경우 등
- L[1022–1022](../../upstream/krds/raw/components/component_09_04.html:1022): 업로드된 파일 이름 텍스트를 두 줄로 제공하지 않는다.
- L[1023–1023](../../upstream/krds/raw/components/component_09_04.html:1023): 파일 이름이 길어 텍스트가 파일 항목 컨테이너를 벗어나는 경우 말줄임표를 사용한다.

### 접근성 가이드라인

- L[1138–1138](../../upstream/krds/raw/components/component_09_04.html:1138): 접근성 가이드라인
- L[1141–1141](../../upstream/krds/raw/components/component_09_04.html:1141): 파일 업로드에 적절한 레이블을 제공한다.
- L[1142–1142](../../upstream/krds/raw/components/component_09_04.html:1142): 업로드가 필요한 파일의 용도를 이해할 수 있는 적절한 설명을 제공해야 한다.
- L[1149–1149](../../upstream/krds/raw/components/component_09_04.html:1149): 파일 항목과 항목 삭제 버튼을 하나의 그룹으로 제공한다.
- L[1150–1151](../../upstream/krds/raw/components/component_09_04.html:1150): 사용자가 여러 개의 파일을 업로드하는 경우, 스크린 리더 사용자는 연속된 파일명과 파일 삭제 버튼 요소 간 관계를 인지하기 어려워진다. 단일 파일 업로드 형식에서는 항목을 &lt;p&gt;로, 다중 파일 업로드 형식에서는 &lt;ul&gt;, &lt;li&gt; 구조로 파일 항목과 삭제 버튼을 그룹화한다. 그런 다음 파일 항목 텍스트와 항목 삭제 버튼을 aria-describedby 속성으로 연결하여 두 요소 간 컨트롤 관계가 보다 명확하게 스크린 리더로 전달될 수 있도록 한다.
- L[1158–1158](../../upstream/krds/raw/components/component_09_04.html:1158): 키보드 초점을 명확하게 표시한다.
- L[1159–1159](../../upstream/krds/raw/components/component_09_04.html:1159): 파일 선택 버튼이 초점을 가진 상태에서 포커스링이 시각적으로 명확하게 표시되어야 한다.
- L[1167–1167](../../upstream/krds/raw/components/component_09_04.html:1167): 드래그 앤 드롭 유형은 반드시 파일 업로더와 함께 사용한다.
- L[1168–1168](../../upstream/krds/raw/components/component_09_04.html:1168): 경로 기반 동작을 수행할 수 없는 사용자 입력 인터페이스를 이용하는 사용자, 정교한 마우스 컨트롤이 어려운 사용자를 고려하여 단순 마우스 Click과 키보드 Enter 동작만으로도 파일을 업로드할 수 있게 해야 한다.
- L[1188–1188](../../upstream/krds/raw/components/component_09_04.html:1188): 스크린 리더로 접근할 수 있도록 한다.
- L[1189–1189](../../upstream/krds/raw/components/component_09_04.html:1189): 파일 업로드 컴포넌트의 역할이 스크린 리더로 전달될 수 있도록 시각적으로 숨겨진 &lt;input type="file"&gt;에 적절한 숨김 스타일을 사용해야 한다.

### 상호작용 가이드라인

- L[1200–1200](../../upstream/krds/raw/components/component_09_04.html:1200): 상호작용 가이드라인
- L[1202–1202](../../upstream/krds/raw/components/component_09_04.html:1202): 탐색
- L[1220–1223](../../upstream/krds/raw/components/component_09_04.html:1220): Tab 파일 선택 버튼/드롭 영역, 파일 삭제 버튼에 접근할 수 있다.
- L[1224–1227](../../upstream/krds/raw/components/component_09_04.html:1224): 방향키 ↑, ↓ 파일 선택기가 활성화되었을 때 키보드의 방향키 ↑, ↓을 눌러 파일을 탐색할 수 있다.
- L[1235–1235](../../upstream/krds/raw/components/component_09_04.html:1235): 파일 업로드
- L[1253–1256](../../upstream/krds/raw/components/component_09_04.html:1253): Click 파일 선택기가 활성화된 상태에서 파일을 선택하고 '열기' 버튼을 Click 하면 파일 선택을 완료할 수 있다.
- L[1257–1260](../../upstream/krds/raw/components/component_09_04.html:1257): Space, Enter 파일 선택기가 활성화되었을 때 업로드할 파일 및 '열기' 버튼에 초점을 가진 상태에서 Space 또는 Enter 키를 눌러 파일 선택을 완료할 수 있다.
- L[1261–1264](../../upstream/krds/raw/components/component_09_04.html:1261): Drag & Drop 파일이 첨부된 드롭 영역의 범위 내에서 마우스를 아무 곳으로나 Drag 하면 해당 영역 안에 파일을 Drop 하고 업로드를 시작할 수 있다.
- L[1271–1271](../../upstream/krds/raw/components/component_09_04.html:1271): 파일 삭제
- L[1289–1292](../../upstream/krds/raw/components/component_09_04.html:1289): Click 삭제 버튼을 Click 하면 파일이 삭제된다.
- L[1293–1296](../../upstream/krds/raw/components/component_09_04.html:1293): Space, Enter 삭제 버튼이 초점을 가진 상태에서 Space 또는 Enter 키를 누르면 파일이 삭제된다.

### 예시

- L[1315–1315](../../upstream/krds/raw/components/component_09_04.html:1315): 예시
- L[1319–1319](../../upstream/krds/raw/components/component_09_04.html:1319): 기본
- L[1330–1330](../../upstream/krds/raw/components/component_09_04.html:1330): 타이틀영역
- L[1417–1417](../../upstream/krds/raw/components/component_09_04.html:1417): 기본 코드 확인하기

### 마크업 가이드

- L[1437–1437](../../upstream/krds/raw/components/component_09_04.html:1437): 마크업 가이드
- L[1440–1440](../../upstream/krds/raw/components/component_09_04.html:1440): CSS 선택자
- L[1457–1460](../../upstream/krds/raw/components/component_09_04.html:1457): 전체영역 .krds-file-upload
- L[1461–1464](../../upstream/krds/raw/components/component_09_04.html:1461): 파일 업로드 영역 .file-upload
- L[1465–1468](../../upstream/krds/raw/components/component_09_04.html:1465): 업로드 된 파일 리스트 영역 .file-list

보존된 인라인 예시 마크업(참고용이며 공개 네이티브 API가 아님): L[1324–1411](../../upstream/krds/raw/components/component_09_04.html:1324)

CSS/JS/안내 이미지 출처 참조는 복사한 구현이 아닙니다. 표 행의 필수/선택 열을 보존한 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화된 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 제어 전용 최종 집합, 누적, 리셋, 호스트 FormData 정책은 구체적으로 독립 프로젝트 선택입니다. 공식의 드롭 즉시 처리 문구는 명시적 제출 전 전송 금지와 여전히 충돌합니다. 이 초안은 후자를 지키며 정확한 근거를 보존합니다. 네이티브 FileList 동기화는 가정하지 않습니다.
- 연결된 외부 코드 예시는 참조만 하며 이 준비 단계에서 별도 파일로 포함하거나 읽지 않았습니다. L1422 `../../code/file_upload.html`, L1483 `./variable/file_upload.html`. 보지 않은 내용을 추측하지 않습니다.
- 상세에는 안내 이미지 참조 8건이 있습니다. 내장 픽셀 도해는 시각적으로 검사하지 않았습니다. 텍스트 구조와 지침은 읽었습니다. 정확한 시각 치수·자산은 이후 시각·출처 검토가 필요합니다.
- 의미 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작/스토리 소스, 독립 인수가 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `FileUploadContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트는 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼로는 이 계약을 충족할 수 없습니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에 인용·파생된 공식 텍스트는 원래의 KRDS 권리와 출처 표시를 유지합니다. 독립 코드의 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 검사하지 않은 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며, 여기 인용한 실질 요구사항을 면제하지 않습니다.
