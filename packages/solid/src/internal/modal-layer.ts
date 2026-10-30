interface ModalEntry {
    root: HTMLElement;
    content: HTMLElement;
}
interface ModalDocument {
    entries: ModalEntry[];
    inert: Map<HTMLElement, string | null>;
    overflow: string;
    priority: string;
    observer?: MutationObserver;
}
const documents = new WeakMap<Document, ModalDocument>();
function refreshIsolation(doc: Document, state: ModalDocument) {
    for (const [element, attribute] of state.inert) {
        if (attribute === null)
            element.removeAttribute('inert');
        else
            element.setAttribute('inert', attribute);
    }
    state.inert.clear();
    let branch: HTMLElement | null = state.entries.at(-1)?.root ?? null;
    while (branch?.parentElement) {
        for (const sibling of branch.parentElement.children) {
            if (sibling === branch || !(sibling instanceof (doc.defaultView?.HTMLElement ?? HTMLElement)))
                continue;
            const element = sibling as HTMLElement;
            state.inert.set(element, element.getAttribute('inert'));
            element.inert = true;
        }
        if (branch.parentElement === doc.body)
            break;
        branch = branch.parentElement;
    }
}
export function registerModalLayer(doc: Document, entry: ModalEntry) {
    let state = documents.get(doc);
    if (!state) {
        state = { entries: [], inert: new Map(), overflow: '', priority: '' };
        documents.set(doc, state);
    }
    if (!state.entries.length) {
        state.overflow = doc.body.style.getPropertyValue('overflow');
        state.priority = doc.body.style.getPropertyPriority('overflow');
        doc.body.style.setProperty('overflow', 'hidden');
        state.observer = new MutationObserver(() => refreshIsolation(doc, state!));
        state.observer.observe(doc.body, { childList: true, subtree: true });
    }
    state.entries.push(entry);
    entry.root.style.zIndex = String(1000 + state.entries.length);
    refreshIsolation(doc, state);
    return {
        top: () => state!.entries.at(-1) === entry,
        release: () => {
            const index = state!.entries.indexOf(entry);
            if (index < 0)
                return;
            state!.entries.splice(index, 1);
            refreshIsolation(doc, state!);
            if (!state!.entries.length) {
                state!.observer?.disconnect();
                if (state!.overflow)
                    doc.body.style.setProperty('overflow', state!.overflow, state!.priority);
                else
                    doc.body.style.removeProperty('overflow');
            }
        },
    };
}

export function activeModalContent(doc:Document){return documents.get(doc)?.entries.at(-1)?.content;}
