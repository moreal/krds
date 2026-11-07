import { useId, useRef, useState, useLayoutEffect, useEffect } from 'react';
import type { FileUploadContract, FileRecord, FileValidationFailure } from '@unofficial-krds/contracts';
import { part, states, unique, useFormReset } from '../../catalog-utils.js';
export interface FileUploadProps extends FileUploadContract {
    variant?: 'button' | 'dropzone';
}
/** Append one enabled committed store. The ephemeral chooser is deliberately unnamed, so unrelated same-name native fields and other uploaders remain intact. */
export function appendFileUploadFormData(data: FormData, name: string, files: readonly FileRecord[], disabled = false) { if (!disabled)
    for (const record of files)
        data.append(name, record.file, record.file.name); return data; }
export function FileUpload({ files, name, label, multiple = false, accept, maxFiles, maxBytes, disabled = false, onFilesChange, onFilesRejected, variant = 'button' }: FileUploadProps) {
    const id = useId();
    const sequence = useRef(0);
    const input = useRef<HTMLInputElement>(null);
    const root = useRef<HTMLDivElement>(null);
    const picker = useRef<HTMLButtonElement>(null);
    const [drag, setDrag] = useState(false);
    const [errors, setErrors] = useState<readonly FileValidationFailure[]>([]);
    const pendingRemoval = useRef<{
        id: string;
        previous?: string;
        next?: string;
    } | undefined>(undefined);
    unique(files.map(f => f.id), 'FileUpload');
    const matches = (file: File) => !accept || accept.split(',').some(raw => { const token = raw.trim().toLowerCase(); return token.startsWith('.') ? file.name.toLowerCase().endsWith(token) : token.endsWith('/*') ? file.type.startsWith(token.slice(0, -1)) : file.type.toLowerCase() === token; });
    const select = (incoming: File[], reason: 'picker' | 'drop') => {
        if (disabled || !incoming.length)
            return;
        const rejected: FileValidationFailure[] = [];
        const valid: File[] = [];
        if (!multiple && incoming.length > 1) {
            for (const file of incoming)
                rejected.push({ file, code: 'max-files', message: '한 파일만 선택하세요.' });
        }
        else
            for (const file of incoming) {
                if (files.some(record => record.file === file))
                    continue;
                if (!matches(file))
                    rejected.push({ file, code: 'accept', message: '허용되지 않은 파일 형식입니다.' });
                else if (maxBytes !== undefined && file.size > maxBytes)
                    rejected.push({ file, code: 'max-bytes', message: '파일 크기 제한을 초과했습니다.' });
                else if (multiple && maxFiles !== undefined && files.length + valid.length >= maxFiles)
                    rejected.push({ file, code: 'max-files', message: '최대 파일 수를 초과했습니다.' });
                else
                    valid.push(file);
            }
        setErrors(rejected);
        if (rejected.length)
            onFilesRejected?.({ rejected });
        if (valid.length) {
            const added = valid.map(file => ({ id: `${id}-file-${++sequence.current}`, file, status: 'staged' as const }));
            onFilesChange({ value: multiple ? [...files, ...added] : added, reason, addedIds: added.map(f => f.id), removedIds: multiple ? [] : files.map(f => f.id) });
        }
    };
    useLayoutEffect(() => { const pending = pendingRemoval.current; if (!pending || files.some(f => f.id === pending.id))
        return; pendingRemoval.current = undefined; const buttons = [...root.current?.querySelectorAll<HTMLButtonElement>('[data-file-id]') ?? []]; const target = buttons.find(b => b.dataset.fileId === pending.previous) ?? buttons.find(b => b.dataset.fileId === pending.next) ?? picker.current; target?.focus(); }, [files]);
    useFormReset(input,()=>{if(input.current)input.current.value='';setErrors([]);setDrag(false);},()=>{});
    return <div {...part('file-upload', 'root', states(disabled && 'disabled', drag && 'drag-over', ...files.map(f => f.status)))} data-krds-variant={variant} ref={root}><label {...part('file-upload', 'label')} id={`${id}-label`} htmlFor={id}>{label}</label><p {...part('file-upload', 'help')} id={`${id}-help`}>{accept ? `파일 형식: ${accept}` : '모든 형식'}{maxBytes !== undefined ? ` / 최대 ${maxBytes}바이트` : ''}{maxFiles !== undefined ? ` / 최대 ${maxFiles}개` : ''}</p><input {...part('file-upload', 'file-input', disabled ? 'disabled' : '')} ref={input} id={id} data-krds-file-name={name} type="file" tabIndex={-1} aria-hidden="true" multiple={multiple} accept={accept} disabled={disabled} onChange={e => { const selected = [...e.currentTarget.files ?? []]; select(selected, 'picker'); e.currentTarget.value = ''; }}/><button {...part('file-upload', 'picker', disabled ? 'disabled' : '')} ref={picker} type="button" disabled={disabled} id={`${id}-picker`} aria-labelledby={`${id}-picker ${id}-label`} aria-describedby={`${id}-help${errors.length ? ` ${id}-errors` : ''}`} onClick={() => input.current?.click()}>파일 선택</button>{variant === 'dropzone' && <div {...part('file-upload', 'dropzone', states(disabled && 'disabled', drag && 'drag-over'))} onDragOver={e => { e.preventDefault(); if (!disabled)
        setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); select([...e.dataTransfer.files], 'drop'); }}>파일을 놓거나 파일 선택 버튼을 사용하세요.</div>}<p {...part('file-upload', 'count')}>선택 파일 {files.length}{maxFiles !== undefined ? ` / ${maxFiles}` : ''}</p><ul {...part('file-upload', 'list', disabled ? 'disabled' : '')}>{files.map((record, i) => <li {...part('file-upload', 'item', states(record.status, disabled && 'disabled'))} key={record.id}><span {...part('file-upload', 'filename')}>{record.file.name}</span><span {...part('file-upload', 'status', record.status)}>{record.status === 'staged' ? '제출 대기' : record.status === 'uploading' ? '업로드 중' : record.status === 'success' ? '완료' : '실패'}</span>{record.progress !== undefined && <progress {...part('file-upload', 'progress', record.status)} max={100} value={record.progress} aria-valuenow={record.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${record.file.name} 업로드 진행`}/>} {record.error && <span {...part('file-upload', 'error', 'error')}>{record.error}</span>}<button {...part('file-upload', 'remove', disabled ? 'disabled' : '')} type="button" disabled={disabled} data-file-id={record.id} aria-label={`${record.file.name} 삭제`} onClick={() => { pendingRemoval.current = { id: record.id, previous: files[i - 1]?.id, next: files[i + 1]?.id }; onFilesChange({ value: files.filter(f => f.id !== record.id), reason: 'remove', addedIds: [], removedIds: [record.id] }); }}>삭제</button></li>)}</ul>{errors.length > 0 && <ul {...part('file-upload', 'error', 'error')} id={`${id}-errors`} role="status">{errors.map((error, i) => <li key={i}>{error.file.name}: {error.message}</li>)}</ul>}</div>;
}
