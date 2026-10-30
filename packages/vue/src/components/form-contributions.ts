import { onMounted, onUnmounted, type Ref } from 'vue';

type Contribution = { element: Ref<HTMLInputElement | undefined>; read: () => readonly File[] };
const documents = new WeakMap<Document, { records: Set<Contribution>; handle: (event: Event) => void }>();

/** File entries have native control ownership distinct from all string entries,
 * including a same-name submitter. Snapshot every native file position once,
 * then replace only the managed chooser's File sequence in successful-control
 * order. No value equality, whole-name deletion, or scalar-control guessing. */
export function useFileFormContribution(element: Ref<HTMLInputElement | undefined>, read: () => readonly File[]) {
    const record = { element, read };
    let owner: Document | undefined;
    onMounted(() => {
        owner = element.value?.ownerDocument;
        if (!owner) return;
        let state = documents.get(owner);
        if (!state) {
            const records = new Set<Contribution>();
            const handle = (event: Event) => {
                if (!(event.target instanceof HTMLFormElement)) return;
                const form = event.target;
                const data = (event as FormDataEvent).formData;
                const original = Array.from(data.entries());
                const indices = new Map<string, number[]>();
                original.forEach(([name, value], index) => {
                    if (typeof value === 'string') return;
                    const list = indices.get(name) ?? [];
                    list.push(index);
                    indices.set(name, list);
                });
                const owned = new Map(Array.from(records).flatMap(item => item.element.value ? [[item.element.value, item] as const] : []));
                const cursors = new Map<string, number>();
                const edits: { index: number; count: number; values: readonly File[]; name: string }[] = [];
                for (const candidate of Array.from(form.elements)) {
                    if (!(candidate instanceof HTMLInputElement) || candidate.type !== 'file' || !candidate.name || candidate.matches(':disabled')) continue;
                    const size = Math.max(1, candidate.files?.length ?? 0);
                    const offset = cursors.get(candidate.name) ?? 0;
                    const contribution = owned.get(candidate);
                    if (contribution) {
                        const start = indices.get(candidate.name)?.[offset];
                        if (start !== undefined) edits.push({ index: start, count: size, values: contribution.read(), name: candidate.name });
                    }
                    cursors.set(candidate.name, offset + size);
                }
                if (!edits.length) return;
                for (const edit of edits.sort((a, b) => b.index - a.index)) {
                    original.splice(edit.index, edit.count, ...edit.values.map(value => [edit.name, value] as [string, FormDataEntryValue]));
                }
                for (const name of new Set(Array.from(data.keys()))) data.delete(name);
                for (const [name, value] of original) data.append(name, value);
            };
            state = { records, handle };
            documents.set(owner, state);
            owner.addEventListener('formdata', handle, true);
        }
        state.records.add(record);
    });
    onUnmounted(() => {
        if (!owner) return;
        const state = documents.get(owner);
        state?.records.delete(record);
        if (state && !state.records.size) {
            owner.removeEventListener('formdata', state.handle, true);
            documents.delete(owner);
        }
    });
}
