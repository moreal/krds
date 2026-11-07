import { html, type PropertyValues } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { KrdsElement } from '../base.js';
import { FormControlController } from '../../controllers/form-control-controller.js';
/** Native Shadow DOM button; bridges activation to the host's external form. */
export class Button extends KrdsElement {
    static formAssociated = true;
    static override properties = { type: { type: String }, disabled: { type: Boolean, reflect: true }, name: { type: String, reflect: true }, value: { type: String }, variant: { type: String }, size: { type: String } };
    declare type: 'button' | 'submit' | 'reset';
    declare disabled: boolean;
    declare name: string;
    declare value: string;
    declare variant: string;
    declare size: string;
    readonly formControl = new FormControlController(this);
    static override readonly forwardedAria = ['aria-describedby', 'aria-controls', 'aria-expanded', 'aria-haspopup', 'aria-pressed', 'aria-current'];
    constructor() { super(); this.type = 'button'; this.disabled = false; this.name = ''; this.value = ''; this.variant = 'primary'; this.size = 'medium'; }
    get form() { return this.formControl.internals?.form ?? null; }
    resetControl() { }
    restoreControl() { }
    formDisabledCallback(value: boolean) { this.formControl.disabledCallback(value); }
    formResetCallback() { }
    formStateRestoreCallback() { }
    private activate = (event: MouseEvent) => {
        queueMicrotask(() => {
            if (event.defaultPrevented || this.formControl.disabled || !this.form)
                return;
            if (this.type === 'reset')
                this.form.reset();
            if (this.type === 'submit') {
                // requestSubmit requires a real submitter belonging to the external form.
                const submitter = this.ownerDocument.createElement('button');
                submitter.type = 'submit';
                submitter.name = this.name;
                submitter.value = this.value;
                submitter.hidden = true;
                this.form.append(submitter);
                try {
                    this.form.requestSubmit(submitter);
                }
                finally {
                    submitter.remove();
                }
            }
        });
    };
    protected override updated(changed: PropertyValues) {
        super.updated(changed);
        const control = this.renderRoot.querySelector('button');
        if (control) { this.forwardHostAria(control); this.applyExplicitNaming(control); }
    }
    override render() {
        if (!['button', 'submit', 'reset'].includes(this.type) || !['primary', 'secondary', 'tertiary', 'text', 'icon'].includes(this.variant) || !['xsmall', 'small', 'medium', 'large', 'xlarge'].includes(this.size))
            throw new TypeError('Invalid Button option');
        return html `<button data-krds-component="button" data-krds-part="root" part="root" data-krds-state=${this.formControl.disabled ? 'disabled' : ''} type=${this.type} ?disabled=${this.formControl.disabled} data-krds-variant=${this.variant} data-krds-size=${this.size} aria-label=${ifDefined(this.explicitName)} @click=${this.activate}><span data-krds-component="button" data-krds-part="label" part="label" data-krds-state=""><slot></slot></span></button>`;
    }
}
