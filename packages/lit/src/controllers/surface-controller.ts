import type { ReactiveController, LitElement } from 'lit';
import { deepActive, shadowFocusables, composedParent, trapComposedTab } from '../components/base.js';
import { usable, focusTarget } from '../components/catalog-support.js';
import { activateModal, deactivateModal, topModal } from './modal-lifecycle.js';
export function restoreModalAware(host: LitElement, candidates: readonly (HTMLElement | null)[]) {
    const modal = topModal(host.ownerDocument);
    const inside = (element: HTMLElement) => { let current: Element | null = element; while (current) {
        if (current === modal)
            return true;
        current = composedParent(current);
    } return false; };
    for (const candidate of candidates)
        if (usable(candidate) && (!modal || inside(candidate))) {
            focusTarget(candidate);
            return;
        }
    if (modal) {
        (shadowFocusables(modal)[0] ?? modal).focus();
        return;
    }
    focusTarget(host.ownerDocument.body);
}
/** Native dialog isolation/trap lifecycle shared by native compositions, never a renderer. */
export class SurfaceController implements ReactiveController {
    private dialog: HTMLDialogElement | null = null;
    private active = false;
    private modal = false;
    private opener: HTMLElement | null = null;
    private closeFallback: (() => HTMLElement | null) | undefined;
    constructor(private host: LitElement, private options: {
        open: () => boolean;
        modal: () => boolean;
        onClose: () => void;
        preferredReturn?: () => HTMLElement | null;
        fallback?: () => HTMLElement | null; initialFocus?: () => HTMLElement | null | undefined; suppressEntryFocus?: () => boolean;
    }) { host.addController(this); }
    hostUpdated() {
        const dialog = this.host.renderRoot.querySelector('dialog');
        const open = this.options.open();
        const modal = this.options.modal();
        if (this.active && (!open || dialog !== this.dialog || modal !== this.modal))
            this.close(!open);
        this.dialog = dialog;
        if (open && dialog && !this.active) {
            this.opener = deepActive(this.host.ownerDocument) as HTMLElement | null;
            this.modal = modal;
            this.active = true;
            const preferred = this.options.preferredReturn?.();
            if (modal && !this.options.suppressEntryFocus?.() && usable(preferred ?? null))
                preferred!.focus();
            dialog.addEventListener('cancel', this.cancel);
            dialog.addEventListener('keydown', this.key);
            if (dialog.open)
                dialog.close();
            if (modal) {
                activateModal(dialog);
            }
            else
                dialog.show();
            if (modal && !this.options.suppressEntryFocus?.()) {
                try {
                    const requested = this.options.initialFocus?.();
                    const initial = requested === undefined ? dialog : requested;
                    if (!initial || initial !== dialog && initial !== shadowFocusables(dialog)[0]) throw new TypeError('initialFocusId must identify the dialog or its first interactive element');
                    initial.focus();
                } catch (error) {
                    this.close(false);
                    throw error;
                }
            }
        }
    }
    private cancel = (event: Event) => { event.preventDefault(); if (!this.modal || this.dialog === topModal(this.host.ownerDocument)) this.options.onClose(); };
    private key = (event: KeyboardEvent) => {
        if (event.defaultPrevented || event.isComposing || event.keyCode === 229 || this.modal && this.dialog !== topModal(this.host.ownerDocument))
            return;
        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            this.options.onClose();
        }
        if (event.key === 'Tab' && this.modal && this.dialog) trapComposedTab(event, this.host.ownerDocument, this.dialog);
    };
    private close(restore: boolean) {
        this.dialog?.removeEventListener('cancel', this.cancel);
        this.dialog?.removeEventListener('keydown', this.key);
        if (this.dialog) {
            if (this.modal) deactivateModal(this.dialog);
            else this.dialog.close();
        }
        this.active = false;
        if (restore) restoreModalAware(this.host, [this.options.preferredReturn?.() ?? null, this.options.fallback?.() ?? null, this.opener]);
        this.opener = null;
    }
    hostDisconnected() { if (this.active)
        this.close(true); }
}
