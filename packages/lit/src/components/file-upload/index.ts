import { html, nothing } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { FileRecord, FileValidationFailure } from '@unofficial-krds/contracts';
import { unique } from '../base.js';
import { FormElement, usable } from '../catalog-support.js';
/** Controlled native File store: chooser state never becomes a second successful control. */
export class FileUpload extends FormElement {
    static formAssociated = true;
    static override properties = { files: { attribute: false }, multiple: { type: Boolean }, accept: { type: String }, maxFiles: { type: Number, attribute: 'max-files' }, maxBytes: { type: Number, attribute: 'max-bytes' }, dragOver: { state: true }, failures: { state: true } };
    declare files: readonly FileRecord[];
    declare multiple: boolean;
    declare accept: string;
    declare maxFiles: number | undefined;
    declare maxBytes: number | undefined;
    declare private dragOver: boolean;
    declare private failures: readonly FileValidationFailure[];
    private nextId = 0;
    private removeFocus: { id: string; previous: readonly string[]; next: readonly string[] } | null = null;
    constructor() { super(); this.files = []; this.multiple = false; this.accept = ''; this.dragOver = false; this.failures = []; }
    resetControl() { this.removeFocus = null; this.dragOver = false; this.failures = []; const input = this.renderRoot.querySelector('input'); if (input)
        input.value = ''; this.requestUpdate(); }
    restoreControl(_state: string | FormData | File | null) { }
    override updated() { const data = new FormData(); for (const record of this.files)
        if (this.name)
            data.append(this.name, record.file); this.formControl.setValue(data); this.formControl.internals?.setValidity({}); if (this.removeFocus && !this.files.some(file => file.id === this.removeFocus!.id)) {
        const candidates = [...this.removeFocus.previous, ...this.removeFocus.next].map(id => this.renderRoot.querySelector<HTMLButtonElement>(`button[data-remove="${CSS.escape(id)}"]`));
        const button = candidates.find(candidate => usable(candidate)) ?? this.renderRoot.querySelector<HTMLButtonElement>('[part="picker"]');
        if (usable(button)) button.focus();
        this.removeFocus = null;
    } }
    private acceptFile(file: File) { const tokens = this.accept.split(',').map(token => token.trim().toLowerCase()).filter(Boolean); if (!tokens.length)
        return true; return tokens.some(token => token.startsWith('.') ? file.name.toLowerCase().endsWith(token) : token.endsWith('/*') ? file.type.toLowerCase().startsWith(token.slice(0, -1)) : file.type.toLowerCase() === token); }
    private add(candidates: readonly File[], reason: 'picker' | 'drop') {
        if (this.formControl.disabled || !candidates.length)
            return;
        const rejected: FileValidationFailure[] = [];
        const limit = this.multiple ? this.maxFiles ?? Infinity : 1;
        // A single-file drop containing several files is wholly rejected, preserving the existing file.
        if (!this.multiple && candidates.length > 1)
            rejected.push(...candidates.map(file => ({ file, code: 'max-files' as const, message: '파일 한 개만 선택하세요' })));
        const accepted: FileRecord[] = [];
        const usedIds = new Set(this.files.map(record => record.id));
        const seenFiles = new Set(this.files.map(record => record.file));
        if (!rejected.length)
            for (const file of candidates) {
                if (seenFiles.has(file)) continue;
                if (!this.acceptFile(file))
                    rejected.push({ file, code: 'accept', message: `${file.name}: 허용된 파일 형식이 아닙니다` });
                else if (this.maxBytes !== undefined && file.size > this.maxBytes)
                    rejected.push({ file, code: 'max-bytes', message: `${file.name}: 파일 크기를 초과했습니다` });
                else if ((this.multiple ? this.files.length : 0) + accepted.length >= limit)
                    rejected.push({ file, code: 'max-files', message: `${file.name}: 파일 개수를 초과했습니다` });
                else {
                    let id: string;
                    do { id = `file-${++this.nextId}`; } while (usedIds.has(id));
                    usedIds.add(id); seenFiles.add(file);
                    accepted.push({ id, file, status: 'staged' });
                }
            }
        this.failures = rejected;
        if (rejected.length)
            this.emit('files-rejected', { rejected });
        if (accepted.length)
            this.emit('files-change', { value: this.multiple ? [...this.files, ...accepted] : accepted, reason, addedIds: accepted.map(file => file.id), removedIds: this.multiple ? [] : this.files.map(file => file.id) });
        this.requestUpdate();
    }
    private picker = (event: Event) => { const input = event.target as HTMLInputElement; this.add([...input.files ?? []], 'picker'); input.value = ''; };
    private removeFile(id: string) { if (this.formControl.disabled || !this.files.some(file => file.id === id))
        return; const index = this.files.findIndex(file => file.id === id); this.removeFocus = { id, previous: this.files.slice(0, index).map(file => file.id).reverse(), next: this.files.slice(index + 1).map(file => file.id) }; this.emit('files-change', { value: this.files.filter(file => file.id !== id), reason: 'remove', addedIds: [], removedIds: [id] }); this.requestUpdate(); }
    override render() {
        this.validateName();
        unique(this.files.map(file => file.id)); if (this.files.some(record => Object.prototype.toString.call(record.file) !== '[object File]' || !['staged', 'uploading', 'success', 'error'].includes(record.status) || record.progress !== undefined && (!Number.isFinite(record.progress) || record.progress < 0 || record.progress > 100))) throw new TypeError('File records require actual native Files and valid status/progress');
        if (!this.multiple && this.files.length > 1 || this.maxFiles !== undefined && (!Number.isInteger(this.maxFiles) || this.maxFiles < 1) || this.maxBytes !== undefined && (!Number.isFinite(this.maxBytes) || this.maxBytes < 0))
            throw new RangeError('Invalid file constraints');
        const explicit = this.explicitName;
        const state = [this.formControl.disabled ? 'disabled' : '', this.dragOver ? 'drag-over' : ''].filter(Boolean).join(' ');
        return html `<div data-krds-component="file-upload" data-krds-part="root" data-krds-state=${state} part="root" data-krds-variant="dropzone" role="group" aria-labelledby=${explicit === undefined ? 'label' : nothing} aria-label=${explicit === undefined ? nothing : explicit}><p id="label" data-krds-component="file-upload" data-krds-part="label" data-krds-state="" part="label">${this.label}</p><p id="help" data-krds-component="file-upload" data-krds-part="help" data-krds-state="" part="help">${this.accept ? `파일 형식: ${this.accept}. ` : ''}${this.maxBytes ? `최대 ${this.maxBytes} 바이트. ` : ''}${this.maxFiles ? `최대 ${this.maxFiles}개. ` : ''}제출하기 전에는 전송하지 않습니다.</p><input data-krds-component="file-upload" data-krds-part="file-input" data-krds-state="" part="file-input" id="file" type="file" tabindex="-1" aria-hidden="true" ?multiple=${this.multiple} accept=${this.accept} ?disabled=${this.formControl.disabled} @change=${this.picker}><button data-krds-component="file-upload" data-krds-part="picker" data-krds-state="" part="picker" id="picker" aria-describedby=${this.failures.length ? 'help errors' : 'help'} type="button" ?disabled=${this.formControl.disabled} @click=${() => this.renderRoot.querySelector('input')?.click()}>파일 선택</button><div data-krds-component="file-upload" data-krds-part="dropzone" data-krds-state="" part="dropzone" @dragover=${(event: DragEvent) => { if (!this.formControl.disabled) {
            event.preventDefault();
            this.dragOver = true;
        } }} @dragleave=${() => { this.dragOver = false; }} @drop=${(event: DragEvent) => { event.preventDefault(); this.dragOver = false; this.add([...event.dataTransfer?.files ?? []], 'drop'); }}>파일을 끌어 놓거나 파일 선택을 이용하세요.</div><p data-krds-component="file-upload" data-krds-part="count" data-krds-state="" part="count">${this.files.length}개 파일</p><ul data-krds-component="file-upload" data-krds-part="list" data-krds-state="" part="list">${repeat(this.files, file => file.id, record => html `<li data-krds-component="file-upload" data-krds-part="item" data-krds-state=${record.status} part="item"><span data-krds-component="file-upload" data-krds-part="filename" data-krds-state="" part="filename" id=${record.id}>${record.file.name}</span><span data-krds-component="file-upload" data-krds-part="size" data-krds-state="" part="size">(${record.file.size} B)</span><span data-krds-component="file-upload" data-krds-part="status" data-krds-state="" part="status">${({ staged: '제출 대기', uploading: '전송 중', success: '완료', error: '오류' })[record.status]}</span>${record.status === 'uploading' ? html `<progress data-krds-component="file-upload" data-krds-part="progress" data-krds-state="" part="progress" aria-label=${`${record.file.name} 진행률`} max="100" value=${ifDefined(record.progress)} aria-valuemin="0" aria-valuemax="100" aria-valuenow=${ifDefined(record.progress)}></progress>` : ''}${record.error ? html `<p data-krds-component="file-upload" data-krds-part="error" data-krds-state="" part="error">${record.error}</p>` : ''}<button data-krds-component="file-upload" data-krds-part="remove" data-krds-state="" part="remove" type="button" data-remove=${record.id} aria-describedby=${record.id} aria-label=${`${record.file.name} 삭제`} ?disabled=${this.formControl.disabled} @click=${() => this.removeFile(record.id)}>삭제</button></li>`)}</ul>${this.failures.length ? html `<div id="errors">${this.failures.map(failure => html `<p role="alert" data-krds-component="file-upload" data-krds-part="error" data-krds-state="" part="error">${failure.message}</p>`)}</div>` : ''}</div>`;
    }
}
