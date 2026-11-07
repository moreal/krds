---
title: '파일 업로드 · File upload'
---

# 파일 업로드 {#file-upload}

File upload · `FileUpload` · integration

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_09_04.html) · [검토된 전체 명세](/sources/specs/components/file-upload.md.txt) · [프레임워크 지원](../compatibility/)

## 네이티브 지원 현황 {#native-availability}

아래 상태는 `catalog/coverage.json`에서 그대로 가져옵니다. export, 예제, 테스트 실행기 종료 코드에서 추론하지 않습니다.

| 프레임워크 | 패키지 버전 | 기록된 상태 | export 선언 | 네이티브 예제와 스토리 |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/react/package.json.txt); [과거 선언 체크포인트](/sources/packages/react/dist/components/file-upload/index.d.ts.txt) | [react 소스와 미리보기 정책](../compatibility/examples#react) |
| solid | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/solid/package.json.txt); [과거 선언 체크포인트](/sources/packages/solid/dist/components/file-upload/index.d.ts.txt) | [solid 소스와 미리보기 정책](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/svelte/package.json.txt); [과거 선언 체크포인트](/sources/packages/svelte/dist/components/FileUpload.svelte.d.ts.txt) | [svelte 소스와 미리보기 정책](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/vue/package.json.txt); [과거 선언 체크포인트](/sources/packages/vue/dist/components/file-upload/FileUpload.vue.d.ts.txt) | [vue 소스와 미리보기 정책](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/lit/package.json.txt); [과거 선언 체크포인트](/sources/packages/lit/dist/components/file-upload/index.d.ts.txt) | [lit 소스와 미리보기 정책](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/qwik/package.json.txt); [과거 선언 체크포인트](/sources/packages/qwik/dist/components/file-upload/index.d.ts.txt) | [qwik 소스와 미리보기 정책](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/angular/package.json.txt); [과거 선언 체크포인트](/sources/packages/angular/dist/types/unofficial-krds-angular-file-upload.d.ts.txt) | [angular 소스와 미리보기 정책](../compatibility/examples#angular) |
| solid-next (미리보기) | `0.1.0-preview.0` | planned | [현재 루트 매니페스트](/sources/packages/solid-next/package.json.txt); [과거 선언 체크포인트](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next 소스와 미리보기 정책](../compatibility/examples#solid-next) |

## 속성·이벤트·콘텐츠·기본값 {#props-events-content-and-defaults}

아래 의미 계약은 공유 데이터일 뿐입니다. 네이티브 콘텐츠, ref, 이벤트 전달은 각 어댑터가 맡습니다. 계약의 콜백 이름과 detail 타입은 그대로 씁니다. 머신 객체를 전달하지 않습니다. 선택 속성에는 기본값이 자동으로 채워지지 않습니다. 아래 안내의 명시적 기본값을 씁니다.

```ts
export interface FileUploadContract {
    files: readonly FileRecord[];
    name: string;
    label: string;
    multiple?: boolean;
    accept?: string;
    maxFiles?: number;
    maxBytes?: number;
    disabled?: boolean;
    onFilesChange: (detail: {
        value: readonly FileRecord[];
        reason: 'picker' | 'drop' | 'remove';
        addedIds: readonly string[];
        removedIds: readonly string[];
    }) => void;
    onFilesRejected?: (detail: {
        rejected: readonly FileValidationFailure[];
    }) => void;
}

/** File is browser-native data; no Event, renderer or machine crosses the contract. */
export interface FileRecord {
    id: string;
    file: File;
    status: 'staged' | 'uploading' | 'success' | 'error';
    progress?: number;
    error?: string;
}

export interface FileValidationFailure {
    file: File;
    code: 'accept' | 'max-files' | 'max-bytes';
    message: string;
}
```

| 의미 속성 / 콜백 | 필수 | 정확한 타입 | 역할 |
| --- | --- | --- | --- |
| `files` | 예 | `readonly FileRecord[]` | 데이터 / 상태 |
| `name` | 예 | `string` | 데이터 / 상태 |
| `label` | 예 | `string` | 데이터 / 상태 |
| `multiple` | 아니요 | `boolean` | 데이터 / 상태 |
| `accept` | 아니요 | `string` | 데이터 / 상태 |
| `maxFiles` | 아니요 | `number` | 데이터 / 상태 |
| `maxBytes` | 아니요 | `number` | 데이터 / 상태 |
| `disabled` | 아니요 | `boolean` | 데이터 / 상태 |
| `onFilesChange` | 예 | `(detail: {value: readonly FileRecord[]; reason: 'picker' \| 'drop' \| 'remove'; addedIds: readonly string[]; removedIds: readonly string[]}) => void` | 의미 이벤트 요청 |
| `onFilesRejected` | 아니요 | `(detail: {rejected: readonly FileValidationFailure[]}) => void` | 의미 이벤트 요청 |

선택 값과 명시적 기본값은 다릅니다. 기본값과 네이티브 콘텐츠 요구사항은 아래 검토된 안내에 있습니다.

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 네이티브 JSX/콘텐츠 prop을 씁니다. Svelte는 네이티브 snippet을 씁니다. Vue는 네이티브 슬롯을 씁니다. Angular는 네이티브 input, output, 콘텐츠 투영을 씁니다. Lit은 custom element 속성, 슬롯, DOM 이벤트를 씁니다. Qwik은 네이티브 QRL 이벤트 경계를 씁니다. 이 전달 방식은 서로 바꿔 쓸 수 없습니다. 정확한 이름과 필수 콘텐츠는 링크된 공개 패키지 선언에서 확인합니다. 아래 의미 콜백이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

순서는 다음과 같습니다. 섹션 레이블/제목, 선택 설명, 유형·크기·개수 제약, 실제 파일 선택 컨트롤, 선택 드롭 영역, 개수, 파일 레코드(이름/확장자/크기/상태/삭제). 단일 파일은 p로, 다중 파일은 ul/li로 묶습니다. 삭제 버튼은 해당 파일 텍스트로 설명합니다. 긴 파일 이름은 시각적으로 한 줄로 두고 접근 가능한 이름에는 전체를 담습니다.

### 의미 API {#plain-semantic-api}

**제어 전용 확정 파일 집합**을 씁니다. 필수 `files: readonly FileRecord[]`는 처음에 `[]`로 명시해 전달합니다. defaultFiles나 비제어 기준선(비어 있지 않은/빈)은 없습니다. `FileRecord={id:string,file:File,status:staged|uploading|success|error,progress?:number,error?:string}`는 고유하고 안정적인 ID와 실제 불변 File 핸들을 가집니다. 경로명이나 렌더러·머신 객체는 담지 않습니다. 다른 prop은 multiple=false, accept?, maxFiles?, maxBytes?, disabled=false, name입니다. 보관된 브라우저 File은 의도적으로 지원하는 네이티브 파일 데이터입니다. 콜백은 네이티브 Event 객체를 전달하지 않습니다. 파일 변경·삭제는 호스트가 새 files prop을 줄 때만 일어납니다. 마운트·하이드레이션·prop·리셋·재조정은 사용자 변경 콜백을 내지 않습니다.

수용된 후보 선택·삭제 요청은 `onFilesChange({value:FileRecord[],reason:picker|drop|remove,addedIds:string[],removedIds:string[]})`만 한 번 호출합니다. 여기에는 **요청된 최종 집합 전체**를 담습니다. 삭제도 같은 이벤트를 쓰며 별도 onRemove 요청은 없습니다. 검증에서 거부된 후보는 별도 `onFilesRejected({rejected:{file,code,message}[]})`로 한 번 보고하고, 연결된 오류를 화면에 표시합니다. 이는 검증 피드백이지 값 변경 알림이 아닙니다. 유효한 후보가 요청 집합을 바꾸지 않으면 onFilesChange를 내지 않습니다. 제어 호스트는 유효한 요청도 거절할 수 있습니다. 이때 표시, 개수, 실제 제출 집합, 보관된 미리보기는 확정된 파일 기준을 유지합니다. 낙관적 삭제·추가가 FormData로 새어 나가서는 안 됩니다.

multiple=true일 때 선택기 선택과 드롭은 유효한 후보를 전달된 순서대로 현재 확정 집합 뒤에 추가하고, 기존 파일은 모두 유지합니다. 유형/확장자/크기를 검증한 뒤 남은 개수 칸을 순서대로 채우며, 초과분은 거부로 보고하되 기존 레코드는 지우지 않습니다. 새로 고른 서로 다른 File 객체는 파일명·메타데이터가 같아도 새 ID를 받습니다. 내용 중복 제거는 주장하지 않습니다. 이미 확정된 바로 그 File 객체는 중복이므로 아무 일도 하지 않습니다. multiple=false이면 유효한 후보 하나가 현재 집합을 대체합니다. 여러 파일 드롭은 하나를 임의로 고르지 않고 개수 안내와 함께 통째로 거부합니다. 잘못된 선택이나 취소한 선택은 이전 집합을 지우지 않습니다. accept는 선택기 힌트로만 남습니다. 비밀번호·바이러스 검사나 선택 시 전송을 꾸며 내지 않습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

네이티브 선택기가 OS 키보드 탐색을 맡으며 실제 사용자 동작으로만 열립니다. 드롭 영역은 클릭/키보드 선택기 대응 수단을 포함합니다. 고른 File 객체를 스냅샷한 뒤 임시 네이티브 선택기 값만 비워 같은 파일을 다시 고를 수 있게 합니다. 이 선택기는 확정 파일 저장소가 아닙니다. 취소는 files-change도 거부도 내지 않으며 확정 레코드를 보존합니다. 삭제는 최종 집합을 한 번 요청합니다. **실제로 삭제가 수용된 뒤** 초점은 앞에 남은 삭제 컨트롤로, 없으면 다음 것으로, 그것도 없으면 선택기로 옮깁니다. 거부된 삭제는 레코드·컨트롤·초점을 그대로 둡니다. 네이티브 목록을 갱신하는 동안 입력과 선택기를 안정적으로 유지합니다. 추가만으로 호스트 전송을 시작하지 않습니다. pending/success/error 레코드는 명시적 제출로 시작된 호스트 상태에서 옵니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

다중 파일용 모달 레이아웃을 쓰지 않습니다. 좁은 화면에서도 목록을 읽을 수 있고 개수가 보여야 합니다. 드래그 안내가 터치 사용자를 배제해서는 안 됩니다. pending/success/error는 아이콘과 텍스트를 함께 씁니다. 추가에 성공한 뒤에도 호스트가 입력을 비활성화하지 않는 한 선택 컨트롤을 계속 쓸 수 있어야 합니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

실제 네이티브 파일 입력은 사용자 선택기로서 계속 필요합니다. 그러나 임시 FileList는 선택기와 드롭이 누적된 저장소가 아닙니다. 비어 있지 않은 input.value를 설정하지 않으며, 네이티브 FormData가 확정 배열을 자동으로 담는다고 주장하지 않습니다. 호스트 제출 드라이버는 이 필드의 임시 선택기 항목을 제거해야 합니다. 그리고 명시적 제출 시 **현재 확정된 활성** 레코드만 정확히 `FormData.append(name,record.file,record.file.name)`으로 추가해야 합니다. 비활성 업로더는 아무것도 보내지 않습니다. 호스트의 필수·개수 검증도 빈 선택기가 아니라 확정 레코드를 읽습니다. 선택기에서 A 선택, B 드롭, 삭제 수용으로 A 제거, 제출 순서면 B만 전송해야 합니다. 거부된 추가·삭제는 이 결과를 바꾸지 않습니다.

취소된 네이티브 리셋은 선택기, 확정 레코드, 오류, 미리보기에 아무 영향이 없습니다. 취소되지 않은 리셋은 선택기와 일시적 드래그·검증 상태를 비웁니다. 이 API는 제어 전용이므로 현재 files prop과 같은 제출 집합은 유지하며, files-change·삭제 알림은 0건입니다. 폼 리셋으로 확정 파일을 비우려는 호스트는 자체의 취소되지 않은 리셋 정책에서 명시적으로 files=[]를 설정합니다. 그 prop 갱신은 컴포넌트 콜백을 내지 않습니다. 비제어 리셋 기준선이 있는 것처럼 암시하지 않습니다. 컴포넌트가 소유한 객체 URL은 해당 확정 레코드가 실제로 제거·대체되거나 언마운트될 때만 해제합니다. 네이티브 리셋이 보관된 제어 파일에 필요한 미리보기를 해제해서는 안 됩니다. 명시적 제출 전에는 서버 전송·저장이 없습니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

수용된 프로젝트 component→integration 완료 조건은 다음과 같습니다. 필수 네이티브 선택기·스테이징 UI가 명시적 호스트 FormData/전송 드라이버와 연결되어야 합니다. 공식 지침인 추가 선택 지속, 네이티브 입력, 제출 전 전송 금지([L989–1006](https://www.krds.go.kr/html/site/component/component_09_04.html), [L1188–1189](https://www.krds.go.kr/html/site/component/component_09_04.html))는 계속 구속력을 가집니다. 드롭 문구 “업로드 시작”은 명시적 제출 경계에 맞춘 스테이징으로 해석하며, 조용히 네트워크 전송을 실행한다는 뜻이 아닙니다. 완료하려면 다음이 모두 필요합니다. 최종 집합 요청을 실제로 수락·거절하는 제어 로컬 저장소, 선택기+드롭 누적·대체, 제출된 파일 검사, 리셋 정책, 제출로 시작되는 결정적 모의 진행·실패·삭제, 미리보기 정리. 로그만 내보내거나 input type=file을 감싸기만 하는 것으로는 부족합니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, label, description, help, picker, file-input, dropzone, count, list, item, filename, size, status, progress, remove, error; staged,drag-over,uploading,success,error,disabled.

렌더링된 모든 소유 파트는 `data-krds-component="file-upload"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 씁니다. 네이티브/ARIA 상태가 우선합니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

지원하는 케이스 축: `single`, `multiple`, `button`, `dropzone`, `pending`, `success`, `error`. 이 케이스 이름은 프로젝트의 독립 축입니다. 공식 KRDS 유형 이름이나 완료된 커버리지를 뜻하지 않습니다.

[필수 네이티브 스토리 매니페스트](/sources/catalog/full-catalog-stories.json.txt) · [파일럿 스토리 매니페스트](/sources/catalog/story-cases.json.txt) · [커버리지 근거와 네이티브 리뷰 링크](/sources/catalog/coverage.json.txt)

필수 전체 카탈로그 스토리: `krds-file-upload--single`, `krds-file-upload--multiple`, `krds-file-upload--button`, `krds-file-upload--dropzone`, `krds-file-upload--cancel-reselect`, `krds-file-upload--constraints-error`, `krds-file-upload--submit-mock-progress`, `krds-file-upload--failure-retry`, `krds-file-upload--form-reset`, `krds-file-upload--picker-drop-remove-submit`, `krds-file-upload--controlled-add-rejected`, `krds-file-upload--controlled-remove-rejected`, `krds-file-upload--single-replacement`, `krds-file-upload--controlled-reset-retained`, `krds-file-upload--host-reset-clear`.

### 로컬 네이티브 스토리 {#local-native-stories}

픽스처와 Storybook 출력은 로컬 전용입니다. 이 공개 문서 사이트에 올리지 않습니다. 로컬 문서 서버도 그쪽으로 리디렉션하지 않습니다. 각 네이티브 Storybook은 자기 워크스페이스 스크립트로 실행합니다. 컴포넌트 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/` 아래에 조립된 네이티브 미리보기입니다. Solid 2에는 지원되는 네이티브 Storybook 통합이 없습니다. Qwik 프로덕션 SSR/resume에는 실제 서버가 필요합니다. 정적 미리보기로 대신할 수 없습니다. 스토리가 있다고 동작 인수가 성립하지는 않습니다.

네이티브 컴파일러 체크포인트입니다. 소스 해시는 문서를 빌드할 때마다 검증합니다. 이 기록은 최신 네이티브 후보나 동작 인수를 인증하지 않습니다. 검사된 소스 페이지마다 체크포인트 범위가 적혀 있습니다.

- react: [검사된 소비 코드 보기](/examples/react-1); [소스 그대로 내려받기](/sources/packages/react/examples/catalog.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [검사된 소비 코드 보기](/examples/solid-3); [소스 그대로 내려받기](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [검사된 소비 코드 보기](/examples/svelte-46); [소스 그대로 내려받기](/sources/apps/fixture-svelte/src/public-examples/FileUploadExample.svelte.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [검사된 소비 코드 보기](/examples/vue-58); [소스 그대로 내려받기](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [검사된 소비 코드 보기](/examples/lit-60); [소스 그대로 내려받기](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [검사된 소비 코드 보기](/examples/qwik-61); [소스 그대로 내려받기](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [검사된 소비 코드 보기](/examples/angular-62); [소스 그대로 내려받기](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## 출처와 권리 {#source-identity-and-rights}

기준선: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. 공식 상세 스냅숏 수집 시각: `2026-10-29T23:28:05.532Z`. SHA-256: `c498892258d66f642e54152aa6518c4520d58df848739038014bda505e180cb3`. [고정된 컴포넌트 출처 기록](/sources/catalog/components.json.txt) · [공식 출처](https://www.krds.go.kr/html/site/component/component_09_04.html). 원본 HTML은 체크아웃의 참고 근거로만 남습니다. 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
