import { html } from 'lit';
import { ValueState } from '../base.js';
import { FormElement, bounded } from '../catalog-support.js';
export class QuantityToggle extends FormElement {
    static formAssociated = true;
    static override properties = { value: { type: Number }, defaultValue: { type: Number, attribute: 'default-value' }, min: { type: Number }, max: { type: Number }, step: { type: Number }, unit: { type: String } };
    declare value: number | undefined;
    declare defaultValue: number | undefined;
    declare min: number;
    declare max: number;
    declare step: number;
    declare unit: string;
    private state = new ValueState<number>();
    constructor() { super(); this.min = 0; this.max = 10; this.step = 1; this.unit = ''; }
    get committedValue() { const value = this.state.read(this.value, this.defaultValue, () => this.min); bounded(value, this.min, this.max, this.step); if (Math.floor((this.max - this.min) / this.step) + 1 > 11)
        throw new RangeError('Quantity toggle supports at most eleven values'); return value; }
    resetControl() { this.state.reset(); this.requestUpdate(); }
    restoreControl(value: string | FormData | File | null) { if (typeof value === 'string') {
        this.state.set(Number(value));
        this.requestUpdate();
    } }
    override updated() { this.formControl.setValue(String(this.committedValue), String(this.committedValue)); this.formControl.internals?.setValidity({}); }
    private change(direction: number) { const value = Number((this.committedValue + this.step * direction).toPrecision(12)); if (this.formControl.disabled || value < this.min || value > this.max)
        return; this.state.set(value); this.emit('value-change', { value }); this.requestUpdate(); }
    override render() { this.validateName(); const value = this.committedValue; const state = [value === this.min ? 'at-minimum' : '', value === this.max ? 'at-maximum' : '', this.formControl.disabled ? 'disabled' : ''].filter(Boolean).join(' '); return html `<div data-krds-component="quantity-toggle" data-krds-part="root" data-krds-state=${state} part="root" role="group" aria-label=${this.explicitName ?? this.label}><span data-krds-component="quantity-toggle" data-krds-part="label" data-krds-state="" part="label">${this.label}</span><button data-krds-component="quantity-toggle" data-krds-part="decrement" data-krds-state=${state} part="decrement" type="button" aria-label=${`${this.label} 줄이기`} ?disabled=${this.formControl.disabled} aria-disabled=${this.formControl.disabled || value <= this.min} @click=${() => this.change(-1)}>−</button><output data-krds-component="quantity-toggle" data-krds-part="output" data-krds-state=${state} part="output" aria-live="polite">${value}${this.unit}</output><button data-krds-component="quantity-toggle" data-krds-part="increment" data-krds-state=${state} part="increment" type="button" aria-label=${`${this.label} 늘리기`} ?disabled=${this.formControl.disabled} aria-disabled=${this.formControl.disabled || value >= this.max} @click=${() => this.change(1)}>+</button></div>`; }
}
