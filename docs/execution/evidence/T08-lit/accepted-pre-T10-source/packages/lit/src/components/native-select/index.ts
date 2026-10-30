import { html, type PropertyValues } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import type { SelectOption } from '@unofficial-krds/contracts';
import { KrdsElement, ValueState, unique } from '../base.js';
import { FormControlController } from '../../controllers/form-control-controller.js';
export class NativeSelect extends KrdsElement {
    static formAssociated = true;
    static override properties = { options: { attribute: false }, value: { type: String }, defaultValue: { attribute: 'default-value' }, name: { type: String, reflect: true }, disabled: { type: Boolean, reflect: true }, required: { type: Boolean }, invalid: { type: Boolean }, hint: { type: String }, error: { type: String }, size: { type: String } };
    declare options: readonly SelectOption[];
    declare value: string | undefined;
    declare defaultValue: string | undefined;
    declare name: string;
    declare disabled: boolean;
    declare required: boolean;
    declare invalid: boolean;
    declare hint: string;
    declare error: string;
    declare size: string;
    readonly formControl = new FormControlController(this);
    private selection = new ValueState<string>();
    constructor() { super(); this.options = []; this.name = ''; this.disabled = false; this.required = false; this.invalid = false; this.hint = ''; this.error = ''; this.size = 'medium'; }
    get committedValue() { const value = this.selection.read(this.value, this.defaultValue, () => this.options.find(option => !option.disabled)?.value ?? ''); if (value && !this.options.some(option => option.value === value))
        throw new TypeError('Select value is absent from options'); return value; }
    resetControl() { this.selection.reset(); this.requestUpdate(); }
    restoreControl(state: string | FormData | File | null) { if (typeof state === 'string') {
        this.selection.set(state);
        this.requestUpdate();
    } }
    formResetCallback() { this.resetControl(); }
    formDisabledCallback(value: boolean) { this.formControl.disabledCallback(value); }
    formStateRestoreCallback(state: string | FormData | File | null) { this.restoreControl(state); }
    override updated(_changed: PropertyValues) {
        const select = this.renderRoot.querySelector('select')!;
        // Native value='' can select an empty option; no matching option means no selection.
        select.value = this.committedValue;
        this.formControl.setValue(select.selectedIndex < 0 ? null : this.committedValue, this.committedValue);
        this.formControl.internals?.setValidity(select.validity.valid ? {} : { valueMissing: select.validity.valueMissing }, select.validationMessage, select);
    }
    private change = (event: Event) => {
        const select = event.target as HTMLSelectElement;
        const next = select.value;
        if (!this.formControl.disabled && next !== this.committedValue) {
            this.selection.set(next);
            this.emit('value-change', { value: next });
        }
        this.requestUpdate();
        queueMicrotask(() => { select.value = this.committedValue; });
    };
    override render() {
        unique(this.options.map(option => option.value), true);
        if (!['small', 'medium', 'large'].includes(this.size))
            throw new TypeError('Invalid select size');
        if (!this.label && !this.explicitName)
            throw new TypeError('Select needs a label');
        const state = [this.formControl.disabled ? 'disabled' : '', this.invalid ? 'invalid' : ''].filter(Boolean).join(' ');
        return html `<div data-krds-component="native-select" data-krds-part="root" part="root" data-krds-state=${state} data-krds-size=${this.size}>
      ${this.label ? html `<label data-krds-component="native-select" data-krds-part="label" part="label" data-krds-state="" for="control">${this.label}</label>` : ''}
      <select data-krds-component="native-select" data-krds-part="control" part="control" data-krds-state=${state} id="control" data-krds-size=${this.size} .value=${live(this.committedValue)} ?disabled=${this.formControl.disabled} ?required=${this.required} aria-label=${ifDefined(this.explicitName)} aria-invalid=${ifDefined(this.invalid ? 'true' : undefined)} aria-describedby=${ifDefined([this.hint ? 'hint' : '', this.error ? 'error' : ''].filter(Boolean).join(' ') || undefined)} @change=${this.change}>${this.options.map(option => html `<option value=${option.value} ?selected=${option.value === this.committedValue} ?disabled=${option.disabled}>${option.label}</option>`)}</select>
      ${this.hint ? html `<p data-krds-component="native-select" data-krds-part="hint" part="hint" data-krds-state="" id="hint">${this.hint}</p>` : ''}${this.error ? html `<p data-krds-component="native-select" data-krds-part="error" part="error" data-krds-state="" id="error">${this.error}</p>` : ''}
    </div>`;
    }
}
