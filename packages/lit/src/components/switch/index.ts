import { html, type PropertyValues } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ValueState } from '../base.js';
import { FormElement } from '../catalog-support.js';
export class Switch extends FormElement {
    static formAssociated = true;
    static override properties = { checked: { type: Boolean }, defaultChecked: { type: Boolean, attribute: 'default-checked' }, value: { type: String }, size: { type: String } };
    declare checked: boolean | undefined;
    declare defaultChecked: boolean | undefined;
    declare value: string;
    declare size: string;
    private state = new ValueState<boolean>();
    constructor() { super(); this.value = 'on'; this.size = 'medium'; }
    get committedChecked() { return this.state.read(this.checked, this.defaultChecked, () => false); }
    resetControl() { this.state.reset(); this.requestUpdate(); }
    restoreControl(value: string | FormData | File | null) { if (typeof value === 'string') {
        this.state.set(value === 'true');
        this.requestUpdate();
    } }
    override updated(_changed: PropertyValues) { const input = this.renderRoot.querySelector('input')!; input.checked = this.committedChecked; this.sync(input, this.committedChecked ? this.value : null, String(this.committedChecked)); }
    private change = (event: Event) => { const input = event.target as HTMLInputElement; if (!this.formControl.disabled && input.checked !== this.committedChecked) {
        const checked = input.checked;
        this.state.set(checked);
        this.emit('checked-change', { checked });
    } input.checked = this.committedChecked; this.requestUpdate(); };
    override render() {
        this.validateName();
        if (!['medium', 'large'].includes(this.size))
            throw new TypeError('Invalid switch size');
        const state = [this.committedChecked ? 'checked' : 'unchecked', this.formControl.disabled ? 'disabled' : ''].filter(Boolean).join(' ');
        return html `<div data-krds-component="switch" data-krds-part="root" data-krds-state=${state} part="root" data-krds-size=${this.size}><input data-krds-component="switch" data-krds-part="control" data-krds-state=${state} part="control" type="checkbox" value=${this.value} name=${this.name} role="switch" aria-checked=${this.committedChecked} ?checked=${this.committedChecked} ?disabled=${this.formControl.disabled} ?required=${this.required} aria-label=${ifDefined(this.explicitName)} aria-describedby=${ifDefined(this.descriptionIds)} aria-invalid=${ifDefined(this.invalid ? 'true' : undefined)} @change=${this.change} id="control"><label for="control" data-krds-component="switch" data-krds-part="label" data-krds-state="" part="label">${this.label}<span data-krds-component="switch" data-krds-part="track" data-krds-state=${state} part="track" aria-hidden="true"><span data-krds-component="switch" data-krds-part="handle" data-krds-state=${state} part="handle"></span></span></label>${this.hint ? html `<p id=${this.helpId || 'hint'} data-krds-component="switch" data-krds-part="help" data-krds-state="" part="help">${this.hint}</p>` : ''}${this.error ? html `<p id=${this.errorId || 'error'} >${this.error}</p>` : ''}</div>`;
    }
}
