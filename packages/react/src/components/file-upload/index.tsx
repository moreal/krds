import { useId, useRef, useState, useLayoutEffect, useEffect } from 'react';
import type { FileUploadContract, FileRecord, FileValidationFailure } from '@unofficial-krds/contracts';
import { part, unique, useFormReset } from '../../catalog-utils.js';
export interface FileUploadProps extends FileUploadContract {
    variant?: 'button' | 'dropzone';
}
/** Append one enabled committed store. The ephemeral chooser is deliberately unnamed, so unrelated same-name native fields and other uploaders remain intact. */
export function appendFileUploadFormData(data: FormData, name: string, files: readonly FileRecord[], disabled = false) { if (!disabled)
    for (const record of files)
        data.append(name, record.file, record.file.name); return data; }
export function FileUpload({ files, name, label, multiple = false, accept, maxFiles, maxBytes, disabled = false, onFilesChange, onFilesRejected, variant = 'dropzone' }: FileUploadProps) {
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
    return <div {...part('file-upload', 'root', disabled ? 'disabled' : drag ? 'drag-over' : '')} data-krds-variant={variant} ref={root} role="group" aria-labelledby={`${id}-label`}><p {...part('file-upload', 'label')} id={`${id}-label`}>{label}</p><p {...part('file-upload', 'help')} id={`${id}-help`}>{accept ?? '모든 형식'}{maxBytes !== undefined ? ` / 최대 ${maxBytes}바이트` : ''}{maxFiles !== undefined ? ` / 최대 ${maxFiles}개` : ''}</p><input {...part('file-upload', 'file-input')} ref={input} id={id} data-krds-file-name={name} type="file" tabIndex={-1} aria-hidden="true" multiple={multiple} accept={accept} disabled={disabled} onChange={e => { const selected = [...e.currentTarget.files ?? []]; select(selected, 'picker'); e.currentTarget.value = ''; }}/><button {...part('file-upload', 'picker')} ref={picker} type="button" disabled={disabled} id={`${id}-picker`} aria-describedby={`${id}-help${errors.length ? ` ${id}-errors` : ''}`} onClick={() => input.current?.click()}>파일 선택</button>{variant !== 'button' && <div {...part('file-upload', 'dropzone')} onDragOver={e => { e.preventDefault(); if (!disabled)
        setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); select([...e.dataTransfer.files], 'drop'); }}>파일을 끌어 놓거나 파일 선택을 이용하세요.</div>}<p {...part('file-upload', 'count')}>{files.length}{maxFiles !== undefined ? ` / ${maxFiles}` : ''}개</p><ul {...part('file-upload', 'list')}>{files.map((record, i) => <li {...part('file-upload', 'item', record.status)} key={record.id}><span {...part('file-upload', 'filename')} id={`${record.id}-name`}>{record.file.name}</span><span {...part('file-upload', 'size')}>{record.file.size} 바이트</span><span {...part('file-upload', 'status')}>{record.status === 'staged' ? '선택됨' : record.status === 'uploading' ? '업로드 중' : record.status === 'success' ? '완료' : '오류'}</span>{record.status === 'uploading' && <progress {...part('file-upload', 'progress')} max={100} value={record.progress} aria-valuenow={record.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${record.file.name} 진행률`}/>}{record.error && <p {...part('file-upload', 'error')}>{record.error}</p>}<button {...part('file-upload', 'remove')} type="button" disabled={disabled} data-file-id={record.id} aria-label={`${record.file.name} 삭제`} aria-describedby={`${record.id}-name`} onClick={() => { pendingRemoval.current = { id: record.id, previous: files[i - 1]?.id, next: files[i + 1]?.id }; onFilesChange({ value: files.filter(f => f.id !== record.id), reason: 'remove', addedIds: [], removedIds: [record.id] }); }}>삭제</button></li>)}</ul>{errors.length > 0 && <div id={`${id}-errors`}>{errors.map((error, i) => <p {...part('file-upload', 'error')} key={i} role="alert">{error.file.name}: {error.message}</p>)}</div>}</div>;
}
