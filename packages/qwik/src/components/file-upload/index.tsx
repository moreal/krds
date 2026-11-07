import { $, component$, noSerialize, useSignal, useId, useVisibleTask$, type NoSerialize, type Signal } from '@builder.io/qwik';
import type { FileUploadContract, FileRecord, FileValidationFailure } from '@unofficial-krds/contracts';
import { owned, useReset, type NativeContract } from '../../internal/catalog';
export type FileUploadProps = NativeContract<FileUploadContract> & {
    variant?: 'button' | 'dropzone';
    description?: string;
};
/** Append one uploader's committed set once; preserve same-name successful siblings. */
export function appendCommittedFiles(data: FormData, name: string, files: readonly FileRecord[], disabled = false) {
    if (!disabled) for (const record of files) data.append(name, record.file, record.file.name);
    return data;
}
function firstDelivery(seen: Signal<NoSerialize<WeakSet<Event>> | undefined>, event: Event) {
    const events = seen.value ?? new WeakSet<Event>();
    if (!seen.value) seen.value = noSerialize(events);
    if (events.has(event)) return false;
    events.add(event);
    return true;
}
export const FileUpload = component$<FileUploadProps>(props => {
    const uid = useId(), root = useSignal<HTMLDivElement>(), input = useSignal<HTMLInputElement>();
    const delivered = useSignal<NoSerialize<WeakSet<Event>>>();
    const serial = useSignal(0), drag = useSignal(false), revision = useSignal(0);
    const selectionOwner=useSignal(0),selecting=useSignal(false),alive=useSignal(true),selections=useSignal<NoSerialize<Array<{files:readonly File[];reason:'picker'|'drop';generation:number}>>>();
    const errors = useSignal<{ name: string; message: string }[]>([]);
    const removing = useSignal<{ id: string; index: number }>();
    useReset(root, $(() => {
        revision.value++;
        selections.value?.splice(0);selectionOwner.value++;selecting.value=false;
        if (input.value) input.value.value = '';
        drag.value = false;
        errors.value = [];
        removing.value = undefined;
    }));
    useVisibleTask$(({ track, cleanup }) => {
        const pending = track(() => removing.value);
        track(() => props.files);
        if (!pending || props.files.some(record => record.id === pending.id)) return;
        const frame = requestAnimationFrame(() => {
            const buttons = root.value?.querySelectorAll<HTMLButtonElement>('[data-krds-part="remove"]');
            (buttons?.[pending.index - 1] ?? buttons?.[pending.index] ?? root.value?.querySelector<HTMLButtonElement>('[data-krds-part="picker"]'))?.focus();
            removing.value = undefined;
        });
        cleanup(() => cancelAnimationFrame(frame));
    }, { strategy: 'document-ready' });
    const select = $(async (files: readonly File[], reason: 'picker' | 'drop') => {
        if (props.disabled || !files.length || !alive.value) return;
        selections.value??=noSerialize([]);
        selections.value!.push({files,reason,generation:revision.value});
        if(selecting.value)return;
        selecting.value=true;const owner=++selectionOwner.value;
        try{while(owner===selectionOwner.value&&selections.value?.length){
        const entry=selections.value.shift()!;
        if(!alive.value||entry.generation!==revision.value||props.disabled)continue;
        const {files,reason}=entry;
        const rejected: FileValidationFailure[] = [], accepted: FileRecord[] = [];
        const filters = (props.accept ?? '').split(',').map(value => value.trim().toLowerCase()).filter(Boolean);
        const ids = new Set(props.files.map(record => record.id));
        for (const file of files) {
            // File identity is intentional: matching metadata on another File is still a new selection.
            if ((props.multiple || files.length === 1) && (props.files.some(record => record.file === file) || accepted.some(record => record.file === file))) continue;
            const match = !filters.length || filters.some(filter => filter.startsWith('.') ? file.name.toLowerCase().endsWith(filter) : filter.endsWith('/*') ? file.type.startsWith(filter.slice(0, -1)) : file.type === filter);
            const code = !props.multiple && files.length > 1 ? 'max-files' : !match ? 'accept' : props.maxBytes !== undefined && file.size > props.maxBytes ? 'max-bytes' : props.multiple && props.maxFiles !== undefined && props.files.length + accepted.length >= props.maxFiles ? 'max-files' : null;
            if (code) rejected.push({ file, code, message: code === 'accept' ? '허용하지 않는 파일 형식입니다.' : code === 'max-bytes' ? '파일 크기를 확인하세요.' : '파일 개수를 확인하세요.' });
            else {
                let id: string;
                do { id = `${uid}-${++serial.value}`; } while (ids.has(id));
                ids.add(id);
                accepted.push({ id, file, status: 'staged' });
            }
        }
        // An exact-object duplicate has no transient or committed effect.
        if (!rejected.length && !accepted.length) continue;
        errors.value = rejected.map(record => ({ name: record.file.name, message: record.message }));
        if (rejected.length) await props.onFilesRejected$?.({ rejected });
        if(!alive.value||entry.generation!==revision.value||props.disabled)continue;
        if (accepted.length) await props.onFilesChange$({ value: props.multiple ? [...props.files, ...accepted] : accepted, reason, addedIds: accepted.map(record => record.id), removedIds: props.multiple ? [] : props.files.map(record => record.id) });
        if(accepted.length)await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
        }}finally{if(owner===selectionOwner.value)selecting.value=false;}
    });
    // Snapshot browser-owned FileLists before a lazy QRL runs; fallback QRLs share exact-event delivery ownership.
    useVisibleTask$(({ cleanup }) => {
        alive.value=true;
        const element = root.value, chooser = input.value;
        if (!element || !chooser) return;
        const change = (event: Event) => {
            if (!firstDelivery(delivered, event)) return;
            const files = Array.from(chooser.files ?? []);
            chooser.value = '';
            void select(files, 'picker');
        };
        const drop = (event: DragEvent) => {
            event.preventDefault();
            if (!firstDelivery(delivered, event)) return;
            drag.value = false;
            if (props.variant === 'button') return;
            const files = Array.from(event.dataTransfer?.files ?? []);
            void select(files, 'drop');
        };
        chooser.addEventListener('change', change);
        element.addEventListener('drop', drop);
        cleanup(() => { alive.value=false;revision.value++;selectionOwner.value++;selecting.value=false;selections.value?.splice(0);chooser.removeEventListener('change', change); element.removeEventListener('drop', drop); });
    }, { strategy: 'document-ready' });
    return <div ref={root} {...owned('file-upload', 'root', props.disabled ? 'disabled' : drag.value ? 'drag-over' : '')} data-krds-variant={props.variant ?? 'dropzone'}>
        <h3 id={`${uid}-label`} {...owned('file-upload', 'label')}>{props.label}</h3>
        {props.description && <p id={`${uid}-description`} {...owned('file-upload', 'description')}>{props.description}</p>}
        <p id={`${uid}-help`} {...owned('file-upload', 'help')}>{props.accept ?? '모든 형식'}{props.maxBytes ? ` / 최대 ${props.maxBytes}바이트` : ''}{props.maxFiles ? ` / 최대 ${props.maxFiles}개` : ''}</p>
        <input ref={input} id={uid} {...owned('file-upload', 'file-input')} type="file" data-krds-name={props.name} tabIndex={-1} aria-hidden="true" multiple={props.multiple} accept={props.accept} disabled={props.disabled} onChange$={async (event, element) => {
            if (!firstDelivery(delivered, event)) return;
            const files = Array.from(element.files ?? []);
            element.value = '';
            await select(files, 'picker');
        }}/>
        <button type="button" {...owned('file-upload', 'picker')} id={`${uid}-picker`} aria-labelledby={`${uid}-picker ${uid}-label`} aria-describedby={`${props.description ? `${uid}-description ` : ''}${uid}-help${errors.value.length ? ` ${uid}-errors` : ''}`} disabled={props.disabled} onClick$={() => input.value?.click()}>파일 선택</button>
        {props.variant !== 'button' && <div {...owned('file-upload', 'dropzone')} preventdefault:dragover preventdefault:drop onDragOver$={() => { if (!props.disabled) drag.value = true; }} onDragLeave$={() => drag.value = false} onDrop$={async event => {
            if (!firstDelivery(delivered, event)) return;
            drag.value = false;
            await select(Array.from(event.dataTransfer?.files ?? []), 'drop');
        }}>파일을 끌어 놓거나 파일 선택을 이용하세요.</div>}
        <p {...owned('file-upload', 'count')}>{props.files.length}{props.maxFiles ? ` / ${props.maxFiles}` : ''}개</p>
        <ul {...owned('file-upload', 'list')}>{props.files.map(record => <li key={record.id} {...owned('file-upload', 'item', record.status)}>
            <span {...owned('file-upload', 'filename')}>{record.file?.name}</span><span {...owned('file-upload', 'size')}>{record.file?.size} 바이트</span>
            <span {...owned('file-upload', 'status')}>{{ staged: '선택됨', uploading: '업로드 중', success: '완료', error: '오류' }[record.status]}</span>
            {record.status === 'uploading' && <progress {...owned('file-upload', 'progress')} max={100} value={record.progress} aria-valuemin={0} aria-valuemax={100} aria-valuenow={record.progress} aria-label={`${record.file?.name} 진행률`}/>}
            {record.error && <p {...owned('file-upload', 'error')}>{record.error}</p>}
            <button type="button" {...owned('file-upload', 'remove')} data-file-id={record.id} aria-label={`${record.file?.name} 삭제`} disabled={props.disabled} onClick$={async (_, element) => {
                const id = element.dataset.fileId!, index = props.files.findIndex(file => file.id === id), version = revision.value;
                if (props.disabled || index < 0) return;
                removing.value = { id, index };
                await props.onFilesChange$({ value: props.files.filter(file => file.id !== id), reason: 'remove', addedIds: [], removedIds: [id] });
                await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
                if (version === revision.value && root.value?.isConnected && props.files.some(file => file.id === id)) removing.value = undefined;
            }}>삭제</button>
        </li>)}</ul>
        {errors.value.length > 0 && <div id={`${uid}-errors`}>{errors.value.map((error, index) => <p key={index} role="alert" {...owned('file-upload', 'error')}>{error.name}: {error.message}</p>)}</div>}
    </div>;
});
