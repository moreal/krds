import { For, Show, createEffect, createSignal, createUniqueId } from 'solid-js';
import type { FileUploadContract, FileRecord, FileValidationFailure } from '@unofficial-krds/contracts';
import { owned, keyedItems, resetField } from '../../internal/catalog';
export interface FileUploadProps extends FileUploadContract {
    variant?: 'button' | 'dropzone';
    description?: string;
}
/** Explicit submit helpers append the committed set, never the ephemeral chooser list. */
export function appendCommittedFiles(data: FormData, name: string, files: readonly FileRecord[], disabled = false) { data.delete(name); if (!disabled)
    files.forEach(record => data.append(name, record.file, record.file.name)); return data; }
export function FileUpload(props: FileUploadProps) {
    const uid = createUniqueId();
    const stableFiles = keyedItems(() => props.files);
    let input!: HTMLInputElement;
    let root!: HTMLDivElement;
    let serial = 0;
    const [drag, setDrag] = createSignal(false);
    const [errors, setErrors] = createSignal<readonly FileValidationFailure[]>([]);
    let removing: {
        id: string;
        index: number;
    } | undefined;
    createEffect(() => { const files = props.files; if (!Array.isArray(files) || new Set(files.map(file => file.id)).size !== files.length || files.some(record => !(record.file instanceof File)))
        throw new TypeError('FileUpload requires unique actual committed Files'); if (removing && !files.some(file => file.id === removing!.id)) {
        const index = removing.index;
        removing = undefined;
        queueMicrotask(() => { const buttons = root.querySelectorAll<HTMLButtonElement>('[data-krds-part="remove"]'); (buttons[Math.max(0, index - 1)] ?? buttons[index] ?? root.querySelector<HTMLButtonElement>('[data-krds-part="picker"]'))?.focus(); });
    } });
    resetField(() => root, () => { input.value = ''; setDrag(false); setErrors([]); });
    const select = (candidates: readonly File[], reason: 'picker' | 'drop') => { if (props.disabled || !candidates.length)
        return; const rejected: FileValidationFailure[] = []; const accepted: FileRecord[] = []; const reject = (file: File, code: FileValidationFailure['code'], message: string) => rejected.push({ file, code, message }); if (!props.multiple && candidates.length > 1)
        candidates.forEach(file => reject(file, 'max-files', '파일 한 개를 선택하세요.'));
    else
        for (const file of candidates) {
            if (props.files.some(record => record.file === file))
                continue;
            const filters = (props.accept ?? '').split(',').map(value => value.trim().toLowerCase()).filter(Boolean);
            const matches = !filters.length || filters.some(filter => filter.startsWith('.') ? file.name.toLowerCase().endsWith(filter) : filter.endsWith('/*') ? file.type.startsWith(filter.slice(0, -1)) : file.type === filter);
            if (!matches)
                reject(file, 'accept', '허용하지 않는 파일 형식입니다.');
            else if (props.maxBytes !== undefined && file.size > props.maxBytes)
                reject(file, 'max-bytes', '파일 크기를 확인하세요.');
            else if (props.multiple && props.maxFiles !== undefined && props.files.length + accepted.length >= props.maxFiles)
                reject(file, 'max-files', '파일 개수를 확인하세요.');
            else
                accepted.push({ id: `${uid}-${++serial}`, file, status: 'staged' });
        } setErrors(rejected); if (rejected.length)
        props.onFilesRejected?.({ rejected }); if (accepted.length) {
        const value = props.multiple ? [...props.files, ...accepted] : accepted;
        props.onFilesChange({ value, reason, addedIds: accepted.map(record => record.id), removedIds: props.multiple ? [] : props.files.map(record => record.id) });
    } };
    return <div ref={root} {...owned('file-upload', 'root', props.disabled ? 'disabled' : drag() ? 'drag-over' : '')} data-krds-variant={props.variant ?? 'dropzone'}><h3 {...owned('file-upload', 'label')}>{props.label}</h3><Show when={props.description}><p {...owned('file-upload', 'description')}>{props.description}</p></Show><p id={`${uid}-help`} {...owned('file-upload', 'help')}>{props.accept ?? '모든 형식'}{props.maxBytes ? ` / 최대 ${props.maxBytes}바이트` : ''}{props.maxFiles ? ` / 최대 ${props.maxFiles}개` : ''}</p><input ref={input} id={uid} {...owned('file-upload', 'file-input')} type="file" name={props.name} aria-label={props.label} aria-describedby={`${uid}-help`} multiple={props.multiple} accept={props.accept} disabled={props.disabled} onChange={event => { const files = Array.from(event.currentTarget.files ?? []); select(files, 'picker'); input.value = ''; }}/><button type="button" {...owned('file-upload', 'picker')} disabled={props.disabled} onClick={() => input.click()}>파일 선택</button><Show when={props.variant!=='button'}><div {...owned('file-upload', 'dropzone')} onDragOver={event => { event.preventDefault(); if (!props.disabled)
        setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={event => { event.preventDefault(); setDrag(false); select(Array.from(event.dataTransfer?.files ?? []), 'drop'); }}>파일을 끌어 놓거나 파일 선택을 이용하세요.</div></Show><p {...owned('file-upload', 'count')}>{props.files.length}{props.maxFiles ? ` / ${props.maxFiles}` : ''}개</p><ul {...owned('file-upload', 'list')}><For each={stableFiles()}>{(record, index) => <li {...owned('file-upload', 'item', record.status)}><span id={`${record.id}-name`} {...owned('file-upload', 'filename')}>{record.file.name}</span><span {...owned('file-upload', 'size')}>{record.file.size} 바이트</span><span {...owned('file-upload', 'status')}>{({ staged: '선택됨', uploading: '업로드 중', success: '완료', error: '오류' })[record.status]}</span><Show when={record.status === 'uploading'}><progress {...owned('file-upload', 'progress')} max="100" value={record.progress} aria-valuemin="0" aria-valuemax="100" aria-valuenow={record.progress} aria-label={`${record.file.name} 진행률`}/></Show><Show when={record.error}><p {...owned('file-upload', 'error')}>{record.error}</p></Show><button type="button" {...owned('file-upload', 'remove')} aria-label={`${record.file.name} 삭제`} aria-describedby={`${record.id}-name`} disabled={props.disabled} onClick={() => { removing = { id: record.id, index: index() }; props.onFilesChange({ value: props.files.filter(file => file.id !== record.id), reason: 'remove', addedIds: [], removedIds: [record.id] }); }}>삭제</button></li>}</For></ul><For each={errors()}>{error => <p role="alert" {...owned('file-upload', 'error')}>{error.file.name}: {error.message}</p>}</For></div>;
}
