---
title: 'File upload · 파일 업로드'
---

# File upload

파일 업로드 · `FileUpload` · integration

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_09_04.html) · [Full reviewed specification](/sources/specs/components/file-upload.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/file-upload/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.0.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/file-upload/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/FileUpload.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/file-upload/FileUpload.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/file-upload/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/file-upload/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-file-upload.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

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

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `files` | yes | `readonly FileRecord[]` | data / state |
| `name` | yes | `string` | data / state |
| `label` | yes | `string` | data / state |
| `multiple` | no | `boolean` | data / state |
| `accept` | no | `string` | data / state |
| `maxFiles` | no | `number` | data / state |
| `maxBytes` | no | `number` | data / state |
| `disabled` | no | `boolean` | data / state |
| `onFilesChange` | yes | `(detail: {value: readonly FileRecord[]; reason: 'picker' \| 'drop' \| 'remove'; addedIds: readonly string[]; removedIds: readonly string[]}) => void` | semantic event request |
| `onFilesRejected` | no | `(detail: {rejected: readonly FileValidationFailure[]}) => void` | semantic event request |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Section label/title, optional description, explicit type/size/count constraints, real file-picker control, optional dropzone, count and file records (name/extension/size/status/remove). Single file uses p grouping; multiple ul/li. Remove button described by corresponding file text. Long filename one visual line with full accessible name.

### Plain semantic API

Choose a **controlled-only committed file set**: required `files: readonly FileRecord[]`, initially supplied explicitly as `[]`; there is no defaultFiles or uncontrolled nonempty/empty baseline. `FileRecord={id:string,file:File,status:staged|uploading|success|error,progress?:number,error?:string}` has a unique stable ID and the actual immutable File handle, not a pathname or renderer/machine object. Other props: multiple=false, accept?, maxFiles?, maxBytes?, disabled=false, name. A retained browser File is intentionally supported native file data; callbacks never carry a native Event object. Changing/removing files happens only when the host supplies the new files prop. Mount/hydration/prop/reset/reconciliation emits no user-change callback.

One accepted candidate selection/removal request calls only `onFilesChange({value:FileRecord[],reason:picker|drop|remove,addedIds:string[],removedIds:string[]})` once, carrying the **complete requested final set**. Remove uses this same event; there is no second onRemove request. Rejected validation candidates report once through separate `onFilesRejected({rejected:{file,code,message}[]})` and visible associated errors; this is validation feedback, not a changed-value notification. If no valid candidate changes the requested set, emit no onFilesChange. A controlled host may decline a valid request; display, count, actual submitted set and retained previews remain based on committed files, with no optimistic removal/addition leaking into FormData.

For multiple=true, picker selections and drops append valid candidates in supplied order after the current committed set; retain all existing files. Validate type/extension/size, then available count slots in order and report rejected excess without removing existing records. Distinct newly chosen File objects get new IDs, even when filenames/metadata coincide; no content-deduplication claim is made. The exact same already-committed File object is a no-op duplicate. For multiple=false, one valid candidate replaces the current set; a multi-file drop is rejected as a whole with count guidance rather than silently choosing one. Invalid or canceled selection never clears the prior set. accept remains a picker hint; no fabricated password/virus checking or transfer on selection.

### Keyboard, focus and state transitions

Native picker owns OS keyboard navigation and opens only from a real user action. Dropzone includes the click/keyboard picker equivalent. Snapshot chosen File objects, then clear only the ephemeral native chooser value so the same file can be chosen again; that chooser is not the committed file store. Cancel emits neither files-change nor rejection and preserves committed records. Remove requests the final set once; **after actual accepted removal**, restore focus to prior remaining removal control, else next, else picker. Rejected removal keeps its record/control/focus. Keep the input and picker stable during native list updates. Addition does not start host transfer; pending/success/error records come from explicit Submit-driven host state.

### Responsive/mobile requirements

No multi-file modal layout; narrow list remains readable, count visible, drag hint does not exclude touch users. Pending/success/error icons plus text; selection control remains available after successful addition unless host disables input.

### Forms, reset and composition

The real native file input remains required as the user picker, but its ephemeral FileList does not represent an accumulated picker+drop store. Never set a nonempty input.value or claim that native FormData automatically contains the committed array. The host submission driver must remove this field's ephemeral chooser entries and append exactly the **current committed enabled** records as `FormData.append(name,record.file,record.file.name)` on explicit Submit (disabled uploader contributes none). Host required/count validation likewise reads committed records rather than an empty chooser. A picker A → drop B → accepted remove A → Submit must send only B; rejected additions/removals must not change that result.

Canceled native reset is a no-op for chooser, committed records, errors and previews. Noncanceled reset clears the chooser and transient drag/validation state but, as this API is controlled-only, retains the current files prop and the same submitted set, with zero files-change/removal notifications. A host that wants a form reset to clear committed files explicitly sets files=[] from its own noncanceled reset policy; that prop update emits no component callback. Do not imply an uncontrolled reset baseline. Revoke component-owned object URLs only when their committed records are actually removed/replaced or on unmount; a native reset must not revoke a preview still needed by retained controlled files. No server transfer/storage before explicit Submit.

### Asset, integration and composition completion

Accepted project component→integration completion: mandatory native picker/staging UI connects to an explicit host FormData/transfer driver. The official continued-addition/native-input/no-transfer-before-Submit guidance ([L989–1006](https://www.krds.go.kr/html/site/component/component_09_04.html), [L1188–1189](https://www.krds.go.kr/html/site/component/component_09_04.html)) remains binding; drop wording “start upload” is interpreted as staging against the explicit Submit boundary, not silently executed as a network transfer. Completion requires a controlled local store that actually accepts/declines final-set requests, picker+drop accumulation/replacement, submitted-file inspection, reset policy, deterministic Submit-triggered mock progress/failure/removal and preview cleanup. Merely emitting logs or wrapping input type=file is insufficient.

### Stable parts and states

root, label, description, help, picker, file-input, dropzone, count, list, item, filename, size, status, progress, remove, error; staged,drag-over,uploading,success,error,disabled.

All rendered owned parts use `data-krds-component="file-upload"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `single`, `multiple`, `button`, `dropzone`, `pending`, `success`, `error`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-file-upload--single`, `krds-file-upload--multiple`, `krds-file-upload--button`, `krds-file-upload--dropzone`, `krds-file-upload--cancel-reselect`, `krds-file-upload--constraints-error`, `krds-file-upload--submit-mock-progress`, `krds-file-upload--failure-retry`, `krds-file-upload--form-reset`, `krds-file-upload--picker-drop-remove-submit`, `krds-file-upload--controlled-add-rejected`, `krds-file-upload--controlled-remove-rejected`, `krds-file-upload--single-replacement`, `krds-file-upload--controlled-reset-retained`, `krds-file-upload--host-reset-clear`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Single](/native/storybook-react/?path=/story/krds-file-upload--single) · [Multiple](/native/storybook-react/?path=/story/krds-file-upload--multiple) · [Button](/native/storybook-react/?path=/story/krds-file-upload--button) · [Dropzone](/native/storybook-react/?path=/story/krds-file-upload--dropzone) · [Cancel Reselect](/native/storybook-react/?path=/story/krds-file-upload--cancel-reselect) · [Constraints Error](/native/storybook-react/?path=/story/krds-file-upload--constraints-error) · [Submit Mock Progress](/native/storybook-react/?path=/story/krds-file-upload--submit-mock-progress) · [Failure Retry](/native/storybook-react/?path=/story/krds-file-upload--failure-retry) · [Form Reset](/native/storybook-react/?path=/story/krds-file-upload--form-reset) · [Picker Drop Remove Submit](/native/storybook-react/?path=/story/krds-file-upload--picker-drop-remove-submit) · [Controlled Add Rejected](/native/storybook-react/?path=/story/krds-file-upload--controlled-add-rejected) · [Controlled Remove Rejected](/native/storybook-react/?path=/story/krds-file-upload--controlled-remove-rejected) · [Single Replacement](/native/storybook-react/?path=/story/krds-file-upload--single-replacement) · [Controlled Reset Retained](/native/storybook-react/?path=/story/krds-file-upload--controlled-reset-retained) · [Host Reset Clear](/native/storybook-react/?path=/story/krds-file-upload--host-reset-clear).
- solid: [single](/native/storybook-solid/?path=/story/krds-file-upload--single) · [multiple](/native/storybook-solid/?path=/story/krds-file-upload--multiple) · [button](/native/storybook-solid/?path=/story/krds-file-upload--button) · [dropzone](/native/storybook-solid/?path=/story/krds-file-upload--dropzone) · [cancel-reselect](/native/storybook-solid/?path=/story/krds-file-upload--cancel-reselect) · [constraints-error](/native/storybook-solid/?path=/story/krds-file-upload--constraints-error) · [submit-mock-progress](/native/storybook-solid/?path=/story/krds-file-upload--submit-mock-progress) · [failure-retry](/native/storybook-solid/?path=/story/krds-file-upload--failure-retry) · [form-reset](/native/storybook-solid/?path=/story/krds-file-upload--form-reset) · [picker-drop-remove-submit](/native/storybook-solid/?path=/story/krds-file-upload--picker-drop-remove-submit) · [controlled-add-rejected](/native/storybook-solid/?path=/story/krds-file-upload--controlled-add-rejected) · [controlled-remove-rejected](/native/storybook-solid/?path=/story/krds-file-upload--controlled-remove-rejected) · [single-replacement](/native/storybook-solid/?path=/story/krds-file-upload--single-replacement) · [controlled-reset-retained](/native/storybook-solid/?path=/story/krds-file-upload--controlled-reset-retained) · [host-reset-clear](/native/storybook-solid/?path=/story/krds-file-upload--host-reset-clear).
- svelte: [single](/native/storybook-svelte/?path=/story/krds-file-upload--single) · [multiple](/native/storybook-svelte/?path=/story/krds-file-upload--multiple) · [button](/native/storybook-svelte/?path=/story/krds-file-upload--button) · [dropzone](/native/storybook-svelte/?path=/story/krds-file-upload--dropzone) · [cancel-reselect](/native/storybook-svelte/?path=/story/krds-file-upload--cancel-reselect) · [constraints-error](/native/storybook-svelte/?path=/story/krds-file-upload--constraints-error) · [submit-mock-progress](/native/storybook-svelte/?path=/story/krds-file-upload--submit-mock-progress) · [failure-retry](/native/storybook-svelte/?path=/story/krds-file-upload--failure-retry) · [form-reset](/native/storybook-svelte/?path=/story/krds-file-upload--form-reset) · [picker-drop-remove-submit](/native/storybook-svelte/?path=/story/krds-file-upload--picker-drop-remove-submit) · [controlled-add-rejected](/native/storybook-svelte/?path=/story/krds-file-upload--controlled-add-rejected) · [controlled-remove-rejected](/native/storybook-svelte/?path=/story/krds-file-upload--controlled-remove-rejected) · [single-replacement](/native/storybook-svelte/?path=/story/krds-file-upload--single-replacement) · [controlled-reset-retained](/native/storybook-svelte/?path=/story/krds-file-upload--controlled-reset-retained) · [host-reset-clear](/native/storybook-svelte/?path=/story/krds-file-upload--host-reset-clear).
- vue: [single](/native/storybook-vue/?path=/story/krds-file-upload--single) · [multiple](/native/storybook-vue/?path=/story/krds-file-upload--multiple) · [button](/native/storybook-vue/?path=/story/krds-file-upload--button) · [dropzone](/native/storybook-vue/?path=/story/krds-file-upload--dropzone) · [cancel-reselect](/native/storybook-vue/?path=/story/krds-file-upload--cancel-reselect) · [constraints-error](/native/storybook-vue/?path=/story/krds-file-upload--constraints-error) · [submit-mock-progress](/native/storybook-vue/?path=/story/krds-file-upload--submit-mock-progress) · [failure-retry](/native/storybook-vue/?path=/story/krds-file-upload--failure-retry) · [form-reset](/native/storybook-vue/?path=/story/krds-file-upload--form-reset) · [picker-drop-remove-submit](/native/storybook-vue/?path=/story/krds-file-upload--picker-drop-remove-submit) · [controlled-add-rejected](/native/storybook-vue/?path=/story/krds-file-upload--controlled-add-rejected) · [controlled-remove-rejected](/native/storybook-vue/?path=/story/krds-file-upload--controlled-remove-rejected) · [single-replacement](/native/storybook-vue/?path=/story/krds-file-upload--single-replacement) · [controlled-reset-retained](/native/storybook-vue/?path=/story/krds-file-upload--controlled-reset-retained) · [host-reset-clear](/native/storybook-vue/?path=/story/krds-file-upload--host-reset-clear).
- lit: [Single](/native/storybook-lit/?path=/story/krds-file-upload--single) · [Multiple](/native/storybook-lit/?path=/story/krds-file-upload--multiple) · [Button](/native/storybook-lit/?path=/story/krds-file-upload--button) · [Dropzone](/native/storybook-lit/?path=/story/krds-file-upload--dropzone) · [Cancel Reselect](/native/storybook-lit/?path=/story/krds-file-upload--cancel-reselect) · [Constraints Error](/native/storybook-lit/?path=/story/krds-file-upload--constraints-error) · [Submit Mock Progress](/native/storybook-lit/?path=/story/krds-file-upload--submit-mock-progress) · [Failure Retry](/native/storybook-lit/?path=/story/krds-file-upload--failure-retry) · [Form Reset](/native/storybook-lit/?path=/story/krds-file-upload--form-reset) · [Picker Drop Remove Submit](/native/storybook-lit/?path=/story/krds-file-upload--picker-drop-remove-submit) · [Controlled Add Rejected](/native/storybook-lit/?path=/story/krds-file-upload--controlled-add-rejected) · [Controlled Remove Rejected](/native/storybook-lit/?path=/story/krds-file-upload--controlled-remove-rejected) · [Single Replacement](/native/storybook-lit/?path=/story/krds-file-upload--single-replacement) · [Controlled Reset Retained](/native/storybook-lit/?path=/story/krds-file-upload--controlled-reset-retained) · [Host Reset Clear](/native/storybook-lit/?path=/story/krds-file-upload--host-reset-clear).
- qwik: [single](/native/storybook-qwik/?path=/story/krds-file-upload--single) · [multiple](/native/storybook-qwik/?path=/story/krds-file-upload--multiple) · [button](/native/storybook-qwik/?path=/story/krds-file-upload--button) · [dropzone](/native/storybook-qwik/?path=/story/krds-file-upload--dropzone) · [cancel-reselect](/native/storybook-qwik/?path=/story/krds-file-upload--cancel-reselect) · [constraints-error](/native/storybook-qwik/?path=/story/krds-file-upload--constraints-error) · [submit-mock-progress](/native/storybook-qwik/?path=/story/krds-file-upload--submit-mock-progress) · [failure-retry](/native/storybook-qwik/?path=/story/krds-file-upload--failure-retry) · [form-reset](/native/storybook-qwik/?path=/story/krds-file-upload--form-reset) · [picker-drop-remove-submit](/native/storybook-qwik/?path=/story/krds-file-upload--picker-drop-remove-submit) · [controlled-add-rejected](/native/storybook-qwik/?path=/story/krds-file-upload--controlled-add-rejected) · [controlled-remove-rejected](/native/storybook-qwik/?path=/story/krds-file-upload--controlled-remove-rejected) · [single-replacement](/native/storybook-qwik/?path=/story/krds-file-upload--single-replacement) · [controlled-reset-retained](/native/storybook-qwik/?path=/story/krds-file-upload--controlled-reset-retained) · [host-reset-clear](/native/storybook-qwik/?path=/story/krds-file-upload--host-reset-clear).
- angular: [single](/native/storybook-angular/?path=/story/krds-file-upload--single) · [multiple](/native/storybook-angular/?path=/story/krds-file-upload--multiple) · [button](/native/storybook-angular/?path=/story/krds-file-upload--button) · [dropzone](/native/storybook-angular/?path=/story/krds-file-upload--dropzone) · [cancel-reselect](/native/storybook-angular/?path=/story/krds-file-upload--cancel-reselect) · [constraints-error](/native/storybook-angular/?path=/story/krds-file-upload--constraints-error) · [submit-mock-progress](/native/storybook-angular/?path=/story/krds-file-upload--submit-mock-progress) · [failure-retry](/native/storybook-angular/?path=/story/krds-file-upload--failure-retry) · [form-reset](/native/storybook-angular/?path=/story/krds-file-upload--form-reset) · [picker-drop-remove-submit](/native/storybook-angular/?path=/story/krds-file-upload--picker-drop-remove-submit) · [controlled-add-rejected](/native/storybook-angular/?path=/story/krds-file-upload--controlled-add-rejected) · [controlled-remove-rejected](/native/storybook-angular/?path=/story/krds-file-upload--controlled-remove-rejected) · [single-replacement](/native/storybook-angular/?path=/story/krds-file-upload--single-replacement) · [controlled-reset-retained](/native/storybook-angular/?path=/story/krds-file-upload--controlled-reset-retained) · [host-reset-clear](/native/storybook-angular/?path=/story/krds-file-upload--host-reset-clear).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-46); [download exact source](/sources/apps/fixture-svelte/src/public-examples/FileUploadExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:05.532Z`. SHA-256: `c498892258d66f642e54152aa6518c4520d58df848739038014bda505e180cb3`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_09_04.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
