import { composedParent, deepActive } from '../components/base.js';

type SavedDeclaration = { value: string; priority: string };
type ModalDocument = { overflowX: SavedDeclaration; overflowY: SavedDeclaration; active: HTMLDialogElement[] };
const documents = new WeakMap<Document, ModalDocument>();

/** One activation and scroll-lock owner for public Modal and native composition shells. */
export function activateModal(dialog: HTMLDialogElement): void {
    const document = dialog.ownerDocument;
    let state = documents.get(document);
    if (!state) {
        const style = document.body.style;
        state = { overflowX: { value: style.getPropertyValue('overflow-x'), priority: style.getPropertyPriority('overflow-x') }, overflowY: { value: style.getPropertyValue('overflow-y'), priority: style.getPropertyPriority('overflow-y') }, active: [] };
        documents.set(document, state);
    }
    if (state.active.includes(dialog)) return;
    state.active.push(dialog);
    document.body.style.overflow = 'hidden';
    try {
        if (dialog.open) dialog.close();
        dialog.showModal();
    } catch (error) {
        deactivateModal(dialog);
        throw error;
    }
}

export function deactivateModal(dialog: HTMLDialogElement): void {
    const document = dialog.ownerDocument;
    const state = documents.get(document);
    if (state) {
        const index = state.active.indexOf(dialog);
        if (index >= 0) state.active.splice(index, 1);
        if (!state.active.length) {
            const style = document.body.style;
            style.removeProperty('overflow');
            for (const [name, saved] of [['overflow-x', state.overflowX], ['overflow-y', state.overflowY]] as const) {
                if (saved.value) style.setProperty(name, saved.value, saved.priority);
                else style.removeProperty(name);
            }
            documents.delete(document);
        }
    }
    if (dialog.open) dialog.close();
}

export function topModal(document: Document): HTMLDialogElement | null {
    // Native focus also identifies an application-owned dialog outside this coordinator.
    for (let element = deepActive(document); element; element = composedParent(element)) {
        if (element instanceof HTMLDialogElement && element.isConnected && element.matches(':modal')) return element;
    }
    const active = documents.get(document)?.active ?? [];
    for (let index = active.length - 1; index >= 0; index--) {
        const dialog = active[index]!;
        if (dialog.isConnected && dialog.open && dialog.matches(':modal')) return dialog;
    }
    return null;
}
