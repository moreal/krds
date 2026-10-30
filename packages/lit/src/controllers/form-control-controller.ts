import type { ReactiveController, LitElement } from 'lit';
export interface FormControlHost extends LitElement {
    disabled: boolean;
    resetControl(): void;
    restoreControl(state: string | FormData | File | null): void;
    validateSubmission?(): boolean;
}
/** One ElementInternals entry is the sole successful control for each FACE host. */
export class FormControlController implements ReactiveController {
    readonly internals?: ElementInternals;
    fieldsetDisabled = false;
    private form: HTMLFormElement | null = null;
    constructor(readonly host: FormControlHost) {
        host.addController(this);
        this.internals = host.attachInternals?.();
        host.addEventListener('invalid', () => { if (!this.disabled)
            host.validateSubmission?.(); });
    }
    get disabled() { return this.host.disabled || this.fieldsetDisabled; }
    hostUpdated() {
        const form = this.internals?.form ?? null;
        if (this.form !== form) {
            this.detach();
            this.form = form;
            form?.addEventListener('submit', this.submit, true);
        }
    }
    hostDisconnected() { this.detach(); }
    private detach() { this.form?.removeEventListener('submit', this.submit, true); this.form = null; }
    private submit = (event: SubmitEvent) => {
        if (!this.disabled && this.host.validateSubmission && !this.host.validateSubmission())
            event.preventDefault();
    };
    setValue(value: string | FormData | File | null, state?: string) { this.internals?.setFormValue(this.disabled ? null : value, state); }
    setValidity(message: string, anchor?: HTMLElement) { this.internals?.setValidity(message ? { customError: true } : {}, message, anchor); }
    disabledCallback(disabled: boolean) { this.fieldsetDisabled = disabled; queueMicrotask(() => { if (this.host.isConnected && this.fieldsetDisabled === disabled) this.host.requestUpdate(); }); }
}
