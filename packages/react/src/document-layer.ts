interface LayerEntry {
    dialog: HTMLElement;
    portal: HTMLElement;
}
interface DocumentLayers {
    entries: LayerEntry[];
    priorInert: Map<HTMLElement, boolean>;
    overflow: string;
    priority: string;
    observer: MutationObserver;
}
const documents = new WeakMap<Document, DocumentLayers>();

function refreshIsolation(doc: Document, state: DocumentLayers) {
    for (const [node, inert] of state.priorInert) node.inert = inert;
    state.priorInert.clear();
    const top = state.entries.at(-1);
    if (!top) return;
    for (const child of Array.from(doc.body.children)) {
        if (!(child instanceof (doc.defaultView?.HTMLElement ?? HTMLElement)) || child === top.portal) continue;
        state.priorInert.set(child, child.inert);
        child.inert = true;
    }
}

/** One isolation/keyboard-order registry for public modals and native compositions. */
export function acquireDocumentLayer(doc: Document, dialog: HTMLElement, portal: HTMLElement) {
    let state = documents.get(doc);
    if (!state) {
        const owned: DocumentLayers = {
            entries: [],
            priorInert: new Map(),
            overflow: doc.body.style.getPropertyValue('overflow'),
            priority: doc.body.style.getPropertyPriority('overflow'),
            observer: new MutationObserver(() => refreshIsolation(doc, owned)),
        };
        state = owned;
        documents.set(doc, owned);
        owned.observer.observe(doc.body, { childList: true });
        doc.body.style.setProperty('overflow', 'hidden');
    }
    const owned = state;
    const entry = { dialog, portal };
    owned.entries.push(entry);
    refreshIsolation(doc, owned);
    return {
        top: () => owned.entries.at(-1) === entry,
        depth: owned.entries.length,
        release() {
            const index = owned.entries.indexOf(entry);
            if (index < 0) return;
            owned.entries.splice(index, 1);
            refreshIsolation(doc, owned);
            if (owned.entries.length) return;
            owned.observer.disconnect();
            if (owned.overflow) doc.body.style.setProperty('overflow', owned.overflow, owned.priority);
            else doc.body.style.removeProperty('overflow');
            documents.delete(doc);
        },
    };
}

// Offered from the modal's document bubble handler, after focused widgets have
// received their native/React key handlers and can claim Escape themselves.
const escapeOwners = new WeakMap<Document, Set<(event: KeyboardEvent) => void>>();
export function registerDocumentEscapeOwner(doc: Document, handle: (event: KeyboardEvent) => void) {
    let owners = escapeOwners.get(doc);
    if (!owners) {
        owners = new Set();
        escapeOwners.set(doc, owners);
    }
    owners.add(handle);
    return () => {
        owners.delete(handle);
        if (!owners.size) escapeOwners.delete(doc);
    };
}
export function offerDocumentEscape(doc: Document, event: KeyboardEvent) {
    if (event.key !== 'Escape' || event.defaultPrevented || event.isComposing || event.keyCode === 229) return;
    for (const handle of [...(escapeOwners.get(doc) ?? [])].reverse()) {
        handle(event);
        if (event.defaultPrevented) return;
    }
}
