import { html, type PropertyValues } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ValueState } from '../base.js';
import { FormElement } from '../catalog-support.js';
export class Checkbox extends FormElement {
    static formAssociated = true;
    static override properties = { checked: { type: Boolean }, defaultChecked: { type: Boolean, attribute: 'default-checked' }, indeterminate: { type: Boolean }, value: { type: String }, appearance: { type: String }, size: { type: String } };
    declare checked: boolean | undefined;
    declare defaultChecked: boolean | undefined;
    declare indeterminate: boolean;
    declare value: string;
    declare appearance: string;
    declare size: string;
    private state = new ValueState<boolean>();
    constructor() { super(); this.indeterminate = false; this.value = 'on'; this.appearance = 'default'; this.size = 'medium'; }
    get committedChecked() { return this.state.read(this.checked, this.defaultChecked, () => false); }
    resetControl() { this.state.reset(); this.requestUpdate(); }
    restoreControl(value: string | FormData | File | null) { if (typeof value === 'string') {
        this.state.set(value === 'true');
        this.requestUpdate();
    } }
    override updated(_changed: PropertyValues) { const input = this.renderRoot.querySelector('input')!; input.checked = this.committedChecked; input.indeterminate = this.indeterminate; this.sync(input, this.committedChecked ? this.value : null, String(this.committedChecked)); }
    private change = (event: Event) => { const input = event.target as HTMLInputElement; if (!this.formControl.disabled && input.checked !== this.committedChecked) {
        const checked = input.checked;
        this.state.set(checked);
        this.emit('checked-change', { checked });
    } input.checked = this.committedChecked; input.indeterminate = this.indeterminate; this.requestUpdate(); };
    override render() {
        this.validateName();
        if (!['default', 'chip'].includes(this.appearance) || !['medium', 'large'].includes(this.size))
            throw new TypeError('Invalid checkbox appearance');
        const state = [this.indeterminate ? 'mixed' : this.committedChecked ? 'checked' : 'unchecked', this.formControl.disabled ? 'disabled' : '', this.invalid ? 'invalid' : ''].filter(Boolean).join(' ');
        return html `<div data-krds-component="checkbox" data-krds-part="root" data-krds-state=${state} part="root" data-krds-appearance=${this.appearance} data-krds-size=${this.size}><input data-krds-component="checkbox" data-krds-part="control" data-krds-state=${state} part="control" type="checkbox" value=${this.value} name=${this.name} ?checked=${this.committedChecked} .indeterminate=${this.indeterminate} ?disabled=${this.formControl.disabled} ?required=${this.required} aria-checked=${this.indeterminate ? 'mixed' : String(this.committedChecked)} aria-label=${ifDefined(this.explicitName)} aria-describedby=${ifDefined(this.descriptionIds)} aria-invalid=${ifDefined(this.invalid ? 'true' : undefined)} @change=${this.change} id="control"><label for="control" data-krds-component="checkbox" data-krds-part="label" data-krds-state="" part="label"><span data-krds-component="checkbox" data-krds-part="indicator" data-krds-state=${state} part="indicator" aria-hidden="true"></span>${this.label}</label>${this.hint ? html `<p id=${this.helpId || 'hint'} data-krds-component="checkbox" data-krds-part="help" data-krds-state="" part="help">${this.hint}</p>` : ''}${this.error ? html `<p id=${this.errorId || 'error'} data-krds-component="checkbox" data-krds-part="error" data-krds-state="" part="error">${this.error}</p>` : ''}</div>`;
    }
}
