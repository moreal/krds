---
title: 'File upload'
---

# File upload {#file-upload}

**파일 업로드** — 파일을 고르고 올리기 전에 목록으로 확인하게 합니다.

## 사용법 {#usage}

- 신청서의 첨부 서류처럼 사용자가 파일을 골라 폼과 함께 제출해야 할 때 씁니다. 첨부가 꼭 필요한 경우에만 요구합니다.
- 서로 관련 없는 파일은 파일마다 단일 업로드를 따로 두고, 사진 여러 장처럼 한 묶음인 파일은 `multiple`로 받습니다.
- 파일 형식, 크기, 개수 제한이 있으면 도움말로 미리 알립니다. 형식과 크기는 가능한 한 제한하지 않습니다.
- 파일을 골랐다고 바로 서버로 보내지 않습니다. 사용자가 폼을 제출할 때 전송합니다.
- 파일 목록이 아래로 길어지므로 여러 파일 업로드는 모달 안에 두지 않습니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `files` **필수** | `readonly FileRecord[]` | — | 현재 첨부된 파일 목록입니다. 항상 직접 관리하며 처음에는 `[]`를 넘깁니다. 각 항목은 고유한 `id`, 실제 `file`, `status`(`staged`, `uploading`, `success`, `error`)와 선택적인 `progress`, `error`를 가집니다. |
| `name` **필수** | `string` | — | 폼 제출에 쓰는 필드 이름입니다. |
| `label` **필수** | `string` | — | 업로드 영역의 레이블입니다. 어떤 용도의 파일을 올려야 하는지 알 수 있게 씁니다. |
| `multiple` | `boolean` | `false` | `true`이면 새로 고른 파일을 기존 목록 뒤에 추가합니다. `false`이면 새 파일이 기존 파일을 대체하고, 여러 파일을 한꺼번에 끌어다 놓으면 모두 거부합니다. |
| `accept` | `string` | — | 허용하는 파일 형식입니다. 파일 선택 창의 필터로 쓰이고, 맞지 않는 파일은 거부합니다. |
| `maxFiles` | `number` | — | 첨부할 수 있는 최대 파일 수입니다. 넘치는 파일은 거부하고 기존 파일은 그대로 둡니다. |
| `maxBytes` | `number` | — | 파일 하나의 최대 크기(바이트)입니다. 넘는 파일은 거부합니다. |
| `disabled` | `boolean` | `false` | `true`이면 파일을 고르거나 삭제할 수 없습니다. |
| `onFilesChange` **필수** | `(detail: {value: readonly FileRecord[]; reason: 'picker' \| 'drop' \| 'remove'; addedIds: readonly string[]; removedIds: readonly string[]}) => void` | — | 사용자가 파일을 추가하거나 삭제하려 할 때 한 번 불립니다. 바뀐 뒤의 전체 목록 `value`, 원인 `reason`(`picker`, `drop`, `remove`), `addedIds`, `removedIds`를 받습니다. 받은 `value`를 `files`로 다시 넘겨야 화면에 반영됩니다. |
| `onFilesRejected` | `(detail: {rejected: readonly FileValidationFailure[]}) => void` | — | 형식, 크기, 개수 제한에 걸려 받지 못한 파일이 있을 때 불립니다. `rejected`의 각 항목은 `file`, `code`(`accept`, `max-files`, `max-bytes`), `message`를 가집니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

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

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 파일 선택 버튼(또는 드롭 영역)과 각 파일의 삭제 버튼 사이를 이동합니다. |
| `Enter` / `Space` | 파일 선택 버튼에서는 파일 선택 창을 열고, 삭제 버튼에서는 해당 파일을 삭제합니다. |

## 접근성 {#accessibility}

- 실제 `input type="file"`을 쓰므로 화면 낭독기가 파일 업로드로 인식하고, 끌어다 놓기 없이 클릭이나 키보드만으로도 파일을 고를 수 있습니다.
- 파일 하나는 `p`로, 여러 파일은 `ul`과 `li`로 묶고, 삭제 버튼을 해당 파일 이름과 연결해 어떤 파일을 지우는지 알려 줍니다.
- 긴 파일 이름은 화면에서 한 줄로 줄여 보여 주지만 화면 낭독기에는 전체 이름을 전달합니다.
- 파일을 삭제하면 초점이 앞 파일의 삭제 버튼으로, 없으면 다음 파일의 삭제 버튼으로, 그것도 없으면 파일 선택 버튼으로 옮겨 갑니다.
- 업로드 중, 성공, 오류 상태는 아이콘과 텍스트를 함께 보여 줍니다. 오류는 `error`에 구체적인 이유를 담아 넘깁니다.

## 알아 둘 점 {#notes}

- `onFilesChange`에서 받은 목록을 `files`에 반영하지 않으면 추가와 삭제가 일어나지 않습니다.
- 선택한 파일은 브라우저의 기본 폼 제출에 자동으로 들어가지 않습니다. 제출할 때 `files`의 각 `file`을 `FormData`에 `name`으로 직접 추가해 보냅니다.
- `status`와 `progress`는 전송을 진행하면서 직접 갱신합니다.
- 폼을 초기화해도 `files`는 그대로입니다. 함께 비우려면 `files`에 `[]`를 넘깁니다.
- 파일을 고른 뒤에도 선택 버튼은 계속 쓸 수 있고, 삭제한 파일을 다시 고를 수 있습니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `staged`, `drag-over`, `uploading`, `success`, `error`, `disabled` |
| `label` | 없음 |
| `description` | 없음 |
| `help` | 없음 |
| `picker` | `disabled` |
| `file-input` | `disabled` |
| `dropzone` | `drag-over`, `disabled` |
| `count` | 없음 |
| `list` | `disabled` |
| `item` | `staged`, `uploading`, `success`, `error`, `disabled` |
| `filename` | 없음 |
| `size` | 없음 |
| `status` | `staged`, `uploading`, `success`, `error` |
| `progress` | `uploading`, `success`, `error` |
| `remove` | `disabled` |
| `error` | `error` |

```css
[data-krds-component="file-upload"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_09_04.html)
- [상세 명세](/sources/specs/components/file-upload.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
