import { html, type PropertyValues } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { RadioGroupOption } from '@unofficial-krds/contracts';
import { ValueState, unique } from '../base.js';
import { FormElement } from '../catalog-support.js';
export class RadioGroup extends FormElement {
    static formAssociated = true;
    static override properties = { options: { attribute: false }, value: { attribute: false }, defaultValue: { attribute: false }, size: { type: String }, appearance: { type: String } };
    declare options: readonly RadioGroupOption[];
    declare value: string | null | undefined;
    declare defaultValue: string | null | undefined;
    declare size: string;
    declare appearance: string;
    private state = new ValueState<string | null>();
    constructor() { super(); this.options = []; this.size = 'medium'; this.appearance = 'default'; }
    get committedValue() { const value = this.state.read(this.value, this.defaultValue, () => null); if (value !== null && !this.options.some(option => option.value === value))
        throw new TypeError('Unknown radio value'); return value; }
    resetControl() { this.state.reset(); this.requestUpdate(); }
    restoreControl(value: string | FormData | File | null) { if (typeof value === 'string') {
        this.state.set(JSON.parse(value));
        this.requestUpdate();
    } }
    override updated(_changed: PropertyValues) { const radios = [...this.renderRoot.querySelectorAll('input')]; for (let i = 0; i < radios.length; i++)
        radios[i]!.checked = this.options[i]!.value === this.committedValue; const first = radios.find(radio => !radio.disabled); this.formControl.setValue(this.committedValue, JSON.stringify(this.committedValue)); this.formControl.internals?.setValidity(this.required && this.committedValue === null ? { valueMissing: true } : {}, this.required && this.committedValue === null ? '선택하세요' : '', first); const group = this.renderRoot.querySelector('fieldset'); if (group)
        this.applyExplicitNaming(group); }
    private choose(value: string) { if (this.formControl.disabled || this.options.find(option => option.value === value)?.disabled || value === this.committedValue)
        return; this.state.set(value); this.emit('value-change', { value }); this.requestUpdate(); }
    private key = (event: KeyboardEvent, index: number) => { if (event.key === 'Tab') {
        const enabled = this.options.map((option, index) => option.disabled ? -1 : index).filter(index => index >= 0);
        const next = enabled[enabled.indexOf(index) + (event.shiftKey ? -1 : 1)];
        if (next !== undefined) {
            event.preventDefault();
            (this.renderRoot.querySelectorAll('input')[next] as HTMLInputElement).focus();
        }
        return;
    } if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key))
        return; event.preventDefault(); const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1; for (let offset = 1; offset <= this.options.length; offset++) {
        const next = (index + direction * offset + this.options.length) % this.options.length;
        if (!this.options[next]!.disabled) {
            this.choose(this.options[next]!.value);
            (this.renderRoot.querySelectorAll('input')[next] as HTMLInputElement).focus();
            return;
        }
    } };
    override render() {
        this.validateName();
        unique(this.options.map(option => option.value), true);
        unique(this.options.filter(option => option.id !== undefined).map(option => option.id!));
        if (!['medium', 'large'].includes(this.size) || !['default', 'chip'].includes(this.appearance))
            throw new TypeError('Invalid radio appearance');
        const state = [this.formControl.disabled ? 'disabled' : '', this.invalid ? 'invalid' : ''].filter(Boolean).join(' ');
        return html `<fieldset data-krds-component="radio-group" data-krds-part="root" data-krds-state=${state} part="root" ?disabled=${this.formControl.disabled} aria-label=${ifDefined(this.explicitName)} aria-describedby=${ifDefined(this.descriptionIds)} aria-invalid=${ifDefined(this.invalid ? 'true' : undefined)} data-krds-size=${this.size} data-krds-appearance=${this.appearance}><legend data-krds-component="radio-group" data-krds-part="legend" data-krds-state="" part="legend">${this.label}</legend>${this.options.map((option, index) => html `<label data-krds-component="radio-group" data-krds-part="item" data-krds-state=${`${option.value === this.committedValue ? 'checked' : 'unchecked'} ${option.disabled ? 'disabled' : ''}`} part="item"><input data-krds-component="radio-group" data-krds-part="control" data-krds-state=${option.value === this.committedValue ? 'checked' : 'unchecked'} part="control" id=${ifDefined(option.id)} type="radio" name=${this.name || 'choice'} value=${option.value} ?checked=${option.value === this.committedValue} ?disabled=${this.formControl.disabled || option.disabled} ?required=${this.required} tabindex="0" @keydown=${(event: KeyboardEvent) => this.key(event, index)} @change=${() => { this.choose(option.value); this.requestUpdate(); }}><span data-krds-component="radio-group" data-krds-part="label" data-krds-state="" part="label">${option.label}</span></label>`)}${this.hint ? html `<p id=${this.helpId || 'hint'} data-krds-component="radio-group" data-krds-part="help" data-krds-state="" part="help">${this.hint}</p>` : ''}${this.error ? html `<p id=${this.errorId || 'error'} data-krds-component="radio-group" data-krds-part="error" data-krds-state="" part="error">${this.error}</p>` : ''}</fieldset>`;
    }
}
