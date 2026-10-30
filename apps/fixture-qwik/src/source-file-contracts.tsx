import { $, component$, noSerialize, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import * as K from '@unofficial-krds/qwik';

/** Narrow public consumer: native File handles remain browser resources. */
export const SourceFileContracts = component$<{ caseId: string }>(props => {
    const files = useSignal<K.FileUploadProps['files']>([]);
    const other = useSignal<K.FileUploadProps['files']>([]);
    const calls = useSignal(0), rejected = useSignal(0), accept = useSignal(true);
    const ready = useSignal(false);
    const cancelReset = useSignal(false), history = useSignal('[]'), receipt = useSignal('');
    const form = useSignal<HTMLFormElement>();
    const change = $(async (detail: Parameters<K.FileUploadProps['onFilesChange$']>[0]) => {
        calls.value++;
        history.value = JSON.stringify([...JSON.parse(history.value), {
            reason: detail.reason, ids: detail.value.map(record => record.id),
            addedIds: detail.addedIds, removedIds: detail.removedIds,
        }]);
        if(props.caseId==='queued')await new Promise<void>(resolve=>setTimeout(resolve,120));
        if (accept.value) files.value = detail.value.map(record => ({ ...record, file: noSerialize(record.file)! }));
    });
    useVisibleTask$(({ cleanup }) => {
        const element = form.value;
        if (!element) return;
        const collect = (event: FormDataEvent) => {
            K.appendCommittedFiles(event.formData, 'shared', files.value);
            K.appendCommittedFiles(event.formData, 'shared', other.value);
        };
        element.addEventListener('formdata', collect);
        ready.value = true;
        cleanup(() => element.removeEventListener('formdata', collect));
    }, { strategy: 'document-ready' });
    return <main><h1>Native committed File contract</h1><form ref={form} id="file-contract-form"
        preventdefault:reset={cancelReset.value} preventdefault:submit
        onSubmit$={(_, element) => { receipt.value = JSON.stringify(new FormData(element).getAll('shared').map(value => typeof value === 'string' ? value : { name: value.name, size: value.size, type: value.type })); }}>
        <input name="shared" aria-label="Sibling field" defaultValue="sibling"/>
        <K.FileUpload label="Primary files" name="shared" files={files.value} multiple={props.caseId !== 'single'}
            accept=".txt" maxFiles={5} onFilesChange$={change} onFilesRejected$={() => rejected.value++}/>
        <K.FileUpload label="Other files" name="shared" files={other.value} multiple
            onFilesChange$={detail => { other.value = detail.value.map(record => ({ ...record, file: noSerialize(record.file)! })); }}/>
        <button type="submit">Submit files</button><button type="reset">Reset files</button>
    </form><button type="button" onClick$={() => accept.value = !accept.value}>Toggle acceptance</button>
    <button type="button" onClick$={() => cancelReset.value = !cancelReset.value}>Toggle canceled reset</button>
    <output id="file-ready">{ready.value ? 'ready' : 'mounting'}</output><output id="file-calls">{calls.value}</output><output id="file-rejected">{rejected.value}</output>
    <output id="file-history">{history.value}</output><output id="file-receipt">{receipt.value}</output></main>;
});
